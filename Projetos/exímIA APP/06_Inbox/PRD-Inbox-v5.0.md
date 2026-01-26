# PRD — Inbox (Captura Universal)
**Módulo:** 06_Inbox
**Versão:** 5.0
**Data:** 25 Janeiro 2026
**Status:** Especificação Completa

---

## Sumário Executivo

O **Inbox** é o ponto de entrada universal para captura rápida de qualquer informação — texto, voz, link, imagem.

**Filosofia:** Capture primeiro, organize depois. Inbox é anti-fricção.

---

## Índice

1. [Visão Geral](#1-visão-geral)
2. [Features](#2-features)
3. [Smart Triage](#3-smart-triage)
4. [Modelos de Dados](#4-modelos-de-dados)
5. [API Endpoints](#5-api-endpoints)

---

# 1. Visão Geral

## 1.1 O Problema

Ideias aparecem a qualquer momento:
- No banho
- Dirigindo
- Numa conversa
- Antes de dormir

Se não há forma rápida de capturar, a ideia morre.

## 1.2 A Solução

Inbox é **universalmente acessível**:
- Hotkey global (Cmd/Ctrl + Shift + Space)
- Mobile widget
- Voice capture
- Share target (recebe de outros apps)
- Email inbox (inbox@eximia.app)

---

# 2. Features

| Feature | Descrição |
|---------|-----------|
| **Quick Capture** | Texto rápido com hotkey |
| **Voice Memo** | Gravação de áudio → transcrição |
| **Link Capture** | Salva URL com preview |
| **Image Capture** | Screenshot ou foto |
| **Smart Triage** | IA sugere destino (Goal, Task, Book, etc.) |
| **Inbox Zero** | Processar todos itens |

## 2.1 Smart Triage (IA)

Quando item é capturado, IA analisa e sugere:

**Exemplo:**
```
Input: "Ler livro 'Inspired' do Marty Cagan"
Sugestão IA: 💡 → Journey / Book (Confiança: 92%)

Input: "Ideia: módulo de networking no ExímIA OS"
Sugestão IA: 💡 → Strategy / Initiative (Confiança: 78%)
```

---

# 3. Smart Triage

## 3.1 Regras de Roteamento

| Padrão no Texto | Destino Sugerido | Confidence |
|-----------------|------------------|------------|
| "Ler livro...", "Book:" | Journey / Book | 95% |
| "Meta:", "Goal:" | Journey / Goal | 90% |
| "Tarefa:", "TODO:" | Journey / Task | 85% |
| "Ideia para...", "Projeto:" | Strategy / Initiative | 75% |
| "Aprender...", "Estudar..." | Academy / Course | 80% |

---

# 4. Modelos de Dados

## 4.1 InboxItem

```typescript
interface InboxItem {
  id: string;
  user_id: string;

  // Conteúdo
  type: 'text' | 'voice' | 'link' | 'image';
  content: string;
  audio_url?: string;  // Se type = voice
  image_url?: string;  // Se type = image
  link_url?: string;   // Se type = link

  // Smart Triage
  suggested_module?: string;  // "journey", "strategy", etc.
  suggested_type?: string;    // "goal", "book", etc.
  confidence?: number;        // 0-1

  // Status
  status: 'pending' | 'processed' | 'archived';
  processed_at?: Date;

  created_at: Date;
}
```

---

# 5. API Endpoints

```
# Capture
POST   /api/inbox/capture
POST   /api/inbox/capture/voice
POST   /api/inbox/capture/link

# List & Process
GET    /api/inbox
PATCH  /api/inbox/:id/process
POST   /api/inbox/:id/accept-suggestion
DELETE /api/inbox/:id
```

---

*Inbox v5.0 — Captura sem Fricção*
*ExímIA OS — 2026*
