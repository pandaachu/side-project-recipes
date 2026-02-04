#!/usr/bin/env node

/**
 * PostToolUse Hook: 編輯後自動檢查
 *
 * 此腳本會在 Claude 編輯檔案後執行，
 * 自動執行格式化和型別檢查。
 */

const { execSync } = require('child_process');
const path = require('path');

async function main() {
  const chunks = [];

  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }

  const input = Buffer.concat(chunks).toString();

  if (!input.trim()) {
    process.exit(0);
  }

  let toolArgs;
  try {
    toolArgs = JSON.parse(input);
  } catch (e) {
    process.exit(0);
  }

  // 取得被編輯的檔案路徑
  const filePath = toolArgs.tool_input?.file_path || toolArgs.tool_input?.path || '';

  if (!filePath) {
    process.exit(0);
  }

  const ext = path.extname(filePath);
  const projectRoot = process.cwd();

  const results = [];

  // 只對 TypeScript/JavaScript 檔案執行檢查
  if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
    // 1. 執行 Prettier 格式化（如果存在）
    try {
      execSync(`npx prettier --write "${filePath}" 2>/dev/null`, {
        cwd: projectRoot,
        stdio: 'pipe',
      });
      results.push(`✅ 已格式化: ${path.basename(filePath)}`);
    } catch (e) {
      // Prettier 未安裝或執行失敗，跳過
    }

    // 2. 執行 TypeScript 型別檢查
    if (['.ts', '.tsx'].includes(ext)) {
      try {
        execSync(`npx tsc --noEmit 2>&1`, {
          cwd: projectRoot,
          stdio: 'pipe',
        });
        results.push(`✅ TypeScript 型別檢查通過`);
      } catch (e) {
        const output = e.stdout?.toString() || e.message;
        // 只顯示與當前檔案相關的錯誤
        const relevantErrors = output
          .split('\n')
          .filter((line) => line.includes(path.basename(filePath)))
          .slice(0, 5) // 限制顯示數量
          .join('\n');

        if (relevantErrors) {
          results.push(`⚠️ TypeScript 錯誤:\n${relevantErrors}`);
        }
      }
    }

    // 3. 執行 ESLint 檢查（如果存在）
    try {
      const lintOutput = execSync(`npx eslint "${filePath}" --format stylish 2>&1`, {
        cwd: projectRoot,
        stdio: 'pipe',
      });
      results.push(`✅ ESLint 檢查通過`);
    } catch (e) {
      const output = e.stdout?.toString() || '';
      if (output.includes('error') || output.includes('warning')) {
        const summary = output
          .split('\n')
          .filter((line) => line.includes('error') || line.includes('warning'))
          .slice(0, 3)
          .join('\n');
        if (summary) {
          results.push(`⚠️ ESLint:\n${summary}`);
        }
      }
    }
  }

  // 輸出結果給 Claude
  if (results.length > 0) {
    console.log('\n📋 自動檢查結果:');
    console.log('─'.repeat(30));
    results.forEach((r) => console.log(r));
  }

  process.exit(0);
}

main().catch((err) => {
  // 發生錯誤時靜默處理，不中斷工作流程
  process.exit(0);
});
