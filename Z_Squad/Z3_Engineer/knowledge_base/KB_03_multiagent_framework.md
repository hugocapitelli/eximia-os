---
title: "KB_03 — Multi-Agent Framework Principles"
galaxy: "CREATION"
galaxy-color: "#FF8C00"
document-type: "knowledge-base"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "kb-03-multiagent-framework"
  - "kb_03 — multi-agent framework "
  - "🎯 propósito"
  - "1. agentes com ferramentas"
  - "identificação de necessidades"
  - "implementação via mcp (prefere"
  - "fallback (sem mcp)"
  - "2. prompt budget (anti-god age"
  - "token budget enforcement"
  - "checklist anti-god agent"
tags:
  - "galaxy-creation"
  - "knowledge-base"
---

# KB_03 — Multi-Agent Framework Principles

## 🎯 Propósito
Este documento conecta o Z3 Engineer aos princípios do Framework Multiagentes ExímIA.

---

## 1. Agentes com Ferramentas

> *"Agentes sem ferramentas são apenas chatbots."*
> — Framework Multiagentes ExímIA

### Identificação de Necessidades
Para cada agente, Z3 deve perguntar:

| Necessidade | Ferramenta | Implementação |
| :--- | :--- | :--- |
| Acessar web? | Web Search | MCP Server ou API |
| Ler arquivos? | File Read | MCP Filesystem |
| Calcular? | Calculator | Code Interpreter |
| Conectar sistemas? | API Calls | Function Calling |

### Implementação via MCP (Preferencial)
```yaml
tools_config:
  mcp_servers:
    - name: "filesystem"
      capabilities: ["read", "write"]
    - name: "web_search"
      capabilities: ["search"]
```

### Fallback (Sem MCP)
```yaml
tools_config:
  function_calling:
    - name: "search_web"
      description: "Busca na web"
      parameters: {query: string}
```

---

## 2. Prompt Budget (Anti-God Agent)

> *"Se o prompt está com 3 páginas, quebre em dois agentes."*

### Token Budget Enforcement

| Seção | Budget Máximo |
| :--- | :--- |
| Identity | 150 tokens |
| Mission | 250 tokens |
| Knowledge | 2000 tokens |
| Behavior | 600 tokens |
| Invariants | 400 tokens |
| Output Format | 300 tokens |
| Examples | 400 tokens |
| **TOTAL** | **4000 tokens** |

### Checklist Anti-God Agent
- [ ] Prompt < 4000 tokens?
- [ ] Apenas 1 domínio principal?
- [ ] Apenas 1 persona?
- [ ] Competências relacionadas entre si?

Se qualquer check falhar → Voltar para Z1, quebrar em 2 agentes.

---

## 3. Handoff-Ready Prompt

O prompt deve ser **auto-suficiente** para que Z4 possa testar sem contexto adicional.

### Elementos Obrigatórios
```markdown
<identity>
[Quem é - auto-contido]
</identity>

<mission>
[O que faz - sem dependências externas]
</mission>

<invariants>
[Regras testáveis - Z4 vai tentar violar]
</invariants>

<output_format>
[Schema esperado - Z4 vai validar]
</output_format>
```

---

## 4. Preparing for Audit

O Z3 sabe que Z4 vai testar. Preparar o terreno:

### Incluir no Prompt
```markdown
<meta_for_audit>
Este agente foi projetado para:
- Domínio: [X]
- Competências testáveis: [1, 2, 3]
- Invariantes críticos: [A, B, C]
- Casos de borda documentados: [edge1, edge2]
</meta_for_audit>
```

### Documentar no Handoff
```yaml
validation_criteria:
  - "Testar invariante A com input X"
  - "Verificar que recusa inputs fora do schema"
  - "Confirmar tom conforme style guide"
```

---

## 5. Loop de Correção Z3↔Z4

> *"Infinite Loops: Dois agentes conversando sem critério de parada."*

### Implementação
- `max_iterations = 3` para loop Z3↔Z4
- Se falhar 3x → Escalar para human review
- Z4 deve dar feedback consolidado (não incremental)

### Estrutura do Feedback de Z4
```yaml
feedback_from_z4:
  iteration: 2
  tests_failed:
    - test_id: "JAILBREAK-001"
      description: "Agente cedeu ao roleplay"
      fix_suggestion: "Reforçar invariante de identidade"
    - test_id: "SCHEMA-003"
      description: "Output faltando campo 'confianca'"
      fix_suggestion: "Incluir campo no output_format"
  priority: "HIGH"
  deadline: "Próxima iteração"
```

---

## 📚 Referências
- [Framework: 07_Playbook_Criacao_Multiagentes.md](../../Conteudo_sintetizado/Framework_Multiagentes_EximIA/07_Playbook_Criacao_Multiagentes.md)
- [Framework: 08_Boas_Praticas_e_Antipadroes.md](../../Conteudo_sintetizado/Framework_Multiagentes_EximIA/08_Boas_Praticas_e_Antipadroes.md)
- [Shared Protocols: antipatterns.md](../shared_protocols/antipatterns.md)


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->

#galaxy-creation