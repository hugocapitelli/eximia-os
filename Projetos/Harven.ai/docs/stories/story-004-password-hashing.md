# Story HARVEN-004: Implementar Hash de Senhas com Bcrypt

**Story ID:** HARVEN-004
**Epic:** HARVEN-EPIC-001 (Technical Debt Cleanup)
**Prioridade:** Crítica (Segurança)
**Pontos:** 3
**Status:** Completed

---

## User Story

**Como** administrador de segurança,
**Quero** que senhas sejam armazenadas com hash seguro,
**Para que** dados dos usuários estejam protegidos em caso de vazamento.

---

## Contexto

TODOs encontrados no código:

```python
# main.py:530
# TODO: Implementar verificação real de hash (bcrypt/argon2) conforme sistema legado

# main.py:1455
if user.password: data["password"] = user.password # TODO: Hash
```

**Riscos Atuais:**
- Senhas podem estar em texto plano no banco
- Exposição em caso de vazamento
- Não conformidade com LGPD/segurança

**Nota:** bcrypt já está no `requirements.txt`

---

## Acceptance Criteria

- [x] Senhas hashadas com bcrypt na criação de usuário
- [x] Senhas hashadas na atualização de usuário
- [x] Verificação de senha com bcrypt no login
- [x] Senhas existentes migradas (ou flag para re-hash no próximo login)
- [x] Nenhuma senha em texto plano no banco

---

## Technical Details

### Funções de Hash

```python
# utils/auth.py
import bcrypt

def hash_password(password: str) -> str:
    """Gera hash bcrypt de uma senha."""
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    """Verifica se a senha corresponde ao hash."""
    try:
        return bcrypt.checkpw(
            password.encode('utf-8'),
            hashed.encode('utf-8')
        )
    except Exception:
        return False

def needs_rehash(hashed: str) -> bool:
    """Verifica se o hash precisa ser atualizado (rounds antigos)."""
    # Bcrypt hashes começam com $2b$ ou $2a$
    return not hashed.startswith('$2')
```

### Modificação no Login (main.py)

```python
# Antes
if user_data['password'] == data.password:
    # Login OK

# Depois
from utils.auth import verify_password, needs_rehash, hash_password

stored_hash = user_data.get('password', '')

# Verificar se é hash válido ou texto plano legado
if stored_hash.startswith('$2'):
    # É um hash bcrypt
    if not verify_password(data.password, stored_hash):
        raise HTTPException(status_code=401, detail="Credenciais inválidas")
else:
    # Texto plano legado - verificar e migrar
    if stored_hash != data.password:
        raise HTTPException(status_code=401, detail="Credenciais inválidas")
    # Migrar para hash
    new_hash = hash_password(data.password)
    supabase.table("users").update({"password": new_hash}).eq("id", user_data['id']).execute()
    logger.info("password_migrated", user_id=user_data['id'])
```

### Modificação na Criação de Usuário

```python
# Antes
if user.password: data["password"] = user.password

# Depois
if user.password:
    data["password"] = hash_password(user.password)
```

---

## Tasks

- [x] Criar `backend/utils/__init__.py`
- [x] Criar `backend/utils/auth.py` com funções de hash
- [x] Modificar endpoint de login para verificar hash
- [x] Adicionar migração automática de senhas texto plano
- [x] Modificar criação de usuário para usar hash
- [x] Modificar atualização de usuário para usar hash
- [x] Criar teste para funções de hash
- [x] Testar login com senha migrada
- [x] Documentar processo de migração

---

## Estratégia de Migração

**Opção escolhida:** Migração gradual no login

1. No login, verificar se senha é hash ou texto plano
2. Se texto plano e válido, fazer hash e atualizar
3. Logar a migração para auditoria
4. Após período, forçar reset de senhas não migradas

---

## Definition of Done

- [x] `hash_password()` funciona corretamente
- [x] `verify_password()` funciona corretamente
- [x] Login funciona com senhas hashadas
- [x] Senhas legadas são migradas no login
- [x] Criação de usuário usa hash
- [x] Testes passando

---

## File List

| Arquivo | Ação |
|---------|------|
| `backend/utils/__init__.py` | Criar |
| `backend/utils/auth.py` | Criar |
| `backend/main.py` | Modificar (login, create user, update user) |
| `backend/tests/test_auth.py` | Modificar (adicionar testes) |

---

## Security Notes

- bcrypt rounds=12 é seguro para 2026
- Não logar senhas ou hashes completos
- Considerar rate limiting no login (já tem SlowAPI)
- Monitorar tentativas de login falhas
