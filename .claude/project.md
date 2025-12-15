# Bali Spa Guide - Project Documentation

## Project Overview
A full-stack web application for browsing and booking spa treatments in Bali. Features multi-page navigation, shopping cart system with mandatory date/time booking, and comprehensive filtering/sorting capabilities.

## Tech Stack

### Backend
- **Runtime**: Node.js with Express 5.2.1
- **Port**: 4000
- **Data**: CSV-based (bsg_spas.csv) with 1059 spas + PostgreSQL for users/bookings
- **Database**: PostgreSQL 15.15 (Docker for local, Cloud SQL for production)
- **Authentication**: JWT with bcrypt password hashing (10 rounds)
- **Session Management**: JWT tokens stored in user_sessions table with 7-day expiry
- **APIs**: RESTful endpoints for filters, spa listings, auth, bookings, user management
- **Dependencies**: express, cors, csv-parse, pg, bcrypt, jsonwebtoken, nodemailer, dotenv

### Frontend
- **Framework**: React 19.2.1
- **Build Tool**: Vite 7.2.7
- **Routing**: React Router DOM 7.10.1 with role-based redirects
- **Port**: 5173 (development)
- **State Management**: React Context API (CartContext) + localStorage for auth
- **Storage**: localStorage for cart + JWT token + user data
- **Authentication**: JWT stored in localStorage with user info (id, email, name, role)
- **Authorization**: Role-based pages (user, spa_owner, admin)
- **Theme**: Professional blue (#1e3a8a primary, #3b82f6 accent) + role-specific colors

## Architecture

### Backend Structure
```
backend/
├── config/
│   └── db.js                   # PostgreSQL connection pool with dotenv
├── middleware/
│   └── auth.js                 # JWT authentication + role checking
├── routes/
│   └── auth.js                 # Register, login, logout, me, users (admin)
├── migrations/
│   └── 001_initial.sql         # Complete schema with 6 tables + seed data
├── server.js                   # Express server with CORS, API routes
├── spaData.js                  # CSV parser, filtering, sorting logic
├── emailService.js             # Email notifications
├── bsg_spas.csv                # Spa directory data (1059 spas)
├── .env.local                  # Local dev config (DB, JWT, CORS)
├── test-db.js                  # Database connection test
├── test-all-logins.js          # Verify all test accounts
├── test-login-api.js           # API endpoint testing
├── fix-passwords.js            # Password hash generator
└── package.json                # Dependencies and scripts
```

### Frontend Structure
```
frontend/
├── src/
│   ├── main.jsx                    # Router setup with all routes
│   ├── pages/
│   │   ├── HomePage.jsx            # Main directory with filters + Header
│   │   ├── LocationPage.jsx        # 28 location cards + filtered view
│   │   ├── TreatmentPage.jsx       # 20 treatment cards + filtered view
│   │   ├── CartPage.jsx            # Cart management with pricing
│   │   ├── PaymentPage.jsx         # Booking summary with total
│   │   ├── PaymentSuccessPage.jsx  # Payment confirmation
│   │   ├── MyAccountPage.jsx       # User profile with "Go to Spa Guide"
│   │   ├── SpaOwnerPage.jsx        # Spa owner dashboard
│   │   ├── AdminPage.jsx           # Admin users list + stats
│   │   └── auth/
│   │       ├── LoginPage.jsx       # User login with role redirects
│   │       └── RegisterPage.jsx    # User registration
│   ├── components/
│   │   ├── Header.jsx              # Nav + cart badge + login/logout
│   │   ├── SpaCard.jsx             # Treatment selection + Add to Cart
│   │   ├── SortDropdown.jsx        # 6 sort options
│   │   ├── FilterBar.jsx           # Location/treatment/budget filters
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx       # Login form component
│   │   │   └── RegisterForm.jsx    # Registration form component
│   │   └── [other components]
│   ├── context/
│   │   └── CartContext.jsx         # Cart state + TREATMENT_PRICE
│   └── styles.css                  # Complete styling (~2176 lines)
└── [config files]
```

## Features

### 1. Multi-Page Navigation
- **Home** (`/`): Main spa directory with filters, sorting, pagination
- **Locations** (`/locations`, `/locations/:location`): 28 location cards or filtered spa list
- **Treatments** (`/treatments`, `/treatments/:treatment`): 20 treatment cards or filtered spa list
- **Cart** (`/cart`): Shopping cart management
- **Payment** (`/payment`): Booking confirmation
- **Auth Pages**:
  - `/login`: User login with role-based redirects
  - `/register`: New user registration
  - `/account`: Regular user profile (roger@net1io.com)
  - `/spa-owner`: Spa owner dashboard (spaowner@net1io.com)
  - `/admin`: Admin dashboard with users table (azlan@net1io.com)

### 2. Sorting Options (6 Total)
- Rating: High to Low / Low to High
- Price: High to Low / Low to High
- Alphabetically: A-Z / Z-A

### 3. Shopping Cart System
- Treatment selection dropdown on spa cards
- "Add to Cart" button with success feedback
- Cart badge in header showing item count
- localStorage persistence across sessions
- All treatments visible as badges (no slice limit)
- Price display: Rp 1,000,000 per treatment

### 4. Cart Management
- Mandatory date selection (HTML5 date picker, min=today)
- Mandatory time selection (9:00 AM - 4:00 PM hourly slots)
- Delete items with confirmation
- Real-time validation
- Payment button enabled only when ALL items complete
- Individual and total pricing display

### 5. Payment Flow
- Booking summary with numbered items
- Display: spa, location, treatment, price, date, time
- Formatted total price (Indonesian Rupiah)
- Confirmation clears cart and returns home

### 6. User Authentication & Authorization
- JWT-based authentication with bcrypt password hashing
- Login/logout functionality with token management
- User registration with email validation
- Role-based access control (user, spa_owner, admin)
- Persistent login state across pages using localStorage
- Header displays login/logout button based on auth state
- User info display with role badges in header
- Automatic role-based redirects on login

### 7. User Account Pages
- **My Account** (`/account`): User profile for regular users with "Go to Spa Guide" button
- **Spa Owner Dashboard** (`/spa-owner`): Spa owner interface with logout only
- **Admin Dashboard** (`/admin`): Complete user management with:
  - Users table showing all registered users
  - Stats cards (total users, spa owners, regular users)
  - User details (name, email, phone, role, status, created date)
  - Role badges and status indicators
  - Admin-only access with role verification

## Data Model

### Spa Object (from CSV)
```javascript
{
  nid: string,
  title: string,
  email: string,
  phone: string,
  address: string,
  website: string,
  location: string,
  budget: string,        // e.g., "More than Rp 500.000"
  rating: number,        // 1-5
  opening_hour: string,  // e.g., "09:00"
  closing_hour: string,  // e.g., "20:00"
  treatments: string[]   // Parsed from semicolon-separated string
}
```

### Cart Item
```javascript
{
  id: number,              // timestamp
  spaId: string,
  spaName: string,
  spaLocation: string,
  treatment: string,
  price: number,           // 1000000 (Rp 1,000,000)
  date: string,            // YYYY-MM-DD format
  time: string             // "09:00 AM" format
}
```

## API Endpoints

### GET /api/filters
Returns available filter options:
```javascript
{
  locations: string[],    // 28 unique locations
  treatments: string[],   // 20 unique treatments
  budgets: string[]       // Budget ranges
}
```

### GET /api/spas
Query parameters:
- `page`: number (default: 1)
- `pageSize`: number (default: 9)
- `location`: string (filter by location)
- `treatment`: string (filter by treatment)
- `budget`: string (filter by budget)
- `search`: string (search in name/address/location)
- `sort`: string (rating_desc|rating_asc|budget_desc|budget_asc|title_asc|title_desc)

Returns:
```javascript
{
  spas: Spa[],
  total: number,
  page: number,
  pageSize: number,
  totalPages: number
}
```

### GET /api/spas/:id
Returns single spa object by ID.

### POST /api/auth/register
Register a new user account.
Request body:
```javascript
{
  email: string,      // Required, validated format
  password: string,   // Required, min 6 characters
  name: string,       // Required
  phone: string       // Optional
}
```

Returns:
```javascript
{
  success: true,
  message: "User registered successfully.",
  user: {
    id: number,
    email: string,
    name: string,
    phone: string,
    role: string,
    created_at: timestamp
  }
}
```

### POST /api/auth/login
Authenticate user and receive JWT token.
Request body:
```javascript
{
  email: string,
  password: string
}
```

Returns:
```javascript
{
  success: true,
  message: "Login successful.",
  token: string,      // JWT token (7-day expiry)
  user: {
    id: number,
    email: string,
    name: string,
    phone: string,
    role: string      // "user" | "spa_owner" | "admin"
  }
}
```

### POST /api/auth/logout
Logout user and invalidate token (requires authentication).

### GET /api/auth/me
Get current user information (requires authentication).

### GET /api/users
Get all registered users (admin only, requires authentication).

## Running the Application

### Development Mode (with Docker)

**Step 1: Start PostgreSQL**
```bash
docker-compose up -d
# Wait 10 seconds for database to initialize
docker logs balispaguide-postgres
```

**Step 2: Start Application**
```bash
# Option 1: Using root npm scripts (recommended)
npm run dev:backend      # Backend only (port 4000)
npm run dev:frontend     # Frontend only (port 5173)

# Option 2: Manual commands
cd backend
node server.js

# Frontend (separate terminal)
cd frontend
npm run dev
```

**Access Points:**
- Frontend: http://localhost:5173
- Backend: http://localhost:4000
- Database UI: http://localhost:5050 (pgAdmin)
  - Email: `azlan@net1io.com`
  - Password: `treasure2020a`

**Test Accounts** (see [references/login.md](../references/login.md) for details):
- **Regular User**: roger@net1io.com / user123
- **Spa Owner**: spaowner@net1io.com / spa123
- **Admin**: azlan@net1io.com / admin123

**Stop Everything:**
```bash
# Stop Docker containers
docker-compose down

# Or keep data and just stop
docker-compose stop
```

### Production Build
```bash
cd frontend
npm run build              # Creates dist/ folder
npm run preview            # Preview production build
```

## Environment Variables

### Backend (.env.local)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT token signing
- `SESSION_EXPIRY`: Token expiration time (default: 7d)
- `PORT`: Server port (default: 4000)
- `NODE_ENV`: Environment (development/production)
- `CORS_ORIGIN`: Allowed origin for CORS (default: http://localhost:5173)
- `EMAIL_SERVICE`: Email service provider (gmail/sendgrid)
- `EMAIL_FROM`: Sender email address
- `SENDGRID_API_KEY` or Gmail credentials: Email service authentication

### Frontend
- `VITE_API_BASE`: Backend API URL (default: http://localhost:4000)

## Deployment

### Current Production (Digital Ocean)
- **Server**: Digital Ocean Droplet at 170.64.148.27
- **Backend**: PM2 running on port 4000
- **Frontend**: Nginx serving built files from /var/www/balispaguide
- **Deployment**: Automated via deploy.sh script
- **Guide**: See [deployment.md](../deployment.md) for complete guide

### Email Configuration
- **Service**: Gmail/SendGrid (configurable via .env)
- **Customer Emails**: Booking confirmations sent to customer
- **Spa Emails**: Booking notifications sent to azlan@net1io.com
- **Guide**: See [references/email_deploy.md](../references/email_deploy.md)

### Alternative Deployment Options
- **Google Cloud**: See [references/deploy_gcp.md](../references/deploy_gcp.md)
- **DigitalOcean App Platform**: See [references/deploy_digitalcoean.md](../references/deploy_digitalcoean.md)

## Planned Features (In Development)

### Phase 1: Current State ✅
- 3-page navigation with routing
- 6 sort options including alphabetical
- Shopping cart with treatment selection
- Mandatory date/time booking (9 AM - 4 PM)
- Payment flow with confirmation
- Full pricing display (Rp 1,000,000 per treatment)
- localStorage persistence

### Phase 2: User Authentication ✅ (Completed)
- ✅ Login page with JWT authentication
- ✅ User registration with email validation
- ✅ Role-based access control (user, spa_owner, admin)
- ✅ Session management with token storage
- ✅ Persistent login state across pages
- ✅ Header with login/logout functionality
- ✅ User account pages (My Account, Spa Owner, Admin)
- ✅ Admin dashboard with user management
- ⏳ Password reset functionality (planned)
- ⏳ Protected routes with middleware (planned)
- ⏳ User booking history (planned)

### Phase 3: Payment Integration (Planned)
- Stripe payment processing
- Secure checkout flow
- Real-time payment confirmation
- Receipt generation
- Refund handling
- Payment history

### Phase 4: Email Notifications ✅ (Completed)
- Email confirmation system (nodemailer)
- Customer booking confirmations with details
- Spa notification emails with customer info
- Gmail/SendGrid configuration support
- HTML-formatted email templates

### Phase 5: Database Migration ✅ (Completed)
- ✅ PostgreSQL 15.15 setup with Docker
- ✅ User accounts table with authentication
- ✅ User sessions table for JWT management
- ✅ Spa owners table
- ✅ Bookings table
- ✅ Orders table for payment tracking
- ✅ Admin logs table
- ✅ Database migrations system
- ✅ Auto-updating timestamps with triggers
- ⏳ Cloud SQL deployment (planned)
- ⏳ Spa favorites/wishlist (planned)

### Phase 6: Additional Features (Planned)
- SMS notifications (Twilio)
- Spa availability calendar
- Loyalty programs
- Gift vouchers
- Social media integration
- Custom domain and SSL/HTTPS

## Code Standards

### Naming Conventions
- Components: PascalCase (e.g., `SpaCard.jsx`)
- Files: camelCase or kebab-case
- CSS classes: kebab-case (e.g., `spa-card`)
- Functions: camelCase
- Constants: UPPER_SNAKE_CASE (e.g., `TREATMENT_PRICE`)

### Component Structure
```javascript
import statements
// Component definition
export default ComponentName
```

### Context Pattern
```javascript
// Create Context
const CartContext = createContext()

// Provider Component
export const CartProvider = ({ children }) => { ... }

// Custom Hook
export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
```

## Testing

### Manual Testing Checklist

**Spa Directory & Shopping:**
- [x] All 3 pages load correctly
- [x] Navigation works (Home, Locations, Treatments, Cart)
- [x] Location filter shows 28 cards, clicking filters spas
- [x] Treatment filter shows 20 cards, clicking filters spas
- [x] All 6 sort options work (rating, budget, alphabetical)
- [x] Add to Cart shows success message
- [x] Cart badge shows correct count
- [x] Cart persists after page refresh
- [x] Date picker prevents past dates
- [x] Time dropdown shows 9 AM - 4 PM (8 slots)
- [x] Payment button disabled until all items complete
- [x] Payment page shows all bookings with prices
- [x] Total price calculates correctly
- [x] Confirm payment clears cart and redirects home
- [x] Pricing displays as Rp 1,000,000 per treatment
- [x] All treatments visible on spa cards

**Authentication & User Management:**
- [x] User registration works with validation
- [x] User login with all three test accounts
- [x] JWT token stored in localStorage
- [x] Login state persists across page navigation
- [x] Header shows login button when not authenticated
- [x] Header shows user info + logout when authenticated
- [x] Role-based redirects on login (user→account, spa_owner→spa-owner, admin→admin)
- [x] My Account page displays for regular users
- [x] Spa Owner page displays for spa owners
- [x] Admin page shows all users table
- [x] Admin page shows user statistics
- [x] Logout clears token and redirects to home
- [ ] Protected routes redirect unauthenticated users
- [ ] Password reset functionality
- [ ] Session expiry handling

## Known Issues/Limitations
- Payment is simulated (Stripe integration planned)
- No protected routes middleware yet (Day 4 task)
- No password reset functionality yet
- No session expiry handling on frontend yet
- No SMS notifications yet (Twilio integration planned)
- No actual spa availability checking
- Spa data still CSV-based (functional PostgreSQL for users/bookings)

## Git Repository
- **Branch**: main
- **Remote**: [To be configured]
- **Last Commit**: "Initial commit - balispaguidw_react" (3ccf45d)

## Support Resources
- **README.md**: User-facing documentation
- **references/plan.md**: Development timeline and task tracking (Days 1-3 completed)
- **references/dev_guide.md**: Complete local development guide with Docker
- **references/database.md**: Complete database documentation and schema
- **references/login.md**: Test account credentials and access details
- **deployment.md**: Production deployment guide
- **docker-compose.yml**: Local PostgreSQL + pgAdmin setup
- **backend/migrations/001_initial.sql**: Complete database schema with seed data
- **backend/config/db.js**: Database connection with environment variables
- **backend/middleware/auth.js**: JWT authentication and role verification
- **backend/routes/auth.js**: Authentication endpoints
- **backend/test-db.js**: Database connection testing script
- **backend/test-login-api.js**: Login API endpoint testing script
- **frontend/src/context/CartContext.jsx**: Cart system implementation

## Development Notes

### Color Theme
- Primary: `#1e3a8a` (deep blue)
- Accent: `#3b82f6` (bright blue)
- Background: `#f0f4f8` (light blue-grey)
- Border: `#cbd5e1` (grey)
- Hover: `#e0e7ff` (light purple-blue)
- Success: `#10b981` (green)
- Error: `#ef4444` (red)

### Role Badge Colors
- Admin: `#ef4444` (red gradient)
- Spa Owner: `#f59e0b` (amber/orange gradient)
- User: `#3b82f6` (blue gradient)

### Time Slots
```javascript
const TIME_SLOTS = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
];
```

### Pricing
```javascript
const TREATMENT_PRICE = 1000000; // Rp 1,000,000 per treatment
```

### Indonesian Rupiah Formatting
```javascript
const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
};
// Result: "Rp1.000.000"
```

## Recent Changes

### Day 3 (December 16, 2025) - Authentication UI & Admin Dashboard
- ✅ Added login/logout buttons to Header with conditional display
- ✅ Implemented persistent login state across all pages
- ✅ Created user info display in header with role badges
- ✅ Removed "Back to Spa Guide" from Spa Owner page (logout only)
- ✅ Created AdminPage with users table and statistics
- ✅ Added GET /api/users endpoint (admin-only)
- ✅ Implemented role-based navigation on login
- ✅ Added comprehensive CSS for auth UI (283 lines)
- ✅ All test accounts verified working with API

### Day 2 (December 15, 2025) - Database Setup & Authentication Backend
- ✅ Set up PostgreSQL 15.15 with Docker Compose
- ✅ Created complete database schema (6 tables with migrations)
- ✅ Implemented JWT authentication with bcrypt
- ✅ Created auth routes (register, login, logout, me)
- ✅ Added user session management
- ✅ Created test scripts (test-db.js, test-login-api.js, fix-passwords.js)
- ✅ Updated pgAdmin credentials (azlan@net1io.com / treasure2020a)
- ✅ Created comprehensive database.md documentation
- ✅ Created login.md with all test account credentials
- ✅ Fixed password hashing for all test accounts

### Day 1 (December 14, 2025) - Initial Deployment
- ✅ Deployed to Digital Ocean (http://170.64.148.27)
- ✅ Implemented email notification system with nodemailer
- ✅ Created automated deployment script (deploy.sh)
- ✅ Added customer and spa booking email confirmations
- ✅ Created comprehensive deployment guide (deployment.md)
- ✅ Set up PM2 process manager for backend
- ✅ Configured Nginx for frontend hosting and API proxy
- ✅ Added pricing display to all pages
- ✅ Made all treatments visible on spa cards
- ✅ Implemented shopping cart with localStorage
- ✅ Added mandatory date/time booking
- ✅ Created payment flow

---

**Last Updated**: December 16, 2025
**Project Status**: Development Active - Days 1-3 Complete (35% done)
**Production URL**: http://170.64.148.27
**Current Phase**: Authentication & User Management ✅
**Next Phase**: Protected Routes & Middleware (Day 4)

## Progress Tracking
- **Completed**: Days 1, 2, 3 (ahead of schedule)
- **Progress**: 35% (3.5/10 days)
- **Next Session**: Day 4 - Protected Routes & Security
  - Create ProtectedRoute component
  - Create RoleRoute component
  - Protect API endpoints
  - Test unauthorized access redirects
  - Add session expiry handling
  - Implement password change functionality
