# INDEX: PRPs - Site ExímIA Ventures
## Documentação Completa para Desenvolvimento no Stitch

**Versão:** 1.0  
**Data:** 18/01/2026  
**Total de Páginas:** 7

---

## 📚 Lista de PRPs

### ✅ Completos (7/7)

1. **[PRP-01: Homepage](./PRP-01-Homepage.md)** ✅
   - Página principal da holding
   - Apresentação dos 3 braços
   - Hero + Ecossistema + Integração + Cases + CTA

2. **[PRP-02: ExímIA Studio](./PRP-02-Studio.md)** ✅
   - Execution Intelligence
   - Processo 4 etapas (accordion)
   - Casos de uso com impacto humano

3. **[PRP-03: ExímIA Academy](./PRP-03-Academy.md)** ✅
   - UCs + Cursos próprios (5 públicos)
   - Modelo Templo Grego interativo
   - Princípios LXD + LXP Platform

4. **[PRP-04: ExímIA Excellence](./PRP-04-Excellence.md)** ✅
   - Frameworks automatizados (tabs)
   - Catálogo de produtos (StratOS, OKR, Lean)
   - Before/After + Pricing

5. **[PRP-05: Como Funciona](./PRP-05-ComoFunciona.md)** ✅
   - Jornada integrada dos 3 braços
   - Caso completo passo-a-passo (timeline)
   - Visualização de fluxo circular

6. **[PRP-06: Cases](./PRP-06-Cases.md)** ✅
   - Grid de cases filtráveis (braço/indústria)
   - Card com métricas + depoimentos
   - Carousel testemunhais

7. **[PRP-07: Contato](./PRP-07-Contato.md)** ✅
   - Formulário segmentado (5 opções)
   - Campos condicionais por interesse
   - FAQ accordion + contatos diretos

---

## 🎨 Design System Unificado

### Paleta Oficial
```
Primárias (Blues - Confiança):
#1b3c6b (Navy Principal)
#01243e (Dark Navy)
#497ebd (Royal Blue)
#174d68 (Teal Blue)

Secundárias (Warmth - Inovação):
#fdbe66 (Golden Yellow)
#f58873 (Coral)
#ecbb95 (Peach)
#d6623d (Burnt Orange)

Neutras:
#e6eeea (Off-white)
#cdd5da (Light Gray)
#14181b (Almost Black)
```

### Tipografia Padrão
- **Família:** Roboto
- **Pesos:** Light (300), Regular (400), Medium (500), Bold (700), Black (900)
- **Scale:** Modular 1.250

### Componentes Reutilizáveis
- Button (Primary, Secondary, Accent, Ghost)
- Card (Basic, Product, Glassmorphism)
- Navigation (Sticky com blur)
- Footer (Unificado)

---

## 📐 Estrutura de Navegação

```
┌─────────────────────────────────────────┐
│         NAVIGATION (todas páginas)       │
├─────────────────────────────────────────┤
│                                          │
│  Logo  Home  Ecossistema▼  Como  Cases  │
│                            Funciona      │
│                                    Contato│
│                                          │
│  Dropdown "Ecossist ema":                │
│  • ExímIA Studio                         │
│  • ExímIA Academy                        │
│  • ExímIA Excellence                     │
│                                          │
└─────────────────────────────────────────┘
```

---

## ⚙️ Padrões de Interação

### Animações Globais
- **Scroll Reveal:** Fade-in-up (threshold 0.1, duration 600ms)
- **Hover Cards:** translateY(-8px) + shadow-xl
- **Links:** Underline slide-in from left

### Estados de Botão
```css
.button-primary {
  background: var(--color-accent);
  transition: all 300ms ease-out-back;
}
.button-primary:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-lg);
}
.button-primary:active {
  transform: scale(0.98);
}
```

### Responsividade
- **Desktop:** 1024px+ (3 colunas)
- **Tablet:** 768-1023px (2 colunas)
- **Mobile:** <768px (1 coluna, stack)

---

## 📱 Breakpoints Mobile

### Navigation
- Desktop: Horizontal links
- Mobile: Hamburger menu (transform to overlay)

### Hero Sections
- Desktop: 160px padding vertical
- Mobile: 80px padding vertical
- Font-size reduzidos em ~40%

### Grids
- Desktop: Grid 3 colunas (gap 32px)
- Tablet: Grid 2 colunas (gap 24px)
- Mobile: Stack 1 coluna (gap 16px)

---

## ✅ Checklist Geral de Implementação

### Pré-Desenvolvimento
- [ ] Exportar logos SVG para `/public`
- [ ] Configurar paleta de cores em CSS variables
- [ ] Definir tokens de espaçamento e tipografia

### Componentes Base
- [ ] Button (4 variações)
- [ ] Card (3 tipos)
- [ ] Navigation (sticky + dropdown)
- [ ] Footer (unificado)
- [ ] Form Input (para Contato)

### Páginas
- [ ] Homepage (PRP-01)
- [ ] ExímIA Studio (PRP-02)
- [ ] ExímIA Academy (PRP-03)
- [ ] ExímIA Excellence (PRP-04)
- [ ] Como Funciona (PRP-05)
- [ ] Cases (PRP-06)
- [ ] Contato (PRP-07)

### Polish
- [ ] Scroll reveal animations
- [ ] Loading states
- [ ] 404 page
- [ ] Otimização de imagens
- [ ] Meta tags / SEO
- [ ] Performance audit (Lighthouse >90)
- [ ] Acessibilidade (WCAG AA)

---

## 📄 Assets Necessários

### Imagens/Ilustrações
- [ ] Hero animation (Lottie ou SVG - templo se formando)
- [ ] Icons dos 3 braços (🤖 🎓 ⚡)
- [ ] Mockup da LXP Platform
- [ ] Diagrama do Templo Grego (interativo)
- [ ] Screenshots de produtos (StratOS, etc.)
- [ ] Fotos de depoimentos (se houver)

### Logos
- [x] LOGO HORIZONTAL.svg
- [x] LOGO VERTICAL.svg
- [x] SIMBOLO.svg

---

## 🔗 Links Rápidos

- **Narrativa:** [NARRATIVA_FINAL_HUMAN_CENTERED.md](../NARRATIVA_FINAL_HUMAN_CENTERED.md)
- **Design System:** [DESIGN_SYSTEM.md](../DESIGN_SYSTEM.md)
- **Research:** [RESEARCH_REPORT.md](../RESEARCH_REPORT.md)

---

**Desenvolvido para:** Stitch (Visual Development)  
**Próximo Passo:** Implementar componentes base e Homepage
