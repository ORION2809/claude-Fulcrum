#!/usr/bin/env sh
set -eu

payload="$(cat)"

node -e '
const { spawnSync } = require("child_process");
const input = JSON.parse(process.argv[1] || "{}");
const toolInput = input.tool_input || {};
const filePath = toolInput.path || toolInput.file_path;
if (!filePath || !/\.(js|jsx|ts|tsx|json|md|css|scss|html|yml|yaml)$/.test(filePath)) {
  process.exit(0);
}
const result = spawnSync("npx", ["prettier", "--write", filePath], { stdio: "inherit", shell: process.platform === "win32" });
process.exit(result.status === null ? 0 : result.status);
' "$payload"
