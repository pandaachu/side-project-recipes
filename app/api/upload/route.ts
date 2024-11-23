import { NextResponse } from 'next/server';

import prisma from '@/libs/prismadb';

export async function POST(request: Request) {
  const body = await request.json();
  const { url } = body;
  try {
    const image = await prisma.image.create({
      data: { url },
    });
    return NextResponse.json(image);
  } catch (error) {
    console.log('🚀 ~ POST ~ error:', error);
    return new NextResponse('Server Error', { status: 500 });
  }
}
