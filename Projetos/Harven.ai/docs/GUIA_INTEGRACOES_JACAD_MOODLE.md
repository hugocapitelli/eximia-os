# GUIA COMPLETO DE INTEGRAÇÕES - HARVEN.AI

> **Versão:** 1.0.0
> **Data:** 2026-01-28
> **Autor:** Documentação gerada automaticamente

---

## 📊 Visão Geral das Integrações

```
┌─────────────────────────────────────────────────────────────────────┐
│                         HARVEN.AI                                   │
│                                                                     │
│  ┌──────────────────────┐          ┌──────────────────────┐        │
│  │    IMPORTAÇÃO        │          │     EXPORTAÇÃO       │        │
│  │    ← JACAD           │          │     → MOODLE         │        │
│  │    - Alunos          │          │     - Sessões        │        │
│  │    - Disciplinas     │          │     - Portfólio      │        │
│  │    - Matrículas      │          │     - Notas          │        │
│  └──────────────────────┘          └──────────────────────┘        │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │               BIDIRECIONAL - MOODLE                      │      │
│  │    Import: Avaliações de professores (ratings)           │      │
│  │    Export: Sessões socráticas (xAPI/portfólio)           │      │
│  └──────────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────────┘
```

### Resumo das Integrações

| Sistema | Direção | Dados | Frequência |
|---------|---------|-------|------------|
| **JACAD** | Import | Alunos, Disciplinas, Matrículas | Sob demanda / Agendado |
| **Moodle** | Export | Sessões Socráticas, Notas | Automático ao finalizar |
| **Moodle** | Import | Avaliações de Professores | Webhook / Polling |

---

## 1. INTEGRAÇÃO JACAD (Sistema Acadêmico)

### 1.1 O Que é JACAD?

JACAD é o sistema acadêmico que contém o cadastro master de:
- **Alunos**: RA, nome, curso, email, situação
- **Disciplinas**: código, nome, departamento, carga horária
- **Matrículas**: vínculo aluno ↔ disciplina por semestre

### 1.2 Dados IMPORTADOS do JACAD → Harven.ai

| Entidade | Campos JACAD | Tabela Harven | Campos Harven |
|----------|--------------|---------------|---------------|
| **Aluno** | `ra`, `nome`, `email`, `curso`, `periodo`, `situacao` | `users` | `ra`, `name`, `email`, `role='STUDENT'`, `jacad_ra` |
| **Disciplina** | `codigo`, `nome`, `departamento`, `carga_horaria`, `semestre` | `disciplines` | `code`, `name`, `department`, `jacad_codigo` |
| **Matrícula** | `ra`, `disciplina_codigo`, `turma`, `ano`, `semestre` | `discipline_students` | `student_id`, `discipline_id` |

### 1.3 APIs do JACAD Necessárias

O Harven.ai espera que o JACAD exponha uma **API REST** com os seguintes endpoints:

```
BASE_URL: https://jacad.sua-instituicao.edu.br/api

# ENDPOINTS JACAD ESPERADOS
┌─────────────────────────────────────┬────────┬─────────────────────────────────┐
│ Endpoint                            │ Método │ Descrição                       │
├─────────────────────────────────────┼────────┼─────────────────────────────────┤
│ /health                             │ GET    │ Health check da API             │
│ /students/{ra}                      │ GET    │ Buscar aluno por RA             │
│ /students/{ra}/enrollments          │ GET    │ Matrículas do aluno             │
│ /disciplines                        │ GET    │ Listar todas disciplinas        │
│ /disciplines/{codigo}/students      │ GET    │ Alunos de uma disciplina        │
└─────────────────────────────────────┴────────┴─────────────────────────────────┘
```

### 1.4 Autenticação JACAD

```http
Authorization: Bearer {JACAD_API_KEY}
Content-Type: application/json
```

### 1.5 Schemas de Resposta JACAD

#### `GET /health` - Health Check
```json
{
  "status": "ok",
  "version": "2.1.0",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### `GET /students/{ra}` - Buscar Aluno
```json
{
  "success": true,
  "data": {
    "ra": "2024001",
    "nome": "João Silva Santos",
    "email": "joao.santos@aluno.edu.br",
    "curso": "Engenharia de Software",
    "periodo": 3,
    "situacao": "Ativo"
  }
}
```

#### `GET /students/{ra}/enrollments` - Matrículas do Aluno
```json
{
  "success": true,
  "data": [
    {
      "disciplina_codigo": "CC201",
      "disciplina_nome": "Estrutura de Dados",
      "turma": "A",
      "ano": 2024,
      "semestre": 1,
      "situacao": "Matriculado"
    },
    {
      "disciplina_codigo": "ES101",
      "disciplina_nome": "Engenharia de Requisitos",
      "turma": "A",
      "ano": 2024,
      "semestre": 1,
      "situacao": "Matriculado"
    }
  ]
}
```

#### `GET /disciplines` - Listar Disciplinas
```json
{
  "success": true,
  "data": [
    {
      "codigo": "CC201",
      "nome": "Estrutura de Dados",
      "departamento": "Ciência da Computação",
      "carga_horaria": 80,
      "semestre": "2024.1"
    },
    {
      "codigo": "ES101",
      "nome": "Engenharia de Requisitos",
      "departamento": "Engenharia de Software",
      "carga_horaria": 60,
      "semestre": "2024.1"
    }
  ]
}
```

#### `GET /disciplines/{codigo}/students` - Alunos da Disciplina
```json
{
  "success": true,
  "data": [
    {
      "ra": "2024001",
      "nome": "João Silva Santos",
      "email": "joao.santos@aluno.edu.br",
      "curso": "Engenharia de Software",
      "turma": "A",
      "situacao": "Matriculado"
    },
    {
      "ra": "2024003",
      "nome": "Pedro Henrique Lima",
      "email": "pedro.lima@aluno.edu.br",
      "curso": "Engenharia de Software",
      "turma": "A",
      "situacao": "Matriculado"
    }
  ]
}
```

### 1.6 Endpoints Harven para JACAD

| Endpoint Harven | Método | Descrição |
|-----------------|--------|-----------|
| `/integrations/test-connection?system=jacad` | POST | Testar conexão com JACAD |
| `/integrations/jacad/sync` | POST | Sincronização completa (disciplinas + alunos) |
| `/integrations/jacad/import-students` | POST | Importar apenas alunos |
| `/integrations/jacad/import-disciplines` | POST | Importar apenas disciplinas |
| `/integrations/jacad/student/{ra}` | GET | Buscar aluno diretamente no JACAD |
| `/integrations/lookup-student/{ra}` | GET | Buscar para login (JACAD + banco local) |

### 1.7 Respostas dos Endpoints Harven (JACAD)

#### `POST /integrations/jacad/sync` - Sincronização Completa
```json
{
  "disciplines": {
    "system": "jacad",
    "operation": "sync_disciplines",
    "direction": "import",
    "status": "success",
    "records_processed": 6,
    "records_created": 2,
    "records_updated": 4,
    "records_failed": 0,
    "started_at": "2024-01-15T10:30:00Z",
    "completed_at": "2024-01-15T10:30:05Z"
  },
  "users": {
    "system": "jacad",
    "operation": "sync_users",
    "direction": "import",
    "status": "success",
    "records_processed": 45,
    "records_created": 12,
    "records_updated": 33,
    "records_failed": 0,
    "started_at": "2024-01-15T10:30:05Z",
    "completed_at": "2024-01-15T10:30:25Z"
  }
}
```

#### `GET /integrations/lookup-student/{ra}` - Buscar para Login
```json
{
  "found_in_jacad": true,
  "found_in_harven": true,
  "jacad_data": {
    "ra": "2024001",
    "nome": "João Silva Santos",
    "email": "joao.santos@aluno.edu.br",
    "curso": "Engenharia de Software",
    "enrollments": [
      {
        "disciplina_codigo": "CC201",
        "disciplina_nome": "Estrutura de Dados"
      }
    ]
  },
  "harven_data": {
    "id": "uuid-do-usuario",
    "name": "João Silva Santos",
    "role": "STUDENT"
  }
}
```

---

## 2. INTEGRAÇÃO MOODLE LMS

### 2.1 O Que é Exportado para o Moodle?

| Dado | Formato | Destino Moodle | Descrição |
|------|---------|----------------|-----------|
| **Sessões Socráticas** | HTML | Portfólio do aluno | Conversa completa formatada |
| **Sessões Socráticas** | xAPI | LRS (Learning Record Store) | Formato padronizado |
| **Performance Score** | 0-100 | Gradebook | Nota da atividade |
| **Feedback AI** | Texto | Comentário | Resumo gerado pela IA |

### 2.2 O Que é Importado do Moodle?

| Dado | Origem Moodle | Tabela Harven | Uso |
|------|---------------|---------------|-----|
| **Avaliações** | Professor avalia portfólio | `moodle_ratings` | Feedback do professor |
| **Usuários** | User API | `users.moodle_user_id` | Mapeamento de IDs |
| **Cursos** | Course API | `disciplines.moodle_course_id` | Vinculação |

### 2.3 APIs do Moodle Utilizadas

O Harven usa a **Web Services REST API** do Moodle:

```
BASE_URL: https://moodle.sua-instituicao.edu.br/webservice/rest/server.php

# PARÂMETROS OBRIGATÓRIOS
wstoken={MOODLE_TOKEN}
moodlewsrestformat=json
wsfunction={NOME_DA_FUNCAO}
```

### 2.4 Funções Moodle Necessárias

| Função | Descrição | Permissão |
|--------|-----------|-----------|
| `core_webservice_get_site_info` | Health check / versão | Básico |
| `core_user_get_users` | Listar/buscar usuários | `moodle/user:viewdetails` |
| `core_course_get_courses` | Listar cursos | `moodle/course:view` |
| `core_enrol_get_enrolled_users` | Alunos de um curso | `moodle/course:enrolreview` |
| `mod_portfolio_add_entry` | Criar entrada no portfólio | `mod/portfolio:write` |
| `core_grades_update_grades` | Atualizar notas | `moodle/grade:edit` |
| `gradereport_user_get_grades_table` | Buscar notas | `moodle/grade:view` |

### 2.5 Schemas de Resposta Moodle

#### `core_webservice_get_site_info` - Informações do Site
```json
{
  "sitename": "Moodle - Universidade XYZ",
  "siteurl": "https://moodle.xyz.edu.br",
  "username": "webservice",
  "firstname": "Web",
  "lastname": "Service",
  "fullname": "Web Service",
  "lang": "pt_br",
  "userid": 999,
  "functions": [
    {"name": "core_webservice_get_site_info", "version": "4.0"},
    {"name": "core_user_get_users", "version": "4.0"}
  ],
  "release": "4.0+ (Build: 20231120)",
  "version": "2022041900"
}
```

#### `core_user_get_users` - Listar Usuários
```json
{
  "users": [
    {
      "id": 101,
      "username": "joao.santos",
      "firstname": "João",
      "lastname": "Silva Santos",
      "fullname": "João Silva Santos",
      "email": "joao.santos@aluno.edu.br",
      "roles": [{"shortname": "student"}]
    }
  ],
  "warnings": []
}
```

#### `core_course_get_courses` - Listar Cursos
```json
[
  {
    "id": 1001,
    "shortname": "CC201-2024",
    "fullname": "Estrutura de Dados - 2024.1",
    "categoryid": 10,
    "categoryname": "Ciência da Computação",
    "visible": 1,
    "format": "topics"
  }
]
```

#### `core_enrol_get_enrolled_users` - Alunos de um Curso
```json
[
  {
    "id": 101,
    "username": "joao.santos",
    "firstname": "João",
    "lastname": "Silva Santos",
    "fullname": "João Silva Santos",
    "email": "joao.santos@aluno.edu.br",
    "roles": [{"shortname": "student"}]
  }
]
```

### 2.6 Formato de Exportação - Portfólio HTML

Quando uma sessão socrática é exportada para o portfólio:

```html
<div class="harven-session">
    <h3>Sessão Socrática - Harven.ai</h3>
    <p><strong>Data:</strong> 2024-01-15</p>
    <p><strong>Disciplina:</strong> Estrutura de Dados</p>
    <p><strong>Conteúdo:</strong> Árvores Binárias</p>
    <hr/>
    <div class="conversation">
        <p><strong>Tutor AI:</strong> O que você entende por árvore binária?</p>
        <p><strong>Aluno:</strong> É uma estrutura onde cada nó tem no máximo 2 filhos...</p>
        <p><strong>Tutor AI:</strong> Interessante! E qual a diferença para uma BST?</p>
        <p><strong>Aluno:</strong> Na BST os elementos estão ordenados...</p>
        <p><strong>Tutor AI:</strong> Excelente raciocínio! Que tal investigar a complexidade de busca?</p>
        <p><strong>Aluno:</strong> Seria O(log n) no caso balanceado...</p>
    </div>
    <hr/>
    <p><strong>Score:</strong> 85/100</p>
    <p><em>Exportado automaticamente pelo Harven.ai</em></p>
</div>
```

### 2.7 Formato de Exportação - xAPI Statement

Para integração via xAPI (Learning Record Store):

```json
{
  "actor": {
    "mbox": "mailto:joao.santos@aluno.edu.br",
    "name": "João Silva Santos",
    "objectType": "Agent"
  },
  "verb": {
    "id": "http://adlnet.gov/expapi/verbs/completed",
    "display": {"pt-BR": "completou"}
  },
  "object": {
    "id": "https://harven.ai/sessions/{session_id}",
    "definition": {
      "type": "http://adlnet.gov/expapi/activities/assessment",
      "name": {"pt-BR": "Sessão Socrática - Árvores Binárias"},
      "description": {"pt-BR": "Diálogo socrático sobre estruturas de dados"}
    },
    "objectType": "Activity"
  },
  "result": {
    "score": {
      "scaled": 0.85,
      "raw": 85,
      "min": 0,
      "max": 100
    },
    "completion": true,
    "success": true,
    "duration": "PT7M"
  },
  "context": {
    "contextActivities": {
      "parent": [{
        "id": "https://harven.ai/courses/{course_id}",
        "objectType": "Activity"
      }]
    },
    "extensions": {
      "https://harven.ai/xapi/session": {
        "session_id": "uuid",
        "turns": 3,
        "ai_probability_avg": 0.18,
        "flags": []
      }
    }
  },
  "timestamp": "2024-01-15T10:35:00Z"
}
```

### 2.8 Payload Completo de Exportação

```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "export_id": "HARVEN-MOODLE-2024011510350001",
  "student": {
    "id": "uuid-harven",
    "external_id": "2024001",
    "moodle_user_id": 101,
    "name": "João Silva Santos",
    "email": "joao.santos@aluno.edu.br"
  },
  "chapter": {
    "id": "uuid-chapter",
    "title": "Árvores Binárias",
    "course_id": "uuid-course",
    "course_title": "Estrutura de Dados"
  },
  "question": {
    "id": "uuid-question",
    "text": "O que você entende por árvore binária?",
    "skill": "compreensão",
    "difficulty": "medium"
  },
  "conversation": [
    {
      "turn": 1,
      "student_message": {
        "content": "É uma estrutura onde cada nó tem no máximo 2 filhos...",
        "timestamp": "2024-01-15T10:30:00Z",
        "word_count": 45,
        "ai_probability": 0.15,
        "ai_verdict": "likely_human",
        "flags": []
      },
      "tutor_response": {
        "content": "Interessante! E qual a diferença para uma BST?",
        "timestamp": "2024-01-15T10:30:45Z",
        "agent": "Harven_Socrates"
      }
    },
    {
      "turn": 2,
      "student_message": {
        "content": "Na BST os elementos estão ordenados, o filho esquerdo é menor...",
        "timestamp": "2024-01-15T10:32:00Z",
        "word_count": 52,
        "ai_probability": 0.12,
        "ai_verdict": "likely_human",
        "flags": []
      },
      "tutor_response": {
        "content": "Excelente raciocínio! Que tal investigar a complexidade de busca?",
        "timestamp": "2024-01-15T10:32:30Z",
        "agent": "Harven_Socrates"
      }
    },
    {
      "turn": 3,
      "student_message": {
        "content": "Seria O(log n) no caso balanceado, mas pode degenerar para O(n)...",
        "timestamp": "2024-01-15T10:34:00Z",
        "word_count": 48,
        "ai_probability": 0.22,
        "ai_verdict": "likely_human",
        "flags": []
      },
      "tutor_response": {
        "content": "Perfeito! Você demonstrou compreensão profunda do tema.",
        "timestamp": "2024-01-15T10:34:30Z",
        "agent": "Harven_Socrates"
      }
    }
  ],
  "metrics": {
    "total_words_student": 145,
    "avg_response_time_seconds": 90,
    "avg_ai_probability": 0.163,
    "flags_triggered": [],
    "performance_score": 85
  },
  "session_info": {
    "started_at": "2024-01-15T10:28:00Z",
    "completed_at": "2024-01-15T10:35:00Z",
    "duration_seconds": 420,
    "status": "completed"
  }
}
```

### 2.9 Endpoints Harven para Moodle

| Endpoint Harven | Método | Descrição |
|-----------------|--------|-----------|
| `/integrations/test-connection?system=moodle` | POST | Testar conexão com Moodle |
| `/integrations/moodle/sync` | POST | Sincronização bidirecional completa |
| `/integrations/moodle/export-sessions` | POST | Exportar sessões para portfólio |
| `/integrations/moodle/ratings` | GET | Buscar avaliações de professores |
| `/integrations/moodle/import-users` | POST | Importar usuários do Moodle |
| `/integrations/moodle/webhook` | POST | Receber webhooks do Moodle |

### 2.10 Request/Response dos Endpoints Moodle

#### `POST /integrations/moodle/export-sessions`

**Request:**
```json
{
  "user_id": "uuid-opcional",
  "discipline_id": "uuid-opcional",
  "export_format": "portfolio"
}
```

**Response:**
```json
{
  "system": "moodle",
  "operation": "export_sessions",
  "direction": "export",
  "status": "success",
  "records_processed": 15,
  "records_created": 14,
  "records_failed": 1,
  "details": [
    {"session_id": "uuid-1", "status": "ok", "moodle_portfolio_id": "entry-123"},
    {"session_id": "uuid-2", "status": "error", "message": "Usuário sem moodle_user_id"}
  ],
  "started_at": "2024-01-15T10:30:00Z",
  "completed_at": "2024-01-15T10:31:00Z"
}
```

#### `GET /integrations/moodle/ratings`

**Request:**
```
GET /integrations/moodle/ratings?user_id=uuid&session_id=uuid
```

**Response:**
```json
[
  {
    "id": "uuid-rating",
    "session_id": "uuid-session",
    "user_id": "uuid-user",
    "rating": 5,
    "feedback": "Excelente raciocínio demonstrado!",
    "rated_by_moodle_id": "201",
    "rated_at": "2024-01-16T14:00:00Z"
  }
]
```

### 2.11 Webhook do Moodle

O Moodle pode enviar webhooks quando eventos ocorrem (ex: professor avalia sessão).

**Configuração no Moodle:**
1. Instalar plugin de webhooks (se não nativo)
2. Configurar URL de destino: `https://api.harven.ai/integrations/moodle/webhook`
3. Configurar secret para assinatura HMAC

**Payload do Webhook:**
```json
{
  "event_type": "rating_submitted",
  "payload": {
    "portfolio_id": "entry-123",
    "rating": 4,
    "feedback": "Bom desempenho na atividade socrática.",
    "teacher_moodle_id": 201
  },
  "signature": "sha256=abc123def456..."
}
```

**Eventos Suportados:**

| Evento | Descrição | Ação no Harven |
|--------|-----------|----------------|
| `rating_submitted` | Professor avaliou sessão | Atualiza `chat_sessions.moodle_rating` |
| `grade_updated` | Nota foi alterada | Atualiza nota interna |

**Validação de Assinatura:**
```python
import hmac
import hashlib

def verify_webhook_signature(payload: bytes, signature: str, secret: str) -> bool:
    expected = hmac.new(
        secret.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(f"sha256={expected}", signature)
```

---

## 3. CONFIGURAÇÃO

### 3.1 Variáveis de Ambiente

Adicione no arquivo `.env` do backend:

```bash
# ============================================
# INTEGRAÇÕES - CONFIGURAÇÃO
# ============================================

# JACAD (Sistema Acadêmico)
JACAD_URL=https://jacad.sua-instituicao.edu.br/api
JACAD_API_KEY=sua-chave-api-jacad-aqui
JACAD_ENABLED=true

# Moodle LMS
MOODLE_URL=https://moodle.sua-instituicao.edu.br
MOODLE_TOKEN=seu-token-webservice-moodle-aqui
MOODLE_WEBHOOK_SECRET=secret-aleatorio-para-validar-webhooks
MOODLE_ENABLED=true

# Configurações de Sync
SYNC_BATCH_SIZE=100
SYNC_RETRY_ATTEMPTS=3
SYNC_RETRY_DELAY_SECONDS=5
```

### 3.2 Criar Token no Moodle - Passo a Passo

1. **Acesse o Moodle como Administrador**

2. **Habilite Web Services:**
   - Vá em: `Administração do Site → Plugins → Serviços Web → Visão Geral`
   - Habilite "Habilitar serviços web"
   - Habilite "Habilitar protocolo REST"

3. **Crie um Serviço Externo:**
   - Vá em: `Administração do Site → Plugins → Serviços Web → Serviços Externos`
   - Clique em "Adicionar"
   - Nome: `Harven.AI Integration`
   - Nome abreviado: `harven_api`
   - Habilitado: Sim
   - Usuários autorizados: Apenas usuários específicos

4. **Adicione as Funções ao Serviço:**
   - Clique em "Funções" no serviço criado
   - Adicione:
     - `core_webservice_get_site_info`
     - `core_user_get_users`
     - `core_course_get_courses`
     - `core_enrol_get_enrolled_users`
     - `mod_portfolio_add_entry`
     - `core_grades_update_grades`
     - `gradereport_user_get_grades_table`

5. **Crie um Usuário de Serviço:**
   - Vá em: `Administração do Site → Usuários → Adicionar usuário`
   - Nome de usuário: `harven_service`
   - Email: `harven@sua-instituicao.edu.br`
   - Senha: (defina uma senha forte)

6. **Autorize o Usuário no Serviço:**
   - Volte ao serviço `harven_api`
   - Clique em "Usuários autorizados"
   - Adicione `harven_service`

7. **Gere o Token:**
   - Vá em: `Administração do Site → Plugins → Serviços Web → Gerenciar tokens`
   - Clique em "Adicionar"
   - Usuário: `harven_service`
   - Serviço: `Harven.AI Integration`
   - Clique em "Salvar alterações"
   - **Copie o token gerado** (será exibido apenas uma vez!)

8. **Configure no Harven:**
   ```bash
   MOODLE_TOKEN=o-token-que-voce-copiou
   ```

### 3.3 Configurar API no JACAD

A configuração varia conforme o sistema JACAD da instituição. Em geral:

1. **Solicite acesso à API** ao suporte técnico do JACAD
2. **Obtenha a documentação** da API REST
3. **Solicite credenciais** (API Key ou OAuth client)
4. **Configure no Harven:**
   ```bash
   JACAD_URL=https://jacad.sua-instituicao.edu.br/api
   JACAD_API_KEY=chave-fornecida-pelo-jacad
   ```

### 3.4 Testar Conexões

Após configurar, teste as conexões:

```bash
# Testar JACAD
curl -X POST "https://api.harven.ai/integrations/test-connection?system=jacad"

# Testar Moodle
curl -X POST "https://api.harven.ai/integrations/test-connection?system=moodle"
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

**Resposta esperada (modo mock):**
```json
{
  "connected": true,
  "mode": "mock",
  "message": "Usando dados mockados (desenvolvimento)",
  "version": "mock-1.0"
}
```

---

## 4. FLUXOS DE USO

### 4.1 Fluxo: Importar Alunos do JACAD

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FLUXO DE IMPORTAÇÃO JACAD                        │
└─────────────────────────────────────────────────────────────────────┘

1. Admin acessa: Configurações → Integrações → JACAD

2. Clica em "Testar Conexão"
   ┌─────────────────────────────────────────────────────────────────┐
   │ POST /integrations/test-connection?system=jacad                 │
   │                                                                 │
   │ Response: { "connected": true, "mode": "production" }           │
   └─────────────────────────────────────────────────────────────────┘

3. Se OK, clica em "Sincronizar Tudo"
   ┌─────────────────────────────────────────────────────────────────┐
   │ POST /integrations/jacad/sync                                   │
   └─────────────────────────────────────────────────────────────────┘

4. Sistema executa internamente:

   ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
   │   JACAD API      │────▶│   Harven API     │────▶│   Supabase       │
   │                  │     │                  │     │                  │
   │ GET /disciplines │     │ Para cada disc:  │     │ UPSERT           │
   │                  │     │ - Criar/atualizar│     │ disciplines      │
   └──────────────────┘     └──────────────────┘     └──────────────────┘
           │                        │                        │
           ▼                        ▼                        ▼
   ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
   │ GET /disciplines │     │ Para cada aluno: │     │ UPSERT users     │
   │ /{code}/students │     │ - Criar/atualizar│     │ INSERT           │
   │                  │     │ - Vincular disc  │     │ discipline_students│
   └──────────────────┘     └──────────────────┘     └──────────────────┘

5. Retorna relatório:
   {
     "disciplines": { "processed": 6, "created": 2, "updated": 4 },
     "users": { "processed": 45, "created": 12, "updated": 33 }
   }
```

### 4.2 Fluxo: Login com Validação JACAD

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FLUXO DE LOGIN COM JACAD                         │
└─────────────────────────────────────────────────────────────────────┘

1. Aluno digita RA: 2024001

2. Frontend chama lookup:
   ┌─────────────────────────────────────────────────────────────────┐
   │ GET /integrations/lookup-student/2024001                        │
   └─────────────────────────────────────────────────────────────────┘

3. Backend verifica:

   ┌──────────────────┐     ┌──────────────────┐
   │ Busca no JACAD   │     │ Busca no Harven  │
   │ (API externa)    │     │ (banco local)    │
   └────────┬─────────┘     └────────┬─────────┘
            │                        │
            ▼                        ▼
   ┌─────────────────────────────────────────────────────────────────┐
   │ Cenário A: Aluno existe em ambos                                │
   │ → Retorna dados + permite login                                 │
   ├─────────────────────────────────────────────────────────────────┤
   │ Cenário B: Aluno existe só no JACAD                             │
   │ → Cria usuário no Harven automaticamente + permite login        │
   ├─────────────────────────────────────────────────────────────────┤
   │ Cenário C: Aluno não existe no JACAD                            │
   │ → Retorna erro "Aluno não encontrado no sistema acadêmico"      │
   └─────────────────────────────────────────────────────────────────┘

4. Frontend completa login:
   ┌─────────────────────────────────────────────────────────────────┐
   │ POST /auth/login                                                │
   │ { "ra": "2024001", "password": "senha" }                        │
   └─────────────────────────────────────────────────────────────────┘
```

### 4.3 Fluxo: Exportar Sessões para Moodle

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FLUXO DE EXPORTAÇÃO MOODLE                       │
└─────────────────────────────────────────────────────────────────────┘

1. Aluno completa sessão socrática (3 turnos)
   ┌─────────────────────────────────────────────────────────────────┐
   │ Organizer Agent finaliza sessão:                                │
   │ - status: 'active' → 'completed'                                │
   │ - completed_at: timestamp atual                                 │
   │ - performance_score: calculado                                  │
   └─────────────────────────────────────────────────────────────────┘

2. Exportação (automática ou manual):
   ┌─────────────────────────────────────────────────────────────────┐
   │ POST /integrations/moodle/export-sessions                       │
   │ {                                                               │
   │   "user_id": "uuid",        // opcional - filtrar por aluno     │
   │   "discipline_id": "uuid",  // opcional - filtrar por disciplina│
   │   "export_format": "portfolio"  // ou "xapi"                    │
   │ }                                                               │
   └─────────────────────────────────────────────────────────────────┘

3. Sistema processa:

   ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
   │ Query Supabase   │     │ Para cada sessão │     │ Moodle API       │
   │                  │     │                  │     │                  │
   │ SELECT *         │────▶│ - Busca user     │────▶│ mod_portfolio    │
   │ FROM chat_sessions│     │   moodle_id     │     │ _add_entry       │
   │ WHERE exported   │     │ - Formata HTML   │     │                  │
   │       IS NULL    │     │ - Envia          │     │                  │
   └──────────────────┘     └──────────────────┘     └──────────────────┘
                                    │
                                    ▼
                            ┌──────────────────┐
                            │ UPDATE           │
                            │ chat_sessions    │
                            │ SET exported_at  │
                            │     portfolio_id │
                            └──────────────────┘

4. Resultado:
   {
     "status": "success",
     "records_processed": 15,
     "records_created": 14,
     "records_failed": 1
   }
```

### 4.4 Fluxo: Receber Avaliação do Professor

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FLUXO DE WEBHOOK - AVALIAÇÃO                     │
└─────────────────────────────────────────────────────────────────────┘

1. Professor avalia sessão no portfólio do Moodle
   ┌─────────────────────────────────────────────────────────────────┐
   │ Professor vê sessão socrática exportada no portfólio do aluno   │
   │ Atribui nota (1-5 estrelas) e escreve feedback                  │
   └─────────────────────────────────────────────────────────────────┘

2. Moodle envia webhook:
   ┌─────────────────────────────────────────────────────────────────┐
   │ POST /integrations/moodle/webhook                               │
   │ Headers:                                                        │
   │   X-Moodle-Signature: sha256=abc123...                          │
   │ Body:                                                           │
   │ {                                                               │
   │   "event_type": "rating_submitted",                             │
   │   "payload": {                                                  │
   │     "portfolio_id": "entry-123",                                │
   │     "rating": 5,                                                │
   │     "feedback": "Excelente raciocínio demonstrado!"             │
   │   }                                                             │
   │ }                                                               │
   └─────────────────────────────────────────────────────────────────┘

3. Sistema processa:

   ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
   │ Validar          │     │ Buscar sessão    │     │ Atualizar        │
   │ assinatura HMAC  │────▶│ pelo portfolio_id│────▶│ chat_sessions    │
   │                  │     │                  │     │ + moodle_ratings │
   └──────────────────┘     └──────────────────┘     └──────────────────┘

4. Aluno vê avaliação no dashboard:
   ┌─────────────────────────────────────────────────────────────────┐
   │ Sessão: Árvores Binárias                                        │
   │ Data: 15/01/2024                                                │
   │ Avaliação do Professor: ⭐⭐⭐⭐⭐ (5/5)                          │
   │ Feedback: "Excelente raciocínio demonstrado!"                   │
   └─────────────────────────────────────────────────────────────────┘
```

---

## 5. BANCO DE DADOS - SCHEMAS

### 5.1 Campos de Integração em `users`

```sql
-- Campos adicionais para integração
ALTER TABLE users ADD COLUMN IF NOT EXISTS jacad_ra VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS moodle_user_id INTEGER;

-- Índices para busca rápida
CREATE INDEX IF NOT EXISTS idx_users_jacad_ra ON users(jacad_ra);
CREATE INDEX IF NOT EXISTS idx_users_moodle_user_id ON users(moodle_user_id);
```

### 5.2 Campos de Integração em `disciplines`

```sql
-- Campos adicionais para integração
ALTER TABLE disciplines ADD COLUMN IF NOT EXISTS jacad_codigo VARCHAR(20);
ALTER TABLE disciplines ADD COLUMN IF NOT EXISTS moodle_course_id INTEGER;

-- Índices
CREATE INDEX IF NOT EXISTS idx_disciplines_jacad_codigo ON disciplines(jacad_codigo);
CREATE INDEX IF NOT EXISTS idx_disciplines_moodle_course_id ON disciplines(moodle_course_id);
```

### 5.3 Campos de Integração em `chat_sessions`

```sql
-- Campos para exportação Moodle
ALTER TABLE chat_sessions ADD COLUMN IF NOT EXISTS moodle_export_id VARCHAR(100) UNIQUE;
ALTER TABLE chat_sessions ADD COLUMN IF NOT EXISTS moodle_portfolio_id VARCHAR(100);
ALTER TABLE chat_sessions ADD COLUMN IF NOT EXISTS moodle_exported_at TIMESTAMP;
ALTER TABLE chat_sessions ADD COLUMN IF NOT EXISTS moodle_rating INTEGER;

-- Índice para busca de sessões não exportadas
CREATE INDEX IF NOT EXISTS idx_chat_sessions_moodle_export_id ON chat_sessions(moodle_export_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_exported_at ON chat_sessions(moodle_exported_at);
```

### 5.4 Tabela `integration_logs`

```sql
CREATE TABLE IF NOT EXISTS integration_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    system VARCHAR(20) NOT NULL,        -- 'jacad' ou 'moodle'
    operation VARCHAR(50) NOT NULL,     -- ex: 'sync_users', 'export_sessions'
    direction VARCHAR(10) NOT NULL,     -- 'import' ou 'export'
    status VARCHAR(20) NOT NULL,        -- 'success', 'failed', 'partial'
    records_processed INTEGER DEFAULT 0,
    records_created INTEGER DEFAULT 0,
    records_updated INTEGER DEFAULT 0,
    records_failed INTEGER DEFAULT 0,
    error_message TEXT,
    details JSONB,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para consultas
CREATE INDEX idx_integration_logs_system ON integration_logs(system);
CREATE INDEX idx_integration_logs_status ON integration_logs(status);
CREATE INDEX idx_integration_logs_started_at ON integration_logs(started_at DESC);
```

### 5.5 Tabela `moodle_ratings`

```sql
CREATE TABLE IF NOT EXISTS moodle_ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    feedback TEXT,
    rated_by_moodle_id VARCHAR(50),
    rated_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_moodle_ratings_session_id ON moodle_ratings(session_id);
CREATE INDEX idx_moodle_ratings_user_id ON moodle_ratings(user_id);
CREATE INDEX idx_moodle_ratings_rated_at ON moodle_ratings(rated_at DESC);
```

### 5.6 Tabela `external_mappings`

```sql
CREATE TABLE IF NOT EXISTS external_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL,   -- 'user', 'discipline', 'course', 'session'
    harven_id UUID NOT NULL,
    moodle_id VARCHAR(100),
    jacad_id VARCHAR(100),
    sync_status VARCHAR(20) DEFAULT 'active',  -- 'active', 'inactive', 'error'
    last_synced_at TIMESTAMP,
    sync_error TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(entity_type, harven_id)
);

-- Índices
CREATE INDEX idx_external_mappings_entity ON external_mappings(entity_type);
CREATE INDEX idx_external_mappings_moodle ON external_mappings(moodle_id);
CREATE INDEX idx_external_mappings_jacad ON external_mappings(jacad_id);
```

---

## 6. MODO DESENVOLVIMENTO (MOCK)

Quando `JACAD_ENABLED=false` ou `MOODLE_ENABLED=false`, o sistema usa dados mockados para desenvolvimento e testes.

### 6.1 Dados Mock JACAD

**Alunos disponíveis:**

| RA | Nome | Email | Curso | Período |
|----|------|-------|-------|---------|
| 2024001 | João Silva Santos | joao.santos@aluno.edu.br | Eng. Software | 3 |
| 2024002 | Maria Oliveira Costa | maria.costa@aluno.edu.br | Ciência da Computação | 5 |
| 2024003 | Pedro Henrique Lima | pedro.lima@aluno.edu.br | Eng. Software | 3 |
| 2024004 | Ana Beatriz Souza | ana.souza@aluno.edu.br | Sistemas de Informação | 7 |
| 2024005 | Lucas Ferreira Alves | lucas.alves@aluno.edu.br | Eng. Software | 1 |
| 2023001 | Carla Rodrigues Mendes | carla.mendes@aluno.edu.br | Ciência da Computação | 7 |
| 2023002 | Bruno Costa Pereira | bruno.pereira@aluno.edu.br | Eng. Software | 5 |

**Disciplinas disponíveis:**

| Código | Nome | Departamento | Carga Horária |
|--------|------|--------------|---------------|
| CC101 | Introdução à Programação | Ciência da Computação | 80h |
| CC201 | Estrutura de Dados | Ciência da Computação | 80h |
| CC301 | Banco de Dados | Ciência da Computação | 60h |
| ES101 | Engenharia de Requisitos | Engenharia de Software | 60h |
| ES201 | Arquitetura de Software | Engenharia de Software | 80h |
| IA101 | Inteligência Artificial | Ciência da Computação | 80h |

**Matrículas:**

| Aluno (RA) | Disciplinas |
|------------|-------------|
| 2024001 | CC201, ES101, CC301 |
| 2024002 | CC301, ES201, IA101, CC201 |
| 2024003 | CC201, ES101 |
| 2024004 | ES201, IA101, CC301 |
| 2024005 | CC101, ES101 |
| 2023001 | IA101, ES201 |
| 2023002 | CC301, ES201, IA101 |

### 6.2 Dados Mock Moodle

**Usuários:**

| ID Moodle | Username | Nome | Roles |
|-----------|----------|------|-------|
| 101 | joao.santos | João Silva Santos | student |
| 102 | maria.costa | Maria Oliveira Costa | student |
| 103 | pedro.lima | Pedro Henrique Lima | student |
| 201 | prof.carlos | Carlos Eduardo Silva | teacher |
| 202 | prof.ana | Ana Paula Martins | teacher |
| 301 | admin | Administrador Sistema | admin |

**Cursos:**

| ID Moodle | Shortname | Nome Completo |
|-----------|-----------|---------------|
| 1001 | CC201-2024 | Estrutura de Dados - 2024.1 |
| 1002 | CC301-2024 | Banco de Dados - 2024.1 |
| 1003 | ES101-2024 | Engenharia de Requisitos - 2024.1 |
| 1004 | ES201-2024 | Arquitetura de Software - 2024.1 |
| 1005 | IA101-2024 | Inteligência Artificial - 2024.1 |

**Mapeamento RA → Moodle User ID:**

| RA (JACAD) | Moodle User ID |
|------------|----------------|
| 2024001 | 101 |
| 2024002 | 102 |
| 2024003 | 103 |

### 6.3 Arquivos Mock

Os arquivos de mock estão em:
- `backend/services/mocks/jacad_mock.py`
- `backend/services/mocks/moodle_mock.py`

Para adicionar mais dados de teste, edite esses arquivos.

---

## 7. API REFERENCE COMPLETA

### 7.1 Endpoints de Integração

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           ENDPOINTS DE INTEGRAÇÃO                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│ GERAL                                                                           │
├──────────────────────────────────────────┬────────┬─────────────────────────────┤
│ Endpoint                                 │ Método │ Descrição                   │
├──────────────────────────────────────────┼────────┼─────────────────────────────┤
│ /integrations/test-connection            │ POST   │ Testar conexão              │
│ /integrations/status                     │ GET    │ Status de todas integrações │
│ /integrations/logs                       │ GET    │ Logs de sincronização       │
│ /integrations/mappings                   │ GET    │ Mapeamentos de IDs          │
├──────────────────────────────────────────┴────────┴─────────────────────────────┤
│ JACAD                                                                           │
├──────────────────────────────────────────┬────────┬─────────────────────────────┤
│ /integrations/jacad/sync                 │ POST   │ Sincronização completa      │
│ /integrations/jacad/import-students      │ POST   │ Importar alunos             │
│ /integrations/jacad/import-disciplines   │ POST   │ Importar disciplinas        │
│ /integrations/jacad/student/{ra}         │ GET    │ Buscar aluno no JACAD       │
│ /integrations/lookup-student/{ra}        │ GET    │ Buscar para login           │
├──────────────────────────────────────────┴────────┴─────────────────────────────┤
│ MOODLE                                                                          │
├──────────────────────────────────────────┬────────┬─────────────────────────────┤
│ /integrations/moodle/sync                │ POST   │ Sincronização bidirecional  │
│ /integrations/moodle/export-sessions     │ POST   │ Exportar sessões            │
│ /integrations/moodle/ratings             │ GET    │ Obter avaliações            │
│ /integrations/moodle/import-users        │ POST   │ Importar usuários           │
│ /integrations/moodle/webhook             │ POST   │ Receber webhooks            │
└──────────────────────────────────────────┴────────┴─────────────────────────────┘
```

### 7.2 Parâmetros e Exemplos

#### POST `/integrations/test-connection`

**Query Parameters:**
| Parâmetro | Tipo | Obrigatório | Valores |
|-----------|------|-------------|---------|
| system | string | Sim | `jacad` ou `moodle` |

**Exemplo:**
```bash
curl -X POST "https://api.harven.ai/integrations/test-connection?system=jacad" \
  -H "Authorization: Bearer {token}"
```

**Response 200:**
```json
{
  "connected": true,
  "mode": "production",
  "message": "Conexão estabelecida",
  "version": "2.1.0"
}
```

---

#### GET `/integrations/status`

**Response 200:**
```json
{
  "jacad": {
    "connected": true,
    "mode": "production",
    "enabled": true,
    "last_sync": "2024-01-15T10:30:00Z"
  },
  "moodle": {
    "connected": true,
    "mode": "production",
    "enabled": true,
    "sitename": "Moodle - Universidade XYZ",
    "last_sync": "2024-01-15T11:00:00Z"
  }
}
```

---

#### GET `/integrations/logs`

**Query Parameters:**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| system | string | Não | Filtrar por `jacad` ou `moodle` |
| status | string | Não | Filtrar por `success`, `failed`, `partial` |
| limit | integer | Não | Número máximo (padrão: 50) |

**Exemplo:**
```bash
curl "https://api.harven.ai/integrations/logs?system=jacad&limit=10" \
  -H "Authorization: Bearer {token}"
```

---

#### POST `/integrations/moodle/export-sessions`

**Request Body:**
```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "discipline_id": "660e8400-e29b-41d4-a716-446655440000",
  "export_format": "portfolio"
}
```

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| user_id | UUID | Não | Filtrar por aluno específico |
| discipline_id | UUID | Não | Filtrar por disciplina |
| export_format | string | Não | `portfolio` (padrão) ou `xapi` |

---

## 8. CHECKLIST DE IMPLEMENTAÇÃO

### 8.1 Para Instituição que vai Integrar JACAD

- [ ] Verificar se JACAD tem API REST disponível
- [ ] Obter documentação da API JACAD
- [ ] Mapear campos (RA, nome, etc. podem ter nomes diferentes)
- [ ] Solicitar credenciais (API Key ou OAuth)
- [ ] Testar endpoints manualmente com Postman/cURL
- [ ] Configurar variáveis de ambiente no Harven
- [ ] Executar `POST /integrations/test-connection?system=jacad`
- [ ] Executar primeira sincronização de teste
- [ ] Verificar logs de erros em `/integrations/logs`
- [ ] Configurar sincronização periódica (se desejado)

### 8.2 Para Instituição que vai Integrar Moodle

- [ ] Verificar versão do Moodle (recomendado: 3.9+)
- [ ] Habilitar Web Services no Moodle
- [ ] Criar serviço externo com funções necessárias
- [ ] Criar usuário de serviço dedicado
- [ ] Gerar e guardar token de acesso
- [ ] Configurar variáveis de ambiente no Harven
- [ ] Executar `POST /integrations/test-connection?system=moodle`
- [ ] Testar exportação de uma sessão manualmente
- [ ] Configurar webhook para avaliações (se disponível)
- [ ] Verificar se portfólio está habilitado no Moodle

### 8.3 Pós-Implementação

- [ ] Treinar equipe administrativa sobre sincronização
- [ ] Documentar processo para novos alunos
- [ ] Criar rotina de verificação de logs
- [ ] Definir política de retry para falhas
- [ ] Configurar alertas para falhas críticas

---

## 9. TROUBLESHOOTING

### 9.1 Problemas com JACAD

| Erro | Causa Provável | Solução |
|------|----------------|---------|
| "Aluno não encontrado no JACAD" | RA incorreto ou aluno inativo | Verificar RA no JACAD |
| "Erro ao conectar ao JACAD" | URL ou API Key inválidos | Verificar `.env` |
| "Timeout na requisição" | JACAD lento ou indisponível | Aumentar timeout ou tentar depois |
| "Endpoint não reconhecido" | API JACAD diferente do esperado | Adaptar `integration_service.py` |

### 9.2 Problemas com Moodle

| Erro | Causa Provável | Solução |
|------|----------------|---------|
| "Invalid token" | Token expirou ou foi revogado | Gerar novo token no Moodle |
| "Access denied" | Usuário sem permissão | Verificar capabilities do usuário |
| "Função não encontrada" | Função não adicionada ao serviço | Adicionar função ao serviço web |
| "Usuário sem moodle_user_id" | Mapeamento não existe | Importar usuários do Moodle |

### 9.3 Problemas Gerais

| Erro | Causa Provável | Solução |
|------|----------------|---------|
| "Usando dados mockados" | `*_ENABLED=false` | Setar para `true` no `.env` |
| "Função não implementada no mock" | Usando mock sem dados | Adicionar dados ao mock |
| "Conexão recusada" | Firewall ou URL incorreta | Verificar rede e URL |

### 9.4 Logs de Debug

Para debug detalhado, ative logs verbose:

```bash
# No .env
LOG_LEVEL=DEBUG
INTEGRATION_DEBUG=true
```

Logs ficarão em:
- Console: stdout do uvicorn
- Banco: tabela `integration_logs`

---

## 10. SEGURANÇA

### 10.1 Boas Práticas

1. **Nunca commitar credenciais** no git
2. **Usar HTTPS** para todas as conexões
3. **Rotacionar tokens** periodicamente
4. **Validar webhooks** com assinatura HMAC
5. **Limitar IPs** de acesso às APIs (se possível)
6. **Monitorar logs** para detectar anomalias

### 10.2 Proteção de Dados

- Dados de alunos são PII (Personally Identifiable Information)
- Seguir LGPD para dados no Brasil
- Mínimo de dados necessários (data minimization)
- Logs não devem conter senhas ou tokens

### 10.3 Validação de Webhook

```python
# Exemplo de validação de webhook do Moodle
import hmac
import hashlib

def verify_moodle_webhook(payload: bytes, signature: str) -> bool:
    secret = os.getenv("MOODLE_WEBHOOK_SECRET")
    expected = hmac.new(
        secret.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(f"sha256={expected}", signature)
```

---

## 11. REFERÊNCIAS

### 11.1 Documentação Oficial

- [Moodle Web Services API](https://docs.moodle.org/dev/Web_services_API)
- [Moodle External Functions](https://docs.moodle.org/dev/External_functions_API)
- [xAPI Specification](https://github.com/adlnet/xAPI-Spec)

### 11.2 Arquivos do Projeto

| Arquivo | Descrição |
|---------|-----------|
| `backend/services/integration_service.py` | Serviço principal de integração |
| `backend/services/mocks/jacad_mock.py` | Mock do JACAD |
| `backend/services/mocks/moodle_mock.py` | Mock do Moodle |
| `backend/main.py` (linhas 4301-4560) | Endpoints de integração |
| `backend/agents/harven_organizer.py` | Agente de exportação |

### 11.3 Contato

Para dúvidas sobre integrações, contate a equipe técnica do Harven.ai.

---

**Documento gerado em:** 2026-01-28
**Versão do Harven.ai:** 1.0.0
