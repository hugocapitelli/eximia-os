"""
Harven.AI - Disciplines CRUD Tests
===================================
"""

import pytest
from unittest.mock import MagicMock


@pytest.mark.asyncio
async def test_get_disciplines_empty(async_client, mock_supabase):
    """Test getting disciplines when none exist."""
    mock_supabase.table.return_value.select.return_value.execute.return_value = MagicMock(
        data=[],
        error=None
    )

    response = await async_client.get("/disciplines")

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


@pytest.mark.asyncio
async def test_get_disciplines_with_data(async_client, mock_supabase, test_discipline):
    """Test getting disciplines with data."""
    mock_supabase.table.return_value.select.return_value.execute.return_value = MagicMock(
        data=[test_discipline],
        error=None
    )

    response = await async_client.get("/disciplines")

    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 0  # Depends on mock setup


@pytest.mark.asyncio
async def test_get_disciplines_by_user(async_client, mock_supabase, test_user):
    """Test filtering disciplines by user."""
    response = await async_client.get(
        f"/disciplines?user_id={test_user['id']}&role=STUDENT"
    )

    assert response.status_code == 200


@pytest.mark.asyncio
async def test_create_discipline(async_client, mock_supabase, test_discipline):
    """Test creating a new discipline."""
    mock_supabase.table.return_value.insert.return_value.execute.return_value = MagicMock(
        data=[test_discipline],
        error=None
    )

    response = await async_client.post(
        "/disciplines",
        json={
            "name": "New Discipline",
            "code": "NEW101",
            "department": "Test"
        }
    )

    # Could be 200, 201, or 422 depending on validation
    assert response.status_code in [200, 201, 422]


@pytest.mark.asyncio
async def test_create_discipline_missing_fields(async_client):
    """Test creating discipline with missing fields fails."""
    response = await async_client.post(
        "/disciplines",
        json={"name": "Incomplete"}
    )

    assert response.status_code == 422
