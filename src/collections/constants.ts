/**
 * Collection Slugs Reference
 * 
 * Use these slug constants when working with Payload collections
 * to ensure type safety and consistency across your application.
 */

export const COLLECTION_SLUGS = {
  // Core Collections
  USERS: 'users',
  MEDIA: 'media',
  CATEGORIES: 'categories',
  
  // Social Features
  CIRCLES: 'circles',
  MESSAGES: 'messages',
  COMMENTS: 'comments',
  
  // Journaling & Wellness
  JOURNAL_ENTRIES: 'journal-entries',
  JOURNAL_PROMPTS: 'journal-prompts',
  MOOD_LOGS: 'mood-logs',
  DAILY_MESSAGES: 'daily-messages',
  
  // System
  NOTIFICATIONS: 'notifications',
} as const

export type CollectionSlug = typeof COLLECTION_SLUGS[keyof typeof COLLECTION_SLUGS]

/**
 * Message Types
 */
export const MESSAGE_TYPES = {
  POSITIVE: 'positive',
  PRAYER: 'prayer',
  ENCOURAGEMENT: 'encouragement',
  GRATITUDE: 'gratitude',
  MOTIVATION: 'motivation',
  SUPPORT: 'support',
  ANNOUNCEMENT: 'announcement',
} as const

/**
 * Reaction Types
 */
export const REACTION_TYPES = {
  LIKE: 'like',
  LOVE: 'love',
  PRAY: 'pray',
  GRATEFUL: 'grateful',
  INSPIRE: 'inspire',
  SUPPORT: 'support',
} as const

/**
 * Circle Types
 */
export const CIRCLE_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  INVITE_ONLY: 'invite_only',
} as const

/**
 * Circle Member Roles
 */
export const CIRCLE_ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  MEMBER: 'member',
} as const

/**
 * Journal Moods
 */
export const JOURNAL_MOODS = {
  VERY_HAPPY: 'very_happy',
  HAPPY: 'happy',
  NEUTRAL: 'neutral',
  SAD: 'sad',
  VERY_SAD: 'very_sad',
  ANXIOUS: 'anxious',
  PEACEFUL: 'peaceful',
  GRATEFUL: 'grateful',
  EXCITED: 'excited',
  REFLECTIVE: 'reflective',
} as const

/**
 * Journal Prompt Categories
 */
export const PROMPT_CATEGORIES = {
  REFLECTION: 'reflection',
  GRATITUDE: 'gratitude',
  GOALS: 'goals',
  RELATIONSHIPS: 'relationships',
  GROWTH: 'growth',
  MINDFULNESS: 'mindfulness',
  CREATIVITY: 'creativity',
  CHALLENGES: 'challenges',
  SUCCESS: 'success',
  SPIRITUALITY: 'spirituality',
} as const

/**
 * Prompt Difficulty Levels
 */
export const PROMPT_DIFFICULTY = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
} as const

/**
 * Notification Types
 */
export const NOTIFICATION_TYPES = {
  MESSAGE_LIKE: 'message_like',
  MESSAGE_COMMENT: 'message_comment',
  CIRCLE_INVITATION: 'circle_invitation',
  CIRCLE_JOIN_REQUEST: 'circle_join_request',
  DAILY_REMINDER: 'daily_reminder',
  WEEKLY_SUMMARY: 'weekly_summary',
  SYSTEM_ANNOUNCEMENT: 'system_announcement',
} as const

/**
 * Notification Status
 */
export const NOTIFICATION_STATUS = {
  PENDING: 'pending',
  DELIVERED: 'delivered',
  READ: 'read',
  FAILED: 'failed',
} as const

/**
 * User Roles
 */
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const
