#!/usr/bin/env node
'use strict';

/**
 * Phase 6.2 - Persona Routing
 * Source: SuperClaude Framework
 *
 * Routes tasks to persona stacks based on keywords, issue category,
 * expertise level, and risk level. Outputs a ranked persona stack
 * and recommended command flow.
 */

// --- Persona Definitions ---

const PERSONAS = Object.freeze({
  architect: {
    name: 'architect',
    domain: 'system-design',
    riskTolerance: 'low',
    complexity: 'high',
    keywords: ['architecture', 'design', 'scalability', 'system', 'schema', 'migration', 'pattern'],
    categories: ['design', 'infrastructure', 'database'],
  },
  security: {
    name: 'security',
    domain: 'security',
    riskTolerance: 'minimal',
    complexity: 'high',
    keywords: ['security', 'auth', 'vulnerability', 'injection', 'xss', 'csrf', 'secret', 'encrypt'],
    categories: ['security', 'compliance', 'audit'],
  },
  implementer: {
    name: 'implementer',
    domain: 'coding',
    riskTolerance: 'medium',
    complexity: 'medium',
    keywords: ['implement', 'build', 'feature', 'code', 'function', 'class', 'module'],
    categories: ['feature', 'implementation', 'coding'],
  },
  debugger: {
    name: 'debugger',
    domain: 'debugging',
    riskTolerance: 'medium',
    complexity: 'medium',
    keywords: ['bug', 'fix', 'error', 'crash', 'debug', 'issue', 'broken', 'fail'],
    categories: ['bug', 'hotfix', 'incident'],
  },
  reviewer: {
    name: 'reviewer',
    domain: 'quality',
    riskTolerance: 'low',
    complexity: 'medium',
    keywords: ['review', 'quality', 'lint', 'refactor', 'cleanup', 'dead-code', 'style'],
    categories: ['review', 'quality', 'maintenance'],
  },
  tester: {
    name: 'tester',
    domain: 'testing',
    riskTolerance: 'low',
    complexity: 'medium',
    keywords: ['test', 'coverage', 'tdd', 'e2e', 'integration', 'unit', 'spec'],
    categories: ['testing', 'qa', 'coverage'],
  },
  planner: {
    name: 'planner',
    domain: 'planning',
    riskTolerance: 'low',
    complexity: 'low',
    keywords: ['plan', 'roadmap', 'epic', 'breakdown', 'estimate', 'scope', 'phase'],
    categories: ['planning', 'project', 'management'],
  },
  documenter: {
    name: 'documenter',
    domain: 'documentation',
    riskTolerance: 'low',
    complexity: 'low',
    keywords: ['doc', 'readme', 'guide', 'tutorial', 'api-doc', 'comment'],
    categories: ['documentation', 'docs', 'knowledge'],
  },
});

const RISK_LEVELS = Object.freeze({
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
});

const EXPERTISE_LEVELS = Object.freeze({
  expert: 3,
  intermediate: 2,
  beginner: 1,
});

// --- Command Flow Templates ---

const COMMAND_FLOWS = Object.freeze({
  'feature-implementation': ['plan', 'tdd', 'code-review', 'verify'],
  'bug-fix': ['tdd', 'build-fix', 'code-review', 'verify'],
  'security-audit': ['code-review', 'verify'],
  'refactor': ['plan', 'refactor-clean', 'code-review', 'verify'],
  'documentation': ['docs', 'update-docs'],
  'testing': ['tdd', 'test-coverage', 'e2e'],
  'architecture': ['plan', 'code-review'],
  'quick-fix': ['build-fix', 'verify'],
});

// --- Scoring ---

function scorePersona(persona, context) {
  let score = 0.0;
  const signals = [];

  const task = (context.task || '').toLowerCase();
  const description = (context.description || '').toLowerCase();
  const combined = `${task} ${description}`;

  // Keyword matching (40%)
  let keywordHits = 0;
  for (const kw of persona.keywords) {
    if (combined.includes(kw)) {
      keywordHits++;
      signals.push(`keyword:${kw}`);
    }
  }
  const keywordScore = Math.min(keywordHits / Math.max(persona.keywords.length * 0.3, 1), 1.0);
  score += keywordScore * 0.4;

  // Category matching (30%)
  const category = (context.category || '').toLowerCase();
  if (category && persona.categories.includes(category)) {
    score += 0.3;
    signals.push(`category:${category}`);
  } else if (category) {
    for (const cat of persona.categories) {
      if (combined.includes(cat)) {
        score += 0.15;
        signals.push(`category-partial:${cat}`);
        break;
      }
    }
  }

  // Risk alignment (20%)
  const riskLevel = context.riskLevel || 'medium';
  const riskValue = RISK_LEVELS[riskLevel] || 2;
  const toleranceMap = { minimal: 4, low: 3, medium: 2, high: 1 };
  const tolerance = toleranceMap[persona.riskTolerance] || 2;
  if (riskValue >= tolerance) {
    score += 0.2;
    signals.push(`risk-aligned:${riskLevel}`);
  } else {
    score += 0.1;
  }

  // Complexity matching (10%)
  const expertise = context.expertiseLevel || 'intermediate';
  const expertiseValue = EXPERTISE_LEVELS[expertise] || 2;
  const complexityMap = { high: 3, medium: 2, low: 1 };
  const complexityValue = complexityMap[persona.complexity] || 2;
  if (expertiseValue >= complexityValue) {
    score += 0.1;
    signals.push(`expertise-matched:${expertise}`);
  } else {
    score += 0.05;
  }

  return { persona: persona.name, score: Math.min(score, 1.0), signals };
}

// --- Router ---

function routePersona(context) {
  const scores = Object.values(PERSONAS).map(p => scorePersona(p, context));
  scores.sort((a, b) => b.score - a.score);

  const top = scores[0];
  const stack = scores
    .filter(s => s.score > 0.15)
    .slice(0, 3)
    .map(s => ({ name: s.persona, score: s.score }));

  const commandFlow = selectCommandFlow(top.persona, context);

  return {
    primary: top.persona,
    confidence: top.score,
    signals: top.signals,
    stack,
    commandFlow,
    riskLevel: context.riskLevel || 'medium',
    expertiseLevel: context.expertiseLevel || 'intermediate',
  };
}

function selectCommandFlow(persona, context) {
  const category = (context.category || '').toLowerCase();

  if (category === 'bug' || category === 'hotfix') return COMMAND_FLOWS['bug-fix'];
  if (category === 'security') return COMMAND_FLOWS['security-audit'];
  if (category === 'docs' || category === 'documentation') return COMMAND_FLOWS['documentation'];
  if (category === 'testing' || category === 'qa') return COMMAND_FLOWS['testing'];

  const flowMap = {
    architect: 'architecture',
    implementer: 'feature-implementation',
    debugger: 'bug-fix',
    reviewer: 'refactor',
    tester: 'testing',
    planner: 'architecture',
    documenter: 'documentation',
    security: 'security-audit',
  };

  return COMMAND_FLOWS[flowMap[persona] || 'feature-implementation'];
}

function getAvailablePersonas() {
  return Object.keys(PERSONAS);
}

module.exports = {
  PERSONAS,
  RISK_LEVELS,
  EXPERTISE_LEVELS,
  COMMAND_FLOWS,
  scorePersona,
  routePersona,
  selectCommandFlow,
  getAvailablePersonas,
};
