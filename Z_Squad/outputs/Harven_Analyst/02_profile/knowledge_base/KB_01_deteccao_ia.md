# KB_01: Deteccao de Texto Gerado por IA

## Proposito

Este documento detalha os indicadores, padroes e algoritmos para detectar texto potencialmente gerado por IA (LLMs) nas respostas dos alunos.

---

## Principios Fundamentais

1. **Deteccao, nao Julgamento**: O objetivo e identificar padroes, nao punir alunos
2. **Probabilidade, nao Certeza**: Retornamos probabilidade (0.0-1.0), nao veredicto binario
3. **Apoio Pedagogico**: Dados sao para o professor tomar decisoes informadas
4. **Transparencia**: Criterios sao claros e explicaveis

---

## Indicadores de Texto Gerado por IA

### Categoria 1: Estilo de Escrita

| Indicador | Descricao | Peso | Exemplo |
|-----------|-----------|------|---------|
| Fluidez Excessiva | Texto perfeitamente coeso sem hesitacoes | ALTO | Frases conectam perfeitamente sem "breaks" naturais |
| Ausencia de Erros | Nenhum erro de digitacao em texto longo | MEDIO | 500+ caracteres sem um typo |
| Tom Impessoal | Falta de expressoes pessoais | MEDIO | Nunca usa "eu acho", "na minha opiniao" |
| Coerencia Artificial | Cada paragrafo conecta perfeitamente ao anterior | ALTO | Transicoes muito suaves entre ideias |

### Categoria 2: Vocabulario

| Indicador | Descricao | Peso | Exemplo |
|-----------|-----------|------|---------|
| Termos Rebuscados | Palavras formais incomuns | ALTO | "outrossim", "destarte", "precipuamente" |
| Formalidade Excessiva | Linguagem de paper academico | MEDIO | "Cabe ressaltar", "E mister observar" |
| Jargao Tecnico | Termos especializados desnecessarios | MEDIO | Usar termos tecnicos sem necessidade |
| Sinonimos Elaborados | Preferencia por sinonimos formais | BAIXO | "ademais" em vez de "alem disso" |

### Categoria 3: Estrutura

| Indicador | Descricao | Peso | Padrao Tipico |
|-----------|-----------|------|---------------|
| Conectores Artificiais | Transicoes formulaicas | ALTO | "Nesse sentido", "Diante do exposto" |
| Enumeracao Perfeita | Listas muito organizadas | MEDIO | "Primeiro... Segundo... Terceiro..." |
| Conclusoes Formulaicas | Fechamentos padronizados | ALTO | "Portanto, conclui-se que..." |
| Paragrafos Equilibrados | Tamanhos muito similares | BAIXO | Todos paragrafos com ~50 palavras |

---

## Padroes Linguisticos de LLMs

### Frases Tipicas de ChatGPT/LLMs

```
- "E importante ressaltar que..."
- "Nesse sentido..."
- "Diante do exposto..."
- "Cabe destacar que..."
- "Vale mencionar que..."
- "Em primeiro lugar... Em segundo lugar..."
- "Portanto, conclui-se que..."
- "Dessa forma..."
- "Assim sendo..."
- "Por conseguinte..."
- "Ademais..."
- "Outrossim..."
- "E mister observar..."
```

### Estruturas Tipicas

1. **Introducao-Desenvolvimento-Conclusao Perfeita**
   - Sempre comecar com contextualizacao
   - Desenvolvimento com 2-3 pontos
   - Conclusao que resume tudo

2. **Bullet Points Mentais**
   - Mesmo em prosa, parece lista disfarçada
   - Cada "ponto" tem tamanho similar

3. **Hedging Excessivo**
   - "Pode-se argumentar que..."
   - "E possivel considerar que..."
   - Evita afirmacoes diretas

---

## O que NAO e Indicador de IA

| Comportamento | Por que NAO conta | Exemplo |
|---------------|-------------------|---------|
| Copy/paste do material | Comportamento legitimo | Colar trecho do capitulo |
| Digitacao rapida | Habilidade normal | Responder em 30 segundos |
| Texto curto | Pode ser resposta objetiva | "Concordo porque..." |
| Erros de ortografia | Indica origem humana | "voce" sem acento |
| Linguagem informal | Indica origem humana | "tipo assim", "saca?" |
| Girias e expressoes | Indica origem humana | "massa", "show" |
| Hesitacoes no texto | Indica origem humana | "bom, eu acho que..." |
| Uso de emojis | Raro em LLMs | "achei legal :)" |

---

## Algoritmo de Deteccao

### Passo 1: Pre-processamento
```
1. Normalizar texto (lowercase para analise)
2. Tokenizar em palavras e frases
3. Calcular metricas basicas:
   - Tamanho (caracteres, palavras)
   - Numero de frases
   - Media de palavras por frase
```

### Passo 2: Analise de Indicadores
```
Para cada categoria:
   Para cada indicador:
      Se indicador presente:
         score += peso_indicador

Normalizar score para 0.0-1.0
```

### Passo 3: Ajustes
```
Se erros_ortografia > 2:
   score *= 0.7  # Reduz probabilidade

Se texto_muito_curto (< 100 chars):
   score *= 0.5  # Dificil avaliar

Se linguagem_informal:
   score *= 0.6  # Indica humano
```

### Passo 4: Classificacao Final
```
probabilidade = score_ajustado

Se probabilidade > 0.70:
   flag = "alta_probabilidade_texto_IA"
Senao:
   flag = null

Retornar {
   probability: probabilidade,
   flag: flag,
   indicators_found: [...],
   confidence: "high" | "medium" | "low"
}
```

---

## Tabela de Pesos

| Categoria | Indicador | Peso Base |
|-----------|-----------|-----------|
| Estilo | Fluidez excessiva | 0.15 |
| Estilo | Ausencia de erros | 0.10 |
| Estilo | Tom impessoal | 0.10 |
| Estilo | Coerencia artificial | 0.15 |
| Vocabulario | Termos rebuscados | 0.15 |
| Vocabulario | Formalidade excessiva | 0.10 |
| Vocabulario | Jargao tecnico | 0.05 |
| Estrutura | Conectores artificiais | 0.10 |
| Estrutura | Conclusoes formulaicas | 0.10 |

**Total Maximo:** 1.0

---

## Casos Limitrofes

### Caso 1: Aluno com Boa Escrita
**Problema:** Alunos que escrevem bem podem ter alta probabilidade
**Solucao:** Verificar presenca de elementos humanos (erros, informalidade)
**Acao:** Registrar observacao: "Texto bem escrito, pode ser falso positivo"

### Caso 2: Texto Muito Curto
**Problema:** Textos curtos sao dificeis de analisar
**Solucao:** Reduzir confianca da analise
**Acao:** Confidence = "low", observacao sobre limitacao

### Caso 3: Texto Misto (Humano + IA)
**Problema:** Aluno pode ter editado texto de IA
**Solucao:** Detectar inconsistencias de estilo
**Acao:** Registrar: "Possivel texto editado - inconsistencias de estilo"

---

## Exemplos de Analise

### Exemplo 1: Alta Probabilidade de IA

**Texto:**
```
E importante ressaltar que a sustentabilidade no agronegocio engloba
tres dimensoes fundamentais: economica, social e ambiental. Nesse sentido,
os produtores rurais devem buscar um equilibrio entre a maximizacao da
producao e a preservacao dos recursos naturais. Ademais, cabe destacar
que as praticas sustentaveis nao apenas beneficiam o meio ambiente, mas
tambem podem resultar em vantagens competitivas no mercado. Portanto,
conclui-se que a adocao de praticas sustentaveis e imperativa para a
viabilidade de longo prazo do setor.
```

**Analise:**
- Conectores: "E importante ressaltar", "Nesse sentido", "Ademais", "Portanto, conclui-se"
- Estrutura: Introducao-Desenvolvimento-Conclusao perfeita
- Vocabulario: "engloba", "imperativa", "viabilidade"
- Tom: Completamente impessoal

**Resultado:** Probabilidade = 0.85, Flag = alta_probabilidade_texto_IA

---

### Exemplo 2: Baixa Probabilidade de IA

**Texto:**
```
Bom, eu acho que sustentabilidade no agro e bem complicado ne. Tipo,
o produtor precisa ganhar dinheiro pra sobreviver, mas tbm nao pode
destruir tudo. Acho q o equilibrio e dificil de achar. Na fazenda do
meu tio eles tentam fazer rotacao de cultura mas as vezes nao da certo.
```

**Analise:**
- Linguagem informal: "ne", "tbm", "q"
- Hesitacoes: "Bom, eu acho"
- Experiencia pessoal: "Na fazenda do meu tio"
- Erros: abreviacoes, falta de acentos

**Resultado:** Probabilidade = 0.15, Flag = null

---

### Exemplo 3: Probabilidade Incerta

**Texto:**
```
A sustentabilidade no agronegocio e um tema complexo que envolve
multiplos fatores. Os produtores enfrentam o desafio de equilibrar
producao e preservacao. Na minha opiniao, isso requer planejamento
cuidadoso e conhecimento tecnico. Eu acredito que com as ferramentas
certas, e possivel ser sustentavel e lucrativo ao mesmo tempo.
```

**Analise:**
- Estrutura boa mas nao artificial
- Presenca de "Na minha opiniao", "Eu acredito"
- Vocabulario formal mas nao rebuscado
- Sem conectores tipicos de LLM

**Resultado:** Probabilidade = 0.45, Flag = null, Confidence = medium


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->