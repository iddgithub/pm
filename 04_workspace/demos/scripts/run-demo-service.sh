#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/demo-common.sh"

service="${1:-}"

if [ -z "$service" ]; then
  echo "usage: $0 <h5|pc>" >&2
  exit 1
fi

ensure_runtime_dirs

project_dir="$(service_dir "$service")"
port="$(service_port "$service")"

if [ ! -f "$project_dir/package.json" ]; then
  echo "missing package.json: $project_dir/package.json"
  exit 1
fi

cd "$project_dir"

if bun_bin="$(find_bun)"; then
  export PATH="$(dirname "$bun_bin"):$PATH"
  export BUN_INSTALL="${HOME}/.bun"
fi

echo "Starting $(service_name "$service") on port $port..."
nohup /Users/hugaopeng/.bun/bin/bun run dev -- --host 127.0.0.1 --port "$port" < /dev/null > /dev/null 2>&1 &
echo "PID: $!"
