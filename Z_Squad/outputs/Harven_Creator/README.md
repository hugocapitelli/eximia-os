---
title: "Harven_Creator (CreatorOS) v1.0.0"
galaxy: "CREATION"
galaxy-color: "#FF8C00"
document-type: "documentation"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "readme"
  - "harven_creator (creatoros) v1."
  - "quick start"
  - "1. copie o prompt"
  - "2. configure seu llm"
  - "3. formate a entrada"
  - "4. receba as perguntas"
  - "o que e o creatoros?"
  - "competencias"
  - "arquivos importantes"
tags:
  - "galaxy-creation"
  - "documentation"
---

# Harven_Creator (CreatorOS) v1.0.0

**Status:** Validated
**Score:** 9.4/10
**Criado em:** 2026-01-12
**Plataforma:** Harven.AI

---

## Quick Start

### 1. Copie o Prompt
Abra `03_prompt/prompt_operacional.md` e copie todo o conteudo.

### 2. Configure seu LLM
Cole como System Prompt no seu modelo (GPT-4, Claude, etc.).

### 3. Formate a Entrada
Envie JSON no formato do `03_prompt/schemas/input_schema.json`:
```json
{
    "chapter_title": "Titulo do Capitulo",
    "chapter_content": "Conteudo completo do capitulo...",
    "learning_objective": "O que o aluno deve aprender",
    "max_questions": 3
}
```

### 4. Receba as Perguntas
O agente retornara JSON com ate 3 perguntas socraticas enriquecidas.

---

## O que e o CreatorOS?

O CreatorOS e o **Gerador de Perguntas Socraticas** da plataforma Harven.AI. Ele:

- Analisa conteudo educacional e identifica conceitos-chave
- Gera ate 3 perguntas socraticas de alta qualidade
- Garante que perguntas exijam RACIOCINIO, nao memorizacao
- Enriquece cada pergunta com metadados pedagogicos
- Rejeita automaticamente perguntas genericas

---

## Competencias

| Competencia | Nivel | Descricao |
|-------------|-------|-----------|
| Analise de Conteudo | Expert | Identifica conceitos principais e relacoes |
| Geracao de Perguntas | Expert | Cria perguntas provocativas e abertas |
| Enriquecimento de Metadados | Advanced | Adiciona skill, intention, expected_depth |
| Deteccao de Perguntas Genericas | Expert | Rejeita "O que e X?" automaticamente |
| Criacao de Cenarios | Advanced | Transforma teoria em situacoes praticas |

---

## Arquivos Importantes

| Arquivo | Descricao |
|---------|-----------|
| `03_prompt/prompt_operacional.md` | O prompt para usar (cole no LLM) |
| `02_profile/dna_mental.md` | Personalidade e crencas do agente |
| `02_profile/knowledge_base/KB_01_taxonomia_bloom.md` | Niveis cognitivos para perguntas |
| `02_profile/knowledge_base/KB_02_antipadroes_perguntas.md` | O que NUNCA gerar |
| `02_profile/knowledge_base/KB_03_templates_cenarios.md` | Templates para cenarios praticos |
| `02_profile/knowledge_base/KB_04_metadados_perguntas.md` | Estrutura de metadados |
| `03_prompt/schemas/input_schema.json` | Formato de entrada |
| `03_prompt/schemas/output_schema.json` | Formato de saida |
| `04_validation/validation_report.md` | Resultado da validacao |

---

## Integracao com Harven.AI

O CreatorOS e o agente **CRIADOR** no sistema multi-agente:

```
Professor solicita geracao
    |
    v
CEO (Orquestrador)
    |
    v
CREATOR --> Analisa conteudo --> Gera perguntas (este agente)
    |
    v
Banco de Dados --> Persiste perguntas
    |
    v
ORIENTADOR --> Usa perguntas para dialogos com alunos
```

---

## Exemplo de Output

```json
{
    "analysis": {
        "main_concepts": ["gestao de riscos", "riscos climaticos", "mitigacao"],
        "potential_angles": ["priorizacao", "custo-beneficio", "limites"]
    },
    "questions": [
        {
            "text": "Imagine que voce e um consultor agricola. Um produtor te pergunta: 'Por que gastar com gestao de riscos se sempre deu certo?' Como voce o convenceria?",
            "skill": "aplicacao",
            "intention": "Fazer o aluno articular argumentos para gestao de riscos",
            "expected_depth": "Mencionar custo de crise vs prevencao, exemplos de perdas",
            "common_shallow_answer": "Gestao de riscos e importante porque evita perdas",
            "followup_prompts": [
                "Que dados voce mostraria?",
                "Como mediria o retorno?"
            ],
            "citations": ["paragrafo_sobre_importancia"]
        }
    ],
    "metadata": {
        "questions_generated": 3,
        "skills_covered": ["aplicacao", "analise", "reflexao"],
        "has_practical_scenario": true
    }
}
```

---

## Clones Mentores

| Clone | Contribuicao |
|-------|--------------|
| Socrates | A arte de formular perguntas reveladoras |
| Benjamin Bloom | Taxonomia de niveis cognitivos |
| Grant Wiggins | Alinhamento entre perguntas e objetivos |

---

## O que o Agente NUNCA Gera

| Tipo | Exemplo | Por que e proibido |
|------|---------|-------------------|
| Definicao | "O que e sustentabilidade?" | Exige memoria, nao raciocinio |
| Lista | "Quais sao os tipos de riscos?" | Promove memorizacao |
| Sim/Nao | "A tecnologia e importante?" | Fecha dialogo |
| Transcricao | "O que o texto diz sobre X?" | Pede copia, nao compreensao |

---

## Skills das Perguntas

| Skill | Descricao | Exemplo de Verbo |
|-------|-----------|------------------|
| analise | Decomposicao, causa-efeito | "Como se relaciona...", "Por que..." |
| sintese | Combinacao, criacao | "Que solucao voce proporia..." |
| aplicacao | Uso em contexto novo | "Imagine que voce e um..." |
| reflexao | Avaliacao, julgamento | "Que criterios voce usaria..." |

---

## Invariantes (Regras Inquebraveis)

1. Nunca gera perguntas "O que e..."
2. Nunca gera perguntas "Quais sao..."
3. Nunca gera perguntas de sim/nao
4. Nunca gera mais de 3 perguntas
5. Sempre termina perguntas com "?"
6. Sempre inclui metadados completos
7. Sempre tem pelo menos 1 cenario pratico
8. Sempre diversifica skills no batch

---

## Metricas de Qualidade

| Metrica | Target | Status |
|---------|--------|--------|
| Perguntas nao-genericas | 100% | OK |
| Diversidade de skills | >= 2/3 | OK |
| Cenarios praticos | >= 50% | OK |
| Metadados completos | >= 95% | OK |

---

## Changelog

### v1.0.0 (2026-01-12)
- Release inicial
- Aprovado pelo Z4 Auditor com score 9.4/10
- 4 arquivos de knowledge base
- Schemas de I/O completos
- Antipadroes bem definidos

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