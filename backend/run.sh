#!/usr/bin/env bash
set -e

# Change to the backend directory where this script lives
cd "$(dirname "$0")"

# Resolve Maven from PATH or Homebrew. This keeps the project runnable on macOS
# when Homebrew is installed but its bin directory has not yet been added to PATH.
if command -v mvn &> /dev/null; then
  MAVEN_CMD="$(command -v mvn)"
elif command -v brew &> /dev/null && [ -x "$(brew --prefix maven 2>/dev/null)/bin/mvn" ]; then
  MAVEN_CMD="$(brew --prefix maven)/bin/mvn"
else
  echo "❌ Maven is not installed."
  echo "👉 Please run: brew install maven"
  exit 1
fi

# Load .env if present
if [ -f .env ]; then
  echo "📄 Loading backend/.env..."
  set -a
  # Export simple KEY=VALUE lines. This avoids interpreting URI characters such
  # as '&' or '?' as shell syntax.
  while IFS= read -r line || [ -n "$line" ]; do
    case "$line" in
      ''|'#'*) continue ;;
    esac
    key="${line%%=*}"
    value="${line#*=}"
    case "$key" in
      MONGODB_URI|MONGODB_DATABASE|JWT_SECRET|CORS_ORIGINS|APP_BASE_URL|MAIL_HOST|MAIL_PORT|MAIL_USERNAME|MAIL_PASSWORD|MAIL_FROM|PORT)
        export "$key=$value"
        ;;
    esac
  done < .env
  set +a
else
  echo "⚠️  No backend/.env found! Copying .env.example to .env..."
  cp .env.example .env
fi

# Check for placeholder MongoDB URI
if [ -z "$MONGODB_URI" ] || [[ "$MONGODB_URI" == *"example.mongodb.net"* ]]; then
  echo "⚠️  WARNING: MONGODB_URI in backend/.env still contains placeholder credentials:"
  echo "   $MONGODB_URI"
  echo "👉 Please edit backend/.env with your real MongoDB Atlas or local MongoDB connection string."
  echo ""
fi

# Check if port 8081 is already in use
PORT="${PORT:-8081}"
PID_ON_PORT=$(lsof -ti :"$PORT" 2>/dev/null || true)
if [ -n "$PID_ON_PORT" ]; then
  echo "⚠️  Port $PORT is already in use by process $PID_ON_PORT. Terminating it..."
  kill -9 "$PID_ON_PORT" 2>/dev/null || true
  sleep 1
fi

echo "🚀 Starting Spring Boot backend on port $PORT..."
"$MAVEN_CMD" spring-boot:run

