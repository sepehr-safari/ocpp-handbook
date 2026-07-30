# Glossary

Working definitions, added as modules introduce the terms. Where a specification defines a term precisely, the specification wins; these entries are for orientation.

**400-volt / 800-volt architecture.** The voltage of an EV's battery pack. Since power is voltage times current, a higher-voltage pack reaches a given charging power at lower current, which means less heat and thinner cables for the same delivered kilowatts. Module 2.

**AC charging.** Charging where the station supplies alternating current and the car's onboard charger converts it for the battery. Slower, cheaper hardware; the norm at home, work, and destinations.

**Ad hoc payment.** Paying at the charger without a pre-existing account, typically by bank card or a QR-code web flow. Increasingly required by regulation for new public fast chargers.

**AFIR (Alternative Fuels Infrastructure Regulation).** Regulation (EU) 2023/1804, binding across the EU since 2024. Requires open ad hoc payment, per-kilowatt-hour pricing, and price transparency at public fast chargers, and sets deployment targets along the main transport corridors (the TEN-T network). Module 3.

**Authorization cache.** A store of identifiers a charge point builds on its own, recording every idTagInfo the backend returns in Authorize, StartTransaction, and StopTransaction responses, valid and invalid entries alike. A distinct structure from the local authorization list, which wins where they disagree; ClearCache empties only the cache. Modules 7 and 8.

**Autocharge.** Identification of a vehicle by its EVCC MAC address instead of a certificate; OCPP 2.0.1 carries it as the MacAddress token type. Simpler to deploy than Plug and Charge, with none of its cryptographic guarantees. Module 12.

**Battery management system (BMS).** The system inside the vehicle that governs how much power the battery accepts at each moment and protects it as it fills. The final authority on charging power, sitting above every station, cable, or connector limit.

**BootNotification.** The message a charge point sends each time it powers up, naming its vendor and model; until the response says Accepted or Pending, the station sends no other request. The response sets the heartbeat interval and carries the server's current time. Modules 6 and 7.

**CALL.** The OCPP-J request frame, a four-element JSON array: message type 2, a unique message id, the action name, and a payload object. Either side sends CALLs. Module 6.

**CALLERROR.** The OCPP-J error frame, a five-element JSON array: message type 4, the echoed message id, an error code, a description, and a details object. Reserved for transport failures and malformed calls, never for rejections an operation's own response can express. Module 6.

**CALLRESULT.** The OCPP-J response frame, a three-element JSON array: message type 3, the echoed message id, and a payload object. Every normal answer is a CALLRESULT, including rejections. Module 6.

**Capacity charges.** The part of a commercial electricity bill driven by peak power draw rather than energy consumed; called demand charges in North America. A major cost line for fast-charging sites.

**Capture point.** The place where OCPP traffic is recorded: the station's logs, the CSMS's logs, a proxy between them, or a network capture. Each point sees a different view of the same session on a different clock. Module 14.

**Capture proxy.** A WebSocket proxy placed between a charge point and its CSMS that relays traffic while recording every frame it forwards. It sees what actually passed between the two parties, but it stamps frames with a third clock that belongs to neither endpoint. Module 14.

**CCS (Combined Charging System).** A DC fast-charging connector that adds two DC pins beneath an existing AC connector, so one car port handles both. CCS1 builds on Type 1 (North America); CCS2 builds on Type 2 (Europe).

**CDR (charge detail record).** The billing record of a completed charging session, exchanged between CPO and eMSP, directly or via a hub, so the driver can be billed and the CPO paid.

**Central System.** OCPP 1.6's name for the operator backend. See CSMS.

**Certificate authority.** An entity that signs certificates so that others can trust them. In OCPP 2.0.1 a station only ever reaches a certificate authority through its CSMS, and the spec recommends that the CSMS not sign certificates itself. Module 10.

**Certificate Provisioning Service (CPS).** The service that delivers contract certificates into vehicles during provisioning. One of the four PKIs that must be in place before Plug and Charge works. Module 12.

**Certificate signing request.** A file derived from a newly generated public key that a certificate authority can turn into a signed certificate. In OCPP 2.0.1 a station sends one in SignCertificate when its certificate needs renewal, and the matching private key never leaves the device. Module 10.

**Certification profile.** A named set of OCPP functions that the 2.x certification program tests as a unit, defined in Part 5 of the specification bundle. Core is mandatory; profiles such as Advanced Security, Smart Charging, and ISO 15118 support are certified on top of it. Module 5.

**CHAdeMO.** An early DC fast-charging connector of Japanese origin, kept as a separate port rather than combined with an AC connector, now largely superseded outside Japan.

**ChaoJi.** A next-generation DC fast-charging connector developed from the CHAdeMO lineage with Chinese partners, aimed at a higher-power successor to today's fast-charging connectors. Module 3.

**Charge point.** OCPP 1.6's name for the charging station. In 1.6's model, a charge point contains numbered connectors, and connector 0 means the unit itself.

**Charge point simulator.** Software that stands in for a physical charging station: it speaks real OCPP to a backend while the connector, meter, and vehicle exist only in software. The cheapest way to learn the protocol and the standard way to develop and test a CSMS without hardware. Module 15.

**CharIN.** The industry alliance behind the Combined Charging System (CCS) and the Megawatt Charging System (MCS), which also runs interoperability test events (testivals). Not a formal standards body, yet a decisive one. Module 3.

**Charging profile.** The data structure smart charging rides on: a purpose, a stack level, an optional validity window, and exactly one schedule of timed limits in amps or watts. Installed on a station, it is standing policy that keeps working offline and across reboots. Module 9.

**Charging session.** The driver's whole visit to a charge point, from first interaction with the station to the connector coming free again; the transaction is its accountable middle. Module 7.

**Charging station.** The physical charging hardware; this handbook's default term, matching OCPP 2.0.1. Contains one or more EVSEs.

**Clock skew.** Disagreement between the clocks of a station, a backend, and the capture layer. Because OCPP-J envelopes carry no timestamps of their own, skew makes trace timestamps unreliable for ordering, and honest tools flag inversions rather than silently reordering. Module 14.

**Composite schedule.** The schedule a station actually enforces: at every moment, the minimum of the prevailing limits across all profile purposes. A CSMS can ask for a snapshot of it with GetCompositeSchedule, but the answer is indicative only. Module 9.

**Conformance fixture.** A reference trace paired with the exact consumer view a correct implementation must derive from it. A corpus of such fixtures pins down what a format means in practice, which a schema alone cannot do. Module 14.

**Connection URL.** The URL a charge point dials: the Central System's OCPP-J endpoint plus a slash and the station's identity, percent-encoded. The connection carries the identity from then on, so individual messages never repeat it. Module 6.

**Connector.** A single plug position on a station, and the unit much of OCPP's status reporting is scoped to.

**Contract certificate.** The X.509 certificate stored in an EV that binds the vehicle to a charging contract with a Mobility Operator. Presenting it, and proving possession of its key, is how Plug and Charge replaces cards and apps. Module 12.

**Control pilot.** The wire, defined in IEC 61851, that carries the analog handshake between station and car: which connection state the session is in, and how much current the car may draw, the latter encoded as a pulse width. The ground truth beneath OCPP connector status. Module 2.

**CPMS.** Charge point management system; another name for the CSMS, common in vendor material.

**CPO (charge point operator).** The party that operates charging stations: uptime, maintenance, pricing at the plug, and the backend connection. May or may not own the hardware or the site.

**CSMS (charging station management system).** The operator's backend that stations connect to over OCPP. OCPP 2.0.1 term; 1.6 says Central System; colloquially, the backend.

**DataTransfer.** OCPP's escape hatch for functionality the protocol does not cover: a message carrying a required vendorId, an optional messageId, and free-form data whose meaning the two parties agree on privately. It works in both directions and is the least portable corner of any integration. Module 8.

**DC fast charging.** Charging where the station converts to direct current and feeds the battery directly, bypassing the car's onboard charger. Higher power, far more expensive hardware; the public highway segment.

**DER (distributed energy resource).** A grid-connected unit that produces or stores energy and can be controlled under grid codes. OCPP 2.1's block R treats charging stations and the EVs behind them as DERs, with IEC 61850 and IEEE 2030.5 on the grid side. Module 11.

**Detection rule.** A scripted check that scans captured OCPP traffic for one failure signature. Some rules encode outright spec violations, others flag legal but suspicious behavior, so a firing rule is a prompt to open the spec text, not a verdict. Module 13.

**Developer Certificate of Origin (DCO).** A lightweight way to accept open-source contributions: the contributor adds a Signed-off-by line certifying they have the right to submit the work, with no separate contributor license agreement. The Open OCPP Trace specification uses it. Module 16.

**Device model.** The OCPP 2.0.1 mechanism that lets any charging station report how it is built, as components holding variables that can be read, written, and monitored, so any CSMS can configure and watch hardware it has never seen before. It replaces the flat string configuration keys of 1.6. Module 11.

**DSO (distribution system operator).** The operator of the local electricity grid a site connects to. Grants grid connections, charges for capacity, and increasingly wants a say in when charging happens.

**Edition.** A republication of an OCPP specification with all accumulated errata merged into the text. An edition changes the paper, never the protocol: 1.6 edition 2, 2.0.1 edition 4, and 2.1 edition 2 are the current examples. Module 5.

**EIM (External Identification Means).** ISO 15118's name for every identification method that is not Plug and Charge, from RFID cards to apps. It is also the designed fallback when certificate status cannot be checked. Module 12.

**ElaadNL.** The Dutch foundation, called e-laad.nl when it approved OCPP 1.0 in 2010, that stewarded the protocol's early versions before the Open Charge Alliance took over governance in 2014. Module 5.

**eMAID (e-mobility account identifier).** The identifier a Mobility Operator issues together with a contract certificate to name the charging contract. The certificate's signature protects it against tampering, and OCPP 2.0.1 carries it as a token type of its own. Module 12.

**eMIP.** Gireve's roaming hub protocol.

**EMS (energy management system).** A local controller that balances a site's loads and generation and can impose charging limits on a station outside OCPP. The station folds such limits in as an external-constraints profile and reports the change to the CSMS. Module 11.

**eMSP (e-mobility service provider).** The party with the driver relationship: app, RFID card, billing, support. Sells access to other parties' chargers. Also written EMP or MSP.

**Errata.** Dated, cumulative correction documents for a published OCPP specification. OCA never edits a published document in place: corrections accumulate in errata documents, indexed by printed page, and merge into the next edition. Errata may fix wording and obvious requirement errors, and in the 2.x line they never change message schemas; a fix that needs a schema change forces a new version number. Modules 5 and 16.

**EV.** Electric vehicle; in this handbook usually a battery-electric car, though the protocols don't much care.

**EVCC (EV Communication Controller).** The controller in the car that speaks ISO 15118. Its counterpart on the station side is the SECC. Module 12.

**EVRoaming Foundation.** The organization that stewards OCPI, the CPO-to-eMSP roaming protocol. Module 3.

**EVSE (electric vehicle supply equipment).** Colloquially, the whole charger. Precisely, in OCPP 2.0.1: the part of a charging station that can deliver energy to one EV at a time. A station has one or more EVSEs; an EVSE has one or more connectors, of which one can be active. Module 0 explains why the precision matters.

**Feature profile.** One of the six named groups into which OCPP 1.6 organizes its functionality: Core, Firmware Management, Local Auth List Management, Reservation, Smart Charging, and Remote Trigger. Core is required, the rest are optional, compliance testing runs per profile, and a station lists what it supports in the SupportedFeatureProfiles configuration key. Not the same thing as a 2.x certification profile. Modules 5 and 8.

**Functional block.** A lettered chapter of the 2.x specification (A through P in 2.0.1, with Q, R, and S added in 2.1) that groups related use cases and requirements, from Security through DataTransfer. Module 5.

**GB/T.** China's national EV charging connector standards, with separate AC and DC plugs. The largest connector family by sheer count.

**Hard reset.** The Reset variant that restarts all of a charge point's hardware, without requiring a graceful stop of running transactions. The spec frames it as a last resort because queued messages can be lost; the matching stop reason is HardReset. Module 8.

**Heartbeat.** The OCPP message a charge point sends after a configured stretch with no other traffic, proving it is still alive. The response carries the Central System's current time, which is why one Heartbeat a day still matters even where WebSocket pings handle liveness. Module 6.

**HTTP Basic authentication.** A username and password carried in an HTTP header, encoded in base64 but not encrypted. OCPP stations use it to identify themselves in security profiles 1 and 2, which is why those profiles need either a genuinely private network or TLS around them. Module 10.

**Idle fee.** A per-minute charge for staying plugged in after charging ends. It protects the only revenue-producing thing on the site: the working connector's time.

**idTag.** The identifier a user presents to authorize charging in OCPP 1.6: a case-insensitive string of at most 20 characters, in practice often the UID of an RFID card, though stations must not presume any format. Module 7.

**IEC (International Electrotechnical Commission).** The international body for electrotechnical standards, owner of IEC 61851 and IEC 62196 and, jointly with ISO, of ISO 15118. Module 3.

**IEC 61851.** The international standard for the low-level electrical relationship between EV and station: presence, readiness, and permitted current, signaled on the control pilot line. Module 2.

**IEC 62196.** The international standard defining EV connector types, including Type 1 and Type 2. Module 2.

**IEC 62559-2.** The IEC standard that defines the template for writing use cases, actor lists, and requirements lists. OCPP 2.x Part 2 is structured on it, which is why every use case reads the same way. Module 16.

**IEC 63584.** The IEC catalog number under which, per OCA's announcements, OCPP 2.0.1 edition 3 was approved as an international standard in 2024, with 2.1's approval listed as IEC 63584-210. The IEC catalog is the authority on the listing. Module 5.

**IEEE 2030.5.** A smart-energy protocol for distributed energy resources; one of the grid-facing protocols a CSMS may speak. Module 4.

**ISO (International Organization for Standardization).** The international standards body that, jointly with the IEC, publishes ISO 15118. Module 3.

**ISO 15118.** The standard for high-level digital communication between EV and station: identification, Plug and Charge, and bidirectional power in its newer editions. Module 12.

**JSONL (JSON Lines).** A file convention of one complete JSON value per line. Producers can append records as they happen, and any line-oriented tooling can process the file one record at a time. The Open OCPP Trace format uses it for trace streams. Module 14.

**LF Energy.** The Linux Foundation's umbrella for open-source energy projects. In EV charging it hosts EVerest, the station-side firmware framework, and CitrineOS, the OCPP 2.0.1-first CSMS. Module 15.

**Load balancing.** Dividing a fixed power budget across the connectors of one station, decided by the station itself against a configured ceiling such as its grid connection's maximum. One of the three smart charging patterns OCPP 1.6 sketches. Module 9.

**Local authorization list.** A list of identifiers and their authorization status that the backend pushes to a charge point with SendLocalList, either as a full replacement or a differential update tagged with a version number. The station may not change it by any other means, and its entries take priority over the authorization cache. Modules 7 and 8.

**Local controller.** A logical OCPP component, in practice a separate box or a designated master charge point, that proxies a group's OCPP traffic and holds the group under a shared cap. It may have no connectors of its own. Module 9.

**MCS (Megawatt Charging System).** An emerging connector standard for charging heavy trucks at megawatt-class power. Module 2.

**Measurand.** The quantity a meter sample reports. OCPP 1.6 defines twenty-two, from energy and power to voltage and temperature; the default, and the one billing runs on, is the active import energy register. Module 7.

**Message id.** The string of at most 36 characters that ties an OCPP-J request to its response. Each new CALL needs a fresh one, and the answer echoes it exactly; GUIDs are the safe choice. Module 6.

**MeterValues.** The message that carries meter samples during a transaction, taken either on an interval from the transaction start or aligned to the clock; a bare value defaults to the active import energy register in watt-hours. Module 7.

**Mobility Operator (MO).** The ISO 15118 name for the party that holds the driver's charging contract and issues the contract certificate and eMAID. Roughly the same role the roaming world calls an eMSP. Module 12.

**Mutual TLS.** A TLS connection in which both ends present certificates, so the station verifies the CSMS and the CSMS verifies the station without any password. This is security profile 3 in OCPP 2.0.1. Module 10.

**NACS (SAE J3400).** The connector originally developed by Tesla, combining AC and DC in one compact plug, now standardized as SAE J3400 and being adopted more widely across North America. Module 2.

**NEVI (National Electric Vehicle Infrastructure).** A US federal program funding corridor charging, whose minimum standards (23 CFR Part 680) require OCPP, ISO 15118 Plug and Charge, CCS1 connectors, and above 97 percent uptime. Subject to policy change since 2025. Module 3.

**OCA (Open Charge Alliance).** The industry alliance that maintains OCPP and OSCP and distributes the specifications free of charge after registration.

**OCPI (Open Charge Point Interface).** The protocol for exchanging locations, tariffs, sessions, CDRs, and tokens between CPOs and eMSPs, peer to peer or via hubs. Maintained by the EVRoaming Foundation.

**OCPP (Open Charge Point Protocol).** The protocol between charging stations and the CSMS; the subject of most of this handbook. Maintained by the OCA.

**OCPP 1.6 Security Whitepaper.** An OCA whitepaper, currently in its fourth edition, that specifies a standard way to run the security design OCPP 2.0 introduced on top of OCPP 1.6-J: secure connection setup, security events and logging, and secure firmware updates. Module 10.

**OCPP certification.** The Open Charge Alliance program that tests a station or CSMS against a defined OCPP profile using a compliance testing tool and accredited labs. Proves conformance to the profile, not field correctness across vendor pairs. Module 3.

**OCPP-J.** OCPP carried as JSON over WebSocket, as opposed to the legacy SOAP transport. "1.6J" means OCPP 1.6 in this transport.

**OCPP-S.** OCPP carried over SOAP, the older of 1.6's two transport flavors. The 2.x generations dropped it entirely, leaving JSON over WebSocket (OCPP-J) as the transport that survived. Module 5.

**OCSP (Online Certificate Status Protocol).** The mechanism for checking whether a certificate has been revoked. ISO 15118 timeouts are too short for a live check at plug-in, so OCPP requires stations to cache OCSP results ahead of time. Module 12.

**OCTT (OCPP Compliance Testing Tool).** The Open Charge Alliance's official instrument for testing OCPP 1.6 and 2.0.1 implementations of stations and CSMS backends. Cloud-hosted, subscription-based, and closed source, it supplies the test runs behind OCPP certification, and its sales help fund OCA's standards work. Modules 5 and 15.

**OICP.** Hubject's roaming hub protocol.

**Onboard charger.** The AC-to-DC converter inside the vehicle. Its power rating caps how fast a car can charge on AC, and it is bypassed entirely during DC charging.

**Open OCPP Trace.** A neutral interchange format for OCPP traces: JSONL with one record per OCPP-J frame, five required fields, a verbatim raw copy of each frame, and conformance fixtures that pin down what a correct reader must derive. It lives in its own repository so that no single tool governs it. Module 14.

**OpenADR.** A demand-response protocol between energy actors and large loads; grid-facing, met in Modules 4 and 9.

**OSCP (Open Smart Charging Protocol).** An OCA protocol for communicating capacity budgets between grid parties and charging operators. Modules 4 and 9.

**Permissive license.** A software license, such as MIT or Apache-2.0, that allows use, modification, and redistribution with few obligations. Contrast with GPL-family licenses, whose conditions activate when you distribute software or link it into a product. Module 15.

**Plug and Charge.** The ISO 15118 feature where the car authenticates itself, and payment follows automatically once the cable clicks in. No app, no card.

**Proximity pilot.** A connection that tells the car a plug is physically seated (many cars won't move while charging), and in some cables encodes how much current the cable can safely carry. Module 2.

**Register monotonicity.** The OCPP 1.6 requirement that cumulative energy register values within a single transaction only increase over time. Registers are reported as read from the meter, not re-based to zero, so a backend can spot missing energy between sequential sessions. Module 13.

**Requirement id.** The identifier of a single normative requirement in OCPP 2.x, formed from the use case plus FR and a number, such as B01.FR.03. Preconditions chain requirements together by id, so quoting a requirement means resolving its chain, not just its row. Module 16.

**Reservation.** An OCPP mechanism (ReserveNow and CancelReservation) by which the backend holds a connector for a specific idTag until an expiry time. While the reservation holds, the station refuses charging on that connector for every identifier except the reserved one or its parent. Module 8.

**RFID.** The tap-card authorization method that dominated early public charging and is still everywhere. The card carries a token some eMSP vouches for.

**Roaming.** The arrangement that lets an eMSP's customers charge on networks they hold no direct contract with, with data and settlement flowing between the parties behind the scenes.

**Roaming hub.** A platform CPOs and eMSPs each connect to once for many-to-many roaming, instead of maintaining bilateral links. Hubject and Gireve are the big ones.

**SAE International.** The standards body behind several North American EV standards, including SAE J1772 (Type 1) and SAE J3400 (NACS). Module 3.

**SECC (Supply Equipment Communication Controller).** The ISO 15118 controller in the charging equipment, the station-side counterpart of the car's EVCC. Module 12.

**Security event.** A security-relevant occurrence a charging station detects on its own, such as a triggered tamper sensor or an invalid certificate. OCPP 2.0.1 standardizes the event names in an appendix; every implemented event is written to the station's security log, and critical ones are pushed to the CSMS with SecurityEventNotification. Module 10.

**Security profile.** One of three named configurations in OCPP 2.0.1 that fix how station and CSMS prove their identities and whether the channel is encrypted. Profile 1 is Basic authentication on a trusted network, profile 2 adds TLS with a server certificate, profile 3 is mutual TLS. Module 10.

**Site host.** The party that controls the location where stations stand, typically earning rent, a revenue share, or foot traffic.

**Smart charging.** The optional OCPP 1.6 feature profile that lets a backend limit charging power or current over time. Three messages carry it (SetChargingProfile, ClearChargingProfile, GetCompositeSchedule); the intelligence lives in the charging profiles they install. Module 9.

**Soft reset.** The Reset variant that stops running transactions gracefully, sends a StopTransaction for each, and then restarts the charge point's application software. The matching stop reason is SoftReset. Module 8.

**Stack level.** An integer on every charging profile that ranks profiles sharing a purpose. Among the profiles of one purpose valid at a given moment, the highest stack level wins; duplicates of the same purpose and level replace the old profile. Module 9.

**StatusNotification.** The message a charge point uses to report a connector's status and error code upstream; OCPP 1.6 defines nine status values and a table of legal transitions between them. Module 7.

**Technology Working Group.** The members-only Open Charge Alliance group that maintains the OCPP specifications; errata changes are discussed in or proposed by it before publication. Module 5.

**Three-phase.** An AC supply with three live conductors, standard for premises in much of the world outside North America. It lets an AC station reach roughly 11 or 22 kW where a single phase tops out far lower. Module 2.

**TLS (Transport Layer Security).** The standard protocol that encrypts a network connection and lets each end verify the other through certificates. OCPP security profiles 2 and 3 run the WebSocket inside TLS, with version 1.2 as the floor. Module 10.

**Trace.** A recording of the exact OCPP frames that crossed the wire, in capture order, each stamped with a timestamp by whoever captured it. Stronger evidence than a log because it preserves the frames themselves rather than a program's paraphrase of them. Module 14.

**Transaction.** In OCPP 1.6, the accountable span of a charging session: it opens with StartTransaction, closes with StopTransaction, and carries the meter readings that billing rests on. The Central System assigns its id. Module 7.

**TransactionEvent.** The single OCPP 2.0.1 message that carries all transaction reporting as Started, Updated, and Ended events with station-generated transaction ids and sequence numbers, replacing the StartTransaction, StopTransaction, and transaction-related MeterValues messages of 1.6. Module 11.

**TriggerMessage.** A backend command that asks the charge point to send one of six charge-point-initiated messages right now, closing the timing gap when the station holds current information the backend wants but would not otherwise send. Triggered messages carry current state only, never history. Module 8.

**Truck roll.** Industry shorthand for dispatching a technician to a charging site in person rather than resolving a problem remotely. The expensive outcome that reading the traffic first is meant to make rarer. Module 13.

**Type 1 (SAE J1772).** A single-phase AC connector used in North America and Japan. The base for CCS1.

**Type 2 (IEC 62196-2).** The AC connector standard across Europe and much of the world, single or three phase. The base for CCS2.

**Utilization.** The share of time a charger spends actively delivering energy. The ratio that decides whether a public charging site pays for itself.

**V2G Root CA.** The certificate authority at the top of the ISO 15118 trust structure. It anchors the charging station operator and Certificate Provisioning Service hierarchies, and the station's 15118 certificate must derive from a V2G root. Module 12.

**V2X (vehicle-to-everything).** Operating an EV's battery as a power source that can export to a home, a building, or the grid, not only draw from it. OCPP 2.1 steers this through bidirectional charging profiles in its functional block Q. Module 11.

**WebSocket.** The transport under OCPP-J: a persistent, full-duplex connection that starts as an HTTP request and is upgraded in place. The charge point opens it, the Central System answers over it, and it stays open so either side can send at any time. Module 6.

**WebSocket subprotocol.** The application protocol named during the WebSocket handshake in the Sec-WebSocket-Protocol header. OCPP-J negotiates versions with it: a station offering ocpp1.6 speaks OCPP 1.6 over JSON. Module 6.
