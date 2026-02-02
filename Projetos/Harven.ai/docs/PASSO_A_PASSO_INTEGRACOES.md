# GUIA PASSO A PASSO: Integrações JACAD e Moodle

> **Projeto:** Harven.ai
> **Versão:** 1.0.0
> **Data:** 2026-01-29
> **Tempo estimado:** 2-4 horas (JACAD) + 1-2 horas (Moodle)

---

## SUMÁRIO

1. [Visão Geral](#1-visão-geral)
2. [Pré-requisitos](#2-pré-requisitos)
3. [PARTE A: Integração JACAD](#3-parte-a-integração-jacad)
4. [PARTE B: Integração Moodle](#4-parte-b-integração-moodle)
5. [PARTE C: Configuração no Harven.ai](#5-parte-c-configuração-no-harvenai)
6. [PARTE D: Testes e Validação](#6-parte-d-testes-e-validação)
7. [PARTE E: Operações do Dia a Dia](#7-parte-e-operações-do-dia-a-dia)
8. [Troubleshooting](#8-troubleshooting)
9. [Checklist Final](#9-checklist-final)

---

## 1. VISÃO GERAL

### O que vamos configurar?

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│     JACAD                    HARVEN.AI                   MOODLE     │
│   (Sistema                  (Plataforma                   (LMS)     │
│   Acadêmico)                Educacional)                            │
│                                                                     │
│   ┌─────────┐              ┌───────────┐              ┌─────────┐  │
│   │ Alunos  │─────────────▶│           │─────────────▶│Portfólio│  │
│   │Discipl. │   IMPORTAR   │  Harven   │   EXPORTAR   │ Sessões │  │
│   │Matrícul.│              │    .ai    │              │  Notas  │  │
│   └─────────┘              │           │◀─────────────│Avaliação│  │
│                            └───────────┘   IMPORTAR   └─────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Fluxo de Dados

| Direção | Origem | Destino | Dados |
|---------|--------|---------|-------|
| **JACAD → Harven** | Sistema Acadêmico | Plataforma | Alunos, Disciplinas, Matrículas |
| **Harven → Moodle** | Plataforma | LMS | Sessões Socráticas, Notas |
| **Moodle → Harven** | LMS | Plataforma | Avaliações de Professores |

---

## 2. PRÉ-REQUISITOS

### 2.1 Acesso Necessário

| Sistema | Tipo de Acesso | Quem Solicitar |
|---------|----------------|----------------|
| **JACAD** | Conta de desenvolvedor/API | TI da Instituição ou Suporte JACAD |
| **Moodle** | Administrador do site | TI da Instituição |
| **Harven.ai** | Acesso ao servidor backend | Equipe Harven |

### 2.2 Informações que Você Precisará Coletar

Antes de começar, obtenha as seguintes informações:

#### Para JACAD:
```
□ URL da API: https://________________/api
□ Tipo de autenticação: [ ] API Key  [ ] OAuth2  [ ] Outro: ________
□ Credenciais:
  - Client ID (se OAuth): ________________
  - Client Secret/API Key: ________________
□ Documentação da API: [ ] Tenho acesso  [ ] Preciso solicitar
□ Contato do suporte técnico: ________________
```

#### Para Moodle:
```
□ URL do Moodle: https://________________
□ Versão do Moodle: __________ (mínimo recomendado: 3.9)
□ Web Services habilitado: [ ] Sim  [ ] Não  [ ] Não sei
□ Acesso como administrador: [ ] Sim  [ ] Não
□ Contato do admin Moodle: ________________
```

### 2.3 Ferramentas Recomendadas

- **Postman** ou **Insomnia** - Para testar APIs
- **Notepad++** ou **VS Code** - Para editar arquivos .env
- **Terminal/CMD** - Para executar comandos cURL

---

## 3. PARTE A: INTEGRAÇÃO JACAD

### PASSO A.1: Obter Acesso à API do JACAD

#### Opção 1: Se você já tem conta de desenvolvedor

1. Acesse: `https://cs-developer.jacad.com.br/docs`
2. Faça login com suas credenciais
3. Navegue até: **Integrações** → **Autenticação**
4. Anote:
   - URL base da API
   - Método de autenticação
   - Suas credenciais (Client ID / API Key)

#### Opção 2: Se você precisa solicitar acesso

Envie o seguinte email ao suporte JACAD ou TI da instituição:

```
Assunto: Solicitação de Acesso à API JACAD para Integração

Prezados,

Solicito acesso à API do JACAD para integração com a plataforma
educacional Harven.ai.

Dados necessários:
1. Endpoints de consulta de alunos (por RA)
2. Endpoints de consulta de disciplinas
3. Endpoints de consulta de matrículas
4. Credenciais de API (API Key ou OAuth2)

Finalidade: Sincronização de dados acadêmicos para plataforma
de aprendizagem com tutoria AI.

Responsável técnico: [Seu nome]
Email: [Seu email]
Telefone: [Seu telefone]

Atenciosamente,
[Seu nome]
```

### PASSO A.2: Entender a Estrutura da API JACAD

A documentação do JACAD CS (versão Cloud) geralmente segue este padrão:

#### A.2.1 Autenticação

**Método típico: OAuth2 Client Credentials**

```http
POST /oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
&client_id=SEU_CLIENT_ID
&client_secret=SEU_CLIENT_SECRET
```

**Resposta esperada:**
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

**Método alternativo: API Key**

```http
GET /api/endpoint
Authorization: Bearer SUA_API_KEY
```

#### A.2.2 Endpoints Comuns do JACAD

| Funcionalidade | Endpoint Provável | Método |
|----------------|-------------------|--------|
| Info do sistema | `/api/info` ou `/health` | GET |
| Buscar aluno por RA | `/api/alunos/{ra}` ou `/api/students/{ra}` | GET |
| Listar disciplinas | `/api/disciplinas` ou `/api/disciplines` | GET |
| Matrículas do aluno | `/api/alunos/{ra}/matriculas` | GET |
| Alunos de disciplina | `/api/disciplinas/{codigo}/alunos` | GET |

### PASSO A.3: Testar a API do JACAD Manualmente

Antes de configurar no Harven.ai, teste a API manualmente:

#### A.3.1 Teste com cURL (Terminal/CMD)

```bash
# 1. Obter token (se OAuth2)
curl -X POST "https://api.jacad.edu.br/oauth/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=SEU_ID&client_secret=SEU_SECRET"

# 2. Testar endpoint de aluno (substitua pelo token obtido)
curl -X GET "https://api.jacad.edu.br/api/alunos/2024001" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# 3. Testar endpoint de disciplinas
curl -X GET "https://api.jacad.edu.br/api/disciplinas" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

#### A.3.2 Teste com Postman

1. Abra o Postman
2. Crie uma nova Collection: "JACAD API Tests"
3. Adicione um request:
   - **Nome:** Get Student by RA
   - **Método:** GET
   - **URL:** `https://api.jacad.edu.br/api/alunos/2024001`
   - **Headers:**
     - `Authorization`: `Bearer SEU_TOKEN`
4. Clique em **Send**
5. Verifique a resposta

#### A.3.3 Documente os Resultados

Preencha esta tabela com as respostas reais:

```
Endpoint testado: _______________________
Status code: _______
Resposta (copie a estrutura JSON):

{

}

Campos importantes identificados:
- Campo do RA: _______
- Campo do nome: _______
- Campo do email: _______
- Campo do curso: _______
```

### PASSO A.4: Mapear Campos JACAD → Harven

Compare os campos da API JACAD com o esperado pelo Harven:

| Harven Espera | Campo JACAD Real | Exemplo de Valor |
|---------------|------------------|------------------|
| `ra` | _____________ | "2024001" |
| `nome` | _____________ | "João Silva" |
| `email` | _____________ | "joao@email.com" |
| `curso` | _____________ | "Eng. Software" |
| `periodo` | _____________ | 3 |
| `situacao` | _____________ | "Ativo" |

### PASSO A.5: Adaptar o Código (Se Necessário)

Se os campos ou endpoints forem diferentes, você precisará adaptar o arquivo:

**Arquivo:** `backend/services/integration_service.py`

**Classe:** `JacadClient`

Principais pontos de adaptação:

```python
# Linha ~96: Método de requisição
async def _request(self, method: str, endpoint: str, data: Dict = None) -> Dict:
    # Se a autenticação for diferente, ajuste os headers aqui
    headers = {
        "Authorization": f"Bearer {self.api_key}",  # Ajuste se necessário
        "Content-Type": "application/json",
    }

# Linha ~169: Buscar aluno
async def get_student_by_ra(self, ra: str) -> Optional[Dict]:
    # Ajuste o endpoint se for diferente
    result = await self._request("GET", f"/students/{ra}")  # ou /alunos/{ra}

# Linha ~183: Listar disciplinas
async def get_disciplines(self) -> List[Dict]:
    # Ajuste o endpoint se for diferente
    result = await self._request("GET", "/disciplines")  # ou /disciplinas
```

---

## 4. PARTE B: INTEGRAÇÃO MOODLE

### PASSO B.1: Verificar Versão do Moodle

1. Acesse o Moodle como administrador
2. Vá em: **Administração do site** → **Notificações**
3. A versão aparece no topo da página
4. Anote: `Versão: ___________`

> **Requisito:** Moodle 3.9 ou superior (recomendado 4.0+)

### PASSO B.2: Habilitar Web Services

#### B.2.1 Acessar Configurações

1. Faça login como **Administrador**
2. Vá em: **Administração do site** → **Plugins** → **Serviços web** → **Visão geral**

#### B.2.2 Habilitar Recursos (Siga a Ordem!)

Execute cada passo na ordem:

| # | Configuração | Ação | Local |
|---|--------------|------|-------|
| 1 | Habilitar serviços web | Marcar "Sim" | Visão geral |
| 2 | Habilitar protocolos | Marcar "REST" | Gerenciar protocolos |
| 3 | Criar usuário específico | Criar "harven_service" | Usuários → Adicionar |
| 4 | Criar serviço externo | Criar "Harven.AI" | Serviços externos |
| 5 | Adicionar funções | Selecionar funções | Funções do serviço |
| 6 | Autorizar usuário | Vincular ao serviço | Usuários autorizados |
| 7 | Criar token | Gerar token | Gerenciar tokens |

### PASSO B.3: Criar Usuário de Serviço

1. Vá em: **Administração do site** → **Usuários** → **Contas** → **Adicionar usuário**

2. Preencha os campos:

```
Nome de usuário: harven_service
Método de autenticação: Autenticação manual
Novo password: [Gere uma senha forte de 16+ caracteres]
Confirmar password: [Repita a senha]
Nome: Harven
Sobrenome: Service
Email: harven-service@sua-instituicao.edu.br
```

3. Clique em **Criar usuário**

4. **ANOTE A SENHA** em local seguro (você não precisará dela depois, mas é bom ter)

### PASSO B.4: Criar Serviço Externo

1. Vá em: **Administração do site** → **Plugins** → **Serviços web** → **Serviços externos**

2. Clique em **Adicionar**

3. Preencha:

```
Nome: Harven.AI Integration
Nome abreviado: harven_api
Habilitado: ✓ Sim
Somente usuários autorizados: ✓ Sim
```

4. Clique em **Adicionar serviço**

### PASSO B.5: Adicionar Funções ao Serviço

1. Na lista de serviços, encontre "Harven.AI Integration"
2. Clique em **Funções** (coluna à direita)
3. Adicione TODAS as funções abaixo:

**Funções Obrigatórias:**

| Função | Descrição | Para que serve |
|--------|-----------|----------------|
| `core_webservice_get_site_info` | Info do site | Testar conexão |
| `core_user_get_users` | Listar usuários | Buscar alunos |
| `core_course_get_courses` | Listar cursos | Mapear disciplinas |
| `core_enrol_get_enrolled_users` | Alunos matriculados | Ver quem está no curso |

**Funções para Exportação:**

| Função | Descrição | Para que serve |
|--------|-----------|----------------|
| `core_grades_update_grades` | Atualizar notas | Enviar notas |
| `gradereport_user_get_grades_table` | Ver notas | Consultar notas |

**Funções Opcionais (se disponíveis):**

| Função | Descrição | Para que serve |
|--------|-----------|----------------|
| `mod_portfolio_add_entry` | Adicionar ao portfólio | Exportar sessões |
| `core_competency_*` | Competências | Tracking avançado |

> **Nota:** Se `mod_portfolio_add_entry` não existir, a exportação usará outro método.

### PASSO B.6: Autorizar Usuário no Serviço

1. Volte para **Serviços externos**
2. Encontre "Harven.AI Integration"
3. Clique em **Usuários autorizados**
4. Busque por: `harven_service`
5. Clique em **Adicionar**

### PASSO B.7: Gerar Token de Acesso

**IMPORTANTE: Este é o passo mais crítico!**

1. Vá em: **Administração do site** → **Plugins** → **Serviços web** → **Gerenciar tokens**

2. Clique em **Adicionar**

3. Preencha:

```
Usuário: harven_service (busque e selecione)
Serviço: Harven.AI Integration
Restrição de IP: [Deixe em branco ou adicione o IP do servidor Harven]
Data de validade: [Opcional - deixe em branco para token permanente]
```

4. Clique em **Salvar alterações**

5. **COPIE O TOKEN IMEDIATAMENTE!**

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  ⚠️  ATENÇÃO: O TOKEN SÓ APARECE UMA VEZ!                          │
│                                                                     │
│  Token gerado: ________________________________________________    │
│                                                                     │
│  Cole aqui para backup: ________________________________________   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### PASSO B.8: Testar o Token Manualmente

Antes de configurar no Harven, teste o token:

```bash
# Substitua pelos valores reais
MOODLE_URL="https://moodle.sua-instituicao.edu.br"
MOODLE_TOKEN="seu-token-copiado"

# Teste de conexão
curl -X POST "${MOODLE_URL}/webservice/rest/server.php" \
  -d "wstoken=${MOODLE_TOKEN}" \
  -d "wsfunction=core_webservice_get_site_info" \
  -d "moodlewsrestformat=json"
```

**Resposta esperada (sucesso):**
```json
{
  "sitename": "Nome do Moodle",
  "username": "harven_service",
  "userid": 123,
  "functions": [...],
  "release": "4.0.5"
}
```

**Resposta de erro (token inválido):**
```json
{
  "exception": "invalid_token",
  "message": "Invalid token - token not found"
}
```

---

## 5. PARTE C: CONFIGURAÇÃO NO HARVEN.AI

### PASSO C.1: Acessar o Servidor Backend

Conecte-se ao servidor onde o Harven.ai está hospedado:

```bash
# Se estiver usando SSH
ssh usuario@servidor-harven.com

# Navegue até a pasta do backend
cd /path/to/harven.ai/backend
```

### PASSO C.2: Editar Arquivo de Configuração

1. Localize o arquivo `.env`:

```bash
ls -la .env
```

2. Se não existir, copie do exemplo:

```bash
cp .env.example .env
```

3. Edite o arquivo:

```bash
nano .env
# ou
vim .env
# ou
code .env  # Se tiver VS Code
```

### PASSO C.3: Adicionar Configurações de Integração

Adicione ou modifique as seguintes variáveis:

```bash
# ============================================
# INTEGRAÇÕES - JACAD
# ============================================

# URL base da API do JACAD (sem barra no final)
JACAD_URL=https://api.jacad.sua-instituicao.edu.br

# Chave de API ou Token de acesso
JACAD_API_KEY=sua-chave-api-jacad-aqui

# Habilitar integração (true para produção, false para mock)
JACAD_ENABLED=true

# ============================================
# INTEGRAÇÕES - MOODLE
# ============================================

# URL do Moodle (sem barra no final)
MOODLE_URL=https://moodle.sua-instituicao.edu.br

# Token gerado no passo B.7
MOODLE_TOKEN=seu-token-do-moodle-aqui

# Secret para validar webhooks (gere uma string aleatória)
MOODLE_WEBHOOK_SECRET=gere-uma-string-aleatoria-de-32-caracteres

# Habilitar integração
MOODLE_ENABLED=true

# ============================================
# CONFIGURAÇÕES DE SYNC (Opcional)
# ============================================

# Quantos registros processar por lote
SYNC_BATCH_SIZE=100

# Quantas tentativas em caso de falha
SYNC_RETRY_ATTEMPTS=3

# Segundos entre tentativas
SYNC_RETRY_DELAY_SECONDS=5
```

### PASSO C.4: Gerar Secret para Webhook

Para gerar uma string aleatória segura:

```bash
# Linux/Mac
openssl rand -hex 32

# Ou Python
python3 -c "import secrets; print(secrets.token_hex(32))"

# Windows PowerShell
[System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()
```

Use o resultado como `MOODLE_WEBHOOK_SECRET`.

### PASSO C.5: Reiniciar o Backend

Após salvar o `.env`, reinicie o servidor:

```bash
# Se estiver usando Docker
docker-compose restart backend

# Se estiver usando systemd
sudo systemctl restart harven-backend

# Se estiver rodando diretamente
# (Pare o processo atual e inicie novamente)
pkill -f "uvicorn main:app"
uvicorn main:app --host 0.0.0.0 --port 8000
```

### PASSO C.6: Verificar Logs de Inicialização

Verifique se não há erros:

```bash
# Docker
docker-compose logs -f backend

# Systemd
journalctl -u harven-backend -f

# Direto
# Os logs aparecem no terminal
```

Procure por linhas como:
```
INFO: Integration service initialized
INFO: JACAD client: production mode
INFO: Moodle client: production mode
```

---

## 6. PARTE D: TESTES E VALIDAÇÃO

### PASSO D.1: Testar Conexão via API Harven

#### D.1.1 Testar JACAD

```bash
# Substitua pela URL real do seu backend
HARVEN_API="https://api.harven.sua-instituicao.edu.br"

# Testar conexão JACAD
curl -X POST "${HARVEN_API}/integrations/test-connection?system=jacad" \
  -H "Content-Type: application/json"
```

**Resposta esperada (sucesso):**
```json
{
  "connected": true,
  "mode": "production",
  "message": "Conexão estabelecida",
  "version": "2.1.0"
}
```

**Resposta se estiver em mock:**
```json
{
  "connected": true,
  "mode": "mock",
  "message": "Usando dados mockados (desenvolvimento)",
  "version": "mock-1.0"
}
```

#### D.1.2 Testar Moodle

```bash
curl -X POST "${HARVEN_API}/integrations/test-connection?system=moodle" \
  -H "Content-Type: application/json"
```

**Resposta esperada:**
```json
{
  "connected": true,
  "mode": "production",
  "message": "Conexão estabelecida",
  "sitename": "Moodle - Sua Instituição",
  "version": "4.0.5"
}
```

### PASSO D.2: Verificar Status Geral

```bash
curl -X GET "${HARVEN_API}/integrations/status" \
  -H "Content-Type: application/json"
```

**Resposta esperada:**
```json
{
  "jacad": {
    "connected": true,
    "mode": "production",
    "enabled": true,
    "last_sync": null
  },
  "moodle": {
    "connected": true,
    "mode": "production",
    "enabled": true,
    "sitename": "Moodle - Sua Instituição",
    "last_sync": null
  }
}
```

### PASSO D.3: Testar Busca de Aluno no JACAD

```bash
# Substitua por um RA real da sua instituição
curl -X GET "${HARVEN_API}/integrations/lookup-student/2024001" \
  -H "Content-Type: application/json"
```

**Resposta esperada:**
```json
{
  "found_in_jacad": true,
  "found_in_harven": false,
  "jacad_data": {
    "ra": "2024001",
    "nome": "João Silva Santos",
    "email": "joao.santos@aluno.edu.br",
    "curso": "Engenharia de Software",
    "enrollments": [...]
  },
  "harven_data": null
}
```

### PASSO D.4: Executar Primeira Sincronização

**ATENÇÃO:** Este passo irá criar/atualizar registros no banco de dados!

```bash
# Sincronização completa (disciplinas + alunos)
curl -X POST "${HARVEN_API}/integrations/jacad/sync" \
  -H "Content-Type: application/json"
```

**Resposta esperada:**
```json
{
  "disciplines": {
    "system": "jacad",
    "operation": "sync_disciplines",
    "status": "success",
    "records_processed": 15,
    "records_created": 10,
    "records_updated": 5,
    "records_failed": 0
  },
  "users": {
    "system": "jacad",
    "operation": "sync_users",
    "status": "success",
    "records_processed": 150,
    "records_created": 120,
    "records_updated": 30,
    "records_failed": 0
  }
}
```

### PASSO D.5: Verificar Logs de Sincronização

```bash
curl -X GET "${HARVEN_API}/integrations/logs?limit=10" \
  -H "Content-Type: application/json"
```

---

## 7. PARTE E: OPERAÇÕES DO DIA A DIA

### E.1 Sincronização Manual (Admin)

#### Via Interface Admin (Recomendado)

1. Acesse o painel admin do Harven.ai
2. Vá em: **Configurações** → **Integrações**
3. Clique em **Testar Conexão** para verificar
4. Clique em **Sincronizar** para importar dados

#### Via API

```bash
# Sincronizar apenas disciplinas
curl -X POST "${HARVEN_API}/integrations/jacad/import-disciplines"

# Sincronizar apenas alunos
curl -X POST "${HARVEN_API}/integrations/jacad/import-students"

# Sincronização completa
curl -X POST "${HARVEN_API}/integrations/jacad/sync"
```

### E.2 Exportar Sessões para Moodle

#### Exportação Manual

```bash
# Exportar todas as sessões pendentes
curl -X POST "${HARVEN_API}/integrations/moodle/export-sessions" \
  -H "Content-Type: application/json" \
  -d '{}'

# Exportar sessões de um aluno específico
curl -X POST "${HARVEN_API}/integrations/moodle/export-sessions" \
  -H "Content-Type: application/json" \
  -d '{"user_id": "uuid-do-aluno"}'

# Exportar sessões de uma disciplina
curl -X POST "${HARVEN_API}/integrations/moodle/export-sessions" \
  -H "Content-Type: application/json" \
  -d '{"discipline_id": "uuid-da-disciplina"}'
```

### E.3 Consultar Avaliações do Moodle

```bash
# Todas as avaliações
curl -X GET "${HARVEN_API}/integrations/moodle/ratings"

# Avaliações de um aluno
curl -X GET "${HARVEN_API}/integrations/moodle/ratings?user_id=uuid"

# Avaliações de uma sessão
curl -X GET "${HARVEN_API}/integrations/moodle/ratings?session_id=uuid"
```

### E.4 Configurar Sincronização Automática (Opcional)

Se desejar sincronização automática, configure um cron job:

```bash
# Editar crontab
crontab -e

# Adicionar linha para sincronizar diariamente às 6h da manhã
0 6 * * * curl -X POST "https://api.harven.ai/integrations/jacad/sync" > /var/log/harven-sync.log 2>&1

# Adicionar linha para exportar sessões a cada hora
0 * * * * curl -X POST "https://api.harven.ai/integrations/moodle/export-sessions" > /var/log/harven-export.log 2>&1
```

---

## 8. TROUBLESHOOTING

### Problema: "Usando dados mockados"

**Causa:** Variáveis não configuradas ou `*_ENABLED=false`

**Solução:**
1. Verifique o arquivo `.env`
2. Confirme que `JACAD_ENABLED=true` e `MOODLE_ENABLED=true`
3. Confirme que `JACAD_URL` e `MOODLE_URL` estão preenchidos
4. Reinicie o backend

### Problema: "Erro ao conectar ao JACAD"

**Causa:** URL incorreta, credenciais inválidas ou rede bloqueada

**Solução:**
1. Teste a URL diretamente no navegador
2. Verifique se o servidor pode acessar a URL (firewall)
3. Confirme as credenciais com o suporte JACAD
4. Tente com cURL no servidor:
   ```bash
   curl -v https://api.jacad.edu.br/health
   ```

### Problema: "Invalid token" no Moodle

**Causa:** Token expirado, revogado ou incorreto

**Solução:**
1. Acesse o Moodle como admin
2. Vá em: Serviços web → Gerenciar tokens
3. Verifique se o token existe e está ativo
4. Se necessário, gere um novo token
5. Atualize o `.env` com o novo token
6. Reinicie o backend

### Problema: "Access denied" ou "Função não encontrada"

**Causa:** Funções não adicionadas ao serviço ou permissões insuficientes

**Solução:**
1. Acesse: Serviços web → Serviços externos → Harven.AI
2. Clique em "Funções"
3. Verifique se todas as funções necessárias estão adicionadas
4. Se faltar alguma, adicione-a

### Problema: "Usuário sem moodle_user_id"

**Causa:** Usuários do Harven não mapeados para usuários do Moodle

**Solução:**
1. Importe usuários do Moodle:
   ```bash
   curl -X POST "${HARVEN_API}/integrations/moodle/import-users"
   ```
2. Ou mapeie manualmente na tabela `users` (coluna `moodle_user_id`)

### Problema: "Timeout" em sincronizações

**Causa:** Muitos registros ou conexão lenta

**Solução:**
1. Reduza o `SYNC_BATCH_SIZE` no `.env`
2. Execute sincronizações em horários de baixo uso
3. Considere sincronizar por partes (disciplinas separadas de alunos)

### Problema: Campos com valores errados após sync

**Causa:** Mapeamento de campos incorreto

**Solução:**
1. Verifique a estrutura real da resposta do JACAD
2. Adapte o código em `integration_service.py`
3. Consulte a seção A.5 deste guia

---

## 9. CHECKLIST FINAL

### Pré-Implementação

- [ ] Acesso à API JACAD obtido
- [ ] Documentação do JACAD consultada
- [ ] Acesso admin ao Moodle obtido
- [ ] Versão do Moodle verificada (3.9+)

### Configuração JACAD

- [ ] URL da API anotada
- [ ] Credenciais obtidas
- [ ] Endpoints testados manualmente
- [ ] Mapeamento de campos documentado

### Configuração Moodle

- [ ] Web Services habilitado
- [ ] Protocolo REST habilitado
- [ ] Usuário `harven_service` criado
- [ ] Serviço "Harven.AI Integration" criado
- [ ] Funções adicionadas ao serviço
- [ ] Usuário autorizado no serviço
- [ ] Token gerado e copiado
- [ ] Token testado manualmente

### Configuração Harven.ai

- [ ] Arquivo `.env` editado
- [ ] `JACAD_URL` configurado
- [ ] `JACAD_API_KEY` configurado
- [ ] `JACAD_ENABLED=true`
- [ ] `MOODLE_URL` configurado
- [ ] `MOODLE_TOKEN` configurado
- [ ] `MOODLE_ENABLED=true`
- [ ] Backend reiniciado

### Testes

- [ ] Conexão JACAD testada e funcionando
- [ ] Conexão Moodle testada e funcionando
- [ ] Busca de aluno por RA funcionando
- [ ] Primeira sincronização executada
- [ ] Logs verificados sem erros

### Pós-Implementação

- [ ] Equipe administrativa treinada
- [ ] Documentação interna criada
- [ ] Rotina de monitoramento definida
- [ ] Contatos de suporte anotados

---

## ANEXOS

### A. Template de Solicitação de Acesso JACAD

```
Assunto: Solicitação de Acesso à API JACAD - Integração Harven.ai

Prezada Equipe JACAD,

Solicito credenciais de acesso à API para integração com a plataforma
Harven.ai, utilizada para tutoria inteligente.

Instituição: [Nome da Instituição]
CNPJ: [CNPJ]
Responsável: [Nome do Responsável]
Cargo: [Cargo]
Email: [Email]
Telefone: [Telefone]

Endpoints necessários:
1. Consulta de alunos por RA
2. Listagem de disciplinas
3. Consulta de matrículas

Tipo de integração: Leitura de dados (read-only)
Ambiente: Produção

Atenciosamente,
[Assinatura]
```

### B. Referência Rápida de Comandos

```bash
# ========== TESTES DE CONEXÃO ==========
# Testar JACAD
curl -X POST "API/integrations/test-connection?system=jacad"

# Testar Moodle
curl -X POST "API/integrations/test-connection?system=moodle"

# Status geral
curl -X GET "API/integrations/status"

# ========== JACAD ==========
# Sincronização completa
curl -X POST "API/integrations/jacad/sync"

# Importar disciplinas
curl -X POST "API/integrations/jacad/import-disciplines"

# Importar alunos
curl -X POST "API/integrations/jacad/import-students"

# Buscar aluno
curl -X GET "API/integrations/lookup-student/{RA}"

# ========== MOODLE ==========
# Exportar sessões
curl -X POST "API/integrations/moodle/export-sessions"

# Consultar avaliações
curl -X GET "API/integrations/moodle/ratings"

# ========== LOGS ==========
# Ver últimos logs
curl -X GET "API/integrations/logs?limit=20"

# Filtrar por sistema
curl -X GET "API/integrations/logs?system=jacad"

# Filtrar por status
curl -X GET "API/integrations/logs?status=failed"
```

### C. Contatos de Suporte

| Sistema | Contato | Informação |
|---------|---------|------------|
| JACAD | Suporte técnico | https://ajuda.jacad.com.br |
| Moodle | Documentação | https://docs.moodle.org |
| Harven.ai | Equipe técnica | [Seu contato] |

---

**Documento criado em:** 2026-01-29
**Última atualização:** 2026-01-29
**Autor:** Claude (AIOS Master)
