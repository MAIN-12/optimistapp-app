import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { DailyMessage, Messages, NewMessage, MessageProvider } from '@/components/message';
import { Message } from '@/payload-types';

async function getMessages(): Promise<Message[]> {
  const payload = await getPayload({ config: configPromise });
  
  const result = await payload.find({
    collection: 'messages',
    depth: 2,
    sort: '-createdAt',
    limit: 50,
  });

  return result.docs as Message[];
}

export default async function Page() {
  const messages = await getMessages();

  return (
    <MessageProvider initialMessages={messages}>
      <DailyMessage />
      <NewMessage />
      <Messages />
    </MessageProvider>
  );
}
