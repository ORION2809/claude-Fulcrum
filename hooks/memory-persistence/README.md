# Memory Persistence Hooks

This directory reserves the lifecycle hook namespace for memory persistence.

Primary implementations live in:

- `scripts/hooks/session-start.js`
- `scripts/hooks/session-lifecycle.js`
- `scripts/hooks/session-end.js`

The harness audit checks for this directory to confirm the persistence layer is
present as an explicit hook concern.
