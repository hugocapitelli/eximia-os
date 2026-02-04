---
title: "Eximia Runtime"
galaxy: "RUNTIME"
galaxy-color: "#1E90FF"
document-type: "documentation"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "readme"
  - "eximia runtime"
  - "instalação"
  - "uso"
  - "cli"
  - "listar agentes"
  - "executar agente"
  - "benchmark"
  - "api"
  - "iniciar servidor"
tags:
  - "galaxy-runtime"
  - "documentation"
---

# Eximia Runtime

Backend Runtime para execução programática dos agentes eximIA.OS.

## Instalação

```bash
cd eximia_runtime
pip install -e .
```

## Uso

### CLI
```bash
# Listar agentes
eximia list

# Executar agente
eximia run veritas --query "Pesquise market size de telemedicina"

# Benchmark
eximia benchmark cfo --scenario dcf_valuation
```

### API
```bash
# Iniciar servidor
eximia serve

# Endpoints disponíveis
# POST /v1/agents/{agent}/execute
# GET  /v1/agents
# GET  /v1/agents/{agent}/health
```

## Estrutura

```
eximia_runtime/
├── core/           # Núcleo do runtime
├── memory/         # ChromaDB + Redis
├── protocols/      # Veritas First, Handoff
├── interfaces/     # CLI, API, MCP
├── agents/         # Definições de agentes
└── utils/          # Logging, config
```

## Configuração

Crie um arquivo `.env`:

```env
GEMINI_API_KEY=your_key
OPENAI_API_KEY=your_key
ANTHROPIC_API_KEY=your_key
REDIS_URL=redis://localhost:6379
```

## Licença

Proprietary - ExímIA Ventures

[[.aios-core/README.md]]
#galaxy-runtime