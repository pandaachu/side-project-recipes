'use client';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { message, Modal, Spin } from 'antd';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Recipe } from '@/types/recipe';

export default function MemberRecipes() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecipes = async () => {
    debugger;
    try {
      const response = await axios.get('/api/member/recipes');
      setRecipes(response.data.recipes);
    } catch {
      message.error('載入食譜失敗');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleDelete = (recipeId: string, title: string) => {
    Modal.confirm({
      title: '確認刪除',
      content: `確定要刪除「${title}」嗎？此操作無法復原。`,
      okText: '刪除',
      cancelText: '取消',
      okButtonProps: { danger: true },
      async onOk() {
        try {
          await axios.delete(`/api/recipes/${recipeId}`);
          message.success('食譜已刪除');
          setRecipes((prev) => prev.filter((r) => r.id !== recipeId));
        } catch {
          message.error('刪除失敗');
        }
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] px-6 py-16 md:px-12">
      {/* Header */}
      <div className="mb-12 flex items-end justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-light tracking-wider">管理食譜</h1>
          <span className="text-xs tracking-[3px] text-[#9E9E9E]">MY RECIPES</span>
        </div>
        <Link
          href="/member/recipes/create"
          className="border border-black bg-black px-6 py-2 text-sm tracking-[1px] text-white no-underline transition-all duration-300 hover:bg-[#424242]"
        >
          新增食譜
        </Link>
      </div>

      {/* Recipe List */}
      {recipes.length === 0 ? (
        <div className="py-20 text-center">
          <p className="mb-4 text-sm text-[#9E9E9E]">還沒有任何食譜</p>
          <Link
            href="/member/recipes/create"
            className="border-b border-black pb-1 text-sm text-black no-underline transition-opacity duration-300 hover:opacity-60"
          >
            建立第一份食譜
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {recipes.map((recipe) => (
            <article
              key={recipe.id}
              className="flex items-center gap-6 border border-[#EEEEEE] p-4 transition-all duration-300 hover:border-[#BDBDBD]"
            >
              {/* Thumbnail */}
              <div
                className="relative h-20 w-28 shrink-0 cursor-pointer overflow-hidden"
                onClick={() => router.push(`/recipes/${recipe.id}`)}
              >
                <Image src={recipe.coverImage} alt={recipe.title} fill className="object-cover" sizes="112px" />
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <h3
                  className="mb-1 cursor-pointer truncate text-base font-medium transition-opacity duration-300 hover:opacity-60"
                  onClick={() => router.push(`/recipes/${recipe.id}`)}
                >
                  {recipe.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-[#9E9E9E]">
                  <span>{recipe.forPeople}人份</span>
                  {recipe.cookingTime && <span>{recipe.cookingTime}分鐘</span>}
                  {recipe.tags && <span>{recipe.tags}</span>}
                </div>
              </div>

              {/* Actions */}
              <div className="flex shrink-0 items-center gap-3">
                <button
                  onClick={() => router.push(`/member/recipes/${recipe.id}/edit`)}
                  className="flex h-9 w-9 items-center justify-center border border-[#E0E0E0] bg-transparent text-[#616161] transition-all duration-300 hover:border-black hover:text-black"
                  aria-label="編輯食譜"
                >
                  <EditOutlined />
                </button>
                <button
                  onClick={() => handleDelete(recipe.id, recipe.title)}
                  className="flex h-9 w-9 items-center justify-center border border-[#E0E0E0] bg-transparent text-[#616161] transition-all duration-300 hover:border-red-500 hover:text-red-500"
                  aria-label="刪除食譜"
                >
                  <DeleteOutlined />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
