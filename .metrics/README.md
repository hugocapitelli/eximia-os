# .metrics — ExímIA.OS Observability

Este diretório contém métricas e logs de performance do ecossistema de agentes.

## Estrutura

```
.metrics/
├── README.md              # Este arquivo
├── benchmark_history.md   # Histórico de benchmarks executados
├── agent_dashboard.md     # KPIs consolidados por agente
└── logging_template.yaml  # Template para logging
```

## Propósito

1. **Rastreabilidade**: Histórico de todos os benchmarks e testes
2. **Performance**: KPIs de cada agente ao longo do tempo
3. **Observabilidade**: Logs para debugging e melhoria contínua

## Como Usar

- **Após benchmark**: Adicione entrada em `benchmark_history.md`
- **Após validação Z4**: Atualize `agent_dashboard.md`
- **Para novos logs**: Siga o formato de `logging_template.yaml`
