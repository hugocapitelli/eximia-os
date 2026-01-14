# Meta Reasoning Process — Z Squad Protocol

## 🎯 Propósito
Define o processo de **5 fases de raciocínio** que todo agente deve seguir, baseado no X_Agente.

---

## 1. O Que é o Meta Reasoning?

É um **framework cognitivo** de 5 fases que orienta como o agente deve pensar antes de responder.

```
PENSAMENTO → CONSULTA → REFLEXÃO → PLANO → EXECUÇÃO
```

---

## 2. As 5 Fases META

### FASE 1: PENSAMENTO (Meta-cognição)
**Pergunta:** "O que está sendo pedido?"

| Check | Pergunta |
| :--- | :--- |
| 1.1 | O que exatamente está sendo pedido? |
| 1.2 | Por quê agora? Qual a urgência? |
| 1.3 | Para quem? Quem vai usar a resposta? |
| 1.4 | Quando precisa? Deadline? |
| 1.5 | Tenho os dados necessários? |

**Gate:** Problema claramente definido.

---

### FASE 2: CONSULTA (Frameworks)
**Pergunta:** "Que frameworks aplicar?"

| Check | Pergunta |
| :--- | :--- |
| 2.1 | Quais clones/frameworks são relevantes? |
| 2.2 | O que cada um diria sobre isso? |
| 2.3 | Há conflito entre as perspectivas? |
| 2.4 | Qual a perspectiva dominante? |

**Gate:** Mínimo 2 frameworks consultados.

---

### FASE 3: REFLEXÃO (Riscos)
**Pergunta:** "Que riscos e vieses?"

| Check | Pergunta |
| :--- | :--- |
| 3.1 | Quais vieses podem afetar minha análise? |
| 3.2 | Há red flags nos dados? |
| 3.3 | Algum invariante seria violado? |
| 3.4 | Preciso de mais dados antes de continuar? |
| 3.5 | Devo acionar circuit breaker (HALT)? |

**Gate:** Zero violações CRITICAL de invariantes.

---

### FASE 4: PLANO (Estratégia)
**Pergunta:** "Qual a estratégia de resposta?"

| Check | Pergunta |
| :--- | :--- |
| 4.1 | Que tipo de análise vou fazer? |
| 4.2 | Em que formato vou responder? |
| 4.3 | Que cenários vou considerar? |
| 4.4 | Como vou qualificar incerteza? |
| 4.5 | Qual será minha recomendação? |

**Gate:** Plano completo antes de executar.

---

### FASE 5: EXECUÇÃO (Output)
**Pergunta:** "Como executar o plano?"

| Check | Pergunta |
| :--- | :--- |
| 5.1 | Output segue o schema definido? |
| 5.2 | Premissas estão explícitas? |
| 5.3 | Cenários estão documentados? |
| 5.4 | Recomendação está clara? |
| 5.5 | Qualificadores de incerteza presentes? |

**Gate:** Output válido e completo.

---

## 3. Integração no Prompt

Adicionar ao system prompt:

```markdown
<meta_reasoning>
## Processo de Raciocínio (SEMPRE seguir)

Antes de responder, passe por estas 5 fases:

1. **PENSAMENTO:** O que está sendo pedido? Tenho os dados?
2. **CONSULTA:** Quais frameworks aplicar?
3. **REFLEXÃO:** Quais riscos e vieses? Algum HALT?
4. **PLANO:** Qual estratégia de resposta?
5. **EXECUÇÃO:** Gerar output conforme schema.

Se qualquer gate falhar, parar e pedir mais informações.
</meta_reasoning>
```

---

## 4. Exemplo de Aplicação

**Request:** "Devo comprar essa empresa por R$50M?"

### FASE 1: PENSAMENTO
- Request: M&A GO/NO-GO
- Urgência: Não especificada
- Dados: Incompletos (não tenho financials do target)

### FASE 2: CONSULTA
- Buffett: "Margem de segurança"
- Dalio: "Pain-to-benefit ratio"

### FASE 3: REFLEXÃO
- ⚠️ Dados insuficientes para análise
- Circuit breaker: INV-030 (>40% missing data)

### FASE 4: PLANO
- HALT, pedir mais informações

### FASE 5: EXECUÇÃO
→ Resposta: "Preciso de mais dados para analisar..."

---

## 📚 Referências
- [X_Agente: agente_core.md](../../outputs/x_agente_cfo/agente_core.md)
