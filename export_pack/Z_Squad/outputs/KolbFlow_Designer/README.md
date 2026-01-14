# KolbFlow Designer — Guia de Uso

<div align="center">

**Especialista em Design Instrucional baseado no Ciclo de Kolb**

[![Class](https://img.shields.io/badge/Class-1%20TACTICAL-green)]()
[![Version](https://img.shields.io/badge/Version-1.0.0-blue)]()
[![Z Squad](https://img.shields.io/badge/Z%20Squad-Compliant-purple)]()

</div>

---

## 🎯 O que é?

O **KolbFlow Designer** é um agente especializado em transformar qualquer tema em um programa de treinamento estruturado que percorre obrigatoriamente as 4 etapas do Ciclo de Kolb:

```
EC → OR → CA → EA
│     │     │     │
▼     ▼     ▼     ▼
Experiência → Reflexão → Conceituação → Experimentação
```

Isso garante que **todos os estilos de aprendizagem** sejam atendidos:
- **Divergentes** (sentem + observam)
- **Assimiladores** (pensam + observam)  
- **Convergentes** (pensam + fazem)
- **Acomodadores** (sentem + fazem)

---

## 🚀 Como Usar

### 1. Carregar o Agente

Copie o conteúdo de `agente_core.md` e cole como **System Prompt** no seu LLM (Claude, GPT, Gemini).

### 2. Fornecer Input

Informe ao agente:
- **Tema** do treinamento
- **Público-alvo**
- **Duração** disponível

**Exemplo mínimo:**
```
Crie um workshop de 4 horas sobre "Comunicação Não-Violenta" para líderes.
```

**Exemplo completo:**
```json
{
  "tema": "Comunicação Não-Violenta",
  "publico_alvo": "Líderes de equipe (5-15 pessoas)",
  "duracao_minutos": 240,
  "contexto_organizacional": "Empresa de tecnologia com conflitos entre squads",
  "recursos_disponiveis": ["Flipchart", "Projetor", "Sala ampla"],
  "objetivos_aprendizagem": [
    "Identificar padrões de comunicação violenta",
    "Aplicar os 4 passos da CNV"
  ]
}
```

### 3. Receber Output

O agente retornará um **roteiro estruturado** com:
- ⏱️ Tempo estimado por etapa
- 🎯 Atividades específicas para cada fase
- 📋 Materiais necessários
- 📊 Métricas de avaliação

---

## 📂 Estrutura de Arquivos

```
KolbFlow_Designer/
├── README.md               # Este arquivo
├── agente_core.md          # Prompt operacional (copiar para LLM)
├── input_schema.json       # Schema para automações/integrações
├── output_schema.json      # Schema de resposta
└── knowledge_base/
    ├── kolb_definitions.md # Teoria resumida
    ├── activity_matrix.csv # Banco de 40+ atividades
    └── evaluation_guide.md # Guia de avaliação
```

---

## 💡 Exemplos Rápidos

### Soft Skills
```
Input: "Workshop de 4h sobre Feedback Construtivo para gestores"
```

### Técnico
```
Input: "Treinamento de 2h sobre Git/GitHub para desenvolvedores júnior"
```

### Onboarding
```
Input: "Onboarding de 1 dia para novos vendedores da loja física"
```

---

## ⚠️ Limitações

O agente **NÃO**:
- Executa treinamentos (apenas projeta)
- Cria materiais visuais (slides, vídeos)
- Avalia participantes diretamente

---

## 🔗 Referências

- Kolb, D. A. (1984). *Experiential Learning*
- Kolb, D. A. (2015). *Experiential Learning: Experience as the Source of Learning and Development*
- Z Squad Pipeline v5.0

---

**Criado por:** Z Squad | eximIA.AI © 2026
