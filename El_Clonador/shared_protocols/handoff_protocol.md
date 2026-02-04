---
title: "Clone Factory — Handoff Protocol"
galaxy: "CREATION"
galaxy-color: "#FF8C00"
document-type: "protocol"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "handoff-protocol"
  - "clone factory — handoff protoc"
  - "propósito"
  - "estrutura do handoff"
  - "handoff_{origem}_{destino}.yam"
  - "handoffs do pipeline"
  - "1. research → etl"
  - "handoff_c1_c2.yaml"
  - "2. etl → generation"
  - "handoff_c2_c3.yaml"
tags:
  - "galaxy-creation"
  - "protocol"
---

# Clone Factory — Handoff Protocol

## Propósito
Este documento define o protocolo de handoff entre as 4 fases do Clone Factory, garantindo passagem de contexto sem perda de informação.

---

## Estrutura do Handoff

Cada transição entre fases **deve** incluir:

```yaml
# handoff_{origem}_{destino}.yaml

handoff:
  from_phase: "PHASE_X"
  to_phase: "PHASE_Y"
  timestamp: "YYYY-MM-DDTHH:MM:SSZ"
  
  summary:
    work_completed: "Descrição do trabalho feito"
    quality_score: 0.0
    time_spent: "Xh"
    
  deliverables:
    - path: "caminho/arquivo"
      type: "tipo"
      status: "complete|partial"
      
  key_decisions:
    - decision: "Decisão tomada"
      rationale: "Justificativa"
      
  constraints_for_next:
    - "Restrição ou consideração para próxima fase"
    
  open_questions:
    - question: "Pergunta pendente"
      priority: "high|medium|low"
      
  checkpoint:
    phase: X
    step: "completed"
    quality_score: 0.0
```

---

## Handoffs do Pipeline

### 1. RESEARCH → ETL

```yaml
# handoff_c1_c2.yaml

handoff:
  from_phase: "PHASE_1_RESEARCH"
  to_phase: "PHASE_2_ETL"
  
  summary:
    work_completed: "Coleta de X fontes para [Especialista]"
    quality_score: 9.0
    time_spent: "5h"
    
  deliverables:
    - path: "1_raw_data/youtube/"
      type: "transcripts"
      count: 30
    - path: "1_raw_data/web_searches/"
      type: "articles"
      count: 20
    - path: "1_raw_data/social_media/"
      type: "compilation"
      count: 1
      
  coverage:
    identity: "complete"      # Quem é
    cognition: "complete"     # Como pensa
    voice: "complete"         # Como fala
    behavior: "partial"       # Como age (precisa mais exemplos)
    expertise: "complete"     # O que domina
    context: "complete"       # Situação atual
    
  key_decisions:
    - decision: "Priorizado JRE sobre outros podcasts"
      rationale: "Entrevistas mais longas e profundas"
      
  constraints_for_next:
    - "Voice signature deve capturar intensidade variável"
    - "Priorizar quotes sobre accountability"
```

---

### 2. ETL → GENERATION

```yaml
# handoff_c2_c3.yaml

handoff:
  from_phase: "PHASE_2_ETL"
  to_phase: "PHASE_3_GENERATION"
  
  summary:
    work_completed: "Extração e estruturação de dados"
    quality_score: 9.2
    time_spent: "3h"
    
  deliverables:
    - path: "2_structured_data/quotes/quotes.json"
      type: "json"
      count: 52
    - path: "2_structured_data/metadata/voice_signature.json"
      type: "json"
    - path: "2_structured_data/timeline/events.json"
      type: "json"
      count: 35
    - path: "2_structured_data/entities/entities.json"
      type: "json"
      count: 78
      
  voice_signature:
    primary_tone: "Confrontational, Direct"
    vocabulary_density: "Medium"
    profanity_level: "Moderate"
    sentence_length: "20-40 words"
    structure: "Imperative, challenge-based"
    
  key_decisions:
    - decision: "Classificado como MOTIVATIONAL/PERFORMANCE domain"
      rationale: "Híbrido de MILITARY + ATHLETICS + SELF-HELP"
      
  constraints_for_next:
    - "System prompt deve refletir tom confrontacional"
    - "Incluir Anti-Jailbreak KB"
    - "Máximo 8K chars no system prompt"
```

---

### 3. GENERATION → VALIDATION

```yaml
# handoff_c3_c4.yaml

handoff:
  from_phase: "PHASE_3_GENERATION"
  to_phase: "PHASE_4_VALIDATION"
  
  summary:
    work_completed: "Geração de 9 KBs + System Prompt"
    quality_score: 9.3
    time_spent: "5h"
    
  deliverables:
    - path: "3_clone_output/SYSTEM_PROMPT.md"
      type: "prompt"
      chars: 5547
    - path: "3_clone_output/knowledge_bases/"
      type: "directory"
      count: 9
    - path: "3_clone_output/tests/TURING_SCENARIOS.yaml"
      type: "test_cases"
      count: 20
      
  kbs_created:
    - KB_01_IDENTITY: "Background e história"
    - KB_02_COGNITION: "40% Rule, Calloused Mind"
    - KB_03_VOICE: "Style guide detalhado"
    - KB_04_FRAMEWORKS: "Accountability Mirror, Cookie Jar"
    - KB_05_EXPERTISE: "SEAL, Ultra-Endurance"
    - KB_06_CONTEXT: "Situação atual, livros"
    - KB_07_DOMAIN: "MOTIVATIONAL/PERFORMANCE"
    - KB_08_QNA: "100+ pares Q&A"
    - KB_09_ANTIJAILBREAK: "Limites e recusas"
    
  constraints_for_next:
    - "Testar todos os 20 cenários Turing"
    - "Verificar compliance ético"
    - "Score mínimo 9.0 para PASS"
```

---

## Checkpoint System

Cada fase atualiza o `.checkpoint.json`:

```json
{
  "metadata": {
    "persona_name": "David Goggins",
    "persona_slug": "david_goggins",
    "version": "4.1",
    "created_at": "2025-12-19T00:00:00Z",
    "last_updated": "2025-12-19T21:35:00Z"
  },
  "current_state": {
    "phase": 3,
    "phase_name": "GENERATION",
    "status": "in_progress",
    "step": "creating_kbs",
    "step_progress": "7/12"
  },
  "phase_1_research": {
    "status": "completed",
    "total_sources": 51,
    "quality_score": "9.5/10"
  },
  "phase_2_etl": {
    "status": "completed",
    "quotes_extracted": 50,
    "quality_score": "9.3/10"
  },
  "phase_3_generation": {
    "status": "in_progress",
    "knowledge_bases_created": 7,
    "quality_score": "pending"
  },
  "phase_4_validation": {
    "status": "pending"
  }
}
```

---

## Regras de Handoff

1. **Nunca** avançar sem quality gate aprovado
2. **Sempre** atualizar checkpoint antes do handoff
3. **Sempre** documentar decisões-chave
4. **Sempre** listar open questions
5. **Nunca** perder artefatos entre fases

---

**Última atualização:** 2026-01-08

#galaxy-creation