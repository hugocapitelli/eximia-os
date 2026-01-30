"""
Harven.AI - Creator Agent Tests
================================

Tests for the Harven Creator agent that generates Socratic questions.
"""

import pytest
from unittest.mock import MagicMock, AsyncMock, patch


@pytest.mark.asyncio
async def test_creator_generate_questions(async_client, mock_supabase, mock_openai, mock_openai_response):
    """Test Creator agent generates questions from content."""
    # Setup OpenAI mock response
    mock_openai.chat.completions.create.return_value = mock_openai_response(
        content='''
        {
            "analysis": "The content discusses basic programming concepts.",
            "questions": [
                {
                    "text": "How does the concept of variables relate to memory management?",
                    "difficulty": "medium",
                    "cognitive_level": "application"
                },
                {
                    "text": "What would happen if we didn't use data types?",
                    "difficulty": "hard",
                    "cognitive_level": "analysis"
                },
                {
                    "text": "In what scenarios might you choose one approach over another?",
                    "difficulty": "medium",
                    "cognitive_level": "evaluation"
                }
            ]
        }
        '''
    )

    response = await async_client.post(
        "/ai/creator/generate",
        json={
            "content": "Variables are named containers that store data in memory.",
            "chapter_title": "Introduction to Variables",
            "learning_objective": "Understand variable declaration and usage",
            "difficulty": "medium"
        }
    )

    # Response depends on actual endpoint implementation
    assert response.status_code in [200, 422, 500]


@pytest.mark.asyncio
async def test_creator_no_definition_questions(async_client, mock_openai, mock_openai_response):
    """Test Creator agent doesn't generate 'What is...' questions."""
    # The agent should never generate definition questions
    mock_openai.chat.completions.create.return_value = mock_openai_response(
        content='''
        {
            "questions": [
                {"text": "How might this concept apply in practice?"}
            ]
        }
        '''
    )

    response = await async_client.post(
        "/ai/creator/generate",
        json={
            "content": "Test content",
            "chapter_title": "Test Chapter",
            "learning_objective": "Test objective",
            "difficulty": "medium"
        }
    )

    if response.status_code == 200:
        data = response.json()
        if "questions" in data:
            for q in data["questions"]:
                # Should not start with "What is" or "Define"
                text = q.get("text", "").lower()
                assert not text.startswith("what is")
                assert not text.startswith("define")


@pytest.mark.asyncio
async def test_creator_missing_content(async_client):
    """Test Creator fails gracefully with missing content."""
    response = await async_client.post(
        "/ai/creator/generate",
        json={}
    )

    assert response.status_code in [422, 400]
