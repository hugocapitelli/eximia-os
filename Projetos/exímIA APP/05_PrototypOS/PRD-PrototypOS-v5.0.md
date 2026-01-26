# PRD — PrototypOS (Prototipagem)
**Módulo:** 05_PrototypOS
**Versão:** 5.0
**Data:** 25 Janeiro 2026
**Status:** Especificação Completa

---

## Sumário Executivo

O **PrototypOS** é a ferramenta de design e prototipagem de produtos — onde ideias se transformam em especificações executáveis.

---

## Índice

1. [Features](#1-features)
2. [Modelos de Dados](#2-modelos-de-dados)
3. [API Endpoints](#3-api-endpoints)

---

# 1. Features

| Feature | Descrição | Rota |
|---------|-----------|------|
| **Dashboard** | Lista de projetos ativos | `/prototyper` |
| **PRD Generator** | Gerador de Product Requirements Document | `/prototyper/new` |
| **PRP Generator** | Gerador de Product Requirement Prompt | `/prototyper/project/:id/prp` |
| **Design Systems** | Biblioteca de design systems salvos | `/prototyper/design-systems` |
| **Project Board** | Kanban de desenvolvimento | `/prototyper/project/:id/board` |
| **Visual Builder** | Construtor de identidade visual | `/prototyper/project/:id/visuals` |
| **Agent Config** | Configuração de agentes IA | `/prototyper/settings` |

## 1.1 Design Systems Library

Permite salvar, organizar e reutilizar design systems de cada projeto.

**Exportação:**
- JSON (backup/import)
- CSS Variables
- Tailwind Config
- Figma Tokens
- Style Dictionary

---

# 2. Modelos de Dados

## 2.1 DesignSystem

```typescript
interface DesignSystem {
  id: string;
  project_id?: string;

  // Info
  name: string;
  description?: string;
  version: string;
  thumbnail_url?: string;

  // Cores
  colors: {
    primary: ColorScale;
    secondary: ColorScale;
    accent: ColorScale;
    neutral: ColorScale;
    semantic: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
  };

  // Tipografia
  typography: {
    font_family_display: string;
    font_family_body: string;
    font_family_mono: string;
    scale: TypographyScale[];
  };

  // Espaçamento, Radius, Shadows
  spacing: { base: number; scale: number[]; };
  radius: Record<string, string>;
  shadows: Record<string, string>;

  // Componentes
  components: DesignSystemComponent[];

  created_at: Date;
  updated_at: Date;
}
```

---

# 3. API Endpoints

```
# Projects
GET/POST   /api/prototyper/projects
GET/PUT/DELETE /api/prototyper/projects/:id

# Design Systems
GET/POST   /api/prototyper/design-systems
GET/PUT/DELETE /api/prototyper/design-systems/:id
POST       /api/prototyper/design-systems/:id/export
```

---

*PrototypOS v5.0 — Ideias em Código*
*ExímIA OS — 2026*
