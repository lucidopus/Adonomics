'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Tabs from '@/components/ui/Tabs'

interface AnalysisResult {
  id?: string
  title?: string
  topics?: string[]
  hashtags?: string[]
  summary?: string
  data?: string
  summarizeType?: string
  usage?: {
    outputTokens?: number
  }
}

export default function VideoAnalysis() {
  const [videoId, setVideoId] = useState('')
  const [customPrompt, setCustomPrompt] = useState('')
  const [results, setResults] = useState<Record<string, AnalysisResult>>({})
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleAnalysis = async (analysisType: string, prompt?: string) => {
    if (!videoId.trim()) return

    setIsLoading(prev => ({ ...prev, [analysisType]: true }))
    setErrors(prev => ({ ...prev, [analysisType]: '' }))

    try {
      const response = await fetch('/api/analyze-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId: videoId.trim(),
          analysisType,
          prompt: prompt || undefined
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed')
      }

      setResults(prev => ({ ...prev, [analysisType]: data.data }))
    } catch (err: any) {
      setErrors(prev => ({ ...prev, [analysisType]: err.message || 'An error occurred during analysis' }))
    } finally {
      setIsLoading(prev => ({ ...prev, [analysisType]: false }))
    }
  }

  const analysisTabs = [
    {
      id: 'gist',
      label: 'Gist',
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">Title, Topics & Hashtags</h4>
              <p className="text-sm text-muted-foreground">Extract key metadata from the video</p>
            </div>
            <button
              onClick={() => handleAnalysis('gist')}
              disabled={isLoading.gist || !videoId.trim()}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading.gist ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>

          {errors.gist && (
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
              <p className="text-red-700 dark:text-red-400 text-sm">{errors.gist}</p>
            </div>
          )}

          {results.gist && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 p-6 rounded-xl bg-muted/30 border border-border"
            >
              {results.gist.title && (
                <div>
                  <h5 className="font-medium mb-2">Title</h5>
                  <p className="text-sm">{results.gist.title}</p>
                </div>
              )}

              {results.gist.topics && results.gist.topics.length > 0 && (
                <div>
                  <h5 className="font-medium mb-2">Topics</h5>
                  <div className="flex flex-wrap gap-2">
                    {results.gist.topics.map((topic, index) => (
                      <span key={`topic-${index}`} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {results.gist.hashtags && results.gist.hashtags.length > 0 && (
                <div>
                  <h5 className="font-medium mb-2">Hashtags</h5>
                  <div className="flex flex-wrap gap-2">
                    {results.gist.hashtags.map((hashtag, index) => (
                      <span key={`hashtag-${index}`} className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs">
                        #{hashtag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      )
    },
    {
      id: 'summary',
      label: 'Summary',
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">Video Summary</h4>
              <p className="text-sm text-muted-foreground">Generate a comprehensive summary of the video content</p>
            </div>
            <button
              onClick={() => handleAnalysis('summary')}
              disabled={isLoading.summary || !videoId.trim()}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading.summary ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>

          {errors.summary && (
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
              <p className="text-red-700 dark:text-red-400 text-sm">{errors.summary}</p>
            </div>
          )}

          {results.summary && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-xl bg-muted/30 border border-border"
            >
              <h5 className="font-medium mb-3">Summary</h5>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{results.summary.summary || results.summary.data}</p>
            </motion.div>
          )}
        </div>
      )
    },
    {
      id: 'custom',
      label: 'Custom Analysis',
      content: (
        <div className="space-y-4">
          <div>
            <label htmlFor="custom-prompt" className="block text-sm font-medium mb-2">
              Custom Prompt
            </label>
            <textarea
              id="custom-prompt"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Describe what you want to analyze about this video..."
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 resize-none"
              rows={4}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Example: "Analyze this video for advertising potential. What emotions does it evoke and who is the target audience?"
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">Custom Analysis</h4>
              <p className="text-sm text-muted-foreground">Get tailored insights based on your specific questions</p>
            </div>
            <button
              onClick={() => handleAnalysis('open-ended', customPrompt)}
              disabled={isLoading['open-ended'] || !videoId.trim() || !customPrompt.trim()}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading['open-ended'] ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>

          {errors['open-ended'] && (
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
              <p className="text-red-700 dark:text-red-400 text-sm">{errors['open-ended']}</p>
            </div>
          )}

          {results['open-ended'] && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-xl bg-muted/30 border border-border"
            >
              <h5 className="font-medium mb-3">Analysis Results</h5>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{results['open-ended'].data}</p>
            </motion.div>
          )}
        </div>
      )
    }
  ]

  return (
    <div className="max-w-6xl">
      {/* Analysis Header */}
      <div className="glass shadow-lg rounded-2xl p-6 border border-border mb-6">
        <div className="flex items-center">
          <motion.div
            className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg"
          >
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </motion.div>
          <div>
            <h3 className="text-2xl font-bold">Video Analysis</h3>
            <p className="text-sm text-muted-foreground">Extract insights and analyze video content for advertising purposes</p>
          </div>
        </div>
      </div>

      {/* Video ID Input */}
      <div className="glass shadow-lg rounded-2xl p-8 border border-border mb-6">
        <div>
          <label htmlFor="video-id" className="block text-sm font-medium mb-2">
            Video ID
          </label>
          <input
            id="video-id"
            type="text"
            value={videoId}
            onChange={(e) => setVideoId(e.target.value)}
            placeholder="Enter the video ID from your search results..."
            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Get video IDs from the Video Search tab above
          </p>
        </div>
      </div>

      {/* Analysis Tabs */}
      <div className="glass shadow-lg rounded-2xl p-8 border border-border">
        <Tabs tabs={analysisTabs} defaultTab="gist" />
      </div>
    </div>
  )
}