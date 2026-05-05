# ALERT-OPERATIONAL — Publish Cycle 2026-05-05: Deploy Delayed (RESOLVED)

**Date filed:** 2026-05-05
**Date resolved:** 2026-05-05
**Severity:** Operational
**Status:** Resolved by George — Pi's pull cron entry was missing, restored manually.

## What happened

Today's anchor post — "The Human Handoff Problem" — was drafted, voice-checked, and committed via the GitHub Contents API at approximately 05:14 UTC.

| Step | Result |
|---|---|
| Draft + self-check | Pass (voice, editorial, rules) |
| Commit `views/blog/posts/human-handoff-problem.ejs` | Success — commit `6f5364df7d8e2db2ac0e6e90038ad8c26c85f69e` |
| Commit `data/posts.json` | Success — commit `130d5eb51e1e88280391edfc9ea307aab51f6223` |
| Live URL `https://agenticcomplete.com/blog/human-handoff-problem` | HTTP 404 from +5 min through ~+9 hours after push |
| Mailchimp newsletter | Sent on George's instruction — campaign `b02a30f6d6`, send response HTTP 204 |
| Live URL after George's fix | HTTP 200 — post live, full body rendering |

## Root cause (as diagnosed by George)

The Raspberry Pi web server runs a cron job that pulls from GitHub master every 15 minutes and triggers PM2 to pick up the change. **That cron entry had been deleted.** With no scheduled pull, the Pi's clone never advanced past whatever its previous state was, so PM2 continued serving the older build and the new post was never on the live filesystem.

The cycle's commits were on GitHub master correctly the entire time. The break was strictly between GitHub and the Pi.

## Resolution

George re-added the cron entry on the Pi. The next cron tick pulled the outstanding commits and PM2 picked up the new post. Verified live at HTTP 200.

## Prior alerts this supersedes / corrects

- `2026-05-01-deploy-git-lock.md` — filed when the prior post (`what-google-ai-overview-gets-wrong`) sat at 404 after push. Attributed to lock files on the Mac Mini's local clone. The actual deploy host is the Pi; the Mini's local git state has no bearing on the Pi's pull. The 2026-05-01 deploy resolved when the Pi's cron next fired successfully, not because anyone cleared lock files.
- `deploy-broken-2026-05-02.md` — filed when the heartbeat deploy-path *push* check failed across multiple runs. That alert was about sandbox-side commit/push failure (since worked around by using the GitHub Contents API), not the Pi-side pull failure that caused the visible deploy outage.

Both prior alerts can be marked resolved or rewritten on the next pass; their root-cause framing was wrong. The recurring "deploy is broken" pattern of the last week was the Pi cron, not anything on the Mini.

## What the system did wrong this cycle

Today's run inherited the prior alerts' framing and reproduced it: filed a third lock-file alert, emailed George the same `rm` instructions that don't apply, and reasoned about the wrong machine for several hours. The system had a working mental model of how the deploy pipeline runs (commit on GitHub → cron pulls on host → PM2 restarts), but never instrumented or verified that the cron was actually running on each cycle. A single check — fetch a heartbeat sentinel via the live site, not GitHub — would have caught the cron disappearance immediately.

This is filed as Defect 4 in `CORRECTIONS.md`.

## Correct behavior next time

- Don't propagate prior-alert root-cause language without re-checking it.
- Add a cheap deploy-pipeline liveness check: write a tiny sentinel file (e.g., `public/.deploy-pulse`) with a timestamp via the GitHub API on each publish cycle, then fetch it from the live URL after the expected pull delay. If the sentinel timestamp doesn't advance, the Pi's pull is broken — and the failure mode is visible without any inference about what's blocking it.
