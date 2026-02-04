---
title: "Harven_Editor (EditorOS) v1.0.0"
galaxy: "CREATION"
galaxy-color: "#FF8C00"
document-type: "documentation"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "readme"
  - "harven_editor (editoros) v1.0."
  - "quick start"
  - "1. copie o prompt"
  - "2. configure seu llm"
  - "3. envie a resposta do orienta"
  - "4. receba o texto polido"
  - "o que e o editoros?"
  - "competencias"
  - "arquivos importantes"
tags:
  - "galaxy-creation"
  - "documentation"
---

# Harven_Editor (EditorOS) v1.0.0

**Status:** Validated
**Score:** 9.3/10
**Criado em:** 2026-01-12
**Plataforma:** Harven.AI

---

## Quick Start

### 1. Copie o Prompt
Abra `03_prompt/prompt_operacional.md` e copie todo o conteudo.

### 2. Configure seu LLM
Cole como System Prompt no seu modelo (GPT-4, Claude, etc.).

### 3. Envie a Resposta do ORIENTADOR
```
[Feedback]
Voce levanta um ponto interessante sobre gestao.

[Pergunta]
Como voce aplicaria isso na pratica?
```

### 4. Receba o Texto Polido
```
Voce levanta um ponto interessante sobre gestao, demonstrando engajamento com o tema.

Como voce aplicaria isso na pratica?
```

---

## O que e o EditorOS?

O EditorOS e o **Refinador de Respostas** da plataforma Harven.AI. Ele:

- Remove rotulos artificiais ([Feedback], [Pergunta], etc.)
- Garante estrutura de exatamente 2 paragrafos
- Melhora fluidez e naturalidade do texto
- Preserva 100% do significado original

---

## Competencias

| Competencia | Nivel | Descricao |
|-------------|-------|-----------|
| Remocao de Rotulos | Expert | Detecta e remove todos os padroes |
| Estruturacao | Expert | Garante 2 paragrafos com separacao |
| Preservacao Semantica | Expert | Mantem significado original |
| Controle de Tamanho | Advanced | Mantém entre 80-200 palavras |

---

## Arquivos Importantes

| Arquivo | Descricao |
|---------|-----------|
| `03_prompt/prompt_operacional.md` | O prompt para usar (cole no LLM) |
| `02_profile/dna_mental.md` | Personalidade e crencas |
| `02_profile/knowledge_base/KB_01_rotulos_artefatos.md` | Padroes a remover |
| `02_profile/knowledge_base/KB_02_estrutura_paragrafos.md` | Regras de estrutura |
| `02_profile/knowledge_base/KB_03_preservacao_intencao.md` | O que preservar |
| `03_prompt/schemas/` | Formatos de I/O |
| `04_validation/validation_report.md` | Resultado da validacao |

---

## Integracao com Harven.AI

O EditorOS e o agente **EDITOR** no sistema multi-agente:

```
Aluno envia mensagem
    |
    v
ORIENTADOR --> Gera resposta bruta (com rotulos)
    |
    v
EDITOR --> Refina e poli (este agente)
    |
    v
TESTADOR --> Valida qualidade
    |
    v
Resposta Final --> Aluno
```

---

## O que o Agente Remove

| Tipo | Exemplos |
|------|----------|
| Rotulos colchetes | [Feedback], [Pergunta], [Provocacao] |
| Formatacao | **Feedback:**, *Pergunta:* |
| Numeracao | 1. Feedback: 2. Pergunta: |
| Headers | ## Feedback, ### Pergunta |
| Separadores | ---, ***, === |
| Prefixos | Tutor:, IA:, Assistente: |

---

## Estrutura de Output

**SEMPRE** 2 paragrafos:

```
[Paragrafo 1: Feedback]
Texto que comenta a resposta do aluno, reconhece pontos,
adiciona nuances. 40-120 palavras.

[Paragrafo 2: Pergunta]
Pergunta aberta que convida a aprofundar. 15-50 palavras.
Termina com ?
```

**Total:** 80-200 palavras

---

## Clones Mentores

| Clone | Contribuicao |
|-------|--------------|
| William Strunk | Elements of Style - clareza e brevidade |
| George Orwell | Rules for Writing - simplicidade |

---

## Invariantes (Regras Inquebraveis)

1. SEMPRE 2 paragrafos
2. SEMPRE separados por linha em branco
3. SEMPRE termina com ?
4. NUNCA deixa rotulos visiveis
5. NUNCA muda o significado do feedback
6. NUNCA troca a pergunta
7. NUNCA adiciona conteudo novo
8. SEMPRE entre 80-200 palavras

---

## Exemplo de Edicao

### Antes (do ORIENTADOR)
```
**Feedback:** E muito importante ressaltar que sua resposta
demonstra uma compreensao inicial do tema. Voce menciona
corretamente que a sustentabilidade envolve multiplas dimensoes.

**Pergunta:** Considerando isso, como voce avaliaria uma empresa
que afirma ser sustentavel apenas por usar energia solar?
```

### Depois (editado)
```
Sua resposta demonstra compreensao inicial do tema ao mencionar
as multiplas dimensoes da sustentabilidade. E um bom ponto de
partida para aprofundarmos a discussao.

Como voce avaliaria uma empresa que afirma ser sustentavel
apenas por usar energia solar?
```

---

## Metricas de Qualidade

| Metrica | Target | Status |
|---------|--------|--------|
| Remocao de rotulos | 100% | OK |
| Estrutura 2 paragrafos | 100% | OK |
| Termina com ? | 100% | OK |
| Preservacao semantica | >= 95% | OK |
| Tamanho 80-200 palavras | 100% | OK |

---

## Changelog

### v1.0.0 (2026-01-12)
- Release inicial
- Aprovado pelo Z4 Auditor com score 9.3/10
- 3 arquivos de knowledge base
- Lista exaustiva de padroes a remover

---

## Suporte

Para evolucoes ou issues, abra um ticket com o Z5 Evolver ou contate a equipe Harven.AI.

---

**Criado por:** Z Squad | ExímIA.AI
**Licenca:** Proprietaria - Harven.AI


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->

#galaxy-creation