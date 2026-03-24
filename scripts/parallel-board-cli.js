#!/usr/bin/env node
'use strict';

const {
  TASK_STATUS,
  createTask,
  loadBoard,
  saveBoard,
  upsertTask,
  attachAttempt,
  addFeedback,
} = require('./lib/parallel-board');

function showHelp(exitCode = 0) {
  console.log(`
Usage: node scripts/parallel-board-cli.js <command> [args...]

Commands:
  create <title>                  Create a task on the parallel board
  list                            List board tasks
  attach-attempt <task> <attempt> Attach an attempt to a task
  feedback <task> <attempt> <msg> Add review feedback for an attempt
  set-status <task> <status>      Update task status (${Object.values(TASK_STATUS).join(', ')})

Options:
  --json                          Emit machine-readable JSON
  --description <text>            Task description for create
  --objective <text>              Override task objective
  --agents <csv>                  Preferred agent/tool names for create
`);
  process.exit(exitCode);
}

function parseArgs(argv) {
  const args = argv.slice(2);
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    return { help: true };
  }

  const parsed = {
    command: args[0],
    positional: [],
    json: false,
    description: null,
    objective: null,
    agents: [],
  };

  for (let index = 1; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--json') {
      parsed.json = true;
    } else if (arg === '--description') {
      parsed.description = args[index + 1] || null;
      index += 1;
    } else if (arg === '--objective') {
      parsed.objective = args[index + 1] || null;
      index += 1;
    } else if (arg === '--agents') {
      parsed.agents = String(args[index + 1] || '')
        .split(',')
        .map(value => value.trim())
        .filter(Boolean);
      index += 1;
    } else if (arg.startsWith('--')) {
      throw new Error(`Unknown argument: ${arg}`);
    } else {
      parsed.positional.push(arg);
    }
  }

  return parsed;
}

function printTask(task) {
  console.log(`${task.id} [${task.status}] ${task.title}`);
  if (task.preferredAgents.length > 0) {
    console.log(`  Agents: ${task.preferredAgents.join(', ')}`);
  }
  if (task.attempts.length > 0) {
    console.log(`  Attempts: ${task.attempts.map(entry => entry.attemptId).join(', ')}`);
  }
  if (task.feedback.length > 0) {
    console.log(`  Feedback: ${task.feedback.length}`);
  }
}

function printTasks(tasks) {
  if (tasks.length === 0) {
    console.log('Board is empty.');
    return;
  }

  for (const task of tasks) {
    printTask(task);
  }
}

function main() {
  const options = parseArgs(process.argv);
  if (options.help) {
    showHelp(0);
  }

  const board = loadBoard(process.cwd());
  let nextBoard = board;
  let payload = null;

  if (options.command === 'create') {
    const title = options.positional.join(' ').trim();
    const task = createTask({
      title,
      description: options.description,
      objective: options.objective,
      preferredAgents: options.agents,
    });
    nextBoard = upsertTask(board, task);
    payload = { task };
  } else if (options.command === 'list') {
    payload = { tasks: board.tasks };
  } else if (options.command === 'attach-attempt') {
    const [taskId, attemptId] = options.positional;
    if (!taskId || !attemptId) {
      throw new Error('attach-attempt requires <task> <attempt>');
    }
    nextBoard = attachAttempt(board, taskId, {
      attemptId,
      attachedAt: new Date().toISOString(),
    });
    payload = { task: nextBoard.tasks.find(task => task.id === taskId) };
  } else if (options.command === 'feedback') {
    const [taskId, attemptId, ...messageParts] = options.positional;
    if (!taskId || !attemptId || messageParts.length === 0) {
      throw new Error('feedback requires <task> <attempt> <message>');
    }
    nextBoard = addFeedback(board, taskId, {
      attemptId,
      message: messageParts.join(' '),
    });
    payload = { task: nextBoard.tasks.find(task => task.id === taskId) };
  } else if (options.command === 'set-status') {
    const [taskId, status] = options.positional;
    if (!taskId || !status) {
      throw new Error('set-status requires <task> <status>');
    }
    if (!Object.values(TASK_STATUS).includes(status)) {
      throw new Error(`Unknown status: ${status}`);
    }
    const task = board.tasks.find(entry => entry.id === taskId);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }
    nextBoard = upsertTask(board, { ...task, status });
    payload = { task: nextBoard.tasks.find(entry => entry.id === taskId) };
  } else {
    throw new Error(`Unknown command: ${options.command}`);
  }

  if (nextBoard !== board) {
    saveBoard(nextBoard, process.cwd());
  }

  if (options.json) {
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  if (payload.tasks) {
    printTasks(payload.tasks);
  } else if (payload.task) {
    printTask(payload.task);
  }
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

module.exports = {
  main,
  parseArgs,
};
