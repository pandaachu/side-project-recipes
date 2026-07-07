export interface CookLog {
  cookedAt: string;
  rating?: number;
  note?: string;
}

export interface Recipe {
  id: string;
  title: string;
  coverImage: string | null;
  forPeople: string;
  cookingTime: number | null;
  ingredients: Array<{
    ingredient: string;
    quantity: string;
  }>;
  steps: string[];
  tags: string | null;
  cookingTools: string[];
  refUrl: string | null;
  note: string | null;
  rating: number | null;
  cookCount: number | null;
  lastCookedAt: string | null;
  cookLogs: CookLog[] | null;
  status: 'DRAFT' | 'PUBLISHED';
  authorId: string;
  authorImage: string | null;
  authorName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RecipeCardProps {
  recipe: Recipe;
}
