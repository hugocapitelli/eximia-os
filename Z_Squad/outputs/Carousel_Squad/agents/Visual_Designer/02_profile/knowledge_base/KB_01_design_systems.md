---
title: "KB_01 — Design Systems for Carousels"
galaxy: "CREATION"
galaxy-color: "#FF8C00"
document-type: "knowledge-base"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "kb-01-design-systems"
  - "kb_01 — design systems for car"
  - "atomic design para carrosséis"
  - "conceito"
  - "dimensões e safe zones"
  - "instagram (recomendado)"
  - "linkedin (horizontal)"
  - "multi-platform export"
  - "sistema de grid"
  - "grid 4x4 (recomendado)"
tags:
  - "galaxy-creation"
  - "knowledge-base"
---

# KB_01 — Design Systems for Carousels

**Agente:** Visual Designer
**Categoria:** FUNDAMENTOS
**Versão:** 1.0

---

## Atomic Design para Carrosséis

### Conceito
Sistema de Brad Frost adaptado para carrosséis: construir do menor para o maior.

```
ATOMS (Elementos básicos)
├── Cores
├── Tipografia
├── Ícones
├── Formas básicas
└── Espaçamentos

MOLECULES (Combinações simples)
├── Headline + Subheadline
├── Número + Texto
├── Ícone + Label
└── Imagem + Caption

ORGANISMS (Seções completas)
├── Header do slide
├── Área de conteúdo
├── Footer com CTA
└── Layout de lista

TEMPLATES (Layouts reutilizáveis)
├── Slide de Hook
├── Slide de Conteúdo
├── Slide de Lista
├── Slide de CTA
└── Slide de Dados

PAGES (Carrossel completo)
└── Combinação de templates
```

---

## Dimensões e Safe Zones

### Instagram (Recomendado)
```
┌────────────────────────────────────┐
│           1080 x 1080 px           │
│                                    │
│  ┌──────────────────────────────┐  │
│  │      SAFE ZONE (960x960)     │  │
│  │                              │  │
│  │   ┌──────────────────────┐   │  │
│  │   │   CORE CONTENT       │   │  │
│  │   │      (840x840)       │   │  │
│  │   └──────────────────────┘   │  │
│  │                              │  │
│  └──────────────────────────────┘  │
│                                    │
│  ⚠️ Bottom 120px: UI overlap      │
└────────────────────────────────────┘
```

### LinkedIn (Horizontal)
```
1200 x 675 px (16:9)
Safe zone: 1080 x 555 px
```

### Multi-platform Export
- Master: 1080x1080 (Instagram)
- LinkedIn: Crop para 1200x675
- TikTok: Adaptar para 1080x1920

---

## Sistema de Grid

### Grid 4x4 (Recomendado)
```
┌────┬────┬────┬────┐
│ 1  │ 2  │ 3  │ 4  │
├────┼────┼────┼────┤
│ 5  │ 6  │ 7  │ 8  │
├────┼────┼────┼────┤
│ 9  │ 10 │ 11 │ 12 │
├────┼────┼────┼────┤
│ 13 │ 14 │ 15 │ 16 │
└────┴────┴────┴────┘

Cada célula: 240x240px
Gutter: 20px
Margem externa: 60px
```

### Layouts Comuns

**Centered Hero (Hook slides)**
```
┌────────────────────┐
│                    │
│   ┌────────────┐   │
│   │   HERO     │   │
│   │  ELEMENT   │   │
│   └────────────┘   │
│                    │
└────────────────────┘
```

**Split (Comparisons)**
```
┌──────────┬──────────┐
│          │          │
│   LEFT   │  RIGHT   │
│          │          │
└──────────┴──────────┘
```

**Thirds (Lists)**
```
┌────────────────────┐
│      HEADER        │
├────────────────────┤
│      CONTENT       │
├────────────────────┤
│      FOOTER/CTA    │
└────────────────────┘
```

---

## Consistência Visual

### Checklist de Consistência
- [ ] Mesma margem em todos os slides
- [ ] Mesmas fontes (máx 2-3)
- [ ] Cores dentro da paleta definida
- [ ] Alinhamento consistente
- [ ] Tamanho de texto padronizado por nível
- [ ] Estilo de ícones uniforme
- [ ] Tratamento de imagens consistente

### O que pode variar
- Layout (para quebrar monotonia)
- Proporção de elementos (enfatizar diferentes coisas)
- Intensidade de cor (dentro da paleta)

### O que NÃO deve variar
- Fontes
- Cores de marca
- Margens
- Estilo de ícones/ilustrações

---

## Tokens de Design

### Exemplo de Sistema de Tokens
```json
{
  "spacing": {
    "xs": "8px",
    "sm": "16px",
    "md": "24px",
    "lg": "40px",
    "xl": "60px"
  },
  "typography": {
    "h1": {
      "fontFamily": "Inter",
      "fontWeight": "800",
      "fontSize": "56px",
      "lineHeight": "1.1"
    },
    "h2": {
      "fontFamily": "Inter",
      "fontWeight": "600",
      "fontSize": "36px",
      "lineHeight": "1.2"
    },
    "body": {
      "fontFamily": "Inter",
      "fontWeight": "400",
      "fontSize": "24px",
      "lineHeight": "1.4"
    }
  },
  "colors": {
    "primary": "#1A1A2E",
    "secondary": "#F8F9FA",
    "accent": "#4361EE"
  },
  "radius": {
    "sm": "4px",
    "md": "8px",
    "lg": "16px",
    "full": "9999px"
  }
}
```

---

## Fontes
- Brad Frost, Atomic Design
- Massimo Vignelli, The Vignelli Canon
- Material Design Guidelines
- Apple Human Interface Guidelines

#galaxy-creation