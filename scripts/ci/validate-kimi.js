#!/usr/bin/env node
/**
 * Validate Kimi Code project integration files.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.join(__dirname, '../..');
const KIMI_DIR = path.join(REPO_ROOT, '.kimi');
const AGENTS_DIR = path.join(KIMI_DIR, 'agents');
const REQUIRED_PATHS = [
  '.kimi/AGENTS.md',
  '.kimi/README.md',
  '.kimi/config.example.toml',
  '.kimi/mcp.json',
  '.kimi/agents/fulcrum.yaml',
  '.kimi/agents/fulcrum.md',
];
const TEXT_EXTENSIONS = new Set([
  '.md',
  '.json',
  '.js',
  '.ps1',
  '.sh',
  '.toml',
  '.yaml',
  '.yml',
]);
const PERSONAL_PATH_PATTERNS = [
  /C:\\Users\\(?!path\\)/i,
  /\/Users\/[^/\s]+/i,
  /\/home\/[^/\s]+/i,
];
const SECRET_PATTERNS = [
  /sk-[A-Za-z0-9_-]{12,}/,
  /AKIA[0-9A-Z]{16}/,
  /ghp_[A-Za-z0-9_]{20,}/,
  /github_pat_[A-Za-z0-9_]{20,}/,
];

function normalize(relativePath) {
  return relativePath.replace(/\\/g, '/');
}

function fail(message) {
  console.error(`ERROR: ${message}`);
  return true;
}

function collectFiles(dirPath, out = []) {
  if (!fs.existsSync(dirPath)) {
    return out;
  }

  const stat = fs.statSync(dirPath);
  if (stat.isFile()) {
    out.push(dirPath);
    return out;
  }

  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') {
      continue;
    }
    collectFiles(path.join(dirPath, entry.name), out);
  }

  return out;
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function getYamlField(content, fieldName) {
  const pattern = new RegExp(`^\\s*${fieldName}:\\s*(.+?)\\s*$`, 'm');
  const match = content.match(pattern);
  return match ? match[1].replace(/^['"]|['"]$/g, '') : null;
}

function getSubagentPaths(content) {
  const paths = [];
  const pathPattern = /^\s+path:\s*(.+?)\s*$/gm;
  let match = pathPattern.exec(content);
  while (match) {
    paths.push(match[1].replace(/^['"]|['"]$/g, ''));
    match = pathPattern.exec(content);
  }
  return paths;
}

function validateRequiredPaths() {
  let hasErrors = false;
  for (const relativePath of REQUIRED_PATHS) {
    if (!fs.existsSync(path.join(REPO_ROOT, relativePath))) {
      hasErrors = fail(`Missing required Kimi file: ${relativePath}`) || hasErrors;
    }
  }
  return hasErrors;
}

function validateMcpJson() {
  const mcpPath = path.join(KIMI_DIR, 'mcp.json');
  try {
    const data = JSON.parse(readText(mcpPath));
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return fail('.kimi/mcp.json must contain a JSON object');
    }
    if (!data.mcpServers || typeof data.mcpServers !== 'object' || Array.isArray(data.mcpServers)) {
      return fail('.kimi/mcp.json must contain a top-level mcpServers object');
    }
  } catch (error) {
    return fail(`Invalid .kimi/mcp.json: ${error.message}`);
  }
  return false;
}

function validateAgentYaml() {
  let hasErrors = false;
  const yamlFiles = collectFiles(AGENTS_DIR)
    .filter(filePath => /\.ya?ml$/i.test(filePath));

  for (const filePath of yamlFiles) {
    const relativePath = normalize(path.relative(REPO_ROOT, filePath));
    const content = readText(filePath);

    if (!/^version:\s*1\s*$/m.test(content)) {
      hasErrors = fail(`${relativePath} must declare version: 1`) || hasErrors;
    }
    if (!/^agent:\s*$/m.test(content)) {
      hasErrors = fail(`${relativePath} must declare an agent block`) || hasErrors;
    }

    const promptPath = getYamlField(content, 'system_prompt_path');
    if (promptPath) {
      const resolvedPrompt = path.resolve(path.dirname(filePath), promptPath);
      if (!resolvedPrompt.startsWith(path.resolve(AGENTS_DIR))) {
        hasErrors = fail(`${relativePath} system_prompt_path escapes .kimi/agents`) || hasErrors;
      } else if (!fs.existsSync(resolvedPrompt)) {
        hasErrors = fail(`${relativePath} references missing prompt ${promptPath}`) || hasErrors;
      }
    }

    for (const subagentPath of getSubagentPaths(content)) {
      const resolvedSubagent = path.resolve(path.dirname(filePath), subagentPath);
      if (!resolvedSubagent.startsWith(path.resolve(AGENTS_DIR))) {
        hasErrors = fail(`${relativePath} subagent path escapes .kimi/agents`) || hasErrors;
      } else if (!fs.existsSync(resolvedSubagent)) {
        hasErrors = fail(`${relativePath} references missing subagent ${subagentPath}`) || hasErrors;
      }
    }
  }

  if (yamlFiles.length === 0) {
    hasErrors = fail('No Kimi agent YAML files found') || hasErrors;
  }

  return hasErrors;
}

function validateTextHygiene() {
  let hasErrors = false;
  const files = collectFiles(KIMI_DIR)
    .filter(filePath => TEXT_EXTENSIONS.has(path.extname(filePath).toLowerCase()));

  for (const filePath of files) {
    const relativePath = normalize(path.relative(REPO_ROOT, filePath));
    const content = readText(filePath);

    for (const pattern of PERSONAL_PATH_PATTERNS) {
      if (pattern.test(content)) {
        hasErrors = fail(`Personal absolute path detected in ${relativePath}`) || hasErrors;
        break;
      }
    }

    for (const pattern of SECRET_PATTERNS) {
      if (pattern.test(content)) {
        hasErrors = fail(`Possible secret detected in ${relativePath}`) || hasErrors;
        break;
      }
    }
  }

  return hasErrors;
}

function validateKimi() {
  if (!fs.existsSync(KIMI_DIR)) {
    console.log('No .kimi directory found, skipping validation');
    process.exit(0);
  }

  const hasErrors = [
    validateRequiredPaths(),
    validateMcpJson(),
    validateAgentYaml(),
    validateTextHygiene(),
  ].some(Boolean);

  if (hasErrors) {
    process.exit(1);
  }

  console.log('Validated Kimi Code integration files');
}

validateKimi();
