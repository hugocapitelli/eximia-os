---
title: "KB_11: Lean Tools Integration com A3"
galaxy: "CREATION"
galaxy-color: "#FF8C00"
document-type: "knowledge-base"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "kb-11-lean-tools-integration"
  - "kb_11: lean tools integration "
  - "visão geral"
  - "value stream mapping (vsm)"
  - "o que é"
  - "integração com a3"
  - "métricas do vsm para a3"
  - "quando usar"
  - "kanban"
  - "tipos de kanban"
tags:
  - "galaxy-creation"
  - "knowledge-base"
---

# KB_11: Lean Tools Integration com A3

## Visão Geral

O A3 não existe isolado - ele se integra com todo o ecossistema de ferramentas Lean. Este KB mapeia como usar cada ferramenta no contexto do A3.

## Value Stream Mapping (VSM)

### O que é
Mapa visual de todas as ações (valor agregado e não-valor agregado) necessárias para levar um produto da matéria-prima ao cliente.

### Integração com A3

| Seção A3 | Uso do VSM |
|----------|------------|
| Condições Atuais | VSM do estado atual como evidência |
| Objetivos | Métricas derivadas do VSM (lead time, WIP, etc.) |
| Contramedidas | VSM do estado futuro como visão |

### Métricas do VSM para A3

- **Lead Time**: Tempo total porta-a-porta
- **Process Time**: Tempo de valor agregado
- **Takt Time**: Ritmo da demanda do cliente
- **WIP**: Work in Process em cada etapa
- **%VA**: Percentual de valor agregado

### Quando Usar

Use VSM quando o problema envolve:
- Fluxo de material ou informação
- Lead time excessivo
- Inventário alto
- Múltiplos handoffs

## Kanban

### O que é
Sistema de sinalização visual para controle de produção puxada.

### Tipos de Kanban

| Tipo | Uso |
|------|-----|
| **Kanban de Produção** | Autoriza produção de item |
| **Kanban de Movimentação** | Autoriza movimentação de material |
| **Kanban de Sinal** | Dispara reposição de lote |

### Integração com A3

**Como Contramedida:**
- Implementar kanban para controlar WIP
- Substituir sistema push por pull
- Visualizar status de trabalho

**Como Ferramenta de Análise:**
- Identificar gargalos pelo acúmulo de kanbans
- Medir lead time real

### Cálculo de Kanban

```
Número de Kanbans = (Demanda × Lead Time × Fator de Segurança) / Tamanho do Container
```

## Heijunka (Nivelamento)

### O que é
Nivelamento da produção por volume e mix para reduzir variabilidade.

### Heijunka Box

Caixa visual que distribui trabalho uniformemente ao longo do tempo.

```
         8h   9h   10h  11h  12h  13h  14h  15h
Prod A   ■    ■    ■    ■    ■    ■    ■    ■
Prod B   ■         ■         ■         ■
Prod C        ■         ■         ■         ■
```

### Integração com A3

**Na Análise de Causa:**
- Variabilidade de demanda como causa de problemas
- Picos e vales causando sobrecarga/ociosidade

**Como Contramedida:**
- Implementar heijunka para estabilizar fluxo
- Reduzir tamanho de lote

## Jidoka (Autonomação)

### O que é
Automação com toque humano - máquinas param automaticamente quando detectam anormalidade.

### Pilares do Jidoka

1. **Detectar** anormalidade automaticamente
2. **Parar** quando anormalidade ocorre
3. **Corrigir** a condição imediata
4. **Investigar** causa raiz e prevenir recorrência

### Integração com A3

**Como Causa (Ishikawa - Máquina):**
- Falta de jidoka permite defeitos passar
- Máquina não para quando deveria

**Como Contramedida:**
- Instalar sensores de detecção
- Implementar poka-yoke
- Criar alarmes visuais/sonoros

## Poka-Yoke

### O que é
Dispositivo à prova de erro que previne ou detecta erros.

### Tipos

| Tipo | Função | Exemplo |
|------|--------|---------|
| **Prevenção** | Impossibilita o erro | Conector que só encaixa na posição correta |
| **Detecção** | Alerta quando erro ocorre | Sensor que para máquina se peça faltando |
| **Alertivo** | Avisa para correção | Luz que acende se parâmetro fora |

### Hierarquia de Eficácia

```
PREVENÇÃO (melhor) → DETECÇÃO → ALERTA → TREINAMENTO (pior)
```

### Integração com A3

Poka-yoke é frequentemente a **melhor contramedida** porque:
- Elimina dependência de atenção humana
- Funciona 100% do tempo
- Não requer supervisão

**Pergunta-guia:** "Podemos criar um poka-yoke para isso?"

## 5S

### O que é
Metodologia de organização do local de trabalho.

| S | Japonês | Português | Ação |
|---|---------|-----------|------|
| 1 | Seiri | Senso de Utilização | Separar necessário do desnecessário |
| 2 | Seiton | Senso de Ordenação | Lugar para tudo, tudo no lugar |
| 3 | Seiso | Senso de Limpeza | Limpar e inspecionar |
| 4 | Seiketsu | Senso de Padronização | Padronizar os 3S anteriores |
| 5 | Shitsuke | Senso de Disciplina | Manter e melhorar |

### Integração com A3

**Na Análise de Causa (Meio Ambiente):**
- Desorganização contribuindo para erros
- Falta de padrão visual

**Como Contramedida:**
- Implementar 5S como base para outras melhorias
- 5S frequentemente é pré-requisito

## Andon

### O que é
Sistema de sinalização visual que indica status da produção e problemas.

### Cores Típicas

| Cor | Significado |
|-----|-------------|
| Verde | Normal, operando |
| Amarelo | Atenção, suporte necessário |
| Vermelho | Parado, problema crítico |
| Azul | Material necessário |
| Branco | Produção completa |

### Integração com A3

**Como Contramedida:**
- Implementar andon para tornar problemas visíveis
- Criar cadeia de ajuda visual

**No Monitoramento:**
- Usar dados do andon como indicador
- Frequência de paradas por tipo

## SMED (Single-Minute Exchange of Die)

### O que é
Metodologia para redução de tempo de setup.

### Etapas

1. **Separar** setup interno (máquina parada) de externo (máquina rodando)
2. **Converter** interno em externo onde possível
3. **Reduzir** tempo de atividades internas restantes
4. **Reduzir** tempo de atividades externas

### Integração com A3

**Quando Usar:**
- Problema envolve tempo de setup alto
- OEE baixo por muitas trocas
- Necessidade de lotes menores

**Como Contramedida:**
- Projeto SMED como iniciativa
- Meta de redução de tempo de setup

## TPM (Total Productive Maintenance)

### O que é
Sistema de manutenção que busca zero quebras, zero defeitos, zero acidentes.

### 8 Pilares

1. Manutenção Autônoma
2. Manutenção Planejada
3. Melhorias Específicas
4. Educação e Treinamento
5. Gestão Antecipada
6. Manutenção da Qualidade
7. TPM Administrativo
8. Segurança e Meio Ambiente

### Indicadores TPM para A3

- **OEE**: Overall Equipment Effectiveness
- **MTBF**: Mean Time Between Failures
- **MTTR**: Mean Time To Repair
- **Disponibilidade**: Tempo disponível / Tempo planejado

### Integração com A3

**Na Análise (Ishikawa - Máquina):**
- Falhas de equipamento como causa
- Manutenção inadequada

**Como Contramedida:**
- Implementar manutenção autônoma
- Criar padrões de manutenção preventiva

## OEE (Overall Equipment Effectiveness)

### Cálculo

```
OEE = Disponibilidade × Performance × Qualidade

Disponibilidade = Tempo Operando / Tempo Planejado
Performance = (Peças Produzidas × Tempo Ciclo Ideal) / Tempo Operando
Qualidade = Peças Boas / Peças Produzidas
```

### Classe Mundial

| Componente | Classe Mundial |
|------------|----------------|
| Disponibilidade | ≥ 90% |
| Performance | ≥ 95% |
| Qualidade | ≥ 99% |
| **OEE** | **≥ 85%** |

### 6 Grandes Perdas

1. Quebras
2. Setup e ajustes
3. Pequenas paradas
4. Velocidade reduzida
5. Defeitos e retrabalho
6. Startup losses

---

## Matriz: Ferramentas × Seções do A3

| Ferramenta | CA | OBJ | ISH | CM | MON |
|------------|----|----|-----|----|----|
| VSM | ● | ● | ○ | ● | ○ |
| Kanban | ○ | | ● | ● | |
| Heijunka | ○ | | ● | ● | |
| Jidoka | ○ | | ● | ● | |
| Poka-Yoke | | | ● | ● | |
| 5S | ○ | | ● | ● | |
| Andon | ○ | | ○ | ● | ● |
| SMED | ○ | ● | ● | ● | |
| TPM/OEE | ○ | ● | ● | ● | ● |

---

## Fontes

- Rother, M. & Shook, J. (1999). *Learning to See*. LEI.
- Shingo, S. (1985). *A Revolution in Manufacturing: The SMED System*.
- Hirano, H. (1995). *5 Pillars of the Visual Workplace*.
- Nakajima, S. (1988). *Introduction to TPM*.

#galaxy-creation