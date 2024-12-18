import { getServerSession } from 'next-auth';

import { authOptions } from '@/libs/auth';
import prisma from '@/libs/prismadb';

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  try {
    const session = await getSession();
    if (!session?.user?.email) return null;
    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
    });

    if (!currentUser) return null;

    return {
      ...currentUser,
      createdAt: currentUser.createdAt.toISOString(),
      updatedAt: currentUser.updatedAt.toISOString(),
      emailVerified: currentUser.emailVerified?.toISOString() || null,
    };
  } catch (error) {
    console.error(error);
    // 這不是串接 API 而是直接與 db 溝通，所以我們直接回傳 null
    return null;
  }
}
