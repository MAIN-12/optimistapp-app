import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const JournalEntries: CollectionConfig = {
  slug: 'journal-entries',
  access: {
    create: authenticated,
    delete: ({ req: { user } }) => {
      // Users can only delete their own journal entries
      return {
        'author.id': {
          equals: user?.id,
        },
      }
    },
    read: ({ req: { user } }) => {
      // Users can only read their own entries (privacy by default)
      return {
        'author.id': {
          equals: user?.id,
        },
      }
    },
    update: ({ req: { user } }) => {
      // Users can only update their own entries
      return {
        'author.id': {
          equals: user?.id,
        },
      }
    },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'mood', 'author', 'createdAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'Optional title for this journal entry',
      },
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Your journal content',
      },
    },
    {
      name: 'mood',
      type: 'select',
      options: [
        {
          label: '😊 Very Happy',
          value: 'very_happy',
        },
        {
          label: '🙂 Happy',
          value: 'happy',
        },
        {
          label: '😐 Neutral',
          value: 'neutral',
        },
        {
          label: '😔 Sad',
          value: 'sad',
        },
        {
          label: '😢 Very Sad',
          value: 'very_sad',
        },
        {
          label: '😰 Anxious',
          value: 'anxious',
        },
        {
          label: '😌 Peaceful',
          value: 'peaceful',
        },
        {
          label: '🙏 Grateful',
          value: 'grateful',
        },
        {
          label: '🎉 Excited',
          value: 'excited',
        },
        {
          label: '🤔 Reflective',
          value: 'reflective',
        },
      ],
      admin: {
        description: 'How are you feeling?',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Tags for categorization and search',
      },
    },
    {
      name: 'isPrivate',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Keep this entry private (only you can see it)',
      },
    },
    {
      name: 'gratefulFor',
      type: 'array',
      fields: [
        {
          name: 'item',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Things you are grateful for today',
      },
    },
    {
      name: 'dailyWins',
      type: 'array',
      fields: [
        {
          name: 'win',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Daily accomplishments and wins',
      },
    },
    {
      name: 'reflectionPrompt',
      type: 'text',
      admin: {
        description: 'Optional prompt ID that inspired this entry',
      },
    },
  ],
  timestamps: true,
}
