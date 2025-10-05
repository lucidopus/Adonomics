'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

// Types for live ads data
interface LiveAd {
  _id: string
  video_id: string
  video_title: string
  video_url: string
  thumbnail_url: string
  duration_seconds: number
  platform: string
  upload_date: string
  metrics: {
    impressions: number
    views: number
    clicks: number
    conversions: number
    ctr: number
    vtr: number
    conversion_rate: number
    avg_watch_time: number
    completion_rate: number
    spend: number
    revenue: number
    roas: number
    engagement_score: number
  }
  creative: {
    has_captions: boolean
    has_cta: boolean
    cta_timestamp: number | null
    dominant_emotion: string
    emotional_score: number
    has_faces: boolean
    has_product: boolean
    has_logo: boolean
    has_music: boolean
    has_voiceover: boolean
    pacing: string
  }
  insights: {
    strengths: Array<{
      element: string
      impact: string
      timestamp?: number
    }>
    weaknesses: Array<{
      element: string
      impact: string
      severity?: string
    }>
    recommendations: Array<{
      title: string
      priority: string
      expected_lift: string
    }>
    performance_grade: string
    ai_summary: string
  }
  created_at: string
  updated_at: string
}

export default function LiveAdsDashboard() {
  const [liveAds, setLiveAds] = useState<LiveAd[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'roas' | 'engagement_score' | 'views' | 'spend'>('roas')
  const [filterPlatform, setFilterPlatform] = useState<string>('all')

  useEffect(() => {
    // Load live ads data
    fetch('/data/live_ads.json')
      .then(response => response.json())
      .then(data => {
        setLiveAds(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error loading live ads data:', error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl space-y-8">
        <div className="glass shadow-lg rounded-2xl p-6 border border-border">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  // Calculate key metrics
  const totalAds = liveAds.length
  const totalSpend = liveAds.reduce((sum, ad) => sum + ad.metrics.spend, 0)
  const totalRevenue = liveAds.reduce((sum, ad) => sum + ad.metrics.revenue, 0)
  const avgRoas = liveAds.length > 0 ? liveAds.reduce((sum, ad) => sum + ad.metrics.roas, 0) / liveAds.length : 0
  const avgEngagement = liveAds.length > 0 ? liveAds.reduce((sum, ad) => sum + ad.metrics.engagement_score, 0) / liveAds.length : 0

  // Platform distribution data
  const platformData = liveAds.reduce((acc, ad) => {
    acc[ad.platform] = (acc[ad.platform] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const platformChartData = Object.entries(platformData).map(([platform, count]) => ({
    name: platform.charAt(0).toUpperCase() + platform.slice(1),
    value: count,
    color: platform === 'youtube' ? '#ff0000' : platform === 'meta' ? '#1877f2' : platform === 'tiktok' ? '#000000' : '#6366f1'
  }))

  // Performance grade distribution
  const gradeData = liveAds.reduce((acc, ad) => {
    acc[ad.insights.performance_grade] = (acc[ad.insights.performance_grade] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const gradeChartData = Object.entries(gradeData).map(([grade, count]) => ({
    grade,
    count,
    color: grade === 'A' ? '#10b981' : grade === 'B' ? '#f59e0b' : '#ef4444'
  }))

  // Filter and sort ads
  const filteredAds = liveAds.filter(ad =>
    filterPlatform === 'all' || ad.platform === filterPlatform
  )

  const sortedAds = [...filteredAds].sort((a, b) => {
    if (sortBy === 'roas') return b.metrics.roas - a.metrics.roas
    if (sortBy === 'engagement_score') return b.metrics.engagement_score - a.metrics.engagement_score
    if (sortBy === 'views') return b.metrics.views - a.metrics.views
    if (sortBy === 'spend') return b.metrics.spend - a.metrics.spend
    return 0
  })

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`
  const formatNumber = (num: number) => num.toLocaleString()

  return (
    <div className="max-w-7xl space-y-8">
      {/* Header */}
      <div className="glass shadow-lg rounded-2xl p-6 border border-border">
        <div className="flex items-center">
          <motion.div
            className="w-14 h-14 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg"
          >
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </motion.div>
          <div>
            <h3 className="text-2xl font-bold">Live Ads Dashboard</h3>
            <p className="text-sm text-muted-foreground">Monitor real-time performance of your active campaigns</p>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Active Ads', value: totalAds.toString(), change: '+2 this week', icon: '📺', color: 'from-blue-500 to-blue-600' },
          { title: 'Total Spend', value: formatCurrency(totalSpend), change: '+15% vs last week', icon: '💰', color: 'from-green-500 to-green-600' },
          { title: 'Avg ROAS', value: avgRoas.toFixed(2), change: '+8% improvement', icon: '📈', color: 'from-purple-500 to-purple-600' },
          { title: 'Avg Engagement', value: `${avgEngagement.toFixed(0)}%`, change: '+5% from baseline', icon: '🎯', color: 'from-orange-500 to-orange-600' }
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="glass shadow-lg rounded-2xl p-6 border border-border hover:shadow-xl transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                <p className="text-2xl font-bold mt-1">{metric.value}</p>
                <p className="text-xs text-green-600 font-medium mt-1">{metric.change}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <span className="text-xl">{metric.icon}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Platform Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass shadow-lg rounded-2xl p-6 border border-border"
        >
          <h4 className="text-lg font-semibold mb-4">Platform Distribution</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={platformChartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {platformChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(17, 24, 39, 0.9)',
                  border: '1px solid rgba(75, 85, 99, 0.3)',
                  borderRadius: '8px',
                  color: '#f9fafb'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Performance Grades */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass shadow-lg rounded-2xl p-6 border border-border"
        >
          <h4 className="text-lg font-semibold mb-4">Performance Grades</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={gradeChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="grade" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(17, 24, 39, 0.9)',
                  border: '1px solid rgba(75, 85, 99, 0.3)',
                  borderRadius: '8px',
                  color: '#f9fafb'
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {gradeChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Revenue vs Spend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass shadow-lg rounded-2xl p-6 border border-border"
        >
          <h4 className="text-lg font-semibold mb-4">Revenue vs Spend</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-muted/30 rounded-xl">
              <span className="font-medium">Total Revenue</span>
              <span className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-muted/30 rounded-xl">
              <span className="font-medium">Total Spend</span>
              <span className="text-2xl font-bold text-blue-600">{formatCurrency(totalSpend)}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-muted/30 rounded-xl">
              <span className="font-medium">Net Profit</span>
              <span className={`text-2xl font-bold ${totalRevenue - totalSpend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(totalRevenue - totalSpend)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Top Performing Ads */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="glass shadow-lg rounded-2xl p-6 border border-border"
        >
          <h4 className="text-lg font-semibold mb-4">Top Performing Ads</h4>
          <div className="space-y-3">
            {sortedAds.slice(0, 5).map((ad, index) => (
              <div key={ad._id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium truncate max-w-48">{ad.video_title}</p>
                    <p className="text-xs text-muted-foreground">{ad.platform}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{ad.metrics.roas.toFixed(2)}x ROAS</p>
                  <p className="text-xs text-muted-foreground">{formatCurrency(ad.metrics.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Ads List with Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="glass shadow-lg rounded-2xl p-6 border border-border"
      >
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-semibold">Active Campaigns</h4>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Platform:</label>
              <select
                value={filterPlatform}
                onChange={(e) => setFilterPlatform(e.target.value)}
                className="px-3 py-1 text-sm bg-muted border border-border rounded-lg"
              >
                <option value="all">All Platforms</option>
                <option value="youtube">YouTube</option>
                <option value="meta">Meta</option>
                <option value="tiktok">TikTok</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'roas' | 'engagement_score' | 'views' | 'spend')}
                className="px-3 py-1 text-sm bg-muted border border-border rounded-lg"
              >
                <option value="roas">ROAS</option>
                <option value="engagement_score">Engagement</option>
                <option value="views">Views</option>
                <option value="spend">Spend</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedAds.map((ad) => (
            <motion.div
              key={ad._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="glass shadow-lg rounded-2xl p-4 border border-border hover:shadow-xl transition-all duration-200"
            >
              <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden">
                <Image
                  src={ad.thumbnail_url}
                  alt={ad.video_title}
                  width={400}
                  height={225}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>

              <div className="space-y-3">
                <div>
                  <h5 className="font-semibold text-sm line-clamp-2">{ad.video_title}</h5>
                  <div className="flex items-center justify-between mt-1">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      ad.platform === 'youtube' ? 'bg-red-100 text-red-700' :
                      ad.platform === 'meta' ? 'bg-blue-100 text-blue-700' :
                      ad.platform === 'tiktok' ? 'bg-black text-white' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {ad.platform}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      ad.insights.performance_grade === 'A' ? 'bg-green-100 text-green-700' :
                      ad.insights.performance_grade === 'B' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      Grade {ad.insights.performance_grade}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-muted-foreground">ROAS</p>
                    <p className="font-bold text-green-600">{ad.metrics.roas.toFixed(2)}x</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Spend</p>
                    <p className="font-bold">{formatCurrency(ad.metrics.spend)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Views</p>
                    <p className="font-bold">{formatNumber(ad.metrics.views)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Engagement</p>
                    <p className="font-bold">{ad.metrics.engagement_score}%</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {ad.insights.ai_summary}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}