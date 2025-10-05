/**
 * Fetches a user's profile preferences and generates a natural language summary
 * @param userId - The user's ID
 * @returns A natural language summary of the user's profile and preferences
 */
export async function generateUserProfileSummary(userId: string): Promise<string> {
  try {
    // Check if we're on the server side (in an API route)
    if (typeof window === 'undefined') {
      // Server-side: call the direct database function
      const { generateUserProfileSummaryDirect } = await import('./ai-agent')
      return generateUserProfileSummaryDirect(userId)
    }

    // Client-side: fetch from API
    const response = await fetch(`/api/user-profile?userId=${userId}`)
    const data = await response.json()

    if (!response.ok) {
      console.error('Failed to fetch user profile:', data.error)
      return data.summary || 'Unable to generate profile summary at this time.'
    }

    return data.summary

  } catch (error) {
    console.error('Error generating user profile summary:', error)
    return 'Unable to generate profile summary at this time.'
  }
}