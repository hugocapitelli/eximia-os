# KB_04: V2MOM Framework (Salesforce Model)

## 📖 Origem
Criado por Marc Benioff, fundador da Salesforce, nos anos 2000. É o framework estratégico interno usado até hoje para alinhar desde o CEO até ICs (Individual Contributors).

## 🎯 Estrutura Core: Os 5 Componentes

**V2MOM** = Vision + Values + Methods + Obstacles + Measures

```
┌─────────────────────────────────────────────┐
│ 1. VISION      → Onde queremos chegar?     │
├─────────────────────────────────────────────┤
│ 2. VALUES      → O que é importante?        │
├─────────────────────────────────────────────┤
│ 3. METHODS     → Como vamos fazer?          │
├─────────────────────────────────────────────┤
│ 4. OBSTACLES   → O que pode nos impedir?    │
├─────────────────────────────────────────────┤
│ 5. MEASURES    → Como sabemos se deu certo? │
└─────────────────────────────────────────────┘
```

**Filosofia Central:** Transparência radical. Todo V2MOM é compartilhado internamente (CEO, VPs, Managers, ICs).

## 📊 Detalhamento dos 5 Componentes

### 1️⃣ VISION (O Que Queremos Alcançar?)

**Regras:**
- **Específico, não genérico:** "Tornar-se líder" é vago. "Alcançar 30% market share no segmento X até Dez/2026" é claro.
- **Inspirador mas atingível:** Stretch goal, não wishful thinking.
- **Único:** Uma Vision por V2MOM (não uma lista de 5 visões).

**Exemplo Forte:**
> "Duplicar a base de clientes Enterprise (de 50 para 100) mantendo NPS acima de 60 e alcançando $20M ARR até Dezembro de 2026."

**Exemplo Fraco:**
> "Crescer e melhorar nossos produtos." ❌ (Vago, sem números, sem prazo)

---

### 2️⃣ VALUES (O Que É Importante?)

**Não são valores corporativos genéricos** (Integridade, Respeito...). São **princípios operacionais** que guiam decisões.

**Regras:**
- **3-5 Values:** Não mais.
- **Priorizados:** A ordem importa (1º = mais importante).
- **Decisão-drivers:** Quando houver trade-off, os Values mostram o caminho.

**Exemplo:**
```markdown
### Values (Em ordem de prioridade)
1. **Customer Obsession:** Nenhuma feature é lançada sem validar com 5 clientes.
2. **Velocity over Perfection:** Iteração rápida > planejamento longo. Ship weekly.
3. **Data-Informed Decisions:** Toda decisão > $10k precisa de data backing.
4. **Radical Transparency:** Resultados (positivos ou negativos) são compartilhados com todos.
```

**Anti-Exemplo:**
```markdown
1. Excelência ❌ (Genérico demais)
2. Inovação ❌ (Todo mundo fala isso)
```

---

### 3️⃣ METHODS (Como Vamos Executar?)

São as **ações concretas** para alcançar a Vision. Pense em "Initiatives" ou "Projects".

**Regras:**
- **Specific & Actionable:** Verbo + Objeto + Deadline.
- **5-10 Methods:** Mais que isso = dilui foco.
- **Priorizados:** Use números (1, 2, 3...) para indicar sequência.

**Exemplo:**
```markdown
### Methods
1. **Contratar SDR Team especializado em outbound Enterprise** (até Mar/2026)
   - Recruiter dedicated para essa posição
   - Job description aprovado até 15/Jan
   - 5 SDRs onboarded até final de Q1

2. **Lançar Product Tier "Enterprise Edition"** (até Jun/2026)
   - Feature scoping finalizado (Jan)
   - Beta com 5 clientes piloto (Abr-Mai)
   - GA em Jun/2026

3. **Implementar Quarterly Business Reviews (QBRs) com top 20 clientes** (a partir de Abr/2026)
   - Template de QBR padronizado
   - CS Team treinado
   - 1 QBR/mês rodando até final de Q2
```

---

### 4️⃣ OBSTACLES (O Que Pode Nos Impedir?)

**Esta é a seção mais subestimada do V2MOM.** A maioria pula ou coloca obstáculos genéricos.

**Regras:**
- **Honestidade brutal:** Liste os riscos reais (financeiros, técnicos, humanos).
- **Específico:** Não "falta de recursos" (genérico), mas "deficit de $200k no budget de Sales Hiring" (específico).
- **Mitigáveis:** Para cada obstacle, indique a estratégia de mitigação.

**Exemplo:**
```markdown
### Obstacles
1. **Budget Constraint: Deficit de $200k para Sales Hiring Plan**
   - *Mitigação:* Apresentar business case ao Board em Jan. Alternativa: contratar 3 SDRs ao invés de 5 (reduz target de Pipeline).

2. **Product Roadmap prioritiza SMB features ao invés de Enterprise**
   - *Mitigação:* Alinhar com CPO para reservar 40% da capacity de Eng para Enterprise features em Q1-Q2.

3. **CS Team overloaded (cada CSM gerencia 40 contas em média)**
   - *Mitigação:* Contratar 2 CSMs adicionais até Abr/2026 OU reclassificar contas <$5k ARR para CS automatizado.

4. **Competidor X lançou feature similar (vantagem de first-mover perdida)**
   - *Mitigação:* Pivotar messaging para "melhor suporte" ao invés de "único no mercado".
```

**Anti-Exemplo:**
```markdown
1. Falta de recursos ❌ (Vago)
2. Mercado competitivo ❌ (Não é acionável)
```

---

### 5️⃣ MEASURES (Como Medimos Sucesso?)

Aqui entram os **KPIs quantitativos**. Devem ser SMART (Specific, Measurable, Achievable, Relevant, Time-bound).

**Regras:**
- **5-8 Measures:** Cada um mede um aspecto da Vision.
- **Leading + Lagging:** Mistura de input e output metrics.
- **Clear Targets:** Não "aumentar receita", mas "ARR de $10M para $20M até Dez/2026".

**Exemplo:**
```markdown
### Measures
1. **ARR total:** $10M → $20M (até Dez/2026)
   - Tracking: Monthly
   - Leading: Pipeline Enterprise > $5M (quarterly check)

2. **Cliente Enterprise (ARR > $50k):** 50 → 100 clientes
   - Tracking: Monthly
   - Leading: Trials Enterprise > 20/quarter

3. **NPS (Enterprise segment):** 45 → 60
   - Tracking: Quarterly
   - Leading: QBR realization rate > 80%

4. **Sales Cycle (Enterprise):** 90 dias → 60 dias
   - Tracking: Monthly
   - Leading: % de deals com POC (target: <30% precisam de POC)

5. **Expansion MRR (upsell/cross-sell):** $20k/mês → $60k/mês
   - Tracking: Monthly
   - Leading: Feature adoption rate > 70%
```

## 🔄 Como V2MOM Cascateia (Alignment)

**Company V2MOM** (CEO)  
   ↓  
**Departamento V2MOM** (VP Sales, VP Product, etc.)  
   ↓  
**Team V2MOM** (Manager de SDR Team)  
   ↓  
**Individual V2MOM** (Cada SDR tem seu V2MOM pessoal)

**Regra de Alinhamento:**
- A Vision do nível N deve **contribuir** para os Methods do nível N-1.
- Transparency: Qualquer pessoa pode ver o V2MOM de qualquer outro (incluindo o CEO).

**Exemplo de Cascateamento:**

```markdown
## CEO V2MOM (Company-level)
**Vision:** Alcançar $50M ARR até 2027.

**Methods:**
- Method 1: Expandir Enterprise Sales (target: $20M ARR Enterprise até 2026)
---

## VP Sales V2MOM (Department-level)
**Vision:** Contribuir com $20M ARR Enterprise até Dez/2026.

**Methods:**
- Method 1: Contratar e onboard 15 Enterprise AEs
---

## Sales Manager V2MOM (Team-level)
**Vision:** Onboarding de 5 Enterprise AEs com ramp-time < 60 dias.

**Methods:**
- Method 1: Criar Sales Playbook Enterprise até Mar/2026
- Method 2: Rodar shadow sessions com top performer (2 weeks por AE)
```

## 🧠 Regras de Ouro V2MOM

### 1. Todos Escrevem, Todos Compartilham
Na Salesforce, **todo mundo** (do CEO ao estagiário) tem seu V2MOM. Não é exclusivo de C-Level.

### 2. Reviews Trimestrais Obrigatórios
V2MOM não é "write once". A cada quarter:
- **Check:** Measures atualizados (estamos on-track?)
- **Adjust:** Se Obstacles mudaram, atualize. Se Methods não funcionam, pivote.

### 3. Transparency is Accountability
Como todos veem o V2MOM de todos, há peer pressure positivo para entregar.

## 🚫 Anti-Patterns (Erros Comuns)

### ❌ V2MOM Genérico
**Problema:**
```markdown
Vision: Ser a melhor empresa do mercado.
Values: Excelência, Inovação, Respeito.
```
**Solução:** Seja brutal em especificidade. Números, datas, nomes.

### ❌ Obstacles Diplomáticos
**Problema:** "Possível falta de alinhamento entre áreas" (eufemismo).  
**Solução:** "Product Team priorizou Roadmap SMB, mas precisamos de 40% em Enterprise features. Sem isso, a Vision falha."

### ❌ V2MOM na Gaveta
**Problema:** Escrever e nunca mais olhar.  
**Solução:** Quarterly reviews + cada 1:1 do manager com report deve revisar o V2MOM individual.

## 🛠️ Template Completo: V2MOM Anual

```markdown
# V2MOM 2026 — [Nome / Empresa]

---

## 🎯 VISION
Alcançar **$20M ARR** até Dezembro de 2026, com **100 clientes Enterprise** (ARR > $50k) e **NPS sustentado acima de 60**.

---

## 💎 VALUES (Em ordem de prioridade)

1. **Customer Obsession**  
   → Nenhuma decisão de produto ou sales é tomada sem consultar 5+ clientes.

2. **Velocity over Perfection**  
   → Prefiro 80% pronto hoje que 100% perfeito em 3 meses. Iteração > planejamento.

3. **Data-Informed, Not Data-Driven**  
   → Dados informam, mas não paralisam. Se há 70% de confiança, execute.

4. **Radical Transparency**  
   → Resultados (wins e losses) são compartilhados semanalmente com todos.

5. **Ownership Mindset**  
   → Cada pessoa é dono do próprio V2MOM e accountable pelos Measures.

---

## 🛠️ METHODS (Prioridade numérica)

1. **Contratar e onboard SDR Team especializado em Enterprise outbound**  
   - Recruiter dedicado (contratado até 15/Jan)  
   - 5 SDRs onboarded até Mar/2026  
   - Playbook Enterprise finalizado até Feb/2026

2. **Lançar Product Tier "Enterprise Edition"**  
   - Scoping finalizado (Jan/2026)  
   - Beta com 5 clientes piloto (Abr-Mai/2026)  
   - GA em Jun/2026

3. **Implementar QBRs (Quarterly Business Reviews) com top 20 clientes**  
   - Template de QBR padronizado (Mar/2026)  
   - CS Team treinado (Abr/2026)  
   - 1 QBR rodando por mês a partir de Abr/2026

4. **Construir Case Studies com 3 logos reconhecidos**  
   - Identificar candidatos (Jan/2026)  
   - Produção (video + written) até Jun/2026  
   - Publishing em site e sales collateral

5. **Reduzir Sales Cycle de 90d para 60d**  
   - Implementar POC standardizado (evitar custom POCs)  
   - Battle Cards para top 3 competidores  
   - Sales Automation (CRM + Outreach integrados)

---

## 🚧 OBSTACLES (E Estratégias de Mitigação)

### 1. **Budget Deficit: Faltam $200k para Sales Hiring Plan completo**
**Impacto:** Só conseguimos contratar 3 SDRs ao invés de 5.  
**Mitigação:**  
- Business case apresentado ao Board em Jan/2026  
- Alternativa: contratar 3 SDRs agora, mais 2 em Q2 se performance validar

### 2. **Product Roadmap prioriza SMB features ao invés de Enterprise**
**Impacto:** Enterprise Edition atrasa de Jun para Set/2026.  
**Mitigação:**  
- Meeting com CPO para realinhar: 40% da capacity de Eng reservada para Enterprise  
- Se não aprovado, Vision cai de 100 para 70 clientes Enterprise (ajuste de target)

### 3. **CS Team overloaded (1 CSM gerencia 40 contas)**
**Impacto:** QBRs não acontecem, churn aumenta.  
**Mitigação:**  
- Contratar 2 CSMs adicionais até Abr/2026  
- Implementar CS automatizado para contas <$5k ARR (libera capacity)

### 4. **Competidor X lançou feature similar (perdemos first-mover advantage)**
**Impacto:** Win-rate pode cair de 30% para 20%.  
**Mitigação:**  
- Pivotar messaging de "único com feature Y" para "melhor suporte e integração"  
- Battle Card atualizado destacando diferenciais (uptime SLA, onboarding speed)

---

## 📊 MEASURES (Quarterly Tracking)

| Measure | Baseline | Q1 Target | Q2 Target | Q3 Target | Q4 Target | Final Target |
|---------|----------|-----------|-----------|-----------|-----------|--------------|
| ARR Total | $10M | $12M | $15M | $18M | $20M | **$20M** |
| Clientes Enterprise (>$50k) | 50 | 60 | 75 | 90 | 100 | **100** |
| NPS (Enterprise) | 45 | 50 | 55 | 58 | 60 | **60+** |
| Pipeline Enterprise | $2M | $3M | $4M | $5M | $6M | **$6M** |
| Sales Cycle (days) | 90d | 80d | 75d | 65d | 60d | **60d** |
| Expansion MRR | $20k/mo | $30k | $40k | $50k | $60k | **$60k/mo** |

---

## 🔄 Review Cadence

- **Monthly:** Update de Measures + Obstacle check  
- **Quarterly:** Deep dive - Ajustar Methods se necessário  
- **End of Year:** Retrospectiva completa + definição V2MOM 2027

---

**Criado por:** [Nome]  
**Data:** Janeiro/2026  
**Última Revisão:** [Data da última atualização trimestral]
```

## 🎓 Quando Usar V2MOM (vs outros frameworks)

✅ **Use V2MOM se:**
- Valoriza transparência radical (cultura open by default)
- Organização orientada a execution (não só strategy)
- Precisa de alinhamento top-down mas sem micromanagement
- Horizonte de planejamento é anual (com reviews trimestrais)

❌ **Evite V2MOM se:**
- Cultura é muito hierárquica (V2MOM expõe todos os níveis)
- Não há disciplina para reviews trimestrais
- Prefere frameworks mais ágeis/iterativos (tipo OKR trimestral puro)

---

**Fontes:**
- Salesforce V2MOM Methodology (Internal Docs)
- "Behind the Cloud" (Marc Benioff)
- Trailhead: V2MOM Best Practices
- V2MOM.io Community Resources
