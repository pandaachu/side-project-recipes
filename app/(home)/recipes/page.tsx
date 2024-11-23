'use client';
import { message } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { lazy, Suspense } from 'react';

// import RecipeCard from '@/components/ui/RecipeCard';
import { Recipe } from '@/types/recipe';
// const { Meta } = Card;
const RecipeCard = lazy(() => import('@/components/ui/RecipeCard'));
const PublicRecipes = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/recipes');
      console.log('Fetched recipes:', response.data.recipes); // 檢查獲取到的數據
      setRecipes(response.data.recipes);
    } catch (error: any) {
      const errorMessage = error.response?.data || '載入食譜失敗';
      message.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<p>Loading ...</p>}>
          {recipes && recipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}
        </Suspense>
      </div>

      {!recipes.length && !isLoading && <div className="mt-8 text-center text-gray-500">目前還沒有食譜</div>}

      {/* {isLoading && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <Card key={index} loading={true} className="w-full">
              <Meta avatar={<Avatar />} title="Loading..." description="Loading..." />
            </Card>
          ))}
        </div>
      )} */}
    </div>
  );
};

export default PublicRecipes;
