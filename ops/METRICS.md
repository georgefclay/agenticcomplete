# METRICS.md

What the system measures, what targets it optimizes against, and where the data comes from.

## Targets

| Milestone | Target | Starting point |
|---|---|---|
| Day 90 | 50 unique visitors/day | ~0 (5 impressions, 2 clicks at start) |
| Month 6 | 200 unique visitors/day | — |

These are the north-star metrics. Everything else is a leading indicator.

## Leading indicators (tracked weekly)

Visitor counts lag the real signals by weeks. The following move earlier and are checked every week:

**Search signal (Google Search Console)**
- Total impressions for the week
- Total clicks for the week
- Average SERP position for tracked queries ("agentic complete," "agentic maturity model," "evaluation autonomous systems," etc.)
- Click-through rate on SERP
- Count of indexed pages

**Content reach (Plausible)**
- Unique visitors per post (rolling 7-day)
- Top-performing posts of the week
- Referring domains
- Average session duration on posts over 1,000 words

**Newsletter (Beehiiv)**
- New subscribers this week
- Open rate on the most recent issue
- Click-through rate from newsletter to site

**LinkedIn (Company Page)**
- New followers this week
- Impressions on posts
- Engagement rate (reactions + comments + reshares per impression)

**Quality signals**
- Count of inbound contact-form messages / emails that are substantive (not spam)
- Count of external sites linking to agenticcomplete.com (from Search Console or manual check)
- Mentions of "agentic complete" on the web that cite the site vs. cite vendor definitions

## Data sources and access

- **Google Search Console** — primary source for impressions, clicks, indexed pages, search position. Requires site verification. Free.
- **Plausible Analytics** — primary source for on-site behavior. Script added to the site. ~$9/month.
- **Beehiiv** — newsletter stats via their API or dashboard. Free tier.
- **LinkedIn Company Page Analytics** — built-in, API access for Page admins.
- **Manual: Google search for `"agentic complete"`** — checked weekly to see who is citing the site vs. competing definitions.

## First-signal milestones

Before the 50-visitor/day target is hit, the following are the earliest signs the flywheel is engaging:

1. **Week 2:** At least one blog post indexed by Google.
2. **Week 3–4:** Weekly impressions cross 100 (up from ~5).
3. **Week 6:** First week with 100+ clicks from search.
4. **Week 8:** First external backlink that wasn't from George.
5. **Week 10:** First reader email that is not spam and not from George.
6. **Week 12:** 50 visitors/day target evaluation.

If any of these milestones slips by 2+ weeks, an ALERT-OPERATIONAL fires and the strategy is revisited.

## Weekly report (internal)

Every Monday, a file is written to `reports/YYYY-MM-DD-weekly.md` containing:

1. This week's leading indicators (all of the above).
2. What the system published this week.
3. What distribution actions it took (LinkedIn posts, newsletter issues).
4. What it observed and what it plans to change for next week.

This is the adaptive loop per the Evaluation framework. Without this file being produced weekly, the system is not closed-loop.

## Monthly report (internal)

On the 1st of each month, a file is written to `reports/YYYY-MM-monthly.md` consolidating the four weekly reports, listing all alerts raised, accounting for API spend by category, and describing what the system changed in its behavior over the month. The monthly report is the raw material for George's public 1/3/6-month retrospectives.

## What success looks like at 6 months

- 200 visitors/day sustained.
- 100+ newsletter subscribers.
- 500+ LinkedIn Company Page followers.
- 40+ published posts, of which at least 8 are anchor posts cited somewhere externally.
- The site cited by Google's AI Overview for `"agentic complete"` alongside or instead of vendor definitions.
- Corrections log populated but short (< 5% of posts corrected).
- George's 6-month retrospective published.

## What failure looks like at 6 months

- <50 visitors/day sustained.
- Vendor definitions still dominate AI Overviews.
- Corrections log disproportionately large.
- No external citations.
- Newsletter subscriber count negligible.

Failure here is useful — the 6-month retrospective becomes an honest post-mortem instead of a victory lap. Either outcome is publishable.
