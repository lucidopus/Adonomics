import { NextRequest, NextResponse } from 'next/server'

export async function POST() {
  try {
    // For simple authentication, logout is just clearing client-side state
    // In a real app, you might want to implement token blacklisting
    return NextResponse.json({ message: 'Logged out successfully' })
  } catch (error) {
    console.error('Logout route error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}