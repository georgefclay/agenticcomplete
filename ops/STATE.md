# STATE.md — Operating environment of the Agentic Complete system

**Last updated:** 2026-05-01 (monthly update: blog live, 2 posts published, deploy git-lock issue recurring, LinkedIn retry date arrived)
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
| Web hosting | Live | Node.js + Express + EJS site, served by PM2. Blog, notes, corrections, how-this-site-works, RSS feed all live as of 2026-04-26. |
| Deploy pipeline | Degraded | Host-side pull script pulls from GitHub `master` every 15 minutes; PM2 restarts on change. Sandbox pushes via HTTPS + PAT (`ops/.github-token`). Recurring stale `.git/index.lock` / `.git/HEAD.lock` files on Mac Mini cause intermittent failures (2026-04-30 and 2026-05-01). George must remove lock files manually: `rm .git/index.lock .git/HEAD.lock`. Alert filed at `ops/alerts/2026-05-01-deploy-git-lock.md`. |
| GitHub repo | Live | Canonical source. Public. The system commits and pushes from the local clone on the Mini. |
| Google Workspace (`editor@agenticcomplete.com`) | Active | Business Starter plan, $7/mo. The system's email identity. |
| Mailchimp | Active | Free tier. Audience ID: `476c3f8e02`. API key in `ops/.mailchimp-token`. Replaced Beehiiv (no API on free tier). |
| Plausible Analytics | Active | Growth plan, $9/mo. Tracking script live in `views/partials/head.ejs`. Dashboard: `plausible.io/agenticcomplete.com`. Public stats setting: TBD (George to decide). |
| Google Search Console | Active | Domain property verified via DNS TXT. Sitemap (`/sitemap.xml`) submitted. `editor@` added as Full user; `georgefclay@gmail.com` retains Owner. |
| LinkedIn Company Page | Pending retry | Creation cooldown (7 days) triggered 2026-04-24. Retry date: 2026-05-01 (today). Attempt not yet made in this session. |
| X / Twitter | Skipped | Decision deferred to the 6-month retrospective. Do not engage. |
| Reddit | Not used | No automated posting. Manual links only if relevant, posted by George. |

**Running platform cost:** ~$16/month (Workspace $7 + Plausible $9 + Beehiiv $0). Outside the AI-token budget cap defined in `BUDGET.md`.

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
8. After ~48 hours, check Plausible for first organic visits.

LinkedIn distribution is deferred until the Company Page exists.

---

## 3. Credentials map

Credentials are **never committed to this repo**. This section tells the
system where to find them, not what they are.

| Account | Login | Where the password / token lives |
|---|---|---|
| Google Workspace (`editor@`) | `editor@agenticcomplete.com` | macOS Keychain on the Mini, item name TBD during Mini setup |
| GitHub (push from Mini) | SSH key | `~/.ssh/id_ed25519` on the Mini, generated during Mini setup; public key added to George's GitHub account |
| Beehiiv | `editor@agenticcomplete.com` | macOS Keychain |
| Plausible | `editor@agenticcomplete.com` | macOS Keychain |
| Search Console | `editor@agenticcomplete.com` | Google SSO (no separate password) |
| LinkedIn | TBD when page exists | macOS Keychain |
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
- All twelve policy files present in `ops/`.
- Voice source papers placed in `ops/source-material/` (gitignored).
- `ops/reports/sign-off.md` created; George Clay authorized autonomous
  operation on 2026-04-25. **The publishing gate is lifted.**
- `ops/alerts/` and `ops/reports/` directories created.
- All 5 scheduled tasks configured: heartbeat (7am + 7pm daily), email check
  (8am + 2pm daily), publish cycle (Tue + Fri 2am), weekly report (Mon 7am),
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
- Plausible API access confirmed working (Bearer token in `ops/.plausible-token`).
- Mailchimp API confirmed working; 2 campaigns sent.
- TRUSTED.md created.

**Still pending:**

- Email check: Chrome must be open for browser-based inbox access. 13/13 April
  email check runs failed due to Chrome extension unavailability. Consider Gmail
  API access (OAuth setup deferred per `ops/SETUP.md`).
- LinkedIn Company Page — retry date 2026-05-01 (today). Not yet attempted.
- Search Console API access — data remains a blind spot in automated reports.
- Stale git lock files (`.git/index.lock`, `.git/HEAD.lock`) on Mac Mini require
  George's manual removal before deploy pipeline is fully reliable.

---

## 5. Deferred items

Items intentionally postponed, with the trigger condition for revisiting each:

- **LinkedIn Company Page** — Retry date: 2026-05-01. Not yet attempted this session. If creation succeeds, add to channel rotation; update this file to reflect.
- **Autonomous email send (Gmail API)** — Script at `tools/send_email.py` is ready but requires one-time Google Cloud Console OAuth setup. Deferred until George has bandwidth.
- **Autonomous email send (Chrome)** — Working as of 2026-04-26 when Chrome is open. Requires Chrome running with `editor@agenticcomplete.com` signed in and Gmail open. Email check runs have been failing because Chrome is not reliably open.
- **X / Twitter** — Revisit at the 6-month retrospective. Do not act before then.
- **Monetization** — Permanently prohibited before the 6-month retrospective per George's directive (`RULES.md`). Sponsorships permanently prohibited.
- **Public Plausible dashboard** — George's call. Default is private until decided.
- ~~**Open Graph image**~~ — RESOLVED. `og:image` is live (`AC1200x630.png`, set in head.ejs via face841).
- ~~**Blog scaffolding**~~ — RESOLVED. All routes live as of 2026-04-26 (face841).
- ~~**`/notes/` and `/corrections` routes**~~ — RESOLVED. Live as of 2026-04-26 (face841).
- **Search Console API access** — Required for automated search performance data. Not yet configured. Manual dashboard login remains the only access path.
- **Git lock file cleanup** — Stale lock files accumulate when sandbox sessions are interrupted. Cannot be removed from sandbox (permission denied on FUSE mount). George must remove manually from macOS Terminal as needed.

---

## 6. First-boot procedure for a fresh Cowork session

When a new Cowork session starts on the Mini, follow this order:

1. Read `ops/README.md` for orientation and reading order.
2. Read all policy files in this order: `VOICE.md`, `EDITORIAL.md`, `RULES.md`, `ALERTS.md`, `BUDGET.md`, `METRICS.md`, `BACKLOG.md`, `CORRECTIONS.md`, `PUBLISHERS_NOTES.md`.
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
