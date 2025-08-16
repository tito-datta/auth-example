#!/usr/bin/env bash

# start.sh - start backend (HTTPS) and frontend (HTTPS proxies for custom hostnames)
# Usage: ./start.sh
# Requirements:
#  - dotnet SDK
#  - npm (or pnpm/yarn) for frontend
#  - mkcert (recommended) OR you can provide your own certs
#  - socat (recommended) for flexible proxying
#  - local-ssl-proxy (used via npx) as a fallback for the frontend proxy only

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
FRONTEND_DIR="$ROOT_DIR/frontend"
BACKEND_PROJECT="$ROOT_DIR/backend/backend.csproj"
CERT_DIR="$FRONTEND_DIR/certificates"
CERT="$CERT_DIR/weather.pem"
KEY="$CERT_DIR/weather-key.pem"

FRONTEND_PORT=3000    # Next.js dev server (http)
BACKEND_HTTPS_PORT=7295 # dotnet https port (from launchSettings)

# Hosts and public HTTPS ports (Option A: separate HTTPS ports)
APP_HOST="weather-app.tito.com"
API_HOST="weather-api.tito.com"
APP_HTTPS_PORT=3001
API_HTTPS_PORT=3002

PIDS=()

cleanup() {
  echo "\nShutting down..."
  for pid in "${PIDS[@]:-}"; do
    if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
      echo "Killing PID $pid"
      kill "$pid" 2>/dev/null || true
    fi
  done
  wait || true
}
trap cleanup EXIT INT TERM

# Start backend with HTTPS launch profile
start_backend() {
  echo "Starting backend (https profile)..."
  dotnet run --project "$BACKEND_PROJECT" --launch-profile "https" &
  PIDS+=("$!")
}

# Start frontend (Next.js dev)
start_frontend() {
  echo "Starting frontend (next dev) on port $FRONTEND_PORT..."
  (cd "$FRONTEND_DIR" && npm run dev -- --port $FRONTEND_PORT) &
  PIDS+=("$!")
}

# Ensure certificate exists (use mkcert if available)
ensure_cert() {
  if [ -f "$CERT" ] && [ -f "$KEY" ]; then
    echo "Found existing cert/key at $CERT_DIR"
    return 0
  fi

  if command -v mkcert >/dev/null 2>&1; then
    echo "mkcert found — creating cert for: $APP_HOST $API_HOST localhost 127.0.0.1 ::1"
    mkdir -p "$CERT_DIR"
    mkcert -cert-file "$CERT" -key-file "$KEY" "$APP_HOST" "$API_HOST" localhost 127.0.0.1 ::1
    echo "Created certs at $CERT / $KEY"
    return 0
  fi

  echo "No certificate found and mkcert not available."
  echo "Install mkcert (brew install mkcert) and run mkcert -install, or create certs manually at: $CERT and $KEY"
  exit 1
}

# Ensure hosts file entries for custom hostnames
ensure_hosts() {
  missing=()
  grep -qE "(^|\s)$APP_HOST(\s|$)" /etc/hosts || missing+=("$APP_HOST")
  grep -qE "(^|\s)$API_HOST(\s|$)" /etc/hosts || missing+=("$API_HOST")

  if [ ${#missing[@]} -eq 0 ]; then
    echo "/etc/hosts already contains entries for $APP_HOST and $API_HOST"
    return 0
  fi

  echo "/etc/hosts is missing entries for: ${missing[*]}"
  echo "Attempting to add entries using sudo..." 

  tmpfile=$(mktemp)
  for h in "${missing[@]}"; do
    echo "127.0.0.1 $h" >> "$tmpfile"
  done

  if sudo sh -c "cat '$tmpfile' >> /etc/hosts"; then
    echo "Added entries to /etc/hosts"
    rm -f "$tmpfile"
    return 0
  else
    echo "Failed to add /etc/hosts entries. Please add the following lines to /etc/hosts manually:"
    for h in "${missing[@]}"; do
      echo "127.0.0.1 $h"
    done
    rm -f "$tmpfile"
    exit 1
  fi
}

# Start HTTPS proxies
# - For app: terminate TLS at proxy and forward plaintext to Next dev
# - For api: do TCP passthrough to backend https port (proxy must not terminate TLS)
start_proxies() {
  ensure_cert
  ensure_hosts

  if command -v socat >/dev/null 2>&1; then
    echo "Starting proxies with socat"
    # App: TLS termination -> Next dev (plaintext)
    echo "Proxying https://$APP_HOST:$APP_HTTPS_PORT -> http://localhost:$FRONTEND_PORT"
    socat OPENSSL-LISTEN:$APP_HTTPS_PORT,reuseaddr,cert="$CERT",key="$KEY",verify=0,fork TCP:localhost:$FRONTEND_PORT &
    PIDS+=("$!")

    # API: TLS passthrough -> backend https port
    echo "Proxying https://$API_HOST:$API_HTTPS_PORT -> https://localhost:$BACKEND_HTTPS_PORT (passthrough)"
    socat TCP-LISTEN:$API_HTTPS_PORT,reuseaddr,fork TCP:localhost:$BACKEND_HTTPS_PORT &
    PIDS+=("$!")

  else
    echo "socat not found. Will try to use npx local-ssl-proxy for frontend proxy only."
    echo "Note: local-ssl-proxy cannot do TLS passthrough to an already-HTTPS backend. Install socat (brew install socat) to proxy the backend hostname.$(printf '\n')"

    echo "Starting frontend proxy with npx local-ssl-proxy: https://$APP_HOST:$APP_HTTPS_PORT -> http://localhost:$FRONTEND_PORT"
    npx --yes local-ssl-proxy --source $APP_HTTPS_PORT --target $FRONTEND_PORT --cert "$CERT" --key "$KEY" &
    PIDS+=("$!")

    echo "Cannot create TLS passthrough for backend without socat. Install socat and re-run this script to enable https://$API_HOST:$API_HTTPS_PORT"
  fi
}

# Verify tools
if ! command -v dotnet >/dev/null 2>&1; then
  echo "dotnet SDK not found in PATH. Install from https://dotnet.microsoft.com/"
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm not found in PATH. Install Node.js/npm."
  exit 1
fi

# Start services
start_backend
start_frontend
start_proxies

echo "All services started."
echo "- Backend (dotnet): https://localhost:$BACKEND_HTTPS_PORT"
echo "- Frontend (HTTPS): https://$APP_HOST:$APP_HTTPS_PORT -> Next dev on port $FRONTEND_PORT"
if command -v socat >/dev/null 2>&1; then
  echo "- Backend (HTTPS hostname): https://$API_HOST:$API_HTTPS_PORT -> backend https $BACKEND_HTTPS_PORT"
else
  echo "- Backend hostname proxy not running (socat missing). Install socat to enable https://$API_HOST:$API_HTTPS_PORT"
fi

echo "Press Ctrl+C to stop. Logs are printed to this terminal."

# Wait for background processes
wait
