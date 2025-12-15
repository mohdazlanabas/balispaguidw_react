# Quick Start Guide

## Running Locally (5 Minutes)

### 1. Start PostgreSQL
```bash
docker-compose up -d
```

### 2. Start Backend
```bash
cd backend
node server.js
```

### 3. Start Frontend (in new terminal)
```bash
cd frontend
npm run dev
```

### 4. Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000
- Database UI: http://localhost:5050
  - Email: `azlan@net1io.com`
  - Password: `treasure2020a`

## Test Accounts
- **Admin**: `azlan@net1io.com` / `admin123`
- **User**: `roger@net1io.com` / `user123`
- **Spa Owner**: `spaowner@net1io.com` / `spa123`

## Stop Everything
```bash
# Stop backend and frontend: Ctrl+C

# Stop Docker
docker-compose down
```

## More Info
- **Development Guide**: `docs/DEV_GUIDE.md`
- **Development Plan**: `plan.md`
- **Full README**: `README.md`
