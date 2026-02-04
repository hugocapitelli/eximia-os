# 🔌 GUIA DE TESTE - API JACAD REAL

## Status: Credenciais Fornecidas ✅

Você forneceu as seguintes credenciais:

```
Token/API Key: ba28d3c63e9b2234ec4bb3e6f920733b
Client ID:     e220f4b9-4b65-4714-894f-ea5e6c186334
Client Secret: f4743786-4253-40b3-bc96-98f15a8301f1
```

---

## ❓ Falta: URL da API

Para testar a conexão com a API real, precisamos da **URL base da API JACAD**.

### Exemplos de URLs Esperadas:

```
https://jacad.sua-escola.edu.br/api
https://api.jacad.seu-dominio.com
https://sistema-academico.sua-escola.com.br
https://jacad.api.sua-escola.com
http://jacad-servidor-local.com
```

---

## 🔍 Como Encontrar a URL

### Opção 1: Documente Fornecida (Recomendado)
- Procure na documentação do JACAD
- Consulte o administrador do sistema
- Verifique o email de configuração/suporte

### Opção 2: De Dentro da Instituição
```bash
# Se a instituição tem um portal/dashboard:
# Procure por "API", "Developer", "Integrations", "Webservices"

# Exemplo de padrões comuns:
https://[seu-dominio]/api/v1
https://[seu-dominio]/api/v2
https://api.[seu-dominio]/v1
https://[seu-dominio]/webservice
```

### Opção 3: Teste com cURL
```bash
# Se você suspeita de uma URL, teste assim:
curl -X GET https://sua-url.com/api/health \
  -H "Authorization: Bearer ba28d3c63e9b2234ec4bb3e6f920733b"

# Se receber 200 OK, essa é a URL correta!
# Se receber 401, a URL está correta mas a credencial está errada
# Se receber Connection Refused, a URL está incorreta
```

---

## 🚀 Como Testar Assim Que Tiver a URL

### Com o Script Node.js:
```bash
cd C:\Users\hugoc\OneDrive\Área de Trabalho\eximia-os\Projetos

# Substitua pela URL real:
node test-jacad-real.js https://sua-url-aqui.com/api
```

### Alternativamente, com cURL:
```bash
# Teste de conexão simples:
curl -X GET https://sua-url-aqui.com/api/health \
  -H "Authorization: Bearer ba28d3c63e9b2234ec4bb3e6f920733b" \
  -H "Content-Type: application/json" \
  -v

# Se retornar 200, a conexão está OK
```

---

## 📋 Informações que Você Precisa Fornecer

Para continuar com os testes:

1. **URL da API JACAD**: `https://...`
2. **Ambiente**: Produção / Staging / Desenvolvimento
3. **Versão da API**: v1 / v2 / outra (se souber)
4. **Documentação**: Link ou arquivo PDF da API (se disponível)

---

## ✅ Após Obter a URL

1. Teste com o script:
   ```bash
   node test-jacad-real.js https://sua-url
   ```

2. Se passar, configure no Harven.ai:
   ```bash
   cd Harven.ai/backend
   # Edite o arquivo .env:
   JACAD_URL=https://sua-url
   JACAD_API_KEY=ba28d3c63e9b2234ec4bb3e6f920733b
   ```

3. Reinicie o backend:
   ```bash
   python -m uvicorn main:app --reload
   ```

4. Faça a sincronização:
   ```bash
   curl -X POST http://localhost:8000/integrations/jacad/sync
   ```

---

## 🔐 Segurança das Credenciais

⚠️ **IMPORTANTE**: Você compartilhou credenciais sensíveis. Após testar:

1. **Se as credenciais são de produção:**
   - Considere rotacioná-las por segurança
   - Nunca as compartilhe por email/chat/insecure channels
   - Use um password manager

2. **Se são de desenvolvimento/teste:**
   - Tudo bem para testes iniciais
   - Ainda assim, guarde em local seguro

3. **Para produção:**
   - Use variáveis de ambiente
   - Use secrets manager (AWS Secrets, HashiCorp Vault, etc.)
   - Nunca committe no Git

---

## 📊 O Que Será Testado Assim Que a URL for Fornecida

```
TESTE 1: Descoberta de URL
   - Verifica se a URL responde
   - Testa variações de endpoints

TESTE 2: Autenticação
   - Testa Bearer Token
   - Testa Client ID + Secret

TESTE 3: Endpoints Disponíveis
   - /api/health
   - /api/v1/users
   - /api/v1/students
   - /api/v1/disciplines
   - E outros endpoint acadêmicos

TESTE 4: Validação de Credenciais
   - Obtém informações do usuário autenticado
   - Verifica permissões

RESULTADO:
   ✅ Se tudo passar: Sistema pronto para sincronização
   ❌ Se falhar: Diagnóstico de problemas
```

---

## 🆘 Problemas Comuns

### Problema 1: "Connection Refused"
```
Erro: ECONNREFUSED
Causa: URL está incorreta ou servidor não está rodando
Solução: Verifique a URL novamente
```

### Problema 2: "401 Unauthorized"
```
Erro: 401 Unauthorized
Causa: Token ou credenciais inválidas
Solução: Regenerar credenciais no painel JACAD
```

### Problema 3: "404 Not Found"
```
Erro: 404 Not Found
Causa: Endpoint não existe
Solução: Verificar versão da API, consultar documentação
```

### Problema 4: "Timeout"
```
Erro: ETIMEDOUT
Causa: Servidor demora muito para responder ou está offline
Solução: Verificar conectividade, firewall, VPN
```

---

## 📞 Próximos Passos

**1. Enviar a URL:**
```
Por favor, forneça a URL da API JACAD:
exemplo@seu-dominio.com ou no chat
```

**2. Eu vou:**
- Executar os testes com a URL
- Gerar relatório completo
- Configurar o Harven.ai
- Testar sincronização

**3. Você fará:**
- Revisar resultados
- Aprovar configurações
- Iniciar sincronização em produção

---

## 📝 Arquivos Relacionados

- `test-jacad-real.js` - Script de teste com credenciais reais
- `test-jacad-api.js` - Script de teste com dados MOCK
- `JACAD_API_TEST_REPORT.md` - Documentação completa da API
- `RESUMO_TESTES_JACAD.txt` - Resumo anterior dos testes

---

## 🎯 Resumo

| Item | Status | Ação |
|------|--------|------|
| Credenciais | ✅ Fornecidas | Nenhuma |
| URL da API | ❌ Faltando | **Forneça** |
| Token | ✅ Válido (em aparência) | Testar com URL |
| Client ID | ✅ Fornecido | Testar com URL |
| Client Secret | ✅ Fornecido | Testar com URL |

---

**Aguardando:** URL da API JACAD para continuar os testes ⏳

