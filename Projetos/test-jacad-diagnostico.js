#!/usr/bin/env node

/**
 * 🔍 DIAGNÓSTICO AVANÇADO - JACAD API
 *
 * Extrai informações detalhadas sobre a falha de autenticação
 * e tenta descobrir endpoints públicos
 */

const https = require('https');

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
  console.log('\n' + '='.repeat(80));
  log(text.padStart(40 + text.length / 2).padEnd(80), 'magenta');
  console.log('='.repeat(80) + '\n');
}

function printSection(text) {
  log(`\n▶ ${text}`, 'blue');
  log('-'.repeat(80), 'blue');
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

const CREDENTIALS = {
  token: 'ba28d3c63e9b2234ec4bb3e6f920733b',
  clientId: 'e220f4b9-4b65-4714-894f-ea5e6c186334',
  clientSecret: 'f4743786-4253-40b3-bc96-98f15a8301f1'
};

class JacadDiagnostic {
  constructor(baseUrl) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.findings = [];
  }

  async makeRequest(path, method = 'GET', headers = {}, body = null) {
    return new Promise((resolve) => {
      const fullUrl = new URL(path, this.baseUrl);
      const options = {
        hostname: fullUrl.hostname,
        port: fullUrl.port,
        path: fullUrl.pathname + fullUrl.search,
        method: method,
        headers: headers,
        timeout: 10000
      };

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data,
            error: null
          });
        });
      });

      req.on('error', (e) => {
        resolve({
          status: null,
          headers: null,
          data: null,
          error: e.message
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({
          status: null,
          headers: null,
          data: null,
          error: 'Timeout'
        });
      });

      if (body) {
        req.write(body);
      }

      req.end();
    });
  }

  async test1_DetailedErrorAnalysis() {
    printSection('TESTE 1: Análise Detalhada da Mensagem de Erro 401');

    const headers = {
      'Authorization': `Bearer ${CREDENTIALS.token}`,
      'Content-Type': 'application/json'
    };

    const result = await this.makeRequest('/api/v1/students', 'GET', headers);

    if (result.status === 401) {
      printWarning('401 Unauthorized - Analisando resposta...');

      try {
        const errorData = JSON.parse(result.data);
        console.log();
        log('Resposta da API:', 'bright');
        log(JSON.stringify(errorData, null, 2), 'cyan');

        // Análise
        console.log();
        log('Análise:', 'bright');

        if (errorData.message) {
          log(`  Mensagem: ${errorData.message}`, 'yellow');
          this.findings.push(`Erro: ${errorData.message}`);
        }

        if (errorData.details) {
          log(`  Detalhes: ${errorData.details}`, 'yellow');
          this.findings.push(`Detalhes: ${errorData.details}`);
        }

        if (errorData.timestamp) {
          const date = new Date(parseInt(errorData.timestamp));
          log(`  Timestamp: ${date.toLocaleString('pt-BR')}`, 'cyan');
        }

        if (errorData.error_description) {
          log(`  Descrição: ${errorData.error_description}`, 'yellow');
          this.findings.push(`Tipo de erro: ${errorData.error_description}`);
        }

        if (errorData.error) {
          log(`  Erro: ${errorData.error}`, 'yellow');
          this.findings.push(`Código do erro: ${errorData.error}`);
        }
      } catch (e) {
        log('Resposta bruta (não JSON):', 'yellow');
        log(result.data.substring(0, 200), 'cyan');
      }
    } else {
      log(`Status inesperado: ${result.status}`, 'yellow');
    }
  }

  async test2_ServerInformation() {
    printSection('TESTE 2: Informações do Servidor');

    const headers = {
      'Authorization': `Bearer ${CREDENTIALS.token}`,
      'Content-Type': 'application/json'
    };

    const result = await this.makeRequest('/api/v1/students', 'GET', headers);

    if (result.headers) {
      log('Headers da Resposta:', 'bright');
      console.log();

      const importantHeaders = [
        'server',
        'x-powered-by',
        'x-version',
        'x-api-version',
        'content-type',
        'x-request-id',
        'www-authenticate',
        'x-frame-options',
        'x-content-type-options'
      ];

      for (const header of importantHeaders) {
        const value = result.headers[header];
        if (value) {
          log(`  ${header}: ${value}`, 'cyan');
          this.findings.push(`Header ${header}: ${value}`);
        }
      }

      // Todos os headers
      console.log();
      log('Todos os Headers:', 'bright');
      for (const [key, value] of Object.entries(result.headers)) {
        log(`  ${key}: ${value}`, 'cyan');
      }
    }
  }

  async test3_PublicEndpoints() {
    printSection('TESTE 3: Procurando Endpoints Públicos');

    const publicEndpoints = [
      '/',
      '/api',
      '/api/v1',
      '/docs',
      '/api/docs',
      '/swagger',
      '/api/swagger',
      '/swagger-ui.html',
      '/api/swagger-ui.html',
      '/swagger.json',
      '/api/swagger.json',
      '/openapi.json',
      '/api/openapi.json',
      '/health',
      '/api/health',
      '/ping',
      '/status',
      '/api/status',
      '/about',
      '/info'
    ];

    log(`Testando ${publicEndpoints.length} endpoints públicos...`, 'cyan');
    console.log();

    const working = [];

    for (const endpoint of publicEndpoints) {
      const result = await this.makeRequest(endpoint, 'GET', {});

      if (result.status && result.status < 500) {
        const color = result.status === 200 ? 'green' : 'yellow';
        log(`${endpoint.padEnd(25)} → ${result.status}`, color);

        if (result.status === 200) {
          working.push(endpoint);
          try {
            const data = JSON.parse(result.data);
            if (typeof data === 'object') {
              log(`    Campos: ${Object.keys(data).slice(0, 3).join(', ')}...`, 'cyan');
            }
          } catch (e) {}
        }
      }
    }

    if (working.length > 0) {
      console.log();
      printSuccess(`${working.length} endpoint(s) público(s) encontrado(s):`);
      working.forEach(ep => {
        log(`  ✓ ${ep}`, 'green');
        this.findings.push(`Endpoint público: ${ep}`);
      });
    } else {
      printWarning('Nenhum endpoint público encontrado');
    }
  }

  async test4_LoginAttempt() {
    printSection('TESTE 4: Tentativa de Login');

    const loginEndpoints = [
      '/login',
      '/api/login',
      '/api/v1/login',
      '/auth/login',
      '/api/auth/login',
      '/oauth/login'
    ];

    for (const endpoint of loginEndpoints) {
      log(`\nTentando: ${endpoint}`, 'cyan');

      const body = JSON.stringify({
        username: CREDENTIALS.clientId,
        password: CREDENTIALS.clientSecret,
        email: CREDENTIALS.clientId,
        client_id: CREDENTIALS.clientId,
        client_secret: CREDENTIALS.clientSecret
      });

      const headers = {
        'Content-Type': 'application/json'
      };

      const result = await this.makeRequest(endpoint, 'POST', headers, body);

      if (result.status === 200) {
        printSuccess(`Login bem-sucedido em ${endpoint}!`);
        log(result.data.substring(0, 200), 'green');
        this.findings.push(`Login funciona em: ${endpoint}`);
        return;
      } else if (result.status && result.status !== 404) {
        log(`  Status: ${result.status}`, 'cyan');
      }
    }

    printWarning('Nenhum endpoint de login respondeu com sucesso');
  }

  async test5_DirectoryListing() {
    printSection('TESTE 5: Descoberta de Diretórios');

    const dirs = [
      '/api/v1/',
      '/api/',
      '/documentation',
      '/docs',
      '/help'
    ];

    for (const dir of dirs) {
      const result = await this.makeRequest(dir, 'GET', {});
      if (result.status === 200) {
        log(`${dir} → ${result.status}`, 'green');
        if (result.data.length < 500) {
          log(result.data.substring(0, 150), 'cyan');
        }
      } else if (result.status) {
        log(`${dir} → ${result.status}`, result.status === 404 ? 'yellow' : 'cyan');
      }
    }
  }

  printFindings() {
    printHeader('🔍 DESCOBERTAS');

    if (this.findings.length === 0) {
      printWarning('Nenhuma descoberta importante');
      return;
    }

    console.log();
    log('Informações Coletadas:', 'bright');
    this.findings.forEach((finding, i) => {
      log(`  ${i + 1}. ${finding}`, 'cyan');
    });

    console.log();
  }

  printRecommendations() {
    printHeader('💡 RECOMENDAÇÕES');

    console.log();
    log('Baseado nos testes, recomendamos:', 'bright');
    console.log();

    log('1. VERIFICAR AS CREDENCIAIS', 'yellow');
    log('   - Token pode estar expirado (401 em todos os endpoints)', 'cyan');
    log('   - Verifique se as credenciais são para este ambiente (developer)', 'cyan');
    log('   - Contacte o suporte do JACAD para regenerar credenciais', 'cyan');

    console.log();

    log('2. OBTER DOCUMENTAÇÃO', 'yellow');
    log('   - Procure pela documentação oficial da API JACAD', 'cyan');
    log('   - Verifique o método correto de autenticação', 'cyan');
    log('   - Confirme endpoints disponíveis', 'cyan');

    console.log();

    log('3. TESTES FUTUROS', 'yellow');
    log('   - Assim que tiver um token válido, execute novamente:', 'cyan');
    log('   - node test-jacad-auth-methods.js', 'cyan');

    console.log();

    log('4. PRÓXIMO PASSO', 'bright');
    log('   Obtenha um token válido e envie novamente ➜', 'green');

    console.log();
  }
}

async function main() {
  const baseUrl = 'https://harven-developer.jacad.com.br';

  printHeader('🔍 DIAGNÓSTICO AVANÇADO - JACAD API 🔍');

  printInfo(`URL: ${baseUrl}`);
  printInfo(`Data/Hora: ${new Date().toLocaleString('pt-BR')}`);
  printInfo(`Token: ${CREDENTIALS.token.substring(0, 8)}...`);

  const diagnostic = new JacadDiagnostic(baseUrl);

  try {
    await diagnostic.test1_DetailedErrorAnalysis();
    await diagnostic.test2_ServerInformation();
    await diagnostic.test3_PublicEndpoints();
    await diagnostic.test4_LoginAttempt();
    await diagnostic.test5_DirectoryListing();
  } catch (error) {
    printError(`Erro durante diagnóstico: ${error.message}`);
    process.exit(1);
  }

  diagnostic.printFindings();
  diagnostic.printRecommendations();
}

main();
