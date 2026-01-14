# THEMIS SENTINEL CLO — PARECER JURÍDICO

**Assunto:** Análise de Viabilidade Legal — Projeto Agenda Cheia  
**Para:** Diretoria / Founders  
**Data:** 2026-01-07  
**Classificação:** ⚖️ PARECER ESTRATÉGICO  

---

## Síntese Executiva

O projeto **Agenda Cheia** é **juridicamente viável** (**CONDITIONAL GO**), desde que implementadas as mitigações recomendadas. Os riscos principais concentram-se em **LGPD** (tratamento de dados pessoais), **WhatsApp Business API** (políticas da Meta) e **CDC** (vedação de publicidade enganosa). O PRD já contempla medidas substanciais de compliance, mas há gaps a endereçar.

**Risco Consolidado:** 🟡 **MÉDIO**  
**Recomendação:** ✅ **CONDITIONAL GO** — pode prosseguir com ajustes

---

## Análise IRAC

### I — Issue (Questões Jurídicas Centrais)

1. **LGPD:** O modelo de negócio trata dados pessoais (nome, telefone, histórico) de terceiros. Qual a base legal e responsabilidade?

2. **WhatsApp:** A automação via IA para recall viola as políticas do WhatsApp Business API (janeiro/2026)?

3. **CDC:** O chatbot "Júlia" pode ser considerado publicidade enganosa por não ser humano?

4. **Responsabilidade Civil:** Se o salão sofrer ban ou multa, a Agenda Cheia responde solidariamente?

5. **Tributação:** Qual o enquadramento correto e riscos de autuação?

---

### R — Rule (Legislação e Normas Aplicáveis)

#### LGPD (Lei 13.709/2018)

| Artigo | Disposição | Aplicação |
|--------|------------|-----------|
| Art. 6º | Princípios (finalidade, adequação, necessidade) | Delimitar uso de dados |
| Art. 7º, I | Consentimento | Base legal primária |
| Art. 7º, IX | Legítimo interesse | Base legal secundária |
| Art. 18 | Direitos do titular | Acesso, exclusão, portabilidade |
| Art. 37 | Controlador vs Operador | Definir responsabilidades |
| Art. 46 | Segurança e sigilo | Criptografia, controle de acesso |
| Art. 48 | Notificação de incidentes | 72h para ANPD |
| Art. 52 | Sanções | Até 2% faturamento, cap R$ 50M |

#### Políticas WhatsApp Business (Meta, Jan/2026)

| Regra | Status |
|-------|--------|
| Proibido bot genérico | ✅ Agenda Cheia é purpose-specific |
| Proibido se passar por humano | ⚠️ Risco se "Júlia" não declarar ser IA |
| Obrigatório opt-out fácil | ✅ Implementado (SAIR) |
| Quality Rating management | ✅ Previsto no PRD |

#### CDC (Lei 8.078/1990)

| Artigo | Disposição | Aplicação |
|--------|------------|-----------|
| Art. 6º, III | Direito à informação | Bot deve identificar ser automatizado |
| Art. 37 | Publicidade enganosa | Não pode simular ser humano |
| Art. 39, III | Vedação de envio sem solicitação | Spam = prática abusiva |

#### Marco Civil da Internet (Lei 12.965/2014)

| Artigo | Disposição |
|--------|------------|
| Art. 7º | Proteção da privacidade |
| Art. 10 | Guarda de registros de aplicação |
| Art. 13 | Logs obrigatórios (6 meses) |

---

### A — Analysis (Análise por Pilar de Risco)

#### 1. LGPD — Tratamento de Dados Pessoais

| Aspecto | Avaliação | Risco |
|---------|-----------|:-----:|
| **Controlador vs Operador** | Agenda Cheia = Operador; Salão = Controlador | ✅ OK |
| **Base Legal** | Consentimento (Art. 7º, I) + Legítimo Interesse (Art. 7º, IX) | ✅ OK |
| **Minimização** | Apenas nome, telefone, histórico de serviços | ✅ OK |
| **Consentimento** | Checkbox no onboarding (não pré-marcado) | ✅ OK |
| **Direitos do Titular** | Endpoints de acesso, exclusão, portabilidade | ✅ OK |
| **Retenção** | Deleção automática após 30 dias de inatividade | ✅ OK |
| **Segurança** | HTTPS/TLS, criptografia em repouso, RBAC | ✅ OK |
| **DPO** | Designado (dpo@agendacheia.com.br) | ✅ OK |
| **DPA (Contrato Operador-Controlador)** | Previsto, mas não detalhado | ⚠️ GAP |
| **Transferência Internacional** | Supabase (AWS) — servidores onde? | ⚠️ GAP |

**Exposure LGPD:**
- P(fiscalização): 10-15% (startups pequenas são low-priority para ANPD)
- Impacto: Até 2% do faturamento (cap R$ 50M)
- **Exposure estimado:** R$ 0 - R$ 20K (fase inicial)

**Gaps a Endereçar:**
1. Especificar localização dos servidores (LGPD Art. 33 — transferência internacional)
2. Criar DPA (Data Processing Agreement) modelo para salões
3. Implementar processo de atendimento a requisições de titulares (prazo 15 dias)

---

#### 2. WhatsApp Business API — Compliance Meta

| Aspecto | Avaliação | Risco |
|---------|-----------|:-----:|
| **Purpose-specific bot** | Escopo limitado (agendamento, recall) | ✅ OK |
| **Transparência de identidade** | Previsto admitir ser bot | ✅ OK |
| **Opt-out fácil** | "SAIR" detectado | ✅ OK |
| **Rate limiting** | 10 msg/min, delay randômico | ✅ OK |
| **Quality Rating** | Monitoramento e pausa automática | ✅ OK |
| **Soft opt-in** | Pede SIM/NÃO na primeira mensagem | ✅ OK |

**Risco de Ban:**
- P(ban individual): 5-10% (seguindo boas práticas)
- Impacto: Perda temporária de operação do salão
- **Exposure:** BAIXO (não há multa, só interrupção)

**Gaps a Endereçar:**
1. Primeira mensagem deve incluir **explicitamente** que é mensagem automatizada
2. Considerar migração para WhatsApp Cloud API oficial (vs Z-API) para maior estabilidade
3. Ter processo de recuperação de ban documentado

---

#### 3. CDC — Proteção ao Consumidor

| Aspecto | Avaliação | Risco |
|---------|-----------|:-----:|
| **Identificação de IA** | Bot admite ser virtual se perguntado | ⚠️ INSUFICIENTE |
| **Direito à informação** | Cliente sabe por que está recebendo mensagem | ✅ OK |
| **Opt-out** | Fácil e imediato | ✅ OK |

**Análise CDC:**

O PRD prevê que o bot admita ser IA **apenas se perguntado**. Isso pode ser insuficiente sob o CDC.

**Art. 37, § 1º:** "É enganosa qualquer modalidade de informação ou comunicação de caráter publicitário, inteira ou parcialmente falsa, **ou, por qualquer outro modo, mesmo por omissão**, capaz de induzir em erro o consumidor."

**Risco:** Se o consumidor acreditar estar falando com um humano e descobrir depois que era bot, pode alegar publicidade enganosa por **omissão**.

**Mitigação Recomendada:**
- Primeira mensagem deve incluir: *"Sou a assistente virtual do salão"*
- Não apenas "Sou a Júlia do salão" (que sugere nome humano)

**Exposure CDC:**
- P(reclamação judicial): 2-5%
- Impacto: R$ 5K-20K por ação + danos morais coletivos
- **Exposure:** BAIXO a MÉDIO

---

#### 4. Responsabilidade Civil

| Cenário | Responsabilidade Agenda Cheia |
|---------|-------------------------------|
| Salão sofre ban WhatsApp | ❌ Não responde (salão é controlador) |
| Vazamento de dados | ⚠️ Solidariedade possível (Art. 42 LGPD) |
| Cliente processa por spam | ❌ Salão responde (Agenda Cheia é operadora) |
| Bug causa exposição de dados | ✅ Agenda Cheia responde como fornecedor |

**Mitigações:**
- Termo de uso com **limitação de responsabilidade**
- **Isenção** de responsabilidade por uso indevido pelo salão
- **Seguro cyber** (sugerido no PRD)

---

#### 5. Tributação e Licenciamento

| Aspecto | Avaliação |
|---------|-----------|
| **Enquadramento** | SaaS — ISS + Simples Nacional | ✅ OK |
| **Nota Fiscal** | NFS-e obrigatória | ✅ OK |
| **Registro INPI** | Marca não registrada ainda | ⚠️ GAP |
| **Software no INPI** | Opcional, recomendado | ⚠️ GAP |

**Recomendação:** Registrar marca "Agenda Cheia" **antes** do lançamento para evitar conflitos.

---

### C — Conclusion (Recomendação)

## ✅ CONDITIONAL GO

O projeto **Agenda Cheia** é **juridicamente viável** para lançamento, **desde que implementadas as seguintes condições**:

---

## Condições Obrigatórias (Pré-Launch)

| # | Ação | Responsável | Prazo | Risco se Omitir |
|---|------|-------------|-------|-----------------|
| 1 | Primeira mensagem incluir "assistente virtual" explícito | Product | Antes MVP | ALTO (CDC) |
| 2 | Criar DPA modelo (Contrato Operador-Controlador) | Legal | Antes MVP | ALTO (LGPD) |
| 3 | Documentar localização dos servidores Supabase | Tech | Antes MVP | MÉDIO (LGPD Art. 33) |
| 4 | Implementar processo de atendimento Art. 18 (15 dias) | Product | Antes MVP | MÉDIO (LGPD) |
| 5 | Registrar marca "Agenda Cheia" no INPI | Legal | 30 dias | MÉDIO (PI) |

---

## Condições Recomendadas (Pós-Launch)

| # | Ação | Responsável | Prazo |
|---|------|-------------|-------|
| 6 | Migrar para WhatsApp Cloud API (vs Z-API) | Tech | 90 dias |
| 7 | Contratar seguro cyber liability | Finance | 60 dias |
| 8 | Auditoria LGPD por terceiro | Legal | 6 meses |
| 9 | Registro de software no INPI | Legal | 6 meses |

---

## Risk Heatmap Consolidado

| Categoria | Probabilidade | Impacto | Nível |
|-----------|:-------------:|:-------:|:-----:|
| LGPD (multa ANPD) | Baixa | Alto | 🟡 MÉDIO |
| WhatsApp (ban) | Baixa | Médio | 🟢 BAIXO |
| CDC (proc. consumidor) | Baixa | Médio | 🟢 BAIXO |
| Responsabilidade Civil | Baixa | Médio | 🟢 BAIXO |
| Propriedade Intelectual | Média | Médio | 🟡 MÉDIO |
| Tributário | Mínima | Baixo | 🟢 MÍNIMO |

**Risco Agregado:** 🟡 **MÉDIO** (gerenciável com mitigações)

---

## Exposure Total Estimado

| Cenário | Probabilidade | Exposure | Ponderado |
|---------|:-------------:|:--------:|:---------:|
| Multa LGPD | 10% | R$ 20.000 | R$ 2.000 |
| Ação CDC | 5% | R$ 15.000 | R$ 750 |
| Registro de marca (defensivo) | — | R$ 1.500 | R$ 1.500 |
| Seguro cyber (preventivo) | — | R$ 3.000/ano | R$ 3.000 |
| **TOTAL** | — | — | **R$ 7.250** |

O custo de compliance é **significativamente inferior** ao risco de não compliance.

---

## Matriz de Decisão

```
                    BAIXO IMPACTO    ALTO IMPACTO
                 ┌─────────────────┬─────────────────┐
   ALTA          │                 │                 │
   PROBABILIDADE │   Tributário    │   CDC (pós-fix) │
                 │                 │                 │
                 ├─────────────────┼─────────────────┤
   BAIXA         │                 │                 │
   PROBABILIDADE │   WhatsApp ban  │   LGPD (multa)  │
                 │                 │   IP (marca)    │
                 └─────────────────┴─────────────────┘
```

---

## Próximos Passos

1. **Hoje:** Aprovar parecer e confirmar go-ahead
2. **Esta semana:** Ajustar primeira mensagem do bot para compliance CDC
3. **Antes do MVP:** Criar DPA modelo e políticas de privacidade
4. **30 dias:** Registrar marca no INPI
5. **Ongoing:** Monitorar Quality Rating do WhatsApp

---

**Disclaimer:**
> Este conteúdo é informativo e não constitui aconselhamento jurídico formal. Para implementação, recomenda-se revisão por advogado habilitado. A análise considera a legislação brasileira vigente em janeiro de 2026.

---

**Assinado:**  
🏛️ **Themis Sentinel CLO** — Chief Legal Officer Virtual  
eximIA.AI | v1.0 | 2026-01-07
