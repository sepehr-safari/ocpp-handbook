// One description per page, used for meta descriptions on the site and for the
// module list in llms.txt. Keeping them here means the two cannot drift apart,
// and the module files stay pure prose for anyone reading them on GitHub.

export const siteDescription =
  'A free course on EV charging software: the industry, the hardware, the protocols, and the craft of debugging them. Starts at zero, ends at reading raw OCPP frames.'

export const descriptions = {
  'modules/00-orientation':
    'How to use this handbook: one diagram that maps EV charging end to end, the terms it standardizes on, and how it cites the specifications.',
  'modules/01-the-industry':
    'Who is who in EV charging and how the money moves between drivers, charge point operators, e-mobility providers, roaming hubs, and site hosts.',
  'modules/02-the-hardware':
    'Connectors, AC versus DC, what sets charging speed, and the IEC 61851 control pilot handshake that runs before any protocol does.',
  'modules/03-standards-and-regulation':
    'Who writes the rules in EV charging: OCA, ISO, IEC, SAE, and CharIN, plus what EU AFIR and US NEVI actually require.',
  'modules/04-the-protocol-map':
    'The whole protocol map from the EV to the grid: IEC 61851, ISO 15118, OCPP, OCPI, and the grid-facing protocols, and what each one owns.',
  'modules/05-ocpp-overview':
    'OCPP history, governance, and versions: why 1.6J still dominates, what 2.0.1 replaced, and how editions and errata sheets work.',
  'modules/06-ocpp-j-on-the-wire':
    'OCPP-J on the wire: the WebSocket handshake, the CALL, CALLRESULT, and CALLERROR frames, message id correlation, and the ten error codes.',
  'modules/07-the-transaction-lifecycle':
    'The OCPP 1.6 transaction lifecycle end to end: boot, connector status, authorization, StartTransaction, meter values, and the stop.',
  'modules/08-csms-initiated-operations':
    'Operations a backend sends to a charging station: remote start and stop, reset, configuration keys, TriggerMessage, reservations, and firmware updates.',
  'modules/09-smart-charging':
    'OCPP smart charging: charging profiles, purposes and stack levels, composite schedules, and how a backend limit reaches the car.',
  'modules/10-security':
    'OCPP security: the three security profiles, certificate management over the protocol itself, signed firmware, and what 1.6 shipped without.',
  'modules/11-ocpp-201-and-beyond':
    'What OCPP 2.0.1 changed: the device model, TransactionEvent, EVSE addressing, native security, and what OCPP 2.1 adds on top.',
  'modules/12-iso-15118-and-plug-and-charge':
    'ISO 15118 and Plug and Charge: contract certificates, the four PKIs, the eMAID, and how a 15118 session maps onto OCPP messages.',
  'modules/13-why-chargers-break':
    'A field taxonomy of OCPP failures: authorization, connectivity, transaction integrity, metering trust, hardware state, and performance.',
  'modules/14-tracing-and-observability':
    'Capturing and reading OCPP traffic: where to capture, why clocks disagree, and a neutral trace format with conformance fixtures.',
  'modules/15-the-open-source-ecosystem':
    'Open-source EV charging software: CSMS platforms, station firmware, protocol libraries in six languages, simulators, and analysis tools.',
  'modules/16-reading-specifications':
    'How to read the OCPP specification bundles, resolve requirement ids and preconditions, check errata, and track the moving frontier.',
  'modules/17-capstone':
    'An end-to-end lab: run an open CSMS, connect a simulated charge point, capture the traffic two ways, analyze it, and validate the trace.',
  glossary:
    'Working definitions of EV charging and OCPP terms, from AC charging and CPO through TransactionEvent, eMAID, and the V2G Root CA.',
}
