@echo off
REM ============================================================================
REM Start gulfvista.properties Backend Server
REM ============================================================================

echo.
echo ╔════════════════════════════════════════════════════════════════════╗
echo ║                                                                    ║
echo ║           Starting gulfvista.properties Backend Server             ║
echo ║                                                                    ║
echo ║  API Documentation: http://localhost:8000/api/docs                ║
echo ║  Health Check:      http://localhost:8000/health                  ║
echo ║  ReDoc:             http://localhost:8000/api/redoc               ║
echo ║                                                                    ║
echo ║  Press Ctrl+C to stop the server                                  ║
echo ║                                                                    ║
echo ╚════════════════════════════════════════════════════════════════════╝
echo.

REM Check if .env exists
if not exist .env (
    echo ✗ ERROR: .env file not found!
    echo.
    echo Please run SETUP_PHASE5.bat first to create .env file
    echo.
    pause
    exit /b 1
)

REM Start the server
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

if errorlevel 1 (
    echo.
    echo ✗ Server failed to start
    echo.
    echo Check the errors above. Common issues:
    echo - Port 8000 already in use
    echo - Missing dependencies (run SETUP_PHASE5.bat)
    echo - Invalid .env file
    echo.
    pause
)

exit /b %errorlevel%
