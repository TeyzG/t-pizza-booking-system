@echo off
REM Setup script for T'Pizza Django Backend on Windows
REM This script sets up Python virtual environment and installs dependencies

echo.
echo ============================================================
echo T'Pizza Django Backend - Windows Setup
echo ============================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://www.python.org/
    pause
    exit /b 1
)

echo [1/5] Checking Python installation...
python --version

REM Navigate to server directory
cd server
if errorlevel 1 (
    echo ERROR: server directory not found
    pause
    exit /b 1
)

echo.
echo [2/5] Creating Python virtual environment...
python -m venv venv
if errorlevel 1 (
    echo ERROR: Failed to create virtual environment
    pause
    exit /b 1
)

echo.
echo [3/5] Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo [4/5] Installing dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [5/5] Running Django migrations...
python manage.py migrate
if errorlevel 1 (
    echo ERROR: Failed to run migrations
    echo Make sure MySQL database 'tpizza' is created
    pause
    exit /b 1
)

echo.
echo ============================================================
echo Setup completed successfully!
echo ============================================================
echo.
echo Next steps:
echo 1. Create MySQL database: CREATE DATABASE tpizza;
echo 2. Copy .env.example to .env and configure database credentials
echo 3. Run: python manage.py shell ^< init_db.py
echo 4. Run: python manage.py runserver 0.0.0.0:8000
echo.
echo Default credentials:
echo - Admin: admin / admin123
echo - Staff: staff_1 / staff123
echo - Customer: customer_1 / customer123
echo.
pause
