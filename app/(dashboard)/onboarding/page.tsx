'use client'

import { useEffect, useState } from 'react'

import OnboardingFlow from '@/components/onboarding/OnboardingFlow'
import ThemeToggle from '@/components/ui/ThemeToggle'

export default function OnboardingPage() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
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

        if (response.ok && data.preferences?.onboarding_completed) {
          // User has already completed onboarding, redirect to dashboard
          window.location.href = '/dashboard'
          return
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error)
        // Continue with onboarding if we can't check status
      }

      // User needs to complete onboarding
      setUser(user)
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center animate-fade-in">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-12 h-12 border-2 border-transparent border-t-primary/40 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="mt-6 text-muted-foreground text-lg font-medium">Loading your experience...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.3) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}
        />
      </div>

      {/* Glass morphism header */}
      <div className="glass dark:glass-dark backdrop-blur-xl border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1" />
            <div className="animate-fade-in">
              <ThemeToggle />
            </div>
          </div>
          <div className="text-center animate-slide-in-top">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-2xl mb-6">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-5xl font-bold tracking-tight mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Welcome to Adonomics
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Let&apos;s create your personalized creative analytics experience
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {user && <OnboardingFlow userId={user.id} />}
      </div>
    </div>
  )
}