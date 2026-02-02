# EPIC-002: Modo Leitura

> Sistema de Resumos Estruturados — Admin cria, todos leem
> Fase 01 | Version 3.0.0 | 2026-02-01
> Arquitetura: V3 Aprovada por Aria (Architect)

---

## Visão Geral do Epic

| Campo | Valor |
|-------|-------|
| Epic ID | EPIC-002 |
| Título | Modo Leitura — Resumos em Capítulos |
| PRD Relacionado | PRD-001-BIBLIOTECA (RF-006) |
| Owner | Morgan (PM) |
| Tech Lead | Aria (Architect) |
| Story Points Total | ~45 SP |
| Sprints Estimados | 2-3 |

---

## Objetivo

Implementar o sistema de resumos estruturados com arquitetura V3:
1. Admin cria resumos vinculados ao `book_catalog`
2. Resumos divididos em capítulos (Markdown)
3. Modo Leitura imersivo com temas e fontes
4. Progresso salvo automaticamente
5. Integração com sistema de favoritos

---

## Modelo de Dados V3

```
┌─────────────────┐
│  book_catalog   │
│  (Admin adiciona)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐         ┌─────────────────────────┐
│ book_summaries  │────────►│   summary_chapters      │
│ (Admin cria)    │         │   (conteúdo Markdown)   │
│ is_published    │         └─────────────────────────┘
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ summary_reading_progress│
│ (progresso por usuário) │
└─────────────────────────┘
```

---

## Stories

### EXIMIA-201: Server Actions de Resumos (Leitura)

| Campo | Valor |
|-------|-------|
| Story Points | 5 |
| Sprint | 3 |
| Dependências | EXIMIA-101 (Schema V3) |

**User Story:**
Como usuário, quero acessar resumos publicados, para ler conteúdos disponíveis.

**Ver:** `STORIES/EXIMIA-201.md`

---

### EXIMIA-202: Componente ReadingMode

| Campo | Valor |
|-------|-------|
| Story Points | 8 |
| Sprint | 3 |
| Dependências | EXIMIA-201 |

**User Story:**
Como usuário, quero uma experiência de leitura imersiva, para ler resumos com conforto.

**Ver:** `STORIES/EXIMIA-202.md`

---

### EXIMIA-203: Controles de Tema e Fonte

| Campo | Valor |
|-------|-------|
| Story Points | 5 |
| Sprint | 3 |
| Dependências | EXIMIA-202 |

**User Story:**
Como usuário, quero ajustar tema e tamanho da fonte, para ler com conforto visual.

**Ver:** `STORIES/EXIMIA-203.md`

---

### EXIMIA-204: Sumário (Table of Contents)

| Campo | Valor |
|-------|-------|
| Story Points | 5 |
| Sprint | 4 |
| Dependências | EXIMIA-202 |

**User Story:**
Como usuário, quero ver o sumário e pular para capítulos, para navegar rapidamente.

**Ver:** `STORIES/EXIMIA-204.md`

---

### EXIMIA-205: Progresso de Leitura

| Campo | Valor |
|-------|-------|
| Story Points | 5 |
| Sprint | 4 |
| Dependências | EXIMIA-202 |

**User Story:**
Como usuário, quero que meu progresso seja salvo, para continuar de onde parei.

**Ver:** `STORIES/EXIMIA-205.md`

---

### EXIMIA-206: Rota e Integração com Favoritos

| Campo | Valor |
|-------|-------|
| Story Points | 5 |
| Sprint | 4 |
| Dependências | EXIMIA-105, EXIMIA-202 |

**User Story:**
Como usuário, quero acessar o modo leitura a partir dos meus favoritos, para ler resumos disponíveis.

**Ver:** `STORIES/EXIMIA-206.md`

---

### EXIMIA-207: Admin — Criar e Editar Resumos

| Campo | Valor |
|-------|-------|
| Story Points | 8 |
| Sprint | 4 |
| Dependências | EXIMIA-103 |

**User Story:**
Como Admin, quero criar resumos para livros do catálogo, para disponibilizar conteúdo aos usuários.

**Ver:** `STORIES/EXIMIA-207.md`

---

### EXIMIA-208: Admin — Editor de Capítulos

| Campo | Valor |
|-------|-------|
| Story Points | 8 |
| Sprint | 4-5 |
| Dependências | EXIMIA-207 |

**User Story:**
Como Admin, quero criar e editar capítulos com editor rico, para produzir conteúdo de qualidade.

**Ver:** `STORIES/EXIMIA-208.md`

---

## Critérios de Done do Epic

- [ ] Modo leitura funcional end-to-end
- [ ] Admin pode criar e publicar resumos
- [ ] Usuários podem ler resumos publicados
- [ ] Preferências (tema/fonte) persistem
- [ ] Progresso salvo automaticamente
- [ ] Integrado com sistema de favoritos (badge "Resumo disponível")
- [ ] Responsivo em todos os dispositivos
- [ ] Performance < 300ms para mudança de capítulo
- [ ] Code review aprovado
- [ ] Deploy em staging validado

---

## Wireframes de Referência

### Modo Leitura — Desktop

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ← LEITURA  Deep Work                    │ ◯ ◉ ● │ A- A A+ │ ☰        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                           Deep Work                                     │
│                             ───                                         │
│                                                                         │
│   CAPÍTULO 1                                   ┌─────────────────┐     │
│   A Hipótese do Trabalho Profundo              │   SUMÁRIO       │     │
│   Por que a concentração é rara e valiosa      ├─────────────────┤     │
│   ───                                          │ 1. A Hipótese ◀ │     │
│                                                │ 2. Profundidade │     │
│   O trabalho profundo é a capacidade de        │ 3. Regras       │     │
│   focar sem distração em uma tarefa            │ 4. Práticas     │     │
│   cognitivamente exigente...                   │ 5. Conclusão    │     │
│                                                │                 │     │
│                                                │ Capítulo 1 de 5 │     │
│                                                └─────────────────┘     │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│  ‹ Anterior                    1 / 5                    Próximo ›      │
└─────────────────────────────────────────────────────────────────────────┘
```

### Modo Leitura — Mobile

```
┌────────────────────────────┐
│ ←  Deep Work      ◉  A  ☰ │
├────────────────────────────┤
│                            │
│       Deep Work            │
│          ───               │
│                            │
│ CAPÍTULO 1                 │
│ A Hipótese do Trabalho     │
│ ───                        │
│                            │
│ O trabalho profundo é a    │
│ capacidade de focar sem    │
│ distração em uma tarefa    │
│ cognitivamente exigente.   │
│                            │
├────────────────────────────┤
│ ‹ Ant      1/5      Próx › │
└────────────────────────────┘
```

---

## Dependências

### Pré-requisitos
- EPIC-001 parcialmente completo (EXIMIA-101, EXIMIA-103)
- Sistema de roles (admin) configurado
- Autenticação funcionando

### Bibliotecas Necessárias
- TipTap (editor rich text para Admin)
- @dnd-kit (drag-and-drop para reordenar capítulos)
- react-markdown (renderização)

---

## Riscos

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Complexidade do editor | Alta | Alto | Usar TipTap com config básica |
| Sync de preferências offline | Média | Baixo | localStorage como fallback |
| Performance com capítulos longos | Baixa | Médio | Lazy loading + virtualização |

---

*— River, removendo obstáculos 🌊*
