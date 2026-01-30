"""
Harven.AI - Pagination Tests
============================

Tests for pagination utilities.
"""

import pytest
from app.utils.pagination import (
    PaginationParams,
    PaginatedResponse,
    create_paginated_response,
    encode_cursor,
    decode_cursor,
    get_pagination_params,
)


class TestPaginationParams:
    """Tests for PaginationParams."""

    def test_default_values(self):
        """Test default pagination values."""
        params = PaginationParams()
        assert params.page == 1
        assert params.page_size == 20
        assert params.sort_order == "desc"

    def test_offset_calculation(self):
        """Test offset is calculated correctly."""
        params = PaginationParams(page=3, page_size=10)
        assert params.offset == 20  # (3-1) * 10

    def test_limit_equals_page_size(self):
        """Test limit equals page_size."""
        params = PaginationParams(page_size=50)
        assert params.limit == 50

    def test_page_size_bounds(self):
        """Test page_size has bounds."""
        # Min bound
        with pytest.raises(ValueError):
            PaginationParams(page_size=0)

        # Max bound
        with pytest.raises(ValueError):
            PaginationParams(page_size=101)


class TestPaginatedResponse:
    """Tests for PaginatedResponse."""

    def test_create_paginated_response(self):
        """Test creating paginated response."""
        items = [{"id": i} for i in range(10)]
        params = PaginationParams(page=1, page_size=10)

        response = create_paginated_response(
            items=items,
            total=25,
            pagination=params
        )

        assert response.items == items
        assert response.total == 25
        assert response.page == 1
        assert response.page_size == 10
        assert response.total_pages == 3
        assert response.has_next is True
        assert response.has_previous is False

    def test_last_page_has_no_next(self):
        """Test last page has no next."""
        items = [{"id": 1}]
        params = PaginationParams(page=3, page_size=10)

        response = create_paginated_response(
            items=items,
            total=25,
            pagination=params
        )

        assert response.has_next is False
        assert response.has_previous is True

    def test_single_page_no_navigation(self):
        """Test single page has no navigation."""
        items = [{"id": i} for i in range(5)]
        params = PaginationParams(page=1, page_size=10)

        response = create_paginated_response(
            items=items,
            total=5,
            pagination=params
        )

        assert response.total_pages == 1
        assert response.has_next is False
        assert response.has_previous is False


class TestCursorPagination:
    """Tests for cursor-based pagination."""

    def test_encode_decode_cursor(self):
        """Test cursor encoding and decoding."""
        original = "test-cursor-value"
        encoded = encode_cursor(original)
        decoded = decode_cursor(encoded)

        assert decoded == original

    def test_decode_invalid_cursor(self):
        """Test decoding invalid cursor returns None."""
        result = decode_cursor("invalid-not-base64")
        assert result is None

    def test_cursor_with_complex_value(self):
        """Test cursor with complex values."""
        original = {"id": "123", "timestamp": 1234567890}
        encoded = encode_cursor(original)
        decoded = decode_cursor(encoded)

        assert decoded == original


class TestGetPaginationParams:
    """Tests for get_pagination_params dependency."""

    def test_default_params(self):
        """Test default params are returned."""
        params = get_pagination_params()
        assert params.page == 1
        assert params.page_size == 20

    def test_custom_params(self):
        """Test custom params are passed through."""
        params = get_pagination_params(
            page=5,
            page_size=50,
            sort_by="created_at",
            sort_order="asc"
        )

        assert params.page == 5
        assert params.page_size == 50
        assert params.sort_by == "created_at"
        assert params.sort_order == "asc"
