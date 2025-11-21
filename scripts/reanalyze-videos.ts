/**
 * Script to re-analyze existing videos with enhanced synthesis prompt
 *
 * Usage: npx tsx scripts/reanalyze-videos.ts
 */

// MUST load env vars BEFORE any imports that use them
import { config } from 'dotenv'
config({ path: '.env.local' })

import { MongoClient } from 'mongodb'
import { analyzeAdvertisement } from '../lib/ai-agent'

async function reanalyzeVideos() {
  let client: MongoClient | null = null

  try {
    console.log('🔄 Starting re-analysis of existing videos...\n')

    // Validate required env vars
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not set in environment variables')
    }

    // Connect to MongoDB directly
    console.log('📦 Connecting to MongoDB...')
    client = new MongoClient(process.env.MONGODB_URI)
    await client.connect()
    console.log('✅ Connected to MongoDB\n')

    const db = client.db('adonomics') // Use actual database name where ads are stored
    const adsCollection = db.collection('advertisements')

    // Find analyzed videos
    const analyzedVideos = await adsCollection
      .find({ status: 'analyzed' })
      .sort({ created_at: -1 })
      .toArray()

    console.log(`✅ Found ${analyzedVideos.length} analyzed videos\n`)

    if (analyzedVideos.length === 0) {
      console.log('ℹ️  No videos to re-analyze')
      return
    }

    // Re-analyze each video
    for (const video of analyzedVideos) {
      console.log(`\n${'='.repeat(60)}`)
      console.log(`📹 Re-analyzing: ${video.video_filename}`)
      console.log(`   Video ID: ${video.twelve_labs_video_id}`)
      console.log(`   User ID: ${video.user_id}`)
      console.log('='.repeat(60))

      try {
        // Re-run the analysis pipeline with new enhanced prompt
        console.log('\n🔄 Running enhanced analysis...')
        const analysisResults = await analyzeAdvertisement(
          video.twelve_labs_video_id,
          video.user_id.toString()
        )

        // Update MongoDB with new synthesis
        console.log('💾 Updating database with enhanced analysis...')
        await adsCollection.updateOne(
          { _id: video._id },
          {
            $set: {
              'analysis_results.synthesis': analysisResults.synthesis,
              'analysis_results.user_profile': analysisResults.user_profile,
              'analysis_results.competitive_search': analysisResults.competitive_search,
              updated_at: new Date()
            }
          }
        )

        console.log('✅ Successfully updated:', video.video_filename)

        // Show preview of new data
        if (analysisResults.synthesis?.report?.success_prediction?.predicted_metrics) {
          const metrics = analysisResults.synthesis.report.success_prediction.predicted_metrics
          console.log('\n📊 Predicted Metrics:')
          console.log(`   Grade: ${metrics.grade || 'N/A'}`)
          console.log(`   CTR: ${metrics.ctr?.toFixed(2)}%`)
          console.log(`   VTR: ${metrics.vtr?.toFixed(0)}%`)
          console.log(`   Conv Rate: ${metrics.conversion_rate?.toFixed(1)}%`)
          console.log(`   ROAS: ${metrics.roas?.toFixed(2)}x`)
          console.log(`   Engagement: ${metrics.engagement_score?.toFixed(0)}`)
        }

      } catch (error) {
        console.error(`❌ Error re-analyzing ${video.video_filename}:`, error)
        console.error('   Error details:', error instanceof Error ? error.message : 'Unknown error')
      }
    }

    console.log('\n\n' + '='.repeat(60))
    console.log('✅ Re-analysis complete!')
    console.log('='.repeat(60))

  } catch (error) {
    console.error('❌ Fatal error:', error)
    throw error
  } finally {
    // Close MongoDB connection
    if (client) {
      console.log('\n🔌 Closing MongoDB connection...')
      await client.close()
    }
  }
}

// Run the script
reanalyzeVideos()
  .then(() => {
    console.log('\n✨ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
