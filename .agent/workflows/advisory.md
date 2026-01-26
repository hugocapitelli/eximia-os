---
description: Convoque um conselho de 3 clones especialistas para criticar e melhorar sua ideia
---

1. **Capturar a Ideia do Usuário**
   - Pergunte ao usuário: "Descreva a ideia que você gostaria que fosse analisada pelos especialistas."
   - Opcionalmente, pergunte: "Qual é a área/domínio principal? (tech, business, performance, etc.)" para ajudar na seleção.

2. **Seleção Automática de Clones**
   - Execute o seletor de clones usando Python:
     ```python
     from eximia_runtime.modules.clone_advisory import run_advisory
     selected = run_advisory(idea="[IDEIA_DO_USUARIO]", domain_hint="[DOMINIO_OPCIONAL]")
     ```
   - Apresente ao usuário os clones selecionados:
     ```
     🎯 **Conselho Consultivo Selecionado:**
     
     1. **[Clone 1]** - [Domain] (Score: X)
        Razões: [Match reasons]
     
     2. **[Clone 2]** - [Domain] (Score: X)
        Razões: [Match reasons]
     
     3. **[Clone 3]** - [Domain] (Score: X)
        Razões: [Match reasons]
     
     Deseja prosseguir com esses especialistas? (sim/não)
     ```

3. **Engine de Seleção de Modelo** (para cada clone)
   - Para cada clone selecionado, chame `eximia_runtime.select_model` com:
     - `agent_name`: "[clone_id]"
     - `query`: "Análise crítica de ideia: [RESUMO_BREVE]"
     - `agent_tier`: 2 (clones são tier 2)
   - Anote o modelo recomendado para cada clone.

4. **Executar Sessão Consultiva em Paralelo**
   - Para cada um dos 3 clones, execute em paralelo via `eximia_runtime.run_agent`:
     
     **Prompt de Consultoria:**
     ```
     Você foi convocado como especialista para analisar a seguinte ideia:
     
     IDEIA: [IDEIA_COMPLETA_DO_USUARIO]
     
     Como [NOME_DO_CLONE], forneça uma análise crítica e construtiva dessa ideia. 
     Estruture sua resposta da seguinte forma:
     
     ## 🟢 Pontos Fortes
     - Liste os aspectos positivos e promissores da ideia
     
     ## 🔴 Pontos Fracos e Riscos
     - Identifique vulnerabilidades, desafios e potenciais problemas
     
     ## 💡 Sugestões de Melhoria
     - Recomendações concretas para aprimorar a ideia
     
     ## 🎯 Parecer Geral
     - Sua avaliação geral: viável? Promissora? Que mudanças são essenciais?
     
     Seja direto, honesto e construtivo. Use sua perspectiva única como [EXPERTISE].
     ```
   
   - Execute cada clone com o modelo selecionado:
     ```
     python -m eximia_runtime.run --agent [clone_id] --model [MODELO] --query "[PROMPT_ACIMA]"
     ```

5. **Agregar Feedback**
   - Colete as respostas dos 3 clones.
   - Use `FeedbackAggregator` para estruturar:
     ```python
     from eximia_runtime.modules.clone_advisory import FeedbackAggregator, CloneFeedback
     
     feedbacks = [
         CloneFeedback(
             clone_id="clone1", 
             clone_name="Nome",
             strengths=[...],
             weaknesses=[...],
             risks=[...],
             suggestions=[...],
             overall_assessment="...",
             raw_response="..."
         ),
         # ... outros clones
     ]
     
     aggregated = FeedbackAggregator.aggregate(feedbacks)
     ```

6. **Apresentar Relatório ao Usuário**
   - Mostre o feedback consolidado:
     ```markdown
     # 📊 Relatório da Consultoria
     
     **Ideia Analisada:** [IDEIA]
     
     **Especialistas Consultados:** [Clone 1], [Clone 2], [Clone 3]
     
     ---
     
     ## 📋 Sumário Executivo
     [aggregated['executive_summary']]
     
     ---
     
     ## 🎭 Perspectivas Individuais
     
     ### [Clone 1 Name]
     
     **🟢 Pontos Fortes:**
     - [pontos...]
     
     **🔴 Pontos Fracos:**
     - [pontos...]
     
     **💡 Sugestões:**
     - [sugestões...]
     
     **🎯 Parecer:** [assessment]
     
     ---
     
     [Repetir para Clone 2 e 3]
     
     ---
     
     ## ✅ Consenso
     - [Pontos onde múltiplos clones concordam]
     
     ## ⚡ Divergências
     - [Pontos onde clones discordam - perspectivas diferentes]
     
     ## 🚀 Recomendações Prioritárias
     1. [Top recommendation]
     2. [Second recommendation]
     3. [Third recommendation]
     ```

7. **Iteração (Opcional)**
   - Pergunte ao usuário: "Deseja refinar a ideia com base no feedback e executar nova consultoria?"
   - Se sim, volte ao passo 1 com a ideia refinada.
   - Se não, pergunte: "Deseja que eu te ajude a implementar essa ideia agora?"

8. **Handoff para Implementação**
   - Se o usuário aprovar, use `@[/maestro]` para orquestrar a implementação da ideia refinada.
   - O Maestro terá contexto completo da consultoria para execução informada.
