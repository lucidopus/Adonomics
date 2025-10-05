import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import clientPromise from '@/lib/mongodb/client'
import { AdvertisementModel, Advertisement } from '@/lib/mongodb/models/Advertisement'
import { analyzeAdvertisement } from '@/lib/ai-agent'
import { isVideoReadyForAnalysis } from '@/lib/twelve-labs'

interface AnalyzeAdvertisementRequest {
  advertisementId: string
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeAdvertisementRequest = await request.json()
    const { advertisementId } = body

    if (!advertisementId) {
      return NextResponse.json(
        { error: 'Advertisement ID is required' },
        { status: 400 }
      )
    }

    // Get advertisement from database
    const mongoClient = await clientPromise
    const db = mongoClient.db()

    const advertisement = await db
      .collection(AdvertisementModel.collectionName)
      .findOne({ _id: new ObjectId(advertisementId) }) as Advertisement | null

    if (!advertisement) {
      return NextResponse.json(
        { error: 'Advertisement not found' },
        { status: 404 }
      )
    }

    // Check if already analyzed
    if (advertisement.status === 'analyzed') {
      return NextResponse.json(
        { error: 'Advertisement already analyzed' },
        { status: 400 }
      )
    }

    if (!advertisement.twelve_labs_video_id) {
      return NextResponse.json(
        { error: 'Advertisement video ID not found' },
        { status: 400 }
      )
    }

    // Update status to analyzing
    await db
      .collection(AdvertisementModel.collectionName)
      .updateOne(
        { _id: new ObjectId(advertisementId) },
        {
          $set: AdvertisementModel.updateStatus(advertisement, 'analyzing')
        }
      )

    try {
      // Check if video is ready for analysis
      console.log('🔍 Checking if video is ready for analysis...')
      const isReady = await isVideoReadyForAnalysis(advertisement.twelve_labs_video_id)

      if (!isReady) {
        // Update status back to upload with indexing message
        await db
          .collection(AdvertisementModel.collectionName)
          .updateOne(
            { _id: new ObjectId(advertisementId) },
            {
              $set: AdvertisementModel.updateStatus(advertisement, 'upload', undefined, 'Video is still being indexed by Twelve Labs. Please wait 5-15 minutes before analyzing.')
            }
          )

        return NextResponse.json(
          {
            error: 'Video is still being indexed',
            message: 'Your video is still being processed by Twelve Labs. Please wait 5-15 minutes for indexing to complete before running analysis.',
            retryAfter: 900 // 15 minutes in seconds
          },
          { status: 202 } // Accepted but not processed
        )
      }

      // Execute the analysis pipeline
      const analysisResults = await analyzeAdvertisement(
        advertisement.twelve_labs_video_id,
        advertisement.user_id.toString()
      )

      // Update advertisement with analysis results
      const updatedAd = AdvertisementModel.addAnalysisResults(
        advertisement,
        'video_analysis',
        analysisResults.video_analysis
      )

      const withUserProfile = AdvertisementModel.addAnalysisResults(
        updatedAd,
        'user_profile',
        analysisResults.user_profile
      )

      const withCompetitive = AdvertisementModel.addAnalysisResults(
        withUserProfile,
        'competitive_search',
        analysisResults.competitive_search
      )

      const withSynthesis = AdvertisementModel.addAnalysisResults(
        withCompetitive,
        'synthesis',
        analysisResults.synthesis
      )

      // Update status to analyzed
      const finalAd = AdvertisementModel.updateStatus(withSynthesis, 'analyzed')

      // Save to database
      await db
        .collection(AdvertisementModel.collectionName)
        .updateOne(
          { _id: new ObjectId(advertisementId) },
          { $set: finalAd }
        )

       console.log('✅ Analysis completed successfully, returning results:', {
         hasAnalysis: !!analysisResults,
         hasSynthesis: !!analysisResults.synthesis,
         hasReport: !!analysisResults.synthesis?.report,
         synthesisKeys: analysisResults.synthesis ? Object.keys(analysisResults.synthesis) : []
       })

       return NextResponse.json({
         success: true,
         advertisementId,
         analysis: analysisResults
       })

    } catch (analysisError: any) {
      console.error('❌ Analysis error:', analysisError)
      console.error('🔍 Error details:', {
        message: analysisError.message,
        stack: analysisError.stack,
        name: analysisError.name
      })

      let errorMessage = 'Analysis failed'
      let statusCode = 500

      // Handle specific video indexing error
      if (analysisError.message?.includes('still being processed') ||
          analysisError.message?.includes('still being indexed')) {
        errorMessage = 'Video is still being indexed by Twelve Labs. Please wait 5-15 minutes before analyzing.'
        statusCode = 202 // Accepted but not processed
      }

      // Update status appropriately
      const statusUpdate = statusCode === 202 ? 'upload' : 'upload'
      await db
        .collection(AdvertisementModel.collectionName)
        .updateOne(
          { _id: new ObjectId(advertisementId) },
          {
            $set: AdvertisementModel.updateStatus(advertisement, statusUpdate, undefined, errorMessage)
          }
        )

      return NextResponse.json(
        {
          error: errorMessage,
          ...(statusCode === 202 && { retryAfter: 900 }) // 15 minutes
        },
        { status: statusCode }
      )
    }

  } catch (error) {
    console.error('❌ Error analyzing advertisement:', error)
    console.error('🔍 Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      name: error instanceof Error ? error.name : 'Unknown'
    })
    return NextResponse.json(
      { error: 'Failed to analyze advertisement', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}