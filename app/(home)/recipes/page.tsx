'use client';

import { message } from 'antd';
import axios from 'axios';
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';

import SearchBar from '@/components/ui/SearchBar';
import { COOKING_TOOLS } from '@/constants/recipe';
import { matchFridge } from '@/libs/fridgeMatch';
import { Recipe } from '@/types/recipe';

const FRIDGE_STORAGE_KEY = 'fridge-ingredients';

const RecipeCard = lazy(() => import('@/components/ui/RecipeCard'));

type SortOption = 'latest' | 'mostCooked' | 'topRated';

const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'latest', label: '最新' },
  { value: 'mostCooked', label: '最常煮' },
  { value: 'topRated', label: '評分最高' },
];

const PublicRecipes = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [fridgeMode, setFridgeMode] = useState(false);
  const [fridgeItems, setFridgeItems] = useState<string[]>([]);
  const [fridgeInput, setFridgeInput] = useState('');

  // Load fridge items from localStorage (client only)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(FRIDGE_STORAGE_KEY);
      if (saved) setFridgeItems(JSON.parse(saved));
    } catch {
      // ignore corrupted storage
    }
  }, []);

  const updateFridgeItems = (items: string[]) => {
    setFridgeItems(items);
    localStorage.setItem(FRIDGE_STORAGE_KEY, JSON.stringify(items));
  };

  const addFridgeItem = () => {
    const item = fridgeInput.trim();
    if (item && !fridgeItems.includes(item)) {
      updateFridgeItems([...fridgeItems, item]);
    }
    setFridgeInput('');
  };

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
    const filtered = recipes.filter((recipe) => {
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

    // Fridge mode: rank by ingredient coverage, drop zero-coverage recipes
    if (fridgeMode && fridgeItems.length > 0) {
      return filtered
        .map((recipe) => ({ recipe, match: matchFridge(recipe, fridgeItems) }))
        .filter((entry) => entry.match !== null && entry.match.coverage > 0)
        .sort((a, b) => (b.match?.coverage ?? 0) - (a.match?.coverage ?? 0))
        .map((entry) => ({ recipe: entry.recipe, fridgeMissing: entry.match?.missing }));
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'mostCooked') return (b.cookCount ?? 0) - (a.cookCount ?? 0);
      if (sortBy === 'topRated') return (b.rating ?? 0) - (a.rating ?? 0);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return sorted.map((recipe) => ({ recipe, fridgeMissing: undefined }));
  }, [recipes, searchKeyword, selectedTools, sortBy, fridgeMode, fridgeItems]);

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
      <div className="mb-6 flex flex-wrap justify-center gap-2">
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

      {/* Fridge Mode Toggle + Sort Control */}
      <div className="mb-6 flex items-center justify-center gap-6">
        <button
          onClick={() => setFridgeMode((prev) => !prev)}
          aria-pressed={fridgeMode}
          className={`border px-4 py-1.5 text-xs tracking-[1px] transition-all duration-300 ${
            fridgeMode
              ? 'border-black bg-black text-white'
              : 'border-[#E0E0E0] bg-transparent text-[#757575] hover:border-black hover:text-black'
          }`}
        >
          🧊 冰箱模式
        </button>
        {!fridgeMode &&
          SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setSortBy(option.value)}
              className={`bg-transparent pb-1 text-xs tracking-[1px] transition-all duration-300 ${
                sortBy === option.value
                  ? 'border-b border-black text-black'
                  : 'border-b border-transparent text-[#9E9E9E] hover:text-black'
              }`}
            >
              {option.label}
            </button>
          ))}
      </div>

      {/* Fridge Ingredients Input */}
      {fridgeMode && (
        <div className="mx-auto mb-12 max-w-[560px]">
          <div className="flex gap-2">
            <input
              value={fridgeInput}
              onChange={(e) => setFridgeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addFridgeItem();
                }
              }}
              placeholder="輸入手邊食材，按 Enter 加入（如：雞蛋）"
              className="flex-1 border border-[#E0E0E0] px-4 py-2 text-sm transition-colors duration-300 outline-none focus:border-black"
            />
            <button
              onClick={addFridgeItem}
              className="border border-black bg-black px-4 py-2 text-sm text-white transition-all duration-300 hover:bg-[#424242]"
            >
              加入
            </button>
          </div>
          {fridgeItems.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {fridgeItems.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 bg-[#F5F5F5] px-2.5 py-1 text-xs text-[#616161]"
                >
                  {item}
                  <button
                    onClick={() => updateFridgeItems(fridgeItems.filter((i) => i !== item))}
                    aria-label={`移除 ${item}`}
                    className="bg-transparent text-[#9E9E9E] hover:text-black"
                  >
                    ×
                  </button>
                </span>
              ))}
              <button
                onClick={() => updateFridgeItems([])}
                className="bg-transparent text-xs text-[#9E9E9E] underline hover:text-black"
              >
                全部清除
              </button>
            </div>
          )}
          {fridgeItems.length === 0 && (
            <p className="mt-3 text-center text-xs text-[#9E9E9E]">加入食材後，會依「可做程度」排序食譜</p>
          )}
        </div>
      )}

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
            {filteredRecipes.map(({ recipe, fridgeMissing }) => (
              <RecipeCard key={recipe.id} recipe={recipe} fridgeMissing={fridgeMissing} />
            ))}
          </Suspense>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredRecipes.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-sm text-[#9E9E9E]">
            {fridgeMode && fridgeItems.length > 0
              ? '手邊食材做不了現有的食譜，換個食材試試'
              : searchKeyword || selectedTools.length > 0
                ? '找不到符合條件的食譜'
                : '目前還沒有食譜'}
          </p>
        </div>
      )}
    </div>
  );
};

export default PublicRecipes;
