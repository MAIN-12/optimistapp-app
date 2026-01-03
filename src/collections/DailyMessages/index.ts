import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { anyone } from '../../access/anyone'

export const DailyMessages: CollectionConfig = {
  slug: 'daily-messages',
  access: {
    // Only authenticated admins can create/update/delete
    create: authenticated,
    delete: authenticated,
    // Anyone can read (for the daily message display)
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'scheduledDate', 'isActive', 'category', 'createdAt'],
    description: 'Daily inspirational messages shown to users each day',
    group: 'Content',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      maxLength: 100,
      admin: {
        description: 'A short title for the daily message (for admin reference)',
      },
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      maxLength: 500,
      admin: {
        description: 'The main message content to display to users',
      },
    },
    {
      name: 'icon',
      type: 'text',
      defaultValue: '✨',
      admin: {
        description: 'Emoji icon to display with the message',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'motivation',
      options: [
        {
          label: 'Motivation',
          value: 'motivation',
        },
        {
          label: 'Inspiration',
          value: 'inspiration',
        },
        {
          label: 'Gratitude',
          value: 'gratitude',
        },
        {
          label: 'Mindfulness',
          value: 'mindfulness',
        },
        {
          label: 'Positivity',
          value: 'positivity',
        },
        {
          label: 'Wellness',
          value: 'wellness',
        },
        {
          label: 'Faith',
          value: 'faith',
        },
        {
          label: 'Growth',
          value: 'growth',
        },
      ],
    },
    {
      name: 'scheduledDate',
      type: 'date',
      required: true,
      admin: {
        description: 'The date this message should be displayed as the daily message',
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'MMM d, yyyy',
        },
      },
      index: true,
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Only active messages will be shown on their scheduled date',
        position: 'sidebar',
      },
    },
    {
      name: 'author',
      type: 'text',
      admin: {
        description: 'Optional: Author or source of the quote',
      },
    },
    {
      name: 'audioUrl',
      type: 'text',
      admin: {
        description: 'Optional: URL to an audio reading of this message',
      },
    },
    {
      name: 'backgroundTheme',
      type: 'select',
      defaultValue: 'blue-purple',
      options: [
        {
          label: 'Blue & Purple',
          value: 'blue-purple',
        },
        {
          label: 'Pink & Orange',
          value: 'pink-orange',
        },
        {
          label: 'Green & Teal',
          value: 'green-teal',
        },
        {
          label: 'Purple & Pink',
          value: 'purple-pink',
        },
      ],
      admin: {
        description: 'Background theme for the modal display',
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
