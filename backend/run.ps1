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

if (Test-Path (Join-Path $PSScriptRoot "mvnw.cmd")) {
    & (Join-Path $PSScriptRoot "mvnw.cmd") spring-boot:run
} else {
    mvn spring-boot:run
}
