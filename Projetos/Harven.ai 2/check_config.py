#!/usr/bin/env python3
"""
Script de Verificação de Configuração
Verifica se tudo está pronto para deploy
"""

import os
import sys
from pathlib import Path

def print_header(text):
    """Imprime cabeçalho formatado"""
    print("\n" + "=" * 60)
    print(f"  {text}")
    print("=" * 60)

def print_ok(text):
    """Imprime mensagem de sucesso"""
    print(f"✅ {text}")

def print_error(text):
    """Imprime mensagem de erro"""
    print(f"❌ {text}")

def print_warning(text):
    """Imprime mensagem de aviso"""
    print(f"⚠️  {text}")

def check_file_exists(filepath, description):
    """Verifica se um arquivo existe"""
    if Path(filepath).exists():
        print_ok(f"{description}: OK")
        return True
    else:
        print_error(f"{description}: ARQUIVO NÃO ENCONTRADO")
        return False

def check_env_file():
    """Verifica configuração do arquivo .env"""
    env_path = Path("backend/.env")

    if not env_path.exists():
        print_error(".env não encontrado em backend/")
        print("   Execute: cp backend/.env.example backend/.env")
        return False

    # Ler arquivo .env
    with open(env_path, 'r', encoding='utf-8') as f:
        content = f.read()

    errors = []
    warnings = []

    # Verificar variáveis obrigatórias
    required_vars = {
        "SUPABASE_URL": "URL do Supabase",
        "SUPABASE_KEY": "Chave do Supabase",
        "OPENAI_API_KEY": "Chave da OpenAI"
    }

    for var, description in required_vars.items():
        if var not in content:
            errors.append(f"{description} ({var}) não encontrada")
        elif f"{var}=sua-chave-aqui" in content or f"{var}=seu-" in content:
            errors.append(f"{description} ainda não foi configurada (contém valor de exemplo)")
        else:
            print_ok(f"{description} configurada")

    # Verificar variáveis opcionais
    optional_vars = {
        "OPENAI_MODEL": "gpt-4o-mini",
        "ENVIRONMENT": "production",
        "PORT": "8000"
    }

    for var, default in optional_vars.items():
        if var not in content:
            warnings.append(f"{var} não encontrada (usará padrão: {default})")

    # Mostrar erros
    if errors:
        for error in errors:
            print_error(error)
        return False

    # Mostrar avisos
    if warnings:
        for warning in warnings:
            print_warning(warning)

    return True

def check_openai_key():
    """Verifica se a chave OpenAI está configurada"""
    env_path = Path("backend/.env")

    if not env_path.exists():
        return False

    with open(env_path, 'r') as f:
        content = f.read()

    # Verificar se a chave começa com sk-
    if "OPENAI_API_KEY=sk-" in content:
        print_ok("Chave OpenAI no formato correto (começa com 'sk-')")
        return True
    else:
        print_error("Chave OpenAI não está configurada ou está no formato errado")
        print("   A chave deve começar com 'sk-' ou 'sk-proj-'")
        print("   Obtenha em: https://platform.openai.com/api-keys")
        return False

def check_docker():
    """Verifica se Docker está instalado"""
    docker_installed = os.system("docker --version > nul 2>&1") == 0 if sys.platform == "win32" else os.system("docker --version > /dev/null 2>&1") == 0

    if docker_installed:
        print_ok("Docker instalado")
        return True
    else:
        print_warning("Docker não instalado (necessário apenas para deploy local)")
        print("   Instale em: https://docs.docker.com/get-docker/")
        return False

def check_agents():
    """Verifica se todos os agentes de IA estão presentes"""
    agents_dir = Path("backend/agents")

    required_agents = [
        "harven_creator.py",
        "harven_socrates.py",
        "harven_analyst.py",
        "harven_editor.py",
        "harven_tester.py",
        "harven_organizer.py"
    ]

    all_ok = True
    for agent in required_agents:
        agent_path = agents_dir / agent
        if agent_path.exists():
            print_ok(f"Agente {agent.replace('.py', '')} encontrado")
        else:
            print_error(f"Agente {agent} NÃO ENCONTRADO")
            all_ok = False

    return all_ok

def main():
    """Função principal"""
    print_header("🔍 HARVEN.AI - Verificação de Configuração")

    all_checks_passed = True

    # 1. Verificar estrutura de arquivos
    print("\n📁 Verificando estrutura de arquivos...")
    checks = [
        ("backend/.env", "Arquivo de configuração (.env)"),
        ("backend/Dockerfile", "Dockerfile do backend"),
        ("backend/requirements.txt", "Dependências Python"),
        ("backend/main.py", "API principal"),
        ("harven.ai-platform-mockup/Dockerfile", "Dockerfile do frontend"),
        ("docker-compose.prod.yml", "Docker Compose de produção"),
        ("deploy.sh", "Script de deploy (Linux/Mac)"),
        ("deploy.bat", "Script de deploy (Windows)"),
    ]

    for filepath, description in checks:
        if not check_file_exists(filepath, description):
            all_checks_passed = False

    # 2. Verificar .env
    print("\n🔐 Verificando configurações (.env)...")
    if not check_env_file():
        all_checks_passed = False

    # 3. Verificar chave OpenAI
    print("\n🤖 Verificando chave OpenAI...")
    if not check_openai_key():
        all_checks_passed = False

    # 4. Verificar agentes de IA
    print("\n🧠 Verificando agentes de IA...")
    if not check_agents():
        all_checks_passed = False

    # 5. Verificar Docker (opcional)
    print("\n🐳 Verificando Docker...")
    check_docker()  # Não falha se Docker não estiver instalado

    # Resultado final
    print_header("📊 RESULTADO DA VERIFICAÇÃO")

    if all_checks_passed:
        print("\n✅ TUDO CONFIGURADO CORRETAMENTE!")
        print("\n🚀 Próximos passos:")
        print("   1. Se OpenAI ainda não está configurado:")
        print("      - Obtenha chave em: https://platform.openai.com/api-keys")
        print("      - Adicione no backend/.env")
        print()
        print("   2. Para testar localmente:")
        print("      - Windows: deploy.bat")
        print("      - Linux/Mac: ./deploy.sh")
        print()
        print("   3. Para publicar:")
        print("      - Veja: QUICK_START.md")
        print()
        return 0
    else:
        print("\n❌ ALGUNS PROBLEMAS ENCONTRADOS")
        print("\n📝 Consulte o arquivo SETUP.md para mais informações")
        print("   Ou execute: python backend/setup_supabase.py")
        print()
        return 1

if __name__ == "__main__":
    try:
        exit_code = main()
        sys.exit(exit_code)
    except KeyboardInterrupt:
        print("\n\n⚠️  Verificação cancelada pelo usuário")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Erro durante verificação: {e}")
        sys.exit(1)
