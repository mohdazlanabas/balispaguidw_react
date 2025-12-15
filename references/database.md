# Database Documentation

Complete reference for the PostgreSQL database used in Bali Spa Guide.

---

## 📊 Database Overview

### Database Information
- **Name**: `balispaguide`
- **Type**: PostgreSQL 15.15
- **Host**: `localhost` (Docker container)
- **Port**: `5432`
- **Username**: `postgres`
- **Password**: `dev_password` (development only)

### Running Environment
- **Development**: Docker container (`balispaguide-postgres`)
- **Production**: Google Cloud SQL or DigitalOcean Managed Database
- **Management UI**: pgAdmin 4 (http://localhost:5050)

### Database Storage Location
- **Docker Volume**: `new_balispaguide_postgres_data`
- **Physical Path**: `/var/lib/docker/volumes/new_balispaguide_postgres_data/_data`
- **Type**: Local (on your Mac), managed by Docker Desktop
- **Persistence**: Data persists even when containers are stopped

### Connection Status
✅ **Verified Working** (Last tested: 2025-12-15)
- Backend connection: ✅ Successful
- Tables created: 6
- Test users seeded: 3
- Docker containers: Running and healthy

---

## 🗄️ Database Schema

### Tables Overview

| Table | Purpose | Key Fields | Relationships |
|-------|---------|------------|---------------|
| `users` | User accounts | id, email, password_hash, role | → bookings, spa_owners, user_sessions |
| `spa_owners` | Spa ownership | user_id, spa_id | users ← |
| `orders` | Booking orders | id, user_id, total_price | users ←, → bookings |
| `bookings` | Spa bookings | id, order_id, user_id, spa_id | users ←, orders ← |
| `user_sessions` | JWT tokens | user_id, token_hash | users ← |
| `admin_logs` | Admin actions | admin_id, action, entity_type | users ← |

---

## 📋 Table Details

### 1. Users Table

**Purpose**: Stores all user accounts (customers, spa owners, admins)

**Schema**:
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role user_role DEFAULT 'user',
    email_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);
```

**Roles**:
- `user` - Regular customer
- `spa_owner` - Spa business owner
- `admin` - System administrator

**Indexes**:
- `idx_users_email` - Email lookups
- `idx_users_role` - Role filtering

**Example Data**:
```sql
-- Seeded test accounts
azlan@net1io.com     - Azlan (Admin) [admin role]
roger@net1io.com     - Roger (Test User) [user role]
spaowner@net1io.com  - Spa Owner (Test) [spa_owner role]
```

---

### 2. Spa Owners Table

**Purpose**: Links user accounts to spas they own (from CSV)

**Schema**:
```sql
CREATE TABLE spa_owners (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    spa_id INTEGER NOT NULL,  -- References nid from bsg_spas.csv
    spa_name VARCHAR(255) NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes**:
- `idx_spa_owners_user_id` - Find spas by owner
- `idx_spa_owners_spa_id` - Find owner by spa

**Usage**:
```sql
-- Get all spas owned by a user
SELECT * FROM spa_owners WHERE user_id = 'user-uuid';

-- Get owner of a spa
SELECT u.* FROM users u
JOIN spa_owners so ON u.id = so.user_id
WHERE so.spa_id = 123;
```

---

### 3. Orders Table

**Purpose**: Groups multiple bookings into a single order/transaction

**Schema**:
```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,

    -- Guest information (for non-logged-in users)
    guest_name VARCHAR(255),
    guest_email VARCHAR(255),
    guest_phone VARCHAR(50),

    -- Order details
    total_price INTEGER NOT NULL,
    status payment_status DEFAULT 'pending',

    -- Payment information
    payment_method VARCHAR(50),
    payment_id VARCHAR(255),

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);
```

**Payment Status**:
- `pending` - Awaiting payment
- `completed` - Payment successful
- `failed` - Payment failed
- `refunded` - Payment refunded

**Indexes**:
- `idx_orders_user_id` - User's orders
- `idx_orders_order_number` - Order lookup
- `idx_orders_created_at` - Recent orders

**Usage**:
```sql
-- Generate order number
INSERT INTO orders (order_number, user_id, total_price, status)
VALUES ('ORD-' || EXTRACT(EPOCH FROM NOW())::BIGINT, 'user-uuid', 2000000, 'pending');

-- Get user's orders
SELECT * FROM orders WHERE user_id = 'user-uuid' ORDER BY created_at DESC;
```

---

### 4. Bookings Table

**Purpose**: Individual spa treatment bookings

**Schema**:
```sql
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,

    -- Spa information (denormalized from CSV)
    spa_id INTEGER NOT NULL,
    spa_name VARCHAR(255) NOT NULL,
    spa_location VARCHAR(255),
    spa_email VARCHAR(255),
    spa_phone VARCHAR(50),

    -- Booking details
    treatment VARCHAR(255) NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    price INTEGER NOT NULL,
    quantity INTEGER DEFAULT 1,
    status booking_status DEFAULT 'pending',

    -- Guest information (for anonymous bookings)
    guest_name VARCHAR(255),
    guest_email VARCHAR(255),
    guest_phone VARCHAR(50),

    -- Additional information
    notes TEXT,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP,
    completed_at TIMESTAMP
);
```

**Booking Status**:
- `pending` - Awaiting confirmation
- `confirmed` - Booking confirmed
- `completed` - Service completed
- `cancelled` - Booking cancelled

**Indexes**:
- `idx_bookings_user_id` - User's bookings
- `idx_bookings_order_id` - Bookings in order
- `idx_bookings_spa_id` - Spa's bookings
- `idx_bookings_date` - Bookings by date
- `idx_bookings_status` - Status filtering

**Usage**:
```sql
-- Create booking
INSERT INTO bookings (order_id, user_id, spa_id, spa_name, treatment, booking_date, booking_time, price)
VALUES (1, 'user-uuid', 123, 'Spa Name', 'Massage', '2025-12-20', '10:00', 1000000);

-- Get spa's upcoming bookings
SELECT * FROM bookings
WHERE spa_id = 123
AND booking_date >= CURRENT_DATE
ORDER BY booking_date, booking_time;

-- Get user's booking history
SELECT * FROM bookings
WHERE user_id = 'user-uuid'
ORDER BY created_at DESC;
```

---

### 5. User Sessions Table

**Purpose**: Track active JWT tokens for authentication

**Schema**:
```sql
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    ip_address VARCHAR(50),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes**:
- `idx_user_sessions_user_id` - User's sessions
- `idx_user_sessions_token_hash` - Token validation

**Usage**:
```sql
-- Store new session
INSERT INTO user_sessions (user_id, token_hash, ip_address, expires_at)
VALUES ('user-uuid', 'hashed-token', '192.168.1.1', NOW() + INTERVAL '7 days');

-- Validate token
SELECT * FROM user_sessions
WHERE token_hash = 'hashed-token'
AND expires_at > NOW();

-- Clean expired sessions
DELETE FROM user_sessions WHERE expires_at < NOW();
```

---

### 6. Admin Logs Table

**Purpose**: Audit trail for admin actions

**Schema**:
```sql
CREATE TABLE admin_logs (
    id SERIAL PRIMARY KEY,
    admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id VARCHAR(100),
    details JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes**:
- `idx_admin_logs_admin_id` - Admin's actions
- `idx_admin_logs_created_at` - Recent actions

**Usage**:
```sql
-- Log admin action
INSERT INTO admin_logs (admin_id, action, entity_type, entity_id, details, ip_address)
VALUES ('admin-uuid', 'user_role_changed', 'user', 'target-user-uuid',
        '{"old_role": "user", "new_role": "spa_owner"}'::jsonb, '192.168.1.1');

-- Get recent admin actions
SELECT al.*, u.email as admin_email
FROM admin_logs al
JOIN users u ON al.admin_id = u.id
ORDER BY created_at DESC
LIMIT 50;
```

---

## 🔄 Triggers & Functions

### Auto-Update Timestamps

```sql
-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## 🔐 Security & Authentication

### Password Storage
- **Algorithm**: bcrypt with salt rounds = 10
- **Field**: `password_hash` (VARCHAR 255)
- **Never store plain text passwords!**

**Example** (Node.js):
```javascript
const bcrypt = require('bcrypt');

// Hash password
const hash = await bcrypt.hash('password123', 10);

// Verify password
const isValid = await bcrypt.compare('password123', hash);
```

### JWT Tokens
- **Storage**: `user_sessions` table
- **Expiry**: 7 days (configurable)
- **Hash**: SHA-256 before storing

---

## 📊 Common Queries

### User Management

```sql
-- Get all users by role
SELECT * FROM users WHERE role = 'user' AND is_active = true;

-- Count users by role
SELECT role, COUNT(*) as count
FROM users
GROUP BY role;

-- Find user by email
SELECT * FROM users WHERE email = 'user@example.com';

-- Deactivate user
UPDATE users SET is_active = false WHERE id = 'user-uuid';
```

### Bookings

```sql
-- Today's bookings
SELECT b.*, u.name as customer_name
FROM bookings b
LEFT JOIN users u ON b.user_id = u.id
WHERE booking_date = CURRENT_DATE
ORDER BY booking_time;

-- Spa's booking statistics
SELECT
    spa_id,
    spa_name,
    COUNT(*) as total_bookings,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
    COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled,
    SUM(price) as total_revenue
FROM bookings
WHERE spa_id = 123
GROUP BY spa_id, spa_name;

-- User's upcoming bookings
SELECT * FROM bookings
WHERE user_id = 'user-uuid'
AND booking_date >= CURRENT_DATE
ORDER BY booking_date, booking_time;
```

### Orders

```sql
-- Recent orders
SELECT o.*,
       u.name as customer_name,
       COUNT(b.id) as booking_count
FROM orders o
LEFT JOIN users u ON o.user_id = u.id
LEFT JOIN bookings b ON o.id = b.order_id
GROUP BY o.id, u.name
ORDER BY o.created_at DESC
LIMIT 20;

-- Order details with bookings
SELECT o.*,
       json_agg(json_build_object(
           'spa_name', b.spa_name,
           'treatment', b.treatment,
           'date', b.booking_date,
           'time', b.booking_time,
           'price', b.price
       )) as bookings
FROM orders o
JOIN bookings b ON o.id = b.order_id
WHERE o.id = 1
GROUP BY o.id;
```

---

## 🔄 Migrations

### Location
All migrations are in: `backend/migrations/`

### Current Migrations
- **001_initial.sql** - Initial schema with all tables

### Running Migrations

**Automatic** (via Docker):
```bash
# Migrations run automatically when container starts
docker-compose up -d
```

**Manual**:
```bash
# Run migration file
docker exec -i balispaguide-postgres psql -U postgres -d balispaguide < backend/migrations/001_initial.sql
```

### Creating New Migrations

1. Create new file: `backend/migrations/002_description.sql`
2. Add SQL commands
3. Run manually:
```bash
docker exec -i balispaguide-postgres psql -U postgres -d balispaguide < backend/migrations/002_description.sql
```

---

## 🧪 Test Data

### Seeded Users

| Email | Name | Role | Password |
|-------|------|------|----------|
| azlan@net1io.com | Azlan (Admin) | admin | admin123 |
| roger@net1io.com | Roger (Test User) | user | user123 |
| spaowner@net1io.com | Spa Owner (Test) | spa_owner | spa123 |

**Note**: Passwords need to be hashed with bcrypt before actual use.

### Creating Test Bookings

```sql
-- Create test order
INSERT INTO orders (order_number, user_id, total_price, status)
VALUES ('ORD-TEST-001', (SELECT id FROM users WHERE email = 'roger@net1io.com'), 2000000, 'completed')
RETURNING id;

-- Create test booking (use order id from above)
INSERT INTO bookings (
    order_id, user_id, spa_id, spa_name, spa_location,
    treatment, booking_date, booking_time, price, status
)
VALUES (
    1,
    (SELECT id FROM users WHERE email = 'roger@net1io.com'),
    1, 'Test Spa', 'Ubud',
    'Balinese Massage', '2025-12-25', '10:00', 1000000, 'confirmed'
);
```

---

## 📈 Performance Optimization

### Indexes
All critical indexes are already created:
- Email lookups (users)
- Role filtering (users)
- Foreign key relationships (all tables)
- Date/status filtering (bookings)

### Query Optimization Tips

```sql
-- Use indexes
SELECT * FROM users WHERE email = 'user@example.com';  -- Uses idx_users_email

-- Avoid full table scans
SELECT * FROM bookings WHERE spa_id = 123;  -- Uses idx_bookings_spa_id

-- Use EXPLAIN to check query performance
EXPLAIN ANALYZE SELECT * FROM bookings WHERE booking_date = '2025-12-20';
```

---

## 🔧 Maintenance

### Backup Database

```bash
# Full backup
docker exec balispaguide-postgres pg_dump -U postgres balispaguide > backup_$(date +%Y%m%d).sql

# Compressed backup
docker exec balispaguide-postgres pg_dump -U postgres balispaguide | gzip > backup_$(date +%Y%m%d).sql.gz
```

### Restore Database

```bash
# Restore from backup
docker exec -i balispaguide-postgres psql -U postgres -d balispaguide < backup_20251215.sql

# Restore compressed backup
gunzip -c backup_20251215.sql.gz | docker exec -i balispaguide-postgres psql -U postgres -d balispaguide
```

### Clean Old Sessions

```sql
-- Delete expired sessions (run daily)
DELETE FROM user_sessions WHERE expires_at < NOW();

-- Delete old admin logs (run monthly, keep 90 days)
DELETE FROM admin_logs WHERE created_at < NOW() - INTERVAL '90 days';
```

---

## 🌐 Environment-Specific Settings

### Development (.env.local)

**Location**: `backend/.env.local`

**Full Configuration**:
```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://postgres:dev_password@localhost:5432/balispaguide

# JWT Authentication
JWT_SECRET=local_dev_secret_key_change_in_production_12345
SESSION_EXPIRY=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@balispaguide.com
```

**Important Notes**:
- This file is **already created** and configured
- The `dotenv` package loads this file automatically via `backend/config/db.js`
- **DO NOT commit** this file to git (add to `.gitignore`)

### Staging (.env.staging)
```env
DATABASE_URL=postgresql://user:password@staging-host:5432/balispaguide
```

### Production (.env.production)
```env
DATABASE_URL=postgresql://user:secure_password@production-host:5432/balispaguide
```

---

## 🧪 Testing Database Connection

### Quick Test Script

**Location**: `backend/test-db.js` (already created)

**Run the test**:
```bash
# From project root
node backend/test-db.js
```

**Expected Output**:
```
✅ DATABASE CONNECTION SUCCESSFUL!

📊 Connection Details:
  Database: balispaguide
  Current Time: 2025-12-15T11:08:30.193Z
  PostgreSQL Version: 15.15
  Tables Created: 6
  Test Users: 3

✅ All database tests passed!
```

### Required Backend Dependencies

All dependencies are already installed in `backend/package.json`:

```json
{
  "dependencies": {
    "bcrypt": "^5.1.1",        // Password hashing
    "cors": "^2.8.5",          // Cross-origin requests
    "csv-parse": "^6.1.0",     // CSV file parsing
    "dotenv": "^16.4.7",       // Environment variables
    "express": "^5.2.1",       // Web framework
    "jsonwebtoken": "^9.0.2",  // JWT authentication
    "nodemailer": "^7.0.11",   // Email sending
    "pg": "^8.13.1"            // PostgreSQL driver
  }
}
```

**To reinstall dependencies**:
```bash
cd backend && npm install
```

---

## 🚨 Troubleshooting

### Can't connect to database

**Error**: `database "balispaguide" does not exist`

**Solution**: Check if you have multiple PostgreSQL instances running
```bash
# Check what's using port 5432
lsof -i :5432

# If you see Homebrew PostgreSQL, stop it
brew services stop postgresql@14
# or
brew services stop postgresql@16

# Only Docker's PostgreSQL should be running
docker ps | grep postgres
```

**Other checks**:
```bash
# Check Docker is running
docker ps

# Check logs
docker logs balispaguide-postgres

# Restart container
docker-compose restart postgres
```

### Tables not created
```bash
# Re-run migrations
docker exec -i balispaguide-postgres psql -U postgres -d balispaguide < backend/migrations/001_initial.sql
```

### Slow queries
```sql
-- Check current queries
SELECT pid, query, state FROM pg_stat_activity WHERE state = 'active';

-- Check table sizes
SELECT schemaname, tablename,
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 📚 Related Documentation

- **[dev_guide.md](dev_guide.md)** - Local development setup
- **[docker_postgresql_success.md](docker_postgresql_success.md)** - Docker setup guide
- **[plan.md](plan.md)** - Development timeline
- **backend/migrations/001_initial.sql** - Full schema definition
- **backend/config/db.js** - Database connection code

---

## 🔗 Useful Links

- PostgreSQL Documentation: https://www.postgresql.org/docs/15/
- pgAdmin Documentation: https://www.pgadmin.org/docs/
- Node.js pg module: https://node-postgres.com/
- bcrypt: https://www.npmjs.com/package/bcrypt
- JWT: https://jwt.io/

---

**Last Updated**: December 15, 2025
**Database Version**: PostgreSQL 15
**Schema Version**: 001 (Initial)
