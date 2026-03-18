#!/usr/bin/env node
// Claude Fulcrum Orchestration CLI - thin wrapper around @claude-flow/cli
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import { existsSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Walk up from orchestration/bin/ to find @claude-flow/cli in node_modules
function findCliPath() {
  let dir = resolve(__dirname, '..');
  for (let i = 0; i < 10; i++) {
    const candidate = join(dir, 'node_modules', '@claude-flow', 'cli', 'bin', 'cli.js');
    if (existsSync(candidate)) return candidate;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

const cliPath = findCliPath();
if (cliPath) {
  await import(cliPath);
} else {
  // Fallback: dev/linked installs
  await import(resolve(__dirname, '../../v3/@claude-flow/cli/bin/cli.js'));
}
