# KB_01 — Monitoring Metrics

## 🎯 Propósito
Este documento define as métricas de monitoramento usadas pelo Z5 Evolver para avaliar a saúde dos agentes em produção.

---

## 1. Métricas Core (Obrigatórias)

### 1.1 Error Rate
**O que mede:** % de execuções que resultam em erro.

| Threshold | Status | Ação |
| :--- | :--- | :--- |
| < 2% | 🟢 Saudável | Nenhuma |
| 2-5% | 🟡 Atenção | Investigar |
| > 5% | 🔴 Crítico | Evolution Ticket |

**Fórmula:**
```
error_rate = (erros / total_execucoes) * 100
```

---

### 1.2 User Satisfaction (NPS/Rating)
**O que mede:** Satisfação do usuário com as respostas.

| Threshold | Status | Ação |
| :--- | :--- | :--- |
| > 4.5/5 | 🟢 Excelente | Nenhuma |
| 4.0-4.5 | 🟡 Bom | Monitorar |
| < 4.0 | 🔴 Problema | Evolution Ticket |

---

### 1.3 Hallucination Rate
**O que mede:** % de respostas com informações inventadas.

| Threshold | Status | Ação |
| :--- | :--- | :--- |
| 0% | 🟢 Perfeito | Nenhuma |
| 1-3% | 🟡 Aceitável | Monitorar |
| > 3% | 🔴 Crítico | Evolution Ticket Urgente |

**Detecção:**
- Amostragem manual de respostas
- Cross-check com fontes conhecidas
- Flags de usuários

---

### 1.4 Schema Compliance Rate
**O que mede:** % de outputs que passam na validação de schema.

| Threshold | Status | Ação |
| :--- | :--- | :--- |
| 100% | 🟢 Perfeito | Nenhuma |
| 95-99% | 🟡 Aceitável | Investigar edge cases |
| < 95% | 🔴 Problema | Evolution Ticket |

---

### 1.5 Response Time (P95)
**O que mede:** Tempo de resposta no percentil 95.

| Threshold | Status | Ação |
| :--- | :--- | :--- |
| < 10s | 🟢 Rápido | Nenhuma |
| 10-30s | 🟡 Aceitável | Otimizar se possível |
| > 30s | 🔴 Lento | Investigar, otimizar prompt |

---

## 2. Métricas de Uso (Contextuais)

### 2.1 Daily Active Users (DAU)
Quantos usuários únicos usam o agente por dia.

### 2.2 Executions per Day
Total de execuções diárias.

### 2.3 Retention Rate
% de usuários que voltam a usar o agente.

### 2.4 Feature Adoption
Quais funcionalidades são mais usadas.

---

## 3. Métricas de Qualidade (Amostragem)

### 3.1 DNA Alignment Score
Verificação manual se respostas seguem DNA Mental.

| Score | Significado |
| :--- | :--- |
| 5/5 | Perfeitamente alinhado |
| 4/5 | Pequenos desvios |
| 3/5 | Desvios notáveis |
| < 3 | Misaligned |

### 3.2 Completeness Score
Respostas cobrem todos os pontos esperados.

### 3.3 Accuracy Score
Informações factuais estão corretas.

---

## 4. Dashboard Template

```markdown
# Monitoring Dashboard — [AGENTE] v[X.Y.Z]

**Período:** [Data início] - [Data fim]
**Total Execuções:** [N]

## Métricas Core

| Métrica | Valor | Threshold | Status |
| :--- | :--- | :--- | :--- |
| Error Rate | [X%] | < 5% | 🟢/🟡/🔴 |
| User Satisfaction | [X.X/5] | > 4.0 | 🟢/🟡/🔴 |
| Hallucination Rate | [X%] | < 3% | 🟢/🟡/🔴 |
| Schema Compliance | [X%] | > 95% | 🟢/🟡/🔴 |
| Response Time (P95) | [Xs] | < 30s | 🟢/🟡/🔴 |

## Tendência

[Gráfico de tendência das métricas ao longo do período]

## Alertas Ativos

| Alerta | Desde | Descrição |
| :--- | :--- | :--- |
| [Tipo] | [Data] | [Descrição] |

## Ações Recomendadas

1. [Ação 1]
2. [Ação 2]
```

---

## 5. Alerting Rules

```yaml
alertas:
  - id: ALERT-001
    metrica: error_rate
    condicao: "> 5%"
    janela: "24 horas"
    acao: "Criar Evolution Ticket automaticamente"

  - id: ALERT-002
    metrica: hallucination_rate
    condicao: "> 3%"
    janela: "7 dias"
    acao: "Notificar CEO + Criar Ticket Urgente"

  - id: ALERT-003
    metrica: user_satisfaction
    condicao: "< 4.0"
    janela: "7 dias"
    acao: "Criar Evolution Ticket"
```

---

## 📚 Referências
- [Google SRE Book](https://sre.google/sre-book/)
- [Datadog: Application Monitoring](https://www.datadoghq.com/)


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->