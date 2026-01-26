# backend/app/config.py
"""
Configuração centralizada da aplicação

Carrega variáveis de ambiente e define defaults
"""

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Configurações da aplicação"""

    # ========================================================================
    # APPLICATION
    # ========================================================================

    APP_NAME: str = "Agenda Cheia - Backend"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "development"  # development, staging, production

    # ========================================================================
    # DATABASE
    # ========================================================================

    DATABASE_URL: str = "postgresql://agenda_user:agenda_pass@localhost:5432/agenda_cheia"

    # ========================================================================
    # LLM (Gemini)
    # ========================================================================

    GEMINI_API_KEY: str = ""
    LLM_MODEL: str = "gemini-1.5-flash"  # ou gemini-1.5-pro para melhor qualidade

    # ========================================================================
    # REDIS
    # ========================================================================

    REDIS_URL: str = "redis://localhost:6379"
    EVENT_BUS_TYPE: str = "redis"  # redis ou memory (memory apenas para dev)

    # ========================================================================
    # NOTIFICATIONS
    # ========================================================================

    NOTIFICATION_PROVIDER: str = "n8n"  # n8n, twilio, ou mock

    # N8N
    N8N_BASE_URL: str = "https://n8n.seu-dominio.com"
    N8N_WEBHOOK_TOKEN: Optional[str] = None

    # Twilio (alternativa ao N8N)
    TWILIO_ACCOUNT_SID: str = ""
    TWILIO_AUTH_TOKEN: str = ""
    TWILIO_WHATSAPP_PHONE: str = "+5511999999999"
    TWILIO_SMS_PHONE: str = "+5511999999999"

    # SendGrid (para email)
    SENDGRID_API_KEY: str = ""
    SENDGRID_FROM_EMAIL: str = "noreply@agenda-cheia.com"

    # ========================================================================
    # FRONTEND
    # ========================================================================

    FRONTEND_URL: str = "http://localhost:3000"
    CORS_ORIGINS: list = ["http://localhost:3000", "http://localhost:5173"]

    # ========================================================================
    # AUTHENTICATION
    # ========================================================================

    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    TOKEN_EXPIRATION_HOURS: int = 24

    # ========================================================================
    # LOGGING
    # ========================================================================

    LOG_LEVEL: str = "INFO"  # DEBUG, INFO, WARNING, ERROR
    LOG_FORMAT: str = "json"  # json ou text

    # ========================================================================
    # CELERY (Task Queue)
    # ========================================================================

    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/1"

    # ========================================================================
    # AUTOMATION SCHEDULES
    # ========================================================================

    # Prazo Certo: hora do dia para executar (ex: 09:00)
    PRAZO_CERTO_SCHEDULE_HOUR: int = 9
    PRAZO_CERTO_SCHEDULE_MINUTE: int = 0

    # Encher Agenda: dias da semana (0=seg, 1=ter, ..., 6=dom)
    ENCHER_AGENDA_SCHEDULE_DAYS: list = [0, 2, 4]  # seg, qua, sex
    ENCHER_AGENDA_SCHEDULE_HOUR: int = 14
    ENCHER_AGENDA_SCHEDULE_MINUTE: int = 0

    class Config:
        env_file = ".env"
        case_sensitive = True


# Criar instância global de settings
settings = Settings()


# ============================================================================
# PRINT CONFIG (debug)
# ============================================================================

def print_config():
    """Imprime configuração atual (sem valores sensíveis)"""

    print("\n" + "=" * 60)
    print("CONFIGURAÇÃO CARREGADA")
    print("=" * 60)

    config_dict = settings.model_dump()

    for key, value in config_dict.items():
        # Ocultar valores sensíveis
        if any(secret in key.upper() for secret in ["KEY", "TOKEN", "PASSWORD", "SECRET"]):
            value = "***REDACTED***"

        print(f"  {key}: {value}")

    print("=" * 60 + "\n")
