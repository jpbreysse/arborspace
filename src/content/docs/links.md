---
title: Links
description: How to create a typed relationship between two assets, and how to choose between participates_in and contributed_to.
audience: Analysts
order: 2
---

A link is a typed relationship from one asset to another. Links are what let ArborSpace follow a path, from an inspection to its effect on the debt, or from a piece of software to the people who built it. See [Concepts](/docs/concepts#link).

## Creating a link

From an asset, choose **Add link**, then pick the relation type and the target asset. The relation types available are `participates_in`, `covers`, `uses`, `instance_of`, `made_by`, `holds` and `contributed_to`.

A link can also carry attributes, for example the `role` of a person in a project.

## participates_in or contributed_to

These two are the ones most often confused. The boundary fits in one sentence: `contributed_to` says “X helped build Y”; `participates_in` says “X has a role or a stake in Y”.

Two links pointing to the same project show the contrast:

```text
Anna —contributed_to→   Timesheet  {"role": "developer"}  ← built it
Ben  —participates_in→  Timesheet  {"role": "sponsor"}    ← has a stake, did not build it
```

### The four differences that matter

| | `participates_in` | `contributed_to` |
|---|---|---|
| Nature of the target | A context: an engagement, a project. Something that takes place. | A product of work: software, a document, a model, a project as a deliverable. Something that is made. |
| What it states | A stakeholder status: sponsor, lender, subject of the engagement… | A production fact, accomplished: developer, author… |
| Time | A current state, which can end: you leave an engagement. | An acquired fact, which stays true after you leave: a contributor remains a contributor. |
| Effect in questions | “Sites without an engagement”, the stakeholders of an engagement. | “Software without a contributor or developer”. The ⌘K search maps these names to the incoming link. |

### The test, when creating a link

Ask yourself: **did X have a hand in making Y?**

- **Yes** → `contributed_to`, and state the role in the link attributes: developer, designer…
- **No, but X is concerned, involved or a decision-maker** → `participates_in`, with its role: sponsor, lender, contact…
