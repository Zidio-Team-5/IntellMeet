# IntellMeet — Local Setup, Testing, Git Workflow & Deployment

This guide assumes the repository layout `client/` (locked frontend) + `backend/` (the patched backend from `intellmeet-backend-patched.tar.gz`). Adjust paths if your backend folder is named `server/`.

---

## PHASE 9 — Local Setup & Testing

### 9.1 Install Node.js
Use Node **18.18+** (20 LTS or 22 recommended).
```bash
node -v   # expect v18.18+ (e.g. v22.x)
npm -v
```
If missing, install via https://nodejs.org or nvm:
```bash
nvm install 22 && nvm use 22
```

### 9.2 MongoDB Atlas (free tier) — REQUIRED
The backend will not start without a database (by design).
1. Create a free cluster at https://www.mongodb.com/cloud/atlas (M0).
2. **Database Access** → add a user (username + password).
3. **Network Access** → add IP `0.0.0.0/0` for local dev (tighten later).
4. **Connect → Drivers** → copy the connection string, e.g.
   `mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/intellmeet`
   (append `/intellmeet` so data lands in a named DB.)

### 9.3 Backend environment
```bash
cd backend
cp .env.example .env
```
Edit `.env`:
```env
PORT=5000
NODE_ENV=development
CORS_ORIGINS=http://localhost:3000
JWT_SECRET=<paste output of: openssl rand -hex 32>
JWT_TTL=7d
MONGO_URI=mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/intellmeet
# GEMINI_API_KEY=        # optional; blank = simulated AI
GEMINI_MODEL=gemini-2.0-flash
```

### 9.4 Install & run the backend
```bash
cd backend
npm install
npm run seed     # creates test users + sample data
npm run dev      # starts on :5000 with --watch
```
**Expected output:**
```
[INFO ...] MongoDB connected: cluster0-shard-.../intellmeet
[INFO ...] IntellMeet API on :5000
```
Seed prints:
```
[INFO ...] Seeded: 3 users, 2 meetings, 3 tasks, 2 notifications.
[INFO ...] Login with: alice@intellmeet.test / password123  (admin)
```
> If you see `MONGO_URI is not set` → fill in `MONGO_URI`. If `MongoDB connection failed` → check the password and Network Access allowlist.

### 9.5 Install & run the frontend (locked)
```bash
cd client
cp .env .env.local 2>/dev/null || true   # .env already targets :5000
npm install
npm run dev      # Vite on http://localhost:3000
```
Open http://localhost:3000.

### 9.6 Feature test checklist (UI)
| Test | Steps | Expected |
|---|---|---|
| **Auth — login** | Log in with `alice@intellmeet.test` / `password123` | Lands on Dashboard; refresh keeps you logged in. |
| **Auth — register** | Register a new email | Auto-logged-in; redirected to Dashboard. |
| **Auth — guard** | Visit `/dashboard` while logged out | Redirected to login. |
| **Team** | Open Team | Alice, Bob, Carol listed. |
| **Meetings** | Open Meetings | "Q3 Roadmap Planning" + "Daily Standup" appear (this is the fixed list). Create one → appears immediately. |
| **Tasks** | Open Tasks | Three seeded tasks across To-Do / In-Progress / Completed. Create + move a card. |
| **AI** | AI Workspace → paste transcript → Summarize | Returns a summary + action items (simulated unless `GEMINI_API_KEY` set). |
| **Dashboard/Analytics** | Open each | Stats, activity, productivity chart, team performance render with data. |
| **Notifications** | Open notifications | Two seeded items; mark-read / mark-all work. |

### 9.7 API smoke test (curl)
```bash
B=http://localhost:5000/api
curl -s $B/health
# {"status":"ok","database":"connected"}

TOKEN=$(curl -s -X POST $B/auth/login -H 'Content-Type: application/json' \
  -d '{"email":"alice@intellmeet.test","password":"password123"}' \
  | python3 -c "import sys,json;print(json.load(sys.stdin)['token'])")

curl -s $B/meetings -H "Authorization: Bearer $TOKEN"   # {"meetings":[ ...two... ]}
curl -s $B/tasks    -H "Authorization: Bearer $TOKEN"   # {"tasks":[ ...three... ]}
```

### 9.8 Socket test
1. Open the same meeting room in **two** browser windows (log in as two users).
2. In window A, send a chat message in the meeting.
3. **Expected:** it appears in window B's transcript in real time; joining/leaving updates the participant list.
> Sockets require a valid token — they connect with `{ auth: { token } }` and the server rejects unauthenticated handshakes.

### 9.9 Troubleshooting
| Symptom | Cause / Fix |
|---|---|
| Backend exits immediately, `MONGO_URI is not set` | Fill `MONGO_URI` in `backend/.env`. |
| `MongoServerError: bad auth` | Wrong Atlas user/password; recheck Database Access. |
| Frontend loads but every call 401s | Token missing/expired — log in again; confirm client `.env` `VITE_API_URL=http://localhost:5000/api`. |
| CORS error in console | Add the frontend origin to `CORS_ORIGINS` in `backend/.env` (e.g. `http://localhost:3000`). |
| Meetings list empty | You're on an old backend with the mock store — use the patched backend; confirm `/api/health` shows `"database":"connected"`. |
| AI returns "(Simulated)" | No `GEMINI_API_KEY` — expected; set one for real output. |
| `vite: Permission denied` | `chmod +x node_modules/.bin/*` or reinstall: `rm -rf node_modules && npm install`. |

---

## PHASE 10 — Git Workflow (2-person team)

### 10.1 One-time
```bash
git clone <repo-url> && cd IntellMeet
git config user.name "Your Name"
git config user.email "you@example.com"
```
Ensure `.gitignore` excludes `node_modules/`, `.env`, `dist/`. **Never commit `.env`.** If `client/.env` is currently tracked, untrack it once: `git rm --cached client/.env`.

### 10.2 Branch strategy (simple, two people)
- `main` — always deployable.
- Short-lived feature branches off `main`: `feat/<name>`, `fix/<name>`, `chore/<name>`.
- One developer owns backend changes, the other frontend, to minimize overlap (frontend is locked, so most work is backend).

### 10.3 Daily loop
```bash
git checkout main
git pull origin main                 # start from latest
git checkout -b feat/meeting-filters # new work

# ...edit, then...
git add -A
git commit -m "feat(meetings): add status filter to list query"
git push -u origin feat/meeting-filters
```
Open a Pull Request → the other person reviews → merge into `main`.

### 10.4 Pulling teammate's work mid-feature
```bash
git checkout main && git pull origin main
git checkout feat/meeting-filters
git rebase main        # replay your commits on top of latest main
```

### 10.5 Merge & conflict resolution
- Prefer **PR + squash merge** for a clean history.
- On conflict during rebase:
```bash
# Git marks conflicts with <<<<<<< ======= >>>>>>>
# Edit each file, keep the correct lines, remove the markers, then:
git add <resolved-file>
git rebase --continue
# abort if needed: git rebase --abort
```
> The repo's root `README.md` currently contains an unresolved conflict marker (`<<<<<<< HEAD`). Replace it with the corrected `README.md` provided alongside this guide.

### 10.6 Commit message convention
`type(scope): summary` — types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`.

---

## PHASE 11 — Deployment (Backend → Render, Frontend → Vercel)

Deploy the **backend first**, get its public URL, then deploy the frontend pointing at it, then add the frontend URL to the backend CORS.

### 11.1 Backend on Render
**Option A — Blueprint:** commit the included `backend/render.yaml`, then in Render: **New → Blueprint** and select the repo.

**Option B — Manual Web Service:**
- **Root Directory:** `backend`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Health Check Path:** `/api/health`
- **Environment variables:**
  | Key | Value |
  |---|---|
  | `NODE_ENV` | `production` |
  | `PORT` | `5000` |
  | `JWT_SECRET` | a 64-char random hex (`openssl rand -hex 32`) |
  | `JWT_TTL` | `7d` |
  | `MONGO_URI` | your Atlas string (`.../intellmeet`) |
  | `CORS_ORIGINS` | your Vercel URL, e.g. `https://intellmeet.vercel.app` (add after step 11.2) |
  | `GEMINI_API_KEY` | optional |
  | `GEMINI_MODEL` | `gemini-2.0-flash` |

Deploy. Confirm: `https://<service>.onrender.com/api/health` → `{"status":"ok","database":"connected"}`.
> In Atlas Network Access, allow Render egress (use `0.0.0.0/0` for the free tier, or Render's static IPs on paid plans).

### 11.2 Frontend on Vercel
- **Root Directory:** `client`
- **Framework Preset:** Vite
- **Build Command:** `npm run build` · **Output Directory:** `dist`
- **Environment variables:**
  | Key | Value |
  |---|---|
  | `VITE_API_URL` | `https://<service>.onrender.com/api` |
  | `VITE_SOCKET_URL` | `https://<service>.onrender.com` |
  | `VITE_APP_NAME` | `IntellMeet` |
  | `VITE_APP_VERSION` | `2.0.0` |

Deploy. Copy the resulting URL (e.g. `https://intellmeet.vercel.app`).

### 11.3 Close the loop (CORS)
Set `CORS_ORIGINS` on Render to the Vercel URL (comma-separate if you have a custom domain too) and redeploy the backend.

### 11.4 Custom domains (optional)
- **Vercel:** Project → Settings → Domains → add `app.yourdomain.com` (CNAME as instructed).
- **Render:** Settings → Custom Domains → add `api.yourdomain.com`.
- Update `VITE_API_URL`/`VITE_SOCKET_URL` (frontend) and `CORS_ORIGINS` (backend) to the custom domains; redeploy both.

### 11.5 Production verification checklist
- [ ] `GET /api/health` → `{"status":"ok","database":"connected"}`
- [ ] Register + login from the deployed frontend; reload keeps session.
- [ ] Create a meeting → appears in the list (confirms DB + indexed query in prod).
- [ ] Create/move a task; open Team, Dashboard, Analytics — all render data.
- [ ] Two-window socket test on the deployed URLs (chat/presence real-time).
- [ ] No CORS errors in the browser console.
- [ ] Render logs show `MongoDB connected` and no repeated errors.
- [ ] Confirm `JWT_SECRET` and `MONGO_URI` are set as **secrets** (not in code).

### 11.6 Notes
- The backend keeps presence/room state in-process. A single Render instance is fine for the internship-scale app. To scale to multiple instances later, add the Socket.io Redis adapter (out of scope here; noted for the roadmap).
- Free Render instances sleep when idle; the first request after idle is slow (cold start). This is expected on the free plan.