"""
ExímIA Agent Service - LLM Service

Abstraction layer for LLM providers (OpenAI, Anthropic).
"""
import logging
from typing import AsyncGenerator, Optional
from abc import ABC, abstractmethod

from app.config import settings

logger = logging.getLogger(__name__)


class LLMProvider(ABC):
    """Abstract base class for LLM providers."""

    @abstractmethod
    async def chat(
        self,
        messages: list[dict],
        model: str,
        temperature: float = 0.7,
        max_tokens: int = 4096,
    ) -> tuple[str, int]:
        """
        Send chat completion request.

        Returns:
            tuple: (response_content, tokens_used)
        """
        pass

    @abstractmethod
    async def chat_stream(
        self,
        messages: list[dict],
        model: str,
        temperature: float = 0.7,
        max_tokens: int = 4096,
    ) -> AsyncGenerator[str, None]:
        """
        Stream chat completion.

        Yields:
            str: Content chunks
        """
        pass


class OpenAIProvider(LLMProvider):
    """OpenAI LLM provider."""

    def __init__(self):
        try:
            from openai import AsyncOpenAI
            self.client = AsyncOpenAI(api_key=settings.openai_api_key)
            self.available = bool(settings.openai_api_key)
        except ImportError:
            logger.warning("OpenAI package not installed")
            self.client = None
            self.available = False

    async def chat(
        self,
        messages: list[dict],
        model: str = "gpt-4",
        temperature: float = 0.7,
        max_tokens: int = 4096,
    ) -> tuple[str, int]:
        if not self.available:
            raise RuntimeError("OpenAI not configured")

        response = await self.client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
        )

        content = response.choices[0].message.content or ""
        tokens = response.usage.total_tokens if response.usage else 0

        return content, tokens

    async def chat_stream(
        self,
        messages: list[dict],
        model: str = "gpt-4",
        temperature: float = 0.7,
        max_tokens: int = 4096,
    ) -> AsyncGenerator[str, None]:
        if not self.available:
            raise RuntimeError("OpenAI not configured")

        stream = await self.client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
            stream=True,
        )

        async for chunk in stream:
            if chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content


class AnthropicProvider(LLMProvider):
    """Anthropic LLM provider."""

    def __init__(self):
        try:
            from anthropic import AsyncAnthropic
            self.client = AsyncAnthropic(api_key=settings.anthropic_api_key)
            self.available = bool(settings.anthropic_api_key)
        except ImportError:
            logger.warning("Anthropic package not installed")
            self.client = None
            self.available = False

    def _convert_messages(self, messages: list[dict]) -> tuple[str, list[dict]]:
        """Convert OpenAI-style messages to Anthropic format."""
        system_prompt = ""
        converted = []

        for msg in messages:
            if msg["role"] == "system":
                system_prompt = msg["content"]
            else:
                converted.append({
                    "role": msg["role"],
                    "content": msg["content"],
                })

        return system_prompt, converted

    async def chat(
        self,
        messages: list[dict],
        model: str = "claude-3-opus-20240229",
        temperature: float = 0.7,
        max_tokens: int = 4096,
    ) -> tuple[str, int]:
        if not self.available:
            raise RuntimeError("Anthropic not configured")

        system_prompt, converted_messages = self._convert_messages(messages)

        response = await self.client.messages.create(
            model=model,
            max_tokens=max_tokens,
            system=system_prompt,
            messages=converted_messages,
        )

        content = response.content[0].text if response.content else ""
        tokens = response.usage.input_tokens + response.usage.output_tokens

        return content, tokens

    async def chat_stream(
        self,
        messages: list[dict],
        model: str = "claude-3-opus-20240229",
        temperature: float = 0.7,
        max_tokens: int = 4096,
    ) -> AsyncGenerator[str, None]:
        if not self.available:
            raise RuntimeError("Anthropic not configured")

        system_prompt, converted_messages = self._convert_messages(messages)

        async with self.client.messages.stream(
            model=model,
            max_tokens=max_tokens,
            system=system_prompt,
            messages=converted_messages,
        ) as stream:
            async for text in stream.text_stream:
                yield text


class LLMService:
    """
    LLM Service - manages multiple providers.

    Usage:
        llm = LLMService()
        response, tokens = await llm.chat(messages, model="gpt-4")
    """

    def __init__(self):
        self.openai = OpenAIProvider()
        self.anthropic = AnthropicProvider()

    def _get_provider(self, model: str) -> LLMProvider:
        """Get the appropriate provider for a model."""
        if model.startswith("gpt") or model.startswith("o1"):
            if not self.openai.available:
                raise RuntimeError("OpenAI not configured. Set OPENAI_API_KEY.")
            return self.openai
        elif model.startswith("claude"):
            if not self.anthropic.available:
                raise RuntimeError("Anthropic not configured. Set ANTHROPIC_API_KEY.")
            return self.anthropic
        else:
            # Default to OpenAI if available
            if self.openai.available:
                return self.openai
            elif self.anthropic.available:
                return self.anthropic
            else:
                raise RuntimeError("No LLM provider configured")

    async def chat(
        self,
        messages: list[dict],
        model: str = "gpt-4",
        temperature: float = 0.7,
        max_tokens: int = 4096,
    ) -> tuple[str, int]:
        """
        Send chat completion request.

        Args:
            messages: List of message dicts with 'role' and 'content'
            model: Model name (gpt-4, claude-3-opus-20240229, etc.)
            temperature: Sampling temperature
            max_tokens: Maximum tokens to generate

        Returns:
            tuple: (response_content, tokens_used)
        """
        provider = self._get_provider(model)
        return await provider.chat(messages, model, temperature, max_tokens)

    async def chat_stream(
        self,
        messages: list[dict],
        model: str = "gpt-4",
        temperature: float = 0.7,
        max_tokens: int = 4096,
    ) -> AsyncGenerator[str, None]:
        """
        Stream chat completion.

        Args:
            messages: List of message dicts
            model: Model name
            temperature: Sampling temperature
            max_tokens: Maximum tokens

        Yields:
            str: Content chunks
        """
        provider = self._get_provider(model)
        async for chunk in provider.chat_stream(messages, model, temperature, max_tokens):
            yield chunk

    @property
    def available_providers(self) -> list[str]:
        """List available providers."""
        providers = []
        if self.openai.available:
            providers.append("openai")
        if self.anthropic.available:
            providers.append("anthropic")
        return providers


# Singleton instance
_llm_service: Optional[LLMService] = None


def get_llm_service() -> LLMService:
    """Get or create LLM service singleton."""
    global _llm_service
    if _llm_service is None:
        _llm_service = LLMService()
    return _llm_service
