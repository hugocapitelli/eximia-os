---
description: Adicionar múltiplos conteúdos ao Codex em lote (fila)
---

# /codex-batch

Adiciona uma série de URLs ao Codex de forma sequencial. Ideal para processar listas de links ou arquivos de texto.

## Passos

1. Preparar a lista de URLs
   - Pode ser uma lista separada por vírgulas: `"url1, url2, url3"`
   - Ou um arquivo `.txt` com um link por linha

2. Executar o comando:
```bash
# Via lista de URLs
py 00_Codex/Agentes/codex_cli/cli.py add-batch "url1, url2" --auto

# Via arquivo texto
py 00_Codex/Agentes/codex_cli/cli.py add-batch lista.txt --auto
```

## Opções

- `--auto`: Aprova todos automaticamente e envia para a LIBRARY. Sem essa flag, o sistema pedirá confirmação para cada item.

## Exemplo de Arquivo `links.txt`

```text
# Links de interesse
https://exemplo.com/artigo1
https://exemplo.com/artigo2
https://exemplo.com/artigo3
```

## Benefícios

- **Fila Automática:** O Codex processa um por um na ordem informada.
- **Relatório Final:** Ao terminar, exibe quantos itens foram importados com sucesso.
- **Resiliência:** Se um link falhar, o sistema continua para o próximo.
