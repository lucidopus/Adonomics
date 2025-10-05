'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

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

  return (
    <div className="max-w-6xl">
      {/* Search Header */}
      <div className="glass shadow-lg rounded-2xl p-6 border border-border mb-6">
        <div className="flex items-center">
          <motion.div
            className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg"
          >
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </motion.div>
          <div>
            <h3 className="text-2xl font-bold">Video Search</h3>
            <p className="text-sm text-muted-foreground">Find relevant videos using semantic search powered by AI</p>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <div className="glass shadow-lg rounded-2xl p-8 border border-border mb-6">
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
                placeholder="Describe the video content you're looking for..."
                className="w-full px-4 py-3 pl-12 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                disabled={isLoading}
              />
              <svg className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Try queries like "funny cat videos", "product advertisements", or "emotional storytelling"
            </p>
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
      </div>

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
              Found {results.length} video{results.length !== 1 ? 's' : ''} matching your query
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((video, index) => (
              <motion.div
                key={`${video.id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="glass shadow-sm rounded-xl p-4 border border-border hover:shadow-md transition-all duration-200"
              >
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

                  <div className="pt-2">
                    <button
                      onClick={() => navigator.clipboard.writeText(video.id)}
                      className="text-xs text-primary hover:underline"
                    >
                      Copy Video ID
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && results.length === 0 && query && (
        <div className="glass shadow-lg rounded-2xl p-12 border border-border text-center">
          <svg className="w-16 h-16 text-muted-foreground mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <h4 className="text-lg font-semibold mb-2">No videos found</h4>
          <p className="text-muted-foreground">
            Try adjusting your search query or check your TwelveLabs configuration.
          </p>
        </div>
      )}
    </div>
  )
}