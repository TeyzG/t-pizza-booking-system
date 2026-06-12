# T'Pizza Booking System - Complete Setup Guide

This guide will help you set up the complete T'Pizza booking system with Django backend and React frontend.

## System Architecture

```
Frontend (React + Vite + TypeScript)
         ↓ (HTTP/REST API)
Backend (Django REST Framework)
         ↓ (SQL)
Database (MySQL)
```

## Prerequisites

- **Node.js** 16+ and npm/yarn (for frontend)
- **Python** 3.8+ (for backend)
- **MySQL** 5.7+ (for database)
- **Git** (optional)

## Quick Start (5 Minutes)

### Windows Users
```bash
# 1. Setup Django Backend
setup_backend.bat

# 2. Create MySQL database (run in MySQL command line)
CREATE DATABASE tpizza CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 3. Setup environment
cd server
copy .env.example .env
# Edit .env with your MySQL credentials

# 4. Initialize database with sample data
python manage.py shell < init_db.py

# 5. Start backend server
python manage.py runserver 0.0.0.0:8000
```

### macOS/Linux Users
```bash
# 1. Setup Django Backend
chmod +x setup_backend.sh
./setup_backend.sh

# 2. Create MySQL database
mysql -u root -p
> CREATE DATABASE tpizza CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
> EXIT;

# 3. Setup environment
cd server
cp .env.example .env
# Edit .env with your MySQL credentials

# 4. Initialize database with sample data
python manage.py shell < init_db.py

# 5. Start backend server
python manage.py runserver 0.0.0.0:8000
```

### Frontend Setup (All Platforms)
```bash
# In a new terminal (in project root directory)
npm install
npm run dev
```

Access the application at `http://localhost:5173` (or `http://localhost:3000`)

## Detailed Backend Setup

### 1. Install MySQL

#### Windows
- Download from: https://dev.mysql.com/downloads/mysql/
- Run installer and follow the wizard
- Default installation uses port 3306

#### macOS
```bash
brew install mysql
brew services start mysql
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

### 2. Create Database

```bash
mysql -u root -p

-- Create database
CREATE DATABASE tpizza CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Verify
SHOW DATABASES;

-- Exit
EXIT;
```

### 3. Configure Backend

Navigate to `server` directory:

```bash
cd server
```

Copy environment template:
```bash
# Windows
copy .env.example .env

# macOS/Linux
cp .env.example .env
```

Edit `.env` with your database credentials:
```
DEBUG=True
SECRET_KEY=your-super-secret-key-change-in-production
DATABASE_NAME=tpizza
DATABASE_USER=root
DATABASE_PASSWORD=your_mysql_password
DATABASE_HOST=localhost
DATABASE_PORT=3306
ALLOWED_HOSTS=localhost,127.0.0.1,*
```

### 4. Create Virtual Environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 5. Install Python Packages

```bash
pip install -r requirements.txt
```

Required packages:
- Django 4.2.10
- djangorestframework 3.14.0
- django-cors-headers 4.3.1
- mysqlclient 2.2.0
- python-dotenv 1.0.0
- PyJWT 2.8.1

### 6. Run Migrations

```bash
python manage.py migrate
```

This creates all database tables.

### 7. Initialize Sample Data

```bash
python manage.py shell < init_db.py
```

This creates:
- 3 Roles: Admin, Staff, Customer
- 6 Branches with full details
- 60+ Tables across all branches
- Sample users for testing
- Demo bookings

### 8. Create Superuser (Optional)

```bash
python manage.py createsuperuser
```

### 9. Start Development Server

```bash
python manage.py runserver 0.0.0.0:8000
```

Server runs at `http://localhost:8000`
Admin panel at `http://localhost:8000/admin/`

## Frontend Setup

### 1. Install Node Modules

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

Vite runs at `http://localhost:5173` or `http://localhost:3000`

### 3. Build for Production

```bash
npm run build
```

## Default Credentials

After running `init_db.py`, use these credentials to log in:

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Staff | `staff_1` | `staff123` |
| Customer | `customer_1` | `customer123` |

## API Documentation

### Base URL
```
http://localhost:8000/api/
```

### Authentication
All endpoints (except auth/register and auth/login) require JWT token:
```
Authorization: Bearer <token>
```

### Key Endpoints

#### Authentication
```
POST   /auth/login/        - Login user
POST   /auth/register/     - Register new user
```

#### Bookings
```
GET    /bookings/          - List bookings
POST   /bookings/          - Create booking
PATCH  /bookings/{id}/     - Update booking
DELETE /bookings/{id}/     - Delete booking
POST   /bookings/{id}/confirm/    - Confirm (admin/staff)
POST   /bookings/{id}/check_in/   - Check in
POST   /bookings/{id}/cancel/     - Cancel
GET    /bookings/my_bookings/     - User's bookings
GET    /bookings/statistics/      - Dashboard stats (admin)
```

#### Branches
```
GET    /branches/          - List all branches
GET    /branches/{id}/     - Get branch details
POST   /branches/          - Create (admin)
PATCH  /branches/{id}/     - Update (admin)
DELETE /branches/{id}/     - Delete (admin)
```

#### Tables
```
GET    /tables/            - List tables
GET    /tables/available_tables/  - Available tables for booking
PATCH  /tables/{id}/       - Update table
```

#### Users
```
GET    /users/             - List users (admin)
GET    /users/me/          - Current user profile
POST   /users/{id}/change_password/ - Change password
```

#### Notifications
```
GET    /notifications/     - List notifications
POST   /notifications/{id}/mark_as_read/  - Mark as read
POST   /notifications/mark_all_as_read/   - Mark all as read
```

## Project Structure

```
t'pizza-booking-system/
├── server/                          # Django Backend
│   ├── tpizza_backend/             # Django project settings
│   │   ├── settings.py             # Configuration
│   │   ├── urls.py                 # URL routing
│   │   └── wsgi.py                 # WSGI application
│   ├── core/                       # Core Django app
│   │   ├── models.py               # Database models
│   │   └── admin.py                # Admin configuration
│   ├── api/                        # API Django app
│   │   ├── serializers.py          # DRF serializers
│   │   ├── views.py                # API views/viewsets
│   │   ├── urls.py                 # API URL routing
│   │   └── authentication.py       # JWT authentication
│   ├── manage.py                   # Django CLI
│   ├── init_db.py                  # Database initialization
│   ├── requirements.txt            # Python dependencies
│   ├── .env.example               # Environment template
│   └── README.md                   # Backend documentation
│
├── src/                            # React Frontend
│   ├── components/                 # React components
│   │   ├── Login.tsx              # Login/Register
│   │   ├── BookingWizard.tsx      # Booking form
│   │   ├── AdminPortal.tsx        # Admin dashboard
│   │   └── DevDocs.tsx            # Documentation
│   ├── context/                    # React context
│   │   └── AuthContext.tsx        # Authentication context
│   ├── api/                        # API client
│   │   └── client.ts              # API utilities
│   ├── types.ts                    # TypeScript types
│   ├── App.tsx                     # Main app component
│   └── main.tsx                    # App entry point
│
├── package.json                    # Frontend dependencies
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                 # Vite configuration
├── setup_backend.bat              # Windows setup script
├── setup_backend.sh               # macOS/Linux setup script
└── README.md                       # Project documentation
```

## Database Schema

### Core Models

**User**
- id, username, email, password_hash
- first_name, last_name, phone
- role (Foreign Key → Role)
- is_active, created_at, updated_at

**Role**
- id, name (admin, staff, customer)
- description

**Permission**
- id, role (FK), permission_type
- Examples: view_bookings, manage_branches, manage_users

**Branch**
- id, name, location, address, phone, email
- description, image_url, rating
- status (active, busy, maintenance)
- latitude, longitude
- is_active, created_at, updated_at

**Table**
- id, branch (FK), table_number, capacity
- zone (indoor, outdoor, mezzanine, kiln)
- is_available, notes
- created_at, updated_at

**Booking**
- id, booking_code (unique)
- customer (FK → User), branch (FK)
- table (FK, nullable), booking_date, booking_time
- adult_count, children_count
- zone_preference, special_requests, customer_notes
- status (pending, confirmed, checked_in, cancelled, expired)
- checked_in_at, created_at, updated_at

**Notification**
- id, user (FK), booking (FK, nullable)
- notification_type, title, message
- is_read, created_at

## Troubleshooting

### MySQL Connection Error
```
Error: (1045, "Access denied for user 'root'@'localhost'")
```
**Solution:** Check DATABASE_PASSWORD in .env matches your MySQL password

### Port Already in Use
```
Error: Address already in use
```
**Solution:** Change port in manage.py runserver command:
```bash
python manage.py runserver 0.0.0.0:8080
```

### CORS Error
If frontend can't reach backend:
1. Ensure backend is running on http://localhost:8000
2. Check CORS_ALLOWED_ORIGINS in settings.py
3. Update API_BASE_URL in src/api/client.ts

### Database Migration Error
```bash
# Reset migrations (WARNING: clears database)
python manage.py migrate zero
python manage.py migrate
python manage.py shell < init_db.py
```

## Performance Tips

1. **Database Indexing**: Already configured on frequently queried fields
2. **API Pagination**: Bookings/Users are paginated (20 per page)
3. **Frontend Caching**: Implement localStorage for branches list
4. **Database Optimization**: Use MySQL's EXPLAIN for slow queries

## Security Considerations

1. **Change SECRET_KEY** in production
2. **Set DEBUG=False** in production
3. **Use HTTPS** in production
4. **Update ALLOWED_HOSTS** for your domain
5. **Rotate JWT tokens** periodically
6. **Hash passwords** - Django handles this automatically
7. **Validate user input** - DRF serializers handle this

## Next Steps

1. ✅ Set up Django backend with MySQL
2. ✅ Configure frontend to use real API
3. 📝 Add more features:
   - Email notifications
   - Payment integration
   - Advanced analytics
   - Mobile app
   - QR code check-in
   - Waitlist management

## Support & Documentation

- Django Docs: https://docs.djangoproject.com/
- DRF Docs: https://www.django-rest-framework.org/
- React Docs: https://react.dev/
- MySQL Docs: https://dev.mysql.com/doc/

## License

This project is for educational purposes.

---

**Happy Booking! 🍕**
