# KB_14 — NASA/USDA Data Products

## Categoria: ESTRATÉGIA
## Palavras: ~2,000
## Atualizado: 2026-01-07

---

## 1. NASA Agricultural Data

### NASA Harvest

**URL:** https://nasaharvest.org

**O que é:** Iniciativa NASA para aplicar dados de satélite à agricultura.

**Produtos:**
- Crop monitoring global
- Yield forecasting
- Food security early warning

### Earthdata (NASA)

**URL:** https://earthdata.nasa.gov

**Produtos Relevantes:**

| Produto | Uso |
| :--- | :--- |
| **MODIS** | Índices de vegetação (NDVI) |
| **Landsat** | Imagens históricas de cobertura |
| **SMAP** | Umidade do solo |
| **GPM** | Precipitação |

### FEWS NET (USAID/NASA)

**URL:** https://fews.net

**O que é:** Famine Early Warning System

**Uso:** Segurança alimentar, alertas de crise

---

## 2. USDA Data Products

### Core Databases

| Database | URL | Conteúdo |
| :--- | :--- | :--- |
| **WASDE** | usda.gov/oce/commodity/wasde | Oferta/demanda global |
| **NASS** | nass.usda.gov | Estatísticas agrícolas EUA |
| **FAS** | fas.usda.gov | Dados de comércio/exportação |
| **ERS** | ers.usda.gov | Análises econômicas |
| **PSD** | apps.fas.usda.gov/psdonline | Production, Supply, Distribution |

### WASDE (Mensal)

**World Agricultural Supply and Demand Estimates**

- Publicação: ~10-12 de cada mês
- Conteúdo: Projeções de produção, consumo, estoques
- Cobertura: Grãos, oleaginosas, algodão, açúcar, lácteos, carnes
- Impacto: Move mercados de commodities

### NASS Crop Reports

| Relatório | Frequência | Conteúdo |
| :--- | :--- | :--- |
| Acreage | Junho | Área plantada |
| Crop Progress | Semanal | Status das culturas |
| Prospective Plantings | Março | Intenções de plantio |
| Grain Stocks | Trimestral | Estoques |

---

## 3. Como Acessar

### Via API

```
USDA NASS QuickStats API:
https://quickstats.nass.usda.gov/api

Parâmetros:
- commodity_desc
- state_name
- year
- statisticcat_desc
```

### Via Download

| Fonte | Formato |
| :--- | :--- |
| WASDE | PDF, Excel |
| NASS | CSV, JSON via API |
| NASA Earthdata | GeoTIFF, HDF |
| FEWS NET | Shapefiles, CSV |

---

## 4. Triangulação com Dados BR

| Cultura | USDA | Brasil |
| :--- | :--- | :--- |
| Soja | WASDE, FAS | Conab, IBGE |
| Milho | WASDE, FAS | Conab, IBGE |
| Café | FAS | Conab, OIC |
| Algodão | WASDE | Conab, Abrapa |

**Regra:** Usar USDA para visão global, Conab/IBGE para detalhe BR.

---

## 5. Referências

- NASA Harvest. (2024). *Agricultural Monitoring*.
- USDA. (2024). *WASDE Report*.
- USDA NASS. (2024). *QuickStats API Documentation*.
- FEWS NET. (2024). *Food Security Outlook*.


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->