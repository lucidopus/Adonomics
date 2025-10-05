'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import Button from './ui/Button'
import AnalysisDashboard from './AnalysisDashboard'

interface AnalysisData {
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
       setUploadProgress('Upload successful! Starting analysis...')

       // Store advertisement ID and trigger analysis
       setAdvertisementId(result.advertisementId)
       setVideoTitle(selectedFile?.name || videoUrl || 'Uploaded Video')

       // Start analysis
       await handleAnalysis(result.advertisementId)

       // Reset form
       setSelectedFile(null)
       setVideoUrl('')
       if (fileInputRef.current) {
         fileInputRef.current.value = ''
       }

    } catch (error) {
      console.error('Upload error:', error)
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsUploading(false)
      setUploadProgress('')
    }
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

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Analysis failed')
      }

      const result = await response.json()
      setAnalysisData(result.analysis.synthesis.report)
      setUploadProgress('Analysis complete!')

    } catch (error) {
      console.error('Analysis error:', error)
      alert(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setUploadProgress('')
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
          <h4 className="text-lg font-semibold mb-4">Choose Upload Method</h4>
          <div className="flex space-x-4">
            <button
              onClick={() => setUploadMethod('file')}
              className={`flex-1 p-4 rounded-xl border-2 transition-all duration-200 ${
                uploadMethod === 'file'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                <div className="text-left">
                  <div className="font-medium">Upload File</div>
                  <div className="text-sm text-muted-foreground">Select a video file from your device</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setUploadMethod('url')}
              className={`flex-1 p-4 rounded-xl border-2 transition-all duration-200 ${
                uploadMethod === 'url'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <div className="text-left">
                  <div className="font-medium">Video URL</div>
                  <div className="text-sm text-muted-foreground">Provide a publicly accessible video URL</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* File Upload */}
        {uploadMethod === 'file' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors duration-200"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <svg className="w-12 h-12 mx-auto mb-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <div className="text-lg font-medium mb-2">
                {selectedFile ? selectedFile.name : 'Click to select a video file'}
              </div>
              <div className="text-sm text-muted-foreground">
                Supported formats: MP4, MOV, AVI, WMV, FLV, WebM (max 2GB)
              </div>
              {selectedFile && (
                <div className="mt-4 text-sm text-primary">
                  File size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* URL Input */}
        {uploadMethod === 'url' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-2">Video URL</label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://example.com/video.mp4"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
              />
              <div className="mt-2 text-sm text-muted-foreground">
                Must be a publicly accessible video URL
              </div>
            </div>
          </motion.div>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 p-4 bg-muted/30 rounded-xl border border-border"
          >
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <span className="text-sm font-medium">{uploadProgress}</span>
            </div>
          </motion.div>
        )}

        {/* Upload Button */}
        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleUpload}
            disabled={isUploading || (uploadMethod === 'file' && !selectedFile) || (uploadMethod === 'url' && !videoUrl)}
            size="lg"
            className="px-8"
          >
            {isUploading ? 'Uploading...' : 'Upload & Analyze'}
          </Button>
        </div>
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