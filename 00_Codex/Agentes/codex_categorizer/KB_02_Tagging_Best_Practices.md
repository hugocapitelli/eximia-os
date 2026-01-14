# Tagging Best Practices

## Princípios de Tags Eficazes

### 1. Específicas mas Abrangentes
❌ "tech" → ✅ "machine-learning", "web-development"

### 2. Consistência
- Sempre minúsculas
- Usar hífens para multi-word: "product-market-fit"
- Singular quando possível: "startup" não "startups"

### 3. Granularidade Balanceada
- Nem muito genérica: ❌ "business"
- Nem muito específica: ❌ "react-18-use-effect-hook"
- Ideal: ✅ "react", "hooks", "web-development"

## Tag Limits

- **Mínimo:** 3 tags
- **Máximo:** 10 tags
- **Ideal:** 5-7 tags

## Hierarquia de Tags

### Nível 1: Domínio (1-2 tags)
- technology
- business
- science
- education

### Nível 2: Área (2-3 tags)
- programming, ai, data
- startups, marketing, finance
- biology, physics
- learning, teaching

### Nível 3: Específico (2-4 tags)
- python, react, kubernetes
- fundraising, pmf, growth
- genetics, quantum
- online-course, tutorial

## Tags Comuns por Categoria

### Tecnologia
```
programming, coding, software
python, javascript, rust
web, frontend, backend
ai, ml, deep-learning
data-science, analytics
devops, cloud, aws
mobile, ios, android
```

### Startups/Negócios
```
startups, entrepreneurship
business-model, strategy
product, pmf, growth
marketing, branding, seo
fundraising, vc, investment
saas, b2b, b2c
```

### Produtividade
```
productivity, efficiency
time-management, focus
tools, automation
workflows, systems
```

### Soft Skills
```
leadership, management
communication, writing
thinking, decision-making
creativity, innovation
```

## Extração de Tags

### Via Gemini
```python
TAGGING_PROMPT = """
Gere 5-7 tags relevantes para:

TÍTULO: {title}
CONTEÚDO: {content_sample}

Regras:
- Minúsculas
- Hífens para multi-word
- Específicas e acionáveis
- Mix de amplas + específicas

JSON: {{"tags": ["tag1", "tag2", ...]}}
"""
```

### Via Keywords (Fallback)
```python
def extract_keywords(text):
    # Remover stopwords
    # Contar frequência
    # Top 10 palavras
    # Normalizar para tag format
    return keywords
```

## Qualidade das Tags

### Checklist

- [ ] 5-7 tags geradas
- [ ] Todas minúsculas
- [ ] Hífens em multi-word
- [ ] Mix de domínio + específicas
- [ ] Sem duplicatas
- [ ] Relevantes ao conteúdo
- [ ] Acionáveis (pesquisáveis)

### Exemplos

**Artigo: "How to Achieve Product-Market Fit"**

✅ Bom:
```json
["startups", "pmf", "product-strategy", "customers", "market-research"]
```

❌ Ruim:
```json
["business", "things", "how-to", "article", "good"]
```

## Tag Normalization

```python
def normalize_tag(tag):
    # Lowercase
    tag = tag.lower()
    
    # Remove special chars
    tag = re.sub(r'[^\w\s-]', '', tag)
    
    # Spaces → hyphens
    tag = tag.replace(' ', '-')
    
    # Remove multiple hyphens
    tag = re.sub(r'-+', '-', tag)
    
    # Trim
    tag = tag.strip('-')
    
    return tag
```

## Referencias

- Tags devem facilitar descoberta
- Pens ar em como você buscaria
- Equilibrar SEO + utilidade
