#!/usr/bin/env node

/**
 * PostToolUse Hook: Detect duplicate Notion query functions
 *
 * Warns when Claude creates new files containing Notion database queries
 * that may duplicate existing functions in lib/notion/service.ts.
 */

const fs = require('fs');
const path = require('path');

// Existing query functions in lib/notion/service.ts
const EXISTING_QUERIES = [
  { name: 'getPersonalInfo', description: '獲取個人資訊' },
  { name: 'getExperiences', description: '獲取工作經驗' },
  { name: 'getEducation', description: '獲取教育背景' },
  { name: 'getProjects', description: '獲取專案' },
  { name: 'getSkills', description: '獲取技能' },
  { name: 'getPageContent', description: '獲取頁面內容' },
  { name: 'getResumeData', description: '獲取完整履歷資料' },
  { name: 'fetchAllBlocks', description: '獲取所有 blocks' },
  { name: 'clearCache', description: '清除快取' },
];

// Patterns that indicate Notion API query usage
const QUERY_PATTERNS = [
  /client\.databases\.query\s*\(/,
  /client\.pages\.retrieve\s*\(/,
  /client\.blocks\.children\.list\s*\(/,
  /notionClient\.databases\.query\s*\(/,
  /notionClient\.pages\.retrieve\s*\(/,
  /notionClient\.blocks\.children\.list\s*\(/,
  /@notionhq\/client/,
];

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

  const filePath = toolArgs.tool_input?.file_path || toolArgs.tool_input?.path || '';

  if (!filePath) {
    process.exit(0);
  }

  // Only check TypeScript/JavaScript files
  const ext = path.extname(filePath);
  if (!['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
    process.exit(0);
  }

  // Skip the service file itself
  const normalized = filePath.replace(/\\/g, '/');
  if (normalized.includes('lib/notion/service')) {
    process.exit(0);
  }

  // Read the file content
  let content;
  try {
    content = fs.readFileSync(filePath, 'utf-8');
  } catch (e) {
    process.exit(0);
  }

  // Check for Notion API query patterns
  const foundPatterns = QUERY_PATTERNS.filter((p) => p.test(content));
  if (foundPatterns.length === 0) {
    process.exit(0);
  }

  // Check for function names that might duplicate existing ones
  const duplicates = EXISTING_QUERIES.filter((q) => {
    const fnPattern = new RegExp(
      `(function\\s+${q.name}|const\\s+${q.name}\\s*=|export\\s+(async\\s+)?function\\s+${q.name})`,
    );
    return fnPattern.test(content);
  });

  const warnings = [];

  if (duplicates.length > 0) {
    warnings.push(
      `⚠️ 偵測到可能重複的 Notion 查詢函數:`,
      ...duplicates.map((d) => `   - ${d.name}() 已存在於 lib/notion/service.ts (${d.description})`),
      `   請考慮直接引用: import { ${duplicates.map((d) => d.name).join(', ')} } from '@/lib/notion/service'`,
    );
  } else if (foundPatterns.length > 0) {
    warnings.push(
      `⚠️ 偵測到直接使用 Notion API 查詢:`,
      `   檔案: ${path.basename(filePath)}`,
      `   建議使用 lib/notion/service.ts 中已有的查詢函數，避免重複邏輯。`,
      `   已有函數: ${EXISTING_QUERIES.map((q) => q.name + '()').join(', ')}`,
    );
  }

  if (warnings.length > 0) {
    console.log('\n🔍 查詢重複檢查:');
    console.log('─'.repeat(30));
    warnings.forEach((w) => console.log(w));
  }

  process.exit(0);
}

main().catch(() => {
  process.exit(0);
});
