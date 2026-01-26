---
description: Gerenciar backlog e roadmap de agentes/clones com The Scheduler
---

## WORKFLOW: The Scheduler

**Agent:** The Scheduler (Agent Roadmap Manager)
**Location:** X_Agents/The_Scheduler/
**Version:** 1.0.0

---

## COMANDOS DISPONÍVEIS

### 1. `/schedule agent` - Adicionar Agente ao Backlog
### 2. `/schedule clone` - Adicionar Clone ao Backlog
### 3. `/schedule list` - Listar Backlog
### 4. `/schedule prioritize` - Calcular RICE Scores
### 5. `/schedule next` - Recomendar Próximo Build
### 6. `/schedule update` - Atualizar Status
### 7. `/schedule roadmap` - Ver Roadmap

---

## EXECUTION PROTOCOL

### 1. **Detectar Comando**

Quando usuário digita `/schedule [subcommand]`:

```markdown
Parse:
  - Subcommand: agent|clone|list|prioritize|next|update|roadmap
  - Args: --tier, --domain, --priority, --status, etc.
```

---

### 2. **Carregar Knowledge Bases**

Antes de executar qualquer comando, carregar:

```
X_Agents/The_Scheduler/02_profile/knowledge_base/KB_01_RICE_Prioritization.md
X_Agents/The_Scheduler/02_profile/knowledge_base/KB_02_Agent_Tiers.md
X_Agents/The_Scheduler/02_profile/knowledge_base/KB_03_Dependency_Management.md
```

---

### 3. **Executar Agente**

Ler prompt operacional:
```
X_Agents/The_Scheduler/03_prompt/prompt_operacional.md
```

Passar comando do usuário como contexto para o agente.

---

### 4. **Fluxo por Comando**

#### `/schedule agent "Name" --tier=N --domain="..." --priority=...`

**Steps:**
1. Carregar KBs (especialmente KB_02 para effort estimate)
2. Executar Protocolo 1 do prompt (Adicionar ao Backlog)
3. Validar campos obrigatórios
4. Auto-estimar effort baseado no tier
5. Identificar possíveis dependências (KB_03)
6. Gerar ID único (slug do nome)
7. **AGUARDAR APROVAÇÃO** do usuário
8. Se aprovado: adicionar a BACKLOG.yaml
9. Sugerir próximo passo: `/schedule prioritize`

---

#### `/schedule clone "Person" --domain="..." --priority=...`

**Steps:**
1. Carregar KBs (KB_02 para Clone effort: 30h)
2. Executar Protocolo 1 (variante Clone)
3. Validar campos obrigatórios
4. Effort fixo: 30h (Clone Factory padrão)
5. Perguntar se fontes estão disponíveis
6. **AGUARDAR APROVAÇÃO** do usuário
7. Se aprovado: adicionar a BACKLOG.yaml
8. Sugerir: `/schedule prioritize`

---

#### `/schedule list [--filter=agents|clones] [--status=...]`

**Steps:**
1. Ler BACKLOG.yaml
2. Aplicar filtros se fornecidos
3. Formatar tabela:
   ```
   ╔═══════════════════════════════════════════════════╗
   ║ AGENTS BACKLOG            Updated: [date]        ║
   ╠═══════════════════════════════════════════════════╣
   ║ ID │ Name │ Tier │ RICE │ Effort │ Status       ║
   ╚═══════════════════════════════════════════════════╝
   ```
4. Retornar ao usuário

---

#### `/schedule prioritize [item_id]`

**Steps:**
1. Carregar KB_01 (RICE Framework)
2. Ler BACKLOG.yaml
3. Se item_id fornecido: aplicar RICE só nele
4. Se não: aplicar RICE em todos os items sem score
5. Para cada item:
   - Solicitar ao usuário:
     a. Reach (quantitativo)
     b. Impact (0.25 - 3.0)
     c. Confidence (50-100%)
   - Effort já está estimado
   - Calcular: RICE = (Reach × Impact × Confidence) / Effort
6. Ordenar backlog por RICE (descendente)
7. Verificar dependencies e marcar bloqueados
8. Salvar scores em BACKLOG.yaml
9. Retornar backlog ordenado

---

#### `/schedule next`

**Steps:**
1. Carregar KBs (especialmente KB_03 para dependencies)
2. Executar Protocolo 3 (Next Recommendation)
3. Filtrar:
   - status = "planned"
   - blocked = false (dependencies OK)
4. Ordenar por RICE score (desc)
5. Pegar #1 (highest RICE, não bloqueado)
6. Gerar recommendation detalhada:
   ```markdown
   ## 🎯 Next Recommended Build

   **Agent:** [name]
   **RICE:** [score]

   **RICE Breakdown:**
   - Reach: [N]
   - Impact: [N]
   - Confidence: [N]%
   - Effort: [N]h

   **Why this one?**
   - [Rationale]

   **Prerequisites:** ✅ All clear

   **Estimated Timeline:** [X days]
   ```
7. Perguntar:
   ```
   [1] Start building now (trigger Z Squad/Clone Factory)
   [2] See alternatives
   [3] Postpone
   ```

---

#### `/schedule update <item_id> --status=<new_status>`

**Steps:**
1. Carregar Protocolo 4 (Update Status)
2. Ler BACKLOG.yaml
3. Validar transição de status
4. Se status → "production":
   - Verificar se está em agent_registry.yaml
   - Se não: sugerir entry para registry
5. Se status → "in_progress":
   - Marcar timestamp início
   - Alertar se dependencies bloqueadas
6. Salvar mudança em BACKLOG.yaml
7. Retornar confirmação

---

#### `/schedule roadmap [--timeframe=month|quarter|year]`

**Steps:**
1. Ler BACKLOG.yaml
2. Agrupar por timeframe estimado (baseado em effort)
3. Gerar visualização de timeline:
   ```
   Q1 2026 Roadmap

   January:
     ✅ [completed items]
     🔄 [in_progress items]

   February:
     📋 [planned items]
   ```
4. Retornar ao usuário

---

## FILE LOCATIONS

**Prompt:** `X_Agents/The_Scheduler/03_prompt/prompt_operacional.md`

**Knowledge Bases:**
- `X_Agents/The_Scheduler/02_profile/knowledge_base/KB_01_RICE_Prioritization.md`
- `X_Agents/The_Scheduler/02_profile/knowledge_base/KB_02_Agent_Tiers.md`
- `X_Agents/The_Scheduler/02_profile/knowledge_base/KB_03_Dependency_Management.md`

**Storage:** `X_Agents/The_Scheduler/BACKLOG.yaml`

**Spec:** `X_Agents/The_Scheduler/01_spec/spec_tecnica.json`

**DNA:** `X_Agents/The_Scheduler/02_profile/dna_mental.md`

---

## INTEGRATION TRIGGERS

### Trigger Z Squad (Agent Build)

Quando usuário escolhe "Start building now" para agent:

```markdown
1. Criar diretório:
   Z_Squad/outputs/[Agent_Name]/01_spec/

2. Criar arquivo inicial:
   Z_Squad/outputs/[Agent_Name]/01_spec/spec_initial.json

   Content:
   {
     "name": "[name]",
     "tier": [tier],
     "domain": "[domain]",
     "competencies": [competencies if available],
     "dependencies": [dependencies],
     "created_from_backlog": true,
     "backlog_rice": [rice_score]
   }

3. Update status em BACKLOG.yaml:
   status: planned → in_progress

4. Notificar Z1_Architect:
   "Agent [name] aprovado para build. Spec inicial criado."
```

---

### Trigger Clone Factory (Clone Build)

Quando usuário escolhe "Start building now" para clone:

```markdown
1. Criar diretório:
   Clones/[person_name]/1_raw_data/

2. Criar arquivo inicial:
   Clones/[person_name]/1_raw_data/SOURCES_LIVE.md

   Content:
   # Sources for [Person Name]

   **Domain:** [domain]
   **Priority:** [priority]
   **Sources Available:** [Yes/No]

   ## Source Hints
   [Notes from backlog if any]

3. Update status em BACKLOG.yaml:
   status: planned → research

4. Notificar C1_Hunter:
   "Clone [person] aprovado. Inicie research."
```

---

### Sync Agent Registry (Production)

Quando status → "production":

```markdown
1. Ler agent_registry.yaml

2. Verificar se agente está presente

3. Se ausente, gerar entry sugerida:
   ```yaml
   - id: [agent_id]
     name: "[Agent Name]"
     tier: [1|2|3]
     status: production
     domain: "[Domain]"
     paths:
       root: "[Path]/"
       prompt: "[Path]/prompt.md"
   ```

4. Perguntar ao usuário:
   "Add to agent_registry.yaml? [Yes/No]"

5. Se Yes: instruir usuário ou The_CEO a adicionar
```

---

## APPROVAL GATES

**CRITICAL:** The Scheduler NUNCA faz mutations sem aprovação explícita do usuário.

### Approval Required For:
- ✅ Adding item to backlog
- ✅ Updating status
- ✅ Starting build (triggering Z Squad/Clone Factory)
- ✅ Adding to agent_registry.yaml

### No Approval Needed For:
- ❌ Reading backlog
- ❌ Calculating RICE (read-only)
- ❌ Listing items
- ❌ Showing recommendations

---

## ERROR HANDLING

### Missing Required Fields
```
❌ Error: Missing required field 'domain'
Usage: /schedule agent "Name" --tier=N --domain="..."
```

### Invalid Tier
```
❌ Error: Invalid tier. Must be 1, 2, or 3.
```

### Item Not Found
```
❌ Error: Item 'the_unknown' not found in backlog.
Use /schedule list to see all items.
```

### Invalid Status Transition
```
❌ Error: Invalid status transition: planned → production
Valid: planned → in_progress → validated → production
```

---

## EXAMPLE USAGE FLOW

```
User: /schedule agent "The_Negotiator" --tier=2 --domain="Contract Negotiation" --priority=high

Claude (as Scheduler):
  1. Load KBs
  2. Execute Protocol 1
  3. Present capture summary
  4. Await approval

User: Yes

Claude:
  1. Add to BACKLOG.yaml
  2. Confirm
  3. Suggest: /schedule prioritize

User: /schedule prioritize the_negotiator

Claude:
  1. Load KB_01
  2. Request Reach, Impact, Confidence
  3. Calculate RICE
  4. Update BACKLOG.yaml
  5. Show result

User: /schedule next

Claude:
  1. Load KB_03
  2. Filter blocked items
  3. Return highest RICE
  4. Offer to start build

User: 1 (Start now)

Claude:
  1. Trigger Z Squad
  2. Create spec_initial.json
  3. Update status
  4. Confirm handoff
```

---

## NOTES

- **Storage:** BACKLOG.yaml é a única fonte de verdade
- **Approval:** Sempre aguarde aprovação antes de mutations
- **KBs:** Sempre carregue KBs antes de executar
- **Integration:** Z Squad e Clone Factory são auto-triggered quando aprovado

---

**Created:** 2026-01-24
**Version:** 1.0.0
**Workflow Type:** Agent Invocation
