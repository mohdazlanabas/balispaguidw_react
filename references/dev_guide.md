# Development Guide - Bali Spa Guide

Complete guide for local development with Docker and PostgreSQL.

## Quick Start (5 Minutes)

### Prerequisites
- Node.js 18+ installed
- Docker Desktop installed and running
- Git

### Step 1: Start PostgreSQL with Docker

```bash
# Navigate to project root
cd /Users/rogerwoolie/Documents/Managed_Website/new_balispaguide

# Start PostgreSQL (this will download the image first time)
docker-compose up -d

# Wait 10 seconds for database to initialize
# Check if it's running
docker ps
```

You should see:
- `balispaguide-postgres` - Database
- `balispaguide-pgadmin` - Database management UI

### Step 2: Verify Database is Ready

```bash
# Check database logs
docker logs balispaguide-postgres

# You should see: "database system is ready to accept connections"
```

### Step 3: Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install pg bcrypt jsonwebtoken dotenv

# Install frontend dependencies (if not already done)
cd ../frontend
npm install
```

### Step 4: Start Development Servers

```bash
# Terminal 1: Start backend
cd backend
npm start

# Terminal 2: Start frontend
cd frontend
npm run dev
```

### Step 5: Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000
- **Database UI (pgAdmin)**: http://localhost:5050
  - Email: `azlan@net1io.com`
  - Password: `treasure2020a`

## Database Management

### Using pgAdmin (Recommended for Beginners)

1. Open http://localhost:5050
2. Login with `azlan@net1io.com` / `treasure2020a`
3. Right-click "Servers" → "Register" → "Server"
4. General tab:
   - Name: `Local Balispaguide`
5. Connection tab:
   - Host: `postgres` (container name)
   - Port: `5432`
   - Database: `balispaguide`
   - Username: `postgres`
   - Password: `dev_password`
6. Click "Save"

Now you can browse tables, run queries, and view data visually!

### Using Command Line (psql)

```bash
# Connect to database
docker exec -it balispaguide-postgres psql -U postgres -d balispaguide

# List all tables
\dt

# View users
SELECT * FROM users;

# Exit
\q
```

### Useful Database Commands

```bash
# Stop database
docker-compose down

# Stop and remove all data (fresh start)
docker-compose down -v

# View database logs
docker logs balispaguide-postgres

# Restart database
docker-compose restart postgres
```

## Test User Accounts

The database is seeded with test accounts (see `backend/migrations/001_initial.sql`):

### Admin Account
- Email: `admin@balispaguide.com`
- Password: `admin123`
- Role: `admin`

### Regular User
- Email: `test@example.com`
- Password: `user123`
- Role: `user`

### Spa Owner
- Email: `spa@example.com`
- Password: `spa123`
- Role: `spa_owner`

**Note**: You'll need to implement password hashing to actually use these. For now, they're placeholders.

## Development Timeline (10 Days)

### Day 1: Database Connection ✅
**Goal**: Connect backend to PostgreSQL

**Tasks**:
- [x] Docker setup
- [x] Database schema
- [x] Connection configuration
- [ ] Test database connection

**Files to create**:
- `backend/config/db.js` ✅

**Test**:
```bash
cd backend
node -e "require('./config/db').query('SELECT NOW()')"
```

### Day 2: User Authentication - Register
**Goal**: Users can create accounts

**Files to create**:
- `backend/middleware/auth.js`
- `backend/routes/auth.js`
- `frontend/src/pages/auth/RegisterPage.jsx`

**API Endpoints**:
- `POST /api/auth/register`

**Test**: Create a new user via Postman or frontend

### Day 3: User Authentication - Login
**Goal**: Users can log in and get JWT token

**Files to create/update**:
- `backend/routes/auth.js` (add login)
- `frontend/src/pages/auth/LoginPage.jsx`
- `frontend/src/context/AuthContext.jsx`

**API Endpoints**:
- `POST /api/auth/login`
- `GET /api/auth/me`

**Test**: Login with test user, verify JWT token

### Day 4: Protected Routes & Middleware
**Goal**: Secure routes require authentication

**Files to create**:
- `backend/middleware/roleCheck.js`
- `frontend/src/components/auth/ProtectedRoute.jsx`

**Test**: Access protected routes with/without token

### Day 5: User Account Page
**Goal**: Users can view profile and booking history

**Files to create**:
- `frontend/src/pages/MyAccountPage.jsx`
- `frontend/src/components/OrderHistory.jsx`
- `backend/routes/user.js`

**API Endpoints**:
- `GET /api/user/profile`
- `GET /api/user/bookings`
- `PUT /api/user/profile`

**Test**: View bookings, edit profile

### Day 6: Connect Cart to Database
**Goal**: Save bookings for logged-in users

**Files to update**:
- `frontend/src/context/CartContext.jsx`
- `backend/routes/booking.js`

**API Endpoints**:
- `POST /api/bookings`
- `GET /api/bookings/:id`

**Test**: Create booking while logged in, verify in database

### Day 7: Spa Owner Dashboard
**Goal**: Spa owners can view their bookings

**Files to create**:
- `frontend/src/pages/SpaDashboardPage.jsx`
- `backend/routes/spa.js`

**API Endpoints**:
- `GET /api/spa/bookings`
- `GET /api/spa/stats`

**Test**: Login as spa owner, view bookings

### Day 8: Admin CMS - Users
**Goal**: Admins can manage users

**Files to create**:
- `frontend/src/pages/AdminPage.jsx`
- `backend/routes/admin.js`

**API Endpoints**:
- `GET /api/admin/users`
- `PUT /api/admin/users/:id`
- `DELETE /api/admin/users/:id`

**Test**: View users, change roles, deactivate users

### Day 9: Admin CMS - Bookings & Spas
**Goal**: Admins can manage all bookings and spas

**Files to update**:
- `frontend/src/pages/AdminPage.jsx`
- `backend/routes/admin.js`

**API Endpoints**:
- `GET /api/admin/bookings`
- `GET /api/admin/spas`
- `POST /api/admin/spa-owners`

**Test**: View all bookings, assign spa owners

### Day 10: Testing & Polish
**Goal**: Full system test, fix bugs

**Tasks**:
- Test all user flows
- Test edge cases
- Fix any bugs
- Update documentation
- Prepare for staging deployment

## Common Issues & Solutions

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution**: Make sure Docker is running and PostgreSQL container is up
```bash
docker-compose up -d
docker ps
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5432
```
**Solution**: Stop other PostgreSQL instances or change port in docker-compose.yml

### Cannot Access pgAdmin
**Solution**:
1. Check container is running: `docker ps`
2. Try http://localhost:5050 (not HTTPS)
3. Restart: `docker-compose restart pgadmin`

### Database Tables Not Created
**Solution**: Re-run migrations
```bash
docker exec -i balispaguide-postgres psql -U postgres -d balispaguide < backend/migrations/001_initial.sql
```

### Fresh Start (Reset Everything)
```bash
# Stop and remove all containers and data
docker-compose down -v

# Start fresh
docker-compose up -d

# Wait 10 seconds, then verify
docker logs balispaguide-postgres
```

## Git Workflow

### Create Feature Branch
```bash
# Make sure you're on staging
git checkout staging
git pull origin staging

# Create feature branch
git checkout -b feature/database-setup
```

### Commit Work
```bash
git add .
git commit -m "Add PostgreSQL database setup with Docker"
```

### Merge to Staging
```bash
git checkout staging
git merge feature/database-setup
git push origin staging
```

### Test Before Merging to Main
```bash
# Run all tests
npm run dev

# Test manually
# - Create user
# - Login
# - Create booking
# - View account

# If all good, merge to main
git checkout main
git merge staging
git push origin main
```

## Environment Files

### Development (.env.local)
Already configured in `backend/.env.local`

### Staging (.env.staging)
Create when ready to deploy to GCP staging

### Production (.env.production)
Create when ready to deploy to GCP production

## Next Steps

After completing local development:
1. Create `staging` branch
2. Deploy to GCP Cloud SQL (staging)
3. Test on staging environment
4. Merge to `main`
5. Deploy to GCP production

See `DEPLOYMENT.md` for deployment instructions.

## Helpful Commands

```bash
# Check what's using port 5432
lsof -i :5432

# Check Docker containers
docker ps -a

# View container logs
docker logs balispaguide-postgres -f

# Execute SQL file
docker exec -i balispaguide-postgres psql -U postgres -d balispaguide < backend/migrations/001_initial.sql

# Backup database
docker exec balispaguide-postgres pg_dump -U postgres balispaguide > backup.sql

# Restore database
docker exec -i balispaguide-postgres psql -U postgres -d balispaguide < backup.sql
```

## Need Help?

1. Check Docker Desktop is running
2. Check container logs: `docker logs balispaguide-postgres`
3. Verify network: `docker network ls`
4. Try fresh start: `docker-compose down -v && docker-compose up -d`

---

**Last Updated**: December 2025
**Status**: Ready for Development
