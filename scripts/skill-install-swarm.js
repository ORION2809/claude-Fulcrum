#!/usr/bin/env node
'use strict';

/**
 * Swarm-based skill installer orchestrator.
 *
 * Runs parallel skill deployment across multiple platforms using worker agents.
 * Each platform gets its own worker that deploys skills independently.
 *
 * Topology:
 *   Coordinator → [Claude Worker, Cursor Worker, Codex Worker, ...]
 *                  each worker deploys N skills to its platform concurrently
 *
 * Usage:
 *   node scripts/skill-install-swarm.js --all --platform all
 *   node scripts/skill-install-swarm.js --skills tdd-workflow --platform claude,copilot,codex
 */

const path = require('path');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

const { buildSkillRegistry, validateSkillIds, PLATFORM_TARGETS } = require('./lib/skill-registry');
const { deploySkill } = require('./lib/skill-deployers');

const ALL_PLATFORMS = PLATFORM_TARGETS;

function parseSwarmArgs(argv) {
  const args = argv.slice(2);
  const parsed = {
    skills: [],
    platforms: [],
    all: false,
    allPlatforms: false,
    dryRun: false,
    json: false,
    projectRoot: process.cwd(),
    homeDir: process.env.HOME || process.env.USERPROFILE || require('os').homedir(),
    help: false,
    maxWorkers: ALL_PLATFORMS.length,
    includeCopilotScaffold: true,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--help' || arg === '-h') {
      parsed.help = true;
    } else if (arg === '--all' || arg === '-a') {
      parsed.all = true;
    } else if (arg === '--dry-run') {
      parsed.dryRun = true;
    } else if (arg === '--json') {
      parsed.json = true;
    } else if (arg === '--no-copilot-scaffold') {
      parsed.includeCopilotScaffold = false;
    } else if (arg === '--skills' || arg === '-s') {
      const value = args[i + 1];
      if (value) {
        parsed.skills = value.split(',').map(s => s.trim()).filter(Boolean);
        i++;
      }
    } else if (arg === '--platform' || arg === '-p') {
      const value = args[i + 1];
      if (value) {
        const platforms = value.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
        if (platforms.includes('all')) {
          parsed.allPlatforms = true;
          parsed.platforms = [...ALL_PLATFORMS];
        } else {
          parsed.platforms = platforms;
        }
        i++;
      }
    } else if (arg === '--project-root') {
      parsed.projectRoot = args[i + 1] || parsed.projectRoot;
      i++;
    } else if (arg === '--home-dir') {
      parsed.homeDir = args[i + 1] || parsed.homeDir;
      i++;
    } else if (arg === '--max-workers') {
      parsed.maxWorkers = parseInt(args[i + 1], 10) || ALL_PLATFORMS.length;
      i++;
    } else if (!arg.startsWith('-')) {
      parsed.skills.push(arg);
    }
  }

  if (parsed.platforms.length === 0 && !parsed.help) {
    parsed.allPlatforms = true;
    parsed.platforms = [...ALL_PLATFORMS];
  }

  return parsed;
}

// --- Worker thread logic ---
if (!isMainThread && parentPort && workerData) {
  runWorker(workerData);
}

function runWorker(data) {
  const { platform, skills, options, sourceRoot } = data;
  const results = [];
  const errors = [];

  for (const skill of skills) {
    try {
      const result = deploySkill(skill, platform, {
        projectRoot: options.projectRoot,
        homeDir: options.homeDir,
        sourceRoot,
        includeCopilotScaffold: options.includeCopilotScaffold,
      });
      results.push(result);
    } catch (error) {
      errors.push({
        skillId: skill.id,
        error: error.message,
      });
    }
  }

  parentPort.postMessage({ platform, results, errors });
}

// --- Coordinator logic ---
function createPlatformWorker(platform, skills, options, sourceRoot) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(__filename, {
      workerData: {
        platform,
        skills: skills.map(s => ({
          id: s.id,
          absolutePath: s.absolutePath,
          path: s.path,
        })),
        options: {
          projectRoot: options.projectRoot,
          homeDir: options.homeDir,
          includeCopilotScaffold: options.includeCopilotScaffold,
        },
        sourceRoot,
      },
    });

    worker.on('message', (message) => {
      resolve(message);
    });

    worker.on('error', (error) => {
      reject({ platform, error: error.message });
    });

    worker.on('exit', (code) => {
      if (code !== 0) {
        reject({ platform, error: `Worker exited with code ${code}` });
      }
    });
  });
}

async function runSwarm(skills, platforms, options, sourceRoot) {
  const startTime = Date.now();

  console.log(`\n🐝 Swarm deploying ${skills.length} skill(s) across ${platforms.length} platform(s)...\n`);

  const workerPromises = platforms.map(platform => {
    const platformOptions = {
      ...options,
      includeCopilotScaffold: platform === 'copilot' ? options.includeCopilotScaffold : false,
    };
    return createPlatformWorker(platform, skills, platformOptions, sourceRoot);
  });

  const workerResults = await Promise.allSettled(workerPromises);

  const combinedResults = {
    platforms: {},
    successes: 0,
    failures: 0,
    errors: [],
    duration: Date.now() - startTime,
    swarmWorkers: platforms.length,
  };

  for (const result of workerResults) {
    if (result.status === 'fulfilled') {
      const { platform, results, errors } = result.value;
      combinedResults.platforms[platform] = results;
      combinedResults.successes += results.length;
      combinedResults.failures += errors.length;
      for (const err of errors) {
        combinedResults.errors.push({ platform, ...err });
      }
    } else {
      const reason = result.reason || {};
      combinedResults.failures++;
      combinedResults.errors.push({
        platform: reason.platform || 'unknown',
        error: reason.error || 'Worker failed',
      });
    }
  }

  return combinedResults;
}

function showSwarmHelp() {
  console.log(`
Claude Fulcrum — Swarm Skill Installer (Multi-Agent Parallel Deployment)

Usage:
  skill-install-swarm [options]

Options:
  --all, -a               Install ALL available skills
  --skills, -s <ids>      Comma-separated skill IDs
  --platform, -p <names>  Comma-separated platforms (or "all")
                          Platforms: ${ALL_PLATFORMS.join(', ')}
  --project-root <path>   Project root for project-scoped platforms
  --home-dir <path>       Home directory for home-scoped platforms
  --max-workers <n>       Max parallel workers (default: ${ALL_PLATFORMS.length})
  --no-copilot-scaffold   Skip .github/ scaffold for Copilot
  --dry-run               Preview without changes
  --json                  JSON output
  --help, -h              Show help

Architecture:
  Coordinator spawns one worker thread per platform.
  Each worker deploys all requested skills to its platform independently.
  Results are aggregated and reported when all workers complete.

  Coordinator
  ├─ Worker[claude]     → deploys N skills to ~/.claude/skills/
  ├─ Worker[cursor]     → deploys N skills to .cursor/skills/
  ├─ Worker[codex]      → deploys N skills to ~/.codex/skills/
  ├─ Worker[opencode]   → deploys N skills to ~/.opencode/skills/
  ├─ Worker[copilot]    → deploys N skills to .agents/skills/ + .github/
  └─ Worker[antigravity]→ deploys N skills to .agent/skills/

Examples:
  # Deploy everything everywhere (swarm mode)
  skill-install-swarm --all --platform all

  # Deploy selected skills to 3 platforms in parallel
  skill-install-swarm --skills tdd-workflow,api-design,security-review --platform claude,codex,copilot
`);
}

async function main() {
  if (!isMainThread) {
    return;
  }

  const options = parseSwarmArgs(process.argv);

  if (options.help) {
    showSwarmHelp();
    process.exit(0);
  }

  const sourceRoot = path.join(__dirname, '..');
  const registry = buildSkillRegistry(sourceRoot);

  let skillsToInstall;
  if (options.all) {
    skillsToInstall = registry;
  } else if (options.skills.length > 0) {
    const { valid, invalid } = validateSkillIds(registry, options.skills);
    if (invalid.length > 0) {
      console.error(`Unknown skill(s): ${invalid.join(', ')}`);
      process.exit(1);
    }
    const idSet = new Set(valid);
    skillsToInstall = registry.filter(s => idSet.has(s.id));
  } else {
    console.error('No skills specified. Use --all or --skills <id,id,...>');
    process.exit(1);
  }

  const invalidPlatforms = options.platforms.filter(p => !ALL_PLATFORMS.includes(p));
  if (invalidPlatforms.length > 0) {
    console.error(`Unknown platform(s): ${invalidPlatforms.join(', ')}`);
    process.exit(1);
  }

  if (options.dryRun) {
    console.log('\n=== DRY RUN — Swarm preview ===\n');
    console.log(`Skills:     ${skillsToInstall.length}`);
    console.log(`Platforms:  ${options.platforms.join(', ')}`);
    console.log(`Workers:    ${options.platforms.length} (one per platform)`);
    console.log(`Total ops:  ${skillsToInstall.length * options.platforms.length}`);
    console.log('\nPer-platform deployment plan:');
    for (const platform of options.platforms) {
      console.log(`  [${platform}] ${skillsToInstall.length} skills`);
    }
    process.exit(0);
  }

  try {
    const results = await runSwarm(skillsToInstall, options.platforms, options, sourceRoot);

    if (options.json) {
      console.log(JSON.stringify(results, null, 2));
    } else {
      printSwarmResults(results);
    }

    process.exit(results.failures > 0 ? 1 : 0);
  } catch (error) {
    console.error(`Swarm failed: ${error.message || error}`);
    process.exit(1);
  }
}

function printSwarmResults(results) {
  for (const [platform, deployments] of Object.entries(results.platforms)) {
    console.log(`[${platform}] ${deployments.length} skill(s) deployed:`);
    for (const dep of deployments) {
      const extras = dep.extras && dep.extras.length > 0 ? ` (+${dep.extras.join(', ')})` : '';
      console.log(`  ✓ ${dep.skillId} (${dep.fileCount} files)${extras}`);
    }
    console.log('');
  }

  console.log(`Swarm complete: ${results.successes} succeeded, ${results.failures} failed`);
  console.log(`Duration: ${results.duration}ms across ${results.swarmWorkers} parallel workers`);

  if (results.errors.length > 0) {
    console.log('\nErrors:');
    for (const err of results.errors) {
      console.log(`  ✗ [${err.platform}] ${err.skillId || 'worker'}: ${err.error}`);
    }
  }
}

main();
