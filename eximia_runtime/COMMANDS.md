# Eximia Runtime — Guia de Comandos

## Configuração Inicial

### 1. Configurar API Key
```powershell
cd "C:\Users\hugoc\OneDrive\Área de Trabalho\exímIA Ventures\eximIA.OS\eximia_runtime"
echo GEMINI_API_KEY=sua_chave_aqui > .env
```

### 2. Configurar MCP (Antigravity)
Copy `eximia_runtime/mcp_config.json` content to `C:\Users\hugoc\.gemini\settings.json`.

---

## Slash Commands (Antigravity) 🚀

Use estes comandos diretamente no chat do Antigravity:

| Comando | Descrição | Exemplo |
|---------|-----------|---------|
| **/veritas** | Pesquisa profunda e validação | `/veritas Market size de SaaS no Brasil` |
| **/cfo** | Análise financeira e valuation | `/cfo Valuation de startup com R$1M receita` |
| **/clo** | Análise jurídica e riscos | `/clo Analise riscos da LGPD para este app` |
| **/maestro** | Orquestração de tarefas complexas | `/maestro Crie uma estratégia de lançamento completa` |
| **/eximia** | Menu principal e lista de agentes | `/eximia` |

---

## CLI Commands

Todos os comandos devem ser executados a partir da pasta raiz do projeto:
```powershell
cd "C:\Users\hugoc\OneDrive\Área de Trabalho\exímIA Ventures\eximIA.OS"
```

### Listar Agentes
```powershell
py -m eximia_runtime.interfaces.cli list

# Filtrar por tier (1=Tactical, 2=Executive, 3=Expert)
py -m eximia_runtime.interfaces.cli list --tier 3

# Filtrar por categoria
py -m eximia_runtime.interfaces.cli list --category factory
```

### Informações de Agente
```powershell
py -m eximia_runtime.interfaces.cli info the_veritas
py -m eximia_runtime.interfaces.cli info the_cfo
```

### Executar Agente
```powershell
# Básico
py -m eximia_runtime.interfaces.cli run the_veritas --query "Pesquise market size de telemedicina"

# Com modelo específico
py -m eximia_runtime.interfaces.cli run the_cfo --query "Faça valuation de startup" --model gemini/gemini-2.0-flash

# Salvar output
py -m eximia_runtime.interfaces.cli run the_veritas --query "Pesquise X" --output resultado.md
```

### Iniciar API Server
```powershell
# Padrão (localhost:8000)
py -m eximia_runtime.interfaces.cli serve

# Porta customizada
py -m eximia_runtime.interfaces.cli serve --port 3000

# Com auto-reload (desenvolvimento)
py -m eximia_runtime.interfaces.cli serve --reload
```

### Ver Métricas
```powershell
py -m eximia_runtime.interfaces.cli metrics
```

### Indexar Knowledge Bases
```powershell
py -m eximia_runtime.interfaces.cli index-kb
```

### Versão
```powershell
py -m eximia_runtime.interfaces.cli version
```

---

## API Endpoints

Após `serve`, acesse `http://localhost:8000/docs` para Swagger UI.

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/health` | Status da API |
| GET | `/v1/agents` | Lista agentes |
| GET | `/v1/agents/{name}` | Detalhes agente |
| GET | `/v1/agents/{name}/health` | Saúde do agente |
| POST | `/v1/agents/{name}/execute` | Executar agente |
| POST | `/v1/orchestrate` | Orquestração inteligente |
| GET | `/v1/metrics` | Métricas globais |
| GET | `/v1/metrics/agents/{name}` | Métricas por agente |
| GET | `/v1/traces` | Traces recentes |
| GET | `/v1/traces/{id}` | Trace específico |

### Exemplo de Chamada API
```bash
curl -X POST http://localhost:8000/v1/agents/the_veritas/execute \
  -H "Content-Type: application/json" \
  -d '{"query": "Pesquise market size de telemedicina no Brasil"}'
```

---

## MCP Tools (Antigravity)

Após configurar o MCP, peça ao Antigravity:

| Tool | Uso |
|------|-----|
| `veritas_research` | "Use veritas_research para pesquisar X" |
| `cfo_analyze` | "Use cfo_analyze para analisar viabilidade de Y" |
| `clo_legal_check` | "Use clo_legal_check para verificar compliance de Z" |
| `maestro_orchestrate` | "Use maestro_orchestrate para resolver problema complexo" |
| `agent_list` | "Use agent_list para listar agentes disponíveis" |

---

## Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `GEMINI_API_KEY` | API key do Gemini | (obrigatório) |
| `OPENAI_API_KEY` | API key OpenAI | (opcional) |
| `ANTHROPIC_API_KEY` | API key Claude | (opcional) |
| `DEFAULT_MODEL` | Modelo padrão LiteLLM | `gemini/gemini-2.0-flash` |
| `REDIS_URL` | URL do Redis | `redis://localhost:6379` |
| `LOG_LEVEL` | Nível de log | `INFO` |
