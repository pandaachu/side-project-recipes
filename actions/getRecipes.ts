import prisma from '@/libs/prismadb';

import { getCurrentUser } from './getCurrentUser';

export async function getLinks() {
  const currentUser = await getCurrentUser();

  if (!currentUser) return null;

  const links = await prisma.link.findMany({
    where: {
      userId: currentUser.id,
    },
    orderBy: {
      order: 'desc',
    },
  });

  return links;
}
