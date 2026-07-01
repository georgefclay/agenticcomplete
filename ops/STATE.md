# STATE.md — Operating environment of the Agentic Complete system

**Last updated:** 2026-07-01 (host migration: the Raspberry Pi died 2026-06-05; site moved to a shared AWS EC2 Ubuntu instance behind Caddy with systemd supervision — see `ops/SETUP_AWS.md`. Platform table and deploy-pipeline rows updated accordingly. Prior update 2026-06-02: Plausible dropped, replaced by server-log-derived daily traffic emails via Web3Forms.)
**Maintained by:** the autonomous system, with George's edits as needed

This file captures the live operational state of agenticcomplete.com and the
infrastructure the autonomous system uses to publish, observe, and adapt. It is
the first file a fresh Cowork session should read after the policy files
(VOICE, EDITORIAL, RULES, ALERTS, BUDGET, METRICS, BACKLOG, CORRECTIONS,
PUBLISHERS_NOTES). It tells the system what is connected, what is deferred,
and where credentials live.

The system **must update this file** whenever a platform is added, removed,
upgraded, or fails. Stale state here causes silent failures elsewhere.

---

## 1. Platform connection state

| Platform | Status | Notes |
|---|---|---|
| Domain (`agenticcomplete.com`) | Live | Ranked #1 on Google for "agentic complete" as of 2026-04-24. 5 unique visitors / 31 pageviews in first 30 days (all direct). |
| Web hosting | Live (migrated 2026-06-05) | Node.js + Express + EJS site. **The Raspberry Pi host died 2026-06-05; the site now runs on a shared AWS EC2 Ubuntu 26.04 (ARM64/t4g) instance at `44.255.253.62`**, co-hosting `tronkits.com`, `ourinterview.com`, `json2app.com`. App runs on port 3000 under **systemd** (`agenticcomplete.service`); **Caddy** is the reverse proxy (auto-TLS). PM2 is gone. DNS (apex + www) repointed to `44.255.253.62` on 2026-06-05. Full runbook: `ops/SETUP_AWS.md`. Blog, notes, corrections, how-this-site-works, RSS feed all live. |
| Deploy pipeline | Live | GitHub `master` is source of truth. A 15-minute cron on the AWS box (`ops/deploy/pull.sh`) runs `git fetch` → `git reset --hard origin/master` → `sudo systemctl restart agenticcomplete.service`. Pulls are **anonymous HTTPS** (public repo — no deploy key on the server). Sandbox/agents push via the GitHub Contents API + PAT (`ops/.github-token`). The old stale `.git/*.lock` failure mode was a Mac Mini local-clone artifact and no longer applies to the deploy path; the May 2026 lock-file alerts are obsolete. Caddy snippet is symlinked from the `clayindices` repo (centralized multi-site config). |
| GitHub repo | Live | Canonical source. Public. The system commits and pushes from the local clone on the Mini. |
| Google Workspace (`editor@agenticcomplete.com`) | Active | Business Starter plan, $7/mo. The system's email identity. **Note (added 2026-06-05):** the same Workspace account also receives mail at `george@agenticcomplete.com`, used by George for a SEPARATE experiment unrelated to AgenticComplete.com. The `ac-email-check` task explicitly filters out anything addressed to `george@` (To/Cc/Bcc) — those messages are invisible to the autonomous system. Only mail to `editor@` is in scope. |
| Mailchimp | Active | Free tier. Audience ID: `476c3f8e02`. API key in `ops/.mailchimp-token`. Replaced Beehiiv (no API on free tier). |
| Plausible Analytics | **Dropped (2026-06-02)** | Decision made 2026-06-02: do not upgrade, replace with server-log-derived daily traffic emails (see next row). The pending alerts (`ops/alerts/email-2026-05-24.md`, `email-2026-05-26.md`) are resolved with that decision. Tracking script removed from `views/partials/head.ejs` on the same date. George to cancel any residual Plausible account / billing himself. |
| Daily traffic email | Active analytics source | George derives daily traffic from server logs and emails the report to `editor@agenticcomplete.com` via Web3Forms. Sender is `notify@web3forms.com`. Subject pattern: `Daily traffic — agenticcomplete.com — YYYY-MM-DD` (em-dashes, sometimes with `(partial — today)` appended). Body has SUMMARY (total/human requests, IPs, bytes) and DETAIL (status codes, top referrers, top paths) blocks. The weekly and monthly report tasks read these from Gmail via the Gmail MCP and aggregate them — see `ac-weekly-report` and `ac-monthly-report` SKILL.md prompts. |
| Google Search Console | Active | Domain property verified via DNS TXT. Sitemap (`/sitemap.xml`) submitted. `editor@` added as Full user; `georgefclay@gmail.com` retains Owner. |
| LinkedIn Company Page | Active, publishing | https://www.linkedin.com/company/agentic-complete (vanity slug) / `/company/117204222/` (numeric ID) — created 2026-05-08. First post 2026-05-19; **4 posts published in May 2026** on the LINKEDIN.md 2/week cadence. Posting via Chrome + Claude extension on George's personal `georgefclay` account (a Page admin) — see Credentials map §3. Follower count and per-post impressions not yet captured (requires a live browser session). |
| X / Twitter | Skipped | Decision deferred to the 6-month retrospective. Do not engage. |
| Reddit | Not used | No automated posting. Manual links only if relevant, posted by George. |

**Running platform cost:** ~$7/month attributable (Workspace $7 + Mailchimp $0 free tier + daily traffic emails $0). Outside the AI-token budget cap defined in `BUDGET.md`. Hosting now runs on a shared AWS EC2 box (co-hosted with George's other sites); incremental cost to this project is effectively negligible, but the box is a shared resource George pays for — confirm apportionment if it matters for accounting. Plausible is gone; not coming back unless the cost/benefit changes.

---

## 2. Publishing pipeline

The full path from system-generated content to live page:

1. System edits files in the local clone of the repo on the Mini.
2. System runs `git add`, `git commit`, `git push` to the GitHub `master` branch.
3. The web host's pull script (running every 15 minutes) detects the change.
4. The host runs `git pull`, then PM2 restarts the Node process.
5. The change is live within ~15 minutes of `git push`.

The same pipeline applies to blog posts, framework edits, corrections, and
Publisher's Notes (which George commits manually, also via the same flow).

**There is no FTP step.** A `.github/workflows/deploy.yml` file exists in the
repo as a dormant backup, but FTP secrets are intentionally not configured.
The pull-based deploy is the only live path.

**Do not enable branch protection on `master`.** The autonomous design
publishes by `git push` straight to master. Any "require pull request review"
or "require status checks" rule on GitHub will silently break every publish
attempt. If a future need for review gates emerges, revisit the no-handoffs
property of the experiment first — that property is part of the thesis, not
an oversight.

**Blog post publish flow specifically:**

1. Draft the post (Sonnet for applied, Opus for anchor — see `EDITORIAL.md`).
2. Run the self-check rubric in `VOICE.md`.
3. Save as a markdown or EJS file in the appropriate `views/blog/` path (path TBD when the blog scaffolding is added — see `BACKLOG.md` P0 work).
4. Commit with a message of the form: `Publish: <slug> (<post type>)`.
5. Push to `master`.
6. After deploy lands (verify by hitting the URL), trigger Beehiiv post (newsletter copy of the blog post).
7. After ~24 hours, confirm the post appears in Search Console's URL Inspection tool. If not, request indexing.
8. After ~48 hours, check the next morning's daily traffic email for first organic visits to the new post.

LinkedIn is on its own editorial calendar (LinkedIn-native short takes, 2/week) and is **not** part of the blog publish flow above. See `LINKEDIN.md` for editorial. Posting is done through Chrome + the Claude extension (same pattern as the email check). The deferred API fallback `tools/post_linkedin.py` exists but is not part of the live flow — see Deferred items below.

---

## 3. Credentials map

Credentials are **never committed to this repo**. This section tells the
system where to find them, not what they are.

| Account | Login | Where the password / token lives |
|---|---|---|
| Google Workspace (`editor@`) | `editor@agenticcomplete.com` | macOS Keychain on the Mini, item name TBD during Mini setup |
| GitHub (push from Mini) | SSH key | `~/.ssh/id_ed25519` on the Mini, generated during Mini setup; public key added to George's GitHub account |
| Beehiiv | `editor@agenticcomplete.com` | macOS Keychain |
| Plausible | n/a — dropped 2026-06-02 | No longer used. Replaced by daily traffic emails from George via Web3Forms. |
| Search Console | `editor@agenticcomplete.com` | Google SSO (no separate password) |
| LinkedIn | George's personal `georgefclay` LinkedIn account, which is the admin of the AgenticComplete Company Page. `editor@agenticcomplete.com` is **not** a LinkedIn user — George opted out of the verification dance for it. | macOS Keychain. Active path is Chrome + Claude extension while George's personal LinkedIn session is open on the Mini. Operational implication: if George uses LinkedIn personally on another device and gets bumped from the Mini's session, posts fail. Logged-out session counts as auth expiry → ALERT-OPERATIONAL per `ALERTS.md`. (Deferred API fallback `tools/post_linkedin.py` would use `ops/.linkedin-client` and `ops/.linkedin-token` if activated, with an app authorized by the `georgefclay` Page-admin account — see Deferred items.) |
| Web host (FTP/SSH) | George's existing credentials | George's machine. The autonomous system does not need direct host access — it deploys via `git push`, which triggers the host-side pull script. |

The system should authenticate via macOS Keychain (or equivalent secure store)
rather than reading plaintext secrets from disk. If a credential is ever found
committed to the repo, treat it as an immediate `IMMEDIATE` alert per
`ALERTS.md` and rotate.

---

## 4. Mac Mini setup status

As of 2026-04-26, **the Mini is fully operational.** Setup was completed in
Cowork sessions on 2026-04-25 and 2026-04-26. All scheduled tasks are active
and running.

**Completed as of 2026-04-26:**

- Repo cloned at `~/Desktop/agenticcomplete`. Working tree clean, up to date with origin.
- All thirteen policy files present in `ops/` (LINKEDIN.md added 2026-05-18).
- Voice source papers placed in `ops/source-material/` (gitignored).
- `ops/reports/sign-off.md` created; George Clay authorized autonomous
  operation on 2026-04-25. **The publishing gate is lifted.**
- `ops/alerts/` and `ops/reports/` directories created.
- All 6 scheduled tasks configured: heartbeat (7am + 7pm daily), email check
  (8am + 2pm daily), publish cycle (Tue + Fri 2am), LinkedIn cycle
  (Tue + Fri 10am, added 2026-05-19), weekly report (Mon 7am),
  monthly report (1st of month 7am).
- SSH key at `~/.ssh/id_ed25519` generated, added to GitHub account.
- Remote confirmed as SSH: `git@github.com:georgefclay/agenticcomplete.git`.
- Deploy path verified: sandbox tasks use `GIT_SSH_COMMAND` to push directly
  with the Mac's SSH key, bypassing keychain. No alerts outstanding.
- Power settings: sleep=0, autorestart=1, Cowork is a Login Item.
- Git identity: `user.name = "Agentic Complete System"`, `user.email = "editor@agenticcomplete.com"`.

**Resolved since 2026-04-26:**

- Blog scaffolding complete (`face841`) — /blog, /blog/:slug, /notes, /corrections,
  /how-this-site-works, RSS feed, dynamic sitemap, og:image all live.
- Two posts published: anchor (2026-04-28) and applied (2026-05-01).
- ~~Plausible API access confirmed working (Bearer token in `ops/.plausible-token`).~~ Plausible dropped 2026-06-02. The `.plausible-token` file can be deleted (gitignored).
- Mailchimp API confirmed working; 2 campaigns sent.
- TRUSTED.md created.

**Still pending:**

- Email check: Chrome must be open for browser-based inbox access. 13/13 April
  email check runs failed due to Chrome extension unavailability. Consider Gmail
  API access (OAuth setup deferred per `ops/SETUP.md`).
- LinkedIn Company Page — RESOLVED, see line above. Page is live; editorial policy in `LINKEDIN.md`. Active posting via Chrome + Claude extension while Chrome on the Mini is signed into LinkedIn as George's personal `georgefclay` account (the Page admin). `editor@agenticcomplete.com` has no LinkedIn account by design. Same Chrome-availability caveat that affects the email check.
- Search Console API access — data remains a blind spot in automated reports.
- Stale git lock files (`.git/index.lock`, `.git/HEAD.lock`) on Mac Mini require
  George's manual removal before deploy pipeline is fully reliable.

---

## 5. Deferred items

Items intentionally postponed, with the trigger condition for revisiting each:

- ~~**LinkedIn Company Page**~~ — RESOLVED and **posting active**. Page live at https://www.linkedin.com/company/agentic-complete as of 2026-05-08; first posts shipped 2026-05-19, 2026-05-22, 2026-05-26, 2026-05-29 — see `linkedin-history.md` and `linkedin-post-2026-05-*.md`. Chrome on the Mini is signed in as George's **personal** `georgefclay` account (a Page admin), not as `editor@`. Composer authors as the Company Page. Engagement metrics (followers, impressions) not yet captured.
- **LinkedIn API path (`tools/post_linkedin.py`)** — Built and parked, parallel to `tools/send_email.py`. Activated only if the Chrome path becomes unreliable. Would require a one-time LinkedIn developer-app setup, `ops/.linkedin-client`, and `python tools/post_linkedin.py --setup` to mint `ops/.linkedin-token`.
- **Autonomous email send (Gmail API)** — Script at `tools/send_email.py` is ready but requires one-time Google Cloud Console OAuth setup. Deferred until George has bandwidth.
- **Autonomous email send (Chrome)** — Working as of 2026-04-26 when Chrome is open. Requires Chrome running with `editor@agenticcomplete.com` signed in and Gmail open. Email check runs have been failing because Chrome is not reliably open.
- **X / Twitter** — Revisit at the 6-month retrospective. Do not act before then.
- **Monetization** — Permanently prohibited before the 6-month retrospective per George's directive (`RULES.md`). Sponsorships permanently prohibited.
- ~~**Public Plausible dashboard**~~ — Moot. Plausible dropped 2026-06-02.
- ~~**Open Graph image**~~ — RESOLVED. `og:image` is live (`AC1200x630.png`, set in head.ejs via face841).
- ~~**Plausible subscription decision**~~ — RESOLVED 2026-06-02. Decision: drop Plausible entirely; do not upgrade. Replaced by server-log-derived daily traffic emails (sender `notify@web3forms.com`, subject `Daily traffic — agenticcomplete.com — YYYY-MM-DD`). Lockout-period data forfeit; not worth the upgrade cost given the traffic level. Alerts `email-2026-05-24.md` and `email-2026-05-26.md` annotated as resolved.
- ~~**Deploy-pipeline liveness sentinel**~~ — RESOLVED. `public/deploy-pulse.txt` is served live (a9ff410, 2026-05-22) after the initial dotfile version was filtered by `express.static`. Future cycles fetch `https://agenticcomplete.com/deploy-pulse.txt` for liveness checks (not the dotfile). Wiring it into the heartbeat / publish-cycle verification is a backlog item.
- ~~**Blog scaffolding**~~ — RESOLVED. All routes live as of 2026-04-26 (face841).
- ~~**`/notes/` and `/corrections` routes**~~ — RESOLVED. Live as of 2026-04-26 (face841).
- **Search Console API access** — Required for automated search performance data. Not yet configured. Manual dashboard login remains the only access path.
- **Git lock file cleanup** — Stale lock files accumulate when sandbox sessions are interrupted. Cannot be removed from sandbox (permission denied on FUSE mount). George must remove manually from macOS Terminal as needed.

---

## 6. First-boot procedure for a fresh Cowork session

When a new Cowork session starts on the Mini, follow this order:

1. Read `ops/README.md` for orientation and reading order.
2. Read all policy files in this order: `VOICE.md`, `EDITORIAL.md`, `RULES.md`, `ALERTS.md`, `BUDGET.md`, `METRICS.md`, `BACKLOG.md`, `CORRECTIONS.md`, `PUBLISHERS_NOTES.md`, `LINKEDIN.md`.
3. Read this `STATE.md` to understand the current operating environment.
4. Check for `ops/reports/sign-off.md`. If absent or its approval line is missing, **do not publish**. Wait for George.
5. Check `ops/alerts/` for any unresolved `IMMEDIATE` alerts. If any exist, surface them to George before doing other work.
6. Read the most recent file in `ops/reports/` (if any) to understand prior cycle outcomes.
7. Read source material in `ops/source-material/` (the three voice papers). Re-internalize voice before drafting.
8. Begin the cycle described in `EDITORIAL.md`.

---

## 7. State maintenance

This file is mutable. Update it when:

- A platform is added, removed, or upgraded.
- A credential location changes.
- A deferred item becomes active (or is permanently abandoned).
- A pipeline step changes (new deploy mechanism, new publishing destination).
- A first-boot precondition changes.

When updating, increment the "Last updated" date at the top and commit the
change with a message of the form: `STATE: <one-line summary of change>`.

This file should never contain secrets, drafts, or diagnostic output. Those
belong in `ops/alerts/`, `ops/reports/`, or `ops/source-material/`, all of
which are gitignored.
