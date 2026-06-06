#!/usr/bin/env bash
# Pulls master from GitHub. If anything changed, conditionally runs npm ci and
# restarts the systemd service. Idempotent — safe to run every 15 min via cron.
#
# Log: /home/ubuntu/agenticcomplete/ops/deploy/pull.log

set -euo pipefail

REPO_DIR="/home/ubuntu/agenticcomplete"
BRANCH="master"
LOG="$REPO_DIR/ops/deploy/pull.log"
SERVICE="agenticcomplete.service"

mkdir -p "$(dirname "$LOG")"
exec >>"$LOG" 2>&1
echo "----- $(date -u +%FT%TZ) -----"

cd "$REPO_DIR"

BEFORE=$(git rev-parse HEAD)
git fetch --quiet origin "$BRANCH"
AFTER=$(git rev-parse "origin/$BRANCH")

if [ "$BEFORE" = "$AFTER" ]; then
    echo "no change ($BEFORE)"
    exit 0
fi

echo "updating $BEFORE -> $AFTER"

LOCK_CHANGED=0
if ! git diff --quiet "$BEFORE" "$AFTER" -- package-lock.json package.json; then
    LOCK_CHANGED=1
fi

git reset --hard "origin/$BRANCH"

if [ "$LOCK_CHANGED" = "1" ]; then
    echo "package files changed — running npm ci"
    npm ci --omit=dev
fi

sudo /usr/bin/systemctl restart "$SERVICE"
echo "deploy ok"
