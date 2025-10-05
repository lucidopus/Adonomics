import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'live'

    const client = await clientPromise
    const db = client.db()

    const advertisements = await db
      .collection('advertisements')
      .find({ status })
      .sort({ updated_at: -1 })
      .toArray()

    return NextResponse.json(advertisements, { status: 200 })
  } catch (error) {
    console.error('Error fetching advertisements:', error)
    return NextResponse.json(
      { error: 'Failed to fetch advertisements' },
      { status: 500 }
    )
  }
}
