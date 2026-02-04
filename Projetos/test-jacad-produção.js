#!/usr/bin/env node

/**
 * 🔌 TESTE DE CONEXÃO COM API JACAD PRODUÇÃO
 *
 * Testa a integração com a API real do Jacad
 * URL: https://harven-developer.jacad.com.br
 *
 * Credenciais:
 *   Token: ba28d3c63e9b2234ec4bb3e6f920733b
 *   Client ID: e220f4b9-4b65-4714-894f-ea5e6c186334
 *   Client Secret: f4743786-4253-40b3-bc96-98f15a8301f1
 */

const https = require('https');
const http = require('http');

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

function printWarning(text) {
  log(`⚠️  ${text}`, 'yellow');
}

function printTable(headers, rows) {
  if (rows.length === 0) return;

  const colWidths = headers.map((h, i) =>
    Math.max(h.length, ...rows.map(r => String(r[i] || '').length))
  );

  // Header
  const headerStr = headers.map((h, i) => h.padEnd(colWidths[i])).join(' | ');
  log(headerStr, 'bright');
  log('-'.repeat(headerStr.length), 'bright');

  // Rows
  rows.forEach(row => {
    const rowStr = row.map((cell, i) => String(cell || '').padEnd(colWidths[i])).join(' | ');
    console.log(rowStr);
  });
}

// Credenciais fornecidas
const CREDENTIALS = {
  token: 'ba28d3c63e9b2234ec4bb3e6f920733b',
  clientId: 'e220f4b9-4b65-4714-894f-ea5e6c186334',
  clientSecret: 'f4743786-4253-40b3-bc96-98f15a8301f1'
};

class JacadTester {
  constructor(baseUrl) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.results = [];
    this.responseLog = [];
  }

  async makeRequest(path, method = 'GET', body = null) {
    return new Promise((resolve) => {
      const isHttps = this.baseUrl.startsWith('https');
      const protocol = isHttps ? https : http;

      const headers = {
        'Authorization': `Bearer ${CREDENTIALS.token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'JacadTester/1.0',
        'Accept': 'application/json'
      };

      const fullUrl = new URL(path, this.baseUrl);
      const options = {
        hostname: fullUrl.hostname,
        port: fullUrl.port,
        path: fullUrl.pathname + fullUrl.search,
        method: method,
        headers: headers,
        timeout: 10000
      };

      const req = protocol.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const parsed = data ? JSON.parse(data) : {};
            resolve({
              status: res.statusCode,
              headers: res.headers,
              data: parsed,
              raw: data,
              error: null
            });
          } catch (e) {
            resolve({
              status: res.statusCode,
              headers: res.headers,
              data: null,
              raw: data,
              error: 'Parse error: ' + e.message
            });
          }
        });
      });

      req.on('error', (e) => {
        resolve({
          status: null,
          headers: null,
          data: null,
          raw: null,
          error: e.message
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({
          status: null,
          headers: null,
          data: null,
          raw: null,
          error: 'Request timeout (10s)'
        });
      });

      if (body) {
        req.write(JSON.stringify(body));
      }

      req.end();
    });
  }

  logResponse(path, response) {
    this.responseLog.push({
      path,
      status: response.status,
      error: response.error,
      time: new Date().toLocaleTimeString('pt-BR')
    });
  }

  async test1_Health() {
    printSection('TESTE 1: Health Check');
    printInfo(`URL: ${this.baseUrl}`);

    const endpoints = ['/health', '/api/health', '/api/v1/health'];

    for (const endpoint of endpoints) {
      const result = await this.makeRequest(endpoint);
      this.logResponse(endpoint, result);

      if (result.error) {
        log(`  ${endpoint}: ${result.error}`, 'yellow');
      } else if (result.status === 200) {
        printSuccess(`${endpoint}: OK (200)`);
        if (result.data && Object.keys(result.data).length > 0) {
          log(JSON.stringify(result.data, null, 2), 'cyan');
        }
        this.addResult('Health Check', 'PASSOU ✓');
        return true;
      } else {
        log(`  ${endpoint}: ${result.status}`, 'cyan');
      }
    }

    this.addResult('Health Check', 'FALHOU ✗');
    return false;
  }

  async test2_Auth() {
    printSection('TESTE 2: Autenticação');
    printInfo(`Token: ${CREDENTIALS.token.substring(0, 8)}...${CREDENTIALS.token.substring(-8)}`);

    const endpoints = ['/auth/me', '/api/auth/me', '/api/v1/auth/me', '/me'];

    for (const endpoint of endpoints) {
      const result = await this.makeRequest(endpoint);
      this.logResponse(endpoint, result);

      if (result.status === 200) {
        printSuccess(`Autenticação válida em ${endpoint}`);
        if (result.data) {
          log(JSON.stringify(result.data, null, 2), 'green');
        }
        this.addResult('Autenticação', 'PASSOU ✓');
        return true;
      } else if (result.status === 401) {
        printError(`Autenticação inválida (401) - Token expirado ou incorreto`);
      } else if (!result.error) {
        log(`  ${endpoint}: ${result.status}`, 'cyan');
      }
    }

    this.addResult('Autenticação', 'FALHOU ✗ (401 Unauthorized)');
    return false;
  }

  async test3_Students() {
    printSection('TESTE 3: Buscar Alunos');

    const endpoints = [
      '/students',
      '/api/students',
      '/api/v1/students',
      '/students?limit=10',
      '/api/v1/students?limit=10'
    ];

    for (const endpoint of endpoints) {
      const result = await this.makeRequest(endpoint);
      this.logResponse(endpoint, result);

      if (result.status === 200) {
        printSuccess(`Alunos encontrados em ${endpoint}`);

        if (Array.isArray(result.data)) {
          log(`Total: ${result.data.length} aluno(s)`, 'green');
          if (result.data.length > 0) {
            log(`Primeiro aluno:`, 'cyan');
            log(JSON.stringify(result.data[0], null, 2), 'cyan');
          }
        } else if (result.data.students && Array.isArray(result.data.students)) {
          log(`Total: ${result.data.students.length} aluno(s)`, 'green');
          if (result.data.students.length > 0) {
            log(`Primeiro aluno:`, 'cyan');
            log(JSON.stringify(result.data.students[0], null, 2), 'cyan');
          }
        }

        this.addResult('Listar Alunos', 'PASSOU ✓');
        return true;
      } else if (result.status === 401) {
        log(`  ${endpoint}: Sem autorização (401)`, 'yellow');
      }
    }

    this.addResult('Listar Alunos', 'NÃO ENCONTRADO ⊘');
    return false;
  }

  async test4_Disciplines() {
    printSection('TESTE 4: Buscar Disciplinas');

    const endpoints = [
      '/disciplines',
      '/api/disciplines',
      '/api/v1/disciplines',
      '/courses',
      '/api/courses'
    ];

    for (const endpoint of endpoints) {
      const result = await this.makeRequest(endpoint);
      this.logResponse(endpoint, result);

      if (result.status === 200) {
        printSuccess(`Disciplinas encontradas em ${endpoint}`);

        if (Array.isArray(result.data)) {
          log(`Total: ${result.data.length} disciplina(s)`, 'green');
          if (result.data.length > 0) {
            log(`Primeira disciplina:`, 'cyan');
            log(JSON.stringify(result.data[0], null, 2), 'cyan');
          }
        }

        this.addResult('Listar Disciplinas', 'PASSOU ✓');
        return true;
      }
    }

    this.addResult('Listar Disciplinas', 'NÃO ENCONTRADO ⊘');
    return false;
  }

  async test5_Info() {
    printSection('TESTE 5: Informações da API');

    const endpoints = ['/info', '/api/info', '/api/v1/info', '/version'];

    for (const endpoint of endpoints) {
      const result = await this.makeRequest(endpoint);
      this.logResponse(endpoint, result);

      if (result.status === 200) {
        printSuccess(`Informações da API:`);
        log(JSON.stringify(result.data, null, 2), 'cyan');
        this.addResult('Info da API', 'PASSOU ✓');
        return true;
      }
    }

    this.addResult('Info da API', 'NÃO ENCONTRADO ⊘');
    return false;
  }

  async test6_Endpoints() {
    printSection('TESTE 6: Descoberta de Endpoints');

    const endpoints = [
      '/api',
      '/api/v1',
      '/routes',
      '/api/routes',
      '/openapi.json',
      '/api/openapi.json'
    ];

    console.log();
    for (const endpoint of endpoints) {
      const result = await this.makeRequest(endpoint);
      this.logResponse(endpoint, result);

      if (result.status === 200) {
        log(`✓ ${endpoint} - respondeu com ${result.status}`, 'green');
        if (typeof result.data === 'object') {
          const keys = Object.keys(result.data).slice(0, 5);
          if (keys.length > 0) {
            log(`  Campos: ${keys.join(', ')}`, 'cyan');
          }
        }
      } else if (result.status) {
        log(`○ ${endpoint} - ${result.status}`, 'cyan');
      } else if (result.error) {
        log(`✗ ${endpoint} - ${result.error}`, 'yellow');
      }
    }

    this.addResult('Descoberta de Endpoints', 'TESTADO ⊘');
  }

  addResult(testName, result) {
    this.results.push({ testName, result });
  }

  printSummary() {
    printHeader('📊 RESUMO DOS TESTES');

    const passed = this.results.filter(r => r.result.includes('PASSOU')).length;
    const failed = this.results.filter(r => r.result.includes('FALHOU')).length;
    const other = this.results.filter(r => !r.result.includes('PASSOU') && !r.result.includes('FALHOU')).length;
    const total = this.results.length;

    console.log();
    log(`Total de testes: ${total}`, 'bright');
    log(`✅ Passou:      ${passed}`, 'green');
    log(`❌ Falhou:      ${failed}`, 'red');
    log(`⊘  Outros:      ${other}`, 'cyan');

    console.log();
    log('Detalhes:', 'bright');
    this.results.forEach(({ testName, result }) => {
      const color = result.includes('PASSOU') ? 'green' : result.includes('FALHOU') ? 'red' : 'cyan';
      log(`  ${result} - ${testName}`, color);
    });

    console.log();
    log('Log de Requisições:', 'bright');
    printTable(['Endpoint', 'Status', 'Erro', 'Hora'],
      this.responseLog.map(r => [r.path, r.status || '-', r.error || 'OK', r.time])
    );

    console.log();
    if (failed === 0 && passed > 0) {
      printSuccess('TESTES COMPLETADOS COM SUCESSO! 🎉');
    } else if (failed > 0) {
      printWarning(`${failed} teste(s) falharam. Verifique os endpoints.`);
    } else {
      printInfo('Testes executados. Verifique os resultados acima.');
    }

    console.log();
  }
}

async function main() {
  const baseUrl = process.argv[2] || 'https://harven-developer.jacad.com.br';

  printHeader('🔌 TESTE - API JACAD HARVEN DEVELOPER 🔌');

  printInfo(`URL: ${baseUrl}`);
  printInfo(`Data/Hora: ${new Date().toLocaleString('pt-BR')}`);
  printInfo(`Token: ${CREDENTIALS.token.substring(0, 8)}...`);

  const tester = new JacadTester(baseUrl);

  try {
    await tester.test1_Health();
    await tester.test2_Auth();
    await tester.test3_Students();
    await tester.test4_Disciplines();
    await tester.test5_Info();
    await tester.test6_Endpoints();
  } catch (error) {
    printError(`Erro durante testes: ${error.message}`);
    process.exit(1);
  }

  tester.printSummary();
}

main();
