# Design System - exímIA Ventures

## 🎨 Sistema de Design Completo

Este documento define o sistema de design completo para o site institucional da exímIA Ventures, incluindo tokens de design, componentes, padrões e diretrizes de implementação.

---

## 🎯 Princípios de Design

### 1. **Premium e Moderno**
Visual sofisticado que transmite inovação tecnológica e confiabilidade empresarial.

### 2. **Clean e Respirável**
Espaçamento generoso, hierarquia clara, sem poluição visual.

### 3. **Dinâmico e Vivo**
Animações sutis que trazem energia sem distrair.

### 4. **Responsivo e Acessível**
Funciona perfeitamente em todos os dispositivos e para todos os usuários.

---

## 🎨 Tokens de Design

### Paleta de Cores

#### Cores Primárias (Identidade Corporativa - Azuis)

```css
:root {
  /* Navy - Confiança, Corporativo */
  --color-navy-900: #01243e;  /* Dark Navy */
  --color-navy-800: #1b3c6b;  /* Navy Principal */
  --color-navy-700: #174d68;  /* Teal Blue */
  --color-navy-600: #497ebd;  /* Royal Blue */
  
  /* Aliases Semânticos */
  --color-primary: #1b3c6b;
  --color-primary-dark: #01243e;
  --color-primary-light: #497ebd;
}
```

#### Cores Secundárias (Warmth - Inovação e Energia)

```css
:root {
  /* Warmth Colors - Destaque e CTAs */
  --color-gold: #fdbe66;
  --color-coral: #f58873;
  --color-peach: #ecbb95;
  --color-orange: #d6623d;
  
  /* Aliases Semânticos */
  --color-accent: #fdbe66;
  --color-accent-warm: #f58873;
}
```

#### Cores Neutras

```css
:root {
  /* Neutrals */
  --color-white: #ffffff;
  --color-off-white: #e6eeea;
  --color-gray-100: #cdd5da;
  --color-gray-900: #14181b;
  
  /* Aliases Semânticos */
  --color-background: #ffffff;
  --color-background-alt: #e6eeea;
  --color-text: #14181b;
  --color-text-muted: #cdd5da;
}
```

#### Gradientes

```css
:root {
  /* Gradientes Principais */
  --gradient-hero: linear-gradient(135deg, #1b3c6b 0%, #174d68 100%);
  --gradient-accent: linear-gradient(135deg, #fdbe66 0%, #f58873 100%);
  --gradient-subtle: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(230,238,234,0.5) 100%);
}
```

---

### Tipografia

#### Font Families

```css
:root {
  --font-primary: 'Roboto', system-ui, -apple-system, sans-serif;
  --font-mono: 'Roboto Mono', 'Courier New', monospace;
}
```

#### Font Sizes (Scale Modular - 1.250)

```css
:root {
  /* Base */
  --text-base: 16px;
  
  /* Scale up */
  --text-lg: 20px;     /* 16 × 1.25 */
  --text-xl: 25px;     /* 20 × 1.25 */
  --text-2xl: 31px;    /* 25 × 1.25 */
  --text-3xl: 39px;    /* 31 × 1.25 */
  --text-4xl: 49px;    /* 39 × 1.25 */
  --text-5xl: 61px;    /* 49 × 1.25 */
  
  /* Scale down */
  --text-sm: 14px;     /* 16 / 1.14 */
  --text-xs: 12px;     /* 14 / 1.17 */
}
```

#### Font Weights

```css
:root {
  --font-light: 300;
  --font-regular: 400;
  --font-medium: 500;
  --font-bold: 700;
  --font-black: 900;
}
```

#### Line Heights

```css
:root {
  --leading-tight: 1.2;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
}
```

---

### Espaçamento (Scale de 8px)

```css
:root {
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --space-5: 40px;
  --space-6: 48px;
  --space-8: 64px;
  --space-10: 80px;
  --space-12: 96px;
  --space-16: 128px;
}
```

---

### Border Radius

```css
:root {
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
}
```

---

### Shadows

```css
:root {
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(27, 60, 107, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(27, 60, 107, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(27, 60, 107, 0.15);
  --shadow-2xl: 0 25px 50px -12px rgba(27, 60, 107, 0.25);
}
```

---

### Transições

```css
:root {
  --transition-fast: 150ms ease;
  --transition-base: 300ms ease;
  --transition-slow: 600ms ease-out;
  
  --ease-in-out-cubic: cubic-bezier(0.645, 0.045, 0.355, 1);
  --ease-out-back: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

---

## 🧩 Componentes

### Botões

#### Primary Button

```css
.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-white);
  padding: 12px 32px;
  border-radius: var(--radius-md);
  font-weight: var(--font-medium);
  font-size: var(--text-base);
  border: none;
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-md);
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}
```

#### Secondary Button

```css
.btn-secondary {
  background-color: transparent;
  color: var(--color-primary);
  padding: 12px 32px;
  border-radius: var(--radius-md);
  font-weight: var(--font-medium);
  font-size: var(--text-base);
  border: 2px solid var(--color-primary-light);
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-secondary:hover {
  background-color: var(--color-primary-light);
  color: var(--color-white);
  border-color: var(--color-primary-light);
}
```

#### Accent Button (CTA)

```css
.btn-accent {
  background: var(--gradient-accent);
  color: var(--color-gray-900);
  padding: 12px 32px;
  border-radius: var(--radius-md);
  font-weight: var(--font-bold);
  font-size: var(--text-base);
  border: none;
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
}

.btn-accent::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #f58873 0%, #d6623d 100%);
  opacity: 0;
  transition: opacity var(--transition-base);
}

.btn-accent:hover::before {
  opacity: 1;
}

.btn-accent:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: var(--shadow-xl);
}
```

---

### Cards

#### Basic Card

```css
.card {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
  border: 1px solid transparent;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
  border-color: var(--color-primary-light);
}
```

#### Product Card

```css
.product-card {
  background: var(--color-white);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-lg);
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

.product-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--gradient-accent);
  opacity: 0;
  transition: opacity var(--transition-base);
}

.product-card:hover::before {
  opacity: 1;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-2xl);
}

.product-card__icon {
  width: 64px;
  height: 64px;
  margin-bottom: var(--space-3);
  color: var(--color-primary);
}

.product-card__title {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--color-gray-900);
  margin-bottom: var(--space-2);
}

.product-card__tagline {
  font-size: var(--text-sm);
  color: var(--color-primary);
  font-weight: var(--font-medium);
  margin-bottom: var(--space-3);
}

.product-card__description {
  font-size: var(--text-base);
  color: var(--color-text);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-4);
}
```

---

### Glassmorphism (Hero Sections)

```css
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px) saturate(180%);
  -webkit-backdrop-filter: blur(10px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: 0 8px 32px 0 rgba(27, 60, 107, 0.2);
}
```

---

### Sections

#### Hero Section

```css
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-hero);
  color: var(--color-white);
  text-align: center;
  padding: var(--space-8) var(--space-4);
  position: relative;
  overflow: hidden;
}

.hero__content {
  max-width: 900px;
  z-index: 2;
}

.hero__title {
  font-size: var(--text-5xl);
  font-weight: var(--font-black);
  line-height: var(--leading-tight);
  margin-bottom: var(--space-4);
  animation: fadeInUp 800ms var(--ease-out-back);
}

.hero__subtitle {
  font-size: var(--text-xl);
  font-weight: var(--font-light);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-6);
  opacity: 0.9;
  animation: fadeInUp 800ms var(--ease-out-back) 200ms both;
}

.hero__cta-group {
  display: flex;
  gap: var(--space-3);
  justify-content: center;
  flex-wrap: wrap;
  animation: fadeInUp 800ms var(--ease-out-back) 400ms both;
}
```

#### Content Section

```css
.section {
  padding: var(--space-16) var(--space-4);
}

.section--alt {
  background-color: var(--color-background-alt);
}

.section__container {
  max-width: 1200px;
  margin: 0 auto;
}

.section__header {
  text-align: center;
  margin-bottom: var(--space-12);
}

.section__title {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  color: var(--color-gray-900);
  margin-bottom: var(--space-3);
}

.section__subtitle {
  font-size: var(--text-lg);
  color: var(--color-primary);
  font-weight: var(--font-medium);
}
```

---

## 🎬 Animações

### Fade In Up (Scroll Reveal)

```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  opacity: 0;
  animation: fadeInUp var(--transition-slow) var(--ease-out-back) forwards;
}

/* Intersection Observer Trigger */
.fade-in-up.visible {
  animation-play-state: running;
}
```

### Pulse (Button CTAs)

```css
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.pulse {
  animation: pulse 2s ease-in-out infinite;
}
```

### Gradient Animation

```css
.gradient-animate {
  background: linear-gradient(
    270deg,
    var(--color-primary),
    var(--color-primary-light),
    var(--color-navy-700)
  );
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
}

@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
```

---

## 📱 Responsividade

### Breakpoints

```css
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
}
```

### Media Query Mixins (exemplo)

```css
/* Mobile First */
@media (min-width: 768px) {
  .hero__title {
    font-size: var(--text-5xl);
  }
}

@media (max-width: 767px) {
  .hero__title {
    font-size: var(--text-3xl);
  }
  
  .hero__cta-group {
    flex-direction: column;
  }
  
  .section {
    padding: var(--space-8) var(--space-4);
  }
}
```

---

## ♿ Acessibilidade

### Focus States

```css
:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 2px;
}

button:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 4px;
}
```

### Text Contrast

Todos os textos devem ter contraste mínimo de **4.5:1** (WCAG AA).

✅ **Aprovado:**
- `#14181b` (text) on `#ffffff` (background) = 15.6:1
- `#1b3c6b` (primary) on `#ffffff` = 7.2:1

---

## 🎯 Hierarquia Tipográfica

### Headings

```css
h1, .h1 {
  font-size: var(--text-5xl);
  font-weight: var(--font-black);
  line-height: var(--leading-tight);
  color: var(--color-gray-900);
  margin-bottom: var(--space-4);
}

h2, .h2 {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  color: var(--color-gray-900);
  margin-bottom: var(--space-3);
}

h3, .h3 {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-normal);
  color: var(--color-gray-900);
  margin-bottom: var(--space-3);
}

h4, .h4 {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-normal);
  color: var(--color-gray-900);
  margin-bottom: var(--space-2);
}
```

### Body Text

```css
p, .body {
  font-size: var(--text-base);
  font-weight: var(--font-regular);
  line-height: var(--leading-relaxed);
  color: var(--color-text);
  margin-bottom: var(--space-3);
}

.lead {
  font-size: var(--text-xl);
  font-weight: var(--font-light);
  line-height: var(--leading-relaxed);
  color: var(--color-text);
}

.caption {
  font-size: var(--text-sm);
  font-weight: var(--font-regular);
  color: var(--color-text-muted);
}
```

---

## 📐 Layout Grid

### Container

```css
.container {
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--space-4);
  padding-right: var(--space-4);
}
```

### Grid System

```css
.grid {
  display: grid;
  gap: var(--space-6);
}

.grid--2 {
  grid-template-columns: repeat(2, 1fr);
}

.grid--3 {
  grid-template-columns: repeat(3, 1fr);
}

.grid--4 {
  grid-template-columns: repeat(4, 1fr);
}

@media (max-width: 1023px) {
  .grid--3,
  .grid--4 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 767px) {
  .grid--2,
  .grid--3,
  .grid--4 {
    grid-template-columns: 1fr;
  }
}
```

---

## 🚀 Performance

### CSS Optimization

```css
/* Use will-change para animações */
.card:hover {
  will-change: transform, box-shadow;
}

/* Prefira transform/opacity para animações (GPU accelerated) */
.fade-in {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.3s, transform 0.3s;
}
```

---

_Este design system garante consistência visual e qualidade premium em todo o site._
