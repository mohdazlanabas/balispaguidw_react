# Custom Claude Code Commands

This file documents project-specific commands and workflows for Claude Code.

## Quick Start Commands

### Development Servers
```bash
# Start both servers
npm run dev

# Start backend only
npm run dev:backend

# Start frontend only
npm run dev:frontend
```

### Testing
```bash
# Test backend API
curl http://localhost:4000/api/filters
curl "http://localhost:4000/api/spas?page=1&pageSize=5"
curl http://localhost:4000/api/spas/1

# Open frontend
open http://localhost:5173
```

### Common Tasks
```bash
# Install all dependencies
npm run install:all

# Build frontend for production
cd frontend && npm run build

# Preview production build
cd frontend && npm run preview
```

## Deployment Commands

### Backend Deployment
```bash
# Deploy backend to Cloud Run
cd backend
gcloud run deploy bali-spa-backend \
  --source . \
  --region asia-southeast1 \
  --allow-unauthenticated
```

### Frontend Deployment
```bash
# Build and deploy frontend
cd frontend
npm run build
gsutil -m rsync -r -d dist gs://PROJECT_ID-frontend
```

### Quick Updates
```bash
# Update backend only
./update-backend.sh

# Update frontend only
./update-frontend.sh

# Full deployment
./deploy-all.sh
```

## Debugging

### View Logs
```bash
# Backend logs (Cloud Run)
gcloud run services logs read bali-spa-backend --region asia-southeast1 --limit 100

# Backend logs (local)
cd backend && node server.js

# Frontend dev server logs
cd frontend && npm run dev
```

### Check Running Processes
```bash
# Check what's running on port 4000
lsof -i :4000

# Check what's running on port 5173
lsof -i :5173

# Kill process on port
kill -9 $(lsof -ti:4000)
```

## Code Navigation

### Key Files to Check
```bash
# Backend API endpoints
code backend/server.js

# Data processing and sorting
code backend/spaData.js

# Frontend router setup
code frontend/src/main.jsx

# Cart system
code frontend/src/context/CartContext.jsx

# Main pages
code frontend/src/pages/HomePage.jsx
code frontend/src/pages/CartPage.jsx
code frontend/src/pages/PaymentPage.jsx

# Styling
code frontend/src/styles.css
```

### Search Commands
```bash
# Find all TODO comments
grep -r "TODO" frontend/src/

# Find all console.log statements
grep -r "console.log" frontend/src/

# Find specific component usage
grep -r "useCart" frontend/src/

# Find API calls
grep -r "fetch" frontend/src/
```

## Data Management

### CSV Data
```bash
# View spa data structure
head -20 backend/bsg_spas.csv

# Count total spas
wc -l backend/bsg_spas.csv

# Find spas in specific location
grep "Ubud" backend/bsg_spas.csv

# List all unique locations
cut -d',' -f7 backend/bsg_spas.csv | sort -u
```

## Git Commands

### Standard Workflow
```bash
# Check status
git status

# Create feature branch
git checkout -b feature/feature-name

# Commit changes
git add .
git commit -m "Description of changes"

# Push to remote
git push origin feature/feature-name

# Merge to main
git checkout main
git merge feature/feature-name
git push origin main
```

### Deployment Tags
```bash
# Tag release
git tag -a v1.0.0 -m "Initial production release"
git push origin v1.0.0

# List all tags
git tag -l

# Deploy specific version
git checkout v1.0.0
```

## Environment Setup

### Backend Environment
```bash
# Create .env file
cat > backend/.env << EOF
PORT=4000
NODE_ENV=development
EOF
```

### Frontend Environment
```bash
# Development
cat > frontend/.env << EOF
VITE_API_BASE=http://localhost:4000
EOF

# Production
cat > frontend/.env.production << EOF
VITE_API_BASE=https://your-backend-url.run.app
EOF
```

## Performance Monitoring

### Bundle Size Analysis
```bash
cd frontend
npm run build -- --mode analyze
```

### Lighthouse Audit
```bash
npm install -g lighthouse
lighthouse http://localhost:5173 --view
```

### Check Dependencies
```bash
# List outdated packages
cd backend && npm outdated
cd frontend && npm outdated

# Update dependencies
npm update
```

## Useful Aliases

Add to your `~/.bashrc` or `~/.zshrc`:

```bash
# Bali Spa Guide aliases
alias bsg="cd /Users/rogerwoolie/Documents/Project_CScience/new_balispaguide"
alias bsg-dev="bsg && npm run dev"
alias bsg-backend="bsg && npm run dev:backend"
alias bsg-frontend="bsg && npm run dev:frontend"
alias bsg-deploy="bsg && ./deploy-all.sh"
alias bsg-logs-be="gcloud run services logs tail bali-spa-backend --region asia-southeast1"
```

## Troubleshooting Guides

### Frontend Not Loading
1. Check Vite server is running: `lsof -i :5173`
2. Check browser console for errors
3. Verify API proxy in `vite.config.js`
4. Clear browser cache and localStorage
5. Restart dev server: `cd frontend && npm run dev`

### Backend Not Responding
1. Check server is running: `lsof -i :4000`
2. Test endpoints directly: `curl http://localhost:4000/api/filters`
3. Check backend logs for errors
4. Verify CORS configuration in `server.js`
5. Restart server: `cd backend && node server.js`

### Cart Not Persisting
1. Check browser localStorage: `localStorage.getItem('cart')`
2. Verify CartContext is wrapping app in `main.jsx`
3. Check console for React context errors
4. Test in incognito mode (rules out extension conflicts)

### Deployment Issues
1. Verify gcloud authentication: `gcloud auth list`
2. Check project ID: `gcloud config get-value project`
3. Verify APIs are enabled: `gcloud services list`
4. Check Cloud Run logs: `gcloud run services logs read bali-spa-backend`
5. Test with curl after deployment

---

**Note**: These commands assume you're in the project root directory unless otherwise specified.
