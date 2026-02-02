"""
Harven.AI - Test Configuration and Fixtures
============================================

This module provides pytest fixtures for testing the Harven.AI backend,
including mocks for Supabase and OpenAI services.
"""

import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from httpx import AsyncClient, ASGITransport
import os

# Set test environment variables before importing the app
os.environ["ENVIRONMENT"] = "test"
os.environ["SUPABASE_URL"] = "https://test.supabase.co"
os.environ["SUPABASE_KEY"] = "test-key"
os.environ["OPENAI_API_KEY"] = "sk-test-key"
os.environ["JWT_SECRET"] = "test-jwt-secret"


@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    import asyncio
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
def mock_supabase():
    """
    Mock Supabase client for testing.

    Usage:
        def test_something(mock_supabase):
            mock_supabase.table.return_value.select.return_value.execute.return_value = {
                "data": [{"id": "1", "name": "Test"}],
                "error": None
            }
    """
    with patch("main.supabase") as mock:
        # Setup default return values
        mock_table = MagicMock()
        mock.table.return_value = mock_table

        # Chain methods
        mock_table.select.return_value = mock_table
        mock_table.insert.return_value = mock_table
        mock_table.update.return_value = mock_table
        mock_table.delete.return_value = mock_table
        mock_table.eq.return_value = mock_table
        mock_table.neq.return_value = mock_table
        mock_table.single.return_value = mock_table
        mock_table.order.return_value = mock_table
        mock_table.limit.return_value = mock_table
        mock_table.range.return_value = mock_table

        # Default execute response
        mock_table.execute.return_value = MagicMock(
            data=[],
            error=None,
            count=0
        )

        yield mock


@pytest.fixture
def mock_openai():
    """
    Mock OpenAI client for testing AI agents.

    Usage:
        def test_ai_agent(mock_openai):
            mock_openai.chat.completions.create.return_value = MagicMock(
                choices=[MagicMock(message=MagicMock(content="Response"))]
            )
    """
    with patch("services.ai_service.openai") as mock:
        # Setup default completion response
        mock_completion = MagicMock()
        mock_completion.choices = [
            MagicMock(
                message=MagicMock(
                    content='{"analysis": "Test analysis", "questions": []}'
                )
            )
        ]
        mock.chat.completions.create = AsyncMock(return_value=mock_completion)

        yield mock


@pytest.fixture
def mock_openai_response():
    """
    Factory fixture for creating custom OpenAI responses.

    Usage:
        def test_creator_agent(mock_openai, mock_openai_response):
            mock_openai.chat.completions.create.return_value = mock_openai_response(
                content='{"questions": [{"text": "Test?"}]}'
            )
    """
    def _create_response(content: str):
        response = MagicMock()
        response.choices = [
            MagicMock(
                message=MagicMock(content=content)
            )
        ]
        return response

    return _create_response


@pytest.fixture
async def async_client(mock_supabase):
    """
    Async HTTP client for testing FastAPI endpoints.

    Usage:
        async def test_endpoint(async_client):
            response = await async_client.get("/")
            assert response.status_code == 200
    """
    from main import app

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client


@pytest.fixture
def test_user():
    """Sample user data for testing."""
    return {
        "id": "test-user-id",
        "email": "test@harven.ai",
        "ra": "12345",
        "role": "STUDENT",
        "name": "Test User",
        "created_at": "2024-01-01T00:00:00Z"
    }


@pytest.fixture
def test_discipline():
    """Sample discipline data for testing."""
    return {
        "id": "test-discipline-id",
        "name": "Test Discipline",
        "code": "TEST101",
        "department": "Test Department",
        "created_at": "2024-01-01T00:00:00Z"
    }


@pytest.fixture
def test_course():
    """Sample course data for testing."""
    return {
        "id": "test-course-id",
        "title": "Test Course",
        "description": "A test course",
        "discipline_id": "test-discipline-id",
        "created_at": "2024-01-01T00:00:00Z"
    }


@pytest.fixture
def auth_headers(test_user):
    """Generate authentication headers for testing."""
    return {
        "Authorization": f"Bearer test-token",
        "X-User-ID": test_user["id"],
        "X-User-Role": test_user["role"]
    }


# ============================================
# TEST MARKERS
# ============================================
def pytest_configure(config):
    """Register custom markers."""
    config.addinivalue_line(
        "markers", "slow: marks tests as slow (deselect with '-m \"not slow\"')"
    )
    config.addinivalue_line(
        "markers", "integration: marks tests as integration tests"
    )
    config.addinivalue_line(
        "markers", "unit: marks tests as unit tests"
    )
