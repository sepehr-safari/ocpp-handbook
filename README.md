# OCPP Handbook

A course on EV charging software: the industry, the hardware, the protocols, and the craft of debugging them. It starts from zero and ends at the level where you read raw OCPP frames, run your own captures, and work with the specifications without a guide.

Vendor-neutral, free, and checkable: claims link to sources, and protocol statements cite the specifications by section.

## Who this is for

Software engineers entering EV charging: backend developers joining a CPO or a CSMS vendor, firmware people landing on a charger project, tool builders, and anyone tired of meeting OCPP, OCPI, CPO, eMSP, and EVSE in sentences that explain none of them.

No EV, electrical, or protocol background is assumed. Comfort with JSON and rough familiarity with HTTP are enough. WebSocket experience helps but is introduced properly when it's needed.

## What you'll be able to do

- Explain who the industry players are and how money moves between them
- Read an OCPP 1.6J exchange frame by frame and spot what's wrong
- Run a simulated charge point against an open-source backend and capture the traffic
- Recognize the common ways charging sessions fail in the field
- Work with the 1.6 and 2.0.1 specifications directly, and track what 2.1 changes

## Why this handbook

The specifications are solid reference documents, but a reference is not a learning path. Vendors publish good overview articles, and each open-source project documents its own corner. What's hard to find is a connected route from zero: industry context first, then the physical layer, then the protocol stack, then field debugging, each part building on the last. This handbook is an attempt at that route.

## Syllabus

All modules are available, from orientation through the capstone.

| Part | # | Module | Status |
| --- | --- | --- | --- |
| 0. Orientation | 0 | [Orientation: the map and the conventions](modules/00-orientation.md) | Available |
| I. The industry | 1 | [The industry: who's who and how the money flows](modules/01-the-industry.md) | Available |
| I. The industry | 2 | [The hardware: connectors, power, and the physical layer](modules/02-the-hardware.md) | Available |
| I. The industry | 3 | [Standards bodies and regulation](modules/03-standards-and-regulation.md) | Available |
| II. Protocol landscape | 4 | [The protocol map: from the EV to the grid](modules/04-the-protocol-map.md) | Available |
| III. OCPP | 5 | [OCPP: history, governance, versions](modules/05-ocpp-overview.md) | Available |
| III. OCPP | 6 | [OCPP-J on the wire: WebSocket, framing, correlation](modules/06-ocpp-j-on-the-wire.md) | Available |
| III. OCPP | 7 | [The transaction lifecycle](modules/07-the-transaction-lifecycle.md) | Available |
| III. OCPP | 8 | [CSMS-initiated operations](modules/08-csms-initiated-operations.md) | Available |
| III. OCPP | 9 | [Smart charging](modules/09-smart-charging.md) | Available |
| III. OCPP | 10 | [Security](modules/10-security.md) | Available |
| III. OCPP | 11 | [OCPP 2.0.1 and beyond](modules/11-ocpp-201-and-beyond.md) | Available |
| III. OCPP | 12 | [ISO 15118 and Plug and Charge](modules/12-iso-15118-and-plug-and-charge.md) | Available |
| IV. The field | 13 | [Why chargers break: failure patterns](modules/13-why-chargers-break.md) | Available |
| IV. The field | 14 | [Tracing and observability](modules/14-tracing-and-observability.md) | Available |
| IV. The field | 15 | [The open-source ecosystem](modules/15-the-open-source-ecosystem.md) | Available |
| V. Mastery | 16 | [Reading specifications and tracking the frontier](modules/16-reading-specifications.md) | Available |
| V. Mastery | 17 | [Capstone: end to end with open tools](modules/17-capstone.md) | Available |
| Appendix | | [Glossary](GLOSSARY.md) | Growing |

## Read it offline

PDF and EPUB editions are attached to each [release](https://github.com/sepehr-safari/ocpp-handbook/releases). A published edition stays as it was published; corrections land in the next one.

## Scope and conventions

OCPP 1.6J is the working baseline because it's what the field mostly runs. OCPP 2.0.1 gets a deep module of its own, and 2.1 is covered where it changes the picture. Terminology defaults, citation rules, and how to get the specifications are in [Module 0](modules/00-orientation.md).

## Tools

Everything hands-on uses open-source software, and no charger hardware is needed at any point. Some later modules use OCPP DebugKit, which I maintain; alternatives are named where they exist, and [awesome-ev-charging](https://github.com/juherr/awesome-ev-charging) is the wider directory.

## License and feedback

Prose is licensed under [CC BY 4.0](https://github.com/sepehr-safari/ocpp-handbook/blob/main/LICENSE); code samples are licensed under [Apache 2.0](https://github.com/sepehr-safari/ocpp-handbook/blob/main/LICENSE-CODE). Corrections and error reports are welcome as issues.

Written by Sepehr Safari.
