---
description: Crie um novo Clone Digital usando o pipeline El Clonador com Model Selection
---
1. **Analise o Pedido**
   - Identifique a celebridade ou expert a ser clonado.

2. **Engine de Seleção de Modelo**
   - Chame `eximia_runtime.select_model` com:
     - `agent_name`: "el_clonador"
     - `query`: "Clonar [NOME] - Pesquisa profunda e criação de perfil"
     - `agent_tier`: 2
   - **NOTIFY_USER**: "Recomendo usar o modelo **[MODELO]** para este processo de clonagem. Aprova?"

3. **Execução da Pipeline (Terminal)**
   - Execute o script da fábrica (ou o agente coordenador) com o modelo escolhido:
     `python -m eximia_runtime.run --agent el_clonador --model [MODELO] --query "Iniciar pipeline para [NOME]"`

4. **Monitoramento**
   - Acompanhe as fases (C1 Hunter -> C2 Extractor -> C3 Creator).
   - Se necessário, intervenha entre fases.
