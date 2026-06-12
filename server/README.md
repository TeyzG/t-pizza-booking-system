# Django Backend Setup Guide

## Prerequisites
- Python 3.8+
- MySQL Server
- pip

## Installation & Setup

### 1. Create Virtual Environment
```bash
cd server
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Create .env File
Copy `.env.example` to `.env` and update with your MySQL credentials:
```bash
cp .env.example .env
```

Edit `.env`:
```
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_NAME=tpizza
DATABASE_USER=root
DATABASE_PASSWORD=your_password
DATABASE_HOST=localhost
DATABASE_PORT=3306
ALLOWED_HOSTS=localhost,127.0.0.1,*
```

### 4. Create MySQL Database
```bash
mysql -u root -p

CREATE DATABASE tpizza CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 5. Run Migrations
```bash
python manage.py migrate
```

### 6. Initialize Database with Sample Data
```bash
python manage.py shell < init_db.py
```

### 7. Create Superuser (Optional, already created via init_db.py)
```bash
python manage.py createsuperuser
```

### 8. Run Development Server
```bash
python manage.py runserver 0.0.0.0:8000
```

The API will be available at `http://localhost:8000/api/`

## Default Credentials (from init_db.py)

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Staff | staff_1 | staff123 |
| Customer | customer_1 | customer123 |

## API Endpoints

### Authentication
- `POST /api/auth/login/` - User login
- `POST /api/auth/register/` - User registration

### Branches
- `GET /api/branches/` - List all branches
- `GET /api/branches/{id}/` - Get branch details
- `POST /api/branches/` - Create branch (admin only)
- `PATCH /api/branches/{id}/` - Update branch (admin only)
- `DELETE /api/branches/{id}/` - Delete branch (admin only)

### Tables
- `GET /api/tables/` - List all tables
- `GET /api/tables/available_tables/` - Get available tables for booking
- `PATCH /api/tables/{id}/` - Update table status (staff/admin)

### Bookings
- `GET /api/bookings/` - List bookings (filtered by user role)
- `POST /api/bookings/` - Create new booking (customer)
- `PATCH /api/bookings/{id}/` - Update booking (customer/admin)
- `DELETE /api/bookings/{id}/` - Delete booking
- `POST /api/bookings/{id}/confirm/` - Confirm booking (admin/staff)
- `POST /api/bookings/{id}/check_in/` - Check in booking
- `POST /api/bookings/{id}/cancel/` - Cancel booking
- `GET /api/bookings/my_bookings/` - Get current user's bookings
- `GET /api/bookings/statistics/` - Get dashboard statistics (admin)

### Users
- `GET /api/users/` - List users (admin only)
- `GET /api/users/me/` - Get current user profile
- `POST /api/users/{id}/change_password/` - Change password

### Notifications
- `GET /api/notifications/` - List user notifications
- `POST /api/notifications/{id}/mark_as_read/` - Mark notification as read
- `POST /api/notifications/mark_all_as_read/` - Mark all as read

## Admin Panel
Access Django admin at `http://localhost:8000/admin/`
- Username: admin
- Password: admin123

## Frontend Integration
Update your React frontend to call these API endpoints. The API expects:
- JWT token in Authorization header: `Authorization: Bearer <token>`
- CORS is enabled for localhost:3000 and 5173
