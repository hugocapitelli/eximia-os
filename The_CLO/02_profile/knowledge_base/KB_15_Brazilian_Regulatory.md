# KB_15: Regulação Brasileira

**Categoria:** INVARIANTES  
**Palavras:** ~2.500  
**Fonte Principal:** CVM, BACEN, CADE, ANPD  

---

## 1. Reguladores Principais

| Regulador | Área | Lei Base |
|-----------|------|----------|
| **CVM** | Mercado de Capitais | Lei 6.385/76 |
| **BACEN** | Sistema Financeiro | Lei 4.595/64 |
| **CADE** | Concorrência | Lei 12.529/11 |
| **ANPD** | Proteção de Dados | Lei 13.709/18 |
| **ANS** | Saúde Suplementar | Lei 9.656/98 |
| **ANEEL** | Energia Elétrica | Lei 9.427/96 |
| **ANATEL** | Telecomunicações | Lei 9.472/97 |
| **SUSEP** | Seguros | DL 73/66 |

---

## 2. CVM (Comissão de Valores Mobiliários)

### 2.1 Competências

| Área | Descrição |
|------|-----------|
| Registro | Emissores, ofertas, valores mobiliários |
| Fiscalização | Companhias abertas, intermediários |
| Regulação | Instruções normativas |
| Sancionamento | PAC (Processo Administrativo) |

### 2.2 Instruções Principais

| Instrução | Assunto |
|-----------|---------|
| RCVM 44 | Ofertas públicas |
| RCVM 80 | Fatos relevantes |
| RCVM 168 | Governança |
| CVM 358 | Divulgação de ato ou fato relevante |

### 2.3 Fato Relevante

| Aspecto | Regra |
|---------|-------|
| Definição | Pode influir decisão investor |
| Timing | Imediato |
| Divulgação | Antes ou após pregão |
| Sigilo | Até divulgação |

---

## 3. BACEN (Banco Central)

### 3.1 Competências

| Área | Descrição |
|------|-----------|
| Autorização | IFs, PACs, operações |
| Fiscalização | Instituições financeiras |
| Regulação | Resoluções CMN, circulares |
| Sancionamento | Multas, intervenção, liquidação |

### 3.2 Temas Críticos

| Tema | Norma |
|------|-------|
| Lavagem (PLD) | Circular 3.978/20 |
| Open Banking | Resolução BCB 1/20 |
| PIX | Resolução BCB 89/21 |
| Capital | Basileia III |

### 3.3 Sigilo Bancário

Lei Complementar 105/01 — Sigilo, exceto:
- Ordem judicial
- CPI
- Requisição fiscal (procedimento próprio)
- COAF/UIF

---

## 4. CADE (Conselho Administrativo de Defesa Econômica)

### 4.1 Atos de Concentração

| Critério | Threshold |
|----------|-----------|
| Grupo 1 | Faturamento ≥ R$ 750M |
| Grupo 2 | Faturamento ≥ R$ 75M |
| Obrigatoriedade | Notificação prévia |
| Prazo | 240 dias (prorrogável) |

### 4.2 Condutas Ilícitas (Art. 36)

| Conduta | Descrição |
|---------|-----------|
| Cartel | Acordo entre concorrentes |
| Preço abusivo | Acima do mercado |
| Venda casada | Produto condicionado |
| Discriminação | Tratamento desigual |
| Recusa de venda | Sem justificativa |

### 4.3 Sanções

| Sanção | Parâmetro |
|--------|-----------|
| Multa empresa | 0.1% a 20% faturamento |
| Multa administrador | 1% a 20% da empresa |
| Proibição | Contratar com governo |

---

## 5. ANPD (Autoridade Nacional de Proteção de Dados)

### 5.1 Competências

| Área | Descrição |
|------|-----------|
| Zelar | Implementação LGPD |
| Orientar | Guias, enunciados |
| Fiscalizar | Inspeções, auditorias |
| Sancionar | Multas, bloqueios |

### 5.2 Resoluções 2024

| Resolução | Tema |
|-----------|------|
| 15/2024 | Comunicação de incidentes |
| 18/2024 | Encarregado (DPO) |
| 19/2024 | Transferência internacional |

### 5.3 Sanções

| Sanção | Limite |
|--------|--------|
| Multa simples | 2% faturamento, cap R$ 50M |
| Multa diária | Idem acima |
| Publicização | Divulgação da infração |
| Bloqueio/Eliminação | Dados pessoais |

---

## 6. Interações Regulatórias

### 6.1 Sobreposições

| Cenário | Reguladores |
|---------|-------------|
| M&A banco | BACEN + CADE |
| IPO | CVM + B3 |
| Fintech | BACEN + CVM (tokens) |
| Health tech | ANS + ANPD |
| Breach em banco | BACEN + ANPD |

### 6.2 Conflitos Potenciais

| Conflito | Resolução |
|----------|-----------|
| Sigilo bancário vs LGPD | LGPD Art. 4º (fins regulatórios) |
| CADE timing vs M&A | Gun-jumping = multa |
| CVM disclosure vs NDA | Fato relevante prevalece |

---

## 7. Aplicação CLO

### 7.1 Mapa Regulatório

```
EMPRESA
├── Se negocia valores mobiliários → CVM
├── Se instituição financeira → BACEN
├── Se M&A > threshold → CADE
├── Se trata dados pessoais → ANPD
├── Se saúde → ANS/ANVISA
├── Se energia → ANEEL
├── Se telecom → ANATEL
└── Se seguros → SUSEP
```

### 7.2 Checklist Regulatório

- [ ] Mapeamento de reguladores aplicáveis
- [ ] Licenças e autorizações em dia
- [ ] Compliance officers nomeados
- [ ] Reportes regulatórios em dia
- [ ] Treinamento específico realizado
- [ ] Interlocução estabelecida

### 7.3 Circuit Breakers

```yaml
triggers:
  - trigger: "M&A sem notificação CADE"
    action: "HALT — Gun-jumping = multa + nulidade"
    
  - trigger: "IPO sem registro CVM"
    action: "HALT — Oferta irregular = infração penal"
    
  - trigger: "Sigilo bancário violado"
    action: "HALT — LC 105 = responsabilidade criminal"
```

---

**Fontes Citadas:**
- Lei 6.385/76 (CVM)
- Lei 4.595/64 (BACEN)
- Lei 12.529/11 (CADE)
- Lei 13.709/18 (LGPD)
- Resoluções e Instruções normativas vigentes
