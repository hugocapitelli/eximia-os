# 04. Papéis de Agentes (Roles)

## 🎭 Definindo Personas
Para criar um time eficaz, definimos papéis agnósticos que podem ser preenchidos por diferentes modelos (LLMs). Inspirado no vídeo "From Solo to Swarm" e tutoriais do LangChain.

## 🏢 O Core Team (O "Squad" Padrão)

### 1. 🧠 The Planner (O Arquiteto)
*   **Responsabilidade:** Receber objetivos vagos e quebrá-los em passos lógicos (Tickets/Tasks).
*   **Ferramentas:** Acesso a arquivos de especificação, gestão de tickets (Jira/Trello mock).
*   **Prompt Key:** "You are a Senior Project Manager focusing on breakdown structure..."

### 2. 👩‍💻 The Maker (O Executor)
*   **Responsabilidade:** Executar uma tarefa única e específica.
*   **Variantes:**
    *   *Dev:* Escreve código.
    *   *Writer:* Escreve copy.
    *   *Researcher:* Busca informações.
*   **Ferramentas:** IDE, Web Search, FileSystem.

### 3. 🕵️ The Reviewer (O Crítico/QA)
*   **Responsabilidade:** Validar o trabalho do Maker contra os critérios do Planner.
*   **Modo de Ação:** Só aprova se atender **100%** dos requisitos. Se falhar, devolve com feedback específico.
*   **Prompt Key:** "You are a Critical QA Auditor. Find flaws..."

### 4. 🔗 The Integrator (O Hub)
*   **Responsabilidade:** Unir as partes. Em sistemas menores, o próprio Planner faz isso. Em sistemas maiores (Gossip), ele gerencia o merge de código ou a compilação do relatório final.

## 🧩 Modificadores de Papel
Podemos adicionar "Skills" aos papéis via MCP (Model Context Protocol):
*   `+ Access Database`
*   `+ Access Slack`


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Pesquisas]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->