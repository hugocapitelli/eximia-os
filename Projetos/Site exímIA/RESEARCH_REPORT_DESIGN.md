# RESEARCH REPORT: Disruptive Design Patterns (V2)
## Análise de Referências Visuais para ExímIA Ventures

**Data:** 18/01/2026
**Objetivo:** Redesenhar o site para ser "Disruptivo, Moderno e Intuitivo", fugindo do padrão corporativo tradicional.

---

## 1. Referência "North Star": OSMO SUPPLY
**URL:** [osmo.supply](https://www.osmo.supply/)

A Osmo Supply é a principal inspiração para a "vibe" da ExímIA. Não é um site corporativo; é uma experiência de marca.

### Padrões Identificados:
- **Tipografia Experimental:** Fontes sans-serif ousadas, com pesos extremos (ultra-bold ou ultra-light). Uso de tamanhos gigantescos no Hero.
- **Anotações Humanas ("Scribbles"):** Uso de setas, círculos e sublinhados feitos à mão sobre layouts técnicos rígidos. Isso quebra a frieza digital e reforça a "presença humana".
- **Movimento e Inércia:** O scroll não é estático; tem "peso". Elementos flutuam com parallax sutil.
- **Micro-interações de Ruído/Pixel:** Ao passar o mouse, imagens não apenas mudam de opacidade; elas "falham" (glitch) ou pixelizam, sugerindo tecnologia bruta.
- **Layout Assimétrico:** Fuga do grid de 12 colunas óbvio. Elementos se sobrepõem intencionalmente.

---

## 2. Análise de Padrões Recorrentes (Outras Referências)

### A. O "Bento Grid" (Huly, Lando Norris, Superlist)
O padrão mais forte encontrado para organização de conteúdo complexo (como os 3 braços da ExímIA).
- **O que é:** Layout modular em blocos arredondados, como uma lancheira Bento japonesa.
- **Por que usar:** Permite mostrar Studio, Academy e Excellence lado a lado sem hierarquia forçada. É intuitivo e mobile-friendly por natureza.
- **Estilo:** Bordas finas, glow sutil no hover, fundos levemente translúcidos (glassmorphism).

### B. "Human Layer" (Slite, April Ford)
O contraponto à tecnologia.
- **O que é:** Camada de "rabiscos" e notas manuais sobreposta ao design rigoroso.
- **Aplicação na ExímIA:** Fundamental para a narrativa "Human-Centered". A tecnologia (IA) é a base rígida; a camada humana (decisão) é orgânica e imperfeita.

### C. Navegação Flutuante (Huly, Litho Square)
- **O que é:** Navigation bar que não encosta no topo. Flutua como uma "pílula" centralizada ou barra inferior.
- **Efeito:** Sensação de aplicativo nativo ("App-like feel") em vez de site institucional.

---

## 3. Proposta de Direção Visual V2: "Organic Tech Studio"

Para atingir o objetivo "Disruptivo", propomos fundir a **rigidez do Bento Grid** (Tecnologia/Excellence) com a **organicidade do Osmo/Slite** (Humano/Studio).

### Pilares Visuais:
1.  **Tipografia:** Trocar Roboto (padrão) por **Inter Tight** (técnico) combinado com uma fonte display serifada ou manuscrita para destaques.
2.  **Cores:**
    - Base: **Deep Obsidian** (#0A0C10) - Dark Mode como padrão (mais moderno).
    - Accents: **Electric Volt** (#D4FF00) ou **Neon Purple** para quebrar a seriedade.
3.  **Grid:**
    - Homepage baseada em **Bento Grid**. Cada braço é um "card" interativo.
4.  **Interação:**
    - Cursor customizado (círculo que reage a elementos).
    - Scroll suave (Lenis scroll).
    - Hover em cards revela "alma" (vídeo, cor vibrante, glitch).

---

## 4. Comparativo V1 vs V2

| Elemento | V1 (Atual - Corporativo) | V2 (Proposta - Disruptiva) |
| :--- | :--- | :--- |
| **Estrutura** | Seções lineares empilhadas | Bento Grid assimetrico |
| **Nav** | Sticky no topo full-width | Floating Pill centralizada |
| **Cor Base** | Branco/Azul Institucional | Dark Mode (#050505) |
| **Tipografia** | Roboto (neutra) | Display Bold + Mono Tech |
| **Imagens** | Vetores/Fotos Stock | Colagens Mixed Media + Glitch |
| **Vibe** | "Consultoria de Confiança" | "Studio de Tecnologia de Ponta" |

---

**Próximo Passo:**
Atualizar o Design System (CSS) e o PRP da Homepage para refletir essa nova direção radical.
