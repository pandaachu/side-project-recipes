'use client';

import { message, Spin } from 'antd';
import axios from 'axios';
import Image from 'next/image';
import { use, useEffect, useState } from 'react';

import { Recipe } from '@/types/recipe';

interface RecipeDetailProps {
  params: Promise<{
    id: string;
  }>;
}

const RecipeDetail = ({ params }: RecipeDetailProps) => {
  const { id } = use(params);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`/api/recipes/${id}`);
        setRecipe(response.data);
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            message.error('找不到該食譜');
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
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-[#9E9E9E]">找不到此食譜</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up mx-auto max-w-3xl px-6 py-16 md:px-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="mb-3 text-3xl font-light tracking-wider md:text-4xl">{recipe.title}</h1>
        <p className="text-sm text-[#9E9E9E]">{recipe.authorName || '匿名'}</p>
      </div>

      {/* Cover Image */}
      <div className="relative mb-12 aspect-[16/10] w-full overflow-hidden">
        <Image
          src={recipe.coverImage}
          alt={recipe.title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 768px"
        />
      </div>

      {/* Info Bar */}
      <div className="mb-12 flex items-center justify-center gap-8 border-y border-[#EEEEEE] py-6">
        <div className="text-center">
          <p className="mb-1 text-xs tracking-[1px] text-[#9E9E9E]">份量</p>
          <p className="text-lg font-light">{recipe.forPeople}人份</p>
        </div>
        {recipe.cookingTime && (
          <div className="text-center">
            <p className="mb-1 text-xs tracking-[1px] text-[#9E9E9E]">時間</p>
            <p className="text-lg font-light">{recipe.cookingTime}分鐘</p>
          </div>
        )}
        {recipe.cookingTools && recipe.cookingTools.length > 0 && (
          <div className="text-center">
            <p className="mb-1 text-xs tracking-[1px] text-[#9E9E9E]">工具</p>
            <p className="text-lg font-light">{recipe.cookingTools.join('、')}</p>
          </div>
        )}
      </div>

      {/* Ingredients */}
      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-xl font-medium">食材</h2>
            <span className="text-[10px] tracking-[2px] text-[#9E9E9E]">INGREDIENTS</span>
          </div>
          <ul className="divide-y divide-[#F5F5F5]">
            {recipe.ingredients.map((item, index) => (
              <li key={index} className="flex items-center justify-between py-3">
                <span className="text-sm">{item.ingredient}</span>
                <span className="text-sm text-[#757575]">{item.quantity}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Steps */}
      {recipe.steps && recipe.steps.length > 0 && (
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-xl font-medium">作法</h2>
            <span className="text-[10px] tracking-[2px] text-[#9E9E9E]">STEPS</span>
          </div>
          <ol className="space-y-6">
            {recipe.steps.map((step, index) => (
              <li key={index} className="flex gap-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-black text-xs">
                  {index + 1}
                </span>
                <p className="pt-1 text-sm leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Note */}
      {recipe.note && (
        <section className="mb-12 border-l-2 border-[#E0E0E0] pl-6">
          <div className="mb-3">
            <h2 className="text-base font-medium">備註</h2>
            <span className="text-[10px] tracking-[2px] text-[#9E9E9E]">NOTE</span>
          </div>
          <p className="text-sm leading-relaxed text-[#616161]">{recipe.note}</p>
        </section>
      )}

      {/* Tags */}
      {recipe.tags && (
        <div className="flex flex-wrap gap-2 border-t border-[#EEEEEE] pt-8">
          {recipe.tags.split(',').map((tag, index) => (
            <span key={index} className="border border-[#E0E0E0] px-3 py-1 text-[11px] tracking-[0.5px] text-[#757575]">
              {tag.trim()}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeDetail;
