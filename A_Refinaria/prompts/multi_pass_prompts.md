# Multi-Pass Prompts (Plan B) — Se v3 Não Atingir 2.500 palavras

## Quando Usar

Se o prompt_v3_optimized.md gerou < 2.500 palavras, use esta abordagem.

**Estratégia:** Dividir em 12 calls especializados para máxima densidade.

---

## Pass 1: Listar Frameworks (1 call)

```
Leia "O Almanaque de Naval Ravikant" e liste TODOS os frameworks, metodologias, modelos e conceitos principais mencionados.

FORMATO:
1. [Nome do Framework] - [Breve descrição 1 linha] - [Onde aparece no livro]

MÍNIMO: 15 frameworks/conceitos

APENAS LISTE, NÃO EXPANDA.
```

**Output esperado:** Lista de 15-20 frameworks

---

## Pass 2-11: Expandir Cada Framework (10 calls)

Para CADA um dos 10 frameworks principais da lista, cole este prompt:

```
Você é um especialista em [FRAMEWORK_NAME] do livro "O Almanaque de Naval Ravikant".

TAREFA: Documente este framework em PROFUNDIDADE MÁXIMA.

ESTRUTURA OBRIGATÓRIA (mínimo 250 palavras):

### [Nome do Framework]

**1. DEFINIÇÃO COMPLETA (100+ palavras)**
Explique o que é este framework de forma detalhada.
Use analogias, metáforas e exemplos.

**2. ORIGEM E CONTEXTO (50 palavras)**
Onde Naval menciona isso no livro?
Por que ele desenvolveu este framework?

**3. COMPONENTES/PARTES (80+ palavras)**
Liste e explique cada elemento:
- Componente 1: [explicação]
- Componente 2: [explicação]
...

**4. COMO APLICAR NA PRÁTICA (100+ palavras)**
Passo a passo CONCRETO:
1. [Ação específica]
2. [Ação específica]
...

**5. EXEMPLOS DO LIVRO (80+ palavras)**
Cite 2-3 exemplos ESPECÍFICOS que Naval usa:
- Exemplo 1: [história completa]
- Exemplo 2: [caso concreto]

**6. DIAGRAMA/VISUALIZAÇÃO**
```
[ASCII art ou descrição de diagrama]
```

**7. CONEXÕES TEÓRICAS (50+ palavras)**
Como este framework se conecta com:
- Economia (ex: Ricardo, Adam Smith)
- Psicologia (ex: Kahneman, Csikszentmihalyi)
- Filosofia (ex: Estoicismo, Budismo)

**8. ARMADILHAS COMUNS (50+ palavras)**
O que as pessoas erram ao aplicar este framework?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL ESPERADO: 500-600 palavras
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GERE AGORA para o framework: [COLE O NOME AQUI]
```

**Repetir para:**
1. Specific Knowledge
2. Leverage (código/mídia/capital)
3. Accountability
4. Wealth Equation
5. Happiness Equation
6. Desire Management
7. Long-term Games
8. Reading Framework
9. Meditation Practice
10. Principal-Agent Problem

**Output de cada call:** 500-600 palavras × 10 = 5.000-6.000 palavras de frameworks

---

## Pass 12: Compilação Final (1 call)

```
RECEBIDO DAS PASSES ANTERIORES:

FRAMEWORK 1:
[COLE TEXTO DO FRAMEWORK 1 EXPANDIDO]

FRAMEWORK 2:
[COLE TEXTO DO FRAMEWORK 2 EXPANDIDO]

[...cole todos os 10...]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TAREFA: Compile o Deep Synthesis COMPLETO usando os frameworks acima.

ESTRUTURA:

# O Almanaque de Naval Ravikant
## Deep Synthesis v3 (Multi-Pass)

### 📖 Visão Geral (350 palavras)
[Escreva contexto, autor, audiência, tom]

### 🎯 Problema que Resolve (400 palavras)  
[Escreva paradigmas que o livro desafia]

### 💡 Tese Central (500 palavras)
[Desdobramento da tese central]

### ⚙️ Frameworks Principais
[COLE TODOS OS 10 FRAMEWORKS EXPANDIDOS AQUI - SEM MODIFICAR]

### 🔍 Análise Crítica (600 palavras)
**Pontos Fortes:**
1. [ponto + justificativa 80 palavras]
2. [ponto + justificativa 80 palavras]
3. [ponto + justificativa 80 palavras]
4. [ponto + justificativa 80 palavras]

**Limitações:**
1. Viés de sobrevivência — [explicação 60 palavras]
2. Contexto de privilégio — [explicação 60 palavras]
3. Elitismo — [explicação 60 palavras]
4. Falta de sistema linear — [explicação 60 palavras]
5. Generalização — [explicação 60 palavras]

### 📚 Comparação com Obras (500 palavras)
[Tabela + análise de 5 livros]

### 🚀 Plano Prático (400 palavras)
[Roadmap em 4 fases]

### 💬 Citações (12+)
> "..."
[12 citações]

### 📊 Resumo Visual
```mermaid
[diagrama]
```

### 🎯 Veredicto (200 palavras)
[Para quem é, para quem não é, nota]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERIFICAÇÃO:
Total esperado: 5.000-7.000 palavras
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Output esperado:** Deep synthesis de 5.000-7.000 palavras (190-270% do Claude)

---

## 📊 Resumo do Multi-Pass

| Pass | Tarefa | Palavras | Tempo |
|------|--------|----------|-------|
| 1 | Listar frameworks | - | 2 min |
| 2-11 | Expandir cada framework | 500-600 cada | 5 min × 10 = 50 min |
| 12 | Compilar synthesis | 2.000 próprias + 5.000 coladas | 10 min |
| **Total** | | **7.000-8.000** | **~60 min** |

---

## 🎯 Quando Usar Este Approach

✅ **Use multi-pass SE:**
- prompt_v3_optimized gerou < 2.500 palavras
- Você tem 1 hora disponível
- Quer GARANTIR qualidade máxima (>100% Claude)

❌ **Não use SE:**
- prompt_v3_optimized já funcionou (>= 2.500 palavras)
- Você quer resultado rápido
- Está testando/explorando apenas

---

## 💡 Benefícios do Multi-Pass

1. **Impossível pular frameworks** — Cada um tem call dedicada
2. **Profundidade garantida** — Mínimo 500 palavras forçado por framework
3. **Qualidade superior** — LLM focado em UMA tarefa por vez
4. **Escalável** — Fácil adicionar mais frameworks
5. **Debugging** — Se um framework for ruim, só refaz aquele call

---

## 🔧 Script Python para Automatizar (Opcional)

```python
import google.generativeai as genai
import time

genai.configure(api_key="YOUR_KEY")

generation_config = {
    "temperature": 1.0,
    "top_p": 0.95,
    "max_output_tokens": 8192,
}

model = genai.GenerativeModel(
    model_name="gemini-2.0-flash-exp",
    generation_config=generation_config
)

frameworks = [
    "Specific Knowledge",
    "Leverage",
    "Accountability",
    # ...adicione todos os 10
]

expanded_frameworks = []

for fw in frameworks:
    prompt = f"""
    Você é especialista em {fw} do Almanaque de Naval Ravikant.
    [COLE O TEMPLATE DE EXPANSÃO AQUI]
    """
    
    response = model.generate_content(prompt)
    expanded_frameworks.append(response.text)
    print(f"✅ {fw} expandido ({len(response.text.split())} palavras)")
    time.sleep(2)  # Rate limiting

# Pass 12: Compilação
compilation_prompt = f"""
FRAMEWORKS EXPANDIDOS:
{chr(10).join(expanded_frameworks)}

[COLE O PROMPT DE COMPILAÇÃO AQUI]
"""

final_synthesis = model.generate_content(compilation_prompt)
with open("deep_synthesis_v3_multipass.md", "w") as f:
    f.write(final_synthesis.text)

print(f"✅ Synthesis completo: {len(final_synthesis.text.split())} palavras")
```

---

**Próximo:** Se mesmo multi-pass < 2.500 palavras → Considerar local LLM (Qwen2.5 72B)
