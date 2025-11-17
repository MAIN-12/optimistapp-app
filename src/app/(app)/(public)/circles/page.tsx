import { getPayload } from 'payload'
import config from '@payload-config'
import { Circles } from '@/components/circles'
import type { Circle, Category } from '@/payload-types'
import { getMeUser } from '@/utilities/getMeUser'

async function getCircles() {
  const payload = await getPayload({ config })
  
  const { docs: circles } = await payload.find({
    collection: 'circles',
    limit: 100,
    depth: 2,
  })
  
  return circles
}

async function getCategories() {
  const payload = await getPayload({ config })
  
  const { docs: categories } = await payload.find({
    collection: 'categories',
    limit: 50,
  })
  
  return categories
}

export default async function Page() {
  const { user } = await getMeUser()
  const circles = await getCircles()
  const categories = await getCategories()

  return (
    <>
      <Circles circles={circles} categories={categories} userId={user?.id} />
    </>
  )
}
