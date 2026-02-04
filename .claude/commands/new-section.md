# 建立新頁面區塊

根據設計規範建立新的頁面區塊元件。

## 設計原則

遵循 `.clinerules.md` 的極簡美學風格：

- **大量留白**: 區塊間距使用 `py-24` 至 `py-32`
- **簡潔排版**: 內容集中，避免過度裝飾
- **響應式**: Mobile-first 設計

## 元件結構

```tsx
// components/page/[SectionName].tsx
"use client"; // 僅在需要互動時添加

interface [SectionName]Props {
  // 定義 props
}

export function [SectionName]({ ...props }: [SectionName]Props) {
  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        {/* 區塊內容 */}
      </div>
    </section>
  );
}
```

## 執行步驟

1. 在 `components/page/` 或 `components/recipe/` 建立新元件
2. 遵循現有元件的命名和結構慣例
3. 添加適當的 TypeScript 型別
4. 使用 Tailwind CSS 3 語法

## 參數

$ARGUMENTS

請提供區塊名稱和簡短描述，例如：
- `RecipeGrid 食譜展示網格`
- `RecipeDetail 食譜詳情區塊`
- `UserProfile 用戶資料區塊`
