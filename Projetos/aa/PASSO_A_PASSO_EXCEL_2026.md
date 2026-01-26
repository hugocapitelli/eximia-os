# 📋 PASSO A PASSO: Criar Layout 2026 na Planilha Massas Lott

## 🎯 OBJETIVO
Criar uma aba com o planejamento financeiro de 2026 baseada na estrutura de 2025 (aba "I").

---

## ✅ MÉTODO MAIS FÁCIL: Duplicar a Aba

### PASSO 1: Abrir a Planilha
- Abra o arquivo: `Planejamento Financeiro_Massas Lott_2024_V20 (version Final) Dezembro 2025.xlsx`

### PASSO 2: Duplicar a Aba "I"
1. Localize a aba **"I"** na parte inferior da planilha
2. **Clique com o botão direito** do mouse sobre a aba "I"
3. No menu que aparecer, clique em **"Mover ou Copiar..."**
4. Na janela que abrir:
   - Marque a caixinha **"Criar uma cópia"** ✅
   - Em "Antes da planilha:", escolha onde quer colocar (pode deixar como está)
   - Clique em **OK**

### PASSO 3: Renomear a Nova Aba
1. A nova aba será criada com nome "I (2)"
2. **Clique com botão direito** nessa nova aba
3. Clique em **"Renomear"**
4. Digite: **"I 2026"** ou **"Orçamento 2026"**
5. Pressione **Enter**

### PASSO 4: Ajustar as Datas do Cabeçalho
1. **Clique** na aba "I 2026" (a que você acabou de criar)
2. Na **primeira linha** (linha de datas), altere:
   - Célula B1: `jan/2025` → `jan/2026`
   - Célula C1: `fev/2025` → `fev/2026`
   - Célula D1: `mar/2025` → `mar/2026`
   - Continue para todos os meses até dezembro/2026
   
   **OU** (mais rápido):
   - Digite `jan/2026` na célula B1
   - Arraste o cantinho inferior direito da célula até M1
   - Excel preenche automaticamente os meses

### PASSO 5: Limpar os Dados Antigos (Opcional)
1. **Selecione** as células com valores (linhas 2 em diante, colunas B até M)
2. Pressione **Delete** para limpar
3. **Mantenha** as fórmulas (não delete se tiver =)

### PASSO 6: Validar
1. Clique em **algumas células aleatórias**
2. Olhe na **barra de fórmulas** (parte superior do Excel)
3. Verifique se as fórmulas fazem sentido:
   - Se a célula está na coluna B, deve referenciar outras células da coluna B ou A
   - Se está na coluna C, deve referenciar C ou B
   - E assim por diante

### PASSO 7: Salvar
1. **Ctrl+S** ou **File → Save**
2. ✅ **PRONTO!**

---

## 🔄 MÉTODO ALTERNATIVO: Copiar Célula por Célula

**Use este método SOMENTE se o método acima não funcionar.**

### PASSO 1: Criar Nova Estrutura
1. Crie uma nova aba (botão **+** ao lado das abas)
2. Renomeie para "I 2026"
3. Copie o cabeçalho da aba "I" (primeira linha com categorias)

### PASSO 2: Copiar Fórmulas Coluna por Coluna
Para cada coluna de dados (janeiro, fevereiro, etc.):

1. **Selecione** a coluna inteira na aba "I" (clique na letra da coluna, ex: "B")
2. **Ctrl+C** (copiar)
3. **Vá** para a aba "I 2026"
4. **Clique** na mesma letra de coluna
5. **Ctrl+V** (colar)
6. Repita para todas as colunas de dados

### PASSO 3: Ajustar Datas e Validar
- Mesmos passos 4, 5, 6 e 7 do método anterior

---

## 📘 ENTENDENDO REFERÊNCIAS NO EXCEL

### Referência Relativa (Normal): `A1`
- **Muda automaticamente** ao copiar
- Se copiar `=A1+B1` da célula C1 para C2
- Vira `=A2+B2` automaticamente
- **Isso é o que queremos!**

### Referência Absoluta (com $): `$A$1`
- **NÃO muda** ao copiar
- Se copiar `=$A$1+B1` para qualquer lugar
- Mantém `=$A$1+...`
- Usado quando você quer referenciar uma célula fixa

**DICA**: O Excel ajusta automaticamente as referências relativas quando você:
- Duplica a aba inteira ✅
- Usa Ctrl+C e Ctrl+V ✅
- Arrasta com o mouse ✅

---

## ⚠️ PROBLEMAS COMUNS E SOLUÇÕES

### Problema 1: Aparecem erros `#REF!`
**Causa**: A fórmula referenciava algo que foi deletado  
**Solução**: Desfaça (Ctrl+Z) e tente novamente sem deletar a estrutura original

### Problema 2: Os valores não mudam quando altero os dados
**Causa**: Pode ter copiado apenas valores, não fórmulas  
**Solução**: 
1. Volte e copie novamente
2. Ao colar, use **Ctrl+Alt+V** (Colar Especial)
3. Escolha **"Fórmulas"**
4. Clique OK

### Problema 3: As fórmulas não ajustam ao copiar
**Causa**: Podem ter referências absolutas ($)  
**Solução**: Normal! Algumas fórmulas têm $ de propósito (para travar referência)

---

## 📞 CHECKLIST FINAL

Antes de entregar, confira se:

- [ ] A aba "I 2026" está criada
- [ ] As datas no cabeçalho mostram 2026 (jan/2026, fev/2026, etc.)
- [ ] Testou uma célula aleatória e a fórmula faz sentido
- [ ] Não tem erros tipo `#REF!`, `#VALUE!` ou `#DIV/0!`
- [ ] Salvou o arquivo (Ctrl+S)

---

## 💡 RESUMO DE 30 SEGUNDOS

1. Botão direito na aba "I"
2. "Mover ou Copiar" → Marcar "Criar cópia"
3. Renomear para "I 2026"
4. Trocar datas: 2025 → 2026
5. Pronto! ✅

**Tempo estimado**: 5 minutos

---

## ❓ E AS OUTRAS ABAS (DRE, BD, etc.)? 

### Boa Notícia! ✅

A aba **"I"** (base para 2026) **NÃO possui referências cruzadas críticas** com outras abas como DRE, BD, etc.

Isso significa que:
- ✅ Você pode duplicar a aba "I" tranquilamente
- ✅ Não precisa se preocupar com referências quebradas
- ✅ A nova aba "I 2026" vai funcionar de forma independente

### O Que Isso Significa?

Quando você duplicar a aba "I" para "I 2026":
- A nova aba terá suas próprias fórmulas
- As fórmulas já vão estar ajustadas automaticamente
- **Não vai afetar** os dados de 2025 que estão na aba "I" original
- **Não vai quebrar** nenhum cálculo em outras abas (DRE, BD, etc.)

### ⚠️ Importante!

Se você precisar criar **DREs ou outros relatórios para 2026** que dependem da aba "I 2026":
1. Primeiro crie a aba "I 2026" (seguindo este passo a passo)
2. Depois, **manualmente**, ajuste as fórmulas nas outras abas para referenciar "I 2026"
3. Ou crie novas versões dessas abas para 2026

**Mas para criar o layout básico de 2026, você está segura!** 👍

---

## 🤖 ALTERNATIVA: Script Automático

Se você tiver Python instalado, existe um script que faz isso automaticamente!

Execute: `py criar_layout_2026.py`

O script vai:
- Criar backup automático
- Duplicar a aba "I"
- Renomear para "I 2026"
- Ajustar todas as datas para 2026
- Salvar o arquivo

**Ainda mais rápido!** ⚡
