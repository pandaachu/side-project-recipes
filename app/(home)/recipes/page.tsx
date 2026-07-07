'use client';

import { message } from 'antd';
import axios from 'axios';
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';

import SearchBar from '@/components/ui/SearchBar';
import { COOKING_TOOLS } from '@/constants/recipe';
import { Recipe } from '@/types/recipe';

const RecipeCard = lazy(() => import('@/components/ui/RecipeCard'));

const PublicRecipes = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedTools, setSelectedTools] = useState<string[]>([]);

  useEffect(() => {
    const fetchList = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/recipes');
        setRecipes(response.data.recipes);
      } catch (error: any) {
        const errorMessage = error.response?.data || '載入食譜失敗';
        message.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    fetchList();
  }, []);

  const handleSearch = useCallback((keyword: string) => {
    setSearchKeyword(keyword);
  }, []);

  const toggleTool = (tool: string) => {
    setSelectedTools((prev) => (prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]));
  };

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      // Equipment filter: match any selected tool (OR within tools)
      if (selectedTools.length > 0) {
        const toolMatch = recipe.cookingTools?.some((tool) => selectedTools.includes(tool));
        if (!toolMatch) return false;
      }
      // Keyword filter: title / tags / ingredients (AND with equipment)
      if (searchKeyword) {
        const keyword = searchKeyword.toLowerCase();
        const titleMatch = recipe.title.toLowerCase().includes(keyword);
        const tagMatch = recipe.tags?.toLowerCase().includes(keyword);
        const ingredientMatch = recipe.ingredients?.some((item) => item.ingredient.toLowerCase().includes(keyword));
        if (!titleMatch && !tagMatch && !ingredientMatch) return false;
      }
      return true;
    });
  }, [recipes, searchKeyword, selectedTools]);

  return (
    <div className="mx-auto w-full max-w-[1200px] px-6 py-16 md:px-12">
      {/* Page Header */}
      <div className="mb-12 text-center">
        <h1 className="mb-2 text-3xl font-light tracking-wider md:text-4xl">食譜</h1>
        <span className="text-xs tracking-[3px] text-[#9E9E9E]">RECIPES</span>
      </div>

      {/* Search */}
      <div className="mb-6 flex justify-center">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Equipment Filter Chips */}
      <div className="mb-12 flex flex-wrap justify-center gap-2">
        {COOKING_TOOLS.map((tool) => {
          const isActive = selectedTools.includes(tool);
          return (
            <button
              key={tool}
              onClick={() => toggleTool(tool)}
              aria-pressed={isActive}
              className={`border px-4 py-1.5 text-xs tracking-[1px] transition-all duration-300 ${
                isActive
                  ? 'border-black bg-black text-white'
                  : 'border-[#E0E0E0] bg-transparent text-[#757575] hover:border-black hover:text-black'
              }`}
            >
              {tool}
            </button>
          );
        })}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[16/10] w-full bg-[#F5F5F5]" />
              <div className="p-6">
                <div className="mb-2 h-3 w-16 bg-[#F5F5F5]" />
                <div className="mb-4 h-5 w-3/4 bg-[#F5F5F5]" />
                <div className="h-3 w-1/2 bg-[#F5F5F5]" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recipe Grid */}
      {!isLoading && (
        <div className="stagger-children grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Suspense fallback={null}>
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </Suspense>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredRecipes.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-sm text-[#9E9E9E]">
            {searchKeyword || selectedTools.length > 0 ? '找不到符合條件的食譜' : '目前還沒有食譜'}
          </p>
        </div>
      )}
    </div>
  );
};

export default PublicRecipes;
