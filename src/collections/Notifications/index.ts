import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  access: {
    create: authenticated,
    delete: ({ req: { user } }) => {
      // Users can delete their own notifications
      return {
        'recipient.id': {
          equals: user?.id,
        },
      }
    },
    read: ({ req: { user } }) => {
      // Users can only read notifications sent to them
      return {
        'recipient.id': {
          equals: user?.id,
        },
      }
    },
    update: ({ req: { user } }) => {
      // Users can update their own notifications (e.g., mark as read)
      return {
        'recipient.id': {
          equals: user?.id,
        },
      }
    },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'recipient', 'status', 'isRead', 'createdAt'],
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Message Like',
          value: 'message_like',
        },
        {
          label: 'Message Comment',
          value: 'message_comment',
        },
        {
          label: 'Circle Invitation',
          value: 'circle_invitation',
        },
        {
          label: 'Circle Join Request',
          value: 'circle_join_request',
        },
        {
          label: 'Daily Reminder',
          value: 'daily_reminder',
        },
        {
          label: 'Weekly Summary',
          value: 'weekly_summary',
        },
        {
          label: 'System Announcement',
          value: 'system_announcement',
        },
      ],
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      maxLength: 500,
    },
    {
      name: 'recipient',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
    },
    {
      name: 'sender',
      type: 'relationship',
      relationTo: 'users',
      hasMany: false,
      admin: {
        description: 'User who triggered this notification (optional for system notifications)',
      },
    },
    {
      name: 'entityId',
      type: 'text',
      admin: {
        description: 'ID of related entity (message, circle, comment, etc.)',
      },
    },
    {
      name: 'entityType',
      type: 'select',
      options: [
        {
          label: 'Message',
          value: 'message',
        },
        {
          label: 'Circle',
          value: 'circle',
        },
        {
          label: 'Comment',
          value: 'comment',
        },
        {
          label: 'Journal Entry',
          value: 'journal_entry',
        },
        {
          label: 'User',
          value: 'user',
        },
      ],
      admin: {
        description: 'Type of entity related to this notification',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Delivered',
          value: 'delivered',
        },
        {
          label: 'Read',
          value: 'read',
        },
        {
          label: 'Failed',
          value: 'failed',
        },
      ],
    },
    {
      name: 'isRead',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'deliveredAt',
      type: 'date',
      admin: {
        date: {
          displayFormat: 'MMM d, yyyy h:mm a',
        },
      },
    },
    {
      name: 'readAt',
      type: 'date',
      admin: {
        date: {
          displayFormat: 'MMM d, yyyy h:mm a',
        },
      },
    },
  ],
  timestamps: true,
}
