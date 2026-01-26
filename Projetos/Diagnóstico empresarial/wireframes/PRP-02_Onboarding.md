# PRP-02: Onboarding Tutorial
## Automator Sales Engine | v1.0 | 24/01/2026

---

## OBJETIVO

Educar novo usuário sobre como usar a plataforma em 4 passos rápidos (< 2 minutos).

---

## WIREFRAME - STEP 1: BEM-VINDO

```
┌────────────────────────────────────────────────────────────────┐
│  [×]                                            [Pular tutorial]│
│                                                                │
│                        ┌──────────┐                            │
│                        │  [LOGO]  │                            │
│                        └──────────┘                            │
│                                                                │
│              Bem-vindo ao Automator Sales Engine!              │
│                                                                │
│          Acelere seus diagnósticos de 60h para 3h              │
│                                                                │
│                   [Ilustração: Dashboard]                      │
│                                                                │
│                                                                │
│              ● ○ ○ ○                              [Próximo →] │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## WIREFRAME - STEP 2: COMO FUNCIONA

```
┌────────────────────────────────────────────────────────────────┐
│  [×]                                            [Pular tutorial]│
│                                                                │
│                     Como funciona?                             │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │                                                        │   │
│  │   1️⃣ Entrevista o Cliente                            │   │
│  │      Responda perguntas guiadas sobre processos       │   │
│  │                                                        │   │
│  │   2️⃣ Calculamos o ROI                                │   │
│  │      Algoritmo calcula economia anual automaticamente │   │
│  │                                                        │   │
│  │   3️⃣ Sugerimos Precificação                          │   │
│  │      Pricing inteligente baseado em 3 variáveis       │   │
│  │                                                        │   │
│  │   4️⃣ Gere a Proposta                                 │   │
│  │      PDF profissional pronto para apresentar          │   │
│  │                                                        │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│              ○ ● ○ ○                 [← Voltar]  [Próximo →] │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## WIREFRAME - STEP 3: RESULTADOS INSTANTÂNEOS

```
┌────────────────────────────────────────────────────────────────┐
│  [×]                                            [Pular tutorial]│
│                                                                │
│                  Resultados Instantâneos                       │
│                                                                │
│  [Screenshot: Tela de Resultados com gráficos]                 │
│                                                                │
│  ✅ ROI calculado automaticamente                             │
│  ✅ Gráficos visuais de impacto                               │
│  ✅ Precificação sugerida com justificativa                   │
│  ✅ Proposta PDF em 1 clique                                  │
│                                                                │
│                                                                │
│              ○ ○ ● ○                 [← Voltar]  [Próximo →] │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## WIREFRAME - STEP 4: PRONTO PARA COMEÇAR

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│                                                                │
│                    🚀 Pronto para começar!                     │
│                                                                │
│              Crie seu primeiro diagnóstico agora               │
│                                                                │
│  [Ilustração: Success + Checklist]                             │
│                                                                │
│                 ┌──────────────────────────┐                   │
│                 │  Criar primeiro diagnóstico│                   │
│                 └──────────────────────────┘                   │
│                                                                │
│                 (Ou explorar dashboard)                        │
│                                                                │
│              ○ ○ ○ ●                                           │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## COMPORTAMENTO

**Navegação:**
- Setas navegam entre steps
- Pular tutorial → vai direto para Dashboard
- Fechar (×) → modal "Tem certeza?"
- Última tela → botão "Criar diagnóstico" inicia wizard

**Progressão:**
- Indicador de etapas (● ○ ○ ○)
- Animação suave entre transições
- Pode voltar para step anterior

**Persistência:**
- Marca `onboarding_completed = true` no perfil
- Nunca mostra novamente automaticamente
- Pode reabrir via Dashboard → Help → "Ver tutorial"

---

## CRITÉRIOS ACEITE

- [ ] 4 steps fluem suavemente com animações
- [ ] Usuário pode pular a qualquer momento
- [ ] Último step redireciona para Wizard diagnóstico
- [ ] Onboarding só aparece na primeira vez
- [ ] Pode ser reaberto via menu Help
- [ ] Mobile friendly (ilustrações adaptadas)

---

**Status:** ✅ Completo
