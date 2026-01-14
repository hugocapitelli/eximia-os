# Protocolo de Sincronização Híbrida (Unified Cloud)

Para garantir que o **ExímIA.OS** funcione em múltiplos dispositivos de forma transparente e "Zero-OneDrive" (para sistema), adotamos a arquitetura **Unified Cloud**.

## 1. Arquitetura

| Componente | Ferramenta | Provedor | Função |
|:---|:---|:---|:---|
| **Código Fonte** | Git | GitHub | Lógica, Scripts, Docs |
| **Metadata** | Postgres | **Supabase** | Dados relacionais, Tags |
| **Memória (IA)** | pgvector | **Supabase** | Embeddings, Contexto |
| **Arquivos** | Storage (S3) | **Supabase** | PDFs, Imagens do Codex |
| **Cache/Filas** | Redis | Upstash/Redis Cloud | Memória Curta, Jobs |

> [!TIP]
> **Supabase** é o centro da persistência. Uma única configuração resolve Banco, Vetor e Arquivos.

## 2. Setup em Nova Máquina ("Hydration")

Ao chegar em um novo computador, siga rigorosamente o [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md).

Resumo do processo:

1.  **Clonar Repositório**:
    ```bash
    git clone <seu-repo-url> eximia_os
    ```

2.  **Configurar Credenciais (`.env`)**:
    ```env
    # Supabase (Banco + Vector)
    VECTOR_DB_URL=postgresql://user:pass@db.supabase.co:5432/postgres
    
    # Supabase Storage (Arquivos)
    STORAGE_ENDPOINT=https://<project-id>.supabase.co/storage/v1/s3
    STORAGE_ACCESS_KEY=<sua-access-key>
    STORAGE_SECRET_KEY=<sua-secret-key>
    STORAGE_BUCKET=codex-files
    
    # Redis (Opcional - Cache)
    REDIS_URL=rediss://default:pass@...
    ```

3.  **Rodar Script de Hidratação**:
    Execute o script de automação:
    ```powershell
    ./setup_device.ps1
    ```
    Isso vai instalar dependências (incluindo `boto3` para storage) e validar as conexões.
    
    > [!WARNING]
    > Certifique-se de ter **Python 3.10+**, **Node.js** e **Git** instalados antes de rodar o setup.

## 2.1 Migração Manual (Cópia de Arquivos)

Se preferir copiar os arquivos manualmente (Pen Drive/Rede) ao invés de clonar o Git:

1.  **Copie a pasta Raiz**, EXCETO as seguintes carpetas (que são específicas de cada máquina):
    *   `node_modules` (em qualquer lugar)
    *   `.venv`, `venv` ou `env`
    *   `__pycache__`
    *   `.git` (opcional, se não for usar versionamento no novo PC)

2.  **Transfira o arquivo `.env`**:
    *   Certifique-se de copiar seu `.env` com chaves para a raiz do novo PC.

3.  **Execute a Hidratação**:
    *   Abra o terminal na pasta copiada e rode: `./setup_device.ps1`
    *   Isso recriará os ambientes virtuais e baixará as dependências limpas.

## 3. Fluxo de Trabalho (Codex)

- **Upload**: Ao adicionar um PDF, o sistema envia para o Bucket na nuvem.
- **Download**: Ao acessar um PDF, o sistema baixa automaticamente se não estiver no disco.
- **Sync**: Não é necessário sincronizar pastas gigantes. O cache local é construído sob demanda.
