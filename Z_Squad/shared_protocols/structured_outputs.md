---
title: "Structured Outputs — Pydantic-Style Schemas"
galaxy: "CREATION"
galaxy-color: "#FF8C00"
document-type: "document"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "structured-outputs"
  - "structured outputs — pydantic-"
  - "🎯 propósito"
  - "1. por que structured outputs?"
  - "2. schemas por módulo"
  - "2.1 z1 architect — spectecnica"
  - "2.2 z2 profiler — dnamental"
  - "2.3 z3 engineer — agentefinal"
  - "2.4 z4 auditor — validationrep"
  - "3. validação em runtime"
tags:
  - "galaxy-creation"
  - "document"
---

# Structured Outputs — Pydantic-Style Schemas

## 🎯 Propósito
Este documento define os schemas estruturados (Pydantic-style) para todos os outputs do Z Squad, garantindo validação e interoperabilidade.

---

## 1. Por Que Structured Outputs?

| Benefício | Descrição |
| :--- | :--- |
| **Validação Automática** | Erros de formato detectados imediatamente |
| **Integração** | Outputs podem ser consumidos por outros sistemas |
| **Consistência** | Mesmo formato sempre |
| **Documentação** | Schema é auto-documentado |

---

## 2. Schemas por Módulo

### 2.1 Z1 Architect — SpecTecnica

```python
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum

class NivelProficiencia(str, Enum):
    BEGINNER = "Beginner"
    INTERMEDIATE = "Intermediate"
    ADVANCED = "Advanced"
    EXPERT = "Expert"

class Competencia(BaseModel):
    skill: str = Field(..., min_length=1, description="Nome da competência")
    nivel: NivelProficiencia
    ferramentas: Optional[List[str]] = None
    validacao: Optional[str] = None
    dependencias: Optional[List[str]] = None

class Scope(BaseModel):
    in_scope: List[str] = Field(..., min_items=1)
    out_of_scope: List[str] = Field(..., min_items=1)
    stakeholders: Optional[List[str]] = None

class KPI(BaseModel):
    metrica: str
    target: str

class Meta(BaseModel):
    nome_agente: str = Field(..., min_length=1)
    versao: str = Field(..., pattern=r"^\d+\.\d+\.\d+$")
    autor: str = "Z1_Architect"
    timestamp: datetime

class SpecTecnica(BaseModel):
    """Schema de saída do Z1 Architect"""
    meta: Meta
    dominio: dict  # {primario: str, secundarios: List[str]}
    competencias: List[Competencia] = Field(..., min_items=1)
    scope: Scope
    kpis: List[KPI] = Field(..., min_items=1)
    clones_sugeridos: List[str] = Field(..., min_items=2, max_items=4)
    notas: Optional[str] = None
```

### 2.2 Z2 Profiler — DNAMental

```python
class Crenca(BaseModel):
    texto: str
    origem: str  # Clone de onde veio

class PrincipioDecisao(BaseModel):
    situacao: str
    principio: str
    acao: str

class Framework(BaseModel):
    nome: str
    origem_clone: str
    uso: str
    passos: List[str]

class Vies(BaseModel):
    nome: str
    descricao: str
    mitigacao: str

class DNAMental(BaseModel):
    """Schema de saída do Z2 Profiler"""
    agente_nome: str
    versao: str
    timestamp: datetime
    
    crencas_centrais: List[Crenca] = Field(..., min_items=3, max_items=7)
    principios_decisao: List[PrincipioDecisao] = Field(..., min_items=3)
    frameworks: List[Framework] = Field(..., min_items=2)
    estilo_comunicacao: dict  # {tom, formato, evitar}
    vieses: List[Vies] = Field(..., min_items=1)
    limites_uso: List[str] = Field(..., min_items=2)
    clones_mentores: List[str]
    
    confianca_perfil: str = Field(..., pattern=r"^(Alta|Media|Baixa)$")
```

### 2.3 Z3 Engineer — AgenteFinal

```python
class SecaoPrompt(BaseModel):
    nome: str
    conteudo: str
    tokens_estimados: int

class Invariante(BaseModel):
    id: str
    condicao: str
    acao: str
    testavel: bool = True

class AgenteFinal(BaseModel):
    """Schema de saída do Z3 Engineer"""
    nome: str
    versao: str
    timestamp: datetime
    
    secoes_prompt: List[SecaoPrompt]
    total_tokens: int = Field(..., le=4000)  # Max 4000
    invariantes: List[Invariante] = Field(..., min_items=3)
    
    input_schema_path: str
    output_schema_path: str
    tools_config_path: Optional[str] = None
    
    examples_included: int = Field(..., ge=2)  # Min 2 examples
```

### 2.4 Z4 Auditor — ValidationReport

```python
class Decisao(str, Enum):
    APPROVED = "APPROVED"
    APPROVED_WITH_CONDITIONS = "APPROVED_WITH_CONDITIONS"
    REJECTED = "REJECTED"

class Severidade(str, Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"

class TesteResultado(BaseModel):
    id: str
    categoria: str
    input: str
    esperado: str
    real: str
    resultado: str  # PASS/FAIL/WARNING
    notas: Optional[str] = None

class Issue(BaseModel):
    id: str
    severidade: Severidade
    descricao: str
    fix_sugerido: str
    testavel: bool = True

class SelfReflection(BaseModel):
    gaps_identificados: List[str]
    testes_adicionais: List[str]
    vieses_detectados: List[str]
    nota_original: float
    nota_revisada: float
    reflexao_aplicada: bool

class ValidationReport(BaseModel):
    """Schema de saída do Z4 Auditor"""
    agente_nome: str
    versao: str
    timestamp: datetime
    auditor_versao: str = "Z4_Auditor_v2"
    
    # Métricas
    nota_global: float = Field(..., ge=0, le=10)
    total_testes: int = Field(..., ge=15)  # Min 15
    testes_passados: int
    critical_failures: int = Field(..., ge=0)
    
    # Detalhes
    testes: List[TesteResultado]
    pontos_fortes: List[str]
    pontos_fracos: List[str]
    issues: List[Issue]
    
    # Self-Reflection
    self_reflection: SelfReflection
    
    # Decisão
    decisao: Decisao
    confianca: str = Field(..., pattern=r"^(Alta|Media|Baixa)$")
    human_review_required: bool
    
    # Metadata
    spec_referencia: str
    dna_referencia: str
```

---

## 3. Validação em Runtime

### Exemplo de Uso
```python
from pydantic import ValidationError

try:
    spec = SpecTecnica(**raw_data)
    # Sucesso: dados válidos
except ValidationError as e:
    # Falha: dados inválidos
    print(e.errors())
```

### Integração com Z Squad
```python
def z1_produce_spec(user_input: str) -> SpecTecnica:
    """Z1 sempre retorna SpecTecnica válida ou levanta erro"""
    raw_output = llm_generate(user_input)
    return SpecTecnica(**raw_output)  # Valida automaticamente
```

---

## 4. Benefícios para o Pipeline

| Módulo | Benefício |
| :--- | :--- |
| Z1 → Z2 | Z2 pode confiar que `competencias` tem min 1 item |
| Z2 → Z3 | Z3 sabe que `crencas_centrais` tem 3-7 items |
| Z3 → Z4 | Z4 valida que `total_tokens <= 4000` |
| Z4 → Delivery | Sistema sabe decisão é `APPROVED/REJECTED` |

---

## 📚 Referências
- [Pydantic Documentation](https://docs.pydantic.dev/)
- [OpenAI Structured Outputs](https://openai.com/)
- [Swarms Framework](https://github.com/kyegomez/swarms)


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->

#galaxy-creation