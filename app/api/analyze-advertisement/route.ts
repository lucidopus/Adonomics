import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import clientPromise from '@/lib/mongodb/client'
import { AdvertisementModel, Advertisement } from '@/lib/mongodb/models/Advertisement'
import { analyzeAdvertisement } from '@/lib/ai-agent'

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

      return NextResponse.json({
        success: true,
        advertisementId,
        analysis: analysisResults
      })

    } catch (analysisError) {
      console.error('Analysis error:', analysisError)

      // Update status to failed
      await db
        .collection(AdvertisementModel.collectionName)
        .updateOne(
          { _id: new ObjectId(advertisementId) },
          {
            $set: AdvertisementModel.updateStatus(advertisement, 'upload', undefined, 'Analysis failed')
          }
        )

      return NextResponse.json(
        { error: 'Analysis failed' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error analyzing advertisement:', error)
    return NextResponse.json(
      { error: 'Failed to analyze advertisement' },
      { status: 500 }
    )
  }
}