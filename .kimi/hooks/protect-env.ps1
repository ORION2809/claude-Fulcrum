$payload = [Console]::In.ReadToEnd()
if ([string]::IsNullOrWhiteSpace($payload)) {
  exit 0
}

$inputObject = $payload | ConvertFrom-Json
$tool = [string]$inputObject.tool_name
$toolInputText = ($inputObject.tool_input | ConvertTo-Json -Compress -Depth 20)
$command = [string]$inputObject.tool_input.command

$dangerousShell = [regex]'\brm\s+-rf\s+(?:/|~|\$HOME|%USERPROFILE%)\b|Remove-Item\s+.*(?:-Recurse).*?(?:C:\\|/|~)'
$protectedFile = [regex]'(^|[\\/])\.env(?:$|[\\/.])|(^|[\\/])\.kimi[\\/](?:credentials|sessions|logs)(?:$|[\\/])'

if ($tool -eq 'Shell' -and $dangerousShell.IsMatch($command)) {
  [Console]::Error.WriteLine('Blocked potentially destructive shell command. Use a narrower, reviewed command.')
  exit 2
}

if (($tool -eq 'WriteFile' -or $tool -eq 'StrReplaceFile') -and $protectedFile.IsMatch($toolInputText)) {
  [Console]::Error.WriteLine('Blocked write to protected environment or Kimi runtime file.')
  exit 2
}
