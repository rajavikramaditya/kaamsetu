#!/usr/bin/env bash
set -euo pipefail

echo "Checking KaamSetu architecture folders..."

required_dirs=(
  app
  components
  features
  lib
  server
  supabase/migrations
  tests
  docs/context
  types
)

for dir in "${required_dirs[@]}"; do
  if [[ ! -d "$dir" ]]; then
    echo "Missing required directory: $dir"
    exit 1
  fi
done

if rg -n "SUPABASE_SERVICE_ROLE_KEY" --glob '!server/**' --glob '!*.example' --glob '!docs/**' .; then
  echo "Service role key reference found outside server/"
  exit 1
fi

echo "Architecture check passed."
