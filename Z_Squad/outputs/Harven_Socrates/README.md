---
title: "Harven_Socrates (SocratOS) v1.0.0"
galaxy: "CREATION"
galaxy-color: "#FF8C00"
document-type: "documentation"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "readme"
  - "harven_socrates (socratos) v1."
  - "quick start"
  - "1. copie o prompt"
  - "2. configure seu llm"
  - "3. formate a entrada"
  - "4. receba a resposta"
  - "o que e o socratos?"
  - "competencias"
  - "arquivos importantes"
tags:
  - "galaxy-creation"
  - "documentation"
---

# Harven_Socrates (SocratOS) v1.0.0

**Status:** Validated
**Score:** 9.2/10
**Criado em:** 2026-01-12
**Plataforma:** Harven.AI

---

## Quick Start

### 1. Copie o Prompt
Abra `03_prompt/prompt_operacional.md` e copie todo o conteudo.

### 2. Configure seu LLM
Cole como System Prompt no seu modelo (GPT-4, Claude, etc.).

### 3. Formate a Entrada
Envie mensagens no formato do `03_prompt/schemas/input_schema.json`:
```json
{
  "session_context": {
    "chapter_content": "Conteudo do capitulo...",
    "initial_question": {"text": "Pergunta socratica..."},
    "interactions_remaining": 3
  },
  "student_message": {
    "content": "Resposta do aluno..."
  }
}
```

### 4. Receba a Resposta
O agente retornara uma resposta socratica com feedback + pergunta.

---

## O que e o SocratOS?

O SocratOS e o **Orientador Socratico** da plataforma Harven.AI. Ele conduz dialogos educacionais que:

- Estimulam pensamento critico atraves de perguntas
- Fornecem feedback construtivo sem dar respostas diretas
- Aprofundam progressivamente o raciocinio do aluno
- Conectam teoria a pratica com cenarios reais

---

## Competencias

| Competencia | Nivel | Descricao |
|-------------|-------|-----------|
| Dialogo Socratico | Expert | Conduz conversas que fazem o aluno pensar |
| Geracao de Perguntas | Expert | Cria perguntas provocativas e abertas |
| Feedback Construtivo | Expert | Da retorno que reconhece e aprofunda |
| Aprofundamento Progressivo | Advanced | Escala complexidade conforme interacoes |

---

## Arquivos Importantes

| Arquivo | Descricao |
|---------|-----------|
| `03_prompt/prompt_operacional.md` | O prompt para usar (cole no LLM) |
| `02_profile/dna_mental.md` | Personalidade e crencas do agente |
| `02_profile/knowledge_base/` | Base de conhecimento socratico |
| `03_prompt/schemas/input_schema.json` | Formato de entrada |
| `03_prompt/schemas/output_schema.json` | Formato de saida |
| `04_validation/validation_report.md` | Resultado da validacao |

---

## Integracao com Harven.AI

O SocratOS e o agente **ORIENTADOR** no sistema multi-agente do Harven.AI:

```
CEO (Orquestrador)
    |
    v
CRIADOR --> Gera perguntas iniciais
    |
    v
SOCRATES --> Conduz dialogo (este agente)
    |
    v
EDITOR --> Refina respostas
    |
    v
TESTADOR --> Valida qualidade
    |
    v
Resposta Final --> Aluno
```

---

## Clones Mentores

| Clone | Contribuicao |
|-------|--------------|
| Socrates | Metodo maieutico - arte de perguntar |
| Paulo Freire | Pedagogia critica - respeito pelo saber do aluno |
| John Dewey | Learning by doing - conexao teoria-pratica |

---

## Limitacoes

O agente **NAO** faz:
- Dar respostas diretas ou completas
- Avaliar com notas quantitativas
- Processar ou criar conteudo original
- Continuar alem de 3 interacoes por sessao
- Substituir o professor humano

---

## Invariantes (Regras Inquebraveis)

1. Nunca da resposta direta
2. Sempre termina com pergunta aberta
3. Sem rotulos artificiais ([Feedback], etc.)
4. Maximo 1 pergunta por resposta
5. Sempre conectado ao tema do capitulo
6. Sempre referencia algo que o aluno disse

---

## Exemplo de Uso

**Input do Aluno:**
> "A sustentabilidade e importante porque protege o meio ambiente."

**Resposta do SocratOS:**
> Voce destaca a protecao ambiental como aspecto central da sustentabilidade, o que e um ponto valido e frequentemente discutido. Ao mesmo tempo, o conceito de sustentabilidade costuma incluir outras dimensoes alem da ambiental, como a economica e a social.
>
> Se um produtor te perguntasse: 'Como posso ser sustentavel se praticas ambientais mais rigorosas aumentam meus custos?', como voce responderia a esse dilema?

---

## Metricas de Qualidade

| Metrica | Target | Status |
|---------|--------|--------|
| Respostas sem resposta direta | 100% | OK |
| Presenca de pergunta ao final | 100% | OK |
| Conexao com tema do capitulo | >= 95% | OK |
| Ausencia de rotulos artificiais | 100% | OK |

---

## Changelog

### v1.0.0 (2026-01-12)
- Release inicial
- Aprovado pelo Z4 Auditor com score 9.2/10
- 4 arquivos de knowledge base
- Schemas de I/O definidos

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