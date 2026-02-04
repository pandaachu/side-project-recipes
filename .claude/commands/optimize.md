# 效能優化檢查

分析專案並提供 Next.js 15 效能優化建議。

## 檢查項目

### 1. Server Components 使用

- 檢查是否有不必要的 `"use client"` 標記
- 建議將資料獲取移至 Server Components
- 確認 `use()` hook 的正確使用

### 2. 圖片最佳化

- 檢查是否使用 `next/image` 元件
- 確認圖片是否有適當的 `width`、`height`、`alt` 屬性
- 檢查 Notion 圖片是否有快取策略

### 3. 字體最佳化

- 確認是否使用 `next/font`
- 檢查字體載入策略（swap、optional 等）

### 4. CSS 最佳化

- 確認 Tailwind CSS v4 正確配置
- 檢查是否有未使用的 CSS 類別
- 建議使用 CSS 變數進行主題管理

### 5. 資料獲取

- 檢查 Notion API 呼叫是否有適當快取
- 建議使用 `unstable_cache` 或 ISR
- 確認錯誤處理機制

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
- `data` - 僅檢查資料獲取
- `bundle` - 僅檢查 bundle 大小
