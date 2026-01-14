# 06. Processos de Orquestração

## 🎼 O Loop de Orquestração
Para transformar agentes estáticos em um processo, usamos o conceito de **State Graph** (similar ao LangGraph).

### Passo 1: Definição de Estado (The Shared State)
O estado deve conter:
*   `user_objective`: O que o usuário pediu.
*   `plan`: A lista de passos (checklist).
*   `current_step`: Onde estamos.
*   `artifacts`: O que já foi produzido.

### Passo 2: O Ciclo de Vida da Tarefa
1.  **Input:** Usuário envia comando.
2.  **Routing:** Um "Router Agent" (ou o próprio Manager) decide quem deve tratar. "É uma pergunta técnica? -> Planner de Dev". "É uma dúvida legal? -> Advogado".
3.  **Execution (Loop):**
    *   Agente executa.
    *   Tool Output retorna.
    *   Reflexão (Self-Correction): "O output está bom?".
4.  **Handoff:** Agente passa o bastão para o próximo (via MCP ou chamada direta).
5.  **Final Review:** O Manager agrega tudo e entrega ao usuário.

### Exemplo Prático (Job Search - Viktoria Semaan)
1.  **Agente Pesquisador:** Varre o LinkedIn -> Salva Vagas em CSV.
2.  **Handoff:** Passa o CSV para o Agente Analista.
3.  **Agente Analista:** Filtra vagas por salário -> Cria Lista Curta.
4.  **Handoff:** Passa Lista Curta para Agente Redator.
5.  **Agente Redator:** Gera Cover Letters personalizadas para cada vaga.

## 🛠️ Ferramentas de Orquestração
*   **Low-Level:** Código Python/langgraph definindo os nós e arestas.
*   **High-Level:** Frameworks como CrewAI ou Autogen (citados na playlist do Ofir) que abstraem esse loop.
