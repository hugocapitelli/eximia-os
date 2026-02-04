---
title: "Handoff Protocol — Carousel Squad"
galaxy: "CREATION"
galaxy-color: "#FF8C00"
document-type: "protocol"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "handoff-protocol"
  - "handoff protocol — carousel sq"
  - "visão geral"
  - "fluxo padrão de handoff"
  - "estrutura do handoff"
  - "handoffs específicos"
  - "maestro → story architect"
  - "story architect → visual desig"
  - "visual designer → copy master"
  - "copy master → growth hacker"
tags:
  - "galaxy-creation"
  - "protocol"
---

# Handoff Protocol — Carousel Squad

**Versão:** 1.0
**Data:** 2026-01-30

---

## Visão Geral

Este protocolo define como os agentes do Carousel Squad passam contexto e trabalho entre si, garantindo que nenhuma informação seja perdida durante transições.

---

## Fluxo Padrão de Handoff

```
┌─────────────────────────────────────────────────────────────┐
│                    CAROUSEL SQUAD FLOW                       │
│                                                              │
│  [Brief do Usuário]                                          │
│         ↓                                                    │
│  ┌─────────────────┐                                        │
│  │ CAROUSEL MAESTRO │ ──→ Strategy + Briefings              │
│  └────────┬────────┘                                        │
│           ↓                                                  │
│  ┌─────────────────┐                                        │
│  │ STORY ARCHITECT  │ ──→ Narrative Structure               │
│  └────────┬────────┘                                        │
│           ↓                                                  │
│  ┌─────────────────┐                                        │
│  │ VISUAL DESIGNER  │ ──→ Visual Specs                      │
│  └────────┬────────┘                                        │
│           ↓                                                  │
│  ┌─────────────────┐                                        │
│  │   COPY MASTER    │ ──→ Final Copy                        │
│  └────────┬────────┘                                        │
│           ↓                                                  │
│  ┌─────────────────┐                                        │
│  │  GROWTH HACKER   │ ──→ Optimizations                     │
│  └─────────────────┘                                        │
│           ↓                                                  │
│  [Carrossel Pronto]                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Estrutura do Handoff

Cada handoff DEVE incluir:

```yaml
handoff:
  id: "HAND-[timestamp]"
  from: "[Agent_Name]"
  to: "[Agent_Name]"
  timestamp: "[ISO 8601]"

  context:
    objetivo: "[Objetivo do carrossel]"
    audiencia: "[Descrição da persona]"
    tipo_carrossel: "[Educational / Storytelling / etc.]"
    funil: "[TOFU / MOFU / BOFU]"
    tom_voz: "[Descrição do tom]"

  trabalho_feito:
    summary: "[O que foi completado]"
    artefatos:
      - "[Artefato 1]"
      - "[Artefato 2]"
    decisions:
      - "[Decisão 1 e justificativa]"
      - "[Decisão 2 e justificativa]"

  instrucoes:
    - "[Instrução específica 1]"
    - "[Instrução específica 2]"

  constraints:
    - "[Restrição 1]"
    - "[Restrição 2]"

  open_questions:
    - "[Questão pendente 1]"
    - "[Questão pendente 2]"
```

---

## Handoffs Específicos

### Maestro → Story Architect
```yaml
handoff:
  from: "Carousel_Maestro"
  to: "Story_Architect"

  context:
    objetivo: "[Ex: Educar sobre produtividade]"
    audiencia: "[Ex: Empreendedores 25-40]"
    tipo_carrossel: "Educational"
    funil: "TOFU"
    tom_voz: "Acessível, expert"

  instrucoes:
    - "Criar arco narrativo para 10 slides"
    - "Incluir tensão no slide 3-4"
    - "Usar estrutura Problem-Solution"

  constraints:
    - "Máximo 10 slides"
    - "Não usar jargão técnico"
```

### Story Architect → Visual Designer
```yaml
handoff:
  from: "Story_Architect"
  to: "Visual_Designer"

  trabalho_feito:
    summary: "Estrutura narrativa completa"
    artefatos:
      - "Mapa de slides com função de cada um"
      - "Pontos de tensão identificados"

  instrucoes:
    - "Enfatizar visualmente slides 4 e 8 (pontos de tensão)"
    - "Criar consistência visual entre slides de conteúdo (5-7)"
    - "Slide 1 precisa de alto impacto visual"

  constraints:
    - "Manter mood clean e moderno"
    - "Usar cores que transmitam confiança"
```

### Visual Designer → Copy Master
```yaml
handoff:
  from: "Visual_Designer"
  to: "Copy_Master"

  trabalho_feito:
    summary: "Especificação visual completa"
    artefatos:
      - "Paleta de cores"
      - "Sistema tipográfico"
      - "Wireframes de cada slide"

  instrucoes:
    - "Headline máximo 8 palavras (espaço limitado)"
    - "Texto de corpo máximo 2 linhas por slide"
    - "CTA precisa ser curto (3-5 palavras)"

  constraints:
    - "Hierarquia: H1 (48pt), Body (24pt)"
    - "Safe zone de 120px no bottom"
```

### Copy Master → Growth Hacker
```yaml
handoff:
  from: "Copy_Master"
  to: "Growth_Hacker"

  trabalho_feito:
    summary: "Copy completo para todos os slides"
    artefatos:
      - "Headlines"
      - "Corpo de texto"
      - "CTAs"
      - "Caption"

  instrucoes:
    - "Otimizar para save rate (objetivo é referência)"
    - "Sugerir hashtags para nicho de produtividade"
    - "Recomendar melhor horário para empreendedores"
```

---

## Regras do Handoff

### DEVE
- Incluir TODO o contexto relevante
- Listar decisões já tomadas
- Especificar constraints claros
- Mencionar questões pendentes

### NÃO DEVE
- Repetir trabalho do agente anterior
- Mudar decisões sem justificativa
- Omitir informações importantes
- Assumir que o próximo agente "sabe"

---

## Tratamento de Problemas

### Se informação estiver faltando
```
1. Identificar a lacuna
2. Retornar ao agente anterior com pergunta específica
3. NÃO assumir ou adivinhar
```

### Se houver conflito entre instruções
```
1. Documentar o conflito
2. Escalar para Carousel Maestro
3. Aguardar resolução antes de prosseguir
```

### Se deadline for urgente
```
1. Priorizar elementos essenciais
2. Marcar elementos "nice-to-have" como pendentes
3. Entregar versão mínima viável
4. Documentar o que ficou de fora
```

---

## Templates de Handoff Rápido

### Handoff Simples (entre 2 agentes)
```
FROM: [Agent]
TO: [Agent]
CONTEXT: [Objetivo] para [audiência] - [tipo] - [funil]
DONE: [O que foi feito]
NEXT: [O que precisa ser feito]
CONSTRAINTS: [Limitações]
```

### Handoff Completo (squad inteiro)
Usar estrutura YAML completa acima.

---

**Mantido por:** Carousel Squad | ExímIA.AI

#galaxy-creation