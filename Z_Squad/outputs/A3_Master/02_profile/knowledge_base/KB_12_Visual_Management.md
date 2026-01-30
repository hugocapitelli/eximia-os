# KB_12: Visual Management (Gestão Visual)

## Conceito Fundamental

**Visual Management** (Gestão Visual) é um sistema onde informações críticas são apresentadas de forma que qualquer pessoa possa entender o estado atual em 5 segundos ou menos, sem precisar de explicação.

> "Se você não consegue ver, você não consegue gerenciar."
> — Shigeo Shingo

### Princípio do 5 Segundos

Qualquer pessoa (operador, gerente, visitante) deve conseguir:
1. Ver o estado atual
2. Identificar se está normal ou anormal
3. Entender a ação necessária (se anormal)

**Em 5 segundos ou menos.**

## Níveis de Gestão Visual

### Nível 1: Compartilhar Informação
- Comunicados em quadros
- Indicadores básicos
- **Limitação**: Não indica se está bom ou ruim

### Nível 2: Estabelecer Padrões
- Faixas de operação (verde/amarelo/vermelho)
- Limites de controle
- **Limitação**: Não dispara ação automática

### Nível 3: Construir Padrões no Local
- Marcações no chão
- Sombras para ferramentas
- Kanban visual
- **Limitação**: Requer observação

### Nível 4: Alertar Anormalidades
- Andon (luzes)
- Alarmes sonoros
- Sinais automáticos
- **Melhor nível**: Impossível ignorar problema

### Nível 5: Prevenir Erros (Poka-Yoke)
- Design que impede erro
- Não depende de atenção humana
- **Objetivo final**: Erro é impossível

## Ferramentas de Gestão Visual

### Quadro de Gestão à Vista

```
┌─────────────────────────────────────────────────────────┐
│                  QUADRO GESTÃO À VISTA                  │
│                    [Área/Célula/Time]                   │
├─────────────────────────────────────────────────────────┤
│  SEGURANÇA    │  QUALIDADE   │  ENTREGA     │  CUSTO   │
│     ✓         │      ✓       │      ✗       │    ✓     │
│  0 acidentes  │  0,2% defeito│  85% OTIF    │  98% orç │
│  meta: 0      │  meta: 0,5%  │  meta: 95%   │  meta:100│
├─────────────────────────────────────────────────────────┤
│                    PROBLEMAS ABERTOS                     │
│  #123 - Atraso fornecedor X - Owner: João - Prazo: 15/02│
│  #124 - Refugo linha 3 - Owner: Maria - Prazo: 10/02   │
├─────────────────────────────────────────────────────────┤
│                    A3 EM ANDAMENTO                       │
│  A3-2026-001 - Redução Lead Time - Status: 60%         │
└─────────────────────────────────────────────────────────┘
```

### Sistema Andon

**Andon** (行灯) = Lanterna em japonês

| Cor | Significado | Ação |
|-----|-------------|------|
| 🟢 Verde | Normal | Continuar |
| 🟡 Amarelo | Atenção | Verificar em breve |
| 🔴 Vermelho | Problema | Parar e resolver |
| 🔵 Azul | Chamada | Suporte necessário |
| ⚪ Branco | Setup/Changeover | Em transição |

### Kanban Visual

```
┌──────────────────────────────────────────────┐
│              QUADRO KANBAN                    │
├──────────┬──────────┬──────────┬────────────┤
│ BACKLOG  │ EM PROG. │ REVISÃO  │ CONCLUÍDO  │
│          │ (max 3)  │ (max 2)  │            │
├──────────┼──────────┼──────────┼────────────┤
│  [card]  │  [card]  │  [card]  │  [card]    │
│  [card]  │  [card]  │          │  [card]    │
│  [card]  │  [card]  │          │  [card]    │
│  [card]  │          │          │  [card]    │
│          │          │          │  [card]    │
└──────────┴──────────┴──────────┴────────────┘
```

### Régua Visual de Indicadores

```
                    META
                      │
    ████████████████████░░░░░░░░░░
    │                 │           │
  Min               Atual        Max
  (vermelho)       (amarelo)    (verde)
```

**Cores Padrão:**
- 🟢 **Verde**: ≥ 100% da meta
- 🟡 **Amarelo**: 80-99% da meta
- 🔴 **Vermelho**: < 80% da meta

### Sombras e Demarcações

**Sombra de Ferramenta:**
- Contorno da ferramenta no local de guarda
- Ausência é imediatamente visível

**Demarcação de Piso:**
- Amarelo: Corredores, passagem
- Verde: Área de trabalho
- Vermelho: Área de segurança, extintores
- Azul: Materiais em processo

## Gestão Visual no A3

### A3 como Ferramenta Visual

O próprio A3 é uma ferramenta de gestão visual:
- **Uma página**: Visão completa sem virar
- **Estrutura fixa**: Sempre sei onde está cada informação
- **Gráficos e tabelas**: Dados visuais, não texto
- **Cores de status**: Verde/amarelo/vermelho nos indicadores

### Quadro de A3s

```
┌───────────────────────────────────────────────────────┐
│                    A3 BOARD                            │
├─────────────┬──────────────┬──────────────────────────┤
│ EM CRIAÇÃO  │ EM EXECUÇÃO  │ EM MONITORAMENTO        │
├─────────────┼──────────────┼──────────────────────────┤
│   [A3-001]  │   [A3-002]   │   [A3-003]  ✅          │
│             │   [A3-004]   │   [A3-005]  🟡          │
│             │              │   [A3-006]  🔴          │
└─────────────┴──────────────┴──────────────────────────┘

✅ On Track    🟡 Atenção    🔴 Off Track
```

### Obeya Room

**Obeya** (大部屋) = "Grande sala" em japonês

Sala física ou virtual onde:
- Todos os A3 ficam expostos
- Indicadores atualizados diariamente
- Time se reúne para decisões rápidas
- Problemas são visíveis para todos

**Layout típico:**
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐   │
│  │ HOSHIN  │  │   KPIs  │  │  A3s    │  │PROBLEMAS│   │
│  │  KANRI  │  │         │  │ ATIVOS  │  │ ABERTOS │   │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │              CRONOGRAMA / ROADMAP                │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐   │
│  │ AÇÕES   │  │ DECISÕES│  │ RISCOS  │  │APRENDIZ.│   │
│  │ DA SEM. │  │ PENDENTE│  │         │  │         │   │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Princípios de Design Visual

### 1. Simplicidade
- Menos é mais
- Remover informação desnecessária
- Foco no essencial

### 2. Padronização
- Cores consistentes em toda organização
- Formatos reconhecíveis
- Localização previsível

### 3. Atualização
- Dados em tempo real quando possível
- No mínimo diário para indicadores
- Desatualizado = invisível

### 4. Acionabilidade
- Todo visual deve levar a ação
- Se não muda decisão, não exiba
- Vermelho = ação imediata

### 5. Proximidade
- Visual no local onde é usado
- Operador não precisa sair para ver
- Decisão no ponto de ocorrência

## Checklist de Gestão Visual para A3

- [ ] O status do A3 é visível (verde/amarelo/vermelho)?
- [ ] Os indicadores têm régua visual clara?
- [ ] Qualquer pessoa entende o progresso em 5 segundos?
- [ ] O A3 está exposto em local visível (físico ou digital)?
- [ ] Anormalidades são destacadas visualmente?
- [ ] O cronograma mostra claramente atrasos?
- [ ] Há espaço para problemas emergentes?

---

## Fontes

- Shingo, Shigeo. "A Study of the Toyota Production System" (1989)
- Galsworth, Gwendolyn. "Visual Workplace/Visual Thinking" (2005)
- [Lean Enterprise Institute - Visual Management](https://www.lean.org/lexicon-terms/visual-management/)
- Toyota Motor Corporation - Visual Factory Standards
