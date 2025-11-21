# Twelve Labs Setup Scripts

This directory contains scripts to set up your Twelve Labs index and upload videos from Supabase.

## Prerequisites

- Node.js and npm/yarn installed
- Twelve Labs API key configured in `.env.local`
- Supabase credentials configured in `.env.local`
- Videos uploaded to Supabase Storage bucket named `videos`

## Scripts

### 1. Create Index (`create-index.ts`)

Creates a new Twelve Labs index optimized for video ad analysis.

**Features:**
- Creates index with `marengo2.6` engine
- Enables visual, conversation, text_in_video, and logo detection
- Adds thumbnail generation

**Usage:**
```bash
npx tsx scripts/create-index.ts
```

**Output:**
- Displays the new index ID
- Provides instructions to update `.env.local`

### 2. Upload Videos (`upload-videos.ts`)

Uploads all videos from your Supabase `videos` bucket to Twelve Labs.

**Features:**
- Batch uploads 12 videos from Supabase Storage
- Monitors indexing status in real-time
- Provides detailed progress and error reporting
- Rate-limited to avoid API throttling

**Usage:**
```bash
npx tsx scripts/upload-videos.ts
```

**Output:**
- Progress indicator for each video
- Task IDs and Video IDs
- Summary report with success/failure counts

## Step-by-Step Guide

### Step 1: Create the Index

```bash
npx tsx scripts/create-index.ts
```

Expected output:
```
✅ Index created successfully!

Index Details:
──────────────────────────────────────────────────
Index ID: 67xxxxxxxxxxxxxxxxxxxxxxxx
Index Name: adonomics-ads
Created At: 2025-11-20T...
──────────────────────────────────────────────────
```

### Step 2: Update Environment Variables

Copy the Index ID from the output and update `.env.local`:

```bash
TWELVE_LABS_INDEX_ID=67xxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 3: Upload Videos

```bash
npx tsx scripts/upload-videos.ts
```

This will:
1. Upload all 12 videos from Supabase
2. Monitor indexing progress (typically 5-15 minutes per video)
3. Display Video IDs when complete

Expected output per video:
```
[1/12] Processing: Action Mode Swayable.mp4
   📎 URL: https://...
   ⏳ Uploading to Twelve Labs...
   ✅ Task created: 67xxx...
   ⏳ Status: validating (0s elapsed)
   ⏳ Status: indexing (5s elapsed)
   🎉 Video indexed successfully! Video ID: 67xxx...
```

### Step 4: Restart Development Server

After all videos are indexed:

```bash
yarn dev
```

Now your Creative Insights tab will work with your videos! 🎉

## Troubleshooting

### Error: "API key is not authorized"

- Verify your `TWELVE_LABS_API_KEY` in `.env.local`
- Log in to https://api.twelvelabs.io/dashboard
- Check if your API key is valid

### Error: "Index not found"

- Make sure you ran `create-index.ts` first
- Verify the `TWELVE_LABS_INDEX_ID` in `.env.local` matches the output

### Error: "Task timeout"

- Videos can take 5-15 minutes to index
- The script will wait up to 5 minutes per video
- You can check status manually at https://api.twelvelabs.io/dashboard

### Error: "Quota exceeded"

- Check your Twelve Labs plan limits
- Free tier: Limited indexing minutes/month
- Upgrade at https://api.twelvelabs.io/pricing

## Video List

The script uploads these videos from your Supabase bucket:

1. Action Mode Swayable.mp4
2. action_mode_samsung.mp4
3. Apple Pay Swayable (1).mp4
4. AWESOME is for Everyone.mp4
5. AWESOME Screen 15s.mp4
6. Battery for Miles.mp4
7. Crash Test Swayable.mp4
8. Focus Mode Swayable.mp4
9. Live Focus How To.mp4
10. Meet Millie Bobby Brown.mp4
11. Moments That You Love.mp4
12. Unsend Texts RIP Leon.mp4

## Advanced Usage

### Upload Specific Videos

Edit `upload-videos.ts` and modify the `VIDEO_FILES` array:

```typescript
const VIDEO_FILES = [
  'Action Mode Swayable.mp4',
  // Comment out videos you don't want to upload
]
```

### Check Index Status

```bash
# List all indexes
curl https://api.twelvelabs.io/v1.2/indexes \
  -H "x-api-key: $TWELVE_LABS_API_KEY"

# Get specific index
curl https://api.twelvelabs.io/v1.2/indexes/$TWELVE_LABS_INDEX_ID \
  -H "x-api-key: $TWELVE_LABS_API_KEY"
```

## Notes

- **Indexing time**: 5-15 minutes per video depending on length
- **Cost**: Check Twelve Labs pricing for indexing costs
- **Storage**: Videos remain in Supabase; Twelve Labs only stores embeddings
- **Updates**: Re-running upload script will create duplicate entries
