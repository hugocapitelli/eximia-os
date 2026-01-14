# KB_06: Direito Trabalhista

**Categoria:** TEORIA  
**Palavras:** ~2.500  
**Fonte Principal:** CLT, Maurício Godinho Delgado  

---

## 1. Fundamentos

### 1.1 CLT (Decreto-Lei 5.452/43)

Consolidação das Leis do Trabalho — regulamenta relações trabalhistas.

**Reforma Trabalhista:** Lei 13.467/2017 (alterações significativas).

### 1.2 Princípios

| Princípio | Descrição |
|-----------|-----------|
| **Proteção** | In dubio pro operario |
| **Irrenunciabilidade** | Direitos indisponíveis |
| **Continuidade** | Presunção de permanência |
| **Primazia da realidade** | Fatos > Documentos |
| **Boa-fé** | Lealdade contratual |

---

## 2. Contrato de Trabalho

### 2.1 Requisitos (Art. 3º CLT)

| Elemento | Descrição |
|----------|-----------|
| **Pessoalidade** | Prestação pelo próprio empregado |
| **Habitualidade** | Continuidade (não-eventualidade) |
| **Subordinação** | Sujeição às ordens |
| **Onerosidade** | Contraprestação salarial |

### 2.2 Tipos de Contrato

| Tipo | Base Legal | Prazo |
|------|------------|-------|
| Indeterminado | Regra geral | Sem termo |
| Determinado | Art. 443 | Até 2 anos |
| Experiência | Art. 445 | Até 90 dias |
| Intermitente | Art. 452-A | Por convocação |
| Teletrabalho | Art. 75-B | Conforme contrato |

---

## 3. Rescisão Contratual

### 3.1 Modalidades

| Modalidade | Aviso | FGTS 40% | Seguro-Desemp |
|------------|-------|----------|---------------|
| Sem justa causa | ✅ | ✅ | ✅ |
| Por justa causa | ❌ | ❌ | ❌ |
| Pedido demissão | ✅ | ❌ | ❌ |
| Acordo mútuo | ½ | ½ (20%) | ❌ |
| Culpa recíproca | ½ | ½ (20%) | ❌ |

### 3.2 Justa Causa (Art. 482 CLT)

| Hipótese | Descrição |
|----------|-----------|
| a) Improbidade | Ato de desonestidade |
| b) Incontinência | Conduta imoral |
| c) Negociação habitual | Concorrência |
| d) Condenação criminal | Transitada em julgado |
| e) Desídia | Negligência reiterada |
| f) Embriaguez | Habitual ou em serviço |
| g) Violação de segredo | Divulgação de informação |
| h) Indisciplina | Descumprimento de ordens |
| i) Insubordinação | Desobediência direta |
| j) Abandono | Ausência prolongada |
| k) Ato lesivo | Ofensas físicas/honra |
| l) Prática constante de jogos | Azar |

**Requisitos para aplicação:**
1. Imediatidade (proporcionalidade temporal)
2. Proporcionalidade (adequação da pena)
3. Non bis in idem (punição única)
4. Nexo causal (relação com trabalho)

---

## 4. Riscos Trabalhistas Críticos

### 4.1 Assédio Moral

| Elemento | Descrição |
|----------|-----------|
| Definição | Conduta abusiva reiterada |
| Prova | Testemunhal, documental, pericial |
| Indenização | Dano moral + material |
| Responsabilidade | Empregador (objetivo) |

### 4.2 Assédio Sexual

| Aspecto | Descrição |
|---------|-----------|
| Tipificação | Art. 216-A CP |
| Tipos | Chantagem (quid pro quo), Ambiental |
| Consequências | Justa causa, indenização, criminal |

### 4.3 Terceirização

Lei 13.429/2017 — Permitida para qualquer atividade (fim ou meio).

| Aspecto | Regra |
|---------|-------|
| Responsabilidade | Subsidiária (tomador) |
| Condições | Igualdade de tratamento |
| Exclusividade | Vedada (caracteriza vínculo) |

### 4.4 Pejotização

| Indicador | Caracteriza Fraude |
|-----------|-------------------|
| Subordinação | Horário, local fixo |
| Pessoalidade | Sem substituição |
| Habitualidade | Rotina contínua |
| Exclusividade | Único tomador |

---

## 5. Reforma Trabalhista (Lei 13.467/17)

### 5.1 Principais Alterações

| Tema | Antes | Depois |
|------|-------|--------|
| Negociado vs Legislado | Lei prevalece | Acordo pode prevalecer |
| Horas in itinere | Jornada | Não cômputa |
| Férias | 1 ou 2 períodos | Até 3 períodos |
| Banco de horas | Sindicato | Acordo individual |
| Homologação | Sindicato | Dispensada |
| Danos morais | Sem limite | Tabelado (CLT) |

### 5.2 Negociado sobre Legislado (Art. 611-A)

Acordo/Convenção pode dispor sobre:
- Jornada de trabalho
- Banco de horas
- Intervalo intrajornada
- Teletrabalho
- PLR
- Troca de feriados

**Vedações (Art. 611-B):** FGTS, 13º, férias, salário mínimo, segurança.

---

## 6. Contingências Trabalhistas

### 6.1 Cálculo de Provisão

```
Provisão = Σ (Pedido × P(Perda) × Fator_Redução)

Onde:
- Pedido = Valor pleiteado
- P(Perda) = Probabilidade de condenação
- Fator_Redução = Estimativa de redução em acordo/sentença
```

### 6.2 Métricas

| KPI | Target |
|-----|--------|
| Provisão trabalhista/Revenue | <0.5% |
| Win rate | >60% |
| Tempo médio de processo | <24 meses |
| Custo por reclamação | <R$ 50K |

---

## 7. Aplicação CLO

### 7.1 Checklist Demissão

- [ ] Verificar estabilidades (gestante, cipeiro, acidentado)
- [ ] Documentação de performance (se justa causa)
- [ ] Cálculo de verbas rescisórias
- [ ] TRCT e homologação
- [ ] Devolução de bens
- [ ] NDA/Non-compete (se aplicável)

### 7.2 Circuit Breakers

```yaml
triggers:
  - trigger: "Demissão de gestante"
    action: "HALT — Estabilidade constitucional (Art. 10 ADCT)"
    
  - trigger: "Justa causa sem documentação"
    action: "PAUSE — Risco de reversão judicial"
    
  - trigger: "Pejotização com subordinação"
    action: "HALT — Risco de vínculo + passivo"
```

---

**Fontes Citadas:**
- CLT (Decreto-Lei 5.452/43)
- Lei 13.467/2017 (Reforma Trabalhista)
- DELGADO, Maurício Godinho. Curso de Direito do Trabalho, 2023
