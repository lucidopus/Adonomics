'use client'

import { motion } from 'framer-motion'
import { CheckCircle, AlertTriangle, XCircle, TrendingUp, Target, Lightbulb, BarChart3, Users, FileText } from 'lucide-react'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

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
  onDecision?: (decision: 'approve' | 'suspend' | 'reject', comments?: string) => void
}

export default function AnalysisDashboard({ analysisData, videoTitle, onDecision }: AnalysisDashboardProps) {
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
      case 'approve': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'suspend': return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case 'reject': return <XCircle className="w-5 h-5 text-red-600" />
      default: return null
    }
  }

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'approve': return 'bg-green-50 border-green-200 text-green-800'
      case 'suspend': return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'reject': return 'bg-red-50 border-red-200 text-red-800'
      default: return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  return (
    <div className="max-w-6xl space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass shadow-lg rounded-2xl p-6 border border-border"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Creative Analysis Report</h2>
            <p className="text-muted-foreground mt-1">
              {videoTitle || 'Video Advertisement Analysis'}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Confidence Score</div>
              <div className="text-2xl font-bold text-primary">
                {analysisData.success_prediction.confidence_score}%
              </div>
            </div>
            <div className={`px-4 py-2 rounded-xl border ${getRiskColor(analysisData.risk_assessment.risk_level)}`}>
              <div className="text-sm font-medium capitalize">
                {analysisData.risk_assessment.risk_level} Risk
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Twelve Labs Summary */}
      {analysisData.twelve_labs_summary && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass shadow-lg rounded-2xl p-6 border border-border"
        >
          <div className="flex items-center mb-6">
            <FileText className="w-6 h-6 text-blue-600 mr-3" />
            <h3 className="text-xl font-semibold">Video Analysis Summary</h3>
            <span className="ml-2 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">Twelve Labs</span>
          </div>

          <div className="bg-muted/30 rounded-xl p-4 border border-border">
            <p className="text-foreground leading-relaxed">{analysisData.twelve_labs_summary}</p>
          </div>
        </motion.div>
      )}

      {/* Metadata */}
      {analysisData.metadata && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="glass shadow-lg rounded-2xl p-6 border border-border"
        >
          <div className="flex items-center mb-6">
            <FileText className="w-6 h-6 text-green-600 mr-3" />
            <h3 className="text-xl font-semibold">Ad Metadata</h3>
            <span className="ml-2 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">Campaign Details</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analysisData.metadata.brand && (
              <div className="bg-muted/30 rounded-lg p-3">
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Brand</div>
                <div className="font-medium">{analysisData.metadata.brand}</div>
              </div>
            )}
            {analysisData.metadata.campaign_name && (
              <div className="bg-muted/30 rounded-lg p-3">
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Campaign</div>
                <div className="font-medium">{analysisData.metadata.campaign_name}</div>
              </div>
            )}
            {analysisData.metadata.year && (
              <div className="bg-muted/30 rounded-lg p-3">
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Year</div>
                <div className="font-medium">{analysisData.metadata.year}</div>
              </div>
            )}
            {analysisData.metadata.quarter && (
              <div className="bg-muted/30 rounded-lg p-3">
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Quarter</div>
                <div className="font-medium">{analysisData.metadata.quarter}</div>
              </div>
            )}
            {analysisData.metadata.platform && (
              <div className="bg-muted/30 rounded-lg p-3">
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Platform</div>
                <div className="font-medium">{analysisData.metadata.platform}</div>
              </div>
            )}
            {analysisData.metadata.region && (
              <div className="bg-muted/30 rounded-lg p-3">
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Region</div>
                <div className="font-medium">{analysisData.metadata.region}</div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Creative Features */}
      {analysisData.creative_features && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.07 }}
          className="glass shadow-lg rounded-2xl p-6 border border-border"
        >
          <div className="flex items-center mb-6">
            <BarChart3 className="w-6 h-6 text-purple-600 mr-3" />
            <h3 className="text-xl font-semibold">Creative Features</h3>
            <span className="ml-2 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">Technical Analysis</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {analysisData.creative_features.scene_id && (
                <div>
                  <div className="text-sm text-muted-foreground">Scene ID</div>
                  <div className="font-medium">{analysisData.creative_features.scene_id}</div>
                </div>
              )}
              {analysisData.creative_features.scene_duration && (
                <div>
                  <div className="text-sm text-muted-foreground">Scene Duration</div>
                  <div className="font-medium">{analysisData.creative_features.scene_duration}s</div>
                </div>
              )}
              {analysisData.creative_features.faces_detected !== undefined && (
                <div>
                  <div className="text-sm text-muted-foreground">Faces Detected</div>
                  <div className="font-medium">{analysisData.creative_features.faces_detected}</div>
                </div>
              )}
              {analysisData.creative_features.brand_logo_presence !== undefined && (
                <div>
                  <div className="text-sm text-muted-foreground">Brand Logo Present</div>
                  <div className="font-medium">{analysisData.creative_features.brand_logo_presence ? 'Yes' : 'No'}</div>
                </div>
              )}
              {analysisData.creative_features.music_tempo && (
                <div>
                  <div className="text-sm text-muted-foreground">Music Tempo</div>
                  <div className="font-medium capitalize">{analysisData.creative_features.music_tempo}</div>
                </div>
              )}
              {analysisData.creative_features.music_mode && (
                <div>
                  <div className="text-sm text-muted-foreground">Music Mode</div>
                  <div className="font-medium capitalize">{analysisData.creative_features.music_mode}</div>
                </div>
              )}
              {analysisData.creative_features.editing_pace && (
                <div>
                  <div className="text-sm text-muted-foreground">Editing Pace</div>
                  <div className="font-medium">{analysisData.creative_features.editing_pace}/10</div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {analysisData.creative_features.objects_present && analysisData.creative_features.objects_present.length > 0 && (
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Objects Present</div>
                  <div className="flex flex-wrap gap-2">
                    {analysisData.creative_features.objects_present.map((obj, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {obj}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {analysisData.creative_features.text_on_screen && analysisData.creative_features.text_on_screen.length > 0 && (
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Text on Screen</div>
                  <div className="flex flex-wrap gap-2">
                    {analysisData.creative_features.text_on_screen.map((text, index) => (
                      <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                        {text}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {analysisData.creative_features.audio_elements && analysisData.creative_features.audio_elements.length > 0 && (
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Audio Elements</div>
                  <div className="flex flex-wrap gap-2">
                    {analysisData.creative_features.audio_elements.map((audio, index) => (
                      <span key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                        {audio}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {analysisData.creative_features.color_palette_dominant && analysisData.creative_features.color_palette_dominant.length > 0 && (
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Dominant Colors</div>
                  <div className="flex gap-2">
                    {analysisData.creative_features.color_palette_dominant.map((color, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: color.toLowerCase() }}
                        ></div>
                        <span className="text-xs capitalize">{color}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Emotional Features */}
      {analysisData.emotional_features && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="glass shadow-lg rounded-2xl p-6 border border-border"
        >
          <div className="flex items-center mb-6">
            <Users className="w-6 h-6 text-pink-600 mr-3" />
            <h3 className="text-xl font-semibold">Emotional Features</h3>
            <span className="ml-2 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">Sentiment Analysis</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {analysisData.emotional_features.emotion_primary && (
                <div>
                  <div className="text-sm text-muted-foreground">Primary Emotion</div>
                  <div className="font-medium capitalize">{analysisData.emotional_features.emotion_primary}</div>
                </div>
              )}
              {analysisData.emotional_features.emotion_intensity && (
                <div>
                  <div className="text-sm text-muted-foreground">Emotion Intensity</div>
                  <div className="font-medium">{analysisData.emotional_features.emotion_intensity}/10</div>
                </div>
              )}
              {analysisData.emotional_features.tone_of_voice && (
                <div>
                  <div className="text-sm text-muted-foreground">Tone of Voice</div>
                  <div className="font-medium capitalize">{analysisData.emotional_features.tone_of_voice}</div>
                </div>
              )}
              {analysisData.emotional_features.audience_perceived_sentiment && (
                <div>
                  <div className="text-sm text-muted-foreground">Audience Sentiment</div>
                  <div className="font-medium capitalize">{analysisData.emotional_features.audience_perceived_sentiment}</div>
                </div>
              )}
              {analysisData.emotional_features.cultural_sensitivity_flag !== undefined && (
                <div>
                  <div className="text-sm text-muted-foreground">Cultural Sensitivity Flag</div>
                  <div className={`font-medium ${analysisData.emotional_features.cultural_sensitivity_flag ? 'text-red-600' : 'text-green-600'}`}>
                    {analysisData.emotional_features.cultural_sensitivity_flag ? '⚠️ Flagged' : '✓ Clear'}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {analysisData.emotional_features.emotional_arc_timeline && analysisData.emotional_features.emotional_arc_timeline.length > 0 && (
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Emotional Arc Timeline</div>
                  <div className="space-y-1">
                    {analysisData.emotional_features.emotional_arc_timeline.map((arc, index) => (
                      <div key={index} className="text-xs bg-muted/30 px-2 py-1 rounded">
                        {arc}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {analysisData.emotional_features.facial_expression_emotions && Object.keys(analysisData.emotional_features.facial_expression_emotions).length > 0 && (
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Facial Expression Emotions</div>
                  <div className="space-y-2">
                    {Object.entries(analysisData.emotional_features.facial_expression_emotions).map(([emotion, intensity]) => (
                      <div key={emotion} className="flex items-center justify-between">
                        <span className="text-xs capitalize">{emotion}</span>
                        <div className="flex items-center gap-1">
                          <div className="w-16 h-2 bg-muted rounded">
                            <div
                              className="h-full bg-pink-500 rounded"
                              style={{ width: `${(intensity as number) * 10}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-muted-foreground">{intensity}/10</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Creative Analysis Charts */}
      {analysisData.creative_features && analysisData.emotional_features && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.09 }}
          className="glass shadow-lg rounded-2xl p-6 border border-border"
        >
          <div className="flex items-center mb-6">
            <BarChart3 className="w-6 h-6 text-indigo-600 mr-3" />
            <h3 className="text-xl font-semibold">Creative Analysis Metrics</h3>
            <span className="ml-2 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">Visualization</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Emotion Intensity Chart */}
            <div className="bg-muted/30 rounded-xl p-4">
              <h4 className="font-medium mb-4 text-center">Emotional Profile</h4>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={[
                  { subject: 'Primary Emotion', A: analysisData.emotional_features.emotion_intensity || 0, fullMark: 10 },
                  { subject: 'Sentiment Score', A: analysisData.emotional_features.audience_perceived_sentiment === 'positive' ? 8 :
                                                   analysisData.emotional_features.audience_perceived_sentiment === 'neutral' ? 5 : 3, fullMark: 10 },
                  { subject: 'Cultural Safety', A: analysisData.emotional_features.cultural_sensitivity_flag ? 2 : 8, fullMark: 10 },
                  { subject: 'Emotional Arc', A: (analysisData.emotional_features.emotional_arc_timeline?.length || 0) * 2, fullMark: 10 }
                ]}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fontSize: 8 }} />
                  <Radar name="Score" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Creative Elements Breakdown */}
            <div className="bg-muted/30 rounded-xl p-4">
              <h4 className="font-medium mb-4 text-center">Creative Elements</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={[
                  { name: 'Faces', value: analysisData.creative_features.faces_detected || 0, color: '#3b82f6' },
                  { name: 'Objects', value: (analysisData.creative_features.objects_present?.length || 0), color: '#10b981' },
                  { name: 'Text', value: (analysisData.creative_features.text_on_screen?.length || 0), color: '#f59e0b' },
                  { name: 'Audio', value: (analysisData.creative_features.audio_elements?.length || 0), color: '#ef4444' }
                ]} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} />
                  <YAxis stroke="#9ca3af" fontSize={10} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      color: '#111827',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      padding: '8px 12px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {[
                      { name: 'Faces', value: analysisData.creative_features.faces_detected || 0, color: '#3b82f6' },
                      { name: 'Objects', value: (analysisData.creative_features.objects_present?.length || 0), color: '#10b981' },
                      { name: 'Text', value: (analysisData.creative_features.text_on_screen?.length || 0), color: '#f59e0b' },
                      { name: 'Audio', value: (analysisData.creative_features.audio_elements?.length || 0), color: '#ef4444' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Color Palette Visualization */}
            {analysisData.creative_features.color_palette_dominant && analysisData.creative_features.color_palette_dominant.length > 0 && (
              <div className="bg-muted/30 rounded-xl p-4">
                <h4 className="font-medium mb-4 text-center">Dominant Colors</h4>
                <div className="flex justify-center space-x-4">
                  {analysisData.creative_features.color_palette_dominant.map((color, index) => (
                    <div key={index} className="text-center">
                      <div
                        className="w-12 h-12 rounded-lg border-2 border-white shadow-md mx-auto mb-2"
                        style={{ backgroundColor: color.toLowerCase() }}
                      ></div>
                      <span className="text-xs text-muted-foreground capitalize">{color}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Metrics */}
            <div className="bg-muted/30 rounded-xl p-4">
              <h4 className="font-medium mb-4 text-center">Technical Metrics</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Scene Duration</span>
                  <span className="font-medium">{analysisData.creative_features.scene_duration || 0}s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Editing Pace</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-muted rounded">
                      <div
                        className="h-full bg-blue-500 rounded"
                        style={{ width: `${((analysisData.creative_features.editing_pace || 0) / 10) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium">{analysisData.creative_features.editing_pace || 0}/10</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Logo Presence</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${analysisData.creative_features.brand_logo_presence ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {analysisData.creative_features.brand_logo_presence ? 'Present' : 'Not Present'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Music Tempo</span>
                  <span className="font-medium capitalize">{analysisData.creative_features.music_tempo || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Success Prediction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass shadow-lg rounded-2xl p-6 border border-border"
      >
        <div className="flex items-center mb-6">
          <TrendingUp className="w-6 h-6 text-green-600 mr-3" />
          <h3 className="text-xl font-semibold">Success Prediction</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Key Strengths</h4>
            <ul className="space-y-2">
              {analysisData.success_prediction.key_strengths.map((strength, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-3">Performance Factors</h4>
            <ul className="space-y-2">
              {analysisData.success_prediction.performance_factors.map((factor, index) => (
                <li key={index} className="flex items-start">
                  <Target className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-muted/30 rounded-xl p-4">
            <h4 className="font-medium mb-2">Audience Fit</h4>
            <p className="text-sm text-muted-foreground">{analysisData.success_prediction.audience_fit}</p>
          </div>
          <div className="bg-muted/30 rounded-xl p-4">
            <h4 className="font-medium mb-2">Competitive Advantage</h4>
            <p className="text-sm text-muted-foreground">{analysisData.success_prediction.competitive_advantage}</p>
          </div>
        </div>
      </motion.div>

      {/* Risk Assessment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass shadow-lg rounded-2xl p-6 border border-border"
      >
        <div className="flex items-center mb-6">
          <AlertTriangle className="w-6 h-6 text-orange-600 mr-3" />
          <h3 className="text-xl font-semibold">Risk Assessment</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3 text-red-700">Potential Issues</h4>
            <ul className="space-y-2">
              {analysisData.risk_assessment.potential_issues.map((issue, index) => (
                <li key={index} className="flex items-start">
                  <XCircle className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{issue}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-3 text-orange-700">Failure Risks</h4>
            <ul className="space-y-2">
              {analysisData.risk_assessment.failure_risks.map((risk, index) => (
                <li key={index} className="flex items-start">
                  <AlertTriangle className="w-4 h-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-medium mb-3 text-green-700">Mitigation Suggestions</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysisData.risk_assessment.mitigation_suggestions.map((suggestion, index) => (
              <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-start">
                  <Lightbulb className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-green-800">{suggestion}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Creative Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass shadow-lg rounded-2xl p-6 border border-border"
      >
        <div className="flex items-center mb-6">
          <BarChart3 className="w-6 h-6 text-purple-600 mr-3" />
          <h3 className="text-xl font-semibold">Creative Analysis</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Storytelling Effectiveness</h4>
              <p className="text-sm text-muted-foreground">{analysisData.creative_analysis.storytelling_effectiveness}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Visual Impact</h4>
              <p className="text-sm text-muted-foreground">{analysisData.creative_analysis.visual_impact}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Emotional Resonance</h4>
              <p className="text-sm text-muted-foreground">{analysisData.creative_analysis.emotional_resonance}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Technical Quality</h4>
              <p className="text-sm text-muted-foreground">{analysisData.creative_analysis.technical_quality}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Competitive Intelligence */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass shadow-lg rounded-2xl p-6 border border-border"
      >
        <div className="flex items-center mb-6">
          <Users className="w-6 h-6 text-blue-600 mr-3" />
          <h3 className="text-xl font-semibold">Competitive Intelligence</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Market Positioning</h4>
              <p className="text-sm text-muted-foreground">{analysisData.competitive_intelligence.market_positioning}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Benchmark Comparison</h4>
              <p className="text-sm text-muted-foreground">{analysisData.competitive_intelligence.benchmark_comparison}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Differentiation Opportunities</h4>
              <p className="text-sm text-muted-foreground">{analysisData.competitive_intelligence.differentiation_opportunities}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Trend Alignment</h4>
              <p className="text-sm text-muted-foreground">{analysisData.competitive_intelligence.trend_alignment}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Personalized Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass shadow-lg rounded-2xl p-6 border border-border"
      >
        <div className="flex items-center mb-6">
          <Lightbulb className="w-6 h-6 text-indigo-600 mr-3" />
          <h3 className="text-xl font-semibold">Personalized Recommendations</h3>
        </div>

        {/* Decision Suggestion */}
        <div className={`mb-6 p-4 rounded-xl border ${getDecisionColor(analysisData.personalized_recommendations.decision_suggestion)}`}>
          <div className="flex items-center">
            {getDecisionIcon(analysisData.personalized_recommendations.decision_suggestion)}
            <span className="ml-2 font-medium capitalize">
              Recommended: {analysisData.personalized_recommendations.decision_suggestion}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Action Items</h4>
            <ul className="space-y-2">
              {analysisData.personalized_recommendations.action_items.map((item, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-3">Optimization Priorities</h4>
            <ul className="space-y-2">
              {analysisData.personalized_recommendations.optimization_priorities.map((priority, index) => (
                <li key={index} className="flex items-start">
                  <Target className="w-4 h-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{priority}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="bg-muted/30 rounded-xl p-4">
            <h4 className="font-medium mb-2">User-Specific Insights</h4>
            <p className="text-sm text-muted-foreground">{analysisData.personalized_recommendations.user_specific_insights}</p>
          </div>

          {analysisData.personalized_recommendations.performance_based_rationale && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
              <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-200">Performance-Based Rationale</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">{analysisData.personalized_recommendations.performance_based_rationale}</p>
            </div>
          )}

          {analysisData.personalized_recommendations.expected_roi_impact && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4">
              <h4 className="font-medium mb-2 text-green-800 dark:text-green-200">Expected ROI Impact</h4>
              <p className="text-sm text-green-700 dark:text-green-300">{analysisData.personalized_recommendations.expected_roi_impact}</p>
            </div>
          )}

          {analysisData.personalized_recommendations.competitive_benchmarking && (
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-xl p-4">
              <h4 className="font-medium mb-2 text-purple-800 dark:text-purple-200">Competitive Benchmarking</h4>
              <p className="text-sm text-purple-700 dark:text-purple-300">{analysisData.personalized_recommendations.competitive_benchmarking}</p>
            </div>
          )}
        </div>

        {/* Decision Buttons */}
        {onDecision && (
          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={() => onDecision('reject')}
              className="px-6 py-2 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 transition-colors"
            >
              Reject
            </button>
            <button
              onClick={() => onDecision('suspend')}
              className="px-6 py-2 rounded-lg border border-yellow-200 text-yellow-700 hover:bg-yellow-50 transition-colors"
            >
              Suspend
            </button>
            <button
              onClick={() => onDecision('approve')}
              className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              Approve
            </button>
          </div>
        )}
      </motion.div>
    </div>
  )
}