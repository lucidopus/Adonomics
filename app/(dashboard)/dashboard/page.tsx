'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

import ThemeToggle from '@/components/ui/ThemeToggle'
import VideoSearch from '@/components/VideoSearch'
import HomeDashboard from '@/components/HomeDashboard'
import LiveAdsDashboard from '@/components/LiveAdsDashboard'


interface User {
  id: string
  email?: string
  name?: string
}

type ActiveView = 'home' | 'profile' | 'search' | 'live-ads'

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [profileSummary, setProfileSummary] = useState<string>('')
  const [activeView, setActiveView] = useState<ActiveView>('home')

  useEffect(() => {
    async function checkAuth() {
      // Check if user is logged in via localStorage
      const userData = localStorage.getItem('user')

      if (!userData) {
        window.location.href = '/login'
        return
      }

      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)

      // Check if user has completed onboarding by fetching from API
      try {
        const response = await fetch(`/api/preferences?userId=${parsedUser.id}`)
        const data = await response.json()

        if (!response.ok || !data.preferences?.onboarding_completed) {
          // User hasn't completed onboarding, redirect to onboarding
          window.location.href = '/onboarding'
          return
        }

        // Generate profile summary via API
        const profileResponse = await fetch(`/api/user-profile?userId=${parsedUser.id}`)
        const profileData = await profileResponse.json()
        setProfileSummary(profileData.summary || 'Unable to load profile summary')
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
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-sm flex flex-col">
        {/* Brand Header */}
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold tracking-tight">Adonomics</h1>
          <p className="text-xs text-muted-foreground mt-1">Creative Intelligence</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveView('home')}
            className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeView === 'home'
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground'
            }`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </button>

          <button
            onClick={() => setActiveView('profile')}
            className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeView === 'profile'
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground'
            }`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Profile
          </button>

           <button
             onClick={() => setActiveView('search')}
             className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
               activeView === 'search'
                 ? 'bg-primary/10 text-primary'
                 : 'text-muted-foreground'
             }`}
           >
             <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
             </svg>
             Creative Insights
           </button>

           <button
             onClick={() => setActiveView('live-ads')}
             className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
               activeView === 'live-ads'
                 ? 'bg-primary/10 text-primary'
                 : 'text-muted-foreground'
             }`}
           >
             <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
             </svg>
             Live Ads
           </button>


          {/* Example for future agents:
          <button
            onClick={() => setActiveView('dashboard')}
            className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeView === 'dashboard'
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
            }`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </button>
          */}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border space-y-2">
          <button
            onClick={() => window.location.href = '/onboarding'}
            className="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header Bar */}
        <header className="border-b border-border bg-card/30 backdrop-blur-sm">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Dashboard</h2>
              <p className="text-sm text-muted-foreground">
                {user?.email || 'Welcome back'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg transition-colors"
                aria-label="Sign out"
              >
                <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area - Views are rendered here based on activeView state */}
        <main className="flex-1 overflow-auto p-8">
          {activeView === 'home' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <HomeDashboard />
            </motion.div>
          )}

          {activeView === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-5xl"
            >
              {/* Profile Header Card */}
              <div className="glass shadow-lg rounded-2xl p-6 border border-border mb-6">
                <div className="flex items-center">
                  <motion.div
                    className="w-14 h-14 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center mr-4 shadow-lg"
                  >
                    <svg className="w-7 h-7 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold">Your Profile</h3>
                    <p className="text-sm text-muted-foreground">Personalized insights based on your preferences</p>
                  </div>
                </div>
              </div>

              {/* Profile Summary Card */}
              <div className="glass shadow-lg rounded-2xl p-8 border border-border">
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-2">Profile Summary</h4>
                  <p className="text-sm text-muted-foreground">
                    This summary is generated based on your onboarding preferences and helps tailor your analytics experience.
                  </p>
                </div>

                <div className="bg-muted/30 dark:bg-muted/10 rounded-xl p-6 border border-border">
                  <p className="text-foreground leading-relaxed">
                    {profileSummary || 'Loading your profile summary...'}
                  </p>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => window.location.href = '/onboarding'}
                    className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium transition-all duration-200 shadow-sm"
                  >
                    Update Preferences
                  </button>
                </div>
              </div>
            </motion.div>
          )}

           {activeView === 'search' && (
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.4 }}
             >
               <VideoSearch />
             </motion.div>
           )}

           {activeView === 'live-ads' && (
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.4 }}
             >
               <LiveAdsDashboard />
             </motion.div>
           )}


         </main>
      </div>
    </div>
  )
}