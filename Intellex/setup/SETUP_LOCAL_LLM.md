# Setup Local LLM (Qwen2.5) para Intellex

## 🎯 Objetivo

Instalar Qwen2.5 localmente e permitir que Antigravity chame automaticamente para processar livros.

---

## Passo 1: Instalar Ollama

### Windows (Recomendado)

1. **Download Ollama:**
   - Vá em: https://ollama.ai/download/windows
   - Baixe e instale `OllamaSetup.exe`

2. **Verificar instalação:**
```powershell
ollama --version
```

Deve mostrar: `ollama version X.X.X`

---

## Passo 2: Escolher e Baixar Modelo

### Opções de Modelos (escolha baseado no seu hardware)

| Modelo | VRAM Necessária | RAM | Qualidade | Velocidade |
|--------|-----------------|-----|-----------|------------|
| **qwen2.5:72b** | 48GB+ GPU | 96GB+ | ⭐⭐⭐⭐⭐ Melhor | 🐢 Lento |
| **qwen2.5:32b** | 24GB GPU | 48GB+ | ⭐⭐⭐⭐ Excelente | ⚡ Médio |
| **qwen2.5:14b** | 12GB GPU | 24GB+ | ⭐⭐⭐ Muito bom | ⚡⚡ Rápido |
| **qwen2.5:7b** | 8GB GPU | 16GB+ | ⭐⭐ Bom | ⚡⚡⚡ Muito rápido |

**Recomendação:** Se tem GPU boa, use **32b ou 72b**. Se não, use **14b**.

### Download do Modelo

```powershell
# Escolha UM destes comandos baseado no seu hardware:

# Para GPU 48GB+ (melhor qualidade)
ollama pull qwen2.5:72b

# Para GPU 24GB (balanceado) - RECOMENDADO
ollama pull qwen2.5:32b

# Para GPU 12GB (rápido)
ollama pull qwen2.5:14b

# Para CPU ou GPU 8GB (mais leve)
ollama pull qwen2.5:7b
```

**Tempo de download:** 10-60 minutos dependendo do modelo

---

## Passo 3: Testar o Modelo

```powershell
# Iniciar servidor Ollama (roda em background)
ollama serve

# Em outro terminal, testar:
ollama run qwen2.5:32b "Olá, você funciona?"
```

Se responder algo coerente, está funcionando! ✅

---

## ⚠️ VRAM vs RAM (O Que Acontece se Faltar GPU?)

**Dúvida Comum:** *"Tenho GPU de 8GB, posso rodar o de 32GB?"*

**Resposta:** **SIM, mas com penalidade de velocidade.**

Ollama usa uma tecnologia chamada **Offloading Inteligente**:
1. Ele enche a **VRAM** (Memória da Placa de Vídeo) até o limite.
2. O que sobrar, ele joga para a **RAM do Sistema** (CPU).
3. O processamento acontece dividido entre GPU e CPU.

### Impacto na Performance

| Cenário | Onde roda o modelo | Velocidade Estimada | Usabilidade |
|---------|--------------------|---------------------|-------------|
| **100% na GPU** | Cabe tudo na VRAM | **30-50 tokens/s** | ⚡ Instantâneo |
| **50% GPU / 50% CPU** | Metade na VRAM, metade RAM | **3-6 tokens/s** | 🐢 Lento, mas usável |
| **100% na CPU** | Nada na VRAM | **1-2 tokens/s** | 🐌 Muito lento |

**Exemplo Prático (Qwen 32B - aprox 20GB):**
- **RTX 3090 (24GB):** Cabe 100% ✅ (Super rápido)
- **RTX 3060 (12GB):** ~60% na GPU, 40% na RAM ⚠️ (Funciona, mas velocidade cai 80%)

### Solução: Quantização (Diminuir o modelo)
Se o modelo for pesado, use uma versão "comprimida" (quantizada). A perda de inteligência é mínima, mas o ganho de eficiência é enorme.

```powershell
# Qwen 32B Original (FP16) = ~60GB (Impossível para maioria)
# Qwen 32B Padrão do Ollama (Q4_0) = ~19GB (Cabe em GPUs top)
# Qwen 32B Comprimido (Q2_K) = ~12GB (Cabe em GPUs médias)
```

Para baixar versões menores, procure pelas tags no site do Ollama (ex: `qwen2.5:32b-q2_k`).

---

## Passo 4: Integração com Intellex

### 4.1 Instalar dependências Python

```powershell
pip install ollama requests
```

### 4.2 Verificar que Antigravity pode executar Python

O script que vou criar usa Python. Antigravity executará via `run_command`.

---

## Passo 5: Configuração Completa

Após seguir os passos acima, você terá:

✅ Ollama instalado e rodando
✅ Qwen2.5 baixado (tamanho escolhido)
✅ Servidor rodando em `http://localhost:11434`
✅ Pronto para Antigravity chamar via script Python

---

## 📊 Expectativas de Performance

### Qwen2.5 72B
- **Qualidade:** Pode SUPERAR Claude em densidade
- **Velocidade:** ~10-20 tokens/s (com GPU 48GB)
- **Uso:** Livros críticos, synthesis máxima

### Qwen2.5 32B
- **Qualidade:** Equivalente a Claude
- **Velocidade:** ~20-40 tokens/s (com GPU 24GB)
- **Uso:** Balanceado, recomendado

### Qwen2.5 14B
- **Qualidade:** 85-90% do Claude
- **Velocidade:** ~40-80 tokens/s (com GPU 12GB)
- **Uso:** Processamento rápido

---

## 🔧 Troubleshooting

### Erro: "ollama: command not found"
**Solução:** Reinicie o terminal após instalação ou adicione ao PATH:
```powershell
$env:Path += ";C:\Users\$env:USERNAME\AppData\Local\Programs\Ollama"
```

### Erro: "Out of memory"
**Solução:** Modelo muito grande para seu hardware. Baixe modelo menor:
```powershell
ollama pull qwen2.5:14b
```

### Erro: "Connection refused"
**Solução:** Servidor Ollama não está rodando. Execute:
```powershell
ollama serve
```

---

## 🚀 Próximos Passos

Após completar este setup:
1. ✅ Ollama instalado
2. ✅ Modelo baixado
3. ✅ Servidor rodando

**Vá para:** `local_llm_processor.py` (próximo arquivo)

Lá está o script que Antigravity executará para chamar o Qwen2.5 automaticamente.

---

## 📝 Configurações Avançadas (Opcional)

### Aumentar contexto máximo
```powershell
# Editar Modelfile para aumentar context window
ollama show qwen2.5:32b --modelfile > Modelfile
# Editar e adicionar: parameter num_ctx 16384
ollama create qwen2.5-extended -f Modelfile
```

### Quantização customizada (economizar VRAM)
```powershell
# Q4 (mais rápido, menos precisão)
ollama pull qwen2.5:32b-q4_K_M
```

---

## ⚡ Quick Start

**TL;DR - Cole estes comandos se tiver GPU 24GB+:**

```powershell
# 1. Download instalador Ollama de ollama.ai
# 2. Instalar
# 3. Rodar isto:

ollama serve
# (novo terminal)
ollama pull qwen2.5:32b
ollama run qwen2.5:32b "Teste"

# Se funciona, vá para local_llm_processor.py

---

## 🎯 Recomendação para SEU Hardware (16GB VRAM + 32GB RAM)

Com essa configuração, você está no "Sweet Spot" para rodar modelos de alta inteligência com velocidade aceitável.

### A Melhor Escolha: Qwen 2.5 32B (Quantização q4_K_M)
Este é o modelo que compete com o Claude Sonnet.

- **Tamanho do Modelo:** ~20GB.
- **Como vai rodar:**
  - **16GB** vão para sua GPU (VRAM) → Processamento Rápido.
  - **~4GB** vão para sua RAM → Processamento mais lento.
- **Resultado:** Você terá a inteligência máxima do 32B, rodando a uma velocidade mista (~8-12 tokens/segundo). É **perfeito** para processamento de livros onde qualidade importa mais que latência instantânea.

**Comando para baixar:**
```powershell
ollama run qwen2.5:32b
```
*(O Ollama baixa automaticamente a versão q4_0 ou q4_K_M que é ideal para você)*

### Alternativa Ultra-Rápida: Qwen 2.5 14B
Se você quiser velocidade extrema (ex: para chat em tempo real), use o 14B. Ele caberá 100% na sua VRAM.

**Comando:**
```powershell
ollama run qwen2.5:14b
```

```
