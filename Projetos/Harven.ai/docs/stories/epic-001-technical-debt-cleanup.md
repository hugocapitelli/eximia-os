# Epic 001: Technical Debt Cleanup

**Epic ID:** HARVEN-EPIC-001
**Criado:** 2026-02-02
**Prioridade:** Alta
**Status:** Draft

---

## Objetivo

Reduzir o débito técnico acumulado no projeto Harven.AI para facilitar manutenção, novas features e trabalho em equipe.

## Contexto

O projeto acumulou débitos técnicos significativos durante o desenvolvimento inicial:
- Backend monolítico com 4.814 linhas em arquivo único
- 56 prints de DEBUG em produção
- Ausência de testes automatizados
- Problemas de segurança (senhas sem hash)
- Type safety comprometida no frontend

## Escopo

### Incluído
- Refatoração do backend em módulos
- Remoção de debug statements
- Setup de testes automatizados
- Correções de segurança
- Configuração de linting

### Excluído
- Novas features
- Mudanças de UI/UX
- Migrações de banco de dados

## Stories

| ID | Título | Prioridade | Pontos |
|----|--------|------------|--------|
| HARVEN-001 | Configurar ESLint e Prettier no Frontend | Alta | 2 |
| HARVEN-002 | Remover Debug Prints do Backend | Crítica | 3 |
| HARVEN-003 | Setup Pytest e Testes Básicos | Crítica | 5 |
| HARVEN-004 | Implementar Hash de Senhas com Bcrypt | Crítica | 3 |
| HARVEN-005 | Separar main.py em Routers - Fase 1 | Alta | 8 |
| HARVEN-006 | Separar main.py em Routers - Fase 2 | Alta | 8 |
| HARVEN-007 | Tipar API Client (Remover any) | Média | 5 |
| HARVEN-008 | Melhorar Error Handling Global | Média | 5 |
| HARVEN-009 | Configurar CI/CD com GitHub Actions | Média | 3 |

## Métricas de Sucesso

- [ ] Zero prints DEBUG no código
- [ ] Cobertura de testes > 30% em endpoints críticos
- [ ] Zero uso de `any` no api.ts
- [ ] main.py < 500 linhas
- [ ] ESLint passando sem erros
- [ ] CI/CD rodando em cada PR

## Dependências

```
[HARVEN-001] ──┐
               ├──▶ [HARVEN-007]
[HARVEN-002] ──┤
               ├──▶ [HARVEN-005] ──▶ [HARVEN-006]
[HARVEN-003] ──┘         │
                         ▼
               [HARVEN-008] ──▶ [HARVEN-009]
```

## Riscos

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Regressões durante refatoração | Média | Alto | Criar testes antes de refatorar |
| Conflitos de merge | Alta | Médio | Fazer em branch única, merge frequente |
| Tempo maior que estimado | Média | Médio | Priorizar quick wins primeiro |

---

**Owner:** TBD
**Review:** TBD
