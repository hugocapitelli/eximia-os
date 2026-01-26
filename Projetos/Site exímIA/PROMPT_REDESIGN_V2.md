# PROMPT: Redesign Radical - "Organic Tech Studio" (V2)

**Copie e cole este prompt no chat onde suas páginas estão:**

---

Estamos fazendo um **RE-DESIGN TOTAL** do site.

Atualmente, o site está funcional, mas com visual "corporativo padrão".
Quero transformar isso em uma experiência **"Organic Tech Studio"**.
O objetivo é ser **DISRUPTIVO, MEMORÁVEL e HIGH-END**.

Use as referências visuais de **Osmo Supply** (inércia, tipografia gigante) combinadas com **Huly/Bento** (grids modulares) e **Slite** (camada humana/scribbles).

Abaixo estão as **REGRAS RIGÍDAS** para o novo CSS e estrutura. Aplique isso a todas as páginas IMEDIATAMENTE.

## 1. Fundamentos Visuais (Design Tokens)

Substitua TODAS as variáveis de cor e tipografia por estas:

```css
:root {
  /* --- PALETA: OBSIDIAN & VOLT --- */
  --bg-core: #050505;        /* Deepest Black */
  --bg-card: #0A0C10;        /* Obsidian */
  --bg-float: #141414;       /* Lifted elements */
  
  --accent-primary: #D4FF00; /* ELECTRIC VOLT (Botões, CTAs, Highlights) */
  --accent-secondary: #7000FF; /* NEON PURPLE (Gradients sutis, Glows) */
  
  --text-primary: #FFFFFF;
  --text-secondary: #888888; /* Mono style */
  --text-tertiary: #4B5563;
  
  --border-subtle: #222222;
  --border-hover: #333333;

  /* --- TIPOGRAFIA: EXCESSIVE & TECH --- */
  /* Importe: Syne (700, 800), Inter Tight (300, 400, 500), JetBrains Mono, Reenie Beanie */
  
  --font-display: 'Syne', sans-serif;       /* Para Headlines Gigantes */
  --font-body: 'Inter Tight', sans-serif;   /* Para texto corrido */
  --font-mono: 'JetBrains Mono', monospace; /* Para labels/dados */
  --font-hand: 'Reenie Beanie', cursive;    /* Para anotações humanas */
}

body {
  background-color: var(--bg-core);
  color: var(--text-primary);
  font-family: var(--font-body);
}
```

## 2. Regras de Layout & Componentes

### A. O "Bento Grid" (Para Seções de Conteúdo)
NUNCA use colunas simples (bootstrap style). Use **CSS Grid Modular**.
- Cards devem ter `border-radius: 24px`.
- Borda fina: `1px solid var(--border-subtle)`.
- Background: `var(--bg-card)`.
- **Hover Effect:** Glow sutil interno ou borda ficando mais clara.

### B. Tipografia Disruptiva (Hero Sections)
- Headlines (H1) devem ser **GIGANTES** (clamp(3rem, 8vw, 8rem)).
- Use pesos extremos: **Extra Bold (800)** ou **Ultra Light (300)** na mesma frase.
- Letter-spacing apertado (-0.03em) para títulos.

### C. A "Human Layer" (Scribbles)
- Adicione elementos SVG de "rabiscos" (setas, círculos, sublinhados) sobre o layout técnico.
- Cor dos scribbles: Branco ou Volt (#D4FF00).
- Exemplo: Circule a palavra "IA" no título com um SVG desenhado à mão.

### D. Interatividade "High-Inertia"
- **Botões:** Não use botões retangulares simples. Use "Pills" (arredondados) com hover magnético.
- **Micro-interações:** Ao passar o mouse em imagens, aplique um leve filtro de *Noise* ou *Pixelate*.
- **Scroll:** Elementos devem ter *Parallax Sutil* (velocidades diferentes).

## 3. Instruções de Implementação

1.  **Refaça o Header:**
    -  Remova a navbar fixa no topo.
    -  Crie uma **"Floating Pill"** centralizada na parte inferior ou superior (estilo ilha dinâmica).
    -  Glassmorphism: `backdrop-filter: blur(12px)`.

2.  **Refaça a Hero Section:**
    -  Texto H1 centralizado e ENORME.
    -  Substitua ilustrações vetoriais genéricas por **Colagens Mixed Media** ou **Tipografia Cinética**.

3.  **Refaça os Cards (Studio/Academy/Excellence):**
    -  Transforme em um **Bento Grid** assimétrico.
    -  Use a fonte Mono para pequenos labels (ex: "VERSÃO 1.0", "STATUS: ONLINE").

---

**EXECUTE AGORA:**
Reescreva o CSS e o HTML das páginas aplicando estritamente essa nova direção "Organic Tech Studio".
Seja radical. Se parecer um "site corporativo padrão", está errado.
