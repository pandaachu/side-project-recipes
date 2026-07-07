# 食譜匯入（YouTube / Instagram / Facebook）

從影片或貼文網址萃取結構化食譜，確認後寫入 MongoDB。

## 使用方式

```
/import-recipe <網址1> [網址2 ...]
/import-recipe <IG/FB 網址>（後面貼上貼文內文）
```

支援一次貼多個網址批次匯入。IG / FB 因反爬蟲限制無法自動抓取內容，請使用者連同貼文內文一起貼上。

## 執行步驟

1. **辨識來源平台**（由網址 domain 判斷：youtube.com / youtu.be → YouTube；instagram.com → IG；facebook.com / fb.watch → FB）

2. **抓取資料**
   - **YouTube**：以 WebFetch 呼叫 oEmbed（免 API key）：
     `https://www.youtube.com/oembed?url=<網址>&format=json` → 取得 `title`、`author_name`
     再嘗試 WebFetch watch 頁面補抓影片描述（CSR 頁面可能抓不全，抓不到就以標題為主）。
     縮圖固定用 `https://i.ytimg.com/vi/<videoId>/hqdefault.jpg`（videoId 從網址解析）。
   - **Instagram / Facebook**：不嘗試抓取頁面。若使用者沒有附上內文，請他貼上貼文文字。無圖片可用（coverImage 留空）。

3. **萃取結構化食譜**（從標題、描述、內文推斷）：
   - `title`：食譜名稱（去掉頻道名、emoji、集數等雜訊）
   - `ingredients`：`[{ ingredient, quantity }]`，quantity 抓不到就填空字串
   - `steps`：步驟陣列，一句一步
   - `cookingTools`：**只能**從 `constants/recipe.ts` 的 `COOKING_TOOLS` 挑選（讀該檔取得最新清單），可多選；不確定就留空
   - `tags`：從 `RECIPE_TAGS` 挑一個，不確定留空
   - `cookingTime`：分鐘數（整數），抓不到留 null
   - `forPeople`：人份（字串，如 "2"），預設 "2"
   - `refUrl`:原始網址
   - `note`：影片中的訣竅、注意事項（選填）
   - `coverImage`：YouTube 縮圖網址；IG/FB 留空

4. **呈現草稿給使用者確認**：以表格列出每一筆的標題、食材、器具、步驟摘要，等待使用者確認或修正。**未經確認不得寫入。**

5. **寫入資料庫**：確認後，把 JSON（單筆物件或多筆陣列）寫到 `.import-draft.json`（已 gitignore），執行：
   ```
   npx tsx scripts/import-recipe.ts .import-draft.json
   ```
   - 腳本會以 `IMPORT_USER_EMAIL`（.env / .env.local）解析作者，重複的 `refUrl` 會自動跳過
   - 執行完刪除 `.import-draft.json`

6. **回報結果**：列出建立成功 / 跳過（重複）的清單，附上本機檢視連結 `http://localhost:3000/recipes`。

## 注意事項

- 器具與分類選項以 `constants/recipe.ts` 為唯一來源，不要自創值
- 食材名稱保持台灣慣用語（馬鈴薯、番茄、花椰菜…）
- 萃取不到的欄位寧可留空，不要瞎編
