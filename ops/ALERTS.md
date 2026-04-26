# ALERTS.md

When the system escalates to George, and how.

## Principle

Agentic Complete operation means no handoffs for normal work. An alert is the explicit exception: it signals that normal autonomous operation has encountered a condition that genuinely requires the human principal's attention.

Alerts should be rare. A system that alerts constantly is not autonomous; a system that never alerts when it should is unsafe. The rules below define the boundary.

## What triggers an alert

### Immediate alerts (act within 2 hours)

- **Threats.** Any message (via `editor@agenticcomplete.com`, the contact form, or any connected channel) containing a threat against George, the system, or a third party.
- **Credible legal threats.** Cease-and-desist language, DMCA claims, defamation claims, or anything from a lawyer.
- **Content involving minors.** Any inbound message or content that references, involves, or is directed at a minor in any sensitive context.
- **Security probes.** Evidence that someone is attempting to compromise the system, hosting, email account, or linked services.
- **Self-harm signals.** A reader message suggesting the reader is in crisis or considering self-harm.
- **Defamation or serious-rules violation in a published post.** If the system discovers after the fact that it published something that crosses RULES.md in a material way.

### Operational alerts (act within 24 hours)

- **Budget will exceed $50/month.** Forecast burn based on week-to-date actuals.
- **Heartbeat missed.** If the system has not successfully run its scheduled loop for more than 48 hours, an alert fires on recovery.
- **Repeated task failures.** Any scheduled task that has failed 3+ consecutive runs.
- **Site outage detected.** If a health check shows the site is unreachable.
- **Platform auth expired.** Beehiiv, LinkedIn, Google Workspace, Plausible, or any connected service.
- **Search Console flags.** Manual actions, security issues, significant ranking loss.

### Soft alerts (logged, not emailed)

Logged to `/alerts/` in the repo but not emailed to George. He sees these when he checks in.

- A post was rewritten more than twice during self-review.
- A topic was dropped from the backlog because it couldn't pass rules-check.
- A reader email requires a response but is not urgent.
- Weekly metrics are off target.

## How alerts are delivered

**Email to George** at his personal address (the address on file, not `editor@agenticcomplete.com`). Subject line convention:

- `[ALERT-IMMEDIATE] <short description>` — for immediate alerts
- `[ALERT-OPERATIONAL] <short description>` — for operational alerts

Body contains: what happened, when, what the system has done about it, what the system plans to do next, whether George's input is required.

**File in `/alerts/`** at the repo. Every alert (immediate, operational, or soft) is written to a timestamped markdown file in `alerts/YYYY-MM-DD-brief-description.md`. The file is the system's audit trail.

## What the system does after raising an alert

**Immediate alerts:** Pause the relevant behavior. If the alert is about a published post, pull or annotate the post per CORRECTIONS.md. If the alert is about an inbound message, do not reply. Wait for George.

**Operational alerts:** Continue operating if safe to do so. Log the issue. Retry where appropriate. If the alert is a budget warning, throttle publishing before the cap is hit.

**Soft alerts:** Continue normal operation. The alert is a flag for the weekly and monthly reports.

## What the system does *not* treat as an alert

- Normal reader disagreement, negative feedback, or critique. These are content, not alerts.
- Harsh-but-not-threatening language from readers. Reply normally or ignore.
- Unexpected low traffic weeks. Logged in the monthly report, not alerted.
- A Publisher's Note from George that disagrees with a system post. That's designed behavior.
- Routine platform API errors that retry successfully.

## Review cadence

Monthly report summarizes all alerts raised in the month (immediate, operational, and soft). This gives both the system and George visibility into whether the alert bar is set correctly — alerting too often, not often enough, or about the wrong things.
