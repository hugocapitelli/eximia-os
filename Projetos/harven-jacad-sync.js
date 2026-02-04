#!/usr/bin/env node

/**
 * 📚 SINCRONIZADOR HARVEN.AI ↔ JACAD
 *
 * Puxar alunos e cursos da API do JACAD e salvar no Harven.ai
 *
 * Uso:
 *   node harven-jacad-sync.js --token seu-token-aqui
 *   node harven-jacad-sync.js --students    (listar alunos)
 *   node harven-jacad-sync.js --courses     (listar cursos)
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

function printHeader(text) {
  console.log('\n' + '='.repeat(70));
  log(text.padStart(35 + text.length / 2).padEnd(70), 'magenta');
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

class JacadSync {
  constructor(token) {
    this.baseUrl = 'https://harven-developer.jacad.com.br';
    this.token = token;
  }

  async makeRequest(path, method = 'GET') {
    return new Promise((resolve) => {
      const fullUrl = new URL(path, this.baseUrl);
      const headers = {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      const options = {
        hostname: fullUrl.hostname,
        port: fullUrl.port,
        path: fullUrl.pathname + fullUrl.search,
        method: method,
        headers: headers,
        timeout: 15000
      };

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            resolve({
              status: res.statusCode,
              data: JSON.parse(data),
              error: null
            });
          } catch (e) {
            resolve({
              status: res.statusCode,
              data: null,
              error: 'Parse error: ' + e.message,
              raw: data
            });
          }
        });
      });

      req.on('error', (e) => {
        resolve({
          status: null,
          data: null,
          error: e.message
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({
          status: null,
          data: null,
          error: 'Request timeout'
        });
      });

      req.end();
    });
  }

  async getStudents() {
    printSection('Buscando Alunos do JACAD');
    printInfo('Testando múltiplos endpoints...');

    const endpoints = [
      '/api/v1/students',
      '/api/v1/alunos',
      '/api/v1/users?role=student',
      '/api/students',
      '/students'
    ];

    for (const endpoint of endpoints) {
      log(`\n  Testando: ${endpoint}...`, 'cyan');
      const result = await this.makeRequest(endpoint);

      if (result.error) {
        log(`    Erro: ${result.error}`, 'red');
        continue;
      }

      if (result.status === 200) {
        printSuccess(`Alunos encontrados em ${endpoint}`);

        // Normalizar resposta
        let students = [];
        if (Array.isArray(result.data)) {
          students = result.data;
        } else if (result.data.students && Array.isArray(result.data.students)) {
          students = result.data.students;
        } else if (result.data.data && Array.isArray(result.data.data)) {
          students = result.data.data;
        } else if (result.data.content && Array.isArray(result.data.content)) {
          students = result.data.content;
        }

        if (students.length > 0) {
          log(`\nTotal: ${students.length} aluno(s)\n`, 'green');

          // Mostrar primeiros 5
          students.slice(0, 5).forEach((student, i) => {
            log(`  ${i + 1}. ${this.formatStudent(student)}`, 'cyan');
          });

          if (students.length > 5) {
            log(`  ... e ${students.length - 5} mais aluno(s)`, 'cyan');
          }

          return students;
        }
      } else if (result.status === 401) {
        log(`    Não autorizado (401)`, 'yellow');
      } else if (result.status === 404) {
        log(`    Não encontrado (404)`, 'yellow');
      } else {
        log(`    Status: ${result.status}`, 'yellow');
      }
    }

    printError('Nenhum endpoint de alunos respondeu');
    return [];
  }

  async getCourses() {
    printSection('Buscando Cursos do JACAD');
    printInfo('Testando múltiplos endpoints...');

    const endpoints = [
      '/api/v1/courses',
      '/api/v1/disciplines',
      '/api/v1/disciplinas',
      '/api/courses',
      '/courses'
    ];

    for (const endpoint of endpoints) {
      log(`\n  Testando: ${endpoint}...`, 'cyan');
      const result = await this.makeRequest(endpoint);

      if (result.error) {
        log(`    Erro: ${result.error}`, 'red');
        continue;
      }

      if (result.status === 200) {
        printSuccess(`Cursos encontrados em ${endpoint}`);

        // Normalizar resposta
        let courses = [];
        if (Array.isArray(result.data)) {
          courses = result.data;
        } else if (result.data.courses && Array.isArray(result.data.courses)) {
          courses = result.data.courses;
        } else if (result.data.disciplines && Array.isArray(result.data.disciplines)) {
          courses = result.data.disciplines;
        } else if (result.data.data && Array.isArray(result.data.data)) {
          courses = result.data.data;
        } else if (result.data.content && Array.isArray(result.data.content)) {
          courses = result.data.content;
        }

        if (courses.length > 0) {
          log(`\nTotal: ${courses.length} curso(s)\n`, 'green');

          // Mostrar primeiros 5
          courses.slice(0, 5).forEach((course, i) => {
            log(`  ${i + 1}. ${this.formatCourse(course)}`, 'cyan');
          });

          if (courses.length > 5) {
            log(`  ... e ${courses.length - 5} mais curso(s)`, 'cyan');
          }

          return courses;
        }
      } else if (result.status === 401) {
        log(`    Não autorizado (401)`, 'yellow');
      } else if (result.status === 404) {
        log(`    Não encontrado (404)`, 'yellow');
      } else {
        log(`    Status: ${result.status}`, 'yellow');
      }
    }

    printError('Nenhum endpoint de cursos respondeu');
    return [];
  }

  formatStudent(student) {
    // Tenta extrair informações comuns
    const id = student.id || student.ra || student.matricula || 'ID?';
    const name = student.name || student.nome || student.full_name || 'Nome?';
    const email = student.email || student.email_address || '';

    return `${name} (${id})${email ? ' - ' + email : ''}`;
  }

  formatCourse(course) {
    // Tenta extrair informações comuns
    const id = course.id || course.codigo || course.code || 'ID?';
    const name = course.name || course.nome || course.title || 'Nome?';
    const credits = course.credits || course.creditos || '';

    return `${name} (${id})${credits ? ' - ' + credits + ' créditos' : ''}`;
  }

  async exportToJson(students, courses) {
    printSection('Exportando Dados');

    const data = {
      exported_at: new Date().toISOString(),
      students: students,
      courses: courses,
      summary: {
        total_students: students.length,
        total_courses: courses.length
      }
    };

    const filename = `jacad-export-${Date.now()}.json`;
    const filepath = path.join(__dirname, filename);

    try {
      fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
      printSuccess(`Dados exportados para: ${filename}`);
      log(`Tamanho: ${Math.round(fs.statSync(filepath).size / 1024)}KB`, 'cyan');
    } catch (e) {
      printError(`Erro ao exportar: ${e.message}`);
    }

    return filepath;
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help') {
    log(`
Sincronizador HARVEN.AI ↔ JACAD

Uso:
  node harven-jacad-sync.js --token SEU_TOKEN_AQUI
  node harven-jacad-sync.js --students
  node harven-jacad-sync.js --courses

Exemplos:
  node harven-jacad-sync.js --token ba28d3c63e9b2234ec4bb3e6f920733b
    `, 'cyan');
    process.exit(0);
  }

  let token = null;

  // Procura por --token
  const tokenIndex = args.indexOf('--token');
  if (tokenIndex !== -1 && tokenIndex + 1 < args.length) {
    token = args[tokenIndex + 1];
  }

  // Se não encontrou no args, procura em variável de ambiente
  if (!token) {
    token = process.env.JACAD_TOKEN;
  }

  if (!token) {
    printError('Token não fornecido!');
    log(`
Use:
  node harven-jacad-sync.js --token seu-token-aqui

Ou configure variável de ambiente:
  export JACAD_TOKEN=seu-token-aqui
  node harven-jacad-sync.js
    `, 'yellow');
    process.exit(1);
  }

  printHeader('📚 SINCRONIZADOR HARVEN.AI ↔ JACAD');

  printInfo(`URL: https://harven-developer.jacad.com.br`);
  printInfo(`Token: ${token.substring(0, 8)}...${token.substring(-8)}`);
  printInfo(`Data/Hora: ${new Date().toLocaleString('pt-BR')}`);

  const sync = new JacadSync(token);

  try {
    const students = await sync.getStudents();
    const courses = await sync.getCourses();

    console.log();
    await sync.exportToJson(students, courses);

    console.log();
    printSuccess('Sincronização concluída!');

    // Resumo
    console.log();
    log('Resumo:', 'bright');
    log(`  Alunos encontrados: ${students.length}`, 'green');
    log(`  Cursos encontrados: ${courses.length}`, 'green');

  } catch (error) {
    printError(`Erro durante sincronização: ${error.message}`);
    process.exit(1);
  }
}

main();
