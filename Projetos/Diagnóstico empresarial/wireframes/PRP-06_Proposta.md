# PRP-06: Geração de Proposta Profissional
## Automator Sales Engine | v1.0 | 24/01/2026

---

## OBJETIVO

Gerar proposta comercial em PDF profissional, editável e pronta para apresentar ao cliente.

---

## WIREFRAME

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ← Voltar              Proposta: Empresa XYZ Ltda         [Download PDF] [✉]│
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌────────────────────┐  ┌──────────────────────────────────────────────┐ │
│  │  SEÇÕES            │  │                                              │ │
│  ├────────────────────┤  │  ┌────────────────────────────────────────┐ │ │
│  │                    │  │  │ [SEU LOGO]                             │ │ │
│  │ ✓ Capa       [✏]  │  │  │                                        │ │ │
│  │ ✓ Sumário    [✏]  │  │  │  PROPOSTA DE AUTOMAÇÃO                 │ │ │
│  │ ✓ Situação   [✏]  │  │  │  DE PROCESSOS                          │ │ │
│  │ ✓ Solução    [✏]  │  │  │                                        │ │ │
│  │ ✓ ROI        [✏]  │  │  │                                        │ │ │
│  │ ✓ Investim.  [✏]  │  │  │  Empresa XYZ Ltda                      │ │ │
│  │ ✓ Próximos   [✏]  │  │  │  Janeiro 2026                          │ │ │
│  │ ✓ Termos     [✏]  │  │  │                                        │ │ │
│  │                    │  │  │                                        │ │ │
│  │ [+ Add Seção]      │  │  │  Preparado por:                        │ │ │
│  │                    │  │  │  Ricardo Silva                         │ │ │
│  │                    │  │  │  ricardo@consultoria.com               │ │ │
│  │                    │  │  │  (11) 98765-4321                       │ │ │
│  │                    │  │  │                                        │ │ │
│  │                    │  │  └────────────────────────────────────────┘ │ │
│  │                    │  │                                              │ │
│  │ [Preview Layout]   │  │  ─── Página 1 de 8 ───                      │ │
│  │ ○ A4 Portrait      │  │                                              │ │
│  │ ○ A4 Landscape     │  │  [Página Anterior]  [Próxima Página]        │ │
│  │                    │  │                                              │ │
│  │ [Tema]             │  │                                              │ │
│  │ ○ Profissional     │  └──────────────────────────────────────────────┘ │
│  │ ○ Moderno          │                                                  │
│  │ ○ Minimalista      │                                                  │
│  │                    │                                                  │
│  └────────────────────┘                                                  │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## SEÇÕES DO PDF

### 1. CAPA
```
┌─────────────────────────────────────┐
│                                     │
│        [LOGO DO CONSULTOR]          │
│                                     │
│                                     │
│      PROPOSTA DE AUTOMAÇÃO          │
│         DE PROCESSOS                │
│                                     │
│                                     │
│                                     │
│       Empresa XYZ Ltda              │
│                                     │
│       Janeiro 2026                  │
│                                     │
│                                     │
│                                     │
│       Preparado por:                │
│       Ricardo Silva                 │
│       ricardo@consultoria.com       │
│       (11) 98765-4321               │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

### 2. SUMÁRIO EXECUTIVO
```
SUMÁRIO EXECUTIVO

Diagnóstico Rápido de Automação
Empresa XYZ Ltda | Setor: Varejo

─────────────────────────────────────────

Situação Identificada:

2 processos manuais identificados consumindo 45.5 horas/mês de
trabalho operacional, com custo mensal de R$ 7.000.

Oportunidade:

Automação inteligente pode reduzir 80% do tempo gasto, gerando
economia de R$ 84.000/ano.

Investimento Proposto:

R$ 21.000 para implementação completa (2 processos).
Payback: 3 meses | ROI Cliente: 4x no primeiro ano.

Próximos Passos:

1. Aprovação da proposta
2. Kick-off do projeto (Semana 1)
3. Implementação (4-6 semanas)
4. Treinamento e go-live
```

### 3. SITUAÇÃO ATUAL
```
SITUAÇÃO ATUAL - PROCESSOS MANUAIS

─────────────────────────────────────────

1. Entrada de Notas Fiscais

Descrição:
Atualmente, 2 funcionários digitam manualmente 100 notas fiscais
por mês no sistema ERP, gastando 20 minutos por nota.

Impacto:
• 33 horas/mês de trabalho manual
• Custo mensal: R$ 5.600
• Custo anual: R$ 67.200
• Alto risco de erros de digitação

2. Cadastro de Produtos

Descrição:
1 funcionário cadastra manualmente 50 produtos/mês no e-commerce,
gastando 15 minutos por produto.

Impacto:
• 12.5 horas/mês de trabalho manual
• Custo mensal: R$ 1.640
• Custo anual: R$ 19.680
• Atraso no lançamento de novos produtos

═══════════════════════════════════════

TOTAL IMPACTO ATUAL:
• 45.5 horas/mês perdidas
• R$ 7.240/mês em custo operacional
• R$ 86.880/ano desperdiçados
```

### 4. SOLUÇÃO PROPOSTA
```
SOLUÇÃO PROPOSTA - AUTOMAÇÃO INTELIGENTE

─────────────────────────────────────────

1. Automação de Entrada de Notas Fiscais

Tecnologia: RPA (Robotic Process Automation) + OCR

Como funciona:
• Bot lê PDF da nota fiscal (OCR)
• Extrai dados automaticamente
• Valida informações
• Insere no sistema ERP
• Envia notificação de conclusão

Benefícios:
✓ Redução de 80% do tempo
✓ Elimina 95% dos erros de digitação
✓ Processa 24/7 sem intervenção humana
✓ Libera equipe para tarefas estratégicas

Prazo: 4-6 semanas

2. Automação de Cadastro de Produtos

Tecnologia: API Integration (ERP ↔ E-commerce)

Como funciona:
• Integração via API entre sistemas
• Produto cadastrado no ERP sincroniza automaticamente
• Campos mapeados e validados
• Imagens e descrições importadas
• Publicação automática no e-commerce

Benefícios:
✓ Redução de 80% do tempo
✓ Sincronização em tempo real
✓ Consistência de dados garantida
✓ Lançamentos mais rápidos

Prazo: 2-3 semanas
```

### 5. ROI & ECONOMIA
```
ROI & ECONOMIA ESPERADA

─────────────────────────────────────────

Economia Anual Total: R$ 84.000

Breakdown por Processo:
• Entrada de NF:  R$ 67.200/ano (79%)
• Cadastro Prod.: R$ 16.800/ano (21%)

Economia Mensal: R$ 7.000

Tempo Liberado: 36.4 horas/mês (80% redução)

FTEs Impactados: 3 funcionários (podem focar em atividades
estratégicas ao invés de tarefas repetitivas)

[Gráfico de Barras: ROI por Processo]
[Gráfico de Linha: Payback 12 meses]
```

### 6. INVESTIMENTO
```
INVESTIMENTO PROPOSTO

─────────────────────────────────────────

Valor Total: R$ 21.000

Inclui:
✓ Desenvolvimento das 2 automações
✓ Testes e homologação
✓ Treinamento da equipe
✓ Suporte por 3 meses
✓ Documentação completa

Forma de Pagamento:
• 30% na aprovação (R$ 6.300)
• 40% no go-live (R$ 8.400)
• 30% após 30 dias (R$ 6.300)

Análise Financeira:
• Investimento: R$ 21.000
• Economia Ano 1: R$ 84.000
• ROI: 4x (400%)
• Payback: 3 meses

Após 12 meses:
Cliente economiza R$ 63.000 líquidos (R$ 84k - R$ 21k)
```

### 7. PRÓXIMOS PASSOS
```
PRÓXIMOS PASSOS

─────────────────────────────────────────

Aprovada a proposta, seguiremos este cronograma:

Semana 1: Kick-off
• Reunião de alinhamento
• Acesso aos sistemas
• Documentação detalhada

Semanas 2-3: Desenvolvimento NF
• Criação do bot OCR
• Testes em ambiente staging
• Ajustes e validação

Semanas 4-5: Desenvolvimento Produtos
• Integração API ERP-Ecommerce
• Mapeamento de campos
• Testes

Semana 6: Homologação
• Testes com dados reais
• Ajustes finais
• Aprovação

Semana 7: Go-Live
• Deploy em produção
• Treinamento equipe
• Monitoramento

Semanas 8-10: Suporte
• Suporte dedicado
• Ajustes pontuais
• Documentação final
```

### 8. TERMOS & CONDIÇÕES
```
TERMOS & CONDIÇÕES

─────────────────────────────────────────

Validade da Proposta: 30 dias

Escopo Incluído:
✓ Desenvolvimento das automações descritas
✓ 3 meses de suporte técnico
✓ Treinamento da equipe
✓ Documentação completa

Escopo NÃO Incluído:
✗ Alterações em sistemas legados
✗ Licenças de software de terceiros
✗ Infraestrutura adicional de servidor

Garantia:
90 dias de garantia após go-live para bugs e ajustes no escopo.

Propriedade:
Código-fonte pertence ao cliente após pagamento integral.

Confidencialidade:
Todas as informações tratadas com total sigilo (NDA disponível).

Aceite:

_______________________    _______________________
Empresa XYZ Ltda           Ricardo Silva - Consultor
Data: ___/___/______       Data: ___/___/______
```

---

## MODAL: EDITAR SEÇÃO

```
┌──────────────────────────────────────────────────┐
│  Editar Seção: Sumário Executivo            [×] │
├──────────────────────────────────────────────────┤
│                                                  │
│  [Editor Rich Text com formatting]              │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ B I U [Link] [Bullet] [Number]            │ │
│  ├────────────────────────────────────────────┤ │
│  │                                            │ │
│  │ Diagnóstico Rápido de Automação           │ │
│  │ Empresa XYZ Ltda | Setor: Varejo          │ │
│  │                                            │ │
│  │ ─────────────────────────────────────     │ │
│  │                                            │ │
│  │ Situação Identificada:                     │ │
│  │ 2 processos manuais identificados...       │ │
│  │                                            │ │
│  │ [...]                                      │ │
│  │                                            │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  ℹ️ Variáveis disponíveis:                      │
│  {{cliente}} {{roi_total}} {{economia_mensal}}  │
│  {{payback}} {{num_processos}}                  │
│                                                  │
│              (Cancelar)  [Salvar Alterações]    │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## GERAÇÃO PDF (React-PDF)

```typescript
import { Document, Page, Text, View, Image } from '@react-pdf/renderer';

// Estrutura
<Document>
  <Page size="A4" style={styles.page}>
    <View style={styles.capa}>
      <Image src={logoUrl} />
      <Text style={styles.titulo}>PROPOSTA DE AUTOMAÇÃO</Text>
      <Text style={styles.cliente}>{nomeCliente}</Text>
      {/* ... */}
    </View>
  </Page>

  <Page size="A4">
    <View style={styles.sumario}>
      {/* Sumário Executivo */}
    </View>
  </Page>

  {/* Demais páginas... */}
</Document>
```

---

## CRITÉRIOS DE ACEITE

- [ ] Preview do PDF funciona em tempo real
- [ ] Editar seções funciona (rich text)
- [ ] Variáveis {{}} são substituídas corretamente
- [ ] Download PDF gera arquivo correto
- [ ] Logo do usuário aparece na capa
- [ ] Gráficos são incluídos no PDF
- [ ] Pode adicionar/remover seções customizadas
- [ ] Tema visual pode ser alterado
- [ ] Orientação (portrait/landscape) funciona
- [ ] Envio por email (futuro) preparado

---

**Status:** ✅ Completo
