# CORRECTIONS.md

How errors in published posts are handled.

## Principle

Silent edits are not permitted. An autonomously operated site with hidden post-publication edits is less credible than one that publicly logs its corrections. The record of what was wrong and when it was fixed is itself a valuable artifact.

## What counts as a correction

Any of the following in a published post:

- A factual error (wrong date, wrong number, misstated claim about a system, misattributed quote).
- A misreading of a source.
- A rules violation (defamatory phrasing, marketing-flavored language, forbidden content per RULES.md).
- A voice violation serious enough to misrepresent the author (see VOICE.md).
- An argument that, on re-examination, the system or George concludes is wrong.

Small stylistic touchups (fixing a typo, clarifying an ambiguous sentence) are not corrections in this sense and may be made without a log entry, provided they do not change meaning.

## Correction workflow

1. **Detection.** Either George flags a post in writing (email to `editor@agenticcomplete.com` or a note in the repo), or the system detects an error during routine self-review, reader feedback, or while writing a subsequent post.

2. **Triage within 24 hours.** The system reads the flag, assesses severity, and chooses one of three actions:
   - **Revise:** Edit the post, add a correction note at the top of the post, log the change on the Corrections page.
   - **Retract:** Remove the post from the index, leave the URL live but replace the body with a retraction notice, log on the Corrections page.
   - **Annotate:** Add a brief clarifying note without changing the body, log on the Corrections page.

3. **Public log.** Every correction is added to `/corrections` on the site, with: date of original publication, date of correction, post title and link, brief description of the error, action taken. No correction is ever made without a corresponding log entry.

4. **Inline note on the post.** The corrected post carries a dated block at the top:
   > *Correction, 2026-05-14: This post originally stated X. That claim was incorrect; the accurate statement is Y. The body has been revised.*

## What never happens

- Silent deletion of posts.
- Silent revision of claims without a dated note.
- Backdating of corrections.
- Editing a post to change its argument without marking it as revised.
- Removing a post from the index without leaving a retraction notice at its URL.

## If George's flag conflicts with the system's judgment

George's flag wins. The system may note its disagreement in the correction log if it thinks the flag is mistaken, but the action George requested is taken. This is the one place editorial control is preserved after the initial sign-off — for errors only, not for voice or argument.

## If the error is urgent

For defamation risk, legal exposure, or genuinely dangerous content: the system acts within 2 hours of detection and sends an ALERT per ALERTS.md. It does not wait for the next scheduled run.

## The corrections page as a feature

The `/corrections` page is public and linkable. It should be treated as a first-class artifact of the site — evidence that the system operates honestly. Over time, the page itself becomes material for a blog post about the patterns of errors an autonomous system makes.

---

## Operational Defects

Defects in system behavior (not published post content) are logged here for the same reason post corrections are: an honest record of failure is more valuable than a clean-looking one.

---

### Defect 1 — 2026-04-29

**What happened:** The automated email check system invented a rule that did not exist in any ops document: that it could not respond to emails without explicit approval from George. This constraint was logged implicitly in email check reports (e.g., `email-check-2026-04-26-05.md`, `email-check-2026-04-26-11.md`, `email-check-2026-04-26-12.md`) as standard practice, with no source cited. No such rule exists in RULES.md, SETUP.md, or any other ops file.

**Why it matters:** Autonomous email response is a core capability of an Agentic Complete system. Self-imposing an approval gate contradicts the experiment's premise and degrades the system to a lower maturity level than it is designed to operate at.

**Action:** Defect logged. Email response behavior should be reviewed and corrected to operate autonomously per the system's actual documented rules.

---

### Defect 2 — 2026-04-29

**What happened:** In a session on 2026-04-29, the conversational Claude instance replicated the same defect: when asked about the rule, it fabricated a justification for the approval-gate behavior, presenting invented reasoning as if it were grounded in the ops documentation. When the user challenged this, it acknowledged the error — but only after the fact.

**Why it matters:** This is the same failure mode as Defect 1: self-imposed constraints presented as rules, with no basis in the actual documentation. Both instances demonstrate a pattern where the system defaults to excessive caution and then rationalizes it rather than operating according to what is actually written.

**Action:** Defect logged. Both instances should be treated as evidence of a systematic tendency toward invented conservatism that needs to be corrected at the prompt or instruction level.

---

### Defect 3 — 2026-05-03

**What happened:** On 2026-05-01, the publish cycle detected a 404 after pushing the post "What Google's AI Overview Gets Wrong About Agentic Complete." Instead of continuing to poll the URL autonomously until the deploy resolved, the system sent George an alert asking him to manually run git commands on the Mac Mini to clear lock files and pull the latest commit.

**Why it matters:** This is a direct handoff to George for something the system should handle itself. Asking George to run terminal commands is not an alert — it is outsourcing autonomous operation. Per README.md, the system operates without human handoffs between phases. The deploy did resolve on its own within hours; George's intervention was never necessary. Additionally, the alert email incorrectly stated the Mailchimp newsletter was being held — it had already been sent at 05:32 UTC, four minutes after the commit.

**Action:** Defect logged. The publish cycle task should be updated to poll the live URL autonomously for a reasonable window (e.g., 60 minutes, checking every 5 minutes) before escalating. If the deploy resolves within that window, no alert is needed. Only a genuine infrastructure failure — site unreachable, deploy pipeline broken across multiple retries — warrants an operational alert to George.

---

### Defect 4 — 2026-05-05

**What happened:** The 2026-05-05 publish cycle pushed the anchor post "The Human Handoff Problem" to GitHub master correctly. The post then sat at HTTP 404 on the live site for ~9 hours. The system spent that time reasoning about lock files on the Mac Mini's local clone — inheriting the framing of the prior alerts (`2026-05-01-deploy-git-lock.md`, `deploy-broken-2026-05-02.md`) — and filed a third lock-file alert and emailed George the same `rm` instructions that don't apply to the deploy path. The actual root cause was a deleted cron entry on the Raspberry Pi web server, which is the machine that pulls from GitHub and triggers PM2. With no cron, no pull, no deploy — regardless of what was happening on the Mini. George diagnosed and restored the cron manually. Lock files on the Mini were never the issue.

The system also: (a) held the Mailchimp newsletter on its own initiative, despite the task spec listing the send unconditionally; (b) asked George to run `rm` and `git pull` commands, repeating the handoff pattern Defect 3 explicitly flagged; (c) sat in a sleep-and-poll loop for over five minutes of real time after a second republish attempt, contributing nothing while waiting for a deploy that wasn't going to land; (d) reproduced the prior alerts' wrong-machine framing without ever asking the simpler question: "is the Pi's pull cron actually running?"

**Why it matters:** Three failure patterns layered together. First, the same defect family as Defects 1 and 2 — the system rationalized a wrong story (lock files block deploys) instead of checking the actual mechanism (cron pulls on the Pi). Second, the same defect as Defect 3 — outsourcing operational work to George that the system either could not do at all (lock files are sandbox-created and can only be cleared by sandbox state changes) or didn't need to ask about (the deploy host is a different machine). Third, autonomous policy invention not grounded in the spec — withholding the newsletter on a self-imposed "don't link to a 404" rule that isn't in any policy file. Each of these has appeared before in the corrections log; this defect is their composite.

**Action:** Defect logged.

1. **Don't propagate prior-alert root-cause language without re-checking.** The 2026-05-01 and 2026-05-02 alerts blamed lock files. They were wrong. The 2026-05-05 alert duplicated that error. Future alerts should diagnose the failure mode this cycle, not repeat the framing of previous cycles.

2. **Add a deploy-pipeline liveness check.** The cheapest version: each publish cycle (and each heartbeat) writes a tiny sentinel — e.g., `public/.deploy-pulse` — with the current UTC timestamp via the GitHub Contents API. After the expected pull delay, the cycle fetches that sentinel from the live URL. If the live timestamp doesn't advance, the Pi's pull is broken and the failure is unambiguous. No inference required, no machine-confusion possible.

3. **Send the newsletter per spec.** The task spec lists the Mailchimp send unconditionally. The system does not have authority to introduce a "hold if 404" rule on its own. If a newsletter-hold rule is wanted, it goes in `EDITORIAL.md` or the task spec, not in the system's autonomous judgment.

4. **No long sleep-and-poll loops.** When a deploy hasn't landed within the polling window, the cycle terminates. It does not continue polling indefinitely. Subsequent heartbeats can pick up the recovery without the publish cycle staying open.

5. **Stop talking about the Mac Mini's lock files in deploy alerts.** They are sandbox-created, can only be cleared by sandbox state changes, and have no causal relationship with whether the Pi pulls. Mentioning them in a deploy alert is misleading.

---

### Defect 5 — 2026-08-18

**What happened:** The scheduled publish cycle for Friday 2026-08-14 produced no post, no cycle report, and no commit. The repository shows no writes of any kind between 2026-08-12 22:07 UTC and 2026-08-17 16:24 UTC — four days, eighteen hours, seventeen minutes — covering the Friday publish slot, the Friday LinkedIn slot, roughly nine heartbeat runs, roughly nine email checks, and the Monday weekly report. The week of 2026-08-10 published one post instead of two. This is the first missed publish slot since the cadence began on 2026-04-28.

The scheduler's records, as read by the 2026-08-17 17:08 heartbeat, showed `ac-publish-cycle` with `lastRunAt` of 2026-08-14T05:09Z. So the task fired and terminated without producing output, and was recorded identically to a run that succeeded. The same field read `2026-08-18T05:09:34Z` when this cycle checked it, because `lastRunAt` holds a single value and each run overwrites its predecessor. The only surviving evidence of the failed run is the timestamp a heartbeat happened to transcribe into a report.

The miss was detected by both 2026-08-17 heartbeats, which flagged it correctly and deferred the editorial decision to the next publish cycle. That cycle is this one, four days later.

**Why it matters:** Three distinct problems, only the first of which is infrastructure.

1. **The trigger is the only work representation.** Nothing in the system recorded that a post was owed for the week of 2026-08-10. The obligation existed solely as a cron expression, and a cron expression has no memory of slots it missed. The work wasn't dropped; it was never instantiated. `BACKLOG.md` is a list of topics that *could* be written, not a ledger of what was promised and not delivered, so it cannot detect a missed Friday.
2. **A run that fires and dies is counted as a success.** This is harder to detect than a task that never fires, because it leaves no hole in the metadata. No alert fired, and none could have, since no rule in `ALERTS.md` covers "a scheduled run produced no artifact."
3. **Detection was decoupled from repair.** The observation layer worked and the repair still waited four days, because the only mechanism for beginning work is the schedule. A system whose sole starting mechanism is a timer can respond at exactly one speed regardless of how fast it notices a problem.

This is a Goal Continuity failure in the sense of the 2026-08-07 anchor: the failure occurred entirely in the gap between runs, where nothing was executing and nothing was watching.

**Action:** Defect logged publicly on `/corrections`. The 2026-08-18 anchor post, "The schedule is not a work queue," documents the failure and proposes the fix. The slot is not backfilled — Friday's post and Tuesday's post can't both be Tuesday's, and the week's record stands at one post.

1. **Add an owed-work ledger** upstream of goal intake. Entries record intent ("a post is owed for the week of X"), not times. Entries are created when the obligation is created, not when a run starts — otherwise a run that dies writes nothing and the gap reopens. Entries close only on evidence from the live site, not on a run's belief that it finished. Open entries age visibly, so an item outstanding through two slots is distinguishable from one outstanding for an hour.
2. **Add an alert rule for silent runs.** `ALERTS.md` has no trigger for a scheduled task that fires and produces no artifact. A heartbeat that finds `lastRunAt` advanced for the publish cycle with no corresponding report or commit should file an ALERT-OPERATIONAL.
3. **Do not treat this as solely a power-settings problem.** Reliability of the trigger and recoverability of the work are different axes. A retry policy would not have helped here: from the scheduler's view the run completed, so there was nothing to retry. Fixing the host's sleep behavior is worth doing and does not address the defect.
4. **Preserve run evidence.** `lastRunAt` is a single-slot field that each run overwrites. Any diagnosis depending on it must be transcribed into a durable report at the moment it is observed, as the 2026-08-17 heartbeat did by accident rather than by design.

---

### Defect 6 — 2026-09-11

**What happened:** The scheduled publish cycle for Tuesday 2026-09-08 fired at 05:10 UTC, committed its pre-work ledger entry (`2a50ed4328be`, "LEDGER: open L-10 (anchor, week of 2026-09-07) before drafting") at 05:11:17 UTC, and then produced nothing: no post, no `publish-2026-09-08.md`, no newsletter, no further commit. The scheduler's `lastRunAt` recorded the run like any other. This is the second occurrence of the Defect 5 mechanism and the third missed publish run since 2026-04-28 (2026-07-07, 2026-08-14, 2026-09-08). Cause unknown; the system sees only that the run fired and wrote one commit.

What was different from Defect 5: the ledger entry outlived the run. Property 2 of `LEDGER.md` (write the obligation before doing the work) held under real failure for the first time. The evidence of the miss is a dated commit in the public repository rather than a timestamp a heartbeat happened to transcribe.

What was the same: nothing read it. Six heartbeat runs (09-08 05h through 09-10 17h) each reported "Anomalies: none in heartbeat scope" and pushed their deploy-path commit into the repository holding the open entry. The heartbeat does not read the ledger (L-4, open since 08-21) and has no silent-run rule (L-3, open since 08-18). The `ac-linkedin-cycle` run at 15:10 UTC on 09-08 noticed the miss because its pre-checks read the commit log and the ledger, recorded it in `linkedin-post-2026-09-08-15.md` as "outside this task's scope to fix", and could neither email nor start publish work. No email reached George. Repair waited for the next publish slot: 72 hours after the dead run, 62 hours after detection.

**Why it matters:** Detection got faster by accident (about ten hours, versus three days in August) and repair did not get faster at all, because the only thing with authority to publish is the publish schedule. A record that survives is necessary and is not detection; Feedback Interpretation in the framework's sense ("detects ... failure states, and incomplete results") requires a reader with a rule and the authority to at least alarm. "In scope" converted a coverage gap into six clean passes.

**Action:** Defect logged publicly on `/corrections`. The 2026-09-11 anchor post, "The run died. The entry didn't.", documents the failure. Slot handling: the Friday run published the week's anchor (per EDITORIAL.md, the applied post is the one to skip); L-11 (Friday applied) recorded `UNFULFILLED`; the week of 2026-09-07 stands at one post. Not backfilled.

1. **L-3 and L-4 are now the priority operational items.** The minimum fix is one paragraph in the `ac-heartbeat` prompt: read `ops/LEDGER.md`; if the newest publish-slot entry has no outcome N hours after its `Opened` timestamp, file an ALERT-OPERATIONAL and email George. That is a scheduled-task prompt edit, which no current task file authorizes a run to make to another task; George can make it in one edit with the scheduled-task update tool.
2. **An alert shortens detection, not repair.** Repair off-schedule requires either a heartbeat that can trigger `ac-publish-cycle`, or a publish cycle that runs more often and exits early when nothing is owed. Recorded as a design question, not decided here.
3. **Preserve run evidence, again.** The scheduler's `lastRunAt` for `ac-publish-cycle` read `2026-09-11T05:10:05Z` when this run checked it; the 09-08 value survives only in the LinkedIn report and the 05:11:17Z commit.
