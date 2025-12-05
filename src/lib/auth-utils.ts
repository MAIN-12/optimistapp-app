import { cookies } from 'next/headers';
import { getPayload } from 'payload';
import config from '@payload-config';

export async function getAuthenticatedUser() {
  try {
    const payload = await getPayload({ config });
    const cookieStore = await cookies();
    const token = cookieStore.get('payload-token')?.value;

    if (!token) {
      return null;
    }

    const { user } = await payload.auth({ headers: new Headers({ Authorization: `JWT ${token}` }) });

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error getting authenticated user:', error);
    return null;
  }
}

export async function requireAuthenticatedUser() {
  const user = await getAuthenticatedUser();
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  return user;
}