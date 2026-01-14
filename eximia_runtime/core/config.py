"""Configuration management for Eximia Runtime"""

import os
from pathlib import Path
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Runtime configuration loaded from environment variables"""

    # LLM Providers
    gemini_api_key: str | None = Field(default=None, alias="GEMINI_API_KEY")
    openai_api_key: str | None = Field(default=None, alias="OPENAI_API_KEY")
    anthropic_api_key: str | None = Field(default=None, alias="ANTHROPIC_API_KEY")

    # Default model (LiteLLM format: provider/model)
    default_model: str = Field(
        default="gemini/gemini-2.0-flash",
        alias="DEFAULT_MODEL"
    )

    # Vector DB - Hybrid Sync Support
    vector_db_url: str | None = Field(
        default=None,
        alias="VECTOR_DB_URL", 
        description="URL for Vector DB (Long-term Memory). Supabase/Pinecone."
    )
    
    # Supabase Storage (S3 Compatible) - Zero-OneDrive Support
    storage_endpoint: str | None = Field(default=None, alias="STORAGE_ENDPOINT")
    storage_access_key: str | None = Field(default=None, alias="STORAGE_ACCESS_KEY")
    storage_secret_key: str | None = Field(default=None, alias="STORAGE_SECRET_KEY")
    storage_bucket: str = Field(default="codex-files", alias="STORAGE_BUCKET")

    # ChromaDB (Local Fallback)
    chroma_persist_dir: Path = Field(default=Path(".chroma"), alias="CHROMA_PERSIST_DIR")

    # Paths
    project_root: Path = Field(default_factory=lambda: Path(__file__).parent.parent.parent)

    # Logging
    log_level: Literal["DEBUG", "INFO", "WARNING", "ERROR"] = Field(
        default="INFO",
        alias="LOG_LEVEL"
    )
    log_format: Literal["json", "console"] = Field(default="console", alias="LOG_FORMAT")

    class Config:
        env_file = Path(__file__).parent.parent.parent / ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

    @property
    def agents_dirs(self) -> list[Path]:
        """Directories containing agent definitions"""
        root = self.project_root
        return [
            root / "The_Veritas",
            root / "The_CFO",
            root / "The_CLO",
            root / "The_CEO",
            root / "The_CMO",
            root / "The_Maestro",
            root / "The_Cloner",
            root / "Clone_Factory",
            root / "Clones",
            root / "X_Agents",
            root / "Z_Squad",
            root / "Z_Squad" / "outputs",
            root / "Intellex" / "modules",
        ]

    def get_available_provider(self) -> str:
        """Returns the first available LLM provider"""
        if self.gemini_api_key:
            return "gemini"
        if self.openai_api_key:
            return "openai"
        if self.anthropic_api_key:
            return "anthropic"
        raise ValueError("No LLM API key configured. Set GEMINI_API_KEY, OPENAI_API_KEY, or ANTHROPIC_API_KEY")


# Singleton instance
settings = Settings()
