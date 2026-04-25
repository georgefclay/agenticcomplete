# STATE.md — Operating environment of the Agentic Complete system

**Last updated:** 2026-04-24 (initial creation)
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
| Domain (`agenticcomplete.com`) | Live | Ranked #1 on Google for "agentic complete" as of 2026-04-24. Baseline traffic: ~2 clicks, 5 impressions over the prior period. |
| Web hosting | Live | Node.js + Express + EJS site, served by PM2. |
| Deploy pipeline | Live | Server-side script pulls from GitHub `main` every 15 minutes; PM2 restarts on change. Proven working (Plausible deploy 2026-04-24). |
| GitHub repo | Live | Canonical source. Public. The system commits and pushes from the local clone on the Mini. |
| Google Workspace (`editor@agenticcomplete.com`) | Active | Business Starter plan, $7/mo. The system's email identity. |
| Beehiiv | Active | Account created, free tier. Sender = `editor@agenticcomplete.com`. No posts published yet. |
| Plausible Analytics | Active | Growth plan, $9/mo. Tracking script live in `views/partials/head.ejs`. Dashboard: `plausible.io/agenticcomplete.com`. Public stats setting: TBD (George to decide). |
| Google Search Console | Active | Domain property verified via DNS TXT. Sitemap (`/sitemap.xml`) submitted. `editor@` added as Full user; `georgefclay@gmail.com` retains Owner. |
| LinkedIn Company Page | Deferred | Creation cooldown (7 days) triggered 2026-04-24. Target retry: ~2026-05-01. Help ticket may be filed; do not assume reset. |
| X / Twitter | Skipped | Decision deferred to the 6-month retrospective. Do not engage. |
| Reddit | Not used | No automated posting. Manual links only if relevant, posted by George. |

**Running platform cost:** ~$16/month (Workspace $7 + Plausible $9 + Beehiiv $0). Outside the AI-token budget cap defined in `BUDGET.md`.

---

## 2. Publishing pipeline

The full path from system-generated content to live page:

1. System edits files in the local clone of the repo on the Mini.
2. System runs `git add`, `git commit`, `git push` to the GitHub `main` branch.
3. The web host's pull script (running every 15 minutes) detects the change.
4. The host runs `git pull`, then PM2 restarts the Node process.
5. The change is live within ~15 minutes of `git push`.

The same pipeline applies to blog posts, framework edits, corrections, and
Publisher's Notes (which George commits manually, also via the same flow).

**There is no FTP step.** A `.github/workflows/deploy.yml` file exists in the
repo as a dormant backup, but FTP secrets are intentionally not configured.
The pull-based deploy is the only live path.

**Blog post publish flow specifically:**

1. Draft the post (Sonnet for applied, Opus for anchor — see `EDITORIAL.md`).
2. Run the self-check rubric in `VOICE.md`.
3. Save as a markdown or EJS file in the appropriate `views/blog/` path (path TBD when the blog scaffolding is added — see `BACKLOG.md` P0 work).
4. Commit with a message of the form: `Publish: <slug> (<post type>)`.
5. Push to `main`.
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

As of 2026-04-24, **the Mini has not been set up yet.** All work to date has
been done from George's Windows machine. Platform setup is complete on the
account/cloud side, but the Mini is not running yet.

Pending Mini-specific work (see `SETUP.md` for the full checklist):

- Install Cowork; set as Login Item.
- Power settings: never sleep, restart after power failure, automatic login.
- `git clone` the repo to a stable local path (suggested: `~/agenticcomplete`).
- Generate SSH key, add public key to GitHub.
- Configure git: `user.name = "Agentic Complete System"`, `user.email = "editor@agenticcomplete.com"`.
- Drop the three voice-source papers (Assignment 15.docx, Assignment8.docx, Daily Life in China.docx) into `ops/source-material/` (gitignored — local only).
- Create `ops/reports/sign-off.md` with George's approval line authorizing autonomous operation.
- Set up scheduled tasks: heartbeat (every 12h), email check (2x/day), publish cycle (2x/week), weekly report (Mondays), monthly report (1st of month).
- Verify the system can: read all ops/ policy files, send a test email from `editor@`, fetch Plausible data, fetch Search Console data, push a no-op commit to GitHub.

**Until sign-off.md exists and contains the approval line, the system must not publish content.** Pre-launch work (drafting, dry runs, scaffolding) is allowed; publishing to the live site is not.

---

## 5. Deferred items

Items intentionally postponed, with the trigger condition for revisiting each:

- **LinkedIn Company Page** — Retry on or after 2026-05-01. If creation succeeds, add to channel rotation; update this file to reflect.
- **X / Twitter** — Revisit at the 6-month retrospective. Do not act before then.
- **Monetization** — Permanently prohibited before the 6-month retrospective per George's directive (`RULES.md`). Sponsorships permanently prohibited.
- **Public Plausible dashboard** — George's call. Default is private until decided.
- **Open Graph image** — Site lacks `og:image` meta tag. Affects link previews on LinkedIn / Slack / iMessage. Add when a 1200×630 image is available.
- **Blog scaffolding** — The site does not yet have blog routes. Adding `/blog` index, `/blog/:slug` post pages, and an RSS feed is a P0 item in `BACKLOG.md`.
- **`/notes/` and `/corrections` routes** — Required by `PUBLISHERS_NOTES.md` and `CORRECTIONS.md`. Build alongside the blog scaffolding.

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
