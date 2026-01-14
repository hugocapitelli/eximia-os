# KB_18 — Resolução de Contradições

## Categoria: INVARIANTES
## Palavras: ~2,500
## Atualizado: 2026-01-07

---

## 1. O Problema das Contradições

> *"Dois fatos não podem ser ambos verdadeiros se se contradizem diretamente."*

### Tipos de Contradição

| Tipo | Exemplo | Gravidade |
| :--- | :--- | :---: |
| **Direta** | A diz X, B diz não-X | ALTA |
| **Numérica** | A=100, B=150 | MÉDIA |
| **Temporal** | Dados de anos diferentes | MÉDIA |
| **Metodológica** | Métodos diferentes de cálculo | MÉDIA |
| **Aparente** | Parecem conflitar mas não | BAIXA |

---

## 2. Protocolo de Arbitragem

```
┌─────────────────────────────────────────────────────────────┐
│          PROTOCOLO DE RESOLUÇÃO DE CONTRADIÇÕES            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PASSO 1: DOCUMENTAR                                        │
│  ─────────────────────                                      │
│  Registrar exatamente o que cada fonte afirma               │
│                                                             │
│  PASSO 2: VERIFICAR TIER                                    │
│  ─────────────────────                                      │
│  Classificar cada fonte por autoridade (Tier 1-4)           │
│                                                             │
│  PASSO 3: VERIFICAR METODOLOGIA                             │
│  ─────────────────────────────                              │
│  Como cada fonte chegou ao dado?                            │
│                                                             │
│  PASSO 4: VERIFICAR TEMPORALIDADE                           │
│  ──────────────────────────────                             │
│  Datas dos dados são comparáveis?                           │
│                                                             │
│  PASSO 5: VERIFICAR DEFINIÇÕES                              │
│  ────────────────────────────                               │
│  Estão medindo a mesma coisa?                               │
│                                                             │
│  PASSO 6: ARBITRAR OU ESCALAR                               │
│  ────────────────────────────                               │
│  Resolver internamente ou apresentar ao usuário             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Regras de Arbitragem

### Hierarquia de Fontes

```
Se Tier 1 vs Tier 1 → ESCALAR (apresentar ambos)
Se Tier 1 vs Tier 2 → Preferir Tier 1
Se Tier 1 vs Tier 3 → Preferir Tier 1
Se Tier 2 vs Tier 3 → Preferir Tier 2
Se fonte recente vs antiga → Preferir recente (se tema dinâmico)
```

### Quando ESCALAR ao Usuário

| Situação | Ação |
| :--- | :--- |
| Duas fontes Tier 1 conflitam | Apresentar ambas com análise |
| Diferença >10% em dado crítico | Destacar a divergência |
| Metodologias incompatíveis | Explicar a diferença |
| Não há forma de resolver | Declarar incerteza |

---

## 4. Template de Apresentação

### Formato para Contradições

```markdown
## ⚠️ CONTRADIÇÃO DETECTADA

### Afirmações Conflitantes

| Fonte | Afirmação | Tier | Data | Metodologia |
|-------|-----------|------|------|-------------|
| Fonte A | X | 1 | 2024 | Survey |
| Fonte B | Y | 1 | 2024 | Modelo |

### Análise

[Explicar diferenças metodológicas, temporais, de escopo]

### Possíveis Explicações

1. [Razão 1 para divergência]
2. [Razão 2]

### Recomendação

[Qual dado usar ou apresentar range]

### Confidence

[Score e justificativa]
```

---

## 5. Exemplo Prático

### Cenário: Produção de Soja Brasil 2024

```markdown
## ⚠️ CONTRADIÇÃO DETECTADA

### Afirmações Conflitantes

| Fonte | Produção | Tier | Data | Metodologia |
|-------|----------|------|------|-------------|
| Conab | 155.3 Mt | 1 | Fev/24 | Survey produtores + satélite |
| USDA | 156.0 Mt | 1 | Mar/24 | Modelo + attaché reports |
| Broker XYZ | 170.0 Mt | 3 | Mar/24 | Estimativa interna |

### Análise

- **Conab vs USDA:** Diferença de 0.7 Mt (0.5%) está dentro da margem 
  histórica de variação entre as duas fontes.
- **Broker XYZ:** Estimativa 9.7% acima da média oficial. Sem metodologia 
  transparente publicada. Possível viés comercial (clientes comprados em soja).

### Possíveis Explicações

1. USDA incorpora dados mais recentes (março vs fevereiro)
2. Diferenças metodológicas (survey vs modelo)
3. Broker pode ter acesso a dados de campo não públicos (não verificável)

### Recomendação

Usar **range 155-156 Mt** baseado em Conab e USDA.
**Descartar** estimativa Broker XYZ por falta de transparência metodológica.

### Confidence

**75%** — Duas fontes Tier 1 convergem, uma Tier 3 descartada.
```

---

## 6. Diferenças que NÃO São Contradições

| Situação | Como Tratar |
| :--- | :--- |
| **Diferentes períodos** | Esclarecer datas, não é contradição |
| **Diferentes definições** | Explicar a diferença conceitual |
| **Diferentes geografias** | Especificar escopo de cada |
| **Margens de erro** | Se dentro da margem, não é contradição |

---

## 7. Circuit Breaker

### Quando PARAR e Escalar

```yaml
escalation_triggers:
  - condition: "Duas fontes Tier 1 com >5% divergência"
    action: "Apresentar ambas, não escolher"
    
  - condition: "Nenhuma fonte confiável disponível"
    action: "Declarar 'dado não verificável'"
    
  - condition: "Conflito afeta recomendação crítica"
    action: "Destacar incerteza no output"
    
  - condition: "Metodologias incompatíveis"
    action: "Explicar as diferenças, não arbitrar"
```

---

## 8. Referências

- Heuer, R. J. (1999). *Psychology of Intelligence Analysis*. CIA.
- CIA. (2009). *A Tradecraft Primer: Structured Analytic Techniques*.
- Tetlock, P. (2015). *Superforecasting*.
