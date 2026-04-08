---
name: memory-compression
description: Compress and sanitize observations before they enter the canonical memory store.
---

# Memory Compression

Use this skill when storing prompts, tool outputs, and checkpoints.

- Strip private and recursion tags first.
- Redact secrets before storage.
- Store compressed summaries and transcript anchors, not full bodies by default.
