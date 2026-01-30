# 🔒 Troubleshooting SSL - eximiaventures.com.br

## 🚨 Problema Identificado

Seu site está mostrando erro de **certificado não confiável** porque o certificado SSL está sendo emitido por um **Fortinet Firewall (FG100FTK23025599)** em vez de uma Certificate Authority válida como Let's Encrypt.

**Detalhes do Certificado Atual:**
- **Emissor**: support@fortinet.com, FG100FTK23025599
- **Tipo**: Certificado de SSL Inspection (Fortinet)
- **Problema**: Cadeia de certificados não confiável
- **Validade**: 23/01/2026 até 23/04/2026

---

## 🎯 Causas Possíveis

### 1. **SSL Inspection Ativo (Mais Provável)**
- Há um firewall Fortinet interceptando o tráfego HTTPS
- Provavelmente na rede da sua empresa ou provedor
- O firewall está descriptografando e re-criptografando conexões

### 2. **Let's Encrypt Não Configurado no Easypanel**
- O Easypanel não gerou/renovou o certificado SSL
- Configuração de domínio incorreta
- Problema com DNS ou ACME challenge

### 3. **Proxy/Gateway Intermediário**
- Há um proxy Fortinet entre o servidor e a internet
- Configuração de rede incorreta na VPS

---

## ✅ Soluções (Execute em Ordem)

### **PASSO 1: Verificar de Outra Rede**

Teste o site de uma rede diferente (4G/5G do celular):

```
1. Desconecte o WiFi/cabo de rede
2. Use dados móveis (4G/5G)
3. Acesse: https://eximiaventures.com.br
```

**Resultados:**
- ✅ **Funciona no 4G**: O problema é o Fortinet na sua rede local
- ❌ **Não funciona no 4G**: O problema está no servidor/Easypanel

---

### **PASSO 2: Verificar SSL no Easypanel**

Acesse o painel do Easypanel:

```
1. Login no Easypanel
2. Selecione seu projeto (exímIA APP)
3. Vá em "Domains" ou "Settings"
4. Verifique:
   ✅ Domínio: eximiaventures.com.br
   ✅ SSL/TLS: Enabled
   ✅ Certificate Provider: Let's Encrypt
   ✅ Status: Active/Valid
```

**Se o certificado não estiver ativo:**

1. Clique em "Generate SSL Certificate"
2. Ou "Force SSL Renewal"
3. Aguarde 1-2 minutos
4. Recarregue a página

---

### **PASSO 3: Verificar DNS**

Confirme que o DNS aponta para o IP correto:

```bash
# Windows (CMD ou PowerShell)
nslookup eximiaventures.com.br

# Deve retornar o IP da sua VPS (ex: 123.45.67.89)
# Se retornar IP diferente, há problema no DNS
```

**Corrigir DNS (se necessário):**

1. Acesse seu provedor de DNS (Registro.br, Cloudflare, etc.)
2. Verifique registro A:
   ```
   @ (ou eximiaventures.com.br) → IP_DA_VPS
   ```
3. Aguarde propagação (até 24h, geralmente 15min)

---

### **PASSO 4: Configurar Let's Encrypt Manualmente (SSH)**

Se o Easypanel falhou, configure via SSH:

```bash
# 1. Conectar na VPS via SSH
ssh seu-usuario@IP_DA_VPS

# 2. Instalar Certbot (se não instalado)
sudo apt update
sudo apt install certbot python3-certbot-nginx -y

# 3. Gerar certificado Let's Encrypt
sudo certbot --nginx -d eximiaventures.com.br -d www.eximiaventures.com.br

# 4. Seguir instruções na tela:
#    - Informe seu email
#    - Aceite termos de uso
#    - Escolha "2" para redirecionar HTTP -> HTTPS

# 5. Verificar certificados instalados
sudo certbot certificates

# 6. Testar renovação automática
sudo certbot renew --dry-run
```

**Saída esperada:**
```
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/eximiaventures.com.br/fullchain.pem
```

---

### **PASSO 5: Desabilitar SSL Inspection (Fortinet)**

Se você tem acesso ao firewall Fortinet (admin de rede):

#### **Opção A: Whitelist no Fortinet**

```
1. Login no FortiGate (admin Fortinet)
2. Security Profiles > SSL/SSH Inspection
3. Editar política ativa
4. Em "Exempt List", adicionar:
   - eximiaventures.com.br
   - *.eximiaventures.com.br
5. Salvar e aplicar
```

#### **Opção B: Desabilitar Temporariamente**

```
1. Security Profiles > SSL/SSH Inspection
2. Disable "Deep Inspection"
3. Testar acesso ao site
4. Re-enable após teste
```

#### **Opção C: Contatar TI da Empresa**

Se não tem acesso ao Fortinet:

```
Enviar email ao TI:
---
Assunto: Liberação SSL Inspection - eximiaventures.com.br

Prezados,

Solicito a liberação do domínio "eximiaventures.com.br" da inspeção SSL
do firewall Fortinet, pois está impedindo o acesso ao site.

Detalhes técnicos:
- Domínio: eximiaventures.com.br
- Certificado atual: FG100FTK23025599 (Fortinet)
- Certificado esperado: Let's Encrypt
- Firewall: FortiGate FG100

Obrigado!
---
```

---

### **PASSO 6: Configurar HTTPS no Dockerfile (se aplicável)**

Se estiver rodando em container, verifique configuração HTTPS:

```dockerfile
# apps/web/Dockerfile (já está correto)
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
```

**Easypanel deve:**
- Escutar na porta 3000 (container)
- Proxy reverso na porta 443 (HTTPS)
- Configurar SSL/TLS

---

## 🧪 Testes de Validação

### **Teste 1: Online SSL Checker**

```
Acesse: https://www.ssllabs.com/ssltest/
Digite: eximiaventures.com.br
Clique em "Submit"

Resultado esperado:
- Grade: A ou B
- Certificate Issuer: Let's Encrypt
- Protocol: TLSv1.2 ou TLSv1.3
```

### **Teste 2: cURL (SSH ou Terminal)**

```bash
# Testar conexão SSL
curl -vI https://eximiaventures.com.br

# Verificar certificado
echo | openssl s_client -servername eximiaventures.com.br -connect eximiaventures.com.br:443 2>/dev/null | openssl x509 -noout -issuer

# Esperado: issuer=C = US, O = Let's Encrypt, CN = ...
# Atual: issuer=support@fortinet.com (PROBLEMA)
```

### **Teste 3: Navegadores Diferentes**

```
Testar em:
- Chrome (Modo anônimo)
- Firefox (Janela privada)
- Edge
- Safari (se Mac/iOS)

Se TODOS mostram erro: problema no servidor
Se APENAS alguns: problema local/rede
```

---

## 📊 Script de Diagnóstico Automático

Execute o script criado:

```bash
# Linux/Mac
bash debug-ssl.sh

# Windows (Git Bash ou WSL)
bash debug-ssl.sh
```

O script vai coletar:
- DNS resolution
- Certificado SSL atual
- Issuer do certificado
- Validade
- Headers HTTP

---

## 🆘 Soluções Rápidas (Temporárias)

### **Para Desenvolvedores (Localhost)**

Se precisa acessar AGORA para desenvolver:

```bash
# Adicionar ao arquivo hosts (bypass DNS)
# Windows: C:\Windows\System32\drivers\etc\hosts
# Linux/Mac: /etc/hosts

IP_DA_VPS    eximiaventures.com.br

# Aceitar certificado não confiável no navegador
# (NÃO recomendado para produção)
```

### **Para Usuários Finais**

```
1. Aguardar correção do SSL
2. Ou usar HTTP temporariamente: http://eximiaventures.com.br
   (sem criptografia - não recomendado)
```

---

## 🔍 Checklist de Resolução

```
[ ] Testei de outra rede (4G/5G)
[ ] Verifiquei SSL no painel Easypanel
[ ] Confirmei DNS aponta para VPS correta
[ ] Gerei certificado Let's Encrypt (se necessário)
[ ] Contatei TI sobre Fortinet (se aplicável)
[ ] Testei com SSL Labs ou cURL
[ ] Certificado agora mostra "Let's Encrypt"
[ ] Site carrega com HTTPS sem erro
```

---

## 📞 Próximos Passos

**Se ainda não resolver:**

1. **Compartilhar logs do Easypanel:**
   - Logs do container do app
   - Logs do proxy/nginx
   - Configuração de domínio

2. **Compartilhar saída do script:**
   ```bash
   bash debug-ssl.sh > diagnostico.txt
   ```

3. **Contatar suporte Easypanel:**
   - Se Let's Encrypt não está gerando
   - Se há erro específico no painel

4. **Verificar firewall VPS:**
   ```bash
   # SSH na VPS
   sudo ufw status
   sudo ufw allow 443/tcp
   sudo ufw allow 80/tcp
   ```

---

## 🎯 Solução Provável

Com base nas imagens, **90% de chance** de ser:

1. **Firewall Fortinet na sua rede corporativa/ISP**
   - Solução: Whitelist no Fortinet
   - Ou: Acessar de outra rede

2. **Let's Encrypt não configurado no Easypanel**
   - Solução: Gerar certificado manualmente via SSH
   - Ou: Reconfigurar no painel Easypanel

---

**Última atualização**: 2026-01-27
**Mantido por**: Claude Code + @devops
