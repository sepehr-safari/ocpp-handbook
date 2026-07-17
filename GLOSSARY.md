# Glossary

Working definitions, added as modules introduce the terms. Where a specification defines a term precisely, the specification wins; these entries are for orientation.

**400-volt / 800-volt architecture.** The voltage of an EV's battery pack. Since power is voltage times current, a higher-voltage pack reaches a given charging power at lower current, which means less heat and thinner cables for the same delivered kilowatts. Module 2.

**AC charging.** Charging where the station supplies alternating current and the car's onboard charger converts it for the battery. Slower, cheaper hardware; the norm at home, work, and destinations.

**Ad hoc payment.** Paying at the charger without a pre-existing account, typically by bank card or a QR-code web flow. Increasingly required by regulation for new public fast chargers.

**AFIR (Alternative Fuels Infrastructure Regulation).** Regulation (EU) 2023/1804, binding across the EU since 2024. Requires open ad hoc payment, per-kilowatt-hour pricing, and price transparency at public fast chargers, and sets deployment targets along the main transport corridors (the TEN-T network). Module 3.

**Battery management system (BMS).** The system inside the vehicle that governs how much power the battery accepts at each moment and protects it as it fills. The final authority on charging power, sitting above every station, cable, or connector limit.

**Capacity charges.** The part of a commercial electricity bill driven by peak power draw rather than energy consumed; called demand charges in North America. A major cost line for fast-charging sites.

**CCS (Combined Charging System).** A DC fast-charging connector that adds two DC pins beneath an existing AC connector, so one car port handles both. CCS1 builds on Type 1 (North America); CCS2 builds on Type 2 (Europe).

**CDR (charge detail record).** The billing record of a completed charging session, exchanged between CPO and eMSP, directly or via a hub, so the driver can be billed and the CPO paid.

**Central System.** OCPP 1.6's name for the operator backend. See CSMS.

**CHAdeMO.** An early DC fast-charging connector of Japanese origin, kept as a separate port rather than combined with an AC connector, now largely superseded outside Japan.

**ChaoJi.** A next-generation DC fast-charging connector developed from the CHAdeMO lineage with Chinese partners, aimed at a higher-power successor to today's fast-charging connectors. Module 3.

**Charge point.** OCPP 1.6's name for the charging station. In 1.6's model, a charge point contains numbered connectors, and connector 0 means the unit itself.

**CharIN.** The industry alliance behind the Combined Charging System (CCS) and the Megawatt Charging System (MCS), which also runs interoperability test events (testivals). Not a formal standards body, yet a decisive one. Module 3.

**Charging station.** The physical charging hardware; this handbook's default term, matching OCPP 2.0.1. Contains one or more EVSEs.

**Connector.** A single plug position on a station, and the unit much of OCPP's status reporting is scoped to.

**Control pilot.** The wire, defined in IEC 61851, that carries the analog handshake between station and car: which connection state the session is in, and how much current the car may draw, the latter encoded as a pulse width. The ground truth beneath OCPP connector status. Module 2.

**CPMS.** Charge point management system; another name for the CSMS, common in vendor material.

**CPO (charge point operator).** The party that operates charging stations: uptime, maintenance, pricing at the plug, and the backend connection. May or may not own the hardware or the site.

**CSMS (charging station management system).** The operator's backend that stations connect to over OCPP. OCPP 2.0.1 term; 1.6 says Central System; colloquially, the backend.

**DC fast charging.** Charging where the station converts to direct current and feeds the battery directly, bypassing the car's onboard charger. Higher power, far more expensive hardware; the public highway segment.

**DSO (distribution system operator).** The operator of the local electricity grid a site connects to. Grants grid connections, charges for capacity, and increasingly wants a say in when charging happens.

**eMIP.** Gireve's roaming hub protocol.

**eMSP (e-mobility service provider).** The party with the driver relationship: app, RFID card, billing, support. Sells access to other parties' chargers. Also written EMP or MSP.

**EV.** Electric vehicle; in this handbook usually a battery-electric car, though the protocols don't much care.

**EVRoaming Foundation.** The organization that stewards OCPI, the CPO-to-eMSP roaming protocol. Module 3.

**EVSE (electric vehicle supply equipment).** Colloquially, the whole charger. Precisely, in OCPP 2.0.1: the part of a charging station that can deliver energy to one EV at a time. A station has one or more EVSEs; an EVSE has one or more connectors, of which one can be active. Module 0 explains why the precision matters.

**GB/T.** China's national EV charging connector standards, with separate AC and DC plugs. The largest connector family by sheer count.

**Idle fee.** A per-minute charge for staying plugged in after charging ends. It protects the only revenue-producing thing on the site: the working connector's time.

**IEC (International Electrotechnical Commission).** The international body for electrotechnical standards, owner of IEC 61851 and IEC 62196 and, jointly with ISO, of ISO 15118. Module 3.

**IEC 61851.** The international standard for the low-level electrical relationship between EV and station: presence, readiness, and permitted current, signaled on the control pilot line. Module 2.

**IEC 62196.** The international standard defining EV connector types, including Type 1 and Type 2. Module 2.

**IEEE 2030.5.** A smart-energy protocol for distributed energy resources; one of the grid-facing protocols a CSMS may speak. Module 4.

**ISO (International Organization for Standardization).** The international standards body that, jointly with the IEC, publishes ISO 15118. Module 3.

**ISO 15118.** The standard for high-level digital communication between EV and station: identification, Plug and Charge, and bidirectional power in its newer editions. Module 12.

**MCS (Megawatt Charging System).** An emerging connector standard for charging heavy trucks at megawatt-class power. Module 2.

**NACS (SAE J3400).** The connector originally developed by Tesla, combining AC and DC in one compact plug, now standardized as SAE J3400 and being adopted more widely across North America. Module 2.

**NEVI (National Electric Vehicle Infrastructure).** A US federal program funding corridor charging, whose minimum standards (23 CFR Part 680) require OCPP, ISO 15118 Plug and Charge, CCS1 connectors, and above 97 percent uptime. Subject to policy change since 2025. Module 3.

**OCA (Open Charge Alliance).** The industry alliance that maintains OCPP and OSCP and distributes the specifications free of charge after registration.

**OCPI (Open Charge Point Interface).** The protocol for exchanging locations, tariffs, sessions, CDRs, and tokens between CPOs and eMSPs, peer to peer or via hubs. Maintained by the EVRoaming Foundation.

**OCPP (Open Charge Point Protocol).** The protocol between charging stations and the CSMS; the subject of most of this handbook. Maintained by the OCA.

**OCPP certification.** The Open Charge Alliance program that tests a station or CSMS against a defined OCPP profile using a compliance testing tool and accredited labs. Proves conformance to the profile, not field correctness across vendor pairs. Module 3.

**OCPP-J.** OCPP carried as JSON over WebSocket, as opposed to the legacy SOAP transport. "1.6J" means OCPP 1.6 in this transport.

**OICP.** Hubject's roaming hub protocol.

**Onboard charger.** The AC-to-DC converter inside the vehicle. Its power rating caps how fast a car can charge on AC, and it is bypassed entirely during DC charging.

**OpenADR.** A demand-response protocol between energy actors and large loads; grid-facing, met in Modules 4 and 9.

**OSCP (Open Smart Charging Protocol).** An OCA protocol for communicating capacity budgets between grid parties and charging operators. Modules 4 and 9.

**Plug and Charge.** The ISO 15118 feature where the car authenticates itself, and payment follows automatically once the cable clicks in. No app, no card.

**Proximity pilot.** A connection that tells the car a plug is physically seated (many cars won't move while charging), and in some cables encodes how much current the cable can safely carry. Module 2.

**RFID.** The tap-card authorization method that dominated early public charging and is still everywhere. The card carries a token some eMSP vouches for.

**Roaming.** The arrangement that lets an eMSP's customers charge on networks they hold no direct contract with, with data and settlement flowing between the parties behind the scenes.

**Roaming hub.** A platform CPOs and eMSPs each connect to once for many-to-many roaming, instead of maintaining bilateral links. Hubject and Gireve are the big ones.

**SAE International.** The standards body behind several North American EV standards, including SAE J1772 (Type 1) and SAE J3400 (NACS). Module 3.

**Site host.** The party that controls the location where stations stand, typically earning rent, a revenue share, or foot traffic.

**Three-phase.** An AC supply with three live conductors, standard for premises in much of the world outside North America. It lets an AC station reach roughly 11 or 22 kW where a single phase tops out far lower. Module 2.

**Type 1 (SAE J1772).** A single-phase AC connector used in North America and Japan. The base for CCS1.

**Type 2 (IEC 62196-2).** The AC connector standard across Europe and much of the world, single or three phase. The base for CCS2.

**Utilization.** The share of time a charger spends actively delivering energy. The ratio that decides whether a public charging site pays for itself.
