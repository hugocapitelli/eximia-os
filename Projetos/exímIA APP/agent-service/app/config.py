"""
ExímIA Agent Service - Configuration
"""
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # Environment
    environment: str = "development"
    debug: bool = False
    log_level: str = "INFO"

    # API
    api_v1_prefix: str = "/api/v1"

    # CORS
    cors_origins: list[str] = [
        "http://localhost:3000",
        "https://os.eximiaventures.com.br",
    ]

    # Supabase
    supabase_url: str
    supabase_service_key: str
    supabase_jwt_secret: str = ""

    # LLM Providers (for future use)
    openai_api_key: str = ""
    anthropic_api_key: str = ""

    @property
    def is_development(self) -> bool:
        return self.environment == "development"

    @property
    def is_production(self) -> bool:
        return self.environment == "production"


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


settings = get_settings()
