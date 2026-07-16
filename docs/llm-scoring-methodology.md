# LLM Feedback Scoring — Methodology

*The "math" behind the LLM layer. Unlike a regression, an LLM scorer has no coefficient table — its rigor comes from the contract around it: a fixed prompt, a fixed output schema, deterministic settings, and measured agreement with human judgment.*

## 1. What it does

Free text in, fixed structure out. Every review, survey verbatim, and ticket description passes through one scoring call and comes back as:

```json
{
  "sentiment": -0.7,
  "topics": ["elevator", "communication"],
  "severity": "high",
  "churn_signal": true,
  "routing": "property_manager",
  "summary": "Repeat elevator delays, broken promises, renewal at risk"
}
```

These structured fields are what every downstream system consumes. The renewal model (Lab 01) takes `sentiment` as a numeric feature. The Service Recovery Workbench triggers on `churn_signal` + a verified failure. The sentiment dashboard aggregates `topics` into the satisfaction-driver chart. The LLM is a *parser of human language into features* — the statistics happen downstream.

## 2. Why an LLM and not a classical sentiment model

Classical sentiment tools (word-list or small-model based) fail on exactly the cases that matter in housing: "love the unit BUT the elevator..." (mixed), sarcasm ("great, third flood this year"), French input, and topic attribution ("slow management" — is that maintenance speed or communication?). An LLM handles all four reliably and — critically — can apply *operator-specific judgment* encoded in the prompt, like the conservative churn rule below.

## 3. The contract (this is the spec)

**Fixed prompt.** The exact system prompt ships in `api/score.js`. It defines the schema, a **closed topic taxonomy** (14 values — so topics aggregate cleanly instead of producing a thousand free-text variants), and judgment rules:

- `churn_signal` is `true` **only** on explicit leaving intent or unresolved repeat failure — not general grumpiness. False positives here waste PM time and erode trust in the system.
- Ambiguity fails conservative: `severity: "low"`, `churn_signal: false`.
- Non-English input is scored in place (no separate translation step).

**Determinism.** `temperature: 0` — the same text always produces the same score. This matters for auditability: a score can be reproduced later by rerunning the same input.

**Schema enforcement.** The response must be parseable JSON matching the schema; anything else is rejected and retried once, then flagged for human review. In production this uses the API's structured-output/tool-schema feature rather than string parsing.

## 4. Evaluation — how we know it works

There is no R² for an LLM scorer. The equivalent discipline:

1. **Golden set.** ~300 real feedback items, hand-labeled by a human (ideally a Fitzrovia PM — their judgment is the ground truth we want to match).
2. **Agreement metrics.** Sentiment: mean absolute error vs human score (target ≤ 0.2). Topics: F1 per topic (target ≥ 0.85 on frequent topics). Churn signal: precision matters more than recall (target precision ≥ 0.9 — when the system says churn risk, it must usually be right).
3. **Disagreement review.** Every case where the model and human disagree gets read. Systematic misses become prompt rules (e.g., "package room complaints are `other`, not `amenities`").
4. **Drift monitoring.** 2% of production scores are routed to a human weekly. If agreement drops (new slang, new issue types, model version change), the golden set grows and the prompt is revised. Every prompt version is stored with its eval scores — prompt changes are treated like code releases.

## 5. Cost & latency

Scoring uses a small fast model (Haiku class). A 200-word review ≈ 350 input + 150 output tokens ≈ **well under a cent per item**. Fitzrovia-scale volume (~1,300 feedback items/month) costs a few dollars per month. Latency ~1s; the pipeline scores in nightly batches anyway.

## 6. Privacy

Text sent for scoring is stripped of names/emails/phone numbers first (regex + a local NER pass). API calls use a no-training/zero-retention configuration. Scores are stored keyed to pseudonymous resident IDs, per the same PIPEDA / Quebec Law 25 posture as the rest of the pipeline.

## 7. Failure modes, honestly

- **Taxonomy blind spots:** issues outside the 14 topics land in `other`; quarterly review of the `other` bucket catches emerging categories.
- **Long mixed texts:** one score per item is coarse; production splits multi-issue texts into clauses and scores each.
- **Model version drift:** a provider model update can shift scores subtly — the golden set is rerun on every version change before switching.
- **It's a component, not an oracle:** the LLM proposes; guardrails and PMs dispose. No concession, dispatch, or resident contact happens on an LLM output alone.
