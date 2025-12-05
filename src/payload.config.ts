// storage-adapter-import-placeholder
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { Circles } from './collections/Circles'
import { Messages } from './collections/Messages'
import { Comments } from './collections/Comments'
import { JournalEntries } from './collections/JournalEntries'
import { JournalPrompts } from './collections/JournalPrompts'
import { MoodLogs } from './collections/MoodLogs'
import { Notifications } from './collections/Notifications'
import { Posts } from './collections/Posts'
import brevoAdapter from './utilities/brevoAdapter'
import { seed } from './seed'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeLogin` statement on line 15.
      // beforeLogin: ['@/components/BeforeLogin', '@/components/AdminFavicon'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeDashboard` statement on line 15.
      // beforeDashboard: [
      //   // '@/components/BeforeDashboard',
      //   '@/components/AdminFavicon'
      // ],
      graphics: {
        Logo: '@/components/logo/PayloadLogo',
        Icon: '@/components/logo/PayloadIcon',
      },
    },
    meta: {
      titleSuffix: '- Main 12 Admin Panel',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  email: brevoAdapter(),
  editor: lexicalEditor(),
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || '',
    },
  }),
  collections: [
    Users,
    Media,
    Categories,
    Circles,
    Messages,
    Comments,
    JournalEntries,
    JournalPrompts,
    MoodLogs,
    Notifications,
    Posts,
  ],
  // globals: [Header, Footer, SiteSettings],
  plugins: [
    vercelBlobStorage({
      collections: {
        media: {
          prefix: process.env.PROJECT_ID ? `${process.env.PROJECT_ID}/media` : 'media',
        },
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
    // storage-adapter-placeholder
  ],
  secret: process.env.PAYLOAD_SECRET || 'default-secret-change-in-production',
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  async onInit(payload) {
    const users = await payload.find({
      collection: 'users',
      limit: 2,
    })

    // Only seed when there is exactly 1 user (the initial admin)
    if (users.totalDocs === 1) {
      payload.logger.info('Initial user created. Running seed to populate database...')
      await seed(payload)
    } else if (users.totalDocs === 0) {
      payload.logger.info('No users yet. Waiting for initial user creation before seeding.')
    } else {
      payload.logger.info('Database already seeded. Skipping.')
    }
  },
})
