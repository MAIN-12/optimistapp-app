import type { Payload } from 'payload'

export const seed = async (payload: Payload): Promise<void> => {
  payload.logger.info('Starting database seed...')

  try {
    // Seed in order due to relationships
    await seedCategories(payload)
    await seedUsers(payload)
    await seedCircles(payload)
    await seedJournalPrompts(payload)
    await seedMessages(payload)

    payload.logger.info('Database seed completed successfully!')
  } catch (error) {
    payload.logger.error('Error seeding database:')
    payload.logger.error(error)
    throw error
  }
}

async function seedCategories(payload: Payload): Promise<void> {
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

async function seedUsers(payload: Payload): Promise<void> {
  payload.logger.info('Seeding users...')

  const users = [
    {
      email: 'sarah.johnson@example.com',
      password: 'password123',
      name: 'Sarah Johnson',
      roles: ['user'] as ('user' | 'admin')[],
    },
    {
      email: 'juan.botero@example.com',
      password: 'password123',
      name: 'Juan Botero',
      roles: ['user'] as ('user' | 'admin')[],
    },
    {
      email: 'maria.garcia@example.com',
      password: 'password123',
      name: 'Maria Garcia',
      roles: ['user'] as ('user' | 'admin')[],
    },
    {
      email: 'david.chen@example.com',
      password: 'password123',
      name: 'David Chen',
      roles: ['user'] as ('user' | 'admin')[],
    },
    {
      email: 'emma.wilson@example.com',
      password: 'password123',
      name: 'Emma Wilson',
      roles: ['user'] as ('user' | 'admin')[],
    },
    {
      email: 'mike.rodriguez@example.com',
      password: 'password123',
      name: 'Mike Rodriguez',
      roles: ['user'] as ('user' | 'admin')[],
    },
    {
      email: 'luna.martinez@example.com',
      password: 'password123',
      name: 'Luna Martinez',
      roles: ['user'] as ('user' | 'admin')[],
    },
    {
      email: 'jennifer.lee@example.com',
      password: 'password123',
      name: 'Jennifer Lee',
      roles: ['user'] as ('user' | 'admin')[],
    },
    {
      email: 'alex.thompson@example.com',
      password: 'password123',
      name: 'Alex Thompson',
      roles: ['user'] as ('user' | 'admin')[],
    },
  ]

  for (const user of users) {
    const existing = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: user.email,
        },
      },
    })

    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'users',
        data: user,
      })
      payload.logger.info(`Created user: ${user.name}`)
    }
  }
}

async function seedCircles(payload: Payload): Promise<void> {
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

async function seedJournalPrompts(payload: Payload): Promise<void> {
  payload.logger.info('Seeding journal prompts...')

  type PromptCategory = 'reflection' | 'gratitude' | 'goals' | 'relationships' | 'growth' | 'mindfulness' | 'creativity' | 'challenges' | 'success' | 'spirituality'
  type PromptDifficulty = 'beginner' | 'intermediate' | 'advanced'

  const prompts: Array<{
    title: string
    content: string
    category: PromptCategory
    difficulty: PromptDifficulty
    isActive: boolean
  }> = [
    // Reflection
    {
      title: 'Daily Reflection',
      content: 'What are three things that brought you joy today, and why were they meaningful?',
      category: 'reflection',
      difficulty: 'beginner',
      isActive: true,
    },
    {
      title: 'Moment of Peace',
      content: 'Describe a moment today when you felt completely at peace. What made it special?',
      category: 'reflection',
      difficulty: 'beginner',
      isActive: true,
    },
    {
      title: 'Personal Growth',
      content:
        'What challenge did you face this week, and what did you learn about yourself from it?',
      category: 'reflection',
      difficulty: 'intermediate',
      isActive: true,
    },
    {
      title: 'Self-Discovery',
      content:
        'If you could describe your current life chapter in one word, what would it be and why?',
      category: 'reflection',
      difficulty: 'advanced',
      isActive: true,
    },

    // Gratitude
    {
      title: 'Simple Gratitude',
      content: 'List five small things you are grateful for today.',
      category: 'gratitude',
      difficulty: 'beginner',
      isActive: true,
    },
    {
      title: 'Grateful for People',
      content:
        'Who made a positive impact on your life recently? Write them a gratitude message.',
      category: 'gratitude',
      difficulty: 'beginner',
      isActive: true,
    },
    {
      title: 'Unexpected Blessings',
      content:
        'What unexpected blessing or surprise came your way this month? How did it make you feel?',
      category: 'gratitude',
      difficulty: 'intermediate',
      isActive: true,
    },
    {
      title: 'Deep Appreciation',
      content:
        'Reflect on a difficult experience that, in hindsight, you are grateful for. What did it teach you?',
      category: 'gratitude',
      difficulty: 'advanced',
      isActive: true,
    },

    // Goals
    {
      title: 'Daily Goals',
      content: 'What is one small goal you want to accomplish today?',
      category: 'goals',
      difficulty: 'beginner',
      isActive: true,
    },
    {
      title: 'Dream Big',
      content: 'If you could achieve anything in the next year, what would it be?',
      category: 'goals',
      difficulty: 'beginner',
      isActive: true,
    },
    {
      title: 'Goal Planning',
      content:
        'Break down one of your big goals into three actionable steps you can take this month.',
      category: 'goals',
      difficulty: 'intermediate',
      isActive: true,
    },
    {
      title: 'Life Vision',
      content:
        'Imagine your ideal life five years from now. What does it look like, and what steps will get you there?',
      category: 'goals',
      difficulty: 'advanced',
      isActive: true,
    },

    // Relationships
    {
      title: 'Connection',
      content: 'Who do you need to reach out to today? What will you say?',
      category: 'relationships',
      difficulty: 'beginner',
      isActive: true,
    },
    {
      title: 'Quality Time',
      content: 'Describe your favorite memory with a loved one. What made it special?',
      category: 'relationships',
      difficulty: 'beginner',
      isActive: true,
    },
    {
      title: 'Relationship Growth',
      content:
        'What can you do this week to strengthen a relationship that matters to you?',
      category: 'relationships',
      difficulty: 'intermediate',
      isActive: true,
    },
    {
      title: 'Deep Connections',
      content:
        'How have your relationships shaped who you are today? What patterns do you notice?',
      category: 'relationships',
      difficulty: 'advanced',
      isActive: true,
    },

    // Growth
    {
      title: 'Learning Today',
      content: 'What is one new thing you learned today?',
      category: 'growth',
      difficulty: 'beginner',
      isActive: true,
    },
    {
      title: 'Comfort Zone',
      content: 'When did you last step out of your comfort zone? How did it feel?',
      category: 'growth',
      difficulty: 'intermediate',
      isActive: true,
    },
    {
      title: 'Skills Development',
      content: 'What skill would you like to develop, and what is your first step to learning it?',
      category: 'growth',
      difficulty: 'intermediate',
      isActive: true,
    },
    {
      title: 'Transformation',
      content:
        'Reflect on how you have transformed in the past year. What experiences catalyzed this growth?',
      category: 'growth',
      difficulty: 'advanced',
      isActive: true,
    },

    // Mindfulness
    {
      title: 'Present Moment',
      content: 'Take five deep breaths and describe how your body feels right now.',
      category: 'mindfulness',
      difficulty: 'beginner',
      isActive: true,
    },
    {
      title: 'Sensory Awareness',
      content: 'What can you see, hear, smell, taste, and touch in this moment?',
      category: 'mindfulness',
      difficulty: 'beginner',
      isActive: true,
    },
    {
      title: 'Mindful Observation',
      content:
        'Choose an everyday object and observe it mindfully for five minutes. What do you notice?',
      category: 'mindfulness',
      difficulty: 'intermediate',
      isActive: true,
    },
    {
      title: 'Inner Landscape',
      content:
        'Observe your thoughts and emotions without judgment. What patterns emerge?',
      category: 'mindfulness',
      difficulty: 'advanced',
      isActive: true,
    },

    // Creativity
    {
      title: 'Creative Expression',
      content: 'Draw, doodle, or describe something that inspires you today.',
      category: 'creativity',
      difficulty: 'beginner',
      isActive: true,
    },
    {
      title: 'Imagination',
      content: 'If you could create anything without limitations, what would you create?',
      category: 'creativity',
      difficulty: 'beginner',
      isActive: true,
    },
    {
      title: 'Creative Problem Solving',
      content:
        'Think of a current challenge. What are three unconventional ways you could approach it?',
      category: 'creativity',
      difficulty: 'intermediate',
      isActive: true,
    },
    {
      title: 'Creative Flow',
      content:
        'Describe a time when you felt completely absorbed in a creative activity. What conditions allowed that flow state?',
      category: 'creativity',
      difficulty: 'advanced',
      isActive: true,
    },

    // Challenges
    {
      title: 'Overcoming Obstacles',
      content: 'What obstacle are you facing right now, and what is one step you can take today?',
      category: 'challenges',
      difficulty: 'beginner',
      isActive: true,
    },
    {
      title: 'Resilience',
      content: 'Describe a time when you overcame something difficult. What strengths did you use?',
      category: 'challenges',
      difficulty: 'intermediate',
      isActive: true,
    },
    {
      title: 'Fear Exploration',
      content: 'What fear is holding you back right now? What would you do if you were not afraid?',
      category: 'challenges',
      difficulty: 'intermediate',
      isActive: true,
    },
    {
      title: 'Adversity and Growth',
      content:
        'How have past challenges shaped your character? What would you tell your past self?',
      category: 'challenges',
      difficulty: 'advanced',
      isActive: true,
    },

    // Success
    {
      title: 'Daily Win',
      content: 'What is one thing you accomplished today that you are proud of?',
      category: 'success',
      difficulty: 'beginner',
      isActive: true,
    },
    {
      title: 'Success Definition',
      content: 'What does success mean to you personally?',
      category: 'success',
      difficulty: 'beginner',
      isActive: true,
    },
    {
      title: 'Achievement Reflection',
      content:
        'Describe a recent success. What specific actions led to this achievement?',
      category: 'success',
      difficulty: 'intermediate',
      isActive: true,
    },
    {
      title: 'Success Journey',
      content:
        'Looking at your life journey, what are you most proud of and why? How has your definition of success evolved?',
      category: 'success',
      difficulty: 'advanced',
      isActive: true,
    },

    // Spirituality
    {
      title: 'Spiritual Moment',
      content: 'Describe a moment today when you felt connected to something greater than yourself.',
      category: 'spirituality',
      difficulty: 'beginner',
      isActive: true,
    },
    {
      title: 'Inner Peace',
      content: 'What spiritual practices help you find peace? How can you incorporate them more?',
      category: 'spirituality',
      difficulty: 'intermediate',
      isActive: true,
    },
    {
      title: 'Purpose Exploration',
      content: 'What do you believe is your purpose or calling in life?',
      category: 'spirituality',
      difficulty: 'intermediate',
      isActive: true,
    },
    {
      title: 'Spiritual Evolution',
      content:
        'How has your spiritual understanding evolved over time? What experiences shaped this journey?',
      category: 'spirituality',
      difficulty: 'advanced',
      isActive: true,
    },
  ]

  for (const prompt of prompts) {
    const existing = await payload.find({
      collection: 'journal-prompts',
      where: {
        title: {
          equals: prompt.title,
        },
      },
    })

    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'journal-prompts',
        data: prompt,
      })
      payload.logger.info(`Created journal prompt: ${prompt.title}`)
    }
  }
}

async function seedMessages(payload: Payload): Promise<void> {
  payload.logger.info('Seeding messages...')

  // Get categories for relationships
  const motivationCategory = await payload.find({
    collection: 'categories',
    where: { name: { equals: 'Motivation' } },
  })
  const gratitudeCategory = await payload.find({
    collection: 'categories',
    where: { name: { equals: 'Gratitude' } },
  })
  const loveCategory = await payload.find({
    collection: 'categories',
    where: { name: { equals: 'Love' } },
  })
  const celebrationCategory = await payload.find({
    collection: 'categories',
    where: { name: { equals: 'Celebration' } },
  })

  // Get users
  const sarah = await payload.find({
    collection: 'users',
    where: { email: { equals: 'sarah.johnson@example.com' } },
  })
  const juan = await payload.find({
    collection: 'users',
    where: { email: { equals: 'juan.botero@example.com' } },
  })
  const maria = await payload.find({
    collection: 'users',
    where: { email: { equals: 'maria.garcia@example.com' } },
  })
  const emma = await payload.find({
    collection: 'users',
    where: { email: { equals: 'emma.wilson@example.com' } },
  })

  const messages = [
    // Motivation messages
    {
      content:
        "Every challenge is an opportunity to grow stronger. You've got this! 💪",
      category: motivationCategory.docs[0]?.id,
      author: sarah.docs[0]?.id,
      type: 'motivation' as const,
      isDaily: true,
    },
    {
      content:
        "Take a moment to appreciate how far you've come. Your progress matters, no matter how small! 🌟",
      category: motivationCategory.docs[0]?.id,
      author: juan.docs[0]?.id,
      type: 'motivation' as const,
      isDaily: true,
    },
    {
      content:
        'Your dreams are valid and achievable. Take one small step today towards making them reality! ✨',
      category: motivationCategory.docs[0]?.id,
      author: juan.docs[0]?.id,
      type: 'motivation' as const,
      isDaily: true,
    },
    {
      content:
        "Success is not final, failure is not fatal. It's the courage to continue that counts! 🚀",
      category: motivationCategory.docs[0]?.id,
      author: emma.docs[0]?.id,
      type: 'motivation' as const,
      isDaily: true,
    },

    // Gratitude messages
    {
      content: 'Gratitude transforms what we have into enough. What are you grateful for today?',
      category: gratitudeCategory.docs[0]?.id,
      author: sarah.docs[0]?.id,
      type: 'gratitude' as const,
      isDaily: true,
    },
    {
      content: "Today's a great day to be thankful! 😊",
      category: gratitudeCategory.docs[0]?.id,
      author: juan.docs[0]?.id,
      type: 'gratitude' as const,
      isDaily: true,
    },
    {
      content: 'Take a moment to appreciate the small things that bring you joy today',
      category: gratitudeCategory.docs[0]?.id,
      author: maria.docs[0]?.id,
      type: 'gratitude' as const,
      isDaily: true,
    },
    {
      content: 'Gratitude is the foundation of abundance. Count your blessings, not your troubles.',
      category: gratitudeCategory.docs[0]?.id,
      author: emma.docs[0]?.id,
      type: 'gratitude' as const,
      isDaily: true,
    },

    // Love messages
    {
      content:
        'You are worthy of all the good things coming your way. Open your heart to receive them! 💖',
      category: loveCategory.docs[0]?.id,
      author: maria.docs[0]?.id,
      type: 'positive' as const,
      isDaily: true,
    },
    {
      content:
        "Sending you love and positive energy for whatever you're facing today. You are loved! ❤️",
      category: loveCategory.docs[0]?.id,
      author: sarah.docs[0]?.id,
      type: 'positive' as const,
      isDaily: true,
    },
    {
      content:
        'Your presence is a gift to this world. Thank you for being you, exactly as you are. 🎁',
      category: loveCategory.docs[0]?.id,
      author: emma.docs[0]?.id,
      type: 'positive' as const,
      isDaily: true,
    },
    {
      content: 'Have an awesome day',
      category: loveCategory.docs[0]?.id,
      author: juan.docs[0]?.id,
      type: 'positive' as const,
      isDaily: true,
    },

    // Celebration messages
    {
      content:
        "Celebrate every small victory on your journey. You're making amazing progress! 🎊",
      category: celebrationCategory.docs[0]?.id,
      author: emma.docs[0]?.id,
      type: 'positive' as const,
      isDaily: true,
    },
    {
      content: 'Today is a day worth celebrating - you made it through another day of growth! 🌟',
      category: celebrationCategory.docs[0]?.id,
      author: sarah.docs[0]?.id,
      type: 'positive' as const,
      isDaily: true,
    },
    {
      content:
        'Your achievements, big or small, deserve recognition. Be proud of yourself! 🏆',
      category: celebrationCategory.docs[0]?.id,
      author: maria.docs[0]?.id,
      type: 'positive' as const,
      isDaily: true,
    },
    {
      content: 'Life is a series of moments worth celebrating. Embrace the joy in today! ✨',
      category: celebrationCategory.docs[0]?.id,
      author: juan.docs[0]?.id,
      type: 'positive' as const,
      isDaily: true,
    },
  ]

  for (const message of messages) {
    if (!message.category || !message.author) {
      payload.logger.warn('Skipping message due to missing relationships')
      continue
    }

    const existing = await payload.find({
      collection: 'messages',
      where: {
        content: {
          equals: message.content,
        },
      },
    })

    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'messages',
        data: message,
      })
      payload.logger.info('Created message')
    }
  }
}
