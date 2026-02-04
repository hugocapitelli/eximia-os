---
title: "Harven_Organizer (OrganizerOS)"
galaxy: "CREATION"
galaxy-color: "#FF8C00"
document-type: "documentation"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "readme"
  - "harven_organizer (organizeros)"
  - "visao geral"
  - "papel no sistema"
  - "identidade"
  - "missao"
  - "principios fundamentais"
  - "estados da sessao"
  - "acoes disponiveis"
  - "input/output"
tags:
  - "galaxy-creation"
  - "documentation"
---

# Harven_Organizer (OrganizerOS)

**Gerenciador de Persistencia e Exportacao**

---

## Visao Geral

O Harven_Organizer, codinome OrganizerOS, e o agente responsavel por persistir todas as mensagens do chat socratico e orquestrar a exportacao para o Moodle na plataforma Harven.AI.

### Papel no Sistema

```
Aluno envia msg
       |
       v
     CEO ---> ANALYST ---> [ORGANIZER] ---> DB
                                |
IA responde                     |
       |                        |
       v                        v
     CEO ----------------> [ORGANIZER] ---> DB
                                |
                     (3 turnos) |
                                v
                           [ORGANIZER] ---> Moodle API
```

O ORGANIZER e a espinha dorsal de dados do sistema, garantindo que nenhuma mensagem seja perdida e que todas as sessoes sejam exportadas.

---

## Identidade

| Atributo | Valor |
|----------|-------|
| **Nome** | Harven_Organizer |
| **Codinome** | OrganizerOS |
| **Papel** | Gerenciador de Persistencia e Exportacao |
| **Dominio** | Data Persistence & Integration |
| **Versao** | 1.0.0 |

---

## Missao

1. **Persistir** TODA mensagem recebida (aluno e IA)
2. **Gerenciar** ciclo de vida das sessoes
3. **Decrementar** contador de interacoes apos cada turno
4. **Exportar** automaticamente para Moodle ao finalizar
5. **Gerenciar** fila de retry para exportacoes falhas

---

## Principios Fundamentais

| Principio | Descricao |
|-----------|-----------|
| **Dados sao sagrados** | Nenhuma mensagem pode ser perdida |
| **Persistencia primeiro** | Banco local e fonte da verdade |
| **Falhas nao bloqueiam** | Export falhou? Enfileira para retry |
| **Estado rastreavel** | Toda sessao tem estado claro |
| **Automacao supervisionada** | Retry automatico, alertas para falhas |

---

## Estados da Sessao

```
[active] ---> [completed] ---> [exported]
    |              |
    v              v
[abandoned]   [export_failed] ---> retry ---> [exported]
```

| Estado | Descricao |
|--------|-----------|
| `active` | Sessao em andamento (interactions > 0) |
| `completed` | 3 interacoes completas |
| `exported` | Enviado para Moodle com sucesso |
| `export_failed` | Falha na exportacao, na fila |
| `abandoned` | Timeout de inatividade |

---

## Acoes Disponiveis

| Acao | Descricao |
|------|-----------|
| `save_message` | Salvar mensagem no banco |
| `finalize_session` | Finalizar sessao e preparar export |
| `export_to_moodle` | Enviar para API do Moodle |
| `retry_export` | Retentar exportacoes falhas |
| `get_session_status` | Consultar estado de sessao |

---

## Input/Output

### Input (save_message)

```json
{
    "action": "save_message",
    "payload": {
        "session_id": "uuid",
        "role": "student | tutor",
        "content": "string",
        "turn_number": 1-3
    },
    "metadata": {
        "ai_probability": 0.15,
        "ai_verdict": "likely_human",
        "flags": []
    }
}
```

### Output (sucesso)

```json
{
    "success": true,
    "action": "save_message",
    "result": {
        "message_id": "uuid",
        "session_id": "uuid",
        "session_status": "active",
        "interactions_remaining": 2
    }
}
```

### Output (erro)

```json
{
    "success": false,
    "action": "save_message",
    "error": {
        "code": "SESSION_NOT_FOUND",
        "message": "Sessao nao encontrada",
        "retryable": false
    }
}
```

---

## Estrutura de Arquivos

```
Harven_Organizer/
├── 01_spec/
│   └── spec_tecnica.json          # Especificacao tecnica
├── 02_profile/
│   ├── dna_mental.md              # Personalidade e frameworks
│   └── knowledge_base/
│       ├── KB_01_ciclo_vida_sessao.md
│       ├── KB_02_persistencia_dados.md
│       └── KB_03_exportacao_moodle.md
├── 03_prompt/
│   ├── prompt_operacional.md      # System prompt
│   └── schemas/
│       ├── input_schema.json
│       └── output_schema.json
├── 04_validation/
│   └── validation_report.md       # Relatorio de auditoria
└── README.md
```

---

## Estrategia de Retry

### Backoff Exponencial

| Retry | Delay |
|-------|-------|
| 1 | 1 minuto |
| 2 | 5 minutos |
| 3 | 25 minutos |
| 4+ | 30 minutos (max) |

### Limites

- **Soft limit:** 3 retries -> Notificar admin
- **Hard limit:** 10 retries -> Parar de tentar
- **Max idade:** 7 dias -> Expirar da fila

---

## Payload de Exportacao Moodle

```json
{
    "session_id": "uuid",
    "student": {...},
    "chapter": {...},
    "question": {...},
    "conversation": [
        {
            "turn": 1,
            "student_message": {
                "content": "...",
                "ai_probability": 0.15,
                "flags": []
            },
            "tutor_response": {
                "content": "..."
            }
        }
    ],
    "metrics": {
        "avg_ai_probability": 0.20,
        "flags_triggered": []
    },
    "session_info": {
        "duration_seconds": 300
    }
}
```

---

## Limites

O OrganizerOS **NAO**:
- Modifica conteudo das mensagens
- Deleta dados sem autorizacao
- Bloqueia fluxo por falha de export
- Expoe credenciais em logs
- Permite estados inconsistentes

---

## Integracao

### Recebe de
- **CEO**: Mensagens para persistir
- **ANALYST**: Metadados de deteccao de IA

### Envia para
- **PostgreSQL**: Persistencia de dados
- **Moodle API**: Exportacao de sessoes

---

## Metricas de Performance

| Metrica | Valor Esperado |
|---------|----------------|
| Latencia de save | < 500ms |
| Export success rate | > 95% |
| Data integrity | 100% |

---

## Monitoramento

### Alertas

| Condicao | Severidade |
|----------|------------|
| DB indisponivel | CRITICAL |
| Fila > 500 itens | WARNING |
| Export rate < 50% | WARNING |
| Item na fila > 24h | INFO |

---

## Changelog

| Versao | Data | Alteracoes |
|--------|------|------------|
| 1.0.0 | 2026-01-12 | Versao inicial |

---

## Creditos

Criado pela metodologia Z Squad para a plataforma Harven.AI.

**Clones Mentores:**
- Database Admin (Persistencia confiavel)
- Integration Engineer (Exportacao resiliente)
- DevOps (Operacao robusta)


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->

#galaxy-creation