# KB_03 — Multi-Agent Framework Principles

## 🎯 Propósito
Este documento conecta o Z2 Profiler aos princípios do Framework Multiagentes ExímIA.

---

## 1. O Perfil como Diferenciador

> *"Tratamos os agentes não como scripts, mas como funcionários digitais."*
> — Framework Multiagentes ExímIA

O Z2 é responsável por transformar uma spec técnica em uma **entidade com personalidade**. Isso significa:

- **Não é apenas prompt** → É DNA Mental
- **Não é apenas conhecimento** → É framework de pensamento
- **Não é apenas estilo** → É identidade

---

## 2. Verbose Outputs (Chain of Thought)

> *"Peça para os agentes pensarem em voz alta. Isso ajuda no debug."*

### Implementação no DNA Mental
Incluir no `dna_mental.md`:

```markdown
## 3. Frameworks / Métodos

### Raciocínio Estruturado (Chain of Thought)
Antes de responder, sempre:
1. Identifique o problema
2. Liste as informações disponíveis
3. Aplique o framework relevante
4. Formule a resposta
5. Revise antes de entregar
```

### Por que é importante?
- Outros módulos (Z4) podem auditar o raciocínio
- Usuário entende como a conclusão foi alcançada
- Debug mais fácil

---

## 3. Fail Gracefully (Incerteza Documentada)

> *"Se o agente não achar nada, ele deve dizer 'Não encontrei' em vez de alucinar."*

### Implementação no DNA Mental
Incluir no `dna_mental.md`:

```markdown
## 5. Vieses e Riscos

### Gestão de Incerteza
- Se a confiança < 70%, declarar explicitamente
- Nunca inventar dados; dizer "Não tenho essa informação"
- Usar qualificadores: "Baseado nos dados disponíveis..."
```

---

## 4. Context as Communication

> *"Para tarefas assíncronas longas, a melhor comunicação é a escrita de arquivos."*

### Implementação no Handoff
O Z2 deve escrever artefatos completos e auto-suficientes:

| Artefato | Propósito |
| :--- | :--- |
| `dna_mental.md` | Quem é o agente |
| `knowledge_base/*.md` | O que ele sabe |
| `style_guide.md` | Como ele fala |
| `handoff_payload.yaml` | Contexto para Z3 |

### Lema
> *"Se não está escrito no shared_context, não aconteceu."*

---

## 5. Preparing for Downstream

O DNA Mental será consumido por:
- **Z3 Engineer** → Para escrever o prompt
- **Z4 Auditor** → Para validar comportamento

### Checklist antes do Handoff
- [ ] Crenças centrais são testáveis?
- [ ] Princípios de decisão são IF/THEN claros?
- [ ] Style guide tem exemplos concretos?
- [ ] Vieses estão documentados para Z4 testar?

---

## 📚 Referências
- [Framework: 01_Visao_Geral.md](../../Conteudo_sintetizado/Framework_Multiagentes_EximIA/01_Visao_Geral.md)
- [Framework: 05_Fluxos_de_Comunicacao.md](../../Conteudo_sintetizado/Framework_Multiagentes_EximIA/05_Fluxos_de_Comunicacao.md)
- [Shared Protocols: handoff_protocol.md](../shared_protocols/handoff_protocol.md)
