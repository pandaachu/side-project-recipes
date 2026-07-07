import { RecipeStatus } from '@prisma/client';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getCurrentUser } from '@/actions/getCurrentUser';
import prisma from '@/libs/prismadb';

const ingredientSchema = z.object({
  ingredient: z.string(),
  quantity: z.string(),
});

const validate = z.object({
  title: z.string({
    required_error: '缺少標題',
  }),
  coverImage: z.string().url('請輸入正確的圖片網址').optional(),
  forPeople: z.string({
    required_error: '缺少幾人份',
  }),
  cookingTime: z.number().int('請輸入正確的時間').positive('請輸入正數').nullable(),
  ingredients: z.array(ingredientSchema).optional().default([]),
  steps: z.array(z.string()).optional(),
  tags: z.string().optional(),
  cookingTools: z.array(z.string()).optional().default([]),
  refUrl: z.string().optional(),
  note: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return new NextResponse('Unauthorized', { status: 401 });

    const body = await request.json();

    const result = validate.safeParse(body);
    if (!result.success) {
      throw new z.ZodError(result.error?.issues || []);
    }
    const data = await prisma.recipe.create({
      data: {
        ...result.data,
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorImage: currentUser.image,
        status: 'PUBLISHED',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ data, message: 'success' });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const message = error.errors.map((e) => e.message).join(', ');
      return new NextResponse(message, { status: 400 });
    }
    if (error.code && error.meta) {
      return new NextResponse(`Prisma Error: ${error.message}`, { status: 500 });
    }
    return new NextResponse('Server Error', { status: 500 });
  }
}

export async function GET() {
  try {
    const recipes = await prisma.recipe.findMany({
      where: {
        status: RecipeStatus.PUBLISHED,
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

    return NextResponse.json({ recipes });
  } catch (error) {
    console.error('GET public recipes error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
