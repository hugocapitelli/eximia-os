# KB_01 — Prompt Structure Patterns

## 🎯 Propósito
Este documento contém os padrões de estruturação de prompts usados pelo Z3 Engineer.

---

## 1. Anatomia de um System Prompt Elite

Um System Prompt de qualidade contém **6 seções obrigatórias**:

```
┌─────────────────────────────────────────┐
│ 1. IDENTITY (Quem é o agente)           │
├─────────────────────────────────────────┤
│ 2. MISSION (O que ele faz)              │
├─────────────────────────────────────────┤
│ 3. KNOWLEDGE (O que ele sabe)           │
├─────────────────────────────────────────┤
│ 4. BEHAVIOR (Como ele age)              │
├─────────────────────────────────────────┤
│ 5. INVARIANTS (O que ele NUNCA faz)     │
├─────────────────────────────────────────┤
│ 6. OUTPUT FORMAT (Como ele responde)    │
└─────────────────────────────────────────┘
```

---

## 2. Formatos de Estruturação

### 2.1 XML Tags (Recomendado)
**Vantagens:** Parsing preciso, separação clara.

```xml
<identity>
Você é o CFO Agent, especialista em análise financeira corporativa.
</identity>

<mission>
Sua missão é fornecer análises de M&A rigorosas e conservadoras.
</mission>

<knowledge>
<framework name="DCF">
O Discounted Cash Flow calcula o valor presente dos fluxos de caixa futuros...
</framework>
</knowledge>

<rules>
- Sempre usar range de valuation, nunca ponto único
- Ser conservador em cenários de incerteza
</rules>

<output_format>
Responda sempre em formato estruturado com:
1. Executive Summary
2. Análise Detalhada
3. Recomendação (GO/NO-GO)
</output_format>
```

### 2.2 Markdown (Alternativa)
**Vantagens:** Mais legível para humanos.

```markdown
# IDENTIDADE
Você é o CFO Agent...

## MISSÃO
Sua missão é...

## CONHECIMENTO
### DCF
O Discounted Cash Flow...

## REGRAS
- Regra 1
- Regra 2

## FORMATO DE OUTPUT
...
```

### 2.3 Híbrido (Best Practice)
Usar **Markdown para estrutura macro** e **XML para dados injetados**.

---

## 3. Padrões de Injeção de Conhecimento

### 3.1 Full Injection
Injetar todo o conhecimento no prompt.
*   **Prós:** Agente tem tudo que precisa.
*   **Contras:** Consome muitos tokens.

### 3.2 Summary Injection
Injetar apenas resumos, referenciar KB externo.
*   **Prós:** Prompt leve.
*   **Contras:** Agente pode perder contexto.

### 3.3 Retrieval-Augmented (RAG)
Buscar conhecimento dinamicamente.
*   **Prós:** Escala infinitamente.
*   **Contras:** Latência, complexidade.

**Recomendação Z Squad:** Usar **Summary Injection** para MVP, evoluir para RAG posteriormente.

---

## 4. Padrões de Comportamento

### 4.1 Chain-of-Thought (CoT)
Forçar o agente a "pensar em voz alta" antes de responder.

```
Antes de responder, pense passo a passo:
1. Qual é a pergunta real?
2. Que informações eu tenho?
3. Que frameworks aplicam?
4. Qual é a resposta?
```

### 4.2 Self-Critique
Pedir para o agente revisar sua própria resposta.

```
Após gerar a resposta, revise:
- A resposta está alinhada com meus princípios?
- Há inconsistências?
- O formato está correto?
```

### 4.3 Guardrails Explícitos
Regras inquebráveis em formato IF/THEN.

```
<invariants>
- SE a pergunta for sobre tax planning, ENTÃO responda: "Fora do meu escopo."
- SE o fit score < 35, ENTÃO recomende NO-GO automaticamente.
- SE não houver dados suficientes, ENTÃO diga "Dados insuficientes".
</invariants>
```

---

## 5. Padrões Anti-Alucinação

| Técnica | Descrição | Exemplo |
| :--- | :--- | :--- |
| **Explicit Uncertainty** | Forçar declaração de incerteza | "Se não souber, diga 'Não sei'" |
| **Source Citation** | Exigir referências | "Cite a fonte de cada afirmação" |
| **Confidence Score** | Pedir nível de confiança | "Indique confiança: Alta/Média/Baixa" |
| **Refusal Pattern** | Ensinar a recusar | "Se for fora do escopo, recuse educadamente" |

---

## 6. Token Budget Guidelines

| Seção | Budget Recomendado |
| :--- | :--- |
| Identity | ~100 tokens |
| Mission | ~200 tokens |
| Knowledge | ~1500 tokens |
| Behavior | ~500 tokens |
| Invariants | ~300 tokens |
| Output Format | ~200 tokens |
| **TOTAL** | **~2800 tokens** (margem de segurança) |

---

## 📚 Referências
- [OpenAI: Prompt Engineering Guide](https://platform.openai.com/docs/)
- [Anthropic: Constitutional AI](https://www.anthropic.com/)
- [The_Recruiter: PROMPT_OPERACIONAL.md](../../The_Recruiter/PROMPT_OPERACIONAL.md)
