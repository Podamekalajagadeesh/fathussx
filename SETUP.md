# MVP Setup Guide

## Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org)
- **PostgreSQL 12+** - [Download](https://www.postgresql.org/download/) or use Docker
- **Git** - For version control

## Quick Start (5 minutes)

### 1. Start PostgreSQL

**Option A: Using Docker (Recommended)**
```powershell
docker run -e POSTGRES_PASSWORD=pin8800 -e POSTGRES_USER=postgres -p 5432:5432 -d postgres:15
```

**Option B: Local PostgreSQL**
- Ensure PostgreSQL is running
- Default connection: `postgres` user, port `5432`

### 2. Setup Backend

```powershell
cd backend

# Install dependencies
npm install

# Initialize test database and create ule_user role
npm run test:db:reset

# Seed MVP courses & content
npm run seed:mvp

# Verify tests pass
npm test
```

### 3. Setup Frontend

```powershell
cd ../frontend

# Install dependencies
npm install

# Verify build succeeds
npm run build

# Or run dev server
npm run dev
```

### 4. Start Servers

**Terminal 1 - Backend:**
```powershell
cd backend
npm start
# Backend runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
# Frontend runs on http://localhost:5173 (or similar)
```

### 5. Test Core MVP Flow

1. Open http://localhost:5173 in browser
2. Click "Sign Up"
3. Create account (email: test@example.com, password: test123)
4. Click "Courses"
5. Enroll in "Python Basics: Intro to Programming"
6. Complete a lesson
7. Take a quiz
8. See points awarded

---

## Environment Configuration

### Backend (.env)
Copy from `.env.example` and customize:

```env
DATABASE_URL="postgresql://ule_user:pin8800@localhost:5432/ule_db_test"
JWT_SECRET="your_super_secret_jwt_secret"
STRIPE_SECRET_KEY="sk_test_..."
GOOGLE_CLIENT_ID="..."
```

### Frontend (.env.local)
```env
VITE_API_URL="http://localhost:5000/api"
```

---

## Troubleshooting

### PostgreSQL Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Fix:** Ensure PostgreSQL is running:
```powershell
docker ps | grep postgres
# or
psql -U postgres -c "SELECT 1"
```

### "Role ule_user does not exist"
```powershell
# Run initialization again:
cd backend
npm run test:db:reset
```

### Tests Failing
```powershell
# Full reset:
cd backend
npm run test:db:reset
npm test
```

### Frontend Build Errors
```powershell
cd frontend
rm node_modules package-lock.json
npm install
npm run build
```

### Port Already in Use
```powershell
# Backend on different port:
$env:PORT=5001
npm start

# Frontend on different port:
npm run dev -- --port 3000
```

---

## MVP Feature Checklist

- [x] User signup/login
- [x] Course library (5 courses seeded)
- [x] View lessons
- [x] Complete lessons & track progress
- [x] Quiz system
- [x] Points & achievements
- [x] Leaderboard
- [x] Basic gig marketplace
- [ ] AI tutor (coming soon)
- [ ] Code execution sandbox (coming soon)

---

## Production Deployment

See `LAUNCH.md` for deployment steps to production.

---

## Need Help?

- Backend Issues: Check `backend/` folder
- Frontend Issues: Check `frontend/` folder  
- Database Issues: Verify PostgreSQL connection

Run `npm run check-launch` from project root to verify setup.
