import { RecipeStatus } from '@prisma/client';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getCurrentUser } from '@/actions/getCurrentUser';
import prisma from '@/libs/prismadb';

// 定義 ingredients 的 schema
const ingredientSchema = z.object({
  ingredient: z.string(),
  quantity: z.string(),
});
// 定義整體的驗證 schema
const validate = z.object({
  title: z.string({
    required_error: '缺少標題',
  }),
  coverImage: z
    .string({
      required_error: '缺少圖片',
    })
    .url('請輸入正確的圖片網址'),
  forPeople: z.string({
    required_error: '缺少幾人份',
  }),
  cookingTime: z.number().int('請輸入正確的時間').positive('請輸入正數').nullable(),
  ingredients: z.array(ingredientSchema).optional().default([]),
  steps: z.array(z.string()).optional(),
  tags: z.string().optional(),
  cookingTool: z.string().optional(),
  note: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    // console.log('Prisma object:', prisma);
    // console.log('Prisma recipe model:', prisma.recipe);
    const currentUser = await getCurrentUser();
    if (!currentUser) return new NextResponse('Unauthorized', { status: 401 });
    console.log('🚀 ~ POST ~ currentUser:', currentUser.id);

    const body = await request.json();
    console.log('🚀 ~ POST ~ body:', body);

    // 進行資料驗證
    const result = validate.safeParse(body);
    if (!result.success) {
      // 使用 ZodError 來捕捉錯誤訊息
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
    // 如果是 ZodError
    if (error instanceof z.ZodError) {
      const message = error.errors.map((e) => e.message).join(', ');
      return new NextResponse(message, { status: 400 });
    }
    // Prisma 錯誤處理
    if (error.code && error.meta) {
      return new NextResponse(`Prisma Error: ${error.message}`, { status: 500 });
    }
    return new NextResponse('Server Error', { status: 500 });
  }
}
// full
// export async function GET(request: NextRequest) {
//   try {
//     const currentUser = await getCurrentUser();

//     // 獲取查詢參數
//     const searchParams = request.nextUrl.searchParams;
//     const page = parseInt(searchParams.get('page') || '1');
//     const limit = parseInt(searchParams.get('limit') || '10');
//     const sort = searchParams.get('sort') || 'createdAt';
//     const order = searchParams.get('order') || 'desc';
//     const tag = searchParams.get('tag');

//     // 計算跳過的項目數
//     const skip = (page - 1) * limit;

//     // 構建查詢條件
//     const where: any = {
//       OR: [{ status: 'PUBLIC' }, { authorId: currentUser?.id }],
//     };

//     // 如果提供了標籤，添加到查詢條件
//     if (tag) {
//       where.tags = {
//         contains: tag,
//       };
//     }

//     // 執行查詢
//     const [recipes, totalCount] = await Promise.all([
//       prisma.recipe.findMany({
//         where,
//         skip,
//         take: limit,
//         orderBy: { [sort]: order },
//         include: {
//           author: {
//             select: {
//               name: true,
//               image: true,
//             },
//           },
//         },
//       }),
//       prisma.recipe.count({ where }),
//     ]);

//     // 計算總頁數
//     const totalPages = Math.ceil(totalCount / limit);

//     // 處理食譜數據
//     const processedRecipes = recipes.map((recipe) => ({
//       ...recipe,
//       ingredients: JSON.parse(recipe.ingredients as string),
//     }));

//     return NextResponse.json({
//       recipes: processedRecipes,
//       currentPage: page,
//       totalPages,
//       totalCount,
//     });
//   } catch (error) {
//     console.error('GET recipes error:', error);
//     return new NextResponse('Internal Server Error', { status: 500 });
//   }
// }
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
