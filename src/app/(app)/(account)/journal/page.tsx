import { JournalEntryList } from '@/components/journal';
import { JournalPromptCard } from '@/components/journal';
import { NewEntryButton } from '@/components/journal';
import configPromise from '@payload-config';
import { getPayload } from 'payload';
import { getMeUser } from '@/utilities/getMeUser';

async function getJournalPrompts() {
  const payload = await getPayload({ config: configPromise });
  
  const prompts = await payload.find({
    collection: 'journal-prompts',
    where: {
      isActive: {
        equals: true,
      },
    },
    limit: 3,
    sort: '-createdAt',
  });
  
  return prompts.docs;
}

async function getJournalEntries(userId: string) {
  const payload = await getPayload({ config: configPromise });
  
  const entries = await payload.find({
    collection: 'journal-entries',
    where: {
      'author.id': {
        equals: userId,
      },
    },
    limit: 20,
    sort: '-createdAt',
  });
  
  return entries.docs;
}

export default async function JournalPage() {
  const { user } = await getMeUser({
    nullUserRedirect: '/login?redirect=/journal',
  });

  const [prompts, entries] = await Promise.all([
    getJournalPrompts(),
    getJournalEntries(user?.id ? String(user.id) : ''),
  ]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Journal</h1>
        <p className="text-gray-600">Capture your thoughts, feelings, and reflections</p>
      </div>

      {/* New Entry Button */}
      <NewEntryButton />

      {/* Journal Prompts */}
      {prompts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Daily Prompts</h2>
          <div className="space-y-3">
            {prompts.map((prompt) => (
              <JournalPromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        </div>
      )}

      {/* Journal Entries */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Your Entries</h2>
          <span className="text-sm text-gray-500">{entries.length} entries</span>
        </div>
        <JournalEntryList entries={entries} />
      </div>
    </div>
  );
}
