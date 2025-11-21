/**
 * Script to upload videos from Supabase Storage to Twelve Labs index
 *
 * Usage: npx tsx scripts/upload-videos.ts
 */

import { config } from 'dotenv'
import { TwelveLabs } from 'twelvelabs-js'
import { createClient } from '@supabase/supabase-js'

// Load environment variables from .env.local
config({ path: '.env.local' })

// Video files in your Supabase bucket
const VIDEO_FILES = [
  'Action Mode Swayable.mp4',
  'action_mode_samsung.mp4',
  'Apple Pay Swayable (1).mp4',
  'AWESOME is for Everyone.mp4',
  'AWESOME Screen 15s.mp4',
  'Battery for Miles.mp4',
  'Crash Test Swayable.mp4',
  'Focus Mode Swayable.mp4',
  'Live Focus How To.mp4',
  'Meet Millie Bobby Brown.mp4',
  'Moments That You Love.mp4',
  'Unsend Texts RIP Leon.mp4'
]

interface UploadResult {
  filename: string
  taskId: string
  videoId?: string
  status: 'success' | 'failed'
  error?: string
}

async function uploadVideos() {
  try {
    console.log('🚀 Starting video upload to Twelve Labs...\n')

    // Validate environment variables
    const apiKey = process.env.TWELVE_LABS_API_KEY
    const indexId = process.env.TWELVE_LABS_INDEX_ID
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!apiKey) throw new Error('TWELVE_LABS_API_KEY is not set')
    if (!indexId) throw new Error('TWELVE_LABS_INDEX_ID is not set')
    if (!supabaseUrl) throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set')
    if (!supabaseKey) throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set')

    // Initialize clients
    const tlClient = new TwelveLabs({ apiKey })
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log(`📊 Total videos to upload: ${VIDEO_FILES.length}`)
    console.log(`🎯 Target index: ${indexId}\n`)
    console.log('─'.repeat(70))

    const results: UploadResult[] = []

    // Upload videos one by one (to avoid rate limits)
    for (let i = 0; i < VIDEO_FILES.length; i++) {
      const filename = VIDEO_FILES[i]
      console.log(`\n[${i + 1}/${VIDEO_FILES.length}] Processing: ${filename}`)

      try {
        // Get public URL from Supabase
        const { data } = supabase.storage
          .from('videos')
          .getPublicUrl(filename)

        const videoUrl = data.publicUrl

        console.log(`   📎 URL: ${videoUrl}`)
        console.log(`   ⏳ Uploading to Twelve Labs...`)

        // Create task to index the video (using correct API parameters for newer SDK)
        const task = await tlClient.tasks.create({
          indexId,
          videoUrl: videoUrl
        })

        console.log(`   ✅ Task created: ${task.id}`)

        // Poll task status until complete
        let attempts = 0
        const maxAttempts = 60 // 5 minutes max (5 second intervals)

        while (attempts < maxAttempts) {
          const taskStatus = await tlClient.tasks.retrieve(task.id!)

          if (taskStatus.status === 'ready') {
            console.log(`   🎉 Video indexed successfully! Video ID: ${(taskStatus as any).videoId}`)
            results.push({
              filename,
              taskId: task.id!,
              videoId: (taskStatus as any).videoId,
              status: 'success'
            })
            break
          } else if (taskStatus.status === 'failed') {
            throw new Error(`Task failed: ${(taskStatus as any).errorMessage || 'Unknown error'}`)
          } else {
            // Still processing
            console.log(`   ⏳ Status: ${taskStatus.status} (${attempts * 5}s elapsed)`)
            await new Promise(resolve => setTimeout(resolve, 5000))
            attempts++
          }
        }

        if (attempts >= maxAttempts) {
          throw new Error('Task timeout - video is taking too long to index')
        }

      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error'
        console.error(`   ❌ Failed: ${errorMsg}`)
        results.push({
          filename,
          taskId: '',
          status: 'failed',
          error: errorMsg
        })
      }

      // Wait 2 seconds between uploads to avoid rate limits
      if (i < VIDEO_FILES.length - 1) {
        console.log('   ⏱️  Waiting 2 seconds before next upload...')
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }

    // Print summary
    console.log('\n' + '═'.repeat(70))
    console.log('📊 UPLOAD SUMMARY')
    console.log('═'.repeat(70))

    const successful = results.filter(r => r.status === 'success')
    const failed = results.filter(r => r.status === 'failed')

    console.log(`\n✅ Successful: ${successful.length}`)
    console.log(`❌ Failed: ${failed.length}`)
    console.log(`📊 Total: ${results.length}\n`)

    if (successful.length > 0) {
      console.log('✅ Successfully uploaded videos:')
      successful.forEach(r => {
        console.log(`   • ${r.filename} → Video ID: ${r.videoId}`)
      })
    }

    if (failed.length > 0) {
      console.log('\n❌ Failed uploads:')
      failed.forEach(r => {
        console.log(`   • ${r.filename}: ${r.error}`)
      })
    }

    console.log('\n' + '═'.repeat(70))
    console.log('🎉 Upload process complete!')
    console.log('═'.repeat(70))

    // Exit with error code if any failed
    if (failed.length > 0) {
      process.exit(1)
    }

  } catch (error) {
    console.error('\n❌ Fatal error:', error)
    process.exit(1)
  }
}

// Run the script
uploadVideos()
