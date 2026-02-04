# 部署前檢查

在部署到 Vercel 之前執行完整的檢查清單。

## 檢查流程

### 1. 型別檢查

```bash
npx tsc --noEmit
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

### 4. Prisma Schema 驗證

```bash
npx prisma validate
```

確認 Prisma schema 語法正確。

### 5. 環境變數檢查

確認以下環境變數已在 Vercel 設定：

- `DATABASE_URL` - MongoDB 連線字串
- `NEXTAUTH_SECRET` - NextAuth 密鑰
- `NEXTAUTH_URL` - 應用程式 URL
- `GOOGLE_CLIENT_ID` / `GOOGLE_SECRET` - Google OAuth
- `FACEBOOK_CLIENT_ID` / `FACEBOOK_CLIENT_SECRET` - Facebook OAuth
- `GITHUB_ID` / `GITHUB_SECRET` - GitHub OAuth
- `LINE_CHANNEL_ID` / `LINE_CHANNEL_SECRET` - LINE OAuth
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Cloudinary 圖片上傳

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
✅ Prisma Schema 驗證通過
⚠️ 發現 2 個警告
❌ 缺少 OG 圖片

建議：在部署前修正所有 ❌ 項目
```

## 參數

$ARGUMENTS

- `--fix` - 自動修正可修正的問題
- `--skip-build` - 跳過建置測試（加速檢查）
