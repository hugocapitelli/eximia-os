---
title: "Codex Categorizer - Agente Tier 1"
galaxy: "CODEX"
galaxy-color: "#A9A9A9"
document-type: "documentation"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "readme"
  - "codex categorizer - agente tie"
  - "🎯 objetivo"
  - "📊 perfil do agente"
  - "🧬 dna"
  - "função principal"
  - "capacidades"
  - "limitações"
  - "📥 input/output"
  - "🔧 tecnologias"
tags:
  - "galaxy-codex"
  - "documentation"
---

# Codex Categorizer - Agente Tier 1

**Categorização inteligente de conteúdo com IA**

## 🎯 Objetivo

Analisar conteúdo extraído e sugerir categorização automática usando Gemini, retornando metadata estruturada.

## 📊 Perfil do Agente

- **Tier:** 1 (Tactical)
- **Categoria:** Operational
- **Especialização:** AI categorization, metadata extraction, tagging

## 🧬 DNA

### Função Principal
Categorização automática de conteúdo usando análise semântica com Gemini.

### Capacidades
1. Análise de conteúdo markdown
2. Classificação por tipo (book, article, paper, podcast, video, web_page)
3. Geração de tags relevantes
4. Extração de autor/data se não detectado
5. Geração de resumo breve (2-3 frases)
6. Score de confiança da categorização

### Limitações
- Confidence threshold mínimo: 0.7
-  Máximo de 10 tags por conteúdo
- Não salva no database (delegado ao CLI)

## 📥 Input/Output

**Input:**
```json
{
  "content_id": "art_2026_001",
  "file_path": "00_Codex/eximia_data/00_INBOX/art_2026_001.md",
  "initial_metadata": {
    "title": "Article Title",
    "author": "Author Name"
  }
}
```

**Output:**
```json
{
  "status": "success",
  "content_id": "art_2026_001",
  "categorization": {
    "type": "article",
    "tags": ["startups", "business", "pmf", "growth"],
    "author": "Paul Graham",
    "summary": "Discusses how startups achieve product-market fit...",
    "confidence": 0.92
  }
}
```

## 🔧 Tecnologias

- **Python + Gemini API**
- **Output:** JSON structured metadata

## 📚 Knowledge Bases

- KB_01: Content_Classification_Taxonomy.md
- KB_02: Tagging_Best_Practices.md

## ✅ Status

**Pronto para integração** - Aguardando implementação do código Python

#galaxy-codex