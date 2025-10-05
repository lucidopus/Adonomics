'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AnalysisModal from './AnalysisModal'

interface VideoResult {
  id: string
  title?: string
  description?: string
  thumbnail_url?: string
  score?: number
}

export default function VideoSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<VideoResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedVideo, setSelectedVideo] = useState<VideoResult | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    setError('')
    setResults([])

    try {
      const response = await fetch('/api/search-videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Search failed')
      }

      setResults(data.data || [])
    } catch (err: any) {
      setError(err.message || 'An error occurred during search')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnalyzeVideo = (video: VideoResult) => {
    setSelectedVideo(video)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedVideo(null)
  }

  return (
    <div className="max-w-6xl">
      {/* Search Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="glass shadow-lg rounded-2xl p-6 border border-border mb-6"
      >
        <div className="flex items-center">
          <motion.div
            className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </motion.div>
          <div>
            <h3 className="text-2xl font-bold">Video Search & Analysis</h3>
            <p className="text-sm text-muted-foreground">Discover videos and unlock instant AI-powered advertising insights</p>
          </div>
        </div>
      </motion.div>

      {/* Search Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass shadow-lg rounded-2xl p-8 border border-border mb-6"
      >
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label htmlFor="search-query" className="block text-sm font-medium mb-2">
              Search Query
            </label>
            <div className="relative">
            <input
              id="search-query"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSearch(e as any)
                }
              }}
              placeholder="Describe the video content you're looking for..."
              className="w-full px-4 py-3 pl-12 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
              disabled={isLoading}
            />
              <svg className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="mt-3">
              <p className="text-xs text-muted-foreground mb-2">Popular searches:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  'product advertisements',
                  'emotional storytelling',
                  'funny cat videos',
                  'brand commercials',
                  'social media ads'
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setQuery(suggestion)}
                    className="px-3 py-1 text-xs rounded-full bg-muted/50 hover:bg-muted transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="w-full px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin mr-2"></div>
                Searching...
              </div>
            ) : (
              'Search Videos'
            )}
          </button>
         </form>
      </motion.div>

      {/* Error Message */}
      {error && (
        <div className="glass shadow-lg rounded-2xl p-6 border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800 mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Search Results */}
      {results.length > 0 && (
        <div className="glass shadow-lg rounded-2xl p-8 border border-border">
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-2">Search Results</h4>
            <p className="text-sm text-muted-foreground">
              Found {results.length} video{results.length !== 1 ? 's' : ''} matching your query. Click "Analyze Video" to get instant insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((video, index) => (
              <motion.div
                key={`${video.id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="glass shadow-sm rounded-xl p-4 border border-border hover:shadow-xl hover:scale-[1.02] hover:border-primary/20 transition-all duration-200 cursor-pointer group relative overflow-hidden"
                onClick={() => handleAnalyzeVideo(video)}
              >
                {/* Hover overlay with gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl"></div>

                {/* Click indicator */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
                {video.thumbnail_url && (
                  <div className="aspect-video rounded-lg overflow-hidden mb-3 bg-muted">
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

                <div className="space-y-2">
                  <h5 className="font-medium text-sm line-clamp-2">
                    {video.title || 'Untitled Video'}
                  </h5>

                  {video.description && (
                    <p className="text-xs text-muted-foreground line-clamp-3">
                      {video.description}
                    </p>
                  )}

                  {video.score && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Relevance</span>
                      <span className="text-xs font-medium text-primary">
                        {video.score.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="pt-3 flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAnalyzeVideo(video)
                      }}
                      className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-all duration-200 hover:shadow-md hover:scale-105 group-hover:bg-primary/90 flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Analyze Video
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="glass shadow-sm rounded-xl p-4 border border-border animate-pulse">
              <div className="aspect-video rounded-lg bg-muted/50 mb-3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted/50 rounded w-3/4"></div>
                <div className="h-3 bg-muted/50 rounded w-1/2"></div>
                <div className="flex justify-between items-center pt-2">
                  <div className="h-3 bg-muted/50 rounded w-16"></div>
                  <div className="h-6 bg-muted/50 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && results.length === 0 && query && (
        <div className="glass shadow-lg rounded-2xl p-12 border border-border text-center">
          <svg className="w-16 h-16 text-muted-foreground mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <div className="mb-6">
            <svg className="w-16 h-16 text-muted-foreground mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h4 className="text-lg font-semibold mb-2">No videos found</h4>
            <p className="text-muted-foreground mb-6">
              Try a different search query or explore these popular categories:
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { query: 'product ads', icon: '📺', desc: 'Commercial spots' },
              { query: 'social media', icon: '📱', desc: 'Platform content' },
              { query: 'brand stories', icon: '🎭', desc: 'Narrative ads' },
              { query: 'viral videos', icon: '🚀', desc: 'Trending content' }
            ].map((suggestion) => (
              <button
                key={suggestion.query}
                onClick={() => setQuery(suggestion.query)}
                className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all duration-200 border border-border/50 hover:border-primary/20 group"
              >
                <div className="text-2xl mb-2">{suggestion.icon}</div>
                <div className="text-sm font-medium mb-1">{suggestion.query}</div>
                <div className="text-xs text-muted-foreground">{suggestion.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Analysis Modal */}
      <AnalysisModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        video={selectedVideo}
      />
    </div>
  )
}