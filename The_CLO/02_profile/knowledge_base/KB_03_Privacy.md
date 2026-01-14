# KB_03: Proteção de Dados (LGPD & GDPR)

**Categoria:** ESTRATEGIA  
**Palavras:** ~3.000  
**Fonte Principal:** Lei 13.709/18, GDPR, ANPD  

---

## 1. LGPD — Lei Geral de Proteção de Dados

### 1.1 Visão Geral

| Característica | Descrição |
|----------------|-----------|
| Lei | 13.709/2018 |
| Vigência | Setembro 2020 |
| Sanções | Agosto 2021 |
| Regulador | ANPD (Autoridade Nacional de Proteção de Dados) |

**Fonte:** [ANPD, 2024]

### 1.2 Bases Legais (Art. 7º)

| Base | Descrição |
|------|-----------|
| **Consentimento** | Manifestação livre, informada e inequívoca |
| **Obrigação legal** | Cumprimento de lei |
| **Políticas públicas** | Execução por administração pública |
| **Pesquisa** | Por órgão de pesquisa (anonimização) |
| **Contrato** | Execução ou procedimentos preliminares |
| **Exercício de direitos** | Em processos judiciais/administrativos |
| **Vida e saúde** | Proteção de integridade física |
| **Legítimo interesse** | Do controlador ou terceiro |
| **Proteção de crédito** | Análise de risco creditício |

### 1.3 Princípios (Art. 6º)

1. **Finalidade** — propósito legítimo
2. **Adequação** — compatibilidade com finalidade
3. **Necessidade** — mínimo necessário
4. **Livre acesso** — consulta facilitada
5. **Qualidade** — exatidão e atualização
6. **Transparência** — informações claras
7. **Segurança** — proteção técnica
8. **Prevenção** — evitar danos
9. **Não discriminação** — vedado uso discriminatório
10. **Responsabilização** — demonstrar compliance

---

## 2. Regulamentações ANPD 2024

### 2.1 Resoluções Principais

| Resolução | Data | Tema |
|-----------|------|------|
| CD/ANPD nº 15/2024 | 2024 | Comunicação de Incidente de Segurança |
| CD/ANPD nº 18/2024 | 2024 | Encarregado (DPO) |
| CD/ANPD nº 19/2024 | Ago/2024 | Transferência Internacional de Dados |

**Fonte:** [Gov.br/ANPD, 2024]

### 2.2 Transferência Internacional (Res. 19/2024)

Mecanismos permitidos:
1. Decisão de adequação
2. Cláusulas contratuais específicas (SCCs)
3. Normas corporativas globais (BCRs)
4. Selos/certificações

**Prazo:** Agentes têm até **23/08/2025** para adequação.

### 2.3 Encarregado/DPO (Res. 18/2024)

| Aspecto | Regra |
|---------|-------|
| Obrigatoriedade | Controladores (obrigatório), Operadores (facultativo) |
| Pequeno porte | Dispensados, mas devem ter canal de comunicação |
| Conflito de interesse | Não pode cumular funções conflitantes |

---

## 3. Sanções LGPD (Art. 52)

| Sanção | Parâmetro |
|--------|-----------|
| Advertência | Com prazo para correção |
| Multa simples | Até 2% do faturamento (cap R$ 50M/infração) |
| Multa diária | Até limite total da multa simples |
| Publicização | Divulgação da infração |
| Bloqueio | Suspensão do tratamento |
| Eliminação | Exclusão dos dados |
| Suspensão parcial | Até 6 meses |
| Suspensão do exercício | Até 6 meses |
| Proibição | Total ou parcial |

**Obs:** Entes públicos não estão sujeitos a multa pecuniária.

### 3.1 Histórico de Sanções (até 2024)

- **6 sanções** aplicadas até agosto/2024
- **5 contra órgãos públicos** (Ministério da Saúde, INSS)
- **1 contra empresa privada** (Telekall Infoservice — R$ 14.400)

**Fonte:** [Mayer Brown, 2024; Contábeis, 2024]

---

## 4. Incidentes de Segurança

### 4.1 Obrigação de Comunicação (Art. 48)

> Em caso de incidente de segurança que possa acarretar risco ou dano relevante aos titulares, o controlador deverá comunicar à ANPD e ao titular.

### 4.2 Prazo

- **Comunicação à ANPD:** Em prazo razoável (ANPD recomenda 48-72h)
- **Comunicação ao titular:** Prazo razoável, se aplicável

### 4.3 Conteúdo da Comunicação

1. Natureza dos dados
2. Titulares envolvidos
3. Medidas técnicas adotadas
4. Riscos relacionados
5. Medidas para reverter/mitigar
6. Motivos de atraso (se aplicável)

---

## 5. GDPR — Referência Comparativa

### 5.1 Diferenças Chave

| Aspecto | LGPD | GDPR |
|---------|------|------|
| Território | Brasil | EU + EEA |
| Bases legais | 10 | 6 |
| Multa máxima | 2% / R$ 50M | 4% / €20M |
| DPO obrigatório | Sim (com exceções) | Sim (casos específicos) |
| Prazo incidente | 48-72h (recomendado) | 72h (obrigatório) |

### 5.2 DPIA (Data Protection Impact Assessment)

Obrigatório no GDPR para tratamentos de alto risco:
- Profiling sistemático
- Dados sensíveis em larga escala
- Monitoramento sistemático

LGPD menciona RIPD (Relatório de Impacto) no Art. 38.

---

## 6. Aplicação CLO

### 6.1 Checklist LGPD

- [ ] Mapeamento de dados (data mapping)
- [ ] Bases legais identificadas
- [ ] Política de privacidade publicada
- [ ] Encarregado nomeado
- [ ] Plano de resposta a incidentes
- [ ] Contratos com operadores (DPA)
- [ ] Registro de operações de tratamento

### 6.2 Protocolo de Incidente

```
1. DETECTAR
   - Identificar natureza e escopo
   
2. CONTER
   - Isolar sistemas afetados
   
3. AVALIAR
   - Risco aos titulares
   - Necessidade de comunicação
   
4. COMUNICAR
   - ANPD (48-72h)
   - Titulares (se alto risco)
   
5. DOCUMENTAR
   - Registro completo para accountability
   
6. REMEDIAR
   - Ações corretivas
   - Lições aprendidas
```

### 6.3 Circuit Breakers

```yaml
triggers:
  - trigger: "Vazamento de dados pessoais detectado"
    action: "CRISE — Ativar War Room, comunicar ANPD em 72h"
    
  - trigger: "Transferência internacional sem base legal"
    action: "HALT — Suspender até implementar SCCs"
    
  - trigger: "Tratamento sem base legal identificada"
    action: "PAUSE — Revisar ou cessar tratamento"
```

---

**Fontes Citadas:**
- Lei 13.709/2018 (LGPD)
- Resoluções ANPD 15, 18, 19/2024
- GDPR (Regulation EU 2016/679)
- Mayer Brown, DPONet, Contábeis (pesquisa web 2024)
