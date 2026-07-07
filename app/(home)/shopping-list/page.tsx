'use client';

import Link from 'next/link';
import { useSyncExternalStore } from 'react';

import { getServerSnapshot, getSnapshot, saveShoppingList, subscribe } from '@/libs/shoppingList';

export default function ShoppingListPage() {
  // localStorage-backed external store (SSR renders the empty state)
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleItem = (index: number) => {
    saveShoppingList(items.map((item, i) => (i === index ? { ...item, checked: !item.checked } : item)));
  };

  const clearChecked = () => saveShoppingList(items.filter((item) => !item.checked));
  const clearAll = () => saveShoppingList([]);

  const checkedCount = items.filter((item) => item.checked).length;

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16 md:px-12">
      {/* Page Header */}
      <div className="mb-12 text-center">
        <h1 className="mb-2 text-3xl font-light tracking-wider md:text-4xl">購物清單</h1>
        <span className="text-xs tracking-[3px] text-[#9E9E9E]">SHOPPING LIST</span>
      </div>

      {items.length === 0 && (
        <div className="py-20 text-center">
          <p className="mb-4 text-sm text-[#9E9E9E]">清單是空的</p>
          <Link
            href="/recipes"
            className="border-b border-black pb-1 text-sm text-black no-underline transition-opacity duration-300 hover:opacity-60"
          >
            去食譜挑食材
          </Link>
        </div>
      )}

      {items.length > 0 && (
        <>
          <ul className="divide-y divide-[#F5F5F5] border-y border-[#EEEEEE]">
            {items.map((item, index) => (
              <li key={`${item.ingredient}-${index}`}>
                <label className="flex cursor-pointer items-center gap-4 py-3.5">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleItem(index)}
                    className="h-4 w-4 shrink-0 accent-black"
                  />
                  <span
                    className={`flex-1 text-sm transition-all duration-300 ${
                      item.checked ? 'text-[#BDBDBD] line-through' : 'text-black'
                    }`}
                  >
                    {item.ingredient}
                    {item.quantity && <span className="ml-2 text-[#757575]">{item.quantity}</span>}
                  </span>
                  <span className="max-w-[40%] truncate text-xs text-[#9E9E9E]">{item.recipeTitle}</span>
                </label>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={clearChecked}
              disabled={checkedCount === 0}
              className="border border-black bg-transparent px-6 py-2 text-sm tracking-[1px] text-black transition-all duration-300 hover:bg-black hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-black"
            >
              清除已買（{checkedCount}）
            </button>
            <button
              onClick={clearAll}
              className="bg-transparent px-4 py-2 text-sm text-[#9E9E9E] underline transition-colors duration-300 hover:text-black"
            >
              全部清空
            </button>
          </div>
        </>
      )}
    </div>
  );
}
