---
title: Writing a rule
description: How a check your senior analysts make by reflex becomes a rule the system applies to every asset.
audience: Analysts
order: 2
---

The rule is the unit of value in ArborSpace. This page explains where rules come from, what a good rule states, and what happens once it fires.

## Where rules come from

Over the years, your senior engineers have seen the same traps come back from one engagement to the next. Each time, they learned a check that they now make by reflex. These checks live in their heads and in old reports.

Writing a rule means stating one of those checks explicitly, so it applies to every new plan, whoever does the review.

## What a rule states

Each rule answers four questions:

| Question | What to write |
|---|---|
| What does it apply to? | The class of objects concerned, for example every planned outage on a gas turbine. |
| What does it check? | The comparison or condition, in the words your experts use. |
| When does it fire? | An explicit threshold, never “too long” or “unusual”. |
| What does it produce? | A finding, linked to the objects concerned and to the rule. |

Give each rule a name, so a finding can always say which rule produced it.

## Two examples

### An optimistic outage

> Every planned outage duration is compared with similar outages already completed on the same model; any gap above 10% is flagged.

- **Applies to:** every planned outage in the maintenance plan.
- **Checks:** the planned duration against completed outages of the same type, on the same turbine model.
- **Fires when:** the gap is above 10%.
- **At Alder Creek:** the 2027 inspection is planned at 12 days and 420 kUSD; the same inspection in 2025 took 15 days and cost 465 kUSD. The rule fires.

### A vibration threshold

> A vibration above 8.2 mm/s on a class 7F gas turbine generates a finding.

- **Applies to:** class 7F gas turbines.
- **Checks:** the measured vibration level.
- **Fires when:** it is above 8.2 mm/s.
- **Produces:** a finding linked to the asset, the site, the engagement and the lender concerned, along with the rule.

## Once a rule fires

The finding goes to the [review queue](/docs/concepts#review-queue). The engineer in charge sees where it comes from (the rule, the objects and the path between them) and decides whether it goes into the report. Approved or rejected, the decision is kept, and feeds the memory of the firm.

## Starting with a pilot

In a pilot, the first two weeks are used to write the first fifteen rules, starting from three questions put to your experts. The following four apply them to your own engagements. [How the pilot works →](/resources/pilot)
