#!/usr/bin/env node
'use strict';

/**
 * Cross-platform skill installer CLI.
 *
 * Install any specific skill or all skills across any platform or all platforms.
 *
 * Usage:
 *   node scripts/skill-install.js --all --platform all
 *   node scripts/skill-install.js --skills tdd-workflow,api-design --platform claude,copilot
 *   node scripts/skill-install.js --all --platform copilot --project-root /path/to/project
 *   node scripts/skill-install.js --list
 *   node scripts/skill-install.js --dry-run --all --platform all
 */

const path = require('path');

const { buildSkillRegistry, validateSkillIds, PLATFORM_TARGETS } = require('./lib/skill-registry');
const { deploySkill, scaffoldPlatformDirs } = require('./lib/skill-deployers');

const ALL_PLATFORMS = PLATFORM_TARGETS;

function parseArgs(argv) {
  const args = argv.slice(2);
  const parsed = {
    skills: [],
    platforms: [],
    all: false,
    allPlatforms: false,
    list: false,
    listPlatforms: false,
    dryRun: false,
    json: false,
    projectRoot: process.cwd(),
    homeDir: process.env.HOME || process.env.USERPROFILE || require('os').homedir(),
    help: false,
    includeCopilotScaffold: true,
    scaffold: true,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--help' || arg === '-h') {
      parsed.help = true;
    } else if (arg === '--all' || arg === '-a') {
      parsed.all = true;
    } else if (arg === '--list' || arg === '-l') {
      parsed.list = true;
    } else if (arg === '--list-platforms') {
      parsed.listPlatforms = true;
    } else if (arg === '--dry-run') {
      parsed.dryRun = true;
    } else if (arg === '--json') {
      parsed.json = true;
    } else if (arg === '--no-copilot-scaffold') {
      parsed.includeCopilotScaffold = false;
    } else if (arg === '--no-scaffold') {
      parsed.scaffold = false;
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
    } else if (!arg.startsWith('-')) {
      parsed.skills.push(arg);
    }
  }

  if (parsed.platforms.length === 0 && !parsed.list && !parsed.listPlatforms && !parsed.help) {
    parsed.allPlatforms = true;
    parsed.platforms = [...ALL_PLATFORMS];
  }

  return parsed;
}

function showHelp() {
  console.log(`
Claude Fulcrum — Cross-Platform Skill Installer

Usage:
  skill-install [options] [skill-ids...]

Options:
  --all, -a               Install ALL available skills
  --skills, -s <ids>      Comma-separated skill IDs to install
  --platform, -p <names>  Comma-separated platforms (or "all")
                          Platforms: ${ALL_PLATFORMS.join(', ')}
  --project-root <path>   Project root for project-scoped platforms (cursor, antigravity, copilot)
  --home-dir <path>       Home directory for home-scoped platforms (claude, codex, opencode)
  --no-copilot-scaffold   Skip copying optional .github/ scaffold files for Copilot
  --no-scaffold           Skip copying platform dot-directories (.github, .cursor, .kilo, etc.)
  --dry-run               Show plan without making changes
  --json                  Output results as JSON
  --list, -l              List all available skills
  --list-platforms        List all supported platforms
  --help, -h              Show this help

Examples:
  # Install all skills to all platforms
  skill-install --all --platform all

  # Install specific skills to Claude and Copilot
  skill-install --skills tdd-workflow,api-design --platform claude,copilot

  # List all available skills
  skill-install --list

  # Dry-run: see what would be installed
  skill-install --dry-run --all --platform all

  # Install to a specific project folder
  skill-install --all --platform copilot --project-root ~/my-new-project
`);
}

function main() {
  const options = parseArgs(process.argv);

  if (options.help) {
    showHelp();
    process.exit(0);
  }

  const sourceRoot = path.join(__dirname, '..');
  const registry = buildSkillRegistry(sourceRoot);

  if (options.list) {
    if (options.json) {
      console.log(JSON.stringify(registry, null, 2));
    } else {
      console.log(`\nAvailable skills (${registry.length}):\n`);
      const maxIdLen = Math.max(...registry.map(s => s.id.length));
      for (const skill of registry) {
        const desc = skill.description ? ` — ${skill.description.slice(0, 80)}` : '';
        console.log(`  ${skill.id.padEnd(maxIdLen)}${desc}`);
      }
      console.log(`\nUse --all to install everything, or --skills <id,id,...> to pick specific ones.`);
    }
    process.exit(0);
  }

  if (options.listPlatforms) {
    if (options.json) {
      console.log(JSON.stringify(ALL_PLATFORMS));
    } else {
      console.log(`\nSupported platforms:\n`);
      const platformInfo = {
        claude: 'Home-scoped  (~/.claude/skills/)         — Claude Code',
        cursor: 'Project-scoped (.cursor/skills/)          — Cursor IDE',
        codex: 'Home-scoped  (~/.codex/skills/)          — OpenAI Codex',
        opencode: 'Home-scoped  (~/.opencode/skills/)       — OpenCode',
        antigravity: 'Project-scoped (.agent/skills/)           — Antigravity',
        copilot: 'Project-scoped (.claude/skills/ + optional .github/) — GitHub Copilot',
      };
      for (const platform of ALL_PLATFORMS) {
        console.log(`  ${platform.padEnd(14)} ${platformInfo[platform] || ''}`);
      }
    }
    process.exit(0);
  }

  let skillsToInstall;
  if (options.all) {
    skillsToInstall = registry;
  } else if (options.skills.length > 0) {
    const { valid, invalid } = validateSkillIds(registry, options.skills);
    if (invalid.length > 0) {
      console.error(`Unknown skill(s): ${invalid.join(', ')}`);
      console.error(`Use --list to see available skills.`);
      process.exit(1);
    }
    const idSet = new Set(valid);
    skillsToInstall = registry.filter(s => idSet.has(s.id));
  } else {
    console.error('No skills specified. Use --all or --skills <id,id,...>');
    console.error('Use --list to see available skills, or --help for usage.');
    process.exit(1);
  }

  const invalidPlatforms = options.platforms.filter(p => !ALL_PLATFORMS.includes(p));
  if (invalidPlatforms.length > 0) {
    console.error(`Unknown platform(s): ${invalidPlatforms.join(', ')}`);
    console.error(`Supported: ${ALL_PLATFORMS.join(', ')}`);
    process.exit(1);
  }

  if (options.dryRun) {
    console.log('\n=== DRY RUN — No files will be modified ===\n');
  }

  console.log(`Skills:     ${skillsToInstall.length} ${options.all ? '(all)' : `(${skillsToInstall.map(s => s.id).join(', ')})`}`);
  console.log(`Platforms:  ${options.platforms.join(', ')}${options.allPlatforms ? ' (all)' : ''}`);
  console.log(`Scaffold:   ${options.scaffold ? 'yes (copy platform dot-directories)' : 'no'}`);
  console.log(`Project:    ${options.projectRoot}`);
  console.log(`Home:       ${options.homeDir}`);
  console.log('');

  if (options.dryRun) {
    const plan = buildDryRunPlan(skillsToInstall, options);
    if (options.scaffold) {
      const scaffoldResult = scaffoldPlatformDirs({
        sourceRoot,
        projectRoot: options.projectRoot,
        homeDir: options.homeDir,
        dryRun: true,
      });
      plan.scaffold = scaffoldResult;
    }
    if (options.json) {
      console.log(JSON.stringify(plan, null, 2));
    } else {
      printDryRunPlan(plan);
      if (plan.scaffold) {
        console.log(`\nScaffold: ${plan.scaffold.copied.length} platform directories would be copied (${plan.scaffold.fileCount} files)`);
        for (const dir of plan.scaffold.copied) {
          console.log(`  → ${dir}`);
        }
      }
    }
    process.exit(0);
  }

  const results = executeInstall(skillsToInstall, options, sourceRoot);

  if (options.scaffold) {
    const scaffoldResult = scaffoldPlatformDirs({
      sourceRoot,
      projectRoot: options.projectRoot,
      homeDir: options.homeDir,
      dryRun: false,
    });
    results.scaffold = scaffoldResult;
  }

  if (options.json) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    printResults(results);
  }
}

function buildDryRunPlan(skills, options) {
  const plan = { platforms: {} };

  for (const platform of options.platforms) {
    plan.platforms[platform] = skills.map(skill => ({
      skillId: skill.id,
      platform,
      would: 'copy',
      source: skill.absolutePath,
    }));
  }

  plan.totalOperations = skills.length * options.platforms.length;
  return plan;
}

function printDryRunPlan(plan) {
  for (const [platform, ops] of Object.entries(plan.platforms)) {
    console.log(`[${platform}] ${ops.length} skill(s) would be installed:`);
    for (const op of ops) {
      console.log(`  → ${op.skillId}`);
    }
    console.log('');
  }

  console.log(`Total: ${plan.totalOperations} skill deployments across ${Object.keys(plan.platforms).length} platform(s)`);
}

function executeInstall(skills, options, sourceRoot) {
  const results = {
    platforms: {},
    successes: 0,
    failures: 0,
    errors: [],
  };

  let copilotScaffoldDone = false;

  for (const platform of options.platforms) {
    results.platforms[platform] = [];

    for (const skill of skills) {
      try {
        const deployOptions = {
          projectRoot: options.projectRoot,
          homeDir: options.homeDir,
          sourceRoot,
          includeCopilotScaffold: options.includeCopilotScaffold && !copilotScaffoldDone,
        };

        const result = deploySkill(skill, platform, deployOptions);
        results.platforms[platform].push(result);
        results.successes++;

        if (platform === 'copilot') {
          copilotScaffoldDone = true;
        }
      } catch (error) {
        results.failures++;
        results.errors.push({
          platform,
          skillId: skill.id,
          error: error.message,
        });
      }
    }
  }

  return results;
}

function printResults(results) {
  for (const [platform, deployments] of Object.entries(results.platforms)) {
    console.log(`[${platform}] ${deployments.length} skill(s) installed:`);
    for (const dep of deployments) {
      const extras = dep.extras && dep.extras.length > 0 ? ` (+${dep.extras.join(', ')})` : '';
      console.log(`  ✓ ${dep.skillId} → ${dep.destination} (${dep.fileCount} files)${extras}`);
    }
    console.log('');
  }

  console.log(`Done: ${results.successes} succeeded, ${results.failures} failed`);

  if (results.scaffold) {
    console.log(`\nScaffold: ${results.scaffold.copied.length} platform directories copied (${results.scaffold.fileCount} files)`);
    for (const dir of results.scaffold.copied) {
      console.log(`  ✓ ${dir}`);
    }
    if (results.scaffold.skipped.length > 0) {
      console.log(`  Skipped (not found in package): ${results.scaffold.skipped.join(', ')}`);
    }
  }

  if (results.errors.length > 0) {
    console.log('\nErrors:');
    for (const err of results.errors) {
      console.log(`  ✗ [${err.platform}] ${err.skillId}: ${err.error}`);
    }
  }
}

main();
