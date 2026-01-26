# CHECKPOINT: BLOCO 0.4 - Design System: Atoms
**Criado:** 26 Janeiro 2026
**Atualizado:** 26 Janeiro 2026
**Status:** `NOT_STARTED`

---

## Informações do Bloco

| Campo | Valor |
|-------|-------|
| **PRD Fonte** | `00_Core/PRD-Design-System-v5.0.md` (seção 3) |
| **Dependências** | BLOCO 0.3 |
| **Instância Atual** | - |

---

## Checklist de Escopo

### Button
- [ ] Variantes: primary, secondary, ghost, danger, success
- [ ] Sizes: sm, md, lg
- [ ] Estados: default, hover, focus, active, disabled, loading
- [ ] Com ícone (left/right)
- [ ] Icon-only variant

### Input
- [ ] Variantes: default, filled, outline
- [ ] Sizes: sm, md, lg
- [ ] Estados: default, focus, error, success, disabled
- [ ] Left/right icons
- [ ] Prefix/suffix
- [ ] Clearable

### Badge
- [ ] Variantes: default, primary, success, warning, error, outline
- [ ] Sizes: sm, md

### Icon
- [ ] Setup Lucide Icons
- [ ] Wrapper component com sizes padronizados
- [ ] Catálogo de ícones usados

### Avatar
- [ ] Com imagem
- [ ] Fallback (iniciais)
- [ ] Sizes: sm, md, lg
- [ ] Com status indicator

### Typography
- [ ] Heading (h1-h6)
- [ ] Text (p, span)
- [ ] Label
- [ ] Variantes de peso e cor

**Progresso:** 0/22 (0%)

---

## Estado Atual

### Última Ação Realizada
```
Nenhuma - bloco não iniciado
Depende de: BLOCO 0.3 (Design Tokens)
```

### Próxima Ação Pendente
```
Aguardar conclusão do BLOCO 0.3
```

---

## Estrutura de Arquivos Esperada

```
src/components/ui/
├── button.tsx          # shadcn customizado
├── input.tsx           # shadcn customizado
├── badge.tsx           # shadcn customizado
├── avatar.tsx          # shadcn customizado
├── icon.tsx            # Wrapper Lucide
├── typography.tsx      # Heading, Text, Label
└── index.ts            # Re-exports
```

---

## Critério de Done

- [ ] Todos atoms exportados de `@/components/ui`
- [ ] Todos estados visuais funcionando
- [ ] Focus visible para acessibilidade
- [ ] TypeScript types corretos
- [ ] Tema dark aplicado

---

## Histórico de Sessões

| Data | Instância | Ações | Resultado |
|------|-----------|-------|-----------|
| 26/01/2026 | - | Checkpoint criado | Setup inicial |

---

*Última atualização: 26 Janeiro 2026 - 14:00*
