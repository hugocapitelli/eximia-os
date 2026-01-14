# Codex CLI - Agente Tier 2

**Orquestrador completo do Projeto Codex**

## 🎯 Objetivo

Orquestrar workflows completos do Codex, integrando Scraper, Categorizer e Database para implementar todos os comandos.

## 📊 Perfil do Agente

- **Tier:** 2 (Executive)
- **Categoria:** Operational
- **Especialização:** Workflow orchestration, CLI interface, database integration

## 🧬 DNA

### Função Principal
Orquestração de workflows end-to-end do Codex com gerenciamento de estados e integração de componentes.

### Capacidades
1. **Orquestração:** Chamar Scraper + Categorizer em sequência
2. **Database:** Integrar com `database.py` (add, list, search, stats)
3. **Estados:** Gerenciar transições inbox → library → processed
4. **Comandos:** Implementar 15 comandos /codex-*
5. **Integrações:** Veritas (validação), Intellex (processamento)
6. **UX:** Rich feedback visual, progress bars

### Workflows Principais

**1. `/codex-add <url>` (com review):**
```
1. Scraper.extract(url) → markdown file
2. Categorizer.analyze(file) → metadata
3. Salvar em INBOX
4. Apresentar preview ao usuário
5. Se aprovado: mover para LIBRARY + database.add_content()
```

**2. `/codex-add-auto <url>`:**
```
1. Scraper.extract(url)
2. Categorizer.analyze(file)
3. database.add_content() direto (pula INBOX)
```

**3. `/codex-list`:**
```
1. database.list_contents(filtros)
2. Formatar tabela
3. Exibir ao usuário
```

**4. `/codex-search "query"`:**
```
1. database.search(query) via FTS5
2. Rankear resultados
3. Exibir matches
```

## 📥 Input/Output

**Input:** Comandos do usuário via workflows Antigravity

**Output:** Execução de workflows + feedback estruturado

## 🔧 Tecnologias

- **Python:** `argparse` ou `click` para CLI
- **Integrations:** `database.py`, Scraper Agent, Categorizer Agent
- **MCP Tools:** `eximia.run_agent` para Veritas/Intellex

## 📚 Knowledge Bases

- KB_01: CLI_Design_Patterns.md
- KB_02: Workflow_Orchestration.md
- KB_03: Error_Handling_Strategies.md

## ✅ Status

**Pronto para integração** - Aguardando implementação do código Python + workflows Antigravity
