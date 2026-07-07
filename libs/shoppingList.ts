// Shopping list persisted in localStorage (client-side only, single device).
// Exposes a useSyncExternalStore-compatible API: subscribe / getSnapshot / getServerSnapshot.
export interface ShoppingItem {
  ingredient: string;
  quantity: string;
  recipeTitle: string;
  checked: boolean;
}

const STORAGE_KEY = 'shopping-list';
const UPDATE_EVENT = 'shopping-list-updated';
const EMPTY: ShoppingItem[] = [];

// Cache keyed by raw string so getSnapshot returns a stable reference
let cachedRaw: string | null = null;
let cachedList: ShoppingItem[] = EMPTY;

export function getSnapshot(): ShoppingItem[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedList = raw ? (JSON.parse(raw) as ShoppingItem[]) : EMPTY;
    } catch {
      cachedList = EMPTY;
    }
  }
  return cachedList;
}

export function getServerSnapshot(): ShoppingItem[] {
  return EMPTY;
}

export function subscribe(callback: () => void): () => void {
  window.addEventListener('storage', callback); // other tabs
  window.addEventListener(UPDATE_EVENT, callback); // same tab
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(UPDATE_EVENT, callback);
  };
}

export function saveShoppingList(items: ShoppingItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(UPDATE_EVENT));
}

// Merge a recipe's ingredients into the list; same ingredient name appends quantity
export function addToShoppingList(
  recipeTitle: string,
  ingredients: Array<{ ingredient: string; quantity: string }>,
): void {
  const list = getSnapshot().map((item) => ({ ...item }));

  for (const { ingredient, quantity } of ingredients) {
    const name = ingredient.trim();
    if (!name) continue;
    const existing = list.find((item) => item.ingredient === name && !item.checked);
    if (existing) {
      if (quantity && !existing.quantity.includes(quantity)) {
        existing.quantity = existing.quantity ? `${existing.quantity} + ${quantity}` : quantity;
      }
      if (!existing.recipeTitle.includes(recipeTitle)) {
        existing.recipeTitle = `${existing.recipeTitle}、${recipeTitle}`;
      }
    } else {
      list.push({ ingredient: name, quantity: quantity || '', recipeTitle, checked: false });
    }
  }

  saveShoppingList(list);
}
