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
  ResponsiveContainer,
  LineChart,
  Line,
  FunnelChart,
  Funnel,
  LabelList
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
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Fetch live advertisements from MongoDB
    fetch('/api/advertisements?status=live')
      .then(response => response.json())
      .then(data => {
        setLiveAds(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error loading advertisements:', error)
        setLoading(false)
      })
  }, [])

  // Detect theme changes
  useEffect(() => {
    const checkTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'))
    }

    // Initial check
    checkTheme()

    // Listen for theme changes
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => observer.disconnect()
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

  // Calculate key metrics with safety checks
  const totalAds = liveAds.length
  const totalSpend = liveAds.reduce((sum, ad) => sum + (ad.metrics?.spend || 0), 0)
  const totalRevenue = liveAds.reduce((sum, ad) => sum + (ad.metrics?.revenue || 0), 0)
  const avgRoas = liveAds.length > 0 ? liveAds.reduce((sum, ad) => sum + (ad.metrics?.roas || 0), 0) / liveAds.length : 0
  const avgEngagement = liveAds.length > 0 ? liveAds.reduce((sum, ad) => sum + (ad.metrics?.engagement_score || 0), 0) / liveAds.length : 0

  // Platform distribution data
  const platformData = liveAds.reduce((acc, ad) => {
    acc[ad.platform] = (acc[ad.platform] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const platformColors: Record<string, string> = {
    youtube: '#ff0000',
    meta: '#1877f2',
    tiktok: '#000000',
    default: '#6366f1'
  }

  const platformChartData = Object.entries(platformData).map(([platform, count]) => ({
    name: platform.charAt(0).toUpperCase() + platform.slice(1),
    value: count,
    color: platformColors[platform] || platformColors.default
  }))

  // Performance grade distribution
  const gradeData = liveAds.reduce((acc, ad) => {
    acc[ad.insights.performance_grade] = (acc[ad.insights.performance_grade] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const gradeColors: Record<string, string> = {
    A: '#10b981',
    B: '#3b82f6',
    C: '#ef4444',
    D: '#f59e0b',
    F: '#dc2626',
    default: '#6b7280'
  }

  const gradeChartData = Object.entries(gradeData).map(([grade, count]) => ({
    grade,
    count,
    color: gradeColors[grade] || gradeColors.default
  }))

  // ROAS Distribution data
  const roasRanges = [
    { range: '0-1x', min: 0, max: 1, color: '#ef4444' },
    { range: '1-2x', min: 1, max: 2, color: '#f97316' },
    { range: '2-3x', min: 2, max: 3, color: '#f59e0b' },
    { range: '3-4x', min: 3, max: 4, color: '#eab308' },
    { range: '4-5x', min: 4, max: 5, color: '#84cc16' },
    { range: '5x+', min: 5, max: Infinity, color: '#22c55e' }
  ]

  const roasDistribution = roasRanges.map(range => ({
    range: range.range,
    count: liveAds.filter(ad => (ad.metrics?.roas || 0) >= range.min && (ad.metrics?.roas || 0) < range.max).length,
    color: range.color
  }))



  // Platform Performance Comparison - Dynamic based on available platforms
  const platformPerformanceData = Object.keys(platformData).map(platform => {
    const platformAds = liveAds.filter(ad => ad.platform === platform)
    return {
      platform: platform.charAt(0).toUpperCase() + platform.slice(1),
      avgRoas: platformAds.length > 0 ? platformAds.reduce((sum, ad) => sum + (ad.metrics?.roas || 0), 0) / platformAds.length : 0,
      avgEngagement: platformAds.length > 0 ? platformAds.reduce((sum, ad) => sum + (ad.metrics?.engagement_score || 0), 0) / platformAds.length : 0,
      avgCtr: platformAds.length > 0 ? platformAds.reduce((sum, ad) => sum + (ad.metrics?.ctr || 0), 0) / platformAds.length : 0,
      totalSpend: platformAds.reduce((sum, ad) => sum + (ad.metrics?.spend || 0), 0),
      totalRevenue: platformAds.reduce((sum, ad) => sum + (ad.metrics?.revenue || 0), 0)
    }
  })



  // Ad Duration Distribution
  const durationRanges = [
    { range: '0-15s', min: 0, max: 15, color: '#3b82f6' },
    { range: '15-30s', min: 15, max: 30, color: '#8b5cf6' },
    { range: '30-60s', min: 30, max: 60, color: '#ec4899' },
    { range: '60s+', min: 60, max: Infinity, color: '#f59e0b' }
  ]

  const durationDistribution = durationRanges.map(range => ({
    range: range.range,
    count: liveAds.filter(ad => (ad.duration_seconds || 0) >= range.min && (ad.duration_seconds || 0) < range.max).length,
    color: range.color
  }))

  // Time series data for ROAS trends (simulated based on upload dates)
  const timeSeriesData = liveAds
    .filter(ad => ad.upload_date) // Filter out ads without upload dates
    .sort((a, b) => new Date(a.upload_date).getTime() - new Date(b.upload_date).getTime())
    .map((ad) => ({
      date: new Date(ad.upload_date).toLocaleDateString(),
      roas: ad.metrics?.roas || 0,
      ctr: ad.metrics?.ctr || 0,
      engagement: ad.metrics?.engagement_score || 0,
      spend: ad.metrics?.spend || 0,
      revenue: ad.metrics?.revenue || 0
    }))

  // Conversion funnel data (aggregated across all ads)
  const totalImpressions = liveAds.reduce((sum, ad) => sum + (ad.metrics?.impressions || 0), 0)
  const totalViews = liveAds.reduce((sum, ad) => sum + (ad.metrics?.views || 0), 0)
  const totalClicks = liveAds.reduce((sum, ad) => sum + (ad.metrics?.clicks || 0), 0)
  const totalConversions = liveAds.reduce((sum, ad) => sum + (ad.metrics?.conversions || 0), 0)

  const funnelData = [
    { name: 'Impressions', value: totalImpressions, fill: '#3b82f6', stroke: '#d1d5db', strokeWidth: 1 },
    { name: 'Views', value: totalViews, fill: '#8b5cf6', stroke: '#d1d5db', strokeWidth: 1 },
    { name: 'Clicks', value: totalClicks, fill: '#f59e0b', stroke: '#d1d5db', strokeWidth: 1 },
    { name: 'Conversions', value: totalConversions, fill: '#10b981', stroke: '#d1d5db', strokeWidth: 1 }
  ]

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
      <div className="glass shadow-lg rounded-2xl p-6 border border-border hover:shadow-xl transition-all duration-300">
        <div className="flex items-center">
          <motion.div
            className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mr-6 shadow-xl"
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </motion.div>
          <div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Live Ads Dashboard
            </h3>
            <p className="text-sm text-muted-foreground mt-1">Monitor real-time performance of your active campaigns</p>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-md">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-sm"></div>
                <span className="text-xs font-semibold text-white">13 Active Campaigns</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-md">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="text-xs font-semibold text-white">Avg ROAS: {avgRoas.toFixed(2)}x</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Active Ads',
            value: totalAds.toString(),
            change: '+2 this week',
            icon: (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            ),
            color: 'from-blue-500 via-blue-600 to-indigo-600',
            bgColor: 'bg-blue-500/10',
            textColor: 'text-blue-600 dark:text-blue-400'
          },
          {
            title: 'Total Spend',
            value: formatCurrency(totalSpend),
            change: '+15% vs last week',
            icon: (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
            color: 'from-emerald-500 via-green-600 to-teal-600',
            bgColor: 'bg-emerald-500/10',
            textColor: 'text-emerald-600 dark:text-emerald-400'
          },
          {
            title: 'Avg ROAS',
            value: avgRoas.toFixed(2) + 'x',
            change: '+8% improvement',
            icon: (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            ),
            color: 'from-purple-500 via-purple-600 to-pink-600',
            bgColor: 'bg-purple-500/10',
            textColor: 'text-purple-600 dark:text-purple-400'
          },
          {
            title: 'Avg Engagement',
            value: `${avgEngagement.toFixed(0)}%`,
            change: '+5% from baseline',
            icon: (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            ),
            color: 'from-orange-500 via-orange-600 to-red-600',
            bgColor: 'bg-orange-500/10',
            textColor: 'text-orange-600 dark:text-orange-400'
          }
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="relative overflow-hidden glass shadow-lg rounded-2xl p-6 border border-border hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
          >
            {/* Gradient overlay on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

            <div className="relative flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-2">{metric.title}</p>
                <p className="text-3xl font-bold mb-1 tracking-tight">{metric.value}</p>
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  <p className="text-xs text-green-600 dark:text-green-500 font-semibold">{metric.change}</p>
                </div>
              </div>
              <div className={`w-14 h-14 bg-gradient-to-br ${metric.color} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                {metric.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid - Optimized UX with max 3 charts per row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Platform Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass shadow-lg rounded-2xl p-6 border border-border hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              Where Ads Run
            </h4>
            <span className="text-sm text-muted-foreground">{totalAds} campaigns</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={platformChartData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {platformChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
               </Pie>
               <Tooltip
                 contentStyle={{
                   backgroundColor: '#ffffff',
                   border: '2px solid #e5e7eb',
                   borderRadius: '12px',
                   color: '#111827',
                   boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                   padding: '12px 16px',
                   fontWeight: '500'
                 }}
                 formatter={(value) => [`${value} campaigns`, 'Count']}
               />
             </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center mt-2">
            <div className="flex gap-4 text-xs">
              {platformChartData.map((item, index) => (
                <div key={index} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Performance Grades */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass shadow-lg rounded-2xl p-6 border border-border hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              Campaign Quality
            </h4>
            <span className="text-sm text-muted-foreground">{gradeChartData.reduce((sum, grade) => sum + grade.count, 0)} graded</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={gradeChartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis dataKey="grade" stroke="#9ca3af" fontSize={12} />
               <YAxis stroke="#9ca3af" fontSize={11} />
               <Tooltip
                 contentStyle={{
                   backgroundColor: '#ffffff',
                   border: '2px solid #e5e7eb',
                   borderRadius: '12px',
                   color: '#111827',
                   boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                   padding: '12px 16px',
                   fontWeight: '500'
                 }}
                 formatter={(value) => [`${value} campaigns`, 'Count']}
               />
               <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {gradeChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-center mt-2">
            <div className="flex gap-4 text-xs">
              {gradeChartData.map((item, index) => (
                <div key={index} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-muted-foreground">Grade {item.grade}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>



        {/* Platform Performance Comparison */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="glass shadow-lg rounded-2xl p-6 border border-border hover:shadow-xl transition-all duration-300"
        >
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Platform Performance
          </h4>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={platformPerformanceData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis dataKey="platform" stroke="#9ca3af" fontSize={11} />
              <YAxis stroke="#9ca3af" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  color: '#111827',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  padding: '12px 16px',
                  fontWeight: '500'
                }}
                formatter={(value, name) => [
                  name === 'avgRoas' ? `${Number(value).toFixed(2)}x` :
                  name === 'avgEngagement' ? `${Number(value).toFixed(0)}%` :
                  name === 'avgCtr' ? `${Number(value).toFixed(2)}%` :
                  formatCurrency(value as number),
                  name === 'avgRoas' ? 'Avg ROAS' :
                  name === 'avgEngagement' ? 'Avg Engagement' :
                  name === 'avgCtr' ? 'Avg CTR' :
                  name === 'totalSpend' ? 'Total Spend' : 'Total Revenue'
                ]}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="avgRoas" fill="#10b981" name="Avg ROAS" radius={[2, 2, 0, 0]} />
              <Bar dataKey="avgEngagement" fill="#f59e0b" name="Avg Engagement" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* ROAS Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="glass shadow-lg rounded-2xl p-6 border border-border hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold flex items-center gap-2">
              <div className="w-8 h-8 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              ROAS Performance
            </h4>
            <span className="text-sm text-muted-foreground">{totalAds} campaigns</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={roasDistribution} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis dataKey="range" stroke="#9ca3af" fontSize={11} />
              <YAxis stroke="#9ca3af" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  color: '#111827',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  padding: '12px 16px',
                  fontWeight: '500'
                }}
                formatter={(value) => [`${value} campaigns`, 'Count']}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {roasDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-center mt-2">
            <div className="flex gap-4 text-xs">
              {roasDistribution.map((item, index) => (
                <div key={index} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-muted-foreground">{item.range}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Ad Duration Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="glass shadow-lg rounded-2xl p-6 border border-border hover:shadow-xl transition-all duration-300"
        >
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Ad Duration Distribution
          </h4>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={durationDistribution} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis dataKey="range" stroke="#9ca3af" fontSize={11} />
              <YAxis stroke="#9ca3af" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  color: '#111827',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  padding: '12px 16px',
                  fontWeight: '500'
                }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {durationDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>


        {/* Revenue vs Spend Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="glass shadow-lg rounded-2xl p-6 border border-border hover:shadow-xl transition-all duration-300"
        >
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Financial Summary
          </h4>
          <div className="space-y-4">
            <div className="relative overflow-hidden flex justify-between items-center p-4 bg-gradient-to-r from-green-500/10 via-emerald-500/5 to-green-500/10 border border-green-500/20 rounded-xl group hover:shadow-lg hover:scale-105 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <span className="font-semibold text-foreground">Total Revenue</span>
                  <p className="text-xs text-muted-foreground">Generated from campaigns</p>
                </div>
              </div>
              <span className="text-3xl font-bold text-green-600 dark:text-green-400">{formatCurrency(totalRevenue)}</span>
            </div>

            <div className="relative overflow-hidden flex justify-between items-center p-4 bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-blue-500/10 border border-blue-500/20 rounded-xl group hover:shadow-lg hover:scale-105 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                </div>
                <div>
                  <span className="font-semibold text-foreground">Total Spend</span>
                  <p className="text-xs text-muted-foreground">Invested in advertising</p>
                </div>
              </div>
              <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(totalSpend)}</span>
            </div>

            <div className="relative overflow-hidden flex justify-between items-center p-4 bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-purple-500/10 border border-purple-500/20 rounded-xl group hover:shadow-lg hover:scale-105 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${totalRevenue - totalSpend >= 0 ? 'bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600' : 'bg-gradient-to-br from-red-500 via-red-600 to-orange-600'} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <span className="font-semibold text-foreground">Net Profit</span>
                  <p className="text-xs text-muted-foreground">Revenue minus spend</p>
                </div>
              </div>
              <span className={`text-3xl font-bold ${totalRevenue - totalSpend >= 0 ? 'text-purple-600 dark:text-purple-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatCurrency(totalRevenue - totalSpend)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* ROAS Time Series Trend */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="glass shadow-lg rounded-2xl p-6 border border-border hover:shadow-xl transition-all duration-300"
        >
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            ROAS Trends Over Time
          </h4>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={timeSeriesData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis
                dataKey="date"
                stroke="#9ca3af"
                fontSize={11}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#9ca3af" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  color: '#111827',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  padding: '12px 16px',
                  fontWeight: '500'
                }}
                formatter={(value, name) => [
                  name === 'roas' ? `${Number(value).toFixed(2)}x` :
                  name === 'ctr' ? `${Number(value).toFixed(2)}%` :
                  name === 'engagement' ? `${Number(value)}%` :
                  formatCurrency(value as number),
                  name === 'roas' ? 'ROAS' :
                  name === 'ctr' ? 'CTR' :
                  name === 'engagement' ? 'Engagement' :
                  name === 'spend' ? 'Spend' : 'Revenue'
                ]}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Line
                type="monotone"
                dataKey="roas"
                stroke="#14b8a6"
                strokeWidth={3}
                dot={{ fill: '#14b8a6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#14b8a6', strokeWidth: 2 }}
                name="ROAS"
              />
              <Line
                type="monotone"
                dataKey="ctr"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 3 }}
                name="CTR"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Conversion Funnel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.3 }}
          className="glass shadow-lg rounded-2xl p-6 border border-border hover:shadow-xl transition-all duration-300"
        >
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            Conversion Funnel
          </h4>
          <ResponsiveContainer width="100%" height={280}>
            <FunnelChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  color: '#111827',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  padding: '12px 16px',
                  fontWeight: '500'
                }}
                formatter={(value) => [formatNumber(value as number), 'Count']}
              />
              <Funnel
                dataKey="value"
                data={funnelData}
                isAnimationActive
                animationBegin={0}
                animationDuration={800}
              >
                <LabelList
                  position="center"
                  fill={isDarkMode ? "#ffffff" : "#374151"}
                  fontSize={13}
                  fontWeight="500"
                  formatter={(value: any) => formatNumber(value as number)}
                />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
            <div className="text-center">
              <p className="text-muted-foreground">Conversion Rate</p>
              <p className="font-bold text-green-600">{((totalConversions / totalImpressions) * 100).toFixed(2)}%</p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground">Click Rate</p>
              <p className="font-bold text-blue-600">{((totalClicks / totalViews) * 100).toFixed(2)}%</p>
            </div>
          </div>
        </motion.div>

        {/* Top Performing Ads */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.4 }}
          className="glass shadow-lg rounded-2xl p-6 border border-border hover:shadow-xl transition-all duration-300"
        >
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Top Performing Ads
          </h4>
          <div className="space-y-3">
            {sortedAds.slice(0, 5).map((ad, index) => (
              <div key={ad._id} className="flex items-center justify-between p-4 bg-gradient-to-r from-muted/30 via-muted/20 to-muted/30 border border-border/50 rounded-xl hover:shadow-lg hover:border-primary/30 hover:scale-102 transition-all duration-200 group">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${index === 0 ? 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600' : index === 1 ? 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500' : index === 2 ? 'bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600' : 'bg-gradient-to-br from-primary/20 via-primary/30 to-primary/40'} rounded-full flex items-center justify-center text-sm font-bold ${index < 3 ? 'text-white' : 'text-primary'} shadow-lg group-hover:scale-110 transition-transform`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate max-w-48 group-hover:text-primary transition-colors">{ad.video_title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2.5 py-1 text-xs rounded-full font-medium shadow-sm ${
                        ad.platform === 'youtube' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' :
                        ad.platform === 'meta' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' :
                        ad.platform === 'tiktok' ? 'bg-gradient-to-r from-black to-gray-900 text-white' :
                        'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                      }`}>
                        {ad.platform.charAt(0).toUpperCase() + ad.platform.slice(1)}
                      </span>
                      <span className={`px-2.5 py-1 text-xs rounded-full font-bold shadow-sm ${
                        ad.insights.performance_grade === 'A' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' :
                        ad.insights.performance_grade === 'B' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' :
                        ad.insights.performance_grade === 'C' ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white' :
                        ad.insights.performance_grade === 'D' ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white' :
                        'bg-gradient-to-r from-red-500 to-pink-600 text-white'
                      }`}>
                        Grade {ad.insights.performance_grade}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">{ad.metrics.roas.toFixed(2)}x</p>
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
                  <h5 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">{ad.video_title}</h5>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full shadow-sm ${
                      ad.platform === 'youtube' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' :
                      ad.platform === 'meta' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' :
                      ad.platform === 'tiktok' ? 'bg-gradient-to-r from-black to-gray-900 text-white' :
                      'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                    }`}>
                      {ad.platform.charAt(0).toUpperCase() + ad.platform.slice(1)}
                    </span>
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full shadow-sm ${
                      ad.insights.performance_grade === 'A' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' :
                      ad.insights.performance_grade === 'B' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' :
                      'bg-gradient-to-r from-red-500 to-pink-600 text-white'
                    }`}>
                      {ad.insights.performance_grade}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2.5 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-700/30 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-0.5">ROAS</p>
                    <p className="font-bold text-sm text-green-700 dark:text-green-400">{ad.metrics.roas.toFixed(2)}x</p>
                  </div>
                  <div className="p-2.5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/50 dark:border-blue-700/30 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-0.5">Spend</p>
                    <p className="font-bold text-sm text-blue-700 dark:text-blue-400">{formatCurrency(ad.metrics.spend)}</p>
                  </div>
                  <div className="p-2.5 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200/50 dark:border-purple-700/30 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-0.5">Views</p>
                    <p className="font-bold text-sm text-purple-700 dark:text-purple-400">{formatNumber(ad.metrics.views)}</p>
                  </div>
                  <div className="p-2.5 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200/50 dark:border-orange-700/30 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-0.5">Engagement</p>
                    <p className="font-bold text-sm text-orange-700 dark:text-orange-400">{ad.metrics.engagement_score}%</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/50">
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
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