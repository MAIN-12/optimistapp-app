import type { Payload } from 'payload'

export async function seedMessages(payload: Payload): Promise<void> {
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
      content: "Every challenge is an opportunity to grow stronger. You've got this! 💪",
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
      content: 'Your achievements, big or small, deserve recognition. Be proud of yourself! 🏆',
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
