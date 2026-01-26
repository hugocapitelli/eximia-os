# backend/app/providers/llm_provider.py
"""
LLMProvider - Integração com Gemini (Google)

Responsável por toda a inteligência artificial
"""

from typing import List, Dict, Any, Optional
import logging
import json

from app.core.abstractions import LLMProvider


logger = logging.getLogger(__name__)


class GeminiLLMProvider(LLMProvider):
    """
    Integração com Google Gemini API

    Suporta:
    - Geração de texto simples
    - Chat com histórico
    - Detecção de intenção
    - Extração de dados estruturados
    - Ranking de clientes por relevância
    """

    def __init__(self, api_key: str, model: str = "gemini-1.5-flash"):
        """
        Args:
            api_key: Google Gemini API key
            model: Modelo a usar (padrão: gemini-1.5-flash para speed)
        """
        self.api_key = api_key
        self.model = model

        # Lazy import para não falhar se não tiver google-generativeai
        try:
            import google.generativeai as genai

            genai.configure(api_key=api_key)
            self.genai = genai
            logger.info(f"Gemini initialized with model {model}")
        except ImportError:
            logger.warning("google-generativeai not installed")
            self.genai = None

    async def generate(self, prompt: str, **kwargs) -> str:
        """
        Gera texto simples a partir de prompt

        Args:
            prompt: Texto do prompt
            **kwargs: Opções adicionais (temperature, max_tokens, etc)

        Returns:
            Texto gerado
        """

        if not self.genai:
            logger.error("Gemini not initialized")
            return "Erro ao gerar resposta"

        try:
            temperature = kwargs.get("temperature", 0.7)
            max_tokens = kwargs.get("max_tokens", 500)

            model = self.genai.GenerativeModel(
                model_name=self.model,
                generation_config={
                    "temperature": temperature,
                    "max_output_tokens": max_tokens,
                },
            )

            response = model.generate_content(prompt)

            text = response.text
            logger.debug(f"Generated text (len={len(text)}): {text[:100]}...")

            return text

        except Exception as e:
            logger.error(f"Error generating text: {e}")
            return "Desculpe, ocorreu um erro ao processar sua solicitação."

    async def chat(
        self, message: str, history: List[Dict], system_prompt: str, **kwargs
    ) -> str:
        """
        Chat mode com histórico de conversa

        Args:
            message: Mensagem atual do usuário
            history: Histórico [{"role": "user"/"assistant", "content": "..."}]
            system_prompt: Prompt do sistema (personalidade, instrções)
            **kwargs: Opções adicionais

        Returns:
            Resposta da IA
        """

        if not self.genai:
            logger.error("Gemini not initialized")
            return "Erro ao processar mensagem"

        try:
            temperature = kwargs.get("temperature", 0.8)
            max_tokens = kwargs.get("max_tokens", 1000)

            model = self.genai.GenerativeModel(
                model_name=self.model,
                system_instruction=system_prompt,
                generation_config={
                    "temperature": temperature,
                    "max_output_tokens": max_tokens,
                },
            )

            # Converter histórico para formato Gemini
            chat_history = []
            for msg in history:
                chat_history.append({
                    "role": "model" if msg["role"] == "assistant" else "user",
                    "parts": [msg["content"]],
                })

            # Iniciar chat session
            chat_session = model.start_chat(history=chat_history)

            # Enviar mensagem
            response = chat_session.send_message(message)

            text = response.text
            logger.debug(f"Chat response generated: {text[:100]}...")

            return text

        except Exception as e:
            logger.error(f"Error in chat: {e}")
            return "Desculpe, estou com dificuldades agora. Tente novamente."

    async def detect_intent(
        self, text: str, intent_list: Optional[List[str]] = None
    ) -> str:
        """
        Detecta intenção de um texto

        Args:
            text: Texto a analisar
            intent_list: Lista de intenções possíveis
                         Ex: ["booking", "inquiry", "complaint", "feedback", "hello"]

        Returns:
            Intenção detectada (uma das da lista)
        """

        if not intent_list:
            intent_list = [
                "booking",
                "inquiry",
                "complaint",
                "feedback",
                "hello",
                "unknown",
            ]

        prompt = f"""
        Analise o seguinte texto e detecte a intenção do usuário.

        Texto: "{text}"

        Intenções possíveis: {', '.join(intent_list)}

        Responda APENAS com uma das intenções da lista, sem explicação.
        """

        try:
            response = await self.generate(prompt, max_tokens=20)
            intent = response.strip().lower()

            # Validar se intenção está na lista
            if intent not in intent_list:
                intent = "unknown"

            logger.debug(f"Intent detected: {intent}")
            return intent

        except Exception as e:
            logger.error(f"Error detecting intent: {e}")
            return "unknown"

    async def extract_data(
        self, text: str, schema: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Extrai dados estruturados de um texto

        Args:
            text: Texto a extrair dados
            schema: Schema do dados esperados
                    Ex: {
                        "service_id": "UUID do serviço",
                        "date": "YYYY-MM-DD",
                        "time": "HH:MM",
                        "notes": "Notas adicionais"
                    }

        Returns:
            Dict com dados extraídos
        """

        schema_str = json.dumps(schema, indent=2, ensure_ascii=False)

        prompt = f"""
        Extraia dados estruturados do seguinte texto.

        Texto: "{text}"

        Schema esperado:
        {schema_str}

        Retorne APENAS um JSON válido (sem markdown, sem explicação).
        Se um campo não estiver no texto, não o inclua.
        """

        try:
            response = await self.generate(prompt, max_tokens=500)

            # Parse JSON
            data = json.loads(response)
            logger.debug(f"Data extracted: {data}")

            return data

        except json.JSONDecodeError:
            logger.warning(f"Failed to parse JSON response: {response[:100]}")
            return {}
        except Exception as e:
            logger.error(f"Error extracting data: {e}")
            return {}

    async def rank_clients(
        self, clients: List[Dict], criteria: Dict[str, Any]
    ) -> List[tuple]:
        """
        Ranking de clientes por relevância

        Útil para "Encher Agenda" - encontrar melhores clientes para um horário

        Args:
            clients: Lista de clientes [{"id", "name", "last_visit", "status"}]
            criteria: Critérios de ranking {"days_without_visit": 30, "service": "manicure"}

        Returns:
            Lista de (client_id, score) ordenada por relevância (desc)
        """

        if not clients:
            return []

        clients_json = json.dumps([{
            "id": c.get("id", ""),
            "name": c.get("name", ""),
            "last_visit": str(c.get("last_visit", "")),
            "status": c.get("status", ""),
        } for c in clients], ensure_ascii=False)

        criteria_json = json.dumps(criteria, ensure_ascii=False)

        prompt = f"""
        Ranqueie os seguintes clientes por relevância para um agendamento.

        Clientes:
        {clients_json}

        Critérios:
        {criteria_json}

        Responda com JSON: [{{"client_id": "uuid", "score": 0.95}}, ...]
        Scores entre 0.0 e 1.0, ordenados descendente.
        APENAS JSON, sem explicação.
        """

        try:
            response = await self.generate(prompt, max_tokens=1000, temperature=0.3)
            data = json.loads(response)

            # Validar formato
            rankings = []
            for item in data:
                if "client_id" in item and "score" in item:
                    rankings.append((item["client_id"], item["score"]))

            logger.debug(f"Clients ranked: {len(rankings)} results")
            return rankings

        except json.JSONDecodeError:
            logger.warning(f"Failed to parse ranking JSON: {response[:100]}")
            # Fallback: retornar sem score
            return [(c["id"], 0.5) for c in clients]
        except Exception as e:
            logger.error(f"Error ranking clients: {e}")
            return [(c["id"], 0.5) for c in clients]

    async def summarize(self, text: str, max_length: int = 200) -> str:
        """
        Resumo de texto

        Args:
            text: Texto a resumir
            max_length: Comprimento máximo do resumo

        Returns:
            Texto resumido
        """

        prompt = f"""
        Resuma o seguinte texto em no máximo {max_length} caracteres.

        Texto: "{text}"

        Retorne APENAS o resumo, sem explicação.
        """

        try:
            response = await self.generate(prompt, max_tokens=max_length)
            return response.strip()
        except Exception as e:
            logger.error(f"Error summarizing: {e}")
            return text[:max_length]

    async def translate(self, text: str, target_language: str = "en") -> str:
        """
        Tradução de texto

        Args:
            text: Texto a traduzir
            target_language: Idioma alvo

        Returns:
            Texto traduzido
        """

        prompt = f"""
        Traduza o seguinte texto para {target_language}.

        Texto: "{text}"

        Retorne APENAS o texto traduzido, sem explicação.
        """

        try:
            response = await self.generate(prompt, max_tokens=500)
            return response.strip()
        except Exception as e:
            logger.error(f"Error translating: {e}")
            return text

    # ========================================================================
    # HELPER METHODS
    # ========================================================================

    async def generate_personalized_message(
        self,
        template: str,
        variables: Dict[str, str],
        personality: str = "professional",
        tone: str = "friendly",
    ) -> str:
        """
        Gera mensagem personalizada com variáveis

        Args:
            template: Template da mensagem com placeholders
                      Ex: "Olá {nome}, sua próxima {serviço} é em {data}"
            variables: Dict com valores para placeholders
            personality: Personalidade (professional, casual, luxury)
            tone: Tom (friendly, formal, urgent)

        Returns:
            Mensagem personalizada
        """

        # Substituir variáveis
        message = template
        for key, value in variables.items():
            message = message.replace(f"{{{key}}}", str(value))

        prompt = f"""
        Melhore a seguinte mensagem para um cliente de um salão de beleza.

        Mensagem original: "{message}"

        Personalidade: {personality}
        Tom: {tone}

        Requisitos:
        - Máximo 160 caracteres (cabe em SMS)
        - Inclua call-to-action clara
        - Mantenha o significado original
        - Sem emojis excessivos (máximo 1-2)

        Retorne APENAS a mensagem melhorada, sem explicação.
        """

        try:
            response = await self.generate(prompt, max_tokens=100, temperature=0.8)
            improved = response.strip()

            # Garantir que não exceda 160 caracteres
            if len(improved) > 160:
                improved = improved[:157] + "..."

            return improved

        except Exception as e:
            logger.error(f"Error personalizing message: {e}")
            return message[:160]
