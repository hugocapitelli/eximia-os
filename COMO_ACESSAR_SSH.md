# 🔐 Como Acessar SSH da sua VPS

## 🎯 Opção 1: Console Web (MAIS FÁCIL)

Não precisa de SSH! Use o console direto no navegador:

### **DigitalOcean**
```
1. https://cloud.digitalocean.com/
2. Clique no seu Droplet
3. Botão "Console" (canto superior direito)
4. Terminal abre no navegador ✅
```

### **Vultr**
```
1. https://my.vultr.com/
2. Clique no servidor
3. Ícone de monitor/tela (View Console)
4. Terminal abre no navegador ✅
```

### **AWS Lightsail**
```
1. https://lightsail.aws.amazon.com/
2. Clique na instância
3. Botão "Connect" > "Connect using SSH"
4. Terminal abre no navegador ✅
```

### **Hetzner Cloud**
```
1. https://console.hetzner.cloud/
2. Clique no servidor
3. Botão "Console" (ícone de terminal)
4. Terminal abre no navegador ✅
```

### **Contabo**
```
1. https://my.contabo.com/
2. Your Services > VPS
3. "VNC Console"
4. Terminal abre no navegador ✅
```

---

## 🎯 Opção 2: SSH Tradicional

Se preferir usar SSH do seu computador:

### **Passo 1: Encontrar as Credenciais**

#### **Email de Boas-Vindas**
Procure email do provedor com:
- Subject: "Welcome", "Server Created", "VPS Deployed"
- Conteúdo:
  ```
  IP Address: 123.45.67.89
  Username: root
  Password: SuaSenha123
  ```

#### **Painel do Provedor**

| Provedor | Onde Ver |
|----------|----------|
| **DigitalOcean** | Droplet > Access > "Show" na senha |
| **Vultr** | Server > Settings > Password |
| **AWS** | Instance > Connect > SSH credentials |
| **Hetzner** | Server > Overview > IPv4 |
| **Contabo** | Your Services > VPS > Login Data |

### **Passo 2: Conectar via SSH**

#### **Windows (PowerShell ou CMD)**

```powershell
# Abrir PowerShell (Win + X > Windows PowerShell)

# Conectar
ssh root@SEU_IP_AQUI

# Exemplo:
ssh root@123.45.67.89

# Digite "yes" quando perguntar
# Digite a senha quando solicitado (não aparece na tela)
```

#### **Windows (PuTTY)**

```
1. Baixar: https://www.putty.org/
2. Instalar e abrir
3. Em "Host Name": SEU_IP_AQUI
4. Port: 22
5. Connection type: SSH
6. Clicar "Open"
7. Login as: root
8. Password: SuaSenha
```

#### **Mac/Linux**

```bash
# Abrir Terminal
# Conectar
ssh root@SEU_IP_AQUI

# Exemplo:
ssh root@123.45.67.89
```

---

## 🔓 Se Não Souber a Senha

### **Resetar Senha Root**

#### **DigitalOcean**
```
1. Droplet > Access
2. "Reset Root Password"
3. Nova senha enviada por email
4. Conecte com a nova senha
```

#### **Vultr**
```
1. Server > Settings
2. "Server Password" > "Change Password"
3. Digite nova senha
4. Salvar
```

#### **Hetzner**
```
1. Server > Rescue
2. Enable rescue mode
3. Recebe senha por email
4. Reboot e conecte
```

#### **AWS Lightsail**
```
(AWS usa chaves .pem, não senha)
1. Download da chave .pem ao criar instância
2. Se perdeu: Criar nova key pair e associar
```

---

## 🚨 Problemas Comuns

### **Erro: "Permission denied"**

```bash
# Usuário errado
# Tente outros usuários comuns:
ssh ubuntu@SEU_IP
ssh admin@SEU_IP
ssh debian@SEU_IP
```

### **Erro: "Connection refused"**

```bash
# Firewall bloqueando porta 22
# Verifique no painel do provedor:
# - Firewall Rules
# - Security Groups
# - Permitir porta 22 (SSH)
```

### **Erro: "Host key verification failed"**

```bash
# Limpar chave antiga
ssh-keygen -R SEU_IP

# Tentar novamente
ssh root@SEU_IP
```

### **Erro: "Too many authentication failures"**

```bash
# Usar senha explicitamente
ssh -o PubkeyAuthentication=no root@SEU_IP
```

---

## 📋 Checklist de Informações

Para conectar via SSH, você precisa:

```
[ ] IP do servidor (ex: 123.45.67.89)
[ ] Usuário SSH (ex: root, ubuntu, admin)
[ ] Senha OU arquivo .pem (chave privada)
[ ] Porta SSH (padrão: 22)
```

---

## 🎯 Próximo Passo (Depois de Conectar)

Quando conseguir acessar SSH, execute:

```bash
# 1. Atualizar sistema
sudo apt update

# 2. Verificar se Easypanel está rodando
docker ps

# 3. Rodar script de diagnóstico SSL
curl -o /tmp/check-ssl.sh https://SEU_SCRIPT.sh
chmod +x /tmp/check-ssl.sh
sudo bash /tmp/check-ssl.sh
```

Ou copie e cole o script `check-easypanel-ssl.sh` que criei antes.

---

## 📞 Se Ainda Não Conseguir

**Me diga:**
1. Qual provedor VPS você usa? (DigitalOcean, Vultr, AWS, etc.)
2. Consegue acessar o painel do provedor?
3. Tem o email de criação do servidor?

Vou te guiar especificamente para o seu provedor!

---

**Última atualização**: 2026-01-27
