# ReAct Pattern — Z Squad Protocol

## 🎯 Propósito
Este documento define o padrão **ReAct (Reason-Act-Observe)** que todos os módulos do Z Squad devem seguir para melhorar a qualidade de decisões e permitir auto-correção.

---

## 1. O Que é ReAct?

ReAct é um framework cognitivo que estrutura o comportamento de agentes em três fases iterativas:

```
┌─────────────────────────────────────────────┐
│                  ReAct Loop                  │
│                                             │
│    ┌──────────┐    ┌──────┐    ┌─────────┐ │
│    │  REASON  │ -> │  ACT │ -> │ OBSERVE │ │
│    └──────────┘    └──────┘    └─────────┘ │
│         ^                            │      │
│         └────────────────────────────┘      │
│              (se incompleto)                │
└─────────────────────────────────────────────┘
```

---

## 2. As 3 Fases

### REASON (Raciocinar)
*"O que eu sei? O que preciso descobrir?"*

- Analisar o input recebido
- Identificar gaps de informação
- Formular hipóteses
- Decidir próxima ação

**Output:** Pensamento estruturado (interno ou explícito)

### ACT (Agir)
*"Qual ação devo executar agora?"*

- Executar ferramenta
- Escrever artefato
- Consultar recurso
- Fazer pergunta

**Output:** Resultado da ação

### OBSERVE (Observar)
*"O resultado está bom? Preciso iterar?"*

- Avaliar resultado da ação
- Verificar se objetivo foi atingido
- Identificar se precisa de mais iterações
- Decidir: concluir ou voltar a REASON

**Output:** Decisão de continuar ou parar

---

## 3. Implementação por Módulo

### Z1 Architect
```yaml
react_loop:
  max_iterations: 3
  
  reason:
    - "Qual é o pedido real do usuário?"
    - "Tenho clareza sobre o domínio?"
    - "Preciso fazer perguntas clarificadoras?"
    
  act:
    - Fazer perguntas ao usuário (se necessário)
    - Consultar frameworks de decomposição
    - Escrever spec_tecnica.json
    
  observe:
    - "A spec está completa?"
    - "Todos os campos obrigatórios estão preenchidos?"
    - "O escopo está claro (in/out)?"
```

### Z2 Profiler
```yaml
react_loop:
  max_iterations: 3
  
  reason:
    - "Quais clones são relevantes para este domínio?"
    - "Tenho informação suficiente sobre os frameworks?"
    - "O DNA Mental está coerente?"
    
  act:
    - Consultar clone_registry.yaml
    - Extrair frameworks dos clones
    - Escrever dna_mental.md
    
  observe:
    - "O perfil é consistente (sem contradições)?"
    - "Todos os princípios são testáveis?"
    - "O style guide é concreto?"
```

### Z3 Engineer
```yaml
react_loop:
  max_iterations: 3
  
  reason:
    - "O prompt está abaixo de 4000 tokens?"
    - "Todas as seções obrigatórias estão presentes?"
    - "Os invariantes são claros?"
    
  act:
    - Compor seções do prompt
    - Validar contra schema
    - Gerar exemplos few-shot
    
  observe:
    - "O prompt segue o template?"
    - "Os schemas são JSON válidos?"
    - "Há exemplos suficientes?"
```

### Z4 Auditor
```yaml
react_loop:
  max_iterations: 5  # Mais iterações para testes
  
  reason:
    - "Quais categorias de teste ainda faltam?"
    - "Algum teste falhou? Por quê?"
    - "O agente está alinhado com o DNA?"
    
  act:
    - Executar batch de testes
    - Simular cenários adversariais
    - Gerar relatório
    
  observe:
    - "Taxa de sucesso está aceitável?"
    - "Há padrões nas falhas?"
    - "Posso aprovar ou preciso rejeitar?"
```

---

## 4. Template de Raciocínio

Cada módulo deve explicitar seu raciocínio:

```markdown
## 🧠 ReAct Trace

### Iteration 1
**REASON:** Preciso entender o domínio do agente. A spec menciona "M&A" mas não detalha sub-áreas.

**ACT:** Consultar KB_02_competency_mapping para listar competências típicas de M&A.

**OBSERVE:** Encontrei 5 competências: DCF, Comps, Due Diligence, Synergy Analysis, Integration Planning. A spec só menciona 2. Preciso verificar se o escopo é intencional.

### Iteration 2
**REASON:** O usuário não especificou todas as competências. Devo assumir escopo mínimo ou expandir?

**ACT:** Seguir constraint "não inventar competências não solicitadas". Manter apenas DCF e Comps.

**OBSERVE:** Decisão tomada. Spec está pronta com escopo mínimo. Documentar no handoff que expansão futura é possível.

### Conclusion
Spec completa após 2 iterações. Passando para Z2.
```

---

## 5. Regras de Parada

Para evitar loops infinitos:

| Condição | Ação |
| :--- | :--- |
| `iteration >= max_iterations` | Parar e reportar status atual |
| `objetivo_atingido == True` | Parar com sucesso |
| `blocker_encontrado == True` | Parar e escalar para humano |
| `nenhum_progresso == True` | Parar após 2 iterações sem progresso |

---

## 📚 Referências
- [Google: ReAct Paper](https://arxiv.org/abs/2210.03629)
- [Microsoft: Agentic Design Patterns](https://microsoft.com/)
- [Anthropic: Building Agents](https://anthropic.com/)
