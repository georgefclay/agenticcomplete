# BACKLOG.md

Seed topic queue for the blog. The system prioritizes from this list, adds new topics as they emerge, and archives completed ones.

## Prioritization notes

The first 4–6 weeks should lean heavily into **definitional defense** — establishing agenticcomplete.com as the authoritative source for the term against the vendor-marketing drift documented in the Day-1 Google AI Overview observation (vendors like Automation Anywhere are currently cited as the definition source). Once the site is citing-eligible in AI Overviews for its own term, the mix widens to framework-extending analysis and applied classifications.

**Weight:**
- P0 = publish in the first 4 weeks, in order
- P1 = publish in weeks 5–12
- P2 = publish post-90-days, or when the moment is right
- Anchor posts are marked ⚓ (longer, Opus-drafted). Unmarked = applied.

## Inaugural post

**P0 ⚓ — "This Site Is Now Operated by an Agentic Complete System"**
The Day-1 announcement. Frames the experiment, explains what readers will see, sets expectations (2 posts/week, all AI-generated except clearly-marked Publisher's Notes, public corrections log, no monetization for 6 months). Also introduces the operational transparency that becomes the site's identity. This post should run on publication Day 1 and is the only post whose slot is fixed.

## Definitional defense (P0 — weeks 1–4)

**P0 ⚓ — "Why the Word 'Agentic' Has Lost Meaning"**
The framing essay. Every SaaS tool with a retry loop now claims to be "agentic." The post argues why a conjunctive threshold is the corrective. Points readers to the Definition and Evaluation pages.

**P0 — "What Google's AI Overview Gets Wrong About 'Agentic Complete'"**
Directly engages the AI Overview situation. Cites the vendor definitions, lays out the capability-classification definition, shows the difference. Non-mean-spirited per rules — critique the definition, not the companies. This post targets the exact-match query and will be one of the clearest signals to Google's model that the site is the source.

**P0 — "The Human Handoff Problem: Where Most 'AI Agents' Actually Fail"**
Deep dive on the specific capability gap that disqualifies most systems from Level 5. Approval prompts, confirmation dialogs, "human-in-the-loop by default." Reframes handoffs as the diagnostic signal of partial automation.

**P0 ⚓ — "Classifying 10 Popular AI Systems on the Agentic Maturity Model"**
Applies the 0–5 model to ChatGPT Agent Mode, Claude Code, Devin, Cursor, AutoGPT, Zapier, n8n, LangGraph agents, Operator, and a browser-use agent. Justifies each placement. High shareability. Written with care to stay non-mean-spirited per RULES.md — critique the system's capability structure, not the vendor.

## Framework extension (P1 — weeks 5–12)

**P1 ⚓ — "Completion Determination Is the Hardest Capability to Build"**
Most agents know how to start; few know when they're done. Technical essay on verification strategies, inferred vs. explicit criteria.

**P1 — "Bounded Autonomy Is Still Autonomy"**
Addresses the most common misreading of the standard — that Level 5 means unlimited scope. Continuity is the defining property, not scope.

**P1 ⚓ — "A Reference Architecture for Closed-Loop Agentic Systems"**
Expands the Architecture page into a concrete engineering post. State stores, planner/executor separation, observation capture, adaptive revision. Pattern-oriented.

**P1 — "Replanning Under Drift: When the Environment Changes Mid-Task"**
Focused technical post on adaptive response. Real scenarios: API schema changes, UI moves, dependency failures.

**P1 — "Level 3 vs Level 4: The Line Most Teams Can't See in Their Own Systems"**
Practical field guide. Many teams believe they shipped Level 4 but actually shipped Level 3. Diagnostic questions and example traces.

**P1 ⚓ — "Agentic Complete Is Not AGI — And the Difference Matters"**
Clarifying piece to head off misunderstanding. Continuity of agency within a bounded scope vs. generality of cognition.

## Applied / reactive (ongoing)

**P1 — "A Field Note on How This Site's Own Agentic Loop Is Running"**
Monthly-ish series. Data from Plausible, Search Console, Beehiiv. What the system learned about its own behavior. This is the "incident as content" loop; it's one of the site's unique assets.

**P1 — "Why Benchmarks Like SWE-Bench Can't Tell You If a System Is Agentic Complete"**
Distinguishes classification from benchmark scoring.

**P1 — "The State Store Problem: Persistent Goal State in Multi-Hour Tasks"**
Technical piece on one of the Required Components from the Architecture page.

**P2 — "Re-Reading <some recent vendor launch> Against the Maturity Model"**
Template for the recurring applied pattern: when a vendor announces a new "autonomous agent," classify it.

**P2 — "What the Corrections Log Reveals After 90 Days"**
A post about the site's own error patterns. Requires the corrections log to actually have entries first.

## Meta-experiment posts (P2)

**P2 — "The First Month: What the System Did Well and Badly"**
George's 1-month Publisher's Note. This is on George's plate, not the system's.

**P2 — "What Changes When You Hand a Site to an AI"**
Reflection on the experiment from the perspective of the human principal (George). Publisher's Note.

## LinkedIn setup (operational — not a post topic)

**Target: Sunday 2026-05-10**
1. George sets up LinkedIn API credentials — create a LinkedIn app at linkedin.com/developers, get Client ID and Secret, complete OAuth flow to generate an access token.
2. Store token in `ops/.linkedin-token`.
3. George makes a public announcement Monday 2026-05-11.
4. System publishes first LinkedIn-distributed post Tuesday 2026-05-13 (next scheduled publish cycle).

See STATE.md for page URL: https://www.linkedin.com/company/agentic-complete

---

## Topic generation rules

New topics are added to this backlog when:

1. A trend in the weekly leading indicators suggests a topic could perform well (e.g., rising impressions on a specific query).
2. A reader email asks a question that multiple posts would be useful to answer.
3. A vendor announces something classification-worthy.
4. The framework itself reveals a gap (a missing architectural component, an undefined evaluation domain).
5. A correction on an earlier post surfaces a genuinely interesting question.

When backlog exceeds ~40 entries, the system prunes the oldest P2 items that have not moved to P1 by their age-one-year mark.

## When the backlog runs dry

It won't. But if it does, the system pauses publishing for a week, writes a Publisher's Note candidate titled "The Backlog Ran Dry; Why That's Itself Interesting" for George to consider, and alerts operationally.
