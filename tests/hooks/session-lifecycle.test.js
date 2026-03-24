const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { createStateStore } = require('../../scripts/lib/state-store');
const {
  buildCandidateMemoryLinks,
  estimateTokenUsage,
  persistLifecycleEvent,
  resolveEventName,
} = require('../../scripts/hooks/session-lifecycle');

function test(name, fn) {
  try {
    fn();
    console.log(`  \u2713 ${name}`);
    return true;
  } catch (error) {
    console.log(`  \u2717 ${name}`);
    console.log(`    Error: ${error.message}`);
    return false;
  }
}

async function asyncTest(name, fn) {
  try {
    await fn();
    console.log(`  \u2713 ${name}`);
    return true;
  } catch (error) {
    console.log(`  \u2717 ${name}`);
    console.log(`    Error: ${error.message}`);
    return false;
  }
}

let passed = 0;
let failed = 0;

async function main() {
  console.log('\nSession Lifecycle Tests\n');

  if (test('estimates tokens and resolves event names from payload', () => {
    assert.strictEqual(estimateTokenUsage('12345678'), 2);
    assert.strictEqual(resolveEventName({ hook_event_name: 'user_prompt_submit' }), 'user_prompt_submit');
  })) passed += 1; else failed += 1;

  if (await asyncTest('persists a sanitized user prompt into the control-plane store', async () => {
    const homeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ecc-lifecycle-'));
    const previousHome = process.env.HOME;
    const previousSession = process.env.CLAUDE_SESSION_ID;
    const previousAttempt = process.env.ECC_ATTEMPT_ID;

    process.env.HOME = homeDir;
    process.env.CLAUDE_SESSION_ID = 'session-lifecycle-test';
    process.env.ECC_ATTEMPT_ID = 'attempt-lifecycle-test';

    try {
      await persistLifecycleEvent(JSON.stringify({
        hook_event_name: 'user_prompt_submit',
        session_id: 'session-lifecycle-test',
        attempt_id: 'attempt-lifecycle-test',
        prompt: 'remember <private>secret</private> visible work',
      }));

      const store = await createStateStore({ homeDir });
      const detail = store.getSessionDetail('session-lifecycle-test');
      const memory = store.getMemoryStatus({ limit: 10 });
      store.close();

      assert.strictEqual(detail.attempts.length, 1);
      assert.strictEqual(memory.observationsCount, 1);
      assert.strictEqual(memory.queue.processed, 1);
      assert.ok(memory.recentObservations[0].summary.includes('visible work'));
      assert.ok(!memory.recentObservations[0].summary.includes('secret'));
    } finally {
      process.env.HOME = previousHome;
      process.env.CLAUDE_SESSION_ID = previousSession;
      process.env.ECC_ATTEMPT_ID = previousAttempt;
      fs.rmSync(homeDir, { recursive: true, force: true });
    }
  })) passed += 1; else failed += 1;

  if (test('builds memory links for notes with overlapping keywords and tags', () => {
    const links = buildCandidateMemoryLinks({
      note: {
        id: 'note-current',
        sessionId: 'session-1',
        category: 'observation',
        tags: ['memory', 'retrieval'],
        keywords: ['memory', 'budget', 'search'],
      },
      recentNotes: [
        {
          id: 'note-related',
          sessionId: 'session-1',
          category: 'observation',
          tags: ['memory', 'graph'],
          keywords: ['memory', 'search', 'timeline'],
        },
        {
          id: 'note-distant',
          sessionId: 'session-2',
          tags: ['quality'],
          keywords: ['score'],
        },
      ],
      maxLinks: 2,
    });

    assert.strictEqual(links.length, 1);
    assert.strictEqual(links[0].toNoteId, 'note-related');
    assert.strictEqual(links[0].linkType, 'evolved_from');
    assert.ok(links[0].weight >= 0.5);
    assert.ok(links[0].metadata.confidence);
    assert.ok(Array.isArray(links[0].metadata.sharedTerms));
    assert.ok(links[0].metadata.sameSession);
    assert.ok(links[0].metadata.sameCategory);
  })) passed += 1; else failed += 1;

  if (test('builds typed prevention links for fix-oriented memory notes', () => {
    const links = buildCandidateMemoryLinks({
      note: {
        id: 'note-fix',
        sessionId: 'session-1',
        tags: ['security', 'memory'],
        keywords: ['sanitize', 'guard', 'token', 'leak'],
      },
      recentNotes: [
        {
          id: 'note-issue',
          sessionId: 'session-1',
          tags: ['security', 'incident'],
          keywords: ['guard', 'token', 'bug'],
        },
      ],
      maxLinks: 2,
    });

    assert.strictEqual(links.length, 1);
    assert.strictEqual(links[0].linkType, 'prevents');
    assert.ok(links[0].metadata.reason.includes('Preventive markers'));
    assert.ok(links[0].metadata.confidence >= 0.8);
  })) passed += 1; else failed += 1;

  if (test('builds traversal-aware links using recent graph neighbors', () => {
    const links = buildCandidateMemoryLinks({
      note: {
        id: 'note-current',
        sessionId: 'session-1',
        category: 'observation',
        tags: ['memory', 'retrieval'],
        keywords: ['memory', 'search', 'timeline'],
      },
      recentNotes: [
        {
          id: 'note-direct',
          sessionId: 'session-1',
          category: 'observation',
          tags: ['memory'],
          keywords: ['memory', 'search', 'graph'],
        },
        {
          id: 'note-transitive',
          sessionId: 'session-1',
          category: 'reference',
          tags: ['timeline'],
          keywords: ['timeline', 'history', 'sequence'],
        },
      ],
      linksByNoteId: new Map([
        ['note-direct', [{
          fromNoteId: 'note-direct',
          toNoteId: 'note-transitive',
          linkType: 'depends_on',
        }]],
      ]),
      maxLinks: 3,
    });

    assert.ok(links.some(link => link.toNoteId === 'note-direct'));
    const transitive = links.find(link => link.toNoteId === 'note-transitive');
    assert.ok(transitive);
    assert.strictEqual(transitive.metadata.traversalDepth, 2);
    assert.strictEqual(transitive.metadata.via, 'note-direct');
  })) passed += 1; else failed += 1;

  console.log(`\nResults: Passed: ${passed}, Failed: ${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
