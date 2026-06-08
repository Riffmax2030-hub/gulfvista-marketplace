"""
Reelly API Client for gulfvista.properties.
Handles authentication, requests, and pagination with Reelly's property API.
"""

import httpx
import logging
from typing import Optional, Dict, List, Any
from datetime import datetime, timedelta
import config

logger = logging.getLogger(__name__)


class ReelyApiException(Exception):
    """Base exception for Reelly API errors."""
    pass


class ReelyAuthException(ReelyApiException):
    """Authentication error with Reelly API."""
    pass


class ReelyRateLimitException(ReelyApiException):
    """Rate limit exceeded on Reelly API."""
    pass


class ReelyConnectionException(ReelyApiException):
    """Connection error with Reelly API."""
    pass


class ReelyApiClient:
    """
    Client for Reelly API integration.
    Handles property data retrieval, pagination, and error handling.
    """

    def __init__(
        self,
        api_key: Optional[str] = None,
        base_url: Optional[str] = None,
        timeout: int = 30,
    ):
        """
        Initialize Reelly API client.

        Args:
            api_key: Reelly API key (defaults to config.REELLY_API_KEY)
            base_url: Base URL for Reelly API (defaults to config.REELLY_BASE_URL)
            timeout: Request timeout in seconds
        """
        self.api_key = api_key or config.REELLY_API_KEY
        self.base_url = base_url or config.REELLY_BASE_URL
        self.timeout = timeout
        self.session = None
        self.last_request_time = None
        self.rate_limit_reset = None

    async def __aenter__(self):
        """Async context manager entry."""
        self.session = httpx.AsyncClient(
            timeout=self.timeout,
            headers=self._get_headers(),
        )
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit."""
        if self.session:
            await self.session.aclose()

    def _get_headers(self) -> Dict[str, str]:
        """Get request headers with authentication."""
        # Reelly API v2.0 uses X-API-Key header (not Bearer token)
        return {
            "X-API-Key": self.api_key,
            "Content-Type": "application/json",
            "User-Agent": "gulfvista-properties/2.0",
        }

    async def _request(
        self,
        method: str,
        endpoint: str,
        **kwargs,
    ) -> Dict[str, Any]:
        """
        Make authenticated request to Reelly API with error handling.

        Args:
            method: HTTP method (GET, POST, etc.)
            endpoint: API endpoint path
            **kwargs: Additional arguments for httpx request

        Returns:
            Response data as dictionary

        Raises:
            ReelyAuthException: Authentication failed
            ReelyRateLimitException: Rate limit exceeded
            ReelyConnectionException: Connection error
            ReelyApiException: Other API errors
        """
        if not self.session:
            raise ReelyApiException("Client not initialized. Use async context manager.")

        url = f"{self.base_url}/{endpoint.lstrip('/')}"

        # Add headers if not present
        if "headers" not in kwargs:
            kwargs["headers"] = self._get_headers()

        try:
            logger.info(f"🔄 {method} {endpoint}")
            response = await self.session.request(method, url, **kwargs)

            # Track rate limit info
            if "X-RateLimit-Reset" in response.headers:
                self.rate_limit_reset = int(response.headers["X-RateLimit-Reset"])

            # Handle authentication errors
            if response.status_code == 401:
                logger.error("❌ Authentication failed with Reelly API")
                raise ReelyAuthException("Invalid or expired API key")

            # Handle rate limiting
            if response.status_code == 429:
                retry_after = int(response.headers.get("Retry-After", 60))
                logger.warning(f"⚠️  Rate limited. Retry after {retry_after}s")
                raise ReelyRateLimitException(f"Rate limited. Retry after {retry_after}s")

            # Handle server errors with retry hint
            if response.status_code >= 500:
                logger.error(f"❌ Server error: {response.status_code}")
                raise ReelyConnectionException(f"Server error: {response.status_code}")

            # Handle client errors
            if response.status_code >= 400:
                logger.error(f"❌ Client error: {response.status_code}")
                raise ReelyApiException(f"API error: {response.status_code}")

            # Parse response
            data = response.json()
            logger.info(f"✅ {method} {endpoint} - Success")

            return data

        except httpx.RequestError as e:
            logger.error(f"❌ Connection error: {e}")
            raise ReelyConnectionException(f"Connection failed: {str(e)}")
        except httpx.HTTPStatusError as e:
            logger.error(f"❌ HTTP error: {e}")
            raise ReelyApiException(f"HTTP error: {str(e)}")

    async def get_properties(
        self,
        limit: int = 100,
        offset: int = 0,
        filters: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Get properties from Reelly API.

        Args:
            limit: Number of properties to fetch (max 100)
            offset: Pagination offset
            filters: Optional filters (emirate, property_type, price_range, etc.)

        Returns:
            API response with properties list and pagination info
        """
        params = {
            "limit": min(limit, 100),
            "offset": offset,
        }

        # Add filters if provided
        if filters:
            params.update(filters)

        return await self._request("GET", "projects", params=params)

    async def get_property(self, property_id: str) -> Dict[str, Any]:
        """
        Get single property details from Reelly API.

        Args:
            property_id: Reelly property ID

        Returns:
            Property details
        """
        return await self._request("GET", f"projects/{property_id}")

    async def get_properties_paginated(
        self,
        limit: int = 100,
        max_results: Optional[int] = None,
        filters: Optional[Dict[str, Any]] = None,
    ) -> List[Dict[str, Any]]:
        """
        Get all properties with automatic pagination.

        Args:
            limit: Results per page
            max_results: Maximum total results to fetch (None = all)
            filters: Optional filters

        Yields:
            Property dictionaries
        """
        offset = 0
        total_fetched = 0

        while True:
            # Check if we've reached max results
            if max_results and total_fetched >= max_results:
                break

            try:
                # Adjust limit if approaching max_results
                current_limit = limit
                if max_results:
                    remaining = max_results - total_fetched
                    current_limit = min(limit, remaining)

                # Fetch page
                response = await self.get_properties(
                    limit=current_limit,
                    offset=offset,
                    filters=filters,
                )

                # Extract properties from Reelly API v2.0 response
                # API returns: {"results": [...], "count": 49}
                properties = response.get("results", response.get("data", response.get("properties", [])))
                if not properties:
                    break

                # Yield properties
                for prop in properties:
                    yield prop
                    total_fetched += 1

                # Check if there are more results
                # Reelly v2.0 uses "count" for total, not "total"
                total = response.get("count", response.get("total", 0))
                if offset + len(properties) >= total:
                    break

                # Prepare next page
                offset += len(properties)

            except ReelyRateLimitException:
                # If rate limited, stop gracefully
                logger.warning("Rate limit reached. Stopping pagination.")
                break
            except ReelyApiException as e:
                logger.error(f"Error fetching properties: {e}")
                break

    async def search_properties(
        self,
        query: str,
        limit: int = 50,
    ) -> List[Dict[str, Any]]:
        """
        Search properties on Reelly API.

        Args:
            query: Search query (location, type, etc.)
            limit: Max results

        Returns:
            List of matching properties
        """
        return await self._request(
            "GET",
            "properties/search",
            params={"q": query, "limit": limit},
        )

    async def get_property_updates(
        self,
        since: Optional[datetime] = None,
        limit: int = 100,
    ) -> Dict[str, Any]:
        """
        Get updated properties since last sync.

        Args:
            since: Only get properties updated after this time
            limit: Max results

        Returns:
            Updated properties list
        """
        params = {"limit": limit}

        if since:
            params["updated_since"] = since.isoformat()

        return await self._request("GET", "properties/updates", params=params)

    async def get_webhooks(self) -> List[Dict[str, Any]]:
        """
        Get configured webhooks from Reelly API.

        Returns:
            List of webhook configurations
        """
        response = await self._request("GET", "webhooks")
        return response.get("data", [])

    async def create_webhook(
        self,
        url: str,
        events: List[str],
    ) -> Dict[str, Any]:
        """
        Create webhook for Reelly events.

        Args:
            url: Webhook URL to send events to
            events: List of events to subscribe to

        Returns:
            Created webhook details
        """
        payload = {
            "url": url,
            "events": events,
        }

        return await self._request("POST", "webhooks", json=payload)

    async def verify_connection(self) -> bool:
        """
        Test connection to Reelly API.

        Returns:
            True if connection successful, False otherwise
        """
        try:
            # Test by fetching one project (lightweight test)
            await self._request("GET", "projects", params={"limit": 1})
            logger.info("✅ Reelly API connection verified")
            return True
        except Exception as e:
            logger.error(f"❌ Reelly API connection failed: {e}")
            return False

    async def get_rate_limit_info(self) -> Dict[str, Any]:
        """
        Get current rate limit information.

        Returns:
            Rate limit details
        """
        return {
            "last_request_time": self.last_request_time,
            "rate_limit_reset": self.rate_limit_reset,
        }


# Synchronous wrapper for compatibility
class ReelyApiClientSync:
    """Synchronous wrapper around async ReelyApiClient."""

    def __init__(
        self,
        api_key: Optional[str] = None,
        base_url: Optional[str] = None,
    ):
        self.api_key = api_key or config.REELLY_API_KEY
        self.base_url = base_url or config.REELLY_BASE_URL

    def verify_connection(self) -> bool:
        """Test Reelly API connection (synchronous)."""
        import asyncio

        async def async_verify():
            async with ReelyApiClient(self.api_key, self.base_url) as client:
                return await client.verify_connection()

        try:
            return asyncio.run(async_verify())
        except Exception as e:
            logger.error(f"Connection test failed: {e}")
            return False
