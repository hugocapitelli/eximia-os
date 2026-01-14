================================================================================
O QUE A INTELIGÊNCIA ARTIFICIAL FAZ NA PLATAFORMA HARVEN.AI
================================================================================

Este documento explica detalhadamente todas as funcionalidades de Inteligência
Artificial implementadas na plataforma HARVEN.AI e como elas contribuem para
a experiência educacional.

Data de criação: 2024
Versão: 1.0.0

================================================================================
1. VISÃO GERAL
================================================================================

A plataforma HARVEN.AI utiliza Inteligência Artificial de forma estratégica para:

1. Processar e estruturar conteúdo educacional automaticamente
2. Gerar perguntas socráticas de alta qualidade
3. Conduzir diálogos socráticos interativos com alunos
4. Detectar uso de IA nas respostas dos alunos
5. Avaliar e garantir qualidade do conteúdo processado
6. Extrair insights e metadados de materiais educacionais

A IA é implementada através de um sistema multi-agente, onde cada agente tem
responsabilidades específicas e trabalha em conjunto para criar uma experiência
educacional rica e personalizada.

================================================================================
2. SISTEMA MULTI-AGENTE
================================================================================

A plataforma utiliza uma arquitetura de múltiplos agentes de IA, coordenados por
um Agente CEO (Chief Executive Officer) que orquestra todas as operações.

2.1. Agente CEO (Orquestrador)
-------------------------------
Localização: backend/app/agents/ceo.py

Responsabilidades:
- Recebe requisições e delega para agentes especializados
- Gerencia fluxo de trabalho entre agentes
- Coordena comunicação entre diferentes agentes
- Garante que cada tarefa seja executada pelo agente mais adequado

Tarefas gerenciadas:
- socratic_chat_start: Inicia sessão de chat socrático
- socratic_chat_message: Processa mensagem no chat
- socratic_chat_finalize: Finaliza sessão
- intelligent_partition: Particiona conteúdo em capítulos
- intelligent_partition_edit: Edita estrutura de particionamento
- generate_questions_from_payload: Gera perguntas socráticas
- evaluate_answer: Avalia respostas do aluno
- search_context: Busca contexto relevante

2.2. Agentes Especializados
----------------------------

2.2.1. Agente CRIADOR
Localização: backend/app/agents/roles/criador.py

O que faz:
- Gera perguntas socráticas iniciais baseadas no conteúdo do capítulo
- Analisa o material educacional para identificar pontos-chave
- Cria perguntas provocativas que estimulam o pensamento crítico
- Considera objetivos de aprendizagem e nível de dificuldade
- Evita perguntas genéricas como "O que é X?" ou "Explique Y"

Como funciona:
1. Recebe conteúdo do capítulo (texto, HTML, JSON)
2. Analisa o material com IA (OpenAI/Azure OpenAI)
3. Identifica conceitos principais e relações
4. Gera até 3 perguntas socráticas de alta qualidade
5. Retorna perguntas com metadados (tipo, nível, intenção)

2.2.2. Agente ORIENTADOR
Localização: backend/app/agents/roles/orientador.py

O que faz:
- Conduz o diálogo socrático com o aluno durante o chat
- Fornece feedback construtivo sobre as respostas do aluno
- Faz perguntas provocativas que aprofundam o raciocínio
- Mantém o foco no tema do capítulo estudado
- Adapta o nível de profundidade conforme as interações

Como funciona:
1. Recebe mensagem do aluno e histórico da conversa
2. Analisa a resposta do aluno em relação ao conteúdo
3. Gera feedback honesto e contextualizado
4. Formula pergunta aberta que aprofunda o pensamento
5. Retorna resposta em formato fluido e natural (1-2 parágrafos)

Características da resposta:
- Primeiro parágrafo: feedback construtivo sobre a resposta
- Segundo parágrafo: pergunta aberta que aprofunda o raciocínio
- Sem rótulos artificiais como [Feedback] ou [Provocação]
- Linguagem natural e clara em português do Brasil
- Limite de 3 interações por sessão

2.2.3. Agente EDITOR
Localização: backend/app/agents/roles/editor.py

O que faz:
- Refina e melhora a resposta do ORIENTADOR
- Garante clareza, coesão e estilo socrático natural
- Remove rótulos artificiais e formatação desnecessária
- Mantém feedback construtivo e pergunta ao final
- Garante que a mensagem seja fluida e legível

Como funciona:
1. Recebe resposta do ORIENTADOR
2. Remove rótulos e formatação artificial
3. Melhora clareza e fluidez do texto
4. Garante separação de parágrafos com quebra de linha
5. Retorna mensagem polida e natural

2.2.4. Agente TESTADOR
Localização: backend/app/agents/roles/testador.py

O que faz:
- Valida a qualidade da resposta gerada pela IA
- Verifica se segue os princípios socráticos
- Garante que não há respostas diretas ou completas
- Confirma presença de feedback e pergunta
- Aprova ou reprova a mensagem com observações

Critérios de aprovação:
✅ Texto fluido e natural
✅ Feedback construtivo sobre resposta do aluno
✅ Pergunta aberta ao final
✅ Sem rótulos artificiais
✅ Conectado ao tema do capítulo
✅ Não dá respostas diretas

Critérios de reprovação:
❌ Respostas diretas ou completas
❌ Pergunta foge do tema
❌ Ausência de feedback construtivo
❌ Ausência de pergunta aberta
❌ Rótulos como [Feedback] ou [Provocação]
❌ Texto robótico ou genérico

2.2.5. Agente ANALISTA
Localização: backend/app/agents/roles/analista.py

O que faz:
- Coleta métricas sobre cada interação
- Detecta probabilidade de uso de IA pelo aluno
- Registra observações sobre a qualidade da conversa
- Gera relatórios de QA (Quality Assurance)
- Armazena dados para análise posterior

Métricas coletadas:
- Tamanho da mensagem
- Presença de pergunta na resposta
- Timestamp da interação
- Probabilidade de texto gerado por IA (0.0 a 1.0)
- Flags de alerta (ex: alta_probabilidade_texto_IA)

Detecção de IA:
- Analisa estilo de escrita (fluidez excessiva, ausência de erros)
- Verifica vocabulário (rebuscado demais, termos técnicos desnecessários)
- Examina estrutura (coerência excessiva, encadeamento artificial)
- Identifica padrões típicos de LLMs
- NÃO considera copy/paste como sinal de IA (comportamento normal)

2.2.6. Agente ORGANIZADOR
Localização: backend/app/agents/roles/organizador.py

O que faz:
- Gerencia persistência de mensagens no banco de dados
- Orquestra exportação para Moodle
- Salva turnos de conversa com metadados
- Finaliza sessões e prepara dados para exportação
- Gerencia fila de exportações pendentes

Como funciona:
1. Salva mensagens do aluno e da IA no banco
2. Decrementa contador de interações restantes
3. Ao finalizar, prepara payload para exportação Moodle
4. Tenta exportar automaticamente (background thread)
5. Se falhar, enfileira para reenvio posterior

2.2.7. Agente ORGANIZADOR (Particionamento)
Localização: backend/app/services/intelligent_processing.py

O que faz:
- Particiona documentos longos em capítulos lógicos
- Identifica estrutura e hierarquia do conteúdo
- Extrai texto de PDFs, DOCX, TXT, MD, JSON
- Preserva texto original (verbatim) para integridade
- Gera estrutura de capítulos com títulos e ordem

Como funciona:
1. Recebe arquivo (PDF, DOCX, etc.)
2. Extrai texto completo do arquivo
3. Usa IA para identificar pontos de divisão lógica
4. Gera estrutura de capítulos com títulos e conteúdo
5. Valida e refina a estrutura gerada
6. Salva capítulos com texto original preservado

2.2.8. Agente EXTRACTION
Localização: backend/app/agents/roles/extraction.py

O que faz:
- Extrai perguntas de arquivos enviados
- Processa diferentes formatos (TXT, PDF, DOCX, JSON)
- Identifica perguntas em documentos estruturados
- Normaliza formato das perguntas extraídas

2.2.9. Agente EVALUATION
Localização: backend/app/agents/roles/evaluation.py

O que faz:
- Avalia qualidade das respostas do aluno
- Analisa profundidade e coerência
- Fornece feedback detalhado sobre a resposta
- Gera relatórios de avaliação

2.2.10. Agente RESEARCH
Localização: backend/app/agents/roles/research.py

O que faz:
- Busca contexto relevante para enriquecer diálogos
- Pesquisa informações complementares
- Fornece contexto adicional quando necessário

================================================================================
3. PROCESSAMENTO INTELIGENTE DE CONTEÚDO
================================================================================

3.1. Pipeline de Processamento
-------------------------------
Localização: backend/app/services/processing_pipeline.py

O pipeline de processamento inteligente transforma documentos brutos em
conteúdo educacional estruturado e enriquecido.

Etapas do Pipeline:

1. EXTRAÇÃO DE TEXTO
   - Lê arquivo (PDF, DOCX, TXT, MD, JSON)
   - Extrai texto completo preservando estrutura
   - Computa hash SHA256 para verificação de integridade

2. PARSING ESTRUTURAL
   - Analisa texto e identifica blocos estruturais
   - Detecta títulos, parágrafos, listas, tabelas
   - Cria hierarquia de blocos com IDs únicos
   - Gera outline (estrutura) do documento
   - Preserva texto original (verbatim)

3. GERAÇÃO DE UNDERSTANDING PACK
   - Analisa conteúdo com IA para extrair:
     * Metadados (título, tema, objetivo de aprendizagem, nível)
     * Resumo estruturado (executivo, pontos-chave)
     * Conceitos principais com definições
     * Relações entre conceitos
     * Equívocos comuns
     * Exemplos práticos
   - Todas as informações incluem citações (IDs dos blocos de origem)
   - Garante que nada seja inventado (grounding)

4. GERAÇÃO DE PERGUNTAS SOCRÁTICAS ENRIQUECIDAS
   - Gera até 3 perguntas socráticas de alta qualidade
   - Cada pergunta inclui:
     * Texto da pergunta
     * Habilidade trabalhada (análise, síntese, aplicação, reflexão)
     * Intenção pedagógica
     * Profundidade esperada
     * Resposta superficial comum
     * Perguntas de acompanhamento
     * Citações dos blocos de origem
   - Evita perguntas genéricas
   - Foca em pensamento crítico

5. ARMAZENAMENTO
   - Salva texto original com hash
   - Armazena blocos estruturais
   - Persiste understanding pack
   - Salva perguntas socráticas enriquecidas
   - Cria registros de processamento com metadados

3.2. Particionamento Inteligente
---------------------------------
Localização: backend/app/services/ai_client.py

O que faz:
- Divide documentos longos em capítulos lógicos
- Identifica pontos de divisão natural
- Gera títulos apropriados para cada capítulo
- Mantém coerência temática em cada capítulo
- Permite processamento parcial (intervalo de páginas)

Modos de operação:
- Processamento completo: todo o documento
- Processamento parcial: intervalo específico (ex: páginas 10-20)
- Edição parcial: modifica estrutura existente com instruções

3.3. Edição de Estrutura
-------------------------
O que faz:
- Permite editar estrutura de capítulos já processados
- Recebe instruções em linguagem natural
- Modifica títulos, ordem, divisões
- Mantém integridade do conteúdo original
- Reprocessa apenas o necessário

Exemplo de instruções:
- "Divida o capítulo 2 em dois capítulos menores"
- "Renomeie o capítulo 3 para 'Aplicações Práticas'"
- "Combine os capítulos 4 e 5 em um único capítulo"

================================================================================
4. CHAT SOCRÁTICO INTERATIVO
================================================================================

4.1. Fluxo Completo do Chat
----------------------------

1. INÍCIO DA SESSÃO
   - Aluno seleciona capítulo
   - Sistema verifica se há sessão concluída (bloqueia nova se houver)
   - Se necessário, exibe 3 perguntas socráticas para seleção
   - Aluno escolhe uma pergunta
   - Sistema cria sessão com 3 interações restantes
   - IA envia pergunta inicial

2. INTERAÇÕES
   - Aluno envia mensagem
   - Sistema detecta probabilidade de uso de IA (antes de salvar)
   - Salva mensagem do aluno com flags de detecção
   - ORIENTADOR analisa resposta e contexto
   - Gera feedback construtivo + pergunta provocativa
   - EDITOR refina a resposta
   - TESTADOR valida qualidade
   - ANALISTA coleta métricas
   - Sistema salva resposta da IA
   - Decrementa interações restantes
   - Retorna resposta ao aluno

3. FINALIZAÇÃO
   - Após 3 interações, sessão finaliza automaticamente
   - Sistema prepara dados para exportação
   - Exporta automaticamente para Moodle (background)
   - Marca sessão como "completed" ou "exported"

4.2. Características do Chat
----------------------------

Limite de Interações:
- 3 interações por sessão
- Impede que aluno continue indefinidamente
- Força reflexão mais profunda em menos interações

Detecção de IA:
- Analisa cada mensagem do aluno
- Calcula probabilidade (0.0 = humano, 1.0 = IA)
- Aplica flag se probabilidade > 0.70
- NÃO bloqueia, apenas registra para professor

Feedback Construtivo:
- Reconhece pontos fortes
- Aponta limitações suavemente
- Corrige equívocos com respeito
- Traz nuances não mencionadas
- Não é obrigado a concordar

Perguntas Provocativas:
- Abrem o raciocínio
- Pedem exemplos práticos
- Convidam a refinar explicação
- Conectam conceito à prática
- Nunca dão resposta final

4.3. Qualidade e Validação
---------------------------

Garantia de Qualidade:
- TESTADOR valida cada resposta antes de enviar
- Garante formato fluido e natural
- Verifica presença de feedback e pergunta
- Rejeita respostas que dão respostas diretas
- Fallback automático se validação falhar

Métricas Coletadas:
- Tamanho das mensagens
- Presença de perguntas
- Timestamps
- Probabilidade de IA
- Flags de alerta
- Relatórios de QA

================================================================================
5. GERAÇÃO DE PERGUNTAS SOCRÁTICAS
================================================================================

5.1. Geração Automática
-----------------------
Localização: backend/app/services/ai_client.py

O que faz:
- Analisa conteúdo do capítulo
- Identifica conceitos principais
- Gera perguntas que estimulam pensamento crítico
- Considera objetivos de aprendizagem
- Adapta nível de dificuldade
- Evita perguntas genéricas

Parâmetros:
- chapter: Dados do capítulo
- contents: Conteúdos do capítulo (texto, HTML, etc.)
- max_questions: Número máximo de perguntas (padrão: 3)
- learning_objective: Objetivo de aprendizagem específico
- difficulty: Nível (iniciante, intermediário, avançado)
- raw_content: Texto bruto adicional
- course_context: Contexto do curso

Qualidade das Perguntas:
- Não são genéricas ("O que é X?")
- Exigem raciocínio, não apenas cópia
- São provocativas e abertas
- Conectam teoria à prática
- Têm citações dos blocos de origem

5.2. Perguntas Enriquecidas
----------------------------
Localização: backend/app/services/intelligent_processing.py

Além do texto da pergunta, cada pergunta inclui:

- skill: Habilidade trabalhada (análise, síntese, aplicação, reflexão)
- intention: O que a pergunta tenta desbloquear no aluno
- expected_depth: O que uma boa resposta tende a incluir
- common_shallow_answer: O que alunos tendem a responder superficialmente
- followup_prompts: Perguntas de acompanhamento
- citations: IDs dos blocos de origem no texto

5.3. Geração Manual
-------------------
Professores podem:
- Gerar perguntas automaticamente a partir de conteúdo
- Enviar arquivo adicional para contexto
- Especificar objetivo de aprendizagem
- Escolher nível de dificuldade
- Editar perguntas geradas manualmente

5.4. Exemplos de Perguntas Socráticas
--------------------------------------

A IA gera perguntas que são provocativas, abertas e exigem raciocínio. Abaixo
estão exemplos de perguntas socráticas que a plataforma pode gerar:

EXEMPLO 1: Sobre Gestão no Agronegócio
---------------------------------------
❌ Pergunta Genérica (EVITADA):
   "O que é gestão no agronegócio?"

✅ Pergunta Socrática (GERADA):
   "Como você relacionaria os desafios de gestão no agronegócio com as
   particularidades de um negócio que depende de fatores climáticos e
   biológicos imprevisíveis?"

Características:
- skill: análise
- intention: Fazer o aluno conectar conceitos abstratos com realidade prática
- expected_depth: Mencionar fatores climáticos, biológicos, sazonalidade,
  gestão de riscos, planejamento adaptativo
- common_shallow_answer: "Gestão no agronegócio é importante porque..."

EXEMPLO 2: Sobre Sustentabilidade
----------------------------------
❌ Pergunta Genérica (EVITADA):
   "Explique o que é sustentabilidade."

✅ Pergunta Socrática (GERADA):
   "Se um produtor rural precisa aumentar sua produção para atender à
   demanda crescente, mas também precisa preservar o solo para as
   próximas gerações, que critérios você usaria para avaliar se uma
   prática é realmente sustentável?"

Características:
- skill: síntese
- intention: Fazer o aluno criar critérios próprios de avaliação
- expected_depth: Mencionar equilíbrio entre produção e preservação,
  critérios mensuráveis, longo prazo vs curto prazo
- common_shallow_answer: "Sustentabilidade é usar recursos sem esgotar..."

EXEMPLO 3: Sobre Tecnologia no Campo
-------------------------------------
❌ Pergunta Genérica (EVITADA):
   "Quais são as tecnologias usadas no agronegócio?"

✅ Pergunta Socrática (GERADA):
   "Imagine que você é um consultor agrícola. Um produtor te pergunta:
   'Vale a pena investir em sensores IoT para monitoramento de solo?'
   Que aspectos você consideraria antes de dar uma recomendação?"

Características:
- skill: aplicação
- intention: Fazer o aluno aplicar conhecimento em cenário prático
- expected_depth: Custos vs benefícios, escala da propriedade, ROI,
  complexidade técnica, necessidade real
- common_shallow_answer: "IoT é importante porque melhora a produção..."

EXEMPLO 4: Sobre Mercado e Comercialização
-------------------------------------------
❌ Pergunta Genérica (EVITADA):
   "Descreva o mercado agrícola."

✅ Pergunta Socrática (GERADA):
   "Um pequeno produtor de orgânicos está tendo dificuldade para
   comercializar sua produção. Ele considera duas estratégias: vender
   diretamente ao consumidor em feiras ou buscar certificação para
   exportar. Como você ajudaria ele a tomar essa decisão?"

Características:
- skill: reflexão
- intention: Fazer o aluno considerar múltiplas perspectivas e trade-offs
- expected_depth: Análise de mercado local vs internacional, custos de
  certificação, capacidade de produção, perfil do consumidor
- common_shallow_answer: "Ele deveria exportar porque paga melhor..."

EXEMPLO 5: Sobre Políticas Públicas
------------------------------------
❌ Pergunta Genérica (EVITADA):
   "Defina políticas públicas para o agronegócio."

✅ Pergunta Socrática (GERADA):
   "Se você fosse formular uma política pública para incentivar a
   transição para práticas mais sustentáveis no agronegócio, que
   mecanismos você criaria para garantir que os produtores realmente
   adotem essas práticas, e não apenas recebam o incentivo sem mudar
   seu comportamento?"

Características:
- skill: síntese e análise
- intention: Fazer o aluno pensar em implementação prática e
  mecanismos de verificação
- expected_depth: Mecanismos de verificação, incentivos progressivos,
  penalidades, educação, acompanhamento técnico
- common_shallow_answer: "Daria subsídios para práticas sustentáveis..."

5.5. Padrões de Perguntas Socráticas
-------------------------------------

A IA segue estes padrões ao gerar perguntas:

1. CENÁRIOS PRÁTICOS
   - Coloca o aluno em situação real
   - "Imagine que você é..."
   - "Se você fosse..."
   - "Um produtor te pergunta..."

2. DILEMAS E TRADE-OFFS
   - Apresenta conflitos reais
   - "Mas também precisa..."
   - "Porém, ao mesmo tempo..."
   - "Que critérios você usaria..."

3. CONEXÕES E RELAÇÕES
   - Liga conceitos diferentes
   - "Como você relacionaria..."
   - "Que conexão você vê entre..."
   - "De que forma X se relaciona com Y..."

4. APLICAÇÃO PRÁTICA
   - Pede uso do conhecimento
   - "Como você ajudaria..."
   - "Que aspectos você consideraria..."
   - "Que estratégia você recomendaria..."

5. ANÁLISE CRÍTICA
   - Questiona pressupostos
   - "Por que você acha que..."
   - "O que aconteceria se..."
   - "Que evidências você usaria..."

5.6. Perguntas que a IA EVITA
------------------------------

A IA NÃO gera perguntas como:

❌ Perguntas de definição direta:
   - "O que é X?"
   - "Defina Y."
   - "Explique Z."

❌ Perguntas de lista:
   - "Quais são os tipos de..."
   - "Liste os fatores..."
   - "Enumere as características..."

❌ Perguntas de cópia:
   - "Descreva o que o texto diz sobre..."
   - "Repita o conceito de..."
   - "Transcreva a definição de..."

❌ Perguntas de sim/não:
   - "É verdade que..."
   - "Você concorda que..."
   - "A afirmação está correta?"

A IA SEMPRE gera perguntas que:
✅ Exigem raciocínio e análise
✅ Conectam teoria à prática
✅ Apresentam cenários reais
✅ Estimulam pensamento crítico
✅ Têm múltiplas respostas possíveis
✅ Aprofundam a compreensão

================================================================================
6. DETECÇÃO DE USO DE IA
================================================================================

6.1. Como Funciona
------------------
Localização: backend/app/agents/roles/analista.py

A detecção de IA analisa cada mensagem do aluno ANTES de salvá-la no banco.

Indicadores Analisados:

1. ESTILO DE ESCRITA
   - Fluidez excessivamente perfeita
   - Ausência de erros naturais
   - Tom impessoal

2. VOCABULÁRIO
   - Rebuscado demais para o contexto
   - Termos técnicos sem necessidade
   - Linguagem muito formal

3. ESTRUTURA
   - Coerência excessiva
   - Encadeamento artificial típico de LLMs
   - Padrões como "Em primeiro lugar...", "É importante ressaltar..."

4. CARACTERÍSTICAS HUMANAS
   - Ausência de erros naturais
   - Falta de informalidade
   - Estruturas muito perfeitas

O que NÃO é considerado sinal de IA:
- Copy/paste (comportamento normal e desejável)
- Digitação rápida
- Textos curtos
- Erros de ortografia
- Linguagem simples

6.2. Resultado da Detecção
--------------------------

Probabilidade (0.0 a 1.0):
- 0.0 = Texto claramente humano
- 0.5 = Incerto
- 1.0 = Texto claramente gerado por IA

Flag aplicado:
- Se probabilidade > 0.70: flag "alta_probabilidade_texto_IA"
- Flag é armazenado com a mensagem
- Professor pode ver flag ao revisar conversas

6.3. Uso da Detecção
--------------------

A detecção NÃO:
- Bloqueia o aluno de continuar
- Impede envio da mensagem
- Dá nota negativa automaticamente

A detecção:
- Registra probabilidade para análise
- Ajuda professor a identificar casos suspeitos
- Fornece dados para avaliação justa
- Permite intervenção pedagógica quando necessário

================================================================================
7. AVALIAÇÃO E QUALIDADE
================================================================================

7.1. Evaluation Harness
-----------------------
Localização: backend/app/services/evaluation_harness.py

Sistema de avaliação que verifica qualidade do processamento:

1. INTEGRIDADE (Integrity Check)
   - Verifica se texto exibido corresponde ao texto original
   - Compara hash SHA256 do texto original vs exibido
   - Garante que conteúdo não foi alterado indevidamente
   - Permite normalização de espaços em branco

2. GROUNDING (Citações)
   - Verifica se todos os conceitos têm citações
   - Confirma que perguntas referenciam blocos de origem
   - Garante que nada foi inventado
   - Aceita 95% de cobertura (tolerância de 5%)

3. COBERTURA (Coverage)
   - Verifica se títulos principais estão representados
   - Confirma que pontos-chave cobrem os tópicos
   - Garante que perguntas abordam seções importantes
   - Aceita 50% de cobertura mínima

4. QUALIDADE DE PERGUNTAS (Question Quality)
   - Detecta perguntas genéricas
   - Verifica presença de campos obrigatórios
   - Avalia profundidade e provocação
   - Score mínimo: 0.7 (70%)

7.2. Relatórios de QA
---------------------
Cada processamento gera relatório com:
- Score geral (0.0 a 1.0)
- Status de cada verificação (passou/falhou)
- Mensagens descritivas
- Detalhes técnicos
- Recomendações de melhoria

================================================================================
8. INTEGRAÇÃO COM APIS DE IA
================================================================================

8.1. Suporte Multi-Provider
---------------------------
Localização: backend/app/services/ai_client.py

A plataforma suporta:
- Azure OpenAI (preferencial)
- OpenAI padrão (fallback)

Configuração:
- Detecta automaticamente qual provider usar
- Usa variáveis de ambiente para configuração
- Suporta diferentes modelos (gpt-4o-mini, gpt-4, etc.)

8.2. Funcionalidades da API
---------------------------

Geração de Conteúdo:
- Chat completions para diálogos
- JSON mode para respostas estruturadas
- Temperature control para criatividade
- Token limits para controle de custos

Modelos Utilizados:
- gpt-4o-mini: Para processamento em lote (mais econômico)
- gpt-4: Para tarefas complexas (quando necessário)
- Configurável via variáveis de ambiente

8.3. Tratamento de Erros
-------------------------
- Retry automático com backoff exponencial
- Timeout configurável
- Fallback para modelos alternativos
- Logging detalhado de erros
- Notificações de falhas

================================================================================
9. PRESERVAÇÃO DE INTEGRIDADE
================================================================================

9.1. Texto Verbatim
-------------------
Princípio fundamental: O texto original do documento é SEMPRE preservado.

Como funciona:
- Texto original é armazenado com hash SHA256
- Texto exibido ao aluno é o texto original (verbatim)
- Processamento gera metadados e insights, mas não altera texto
- Hash permite verificação de integridade

9.2. Blocos Estruturados
------------------------
- Texto é dividido em blocos estruturais (títulos, parágrafos, listas)
- Cada bloco tem ID único
- Blocos podem ser reconstruídos para formar texto original
- Citações referenciam IDs de blocos

9.3. Verificação de Integridade
-------------------------------
- Hash do texto original é computado
- Hash do texto reconstruído é comparado
- Diferenças significativas (>10%) geram alerta
- Garante que processamento não corrompe conteúdo

================================================================================
10. FLUXOS DE USO DA IA
================================================================================

10.1. Professor: Upload e Processamento
----------------------------------------

1. Professor faz upload de PDF/DOCX
2. Sistema extrai texto automaticamente
3. IA particiona documento em capítulos
4. Cada capítulo é processado:
   - Parsing estrutural
   - Geração de understanding pack
   - Geração de perguntas socráticas
5. Professor revisa estrutura gerada
6. Professor pode editar com instruções em linguagem natural
7. Professor aprova estrutura
8. Sistema cria capítulos reais no curso

10.2. Professor: Geração de Perguntas
--------------------------------------

1. Professor seleciona capítulo ou conteúdo
2. Opcionalmente envia arquivo adicional
3. Especifica objetivo de aprendizagem e dificuldade
4. IA analisa conteúdo e gera perguntas
5. Perguntas são salvas automaticamente
6. Professor pode editar manualmente se desejar

10.3. Aluno: Chat Socrático
----------------------------

1. Aluno acessa capítulo
2. Seleciona uma das 3 perguntas socráticas
3. Inicia conversa com IA
4. Aluno responde à pergunta
5. IA analisa resposta e fornece feedback + nova pergunta
6. Processo se repete por até 3 interações
7. Sessão finaliza automaticamente
8. Conversa é exportada para Moodle

10.4. Sistema: Detecção e Análise
----------------------------------

1. Aluno envia mensagem
2. Sistema detecta probabilidade de IA (antes de salvar)
3. Mensagem é salva com flags se necessário
4. IA processa resposta normalmente
5. Métricas são coletadas
6. Professor pode revisar flags ao avaliar

================================================================================
11. BENEFÍCIOS DA IA NA PLATAFORMA
================================================================================

11.1. Para Professores
----------------------

Automação:
- Processamento automático de documentos
- Geração automática de perguntas
- Estruturação inteligente de conteúdo
- Economia de tempo significativa

Qualidade:
- Perguntas socráticas de alta qualidade
- Estruturação lógica de conteúdo
- Insights e metadados automáticos
- Validação de qualidade integrada

Flexibilidade:
- Edição com instruções em linguagem natural
- Processamento parcial de documentos
- Reprocessamento quando necessário
- Controle total sobre resultado final

11.2. Para Alunos
-----------------

Aprendizado Ativo:
- Diálogo interativo com IA
- Feedback imediato e construtivo
- Perguntas que estimulam pensamento
- Reflexão guiada sobre o conteúdo

Personalização:
- Adaptação ao nível do aluno
- Perguntas contextualizadas
- Feedback específico sobre respostas
- Aprofundamento progressivo

Acessibilidade:
- Disponível 24/7
- Sem julgamento ou pressão
- Permite múltiplas tentativas
- Ambiente seguro para experimentação

11.3. Para a Instituição
------------------------

Escalabilidade:
- Processa grandes volumes de conteúdo
- Atende muitos alunos simultaneamente
- Não requer recursos humanos adicionais
- Cresce com a demanda

Qualidade Consistente:
- Padrão de qualidade em todas as perguntas
- Processamento consistente de documentos
- Validação automática de qualidade
- Redução de erros humanos

Dados e Analytics:
- Métricas de engajamento
- Detecção de padrões de uso
- Relatórios de qualidade
- Insights para melhoria contínua

================================================================================
12. LIMITAÇÕES E CONSIDERAÇÕES
================================================================================

12.1. Limitações Técnicas
-------------------------

Modelos de IA:
- Dependência de APIs externas (OpenAI/Azure)
- Custos por uso (tokens)
- Latência de resposta
- Possíveis erros ou falhas de API

Processamento:
- Documentos muito grandes podem ser lentos
- Qualidade depende do modelo usado
- Pode requerer ajustes manuais
- Processamento assíncrono (não instantâneo)

12.2. Limitações Pedagógicas
----------------------------

IA não substitui:
- Professor humano
- Interação presencial
- Avaliação contextualizada
- Relacionamento educacional

IA complementa:
- Fornece ferramentas para professores
- Oferece prática adicional para alunos
- Automatiza tarefas repetitivas
- Enriquece experiência educacional

12.3. Considerações Éticas
---------------------------

Detecção de IA:
- Não é 100% precisa
- Pode ter falsos positivos/negativos
- Deve ser usada como ferramenta, não sentença
- Professor tem palavra final

Uso Responsável:
- Alunos devem ser informados sobre detecção
- Transparência sobre uso de IA
- Foco em aprendizado, não em "pegar" alunos
- Uso pedagógico construtivo

================================================================================
13. FUTURAS MELHORIAS
================================================================================

Planejado:
- Suporte a mais formatos de arquivo
- Processamento de imagens e diagramas
- Geração de resumos automáticos
- Análise de sentimento nas respostas
- Recomendações personalizadas de conteúdo
- Integração com mais provedores de IA
- Cache de respostas para economia
- Processamento em tempo real
- Suporte a múltiplos idiomas

================================================================================
14. CONCLUSÃO
================================================================================

A Inteligência Artificial na plataforma HARVEN.AI é uma ferramenta poderosa
que:

1. Automatiza processamento de conteúdo educacional
2. Gera perguntas socráticas de alta qualidade
3. Conduz diálogos interativos com alunos
4. Detecta uso de IA para apoio pedagógico
5. Avalia e garante qualidade do conteúdo
6. Enriquece experiência educacional para todos

A IA não substitui professores ou alunos, mas os capacita com ferramentas
avançadas que tornam a educação mais eficiente, personalizada e engajadora.

O sistema multi-agente garante que cada aspecto do processamento seja
tratado por especialistas, resultando em qualidade superior e experiência
mais rica para todos os usuários da plataforma.

================================================================================
FIM DO DOCUMENTO
================================================================================

