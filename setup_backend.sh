#!/bin/bash
# Setup script for T'Pizza Django Backend on macOS/Linux

echo ""
echo "============================================================"
echo "T'Pizza Django Backend - macOS/Linux Setup"
echo "============================================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed"
    echo "Please install Python 3.8+ from https://www.python.org/"
    exit 1
fi

echo "[1/5] Checking Python installation..."
python3 --version

# Navigate to server directory
cd server || {
    echo "ERROR: server directory not found"
    exit 1
}

echo ""
echo "[2/5] Creating Python virtual environment..."
python3 -m venv venv
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to create virtual environment"
    exit 1
fi

echo ""
echo "[3/5] Activating virtual environment..."
source venv/bin/activate

echo ""
echo "[4/5] Installing dependencies..."
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi

echo ""
echo "[5/5] Running Django migrations..."
python manage.py migrate
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to run migrations"
    echo "Make sure MySQL database 'tpizza' is created"
    exit 1
fi

echo ""
echo "============================================================"
echo "Setup completed successfully!"
echo "============================================================"
echo ""
echo "Next steps:"
echo "1. Create MySQL database: CREATE DATABASE tpizza;"
echo "2. Copy .env.example to .env and configure database credentials"
echo "3. Run: python manage.py shell < init_db.py"
echo "4. Run: python manage.py runserver 0.0.0.0:8000"
echo ""
echo "Default credentials:"
echo "- Admin: admin / admin123"
echo "- Staff: staff_1 / staff123"
echo "- Customer: customer_1 / customer123"
echo ""
