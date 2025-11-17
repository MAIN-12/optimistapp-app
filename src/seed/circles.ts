import type { Payload } from 'payload'

export async function seedCircles(payload: Payload): Promise<void> {
  payload.logger.info('Seeding circles...')

  // Get categories for relationships
  const supportCategory = await payload.find({
    collection: 'categories',
    where: { name: { equals: 'Support' } },
  })
  const wellnessCategory = await payload.find({
    collection: 'categories',
    where: { name: { equals: 'Wellness' } },
  })
  const healthCategory = await payload.find({
    collection: 'categories',
    where: { name: { equals: 'Health' } },
  })
  const artsCategory = await payload.find({
    collection: 'categories',
    where: { name: { equals: 'Arts' } },
  })
  const familyCategory = await payload.find({
    collection: 'categories',
    where: { name: { equals: 'Family' } },
  })
  const literatureCategory = await payload.find({
    collection: 'categories',
    where: { name: { equals: 'Literature' } },
  })

  // Get users for circle owners
  const sarah = await payload.find({
    collection: 'users',
    where: { email: { equals: 'sarah.johnson@example.com' } },
  })
  const david = await payload.find({
    collection: 'users',
    where: { email: { equals: 'david.chen@example.com' } },
  })
  const mike = await payload.find({
    collection: 'users',
    where: { email: { equals: 'mike.rodriguez@example.com' } },
  })
  const luna = await payload.find({
    collection: 'users',
    where: { email: { equals: 'luna.martinez@example.com' } },
  })
  const jennifer = await payload.find({
    collection: 'users',
    where: { email: { equals: 'jennifer.lee@example.com' } },
  })
  const alex = await payload.find({
    collection: 'users',
    where: { email: { equals: 'alex.thompson@example.com' } },
  })

  const circles = [
    {
      name: 'Encourage Circle',
      description: 'Share your heart, find support',
      about:
        'This is a sacred space where our community comes together to support one another through prayer and encouragement. Share your heart, find hope, and discover the power of collective faith.',
      icon: '🙏',
      gradient: 'from-purple-500 to-teal-600',
      bgColor: '#8B5CF6',
      type: 'public' as 'public' | 'private' | 'invite_only',
      owner: sarah.docs[0]?.id,
      category: supportCategory.docs[0]?.id,
    },
    {
      name: 'Mindful Meditation',
      description: 'Daily meditation and mindfulness practices',
      about:
        'Join our daily meditation sessions and mindfulness practices. Find inner peace, reduce stress, and connect with like-minded individuals on a journey of self-discovery.',
      icon: '🧘',
      gradient: 'from-blue-500 to-purple-600',
      bgColor: '#3B82F6',
      type: 'public' as 'public' | 'private' | 'invite_only',
      owner: david.docs[0]?.id,
      category: wellnessCategory.docs[0]?.id,
    },
    {
      name: 'Fitness Warriors',
      description: 'Motivate each other to stay healthy and strong',
      about:
        'A private community for fitness enthusiasts to share workout routines, healthy recipes, and motivate each other on our wellness journey.',
      icon: '💪',
      gradient: 'from-orange-500 to-red-600',
      bgColor: '#F97316',
      type: 'private' as 'public' | 'private' | 'invite_only',
      owner: mike.docs[0]?.id,
      category: healthCategory.docs[0]?.id,
    },
    {
      name: 'Creative Souls',
      description: 'Share art, music, and creative inspiration',
      about:
        'A vibrant community for artists, musicians, writers, and all creative minds to share their work, get feedback, and inspire each other.',
      icon: '🎨',
      gradient: 'from-pink-500 to-violet-600',
      bgColor: '#EC4899',
      type: 'public' as 'public' | 'private' | 'invite_only',
      owner: luna.docs[0]?.id,
      category: artsCategory.docs[0]?.id,
    },
    {
      name: 'Parents Support Network',
      description: 'Supporting parents through the journey',
      about:
        'A private, safe space for parents to share experiences, ask for advice, and support each other through the beautiful and challenging journey of parenthood.',
      icon: '👨‍👩‍👧‍👦',
      gradient: 'from-green-500 to-blue-600',
      bgColor: '#10B981',
      type: 'private' as 'public' | 'private' | 'invite_only',
      owner: jennifer.docs[0]?.id,
      category: familyCategory.docs[0]?.id,
    },
    {
      name: 'Book Lovers Unite',
      description: 'Discover, discuss, and share great reads',
      about:
        'A community for bibliophiles to share book recommendations, discuss favorite reads, and discover new authors and genres.',
      icon: '📚',
      gradient: 'from-amber-500 to-orange-600',
      bgColor: '#F59E0B',
      type: 'public' as 'public' | 'private' | 'invite_only',
      owner: alex.docs[0]?.id,
      category: literatureCategory.docs[0]?.id,
    },
  ]

  for (const circle of circles) {
    if (!circle.owner || !circle.category) {
      payload.logger.warn(`Skipping circle ${circle.name} due to missing relationships`)
      continue
    }

    const existing = await payload.find({
      collection: 'circles',
      where: {
        name: {
          equals: circle.name,
        },
      },
    })

    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'circles',
        data: circle,
      })
      payload.logger.info(`Created circle: ${circle.name}`)
    }
  }
}
