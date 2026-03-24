'use strict';

const fs = require('fs');
const path = require('path');

const { getAvailablePersonas, routePersona } = require('./persona-router');
const { resolveJsonIncludes } = require('./include-resolver');

const PERSONA_FLAG_PREFIX = '--persona-';

function parsePersonaArgs(args = []) {
  const available = new Set(getAvailablePersonas());
  const sanitizedArgs = [];
  const explicitPersonas = [];
  const context = {
    category: null,
    riskLevel: null,
    expertiseLevel: null,
    task: '',
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg.startsWith(PERSONA_FLAG_PREFIX)) {
      const persona = arg.slice(PERSONA_FLAG_PREFIX.length).trim();
      if (!available.has(persona)) {
        throw new Error(`Unknown persona flag: ${arg}`);
      }
      if (!explicitPersonas.includes(persona)) {
        explicitPersonas.push(persona);
      }
      continue;
    }

    if (arg === '--persona') {
      const persona = args[index + 1] || '';
      if (!available.has(persona)) {
        throw new Error(`Unknown persona: ${persona || '(missing)'}`);
      }
      if (!explicitPersonas.includes(persona)) {
        explicitPersonas.push(persona);
      }
      index += 1;
      continue;
    }

    if (arg === '--category') {
      context.category = args[index + 1] || null;
      index += 1;
      continue;
    }

    if (arg === '--risk-level') {
      context.riskLevel = args[index + 1] || null;
      index += 1;
      continue;
    }

    if (arg === '--expertise-level') {
      context.expertiseLevel = args[index + 1] || null;
      index += 1;
      continue;
    }

    sanitizedArgs.push(arg);
  }

  return {
    sanitizedArgs,
    explicitPersonas,
    context,
  };
}

function buildPersonaSelection(args = [], taskHint = '') {
  const parsed = parsePersonaArgs(args);
  const route = routePersona({
    ...parsed.context,
    task: taskHint || parsed.sanitizedArgs.join(' '),
  });

  const activePersona = parsed.explicitPersonas[0] || route.primary;
  const personaStack = parsed.explicitPersonas.length > 0
    ? parsed.explicitPersonas.map(name => ({ name, score: name === activePersona ? 1 : 0.8 }))
    : route.stack;
  const personaProfile = loadPersonaProfile(activePersona);

  return {
    ...parsed,
    activePersona,
    personaStack,
    route,
    personaProfile,
  };
}

function buildPersonaEnv(selection) {
  return {
    ECC_ACTIVE_PERSONA: selection.activePersona || '',
    ECC_PERSONA_STACK: JSON.stringify(selection.personaStack || []),
    ECC_PERSONA_ROUTE: JSON.stringify(selection.route || {}),
    ECC_PERSONA_EXPLICIT: JSON.stringify(selection.explicitPersonas || []),
    ECC_PERSONA_PROFILE: JSON.stringify(selection.personaProfile || {}),
  };
}

function getPersonaFromEnv(env = process.env) {
  const activePersona = env.ECC_ACTIVE_PERSONA || '';
  let personaStack = [];
  let route = {};
  let personaProfile = {};

  try {
    personaStack = JSON.parse(env.ECC_PERSONA_STACK || '[]');
  } catch {
    personaStack = [];
  }

  try {
    route = JSON.parse(env.ECC_PERSONA_ROUTE || '{}');
  } catch {
    route = {};
  }

  try {
    personaProfile = JSON.parse(env.ECC_PERSONA_PROFILE || '{}');
  } catch {
    personaProfile = {};
  }

  return {
    activePersona: activePersona || null,
    personaStack,
    route,
    personaProfile,
  };
}

function getPersonaConfigPath(persona, cwd = process.cwd()) {
  return path.join(cwd, 'config', 'personas', `${persona}.json`);
}

function loadPersonaProfile(persona, cwd = process.cwd()) {
  if (!persona) {
    return {};
  }

  const configPath = getPersonaConfigPath(persona, cwd);
  if (!fs.existsSync(configPath)) {
    return {};
  }

  return resolveJsonIncludes(configPath);
}

module.exports = {
  PERSONA_FLAG_PREFIX,
  parsePersonaArgs,
  buildPersonaSelection,
  buildPersonaEnv,
  getPersonaFromEnv,
  getPersonaConfigPath,
  loadPersonaProfile,
};
