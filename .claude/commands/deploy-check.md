# 部署前檢查

在部署到 Vercel 之前執行完整的檢查清單。

## 檢查流程

### 1. 型別檢查

```bash
npm run type-check
```

確保所有 TypeScript 型別正確，無 `any` 類型濫用。

### 2. ESLint 檢查

```bash
npm run lint
```

修正所有 linting 錯誤和警告。

### 3. 建置測試

```bash
npm run build
```

確保專案可以成功建置，無編譯錯誤。

### 4. 環境變數檢查

確認以下環境變數已在 Vercel 設定：

- `NOTION_API_KEY` - Notion API 金鑰
- `NOTION_DATABASE_ID` - Portfolio 資料庫 ID
- 其他必要的環境變數

### 5. Notion 資料同步

確認 Notion 資料庫中的內容是最新的：

- 檢查所有 Published 狀態的專案
- 確認圖片連結有效
- 驗證必要欄位都有內容

### 6. SEO 檢查

- 確認每個頁面有適當的 `metadata`
- 檢查 Open Graph 標籤
- 確認 `robots.txt` 和 `sitemap.xml`

### 7. 無障礙檢查

- 確認所有圖片有 `alt` 屬性
- 檢查顏色對比度
- 確認鍵盤導航可用

## 輸出報告

```
📋 部署前檢查報告
━━━━━━━━━━━━━━━━━━━━━━━━
✅ 型別檢查通過
✅ ESLint 檢查通過
✅ 建置成功
⚠️ 發現 2 個警告
❌ 缺少 OG 圖片

建議：在部署前修正所有 ❌ 項目
```

## 參數

$ARGUMENTS

- `--fix` - 自動修正可修正的問題
- `--skip-build` - 跳過建置測試（加速檢查）
