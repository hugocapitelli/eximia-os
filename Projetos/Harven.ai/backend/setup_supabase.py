#!/usr/bin/env python3
"""
Script de Inicialização do Supabase
Cria os buckets necessários e verifica a conexão
"""

import os
import sys
from dotenv import load_dotenv
from supabase import create_client, Client

# Carregar variáveis de ambiente
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

def check_connection(supabase: Client) -> bool:
    """Verifica se a conexão com o Supabase está funcionando"""
    try:
        # Tenta fazer uma query simples
        result = supabase.table("disciplines").select("*").limit(1).execute()
        print("✅ Conexão com Supabase: OK")
        return True
    except Exception as e:
        print(f"❌ Erro ao conectar com Supabase: {e}")
        return False

def create_storage_buckets(supabase: Client) -> None:
    """Cria os buckets de storage necessários"""
    buckets_config = [
        {
            "name": "courses",
            "public": True,
            "file_size_limit": 524288000,  # 500MB
            "allowed_mime_types": [
                "application/pdf",
                "video/mp4",
                "video/quicktime",
                "application/vnd.ms-powerpoint",
                "application/vnd.openxmlformats-officedocument.presentationml.presentation"
            ]
        },
        {
            "name": "avatars",
            "public": True,
            "file_size_limit": 5242880,  # 5MB
            "allowed_mime_types": [
                "image/jpeg",
                "image/png",
                "image/gif",
                "image/webp"
            ]
        }
    ]

    print("\n📦 Configurando Storage Buckets...")

    for bucket_config in buckets_config:
        bucket_name = bucket_config["name"]

        try:
            # Verificar se bucket já existe
            existing_buckets = supabase.storage.list_buckets()
            bucket_exists = any(b.name == bucket_name for b in existing_buckets)

            if bucket_exists:
                print(f"   ℹ️  Bucket '{bucket_name}' já existe")
            else:
                # Criar bucket
                supabase.storage.create_bucket(
                    bucket_name,
                    {
                        "public": bucket_config["public"],
                        "file_size_limit": bucket_config["file_size_limit"],
                        "allowed_mime_types": bucket_config["allowed_mime_types"]
                    }
                )
                print(f"   ✅ Bucket '{bucket_name}' criado com sucesso")

        except Exception as e:
            print(f"   ⚠️  Erro ao criar bucket '{bucket_name}': {e}")

def main():
    """Função principal"""
    print("=" * 60)
    print("🚀 HARVEN.AI - Setup do Supabase")
    print("=" * 60)

    # Verificar variáveis de ambiente
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("\n❌ ERRO: Variáveis de ambiente não configuradas!")
        print("Configure SUPABASE_URL e SUPABASE_KEY no arquivo .env")
        sys.exit(1)

    print(f"\n🔗 Supabase URL: {SUPABASE_URL}")

    # Criar cliente Supabase
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        print(f"\n❌ Erro ao criar cliente Supabase: {e}")
        sys.exit(1)

    # Verificar conexão
    print("\n🔍 Verificando conexão...")
    if not check_connection(supabase):
        print("\n⚠️  AVISO: Não foi possível verificar a conexão.")
        print("Isso pode ser normal se as tabelas ainda não foram criadas.")

    # Criar buckets
    create_storage_buckets(supabase)

    print("\n" + "=" * 60)
    print("✅ Setup concluído com sucesso!")
    print("=" * 60)
    print("\n📝 Próximos passos:")
    print("   1. Acesse o Supabase Dashboard: https://supabase.com/dashboard")
    print("   2. Vá em Storage e verifique se os buckets 'courses' e 'avatars' existem")
    print("   3. Configure as políticas de acesso (RLS) se necessário")
    print("   4. Execute: python main.py (ou docker-compose up)")
    print()

if __name__ == "__main__":
    main()
