# The Pitch — Fitzrovia Operational Intelligence Layer

*A spoken pitch (~4 minutes) with a leave-behind structure. Adapt freely.*

---

## The one-liner

**"Fitzrovia built the best rental buildings in Canada. I want to help you build the intelligence layer that proves it — and compounds it."**

## The setup (30 seconds)

You're vertically integrated: you develop, build, and operate your own buildings. That means you're sitting on something none of your competitors have — a closed feedback loop between how buildings *perform* and how the next ones get *designed*. Right now that loop runs on intuition and anecdote. Everything I'm about to show you turns it into measured data, and none of it replaces Yardi — it sits on top of it.

## What I built (60 seconds — walk the demos)

Six working tools, built in days, on synthetic data shaped around your actual portfolio — Elm-Ledbury, Sloane, Parker, Waverley, the Maddox and Loxley communities:

1. **Resident Sentiment Intelligence** — Google reviews, surveys, and service tickets fused into one blended score per community, with the topics that statistically drive satisfaction and churn.
2. **Work-Order Triage & Predictive Maintenance** — every incoming request auto-prioritized with a visible rationale, repeat faults bundled, and assets flagged *before* they fail.
3. **Operations Command Center** — occupancy, renewals, NOI vs budget, staffing in one pane, with a daily brief that tells a PM what actually matters today.
4. **Service Recovery Workbench** — the one I'd start with.
5. **Amenity Intelligence & Design ROI** — the one your investment committee will care about.
6. Plus the integration architecture showing how it all runs on your existing Yardi + access-control infrastructure.

## The three genuinely new things (90 seconds — this is the core)

**First: the resident-level join.** Yardi knows your leases. Google knows your reviews. Your fob system knows your amenity usage. Your survey tool knows your NPS. *Nothing connects them.* When you join those at the resident level, you can see that the resident in 2214 was a promoter eight months ago, has filed three elevator tickets since, just declined your renewal email, and represents $31k of annualized rent that a $400 intervention would probably save. Nobody sells this. Not Yardi, not the reputation-management vendors. It only exists if someone builds it on your data.

**Second: service recovery with guardrails.** Most retention tools spray concessions. This one triggers only on *verified service failures* — an SLA breach, a repeat fault, a billing error — never on complaint volume, so you're rewarding residents you failed, not residents who complain loudest. Every play shows its cost against the revenue at risk, and every action is logged. The math: an average recovery play costs ~$300; an average turn costs ~$6,000. Retention is the cheapest revenue in this business.

**Third — and this is the Fitzrovia-specific one: the feed-forward loop.** Your fob readers already record every gym entry, every pool visit — and throw the data away. Captured and joined to rent and renewal outcomes, it tells you what each amenity actually earns: what it costs per use, what premium it commands, whether its users renew more. Then that evidence feeds the *next* building. Rushden Station, 135 St. Clair, Primrose Hill — every amenity decision in those designs can be backed by operating data from the nineteen buildings you already run. And to be clear about the philosophy: this is not about cutting luxury. Low usage doesn't mean low value — residents pay for what a building says about them. When a prestige amenity underperforms on *both* usage and premium, the answer is to rotate the concept — F1 simulator, ski simulator — not to downgrade the program. Data picks *which* luxury earns its floor plate. Only a vertically-integrated developer can close this loop. It's your structural advantage; this makes it operational.

## Why this isn't a Yardi module (30 seconds)

Yardi's new AI suite is real and good — photo-diagnosis on work orders, leasing agents, forecasting. Where it's strong, we write back to it and keep it the system of record. But Yardi will never fuse your Google reviews with your fob logs and your design pipeline, because that product only makes sense for an owner-builder-operator. Generic software serves the average operator. You're not average — that's the entire brand.

## The ask (30 seconds)

Two weeks, one building, zero IT lift. Give me a work-order and rent-roll export from one community — I'd suggest Parker — and read access to your Google reviews, and I'll hand you these dashboards running on real data. No API keys, no procurement, no risk. If the outputs match your PMs' reality, we talk about a proper pilot. If they don't, you've spent two weeks and a CSV.

---

## Objection quick-reference (for Q&A)

- **"We have Yardi Virtuoso."** — Keep it. This layer does the three things above that Virtuoso structurally can't; where Virtuoso is strong we integrate, not compete.
- **"Privacy?"** — Canadian data residency, pseudonymized credentials, aggregate-by-default amenity reporting, PIPEDA/Law 25 designed in from day one, review-matching always human-confirmed. And recovery is framed as fixing our failures — defensible in any headline.
- **"You're one person."** — That's why the ask is a two-week CSV pilot, not a contract. The demos you're looking at were built in days; judge the velocity, then decide what it's worth.
- **"Our amenity intuition is fine."** — It probably is. This tells you *which* intuitions are right, with numbers you can put in an IC memo.

*All demo data is synthetic. Figures shown are illustrative models pending real data.*
