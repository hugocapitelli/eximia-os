# 07. Playbook: Guia de Implementação Multiagente ExímIA

## 🏁 Introdução
Este é o guia passo-a-passo (Step-by-Step) para transformar um problema em uma solução multiagente, baseado no método Semaan/Ofir.

## 📋 Fase 1: Definition (O "Product Spec")
Antes de codar, defina:
1.  **Objetivo Único:** O que o enxame deve entregar? (Ex: "Um relatório de vagas de emprego").
2.  **Input:** O que entra? (Ex: "Cargo desejado e local").
3.  **Output:** O que sai? (Ex: "Um arquivo Markdown com 5 vagas e cover letters").

## 👥 Fase 2: Casting (Seleção de Elenco)
Para cada tarefa principal, defina um agente.
*   *Quem busca dados?* -> Researcher.
*   *Quem analisa?* -> Data Analyst.
*   *Quem escreve?* -> Content Writer.
*   *Quem gerencia?* -> Project Manager.

**Template de Definição de Agente:**
```markdown
*   **Role:** [Nome]
*   **Goal:** [Objetivo específico]
*   **Backstory:** "You are an expert in..."
*   **Tools:** [Lista de ferramentas: WebSearch, Calculator, FileRead]
*   **Allow Delegation:** [True/False]
```

## 🛠️ Fase 3: Tooling (Armamento)
Agentes sem ferramentas são apenas chatbots.
1.  **Identifique a necessidade:** O agente precisa acessar a web? Ler PDFs? Conectar no Notion?
2.  **Implemente via MCP:** Se possível, use servidores MCP para dar acesso seguro.
3.  **Fallback:** Use function calling nativo se MCP não estiver disponível.

## 🎼 Fase 4: Orchestration (A Regência)
Defina o fluxo no seu código (Python/LangGraph/CrewAI):
*   **Sequencial:** A -> B -> C (Mais simples, menos erros).
*   **Hierárquico:** Manager manda em A e B. (Melhor para controle).
*   **Assíncrono:** A e B trabalham juntos. (Avançado).

## 🧪 Fase 5: Testing & Loop
1.  **Rode com input simples.**
2.  **Observe os logs:** O agente A passou a informação certa para o B?
    *   *Erro comum:* Perda de contexto. O agente B não sabe o que o A fez.
    *   *Correção:* Melhore o Prompt de Handoff ou use um Shared Memory (MCP).
3.  **Itere:** Refine as "personas" (Backstories) para corrigir comportamentos.
