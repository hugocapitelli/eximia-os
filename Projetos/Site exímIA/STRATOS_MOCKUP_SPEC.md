# STRATOS_ENTERPRISE_VIEW — Especificação de Mockup

**Uso:** Referência para recriar o dashboard StratOS no Figma ou código.

---

## 1. Frame da Janela

| Elemento | Especificação |
| :--- | :--- |
| **Tipo** | Janela de aplicativo estilo macOS |
| **Fundo** | `#0D0D0D` |
| **Bordas** | 12px radius, borda azul glow sutil |
| **Top Bar** | 3 botões (🔴🟡🟢) à esquerda |
| **Título** | `● STRATOS_ENTERPRISE_VIEW.EXE` (mono, centralizado) |

---

## 2. Sidebar (Esquerda)

| # | Ícone | Estado |
| :--- | :--- | :--- |
| 1 | Grid (4 quadrados) | Inativo (cinza) |
| 2 | Analytics (gráfico) | **Ativo** (azul glow) |
| 3 | Network (hub) | Inativo (cinza) |
| 4 | Settings (engrenagem) | Inativo (cinza) |

---

## 3. KPIs (3 Cards - Linha Superior)

| Card | Título | Valor | Indicador | Visual |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Global OEE | **87.4%** | `↗ +2.4%` (verde) | Barra azul sólida |
| 2 | Hoshin Goals | **12/15** | "On Track" | 15 dots, 12 acesos |
| 3 | Value Leakage | **$0** | "OPTIMAL" (verde) | "Last incident: 42 days ago" |

---

## 4. Gráfico (Esquerda)

| Elemento | Especificação |
| :--- | :--- |
| **Título** | "Productivity Velocity" |
| **Filtros** | D / W / M (W selecionado) |
| **Tipo** | Area chart, linha suave |
| **Cor** | Azul `#4A90D9` com glow |
| **Pontos** | Círculos brancos nos picos |
| **Eixo X** | MON-SUN (mono) |
| **Tendência** | Crescente ↗ |

---

## 5. Feed de Atividade (Direita)

| Título | "Gemba Walk" |
| :--- | :--- |

| Dot | Item | Tempo |
| :---: | :--- | :--- |
| 🔴 | Line 4 Bottleneck | 2m ago |
| 🟢 | Safety Check | 15m ago |
| 🟢 | Shift Huddle | 1h ago |
| 🟠 | QA Review | 2h ago |

| Botão | "GENERATE REPORT" (ghost, borda azul) |
| :--- | :--- |

---

## 6. Paleta de Cores

| Uso | Hex |
| :--- | :--- |
| Fundo | `#0D0D0D` |
| Cards | `#1A1A1A` |
| Texto | `#FFFFFF` |
| Secundário | `#6B7280` |
| Azul | `#4A90D9` |
| Verde | `#22C55E` |
| Vermelho | `#EF4444` |
| Laranja | `#F59E0B` |
| Glow | `#3B82F6` |

---

## 7. Tipografia

| Uso | Fonte |
| :--- | :--- |
| KPIs | Inter Black |
| Títulos | Inter Semibold |
| Timestamps | JetBrains Mono |
| Labels | Inter Medium (uppercase) |
