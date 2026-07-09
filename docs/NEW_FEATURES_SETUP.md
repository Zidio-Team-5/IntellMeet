# New Features — Setup & Deployment Notes

This supplements `docs/SETUP_TESTING_DEPLOYMENT.md` with everything added in this
change: admin team management, OTP email signup, email notifications, a fixed
Gemini AI integration, real analytics, and per-meeting transcript viewing.

## 1. New / changed environment variables (Render — backend)

| Var | Required? | Notes |
|---|---|---|
| `EMAIL_USER` | Yes, for real emails | The Gmail address sending mail, e.g. `yourapp@gmail.com` |
| `EMAIL_PASS` | Yes, for real emails | A Gmail **App Password** (16 chars, no spaces) — see below. NOT your normal Gmail password. |
| `EMAIL_FROM` | No | Optional display "from" — defaults to `EMAIL_USER` |
| `GEMINI_API_KEY` | Recommended | Same var as before. The actual bug was the `@google/genai` npm version pinned in `package.json` (`^0.21.0`) **doesn't exist on npm** — installs were silently failing, which is why you always saw "(Simulated)" answers even with a real key set. Fixed to `^1.15.0` and moved out of `optionalDependencies` into real `dependencies` so it always installs on Render. |
| `GEMINI_MODEL` | No | Unchanged, defaults to `gemini-2.0-flash` |
| `DEMO_ADMIN_EMAIL`, `DEMO_ADMIN_PASSWORD`, `DEMO_ADMIN_NAME` | Only when running the bootstrap script | See section 3 |

### Getting a free Gmail App Password
1. On the Gmail account you want to send from, turn on **2-Step Verification** (myaccount.google.com/security).
2. Go to **myaccount.google.com/apppasswords**, create an app password for "Mail".
3. Use that 16-character value as `EMAIL_PASS`; the Gmail address itself is `EMAIL_USER`.
4. Free tier limits: ~500 sends/day, which is plenty for a team tool.

If `EMAIL_USER`/`EMAIL_PASS` aren't set, the app keeps working normally — emails
are just logged and skipped, nothing crashes.

## 2. What changed and why (impact summary)

- **Signup is now OTP-gated**: `POST /auth/register` only emails a code, no
  token. `POST /auth/verify-otp` confirms it. `POST /auth/set-password`
  finishes signup and logs the user in. Existing production accounts (real
  password already set, predating this change) are **not** locked out — login
  self-heals them on first successful sign-in.
- **Admin team management**: `POST /team` (invite by email), `POST /team/:id/promote`,
  `POST /team/:id/demote`, `DELETE /team/:id` — all require `role: admin`
  (enforced server-side via the existing `requireRole` middleware, which was
  already written but unused before this change).
- **Task creation/assignment/deletion is now admin-only**; moving a task
  between Kanban columns (status change) is still open to any member, so
  day-to-day board use isn't affected.
- **Email notifications** now fire on: signup OTP, account created, role
  promoted/demoted, task assigned, member removed.
- **Analytics** now computes `avgDuration` and `utilization` from real meeting
  data instead of hardcoded `"38 min"` / `"84%"`.
- **AI Workspace**: transcripts can now be attached as context from the live
  meeting transcript panel or the new per-meeting transcript page, and the
  chat/summary generator will use that attached transcript.
- **New page**: `/meeting/:id/transcript` — view, copy, or send a completed
  meeting's full transcript to the AI Workspace. Linked from Meeting History.

## 3. Creating the demo admin (do this once, safely)

Don't run the full `npm run seed` against production — it also creates 3
sample meetings/tasks tied to the demo account. Instead, use the new minimal
script:

```bash
# On Render: Shell tab, or locally with your production MONGO_URI in .env
DEMO_ADMIN_EMAIL=you@company.com DEMO_ADMIN_PASSWORD='a-real-strong-password' npm run bootstrap-admin
```

This only creates/updates that one admin account — nothing else in your
database is touched. From there, log in as that admin and use **Team → Add
member** to invite real teammates (they'll get an OTP email to finish setup),
and **Team → promote** to hand admin to someone else once they've signed up.

## 4. Google Drive setup (for meeting recordings)

Meeting recordings (host-initiated, client-side composite of the whole call)
upload to whichever Google account each user connects from **Settings →
Integrations → Connect**. Free — Drive API itself has no cost, this is just
one-time console setup.

1. Go to **console.cloud.google.com** → create a new project (or use an
   existing one).
2. **APIs & Services → Library** → search "Google Drive API" → **Enable**.
3. **APIs & Services → OAuth consent screen**:
   - User type: **External** (unless you have a Google Workspace org, then
     Internal is simpler and skips verification).
   - Fill in app name, support email, developer contact email.
   - Scopes: you can leave default: this app requests `drive.file` (only
     files it creates, not your whole Drive) and a basic email scope.
   - Test users: add your own Gmail (and teammates') while the app is in
     "Testing" mode — otherwise only those accounts can connect until you
     publish the app.
4. **APIs & Services → Credentials → Create Credentials → OAuth client ID**:
   - Application type: **Web application**
   - Authorized redirect URIs: add exactly
     `https://your-backend.onrender.com/api/drive/oauth/callback`
     (must match `GOOGLE_REDIRECT_URI` byte-for-byte, including https and no
     trailing slash).
5. Copy the generated **Client ID** and **Client Secret** into Render:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_REDIRECT_URI` = the exact redirect URI from step 4
6. Redeploy. Each user (any role) can now go to **Settings → Integrations**
   and click **Connect** to link their own Drive.

**Note on "Testing" mode**: while the OAuth consent screen is unverified,
only the test users you explicitly added in step 3 can connect. To let
anyone on your team connect without being added individually, you'd need to
publish the app (Google may require verification for sensitive scopes,
though `drive.file` typically doesn't need it since it only touches files
the app itself creates).

## 5. TURN server (audio/video/screen-share across real networks)

STUN alone frequently can't establish a connection between two people on
different real-world networks. A free public TURN relay (Open Relay
Project) is wired in as a working default — no setup needed to get started.
For real usage, get your own TURN credentials (it's rate-limited/shared) from
a provider like Metered.ca, Twilio, Xirsys, or self-host `coturn`, then set
on Vercel:
```
VITE_TURN_URL=turn:your-turn-host:3478
VITE_TURN_USERNAME=...
VITE_TURN_CREDENTIAL=...
```

## 6. What changed in this round

- Login now distinguishes "no account" (redirects to signup) from "wrong
  password". Note: this makes email registration status detectable via the
  login endpoint — a normal tradeoff for this UX, worth knowing.
- Forgot-password, multi-assignee tasks, team member detail popups, expanded
  profile fields (job title, phone, bio, location, timezone, skills, social
  links), screen-share picture-in-picture compositing, moderation-lock UI,
  and the TURN/Drive/recording features described above.
- Email-not-configured warnings are now logged at `ERROR` level so they're
  impossible to miss in Render's log viewer.


## 7. Post-deploy checklist

- [ ] Rotate the Gemini key, Mongo password, and JWT secret shown in your
      screenshot — do this regardless of anything else, since they were
      posted in plaintext.
- [ ] Set `EMAIL_USER` / `EMAIL_PASS` on Render for real email delivery.
- [ ] Redeploy backend (picks up the corrected `@google/genai` version).
- [ ] Run `npm run bootstrap-admin` once against production.
- [ ] Log in as the demo admin, invite your real teammates from **Team**.
- [ ] (Optional) Set up Google Drive per section 5 above if you want meeting
      recordings.
