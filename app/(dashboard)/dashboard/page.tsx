'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

import Button from '@/components/ui/Button'
import ThemeToggle from '@/components/ui/ThemeToggle'

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      // Check if user is logged in via localStorage
      const userData = localStorage.getItem('user')

      if (!userData) {
        window.location.href = '/login'
        return
      }

      const user = JSON.parse(userData)

      // Check if user has completed onboarding by fetching from API
      try {
        const response = await fetch(`/api/preferences?userId=${user.id}`)
        const data = await response.json()

        if (!response.ok || !data.preferences?.onboarding_completed) {
          // User hasn't completed onboarding, redirect to onboarding
          window.location.href = '/onboarding'
          return
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error)
        // If we can't check, assume they need onboarding
        window.location.href = '/onboarding'
        return
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [])

   const handleLogout = async () => {
     await fetch('/api/auth/logout', { method: 'POST' })
     // Clear user data and onboarding status from localStorage
     localStorage.removeItem('user')
     localStorage.removeItem('onboarding_completed')
     window.location.href = '/'
   }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center animate-fade-in">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-12 h-12 border-2 border-transparent border-t-primary/40 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="mt-6 text-muted-foreground text-lg font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="relative z-10">
        {/* Glass morphism header */}
        <div className="glass backdrop-blur-xl border-b border-border">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex justify-between items-center animate-slide-in-top">
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-1">
                  Welcome to Adonomics
                </h1>
                <p className="text-muted-foreground text-lg">Your creative analytics dashboard</p>
              </div>
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="px-6 py-3 rounded-2xl font-medium hover:bg-accent transition-all duration-200"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="hover-lift"
            >
              <div className="glass shadow-apple-lg rounded-3xl p-8 h-full border border-border group">
                <div className="flex items-center mb-6">
                  <motion.div
                    className="w-14 h-14 bg-black dark:bg-white rounded-2xl flex items-center justify-center mr-4 shadow-apple-lg"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <svg className="w-7 h-7 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold">Upload Video</h3>
                    <p className="text-muted-foreground text-sm">Start analyzing your ad creative</p>
                  </div>
                </div>
                <Button className="w-full py-3 rounded-2xl font-medium bg-black dark:bg-white text-white dark:text-black hover:opacity-90 shadow-apple-lg transition-all duration-200">
                  Upload Video
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="hover-lift"
            >
              <div className="glass shadow-apple-lg rounded-3xl p-8 h-full border border-border group">
                <div className="flex items-center mb-6">
                  <motion.div
                    className="w-14 h-14 bg-black dark:bg-white rounded-2xl flex items-center justify-center mr-4 shadow-apple-lg"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <svg className="w-7 h-7 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold">Recent Reports</h3>
                    <p className="text-muted-foreground text-sm">View your analysis history</p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  No reports yet. Upload a video to get started.
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="hover-lift"
            >
              <div className="glass shadow-apple-lg rounded-3xl p-8 h-full border border-border group">
                <div className="flex items-center mb-6">
                  <motion.div
                    className="w-14 h-14 bg-black dark:bg-white rounded-2xl flex items-center justify-center mr-4 shadow-apple-lg"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <svg className="w-7 h-7 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold">Settings</h3>
                    <p className="text-muted-foreground text-sm">Manage your preferences</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full py-3 rounded-2xl font-medium hover:bg-accent transition-all duration-200"
                >
                  View Settings
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}