'use strict';

const fs = require('fs');
const path = require('path');

const { ensureDir } = require('./utils');
const { createStableId } = require('./fulcrum-control');

const TASK_STATUS = Object.freeze({
  TODO: 'todo',
  RUNNING: 'running',
  REVIEW: 'review',
  DONE: 'done',
  BLOCKED: 'blocked',
});

function getBoardDir(repoRoot = process.cwd()) {
  return path.join(repoRoot, '.orchestration', 'board');
}

function getBoardPath(repoRoot = process.cwd()) {
  return path.join(getBoardDir(repoRoot), 'tasks.json');
}

function createEmptyBoard() {
  return {
    version: 1,
    tasks: [],
    updatedAt: new Date().toISOString(),
  };
}

function loadBoard(repoRoot = process.cwd()) {
  const boardPath = getBoardPath(repoRoot);
  if (!fs.existsSync(boardPath)) {
    return createEmptyBoard();
  }

  const parsed = JSON.parse(fs.readFileSync(boardPath, 'utf8'));
  return {
    version: parsed.version || 1,
    tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
    updatedAt: parsed.updatedAt || new Date().toISOString(),
  };
}

function saveBoard(board, repoRoot = process.cwd()) {
  const boardDir = getBoardDir(repoRoot);
  ensureDir(boardDir);
  const nextBoard = {
    ...board,
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(getBoardPath(repoRoot), `${JSON.stringify(nextBoard, null, 2)}\n`, 'utf8');
  return nextBoard;
}

function createTask(input = {}) {
  const title = String(input.title || '').trim();
  if (!title) {
    throw new Error('Task title is required');
  }

  return {
    id: input.id || createStableId('task', `${Date.now()}:${title}`),
    title,
    description: String(input.description || '').trim(),
    objective: String(input.objective || title).trim(),
    status: input.status || TASK_STATUS.TODO,
    preferredAgents: Array.isArray(input.preferredAgents) ? input.preferredAgents : [],
    attempts: Array.isArray(input.attempts) ? input.attempts : [],
    feedback: Array.isArray(input.feedback) ? input.feedback : [],
    metadata: input.metadata || {},
    createdAt: input.createdAt || new Date().toISOString(),
    updatedAt: input.updatedAt || new Date().toISOString(),
  };
}

function upsertTask(board, task) {
  const existingIndex = board.tasks.findIndex(entry => entry.id === task.id);
  const normalized = {
    ...task,
    updatedAt: new Date().toISOString(),
  };

  if (existingIndex === -1) {
    return {
      ...board,
      tasks: [...board.tasks, normalized],
    };
  }

  const tasks = [...board.tasks];
  tasks[existingIndex] = {
    ...tasks[existingIndex],
    ...normalized,
  };
  return {
    ...board,
    tasks,
  };
}

function attachAttempt(board, taskId, attemptRef) {
  const task = board.tasks.find(entry => entry.id === taskId);
  if (!task) {
    throw new Error(`Task not found: ${taskId}`);
  }

  const nextAttempts = task.attempts.some(entry => entry.attemptId === attemptRef.attemptId)
    ? task.attempts.map(entry => entry.attemptId === attemptRef.attemptId ? { ...entry, ...attemptRef } : entry)
    : [...task.attempts, attemptRef];

  return upsertTask(board, {
    ...task,
    attempts: nextAttempts,
    status: task.status === TASK_STATUS.TODO ? TASK_STATUS.RUNNING : task.status,
  });
}

function addFeedback(board, taskId, feedback) {
  const task = board.tasks.find(entry => entry.id === taskId);
  if (!task) {
    throw new Error(`Task not found: ${taskId}`);
  }

  return upsertTask(board, {
    ...task,
    feedback: [
      ...task.feedback,
      {
        id: createStableId('feedback', `${Date.now()}:${taskId}:${feedback.attemptId || ''}:${feedback.message || ''}`),
        createdAt: new Date().toISOString(),
        ...feedback,
      }
    ],
    status: TASK_STATUS.REVIEW,
  });
}

module.exports = {
  TASK_STATUS,
  getBoardDir,
  getBoardPath,
  createTask,
  loadBoard,
  saveBoard,
  upsertTask,
  attachAttempt,
  addFeedback,
};
