'use strict';

const { searchMemory } = require('./search-orchestrator');

const MAX_STDIN = 1024 * 1024;

function parseRequest(raw) {
  try {
    return JSON.parse(raw || '{}');
  } catch (error) {
    throw new Error(`Invalid retrieval request JSON: ${error.message}`);
  }
}

async function run(rawInput) {
  const request = parseRequest(rawInput);
  return searchMemory(request.query || '', {
    ...request,
    parentTokenBudget: request.budget && request.budget.parentTokenBudget,
  });
}

if (require.main === module) {
  let raw = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', chunk => {
    if (raw.length < MAX_STDIN) {
      raw += chunk.slice(0, MAX_STDIN - raw.length);
    }
  });
  process.stdin.on('end', () => {
    run(raw)
      .then(result => {
        process.stdout.write(`${JSON.stringify(result)}\n`);
      })
      .catch(error => {
        process.stderr.write(`[retrieval-worker] ${error.message}\n`);
        process.exit(1);
      });
  });
}

module.exports = {
  parseRequest,
  run,
};
