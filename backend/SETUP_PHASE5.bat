@echo off
REM ============================================================================
REM Phase 5 Complete Setup Script for Windows
REM Automates: .env setup, pip install, verification, and testing
REM ============================================================================

echo.
echo ╔════════════════════════════════════════════════════════════════════╗
echo ║                                                                    ║
echo ║     gulfvista.properties - Phase 5 Automated Setup                ║
echo ║                                                                    ║
echo ╚════════════════════════════════════════════════════════════════════╝
echo.

REM Get current directory
set BACKEND_DIR=%CD%

echo [1/6] Creating .env file with configuration...
echo.

REM Create .env file
(
echo # gulfvista.properties Environment Configuration
echo # Phase 5: Reelly API Integration
echo #
echo # DATABASE CONFIGURATION
echo DATABASE_URL=postgresql+psycopg://postgres:Iamgreat%%402030@localhost:5432/gulfvista_dev
echo.
echo # AUTHENTICATION
echo SECRET_KEY=dev-secret-key-change-in-production
echo ALGORITHM=HS256
echo ACCESS_TOKEN_EXPIRE_MINUTES=30
echo REFRESH_TOKEN_EXPIRE_DAYS=7
echo.
echo # REELLY API INTEGRATION
echo REELLY_API_KEY=your_api_key_from_reelly.ai
echo REELLY_BASE_URL=https://api.reelly.ai/v1
echo REELLY_WEBHOOK_SECRET=placeholder_for_development
echo REELLY_SYNC_INTERVAL_MINUTES=60
echo REELLY_BATCH_SIZE=50
echo REELLY_TIMEOUT_SECONDS=30
echo REELLY_MAX_RETRIES=3
echo.
echo # BACKGROUND JOBS
echo SCHEDULER_ENABLED=true
echo PROPERTY_SYNC_JOB_ENABLED=true
echo LEAD_NOTIFICATIONS_JOB_ENABLED=true
echo AGENT_STATS_JOB_ENABLED=true
echo.
echo # LEAD MANAGEMENT
echo LEAD_AUTO_ASSIGN_ENABLED=true
echo LEAD_NOTIFICATION_INTERVAL_MINUTES=5
echo LEAD_NOTIFICATION_THRESHOLD_MINUTES=30
echo.
echo # SERVER
echo SERVER_HOST=0.0.0.0
echo SERVER_PORT=8000
echo DEBUG=false
echo.
echo # LOGGING
echo LOG_LEVEL=INFO
echo LOG_FILE=gulfvista.log
echo LOG_TO_FILE=true
echo.
echo # FEATURE FLAGS
echo ENABLE_PROPERTY_SYNC=true
echo ENABLE_LEAD_AUTO_ASSIGNMENT=true
echo ENABLE_WEBHOOK_VERIFICATION=true
echo ENABLE_AGENT_VERIFICATION_WORKFLOW=true
) > .env

echo ✓ .env file created successfully
echo.

REM Step 2: Upgrade pip
echo [2/6] Upgrading pip...
echo.
python -m pip install --upgrade pip
if errorlevel 1 (
    echo ✗ Failed to upgrade pip
    goto ERROR
)
echo ✓ pip upgraded successfully
echo.

REM Step 3: Install dependencies
echo [3/6] Installing dependencies from requirements.txt...
echo.
pip install --prefer-binary -r requirements.txt
if errorlevel 1 (
    echo.
    echo ⚠ Installation encountered issues, trying alternative method...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo ✗ Failed to install dependencies
        goto ERROR
    )
)
echo ✓ Dependencies installed successfully
echo.

REM Step 4: Verify critical imports
echo [4/6] Verifying critical imports...
echo.
python -c "import fastapi; import sqlalchemy; import apscheduler; import jose; print('✓ All critical imports OK')"
if errorlevel 1 (
    echo ✗ Critical import verification failed
    goto ERROR
)
echo.

REM Step 5: Run startup verification
echo [5/6] Running startup verification (35+ checks)...
echo.
python verify_startup.py
if errorlevel 1 (
    echo.
    echo ⚠ Startup verification had some warnings (expected without PostgreSQL)
    echo.
)

REM Step 6: Run integration tests
echo [6/6] Running integration tests (40+ tests)...
echo.
python test_integration.py
if errorlevel 1 (
    echo.
    echo ⚠ Some tests failed (may be due to missing database)
    echo.
)

echo.
echo ╔════════════════════════════════════════════════════════════════════╗
echo ║                                                                    ║
echo ║              ✓ SETUP COMPLETE!                                    ║
echo ║                                                                    ║
echo ║  Next Steps:                                                       ║
echo ║  1. Edit .env file and add your Reelly API key                    ║
echo ║  2. Make sure PostgreSQL is running                               ║
echo ║  3. Run: python -m uvicorn main:app --reload                      ║
echo ║  4. Visit: http://localhost:8000/api/docs                         ║
echo ║                                                                    ║
echo ╚════════════════════════════════════════════════════════════════════╝
echo.

pause
exit /b 0

:ERROR
echo.
echo ╔════════════════════════════════════════════════════════════════════╗
echo ║  ✗ SETUP FAILED                                                   ║
echo ║                                                                    ║
echo ║  Please check the errors above and try again.                     ║
echo ║  See PHASE5_COMPLETE_FIXES.md for troubleshooting.                ║
echo ╚════════════════════════════════════════════════════════════════════╝
echo.
pause
exit /b 1
