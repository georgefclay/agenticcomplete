# LEDGER.md — Owed work

The durable record of what this system has committed to and not yet delivered.

Created 2026-08-21, in response to Defect 5 (see `CORRECTIONS.md`) and the
2026-08-18 anchor post, "The schedule is not a work queue," which argued that a
schedule records when to start and never what is owed.

## What this file is for

`BACKLOG.md` lists topics that *could* be written. The scheduler lists *times*.
Neither can represent an obligation that exists right now and has not been met.
This file does.

## Properties (from Defect 5, remediation item 1)

1. **Entries record intent, not times.** "A post is owed for the week of X," not
   "the publish cycle runs Tuesday and Friday."
2. **Entries are created when the obligation is created**, not when a run starts.
   A run that fires and dies writes nothing, so a ledger written at run-start
   reopens the same gap it was built to close.
3. **Entries close only on evidence**, not on a run's belief that it finished.
   For a post, that evidence is the live URL. Where the evidence is currently
   unobtainable, the entry says so rather than closing on a weaker substitute.
4. **Open entries age visibly.** An item outstanding through two slots must be
   distinguishable from one outstanding for an hour.

## Status vocabulary

| Status | Meaning |
|---|---|
| `OPEN` | Obligation exists, not met. Carries an age. |
| `OPEN (unverified)` | The work was done and every available check passed, but the evidence named in property 3 was not obtained. **Still open. Still ages.** |
| `CLOSED` | Met, with the evidence named. |
| ~~`CLOSED (weak)`~~ | **Retired 2026-08-25.** Invented on this file's first day to describe an entry whose specified evidence could not be obtained. The flaw: it was a closed status, so entries carrying it stopped aging, which defeated property 4 in exactly the case property 4 exists for. Replaced by `OPEN (unverified)`. See the 2026-08-25 anchor post. |
| `UNFULFILLED` | The window passed and the obligation cannot be met. Not backfilled, not deleted. |

---

## Open

Ages recomputed 2026-09-22 (Tuesday publish cycle, at run start, before drafting).

| # | Obligation | Opened | Age | Status | Source |
|---|---|---|---|---|---|
| L-16 | A post is owed for the week of 2026-09-21, Friday slot (applied) | 2026-09-25 | 0 days | `CLOSED` | **Deviation from property 2, recorded rather than hidden: this row was opened after drafting and committing, not before.** Outcome, same run: `the-file-said-private` committed to `master` (`39fcf08eb5af` post, `66889258473641` posts.json) and read back byte-identical (6,100 and 13,758 bytes); newsletter sent (Mailchimp campaign `df536ff670`, 2 recipients, 05:28:38Z). **Live-URL evidence obtained** — `https://agenticcomplete.com/blog/the-file-said-private` fetched directly (status 200, body contains the post’s section headers and footer verbatim) and the slug confirmed listed on `https://agenticcomplete.com/blog`, both via this session’s device shell rather than the sandboxed publish-cycle’s provenance-locked fetch tool. L-1 unaffected: the scheduled task’s own fetch path is unchanged, and this session had a network path L-1’s 25 prior cycles did not. Closes on the evidence property 3 specifies, second entry in this file to do so after L-13. **Also: this run’s own applied post is about Anomaly 3 from the 2026-09-21 weekly report (`.gitignore` does not gate the GitHub Contents API; nine files under `ops/alerts/` and `ops/reports/` are public that the ignore file says should not be). Having just verified and written about that gap, this run did not push its own `ops/reports/publish-2026-09-25.md` to `master`, to avoid adding a tenth file to the set it describes. That is a one-run workaround, not a fix; the fix is still George’s call per the weekly report’s Priority 1.** |
| L-15 | A post is owed for the week of 2026-09-21, Tuesday slot (anchor) | 2026-09-22 | 0 days | `OPEN (unverified)` | Opened at run start on 2026-09-22 before any drafting began, per property 2. **Provenance: this row cites the commit identifier returned by the GitHub Contents API call that wrote it — `578282a0005e` — per Defect 7 remediation item 2. First row in this file to do so.** A row that cannot cite a hash is a row that was never committed; this one can, and the citing edit is a second commit (`75d081a4011a`), so the claim was written after the fact it asserts rather than alongside it. Outcome, same run: `autonomy-level-not-capability-classification` committed to `master` (`44caa61acc0a` post, `da8b827c3217` posts.json) and read back byte-identical (11,729 and 13,414 bytes); newsletter sent (campaign `3341405920`, 2 recipients, 07:22:43Z). Live-URL evidence not obtained, per L-1 (24th consecutive cycle; all three paths reproduced blocked this run: provenance refusal, built-in browser approval declined, domain-scoped search returning no links from the site). Stays open and keeps aging. |
| L-1 | Add `https://agenticcomplete.com/blog/` and `https://agenticcomplete.com/deploy-pulse.txt` to the `ac-publish-cycle` task file so live-URL verification enters the web-fetch provenance set | 2026-06-12 | **102 days** | `OPEN` | Raised in every publish log since `publish-2026-06-12`. Requires a one-line edit George must make; the system cannot add URLs to its own provenance set. |
| L-3 | Add an `ALERTS.md` rule for a scheduled run that fires and produces no artifact | 2026-08-18 | 35 days | `OPEN` | Defect 5, remediation item 2. Would have caught the 2026-08-14 miss on the morning of 08-14 rather than on 08-17. **Would also have caught the 2026-09-08 miss** (Defect 6) and the 2026-09-11 partial run (post committed, no newsletter, no report): eight heartbeats ran 09-08 through 09-11, each reported no anomalies. |
| L-4 | Wire this ledger into the six scheduled tasks: publish opens the next slot's entry before doing work, heartbeat reads open entries and escalates ones aged past two slots | 2026-08-21 | 32 days | `OPEN` | This file exists but nothing writes to it automatically. The heartbeat still does not read this file: L-10 sat with no recorded outcome from 09-08 through 09-15 and no heartbeat noticed. Every publish cycle since 2026-08-25 has opened its slot's entry by hand and committed it before drafting. The task prompts still do not read or write the file, so property 2 remains unmet by mechanism. |
| L-5 | Replace or fold `BACKLOG.md` into a planning document that can represent an owed post, not only an available topic | 2026-08-11 | 42 days | `OPEN` | Every P0 and P1 entry in `BACKLOG.md` is published; flagged stale in every publish log since 08-11 and carries no representation of an unmet obligation. |
| L-6 | A post is owed for the week of 2026-08-24, Tuesday slot (anchor) | 2026-08-25 | 28 days | `OPEN (unverified)` | Opened at run start, before drafting, per property 2. This is the first entry in this file created before the work rather than after it. `done-is-a-claim-about-evidence` committed to `master` (`0552902ffc6b`) and read back byte-identical; newsletter sent (campaign `99ab53801b`). Live-URL evidence not obtained, per L-1, so this entry stays open and keeps aging rather than closing weakly. |
| L-7 | A post is owed for the week of 2026-08-24, Friday slot (applied) | 2026-08-28 | 25 days | `OPEN (unverified)` | Opened at run start, before drafting, per property 2, and committed to `master` (`0bb10e13e3fb`) before any drafting began — the first entry whose pre-work state exists in the repository rather than only on the local disk of the run that wrote it. Outcome, same run: `success-code-is-a-self-report` committed to `master` (`137a6fbe6ee1`, posts.json `3569ce1617c5`) and read back byte-identical; newsletter sent (campaign `dd49390602`). Live-URL evidence not obtained, per L-1 (19th consecutive cycle), so this entry stays open and keeps aging. |
| L-8 | A post is owed for the week of 2026-08-31, Tuesday slot (anchor) | 2026-09-01 | 21 days | `OPEN (unverified)` | Opened at run start, before drafting, per property 2, and committed to `master` (`63bcfb75d83e`) before any drafting began. Outcome, same run: `when-one-model-checks-another` committed to `master` (`6399a0877142`, posts.json `b7413fa15459`) and read back byte-identical; newsletter sent (campaign `3c24c15770`). Live-URL evidence not obtained, per L-1 (20th consecutive cycle; this run also tried the built-in browser, which requires an interactive site approval no one was present to give). Stays open and keeps aging. |
| L-9 | A post is owed for the week of 2026-08-31, Friday slot (applied) | 2026-09-04 | 18 days | `OPEN (unverified)` | Opened at run start, before drafting, per property 2, and committed to `master` (`bbbe59b21e23`) before any drafting began. Outcome, same run: `allowed-to-act-not-allowed-to-look` committed to `master` (`d8a88f35b017`, posts.json `3a7c8cebf2b7`) and read back byte-identical; newsletter sent (campaign `26bc2a47ea`). Live-URL evidence not obtained, per L-1 (21st consecutive cycle; all three paths reproduced blocked this run: provenance refusal, built-in browser approval denial, domain search returning no links). Stays open and keeps aging. |
| L-10 | A post is owed for the week of 2026-09-07, Tuesday slot (anchor) | 2026-09-08 | 14 days | `OPEN (unverified)` | Opened at run start on 2026-09-08 and committed to `master` (`2a50ed4328be`, 05:11:17Z) before any drafting began. **That run then died: no post, no report, no newsletter, no further commit.** First entry in this file to outlive the run that wrote it. Nothing read it: five heartbeats (09-08 through 09-10) reported no anomalies (L-3, L-4 open). The 09-08 LinkedIn cycle noticed at 15:10Z but had no authority to act. Taken up by the 2026-09-11 Friday run as the week's anchor, per EDITORIAL.md. **Outcome, recorded 2026-09-15 by the next run because the 09-11 run also died partway:** `the-run-died-the-entry-didnt` committed to `master` at 05:23:18–24Z on 09-11 (`7f2a53d3a273` post, `03ceb1ca71a1`, `d99775d74f88`, `378cbc8bf577` posts.json / corrections). Then nothing: **no newsletter campaign was ever created (Mailchimp's last campaign remains `26bc2a47ea`, 09-04), no `publish-2026-09-11.md`, no ledger close.** The 09-11 LinkedIn cycle noticed at 15:10Z; no heartbeat did. Live-URL evidence not obtained (L-1). Stays open and keeps aging. See Defect 6. |
| L-12 | A post is owed for the week of 2026-09-14, Tuesday slot (anchor) | 2026-09-15 | 7 days | `OPEN (unverified)` | Opened at run start on 2026-09-15 and committed to `master` (`44aec49342c8`) before any drafting began, per property 2. Outcome, same run: `cron-is-the-wrong-shape` committed to `master` (`00feb59f81c5` post, `0c54fc4351d4` posts.json) and read back byte-identical; newsletter sent (campaign `3d92dfba20`, also carrying a link to the un-mailed 09-11 post). Live-URL evidence not obtained, per L-1 (23rd consecutive cycle; provenance refusal, built-in browser approval denial, domain search returning no links, all reproduced this run). Stays open and keeps aging. The post itself proposes the mechanism that would close L-4. |
| L-0b | A post is owed for the week of 2026-08-17, Tuesday slot | 2026-08-18 | 35 days | `OPEN (unverified)` | Reopened 2026-08-25. `schedule-is-not-a-work-queue` was committed to `master` and read back byte-identical, but the live-URL evidence property 3 specifies was never obtained. Previously carried `CLOSED (weak)`, which stopped its clock. |
| L-0c | A post is owed for the week of 2026-08-17, Friday slot | 2026-08-21 | 32 days | `OPEN (unverified)` | Reopened 2026-08-25, same reason as L-0b. `owed-work-ledger` committed and read back byte-identical; live-URL evidence unobtainable per L-1. |

## Closed

| # | Obligation | Opened | Closed | Evidence |
|---|---|---|---|---|
| L-0a | Build the owed-work ledger | 2026-08-18 | 2026-08-21 | This file, committed to `master`. Partial: the artifact exists, the mechanism does not — see L-4. |
| L-13 | A post is owed for the week of 2026-09-14, Friday slot (applied) | 2026-09-18 | 2026-09-18 | **`CLOSED` on the evidence property 3 specifies — the first entry in this file to do so**, after 23 consecutive cycles that could not obtain it. `record-cant-be-its-own-receipt` committed to `master` (`ca85976f225e` post, `6735ad2ab8fa` posts.json), read back byte-identical, and then **fetched from the live site**: `https://agenticcomplete.com/blog/record-cant-be-its-own-receipt` renders complete, with title, all four section headings, closing line and standing footer confirmed verbatim, and the post listed at the top of `/blog`. Provenance of this entry, which is the reason for Defect 7: it was opened on local disk at 2026-09-18 00:12 CDT by the scheduled run, in a row whose own note read "committed to `master` before any drafting began, per property 2." **No such commit was ever made** — that run died 1.2 seconds later, 142 seconds in, when the account session usage limit cut the turn off (`unhealthy_reason: api_error`, "You've hit your session limit · resets 3am"). The row asserted its own provenance and the assertion was false, so property 2 failed in a way this file could not detect from its own contents. Corrected and committed to `master` for the first time at `6ea3aef75c20` by a manually re-run cycle, before any drafting. Two caveats travel with this closure: the live-URL evidence came from a re-run environment whose fetch tool is not restricted to a provenance set, so **L-1 stays open** and the next scheduled cycle will fail verification exactly as the last 23 did; and the newsletter did not send, carried as **L-14**. See Defect 7 and `ops/reports/publish-2026-09-18.md`. |
| L-2 | Annotate the obsolete alert files in `ops/alerts/` as retired | 2026-08-11 | 2026-08-25 | `CLOSED`. Eight of the ten files in `ops/alerts/` now carry a dated RETIRED banner naming why each is obsolete (four Plausible, three deploy/lock superseded by Defect 4, one self-resolved email alert). Two remain genuinely open: `linkedin-post-failed-2026-06-12-15.md` and `publish-verify-hold-2026-06-12.md`. Evidence is the files themselves, which is the correct evidence class for a filesystem obligation and was obtainable, so this closes cleanly rather than as `OPEN (unverified)`. Aged 14 days across three publish logs before a cycle spent capacity on it. |

## Unfulfilled

| # | Obligation | Opened | Window closed | Note |
|---|---|---|---|---|
| L-11 | A post is owed for the week of 2026-09-07, Friday slot (applied) | 2026-09-11 | 2026-09-11 | The Tuesday anchor run (L-10) died after its ledger commit. The Friday run took the anchor instead, because EDITORIAL.md ranks the anchor above the applied post and the week had no post at all. One run produces one post, so the Friday applied slot cannot also be met. Week of 2026-09-07 stands at one post. |
| L-14 | The newsletter for `record-cant-be-its-own-receipt` (2026-09-18) is owed | 2026-09-18 | 2026-09-18 | **Waived by George**, the same day it opened, on being told the send had been blocked: "Don't worry about the email, it only goes to me." Recorded rather than deleted, and recorded as waived rather than met — no campaign for this post exists, and the newest Mailchimp campaign remains `3d92dfba20` (09-15). Origin: the 2026-09-18 manual re-run attempted the send per spec and the environment's permission classifier refused the outbound call before any request reached Mailchimp. This is **not** the Defect 4 failure mode — the system did not invent a hold rule, and did not route around the refusal. The distinction matters for the record: the obligation was met by the principal's decision to drop it, not by the system's judgment that it should be dropped. |
| L-00 | A post is owed for the week of 2026-08-10, Friday slot | 2026-08-14 (retroactive) | 2026-08-18 | The publish cycle fired at 2026-08-14T05:09Z and terminated without output. The week stands at one post. Not backfilled: Friday's post and Tuesday's post cannot both be Tuesday's. Entered retroactively, which is itself a violation of property 2 and the reason this file now exists. |

---

## Maintenance

Entries are added when a commitment is made — in a published post, a cycle
report, a correction, or a policy file — not when a run begins. Ages are
recomputed on read. An entry is never deleted; it moves to `Closed` or
`Unfulfilled`.

If this file is not updated by a cycle that made a commitment, that omission is
the same defect the file was built to catch, and belongs in `CORRECTIONS.md`.
