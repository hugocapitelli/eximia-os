# PRP-01: Homepage (ExímIA Ventures)
## Page Requirement Page - Página Principal

**Versão:** 1.0  
**Data:** 18/01/2026  
**Autor:** Antigravity AI + Hugo Capitelli

---

## 📋 Visão Geral

### Objetivo da Página
Apresentar a ExímIA Ventures como **ecossistema integrado** de excelência empresarial através de IA, destacando os 3 braços de negócio (Studio, Academy, Excellence) e direcionando visitantes para conversão.

### Público-Alvo
- C-Level de empresas em crescimento
- Gestores de Operações e RH/T&D
- Founders e Executivos buscando soluções de IA com ética

### Métricas de Sucesso
- Taxa de clique nos CTAs dos braços (>15%)
- Tempo na página (>2min)
- Taxa de conversão para "Conversar" (>5%)

---

## 🎨 Wireframe Completo

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              NAVIGATION BAR                                   │
│  (Sticky, background blur glassmorphism quando scroll)                       │
│                                                                               │
│  [LOGO exímIA     Home  Ecossistema ▼  Como Funciona  Cases  Contato        │
│   Ventures SVG]                                                               │
│   (120x40px)           (Links #14181b, hover #497ebd, transition 300ms)      │
│                                                                               │
│  Dropdown "Ecossistema":                                                      │
│    • ExímIA Studio                                                            │
│    • ExímIA Academy                                                           │
│    • ExímIA Excellence                                                        │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                              HERO SECTION                                     │
│  (Background: Linear gradient #1b3c6b → #174d68, padding 160px 0)           │
│  (Overlay: Particle animation subtle - dots conectando)                      │
│                                                                               │
│                                                                               │
│                     [Animation Container - 400x300px]                         │
│                    ┌────────────────────────────────┐                        │
│                    │  Animação Lottie/SVG:          │                        │
│                    │  3 pilares (Studio, Academy,   │                        │
│                    │  Excellence) se conectando     │                        │
│                    │  formando templo grego         │                        │
│                    │  com partículas de IA          │                        │
│                    └────────────────────────────────┘                        │
│                                                                               │
│                                                                               │
│                       IA sob Medida para                                      │
│                      Decisões Mais Humanas                                    │
│               (H1, Roboto Black 3.815rem, #ffffff)                           │
│                                                                               │
│                                                                               │
│        Ecossistema de estratégia, tecnologia e ética que amplifica           │
│       sua capacidade de pensar, decidir e agir no que realmente importa.     │
│                (P.lead, Roboto Light 1.563rem, #e6eeea)                      │
│                                                                               │
│                                                                               │
│                     [🚀 Conhecer Nosso Ecossistema]                          │
│                  (Button Primary, 180px, hover scale 1.05)                   │
│                                                                               │
│                                                                               │
│                        [Scroll indicator animado ↓]                           │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                          O ECOSSISTEMA EXIMIA                                 │
│                   (Background: #e6eeea, padding 120px 0)                     │
│                                                                               │
│                                                                               │
│                    Três Braços. Uma Estratégia Integrada.                    │
│                        (H2, Roboto Bold 3.052rem, #14181b)                   │
│                                                                               │
│                   Não somos apenas consultoria OU tecnologia.                │
│                  Somos um ecossistema completo que transforma                │
│                      intenção estratégica em impacto real.                   │
│                           (P, 1.25rem, #1b3c6b)                              │
│                                                                               │
│                                                                               │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐ │
│  │  [CARD - STUDIO]    │  │ [CARD - ACADEMY]    │  │ [CARD - EXCELLENCE] │ │
│  │  (350x500px)        │  │ (350x500px)         │  │ (350x500px)         │ │
│  │                     │  │                     │  │                     │ │
│  │  ┌───────────────┐  │  │ ┌───────────────┐  │  │ ┌───────────────┐  │ │
│  │  │   Icon 🤖     │  │  │ │   Icon 🎓     │  │  │ │   Icon ⚡     │  │ │
│  │  │   (64x64px    │  │  │ │   (64x64px    │  │  │ │   (64x64px    │  │ │
│  │  │   #497ebd)    │  │  │ │   #fdbe66)    │  │  │ │   #f58873)    │  │ │
│  │  └───────────────┘  │  │ └───────────────┘  │  │ └───────────────┘  │ │
│  │                     │  │                     │  │                     │ │
│  │  ExímIA Studio      │  │  ExímIA Academy     │  │  ExímIA Excellence  │ │
│  │  (H3, 1.953rem)     │  │  (H3, 1.953rem)     │  │  (H3, 1.953rem)     │ │
│  │                     │  │                     │  │                     │ │
│  │  Execution          │  │  Universidades      │  │  Frameworks         │ │
│  │  Intelligence       │  │  Corporativas       │  │  Automatizados      │ │
│  │  (Subtitle, 1.25rem)│  │  com IA             │  │                     │ │
│  │                     │  │  (Subtitle)         │  │  (Subtitle)         │ │
│  │                     │  │                     │  │                     │ │
│  │  ─────────────      │  │  ─────────────      │  │  ─────────────      │ │
│  │  (Divider #cdd5da)  │  │                     │  │                     │ │
│  │                     │  │                     │  │                     │ │
│  │  Transformamos      │  │  Projetamos UCs     │  │  Automatizamos      │ │
│  │  decisões em        │  │  com Academias      │  │  metodologias de    │ │
│  │  sistemas que       │  │  temáticas + IA     │  │  excelência (Lean,  │ │
│  │  executam, aprendem │  │  adaptativa para    │  │  OKRs, Hoshin) em   │ │
│  │  e amplificam       │  │  empoderar pessoas  │  │  sistemas prontos   │ │
│  │  capacidade humana  │  │  continuamente      │  │  para usar          │ │
│  │  de agir.           │  │                     │  │                     │ │
│  │  (Body, 1rem)       │  │  (Body, 1rem)       │  │  (Body, 1rem)       │ │
│  │                     │  │                     │  │                     │ │
│  │  "IA como Meio.     │  │  "IA Aplicada à     │  │  "Frameworks de     │ │
│  │   Execução como     │  │   Excelência        │  │   Excelência,       │ │
│  │   Prioridade."      │  │   Empresarial"      │  │   Automatizados"    │ │
│  │  (Caption italic,   │  │  (Caption)          │  │  (Caption)          │ │
│  │   #497ebd)          │  │   #fdbe66)          │  │   #f58873)          │ │
│  │                     │  │                     │  │                     │ │
│  │  [Saiba Mais →]     │  │  [Saiba Mais →]     │  │  [Saiba Mais →]     │ │
│  │  (Link, hover       │  │                     │  │                     │ │
│  │   underline)        │  │                     │  │                     │ │
│  │                     │  │                     │  │                     │ │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘ │
│                                                                               │
│  (Grid 3 colunas, gap 32px, cards com box-shadow-lg                         │
│   hover: transform translateY(-8px), transition 300ms)                       │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                        COMO FUNCIONA (INTEGRAÇÃO)                             │
│         (Background: Gradient #fdbe66 → #f58873, padding 120px 0)           │
│                                                                               │
│                                                                               │
│                   Do Diagnóstico à Perpetuação Cultural                      │
│                        (H2, Roboto Bold, #14181b)                            │
│                                                                               │
│               Não entregamos projetos isolados. Criamos ecossistemas.        │
│                           (P.lead, #174d68)                                  │
│                                                                               │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────┐       │
│  │                  [Diagrama de Fluxo Interativo]                   │       │
│  │                                                                    │       │
│  │    1. STUDIO  →  Diagnóstico de Execução                         │       │
│  │       "Equipes sobrecarregadas, sem clareza"                      │       │
│  │                                                                    │       │
│  │                      ↓                                             │       │
│  │                                                                    │       │
│  │    2. ACADEMY  →  Design da Universidade Corporativa             │       │
│  │       "Não dominam Hoshin, não entendem o porquê"                │       │
│  │                                                                    │       │
│  │                      ↓                                             │       │
│  │                                                                    │       │
│  │    3. EXCELLENCE  →  Ferramentas Automatizadas                   │       │
│  │       "StratOS Platform para liberar tempo"                       │       │
│  │                                                                    │       │
│  │                      ↓                                             │       │
│  │                                                                    │       │
│  │    4. STUDIO  →  Agentes como Parceiros                          │       │
│  │       "IA sugere, humanos decidem"                                │       │
│  │                                                                    │       │
│  │                      ↓                                             │       │
│  │                                                                    │       │
│  │    5. ACADEMY  →  Comunidade de Prática                          │       │
│  │       "Líderes aprendem uns com os outros"                        │       │
│  │                                                                    │       │
│  │                      ↓                                             │       │
│  │                                                                    │       │
│  │    6. EXCELLENCE  →  Evolução Contínua                           │       │
│  │       "Ferramenta melhora com feedback"                           │       │
│  │                                                                    │       │
│  │  🎯 RESULTADO: Trabalha com propósito, menos stress, mais dignidade│       │
│  │                                                                    │       │
│  └──────────────────────────────────────────────────────────────────┘       │
│  (Cada passo: card hover com fade-in de detalhes)                           │
│                                                                               │
│                                                                               │
│                     [Ver Caso Completo em Ação →]                            │
│                         (Button Secondary)                                    │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                           CASES INTEGRADOS                                    │
│                      (Background: #ffffff, padding 120px 0)                  │
│                                                                               │
│                                                                               │
│                    Impacto Real. Métricas Honestas.                          │
│                         (H2, Roboto Bold, #14181b)                           │
│                                                                               │
│                                                                               │
│  ┌────────────────────────────────────────────────────────────┐             │
│  │  [CASE CARD - Glassmorphism]                               │             │
│  │  (800x400px, background rgba blur, border 1px #cdd5da)     │             │
│  │                                                             │             │
│  │  📊 CASO: Hoshin Kanri em Manufatureira                    │             │
│  │     (H3, 1.953rem, #1b3c6b)                                │             │
│  │                                                             │             │
│  │  ──────────────────────────────────────                    │             │
│  │                                                             │             │
│  │  Desafio:                                                   │             │
│  │  Alinhar 500 pessoas à estratégia sem perder               │             │
│  │  clareza e engajamento                                      │             │
│  │                                                             │             │
│  │  Solução Integrada:                                         │             │
│  │  ✓ STUDIO - Diagnóstico de alinhamento                    │             │
│  │  ✓ EXCELLENCE - StratOS Platform implementado             │             │
│  │  ✓ ACADEMY - Academia de Estratégia criada                │             │
│  │                                                             │             │
│  │  Resultado:                                                 │             │
│  │  • 90% alinhamento estratégico (vs. 40% antes)             │             │
│  │  • -60% tempo de desdobramento                             │             │
│  │  • Cultura de execução perpetuada internamente             │             │
│  │                                                             │             │
│  │  Impacto Humano:                                            │             │
│  │  "Equipes trabalham com propósito claro, não apenas tarefas"│            │
│  │  — Diretor de Operações                                    │             │
│  │                                                             │             │
│  └────────────────────────────────────────────────────────────┘             │
│                                                                               │
│                                                                               │
│                         [Ver Mais Cases →]                                   │
│                         (Link Text, #497ebd)                                 │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                           CTA SEGMENTADO                                      │
│              (Background: #1b3c6b, padding 100px 0, text #ffffff)           │
│                                                                               │
│                                                                               │
│                  Qual Desafio Você Precisa Resolver?                         │
│                         (H2, Roboto Bold, #ffffff)                           │
│                                                                               │
│                                                                               │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐          │
│  │                  │  │                  │  │                  │          │
│  │   Estratégia     │  │   Aprendizado    │  │   Frameworks     │          │
│  │   não executa?   │  │   não perpetua?  │  │   não funcionam  │          │
│  │                  │  │                  │  │   na prática?    │          │
│  │   (H4, #ffffff)  │  │   (H4)           │  │   (H4)           │          │
│  │                  │  │                  │  │                  │          │
│  │   → STUDIO       │  │   → ACADEMY      │  │   → EXCELLENCE   │          │
│  │   (Badge accent) │  │   (Badge)        │  │   (Badge)        │          │
│  │                  │  │                  │  │                  │          │
│  │  [Diagnosticar   │  │  [Transformar    │  │  [Ver Soluções]  │          │
│  │   Execução]      │  │   Nossa UC]      │  │                  │          │
│  │  (Button Ghost)  │  │  (Button Ghost)  │  │  (Button Ghost)  │          │
│  │                  │  │                  │  │                  │          │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘          │
│                                                                               │
│                                                                               │
│                  Ou prefere conversar sobre tudo junto?                      │
│                           (P, 1.25rem, #e6eeea)                              │
│                                                                               │
│                   [📞 Agendar Conversa Estratégica]                          │
│                  (Button Primary Accent, #fdbe66)                            │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                                 FOOTER                                        │
│               (Background: #14181b, padding 80px 0, text #cdd5da)           │
│                                                                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │ [LOGO Vertical] │  │  ECOSSISTEMA    │  │  EMPRESA         │             │
│  │ (80x100px)      │  │                  │  │                  │             │
│  │                  │  │  • ExímIA Studio│  │  • Sobre Nós     │             │
│  │ "IA sob medida   │  │  • ExímIA       │  │  • Por que       │             │
│  │  para decisões   │  │    Academy      │  │    "ExímIA"?     │             │
│  │  mais humanas"   │  │  • ExímIA       │  │  • Nossa Visão   │             │
│  │  (Caption)       │  │    Excellence   │  │  • Valores       │             │
│  │                  │  │                  │  │                  │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
│                                                                               │
│  ┌─────────────────┐  ┌─────────────────────────────────────┐               │
│  │  RECURSOS       │  │  CONTATO                             │               │
│  │                  │  │                                      │               │
│  │  • Cases        │  │  📧 contato@eximia.ventures          │               │
│  │  • Como Funciona│  │  🔗 LinkedIn                         │               │
│  │  • Blog (soon)  │  │  📍 São Paulo, Brasil                │               │
│  │                  │  │                                      │               │
│  └─────────────────┘  └─────────────────────────────────────┘               │
│                                                                               │
│  ─────────────────────────────────────────────────────────────────           │
│                                                                               │
│  © 2026 ExímIA Ventures. Excelência através de IA. | Privacidade | Termos   │
│                    (Caption, #cdd5da, centered)                              │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Especificações de Design

### Paleta de Cores (desta página)
```css
--hero-bg: linear-gradient(135deg, #1b3c6b 0%, #174d68 100%);
--section-alt-bg: #e6eeea;
--cta-bg: linear-gradient(135deg, #fdbe66 0%, #f58873 100%);
--footer-bg: #14181b;
```

### Tipografia
- **H1 Hero:** Roboto Black, 3.815rem (61px), line-height 1.2
- **H2 Sections:** Roboto Bold, 3.052rem (49px), line-height 1.2
- **H3 Cards:** Roboto Bold, 1.953rem (31px)
- **Body:** Roboto Regular, 1rem (16px), line-height 1.75
- **Lead:** Roboto Light, 1.563rem (25px), line-height 1.75

### Espaçamento
- **Section padding:** 120px vertical (mobile: 64px)
- **Container max-width:** 1200px
- **Grid gap:** 32px

---

## ⚙️ Comportamentos e Interações

### Navigation Bar
**Estado Normal:**
- Background: transparent (sobre hero)
- Transição para background blur glassmorphism após scroll 100px

**Dropdown "Ecossistema":**
- Trigger: hover ou click
- Animation: fade-in 200ms + slide-down 10px
- Background: rgba(255,255,255,0.95) backdrop-filter blur(10px)

### Cards dos Braços
**Hover State:**
- Transform: translateY(-8px)
- Box-shadow: aumenta de lg para xl
- Transition: all 300ms ease-out-back
- Icon: scale(1.1) rotate(5deg)

### Botões
**Primary:**
- Background: #fdbe66
- Hover: darken 10% + scale(1.05)
- Active: scale(0.98)

**Secondary:**
- Border: 2px solid #497ebd
- Hover: background #497ebd, color white

**Ghost (em CTA dark):**
- Border: 1px solid #ffffff
- Hover: background rgba(255,255,255,0.1)

---

## 📱 Responsividade

### Breakpoints
- **Desktop:** 1024px+
- **Tablet:** 768px - 1023px
- **Mobile:** < 768px

### Ajustes Mobile
**Hero:**
- Font-size H1: 2.441rem (39px)
- Padding: 80px 0
- Animation container: 280 x240px

**Cards Ecossistema:**
- Grid: 1 coluna
- Width: 100%
- Padding lateral: 16px

**Diagrama Integração:**
- Stack vertical
- Texto reduzido

---

## 📝 Copy Final

### Meta Tags
```html
<title>ExímIA Ventures | IA sob Medida para Decisões Mais Humanas</title>
<meta name="description" content="Ecossistema de excelência empresarial através de IA. Transformamos estratégia em execução com consultoria (Studio), educação (Academy) e automação (Excellence).">
<meta property="og:title" content="ExímIA Ventures | IA Humanizada para Empresas">
<meta property="og:image" content="/og-home.jpg">
```

### Alt Texts
- Logo: "ExímIA Ventures - Excelência através de IA"
- Icon Studio: "Ícone representando Execution Intelligence"
- Icon Academy: "Ícone representando Universidades Corporativas"
- Icon Excellence: "Ícone representando Automação de Frameworks"

---

## ✅ Checklist de Implementação

- [ ] Implementar navigation sticky com blur effect
- [ ] Adicionar animação Lottie no hero (ou placeholder SVG)
- [ ] Criar componente Card reutilizável com hover states
- [ ] Implementar diagrama de integração (pode ser imagem SVG)
- [ ] Adicionar scroll-reveal animations (fade-in-up) nas sections
- [ ] Configurar meta tags e Open Graph
- [ ] Testar responsividade em 3 breakpoints
- [ ] Validar acessibilidade (contraste, focus states)
- [ ] Otimizar performance (lazy load images, CSS crítico)

---

**Próximo PRP:** [PRP-02: Página Sobre Nós](./PRP-02-sobre.md)
