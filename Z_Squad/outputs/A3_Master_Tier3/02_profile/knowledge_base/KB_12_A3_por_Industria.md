# KB_12: A3 por Indústria - Adaptações e Exemplos

## Visão Geral

Embora o A3 Thinking seja universal, cada indústria tem características que influenciam sua aplicação. Este KB apresenta adaptações e exemplos por setor.

## Manufatura (Origem do A3)

### Características
- Processos físicos visíveis
- Métricas bem estabelecidas (OEE, PPM, etc.)
- Gemba claramente definido
- Variáveis controláveis

### Problemas Típicos para A3

| Problema | Indicador | Foco da Análise |
|----------|-----------|-----------------|
| Qualidade | PPM, First Pass Yield | Ishikawa 6M completo |
| Produtividade | OEE, Peças/hora | Máquina, Método |
| Setup | Tempo de troca | SMED, Padronização |
| Manutenção | MTBF, MTTR | TPM, Manutenção autônoma |
| Custo | Custo/peça, Scrap | Material, Método |

### Exemplo: A3 Tático - Redução de Defeitos

```
CONTEXTO: Linha de embalagem com taxa de defeito de 2.500 PPM,
meta Hoshin: 500 PPM até Dez/2026.

CONDIÇÕES ATUAIS:
- PPM atual: 2.500 (5x acima da meta)
- 70% dos defeitos: selo mal aplicado
- 20%: embalagem amassada
- 10%: outros

OBJETIVOS:
- Reduzir PPM de 2.500 para 500 até Dez/2026
- Zero lotes bloqueados por qualidade

CAUSA RAIZ (5 Porquês - Selo mal aplicado):
P1: Por que selo mal aplicado? → Temperatura irregular
P2: Por que temperatura irregular? → Sensor descalibrado
P3: Por que sensor descalibrado? → Sem rotina de calibração
P4: Por que sem rotina? → Não existe padrão de manutenção
P5: Por que não existe? → Máquina nova, padrão não criado

CONTRAMEDIDA: Implementar manutenção autônoma com check diário de temperatura
```

## Healthcare (Hospitais, Clínicas)

### Características
- Foco em segurança do paciente
- Regulamentação intensa (ANVISA, JCI)
- Processos com muitos handoffs
- Variabilidade de pacientes

### Adaptações do Ishikawa

| M Original | M Healthcare |
|------------|--------------|
| Método | Protocolo/Procedimento |
| Medida | Indicadores clínicos |
| Mão de obra | Equipe assistencial |
| Máquina | Equipamento médico |
| Material | Medicamentos/Insumos |
| Meio ambiente | Ambiente hospitalar/Cultura segurança |

### Problemas Típicos para A3

| Problema | Indicador | Foco |
|----------|-----------|------|
| Infecção hospitalar | Taxa de infecção | Protocolo, Higiene |
| Tempo de espera | TAT, Lead time | Fluxo, Gargalos |
| Queda de paciente | Taxa de queda | Ambiente, Protocolo |
| Erro de medicação | Eventos adversos | Sistema, Double-check |
| Reinternação | Taxa 30 dias | Alta, Orientação |

### Exemplo: A3 - Redução de Tempo de Alta

```
CONTEXTO: Pacientes aguardando alta administrativa por média de
4 horas, impactando giro de leitos (Driver Hoshin: Eficiência operacional)

CONDIÇÕES ATUAIS:
- Tempo médio alta: 4h (meta: 1h)
- 60% do tempo: aguardando prescrição médica
- 25%: aguardando guias de convênio
- 15%: aguardando transporte

CONTRAMEDIDA: Implementar discharge planning iniciando D-1
```

## Serviços (Bancos, Telecom, Varejo)

### Características
- Processos de informação (menos tangíveis)
- Interação com cliente em tempo real
- Sazonalidade e variabilidade de demanda
- Gemba: ponto de atendimento ou sistema

### Adaptações do Ishikawa

| M Original | M Serviços |
|------------|------------|
| Método | Processo/Script |
| Medida | SLA, NPS, CSAT |
| Mão de obra | Atendente/Backoffice |
| Máquina | Sistema/Tecnologia |
| Material | Informação/Dados |
| Meio ambiente | Cultura/Pressão de metas |

### Problemas Típicos para A3

| Problema | Indicador | Foco |
|----------|-----------|------|
| TMA alto | Tempo médio atendimento | Processo, Sistema |
| Retrabalho | Taxa de retorno | Qualidade primeira vez |
| NPS baixo | NPS, CSAT | Experiência cliente |
| Backlog | Fila, Aging | Capacidade, Fluxo |
| Erro de cadastro | % erro | Sistema, Validação |

### Exemplo: A3 - Redução de Rechamadas

```
CONTEXTO: Contact center com 35% de rechamadas em 7 dias,
impactando custo de atendimento e NPS

CONDIÇÕES ATUAIS:
- Taxa de rechamada: 35% (meta: 15%)
- 50%: cliente não entendeu orientação
- 30%: problema não resolvido na 1ª chamada
- 20%: novo problema relacionado

CONTRAMEDIDA: Implementar FCR (First Call Resolution) protocol
com validação de entendimento antes de encerrar
```

## Tecnologia (Software, TI)

### Características
- Ciclos rápidos (sprints, releases)
- Mudança constante de requisitos
- Problemas frequentemente em código/arquitetura
- Gemba: codebase, logs, métricas

### Adaptações do Ishikawa

| M Original | M Tecnologia |
|------------|--------------|
| Método | Processo/Framework (Scrum, DevOps) |
| Medida | Métricas de código, SLA |
| Mão de obra | Desenvolvedores/Ops |
| Máquina | Infraestrutura/Cloud |
| Material | Código/Dados/APIs |
| Meio ambiente | Cultura DevOps/Pressão de delivery |

### Problemas Típicos para A3

| Problema | Indicador | Foco |
|----------|-----------|------|
| Bugs em produção | # bugs, severity | Code review, Testes |
| Downtime | Disponibilidade, MTTR | Infraestrutura, Monitoring |
| Debt técnico | Velocity decline | Refactoring, Padrões |
| Lead time alto | Deploy frequency | Pipeline, Automação |
| Incidentes | MTBF, # incidentes | Observabilidade |

### Exemplo: A3 - Redução de Incidentes em Produção

```
CONTEXTO: Sistema core com média de 5 incidentes críticos/mês,
impactando SLA de 99.9%

CONDIÇÕES ATUAIS:
- Incidentes críticos: 5/mês (meta: 1/mês)
- 60%: relacionados a deploy
- 25%: problemas de capacidade
- 15%: dependências externas

CONTRAMEDIDA: Implementar canary deployment com rollback automático
```

## Construção Civil

### Características
- Projetos únicos (cada obra é diferente)
- Muitos stakeholders (incorporador, construtora, subempreiteiros)
- Ambiente externo variável
- Longos ciclos de entrega

### Adaptações do Ishikawa

| M Original | M Construção |
|------------|--------------|
| Método | Projeto/Especificação |
| Medida | Cronograma, Custo |
| Mão de obra | Equipe própria/Terceiros |
| Máquina | Equipamentos/Ferramentas |
| Material | Insumos/Materiais de construção |
| Meio ambiente | Clima/Regulamentação/Vizinhança |

### Exemplo: A3 - Redução de Atrasos

```
CONTEXTO: Obra residencial com 45 dias de atraso acumulado,
impactando entrega e custo financeiro

CONDIÇÕES ATUAIS:
- Atraso: 45 dias (meta: 0)
- 40%: atraso em estrutura
- 35%: retrabalho em instalações
- 25%: chuva (fator externo)

CONTRAMEDIDA: Implementar Last Planner System com lookahead de 6 semanas
```

## Educação

### Características
- Resultado de longo prazo (aprendizagem)
- Múltiplos stakeholders (alunos, pais, sociedade)
- Métricas complexas de qualidade
- Ciclos semestrais/anuais

### Problemas Típicos para A3

| Problema | Indicador | Foco |
|----------|-----------|------|
| Evasão | Taxa de abandono | Engajamento, Suporte |
| Desempenho | Notas, Aprovação | Metodologia, Conteúdo |
| Satisfação | NPS aluno | Experiência, Infraestrutura |

## Princípios Universais

Independente da indústria, os princípios A3 permanecem:

1. **Uma página** - Forçar síntese
2. **Evidências** - Dados, não opiniões
3. **Sistema > Pessoa** - Nunca culpar indivíduos
4. **Gemba** - Ir ao local do problema
5. **PDCA** - Ciclo contínuo
6. **Nemawashi** - Construir consenso

---

## Fontes

- Toussaint, J. & Gerard, R. (2010). *On the Mend: Healthcare Lean*. LEI.
- George, M. (2003). *Lean Six Sigma for Service*. McGraw-Hill.
- Poppendieck, M. & T. (2003). *Lean Software Development*. Addison-Wesley.
- Ballard, G. (2000). *The Last Planner System*. LCI.
