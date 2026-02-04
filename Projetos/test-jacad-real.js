#!/usr/bin/env node

/**
 * 🔌 TESTE DE CONEXÃO COM API JACAD REAL
 *
 * Testa a integração com a API real do Jacad usando credenciais fornecidas
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

// Credenciais fornecidas
const CREDENTIALS = {
  token: 'ba28d3c63e9b2234ec4bb3e6f920733b',
  clientId: 'e220f4b9-4b65-4714-894f-ea5e6c186334',
  clientSecret: 'f4743786-4253-40b3-bc96-98f15a8301f1'
};

// Possíveis URLs do Jacad
const POSSIBLE_URLS = [
  'https://jacad.ifsp.edu.br',
  'https://jacad.usp.br',
  'https://api.jacad.com.br',
  'https://jacad.api.com.br',
  'https://sistema.jacad.com.br',
  'http://localhost:8000', // Para testes locais
];

class JacadRealTester {
  constructor() {
    this.results = [];
    this.foundUrl = null;
  }

  async makeRequest(url, path, headers = {}) {
    return new Promise((resolve) => {
      const isHttps = url.startsWith('https');
      const protocol = isHttps ? https : http;

      const defaultHeaders = {
        'Authorization': `Bearer ${CREDENTIALS.token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'JacadTester/1.0'
      };

      const finalHeaders = { ...defaultHeaders, ...headers };

      const fullUrl = new URL(path, url);
      const options = {
        hostname: fullUrl.hostname,
        port: fullUrl.port,
        path: fullUrl.pathname + fullUrl.search,
        method: 'GET',
        headers: finalHeaders,
        timeout: 5000
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
              error: 'Parse error'
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
          error: 'Timeout'
        });
      });

      req.end();
    });
  }

  async discoverUrl() {
    printSection('DESCOBERTA: Procurando URL da API JACAD');
    printInfo('Testando URLs conhecidas...\n');

    for (const url of POSSIBLE_URLS) {
      try {
        log(`Testando: ${url}...`, 'cyan');

        // Tenta alguns endpoints comuns
        const endpoints = ['/api/health', '/health', '/api/v1/health', '/api/students'];

        for (const endpoint of endpoints) {
          const result = await this.makeRequest(url, endpoint);

          if (result.status && result.status < 500) {
            log(`  ✓ Respondeu (${result.status}) em ${endpoint}`, 'green');
            if (result.status === 200) {
              this.foundUrl = url;
              printSuccess(`URL encontrada: ${url}`);
              return url;
            }
          }
        }
      } catch (e) {
        // Continua tentando
      }
    }

    printWarning('Nenhuma URL conhecida respondeu. Verifique a URL manualmente.');
    return null;
  }

  async testConnection(baseUrl) {
    printSection('TESTE 1: Conexão com API JACAD Real');
    printInfo(`URL: ${baseUrl}`);
    printInfo(`Token: ${CREDENTIALS.token.substring(0, 8)}...`);

    const result = await this.makeRequest(baseUrl, '/api/health');

    if (result.error) {
      printError(`Erro ao conectar: ${result.error}`);
      this.addResult('Conexão', 'FALHOU ✗');
      return false;
    }

    if (result.status === 200) {
      printSuccess(`Conectado com sucesso!`);
      printInfo(`Status: ${result.status}`);
      if (result.data) {
        log(JSON.stringify(result.data, null, 2), 'cyan');
      }
      this.addResult('Conexão', 'PASSOU ✓');
      return true;
    } else if (result.status === 401) {
      printWarning(`Autenticação falhou (401 Unauthorized)`);
      printInfo('Token pode estar inválido ou expirado');
      this.addResult('Conexão', 'FALHOU ✗ (Auth)');
      return false;
    } else {
      printWarning(`Resposta inesperada: ${result.status}`);
      if (result.raw) {
        log(result.raw, 'yellow');
      }
      this.addResult('Conexão', `FALHOU ✗ (${result.status})`);
      return false;
    }
  }

  async testAuthMethods(baseUrl) {
    printSection('TESTE 2: Métodos de Autenticação');

    // Método 1: Bearer Token
    printInfo('Testando Bearer Token...');
    const authHeader = {
      'Authorization': `Bearer ${CREDENTIALS.token}`
    };

    const result1 = await this.makeRequest(baseUrl, '/api/v1/users', authHeader);
    if (result1.status === 200 || result1.status === 401) {
      printSuccess(`Bearer Token testado (${result1.status})`);
    }

    // Método 2: Client ID + Secret
    printInfo('Testando Client ID + Secret...');
    const clientAuth = Buffer.from(
      `${CREDENTIALS.clientId}:${CREDENTIALS.clientSecret}`
    ).toString('base64');

    const authHeader2 = {
      'Authorization': `Basic ${clientAuth}`
    };

    const result2 = await this.makeRequest(baseUrl, '/api/v1/users', authHeader2);
    if (result2.status === 200 || result2.status === 401) {
      printSuccess(`Client Auth testado (${result2.status})`);
    }

    this.addResult('Autenticação', 'TESTADO ⊘');
  }

  async testEndpoints(baseUrl) {
    printSection('TESTE 3: Endpoints Disponíveis');

    const endpoints = [
      { path: '/api/v1/users', name: 'Listar Usuários' },
      { path: '/api/v1/students', name: 'Listar Alunos' },
      { path: '/api/v1/disciplines', name: 'Listar Disciplinas' },
      { path: '/api/v1/enrollments', name: 'Listar Matrículas' },
      { path: '/api/health', name: 'Health Check' },
      { path: '/api/v1/health', name: 'Health V1' },
    ];

    let working = 0;
    for (const ep of endpoints) {
      const result = await this.makeRequest(baseUrl, ep.path);

      if (result.error) {
        log(`  ✗ ${ep.name}: ${result.error}`, 'red');
      } else if (result.status === 200) {
        log(`  ✓ ${ep.name}: OK (${result.status})`, 'green');
        working++;
      } else if (result.status === 401) {
        log(`  ⚠ ${ep.name}: Sem autorização (${result.status})`, 'yellow');
        working++;
      } else if (result.status === 404) {
        log(`  ○ ${ep.name}: Não encontrado (${result.status})`, 'cyan');
      } else {
        log(`  ? ${ep.name}: ${result.status}`, 'yellow');
      }
    }

    printInfo(`\n${working}/${endpoints.length} endpoints responderam`);
    this.addResult('Endpoints', `TESTADO ⊘ (${working}/${endpoints.length})`);
  }

  async testCredentials(baseUrl) {
    printSection('TESTE 4: Validação de Credenciais');

    printInfo(`Token: ${CREDENTIALS.token.substring(0, 8)}...${CREDENTIALS.token.substring(-8)}`);
    printInfo(`Client ID: ${CREDENTIALS.clientId.substring(0, 8)}...`);
    printInfo(`Client Secret: ${CREDENTIALS.clientSecret.substring(0, 8)}...`);

    const result = await this.makeRequest(baseUrl, '/api/v1/me');

    if (result.status === 200) {
      printSuccess('Credenciais válidas!');
      if (result.data) {
        log(JSON.stringify(result.data, null, 2), 'green');
      }
      this.addResult('Credenciais', 'VÁLIDAS ✓');
      return true;
    } else if (result.status === 401) {
      printError('Credenciais inválidas ou expiradas');
      this.addResult('Credenciais', 'INVÁLIDAS ✗');
      return false;
    } else {
      printWarning(`Status desconhecido: ${result.status}`);
      this.addResult('Credenciais', `DESCONHECIDO (${result.status})`);
      return false;
    }
  }

  addResult(testName, result) {
    this.results.push({ testName, result });
  }

  printSummary() {
    printHeader('📊 RESUMO DOS TESTES');

    console.log();
    log('Detalhes:', 'bright');
    this.results.forEach(({ testName, result }) => {
      const color = result.includes('✓') ? 'green' :
                    result.includes('✗') ? 'red' :
                    result.includes('⊘') ? 'cyan' : 'yellow';
      log(`  ${result} - ${testName}`, color);
    });

    console.log();
    log('Próximos Passos:', 'bright');
    if (this.foundUrl) {
      log(`1. URL confirmada: ${this.foundUrl}`, 'green');
      log(`2. Adicione ao .env: JACAD_URL=${this.foundUrl}`, 'green');
      log(`3. Adicione ao .env: JACAD_API_KEY=${CREDENTIALS.token}`, 'green');
    } else {
      log(`1. Confirmar URL manualmente`, 'yellow');
      log(`2. Testar com curl: curl -H "Authorization: Bearer ${CREDENTIALS.token.substring(0, 8)}..." <URL>`, 'yellow');
      log(`3. Verificar token/credenciais`, 'yellow');
    }

    console.log();
  }
}

async function main() {
  printHeader('🔌 TESTE DE CONEXÃO COM JACAD REAL 🔌');

  const tester = new JacadRealTester();

  try {
    // Tenta descobrir a URL
    let baseUrl = await tester.discoverUrl();

    if (!baseUrl) {
      printWarning('\nNenhuma URL foi descoberta automaticamente.');
      printInfo('Execute manualmente com a URL correta:');
      log('  node test-jacad-real.js https://seu-jacad-url.com', 'cyan');
      return;
    }

    // Executa os testes
    await tester.testConnection(baseUrl);
    await tester.testAuthMethods(baseUrl);
    await tester.testEndpoints(baseUrl);
    await tester.testCredentials(baseUrl);

  } catch (error) {
    printError(`Erro durante testes: ${error.message}`);
    process.exit(1);
  }

  // Imprime resumo
  tester.printSummary();
}

main();
