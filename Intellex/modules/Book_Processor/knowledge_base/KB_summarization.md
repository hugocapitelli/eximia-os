# KB: Técnicas de Sumarização

## 🎯 Objetivo

Guia para criar **resumos de alta qualidade** em diferentes níveis de profundidade (L1-L5).

---

## 📊 Níveis de Resumo

| Nível | Nome | Tamanho | Tempo de Leitura | Uso |
| :---: | :--- | :--- | :---: | :--- |
| **L1** | One-Pager | ~300 palavras | 2 min | Decisão de ler |
| **L2** | Executive Summary | ~1000 palavras | 5 min | Overview rápido |
| **L3** | Chapter Summaries | ~500/capítulo | 30+ min | Navegação |
| **L4** | Full Synthesis | 3000+ palavras | 15+ min | Deep understanding |
| **L5** | Knowledge Base | Estruturado | Consulta | Input para agentes |

---

## 🔧 Técnicas por Nível

### L1 — One-Pager

**Estrutura:**
```markdown
# [Título do Livro]

## Tese Central
[1 frase que captura a essência]

## 3-5 Insights Principais
1. [Insight 1]
2. [Insight 2]
3. [Insight 3]

## Para Quem É
- [Perfil ideal]

## Para Quem NÃO É
- [Quem deve evitar]

## Veredicto
[Vale a pena ler? Por quê?]
```

**Técnicas:**
- Regra 1-3-1: 1 tese, 3 insights, 1 veredicto
- Perguntar: "Se eu só pudesse lembrar de UMA coisa..."
- Usar linguagem de ação, não descrição

---

### L2 — Executive Summary

**Estrutura:**
```markdown
# [Título do Livro] — Executive Summary

## Problema que o Livro Resolve
[Qual dor o autor endereça?]

## Tese Central
[Argumento principal expandido]

## Frameworks Principais
### 1. [Nome do Framework]
[Descrição + aplicação]

### 2. [Nome do Framework]
[Descrição + aplicação]

## Citação Impactante
> "[Citação memorável]"

## Ações Práticas
1. [Ação derivada 1]
2. [Ação derivada 2]
3. [Ação derivada 3]
```

**Técnicas:**
- Começar pelo problema, não pelo autor
- Priorizar frameworks acionáveis
- Incluir 1 citação "tweetável"
- Terminar com ações concretas

---

### L3 — Chapter Summaries

**Estrutura por capítulo:**
```markdown
## Capítulo [N]: [Título]

### Objetivo
[O que o autor quer que você entenda]

### Argumentos Principais
- [Argumento 1]
- [Argumento 2]

### Conceitos Introduzidos
- **[Conceito]**: [Definição breve]

### Conexão
- ← Conecta com: [Capítulo anterior]
- → Prepara para: [Capítulo seguinte]
```

**Técnicas:**
- Manter estrutura consistente
- Destacar novos conceitos
- Conectar narrativa entre capítulos
- Usar bullet points para escaneabilidade

---

### L4 — Full Synthesis

**Estrutura:**
```markdown
# [Título do Livro] — Síntese Completa

## 1. Contexto
- Quem é o autor
- Por que escreveu
- Quando foi publicado
- Relevância atual

## 2. Problema Central
[Descrição detalhada do problema]

## 3. Tese do Autor
[Argumento central completo]

## 4. Frameworks e Modelos
### 4.1 [Framework 1]
[Explicação detalhada]
[Aplicação prática]
[Limitações]

### 4.2 [Framework 2]
[...]

## 5. Evidências Apresentadas
[Como o autor suporta seus argumentos]

## 6. Críticas e Limitações
[Onde o argumento falha]
[O que está faltando]

## 7. Comparação com Obras Relacionadas
[Como se posiciona no campo]

## 8. Plano de Aplicação
[Passo a passo para implementar]

## 9. Citações Selecionadas
[10-20 citações organizadas por tema]
```

**Técnicas:**
- Tratar como análise acadêmica
- Incluir críticas honestas
- Comparar com outras obras
- Terminar com plano de ação

---

### L5 — Knowledge Base

**Estrutura:**
```yaml
book:
  title: "[Título]"
  author: "[Autor]"
  year: 2024
  
core_thesis: "[Tese em 1 frase]"

concepts:
  - name: "[Conceito 1]"
    definition: "[Definição]"
    related: ["[Conceito 2]", "[Conceito 3]"]
    
frameworks:
  - name: "[Framework 1]"
    components: ["A", "B", "C"]
    use_when: "[Situação]"
    
quotes:
  - text: "[Citação]"
    context: "[Onde/Por quê]"
    page: 45
    
key_arguments:
  - claim: "[Afirmação]"
    evidence: ["[Evidência 1]", "[Evidência 2]"]
```

**Técnicas:**
- Priorizar estrutura sobre prosa
- Facilitar busca e referência
- Manter relacionamentos entre conceitos
- Formato YAML ou JSON para integração

---

## 🎯 Regras de Ouro

### Fidelidade
- NUNCA distorcer ideias do autor
- SEMPRE usar citações diretas para claims importantes
- Quando interpretar, marcar como "[Minha interpretação]"

### Priorização
- Frameworks > Argumentos > Histórias
- Ações > Descrições
- Novo > Óbvio

### Linguagem
- Direto, sem rodeios
- Presente do indicativo
- Voz ativa
- Sem jargão desnecessário

### Formatação
- Headers para estrutura
- Bullets para listas
- Negrito para conceitos-chave
- Citações em blockquote

---

## 🔄 Processo de Sumarização

```
1. SCAN       → Ler índice, intro, conclusão
2. STRUCTURE  → Identificar estrutura do livro
3. EXTRACT    → Marcar conceitos e frameworks
4. DISTILL    → Reduzir ao essencial
5. ORGANIZE   → Estruturar por nível
6. VERIFY     → Checar fidelidade ao original
7. POLISH     → Refinar linguagem
```
