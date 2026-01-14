# KB_04: Frameworks de Design Instrucional

## Visão Geral

Este KB cobre os principais frameworks utilizados para estruturar programas de aprendizagem: **ADDIE**, **SAM**, **Action Mapping** e **Backward Design**.

---

## 1. ADDIE — O Framework Clássico

### Origem

Desenvolvido pelo exército americano nos anos 1970, ADDIE é o framework mais utilizado globalmente para design instrucional.

### As 5 Fases

```
┌─────────┐    ┌─────────┐    ┌─────────────┐    ┌──────────────┐    ┌───────────┐
│ ANALYZE │───►│ DESIGN  │───►│ DEVELOPMENT │───►│ IMPLEMENTATION│───►│ EVALUATE  │
└─────────┘    └─────────┘    └─────────────┘    └──────────────┘    └───────────┘
     │              │               │                  │                   │
     ▼              ▼               ▼                  ▼                   ▼
 Necessidades   Objetivos      Criar materiais    Entregar          Medir eficácia
 Público        Estrutura      Atividades         Facilitar         Coletar feedback
 Contexto       Assessment     Mídia              Suportar          ROI
```

---

### Fase 1: Analyze (Análise)

**Perguntas-chave:**
- Quem é o público-alvo?
- Qual o problema de desempenho?
- Quais as restrições (tempo, orçamento, tecnologia)?
- Qual o gap de conhecimento/habilidade?

**Outputs:**
- Perfil de audiência
- Análise de necessidades
- Análise de tarefas
- Objetivos de alto nível

---

### Fase 2: Design (Projeto)

**Perguntas-chave:**
- Quais são os objetivos de aprendizagem (SMART)?
- Qual a estrutura/sequência do conteúdo?
- Como avaliar a aprendizagem?
- Quais estratégias instrucionais usar?

**Outputs:**
- Objetivos de aprendizagem
- Storyboard/blueprint
- Estratégia de avaliação
- Plano de projeto

---

### Fase 3: Development (Desenvolvimento)

**Perguntas-chave:**
- Como criar os materiais?
- Quais ferramentas utilizar?
- Como garantir qualidade?

**Outputs:**
- Materiais didáticos
- Atividades e exercícios
- Mídia (vídeos, gráficos)
- Guias do instrutor
- Protótipo testado

---

### Fase 4: Implementation (Implementação)

**Perguntas-chave:**
- Como entregar o treinamento?
- Como preparar instrutores/facilitadores?
- Qual suporte técnico necessário?

**Outputs:**
- Treinamento entregue
- Participantes treinados
- Materiais distribuídos
- Suporte operacional

---

### Fase 5: Evaluate (Avaliação)

**Perguntas-chave:**
- O treinamento atingiu os objetivos?
- O desempenho melhorou?
- Qual o ROI?

**Tipos de Avaliação:**
- **Formativa:** Durante desenvolvimento (melhorar antes de lançar)
- **Somativa:** Após implementação (medir eficácia)

---

### Prós e Contras do ADDIE

| Prós | Contras |
|------|---------|
| Estruturado e abrangente | Pode ser lento (waterfall) |
| Fácil de entender | Rígido para mudanças |
| Documentação robusta | Feedback tardio |
| Padrão da indústria | Pode ser burocrático |

---

## 2. SAM — Successive Approximation Model

### Origem

Desenvolvido por **Michael Allen** (2012) como alternativa ágil ao ADDIE.

> *"SAM is designed to solve ADDIE's biggest problem: the long wait for feedback."*
> — Michael Allen

### Comparação ADDIE vs SAM

| Aspecto | ADDIE | SAM |
|---------|-------|-----|
| Abordagem | Waterfall | Iterativo/Ágil |
| Feedback | No final | Constante |
| Protótipo | Tardio | Imediato |
| Mudanças | Difíceis | Esperadas |

### SAM1 (Projetos Pequenos)

```
┌────────────────────────────────────────────────────────────────┐
│                         SAM1                                    │
│                                                                 │
│   ┌──────────┐     ┌──────────┐     ┌──────────┐              │
│   │ Evaluate │◄───►│ Design   │◄───►│ Develop  │              │
│   └──────────┘     └──────────┘     └──────────┘              │
│        ▲                 │                │                    │
│        └─────────────────┴────────────────┘                    │
│                    Iteração Contínua                           │
└────────────────────────────────────────────────────────────────┘
```

### SAM2 (Projetos Complexos)

```
┌─────────────────────────────────────────────────────────────────┐
│                           SAM2                                   │
│                                                                  │
│   PREPARAÇÃO        DESIGN ITERATIVO     DESENVOLVIMENTO        │
│   ────────────      ─────────────────    ────────────────       │
│                                                                  │
│   ┌──────────┐      ┌──────────────────────────────────┐        │
│   │Information│     │                                   │        │
│   │ Gathering │     │  Design ──► Prototype ──► Review │ ◄──┐   │
│   └─────┬────┘      │     ▲                       │    │    │   │
│         │           │     └───────────────────────┘    │    │   │
│         ▼           └──────────────────────────────────┘    │   │
│   ┌──────────┐                     │                        │   │
│   │ Savvy    │                     ▼                        │   │
│   │ Start    │      ┌──────────────────────────────────┐    │   │
│   └──────────┘      │                                   │    │   │
│                     │  Develop ──► Implement ──► Evaluate│───┘   │
│                     │     ▲                        │    │        │
│                     │     └────────────────────────┘    │        │
│                     └──────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

[Allen, Leaving ADDIE for SAM, 2012]

---

## 3. Action Mapping (Cathy Moore)

### Filosofia Central

> *"Training should focus on what people need to DO, not what they need to KNOW."*
> — Cathy Moore

Action Mapping inverte a lógica tradicional: começa pelo comportamento desejado, não pelo conteúdo.

### Os 4 Passos

```
┌─────────────────────────────────────────────────────────────────┐
│                    ACTION MAPPING - 4 PASSOS                     │
│                                                                  │
│   1. BUSINESS GOAL                                              │
│      "O que a organização precisa que aconteça?"                │
│      • Mensurável                                               │
│      • Específico                                               │
│      • Ligado a resultado de negócio                            │
│                          ↓                                       │
│   2. WHAT PEOPLE NEED TO DO                                     │
│      "Quais ações levarão a esse resultado?"                    │
│      • Comportamentos observáveis                               │
│      • NO job, não "saber sobre"                                │
│                          ↓                                       │
│   3. PRACTICE ACTIVITIES                                        │
│      "Como praticar essas ações?"                               │
│      • Cenários realistas                                       │
│      • Decisões com consequências                               │
│      • Atividade ANTES de informação                            │
│                          ↓                                       │
│   4. INFORMATION NEEDED                                         │
│      "O mínimo necessário para fazer a prática"                 │
│      • Só o essencial                                           │
│      • Just-in-time (dentro da atividade)                       │
│      • Nada de information dump                                 │
└─────────────────────────────────────────────────────────────────┘
```

[Moore, Map It, 2017]

---

### Ferramenta Visual: O Mapa

```
                        ┌───────────────────┐
                        │   BUSINESS GOAL   │
                        │  (Centro do mapa) │
                        └─────────┬─────────┘
                                  │
          ┌───────────────────────┼───────────────────────┐
          │                       │                       │
          ▼                       ▼                       ▼
    ┌───────────┐           ┌───────────┐           ┌───────────┐
    │  Action 1 │           │  Action 2 │           │  Action 3 │
    └─────┬─────┘           └─────┬─────┘           └─────┬─────┘
          │                       │                       │
          ▼                       ▼                       ▼
    ┌───────────┐           ┌───────────┐           ┌───────────┐
    │ Activity  │           │ Activity  │           │ Activity  │
    │ (practice)│           │ (practice)│           │ (practice)│
    └───────────┘           └───────────┘           └───────────┘
```

---

### Exemplo Prático

**Meta de negócio:** Reduzir erros de entrada de dados em 30%

| Passo | Tradicional | Action Mapping |
|-------|-------------|----------------|
| 1 | Curso sobre "Qualidade de Dados" | Meta: -30% erros em 6 meses |
| 2 | Capítulos sobre tipos de erro | Ações: Verificar antes de salvar, Usar checklist |
| 3 | Quiz sobre conceitos | Cenário: Dados com erros para identificar |
| 4 | Muito conteúdo | Só: Checklist + Exemplos de erros comuns |

---

## 4. Backward Design (Understanding by Design)

### Origem

Desenvolvido por **Grant Wiggins** e **Jay McTighe** (1998).

> *"Start with the end in mind."*

### Os 3 Estágios

```
┌─────────────────────────────────────────────────────────────────┐
│                    BACKWARD DESIGN - UbD                         │
│                                                                  │
│   ESTÁGIO 1: Identify Desired Results                           │
│   ─────────────────────────────────────                          │
│   O que os aprendizes devem saber e ser capazes de fazer?       │
│   • Compreensões duradouras (Enduring Understandings)           │
│   • Perguntas essenciais                                        │
│   • Conhecimentos e habilidades específicos                     │
│                          ↓                                       │
│   ESTÁGIO 2: Determine Assessment Evidence                      │
│   ──────────────────────────────────────                         │
│   Como saberei que aprenderam?                                  │
│   • Performance tasks (tarefas autênticas)                      │
│   • Outras evidências (quizzes, reflexões)                      │
│   • Auto-avaliação                                              │
│                          ↓                                       │
│   ESTÁGIO 3: Plan Learning Experiences                          │
│   ─────────────────────────────────────                          │
│   Quais atividades levarão aos resultados?                      │
│   • Sequência de aprendizagem                                   │
│   • Recursos e materiais                                        │
│   • (Planejado POR ÚLTIMO)                                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

[Wiggins & McTighe, Understanding by Design, 1998]

---

## 5. Comparativo de Frameworks

| Framework | Melhor para | Foco | Velocidade |
|-----------|------------|------|------------|
| **ADDIE** | Projetos grandes, compliance | Processo completo | Lenta |
| **SAM** | Projetos ágeis, e-learning | Iteração rápida | Média |
| **Action Mapping** | Training corporativo | Comportamento | Rápida |
| **Backward Design** | Educação formal | Compreensão profunda | Média |

---

## 5 Moments of Need (Gottfredson & Mosher)

### Os 5 Momentos

| Momento | Descrição | Solução |
|---------|-----------|---------|
| **New** | Aprendendo algo pela primeira vez | Treinamento formal |
| **More** | Expandindo conhecimento | Recursos avançados |
| **Apply** | Aplicando no trabalho | Performance support |
| **Solve** | Quando algo dá errado | Job aids, troubleshooting |
| **Change** | Quando algo muda | Microlearning, updates |

> *"Training is not the answer for every moment."*
> — Gottfredson & Mosher

[Gottfredson & Mosher, Innovative Performance Support, 2011]

---

## Referências

1. Dick, W., Carey, L., & Carey, J.O. (2015). *The Systematic Design of Instruction* (8th ed.). Pearson.
2. Allen, M. (2012). *Leaving ADDIE for SAM*. ASTD Press.
3. Moore, C. (2017). *Map It: The Hands-On Guide to Strategic Training Design*. Montesa Press.
4. Wiggins, G., & McTighe, J. (1998). *Understanding by Design*. ASCD.
5. Gottfredson, C., & Mosher, B. (2011). *Innovative Performance Support*. McGraw-Hill.

---

**Criado por:** LXD Architect | Z Squad | eximIA.AI © 2026
