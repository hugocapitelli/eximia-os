# Guia de Uso - Projeto Codex

## 🚀 Quick Start

### 1. Inicializar Database (primeira vez)
```bash
cd "00_Codex"
py scripts/init_db.py
```

### 2. Testar Scraper
```python
from X_Agents.codex_scraper.scraper import CodexScraper

scraper = CodexScraper()
result = scraper.extract_url("https://paulgraham.com/avg.html")
print(f"Saved: {result['file_path']}")
```

### 3. Testar Categorizer
```python
from X_Agents.codex_categorizer.categorizer import CodexCategorizer
import os

# Configure API key
os.environ['GEMINI_API_KEY'] = 'your-key-here'

categorizer = CodexCategorizer(api_key=os.getenv('GEMINI_API_KEY'))
result = categorizer.analyze_content("00_Codex/eximia_data/00_INBOX/art_2026_001.md")
print(f"Type: {result['categorization']['type']}")
print(f"Tags: {result['categorization']['tags']}")
```

### 4. Usar CLI Completo
```bash
# Adicionar com review
py X_Agents/codex_cli/cli.py add https://example.com/article

# Adicionar sem review
py X_Agents/codex_cli/cli.py add-auto https://example.com/article

# Listar conteúdos
py X_Agents/codex_cli/cli.py list

# Buscar
py X_Agents/codex_cli/cli.py search "product market fit"

# Estatísticas
py X_Agents/codex_cli/cli.py stats
```

---

## 📋 Comandos Disponíveis

### Via CLI Python

```bash
# Ingestão
py X_Agents/codex_cli/cli.py add <url>           # Com review
py X_Agents/codex_cli/cli.py add-auto <url>      # Sem review

# Busca
py X_Agents/codex_cli/cli.py list                # Todos
py X_Agents/codex_cli/cli.py list --type article # Filtrar
py X_Agents/codex_cli/cli.py search "query"      # Busca FTS5

# Intelligence  
py X_Agents/codex_cli/cli.py stats               # Estatísticas
```

### Via Antigravity (futuro)

- `/codex-add <url>` - Adicionar com review
- `/codex-list` - Listar conteúdos
- `/codex-search "query"` - Buscar
- `/codex-stats` - Estatísticas

---

## 🔧 Configuração

### Gemini API Key (para Categorizer)

```bash
# Windows PowerShell
$env:GEMINI_API_KEY = "your-api-key-here"

# Linux/Mac
export GEMINI_API_KEY="your-api-key-here"
```

Ou criar arquivo `.env`:
```
GEMINI_API_KEY=your-api-key-here
```

### Dependências

```bash
py -m pip install trafilatura beautifulsoup4 requests google-generativeai
```

---

## 🎯 Workflow Típico

### 1. Adicionar Artigo
```bash
py X_Agents/codex_cli/cli.py add https://paulgraham.com/wealth.html
```

**O que acontece:**
1. Scraper extrai conteúdo → markdown
2. Categorizer analisa com Gemini → metadata
3. Preview é mostrado
4. Você aprova (s/N)
5. Salvo em database + movido para LIBRARY

### 2. Buscar Conteúdo
```bash
py X_Agents/codex_cli/cli.py search "startups"
```

### 3. Ver Estatísticas
```bash
py X_Agents/codex_cli/cli.py stats
```

---

## 📁 Estrutura de Arquivos

```
00_Codex/
├── eximia_data/
│   ├── 00_INBOX/          # Conteúdos aguardando review
│   ├── 01_LIBRARY/        # Biblioteca aprovada
│   │   ├── articles/
│   │   ├── books/
│   │   └── ...
│   ├── 02_PROCESSED/      # Processados com Intellex
│   ├── 03_EXPORTS/        # Pacotes exportados
│   └── vault.db           # Database SQLite
└── scripts/
    ├── init_db.py         # Inicializar DB
    └── database.py        # Operações CRUD

X_Agents/
├── codex_scraper/
│   ├── README.md
│   └── scraper.py         # ✅ Pronto
├── codex_categorizer/
│   ├── README.md
│   └── categorizer.py     # ✅ Pronto
└── codex_cli/
    ├── README.md
    └── cli.py             # ✅ Pronto
```

---

## ⚠️ Troubleshooting

### Erro: "Database não encontrado"
```bash
cd 00_Codex
py scripts/init_db.py
```

### Erro: "Module 'trafilatura' not found"
```bash
py -m pip install trafilatura beautifulsoup4
```

### Categorizer retorna confidence baixo
- Normal sem API key do Gemini
- Configure `GEMINI_API_KEY` para usar IA
- Sem API, usa fallback (keywords simples)

### MCP Server Issues
Se os comandos `/codex-process` ou `/codex-validate` retornarem "MCP não disponível":
1. Reinicie o Antigravity (VSCode/Gemini)
2. O servidor `eximia_runtime` deve carregar automaticamente
3. Verifique se `.vscode/mcp.json` existe na raiz

### Gemini API Error
Se receber erros de API:
1. Verifique se a chave está válida
2. Confirme se a variável de ambiente está carregada:
   ```powershell
   echo $env:GEMINI_API_KEY
   ```
3. O sistema usará fallback automático se a API falhar

### Database Locked
Se encontrar erro "database is locked":
1. Feche conexões abertas (DB Browser, DBeaver)
2. Apenas um processo pode escrever no SQLite por vez

---

## 🔮 Próximos Passos

### Para tornar workflows Antigravity funcionais:

1. **Criar workflows em `.agent/workflows/`:**
   - `codex-add.md` → chama `cli.py add`
   - `codex-list.md` → chama `cli.py list`
   - etc.

2. **Integrar com Veritas/Intellex:**
   - `/codex-validate` → chama Veritas via MCP
   - `/codex-process` → chama Intellex via MCP

3. **Criar Knowledge Bases:**
   - 7 KBs documentados nos READMEs dos agentes

---

**✅ Status:** Código Python 100% funcional  
**📍 Uso:** Via CLI Python (`py X_Agents/codex_cli/cli.py`)  
**🔄 Próximo:** Workflows Antigravity (opcional)
