# 資料庫檢查

檢查 Prisma schema 與 MongoDB 資料庫的同步狀態。

## 執行步驟

1. **驗證 Prisma Schema**
   - 執行 `npx prisma validate` 確認 schema 語法正確
   - 檢查資料模型定義是否完整

2. **檢查資料模型一致性**
   - 比對 `prisma/schema.prisma` 中的模型定義
   - 確認 `types/recipe.ts` 的型別與 Prisma 模型一致
   - 報告任何不匹配的欄位

3. **產生 Prisma Client**
   - 執行 `npx prisma generate` 更新 client
   - 確認產生成功無錯誤

4. **顯示摘要**
   - 列出所有資料模型及其欄位數量
   - 標示有 `@unique` 或 `@relation` 的欄位

## 資料模型

目前專案包含以下模型（定義在 `prisma/schema.prisma`）：

- **User** - 用戶（含 OAuth 關聯）
- **Account** - OAuth 帳戶
- **Recipe** - 食譜（含作者關聯）
- **Image** - 上傳的圖片

## 注意事項

- 不要修改資料庫的實際內容
- 若發現型別不匹配，只報告但不自動修正
- 輸出結果使用繁體中文

## 參數

$ARGUMENTS

- `full` - 執行完整檢查並更新 `types/` 型別定義
- `validate` - 僅驗證 schema 語法
