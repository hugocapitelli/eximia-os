# DOSSIÊ COMPLETO DO BANCO DE DADOS
## Projeto: Agenda Cheia - CRM Inteligente para Salões de Beleza

**Versão:** 1.0
**Data:** 26 de Janeiro de 2026
**Autor:** Arquitetura de Dados
**Status:** Aprovado para Implementação

---

## SUMÁRIO

1. [Visão Geral do Projeto](#1-visão-geral-do-projeto)
2. [Arquitetura de Dados](#2-arquitetura-de-dados)
3. [Modelo Conceitual](#3-modelo-conceitual)
4. [Modelo Lógico - Especificação de Tabelas](#4-modelo-lógico---especificação-de-tabelas)
5. [Tipos Enumerados (ENUM)](#5-tipos-enumerados-enum)
6. [Relacionamentos e Cardinalidade](#6-relacionamentos-e-cardinalidade)
7. [Índices e Performance](#7-índices-e-performance)
8. [Constraints e Validações](#8-constraints-e-validações)
9. [Regras de Negócio](#9-regras-de-negócio)
10. [DDL Completo - PostgreSQL](#10-ddl-completo---postgresql)
11. [Estratégias de Escalabilidade](#11-estratégias-de-escalabilidade)
12. [Guia de Implementação](#12-guia-de-implementação)
13. [Apêndices](#13-apêndices)

---

## 1. VISÃO GERAL DO PROJETO

### 1.1 Descrição do Sistema

O **Agenda Cheia** é um CRM inteligente desenvolvido para salões de beleza, oferecendo:

- **Gestão de Clientes:** Cadastro, histórico, segmentação por status
- **Agendamento Inteligente:** Algoritmo de sugestão de horários com aprovação (Lazy Sync)
- **Automação via IA:** Assistente virtual para WhatsApp com personalidade configurável
- **Campanhas de Reativação:** Marketing automatizado baseado em ciclos de retorno
- **Multi-profissionais:** Gestão de equipe com agendas e regras individuais
- **Multi-tenancy:** Arquitetura preparada para múltiplos salões

### 1.2 Stack Tecnológico Recomendado

| Camada | Tecnologia |
|--------|------------|
| Banco de Dados | PostgreSQL 15+ |
| Cache | Redis |
| ORM | Prisma / Drizzle / TypeORM |
| Backend | Node.js / Next.js API Routes |
| Frontend | React 19 + TypeScript |

### 1.3 Requisitos de Dados

**Volume Estimado (por tenant/salão):**
- Clientes: 500 - 5.000
- Agendamentos/mês: 300 - 3.000
- Mensagens/mês: 2.000 - 20.000
- Profissionais: 1 - 20
- Serviços: 10 - 50

**Volume Global (100 tenants em 3 anos):**
- Clientes totais: ~500.000
- Agendamentos/mês: ~300.000
- Mensagens/mês: ~2.000.000

---

## 2. ARQUITETURA DE DADOS

### 2.1 Princípios Arquiteturais

1. **Multi-tenancy:** Isolamento por `tenant_id` em todas as tabelas core
2. **Auditoria:** Campos `created_at` e `updated_at` em todas as tabelas
3. **Soft Delete:** Via campo `is_active` ou `status` quando apropriado
4. **UUID como PK:** Permite geração distribuída e merge de dados
5. **Normalização 3FN:** Mínimo de redundância, máxima integridade
6. **Snapshots para Histórico:** Dados imutáveis em transações (preço, duração)

### 2.2 Diagrama de Contexto

```
┌─────────────────────────────────────────────────────────────────────┐
│                         AGENDA CHEIA                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   ┌─────────────┐                              ┌─────────────┐      │
│   │   TENANT    │◄─────────────────────────────│    USER     │      │
│   │   (Salão)   │                              │   (Login)   │      │
│   └──────┬──────┘                              └─────────────┘      │
│          │                                                          │
│          │ owns                                                     │
│          ▼                                                          │
│   ┌──────────────────────────────────────────────────────────┐     │
│   │                    CORE DOMAIN                            │     │
│   │  ┌───────────┐  ┌───────────┐  ┌───────────┐             │     │
│   │  │PROFESSIONAL│  │  SERVICE  │  │  CLIENT   │             │     │
│   │  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘             │     │
│   │        │              │              │                    │     │
│   │        └──────────────┼──────────────┘                    │     │
│   │                       ▼                                   │     │
│   │               ┌─────────────┐                             │     │
│   │               │ APPOINTMENT │                             │     │
│   │               └─────────────┘                             │     │
│   └──────────────────────────────────────────────────────────┘     │
│                                                                      │
│   ┌─────────────────────┐          ┌─────────────────────┐         │
│   │   CAMPAIGN MODULE   │          │    CHAT MODULE      │         │
│   │  ┌───────────────┐  │          │  ┌───────────────┐  │         │
│   │  │   CAMPAIGN    │  │          │  │ CONVERSATION  │  │         │
│   │  │               │  │          │  │               │  │         │
│   │  │ CAMPAIGN_     │  │          │  │   MESSAGE     │  │         │
│   │  │ TARGET        │  │          │  └───────────────┘  │         │
│   │  └───────────────┘  │          └─────────────────────┘         │
│   └─────────────────────┘                                           │
│                                                                      │
│   ┌─────────────────────────────────────────────────────────┐      │
│   │                 CONFIGURATION MODULE                     │      │
│   │  TENANT_SCHEDULE | PROFESSIONAL_SCHEDULE | AI_CONFIG    │      │
│   │  PROFESSIONAL_RULE | CLOSED_DATE | TIME_OFF             │      │
│   └─────────────────────────────────────────────────────────┘      │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.3 Categorização das Entidades

| Categoria | Entidades | Quantidade |
|-----------|-----------|------------|
| **Core Domain** | Tenant, User, Professional, Service, Client, Appointment | 6 |
| **Campaign Module** | Campaign, CampaignTarget | 2 |
| **Chat Module** | Conversation, Message | 2 |
| **Configuration** | TenantSchedule, ProfessionalSchedule, ProfessionalTimeOff, ProfessionalRule, ProfessionalServiceRestriction, AIConfig, ClosedDate | 7 |
| **Junction Tables** | ProfessionalService, ClientServiceInterest | 2 |
| **TOTAL** | | **19 tabelas** |

---

## 3. MODELO CONCEITUAL

### 3.1 Entidades de Domínio Principal

#### TENANT (Salão/Organização)
- **Propósito:** Representa o salão de beleza como unidade de negócio
- **Responsabilidade:** Isolar dados entre diferentes salões (multi-tenancy)
- **Características:** Dados cadastrais, endereço, redes sociais, plano

#### USER (Usuário/Autenticação)
- **Propósito:** Gerenciar autenticação e autorização
- **Responsabilidade:** Login, permissões, sessões
- **Papéis:** owner (dono), stylist (profissional), admin

#### PROFESSIONAL (Profissional/Estilista)
- **Propósito:** Representa os prestadores de serviço
- **Responsabilidade:** Catálogo de serviços, agenda, regras de desconto
- **Relacionamentos:** Pertence a um tenant, oferece serviços, atende clientes

#### SERVICE (Serviço)
- **Propósito:** Catálogo de serviços oferecidos
- **Responsabilidade:** Definir preço, duração, ciclo de retorno
- **Uso:** Base para agendamentos e campanhas

#### CLIENT (Cliente)
- **Propósito:** Base de clientes do salão
- **Responsabilidade:** Histórico, preferências, status de relacionamento
- **Status:** active, lost, negotiating, blocked

#### APPOINTMENT (Agendamento)
- **Propósito:** Registro de atendimentos
- **Responsabilidade:** Conectar cliente + profissional + serviço + horário
- **Ciclo de Vida:** pending → confirmed → completed/cancelled/no_show

### 3.2 Entidades de Campanha

#### CAMPAIGN (Campanha de Marketing)
- **Propósito:** Reativação e engajamento de clientes
- **Tipos:**
  - `prazo_certo`: Dispara quando cliente atinge ciclo de retorno
  - `encher_agenda`: Ofertas para preencher horários vagos
  - `custom`: Campanhas personalizadas

#### CAMPAIGN_TARGET (Alvo da Campanha)
- **Propósito:** Rastrear cada cliente em cada campanha
- **Responsabilidade:** Status do envio, conversão, bloqueios

### 3.3 Entidades de Chat

#### CONVERSATION (Conversa WhatsApp)
- **Propósito:** Thread de conversa com cliente
- **Responsabilidade:** Controle de IA, histórico de interação
- **Relação:** 1:1 com Cliente (uma conversa ativa por cliente)

#### MESSAGE (Mensagem)
- **Propósito:** Registro individual de cada mensagem
- **Tipos de Remetente:** client, ai, human (atendente)

### 3.4 Entidades de Configuração

| Entidade | Propósito |
|----------|-----------|
| **TenantSchedule** | Horário de funcionamento do salão por dia da semana |
| **ProfessionalSchedule** | Horário de trabalho individual do profissional |
| **ProfessionalTimeOff** | Folgas, férias, ausências |
| **ProfessionalRule** | Regras de desconto (limite %, limite R$) |
| **ProfessionalServiceRestriction** | Serviços com restrição de desconto |
| **AIConfig** | Personalidade da IA (nome, tom, emojis) |
| **ClosedDate** | Feriados e datas fechadas |

---

## 4. MODELO LÓGICO - ESPECIFICAÇÃO DE TABELAS

### 4.1 TENANT

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PK | Identificador único |
| `name` | VARCHAR(200) | NOT NULL | Nome do salão |
| `cnpj` | VARCHAR(18) | UNIQUE, NULL | CNPJ (opcional) |
| `phone` | VARCHAR(20) | NOT NULL | WhatsApp principal |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Email de contato |
| `site` | VARCHAR(500) | NULL | Website |
| `instagram` | VARCHAR(100) | NULL | Handle Instagram |
| `tiktok` | VARCHAR(100) | NULL | Handle TikTok |
| `facebook` | VARCHAR(100) | NULL | Handle Facebook |
| `cep` | VARCHAR(9) | NOT NULL | CEP |
| `address` | VARCHAR(300) | NOT NULL | Logradouro |
| `number` | VARCHAR(20) | NOT NULL | Número |
| `complement` | VARCHAR(100) | NULL | Complemento |
| `neighborhood` | VARCHAR(100) | NOT NULL | Bairro |
| `city` | VARCHAR(100) | NOT NULL | Cidade |
| `state` | CHAR(2) | NOT NULL | UF |
| `status` | ENUM | NOT NULL, DEFAULT 'trial' | active, suspended, trial |
| `plan_type` | ENUM | NOT NULL, DEFAULT 'basic' | basic, pro, enterprise |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Data criação |
| `updated_at` | TIMESTAMPTZ | NOT NULL | Data atualização |

### 4.2 USER

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PK | Identificador único |
| `tenant_id` | UUID | FK → TENANT, NOT NULL | Salão |
| `email` | VARCHAR(255) | NOT NULL | Email de login |
| `password_hash` | VARCHAR(255) | NOT NULL | Senha hash (bcrypt) |
| `name` | VARCHAR(200) | NOT NULL | Nome completo |
| `role` | ENUM | NOT NULL | owner, stylist, admin |
| `professional_id` | UUID | FK → PROFESSIONAL, NULL | Link para profissional |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT TRUE | Usuário ativo |
| `last_login_at` | TIMESTAMPTZ | NULL | Último login |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Data criação |
| `updated_at` | TIMESTAMPTZ | NOT NULL | Data atualização |

**Constraints Especiais:**
- UNIQUE(tenant_id, email)

### 4.3 PROFESSIONAL

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PK | Identificador único |
| `tenant_id` | UUID | FK → TENANT, NOT NULL | Salão |
| `name` | VARCHAR(200) | NOT NULL | Nome completo |
| `email` | VARCHAR(255) | NULL | Email (opcional) |
| `phone` | VARCHAR(20) | NULL | Telefone (opcional) |
| `photo_url` | VARCHAR(500) | NULL | URL da foto |
| `bio` | TEXT | NULL | Biografia/descrição |
| `color` | CHAR(7) | NOT NULL, DEFAULT '#3B82F6' | Cor para UI (#RRGGBB) |
| `position` | VARCHAR(100) | NULL | Cargo/função |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT TRUE | Profissional ativo |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Data criação |
| `updated_at` | TIMESTAMPTZ | NOT NULL | Data atualização |

### 4.4 SERVICE

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PK | Identificador único |
| `tenant_id` | UUID | FK → TENANT, NOT NULL | Salão |
| `name` | VARCHAR(200) | NOT NULL | Nome do serviço |
| `duration_min` | SMALLINT | NOT NULL, CHECK > 0 | Duração em minutos |
| `price` | DECIMAL(10,2) | NOT NULL, CHECK >= 0 | Preço padrão |
| `return_cycle` | SMALLINT | NULL, CHECK > 0 | Dias para retorno (null = sem ciclo) |
| `description` | TEXT | NULL | Descrição do serviço |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT TRUE | Serviço ativo |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Data criação |
| `updated_at` | TIMESTAMPTZ | NOT NULL | Data atualização |

**Constraints Especiais:**
- UNIQUE(tenant_id, name)
- CHECK(duration_min > 0 AND duration_min <= 480)

### 4.5 PROFESSIONAL_SERVICE (Junction N:M)

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `professional_id` | UUID | PK, FK → PROFESSIONAL | Profissional |
| `service_id` | UUID | PK, FK → SERVICE | Serviço |
| `custom_price` | DECIMAL(10,2) | NULL | Preço customizado (null = usar padrão) |
| `custom_duration` | SMALLINT | NULL | Duração customizada |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Data criação |

**PK:** (professional_id, service_id)

### 4.6 CLIENT

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PK | Identificador único |
| `tenant_id` | UUID | FK → TENANT, NOT NULL | Salão |
| `name` | VARCHAR(200) | NOT NULL | Nome completo |
| `phone` | VARCHAR(20) | NOT NULL | Telefone/WhatsApp |
| `email` | VARCHAR(255) | NULL | Email |
| `status` | ENUM | NOT NULL, DEFAULT 'active' | active, lost, negotiating, blocked |
| `preferred_professional_id` | UUID | FK → PROFESSIONAL, NULL | Profissional preferido |
| `notes` | TEXT | NULL | Observações |
| `last_visit_at` | DATE | NULL | Data última visita |
| `total_spent` | DECIMAL(12,2) | NOT NULL, DEFAULT 0 | Cache: total gasto |
| `visit_count` | INTEGER | NOT NULL, DEFAULT 0 | Cache: número de visitas |
| `source` | ENUM | NOT NULL, DEFAULT 'manual' | manual, import, campaign, ai |
| `blocked_reason` | TEXT | NULL | Motivo do bloqueio |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Data criação |
| `updated_at` | TIMESTAMPTZ | NOT NULL | Data atualização |

**Constraints Especiais:**
- UNIQUE(tenant_id, phone)

### 4.7 CLIENT_SERVICE_INTEREST (Junction N:M)

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `client_id` | UUID | PK, FK → CLIENT | Cliente |
| `service_id` | UUID | PK, FK → SERVICE | Serviço de interesse |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Data criação |

**PK:** (client_id, service_id)

### 4.8 APPOINTMENT

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PK | Identificador único |
| `tenant_id` | UUID | FK → TENANT, NOT NULL | Salão |
| `client_id` | UUID | FK → CLIENT, NOT NULL | Cliente |
| `professional_id` | UUID | FK → PROFESSIONAL, NOT NULL | Profissional |
| `service_id` | UUID | FK → SERVICE, NOT NULL | Serviço |
| `scheduled_date` | DATE | NOT NULL | Data agendada |
| `scheduled_time` | TIME | NOT NULL | Horário agendado |
| `end_time` | TIME | NOT NULL | Horário término (calculado) |
| `duration_min` | SMALLINT | NOT NULL | Duração (snapshot) |
| `price` | DECIMAL(10,2) | NOT NULL | Preço original (snapshot) |
| `discount_amount` | DECIMAL(10,2) | NOT NULL, DEFAULT 0 | Valor desconto |
| `final_price` | DECIMAL(10,2) | GENERATED | Preço final (price - discount) |
| `status` | ENUM | NOT NULL, DEFAULT 'pending' | pending, confirmed, completed, cancelled, no_show |
| `source` | ENUM | NOT NULL, DEFAULT 'manual' | ai, manual, campaign, import |
| `notes` | TEXT | NULL | Observações |
| `campaign_id` | UUID | FK → CAMPAIGN, NULL | Campanha de origem |
| `confirmed_by` | UUID | FK → USER, NULL | Quem confirmou |
| `confirmed_at` | TIMESTAMPTZ | NULL | Quando confirmou |
| `completed_at` | TIMESTAMPTZ | NULL | Quando completou |
| `cancelled_at` | TIMESTAMPTZ | NULL | Quando cancelou |
| `cancellation_reason` | TEXT | NULL | Motivo cancelamento |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Data criação |
| `updated_at` | TIMESTAMPTZ | NOT NULL | Data atualização |

**Constraints Especiais:**
- CHECK(scheduled_time >= '07:00' AND scheduled_time <= '22:00')
- CHECK(discount_amount >= 0 AND discount_amount <= price)

### 4.9 CAMPAIGN

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PK | Identificador único |
| `tenant_id` | UUID | FK → TENANT, NOT NULL | Salão |
| `name` | VARCHAR(200) | NOT NULL | Nome da campanha |
| `type` | ENUM | NOT NULL | prazo_certo, encher_agenda, custom |
| `status` | ENUM | NOT NULL, DEFAULT 'draft' | draft, active, paused, completed |
| `target_service_id` | UUID | FK → SERVICE, NULL | Serviço alvo |
| `target_professional_id` | UUID | FK → PROFESSIONAL, NULL | Profissional alvo |
| `offer_type` | ENUM | NOT NULL | discount_percent, discount_fixed, bonus_service |
| `offer_value` | DECIMAL(10,2) | NULL | Valor do desconto |
| `bonus_service_id` | UUID | FK → SERVICE, NULL | Serviço bônus |
| `validity_days` | SMALLINT | NULL | Dias de validade da oferta |
| `days_threshold` | SMALLINT | NULL | Dias sem retorno (custom) |
| `message_template` | TEXT | NULL | Template da mensagem |
| `lgpd_confirmed` | BOOLEAN | NOT NULL, DEFAULT FALSE | Confirmação LGPD |
| `created_by` | UUID | FK → USER, NOT NULL | Quem criou |
| `started_at` | TIMESTAMPTZ | NULL | Quando iniciou |
| `completed_at` | TIMESTAMPTZ | NULL | Quando finalizou |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Data criação |
| `updated_at` | TIMESTAMPTZ | NOT NULL | Data atualização |

### 4.10 CAMPAIGN_TARGET

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PK | Identificador único |
| `campaign_id` | UUID | FK → CAMPAIGN, NOT NULL | Campanha |
| `client_id` | UUID | FK → CLIENT, NOT NULL | Cliente alvo |
| `status` | ENUM | NOT NULL, DEFAULT 'pending' | pending, sent, converted, cancelled, blocked |
| `sent_at` | TIMESTAMPTZ | NULL | Quando mensagem enviada |
| `opened_at` | TIMESTAMPTZ | NULL | Quando mensagem lida |
| `converted_at` | TIMESTAMPTZ | NULL | Quando converteu |
| `appointment_id` | UUID | FK → APPOINTMENT, NULL | Agendamento resultante |
| `failure_reason` | TEXT | NULL | Motivo de falha |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Data criação |
| `updated_at` | TIMESTAMPTZ | NOT NULL | Data atualização |

**Constraints Especiais:**
- UNIQUE(campaign_id, client_id)

### 4.11 CONVERSATION

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PK | Identificador único |
| `tenant_id` | UUID | FK → TENANT, NOT NULL | Salão |
| `client_id` | UUID | FK → CLIENT, NOT NULL | Cliente |
| `wa_chat_id` | VARCHAR(50) | NULL | ID do chat no WhatsApp |
| `is_ai_active` | BOOLEAN | NOT NULL, DEFAULT TRUE | IA ativa nesta conversa |
| `assumed_by` | UUID | FK → USER, NULL | Humano que assumiu |
| `assumed_at` | TIMESTAMPTZ | NULL | Quando humano assumiu |
| `campaign_id` | UUID | FK → CAMPAIGN, NULL | Campanha de origem |
| `last_message_at` | TIMESTAMPTZ | NULL | Cache: última mensagem |
| `last_message_preview` | VARCHAR(100) | NULL | Cache: preview última msg |
| `unread_count` | SMALLINT | NOT NULL, DEFAULT 0 | Cache: mensagens não lidas |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Data criação |
| `updated_at` | TIMESTAMPTZ | NOT NULL | Data atualização |

**Constraints Especiais:**
- UNIQUE(tenant_id, client_id)

### 4.12 MESSAGE

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PK | Identificador único |
| `conversation_id` | UUID | FK → CONVERSATION, NOT NULL | Conversa |
| `sender_type` | ENUM | NOT NULL | client, ai, human |
| `sender_user_id` | UUID | FK → USER, NULL | Usuário (se human) |
| `content` | TEXT | NOT NULL | Conteúdo da mensagem |
| `media_url` | VARCHAR(500) | NULL | URL de mídia |
| `media_type` | ENUM | NULL | image, audio, video, document |
| `wa_message_id` | VARCHAR(50) | NULL | ID da msg no WhatsApp |
| `is_read` | BOOLEAN | NOT NULL, DEFAULT FALSE | Mensagem lida |
| `sent_at` | TIMESTAMPTZ | NOT NULL | Quando enviada |
| `delivered_at` | TIMESTAMPTZ | NULL | Quando entregue |
| `read_at` | TIMESTAMPTZ | NULL | Quando lida |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Data criação |

### 4.13 TENANT_SCHEDULE

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PK | Identificador único |
| `tenant_id` | UUID | FK → TENANT, NOT NULL | Salão |
| `day_of_week` | SMALLINT | NOT NULL, CHECK 0-6 | Dia (0=domingo) |
| `is_open` | BOOLEAN | NOT NULL, DEFAULT TRUE | Salão aberto |
| `open_time` | TIME | NULL | Horário abertura |
| `close_time` | TIME | NULL | Horário fechamento |
| `break_start` | TIME | NULL | Início intervalo |
| `break_end` | TIME | NULL | Fim intervalo |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Data criação |
| `updated_at` | TIMESTAMPTZ | NOT NULL | Data atualização |

**Constraints Especiais:**
- UNIQUE(tenant_id, day_of_week)
- CHECK(day_of_week >= 0 AND day_of_week <= 6)
- CHECK(open_time < close_time OR NOT is_open)

### 4.14 PROFESSIONAL_SCHEDULE

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PK | Identificador único |
| `professional_id` | UUID | FK → PROFESSIONAL, NOT NULL | Profissional |
| `day_of_week` | SMALLINT | NOT NULL, CHECK 0-6 | Dia (0=domingo) |
| `is_working` | BOOLEAN | NOT NULL, DEFAULT TRUE | Trabalha neste dia |
| `start_time` | TIME | NULL | Horário início |
| `end_time` | TIME | NULL | Horário fim |
| `break_start` | TIME | NULL | Início intervalo |
| `break_end` | TIME | NULL | Fim intervalo |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Data criação |
| `updated_at` | TIMESTAMPTZ | NOT NULL | Data atualização |

**Constraints Especiais:**
- UNIQUE(professional_id, day_of_week)

### 4.15 PROFESSIONAL_TIME_OFF

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PK | Identificador único |
| `professional_id` | UUID | FK → PROFESSIONAL, NOT NULL | Profissional |
| `date` | DATE | NOT NULL | Data da folga |
| `reason` | VARCHAR(200) | NULL | Motivo |
| `is_full_day` | BOOLEAN | NOT NULL, DEFAULT TRUE | Dia inteiro |
| `start_time` | TIME | NULL | Início (se parcial) |
| `end_time` | TIME | NULL | Fim (se parcial) |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Data criação |

**Constraints Especiais:**
- UNIQUE(professional_id, date) quando is_full_day = TRUE

### 4.16 PROFESSIONAL_RULE

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PK | Identificador único |
| `professional_id` | UUID | FK → PROFESSIONAL, UNIQUE | Profissional |
| `discount_allowed` | BOOLEAN | NOT NULL, DEFAULT TRUE | Pode dar desconto |
| `max_discount_percent` | DECIMAL(5,2) | NULL | % máximo desconto |
| `max_discount_amount` | DECIMAL(10,2) | NULL | R$ máximo desconto |
| `requires_approval` | BOOLEAN | NOT NULL, DEFAULT FALSE | Requer aprovação |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Data criação |
| `updated_at` | TIMESTAMPTZ | NOT NULL | Data atualização |

**Constraints Especiais:**
- CHECK(max_discount_percent IS NULL OR (max_discount_percent >= 0 AND max_discount_percent <= 100))

### 4.17 PROFESSIONAL_SERVICE_RESTRICTION

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `professional_id` | UUID | PK, FK → PROFESSIONAL | Profissional |
| `service_id` | UUID | PK, FK → SERVICE | Serviço |
| `restriction_type` | ENUM | NOT NULL | no_discount, blocked |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Data criação |

**PK:** (professional_id, service_id)

### 4.18 AI_CONFIG

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PK | Identificador único |
| `tenant_id` | UUID | FK → TENANT, UNIQUE | Salão |
| `ai_name` | VARCHAR(50) | NOT NULL, DEFAULT 'Júlia' | Nome da assistente |
| `salon_description` | TEXT | NULL | Contexto para IA |
| `tone_of_voice` | ENUM | NOT NULL, DEFAULT 'amigavel' | profissional, amigavel, descontraido |
| `emoji_enabled` | BOOLEAN | NOT NULL, DEFAULT TRUE | Usar emojis |
| `emoji_quantity` | ENUM | NOT NULL, DEFAULT 'medio' | pouco, medio, muito |
| `global_ai_active` | BOOLEAN | NOT NULL, DEFAULT TRUE | IA globalmente ativa |
| `greeting_message` | TEXT | NULL | Mensagem de boas-vindas |
| `away_message` | TEXT | NULL | Mensagem fora do horário |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Data criação |
| `updated_at` | TIMESTAMPTZ | NOT NULL | Data atualização |

### 4.19 CLOSED_DATE

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | PK | Identificador único |
| `tenant_id` | UUID | FK → TENANT, NOT NULL | Salão |
| `date` | DATE | NOT NULL | Data fechada |
| `reason` | VARCHAR(200) | NULL | Motivo (feriado, evento) |
| `is_recurring` | BOOLEAN | NOT NULL, DEFAULT FALSE | Repete todo ano |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Data criação |

**Constraints Especiais:**
- UNIQUE(tenant_id, date)

---

## 5. TIPOS ENUMERADOS (ENUM)

### 5.1 Definição dos ENUMs

```sql
-- Status do Tenant
CREATE TYPE tenant_status AS ENUM ('active', 'suspended', 'trial');

-- Plano do Tenant
CREATE TYPE plan_type AS ENUM ('basic', 'pro', 'enterprise');

-- Papel do Usuário
CREATE TYPE user_role AS ENUM ('owner', 'stylist', 'admin');

-- Status do Cliente
CREATE TYPE client_status AS ENUM ('active', 'lost', 'negotiating', 'blocked');

-- Origem do Cliente/Appointment
CREATE TYPE record_source AS ENUM ('manual', 'import', 'campaign', 'ai');

-- Status do Agendamento
CREATE TYPE appointment_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'no_show');

-- Tipo de Campanha
CREATE TYPE campaign_type AS ENUM ('prazo_certo', 'encher_agenda', 'custom');

-- Status da Campanha
CREATE TYPE campaign_status AS ENUM ('draft', 'active', 'paused', 'completed');

-- Tipo de Oferta
CREATE TYPE offer_type AS ENUM ('discount_percent', 'discount_fixed', 'bonus_service');

-- Status do Alvo da Campanha
CREATE TYPE campaign_target_status AS ENUM ('pending', 'sent', 'converted', 'cancelled', 'blocked');

-- Tipo de Remetente da Mensagem
CREATE TYPE message_sender_type AS ENUM ('client', 'ai', 'human');

-- Tipo de Mídia
CREATE TYPE media_type AS ENUM ('image', 'audio', 'video', 'document');

-- Tom de Voz da IA
CREATE TYPE ai_tone AS ENUM ('profissional', 'amigavel', 'descontraido');

-- Quantidade de Emoji
CREATE TYPE emoji_quantity AS ENUM ('pouco', 'medio', 'muito');

-- Tipo de Restrição
CREATE TYPE restriction_type AS ENUM ('no_discount', 'blocked');
```

### 5.2 Tabela de Referência de ENUMs

| ENUM | Valores | Usado em |
|------|---------|----------|
| tenant_status | active, suspended, trial | TENANT.status |
| plan_type | basic, pro, enterprise | TENANT.plan_type |
| user_role | owner, stylist, admin | USER.role |
| client_status | active, lost, negotiating, blocked | CLIENT.status |
| record_source | manual, import, campaign, ai | CLIENT.source, APPOINTMENT.source |
| appointment_status | pending, confirmed, completed, cancelled, no_show | APPOINTMENT.status |
| campaign_type | prazo_certo, encher_agenda, custom | CAMPAIGN.type |
| campaign_status | draft, active, paused, completed | CAMPAIGN.status |
| offer_type | discount_percent, discount_fixed, bonus_service | CAMPAIGN.offer_type |
| campaign_target_status | pending, sent, converted, cancelled, blocked | CAMPAIGN_TARGET.status |
| message_sender_type | client, ai, human | MESSAGE.sender_type |
| media_type | image, audio, video, document | MESSAGE.media_type |
| ai_tone | profissional, amigavel, descontraido | AI_CONFIG.tone_of_voice |
| emoji_quantity | pouco, medio, muito | AI_CONFIG.emoji_quantity |
| restriction_type | no_discount, blocked | PROFESSIONAL_SERVICE_RESTRICTION.restriction_type |

---

## 6. RELACIONAMENTOS E CARDINALIDADE

### 6.1 Diagrama de Relacionamentos (ER Textual)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           RELACIONAMENTOS                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  TENANT (1) ──────────────────────┬───────────────────── (N) USER           │
│     │                             │                                          │
│     │ (1:N)                       │ (1:N)                                    │
│     ▼                             ▼                                          │
│  PROFESSIONAL ◄──────────────── USER (0..1:1)                               │
│     │                                                                        │
│     │ (N:M via PROFESSIONAL_SERVICE)                                        │
│     ▼                                                                        │
│  SERVICE ◄───────────────────────────────────────────── TENANT (1:N)        │
│     │                                                                        │
│     │ (N:M via CLIENT_SERVICE_INTEREST)                                     │
│     ▼                                                                        │
│  CLIENT ◄────────────────────────────────────────────── TENANT (1:N)        │
│     │                                                                        │
│     ├──── (0..1) ────► PROFESSIONAL (preferred)                             │
│     │                                                                        │
│     ├──── (1:N) ─────► APPOINTMENT                                          │
│     │                                                                        │
│     ├──── (1:0..1) ──► CONVERSATION                                         │
│     │                                                                        │
│     └──── (N:M) ─────► CAMPAIGN (via CAMPAIGN_TARGET)                       │
│                                                                              │
│  APPOINTMENT ◄─────────────────── PROFESSIONAL (1:N)                        │
│     │         ◄─────────────────── SERVICE (1:N)                            │
│     │         ◄─────────────────── CAMPAIGN (0..1:N)                        │
│     │                                                                        │
│  CONVERSATION (1) ────────────────────────────────────► (N) MESSAGE         │
│                                                                              │
│  PROFESSIONAL (1) ─────► (7) PROFESSIONAL_SCHEDULE                          │
│              (1) ─────► (N) PROFESSIONAL_TIME_OFF                           │
│              (1) ─────► (1) PROFESSIONAL_RULE                               │
│              (1) ─────► (N) PROFESSIONAL_SERVICE_RESTRICTION                │
│                                                                              │
│  TENANT (1) ──────────► (7) TENANT_SCHEDULE                                 │
│         (1) ──────────► (N) CLOSED_DATE                                     │
│         (1) ──────────► (1) AI_CONFIG                                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Matriz de Cardinalidade

| Tabela Origem | Tabela Destino | Cardinalidade | FK Location | Obrigatório |
|---------------|----------------|---------------|-------------|-------------|
| TENANT | USER | 1:N | USER.tenant_id | Sim |
| TENANT | PROFESSIONAL | 1:N | PROFESSIONAL.tenant_id | Sim |
| TENANT | SERVICE | 1:N | SERVICE.tenant_id | Sim |
| TENANT | CLIENT | 1:N | CLIENT.tenant_id | Sim |
| TENANT | APPOINTMENT | 1:N | APPOINTMENT.tenant_id | Sim |
| TENANT | CAMPAIGN | 1:N | CAMPAIGN.tenant_id | Sim |
| TENANT | CONVERSATION | 1:N | CONVERSATION.tenant_id | Sim |
| TENANT | TENANT_SCHEDULE | 1:7 | TENANT_SCHEDULE.tenant_id | Sim |
| TENANT | CLOSED_DATE | 1:N | CLOSED_DATE.tenant_id | Sim |
| TENANT | AI_CONFIG | 1:1 | AI_CONFIG.tenant_id | Sim |
| USER | PROFESSIONAL | 1:0..1 | USER.professional_id | Não |
| PROFESSIONAL | SERVICE | N:M | PROFESSIONAL_SERVICE | - |
| PROFESSIONAL | APPOINTMENT | 1:N | APPOINTMENT.professional_id | Sim |
| PROFESSIONAL | PROFESSIONAL_SCHEDULE | 1:7 | PROFESSIONAL_SCHEDULE.professional_id | Sim |
| PROFESSIONAL | PROFESSIONAL_TIME_OFF | 1:N | PROFESSIONAL_TIME_OFF.professional_id | Sim |
| PROFESSIONAL | PROFESSIONAL_RULE | 1:1 | PROFESSIONAL_RULE.professional_id | Sim |
| PROFESSIONAL | CLIENT | 1:N | CLIENT.preferred_professional_id | Não |
| SERVICE | APPOINTMENT | 1:N | APPOINTMENT.service_id | Sim |
| SERVICE | CLIENT | N:M | CLIENT_SERVICE_INTEREST | - |
| CLIENT | APPOINTMENT | 1:N | APPOINTMENT.client_id | Sim |
| CLIENT | CONVERSATION | 1:0..1 | CONVERSATION.client_id | Sim |
| CLIENT | CAMPAIGN | N:M | CAMPAIGN_TARGET | - |
| CAMPAIGN | CAMPAIGN_TARGET | 1:N | CAMPAIGN_TARGET.campaign_id | Sim |
| CAMPAIGN | APPOINTMENT | 1:N | APPOINTMENT.campaign_id | Não |
| CONVERSATION | MESSAGE | 1:N | MESSAGE.conversation_id | Sim |
| USER | MESSAGE | 1:N | MESSAGE.sender_user_id | Não |
| USER | CAMPAIGN | 1:N | CAMPAIGN.created_by | Sim |
| USER | APPOINTMENT | 1:N | APPOINTMENT.confirmed_by | Não |

---

## 7. ÍNDICES E PERFORMANCE

### 7.1 Índices Primários (PKs)

Todos os campos `id` já possuem índice automático por serem Primary Keys.

### 7.2 Índices de Foreign Key

```sql
-- USER
CREATE INDEX idx_user_tenant ON "user"(tenant_id);
CREATE INDEX idx_user_professional ON "user"(professional_id) WHERE professional_id IS NOT NULL;

-- PROFESSIONAL
CREATE INDEX idx_professional_tenant ON professional(tenant_id);

-- SERVICE
CREATE INDEX idx_service_tenant ON service(tenant_id);

-- CLIENT
CREATE INDEX idx_client_tenant ON client(tenant_id);
CREATE INDEX idx_client_preferred_prof ON client(preferred_professional_id) WHERE preferred_professional_id IS NOT NULL;

-- APPOINTMENT
CREATE INDEX idx_appointment_tenant ON appointment(tenant_id);
CREATE INDEX idx_appointment_client ON appointment(client_id);
CREATE INDEX idx_appointment_professional ON appointment(professional_id);
CREATE INDEX idx_appointment_service ON appointment(service_id);
CREATE INDEX idx_appointment_campaign ON appointment(campaign_id) WHERE campaign_id IS NOT NULL;
CREATE INDEX idx_appointment_confirmed_by ON appointment(confirmed_by) WHERE confirmed_by IS NOT NULL;

-- CAMPAIGN
CREATE INDEX idx_campaign_tenant ON campaign(tenant_id);
CREATE INDEX idx_campaign_created_by ON campaign(created_by);
CREATE INDEX idx_campaign_target_service ON campaign(target_service_id) WHERE target_service_id IS NOT NULL;
CREATE INDEX idx_campaign_target_prof ON campaign(target_professional_id) WHERE target_professional_id IS NOT NULL;

-- CAMPAIGN_TARGET
CREATE INDEX idx_campaign_target_campaign ON campaign_target(campaign_id);
CREATE INDEX idx_campaign_target_client ON campaign_target(client_id);
CREATE INDEX idx_campaign_target_appointment ON campaign_target(appointment_id) WHERE appointment_id IS NOT NULL;

-- CONVERSATION
CREATE INDEX idx_conversation_tenant ON conversation(tenant_id);
CREATE INDEX idx_conversation_client ON conversation(client_id);
CREATE INDEX idx_conversation_assumed_by ON conversation(assumed_by) WHERE assumed_by IS NOT NULL;
CREATE INDEX idx_conversation_campaign ON conversation(campaign_id) WHERE campaign_id IS NOT NULL;

-- MESSAGE
CREATE INDEX idx_message_conversation ON message(conversation_id);
CREATE INDEX idx_message_sender_user ON message(sender_user_id) WHERE sender_user_id IS NOT NULL;

-- PROFESSIONAL_SERVICE
CREATE INDEX idx_prof_service_service ON professional_service(service_id);

-- CLIENT_SERVICE_INTEREST
CREATE INDEX idx_client_interest_service ON client_service_interest(service_id);

-- PROFESSIONAL_SCHEDULE
CREATE INDEX idx_prof_schedule_professional ON professional_schedule(professional_id);

-- PROFESSIONAL_TIME_OFF
CREATE INDEX idx_prof_time_off_professional ON professional_time_off(professional_id);

-- PROFESSIONAL_SERVICE_RESTRICTION
CREATE INDEX idx_prof_restriction_service ON professional_service_restriction(service_id);

-- TENANT_SCHEDULE
CREATE INDEX idx_tenant_schedule_tenant ON tenant_schedule(tenant_id);

-- CLOSED_DATE
CREATE INDEX idx_closed_date_tenant ON closed_date(tenant_id);
```

### 7.3 Índices de Performance (Queries Frequentes)

```sql
-- Dashboard: Agendamentos do dia
CREATE INDEX idx_appointment_date
ON appointment(tenant_id, scheduled_date, status);

-- Dashboard: Agendamentos pendentes
CREATE INDEX idx_appointment_pending
ON appointment(tenant_id, status, scheduled_date)
WHERE status = 'pending';

-- Calendário: Agendamentos por profissional/data
CREATE INDEX idx_appointment_prof_date
ON appointment(professional_id, scheduled_date, scheduled_time);

-- Clientes: Filtro por status
CREATE INDEX idx_client_status
ON client(tenant_id, status);

-- Clientes: Ordenação por última visita
CREATE INDEX idx_client_last_visit
ON client(tenant_id, last_visit_at DESC NULLS LAST);

-- Clientes: Busca por telefone
CREATE INDEX idx_client_phone_search
ON client(tenant_id, phone varchar_pattern_ops);

-- Clientes: Busca por nome (full-text)
CREATE INDEX idx_client_name_search
ON client USING gin(to_tsvector('portuguese', name));

-- Campanhas: Filtro por status
CREATE INDEX idx_campaign_status
ON campaign(tenant_id, status);

-- Campanhas: Alvos pendentes
CREATE INDEX idx_campaign_target_pending
ON campaign_target(campaign_id, status)
WHERE status = 'pending';

-- Chat: Conversas ordenadas por última mensagem
CREATE INDEX idx_conversation_last_msg
ON conversation(tenant_id, last_message_at DESC NULLS LAST);

-- Chat: Conversas com IA ativa
CREATE INDEX idx_conversation_ai_active
ON conversation(tenant_id, is_ai_active)
WHERE is_ai_active = true;

-- Mensagens: Ordenação por data
CREATE INDEX idx_message_sent_at
ON message(conversation_id, sent_at DESC);

-- Mensagens: Não lidas
CREATE INDEX idx_message_unread
ON message(conversation_id, is_read)
WHERE is_read = false;

-- Folgas: Consulta por data
CREATE INDEX idx_time_off_date
ON professional_time_off(professional_id, date);

-- Datas fechadas: Consulta por data
CREATE INDEX idx_closed_date_date
ON closed_date(tenant_id, date);
```

### 7.4 Estimativa de Tamanho dos Índices

| Índice | Colunas | Tamanho Estimado (100k registros) |
|--------|---------|-----------------------------------|
| idx_appointment_date | tenant_id, scheduled_date, status | ~5 MB |
| idx_appointment_prof_date | professional_id, scheduled_date, scheduled_time | ~6 MB |
| idx_client_status | tenant_id, status | ~3 MB |
| idx_message_sent_at | conversation_id, sent_at | ~15 MB (para 1M msgs) |

---

## 8. CONSTRAINTS E VALIDAÇÕES

### 8.1 Primary Keys

```sql
-- Todas as tabelas usam UUID como PK
ALTER TABLE tenant ADD CONSTRAINT pk_tenant PRIMARY KEY (id);
ALTER TABLE "user" ADD CONSTRAINT pk_user PRIMARY KEY (id);
ALTER TABLE professional ADD CONSTRAINT pk_professional PRIMARY KEY (id);
ALTER TABLE service ADD CONSTRAINT pk_service PRIMARY KEY (id);
ALTER TABLE client ADD CONSTRAINT pk_client PRIMARY KEY (id);
ALTER TABLE appointment ADD CONSTRAINT pk_appointment PRIMARY KEY (id);
ALTER TABLE campaign ADD CONSTRAINT pk_campaign PRIMARY KEY (id);
ALTER TABLE campaign_target ADD CONSTRAINT pk_campaign_target PRIMARY KEY (id);
ALTER TABLE conversation ADD CONSTRAINT pk_conversation PRIMARY KEY (id);
ALTER TABLE message ADD CONSTRAINT pk_message PRIMARY KEY (id);
ALTER TABLE tenant_schedule ADD CONSTRAINT pk_tenant_schedule PRIMARY KEY (id);
ALTER TABLE professional_schedule ADD CONSTRAINT pk_professional_schedule PRIMARY KEY (id);
ALTER TABLE professional_time_off ADD CONSTRAINT pk_professional_time_off PRIMARY KEY (id);
ALTER TABLE professional_rule ADD CONSTRAINT pk_professional_rule PRIMARY KEY (id);
ALTER TABLE ai_config ADD CONSTRAINT pk_ai_config PRIMARY KEY (id);
ALTER TABLE closed_date ADD CONSTRAINT pk_closed_date PRIMARY KEY (id);

-- Composite PKs para tabelas de junção
ALTER TABLE professional_service ADD CONSTRAINT pk_professional_service PRIMARY KEY (professional_id, service_id);
ALTER TABLE client_service_interest ADD CONSTRAINT pk_client_service_interest PRIMARY KEY (client_id, service_id);
ALTER TABLE professional_service_restriction ADD CONSTRAINT pk_professional_service_restriction PRIMARY KEY (professional_id, service_id);
```

### 8.2 Foreign Keys

```sql
-- USER
ALTER TABLE "user" ADD CONSTRAINT fk_user_tenant FOREIGN KEY (tenant_id) REFERENCES tenant(id) ON DELETE CASCADE;
ALTER TABLE "user" ADD CONSTRAINT fk_user_professional FOREIGN KEY (professional_id) REFERENCES professional(id) ON DELETE SET NULL;

-- PROFESSIONAL
ALTER TABLE professional ADD CONSTRAINT fk_professional_tenant FOREIGN KEY (tenant_id) REFERENCES tenant(id) ON DELETE CASCADE;

-- SERVICE
ALTER TABLE service ADD CONSTRAINT fk_service_tenant FOREIGN KEY (tenant_id) REFERENCES tenant(id) ON DELETE CASCADE;

-- PROFESSIONAL_SERVICE
ALTER TABLE professional_service ADD CONSTRAINT fk_prof_service_professional FOREIGN KEY (professional_id) REFERENCES professional(id) ON DELETE CASCADE;
ALTER TABLE professional_service ADD CONSTRAINT fk_prof_service_service FOREIGN KEY (service_id) REFERENCES service(id) ON DELETE CASCADE;

-- CLIENT
ALTER TABLE client ADD CONSTRAINT fk_client_tenant FOREIGN KEY (tenant_id) REFERENCES tenant(id) ON DELETE CASCADE;
ALTER TABLE client ADD CONSTRAINT fk_client_preferred_prof FOREIGN KEY (preferred_professional_id) REFERENCES professional(id) ON DELETE SET NULL;

-- CLIENT_SERVICE_INTEREST
ALTER TABLE client_service_interest ADD CONSTRAINT fk_client_interest_client FOREIGN KEY (client_id) REFERENCES client(id) ON DELETE CASCADE;
ALTER TABLE client_service_interest ADD CONSTRAINT fk_client_interest_service FOREIGN KEY (service_id) REFERENCES service(id) ON DELETE CASCADE;

-- APPOINTMENT
ALTER TABLE appointment ADD CONSTRAINT fk_appointment_tenant FOREIGN KEY (tenant_id) REFERENCES tenant(id) ON DELETE CASCADE;
ALTER TABLE appointment ADD CONSTRAINT fk_appointment_client FOREIGN KEY (client_id) REFERENCES client(id) ON DELETE RESTRICT;
ALTER TABLE appointment ADD CONSTRAINT fk_appointment_professional FOREIGN KEY (professional_id) REFERENCES professional(id) ON DELETE RESTRICT;
ALTER TABLE appointment ADD CONSTRAINT fk_appointment_service FOREIGN KEY (service_id) REFERENCES service(id) ON DELETE RESTRICT;
ALTER TABLE appointment ADD CONSTRAINT fk_appointment_campaign FOREIGN KEY (campaign_id) REFERENCES campaign(id) ON DELETE SET NULL;
ALTER TABLE appointment ADD CONSTRAINT fk_appointment_confirmed_by FOREIGN KEY (confirmed_by) REFERENCES "user"(id) ON DELETE SET NULL;

-- CAMPAIGN
ALTER TABLE campaign ADD CONSTRAINT fk_campaign_tenant FOREIGN KEY (tenant_id) REFERENCES tenant(id) ON DELETE CASCADE;
ALTER TABLE campaign ADD CONSTRAINT fk_campaign_target_service FOREIGN KEY (target_service_id) REFERENCES service(id) ON DELETE SET NULL;
ALTER TABLE campaign ADD CONSTRAINT fk_campaign_target_prof FOREIGN KEY (target_professional_id) REFERENCES professional(id) ON DELETE SET NULL;
ALTER TABLE campaign ADD CONSTRAINT fk_campaign_bonus_service FOREIGN KEY (bonus_service_id) REFERENCES service(id) ON DELETE SET NULL;
ALTER TABLE campaign ADD CONSTRAINT fk_campaign_created_by FOREIGN KEY (created_by) REFERENCES "user"(id) ON DELETE RESTRICT;

-- CAMPAIGN_TARGET
ALTER TABLE campaign_target ADD CONSTRAINT fk_camp_target_campaign FOREIGN KEY (campaign_id) REFERENCES campaign(id) ON DELETE CASCADE;
ALTER TABLE campaign_target ADD CONSTRAINT fk_camp_target_client FOREIGN KEY (client_id) REFERENCES client(id) ON DELETE CASCADE;
ALTER TABLE campaign_target ADD CONSTRAINT fk_camp_target_appointment FOREIGN KEY (appointment_id) REFERENCES appointment(id) ON DELETE SET NULL;

-- CONVERSATION
ALTER TABLE conversation ADD CONSTRAINT fk_conversation_tenant FOREIGN KEY (tenant_id) REFERENCES tenant(id) ON DELETE CASCADE;
ALTER TABLE conversation ADD CONSTRAINT fk_conversation_client FOREIGN KEY (client_id) REFERENCES client(id) ON DELETE CASCADE;
ALTER TABLE conversation ADD CONSTRAINT fk_conversation_assumed_by FOREIGN KEY (assumed_by) REFERENCES "user"(id) ON DELETE SET NULL;
ALTER TABLE conversation ADD CONSTRAINT fk_conversation_campaign FOREIGN KEY (campaign_id) REFERENCES campaign(id) ON DELETE SET NULL;

-- MESSAGE
ALTER TABLE message ADD CONSTRAINT fk_message_conversation FOREIGN KEY (conversation_id) REFERENCES conversation(id) ON DELETE CASCADE;
ALTER TABLE message ADD CONSTRAINT fk_message_sender_user FOREIGN KEY (sender_user_id) REFERENCES "user"(id) ON DELETE SET NULL;

-- TENANT_SCHEDULE
ALTER TABLE tenant_schedule ADD CONSTRAINT fk_tenant_schedule_tenant FOREIGN KEY (tenant_id) REFERENCES tenant(id) ON DELETE CASCADE;

-- PROFESSIONAL_SCHEDULE
ALTER TABLE professional_schedule ADD CONSTRAINT fk_prof_schedule_professional FOREIGN KEY (professional_id) REFERENCES professional(id) ON DELETE CASCADE;

-- PROFESSIONAL_TIME_OFF
ALTER TABLE professional_time_off ADD CONSTRAINT fk_prof_time_off_professional FOREIGN KEY (professional_id) REFERENCES professional(id) ON DELETE CASCADE;

-- PROFESSIONAL_RULE
ALTER TABLE professional_rule ADD CONSTRAINT fk_prof_rule_professional FOREIGN KEY (professional_id) REFERENCES professional(id) ON DELETE CASCADE;

-- PROFESSIONAL_SERVICE_RESTRICTION
ALTER TABLE professional_service_restriction ADD CONSTRAINT fk_prof_restriction_professional FOREIGN KEY (professional_id) REFERENCES professional(id) ON DELETE CASCADE;
ALTER TABLE professional_service_restriction ADD CONSTRAINT fk_prof_restriction_service FOREIGN KEY (service_id) REFERENCES service(id) ON DELETE CASCADE;

-- AI_CONFIG
ALTER TABLE ai_config ADD CONSTRAINT fk_ai_config_tenant FOREIGN KEY (tenant_id) REFERENCES tenant(id) ON DELETE CASCADE;

-- CLOSED_DATE
ALTER TABLE closed_date ADD CONSTRAINT fk_closed_date_tenant FOREIGN KEY (tenant_id) REFERENCES tenant(id) ON DELETE CASCADE;
```

### 8.3 Unique Constraints

```sql
-- TENANT
ALTER TABLE tenant ADD CONSTRAINT uq_tenant_cnpj UNIQUE (cnpj);
ALTER TABLE tenant ADD CONSTRAINT uq_tenant_email UNIQUE (email);

-- USER
ALTER TABLE "user" ADD CONSTRAINT uq_user_tenant_email UNIQUE (tenant_id, email);

-- SERVICE
ALTER TABLE service ADD CONSTRAINT uq_service_tenant_name UNIQUE (tenant_id, name);

-- CLIENT
ALTER TABLE client ADD CONSTRAINT uq_client_tenant_phone UNIQUE (tenant_id, phone);

-- CAMPAIGN_TARGET
ALTER TABLE campaign_target ADD CONSTRAINT uq_campaign_target UNIQUE (campaign_id, client_id);

-- CONVERSATION
ALTER TABLE conversation ADD CONSTRAINT uq_conversation_tenant_client UNIQUE (tenant_id, client_id);

-- TENANT_SCHEDULE
ALTER TABLE tenant_schedule ADD CONSTRAINT uq_tenant_schedule_day UNIQUE (tenant_id, day_of_week);

-- PROFESSIONAL_SCHEDULE
ALTER TABLE professional_schedule ADD CONSTRAINT uq_prof_schedule_day UNIQUE (professional_id, day_of_week);

-- PROFESSIONAL_RULE
ALTER TABLE professional_rule ADD CONSTRAINT uq_prof_rule_professional UNIQUE (professional_id);

-- AI_CONFIG
ALTER TABLE ai_config ADD CONSTRAINT uq_ai_config_tenant UNIQUE (tenant_id);

-- CLOSED_DATE
ALTER TABLE closed_date ADD CONSTRAINT uq_closed_date_tenant_date UNIQUE (tenant_id, date);
```

### 8.4 Check Constraints

```sql
-- SERVICE
ALTER TABLE service ADD CONSTRAINT chk_service_duration CHECK (duration_min > 0 AND duration_min <= 480);
ALTER TABLE service ADD CONSTRAINT chk_service_price CHECK (price >= 0);
ALTER TABLE service ADD CONSTRAINT chk_service_cycle CHECK (return_cycle IS NULL OR return_cycle > 0);

-- CLIENT
ALTER TABLE client ADD CONSTRAINT chk_client_total_spent CHECK (total_spent >= 0);
ALTER TABLE client ADD CONSTRAINT chk_client_visit_count CHECK (visit_count >= 0);

-- APPOINTMENT
ALTER TABLE appointment ADD CONSTRAINT chk_appointment_time CHECK (scheduled_time >= '07:00' AND scheduled_time <= '22:00');
ALTER TABLE appointment ADD CONSTRAINT chk_appointment_duration CHECK (duration_min > 0 AND duration_min <= 480);
ALTER TABLE appointment ADD CONSTRAINT chk_appointment_price CHECK (price >= 0);
ALTER TABLE appointment ADD CONSTRAINT chk_appointment_discount CHECK (discount_amount >= 0 AND discount_amount <= price);
ALTER TABLE appointment ADD CONSTRAINT chk_appointment_end_time CHECK (end_time > scheduled_time);

-- CAMPAIGN
ALTER TABLE campaign ADD CONSTRAINT chk_campaign_validity CHECK (validity_days IS NULL OR validity_days > 0);
ALTER TABLE campaign ADD CONSTRAINT chk_campaign_threshold CHECK (days_threshold IS NULL OR days_threshold > 0);
ALTER TABLE campaign ADD CONSTRAINT chk_campaign_offer_value CHECK (offer_value IS NULL OR offer_value >= 0);

-- TENANT_SCHEDULE
ALTER TABLE tenant_schedule ADD CONSTRAINT chk_tenant_schedule_day CHECK (day_of_week >= 0 AND day_of_week <= 6);
ALTER TABLE tenant_schedule ADD CONSTRAINT chk_tenant_schedule_times CHECK (
    (NOT is_open) OR (open_time IS NOT NULL AND close_time IS NOT NULL AND open_time < close_time)
);
ALTER TABLE tenant_schedule ADD CONSTRAINT chk_tenant_schedule_break CHECK (
    break_start IS NULL OR (break_end IS NOT NULL AND break_start < break_end)
);

-- PROFESSIONAL_SCHEDULE
ALTER TABLE professional_schedule ADD CONSTRAINT chk_prof_schedule_day CHECK (day_of_week >= 0 AND day_of_week <= 6);
ALTER TABLE professional_schedule ADD CONSTRAINT chk_prof_schedule_times CHECK (
    (NOT is_working) OR (start_time IS NOT NULL AND end_time IS NOT NULL AND start_time < end_time)
);
ALTER TABLE professional_schedule ADD CONSTRAINT chk_prof_schedule_break CHECK (
    break_start IS NULL OR (break_end IS NOT NULL AND break_start < break_end)
);

-- PROFESSIONAL_RULE
ALTER TABLE professional_rule ADD CONSTRAINT chk_prof_rule_discount_pct CHECK (
    max_discount_percent IS NULL OR (max_discount_percent >= 0 AND max_discount_percent <= 100)
);
ALTER TABLE professional_rule ADD CONSTRAINT chk_prof_rule_discount_amt CHECK (
    max_discount_amount IS NULL OR max_discount_amount >= 0
);

-- PROFESSIONAL_SERVICE
ALTER TABLE professional_service ADD CONSTRAINT chk_prof_service_price CHECK (custom_price IS NULL OR custom_price >= 0);
ALTER TABLE professional_service ADD CONSTRAINT chk_prof_service_duration CHECK (custom_duration IS NULL OR (custom_duration > 0 AND custom_duration <= 480));

-- CONVERSATION
ALTER TABLE conversation ADD CONSTRAINT chk_conversation_unread CHECK (unread_count >= 0);

-- PROFESSIONAL_TIME_OFF
ALTER TABLE professional_time_off ADD CONSTRAINT chk_time_off_times CHECK (
    is_full_day OR (start_time IS NOT NULL AND end_time IS NOT NULL AND start_time < end_time)
);
```

---

## 9. REGRAS DE NEGÓCIO

### 9.1 Matriz de Responsabilidade (Banco vs Aplicação)

| Regra de Negócio | Banco | Aplicação | Implementação |
|------------------|:-----:|:---------:|---------------|
| Integridade referencial | ✅ | | Foreign Keys |
| Unicidade de registros | ✅ | | UNIQUE constraints |
| Valores válidos (range) | ✅ | | CHECK constraints |
| Multi-tenancy isolation | ✅ | ✅ | tenant_id + RLS |
| Conflito de horário | | ✅ | Validação antes do INSERT |
| Disponibilidade de profissional | | ✅ | Query + business logic |
| Cálculo de slots disponíveis | | ✅ | Algoritmo |
| Lógica de Prazo Certo | | ✅ | Job/Cron |
| Regras de desconto | | ✅ | Validação + PROFESSIONAL_RULE |
| Atualização de caches | | ✅ | Trigger ou Job |
| Validação LGPD | | ✅ | UI + flag |
| Integração WhatsApp | | ✅ | API externa |
| Geração de mensagens IA | | ✅ | LLM API |
| Workflow de aprovação | | ✅ | Status machine |

### 9.2 Regras Implementadas via Trigger (Opcional)

```sql
-- Trigger para atualizar last_visit_at e total_spent do cliente
CREATE OR REPLACE FUNCTION update_client_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
        UPDATE client
        SET
            last_visit_at = NEW.scheduled_date,
            total_spent = total_spent + NEW.final_price,
            visit_count = visit_count + 1,
            updated_at = NOW()
        WHERE id = NEW.client_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_appointment_completed
AFTER INSERT OR UPDATE ON appointment
FOR EACH ROW
EXECUTE FUNCTION update_client_stats();

-- Trigger para atualizar last_message_at da conversa
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversation
    SET
        last_message_at = NEW.sent_at,
        last_message_preview = LEFT(NEW.content, 100),
        unread_count = CASE
            WHEN NEW.sender_type = 'client' THEN unread_count + 1
            ELSE unread_count
        END,
        updated_at = NOW()
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_message_insert
AFTER INSERT ON message
FOR EACH ROW
EXECUTE FUNCTION update_conversation_last_message();

-- Trigger para calcular end_time do agendamento
CREATE OR REPLACE FUNCTION calculate_appointment_end_time()
RETURNS TRIGGER AS $$
BEGIN
    NEW.end_time := NEW.scheduled_time + (NEW.duration_min || ' minutes')::INTERVAL;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_appointment_end_time
BEFORE INSERT OR UPDATE ON appointment
FOR EACH ROW
EXECUTE FUNCTION calculate_appointment_end_time();

-- Trigger para final_price (se não usar GENERATED)
CREATE OR REPLACE FUNCTION calculate_final_price()
RETURNS TRIGGER AS $$
BEGIN
    NEW.final_price := NEW.price - NEW.discount_amount;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_appointment_final_price
BEFORE INSERT OR UPDATE ON appointment
FOR EACH ROW
EXECUTE FUNCTION calculate_final_price();
```

### 9.3 Regras de Workflow de Agendamento

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CICLO DE VIDA DO AGENDAMENTO                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│    ┌─────────┐                                                      │
│    │ PENDING │ ◄────── Criação (via IA ou manual)                   │
│    └────┬────┘                                                      │
│         │                                                           │
│         ├──────────► CONFIRMED (owner aprova)                       │
│         │                │                                          │
│         │                ├──────────► COMPLETED (atendimento ok)    │
│         │                │                                          │
│         │                ├──────────► NO_SHOW (cliente faltou)      │
│         │                │                                          │
│         │                └──────────► CANCELLED (cancelamento)      │
│         │                                                           │
│         └──────────► CANCELLED (rejeitado ou expirado)              │
│                                                                      │
├─────────────────────────────────────────────────────────────────────┤
│ Transições permitidas:                                               │
│ • PENDING → CONFIRMED, CANCELLED                                    │
│ • CONFIRMED → COMPLETED, CANCELLED, NO_SHOW                         │
│ • COMPLETED, CANCELLED, NO_SHOW → (estados finais)                  │
└─────────────────────────────────────────────────────────────────────┘
```

### 9.4 Regras de Campanha

| Tipo | Gatilho | Alvo | Oferta |
|------|---------|------|--------|
| **prazo_certo** | days_since_last_visit == service.return_cycle | Clientes com serviço específico | Desconto/Bônus configurado |
| **encher_agenda** | Manual | Clientes interessados nos serviços do profissional | Desconto no atendimento |
| **custom** | days_since_last_visit >= days_threshold | Lista manual ou filtrada | Configuração livre |

### 9.5 Regras de Desconto

```
Validação de Desconto:
1. Verificar PROFESSIONAL_RULE.discount_allowed
2. Se FALSE → Desconto não permitido
3. Se TRUE:
   a. Verificar PROFESSIONAL_SERVICE_RESTRICTION para o serviço
   b. Se restriction_type = 'no_discount' → Não permitido
   c. Verificar max_discount_percent ou max_discount_amount
   d. Desconto não pode exceder o menor limite
```

---

## 10. DDL COMPLETO - POSTGRESQL

### 10.1 Extensões e Configurações

```sql
-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- Para busca fuzzy

-- Configuração de timezone
SET timezone = 'America/Sao_Paulo';
```

### 10.2 Criação dos ENUMs

```sql
-- Status do Tenant
CREATE TYPE tenant_status AS ENUM ('active', 'suspended', 'trial');

-- Plano do Tenant
CREATE TYPE plan_type AS ENUM ('basic', 'pro', 'enterprise');

-- Papel do Usuário
CREATE TYPE user_role AS ENUM ('owner', 'stylist', 'admin');

-- Status do Cliente
CREATE TYPE client_status AS ENUM ('active', 'lost', 'negotiating', 'blocked');

-- Origem do registro
CREATE TYPE record_source AS ENUM ('manual', 'import', 'campaign', 'ai');

-- Status do Agendamento
CREATE TYPE appointment_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'no_show');

-- Tipo de Campanha
CREATE TYPE campaign_type AS ENUM ('prazo_certo', 'encher_agenda', 'custom');

-- Status da Campanha
CREATE TYPE campaign_status AS ENUM ('draft', 'active', 'paused', 'completed');

-- Tipo de Oferta
CREATE TYPE offer_type AS ENUM ('discount_percent', 'discount_fixed', 'bonus_service');

-- Status do Alvo da Campanha
CREATE TYPE campaign_target_status AS ENUM ('pending', 'sent', 'converted', 'cancelled', 'blocked');

-- Tipo de Remetente
CREATE TYPE message_sender_type AS ENUM ('client', 'ai', 'human');

-- Tipo de Mídia
CREATE TYPE media_type AS ENUM ('image', 'audio', 'video', 'document');

-- Tom de Voz da IA
CREATE TYPE ai_tone AS ENUM ('profissional', 'amigavel', 'descontraido');

-- Quantidade de Emoji
CREATE TYPE emoji_quantity AS ENUM ('pouco', 'medio', 'muito');

-- Tipo de Restrição
CREATE TYPE restriction_type AS ENUM ('no_discount', 'blocked');
```

### 10.3 Criação das Tabelas

```sql
-- ============================================================
-- TENANT
-- ============================================================
CREATE TABLE tenant (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    cnpj VARCHAR(18) UNIQUE,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    site VARCHAR(500),
    instagram VARCHAR(100),
    tiktok VARCHAR(100),
    facebook VARCHAR(100),
    cep VARCHAR(9) NOT NULL,
    address VARCHAR(300) NOT NULL,
    number VARCHAR(20) NOT NULL,
    complement VARCHAR(100),
    neighborhood VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state CHAR(2) NOT NULL,
    status tenant_status NOT NULL DEFAULT 'trial',
    plan_type plan_type NOT NULL DEFAULT 'basic',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PROFESSIONAL
-- ============================================================
CREATE TABLE professional (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    photo_url VARCHAR(500),
    bio TEXT,
    color CHAR(7) NOT NULL DEFAULT '#3B82F6',
    position VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_professional_tenant ON professional(tenant_id);

-- ============================================================
-- USER
-- ============================================================
CREATE TABLE "user" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(200) NOT NULL,
    role user_role NOT NULL,
    professional_id UUID REFERENCES professional(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_tenant_email UNIQUE (tenant_id, email)
);

CREATE INDEX idx_user_tenant ON "user"(tenant_id);
CREATE INDEX idx_user_professional ON "user"(professional_id) WHERE professional_id IS NOT NULL;

-- ============================================================
-- SERVICE
-- ============================================================
CREATE TABLE service (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    duration_min SMALLINT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    return_cycle SMALLINT,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_service_tenant_name UNIQUE (tenant_id, name),
    CONSTRAINT chk_service_duration CHECK (duration_min > 0 AND duration_min <= 480),
    CONSTRAINT chk_service_price CHECK (price >= 0),
    CONSTRAINT chk_service_cycle CHECK (return_cycle IS NULL OR return_cycle > 0)
);

CREATE INDEX idx_service_tenant ON service(tenant_id);

-- ============================================================
-- PROFESSIONAL_SERVICE (Junction)
-- ============================================================
CREATE TABLE professional_service (
    professional_id UUID NOT NULL REFERENCES professional(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES service(id) ON DELETE CASCADE,
    custom_price DECIMAL(10,2),
    custom_duration SMALLINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (professional_id, service_id),
    CONSTRAINT chk_prof_service_price CHECK (custom_price IS NULL OR custom_price >= 0),
    CONSTRAINT chk_prof_service_duration CHECK (custom_duration IS NULL OR (custom_duration > 0 AND custom_duration <= 480))
);

CREATE INDEX idx_prof_service_service ON professional_service(service_id);

-- ============================================================
-- CLIENT
-- ============================================================
CREATE TABLE client (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    status client_status NOT NULL DEFAULT 'active',
    preferred_professional_id UUID REFERENCES professional(id) ON DELETE SET NULL,
    notes TEXT,
    last_visit_at DATE,
    total_spent DECIMAL(12,2) NOT NULL DEFAULT 0,
    visit_count INTEGER NOT NULL DEFAULT 0,
    source record_source NOT NULL DEFAULT 'manual',
    blocked_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_client_tenant_phone UNIQUE (tenant_id, phone),
    CONSTRAINT chk_client_total_spent CHECK (total_spent >= 0),
    CONSTRAINT chk_client_visit_count CHECK (visit_count >= 0)
);

CREATE INDEX idx_client_tenant ON client(tenant_id);
CREATE INDEX idx_client_status ON client(tenant_id, status);
CREATE INDEX idx_client_last_visit ON client(tenant_id, last_visit_at DESC NULLS LAST);
CREATE INDEX idx_client_preferred_prof ON client(preferred_professional_id) WHERE preferred_professional_id IS NOT NULL;
CREATE INDEX idx_client_name_search ON client USING gin(to_tsvector('portuguese', name));

-- ============================================================
-- CLIENT_SERVICE_INTEREST (Junction)
-- ============================================================
CREATE TABLE client_service_interest (
    client_id UUID NOT NULL REFERENCES client(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES service(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (client_id, service_id)
);

CREATE INDEX idx_client_interest_service ON client_service_interest(service_id);

-- ============================================================
-- CAMPAIGN
-- ============================================================
CREATE TABLE campaign (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    type campaign_type NOT NULL,
    status campaign_status NOT NULL DEFAULT 'draft',
    target_service_id UUID REFERENCES service(id) ON DELETE SET NULL,
    target_professional_id UUID REFERENCES professional(id) ON DELETE SET NULL,
    offer_type offer_type NOT NULL,
    offer_value DECIMAL(10,2),
    bonus_service_id UUID REFERENCES service(id) ON DELETE SET NULL,
    validity_days SMALLINT,
    days_threshold SMALLINT,
    message_template TEXT,
    lgpd_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    created_by UUID NOT NULL,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_campaign_validity CHECK (validity_days IS NULL OR validity_days > 0),
    CONSTRAINT chk_campaign_threshold CHECK (days_threshold IS NULL OR days_threshold > 0),
    CONSTRAINT chk_campaign_offer_value CHECK (offer_value IS NULL OR offer_value >= 0)
);

CREATE INDEX idx_campaign_tenant ON campaign(tenant_id);
CREATE INDEX idx_campaign_status ON campaign(tenant_id, status);

-- FK para created_by será adicionada após criação da tabela user
-- ALTER TABLE campaign ADD CONSTRAINT fk_campaign_created_by FOREIGN KEY (created_by) REFERENCES "user"(id) ON DELETE RESTRICT;

-- ============================================================
-- APPOINTMENT
-- ============================================================
CREATE TABLE appointment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES client(id) ON DELETE RESTRICT,
    professional_id UUID NOT NULL REFERENCES professional(id) ON DELETE RESTRICT,
    service_id UUID NOT NULL REFERENCES service(id) ON DELETE RESTRICT,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_min SMALLINT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    final_price DECIMAL(10,2) NOT NULL,
    status appointment_status NOT NULL DEFAULT 'pending',
    source record_source NOT NULL DEFAULT 'manual',
    notes TEXT,
    campaign_id UUID REFERENCES campaign(id) ON DELETE SET NULL,
    confirmed_by UUID,
    confirmed_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_appointment_time CHECK (scheduled_time >= '07:00' AND scheduled_time <= '22:00'),
    CONSTRAINT chk_appointment_duration CHECK (duration_min > 0 AND duration_min <= 480),
    CONSTRAINT chk_appointment_price CHECK (price >= 0),
    CONSTRAINT chk_appointment_discount CHECK (discount_amount >= 0 AND discount_amount <= price),
    CONSTRAINT chk_appointment_end_time CHECK (end_time > scheduled_time)
);

CREATE INDEX idx_appointment_tenant ON appointment(tenant_id);
CREATE INDEX idx_appointment_date ON appointment(tenant_id, scheduled_date, status);
CREATE INDEX idx_appointment_pending ON appointment(tenant_id, status, scheduled_date) WHERE status = 'pending';
CREATE INDEX idx_appointment_prof_date ON appointment(professional_id, scheduled_date, scheduled_time);
CREATE INDEX idx_appointment_client ON appointment(client_id);

-- FK para confirmed_by será adicionada após criação da tabela user
-- ALTER TABLE appointment ADD CONSTRAINT fk_appointment_confirmed_by FOREIGN KEY (confirmed_by) REFERENCES "user"(id) ON DELETE SET NULL;

-- ============================================================
-- CAMPAIGN_TARGET
-- ============================================================
CREATE TABLE campaign_target (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES campaign(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES client(id) ON DELETE CASCADE,
    status campaign_target_status NOT NULL DEFAULT 'pending',
    sent_at TIMESTAMPTZ,
    opened_at TIMESTAMPTZ,
    converted_at TIMESTAMPTZ,
    appointment_id UUID REFERENCES appointment(id) ON DELETE SET NULL,
    failure_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_campaign_target UNIQUE (campaign_id, client_id)
);

CREATE INDEX idx_campaign_target_campaign ON campaign_target(campaign_id);
CREATE INDEX idx_campaign_target_client ON campaign_target(client_id);
CREATE INDEX idx_campaign_target_pending ON campaign_target(campaign_id, status) WHERE status = 'pending';

-- ============================================================
-- CONVERSATION
-- ============================================================
CREATE TABLE conversation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES client(id) ON DELETE CASCADE,
    wa_chat_id VARCHAR(50),
    is_ai_active BOOLEAN NOT NULL DEFAULT TRUE,
    assumed_by UUID,
    assumed_at TIMESTAMPTZ,
    campaign_id UUID REFERENCES campaign(id) ON DELETE SET NULL,
    last_message_at TIMESTAMPTZ,
    last_message_preview VARCHAR(100),
    unread_count SMALLINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_conversation_tenant_client UNIQUE (tenant_id, client_id),
    CONSTRAINT chk_conversation_unread CHECK (unread_count >= 0)
);

CREATE INDEX idx_conversation_tenant ON conversation(tenant_id);
CREATE INDEX idx_conversation_last_msg ON conversation(tenant_id, last_message_at DESC NULLS LAST);
CREATE INDEX idx_conversation_ai_active ON conversation(tenant_id, is_ai_active) WHERE is_ai_active = true;

-- FK para assumed_by será adicionada após criação da tabela user
-- ALTER TABLE conversation ADD CONSTRAINT fk_conversation_assumed_by FOREIGN KEY (assumed_by) REFERENCES "user"(id) ON DELETE SET NULL;

-- ============================================================
-- MESSAGE
-- ============================================================
CREATE TABLE message (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversation(id) ON DELETE CASCADE,
    sender_type message_sender_type NOT NULL,
    sender_user_id UUID,
    content TEXT NOT NULL,
    media_url VARCHAR(500),
    media_type media_type,
    wa_message_id VARCHAR(50),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    sent_at TIMESTAMPTZ NOT NULL,
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_message_conversation ON message(conversation_id);
CREATE INDEX idx_message_sent_at ON message(conversation_id, sent_at DESC);
CREATE INDEX idx_message_unread ON message(conversation_id, is_read) WHERE is_read = false;

-- FK para sender_user_id será adicionada após criação da tabela user
-- ALTER TABLE message ADD CONSTRAINT fk_message_sender_user FOREIGN KEY (sender_user_id) REFERENCES "user"(id) ON DELETE SET NULL;

-- ============================================================
-- TENANT_SCHEDULE
-- ============================================================
CREATE TABLE tenant_schedule (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
    day_of_week SMALLINT NOT NULL,
    is_open BOOLEAN NOT NULL DEFAULT TRUE,
    open_time TIME,
    close_time TIME,
    break_start TIME,
    break_end TIME,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_tenant_schedule_day UNIQUE (tenant_id, day_of_week),
    CONSTRAINT chk_tenant_schedule_day CHECK (day_of_week >= 0 AND day_of_week <= 6),
    CONSTRAINT chk_tenant_schedule_times CHECK (
        (NOT is_open) OR (open_time IS NOT NULL AND close_time IS NOT NULL AND open_time < close_time)
    ),
    CONSTRAINT chk_tenant_schedule_break CHECK (
        break_start IS NULL OR (break_end IS NOT NULL AND break_start < break_end)
    )
);

CREATE INDEX idx_tenant_schedule_tenant ON tenant_schedule(tenant_id);

-- ============================================================
-- PROFESSIONAL_SCHEDULE
-- ============================================================
CREATE TABLE professional_schedule (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    professional_id UUID NOT NULL REFERENCES professional(id) ON DELETE CASCADE,
    day_of_week SMALLINT NOT NULL,
    is_working BOOLEAN NOT NULL DEFAULT TRUE,
    start_time TIME,
    end_time TIME,
    break_start TIME,
    break_end TIME,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_prof_schedule_day UNIQUE (professional_id, day_of_week),
    CONSTRAINT chk_prof_schedule_day CHECK (day_of_week >= 0 AND day_of_week <= 6),
    CONSTRAINT chk_prof_schedule_times CHECK (
        (NOT is_working) OR (start_time IS NOT NULL AND end_time IS NOT NULL AND start_time < end_time)
    ),
    CONSTRAINT chk_prof_schedule_break CHECK (
        break_start IS NULL OR (break_end IS NOT NULL AND break_start < break_end)
    )
);

CREATE INDEX idx_prof_schedule_professional ON professional_schedule(professional_id);

-- ============================================================
-- PROFESSIONAL_TIME_OFF
-- ============================================================
CREATE TABLE professional_time_off (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    professional_id UUID NOT NULL REFERENCES professional(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    reason VARCHAR(200),
    is_full_day BOOLEAN NOT NULL DEFAULT TRUE,
    start_time TIME,
    end_time TIME,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_time_off_times CHECK (
        is_full_day OR (start_time IS NOT NULL AND end_time IS NOT NULL AND start_time < end_time)
    )
);

CREATE INDEX idx_time_off_professional ON professional_time_off(professional_id);
CREATE INDEX idx_time_off_date ON professional_time_off(professional_id, date);

-- ============================================================
-- PROFESSIONAL_RULE
-- ============================================================
CREATE TABLE professional_rule (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    professional_id UUID NOT NULL REFERENCES professional(id) ON DELETE CASCADE,
    discount_allowed BOOLEAN NOT NULL DEFAULT TRUE,
    max_discount_percent DECIMAL(5,2),
    max_discount_amount DECIMAL(10,2),
    requires_approval BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_prof_rule_professional UNIQUE (professional_id),
    CONSTRAINT chk_prof_rule_discount_pct CHECK (
        max_discount_percent IS NULL OR (max_discount_percent >= 0 AND max_discount_percent <= 100)
    ),
    CONSTRAINT chk_prof_rule_discount_amt CHECK (
        max_discount_amount IS NULL OR max_discount_amount >= 0
    )
);

-- ============================================================
-- PROFESSIONAL_SERVICE_RESTRICTION
-- ============================================================
CREATE TABLE professional_service_restriction (
    professional_id UUID NOT NULL REFERENCES professional(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES service(id) ON DELETE CASCADE,
    restriction_type restriction_type NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (professional_id, service_id)
);

CREATE INDEX idx_prof_restriction_service ON professional_service_restriction(service_id);

-- ============================================================
-- AI_CONFIG
-- ============================================================
CREATE TABLE ai_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
    ai_name VARCHAR(50) NOT NULL DEFAULT 'Júlia',
    salon_description TEXT,
    tone_of_voice ai_tone NOT NULL DEFAULT 'amigavel',
    emoji_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    emoji_quantity emoji_quantity NOT NULL DEFAULT 'medio',
    global_ai_active BOOLEAN NOT NULL DEFAULT TRUE,
    greeting_message TEXT,
    away_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_ai_config_tenant UNIQUE (tenant_id)
);

-- ============================================================
-- CLOSED_DATE
-- ============================================================
CREATE TABLE closed_date (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenant(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    reason VARCHAR(200),
    is_recurring BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_closed_date_tenant_date UNIQUE (tenant_id, date)
);

CREATE INDEX idx_closed_date_tenant ON closed_date(tenant_id);
CREATE INDEX idx_closed_date_date ON closed_date(tenant_id, date);

-- ============================================================
-- ADICIONAR FKs PENDENTES (referências circulares)
-- ============================================================
ALTER TABLE campaign ADD CONSTRAINT fk_campaign_created_by
    FOREIGN KEY (created_by) REFERENCES "user"(id) ON DELETE RESTRICT;

ALTER TABLE appointment ADD CONSTRAINT fk_appointment_confirmed_by
    FOREIGN KEY (confirmed_by) REFERENCES "user"(id) ON DELETE SET NULL;

ALTER TABLE conversation ADD CONSTRAINT fk_conversation_assumed_by
    FOREIGN KEY (assumed_by) REFERENCES "user"(id) ON DELETE SET NULL;

ALTER TABLE message ADD CONSTRAINT fk_message_sender_user
    FOREIGN KEY (sender_user_id) REFERENCES "user"(id) ON DELETE SET NULL;
```

### 10.4 Triggers

```sql
-- ============================================================
-- TRIGGER: Atualizar estatísticas do cliente
-- ============================================================
CREATE OR REPLACE FUNCTION update_client_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Quando agendamento é completado
    IF NEW.status = 'completed' AND (OLD IS NULL OR OLD.status != 'completed') THEN
        UPDATE client
        SET
            last_visit_at = NEW.scheduled_date,
            total_spent = total_spent + NEW.final_price,
            visit_count = visit_count + 1,
            updated_at = NOW()
        WHERE id = NEW.client_id;
    END IF;

    -- Reverter se status mudou de completed para outro
    IF OLD IS NOT NULL AND OLD.status = 'completed' AND NEW.status != 'completed' THEN
        UPDATE client
        SET
            total_spent = GREATEST(0, total_spent - OLD.final_price),
            visit_count = GREATEST(0, visit_count - 1),
            updated_at = NOW()
        WHERE id = NEW.client_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_appointment_stats
AFTER INSERT OR UPDATE OF status ON appointment
FOR EACH ROW
EXECUTE FUNCTION update_client_stats();

-- ============================================================
-- TRIGGER: Atualizar última mensagem da conversa
-- ============================================================
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversation
    SET
        last_message_at = NEW.sent_at,
        last_message_preview = LEFT(NEW.content, 100),
        unread_count = CASE
            WHEN NEW.sender_type = 'client' THEN unread_count + 1
            ELSE unread_count
        END,
        updated_at = NOW()
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_message_insert
AFTER INSERT ON message
FOR EACH ROW
EXECUTE FUNCTION update_conversation_last_message();

-- ============================================================
-- TRIGGER: Calcular final_price automaticamente
-- ============================================================
CREATE OR REPLACE FUNCTION calculate_appointment_prices()
RETURNS TRIGGER AS $$
BEGIN
    -- Calcular final_price
    NEW.final_price := NEW.price - COALESCE(NEW.discount_amount, 0);

    -- Calcular end_time
    NEW.end_time := NEW.scheduled_time + (NEW.duration_min || ' minutes')::INTERVAL;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_appointment_prices
BEFORE INSERT OR UPDATE ON appointment
FOR EACH ROW
EXECUTE FUNCTION calculate_appointment_prices();

-- ============================================================
-- TRIGGER: Auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar a todas as tabelas com updated_at
CREATE TRIGGER trg_tenant_updated_at BEFORE UPDATE ON tenant FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_user_updated_at BEFORE UPDATE ON "user" FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_professional_updated_at BEFORE UPDATE ON professional FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_service_updated_at BEFORE UPDATE ON service FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_client_updated_at BEFORE UPDATE ON client FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_appointment_updated_at BEFORE UPDATE ON appointment FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_campaign_updated_at BEFORE UPDATE ON campaign FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_campaign_target_updated_at BEFORE UPDATE ON campaign_target FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_conversation_updated_at BEFORE UPDATE ON conversation FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_tenant_schedule_updated_at BEFORE UPDATE ON tenant_schedule FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_prof_schedule_updated_at BEFORE UPDATE ON professional_schedule FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_prof_rule_updated_at BEFORE UPDATE ON professional_rule FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_ai_config_updated_at BEFORE UPDATE ON ai_config FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## 11. ESTRATÉGIAS DE ESCALABILIDADE

### 11.1 Particionamento de Tabelas

```sql
-- Particionamento de APPOINTMENT por mês
CREATE TABLE appointment_partitioned (
    LIKE appointment INCLUDING ALL
) PARTITION BY RANGE (scheduled_date);

-- Criar partições mensais (exemplo para 2026)
CREATE TABLE appointment_2026_01 PARTITION OF appointment_partitioned
    FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
CREATE TABLE appointment_2026_02 PARTITION OF appointment_partitioned
    FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
-- ... continuar para todos os meses

-- Particionamento de MESSAGE por mês
CREATE TABLE message_partitioned (
    LIKE message INCLUDING ALL
) PARTITION BY RANGE (sent_at);

-- Criar partições mensais
CREATE TABLE message_2026_01 PARTITION OF message_partitioned
    FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
-- ... continuar para todos os meses
```

### 11.2 Estratégia de Arquivamento

```sql
-- Tabela de arquivo para agendamentos antigos
CREATE TABLE appointment_archive (
    LIKE appointment INCLUDING ALL
);

-- Procedure para arquivar agendamentos com mais de 2 anos
CREATE OR REPLACE FUNCTION archive_old_appointments()
RETURNS void AS $$
BEGIN
    -- Mover para arquivo
    INSERT INTO appointment_archive
    SELECT * FROM appointment
    WHERE scheduled_date < CURRENT_DATE - INTERVAL '2 years'
    AND status IN ('completed', 'cancelled', 'no_show');

    -- Remover da tabela principal
    DELETE FROM appointment
    WHERE scheduled_date < CURRENT_DATE - INTERVAL '2 years'
    AND status IN ('completed', 'cancelled', 'no_show');
END;
$$ LANGUAGE plpgsql;
```

### 11.3 Índices Parciais para Performance

```sql
-- Índices apenas para registros ativos/relevantes
CREATE INDEX idx_appointment_future
ON appointment(tenant_id, scheduled_date, professional_id)
WHERE scheduled_date >= CURRENT_DATE AND status IN ('pending', 'confirmed');

CREATE INDEX idx_client_active
ON client(tenant_id, name)
WHERE status = 'active';

CREATE INDEX idx_campaign_running
ON campaign(tenant_id, type)
WHERE status = 'active';
```

### 11.4 Materialzed Views para Relatórios

```sql
-- View materializada: Resumo diário por profissional
CREATE MATERIALIZED VIEW mv_daily_professional_stats AS
SELECT
    a.tenant_id,
    a.professional_id,
    a.scheduled_date,
    COUNT(*) FILTER (WHERE a.status = 'completed') as completed_count,
    COUNT(*) FILTER (WHERE a.status = 'cancelled') as cancelled_count,
    COUNT(*) FILTER (WHERE a.status = 'no_show') as no_show_count,
    SUM(a.final_price) FILTER (WHERE a.status = 'completed') as total_revenue,
    AVG(a.final_price) FILTER (WHERE a.status = 'completed') as avg_ticket
FROM appointment a
GROUP BY a.tenant_id, a.professional_id, a.scheduled_date;

CREATE UNIQUE INDEX idx_mv_daily_prof_stats
ON mv_daily_professional_stats(tenant_id, professional_id, scheduled_date);

-- Refresh periódico (via cron job)
-- REFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_professional_stats;

-- View materializada: Clientes para reativação (Prazo Certo)
CREATE MATERIALIZED VIEW mv_clients_for_reactivation AS
SELECT
    c.id as client_id,
    c.tenant_id,
    c.name,
    c.phone,
    c.last_visit_at,
    csi.service_id,
    s.name as service_name,
    s.return_cycle,
    CURRENT_DATE - c.last_visit_at as days_since_visit
FROM client c
JOIN client_service_interest csi ON c.id = csi.client_id
JOIN service s ON csi.service_id = s.id
WHERE c.status = 'active'
AND c.last_visit_at IS NOT NULL
AND s.return_cycle IS NOT NULL
AND (CURRENT_DATE - c.last_visit_at) >= s.return_cycle;

CREATE INDEX idx_mv_reactivation_tenant
ON mv_clients_for_reactivation(tenant_id);
```

### 11.5 Connection Pooling

Recomendação: Usar **PgBouncer** ou **Supabase Connection Pooler**

```
# pgbouncer.ini (exemplo)
[databases]
agenda_cheia = host=localhost port=5432 dbname=agenda_cheia

[pgbouncer]
listen_port = 6432
listen_addr = *
auth_type = md5
auth_file = /etc/pgbouncer/userlist.txt
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 20
min_pool_size = 5
reserve_pool_size = 5
```

---

## 12. GUIA DE IMPLEMENTAÇÃO

### 12.1 Ordem de Criação das Tabelas

```
1. Extensões e ENUMs
2. TENANT
3. PROFESSIONAL
4. USER
5. SERVICE
6. PROFESSIONAL_SERVICE
7. CLIENT
8. CLIENT_SERVICE_INTEREST
9. CAMPAIGN
10. APPOINTMENT
11. CAMPAIGN_TARGET
12. CONVERSATION
13. MESSAGE
14. TENANT_SCHEDULE
15. PROFESSIONAL_SCHEDULE
16. PROFESSIONAL_TIME_OFF
17. PROFESSIONAL_RULE
18. PROFESSIONAL_SERVICE_RESTRICTION
19. AI_CONFIG
20. CLOSED_DATE
21. FKs pendentes (campaign.created_by, etc.)
22. Triggers
23. Índices de performance
```

### 12.2 Seed Data Inicial

```sql
-- Criar tenant de demonstração
INSERT INTO tenant (id, name, phone, email, cep, address, number, neighborhood, city, state)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Salão Demonstração',
    '11999999999',
    'demo@agendacheia.com.br',
    '01310-100',
    'Av. Paulista',
    '1000',
    'Bela Vista',
    'São Paulo',
    'SP'
);

-- Criar horários do salão (seg-sáb 09-18h)
INSERT INTO tenant_schedule (tenant_id, day_of_week, is_open, open_time, close_time)
SELECT
    '00000000-0000-0000-0000-000000000001',
    d,
    d NOT IN (0), -- Fechado domingo
    CASE WHEN d NOT IN (0) THEN '09:00'::TIME END,
    CASE WHEN d NOT IN (0) THEN '18:00'::TIME END
FROM generate_series(0, 6) d;

-- Criar config de IA
INSERT INTO ai_config (tenant_id, ai_name, tone_of_voice, emoji_enabled)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Júlia',
    'amigavel',
    true
);
```

### 12.3 Queries Comuns (Exemplos)

```sql
-- 1. Dashboard: Agendamentos do dia com status
SELECT
    a.id,
    a.scheduled_time,
    a.end_time,
    c.name as client_name,
    c.phone as client_phone,
    p.name as professional_name,
    p.color as professional_color,
    s.name as service_name,
    a.status,
    a.source
FROM appointment a
JOIN client c ON a.client_id = c.id
JOIN professional p ON a.professional_id = p.id
JOIN service s ON a.service_id = s.id
WHERE a.tenant_id = $1
AND a.scheduled_date = CURRENT_DATE
ORDER BY a.scheduled_time;

-- 2. Verificar disponibilidade de profissional
SELECT
    a.scheduled_time,
    a.end_time
FROM appointment a
WHERE a.professional_id = $1
AND a.scheduled_date = $2
AND a.status IN ('pending', 'confirmed')
ORDER BY a.scheduled_time;

-- 3. Clientes para campanha Prazo Certo
SELECT DISTINCT ON (c.id)
    c.id,
    c.name,
    c.phone,
    c.last_visit_at,
    s.name as last_service,
    s.return_cycle,
    CURRENT_DATE - c.last_visit_at as days_since
FROM client c
JOIN appointment a ON c.id = a.client_id AND a.status = 'completed'
JOIN service s ON a.service_id = s.id
WHERE c.tenant_id = $1
AND c.status = 'active'
AND s.return_cycle IS NOT NULL
AND (CURRENT_DATE - c.last_visit_at) >= s.return_cycle
ORDER BY c.id, a.scheduled_date DESC;

-- 4. Conversas com mensagens não lidas
SELECT
    conv.id,
    c.name as client_name,
    c.phone,
    conv.last_message_at,
    conv.last_message_preview,
    conv.unread_count,
    conv.is_ai_active
FROM conversation conv
JOIN client c ON conv.client_id = c.id
WHERE conv.tenant_id = $1
AND conv.unread_count > 0
ORDER BY conv.last_message_at DESC;

-- 5. Relatório de faturamento por período
SELECT
    p.name as professional_name,
    COUNT(*) as total_appointments,
    COUNT(*) FILTER (WHERE a.status = 'completed') as completed,
    SUM(a.final_price) FILTER (WHERE a.status = 'completed') as revenue,
    AVG(a.final_price) FILTER (WHERE a.status = 'completed') as avg_ticket
FROM appointment a
JOIN professional p ON a.professional_id = p.id
WHERE a.tenant_id = $1
AND a.scheduled_date BETWEEN $2 AND $3
GROUP BY p.id, p.name
ORDER BY revenue DESC;
```

### 12.4 Migrations com Prisma (Exemplo)

```prisma
// schema.prisma (parcial)

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum TenantStatus {
  active
  suspended
  trial
}

enum PlanType {
  basic
  pro
  enterprise
}

model Tenant {
  id            String       @id @default(uuid())
  name          String       @db.VarChar(200)
  cnpj          String?      @unique @db.VarChar(18)
  phone         String       @db.VarChar(20)
  email         String       @unique @db.VarChar(255)
  status        TenantStatus @default(trial)
  planType      PlanType     @default(basic) @map("plan_type")
  // ... outros campos
  createdAt     DateTime     @default(now()) @map("created_at")
  updatedAt     DateTime     @updatedAt @map("updated_at")

  // Relações
  users         User[]
  professionals Professional[]
  services      Service[]
  clients       Client[]
  // ... etc

  @@map("tenant")
}

// ... continuar com outras models
```

---

## 13. APÊNDICES

### 13.1 Glossário de Termos

| Termo | Definição |
|-------|-----------|
| **Tenant** | Salão de beleza como unidade organizacional |
| **Professional** | Estilista, manicure, barbeiro - prestador de serviço |
| **Lazy Sync** | Sistema de aprovação assíncrona de agendamentos |
| **Prazo Certo** | Campanha automática baseada em ciclo de retorno |
| **Return Cycle** | Intervalo ideal entre visitas para um serviço |
| **Campaign Target** | Cliente específico em uma campanha |

### 13.2 Decisões Arquiteturais (ADRs)

| ADR | Decisão | Justificativa |
|-----|---------|---------------|
| ADR-001 | UUID como PK | Permite geração distribuída, merge de dados |
| ADR-002 | Snapshots em appointment | Histórico imutável de preços/durações |
| ADR-003 | Caches desnormalizados | Performance em queries frequentes |
| ADR-004 | ENUMs no PostgreSQL | Type-safety + documentação inline |
| ADR-005 | Soft delete via status | Manter histórico, permitir reativação |
| ADR-006 | Tenant isolation por FK | Simplicidade, RLS opcional |

### 13.3 Checklist de Implementação

- [ ] Criar banco de dados PostgreSQL 15+
- [ ] Instalar extensões (uuid-ossp, pg_trgm)
- [ ] Executar script de criação de ENUMs
- [ ] Executar script de criação de tabelas
- [ ] Executar script de FKs pendentes
- [ ] Executar script de triggers
- [ ] Executar script de índices de performance
- [ ] Inserir seed data inicial
- [ ] Configurar backup automático
- [ ] Configurar connection pooling
- [ ] Testar queries principais
- [ ] Documentar runbook de operações

### 13.4 Contatos e Responsáveis

| Papel | Responsabilidade |
|-------|------------------|
| DBA | Manutenção, backups, performance |
| Backend Lead | Integração ORM, migrations |
| DevOps | Infraestrutura, monitoramento |

---

## HISTÓRICO DE REVISÕES

| Versão | Data | Autor | Alterações |
|--------|------|-------|------------|
| 1.0 | 2026-01-26 | Arquitetura | Versão inicial completa |

---

**FIM DO DOSSIÊ**
