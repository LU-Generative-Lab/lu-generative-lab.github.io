---
name: Paper Trail
link: /projects/paper-trail/
people: Wöden Kusner
ai: Claude
status: in use
short: PT
order: 6
---
A lab protocol, and a small tool to enforce it, so that every research output can be traced back to whatever produced it. Computations go through `papertrail run`, which records the code, inputs, outputs, and environment in an append-only, hash-chained ledger, with a lab book of one entry per question. How strict to be is set on two dials (a rigor tier, and a containment level modeled loosely on biosafety levels), and `verify --deep` reruns the recorded work to check that it comes out the same, byte for byte. It was first written for a topological data analysis project, following the usual discovery that it is hard to reconstruct what one did after the fact.
