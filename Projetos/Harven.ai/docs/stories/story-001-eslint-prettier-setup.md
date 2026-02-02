# Story HARVEN-001: Configurar ESLint e Prettier no Frontend

**Story ID:** HARVEN-001
**Epic:** HARVEN-EPIC-001 (Technical Debt Cleanup)
**Prioridade:** Alta
**Pontos:** 2
**Status:** Draft

---

## User Story

**Como** desenvolvedor do Harven.AI,
**Quero** ter ESLint e Prettier configurados no frontend,
**Para que** o código mantenha consistência e bugs de estilo sejam detectados automaticamente.

---

## Contexto

Atualmente o `package.json` mostra:
```json
"lint": "echo 'No linter configured yet'"
```

Não há padronização de código, o que dificulta:
- Code reviews
- Colaboração em equipe
- Detecção de bugs comuns

---

## Acceptance Criteria

- [ ] ESLint configurado com regras TypeScript
- [ ] Prettier configurado para formatação
- [ ] Script `npm run lint` funcional
- [ ] Script `npm run lint:fix` para correção automática
- [ ] Script `npm run format` para Prettier
- [ ] Arquivo `.eslintrc.js` ou `eslint.config.js` criado
- [ ] Arquivo `.prettierrc` criado
- [ ] Código existente passando no lint (com ajustes mínimos)

---

## Technical Details

### Dependências a Instalar

```bash
npm install -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
npm install -D eslint-plugin-react eslint-plugin-react-hooks
```

### Configuração ESLint Sugerida

```javascript
// eslint.config.js (flat config - ESLint 9+)
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn', // Warn por enquanto
      '@typescript-eslint/no-unused-vars': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  }
);
```

### Scripts no package.json

```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "format": "prettier --write \"**/*.{ts,tsx,json,css}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,json,css}\""
  }
}
```

---

## Tasks

- [ ] Instalar dependências ESLint
- [ ] Instalar dependências Prettier
- [ ] Criar arquivo de configuração ESLint
- [ ] Criar arquivo `.prettierrc`
- [ ] Criar arquivo `.prettierignore`
- [ ] Atualizar scripts no package.json
- [ ] Executar lint e corrigir erros críticos
- [ ] Documentar no README

---

## Definition of Done

- [ ] `npm run lint` executa sem erros (warnings OK)
- [ ] `npm run format` formata o código
- [ ] Configuração commitada no repositório
- [ ] README atualizado com instruções

---

## File List

| Arquivo | Ação |
|---------|------|
| `harven.ai-platform-mockup/package.json` | Modificar |
| `harven.ai-platform-mockup/eslint.config.js` | Criar |
| `harven.ai-platform-mockup/.prettierrc` | Criar |
| `harven.ai-platform-mockup/.prettierignore` | Criar |

---

## Notes

- Começar com regras permissivas (`warn` em vez de `error`)
- Gradualmente aumentar severidade
- Não bloquear build por warnings inicialmente
