import type { Payload } from 'payload'

export async function seedJournalPrompts(payload: Payload): Promise<void> {
  payload.logger.info('Seeding journal prompts...')

  type PromptCategory =
    | 'reflection'
    | 'gratitude'
    | 'goals'
    | 'relationships'
    | 'growth'
    | 'mindfulness'
    | 'creativity'
    | 'challenges'
    | 'success'
    | 'spirituality'
  type PromptDifficulty = 'beginner' | 'intermediate' | 'advanced'

  const prompts: Array<{
    title: string
    content: string
    category: PromptCategory
    difficulty: PromptDifficulty
    isActive: boolean
  }> = [
    // Reflection (4 prompts)
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

    // Gratitude (4 prompts)
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

    // Goals (4 prompts)
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

    // Relationships (4 prompts)
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
      content: 'What can you do this week to strengthen a relationship that matters to you?',
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

    // Growth (4 prompts)
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

    // Mindfulness (4 prompts)
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
      content: 'Observe your thoughts and emotions without judgment. What patterns emerge?',
      category: 'mindfulness',
      difficulty: 'advanced',
      isActive: true,
    },

    // Creativity (4 prompts)
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

    // Challenges (4 prompts)
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

    // Success (4 prompts)
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
      content: 'Describe a recent success. What specific actions led to this achievement?',
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

    // Spirituality (4 prompts)
    {
      title: 'Spiritual Moment',
      content:
        'Describe a moment today when you felt connected to something greater than yourself.',
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
