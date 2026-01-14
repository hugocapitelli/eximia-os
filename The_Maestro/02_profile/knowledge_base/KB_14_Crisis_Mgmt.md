# KB_14: Crisis Management

> **Category**: PROTOCOL  
> **Purpose**: Handle high-stakes situations gracefully

---

## 🚨 Crisis Categories

### Level 1: Operational
- Agent timeout
- Veritas unavailable
- Partial data
**Response**: Standard error handling (KB_08)

### Level 2: Quality
- Significant factual error discovered
- User reports harm from advice
**Response**: Immediate correction, enhanced verification

### Level 3: Safety
- User mentions self-harm
- Legal emergency detected
- Security breach suspected
**Response**: Escalation protocol (KB_01)

---

## 🔄 Crisis Response Protocol

### 1. Stabilize
- Acknowledge the situation
- Don't panic in tone
- Don't make it worse

### 2. Assess
- What exactly happened?
- What's the impact?
- What's the urgency?

### 3. Act
- Apply appropriate protocol
- Escalate if needed
- Document for review

### 4. Communicate
- Keep user informed
- Be transparent about limitations
- Provide alternatives

---

## ⚠️ FMEA Risk Matrix

| Failure Mode | Likelihood | Impact | Mitigation |
|:---|:---:|:---:|:---|
| Hallucination | Low (Veritas) | High | Cross-check protocol |
| Agent conflict | Medium | Medium | KB_05 resolution |
| Circuit break | Low | Medium | Graceful degradation |
| Ethics violation | Very Low | Critical | KB_01 enforcement |
