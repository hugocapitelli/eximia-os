# KB_08 — Anti-Alucinação e Chain-of-Verification (CoVe)

## Categoria: INVARIANTES
## Palavras: ~2,500
## Atualizado: 2026-01-07

---

## 1. O Problema da Alucinação

> *"LLMs geram texto plausível, não necessariamente verdadeiro."*
> — Dhuliawala et al. (2023)

### Definição

**Alucinação:** Quando um modelo de linguagem gera informação que parece factual mas não tem base em dados reais.

### Tipos de Alucinação

| Tipo | Exemplo | Risco |
| :--- | :--- | :--- |
| **Factual** | "A empresa X faturou R$ 100M em 2024" (inventado) | ALTO |
| **Referencial** | Citar paper que não existe | ALTO |
| **Estatística** | "85% das empresas fazem X" (sem fonte) | MÉDIO |
| **Temporal** | Confundir datas ou eventos | MÉDIO |
| **Atribuição** | "Como disse Einstein..." (nunca disse) | MÉDIO |

---

## 2. Chain-of-Verification (CoVe)

### Origem

Paper: *"Chain-of-Verification Reduces Hallucination in Large Language Models"*
Autores: Dhuliawala, Komeili, Xu, et al.
Venue: ICLR 2024

### O Método em 4 Passos

```
┌─────────────────────────────────────────────────────────────┐
│              CHAIN-OF-VERIFICATION (CoVe)                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PASSO 1: DRAFT BASELINE                                    │
│  ──────────────────────────                                 │
│  Gerar resposta inicial à pergunta do usuário               │
│                                                             │
│           ↓                                                 │
│                                                             │
│  PASSO 2: PLAN VERIFICATION                                 │
│  ────────────────────────────                               │
│  Identificar afirmações factuais no draft                   │
│  Formular perguntas de verificação para cada uma            │
│                                                             │
│           ↓                                                 │
│                                                             │
│  PASSO 3: EXECUTE VERIFICATION                              │
│  ─────────────────────────────                              │
│  Responder cada pergunta de verificação INDEPENDENTEMENTE   │
│  (sem viés do draft original)                               │
│                                                             │
│           ↓                                                 │
│                                                             │
│  PASSO 4: FINAL REFINED RESPONSE                            │
│  ───────────────────────────────                            │
│  Incorporar verificações no output final                    │
│  Corrigir ou remover afirmações não verificadas             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Exemplo Prático

**Query:** "Qual a receita anual da Nubank em 2023?"

**PASSO 1: Draft**
> "A Nubank teve receita de aproximadamente US$ 8 bilhões em 2023, sendo uma das maiores fintechs da América Latina."

**PASSO 2: Verification Questions**
1. Qual foi a receita reportada da Nubank em 2023?
2. Em qual documento isso foi publicado?
3. A Nubank é realmente uma das maiores fintechs da LATAM?

**PASSO 3: Execute (Independente)**
1. Busca em SEC filings: US$ 7.6B (20-F 2023)
2. Fonte: Relatório Anual 20-F, SEC Edgar
3. Verificação: Sim, maior banco digital da LATAM por clientes

**PASSO 4: Final**
> "A Nubank reportou receita de US$ 7.6 bilhões em 2023, conforme relatório 20-F apresentado à SEC. É o maior banco digital da América Latina por número de clientes (90M+)."
> 
> **Fonte:** [Nubank 20-F, SEC Edgar, 2024]

---

## 3. Factored CoVe

### Conceito

Na versão "fatorada" do CoVe, as perguntas de verificação são respondidas **sem acesso ao draft original**, evitando que o modelo copie seus próprios erros.

### Benefícios

| Aspecto | CoVe Simples | Factored CoVe |
| :--- | :--- | :--- |
| Independência | Parcial | Total |
| Cópia de erros | Possível | Minimizada |
| Custo computacional | Menor | Maior |
| Acurácia | +30% vs baseline | +50% vs baseline |

**Fonte:** Dhuliawala et al. (2023)

---

## 4. Regras Anti-Alucinação para The_Veritas

### INVARIANTES OBRIGATÓRIAS

```yaml
anti_hallucination_rules:
  
  rule_1:
    name: "No Invention"
    description: "Nunca inventar dados para preencher lacunas"
    action: "Declarar 'dado não encontrado' se não houver fonte"
    
  rule_2:
    name: "Source Everything"
    description: "Toda afirmação factual deve ter fonte"
    action: "Citar fonte no formato [Autor, Título, Ano]"
    
  rule_3:
    name: "Verify Before Cite"
    description: "Verificar se fonte realmente existe"
    action: "Confirmar URL funcional ou existência do documento"
    
  rule_4:
    name: "Triangulate"
    description: "Fatos importantes requerem 3 fontes"
    action: "Buscar corroboração independente"
    
  rule_5:
    name: "Declare Uncertainty"
    description: "Incerteza deve ser explícita"
    action: "Usar confidence scores e ranges"
```

---

## 5. Padrões de Resposta

### Quando HÁ fonte verificada

```markdown
O mercado de AgTech no Brasil cresceu 18% em 2024, atingindo 
R$ 2.3 bilhões em investimentos.

**Fonte:** [AgFunder, Latin America Agri-FoodTech Report, 2024]
**Confidence:** 90% (fonte Tier 2, corroborada por Embrapa)
```

### Quando NÃO HÁ fonte verificada

```markdown
**Dado Não Encontrado**

Não foi possível localizar dados específicos sobre [X] em fontes 
Tier 1 ou Tier 2. 

**Buscas realizadas:**
- Google Scholar: 0 resultados relevantes
- PubMed: 0 resultados
- USDA: Não disponível

**Recomendação:** Contatar diretamente [organização relevante] 
ou aguardar publicação oficial.
```

### Quando há CONTRADIÇÃO

```markdown
**Contradição Detectada**

| Fonte | Valor | Tier |
|-------|-------|------|
| USDA | 155 Mt | 1 |
| Conab | 162 Mt | 1 |
| Broker X | 170 Mt | 3 |

**Análise:** A diferença USDA-Conab (4.5%) está dentro da margem 
histórica. Broker X apresenta estimativa 10% acima da média oficial 
sem metodologia transparente.

**Recomendação:** Usar range 155-162 Mt. Descartar Broker X.
**Confidence:** 75%
```

---

## 6. Circuit Breakers

### Gatilhos de Parada Automática

| Situação | Ação |
| :--- | :--- |
| >50% fontes são SEO farms | Refinar busca, não responder |
| Zero fontes Tier 1/2 | Declarar "dado não verificável" |
| Contradição entre dois Tier 1 | Pausar e apresentar ambos |
| Pedido de previsão específica | Apresentar cenários, não certeza |
| Pedido antiético | Recusar com explicação |

---

## 7. Confidence Score Framework

### Escala

| Score | Significado | Condição |
| :---: | :--- | :--- |
| 95%+ | Muito Alta | 3+ fontes Tier 1 convergem |
| 85-94% | Alta | 2 Tier 1 ou 3 Tier 2 convergem |
| 70-84% | Média | 1 Tier 1 + 1 Tier 2 |
| 50-69% | Baixa | Apenas Tier 2/3, incompleto |
| <50% | Muito Baixa | Fonte única, não verificável |

### Quando Usar

- **Sempre** incluir confidence score em afirmações factuais
- **Obrigatório** quando há contradição ou dado incompleto
- **Destacar** scores abaixo de 70%

---

## 8. Referências

- Dhuliawala, S., Komeili, M., Xu, J., et al. (2023). *Chain-of-Verification Reduces Hallucination in Large Language Models*. ICLR 2024.
- Lewis, P., et al. (2020). *Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks*. NeurIPS.
- Heuer, R. J. (1999). *Psychology of Intelligence Analysis*. CIA.


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->