'use client'

import { useEffect, useState } from 'react'

import Button from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4">
      <div className="max-w-7xl mx-auto py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome to Adonomics</h1>
            <p className="text-muted-foreground">Your creative analytics dashboard</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Video</CardTitle>
              <CardDescription>
                Start analyzing your ad creative
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Upload Video
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>
                View your analysis history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No reports yet. Upload a video to get started.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>
                Manage your preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}