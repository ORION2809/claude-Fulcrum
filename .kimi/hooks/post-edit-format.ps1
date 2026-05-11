$payload = [Console]::In.ReadToEnd()
if ([string]::IsNullOrWhiteSpace($payload)) {
  exit 0
}

$inputObject = $payload | ConvertFrom-Json
$filePath = $inputObject.tool_input.path
if (-not $filePath) {
  $filePath = $inputObject.tool_input.file_path
}

if (-not $filePath -or $filePath -notmatch '\.(js|jsx|ts|tsx|json|md|css|scss|html|yml|yaml)$') {
  exit 0
}

npx prettier --write $filePath
exit $LASTEXITCODE
