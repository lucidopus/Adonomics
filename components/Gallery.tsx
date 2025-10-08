'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Calendar, TrendingUp, AlertTriangle, CheckCircle, XCircle, Eye, Sparkles, Search, Filter, Grid3x3, List } from 'lucide-react'
import AnalysisDashboard from './AnalysisDashboard'

interface AnalysisReport {
  _id: string
  video_filename?: string
  video_url?: string
  status: string
  created_at: string
  analyzed_at?: string
  analysis_results?: {
    synthesis?: {
      report: Record<string, unknown>
    }
  }
  metadata?: {
    brand?: string
    campaign_name?: string
    year?: number
    quarter?: string
    platform?: string
    region?: string
  }
}

export default function Gallery() {
  const [analyses, setAnalyses] = useState<AnalysisReport[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisReport | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    fetchAnalyses()
  }, [])

  const fetchAnalyses = async () => {
    try {
      setLoading(true)
      const userData = localStorage.getItem('user')
      if (!userData) {
        throw new Error('User not authenticated')
      }
      const user = JSON.parse(userData)

      const response = await fetch(`/api/advertisements?userId=${user.id}&view=gallery`)
      if (!response.ok) {
        throw new Error('Failed to fetch analyses')
      }

      const data = await response.json()
      setAnalyses(data)
    } catch (error) {
      console.error('Error fetching analyses:', error)
    } finally {
      setLoading(false)
    }
  }

  const getVideoTitle = (analysis: AnalysisReport) => {
    return analysis.video_filename || analysis.video_url || 'Untitled Video'
  }

  const getConfidenceScore = (analysis: AnalysisReport) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (analysis.analysis_results?.synthesis?.report as any)?.success_prediction?.confidence_score || 0
  }

  const getRiskLevel = (analysis: AnalysisReport) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (analysis.analysis_results?.synthesis?.report as any)?.risk_assessment?.risk_level || 'unknown'
  }

  const getDecisionSuggestion = (analysis: AnalysisReport) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (analysis.analysis_results?.synthesis?.report as any)?.personalized_recommendations?.decision_suggestion || 'pending'
  }

  const filteredAnalyses = analyses.filter(analysis => {
    const matchesSearch = getVideoTitle(analysis).toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || analysis.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case 'approve': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'suspend': return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case 'reject': return <XCircle className="w-4 h-4 text-red-600" />
      default: return <Eye className="w-4 h-4 text-blue-600" />
    }
  }

  if (selectedAnalysis) {
    return (
      <div className="min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <button
            onClick={() => setSelectedAnalysis(null)}
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Gallery</span>
          </button>
        </motion.div>
        <AnalysisDashboard
          analysisData={selectedAnalysis.analysis_results?.synthesis?.report as never}
          videoTitle={getVideoTitle(selectedAnalysis)}
        />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
      >
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold">Analysis Gallery</h1>
          </div>
          <p className="text-muted-foreground">View all your past creative analyses</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-primary text-white'
                : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
            }`}
          >
            <Grid3x3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-primary text-white'
                : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-6 border border-border"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="analyzed">Analyzed</option>
              <option value="approved">Approved</option>
              <option value="suspended">Suspended</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredAnalyses.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-2xl p-12 border border-border text-center"
        >
          <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-4">
            <Eye className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Analyses Found</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery || filterStatus !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Start analyzing your first video advertisement'}
          </p>
        </motion.div>
      )}

      {/* Grid View */}
      {!loading && filteredAnalyses.length > 0 && viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredAnalyses.map((analysis, index) => (
              <motion.div
                key={analysis._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4, scale: 1.02 }}
                onClick={() => setSelectedAnalysis(analysis)}
                className="glass rounded-2xl overflow-hidden border border-border cursor-pointer group"
              >
                {/* Thumbnail */}
                <div className="relative h-40 bg-gradient-to-br from-primary/10 via-purple-500/10 to-blue-500/10 flex items-center justify-center">
                  <Play className="w-12 h-12 text-primary/50 group-hover:text-primary group-hover:scale-110 transition-all" />
                  <div className="absolute top-3 right-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(getRiskLevel(analysis))}`}>
                      {getRiskLevel(analysis)}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-sm line-clamp-2 flex-1">
                      {getVideoTitle(analysis)}
                    </h3>
                    {getDecisionIcon(getDecisionSuggestion(analysis))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">
                        {getConfidenceScore(analysis)}%
                      </span>
                    </div>
                    {analysis.analyzed_at && (
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(analysis.analyzed_at).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Metadata */}
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {(analysis.analysis_results?.synthesis?.report as any)?.metadata && (
                    <div className="flex flex-wrap gap-1.5">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {(analysis.analysis_results?.synthesis?.report as any).metadata.brand && (
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-xs font-medium">
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {(analysis.analysis_results?.synthesis?.report as any).metadata.brand}
                        </span>
                      )}
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {(analysis.analysis_results?.synthesis?.report as any).metadata.platform && (
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-xs">
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {(analysis.analysis_results?.synthesis?.report as any).metadata.platform}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* List View */}
      {!loading && filteredAnalyses.length > 0 && viewMode === 'list' && (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredAnalyses.map((analysis, index) => (
              <motion.div
                key={analysis._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ x: 4 }}
                onClick={() => setSelectedAnalysis(analysis)}
                className="glass rounded-2xl p-6 border border-border cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <Play className="w-5 h-5 text-primary/50 group-hover:text-primary transition-colors" />
                      <h3 className="font-semibold">{getVideoTitle(analysis)}</h3>
                      {getDecisionIcon(getDecisionSuggestion(analysis))}
                    </div>

                    <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-600">{getConfidenceScore(analysis)}%</span>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(getRiskLevel(analysis))}`}>
                        {getRiskLevel(analysis)} risk
                      </div>
                      {analysis.analyzed_at && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(analysis.analyzed_at).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <svg className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Stats Footer */}
      {!loading && filteredAnalyses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6 border border-border"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{filteredAnalyses.length}</div>
              <div className="text-sm text-muted-foreground">Total Analyses</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {filteredAnalyses.filter(a => getDecisionSuggestion(a) === 'approve').length}
              </div>
              <div className="text-sm text-muted-foreground">Approved</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {filteredAnalyses.filter(a => getDecisionSuggestion(a) === 'suspend').length}
              </div>
              <div className="text-sm text-muted-foreground">Suspended</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {filteredAnalyses.filter(a => getDecisionSuggestion(a) === 'reject').length}
              </div>
              <div className="text-sm text-muted-foreground">Rejected</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
