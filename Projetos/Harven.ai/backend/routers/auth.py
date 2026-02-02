"""
Harven.AI - Authentication Router
==================================
Endpoints for user authentication.
"""

from fastapi import APIRouter, HTTPException
from models.requests import LoginRequest
from utils.dependencies import get_supabase, get_logger
from utils.auth import hash_password, verify_password, needs_rehash

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login")
async def login(data: LoginRequest):
    """Autentica um usuário pelo RA e senha."""
    supabase = get_supabase()
    logger = get_logger()

    try:
        # Busca usuário pelo RA
        logger.debug("auth_lookup", ra=data.ra[:4] + "***" if len(data.ra) > 4 else "***")
        response = supabase.table("users").select("*").eq("ra", data.ra).execute()
        logger.debug("auth_lookup_response", found=bool(response.data))

        if not response.data:
            logger.debug("auth_lookup_not_found", ra=data.ra[:4] + "***" if len(data.ra) > 4 else "***")
            raise HTTPException(status_code=401, detail="RA não encontrado")

        user = response.data[0]

        # VERIFICAÇÃO DE SENHA COM BCRYPT
        stored_password = user.get('password_hash') or user.get('password') or ''

        if needs_rehash(stored_password):
            # Legacy plain text password - verify and migrate to bcrypt
            if stored_password != data.password:
                raise HTTPException(status_code=401, detail="Senha incorreta")
            # Migrate to bcrypt hash
            new_hash = hash_password(data.password)
            supabase.table("users").update({"password": new_hash}).eq("id", user['id']).execute()
            logger.info("password_migrated_to_bcrypt", user_id=user['id'])
        else:
            # Bcrypt hash - verify properly
            if not verify_password(data.password, stored_password):
                raise HTTPException(status_code=401, detail="Senha incorreta")

        # Normalização de Role para o Frontend
        raw_role = user.get('role', 'student').upper()
        normalized_role = 'INSTRUCTOR' if raw_role == 'TEACHER' else raw_role

        # Retorna dados do usuário e token fake
        return {
            "token": "fake-jwt-token-for-local-dev",
            "user": {
                "id": user['id'],
                "name": user['name'],
                "email": user.get('email', ''),
                "role": normalized_role,
                "ra": user['ra'],
                "avatar_url": user.get('avatar_url', ''),
                "title": user.get('title', '')
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error("login_error", error=str(e))
        raise HTTPException(status_code=500, detail="Erro interno no login")
