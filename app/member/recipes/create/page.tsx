'use client';

import RecipeForm from '@/components/recipe/RecipeForm';

export default function CreateRecipePage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16 md:px-12">
      <div className="mb-10 text-center">
        <h1 className="mb-2 text-2xl font-light tracking-wider">新增食譜</h1>
        <span className="text-xs tracking-[3px] text-[#9E9E9E]">NEW RECIPE</span>
      </div>
      <RecipeForm mode="create" />
    </div>
  );
}
