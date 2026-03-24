#!/usr/bin/env node
'use strict';

const { buildPersonaSelection, getPersonaFromEnv } = require('./lib/persona-runtime');

function showHelp(exitCode = 0) {
  console.log(`
Usage: node scripts/persona-route.js <task...> [--persona-security] [--category <name>] [--risk-level <level>] [--expertise-level <level>] [--json]

Examples:
  node scripts/persona-route.js "review auth flow for security gaps"
  node scripts/persona-route.js "design the caching architecture" --persona-architect
`);
  process.exit(exitCode);
}

function parseArgs(argv) {
  const args = argv.slice(2);
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    return { help: true };
  }

  const json = args.includes('--json');
  const filtered = args.filter(arg => arg !== '--json');
  return { help: false, args: filtered, json };
}

function printHuman(result) {
  console.log(`Active persona: ${result.activePersona}`);
  console.log(`Routed primary: ${result.route.primary}`);
  console.log(`Confidence: ${result.route.confidence}`);
  console.log(`Flow: ${(result.route.commandFlow || []).join(' -> ') || '(none)'}`);
  console.log('Stack:');
  for (const item of result.personaStack || []) {
    console.log(`- ${item.name} (${item.score})`);
  }
}

function main() {
  const parsed = parseArgs(process.argv);
  if (parsed.help) {
    showHelp(0);
  }

  const result = buildPersonaSelection(parsed.args);
  const inherited = getPersonaFromEnv();
  if (result.explicitPersonas.length === 0 && inherited.activePersona) {
    result.activePersona = inherited.activePersona;
    result.explicitPersonas = [inherited.activePersona];
    if (Array.isArray(inherited.personaStack) && inherited.personaStack.length > 0) {
      result.personaStack = inherited.personaStack;
    }
    if (inherited.route && Object.keys(inherited.route).length > 0) {
      result.route = inherited.route;
    }
    if (inherited.personaProfile && Object.keys(inherited.personaProfile).length > 0) {
      result.personaProfile = inherited.personaProfile;
    }
  }
  if (parsed.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    printHuman(result);
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
};
