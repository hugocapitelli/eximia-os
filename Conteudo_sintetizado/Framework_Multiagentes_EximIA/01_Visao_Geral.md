# 01. Visão Geral do Framework Multiagentes ExímIA

## 🎯 Objetivo
Este framework define a arquitetura, protocolos e padrões para a construção de **Sistemas Multiagentes (MAS)** escaláveis e autônomos na ExímIA.AI. Ele sintetiza as melhores práticas de orquestração (Claude Code/MCP), comunicação (Gossip Protocol) e estruturação de times (Swarm Intelligence).

## 🌍 O Que são Sistemas Multiagentes?
Diferente de um agente singular que tenta fazer tudo (monolítico), um Sistema Multiagente distribui a cognição entre entidades especializadas. Assim como uma equipe humana ou uma colmeia ("Beehive Analogy"), o poder surge da **colaboração** e da **especialização**.

### Principais Benefícios (Fonte: LangChain & IBM)
1.  **Modularidade:** A complexidade é quebrada em partes menores.
2.  **Especialização:** Agentes podem usar ferramentas e prompts específicos para sua função (ex: apenas ferramentas de coding para o Dev).
3.  **Controle:** É mais fácil debugar um agente específico do que um prompt gigante.

## 🏗️ Pilares do Framework ExímIA

### 1. A Metáfora do Time (Team/Swarm)
Tratamos os agentes não como scripts, mas como **funcionários digitais** (Planner, Manager, Dev, QA). Eles possuem responsabilidades claras e interagem para entregar um produto final.

### 2. Protocolos de Comunicação
A comunicação não é apenas troca de texto, mas fluxo de eventos e contexto.
*   **MCP (Model Context Protocol):** Para padronizar como agentes acessam dados e ferramentas.
*   **Event-Driven (Gossip):** Para sistemas distribuídos onde agentes reagem a eventos do ecossistema.

### 3. Orquestração Híbrida
Suportamos tanto modelos hierárquicos (Manager -> Workers) quanto descentralizados (Swarm), dependendo da complexidade da tarefa.

---
**Próximos Passos:** Consulte `02_Conceitos_Fundamentais.md` para entender o vocabulário e `07_Playbook_Criacao_Multiagentes.md` para começar a construir.
