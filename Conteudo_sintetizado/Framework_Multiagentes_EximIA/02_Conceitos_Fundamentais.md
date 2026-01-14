# 02. Conceitos Fundamentais

## 📚 Glossário do Sistema Multiagente

### 1. Agente vs. Modelo (LLM)
*   **LLM (Grande Modelo de Linguagem):** O "cérebro" cru (GPT-4, Claude 3.5).
*   **Agente:** O "funcionário". É o LLM envolto em um **loop de execução** com acesso a **ferramentas**, **memória** e um **objetivo**.
    *   *Analogia (IBM):* O LLM é o conhecimento enciclopédico; o Agente é o profissional que usa esse conhecimento para realizar um trabalho.

### 2. Swarm Intelligence (Enxame)
*   Conceito onde múltiplos agentes simples interagem para resolver problemas complexos que nenhum deles conseguiria resolver sozinho.
*   *Fonte:* "From Solo to Swarm" (Cursor).
*   **Exemplo:** Um agente "Planejador" cria os tickets, "Desenvolvedores" codam em paralelo, e um "QA" valida.

### 3. Modularity & Specialization (LangChain)
*   **Modularidade:** A capacidade de trocar um agente sem quebrar o sistema.
*   **Especialização:** Cada agente é otimizado para uma tarefa única.
    *   *Exemplo:* Um agente de "Pesquisa Legal" não precisa saber escrever código Python, apenas ler leis.

### 4. Orquestração vs. Coreografia
*   **Orquestração (Hierárquico):** Um agente "Chefe" (Manager) delega tarefas e cobra resultados. (Ex: Claude Code orquestrando skills).
*   **Coreografia (Descentralizado):** Agentes reagem uns aos outros sem um chefe central. (Ex: Arquitetura Gossip Event Server).

### 5. MCP (Model Context Protocol)
*   Um padrão aberto que permite aos agentes "conectarem-se" a dados e ferramentas de forma segura e padronizada.
*   Permite que o Agente A passe contexto rico para o Agente B sem perder informação.

### 6. Gossip Protocol (Evento de Fofoca)
*   Método de disseminação de informações em sistemas distribuídos (revisado no vídeo de Arquitetura Autônoma). Agentes "espalham" eventos (ex: "Nova task criada") para que os agentes interessados reajam.
