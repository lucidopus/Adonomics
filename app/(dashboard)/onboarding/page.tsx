'use client'

import { useEffect, useState } from 'react'

import OnboardingFlow from '@/components/onboarding/OnboardingFlow'

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Welcome to Adonomics</h1>
          <p className="text-lg text-muted-foreground">
            Let&apos;s personalize your experience
          </p>
        </div>
        {user && <OnboardingFlow userId={user.id} />}
      </div>
    </div>
  )
}