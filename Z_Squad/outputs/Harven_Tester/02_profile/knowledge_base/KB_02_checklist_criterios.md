---
title: "KB_02: Checklist de 6 Criterios"
galaxy: "CREATION"
galaxy-color: "#FF8C00"
document-type: "knowledge-base"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "kb-02-checklist-criterios"
  - "kb_02: checklist de 6 criterio"
  - "visao geral"
  - "criterio 1: sem resposta diret"
  - "verificacao"
  - "resultado"
  - "criterio 2: pergunta aberta ao"
  - "tipos de perguntas"
  - "criterio 3: feedback construti"
  - "exemplos"
tags:
  - "galaxy-creation"
  - "knowledge-base"
---

# KB_02: Checklist de 6 Criterios

## Visao Geral

O TesterOS valida cada resposta contra 6 criterios. Para ser APPROVED, a resposta deve passar em TODOS os criterios CRITICAL e MAJOR, e na maioria dos MINOR.

---

## Criterio 1: Sem Resposta Direta

| Aspecto | Valor |
|---------|-------|
| **Codigo** | C1 |
| **Severidade** | CRITICAL |
| **Pergunta** | A resposta "entrega" informacao que o aluno deveria descobrir? |

### Verificacao

- [ ] Nao contem definicoes completas de conceitos
- [ ] Nao lista fatores/elementos que o aluno deveria identificar
- [ ] Nao explica processos/procedimentos
- [ ] Nao usa linguagem de "a resposta e", "o correto e"
- [ ] Ainda ha espaco para o aluno pensar

### Resultado
- **PASS:** Resposta provoca reflexao, nao entrega informacao
- **FAIL:** Resposta direta detectada -> REJECT

---

## Criterio 2: Pergunta Aberta ao Final

| Aspecto | Valor |
|---------|-------|
| **Codigo** | C2 |
| **Severidade** | CRITICAL |
| **Pergunta** | O texto termina com uma pergunta aberta que exige raciocinio? |

### Verificacao

- [ ] Ultimo caractere e "?"
- [ ] Pergunta nao e de sim/nao
- [ ] Pergunta exige elaboracao/raciocinio
- [ ] Pergunta nao e retorica
- [ ] Pergunta esta relacionada ao tema

### Resultado
- **PASS:** Pergunta aberta presente e adequada
- **FAIL:** Sem pergunta OU pergunta fechada -> REJECT

### Tipos de Perguntas

| Tipo | Exemplo | OK? |
|------|---------|-----|
| Aberta | "Como voce aplicaria isso?" | SIM |
| Aberta | "Que criterios usaria?" | SIM |
| Aberta | "O que aconteceria se...?" | SIM |
| Fechada | "Voce concorda?" | NAO |
| Fechada | "Faz sentido?" | NAO |
| Retorica | "Nao e mesmo?" | NAO |

---

## Criterio 3: Feedback Construtivo Presente

| Aspecto | Valor |
|---------|-------|
| **Codigo** | C3 |
| **Severidade** | MAJOR |
| **Pergunta** | O primeiro paragrafo comenta/reconhece a resposta do aluno? |

### Verificacao

- [ ] Menciona algo especifico que o aluno disse
- [ ] Reconhece pontos validos (se houver)
- [ ] Adiciona nuance ou perspectiva
- [ ] Nao e generico ("Boa resposta!")
- [ ] Conecta com o que o aluno escreveu

### Resultado
- **PASS:** Feedback especifico e construtivo presente
- **FAIL:** Feedback ausente ou generico demais -> REJECT

### Exemplos

| Texto | Veredicto |
|-------|-----------|
| "Voce levanta um ponto interessante sobre [X]" | PASS |
| "Sua observacao sobre [Y] toca em algo importante" | PASS |
| "Boa resposta!" | FAIL (generico) |
| "Interessante." | FAIL (vazio) |
| [Comeca direto com pergunta] | FAIL (sem feedback) |

---

## Criterio 4: Sem Rotulos Artificiais

| Aspecto | Valor |
|---------|-------|
| **Codigo** | C4 |
| **Severidade** | MAJOR |
| **Pergunta** | O texto esta livre de rotulos e formatacao artificial? |

### Verificacao

- [ ] Nao contem [Feedback], [Pergunta], etc.
- [ ] Nao contem **Feedback:**, **Pergunta:**, etc.
- [ ] Nao contem numeracao artificial (1., 2.)
- [ ] Nao contem headers markdown (##, ###)
- [ ] Nao contem separadores (---, ***)
- [ ] Nao contem prefixos de turno (Tutor:, IA:)

### Resultado
- **PASS:** Texto limpo e natural
- **FAIL:** Rotulo/formatacao detectada -> REJECT

### Padroes a Buscar (Regex)
```
\[.*?\]              # Qualquer coisa entre colchetes
\*\*\w+:\*\*         # **Palavra:**
^\d+\.\s             # Numeracao
^#+\s                # Headers
^---$                # Separadores
^(Tutor|IA|Assistente):  # Prefixos
```

---

## Criterio 5: Texto Fluido e Natural

| Aspecto | Valor |
|---------|-------|
| **Codigo** | C5 |
| **Severidade** | MINOR |
| **Pergunta** | O texto soa como conversa humana natural? |

### Verificacao

- [ ] Le como dialogo, nao como output de maquina
- [ ] Vocabulario acessivel
- [ ] Estrutura de frases variada
- [ ] Sem repeticoes excessivas
- [ ] Sem estruturas artificiais

### Resultado
- **PASS:** Texto fluido e natural
- **WARN:** Pequenas rigidezes (aprovar com observacao)
- **FAIL:** Extremamente robotico -> REJECT

### Indicadores de Texto Robotico

| Sinal | Exemplo |
|-------|---------|
| Repeticao de estrutura | "Em primeiro lugar... Em segundo lugar..." |
| Linguagem burocratica | "Cabe ressaltar que...", "Vale mencionar que..." |
| Excesso de conectores | "Portanto", "Assim sendo", "Nesse sentido" |
| Tom impessoal | Ausencia total de "voce" |

---

## Criterio 6: Conexao com Tema

| Aspecto | Valor |
|---------|-------|
| **Codigo** | C6 |
| **Severidade** | MINOR |
| **Pergunta** | A resposta esta relacionada ao capitulo/tema estudado? |

### Verificacao

- [ ] Conteudo claramente sobre o tema
- [ ] Pergunta relacionada ao capitulo
- [ ] Nao ha desvio para assunto diferente

### Resultado
- **PASS:** Claramente conectado ao tema
- **WARN:** Levemente tangencial (aprovar com observacao)
- **FAIL:** Completamente fora do tema -> REJECT

---

## Tabela Resumo

| Criterio | Codigo | Severidade | Falha = |
|----------|--------|------------|---------|
| Sem Resposta Direta | C1 | CRITICAL | REJECT |
| Pergunta Aberta ao Final | C2 | CRITICAL | REJECT |
| Feedback Construtivo | C3 | MAJOR | REJECT |
| Sem Rotulos | C4 | MAJOR | REJECT |
| Texto Fluido | C5 | MINOR | WARN/REJECT |
| Conexao Tema | C6 | MINOR | WARN/REJECT |

---

## Calculo do Score

```
Total = 6 criterios
CRITICAL_FAILED = count(C1_FAIL, C2_FAIL)
MAJOR_FAILED = count(C3_FAIL, C4_FAIL)
MINOR_FAILED = count(C5_FAIL, C6_FAIL)

Se CRITICAL_FAILED > 0:
    Score = 0
    Veredicto = REJECTED

Se MAJOR_FAILED > 0:
    Score = (6 - CRITICAL_FAILED*2 - MAJOR_FAILED*1.5 - MINOR_FAILED*0.5) / 6
    Veredicto = REJECTED

Se MINOR_FAILED > 1:
    Score = (6 - MINOR_FAILED*0.5) / 6
    Veredicto = REJECTED se Score < 0.7

Senao:
    Score = (6 - MINOR_FAILED*0.5) / 6
    Veredicto = APPROVED (com observacoes se MINOR_FAILED > 0)
```


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->

#galaxy-creation