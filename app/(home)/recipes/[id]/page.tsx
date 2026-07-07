'use client';

import { message, Spin } from 'antd';
import axios from 'axios';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { use, useCallback, useEffect, useState } from 'react';

import CookLogButton from '@/components/recipe/CookLogButton';
import SourceBadge from '@/components/ui/SourceBadge';
import { scaleQuantity } from '@/libs/quantity';
import { getYouTubeVideoId } from '@/libs/recipeSource';
import { addToShoppingList } from '@/libs/shoppingList';
import { Recipe } from '@/types/recipe';

interface RecipeDetailProps {
  params: Promise<{
    id: string;
  }>;
}

const RecipeDetail = ({ params }: RecipeDetailProps) => {
  const { id } = use(params);
  const { data: session } = useSession();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Serving-size scaling: null until user adjusts (or base is non-numeric)
  const [servings, setServings] = useState<number | null>(null);

  const fetchRecipe = useCallback(async () => {
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
  }, [id]);

  useEffect(() => {
    fetchRecipe();
  }, [fetchRecipe]);

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

  const youTubeId = getYouTubeVideoId(recipe.refUrl);
  const baseServings = parseInt(recipe.forPeople, 10);
  const canScale = !Number.isNaN(baseServings) && baseServings > 0;
  const currentServings = servings ?? (canScale ? baseServings : null);
  const ratio = canScale && currentServings ? currentServings / baseServings : 1;

  return (
    <div className="animate-fade-in-up mx-auto max-w-3xl px-6 py-16 md:px-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="mb-3 text-3xl font-light tracking-wider md:text-4xl">{recipe.title}</h1>
        <p className="text-sm text-[#9E9E9E]">{recipe.authorName || '匿名'}</p>
      </div>

      {/* YouTube Embed (falls back to cover image for non-YouTube sources) */}
      {youTubeId ? (
        <div className="relative mb-12 aspect-video w-full overflow-hidden">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youTubeId}`}
            title={recipe.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
      ) : (
        recipe.coverImage && (
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
        )
      )}

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
        {recipe.rating && (
          <div className="text-center">
            <p className="mb-1 text-xs tracking-[1px] text-[#9E9E9E]">評分</p>
            <p className="text-lg font-light">★ {recipe.rating}</p>
          </div>
        )}
        {(recipe.cookCount ?? 0) > 0 && (
          <div className="text-center">
            <p className="mb-1 text-xs tracking-[1px] text-[#9E9E9E]">煮過</p>
            <p className="text-lg font-light">{recipe.cookCount} 次</p>
          </div>
        )}
      </div>

      {/* Cook Log Button (owner only) */}
      {session && (
        <div className="mb-12 flex justify-center">
          <CookLogButton recipeId={recipe.id} onLogged={fetchRecipe} />
        </div>
      )}

      {/* Ingredients */}
      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <section className="mb-12">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-medium">食材</h2>
              <span className="text-[10px] tracking-[2px] text-[#9E9E9E]">INGREDIENTS</span>
            </div>
            {canScale && currentServings && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setServings(Math.max(1, currentServings - 1))}
                  disabled={currentServings <= 1}
                  aria-label="減少人份"
                  className="flex h-7 w-7 items-center justify-center border border-[#E0E0E0] bg-transparent text-sm transition-all duration-300 hover:border-black disabled:opacity-30"
                >
                  −
                </button>
                <span className="min-w-[52px] text-center text-sm">
                  {currentServings} 人份
                  {ratio !== 1 && <span className="ml-1 text-[10px] text-[#9E9E9E]">(換算)</span>}
                </span>
                <button
                  onClick={() => setServings(currentServings + 1)}
                  aria-label="增加人份"
                  className="flex h-7 w-7 items-center justify-center border border-[#E0E0E0] bg-transparent text-sm transition-all duration-300 hover:border-black"
                >
                  ＋
                </button>
              </div>
            )}
          </div>
          <ul className="divide-y divide-[#F5F5F5]">
            {recipe.ingredients.map((item, index) => (
              <li key={index} className="flex items-center justify-between py-3">
                <span className="text-sm">{item.ingredient}</span>
                <span className="text-sm text-[#757575]">{scaleQuantity(item.quantity, ratio)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                // Add currently displayed (scaled) quantities
                addToShoppingList(
                  recipe.title,
                  recipe.ingredients.map((item) => ({
                    ingredient: item.ingredient,
                    quantity: scaleQuantity(item.quantity, ratio),
                  })),
                );
                message.success('已加入購物清單');
              }}
              className="border border-[#E0E0E0] bg-transparent px-4 py-2 text-xs tracking-[1px] text-[#616161] transition-all duration-300 hover:border-black hover:text-black"
            >
              ＋ 加入購物清單
            </button>
          </div>
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

      {/* Cook Logs */}
      {recipe.cookLogs && recipe.cookLogs.length > 0 && (
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-base font-medium">料理記錄</h2>
            <span className="text-[10px] tracking-[2px] text-[#9E9E9E]">COOK LOG</span>
          </div>
          <ul className="divide-y divide-[#F5F5F5]">
            {[...recipe.cookLogs].reverse().map((log, index) => (
              <li key={index} className="py-3">
                <div className="flex items-center gap-3 text-xs text-[#9E9E9E]">
                  <span>{new Date(log.cookedAt).toLocaleDateString('zh-TW')}</span>
                  {log.rating && <span className="text-black">★ {log.rating}</span>}
                </div>
                {log.note && <p className="mt-1 text-sm leading-relaxed text-[#616161]">{log.note}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Source Link */}
      {recipe.refUrl && (
        <div className="mb-12 flex justify-center">
          <a
            href={recipe.refUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-black px-6 py-3 text-sm tracking-[1px] text-black no-underline transition-all duration-300 hover:bg-black hover:text-white"
          >
            <SourceBadge refUrl={recipe.refUrl} />
            查看原始影片 / 貼文
          </a>
        </div>
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
