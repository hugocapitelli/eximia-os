---
description: Crie um novo Agente Operacional usando o Z Squad com Model Selection
---
1. **Analise o Pedido**
   - Entenda o objetivo e o nível de complexidade do novo agente.

2. **Identificar Tier e Modelo**
   - Determine o tier (1, 2 ou 3) baseada na complexidade.
   - Chame `eximia_runtime.select_model`:
     - `agent_name`: "z_squad"
     - `query`: "Criar agente [NOME] para [OBJETIVO]"
     - `agent_tier`: [TIER_IDENTIFICADO]
   - **NOTIFY_USER**: "Engine recomenda **[MODELO]** para a criação deste agente (Z Squad). Devo proceder?"

3. **Execução (Terminal)**
   - Execute o Z Squad com o modelo selecionado:
     `python -m eximia_runtime.run --agent z_squad --model [MODELO] --query "Criar agente [NOME]"`

4. **Acompanhamento**
   - Monitore a criação dos artefatos (Z1 Architect -> Z2 Profiler -> Z3 Engineer).
