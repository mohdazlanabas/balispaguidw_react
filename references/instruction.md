# Bali Spa Guide - Investor Demo Instructions

## Quick Start Guide
This document provides step-by-step instructions for investors to explore all features and user roles in the Bali Spa Guide application.

---

## Access Information

**Application URL**: http://localhost:5173
**Database Admin Panel**: http://localhost:5050

### Prerequisites
Ensure the application is running:
```bash
# Start database
docker-compose up -d

# Start backend (in backend folder)
node server.js

# Start frontend (in frontend folder)
npm run dev
```

---

## Role 1: General Visitor (Non-Logged In)

**Purpose**: Browse spas without registration

### What to Test:

1. **Browse Spa Directory**
   - Visit: http://localhost:5173
   - View spa listings with photos, ratings, and treatments
   - See pricing: Rp 1,000,000 per treatment

2. **Filter & Search**
   - Click "Locations" to view 28 location categories
   - Click "Treatments" to view 20 treatment types
   - Use search bar to find specific spas
   - Try budget filters

3. **Sorting Options**
   - Test 6 sorting options:
     - Rating: High to Low / Low to High
     - Price: High to Low / Low to High
     - Alphabetically: A-Z / Z-A

4. **Shopping Cart**
   - Click on any spa card
   - Select a treatment from dropdown
   - Click "Add to Cart"
   - Notice cart badge updates in header
   - Go to Cart page
   - **Note**: As a visitor, you can browse but limited features available

5. **Login Prompt**
   - Notice "Login" button in top-right corner
   - This is how visitors become registered users

---

## Role 2: Registered User (Customer)

**Purpose**: Book spa treatments and manage appointments

### Login Credentials:
- **Email**: roger@net1io.com
- **Password**: user123

### What to Test:

1. **Login Process**
   - Click "Login" button (top-right)
   - Enter credentials above
   - Observe automatic redirect to "My Account" page
   - Notice header now shows:
     - User name: "Roger (User)"
     - Blue role badge: "user"
     - Logout button

2. **My Account Dashboard**
   - View user profile information
   - Click "Go to Spa Guide" button to browse

3. **Full Shopping Experience**
   - Browse spas (Home, Locations, Treatments)
   - Add multiple treatments to cart
   - Go to Cart page

4. **Cart Management**
   - For each item, select:
     - **Date**: Using date picker (today or future)
     - **Time**: Choose from 8 time slots (9 AM - 4 PM)
   - Remove items with delete button
   - Notice "Proceed to Payment" only enables when ALL items have date & time

5. **Payment Process**
   - Click "Proceed to Payment"
   - Review booking summary:
     - Each spa with treatment, date, time
     - Individual prices
     - Total price in Indonesian Rupiah
   - Click "Confirm Payment"
   - Cart clears and redirects to home

6. **Persistent Login**
   - Navigate between pages (Home, Locations, Treatments, Cart)
   - Notice you remain logged in
   - User info stays visible in header

7. **Logout**
   - Click "Logout" button
   - Observe redirect to homepage
   - Header now shows "Login" button again

---

## Role 3: Spa Owner

**Purpose**: Manage spa business (dashboard functionality)

### Login Credentials:
- **Email**: spaowner@net1io.com
- **Password**: spa123

### What to Test:

1. **Login Process**
   - Logout from Roger's account if logged in
   - Click "Login" button
   - Enter spa owner credentials
   - Observe automatic redirect to "Spa Owner Dashboard"

2. **Spa Owner Dashboard**
   - Notice header shows:
     - Name: "Spa Owner (Spa Owner)"
     - Orange/amber role badge: "spa_owner"
     - **Only** Logout button (no "Go to Spa Guide")
   - View spa owner specific interface
   - Note: Future features will include:
     - Manage spa listings
     - View bookings
     - Update availability
     - Business analytics

3. **Navigation**
   - Click on "Bali Spa Directory" logo to go home
   - Notice you remain logged in as spa owner
   - Can browse spa directory like any user

4. **Return to Dashboard**
   - Click on your name in header
   - Returns to Spa Owner Dashboard

---

## Role 4: Administrator

**Purpose**: System administration and user management

### Login Credentials:
- **Email**: azlan@net1io.com
- **Password**: admin123

### What to Test:

1. **Login Process**
   - Logout from spa owner account
   - Click "Login" button
   - Enter admin credentials
   - Observe automatic redirect to "Admin Dashboard"

2. **Admin Dashboard**
   - Notice header shows:
     - Name: "Azlan (Admin)"
     - Red role badge: "admin"
     - Logout button

3. **User Management**
   - **Users Table** displays all registered users:
     - Name
     - Email
     - Phone number
     - Role (with color-coded badges)
     - Status (Active/Inactive)
     - Registration date

   - **Statistics Cards**:
     - Total Users count
     - Spa Owners count
     - Regular Users count

4. **Role Identification**
   - Admin badges: Red
   - Spa Owner badges: Orange/Amber
   - User badges: Blue

5. **Navigation Privileges**
   - Admins can navigate entire site
   - Click "Bali Spa Directory" to browse spas
   - Remain logged in while exploring
   - Click admin name to return to dashboard

---

## Key Features to Highlight to Investors

### 1. Role-Based Access Control
- **4 distinct user roles** with different permissions
- **Automatic routing** based on role after login
- **Persistent authentication** across all pages
- **Color-coded role badges** for easy identification

### 2. Complete Booking System
- **Treatment selection** from dropdown on spa cards
- **Mandatory date/time booking** prevents incomplete bookings
- **Real-time validation** ensures data integrity
- **Cart persistence** using localStorage
- **Price transparency** (Rp 1,000,000 per treatment)

### 3. Professional UI/UX
- **Clean, modern design** with blue theme
- **Responsive layout** for all devices
- **Intuitive navigation** with 4 main pages
- **Visual feedback** on all actions
- **Role-specific interfaces** optimized for each user type

### 4. Scalability & Security
- **PostgreSQL database** (production-ready)
- **JWT authentication** with bcrypt encryption
- **Session management** with 7-day token expiry
- **Docker containerization** for easy deployment
- **RESTful API architecture** for future integrations

### 5. Business Intelligence
- **Admin analytics** showing user statistics
- **User management** capabilities
- **Audit trail** via database logs
- **Email notifications** system ready (Phase 4 complete)

---

## Technical Stack Highlights

- **Frontend**: React 19.2.1 + Vite
- **Backend**: Node.js + Express 5.2.1
- **Database**: PostgreSQL 15.15 (Docker)
- **Authentication**: JWT + bcrypt
- **Routing**: React Router DOM with role-based redirects
- **State Management**: Context API + localStorage

---

## Development Progress

**Current Status**: 35% Complete (Days 1-3 of 10)

**Completed Features**:
- ✅ User authentication & authorization
- ✅ Role-based access control
- ✅ Shopping cart system
- ✅ Payment flow (simulation)
- ✅ Email notifications
- ✅ PostgreSQL database with migrations
- ✅ Admin dashboard
- ✅ User management

**Next Phase** (Day 4):
- Protected routes with middleware
- Password reset functionality
- Session expiry handling
- Enhanced security features

---

## Testing Sequence for Best Demo Flow

1. **Start as Visitor** (2 minutes)
   - Browse spas, show filtering/sorting
   - Add items to cart to show functionality

2. **Login as Regular User** (3 minutes)
   - Show complete booking process
   - Demonstrate date/time selection
   - Complete a mock payment

3. **Login as Spa Owner** (2 minutes)
   - Show dedicated dashboard
   - Highlight future business features

4. **Login as Admin** (3 minutes)
   - Show user management table
   - Display statistics
   - Highlight system control

**Total Demo Time**: ~10 minutes

---

## Questions Investors Often Ask

**Q: Is the payment real?**
A: Currently simulated. Stripe integration is planned for Phase 3.

**Q: Can this scale?**
A: Yes. PostgreSQL database, Docker containerization, and RESTful API architecture support enterprise-scale deployment.

**Q: What about mobile?**
A: Responsive design works on all devices. Native mobile apps can be added using React Native with same backend.

**Q: Data security?**
A: JWT authentication, bcrypt password hashing (10 rounds), session management, and HTTPS ready.

**Q: How long to production?**
A: Core features complete. Remaining: payment integration, protected routes, and deployment optimization (~7 days development).

---

## Support & Documentation

- **Full Documentation**: See `.claude/project.md`
- **Database Schema**: See `references/database.md`
- **Login Credentials**: See `references/login.md`
- **Deployment Guide**: See `deployment.md`
- **Development Guide**: See `references/dev_guide.md`

---

**Last Updated**: December 16, 2025
**Version**: 1.0 (Days 1-3 Complete)
