/**
 * Script to create a Twelve Labs index with Pegasus (search + generation)
 *
 * Usage: npx tsx scripts/create-pegasus-index.ts
 */

import { config } from 'dotenv'
import { TwelveLabs } from 'twelvelabs-js'

// Load environment variables from .env.local
config({ path: '.env.local' })

async function createPegasusIndex() {
  try {
    console.log('🚀 Creating Twelve Labs index with Pegasus (search + generation)...\n')

    // Validate API key
    const apiKey = process.env.TWELVE_LABS_API_KEY
    if (!apiKey) {
      throw new Error('TWELVE_LABS_API_KEY environment variable is not set')
    }

    // Initialize client
    const client = new TwelveLabs({ apiKey })

    // Create index with Pegasus model (supports both search and generation)
    const index = await client.indexes.create({
      indexName: 'adonomics-demo',
      models: [
        {
          modelName: 'pegasus1.2', // Latest version - supports search AND generation
          modelOptions: ['visual', 'audio']
        }
      ],
      addons: ['thumbnail']
    })

    console.log('✅ Index created successfully!\n')
    console.log('Index Details:')
    console.log('─'.repeat(50))
    console.log(`Index ID: ${(index as any).id || (index as any)._id}`)
    console.log(`Index Name: adonomics-demo`)
    console.log(`Model: Pegasus 1.2 (search + generation)`)
    console.log(`Created At: ${(index as any).createdAt}`)
    console.log('─'.repeat(50))
    console.log('\n📝 Next steps:')
    console.log(`1. Copy this index ID: ${(index as any).id || (index as any)._id}`)
    console.log('2. Update your .env.local file:')
    console.log(`   TWELVE_LABS_INDEX_ID=${(index as any).id || (index as any)._id}`)
    console.log('3. Delete old index (691fee1470302693d98c6bc0) from dashboard')
    console.log('4. Upload videos: npx tsx scripts/upload-videos.ts')
    console.log('\n')

  } catch (error) {
    console.error('❌ Error creating index:', error)

    if (error instanceof Error) {
      if (error.message.includes('API key') || error.message.includes('unauthorized')) {
        console.error('\n⚠️  Invalid API key. Please check your TWELVE_LABS_API_KEY in .env.local')
      } else if (error.message.includes('quota') || error.message.includes('limit')) {
        console.error('\n⚠️  API quota exceeded. Please upgrade your Twelve Labs plan.')
      }
    }

    process.exit(1)
  }
}

// Run the script
createPegasusIndex()
