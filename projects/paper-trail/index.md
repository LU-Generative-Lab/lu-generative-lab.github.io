---
layout: default
title: Paper Trail
description: A lab protocol for computational work, and a small tool that enforces it.
---

# paper trail

Experimental scientists have long kept dated lab books, so that a result can be traced back to the work that produced it. Computational work often has no such record: a table or a figure is made by a script that has since changed, from data that has since moved, and a few months later it is hard to say which produced which. Paper Trail is a protocol for keeping that record, and a small command line tool that enforces it. The protocol was first written for a topological data analysis project; with Claude, I rebuilt it to work for any project, in any language.

## the five rules

1. Only through the trail: computations that produce results run through `papertrail run`, and there are no hand-made result tables.
2. Commit before computing: every run names the commit it ran at, and uncommitted code is refused, or recorded as such when the run is explicitly allowed.
3. Append, never edit: the ledger and the lab book only grow, and a correction is a new entry naming the one it supersedes.
4. One question, one lab book entry: closed within a set time of the last run (36 hours at the ledgered tier), and recording the question, inputs, commands, results with their checks, caveats, and what it supersedes.
5. Verify before sharing: `papertrail verify` passes before results go anywhere.

## how it works

```
papertrail init --tier ledgered --containment 1
papertrail entry "Refine n=13"
papertrail run --question "Refine n=13" --out results.csv -- python refine.py 13
papertrail entry --close labbook/2026-11-20-refine-n-13.md
papertrail verify --deep
papertrail anchor
```

Each run records the command, the commit, the hashes of the code, inputs, and outputs, and the environment. Each ledger entry contains the hash of the one before it, so changing, reordering, or deleting an earlier entry breaks every link after it, and `verify` says where. `verify --deep` goes further: it reruns each result-producing run in a scratch checkout of its own commit, and compares the outputs byte for byte.

The ledger's times are self-reported, and anyone with write access could rewrite the whole chain and recompute every hash. For dates that others can trust there is `anchor`, which stamps the head of the chain with OpenTimestamps (when the client is installed); since each entry includes the one before it, one stamp dates everything that came earlier. For a private note, `seal` records only its hash.

## two dials

Each project sets two dials: a rigor tier, for how much is recorded, and a containment level, for what may leave and who or what may see the inputs. Each setting switches on a standard set of rules and time windows, as biosafety levels do, and any single rule or window can be tuned in the project's configuration; every ledger entry records the settings in force when it was written.

| tier | adds |
|---|---|
| sketch | a lab book entry per question; nothing enforced |
| logged | runs go through `papertrail run`, with times |
| reproducible | commit before compute; environment recorded; `verify --deep` reruns |
| ledgered | outputs hashed and chained; verify before sharing |
| sealed | the chain head anchored with a trusted timestamp |

| level | name | in practice |
|---|---|---|
| 0 | open | everything may be public; data in git allowed |
| 1 | standard | data stays out of git; only hashes and manifests are committed |
| 2 | private | private repository; only hashes go public; sharing needs the owner's say-so |
| 3 | restricted | named people only; AI tools see only listed inputs; exports reviewed and logged |
| 4 | air-gapped | an offline machine; anything moved in or out is hashed on both sides |

The tool itself enforces the commit rule and warns about data in git and missing outputs; the containment rules above level 1 are commitments, for people and for Claude, which `papertrail check` displays.

## with Claude

Paper Trail comes with a Claude skill. At the start and end of a session Claude runs `papertrail check`, shows the five rules and the rules in force, works through the tool instead of around it, and says plainly when a step broke the protocol. A second skill, [Muscle Memory](/projects/muscle-memory/), notices when a step that Claude keeps reasoning out should become a tool.

## what's next

I would like to add two things. The first is clean-room builds: rebuilding a computation from a text alone (a paper, say), with every input locked and hashed, the plan registered before the run, and a gated channel that limits and counts what a person may tell the builder along the way. An allowlist controls what was supplied, not what a model or person already knew, and every record would say so. The second is a ledger of AI work: which models did which work, and at what cost in tokens where the surface reports them, with totals by model and by question.
