# KB_04 — Viés Cognitivo e Falácias Lógicas

## Categoria: TEORIA
## Palavras: ~3,000
## Atualizado: 2026-01-07

---

## 1. Por Que Estudar Viés?

> *"Os analistas não veem o mundo como ele é. Veem o mundo como esperam que seja."*
> — Richards J. Heuer Jr., Psychology of Intelligence Analysis (1999)

### O Problema Fundamental

Nosso cérebro usa atalhos (heurísticas) para processar informação rapidamente. Esses atalhos funcionam 95% do tempo, mas **causam erros sistemáticos em análise**.

---

## 2. Vieses Cognitivos Principais

### A. Viés de Confirmação

> *"A tendência de buscar, interpretar e lembrar informação que confirma nossas crenças."*
> — Raymond Nickerson (1998)

**Como afeta pesquisa:**
- Buscamos fontes que concordam conosco
- Ignoramos evidência contrária
- Interpretamos dados ambíguos a nosso favor

**Mitigação:**
- Buscar ativamente evidência contrária
- Usar ACH (Analysis of Competing Hypotheses)
- Perguntar: *"O que provaria que estou errado?"*

### B. Viés de Ancoragem

> *"A primeira informação que recebemos ancora todas as estimativas subsequentes."*
> — Kahneman & Tversky (1974)

**Exemplo:**
- Primeiro relatório diz mercado = R$ 10B
- Todos os relatórios subsequentes são "comparados" a R$ 10B
- Mesmo se metodologia do primeiro for fraca

**Mitigação:**
- Não começar pela estimativa mais acessível
- Buscar múltiplas estimativas independentes
- Fazer "base rates" antes de ver dados

### C. Viés de Disponibilidade

> *"Superestimamos a probabilidade de eventos que lembramos facilmente."*
> — Kahneman & Tversky (1973)

**Exemplo:**
- Startups de AI dominam notícias
- Concluímos que "todas as startups são de AI"
- Ignoramos setores menos midiáticos

**Mitigação:**
- Buscar dados agregados, não casos
- Desconfiar de narrativas "quentes"
- Perguntar: *"Isso é estatisticamente comum ou apenas memorável?"*

### D. Viés de Sobrevivência

> *"Focamos nos vencedores e ignoramos os que falharam."*
> — Abraham Wald (1943)

**Exemplo:**
- "Todas as unicórnios fizeram X" → ignoramos 99% que fizeram X e falharam
- Benchmarks de SaaS são de empresas que sobreviveram

**Mitigação:**
- Buscar dados de empresas que falharam
- Perguntar: *"E os que não conseguiram?"*
- Calcular taxa base de sucesso

### E. Viés de Recência

> *"Damos mais peso a informação recente do que a histórica."*
> — Ebbinghaus (1885)

**Exemplo:**
- "O dólar subiu 20% este mês, vai continuar subindo"
- Ignoramos ciclos históricos

**Mitigação:**
- Analisar séries históricas longas
- Comparar com múltiplos ciclos
- Desconfiar de extrapolações lineares

---

## 3. Falácias Lógicas Comuns

### A. Correlação vs Causalidade

> *"Correlação não implica causalidade."*

**Exemplo falacioso:**
- "Países que comem mais chocolate têm mais Nobel"
- Conclusão errada: Chocolate causa inteligência
- Realidade: Ambos correlacionam com riqueza

**Detecção:**
- Buscar mecanismo causal plausível
- Verificar se há variável confundidora
- Perguntar: *"O que mais poderia explicar isso?"*

### B. Post Hoc Ergo Propter Hoc

> *"Depois disso, portanto por causa disso."*

**Exemplo:**
- "Implementamos CRM → vendas subiram"
- Na verdade: Mercado estava aquecido

**Detecção:**
- Buscar grupo de controle
- Verificar timing vs causalidade
- Considerar explicações alternativas

### C. Apelo à Autoridade

> *"Se X disse, deve ser verdade."*

**Exemplo:**
- "Elon Musk disse que AI vai substituir todos"
- Musk é expert em foguetes, não necessariamente em AI

**Detecção:**
- Verificar se autoridade é relevante ao tema
- Buscar consenso de múltiplos experts
- Avaliar se há conflito de interesse

### D. Cherry Picking

> *"Selecionar apenas dados que suportam a conclusão."*

**Exemplo:**
- Mostrar crescimento de Q4 (melhor) e omitir Q1-Q3 (ruins)
- Relatório de startup destacando única métrica positiva

**Detecção:**
- Pedir dados completos
- Verificar série temporal inteira
- Buscar métricas que foram omitidas

### E. Falácia do Espantalho

> *"Distorcer argumento do oponente para refutá-lo facilmente."*

**Exemplo:**
- "Críticos dizem que SaaS é ruim" (distorção)
- Críticos reais dizem: "SaaS em segmento X tem CAC alto"

**Detecção:**
- Buscar fonte original da crítica
- Verificar se representação é fiel
- Ler ambos os lados diretamente

---

## 4. Heurísticas (Atalhos Mentais)

### Heurística de Representatividade
- Julgamos probabilidade por semelhança ao estereótipo
- "Parece uma startup de sucesso" → assumimos que terá sucesso

### Heurística de Afeto
- Decisões baseadas em emoção, não análise
- "Gosto do founder" → ignoro red flags financeiros

### Heurística de Esforço
- Se algo exigiu esforço, valorizamos mais
- Relatório longo = relatório bom (não necessariamente)

---

## 5. Matriz de Mitigação

| Viés | Técnica de Mitigação |
| :--- | :--- |
| Confirmação | ACH, buscar evidência contrária |
| Ancoragem | Estimativas independentes primeiro |
| Disponibilidade | Dados agregados vs casos |
| Sobrevivência | Incluir fracassos na análise |
| Recência | Séries históricas longas |
| Correlação/Causalidade | Buscar mecanismo, variáveis |
| Cherry Picking | Solicitar dados completos |

---

## 6. Devil's Advocacy Protocol

### Objetivo
Forçar consideração de hipóteses alternativas.

### Processo

```
1. HIPÓTESE PRINCIPAL
   "O mercado de AgTech vai crescer 25% em 2025"
   
2. DEVIL'S ADVOCATE
   "Por que o mercado NÃO cresceria 25%?"
   
3. CONTRA-ARGUMENTOS
   - Recessão agrícola
   - Queda de commodities
   - Regulação desfavorável
   - Consolidação reduz novos entrantes
   
4. AVALIAÇÃO
   Probabilidade de cenário negativo: 30%
   Ajuste: Crescimento esperado 15-25% (range)
```

---

## 7. Inversion (Munger)

> *"Inverta, sempre inverta."*
> — Charlie Munger

### Aplicação

| Pergunta Normal | Pergunta Invertida |
| :--- | :--- |
| Como ter sucesso em SaaS? | Como garantir fracasso em SaaS? |
| Por que investir em X? | Por que NÃO investir em X? |
| Quais os benefícios? | Quais os riscos ocultos? |

---

## 8. Referências

- Kahneman, D. (2011). *Thinking, Fast and Slow*. Farrar, Straus and Giroux.
- Heuer, R. J. (1999). *Psychology of Intelligence Analysis*. CIA.
- Nickerson, R. S. (1998). *Confirmation Bias*. Review of General Psychology.
- Munger, C. (1995). *The Psychology of Human Misjudgment*. Lecture.
- Dobelli, R. (2013). *The Art of Thinking Clearly*.
