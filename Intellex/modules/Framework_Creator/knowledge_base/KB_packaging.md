# KB: Packaging — Empacotar Ideias Existentes

## 🎯 Objetivo

Guia para **sistematizar e empacotar ideias brutas** do usuário em frameworks estruturados e de alto impacto.

---

## 🔄 Diferença: CREATE vs PACKAGE

| CREATE | PACKAGE |
| :--- | :--- |
| Parte de um problema/gap | Parte de ideias já existentes |
| Pesquisa intensiva via Veritas | Entrevista intensiva com usuário |
| Framework totalmente novo | Framework que organiza pensamentos existentes |
| ~12-20h de trabalho | ~4-8h de trabalho |

---

## 📝 Processo de Packaging

### Etapa 1: Coleta de Material Bruto

**Perguntas para o Usuário:**
```
1. Descreva sua ideia/método em suas próprias palavras
2. De onde veio essa ideia? (experiência, leitura, insight?)
3. Em que situações você já aplicou isso?
4. Qual problema isso resolve?
5. Quem se beneficiaria de conhecer isso?
6. Existe algum nome que você já usa internamente?
7. Como você explicaria isso para alguém em 30 segundos?
```

**Outputs desta etapa:**
- Texto bruto do usuário
- Contexto de origem
- Casos de uso reais

---

### Etapa 2: Identificação de Padrões

**Análise do material bruto para identificar:**

| Elemento | Perguntas |
| :--- | :--- |
| **Etapas/Passos** | Há uma sequência implícita? |
| **Componentes** | Quais são as partes? |
| **Princípios** | Quais são as regras/crenças? |
| **Trade-offs** | Há tensões ou escolhas? |
| **Metáforas** | O usuário usa alguma analogia? |

**Template de Extração:**
```yaml
raw_idea:
  core_insight: "[ideia central em 1 frase]"
  
  implicit_structure:
    type: "steps" | "components" | "matrix" | "cycle" | "hierarchy"
    elements:
      - "[elemento 1]"
      - "[elemento 2]"
      - "[elemento 3]"
  
  problem_solved: "[problema que resolve]"
  
  unique_angle: "[o que diferencia de outros métodos]"
  
  user_metaphors:
    - "[metáfora usada pelo usuário]"
```

---

### Etapa 3: Estruturação

**Escolha do formato baseado no tipo de ideia:**

| Se a ideia tem... | Use formato... |
| :--- | :--- |
| Sequência temporal | Ciclo ou Steps |
| Escolhas/trade-offs | Matriz 2x2 |
| Níveis de profundidade | Pirâmide |
| Múltiplos componentes | Canvas |
| Forças/influências | Diagrama Hub |

**Regras de Estruturação:**
- Limitar a 3-7 elementos principais
- Cada elemento deve ter nome e ação
- Fluxo deve ser óbvio visualmente

---

### Etapa 4: Naming (Nomenclatura)

**Processo:**
1. Listar 10+ opções usando padrões da `KB_naming_patterns.md`
2. Testar cada opção:
   - Pronunciável?
   - Memorável?
   - Googleável (único)?
   - Traduzível?
3. Apresentar 3 melhores ao usuário
4. Usuário escolhe ou refina

**Checklist de Nome:**
- [ ] 2-4 palavras
- [ ] Fácil de pronunciar
- [ ] Evoca imagem/emoção
- [ ] Não existe no Google (ou é diferenciável)
- [ ] Funciona em inglês e português

---

### Etapa 5: Visualização

**Criar representação visual usando `KB_visual_templates.md`:**
1. Escolher template adequado
2. Preencher com elementos do framework
3. Testar compreensão com descrição verbal
4. Iterar até visual ser auto-explicativo

---

### Etapa 6: Validação Rápida

**Perguntas de validação:**
```
1. Olhando para isso, você se reconhece?
2. Está faltando alguma coisa importante?
3. A ordem/hierarquia faz sentido?
4. O nome captura a essência?
5. Você usaria isso para explicar para outros?
```

---

### Etapa 7: Packaging Final

**Deliverables:**
- [ ] Framework Canvas (1 página)
- [ ] Nome + Tagline
- [ ] Visualização icônica
- [ ] Quick Start (3 passos)
- [ ] Quando usar / Quando não usar

---

## 🛠️ Template de Entrevista

```markdown
# Entrevista de Packaging

## Sobre a Ideia
1. Do que se trata, em poucas palavras?
2. Há quanto tempo você usa/pensa sobre isso?
3. Onde você aprendeu/desenvolveu?

## Sobre a Aplicação
4. Me dê um exemplo concreto de uso
5. O que acontece quando alguém NÃO usa isso?
6. Qual o "superpoder" que isso dá?

## Sobre a Estrutura
7. Se você fosse ensinar isso, por onde começaria?
8. Quais são os "passos" ou "partes" principais?
9. Existe uma ordem específica?

## Sobre o Nome
10. Como você chama isso internamente?
11. Se fosse um livro, qual seria o título?
12. Qual metáfora você usaria para explicar?

## Sobre o Público
13. Quem mais se beneficiaria?
14. Como você descobriria se alguém precisa disso?
```

---

## 📋 Checklist de Packaging

- [ ] Material bruto coletado
- [ ] Padrões identificados
- [ ] Estrutura escolhida
- [ ] 3-5 opções de nome geradas
- [ ] Usuário aprovou nome
- [ ] Visualização criada
- [ ] Usuário validou framework
- [ ] Canvas final gerado
- [ ] Documentação criada
