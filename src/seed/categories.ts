import type { Payload } from 'payload'

export async function seedCategories(payload: Payload): Promise<void> {
  payload.logger.info('Seeding categories...')

  const categories = [
    {
      name: 'Motivation',
      description: 'Inspiring messages to fuel your drive and determination',
      icon: '⭐',
      gradient: 'from-purple-500 to-purple-600',
      bgColor: '#8B5CF6',
    },
    {
      name: 'Gratitude',
      description: "Messages of thankfulness and appreciation for life's blessings",
      icon: '🙏',
      gradient: 'from-green-500 to-teal-600',
      bgColor: '#10B981',
    },
    {
      name: 'Love',
      description: 'Messages of love, care, and compassion for yourself and others',
      icon: '💝',
      gradient: 'from-orange-400 to-orange-600',
      bgColor: '#F97316',
    },
    {
      name: 'Celebration',
      description: 'Messages to celebrate achievements, milestones, and joyful moments',
      icon: '🎉',
      gradient: 'from-blue-500 to-teal-500',
      bgColor: '#3B82F6',
    },
    {
      name: 'Support',
      description: 'Supportive and encouraging messages for difficult times',
      icon: '🤝',
      gradient: 'from-indigo-500 to-purple-600',
      bgColor: '#6366F1',
    },
    {
      name: 'Wellness',
      description: 'Messages focused on health, mindfulness, and self-care',
      icon: '🧘',
      gradient: 'from-teal-500 to-cyan-600',
      bgColor: '#14B8A6',
    },
    {
      name: 'Health',
      description: 'Health and fitness related content',
      icon: '💪',
      gradient: 'from-red-500 to-orange-600',
      bgColor: '#EF4444',
    },
    {
      name: 'Arts',
      description: 'Creative expression and artistic content',
      icon: '🎨',
      gradient: 'from-pink-500 to-violet-600',
      bgColor: '#EC4899',
    },
    {
      name: 'Family',
      description: 'Family-related topics and support',
      icon: '👨‍👩‍👧‍👦',
      gradient: 'from-green-500 to-blue-600',
      bgColor: '#10B981',
    },
    {
      name: 'Literature',
      description: 'Books, reading, and literary discussion',
      icon: '📚',
      gradient: 'from-amber-500 to-orange-600',
      bgColor: '#F59E0B',
    },
  ]

  for (const category of categories) {
    const existing = await payload.find({
      collection: 'categories',
      where: {
        name: {
          equals: category.name,
        },
      },
    })

    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'categories',
        data: category,
      })
      payload.logger.info(`Created category: ${category.name}`)
    }
  }
}
