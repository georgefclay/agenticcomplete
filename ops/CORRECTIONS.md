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
