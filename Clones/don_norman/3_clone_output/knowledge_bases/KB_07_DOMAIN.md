# KB_07_DOMAIN — Don Norman

## Objetivo
Documentar conhecimento técnico específico do domínio de UX/Design/HCI que Don Norman domina.

---

## 1. Usabilidade (Usability)

### Definição
Grau em que um produto pode ser usado por usuários específicos para alcançar objetivos específicos com eficácia, eficiência e satisfação.

### Componentes (ISO 9241-11)
| Componente | Definição | Medição |
|:---|:---|:---|
| **Eficácia** | Completar tarefas corretamente | Taxa de sucesso |
| **Eficiência** | Recursos gastos para completar | Tempo, cliques, erros |
| **Satisfação** | Conforto e aceitação | Escalas subjetivas |

### Métodos de Avaliação
- **Testes com usuários** — Observar uso real
- **Avaliação heurística** — Especialistas vs princípios
- **Walkthrough cognitivo** — Simular tarefas mentalmente
- **Análise de tarefas** — Decompor em passos
- **Card sorting** — Organização de informação

### Heurísticas de Nielsen (colaborador)
1. Visibilidade do status do sistema
2. Correspondência com mundo real
3. Controle e liberdade do usuário
4. Consistência e padrões
5. Prevenção de erros
6. Reconhecimento > memorização
7. Flexibilidade e eficiência
8. Design estético e minimalista
9. Ajuda a reconhecer e recuperar de erros
10. Ajuda e documentação

---

## 2. Human-Computer Interaction (HCI)

### Histórico
- **1960s-70s:** Command-line, especialistas
- **1980s:** GUI, mouse, WIMP
- **1990s:** Web, mobile começa
- **2000s:** Touch, mobile dominante
- **2010s:** Voice, AI, ubiquitous computing
- **2020s:** AI generativa, XR, ambient

### Paradigmas de Interação
| Paradigma | Período | Exemplo |
|:---|:---|:---|
| Batch | 1950s-60s | Cartões perfurados |
| CLI | 1970s-80s | Terminal Unix |
| GUI | 1984+ | Mac, Windows |
| Web | 1995+ | Browsers, HTML |
| Touch | 2007+ | iPhone, tablets |
| Voice | 2011+ | Siri, Alexa |
| AI | 2022+ | ChatGPT, Copilot |

### Áreas de Pesquisa
- Input devices e técnicas
- Output e displays
- Modelagem de usuário
- Avaliação de interface
- CSCW (trabalho colaborativo)
- Acessibilidade
- Design participativo

---

## 3. Psicologia Cognitiva Aplicada

### Conceitos Relevantes para Design

#### Atenção
- **Limitada:** Não processamos tudo
- **Seletiva:** Focamos no relevante
- **Dividida:** Difícil multitasking
- **Implicação:** Design deve guiar atenção, não competir

#### Memória
| Tipo | Capacidade | Duração | Implicação |
|:---|:---|:---|:---|
| Sensorial | Alta | Segundos | Feedback imediato |
| Trabalho | 7±2 chunks | Segundos | Não sobrecarregar |
| Longo prazo | Ilimitada | Anos | Consistência ajuda |

#### Percepção
- **Gestalt:** Proximidade, similaridade, continuidade
- **Affordances:** Percebemos possibilidades de ação
- **Pre-attentive:** Cor, tamanho, movimento detectados rápido

#### Tomada de Decisão
- **Bounded rationality:** Racionalidade limitada (Simon)
- **Satisficing:** "Bom o suficiente" > ótimo
- **Heurísticas:** Atalhos mentais
- **Vieses:** Erros sistemáticos

---

## 4. Design de Produtos

### Processo de Design
```
DISCOVER        DEFINE          DEVELOP         DELIVER
(Pesquisa)  →  (Síntese)   →  (Ideação)   →  (Implementação)
     ↑                                              │
     └──────────────────────────────────────────────┘
                      (Iteração)
```

### Métodos de Pesquisa
| Método | Quando Usar | Output |
|:---|:---|:---|
| Entrevistas | Entender motivações | Insights qualitativos |
| Observação | Ver comportamento real | Padrões de uso |
| Surveys | Quantificar atitudes | Dados estatísticos |
| Diary studies | Uso longitudinal | Comportamento ao longo do tempo |
| Testes A/B | Comparar alternativas | Dados quantitativos |

### Artefatos de Design
- **Personas:** Representações de usuários
- **Journey maps:** Experiência ao longo do tempo
- **Wireframes:** Estrutura de interface
- **Protótipos:** Modelos testáveis
- **Especificações:** Documentação técnica

---

## 5. Design de Informação

### Hierarquia Visual
```
TÍTULO PRINCIPAL
├── Subtítulo secundário
│   ├── Conteúdo de suporte
│   └── Detalhes terciários
└── Elementos de ação
```

### Princípios de Organização
- **Chunking:** Agrupar informação relacionada
- **Progressive disclosure:** Revelar gradualmente
- **Scannability:** Facilitar varredura visual
- **Consistency:** Padrões previsíveis

### Navegação
- **Global:** Presente em todas as páginas
- **Local:** Contexto atual
- **Breadcrumbs:** Caminho percorrido
- **Search:** Para localização direta

---

## 6. Design para Erros

### Taxonomia de Erros

#### Slips (Deslizes)
- Ação errada, intenção correta
- Causas: distração, automação, similaridade
- Tipos: capture, description, mode

#### Mistakes (Enganos)
- Ação correta, intenção errada
- Causas: modelo mental errado, informação insuficiente
- Tipos: rule-based, knowledge-based

### Estratégias de Mitigação

| Estratégia | Descrição | Exemplo |
|:---|:---|:---|
| **Constraint** | Impossibilitar erro | USB só encaixa de um jeito |
| **Forcing function** | Forçar sequência | Micro não liga com porta aberta |
| **Confirmation** | Pedir confirmação | "Tem certeza?" para deletar |
| **Undo** | Permitir reversão | Ctrl+Z |
| **Feedback** | Mostrar resultado | Animação de envio |
| **Default seguro** | Opção segura como padrão | Backup automático |

---

## 7. Acessibilidade

### WCAG 2.x Princípios
1. **Perceptível:** Informação apresentável de múltiplas formas
2. **Operável:** Interface navegável por múltiplos meios
3. **Compreensível:** Informação e operação compreensíveis
4. **Robusto:** Compatível com tecnologias assistivas

### Deficiências Consideradas
| Tipo | Considerações |
|:---|:---|
| Visual | Alt text, contraste, tamanho de fonte |
| Auditiva | Legendas, transcrições |
| Motora | Navegação por teclado, áreas de toque |
| Cognitiva | Linguagem clara, consistência |

### Tecnologias Assistivas
- Screen readers
- Ampliadores de tela
- Switches e eye tracking
- Reconhecimento de voz

---

## 8. Métricas de UX

### Quantitativas
| Métrica | O que Mede | Como Calcular |
|:---|:---|:---|
| Task success rate | Eficácia | Tarefas completas / tentativas |
| Time on task | Eficiência | Tempo médio |
| Error rate | Qualidade | Erros / oportunidades |
| Learnability | Curva de aprendizado | Melhoria ao longo do tempo |

### Qualitativas
| Métrica | O que Mede | Como Coletar |
|:---|:---|:---|
| SUS | Usabilidade percebida | Questionário 10 itens |
| NPS | Lealdade/recomendação | "De 0-10, recomendaria?" |
| CSAT | Satisfação | Escala de satisfação |

### Crítica de Norman sobre Métricas
> "Cuidado com métricas que otimizam comportamento de curto prazo às custas de experiência de longo prazo."

---

## 9. Design Ético

### Princípios
1. **Transparência:** Usuário sabe o que está acontecendo
2. **Controle:** Usuário pode escolher
3. **Privacidade:** Dados protegidos
4. **Equidade:** Não discriminar
5. **Benefício:** Design que ajuda, não manipula

### Dark Patterns (Anti-exemplos)
| Pattern | Descrição | Exemplo |
|:---|:---|:---|
| Confirmshaming | Culpar por recusar | "Não, prefiro pagar mais" |
| Hidden costs | Custos ocultos | Taxa no checkout |
| Roach motel | Fácil entrar, difícil sair | Cancelar assinatura |
| Misdirection | Desviar atenção | Destaque em opção indesejada |
| Forced continuity | Cobrança automática | Trial que vira assinatura |

---

## Uso pelo Clone

Acessar esta KB quando:
- Discutir técnicas específicas de UX
- Explicar conceitos de HCI
- Aplicar conhecimento de psicologia cognitiva
- Avaliar acessibilidade ou ética em design

---

**Atualizado:** 2026-01-30
**Clone Factory ID:** don_norman-v1.0
