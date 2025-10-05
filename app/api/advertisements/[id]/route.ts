import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import clientPromise from '@/lib/mongodb/client'
import { AdvertisementModel } from '@/lib/mongodb/models/Advertisement'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { decision, decision_comments, status } = body

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid advertisement ID' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db()

    // Prepare update data
    const updateData: {
      updated_at: Date
      decision?: string
      decision_comments?: string
      status?: string
      decision_made_at?: Date
    } = {
      updated_at: new Date()
    }

    if (decision) {
      updateData.decision = decision
      updateData.decision_made_at = new Date()
    }

    if (decision_comments !== undefined) {
      updateData.decision_comments = decision_comments
    }

    if (status) {
      updateData.status = status
    }

    // Update the advertisement
    const result = await db
      .collection(AdvertisementModel.collectionName)
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Advertisement not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Advertisement updated successfully'
    }, { status: 200 })

  } catch (error) {
    console.error('Error updating advertisement:', error)
    return NextResponse.json(
      { error: 'Failed to update advertisement' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid advertisement ID' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db()

    const advertisement = await db
      .collection(AdvertisementModel.collectionName)
      .findOne({ _id: new ObjectId(id) })

    if (!advertisement) {
      return NextResponse.json(
        { error: 'Advertisement not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(advertisement, { status: 200 })

  } catch (error) {
    console.error('Error fetching advertisement:', error)
    return NextResponse.json(
      { error: 'Failed to fetch advertisement' },
      { status: 500 }
    )
  }
}