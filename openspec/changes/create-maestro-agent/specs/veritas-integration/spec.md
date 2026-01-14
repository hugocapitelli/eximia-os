## ADDED Requirements

### Requirement: Veritas First Protocol
The Maestro agent SHALL consult The_Veritas research agent before providing any factual claims, temporal data, or externally verifiable information. This protocol is non-negotiable and hard-coded.

#### Scenario: Factual query received
- **WHEN** a user asks a question involving facts, dates, prices, laws, or current events
- **THEN** the Maestro SHALL formulate a precise research query
- **AND** invoke The_Veritas before responding
- **AND** cite the Veritas source in the final response

#### Scenario: Attempting to bypass Veritas
- **WHEN** any internal logic attempts to answer factual queries from parametric memory
- **THEN** the Maestro SHALL block the response
- **AND** force a Veritas lookup regardless of perceived confidence

#### Scenario: User requests immediate answer
- **WHEN** a user explicitly asks for an instant response without research
- **THEN** the Maestro SHALL acknowledge the request
- **AND** explain that accuracy requires Veritas validation
- **AND** offer a preliminary response clearly marked as "unverified"

---

### Requirement: Veritas Query Formulation
The Maestro agent SHALL transform user queries into optimized research queries that maximize Veritas retrieval accuracy.

#### Scenario: Ambiguous user query
- **WHEN** a user query is ambiguous or underspecified
- **THEN** the Maestro SHALL disambiguate using intent classification (KB_09)
- **AND** generate a precise Veritas query before routing

#### Scenario: Multi-part research request
- **WHEN** a request requires multiple distinct research topics
- **THEN** the Maestro SHALL decompose into separate Veritas queries
- **AND** aggregate results before synthesis

---

### Requirement: Veritas Output Validation
The Maestro agent SHALL cross-reference Veritas outputs against internal Knowledge Bases to detect inconsistencies, outdated information, or hallucinations from sub-agents.

#### Scenario: Veritas returns contradictory data
- **WHEN** Veritas data contradicts information from a specialist agent
- **THEN** the Maestro SHALL flag the discrepancy
- **AND** prioritize Veritas data for factual claims
- **AND** note the conflict in the response

#### Scenario: Veritas returns no results
- **WHEN** Veritas cannot find relevant information
- **THEN** the Maestro SHALL inform the user of the limitation
- **AND** offer to proceed with KB-only information clearly marked as "internal knowledge"

#### Scenario: Suspected hallucination from specialist
- **WHEN** a specialist agent cites a law, regulation, or data point not found in Veritas
- **THEN** the Maestro SHALL quarantine the claim
- **AND** request verification from Veritas before including in final output

---

### Requirement: Research-Before-Opinion Enforcement
The Maestro agent SHALL ensure that all specialist agents receive Veritas-validated context before generating opinions, recommendations, or strategic advice.

#### Scenario: Strategic decision request
- **WHEN** a user requests strategic advice (e.g., market entry, legal strategy)
- **THEN** the Maestro SHALL first invoke Veritas for current market/regulatory context
- **AND** pass Veritas findings to the relevant specialist as input context
- **AND** ensure the specialist's opinion is grounded in validated facts

#### Scenario: Specialist attempts opinion without context
- **WHEN** a specialist is invoked without prior Veritas validation
- **THEN** the Maestro SHALL intercept the routing
- **AND** inject a Veritas lookup before completing the specialist call

---

### Requirement: Citation and Traceability
The Maestro agent SHALL maintain 100% citation compliance, tracking which agent or source generated each piece of information in the final response.

#### Scenario: User requests source attribution
- **WHEN** a user asks "where did this information come from?"
- **THEN** the Maestro SHALL provide a citation trace
- **AND** identify whether data came from Veritas, a specialist agent, or internal KBs

#### Scenario: Audit trail generation
- **WHEN** a response is delivered
- **THEN** the Maestro SHALL log the complete orchestration chain
- **AND** record all Veritas queries and responses for traceability
