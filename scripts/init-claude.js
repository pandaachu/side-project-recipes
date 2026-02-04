#!/usr/bin/env node

/**
 * Claude Code 初始化腳本
 *
 * 此腳本會：
 * 1. 將 settings.example.json 中的 $PWD 替換為實際專案路徑
 * 2. 生成 settings.local.json
 * 3. 確保 hooks 腳本有執行權限
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectRoot = process.cwd();
const claudeDir = path.join(projectRoot, '.claude');
const hooksDir = path.join(projectRoot, 'scripts', 'hooks');

console.log('🚀 初始化 Claude Code 設定...\n');

// 1. 確保 .claude 目錄存在
if (!fs.existsSync(claudeDir)) {
  fs.mkdirSync(claudeDir, { recursive: true });
  console.log('✅ 建立 .claude 目錄');
}

// 2. 確保 commands 目錄存在
const commandsDir = path.join(claudeDir, 'commands');
if (!fs.existsSync(commandsDir)) {
  fs.mkdirSync(commandsDir, { recursive: true });
  console.log('✅ 建立 .claude/commands 目錄');
}

// 3. 讀取並處理 settings.example.json
const examplePath = path.join(claudeDir, 'settings.example.json');
const localPath = path.join(claudeDir, 'settings.local.json');

if (fs.existsSync(examplePath)) {
  let content = fs.readFileSync(examplePath, 'utf8');

  // 替換 $PWD 為實際路徑
  content = content.replace(/\$PWD/g, projectRoot);

  // 寫入 settings.local.json
  fs.writeFileSync(localPath, content);
  console.log('✅ 生成 settings.local.json（包含實際路徑）');
} else {
  console.log('⚠️ 找不到 settings.example.json，跳過設定檔生成');
}

// 4. 設定 hooks 腳本執行權限（Unix 系統）
if (process.platform !== 'win32' && fs.existsSync(hooksDir)) {
  const hookFiles = fs.readdirSync(hooksDir).filter((f) => f.endsWith('.js'));

  hookFiles.forEach((file) => {
    const hookPath = path.join(hooksDir, file);
    try {
      execSync(`chmod +x "${hookPath}"`);
      console.log(`✅ 設定執行權限: ${file}`);
    } catch (e) {
      console.log(`⚠️ 無法設定權限: ${file}`);
    }
  });
}

// 5. 檢查 CLAUDE.md 是否存在
const claudeMdPath = path.join(projectRoot, 'CLAUDE.md');
if (!fs.existsSync(claudeMdPath)) {
  console.log('\n💡 提示: 專案中沒有 CLAUDE.md');
  console.log("   執行 'claude' 後輸入 /init 來生成專案配置檔");
}

// 6. 顯示設定摘要
console.log('\n' + '═'.repeat(50));
console.log('📋 Claude Code 設定完成！');
console.log('═'.repeat(50));
console.log(`
📁 專案路徑: ${projectRoot}

📂 設定檔案:
   • .claude/settings.local.json - 本地設定
   • .claude/commands/           - 自訂命令
   • scripts/hooks/              - Hook 腳本
   • CLAUDE.md                   - 專案文件

🚀 下一步:
   1. 在專案目錄執行 'claude'
   2. 輸入 /init 讓 Claude 分析專案
   3. 使用自訂命令如 /sync-notion, /deploy-check

📚 可用的自訂命令:
   • /sync-notion    - 同步 Notion 資料
   • /new-section    - 建立新頁面區塊
   • /optimize       - 效能優化檢查
   • /deploy-check   - 部署前檢查
   • /design-review  - 設計審查
`);

console.log('═'.repeat(50));
