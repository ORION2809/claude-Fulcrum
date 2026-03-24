#!/usr/bin/env node

const { spawnSync } = require('child_process');
const path = require('path');
const { listAvailableLanguages } = require('./lib/install-executor');
const { buildPersonaSelection, buildPersonaEnv } = require('./lib/persona-runtime');

const COMMANDS = {
  install: {
    script: 'install-apply.js',
    description: 'Install ECC content into a supported target',
  },
  plan: {
    script: 'install-plan.js',
    description: 'Inspect selective-install manifests and resolved plans',
  },
  'install-plan': {
    script: 'install-plan.js',
    description: 'Alias for plan',
  },
  'list-installed': {
    script: 'list-installed.js',
    description: 'Inspect install-state files for the current context',
  },
  doctor: {
    script: 'doctor.js',
    description: 'Diagnose missing or drifted ECC-managed files',
  },
  repair: {
    script: 'repair.js',
    description: 'Restore drifted or missing ECC-managed files',
  },
  status: {
    script: 'status.js',
    description: 'Query the Claude Fulcrum SQLite state store status summary',
  },
  'persona-route': {
    script: 'persona-route.js',
    description: 'Route a task into a persona stack and inherited command flow',
  },
  attempt: {
    script: 'attempt-cli.js',
    description: 'Create, inspect, and rehydrate isolated branch/worktree attempts',
  },
  'attempt-group': {
    script: 'attempt-group-cli.js',
    description: 'Create same-task parallel attempt groups and compare their diffs',
  },
  'parallel-board': {
    script: 'parallel-board-cli.js',
    description: 'Create and manage the lightweight parallel execution task board',
  },
  'parallel-board-server': {
    script: 'parallel-board-server.js',
    description: 'Run the lightweight parallel execution HTTP control plane and live event stream',
  },
  'parallel-board-mcp': {
    script: 'parallel-board-mcp.js',
    description: 'Run the lightweight parallel execution MCP server over stdio',
  },
  'orchestration-dashboard': {
    script: 'orchestration-dashboard.js',
    description: 'Render a live terminal dashboard for tmux/worktree orchestration sessions',
  },
  sessions: {
    script: 'sessions-cli.js',
    description: 'List or inspect ECC sessions from the SQLite state store',
  },
  'session-inspect': {
    script: 'session-inspect.js',
    description: 'Emit canonical ECC session snapshots from dmux or Claude history targets',
  },
  uninstall: {
    script: 'uninstall.js',
    description: 'Remove ECC-managed files recorded in install-state',
  },
  'skill-install': {
    script: 'skill-install.js',
    description: 'Install specific or all skills to any platform (sequential)',
  },
  'skill-swarm': {
    script: 'skill-install-swarm.js',
    description: 'Install skills across platforms in parallel (swarm mode)',
  },
};

const PRIMARY_COMMANDS = [
  'install',
  'plan',
  'list-installed',
  'doctor',
  'repair',
  'status',
  'persona-route',
  'attempt',
  'attempt-group',
  'parallel-board',
  'parallel-board-server',
  'parallel-board-mcp',
  'orchestration-dashboard',
  'sessions',
  'session-inspect',
  'uninstall',
  'skill-install',
  'skill-swarm',
];

function showHelp(exitCode = 0) {
  console.log(`
ECC selective-install CLI

Usage:
  ecc <command> [args...]
  ecc [install args...]

Commands:
${PRIMARY_COMMANDS.map(command => `  ${command.padEnd(15)} ${COMMANDS[command].description}`).join('\n')}

Compatibility:
  ecc-install        Legacy install entrypoint retained for existing flows
  ecc [args...]      Without a command, args are routed to "install"
  ecc help <command> Show help for a specific command

Examples:
  ecc typescript
  ecc install --profile developer --target claude
  ecc plan --profile core --target cursor
  ecc list-installed --json
  ecc doctor --target cursor
  ecc repair --dry-run
  ecc status --json
  ecc attempt create feature-spike
  ecc attempt status --json
  ecc attempt-group create auth-spike --task "Implement auth flow" --agents claude,codex,gemini
  ecc parallel-board list
  ecc parallel-board-server --port 3017
  ecc parallel-board-mcp
  ecc orchestration-dashboard workflow-visual-proof --watch
  ecc sessions
  ecc sessions session-active --json
  ecc session-inspect claude:latest
  ecc uninstall --target antigravity --dry-run
`);

  process.exit(exitCode);
}

function resolveCommand(argv) {
  const args = argv.slice(2);

  if (args.length === 0) {
    return { mode: 'help' };
  }

  const [firstArg, ...restArgs] = args;

  if (firstArg === '--help' || firstArg === '-h') {
    return { mode: 'help' };
  }

  if (firstArg === 'help') {
    return {
      mode: 'help-command',
      command: restArgs[0] || null,
    };
  }

  if (COMMANDS[firstArg]) {
    return {
      mode: 'command',
      command: firstArg,
      args: restArgs,
    };
  }

  const knownLegacyLanguages = listAvailableLanguages();
  const shouldTreatAsImplicitInstall = (
    firstArg.startsWith('-')
    || knownLegacyLanguages.includes(firstArg)
  );

  if (!shouldTreatAsImplicitInstall) {
    throw new Error(`Unknown command: ${firstArg}`);
  }

  return {
    mode: 'command',
    command: 'install',
    args,
  };
}

function runCommand(commandName, args) {
  const command = COMMANDS[commandName];
  if (!command) {
    throw new Error(`Unknown command: ${commandName}`);
  }

  const personaSelection = buildPersonaSelection(args, `${commandName} ${args.join(' ')}`.trim());
  const personaEnv = buildPersonaEnv(personaSelection);

  const result = spawnSync(
    process.execPath,
    [path.join(__dirname, command.script), ...personaSelection.sanitizedArgs],
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        ...personaEnv,
      },
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024,
    }
  );

  if (result.error) {
    throw result.error;
  }

  if (result.stdout) {
    process.stdout.write(result.stdout);
  }

  if (result.stderr) {
    process.stderr.write(result.stderr);
  }

  if (typeof result.status === 'number') {
    return result.status;
  }

  if (result.signal) {
    throw new Error(`Command "${commandName}" terminated by signal ${result.signal}`);
  }

  return 1;
}

function main() {
  try {
    const resolution = resolveCommand(process.argv);

    if (resolution.mode === 'help') {
      showHelp(0);
    }

    if (resolution.mode === 'help-command') {
      if (!resolution.command) {
        showHelp(0);
      }

      if (!COMMANDS[resolution.command]) {
        throw new Error(`Unknown command: ${resolution.command}`);
      }

      process.exitCode = runCommand(resolution.command, ['--help']);
      return;
    }

    process.exitCode = runCommand(resolution.command, resolution.args);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main();
