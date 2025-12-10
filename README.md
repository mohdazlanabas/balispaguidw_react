# Bali Spa Directory

A comprehensive web application for discovering and booking spa treatments across Bali and Lombok.

## Features

### 🏠 Multi-Page Navigation
- **Home Page** - Browse all spas with advanced filtering
- **Locations Page** - Explore spas by location with clickable location cards
- **Treatments Page** - Find spas by treatment type
- **Cart Page** - Manage your selected treatments with date/time booking
- **Payment Page** - Review and confirm your bookings
- **Login Page** - *(Coming Soon)* User authentication
- **Stripe Payment** - *(Coming Soon)* Secure payment processing

### 🔍 Advanced Filtering & Search
- Filter by location, treatment type, and budget
- Search by spa name or address
- Side filters for quick location/treatment selection

### 📊 Flexible Sorting Options
- Rating (High to Low / Low to High)
- Price (High to Low / Low to High)
- Alphabetically (A-Z / Z-A)

### 🛒 Shopping Cart System
- Add treatments from any spa to your cart
- Select specific treatments from spa's offering list
- **All treatments priced at Rp 1,000,000**
- **Mandatory date and time selection** for each booking
- Time slots from 9:00 AM to 4:00 PM (hourly)
- Remove items from cart
- Real-time price calculation and total display
- Payment button only activates when all bookings are complete
- **Stripe payment integration coming soon**

### 🎨 Modern UI/UX
- Clean blue color theme
- Responsive design for all devices
- Smooth transitions and hover effects
- Real-time cart badge counter
- Visual feedback for user actions

## Tech Stack

### Frontend
- **React 19** - UI framework
- **React Router DOM** - Page navigation
- **Context API** - State management for cart
- **Vite** - Build tool and dev server
- **CSS3** - Styling with custom properties

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **CSV Parse** - Data parsing
- **CORS** - Cross-origin resource sharing

### Planned Integrations
- **Stripe** - Payment processing (coming soon)
- **JWT** - Authentication tokens (coming soon)
- **PostgreSQL/MongoDB** - User data storage (coming soon)
- **SendGrid/Mailgun** - Email notifications (coming soon)

## Project Structure

```
new_balispaguide/
├── backend/
│   ├── server.js          # Express server
│   ├── spaData.js         # Data management & filtering logic
│   ├── bsg_spas.csv       # Spa database
│   └── package.json       # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.jsx       # Main directory page
│   │   │   ├── LocationPage.jsx   # Location browser & filtered view
│   │   │   ├── TreatmentPage.jsx  # Treatment browser & filtered view
│   │   │   ├── CartPage.jsx       # Shopping cart with date/time
│   │   │   └── PaymentPage.jsx    # Booking summary
│   │   ├── components/
│   │   │   ├── Header.jsx         # Navigation with cart badge
│   │   │   ├── Footer.jsx         # Footer
│   │   │   ├── SpaCard.jsx        # Spa listing card with cart
│   │   │   ├── SpaList.jsx        # Spa list container
│   │   │   ├── FilterBar.jsx      # Main filter controls
│   │   │   ├── SideFilters.jsx    # Quick filter sidebar
│   │   │   ├── SortDropdown.jsx   # Sort options
│   │   │   └── Pagination.jsx     # Page navigation
│   │   ├── context/
│   │   │   └── CartContext.jsx    # Cart state management
│   │   ├── main.jsx               # App entry point
│   │   └── styles.css             # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── package.json           # Root convenience scripts
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd new_balispaguide
   ```

2. **Install all dependencies**
   ```bash
   # Install root, backend, and frontend dependencies
   npm run install:all
   ```

   Or install individually:
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

### Running the Application

#### Option 1: Run from root directory (Recommended)
```bash
# Start backend
npm run dev:backend

# In another terminal, start frontend
npm run dev:frontend
```

#### Option 2: Run from individual directories
```bash
# Terminal 1 - Backend
cd backend
node server.js

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000

## API Endpoints

### GET `/api/filters`
Returns all available filter options
```json
{
  "locations": ["Ubud", "Seminyak", ...],
  "treatments": ["Massage", "Facial", ...],
  "budgets": [1, 2, 3, 4, 5]
}
```

### GET `/api/spas`
Query parameters:
- `page` - Page number (default: 1)
- `pageSize` - Items per page (default: 20)
- `location` - Filter by location
- `treatment` - Filter by treatment
- `budget` - Filter by budget level
- `search` - Search in name/address
- `sort` - Sort option:
  - `rating_desc` / `rating_asc`
  - `budget_desc` / `budget_asc`
  - `title_asc` / `title_desc`

Returns:
```json
{
  "total": 1059,
  "page": 1,
  "pageCount": 53,
  "pageSize": 20,
  "items": [...]
}
```

### GET `/api/spas/:id`
Returns detailed information for a specific spa

## Features in Detail

### Cart Functionality
1. **Adding to Cart**
   - Select a treatment from the dropdown in any spa card
   - Click "Add to Cart" button
   - Get visual confirmation

2. **Managing Cart**
   - View all selected treatments in cart
   - See spa name, location, and treatment
   - Select date (cannot be in the past)
   - Select time slot (9 AM - 4 PM)
   - Delete unwanted items

3. **Proceeding to Payment**
   - Payment button disabled until ALL items have date & time
   - Visual indicators show incomplete items
   - Cart data persists in localStorage

### Date & Time Selection
- **Date Picker**: HTML5 date input with minimum date set to today
- **Time Slots**: Dropdown with hourly slots from 09:00 AM to 04:00 PM
- **Validation**: Both fields required before proceeding to payment

## Environment Variables

### Frontend `.env`
```
VITE_API_BASE=http://localhost:4000
```

## Data Model

### Spa Object
```javascript
{
  id: number,
  title: string,
  email: string,
  phone: string,
  address: string,
  website: string,
  location: string,
  budget: number (1-5),
  rating: number (1-5),
  opening_hour: string,
  closing_hour: string,
  treatments: string[]
}
```

### Cart Item
```javascript
{
  id: number (unique),
  spaId: number,
  spaName: string,
  spaLocation: string,
  treatment: string,
  price: number (1000000), // Rp 1,000,000
  date: string (YYYY-MM-DD),
  time: string (HH:MM AM/PM)
}
```

## Development

### Adding New Features
The application uses a modular architecture:
- Add new pages in `frontend/src/pages/`
- Add new components in `frontend/src/components/`
- Update routes in `frontend/src/main.jsx`
- Add backend routes in `backend/server.js`

### Styling
- Global styles in `frontend/src/styles.css`
- Uses CSS custom properties for theming
- Blue color theme throughout
- Responsive breakpoints at 768px and 900px

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Known Limitations
- Payment is simulated (no actual payment processing yet)
- Cart data stored in localStorage (not synced across devices)
- No user authentication (in development)
- No email confirmation system
- Booking availability not checked with actual spas

## Planned Features (In Development)

### 🔐 User Authentication & Login System
- **Login Page** - Secure user authentication
- User registration and profile management
- Password reset functionality
- Session management
- Protected routes for authenticated users
- User booking history

### 💳 Stripe Payment Integration
- **Secure Payment Processing** via Stripe
- Real-time payment confirmation
- Multiple payment methods support
- Payment receipts and invoices
- Refund handling
- Payment history tracking
- PCI-compliant payment processing

## Future Enhancements
- Email booking confirmations with calendar invites
- SMS notifications for booking reminders
- Spa availability calendar integration
- Reviews and ratings system with user feedback
- Photo galleries for spas with virtual tours
- Multi-language support (English, Indonesian, etc.)
- Mobile app versions (iOS & Android)
- Loyalty program and rewards
- Special offers and promotions
- Spa comparison tool
- Favorite spas and treatments
- Social media integration
- Gift vouchers and packages

## License
ISC

## Author
Bali Spa Guide Team

## Support
For issues or questions, please check the application documentation or contact the development team.
