#!/usr/bin/env node

/**
 * 🔐 TESTE DE MÉTODOS DE AUTENTICAÇÃO - JACAD API
 *
 * Testa múltiplos métodos de autenticação com o JACAD
 * URL: https://harven-developer.jacad.com.br
 *
 * Métodos testados:
 * 1. Bearer Token
 * 2. Basic Auth (Client ID:Secret)
 * 3. OAuth2 Client Credentials
 * 4. Form Data
 * 5. Header customizado
 */

const https = require('https');
const querystring = require('querystring');

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

const CREDENTIALS = {
  token: 'ba28d3c63e9b2234ec4bb3e6f920733b',
  clientId: 'e220f4b9-4b65-4714-894f-ea5e6c186334',
  clientSecret: 'f4743786-4253-40b3-bc96-98f15a8301f1'
};

class AuthMethodTester {
  constructor(baseUrl) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.results = [];
    this.accessToken = null;
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

      if (body) {
        req.write(body);
      }

      req.end();
    });
  }

  async testMethod1_BearerToken() {
    printSection('MÉTODO 1: Bearer Token');
    printInfo(`Token: ${CREDENTIALS.token.substring(0, 8)}...`);

    const headers = {
      'Authorization': `Bearer ${CREDENTIALS.token}`,
      'Content-Type': 'application/json'
    };

    const result = await this.makeRequest('/api/v1/students', 'GET', headers);

    log(`Status: ${result.status}`, result.status === 200 ? 'green' : 'red');
    if (result.raw) {
      log(`Response: ${result.raw.substring(0, 100)}...`, 'cyan');
    }

    if (result.status === 200) {
      printSuccess('Bearer Token funcionou!');
      this.results.push({ method: 'Bearer Token', status: 'PASSOU ✓', code: 200 });
      return true;
    } else if (result.status === 401) {
      printError('Token inválido ou expirado');
      this.results.push({ method: 'Bearer Token', status: 'FALHOU ✗ (401)', code: 401 });
    } else {
      printWarning(`Status: ${result.status}`);
      this.results.push({ method: 'Bearer Token', status: `Erro ${result.status}`, code: result.status });
    }

    return false;
  }

  async testMethod2_BasicAuth() {
    printSection('MÉTODO 2: Basic Auth (Client ID:Secret)');
    printInfo(`Client ID: ${CREDENTIALS.clientId.substring(0, 8)}...`);
    printInfo(`Client Secret: ${CREDENTIALS.clientSecret.substring(0, 8)}...`);

    const credentials = `${CREDENTIALS.clientId}:${CREDENTIALS.clientSecret}`;
    const encoded = Buffer.from(credentials).toString('base64');

    const headers = {
      'Authorization': `Basic ${encoded}`,
      'Content-Type': 'application/json'
    };

    const result = await this.makeRequest('/api/v1/students', 'GET', headers);

    log(`Status: ${result.status}`, result.status === 200 ? 'green' : 'red');

    if (result.status === 200) {
      printSuccess('Basic Auth funcionou!');
      this.results.push({ method: 'Basic Auth', status: 'PASSOU ✓', code: 200 });
      return true;
    } else if (result.status === 401) {
      printWarning('Basic Auth não autorizado');
      this.results.push({ method: 'Basic Auth', status: 'FALHOU ✗ (401)', code: 401 });
    } else {
      printWarning(`Status: ${result.status}`);
      this.results.push({ method: 'Basic Auth', status: `Erro ${result.status}`, code: result.status });
    }

    return false;
  }

  async testMethod3_OAuth2ClientCredentials() {
    printSection('MÉTODO 3: OAuth2 Client Credentials');
    printInfo('Tentando obter access token via Client Credentials...');

    const tokenEndpoints = [
      '/oauth/token',
      '/api/oauth/token',
      '/api/v1/oauth/token',
      '/token',
      '/api/token',
      '/oauth2/token',
      '/auth/token',
      '/auth/oauth/token'
    ];

    for (const endpoint of tokenEndpoints) {
      log(`\nTestando: ${endpoint}`);

      const body = querystring.stringify({
        grant_type: 'client_credentials',
        client_id: CREDENTIALS.clientId,
        client_secret: CREDENTIALS.clientSecret
      });

      const credentials = `${CREDENTIALS.clientId}:${CREDENTIALS.clientSecret}`;
      const encoded = Buffer.from(credentials).toString('base64');

      const headers = {
        'Authorization': `Basic ${encoded}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      };

      const result = await this.makeRequest(endpoint, 'POST', headers, body);

      if (result.status === 200 && result.data && result.data.access_token) {
        printSuccess(`Token obtido via ${endpoint}`);
        this.accessToken = result.data.access_token;
        log(`Access Token: ${this.accessToken.substring(0, 8)}...`, 'green');

        // Agora testa com o novo token
        const studentHeaders = {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        };

        const studentResult = await this.makeRequest('/api/v1/students', 'GET', studentHeaders);

        if (studentResult.status === 200) {
          printSuccess('Access Token funcionou com /api/v1/students!');
          this.results.push({ method: 'OAuth2 Client Credentials', status: 'PASSOU ✓', code: 200 });
          return true;
        }
      } else if (result.status === 200) {
        log(`  Resposta: ${result.raw.substring(0, 100)}...`, 'cyan');
      } else if (result.status !== 404 && result.status !== 401) {
        log(`  Status: ${result.status}`, 'yellow');
      }
    }

    printWarning('Nenhum endpoint de token OAuth2 respondeu com sucesso');
    this.results.push({ method: 'OAuth2 Client Credentials', status: 'NÃO ENCONTRADO ⊘', code: null });
    return false;
  }

  async testMethod4_QueryParameter() {
    printSection('MÉTODO 4: Token em Query Parameter');
    printInfo(`Token como ?token=...`);

    const headers = {
      'Content-Type': 'application/json'
    };

    const result = await this.makeRequest(
      `/api/v1/students?token=${CREDENTIALS.token}`,
      'GET',
      headers
    );

    log(`Status: ${result.status}`, result.status === 200 ? 'green' : 'red');

    if (result.status === 200) {
      printSuccess('Query Parameter funcionou!');
      this.results.push({ method: 'Query Parameter', status: 'PASSOU ✓', code: 200 });
      return true;
    } else {
      this.results.push({ method: 'Query Parameter', status: `Erro ${result.status}`, code: result.status });
    }

    return false;
  }

  async testMethod5_CustomHeader() {
    printSection('MÉTODO 5: Header Customizado (X-API-Key)');
    printInfo(`X-API-Key: ${CREDENTIALS.token.substring(0, 8)}...`);

    const headers = {
      'X-API-Key': CREDENTIALS.token,
      'Content-Type': 'application/json'
    };

    const result = await this.makeRequest('/api/v1/students', 'GET', headers);

    log(`Status: ${result.status}`, result.status === 200 ? 'green' : 'red');

    if (result.status === 200) {
      printSuccess('X-API-Key funcionou!');
      this.results.push({ method: 'X-API-Key Header', status: 'PASSOU ✓', code: 200 });
      return true;
    } else {
      this.results.push({ method: 'X-API-Key Header', status: `Erro ${result.status}`, code: result.status });
    }

    return false;
  }

  async testMethod6_ApiKeyHeader() {
    printSection('MÉTODO 6: Header API-Key');
    printInfo(`API-Key: ${CREDENTIALS.token.substring(0, 8)}...`);

    const headers = {
      'API-Key': CREDENTIALS.token,
      'Content-Type': 'application/json'
    };

    const result = await this.makeRequest('/api/v1/students', 'GET', headers);

    log(`Status: ${result.status}`, result.status === 200 ? 'green' : 'red');

    if (result.status === 200) {
      printSuccess('API-Key Header funcionou!');
      this.results.push({ method: 'API-Key Header', status: 'PASSOU ✓', code: 200 });
      return true;
    } else {
      this.results.push({ method: 'API-Key Header', status: `Erro ${result.status}`, code: result.status });
    }

    return false;
  }

  printSummary() {
    printHeader('📊 RESUMO DOS MÉTODOS DE AUTENTICAÇÃO');

    const passed = this.results.filter(r => r.status.includes('PASSOU')).length;
    const failed = this.results.filter(r => r.status.includes('FALHOU')).length;

    console.log();
    log('Resultados por Método:', 'bright');
    this.results.forEach(({ method, status, code }) => {
      const color = status.includes('PASSOU') ? 'green' :
                    status.includes('FALHOU') ? 'red' : 'cyan';
      log(`  ${status} - ${method} (HTTP ${code || '?'})`, color);
    });

    console.log();
    log(`Total: ${passed} sucesso(s), ${failed} falha(s)`, 'bright');

    if (passed > 0) {
      console.log();
      printSuccess('MÉTODO DE AUTENTICAÇÃO ENCONTRADO! 🎉');
    } else if (this.accessToken) {
      console.log();
      printSuccess('OAuth2 Token obtido com sucesso!');
    } else {
      console.log();
      printWarning('Nenhum método funcionou. Verifique as credenciais.');
    }

    console.log();
  }
}

async function main() {
  const baseUrl = 'https://harven-developer.jacad.com.br';

  printHeader('🔐 TESTE DE MÉTODOS DE AUTENTICAÇÃO - JACAD 🔐');

  printInfo(`URL: ${baseUrl}`);
  printInfo(`Data/Hora: ${new Date().toLocaleString('pt-BR')}`);

  const tester = new AuthMethodTester(baseUrl);

  try {
    await tester.testMethod1_BearerToken();
    await tester.testMethod2_BasicAuth();
    await tester.testMethod3_OAuth2ClientCredentials();
    await tester.testMethod4_QueryParameter();
    await tester.testMethod5_CustomHeader();
    await tester.testMethod6_ApiKeyHeader();
  } catch (error) {
    printError(`Erro durante testes: ${error.message}`);
    process.exit(1);
  }

  tester.printSummary();

  // Salva o token se encontrou
  if (tester.accessToken) {
    console.log();
    printSuccess('Token OAuth2 obtido!');
    printInfo(`Novo token: ${tester.accessToken}`);
    printInfo('Use este token para requisições futuras');
  }
}

main();
