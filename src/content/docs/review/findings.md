---
title: Findings
description: Direct and derived findings, what each one carries, and why the difference matters.
audience: Analysts
order: 1
---

A finding is something worth knowing about an asset: a vibration above its alarm limit, an overdue inspection, a failed security assessment. ArborSpace has two kinds, and the findings list shows them side by side.

## Direct and derived

A **derived finding** is created by a rule from the data, not entered by a person. A **direct finding** is entered by a person.

| | Direct finding | Derived finding |
|---|---|---|
| Who creates it | A person | A rule |
| Example | “Bearing vibration 8.2 mm/s exceeds alarm limit (7.5 mm/s)”, type *inspection* | “Vibration alarm exceeded on ALDER-B1-GT2 (8.6 mm/s)”, badge *derived* · `R-gt-vibration-alarm` |
| Where its content comes from | What the person wrote | The `title_template` of the finding type, filled in with the asset’s values |
| What else it carries | Nothing in particular | Its provenance: rule, version, domain, triggering event |
| Validation | None before it exists | Goes through the Inbox: a person accepts or rejects it |

These two examples say the same thing about the plant: a vibration above 7.5 mm/s. The first is what an inspector observed two days ago. The second is what the system deduced, thirty seconds after `vibration_mm_s` was updated to 8.6.

## Why the difference matters

**Traceability.** For a derived finding, you can always answer “why does the system say this?”. The Inbox shows where it comes from:

```text
R-gt-vibration-alarm v1 · lie v1 · trigger: vibration_mm_s updated to 8.6
```

**Accountability.** The rule proposes, a person decides. As the Inbox puts it: a human accepts or rejects, and that decision is the record.

**Filtering.** The *Origin* filter of the findings list (all, direct, derived) separates what people saw from what the system deduced.

## Where derived findings come from

A derived finding is produced by a reasoning rule when it fires: the rule checks the change, the finding type must exist in the ontology’s vocabulary, and the proposal lands in the Inbox, pending review. See [Writing a rule](/docs/rules/writing-a-rule) for how rules are triggered, and how duplicates are avoided.
