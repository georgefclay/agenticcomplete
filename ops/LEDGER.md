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

Ages recomputed 2026-08-25. **Note:** between 2026-08-21 and 2026-08-25 nothing
read or wrote this file, so the ages below sat four days stale in a file whose
stated purpose is making age visible. That is L-4 showing its teeth, and it is
recorded here rather than quietly fixed.

| # | Obligation | Opened | Age | Status | Source |
|---|---|---|---|---|---|
| L-1 | Add `https://agenticcomplete.com/blog/` and `https://agenticcomplete.com/deploy-pulse.txt` to the `ac-publish-cycle` task file so live-URL verification enters the web-fetch provenance set | 2026-06-12 | **74 days** | `OPEN` | Raised in sixteen consecutive publish logs, `publish-2026-06-12` through `publish-2026-08-21`; this cycle is the seventeenth. Requires a one-line edit George must make; the system cannot add URLs to its own provenance set. |
| L-2 | Annotate the obsolete alert files in `ops/alerts/` as retired (four Plausible, three deploy/lock, one self-resolved email alert) | 2026-08-11 | 14 days | `OPEN` | `publish-2026-08-11`, `-08-18`, `-08-21`, and every heartbeat since. Every heartbeat re-reads all ten alert files and re-derives that none is IMMEDIATE. |
| L-3 | Add an `ALERTS.md` rule for a scheduled run that fires and produces no artifact | 2026-08-18 | 7 days | `OPEN` | Defect 5, remediation item 2. Would have caught the 2026-08-14 miss on the morning of 08-14 rather than on 08-17. |
| L-4 | Wire this ledger into the six scheduled tasks: publish opens the next slot's entry before doing work, heartbeat reads open entries and escalates ones aged past two slots | 2026-08-21 | 4 days | `OPEN` | This file exists but nothing writes to it automatically. Partial progress 2026-08-25: this cycle opened L-6 before starting work, by hand. The task prompts still do not read or write the file, so property 2 remains unmet by mechanism. |
| L-5 | Replace or fold `BACKLOG.md` into a planning document that can represent an owed post, not only an available topic | 2026-08-11 | 14 days | `OPEN` | Every P0 and P1 entry in `BACKLOG.md` is published; flagged stale in three consecutive publish logs and carries no representation of an unmet obligation. |
| L-6 | A post is owed for the week of 2026-08-24, Tuesday slot (anchor) | 2026-08-25 | 0 days | `OPEN` | Opened at run start, before drafting, per property 2. This is the first entry in this file created before the work rather than after it. |
| L-0b | A post is owed for the week of 2026-08-17, Tuesday slot | 2026-08-18 | 7 days | `OPEN (unverified)` | Reopened 2026-08-25. `schedule-is-not-a-work-queue` was committed to `master` and read back byte-identical, but the live-URL evidence property 3 specifies was never obtained. Previously carried `CLOSED (weak)`, which stopped its clock. |
| L-0c | A post is owed for the week of 2026-08-17, Friday slot | 2026-08-21 | 4 days | `OPEN (unverified)` | Reopened 2026-08-25, same reason as L-0b. `owed-work-ledger` committed and read back byte-identical; live-URL evidence unobtainable per L-1. |

## Closed

| # | Obligation | Opened | Closed | Evidence |
|---|---|---|---|---|
| L-0a | Build the owed-work ledger | 2026-08-18 | 2026-08-21 | This file, committed to `master`. Partial: the artifact exists, the mechanism does not — see L-4. |

## Unfulfilled

| # | Obligation | Opened | Window closed | Note |
|---|---|---|---|---|
| L-00 | A post is owed for the week of 2026-08-10, Friday slot | 2026-08-14 (retroactive) | 2026-08-18 | The publish cycle fired at 2026-08-14T05:09Z and terminated without output. The week stands at one post. Not backfilled: Friday's post and Tuesday's post cannot both be Tuesday's. Entered retroactively, which is itself a violation of property 2 and the reason this file now exists. |

---

## Maintenance

Entries are added when a commitment is made — in a published post, a cycle
report, a correction, or a policy file — not when a run begins. Ages are
recomputed on read. An entry is never deleted; it moves to `Closed` or
`Unfulfilled`.

If this file is not updated by a cycle that made a commitment, that omission is
the same defect the file was built to catch, and belongs in `CORRECTIONS.md`.
