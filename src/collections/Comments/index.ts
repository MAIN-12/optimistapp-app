import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { anyone } from '../../access/anyone'

export const Comments: CollectionConfig = {
  slug: 'comments',
  access: {
    create: authenticated,
    delete: ({ req: { user } }) => {
      // Users can delete their own comments
      return {
        'author.id': {
          equals: user?.id,
        },
      }
    },
    read: anyone,
    update: ({ req: { user } }) => {
      // Only authors can update their comments
      return {
        'author.id': {
          equals: user?.id,
        },
      }
    },
  },
  admin: {
    useAsTitle: 'content',
    defaultColumns: ['content', 'author', 'message', 'createdAt'],
  },
  fields: [
    {
      name: 'content',
      type: 'textarea',
      required: true,
      maxLength: 1000,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
    },
    {
      name: 'message',
      type: 'text',
      required: true,
      admin: {
        description: 'Message ID this comment belongs to',
      },
    },
    {
      name: 'reactions',
      type: 'array',
      admin: {
        description: 'Embedded reactions for this comment',
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
  ],
  timestamps: true,
}
