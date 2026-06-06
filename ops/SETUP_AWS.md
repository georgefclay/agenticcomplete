# SETUP_AWS.md — Ubuntu + Caddy deploy

Successor to the Pi-era `SETUP.md`. The Pi died on 2026-06-05; the site now runs
on an AWS EC2 Ubuntu instance that **also hosts other sites** (tronkits.com,
ourinterview.com, json2app.com). The deploy machinery in this repo is written to
add agenticcomplete to that multi-site box without disturbing anything else.

Pipeline shape is unchanged from the Pi era: GitHub master is the source of
truth, the server pulls every 15 minutes, the systemd service restarts on
change. What's different:

- Host OS is Ubuntu instead of macOS.
- Reverse proxy is Caddy (auto-TLS) instead of "direct on 80/443".
- Process supervision is **systemd**, matching the convention the other sites on
  this box use. (The original Pi setup used PM2 — that's gone.)
- Caddy uses `import sites/*.caddy`; agenticcomplete adds one snippet there,
  never edits the main `/etc/caddy/Caddyfile`.
- Pulls are anonymous HTTPS (the repo is public). No deploy SSH key needed on
  the server.

---

## 1. Server facts

- **Host:** `ubuntu@44.255.253.62`
- **SSH alias:** `tronkits-prod` (see `~/.ssh/config` on the workstation)
- **SSH key:** `C:\Users\George\.ssh\Tronkits.pem`
- **Distro:** Ubuntu 26.04 LTS, ARM64 (t4g family)
- **Repo path:** `/home/ubuntu/agenticcomplete`
- **DNS:** `agenticcomplete.com` and `www.agenticcomplete.com` A-records point
  at `44.255.253.62` (repointed 2026-06-05).
- **Co-hosted sites:** `tronkits.com` (port 8080, systemd), `ourinterview.com`
  (port 8083, systemd, Postgres-backed), `json2app.com` (static via Caddy
  `file_server`). agenticcomplete uses port **3000**.

### Required AWS Security Group inbound rules

| Port | Proto | Source        | Purpose                                  |
|------|-------|---------------|------------------------------------------|
| 22   | TCP   | your IP /32   | SSH                                      |
| 80   | TCP   | 0.0.0.0/0     | HTTP → Caddy (ACME challenge + redirect) |
| 443  | TCP   | 0.0.0.0/0     | HTTPS → Caddy                            |

Port 3000 must **not** be exposed publicly — only Caddy on localhost talks to it.

> Note on AWS NAT loopback: connections from the instance to its own public IP
> on 443 may time out even when the site works publicly. Validate from
> elsewhere (your workstation, an external uptime monitor) — don't be fooled
> by curling the public hostname from inside the box.

---

## 2. Bootstrap (one-shot)

Everything below is encoded in `ops/deploy/install.sh`. To add agenticcomplete
to the AWS box from your workstation:

```powershell
ssh -i C:\Users\George\.ssh\Tronkits.pem ubuntu@44.255.253.62
```

Then on the server:

```bash
curl -fsSL https://raw.githubusercontent.com/georgefclay/agenticcomplete/master/ops/deploy/install.sh | bash
```

The script is idempotent (re-running is safe). It:

1. Installs base apt packages and Node.js (only if missing or too old —
   existing newer Node is preserved; the other sites on this box use Node 24).
2. Installs Caddy (only if missing — already present on the production box).
3. Clones `agenticcomplete` to `/home/ubuntu/agenticcomplete` and resets to
   `origin/master`.
4. Runs `npm ci --omit=dev`.
5. Creates a stub `.env` if absent — **paste real values afterward** (see §5).
6. Installs `ops/deploy/agenticcomplete.service` to
   `/etc/systemd/system/agenticcomplete.service` (`systemctl daemon-reload`).
7. Installs `ops/deploy/agenticcomplete.caddy` to
   `/etc/caddy/sites/agenticcomplete.caddy` — **does not touch the main
   Caddyfile or any other site's snippet.**
8. Installs `ops/deploy/agenticcomplete-sudoers` to
   `/etc/sudoers.d/agenticcomplete` after `visudo -c` validation — lets the
   `ubuntu` user run `systemctl restart agenticcomplete` without a password
   (needed by the pull cron).
9. `caddy validate` + `systemctl reload caddy`.
10. Enables and starts `agenticcomplete.service`.
11. Adds `*/15 * * * * /home/ubuntu/agenticcomplete/ops/deploy/pull.sh` to the
    `ubuntu` user's crontab (deduplicated; existing crontab lines preserved).

After the script finishes, Caddy fetches a Let's Encrypt cert on first HTTPS
hit (takes ~10–30 s). Verify from your workstation (not from the box itself):

```powershell
curl.exe -sI https://agenticcomplete.com | Select-Object -First 3
```

---

## 3. The 15-minute pull cron

Codified in `ops/deploy/pull.sh`.

**Cron line** (installed by `install.sh` into the `ubuntu` user's crontab):

```
*/15 * * * * /home/ubuntu/agenticcomplete/ops/deploy/pull.sh
```

**What the script does:**

- `git fetch origin master`
- If `HEAD` matches `origin/master`, exit (no-op).
- Otherwise:
  - If `package.json` or `package-lock.json` moved, run `npm ci --omit=dev`.
  - `git reset --hard origin/master`
  - `sudo /usr/bin/systemctl restart agenticcomplete.service` (granted by the
    sudoers fragment).
- Appends to `/home/ubuntu/agenticcomplete/ops/deploy/pull.log`.

To watch deploys live:

```powershell
ssh -i C:\Users\George\.ssh\Tronkits.pem ubuntu@44.255.253.62 `
  tail -f /home/ubuntu/agenticcomplete/ops/deploy/pull.log
```

To force an immediate deploy without waiting for the next quarter-hour:

```powershell
ssh -i C:\Users\George\.ssh\Tronkits.pem ubuntu@44.255.253.62 `
  /home/ubuntu/agenticcomplete/ops/deploy/pull.sh
```

---

## 4. Process supervision (systemd)

The service file is `ops/deploy/agenticcomplete.service` → installed at
`/etc/systemd/system/agenticcomplete.service`. It mirrors the `tronkits.service`
and `ourinterview.service` pattern already in use on this box:

- `Type=simple`, `User=ubuntu`, `WorkingDirectory=/home/ubuntu/agenticcomplete`
- `ExecStart=/usr/local/bin/node app.js`
- `Restart=always`, `RestartSec=3`
- `Environment=NODE_ENV=production` (the app reads `.env` via dotenv at startup)
- Logs append to `/var/log/agenticcomplete.log`

Useful commands:

```bash
systemctl status agenticcomplete            # state + recent logs
sudo systemctl restart agenticcomplete      # hard restart (~1–2s downtime)
sudo systemctl reload agenticcomplete       # only if app supports SIGHUP (it doesn't — use restart)
sudo journalctl -u agenticcomplete -f       # follow systemd-side logs
tail -f /var/log/agenticcomplete.log        # follow stdout/stderr
```

The pull cron only ever issues `restart` (via the sudoers grant), not `reload`.

---

## 5. Environment & secrets

The site reads three vars from `.env` (see `app.js`):

```
PORT=3000
SITE_URL=https://agenticcomplete.com
WEB3FORMS_ACCESS_KEY=<real value>
```

`PORT=3000` must stay 3000 because `agenticcomplete.caddy` proxies to
`localhost:3000`. Permissions on `.env` should be `0600` (the install script
sets that on first creation).

**The web server itself needs nothing else.** The Mailchimp and Gmail tokens
(`ops/.mailchimp-token`, `ops/.gmail-app-password`) are only used by
autonomous agents that run *separately* from the web process. If/when an
agent runs on this box, copy those token files out-of-band:

```powershell
scp -i C:\Users\George\.ssh\Tronkits.pem `
  C:\path\to\.mailchimp-token `
  ubuntu@44.255.253.62:/home/ubuntu/agenticcomplete/ops/.mailchimp-token
```

Any token ever found committed is an immediate `IMMEDIATE` alert per
`ALERTS.md` — rotate at once.

---

## 6. Caddy

This box uses a multi-site Caddy layout:

- `/etc/caddy/Caddyfile` — minimal, contains only the global `email` and
  `import sites/*.caddy`. **Never edit this file from a per-site deploy.**
- `/etc/caddy/sites/<site>.caddy` — one snippet per site. agenticcomplete
  installs `agenticcomplete.caddy` here.

The agenticcomplete snippet does three things:

- Serves both `agenticcomplete.com` (200) and `www.agenticcomplete.com`
  (301 → apex) on 443.
- Reverse-proxies to `localhost:3000`.
- Sends HSTS, X-Content-Type-Options, and Referrer-Policy headers.
- Auto-renews Let's Encrypt certs (Caddy handles renewal; no cron needed).

Reload after edits:

```bash
sudo install -o root -g root -m 0644 \
  /home/ubuntu/agenticcomplete/ops/deploy/agenticcomplete.caddy \
  /etc/caddy/sites/agenticcomplete.caddy
sudo caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
sudo systemctl reload caddy
```

Caddy service logs: `sudo journalctl -u caddy -f`. (No per-site access log is
configured by default — match what tronkits/ourinterview do here for
consistency.)

---

## 7. Health checks

**On the server:**

```bash
systemctl is-active agenticcomplete           # app up?
systemctl is-active caddy                     # caddy up?
curl -sI http://localhost:3000 | head -1      # app responds on 3000?
sudo ss -ltnp | grep -E ':(80|443|3000) '     # ports as expected?
crontab -l | grep pull.sh                     # cron in place?
tail -3 /home/ubuntu/agenticcomplete/ops/deploy/pull.log
```

**From your workstation (NOT from inside the box — see §1 NAT loopback note):**

```powershell
curl.exe -sI https://agenticcomplete.com | Select-Object -First 3
curl.exe -sI https://www.agenticcomplete.com | Select-Object -First 3
```

Expected: `HTTP/1.1 200 OK`, `Server: Caddy` (or 301 for www).

---

## 8. Recovery: rebuilding the box from scratch

If this AWS instance dies:

1. Launch a new Ubuntu 24.04+ instance (any arch — script works on amd64 and
   arm64). t4g.small or larger.
2. Open ports 22 / 80 / 443 in the Security Group.
3. Update the DNS A-records to the new public IP.
4. SSH in and run the bootstrap curl line from §2.
5. Paste real values into `/home/ubuntu/agenticcomplete/.env` and
   `sudo systemctl restart agenticcomplete`.
6. Copy any per-agent token files (`ops/.*-token`) out-of-band.
7. Validate from your workstation that https://agenticcomplete.com returns 200.

That's the entire DR procedure for agenticcomplete alone. **If this box also
hosts other sites,** their bootstrap scripts live in their own repos — run
each from its own playbook. Don't try to "restore the box" from this repo.

The repo + GitHub is the system of record; the server is replaceable.

---

## 9. Files in this repo's deploy folder

| File | Installed at | Owner / Perms | Purpose |
|------|--------------|---------------|---------|
| `ops/deploy/install.sh` | (not installed; piped from raw GitHub) | — | One-shot bootstrap |
| `ops/deploy/pull.sh` | `/home/ubuntu/agenticcomplete/ops/deploy/pull.sh` | `ubuntu` / `0755` | The pull-and-restart loop |
| `ops/deploy/agenticcomplete.service` | `/etc/systemd/system/agenticcomplete.service` | `root` / `0644` | systemd unit |
| `ops/deploy/agenticcomplete.caddy` | `/etc/caddy/sites/agenticcomplete.caddy` | `root` / `0644` | per-site Caddy snippet |
| `ops/deploy/agenticcomplete-sudoers` | `/etc/sudoers.d/agenticcomplete` | `root` / `0440` (visudo-validated) | lets `ubuntu` restart this one service |

---

## 10. What changed vs. the old Pi setup

| Concern              | Pi (old)                           | AWS Ubuntu (now)                          |
|----------------------|------------------------------------|-------------------------------------------|
| OS                   | Raspberry Pi OS / macOS            | Ubuntu 26.04 LTS                          |
| Reverse proxy        | none (direct on 80/443) / unclear  | Caddy with auto-TLS, multi-site `import`  |
| Process supervisor   | PM2 (or launchd)                   | systemd, matching co-hosted sites         |
| Tenancy              | dedicated host                     | shared with tronkits/ourinterview/json2app|
| Pull cadence         | every 15 min                       | every 15 min — unchanged                  |
| Pull restart command | `pm2 reload`                       | `sudo systemctl restart` via sudoers grant|
| Git auth for pull    | SSH deploy key                     | anonymous HTTPS (repo is public)          |
| Secrets at rest      | macOS Keychain                     | `.env` (`0600`)                           |

SSH deploy keys are still useful for **pushing** *from* a workstation —
the agenticcomplete write-enabled deploy key lives on the Windows workstation
at `~/.ssh/id_ed25519_github_agenticcomplete`, configured in `~/.ssh/config`
as the `github-agenticcomplete` host alias. The pull side never needs one.

---

## 11. Action items right after bootstrapping a new server

- [ ] Paste real `WEB3FORMS_ACCESS_KEY` into `/home/ubuntu/agenticcomplete/.env`.
- [ ] `sudo systemctl restart agenticcomplete`.
- [ ] Confirm `https://agenticcomplete.com` returns 200 with a valid cert
      (from your workstation, not from inside the box).
- [ ] Confirm `pull.log` gets a `no change` entry on the next quarter-hour.
- [ ] If other sites need agent-side tokens (Mailchimp, Gmail), copy them in
      `ops/.*-token` form, `0600` perms.
