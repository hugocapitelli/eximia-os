---
description: Lista todos os comandos disponíveis do Projeto Codex
---

# 📋 Comandos do Projeto Codex

Exibe a lista completa e categorizada de todos os comandos disponíveis no **Projeto Codex** - o repositório inteligente de conhecimento do exímIA.OS.

## 🔄 Passos

1. Apresentar ao usuário a seguinte lista organizada de comandos:

---

## 📥 Ingestão de Conteúdo

- `/codex-add <url>` - Adicionar conteúdo com review manual
  - Scraper extrai → Categorizer sugere metadata → Salva no INBOX → Preview para aprovação

- `/codex-add-auto <url>` - Adicionar conteúdo com auto-aprovação
  - Scraper + Categorizer → Direto para LIBRARY (pula INBOX)

- `/codex-upload <file>` - Upload de arquivo local (PDF, EPUB, TXT)
  - Copia para INBOX → Extrai texto → Categoriza → Aguarda review

- `/codex-batch <urls|file>` - Adicionar múltiplos URLs em lote (fila)
  - Aceita lista separada por vírgulas ou arquivo .txt
  - Processa sequencialmente com opção de --auto

- `/codex-review` - Revisar conteúdos pendentes no INBOX
  - Lista arquivos → Preview + metadata → Aprovar/Editar/Rejeitar

---

## 🔍 Busca & Navegação

- `/codex-list` - Listar todos os conteúdos da biblioteca
  - Tabela formatada com: ID, título, tipo, autor, status, tags
  - Filtros: `--type`, `--author`, `--status`

- `/codex-search "query"` - Busca full-text usando SQLite FTS5
  - Procura em: título, autor, tags, conteúdo completo
  - Retorna matches ranqueados por relevância

- `/codex-find --author "Nome"` - Buscar por metadata específica
  - Filtros: `--author`, `--type`, `--tag`, `--date-from`, `--credibility-min`

- `/codex-related <content_id>` - Mostrar conteúdos relacionados
  - Analisa tags em comum + relacionamentos manuais
  - Sugere conteúdos similares

---

## ⚙️ Processamento

- `/codex-process <content_id>` - Processar com Intellex
  - Gera LX package: Deep Summary + KBs + Frameworks
  - Salva em `02_PROCESSED/{content_id}/`

- `/codex-validate <content_id>` - Validar credibilidade com Veritas
  - Analisa fonte → Credibility score (0-10) + justificativa
  - Atualiza database com score

- `/codex-tag <content_id>` - Re-categorizar manualmente
  - Editar: tipo, tags, autor, título
  - Opção de re-rodar categorizer IA

---

## 🧠 Intelligence

- `/codex-recommend "tema"` - Recomendações baseadas em gaps de conhecimento
  - Analisa biblioteca atual → Identifica subtópicos faltando
  - Sugere leituras complementares

- `/codex-export "tema"` - Exportar pacote temático
  - Busca conteúdos com tag relacionada
  - Cria pasta em `03_EXPORTS/{tema}/` com arquivos + bibliografia

- `/codex-stats` - Estatísticas e métricas do Codex
  - Total por tipo, status, crescimento
  - Top tags, autores, processamento

---

## 🛠️ Manutenção

- `/codex-reset` - 🗑️ Apagar todo o database (pede confirmação)
  - Limpa todas as tabelas: contents, tags, relationships, history
  - Útil para começar do zero

- `/codex-delete <content_id>` - Deletar conteúdo específico
  - Remove do database e suas tags associadas

- `/codex-clean-dups` - Remover duplicatas automaticamente
  - Detecta conteúdos com mesmo título
  - Mantém o primeiro, remove os demais

---

## 📚 Documentação

- `/codex-commands` - Ver esta lista de comandos (você está aqui!)
- Consulte o **[CODEX_GUIDE.md](file:///c:/Users/hugoc/OneDrive/Área%20de%20Trabalho/exímIA%20Ventures/eximIA.OS/🗄️%20Codex/CODEX_GUIDE.md)** para documentação completa

---

## 💡 Exemplo de Workflow Completo

```bash
# 1. Adicionar artigo com review
/codex-add https://paulgraham.com/wealth.html

# 2. Revisar e aprovar
/codex-review

# 3. Validar credibilidade
/codex-validate art_2026_001

# 4. Processar com Intellex
/codex-process art_2026_001

# 5. Ver estatísticas
/codex-stats

# 6. Exportar pacote temático
/codex-export "Startups"
```

---

**🗄️ Projeto Codex** - Sua segunda memória digital  
Ver guia completo em: `🗄️ Codex/CODEX_GUIDE.md`
