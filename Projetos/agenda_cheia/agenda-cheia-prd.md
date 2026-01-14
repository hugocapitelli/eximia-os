# Product Requirements Document (PRD)
## Agenda Cheia - Growth Layer para Salões de Beleza

> **Versão:** 1.0
> **Data:** 06 de Janeiro de 2026
> **Autor:** Product Team
> **Status:** Draft - Aguardando Aprovação

---

## 📋 Índice

1. [Resumo Executivo](#1-resumo-executivo)
2. [Contexto e Oportunidade](#2-contexto-e-oportunidade)
3. [Definição do Problema](#3-definição-do-problema)
4. [Público-Alvo](#4-público-alvo)
5. [Solução Proposta](#5-solução-proposta)
6. [Objetivos do Produto](#6-objetivos-do-produto)
7. [Proposta de Valor](#7-proposta-de-valor)
8. [Requisitos Funcionais](#8-requisitos-funcionais)
9. [Experiência do Usuário](#9-experiência-do-usuário)
10. [Jornadas do Usuário](#10-jornadas-do-usuário)
11. [Requisitos Não-Funcionais](#11-requisitos-não-funcionais)
12. [Estratégia de Go-to-Market](#12-estratégia-de-go-to-market)
13. [Métricas de Sucesso](#13-métricas-de-sucesso)
14. [Roadmap e Fases](#14-roadmap-e-fases)
15. [Premissas e Restrições](#15-premissas-e-restrições)
16. [Riscos e Mitigações](#16-riscos-e-mitigações)
17. [Considerações Legais e Compliance](#17-considerações-legais-e-compliance)
18. [Apêndices](#18-apêndices)

---

## 1. Resumo Executivo

**Agenda Cheia** é uma solução SaaS que recupera receita perdida para salões de beleza e barbearias através de recall automatizado via WhatsApp.

### Problema Core
Salões perdem 30-40% da receita recorrente porque clientes esquecem de voltar no ciclo ideal de beleza. Recepcionistas não têm tempo ou disposição para fazer follow-up proativo.

### Nossa Solução
Uma assistente virtual ("Júlia") que vive no WhatsApp do salão e automaticamente:
- Lembra clientes de agendar manutenções no momento certo
- Reativa clientes inativos com ofertas personalizadas
- Negocia horários e coordena com a equipe do salão

### Diferencial Estratégico
Não somos um CRM. Somos uma **"Camada de Crescimento"** que funciona em cima de qualquer sistema (ou caderno) sem substituir nada. O dono só precisa importar uma lista de clientes e deixar o sistema trabalhar.

### Meta do MVP
Recuperar 5 clientes inativos por salão com fricção zero. O salão só paga depois de ver resultados.

### Mercado Alvo
50.000 salões de beleza no Brasil (médio prazo), começando por estabelecimentos de 2-10 funcionários em cidades Tier 2/3.

---

## 2. Contexto e Oportunidade

### 2.1 Tamanho do Mercado

**TAM (Total Addressable Market):**
- 500.000+ salões de beleza e barbearias no Brasil
- Faturamento médio: R$ 25.000/mês por estabelecimento
- Mercado total: ~R$ 12 bilhões/ano

**SAM (Serviceable Available Market):**
- Salões de 2-10 funcionários: ~150.000 estabelecimentos
- Com smartphone e WhatsApp: 95% (~142.000)
- Dispostos a pagar por tech: 30% (~42.000)

**SOM (Serviceable Obtainable Market - 3 anos):**
- Meta conservadora: 0,1% do SAM = 420 salões
- Receita potencial: 420 × R$ 97/mês = R$ 40.740 MRR

### 2.2 Tendências de Mercado

**Digitalização Forçada:**
- WhatsApp Business já é usado por 85% dos salões brasileiros
- Pandemia acelerou adoção de agendamento digital
- Clientes esperam comunicação proativa (geração Z/Millennial)

**Economia de Retenção:**
- Custo de adquirir novo cliente: 5x maior que reter existente
- Aumento de 5% em retenção = 25-95% mais lucro (Bain & Company)
- ROI de recall: 300-500% comparado a marketing de aquisição

**AI Conversacional Acessível:**
- Modelos como GPT-4o mini democratizaram IA ($0,15/1M tokens)
- Aceitação de chatbots cresceu 67% no varejo brasileiro (2025)
- WhatsApp liberou API para pequenos negócios

### 2.3 Landscape Competitivo

**Concorrentes Diretos:** Nenhum focado especificamente em recall automatizado.

**Concorrentes Indiretos:**
- **Trinks, Avec, BelezaAgenda:** CRMs completos (R$ 80-150/mês)
  - **Problema:** Complexidade alta, foco em gestão não em crescimento
- **Vamboo, HubLocal:** Marketing automation genérico
  - **Problema:** Não entendem o ciclo de beleza

**Nossa Diferenciação:**
1. **Foco Mono-Tarefa:** Só recuperamos receita (não fazemos tudo mal feito)
2. **Setup em 5 Minutos:** Upload CSV e pronto (vs 2 semanas de onboarding)
3. **Proof-First:** Cliente vê resultados antes de pagar
4. **Preço Popular:** R$ 97/mês (vs R$ 150 dos CRMs)

---

## 3. Definição do Problema

### 3.1 Declaração do Problema

**"Salões de beleza perdem R$ 10.000-15.000/mês em receita recuperável porque clientes não retornam no ciclo ideal e não existe processo estruturado de recall."**

### 3.2 Evidências do Problema

**Pesquisa Qualitativa (15 entrevistas com donos de salão):**
- 93% afirmam que "clientes somem" sem motivo aparente
- 80% não fazem nenhum tipo de recall ativo
- 67% dizem que recepcionista "esquece" de ligar para clientes
- 100% usam WhatsApp para comunicação diária

**Pesquisa Quantitativa (Análise de 5 salões piloto):**
- Taxa de retorno natural (sem recall): 62%
- Taxa de retorno com recall humano: 78% (+16pp)
- Taxa de retorno com recall automatizado: 83% (+21pp)
- Tempo médio gasto em recall manual: 8h/semana

**Cálculo de Perda de Receita:**
```
Exemplo: Salão com 200 clientes ativos
- Ticket médio: R$ 80
- Ciclo médio: 30 dias
- Churn sem recall: 38% (não voltam)
- Perda mensal: 200 × 38% × R$ 80 = R$ 6.080
- Perda anual: R$ 72.960
```

### 3.3 Causas Raiz

**Por que clientes não retornam?**
1. **Esquecimento (70%):** Vida corrida, sem lembrete automático
2. **Acomodação (15%):** "Vou quando der tempo"
3. **Insatisfação (10%):** Problema não verbalizado
4. **Mudança (5%):** Mudou de bairro/cidade

**Por que salões não fazem recall?**
1. **Falta de Tempo:** Recepcionista ocupada com atendimento presencial
2. **Falta de Sistema:** Não sabem quem chamar e quando
3. **Medo de Ser Chato:** "Cliente vai achar invasivo"
4. **Falta de ROI Visível:** Não medem impacto de recall

---

## 4. Público-Alvo

### 4.1 Persona Primária: "Carla - A Empreendedora Sobrecarregada"

**Demographics:**
- Nome: Carla Santos
- Idade: 42 anos
- Cargo: Dona e manicure do Salão da Carla
- Localização: Campinas/SP
- Equipe: 4 profissionais (2 manicures, 1 cabelereira, 1 recepcionista meio período)
- Faturamento: R$ 35.000/mês

**Dia-a-Dia:**
- Acorda 7h, chega no salão 8h30
- Atende 8-10 clientes/dia enquanto gerencia o negócio
- Usa WhatsApp para TUDO (fornecedores, clientes, equipe)
- Vai pra casa 19h exausta
- Sonho: Ter "sócia invisível" que cuida do marketing

**Dores Específicas:**
- "Minha agenda tem buraco toda terça e quarta" (dias fracos)
- "Cliente some e eu só percebo 2 meses depois"
- "Minha recepcionista atende bem, mas não vende"
- "Já tentei usar CRM, desisti na 2ª semana (muito complicado)"

**Objetivos:**
- Aumentar faturamento em 20% sem contratar
- Reduzir dias com agenda vazia
- Ter controle sobre o negócio sem virar "gerente full-time"

**Tecnologia:**
- Smartphone: Samsung Galaxy A54
- Apps principais: WhatsApp, Instagram, Planilha Google (controle financeiro)
- Habilidade: Média (sabe usar app, mas não é "tech savvy")

**Citação:**
> "Eu queria um robozinho que chamasse minha cliente quando tá na hora dela voltar. Simples assim. Não preciso de sistema com 500 funções."

### 4.2 Persona Secundária: "Rafael - O Barbeiro Millennial"

**Demographics:**
- Nome: Rafael Oliveira
- Idade: 28 anos
- Cargo: Dono da Barbearia Old School
- Localização: Ribeirão Preto/SP
- Equipe: 3 barbeiros + ele
- Faturamento: R$ 28.000/mês

**Comportamento:**
- Early adopter de tech (já testou 5 apps de gestão)
- Ativo no Instagram (3.200 seguidores)
- Faz agendamento por app (Trinks) mas clientes preferem WhatsApp
- Mindset growth: quer escalar para 2ª unidade

**Dores:**
- "Sistema de agendamento é subutilizado (só 30% dos clientes usam)"
- "Cliente agenda e não aparece (no-show de 15%)"
- "Queria automatizar recall mas APIs são muito caras/complexas"

**Objetivos:**
- Reduzir no-show de 15% para <5%
- Automatizar recall sem depender de recepcionista
- Profissionalizar a comunicação (marca forte)

---

## 5. Solução Proposta

### 5.1 Visão do Produto

**Agenda Cheia é uma Concierge Digital que vive no WhatsApp do salão e recupera receita perdida através de conversas humanizadas e automatizadas.**

### 5.2 Como Funciona (Elevator Pitch)

**Para o Dono do Salão:**
1. Você importa sua lista de clientes (CSV ou manual)
2. O sistema identifica automaticamente quem está "devendo" retorno
3. A assistente virtual "Júlia" manda mensagem personalizada no momento certo
4. Cliente agenda direto pelo WhatsApp
5. Você confirma o horário com um emoji 👍
6. Dinheiro entra no caixa

**Tempo de Setup:** 5 minutos
**Esforço Contínuo:** 2 minutos/dia (confirmar agendamentos)

### 5.3 Componentes da Solução

#### 5.3.1 Assistente Virtual "Júlia"

**Identidade:**
- Nome: Júlia (personalizável por salão)
- Tom: Amigável, informal, brasileira
- Função: Recepcionista virtual especializada em recall

**Capacidades:**
- Identifica quando cliente deve retornar (baseado no ciclo do serviço)
- Envia lembrete personalizado (menciona profissional, serviço anterior)
- Negocia horário via conversa natural
- Responde dúvidas básicas (preço, endereço, horário de funcionamento)
- Identifica quando precisa escalar para humano

**Transparência:**
- Admite ser robô se perguntado
- Nunca se passa por humano
- Sempre oferece opção de falar com pessoa

#### 5.3.2 Dashboard Web (Mobile-First)

**Telas Principais:**
1. **Painel de Receita:**
   - "R$ Recuperados Hoje/Semana/Mês"
   - Gráfico de evolução
   - Progresso do "Desafio 5 Clientes"

2. **Gerenciador de Clientes:**
   - Lista de clientes (status: ativo/inativo/churned)
   - Upload de CSV
   - Edição manual

3. **Inbox de Conversas:**
   - Todas as conversas do bot
   - Possibilidade de "tomar controle" (modo manual)
   - Histórico completo

4. **Confirmações Pendentes:**
   - Fila de agendamentos aguardando 👍/👎
   - Notificação push

5. **Configurações:**
   - Conectar WhatsApp (QR Code)
   - Personalizar mensagens
   - Definir ciclos de serviço
   - Gerenciar profissionais

#### 5.3.3 Integração WhatsApp

**Método:**
- Conexão via QR Code (igual WhatsApp Web)
- Número do próprio salão (não precisa número novo)
- Multi-device (salão continua usando WhatsApp normal)

**Funcionalidades:**
- Envio de mensagens programadas
- Recebimento de respostas
- Detecção de interesse (agendamento vs recusa)
- Opt-out automático ("SAIR")

---

## 6. Objetivos do Produto

### 6.1 Objetivos de Negócio

**Curto Prazo (3 meses):**
- Validar hipótese: "Salões pagam R$ 50/mês se recuperarem 5+ clientes"
- Alcançar: 30 salões pagantes
- MRR: R$ 1.500
- NPS: >50

**Médio Prazo (12 meses):**
- Alcançar: 500 salões pagantes
- MRR: R$ 25.000
- Churn: <5%/mês
- Payback: <3 meses (CAC/LTV)

**Longo Prazo (36 meses):**
- Alcançar: 10.000 salões pagantes
- MRR: R$ 500.000
- Tornar-se sinônimo de "recall automatizado" no Brasil
- Expandir para clínicas de estética e pet shops

### 6.2 Objetivos do Usuário (Salão)

**Resultado Esperado:**
- Aumentar taxa de retorno de 62% para 83% (+21pp)
- Recuperar R$ 5.000-8.000/mês em receita perdida
- Reduzir tempo gasto com recall de 8h/semana para 0h
- Reduzir no-show de 15% para 5%

**Benefícios Intangíveis:**
- Profissionalização da comunicação (marca mais forte)
- Redução de estresse (sistema trabalha no automático)
- Insights sobre comportamento de clientes (quem está sumindo)

### 6.3 Objetivos de Produto

**Performance:**
- Taxa de entrega WhatsApp: >95%
- Taxa de resposta a recalls: >20%
- Taxa de conversão (resposta → agendamento): >50%
- Tempo de resposta do bot: <3 segundos

**Usabilidade:**
- Time-to-First-Value: <10 minutos (do cadastro ao 1º recall enviado)
- Task Success Rate (upload CSV): >90%
- Satisfação com UI: >4.2/5

---

## 7. Proposta de Valor

### 7.1 Value Proposition Canvas

**Para Donos de Salão:**

| Jobs to be Done | Pains | Gains |
|-----------------|-------|-------|
| Manter agenda cheia | Clientes esquecem de voltar | Receita previsível e crescente |
| Aumentar receita | Recepcionista não faz recall | Menos estresse operacional |
| Profissionalizar negócio | CRMs são complexos demais | Marca mais profissional |
| Competir com franquias | Falta de tempo para marketing | Vantagem competitiva |

**Como Atendemos:**

| Pain Relievers | Gain Creators |
|----------------|---------------|
| ✅ Setup em 5 minutos (vs 2 semanas) | 💰 R$ 5k-8k/mês recuperados automaticamente |
| ✅ Não precisa trocar sistema atual | 📊 Dashboard com "dopamina" (R$ recuperados hoje) |
| ✅ Funciona sozinho (Set and Forget) | 🤖 "Sócia invisível" que trabalha 24/7 |
| ✅ Preço popular (R$ 50 vs R$ 150) | 🎯 Recall no timing perfeito (ciclo de beleza) |
| ✅ Risco zero (paga só depois de ver resultado) | 😌 Paz de espírito (nenhum cliente esquecido) |

### 7.2 Unique Selling Propositions (USPs)

**1. "O Desafio dos 5 Clientes"**
- Você só paga depois que o sistema recuperar 5 clientes
- Proof-of-value antes do investimento
- Remove objeção de "não sei se funciona"

**2. "Add-on, Not Replace"**
- Funciona com qualquer sistema (Trinks, Avec, caderno)
- Não precisa migrar dados sensíveis (comissões, estoque)
- Cliente mantém workflow atual

**3. "Humanização Digital Honesta"**
- Bot admite ser IA (transparência)
- Conversa como brasileira (gírias, emojis)
- Nunca engana o cliente final

**4. "Lazy Sync"**
- Bot negocia, humano só confirma (👍/👎)
- Não precisa integração complexa de agenda
- Melhor dos dois mundos: automação + controle

---

## 8. Requisitos Funcionais

### 8.1 Funcionalidades Core (MVP)

#### F001: Onboarding e Configuração Inicial

**Descrição:** Processo guiado para novo salão começar a usar o sistema.

**User Story:**
> Como dona de salão, eu quero configurar o sistema em menos de 10 minutos para começar a recuperar clientes hoje mesmo.

**Passos:**
1. Cadastro (nome, WhatsApp, email)
2. Conectar WhatsApp via QR Code
3. Upload de lista de clientes (CSV ou manual)
4. Definir ciclos de serviço (ex: unha = 21 dias)
5. Cadastrar profissionais (opcional)
6. Revisar e enviar primeiro recall (teste)

**Critérios de Aceite:**
- [ ] Fluxo completo em ≤5 telas
- [ ] Validação de telefone brasileiro
- [ ] Preview de dados antes de confirmar
- [ ] Checkbox LGPD obrigatório (consentimento)
- [ ] Tooltip/ajuda em cada passo

---

#### F002: Upload e Gestão de Clientes

**Descrição:** Importação e manutenção da base de clientes.

**User Story:**
> Como dona de salão, eu quero importar minha lista de clientes de uma planilha para não ter que digitar um por um.

**Formato CSV Aceito:**
```csv
nome,telefone,ultima_visita,servico,profissional
Maria Silva,11999998888,10/12/2025,Manicure,Carol
João Santos,11988887777,15/11/2025,Barba,Rafael
```

**Validações:**
- Telefone: 11 dígitos (DDD + número)
- Data: DD/MM/AAAA ou AAAA-MM-DD
- Campos obrigatórios: nome, telefone
- Duplicatas: Avisar e permitir mesclar/sobrescrever

**Funcionalidades:**
- Upload CSV (até 1.000 clientes)
- Adicionar cliente manualmente
- Editar dados de cliente
- Marcar cliente como "não contactar"
- Exportar lista (para backup)

**Critérios de Aceite:**
- [ ] Upload de 100 clientes em <10 segundos
- [ ] Taxa de erro de validação mostrada claramente
- [ ] Possibilidade de corrigir erros antes de salvar
- [ ] Confirmação antes de sobrescrever duplicatas

---

#### F003: Recall Automático (Ciclo Vencido)

**Descrição:** Sistema identifica clientes que devem retornar e envia lembrete automaticamente.

**User Story:**
> Como dona de salão, eu quero que o sistema avise automaticamente meus clientes quando estiver na hora de voltar, sem eu ter que lembrar.

**Lógica de Recall:**
1. Sistema calcula "data ideal de retorno" = última_visita + ciclo_servico
2. 2 dias antes da data ideal, envia mensagem
3. Se não responder em 24h, reenvia com variação de mensagem
4. Máximo 3 tentativas (D-2, D-1, D+0)
5. Se responder positivo, inicia negociação de horário

**Exemplo de Mensagem:**
```
Oi Maria! É a Júlia do Salão da Carla 💅

Notei que faz uns 20 dias que você fez unha com a Carol.
Tá na hora da manutenção!

Tenho uma vaga na sexta 15h. Quer que eu segure pra você?
```

**Personalização:**
- Nome do cliente
- Nome da profissional que atendeu
- Serviço anterior
- Sugestão de horário (baseado em padrões)

**Critérios de Aceite:**
- [ ] Recall enviado exatamente 2 dias antes
- [ ] Mensagem menciona profissional e serviço
- [ ] Cliente pode responder "sim", "não" ou "outro horário"
- [ ] Sistema detecta intenção mesmo com erro de digitação
- [ ] Máximo 3 tentativas por cliente

---

#### F004: Negociação de Horário (Conversação)

**Descrição:** Bot conversa com cliente para encontrar melhor horário.

**User Story:**
> Como cliente do salão, eu quero negociar o horário do agendamento de forma natural pelo WhatsApp, como se estivesse conversando com uma pessoa.

**Fluxos de Conversa:**

**Fluxo A: Cliente aceita horário sugerido**
```
Bot: Tenho vaga sexta 15h. Quer?
Cliente: Quero sim
Bot: Ótimo! Vou confirmar com a Carol e te aviso já já.
[Lazy Sync: pede confirmação para recepcionista]
Bot: Confirmado! Sexta 15h com a Carol. Te espero! 😊
```

**Fluxo B: Cliente quer outro horário**
```
Bot: Tenho vaga sexta 15h. Quer?
Cliente: Só posso sábado de manhã
Bot: Deixa eu verificar sábado de manhã e te aviso, ok?
[Encaminha para recepcionista avaliar]
Bot: A Carol tem vaga sábado 10h. Serve?
Cliente: Perfeito!
Bot: Agendado! Sábado 10h com a Carol 💅
```

**Fluxo C: Cliente não pode agora**
```
Bot: Tenho vaga sexta 15h. Quer?
Cliente: Agora tô sem grana, mês que vem eu vejo
Bot: Sem problemas! Te chamo mês que vem então. Qualquer coisa pode me chamar antes! 😊
[Marca para recontato em 30 dias]
```

**Critérios de Aceite:**
- [ ] Bot entende respostas em português informal ("blz", "ss", "pode ser")
- [ ] Bot detecta "não posso" e para de insistir
- [ ] Bot detecta pedido de outro horário e escala para humano
- [ ] Conversa soa natural (não robótica)
- [ ] Bot nunca repete pergunta já respondida

---

#### F005: Lazy Sync (Confirmação Humana)

**Descrição:** Quando cliente quer agendar, sistema pede confirmação da recepcionista antes de finalizar.

**User Story:**
> Como recepcionista, eu quero confirmar ou negar agendamentos sugeridos pelo bot com um simples emoji, sem precisar digitar nada.

**Fluxo:**
1. Cliente aceita agendamento (ex: "Sexta 15h")
2. Bot manda mensagem no WhatsApp do SALÃO:
   ```
   🔔 Novo Agendamento

   Cliente: Maria Silva
   Serviço: Manicure
   Profissional: Carol
   Horário: Sexta 15h

   Posso confirmar? (👍 sim / 👎 não)
   ```
3. Recepcionista responde com emoji
4. Bot finaliza com cliente automaticamente

**Detecção de Resposta:**
- 👍 ou "sim" ou "confirma" = Confirmado
- 👎 ou "não" ou "negado" = Negado (bot pede outro horário ao cliente)
- Timeout 30 minutos = Bot avisa cliente "Vou confirmar e te aviso"

**Critérios de Aceite:**
- [ ] Mensagem de confirmação clara e objetiva
- [ ] Aceita emoji, texto ou ambos
- [ ] Se timeout, não deixa cliente sem resposta
- [ ] Registra quem confirmou e quando (auditoria)

---

#### F006: Dashboard "R$ Recuperados"

**Descrição:** Painel principal mostrando impacto financeiro do sistema.

**User Story:**
> Como dona de salão, eu quero ver quanto dinheiro o sistema já recuperou pra eu sentir que vale a pena.

**Métricas Principais:**

**Card 1: Receita Recuperada (Destaque)**
```
┌────────────────────────────┐
│  💰 R$ RECUPERADOS HOJE    │
│                            │
│      R$ 640,00             │
│                            │
│  ↗ +23% vs ontem           │
└────────────────────────────┘
```

**Card 2: Progresso "Desafio 5 Clientes"**
```
┌────────────────────────────┐
│  🎯 DESAFIO 5 CLIENTES     │
│                            │
│  [████████░░]  3/5         │
│                            │
│  Faltam 2 para modo pago!  │
└────────────────────────────┘
```

**Card 3: Recalls da Semana**
```
┌────────────────────────────┐
│  📊 RECALLS (ÚLTIMOS 7D)   │
│                            │
│  Enviados: 42              │
│  Responderam: 18 (42,9%)   │
│  Agendaram: 11 (26,2%)     │
└────────────────────────────┘
```

**Gráficos:**
- Receita recuperada (últimos 30 dias) - Linha
- Clientes por status - Rosquinha (Ativo/Inativo/Churned)

**Critérios de Aceite:**
- [ ] Dados atualizados em tempo real (ou max 1 min delay)
- [ ] Comparação com período anterior (% variação)
- [ ] Gráficos responsivos (mobile-first)
- [ ] Possibilidade de filtrar por período

---

#### F007: Inbox de Conversas

**Descrição:** Visualizar todas as conversas entre bot e clientes.

**User Story:**
> Como dona de salão, eu quero ler as conversas do bot para ter certeza que ele tá falando certo e poder intervir se necessário.

**Funcionalidades:**
- Lista de conversas (mais recentes primeiro)
- Busca por nome/telefone
- Filtros: Status (ativa/concluída/opt-out)
- Visualização estilo WhatsApp (bolhas de mensagem)
- Modo "Assumir Controle" (desativa bot, dono digita manualmente)

**Interface:**
```
┌─────────────────────────────────────┐
│ 🔍 Buscar cliente...                │
├─────────────────────────────────────┤
│                                     │
│ Maria Silva          Hoje 14:32    │
│ Agendado: Sexta 15h ✅              │
│ ─────────────────────────────────  │
│ João Santos          Ontem 10:15   │
│ Aguardando resposta...              │
│ ─────────────────────────────────  │
│ Ana Costa            02/01 16:40   │
│ Optou por sair 🚫                   │
│                                     │
└─────────────────────────────────────┘
```

**Critérios de Aceite:**
- [ ] Carrega 50 conversas em <2 segundos
- [ ] Scroll infinito (lazy loading)
- [ ] Badge de "nova mensagem" para não lidas
- [ ] Possibilidade de marcar conversa como importante
- [ ] Modo "takeover" desativa bot até dono reativar

---

#### F008: Reativação de Clientes Inativos

**Descrição:** Campanha automática para clientes que não voltam há >60 dias.

**User Story:**
> Como dona de salão, eu quero recuperar clientes que sumiram há meses com uma oferta especial, sem ter que fazer isso manualmente.

**Lógica:**
1. Sistema identifica clientes inativos (última visita > 60 dias)
2. Cria oferta especial (ex: "Hidratação grátis se agendar serviço X")
3. Envia mensagem diferenciada ("Sumida! Saudades!")
4. Máximo 2 tentativas (dia 1 e dia 7)
5. Se não responder, marca como "churned"

**Exemplo de Mensagem:**
```
Oi Ana! É a Júlia do Salão da Carla 😊

Sumida! Faz tempo que você não aparece aqui...

Tenho um presente pra você voltar:
🎁 HIDRATAÇÃO GRÁTIS se agendar pé e mão essa semana

Tá valendo! Quer aproveitar?
```

**Configuração:**
- Dono escolhe a oferta (template)
- Define gatilho (ex: >60, >90, >120 dias)
- Limite de tentativas por cliente

**Critérios de Aceite:**
- [ ] Oferta personalizável por salão
- [ ] Não envia para quem fez opt-out
- [ ] Contabiliza custo da oferta no ROI
- [ ] Marca cliente como "reativado" se voltar

---

#### F009: Opt-Out Automático

**Descrição:** Cliente pode pedir para parar de receber mensagens a qualquer momento.

**User Story:**
> Como cliente, eu quero poder parar de receber mensagens do salão de forma simples, respondendo "SAIR".

**Palavras-Chave de Opt-Out:**
- "SAIR"
- "PARAR"
- "CANCELAR"
- "NÃO QUERO MAIS"
- "ME TIRA DESSA LISTA"

**Resposta Automática:**
```
Sem problemas! Você não vai mais receber mensagens automáticas.

Se precisar agendar, pode me chamar a qualquer momento! 😊
```

**Efeitos:**
- Cliente marcado como `opted_out = true`
- Nunca mais recebe recalls/reativação automatizados
- Continua podendo INICIAR conversa (bot responde)
- Dono pode ver lista de opt-outs no dashboard

**Critérios de Aceite:**
- [ ] Detecção case-insensitive ("sair" = "SAIR")
- [ ] Efeito imediato (< 1 segundo)
- [ ] Confirmação clara ao cliente
- [ ] Auditoria (registra data/hora do opt-out)
- [ ] Reversível (dono pode reativar manualmente)

---

### 8.2 Funcionalidades Desejáveis (Pós-MVP)

#### F010: A/B Testing de Mensagens
- Testar 2 variações de recall com 10% da base
- Escalar a vencedora automaticamente
- Métricas: Taxa de resposta, taxa de conversão

#### F011: Relatório Semanal via WhatsApp
- Todo domingo 20h, envia resumo:
  - Clientes recuperados na semana
  - Receita gerada
  - Próximos recalls agendados

#### F012: Segmentação Avançada
- Recalls diferentes por profissional
- Ofertas diferentes por tipo de serviço
- Horários sugeridos baseados em preferência do cliente

#### F013: Integração Nativa com CRMs
- API para Trinks, Avec, BelezaAgenda
- Sincronização automática de agendamentos
- Elimina necessidade de upload manual

#### F014: Cupons de Desconto Automáticos
- Sistema gera código único por cliente
- Rastreamento de uso
- ROI calculado automaticamente

---

## 9. Experiência do Usuário

### 9.1 Princípios de UX

**1. Mobile-First**
- 80% dos donos de salão acessam via smartphone
- Interface otimizada para tela pequena
- Touch-friendly (botões grandes, espaçamento adequado)

**2. Simplicidade Brutal**
- Máximo 3 cliques para qualquer ação principal
- Zero jargões técnicos ("API", "webhook", etc.)
- Tudo tem um motivo claro ("Por que preciso disso?")

**3. Feedback Imediato**
- Toda ação tem resposta visual instantânea
- Loading states claros
- Mensagens de sucesso/erro amigáveis

**4. Progressão Gamificada**
- "Desafio 5 Clientes" = Progress bar
- Conquistas desbloqueáveis
- Badges visuais (1º cliente recuperado, 10º, 50º)

**5. Dopamina Visual**
- Número grande e colorido: "R$ Recuperados Hoje"
- Animação quando novo agendamento acontece
- Notificação push: "🎉 Você acabou de recuperar R$ 80!"

### 9.2 Fluxo de Onboarding

**Objetivo:** Do cadastro ao primeiro recall enviado em <10 minutos.

**Tela 1: Bem-vindo**
```
┌─────────────────────────────────┐
│                                 │
│        💰 Agenda Cheia          │
│                                 │
│  Recupere clientes que sumiram  │
│   com um robô no WhatsApp       │
│                                 │
│  [  Começar Grátis  ]          │
│                                 │
│  ✓ 5 clientes de graça          │
│  ✓ Setup em 5 minutos           │
└─────────────────────────────────┘
```

**Tela 2: Seus Dados**
```
Nome do Salão: [_______________]
Seu Nome:      [_______________]
WhatsApp:      [_______________]
                    (será usado para login)

[  Continuar  ]
```

**Tela 3: Conectar WhatsApp**
```
┌─────────────────────────────────┐
│  📱 Conectar WhatsApp           │
│                                 │
│  Abra o WhatsApp no seu celular │
│  e escaneie o código:           │
│                                 │
│  ┌─────────────────┐            │
│  │  [QR CODE]      │            │
│  │                 │            │
│  └─────────────────┘            │
│                                 │
│  ⏱ Aguardando conexão...        │
└─────────────────────────────────┘
```

**Tela 4: Importar Clientes**
```
┌─────────────────────────────────┐
│  👥 Adicionar Clientes          │
│                                 │
│  Opção 1:                       │
│  [📄 Importar Planilha (CSV)]   │
│                                 │
│  Opção 2:                       │
│  [✏️ Adicionar Manualmente]     │
│                                 │
│  💡 Dica: Exporte do seu        │
│     sistema atual e cole aqui   │
└─────────────────────────────────┘
```

**Tela 5: Definir Ciclos**
```
┌─────────────────────────────────┐
│  ⏰ Ciclo dos Serviços          │
│                                 │
│  Quando seus clientes devem     │
│  retornar?                      │
│                                 │
│  Manicure/Pedicure:  [21] dias  │
│  Cabelo Feminino:    [35] dias  │
│  Barba:              [15] dias  │
│                                 │
│  + Adicionar Serviço            │
│                                 │
│  [  Continuar  ]                │
└─────────────────────────────────┘
```

**Tela 6: Consentimento LGPD**
```
┌─────────────────────────────────┐
│  📋 Termo de Responsabilidade   │
│                                 │
│  [x] Declaro que tenho          │
│      autorização para contatar  │
│      estes clientes via         │
│      WhatsApp e estou ciente    │
│      dos riscos de automação.   │
│                                 │
│  [Ver termo completo]           │
│                                 │
│  [  Aceitar e Começar  ]        │
└─────────────────────────────────┘
```

**Tela 7: Tudo Pronto!**
```
┌─────────────────────────────────┐
│         🎉 Tudo Pronto!         │
│                                 │
│  Identifiquei 12 clientes que   │
│  devem retornar essa semana.    │
│                                 │
│  Posso começar a enviar recalls?│
│                                 │
│  [  Sim, Pode Enviar!  ]        │
│  [  Deixa Eu Revisar Antes  ]   │
└─────────────────────────────────┘
```

### 9.3 Wireframes Principais

#### Dashboard (Home)
```
┌─────────────────────────────────────┐
│ ☰  Agenda Cheia    [👤] [🔔]        │
├─────────────────────────────────────┤
│                                     │
│  💰 R$ RECUPERADOS HOJE             │
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  │        R$ 640,00            │   │
│  │                             │   │
│  │      ↗ +23% vs ontem        │   │
│  └─────────────────────────────┘   │
│                                     │
│  🎯 DESAFIO 5 CLIENTES              │
│  ┌─────────────────────────────┐   │
│  │  [████████░░]  3/5          │   │
│  │  Faltam 2 para modo pago!   │   │
│  └─────────────────────────────┘   │
│                                     │
│  📊 RECALLS (ÚLTIMOS 7 DIAS)        │
│  ┌─────────────────────────────┐   │
│  │  Enviados:        42        │   │
│  │  Responderam:     18 (43%)  │   │
│  │  Agendaram:       11 (26%)  │   │
│  └─────────────────────────────┘   │
│                                     │
│  ──────── Receita (30d) ──────     │
│  [   Gráfico de Linha    ]         │
│                                     │
└─────────────────────────────────────┘
│  [🏠] [💬] [👥] [⚙️]               │
└─────────────────────────────────────┘
```

#### Inbox de Conversas
```
┌─────────────────────────────────────┐
│ ←  Conversas           [🔍]         │
├─────────────────────────────────────┤
│                                     │
│  🔴 Maria Silva      Hoje 14:32    │
│  Quer agendar sexta 15h            │
│  ─────────────────────────────────│
│                                     │
│  João Santos         Hoje 10:21    │
│  Agendado: Sábado 10h ✅           │
│  ─────────────────────────────────│
│                                     │
│  Ana Costa           Ontem 16:40   │
│  Pediu pra sair 🚫                 │
│  ─────────────────────────────────│
│                                     │
│                                     │
│  [Carregar mais...]                 │
│                                     │
└─────────────────────────────────────┘
│  [🏠] [💬] [👥] [⚙️]               │
└─────────────────────────────────────┘
```

#### Conversa Individual
```
┌─────────────────────────────────────┐
│ ←  Maria Silva         [⋮]          │
├─────────────────────────────────────┤
│                                     │
│              [BOT] Hoje 14:30      │
│  ┌──────────────────────────────┐  │
│  │ Oi Maria! A Carol comentou   │  │
│  │ que sua unha vence essa      │  │
│  │ semana. Quer agendar? 💅      │  │
│  └──────────────────────────────┘  │
│                                     │
│  Hoje 14:32            [CLIENTE]   │
│              ┌──────────────────┐  │
│              │ Quero sim! Sexta │  │
│              │ 15h tá bom?      │  │
│              └──────────────────┘  │
│                                     │
│              [BOT] Hoje 14:32      │
│  ┌──────────────────────────────┐  │
│  │ Perfeito! Vou confirmar com  │  │
│  │ a Carol e te aviso já já     │  │
│  └──────────────────────────────┘  │
│                                     │
│  ⏸ Bot pausado - Aguardando        │
│     confirmação da recepcionista   │
│                                     │
│  [ ▶ Assumir Controle ]            │
│                                     │
└─────────────────────────────────────┘
```

---

## 10. Jornadas do Usuário

### 10.1 Jornada 1: Primeira Recuperação (Happy Path)

**Persona:** Carla (Dona de Salão)

**Contexto:** Acabou de se cadastrar e importou 150 clientes.

**Passos:**

1. **Dia 1 - 10:00 (Cadastro)**
   - Carla vê anúncio no Instagram "Recupere clientes com robô WhatsApp"
   - Clica em "Começar Grátis"
   - Completa onboarding em 7 minutos
   - Importa planilha com 150 clientes
   - Sistema identifica 18 clientes "atrasados"

2. **Dia 1 - 14:00 (Primeiros Recalls)**
   - Sistema envia 18 recalls ao longo da tarde
   - Carla recebe notificação: "🚀 18 recalls enviados!"
   - Abre dashboard e vê atividade em tempo real

3. **Dia 1 - 16:30 (Primeira Resposta)**
   - Cliente Maria responde: "Oi! Quero agendar sim"
   - Carla recebe notificação: "🔔 Maria quer agendar!"
   - Abre conversa, vê bot negociando horário
   - Bot pergunta: "🔔 Maria quer Sexta 15h. Confirma? 👍👎"
   - Carla responde: 👍
   - Bot finaliza com Maria automaticamente

4. **Dia 1 - 16:32 (Primeira Vitória)**
   - Dashboard atualiza:
     - "R$ Recuperados Hoje: R$ 80,00"
     - "Desafio 5 Clientes: 1/5"
   - Carla sente a dopamina: "Funcionou!"

5. **Dia 3 (Momentum)**
   - Mais 2 clientes agendaram
   - Dashboard: "3/5 - Faltam 2!"
   - Carla compartilha no stories: "Olha que legal esse robô"

6. **Dia 5 (Unlock)**
   - 5º cliente agenda
   - Sistema mostra: "🎉 Parabéns! Você desbloqueou o modo pago!"
   - Oferece plano: "Continue por R$ 49/mês"
   - Carla: "Já recuperei R$ 400, claro que vou pagar!"

**Resultado:** Conversão de trial para pago.

---

### 10.2 Jornada 2: Cliente Final (Recall Bem-Sucedido)

**Persona:** Maria (Cliente do Salão)

**Contexto:** Fez unha há 22 dias, esqueceu de voltar.

**Passos:**

1. **Terça 09:15 (Recall)**
   - Maria recebe mensagem:
     ```
     Oi Maria! É a Júlia do Salão da Carla 💅

     Notei que faz uns 20 dias que você fez unha com a Carol.
     Tá na hora da manutenção!

     Tenho uma vaga na sexta 15h. Quer que eu segure?
     ```
   - Reação de Maria: "Nossa, verdade! Nem lembrava"

2. **Terça 10:30 (Negociação)**
   - Maria: "Oi! Quero sim, mas só posso sábado de manhã"
   - Júlia: "Deixa eu ver sábado de manhã e te aviso, tá bom?"
   - Maria: "Ok!"

3. **Terça 11:00 (Confirmação)**
   - [Background: Júlia perguntou pra Carla, Carla confirmou sábado 10h]
   - Júlia: "A Carol tem vaga sábado 10h! Serve?"
   - Maria: "Perfeito!"
   - Júlia: "Agendado! Sábado 10h com a Carol. Te espero! 😊"

4. **Sábado 10:00 (Comparecimento)**
   - Maria vai ao salão
   - Comenta com Carol: "Aquele robô do WhatsApp é muito bom, viu!"
   - Carol: "Pois é! Agora nenhuma cliente esquece"

**Resultado:** Retenção de cliente, boca-a-boca positivo.

---

### 10.3 Jornada 3: Reativação de Cliente Churned

**Persona:** Ana (Cliente Inativa há 90 dias)

**Contexto:** Parou de ir ao salão (sem motivo aparente).

**Passos:**

1. **Sistema Detecta Churn**
   - Ana não aparece há 91 dias
   - Sistema marca como "Churn Risk: HIGH"
   - Ativa campanha de reativação

2. **Segunda 09:00 (Reativação)**
   - Ana recebe:
     ```
     Oi Ana! É a Júlia do Salão da Carla 😊

     Sumida! Faz tempo que você não aparece aqui...

     Tenho um presente pra você voltar:
     🎁 HIDRATAÇÃO GRÁTIS se agendar pé e mão essa semana

     Tá valendo! Quer aproveitar?
     ```

3. **Segunda 14:00 (Resposta)**
   - Ana: "Oi! Verdade, tava sem tempo. Essa semana tá corrido, mas semana que vem posso"
   - Júlia: "Sem problemas! Semana que vem o presente continua valendo. Quando você preferir, me chama! 😊"

4. **Segunda Seguinte (Conversão)**
   - Ana inicia conversa: "Oi, quero marcar pé e mão pra sexta"
   - Júlia agenda
   - Ana volta ao salão
   - Sistema marca: "Cliente Reativado"

**Resultado:** R$ 150 que seriam perdidos, recuperados.

---

## 11. Requisitos Não-Funcionais

### 11.1 Performance

**RNF-01: Tempo de Resposta**
- Carregamento inicial do dashboard: <2 segundos
- Resposta do bot no WhatsApp: <3 segundos
- Upload de CSV (100 clientes): <10 segundos
- Queries de busca/filtro: <500ms

**RNF-02: Throughput**
- Sistema deve suportar 1.000 recalls enviados/hora
- 100 conversas simultâneas sem degradação
- 50 salões usando sistema concorrentemente (MVP)

**RNF-03: Latência de WhatsApp**
- Mensagens devem ser entregues em <10 segundos
- Webhook deve processar resposta em <5 segundos

### 11.2 Escalabilidade

**RNF-04: Crescimento de Base**
- Arquitetura deve suportar crescimento de 50 → 500 salões sem refatoração
- Database deve suportar 100.000+ clientes finais
- Infraestrutura deve escalar horizontalmente (auto-scaling)

**RNF-05: Concorrência**
- Sistema deve aguentar picos de 5x o uso médio (horário comercial)
- Fila de mensagens deve processar até 10.000 jobs/dia

### 11.3 Disponibilidade e Confiabilidade

**RNF-06: Uptime**
- SLA de 99,5% (downtime máximo: 3,6h/mês)
- Manutenções programadas fora do horário comercial (00:00-06:00)

**RNF-07: Recuperação de Falhas**
- Mensagens não enviadas devem ser reenfileiradas automaticamente
- Retry com backoff exponencial (até 3 tentativas)
- Circuit breaker para serviços externos (Z-API, OpenAI)

**RNF-08: Backup e Disaster Recovery**
- Backup diário automático do banco de dados
- Retenção: 7 dias
- RTO (Recovery Time Objective): 4 horas
- RPO (Recovery Point Objective): 24 horas

### 11.4 Segurança

**RNF-09: Autenticação**
- Login via WhatsApp (OTP)
- Sessão expira em 7 dias (mobile) ou 24h (web)
- 2FA opcional para donos

**RNF-10: Autorização**
- Role-based access control (Owner, Receptionist)
- Tenants isolados (não podem ver dados de outros salões)

**RNF-11: Criptografia**
- HTTPS obrigatório (TLS 1.3)
- Tokens sensíveis (Z-API) criptografados em repouso
- Dados pessoais (telefone) mascarados em logs

**RNF-12: Rate Limiting**
- API pública: 100 req/min por IP
- API interna: 1.000 req/min por tenant
- WhatsApp: 10 msgs/min por instância (anti-ban)

### 11.5 Usabilidade

**RNF-13: Acessibilidade**
- Interface responsiva (mobile, tablet, desktop)
- Contraste mínimo: WCAG AA
- Fontes legíveis (min 14px em mobile)

**RNF-14: Compatibilidade**
- Browsers: Chrome, Safari, Firefox (últimas 2 versões)
- Mobile: iOS 14+, Android 9+
- WhatsApp: Multi-device (não precisa celular online)

**RNF-15: Idioma e Localização**
- Português brasileiro
- Timezone: UTC-3 (Brasília)
- Moeda: Real (R$)
- Formato de data: DD/MM/AAAA

### 11.6 Manutenibilidade

**RNF-16: Código**
- Cobertura de testes: >70%
- Linter/formatter configurado (ESLint, Prettier)
- Code review obrigatório (pull requests)

**RNF-17: Monitoramento**
- Logs centralizados (Sentry ou similar)
- Alertas automáticos (erro rate >5%, latência >5s, uptime <99%)
- Dashboard de observabilidade (APM)

**RNF-18: Deploy**
- CI/CD automatizado (GitHub Actions)
- Deploy sem downtime (blue-green ou rolling)
- Rollback automático se health check falhar

### 11.7 Compliance e Legal

**RNF-19: LGPD**
- Consentimento explícito antes de contatar clientes
- Direito de acesso (exportar dados)
- Direito de exclusão (hard delete)
- Minimização de dados (deletar inativos após 30 dias)

**RNF-20: WhatsApp Terms**
- Transparência de identidade (bot admite ser IA)
- Opt-out fácil ("SAIR")
- Não enviar spam (respeitar rate limits)
- Purpose-driven chatbot (não é general-purpose)

---

## 12. Estratégia de Go-to-Market

### 12.1 Posicionamento

**Tagline:** "Recupere clientes que sumiram com um robô no WhatsApp"

**Elevator Pitch (30 segundos):**
> "Agenda Cheia é um robô que vive no WhatsApp do seu salão e lembra automaticamente os clientes de voltar no momento certo. Você importa sua lista, e o sistema faz o resto. Resultado: até R$ 8.000/mês em receita recuperada. E o melhor: você só paga depois de recuperar os primeiros 5 clientes."

**Categoria:** Growth Layer / Revenue Recovery Tool (NÃO CRM)

### 12.2 Modelo de Precificação

**Fase 1: "Desafio 5 Clientes" (Trial Gamificado)**
- Grátis até recuperar 5 clientes
- Zero risco para o salão
- Objetivo: Provar valor antes de cobrar

**Fase 2: Modelo Pago**
- **Plano Básico:** R$ 49/mês
  - Até 300 clientes
  - Recalls ilimitados
  - 1 usuário

- **Plano Pro:** R$ 99/mês (futuro)
  - Até 1.000 clientes
  - Recalls + Reativação + Ofertas
  - 3 usuários
  - Relatórios avançados

**Comparação com Concorrentes:**
| Solução | Preço/mês | Setup | Foco |
|---------|-----------|-------|------|
| Trinks | R$ 150 | 2 semanas | CRM Completo |
| Avec | R$ 120 | 1 semana | CRM + Agendamento |
| **Agenda Cheia** | **R$ 49** | **5 minutos** | **Só Recuperação de Receita** |

### 12.3 Canais de Aquisição

**Fase MVP (Primeiros 100 Clientes):**

**1. Vendas Diretas (Outbound)**
- Visita presencial a salões (raio 10km)
- Pitch: "Deixa eu testar grátis no seu salão essa semana?"
- Meta: 5 salões/semana

**2. Instagram Ads (Inbound)**
- Público: Donos de salão, 30-55 anos, interesse em "gestão de salão"
- Criativo: Vídeo 30s mostrando dashboard "R$ Recuperados"
- Budget: R$ 500/mês
- Meta: 10 leads/semana, conversão 20% = 2 clientes

**3. Indicação (Referral)**
- Programa: "Indique e ganhe 1 mês grátis"
- Mecânica: Dono atual compartilha link, novo dono cadastra
- Meta: 15% dos clientes virem de indicação (após mês 3)

**4. Parcerias (Distribuidores)**
- Fabricantes de produtos de beleza (Wella, L'Oréal)
- Associações de beleza (ABIHPEC regional)
- Consultores de salão

**Fase Crescimento (100-500 Clientes):**
- Google Ads ("CRM para salão", "sistema para salão")
- YouTube (tutoriais "Como encher sua agenda")
- TikTok (virais de donos mostrando resultados)

### 12.4 Ativação e Retenção

**Onboarding Ativo:**
- Email D+1: "Como tá indo? Precisa de ajuda?"
- WhatsApp D+3: "Já enviou os primeiros recalls?"
- Call D+7: Se não enviou nenhum recall, ligar e ajudar

**Marcos de Sucesso (Milestones):**
- 1º recall enviado (D+0)
- 1º cliente responde (D+1-3)
- 1º cliente agenda (D+1-7)
- 5º cliente agenda → Conversão paga (D+7-30)

**Prevenção de Churn:**
- Alert se 7 dias sem atividade → Email de reengage
- NPS mensal (detectar insatisfação cedo)
- Dashboard de "salões em risco" (CS proativo)

---

## 13. Métricas de Sucesso

### 13.1 Métricas de Produto (AARRR)

**Acquisition (Aquisição)**
- **CAC (Customer Acquisition Cost):** <R$ 150
- **Leads/semana:** 20 (meta mês 3)
- **Fonte principal:** Instagram Ads + Indicação

**Activation (Ativação)**
- **% que envia 1º recall:** >80% (D+7)
- **Time-to-First-Value:** <24h (tempo até 1º recall enviado)
- **Taxa de completude do onboarding:** >90%

**Retention (Retenção)**
- **Churn mensal:** <5%
- **Clientes ativos D+30:** >70%
- **NPS:** >50

**Revenue (Receita)**
- **Conversão Trial→Pago:** >30%
- **MRR (Month 3):** R$ 1.500
- **LTV (Lifetime Value):** >R$ 600 (12 meses × R$ 50)
- **LTV/CAC:** >4x

**Referral (Indicação)**
- **Taxa de indicação:** >15% (clientes que indicam)
- **Viral coefficient:** 0,3 (cada cliente traz 0,3 novos)

### 13.2 Métricas de Efetividade (Produto)

**Recall Performance:**
- **Taxa de entrega WhatsApp:** >95%
- **Taxa de resposta:** >20%
- **Taxa de conversão (resposta→agendamento):** >50%
- **ROI médio para o salão:** >10x (R$ 500 recuperado / R$ 50 pago)

**Bot Performance:**
- **Acurácia de intent:** >85%
- **Taxa de escalação para humano:** <15%
- **Satisfação com IA (cliente final):** >4/5

### 13.3 Métricas de Negócio (Salão)

**Impacto Financeiro (Valor Gerado):**
- **Receita média recuperada/salão:** R$ 5.000/mês
- **Clientes recuperados/salão:** 8-12/mês
- **Aumento de taxa de retorno:** +21pp (de 62% para 83%)

**Eficiência Operacional:**
- **Tempo economizado/semana:** 8h (que era gasto em recall manual)
- **Redução de no-show:** -50% (de 15% para 7,5%)

### 13.4 OKRs (Objectives & Key Results) - Q1 2026

**Objetivo 1: Validar Product-Market Fit**
- KR1: 50 salões ativos (enviando recalls regularmente)
- KR2: NPS >50
- KR3: 30% conversão Trial→Pago

**Objetivo 2: Provar Valor ao Cliente**
- KR1: R$ 250.000 recuperados para salões (total)
- KR2: Média de R$ 5.000/salão recuperados/mês
- KR3: 80% dos salões recuperam ≥5 clientes no trial

**Objetivo 3: Construir Motor de Growth**
- KR1: CAC <R$ 150
- KR2: 15% dos clientes virem de indicação
- KR3: Payback <3 meses

---

## 14. Roadmap e Fases

### 14.1 Fase 0: Pré-Lançamento (Semana -2 a -1)

**Objetivos:**
- Validar hipóteses com 5 salões beta
- Refinar messaging e onboarding

**Atividades:**
- [ ] Recrutar 5 salões para beta fechado
- [ ] Fazer onboarding manual (presencial)
- [ ] Coletar feedback qualitativo
- [ ] Iterar em bugs críticos
- [ ] Definir pricing final

**Entregáveis:**
- 5 casos de sucesso documentados
- Vídeos de depoimento (reels)
- Pricing validado

---

### 14.2 Fase 1: MVP (Semana 1-3)

**Objetivos:**
- Construir funcionalidades core
- Setup de infraestrutura

**Features Obrigatórias:**
- [x] F001: Onboarding e configuração
- [x] F002: Upload de clientes (CSV)
- [x] F003: Recall automático
- [x] F004: Negociação de horário (bot)
- [x] F005: Lazy Sync (confirmação humana)
- [x] F006: Dashboard "R$ Recuperados"
- [x] F007: Inbox de conversas
- [x] F008: Reativação de inativos
- [x] F009: Opt-out automático

**Tech Stack:**
- Backend: Node.js + NestJS
- Frontend: React + Vite
- Database: Supabase (PostgreSQL)
- WhatsApp: Z-API
- AI: OpenAI GPT-4o mini
- Hosting: Railway + Vercel

**Critérios de Saída:**
- Sistema funciona end-to-end
- 3 salões beta usando em produção
- Zero bugs críticos

---

### 14.3 Fase 2: Lançamento Suave (Semana 4-8)

**Objetivos:**
- Escalar de 5 para 50 salões
- Validar modelo de aquisição

**Atividades:**
- [ ] Campanha Instagram Ads (R$ 500/mês)
- [ ] Vendas diretas (visita presencial)
- [ ] Programa de indicação
- [ ] Landing page otimizada (A/B test)
- [ ] Onboarding automatizado (reduzir fricção)

**Métricas de Sucesso:**
- 50 salões ativos
- 30% conversão Trial→Pago
- CAC <R$ 150
- NPS >50

---

### 14.4 Fase 3: Otimização (Semana 9-12)

**Objetivos:**
- Reduzir churn
- Aumentar LTV
- Preparar escala

**Features Adicionais:**
- [ ] F010: A/B testing de mensagens
- [ ] F011: Relatório semanal via WhatsApp
- [ ] F012: Segmentação avançada
- [ ] Painel de analytics avançado
- [ ] Integração com Trinks/Avec (API)

**Otimizações:**
- Reduzir tempo de onboarding de 10→5 min
- Melhorar acurácia do bot de 85%→90%
- Aumentar taxa de resposta de 20%→25%

**Critérios de Saída:**
- 100 salões ativos
- Churn <5%/mês
- LTV/CAC >4x
- Produto escalável (sem intervenção manual)

---

### 14.5 Fase 4: Crescimento (Mês 4-6)

**Objetivos:**
- Escalar de 100 para 500 salões
- Expandir canais de aquisição

**Atividades:**
- [ ] Google Ads
- [ ] YouTube (conteúdo educacional)
- [ ] Parcerias com distribuidores
- [ ] Plano Pro (upsell)
- [ ] API pública (integrações)

**Meta Financeira:**
- 500 salões × R$ 50 = R$ 25.000 MRR
- Churn <5%
- CAC <R$ 100 (economias de escala)

---

### 14.6 Backlog Futuro (Mês 7+)

**Expansão de Produto:**
- Módulo de fidelidade (programa de pontos)
- NPS automático pós-atendimento
- Envio de fotos (portfólio da profissional)
- Integração com Pix (pagamento antecipado)
- Dashboard para cliente final (histórico de visitas)

**Expansão de Mercado:**
- Clínicas de estética
- Pet shops
- Academias
- Dentistas

---

## 15. Premissas e Restrições

### 15.1 Premissas de Negócio

**P1: Donos de salão têm lista de clientes**
- Premissa: 80% dos salões têm lista digital (planilha ou sistema)
- Validação: Entrevistas com 15 salões (93% confirmaram)
- Risco: Se falsa, precisamos de captura manual (aumenta fricção)

**P2: WhatsApp é canal preferido**
- Premissa: 90% dos salões usam WhatsApp para comunicação
- Validação: Observação direta + pesquisa
- Risco: Baixo (WhatsApp é ubíquo no Brasil)

**P3: Cliente final aceita bot**
- Premissa: Clientes não se importam de conversar com IA (se transparente)
- Validação: Teste beta com 50 clientes (87% avaliação positiva)
- Risco: Se falsa, precisamos humanizar mais ou adicionar takeover

**P4: Ciclo de beleza é previsível**
- Premissa: Cada serviço tem ciclo médio (unha=21d, cabelo=35d)
- Validação: Análise de 5 salões piloto
- Risco: Variação individual alta pode reduzir acurácia

**P5: Recall aumenta retorno em ≥15pp**
- Premissa: Recall automatizado aumenta taxa de retorno de 62%→77%+
- Validação: Piloto com 3 salões (aumento de 21pp)
- Risco: Se <10pp, ROI pode não justificar preço

### 15.2 Premissas Técnicas

**P6: Z-API é estável**
- Premissa: Z-API entrega 95%+ mensagens sem ban
- Validação: Reputação no mercado + testes
- Risco: Se instável, precisamos fallback (Evolution API)

**P7: GPT-4o mini é suficiente**
- Premissa: Modelo consegue 85%+ acurácia em intent detection
- Validação: Testes com 100 conversas reais
- Risco: Se insuficiente, upgrade para GPT-4o (4x mais caro)

**P8: Infraestrutura escala até 500 salões**
- Premissa: Railway + Supabase aguentam 500 salões sem refatoração
- Validação: Load testing (simulação)
- Risco: Se falsa, migração precoce para AWS (custo↑)

### 15.3 Restrições

**R1: Budget Limitado**
- Orçamento MVP: R$ 5.000 (infra + ads)
- Impossibilita: Marketing massivo, vendas escaladas
- Implica: Foco em vendas diretas + orgânico

**R2: Equipe Pequena**
- 2 pessoas (1 dev full-stack + 1 product/growth)
- Impossibilita: Desenvolvimento paralelo de features
- Implica: Roadmap sequencial, MVP enxuto

**R3: Compliance LGPD/WhatsApp**
- Obrigações legais rígidas
- Impossibilita: Envio agressivo de mensagens
- Implica: Rate limiting conservador, opt-out fácil

**R4: Dependência de Z-API**
- Vendor lock-in (pelo menos no MVP)
- Impossibilita: Controle total da infraestrutura
- Implica: Risco de downtime/ban fora do nosso controle

**R5: Timezone e Idioma**
- Foco exclusivo: Brasil, português
- Impossibilita: Expansão internacional imediata
- Implica: Código pode ter hard-coded PT-BR (refatorar depois)

---

## 16. Riscos e Mitigações

### 16.1 Riscos Técnicos

#### R01: Ban de Número WhatsApp (Probabilidade: Média | Impacto: Alto)

**Descrição:** Meta pode banir número do salão por uso de automação.

**Sinais de Alerta:**
- Quality Rating passa de verde→amarelo→vermelho
- Taxa de bloqueio >2%
- Taxa de denúncia >0,5%

**Mitigação:**
- Rate limiting rigoroso (10 msgs/min máx)
- Delay randômico entre envios (5-15s)
- A/B test de templates (validar antes de escalar)
- Disclaimer no onboarding (isenção de responsabilidade)
- Monitoramento em tempo real de Quality Rating

**Contingência:**
- Fallback para Evolution API (self-hosted)
- Múltiplas instâncias Z-API por salão (rotação)
- Seguro de reembolso para salão afetado

**Responsável:** Tech Lead

---

#### R02: Downtime de Serviços Externos (Probabilidade: Baixa | Impacto: Médio)

**Descrição:** Z-API, OpenAI ou Supabase fora do ar.

**Mitigação:**
- Circuit breaker pattern (Axios retry)
- Timeout agressivo (10s máx)
- Fila persistente (mensagens não perdidas)
- Fallback para resposta template (se IA falhar)

**Contingência:**
- Status page público (transparência)
- Notificação proativa aos salões afetados
- SLA commitment: Reembolso proporcional se uptime <99%

**Responsável:** DevOps

---

#### R03: Performance Degradada (Probabilidade: Média | Impacto: Médio)

**Descrição:** Sistema lento com crescimento de base (100→500 salões).

**Sinais de Alerta:**
- Latência de API >2s (P95)
- Queue delay >5 minutos
- Database CPU >80%

**Mitigação:**
- Load testing semanal
- Database indexes otimizados
- Caching de queries frequentes (Redis)
- Monitoramento APM (Sentry)

**Contingência:**
- Escalonamento vertical (upgrade de servidor)
- Otimização de queries (EXPLAIN ANALYZE)
- Sharding de database (se necessário)

**Responsável:** Tech Lead

---

### 16.2 Riscos de Produto

#### R04: Baixa Conversão Trial→Pago (<20%) (Probabilidade: Média | Impacto: Alto)

**Descrição:** Salões não convertem após "Desafio 5 Clientes".

**Causas Possíveis:**
- Onboarding muito complexo (não completam trial)
- Produto não gera valor percebido
- Preço alto demais (R$ 50)
- Concorrência oferece grátis

**Mitigação:**
- Onboarding super simplificado (3 telas)
- Métricas de "dopamina" (R$ Recuperados)
- Incentivo extra: "3 clientes = 1 mês grátis"
- Pricing dinâmico (A/B test R$ 50 vs R$ 39)

**Contingência:**
- Pivot para freemium (10 recalls/mês grátis)
- Modelo de revenue share (% da receita recuperada)

**Responsável:** Product Manager

---

#### R05: Alta Taxa de Churn (>10%/mês) (Probabilidade: Baixa | Impacto: Alto)

**Descrição:** Salões cancelam assinatura após poucos meses.

**Causas Possíveis:**
- Produto não entrega valor contínuo
- Bugs/frustração
- Concorrente melhor
- Salão fechou

**Mitigação:**
- NPS mensal (detectar insatisfação cedo)
- Customer Success proativo (liga se 7 dias sem uso)
- Feature de reengagement (relatório de impacto)
- Programa de fidelidade (desconto anual)

**Contingência:**
- Entrevista de churn (entender motivo)
- Oferta de win-back (1 mês grátis)

**Responsável:** Head of CS

---

### 16.3 Riscos de Negócio

#### R06: CAC Muito Alto (>R$ 200) (Probabilidade: Média | Impacto: Médio)

**Descrição:** Custo de adquirir cliente inviabiliza negócio.

**Mitigação:**
- Foco em canais orgânicos (indicação, SEO)
- Vendas diretas (custo controlado)
- Parcerias (distribuição sem CAC)
- Landing page otimizada (CRO)

**Contingência:**
- Aumentar preço (R$ 50→R$ 69) para compensar
- Upsell para Plano Pro (aumentar LTV)

**Responsável:** Growth Lead

---

#### R07: Concorrência (Probabilidade: Baixa | Impacto: Médio)

**Descrição:** CRM grande (Trinks, Avec) adiciona recall automatizado.

**Mitigação:**
- Defender diferenciação (simplicidade, preço, proof-first)
- Foco em nicho (salões que NÃO usam CRM)
- Velocity de produto (iterar mais rápido)

**Contingência:**
- Pivot para complemento (integração nativa com CRMs)
- Foco em atendimento superior (white-glove)

**Responsável:** CEO/Founder

---

### 16.4 Riscos Legais

#### R08: Multa LGPD (Probabilidade: Baixa | Impacto: Crítico)

**Descrição:** ANPD multa por não conformidade (até 2% faturamento ou R$ 50M).

**Mitigação:**
- Click-wrap obrigatório (prova de consentimento)
- Auto-deleção de dados inativos (30 dias)
- Endpoints de direitos do titular (export, delete)
- Termo de uso revisado por advogado especialista

**Contingência:**
- Seguro de cyber liability
- Consultoria jurídica on-retainer

**Responsável:** Legal/Compliance

---

## 17. Considerações Legais e Compliance

### 17.1 LGPD (Lei Geral de Proteção de Dados)

**Aplicabilidade:**
Agenda Cheia processa dados pessoais (nome, telefone) de clientes finais dos salões. Somos **Operador de Dados**, salão é **Controlador**.

**Bases Legais:**
- **Consentimento:** Para envio de mensagens de marketing/recall
- **Legítimo Interesse:** Para clientes com relação comercial ativa (<90 dias)

**Implementações Obrigatórias:**

**17.1.1 Consentimento Informado**
- Checkbox no onboarding (não pré-marcado)
- Texto claro sobre uso de dados
- Armazenamento de timestamp de aceite
- Versionamento do termo (auditoria)

**17.1.2 Minimização de Dados**
- Coletar apenas nome + telefone + histórico de serviços
- Deletar dados de clientes inativos após 30 dias automaticamente
- Não armazenar dados sensíveis (CPF, endereço, cartão)

**17.1.3 Direitos do Titular**
Cliente final pode exercer:
- **Acesso:** Exportar seus dados (JSON)
- **Retificação:** Corrigir dados incorretos
- **Exclusão:** Hard delete (não soft delete)
- **Portabilidade:** Exportar em formato estruturado
- **Revogação:** Opt-out de comunicações

**Endpoints:**
- `GET /api/v1/data-subject/export?phone=11999998888`
- `DELETE /api/v1/data-subject/delete?phone=11999998888`
- `PATCH /api/v1/data-subject/opt-out?phone=11999998888`

**Prazo de Atendimento:** 15 dias (conforme LGPD Art. 18)

**17.1.4 Segurança da Informação**
- Criptografia em trânsito (HTTPS/TLS 1.3)
- Criptografia em repouso (tokens sensíveis)
- Controle de acesso (RBAC)
- Logs de auditoria (quem acessou o quê e quando)
- Backup seguro (7 dias de retenção)

**17.1.5 DPO (Data Protection Officer)**
- Designar responsável por LGPD
- Email público: dpo@agendacheia.com.br
- Atender requisições de titulares

---

### 17.2 WhatsApp Business API - Compliance 2026

**Novas Regras Meta (Janeiro 2026):**

**Proibido:**
- ❌ General-purpose AI chatbots (conversas abertas sobre qualquer assunto)
- ❌ Falsidade ideológica (bot se passar por humano)
- ❌ Spam (enviar sem consentimento)

**Permitido:**
- ✅ Business automation flows (agendamento, suporte, recall)
- ✅ IA com propósito específico (não genérico)
- ✅ Transparência de identidade (admitir ser bot)

**Nossa Implementação:**

**17.2.1 Bot Purpose Declaration**
Sistema prompt define escopo claro:
```
Você é Júlia, assistente virtual do [Salão].
Seu ÚNICO objetivo é ajudar com:
1. Agendamento de serviços
2. Lembretes de retorno
3. Dúvidas sobre serviços/horários

NÃO responda perguntas fora deste escopo.
```

**17.2.2 Transparência de Identidade**
Se cliente perguntar "Você é robô?", resposta obrigatória:
> "Sou a assistente virtual inteligente do salão! 🤖 Mas tô aqui pra te ajudar com agendamentos."

**17.2.3 Opt-in Strategy**
Primeira mensagem inclui soft opt-in:
> "Oi [Nome]! É a Júlia do [Salão]. Posso te avisar quando tiver promoções e horários? (Responda SIM ou NÃO)"

**17.2.4 Opt-out Fácil**
Rodapé de toda mensagem:
> "Para parar mensagens, responda SAIR"

Palavras-chave detectadas: SAIR, PARAR, CANCELAR, NÃO QUERO

**17.2.5 Quality Rating Management**
- Monitorar Quality Rating diariamente
- Alerta se cair para amarelo (<verde)
- Pausa automática de envios se ficar vermelho
- A/B test de templates (validar antes de escalar)

**17.2.6 Rate Limiting Anti-Ban**
- Máximo 10 mensagens/minuto por instância
- Delay randômico 5-15 segundos entre envios
- Máximo 3 tentativas de recall por cliente
- Pausa de 48h entre tentativas

---

### 17.3 Código de Defesa do Consumidor (CDC)

**Artigo 37 - Publicidade Enganosa:**
Bot não pode se passar por humano ou enganar cliente sobre natureza do serviço.

**Nossa Implementação:**
- Nome "Júlia" + subtítulo "Assistente Virtual"
- Admissão explícita se questionado
- Transparência sobre automação

**Artigo 6º - Direito à Informação:**
Cliente final tem direito de saber:
- Quem está entrando em contato (nome do salão)
- Por que está recebendo mensagem (recall baseado em visita anterior)
- Como parar de receber (SAIR)

---

### 17.4 Termo de Uso e Política de Privacidade

**Documentos Obrigatórios:**

**17.4.1 Termo de Uso (Para Salões)**
Cobre:
- Responsabilidade por dados de clientes
- Proibição de uso para spam
- Isenção de responsabilidade por ban
- Política de cancelamento/reembolso
- SLA e uptime commitment

**17.4.2 Política de Privacidade (Para Clientes Finais)**
Cobre:
- Quais dados coletamos (nome, telefone, histórico)
- Por que coletamos (recall, agendamento)
- Quem tem acesso (salão contratante)
- Quanto tempo armazenamos (30 dias se inativo)
- Como exercer direitos (email, telefone)

**17.4.3 Contrato de Processamento de Dados (DPA)**
Acordo entre Agenda Cheia (Operador) e Salão (Controlador):
- Escopo de processamento
- Medidas de segurança
- Subcontratação (Supabase, Z-API)
- Notificação de incidentes (72h)
- Auditoria (mediante solicitação)

---

### 17.5 Licenças e Regulamentações

**Registro de Software:**
- Registro no INPI (opcional, mas recomendado)
- Copyright notices no código

**Tributação:**
- Enquadramento: Simples Nacional ou Lucro Presumido
- ISS (Imposto Sobre Serviços): 2-5% sobre faturamento
- Nota fiscal eletrônica (NFS-e)

**Marca Registrada:**
- Registro da marca "Agenda Cheia" no INPI
- Proteção de logo e identidade visual

---

## 18. Apêndices

### 18.1 Glossário de Termos

| Termo | Definição |
|-------|-----------|
| **Recall** | Ação de lembrar cliente de voltar ao salão (retorno) |
| **Ciclo de Beleza** | Intervalo ideal entre visitas para cada serviço (ex: unha = 21 dias) |
| **Churn** | Cliente que deixou de frequentar o salão (>90 dias sem visita) |
| **Lazy Sync** | Confirmação humana assíncrona via emoji (👍/👎) ao invés de integração complexa |
| **Opt-out** | Cliente que solicitou parar de receber mensagens |
| **Quality Rating** | Métrica do WhatsApp que indica saúde do número (verde/amarelo/vermelho) |
| **Growth Layer** | Camada de software que aumenta receita sem substituir sistemas existentes |
| **Tenant** | Salão de beleza (inquilino na arquitetura multi-tenant) |
| **CAC** | Customer Acquisition Cost (custo para adquirir cliente) |
| **LTV** | Lifetime Value (valor total gerado por cliente ao longo do tempo) |
| **MRR** | Monthly Recurring Revenue (receita recorrente mensal) |
| **NPS** | Net Promoter Score (métrica de satisfação: "Recomendaria?") |

### 18.2 Referências e Pesquisas

**Mercado:**
- ABIHPEC (Associação Brasileira da Indústria de Higiene Pessoal, Perfumaria e Cosméticos) - Dados de mercado de salões
- Sebrae - Estatísticas de pequenos negócios

**Comportamento do Consumidor:**
- "The Loyalty Economy" (Bain & Company) - ROI de retenção
- WhatsApp Business Report 2025 - Uso empresarial no Brasil

**Técnico:**
- Meta WhatsApp Business Policy (2026)
- LGPD (Lei 13.709/2018)
- CDC (Lei 8.078/1990)

### 18.3 Templates de Mensagem

**Recall Padrão:**
```
Oi {nome}! É a {nome_bot} do {nome_salao} 💅

Notei que faz uns {dias} dias que você fez {servico} com a {profissional}.
Tá na hora da manutenção!

Tenho uma vaga na {dia_semana} {horario}. Quer que eu segure pra você?
```

**Reativação (>60 dias):**
```
Oi {nome}! É a {nome_bot} do {nome_salao} 😊

Sumida! Faz tempo que você não aparece aqui...

Tenho um presente pra você voltar:
🎁 {oferta}

Tá valendo! Quer aproveitar?
```

**Confirmação de Agendamento:**
```
Confirmado! {dia_semana} {horario} com a {profissional}. Te espero lá! 😊

📍 {endereco}
📞 Qualquer coisa, me chama!

Para cancelar/reagendar, responda CANCELAR
```

### 18.4 Fluxograma de Decisão (Salão)

```
Dono de Salão descobre Agenda Cheia
          ↓
   Cadastro (5 min)
          ↓
   Upload de clientes (CSV)
          ↓
   Conecta WhatsApp (QR Code)
          ↓
   Sistema envia primeiros recalls
          ↓
   Acompanha dashboard
          ↓
   Recebe confirmações (Lazy Sync)
          ↓
   Vê R$ Recuperados crescendo
          ↓
   [Decisão: Continuar?]
     ↓              ↓
   SIM            NÃO
     ↓              ↓
   Paga R$ 49    Cancela
     ↓
   Uso contínuo
```

### 18.5 Casos de Uso Detalhados

Ver seção 10 (Jornadas do Usuário) para casos detalhados.

### 18.6 Perguntas Frequentes (FAQ)

**Para Donos de Salão:**

**1. Preciso trocar meu sistema atual?**
Não. Agenda Cheia funciona em paralelo com qualquer sistema (ou caderno).

**2. Como funciona o "Desafio 5 Clientes"?**
Você usa grátis até recuperar 5 clientes. Depois, paga R$ 49/mês.

**3. E se meu número do WhatsApp for banido?**
Seguimos todas as regras da Meta. Se houver ban (improvável), orientamos recuperação.

**4. Posso personalizar as mensagens?**
Sim, você pode editar templates no dashboard.

**5. Quanto tempo economizo?**
Em média, 8h/semana que seriam gastas com recall manual.

**Para Clientes Finais:**

**1. Como paro de receber mensagens?**
Responda "SAIR" a qualquer momento.

**2. Meus dados estão seguros?**
Sim. Só armazenamos nome e telefone, e deletamos após 30 dias de inatividade.

**3. Posso falar com uma pessoa?**
Sim. O bot escala para humano quando necessário.

---

## Aprovação e Sign-Off

**Documento Preparado Por:**
- Product Manager: [Nome]
- Data: 06/01/2026

**Revisado Por:**
- Tech Lead: [Nome] - [Aprovado/Pendente]
- Head of Growth: [Nome] - [Aprovado/Pendente]
- Legal/Compliance: [Nome] - [Aprovado/Pendente]

**Aprovado Por:**
- CEO/Founder: [Nome] - [Aprovado/Pendente]
- Data de Aprovação: ___/___/___

**Próxima Revisão:** 06/02/2026 (ou após MVP launch)

---

**FIM DO PRODUCT REQUIREMENTS DOCUMENT**
