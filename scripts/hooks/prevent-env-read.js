#!/usr/bin/env node

/**
 * PreToolUse Hook: 防止讀取敏感檔案
 *
 * 此腳本會在 Claude 嘗試讀取檔案前執行，
 * 阻止存取 .env 等敏感設定檔。
 */

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
    // 無法解析 JSON，允許操作繼續
    process.exit(0);
  }

  // 取得 Claude 嘗試存取的檔案路徑
  const filePath = toolArgs.tool_input?.file_path || toolArgs.tool_input?.path || toolArgs.tool_input?.pattern || '';

  // 定義敏感檔案模式
  const sensitivePatterns = [
    /\.env$/,
    /\.env\.local$/,
    /\.env\.production$/,
    /\.env\.development$/,
    /\.env\..+$/,
    /secrets?\.(json|ya?ml|toml)$/,
    /credentials?\.(json|ya?ml|toml)$/,
    /\.pem$/,
    /\.key$/,
  ];

  // 檢查是否為敏感檔案
  for (const pattern of sensitivePatterns) {
    if (pattern.test(filePath)) {
      console.error(`🚫 存取被拒絕：無法讀取敏感檔案 "${filePath}"`);
      console.error(`   這是一個安全限制，以保護您的環境變數和機密資訊。`);
      process.exit(2);
    }
  }

  // 允許其他檔案存取
  process.exit(0);
}

main().catch((err) => {
  console.error('Hook 執行錯誤:', err.message);
  process.exit(0); // 發生錯誤時允許操作繼續
});
