# BUDGET.md

Token budget and operating costs for AgenticComplete.com.

## Hard cap

**$50 per month** in API/token spend. This is enforced by the scheduled-task runner, not trusted to the system's judgment. At the cap, scheduled runs pause until the next billing period.

If the system forecasts it will exceed the cap mid-month, it throttles (shortens applied posts, defers deep research) before the cap is hit. An ALERT-OPERATIONAL fires when the month-to-date forecast exceeds $45.

## Model selection

- **Sonnet** — default for all work. Weekly analytics, email check, applied posts, self-review, correction handling, backlog prioritization.
- **Opus** — reserved for anchor posts (the 1,500–2,500 word flagship piece once per week) and for genuinely hard reasoning tasks where Sonnet produces a noticeably weaker draft.
- **Haiku** — optional for very cheap operations (log parsing, simple classification).

The ratio of Opus to Sonnet usage is tracked in the monthly report.

## Expected monthly cost breakdown (rough)

This is a forecast, not a commitment. Actuals are logged monthly.

| Operation | Model | Est. tokens/month | Est. cost |
|---|---|---|---|
| 4 anchor posts × research + draft + review | Opus | ~1.5M in / 40K out | ~$25 |
| 4 applied posts × research + draft + review | Sonnet | ~400K in / 30K out | ~$2 |
| Weekly analytics + reporting | Sonnet | ~100K in / 20K out | ~$0.60 |
| Daily email triage (× ~60 runs) | Sonnet | ~200K in / 30K out | ~$1 |
| Monthly internal report | Sonnet | ~100K in / 20K out | ~$0.60 |
| Headroom / unexpected work |  |  | ~$20 |
| **Total** |  |  | **~$50** |

Note: these estimates will be wrong. The real numbers go in the monthly report, and the forecast is recalibrated each month based on actuals.

## Platform subscriptions (outside the $50 API cap)

These are not token costs, but they affect the total project burn. George pays these directly; they are tracked in the monthly report for completeness.

| Service | Cost | Purpose |
|---|---|---|
| Google Workspace (`editor@agenticcomplete.com`) | ~$6/month | Operational email |
| Beehiiv (starter tier) | $0/month to start, paid tier later if subscribers warrant | Newsletter |
| Plausible Analytics | $9/month | Traffic analytics |
| Mac Mini electricity | Negligible | Hosting the runtime |
| Domain renewal | Annual, amortized | Ownership of agenticcomplete.com |
| **Approximate monthly fixed** | **~$15** | |

Total project burn: ~$65/month including platforms. Over 6 months: ~$390. This is the cost of the experiment.

## Spending rules

1. **No spending the system can do on its own beyond the $50 API cap.** New platform subscriptions, new tools, upgraded tiers — all require George's approval.
2. **Pause before degrade.** If a given week's publishing would push the budget over, the system publishes fewer posts rather than lower-quality posts.
3. **Log every dollar.** The monthly report includes a line-item accounting of API spend by category (anchor drafting, applied drafting, analytics, email, reporting, other).
4. **Flag trends.** If a category is growing month-over-month without a corresponding improvement in output, note it in the monthly report and propose an adjustment.

## Monetization pre-commitment

The system may not introduce any form of monetization — ads, sponsorships, affiliate links, paid subscriptions, paid placements — before the 6-month retrospective publishes. This is a hard rule, repeated here and in RULES.md. Re-evaluated by George after the 6-month post.

## If the budget proves inadequate

If the 6-month retrospective concludes $50/month is insufficient for the quality bar the experiment requires, budget adjustment is a topic for George to decide at that time. Until then: the system lives within the cap.
