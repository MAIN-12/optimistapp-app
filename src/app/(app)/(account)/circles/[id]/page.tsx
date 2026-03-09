import { getPayload } from 'payload'
import config from '@payload-config'
import { CircleDetail } from '@/components/circles'
import { notFound } from 'next/navigation'
import { getCurrentUser } from '@/providers/auth/server'

async function getCircle(id: string) {
  const payload = await getPayload({ config })
  
  try {
    const circle = await payload.findByID({
      collection: 'circles',
      id: Number(id),
      depth: 2,
    })
    
    return circle
  } catch (error) {
    return null
  }
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [{ user }, circle] = await Promise.all([getCurrentUser(), getCircle(id)])

  if (!circle) {
    notFound()
  }

  return <CircleDetail circle={circle} userId={user?.id} />
}
