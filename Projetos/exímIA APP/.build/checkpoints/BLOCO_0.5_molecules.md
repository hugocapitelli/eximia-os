# CHECKPOINT: BLOCO 0.5 - Design System: Molecules
**Criado:** 26 Janeiro 2026
**Atualizado:** 26 Janeiro 2026
**Status:** `NOT_STARTED`

---

## Informações do Bloco

| Campo | Valor |
|-------|-------|
| **PRD Fonte** | `00_Core/PRD-Design-System-v5.0.md` (seção 4) |
| **Dependências** | BLOCO 0.4 |
| **Instância Atual** | - |

---

## Checklist de Escopo

### FormField
- [ ] Composição: Label + Input + HelperText/Error
- [ ] Integração com react-hook-form (opcional)
- [ ] Estados de validação
- [ ] Required indicator

### SearchInput
- [ ] Ícone de busca
- [ ] Clear button
- [ ] Keyboard shortcut hint (⌘K)
- [ ] Loading state

### MetricCard
- [ ] Header (icon + label + period)
- [ ] Value (número grande)
- [ ] Progress bar (opcional)
- [ ] Comparison (vs período anterior)
- [ ] Trend indicator (up/down)

### NavItem
- [ ] Icon + Label
- [ ] Active state
- [ ] Badge (notificação)
- [ ] Collapsed mode (só ícone)
- [ ] Sub-items (expandable)

### EntityLink
- [ ] Chip style
- [ ] Icon por tipo de entidade
- [ ] Hover preview (opcional)
- [ ] Click para navegar

**Progresso:** 0/17 (0%)

---

## Estado Atual

### Última Ação Realizada
```
Nenhuma - bloco não iniciado
Depende de: BLOCO 0.4 (Atoms)
```

### Próxima Ação Pendente
```
Aguardar conclusão do BLOCO 0.4
```

---

## Estrutura de Arquivos Esperada

```
src/components/molecules/
├── form-field.tsx
├── search-input.tsx
├── metric-card.tsx
├── nav-item.tsx
├── entity-link.tsx
└── index.ts
```

---

## Critério de Done

- [ ] Componentes compostos funcionando
- [ ] Props tipadas corretamente
- [ ] Reutilizando atoms do BLOCO 0.4
- [ ] Responsivos (mobile-first)

---

## Histórico de Sessões

| Data | Instância | Ações | Resultado |
|------|-----------|-------|-----------|
| 26/01/2026 | - | Checkpoint criado | Setup inicial |

---

*Última atualização: 26 Janeiro 2026 - 14:00*
