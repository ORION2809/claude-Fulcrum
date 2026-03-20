const assert = require('assert');

const { sanitizeForMemory } = require('../../scripts/utils/privacy-gate');
const { stripTaggedContent } = require('../../scripts/utils/tag-stripping');

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

let passed = 0;
let failed = 0;

console.log('\nPrivacy Gate Tests\n');

if (test('strips private and recursion tags', () => {
  const result = stripTaggedContent('keep <private>secret</private> <claude-mem-context>ctx</claude-mem-context> this');
  assert.strictEqual(result.content.trim(), 'keep   this');
  assert.strictEqual(result.strippedTagCount, 2);
})) passed += 1; else failed += 1;

if (test('redacts common secret patterns before storage', () => {
  const result = sanitizeForMemory('token sk-proj-1234567890abcdef and Bearer abcdefghijklmnop');
  assert.ok(!result.content.includes('sk-proj-1234567890abcdef'));
  assert.ok(!result.content.includes('Bearer abcdefghijklmnop'));
  assert.ok(result.redactionReasons.includes('secret'));
})) passed += 1; else failed += 1;

if (test('skips storage when content becomes empty after stripping', () => {
  const result = sanitizeForMemory('<private>only secret</private>');
  assert.strictEqual(result.skipStorage, true);
  assert.strictEqual(result.isEmpty, true);
})) passed += 1; else failed += 1;

console.log(`\nResults: Passed: ${passed}, Failed: ${failed}`);
process.exit(failed > 0 ? 1 : 0);
