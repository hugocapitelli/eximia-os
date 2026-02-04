---
title: "KB_13 — Web Scraping Logic & Robots.txt"
galaxy: "CORE"
galaxy-color: "#8B3A8B"
document-type: "knowledge-base"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "kb-13-web-scraping-logic"
  - "kb_13 — web scraping logic & r"
  - "categoria: invariantes"
  - "palavras: ~1,500"
  - "atualizado: 2026-01-07"
  - "1. o que é robots.txt"
  - "definição"
  - "sintaxe básica"
  - "2. ações para the_veritas"
  - "✅ permitido"
tags:
  - "galaxy-core"
  - "knowledge-base"
---

# KB_13 — Web Scraping Logic & Robots.txt

## Categoria: INVARIANTES
## Palavras: ~1,500
## Atualizado: 2026-01-07

---

## 1. O que é Robots.txt

### Definição

Arquivo que informa crawlers quais partes do site podem ou não ser acessadas.

**Localização:** `https://example.com/robots.txt`

### Sintaxe Básica

```
User-agent: *        # Aplica a todos os crawlers
Disallow: /admin/    # Não acessar /admin/
Allow: /public/      # Permitir /public/
Crawl-delay: 10      # Esperar 10s entre requests
```

---

## 2. Ações para The_Veritas

### ✅ Permitido

| Ação | Justificativa |
| :--- | :--- |
| Ler dados públicos | Informação disponível para todos |
| Citar com atribuição | Fair use para pesquisa |
| Acessar APIs públicas | Uso autorizado |
| Usar cached versions | Google Cache, Wayback |

### ❌ Proibido

| Ação | Justificativa |
| :--- | :--- |
| Ignorar robots.txt | Violação de ToS |
| Bypass paywall | Ilegal na maioria dos casos |
| Scrape dados pessoais | Violação LGPD/GDPR |
| DDoS / requests excessivos | Dano ao site |
| Bypass autenticação | Acesso não autorizado |

---

## 3. Alternativas Éticas

| Se precisar de | Faça |
| :--- | :--- |
| Artigo atrás de paywall | Busque versão em repositórios acadêmicos (arXiv, SSRN) |
| Dados históricos | Use Wayback Machine (archive.org) |
| Dados agregados | Busque relatórios públicos |
| Dados privados | Solicite via canais oficiais |

---

## 4. Referências

- Internet Archive. *Wayback Machine*.
- Google. *Robots.txt Specifications*.


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->

#galaxy-core