# 🍕 Quick Reference Guide

## Start Backend (First Terminal)

```bash
# Windows
cd server
venv\Scripts\activate
python manage.py runserver 0.0.0.0:8000

# macOS/Linux
cd server
source venv/bin/activate
python manage.py runserver 0.0.0.0:8000
```

Backend runs at: **http://localhost:8000**

---

## Start Frontend (Second Terminal)

```bash
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## First Time Setup

### 1. Create MySQL Database
```sql
CREATE DATABASE tpizza CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Copy & Configure Environment
```bash
cd server
copy .env.example .env     # Windows
# OR
cp .env.example .env       # macOS/Linux
```

Edit `.env` - Set MySQL password

### 3. Setup Backend (Run Once)
```bash
cd server
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py shell < init_db.py
```

### 4. Always Activate Virtual Environment

```bash
# Windows
cd server
venv\Scripts\activate

# macOS/Linux  
cd server
source venv/bin/activate
```

---

## Login Credentials

| Role | Username | Password |
|------|----------|----------|
| 👑 Admin | `admin` | `admin123` |
| 👔 Staff | `staff_1` | `staff123` |
| 👤 Customer | `customer_1` | `customer123` |

---

## Key Files

### Backend
- Settings: `server/tpizza_backend/settings.py`
- Models: `server/core/models.py`
- API Views: `server/api/views.py`
- API Routes: `server/api/urls.py`
- Admin Panel: `server/core/admin.py`

### Frontend
- Auth Context: `src/context/AuthContext.tsx`
- API Client: `src/api/client.ts`
- Login Component: `src/components/Login.tsx`
- Main App: `src/App.tsx`

---

## Common Commands

### Database
```bash
# Run migrations
python manage.py migrate

# Create migration from model changes
python manage.py makemigrations

# Initialize sample data
python manage.py shell < init_db.py

# Access Django shell
python manage.py shell

# Reset database (WARNING: deletes all data)
python manage.py migrate zero
python manage.py migrate
```

### Django Admin
- URL: http://localhost:8000/admin/
- Username: `admin`
- Password: `admin123`

---

## API Endpoints

### Get Token
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Make Authenticated Request
```bash
curl -X GET http://localhost:8000/api/users/me/ \
  -H "Authorization: Bearer <your_token>"
```

### List Branches
```bash
GET http://localhost:8000/api/branches/
```

### Get Available Tables
```bash
GET http://localhost:8000/api/tables/available_tables/?branch_id=1&date=2026-06-15&time=19:00
```

### Create Booking
```bash
POST http://localhost:8000/api/bookings/
Content-Type: application/json
Authorization: Bearer <token>

{
  "branch": 1,
  "booking_date": "2026-06-15",
  "booking_time": "19:00",
  "adult_count": 2,
  "children_count": 0,
  "zone_preference": "indoor"
}
```

---

## Environment Variables (.env)

```
DEBUG=True                                    # False in production
SECRET_KEY=your-secret-key-change-production
DATABASE_NAME=tpizza
DATABASE_USER=root
DATABASE_PASSWORD=your_mysql_password
DATABASE_HOST=localhost
DATABASE_PORT=3306
ALLOWED_HOSTS=localhost,127.0.0.1,*
```

---

## Troubleshooting

### Error: MySQL Connection Refused
- MySQL not running
- Check .env DATABASE_PASSWORD
- Verify database was created

### Error: Port Already in Use
```bash
# Use different port
python manage.py runserver 0.0.0.0:8080
```

### Error: Module Not Found
```bash
# Reinstall dependencies
pip install -r requirements.txt
```

### Error: Database Not Found
```bash
# Create database
mysql -u root -p
CREATE DATABASE tpizza;
```

### CORS Error in Frontend
- Ensure backend runs on http://localhost:8000
- Check CORS_ALLOWED_ORIGINS in settings.py

---

## Project Urls

| Service | URL | Login |
|---------|-----|-------|
| Frontend | http://localhost:5173 | Use app login form |
| Backend API | http://localhost:8000/api/ | JWT token required |
| Django Admin | http://localhost:8000/admin/ | admin/admin123 |
| Database | localhost:3306 | root/password |

---

## Frontend Integration Status

### ✅ Done
- Authentication system
- Login/Register UI
- API client utilities
- User profile display

### 🔄 In Progress / To Complete
- Update BookingWizard to use API
- Update AdminPortal to use API
- Fetch branches from API
- Fetch tables from API

---

## Important Notes

1. **Always activate venv** before running backend
2. **Backend must run** before frontend makes API calls
3. **MySQL must be running** before Django starts
4. **Token expires in 7 days** - implement refresh logic for production
5. **Bookings use localStorage** as fallback - implement API calls

---

## Database Structure

```
Authentication
├── User (credentials, profile)
├── Role (admin, staff, customer)
└── Permission (granular access)

Restaurant
├── Branch (locations)
└── Table (capacity, zone)

Booking
├── Booking (customer, date, time, status)
└── Notification (alerts)
```

---

## Quick Development Loop

```bash
# Terminal 1: Backend
cd server
source venv/bin/activate  # or venv\Scripts\activate (Windows)
python manage.py runserver

# Terminal 2: Frontend
npm run dev

# Terminal 3: Optional - Django Admin
# Visit http://localhost:8000/admin/
```

---

## Useful Django Commands

```bash
# Create superuser
python manage.py createsuperuser

# List all URLs
python manage.py show_urls

# Check database
python manage.py dbshell

# Create backup
python manage.py dumpdata > backup.json

# Restore backup
python manage.py loaddata backup.json

# Format code
python -m black .
```

---

## Performance Tips

1. Use admin panel to create test data
2. Test API endpoints with Postman/Insomnia
3. Check browser DevTools Network tab for API calls
4. Use Django debug toolbar for query optimization
5. Implement pagination for large datasets

---

## Next Features to Add

1. Email notifications
2. SMS reminders
3. Payment integration
4. QR code check-in
5. Analytics dashboard
6. Waitlist management
7. Special menu requests
8. Customer loyalty program

---

**Happy coding! 🍕**

For more details, see:
- `SETUP_GUIDE.md` - Detailed setup
- `BACKEND_SUMMARY.md` - Feature overview
- `IMPLEMENTATION_CHECKLIST.md` - What was built
