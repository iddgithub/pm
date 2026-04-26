#!/bin/bash

set -euo pipefail

COMMON_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEMO_ROOT="$(cd "$COMMON_DIR/.." && pwd)"
RUNTIME_DIR="$DEMO_ROOT/.runtime"
LOG_DIR="$RUNTIME_DIR/logs"
STATE_DIR="$RUNTIME_DIR/state"
APP_SUPPORT_DIR="$HOME/Library/Application Support/pm-agent-demos"

ensure_runtime_dirs() {
  mkdir -p "$LOG_DIR" "$STATE_DIR"
}

service_label() {
  case "$1" in
    h5) echo "com.pm-agent.demo-h5" ;;
    pc) echo "com.pm-agent.demo-pc" ;;
    *)
      echo "unknown service: $1" >&2
      return 1
      ;;
  esac
}

service_name() {
  case "$1" in
    h5) echo "H5" ;;
    pc) echo "PC" ;;
    *)
      echo "unknown service: $1" >&2
      return 1
      ;;
  esac
}

service_port() {
  case "$1" in
    h5) echo "3001" ;;
    pc) echo "3002" ;;
    *)
      echo "unknown service: $1" >&2
      return 1
      ;;
  esac
}

service_url() {
  echo "http://127.0.0.1:$(service_port "$1")/"
}

service_dir() {
  case "$1" in
    h5) echo "$DEMO_ROOT/h5" ;;
    pc) echo "$DEMO_ROOT/pc" ;;
    *)
      echo "unknown service: $1" >&2
      return 1
      ;;
  esac
}

service_log_path() {
  echo "$LOG_DIR/$1.log"
}

service_stdout_log_path() {
  echo "$LOG_DIR/$1.stdout.log"
}

service_stderr_log_path() {
  echo "$LOG_DIR/$1.stderr.log"
}

service_plist_path() {
  echo "$HOME/Library/LaunchAgents/$(service_label "$1").plist"
}

find_bun() {
  if [ -x "/Users/hugaopeng/.bun/bin/bun" ]; then
    echo "/Users/hugaopeng/.bun/bin/bun"
    return 0
  fi

  if [ -x "$HOME/.bun/bin/bun" ]; then
    echo "$HOME/.bun/bin/bun"
    return 0
  fi

  if command -v bun >/dev/null 2>&1; then
    command -v bun
    return 0
  fi

  return 1
}

service_listener_pids() {
  lsof -tiTCP:"$(service_port "$1")" -sTCP:LISTEN 2>/dev/null || true
}

service_listener_summary() {
  lsof -nP -iTCP:"$(service_port "$1")" -sTCP:LISTEN 2>/dev/null || true
}

service_agent_pid() {
  launchctl print "$(launchctl_target "$1")" 2>/dev/null | awk -F'= ' '/\bpid = / {gsub(/;$/, "", $2); print $2; exit}' || true
}

service_agent_loaded() {
  launchctl print "$(launchctl_target "$1")" >/dev/null 2>&1
}

service_healthcheck() {
  curl -fsS -o /dev/null --max-time 3 "$(service_url "$1")"
}

service_pid_matches_listener() {
  local service="$1"
  local agent_pid
  local listener_pids

  agent_pid="$(service_agent_pid "$service")"
  listener_pids="$(service_listener_pids "$service")"

  if [ -z "$agent_pid" ] || [ -z "$listener_pids" ]; then
    return 1
  fi

  while IFS= read -r pid; do
    if [ "$pid" = "$agent_pid" ]; then
      return 0
    fi
  done <<<"$listener_pids"

  return 1
}

service_port_in_use() {
  [ -n "$(service_listener_pids "$1")" ]
}

service_process_pattern() {
  echo "bun run dev -- --host 127.0.0.1 --port $(service_port "$1")"
}

service_process_pids() {
  ps -Ao pid=,args= | awk -v pattern="$(service_process_pattern "$1")" 'index($0, pattern) && $0 !~ /ps -Ao pid=,args=/ && $0 !~ /awk -v pattern=/ {print $1}' || true
}

service_stop_processes() {
  local service="$1"
  local pid

  while IFS= read -r pid; do
    [ -n "$pid" ] || continue
    kill "$pid" >/dev/null 2>&1 || true
  done <<<"$(service_process_pids "$service")"
}

service_cooldown_file() {
  echo "$STATE_DIR/$1.last_launch"
}

service_launcher_path() {
  echo "$APP_SUPPORT_DIR/start-$1.command"
}

service_monitor_path() {
  echo "$APP_SUPPORT_DIR/monitor-$1.sh"
}

launchctl_target() {
  echo "gui/$UID/$(service_label "$1")"
}

print_service_header() {
  local service="$1"
  echo "[$(service_name "$service")] $(service_url "$service")"
}
