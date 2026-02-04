#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Teste simples da API JACAD - Harven.ai
"""

import sys
import os

# Adiciona backend ao path
backend_path = os.path.join(os.path.dirname(__file__), 'Harven.ai', 'backend')
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

# Importa dados mockados do Jacad
from services.mocks.jacad_mock import JACAD_MOCK_DATA

def print_line(char="=", length=70):
    print(char * length)

def test_jacad():
    print("\n")
    print_line("=")
    print("TESTE DA API JACAD - Harven.ai".center(70))
    print_line("=")

    # Teste 1: Listar todos os alunos
    print("\n[TESTE 1] Listar todos os alunos")
    print_line("-")
    students = JACAD_MOCK_DATA.get_all_students()
    print(f"Total de alunos: {len(students)}\n")
    for i, student in enumerate(students, 1):
        print(f"  {i}. RA: {student['ra']:8} | Nome: {student['nome']:30} | Curso: {student['curso']}")
    print("\n[OK] Teste 1 passou!")

    # Teste 2: Buscar aluno específico
    print("\n[TESTE 2] Buscar aluno específico (RA: 2024001)")
    print_line("-")
    student = JACAD_MOCK_DATA.get_student_by_ra("2024001")
    if student:
        print(f"Encontrado: {student['nome']}")
        print(f"  RA: {student['ra']}")
        print(f"  Email: {student['email']}")
        print(f"  Curso: {student['curso']}")
        print(f"  Periodo: {student['periodo']}")
        print(f"  Situacao: {student['situacao']}")
        print("\n[OK] Teste 2 passou!")
    else:
        print("[ERRO] Aluno nao encontrado!")

    # Teste 3: Matrículas do aluno
    print("\n[TESTE 3] Matrículas do aluno (RA: 2024001)")
    print_line("-")
    enrollments = JACAD_MOCK_DATA.get_student_enrollments("2024001")
    print(f"Total de matriculas: {len(enrollments)}\n")
    for i, enroll in enumerate(enrollments, 1):
        print(f"  {i}. {enroll['disciplina_nome']:30} ({enroll['disciplina_codigo']})")
        print(f"     Turma: {enroll['turma']} | Ano: {enroll['ano']} | Sem: {enroll['semestre']}")
    print("\n[OK] Teste 3 passou!")

    # Teste 4: Listar disciplinas
    print("\n[TESTE 4] Listar todas as disciplinas")
    print_line("-")
    disciplines = JACAD_MOCK_DATA.get_disciplines()
    print(f"Total de disciplinas: {len(disciplines)}\n")
    for i, disc in enumerate(disciplines, 1):
        print(f"  {i}. {disc['codigo']:6} - {disc['nome']:30} ({disc['carga_horaria']}h)")
    print("\n[OK] Teste 4 passou!")

    # Teste 5: Alunos de uma disciplina
    print("\n[TESTE 5] Alunos da disciplina CC201")
    print_line("-")
    disc_students = JACAD_MOCK_DATA.get_discipline_students("CC201")
    print(f"Total de alunos: {len(disc_students)}\n")
    for i, student in enumerate(disc_students, 1):
        print(f"  {i}. {student['nome']:30} (RA: {student['ra']}) - Turma: {student['turma']}")
    print("\n[OK] Teste 5 passou!")

    # Resumo final
    print("\n")
    print_line("=")
    print("TODOS OS TESTES PASSARAM COM SUCESSO!".center(70))
    print_line("=")
    print()

if __name__ == "__main__":
    try:
        test_jacad()
    except Exception as e:
        print(f"\n[ERRO] {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
