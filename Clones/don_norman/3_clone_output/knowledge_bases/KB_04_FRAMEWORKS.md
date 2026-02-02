# KB_04_FRAMEWORKS — Don Norman

## Objetivo
Documentar os frameworks, metodologias e ferramentas conceituais desenvolvidas ou popularizadas por Don Norman.

---

## 1. Os 7 Princípios Fundamentais de Design

Framework central de "The Design of Everyday Things" para avaliar qualidade de design.

### 1.1 Discoverability (Descobribilidade)
**Definição:** A capacidade de determinar quais ações são possíveis e o estado atual do sistema.

**Perguntas de avaliação:**
- O usuário consegue descobrir o que pode fazer?
- As opções disponíveis são visíveis?
- O estado atual é claro?

**Exemplo:** Uma boa interface de app mostra todas as ações principais na tela inicial.

---

### 1.2 Feedback
**Definição:** Comunicação completa e contínua sobre os resultados das ações e o estado atual.

**Perguntas de avaliação:**
- O sistema informa o que está acontecendo?
- A resposta é imediata?
- O feedback é informativo, não apenas presente?

**Regra:** Feedback deve ser imediato — atraso de 0.1 segundo já pode ser perturbador.

**Exemplo:** Um botão que muda de cor ao ser pressionado; uma barra de progresso durante upload.

---

### 1.3 Conceptual Model (Modelo Conceitual)
**Definição:** Uma explicação, geralmente simplificada, de como algo funciona.

**Componentes:**
- **Design model:** Como o designer pensa que funciona
- **User's mental model:** Como o usuário pensa que funciona
- **System image:** O que o produto comunica

**Objetivo:** Alinhar os três modelos.

**Exemplo:** Lixeira do computador — modelo mental de "papel que pode ser recuperado até ser esvaziado".

---

### 1.4 Affordances
**Definição:** As propriedades reais e percebidas de um objeto que determinam como ele pode ser usado.

**Origem:** James J. Gibson (psicologia ecológica)

**Tipos:**
- **Real affordances:** O que realmente pode ser feito
- **Perceived affordances:** O que parece poder ser feito

**Exemplo:** Uma cadeira permite (affords) sentar; uma maçaneta redonda permite girar.

---

### 1.5 Signifiers (Sinalizadores)
**Definição:** Sinais que comunicam onde e como uma ação deve ocorrer.

**Diferença de affordances:**
- Affordances = capacidades reais
- Signifiers = sinais que comunicam essas capacidades

**Tipos:**
- Deliberados (projetados): Botões, ícones
- Acidentais: Trilha de pegadas na grama

**Exemplo:** Placa de "PUSH" em uma porta; ícone de lupa para busca.

---

### 1.6 Mappings
**Definição:** A relação entre controles e seus efeitos.

**Tipos de mapping:**
- **Natural:** Corresponde a arranjo físico ou expectativas culturais
- **Arbitrário:** Sem correspondência óbvia

**Regra:** Quanto mais natural o mapping, melhor.

**Exemplo:**
- Bom: Volante gira na direção que o carro vai
- Ruim: Botões de fogão sem relação espacial com as bocas

---

### 1.7 Constraints (Restrições)
**Definição:** Limitações que guiam o comportamento e previnem erros.

**Tipos:**
| Tipo | Descrição | Exemplo |
|:---|:---|:---|
| **Physical** | Impossibilidade física | USB só encaixa de um jeito |
| **Cultural** | Convenções sociais | Fila, setas de direção |
| **Semantic** | Significado limita opções | Luz vermelha = parar |
| **Logical** | Dedução limita opções | Última peça de quebra-cabeça |

---

## 2. Três Níveis de Design Emocional

Framework de "Emotional Design" (2004).

### 2.1 Nível Visceral
**Foco:** Reação automática, inconsciente, imediata

**Pergunta:** Como parece à primeira vista?

**Características:**
- Baseado em aparência, textura, som, cheiro
- Instintivo, pré-consciente
- Universal (mas com variações culturais)

**Design para visceral:**
- Cores atraentes
- Formas agradáveis
- Materiais de qualidade percebida

---

### 2.2 Nível Behavioral
**Foco:** Experiência de uso

**Pergunta:** Funciona bem?

**Características:**
- Usabilidade
- Funcionalidade
- Performance
- Compreensibilidade

**Design para behavioral:**
- Facilidade de uso
- Eficiência
- Feedback adequado
- Prevenção de erros

---

### 2.3 Nível Reflective
**Foco:** Significado, mensagem, identidade

**Pergunta:** O que isso diz sobre mim?

**Características:**
- Consciente, contemplativo
- Relacionado a self-image
- Influenciado por cultura e experiência
- Memória e storytelling

**Design para reflective:**
- Prestígio e status
- Significado pessoal
- Memórias positivas
- Identidade de marca

---

## 3. Gulf of Execution e Gulf of Evaluation

### Gulf of Execution
**Definição:** Gap entre intenção do usuário e ações possíveis no sistema.

**Pergunta:** O usuário consegue descobrir COMO fazer o que quer?

**Componentes:**
1. Formar a intenção
2. Determinar ação necessária
3. Especificar a sequência de ações
4. Executar a ação

**Reduzir o gulf:** Tornar ações visíveis, signifiers claros, mappings naturais.

---

### Gulf of Evaluation
**Definição:** Gap entre estado do sistema e percepção do usuário.

**Pergunta:** O usuário consegue entender O QUE ACONTECEU?

**Componentes:**
1. Perceber o estado do mundo
2. Interpretar a percepção
3. Comparar com intenção original

**Reduzir o gulf:** Feedback imediato, estado visível, conceptual model claro.

---

## 4. Human-Centered Design (HCD)

### Processo Iterativo

```
    ┌─────────────────┐
    │    OBSERVAR     │
    │  (Understand)   │
    └────────┬────────┘
             │
    ┌────────▼────────┐
    │ GERAR IDEIAS    │
    │   (Ideate)      │
    └────────┬────────┘
             │
    ┌────────▼────────┐
    │  PROTOTIPAR     │
    │  (Prototype)    │
    └────────┬────────┘
             │
    ┌────────▼────────┐
    │    TESTAR       │
    │    (Test)       │
    └────────┬────────┘
             │
             └──────────► REPETIR
```

### Princípios do HCD
1. **Foco nas pessoas:** Entender necessidades reais
2. **Observação > suposição:** Ver o que fazem, não o que dizem
3. **Iteração rápida:** Falhar cedo, aprender rápido
4. **Prototipagem:** Pensar com as mãos
5. **Teste com usuários reais:** Validar com comportamento real

---

## 5. Root Cause Analysis para Erros

### Processo

```
ERRO OBSERVADO
     │
     ▼
"Por que isso aconteceu?"
     │
     ▼
"Por que essa condição existia?"
     │
     ▼
"Por que o sistema permitiu isso?"
     │
     ▼
ROOT CAUSE (geralmente = design)
```

### Princípios
- Nunca pare no "erro humano"
- Sempre pergunte "por que?" até chegar ao sistema
- Busque condições latentes, não culpados

---

## 6. Seven Stages of Action

### Modelo Completo

```
                    GOAL
                     │
    ┌────────────────┼────────────────┐
    │                │                │
    ▼                ▼                ▼
  PLAN          SPECIFY           PERFORM
    │                │                │
    │                │                │
    └────────────────┼────────────────┘
                     │
                   WORLD
                     │
    ┌────────────────┼────────────────┐
    │                │                │
    ▼                ▼                ▼
PERCEIVE        INTERPRET          COMPARE
    │                │                │
    │                │                │
    └────────────────┴────────────────┘
                     │
                   GOAL (evaluation)
```

**Estágios:**
1. **Goal:** O que quero alcançar?
2. **Plan:** Como vou fazer?
3. **Specify:** Qual sequência de ações?
4. **Perform:** Executar as ações
5. **Perceive:** O que aconteceu?
6. **Interpret:** O que isso significa?
7. **Compare:** Alcancei meu objetivo?

---

## 7. Design for Error

### Tipos de Erro

| Tipo | Definição | Causa |
|:---|:---|:---|
| **Slip** | Ação errada, intenção certa | Automação, distração |
| **Mistake** | Ação certa, intenção errada | Planejamento ruim, modelo mental errado |

### Estratégias de Prevenção

1. **Constraints:** Impossibilitar ações erradas
2. **Forcing functions:** Forçar sequência correta
3. **Confirmation:** Exigir confirmação para ações destrutivas
4. **Undo:** Permitir reversão fácil
5. **Feedback:** Tornar estado do sistema visível

---

## Uso pelo Clone

Acessar esta KB quando:
- Precisar aplicar frameworks específicos
- Explicar metodologias de design
- Analisar problemas usando princípios estruturados
- Ensinar conceitos de UX

---

**Atualizado:** 2026-01-30
**Clone Factory ID:** don_norman-v1.0
