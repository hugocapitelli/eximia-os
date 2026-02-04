---
title: "KB_12: Propriedade Intelectual"
galaxy: "SPECIALIST"
galaxy-color: "#228B22"
document-type: "knowledge-base"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "kb-12-ip-strategy"
  - "kb_12: propriedade intelectual"
  - "1. tipos de pi"
  - "2. marcas (lei 9.279/96)"
  - "2.1 tipos de marca"
  - "2.2 classificação nice"
  - "2.3 proteção"
  - "3. patentes (lei 9.279/96)"
  - "3.1 requisitos"
  - "3.2 o que não é patenteável (a"
tags:
  - "galaxy-specialist"
  - "knowledge-base"
---

# KB_12: Propriedade Intelectual

**Categoria:** ESTRATEGIA  
**Palavras:** ~2.000  
**Fonte Principal:** LPI, Lei de Software, INPI  

---

## 1. Tipos de PI

| Tipo | Proteção | Prazo | Registro |
|------|----------|-------|----------|
| **Marca** | Sinal distintivo | 10 anos (renovável) | INPI |
| **Patente** | Invenção | 20 anos | INPI |
| **Modelo de Utilidade** | Melhoria funcional | 15 anos | INPI |
| **Desenho Industrial** | Forma ornamental | 10 anos (+3×5) | INPI |
| **Direito Autoral** | Obra criativa | 70 anos post mortem | Automático |
| **Software** | Programa de computador | 50 anos | INPI (opcional) |
| **Trade Secret** | Informação confidencial | Indefinido | Não registra |

---

## 2. Marcas (Lei 9.279/96)

### 2.1 Tipos de Marca

| Tipo | Descrição |
|------|-----------|
| **Nominativa** | Apenas palavras |
| **Figurativa** | Logotipo, símbolo |
| **Mista** | Combinação palavra + figura |
| **Tridimensional** | Forma do produto |

### 2.2 Classificação Nice

Sistema internacional com 45 classes:
- Classes 1-34: Produtos
- Classes 35-45: Serviços

### 2.3 Proteção

| Aspecto | Descrição |
|---------|-----------|
| Territorialidade | Por país |
| Especialidade | Por classe |
| Precedência | First to file |

---

## 3. Patentes (Lei 9.279/96)

### 3.1 Requisitos

| Requisito | Descrição |
|-----------|-----------|
| **Novidade** | Não disponível ao público |
| **Atividade inventiva** | Não óbvia para técnico |
| **Aplicação industrial** | Utilizável em indústria |

### 3.2 O Que Não é Patenteável (Art. 10)

- Descobertas, teorias científicas
- Métodos matemáticos
- Obras literárias, estéticas
- Programas de computador em si
- Apresentação de informações
- Regras de jogo

### 3.3 Tipos

| Tipo | Prazo | Descrição |
|------|-------|-----------|
| Patente de Invenção (PI) | 20 anos | Solução técnica nova |
| Modelo de Utilidade (MU) | 15 anos | Melhoria funcional |

---

## 4. Software (Lei 9.609/98)

### 4.1 Proteção

| Aspecto | Descrição |
|---------|-----------|
| Tipo | Direito autoral (não patente) |
| Prazo | 50 anos da criação |
| Registro | Opcional (INPI) |
| Código fonte | Protegido como segredo |

### 4.2 Contrato de Licença

| Tipo | Descrição |
|------|-----------|
| **SaaS** | Software as a Service |
| **Perpétua** | Pagamento único |
| **Subscription** | Recorrente |
| **OEM** | Para redistribuição |

---

## 5. Trade Secrets

### 5.1 Requisitos

| Requisito | Descrição |
|-----------|-----------|
| **Secredo** | Não é de conhecimento geral |
| **Valor comercial** | Porque é secreto |
| **Medidas de proteção** | Esforço razoável de sigilo |

### 5.2 Proteção

| Medida | Descrição |
|--------|-----------|
| NDA | Acordo de confidencialidade |
| Controles de acesso | Need-to-know basis |
| Marcação | "Confidential" / "Restricted" |
| Treinamento | Conscientização de empregados |

---

## 6. Due Diligence de IP

### 6.1 Checklist

| Item | Verificação |
|------|-------------|
| Titularidade | Quem é dono? Registrado? |
| Validade | Prazos, anuidades pagas? |
| Freedom to operate | Risco de infringement? |
| Licenças | In-bound, out-bound |
| Inventor/cedente | Contratos de cessão |
| Litígios | Ações pendentes |

### 6.2 Red Flags

| Red Flag | Impacto |
|----------|---------|
| Marca não registrada | Alto |
| Patente expirando | Médio |
| Desenvolvedor sem cessão | Alto (software) |
| Disputa de titularidade | Deal breaker |

---

## 7. Aplicação CLO

### 7.1 Proteção Estratégica

| Ativo | Estratégia |
|-------|------------|
| Marca umbrella | Registro em múltiplas classes |
| Core tech | Patente se possível, senão trade secret |
| Software | Direito autoral + NDA |
| Know-how | Trade secret + contratos |

### 7.2 Circuit Breakers

```yaml
triggers:
  - trigger: "Funcionário sai com código fonte"
    action: "CRISE — Legal hold, investigar theft"
    
  - trigger: "Cease & desist recebido"
    action: "ANALISAR — Avaliar mérito, responder no prazo"
    
  - trigger: "IP assignment sem documentação"
    action: "REMEDIAR — Obter cessão retroativa"
```

---

**Fontes Citadas:**
- Lei 9.279/96 (LPI)
- Lei 9.609/98 (Software)
- Lei 9.610/98 (Direitos Autorais)
- INPI, Manual de Marcas


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->

#galaxy-specialist