# PRD — Brand (Gestão de Marca)
**Módulo:** 03_Brand
**Versão:** 5.0
**Data:** 25 Janeiro 2026
**Status:** Especificação Completa

---

## Sumário Executivo

O módulo **Brand** é a plataforma completa para construir, manter e evoluir a identidade de marca — tanto pessoal quanto corporativa.

**Propósito:** Centralizar todos os elementos de marca em um lugar, garantindo consistência através de IA e conectando expertise pessoal com execução profissional.

---

## Índice

1. [Visão Geral](#1-visão-geral)
2. [Features](#2-features)
3. [Modelos de Dados](#3-modelos-de-dados)
4. [Conexões com Connection Layer](#4-conexões-com-connection-layer)
5. [API Endpoints](#5-api-endpoints)

---

# 1. Visão Geral

Brand resolve a fragmentação de identidade:
- Cores em um lugar, logos em outro, mensagens em outro
- Materiais desatualizados sendo usados
- Inconsistência entre canais

## 1.1 Casos de Uso

| Usuário | Objetivo | Como Brand Ajuda |
|---------|----------|------------------|
| **Founder** | Personal branding | Centraliza expertise, conquistas, voice |
| **Startup** | Brand identity | Guidelines, assets, tom de voz |
| **Agency** | Client branding | Multi-brand management |

---

# 2. Features

| Feature | Descrição | Rota |
|---------|-----------|------|
| **Dashboard** | Overview da saúde da marca | `/brand` |
| **Visual Identity** | Cores, tipografia, logos, elementos | `/brand/visual` |
| **Voice & Messaging** | Tom de voz, mensagens-chave, guidelines | `/brand/voice` |
| **Asset Library** | Biblioteca organizada de arquivos | `/brand/assets` |
| **Workflows** | Fluxos de aprovação para materiais | `/brand/workflow` |
| **Press Kit** | Material para imprensa e mídia | `/brand/press` |
| **Brand Check** | Verificador de consistência (IA) | `/brand/check` |
| **Creative Sandbox** | Área de experimentação | `/brand/creative` |

## 2.1 Voice & Messaging (Core Feature)

Define o "como falamos" da marca.

**Componentes:**
- Tom de voz (formal, casual, playful, technical)
- Mensagens-chave (3-5 mensagens principais)
- Copywriting guidelines
- Do's and Don'ts

**Conexão com PrototypOS:**
Quando escreve PRD, PrototypOS aplica voice automaticamente.

---

# 3. Modelos de Dados

## 3.1 BrandIdentity

```typescript
interface BrandIdentity {
  id: string;

  // Essência
  name: string;
  tagline?: string;
  mission?: string;
  vision?: string;
  values: string[];

  // Personalidade
  archetypes: string[];  // "Creator", "Hero", "Sage"
  voice_tone: 'formal' | 'casual' | 'playful' | 'authoritative';
  personality_traits: string[];  // "Innovative", "Trustworthy"

  // Visual
  primary_color: string;
  secondary_color: string;
  accent_color?: string;
  logo_url?: string;

  // Relacionamentos
  palettes: ColorPalette[];
  assets: BrandAsset[];
  guidelines: BrandGuideline[];

  // Expertise (alimentado por Academy + Journey)
  expertise_areas: string[];  // Skills desbloqueadas

  created_at: Date;
  updated_at: Date;
}
```

## 3.2 BrandAsset

```typescript
interface BrandAsset {
  id: string;
  brand_identity_id: string;

  name: string;
  type: 'logo' | 'image' | 'video' | 'document' | 'font';
  file_url: string;
  thumbnail_url?: string;

  // Metadata
  tags: string[];
  category: string;
  version: string;

  // Approval workflow
  status: 'draft' | 'review' | 'approved' | 'deprecated';

  created_at: Date;
}
```

---

# 4. Conexões com Connection Layer

## 4.1 Eventos Consumidos

| Evento | Source | Ação Brand |
|--------|--------|------------|
| `course.completed` | Academy | Adiciona skill a expertise_areas |
| `skill.unlocked` | Academy | Sugere atualizar bio com nova skill |
| `book.quote_added` | Journey | Alimenta voice e copywriting guidelines |
| `goal.completed` | Journey | Atualiza conquistas pessoais |

## 4.2 Eventos Emitidos

| Evento | Trigger | Consumidores |
|--------|---------|--------------|
| `brand.voice_updated` | Voice alterado | PrototypOS (aplica em PRDs) |
| `asset.approved` | Asset aprovado | Notificações |

---

# 5. API Endpoints

```
# Identity
GET/PUT    /api/brand/identity

# Colors
GET/POST   /api/brand/palettes
DELETE     /api/brand/palettes/:id

# Assets
GET/POST   /api/brand/assets
GET/PUT/DELETE /api/brand/assets/:id
POST       /api/brand/assets/:id/approve

# Voice
GET/PUT    /api/brand/voice

# Check
POST       /api/brand/check  # Valida consistência
```

---

*Brand v5.0 — Consistência Garantida*
*ExímIA OS — 2026*
