# KB_08 — Image Treatment for Carousels

**Agente:** Visual Designer
**Categoria:** TRATAMENTO DE IMAGEM
**Versão:** 1.0

---

## Fundamentos de Tratamento de Imagem

### Por que Tratamento Importa

Raw images rarely work in carousel design. Treatment ensures:
- **Consistency** — Unified look across all slides
- **Readability** — Text legibility over images
- **Mood** — Emotional alignment with message
- **Brand** — Visual identity reinforcement

### Pipeline de Tratamento
```
┌─────────────────────────────────────────────────────────┐
│ 1. SELEÇÃO     → Escolha da imagem adequada            │
│ 2. EDIÇÃO      → Crop, ajustes básicos                 │
│ 3. CORREÇÃO    → Cor, exposição, balanço               │
│ 4. TRATAMENTO  → Filtros, overlays, efeitos            │
│ 5. OTIMIZAÇÃO  → Exportação para plataforma            │
└─────────────────────────────────────────────────────────┘
```

---

## Overlays e Gradientes

### Overlay Escuro (mais comum)
```
┌────────────────────────────────────────────────┐
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓▓▓▓▓▓▓ TEXTO BRANCO LEGÍVEL ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓▓▓▓▓▓▓ sobre overlay escuro ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
└────────────────────────────────────────────────┘

Cor: #000000
Opacidade: 40-70%
Blend Mode: Normal ou Multiply
```

### Overlay com Cor de Marca
```
┌────────────────────────────────────────────────┐
│████████████████████████████████████████████████│
│████████████████████████████████████████████████│
│████████ TEXTO EM COR CONTRASTANTE █████████████│
│████████ sobre overlay de marca   █████████████│
│████████████████████████████████████████████████│
│████████████████████████████████████████████████│
└────────────────────────────────────────────────┘

Cor: Cor primária da marca
Opacidade: 60-80%
Blend Mode: Multiply ou Overlay
```

### Gradiente Vertical (muito usado)
```
┌────────────────────────────────────────────────┐
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ 0%
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│ 30%
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│███████████████████████████████████████████████│ 70%
│██████████ TEXTO AQUI █████████████████████████│
│███████████████████████████████████████████████│ 100%
└────────────────────────────────────────────────┘

Transparente no topo → Escuro na base
Permite texto legível + imagem visível
```

### Gradiente Radial (spotlight)
```
┌────────────────────────────────────────────────┐
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓▓▓▓▓▓▓▓░░░░░░ FOCO ░░░░░░░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
└────────────────────────────────────────────────┘

Centro claro → Bordas escuras
Ideal para destacar um elemento central
```

---

## Filtros e Presets

### Filtro Preto e Branco
```
┌──────────────────────────────────────────┐
│ USO: Quando cor distrai do conteúdo      │
│                                          │
│ AJUSTES:                                 │
│ • Contrast: +10-20%                      │
│ • Highlights: -10%                       │
│ • Shadows: +10%                          │
│                                          │
│ TEXTO: Cores vibrantes se destacam       │
└──────────────────────────────────────────┘
```

### Filtro Dessaturado (muted)
```
┌──────────────────────────────────────────┐
│ USO: Elegância, minimalismo              │
│                                          │
│ AJUSTES:                                 │
│ • Saturation: -30 a -50%                 │
│ • Vibrance: -20%                         │
│ • Contrast: +5-10%                       │
│                                          │
│ RESULTADO: Cores suaves, não distrai     │
└──────────────────────────────────────────┘
```

### Filtro Alto Contraste
```
┌──────────────────────────────────────────┐
│ USO: Impacto, energia, urgência          │
│                                          │
│ AJUSTES:                                 │
│ • Contrast: +30-50%                      │
│ • Clarity: +20%                          │
│ • Shadows: -10%                          │
│ • Highlights: +10%                       │
│                                          │
│ RESULTADO: Punchy, chamativo             │
└──────────────────────────────────────────┘
```

### Filtro Warm (dourado/âmbar)
```
┌──────────────────────────────────────────┐
│ USO: Aconchego, nostalgia, confiança     │
│                                          │
│ AJUSTES:                                 │
│ • Temperature: +15-25                    │
│ • Tint: +5 (magenta)                     │
│ • Orange saturation: +10%                │
│                                          │
│ RESULTADO: Golden hour feel              │
└──────────────────────────────────────────┘
```

### Filtro Cool (azul/ciano)
```
┌──────────────────────────────────────────┐
│ USO: Tecnologia, profissionalismo, calma │
│                                          │
│ AJUSTES:                                 │
│ • Temperature: -15 a -25                 │
│ • Tint: -5 (verde)                       │
│ • Blue saturation: +10%                  │
│                                          │
│ RESULTADO: Tech/corporate feel           │
└──────────────────────────────────────────┘
```

---

## Consistência Visual

### Regras de Consistência
```
┌─────────────────────────────────────────────────────────┐
│ SLIDE 1     SLIDE 2     SLIDE 3     SLIDE 4     SLIDE 5 │
│ ┌─────┐     ┌─────┐     ┌─────┐     ┌─────┐     ┌─────┐ │
│ │ WRM │     │ WRM │     │ WRM │     │ WRM │     │ WRM │ │
│ │ +10 │     │ +10 │     │ +10 │     │ +10 │     │ +10 │ │
│ └─────┘     └─────┘     └─────┘     └─────┘     └─────┘ │
│                                                         │
│ ✓ Mesmo filtro em todos os slides                       │
│ ✓ Mesma intensidade de overlay                          │
│ ✓ Mesmo estilo de tratamento                            │
└─────────────────────────────────────────────────────────┘
```

### Preset de Marca (criar e salvar)
```
PRESET: [Nome da Marca]
────────────────────────
Exposure: +0.1
Contrast: +15
Highlights: -10
Shadows: +5
Whites: 0
Blacks: -5
Vibrance: -20
Saturation: -10
Temperature: +8
Tint: 0
Clarity: +10
────────────────────────
Overlay: #1A1A2E @ 50%
────────────────────────

Salvar como Lightroom Preset ou Figma Style
```

---

## Duotone e Color Grading

### Duotone Básico
```
┌────────────────────────────────────────────────┐
│                                                │
│  SOMBRAS      →     #1A1A2E (azul escuro)      │
│  HIGHLIGHTS   →     #F8F9FA (branco/creme)     │
│                                                │
│  ┌──────────────────────────────────────────┐  │
│  │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  │
│  │▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░▓▓▓▓▓▓▓▓▓│  │
│  │▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▓▓▓▓▓│  │
│  │▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░▓▓▓▓▓▓▓▓▓│  │
│  │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  │
│  └──────────────────────────────────────────┘  │
│                                                │
│  Resultado: Imagem com duas cores apenas       │
└────────────────────────────────────────────────┘
```

### Paletas Duotone Populares
```
┌────────────────────────────────────────────────────────┐
│ Nome          │ Sombra     │ Luz       │ Mood          │
├───────────────┼────────────┼───────────┼───────────────┤
│ Midnight      │ #1A1A2E    │ #F8F9FA   │ Elegante      │
│ Ocean         │ #023E8A    │ #CAF0F8   │ Calmo         │
│ Sunset        │ #9D4EDD    │ #FFBA08   │ Criativo      │
│ Forest        │ #1B4332    │ #B7E4C7   │ Natural       │
│ Coral         │ #E63946    │ #F1FAEE   │ Energético    │
│ Gold          │ #5E503F    │ #F4D58D   │ Premium       │
└────────────────────────────────────────────────────────┘
```

---

## Efeitos Especiais

### Blur de Fundo
```
┌────────────────────────────────────────────────┐
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░┌────────────────────────────────┐░░░░░░░░│
│░░░░░│                                │░░░░░░░░│
│░░░░░│    TEXTO NÍTIDO               │░░░░░░░░│
│░░░░░│    sobre fundo blur           │░░░░░░░░│
│░░░░░│                                │░░░░░░░░│
│░░░░░└────────────────────────────────┘░░░░░░░░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
└────────────────────────────────────────────────┘

Gaussian Blur: 15-30px
Mantém contexto visual sem distrair
```

### Grain/Noise (vintage)
```
┌──────────────────────────────────────────┐
│ USO: Autenticidade, vintage, editorial   │
│                                          │
│ AJUSTES:                                 │
│ • Amount: 5-15%                          │
│ • Size: Fine (pequeno)                   │
│ • Roughness: 50%                         │
│                                          │
│ ⚠️ Cuidado: muito grain = baixa qualidade│
└──────────────────────────────────────────┘
```

### Vinheta
```
┌────────────────────────────────────────────────┐
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░▓▓▓▓▓▓▓▓▓▓▓▓│
│▓▓▓▓░░░░░░░░░░░ FOCO ░░░░░░░░░░░░░░░░▓▓▓▓▓▓▓▓▓│
│▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░▓▓▓▓▓▓▓▓▓▓▓▓│
│▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
└────────────────────────────────────────────────┘

Amount: -20 a -40 (escurece bordas)
Direciona atenção para o centro
```

---

## Fontes de Imagem

### Bancos de Imagem Gratuitos
```
┌──────────────────────────────────────────────────────┐
│ Unsplash        │ unsplash.com        │ Alta qualidade│
│ Pexels          │ pexels.com          │ Diversidade   │
│ Pixabay         │ pixabay.com         │ Quantidade    │
│ Burst (Shopify) │ burst.shopify.com   │ E-commerce    │
│ Kaboompics      │ kaboompics.com      │ Lifestyle     │
└──────────────────────────────────────────────────────┘
```

### Bancos Premium
```
┌──────────────────────────────────────────────────────┐
│ Shutterstock    │ shutterstock.com    │ Maior acervo  │
│ Adobe Stock     │ stock.adobe.com     │ Integração    │
│ Getty Images    │ gettyimages.com     │ Editorial     │
│ iStock          │ istockphoto.com     │ Custo-benefício│
└──────────────────────────────────────────────────────┘
```

---

## Tools e Recursos

### Edição de Imagem
- **Adobe Lightroom**: Edição profissional + presets
- **Photoshop**: Manipulação avançada
- **VSCO**: Mobile + presets populares
- **Snapseed**: Mobile + poderoso

### Remoção de Fundo
- **Remove.bg**: Automático e rápido
- **Canva Background Remover**: Integrado
- **Photoshop**: Select Subject + Refine Edge

### Overlays e Gradientes
- **Figma**: Camadas + blend modes
- **Canva**: Templates prontos
- **Photoshop**: Layer styles

---

## Checklist de Tratamento

- [ ] Imagem de alta resolução (min 1080px)
- [ ] Crop adequado para formato
- [ ] Correção de cor aplicada
- [ ] Overlay/gradiente para legibilidade
- [ ] Filtro consistente com outras imagens
- [ ] Contraste adequado para texto
- [ ] Exportação em sRGB
- [ ] Tamanho de arquivo otimizado

---

## Fontes de Referência
- Adobe Lightroom Documentation
- Color Grading Academy
- Phlearn (Aaron Nace) Tutorials
- VSCO Film Emulation Guides
