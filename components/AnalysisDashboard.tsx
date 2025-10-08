'use client'

import { motion } from 'framer-motion'
import { CheckCircle, AlertTriangle, XCircle, TrendingUp, Target, Lightbulb, BarChart3, Users, Play, Clock, Eye, Sparkles } from 'lucide-react'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { useState } from 'react'

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

interface AnalysisDashboardProps {
  analysisData: AnalysisData
  videoTitle?: string
  finalDecision?: string
  finalDecisionComments?: string
  onDecision?: (decision: 'approve' | 'suspend' | 'reject', comments?: string) => void
}

export default function AnalysisDashboard({ analysisData, videoTitle, finalDecision, finalDecisionComments, onDecision }: AnalysisDashboardProps) {
  const [decisionComments, setDecisionComments] = useState('')

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return {
        bg: 'from-green-500/10 to-emerald-500/5',
        border: 'border-green-500/30',
        text: 'text-green-600',
        icon: 'bg-green-500'
      }
      case 'medium': return {
        bg: 'from-yellow-500/10 to-amber-500/5',
        border: 'border-yellow-500/30',
        text: 'text-yellow-600',
        icon: 'bg-yellow-500'
      }
      case 'high': return {
        bg: 'from-red-500/10 to-rose-500/5',
        border: 'border-red-500/30',
        text: 'text-red-600',
        icon: 'bg-red-500'
      }
      default: return {
        bg: 'from-gray-500/10 to-slate-500/5',
        border: 'border-gray-500/30',
        text: 'text-gray-600',
        icon: 'bg-gray-500'
      }
    }
  }

  const riskColors = getRiskColor(analysisData.risk_assessment.risk_level)

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden glass rounded-3xl border border-border"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-blue-500/5" />
        <div className="relative p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center space-x-2 mb-3"
              >
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">AI-Powered Analysis</span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2"
              >
                Creative Analysis Report
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground flex items-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>{videoTitle || 'Video Advertisement Analysis'}</span>
              </motion.p>
            </div>

            <div className="flex items-center gap-6">
              {/* Confidence Score */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                className="relative"
              >
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 p-1">
                  <div className="w-full h-full rounded-full bg-background flex items-center justify-center border-4 border-primary/30">
                    <div className="text-center">
                      <div className="text-3xl font-bold bg-gradient-to-br from-primary to-purple-600 bg-clip-text text-transparent">
                        {analysisData.success_prediction.confidence_score}%
                      </div>
                      <div className="text-xs text-muted-foreground font-medium">Confidence</div>
                    </div>
                  </div>
                </div>
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-purple-500/30 blur-xl"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>

              {/* Risk Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                className={`relative px-6 py-4 rounded-2xl border ${riskColors.border} bg-gradient-to-br ${riskColors.bg} backdrop-blur-sm`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${riskColors.icon} animate-pulse`} />
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Risk Level</div>
                    <div className={`text-lg font-bold ${riskColors.text} capitalize`}>
                      {analysisData.risk_assessment.risk_level}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Metadata Pills */}
          {analysisData.metadata && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-6 flex flex-wrap gap-2"
            >
              {analysisData.metadata.brand && (
                <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium">
                  {analysisData.metadata.brand}
                </div>
              )}
              {analysisData.metadata.campaign_name && (
                <div className="px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-sm">
                  {analysisData.metadata.campaign_name}
                </div>
              )}
              {analysisData.metadata.platform && (
                <div className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm">
                  {analysisData.metadata.platform}
                </div>
              )}
              {analysisData.metadata.region && (
                <div className="px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-sm">
                  {analysisData.metadata.region}
                </div>
              )}
              {analysisData.metadata.year && analysisData.metadata.quarter && (
                <div className="px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-sm">
                  {analysisData.metadata.quarter} {analysisData.metadata.year}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Twelve Labs Summary */}
      {analysisData.twelve_labs_summary && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 border border-border"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Video Analysis Summary</h3>
              <p className="text-xs text-muted-foreground">Powered by Twelve Labs AI</p>
            </div>
          </div>
          <p className="text-foreground/90 leading-relaxed">{analysisData.twelve_labs_summary}</p>
        </motion.div>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {analysisData.creative_features?.scene_duration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="glass rounded-xl p-4 border border-border"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{analysisData.creative_features.scene_duration}s</div>
                <div className="text-xs text-muted-foreground flex items-center mt-1">
                  <Clock className="w-3 h-3 mr-1" />
                  Duration
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </motion.div>
        )}

        {analysisData.creative_features?.faces_detected !== undefined && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-xl p-4 border border-border"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{analysisData.creative_features.faces_detected}</div>
                <div className="text-xs text-muted-foreground flex items-center mt-1">
                  <Users className="w-3 h-3 mr-1" />
                  Faces
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </motion.div>
        )}

        {analysisData.creative_features?.objects_present && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            className="glass rounded-xl p-4 border border-border"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{analysisData.creative_features.objects_present.length}</div>
                <div className="text-xs text-muted-foreground flex items-center mt-1">
                  <Target className="w-3 h-3 mr-1" />
                  Objects
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </motion.div>
        )}

        {analysisData.emotional_features?.emotion_intensity && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-xl p-4 border border-border"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{analysisData.emotional_features.emotion_intensity}/10</div>
                <div className="text-xs text-muted-foreground flex items-center mt-1">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Emotion
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500/20 to-pink-600/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-pink-600" />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Success Prediction */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          className="glass rounded-2xl p-6 border border-border"
        >
          <div className="flex items-center space-x-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold">Success Prediction</h3>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Key Strengths</h4>
              <div className="space-y-2">
                {analysisData.success_prediction.key_strengths.map((strength, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="flex items-start space-x-2 text-sm"
                  >
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{strength}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-border">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Performance Factors</h4>
              <div className="space-y-2">
                {analysisData.success_prediction.performance_factors.map((factor, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="flex items-start space-x-2 text-sm"
                  >
                    <Target className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>{factor}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Risk Assessment */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          className="glass rounded-2xl p-6 border border-border"
        >
          <div className="flex items-center space-x-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold">Risk Assessment</h3>
          </div>

          <div className="space-y-4">
            {analysisData.risk_assessment.potential_issues.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-red-600 mb-2">Potential Issues</h4>
                <div className="space-y-2">
                  {analysisData.risk_assessment.potential_issues.map((issue, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className="flex items-start space-x-2 text-sm"
                    >
                      <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>{issue}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {analysisData.risk_assessment.mitigation_suggestions.length > 0 && (
              <div className="pt-3 border-t border-border">
                <h4 className="text-sm font-medium text-green-600 mb-2">Mitigation Strategies</h4>
                <div className="space-y-2">
                  {analysisData.risk_assessment.mitigation_suggestions.map((suggestion, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      className="flex items-start space-x-2 text-sm"
                    >
                      <Lightbulb className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{suggestion}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Visualizations */}
      {analysisData.creative_features && analysisData.emotional_features && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-6 border border-border"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold">Creative Insights</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Emotional Profile Radar */}
            <div className="bg-muted/20 rounded-xl p-5">
              <h4 className="font-medium mb-4 text-center">Emotional Profile</h4>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={[
                  { subject: 'Emotion', value: analysisData.emotional_features.emotion_intensity || 0 },
                  { subject: 'Sentiment', value: analysisData.emotional_features.audience_perceived_sentiment === 'positive' ? 9 : analysisData.emotional_features.audience_perceived_sentiment === 'neutral' ? 5 : 3 },
                  { subject: 'Safety', value: analysisData.emotional_features.cultural_sensitivity_flag ? 3 : 9 },
                  { subject: 'Arc', value: (analysisData.emotional_features.emotional_arc_timeline?.length || 0) * 3 }
                ]}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fill: '#9ca3af', fontSize: 10 }} />
                  <Radar name="Score" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgb(var(--background))',
                      border: '1px solid rgb(var(--border))',
                      borderRadius: '12px'
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Creative Elements Bar Chart */}
            <div className="bg-muted/20 rounded-xl p-5">
              <h4 className="font-medium mb-4 text-center">Creative Elements</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={[
                  { name: 'Faces', value: analysisData.creative_features.faces_detected || 0 },
                  { name: 'Objects', value: analysisData.creative_features.objects_present?.length || 0 },
                  { name: 'Text', value: analysisData.creative_features.text_on_screen?.length || 0 },
                  { name: 'Audio', value: analysisData.creative_features.audio_elements?.length || 0 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgb(var(--background))',
                      border: '1px solid rgb(var(--border))',
                      borderRadius: '12px'
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {[
                      { color: '#3b82f6' },
                      { color: '#10b981' },
                      { color: '#f59e0b' },
                      { color: '#ef4444' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Color Palette */}
          {analysisData.creative_features.color_palette_dominant && analysisData.creative_features.color_palette_dominant.length > 0 && (
            <div className="mt-6 bg-muted/20 rounded-xl p-5">
              <h4 className="font-medium mb-4 text-center">Dominant Color Palette</h4>
              <div className="flex justify-center items-center space-x-4">
                {analysisData.creative_features.color_palette_dominant.map((color, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                    className="text-center"
                  >
                    <div
                      className="w-16 h-16 rounded-2xl shadow-lg border-2 border-white/20"
                      style={{ backgroundColor: color.toLowerCase() }}
                    />
                    <span className="text-xs text-muted-foreground mt-2 block font-mono">{color}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Creative Analysis & Competitive Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Creative Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="glass rounded-2xl p-6 border border-border"
        >
          <div className="flex items-center space-x-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold">Creative Analysis</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {Object.entries(analysisData.creative_analysis).map(([key, value], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="bg-muted/20 rounded-xl p-4"
              >
                <h4 className="text-xs font-medium text-muted-foreground mb-1 capitalize">
                  {key.replace(/_/g, ' ')}
                </h4>
                <p className="text-sm font-medium">{value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Competitive Intelligence */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl p-6 border border-border"
        >
          <div className="flex items-center space-x-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold">Competitive Intelligence</h3>
          </div>

          <div className="space-y-3">
            {Object.entries(analysisData.competitive_intelligence).map(([key, value], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + index * 0.05 }}
                className="bg-muted/20 rounded-xl p-3"
              >
                <h4 className="text-xs font-medium text-muted-foreground mb-1 capitalize">
                  {key.replace(/_/g, ' ')}
                </h4>
                <p className="text-sm">{value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Personalized Recommendations & Decision */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="glass rounded-2xl p-6 border border-border"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold">Personalized Recommendations</h3>
        </div>

         {/* AI Recommendation */}
         <div className={`mb-6 p-5 rounded-2xl border-2 ${
           analysisData.personalized_recommendations.decision_suggestion === 'approve'
             ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/30'
             : analysisData.personalized_recommendations.decision_suggestion === 'reject'
             ? 'bg-gradient-to-br from-red-500/10 to-rose-500/5 border-red-500/30'
             : 'bg-gradient-to-br from-yellow-500/10 to-amber-500/5 border-yellow-500/30'
         }`}>
           <div className="flex items-center space-x-3">
             {analysisData.personalized_recommendations.decision_suggestion === 'approve' && (
               <CheckCircle className="w-6 h-6 text-green-600" />
             )}
             {analysisData.personalized_recommendations.decision_suggestion === 'reject' && (
               <XCircle className="w-6 h-6 text-red-600" />
             )}
             {analysisData.personalized_recommendations.decision_suggestion === 'suspend' && (
               <AlertTriangle className="w-6 h-6 text-yellow-600" />
             )}
             <div>
               <div className="text-sm text-muted-foreground">AI Recommendation</div>
               <div className={`text-lg font-bold capitalize ${
                 analysisData.personalized_recommendations.decision_suggestion === 'approve'
                   ? 'text-green-600'
                   : analysisData.personalized_recommendations.decision_suggestion === 'reject'
                   ? 'text-red-600'
                   : 'text-yellow-600'
               }`}>
                 {analysisData.personalized_recommendations.decision_suggestion}
               </div>
             </div>
           </div>
         </div>

         {/* Final Decision */}
         {finalDecision && (
           <div className={`mb-6 p-5 rounded-2xl border-2 ${
             finalDecision === 'approve'
               ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/30'
               : finalDecision === 'reject'
               ? 'bg-gradient-to-br from-red-500/10 to-rose-500/5 border-red-500/30'
               : 'bg-gradient-to-br from-yellow-500/10 to-amber-500/5 border-yellow-500/30'
           }`}>
             <div className="flex items-center space-x-3">
               {finalDecision === 'approve' && (
                 <CheckCircle className="w-6 h-6 text-green-600" />
               )}
               {finalDecision === 'reject' && (
                 <XCircle className="w-6 h-6 text-red-600" />
               )}
               {finalDecision === 'suspend' && (
                 <AlertTriangle className="w-6 h-6 text-yellow-600" />
               )}
               <div>
                 <div className="text-sm text-muted-foreground">Final Decision</div>
                 <div className={`text-lg font-bold capitalize ${
                   finalDecision === 'approve'
                     ? 'text-green-600'
                     : finalDecision === 'reject'
                     ? 'text-red-600'
                     : 'text-yellow-600'
                 }`}>
                   {finalDecision}
                 </div>
                 <div className="text-sm text-muted-foreground mt-1">
                   {finalDecisionComments || 'No comments added'}
                 </div>
               </div>
             </div>
           </div>
         )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Action Items</h4>
            <div className="space-y-2">
              {analysisData.personalized_recommendations.action_items.map((item, index) => (
                <div key={index} className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Optimization Priorities</h4>
            <div className="space-y-2">
              {analysisData.personalized_recommendations.optimization_priorities.map((priority, index) => (
                <div key={index} className="flex items-start space-x-2 text-sm">
                  <Target className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>{priority}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Insights */}
        <div className="space-y-3 mb-6">
          {analysisData.personalized_recommendations.user_specific_insights && (
            <div className="bg-muted/20 rounded-xl p-4">
              <h4 className="text-sm font-medium mb-2">User-Specific Insights</h4>
              <p className="text-sm text-muted-foreground">{analysisData.personalized_recommendations.user_specific_insights}</p>
            </div>
          )}

          {analysisData.personalized_recommendations.expected_roi_impact && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
              <h4 className="text-sm font-medium text-green-700 mb-2">Expected ROI Impact</h4>
              <p className="text-sm text-green-600">{analysisData.personalized_recommendations.expected_roi_impact}</p>
            </div>
          )}

          {analysisData.personalized_recommendations.competitive_benchmarking && (
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
              <h4 className="text-sm font-medium text-purple-700 mb-2">Competitive Benchmarking</h4>
              <p className="text-sm text-purple-600">{analysisData.personalized_recommendations.competitive_benchmarking}</p>
            </div>
          )}
        </div>

        {/* Decision Buttons */}
        {onDecision && (
          <div className="border-t border-border pt-6">
            <h4 className="text-sm font-medium mb-3">Make Your Decision</h4>
            <textarea
              value={decisionComments}
              onChange={(e) => setDecisionComments(e.target.value)}
              placeholder="Add comments or notes (optional)..."
              className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none mb-4"
              rows={3}
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onDecision('reject', decisionComments)}
                className="flex-1 px-6 py-3 rounded-xl border-2 border-red-200 text-red-700 font-medium hover:bg-red-50 transition-all flex items-center justify-center space-x-2"
              >
                <XCircle className="w-5 h-5" />
                <span>Reject</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onDecision('suspend', decisionComments)}
                className="flex-1 px-6 py-3 rounded-xl border-2 border-yellow-200 text-yellow-700 font-medium hover:bg-yellow-50 transition-all flex items-center justify-center space-x-2"
              >
                <AlertTriangle className="w-5 h-5" />
                <span>Suspend</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onDecision('approve', decisionComments)}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-green-500/30"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Approve</span>
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
