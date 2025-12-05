import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getMeUser } from '@/utilities/getMeUser'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { user } = await getMeUser()

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const payload = await getPayload({ config })

    // Get the circle
    const circle = await payload.findByID({
      collection: 'circles',
      id: Number(id),
      depth: 1,
    })

    if (!circle) {
      return NextResponse.json({ message: 'Circle not found' }, { status: 404 })
    }

    // Check if user is already a member or has a pending request
    const existingMember = circle.members?.find((member) => {
      const memberId = typeof member.user === 'number' ? member.user : member.user?.id
      return memberId === user.id
    })

    if (existingMember) {
      if (existingMember.status === 'pending') {
        return NextResponse.json({ message: 'Request already pending' }, { status: 400 })
      }
      if (existingMember.status === 'active') {
        return NextResponse.json({ message: 'Already a member' }, { status: 400 })
      }
    }

    // Determine status based on circle type
    const status = circle.type === 'public' ? 'active' : 'pending'

    // Add user to members array
    const updatedMembers = [
      ...(circle.members || []),
      {
        user: user.id,
        role: 'member' as const,
        status: status as 'active' | 'pending',
        joinedAt: new Date().toISOString(),
      },
    ]

    // Update the circle
    await payload.update({
      collection: 'circles',
      id: Number(id),
      data: {
        members: updatedMembers,
      },
    })

    return NextResponse.json({
      message: status === 'active' ? 'Successfully joined circle' : 'Join request sent',
      status,
    })
  } catch (error) {
    console.error('Error joining circle:', error)
    return NextResponse.json(
      { message: 'Failed to join circle' },
      { status: 500 }
    )
  }
}
