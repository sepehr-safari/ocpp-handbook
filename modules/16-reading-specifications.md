# Module 16: Reading specifications and tracking the frontier

Module 15 handed you a map of the open-source ecosystem, and every entry on that map will age. Projects go quiet, maintainers move on, and in a few years parts of that module will read like a snapshot. This module teaches the skill that does not age: opening a specification bundle and finding the answer yourself, knowing whether it is still current, and following the protocol's evolution from primary sources. Module 0 gave the principle as advice: read originals, mind the errata. Here it becomes technique.

There is a second reason to care. Module 3 established the gap between certified and correct, and Module 13 showed it on the wire. When two engineers disagree about what a station should do, the argument ends at a requirement id and an errata check, not at whoever remembers the spec more confidently.

## What you'll learn

- What each part of an OCPP 2.x specification bundle contains, and where to look for a given question
- How a 2.0.1 use case is structured, and how to read a requirements table and resolve a precondition chain
- How editions and errata documents relate, and the two-step check that settles most requirement disputes
- Why the JSON schemas are the fastest truth for field-level questions, and where that shortcut has a caveat
- A short list of primary channels for tracking OCPP, ISO 15118, and the regulations without chasing news
- Where contributions go: errata reports, issues on open projects, and independent implementations

## The shape of a spec bundle

Register at the Open Charge Alliance site, download OCPP 2.0.1, and you get a folder of documents, not one PDF. The bundle is organized into seven numbered parts, and the split is documented in the introduction itself (OCPP 2.0.1 Part 0, section 3.1). OCPP 2.1 mirrors the structure exactly. Knowing what lives where makes a specification whose main part runs 491 printed pages navigable.

| Part | Document | Go there for |
| --- | --- | --- |
| Part 0 | Introduction | Version history, the documentation structure, a full index of every use case, and an informative chapter sketching a minimum message set |
| Part 1 | Architecture and topology | The three-tier model, the device model (components, variables, attributes, monitoring), EVSE and connector numbering, supported network topologies |
| Part 2 | Specification | The functional blocks, A (Security) through P (DataTransfer), each with use cases and requirements; messages, data types, and referenced components and variables collected at the end |
| Part 2 appendices | Separate document | Security events, standardized units of measure, standardized components and variables, reason codes |
| Part 3 | JSON schemas (a zip) | One schema file per message: the machine-readable truth about fields, types, and what is required |
| Part 4 | JSON implementation guide | The WebSocket transport: framing, connection rules, the 2.x counterpart of the OCPP-J material from Module 6 |
| Part 5 | Certification profiles | Which requirements and components make up each certification profile, the optional feature lists, the Protocol Implementation Conformance Statement (PICS) questionnaire |
| Part 6 | Test cases | The procedures used in certification, with ids like TC_A_20_CS |

Two details make the bundle friendlier. The appendix data also ships as machine-readable CSV files (components, variables, reason codes, security events, units of measure), so the standardized device model is greppable, not just readable. And 2.1 keeps the seven-part shape while Part 2 grows three new functional blocks: Q for bidirectional power transfer, R for DER control, S for battery swapping.

OCPP 1.6 predates all of this and is packaged differently: one main document holding introduction, operations, messages, types, and configuration keys, paired with a transport companion, the OCPP-J or OCPP-S specification (OCPP 1.6 edition 2, section 3.2). The SOAP transport ended there; 2.0.1 dropped it entirely (OCPP 2.0.1 Part 0, section 2.7.2).

The practical routing rule: field questions go to Part 3, behavior questions to a Part 2 use case, transport questions to Part 4, certification-scope questions to Part 5, and what-is-current questions to Part 0's version history.

## How to read a use case

Part 2 is written to a template, and the template is not OCA's invention: the use cases follow IEC 62559-2, a standard for writing use cases (OCPP 2.0.1 Part 0, section 3.1). Read one carefully and you can read all of them fast. The worked example here is B01, Cold Boot Charging Station (OCPP 2.0.1 Part 2, use case B01).

A use case opens with a numbered table: name, id, objectives, description, actors, a scenario in numbered steps, pointers to alternative scenarios (sibling use cases such as B02, whose parent is B01), prerequisites, postconditions split into success and failure, error handling, and remarks. After the table comes a sequence diagram of the happy path. Then comes the part that carries the normative weight: the requirements table, with columns for id, precondition, requirement definition, and note.

Requirement ids follow a fixed grammar: the use case, then FR, then a number, so B01 carries B01.FR.01 through B01.FR.13. Generic security requirements sit under A00.FR numbers, a block-level bucket rather than a scenario. Two B01 examples show the flavor: after any reboot, the station must reconnect and send a BootNotificationRequest each time it boots (B01.FR.03); and between power-on and a boot response of Accepted or Pending, it must not send any other OCPP request, including messages it queued earlier (B01.FR.08).

Preconditions chain by id. B01.FR.02's precondition is literally B01.FR.01 plus a further condition, and B01.FR.12 depends on B01.FR.11. Reading a single requirement in isolation is how people misquote the spec; the correct move is to resolve the chain until you reach the scenario step that triggers it.

One more layer sits underneath. The requirement keywords (SHALL, SHALL NOT, MAY) are defined by RFC 2119, and OCPP adds a pointed clarification: deviating from a SHOULD requires technically valid reasons; commercial reasons explicitly do not count (OCPP 2.0.1 Part 2, section 2.1; the same convention appears in OCPP 1.6 edition 2, section 2.1). It also matters whether a section is normative at all. In 1.6, everything past the front matter is normative unless explicitly marked informative (OCPP 1.6 edition 2, section 2.1), and the marking is real: 2.0.1 Part 0's minimum-implementation chapter is explicitly informative, so nobody can wave it as a requirement.

## Editions, errata, and settling arguments

The Open Charge Alliance never edits a published specification in place. Corrections accumulate in errata documents, and periodically a new edition of the documents is released with all accepted errata merged in. The protocol does not change; the text describing it gets fixed. OCPP 2.0.1 was finalized in March 2020; Edition 3 arrived in May 2024, Edition 4 in December 2025. OCPP 2.1's first edition came in January 2025, its second in December 2025. During 2026, consolidated errata rounds for both have appeared roughly every two months.

An errata document is worth opening even without a dispute to settle, because it states its own rules. Errata never affect message schemas. Requirement text changes only where a requirement contains an obvious error that could not be implemented literally. New requirements are added only where they were already implicitly present. And every change is discussed in or proposed by OCA's Technology Working Group (OCPP 2.0.1 edition 4 errata 2026-06, scope section). Entries are grouped per part, sorted by printed page, some tagged with a number from OCA's issue tracker, and shown as old and new text side by side. The one deliberate exception to immutability: the Part 2 appendices can gain new device-model components and variables without a full release.

OCPP 1.6 runs the same idea with older packaging: a separate errata sheet for the base document and for each transport specification, split into major errata (problems in message or type definitions) and minor errata (clarified descriptions). Edition 2 of 1.6, from 2017, is the merge point: the same 2015 protocol with the errata known by then folded in, and where the two documents differ, edition 2 prevails (OCPP 1.6 edition 2, section 3.1). The base errata sheet was updated again in April 2025; a protocol still receiving corrections a decade after release tells you how long specification text lives in this industry.

This supports a concrete discipline. When you and a counterpart disagree about a requirement, check two things before debating: are you reading the same edition, and does any errata entry touch that page or requirement id? The errata are dated, cumulative, and indexed by printed page, so the check takes minutes. A surprising number of integration arguments dissolve at step one.

## Schema-first reading

For a whole class of questions, the prose is the slow path. Is this field required? What are the legal enum values? How long can this string be? The JSON schemas answer these mechanically, and they are the files implementations validate messages against.

The 1.6 schema folder holds 56 files, one per message, in JSON Schema draft-04 with additionalProperties false. Open BootNotification.json and you learn in seconds that only chargePointVendor and chargePointModel are required, both capped at 20 characters, everything else optional. In 2.0.1, Part 3 holds 128 files in draft-06, with the enums defined inline: BootNotificationRequest.json carries the nine boot reasons from ApplicationReset to Watchdog.

Here is why schema-first reading is safe in 2.x: the 2.0.1 schemas are dated March 2020 and have not changed across editions 2, 3, and 4, and the errata scope rule guarantees they will not. A 2.0.1 schema answer is therefore stable whichever edition your counterpart downloaded. The caveat lives in 1.6, where the OCPP-J errata process did revise schema files: the 2025 J errata sheet shipped an updated StopTransaction schema, completing the fix for a temperature unit misspelled in two schema files. For 1.6, the freshest truth is the schema folder plus the J errata sheet.

OCPP 2.1's Part 3 extends rather than replaces: its schemas are the 2.0.1 schemas with optional fields added, and the introduction calls out exactly two places where existing behavior changes, an optional requestId on certificate signing that the CSMS must echo when present, and a newly required field on variable monitoring (OCPP 2.1 Part 0, section 1.1). That choice is a lesson in evolving a standard without stranding its installed base.

## Tracking the frontier without chasing news

The frontier moves on a slow, checkable rhythm, so a calendar beats a feed. The primary channels are few. The OCA protocols page is where editions are downloaded and is the ground truth for what is current; the OCA news page announces new editions, while errata rounds surface through the bundle's own change log, so a periodic fresh download is the reliable check. Inside any freshly downloaded bundle, Part 0's version history table tells you precisely what changed and when, more reliably than any third-party summary.

For the neighboring standards, the pattern repeats. ISO 15118 documents are paid publications, and the OCPP specification's own reference tables point at the IEC webstore, making it the practical catalog to watch. CharIN publishes its CCS and MCS material through its knowledge base. On the regulatory side, the channels from Module 3 still apply: the eCFR for the current text of 23 CFR Part 680 and the European Commission's alternative fuels infrastructure pages for AFIR, with the standing caution that the current rule text outranks every summary, including this handbook's.

The habit that ties it together: any claim you carry into a design review should trace to a version history table, a schema file, a requirement id, or a rule text. It is the discipline this handbook practices, and it transfers to every standard you will ever work with.

## Contributing back

OCA's errata documents reveal the pipeline behind them: many entries carry a number from the internal tracker, and every change flows through the Technology Working Group. A genuine specification defect ends up there; check the OCA site for the current way to report one. The specification itself is free to implement, with certification a separate program (OCPP 2.0.1 Part 0, chapter 1). Independent implementations are among the most valuable contributions, because each one stress-tests the prose against reality. The open projects from Module 15 accept issues and patches the ordinary way, and a well-written trace attached to a bug report is often the difference between triage and a fix.

There is also the option of building standards infrastructure directly. Open OCPP Trace, the interchange format from Module 14 that I helped design, lives in a specification repository set up as neutral ground, so that no single project's release cadence governs the format. Its trust mechanism is machinery rather than authority: a versioned schema, sixteen fixture traces with expected outputs, and a conformance self-check that CI runs on every change. Contributions come in under a Developer Certificate of Origin sign-off, with no contributor license agreement. Compare that with OCA's model: OCPP documents are licensed CC BY-ND 4.0, no derivatives, distributed after registration, with changes flowing through a working group. These are different trade-offs, openness of process against control of the text, and both demonstrably produce standards people rely on. Reading one of each closely is the real graduation from consumer of standards to participant.

## Key takeaways

- The OCPP 2.x bundle has seven parts, and each question type has a home: fields in Part 3, behavior in Part 2, transport in Part 4, certification scope in Part 5, currency in Part 0.
- Part 2 use cases follow the IEC 62559-2 template; requirements carry ids like B01.FR.03, use RFC 2119 keywords, and chain through preconditions that must be resolved, not skimmed.
- Published specifications are never edited in place: corrections accumulate in dated, cumulative errata documents and merge into new editions, and 2.x errata never touch message schemas.
- Most requirement disputes settle with a two-step check: same edition, then any errata entry against that page or requirement id.
- Schemas are the fastest field-level truth. The 2.0.1 schemas have been unchanged since 2020 across all editions; 1.6 schemas must be read alongside the OCPP-J errata sheet.
- The frontier moves on a checkable cadence: OCA's protocols and news pages, Part 0 version histories, the IEC webstore for ISO 15118, and the regulation texts from Module 3.
- Contribution paths run from errata reports through OCA's Technology Working Group to issues, patches, and independent implementations across the open ecosystem.

## Try it

> Download the OCPP 2.0.1 bundle from the Open Charge Alliance site if you have not already. Open Part 0 and find the use case index, then open Part 2 to use case B01 and read it end to end: the table, the sequence diagram, and the requirements. Pick one requirement whose precondition names another requirement and resolve the chain back to the scenario step that starts it. Next open the newest errata document and check whether any entry touches the pages you just read. Finish with a schema question: unzip Part 3, open BootNotificationRequest.json, and answer from the file alone which fields a boot request must contain. No hardware, and you have practiced every skill in this module.

## Further reading

- [Open Charge Point Protocol at the OCA](https://openchargealliance.org/protocols/open-charge-point-protocol/), where the specification bundles are available after free registration.
- [OCA news](https://openchargealliance.org/news/), the announcement channel for new editions.
- [RFC 2119](https://datatracker.ietf.org/doc/html/rfc2119), the definitions behind SHALL, SHOULD, and MAY.
- [IEC 62559-2](https://webstore.iec.ch/publication/22349), the use case methodology that OCPP 2.x Part 2 follows.
- [open-ocpp-trace/specification](https://github.com/open-ocpp-trace/specification), the trace format repository discussed above.
- [CharIN knowledge base](https://www.charin.global/technology/knowledge-base/), CharIN's publication hub for CCS and MCS material.

---

Previous: [Module 15: The open-source ecosystem](15-the-open-source-ecosystem.md) | [Contents](../README.md) | Next: [Module 17: Capstone: end to end with open tools](17-capstone.md)
