# Login Credentials Reference

Complete list of test accounts for local development.

---

## 🔐 Test User Accounts

### 1. Regular User (Roger)

**Login URL**: http://localhost:5173/login

**Credentials:**
- **Email**: `roger@net1io.com`
- **Password**: `user123`

**Account Details:**
- **Name**: Roger (Test User)
- **Role**: `user`
- **Phone**: +1234567890
- **Redirects to**: `/account` (MyAccount Page)

**What you can do:**
- Browse spa listings
- Add spas to cart
- Make bookings
- View account information
- Access "Go to Bali Spa Guide" button

---

### 2. Spa Owner

**Login URL**: http://localhost:5173/login

**Credentials:**
- **Email**: `spaowner@net1io.com`
- **Password**: `spa123`

**Account Details:**
- **Name**: Spa Owner (Test)
- **Role**: `spa_owner`
- **Phone**: +62-821-1234-5678
- **Redirects to**: `/spa-owner` (Spa Owner Dashboard)

**What you can do:**
- View spa owner dashboard
- See coming soon features (bookings, revenue, etc.)
- Access "Back to Spa Guide" button
- Logout functionality

---

### 3. Admin (Azlan)

**Login URL**: http://localhost:5173/login

**Credentials:**
- **Email**: `azlan@net1io.com`
- **Password**: `admin123`

**Account Details:**
- **Name**: Azlan (Admin)
- **Role**: `admin`
- **Phone**: Not set
- **Redirects to**: `/admin` (Admin page - not yet created)

**What you can do:**
- Full system administrator access
- Manage all users, spas, and bookings (features coming soon)

---

## 📊 pgAdmin Database Access

**Login URL**: http://localhost:5050

**Credentials:**
- **Email**: `azlan@net1io.com`
- **Password**: `treasure2020a`

**Database Connection:**
- **Host**: `postgres`
- **Port**: `5432`
- **Database**: `balispaguide`
- **Username**: `postgres`
- **Password**: `dev_password`

---

## 🔄 Role-Based Redirects

After successful login, users are redirected based on their role:

| Role | Email | Redirect URL | Page |
|------|-------|--------------|------|
| `user` | roger@net1io.com | `/account` | MyAccount Page |
| `spa_owner` | spaowner@net1io.com | `/spa-owner` | Spa Owner Dashboard |
| `admin` | azlan@net1io.com | `/admin` | Admin Dashboard (TBD) |

---

## 🧪 Testing Login Flow

### Test Regular User (Roger):
```bash
# 1. Open login page
open http://localhost:5173/login

# 2. Enter credentials
Email: roger@net1io.com
Password: user123

# 3. Should redirect to /account
# 4. Click "Go to Bali Spa Guide" → Returns to homepage
```

### Test Spa Owner:
```bash
# 1. Open login page
open http://localhost:5173/login

# 2. Enter credentials
Email: spaowner@net1io.com
Password: spa123

# 3. Should redirect to /spa-owner
# 4. Click "Back to Spa Guide" → Returns to homepage
```

### Test Admin:
```bash
# 1. Open login page
open http://localhost:5173/login

# 2. Enter credentials
Email: azlan@net1io.com
Password: admin123

# 3. Should redirect to /admin (or /account if admin page not created)
```

---

## 📝 Password Reset

Currently, there is no password reset functionality. If you need to change a password:

```sql
-- In pgAdmin or psql, run:
UPDATE users 
SET password_hash = '$2b$10$newHashHere'
WHERE email = 'user@example.com';
```

**Note**: Use bcrypt to hash passwords before storing them.

---

## 🔒 Security Notes

**IMPORTANT - For Development Only:**
- These credentials are for **local development only**
- **DO NOT** use these passwords in production
- All passwords should be changed before deploying to production
- The JWT secret in `.env.local` is also for development only

**Production Security:**
- Use strong, unique passwords
- Enable 2FA for admin accounts
- Rotate JWT secrets regularly
- Use environment-specific `.env` files
- Never commit credentials to git

---

## 🆘 Troubleshooting

### "Invalid credentials" error:
```bash
# Check if user exists in database
docker exec balispaguide-postgres psql -U postgres -d balispaguide -c "SELECT email, name, role FROM users;"
```

### Can't login:
1. Check backend is running: http://localhost:4000
2. Check database is running: `docker ps | grep postgres`
3. Check browser console for errors (F12)

### Session expired:
1. Logout and login again
2. Clear browser localStorage
3. Check JWT_SECRET in `backend/.env.local`

---

## 📧 Email Addresses Summary

Quick reference for all test accounts:

```
Regular User:  roger@net1io.com      (password: user123)
Spa Owner:     spaowner@net1io.com   (password: spa123)
Admin:         azlan@net1io.com      (password: admin123)
```

All emails use `@net1io.com` domain for easy testing.

---

**Last Updated**: 2025-12-16
