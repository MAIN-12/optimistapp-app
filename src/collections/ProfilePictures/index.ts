import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'

export const ProfilePictures: CollectionConfig = {
  slug: 'profile-pictures',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    description: 'Profile pictures uploaded during user onboarding',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      defaultValue: 'Profile picture',
    },
    {
      name: 'uploadedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ req, data }) => {
        if (req.user) {
          data.uploadedBy = req.user.id
        }
        return data
      },
    ],
  },
  upload: {
    // Storage handled by Vercel Blob Storage plugin in payload.config.ts
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 100,
        height: 100,
        crop: 'center',
      },
      {
        name: 'small',
        width: 200,
        height: 200,
        crop: 'center',
      },
      {
        name: 'medium',
        width: 400,
        height: 400,
        crop: 'center',
      },
      {
        name: 'large',
        width: 600,
        height: 600,
        crop: 'center',
      },
    ],
    mimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
  },
}
