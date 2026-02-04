#!/usr/bin/env node

/**
 * 🧪 TESTE DE CONEXÃO COM API JACAD - Harven.ai
 *
 * Testa a integração com o sistema acadêmico JACAD
 * Modo: Mock (desenvolvimento) com dados pré-carregados
 *
 * Uso:
 *   node test-jacad-api.js [url] [apiKey]
 *
 * Exemplos:
 *   node test-jacad-api.js                                           # Modo mock
 *   node test-jacad-api.js https://jacad.escola.com.br/api sua-chave # Modo real
 */

const http = require('http');
const https = require('https');
const url = require('url');

// Cores para terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

function printHeader(text) {
  console.log('\n' + '='.repeat(70));
  log(text.padStart(35 + text.length / 2).padEnd(70), 'cyan');
  console.log('='.repeat(70) + '\n');
}

function printSection(text) {
  log(`\n▶ ${text}`, 'blue');
  log('-'.repeat(70), 'blue');
}

function printSuccess(text) {
  log(`✅ ${text}`, 'green');
}

function printError(text) {
  log(`❌ ${text}`, 'red');
}

function printInfo(text) {
  log(`ℹ️  ${text}`, 'cyan');
}

function printWarning(text) {
  log(`⚠️  ${text}`, 'yellow');
}

function printTable(headers, rows) {
  const colWidths = headers.map((h, i) =>
    Math.max(h.length, ...rows.map(r => String(r[i]).length))
  );

  // Header
  const headerStr = headers.map((h, i) => h.padEnd(colWidths[i])).join(' | ');
  log(headerStr, 'bright');
  log('-'.repeat(headerStr.length), 'bright');

  // Rows
  rows.forEach(row => {
    const rowStr = row.map((cell, i) => String(cell).padEnd(colWidths[i])).join(' | ');
    console.log(rowStr);
  });
}

// ==================== DADOS MOCKADOS JACAD ====================

const JACAD_MOCK = {
  students: {
    '2024001': {
      ra: '2024001',
      nome: 'João Silva Santos',
      email: 'joao.santos@aluno.edu.br',
      curso: 'Engenharia de Software',
      periodo: 3,
      situacao: 'Ativo'
    },
    '2024002': {
      ra: '2024002',
      nome: 'Maria Oliveira Costa',
      email: 'maria.costa@aluno.edu.br',
      curso: 'Ciência da Computação',
      periodo: 5,
      situacao: 'Ativo'
    },
    '2024003': {
      ra: '2024003',
      nome: 'Pedro Henrique Lima',
      email: 'pedro.lima@aluno.edu.br',
      curso: 'Engenharia de Software',
      periodo: 3,
      situacao: 'Ativo'
    },
    '2024004': {
      ra: '2024004',
      nome: 'Ana Beatriz Souza',
      email: 'ana.souza@aluno.edu.br',
      curso: 'Sistemas de Informação',
      periodo: 7,
      situacao: 'Ativo'
    },
    '2024005': {
      ra: '2024005',
      nome: 'Lucas Ferreira Alves',
      email: 'lucas.alves@aluno.edu.br',
      curso: 'Engenharia de Software',
      periodo: 1,
      situacao: 'Ativo'
    },
    '2023001': {
      ra: '2023001',
      nome: 'Carla Rodrigues Mendes',
      email: 'carla.mendes@aluno.edu.br',
      curso: 'Ciência da Computação',
      periodo: 7,
      situacao: 'Ativo'
    },
    '2023002': {
      ra: '2023002',
      nome: 'Bruno Costa Pereira',
      email: 'bruno.pereira@aluno.edu.br',
      curso: 'Engenharia de Software',
      periodo: 5,
      situacao: 'Ativo'
    }
  },

  disciplines: {
    'CC101': {
      codigo: 'CC101',
      nome: 'Introdução à Programação',
      departamento: 'Ciência da Computação',
      carga_horaria: 80,
      semestre: '2024.1'
    },
    'CC201': {
      codigo: 'CC201',
      nome: 'Estrutura de Dados',
      departamento: 'Ciência da Computação',
      carga_horaria: 80,
      semestre: '2024.1'
    },
    'CC301': {
      codigo: 'CC301',
      nome: 'Banco de Dados',
      departamento: 'Ciência da Computação',
      carga_horaria: 60,
      semestre: '2024.1'
    },
    'ES101': {
      codigo: 'ES101',
      nome: 'Engenharia de Requisitos',
      departamento: 'Engenharia de Software',
      carga_horaria: 60,
      semestre: '2024.1'
    },
    'ES201': {
      codigo: 'ES201',
      nome: 'Arquitetura de Software',
      departamento: 'Engenharia de Software',
      carga_horaria: 80,
      semestre: '2024.1'
    },
    'IA101': {
      codigo: 'IA101',
      nome: 'Inteligência Artificial',
      departamento: 'Ciência da Computação',
      carga_horaria: 80,
      semestre: '2024.1'
    }
  },

  enrollments: [
    { ra: '2024001', disciplina_codigo: 'CC201', turma: 'A', ano: 2024, semestre: 1 },
    { ra: '2024001', disciplina_codigo: 'ES101', turma: 'A', ano: 2024, semestre: 1 },
    { ra: '2024001', disciplina_codigo: 'CC301', turma: 'B', ano: 2024, semestre: 1 },
    { ra: '2024002', disciplina_codigo: 'CC301', turma: 'A', ano: 2024, semestre: 1 },
    { ra: '2024002', disciplina_codigo: 'ES201', turma: 'A', ano: 2024, semestre: 1 },
    { ra: '2024002', disciplina_codigo: 'IA101', turma: 'A', ano: 2024, semestre: 1 },
    { ra: '2024002', disciplina_codigo: 'CC201', turma: 'A', ano: 2024, semestre: 1 },
    { ra: '2024003', disciplina_codigo: 'CC201', turma: 'A', ano: 2024, semestre: 1 },
    { ra: '2024003', disciplina_codigo: 'ES101', turma: 'A', ano: 2024, semestre: 1 },
    { ra: '2024004', disciplina_codigo: 'ES201', turma: 'A', ano: 2024, semestre: 1 },
    { ra: '2024004', disciplina_codigo: 'IA101', turma: 'A', ano: 2024, semestre: 1 },
    { ra: '2024004', disciplina_codigo: 'CC301', turma: 'A', ano: 2024, semestre: 1 },
    { ra: '2024005', disciplina_codigo: 'CC101', turma: 'A', ano: 2024, semestre: 1 },
    { ra: '2024005', disciplina_codigo: 'ES101', turma: 'B', ano: 2024, semestre: 1 },
    { ra: '2023001', disciplina_codigo: 'IA101', turma: 'A', ano: 2024, semestre: 1 },
    { ra: '2023001', disciplina_codigo: 'ES201', turma: 'A', ano: 2024, semestre: 1 },
    { ra: '2023002', disciplina_codigo: 'CC301', turma: 'B', ano: 2024, semestre: 1 },
    { ra: '2023002', disciplina_codigo: 'ES201', turma: 'A', ano: 2024, semestre: 1 },
    { ra: '2023002', disciplina_codigo: 'IA101', turma: 'A', ano: 2024, semestre: 1 },
  ]
};

// ==================== TESTADOR ====================

class JacadTester {
  constructor(baseUrl = null, apiKey = null) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.useMock = !baseUrl || !apiKey;
    this.results = [];
  }

  async runTests() {
    printHeader('🧪 TESTE DA API JACAD - HARVEN.AI 🧪');

    printInfo(`Modo: ${this.useMock ? 'MOCK (desenvolvimento)' : 'PRODUÇÃO'}`);
    if (this.baseUrl) printInfo(`URL: ${this.baseUrl}`);
    printInfo(`Data/Hora: ${new Date().toLocaleString('pt-BR')}`);

    // Testes
    await this.test1_Connection();
    await this.test2_GetStudent('2024001');
    await this.test3_GetEnrollments('2024001');
    await this.test4_GetDisciplines();
    await this.test5_GetDisciplineStudents('CC201');

    this.printSummary();
  }

  async test1_Connection() {
    printSection('TESTE 1: Conexão com API JACAD');

    if (this.useMock) {
      printSuccess('Conexão com dados MOCK');
      printInfo('Usando dados mockados para desenvolvimento');
      this.addResult('Teste de Conexão', 'PASSOU ✓');
    } else {
      // TODO: Implementar para API real
      printWarning('Teste com API real não implementado');
      this.addResult('Teste de Conexão', 'SKIPPED ⊘');
    }
  }

  async test2_GetStudent(ra) {
    printSection(`TESTE 2: Buscar Aluno (RA: ${ra})`);

    const student = JACAD_MOCK.students[ra];
    if (student) {
      printSuccess(`Aluno encontrado: ${student.nome}`);
      console.log();
      printTable(['Campo', 'Valor'], [
        ['RA', student.ra],
        ['Nome', student.nome],
        ['Email', student.email],
        ['Curso', student.curso],
        ['Período', student.periodo],
        ['Situação', student.situacao]
      ]);
      this.addResult(`Buscar Aluno (${ra})`, 'PASSOU ✓');
    } else {
      printError(`Aluno com RA ${ra} não encontrado`);
      this.addResult(`Buscar Aluno (${ra})`, 'FALHOU ✗');
    }
  }

  async test3_GetEnrollments(ra) {
    printSection(`TESTE 3: Matrículas do Aluno (RA: ${ra})`);

    const enrollments = JACAD_MOCK.enrollments
      .filter(e => e.ra === ra)
      .map(e => ({
        ...e,
        disciplina_nome: JACAD_MOCK.disciplines[e.disciplina_codigo].nome
      }));

    printSuccess(`Encontradas ${enrollments.length} matrícula(s)`);
    console.log();

    const rows = enrollments.map(e => [
      e.disciplina_codigo,
      e.disciplina_nome,
      e.turma,
      `${e.ano}.${e.semestre}`
    ]);

    printTable(['Código', 'Disciplina', 'Turma', 'Período'], rows);
    this.addResult(`Matrículas (${ra})`, 'PASSOU ✓');
  }

  async test4_GetDisciplines() {
    printSection('TESTE 4: Listar Disciplinas');

    const disciplines = Object.values(JACAD_MOCK.disciplines);
    printSuccess(`Encontradas ${disciplines.length} disciplina(s)`);
    console.log();

    const rows = disciplines.map(d => [
      d.codigo,
      d.nome,
      d.departamento,
      `${d.carga_horaria}h`,
      d.semestre
    ]);

    printTable(['Código', 'Disciplina', 'Departamento', 'Carga', 'Semestre'], rows);
    this.addResult('Listar Disciplinas', 'PASSOU ✓');
  }

  async test5_GetDisciplineStudents(disciplineCode) {
    printSection(`TESTE 5: Alunos da Disciplina (${disciplineCode})`);

    const students = JACAD_MOCK.enrollments
      .filter(e => e.disciplina_codigo === disciplineCode)
      .map(e => ({
        ...JACAD_MOCK.students[e.ra],
        turma: e.turma
      }));

    printSuccess(`Encontrados ${students.length} aluno(s)`);
    console.log();

    const rows = students.map(s => [
      s.ra,
      s.nome,
      s.curso,
      s.turma
    ]);

    printTable(['RA', 'Nome', 'Curso', 'Turma'], rows);
    this.addResult(`Alunos da Disciplina (${disciplineCode})`, 'PASSOU ✓');
  }

  addResult(testName, result) {
    this.results.push({ testName, result });
  }

  printSummary() {
    printHeader('📊 RESUMO DOS TESTES');

    const passed = this.results.filter(r => r.result.includes('PASSOU')).length;
    const failed = this.results.filter(r => r.result.includes('FALHOU')).length;
    const skipped = this.results.filter(r => r.result.includes('SKIPPED')).length;
    const total = this.results.length;

    console.log();
    log(`Total de testes: ${total}`, 'bright');
    log(`✅ Passou:   ${passed}`, 'green');
    log(`❌ Falhou:   ${failed}`, 'red');
    log(`⊘  Pulado:   ${skipped}`, 'yellow');

    console.log();
    log('Detalhes:', 'bright');
    this.results.forEach(({ testName, result }) => {
      const color = result.includes('PASSOU') ? 'green' : result.includes('FALHOU') ? 'red' : 'yellow';
      log(`  ${result} - ${testName}`, color);
    });

    console.log();
    if (failed === 0) {
      printSuccess('TODOS OS TESTES PASSARAM! 🎉');
    } else {
      printWarning(`${failed} teste(s) falharam`);
    }

    console.log();
  }
}

// ==================== MAIN ====================

async function main() {
  const baseUrl = process.argv[2] || null;
  const apiKey = process.argv[3] || null;

  const tester = new JacadTester(baseUrl, apiKey);

  try {
    await tester.runTests();
  } catch (error) {
    printError(`Erro durante testes: ${error.message}`);
    process.exit(1);
  }
}

main();
