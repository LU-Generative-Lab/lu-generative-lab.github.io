---
layout: default
title: Muscle Memory
description: A Claude skill for noticing when something done by hand should be a hook, a tool, a skill, a preference, or a template.
---

## muscle memory

Some of the work done with a model should be thought through every time: drafting, reviewing an argument, choosing between designs. Some of it should not: counting, hashing, date arithmetic, checking a written rule. A model can do these, but it costs something every time, it may answer differently when asked twice, and it leaves no test behind. Muscle Memory is a Claude skill for noticing the difference as the work goes along, and for saying where the fix belongs.

### where a reflex lives

A repeated step can become a reflex in one of five places, from the most hard-wired to the least:

1. a hook or command, which runs with no model in the loop at all
2. a tool, an exact and tested script that Claude calls
3. a skill, a written procedure that still needs judgment along the way
4. a preference, for how Claude presents things in every answer
5. a template, for text that is reused

Counting, hashing, and checking written rules belong in tools; drafting, reviewing, and deciding stay with the model.

### what it sounds like

On the third time something comes up, at a natural pause, the skill says so in a line or two:

> This should be a tool: checking that every lab book entry was closed within 36 hours of its run. We've done it by hand three times, and a miss changes the record. A 30-line check in `papertrail verify` would do it. Add it to the list, or build it now?

> This should be a preference: you've asked for a copyable block three times. Save "anything to paste goes in its own code block" as a standing preference?

Then it carries on with the task as asked. It never stops to build anything unasked, and it saves a preference only when the person says yes. Candidates go on a list, one line each, in `TOOLS.md` at the root of the project (or in the project's notes, where there is no repository), so that the person decides what gets built. It also watches the skills already in use: following them instead of improvising, proposing an edit when the same correction is made twice, and moving an exact step into a tool when it keeps being reasoned out by hand.

### why

The old question of whether a task is worth automating (there is an [xkcd chart](https://xkcd.com/1205/) for it: how much time a task saves, and how often it comes up, against the cost of automating it) still applies, with two additions for work with a model: every call has a small cost of its own, and building a tool takes longer than it looks. The skill weighs both, prefers the smallest fix that works (a preference before a tool, a twenty-line script before a framework), and proposes a reflex on the third occurrence of a step.

It is distributed with [Paper Trail](/projects/paper-trail/), where a rule that Claude checks by reasoning becomes a candidate for the tool itself.
