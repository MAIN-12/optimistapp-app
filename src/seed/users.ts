import type { Payload } from 'payload'

export async function seedUsers(payload: Payload): Promise<void> {
  payload.logger.info('Seeding users...')

  const users = [
    {
      email: 'sarah.johnson@example.com',
      password: 'password123',
      name: 'Sarah Johnson',
      roles: ['user'] as ('user' | 'admin')[],
    },
    {
      email: 'juan.botero@example.com',
      password: 'password123',
      name: 'Juan Botero',
      roles: ['user'] as ('user' | 'admin')[],
    },
    {
      email: 'maria.garcia@example.com',
      password: 'password123',
      name: 'Maria Garcia',
      roles: ['user'] as ('user' | 'admin')[],
    },
    {
      email: 'david.chen@example.com',
      password: 'password123',
      name: 'David Chen',
      roles: ['user'] as ('user' | 'admin')[],
    },
    {
      email: 'emma.wilson@example.com',
      password: 'password123',
      name: 'Emma Wilson',
      roles: ['user'] as ('user' | 'admin')[],
    },
    {
      email: 'mike.rodriguez@example.com',
      password: 'password123',
      name: 'Mike Rodriguez',
      roles: ['user'] as ('user' | 'admin')[],
    },
    {
      email: 'luna.martinez@example.com',
      password: 'password123',
      name: 'Luna Martinez',
      roles: ['user'] as ('user' | 'admin')[],
    },
    {
      email: 'jennifer.lee@example.com',
      password: 'password123',
      name: 'Jennifer Lee',
      roles: ['user'] as ('user' | 'admin')[],
    },
    {
      email: 'alex.thompson@example.com',
      password: 'password123',
      name: 'Alex Thompson',
      roles: ['user'] as ('user' | 'admin')[],
    },
  ]

  for (const user of users) {
    const existing = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: user.email,
        },
      },
    })

    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'users',
        data: user,
      })
      payload.logger.info(`Created user: ${user.name}`)
    }
  }
}
