# 效能優化檢查

分析專案並提供 Next.js 15 效能優化建議。

## 檢查項目

### 1. Server Components 使用

- 檢查是否有不必要的 `"use client"` 標記
- 建議將資料獲取移至 Server Components

### 2. 圖片最佳化

- 檢查是否使用 `next/image` 或 `next-cloudinary` 元件
- 確認圖片是否有適當的 `width`、`height`、`alt` 屬性
- 檢查 Cloudinary 圖片是否有適當的轉換參數

### 3. 字體最佳化

- 確認是否使用 `next/font`
- 檢查字體載入策略（swap、optional 等）

### 4. CSS 最佳化

- 確認 Tailwind CSS 4 正確配置（CSS-first config in globals.css）
- 檢查是否有未使用的 CSS 類別
- 確認 Ant Design 的按需載入

### 5. 資料庫查詢優化

- 檢查 Prisma 查詢是否有適當的 `select` / `include`
- 避免 N+1 查詢問題
- 確認是否使用了適當的索引
- 檢查是否正確使用 `libs/prismadb.ts` 共用 client

### 6. Bundle 分析

- 執行 `npm run build` 並分析輸出
- 識別過大的 bundle
- 建議 code splitting 策略

## 輸出格式

以表格形式呈現：

| 項目 | 狀態 | 建議 |
|------|------|------|
| Server Components | ✅/⚠️/❌ | 具體建議 |

## 參數

$ARGUMENTS

可選參數：
- `images` - 僅檢查圖片最佳化
- `data` - 僅檢查資料庫查詢
- `bundle` - 僅檢查 bundle 大小
