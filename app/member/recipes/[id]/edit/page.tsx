'use client';

import { message, Spin } from 'antd';
import axios from 'axios';
import { use, useEffect, useState } from 'react';

import RecipeForm from '@/components/recipe/RecipeForm';
import { Recipe } from '@/types/recipe';

interface EditRecipePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditRecipePage({ params }: EditRecipePageProps) {
  const { id } = use(params);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`/api/recipes/${id}`);
        setRecipe(response.data);
      } catch {
        message.error('載入食譜失敗');
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
    <div className="mx-auto w-full max-w-2xl px-6 py-16 md:px-12">
      <div className="mb-10 text-center">
        <h1 className="mb-2 text-2xl font-light tracking-wider">編輯食譜</h1>
        <span className="text-xs tracking-[3px] text-[#9E9E9E]">EDIT RECIPE</span>
      </div>
      <RecipeForm mode="edit" initialData={recipe} />
    </div>
  );
}
