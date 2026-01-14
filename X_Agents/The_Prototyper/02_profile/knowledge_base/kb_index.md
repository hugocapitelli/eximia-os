# Knowledge Base Index — The_Prototyper

## Overview
Este índice cataloga todo conhecimento estruturado disponível para The_Prototyper.
Total de KBs: 5 | Frameworks catalogados: 25+ | Última atualização: 2026-01-11

---

## Knowledge Base Files

| ID | Arquivo | Domínio | Frameworks |
|----|---------|---------|------------|
| KB-01 | `KB_01_PRD_Templates.md` | Product Requirements Documentation | PRD Standard, One-Page PRD, Feature Brief, Agile Epic |
| KB-02 | `KB_02_PRP_Structure.md` | Product Requirement Prompts | PRP Template, Context Framing, Validation Criteria |
| KB-03 | `KB_03_RICE_Prioritization.md` | Feature Prioritization | RICE, Value vs Effort Matrix, MoSCoW |
| KB-04 | `KB_04_Customer_Discovery.md` | Customer Research | Interview Guide, Jobs-to-be-Done, Opportunity Solution Trees |
| KB-05 | `KB_05_Wireframing.md` | Visual Prototyping | Breadboarding, ASCII Wireframes, Flow Diagrams |

---

## Quick Reference

### When to Use Each KB

| Situação | KB Primário | KB Secundário |
|----------|-------------|---------------|
| "Preciso criar um PRD" | KB-01 | KB-05 (wireframes) |
| "Preciso criar um PRP para AI" | KB-02 | KB-01 (contexto) |
| "Qual feature priorizar?" | KB-03 | KB-04 (validação) |
| "Analisar entrevista com cliente" | KB-04 | KB-03 (priorização) |
| "Criar representação visual" | KB-05 | KB-01 (requisitos) |

---

## Framework Cross-Reference

| Framework | KB | Quando Usar |
|-----------|-----|-------------|
| **PRD Standard** | KB-01 | Features complexos (6-8 semanas) |
| **One-Page PRD** | KB-01 | Features médios (2-4 semanas) |
| **Feature Brief** | KB-01 | Exploração inicial (1 semana) |
| **PRP Template** | KB-02 | Desenvolvimento assistido por AI |
| **RICE Score** | KB-03 | Priorização quantitativa |
| **MoSCoW** | KB-03 | Priorização por criticidade |
| **Opportunity Solution Tree** | KB-04 | Mapeamento de oportunidades |
| **Jobs-to-be-Done** | KB-04 | Entendimento de motivações |
| **Breadboarding** | KB-05 | Fluxos antes de layouts |
| **ASCII Wireframe** | KB-05 | Representação visual em texto |

---

## Dependências

```
                    ┌─────────────┐
                    │   KB-04     │
                    │  Discovery  │
                    └──────┬──────┘
                           │
                           ▼
              ┌────────────────────────┐
              │         KB-03          │
              │    Prioritization      │
              └───────────┬────────────┘
                          │
           ┌──────────────┴──────────────┐
           ▼                             ▼
    ┌─────────────┐               ┌─────────────┐
    │   KB-01     │               │   KB-02     │
    │    PRD      │◄─────────────►│    PRP      │
    └──────┬──────┘               └─────────────┘
           │
           ▼
    ┌─────────────┐
    │   KB-05     │
    │ Wireframes  │
    └─────────────┘
```

---

## Changelog

| Versão | Data | Mudança |
|--------|------|---------|
| 1.0.0 | 2026-01-11 | Criação inicial do índice |
