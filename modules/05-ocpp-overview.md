# Module 5: OCPP: history, governance, versions

Module 4 ended by narrowing the whole map to one link: the wire between a charging station and its operator's backend. This module and the seven after it live on that link. Before Module 6 puts actual frames on the screen, it pays to know what you are holding when you open the specification: a document with a fifteen-year history, a governing body with an unusual way of publishing, a version story with one famous misstep, and a maintenance model of editions and errata sheets that decides who is right when two engineers disagree about what the text says.

None of that is trivia. The first question in any real integration is which version the other side speaks; the second is which edition and errata state your copy of the spec reflects. Fluency in both makes everything from Module 6 onward sharper.

## What you'll learn

- What OCPP specifies, and the boundaries it deliberately draws around itself
- Where the protocol came from and how the Open Charge Alliance runs it today
- The full version genealogy, from the 2010 original to 2.1
- Why the JSON transport displaced SOAP, and why version 2.0 lasted only two years
- How editions and errata sheets keep a released specification correct without changing it
- What certification profiles are, and how 1.6 and 2.x slice the protocol differently
- How to reason about version choice in deployments today

## What OCPP specifies, and what it leaves out

The 1.6 document states its own scope plainly: OCPP is the protocol between a Charge Point and a Central System, and wherever the protocol requires an action or a response from either side, the document says so (OCPP 1.6 edition 2, section 1). It deliberately does not define the communication technology underneath; any network with TCP/IP connectivity will do (same section). The 2.0.1 generation frames the same idea in its own vocabulary, communication between a Charging Station and a CSMS, positioned as an open standard with no cost or licensing barrier to adoption (OCPP 2.0.1 Part 0, chapter 1).

Notice the vocabulary shift, because you will meet both. 1.6 says Charge Point and Central System (OCPP 1.6 edition 2, section 2.2); 2.0.1 and 2.1 say Charging Station and CSMS, with the EVSE defined as the independently operated part of a Charging Station that delivers energy to one EV at a time (OCPP 2.0.1 Part 0, section 1.2.1). Same box, sharper words; this handbook uses whichever generation's terms fit the version at hand.

Everything OCPP defines sits on that one link, which explains what is missing. Roaming between CSMS and eMSP is OCPI's conversation from Module 4. Driver apps talk to backends over private APIs. Settlement between market parties never touches the station. None of that appears in OCPP's scope, not by oversight: the protocol is defined edge to edge on the station-to-backend wire and stops there.

Tariffs deserve precision, because the answer moved across versions. Plain 1.6 has no tariff or cost functionality; none of its six feature profiles touches price (OCPP 1.6 edition 2, section 3.3). 2.0.1 added a Tariff and Cost functional block that lets a station show the price before charging, the running cost during, and the total after (OCPP 2.0.1 Part 0, sections 2.6.4 and 3.2), and 2.1 adds cost calculation on the station plus ad hoc payment use cases with payment terminals and QR codes (OCPP 2.1 Part 0, chapter 2). So: OCPP carries tariff and cost information for display, and lately payment initiation, but it does not define tariff structures, billing, or clearing between operators. Those stay on Module 4's east-west axis.

## Where it came from, and who runs it

OCPP is Dutch. The version history in the 1.6 document traces version 1.0 to October 19, 2010, with the note "Final version approved by e-laad.nl" (OCPP 1.6 edition 2, Version History). E-laad was the foundation now known as ElaadNL; 1.2 (2011) and 1.5 (2012) followed under the same stewardship, and by 1.6 in 2015 the author list spanned five companies plus ElaadNL (same table). The protocol outgrew its foundation the way successful open projects do: by accumulating implementers who wanted a say.

A permanent home arrived in 2014: the Open Charge Alliance, a non-profit that today describes itself as having more than 400 members worldwide, from equipment manufacturers to network operators (openchargealliance.org). Technical maintenance runs through a members' Technology Working Group, credited by name in the errata documents (OCPP 2.0.1 Edition 4 Errata 2026-06, scope page); per OCA's site, membership fees and sales of its conformance test tool, the OCTT, fund the standards work.

Distribution is unusual for a standards body. The specifications are free to download from OCA's site; an account is optional, and the download page is explicit that an account does not make you a member (openchargealliance.org/download-ocpp, as of this writing). The documents are licensed Creative Commons Attribution-NoDerivatives 4.0: share freely, modify never, so OCA keeps sole control of the text (stated on the disclaimer pages of 1.6 edition 2 and the 2.0.1 and 2.1 parts). Compare that with the paid IEC and ISO texts from Modules 2 and 3 and you see one reason OCPP spread.

Formal standardization has caught up too: OCA's site reports OCPP 2.0.1 edition 3 approved as IEC 63584 in 2024, and lists IEC approval of 2.1 as IEC 63584-210. Those catalog numbers are OCA's own announcements; confirm against the IEC catalog if you need to cite them formally.

## The version family tree

Here is the genealogy in one table. Dates come from the version history pages of the documents themselves (OCPP 1.6 edition 2; OCPP 2.0.1 Part 0; OCPP 2.1 Part 0); OCA's protocols page counts three versions as current, the rest retired to an archive.

| Version | Released | Transport | Standing today |
| --- | --- | --- | --- |
| 1.0 | October 2010 | SOAP | archived |
| 1.2 | February 2011 | SOAP | archived |
| 1.5 | June 2012 | SOAP | archived |
| 1.6 | October 2015 | SOAP (OCPP-S) or JSON over WebSocket (OCPP-J) | frozen, errata-maintained, widely deployed |
| 2.0 | April 2018 | JSON over WebSocket | superseded; OCA advises against implementing it |
| 2.0.1 | March 2020 | JSON over WebSocket | current mainline, edition 4 |
| 2.1 | January 2025 | JSON over WebSocket | current frontier, edition 2 |

The first three releases spoke SOAP, full stop. 1.6 introduced a choice: alongside SOAP, a much more compact JSON alternative, with the suffixes -J and -S naming the flavors and the base document always combined with one of two separate transport specifications (OCPP 1.6 edition 2, section 3.2). OCPP-J means JSON over WebSocket; OCPP-S means SOAP (section 2.2 of the same document). Beyond transports, 1.6 brought smart charging, TriggerMessage, more charge point status values, and better diagnostics, and it is not backward compatible with 1.5 (OCPP 1.6 edition 2, section 3).

JSON won on economics. Many public stations sit on cellular links, where verbose XML costs money; the 2.0.1 introduction credits JSON over WebSockets with a large cut in mobile data cost (OCPP 2.0.1 Part 0, section 2.2.2), and the 2.0 generation dropped SOAP entirely as too verbose, too expensive on cellular data, and awkward behind local site networks (OCPP 2.0.1 Part 0, section 2.7.2). I will not put a number on 1.6J's deployment share, because I have found no primary source that publishes one, but OCA itself says 1.6 remains widely used while the industry moves toward 2.x (OCA protocols page). From Module 6 onward, "1.6" without qualification means 1.6J.

Version 2.0 arrived in 2018 as the first ground-up redesign and lasted barely two years. Implementers found problems the errata channel could not fix, because the corrections required non-backward-compatible changes to the machine-readable schema files; OCA shipped the fixed protocol in 2020, named it 2.0.1 to keep the market from confusing the two, and now advises against implementing 2.0 at all (OCPP 2.0.1 Part 0, section 1.1).

So 2.0.1 is the real successor to 1.6, and a redesign rather than a patch: not backward compatible with 1.6 or 1.5 (OCPP 2.0.1 Part 0, chapter 2). Its headlines are a device management model, a single TransactionEvent message replacing StartTransaction, StopTransaction, and transaction-time MeterValues, built-in security profiles with certificate management and secure firmware updates, ISO 15118 support including Plug and Charge, tariff display, renames such as RemoteStartTransaction becoming RequestStartTransaction, and transaction identifiers generated by the station rather than the CSMS (OCPP 2.0.1 Part 0, chapter 2). Module 11 unpacks these; the point here is the shape of the break.

The newest branch, 2.1, extends rather than breaks: its JSON schemas are the 2.0.1 schemas plus optional fields, and with two narrow exceptions application logic written for 2.0.1 keeps working (OCPP 2.1 Part 0, section 1.1). What it adds is the frontier: ISO 15118-20 support, bidirectional power transfer (V2X), control of stations and EVs as distributed energy resources, ad hoc payment, and local cost calculation (OCPP 2.1 Part 0, chapter 2). Structurally, three new functional blocks land on top of 2.0.1's A through P: Q for bidirectional power transfer, R for DER control, and S for battery swapping, while the payment and cost-calculation additions extend the existing authorization and tariff blocks (OCPP 2.1 Part 0, chapter 2 and section 3.2).

One structural note for Part III: the 2.x generations ship as a seven-part bundle, from Part 0's introduction through architecture, the specification proper, schemas, the OCPP-J guide, certification profiles, and test cases (OCPP 2.0.1 Part 0, section 3.1), where 1.6 is one document plus its transport specs. Module 16 teaches the navigation; for now, Part 2 is what people mean by "the spec" and Part 5 is where certification lives.

## Editions and errata: correcting a document without changing it

A released OCPP specification does not change. Corrections accumulate in a cumulative, dated errata document, and periodically OCA republishes the whole set with the errata merged in, calling the result a new edition. Edition 4 of 2.0.1 merged all errata through November 2025 (OCPP 2.0.1 Part 0, Version History); 2.1 edition 2, released the same day in December 2025, did the same for its line (OCPP 2.1 Part 0, Version History). The protocol never moves; the paper gets more correct.

Errata are deliberately weak, and that is the design. They read as an addition to the released edition, they never change message schemas, and requirement changes appear only where a requirement contained an obvious error or was already implicitly present (OCPP 2.0.1 Edition 4 Errata 2026-06, scope and terminology pages). Entries are organized per part, tagged with the dated round that introduced them, and routed through the Technology Working Group. One carve-out: the Part 2 appendices, mostly the device model catalog, may gain optional items without a new release (same document, scope).

This machinery is exactly why 2.0.1 exists: the 2.0 fixes needed schema changes, the one thing errata may not make, so a new version number was the only legal move (OCPP 2.0.1 Part 0, section 1.1).

The 1.6 line runs the same model at a slower pace. Edition 2 (2017) merged all errata known to that date and takes precedence over the original text where they disagree (OCPP 1.6 edition 2, section 3.1), and the errata sheet kept growing, with releases through April 2025 (OCPP 1.6 errata sheet 2025-04, Version History): a protocol frozen in 2015, still receiving corrections a decade later. The habit to build: in any disagreement about what the spec says, first establish which version, which edition, and whether both sides have read the current errata. As of this writing that means 2.0.1 edition 4 and 2.1 edition 2, each with errata through June 2026, and 1.6 edition 2 with its April 2025 errata sheet.

## Certification profiles at a glance

Module 3 left you with the certified-versus-correct distinction; here is the machinery behind the certificate. OCPP is implemented in wildly different products, from home wallbox to megawatt cabinet, so implementers pick the functionality that applies, and for interoperability's sake OCA defines certification profiles in Part 5 as the unit of testing (OCPP 2.0.1 Part 0, section 3.3).

In the 2.x program, certification is built around profiles, named sets of supported functions: full certification covers all of them, a subset is allowed, and Core must always be present (OCPP 2.0.1 Part 5, chapter 2). Core alone is substantial, covering Basic authentication, TLS with a server-side certificate, booting and configuration, authorization, local and remote start and stop, meter values, log retrieval, and secure firmware updates (same chapter, Table 1). The headline add-ons are Advanced Security, Smart Charging, and ISO 15118 support, the one exception to profile independence, since it requires a number of Advanced Security and Smart Charging test cases (same chapter). Four further listed profiles, local authorization lists, advanced device management, advanced user interface, and reservation, ride along with Core as optional feature groups.

Version 2.1's certification set adds Payment, Bidirectional Power Transfer with Smart Charging as a prerequisite, and DER Control (OCPP 2.1 Part 5, chapter 2, Table 1). The dates deserve a pause: 2.0.1's certification part first appeared in mid-2023 covering only Core and Advanced Security, the full profile set arrived with edition 3 in 2024, and 2.1's certification part was first published in December 2025 (Version History pages of both Part 5 documents). Certification trails the paper spec, sometimes by years, and the lag matters whenever a contract or regulation says "certified".

Meanwhile 1.6 predates all of this and uses a different concept with a confusingly similar name: feature profiles. There are six, Core, Firmware Management, Local Auth List Management, Reservation, Smart Charging, and Remote Trigger; Core is required and compliance testing is organized per profile (OCPP 1.6 edition 2, section 3.3). Feature profiles slice the 1.6 specification itself; certification profiles define the 2.x testing program. Module 3's warning applies to both: a certificate proves what was tested, when it was tested, and nothing more.

## Choosing a version today

Deployment reality first, stated as carefully as the sources allow. OCA's public position is that 1.6 remains widely used while the industry moves toward 2.x, with 2.0.1 on its way to replacing it (OCA protocols page). I have found no trustworthy public number for the split, so this handbook will not invent one. The practical reading: a backend that cannot speak 1.6J walls itself off from a large installed base, while a product that speaks only 1.6J is building on a feature set frozen in 2015.

Regulation pulls in one direction. Module 3 covered the detail: NEVI's minimum standards require OCPP capability up to 2.0.1, though NEVI has been in policy flux since 2025, and AFIR shapes the EU side; check the current rule text before building a compliance case on either. Procurement follows regulation, so 2.0.1 capability shows up in tenders even where no law demands it.

Version 2.1 is real but early: first published January 2025, certification documentation only since December 2025 (OCPP 2.1 Part 5, Version History). It is the direction of travel for V2X and DER work rather than something today's tenders demand, and because it extends 2.0.1's schemas and intends 2.0.1 application logic to keep working (OCPP 2.1 Part 0, section 1.1), effort invested in 2.0.1 is not throwaway work.

This handbook makes its own choice the way the field does: Part III teaches the wire on 1.6J first, the version you are most likely to meet in an existing fleet, then gives 2.0.1 and 2.1 a module of their own (Module 11) once the transaction model is in your bones.

## Key takeaways

- OCPP specifies the station-to-backend link and what each side must do; it leaves the network technology open and stays out of roaming, driver apps, and inter-operator billing. Tariff data appears from 2.0.1 onward, for display and, in 2.1, payment.
- The protocol started at the Dutch foundation e-laad.nl in 2010; the Open Charge Alliance (founded 2014) has governed it since: free to download, licensed CC BY-ND, maintained through a members' Technology Working Group.
- The genealogy: 1.0, 1.2, and 1.5 in the SOAP era; 1.6 in 2015 with two transports, of which JSON over WebSocket won on cellular economics; 2.0 in 2018, superseded within two years; 2.0.1 in 2020 as the true successor; 2.1 in 2025 as a compatible extension adding V2X, DER control, and payment.
- Released specifications never change: errata sheets accumulate corrections that may not touch schemas, and editions republish with errata merged. Schema-breaking fixes force a new version, which is the 2.0 to 2.0.1 story.
- Certification runs on profiles: 1.6 has feature profiles inside the spec, 2.x has certification profiles in Part 5 with Core mandatory, and certification availability can trail spec publication by years.
- Version choice today is two-track: 1.6J for the installed base, 2.0.1 for regulation and new builds, with 2.1 early but designed so 2.0.1 work carries forward.

## Try it

> Fetch the primary sources yourself. On the Open Charge Alliance site, find the downloads section and pull OCPP 1.6 edition 2 and the 2.0.1 bundle; both are free, an account optional. In the 1.6 PDF, find the version history table near the front: the 2010 row with its e-laad.nl approval note is the industry's origin in one line. Then unzip the 2.0.1 set, match the files against the seven-part structure described here, and finish in the errata document: pick one entry and work out which part and page it corrects and which dated round introduced it. When two people disagree about what OCPP says, you now know the drill: same version, same edition, current errata, then argue.

## Further reading

- [Open Charge Alliance: OCPP](https://openchargealliance.org/protocols/open-charge-point-protocol/), the protocol's canonical page, with the current version lineup and OCA's framing of where adoption stands.
- [Open Charge Alliance](https://openchargealliance.org/), the alliance itself: membership, announcements, and the other open standards it stewards.
- [OCPP downloads](https://openchargealliance.org/download-ocpp/), where every current specification and errata document lives, account optional. Retired versions, including 2.0, sit in an archive behind an OCA site sign-in.

---

Previous: [Module 4: The protocol map, from the EV to the grid](04-the-protocol-map.md) | [Contents](../README.md) | Next: [Module 6: OCPP-J on the wire: WebSocket, framing, correlation](06-ocpp-j-on-the-wire.md)
