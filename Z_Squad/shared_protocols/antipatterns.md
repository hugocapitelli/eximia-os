# Antipadrões — Z Squad

## 🎯 Propósito
Este documento cataloga os **erros mais comuns** na criação e operação de agentes multiagente, e como o Z Squad os evita.

> *"The God Agent: Tentar criar um Super Agente que pesquisa, coda, testa e deploya."*
> — Framework Multiagentes ExímIA

---

## 1. Antipadrões de Arquitetura

### 1.1 The God Agent (O Herói)
**O que é:** Um único agente que tenta fazer tudo — pesquisar, analisar, redigir, validar.

**Por que falha:**
- Contexto explode (token limit)
- Agente se confunde entre papéis
- Impossível debugar qual parte falhou

**Como o Z Squad evita:**
- 5 módulos especializados (Z1-Z5)
- Cada módulo tem missão única
- Single Responsibility Principle

**Sintoma de violação:** Prompt com > 4000 tokens.

---

### 1.2 Micro-Management (Agentes Triviais)
**O que é:** Criar um agente para tarefas simples demais (ex: "Agente de Somar Números").

**Por que falha:**
- Latência desnecessária
- Custo de tokens
- Complexidade sem benefício

**Como o Z Squad evita:**
- Z1 avalia se a tarefa requer agente
- Tarefas determinísticas usam Code Interpreter, não agentes
- Threshold: Se pode ser resolvido com 1 prompt simples, não precisa de agente

**Sintoma de violação:** Agente com < 3 competências distintas.

---

### 1.3 Context Overload (Telefone Sem Fio)
**O que é:** Passar todo o histórico de conversas para todos os agentes.

**Por que falha:**
- Exceede token limit
- Agente perde foco
- Informação irrelevante polui decisões

**Como o Z Squad evita:**
- Handoff Protocol com summarization
- Shared State com apenas campos relevantes
- MCP para acesso sob demanda (não dump)

**Sintoma de violação:** Handoff payload > 2000 tokens.

---

### 1.4 Infinite Loop (Ping-Pong)
**O que é:** Dois agentes conversando entre si sem critério de parada.

**Exemplo:**
```
Z3: "Aqui está o prompt"
Z4: "Rejeitado, corrija X"
Z3: "Corrigido"
Z4: "Agora Y está errado"
Z3: "Corrigido"
Z4: "X voltou a estar errado"
... (infinito)
```

**Como o Z Squad evita:**
- `max_iterations = 3` no loop Z3↔Z4
- Após 3 tentativas, escalar para human review
- Z4 deve dar feedback consolidado (não incremental)

**Sintoma de violação:** Loop Z3↔Z4 > 5 iterações.

---

## 2. Antipadrões de Comunicação

### 2.1 Silent Handoff
**O que é:** Passar arquivos entre módulos sem contexto.

**Exemplo:**
```yaml
# Handoff ruim
from: Z1
to: Z2
files: ["spec.json"]
# Nenhum summary, nenhuma decisão explicada
```

**Como o Z Squad evita:**
- Handoff Protocol obrigatório
- `summary`, `key_decisions`, `constraints` são required

---

### 2.2 Assumption Cascade
**O que é:** Módulo assume algo que não foi explicitado, e o próximo assume baseado na assunção.

**Exemplo:**
- Z1 não define tom de voz
- Z2 assume "formal"
- Z3 cria prompt ultraformal
- Usuário queria algo casual
- Descobre só no final

**Como o Z Squad evita:**
- Z1 lista `open_questions` no handoff
- Z2 para e pergunta se necessário
- Never assume, always clarify

---

### 2.3 Scope Creep Sneaky
**O que é:** Módulo adiciona funcionalidades não solicitadas "porque seria legal".

**Exemplo:** Z3 adiciona integração com Slack quando a spec só pedia análise financeira.

**Como o Z Squad evita:**
- Z4 valida contra `spec_tecnica.json` do Z1
- Regra: Se não está na spec, não pode estar no prompt
- Any addition → needs Z1 amendment

---

## 3. Antipadrões de Qualidade

### 3.1 Hallucination Tolerance
**O que é:** Aceitar respostas inventadas porque "parecem plausíveis".

**Como o Z Squad evita:**
- Z4 tem Hallucination Tests obrigatórios
- Threshold: > 3% hallucination rate = REJECT

---

### 3.2 Happy Path Only
**O que é:** Testar apenas cenários onde tudo funciona.

**Como o Z Squad evita:**
- Z4 inclui Edge Cases obrigatórios
- 6 categorias de teste (Schema, Hallucination, Consistency, Jailbreak, Edge, Performance)
- Mínimo 15 testes por agente

---

### 3.3 Set and Forget
**O que é:** Criar agente e nunca mais revisar.

**Como o Z Squad evita:**
- Z5 Evolver monitora continuamente
- Revisão obrigatória a cada 90 dias
- Drift detection automático

---

## 4. Checklist Anti-Antipadrões

Antes de cada entrega, verificar:

| Check | Antipadrão Evitado |
| :--- | :--- |
| ☐ Prompt < 4000 tokens? | God Agent |
| ☐ Agente tem ≥ 3 competências distintas? | Micro-Management |
| ☐ Handoff payload < 2000 tokens? | Context Overload |
| ☐ Loop Z3↔Z4 < 3 iterações? | Infinite Loop |
| ☐ Handoff tem summary + decisions? | Silent Handoff |
| ☐ Open questions documentadas? | Assumption Cascade |
| ☐ Sem features fora da spec? | Scope Creep |
| ☐ Hallucination rate < 3%? | Hallucination Tolerance |
| ☐ ≥ 15 testes executados? | Happy Path Only |
| ☐ Próxima revisão agendada? | Set and Forget |

---

## 📚 Referência
- [Framework Multiagentes: 08_Boas_Praticas_e_Antipadroes.md](../../Conteudo_sintetizado/Framework_Multiagentes_EximIA/08_Boas_Praticas_e_Antipadroes.md)
