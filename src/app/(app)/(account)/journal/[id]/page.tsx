import { JournalEntryView } from '@/components/journal';
import configPromise from '@payload-config';
import { getPayload } from 'payload';
import { getMeUser } from '@/utilities/getMeUser';
import { notFound, redirect } from 'next/navigation';

async function getJournalEntry(entryId: string) {
  const payload = await getPayload({ config: configPromise });
  
  try {
    const entry = await payload.findByID({
      collection: 'journal-entries',
      id: entryId,
    });
    
    return entry;
  } catch (error) {
    return null;
  }
}

export default async function JournalEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const { user } = await getMeUser({
    nullUserRedirect: '/login?redirect=/journal',
  });

  const entry = await getJournalEntry(id);

  if (!entry) {
    notFound();
  }

  // Check if the user owns this entry
  const authorId = typeof entry.author === 'number' ? entry.author : entry.author?.id;
  if (authorId !== user?.id) {
    redirect('/journal');
  }

  return (
    <div className="w-full max-w-2xl mx-auto pb-24">
      <JournalEntryView entry={entry} userId={user?.id ? String(user.id) : ''} />
    </div>
  );
}
