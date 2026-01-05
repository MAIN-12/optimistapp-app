import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { anyone } from '../../access/anyone'

// Field-level access: only author can update
const authorOnly = ({ req: { user }, doc }: any) => {
  if (!user) return false
  // Allow if user is the author
  const authorId = typeof doc?.author === 'object' ? doc?.author?.id : doc?.author
  return user.id === authorId
}

export const Messages: CollectionConfig = {
  slug: 'messages',
  access: {
    create: authenticated,
    delete: ({ req: { user } }) => {
      // Users can delete their own messages
      return {
        'author.id': {
          equals: user?.id,
        },
      }
    },
    read: anyone,
    // Allow any authenticated user to update (for reactions/favorites)
    // Field-level access will protect author-only fields
    update: authenticated,
  },
  admin: {
    useAsTitle: 'content',
    defaultColumns: ['content', 'type', 'author', 'circle', 'createdAt'],
  },
  fields: [
    {
      name: 'content',
      type: 'textarea',
      required: true,
      maxLength: 2000,
      access: {
        update: authorOnly,
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'positive',
      access: {
        update: authorOnly,
      },
      options: [
        {
          label: 'Positive',
          value: 'positive',
        },
        {
          label: 'Prayer',
          value: 'prayer',
        },
        {
          label: 'Encouragement',
          value: 'encouragement',
        },
        {
          label: 'Gratitude',
          value: 'gratitude',
        },
        {
          label: 'Motivation',
          value: 'motivation',
        },
        {
          label: 'Support',
          value: 'support',
        },
        {
          label: 'Announcement',
          value: 'announcement',
        },
      ],
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
      access: {
        update: () => false, // Author cannot be changed
      },
    },
    {
      name: 'circle',
      type: 'relationship',
      relationTo: 'circles',
      hasMany: false,
      access: {
        update: authorOnly,
      },
      admin: {
        description: 'Circle this message belongs to - Leave empty for global messages',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: false,
      access: {
        update: authorOnly,
      },
    },
    {
      name: 'isAnonymous',
      type: 'checkbox',
      defaultValue: false,
      access: {
        update: authorOnly,
      },
      admin: {
        description: 'Hide author name from other users',
      },
    },
    {
      name: 'isDaily',
      type: 'checkbox',
      defaultValue: false,
      access: {
        update: authorOnly,
      },
      admin: {
        description: 'Daily inspirational message',
      },
    },
    {
      name: 'isPinned',
      type: 'checkbox',
      defaultValue: false,
      access: {
        update: authorOnly,
      },
      admin: {
        description: 'Pin this message to the top',
      },
    },
    {
      name: 'reactions',
      type: 'array',
      admin: {
        description: 'Embedded reactions - optimized structure instead of separate collection',
      },
      fields: [
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            {
              label: '👍 Like',
              value: 'like',
            },
            {
              label: '❤️ Love',
              value: 'love',
            },
            {
              label: '🙏 Pray',
              value: 'pray',
            },
            {
              label: '🙌 Grateful',
              value: 'grateful',
            },
            {
              label: '✨ Inspire',
              value: 'inspire',
            },
            {
              label: '🤝 Support',
              value: 'support',
            },
          ],
        },
        {
          name: 'createdAt',
          type: 'date',
          required: true,
          defaultValue: () => new Date().toISOString(),
          admin: {
            date: {
              displayFormat: 'MMM d, yyyy h:mm a',
            },
          },
        },
      ],
    },
    {
      name: 'favorites',
      type: 'array',
      admin: {
        description: 'Users who favorited this message',
      },
      fields: [
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
        {
          name: 'createdAt',
          type: 'date',
          required: true,
          defaultValue: () => new Date().toISOString(),
        },
      ],
    },
  ],
  timestamps: true,
}
