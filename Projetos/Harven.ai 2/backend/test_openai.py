#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de Teste Rápido - Conexão OpenAI
Verifica se a chave OpenAI está funcionando
"""

import os
import sys
from dotenv import load_dotenv

# Carregar .env
load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

print("=" * 60)
print("  HARVEN.AI - Teste de Conexao OpenAI")
print("=" * 60)

# Verificar se a chave existe
if not OPENAI_API_KEY:
    print("\n[ERRO] OPENAI_API_KEY nao encontrada no .env")
    sys.exit(1)

# Verificar formato da chave
if not OPENAI_API_KEY.startswith("sk-"):
    print("\n[ERRO] Chave OpenAI invalida (nao comeca com 'sk-')")
    print(f"   Chave atual: {OPENAI_API_KEY[:10]}...")
    sys.exit(1)

print(f"\n[OK] Chave OpenAI encontrada: {OPENAI_API_KEY[:15]}...")

# Testar conexão
print("\n[INFO] Testando conexao com OpenAI...")

try:
    from openai import OpenAI

    client = OpenAI(api_key=OPENAI_API_KEY)

    # Fazer uma chamada simples
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": "Responda apenas: OK"}
        ],
        max_tokens=10
    )

    resposta = response.choices[0].message.content

    print("[OK] Conexao com OpenAI: SUCESSO")
    print(f"   Resposta do modelo: {resposta}")
    print(f"   Modelo: {response.model}")
    print(f"   Tokens usados: {response.usage.total_tokens}")

    print("\n" + "=" * 60)
    print("[SUCESSO] OpenAI esta funcionando perfeitamente!")
    print("=" * 60)
    print("\n[PROXIMO PASSO] Execute deploy.bat para iniciar a plataforma")

except ImportError:
    print("\n[ERRO] Biblioteca 'openai' nao instalada")
    print("   Execute: pip install -r requirements.txt")
    sys.exit(1)

except Exception as e:
    print(f"\n[ERRO] ao conectar com OpenAI: {e}")
    print("\n[INFO] Possiveis causas:")
    print("   1. Chave OpenAI invalida ou revogada")
    print("   2. Sem creditos na conta OpenAI")
    print("   3. Problema de conexao com internet")
    print("\n   Verifique em: https://platform.openai.com/account/api-keys")
    sys.exit(1)
