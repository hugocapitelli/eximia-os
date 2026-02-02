# KB_10 — Animation and Motion for Carousels

**Agente:** Visual Designer
**Categoria:** MOVIMENTO E ANIMAÇÃO
**Versão:** 1.0

---

## Fundamentos de Motion Design

### Por que Movimento Importa

Static carousels work, but motion elevates them:
- **Attention capture** — Movement draws the eye
- **Storytelling** — Animation guides narrative flow
- **Engagement** — Interactive feel increases dwell time
- **Premium perception** — Subtle motion = high quality

### Quando Usar Motion
```
┌─────────────────────────────────────────────────────────┐
│ IDEAL PARA:                                            │
│ ✓ Hook slides (primeira impressão)                     │
│ ✓ Revelação de dados/números                           │
│ ✓ Transições entre conceitos                           │
│ ✓ CTAs e elementos interativos                         │
│ ✓ Listas que aparecem sequencialmente                  │
│                                                         │
│ EVITAR QUANDO:                                          │
│ ✗ Texto longo para leitura                             │
│ ✗ Informação crítica que precisa ser vista imediatamente│
│ ✗ Múltiplas animações competindo                       │
│ ✗ Conteúdo sensível ou sério                           │
└─────────────────────────────────────────────────────────┘
```

---

## Tipos de Animação para Carrosséis

### 1. Entrance Animations (Entrada)
```
┌────────────────────────────────────────────────────────┐
│ FADE IN                                                │
│ ░░░░ → ▓▓▓▓ → ████                                    │
│ Opacidade: 0% → 100%                                   │
│ Duração: 300-500ms                                     │
│ Uso: Universal, sutil                                  │
├────────────────────────────────────────────────────────┤
│ SLIDE UP                                               │
│       ████                                             │
│   ↑   ████                                             │
│   │   ████                                             │
│ ████                                                   │
│ De baixo para cima                                     │
│ Duração: 400-600ms                                     │
│ Uso: Listas, bullet points                             │
├────────────────────────────────────────────────────────┤
│ SCALE UP                                               │
│    ██  →  ████  →  ████████                           │
│ Escala: 80% → 100%                                     │
│ Duração: 300-400ms                                     │
│ Uso: Destaques, CTAs                                   │
├────────────────────────────────────────────────────────┤
│ SLIDE FROM LEFT/RIGHT                                  │
│  →→→ ████                                              │
│ Horizontal entry                                       │
│ Duração: 400-500ms                                     │
│ Uso: Comparações, antes/depois                         │
└────────────────────────────────────────────────────────┘
```

### 2. Emphasis Animations (Ênfase)
```
┌────────────────────────────────────────────────────────┐
│ PULSE                                                  │
│ ████ → ██████ → ████ → ██████                         │
│ Escala: 100% → 105% → 100%                            │
│ Loop: Infinito (sutil)                                 │
│ Uso: CTAs, elementos clicáveis                         │
├────────────────────────────────────────────────────────┤
│ GLOW/SHADOW                                            │
│ ░████░ → ▒████▒ → ░████░                              │
│ Shadow spread oscila                                   │
│ Uso: Destaques, premium feel                           │
├────────────────────────────────────────────────────────┤
│ SHAKE                                                  │
│ ████ ← → ← → ████                                      │
│ Movimento horizontal rápido                            │
│ Uso: Alertas, erros, atenção urgente                   │
├────────────────────────────────────────────────────────┤
│ BOUNCE                                                 │
│    ▲                                                   │
│ ████  (up-down-settle)                                 │
│ Uso: Sucesso, celebração, gamification                 │
└────────────────────────────────────────────────────────┘
```

### 3. Data/Number Animations
```
┌────────────────────────────────────────────────────────┐
│ COUNT UP                                               │
│ 0 → 25 → 50 → 75 → 97%                                │
│ Números incrementam até valor final                    │
│ Duração: 1-2 segundos                                  │
│ Easing: easeOutExpo (rápido início, desacelera)        │
├────────────────────────────────────────────────────────┤
│ PROGRESS BAR                                           │
│ [░░░░░░░░░░] → [████░░░░░░] → [██████████]            │
│ Barra preenche gradualmente                            │
│ Duração: 1-1.5 segundos                                │
├────────────────────────────────────────────────────────┤
│ CHART REVEAL                                           │
│   │                    │▓▓                             │
│   │      →             │▓▓▓                           │
│   └────                └▓▓▓▓                          │
│ Barras/linhas crescem do zero                          │
│ Duração: 800ms-1.2s                                    │
└────────────────────────────────────────────────────────┘
```

---

## Easing (Curvas de Movimento)

### Curvas Essenciais
```
┌────────────────────────────────────────────────────────┐
│ LINEAR                                                 │
│ ──────────────────→                                   │
│ Velocidade constante                                   │
│ Uso: Loops infinitos, progress bars                    │
│ Evitar: Movimento natural                              │
├────────────────────────────────────────────────────────┤
│ EASE-IN-OUT                                            │
│     ╱──────╲                                          │
│ ──╱          ╲──→                                     │
│ Acelera e desacelera                                   │
│ Uso: Transições, movimento de UI                       │
│ CSS: cubic-bezier(0.42, 0, 0.58, 1)                    │
├────────────────────────────────────────────────────────┤
│ EASE-OUT                                               │
│ ╱╲                                                     │
│ │  ╲───────────→                                      │
│ Início rápido, final suave                             │
│ Uso: Entradas de elementos                             │
│ CSS: cubic-bezier(0, 0, 0.2, 1)                        │
├────────────────────────────────────────────────────────┤
│ EASE-IN                                                │
│              ╱│                                        │
│ ───────────╱ │→                                       │
│ Início lento, final rápido                             │
│ Uso: Saídas de elementos                               │
│ CSS: cubic-bezier(0.4, 0, 1, 1)                        │
├────────────────────────────────────────────────────────┤
│ SPRING/BOUNCE                                          │
│      ╱╲                                                │
│ ────╱  ╲╱╲──→                                         │
│ Overshoot e settle                                     │
│ Uso: Celebração, gamification                          │
│ Frameworks: Framer Motion, React Spring                │
└────────────────────────────────────────────────────────┘
```

---

## Timing e Duração

### Durações Recomendadas
```
┌──────────────────────────────────────────────────────┐
│ AÇÃO                    │ DURAÇÃO      │ NOTAS       │
├─────────────────────────┼──────────────┼─────────────┤
│ Micro-interação         │ 100-200ms    │ Instantâneo │
│ Feedback de botão       │ 150-250ms    │ Responsivo  │
│ Fade simples            │ 200-300ms    │ Sutil       │
│ Entrada de elemento     │ 300-500ms    │ Perceptível │
│ Transição de slide      │ 400-600ms    │ Suave       │
│ Animação complexa       │ 600-1000ms   │ Storytelling│
│ Count up de número      │ 1000-2000ms  │ Dramático   │
└──────────────────────────────────────────────────────┘

REGRA: Quanto maior a distância/mudança, maior a duração
```

### Stagger (Escalonamento)
```
┌────────────────────────────────────────────────────────┐
│                                                        │
│  0ms    ████ Item 1                                   │
│                                                        │
│  100ms      ████ Item 2                               │
│                                                        │
│  200ms          ████ Item 3                           │
│                                                        │
│  300ms              ████ Item 4                       │
│                                                        │
│ Delay entre itens: 50-150ms                            │
│ Cria fluxo natural e evita sobrecarga                  │
└────────────────────────────────────────────────────────┘
```

---

## Motion para Instagram Específico

### Stories/Reels (Vídeo)
```
┌────────────────────────────────────────────────────────┐
│ FORMATO: MP4/MOV                                       │
│ DURAÇÃO: 3-15 segundos por slide                       │
│ FPS: 30 fps (mínimo), 60 fps (suave)                  │
│ RESOLUÇÃO: 1080x1920 (9:16)                           │
│                                                        │
│ TÉCNICAS:                                              │
│ • Texto aparece com animação                           │
│ • Background sutil (parallax, zoom lento)              │
│ • Transições entre blocos de conteúdo                  │
│ • CTA final com ênfase (pulse, glow)                   │
└────────────────────────────────────────────────────────┘
```

### Carousel Estático (com Ilusão de Movimento)
```
┌────────────────────────────────────────────────────────┐
│ TÉCNICA: Continuidade Visual                           │
│                                                        │
│ Slide 1        Slide 2        Slide 3                 │
│ ┌─────────┐    ┌─────────┐    ┌─────────┐            │
│ │   →     │    │  →      │    │ →       │            │
│ │  ████   │    │   ████  │    │    ████ │            │
│ │         │    │         │    │         │            │
│ └─────────┘    └─────────┘    └─────────┘            │
│                                                        │
│ Elemento "se move" entre slides                        │
│ Swipe cria animação implícita                          │
└────────────────────────────────────────────────────────┘
```

---

## Ferramentas de Animação

### Design & Prototipagem
```
┌──────────────────────────────────────────────────────┐
│ FERRAMENTA     │ USO                │ COMPLEXIDADE  │
├────────────────┼────────────────────┼───────────────┤
│ Figma          │ Protótipos básicos │ Baixa         │
│ Figma + Motionity│ Animações avançadas│ Média        │
│ Framer         │ Micro-interações   │ Média         │
│ Principle      │ Transições UI      │ Média         │
│ After Effects  │ Motion graphics    │ Alta          │
│ Lottie         │ Animações web      │ Média         │
└──────────────────────────────────────────────────────┘
```

### Exportação para Social
```
┌──────────────────────────────────────────────────────┐
│ After Effects → Media Encoder → MP4 (H.264)          │
│                                                      │
│ Canva → Download → MP4/GIF                           │
│                                                      │
│ Figma → Plugins (Figmotion) → GIF/Video              │
│                                                      │
│ Lottie → Export → JSON (web) ou GIF (social)         │
└──────────────────────────────────────────────────────┘
```

---

## Padrões de Motion

### Hook Slide Animado
```
SEQUÊNCIA:

0ms     → Fundo aparece (fade)
200ms   → Logo/handle (fade + slide up)
400ms   → Headline (scale up + fade)
700ms   → Subheadline (fade + slide up)
1000ms  → CTA (pulse loop)

Duração total: ~1.5 segundos até CTA
```

### Lista com Reveal
```
SEQUÊNCIA:

0ms     → Título aparece
200ms   → Item 1 (slide left + fade)
350ms   → Item 2 (slide left + fade)
500ms   → Item 3 (slide left + fade)
650ms   → Item 4 (slide left + fade)
800ms   → Item 5 (slide left + fade)

Stagger: 150ms entre itens
```

### Número/Estatística
```
SEQUÊNCIA:

0ms     → Container aparece (scale up)
300ms   → Número começa count up
1500ms  → Número atinge valor final
1600ms  → Label aparece (fade)
1800ms  → Contexto/descrição (slide up)

Easing do count: easeOutExpo
```

---

## Anti-Patterns de Motion

### O que Evitar
```
┌────────────────────────────────────────────────────────┐
│ ✗ ANIMAÇÃO MUITO RÁPIDA                                │
│   < 150ms = imperceptível ou irritante                 │
│                                                        │
│ ✗ ANIMAÇÃO MUITO LENTA                                 │
│   > 1.5s = tedioso, usuário perde interesse            │
│                                                        │
│ ✗ MUITAS ANIMAÇÕES SIMULTÂNEAS                         │
│   Compete por atenção, confunde                        │
│                                                        │
│ ✗ LINEAR PARA TUDO                                     │
│   Movimento robótico, não natural                      │
│                                                        │
│ ✗ BOUNCE/SHAKE EXCESSIVO                               │
│   Infantil, não profissional                           │
│                                                        │
│ ✗ LOOP INFINITO EM TUDO                                │
│   Cansativo, distrai do conteúdo                       │
└────────────────────────────────────────────────────────┘
```

---

## Acessibilidade em Motion

### Considerações
```
┌────────────────────────────────────────────────────────┐
│ • Respeitar prefers-reduced-motion (web)               │
│ • Evitar flashes rápidos (epilepsia)                   │
│ • Conteúdo deve ser compreensível sem animação         │
│ • Não usar motion como única forma de comunicar        │
│ • Contraste de texto deve ser mantido durante animação │
└────────────────────────────────────────────────────────┘
```

---

## Checklist de Motion

- [ ] Animações têm propósito (não apenas decoração)
- [ ] Durações apropriadas (200ms-1s na maioria)
- [ ] Easing natural (não linear)
- [ ] Stagger para listas (50-150ms)
- [ ] Hierarquia de animação (primário → secundário)
- [ ] Não mais que 2-3 elementos animando simultaneamente
- [ ] Exportação otimizada para plataforma
- [ ] Funciona sem animação (conteúdo acessível)

---

## Fontes de Referência
- Material Design Motion Guidelines
- Apple Human Interface Guidelines - Motion
- The Illusion of Life (Disney Animation Principles)
- Issara Willenskomer, Motion Design Principles
