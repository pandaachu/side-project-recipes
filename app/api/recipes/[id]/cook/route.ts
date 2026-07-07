import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getCurrentUser } from '@/actions/getCurrentUser';
import prisma from '@/libs/prismadb';
import type { CookLog } from '@/types/recipe';

const cookValidate = z.object({
  rating: z.number().int().min(1, '評分為 1-5').max(5, '評分為 1-5').optional(),
  note: z.string().max(500, '心得最多 500 字').optional(),
});

// Log a cooking session: bump cookCount, set lastCookedAt, append cookLogs, update rating
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const currentUser = await getCurrentUser();
    if (!currentUser) return new NextResponse('Unauthorized', { status: 401 });

    const recipe = await prisma.recipe.findUnique({ where: { id } });
    if (!recipe) return new NextResponse('Recipe not found', { status: 404 });
    if (recipe.authorId !== currentUser.id) return new NextResponse('Forbidden', { status: 403 });

    const body = await request.json();
    const result = cookValidate.safeParse(body);
    if (!result.success) {
      const message = result.error.errors.map((e) => e.message).join(', ');
      return new NextResponse(message, { status: 400 });
    }

    const { rating, note } = result.data;
    const newLog: CookLog = {
      cookedAt: new Date().toISOString(),
      ...(rating !== undefined && { rating }),
      ...(note ? { note } : {}),
    };
    const existingLogs = Array.isArray(recipe.cookLogs) ? (recipe.cookLogs as unknown as CookLog[]) : [];

    const updated = await prisma.recipe.update({
      where: { id },
      data: {
        cookCount: (recipe.cookCount ?? 0) + 1,
        lastCookedAt: new Date(),
        cookLogs: [...existingLogs, newLog] as object[],
        ...(rating !== undefined && { rating }),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ data: updated, message: 'success' });
  } catch (error) {
    console.error('POST cook log error:', error);
    return new NextResponse('Server Error', { status: 500 });
  }
}
