'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import SourceBadge from '@/components/ui/SourceBadge';
import ToolChips from '@/components/ui/ToolChips';
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
        {recipe.coverImage ? (
          <Image
            src={recipe.coverImage}
            alt={recipe.title}
            fill
            className="object-cover transition-transform duration-[600ms] group-hover:scale-105"
            style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#F5F5F5]">
            <span className="text-xs tracking-[3px] text-[#BDBDBD]">NO IMAGE</span>
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs text-[#9E9E9E]">{recipe.authorName || '匿名'}</span>
          <SourceBadge refUrl={recipe.refUrl} />
        </div>
        <h3 className="mb-4 text-xl font-medium text-black">{recipe.title}</h3>
        <div className="mb-4 flex items-center gap-4 text-sm text-[#757575]">
          <span>{recipe.forPeople}人份</span>
          {recipe.cookingTime && <span>{recipe.cookingTime}分鐘</span>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {recipe.tags &&
            recipe.tags.split(',').map((tag, index) => (
              <span
                key={index}
                className="border border-[#E0E0E0] px-3 py-1 text-[11px] tracking-[0.5px] text-[#757575]"
              >
                {tag.trim()}
              </span>
            ))}
          <ToolChips tools={recipe.cookingTools} />
        </div>
      </div>
    </article>
  );
};

export default RecipeCard;
