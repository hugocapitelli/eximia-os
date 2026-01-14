---
description: Atualiza um Clone Digital existente com novas fontes ou refinamentos
---
1. Identifique o clone a atualizar (ex: "elon_musk") e a melhoria desejada.
2. **Fase 1: Pesquisa de Novas Fontes (The_Veritas)**
   - Chame `eximia_runtime.run_agent` com agent_name="the_veritas" para pesquisar novas entrevistas, podcasts ou conteúdos recentes da pessoa.
3. **Fase 2: Extração**
   - Se há novos vídeos/áudios, instrua sobre transcrição e adicione em `1_raw_data/`.
   - Execute extração de quotes e padrões via C2_Extractor se necessário.
4. **Fase 3: Refinamento**
   - Atualize `clone_dna.yaml` com novos insights.
   - Adicione novas quotes ao `COMPLETE_QUOTES_DATABASE.md`.
   - Refine `dna_mental.md` se houver novos padrões identificados.
5. Atualize o `CHANGELOG.md` do clone.
6. Confirme: "Clone [nome] atualizado com as novas informações!"
