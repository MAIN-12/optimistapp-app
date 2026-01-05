import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { FavoriteMessages } from '@/components/message';
import { Message } from '@/payload-types';

async function getMessages(): Promise<Message[]> {
  const payload = await getPayload({ config: configPromise });

  const result = await payload.find({
    collection: 'messages',
    depth: 2,
    sort: '-createdAt',
    limit: 100,
  });

  return result.docs as Message[];
}

export default async function Page() {
  const messages = await getMessages();

  return <FavoriteMessages initialMessages={messages} />;
}
