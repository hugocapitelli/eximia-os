# CHECKPOINT: BLOCO 0.3 - Design System: Tokens & Base
**Criado:** 26 Janeiro 2026
**Atualizado:** 26 Janeiro 2026
**Status:** `NOT_STARTED`

---

## Informações do Bloco

| Campo | Valor |
|-------|-------|
| **PRD Fonte** | `00_Core/PRD-Design-System-v5.0.md` (seções 1-2) |
| **Dependências** | BLOCO 0.1 |
| **Instância Atual** | - |

---

## Checklist de Escopo

### Design Tokens
- [ ] Criar arquivo de tokens CSS (globals.css ou tokens.css)
- [ ] Cores ExímIA (#FDBF68 palette completa)
- [ ] Cores semânticas (success, warning, error, info)
- [ ] Typography scale
- [ ] Spacing scale (4px base)
- [ ] Border radius scale
- [ ] Shadow scale
- [ ] Animation/transition tokens

### Tailwind Config
- [ ] Estender colors com palette ExímIA
- [ ] Configurar font families
- [ ] Configurar spacing customizado
- [ ] Configurar breakpoints
- [ ] Dark mode (class strategy)

### shadcn/ui Setup
- [ ] Inicializar shadcn/ui
- [ ] Configurar tema dark como default
- [ ] Customizar CSS variables do shadcn
- [ ] Instalar componentes base (button, input, card)

### Documentação
- [ ] Criar arquivo de referência dos tokens
- [ ] Exemplos de uso

**Progresso:** 0/14 (0%)

---

## Estado Atual

### Última Ação Realizada
```
Nenhuma - bloco não iniciado
Depende de: BLOCO 0.1 (Setup Next.js)
```

### Próxima Ação Pendente
```
Aguardar conclusão do BLOCO 0.1
```

---

## Referência de Tokens (do PRD)

### Cores ExímIA Gold

```css
:root {
  --eximia-50:  #FFF9F0;
  --eximia-100: #FEF0DC;
  --eximia-200: #FDE4C4;
  --eximia-300: #FDD59A;
  --eximia-400: #FDBF68;  /* PRINCIPAL */
  --eximia-500: #E5A850;
  --eximia-600: #CC9340;
  --eximia-700: #A67530;
  --eximia-800: #805A25;
  --eximia-900: #5C401A;
}
```

### Cores Semânticas

```css
:root {
  --success: #22c55e;
  --warning: #FDBF68;
  --error:   #ef4444;
  --info:    #3b82f6;
}
```

### Typography

```css
:root {
  --font-sans:    'Inter', system-ui, sans-serif;
  --font-heading: 'Cal Sans', 'Inter', sans-serif;
  --font-mono:    'JetBrains Mono', monospace;
}
```

---

## Critério de Done

- [ ] Tokens disponíveis via CSS variables
- [ ] Tailwind usando cores ExímIA
- [ ] shadcn/ui com tema dark aplicado
- [ ] Componentes básicos renderizando com tema correto

---

## Histórico de Sessões

| Data | Instância | Ações | Resultado |
|------|-----------|-------|-----------|
| 26/01/2026 | - | Checkpoint criado | Setup inicial |

---

*Última atualização: 26 Janeiro 2026 - 14:00*
