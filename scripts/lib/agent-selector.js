#!/usr/bin/env node
'use strict';

/**
 * Phase 6.1 - Tiered Agent Architecture with Ranked Selection
 * Source: Tony363-SuperClaude (Agents/registry.py, Agents/selector.py)
 *
 * Discovers agents across tiered directories (core, traits, extensions),
 * scores them against task context, and returns ranked selection results
 * with confidence, alternatives, and trait conflict detection.
 */

const fs = require('fs');
const path = require('path');

// --- Tier Definitions (Source: Tony363 agents/index.yaml) ---

const AGENT_TIERS = Object.freeze({
  CORE: 'core',
  TRAIT: 'trait',
  EXTENSION: 'extension',
});

const TIER_PRIORITY = Object.freeze({
  [AGENT_TIERS.CORE]: 1,
  [AGENT_TIERS.TRAIT]: 0,
  [AGENT_TIERS.EXTENSION]: 2,
});

// --- Selection Weights (Source: Tony363 AgentSelector) ---

const SELECTION_WEIGHTS = Object.freeze({
  triggers: 0.35,
  category: 0.25,
  taskMatch: 0.20,
  filePatterns: 0.10,
  priority: 0.10,
});

const MIN_CONFIDENCE = 0.15;
const HIGH_CONFIDENCE = 0.5;
const DEFAULT_AGENT = 'general-purpose';

// --- Trait Conflicts (Source: Tony363 TRAIT_CONFLICTS / TRAIT_TENSIONS) ---

const TRAIT_CONFLICTS = Object.freeze({
  'minimal-changes': new Set(['rapid-prototype']),
  'rapid-prototype': new Set(['minimal-changes']),
});

const TRAIT_TENSIONS = Object.freeze({
  'legacy-friendly': new Set(['cloud-native']),
  'cloud-native': new Set(['legacy-friendly']),
});

// --- Frontmatter Parser ---

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const lines = match[1].split('\n');
  const result = {};

  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;

    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();

    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    } else if (value === 'true') {
      value = true;
    } else if (value === 'false') {
      value = false;
    } else if (/^\d+$/.test(value)) {
      value = parseInt(value, 10);
    }

    result[key] = value;
  }

  return result;
}

function parseListField(content, fieldName) {
  const regex = new RegExp(`^${fieldName}:\\s*$`, 'm');
  const match = content.match(regex);
  if (!match) return [];

  const startIdx = match.index + match[0].length;
  const remaining = content.slice(startIdx);
  const items = [];
  let started = false;

  for (const line of remaining.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ')) {
      started = true;
      items.push(trimmed.slice(2).trim().replace(/^["']|["']$/g, ''));
    } else if (started && (trimmed === '' || (!trimmed.startsWith(' ') && !trimmed.startsWith('-')))) {
      break;
    }
  }

  return items;
}

// --- Agent Registry (Source: Tony363 AgentRegistry) ---

function createRegistry(agentsDir) {
  const agents = {};
  const traits = {};
  const categories = {};
  const tierAgents = {
    [AGENT_TIERS.CORE]: [],
    [AGENT_TIERS.TRAIT]: [],
    [AGENT_TIERS.EXTENSION]: [],
  };

  return Object.freeze({
    agents,
    traits,
    categories,
    tierAgents,
    agentsDir,
  });
}

function discoverAgents(registry) {
  const { agentsDir } = registry;
  const agents = {};
  const traits = {};
  const categories = {};
  const tierAgents = {
    [AGENT_TIERS.CORE]: [],
    [AGENT_TIERS.TRAIT]: [],
    [AGENT_TIERS.EXTENSION]: [],
  };

  const tierDirs = [
    { tier: AGENT_TIERS.CORE, dir: path.join(agentsDir, 'core') },
    { tier: AGENT_TIERS.TRAIT, dir: path.join(agentsDir, 'traits') },
    { tier: AGENT_TIERS.EXTENSION, dir: path.join(agentsDir, 'extensions') },
  ];

  // Also scan flat agents/ dir for backward compatibility
  const flatDir = agentsDir;
  if (fs.existsSync(flatDir)) {
    const files = fs.readdirSync(flatDir).filter(f => f.endsWith('.md'));
    for (const file of files) {
      const filePath = path.join(flatDir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) continue;

      const config = parseAgentFile(filePath, AGENT_TIERS.CORE);
      if (!config) continue;

      agents[config.name] = config;
      tierAgents[AGENT_TIERS.CORE].push(config.name);

      const cat = config.category || 'general';
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(config.name);
    }
  }

  for (const { tier, dir } of tierDirs) {
    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
    for (const file of files) {
      const filePath = path.join(dir, file);
      const config = parseAgentFile(filePath, tier);
      if (!config) continue;

      if (tier === AGENT_TIERS.TRAIT) {
        traits[config.name] = config;
      } else {
        agents[config.name] = config;
      }

      tierAgents[tier].push(config.name);

      const cat = config.category || 'general';
      if (!categories[cat]) categories[cat] = [];
      if (!categories[cat].includes(config.name)) {
        categories[cat].push(config.name);
      }
    }
  }

  return Object.freeze({ agents, traits, categories, tierAgents, agentsDir: registry.agentsDir });
}

function parseAgentFile(filePath, tier) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const frontmatter = parseFrontmatter(content);
    const name = frontmatter?.name || path.basename(filePath, '.md');

    const triggers = parseListField(content, 'triggers');
    const filePatterns = parseListField(content, 'file_patterns');

    return {
      name,
      description: frontmatter?.description || '',
      category: frontmatter?.category || frontmatter?.model || 'general',
      tier,
      priority: TIER_PRIORITY[tier] ?? 2,
      isCore: tier === AGENT_TIERS.CORE,
      filePath,
      triggers: triggers.length > 0 ? triggers : extractTriggersFromDescription(frontmatter?.description || ''),
      filePatterns,
      complexity: frontmatter?.complexity || 'medium',
    };
  } catch {
    return null;
  }
}

function extractTriggersFromDescription(description) {
  const words = description.toLowerCase().split(/[\s,]+/);
  const actionWords = ['review', 'build', 'test', 'plan', 'fix', 'debug', 'deploy',
    'refactor', 'security', 'optimize', 'monitor', 'document', 'architect'];
  return words.filter(w => actionWords.includes(w));
}

// --- Selection Algorithm (Source: Tony363 AgentSelector._calculateScore) ---

function calculateScore(context, config, categoryHint) {
  let score = 0.0;
  const breakdown = {};
  const matched = [];

  let contextStr = '';
  let contextFiles = [];
  if (typeof context === 'object' && context !== null && !Array.isArray(context)) {
    contextStr = `${context.task || ''} ${context.description || ''} ${(context.files || []).join(' ')}`;
    contextFiles = context.files || [];
  } else {
    contextStr = String(context || '');
  }
  const contextLower = contextStr.toLowerCase();

  // 1. Trigger matching (35%)
  const triggers = config.triggers || [];
  let triggerScore = 0.0;
  const matchedTriggers = [];

  if (triggers.length > 0) {
    for (const trigger of triggers) {
      const trigLow = trigger.toLowerCase();
      if (contextLower.includes(trigLow)) {
        triggerScore += 1.0;
        matchedTriggers.push(trigger);
      } else {
        const words = trigLow.split(/\s+/);
        if (words.some(w => w.length > 2 && contextLower.includes(w))) {
          triggerScore += 0.3;
        }
      }
    }
    triggerScore = Math.min(triggerScore / Math.max(triggers.length, 1), 1.0);
    if (matchedTriggers.length > 0) {
      matched.push(`triggers: ${matchedTriggers.slice(0, 3).join(', ')}`);
    }
  }
  breakdown.triggers = triggerScore * SELECTION_WEIGHTS.triggers;
  score += breakdown.triggers;

  // 2. Category matching (25%)
  const category = (config.category || '').toLowerCase();
  let categoryScore = 0.0;
  if (categoryHint && category === categoryHint.toLowerCase()) {
    categoryScore = 1.0;
    matched.push(`category: ${config.category}`);
  } else if (category && contextLower.includes(category)) {
    categoryScore = 0.7;
    matched.push(`category: ${config.category}`);
  }
  breakdown.category = categoryScore * SELECTION_WEIGHTS.category;
  score += breakdown.category;

  // 3. Task/name matching (20%)
  const nameParts = (config.name || '').replace(/-/g, ' ').split(/\s+/);
  let taskScore = 0.0;
  for (const part of nameParts) {
    if (part.length > 2 && contextLower.includes(part.toLowerCase())) {
      taskScore += 0.5;
    }
  }
  taskScore = Math.min(taskScore, 1.0);
  if (taskScore > 0) matched.push(`name match: ${config.name}`);
  breakdown.taskMatch = taskScore * SELECTION_WEIGHTS.taskMatch;
  score += breakdown.taskMatch;

  // 4. File pattern matching (10%)
  const filePatterns = config.filePatterns || [];
  let fileScore = 0.0;
  for (const pattern of filePatterns) {
    for (const file of contextFiles) {
      if (file.toLowerCase().includes(pattern.toLowerCase().replace(/\*/g, ''))) {
        fileScore = 1.0;
        matched.push(`file: ${pattern}`);
        break;
      }
    }
    if (fileScore > 0) break;
  }
  breakdown.filePatterns = fileScore * SELECTION_WEIGHTS.filePatterns;
  score += breakdown.filePatterns;

  // 5. Priority bonus (10%)
  const priority = config.priority ?? 2;
  const priorityBonus = ((4 - priority) / 3) * SELECTION_WEIGHTS.priority;
  breakdown.priority = priorityBonus;
  score += priorityBonus;

  return { score: Math.min(score, 1.0), breakdown, matched };
}

// --- Trait Processing ---

function processTraits(requestedTraits, registry) {
  const valid = [];
  const invalid = [];

  for (const trait of requestedTraits) {
    if (registry.traits[trait]) {
      valid.push(trait);
    } else {
      invalid.push(trait);
    }
  }

  const conflicts = [];
  const tensions = [];
  for (let i = 0; i < valid.length; i++) {
    for (let j = i + 1; j < valid.length; j++) {
      const t1 = valid[i];
      const t2 = valid[j];
      if (TRAIT_CONFLICTS[t1]?.has(t2)) {
        conflicts.push([t1, t2]);
      } else if (TRAIT_TENSIONS[t1]?.has(t2)) {
        tensions.push([t1, t2]);
      }
    }
  }

  return { valid, invalid, conflicts, tensions };
}

// --- Main Selection Function (Source: Tony363 AgentSelector.selectAgent) ---

function selectAgent(registry, context, options = {}) {
  const {
    traits: requestedTraits = [],
    categoryHint = null,
    excludeAgents = [],
    topN = 3,
  } = options;

  const scores = [];

  for (const agentName of Object.keys(registry.agents)) {
    if (excludeAgents.includes(agentName)) continue;

    const config = registry.agents[agentName];
    if (!config) continue;

    const { score, breakdown, matched } = calculateScore(context, config, categoryHint);

    if (score >= MIN_CONFIDENCE) {
      scores.push({ agentName, score, breakdown, matched, config });
    }
  }

  scores.sort((a, b) => b.score - a.score);

  // Fallback to default
  if (scores.length === 0 && !excludeAgents.includes(DEFAULT_AGENT)) {
    const defaultConfig = registry.agents[DEFAULT_AGENT] || {
      name: DEFAULT_AGENT,
      filePath: path.join(registry.agentsDir, `${DEFAULT_AGENT}.md`),
    };
    scores.push({
      agentName: DEFAULT_AGENT,
      score: 0.5,
      breakdown: { fallback: 0.5 },
      matched: ['default selection'],
      config: defaultConfig,
    });
  }

  if (scores.length === 0) {
    return {
      agentName: DEFAULT_AGENT,
      confidence: 0.0,
      breakdown: {},
      matchedCriteria: ['no matching agent'],
      alternatives: [],
      traitsApplied: [],
      agentPath: '',
      traitPaths: [],
      conflicts: [],
      tensions: [],
    };
  }

  const top = scores[0];
  const { valid, invalid, conflicts, tensions } = processTraits(requestedTraits, registry);

  const traitPaths = valid
    .map(t => registry.traits[t]?.filePath || '')
    .filter(Boolean);

  return {
    agentName: top.agentName,
    confidence: top.score,
    breakdown: top.breakdown,
    matchedCriteria: top.matched,
    alternatives: scores.slice(1, topN + 1).map(s => ({ name: s.agentName, confidence: s.score })),
    traitsApplied: valid,
    agentPath: top.config.filePath || '',
    traitPaths,
    conflicts,
    tensions,
    invalidTraits: invalid,
  };
}

function getAgentSuggestions(registry, context, topN = 5) {
  const result = selectAgent(registry, context, { topN });
  const suggestions = [{ name: result.agentName, confidence: result.confidence }];
  suggestions.push(...result.alternatives);
  return suggestions.slice(0, topN);
}

module.exports = {
  AGENT_TIERS,
  TIER_PRIORITY,
  SELECTION_WEIGHTS,
  MIN_CONFIDENCE,
  HIGH_CONFIDENCE,
  DEFAULT_AGENT,
  TRAIT_CONFLICTS,
  TRAIT_TENSIONS,
  parseFrontmatter,
  parseListField,
  createRegistry,
  discoverAgents,
  parseAgentFile,
  calculateScore,
  processTraits,
  selectAgent,
  getAgentSuggestions,
};
