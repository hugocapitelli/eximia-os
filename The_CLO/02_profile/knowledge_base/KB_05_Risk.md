# KB_05: Gestão de Risco Jurídico

**Categoria:** ESTRATEGIA  
**Palavras:** ~2.500  
**Fonte Principal:** COSO ERM, ISO 31000, IIA  

---

## 1. Frameworks de Gestão de Risco

### 1.1 COSO ERM (2017)

Enterprise Risk Management — Integrating with Strategy and Performance

| Componente | Descrição |
|------------|-----------|
| **Governance & Culture** | Tone from the top, valores |
| **Strategy & Objective-Setting** | Alinhamento risco-estratégia |
| **Performance** | Identificação e resposta |
| **Review & Revision** | Monitoramento e melhoria |
| **Information & Communication** | Reporte e transparência |

### 1.2 ISO 31000:2018

| Princípio | Descrição |
|-----------|-----------|
| Integrado | Parte de todos os processos |
| Estruturado | Abordagem consistente |
| Customizado | Adaptado ao contexto |
| Inclusivo | Stakeholders envolvidos |
| Dinâmico | Responde a mudanças |
| Baseado em evidências | Informações de qualidade |
| Melhoria contínua | Aprendizado |

### 1.3 Three Lines Model (IIA 2020)

```
┌─────────────────────────────────────────────────┐
│              GOVERNING BODY                      │
│          (Board / Audit Committee)               │
├─────────────────────────────────────────────────┤
│              MANAGEMENT                          │
├──────────────┬──────────────┬───────────────────┤
│   1ª LINHA   │   2ª LINHA   │    3ª LINHA       │
│  (Operação)  │(Supervisão)  │   (Auditoria)     │
│              │              │                   │
│  Gestores    │  Compliance  │  Auditoria        │
│  Processos   │  Risk Mgmt   │  Interna          │
│  Controles   │  Legal       │  Independente     │
└──────────────┴──────────────┴───────────────────┘
```

---

## 2. Classificação de Risco Jurídico

### 2.1 Por Natureza

| Tipo | Exemplos |
|------|----------|
| **Regulatório** | CVM, BACEN, ANPD, CADE |
| **Contratual** | Inadimplemento, MAC |
| **Trabalhista** | Demissões, assédio |
| **Tributário** | Autos, planejamento |
| **Societário** | Conflitos, governança |
| **Litígio** | Processos judiciais |
| **Reputacional** | Crises, mídia |

### 2.2 Por Impacto

| Nível | Descrição | Exemplo |
|-------|-----------|---------|
| **Ruinoso** | Ameaça existência | Multa 20% faturamento |
| **Severo** | Prejuízo relevante | Condenação milionária |
| **Moderado** | Impacto controlável | Acordo trabalhista |
| **Tolerável** | Custo operacional | Multa administrativa menor |
| **Negligenciável** | Imaterial | Custas processuais |

---

## 3. Matriz de Risco

### 3.1 Probabilidade × Impacto

```
              IMPACTO
         Baixo  Médio  Alto  Crítico
       ┌──────┬──────┬──────┬──────┐
  Alta │  🟡  │  🟠  │  🔴  │  🔴  │
       ├──────┼──────┼──────┼──────┤
P Média│  🟢  │  🟡  │  🟠  │  🔴  │
R      ├──────┼──────┼──────┼──────┤
O Baixa│  🟢  │  🟢  │  🟡  │  🟠  │
B      ├──────┼──────┼──────┼──────┤
  Rem. │  🟢  │  🟢  │  🟢  │  🟡  │
       └──────┴──────┴──────┴──────┘

🔴 Crítico — Ação imediata
🟠 Alto — Mitigar
🟡 Médio — Monitorar
🟢 Baixo — Aceitar
```

### 3.2 Quantificação de Exposure

```
Exposure = P(loss) × Impact × (1 - Mitigation)

Onde:
- P(loss) = Probabilidade de perda (0-1)
- Impact = Valor financeiro potencial
- Mitigation = Fator de mitigação (seguro, defesa)
```

---

## 4. Resposta a Risco

### 4.1 Estratégias

| Estratégia | Descrição | Quando Usar |
|------------|-----------|-------------|
| **Evitar** | Eliminar atividade | Risco > Benefício |
| **Mitigar** | Reduzir probabilidade/impacto | Risco gerenciável |
| **Transferir** | Seguro, cláusulas contratuais | Transferível a terceiro |
| **Aceitar** | Assumir conscientemente | Risco baixo, custo alto |

### 4.2 Controles

| Tipo | Descrição |
|------|-----------|
| **Preventivo** | Evita ocorrência |
| **Detectivo** | Identifica ocorrência |
| **Corretivo** | Remedia consequências |

---

## 5. Contingências Jurídicas

### 5.1 Classificação Contábil (IAS 37 / CPC 25)

| Classificação | Probabilidade | Tratamento |
|---------------|---------------|------------|
| **Provável** | >50% | Provisiona |
| **Possível** | 25-50% | Divulga |
| **Remoto** | <25% | Não divulga |

### 5.2 Cálculo de Provisão

```
Provisão = Σ (P(loss)ᵢ × Impactᵢ)

Para cada litígio:
- Calcular P(loss) baseado em precedentes
- Estimar Impact (pedido + custas + honorários)
- Considerar cenários (best/base/worst)
```

---

## 6. Indicadores de Risco (KRIs)

### 6.1 KRIs Jurídicos

| Indicador | Métrica | Threshold |
|-----------|---------|-----------|
| Litígios novos | Qtd/mês | >10 = alerta |
| Provisão/Revenue | % | >1% = crítico |
| Compliance training | % realizado | <90% = risco |
| Incidentes LGPD | Qtd/ano | >0 = investigar |
| Contratos vencidos | Qtd | >5% = revisar |

### 6.2 Dashboard CLO

```
┌─────────────────────────────────────────────┐
│          CLO RISK DASHBOARD                  │
├─────────────────────────────────────────────┤
│  📊 Provisão Total:     R$ 15.2M            │
│  📈 Provisão/Revenue:   0.8% ✅              │
│  ⚖️ Litígios Ativos:    127                  │
│  🔴 Críticos:           3                    │
│  🟠 Altos:              12                   │
│  📅 Próximas Audiências: 5 (30 dias)        │
│  🔒 Compliance Rate:    94% ✅               │
└─────────────────────────────────────────────┘
```

---

## 7. Fraud Triangle (Cressey, 1953)

### 7.1 Elementos

```
        PRESSÃO
          /\
         /  \
        /    \
       /      \
      /  FRAUDE \
     /          \
    /____________\
OPORTUNIDADE    RACIONALIZAÇÃO
```

| Elemento | Descrição | Controle |
|----------|-----------|----------|
| Pressão | Incentivo/motivação | Metas realistas |
| Oportunidade | Falha de controle | Segregação de funções |
| Racionalização | Justificativa moral | Cultura ética |

---

## 8. Aplicação CLO

### 8.1 Processo de Avaliação

```
1. IDENTIFICAR
   - Mapear riscos por área
   
2. ANALISAR
   - Probabilidade × Impacto
   
3. AVALIAR
   - Priorizar por score
   
4. TRATAR
   - Definir resposta
   
5. MONITORAR
   - KRIs e dashboards
   
6. REPORTAR
   - Board e Comitê
```

### 8.2 Relatório de Risco Jurídico

```yaml
report:
  title: "Risk Assessment Q4/2025"
  sections:
    - executive_summary
    - risk_heatmap
    - top_10_risks
    - mitigation_actions
    - contingencies_update
    - kri_dashboard
    - recommendations
```

---

**Fontes Citadas:**
- COSO, Enterprise Risk Management, 2017
- ISO 31000:2018
- IIA, Three Lines Model, 2020
- CRESSEY, Donald. Other People's Money, 1953


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->