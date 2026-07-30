# Module 13: Why chargers break: failure patterns

Module 12 closed Part III with the protocol at its most refined: a car authenticating itself with certificates, no card, no app, energy flowing on a handshake. Part IV starts from the opposite end, where at any given moment some fraction of stations are misbehaving in ways no specification describes. Module 3 warned that certification proves conformance to a profile at a specific moment, not correct behavior across every edge case, network condition, and firmware revision in the field. This module is where that gap becomes concrete. It is a taxonomy of the ways charging goes wrong on the wire: what each pattern looks like in the traffic, what the operator sees, what tends to cause it, and which earlier module explained the machinery.

## What you'll learn

- A seven-family taxonomy of wire-visible failure patterns, from rejected tokens to unanswered calls
- What each pattern looks like in raw OCPP 1.6 traffic, and what the operator experiences at the same moment
- Plausible root causes for each pattern, and the benign explanations to rule out first
- Which patterns are true spec violations and which are heuristics, and why that decides how you debug
- The 1.6 rules that explain most apparent mysteries: offline queueing, register monotonicity, the status transition table
- Where the taxonomy comes from, and how to check the same conditions with nothing but captured frames

## Where the taxonomy comes from

The taxonomy below is the detection rule set of the OCPP DebugKit toolkit, a trace analyzer I maintain: sixteen rules that scan captured OCPP traffic for the signatures in this module, four graded critical, ten warning, and two info. The rules are public code anyone can read or reimplement, and you do not need the tool: every condition here can be checked by a short script over captured frames, or by eye in a small trace. The transferable knowledge is the taxonomy, not the software.

Grouped by what they protect, the sixteen rules form seven families:

| Family | Rules (severity) |
| --- | --- |
| Authorization | FAILED_AUTHORIZATION (warning) |
| Connectivity and liveness | REPEATED_BOOT_NOTIFICATION (warning), TIMEOUT_NO_HEARTBEAT (warning), HEARTBEAT_INTERVAL_VIOLATION (info), UNRESPONSIVE_CSMS (critical) |
| Transaction integrity | STATION_OFFLINE_DURING_SESSION (critical), UNEXPECTED_START (warning), INVALID_STOP_REASON (info), SUSPICIOUS_SESSION_DURATION (warning) |
| Metering trust | METER_VALUE_GAP (warning), METER_VALUE_ANOMALY (warning) |
| Hardware state | CONNECTOR_FAULT (critical), STATUS_TRANSITION_VIOLATION (warning) |
| Maintenance operations | DIAGNOSTICS_FAILURE (critical), FIRMWARE_UPDATE_FAILURE (warning) |
| Performance | SLOW_RESPONSE (warning) |

One framing rule before the families. A detector encodes an approximation of the spec's model. Some patterns are outright violations: a decreasing energy register breaks a MUST. Others are legal behavior that usually means trouble anyway: a station that sends no heartbeats is allowed to. Reading a finding correctly means going back to the spec text, so each family cites the sections that settle the question. Module 7 previewed a few of these; here is the full set.

## Authorization failures

The smallest family has one member, and it strikes before any energy flows. A charge point must authorize before supplying energy: if the presented token is not in the local authorization list or the authorization cache, the station sends an Authorize request, and the response carries an idTagInfo status (OCPP 1.6 edition 2, section 4.1). The status has five values: Accepted, plus Blocked, Expired, Invalid (the identifier is unknown), and ConcurrentTx, which applies only to transaction starts (OCPP 1.6 edition 2, section 7.2).

On the wire the pattern is unmistakable: an Authorize call answered with a refusing status, then no transaction. What the operator sees is a support ticket saying the charger is broken, when the hardware is fine and the identity layer failed. Plausible causes: an unknown or mistyped token, an expired or blocked contract, or roaming provisioning lag, where the token is valid at the driver's eMSP but has not yet reached the operator's CSMS. A station may also authorize locally against a stale list or cache; the spec therefore has the Central System verify the identifier again in the StartTransaction response, so a session can start and then be deauthorized (OCPP 1.6 edition 2, section 4.8). One caution: the toolkit's rule fires only on Invalid, while Blocked, Expired, and ConcurrentTx end the driver's day just as thoroughly. Read a detector's trigger before trusting its silence. Module 7 covered the mechanics.

## Connectivity and liveness

Module 6 taught that a station has two lifecycles: the WebSocket connection and the registration on top of it. This family is their failures seen from the traffic side; the operator sees a dashboard that lies, stations frozen in stale states or flapping between online and offline.

Repeated boots come first. A charge point sends BootNotification every time it starts, and until the Central System accepts it, or parks it in Pending, it must not send any other request; when the answer is not Accepted, the response's interval field sets the minimum wait before the next attempt (OCPP 1.6 edition 2, section 4.2). Two or more BootNotifications within a few minutes mean the device is restarting over and over: power problems, a crash loop, a watchdog cycle, or a rejecting CSMS retried on that clock.

Heartbeat findings carry the framing rule's warning. The heartbeat exists so the Central System knows the station is still there, but with JSON over WebSocket heartbeats are not mandatory when other traffic is flowing; the spec advises one per 24 hours for time synchronization and tells the Central System to treat any received message as proof of liveness (OCPP 1.6 edition 2, section 4.6). A busy station that never heartbeats is legal, so missed or irregular heartbeats are heuristics: worth checking, never a conviction. The expected interval comes from the BootNotification response; any fallback an analyzer uses when it never saw the boot is a tool number, not a spec number.

Unanswered calls are the sharpest signal in the family. Every CALL expects exactly one response, matched by message id (Module 6). A CALL with no matching answer anywhere in the trace means the peer never answered or the answer never arrived: a socket that died unnoticed, a crashed handler, a message lost across a reconnect. It hurts twice, because the one-outstanding-call convention leaves everything queued behind the silent call waiting too. The toolkit rule's name points at the CSMS, but the pattern is symmetric: an unanswered call to the station looks exactly the same.

## Transaction integrity

This family is where failures become money. The heaviest pattern is a StartTransaction with no matching StopTransaction: energy delivered with no recorded ending, so billing is a guess. Before blaming the station, apply the offline rules from Module 7. When offline, a charge point must queue its transaction-related messages (StartTransaction, StopTransaction, and periodic or clock-aligned MeterValues) and is expected to deliver them in chronological order after reconnecting; retries follow the TransactionMessageAttempts and TransactionMessageRetryInterval keys with growing waits, and a station that exhausts its attempts discards the message (OCPP 1.6 edition 2, section 3.7). A session that never stopped may be a StopTransaction still queued, delivered after your capture ended, or discarded forever, and each explanation points at a different fix.

The spec is blunt about who controls endings: "The Central System cannot prevent a transaction from stopping" (OCPP 1.6 edition 2, section 4.10). The backend must confirm the stop even when its own sanity checks fail; withholding the confirmation only buys retries (same section).

A StartTransaction with no earlier BootNotification or Authorize looks alarming and often is not. A remote start with the AuthorizeRemoteTxRequests key set to false legally begins the transaction immediately, with authorization checked only when the CSMS processes the StartTransaction (OCPP 1.6 edition 2, section 5.11). A capture that began mid-story produces the same shape, so treat the pattern as a prompt to establish context, not a verdict.

Two smaller checks round out the family. The stop reason field draws from an enumeration of exactly eleven values and may be omitted for a normal ending, in which case Local is assumed (OCPP 1.6 edition 2, sections 7.36 and 4.10); a value outside the set means firmware inventing vocabulary, often borrowed from another protocol version, and strict parsers will refuse it. Sessions under a minute or over 24 hours earn a review flag: short ones read as aborted starts or mid-session deauthorization, long ones as a missed stop or a vehicle parked for days. Both thresholds are tool choices; an overnight hotel session is legitimate, and the flag exists so a human decides.

## Metering trust

The meter is the cash register, and 1.6 protects it with one strong rule and a lot of configuration freedom. The freedom first: the charge point decides when to sample, driven by its configured acquisition intervals (OCPP 1.6 edition 2, section 4.7). A completed session with zero MeterValues between start and stop is therefore not illegal, but it leaves billing resting entirely on meterStart and meterStop, with no curve to audit. Causes range from sampling intervals set to zero, to firmware failing silently, to samples discarded after offline retries ran out (OCPP 1.6 edition 2, section 3.7).

Monotonicity is the strong rule, the one Module 7 left for here. All register values within a single transaction must be monotonically increasing in time, and the spec wants registers reported exactly as read from the meter's non-volatile register, not re-based to zero at session start, precisely so the backend can detect missing energy between sequential transactions, whether from hardware fault, mis-wiring, or fraud (OCPP 1.6 edition 2, section 7.31). An absent measurand field means the cumulative imported energy register, in watt-hours (OCPP 1.6 edition 2, section 7.43). A register that decreases or goes negative is one of the few unambiguous violations in this module: a meter fault, a firmware re-basing or unit bug, a register reset, or tampering. Checking it well takes care, though. Only cumulative registers must climb; power, current, and state of charge legitimately rise and fall, and readings must be compared within one series (same connector, measurand, phase, unit, location) or the check flags noise as fraud.

## Hardware state

Now the failures that are physically real, expressed through Module 7's status model. A StatusNotification with status Faulted during an active transaction means the station has reported an error and cannot deliver energy (OCPP 1.6 edition 2, section 7.7), with an errorCode from a sixteen-value enumeration that reads like a maintenance log: ConnectorLockFailure, GroundFailure, HighTemperature, OverCurrentFailure, and the rest (OCPP 1.6 edition 2, section 7.6). The operator sees the session die and the connector leave the rotation until a reset or a site visit clears it. This is the most honestly hardware family in the module: locks jam, boards overheat, ground faults trip. Even here the spec grades severity: EVCommunicationError may only accompany the Preparing, SuspendedEV, SuspendedEVSE, and Finishing states and is meant as a warning, not a fault; the spec's own guidance is that a communication problem with the vehicle is no reason to go Faulted, and SuspendedEVSE is the state to report (OCPP 1.6 edition 2, sections 4.9 and 7.6). Not every errorCode is a truck roll.

The subtler pattern is the impossible transition. Section 4.9 of the spec contains a table of the status transitions a charge point may report, and some jumps are absent from it: Charging straight to Reserved, Available straight to Finishing. Seeing one in a trace usually means notifications were lost or reordered rather than that physics broke. The spec's own reconnection rules explain how: after coming back online a station should report its current status if it changed, should not replay historical changes, and must send notifications in the order events occurred (OCPP 1.6 edition 2, section 4.9). A gap spent offline can make legal reality look illegal in the capture. This is also where detector approximation bites hardest: the toolkit's transition matrix does not match the spec's table exactly, in either direction, so treat a transition flag as an instruction to open the table in section 4.9, not as a verdict.

## Maintenance operations and performance

Module 8 introduced the two maintenance flows, and both fail in visible ways. A diagnostics upload announces its progress through DiagnosticsStatusNotification, whose enumeration is Idle, Uploaded, UploadFailed, and Uploading, with UploadFailed the only failure value (OCPP 1.6 edition 2, section 7.24). The toolkit grades that failure critical because of what it compounds: you asked for diagnostics because something already looked wrong, and now the evidence cannot leave the station. Unreachable upload servers, bad credentials, and firewalls are the usual suspects.

Firmware updates report through FirmwareStatusNotification, and in 1.6 the failure values are DownloadFailed and InstallationFailed (OCPP 1.6 edition 2, section 7.25). A failed download leaves the station on its old firmware, which is an inconvenience; a failed installation can leave it degraded, which is not. Watch the vocabulary here: field firmware sometimes emits status strings borrowed from later protocol generations, and detectors written loosely inherit the confusion. The toolkit's current rule, for instance, matches several strings that are not 1.6 vocabulary while missing the spec's own InstallationFailed. Describe what you see in the spec's terms first, and you will catch both the station's drift and the tool's.

Performance closes the taxonomy. OCPP-J says a party should not send a new CALL until its previous one has been answered or has timed out, and it deliberately leaves the timeout implementation-dependent, recommending only that it fit the network (OCPP-J 1.6 specification, section 4.1.1). No numeric response deadline exists anywhere in the spec; the toolkit's ten-second threshold is a heuristic. Slow responses still matter, because the one-outstanding-call convention from Module 6 turns one slow reply into a stalled queue: heartbeats late, meter values delayed, everything waiting. Overloaded backends, synchronous lookups inside the CSMS (a roaming authorization making its own round trip), and congested cellular links produce the same signature.

## Key takeaways

- Wire-visible failures cluster into seven families: authorization, connectivity and liveness, transaction integrity, metering trust, hardware state, maintenance operations, and performance. The taxonomy transfers to any tool, script, or trained eye.
- Some patterns are violations and some are heuristics: a decreasing energy register breaks a MUST (section 7.31), while skipped heartbeats are legal (section 4.6) and OCPP-J sets no numeric response timeout (section 4.1.1). Detectors approximate the spec; when a rule fires, the spec text is the authority.
- Offline queueing (section 3.7) explains most missing-message mysteries: a session that never stopped may be a StopTransaction that is queued, late, or discarded after retries ran out.
- A StartTransaction with no prior Authorize can be legal (remote start, section 5.11), and a capture window that opened late or closed early manufactures phantom findings. Establish context before convicting.
- Metering trust rests on register monotonicity and on never re-basing registers to zero (section 7.31), which lets a backend detect missing energy even between sessions.
- Every pattern in this module can occur in a certified product. This is the certified-versus-correct gap from Module 3, made concrete.

## Try it

> Open the connector-fault fixture in the Open OCPP Trace specification repository (linked below), part of a neutral trace format I helped design; Module 14 covers the format itself. The file is twenty lines of JSON, one frame per line, fully synthetic. Read it top to bottom and reconstruct the story: boot, status reports, an authorization, the start of transaction 100002, charging, meter values. Find the StatusNotification that reports Faulted, note its errorCode, and watch what happens to the transaction immediately afterward. Decide which families from this module apply, then check your reading against expected.json in the same directory. Anything that reads JSON lines works if you prefer tooling: grep, jq, a short script, or the toolkit's inspect command.

## Further reading

- [Open Charge Alliance protocols page](https://openchargealliance.org/protocols/open-charge-point-protocol/), source of the OCPP 1.6 documents cited throughout, free after registration.
- [OCPP DebugKit toolkit](https://github.com/ocpp-debugkit/toolkit), the trace analyzer whose detection rules this module's taxonomy comes from.
- [detection.ts](https://github.com/ocpp-debugkit/toolkit/blob/main/packages/toolkit/src/core/detection.ts), the sixteen rules as readable code, trigger logic and suggested next steps included.
- [Open OCPP Trace specification](https://github.com/open-ocpp-trace/specification), the neutral trace format repository whose fixtures the exercise uses.
- [connector-fault trace.jsonl](https://github.com/open-ocpp-trace/specification/blob/main/fixtures/connector-fault/trace.jsonl), the file the exercise reads.

---

Previous: [Module 12: ISO 15118 and Plug and Charge](12-iso-15118-and-plug-and-charge.md) | [Contents](../README.md) | Next: [Module 14: Tracing and observability](14-tracing-and-observability.md)
