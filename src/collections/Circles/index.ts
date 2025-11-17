import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { anyone } from '../../access/anyone'

export const Circles: CollectionConfig = {
  slug: 'circles',
  access: {
    create: authenticated,
    delete: ({ req: { user } }) => {
      // Only owners can delete their circles
      return {
        'owner.id': {
          equals: user?.id,
        },
      }
    },
    read: ({ req: { user } }) => {
      // Everyone can read public circles
      // Authenticated users can also see their circles
      if (!user) return true
      return true
    },
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'owner', 'category'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      maxLength: 500,
    },
    {
      name: 'about',
      type: 'textarea',
      maxLength: 2000,
      admin: {
        description: 'Extended description of the circle',
      },
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
        description: 'CSS gradient for UI',
      },
    },
    {
      name: 'bgColor',
      type: 'text',
      admin: {
        description: 'Background color for UI (hex code)',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'public',
      options: [
        {
          label: 'Public',
          value: 'public',
        },
        {
          label: 'Private',
          value: 'private',
        },
        {
          label: 'Invite Only',
          value: 'invite_only',
        },
      ],
    },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: false,
    },
    {
      name: 'members',
      type: 'array',
      fields: [
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
        {
          name: 'role',
          type: 'select',
          required: true,
          defaultValue: 'member',
          options: [
            {
              label: 'Owner',
              value: 'owner',
            },
            {
              label: 'Admin',
              value: 'admin',
            },
            {
              label: 'Moderator',
              value: 'moderator',
            },
            {
              label: 'Member',
              value: 'member',
            },
          ],
        },
        {
          name: 'joinedAt',
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
      name: 'rules',
      type: 'array',
      fields: [
        {
          name: 'rule',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Circle rules and guidelines',
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
        description: 'Searchable tags for this circle',
      },
    },
  ],
  timestamps: true,
}
