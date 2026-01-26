# 05. Fluxos de Comunicação

## 📡 A Importância do Contexto
O maior desafio em Multiagentes (citado nos vídeos IBM e LangChain) é a perda de contexto (Telephone Game). Definimos dois modos de mitigar isso.

## 🔌 Protocolo MCP (Model Context Protocol)
*   **Uso:** Para garantir que todos os agentes vejam as mesmas "verdades".
*   **Funcionamento:** Um servidor MCP centraliza os recursos (arquivos, bancos de dados).
*   **Fluxo:**
    1.  Agente A pede: "Ler Arquivo X".
    2.  Servidor MCP retorna o conteúdo estruturado.
    3.  Agente A processa e escreve "Arquivo Y" via MCP.
    4.  Agente B lê "Arquivo Y" via MCP.
*   *Fonte:* Vídeo "Claude Code + MCP".

## 🗣️ Event-Driven Gossip (Para Sistemas Autônomos)
*   **Uso:** Para sistemas onde os agentes não estão necessariamente conectados ao mesmo servidor central o tempo todo.
*   **Funcionamento:** Agentes "assinam" tipos de eventos.
*   **Fluxo:**
    1.  Planner emite evento: `TASK_CREATED {id: 1, desc: "Fix Login"}`.
    2.  Barramento propaga o evento (Gossip).
    3.  Agente Dev (assinante de `TASK_CREATED`) recebe e inicia trabalho.
    4.  Agente Dev emite: `PR_OPENED {id: 1, link: "..."}`.
    5.  Agente QA (assinante de `PR_OPENED`) recebe e inicia teste.
*   *Fonte:* Vídeo "Arquitetura de IA para Ecossistema Autônomo".

## 📝 Documentação como Comunicação
Para tarefas assíncronas longas, a melhor comunicação é a escrita de arquivos (docs) em um repositório compartilhado, seguindo padrões (Markdown).
Lema: *"Se não está escrito no `shared_context`, não aconteceu."*


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Pesquisas]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->