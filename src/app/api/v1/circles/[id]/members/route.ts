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
      return NextResponse.json({ message: 'Only owners and admins can manage members' }, { status: 403 })
    }

    const body = await request.json()
    const { action, memberId, role } = body as {
      action: 'approve' | 'reject' | 'remove' | 'changeRole'
      memberId: string // member array item id
      role?: 'owner' | 'admin' | 'moderator' | 'member'
    }

    if (!action || !memberId) {
      return NextResponse.json({ message: 'action and memberId are required' }, { status: 400 })
    }

    let updatedMembers = [...(circle.members || [])]

    switch (action) {
      case 'approve': {
        updatedMembers = updatedMembers.map((member) => {
          if (member.id === memberId) {
            return { ...member, status: 'active' as const, user: typeof member.user === 'number' ? member.user : member.user?.id }
          }
          return { ...member, user: typeof member.user === 'number' ? member.user : member.user?.id }
        })
        break
      }
      case 'reject': {
        updatedMembers = updatedMembers
          .filter((member) => member.id !== memberId)
          .map((member) => ({
            ...member,
            user: typeof member.user === 'number' ? member.user : member.user?.id,
          }))
        break
      }
      case 'remove': {
        // Can't remove the owner
        const memberToRemove = updatedMembers.find((m) => m.id === memberId)
        if (memberToRemove) {
          const removeUserId = typeof memberToRemove.user === 'number' ? memberToRemove.user : memberToRemove.user?.id
          if (removeUserId === ownerId) {
            return NextResponse.json({ message: 'Cannot remove the circle owner' }, { status: 400 })
          }
        }
        updatedMembers = updatedMembers
          .filter((member) => member.id !== memberId)
          .map((member) => ({
            ...member,
            user: typeof member.user === 'number' ? member.user : member.user?.id,
          }))
        break
      }
      case 'changeRole': {
        if (!role) {
          return NextResponse.json({ message: 'role is required for changeRole action' }, { status: 400 })
        }
        // Only owner can promote to admin/owner
        if ((role === 'owner' || role === 'admin') && !isOwner) {
          return NextResponse.json({ message: 'Only the owner can promote members to admin or owner' }, { status: 403 })
        }
        updatedMembers = updatedMembers.map((member) => {
          if (member.id === memberId) {
            return { ...member, role, user: typeof member.user === 'number' ? member.user : member.user?.id }
          }
          return { ...member, user: typeof member.user === 'number' ? member.user : member.user?.id }
        })
        break
      }
      default:
        return NextResponse.json({ message: 'Invalid action' }, { status: 400 })
    }

    await payload.update({
      collection: 'circles',
      id: Number(id),
      data: {
        members: updatedMembers as any,
      },
    })

    return NextResponse.json({ message: `Member ${action} successful` })
  } catch (error) {
    console.error('Error managing member:', error)
    return NextResponse.json({ message: 'Failed to manage member' }, { status: 500 })
  }
}
