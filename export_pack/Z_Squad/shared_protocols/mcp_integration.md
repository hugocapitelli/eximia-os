# MCP Integration — Z Squad

## 🎯 Propósito
Este documento define como o Z Squad se integra com o **Model Context Protocol (MCP)** para garantir consistência de contexto entre módulos.

> *"Um servidor MCP centraliza os recursos (arquivos, bancos de dados)."*
> — Framework Multiagentes ExímIA

---

## 1. O Que é MCP?

O **Model Context Protocol** é um padrão aberto que permite aos agentes:
- Acessar dados de forma segura e padronizada
- Compartilhar contexto sem perda de informação
- Usar ferramentas externas com interface consistente

---

## 2. Arquitetura MCP no Z Squad

```
┌─────────────────────────────────────────────────────────┐
│                    MCP SERVER                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   Files     │  │   Clones    │  │   Schemas   │     │
│  │  Resource   │  │  Resource   │  │  Resource   │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
         ▲               ▲               ▲
         │               │               │
    ┌────┴────┐     ┌────┴────┐     ┌────┴────┐
    │   Z1    │     │   Z2    │     │   Z3    │
    │Architect│     │Profiler │     │Engineer │
    └─────────┘     └─────────┘     └─────────┘
```

---

## 3. Recursos MCP Disponíveis

### 3.1 Files Resource
**URI:** `mcp://zsquad/files/{path}`

Permite ler e escrever arquivos no workspace do agente sendo criado.

```yaml
# Exemplo de uso
resource: mcp://zsquad/files/outputs/CFO_Agent/spec_tecnica.json
operations:
  - read: "Ler spec do Z1"
  - write: "Z2 escreve dna_mental.md"
```

### 3.2 Clones Resource
**URI:** `mcp://thecloner/clones/{slug}`

Permite consultar a base de clones do @The_Cloner.

```yaml
# Exemplo de uso
resource: mcp://thecloner/clones/ray-dalio
operations:
  - read: "Consultar DNA Mental do Ray Dalio"
  - list: "Listar frameworks disponíveis"
```

### 3.3 Schemas Resource
**URI:** `mcp://zsquad/schemas/{schema_name}`

Permite validar artefatos contra schemas oficiais.

```yaml
# Exemplo de uso
resource: mcp://zsquad/schemas/spec_tecnica_v2
operations:
  - validate: "Validar JSON contra schema"
```

---

## 4. Fluxo de Uso MCP

### 4.1 Z1 Architect (Produz Spec)
```python
# Pseudocode
spec = generate_spec(user_request)
mcp.write("mcp://zsquad/files/outputs/{agent}/spec_tecnica.json", spec)
```

### 4.2 Z2 Profiler (Lê Spec, Consulta Clones)
```python
# Pseudocode
spec = mcp.read("mcp://zsquad/files/outputs/{agent}/spec_tecnica.json")
clones = spec["clones_sugeridos"]

for clone in clones:
    dna = mcp.read(f"mcp://thecloner/clones/{clone}/dna_mental")
    frameworks = mcp.list(f"mcp://thecloner/clones/{clone}/frameworks")
    
dna_mental = synthesize_dna(spec, clones_data)
mcp.write("mcp://zsquad/files/outputs/{agent}/dna_mental.md", dna_mental)
```

### 4.3 Z3 Engineer (Lê Tudo, Produz Prompt)
```python
# Pseudocode
spec = mcp.read("mcp://zsquad/files/outputs/{agent}/spec_tecnica.json")
dna = mcp.read("mcp://zsquad/files/outputs/{agent}/dna_mental.md")
kb = mcp.read("mcp://zsquad/files/outputs/{agent}/knowledge_base/*.md")

prompt = compose_prompt(spec, dna, kb)
mcp.write("mcp://zsquad/files/outputs/{agent}/prompt_operacional.md", prompt)
```

---

## 5. Benefícios do MCP

| Benefício | Descrição |
| :--- | :--- |
| **Single Source of Truth** | Todos os módulos leem do mesmo lugar |
| **Auditabilidade** | Logs de acesso e modificação |
| **Isolamento** | Cada agente tem seu namespace |
| **Versionamento** | Suporta múltiplas versões de arquivos |

---

## 6. Fallback (Sem MCP)

Se MCP não estiver disponível, usar **File System direto**:

```python
# Fallback
output_dir = f"Z_Squad/outputs/{agent_name}/"
spec = json.load(open(f"{output_dir}/spec_tecnica.json"))
```

**Risco:** Possível inconsistência se dois módulos acessarem simultaneamente.

---

## 7. Configuração MCP (Futuro)

```yaml
# mcp_config.yaml (placeholder para implementação futura)

server:
  name: "zsquad-mcp"
  version: "1.0.0"
  
resources:
  - name: files
    type: filesystem
    base_path: "./Z_Squad/outputs"
    permissions: ["read", "write"]
    
  - name: clones
    type: external
    endpoint: "mcp://thecloner"
    permissions: ["read"]
    
  - name: schemas
    type: filesystem
    base_path: "./Z_Squad/*/templates"
    permissions: ["read"]
```

---

## 📚 Referência
- [Framework Multiagentes: 05_Fluxos_de_Comunicacao.md](../../Conteudo_sintetizado/Framework_Multiagentes_EximIA/05_Fluxos_de_Comunicacao.md)
- [Anthropic: Model Context Protocol](https://www.anthropic.com/)


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->