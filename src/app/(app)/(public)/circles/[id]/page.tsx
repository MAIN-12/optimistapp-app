import { getPayload } from 'payload'
import config from '@payload-config'
import { CircleDetail } from '@/components/circles'
import { getMeUser } from '@/utilities/getMeUser'
import { notFound } from 'next/navigation'

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
  const { user } = await getMeUser()
  const circle = await getCircle(id)

  if (!circle) {
    notFound()
  }

  return <CircleDetail circle={circle} userId={user?.id} />
}
