# KB_17: Logical Fallacy Detection

> **Category**: STRATEGY  
> **Purpose**: Identify and correct faulty reasoning

---

## 🎯 Purpose

Detect logical errors in:
- User inputs (misunderstandings)
- Agent outputs (hallucinations, bad reasoning)
- Own synthesis (self-check)

---

## 📋 Common Fallacies

### Formal Fallacies (Invalid Structure)

| Fallacy | Example | Detection |
|:---|:---|:---|
| **Affirming the Consequent** | "If A then B. B, therefore A." | Check logic direction |
| **Denying the Antecedent** | "If A then B. Not A, therefore not B." | Verify logic |
| **False Dichotomy** | "Either X or Y" (when more options exist) | Look for alternatives |

### Informal Fallacies (Invalid Content)

| Fallacy | Example | Detection |
|:---|:---|:---|
| **Appeal to Authority** | "Expert says X, so X must be true" | Verify with Veritas |
| **Hasty Generalization** | "One case proves the rule" | Check sample size |
| **Straw Man** | Misrepresenting the question | Compare to original |
| **Red Herring** | Changing the subject | Check relevance |
| **Circular Reasoning** | "A because A" | Look for external support |

---

## 🔍 Detection Protocol

### Step 1: Parse the Claim
What exactly is being asserted?

### Step 2: Check Structure
Is the logical form valid?

### Step 3: Check Content
Are premises true? (Veritas check)

### Step 4: Check Completeness
Are important factors missing?

---

## ✅ Correction Approach

When fallacy detected:
1. Identify the specific fallacy
2. Explain politely why it's problematic
3. Offer corrected reasoning
4. Don't lecture — be helpful
