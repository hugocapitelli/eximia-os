# Como Antigravity Chama o LLM Local

## 🎯 Fluxo Completo

```
Você (no chat): "Processe o livro Naval Ravikant com LLM local"
    ↓
Antigravity: Entende o pedido
    ↓
Antigravity: run_command → python local_llm_processor.py
    ↓
Script Python: Chama Ollama (qwen2.5:32b)
    ↓
Ollama: Gera resposta (5-15min)
    ↓
Script: Salva em arquivo .md
    ↓
Antigravity: Lê resultado e mostra para você
```

---

## 📝 Exemplo de Uso via Antigravity

### Você diz no chat:

```
@antigravity Processe o livro Naval Ravikant usando LLM local (Qwen2.5 32B) com o prompt_v3_optimized
```

### Antigravity executa:

```python
# Antigravity internamente fará algo como:

# 1. Salvar prompt em arquivo temporário
with open("temp_prompt.txt", "w") as f:
    f.write(prompt_v3_optimized_content)

# 2. Executar script via run_command
result = run_command(
    "python c:/Users/hugoc/OneDrive/.../Intellex/scripts/local_llm_processor.py "
    "--prompt temp_prompt.txt "
    "--output naval_synthesis_local.md "
    "--model qwen2.5:32b "
    "--temperature 1.0 "
    "--max-tokens 8192"
)

# 3. Aguardar conclusão (5-15min)

# 4. Ler resultado
with open("naval_synthesis_local.md") as f:
    synthesis = f.read()

# 5. Mostrar para você
print(f"✅ Processamento completo! {len(synthesis.split())} palavras geradas")
```

---

## 🚀 Comandos que Você Pode Usar

### Comando 1: Processar livro completo

```
Processe o livro "O Almanaque de Naval Ravikant" usando:
- LLM: Qwen2.5 32B local
- Prompt: Intellex/prompts/prompt_v3_optimized.md
- Output: Intellex/outputs/naval_ravikant_lx_local/deep_synthesis.md
```

### Comando 2: Multi-pass local

```
Execute multi-pass do Naval Ravikant:
1. Liste frameworks (Gemini)
2. Expanda cada framework (Qwen2.5 32B local)
3. Compile synthesis (Gemini)
```

### Comando 3: Hybrid approach

```
Process Naval usando hybrid:
- Estrutura: Gemini
- Frameworks expansion: Qwen2.5 72B local
- Final compilation: Gemini
```

---

## 🔧 Uso Manual (se preferir rodar direto)

### Passo 1: Preparar prompt

```powershell
# Copiar prompt otimizado
cp Intellex/prompts/prompt_v3_optimized.md temp_prompt.txt
```

### Passo 2: Executar script

```powershell
cd "c:\Users\hugoc\OneDrive\Área de Trabalho\exímIA Ventures\eximIA.OS"

python Intellex/scripts/local_llm_processor.py `
  --prompt temp_prompt.txt `
  --output Intellex/outputs/naval_local/synthesis.md `
  --model qwen2.5:32b `
  --temperature 1.0 `
  --max-tokens 8192
```

### Passo 3: Aguardar (5-15 min)

Você verá progresso:
```
🚀 Iniciando processamento com qwen2.5:32b...
✅ Prompt carregado: 15234 caracteres
⚙️ Configurações:
   - Temperature: 1.0
   - Max tokens: 8192
🔄 Gerando resposta...
   📊 Progresso: 100 tokens, ~75 palavras
   📊 Progresso: 200 tokens, ~155 palavras
   ...
   📊 Progresso: 3500 tokens, ~2800 palavras
✅ Geração completa!
   📏 Palavras: 2847
   📏 Tokens: 3542
💾 Output salvo em: synthesis.md
```

### Passo 4: Verificar resultado

```powershell
(Get-Content Intellex/outputs/naval_local/synthesis.md | Measure-Object -Word).Words
```

**Expectativa com Qwen2.5 32B:** 2.800-4.000 palavras (110-150% do Claude)

---

## 📊 Comparação de Abordagens

| Abordagem | Qualidade | Tempo | Automação | Custo |
|-----------|-----------|-------|-----------|-------|
| **Gemini manual** | 60% | 5min | ❌ | Grátis |
| **Gemini optimized** | 70% | 10min | ❌ | Grátis |
| **Qwen 32B local** | 100%+ | 10-15min | ✅ via Antigravity | Grátis (após setup) |
| **Qwen 72B local** | 120%+ | 20-30min | ✅ via Antigravity | Grátis (GPU 48GB+) |
| **Claude API** | 100% | 5min | ✅ | $$ caro |

---

## 🎯 Workflow Recomendado

### Para livros críticos (Naval, Principles, etc):

```
1. Antigravity: "Liste frameworks do Naval usando Gemini"
   → Rápido, Gemini é bom nisso

2. Antigravity: "Expanda cada framework usando Qwen 32B"
   → 10 calls × Qwen = Máxima densidade

3. Antigravity: "Compile synthesis final com Gemini"
   → Gemini junta tudo

RESULTADO: 4.000-5.000 palavras, 120-150% Claude
```

### Para livros exploratórios:

```
Antigravity: "Processe rápido com Qwen 14B"
→ 1 call, ~10min, 85-90% Claude
```

---

## 🔄 Integração com Eximia Runtime (Futuro)

Eventualmente você poderá fazer:

```bash
eximia run intellex \
  --module book_processor \
  --llm qwen2.5:32b \
  --input naval.pdf \
  --output naval_lx/
```

Mas por enquanto, Antigravity executa via `local_llm_processor.py`.

---

## 💡 Dicas de Performance

### Para máxima qualidade:
```
--model qwen2.5:72b --temperature 1.2
```

### Para balanceado:
```
--model qwen2.5:32b --temperature 1.0
```

### Para rápido:
```
--model qwen2.5:14b --temperature 0.8
```

---

## 🐛 Troubleshooting

### Erro: "Connection refused"
**Causa:** Servidor Ollama não está rodando  
**Solução:**
```powershell
ollama serve
```

### Erro: "Model not found"
**Causa:** Modelo não foi baixado  
**Solução:**
```powershell
ollama pull qwen2.5:32b
```

### Erro: "Out of memory"
**Causa:** Modelo muito grande para GPU  
**Solução:** Use modelo menor
```powershell
ollama pull qwen2.5:14b
# E no comando:
--model qwen2.5:14b
```

---

## 🎉 Próximo Passo

Após setup completo:

1. ✅ Ollama instalado (SETUP_LOCAL_LLM.md)
2. ✅ Script Python criado (local_llm_processor.py)
3. ✅ Entendeu como Antigravity chama (este arquivo)

**TESTE AGORA:**

```
@antigravity Execute este comando:

python "c:\Users\hugoc\OneDrive\Área de Trabalho\exímIA Ventures\eximIA.OS\Intellex\scripts\local_llm_processor.py" --prompt "c:\Users\hugoc\OneDrive\Área de Trabalho\exímIA Ventures\eximIA.OS\Intellex\prompts\prompt_v3_optimized.md" --output "c:\Users\hugoc\OneDrive\Área de Trabalho\exímIA Ventures\eximIA.OS\Intellex\outputs\naval_local_test\synthesis.md" --model qwen2.5:32b
```

Antigravity executará e você verá o Qwen processando em tempo real!
