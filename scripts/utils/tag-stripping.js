'use strict';

const DEFAULT_TAGS = ['private', 'claude-mem-context', 'memory-context', 'memory-recursion'];

function stripTaggedContent(content, options = {}) {
  const text = String(content || '');
  const tags = Array.isArray(options.tags) && options.tags.length > 0 ? options.tags : DEFAULT_TAGS;
  const maxTagCount = Number.isFinite(options.maxTagCount) ? options.maxTagCount : 100;

  let next = text;
  let strippedTagCount = 0;
  const removedTags = [];

  for (const tag of tags) {
    const regex = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, 'gi');
    next = next.replace(regex, () => {
      if (strippedTagCount >= maxTagCount) {
        return '';
      }
      strippedTagCount += 1;
      removedTags.push(tag);
      return '';
    });
  }

  return {
    content: next,
    strippedTagCount,
    removedTags,
    maxTagCountReached: strippedTagCount >= maxTagCount,
  };
}

module.exports = {
  DEFAULT_TAGS,
  stripTaggedContent,
};
