---
title: "Markdown Conversion Rules"
galaxy: "CODEX"
galaxy-color: "#A9A9A9"
document-type: "knowledge-base"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "kb-02-markdown-conversion-rules"
  - "markdown conversion rules"
  - "overview"
  - "sintaxe básica"
  - "headers"
  - "h1 - título principal"
  - "h2 - subtítulo"
  - "h3 - seção"
  - "parágrafos"
  - "ênfase"
tags:
  - "galaxy-codex"
  - "knowledge-base"
---

# Markdown Conversion Rules

## Overview

Regras e padrões para conversão de HTML para Markdown limpo e estruturado.

## Sintaxe Básica

### Headers
```markdown
# H1 - Título Principal
## H2 - Subtítulo
### H3 - Seção
#### H4 - Subseção
```

**HTML → Markdown:**
- `<h1>` → `# `
- `<h2>` → `## `
- `<h3>` → `### `
- etc.

### Parágrafos
- Separar com linha vazia
- Não usar `<br>` (usar quebra de linha dupla)

```markdown
Primeiro parágrafo.

Segundo parágrafo.
```

### Ênfase
```markdown
*itálico* ou _itálico_
**negrito** ou __negrito__
***negrito e itálico***
```

### Listas

**Não ordenadas:**
```markdown
- Item 1
- Item 2
  - Sub-item 2.1
  - Sub-item 2.2
```

**Ordenadas:**
```markdown
1. Primeiro
2. Segundo
3. Terceiro
```

### Links
```markdown
[Texto do link](https://url.com)
[Link com título](https://url.com "Título opcional")
```

### Imagens
```markdown
![Alt text](https://url.com/imagem.jpg)
![Com título](image.jpg "Título da imagem")
```

### Citações
```markdown
> Citação em bloco
> Pode ter múltiplas linhas
```

### Código

**Inline:** `código inline`

**Bloco:**
````markdown
```python
def hello():
    print("Hello, World!")
```
````

## Conversão HTML → Markdown

### Elementos Comuns

| HTML | Markdown |
|------|----------|
| `<p>texto</p>` | `texto\n\n` |
| `<strong>negrito</strong>` | `**negrito**` |
| `<em>itálico</em>` | `*itálico*` |
| `<a href="url">link</a>` | `[link](url)` |
| `<img src="img" alt="alt">` | `![alt](img)` |
| `<code>code</code>` | `` `code` `` |
| `<pre>code block</pre>` | ` ```\ncode\n``` ` |
| `<blockquote>quote</blockquote>` | `> quote` |

### Tabelas
```markdown
| Coluna 1 | Coluna 2 | Coluna 3 |
|----------|----------|----------|
| Valor 1  | Valor 2  | Valor 3  |
| Valor 4  | Valor 5  | Valor 6  |
```

**Alinhamento:**
```markdown
| Esquerda | Centro | Direita |
|:---------|:------:|--------:|
| Texto    | Texto  | Texto   |
```

## Regras de Limpeza

### 1. Remover Elementos Indesejados

**Antes da conversão, remover:**
- `<script>` - JavaScript
- `<style>` - CSS
- `<nav>` - Navegação
- `<header>` - Cabeçalho do site
- `<footer>` - Rodapé
- `<aside>` - Sidebars
- `<iframe>` - Frames
- Comentários HTML

### 2. Normalizar Espaçamento

```python
import re

# Múltiplas linhas vazias → dupla
content = re.sub(r'\n{3,}', '\n\n', content)

# Espaços extras
content = re.sub(r' {2,}', ' ', content)

# Espaços antes de quebra de linha
content = re.sub(r' +\n', '\n', content)
```

### 3. Caracteres Especiais

**Escapar quando necessário:**
- `\` → `\\`
- `*` → `\*` (em texto normal)
- `_` → `\_` (em texto normal)
- `#` → `\#` (início de linha)
- `` ` `` → ` \` ` (em texto normal)

**Não escapar em:**
- Código inline/bloco
- URLs
- Dentro de elementos de código

## Frontmatter YAML

Adicionar metadata no início do arquivo:

```yaml
---
title: Título do Artigo
author: Nome do Autor
date: 2024-01-01
source_url: https://example.com
tags: [tag1, tag2, tag3]
---
```

## Estrutura Recomendada

```markdown
---
title: Título
author: Autor
source_url: URL
date_scraped: ISO-8601
---

# Título Principal

**Source:** [URL](URL)  
**Author:** Autor  
**Date:** Data

---

## Introdução

Primeiro parágrafo...

## Seção 1

Conteúdo...

### Subseção 1.1

Mais conteúdo...

## Conclusão

Última seção...
```

## Tratamento Especial

### Notas de Rodapé
```markdown
Texto com referência[^1].

[^1]: Nota de rodapé aqui.
```

### Listas de Tarefas
```markdown
- [x] Tarefa completa
- [ ] Tarefa pendente
```

### Linhas Horizontais
```markdown
---
ou
***
ou
___
```

## Qualidade da Conversão

### Checklist de Validação

- [ ] Headers preservados corretamente
- [ ] Parágrafos com espaçamento adequado
- [ ] Links funcionais
- [ ] Imagens com alt text
- [ ] Listas formatadas corretamente
- [ ] Código com syntax highlighting
- [ ] Tabelas preservadas
- [ ] Sem HTML residual
- [ ] Sem múltiplas linhas vazias
- [ ] Frontmatter válido

### Ferramentas

**Trafilatura (Recomendado):**
```python
markdown = trafilatura.extract(
    html,
    output_format='markdown',
    include_comments=False,
    include_tables=True,
    include_images=True
)
```

**html2text (Alternativa):**
```python
import html2text

h = html2text.HTML2Text()
h.ignore_links = False
h.ignore_images = False
markdown = h.handle(html)
```

## Referências

- [Markdown Guide](https://www.markdownguide.org/)
- [CommonMark Spec](https://commonmark.org/)
- [GitHub Flavored Markdown](https://github.github.com/gfm/)

#galaxy-codex