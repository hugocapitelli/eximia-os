# Story EXIMIA-033: Brand Module (Identidade & Marca)

**Story ID:** EXIMIA-033
**Epic:** EXIMIA-EPIC-010 (Brand Module)
**Sprint:** 12
**Pontos:** 13
**Prioridade:** P2 (Média)
**Depende de:** EXIMIA-009 (Supabase Setup)

---

## User Story

**Como** usuário do exímIA APP,
**Quero** gerenciar a identidade visual e voz da minha marca,
**Para que** eu tenha um brand book digital centralizado com todos os assets.

---

## Contexto

Módulo de Identidade & Marca com dashboard de overview, brand voice guidelines,
e biblioteca de assets. Tudo editável pelo usuário.

---

## Referências de Dados

| Arquivo | Localização | Conteúdo |
|---------|-------------|----------|
| **Dashboard Spec** | `docs/features/Brand/BRAND_DASHBOARD.md` | Overview da marca |
| **Voice Spec** | `docs/features/Brand/BRAND_VOICE.md` | Guidelines de comunicação |
| **Assets Spec** | `docs/features/Brand/BRAND_ASSETS.md` | Biblioteca de arquivos |
| **Mock Data** | `app/src/data/brand-*.ts` | Dados de exemplo |

---

## Acceptance Criteria

### Database Schema
- [ ] Tabelas: brand_identity, brand_values, brand_colors, brand_typography
- [ ] Tabelas: brand_voice, voice_examples, voice_glossary
- [ ] Tabelas: brand_assets, asset_folders
- [ ] RLS policies

### Brand Dashboard
- [ ] Logo da marca (editável)
- [ ] Nome, tagline (editáveis)
- [ ] Missão, Visão, Valores (editáveis)
- [ ] Preview da paleta de cores
- [ ] Preview da tipografia
- [ ] Resumo do Brand Voice
- [ ] Quick assets (download rápido)

### Paleta de Cores
- [ ] Cores primárias e secundárias
- [ ] Adicionar/remover cores
- [ ] Nome, HEX, RGB para cada cor
- [ ] Copiar código da cor
- [ ] Preview de uso

### Tipografia
- [ ] Fontes primária, secundária, display, mono
- [ ] Configurar família e pesos
- [ ] Escala tipográfica
- [ ] Preview de texto

### Brand Voice
- [ ] Personalidade da marca (traits)
- [ ] Espectro de tom (sliders)
- [ ] Princípios de comunicação
- [ ] Do's and Don'ts
- [ ] Exemplos por contexto (website, email, social, etc.)
- [ ] Glossário de termos

### Brand Assets
- [ ] Upload de arquivos (logo, ícones, imagens, templates)
- [ ] Categorias e pastas
- [ ] Preview e metadata
- [ ] Download individual ou em lote
- [ ] Busca e filtros

---

## Technical Details

### Database Schema

```sql
-- =============================================
-- BRAND MODULE SCHEMA
-- =============================================

-- Brand Identity (main record per user)
CREATE TABLE brand_identity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,

  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,

  mission TEXT,
  vision TEXT,

  -- Logo
  logo_url TEXT,
  logo_dark_url TEXT,
  favicon_url TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Brand Values
CREATE TABLE brand_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES brand_identity(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  order_index INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Brand Colors
CREATE TABLE brand_colors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES brand_identity(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  hex TEXT NOT NULL,
  rgb_r INTEGER,
  rgb_g INTEGER,
  rgb_b INTEGER,

  color_type TEXT DEFAULT 'primary' CHECK (color_type IN ('primary', 'secondary', 'neutral', 'semantic')),
  usage TEXT,
  css_variable TEXT,

  order_index INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Brand Typography
CREATE TABLE brand_typography (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES brand_identity(id) ON DELETE CASCADE,

  role TEXT NOT NULL CHECK (role IN ('primary', 'secondary', 'display', 'mono')),

  font_family TEXT NOT NULL,
  font_category TEXT CHECK (font_category IN ('sans-serif', 'serif', 'monospace', 'display')),
  weights INTEGER[],

  google_fonts_url TEXT,
  usage TEXT,
  sample_text TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Brand Voice
CREATE TABLE brand_voice (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES brand_identity(id) ON DELETE CASCADE UNIQUE,

  personality_statement TEXT,

  -- Tone spectrum (stored as JSON)
  tone_spectrum JSONB,

  -- Principles
  principles JSONB,

  -- Do's and Don'ts
  dos TEXT[],
  donts TEXT[],

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Brand Voice Personality Traits
CREATE TABLE brand_voice_traits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voice_id UUID NOT NULL REFERENCES brand_voice(id) ON DELETE CASCADE,

  trait TEXT NOT NULL,
  icon TEXT,
  description TEXT,
  examples TEXT[],

  order_index INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Brand Voice Examples (by context)
CREATE TABLE brand_voice_examples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voice_id UUID NOT NULL REFERENCES brand_voice(id) ON DELETE CASCADE,

  context TEXT NOT NULL CHECK (context IN ('website', 'email', 'social_media', 'support', 'in_app', 'presentation')),
  category TEXT NOT NULL, -- "Headline", "CTA", etc.

  good_example TEXT NOT NULL,
  bad_example TEXT NOT NULL,
  explanation TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Brand Voice Glossary
CREATE TABLE brand_voice_glossary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voice_id UUID NOT NULL REFERENCES brand_voice(id) ON DELETE CASCADE,

  term TEXT NOT NULL,
  preferred_usage TEXT NOT NULL,
  avoid TEXT,
  context TEXT,

  order_index INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Asset Folders
CREATE TABLE brand_asset_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES brand_identity(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES brand_asset_folders(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('logos', 'icons', 'images', 'patterns', 'templates', 'social_media', 'presentations', 'documents')),

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Brand Assets
CREATE TABLE brand_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES brand_identity(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES brand_asset_folders(id) ON DELETE SET NULL,

  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,

  -- Primary file
  file_url TEXT NOT NULL,
  file_format TEXT NOT NULL,
  file_size INTEGER, -- bytes
  mime_type TEXT,

  -- Dimensions (for images)
  width INTEGER,
  height INTEGER,
  is_vector BOOLEAN DEFAULT false,

  -- Metadata
  tags TEXT[],
  usage_guidelines TEXT[],

  -- Stats
  download_count INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Asset Variations (different formats/sizes)
CREATE TABLE brand_asset_variations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES brand_assets(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_format TEXT NOT NULL,
  file_size INTEGER,

  width INTEGER,
  height INTEGER,
  dpi INTEGER,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_brand_values_brand ON brand_values(brand_id);
CREATE INDEX idx_brand_colors_brand ON brand_colors(brand_id);
CREATE INDEX idx_brand_assets_brand ON brand_assets(brand_id);
CREATE INDEX idx_brand_assets_category ON brand_assets(brand_id, category);

-- RLS
ALTER TABLE brand_identity ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_typography ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_voice ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_voice_traits ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_voice_examples ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_voice_glossary ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_asset_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_asset_variations ENABLE ROW LEVEL SECURITY;

-- All brand tables use same RLS pattern
CREATE POLICY "Users manage own brand" ON brand_identity FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own values" ON brand_values FOR ALL USING (
  brand_id IN (SELECT id FROM brand_identity WHERE user_id = auth.uid())
);
-- (Similar policies for all other tables)
```

---

## Tasks

### Phase 1: Foundation & Dashboard
- [ ] Criar migration do schema
- [ ] Implementar server actions base
- [ ] Criar Brand Dashboard
- [ ] Edição de nome, tagline, missão, visão
- [ ] Edição de valores
- [ ] Upload de logo

### Phase 2: Visual Identity
- [ ] Gerenciamento de cores
- [ ] Gerenciamento de tipografia
- [ ] Color picker component
- [ ] Typography preview

### Phase 3: Brand Voice
- [ ] Personality traits CRUD
- [ ] Tone spectrum sliders
- [ ] Principles CRUD
- [ ] Do's/Don'ts CRUD
- [ ] Examples por contexto
- [ ] Glossário CRUD

### Phase 4: Assets Library
- [ ] Upload de assets
- [ ] Folders management
- [ ] Preview e metadata
- [ ] Download (single e batch)
- [ ] Search e filters

---

## Definition of Done

- [ ] Schema criado e testado
- [ ] Dashboard editável
- [ ] Cores e tipografia gerenciáveis
- [ ] Brand Voice completo
- [ ] Assets com upload e download
- [ ] PR aprovado e merged

---

## Files to Create/Modify

```
supabase/migrations/
└── XXX_brand_module.sql                [CREATE]

app/(dashboard)/brand/
├── page.tsx                            [CREATE] (Dashboard)
├── voice/
│   └── page.tsx                        [CREATE]
└── assets/
    └── page.tsx                        [CREATE]

components/brand/
├── BrandDashboard.tsx                  [CREATE]
├── BrandOverview.tsx                   [CREATE]
├── EditIdentityModal.tsx               [CREATE]
├── ValuesEditor.tsx                    [CREATE]
├── ColorPalette.tsx                    [CREATE]
├── ColorPicker.tsx                     [CREATE]
├── TypographyEditor.tsx                [CREATE]
├── TypographyPreview.tsx               [CREATE]
├── BrandVoiceDashboard.tsx             [CREATE]
├── PersonalityTraits.tsx               [CREATE]
├── ToneSpectrum.tsx                    [CREATE]
├── VoicePrinciples.tsx                 [CREATE]
├── VoiceExamples.tsx                   [CREATE]
├── VoiceGlossary.tsx                   [CREATE]
├── AssetsLibrary.tsx                   [CREATE]
├── AssetCard.tsx                       [CREATE]
├── AssetUploader.tsx                   [CREATE]
├── AssetDetailModal.tsx                [CREATE]
├── FolderTree.tsx                      [CREATE]
└── index.ts                            [CREATE]

lib/actions/
├── brand-identity.ts                   [CREATE]
├── brand-voice.ts                      [CREATE]
└── brand-assets.ts                     [CREATE]
```

---

## Connection Layer Events

```typescript
// Eventos emitidos
"brand.identity.updated" { section, changes }
"brand.logo.uploaded" { logo_id }
"brand.color.added" { color_id }
"brand.asset.uploaded" { asset_id, category }
"brand.asset.downloaded" { asset_id }

// Eventos consumidos
// (Módulo standalone)
```

---

**Story criada por River (SM) 🌊**
**Data:** 2026-01-29
