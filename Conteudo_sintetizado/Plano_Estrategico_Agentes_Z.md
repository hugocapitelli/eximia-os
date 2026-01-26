# Plano Estratégico: Agentes Z (Sucessores do The Recruiter)

## 1. Visão Geral e Missão
O projeto **Agentes Z** visa substituir o atual monólito "The Recruiter" por um **ecossistema multiagente especializado (Swarm)**.
Enquanto o *The Recruiter v4.0* operava como um "Herói Solitário" simulando múltiplas fases, os **Agentes Z** materializam cada fase em uma entidade autônoma, dedicada e orquestrada.

**Objetivo:** Criar a mais sofisticada fábrica de inteligência artificial da ExímIA, capaz de produzir agentes com profundidade técnica e validação superiores a qualquer benchmark humano.

## 2. Justificativa da Substituição
| Característica | The Recruiter (Atual) | Agentes Z (Novo) |
| :--- | :--- | :--- |
| **Arquitetura** | Agente Único (Carga Cognitiva Alta) | Swarm de Especialistas (Foco Extremo) |
| **Validação** | Auto-reflexão interna (Simulada) | Auditoria Externa (Adversarial) |
| **Contexto** | Limitado à janela atual | Preservado via MCP/Arquivos |
| **Escalabilidade** | Linear (Um prompt gigante) | Modular (Vários prompts otimizados) |
| **Resultado** | Agente Generalista Avançado | Agente Especialista de Elite |

A complexidade do "Pipeline 10 Fases" exige que a cognição seja distribuída. Um único modelo não consegue ser, simultaneamente, um excelente *Arquiteto Visionário* e um *Auditor Crítico*.

## 3. Arquitetura Proposta: O "Z-Squad"
O sistema será composto por 4 agentes especialistas, operando em cadeia (Pipeline):

### 🧠 Z1: The Architect (O Visionário)
*   **Missão:** Traduzir a intenção vaga do usuário em especificação técnica rigorosa.
*   **Responsabilidade:** Definir o "Competency Map", fronteiras (Scope) e critérios de sucesso.
*   **Saída:** `spec_tecnica.json` (Mapa de competências e skills).

### 🧬 Z2: The Profiler (O Psicólogo)
*   **Missão:** Construir a personalidade e a base de conhecimento (Backstory).
*   **Responsabilidade:** Selecionar os "Clones" (mentores), definir o tom de voz e criar a `knowledge_base` inicial.
*   **Saída:** Arquivos `agente_core.md` (sem prompt técnico, apenas identidade) e `KB_*.md`.

### ⚙️ Z3: The Engineer (O Técnico)
*   **Missão:** Escrever o código operacional e os protocolos de raciocínio.
*   **Responsabilidade:** Criar os Prompts do Sistema, configurar XML/Markdown, definir Schemas JSON de Input/Output.
*   **Saída:** `prompt_operacional.md` e `schemas/*.json`.

### 🛡️ Z4: The Auditor (O Crítico)
*   **Missão:** Tentar "quebrar" o agente criado antes da entrega.
*   **Responsabilidade:** Simular inputs adversariais, testar alinhamento com a Spec do Z1, validar schemas.
*   **Saída:** `relatorio_auditoria.md` (Pass/Fail).

## 4. Fluxo de Criação (The Z-Pipeline)
1.  **Input do Usuário:** "Preciso de um agente CFO."
2.  **Z1 Architect:** Analisa o pedido → Gera `spec_tecnica_cfo.json`.
3.  **Z2 Profiler:** Lê a Spec → Cria `persona_cfo.md` e seleciona (Dalio, Drucker).
4.  **Z3 Engineer:** Lê Spec + Persona → Gera `cfo_prompt.md` e `input_validations.json`.
5.  **Z4 Auditor:** Roda testes simulados.
    *   *Falha:* Devolve para Z3 com logs de erro.
    *   *Sucesso:* Empacota e entrega ao usuário.

## 5. Critérios Técnicos de Sucesso
*   **Granularidade:** Cada Agente Z deve ter um System Prompt < 2000 tokens (foco total).
*   **Assertividade:** O Z4 deve rejeitar pelo menos 30% das primeiras versões (padrão de qualidade alto).
*   **Integração:** Uso nativo de MCP para passar arquivos entre Z1 → Z2 → Z3 → Z4.
*   **Determinismo:** Inputs iguais devem gerar agentes com estrutura idêntica (Zero alucinação na estrutura de pastas).

## 6. Riscos e Mitigação
*   **Risco:** Perda de coerência entre Z1 e Z3 (Telefone sem fio).
    *   *Mitigação:* Schema de Spec Rígido (Z1 output é lei).
*   **Risco:** Over-engineering (Demorar muito para criar um agente simples).
    *   *Mitigação:* Modo "Fast Track" no Z1 para agentes triviais.

---
**Status:** Plano pronto para revisão. Aguardando sinal verde para implementação.


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Pesquisas]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->