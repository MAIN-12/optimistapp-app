import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { anyone } from '../../access/anyone'
import { generateVerificationEmailHTML, generateVerificationEmailSubject } from '../../utilities/email/templates/verificationEmail'

export const Users: CollectionConfig = {
  slug: 'users',
  hooks: {
    beforeDelete: [
      async ({ req, id }) => {
        // Delete all related records before deleting the user
        const collections = [
          'journal-entries',
          'mood-logs',
          'messages',
          'notifications',
          'comments',
          'posts',
        ]

        for (const collection of collections) {
          try {
            // Find all records for this user
            const results = await req.payload.find({
              collection: collection as any,
              where: {
                author: {
                  equals: id,
                },
              },
              limit: 1000,
            })

            // Delete each record
            if (results.docs.length > 0) {
              await Promise.all(
                results.docs.map(doc =>
                  req.payload.delete({
                    collection: collection as any,
                    id: doc.id,
                  })
                )
              )
            }
          } catch (error) {
            // Log error but continue with other collections
            console.error(`Error deleting ${collection} for user ${id}:`, error)
          }
        }

        // Delete profile pictures
        try {
          const profilePics = await req.payload.find({
            collection: 'profile-pictures',
            where: {
              user: {
                equals: id,
              },
            },
            limit: 100,
          })

          if (profilePics.docs.length > 0) {
            await Promise.all(
              profilePics.docs.map(doc =>
                req.payload.delete({
                  collection: 'profile-pictures',
                  id: doc.id,
                })
              )
            )
          }
        } catch (error) {
          console.error(`Error deleting profile pictures for user ${id}:`, error)
        }

        // Remove user from circles
        try {
          const circles = await req.payload.find({
            collection: 'circles',
            where: {
              or: [
                {
                  createdBy: {
                    equals: id,
                  },
                },
                {
                  members: {
                    contains: id,
                  },
                },
              ],
            },
            limit: 100,
          })

          if (circles.docs.length > 0) {
            await Promise.all(
              circles.docs.map(async (circle) => {
                // If user is the owner, delete the circle
                if ((circle.owner as any)?.id === id || (circle.owner as any) === id) {
                  await req.payload.delete({
                    collection: 'circles',
                    id: circle.id,
                  })
                } else {
                  // Otherwise, just remove them from members
                  const updatedMembers = (circle.members as any[]).filter(
                    (member) => member !== id && member?.id !== id
                  )
                  await req.payload.update({
                    collection: 'circles',
                    id: circle.id,
                    data: {
                      members: updatedMembers,
                    },
                  })
                }
              })
            )
          }
        } catch (error) {
          console.error(`Error handling circles for user ${id}:`, error)
        }
      },
    ],
  },
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
