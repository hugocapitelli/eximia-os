---
title: "KB_01: Rotulos e Artefatos a Remover"
galaxy: "CREATION"
galaxy-color: "#FF8C00"
document-type: "knowledge-base"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "kb-01-rotulos-artefatos"
  - "kb_01: rotulos e artefatos a r"
  - "proposito"
  - "categoria 1: rotulos entre col"
  - "padroes a detectar"
  - "regex para deteccao"
  - "acao"
  - "categoria 2: rotulos com forma"
  - "categoria 3: estruturas numera"
  - "categoria 4: headers e separad"
tags:
  - "galaxy-creation"
  - "knowledge-base"
---

# KB_01: Rotulos e Artefatos a Remover

## Proposito

Este documento lista todos os padroes de rotulos e artefatos que o EditorOS deve identificar e remover das respostas do ORIENTADOR.

## Categoria 1: Rotulos Entre Colchetes

### Padroes a Detectar
```
[Feedback]
[feedback]
[FEEDBACK]
[Provocacao]
[provocacao]
[PROVOCACAO]
[Provocação]
[Pergunta]
[pergunta]
[PERGUNTA]
[Resposta]
[Analise]
[Comentario]
[Observacao]
[Nota]
```

### Regex para Deteccao
```regex
\[[Ff]eedback\]|\[[Pp]rovoca[cç][aã]o\]|\[[Pp]ergunta\]|\[[Rr]esposta\]|\[[Aa]n[aá]lise\]|\[[Cc]oment[aá]rio\]|\[[Oo]bserva[cç][aã]o\]|\[[Nn]ota\]
```

### Acao
Remover completamente, manter conteudo que segue.

---

## Categoria 2: Rotulos com Formatacao

### Padroes a Detectar
```
**Feedback:**
**Provocacao:**
**Pergunta:**
*Feedback:*
*Provocacao:*
*Pergunta:*
__Feedback:__
Feedback:
Provocacao:
Pergunta:
```

### Regex para Deteccao
```regex
\*{1,2}[Ff]eedback:?\*{0,2}|\*{1,2}[Pp]rovoca[cç][aã]o:?\*{0,2}|\*{1,2}[Pp]ergunta:?\*{0,2}|^[Ff]eedback:|^[Pp]rovoca[cç][aã]o:|^[Pp]ergunta:
```

### Acao
Remover completamente, manter conteudo que segue.

---

## Categoria 3: Estruturas Numeradas Artificiais

### Padroes a Detectar
```
1. Feedback:
2. Pergunta:
1) Feedback
2) Provocacao
Passo 1:
Passo 2:
```

### Acao
Remover numeracao, integrar conteudo de forma fluida.

---

## Categoria 4: Headers e Separadores

### Padroes a Detectar
```
---
***
===
## Feedback
### Pergunta
# Resposta
```

### Acao
Remover completamente. Paragrafos devem ser separados apenas por linha em branco.

---

## Categoria 5: Meta-comentarios

### Padroes a Detectar
```
(Este e o feedback)
(Agora vem a pergunta)
[Aqui segue a provocacao]
// Feedback
/* Pergunta */
```

### Acao
Remover completamente.

---

## Categoria 6: Prefixos de Turno

### Padroes a Detectar
```
Tutor:
IA:
Assistente:
SocratOS:
Sistema:
```

### Acao
Remover prefixo, manter conteudo.

---

## Checklist de Limpeza

Antes de finalizar, verificar AUSENCIA de:

| Padrao | Presente? |
|--------|-----------|
| [Feedback] | NAO |
| [Provocacao] | NAO |
| [Pergunta] | NAO |
| **Feedback:** | NAO |
| **Pergunta:** | NAO |
| Numeracao artificial | NAO |
| Headers markdown | NAO |
| Separadores (---) | NAO |
| Prefixos de turno | NAO |

## Exemplos de Limpeza

### Exemplo 1
**Antes:**
```
[Feedback]
Voce fez uma boa observacao sobre o tema.

[Pergunta]
Como voce aplicaria isso na pratica?
```

**Depois:**
```
Voce fez uma boa observacao sobre o tema.

Como voce aplicaria isso na pratica?
```

### Exemplo 2
**Antes:**
```
**Feedback:** Interessante ponto de vista. **Pergunta:** O que voce acha que aconteceria se mudasse essa variavel?
```

**Depois:**
```
Interessante ponto de vista sobre o tema abordado.

O que voce acha que aconteceria se mudasse essa variavel?
```

### Exemplo 3
**Antes:**
```
1. Feedback: Sua analise esta no caminho certo.
2. Provocacao: Mas voce considerou o outro lado?
```

**Depois:**
```
Sua analise esta no caminho certo e demonstra compreensao do tema principal.

Mas voce considerou o outro lado dessa questao?
```


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->

#galaxy-creation