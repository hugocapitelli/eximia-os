---
title: "🗄️ Projeto Codex"
galaxy: "CODEX"
galaxy-color: "#A9A9A9"
document-type: "documentation"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "readme"
  - "🗄️ projeto codex"
  - "📋 visão geral"
  - "🏗️ arquitetura"
  - "estrutura de diretórios"
  - "database schema (sqlite)"
  - "🚀 começando"
  - "inicializar o database"
  - "📖 comandos (via antigravity)"
  - "comando rápido"
tags:
  - "galaxy-codex"
  - "documentation"
---

# 🗄️ Projeto Codex

**Repositório Inteligente de Conhecimento** para o exímIA.OS.

## 📋 Visão Geral

O **Projeto Codex** é um sistema centralizado para armazenar, organizar, processar e exportar conteúdos diversos (artigos, livros, papers, podcasts, vídeos, etc.) com categorização automática, busca inteligente e integração com outros agentes do exímIA.OS.

## 🏗️ Arquitetura

### Estrutura de Diretórios

```
🗄️ Codex/
├── eximia_data/              # Dados do codex
│   ├── 00_INBOX/            # Staging area (review manual)
│   ├── 01_LIBRARY/          # Biblioteca organizada
│   │   ├── books/
│   │   ├── articles/
│   │   ├── research_papers/
│   │   ├── podcasts/
│   │   ├── videos/
│   │   └── web_pages/
│   ├── 02_PROCESSED/        # Outputs do Intellex
│   ├── 03_EXPORTS/          # Pacotes exportados
│   └── vault.db             # SQLite database
└── scripts/                  # Scripts Python
    ├── db_schema.sql        # Schema do banco
    ├── init_db.py           # Inicialização
    └── database.py          # Operações DB
```

### Database Schema (SQLite)

- **contents**: Metadata de todos os conteúdos
- **tags**: Sistema de tags (many-to-many)
- **relationships**: Conexões entre conteúdos
- **processing_history**: Histórico de processamento
- **contents_fts**: Full-text search (FTS5)

## 🚀 Começando

### Inicializar o Database

```bash
python "🗄️ Codex/scripts/init_db.py"
```

Isso cria o arquivo `vault.db` com todas as tabelas necessárias.

## 📖 Comandos (via Antigravity)

> **💡 Para ver todos os comandos detalhados, consulte [CODEX_GUIDE.md](./CODEX_GUIDE.md)**

### Comando Rápido

- `/codex-commands` - Lista todos os comandos disponíveis

### Ingestão de Conteúdo

- `/codex-add <url>` - Adicionar conteúdo com review manual
- `/codex-add-auto <url>` - Adicionar conteúdo com aprovação automática
- `/codex-upload <file>` - Upload de arquivo local
- `/codex-review` - Revisar conteúdos no INBOX

### Busca & Navegação

- `/codex-list` - Listar todos os conteúdos
- `/codex-search "query"` - Busca full-text
- `/codex-find --author "Nome"` - Busca por metadata
- `/codex-related <content_id>` - Mostra conteúdos conectados

### Processamento

- `/codex-process <content_id>` - Processar com Intellex
- `/codex-validate <content_id>` - Validar com Veritas
- `/codex-tag <content_id>` - Re-categorizar manualmente

### Intelligence

- `/codex-recommend "tema"` - Recomendações baseadas em gaps
- `/codex-export "tema"` - Exportar pacote de conhecimento
- `/codex-stats` - Estatísticas do codex

## 🔄 Workflow Típico

1. **Adicionar conteúdo:**
   ```
   /codex-add https://exemplo.com/artigo
   ```

2. **Sistema extrai e categoriza automaticamente**

3. **Review manual no INBOX:**
   ```
   /codex-review
   ```

4. **Aprovar → move para LIBRARY**

5. **Processar com Intellex (opcional):**
   ```
   /codex-process art_2026_001
   ```

6. **Exportar conhecimento sobre um tema:**
   ```
   /codex-export "AI Alignment"
   ```

## 🔗 Integrações

- **Veritas**: Validação de credibilidade de fontes
- **Intellex**: Processamento profundo de conteúdos
- **Clone Factory**: Usa o Codex como fonte de dados
- **Maestro**: Orquestração de workflows em lote

## 🗂️ Tipos de Conteúdo Suportados

- 📚 Livros (PDF, EPUB)
- 📄 Artigos web
- 🔬 Research papers
- 🎙️ Podcasts (transcrições)
- 🎥 Vídeos (transcrições)
- 🌐 Páginas web

## 📊 Exemplo de Metadata

```yaml
id: art_2026_001
title: "Guide to Product-Market Fit"
type: article
source_url: https://a16z.com/pmf-guide
author: Marc Andreessen
date_added: 2026-01-09T11:00:00
status: library
credibility_score: 8.5  # Veritas
tags: [business, startups, product, pmf]
```

## 🔮 Roadmap Futuro

- [ ] Busca semântica (embeddings)
- [ ] Knowledge graphs visuais
- [ ] Migração para Supabase (acesso multi-dispositivo)
- [ ] Scraper automático de PDFs
- [ ] Transcrição automática de vídeos/podcasts
- [ ] Reading list intelligence (recomendações externas)
- [ ] Export packages com bibliografia

## 🛠️ Requisitos

- Python 3.8+
- SQLite (built-in no Python)
- Bibliotecas: `beautifulsoup4`, `requests`, `markdownify`, `trafilatura`

## 📝 Notas Técnicas

### Por que SQLite?

- ✅ **Zero configuração** (sem servidor)
- ✅ **Performance** excelente para milhares de documentos
- ✅ **Portabilidade** (1 arquivo = backup completo)
- ✅ **Migração futura** fácil para Supabase/PostgreSQL

### Migração Futura

O código está preparado para migração para Supabase:
- Schema compatível com PostgreSQL
- Queries padrão SQL
- Interface unificada no `database.py`

---

**Criado por:** exímIA.OS  
**Status:** MVP em desenvolvimento  
**Versão:** 1.0.0

📖 **[Ver Guia Completo →](./CODEX_GUIDE.md)**

[[_HUB.md]]
[[The_Veritas/README.md]]
#galaxy-codex