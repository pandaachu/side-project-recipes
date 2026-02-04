#!/usr/bin/env node

/**
 * PostToolUse Hook: Detect duplicate Prisma client instantiation
 *
 * Warns when Claude creates files that instantiate a new PrismaClient
 * instead of using the shared singleton from libs/prismadb.ts.
 */

const fs = require('fs');
const path = require('path');

// Patterns that indicate direct PrismaClient instantiation
const DIRECT_INSTANTIATION_PATTERNS = [
  /new\s+PrismaClient\s*\(/,
  /import\s+.*PrismaClient.*from\s+['"]@prisma\/client['"]/,
];

// Files that are allowed to instantiate PrismaClient
const ALLOWED_FILES = ['libs/prismadb.ts', 'libs/prismadb.js'];

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

  // Skip the prismadb singleton file itself
  const normalized = filePath.replace(/\\/g, '/');
  if (ALLOWED_FILES.some((f) => normalized.includes(f))) {
    process.exit(0);
  }

  // Read the file content
  let content;
  try {
    content = fs.readFileSync(filePath, 'utf-8');
  } catch (e) {
    process.exit(0);
  }

  // Check for direct PrismaClient instantiation
  const found = DIRECT_INSTANTIATION_PATTERNS.filter((p) => p.test(content));
  if (found.length === 0) {
    process.exit(0);
  }

  const warnings = [
    `⚠️ 偵測到直接使用 PrismaClient:`,
    `   檔案: ${path.basename(filePath)}`,
    `   請使用共用的 Prisma client 單例:`,
    `   import prisma from '@/libs/prismadb'`,
  ];

  console.log('\n🔍 Prisma 使用檢查:');
  console.log('─'.repeat(30));
  warnings.forEach((w) => console.log(w));

  process.exit(0);
}

main().catch(() => {
  process.exit(0);
});
