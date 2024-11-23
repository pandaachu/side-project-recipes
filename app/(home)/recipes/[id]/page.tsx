'use client';

import { Avatar, Card, message, Spin } from 'antd';
import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { Recipe } from '@/types/recipe';

interface RecipeDetailProps {
  params: {
    id: string;
  };
}

const RecipeDetail = ({ params }: RecipeDetailProps) => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`/api/recipes/${params.id}`);
        setRecipe(response.data);
        console.log('🚀 ~ fetchRecipe ~ response.data:', response.data);
      } catch (error: any) {
        // 記錄錯誤以便調試
        console.error('Error fetching recipe:', error);

        // 根據錯誤類型顯示不同的錯誤信息
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            message.error('找不到該食譜');
          } else if (error.response?.status === 401) {
            message.error('沒有權限查看此食譜');
          } else {
            message.error(error.response?.data || '載入食譜失敗');
          }
        } else {
          message.error('發生未知錯誤');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>找不到此食譜</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-4">
      {/* 食譜標題和作者信息 */}
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold">{recipe.title}</h1>
        <div className="flex items-center space-x-4">
          <Avatar src={recipe.authorImage || 'https://api.dicebear.com/7.x/miniavs/svg?seed=8'} />
          <span className="text-gray-600">{recipe.authorName}</span>
        </div>
      </div>

      {/* 食譜封面圖片 */}
      <div className="relative mb-8 h-96 w-full overflow-hidden rounded-lg">
        <Image src={recipe.coverImage} alt={recipe.title} fill className="object-cover" priority />
      </div>

      {/* 食譜基本信息 */}
      <div className="mb-8 grid grid-cols-2 gap-4">
        <Card>
          <div className="text-lg">👥 份量：{recipe.forPeople}人份</div>
        </Card>
        <Card>
          <div className="text-lg">⏰ 烹飪時間：{recipe.cookingTime || '未設定'}分鐘</div>
        </Card>
      </div>

      {/* 食材列表 */}
      <Card title="食材" className="mb-8">
        <ul className="space-y-2">
          {recipe.ingredients?.map((ingredient, index) => (
            <li key={index} className="flex justify-between">
              <span>{ingredient.ingredient}</span>
              <span className="text-gray-600">{ingredient.quantity}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* 烹飪步驟 */}
      <Card title="烹飪步驟">
        <ol className="space-y-4">
          {recipe.steps.map((step, index) => (
            <li key={index} className="flex">
              <span className="mr-4 font-bold">{index + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </Card>

      {/* 其他信息 */}
      {recipe.note && (
        <Card title="備註" className="mt-8">
          <p>{recipe.note}</p>
        </Card>
      )}

      {recipe.cookingTool && (
        <Card title="建議使用的工具" className="mt-8">
          <p>{recipe.cookingTool}</p>
        </Card>
      )}

      {recipe.tags && (
        <div className="mt-8">
          <div className="text-gray-600">標籤：{recipe.tags}</div>
        </div>
      )}
    </div>
  );
};

export default RecipeDetail;
