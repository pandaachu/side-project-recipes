import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/actions/getCurrentUser';
import prisma from '@/libs/prismadb';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return new NextResponse('Unauthorized', { status: 401 });

    const recipes = await prisma.recipe.findMany({
      where: {
        authorId: currentUser.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ recipes });
  } catch (error) {
    console.error('GET member recipes error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
