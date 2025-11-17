import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const MoodLogs: CollectionConfig = {
  slug: 'mood-logs',
  access: {
    create: authenticated,
    delete: ({ req: { user } }) => {
      // Users can only delete their own mood logs
      return {
        'user.id': {
          equals: user?.id,
        },
      }
    },
    read: ({ req: { user } }) => {
      // Users can only read their own mood logs
      return {
        'user.id': {
          equals: user?.id,
        },
      }
    },
    update: ({ req: { user } }) => {
      // Users can only update their own mood logs
      return {
        'user.id': {
          equals: user?.id,
        },
      }
    },
  },
  admin: {
    useAsTitle: 'rating',
    defaultColumns: ['rating', 'user', 'note', 'createdAt'],
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
      admin: {
        description: 'Mood rating from 1 (lowest) to 5 (highest)',
        step: 1,
      },
    },
    {
      name: 'note',
      type: 'textarea',
      maxLength: 500,
      admin: {
        description: 'Optional note about your mood',
      },
    },
  ],
  timestamps: true,
}
