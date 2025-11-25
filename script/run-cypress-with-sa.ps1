<#
.SYNOPSIS
  Helper to run Cypress headless with Firebase service account credentials supplied.

.DESCRIPTION
  This script sets one of the environment variables expected by the project's
  Cypress cleanup task: `FIREBASE_SERVICE_ACCOUNT_PATH` (path to service account JSON)
  or `FIREBASE_SERVICE_ACCOUNT` (the JSON content as a string). After setting the
  environment variable it runs `npm run cypress-run`.

.PARAMETER ServiceAccountPath
  Path to the Firebase service account JSON file.

.PARAMETER ServiceAccountJson
  The content of the Firebase service account as a JSON string. Use this if you
  prefer to supply the credential inline (e.g. from CI secret injection).

.PARAMETER StartServer
  Optional switch. If set, runs `npm start` in the background before running Cypress.

.EXAMPLE
  .\run-cypress-with-sa.ps1 -ServiceAccountPath 'C:\keys\sa.json' -StartServer

.EXAMPLE
  $json = Get-Content -Raw 'C:\keys\sa.json'
  .\run-cypress-with-sa.ps1 -ServiceAccountJson $json
#>

[CmdletBinding()]
param(
    [string]$ServiceAccountPath,
    [string]$ServiceAccountJson,
    [switch]$StartServer
)

function Write-Info($msg) { Write-Host "[run-cypress-with-sa] $msg" -ForegroundColor Cyan }
function Write-Warn($msg) { Write-Host "[run-cypress-with-sa] $msg" -ForegroundColor Yellow }

if ($ServiceAccountPath -and $ServiceAccountJson) {
    Write-Warn "Both ServiceAccountPath and ServiceAccountJson provided; ServiceAccountPath will take precedence."
}

if ($ServiceAccountPath) {
    $full = Resolve-Path -Path $ServiceAccountPath -ErrorAction SilentlyContinue
    if (-not $full) {
        Write-Error "Service account path not found: $ServiceAccountPath"
        exit 2
    }
    $env:FIREBASE_SERVICE_ACCOUNT_PATH = $full.Path
    Write-Info "Set FIREBASE_SERVICE_ACCOUNT_PATH=$($full.Path)"
} elseif ($ServiceAccountJson) {
    # Ensure it's a single-line string (Cypress task expects JSON string)
    $oneLine = $ServiceAccountJson -replace "\r?\n", ' '
    $env:FIREBASE_SERVICE_ACCOUNT = $oneLine
    Write-Info "Set FIREBASE_SERVICE_ACCOUNT (content length: $($oneLine.Length))"
} else {
    Write-Warn "No service account provided. The cleanup task will be tolerant and not fail, but no deletion will occur."
}

if ($StartServer) {
    Write-Info "Starting Parcel dev server in background (npm start)..."
    Start-Process -NoNewWindow -FilePath npm -ArgumentList 'start' | Out-Null
    # Give the server a small time to boot; in CI adapt as needed
    Start-Sleep -Seconds 2
}

Write-Info "Running Cypress headless (npm run cypress-run)..."
# Run Cypress and forward exit code
$process = Start-Process -FilePath npm -ArgumentList 'run','cypress-run' -NoNewWindow -Wait -PassThru
exit $process.ExitCode
