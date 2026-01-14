# CHANGELOG Template — ExímIA.OS Agents

Este template define o formato padrão de changelog para todos os agentes.

## Formato

```markdown
# Changelog — [Agent Name]

Todas as mudanças notáveis neste agente serão documentadas aqui.

Formato baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e versionamento segue [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]
### Added
### Changed
### Deprecated
### Removed
### Fixed
### Security

---

## [X.Y.Z] - YYYY-MM-DD

### Added
- Novas features/capabilities

### Changed
- Mudanças em funcionalidades existentes

### Fixed
- Bugs corrigidos

### Performance
- Melhorias de performance (token efficiency, etc.)

### Knowledge Base
- Novos KBs adicionados
- KBs atualizados

---

## [1.0.0] - YYYY-MM-DD
- Initial release
```

## Convenções de Versionamento

| Bump | Quando Usar | Exemplo |
|:---|:---|:---|
| **MAJOR (X.0.0)** | Breaking changes, mudança de personalidade/comportamento | 1.0.0 → 2.0.0 |
| **MINOR (0.X.0)** | Novas capabilities, novos KBs | 1.0.0 → 1.1.0 |
| **PATCH (0.0.X)** | Bug fixes, ajustes menores no prompt | 1.0.0 → 1.0.1 |

## Tags de Mudança

- `Added` — Novas funcionalidades
- `Changed` — Mudanças em funcionalidades existentes
- `Deprecated` — Features a serem removidas
- `Removed` — Features removidas
- `Fixed` — Correções de bugs
- `Security` — Vulnerabilidades corrigidas
- `Knowledge Base` — Mudanças em KBs
- `Performance` — Otimizações

## Boas Práticas

1. **Sempre documente breaking changes** com exemplo de migração
2. **Referencie issues/tickets** quando aplicável
3. **Mantenha [Unreleased]** atualizado durante desenvolvimento
4. **Data em formato ISO** (YYYY-MM-DD)
