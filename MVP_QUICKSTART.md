# 🚀 MVP Quick Start Guide

## What's Ready
✅ Backend API with Express.js  
✅ Frontend React app  
✅ PostgreSQL database  
✅ 5 MVP courses with lessons  
✅ Authentication system  
✅ Achievements & gamification  
✅ All tests passing  

---

## Start the MVP (2 Steps)

### Step 1: Start Backend
```bash
cd backend
npm start
```
Backend runs on: **http://localhost:5000**

### Step 2: Start Frontend (new terminal)
```bash
cd frontend
npm run dev
```
Frontend runs on: **http://localhost:5173**

---

## Test the MVP (5 min flow)

1. **Go to** http://localhost:5173
2. **Signup** with any email/password
3. **Browse courses** → Click "Python Basics"
4. **Enroll** in the course
5. **Start lesson 1** → Click "Complete Lesson"
6. **Take quiz** → Answer questions
7. **View leaderboard** → See your points awarded

---

## Test Credentials
```
Email: admin@example.com
Password: TestPass123!
```
(Admin account for testing)

---

## MVP Features
- ✅ User authentication (signup/login)
- ✅ Course browsing & enrollment
- ✅ Interactive lessons with quizzes
- ✅ Points & achievement system
- ✅ Leaderboard
- ✅ Progress tracking
- ✅ Real-time notifications (Socket.io ready)

---

## Database
- **Name:** ule_db_test
- **User:** ule_user
- **Seed data:** 5 courses, 12 lessons, 4 achievements

To reset database:
```bash
cd backend
npm run test:db:reset
npm run seed:mvp
```

---

## Troubleshooting

**Port 5000 already in use?**
```bash
# Change backend port in backend/.env (add: PORT=5001)
```

**Database connection error?**
- Ensure PostgreSQL is running
- Check DATABASE_URL in backend/.env
- Run: `npm run test:db:reset`

**Frontend build issues?**
```bash
cd frontend
rm -rf node_modules dist
npm install
npm run build
```

---

## Next Steps
1. Test the core flow end-to-end
2. Check [LAUNCH.md](./LAUNCH.md) for production deployment
3. See [SETUP.md](./SETUP.md) for advanced configuration

---

## Project Stats
- 📦 Backend: 35+ API routes
- 🎨 Frontend: 50+ React components
- 🗄️ Database: 20+ migrations, PostgreSQL
- 🧪 Testing: Jest + Supertest
- 🚀 Build: Vite (fast dev, optimized production)

**Built with:** Node.js, React 18, Express, PostgreSQL, Socket.io, Stripe-ready
