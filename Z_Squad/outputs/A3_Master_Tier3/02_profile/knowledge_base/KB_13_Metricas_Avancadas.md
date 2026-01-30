# KB_13: Métricas Avançadas para A3

## Hierarquia de Indicadores

### Pirâmide de Métricas

```
         KRI (Key Result Indicators)
              Resultados finais
                    ↑
         KPI (Key Performance Indicators)
              Performance operacional
                    ↑
         KMI (Key Monitoring Indicators)
              Monitoramento contínuo
                    ↑
         OPI (Operational Performance Indicators)
              Indicadores operacionais diários
```

## Tipos de Indicadores

### KRI - Key Result Indicators
**O que são:** Resultados finais que refletem sucesso organizacional

| Indicador | Exemplo | Frequência |
|-----------|---------|------------|
| EBITDA | R$ 50M | Mensal |
| NPS | 72 | Mensal |
| Market Share | 23% | Trimestral |
| ROI | 18% | Anual |

**Uso no A3:** Conexão com Hoshin (Contexto)

### KPI - Key Performance Indicators
**O que são:** Métricas de performance que influenciam os KRIs

| Indicador | Exemplo | Frequência |
|-----------|---------|------------|
| OEE | 85% | Diária |
| OTIF | 95% | Semanal |
| Custo por unidade | R$ 12,50 | Mensal |
| Taxa de defeito | 500 PPM | Diária |

**Uso no A3:** Objetivos e Metas, Monitoramento

### KMI - Key Monitoring Indicators
**O que são:** Indicadores de acompanhamento de processos

| Indicador | Exemplo | Frequência |
|-----------|---------|------------|
| Tempo de ciclo | 45 seg | Por peça |
| WIP | 150 unidades | Horária |
| Downtime | 2h | Turno |
| Setup time | 25 min | Por troca |

**Uso no A3:** Condições Atuais, Monitoramento

### OPI - Operational Performance Indicators
**O que são:** Métricas operacionais do dia-a-dia

| Indicador | Exemplo | Frequência |
|-----------|---------|------------|
| Peças produzidas | 1.200/turno | Turno |
| Paradas de linha | 3/turno | Turno |
| Refugo | 15 peças | Turno |
| Horas extras | 2h | Diária |

**Uso no A3:** Evidências nas Condições Atuais

## Leading vs Lagging Indicators

### Lagging Indicators (Indicadores de Resultado)
**Características:**
- Medem resultado após o fato
- Fáceis de medir
- Difíceis de influenciar diretamente
- Mostram SE objetivo foi atingido

**Exemplos:**
- Faturamento
- Número de acidentes
- Taxa de defeito
- NPS

### Leading Indicators (Indicadores de Tendência)
**Características:**
- Medem atividades que levam ao resultado
- Mais difíceis de definir
- Fáceis de influenciar
- Mostram COMO atingir objetivo

**Exemplos:**
- Número de inspeções realizadas
- Taxa de adesão ao padrão
- Frequência de manutenção preventiva
- Horas de treinamento

### Balanceamento no A3

**Regra de Ouro:** Todo A3 deve ter pelo menos 1 leading e 1 lagging indicator

```
Leading Indicator     →     Ação     →     Lagging Indicator
(% check-lists              (Inspeção)      (Taxa de defeito)
 realizados)
```

## SMART para Metas

### S - Específico (Specific)
❌ "Melhorar a qualidade"
✅ "Reduzir taxa de defeito na linha de embalagem"

### M - Mensurável (Measurable)
❌ "Reduzir significativamente"
✅ "Reduzir de 2.500 PPM para 500 PPM"

### A - Alcançável (Achievable)
❌ "Zero defeitos em 1 mês"
✅ "Redução de 80% em 12 meses (benchmarks de indústria)"

### R - Relevante (Relevant)
❌ "Aumentar satisfação do fornecedor"
✅ "Aumentar OTIF que impacta satisfação do cliente"

### T - Temporal (Time-bound)
❌ "Reduzir custos"
✅ "OPEX ≤ 100% do orçamento até Dez/2026"

## Réguas de Monitoramento

### Estrutura Padrão

```
VERDE (On Track)     >= 95% da meta
AMARELO (Atenção)    70% - 94% da meta
VERMELHO (Crítico)   < 70% da meta
```

### Exemplo: OEE Meta 85%

| Status | Faixa | Ação |
|--------|-------|------|
| Verde | ≥ 80.75% | Manter, buscar 100% |
| Amarelo | 59.5% - 80.74% | Investigar causa, plano de ação |
| Vermelho | < 59.5% | Escalar, contramedidas emergenciais |

### Réguas por Tipo de Meta

| Tipo | Verde | Amarelo | Vermelho |
|------|-------|---------|----------|
| Maximizar (ex: OEE) | ≥ 95% meta | 70-94% | < 70% |
| Minimizar (ex: Defeitos) | ≤ 100% meta | 101-130% | > 130% |
| Manter (ex: Custo) | ± 5% meta | ± 6-15% | > ± 15% |

## Métricas por Área

### Produção/Operações

| Indicador | Fórmula | Benchmark |
|-----------|---------|-----------|
| OEE | Disp × Perf × Qual | ≥ 85% classe mundial |
| OTIF | Entregas corretas / Total | ≥ 95% |
| Takt Time | Tempo disponível / Demanda | Depende |
| Lead Time | Data saída - Data entrada | Reduzir |
| WIP | Unidades em processo | Minimizar |
| Setup Time | Tempo de troca | < 10 min (SMED) |

### Qualidade

| Indicador | Fórmula | Benchmark |
|-----------|---------|-----------|
| PPM | (Defeitos / Total) × 1.000.000 | < 500 |
| First Pass Yield | Peças boas na 1ª vez / Total | > 99% |
| Cpk | (USL - μ) / 3σ | ≥ 1.33 |
| Custo da Não Qualidade | Scrap + Retrabalho + Garantia | < 1% receita |
| Taxa de Reclamação | Reclamações / Produtos vendidos | Minimizar |

### Manutenção

| Indicador | Fórmula | Benchmark |
|-----------|---------|-----------|
| MTBF | Tempo total / Nº falhas | Maximizar |
| MTTR | Tempo reparo / Nº reparos | Minimizar |
| Disponibilidade | (MTBF / (MTBF + MTTR)) × 100 | ≥ 95% |
| Backlog Manutenção | HH pendentes / HH disponíveis | < 4 semanas |
| % Preventiva | HH preventiva / HH total | > 70% |

### Pessoas

| Indicador | Fórmula | Benchmark |
|-----------|---------|-----------|
| Absenteísmo | Faltas / Dias úteis | < 3% |
| Turnover | Saídas / Headcount médio | < 10% ano |
| Taxa de Acidentes | Acidentes × 200.000 / HH | Zero |
| Horas de Treinamento | HH treinamento / Headcount | > 40h/ano |
| Engajamento | Pesquisa de clima | > 75% |

### Financeiro

| Indicador | Fórmula | Benchmark |
|-----------|---------|-----------|
| OPEX / Receita | OPEX / Receita líquida | Depende setor |
| Custo por unidade | Custo total / Unidades | Reduzir |
| Margem de Contribuição | (Receita - CV) / Receita | Maximizar |
| Giro de Estoque | CMV / Estoque médio | Maximizar |
| CAPEX ROI | Benefício / Investimento | > TMA |

## Estratificação de Dados

### Por quê Estratificar
- Revelar padrões ocultos na média
- Direcionar análise de causa raiz
- Priorizar contramedidas

### Dimensões de Estratificação

| Dimensão | Exemplo |
|----------|---------|
| **Tempo** | Turno, Dia, Semana, Mês |
| **Local** | Linha, Célula, Planta, Região |
| **Produto** | SKU, Família, Categoria |
| **Processo** | Etapa, Operação, Máquina |
| **Pessoa** | Operador, Equipe, Supervisor |
| **Fornecedor** | Por fornecedor de insumo |

### Exemplo de Estratificação

```
PROBLEMA: Taxa de defeito = 2.500 PPM

ESTRATIFICAÇÃO:
- Por linha: Linha A = 4.000 PPM, Linha B = 1.000 PPM
- Por turno (Linha A): T1 = 2.000, T2 = 6.000, T3 = 4.000
- Por defeito (T2): Selo = 80%, Outros = 20%

FOCO: Selo na Linha A, Turno 2
```

## Dashboards e Visualização

### Princípios de Gestão Visual

1. **No Gemba**: Dashboard no local de trabalho
2. **Tempo Real**: Atualização no mínimo diária
3. **Simplicidade**: Máximo 5-7 indicadores por dashboard
4. **Acionável**: Cada indicador tem dono e ação

### Layout Típico

```
┌─────────────────────────────────────────────────┐
│              DASHBOARD [ÁREA/LINHA]             │
├─────────────────┬─────────────────┬─────────────┤
│   SEGURANÇA     │   QUALIDADE     │ ENTREGA     │
│   [Verde/Verm]  │   [Verde/Verm]  │ [Verde/Verm]│
├─────────────────┼─────────────────┼─────────────┤
│   PRODUTIVIDADE │   CUSTO         │   PESSOAS   │
│   [Verde/Verm]  │   [Verde/Verm]  │ [Verde/Verm]│
└─────────────────┴─────────────────┴─────────────┘
```

---

## Fontes

- Parmenter, D. (2015). *Key Performance Indicators*. Wiley.
- Eckerson, W. (2010). *Performance Dashboards*. Wiley.
- Kaplan & Norton (1996). *The Balanced Scorecard*. HBS Press.
