'use client'

import { motion } from 'framer-motion'
import { CheckCircle, AlertTriangle, XCircle, TrendingUp, Target, Lightbulb, BarChart3, Users, FileText } from 'lucide-react'

interface AnalysisData {
  twelve_labs_summary?: string
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

        <div className="mt-6 bg-muted/30 rounded-xl p-4">
          <h4 className="font-medium mb-2">User-Specific Insights</h4>
          <p className="text-sm text-muted-foreground">{analysisData.personalized_recommendations.user_specific_insights}</p>
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