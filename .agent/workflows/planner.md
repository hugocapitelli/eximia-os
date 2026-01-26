---
description: Execute planejamento estratégico anual com The_Planner (multi-framework)
---
1. **Analise o pedido do usuário** para extrair o contexto de planejamento.

2. **Execute The_Planner:**
   ```
   py -m eximia_runtime.run --agent the_planner --query "[QUERY DO USUÁRIO]"
   ```

3. **The_Planner irá:**
   - Fazer diagnóstico do contexto organizacional
   - Recomendar framework ideal (OKR, Hoshin Kanri, BSC, ou V2MOM)
   - Guiar construção do plano passo a passo
   - Executar quality audit (Circuit Breakers)
   - Propor governance cadence

4. **Frameworks disponíveis:**
   - **OKR:** Para startups, tech, ambientes ágeis (trimestral)
   - **Hoshin Kanri:** Para Lean, alinhamento cascata (anual)
   - **Balanced Scorecard:** Para visão holística 4 perspectivas
   - **V2MOM:** Para transparência radical (Salesforce style)

5. **Monitore a execução** e apresente os outputs ao usuário.

6. **Salve o output** se solicitado:
   ```
   py -m eximia_runtime.save_output --agent the_planner --query "[QUERY]" --output "[RESULTADO]"
   ```
