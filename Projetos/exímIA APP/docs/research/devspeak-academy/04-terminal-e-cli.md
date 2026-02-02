# Relatório Completo: Conceitos Técnicos para o Módulo "Terminal & CLI"

## Guia Abrangente para Desenvolvedores Web

---

## 1. Fundamentos do Terminal

### 1.1 Conceitos Básicos

| Termo | Descrição |
|-------|-----------|
| **Terminal** | Interface baseada em texto usada para interagir com o sistema operacional do computador. Também chamado de CLI (Command Line Interface). É essencialmente um tradutor que dá acesso ao shell do computador. |
| **Shell** | Programa que interpreta e executa comandos. Atua como intermediário entre o usuário e o sistema operacional. |
| **Bash (Bourne Again Shell)** | Shell padrão em sistemas Linux. Oferece conformidade POSIX, histórico de comandos, capacidades de scripting e sintaxe aprimorada. Ideal para automação e scripts. |
| **Zsh (Z Shell)** | Shell avançado com melhor auto-completar, correção de erros de digitação, syntax highlighting e suporte ao Oh My Zsh. Padrão no macOS desde Catalina (2019). |
| **PowerShell** | Shell da Microsoft baseado em .NET com abordagem orientada a objetos. Cross-platform desde o PowerShell Core. Ideal para administração Windows e integração .NET. |
| **Emulador de Terminal** | Aplicação gráfica que fornece acesso ao shell (ex: iTerm2, Windows Terminal, Hyper, Alacritty). |
| **Prompt** | Indicador visual que mostra que o terminal está pronto para receber comandos. Pode mostrar usuário, diretório atual, branch Git, etc. |
| **Comando** | Instrução textual que o shell interpreta e executa. |
| **Argumentos** | Valores passados para um comando que especificam sobre o que ele deve operar. |
| **Flags/Opções** | Modificadores que alteram o comportamento de um comando. Geralmente prefixados com `-` (curta) ou `--` (longa). Ex: `-l`, `--help`. |

### 1.2 Streams de I/O (Entrada/Saída)

| Termo | Descrição |
|-------|-----------|
| **stdin (Standard Input)** | Fluxo de entrada padrão (file descriptor 0). Normalmente recebe entrada do teclado. |
| **stdout (Standard Output)** | Fluxo de saída padrão (file descriptor 1). Saída normal do programa, destinada ao usuário ou outro programa. |
| **stderr (Standard Error)** | Fluxo de erro padrão (file descriptor 2). Usado para mensagens de erro, debug e informações que não fazem parte da saída principal. |

### 1.3 Pipes e Redirecionamento

| Operador | Descrição |
|----------|-----------|
| `\|` (Pipe) | Conecta stdout de um comando ao stdin de outro. Permite encadeamento de comandos. Os comandos executam em paralelo. |
| `>` | Redireciona stdout para arquivo (sobrescreve). |
| `>>` | Anexa stdout ao final de um arquivo (append). |
| `<` | Redireciona stdin de um arquivo. |
| `2>` | Redireciona stderr para arquivo. |
| `2>&1` | Redireciona stderr para o mesmo destino do stdout. |
| `&>` | Redireciona tanto stdout quanto stderr para arquivo (bash/zsh). |
| `tee` | Lê stdin e escreve tanto para stdout quanto para arquivo(s). |

---

## 2. Comandos de Navegação e Manipulação de Arquivos

### 2.1 Navegação

| Comando | Descrição |
|---------|-----------|
| `pwd` | Print Working Directory - Mostra o diretório atual. |
| `cd` | Change Directory - Navega entre diretórios. `cd ~` vai para home, `cd ..` sobe um nível, `cd -` volta ao diretório anterior. |
| `ls` | Lista arquivos e diretórios. `-l` formato detalhado, `-a` inclui ocultos, `-h` tamanhos legíveis, `-la` combinação comum. |
| `dir` | Equivalente Windows do `ls`. |
| `tree` | Exibe estrutura de diretórios em formato de árvore. |

### 2.2 Manipulação de Arquivos e Diretórios

| Comando | Descrição |
|---------|-----------|
| `mkdir` | Cria diretórios. `-p` cria diretórios pais se necessário. |
| `rmdir` | Remove diretórios vazios. |
| `rm` | Remove arquivos. `-r` recursivo, `-f` forçado, `-rf` remove diretórios com conteúdo (usar com cuidado!). |
| `cp` | Copia arquivos. `-r` copia diretórios recursivamente, `-i` confirma sobrescrita. |
| `mv` | Move ou renomeia arquivos/diretórios. |
| `touch` | Cria arquivo vazio ou atualiza timestamp de arquivo existente. |
| `ln` | Cria links. `-s` cria link simbólico (symlink). |

### 2.3 Visualização e Busca de Conteúdo

| Comando | Descrição |
|---------|-----------|
| `cat` | Concatena e exibe conteúdo de arquivos. |
| `head` | Exibe as primeiras linhas de um arquivo. `-n 20` exibe 20 linhas. |
| `tail` | Exibe as últimas linhas. `-f` segue arquivo em tempo real (útil para logs). |
| `less` | Visualizador paginado para arquivos grandes. Permite navegação. |
| `more` | Visualizador paginado mais simples que `less`. |
| `grep` | Busca padrões em arquivos. `-i` ignora case, `-r` recursivo, `-n` mostra números de linha. |
| `find` | Localiza arquivos por nome, tipo, data, etc. Ex: `find . -name "*.js"`. |
| `locate` | Busca rápida usando banco de dados indexado. |
| `which` | Mostra caminho completo de um executável. |
| `whereis` | Localiza binário, fonte e manual de um comando. |

### 2.4 Outros Comandos Essenciais

| Comando | Descrição |
|---------|-----------|
| `echo` | Exibe texto ou valor de variáveis. |
| `clear` | Limpa a tela do terminal. |
| `history` | Mostra histórico de comandos. |
| `man` | Exibe manual de um comando. Ex: `man ls`. |
| `whoami` | Mostra usuário atual. |
| `hostname` | Mostra nome do computador. |
| `date` | Exibe data e hora atual. |
| `cal` | Exibe calendário. |
| `wc` | Conta linhas, palavras e caracteres. `-l` apenas linhas. |
| `sort` | Ordena linhas de texto. |
| `uniq` | Remove linhas duplicadas adjacentes. |
| `diff` | Compara diferenças entre arquivos. |
| `xargs` | Constrói e executa comandos a partir de stdin. |

---

## 3. Fundamentos do Git

### 3.1 Conceitos Core

| Termo | Descrição |
|-------|-----------|
| **Repositório (Repo)** | Diretório rastreado pelo Git contendo todo histórico de versões do projeto. |
| **Working Directory** | Diretório de trabalho - área onde você edita arquivos. Reflete o estado atual dos arquivos no sistema. |
| **Staging Area (Index)** | Área intermediária onde você prepara mudanças para o próximo commit. Permite controle granular sobre o que será commitado. |
| **Commit** | Snapshot permanente das mudanças no staging area. Inclui mensagem descritiva, autor, data e hash único. |
| **Branch** | Linha independente de desenvolvimento. Permite trabalhar em features sem afetar a branch principal. |
| **HEAD** | Ponteiro para o commit atual/branch ativa. |
| **Remote** | Repositório hospedado em servidor (GitHub, GitLab, Bitbucket). |
| **Origin** | Nome padrão dado ao remote principal ao clonar um repositório. |
| **Clone** | Cópia completa de um repositório remoto para sua máquina local. |
| **Fork** | Cópia de um repositório na sua conta (comum em contribuições open source). |
| **Upstream** | Repositório original de um fork. |
| **Merge** | Combina mudanças de uma branch em outra. |
| **Rebase** | Reaplica commits de uma branch sobre outra, criando histórico linear. |
| **Tag** | Marcador permanente para um commit específico (usado para versões/releases). |
| **Hash/SHA** | Identificador único de 40 caracteres para cada commit. |

### 3.2 Estados dos Arquivos no Git

| Estado | Descrição |
|--------|-----------|
| **Untracked** | Arquivo novo que o Git ainda não está rastreando. |
| **Tracked** | Arquivo conhecido pelo Git. |
| **Unmodified** | Arquivo rastreado sem alterações desde o último commit. |
| **Modified** | Arquivo rastreado com alterações não staged. |
| **Staged** | Arquivo marcado para inclusão no próximo commit. |
| **Committed** | Mudanças salvas permanentemente no repositório. |

---

## 4. Comandos Git

### 4.1 Configuração e Setup

| Comando | Descrição |
|---------|-----------|
| `git config --global user.name "Nome"` | Define nome do usuário globalmente. |
| `git config --global user.email "email@ex.com"` | Define email do usuário globalmente. |
| `git config --list` | Lista todas as configurações. |
| `git init` | Inicializa novo repositório Git no diretório atual. |
| `git clone <url>` | Clona repositório remoto para máquina local. |

### 4.2 Comandos Básicos de Snapshot

| Comando | Descrição |
|---------|-----------|
| `git status` | Mostra estado do working directory e staging area. |
| `git add <arquivo>` | Adiciona arquivo(s) ao staging area. |
| `git add .` | Adiciona todas as mudanças ao staging area. |
| `git add -p` | Adiciona interativamente por hunks (partes). |
| `git commit -m "mensagem"` | Cria commit com mensagem. |
| `git commit -am "mensagem"` | Adiciona arquivos rastreados modificados e commita. |
| `git commit --amend` | Modifica o último commit (mensagem ou conteúdo). |
| `git rm <arquivo>` | Remove arquivo do working directory e staging. |
| `git mv <origem> <destino>` | Move/renomeia arquivo. |

### 4.3 Branching e Merging

| Comando | Descrição |
|---------|-----------|
| `git branch` | Lista branches locais. |
| `git branch <nome>` | Cria nova branch. |
| `git branch -d <nome>` | Deleta branch (seguro). |
| `git branch -D <nome>` | Força deleção de branch. |
| `git branch -a` | Lista todas as branches (locais e remotas). |
| `git checkout <branch>` | Muda para branch especificada (método antigo). |
| `git switch <branch>` | Muda para branch especificada (método moderno). |
| `git switch -c <nome>` | Cria e muda para nova branch. |
| `git checkout -b <nome>` | Cria e muda para nova branch (método antigo). |
| `git merge <branch>` | Mescla branch especificada na branch atual. |
| `git merge --no-ff <branch>` | Merge sem fast-forward (preserva histórico). |
| `git rebase <branch>` | Reaplica commits sobre outra branch. |
| `git rebase -i HEAD~n` | Rebase interativo dos últimos n commits. |
| `git cherry-pick <hash>` | Aplica commit específico na branch atual. |

### 4.4 Comandos Remotos

| Comando | Descrição |
|---------|-----------|
| `git remote -v` | Lista remotes configurados. |
| `git remote add <nome> <url>` | Adiciona novo remote. |
| `git remote remove <nome>` | Remove remote. |
| `git fetch` | Baixa mudanças do remote (sem merge). |
| `git fetch --all` | Baixa de todos os remotes. |
| `git pull` | Fetch + merge da branch remota. |
| `git pull --rebase` | Fetch + rebase (histórico mais limpo). |
| `git push` | Envia commits para o remote. |
| `git push -u origin <branch>` | Push e configura upstream. |
| `git push --force` | Push forçado (usar com extremo cuidado!). |
| `git push --force-with-lease` | Push forçado mais seguro (verifica se há mudanças remotas). |
| `git push origin --delete <branch>` | Deleta branch remota. |

### 4.5 Visualização de Histórico

| Comando | Descrição |
|---------|-----------|
| `git log` | Mostra histórico de commits. |
| `git log --oneline` | Log compacto (uma linha por commit). |
| `git log --graph` | Log com visualização gráfica de branches. |
| `git log --oneline --graph --all` | Visualização completa do histórico. |
| `git log -p` | Log com diff de cada commit. |
| `git log --stat` | Log com estatísticas de arquivos alterados. |
| `git log --author="Nome"` | Filtra por autor. |
| `git diff` | Mostra mudanças não staged. |
| `git diff --staged` | Mostra mudanças staged. |
| `git diff <branch1>..<branch2>` | Diferenças entre branches. |
| `git show <hash>` | Mostra detalhes de um commit específico. |
| `git blame <arquivo>` | Mostra quem alterou cada linha. |

### 4.6 Desfazendo Mudanças

| Comando | Descrição |
|---------|-----------|
| `git restore <arquivo>` | Descarta mudanças no working directory. |
| `git restore --staged <arquivo>` | Remove arquivo do staging (unstage). |
| `git reset HEAD~1` | Desfaz último commit (mantém mudanças). |
| `git reset --soft HEAD~1` | Desfaz commit, mantém mudanças staged. |
| `git reset --hard HEAD~1` | Desfaz commit e todas as mudanças (perigoso!). |
| `git revert <hash>` | Cria novo commit que desfaz mudanças (seguro para branches públicas). |
| `git clean -fd` | Remove arquivos untracked. |

### 4.7 Stash (Armazenamento Temporário)

| Comando | Descrição |
|---------|-----------|
| `git stash` | Salva mudanças temporariamente. |
| `git stash save "mensagem"` | Stash com descrição. |
| `git stash list` | Lista stashes salvos. |
| `git stash pop` | Aplica e remove último stash. |
| `git stash apply` | Aplica stash sem remover da lista. |
| `git stash drop` | Remove stash da lista. |
| `git stash clear` | Remove todos os stashes. |

### 4.8 Tags

| Comando | Descrição |
|---------|-----------|
| `git tag` | Lista tags. |
| `git tag <nome>` | Cria tag leve. |
| `git tag -a <nome> -m "msg"` | Cria tag anotada. |
| `git push origin <tag>` | Push de tag específica. |
| `git push --tags` | Push de todas as tags. |

---

## 5. Conceitos de Workflow Git

### 5.1 Estratégias de Branching

| Estratégia | Descrição |
|------------|-----------|
| **GitFlow** | Modelo com branches `main`, `develop`, `feature/*`, `release/*`, `hotfix/*`. Ideal para releases programados e projetos complexos. Perdendo popularidade em favor de trunk-based. |
| **Trunk-Based Development** | Commits frequentes na branch principal (main/trunk). Favorece CI/CD, reduz conflitos de merge. Requer equipe experiente e boas práticas de CI/CD. 28% mais rápido segundo estudos. |
| **GitHub Flow** | Simplificado: main + feature branches. Pull requests para revisão. Ideal para deploy contínuo. |
| **Feature Branch** | Cada feature em branch separada, merge via PR após revisão. |
| **Release Branch** | Branches específicas para preparação de releases. |

### 5.2 Colaboração e Revisão

| Termo | Descrição |
|-------|-----------|
| **Pull Request (PR)** | Solicitação para mesclar mudanças. Permite revisão de código, discussão e testes automatizados antes do merge. |
| **Merge Request (MR)** | Termo equivalente a PR usado no GitLab. |
| **Code Review** | Processo de revisão de código por outros desenvolvedores antes do merge. |
| **Merge Conflict** | Ocorre quando Git não consegue mesclar automaticamente mudanças conflitantes. Requer resolução manual. |
| **Squash and Merge** | Combina todos os commits de uma PR em um único commit. |
| **Rebase and Merge** | Reaplica commits da PR sobre a branch base. |

### 5.3 Arquivos de Configuração Git

| Arquivo | Descrição |
|---------|-----------|
| **`.gitignore`** | Lista arquivos/diretórios que o Git deve ignorar. Usa padrões glob. `**` corresponde a qualquer número de subdiretórios. |
| **`.gitattributes`** | Define atributos por path (line endings, diff settings, merge strategies). |
| **`.gitkeep`** | Arquivo placeholder para rastrear diretórios vazios. |
| **`.gitmodules`** | Configuração de submodules. |

### 5.4 Git Hooks

| Hook | Descrição |
|------|-----------|
| **pre-commit** | Executa antes do commit. Usado para linting, testes, formatação. |
| **commit-msg** | Valida mensagem de commit. |
| **pre-push** | Executa antes do push. |
| **post-merge** | Executa após merge. |
| **pre-rebase** | Executa antes de rebase. |

### 5.5 Conventional Commits

| Tipo | Descrição |
|------|-----------|
| **feat:** | Nova funcionalidade. |
| **fix:** | Correção de bug. |
| **docs:** | Mudanças em documentação. |
| **style:** | Formatação (não afeta código). |
| **refactor:** | Refatoração (sem mudança de funcionalidade). |
| **test:** | Adição/correção de testes. |
| **chore:** | Tarefas de manutenção. |
| **perf:** | Melhorias de performance. |
| **ci:** | Mudanças em CI/CD. |
| **build:** | Mudanças no sistema de build. |

Formato: `tipo(escopo): descrição`

Exemplo: `feat(auth): add password recovery flow`

---

## 6. NPM / Yarn / PNPM

### 6.1 Conceitos Fundamentais

| Termo | Descrição |
|-------|-----------|
| **package.json** | Manifesto do projeto. Define nome, versão, scripts, dependências e metadados. |
| **package-lock.json** | Lockfile do NPM. Registra versões exatas de todas as dependências e sub-dependências para builds reproduzíveis. |
| **yarn.lock** | Lockfile do Yarn. Mesma função do package-lock.json. |
| **pnpm-lock.yaml** | Lockfile do PNPM. |
| **node_modules** | Diretório onde pacotes instalados são armazenados. |
| **dependencies** | Pacotes necessários em produção. |
| **devDependencies** | Pacotes necessários apenas em desenvolvimento/testes. |
| **peerDependencies** | Pacotes que devem ser instalados pelo consumidor do pacote. |
| **optionalDependencies** | Pacotes opcionais (instalação falha silenciosamente). |
| **bundledDependencies** | Pacotes incluídos no tarball ao publicar. |

### 6.2 Semantic Versioning (SemVer)

| Componente | Formato | Descrição |
|------------|---------|-----------|
| **MAJOR** | X.0.0 | Incrementa quando há mudanças incompatíveis (breaking changes). |
| **MINOR** | 0.Y.0 | Incrementa quando adiciona funcionalidade mantendo compatibilidade. |
| **PATCH** | 0.0.Z | Incrementa para correções de bugs compatíveis. |

| Símbolo | Exemplo | Descrição |
|---------|---------|-----------|
| `^` (caret) | ^1.2.3 | Permite atualizações minor e patch (>= 1.2.3, < 2.0.0). Padrão do npm. |
| `~` (tilde) | ~1.2.3 | Permite apenas atualizações patch (>= 1.2.3, < 1.3.0). |
| Exato | 1.2.3 | Versão exata, sem atualizações. |
| `*` | * | Qualquer versão. |
| `>=`, `<=`, `>`, `<` | >=1.0.0 | Comparadores de versão. |
| `\|\|` | 1.x \|\| >=2.0.0 | Alternativas de versão. |

### 6.3 Comandos NPM

| Comando | Descrição |
|---------|-----------|
| `npm init` | Inicializa projeto, cria package.json. |
| `npm init -y` | Inicializa com valores padrão. |
| `npm install` | Instala todas as dependências do package.json. |
| `npm install <pacote>` | Instala pacote como dependência. |
| `npm install <pacote> --save-dev` | Instala como devDependency. |
| `npm install -g <pacote>` | Instala globalmente. |
| `npm uninstall <pacote>` | Remove pacote. |
| `npm update` | Atualiza pacotes conforme ranges do package.json. |
| `npm outdated` | Lista pacotes desatualizados. |
| `npm run <script>` | Executa script definido em package.json. |
| `npm start` | Atalho para `npm run start`. |
| `npm test` | Atalho para `npm run test`. |
| `npm publish` | Publica pacote no registry. |
| `npm pack` | Cria tarball do pacote. |
| `npm link` | Cria symlink para desenvolvimento local. |
| `npm ls` | Lista pacotes instalados. |
| `npm audit` | Verifica vulnerabilidades de segurança. |
| `npm audit fix` | Corrige vulnerabilidades automaticamente. |
| `npm cache clean --force` | Limpa cache do npm. |
| `npm ci` | Clean install - instala exatamente o que está no lockfile (ideal para CI/CD). |

### 6.4 npx

| Comando | Descrição |
|---------|-----------|
| `npx <comando>` | Executa pacote sem instalá-lo globalmente. Ex: `npx create-react-app my-app`. |
| `npx <pacote>@<versão>` | Executa versão específica de um pacote. |

### 6.5 Comandos Yarn

| Comando | Descrição |
|---------|-----------|
| `yarn init` | Inicializa projeto. |
| `yarn` ou `yarn install` | Instala dependências. |
| `yarn add <pacote>` | Adiciona dependência. |
| `yarn add <pacote> --dev` | Adiciona devDependency. |
| `yarn global add <pacote>` | Instala globalmente. |
| `yarn remove <pacote>` | Remove pacote. |
| `yarn upgrade` | Atualiza pacotes. |
| `yarn <script>` | Executa script (sem `run`). |
| `yarn why <pacote>` | Explica por que pacote está instalado. |

### 6.6 Comandos PNPM

| Comando | Descrição |
|---------|-----------|
| `pnpm init` | Inicializa projeto. |
| `pnpm install` | Instala dependências. |
| `pnpm add <pacote>` | Adiciona dependência. |
| `pnpm add -D <pacote>` | Adiciona devDependency. |
| `pnpm add -g <pacote>` | Instala globalmente. |
| `pnpm remove <pacote>` | Remove pacote. |
| `pnpm <script>` | Executa script. |
| `pnpm store prune` | Limpa store global. |

### 6.7 Workspaces e Monorepos

| Termo | Descrição |
|-------|-----------|
| **Workspaces** | Permite gerenciar múltiplos pacotes em um único repositório. Suportado por npm, Yarn e PNPM. |
| **Monorepo** | Repositório único contendo múltiplos projetos/pacotes relacionados. |
| **pnpm-workspace.yaml** | Configuração de workspaces no PNPM. |
| **Hoisting** | Elevação de dependências para nível superior para dedupliação. |

### 6.8 Comparação de Package Managers (2026)

| Característica | NPM | Yarn | PNPM |
|---------------|-----|------|------|
| **Velocidade** | Mais lento | Rápido | Mais rápido |
| **Uso de disco** | Alto | Médio | Muito eficiente (hard links) |
| **Monorepos** | Básico | Excelente | Excelente |
| **Segurança** | Bom | Muito bom | Muito bom |
| **Recomendação** | Iniciantes, compatibilidade máxima | Equipes grandes, PnP | Projetos grandes, CI/CD, monorepos |

---

## 7. Ambiente e Configuração

### 7.1 Variáveis de Ambiente

| Termo | Descrição |
|-------|-----------|
| **Variável de Ambiente** | Par chave-valor disponível para processos do sistema. |
| **PATH** | Variável que define diretórios onde o shell busca executáveis. |
| **export** | Comando para definir variável de ambiente (bash/zsh). |
| **env** | Exibe todas as variáveis de ambiente. |
| **printenv** | Exibe variável específica ou todas. |
| **$HOME** | Diretório home do usuário. |
| **$USER** | Nome do usuário atual. |
| **$PWD** | Diretório atual. |
| **$SHELL** | Shell padrão do usuário. |

### 7.2 Arquivos de Configuração do Shell (Dotfiles)

| Arquivo | Descrição |
|---------|-----------|
| **~/.bashrc** | Configuração do Bash para shells interativos não-login. Executado a cada nova janela de terminal. |
| **~/.bash_profile** | Configuração do Bash para shells de login. Executado uma vez ao fazer login. |
| **~/.profile** | Configuração genérica de shell (POSIX). |
| **~/.zshrc** | Configuração do Zsh para shells interativos. Principal arquivo para customização. |
| **~/.zshenv** | Configuração do Zsh executada para todos os shells (login e não-login). |
| **~/.zprofile** | Equivalente ao .bash_profile para Zsh. |
| **Dotfiles** | Arquivos de configuração que começam com ponto. Geralmente versionados em repositório Git para backup e sincronização. |
| **Aliases** | Atalhos para comandos. Definidos com `alias nome='comando'`. |
| **source** | Comando para recarregar arquivo de configuração. Ex: `source ~/.zshrc`. |

### 7.3 Gerenciadores de Versão do Node.js

| Ferramenta | Descrição |
|------------|-----------|
| **nvm (Node Version Manager)** | Mais popular, flexível, mas mais lento. Pode adicionar 2-3 segundos ao startup do terminal. |
| **fnm (Fast Node Manager)** | Escrito em Rust, até 40x mais rápido que nvm. Cross-platform, sintaxe familiar. |
| **Volta** | Gerencia todo toolchain JavaScript (Node, npm, Yarn). Automático por projeto via package.json. Ideal para equipes. |
| **asdf** | Gerenciador universal de versões (Node, Python, Ruby, etc.). |
| **.nvmrc** | Arquivo que especifica versão do Node para o projeto. |
| **.node-version** | Alternativa ao .nvmrc suportada por vários gerenciadores. |

---

## 8. Ferramentas CLI Úteis

### 8.1 Rede e Downloads

| Comando | Descrição |
|---------|-----------|
| `curl` | Ferramenta para transferir dados via URLs. Testa APIs, faz downloads. Ex: `curl -X GET https://api.example.com`. |
| `wget` | Utilitário para download de arquivos da web. |
| `ssh` | Secure Shell - conexão segura a servidores remotos. Ex: `ssh user@server.com`. |
| `scp` | Cópia segura de arquivos entre máquinas via SSH. |
| `rsync` | Sincronização eficiente de arquivos. |
| `ping` | Testa conectividade de rede. |
| `traceroute` | Mostra rota até um host. |
| `netstat` | Estatísticas de rede e conexões. |
| `nslookup` / `dig` | Consulta DNS. |

### 8.2 Compressão e Arquivos

| Comando | Descrição |
|---------|-----------|
| `tar` | Agrupa múltiplos arquivos em um. `tar -cvf arquivo.tar dir/` cria, `tar -xvf arquivo.tar` extrai. |
| `tar -czvf` | Cria arquivo .tar.gz (comprimido com gzip). |
| `tar -xzvf` | Extrai arquivo .tar.gz. |
| `zip` | Cria arquivos ZIP. |
| `unzip` | Extrai arquivos ZIP. |
| `gzip` / `gunzip` | Comprime/descomprime arquivos .gz. |

### 8.3 Permissões (Unix/Linux/macOS)

| Comando | Descrição |
|---------|-----------|
| `chmod` | Modifica permissões de arquivos. Ex: `chmod +x script.sh` (adiciona execução). |
| `chmod 755` | Permissões: rwxr-xr-x. |
| `chown` | Modifica proprietário de arquivo. Ex: `chown user:group arquivo`. |
| `sudo` | Executa comando como superusuário. |

### 8.4 Ferramentas de Produtividade

| Ferramenta | Descrição |
|------------|-----------|
| **Oh My Zsh** | Framework para configuração do Zsh com plugins, temas e auto-sugestões. |
| **tmux** | Multiplexador de terminal - múltiplas sessões, painéis, attach/detach. |
| **screen** | Similar ao tmux, mais antigo. |
| **fzf** | Fuzzy finder - busca interativa ultra-rápida. |
| **ripgrep (rg)** | Grep moderno, extremamente rápido. |
| **bat** | Cat com syntax highlighting. |
| **exa/eza** | ls moderno com cores e ícones. |
| **htop** | Monitor de processos interativo e colorido. |
| **jq** | Processador JSON de linha de comando. |
| **tldr** | Man pages simplificadas com exemplos práticos. |
| **autojump** | Navegação inteligente baseada em histórico. |
| **z** | Similar ao autojump, navega para diretórios frequentes. |
| **diff-so-fancy** | Melhora visualização de `git diff`. |
| **lazygit** | Interface TUI para Git. |
| **gh (GitHub CLI)** | CLI oficial do GitHub para PRs, issues, repos. |

---

## 9. Gerenciamento de Processos

### 9.1 Controle de Processos

| Atalho/Comando | Descrição |
|----------------|-----------|
| `Ctrl+C` | Interrompe (mata) processo em execução no foreground (SIGINT). |
| `Ctrl+Z` | Suspende processo atual (SIGTSTP). Processo fica parado em background. |
| `Ctrl+D` | Envia EOF (End Of File). Fecha shell se linha vazia. |
| `&` | Executa comando em background. Ex: `comando &`. |

### 9.2 Jobs e Background

| Comando | Descrição |
|---------|-----------|
| `jobs` | Lista jobs (processos) iniciados pelo shell atual. |
| `bg` | Continua job suspenso em background. `bg %1` para job específico. |
| `fg` | Traz job para foreground. `fg %1` para job específico. |
| `%n` | Referência ao job número n. |
| `disown` | Remove job da lista de jobs (continua executando após fechar terminal). |
| `nohup` | Executa comando imune a hangups. Continua após logout. |

### 9.3 Visualização e Término de Processos

| Comando | Descrição |
|---------|-----------|
| `ps` | Lista processos. `ps aux` mostra todos os processos detalhados. |
| `top` | Monitor de processos em tempo real. |
| `htop` | Versão melhorada do top com interface interativa. |
| `kill <PID>` | Envia sinal para processo (padrão: SIGTERM). |
| `kill -9 <PID>` | Força término imediato (SIGKILL). |
| `killall <nome>` | Mata todos os processos com determinado nome. |
| `pkill <padrão>` | Mata processos por nome/padrão. |
| `pgrep <padrão>` | Lista PIDs de processos por nome/padrão. |

### 9.4 Sinais Comuns

| Sinal | Número | Descrição |
|-------|--------|-----------|
| SIGTERM | 15 | Término gracioso (padrão do kill). |
| SIGKILL | 9 | Término forçado (não pode ser ignorado). |
| SIGINT | 2 | Interrupção (Ctrl+C). |
| SIGTSTP | 20 | Suspensão (Ctrl+Z). |
| SIGHUP | 1 | Hangup (terminal fechado). |
| SIGCONT | 18 | Continua processo suspenso. |

---

## 10. Resumo de Atalhos de Teclado Essenciais

| Atalho | Descrição |
|--------|-----------|
| `Ctrl+C` | Cancela/interrompe comando atual. |
| `Ctrl+Z` | Suspende processo atual. |
| `Ctrl+D` | Fecha shell/envia EOF. |
| `Ctrl+L` | Limpa tela (igual a `clear`). |
| `Ctrl+A` | Move cursor para início da linha. |
| `Ctrl+E` | Move cursor para fim da linha. |
| `Ctrl+U` | Apaga do cursor até início da linha. |
| `Ctrl+K` | Apaga do cursor até fim da linha. |
| `Ctrl+W` | Apaga palavra anterior. |
| `Ctrl+R` | Busca reversa no histórico. |
| `Tab` | Auto-completar comando/arquivo. |
| `Tab Tab` | Mostra opções de auto-completar. |
| `↑` / `↓` | Navega histórico de comandos. |
| `!!` | Repete último comando. |
| `!$` | Último argumento do comando anterior. |
| `!n` | Executa comando número n do histórico. |

---

## Fontes de Pesquisa

- [MDN Web Docs - Command line crash course](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Environment_setup/Command_line)
- [The Front-End Developer's Guide to the Terminal - Josh W. Comeau](https://www.joshwcomeau.com/javascript/terminal-for-js-devs/)
- [GitHub Blog - Top 12 Git commands](https://github.blog/developer-skills/github/top-12-git-commands-every-developer-must-know/)
- [Git Official Documentation](https://git-scm.com/docs)
- [Atlassian Git Tutorial](https://www.atlassian.com/git/tutorials)
- [npm Documentation - Semantic Versioning](https://docs.npmjs.com/about-semantic-versioning/)
- [Semantic Versioning 2.0.0](https://semver.org/)
- [NPM vs Yarn vs PNPM 2026](https://nareshit.com/blogs/npm-vs-yarn-vs-pnpm-package-manager-2026)
- [Trunk-Based Development vs GitFlow - Atlassian](https://www.atlassian.com/continuous-delivery/continuous-integration/trunk-based-development)
- [Gitflow Workflow - Atlassian](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)
- [Pre-commit Framework](https://pre-commit.com/)
- [Git Hooks - Git Documentation](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)
- [Bash vs Zsh - LogRocket](https://blog.logrocket.com/bash-vs-zsh/)
- [PowerShell vs Bash - TechTarget](https://www.techtarget.com/searchitoperations/tip/On-Windows-PowerShell-vs-Bash-comparison-gets-interesting)
- [NVM Alternatives Guide - Better Stack](https://betterstack.com/community/guides/scaling-nodejs/nvm-alternatives-guide/)
- [Linux Process Management Commands](https://www.redhat.com/en/blog/jobs-bg-fg)
- [Input/Output Redirection - Thoughtbot](https://thoughtbot.com/blog/input-output-redirection-in-the-shell)
- [STDIN, STDOUT, STDERR - DevDungeon](https://www.devdungeon.com/content/stdin-stdout-stderr-piping-and-redirecting)

---

**Relatório compilado por The Veritas**
**Data: 31 de Janeiro de 2026**
**Versão: 1.0**
