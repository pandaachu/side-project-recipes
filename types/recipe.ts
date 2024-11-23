export interface Recipe {
  id: string;
  title: string;
  coverImage: string;
  forPeople: string;
  cookingTime: number | null;
  ingredients: Array<{
    ingredient: string;
    quantity: string;
  }>;
  steps: string[];
  tags: string | null;
  cookingTool: string | null;
  note: string | null;
  authorImage: string | null;
  authorName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RecipeCardProps {
  recipe: Recipe;
}
