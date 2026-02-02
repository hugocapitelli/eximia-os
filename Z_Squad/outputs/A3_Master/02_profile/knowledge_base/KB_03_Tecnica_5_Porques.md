# KB_03: Técnica dos 5 Porquês Avançada

## Origem

A técnica dos 5 Porquês foi desenvolvida por Sakichi Toyoda, fundador da Toyota Industries. O método se tornou amplamente utilizado na Toyota Motor Corporation e continua sendo usado frequentemente até hoje.

É uma prática central no Lean e Kaizen, sendo uma das ferramentas mais simples porém poderosas para análise de causa raiz.

## O que é

Os 5 Porquês é uma técnica interrogativa iterativa usada para explorar relações de causa e efeito subjacentes a um problema particular. O objetivo principal é determinar a causa raiz de um defeito ou problema repetindo a pergunta "por quê?" cinco vezes, cada vez direcionando o "por quê" atual para a resposta do "por quê" anterior.

## Regras de Ouro

### 1. Comece com o EFEITO Claramente Definido
A primeira pergunta deve definir claramente o que aconteceu. A resposta deve focar em um fato observável.

### 2. Cada "Porquê" Deve Ser Verificável com Dados
Não aceite suposições. Cada resposta deve ser validável com evidências do Gemba.

### 3. NUNCA Termine com Pessoa como Causa
Se seu 5º Porquê responde "operador cometeu erro", você NÃO chegou à causa raiz - continue até encontrar um fator sistêmico que você pode mudar.

### 4. Termine em FATOR SISTÊMICO Modificável
A causa raiz deve ser algo que você pode mudar: design de dispositivo, lógica de software, padrão de trabalho, processo, sistema.

### 5. O Número "5" é Guia, Não Lei
Em alguns casos, você pode precisar perguntar "por quê?" mais de cinco vezes para problemas complexos. Inversamente, pode chegar à causa raiz antes de cinco iterações para problemas mais simples. Frequentemente leva de três a cinco porquês, mas pode levar mais!

## Validação Reversa

Após completar a análise, leia de BAIXO para CIMA usando "PORTANTO":

```
Causa 5 existe → PORTANTO → Causa 4 acontece
Causa 4 existe → PORTANTO → Causa 3 acontece
Causa 3 existe → PORTANTO → Causa 2 acontece
Causa 2 existe → PORTANTO → Causa 1 acontece
Causa 1 existe → PORTANTO → EFEITO ocorre
```

**Se a lógica quebrar em qualquer ponto, refaça a análise.**

## Armadilhas Comuns a Evitar

| Armadilha | Por que é Problema | Como Evitar |
|-----------|-------------------|-------------|
| Parar no sintoma | Não resolve raiz | Continuar até fator sistêmico |
| "Falta de treinamento" como causa final | É efeito, não causa | Perguntar "por que falta treinamento?" |
| Pular para soluções | Análise incompleta | Completar 5 porquês antes de contramedidas |
| Ignorar múltiplas cadeias | Deixa causas ocultas | Explorar todas as ramificações |
| Não validar no Gemba | Baseado em suposições | Verificar cada resposta com dados |

## Exemplo Comparativo

### RUIM (Para em Pessoa)

```
Problema: Houve atraso na entrega

P1: Por que houve atraso na entrega?
R: O operador demorou.

P2: Por que o operador demorou?
R: Ele é lento.

→ CAUSA: Operador ❌ (ERRADO - culpa pessoa)
```

### BOM (Chega a Sistema)

```
Problema: Houve atraso na entrega

P1: Por que houve atraso na entrega?
R: Material chegou fora do prazo.

P2: Por que material chegou fora do prazo?
R: Pedido foi feito com atraso.

P3: Por que pedido foi feito com atraso?
R: Não há gatilho automático de reposição.

P4: Por que não há gatilho automático?
R: Sistema não foi configurado.

P5: Por que sistema não foi configurado?
R: Não existe padrão de parametrização.

→ CAUSA: Falta de padrão de parametrização ✅ (CERTO - sistêmico)
```

## Quando Usar

### Ideal para:
- Problemas com causação linear clara
- Necessidade de solução rápida
- Equipe pequena e focada
- Troubleshooting e resolução de problemas
- Melhoria de qualidade

### Não Ideal para:
- Problemas com múltiplas variáveis complexas
- Situações que exigem validação empírica rigorosa
- Questões com interações sistêmicas intrincadas

## Limitações Reconhecidas

Teruyuki Minoura, ex-diretor executivo de compras globais da Toyota, criticou a técnica como "muito básica para analisar causas raiz na profundidade necessária para garantir que um problema seja corrigido."

Para problemas complexos, combine com:
- **Diagrama de Ishikawa** (6M)
- **Six Sigma** (DMAIC)
- **Análise de Pareto**

## Facilitação Efetiva

1. **Monte a equipe certa** - Pessoas com conhecimento direto do problema
2. **Defina problema claramente** - Um problema por análise
3. **Use dados reais** - Não suposições
4. **Designe facilitador** - Para guiar discussão
5. **Busque consenso** - Equipe deve concordar com cada resposta
6. **Documente** - Registre a análise completa
7. **Monitore** - Verifique se solução resolveu o problema

---

## Fontes

- [Tulip - Five Whys](https://tulip.co/glossary/five-whys/)
- [Wikipedia - Five Whys](https://en.wikipedia.org/wiki/Five_whys)
- [Adobe - 5 Whys Root Cause Analysis](https://business.adobe.com/blog/basics/5-whys-root-cause-analysis)
- [Businessmap - 5 Whys Analysis Tool](https://businessmap.io/lean-management/improvement/5-whys-analysis-tool)
- [Atlassian - 5 Whys Exercise](https://www.atlassian.com/team-playbook/plays/5-whys)
