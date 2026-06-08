@echo off
REM GulfVista.Properties - Development Server Startup Script
REM This script installs dependencies and starts the Vite dev server

echo.
echo ============================================
echo GulfVista.Properties - Dev Server
echo ============================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Node.js detected
node --version

echo.
echo ============================================
echo Installing Dependencies...
echo ============================================
echo.

REM Install dependencies
call npm install

if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ✓ Dependencies installed successfully!

echo.
echo ============================================
echo Starting Development Server...
echo ============================================
echo.
echo The server will start on: http://localhost:5173
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the dev server
call npm run dev

pause
