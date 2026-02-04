---
title: "Codex Scraper - Agente Tier 1"
galaxy: "CODEX"
galaxy-color: "#A9A9A9"
document-type: "documentation"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "readme"
  - "codex scraper - agente tier 1"
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

# Codex Scraper - Agente Tier 1

**Extração inteligente de conteúdo web para o Projeto Codex**

## 🎯 Objetivo

Extrair conteúdo de URLs e converter para Markdown limpo, salvando no INBOX do Codex para posterior categorização.

## 📊 Perfil do Agente

- **Tier:** 1 (Tactical)
- **Categoria:** Operational
- **Especialização:** Web scraping, content extraction, Markdown conversion

## 🧬 DNA

### Função Principal
Extração automatizada de conteúdo web com limpeza e conversão para Markdown estruturado.

### Capacidades
1. Extração de artigos HTML → Markdown
2. Download e parse de PDFs
3. Extração de metadata (título, autor, data)
4. Limpeza de conteúdo (remove ads, menus, footers)
5. Geração de IDs únicos

### Limitações
- Não faz categorização (delegado ao Categorizer)
- Não salva no database (delegado ao CLI)
- Timeout de 30s por URL

## 📥 Input/Output

**Input:**
```json
{
  "url": "https://example.com/article",
 "content_type_hint": "article" // opcional
}
```

**Output:**
```json
{
  "status": "success",
  "content_id": "art_2026_001",
  "file_path": "00_Codex/eximia_data/00_INBOX/art_2026_001.md",
  "metadata": {
    "title": "Article Title",
    "author": "Author Name",
    "date": "2026-01-09",
    "word_count": 1500
  }
}
```

## 🔧 Tecnologias

- **Python:** `trafilatura`, `beautifulsoup4`, `requests`
- **Output:** Markdown files in INBOX

## 📚 Knowledge Bases

- KB_01: Web_Scraping_Best_Practices.md
- KB_02: Markdown_Conversion_Rules.md

## ✅ Status

**Pronto para integração** - Aguardando implementação do código Python

#galaxy-codex