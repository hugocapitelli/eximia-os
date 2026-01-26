# PRD: Automator Sales Engine (ASE)

**Versão:** 1.0 **Status:** Aprovado para Desenvolvimento **Classificação:** Projeto Complexo (Mansão)

## 1. VISÃO DO PRODUTO

Uma plataforma SaaS B2B que capacita consultores de automação a realizar diagnósticos de processos em tempo recorde (3-4h), calcular ROI com precisão matemática e gerar propostas comerciais irrecusáveis baseadas em algoritmos de precificação por valor. O sistema transforma a consultoria artesanal em um processo industrial escalável.

## 2. OBJETIVOS ESTRATÉGICOS

1. **Redução de Tempo:** Baixar o tempo médio de diagnóstico de 60h para <4h.
    
2. **Padronização de Venda:** Eliminar o "chutômetro" na precificação usando a Matriz de Precificação Algorítmica.
    
3. **Conversão:** Aumentar a taxa de fechamento para >30% através da clareza visual do ROI apresentado na hora.
    
4. **Data Moat:** Estruturar dados de cada diagnóstico para criar um banco de benchmarks proprietário.
    

## 3. ARQUITETURA CONCEITUAL

O sistema opera em três blocos rígidos para evitar alucinações da IA:

1. **Input Controlado (Wizard):** O humano insere dados estruturados.
    
2. **Core Engine (Híbrido):**
    
    - _Lógica Rígida:_ Fórmulas matemáticas para ROI e Preço (Python/JS).
        
    - _Lógica Flexível:_ LLM para análise qualitativa e sugestão de roadmap.
        
3. **Output Persuasivo:** Dashboards visuais e PDF de proposta.
    

---

## 4. REQUISITOS FUNCIONAIS (FR)

### MÓDULO 1: WIZARD DE COLETA (O Input)

**FR-001: Seleção de Contexto**

- O usuário deve selecionar o setor da empresa (Indústria, Varejo, Serviços) no início.
    
- Isso carrega o "Template de Perguntas" específico daquele setor.
    

**FR-002: Cadastro de Processos/Gargalos**

- Interface para adicionar múltiplos processos. Campos obrigatórios por processo:
    
    - Nome da Tarefa (ex: "Emissão de NF")
        
    - Tempo Gasto por Execução (minutos/horas)
        
    - Frequência (diária/semanal/mensal)
        
    - FTEs envolvidos (quantas pessoas fazem)
        
    - Salário Médio dos envolvidos (R$)
        
    - Ferramentas atuais utilizadas (texto livre)
        
    - Dor Qualitativa (campo de texto ou transcrição de áudio)
        

**FR-003: Dados da Empresa (Variáveis de Precificação)**

- Campos para input de: Faturamento Anual (Range), Número de Funcionários, Maturidade Tecnológica (Baixa/Média/Alta).
    

---

### MÓDULO 2: ENGINE DE CÁLCULO & IA (O Cérebro)

**FR-004: Calculadora de ROI (Lógica Rígida - SEM IA)**

- O sistema deve calcular matematicamente:
    
    - `Custo Atual Mensal = (Tempo x Frequência x Salário Hora)`
        
    - `Economia Estimada = Custo Atual x % de Redução Padrão (ex: 80% para RPA)`
        
    - `ROI Anual = Economia Mensal x 12`
        
- _Nota:_ A IA NÃO deve fazer essa conta. O código deve fazer.
    

**FR-005: Algoritmo de Precificação (A "Justiça")**

- Implementar a fórmula exata definida no Brief:
    
    - `Base Price` = % do ROI Total (conforme tabela escalonada).
        
    - `Multiplier Porte` = Fator baseado no Faturamento.
        
    - `Multiplier Complexidade` = Fator baseado no nº de sistemas integrados.
        
- Exibir o preço sugerido ("Preço Recomendado") mas permitir _override_ manual pelo consultor.
    

**FR-006: Sugestão de Solução (Lógica IA)**

- Com base na descrição da tarefa (FR-002), enviar prompt para LLM (GPT-4o/Claude) retornar:
    
    - "Solução Recomendada" (ex: "Automação via n8n + OCR").
        
    - "Nível de Dificuldade" (Baixo/Médio/Alto).
        
    - "Risco de Implementação".
        

---

### MÓDULO 3: DASHBOARD & OUTPUT (A Venda)

**FR-007: Dashboard de Apresentação (Real-time)**

- Tela limpa e de alto impacto para mostrar ao cliente NA HORA.
    
- Gráficos obrigatórios:
    
    - "Dinheiro jogado fora por ano" (Gráfico de barra vermelho).
        
    - "Potencial de Economia" (Gráfico verde).
        
    - "Payback do Projeto" (Linha do tempo).
        

**FR-008: Gerador de Proposta (PDF)**

- Botão "Gerar Proposta".
    
- Cria um PDF diagramado contendo:
    
    - Diagnóstico dos gargalos.
        
    - Cálculos de economia.
        
    - Roadmap de implementação (Fase 1, 2, 3).
        
    - Investimento e ROI.
        

---

## 5. REQUISITOS NÃO-FUNCIONAIS (NFR)

**NFR-001: Privacidade de Dados (Crítico)**

- Dados dos clientes não devem ser usados para retreinar modelos públicos.
    
- Uso de APIs com política "Zero Retention" configurada.
    

**NFR-002: Performance**

- Cálculos de ROI devem ser instantâneos (<200ms) ao alterar variáveis.
    
- Geração de sugestões via IA deve levar <10s.
    

**NFR-003: Disponibilidade**

- Sistema Web Responsivo (deve funcionar bem em iPad/Tablet, pois o consultor pode estar em campo).
    

**NFR-004: Stack Tecnológica Sugerida**

- **Frontend:** React/Next.js (componentes visuais ricos para dashboards - usar ShadCN/UI).
    
- **Backend:** Python (FastAPI) ou Node.js.
    
- **Database:** Supabase (PostgreSQL) - essencial para dados relacionais e o futuro "Data Moat".
    
- **AI:** OpenAI API (GPT-4o) para raciocínio ou Anthropic (Claude 3.5 Sonnet) para análise de contexto.
    

---

## 6. UX & DESIGN GUIDELINES

- **Vibe:** "Consultoria Premium". Cores sóbrias, tipografia limpa, muito espaço em branco.
    
- **Input:** O Wizard deve parecer uma conversa, não um formulário da Receita Federal.
    
- **Output:** Os números de dinheiro (R$) devem ser grandes e verdes. O custo atual deve ser vermelho.
    
- **Interatividade:** Sliders para ajustar variáveis ("E se o salário for maior?") e ver o gráfico mudar em tempo real (Efeito "Wow").
    

---

## 7. DADOS E APRENDIZADO (O Moat)

- Cada diagnóstico finalizado deve salvar um registro anonimizado no banco de dados "Benchmarks":
    
    - `{Setor: "Varejo", Processo: "Contas a Pagar", Custo_Medio: 4000, Solucao: "RPA"}`.
        
- Isso servirá para, no futuro, o sistema sugerir: _"Em empresas do seu setor, o custo médio deste processo é R$ X. O seu está acima da média."_
    

---

### FIM DO PRD

Este documento contém tudo o que é necessário para construir o **MVP (Minimum Viable Product)** da sua Mansão.


# MAPA DE ÉPICOS (Roadmap de Construção)

### 🚩 ÉPICO 1: FUNDAÇÃO & INFRAESTRUTURA

**Objetivo:** Ter o ambiente pronto, banco de dados configurado e autenticação funcionando. Sem isso, não há onde salvar os diagnósticos.

- **O que entrega:** Login, Cadastro, Banco de Dados (Supabase) conectado, Layout Base (Sidebar/Menu).
    
- **Por que primeiro?** É o alicerce. Se mudar depois, a casa cai.
    

### 🚩 ÉPICO 2: O WIZARD DE COLETA (Input)

**Objetivo:** Permitir que o consultor insira os dados dos processos de forma estruturada.

- **O que entrega:** Formulários dinâmicos, seleção de setor, inputs de tempo/custo/salário, salvamento no banco.
    
- **Funcionalidade:** O consultor já consegue _registrar_ o diagnóstico, mesmo que ainda não calcule nada.
    

### 🚩 ÉPICO 3: A ENGINE DE CÁLCULO & PRECIFICAÇÃO (Core)

**Objetivo:** A mágica matemática. Implementar as fórmulas de ROI e a Matriz de Preço.

- **O que entrega:** Backend calculando ROI automático, Algoritmo de Precificação sugerindo valores, Integração com IA para sugerir soluções técnicas.
    
- **Teste de Sucesso:** Se eu mudar o faturamento da empresa, o preço sugerido muda instantaneamente?
    

### 🚩 ÉPICO 4: A MÁQUINA DE VENDAS (Output)

**Objetivo:** Visualização e persuasão. Onde o cliente vê o valor.

- **O que entrega:** Dashboard com gráficos (Verde/Vermelho), Geração do PDF da Proposta, Timeline de Payback.
    
- **O "Uau":** É aqui que a ferramenta se paga.
    

---

### DETALHAMENTO TÉCNICO DOS ÉPICOS

Agora, vou desdobrar o **ÉPICO 1** e **ÉPICO 2** em **STORIES (Tarefas)** para que você (ou a IA) possa executar imediatamente.

#### 📦 ÉPICO 1: FUNDAÇÃO (O Alicerce)

- **Story 1.1:** Inicializar projeto Next.js com ShadCN/UI (Biblioteca visual bonita e profissional).
    
- **Story 1.2:** Configurar projeto no Supabase (Banco de Dados) e conectar variáveis de ambiente.
    
- **Story 1.3:** Criar sistema de Autenticação (Login/Senha) - _Crucial para proteger dados dos clientes._
    
- **Story 1.4:** Criar Layout Mestre (Sidebar com: "Novo Diagnóstico", "Histórico", "Configurações").
    

#### 📦 ÉPICO 2: WIZARD DE COLETA (As Paredes)

- **Story 2.1:** Criar Tabela `diagnosticos` e `processos` no banco de dados.
    
- **Story 2.2:** Criar Tela "Novo Diagnóstico" com inputs da Empresa (Setor, Faturamento, Funcionários).
    
- **Story 2.3:** Criar componente "Adicionar Processo" (Input repetível para Tarefa, Tempo, Frequência, Salário).
    
- **Story 2.4:** Implementar salvamento automático (autosave) para não perder dados durante a reunião.