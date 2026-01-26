# PROMPT: Redesign Radical - "Organic Tech Studio" (V2) - BRAND COLORS EDITION

**Copie e cole este prompt no chat onde suas páginas estão:**

---

Estamos fazendo um **RE-DESIGN TOTAL** do site.

Atualmente, o site está com visual "corporativo padrão".
Quero transformar isso em uma experiência **"Organic Tech Studio"**.
O objetivo é ser **DISRUPTIVO, MEMORÁVEL e HIGH-END**, mas **mantendo rigorosamente a identidade da marca**.

Use as referências visuais de **Osmo Supply** (inércia, tipografia gigante) combinadas com **Huly/Bento** (grids modulares) e **Slite** (camada humana/scribbles).

Abaixo estão as **REGRAS RIGÍDAS** para o novo CSS e estrutura. Aplique isso a todas as páginas IMEDIATAMENTE.

## 1. Fundamentos Visuais (Design Tokens da Marca)

Substitua TODAS as variáveis por estas, que usam a **Paleta Oficial ExímIA**:

```css
:root {
  /* --- PALETA: DEEP NAVY & CORAL (Brand Identity) --- */
  
  /* Backgrounds: Não use preto puro. Use o Navy mais profundo possível */
  --bg-core: #020C14;        /* Darkest Navy (Quase preto) */
  --bg-card: #0A1F30;        /* Deep Navy (Cards) */
  --bg-float: #112A40;       /* Lighter Navy (Hover/Floating) */
  
  /* Accents: Cores Quentes da Marca */
  --accent-primary: #F58873; /* CORAL (Botões, CTAs, Highlights) */
  --accent-secondary: #FDBE66; /* GOLDEN (Gradients, Glows secundários) */
  --accent-tertiary: #497EBD; /* ROYAL BLUE (Links, UI Elements) */
  
  /* Texts */
  --text-primary: #FFFFFF;
  --text-secondary: #CDD5DA; /* Light Blue-Grey */
  --text-tertiary: #5A7B94;  /* Muted Blue */
  
  --border-subtle: #1B3C6B;  /* Navy Principal (Bordas) */
  --border-hover: #497EBD;   /* Royal Blue (Bordas Hover) */

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
  background-image: radial-gradient(circle at 50% 0%, rgba(27, 60, 107, 0.3) 0%, transparent 70%);
}
```

## 2. Regras de Layout & Componentes

### A. O "Bento Grid" (Para Seções de Conteúdo)
NUNCA use colunas simples (bootstrap style). Use **CSS Grid Modular**.
- Cards devem ter `border-radius: 24px`.
- Borda fina: `1px solid var(--border-subtle)`.
- Background: `var(--bg-card)`.
- **Hover Effect:** A borda muda para `var(--accent-tertiary)` e o background clareia para `var(--bg-float)`. drop-shadow com tom Coral.

### B. Tipografia Disruptiva (Hero Sections)
- Headlines (H1) devem ser **GIGANTES** (clamp(3rem, 8vw, 8rem)).
- Use a cor `--text-primary` (Branco).
- Use **Gradients no Texto** apenas para palavras-chave (Ex: "IA" em Gradient Coral -> Golden).

### C. A "Human Layer" (Scribbles)
- Adicione elementos SVG de "rabiscos" (setas, círculos, sublinhados) sobre o layout técnico.
- Cor dos scribbles: **Coral (#F58873)** ou **Golden (#FDBE66)**.
- Isso traz o calor da marca para o fundo tecnológico frio.

### D. Interatividade "High-Inertia"
- **Botões:** "Pills" arredondados.
    - Primário: Background Coral (#F58873), Texto Navy.
    - Secundário: Border Golden (#FDBE66), Texto Golden.
- **Glassmorphism:** Use `backdrop-filter: blur(12px)` em cards flutuantes com tint azulado (`rgba(27, 60, 107, 0.4)`).

---

**EXECUTE AGORA:**
Reescreva o CSS e o HTML das páginas aplicando estritamente essa nova direção "Organic Tech Studio" **com as cores da marca**.
O resultado deve ser um site "Dark Mode" azulado, elegante e vibrante.
