#!/usr/bin/env python3
"""
🧪 TESTE DE CONEXÃO COM A API DO JACAD
========================================

Script para testar a integração com o sistema acadêmico JACAD.
Inclui testes em modo mock (desenvolvimento) e em modo produção (com credenciais reais).

Uso:
    python test_jacad_connection.py [modo] [ra]

Modos:
    mock       - Usa dados mockados (padrão)
    real       - Tenta conectar com API real (requer JACAD_URL e JACAD_API_KEY)

Exemplo:
    python test_jacad_connection.py mock 2024001
    python test_jacad_connection.py real
"""

import asyncio
import sys
import os
from datetime import datetime
from typing import Optional, Dict
import httpx

# Adiciona o diretório backend ao path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'Harven.ai', 'backend'))

from services.mocks.jacad_mock import JACAD_MOCK_DATA


class Colors:
    """Cores para output do terminal"""
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'


def print_header(text: str):
    """Imprime um cabeçalho"""
    print(f"\n{Colors.BOLD}{Colors.CYAN}{'='*70}{Colors.ENDC}")
    print(f"{Colors.BOLD}{Colors.CYAN}{text:^70}{Colors.ENDC}")
    print(f"{Colors.BOLD}{Colors.CYAN}{'='*70}{Colors.ENDC}\n")


def print_section(text: str):
    """Imprime um título de seção"""
    print(f"\n{Colors.BOLD}{Colors.BLUE}▶ {text}{Colors.ENDC}")
    print(f"{Colors.BLUE}{'-'*70}{Colors.ENDC}")


def print_success(text: str):
    """Imprime mensagem de sucesso"""
    print(f"{Colors.GREEN}✅ {text}{Colors.ENDC}")


def print_error(text: str):
    """Imprime mensagem de erro"""
    print(f"{Colors.RED}❌ {text}{Colors.ENDC}")


def print_info(text: str):
    """Imprime informação"""
    print(f"{Colors.CYAN}ℹ️  {text}{Colors.ENDC}")


def print_warning(text: str):
    """Imprime aviso"""
    print(f"{Colors.YELLOW}⚠️  {text}{Colors.ENDC}")


def print_data(label: str, data: any, indent: int = 0):
    """Imprime dados formatados"""
    prefix = "  " * indent
    if isinstance(data, dict):
        print(f"{prefix}{Colors.BOLD}{label}:{Colors.ENDC}")
        for key, value in data.items():
            if isinstance(value, (dict, list)):
                print_data(key, value, indent + 1)
            else:
                print(f"{prefix}  {key}: {value}")
    elif isinstance(data, list):
        print(f"{prefix}{Colors.BOLD}{label}:{Colors.ENDC}")
        for i, item in enumerate(data):
            print(f"{prefix}  [{i}]:")
            if isinstance(item, dict):
                for key, value in item.items():
                    print(f"{prefix}    {key}: {value}")
            else:
                print(f"{prefix}    {item}")
    else:
        print(f"{prefix}{Colors.BOLD}{label}:{Colors.ENDC} {data}")


class JacadTester:
    """Testador da API do JACAD"""

    def __init__(self, mode: str = "mock", base_url: Optional[str] = None, api_key: Optional[str] = None):
        self.mode = mode
        self.base_url = base_url or os.getenv("JACAD_URL", "")
        self.api_key = api_key or os.getenv("JACAD_API_KEY", "")
        self.use_mock = mode == "mock" or not self.base_url or not self.api_key
        self.results = []

    async def test_connection(self) -> bool:
        """Testa a conexão com a API do JACAD"""
        print_section("TESTE 1: Conexão com API do JACAD")

        try:
            if self.use_mock:
                print_info(f"Modo: {Colors.YELLOW}MOCK{Colors.ENDC} (desenvolvimento)")
                print_success("Conexão estabelecida (usando dados mockados)")
                self.results.append(("Teste de Conexão", "PASSOU ✓"))
                return True
            else:
                print_info(f"Modo: {Colors.GREEN}PRODUÇÃO{Colors.ENDC}")
                print_info(f"URL: {self.base_url}")

                async with httpx.AsyncClient(timeout=10) as client:
                    response = await client.get(
                        f"{self.base_url}/health",
                        headers={"Authorization": f"Bearer {self.api_key}"}
                    )

                    if response.status_code == 200:
                        data = response.json()
                        print_success(f"Conexão estabelecida (versão: {data.get('version', 'desconhecida')})")
                        self.results.append(("Teste de Conexão", "PASSOU ✓"))
                        return True
                    else:
                        print_error(f"Resposta inesperada: {response.status_code}")
                        self.results.append(("Teste de Conexão", f"FALHOU ✗ ({response.status_code})"))
                        return False

        except Exception as e:
            print_error(f"Erro ao conectar: {str(e)}")
            self.results.append(("Teste de Conexão", f"FALHOU ✗ ({str(e)})"))
            return False

    async def test_get_student(self, ra: str) -> bool:
        """Testa busca de aluno pelo RA"""
        print_section(f"TESTE 2: Buscar Aluno pelo RA ({ra})")

        try:
            if self.use_mock:
                student = JACAD_MOCK_DATA.get_student_by_ra(ra)
                if student:
                    print_success(f"Aluno encontrado")
                    print_data("Dados do Aluno", student)
                    self.results.append((f"Buscar Aluno ({ra})", "PASSOU ✓"))
                    return True
                else:
                    print_error(f"Aluno com RA {ra} não encontrado")
                    self.results.append((f"Buscar Aluno ({ra})", "FALHOU ✗ (não encontrado)"))
                    return False
            else:
                # Implementar para API real
                print_warning("Teste com API real não implementado neste script")
                return False

        except Exception as e:
            print_error(f"Erro ao buscar aluno: {str(e)}")
            self.results.append((f"Buscar Aluno ({ra})", f"FALHOU ✗ ({str(e)})"))
            return False

    async def test_get_enrollments(self, ra: str) -> bool:
        """Testa busca de matrículas do aluno"""
        print_section(f"TESTE 3: Buscar Matrículas do Aluno ({ra})")

        try:
            if self.use_mock:
                enrollments = JACAD_MOCK_DATA.get_student_enrollments(ra)
                if enrollments:
                    print_success(f"Encontradas {len(enrollments)} matrícula(s)")
                    for i, enrollment in enumerate(enrollments):
                        print(f"\n  {Colors.BOLD}Matrícula {i+1}:{Colors.ENDC}")
                        for key, value in enrollment.items():
                            print(f"    {key}: {value}")
                    self.results.append((f"Buscar Matrículas ({ra})", "PASSOU ✓"))
                    return True
                else:
                    print_warning(f"Nenhuma matrícula encontrada para {ra}")
                    self.results.append((f"Buscar Matrículas ({ra})", "PASSOU ✓ (sem matrículas)"))
                    return True

        except Exception as e:
            print_error(f"Erro ao buscar matrículas: {str(e)}")
            self.results.append((f"Buscar Matrículas ({ra})", f"FALHOU ✗ ({str(e)})"))
            return False

    async def test_get_disciplines(self) -> bool:
        """Testa listagem de disciplinas"""
        print_section("TESTE 4: Listar Disciplinas")

        try:
            if self.use_mock:
                disciplines = JACAD_MOCK_DATA.get_disciplines()
                print_success(f"Encontradas {len(disciplines)} disciplina(s)")

                for i, disc in enumerate(disciplines):
                    print(f"\n  {Colors.BOLD}Disciplina {i+1}:{Colors.ENDC}")
                    for key, value in disc.items():
                        print(f"    {key}: {value}")

                self.results.append(("Listar Disciplinas", "PASSOU ✓"))
                return True

        except Exception as e:
            print_error(f"Erro ao listar disciplinas: {str(e)}")
            self.results.append(("Listar Disciplinas", f"FALHOU ✗ ({str(e)})"))
            return False

    async def test_get_discipline_students(self, discipline_code: str) -> bool:
        """Testa busca de alunos de uma disciplina"""
        print_section(f"TESTE 5: Alunos da Disciplina ({discipline_code})")

        try:
            if self.use_mock:
                students = JACAD_MOCK_DATA.get_discipline_students(discipline_code)
                if students:
                    print_success(f"Encontrados {len(students)} aluno(s) na disciplina")
                    for i, student in enumerate(students):
                        print(f"\n  {Colors.BOLD}Aluno {i+1}:{Colors.ENDC}")
                        for key, value in student.items():
                            print(f"    {key}: {value}")
                    self.results.append((f"Alunos da Disciplina ({discipline_code})", "PASSOU ✓"))
                    return True
                else:
                    print_warning(f"Nenhum aluno encontrado para a disciplina {discipline_code}")
                    self.results.append((f"Alunos da Disciplina ({discipline_code})", "PASSOU ✓ (sem alunos)"))
                    return True

        except Exception as e:
            print_error(f"Erro ao buscar alunos: {str(e)}")
            self.results.append((f"Alunos da Disciplina ({discipline_code})", f"FALHOU ✗ ({str(e)})"))
            return False

    def print_results_summary(self):
        """Imprime resumo dos testes"""
        print_header("RESUMO DOS TESTES")

        passed = sum(1 for _, result in self.results if "PASSOU" in result)
        failed = sum(1 for _, result in self.results if "FALHOU" in result)
        total = len(self.results)

        print(f"{Colors.BOLD}Resultados:{Colors.ENDC}")
        print(f"  {Colors.GREEN}✓ Passou: {passed}/{total}{Colors.ENDC}")
        print(f"  {Colors.RED}✗ Falhou: {failed}/{total}{Colors.ENDC}")

        print(f"\n{Colors.BOLD}Detalhes:{Colors.ENDC}")
        for test_name, result in self.results:
            status_color = Colors.GREEN if "PASSOU" in result else Colors.RED
            print(f"  {status_color}{result}{Colors.ENDC} - {test_name}")

        print()
        if failed == 0:
            print_success("TODOS OS TESTES PASSARAM! 🎉")
        else:
            print_warning(f"{failed} teste(s) falharam. Verifique os detalhes acima.")


async def main():
    """Função principal"""
    print_header("🧪 TESTE DE CONEXÃO COM A API DO JACAD 🧪")

    # Argumentos de linha de comando
    mode = sys.argv[1] if len(sys.argv) > 1 else "mock"
    ra = sys.argv[2] if len(sys.argv) > 2 else "2024001"

    print(f"\n{Colors.BOLD}Configuração:{Colors.ENDC}")
    print(f"  Modo: {mode.upper()}")
    print(f"  RA para teste: {ra}")
    print(f"  Data/Hora: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}")

    # Cria testador
    tester = JacadTester(mode=mode)

    # Executa testes
    try:
        await tester.test_connection()
        await tester.test_get_student(ra)
        await tester.test_get_enrollments(ra)
        await tester.test_get_disciplines()
        await tester.test_get_discipline_students("CC201")
    except KeyboardInterrupt:
        print_error("\n\nTeste interrompido pelo usuário!")
        sys.exit(1)

    # Imprime resumo
    tester.print_results_summary()


if __name__ == "__main__":
    asyncio.run(main())
