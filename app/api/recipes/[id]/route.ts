import { NextResponse } from 'next/server';

import prisma from '@/libs/prismadb';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: {
        id: params.id,
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    if (!recipe) {
      return new NextResponse('Recipe not found', { status: 404 });
    }

    return NextResponse.json(recipe);
  } catch (error) {
    console.error('GET recipe error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
