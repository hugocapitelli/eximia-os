# PRD: Automator Sales Engine (ASE)
# Plataforma de Diagnóstico Organizacional Acelerado por IA

**Versão:** 1.0
**Data:** 24/01/2026
**Status:** Aprovado para Desenvolvimento
**Empresa:** eximIA Ventures
**Classificação:** Projeto Complexo (Mansão)

---

## 📋 EXECUTIVE SUMMARY

### O Problema
Consultores de automação gastam **60 horas por diagnóstico** fazendo análise manual de processos, o que impede escalar vendas e gerar receita previsível. O processo é lento, não estruturado e dificulta fechamento de contratos.

### A Solução
**Automator Sales Engine (ASE)** é uma plataforma SaaS que reduz diagnóstico de 60h para **3-5 horas**, usando IA + algoritmos para:
- Estruturar entrevistas de processos
- Calcular ROI automaticamente
- Gerar precificação inteligente baseada em valor
- Criar propostas comerciais prontas para venda

### Impacto Financeiro
- **Capacidade:** 1 diagnóstico/mês → 10 diagnósticos/mês
- **Receita/Cliente Ano 1:** R$ 79-180k (implementação + consultoria + SaaS)
- **Margem:** 65-70%
- **Payback Cliente:** 3-4 meses

### Defensabilidade (Moat)
1. **Dados Proprietários:** Após 50 diagnósticos, modelo aprende padrões por setor
2. **Precificação Algorítmica:** Elimina "chutômetro", garante margem
3. **Modelo Completo:** Não vende diagnóstico (commodity), vende transformação

---

## 🎯 VISÃO DO PRODUTO

### Posicionamento
"A plataforma que transforma consultores de automação em máquinas de vendas, diagnosticando empresas em 3h com a precisão de 60h."

### Proposta de Valor
**Para:** Consultores/Automatizadores que vendem soluções de IA/RPA
**Que:** Precisam diagnosticar processos rapidamente para vender implementação
**O ASE é:** Uma plataforma de diagnóstico assistido + precificação inteligente
**Que:** Reduz tempo 95%, aumenta taxa de conversão e garante margem
**Diferente de:** Ferramentas BPMN técnicas (Camunda) ou consultoria manual
**Nosso diferencial:** Combina velocidade (IA) + rigor (algoritmos) + dados proprietários

---

## 🔴 PROBLEMA DETALHADO

### Dor Principal
**"Diagnosticar lentamente = vender lentamente = não escalo meu negócio"**

### Situação Atual (As-Is)

**Diagnóstico Manual (60h):**
1. Reuniões longas com stakeholders (8-10h)
2. Anotações desordenadas
3. Estruturação manual em casa (50h)
4. Desenho BPMN manual
5. Cálculo ROI em Excel
6. Precificação baseada em "feeling"
7. Apresentação em PDF

**Problemas:**
- ❌ Lento (60h por cliente)
- ❌ Não estruturado (depende expertise)
- ❌ Cliente confuso (símbolos BPMN técnicos)
- ❌ Precificação inconsistente (margem varia 30-80%)
- ❌ Baixa conversão (falta rigor nos números)
- ❌ Não escala (limitado a 1-2 diagnósticos/mês)

### Ferramentas Atuais (Inadequadas)

| Ferramenta | Problema | Por que não serve |
|:-----------|:---------|:-----------------|
| **Camunda/Lucidchart** | Muito técnica | Cliente não entende BPMN, lento para desenhar |
| **Planilhas Excel** | Manual, fragmentado | Sem automação, propenso a erro |
| **Consultores Jr** | Caro, não escala | Salário alto, turnover, margem zero |
| **ChatGPT** | Genérico, sem dados | Não tem benchmarks reais, alucina ROI |

### Impacto Financeiro do Problema

**Capacidade Atual:**
- 1 diagnóstico/mês × R$ 75k médio = R$ 75k/mês
- R$ 900k/ano (teto individual)

**Oportunidade Perdida:**
- Se conseguisse fazer 10 diagnósticos/mês = R$ 750k/mês
- R$ 9M/ano potencial
- **GAP: R$ 8.1M/ano deixados na mesa**

---

## ✅ SOLUÇÃO PROPOSTA

### Visão Geral
**Sistema híbrido (Humano + IA + Algoritmos)** que transforma diagnóstico artesanal em processo industrial:

```
INPUT (Humano) → PROCESSAMENTO (IA + Algoritmos) → OUTPUT (Proposta de Venda)
     ↓                        ↓                              ↓
Wizard estruturado    ROI automático              Dashboard visual
Entrevista 3-5h      Precificação algorítmica     PDF proposta
Templates/setor      Sugestões IA                 Roadmap implementação
```

### Fluxo de Uso (User Journey)

**ANTES da visita (15 min):**
1. Consultor cria novo diagnóstico no sistema
2. Seleciona setor da empresa (Indústria/Varejo/Serviços)
3. Sistema carrega template de perguntas

**DURANTE visita (3-5h):**
1. Consultor entrevista cliente usando wizard
2. Registra processos/gargalos (nome, tempo, custo, dor)
3. Insere dados da empresa (faturamento, funcionários)
4. Sistema calcula ROI em tempo real
5. Sistema sugere preço baseado em algoritmo
6. Consultor apresenta dashboard visual ao cliente
7. Gera PDF proposta na hora

**DEPOIS da visita (0h):**
- Sistema salva dados estruturados (data moat)
- Aprende padrões por setor
- Benchmark para próximos diagnósticos

### Resultado Final
- ✅ Diagnóstico em 3-5h (vs. 60h)
- ✅ Cliente impressionado (velocidade + rigor)
- ✅ Precificação justa (algoritmo, não "chute")
- ✅ Proposta pronta (PDF + roadmap)
- ✅ Taxa conversão 70%+ (vs. 30-40% manual)
- ✅ Dados coletados (moat proprietário)

---

## 🏗️ ARQUITETURA DO PRODUTO

### Conceitual (3 Camadas)

```markdown
┌─────────────────────────────────────────────────────┐
│ CAMADA 1: INPUT CONTROLADO (Wizard)                │
│ - Formulários estruturados por setor               │
│ - Validação de campos obrigatórios                 │
│ - Templates de perguntas                           │
│ - Transcrição de áudio (opcional)                  │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ CAMADA 2: CORE ENGINE (Híbrido)                    │
│ ┌─────────────────┐  ┌──────────────────┐          │
│ │ LÓGICA RÍGIDA   │  │ LÓGICA FLEXÍVEL  │          │
│ │ (Sem IA)        │  │ (Com IA)         │          │
│ ├─────────────────┤  ├──────────────────┤          │
│ │ • ROI automático│  │ • Sugestão de    │          │
│ │ • Precificação  │  │   solução        │          │
│ │ • Payback       │  │ • Análise de     │          │
│ │ • Complexidade  │  │   contexto       │          │
│ └─────────────────┘  └──────────────────┘          │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ CAMADA 3: OUTPUT PERSUASIVO                         │
│ - Dashboard visual (gráficos verde/vermelho)        │
│ - PDF proposta comercial                            │
│ - Roadmap de implementação                          │
│ - Simulador interativo (e se... então...)           │
└─────────────────────────────────────────────────────┘
```

### Por que Híbrido?

**IA é RUIM para:**
- Fazer contas (alucina números)
- Seguir regras rígidas (inconsistente)
- Precificação (não entende margem)

**IA é BOA para:**
- Análise de texto qualitativo
- Sugestão de soluções técnicas
- Classificação de complexidade

**Algoritmos são BONS para:**
- Cálculos matemáticos (ROI, payback)
- Precificação consistente
- Validação de regras de negócio

**Solução:** IA faz o criativo, algoritmos fazem o crítico.

---

## 🎯 OBJETIVOS & MÉTRICAS

### Objetivos Estratégicos

| Objetivo | Métrica | Meta | Prazo |
|:---------|:--------|:-----|:------|
| **Reduzir tempo diagnóstico** | Horas por diagnóstico | < 5h | MVP |
| **Aumentar conversão** | Taxa fechamento | > 70% | 3 meses |
| **Escalar capacidade** | Diagnósticos/mês | 10+ | 6 meses |
| **Margem previsível** | Variação de margem | ± 5% | MVP |
| **Data moat** | Diagnósticos no banco | 50+ | 6 meses |

### KPIs do Produto (Métricas Técnicas)

**Eficiência:**
- Tempo médio de diagnóstico: < 4h
- Tempo geração de proposta: < 2 min
- Tempo cálculo ROI: < 200ms

**Qualidade:**
- Acurácia ROI (real vs. estimado): > 85%
- Taxa de ajuste manual de preço: < 20%
- NPS dos consultores: > 8

**Adoção:**
- Diagnósticos por usuário/mês: > 5
- Taxa de uso do módulo precificação: > 90%
- Taxa de geração de PDF: > 95%

---

## 🧩 MÓDULOS FUNCIONAIS

### MÓDULO 1: WIZARD DE COLETA (Input)

**Objetivo:** Estruturar a entrevista para coletar dados de qualidade

**Features:**

**FR-001: Seleção de Contexto**
- Usuário seleciona setor: Indústria, Varejo, Serviços, Logística, Outro
- Sistema carrega template de perguntas específico
- Campos pré-configurados por setor

**FR-002: Cadastro de Empresa**
- Dados básicos: Nome, CNPJ, Setor, Localização
- Dados financeiros: Faturamento anual (range), Nº funcionários
- Dados técnicos: Maturidade tecnológica (Baixa/Média/Alta), TI interno (Sim/Não)
- Urgência: Baixa/Média/Alta

**FR-003: Cadastro de Processos/Gargalos**
- Interface "Adicionar Processo" (múltiplos)
- Campos obrigatórios por processo:
  - Nome da tarefa (ex: "Emissão de NF")
  - Descrição detalhada (texto livre)
  - Tempo por execução (minutos/horas)
  - Frequência (diária/semanal/mensal)
  - FTEs envolvidos (quantas pessoas)
  - Salário médio mensal (R$)
  - Ferramentas atuais (lista de sistemas usados)
  - Dor qualitativa (texto/áudio transcrito)

**FR-004: Transcrição de Áudio (Opcional MVP v2)**
- Botão "Gravar" durante entrevista
- Transcrição automática via Whisper API
- Extração de entidades (tempo, custo, dor)

**UX:**
- Design tipo "conversa" (não formulário chato)
- Progress bar (Passo 1/5)
- Salvamento automático a cada campo
- Validações em tempo real

---

### MÓDULO 2: ENGINE DE CÁLCULO (Core)

**Objetivo:** Calcular ROI e Preço com precisão matemática

#### 2A. CALCULADORA DE ROI (LÓGICA RÍGIDA - SEM IA)

**FR-005: Cálculo Automático de ROI**

Fórmulas implementadas:

```python
# Por Processo
custo_hora = salario_mensal / 160  # 160h úteis/mês
tempo_mensal = tempo_execucao * frequencia_mensal
custo_mensal_atual = (tempo_mensal / 60) * custo_hora * ftes

# Economia estimada (% padrão por tipo automação)
reducao_percentual = 0.80  # 80% para RPA simples
economia_mensal = custo_mensal_atual * reducao_percentual
economia_anual = economia_mensal * 12

# ROI Total
roi_total_anual = sum(economia_anual de todos os processos)
```

**Importante:** IA NÃO faz essa conta. Código Python/JS faz.

**FR-006: Classificação de Complexidade**

Sistema calcula automaticamente:

```python
# Inputs
num_sistemas = len(sistemas_integrados)
maturidade_tech = empresa.maturidade  # 0-10
tipo_automacao = processo.tipo  # RPA/IA/Híbrido

# Cálculo
if num_sistemas == 1 and maturidade_tech >= 7:
    complexidade = "Simples"
    multiplicador = 1.0
elif num_sistemas <= 3 and maturidade_tech >= 5:
    complexidade = "Média"
    multiplicador = 1.3
else:
    complexidade = "Alta"
    multiplicador = 1.6
```

#### 2B. MÓDULO DE PRECIFICAÇÃO INTELIGENTE

**FR-007: Matriz de Precificação Algorítmica**

**VARIÁVEL 1: ROI POTENCIAL (Peso: 50%)**

```python
# Tabela de % por faixa
def calcular_percentual_roi(roi_anual):
    if roi_anual < 30000:
        return 0.15  # 15%
    elif roi_anual < 100000:
        return 0.20  # 20%
    elif roi_anual < 300000:
        return 0.25  # 25%
    elif roi_anual < 1000000:
        return 0.30  # 30%
    else:
        return 0.35  # 35%

base_price = roi_total_anual * calcular_percentual_roi(roi_total_anual)
```

**VARIÁVEL 2: TAMANHO/PORTE EMPRESA (Peso: 30%)**

```python
def multiplicador_porte(faturamento_anual):
    if faturamento_anual < 5_000_000:
        return 0.8  # Micro
    elif faturamento_anual < 20_000_000:
        return 1.0  # PME pequena (baseline)
    elif faturamento_anual < 100_000_000:
        return 1.2  # PME média
    elif faturamento_anual < 1_000_000_000:
        return 1.5  # Grande
    else:
        return 2.0  # Multinacional
```

**VARIÁVEL 3: COMPLEXIDADE TÉCNICA (Peso: 20%)**

```python
def multiplicador_complexidade(num_sistemas, tipo_automacao):
    if num_sistemas == 1 and tipo_automacao == "RPA":
        return 1.0  # Simples
    elif num_sistemas <= 3:
        return 1.3  # Média
    elif num_sistemas <= 5:
        return 1.6  # Alta
    else:
        return 2.0  # Muito alta (IA avançada)
```

**FÓRMULA FINAL:**

```python
# Cálculo base
preco_base = roi_total_anual * percentual_roi

# Ajustes
preco_ajustado = preco_base * multiplicador_porte * multiplicador_complexidade

# Fatores extras (opcionais)
if urgencia == "Alta":
    preco_ajustado *= 1.10  # +10%
if suporte_interno == "Não":
    preco_ajustado *= 1.15  # +15%
if missao_critica:
    preco_ajustado *= 1.20  # +20%

preco_final_sugerido = preco_ajustado
```

**FR-008: Payback Automático**

```python
payback_meses = preco_final / (economia_anual / 12)
```

**FR-009: Override Manual**
- Consultor pode ajustar preço manualmente
- Sistema registra: preço_sugerido vs. preço_final
- Aprendizado: quais ajustes são comuns?

#### 2C. IA PARA SUGESTÕES (LÓGICA FLEXÍVEL)

**FR-010: Sugestão de Solução Técnica**

Prompt para LLM:

```
CONTEXTO:
- Empresa: {setor}, {faturamento}, {maturidade_tech}
- Processo: {nome_processo}
- Descrição: {descricao_detalhada}
- Ferramentas atuais: {ferramentas}
- Tempo gasto: {tempo}
- Dor: {dor_qualitativa}

TAREFA:
Sugira a solução técnica ideal para automatizar este processo.

FORMATO DE RESPOSTA (JSON):
{
  "solucao_recomendada": "string (ex: RPA com n8n + OCR)",
  "justificativa": "string (1-2 frases)",
  "nivel_dificuldade": "Baixo|Médio|Alto",
  "tempo_implementacao_estimado": "string (ex: 2-3 meses)",
  "tecnologias_sugeridas": ["tech1", "tech2"],
  "risco_implementacao": "Baixo|Médio|Alto"
}
```

**Importante:** IA sugere, mas não calcula preço ou ROI.

---

### MÓDULO 3: DASHBOARD & OUTPUT (Venda)

**Objetivo:** Apresentar resultados de forma visual e persuasiva

**FR-011: Dashboard de Apresentação (Real-time)**

Tela para mostrar AO CLIENTE durante visita:

**Elementos visuais:**

1. **Hero Card: "Dinheiro Perdido"**
   - Número grande vermelho: "R$ 127.450/ano"
   - Subtitle: "Desperdiçados em processos manuais"

2. **Gráfico de Pizza: Distribuição de Custos**
   - Por processo (cores diferentes)
   - Hover mostra detalhes

3. **Gráfico de Barra: Economia Potencial**
   - Antes (vermelho) vs. Depois (verde)
   - Por processo

4. **Timeline: Payback**
   - Linha do tempo visual
   - "Você recupera investimento em X meses"

5. **Tabela: Roadmap de Implementação**
   - Fase 1, 2, 3
   - Tempo estimado
   - ROI incremental

**FR-012: Simulador Interativo (Efeito "Wow")**
- Sliders para ajustar variáveis:
  - "E se o salário for R$ 6k em vez de R$ 4k?"
  - "E se a frequência for diária em vez de semanal?"
- Gráficos atualizam em tempo real
- Cliente vê impacto de mudanças

**FR-013: Gerador de Proposta (PDF)**

Botão: "Gerar Proposta Comercial"

**Estrutura do PDF:**

```markdown
# PROPOSTA COMERCIAL DE AUTOMAÇÃO
# [Nome da Empresa]

## EXECUTIVE SUMMARY
- ROI Total Identificado: R$ X/ano
- Investimento: R$ Y
- Payback: Z meses
- ROI Ano 1: W%

## DIAGNÓSTICO DE PROCESSOS
### Processo 1: [Nome]
- Situação atual: [descrição]
- Tempo gasto: Xh/mês
- Custo atual: R$ Y/mês
- Solução proposta: [tech]
- Economia: R$ Z/mês

[Repete para todos os processos]

## ROADMAP DE IMPLEMENTAÇÃO
### Fase 1 (Mês 1-2): Quick Wins
- Processos: A, B
- ROI: R$ X

### Fase 2 (Mês 3-4): Core
- Processos: C, D
- ROI: R$ Y

### Fase 3 (Mês 5-6): Otimização
- Processos: E, F
- ROI: R$ Z

## INVESTIMENTO & ROI
- Diagnóstico: R$ 0 (cortesia)
- Implementação: R$ X
- Consultoria/Treinamento: R$ Y
- SaaS (12 meses): R$ Z/mês
**TOTAL ANO 1: R$ W**

**ECONOMIA ANO 1: R$ V**
**GANHO LÍQUIDO: R$ (V - W)**

## PRÓXIMOS PASSOS
1. Aprovação da proposta
2. Kick-off (Semana 1)
3. Go-live Fase 1 (Mês 2)

---
Proposta válida por 30 dias.
Gerado por: [Consultor]
Data: [hoje]
```

**Design:** PDF profissional, marca da consultoria, gráficos incluídos.

---

## 💾 DADOS & APRENDIZADO (Data Moat)

### Estratégia de Coleta

**FR-014: Salvamento Estruturado**

Cada diagnóstico finalizado salva:

```json
{
  "diagnostico_id": "uuid",
  "data": "2026-01-24",
  "empresa": {
    "setor": "Indústria",
    "faturamento_range": "R$ 20-100M",
    "funcionarios": 250,
    "maturidade_tech": "Média"
  },
  "processos": [
    {
      "nome": "Processamento pedidos",
      "tempo_mensal": 120,
      "custo_mensal": 4000,
      "economia_real": null,  // preenchido após implementação
      "solucao_implementada": null
    }
  ],
  "roi_estimado": 67000,
  "roi_real": null,  // preenchido 6 meses depois
  "preco_cobrado": 21000,
  "converteu": true,
  "feedback_cliente": "..."
}
```

### Aprendizado Contínuo

**Após 50 diagnósticos:**

```python
# Sistema aprende padrões
benchmark = {
    "setor": "Indústria",
    "processo_tipo": "Contas a Pagar",
    "custo_medio": 3800,
    "tempo_medio": 95,
    "taxa_reducao_real": 0.78  # vs. 0.80 estimado
}
```

**Features Futuras (v2):**
- "Empresas do seu setor gastam em média R$ X neste processo"
- "Sua previsão de ROI tem 92% de acurácia"
- Ajuste automático de % de redução por histórico

### Privacidade

- Dados anonimizados para benchmark
- Nome/CNPJ não entra em modelo público
- APIs com "Zero Retention" configurado

---

## 🎨 UX & DESIGN GUIDELINES

### Princípios de Design

1. **Consultoria Premium**
   - Cores: Azul escuro (#1E3A8A), Verde (#10B981), Vermelho (#EF4444)
   - Tipografia: Inter/Geist (moderna, limpa)
   - Muito espaço em branco

2. **Números Chamam Atenção**
   - Valores monetários: Grandes, bold, coloridos
   - Verde = Economia/Ganho
   - Vermelho = Desperdício/Custo

3. **Wizard Como Conversa**
   - Não parecer formulário da Receita
   - Perguntas em sequência lógica
   - Progress bar visível

4. **Dashboard Persuasivo**
   - Gráficos > Tabelas
   - Visual > Texto
   - Interatividade (hover, click)

### Componentes UI (ShadCN/UI)

```
- Card (para hero numbers)
- Chart (recharts para gráficos)
- Table (para roadmap)
- Slider (para simulador)
- Button (CTA: "Gerar Proposta")
- Form (wizard inputs)
- Select (dropdowns)
- Textarea (descrições)
```

### Responsividade

- **Desktop:** Layout principal (consultor no escritório)
- **Tablet:** Otimizado (consultor em campo com iPad)
- **Mobile:** Visualização apenas (cliente vê PDF depois)

---

## 🔧 STACK TECNOLÓGICA

### Frontend
- **Framework:** Next.js 15 (App Router)
- **UI Library:** ShadCN/UI + TailwindCSS
- **Charts:** Recharts ou Chart.js
- **Forms:** React Hook Form + Zod (validação)
- **State:** Zustand (leve) ou Context API

### Backend
- **API:** Next.js API Routes ou FastAPI (Python)
- **Database:** Supabase (PostgreSQL + Auth + Storage)
- **IA:** OpenAI API (GPT-4o) ou Anthropic (Claude 3.5 Sonnet)
- **PDF:** React-PDF ou Puppeteer

### Infraestrutura
- **Hosting:** Vercel (Next.js) ou Railway
- **Database:** Supabase (já inclui auth, storage, realtime)
- **CDN:** Cloudflare (se imagens/assets pesados)
- **Monitoring:** Sentry (errors) + Vercel Analytics

### DevOps
- **Git:** GitHub
- **CI/CD:** Vercel auto-deploy ou GitHub Actions
- **Ambiente:** Dev, Staging, Production

---

## 📊 MODELO DE NEGÓCIO

### Pricing (Para o Consultor - B2B)

**Opção 1: SaaS Mensal**
- R$ 297/mês (até 10 diagnósticos)
- R$ 497/mês (ilimitado + features avançadas)

**Opção 2: Pay-per-Use**
- R$ 49 por diagnóstico gerado
- Sem mensalidade

**Opção 3: Licença Anual**
- R$ 2.997/ano (desconto 16%)
- Inclui suporte prioritário

**Recomendado MVP:** Opção 1 (R$ 297/mês) - previsível, simples.

### Modelo de Receita do Consultor (Cliente Final)

Como o consultor ganha dinheiro USANDO o produto:

**Fase 1: Diagnóstico (Semana 1)**
- Receita: R$ 0 (grátis para cliente)
- Custo ferramenta: R$ 297/mês
- Resultado: Proposta de implementação

**Fase 2: Implementação (Mês 2-4)**
- Receita: R$ 50-100k
- Margem: 60-70%
- Lucro: R$ 30-70k

**Fase 3: Consultoria (Mês 4-6)**
- Receita: R$ 5-20k
- Margem: 80%
- Lucro: R$ 4-16k

**Fase 4: SaaS Recorrente (Mês 6+)**
- Receita: R$ 2-5k/mês × 12 = R$ 24-60k/ano
- Margem: 90%
- Lucro: R$ 21-54k/ano

**Total Ano 1 por Cliente:** R$ 79-180k
**Custo Ferramenta Ano 1:** R$ 3.564
**ROI Ferramenta:** 22x - 50x

---

## 🗺️ ROADMAP DE DESENVOLVIMENTO

### FASE 1: MVP (2-3 meses)

**Sprint 1-2: Fundação (4 semanas)**
- Setup projeto Next.js + Supabase
- Autenticação (login/cadastro)
- Database schema
- Layout base (sidebar, header)

**Sprint 3-4: Wizard de Coleta (4 semanas)**
- Formulários dinâmicos
- Seleção de setor + templates
- Cadastro de processos
- Salvamento no banco

**Sprint 5-6: Engine de Cálculo (3 semanas)**
- Implementar fórmulas ROI
- Algoritmo de precificação
- Integração com IA (sugestões)
- Testes unitários

**Sprint 7-8: Dashboard & Output (3 semanas)**
- Gráficos (recharts)
- Gerador de PDF
- Simulador interativo
- Testes E2E

**Sprint 9: Polish & Launch (1 semana)**
- Bug fixes
- Documentação
- Deploy production
- Onboarding de 3 beta users

**Entrega MVP:** Produto funcional, 3 consultores usando, 10+ diagnósticos feitos.

### FASE 2: Growth (6-12 meses)

**Features:**
- Integração com CRMs (Pipedrive, HubSpot)
- Templates personalizáveis por consultor
- Multi-idioma (EN, ES)
- White-label (marca do consultor)
- Histórico comparativo (diagnóstico A vs B)

**Data Moat:**
- Atingir 50 diagnósticos
- Benchmarks por setor
- Predição de ROI com ML

### FASE 3: Scale (12-24 meses)

**Plataforma:**
- Marketplace de consultores
- API pública (integrações)
- Mobile app (iOS/Android)
- Integrações diretas com ERPs (SAP, Odoo)

**Enterprise:**
- SSO (SAML)
- White-label completo
- Consultoria dedicada
- SLA 99.9%

---

## 🎯 MÉTRICAS DE SUCESSO

### Métricas de Produto (3 meses)

| Métrica | Target | Como Medir |
|:--------|:-------|:-----------|
| **Diagnósticos criados** | 50+ | Count no DB |
| **Tempo médio diagnóstico** | < 5h | Timestamp início/fim |
| **Taxa conversão (diagnóstico → venda)** | > 60% | Campo "converteu" |
| **NPS consultores** | > 8 | Survey mensal |
| **Churn mensal** | < 5% | Cancelamentos/mês |

### Métricas de Negócio (6 meses)

| Métrica | Target |
|:--------|:-------|
| **MRR** | R$ 15k+ (50 consultores × R$ 297) |
| **CAC** | < R$ 500 |
| **LTV** | > R$ 10k (34 meses médio) |
| **LTV/CAC** | > 20x |

---

## 🚨 RISCOS & MITIGAÇÕES

### Risco 1: IA Alucina Números

**Probabilidade:** Alta
**Impacto:** Crítico (perde confiança)
**Mitigação:**
- ✅ IA NÃO faz cálculos matemáticos
- ✅ Algoritmos fazem ROI/Preço
- ✅ IA só sugere soluções qualitativas

### Risco 2: Commoditização (Concorrente Copia em 6 Meses)

**Probabilidade:** Média
**Impacto:** Alto
**Mitigação:**
- ✅ Data moat (50 diagnósticos ASAP)
- ✅ Não vende diagnóstico, vende transformação
- ✅ Relacionamento > Ferramenta

### Risco 3: Consultores Não Adotam (Change Management)

**Probabilidade:** Média
**Impacto:** Crítico
**Mitigação:**
- ✅ Onboarding guiado (1-on-1)
- ✅ Templates prontos (facilitam adoção)
- ✅ ROI claro (ganham tempo/dinheiro)
- ✅ Trial gratuito 14 dias

### Risco 4: Precificação Baixa (Consultores Não Confiam)

**Probabilidade:** Baixa
**Impacão:** Médio
**Mitigação:**
- ✅ Override manual permitido
- ✅ Transparência (mostrar fórmula)
- ✅ Benchmarks (após 50 diagnósticos)

---

## 📚 APÊNDICES

### A. Glossário

- **ROI:** Return on Investment (Retorno sobre Investimento)
- **FTE:** Full-Time Equivalent (Funcionário equivalente tempo integral)
- **Moat:** Barreira competitiva (vantagem difícil de copiar)
- **Data Moat:** Defensabilidade via dados proprietários
- **Wizard:** Interface guiada passo-a-passo
- **Payback:** Tempo para recuperar investimento

### B. Benchmarks de Mercado

**Ferramentas Similares:**
- Camunda: $0 (open source) + enterprise $$$
- Lucidchart: $7.95/usuário/mês
- Process Street: $25/usuário/mês

**Nosso Posicionamento:** Premium ($297/mês) justificado por ROI (ferramenta gera R$ 30-100k por venda).

### C. Stack Detalhado

```yaml
Frontend:
  framework: Next.js 15
  ui: ShadCN/UI + TailwindCSS
  forms: React Hook Form + Zod
  charts: Recharts
  state: Zustand

Backend:
  api: Next.js API Routes
  database: Supabase (PostgreSQL)
  auth: Supabase Auth
  storage: Supabase Storage

AI/ML:
  llm: OpenAI GPT-4o
  fallback: Anthropic Claude 3.5

DevOps:
  hosting: Vercel
  ci_cd: Vercel auto-deploy
  monitoring: Sentry
  analytics: Vercel Analytics
```

---

## ✅ APROVAÇÕES

**Product Owner:** [Nome]
**Tech Lead:** [Nome]
**Stakeholders:** eximIA Ventures
**Data Aprovação:** 24/01/2026
**Próximo Milestone:** Kick-off Sprint 1 (Semana de 27/01/2026)

---

**FIM DO PRD**

Este documento é a fonte única de verdade (Single Source of Truth) para o desenvolvimento do **Automator Sales Engine**. Todas as decisões técnicas e de produto devem referenciar este PRD.

**Versão:** 1.0
**Última Atualização:** 24/01/2026
**Mantenedor:** eximIA Ventures
