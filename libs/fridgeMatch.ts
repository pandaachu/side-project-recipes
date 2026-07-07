import type { Recipe } from '@/types/recipe';

export interface FridgeMatch {
  coverage: number; // matched / total ingredients (0..1)
  matched: string[];
  missing: string[];
}

// Match a recipe against on-hand ingredients.
// Bidirectional substring match so「蛋」hits「雞蛋」and vice versa.
export function matchFridge(recipe: Recipe, fridgeItems: string[]): FridgeMatch | null {
  const ingredients = (recipe.ingredients ?? []).map((item) => item.ingredient.trim()).filter(Boolean);
  if (ingredients.length === 0) return null;

  const items = fridgeItems.map((s) => s.trim().toLowerCase()).filter(Boolean);
  const matched: string[] = [];
  const missing: string[] = [];

  for (const ingredient of ingredients) {
    const lower = ingredient.toLowerCase();
    const hit = items.some((item) => lower.includes(item) || item.includes(lower));
    (hit ? matched : missing).push(ingredient);
  }

  return { coverage: matched.length / ingredients.length, matched, missing };
}
