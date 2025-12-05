import { JournalEntryForm } from '@/components/journal';
import configPromise from '@payload-config';
import { getPayload } from 'payload';
import { getMeUser } from '@/utilities/getMeUser';

async function getPromptById(promptId: string) {
  const payload = await getPayload({ config: configPromise });
  
  const prompt = await payload.findByID({
    collection: 'journal-prompts',
    id: promptId,
  });
  
  return prompt;
}

export default async function NewJournalEntryPage({
  searchParams,
}: {
  searchParams: Promise<{ prompt?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  
  const { user } = await getMeUser({
    nullUserRedirect: '/login?redirect=/journal/new',
  });

  let prompt = null;
  if (resolvedSearchParams.prompt) {
    try {
      prompt = await getPromptById(resolvedSearchParams.prompt);
    } catch (error) {
      // Prompt not found, continue without it
    }
  }

  // Generate default title based on user and date
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const year = String(today.getFullYear()).slice(-2);
  const userName = user?.name?.toLowerCase().replace(/\s+/g, '-') || 'journal';
  const defaultTitle = `${userName}-journal-${month}-${day}-${year}`;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 pb-24">
      {/* Journal Entry Form */}
      <JournalEntryForm 
        userId={user?.id ? String(user.id) : ''} 
        promptId={resolvedSearchParams.prompt}
        defaultTitle={defaultTitle}
        prompt={prompt}
      />
    </div>
  );
}
