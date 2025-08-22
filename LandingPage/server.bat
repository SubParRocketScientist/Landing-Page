@echo off
REM Start a local HTTP server in the current directory on port 8000

REM Check if python is installed
python --version >nul 2>&1
if errorlevel 1 (
  echo Python is not installed or not in PATH.
  pause
  exit /b 1
)

REM Start Python HTTP server
python -m http.server 8000

REM Keep window open after server stops
pause
