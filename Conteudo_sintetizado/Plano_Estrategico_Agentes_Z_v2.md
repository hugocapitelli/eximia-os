# Plano Estratégico: Z Squad (Agentes Z) — v2.1

## 1. Visão Geral e Evolução
Este plano define a arquitetura do **Z Squad**, o sucessor evolutivo do sistema @[The_Recruiter].
A versão 2.0 incorpora os frameworks de engenharia de modelos mentais do **@[The_Cloner]** para garantir que cada agente criado não seja apenas um prompt, mas uma **entidade cognitiva estruturada**.

### Diferencial da v2.0
*   **Fundamentação Científica:** Uso do protocolo `DNA_MENTAL` para definir personas.
*   **Ciclo de Vida Completo:** Introdução do Módulo 5 (Auto-Evolução), permitindo que agentes "aprendam" e sejam re-engenhados com base em métricas reais.
*   **Auditabilidade:** Logs de extração e validação explícitos em cada etapa.

---

## 2. Arquitetura Modular (O Z Squad)

### 🔹 Módulo 1: Orquestração Estratégica (Z1 - The Architect)
*   **Função:** O "Product Manager" do sistema.
*   **Responsabilidade:**
    *   Receber a intenção do usuário.
    *   Definir o "Product Spec" do agente.
    *   Determinar os critérios de sucesso (KPIs).
*   **Saída:** `spec_tecnica.json` (Escopo, Fronteiras, Stakeholders).

### 🔹 Módulo 2: The Profiler (Z2 - Powered by @The_Cloner)
*   **Função:** O "Engenheiro de Modelos Mentais".
*   **Fundamentação (@The_Cloner):**
    *   Utiliza estritamente a estrutura de **Artifacts** do The Cloner.
    *   Não "imagina" a persona; ele a **extrai e estrutura**.
*   **Workflow:**
    1.  Analisa a `spec_tecnica.json`.
    2.  Seleciona "Clones Mentores" (Base de Conhecimento).
    3.  Gera o **DNA Mental** (`04_dna_mental_template.md`):
        *   *Crenças Centrais*
        *   *Princípios de Decisão*
        *   *Frameworks/Métodos*
        *   *Vieses e Riscos*
    4.  Gera a **Base de Conhecimento** (`07_knowledge_base.md`).
*   **Saída:** `perfil_estruturado/` contendo DNA, KB e Style Guide.

### 🔹 Módulo 3: Engenharia de Agentes (Z3 - The Engineer)
*   **Função:** O "Full Stack Developer".
*   **Responsabilidade:**
    *   Converter o `DNA Mental` em **System Prompts** operacionais.
    *   Implementar protocolos de raciocínio (Chain-of-Thought).
    *   Configurar ferramentas (MCP, Function Calling).
    *   Criar Schemas de Input/Output rígidos.
*   **Saída:** Agente funcional (`agente_core.md`, `prompt_operacional.md`, `schemas/*.json`).

### 🔹 Módulo 4: Validação e Qualidade (Z4 - The Auditor)
*   **Função:** O "QA Adversarial".
*   **Responsabilidade:**
    *   Stress testing: Tentar fazer o agente alucinar ou quebrar regras.
    *   Validar contra o `DNA Mental`: "O agente está agindo conforme os princípios definidos?"
    *   Gerar `08_validation.md` (Nota global, pontos fortes/fracos).
*   **Critério:** Só aprova se Nota > 8.5.

### 🔹 Módulo 5: Melhoria Contínua (Z5 - The Evolver) **[NOVO]**
*   **Função:** O "Engenheiro de Confiabilidade (SRE)".
*   **Missão:** Monitorar e Evoluir a frota do **Z Squad**.
*   **Capacidades:**
    *   **Monitoramento Passivo:** Analisa logs de execução dos agentes em produção.
    *   **Detecção de Drift:** Identifica quando um agente começa a performar abaixo do esperado ou quando o contexto muda (ex: nova lei, novo framework).
    *   **Loop de Refinamento:**
        1.  Identifica falha ou oportunidade.
        2.  Solicita ao Z2 (Profiler) uma atualização do `DNA Mental`.
        3.  Solicita ao Z3 (Engineer) um patch no prompt.
        4.  Roda validação Z4.
        5.  **Human Gate:** Pede aprovação para deploy da v1.1.

---

## 3. Fluxo de Decisão para Auto-Evolução (Módulo 5)

O **Z5 The Evolver** opera sob esta lógica de decisão:

1.  **Trigger:**
    *   *Feedback do Usuário:* "Este agente foi muito prolixo."
    *   *Métrica:* Taxa de erro > 5% em validações de schema.
    *   *Tempo:* Revisão periódica (ex: mensal) de obsolescência.

2.  **Análise de Causa Raiz:**
    *   É problema de **Instrução**? (Prompt fraco) -> Acionar Z3.
    *   É problema de **Conhecimento**? (Falta contexto) -> Acionar Z2 (Profiler) para atualizar KB.
    *   É problema de **Personalidade**? (Tom errado) -> Acionar Z2 (Profiler) para ajustar Style Guide.

3.  **Ação de Correção:**
    *   O Z5 abre um "Ticket de Evolução".
    *   O enxame (Z2, Z3, Z4) trabalha no ticket.
    *   Resultado: Candidate Release (vX.Y).

---

## 4. Governança e Controle

Para garantir que a "Auto-Evolução" não gere monstros:

1.  **Human-in-the-Loop Obrigatório:**
    *   Nenhum agente "sobe para produção" (sobrescreve o anterior) sem aprovação explícita do Agente CEO (e do usuário humano).
    *   O Módulo 5 apenas **propõe** e **prepara** a atualização.

2.  **Imutabilidade de Versões:**
    *   Agentes Z usam versionamento semântico (v1.0.0).
    *   Nunca sobrescrevemos arquivos destrutivamente; criamos novas versões ou branches.

3.  **Sanity Check do CEO:**
    *   O Agente CEO verifica se a evolução proposta ainda atende à `spec_tecnica.json` original.

---

## 5. Benefícios Esperados (vs V1)

1.  **Profundidade Psicológica:** Graças ao framework `@The_Cloner`, os agentes não serão apenas "scripts úteis", mas simulações fiéis de frameworks mentais complexos (ex: "Pensar como Ray Dalio").
2.  **Anti-Frágil:** O sistema melhora com o tempo via Módulo 5, em vez de degradar.
3.  **Rigor Técnico:** O uso de schemas e validação adversarial reduz alucinações drasticamente.

---
**Status:** Plano Refinado (v2.0). Aguardando aprovação para implementação.


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Pesquisas]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->