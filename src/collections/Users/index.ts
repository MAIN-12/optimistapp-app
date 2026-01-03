import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { anyone } from '../../access/anyone'
import { generateVerificationEmailHTML, generateVerificationEmailSubject } from '../../utilities/email/templates/verificationEmail'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 259200, // 3 days (72 hours)
    // verify: {
    //   generateEmailHTML: ({ token, user }) => {
    //     return generateVerificationEmailHTML({ 
    //       token, 
    //       user: { 
    //         name: user.name as string | undefined, 
    //         email: user.email 
    //       } 
    //     })
    //   },
    //   generateEmailSubject: () => generateVerificationEmailSubject(),
    // },
    maxLoginAttempts: 5,
    lockTime: 600000, // 10 minutes
    useAPIKey: false,
  },
  access: {
    admin: authenticated,
    create: anyone, // Allow public registration
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email', 'nickname', 'roles'],
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
    },
    {
      name: 'nickname',
      type: 'text',
    },
    {
      name: 'picture',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'profilePicture',
      type: 'upload',
      relationTo: 'profile-pictures',
      admin: {
        description: 'Profile picture uploaded during onboarding',
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      maxLength: 500,
    },
    {
      name: 'location',
      type: 'text',
    },
    {
      name: 'website',
      type: 'text',
    },
    {
      name: 'birthday',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'MMMM d, yyyy',
        },
        description: 'User birthday for personalized content',
      },
    },
    {
      name: 'gender',
      type: 'select',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Non-binary', value: 'non-binary' },
        { label: 'Prefer not to say', value: 'prefer-not-to-say' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'heardAboutUs',
      type: 'select',
      options: [
        { label: 'Social Media', value: 'social-media' },
        { label: 'Friend or Family', value: 'friend-family' },
        { label: 'Search Engine', value: 'search-engine' },
        { label: 'App Store', value: 'app-store' },
        { label: 'Advertisement', value: 'advertisement' },
        { label: 'Blog or Article', value: 'blog-article' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'How did the user hear about this app',
      },
    },
    {
      name: 'onboardingCompleted',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether the user has completed the onboarding process',
      },
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['user'],
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'User',
          value: 'user',
        },
      ],
      required: true,
      access: {
        create: ({ req: { user } }) => Boolean(user),
        update: ({ req: { user } }) => Boolean(user),
      },
    },
  ],
  timestamps: true,
}
