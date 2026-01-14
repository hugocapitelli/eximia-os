# KB_12 — Análise Estatística para Pesquisadores

## Categoria: ESTRATÉGIA
## Palavras: ~2,500
## Atualizado: 2026-01-07
## Fonte: Web Research 2024 (NIH, ASA, Statology)

---

## 1. Interpretação de p-value (2024 Best Practices)

> *"P-values são medidas de evidência, não de verdade."*
> — American Statistical Association Statement (2016, reafirmado 2024)

### O que p-value É

| Definição Correta |
| :--- |
| Probabilidade de observar dados tão extremos quanto os coletados, **assumindo que H0 é verdadeira** |

### O que p-value NÃO É

| Definição ERRADA |
| :--- |
| ❌ Probabilidade de H0 ser verdadeira |
| ❌ Probabilidade do resultado ser "por acaso" |
| ❌ Medida de importância prática |
| ❌ Prova de que o efeito é real |

**Fonte:** NIH/ASA (2024)

### Interpretação Correta

| p-value | Interpretação |
| :---: | :--- |
| p < 0.001 | Evidência muito forte contra H0 |
| p < 0.01 | Evidência forte contra H0 |
| p < 0.05 | Evidência moderada contra H0 |
| p ≥ 0.05 | Evidência insuficiente para rejeitar H0 (NÃO prova H0) |

**IMPORTANTE:** p=0.049 e p=0.051 devem ser interpretados de forma similar. Não usar threshold arbitrário como decisão binária.

---

## 2. Effect Size (Tamanho do Efeito)

> *"Um p-value pequeno não significa um efeito grande."*

### Por que Importa

- p-value baixo + amostra grande → pode ser efeito trivial
- p-value alto + amostra pequena → pode ser efeito real não detectado

### Métricas Comuns

| Métrica | Uso | Interpretação |
| :--- | :--- | :--- |
| **Cohen's d** | Diferença de médias | 0.2 pequeno, 0.5 médio, 0.8 grande |
| **R²** | Correlação | 0.01 pequeno, 0.09 médio, 0.25 grande |
| **Odds Ratio** | Risco relativo | 1 = sem efeito |

---

## 3. Intervalo de Confiança (IC)

### Interpretação

```
IC 95% = [10, 20]

Significa: Se repetíssemos o estudo infinitas vezes,
95% dos ICs construídos conteriam o verdadeiro valor.
```

### Uso Prático

| Característica | Interpretação |
| :--- | :--- |
| IC estreito | Estimativa precisa |
| IC largo | Alta incerteza |
| IC inclui zero | Efeito pode ser nulo |
| IC não inclui zero | Efeito provavelmente existe |

**Sempre reportar IC junto com p-value.**

---

## 4. Correlação vs Causalidade

### A Falácia

```
CORRELAÇÃO: A e B variam juntos
         ≠
CAUSALIDADE: A causa B
```

### Possíveis Explicações para Correlação

| Cenário | Exemplo |
| :--- | :--- |
| **A causa B** | Fumo → Câncer |
| **B causa A** | Depressão → Uso de drogas (ou inverso?) |
| **C causa A e B** | Riqueza → Consumo de chocolate E Nobel |
| **Coincidência** | Taxa de divórcio ~ Consumo de margarina |

### Perguntas para Verificar

1. Há mecanismo causal plausível?
2. A temporalidade está correta (causa antes do efeito)?
3. Existe variável confundidora?
4. O efeito foi replicado em outros estudos?

---

## 5. Erros Comuns

### Base Rate Fallacy

**Problema:** Ignora a frequência base do evento

**Exemplo:**
- Teste de doença tem 99% de acurácia
- Doença afeta 1 em 10.000 pessoas
- Resultado positivo: qual a chance de TER a doença?

**Resposta:** Apenas ~1% (a maioria dos positivos são falsos positivos)

### Simpson's Paradox

**Problema:** Tendência em agregado desaparece em subgrupos

**Exemplo:**
- Tratamento A parece melhor no geral
- Mas Tratamento B é melhor para homens E mulheres separadamente
- Viés de seleção causou a inversão

### Survivor Bias

**Problema:** Só analisamos quem "sobreviveu"

**Exemplo:**
- "Unicórnios fizeram X" → mas 1000 startups fizeram X e falharam

---

## 6. Checklist de Validação Estatística

```yaml
statistical_validation:
  - Amostra representativa? (não só sobreviventes)
  - Tamanho de amostra adequado?
  - IC reportado junto com p-value?
  - Effect size é praticamente significante?
  - Correlação ≠ causalidade verificado?
  - Possíveis confounders considerados?
  - Resultado foi replicado?
```

---

## 7. Referências

- American Statistical Association. (2016, 2024). *Statement on p-values*.
- NIH. (2024). *Statistical Inference in Health Research*.
- Cohen, J. (1988). *Statistical Power Analysis for the Behavioral Sciences*.
- Kahneman, D., & Tversky, A. (1973). *Judgment under Uncertainty*.
