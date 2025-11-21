/**
 * Test script to upload a single video to Twelve Labs
 */

import { config } from 'dotenv'
import { TwelveLabs } from 'twelvelabs-js'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
config({ path: '.env.local' })

async function testUpload() {
  try {
    console.log('🧪 Testing single video upload...\n')

    // Validate environment variables
    const apiKey = process.env.TWELVE_LABS_API_KEY
    const indexId = process.env.TWELVE_LABS_INDEX_ID
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!apiKey || !indexId || !supabaseUrl || !supabaseKey) {
      throw new Error('Missing required environment variables')
    }

    // Initialize clients
    const tlClient = new TwelveLabs({ apiKey })
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Test with first video
    const filename = 'Action Mode Swayable.mp4'
    console.log(`📹 Testing with: ${filename}\n`)

    // Get public URL
    const { data } = supabase.storage.from('videos').getPublicUrl(filename)
    const videoUrl = data.publicUrl

    console.log(`📎 Video URL: ${videoUrl}`)
    console.log(`🎯 Index ID: ${indexId}`)
    console.log(`⏳ Creating task...\n`)

    // Create task
    const task = await tlClient.tasks.create({
      indexId,
      videoUrl
    })

    console.log(`✅ Task created successfully!`)
    console.log(`   Task ID: ${task.id}`)
    console.log(`   Status: ${task.status}\n`)

    console.log('📊 Monitoring task status (this may take 5-15 minutes)...\n')

    // Poll for completion
    let attempts = 0
    while (attempts < 120) { // 10 minutes max
      const status = await tlClient.tasks.retrieve(task.id!)

      if (status.status === 'ready') {
        console.log(`\n🎉 Video indexed successfully!`)
        console.log(`   Video ID: ${(status as any).videoId}`)
        console.log(`\n✅ Test completed successfully!`)
        console.log('\nYou can now run the full upload script:')
        console.log('   npx tsx scripts/upload-videos.ts')
        return
      } else if (status.status === 'failed') {
        throw new Error(`Task failed: ${(status as any).errorMessage}`)
      }

      console.log(`   [${new Date().toLocaleTimeString()}] Status: ${status.status}`)
      await new Promise(resolve => setTimeout(resolve, 5000))
      attempts++
    }

    console.log('\n⏰ Task is still processing. Check the Twelve Labs dashboard.')

  } catch (error) {
    console.error('\n❌ Error:', error)
    if (error instanceof Error) {
      console.error(error.message)
    }
    process.exit(1)
  }
}

testUpload()
