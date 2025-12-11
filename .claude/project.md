# Bali Spa Guide - Project Documentation

## Project Overview
A full-stack web application for browsing and booking spa treatments in Bali. Features multi-page navigation, shopping cart system with mandatory date/time booking, and comprehensive filtering/sorting capabilities.

## Tech Stack

### Backend
- **Runtime**: Node.js with Express 5.2.1
- **Port**: 4000
- **Data**: CSV-based (bsg_spas.csv) with 1059 spas
- **APIs**: RESTful endpoints for filters, spa listings, and spa details
- **Dependencies**: express, cors, csv-parse

### Frontend
- **Framework**: React 19.2.1
- **Build Tool**: Vite 7.2.7
- **Routing**: React Router DOM 7.10.1
- **Port**: 5173 (development)
- **State Management**: React Context API (CartContext)
- **Storage**: localStorage for cart persistence
- **Theme**: Professional blue (#1e3a8a primary, #3b82f6 accent)

## Architecture

### Backend Structure
```
backend/
├── server.js           # Express server with CORS, API routes
├── spaData.js          # CSV parser, filtering, sorting logic
├── bsg_spas.csv        # Spa directory data
└── package.json        # Dependencies and scripts
```

### Frontend Structure
```
frontend/
├── src/
│   ├── main.jsx                    # Router setup with CartProvider
│   ├── App.jsx                     # Root component
│   ├── pages/
│   │   ├── HomePage.jsx            # Main directory with filters
│   │   ├── LocationPage.jsx        # 28 location cards + filtered view
│   │   ├── TreatmentPage.jsx       # 20 treatment cards + filtered view
│   │   ├── CartPage.jsx            # Cart management with pricing
│   │   └── PaymentPage.jsx         # Booking summary with total
│   ├── components/
│   │   ├── Header.jsx              # Navigation with cart badge
│   │   ├── SpaCard.jsx             # Treatment selection + Add to Cart
│   │   ├── SortDropdown.jsx        # 6 sort options
│   │   ├── FilterBar.jsx           # Location/treatment/budget filters
│   │   └── [other components]
│   ├── context/
│   │   └── CartContext.jsx         # Cart state + TREATMENT_PRICE constant
│   └── styles.css                  # Complete styling (~950+ lines)
└── [config files]
```

## Features

### 1. Multi-Page Navigation (3 Pages)
- **Home** (`/`): Main spa directory with filters, sorting, pagination
- **Locations** (`/locations`, `/locations/:location`): 28 location cards or filtered spa list
- **Treatments** (`/treatments`, `/treatments/:treatment`): 20 treatment cards or filtered spa list
- **Cart** (`/cart`): Shopping cart management
- **Payment** (`/payment`): Booking confirmation

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

## Running the Application

### Development Mode

**Option 1: Using root npm scripts (recommended)**
```bash
npm run dev              # Starts both backend and frontend
npm run dev:backend      # Backend only (port 4000)
npm run dev:frontend     # Frontend only (port 5173)
npm run install:all      # Install all dependencies
```

**Option 2: Manual commands**
```bash
# Backend
cd backend
node server.js

# Frontend (separate terminal)
cd frontend
npm run dev
```

**Access Points:**
- Frontend: http://localhost:5173
- Backend: http://localhost:4000

### Production Build
```bash
cd frontend
npm run build              # Creates dist/ folder
npm run preview            # Preview production build
```

## Environment Variables

### Backend
- `PORT`: Server port (default: 4000)
- `NODE_ENV`: Environment (development/production)

### Frontend
- `VITE_API_BASE`: Backend API URL (default: http://localhost:4000)

## Deployment

See [DEPLOY.md](../DEPLOY.md) for complete Google Cloud Platform deployment guide.

**Summary:**
- **Backend**: Cloud Run (asia-southeast1)
- **Frontend**: Cloud Storage + Cloud CDN
- **Future Database**: Cloud SQL PostgreSQL
- **Estimated Cost**: $8-37/month

## Planned Features (In Development)

### Phase 1: Current State ✅
- 3-page navigation with routing
- 6 sort options including alphabetical
- Shopping cart with treatment selection
- Mandatory date/time booking (9 AM - 4 PM)
- Payment flow with confirmation
- Full pricing display (Rp 1,000,000 per treatment)
- localStorage persistence

### Phase 2: User Authentication (Planned)
- Login page with JWT authentication
- User registration and profile management
- Password reset functionality
- Protected routes
- User booking history
- Session management

### Phase 3: Payment Integration (Planned)
- Stripe payment processing
- Secure checkout flow
- Real-time payment confirmation
- Receipt generation
- Refund handling
- Payment history

### Phase 4: Database Migration (Planned)
- Cloud SQL PostgreSQL setup
- User accounts table
- Booking records table
- Payment transactions table
- Spa favorites/wishlist

### Phase 5: Additional Features (Planned)
- Email confirmations (SendGrid/Mailgun)
- SMS notifications
- Spa availability calendar
- Loyalty programs
- Gift vouchers
- Social media integration

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
- [ ] All 3 pages load correctly
- [ ] Navigation works (Home, Locations, Treatments, Cart)
- [ ] Location filter shows 28 cards, clicking filters spas
- [ ] Treatment filter shows 20 cards, clicking filters spas
- [ ] All 6 sort options work (rating, budget, alphabetical)
- [ ] Add to Cart shows success message
- [ ] Cart badge shows correct count
- [ ] Cart persists after page refresh
- [ ] Date picker prevents past dates
- [ ] Time dropdown shows 9 AM - 4 PM (8 slots)
- [ ] Payment button disabled until all items complete
- [ ] Payment page shows all bookings with prices
- [ ] Total price calculates correctly
- [ ] Confirm payment clears cart and redirects home
- [ ] Pricing displays as Rp 1,000,000 per treatment
- [ ] All treatments visible on spa cards

## Known Issues/Limitations
- Payment is simulated (Stripe integration in development)
- No user authentication yet (in development)
- No email confirmations
- No SMS notifications
- No actual spa availability checking
- CSV-based data (will migrate to Cloud SQL)

## Git Repository
- **Branch**: main
- **Remote**: [To be configured]
- **Last Commit**: "Initial commit - balispaguidw_react" (3ccf45d)

## Support Resources
- README.md: User-facing documentation
- DEPLOY.md: Complete GCP deployment guide
- backend/spaData.js: Data processing logic documentation
- frontend/src/context/CartContext.jsx: Cart system implementation

## Development Notes

### Color Theme
- Primary: `#1e3a8a` (deep blue)
- Accent: `#3b82f6` (bright blue)
- Background: `#f0f4f8` (light blue-grey)
- Border: `#cbd5e1` (grey)
- Hover: `#e0e7ff` (light purple-blue)
- Success: `#10b981` (green)
- Error: `#ef4444` (red)

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
- ✅ Created comprehensive deployment guide (DEPLOY.md)
- ✅ Documented all-GCP deployment strategy
- ✅ Added pricing display to all pages
- ✅ Made all treatments visible on spa cards
- ✅ Updated README with planned features
- ✅ Implemented shopping cart with localStorage
- ✅ Added mandatory date/time booking
- ✅ Created payment flow

---

**Last Updated**: December 11, 2025
**Project Status**: Feature Complete - Ready for Deployment
**Next Steps**: Deploy to Google Cloud Platform
