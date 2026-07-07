# 好好吃飯 — 個人食譜紀錄站

> Claude Code 專案說明檔。單人使用的食譜收藏系統：從 YouTube / Instagram / Facebook 匯入食譜，可依食材與烹飪器具搜尋。

## 架構總覽

```
匯入流程（核心）:
  /import-recipe (Claude Code command)
    → 貼網址（YouTube 用 oEmbed 抓標題/縮圖；IG/FB 貼上內文）
    → AI 萃取結構化食譜 → 使用者確認
    → scripts/import-recipe.ts → MongoDB

瀏覽流程:
  MongoDB → /api/recipes → app/(home)/recipes（公開，含器具篩選 + 食材搜尋）
  管理（新增/編輯/刪除）→ /member/*（需 Google 登入 + 白名單）
```

## 技術棧

- **Framework**: Next.js 16 (App Router, React 19, Turbopack)
- **Language**: TypeScript 5.9
- **Database**: MongoDB Atlas + Prisma 6 ORM
- **Auth**: Auth.js v5 — **僅 Google OAuth + `ALLOWED_EMAILS` 白名單**（單人使用，無註冊功能）
- **Styling**: Tailwind CSS 4 (CSS-first config) + Ant Design 5（僅既有表單，新元件一律純 Tailwind）
- **Image**: Cloudinary 上傳；匯入的 YouTube 縮圖直接 hotlink `i.ytimg.com`
- **Form**: React Hook Form + Zod
- **Testing**: Playwright (E2E, `tests/e2e/`)
- **Deploy**: Vercel（`prisma generate && next build`）

## 目錄結構

```
app/
  (home)/recipes/        # 公開列表（器具 chips 篩選 + 搜尋）與詳情頁
  api/                   # API routes（recipes CRUD, auth, upload）
  member/                # 管理區（需登入）：我的食譜、建立、編輯
  login/                 # Google 登入頁
components/
  header/, footer/       # 導航與頁腳
  recipe/RecipeForm.tsx  # 建立/編輯表單（antd）
  ui/                    # RecipeCard, SearchBar, SourceBadge, ToolChips, ImageUpload
constants/recipe.ts      # ⭐ COOKING_TOOLS / RECIPE_TAGS 唯一來源
libs/
  auth.ts                # Auth.js 完整設定（含白名單 signIn callback）
  auth.config.ts         # Edge-compatible 設定（middleware 用）
  prismadb.ts            # Prisma client 單例
  recipeSource.ts        # refUrl → 來源平台（youtube/instagram/facebook）
scripts/
  import-recipe.ts       # 匯入腳本（/import-recipe command 呼叫）
  migrate-cooking-tools.ts  # 一次性遷移（cookingTool → cookingTools[]）
prisma/schema.prisma     # User / Account / Recipe / Image
types/recipe.ts          # Recipe domain type
tests/e2e/               # Playwright 測試
```

## 資料模型（Recipe 重點欄位）

- `title`, `coverImage`（**選填**，IG/FB 匯入常無圖 → UI 顯示 placeholder）
- `ingredients`: `[{ ingredient, quantity }]`（食材搜尋的資料來源）
- `cookingTools`: `String[]`（**多選**，值限 `constants/recipe.ts` 的 `COOKING_TOOLS`）
- `tags`: 逗號分隔字串（分類：美式/中式/日式…）
- `refUrl`: 原始影片/貼文網址（匯入時的重複偵測 key；UI 據此顯示來源 badge）
- `status`: DRAFT | PUBLISHED

## 常用指令

```bash
npm run dev             # 開發伺服器 (port 3000)
npm run build           # 建置
npm run lint            # ESLint（eslint .，Next 16 已移除 next lint）
npx prisma studio       # 資料庫 GUI
npx prisma generate     # 產生 Prisma Client（改 schema 後必跑）
npx playwright test     # E2E 測試（會自動起 dev server）
npx tsx scripts/import-recipe.ts <json>   # 手動匯入食譜
```

## 食譜匯入（/import-recipe）

使用 `.claude/commands/import-recipe.md`。流程：貼網址（可批次）→ AI 萃取草稿 → 使用者確認 → 寫 `.import-draft.json`（gitignored）→ 跑 `scripts/import-recipe.ts` 入庫。

- 作者由 `IMPORT_USER_EMAIL` env 解析（該 email 必須先在網站登入過一次）
- 相同 `refUrl` 已存在會自動跳過
- 器具/分類值**必須**取自 `constants/recipe.ts`，不可自創

## 環境變數（.env / .env.local）

| 變數 | 用途 |
|------|------|
| `DATABASE_URL` | MongoDB Atlas 連線字串 |
| `NEXTAUTH_SECRET` / `NEXTAUTH_URL` | Auth.js |
| `GOOGLE_CLIENT_ID` / `GOOGLE_SECRET` | 唯一的登入 provider |
| `ALLOWED_EMAILS` | 逗號分隔白名單，只有名單內 Google 帳號能登入 |
| `IMPORT_USER_EMAIL` | 匯入腳本建立食譜時的作者 email |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | 圖片上傳 |

## 慣例與注意事項

- **器具/分類選項**：只改 `constants/recipe.ts`，表單、篩選 chips、匯入 command 全部讀這裡
- **不要讀取 .env 檔案** — 已有 hook 保護
- **Prisma Client** 用 `libs/prismadb.ts` 單例，不要自行 `new PrismaClient()`
- **改 schema 後**：`npx prisma generate`，並同步 `types/recipe.ts` 與 API 的 zod schema
- **coverImage 可為 null**：渲染 `next/image` 前必須判空（placeholder 樣式見 RecipeCard）
- **新 UI 一律純 Tailwind**，不要擴大 antd 使用範圍；antd 只保留在既有表單
- **Tailwind v4** CSS-first（`globals.css` 的 `@theme`），禁用 v3 語法（@apply、tailwind.config、theme()）
- **Middleware** 用 `libs/auth.config.ts`（Edge-compatible，不含 Prisma）保護 `/member/*`
- **已知 console 警告**：antd v5 對 React 19 的 compatible 警告為既有問題，與功能無關
- **Commit 格式**：`<emoji> <type>(scope): english title` + 正體中文編號說明

## Future Ideas（尚未實作）

- app 內建匯入頁（`/member/recipes/import`，oEmbed 自動帶入）— 目前由 /import-recipe 覆蓋
- 器具篩選改 server-side（資料量大時）
- antd → React 19 正式相容（@ant-design/v5-patch-for-react-19）
