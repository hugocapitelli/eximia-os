# KB_03 — Dependency Management

## O que são Dependências de Agentes?

Uma **dependência** ocorre quando Agente A precisa que Agente B exista e esteja funcional antes de poder operar corretamente.

```
The_Negotiator → depends on → The_CLO
  (precisa validação legal)
```

---

## Tipos de Dependências

### 1. Hard Dependency (Bloqueante)
Agente A **não pode funcionar** sem Agente B.

**Exemplo:**
```
Copy_Chief → Gary_Halbert
  (Copy Chief orquestra, precisa dos copywriters prontos)

The_CFO → The_Veritas
  (precisa research verificado para valuation)
```

**Regra:** NÃO construir A até que B esteja em status `production`.

---

### 2. Soft Dependency (Melhoria)
Agente A funciona sem B, mas fica **significativamente melhor** com B.

**Exemplo:**
```
The_CEO → The_Veritas
  (CEO pode delegar sem Veritas, mas qualidade cai)

The_Negotiator → The_CFO
  (pode negociar sem CFO, mas análise financeira ajuda)
```

**Regra:** Pode construir A, mas priorize B logo depois.

---

### 3. Circular Dependency (Anti-Pattern)
Agente A depende de B, B depende de A. **Impossível resolver.**

**Exemplo (ruim):**
```
❌ Agent_X → Agent_Y
❌ Agent_Y → Agent_X
```

**Solução:** Refatorar para criar Agent_Z (base comum) que ambos usam.

```
✅ Agent_X → Agent_Z
✅ Agent_Y → Agent_Z
```

---

## Padrões Comuns de Dependências

### Padrão 1: Foundation Agent
Um agente base usado por muitos outros.

**Exemplo: The_Veritas**
```
The_Veritas (Research Engine)
    ↑
    ├─ The_CFO (precisa dados verificados)
    ├─ The_CLO (precisa regulatory data)
    ├─ The_CMO (precisa market data)
    ├─ The_Maestro (precisa fact-checking)
    └─ The_CEO (precisa research)
```

**Estratégia:** Construir The_Veritas PRIMEIRO (desbloqueia todos).

**RICE Adjustment:**
```
Se Veritas tem RICE 4.0, mas desbloqueia 5 agentes:
→ Effective RICE = 4.0 + (0.5 × 5) = 6.5
→ Prioridade MÁXIMA
```

---

### Padrão 2: Executor + Orchestrator
Orchestrator depende de Executors.

**Exemplo: Copy_Chief + Copywriters**
```
Copy_Chief (Orchestrator)
    ↑
    ├─ Gary_Halbert (Executor)
    ├─ Gary_Bencivenga (Executor)
    ├─ David_Ogilvy (Executor)
    └─ ...
```

**Estratégia:**
1. Construir 1-2 Executors primeiro (quick wins)
2. Construir Orchestrator (já tem algo pra orquestrar)
3. Adicionar resto dos Executors incrementalmente

---

### Padrão 3: Domain Hierarchy
Agentes especializados dependem de generalista.

**Exemplo: The_CLO + Sub-agentes**
```
The_CLO (Legal Generalist)
    ↑
    ├─ Corporate_Contracts (Specialist)
    ├─ Digital_Compliance (Specialist)
    └─ Litigation_Sniper (Specialist)
```

**Estratégia:**
1. Construir The_CLO primeiro (broad coverage)
2. Sub-agentes vêm depois (refinamento)

---

### Padrão 4: Sequential Pipeline
Cada agente depende do anterior (factory pipeline).

**Exemplo: Clone Factory**
```
C1_Hunter → C2_Extractor → C3_Creator → C4_Auditor
```

**Estratégia:** Ordem fixa, não há alternativa.

---

## Detectando Dependências

### Perguntas para Identificar Dependências

**1. Esse agente precisa chamar outro agente?**
- Se SIM → hard dependency

**Exemplo:**
```
The_Negotiator calls The_CLO para validar cláusulas
→ The_Negotiator depends on The_CLO
```

---

**2. Esse agente precisa de dados/outputs de outro?**
- Se SIM → hard ou soft dependency

**Exemplo:**
```
The_CFO precisa market data de The_Veritas
→ The_CFO depends on The_Veritas (hard)
```

---

**3. Existe overlap de domínio?**
- Se SIM → pode haver soft dependency

**Exemplo:**
```
The_Negotiator (contracts) + The_CFO (financial terms)
→ Soft dependency (melhora, mas não bloqueia)
```

---

**4. Usa Knowledge Bases de outro agente?**
- Se SIM → soft dependency (ou extract KB pra shared)

**Exemplo:**
```
The_Strategist usa KBs de The_CEO (strategic planning)
→ Soft dependency (ou mover KB pra shared/)
```

---

## Resolvendo Dependencies no Backlog

### Estratégia 1: Build Foundation First
Identifique agentes que **desbloqueiam muitos outros**.

```
Backlog:
- The_Veritas (desbloqueia 5 agentes)
- The_Negotiator (depende de CLO)
- The_CLO (depende de Veritas)
- The_Analyst (depende de Veritas)

Ordem ideal:
1. The_Veritas (desbloqueia tudo)
2. The_CLO (agora pode usar Veritas)
3. The_Negotiator (agora CLO está pronto)
4. The_Analyst (Veritas já pronto)
```

---

### Estratégia 2: Minimum Viable Dependency
Construa versão mínima do dependency para desbloquear.

**Exemplo:**
```
The_Negotiator precisa The_CLO (Tier 3, 35h)

MVP:
- Construir CLO_Lite (Tier 1, 6h) com apenas contract review
- Desbloqueia The_Negotiator
- Evoluir CLO_Lite → The_CLO depois
```

---

### Estratégia 3: Dependency Injection
Faça o agente **parametrizável** - pode funcionar com ou sem dependency.

**Exemplo:**
```python
The_Negotiator:
  if The_CLO.available():
      legal_check = The_CLO.review(contract)
  else:
      legal_check = "⚠️ Manual legal review required"
```

**Vantagem:** Desbloqueia construção sem dependency.
**Desvantagem:** Funcionalidade degradada.

---

## Dependency Graph Visualization

### Notação
```
Agent_A → Agent_B   (A depende de B)
Agent_A ⇢ Agent_B   (A soft-depende de B)
```

### Exemplo: eximIA.OS (Simplified)

```
The_Maestro (Orchestrator)
    ↓
    ├─→ The_Veritas (Foundation)
    ├─⇢ The_CEO
    ├─⇢ The_CFO → The_Veritas
    ├─⇢ The_CLO → The_Veritas
    └─⇢ The_CMO → The_Veritas

Copy_Chief (Orchestrator)
    ↓
    ├─→ Gary_Halbert
    ├─→ Gary_Bencivenga
    ├─→ David_Ogilvy
    └─→ Eugene_Schwartz

The_Negotiator
    ↓
    └─→ The_CLO → The_Veritas
```

**Insights:**
- **The_Veritas** é critical path (muitos dependem dele)
- **Copy_Chief** precisa de copywriters prontos
- **The_Negotiator** tem chain: Negotiator → CLO → Veritas

---

## Decisões de Priorização com Dependencies

### Cenário 1: High RICE mas Bloqueado

```yaml
Agent: The_Negotiator
RICE: 8.0 (altíssimo)
Dependency: The_CLO (status: planned)

Decisão:
  1. Build The_CLO primeiro (RICE 5.0)
  2. Depois build The_Negotiator

Rationale:
  CLO desbloqueia Negotiator + tem valor próprio
```

---

### Cenário 2: Foundation vs. Quick Win

```yaml
Option A: The_Veritas (RICE 4.5, Effort 35h, desbloqueia 5 agentes)
Option B: Harven_Tester (RICE 3.0, Effort 5h, standalone)

Decisão:
  Build B primeiro (quick win, momentum)
  Depois A (foundation, long-term value)

Rationale:
  - B entrega valor em 1 dia
  - A leva 1 semana mas desbloqueia pipeline inteiro
  - Fazer B enquanto planeja A
```

---

### Cenário 3: Circular Dependency

```yaml
❌ Problem:
  Agent_X → Agent_Y
  Agent_Y → Agent_X

✅ Solution:
  Create Agent_Z (shared foundation)
  Agent_X → Agent_Z
  Agent_Y → Agent_Z
```

**Exemplo Real:**
```
❌ The_CEO → The_Veritas (delegação)
❌ The_Veritas → The_CEO (approval)

✅ Solução:
  The_Veritas é foundation (constrói primeiro)
  The_CEO usa Veritas (não vice-versa)
```

---

## Tracking Dependencies no Backlog

### YAML Format

```yaml
agents_backlog:
  - id: the_negotiator
    name: "The_Negotiator"
    tier: 2
    dependencies:
      hard:
        - the_clo
      soft:
        - the_cfo
    status: planned
    blocked: true  # CLO ainda não está production

  - id: the_clo
    name: "The_CLO"
    tier: 3
    dependencies:
      hard:
        - the_veritas
      soft: []
    status: in_progress
    blocked: false  # Veritas já está production
```

---

### Dependency Check Logic

```python
def is_blocked(agent):
    for dep in agent.hard_dependencies:
        if dep.status != "production":
            return True
    return False

def next_buildable():
    candidates = [a for a in backlog if not is_blocked(a)]
    return max(candidates, key=lambda a: a.rice_score)
```

---

## Anti-Patterns de Dependencies

### ❌ Anti-Pattern 1: Ignoring Dependencies
**Problema:** Construir The_Negotiator sem The_CLO pronto
**Resultado:** Agente semi-funcional, precisa rebuild depois

---

### ❌ Anti-Pattern 2: Over-Dependencies
**Problema:** Fazer agente depender de 5+ outros
**Resultado:** Impossível de construir, sempre bloqueado

**Solução:** Refatorar para depender de 1-2 foundations.

---

### ❌ Anti-Pattern 3: Implicit Dependencies
**Problema:** Não documentar que Agent_A usa Agent_B
**Resultado:** Quebra em produção quando B muda

**Solução:** Declarar todas as dependencies explicitamente.

---

## Dependency Checklist

### Ao Adicionar Agente ao Backlog

```markdown
☐ Listar todos os agentes que este agente vai chamar
☐ Listar todos os agentes cujos outputs ele precisa
☐ Classificar cada dependency (hard vs. soft)
☐ Verificar se dependencies estão em production
☐ Se bloqueado, marcar blocked: true
☐ Calcular critical path (quantos níveis de dependency)
```

### Ao Priorizar Backlog

```markdown
☐ Filtrar agentes bloqueados (não podem ser built)
☐ Priorizar foundations (desbloqueiam muitos)
☐ Considerar "effective RICE" (RICE + unlock value)
☐ Evitar começar agentes com >3 níveis de dependency
```

---

## Exemplos Práticos

### Exemplo 1: Build Order for New Ecosystem

**Backlog Inicial:**
- The_Maestro (orchestrator)
- The_Veritas (research)
- The_CFO (finance)
- The_CLO (legal)

**Dependency Graph:**
```
Maestro → Veritas, CFO, CLO
CFO → Veritas
CLO → Veritas
```

**Build Order:**
```
1. The_Veritas (foundation, desbloqueia 3)
2. The_CFO (agora Veritas pronto)
3. The_CLO (agora Veritas pronto)
4. The_Maestro (agora todos prontos)
```

---

### Exemplo 2: Adding to Existing Ecosystem

**Ecosystem Atual:**
- ✅ The_Veritas (production)
- ✅ The_CLO (production)
- ✅ The_CEO (production)

**Novo Agente:**
- The_Negotiator → depends on CLO

**Análise:**
```
Dependency: The_CLO
Status: production ✅

Blocked: NO
Can build: YES
Priority: High (RICE 8.0)

Decision: BUILD NOW
```

---

**Última Atualização:** 2026-01-24
**Mantido por:** The Scheduler
