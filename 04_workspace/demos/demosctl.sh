#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/scripts/demo-common.sh"

usage() {
  cat <<'EOF'
用法:
  bash 04_workspace/demos/demosctl.sh install [h5|pc|all]
  bash 04_workspace/demos/demosctl.sh status [h5|pc|all]
  bash 04_workspace/demos/demosctl.sh restart [h5|pc|all]
  bash 04_workspace/demos/demosctl.sh uninstall [h5|pc|all]
  bash 04_workspace/demos/demosctl.sh open [h5|pc|all]
EOF
}

resolve_services() {
  local target="${1:-all}"
  case "$target" in
    all) printf '%s\n' h5 pc ;;
    h5|pc) printf '%s\n' "$target" ;;
    *)
      echo "unknown target: $target" >&2
      exit 1
      ;;
  esac
}

write_plist() {
  local service="$1"
  local plist_path
  local monitor_path

  plist_path="$(service_plist_path "$service")"
  monitor_path="$(service_monitor_path "$service")"

  cat >"$plist_path" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>Label</key>
    <string>$(service_label "$service")</string>
    <key>ProgramArguments</key>
    <array>
      <string>/bin/bash</string>
      <string>$monitor_path</string>
      <string>$service</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>StartInterval</key>
    <integer>15</integer>
    <key>EnvironmentVariables</key>
    <dict>
      <key>PATH</key>
      <string>/Users/hugaopeng/.bun/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin</string>
    </dict>
    <key>StandardOutPath</key>
    <string>$(service_stdout_log_path "$service")</string>
    <key>StandardErrorPath</key>
    <string>$(service_stderr_log_path "$service")</string>
  </dict>
</plist>
EOF
}

write_launcher_script() {
  local service="$1"
  local launcher_path

  launcher_path="$(service_launcher_path "$service")"

  cat >"$launcher_path" <<EOF
#!/bin/bash
exec /bin/bash "$SCRIPT_DIR/scripts/run-demo-service.sh" "$service"
EOF
  chmod 755 "$launcher_path"
}

write_monitor_script() {
  local service="$1"
  local monitor_path
  local launcher_path
  local port

  monitor_path="$(service_monitor_path "$service")"
  launcher_path="$(service_launcher_path "$service")"
  port="$(service_port "$service")"

  cat >"$monitor_path" <<EOF
#!/bin/bash
set -euo pipefail

PORT="$port"
COOLDOWN_FILE="$(service_cooldown_file "$service")"
LAUNCHER="$launcher_path"
PROCESS_PATTERN="$(service_process_pattern "$service")"

mkdir -p "$STATE_DIR"

if lsof -tiTCP:"\$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  exit 0
fi

if ps -Ao pid=,args= | awk -v pattern="\$PROCESS_PATTERN" 'index(\$0, pattern) && \$0 !~ /ps -Ao pid=,args=/ && \$0 !~ /awk -v pattern=/ {found=1} END {exit found ? 0 : 1}'; then
  exit 0
fi

now=\$(date +%s)
last_launch=0

if [ -f "\$COOLDOWN_FILE" ]; then
  last_launch=\$(cat "\$COOLDOWN_FILE" 2>/dev/null || echo 0)
fi

if [ "\$((now - last_launch))" -lt 20 ]; then
  exit 0
fi

echo "\$now" >"\$COOLDOWN_FILE"
open -gja Terminal "\$LAUNCHER"
EOF
  chmod 755 "$monitor_path"
}

ensure_app_support_files() {
  local service

  mkdir -p "$APP_SUPPORT_DIR"

  while IFS= read -r service; do
    write_launcher_script "$service"
    write_monitor_script "$service"
  done < <(resolve_services all)
}

bootout_service() {
  local service="$1"
  launchctl bootout "$(launchctl_target "$service")" >/dev/null 2>&1 || \
    launchctl bootout "gui/$UID" "$(service_plist_path "$service")" >/dev/null 2>&1 || true
}

bootstrap_service() {
  local service="$1"
  bootout_service "$service"
  write_plist "$service"
  launchctl bootstrap "gui/$UID" "$(service_plist_path "$service")"
  launchctl kickstart -k "$(launchctl_target "$service")"
}

install_services() {
  local target="${1:-all}"
  local service

  ensure_runtime_dirs
  ensure_app_support_files
  mkdir -p "$HOME/Library/LaunchAgents"

  while IFS= read -r service; do
    echo "installing $(service_name "$service")..."
    bootstrap_service "$service"
  done < <(resolve_services "$target")
}

restart_services() {
  local target="${1:-all}"
  local service

  while IFS= read -r service; do
    echo "restarting $(service_name "$service")..."
    if [ ! -f "$(service_plist_path "$service")" ]; then
      echo "  not installed: $(service_plist_path "$service")"
      continue
    fi

    service_stop_processes "$service"
    rm -f "$(service_cooldown_file "$service")"

    if ! service_agent_loaded "$service"; then
      launchctl bootstrap "gui/$UID" "$(service_plist_path "$service")"
    fi

    launchctl kickstart -k "$(launchctl_target "$service")"
  done < <(resolve_services "$target")
}

uninstall_services() {
  local target="${1:-all}"
  local service

  while IFS= read -r service; do
    echo "uninstalling $(service_name "$service")..."
    bootout_service "$service"
    service_stop_processes "$service"
    rm -f "$(service_plist_path "$service")"
    rm -f "$(service_launcher_path "$service")"
    rm -f "$(service_monitor_path "$service")"
    rm -f "$(service_cooldown_file "$service")"
  done < <(resolve_services "$target")
}

open_services() {
  local target="${1:-all}"
  local service

  while IFS= read -r service; do
    echo "opening $(service_url "$service")"
    open "$(service_url "$service")"
  done < <(resolve_services "$target")
}

status_service() {
  local service="$1"
  local plist_path
  local service_pids
  local listener_pids

  plist_path="$(service_plist_path "$service")"
  service_pids="$(service_process_pids "$service")"
  listener_pids="$(service_listener_pids "$service")"

  print_service_header "$service"
  echo "label: $(service_label "$service")"
  echo "plist: $plist_path"
  echo "log: $(service_log_path "$service")"

  if [ ! -f "$plist_path" ]; then
    echo "status: 未安装"
    echo
    return 0
  fi

  if ! service_agent_loaded "$service"; then
    echo "status: agent 未加载"
    echo
    return 0
  fi

  if [ -n "$listener_pids" ] && [ -z "$service_pids" ]; then
    echo "status: 端口被其他程序占用"
    echo "listener pids:"
    echo "$listener_pids"
    echo
    return 0
  fi

  if [ -n "$service_pids" ] && [ -z "$listener_pids" ]; then
    echo "status: 进程存在但端口未监听"
    echo "service pids:"
    echo "$service_pids"
    echo
    return 0
  fi

  if [ -z "$service_pids" ] && [ -z "$listener_pids" ]; then
    echo "status: agent 已加载但当前未运行"
    echo
    return 0
  fi

  echo "service pids:"
  echo "${service_pids:-unknown}"
  echo "listener pids:"
  echo "$listener_pids"

  if service_healthcheck "$service"; then
    echo "status: 健康可访问"
  else
    echo "status: 端口已监听但健康检查失败"
  fi
  echo
}

status_services() {
  local target="${1:-all}"
  local service

  while IFS= read -r service; do
    status_service "$service"
  done < <(resolve_services "$target")
}

command_name="${1:-}"
target="${2:-all}"

case "$command_name" in
  install) install_services "$target" ;;
  status) status_services "$target" ;;
  restart) restart_services "$target" ;;
  uninstall) uninstall_services "$target" ;;
  open) open_services "$target" ;;
  ""|-h|--help|help)
    usage
    ;;
  *)
    echo "unknown command: $command_name" >&2
    usage
    exit 1
    ;;
esac
