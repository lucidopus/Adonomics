import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb/client'
import { UserModel } from '@/lib/mongodb/models/User'
import { verifyPassword } from '@/lib/auth/password'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check MongoDB connection
    const client = await clientPromise
    const db = client.db()

    // Find user by email
    const user = await db.collection(UserModel.collectionName).findOne({ email: email.toLowerCase() })
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Return user data (excluding password)
    return NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        createdAt: user.createdAt
      }
    })
  } catch (error) {
    console.error('Login route error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}