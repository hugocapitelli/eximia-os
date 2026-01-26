# ExímIA OS — Índice Master de PRDs
**Versão:** 5.0
**Data:** 25 Janeiro 2026
**Status:** Modularizado

---

## Filosofia da Modularização

> *"Build systems, not pages."* — Brad Frost

Este índice organiza o PRD monolítico do ExímIA OS em **moléculas de PRDs** — documentos modulares, independentes mas conectados, seguindo os princípios do Atomic Design.

Cada PRD é versionado individualmente, permitindo evolução granular de cada módulo sem afetar o sistema completo.

---

## Estrutura de Arquivos

```
Projetos/exímIA APP/
├── MANIFESTO.md                      ← Visão e Filosofia (NÃO é PRD)
├── PRD-Master-Index-v5.0.md          ← VOCÊ ESTÁ AQUI
├── PRD-ExímIA-OS.md                  ← PRD original completo (referência)
│
├── 00_Core/                          ← Fundação do Sistema
│   ├── PRD-Design-System-v5.0.md     → Tokens, componentes, PWA, mobile-first
│   ├── PRD-Connection-Layer-v5.0.md  → O CORAÇÃO (60% do valor)
│   ├── PRD-API-Endpoints-v5.0.md     → Contratos de API
│   └── PRD-Synthetic-Minds-Library-v1.0.md  🆕 Clone library management
│
├── 01_Journey/                       ← Módulo de Execução Pessoal
│   └── PRD-Journey-v5.0.md
│
├── 02_Academy/                       ← Módulo de Aprendizado Socrático
│   └── PRD-Academy-v5.1.md           ⭐ ESTRATÉGICO (pilar de receita)
│                                       + Course_Designer integration
│
├── 03_Brand/                         ← Módulo de Gestão de Marca
│   └── PRD-Brand-v5.0.md
│
├── 04_Strategy/                      ← Módulo de Planejamento
│   └── PRD-Strategy-v5.0.md
│
├── 05_PrototypOS/                    ← Módulo de Prototipagem
│   ├── PRD-PrototypOS-v5.0.md
│   └── PRD-Design-Systems-Library-v1.0.md  🆕 DS library & reuse
│
├── 06_Inbox/                         ← Sistema de Captura Universal
│   └── PRD-Inbox-v5.0.md
│
├── 08_Finance/                       ← Módulo Financeiro (Proposta)
│   └── PRD-Finance-v1.0.md           ⚠️ Ainda não implementado
│
├── 07_X_Agents/                      ← Agentes Táticos Especializados
│   └── Course_Designer/
│       └── PRD-Course-Designer-v1.0.md  🆕 Course architecture agent
│
└── 99_Analysis/                      ← Análises e Reviews
    ├── PRD-Critical-Analysis-v5.0.md → Gaps e próximos passos
    ├── PRD-Clone-Reviews-v5.0.md     → Elon Musk + Brad Frost
    ├── PRD-Metrics-v5.0.md           → Métricas de sucesso (produto)
    ├── PRD-Personal-Metrics-v1.0.md  🆕 Métricas pessoais (Acabativa + CPI)
    └── COURSE_CREATOR_ANALYSIS.md    → Strategic analysis (Hybrid Architecture)
```

---

## Hierarquia de Dependências

### Camada 1 (Fundação — Ler Primeiro)
1. **MANIFESTO.md** — Por que existimos (visão, não é PRD)
2. **PRD-Design-System-v5.0.md** — Linguagem visual + Mobile-First + PWA
3. **PRD-Connection-Layer-v5.0.md** — O diferencial ⭐
4. **PRD-Synthetic-Minds-Library-v1.0.md** 🆕 Clone library management

### Camada 2 (Módulos Core)
5. **PRD-Journey-v5.0.md**
6. **PRD-Academy-v5.1.md** ⭐ Pilar estratégico + Course_Designer integration
7. **PRD-Strategy-v5.0.md**

### Camada 3 (Módulos Complementares)
8. **PRD-Brand-v5.0.md**
9. **PRD-PrototypOS-v5.0.md**
10. **PRD-Design-Systems-Library-v1.0.md** 🆕 DS reuse & organization
11. **PRD-Inbox-v5.0.md**

### Camada 4 (X_Agents — Specialists)
12. **PRD-Course-Designer-v1.0.md** 🆕 Course architecture agent (reusable)

### Camada 5 (Plataforma)
13. **PRD-API-Endpoints-v5.0.md**

### Camada 6 (Futuro)
14. **PRD-Finance-v1.0.md** (proposta)

### Camada 7 (Meta)
15. **PRD-Critical-Analysis-v5.0.md**
16. **PRD-Clone-Reviews-v5.0.md**
17. **PRD-Metrics-v5.0.md** — Métricas de produto
18. **PRD-Personal-Metrics-v1.0.md** 🆕 Acabativa Index + CPI + Insights/Memos
19. **COURSE_CREATOR_ANALYSIS.md** — Strategic decision doc

---

## Guia Rápido de Navegação

### Para Produto/Design
```
1. MANIFESTO → entender a visão
2. Design System → linguagem visual, mobile-first, PWA
3. Módulos específicos → features detalhadas
```

### Para Engenharia/Dev
```
1. Design System → mobile-first, PWA, responsive
2. Connection Layer → arquitetura central
3. API Endpoints → contratos
4. Módulos específicos → modelos de dados
```

### Para Executivos/Investidores
```
1. MANIFESTO → propósito
2. Academy → pilar estratégico
3. Metrics → KPIs de sucesso
4. Critical Analysis → gaps honestos
```

### Para Novos Membros do Time
```
Leitura obrigatória (nesta ordem):
1. MANIFESTO
2. Connection Layer
3. Design System (entender mobile-first)
4. Academy (pilar estratégico)
5. Critical Analysis (onde estamos VS onde queremos chegar)
```

---

## Convenção de Versionamento

Cada PRD segue **versionamento semântico independente**:

```
PRD-[Módulo]-v[MAJOR].[MINOR].md

Exemplos:
- PRD-Journey-v5.0.md      → Versão atual
- PRD-Journey-v5.1.md      → Mudança pequena
- PRD-Journey-v6.0.md      → Breaking change
- PRD-Finance-v1.0.md      → Novo módulo (começa em v1.0)
```

### Quando incrementar versão?

| Mudança | Incremento | Exemplo |
|---------|-----------|---------|
| Nova feature no módulo | MINOR | v5.0 → v5.1 |
| Mudança arquitetural | MAJOR | v5.1 → v6.0 |
| Correção de texto/typo | — | Não versionar |
| Remoção de feature | MAJOR | v5.0 → v6.0 |

---

## Status dos Módulos

| Módulo | Versão PRD | Status Implementação | Prioridade |
|--------|-----------|---------------------|-----------|
| **Design System** | v5.0 | ⚠️ Parcial | Alta |
| **Connection Layer** | v5.0 | ❌ Não implementado | **CRÍTICA** |
| **Journey** | v5.0 | ⚠️ Parcial | Alta |
| **Academy** | v5.1 | ⚠️ MVP | **CRÍTICA** ⭐ |
| **Brand** | v5.0 | ⚠️ Parcial | Média |
| **Strategy** | v5.0 | ⚠️ Parcial | Alta |
| **PrototypOS** | v5.0 | ⚠️ Parcial | Média |
| **Design Systems Library** 🆕 | v1.0 | ❌ Proposta | Média |
| **Inbox** | v5.0 | ❌ Não implementado | Alta |
| **Finance** | v1.0 | ❌ Proposta | Baixa (futuro) |
| **Synthetic Minds Library** 🆕 | v1.0 | ❌ Proposta | Média-Alta |
| **Course_Designer** 🆕 | v1.0 | ❌ Especificado | Alta ⭐ |
| **Personal Metrics** 🆕 | v1.0 | ❌ Especificado | Alta |

**Legenda:**
- ✅ Completo — Implementado e validado
- ⚠️ Parcial — Em desenvolvimento ou MVP
- ❌ Não implementado — Só especificação
- ⭐ Pilar estratégico de receita

---

## Princípios de Modularização

### 1. **Independência**
Cada PRD deve ser legível isoladamente, sem precisar consultar outros.

### 2. **Conexão Explícita**
Links entre PRDs são explicitados com referências claras:
```markdown
Ver também: [PRD-Connection-Layer-v5.0.md](./00_Core/PRD-Connection-Layer-v5.0.md)
```

### 3. **Single Source of Truth**
Informação não duplica. Se dois PRDs precisam da mesma informação, ela vive em um e é referenciada no outro.

### 4. **Versionamento Granular**
Mudanças em um módulo não forçam re-versionamento de todo o sistema.

### 5. **Mobile-First**
Design System integra mobile, PWA e responsive desde a fundação — não como add-on.

---

## Workflow de Evolução

### Quando criar novo PRD?
- Novo módulo sendo adicionado
- Sub-módulo complexo o suficiente para PRD próprio

### Quando atualizar versão?
1. Fazer mudanças no arquivo
2. Salvar como nova versão: `PRD-[Módulo]-v[X].[Y].md`
3. Atualizar este índice
4. Adicionar entry no changelog do módulo

### Quando deprecar versão antiga?
- Manter última 2 versões (current + anterior)
- Mover versões antigas para `/archive/`

---

## Changelog Master

| Data | Mudança | Arquivos Afetados |
|------|---------|-------------------|
| 26/01/2026 | 🆕 **Personal Metrics System v1.0** — Sistema proprietário de métricas pessoais: (1) Índice de Acabativa (conclusão de projetos), (2) Sistema de Insights (captura e tracking), (3) Integração com Memos, (4) Creative Productivity Index (CPI) combinando execução + criatividade. Dashboard dedicado. | PRD-Personal-Metrics-v1.0.md |
| 26/01/2026 | 🆕 **3 New PRDs** — (1) Course_Designer v1.0: X_Agent para arquitetura de cursos (ELC+ 2026 + LXD). (2) Design Systems Library v1.0: Biblioteca de DS reutilizáveis (inspirado em Alan's demo). (3) Synthetic Minds Library v1.0: Biblioteca curada de clones validados. | PRD-Course-Designer-v1.0.md, PRD-Academy-v5.1.md, PRD-Design-Systems-Library-v1.0.md, PRD-Synthetic-Minds-Library-v1.0.md, COURSE_CREATOR_ANALYSIS.md |
| 25/01/2026 | **v5.0** — Modularização completa. MANIFESTO separado (não é PRD). Mobile/PWA integrado ao Design System. | Todos |
| 25/01/2026 | **v4.2** — Clone Reviews (Elon + Brad) adicionados | PRD original |
| 25/01/2026 | **v4.1** — Connection Layer expandida para 60% | PRD original |

---

## Próximos Passos

1. ✅ Criar estrutura de pastas
2. ✅ Separar MANIFESTO (visão, não PRD)
3. ✅ Integrar Mobile/PWA ao Design System
4. 🔄 Extrair módulos do PRD original
5. ⏳ Validar com time
6. ⏳ Começar desenvolvimento priorizado

---

## Contatos

**Product Owner:** Hugo Capitelli
**Empresa:** ExímIA Ventures
**Repositório:** eximIA.OS

---

*Este índice é a porta de entrada para o sistema de documentação modular do ExímIA OS.*
*Última atualização: 26 Janeiro 2026*
