---
description: Orquestre tarefas complexas via Maestro com seleção inteligente de modelo
---
1. **Analise o Pedido**
   - Entenda a complexidade da tarefa e os objetivos.

2. **Engine de Seleção de Modelo (Model Selector)**
   - Chame a tool `eximia_runtime.select_model` com:
     - `agent_name`: "the_maestro"
     - `query`: A tarefa a ser executada
     - `agent_tier`: 3
   - Analise a recomendação (ex: "claude-3-5-sonnet" ou "ollama/qwen2.5").
   - **NOTIFY_USER**: Apresente a recomendação detalhada e peça aprovação para executar.
     - "O Engine recomenda usar **[MODELO]** (Score: X/5) porque [RAZÃO]. Posso prosseguir?"

3. **Execução (Terminal)**
   - Após aprovação, execute o comando no terminal (não chame o run_agent diretamente):
     `python -m eximia_runtime.run --agent the_maestro --model [MODELO_ESCOLHIDO] --query "[TAREFA]"`
   - Se houver contexto longo, primeiro salve em um arquivo temp e use `--file`.

4. **Acompanhamento**
   - O agente executará no terminal. Monitore o output.
   - Quando finalizar, leia o arquivo de output gerado (se houver) ou apenas reporte o sucesso.
