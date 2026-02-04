#!/usr/bin/env node

/**
 * PostToolUse Hook: Auto-format after edit
 *
 * Runs Prettier on edited files to maintain consistent formatting.
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

  const filePath = toolArgs.tool_input?.file_path || toolArgs.tool_input?.path || '';

  if (!filePath) {
    process.exit(0);
  }

  const ext = path.extname(filePath);
  const projectRoot = process.cwd();

  // Only format TypeScript/JavaScript/CSS files
  if (['.ts', '.tsx', '.js', '.jsx', '.css'].includes(ext)) {
    try {
      execSync(`npx prettier --write "${filePath}" 2>/dev/null`, {
        cwd: projectRoot,
        stdio: 'pipe',
      });
    } catch (e) {
      // Prettier not installed or failed, skip silently
    }
  }

  process.exit(0);
}

main().catch(() => {
  process.exit(0);
});
