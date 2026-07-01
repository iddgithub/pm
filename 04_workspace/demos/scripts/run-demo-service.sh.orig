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

log_file="$(service_log_path "$service")"
exec >>"$log_file" 2>&1

echo "===== $(date '+%Y-%m-%d %H:%M:%S') starting $(service_name "$service") ====="

if ! bun_bin="$(find_bun)"; then
  echo "bun not found. expected /Users/hugaopeng/.bun/bin/bun or ~/.bun/bin/bun"
  exit 1
fi

project_dir="$(service_dir "$service")"
port="$(service_port "$service")"

if [ ! -f "$project_dir/package.json" ]; then
  echo "missing package.json: $project_dir/package.json"
  exit 1
fi

if [ ! -d "$project_dir/node_modules" ]; then
  echo "missing node_modules in $project_dir. run bun install first."
  exit 1
fi

if [ ! -d "$project_dir/node_modules/vite" ]; then
  echo "missing vite dependency in $project_dir/node_modules"
  exit 1
fi

if service_port_in_use "$service"; then
  echo "port $port is already in use:"
  service_listener_summary "$service"
  exit 1
fi

cd "$project_dir"

export PATH="$(dirname "$bun_bin"):/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
export BUN_INSTALL="${HOME}/.bun"

exec "$bun_bin" run dev -- --host 127.0.0.1 --port "$port"
