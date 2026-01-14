# 03. Padrões de Arquitetura Multiagente

## 📐 Introdução
Não existe uma arquitetura única (Silver Bullet). O framework ExímIA prevê dois padrões principais, derivados da análise de ferramentas como Claude Code e Cursor Swarms.

## 🏛️ Padrão 1: Orquestração Hierárquica (The Boss & Workers)
*   **Referência:** Viktoria Semaan (Building AI Team) & Claude Code.
*   **Estrutura:**
    *   **Orquestrador (Manager):** Recebe o input do usuário, quebra em sub-tarefas e delega.
    *   **Especialistas (Workers):** Executam a tarefa e reportam ao Manager.
*   **Melhor para:** Processos lineares, repetitivos e que exigem garantia de qualidade (ex: Preparação para entrevista, Geração de PRD).

## 🐝 Padrão 2: Enxame Descentralizado (Swarm Intelligence)
*   **Referência:** Cursor Agent Tabs & Gossip Event Server.
*   **Estrutura:**
    *   Não há um chefe central controlador de cada passo.
    *   Agentes compartilham um estado comum (Contexto) e reagem a mudanças.
    *   **Exemplo:** O Agente de "Planejamento" coloca um ticket no quadro; o Agente "Dev" vê o ticket e começa a trabalhar; o Agente "QA" vê um PR aberto e começa a testar.
*   **Melhor para:** Desenvolvimento de software complexo, simulações de ecossistema.

## 🔀 Qual Escolher?
| Característica | Orquestração (Hierárquica) | Enxame (Swarm) |
| :--- | :--- | :--- |
| **Controle** | Alto (Centralizado) | Distribuído |
| **Escalabilidade** | Média (O chefe vira gargalo) | Alta (Autônomo) |
| **Complexidade** | Baixa | Alta |
| **Exemplo ExímIA** | Geração de Relatórios | Coding Assistant no IDE |
