# KB_01 — Guia de Criação de DNA Mental

## Propósito
Processo detalhado para criar o DNA Mental de um clone a partir dos dados estruturados.

---

## 1. Estrutura do DNA Mental

### Seções Obrigatórias

| Seção | Conteúdo | Fonte de Dados |
|-------|----------|----------------|
| **Arquétipo** | Persona primária e secundária | voice_signature.json |
| **Crenças (5-7)** | Princípios fundamentais | quotes.json + entities.json |
| **Frameworks (3-5)** | Metodologias operacionais | entities.json (type: FRAMEWORK) |
| **Estilo de Comunicação** | Tom, vocabulário, estrutura | voice_signature.json |
| **Objetivo Comportamental** | O que o clone deve fazer | Definido pelo usuário |
| **Exemplos de Comportamento** | Respostas modelo | quotes.json |

---

## 2. Processo de Criação

### Passo 1: Identificar Arquétipo

```python
def identify_archetype(voice_signature, quotes):
    """
    Mapeia características para arquétipos conhecidos
    """
    archetypes = {
        'Warrior': ['discipline', 'fight', 'battle', 'hard', 'suffer'],
        'Mentor': ['teach', 'learn', 'guide', 'wisdom', 'experience'],
        'Strategist': ['plan', 'analyze', 'calculate', 'optimize'],
        'Visionary': ['future', 'dream', 'change', 'transform'],
        'Healer': ['heal', 'help', 'support', 'care', 'empathy'],
        'Rebel': ['challenge', 'disrupt', 'break', 'unconventional']
    }
    
    tone = voice_signature['tone']['primary'].lower()
    vocabulary = voice_signature['vocabulary']['frequent_words']
    
    scores = {arch: 0 for arch in archetypes}
    for arch, keywords in archetypes.items():
        for word in vocabulary:
            if any(kw in word.lower() for kw in keywords):
                scores[arch] += 1
    
    primary = max(scores, key=scores.get)
    scores[primary] = 0
    secondary = max(scores, key=scores.get)
    
    return {'primary': primary, 'secondary': secondary}
```

### Passo 2: Extrair Crenças

```python
def extract_beliefs(quotes, entities):
    """
    Extrai crenças fundamentais das quotes filosóficas
    """
    beliefs = []
    
    # Filtrar quotes filosóficas
    philosophy_quotes = [q for q in quotes if q['category'] == 'philosophy']
    
    # Agrupar por tema
    themes = {}
    for quote in philosophy_quotes:
        for tag in quote.get('tags', []):
            if tag not in themes:
                themes[tag] = []
            themes[tag].append(quote['text'])
    
    # Extrair crença de cada tema
    for theme, related_quotes in themes.items():
        if len(related_quotes) >= 2:  # Recorrência = crença
            beliefs.append({
                'name': theme.title(),
                'quotes': related_quotes[:3],
                'description': synthesize_belief(related_quotes)
            })
    
    return beliefs[:7]  # Máximo 7 crenças
```

### Passo 3: Documentar Frameworks

```python
def extract_frameworks(entities):
    """
    Extrai frameworks das entidades
    """
    frameworks = [e for e in entities if e['type'] == 'FRAMEWORK']
    
    result = []
    for fw in frameworks:
        result.append({
            'name': fw['name'],
            'description': fw['description'],
            'usage': f"Aplicar quando: {extract_usage_context(fw)}"
        })
    
    return result
```

### Passo 4: Definir Estilo

```python
def compile_communication_style(voice_signature):
    """
    Compila estilo de comunicação para DNA
    """
    return {
        'tone': voice_signature['tone']['primary'],
        'vocabulary': voice_signature['vocabulary']['signature_phrases'],
        'structure': voice_signature['rhetoric_patterns']['argument_flow'],
        'intensity': voice_signature['tone']['intensity_baseline'],
        'catchphrases': voice_signature['vocabulary']['signature_phrases']
    }
```

---

## 3. Template Final

```markdown
# DNA Mental — {Nome}

## 1. Arquétipo
- **Primário:** {Warrior/Mentor/etc.}
- **Secundário:** {se aplicável}
- **Função:** {O que representa}

## 2. Crenças Fundamentais

| # | Crença | Descrição |
|---|--------|-----------|
| 1 | **{Nome}** | {Explicação + impacto} |
| 2 | **{Nome}** | {Explicação + impacto} |
...

## 3. Frameworks Operacionais

| Framework | Função | Uso |
|-----------|--------|-----|
| {Nome} | {O que faz} | {Quando aplicar} |
...

## 4. Estilo de Comunicação

| Característica | Diretriz |
|----------------|----------|
| **Tom** | {Descrição} |
| **Vocabulário** | {Palavras-chave} |
| **Estrutura** | {Padrão} |
| **Catchphrases** | {Lista} |

## 5. Objetivo Comportamental

**Função:** {O que o clone faz}
**Métrica:** {Como medir sucesso}
```

---

## 4. Quality Checks

- [ ] ≥5 crenças documentadas com evidência
- [ ] ≥3 frameworks com uso claro
- [ ] Estilo consistente com voice_signature
- [ ] Arquétipo justificado
- [ ] Exemplos de comportamento incluídos

---

**Versão:** 1.0
**Clone Factory Module:** C3_Creator
