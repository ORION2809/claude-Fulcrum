#!/usr/bin/env sh
set -eu

payload="$(cat)"

node -e '
const input = JSON.parse(process.argv[1] || "{}");
const tool = input.tool_name || "";
const toolInput = input.tool_input || {};
const text = JSON.stringify(toolInput);
const command = String(toolInput.command || "");
const dangerousShell = /\brm\s+-rf\s+(?:\/|~|\$HOME|%USERPROFILE%)\b|Remove-Item\s+.*(?:-Recurse).*?(?:C:\\|\/|~)/i;
const protectedFile = /(^|[\\\/])\.env(?:$|[\\\/.])|(^|[\\\/])\.kimi[\\\/](?:credentials|sessions|logs)(?:$|[\\\/])/i;

if (tool === "Shell" && dangerousShell.test(command)) {
  console.error("Blocked potentially destructive shell command. Use a narrower, reviewed command.");
  process.exit(2);
}

if ((tool === "WriteFile" || tool === "StrReplaceFile") && protectedFile.test(text)) {
  console.error("Blocked write to protected environment or Kimi runtime file.");
  process.exit(2);
}
' "$payload"
