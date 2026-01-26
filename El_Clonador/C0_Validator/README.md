# C0 Validator — Pre-Pipeline Source Validation

O C0 Validator é o **guardião do pipeline** do Clone Factory. Ele avalia a viabilidade de um clone ANTES de iniciar o processo de clonagem.

## Propósito

Evitar desperdício de recursos em clones que nasceriam com baixa fidelidade por falta de material fonte.

## Quando Usar

**Antes de iniciar qualquer pipeline de clone**, o C0 deve avaliar:
- Disponibilidade de fontes (vídeos, artigos, livros)
- Cobertura das 4 dimensões (Identity, Cognition, Voice, Behavior)
- Complexidade estimada do clone

## Decisões Possíveis

| Decisão | Significado |
|:---|:---|
| ✅ **APPROVED** | Pipeline liberado, pode iniciar C1 Hunter |
| ⚠️ **CONDITIONAL** | Aprovado com condições que o usuário deve resolver |
| ❌ **REJECTED** | Clone inviável no momento, alternativas sugeridas |

## Como Solicitar Validação

```markdown
# Clone Validation Request

## Target
- **Nome:** [Nome do especialista]
- **Domínio:** [Área de atuação]

## Objetivo
[Para que o clone será usado]

## Escopo
- **Incluir:** [Aspectos a focar]
- **Excluir:** [O que não incluir]
```

## Output Esperado

O C0 retorna um **Validation Report** com:
- Viability Score (0-100)
- Gap Analysis por dimensão
- Estimativa de horas
- Decision + Justificativa

## Integração no Pipeline

```
C0 Validator → [Gate Decision]
    ↓ (APPROVED)
C1 Hunter → C2 Extractor → C3 Creator → C4 Auditor
```

---

Arquivo: `agente_core.md` (neste diretório)
