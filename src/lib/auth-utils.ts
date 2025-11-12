import { getSession } from '@auth0/nextjs-auth0';
import { prisma } from '@/lib/prisma';

export async function getAuthenticatedUser() {
  const session = await getSession();
  
  if (!session?.user) {
    return null;
  }

  // Get user from database using Auth0 sub
  const user = await prisma.user.findUnique({
    where: { sub: session.user.sub },
    select: {
      id: true,
      sub: true,
      email: true,
      name: true,
      nickname: true,
      picture: true,
      bio: true,
      location: true,
      website: true,
      createdAt: true,
      updatedAt: true
    }
  });

  return user;
}

export async function requireAuthenticatedUser() {
  const user = await getAuthenticatedUser();
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  return user;
}