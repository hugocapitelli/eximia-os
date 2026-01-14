# Agent Classes — Z Squad Protocol

## 🎯 Propósito
Define o sistema de **3 classes de agentes** baseado no Athena.

> *"Cada classe tem seu lugar."*
> — Athena Analysis

---

## 1. Sistema de Classificação

```
┌─────────────────────────────────────────────────────────────────┐
│                   3 CLASSES DE AGENTES                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  CLASS 1: TACTICAL     CLASS 2: EXECUTIVE     CLASS 3: EXPERT   │
│  ⚡ Velocidade          ⚖️ Balanceamento       🎓 Profundidade   │
│                                                                  │
│  4-8h criação          6-12h criação          25-40h criação    │
│  3-5 KBs               5-8 KBs                12-20 KBs         │
│  ~3K palavras          ~8K palavras           ~50K palavras     │
│  5-10 frameworks       15-25 frameworks       50-100 frameworks │
│  Token: 4K             Token: 8K              Token: 12K+       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Classe 1: TACTICAL

### Quando Usar
- ✅ Domínio específico e restrito
- ✅ Usuários iniciantes
- ✅ Quick wins são prioridade
- ✅ Tempo de criação < 8h

### Especificações

| Aspecto | Valor |
| :--- | :--- |
| **Tempo de Criação** | 4-8 horas |
| **Knowledge Bases** | 3-5 arquivos |
| **Palavras Totais** | 2.000-5.000 |
| **Frameworks** | 5-10 aplicados |
| **Token Budget** | 4.000 tokens |
| **Exemplos Few-shot** | 2-3 |
| **Validation Cases** | 3-5 |

### Documentação Requerida
- [ ] `agente_core.md` (System Prompt)
- [ ] `README.md`
- [ ] 3-5 KBs práticos
- [ ] `input_schema.json`
- [ ] `output_schema.json`

### Exemplos
- Marketplace Seller
- Sales Ops Agent
- Customer Success Agent
- Social Media Manager

---

## 3. Classe 2: EXECUTIVE

### Quando Usar
- ✅ Decisões estratégicas C-level
- ✅ Balance entre velocidade e profundidade
- ✅ Usuários com conhecimento médio-alto
- ✅ Tempo de criação 6-12h

### Especificações

| Aspecto | Valor |
| :--- | :--- |
| **Tempo de Criação** | 6-12 horas |
| **Knowledge Bases** | 5-8 arquivos (segregados) |
| **Palavras Totais** | 5.000-15.000 |
| **Frameworks** | 15-25 catalogados |
| **Token Budget** | 8.000 tokens |
| **Exemplos Few-shot** | 4-6 |
| **Validation Cases** | 6-8 |

### Documentação Requerida
- [ ] `agente_core.md` (System Prompt)
- [ ] `README.md`
- [ ] 5-8 KBs segregados (TEORIA/ESTRATEGIA/INVARIANTES)
- [ ] `FRAMEWORK_INDEX.md`
- [ ] `input_schema.json`
- [ ] `output_schema.json`
- [ ] `validation_report.md`

### Exemplos
- CFO Agent
- CEO Agent
- COO Agent
- CTO Agent

---

## 4. Classe 3: EXPERT

### Quando Usar
- ✅ Domínio complexo e profundo
- ✅ Consultoria premium
- ✅ Profundidade crítica
- ✅ Rastreabilidade 100% obrigatória

### Especificações

| Aspecto | Valor |
| :--- | :--- |
| **Tempo de Criação** | 25-40 horas |
| **Knowledge Bases** | 12-20 arquivos densos |
| **Palavras Totais** | 30.000-60.000 |
| **Frameworks** | 50-100 indexados |
| **Token Budget** | 12.000-20.000 tokens |
| **Exemplos Few-shot** | 8-12 |
| **Validation Cases** | 12-15 |

### Documentação Requerida
- [ ] `agente_core.md` (System Prompt)
- [ ] `README.md`
- [ ] 12-20 KBs densos
- [ ] `META_ANALYSIS.md` (Domain Knowledge Map)
- [ ] `FRAMEWORK_INDEX.md`
- [ ] `BIBLIOGRAPHY_RESEARCH.md`
- [ ] `VOICE_PROFILE.md`
- [ ] `VALIDATION_CASES.yaml`
- [ ] `input_schema.json`
- [ ] `output_schema.json`
- [ ] `HANDOVER_DOCUMENT.md`

### Exemplos
- CMO Agent (Athena Full)
- Culture Translator
- Data Scientist Agent
- Legal Counsel Agent

---

## 5. Matriz de Decisão

| Pergunta | Class 1 | Class 2 | Class 3 |
| :--- | :---: | :---: | :---: |
| Tempo disponível < 8h? | ✅ | ❌ | ❌ |
| Usuários iniciantes? | ✅ | ⚠️ | ❌ |
| Quick wins são prioridade? | ✅ | ⚠️ | ❌ |
| C-level decisions? | ❌ | ✅ | ✅ |
| Rastreabilidade 100%? | ❌ | ⚠️ | ✅ |
| Consultoria premium? | ❌ | ⚠️ | ✅ |
| 50+ frameworks? | ❌ | ❌ | ✅ |

---

## 6. Uso em Z1 Architect

Ao iniciar o pipeline, Z1 deve perguntar:

```
## Agent Classification

Qual classe de agente você deseja criar?

1. **TACTICAL** (4-8h) — Domínio específico, quick wins, iniciantes
2. **EXECUTIVE** (6-12h) — C-level, balance, decisões estratégicas  
3. **EXPERT** (25-40h) — Profundidade máxima, consultoria premium

Escolha: [1/2/3]
```

A classe determina os requisitos mínimos para todos os módulos Z.

---

## 📚 Referências
- [Athena vs MS Analysis](../../outputs/Athena%20Vs%20MS.md)
- [Athena: GPT-CMO](../../outputs/x_agente_marketplace_seller/) (Class 3 example)
