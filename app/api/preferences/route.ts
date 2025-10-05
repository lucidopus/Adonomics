import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import clientPromise from '@/lib/mongodb/client'
import { UserPreferencesModel, UserPreferences } from '@/lib/mongodb/models/UserPreferences'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db()

    const preferences = await db.collection(UserPreferencesModel.collectionName).findOne({
      user_id: new ObjectId(userId)
    })

    if (!preferences) {
      // Return empty preferences for new users
      const emptyPreferences = UserPreferencesModel.createEmptyPreferences(new ObjectId(userId))
      const responseData = {
        ...emptyPreferences,
        _id: new ObjectId().toString(),
        user_id: userId,
      }
    return NextResponse.json({ preferences: responseData })
    }

    // Convert ObjectId to string for JSON response
    const responseData = {
      ...preferences,
      _id: preferences._id.toString(),
      user_id: preferences.user_id.toString(),
    }

    return NextResponse.json({ preferences: responseData })
  } catch (error) {
    console.error('Preferences route error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, current_step, ...updates } = body

    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db()

    // Prepare update data
    const updateData: Partial<UserPreferences> = {
      updated_at: new Date(),
      ...updates
    }

    // Set current step if provided
    if (current_step !== undefined) {
      updateData.current_step = current_step
    }

    // Update preferences with upsert (create if doesn't exist)
    const result = await db.collection(UserPreferencesModel.collectionName).updateOne(
      { user_id: new ObjectId(user_id) },
      {
        $set: updateData,
        $setOnInsert: {
          user_id: new ObjectId(user_id),
          created_at: new Date(),
        }
      },
      { upsert: true }
    )

    if (result.matchedCount === 0 && result.upsertedCount === 0) {
      return NextResponse.json(
        { error: 'Failed to update preferences' },
        { status: 500 }
      )
    }

    // Fetch updated preferences
    const updatedPreferences = await db.collection(UserPreferencesModel.collectionName).findOne({
      user_id: new ObjectId(user_id)
    })

    const responseData = {
      ...updatedPreferences,
      _id: updatedPreferences!._id.toString(),
      user_id: updatedPreferences!.user_id.toString(),
    }

    return NextResponse.json({ preferences: responseData, success: true })
  } catch (error) {
    console.error('Preferences route error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}