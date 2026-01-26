# Prompts Otimizados v3 — Teste Imediato

## 🎯 Objetivo: Atingir 2.500+ palavras (95%+ do Claude)

Baseado na análise v2, estes prompts combinam as 3 melhores estratégias:
- **B:** Temperature tuning (1.0)
- **C:** Per-section word minimums
- **D:** Few-shot com exemplo Claude

---

## ⚡ TESTE RÁPIDO — Prompt Único Otimizado

Cole este prompt para reprocessar Naval Ravikant:

```
CONFIGURAÇÕES CRÍTICAS (se usando API Gemini):
{
  "temperature": 1.0,
  "top_p": 0.95,
  "top_k": 64,
  "max_output_tokens": 8192
}

==============================================
BOOK PROCESSOR v3.0 — MAXIMUM DENSITY MODE
==============================================

VOCÊ É: Um especialista em síntese profunda de livros de negócios e filosofia.

TAREFA: Processar "O Almanaque de Naval Ravikant" gerando deep synthesis de ALTA DENSIDADE.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BENCHMARKS OBRIGATÓRIOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ TOTAL: Mínimo 2.600 palavras (NÃO caracteres, PALAVRAS)
✅ Cada seção tem MÍNIMO de palavras especificado abaixo
✅ Frameworks: 8-10, cada um 200+ palavras
✅ Profundidade: Cada parágrafo = insight + exemplo + conexão

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXEMPLO DE QUALIDADE ESPERADA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Aqui está um exemplo de framework BEM documentado:

### Framework 2: Os Quatro Pilares da Criação de Riqueza

**Fórmula Visual:**
┌─────────────────────────────────────────────┐
│  Conhecimento Específico × Alavancagem      │
│  × Accountability → Equity/Propriedade      │
└─────────────────────────────────────────────┘

#### Pilar 1: Conhecimento Específico

**Definição:** Conhecimento que não pode ser ensinado em escolas ou treinamento — é descoberto seguindo sua curiosidade genuína e talentos naturais.

**Características:**
- Parece brincadeira para você, mas trabalho para os outros
- Está na fronteira do conhecimento
- Combina seu DNA único, criação e experiências
- Não pode ser terceirizado ou automatizado (ainda)

**Como identificar o seu:**
1. O que você discute obsessivamente em jantares?
2. O que você lê pelo prazer de ler?
3. O que você faria de graça se dinheiro não fosse problema?
4. O que parece fácil para você mas impressiona os outros?

**Conexão com teoria:** O conceito de "specific knowledge" de Naval conecta-se com a teoria de "Comparative Advantage" de David Ricardo — seu conhecimento específico é sua vantagem comparativa pessoal na economia global.

[...continua por mais 400 palavras cobrindo os 4 pilares...]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INSTRUÇÕES DE GERAÇÃO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Gere o Deep Synthesis seguindo esta estrutura EXATA:

┌─────────────────────────────────────────────┐
│ SEÇÃO 1: VISÃO GERAL                        │
│ Mínimo: 350 palavras                        │
└─────────────────────────────────────────────┘

Inclua:
- Contexto histórico do livro (quando foi publicado, por que, contexto da época)
- Credenciais detalhadas do autor (quem é Naval, AngelList, investimentos, influência)
- Audiência-alvo (quem deve ler, quem não deve)
- Tom e estilo (aforístico, denso, filosófico)
- Estrutura do livro (2 partes: Riqueza e Felicidade)

⚠️ PARE aqui e conte as palavras. Se < 350, EXPANDA até atingir.

┌─────────────────────────────────────────────┐
│ SEÇÃO 2: PROBLEMA QUE O LIVRO RESOLVE       │
│ Mínimo: 400 palavras                        │
└─────────────────────────────────────────────┘

Explique EM DETALHE:
- Qual paradigma obsoleto sobre riqueza o livro desafia (trocar tempo por dinheiro)
- Qual paradigma sobre felicidade (felicidade futura vs presente)
- Por que isso é relevante AGORA (era da informação, creator economy)
- Quem sofre deste problema (trabalhadores do conhecimento, empreendedores presos)
- Exemplos concretos de pessoas presas nesses paradigmas

⚠️ PARE e conte. Se < 400, EXPANDA.

┌─────────────────────────────────────────────┐
│ SEÇÃO 3: TESE CENTRAL                       │
│ Mínimo: 500 palavras                        │
└─────────────────────────────────────────────┘

Desenvolva:
- Resumo da tese em 1 frase
- Desdobramento da tese (como riqueza E felicidade são habilidades)
- Evidências que Naval apresenta (exemplos do livro)
- Como a tese integra os dois domínios (material e espiritual)
- Por que isso é contra-intuitivo
- Contra-argumentos potenciais mencionados

⚠️ PARE e conte. Se < 500, EXPANDA.

┌─────────────────────────────────────────────┐
│ SEÇÃO 4: FRAMEWORKS PRINCIPAIS              │
│ Mínimo: 10 frameworks × 200 palavras cada   │
│ Total desta seção: 2000+ palavras           │
└─────────────────────────────────────────────┘

Para CADA um dos 10 frameworks, use o mesmo nível de detalhe do EXEMPLO acima:

Framework 1: The Wealth Equation
Framework 2: Specific Knowledge (expanda MUITO este)
Framework 3: Leverage (código/mídia/capital/trabalho)
Framework 4: Accountability
Framework 5: The Happiness Equation
Framework 6: Desire Management
Framework 7: Long-term Games
Framework 8: Principal-Agent Problem
Framework 9: Reading Framework
Framework 10: Meditation Practice

Para CADA framework:
- Nome e origem
- Definição completa (100+ palavras)
- Componentes/partes
- Como aplicar (passo a passo)
- 2-3 exemplos concretos do livro
- Diagrama ASCII se aplicável
- Conexão com teoria econômica/psicológica

⚠️ ESTE É O CORE. Não economize aqui. Mínimo 200 palavras POR framework.

┌─────────────────────────────────────────────┐
│ SEÇÃO 5: ANÁLISE CRÍTICA                    │
│ Mínimo: 600 palavras                        │
└─────────────────────────────────────────────┘

**Pontos Fortes (300 palavras):**
Liste 4-5 pontos COM justificativa detalhada:
1. Densidade de insight — Por quê? Exemplos?
2. Pragmatismo filosófico — Como isso se manifesta?
3. Atualidade — Por que é relevante para era digital?
4. Integração material-espiritual — Como resolve tensão?

**Limitações (300 palavras):**
Liste 4-5 críticas ESPECÍFICAS:
1. Viés de sobrevivência — Como isso afeta conselhos?
2. Contexto de privilégio — Quais suposições?
3. Elitismo intelectual — Quem fica de fora?
4. Falta de sistema passo-a-passo — Por que isso importa?
5. Generalização excessiva — Exemplos?

⚠️ Cada ponto deve ter 60-80 palavras de desenvolvimento.

┌─────────────────────────────────────────────┐
│ SEÇÃO 6: COMPARAÇÃO COM OBRAS               │
│ Mínimo: 500 palavras                        │
└─────────────────────────────────────────────┘

Tabela comparando com 5 livros:
| Livro | Autor | Similaridade | Diferença |
|-------|-------|--------------|-----------|
| Antifrágil | Taleb | ... | ... |
| Pai Rico Pai Pobre | Kiyosaki | ... | ... |
| Principles | Dalio | ... | ... |
| Zero to One | Thiel | ... | ... |
| Tao Te Ching | Lao Tzu | ... | ... |

APÓS a tabela, escreva 100 palavras analisando CADA livro (500 palavras total).

┌─────────────────────────────────────────────┐
│ SEÇÃO 7: PLANO DE APLICAÇÃO PRÁTICA         │
│ Mínimo: 400 palavras                        │
└─────────────────────────────────────────────┘

Roadmap detalhado:
**Semana 1-2:** (100 palavras) — Ações específicas
**Mês 1:** (100 palavras) — Ações específicas
**Mês 2-3:** (100 palavras) — Ações específicas
**Mês 4-6:** (100 palavras) — Ações específicas

Cada fase deve ter 3-5 ações CONCRETAS, não vagas.

┌─────────────────────────────────────────────┐
│ SEÇÃO 8: CITAÇÕES MEMORÁVEIS                │
│ Mínimo: 12 citações                         │
└─────────────────────────────────────────────┘

> "Citação 1"
> "Citação 2"
[...12 total]

┌─────────────────────────────────────────────┐
│ SEÇÃO 9: RESUMO VISUAL                      │
│ Diagrama mermaid complexo                   │
└─────────────────────────────────────────────┘

```mermaid
graph TB
    [Diagrama mostrando conexões entre conceitos principais]
```

┌─────────────────────────────────────────────┐
│ SEÇÃO 10: VEREDICTO FINAL                   │
│ Mínimo: 200 palavras                        │
└─────────────────────────────────────────────┘

- Para quem é (3-4 perfis específicos)
- Para quem NÃO é (3-4 perfis específicos)
- Nota (X/5) com justificativa detalhada (100 palavras)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERIFICAÇÃO FINAL OBRIGATÓRIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Antes de considerar completo, CHEQUE:

[ ] Total de palavras >= 2.600?
[ ] Seção 1 >= 350 palavras?
[ ] Seção 2 >= 400 palavras?
[ ] Seção 3 >= 500 palavras?
[ ] Seção 4 tem 10 frameworks × 200 palavras?
[ ] Seção 5 >= 600 palavras?
[ ] Seção 6 >= 500 palavras?
[ ] Seção 7 >= 400 palavras?
[ ] Seção 10 >= 200 palavras?
[ ] 12 citações presentes?
[ ] Diagrama mermaid presente?

Se QUALQUER checklist for falsa, VOLTE e expanda a seção correspondente.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GERE AGORA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 📊 Expectativa de Resultados

**Com este prompt você deve atingir:**
- ✅ 2.500-3.000 palavras (95-115% do Claude)
- ✅ 10 frameworks detalhados
- ✅ Densidade comparável ao Claude

**Se atingir < 2.500 palavras:**
→ Vá para Plan B: Multi-pass completo (próximo arquivo)

---

## 🔧 Como Usar

### Se usando Gemini via API:
```python
import google.generativeai as genai

genai.configure(api_key="YOUR_KEY")

generation_config = {
    "temperature": 1.0,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
}

model = genai.GenerativeModel(
    model_name="gemini-2.0-flash-exp",
    generation_config=generation_config
)

with open("prompt_v3.txt", "r") as f:
    prompt = f.read()

response = model.generate_content(prompt)
print(response.text)
```

### Se usando Gemini via web:
1. Abra https://aistudio.google.com/
2. Clique em "Advanced settings"
3. Defina: Temperature=1.0, Top-P=0.95, Max tokens=8192
4. Cole o prompt acima
5. Aguarde 5-10 minutos

---

## 📏 Como Medir Sucesso

Após gerar, execute:
```powershell
(Get-Content "deep_synthesis_v3.md" | Measure-Object -Word).Words
```

**Meta:** >= 2.500 palavras

Se atingir, PARABÉNS! Problema resolvido.
Se não, vá para multi_pass_prompts.md (próximo passo).
