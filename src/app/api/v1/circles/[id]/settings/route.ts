import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getCurrentUser } from '@/providers/auth/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { user } = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const payload = await getPayload({ config })

    const circle = await payload.findByID({
      collection: 'circles',
      id: Number(id),
      depth: 1,
    })

    if (!circle) {
      return NextResponse.json({ message: 'Circle not found' }, { status: 404 })
    }

    // Check if user is owner or admin
    const ownerId = typeof circle.owner === 'number' ? circle.owner : circle.owner?.id
    const isOwner = ownerId === user.id
    const isAdmin = circle.members?.some((member) => {
      const memberId = typeof member.user === 'number' ? member.user : member.user?.id
      return memberId === user.id && (member.role === 'admin' || member.role === 'owner')
    })

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ message: 'Only owners and admins can update circle settings' }, { status: 403 })
    }

    const body = await request.json()

    // Only allow specific fields to be updated
    const allowedFields: Record<string, unknown> = {}
    const editableKeys = ['name', 'description', 'about', 'type', 'rules', 'tags', 'icon', 'gradient', 'bgColor']
    
    for (const key of editableKeys) {
      if (key in body) {
        allowedFields[key] = body[key]
      }
    }

    const updated = await payload.update({
      collection: 'circles',
      id: Number(id),
      data: allowedFields,
    })

    return NextResponse.json({ message: 'Circle updated successfully', circle: updated })
  } catch (error) {
    console.error('Error updating circle:', error)
    return NextResponse.json({ message: 'Failed to update circle' }, { status: 500 })
  }
}
