import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'icon', 'description'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'description',
      type: 'textarea',
      maxLength: 500,
    },
    {
      name: 'icon',
      type: 'text',
      admin: {
        description: 'Emoji or icon identifier',
      },
    },
    {
      name: 'gradient',
      type: 'text',
      admin: {
        description: 'CSS gradient for UI (e.g., linear-gradient(135deg, #667eea 0%, #764ba2 100%))',
      },
    },
    {
      name: 'bgColor',
      type: 'text',
      admin: {
        description: 'Background color for UI (hex code)',
      },
    },
  ],
  timestamps: true,
}
