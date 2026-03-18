# Claude Fulcrum

Enterprise AI agent orchestration platform. Deploy 60+ specialized agents in coordinated swarms with self-learning, fault-tolerant consensus, vector memory, and MCP integration.

**Claude Fulcrum** is the new name for [claude-flow](https://www.npmjs.com/package/claude-flow). Both packages are fully supported.

## Install

```bash
# Quick start
npx Claude Fulcrum@latest init --wizard

# Global install
npm install -g Claude Fulcrum

# Add as MCP server
claude mcp add Claude Fulcrum -- npx -y Claude Fulcrum@latest mcp start
```

## Usage

```bash
Claude Fulcrum init --wizard          # Initialize project
Claude Fulcrum agent spawn -t coder   # Spawn an agent
Claude Fulcrum swarm init             # Start a swarm
Claude Fulcrum memory search -q "..."  # Search vector memory
Claude Fulcrum doctor                 # System diagnostics
```

## Relationship to claude-flow

| Package | npm | CLI Command |
|---------|-----|-------------|
| `Claude Fulcrum` | [npmjs.com/package/Claude Fulcrum](https://www.npmjs.com/package/Claude Fulcrum) | `Claude Fulcrum` |
| `claude-flow` | [npmjs.com/package/claude-flow](https://www.npmjs.com/package/claude-flow) | `claude-flow` |

Both packages use `@claude-flow/cli` under the hood. Choose whichever you prefer.

## Documentation

Full documentation: [github.com/ORION2809/claude-Fulcrum](https://github.com/ORION2809/claude-Fulcrum)

## License

MIT
