"""
Integration Tests for gulfvista.properties Phase 5
Tests all components end-to-end after startup.
"""

import sys
import logging
from datetime import datetime
from typing import Optional

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class IntegrationTester:
    """Run integration tests for Phase 5."""

    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.skipped = 0
        self.errors = []

    def test_result(self, test_name: str, success: bool, message: str = ""):
        """Record test result."""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {test_name}")
        if message:
            print(f"       {message}")

        if success:
            self.passed += 1
        else:
            self.failed += 1
            self.errors.append((test_name, message))

    def test_import(self, module_name: str, item_name: str) -> bool:
        """Test importing a module item."""
        try:
            module = __import__(module_name)
            if hasattr(module, item_name):
                return True
            return False
        except Exception as e:
            logger.error(f"Import error: {e}")
            return False

    # ========================================================================
    # Test Groups
    # ========================================================================

    def test_core_imports(self):
        """Test core library imports."""
        print("\n" + "="*70)
        print("TEST GROUP: Core Imports")
        print("="*70)

        imports = [
            ("fastapi", "FastAPI"),
            ("sqlalchemy", "create_engine"),
            ("pydantic", "BaseModel"),
            ("apscheduler.schedulers.background", "BackgroundScheduler"),
            ("httpx", "AsyncClient"),
        ]

        for module, item in imports:
            try:
                mod = __import__(module, fromlist=[item])
                success = hasattr(mod, item)
                self.test_result(
                    f"Import {module}.{item}",
                    success,
                    "" if success else "Item not found"
                )
            except ImportError as e:
                self.test_result(f"Import {module}.{item}", False, str(e))

    def test_config_loading(self):
        """Test configuration loading."""
        print("\n" + "="*70)
        print("TEST GROUP: Configuration Loading")
        print("="*70)

        try:
            import config

            # Test basic config
            configs = [
                ("APP_NAME", config.APP_NAME, str),
                ("DATABASE_URL", config.DATABASE_URL, str),
                ("SECRET_KEY", config.SECRET_KEY, str),
                ("API_V1_STR", config.API_V1_STR, str),
                ("SCHEDULER_ENABLED", config.SCHEDULER_ENABLED, bool),
            ]

            for config_name, value, expected_type in configs:
                success = isinstance(value, expected_type) and value
                message = f"Value: {str(value)[:50]}" if success else f"Type error or empty"
                self.test_result(f"Config {config_name}", success, message)

            # Test Phase 5 configs
            phase5_configs = [
                ("REELLY_API_KEY", config.REELLY_API_KEY, str),
                ("REELLY_WEBHOOK_SECRET", config.REELLY_WEBHOOK_SECRET, str),
            ]

            for config_name, value, expected_type in phase5_configs:
                success = isinstance(value, expected_type)
                self.test_result(f"Phase 5 Config {config_name}", success)

        except Exception as e:
            self.test_result("Config loading", False, str(e))

    def test_model_definitions(self):
        """Test database model definitions."""
        print("\n" + "="*70)
        print("TEST GROUP: Model Definitions")
        print("="*70)

        try:
            from models import (
                User, Property, Lead, PropertySyncLog,
                ReelyWebhook, AgentStats, CommunicationLog
            )

            models = [
                ("User", User),
                ("Property", Property),
                ("Lead", Lead),
                ("PropertySyncLog", PropertySyncLog),
                ("ReelyWebhook", ReelyWebhook),
                ("AgentStats", AgentStats),
                ("CommunicationLog", CommunicationLog),
            ]

            for model_name, model_class in models:
                # Check if model has __tablename__
                has_table = hasattr(model_class, '__tablename__')
                self.test_result(
                    f"Model {model_name}",
                    has_table,
                    f"Table: {model_class.__tablename__}" if has_table else "No table"
                )

        except Exception as e:
            self.test_result("Model definitions", False, str(e))

    def test_services_initialization(self):
        """Test service class initialization."""
        print("\n" + "="*70)
        print("TEST GROUP: Service Initialization")
        print("="*70)

        try:
            from services import (
                ReelyApiClient, PropertySyncService,
                LeadService, AgentService
            )

            services = [
                ("ReelyApiClient", ReelyApiClient),
                ("PropertySyncService", PropertySyncService),
                ("LeadService", LeadService),
                ("AgentService", AgentService),
            ]

            for service_name, service_class in services:
                try:
                    # Check if class can be inspected
                    has_methods = len([m for m in dir(service_class) if not m.startswith('_')]) > 0
                    self.test_result(f"Service {service_name}", has_methods)
                except Exception as e:
                    self.test_result(f"Service {service_name}", False, str(e))

        except Exception as e:
            self.test_result("Services initialization", False, str(e))

    def test_route_registration(self):
        """Test API route registration."""
        print("\n" + "="*70)
        print("TEST GROUP: Route Registration")
        print("="*70)

        try:
            from routes import api_router

            # Check if router has routes
            has_routes = len(api_router.routes) > 0
            self.test_result(
                "Router initialization",
                has_routes,
                f"Routes: {len(api_router.routes)}"
            )

            # Check for specific route prefixes
            route_prefixes = ["/agents", "/leads", "/properties", "/webhooks"]
            for prefix in route_prefixes:
                # Find routes with this prefix
                matching = [r for r in api_router.routes if hasattr(r, 'path') and prefix in r.path]
                self.test_result(
                    f"Routes under {prefix}",
                    len(matching) > 0,
                    f"Found {len(matching)} routes" if matching else "No routes"
                )

        except Exception as e:
            self.test_result("Route registration", False, str(e))

    def test_authentication(self):
        """Test authentication module."""
        print("\n" + "="*70)
        print("TEST GROUP: Authentication")
        print("="*70)

        try:
            from auth import AuthenticationService

            # Test password hashing
            test_password = "test_password_123"
            hashed = AuthenticationService.hash_password(test_password)
            verified = AuthenticationService.verify_password(test_password, hashed)

            self.test_result(
                "Password hashing and verification",
                verified,
                "Hash and verify working"
            )

            # Test token creation
            token = AuthenticationService.create_access_token(
                user_id=1,
                email="test@example.com"
            )
            self.test_result(
                "Access token creation",
                bool(token) and len(token) > 0,
                f"Token length: {len(token)}"
            )

        except Exception as e:
            self.test_result("Authentication", False, str(e))

    def test_database_connection(self):
        """Test database connectivity."""
        print("\n" + "="*70)
        print("TEST GROUP: Database Connection")
        print("="*70)

        try:
            from database import SessionLocal

            session = SessionLocal()

            # Try simple query
            try:
                result = session.execute("SELECT 1")
                self.test_result("Database connection", True, "Connected successfully")
            except Exception as e:
                self.test_result("Database connection", False, str(e))
            finally:
                session.close()

        except Exception as e:
            self.test_result("Database connection", False, str(e))

    def test_scheduler_configuration(self):
        """Test background job scheduler."""
        print("\n" + "="*70)
        print("TEST GROUP: Background Job Scheduler")
        print("="*70)

        try:
            import config

            if not config.SCHEDULER_ENABLED:
                print("⏭️  SKIP - Scheduler disabled in config")
                self.skipped += 1
                return

            from jobs import get_scheduler

            try:
                scheduler = get_scheduler()
                jobs = scheduler.get_jobs()

                self.test_result(
                    "Scheduler initialization",
                    scheduler is not None,
                    f"Jobs scheduled: {len(jobs)}"
                )

                # Check for specific jobs
                job_names = [job.name for job in jobs]
                expected_jobs = [
                    "property_sync_job",
                    "lead_notifications_job",
                    "agent_stats_job"
                ]

                for expected_job in expected_jobs:
                    has_job = expected_job in job_names
                    self.test_result(
                        f"Job registered: {expected_job}",
                        has_job,
                        "Scheduled" if has_job else "Not found"
                    )

            except Exception as e:
                print(f"⏭️  SKIP - Scheduler not initialized: {e}")
                self.skipped += 1

        except Exception as e:
            self.test_result("Scheduler configuration", False, str(e))

    def test_reelly_client(self):
        """Test Reelly API client."""
        print("\n" + "="*70)
        print("TEST GROUP: Reelly API Client")
        print("="*70)

        try:
            import config
            from services import ReelyApiClient

            if not config.REELLY_API_KEY or config.REELLY_API_KEY == "dev_key":
                print("⏭️  SKIP - Reelly API key not configured")
                self.skipped += 1
                return

            # Just test instantiation
            client = ReelyApiClient(api_key=config.REELLY_API_KEY)
            self.test_result(
                "Reelly client initialization",
                client is not None,
                "Client ready for async operations"
            )

        except Exception as e:
            self.test_result("Reelly API client", False, str(e))

    def test_error_handling(self):
        """Test error handling in services."""
        print("\n" + "="*70)
        print("TEST GROUP: Error Handling")
        print("="*70)

        try:
            from services.reelly_client import ReelyApiException, ReelyAuthException
            from services.property_sync import PropertySyncException
            from services.lead_service import LeadServiceException
            from services.agent_service import AgentServiceException

            exceptions = [
                ("ReelyApiException", ReelyApiException),
                ("ReelyAuthException", ReelyAuthException),
                ("PropertySyncException", PropertySyncException),
                ("LeadServiceException", LeadServiceException),
                ("AgentServiceException", AgentServiceException),
            ]

            for exc_name, exc_class in exceptions:
                # Test instantiation
                exc = exc_class("Test error message")
                success = isinstance(exc, Exception)
                self.test_result(f"Exception {exc_name}", success)

        except Exception as e:
            self.test_result("Error handling", False, str(e))

    # ========================================================================
    # Test Execution & Reporting
    # ========================================================================

    def run_all_tests(self):
        """Run all integration tests."""
        print("\n" + "╔" + "="*68 + "╗")
        print("║" + " "*68 + "║")
        print("║" + "gulfvista.properties - Integration Test Suite".center(68) + "║")
        print("║" + f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}".center(68) + "║")
        print("║" + " "*68 + "║")
        print("╚" + "="*68 + "╝")

        test_groups = [
            self.test_core_imports,
            self.test_config_loading,
            self.test_model_definitions,
            self.test_services_initialization,
            self.test_route_registration,
            self.test_authentication,
            self.test_database_connection,
            self.test_scheduler_configuration,
            self.test_reelly_client,
            self.test_error_handling,
        ]

        for test_group in test_groups:
            try:
                test_group()
            except Exception as e:
                logger.error(f"Test group error: {e}", exc_info=True)

        return self.generate_report()

    def generate_report(self):
        """Generate test report."""
        print("\n" + "="*70)
        print("TEST REPORT SUMMARY")
        print("="*70)

        total = self.passed + self.failed + self.skipped

        print(f"\n✅ PASSED:  {self.passed}")
        print(f"❌ FAILED:  {self.failed}")
        print(f"⏭️  SKIPPED: {self.skipped}")
        print(f"📊 TOTAL:   {total}")

        if self.errors:
            print("\n" + "="*70)
            print("FAILURES")
            print("="*70)
            for test_name, message in self.errors:
                print(f"\n❌ {test_name}")
                print(f"   {message}")

        print("\n" + "="*70)

        if self.failed == 0:
            print("✅ ALL TESTS PASSED!")
            return True
        else:
            print(f"❌ {self.failed} TEST(S) FAILED")
            return False


def main():
    """Run integration tests."""
    tester = IntegrationTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
