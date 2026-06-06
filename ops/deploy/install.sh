#!/usr/bin/env bash
# Bootstrap agenticcomplete on an Ubuntu box that may already host other sites.
#
# Idempotent — re-running is safe. Designed for a multi-site host where
# Caddy uses `import sites/*.caddy` and each app is a systemd service.
# The current production host is `ubuntu@44.255.253.62` (Ubuntu 26.04 ARM64).
#
# Usage (after the deploy key + write access is set up on GitHub):
#
#   ssh -i ~/.ssh/Tronkits.pem ubuntu@<host>
#   curl -fsSL https://raw.githubusercontent.com/georgefclay/agenticcomplete/master/ops/deploy/install.sh | bash
#
# Or, if you already cloned the repo:
#
#   bash ~/agenticcomplete/ops/deploy/install.sh

set -euo pipefail

REPO_URL="https://github.com/georgefclay/agenticcomplete.git"
REPO_DIR="/home/ubuntu/agenticcomplete"
SERVICE_NAME="agenticcomplete.service"
SITE_SNIPPET="agenticcomplete.caddy"
SUDOERS_FILE="agenticcomplete"
NODE_MAJOR="20"  # minimum acceptable major; install only if missing

log() { printf '\n=== %s ===\n' "$*"; }

log "apt base packages"
sudo apt-get update -y
sudo apt-get install -y curl ca-certificates gnupg debian-keyring debian-archive-keyring apt-transport-https git

log "Node.js (only if missing — preserves existing newer install)"
if ! command -v node >/dev/null 2>&1; then
    curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | sudo -E bash -
    sudo apt-get install -y nodejs
else
    NODE_CUR=$(node -v | cut -c2- | cut -d. -f1)
    if [ "$NODE_CUR" -lt "$NODE_MAJOR" ]; then
        echo "node $(node -v) is older than v${NODE_MAJOR} — upgrading"
        curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | sudo -E bash -
        sudo apt-get install -y nodejs
    else
        echo "node $(node -v) is acceptable, leaving as-is"
    fi
fi
node -v
npm -v

log "Caddy (only if missing)"
if ! command -v caddy >/dev/null 2>&1; then
    curl -fsSL https://dl.cloudsmith.io/public/caddy/stable/gpg.key \
        | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
    curl -fsSL https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt \
        | sudo tee /etc/apt/sources.list.d/caddy-stable.list
    sudo apt-get update -y
    sudo apt-get install -y caddy
fi
caddy version

log "clone or refresh repo"
if [ ! -d "$REPO_DIR/.git" ]; then
    git clone "$REPO_URL" "$REPO_DIR"
fi
cd "$REPO_DIR"
git fetch origin master
git reset --hard origin/master

log "npm install"
npm ci --omit=dev

log ".env"
if [ ! -f "$REPO_DIR/.env" ]; then
    cat >"$REPO_DIR/.env" <<'ENV'
PORT=3000
SITE_URL=https://agenticcomplete.com
WEB3FORMS_ACCESS_KEY=REPLACE_ME
ENV
    chmod 600 "$REPO_DIR/.env"
    echo "WARNING: created stub .env — paste real values, then 'sudo systemctl restart agenticcomplete'"
fi

log "log file"
sudo touch /var/log/agenticcomplete.log
sudo chown ubuntu:ubuntu /var/log/agenticcomplete.log

log "systemd unit"
sudo install -o root -g root -m 0644 \
    "$REPO_DIR/ops/deploy/$SERVICE_NAME" \
    "/etc/systemd/system/$SERVICE_NAME"
sudo systemctl daemon-reload

log "Caddy site snippet (preserves main Caddyfile and other sites)"
sudo mkdir -p /etc/caddy/sites
sudo install -o root -g root -m 0644 \
    "$REPO_DIR/ops/deploy/$SITE_SNIPPET" \
    "/etc/caddy/sites/$SITE_SNIPPET"

log "sudoers fragment (lets ubuntu restart this service only)"
sudo visudo -cf "$REPO_DIR/ops/deploy/agenticcomplete-sudoers"
sudo install -o root -g root -m 0440 \
    "$REPO_DIR/ops/deploy/agenticcomplete-sudoers" \
    "/etc/sudoers.d/$SUDOERS_FILE"

log "validate + reload caddy"
sudo caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile >/dev/null
sudo systemctl reload caddy

log "enable + start service"
sudo systemctl enable "$SERVICE_NAME"
sudo systemctl restart "$SERVICE_NAME"
sleep 2
systemctl is-active "$SERVICE_NAME"

log "pull cron (every 15 minutes)"
chmod +x "$REPO_DIR/ops/deploy/pull.sh"
CRON_LINE="*/15 * * * * $REPO_DIR/ops/deploy/pull.sh"
( crontab -l 2>/dev/null || true ; echo "$CRON_LINE" ) \
    | awk '!seen[$0]++' \
    | crontab -
crontab -l

log "done — https://agenticcomplete.com should respond within ~60s (Caddy TLS handshake on first hit)"
