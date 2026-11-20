---
title: Writing a rule
description: How a check your senior analysts make by reflex becomes a rule the system applies to every asset.
audience: Analysts
order: 2
---

The rule is the unit of value in ArborSpace. This page explains where rules come from, what a rule is made of, and what happens once it fires.

## Where rules come from

Over the years, your senior engineers have seen the same traps come back from one engagement to the next. Each time, they learned a check that they now make by reflex. These checks live in their heads and in old reports.

Writing a rule means stating one of those checks explicitly, so it applies to every new plan, whoever does the review. A rule always starts as a sentence your experts would recognise, for example:

> Every planned outage duration is compared with similar outages already completed on the same model; any gap above 10% is flagged.

## Two kinds of rules

| Kind | When it runs | What it does |
|---|---|---|
| Reasoning | After the change is saved, asynchronously | Proposes a finding. It never blocks a write. |
| Transaction | Before the change is saved | Runs as part of the write itself. |

The rules on this page are reasoning rules: they suggest, and a person decides.

## What a rule is made of

| Part | What it says |
|---|---|
| Name and version | An identifier such as `R-rul-critical`, and a version (`v1`), so every finding can say exactly which rule produced it. |
| Scope | The class of assets it applies to, for example `SEC-ASSESSMENT`, or `*` for every class of asset. |
| Trigger | The change that makes the rule look: a field that changes, or a field that reaches a given value. |
| Conditions | What must also be true, for example a value below a threshold. Can be empty. |
| Produces | The type of finding it proposes. The type must exist in the ontology’s vocabulary. |
| Severity | How serious the finding is, for example `critical`. |
| Message | The sentence the reviewer sees. |

## Anatomy of a rule

`R-rul-critical` · v1 · scope `*` · reasoning

> When `remaining_useful_life_years` changes and `remaining_useful_life_years` < 1 → propose `immediate_refurbishment_recommended`.

In other words: as soon as the estimated remaining life of a piece of equipment drops below one year, ArborSpace suggests an immediate refurbishment, and a person decides. The `*` scope means it applies to every class of asset.

Each rule is stored in two forms:

```json
{
  "raw": {
    "query": {
      "plain": "The updated asset whose remaining_useful_life_years is below 1.",
      "predicates": ["asset.remaining_useful_life_years < 1"]
    },
    "action": {
      "kind": "derive",
      "plain": "Derive a critical finding — RUL below 1 year, immediate refurbishment recommended.",
      "finding_type": "immediate_refurbishment_recommended"
    },
    "trigger": {
      "event": "record_updated",
      "entity": "asset",
      "condition": "record.type = 'asset' AND field_changed = 'remaining_useful_life_years'"
    },
    "produces": ["immediate_refurbishment_recommended"]
  },
  "name": "Remaining useful life below threshold",
  "message": "Remaining useful life below threshold",
  "trigger": { "kind": "field_changed", "field": "remaining_useful_life_years" },
  "conditions": [
    { "kind": "field_comparison", "field": "remaining_useful_life_years", "op": "<", "value": 1 }
  ],
  "produces": ["immediate_refurbishment_recommended"],
  "severity": "critical"
}
```

- **`raw`** is the rule as it was published from the ontology, word for word, including its description in plain language. It is kept for audit and display: it is the provenance of the rule.
- **The rest** is the normalised, executable form. It is what the evaluator reads: the trigger, the conditions, the finding type it produces and its severity.

## Triggers: a change, or a transition

The trigger decides *when* a rule looks. There are two kinds.

**`field_changed`** fires on any change of the field. That is why `R-rul-critical` also needs a condition: the trigger only says “the remaining life has changed”, the condition checks that the new value is below 1.

**`field_transition`** fires only when a field *reaches* a given value. Here is `R-sec-verdict-fail`, scoped to the `SEC-ASSESSMENT` class:

```json
{
  "name": "Failed security assessment must surface",
  "message": "Security assessment verdict became 'fail'",
  "trigger": { "kind": "field_transition", "field": "verdict", "to": "fail" },
  "conditions": [],
  "produces": ["security_assessment_failed"],
  "severity": "critical"
}
```

It fires when the verdict becomes `fail`, including when an assessment is created directly with that verdict. A verdict that goes from `fail` to `pass` triggers nothing, and neither does a verdict saved again as `fail` without a change. The conditions are empty: reaching `fail` *is* the condition.

The intent is written in the rule itself: a failed security assessment is an incident, not an attribute edit. It must surface as a piece of work that can be traced, not stay buried in a field.

## What happens when a rule fires

Say the remaining useful life of an asset goes from 3 years to 0.5.

1. **The change is saved** normally. A reasoning rule never stands in the way of a write.
2. **The evaluator looks at the change**: the field has changed (the trigger matches) and 0.5 is below 1 (the condition holds).
3. **It checks the vocabulary**: the finding type `immediate_refurbishment_recommended` must exist in the ontology. If it does not, nothing is created and the event is logged.
4. **It creates a proposal**, pending review and linked to the asset, with its full provenance: the rule, its version, the domain, and a summary of what triggered it (“remaining_useful_life_years updated to 0.5”).
5. **The proposal lands in the review queue**, where an expert accepts or rejects it.

## No duplicates

A rule can fire many times on the same asset. Three cases decide what happens:

| What already exists for this rule and asset | What the rule does |
|---|---|
| A proposal pending review | Refreshes it with the latest trigger. No duplicate, even if the field changes ten times. |
| An accepted proposal whose finding is still open | Nothing: the subject is already being handled. |
| Only rejected proposals, or closed findings | Creates a new proposal: the situation has come back and deserves a fresh look. |

So if a verdict swings from `fail` to `pass` and back to `fail` while a proposal is open, there is still only one proposal. And when the remaining life goes from 0.8 to 0.5, the rule fires again (the field changed and stays below 1), but the existing proposal is refreshed rather than repeated.

## Starting with a pilot

In a pilot, the first two weeks are used to write the first fifteen rules, starting from three questions put to your experts. The following four apply them to your own engagements. [How the pilot works →](/resources/pilot)
