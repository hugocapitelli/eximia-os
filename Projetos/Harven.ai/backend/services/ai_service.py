"""
Harven AI Service - Integração com OpenAI
Gerencia chamadas aos 6 agentes de IA da plataforma:
- Creator: Gera perguntas socráticas
- Socrates: Conduz diálogo socrático
- Analyst: Detecta conteúdo de IA
- Editor: Refina respostas do tutor
- Tester: Valida qualidade das respostas
- Organizer: Gerencia sessões e exportações
"""

import os
import json
import time
import re
from datetime import datetime
from typing import Optional, Dict, Any, List
from openai import OpenAI
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

# Importar prompts dos agentes
from agents.harven_creator import SYSTEM_PROMPT as CREATOR_PROMPT
from agents.harven_socrates import SYSTEM_PROMPT as SOCRATES_PROMPT
from agents.harven_analyst import SYSTEM_PROMPT as ANALYST_PROMPT
from agents.harven_editor import SYSTEM_PROMPT as EDITOR_PROMPT
from agents.harven_tester import SYSTEM_PROMPT as TESTER_PROMPT
from agents.harven_organizer import SYSTEM_PROMPT as ORGANIZER_PROMPT

# Configuração
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
DEFAULT_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
FALLBACK_MODEL = "gpt-3.5-turbo"

# Inicializar cliente OpenAI
client = None
if OPENAI_API_KEY:
    client = OpenAI(api_key=OPENAI_API_KEY)
    print("✓ OpenAI client initialized")
else:
    print("⚠ OPENAI_API_KEY not found - AI features disabled")


class AIServiceError(Exception):
    """Exceção customizada para erros do serviço de IA"""
    pass


def get_client() -> OpenAI:
    """Retorna cliente OpenAI ou levanta erro"""
    if not client:
        raise AIServiceError("OpenAI API key não configurada. Configure OPENAI_API_KEY no .env")
    return client


# ============================================
# CREATOR - Geração de Perguntas Socráticas
# ============================================

async def generate_questions(
    chapter_content: str,
    chapter_title: str = "",
    learning_objective: str = "",
    difficulty: str = "intermediario",
    max_questions: int = 3
) -> Dict[str, Any]:
    """
    Gera perguntas socráticas usando o Harven_Creator
    """
    openai_client = get_client()

    user_message = f"""Analise o seguinte conteúdo e gere {max_questions} perguntas socráticas:

**Título do Capítulo:** {chapter_title or "Não informado"}

**Objetivo de Aprendizagem:** {learning_objective or "Não especificado"}

**Dificuldade:** {difficulty}

**Conteúdo:**
{chapter_content}

Retorne um JSON válido conforme especificado no prompt."""

    start_time = time.time()

    try:
        response = openai_client.chat.completions.create(
            model=DEFAULT_MODEL,
            messages=[
                {"role": "system", "content": CREATOR_PROMPT},
                {"role": "user", "content": user_message}
            ],
            temperature=0.7,
            max_tokens=2000,
            response_format={"type": "json_object"}
        )

        processing_time = int((time.time() - start_time) * 1000)
        content = response.choices[0].message.content
        result = json.loads(content)

        if "metadata" not in result:
            result["metadata"] = {}
        result["metadata"]["processing_time_ms"] = processing_time
        result["metadata"]["model_used"] = DEFAULT_MODEL
        result["metadata"]["tokens_used"] = {
            "prompt": response.usage.prompt_tokens,
            "completion": response.usage.completion_tokens,
            "total": response.usage.total_tokens
        }

        return result

    except json.JSONDecodeError as e:
        raise AIServiceError(f"Erro ao parsear resposta da IA: {e}")
    except Exception as e:
        raise AIServiceError(f"Erro na chamada OpenAI: {e}")


# ============================================
# SOCRATES - Diálogo Socrático
# ============================================

async def socratic_dialogue(
    student_message: str,
    chapter_content: str,
    initial_question: Dict[str, str],
    conversation_history: List[Dict[str, str]] = None,
    interactions_remaining: int = 3,
    session_id: str = None,
    chapter_id: str = None
) -> Dict[str, Any]:
    """
    Conduz diálogo socrático usando o Harven_Socrates
    """
    openai_client = get_client()

    context = f"""**Contexto da Sessão:**
- Capítulo ID: {chapter_id or "N/A"}
- Sessão ID: {session_id or "N/A"}
- Interações restantes: {interactions_remaining}
- É última interação: {"Sim" if interactions_remaining <= 1 else "Não"}

**Conteúdo do Capítulo:**
{chapter_content[:3000]}...

**Pergunta Inicial da Sessão:**
{initial_question.get('text', 'N/A')}
"""

    messages = [{"role": "system", "content": SOCRATES_PROMPT}]
    messages.append({"role": "user", "content": context})
    messages.append({"role": "assistant", "content": "Entendido. Estou pronto para conduzir o diálogo socrático com base neste contexto."})

    if conversation_history:
        for msg in conversation_history:
            role = "user" if msg.get("role") == "student" else "assistant"
            messages.append({"role": role, "content": msg.get("content", "")})

    messages.append({"role": "user", "content": student_message})

    start_time = time.time()

    try:
        response = openai_client.chat.completions.create(
            model=DEFAULT_MODEL,
            messages=messages,
            temperature=0.7,
            max_tokens=500
        )

        processing_time = int((time.time() - start_time) * 1000)
        content = response.choices[0].message.content
        has_question = content.strip().endswith("?")
        is_final = interactions_remaining <= 1

        return {
            "response": {
                "content": content,
                "has_question": has_question,
                "is_final_interaction": is_final
            },
            "session_status": {
                "interactions_remaining": max(0, interactions_remaining - 1),
                "should_finalize": is_final
            },
            "analytics": {
                "response_length": len(content),
                "processing_time_ms": processing_time,
                "model_used": DEFAULT_MODEL,
                "tokens_used": {
                    "prompt": response.usage.prompt_tokens,
                    "completion": response.usage.completion_tokens,
                    "total": response.usage.total_tokens
                }
            }
        }

    except Exception as e:
        raise AIServiceError(f"Erro na chamada OpenAI: {e}")


# ============================================
# ANALYST - Detecção de Conteúdo IA
# ============================================

async def detect_ai_content(
    student_message: str,
    context: Dict[str, Any] = None,
    interaction_metadata: Dict[str, Any] = None
) -> Dict[str, Any]:
    """
    Detecta se o texto foi gerado por IA usando o Harven_Analyst
    """
    openai_client = get_client()

    user_message = f"""Analise a seguinte mensagem de um aluno e determine a probabilidade de ter sido gerada por IA:

**Mensagem do Aluno:**
{student_message}

**Contexto:**
{json.dumps(context or {}, indent=2, ensure_ascii=False)}

**Metadados da Interação:**
{json.dumps(interaction_metadata or {}, indent=2, ensure_ascii=False)}

Retorne um JSON válido com a análise conforme especificado no prompt."""

    start_time = time.time()

    try:
        response = openai_client.chat.completions.create(
            model=DEFAULT_MODEL,
            messages=[
                {"role": "system", "content": ANALYST_PROMPT},
                {"role": "user", "content": user_message}
            ],
            temperature=0.3,  # Mais determinístico para análise
            max_tokens=1500,
            response_format={"type": "json_object"}
        )

        processing_time = int((time.time() - start_time) * 1000)
        content = response.choices[0].message.content
        result = json.loads(content)

        # Adicionar metadados de processamento
        result["analysis_id"] = f"analysis_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        result["timestamp"] = datetime.now().isoformat()
        result["processing_time_ms"] = processing_time

        return result

    except json.JSONDecodeError as e:
        # Fallback para análise heurística básica
        return _heuristic_ai_detection(student_message)
    except Exception as e:
        raise AIServiceError(f"Erro na chamada OpenAI: {e}")


def _heuristic_ai_detection(text: str) -> Dict[str, Any]:
    """Fallback: detecção heurística quando OpenAI falha"""
    indicators = []
    score = 0.3  # Base score

    # Frases típicas de LLMs
    ai_phrases = [
        "é importante ressaltar", "nesse sentido", "diante do exposto",
        "cabe destacar", "vale mencionar", "em primeiro lugar",
        "portanto, conclui-se", "dessa forma", "assim sendo",
        "por conseguinte", "ademais", "outrossim"
    ]

    text_lower = text.lower()
    for phrase in ai_phrases:
        if phrase in text_lower:
            indicators.append({
                "type": "ai_phrase",
                "description": f"Detectado: '{phrase}'",
                "weight": 0.15
            })
            score += 0.15

    # Indicadores humanos
    human_indicators = ["tipo", "né", "bom", "acho que", "sei lá", "tbm", "vc"]
    for indicator in human_indicators:
        if indicator in text_lower:
            score *= 0.7

    # Erros de digitação sugerem humano
    if re.search(r'[a-z]{2,}\s[a-z]{2,}', text) and not text.istitle():
        score *= 0.8

    # Ajustar por tamanho
    confidence = "medium"
    if len(text) < 50:
        confidence = "low"
        score *= 0.5
    elif len(text) > 200:
        confidence = "high"

    # Classificar
    if score <= 0.50:
        verdict = "likely_human"
    elif score <= 0.70:
        verdict = "uncertain"
    else:
        verdict = "likely_ai"

    return {
        "analysis_id": f"heuristic_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
        "timestamp": datetime.now().isoformat(),
        "ai_detection": {
            "probability": min(score, 1.0),
            "confidence": confidence,
            "verdict": verdict,
            "indicators": indicators,
            "flag": "alta_probabilidade_texto_IA" if score > 0.70 else None
        },
        "metrics": {
            "text": {
                "message_length_chars": len(text),
                "message_length_words": len(text.split()),
                "sentence_count": text.count('.') + text.count('!') + text.count('?'),
                "has_question": '?' in text
            }
        },
        "flags": ["alta_probabilidade_texto_IA"] if score > 0.70 else [],
        "observations": ["Análise heurística básica - OpenAI indisponível"],
        "recommendation": "Análise heurística. Considere revisar manualmente."
    }


# ============================================
# EDITOR - Refinamento de Respostas
# ============================================

async def edit_response(
    orientador_response: str,
    context: Dict[str, Any] = None
) -> Dict[str, Any]:
    """
    Refina resposta do tutor usando o Harven_Editor
    """
    openai_client = get_client()

    user_message = f"""Edite a seguinte resposta do ORIENTADOR para torná-la mais natural:

**Resposta do Orientador:**
{orientador_response}

**Contexto:**
{json.dumps(context or {}, indent=2, ensure_ascii=False)}

Retorne APENAS o texto editado (2 parágrafos), sem JSON ou metadados."""

    start_time = time.time()

    try:
        response = openai_client.chat.completions.create(
            model=DEFAULT_MODEL,
            messages=[
                {"role": "system", "content": EDITOR_PROMPT},
                {"role": "user", "content": user_message}
            ],
            temperature=0.5,
            max_tokens=400
        )

        processing_time = int((time.time() - start_time) * 1000)
        edited_text = response.choices[0].message.content.strip()

        # Contar parágrafos e palavras
        paragraphs = [p.strip() for p in edited_text.split('\n\n') if p.strip()]
        word_count = len(edited_text.split())

        return {
            "edited_text": edited_text,
            "word_count": word_count,
            "paragraph_count": len(paragraphs),
            "ends_with_question": edited_text.endswith('?'),
            "processing_time_ms": processing_time,
            "model_used": DEFAULT_MODEL,
            "tokens_used": {
                "prompt": response.usage.prompt_tokens,
                "completion": response.usage.completion_tokens,
                "total": response.usage.total_tokens
            }
        }

    except Exception as e:
        raise AIServiceError(f"Erro na chamada OpenAI: {e}")


# ============================================
# TESTER - Validação de Qualidade
# ============================================

async def validate_response(
    edited_response: str,
    context: Dict[str, Any] = None
) -> Dict[str, Any]:
    """
    Valida qualidade da resposta usando o Harven_Tester
    """
    openai_client = get_client()

    user_message = f"""Valide a seguinte resposta editada contra os 6 critérios de qualidade:

**Resposta Editada:**
{edited_response}

**Contexto:**
{json.dumps(context or {}, indent=2, ensure_ascii=False)}

Retorne um JSON válido com o resultado da validação conforme especificado no prompt."""

    start_time = time.time()

    try:
        response = openai_client.chat.completions.create(
            model=DEFAULT_MODEL,
            messages=[
                {"role": "system", "content": TESTER_PROMPT},
                {"role": "user", "content": user_message}
            ],
            temperature=0.3,
            max_tokens=1500,
            response_format={"type": "json_object"}
        )

        processing_time = int((time.time() - start_time) * 1000)
        content = response.choices[0].message.content
        result = json.loads(content)

        result["processing_time_ms"] = processing_time
        result["model_used"] = DEFAULT_MODEL

        return result

    except json.JSONDecodeError as e:
        raise AIServiceError(f"Erro ao parsear resposta da IA: {e}")
    except Exception as e:
        raise AIServiceError(f"Erro na chamada OpenAI: {e}")


# ============================================
# ORGANIZER - Gerenciamento de Sessões
# ============================================

async def organize_session(
    action: str,
    payload: Dict[str, Any],
    metadata: Dict[str, Any] = None
) -> Dict[str, Any]:
    """
    Gerencia sessões e exportações usando o Harven_Organizer
    Nota: A maioria das operações do Organizer são feitas diretamente no banco,
    mas esta função pode ser usada para validação de payloads e formatação.
    """
    start_time = time.time()

    # Ações que não precisam de LLM
    if action == "get_session_status":
        return {
            "success": True,
            "action": action,
            "result": payload,
            "metadata": {
                "timestamp": datetime.now().isoformat(),
                "duration_ms": int((time.time() - start_time) * 1000)
            }
        }

    # Validar payload de exportação usando LLM (opcional)
    if action == "validate_export_payload":
        openai_client = get_client()

        user_message = f"""Valide o seguinte payload de exportação para o Moodle:

{json.dumps(payload, indent=2, ensure_ascii=False)}

Verifique se todos os campos obrigatórios estão presentes e se o formato está correto.
Retorne um JSON com: valid (boolean), errors (array de strings), warnings (array de strings)."""

        try:
            response = openai_client.chat.completions.create(
                model=DEFAULT_MODEL,
                messages=[
                    {"role": "system", "content": ORGANIZER_PROMPT},
                    {"role": "user", "content": user_message}
                ],
                temperature=0.1,
                max_tokens=500,
                response_format={"type": "json_object"}
            )

            result = json.loads(response.choices[0].message.content)
            return {
                "success": result.get("valid", False),
                "action": action,
                "result": result,
                "metadata": {
                    "timestamp": datetime.now().isoformat(),
                    "duration_ms": int((time.time() - start_time) * 1000)
                }
            }

        except Exception as e:
            raise AIServiceError(f"Erro na validação: {e}")

    # Para outras ações, retornar estrutura padrão
    return {
        "success": True,
        "action": action,
        "result": payload,
        "metadata": {
            "timestamp": datetime.now().isoformat(),
            "duration_ms": int((time.time() - start_time) * 1000)
        }
    }


def prepare_moodle_export(session_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Prepara payload de exportação para o Moodle (sem LLM)
    """
    return {
        "session_id": session_data.get("session_id"),
        "student": session_data.get("student", {}),
        "chapter": session_data.get("chapter", {}),
        "question": session_data.get("question", {}),
        "conversation": session_data.get("conversation", []),
        "metrics": {
            "total_words_student": sum(
                len(turn.get("student_message", {}).get("content", "").split())
                for turn in session_data.get("conversation", [])
            ),
            "avg_ai_probability": sum(
                turn.get("student_message", {}).get("ai_probability", 0)
                for turn in session_data.get("conversation", [])
            ) / max(len(session_data.get("conversation", [])), 1),
            "flags_triggered": list(set(
                flag
                for turn in session_data.get("conversation", [])
                for flag in turn.get("student_message", {}).get("flags", [])
            ))
        },
        "session_info": {
            "started_at": session_data.get("started_at"),
            "completed_at": session_data.get("completed_at"),
            "duration_seconds": session_data.get("duration_seconds", 0)
        }
    }


# ============================================
# FUNÇÕES DE UTILIDADE
# ============================================

def is_ai_enabled() -> bool:
    """Verifica se o serviço de IA está habilitado"""
    return client is not None


def get_supported_agents() -> List[str]:
    """Retorna lista de agentes suportados"""
    return ["creator", "socrates", "analyst", "editor", "tester", "organizer"]


def estimate_cost(prompt_tokens: int, completion_tokens: int, model: str = DEFAULT_MODEL) -> float:
    """Estima custo da chamada em USD"""
    pricing = {
        "gpt-4o-mini": {"input": 0.00015, "output": 0.0006},
        "gpt-4o": {"input": 0.005, "output": 0.015},
        "gpt-4-turbo": {"input": 0.01, "output": 0.03},
        "gpt-3.5-turbo": {"input": 0.0005, "output": 0.0015}
    }

    if model not in pricing:
        model = "gpt-4o-mini"

    cost = (prompt_tokens / 1000 * pricing[model]["input"]) + \
           (completion_tokens / 1000 * pricing[model]["output"])

    return round(cost, 6)
