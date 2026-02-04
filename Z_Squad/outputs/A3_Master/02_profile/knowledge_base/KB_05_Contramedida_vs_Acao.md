---
title: "KB_05: Contramedida vs Ação vs Solução"
galaxy: "CREATION"
galaxy-color: "#FF8C00"
document-type: "knowledge-base"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "kb-05-contramedida-vs-acao"
  - "kb_05: contramedida vs ação vs"
  - "por que toyota usa "contramedi"
  - "definições"
  - "contramedida (countermeasure) "
  - "ação"
  - "solução (solution) - termo a e"
  - "por que essa distinção importa"
  - "hierarquia de ações (a.d.p.)"
  - "1. administrativas (a) - mais "
tags:
  - "galaxy-creation"
  - "knowledge-base"
---

# KB_05: Contramedida vs Ação vs Solução

## Por que Toyota usa "Contramedida" e não "Solução"

Dentro do Sistema Toyota de Produção, virtualmente toda ação, ferramenta ou sistema é considerado uma **contramedida** em vez de uma **solução**, em um esforço de prevenir a mentalidade de que mudanças são, de qualquer forma, resoluções permanentes para problemas.

A diferença nessa linha de pensamento é o conceito de que existem várias potenciais causas raiz para qualquer problema e que ações tomadas para endereçar um problema são baseadas no que é conhecido HOJE com qualquer informação atualmente disponível.

## Definições

### CONTRAMEDIDA (Countermeasure) - Toyota Way

| Aspecto | Descrição |
|---------|-----------|
| **O que é** | Ação sistêmica que ataca diretamente uma CAUSA RAIZ |
| **Baseada em** | Conhecimento ATUAL (pode evoluir) |
| **Reconhece** | Que não é "final" - melhoria contínua |
| **Foco** | SISTEMA, não pessoa |
| **Mentalidade** | Humildade - sabemos que aprendemos mais amanhã |

### AÇÃO

| Aspecto | Descrição |
|---------|-----------|
| **O que é** | EXECUÇÃO de uma contramedida |
| **Estrutura** | Verbo + Objeto + Responsável + Prazo |
| **Característica** | Granular e mensurável |
| **Exemplo** | "Treinar equipe em novo procedimento | João | 15/Jan" |

### SOLUÇÃO (Solution) - Termo a Evitar

| Aspecto | Por que Evitar |
|---------|----------------|
| **Implica** | "Final" e "definitivo" |
| **Cria** | Falsa sensação de segurança |
| **Risco** | Equipe ignora se problema retorna |
| **Mentalidade** | Arrogância - "resolvemos" |

## Por que essa distinção importa

Contramedidas podem, à primeira vista, parecer nada mais que correções temporárias para problemas em vez de soluções permanentes. Na realidade, é justamente o oposto, porque uma mentalidade de "solução" pode dar uma falsa sensação de segurança de que um problema particular foi, de fato, eliminado.

Isso pode ser muito perigoso no futuro se um problema que a equipe pensa ter resolvido retornar.

## Hierarquia de Ações (A.D.P.)

A Toyota categoriza contramedidas em três níveis de robustez:

### 1. Administrativas (A) - Mais Fraco
- Treinar, instruir, comunicar
- Dependem de comportamento humano
- Fáceis de implementar, fáceis de falhar

**Exemplo**: Treinar operadores no procedimento correto

### 2. Detecção (D) - Médio
- Inspeção, poka-yoke de detecção
- Identificam o problema após ocorrer
- Evitam que defeito chegue ao cliente

**Exemplo**: Instalar sensor que alerta quando parâmetro sai da faixa

### 3. Prevenção (P) - Mais Forte
- Elimina a causa raiz
- Impossibilita a ocorrência do erro
- Mudança no design, processo ou sistema

**Exemplo**: Redesenhar conector para que só encaixe na posição correta

**Sempre busque contramedidas de PREVENÇÃO quando possível.**

## Relação Hierárquica

```
1 Causa Raiz
    ↓
1 Contramedida (Ataca a causa raiz)
    ↓
N Ações de Execução (Implementam a contramedida)
```

## Exemplo Prático Detalhado

### Situação
Causa Raiz identificada: Falta de padrão de parametrização do sistema de compras

### ERRADO - Confundir Ação com Contramedida

```
Contramedida: Treinar equipe de compras
→ Isso é uma AÇÃO, não uma contramedida
→ Não ataca o sistema, depende de comportamento
→ Se pessoa nova entrar, problema volta
```

### CERTO - Contramedida Sistêmica

```
Contramedida: Implementar sistema de gestão visual de parâmetros
              críticos com validação automática

Ações de Execução:
1. Mapear parâmetros críticos do processo | João | 15/Jan
2. Definir faixas aceitáveis para cada parâmetro | Maria | 22/Jan
3. Configurar validações no sistema | TI | 05/Fev
4. Criar dashboard de visualização | TI | 12/Fev
5. Testar em ambiente de homologação | João | 19/Fev
6. Treinar usuários no novo sistema | Ana | 26/Fev
7. Implantar em produção | TI | 05/Mar
8. Monitorar e ajustar | João | Contínuo
```

## Checklist de Qualidade da Contramedida

| Critério | Pergunta de Verificação |
|----------|------------------------|
| **Sistêmica** | Muda o sistema, não apenas comportamento? |
| **Rastreável** | Está ligada diretamente a uma causa raiz? |
| **Mensurável** | Podemos medir se funcionou? |
| **Sustentável** | Continua funcionando sem supervisão constante? |
| **DoD definido** | Temos critério claro de "pronto"? |

## Definition of Done (DoD)

Cada contramedida deve ter um critério de "pronto" (Definition of Done):

**Exemplo**:
- Contramedida: Implementar sistema de gestão visual de parâmetros
- DoD: Sistema em produção, 100% dos usuários treinados, primeira semana sem erros de parametrização

## Nunca Confunda

| ISSO É AÇÃO ❌ | ISSO É CONTRAMEDIDA ✅ |
|---------------|----------------------|
| Treinar operadores | Implementar trabalho padronizado visual |
| Criar procedimento | Automatizar validação no sistema |
| Comunicar equipe | Instalar poka-yoke no processo |
| Fazer auditoria | Redesenhar fluxo eliminando etapa de risco |
| Aumentar supervisão | Criar sistema de alerta automático |

---

## Fontes

- [AllAboutLean - Countermeasures and Implement](https://www.allaboutlean.com/practical-problem-solving-countermeasures-and-implement/)
- [Velaction - Countermeasures](https://www.velaction.com/countermeasures/)
- [Creative Safety Supply - Countermeasure](https://www.creativesafetysupply.com/glossary/countermeasure/)
- [LeanSixSigmaDefinition - Countermeasure](https://www.leansixsigmadefinition.com/glossary/countermeasure/)

#galaxy-creation