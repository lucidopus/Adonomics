'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Tabs from '@/components/ui/Tabs'

interface VideoResult {
  id: string
  title?: string
  description?: string
  thumbnail_url?: string
  score?: number
}

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

interface AnalysisModalProps {
  isOpen: boolean
  onClose: () => void
  video: VideoResult | null
}

export default function AnalysisModal({ isOpen, onClose, video }: AnalysisModalProps) {
  const [customPrompt, setCustomPrompt] = useState('')
  const [results, setResults] = useState<Record<string, AnalysisResult>>({})
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset state when modal opens with new video
  useEffect(() => {
    if (isOpen && video) {
      setResults({})
      setIsLoading({})
      setErrors({})
      setCustomPrompt('')
    }
  }, [isOpen, video])

  const handleAnalysis = async (analysisType: string, prompt?: string) => {
    if (!video) return

    setIsLoading(prev => ({ ...prev, [analysisType]: true }))
    setErrors(prev => ({ ...prev, [analysisType]: '' }))

    try {
      const response = await fetch('/api/analyze-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId: video.id,
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
              disabled={isLoading.gist}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
            >
              {isLoading.gist ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin mr-2"></div>
                  Analyzing...
                </div>
              ) : (
                'Analyze'
              )}
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
                    {results.gist.topics.map((topic) => (
                      <span key={`topic-${topic}`} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs">
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
                    {results.gist.hashtags.map((hashtag) => (
                        <span key={`hashtag-${hashtag}`} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs">
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
              disabled={isLoading.summary}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
            >
              {isLoading.summary ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin mr-2"></div>
                  Analyzing...
                </div>
              ) : (
                'Analyze'
              )}
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
            <div className="mt-2">
              <p className="text-xs text-muted-foreground mb-2">Quick prompts:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  'Analyze this video for advertising potential. What emotions does it evoke and who is the target audience?',
                  'What marketing strategies are used in this video? Identify key techniques and their effectiveness.',
                  'Extract key selling points and value propositions from this advertisement.',
                  'How engaging is this video? Analyze pacing, visuals, and storytelling.'
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCustomPrompt(prompt)}
                    className="px-3 py-1 text-xs rounded-full bg-muted/50 hover:bg-muted transition-colors"
                  >
                    {idx === 0 ? 'Advertising Potential' :
                     idx === 1 ? 'Marketing Strategies' :
                     idx === 2 ? 'Selling Points' : 'Engagement Analysis'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">Custom Analysis</h4>
              <p className="text-sm text-muted-foreground">Get tailored insights based on your specific questions</p>
            </div>
            <button
              onClick={() => handleAnalysis('open-ended', customPrompt)}
              disabled={isLoading['open-ended'] || !customPrompt.trim()}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
            >
              {isLoading['open-ended'] ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin mr-2"></div>
                  Analyzing...
                </div>
              ) : (
                'Analyze'
              )}
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

  if (!video) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-background rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center space-x-4">
                {video.thumbnail_url && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={video.thumbnail_url}
                      alt={video.title || 'Video thumbnail'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold">{video.title || 'Untitled Video'}</h2>
                  <div className="flex items-center gap-4">
                    <p className="text-sm text-muted-foreground">AI-Powered Video Analysis</p>
                    {video.score && (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10">
                         <span className="text-xs font-medium text-primary">Match Score: {video.score.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
              <Tabs tabs={analysisTabs} defaultTab="gist" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}