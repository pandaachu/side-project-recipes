// Single source of truth for recipe select options.
// Add new cookware or cuisine tags here; forms and filters all read from these lists.
export const COOKING_TOOLS = [
  '氣炸鍋',
  '小V鍋',
  '金小萬',
  '電鍋',
  '電子鍋',
  '鑄鐵鍋',
  '烤箱',
  '微波爐',
  '瓦斯爐',
] as const;

export const RECIPE_TAGS = ['美式', '中式', '日式', '韓式', '台式', '甜點'] as const;

export type CookingTool = (typeof COOKING_TOOLS)[number];
export type RecipeTag = (typeof RECIPE_TAGS)[number];
