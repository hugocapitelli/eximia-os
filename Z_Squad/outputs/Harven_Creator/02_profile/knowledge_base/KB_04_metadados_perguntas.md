# KB_04: Estrutura de Metadados para Perguntas Enriquecidas

## Visao Geral

Cada pergunta gerada pelo CreatorOS deve incluir metadados que:
1. Ajudam o ORIENTADOR a conduzir o dialogo
2. Permitem analise de qualidade
3. Conectam a pergunta ao conteudo de origem
4. Facilitam selecao pelo professor

## Campos Obrigatorios

### 1. text (string)
**O que e:** O texto completo da pergunta socratica
**Formato:** Texto em portugues, terminando em "?"
**Tamanho:** 50-300 caracteres idealmente

**Exemplo:**
```json
"text": "Se um produtor rural te perguntasse por que ele deveria gastar tempo e dinheiro com gestao de riscos quando 'sempre deu certo assim', como voce o convenceria?"
```

---

### 2. skill (enum)
**O que e:** A habilidade cognitiva que a pergunta trabalha
**Valores possiveis:**
- `analise` - Decomposicao, comparacao, causa-efeito
- `sintese` - Combinacao, criacao, integracao
- `aplicacao` - Uso em contexto novo, cenarios praticos
- `reflexao` - Avaliacao, julgamento, posicionamento

**Regra:** Em um batch de 3 perguntas, ter no minimo 2 skills diferentes

**Exemplo:**
```json
"skill": "aplicacao"
```

---

### 3. intention (string)
**O que e:** O objetivo pedagogico da pergunta - o que ela tenta desbloquear no aluno
**Formato:** Frase curta explicando o proposito
**Tamanho:** 50-150 caracteres

**Exemplos:**
```json
"intention": "Fazer o aluno conectar conceito abstrato de gestao de riscos com necessidade pratica"
```
```json
"intention": "Provocar reflexao sobre trade-offs entre custo e beneficio de praticas sustentaveis"
```
```json
"intention": "Fazer o aluno considerar multiplas perspectivas de stakeholders"
```

---

### 4. expected_depth (string)
**O que e:** Descricao do que uma boa resposta tenderia a incluir
**Formato:** Lista de elementos ou descricao
**Tamanho:** 100-250 caracteres

**Exemplos:**
```json
"expected_depth": "Mencionar exemplos de riscos (climatico, mercado, sanitario), discutir custo de prevencao vs custo de crise, trazer argumento economico"
```
```json
"expected_depth": "Considerar dimensao economica e ambiental, mencionar trade-offs, propor criterios de avaliacao"
```

---

### 5. common_shallow_answer (string)
**O que e:** Resposta tipica superficial que alunos costumam dar
**Formato:** Exemplo de resposta incompleta ou generica
**Proposito:** Ajuda o ORIENTADOR a identificar respostas que precisam aprofundamento

**Exemplos:**
```json
"common_shallow_answer": "Gestao de riscos e importante porque reduz perdas"
```
```json
"common_shallow_answer": "Tecnologia melhora a producao"
```
```json
"common_shallow_answer": "Sustentabilidade e usar recursos sem esgotar"
```

---

### 6. followup_prompts (array)
**O que e:** Perguntas de acompanhamento que o ORIENTADOR pode usar
**Formato:** Array com 2-3 perguntas adicionais
**Proposito:** Dar opcoes para aprofundar se o aluno responder superficialmente

**Exemplo:**
```json
"followup_prompts": [
    "Voce pode dar um exemplo concreto dessa situacao?",
    "O que aconteceria se o produtor ignorasse esse conselho?",
    "Como voce mediria se a estrategia funcionou?"
]
```

---

### 7. citations (array)
**O que e:** IDs dos blocos de conteudo que originaram a pergunta
**Formato:** Array de strings com IDs de blocos
**Proposito:** Rastreabilidade e verificacao de grounding

**Exemplo:**
```json
"citations": ["block_42", "block_43", "block_47"]
```

**Nota:** Se o conteudo nao vier com IDs de bloco, usar referencias como "paragraph_1", "section_title_2", etc.

---

## Campos Opcionais

### 8. difficulty (enum)
**Valores:** `iniciante`, `intermediario`, `avancado`
**Uso:** Quando o professor especificar nivel desejado

### 9. estimated_time (integer)
**Formato:** Minutos estimados para resposta completa
**Valores tipicos:** 3-10 minutos

### 10. related_concepts (array)
**Formato:** Lista de conceitos-chave relacionados
**Uso:** Para indexacao e busca

---

## Exemplo Completo de Pergunta Enriquecida

```json
{
    "text": "Imagine que voce e um consultor agricola. Um pequeno produtor te procura dizendo que quer 'modernizar' sua fazenda com tecnologia, mas tem orcamento limitado. Ele pode investir em sensores IoT para monitoramento OU em capacitacao da equipe, mas nao em ambos. Que perguntas voce faria a ele antes de recomendar uma das opcoes?",
    "skill": "aplicacao",
    "intention": "Fazer o aluno aplicar criterios de decisao em cenario real, considerando restricoes e trade-offs",
    "expected_depth": "Perguntar sobre tamanho da propriedade, nivel de conhecimento atual da equipe, conectividade, problemas especificos que quer resolver, expectativa de ROI, capacidade de manutencao",
    "common_shallow_answer": "Eu recomendaria IoT porque tecnologia e o futuro",
    "followup_prompts": [
        "E se a equipe dele nao souber usar os sensores?",
        "Que criterios voce usaria para medir o sucesso da escolha?",
        "Em que situacao a outra opcao seria melhor?"
    ],
    "citations": ["block_23", "block_24", "block_31"],
    "difficulty": "intermediario",
    "estimated_time": 5,
    "related_concepts": ["tecnologia agricola", "ROI", "capacitacao", "tomada de decisao"]
}
```

---

## Validacao de Metadados

Antes de entregar, verificar:

| Campo | Validacao |
|-------|-----------|
| text | Termina com "?" |
| text | Nao e pergunta generica (KB_02) |
| skill | E um dos 4 valores validos |
| intention | Tem 50-150 caracteres |
| expected_depth | Tem 100-250 caracteres |
| common_shallow_answer | E diferente de expected_depth |
| followup_prompts | Tem 2-3 items |
| citations | Tem pelo menos 1 item |

## Diversidade em Batch

Para 3 perguntas, garantir:
- [ ] Pelo menos 2 skills diferentes
- [ ] Pelo menos 1 pergunta com cenario pratico
- [ ] Cada pergunta aborda angulo diferente do conteudo
- [ ] Citations cobrem diferentes partes do material


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->