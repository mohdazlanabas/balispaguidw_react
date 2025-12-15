# ✅ Docker & PostgreSQL Setup - SUCCESS!

Your PostgreSQL database is now running in Docker!

---

## 🎉 What's Running

### Docker Containers:
1. **balispaguide-postgres** - PostgreSQL 15 database (port 5432)
2. **balispaguide-pgadmin** - Database management UI (port 5050)

### Database Tables Created:
✅ **users** - User accounts (admin, user, spa_owner)
✅ **spa_owners** - Links users to spas
✅ **orders** - Booking orders
✅ **bookings** - Individual spa bookings
✅ **user_sessions** - JWT token tracking
✅ **admin_logs** - Admin activity audit

### Test Users (Already in Database):
✅ **Admin**: admin@balispaguide.com / admin123 (role: admin)
✅ **User**: test@example.com / user123 (role: user)
✅ **Spa Owner**: spa@example.com / spa123 (role: spa_owner)

**Note:** Passwords need to be hashed before you can actually log in (Day 2 task)

---

## 🌐 Access Points

### pgAdmin (Database UI)
**URL**: http://localhost:5050

**Login:**
- Email: `azlan@net1io.com`
- Password: `treasure2020a`

### PostgreSQL Database
**Connection Details:**
- Host: `localhost` (or `postgres` from within Docker)
- Port: `5432`
- Database: `balispaguide`
- Username: `postgres`
- Password: `dev_password`

---

## 📊 How to Use pgAdmin

### First Time Setup:

1. **Open pgAdmin**: http://localhost:5050

2. **Login** with:
   - Email: `azlan@net1io.com`
   - Password: `treasure2020a`

3. **Add Server**:
   - Right-click "Servers" → "Register" → "Server"

   **General Tab:**
   - Name: `Local Balispaguide`

   **Connection Tab:**
   - Host: `postgres` (the container name)
   - Port: `5432`
   - Database: `balispaguide`
   - Username: `postgres`
   - Password: `dev_password`

   **Click "Save"**

4. **Browse Your Database**:
   - Expand: Servers → Local Balispaguide → Databases → balispaguide → Schemas → public → Tables

5. **View Data**:
   - Right-click on `users` table → "View/Edit Data" → "All Rows"

---

## 🧪 Quick Tests

### Test 1: Check Containers are Running
```bash
docker ps
```

**Should show:**
- balispaguide-postgres (port 5432)
- balispaguide-pgadmin (port 5050)

### Test 2: List Tables
```bash
docker exec balispaguide-postgres psql -U postgres -d balispaguide -c "\dt"
```

**Should show 6 tables:**
- admin_logs
- bookings
- orders
- spa_owners
- user_sessions
- users

### Test 3: View Users
```bash
docker exec balispaguide-postgres psql -U postgres -d balispaguide -c "SELECT email, name, role FROM users;"
```

**Should show 3 users:**
- admin@balispaguide.com (System Admin, admin)
- test@example.com (Test User, user)
- spa@example.com (Spa Owner, spa_owner)

### Test 4: Access pgAdmin
```bash
open http://localhost:5050
```

**Should open pgAdmin login page**

---

## 🔧 Useful Docker Commands

### Start Database
```bash
docker-compose up -d
```

### Stop Database (keeps data)
```bash
docker-compose stop
```

### Stop and Remove (keeps data)
```bash
docker-compose down
```

### Stop and DELETE ALL DATA
```bash
docker-compose down -v
```

**⚠️ Warning:** The `-v` flag deletes all data!

### View Logs
```bash
# PostgreSQL logs
docker logs balispaguide-postgres

# pgAdmin logs
docker logs balispaguide-pgadmin

# Follow logs (live)
docker logs -f balispaguide-postgres
```

### Check Status
```bash
docker ps
```

### Restart Database
```bash
docker-compose restart postgres
```

### Connect via Command Line
```bash
docker exec balispaguide-postgres psql -U postgres -d balispaguide
```

Once connected, you can run SQL:
```sql
\dt                    -- List tables
\d users              -- Describe users table
SELECT * FROM users;  -- View all users
\q                    -- Quit
```

---

## 📝 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  role user_role DEFAULT 'user',  -- user, spa_owner, admin
  email_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);
```

### Bookings Table
```sql
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  user_id UUID REFERENCES users(id),
  spa_id INTEGER NOT NULL,
  spa_name VARCHAR(255) NOT NULL,
  spa_location VARCHAR(255),
  treatment VARCHAR(255) NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  price INTEGER NOT NULL,
  status booking_status DEFAULT 'pending',
  -- ... more fields
);
```

**See full schema**: `backend/migrations/001_initial.sql`

---

## 🚀 Next Steps

### ✅ Completed:
1. Docker Desktop installed and running
2. PostgreSQL 15 running in container
3. pgAdmin 4 running in container
4. Database `balispaguide` created
5. All 6 tables created successfully
6. Test users seeded

### 📝 Next (Day 1-2):
1. Test database connection from backend
2. Build authentication system (login/register)
3. Hash passwords properly
4. Create API endpoints for users

**See**: `references/plan.md` for the 10-day development timeline

---

## 🆘 Troubleshooting

### Can't access pgAdmin?
```bash
# Check if container is running
docker ps | grep pgadmin

# If not running, start it
docker-compose up -d

# Check logs
docker logs balispaguide-pgadmin
```

### Database won't start?
```bash
# Check Docker Desktop is running
open -a Docker

# Check logs
docker logs balispaguide-postgres

# Restart containers
docker-compose restart
```

### Port already in use?
```bash
# Check what's using port 5432
lsof -i :5432

# Stop other PostgreSQL
brew services stop postgresql
# or
kill -9 <PID>
```

### Tables not created?
```bash
# Re-run migrations
docker exec balispaguide-postgres psql -U postgres -d balispaguide < backend/migrations/001_initial.sql
```

### Fresh start needed?
```bash
# Delete everything and start over
docker-compose down -v
docker-compose up -d

# Wait 10 seconds
sleep 10

# Check tables
docker exec balispaguide-postgres psql -U postgres -d balispaguide -c "\dt"
```

---

## 💡 Pro Tips

### Keep Docker Running
Don't close Docker Desktop - just minimize it. It needs to run in the background for PostgreSQL to work.

### Quick Health Check
```bash
# One-liner to check everything
docker ps && docker exec balispaguide-postgres psql -U postgres -d balispaguide -c "\dt"
```

### Database Backup
```bash
# Backup database
docker exec balispaguide-postgres pg_dump -U postgres balispaguide > backup.sql

# Restore database
docker exec -i balispaguide-postgres psql -U postgres -d balispaguide < backup.sql
```

---

## ✨ Summary

**You now have:**
- ✅ PostgreSQL 15 running locally
- ✅ pgAdmin for visual database management
- ✅ 6 tables ready for authentication
- ✅ 3 test user accounts
- ✅ Everything running in Docker (easy to manage)

**Ready for Day 1:**
Start building the authentication system!

---

**Last Updated**: December 15, 2025
**Status**: ✅ Docker & PostgreSQL Ready
**Next**: Test database connection from backend (`references/plan.md` Day 1)
