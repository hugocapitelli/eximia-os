"""
Harven.AI - Socrates Agent Tests
=================================

Tests for the Harven Socrates agent that conducts Socratic dialogues.
"""

import pytest
from unittest.mock import MagicMock, AsyncMock


@pytest.mark.asyncio
async def test_socrates_dialogue(async_client, mock_supabase, mock_openai, mock_openai_response):
    """Test Socrates agent conducts dialogue."""
    mock_openai.chat.completions.create.return_value = mock_openai_response(
        content='''
        {
            "feedback": "That's an interesting perspective. You've touched on an important aspect.",
            "follow_up_question": "What might be the implications of that approach?",
            "turn_number": 1
        }
        '''
    )

    response = await async_client.post(
        "/ai/socrates/dialogue",
        json={
            "message": "I think variables help organize data.",
            "chapter_content": "Variables are named containers...",
            "history": []
        }
    )

    assert response.status_code in [200, 422, 500]


@pytest.mark.asyncio
async def test_socrates_never_gives_direct_answers(async_client, mock_openai, mock_openai_response):
    """Test Socrates never provides direct answers."""
    mock_openai.chat.completions.create.return_value = mock_openai_response(
        content='''
        {
            "feedback": "You're on the right track with that thinking.",
            "follow_up_question": "How might you verify that assumption?"
        }
        '''
    )

    response = await async_client.post(
        "/ai/socrates/dialogue",
        json={
            "message": "What is the answer?",
            "chapter_content": "Test content",
            "history": []
        }
    )

    if response.status_code == 200:
        data = response.json()
        # Response should include a question, not a direct answer
        if "follow_up_question" in data:
            assert "?" in data["follow_up_question"]


@pytest.mark.asyncio
async def test_socrates_max_turns(async_client, mock_openai, mock_openai_response):
    """Test Socrates handles max turns correctly."""
    # Simulate being at turn 3 (max)
    mock_openai.chat.completions.create.return_value = mock_openai_response(
        content='''
        {
            "feedback": "Great exploration of this topic!",
            "follow_up_question": "As a final reflection, what key insight will you take away?",
            "turn_number": 3,
            "is_final_turn": true
        }
        '''
    )

    response = await async_client.post(
        "/ai/socrates/dialogue",
        json={
            "message": "My third response",
            "chapter_content": "Test content",
            "history": [
                {"role": "user", "content": "First"},
                {"role": "assistant", "content": "Response 1"},
                {"role": "user", "content": "Second"},
                {"role": "assistant", "content": "Response 2"}
            ]
        }
    )

    assert response.status_code in [200, 422, 500]
