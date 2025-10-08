'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import Button from './ui/Button'
import AnalysisDashboard from './AnalysisDashboard'

interface AnalysisData {
  twelve_labs_summary?: string
  metadata?: {
    brand?: string
    campaign_name?: string
    year?: number
    quarter?: string
    platform?: string
    region?: string
  }
  creative_features?: {
    scene_id?: string
    scene_duration?: number
    objects_present?: string[]
    faces_detected?: number
    brand_logo_presence?: boolean
    text_on_screen?: string[]
    audio_elements?: string[]
    music_tempo?: string
    music_mode?: string
    color_palette_dominant?: string[]
    editing_pace?: number
  }
  emotional_features?: {
    emotion_primary?: string
    emotion_intensity?: number
    emotional_arc_timeline?: string[]
    tone_of_voice?: string
    facial_expression_emotions?: Record<string, number>
    audience_perceived_sentiment?: string
    cultural_sensitivity_flag?: boolean
  }
  success_prediction: {
    confidence_score: number
    key_strengths: string[]
    performance_factors: string[]
    audience_fit: string
    competitive_advantage: string
  }
  risk_assessment: {
    risk_level: 'low' | 'medium' | 'high'
    potential_issues: string[]
    failure_risks: string[]
    mitigation_suggestions: string[]
  }
  personalized_recommendations: {
    decision_suggestion: 'approve' | 'suspend' | 'reject'
    action_items: string[]
    optimization_priorities: string[]
    user_specific_insights: string
    performance_based_rationale?: string
    expected_roi_impact?: string
    competitive_benchmarking?: string
  }
  creative_analysis: {
    storytelling_effectiveness: string
    visual_impact: string
    emotional_resonance: string
    technical_quality: string
  }
  competitive_intelligence: {
    market_positioning: string
    benchmark_comparison: string
    differentiation_opportunities: string
    trend_alignment: string
  }
}

export default function HomeDashboard() {
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string>('')
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [advertisementId, setAdvertisementId] = useState<string | null>(null)
  const [videoTitle, setVideoTitle] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (uploadMethod === 'file' && !selectedFile) {
      alert('Please select a video file')
      return
    }

    if (uploadMethod === 'url' && !videoUrl) {
      alert('Please enter a video URL')
      return
    }

    setIsUploading(true)
    setUploadProgress('Initializing upload...')

    try {
      // Get user ID from localStorage
      const userData = localStorage.getItem('user')
      if (!userData) {
        throw new Error('User not authenticated')
      }
      const user = JSON.parse(userData)

      // Prepare form data
      const formData = new FormData()
      formData.append('userId', user.id)

      if (uploadMethod === 'file' && selectedFile) {
        formData.append('videoFile', selectedFile)
        setUploadProgress('Uploading file to Twelve Labs...')
      } else if (uploadMethod === 'url') {
        formData.append('videoUrl', videoUrl)
        setUploadProgress('Processing video URL...')
      }

      // Upload to our API endpoint
      const response = await fetch('/api/advertisements', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Upload failed')
      }

       const result = await response.json()
       setUploadProgress('Upload successful! Video is being indexed by Twelve Labs...')

       // Store advertisement ID and video title
       setAdvertisementId(result.advertisementId)
       setVideoTitle(selectedFile?.name || videoUrl || 'Uploaded Video')

       // Wait for video indexing to complete before analysis
       await waitForVideoIndexing(result.advertisementId)

    } catch (error) {
      console.error('Upload error:', error)
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setUploadProgress('')
    } finally {
      setIsUploading(false)
    }
  }

  const waitForVideoIndexing = async (adId: string) => {
    const maxAttempts = 30 // 30 attempts = 15 minutes max wait (30 seconds between each)
    let attempts = 0

    setUploadProgress('Video is being indexed by Twelve Labs. This may take 5-15 minutes...')

    while (attempts < maxAttempts) {
      try {
        attempts++
        const timeElapsed = Math.floor(attempts * 0.5) // 0.5 minutes per attempt
        setUploadProgress(`Indexing video... (${timeElapsed} min elapsed, typically takes 5-15 min)`)

        // Try to analyze - if it returns 202, video isn't ready yet
        const response = await fetch('/api/analyze-advertisement', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ advertisementId: adId })
        })

        const responseText = await response.text()
        let result
        try {
          result = JSON.parse(responseText)
        } catch (parseError) {
          console.error('❌ Failed to parse response:', parseError)
          throw new Error(`Invalid response format`)
        }

        // If status is 202, video is still indexing - wait and retry
        if (response.status === 202) {
          console.log(`⏳ Video still indexing... attempt ${attempts}/${maxAttempts}`)
          await new Promise(resolve => setTimeout(resolve, 30000)) // Wait 30 seconds
          continue
        }

        // If we got a different error, throw it
        if (!response.ok) {
          throw new Error(result.error || 'Analysis failed')
        }

        // Success! Video is indexed and analyzed
        console.log('✅ Video indexed and analyzed successfully')

        // Validate the response structure
        if (!result.analysis?.synthesis?.report) {
          console.error('❌ Invalid analysis response structure:', result)
          throw new Error('Analysis response is missing expected data. Please try again.')
        }

        setAnalysisData(result.analysis.synthesis.report)
        setUploadProgress('Analysis complete!')
        return

      } catch (error) {
        // If it's not a 202 error, throw it
        if (error instanceof Error && !error.message.includes('still being indexed')) {
          throw error
        }
      }
    }

    // If we've exhausted all attempts
    const waitMessage = 'Video indexing is taking longer than expected. Please use the "Retry Analysis" button in a few minutes.'
    setUploadProgress(waitMessage)
    alert(waitMessage)
  }

  const handleAnalysis = async (adId: string) => {
    setUploadProgress('Analyzing video content...')

    try {
      const response = await fetch('/api/analyze-advertisement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ advertisementId: adId })
      })

      console.log('🔍 API Response status:', response.status)
      console.log('🔍 API Response ok:', response.ok)
      console.log('🔍 API Response headers:', Object.fromEntries(response.headers.entries()))

      const responseText = await response.text()
      console.log('🔍 Raw response text:', responseText)

      let result
      try {
        result = JSON.parse(responseText)
      } catch (parseError) {
        console.error('❌ Failed to parse response as JSON:', parseError)
        throw new Error(`Invalid response format: ${responseText}`)
      }

      // Handle 202 (Accepted) FIRST - video is still being indexed
      // Note: 202 is technically "ok" (2xx status), but it means "not ready yet"
      if (response.status === 202) {
        const waitMessage = result.message || 'Video is still being indexed by Twelve Labs. This typically takes 5-15 minutes. Please wait and try analyzing again later.'
        setUploadProgress(waitMessage)
        alert(waitMessage)
        return
      }

      // Handle other error status codes
      if (!response.ok) {
        throw new Error(result.error || 'Analysis failed')
      }

       // Debug: Log the full response structure
       console.log('🔍 Analysis API Response:', {
         hasAnalysis: !!result.analysis,
         hasSynthesis: !!result.analysis?.synthesis,
         hasReport: !!result.analysis?.synthesis?.report,
         synthesisKeys: result.analysis?.synthesis ? Object.keys(result.analysis.synthesis) : [],
         fullStructure: result
       })

       // Validate the response structure
       if (!result.analysis?.synthesis?.report) {
         console.error('❌ Invalid analysis response structure:', {
           result,
           analysis: result.analysis,
           synthesis: result.analysis?.synthesis
         })
         throw new Error('Analysis response is missing expected data. Please try again.')
       }

       setAnalysisData(result.analysis.synthesis.report)
       setUploadProgress('Analysis complete!')

    } catch (error) {
      console.error('Analysis error:', error)
      alert(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsUploading(false)
      // Don't clear upload progress here - let it stay visible for user feedback
    }
  }

  const handleDecision = async (decision: 'approve' | 'suspend' | 'reject', comments?: string) => {
    if (!advertisementId) return

    try {
      const response = await fetch(`/api/advertisements/${advertisementId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          decision,
          decision_comments: comments,
          status: decision === 'approve' ? 'approved' : decision === 'reject' ? 'rejected' : 'suspended'
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update decision')
      }

      alert(`Advertisement ${decision}d successfully!`)

      // Reset to upload state
      setAnalysisData(null)
      setAdvertisementId(null)
      setVideoTitle('')

    } catch (error) {
      console.error('Decision update error:', error)
      alert(`Failed to update decision: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Show analysis dashboard if we have results
  if (analysisData) {
    return (
      <div className="max-w-6xl">
        <AnalysisDashboard
          analysisData={analysisData}
          videoTitle={videoTitle}
          onDecision={handleDecision}
        />
      </div>
    )
  }

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass shadow-lg rounded-2xl p-6 border border-border"
      >
        <div className="flex items-center">
          <motion.div
            className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg"
          >
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </motion.div>
          <div>
            <h3 className="text-2xl font-bold">Upload New Ad</h3>
            <p className="text-sm text-muted-foreground">Submit a video ad for AI-powered creative analysis</p>
          </div>
        </div>
      </motion.div>

      {/* Upload Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass shadow-lg rounded-2xl p-8 border border-border"
      >
        {/* Upload Method Selection */}
        <div className="mb-8">
          <motion.h4
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg font-semibold mb-4"
          >
            Choose Upload Method
          </motion.h4>
          <div className="flex space-x-4">
            <motion.button
              onClick={() => setUploadMethod('file')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className={`flex-1 p-4 rounded-xl border-2 transition-all duration-200 relative overflow-hidden ${
                uploadMethod === 'file'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {uploadMethod === 'file' && (
                <motion.div
                  layoutId="uploadMethodIndicator"
                  className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <div className="flex items-center relative z-10">
                <motion.div
                  animate={uploadMethod === 'file' ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                </motion.div>
                <div className="text-left">
                  <div className="font-medium">Upload File</div>
                  <div className="text-sm text-muted-foreground">Select a video file from your device</div>
                </div>
              </div>
            </motion.button>

            <motion.button
              onClick={() => setUploadMethod('url')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className={`flex-1 p-4 rounded-xl border-2 transition-all duration-200 relative overflow-hidden ${
                uploadMethod === 'url'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {uploadMethod === 'url' && (
                <motion.div
                  layoutId="uploadMethodIndicator"
                  className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <div className="flex items-center relative z-10">
                <motion.div
                  animate={uploadMethod === 'url' ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </motion.div>
                <div className="text-left">
                  <div className="font-medium">Video URL</div>
                  <div className="text-sm text-muted-foreground">Provide a publicly accessible video URL</div>
                </div>
              </div>
            </motion.button>
          </div>
        </div>

        {/* File Upload */}
        {uploadMethod === 'file' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <motion.div
              onClick={() => fileInputRef.current?.click()}
              whileHover={{ scale: 1.01, borderColor: "rgb(var(--primary) / 0.5)" }}
              whileTap={{ scale: 0.99 }}
              className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer transition-all duration-200 relative overflow-hidden group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              <motion.div
                animate={selectedFile ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <svg className="w-12 h-12 mx-auto mb-4 text-muted-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </motion.div>
              <motion.div
                className="text-lg font-medium mb-2"
                animate={selectedFile ? { color: "rgb(var(--primary))" } : {}}
              >
                {selectedFile ? selectedFile.name : 'Click to select a video file'}
              </motion.div>
              <div className="text-sm text-muted-foreground">
                Supported formats: MP4, MOV, AVI, WMV, FLV, WebM (max 2GB)
              </div>
              {selectedFile && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-lg"
                >
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium text-primary">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* URL Input */}
        {uploadMethod === 'url' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div>
              <motion.label
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="block text-sm font-medium mb-2"
              >
                Video URL
              </motion.label>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="relative"
              >
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://example.com/video.mp4"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                />
                {videoUrl && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  </motion.div>
                )}
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-2 text-sm text-muted-foreground flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Must be a publicly accessible video URL</span>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Upload Progress */}
        {uploadProgress && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-6 p-6 bg-gradient-to-br from-primary/5 via-purple-500/5 to-blue-500/5 rounded-xl border border-primary/20 backdrop-blur-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                {isUploading && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: 360 }}
                    transition={{
                      scale: { duration: 0.3 },
                      rotate: { duration: 2, repeat: Infinity, ease: "linear" }
                    }}
                    className="mt-0.5"
                  >
                    <div className="relative w-6 h-6">
                      <div className="absolute inset-0 border-3 border-primary/20 rounded-full"></div>
                      <div className="absolute inset-0 border-3 border-transparent border-t-primary border-r-primary rounded-full animate-spin"></div>
                    </div>
                  </motion.div>
                )}
                {!isUploading && uploadProgress.includes('complete') && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="mt-0.5"
                  >
                    <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </motion.div>
                )}
                <div className="flex-1">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <p className="text-sm font-semibold text-foreground mb-1">
                      {uploadProgress.includes('complete') ? 'Complete!' : 'Processing...'}
                    </p>
                    <motion.p
                      key={uploadProgress}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm text-muted-foreground"
                    >
                      {uploadProgress}
                    </motion.p>
                  </motion.div>
                  {uploadProgress.includes('Indexing video') && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "100%" }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="mt-3 h-1.5 bg-muted/50 rounded-full overflow-hidden"
                    >
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{
                          duration: 15,
                          ease: "easeInOut",
                          repeat: Infinity
                        }}
                        className="h-full bg-gradient-to-r from-primary via-purple-500 to-blue-500 rounded-full"
                      />
                    </motion.div>
                  )}
                </div>
              </div>
              {advertisementId && !isUploading && uploadProgress.includes('indexed') && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button
                    onClick={() => handleAnalysis(advertisementId)}
                    size="sm"
                    variant="outline"
                  >
                    Retry Analysis
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Upload Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex justify-end"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={handleUpload}
              disabled={isUploading || (uploadMethod === 'file' && !selectedFile) || (uploadMethod === 'url' && !videoUrl)}
              size="lg"
              className="px-8 relative overflow-hidden group"
            >
              <motion.span
                animate={isUploading ? { opacity: [1, 0.5, 1] } : {}}
                transition={{ duration: 1.5, repeat: isUploading ? Infinity : 0 }}
              >
                {isUploading ? 'Uploading...' : 'Upload & Analyze'}
              </motion.span>
              {!isUploading && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
              )}
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: '🔍',
            title: 'Deep Analysis',
            description: 'AI examines every frame, scene, and element of your video'
          },
          {
            icon: '📊',
            title: 'Performance Prediction',
            description: 'Get data-driven insights on potential success metrics'
          },
          {
            icon: '⚡',
            title: 'Instant Results',
            description: 'Receive comprehensive analysis within minutes'
          }
        ].map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="glass shadow-lg rounded-2xl p-6 border border-border text-center"
          >
            <div className="text-3xl mb-3">{item.icon}</div>
            <h4 className="font-semibold mb-2">{item.title}</h4>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}