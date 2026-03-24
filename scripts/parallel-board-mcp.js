#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const {
  TASK_STATUS,
  createTask,
  loadBoard,
  saveBoard,
  upsertTask,
  attachAttempt,
  addFeedback,
} = require('./lib/parallel-board');
const {
  createAttemptGroup,
  compareAttemptGroup,
  addGroupFeedback,
  retryAttemptGroup,
  getGroupArtifactPaths,
} = require('./attempt-group-cli');

const SERVER_INFO = {
  name: 'claude-fulcrum-parallel-board',
  version: '1.0.0',
};

const JSON_RPC_VERSION = '2.0';

function readAttemptGroupState(repoRoot, groupId) {
  const paths = getGroupArtifactPaths(repoRoot, groupId);
  const manifest = fs.existsSync(paths.manifestPath)
    ? JSON.parse(fs.readFileSync(paths.manifestPath, 'utf8'))
    : null;
  const comparison = fs.existsSync(paths.comparisonJsonPath)
    ? JSON.parse(fs.readFileSync(paths.comparisonJsonPath, 'utf8'))
    : null;
  const feedback = fs.existsSync(paths.feedbackPath)
    ? fs.readFileSync(paths.feedbackPath, 'utf8')
      .split('\n')
      .filter(Boolean)
      .map(line => JSON.parse(line))
    : [];

  return {
    groupId,
    manifest,
    comparison,
    feedback,
    paths,
  };
}

function buildTextContent(text) {
  return [{ type: 'text', text }];
}

function buildJsonToolResult(payload) {
  return {
    content: buildTextContent(JSON.stringify(payload, null, 2)),
    structuredContent: payload,
  };
}

function getTaskOrThrow(board, taskId) {
  const task = board.tasks.find(entry => entry.id === taskId);
  if (!task) {
    throw new Error(`Task not found: ${taskId}`);
  }
  return task;
}

async function callTool(repoRoot, name, args = {}) {
  if (name === 'parallel_board_list_tasks') {
    return buildJsonToolResult({ tasks: loadBoard(repoRoot).tasks });
  }

  if (name === 'parallel_board_create_task') {
    const task = createTask({
      title: args.title,
      description: args.description,
      objective: args.objective,
      preferredAgents: Array.isArray(args.preferredAgents) ? args.preferredAgents : [],
      metadata: args.metadata || {},
    });
    const board = saveBoard(upsertTask(loadBoard(repoRoot), task), repoRoot);
    return buildJsonToolResult({ task: getTaskOrThrow(board, task.id) });
  }

  if (name === 'parallel_board_attach_attempt') {
    if (!args.taskId || !args.attemptId) {
      throw new Error('taskId and attemptId are required');
    }
    const board = saveBoard(attachAttempt(loadBoard(repoRoot), args.taskId, {
      attemptId: args.attemptId,
      groupId: args.groupId || null,
      agentName: args.agentName || null,
      attachedAt: args.attachedAt || new Date().toISOString(),
    }), repoRoot);
    return buildJsonToolResult({ task: getTaskOrThrow(board, args.taskId) });
  }

  if (name === 'parallel_board_add_task_feedback') {
    if (!args.taskId || !args.attemptId || !args.message) {
      throw new Error('taskId, attemptId, and message are required');
    }
    const board = saveBoard(addFeedback(loadBoard(repoRoot), args.taskId, {
      attemptId: args.attemptId,
      groupId: args.groupId || null,
      message: args.message,
    }), repoRoot);
    return buildJsonToolResult({ task: getTaskOrThrow(board, args.taskId) });
  }

  if (name === 'parallel_board_set_task_status') {
    if (!args.taskId || !args.status) {
      throw new Error('taskId and status are required');
    }
    if (!Object.values(TASK_STATUS).includes(args.status)) {
      throw new Error(`status must be one of: ${Object.values(TASK_STATUS).join(', ')}`);
    }
    const board = loadBoard(repoRoot);
    const task = getTaskOrThrow(board, args.taskId);
    const nextBoard = saveBoard(upsertTask(board, {
      ...task,
      status: args.status,
    }), repoRoot);
    return buildJsonToolResult({ task: getTaskOrThrow(nextBoard, args.taskId) });
  }

  if (name === 'parallel_board_create_attempt_group') {
    if (!args.name) {
      throw new Error('name is required');
    }
    const payload = await createAttemptGroup({
      repoRoot,
      positional: [args.name],
      task: args.task || null,
      taskId: args.taskId || null,
      agents: Array.isArray(args.agents) && args.agents.length > 0 ? args.agents : ['claude', 'codex', 'gemini'],
      baseRef: args.baseRef || 'HEAD',
      dbPath: args.dbPath || null,
      worktreeRoot: args.worktreeRoot || null,
    });
    return buildJsonToolResult(payload);
  }

  if (name === 'parallel_board_compare_attempt_group') {
    if (!args.groupId) {
      throw new Error('groupId is required');
    }
    const payload = await compareAttemptGroup({
      repoRoot,
      positional: [args.groupId],
      dbPath: args.dbPath || null,
      baseRef: args.baseRef || 'HEAD',
    });
    return buildJsonToolResult(payload);
  }

  if (name === 'parallel_board_get_attempt_group') {
    if (!args.groupId) {
      throw new Error('groupId is required');
    }
    const payload = readAttemptGroupState(repoRoot, args.groupId);
    if (!payload.manifest) {
      throw new Error(`Attempt group not found: ${args.groupId}`);
    }
    return buildJsonToolResult(payload);
  }

  if (name === 'parallel_board_add_group_feedback') {
    if (!args.groupId || !args.attemptId || !args.message) {
      throw new Error('groupId, attemptId, and message are required');
    }
    const payload = await addGroupFeedback({
      repoRoot,
      positional: [args.groupId, args.attemptId, ...String(args.message).split(/\s+/).filter(Boolean)],
    });
    return buildJsonToolResult(payload);
  }

  if (name === 'parallel_board_retry_attempt_group') {
    if (!args.groupId || !args.attemptId || !args.message) {
      throw new Error('groupId, attemptId, and message are required');
    }
    const payload = await retryAttemptGroup({
      repoRoot,
      dbPath: args.dbPath || null,
      worktreeRoot: args.worktreeRoot || null,
      positional: [args.groupId, args.attemptId, ...String(args.message).split(/\s+/).filter(Boolean)],
    });
    return buildJsonToolResult(payload);
  }

  throw new Error(`Unknown tool: ${name}`);
}

function listTools() {
  return [
    {
      name: 'parallel_board_list_tasks',
      description: 'List all tasks on the Claude Fulcrum parallel execution board.',
      inputSchema: {
        type: 'object',
        properties: {},
        additionalProperties: false,
      },
    },
    {
      name: 'parallel_board_create_task',
      description: 'Create a new task on the parallel execution board.',
      inputSchema: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          objective: { type: 'string' },
          preferredAgents: { type: 'array', items: { type: 'string' } },
          metadata: { type: 'object' },
        },
        required: ['title'],
        additionalProperties: false,
      },
    },
    {
      name: 'parallel_board_attach_attempt',
      description: 'Attach an existing attempt to a task on the board.',
      inputSchema: {
        type: 'object',
        properties: {
          taskId: { type: 'string' },
          attemptId: { type: 'string' },
          groupId: { type: 'string' },
          agentName: { type: 'string' },
          attachedAt: { type: 'string' },
        },
        required: ['taskId', 'attemptId'],
        additionalProperties: false,
      },
    },
    {
      name: 'parallel_board_add_task_feedback',
      description: 'Store review feedback against a task attempt.',
      inputSchema: {
        type: 'object',
        properties: {
          taskId: { type: 'string' },
          attemptId: { type: 'string' },
          groupId: { type: 'string' },
          message: { type: 'string' },
        },
        required: ['taskId', 'attemptId', 'message'],
        additionalProperties: false,
      },
    },
    {
      name: 'parallel_board_set_task_status',
      description: 'Update the status for a board task.',
      inputSchema: {
        type: 'object',
        properties: {
          taskId: { type: 'string' },
          status: { type: 'string', enum: Object.values(TASK_STATUS) },
        },
        required: ['taskId', 'status'],
        additionalProperties: false,
      },
    },
    {
      name: 'parallel_board_create_attempt_group',
      description: 'Create same-task isolated attempts across multiple agent/tool labels.',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          task: { type: 'string' },
          taskId: { type: 'string' },
          agents: { type: 'array', items: { type: 'string' } },
          baseRef: { type: 'string' },
          dbPath: { type: 'string' },
          worktreeRoot: { type: 'string' },
        },
        required: ['name'],
        additionalProperties: false,
      },
    },
    {
      name: 'parallel_board_compare_attempt_group',
      description: 'Compare diffs for all attempts in a parallel attempt group.',
      inputSchema: {
        type: 'object',
        properties: {
          groupId: { type: 'string' },
          baseRef: { type: 'string' },
          dbPath: { type: 'string' },
        },
        required: ['groupId'],
        additionalProperties: false,
      },
    },
    {
      name: 'parallel_board_get_attempt_group',
      description: 'Read the manifest, comparison, and feedback for an attempt group.',
      inputSchema: {
        type: 'object',
        properties: {
          groupId: { type: 'string' },
        },
        required: ['groupId'],
        additionalProperties: false,
      },
    },
    {
      name: 'parallel_board_add_group_feedback',
      description: 'Store feedback against a grouped attempt and propagate it to the board review state.',
      inputSchema: {
        type: 'object',
        properties: {
          groupId: { type: 'string' },
          attemptId: { type: 'string' },
          message: { type: 'string' },
        },
        required: ['groupId', 'attemptId', 'message'],
        additionalProperties: false,
      },
    },
    {
      name: 'parallel_board_retry_attempt_group',
      description: 'Create a retry attempt from review feedback against an existing grouped attempt.',
      inputSchema: {
        type: 'object',
        properties: {
          groupId: { type: 'string' },
          attemptId: { type: 'string' },
          message: { type: 'string' },
          dbPath: { type: 'string' },
          worktreeRoot: { type: 'string' },
        },
        required: ['groupId', 'attemptId', 'message'],
        additionalProperties: false,
      },
    },
  ];
}

function writeMessage(message) {
  const payload = Buffer.from(JSON.stringify(message), 'utf8');
  process.stdout.write(`Content-Length: ${payload.length}\r\n\r\n`);
  process.stdout.write(payload);
}

function createErrorResponse(id, code, message) {
  return {
    jsonrpc: JSON_RPC_VERSION,
    id,
    error: {
      code,
      message,
    },
  };
}

function createSuccessResponse(id, result) {
  return {
    jsonrpc: JSON_RPC_VERSION,
    id,
    result,
  };
}

async function handleRequest(repoRoot, request) {
  const { id, method, params } = request;

  if (method === 'initialize') {
    return createSuccessResponse(id, {
      protocolVersion: '2024-11-05',
      capabilities: {
        tools: {},
      },
      serverInfo: SERVER_INFO,
    });
  }

  if (method === 'notifications/initialized') {
    return null;
  }

  if (method === 'tools/list') {
    return createSuccessResponse(id, {
      tools: listTools(),
    });
  }

  if (method === 'tools/call') {
    const result = await callTool(repoRoot, params?.name, params?.arguments || {});
    return createSuccessResponse(id, result);
  }

  return createErrorResponse(id, -32601, `Method not found: ${method}`);
}

function startServer(options = {}) {
  const repoRoot = path.resolve(options.repoRoot || process.cwd());
  let buffer = Buffer.alloc(0);

  process.stdin.on('data', chunk => {
    buffer = Buffer.concat([buffer, chunk]);

    while (true) {
      const headerEnd = buffer.indexOf('\r\n\r\n');
      if (headerEnd === -1) {
        break;
      }

      const headerText = buffer.slice(0, headerEnd).toString('utf8');
      const headers = headerText.split('\r\n');
      const contentLengthHeader = headers.find(line => line.toLowerCase().startsWith('content-length:'));
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

      Promise.resolve()
        .then(() => JSON.parse(body))
        .then(request => handleRequest(repoRoot, request))
        .then(response => {
          if (response) {
            writeMessage(response);
          }
        })
        .catch(error => {
          const parsed = (() => {
            try {
              return JSON.parse(body);
            } catch {
              return {};
            }
          })();
          writeMessage(createErrorResponse(parsed.id || null, -32603, error.message || 'Internal server error'));
        });
    }
  });

  process.stdin.resume();
}

if (require.main === module) {
  startServer();
}

module.exports = {
  callTool,
  listTools,
  readAttemptGroupState,
  startServer,
};
