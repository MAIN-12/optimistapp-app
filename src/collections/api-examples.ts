/**
 * Payload CMS Collections - Quick API Reference
 * 
 * This file provides quick examples for interacting with the new collections
 * via Payload's Local API in your Next.js API routes.
 */

import { COLLECTION_SLUGS } from './constants'

/**
 * ========================================
 * USERS
 * ========================================
 */

// Get current user
const getCurrentUser = async (req: PayloadRequest) => {
  return req.user
}

// Update user profile
const updateUserProfile = async (userId: string, payload: any) => {
  return await payload.update({
    collection: COLLECTION_SLUGS.USERS,
    id: userId,
    data: {
      bio: 'My new bio',
      location: 'New York',
      website: 'https://example.com',
    },
  })
}

/**
 * ========================================
 * CIRCLES
 * ========================================
 */

// Create a new circle
const createCircle = async (userId: string) => {
  return await payload.create({
    collection: COLLECTION_SLUGS.CIRCLES,
    data: {
      name: 'Mental Health Warriors',
      description: 'A supportive community for mental health',
      type: 'public',
      owner: userId,
      icon: '🧠',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      members: [
        {
          user: userId,
          role: 'owner',
          joinedAt: new Date().toISOString(),
        },
      ],
      rules: [
        { rule: 'Be kind and supportive' },
        { rule: 'No spam or self-promotion' },
      ],
      tags: [
        { tag: 'mental-health' },
        { tag: 'support' },
      ],
    },
  })
}

// Add member to circle
const addCircleMember = async (circleId: string, userId: string) => {
  const circle = await payload.findByID({
    collection: COLLECTION_SLUGS.CIRCLES,
    id: circleId,
  })

  return await payload.update({
    collection: COLLECTION_SLUGS.CIRCLES,
    id: circleId,
    data: {
      members: [
        ...circle.members,
        {
          user: userId,
          role: 'member',
          joinedAt: new Date().toISOString(),
        },
      ],
    },
  })
}

// Get user's circles
const getUserCircles = async (userId: string) => {
  return await payload.find({
    collection: COLLECTION_SLUGS.CIRCLES,
    where: {
      or: [
        {
          'owner': {
            equals: userId,
          },
        },
        {
          'members.user': {
            equals: userId,
          },
        },
      ],
    },
  })
}

/**
 * ========================================
 * MESSAGES
 * ========================================
 */

// Create a message
const createMessage = async (userId: string, circleId?: string) => {
  return await payload.create({
    collection: COLLECTION_SLUGS.MESSAGES,
    data: {
      content: 'Sending positive vibes to everyone today! 🌟',
      type: 'positive',
      author: userId,
      circle: circleId, // Optional - leave empty for global message
      isAnonymous: false,
      isDaily: false,
      isPinned: false,
      reactions: [],
      favorites: [],
    },
  })
}

// Add reaction to message
const addReactionToMessage = async (messageId: string, userId: string, reactionType: string) => {
  const message = await payload.findByID({
    collection: COLLECTION_SLUGS.MESSAGES,
    id: messageId,
  })

  // Check if user already reacted
  const existingReaction = message.reactions?.find((r: any) => r.user === userId)
  
  if (existingReaction) {
    // Update existing reaction
    const updatedReactions = message.reactions.map((r: any) => 
      r.user === userId ? { ...r, type: reactionType } : r
    )
    
    return await payload.update({
      collection: COLLECTION_SLUGS.MESSAGES,
      id: messageId,
      data: { reactions: updatedReactions },
    })
  } else {
    // Add new reaction
    return await payload.update({
      collection: COLLECTION_SLUGS.MESSAGES,
      id: messageId,
      data: {
        reactions: [
          ...(message.reactions || []),
          {
            user: userId,
            type: reactionType,
            createdAt: new Date().toISOString(),
          },
        ],
      },
    })
  }
}

// Favorite a message
const favoriteMessage = async (messageId: string, userId: string) => {
  const message = await payload.findByID({
    collection: COLLECTION_SLUGS.MESSAGES,
    id: messageId,
  })

  return await payload.update({
    collection: COLLECTION_SLUGS.MESSAGES,
    id: messageId,
    data: {
      favorites: [
        ...(message.favorites || []),
        {
          user: userId,
          createdAt: new Date().toISOString(),
        },
      ],
    },
  })
}

// Get messages from a circle
const getCircleMessages = async (circleId: string) => {
  return await payload.find({
    collection: COLLECTION_SLUGS.MESSAGES,
    where: {
      circle: {
        equals: circleId,
      },
    },
    sort: '-createdAt',
    limit: 50,
  })
}

// Get global messages (no circle)
const getGlobalMessages = async () => {
  return await payload.find({
    collection: COLLECTION_SLUGS.MESSAGES,
    where: {
      circle: {
        exists: false,
      },
    },
    sort: '-createdAt',
    limit: 50,
  })
}

/**
 * ========================================
 * COMMENTS
 * ========================================
 */

// Add comment to message
const addComment = async (messageId: string, userId: string, content: string) => {
  return await payload.create({
    collection: COLLECTION_SLUGS.COMMENTS,
    data: {
      content,
      author: userId,
      message: messageId,
      reactions: [],
    },
  })
}

// Get comments for a message
const getMessageComments = async (messageId: string) => {
  return await payload.find({
    collection: COLLECTION_SLUGS.COMMENTS,
    where: {
      message: {
        equals: messageId,
      },
    },
    sort: 'createdAt',
  })
}

/**
 * ========================================
 * JOURNAL ENTRIES
 * ========================================
 */

// Create journal entry
const createJournalEntry = async (userId: string) => {
  return await payload.create({
    collection: COLLECTION_SLUGS.JOURNAL_ENTRIES,
    data: {
      title: 'A day of reflection',
      content: 'Today I learned that...',
      mood: 'grateful',
      author: userId,
      tags: [
        { tag: 'gratitude' },
        { tag: 'personal-growth' },
      ],
      isPrivate: true,
      gratefulFor: [
        { item: 'My family' },
        { item: 'Good health' },
        { item: 'New opportunities' },
      ],
      dailyWins: [
        { win: 'Completed a project' },
        { win: 'Helped a friend' },
      ],
    },
  })
}

// Get user's journal entries
const getUserJournalEntries = async (userId: string) => {
  return await payload.find({
    collection: COLLECTION_SLUGS.JOURNAL_ENTRIES,
    where: {
      'author': {
        equals: userId,
      },
    },
    sort: '-createdAt',
  })
}

/**
 * ========================================
 * JOURNAL PROMPTS
 * ========================================
 */

// Get random journal prompt
const getRandomPrompt = async (category?: string, difficulty?: string) => {
  const where: any = {
    isActive: {
      equals: true,
    },
  }

  if (category) {
    where.category = { equals: category }
  }

  if (difficulty) {
    where.difficulty = { equals: difficulty }
  }

  const prompts = await payload.find({
    collection: COLLECTION_SLUGS.JOURNAL_PROMPTS,
    where,
  })

  if (prompts.docs.length === 0) return null

  const randomIndex = Math.floor(Math.random() * prompts.docs.length)
  return prompts.docs[randomIndex]
}

/**
 * ========================================
 * MOOD LOGS
 * ========================================
 */

// Log mood
const logMood = async (userId: string, rating: number, note?: string) => {
  return await payload.create({
    collection: COLLECTION_SLUGS.MOOD_LOGS,
    data: {
      user: userId,
      rating, // 1-5
      note,
    },
  })
}

// Get user's mood history
const getMoodHistory = async (userId: string, days: number = 30) => {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  return await payload.find({
    collection: COLLECTION_SLUGS.MOOD_LOGS,
    where: {
      and: [
        {
          user: {
            equals: userId,
          },
        },
        {
          createdAt: {
            greater_than: startDate.toISOString(),
          },
        },
      ],
    },
    sort: 'createdAt',
  })
}

/**
 * ========================================
 * NOTIFICATIONS
 * ========================================
 */

// Create notification
const createNotification = async (
  recipientId: string,
  type: string,
  title: string,
  message: string,
  senderId?: string,
  entityId?: string,
  entityType?: string
) => {
  return await payload.create({
    collection: COLLECTION_SLUGS.NOTIFICATIONS,
    data: {
      type,
      title,
      message,
      recipient: recipientId,
      sender: senderId,
      entityId,
      entityType,
      status: 'pending',
      isRead: false,
    },
  })
}

// Mark notification as read
const markNotificationAsRead = async (notificationId: string) => {
  return await payload.update({
    collection: COLLECTION_SLUGS.NOTIFICATIONS,
    id: notificationId,
    data: {
      isRead: true,
      status: 'read',
      readAt: new Date().toISOString(),
    },
  })
}

// Get user's unread notifications
const getUnreadNotifications = async (userId: string) => {
  return await payload.find({
    collection: COLLECTION_SLUGS.NOTIFICATIONS,
    where: {
      and: [
        {
          recipient: {
            equals: userId,
          },
        },
        {
          isRead: {
            equals: false,
          },
        },
      ],
    },
    sort: '-createdAt',
  })
}

/**
 * ========================================
 * CATEGORIES
 * ========================================
 */

// Get all categories
const getAllCategories = async () => {
  return await payload.find({
    collection: COLLECTION_SLUGS.CATEGORIES,
    sort: 'name',
  })
}

// Create category
const createCategory = async (name: string, description?: string, icon?: string) => {
  return await payload.create({
    collection: COLLECTION_SLUGS.CATEGORIES,
    data: {
      name,
      description,
      icon,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      bgColor: '#667eea',
    },
  })
}

export {
  // Users
  getCurrentUser,
  updateUserProfile,
  
  // Circles
  createCircle,
  addCircleMember,
  getUserCircles,
  
  // Messages
  createMessage,
  addReactionToMessage,
  favoriteMessage,
  getCircleMessages,
  getGlobalMessages,
  
  // Comments
  addComment,
  getMessageComments,
  
  // Journal
  createJournalEntry,
  getUserJournalEntries,
  getRandomPrompt,
  
  // Mood
  logMood,
  getMoodHistory,
  
  // Notifications
  createNotification,
  markNotificationAsRead,
  getUnreadNotifications,
  
  // Categories
  getAllCategories,
  createCategory,
}
