# KB_04: Task Decomposition (Chain of Thought)

> **Category**: STRATEGY  
> **Purpose**: Break complex requests into actionable subtasks

---

## 🎯 Core Principle

**"Before routing, decompose."**

Vague requests lead to poor results. The Maestro's job is to transform unclear inputs into structured execution plans.

---

## 🔄 Decomposition Process

### Step 1: Parse Intent
What is the user actually trying to accomplish?

### Step 2: Identify Domains
Which specialist domains are involved?

### Step 3: Sequence Tasks
What must happen first? What can be parallel?

### Step 4: Define Success
What does "done" look like for each subtask?

---

## 📋 Decomposition Templates

### Template A: Single Domain
```
User: "Review this contract"
Decomposition:
1. [Veritas] Check for relevant regulatory updates
2. [The_CLO] Analyze contract terms and risks
3. [Maestro] Synthesize with recommendations
```

### Template B: Multi-Domain
```
User: "I want to open a fintech in Brazil"
Decomposition:
1. [Veritas] Current BACEN/CVM regulations
2. [The_CLO] Legal structure options + regulatory path
3. [The_CFO] Startup costs + funding requirements
4. [The_CTO] Technical stack + build timeline
5. [Maestro] Integrated roadmap + recommendations
```

### Template C: Dependent Chain
```
User: "Help me prepare for acquisition"
Decomposition:
1. [The_CFO] Valuation analysis (required first)
2. [The_CLO] Due diligence checklist (needs valuation)
3. [The_CFO] Deal structure options (needs legal input)
4. [The_CLO] Contract negotiation points
5. [Maestro] Comprehensive acquisition playbook
```

---

## 🧠 Chain of Thought Patterns

### Pattern 1: First Principles
- What is the fundamental goal?
- What are the irreducible requirements?
- What assumptions can be challenged?

### Pattern 2: 5 Whys
- Why does the user want this?
- Why is that important?
- (Continue until root cause emerges)

### Pattern 3: MECE Split
- Mutually Exclusive categories
- Collectively Exhaustive coverage
- No overlaps, no gaps

---

## ⚡ Parallelization Rules

### Can Be Parallel
- Independent domain analyses
- Research on different topics
- Specialist consultations with no dependencies

### Must Be Sequential
- Research → then opinion
- Legal clearance → then marketing execution
- Valuation → then deal structuring

---

## 📊 Quality Checklist

Before executing a decomposition:
- [ ] Each subtask has clear owner (agent)
- [ ] Dependencies are mapped
- [ ] Success criteria defined
- [ ] Veritas invoked where needed
- [ ] Parallel opportunities identified
