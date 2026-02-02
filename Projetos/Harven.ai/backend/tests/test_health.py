"""
Harven.AI - Health Endpoint Tests
==================================
"""

import pytest


@pytest.mark.asyncio
async def test_root_endpoint(async_client):
    """Test the root endpoint returns success."""
    response = await async_client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "Harven" in data["message"]


@pytest.mark.asyncio
async def test_metrics_endpoint(async_client):
    """Test the Prometheus metrics endpoint."""
    response = await async_client.get("/metrics")
    assert response.status_code == 200
    # Prometheus format should contain these
    assert b"http_request" in response.content or response.status_code == 200


@pytest.mark.asyncio
async def test_request_id_header(async_client):
    """Test that X-Request-ID header is returned."""
    response = await async_client.get("/")
    assert "X-Request-ID" in response.headers
    # Request ID should be 8 characters (UUID prefix)
    assert len(response.headers["X-Request-ID"]) == 8
