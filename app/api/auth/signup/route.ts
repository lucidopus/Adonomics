import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb/client'
import { UserModel } from '@/lib/mongodb/models/User'
import { UserPreferencesModel } from '@/lib/mongodb/models/UserPreferences'
import { hashPassword } from '@/lib/auth/password'

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

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Check MongoDB connection
    const client = await clientPromise
    const db = client.db()

    // Check if user already exists
    const existingUser = await db.collection(UserModel.collectionName).findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const userData = UserModel.createUser(email, hashedPassword)
    const result = await db.collection(UserModel.collectionName).insertOne(userData)

    // Create empty user preferences for onboarding
    const emptyPreferences = UserPreferencesModel.createEmptyPreferences(result.insertedId)
    await db.collection(UserPreferencesModel.collectionName).insertOne(emptyPreferences)

    return NextResponse.json({
      user: {
        id: result.insertedId.toString(),
        email: userData.email,
        createdAt: userData.createdAt
      }
    })
  } catch (error) {
    console.error('Signup route error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}