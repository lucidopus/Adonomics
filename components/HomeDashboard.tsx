'use client'

import { motion } from 'framer-motion'
import {
  AreaChart,
  Area,
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

// Sample data for charts
const videoAnalyticsData = [
  { month: 'Jan', views: 1200, engagement: 85, conversions: 45 },
  { month: 'Feb', views: 1800, engagement: 92, conversions: 67 },
  { month: 'Mar', views: 2400, engagement: 88, conversions: 89 },
  { month: 'Apr', views: 3100, engagement: 95, conversions: 112 },
  { month: 'May', views: 2800, engagement: 90, conversions: 98 },
  { month: 'Jun', views: 3500, engagement: 97, conversions: 134 }
]

const contentTypeData = [
  { name: 'Product Ads', value: 35, color: '#3b82f6' },
  { name: 'Brand Stories', value: 25, color: '#10b981' },
  { name: 'Tutorials', value: 20, color: '#f59e0b' },
  { name: 'Testimonials', value: 12, color: '#ef4444' },
  { name: 'Others', value: 8, color: '#8b5cf6' }
]

const performanceMetrics = [
  { metric: 'Video Completion Rate', current: 78, target: 85, color: '#3b82f6' },
  { metric: 'Click-through Rate', current: 4.2, target: 5.0, color: '#10b981' },
  { metric: 'Conversion Rate', current: 2.8, target: 3.5, color: '#f59e0b' },
  { metric: 'Engagement Score', current: 92, target: 95, color: '#ef4444' }
]

const audienceDemographics = [
  { age: '18-24', male: 35, female: 45 },
  { age: '25-34', male: 42, female: 38 },
  { age: '35-44', male: 38, female: 32 },
  { age: '45-54', male: 28, female: 22 },
  { age: '55+', male: 18, female: 15 }
]

export default function HomeDashboard() {
  return (
    <div className="max-w-7xl space-y-8">
      {/* Header */}
      <div className="glass shadow-lg rounded-2xl p-6 border border-border">
        <div className="flex items-center">
          <motion.div
            className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg"
          >
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </motion.div>
          <div>
            <h3 className="text-2xl font-bold">Dashboard Overview</h3>
            <p className="text-sm text-muted-foreground">Track your advertising performance and insights</p>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Videos', value: '247', change: '+12%', icon: '🎬', color: 'from-blue-500 to-blue-600' },
          { title: 'Total Views', value: '1.2M', change: '+23%', icon: '👁️', color: 'from-green-500 to-green-600' },
          { title: 'Avg. Engagement', value: '92%', change: '+5%', icon: '📈', color: 'from-purple-500 to-purple-600' },
          { title: 'Conversions', value: '8,450', change: '+18%', icon: '🎯', color: 'from-orange-500 to-orange-600' }
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
                <p className="text-xs text-green-600 font-medium mt-1">{metric.change} from last month</p>
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
        {/* Video Analytics Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass shadow-lg rounded-2xl p-6 border border-border"
        >
          <h4 className="text-lg font-semibold mb-4">Video Performance Trends</h4>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={videoAnalyticsData}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(17, 24, 39, 0.9)',
                  border: '1px solid rgba(75, 85, 99, 0.3)',
                  borderRadius: '8px',
                  color: '#f9fafb'
                }}
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorViews)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="engagement"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorEngagement)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Content Type Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass shadow-lg rounded-2xl p-6 border border-border"
        >
          <h4 className="text-lg font-semibold mb-4">Content Type Distribution</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={contentTypeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {contentTypeData.map((entry, index) => (
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

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass shadow-lg rounded-2xl p-6 border border-border"
        >
          <h4 className="text-lg font-semibold mb-4">Performance Metrics</h4>
          <div className="space-y-4">
            {performanceMetrics.map((metric, index) => (
              <div key={metric.metric} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{metric.metric}</span>
                  <span className="text-sm text-muted-foreground">
                    {metric.current}% / {metric.target}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${(metric.current / metric.target) * 100}%`,
                      backgroundColor: metric.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Audience Demographics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="glass shadow-lg rounded-2xl p-6 border border-border"
        >
          <h4 className="text-lg font-semibold mb-4">Audience Demographics</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={audienceDemographics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="age" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(17, 24, 39, 0.9)',
                  border: '1px solid rgba(75, 85, 99, 0.3)',
                  borderRadius: '8px',
                  color: '#f9fafb'
                }}
              />
              <Legend />
              <Bar dataKey="male" fill="#3b82f6" name="Male" radius={[2, 2, 0, 0]} />
              <Bar dataKey="female" fill="#ec4899" name="Female" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="glass shadow-lg rounded-2xl p-6 border border-border"
      >
        <h4 className="text-lg font-semibold mb-4">Recent Activity</h4>
        <div className="space-y-4">
          {[
            { action: 'Video analyzed', target: 'Samsung Galaxy A Commercial', time: '2 hours ago', type: 'analysis' },
            { action: 'Search performed', target: '"funny cat videos"', time: '4 hours ago', type: 'search' },
            { action: 'Video uploaded', target: 'Product Demo Video', time: '1 day ago', type: 'upload' },
            { action: 'Report generated', target: 'Monthly Performance Report', time: '2 days ago', type: 'report' }
          ].map((activity) => (
            <div key={activity.time} className="flex items-center justify-between py-3 border-b border-border/50 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'analysis' ? 'bg-blue-100 dark:bg-blue-900/20' :
                  activity.type === 'search' ? 'bg-green-100 dark:bg-green-900/20' :
                  activity.type === 'upload' ? 'bg-purple-100 dark:bg-purple-900/20' :
                  'bg-orange-100 dark:bg-orange-900/20'
                }`}>
                  <span className="text-xs">
                    {activity.type === 'analysis' ? '🔍' :
                     activity.type === 'search' ? '🎬' :
                     activity.type === 'upload' ? '📤' : '📊'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.target}</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{activity.time}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}