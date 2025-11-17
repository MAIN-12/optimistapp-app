import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { anyone } from '../../access/anyone'

export const JournalPrompts: CollectionConfig = {
  slug: 'journal-prompts',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'difficulty', 'isActive'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      maxLength: 500,
      admin: {
        description: 'The actual prompt question or statement',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'reflection',
      options: [
        {
          label: 'Reflection',
          value: 'reflection',
        },
        {
          label: 'Gratitude',
          value: 'gratitude',
        },
        {
          label: 'Goals',
          value: 'goals',
        },
        {
          label: 'Relationships',
          value: 'relationships',
        },
        {
          label: 'Growth',
          value: 'growth',
        },
        {
          label: 'Mindfulness',
          value: 'mindfulness',
        },
        {
          label: 'Creativity',
          value: 'creativity',
        },
        {
          label: 'Challenges',
          value: 'challenges',
        },
        {
          label: 'Success',
          value: 'success',
        },
        {
          label: 'Spirituality',
          value: 'spirituality',
        },
      ],
    },
    {
      name: 'difficulty',
      type: 'select',
      required: true,
      defaultValue: 'beginner',
      options: [
        {
          label: 'Beginner',
          value: 'beginner',
        },
        {
          label: 'Intermediate',
          value: 'intermediate',
        },
        {
          label: 'Advanced',
          value: 'advanced',
        },
      ],
      admin: {
        description: 'Depth level of the prompt',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show this prompt to users',
      },
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
        description: 'Tags for categorization',
      },
    },
  ],
  timestamps: true,
}
