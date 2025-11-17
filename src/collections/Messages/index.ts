import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { anyone } from '../../access/anyone'

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
    update: ({ req: { user } }) => {
      // Only authors or admins can update
      return {
        or: [
          {
            'author.id': {
              equals: user?.id,
            },
          },
        ],
      }
    },
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
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'positive',
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
    },
    {
      name: 'circle',
      type: 'text',
      admin: {
        description: 'Circle ID - Leave empty for global messages',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: false,
    },
    {
      name: 'isAnonymous',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Hide author name from other users',
      },
    },
    {
      name: 'isDaily',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Daily inspirational message',
      },
    },
    {
      name: 'isPinned',
      type: 'checkbox',
      defaultValue: false,
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
