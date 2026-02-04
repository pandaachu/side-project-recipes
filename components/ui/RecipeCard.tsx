'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { RecipeCardProps } from '@/types/recipe';

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const router = useRouter();

  return (
    <article
      className="group cursor-pointer border border-[#EEEEEE] bg-white transition-all duration-[400ms] hover:-translate-y-1 hover:border-black hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
      style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
      onClick={() => router.push(`/recipes/${recipe.id}`)}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={recipe.coverImage}
          alt={recipe.title}
          fill
          className="object-cover transition-transform duration-[600ms] group-hover:scale-105"
          style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="p-6">
        <div className="mb-2 text-xs text-[#9E9E9E]">{recipe.authorName || '匿名'}</div>
        <h3 className="mb-4 text-xl font-medium text-black">{recipe.title}</h3>
        <div className="mb-4 flex items-center gap-4 text-sm text-[#757575]">
          <span>{recipe.forPeople}人份</span>
          {recipe.cookingTime && <span>{recipe.cookingTime}分鐘</span>}
        </div>
        {recipe.tags && (
          <div className="flex flex-wrap gap-2">
            {recipe.tags.split(',').map((tag, index) => (
              <span
                key={index}
                className="border border-[#E0E0E0] px-3 py-1 text-[11px] tracking-[0.5px] text-[#757575]"
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};

export default RecipeCard;
