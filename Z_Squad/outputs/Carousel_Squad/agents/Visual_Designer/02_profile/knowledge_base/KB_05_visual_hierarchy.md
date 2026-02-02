# KB_05 — Visual Hierarchy for Carousels

**Agente:** Visual Designer
**Categoria:** HIERARQUIA VISUAL
**Versão:** 1.0

---

## Fundamentos de Hierarquia Visual

### O que é Hierarquia Visual

Visual hierarchy is the arrangement of design elements by order of importance. It answers:
- **What do I see first?** — Focal point
- **Where do I look next?** — Reading path
- **What action should I take?** — Call to action

### Os 3 Níveis de Hierarquia
```
┌─────────────────────────────────────────────────────────┐
│ NÍVEL 1: PRIMÁRIO                                       │
│ Primeira coisa que o olho percebe                       │
│ → Headline, número impactante, imagem principal         │
│                                                         │
│ NÍVEL 2: SECUNDÁRIO                                     │
│ Informação de suporte                                   │
│ → Subheadline, explicação, dados de apoio               │
│                                                         │
│ NÍVEL 3: TERCIÁRIO                                      │
│ Detalhes e metadados                                    │
│ → Handle, data, créditos, legenda                       │
└─────────────────────────────────────────────────────────┘
```

---

## As 7 Ferramentas de Hierarquia

### 1. Tamanho (Size)
```
┌────────────────────────────────────┐
│                                    │
│    GRANDE                          │
│    médio                           │
│    pequeno                         │
│                                    │
└────────────────────────────────────┘

Maior = Mais importante
Regra: Headline 2-3x maior que body
```

### 2. Peso (Weight)
```
┌────────────────────────────────────┐
│                                    │
│    BOLD                            │
│    Regular                         │
│    Light                           │
│                                    │
└────────────────────────────────────┘

Mais peso = Mais destaque
Use Bold para headlines, Regular para body
```

### 3. Cor (Color)
```
┌────────────────────────────────────┐
│                                    │
│    ████ HIGH CONTRAST              │
│    ▓▓▓▓ Medium contrast            │
│    ░░░░ Low contrast               │
│                                    │
└────────────────────────────────────┘

Alto contraste = Primeira atenção
Cores vibrantes sobre fundos neutros
```

### 4. Posição (Position)
```
┌────────────────────────────────────┐
│  ★ TOPO = Primeira atenção         │
│                                    │
│      Centro = Foco                 │
│                                    │
│                    Base = Último   │
└────────────────────────────────────┘

Leitura natural: topo-esquerda → base-direita
Posições de poder: topo e centro
```

### 5. Espaço (Spacing)
```
┌────────────────────────────────────┐
│                                    │
│                                    │
│         ISOLADO                    │
│                                    │
│                                    │
│ agrupado junto junto junto         │
└────────────────────────────────────┘

Mais espaço ao redor = Mais importante
Isolamento cria foco
```

### 6. Textura/Estilo (Texture)
```
┌────────────────────────────────────┐
│                                    │
│    ⬛ SÓLIDO (destaca)             │
│                                    │
│    ▨▨ Padrão (suporte)             │
│                                    │
│    ○○ Outline (sutil)              │
│                                    │
└────────────────────────────────────┘

Elementos sólidos dominam sobre outlines
Gradientes chamam mais atenção
```

### 7. Direção (Direction)
```
┌────────────────────────────────────┐
│      ↗                             │
│    →   DESTINO                     │
│      ↘                             │
│                                    │
│ Elementos que "apontam" para algo  │
│ direcionam o olhar                 │
└────────────────────────────────────┘

Setas, olhares, linhas guiam atenção
```

---

## Focal Points (Pontos Focais)

### Criando um Focal Point Forte
```
┌────────────────────────────────────┐
│                                    │
│                                    │
│         ███████████                │
│         ███ FOCO ███               │
│         ███████████                │
│                                    │
│                                    │
└────────────────────────────────────┘

Técnicas:
✓ Tamanho significativamente maior
✓ Cor contrastante
✓ Posição central ou regra dos terços
✓ Espaço vazio ao redor
```

### Múltiplos Pontos Focais
```
┌────────────────────────────────────┐
│                                    │
│   ★★★ PRIMÁRIO                     │
│       ↓                            │
│      ★★ SECUNDÁRIO                 │
│         ↓                          │
│         ★ TERCIÁRIO                │
│                                    │
└────────────────────────────────────┘

Hierarquia clara entre elementos
Nunca dois elementos competindo igualmente
```

---

## Padrões de Leitura

### Z-Pattern para Carrosséis
```
┌────────────────────────────────────┐
│ 1 ─────────────────────────→ 2     │
│ (Logo/Hook)             (Visual)   │
│                    ↙               │
│                   3                │
│              (Conteúdo)            │
│                    ↘               │
│ 4 ─────────────────────────→ 5     │
│ (Suporte)                  (CTA)   │
└────────────────────────────────────┘

Use para slides com múltiplos elementos
```

### Gutenberg Diagram
```
┌──────────────┬──────────────┐
│              │              │
│  PRIMARY     │  STRONG      │
│  OPTICAL     │  FALLOW      │
│  AREA        │  AREA        │
│              │              │
├──────────────┼──────────────┤
│              │              │
│  WEAK        │  TERMINAL    │
│  FALLOW      │  AREA        │
│  AREA        │  (CTA)       │
│              │              │
└──────────────┴──────────────┘

Top-left: Hook
Bottom-right: Call to action
Diagonais são áreas "fracas"
```

---

## Hierarquia por Tipo de Slide

### Hook Slide
```
┌────────────────────────────────────┐
│                                    │
│         ┌─────────────┐            │
│         │ HOOK ÚNICO  │ ← Foco 100%│
│         │  (gigante)  │            │
│         └─────────────┘            │
│                                    │
│            @handle    ← Terciário  │
└────────────────────────────────────┘

Uma única mensagem dominante
Sem competição visual
```

### Content Slide
```
┌────────────────────────────────────┐
│  HEADLINE               ← Primário │
│  ─────────────────                 │
│                                    │
│  Corpo do texto com     ← Secundário│
│  explicação detalhada              │
│  sobre o tópico                    │
│                                    │
│  ✓ Ponto importante     ← Destaque │
│                                    │
│  Slide 4/10            ← Terciário │
└────────────────────────────────────┘

Headline > Body > Destaques > Meta
```

### CTA Slide
```
┌────────────────────────────────────┐
│                                    │
│  Resumo do benefício    ← Secundário│
│                                    │
│  ┌──────────────────┐              │
│  │   AÇÃO AGORA!    │ ← Primário   │
│  │   [BOTÃO CTA]    │              │
│  └──────────────────┘              │
│                                    │
│  @handle | link.com   ← Terciário  │
└────────────────────────────────────┘

CTA é o elemento dominante
Tudo mais é suporte
```

---

## Técnicas de Ênfase

### Contraste de Escala
```
┌────────────────────────────────────┐
│                                    │
│   97%                              │
│   dos empresários                  │
│   falham                           │
│                                    │
└────────────────────────────────────┘

Número gigante (200px)
Texto pequeno (24px)
Proporção 8:1
```

### Color Pop
```
┌────────────────────────────────────┐
│                                    │
│   A maioria ignora                 │
│   esta ████████████                │
│        palavra-chave               │
│                                    │
└────────────────────────────────────┘

Uma palavra em cor de acento
Resto em cor neutra
```

### Isolamento
```
┌────────────────────────────────────┐
│                                    │
│                                    │
│                                    │
│         APENAS ISTO                │
│                                    │
│                                    │
│                                    │
└────────────────────────────────────┘

Vazio extremo = foco absoluto
```

### Moldura/Container
```
┌────────────────────────────────────┐
│                                    │
│   ┌─────────────────────────────┐  │
│   │                             │  │
│   │    DESTAQUE EM CAIXA        │  │
│   │                             │  │
│   └─────────────────────────────┘  │
│                                    │
└────────────────────────────────────┘

Bordas ou backgrounds criam foco
```

---

## Armadilhas Comuns

### Competição Visual
```
ERRADO:                    CERTO:
┌─────────────────┐        ┌─────────────────┐
│ ██████████████  │        │                 │
│ ██████████████  │        │ ████████████    │
│ ██████████████  │        │                 │
│ ██████████████  │        │    ████         │
└─────────────────┘        │       ███       │
                           └─────────────────┘
Tudo com mesmo peso        Hierarquia clara
```

### Muitos Focal Points
```
ERRADO:                    CERTO:
┌─────────────────┐        ┌─────────────────┐
│ ★ ★ ★ ★ ★       │        │       ★★★       │
│ ★ ★ ★ ★ ★       │        │        ↓        │
│ ★ ★ ★ ★ ★       │        │       ★         │
└─────────────────┘        └─────────────────┘
Nada se destaca            Caminho claro
```

---

## Tools e Recursos

### Análise de Hierarquia
- **Squint Test**: Aperte os olhos e veja o que aparece primeiro
- **Grayscale Test**: Remova cores e verifique se hierarquia persiste
- **5-Second Test**: Mostre por 5s e pergunte o que lembram

### Design Tools
- **Figma**: Layers e organização visual
- **Adobe XD**: Artboards para comparação
- **Canva**: Templates com hierarquia pronta

---

## Checklist de Hierarquia

- [ ] Focal point principal claramente identificável
- [ ] Três níveis de hierarquia definidos
- [ ] Sem competição visual entre elementos
- [ ] Tamanhos proporcionais à importância
- [ ] Cores usadas estrategicamente para destaque
- [ ] Espaço em branco direcionando atenção
- [ ] CTA visualmente dominante (quando aplicável)
- [ ] Passa no "squint test"

---

## Fontes de Referência
- Aaron Walter, "Designing for Emotion"
- Robin Williams, "The Non-Designer's Design Book"
- Gestalt Principles of Visual Perception
- Nielsen Norman Group - Visual Hierarchy Research
