import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // Verify the user is authenticated
    const { userId: authUserId } = await auth()
    if (!authUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the request body
    const body = await request.json()
    const { userId, tier } = body

    // Verify the authenticated user is updating their own tier
    if (authUserId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validate tier value
    const validTiers = ['free', 'silver', 'gold', 'platinum']
    if (!validTiers.includes(tier)) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
    }

    // Update user metadata in Clerk
    const clerk = await clerkClient()
    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        tier
      }
    })

    return NextResponse.json({ success: true, tier })
  } catch (error) {
    console.error('Error updating user tier:', error)
    return NextResponse.json(
      { error: 'Failed to update tier' },
      { status: 500 }
    )
  }
}
