# KB_07: Planejamento Tributário

**Categoria:** ESTRATEGIA  
**Palavras:** ~2.500  
**Fonte Principal:** CTN, Luciano Amaro  

---

## 1. Fundamentos

### 1.1 Distinção Fundamental

| Conceito | Definição | Legalidade |
|----------|-----------|------------|
| **Elisão** | Economia lícita de tributos | ✅ Lícita |
| **Evasão** | Sonegação, fraude | ❌ Ilícita |
| **Elusão** | Abuso de forma jurídica | ⚠️ Questionável |

### 1.2 Limites do Planejamento

| Limite | Fundamento |
|--------|------------|
| Propósito negocial | Substância sobre forma |
| Boa-fé | Art. 421 CC |
| Simulação | Art. 167 CC |
| Fraude | Art. 149, VII CTN |

---

## 2. Tributos Principais

### 2.1 Federais

| Tributo | Base | Alíquota |
|---------|------|----------|
| **IRPJ** | Lucro | 15% + 10% (adicional) |
| **CSLL** | Lucro | 9% |
| **PIS** | Receita | 0.65% ou 1.65% |
| **COFINS** | Receita | 3% ou 7.6% |
| **IPI** | Produtos industrializados | Variável |

### 2.2 Estaduais

| Tributo | Base | Alíquota |
|---------|------|----------|
| **ICMS** | Circulação | 4% a 18% |
| **ITCMD** | Herança/Doação | Até 8% |
| **IPVA** | Veículos | 1% a 4% |

### 2.3 Municipais

| Tributo | Base | Alíquota |
|---------|------|----------|
| **ISS** | Serviços | 2% a 5% |
| **IPTU** | Imóveis | Variável |
| **ITBI** | Transmissão | 2% a 3% |

---

## 3. Regimes de Tributação

### 3.1 Comparativo

| Regime | Limite Receita | Tributação |
|--------|----------------|------------|
| Simples Nacional | R$ 4.8M/ano | Simplificada |
| Lucro Presumido | R$ 78M/ano | Presunção |
| Lucro Real | Obrigatório acima | Contábil |

### 3.2 Lucro Real vs Presumido

| Aspecto | Real | Presumido |
|---------|------|-----------|
| Base | Lucro contábil | % da receita |
| Complexidade | Alta | Média |
| Indicado | Margens baixas | Margens altas |
| Créditos PIS/COFINS | Sim | Não |

---

## 4. Planejamentos Comuns

### 4.1 Estruturas Societárias

| Estrutura | Objetivo | Risco |
|-----------|----------|-------|
| **Holding** | Concentrar patrimônio | Desconsideração |
| **SPV** | Isolar risco de projeto | Substância |
| **Offshore** | Diferimento/planejamento | Transfer pricing |

### 4.2 Operações

| Operação | Objetivo | Risco |
|----------|----------|-------|
| **JCP** | Dedutibilidade | Limite TJLP |
| **Stock options** | Retenção | Questionamento RFB |
| **Cisão** | Segregar atividades | Simulação |
| **Incorporação reversa** | Ágio | Nova jurisprudência |

---

## 5. Transfer Pricing

### 5.1 Conceito

Controle de preços praticados em transações entre partes relacionadas (cross-border).

### 5.2 Métodos

| Método | Descrição |
|--------|-----------|
| **PIC** | Preços Independentes Comparados |
| **PRL** | Revenda Menos Lucro |
| **CPL** | Custo de Produção Mais Lucro |
| **PCI** | Importação |
| **PECEX** | Exportação |

### 5.3 Reforma (Lei 14.596/23)

Nova legislação alinhada com OCDE (arm's length principle).

---

## 6. Contencioso Tributário

### 6.1 Fases

```
1. AUTO DE INFRAÇÃO
   ↓
2. DEFESA ADMINISTRATIVA (Impugnação)
   ↓
3. CARF / Conselhos Estaduais
   ↓
4. EXECUÇÃO FISCAL (se não pago)
   ↓
5. EMBARGOS / AÇÃO ANULATÓRIA
```

### 6.2 Garantias

| Garantia | Descrição |
|----------|-----------|
| Depósito integral | Suspende exigibilidade |
| Seguro-garantia | Aceito com restrições |
| Fiança bancária | Aceita |
| Penhora de bens | Ordem legal |

### 6.3 Transação Tributária

Nova modalidade (Lei 13.988/20) permite negociação de débitos com descontos.

---

## 7. Riscos Críticos

### 7.1 Planejamento Abusivo

| Indicador | Risco |
|-----------|-------|
| Ausência de propósito negocial | Alto |
| Operações artificiais | Alto |
| Step transactions | Médio |
| Treaty shopping | Alto |

### 7.2 Desconsideração

| Tipo | Fundamento |
|------|------------|
| Societária | Art. 50 CC |
| Tributária | Art. 149 CTN |
| Trabalhista | Súmula 331 TST |

---

## 8. Aplicação CLO

### 8.1 Checklist M&A (Tax DD)

- [ ] Certidões negativas (federal, estadual, municipal)
- [ ] CARF/TIT pendentes
- [ ] Parcelamentos ativos
- [ ] Transfer pricing (se aplicável)
- [ ] Planejamentos agressivos
- [ ] Benefícios fiscais (sustentabilidade)
- [ ] Ágio (justificativa econômica)

### 8.2 Circuit Breakers

```yaml
triggers:
  - trigger: "Proposta de elisão sem substância"
    action: "HALT — Risco de autuação + multa qualificada"
    
  - trigger: "Offshore para ocultação"
    action: "HALT — Potencial crime contra ordem tributária"
    
  - trigger: "Omissão de receita"
    action: "HALT — Evasão fiscal (Lei 8.137)"
```

### 8.3 Distinção Crítica

```
ELISÃO (LÍCITA):
├── Antes do fato gerador
├── Com propósito negocial
├── Formas legais adequadas
└── Transparência fiscal

EVASÃO (ILÍCITA):
├── Após fato gerador
├── Ocultação de fatos
├── Documentos falsos
└── Simulação
```

---

**Fontes Citadas:**
- CTN (Lei 5.172/66)
- AMARO, Luciano. Direito Tributário Brasileiro, 2021
- Lei 14.596/23 (Transfer Pricing)
- Lei 13.988/20 (Transação Tributária)


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->