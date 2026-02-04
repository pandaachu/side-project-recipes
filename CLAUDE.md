# Recipe 食譜分享應用

> Claude Code 專案說明檔（團隊共享）

## 技術棧

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Database**: MongoDB + Prisma 5 ORM
- **Auth**: NextAuth 4 (Google, Facebook, GitHub, LINE)
- **Styling**: Tailwind CSS 3 + Ant Design 5
- **Image Upload**: Cloudinary (next-cloudinary)
- **Form**: React Hook Form + Zod
- **Testing**: Playwright (E2E)
- **Deploy**: Vercel

## 目錄結構

```
app/                    # Next.js App Router pages
  (home)/recipes/       # 食譜列表與詳情頁
  api/                  # API routes (recipes, auth, register, upload)
  member/               # 會員區（我的食譜、建立、編輯）
  login/, signup/       # 認證頁面
actions/                # Server actions
components/             # React components
  header/, footer/      #   導航與頁腳
  recipe/               #   食譜相關元件
  ui/                   #   基礎 UI 元件
  page/                 #   頁面區塊元件
context/                # React Context (SessionAuthProvider)
libs/                   # 工具函數
  auth.ts               #   NextAuth 設定
  prismadb.ts           #   Prisma client 單例
types/                  # TypeScript 型別定義
constants/              # 常量
prisma/                 # Prisma schema
scripts/                # 工具腳本與 hooks
```

## 常用指令

```bash
npm run dev             # 啟動開發伺服器 (port 3000)
npm run build           # 建置專案
npm run lint            # ESLint 檢查
npm run prettier        # 格式化程式碼
npx prisma studio       # Prisma 資料庫 GUI
npx prisma generate     # 產生 Prisma Client
```

## 路徑別名

- `@/*` → 專案根目錄（tsconfig.json 設定）

## 資料模型

定義在 `prisma/schema.prisma`：

- **User**: 用戶（name, email, hashedPassword, OAuth accounts）
- **Recipe**: 食譜（title, coverImage, ingredients, steps, tags, status: DRAFT/PUBLISHED）
- **Account**: OAuth 帳戶（Google, Facebook, GitHub, LINE）
- **Image**: 上傳的圖片

## API 路由

| 路由 | 說明 |
|------|------|
| `GET/POST /api/recipes` | 食譜列表 / 新增食譜 |
| `GET/PUT/DELETE /api/recipes/[id]` | 單一食譜 CRUD |
| `GET /api/member/recipes` | 取得會員的食譜 |
| `POST /api/register` | 用戶註冊 |
| `POST /api/upload` | 圖片上傳 |
| `/api/auth/[...nextauth]` | NextAuth 認證 |

## 設計風格

遵循日系極簡美學，詳見 `.clinerules.md`：
- 黑白灰色系、大量留白
- AOS 捲動動畫效果
- Mobile-first 響應式設計

## 重要注意事項

- **不要讀取 .env 檔案** — 已有 hook 保護
- **Prisma Client** 使用 `libs/prismadb.ts` 的共用單例，不要自行 `new PrismaClient()`
- **圖片上傳** 統一使用 Cloudinary，透過 `next-cloudinary` 元件
- **認證** 使用 NextAuth，設定在 `libs/auth.ts`
- **部署** 使用 `prisma generate && next build`（Vercel）
