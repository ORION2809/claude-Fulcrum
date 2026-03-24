'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync, spawn } = require('child_process');

const SCRIPT = path.join(__dirname, '..', '..', 'scripts', 'parallel-board-mcp.js');
const ECC_SCRIPT = path.join(__dirname, '..', '..', 'scripts', 'ecc.js');

function setupRepo(tempRoot) {
  const repoRoot = path.join(tempRoot, 'repo');
  fs.mkdirSync(repoRoot, { recursive: true });
  execFileSync('git', ['init'], { cwd: repoRoot, stdio: 'ignore' });
  execFileSync('git', ['config', 'user.name', 'ECC Test'], { cwd: repoRoot, stdio: 'ignore' });
  execFileSync('git', ['config', 'user.email', 'ecc-test@example.com'], { cwd: repoRoot, stdio: 'ignore' });
  fs.writeFileSync(path.join(repoRoot, 'README.md'), '# temp repo\n', 'utf8');
  execFileSync('git', ['add', 'README.md'], { cwd: repoRoot, stdio: 'ignore' });
  execFileSync('git', ['commit', '-m', 'init'], { cwd: repoRoot, stdio: 'ignore' });
  return repoRoot;
}

function encodeMessage(message) {
  const body = JSON.stringify(message);
  return `Content-Length: ${Buffer.byteLength(body, 'utf8')}\r\n\r\n${body}`;
}

function createMcpClient(child) {
  let buffer = Buffer.alloc(0);
  const pending = new Map();

  child.stdout.on('data', chunk => {
    buffer = Buffer.concat([buffer, chunk]);

    while (true) {
      const headerEnd = buffer.indexOf('\r\n\r\n');
      if (headerEnd === -1) {
        break;
      }

      const headerText = buffer.slice(0, headerEnd).toString('utf8');
      const contentLengthHeader = headerText
        .split('\r\n')
        .find(line => line.toLowerCase().startsWith('content-length:'));
      if (!contentLengthHeader) {
        buffer = buffer.slice(headerEnd + 4);
        continue;
      }

      const contentLength = Number(contentLengthHeader.split(':')[1].trim());
      const totalLength = headerEnd + 4 + contentLength;
      if (buffer.length < totalLength) {
        break;
      }

      const body = buffer.slice(headerEnd + 4, totalLength).toString('utf8');
      buffer = buffer.slice(totalLength);
      const message = JSON.parse(body);
      const resolver = pending.get(message.id);
      if (resolver) {
        pending.delete(message.id);
        resolver.resolve(message);
      }
    }
  });

  child.stderr.on('data', chunk => {
    for (const entry of pending.values()) {
      entry.reject(new Error(Buffer.from(chunk).toString('utf8')));
    }
    pending.clear();
  });

  return {
    request(message) {
      return new Promise((resolve, reject) => {
        pending.set(message.id, { resolve, reject });
        child.stdin.write(encodeMessage(message));
      });
    },
  };
}

function test(name, fn) {
  return Promise.resolve()
    .then(fn)
    .then(() => {
      console.log(`  \u2713 ${name}`);
      return true;
    })
    .catch(error => {
      console.log(`  \u2717 ${name}`);
      console.log(`    Error: ${error.message}`);
      return false;
    });
}

async function main() {
  console.log('\nParallel Board MCP Tests');
  console.log('========================\n');

  let passed = 0;
  let failed = 0;

  if (await test('MCP server initializes and exposes task tools over stdio', async () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-board-mcp-tools-'));
    const repoRoot = setupRepo(tempRoot);
    const child = spawn('node', [SCRIPT], {
      cwd: repoRoot,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    try {
      const client = createMcpClient(child);

      const initialize = await client.request({
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {},
          clientInfo: { name: 'ecc-test', version: '1.0.0' },
        },
      });
      assert.strictEqual(initialize.result.serverInfo.name, 'claude-fulcrum-parallel-board');

      const tools = await client.request({
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/list',
        params: {},
      });
      const toolNames = tools.result.tools.map(tool => tool.name);
      assert.ok(toolNames.includes('parallel_board_create_task'));
      assert.ok(toolNames.includes('parallel_board_create_attempt_group'));

      const created = await client.request({
        jsonrpc: '2.0',
        id: 3,
        method: 'tools/call',
        params: {
          name: 'parallel_board_create_task',
          arguments: {
            title: 'Compare auth implementations',
            preferredAgents: ['claude', 'codex'],
          },
        },
      });
      assert.strictEqual(created.result.structuredContent.task.title, 'Compare auth implementations');

      const listed = await client.request({
        jsonrpc: '2.0',
        id: 4,
        method: 'tools/call',
        params: {
          name: 'parallel_board_list_tasks',
          arguments: {},
        },
      });
      assert.strictEqual(listed.result.structuredContent.tasks.length, 1);
    } finally {
      child.kill();
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  })) passed += 1; else failed += 1;

  if (await test('MCP server creates and reads grouped attempts', async () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-board-mcp-groups-'));
    const repoRoot = setupRepo(tempRoot);
    const worktreeRoot = path.join(tempRoot, 'worktrees');
    const dbPath = path.join(tempRoot, 'state.sqlite');
    fs.mkdirSync(worktreeRoot, { recursive: true });
    const child = spawn('node', [SCRIPT], {
      cwd: repoRoot,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    try {
      const client = createMcpClient(child);

      await client.request({
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {},
          clientInfo: { name: 'ecc-test', version: '1.0.0' },
        },
      });

      const created = await client.request({
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
          name: 'parallel_board_create_attempt_group',
          arguments: {
            name: 'auth-spike',
            task: 'Implement auth flow',
            agents: ['claude', 'codex'],
            worktreeRoot,
            dbPath,
          },
        },
      });
      const payload = created.result.structuredContent;
      assert.strictEqual(payload.attempts.length, 2);

      const read = await client.request({
        jsonrpc: '2.0',
        id: 3,
        method: 'tools/call',
        params: {
          name: 'parallel_board_get_attempt_group',
          arguments: {
            groupId: payload.groupId,
          },
        },
      });
      assert.strictEqual(read.result.structuredContent.manifest.groupId, payload.groupId);

      const retry = await client.request({
        jsonrpc: '2.0',
        id: 4,
        method: 'tools/call',
        params: {
          name: 'parallel_board_retry_attempt_group',
          arguments: {
            groupId: payload.groupId,
            attemptId: payload.attempts[0].id,
            message: 'Refine auth edge-cases',
            dbPath,
            worktreeRoot,
          },
        },
      });
      assert.ok(retry.result.structuredContent.retryAttempt.id);
    } finally {
      child.kill();
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  })) passed += 1; else failed += 1;

  if (await test('ecc CLI exposes parallel-board-mcp command', async () => {
    const output = execFileSync('node', [ECC_SCRIPT], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 10000,
    });
    assert.ok(output.includes('parallel-board-mcp'));
  })) passed += 1; else failed += 1;

  console.log(`\n${passed} passed, ${failed} failed\n`);
  process.exitCode = failed > 0 ? 1 : 0;
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
