# KB_07 — Fontes Oficiais Agronegócio

## Categoria: ESTRATÉGIA
## Palavras: ~2,500
## Atualizado: 2026-01-07

---

## 1. Fontes Tier 1 (Governamental)

### Global

| Organização | URL | Dados |
| :--- | :--- | :--- |
| **USDA** | usda.gov | Produção, exportação, preços globais |
| **FAO** | fao.org | Segurança alimentar, estatísticas globais |
| **World Bank** | worldbank.org | Indicadores agrícolas por país |
| **NASA Harvest** | nasaharvest.org | Dados satelitais de safra |

### Brasil

| Organização | URL | Dados |
| :--- | :--- | :--- |
| **Conab** | conab.gov.br | Safras, preços, custos de produção |
| **Embrapa** | embrapa.br | Pesquisa agrícola, tecnologia |
| **IBGE** | ibge.gov.br | Produção agrícola municipal |
| **MAPA** | gov.br/agricultura | Políticas, regulação |

### Outros Países

| País | Organização | URL |
| :--- | :--- | :--- |
| China | Ministry of Agriculture | moa.gov.cn |
| Índia | Min. Agriculture | agricoop.nic.in |
| UE | Eurostat | ec.europa.eu/eurostat |
| Argentina | INDEC | indec.gob.ar |

---

## 2. Relatórios Periódicos Chave

### WASDE (USDA)

**World Agricultural Supply and Demand Estimates**

- **Frequência:** Mensal
- **Conteúdo:** Projeções globais de produção e estoques
- **Importância:** Move mercados de commodities
- **URL:** usda.gov/oce/commodity/wasde

### Safra Conab

**Acompanhamento da Safra Brasileira**

- **Frequência:** Mensal
- **Conteúdo:** Produção por cultura e estado
- **Importância:** Principal fonte Brasil
- **URL:** conab.gov.br/info-agro/safras

### FAOSTAT

**Food and Agriculture Data**

- **Frequência:** Anual (com delay de 1-2 anos)
- **Conteúdo:** Séries históricas globais
- **URL:** fao.org/faostat

---

## 3. Culturas Principais

### Soja

| Dado | Fonte Principal | Backup |
| :--- | :--- | :--- |
| Produção Brasil | Conab | USDA |
| Produção EUA | USDA NASS | — |
| Produção Global | USDA WASDE | FAO |
| Preços | CBOT, B3 | Bloomberg |
| Esmagamento | Abiove | USDA |

### Milho

| Dado | Fonte Principal | Backup |
| :--- | :--- | :--- |
| Produção Brasil | Conab | USDA |
| Produção EUA | USDA NASS | — |
| Produção Global | USDA WASDE | FAO |
| Preços | CBOT, B3 | Bloomberg |

### Café

| Dado | Fonte Principal | Backup |
| :--- | :--- | :--- |
| Produção Brasil | Conab | ICO |
| Produção Global | ICO | USDA |
| Preços | ICE, B3 | Bloomberg |
| Estoques | ICO | GCA |

### Gergelim (Sesame)

| Dado | Fonte Principal | Backup |
| :--- | :--- | :--- |
| Produção Global | FAO | USDA |
| Produção África | FAO, FEWS NET | — |
| Comércio | UN Comtrade | — |
| Preços | Trade sources | — |

---

## 4. Dados Satelitais

### NASA Harvest

- **Dados:** Monitoramento de safras por satélite
- **Cobertura:** Global
- **Aplicação:** Validação de estimativas oficiais
- **URL:** nasaharvest.org

### GEOGLAM

- **Dados:** Crop Monitor global
- **Frequência:** Mensal
- **Aplicação:** Early warning de safras
- **URL:** cropmonitor.org

### EMBRAPA Satélite

- **Dados:** Imagens para agricultura BR
- **Aplicação:** Zoneamento, monitoramento
- **URL:** embrapa.br/satelite

---

## 5. Associações de Indústria (Tier 2)

### Brasil

| Associação | Setor | Dados |
| :--- | :--- | :--- |
| **Abiove** | Soja/Óleo vegetal | Esmagamento, exportação |
| **Abrapa** | Algodão | Produção, qualidade |
| **UNICA** | Cana/Etanol | Produção, preços |
| **CNA** | Agro geral | Indicadores, custos |
| **Abag** | Agronegócio | Políticas, advocacy |

### Global

| Associação | Setor | Dados |
| :--- | :--- | :--- |
| **USDA FAS** | Comércio agrícola | Attaché reports |
| **IGC** | Grãos | Oferta/demanda global |
| **ICO** | Café | Produção, consumo |
| **ICAC** | Algodão | Estatísticas globais |

---

## 6. Preços de Commodities

### Bolsas

| Bolsa | Commodities | URL |
| :--- | :--- | :--- |
| **CBOT** (CME) | Soja, Milho, Trigo | cmegroup.com |
| **ICE** | Café, Açúcar, Algodão | theice.com |
| **B3** | Soja BR, Café, Milho | b3.com.br |

### Índices

| Índice | Descrição | Fonte |
| :--- | :--- | :--- |
| **S&P GSCI Agriculture** | Commodities agrícolas | S&P |
| **Bloomberg Agri** | Índice de agricultura | Bloomberg |
| **Cepea/Esalq** | Preços agrícolas Brasil | cepea.esalq.usp.br |

---

## 7. Metodologia de Triangulação Agro

### Exemplo: Produção de Soja Brasil 2024

```
PASSO 1: Coletar de 3 fontes Tier 1
├── Conab (Fev/2024): 155.3 Mt
├── USDA (Mar/2024): 156.0 Mt
└── IBGE (estimativa): 154.8 Mt

PASSO 2: Calcular média e dispersão
├── Média: 155.4 Mt
└── Range: 154.8 - 156.0 Mt (0.8% variação)

PASSO 3: Verificar metodologia
├── Conab: Survey com produtores + satélite
├── USDA: Modelo + attaché reports
└── IBGE: Pesquisa municipal

PASSO 4: Conclusão
├── Usar range: 155-156 Mt
├── Confidence: 90% (3 Tier 1 convergem)
└── Nota: Safra final pode revisar
```

---

## 8. Sazonalidade Agrícola Brasil

### Calendário de Safras

| Cultura | Plantio | Colheita |
| :--- | :--- | :--- |
| Soja 1ª safra | Set-Dez | Jan-Abr |
| Milho 2ª safra | Jan-Mar | Jun-Set |
| Café | — | Mai-Set |
| Algodão | Nov-Jan | Mai-Jul |
| Trigo | Abr-Jun | Set-Nov |

### Quando Dados São Publicados

| Relatório | Data Típica |
| :--- | :--- |
| WASDE | ~10-12 de cada mês |
| Conab Safra | ~10-15 de cada mês |
| IBGE PAM | Anual (ano seguinte) |

---

## 9. Referências

- USDA. (2024). *World Agricultural Supply and Demand Estimates*.
- Conab. (2024). *Acompanhamento da Safra Brasileira*.
- FAO. (2024). *FAOSTAT Database*.
- Embrapa. (2024). *Dados Agrícolas*.
