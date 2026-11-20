---
title: Concepts
description: The few words you need to read ArborSpace, from the ontology to the review queue.
audience: Analysts
order: 1
---

ArborSpace captures what your experts know in a form the system can apply and your teams can review. Seven words are enough to follow how it works.

## Ontology

The ontology is an operational layer for the organisation. It sits on top of the data already integrated and holds the objects of your business, the links between them, and the logic that applies to them. It is built from the firm’s own vocabulary.

It has three layers:

1. **The vocabulary:** what exists (assets, engagements, parties).
2. **The links:** how it holds together.
3. **The rules:** what a senior engineer checks.

## Object

An object is one thing your experts talk about: a site, a gas turbine, a steam turbine, an engagement, a lender. Each object belongs to a class (for example *gas turbine*) and carries its own properties (hour counters, last inspection, capacity).

The classes are data, not a fixed IT model: the firm evolves them itself.

## Link

A link is a typed relation between two objects. Links are never confused with one another:

- “GT1 feeds HRSG1” is a **physical** link.
- “GT1 is a 7F model” is a **manufacturer** link.
- “The engagement covers the site” and “the lender finances the project” are **contractual and financial** links.

Links are what lead from an inspection to its effect on the debt.

## Rule

A rule is a piece of expert knowledge written down explicitly, which the system applies and anyone can review. For example: “every planned outage duration is compared with similar outages already completed on the same model; any gap above 10% is flagged.”

Rules are declarative and inspectable. See [Writing a rule](/docs/writing-a-rule).

## Finding

A finding is what a rule produces when it fires. It is linked to the objects concerned (the asset, the site, the engagement, the lender) and to the rule that produced it.

A finding is a proposal, not a conclusion: an engineer validates it.

## Path

The path is the chain of links that connects a finding to its sources. It is what lets anyone go from a number back to the turbine, the maintenance record and the rule.

At Alder Creek, a line in the maintenance plan (“GT1 inspection, 12 days”) says nothing on its own. The path GT1 → heat recovery steam generator → shared steam turbine shows that the unit loses 306 MW, not a third of its output. No document in the data room contains this path; the ontology does.

## Review queue

Every finding arrives in a review queue. The expert approves or rejects it, and that decision feeds the memory of the firm. A similarity engine also matches each case with the firm’s previous ones, so past decisions inform the next review.
