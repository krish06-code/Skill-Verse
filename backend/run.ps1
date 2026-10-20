# Skill-Verse Backend Runner for Windows PowerShell
# Safely loads backend/.env into the current PowerShell process and launches the Spring Boot application.

$envFile = Join-Path $PSScriptRoot ".env"

if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith("#") -and ($line -match '^([^=]+)=(.*)$')) {
            $key = $matches[1].Trim()
            $val = $matches[2].Trim()
            [System.Environment]::SetEnvironmentVariable($key, $val, [System.EnvironmentVariableTarget]::Process)
        }
    }
} else {
    if (-not $env:MONGODB_URI -or -not $env:JWT_SECRET) {
        Write-Warning "No backend/.env file found, and MONGODB_URI / JWT_SECRET environment variables are not set."
        Write-Warning "Copy backend/.env.example to backend/.env and fill in your values, or set the environment variables before running."
    }
}

$port = if ($env:PORT) { [int]$env:PORT } else { 8081 }
$existing = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Where-Object { $_.State -eq 'Listen' }
if ($existing) {
    $pidToKill = $existing[0].OwningProcess
    Write-Host "Port $port is currently in use by process $pidToKill. Stopping stale process to free the port..." -ForegroundColor Yellow
    Stop-Process -Id $pidToKill -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
}

if (Test-Path (Join-Path $PSScriptRoot "mvnw.cmd")) {
    & (Join-Path $PSScriptRoot "mvnw.cmd") spring-boot:run
} else {
    mvn spring-boot:run
}
