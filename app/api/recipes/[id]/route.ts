import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getCurrentUser } from '@/actions/getCurrentUser';
import prisma from '@/libs/prismadb';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const recipe = await prisma.recipe.findUnique({
      where: {
        id,
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

const ingredientSchema = z.object({
  ingredient: z.string(),
  quantity: z.string(),
});

const updateValidate = z.object({
  title: z.string().optional(),
  coverImage: z.string().url('請輸入正確的圖片網址').optional(),
  forPeople: z.string().optional(),
  cookingTime: z.number().int('請輸入正確的時間').positive('請輸入正數').nullable().optional(),
  ingredients: z.array(ingredientSchema).optional(),
  steps: z.array(z.string()).optional(),
  tags: z.string().nullable().optional(),
  cookingTools: z.array(z.string()).optional(),
  note: z.string().nullable().optional(),
  refUrl: z.string().nullable().optional(),
});

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const currentUser = await getCurrentUser();
    if (!currentUser) return new NextResponse('Unauthorized', { status: 401 });

    const recipe = await prisma.recipe.findUnique({
      where: { id },
    });

    if (!recipe) {
      return new NextResponse('Recipe not found', { status: 404 });
    }

    if (recipe.authorId !== currentUser.id) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const body = await request.json();
    const result = updateValidate.safeParse(body);

    if (!result.success) {
      const message = result.error.errors.map((e) => e.message).join(', ');
      return new NextResponse(message, { status: 400 });
    }

    const updatedRecipe = await prisma.recipe.update({
      where: { id },
      data: {
        ...result.data,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ data: updatedRecipe, message: 'success' });
  } catch (error: any) {
    console.error('PUT recipe error:', error);
    if (error.code && error.meta) {
      return new NextResponse(`Prisma Error: ${error.message}`, { status: 500 });
    }
    return new NextResponse('Server Error', { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const currentUser = await getCurrentUser();
    if (!currentUser) return new NextResponse('Unauthorized', { status: 401 });

    const recipe = await prisma.recipe.findUnique({
      where: { id },
    });

    if (!recipe) {
      return new NextResponse('Recipe not found', { status: 404 });
    }

    if (recipe.authorId !== currentUser.id) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    await prisma.recipe.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Recipe deleted successfully' });
  } catch (error: any) {
    console.error('DELETE recipe error:', error);
    return new NextResponse('Server Error', { status: 500 });
  }
}
