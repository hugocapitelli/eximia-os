# PRD — API Endpoints
**Módulo:** 00_Core
**Versão:** 5.0
**Data:** 25 Janeiro 2026
**Status:** Referência Completa

---

## Sumário Executivo

Este documento centraliza todos os endpoints da API do ExímIA OS, organizados por módulo.

---

## Convenções

### Base URL
```
https://api.eximia.app/v1
```

### Autenticação
Todos endpoints (exceto `/auth/*`) requerem Bearer token:
```
Authorization: Bearer <token>
```

### Response Format
```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

---

## 1. Autenticação

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
PUT    /api/auth/me
POST   /api/auth/logout
POST   /api/auth/refresh
```

---

## 2. Journey

```
# Goals
GET/POST   /api/journey/goals
GET/PUT/DELETE /api/journey/goals/:id
PATCH  /api/journey/goals/:id/progress

# Habits
GET/POST   /api/journey/habits
GET/PUT/DELETE /api/journey/habits/:id
POST   /api/journey/habits/:id/complete
GET    /api/journey/habits/:id/analytics

# Books
GET/POST   /api/journey/books
GET/PUT/DELETE /api/journey/books/:id
POST   /api/journey/books/:id/notes
POST   /api/journey/books/:id/quotes
PATCH  /api/journey/books/:id/progress

# Calendar
GET/POST   /api/journey/calendar/events
PUT/DELETE /api/journey/calendar/events/:id
POST   /api/journey/calendar/sync

# Dashboard
GET    /api/journey/dashboard
```

---

## 3. Academy

```
# Courses
GET    /api/academy/courses
GET    /api/academy/courses/:id
POST   /api/academy/courses/:id/enroll
GET    /api/academy/courses/:id/lessons

# Lessons
GET    /api/academy/lessons/:id
POST   /api/academy/lessons/:id/start
POST   /api/academy/lessons/:id/complete

# Socratic Sessions
POST   /api/academy/socratic/start
POST   /api/academy/socratic/message
GET    /api/academy/socratic/session/:id

# Progress
GET    /api/academy/progress
GET    /api/academy/progress/course/:courseId

# Achievements
GET    /api/academy/badges
GET    /api/academy/skills
```

---

## 4. Brand

```
# Identity
GET/PUT    /api/brand/identity

# Colors
GET/POST   /api/brand/palettes
DELETE     /api/brand/palettes/:id

# Assets
GET/POST   /api/brand/assets
GET/PUT/DELETE /api/brand/assets/:id
POST       /api/brand/assets/:id/approve

# Voice
GET/PUT    /api/brand/voice
```

---

## 5. Strategy

```
# Organizations
GET/POST   /api/strategy/organizations
PUT/DELETE /api/strategy/organizations/:id

# Cycles
GET/POST   /api/strategy/cycles
GET/PUT/DELETE /api/strategy/cycles/:id

# Initiatives
GET/POST   /api/strategy/initiatives
GET/PUT/DELETE /api/strategy/initiatives/:id
PATCH      /api/strategy/initiatives/:id/status
PATCH      /api/strategy/initiatives/:id/progress

# KPIs
POST       /api/strategy/kpis
PATCH      /api/strategy/kpis/:id/update
GET        /api/strategy/kpis/:id/history
```

---

## 6. PrototypOS

```
# Projects
GET/POST   /api/prototyper/projects
GET/PUT/DELETE /api/prototyper/projects/:id

# Design Systems
GET/POST   /api/prototyper/design-systems
GET/PUT/DELETE /api/prototyper/design-systems/:id
POST       /api/prototyper/design-systems/:id/export
```

---

## 7. Inbox

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

## 8. Connection Layer

```
# Events
GET    /api/connection/events
GET    /api/connection/events/:id

# Entity Links
GET    /api/connection/links
POST   /api/connection/links
DELETE /api/connection/links/:id
GET    /api/connection/links/from/:sourceModule/:sourceId

# Suggestions
GET    /api/connection/suggestions
POST   /api/connection/suggestions/:id/accept
POST   /api/connection/suggestions/:id/dismiss

# Notifications
GET    /api/connection/notifications
PATCH  /api/connection/notifications/:id/read
DELETE /api/connection/notifications/:id
```

---

*API Endpoints v5.0 — Referência Completa*
*ExímIA OS — 2026*
