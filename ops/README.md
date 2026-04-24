# Agentic Complete — Operations

This folder is the operational home of AgenticComplete.com. It contains the site source, the policy files that govern the autonomous operation of the blog, and the logs (reports, alerts, corrections) that accumulate as the system runs.

The site is operated as an **Agentic Complete system** by its own definition — closed-loop goal pursuit across planning, execution, monitoring, adaptation, and completion, without human handoffs between phases. The site is thus its own case study.

---

## Start here

If you are **George**, and this is the first time you are reading the policy pack, read the files in this order:

1. `README.md` — this file. Orientation.
2. `VOICE.md` — how the blog should sound.
3. `EDITORIAL.md` — blog structure and conventions.
4. `RULES.md` — the hard content rules.
5. `CORRECTIONS.md` — how errors are handled.
6. `PUBLISHERS_NOTES.md` — your reserved-author mechanism.
7. `ALERTS.md` — when the system escalates to you.
8. `BUDGET.md` — cost constraints.
9. `METRICS.md` — targets and measurement.
10. `BACKLOG.md` — initial topic queue.
11. `SETUP.md` — Mac Mini and account setup.

Reading all eleven end-to-end should take about 45 minutes. This is the one-time editorial approval. After sign-off (last step of `SETUP.md`), the system operates per these files without further per-post approval from you.

If you are the **system** reading this file on startup, re-check the policy files before every publishing run. Deviations from the policies are defects.

If you are a **reader who found this folder somehow**, it is the operating manual for the autonomous system that runs agenticcomplete.com. The site is public; this folder is the machinery behind it.

---

## Folder layout

The policy files live in an `ops/` subfolder inside the existing site repo. Current location on the dev machine: `C:\Programming\agenticcomplete\`. The same layout will be replicated on the Mac Mini.

```
agenticcomplete/             ← site repo root
├── app.js                   ← site source (Node app)
├── package.json             ← site source
├── content/                 ← site source
├── public/                  ← site source
├── views/                   ← site source
└── ops/                     ← operational layer
    ├── README.md            ← you are here
    ├── VOICE.md             ← blog voice profile
    ├── EDITORIAL.md         ← editorial standards
    ├── RULES.md             ← hard content rules
    ├── CORRECTIONS.md       ← error-handling protocol
    ├── PUBLISHERS_NOTES.md  ← George's reserved-author mechanism
    ├── ALERTS.md            ← escalation protocol
    ├── BUDGET.md            ← $50/month API cap, model selection
    ├── METRICS.md           ← targets, leading indicators, data sources
    ├── BACKLOG.md           ← seed topic queue
    ├── SETUP.md             ← Mac Mini + account setup
    ├── source-material/     ← George's writing samples (for VOICE.md grounding)
    ├── reports/
    │   ├── YYYY-MM-DD-weekly.md
    │   └── YYYY-MM-monthly.md
    └── alerts/
        └── YYYY-MM-DD-*.md
```

---

## Core commitments

Stated in one place so they can be referenced without hunting:

- **Cadence:** 2 posts per week (one anchor, one applied).
- **Voice:** George Clay's voice on the blog; formal standards-body voice on the framework pages.
- **Budget:** $50/month API, Sonnet default, Opus for anchors.
- **No editorial approval** per post after initial sign-off. Issues are handled via CORRECTIONS.md, not pre-publication review.
- **Public corrections log.** No silent edits.
- **Publisher's Notes reserved for George** with clear structural distinction (/notes/ URL, top banner, separate RSS category).
- **Weekly silent reports, monthly silent reports, 1 / 3 / 6-month public retrospectives** by George (Publisher's Notes).
- **No monetization** before the 6-month retrospective publishes.
- **Hard content rules** per RULES.md: no mean-spirited content, no defamation, fact-based or clearly opinion, brand mentions permitted but never marketing, only George and `editor@agenticcomplete.com` as contact info.
- **Platforms:** Beehiiv newsletter, LinkedIn Company Page, `editor@agenticcomplete.com` on Google Workspace, Plausible analytics, Google Search Console. X is skipped for cost reasons and revisited at the 6-month mark.
- **Targets:** 50 visitors/day at day 90, 200 visitors/day at month 6, starting from effectively zero.

---

## Definitions of "done" for the site itself

The site is "Agentic Complete" by its own definition when every one of the following is true:

- It accepts high-level editorial goals (the policy files in this folder) and pursues them.
- It generates and maintains a publication plan (BACKLOG.md, updated by the system).
- It performs actions across defined interfaces (GitHub commits, Beehiiv sends, LinkedIn posts, email replies).
- It observes outcomes and interprets state changes (weekly reports on leading indicators).
- It revises strategy when conditions change (topic prioritization shifts based on weekly data).
- It continues execution until verifiable completion (each post published, indexed, distributed).
- It operates without human handoffs between phases.

If any of these fails, the site is below its own threshold. Fix the failure, do not rationalize it.

---

## What the system does not do

- Pre-publication review by George.
- Silent post-publication editing.
- Monetize in any form before month 6.
- Post to X.
- Impersonate George or any human.
- Engage in personal attacks.
- Accept sponsorships, free products, or paid placements.
- Store contact information other than `editor@agenticcomplete.com` and George's personal email.

---

## First 90 days, at a glance

| Week | System does | George does |
|---|---|---|
| 0 | Reviews policy files with George, awaits sign-off | Sets up Mac Mini, creates accounts, signs off per SETUP.md |
| 1 | Inaugural post, first scheduled tasks wired | Watches |
| 1–4 | P0 definitional-defense posts (see BACKLOG.md) | Reads posts, flags corrections if needed |
| 4 | First monthly internal report | Writes 1-month Publisher's Note (public retrospective) |
| 5–12 | P1 framework-extension posts, ongoing applied posts | Reads posts, occasional Publisher's Notes as desired |
| 12 | Second monthly internal report | Writes 3-month Publisher's Note |
| 13–26 | Sustained 2/week cadence, depth broadening | Reads, flags, interjects as wanted |
| 26 | 6-month internal consolidation | Writes 6-month retrospective; decides on monetization, budget, continuation |

---

## Last word for George before sign-off

After `reports/sign-off.md` exists with your approval line, the experiment begins. Some posts will be boring. Some will be wrong. Some will be strange in ways that surprise both of us. That's the point. Your leverage points are Publisher's Notes (to comment) and the corrections log (to fix). Don't use editorial control; if something goes sideways, the story of it going sideways is better content than a quietly-prevented mistake.

Ready when you are.
