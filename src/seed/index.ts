import type { Payload } from 'payload'
import { seedCategories } from './categories'
import { seedUsers } from './users'
import { seedCircles } from './circles'
import { seedJournalPrompts } from './journal-prompts'
import { seedMessages } from './messages'

export const seed = async (payload: Payload): Promise<void> => {
  payload.logger.info('Starting database seed...')

  try {
    // Seed in order due to relationships
    await seedCategories(payload)
    await seedUsers(payload)
    await seedCircles(payload)
    await seedJournalPrompts(payload)
    await seedMessages(payload)

    payload.logger.info('Database seed completed successfully!')
  } catch (error) {
    payload.logger.error('Error seeding database:')
    payload.logger.error(error)
    throw error
  }
}
