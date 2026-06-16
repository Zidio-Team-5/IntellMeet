# 🚀 IntellMeet

AI-Powered Meeting & Collaboration Platform.

## 📌 Overview
IntellMeet combines real-time meetings, team collaboration, and AI-powered
productivity (summaries, action items, task management) in one platform.

## 🛠️ Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, TanStack Query, Zustand, Socket.io-client
- **Backend:** Node.js, Express, Mongoose, Socket.io
- **Database:** MongoDB Atlas
- **AI:** Google Gemini (optional; simulated output without a key)
- **Deployment:** Vercel (frontend) · Render (backend)

## 📂 Repository Structure
```txt
client/    # React + Vite frontend (port 3000 in dev)
backend/   # Express API + Socket.io (port 5000)
docs/      # Setup, testing, deployment guides
```

## ⚡ Quick Start
```bash
# Backend
cd backend && cp .env.example .env   # fill MONGO_URI + JWT_SECRET
npm install && npm run seed && npm run dev

# Frontend (new terminal)
cd client && npm install && npm run dev
```
Open http://localhost:3000 and log in with the seeded admin:
`alice@intellmeet.test` / `password123`.

See `docs/SETUP_TESTING_DEPLOYMENT.md` for full setup, testing, Git workflow,
and Render/Vercel deployment instructions.

## ✨ Core Features
User auth · Meeting create/join · Real-time chat & presence · AI summaries &
action items · Task management (Kanban) · Dashboard, Analytics, Team,
Notifications, Search.

## 👥 Team
Developed as part of the Zidio Web Development Internship Program.
