# SETUP.md

Mac Mini setup and account creation, in order.

Work through this list once. When every box is checked, the system is ready for Day 1.

## Mac Mini hardware/OS setup

- [ ] **System Settings → Energy:** Disable sleep. Set "Prevent automatic sleeping when display is off." On Mac Mini, also enable "Start up automatically after a power failure."
- [ ] **System Settings → Displays:** If no monitor attached, headless operation is fine; confirm the Mini does not require a display to stay awake.
- [ ] **Network:** Confirm wired Ethernet preferred over Wi-Fi for reliability. Static IP or DHCP reservation so the machine is reachable if needed.
- [ ] **Automatic updates:** Allow macOS security updates but disable automatic restarts during working hours. Schedule any forced restarts for weekends when publishing is paused.
- [ ] **Disk space:** Confirm at least 20GB free. Repo + logs + reports will grow slowly.
- [ ] **Backups:** Enable Time Machine to an external drive or network volume. The repo is also on GitHub (see below), but Time Machine covers the scheduled task state.

## Folder structure on the Mini

The site repo already contains the site source at its root (`app.js`, `package.json`, `content/`, `public/`, `views/`). Policy files live in an `ops/` subfolder inside that repo. Clone or copy the full repo to the Mini.

Target layout:

```
agenticcomplete/             ← site repo root
├── app.js                   ← site source (already present)
├── package.json             ← site source (already present)
├── content/                 ← site source (already present)
├── public/                  ← site source (already present)
├── views/                   ← site source (already present)
└── ops/                     ← operational layer
    ├── README.md
    ├── VOICE.md
    ├── EDITORIAL.md
    ├── RULES.md
    ├── CORRECTIONS.md
    ├── PUBLISHERS_NOTES.md
    ├── ALERTS.md
    ├── BUDGET.md
    ├── METRICS.md
    ├── BACKLOG.md
    ├── SETUP.md             ← (this file)
    ├── source-material/     ← drop the three papers here
    ├── reports/             ← system writes weekly and monthly reports here
    └── alerts/              ← system writes escalation logs here
```

- [ ] Transfer the whole `agenticcomplete/` repo to the Mini (git clone or copy).
- [ ] Confirm the `ops/` folder with all `.md` files is present inside the repo on the Mini.
- [ ] Drop the three source papers into `ops/source-material/`.
- [ ] Decide whether `ops/` should be committed to the site's git repo or left in `.gitignore`. Recommendation: commit it — operational documentation belongs with the project, and the public policy files are part of the site's identity.

## Cowork setup

- [ ] Install Cowork (if not already).
- [ ] Add Cowork to Login Items: System Settings → General → Login Items → add Cowork.
- [ ] Launch Cowork and sign in.
- [ ] Verify API access is configured (billing set up, cap aligned with BUDGET.md — $50 ceiling on API spend).
- [ ] Set the API billing hard limit to $60 as a safety floor (above our internal $50 cap but below a runaway).

## Grant folder access

- [ ] In Cowork, grant the session access to the `AgenticComplete/` folder. This is the one-time permission that lets the system read/write site source, policy files, reports, and alerts.
- [ ] Confirm write access works (system will write a timestamp to `reports/setup-test.md` and delete it).

## Account creation

Each of these will be needed. Create the account, then hand credentials (or delegated access) to the system on first run.

- [ ] **Google Workspace account** — create `editor@agenticcomplete.com`. Requires DNS MX records pointed at Google; a small one-time DNS task.
- [ ] **Beehiiv** — create a publication at agenticcomplete.com or a subdomain. Free tier.
- [ ] **LinkedIn Company Page** — create a Page for "Agentic Complete." You (George) remain the admin; the system posts via API.
- [ ] **Plausible Analytics** — create an account, add agenticcomplete.com, copy the tracking script.
- [ ] **Google Search Console** — verify agenticcomplete.com (DNS TXT or HTML file). Submit sitemap once blog is up.
- [ ] **GitHub repo for the site** (if not already) — so the system has a version-controlled place to commit changes and the deploy pipeline has something to build from.

## Add analytics to the site

- [ ] Paste the Plausible tracking snippet into the site's `<head>` tag. Confirm events flow to the Plausible dashboard.
- [ ] Verify the site in Google Search Console.
- [ ] Submit a sitemap (the system will maintain it; a stub sitemap is fine to start).

## First scheduled tasks (the system will set these up, but confirm the runner is live)

- [ ] Heartbeat: every 12 hours. Writes to `reports/heartbeat.md`. If not updated in 48h, email George.
- [ ] Email check: twice daily. Triage inbox, draft responses or flag alerts.
- [ ] Publish cycle: two per week, days TBD (typically Tuesday + Friday mornings).
- [ ] Weekly report: Mondays.
- [ ] Monthly report: 1st of month.

## Sign-off

When every box above is checked and you've read VOICE.md, EDITORIAL.md, RULES.md, CORRECTIONS.md, PUBLISHERS_NOTES.md, ALERTS.md, BUDGET.md, and METRICS.md once end-to-end:

- [ ] Final sign-off: create a file `reports/sign-off.md` containing the sentence "I, George Clay, approve the policy files as of [date]. Autonomous operation is authorized."

After sign-off, editorial approval stops. The system operates per the policy files from that point forward.
