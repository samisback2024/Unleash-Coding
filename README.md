# Unleash Coding

A free full-stack coding career platform — structured learning paths, real-world challenges, and portfolio projects to take you from complete beginner to job-ready developer.

**Live site:** https://unleash-coding.vercel.app

---

## Features

- **Learning Paths** — Beginner → Intermediate → Advanced modules pulled from Supabase
- **Authentication** — Signup, login, and logout via Supabase Auth
- **User Profiles** — Auto-created on signup; stores XP, level, and streak
- **Enrollment** — Enroll in any learning path and track progress independently
- **Lesson Completion** — Mark lessons complete, earn XP, and see real progress bars
- **Dashboard** — Personalized greeting, stats (XP, streak, lessons done), and a "Continue Learning" section for enrolled paths
- **Profile Page** — Real XP, level bar, day streak, lessons completed, and enrolled paths with live progress
- **Protected Routes** — Dashboard, paths, lessons, and profile require authentication

---

## Tech Stack

| Layer        | Technology                       |
| ------------ | -------------------------------- |
| Frontend     | React 18 + TypeScript + Vite     |
| Styling      | Tailwind CSS v4                  |
| Routing      | React Router DOM v6              |
| Backend / DB | Supabase (PostgreSQL + Auth)     |
| Icons        | Lucide React                     |
| Deployment   | Vercel (auto-deploy from `main`) |

---

## Project Structure

```
src/
├── components/
│   ├── auth/          # Login / signup forms
│   ├── challenge/     # Challenge UI
│   ├── dashboard/     # Dashboard widgets
│   ├── layout/        # AppLayout, Sidebar, Topbar
│   ├── lesson/        # Lesson viewer
│   ├── path/          # Path cards and detail components
│   ├── profile/       # Profile UI
│   └── ui/            # Button, Card, Input, Badge, ProgressBar
├── context/
│   └── AuthContext.tsx   # Session, user, profile, auth functions
├── data/
│   └── paths.ts          # Static fallback path data
├── hooks/
│   └── useUserProgress.ts  # Enrollment and lesson-complete hook
├── lib/
│   └── supabase.ts         # Supabase client
├── pages/                  # Route-level page components
├── services/
│   └── progress.ts         # All Supabase progress/enrollment queries
└── types/
    └── index.ts            # Domain types + Database schema types
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project with the schema from `supabase/migrations/001_initial_schema.sql` applied

### Setup

```sh
# 1. Install dependencies
npm install

# 2. (Optional) Set environment variables
#    The app has hardcoded fallback credentials, so this step is only
#    needed if you're pointing at your own Supabase project.
cp .env.example .env
# Edit .env with your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

# 3. Start the dev server
npm run dev
```

### Build for production

```sh
npm run build
```

---

## Database Schema

The full schema lives in `supabase/migrations/001_initial_schema.sql`. Key tables:

| Table            | Purpose                                                          |
| ---------------- | ---------------------------------------------------------------- |
| `profiles`       | User profile (xp, level, streak, bio) — auto-created via trigger |
| `learning_paths` | All available learning paths                                     |
| `modules`        | Modules belonging to a path                                      |
| `lessons`        | Lessons belonging to a module                                    |
| `user_progress`  | Per-user enrollment and completion state for each path           |
| `challenges`     | Coding challenges linked to paths                                |
| `projects`       | Portfolio projects linked to paths                               |
| `badges`         | Badge definitions                                                |

Row-Level Security (RLS) is enabled on all tables. Users can only read/write their own `profiles` and `user_progress` rows.

---

## Environment Variables

| Variable                 | Description                          |
| ------------------------ | ------------------------------------ |
| `VITE_SUPABASE_URL`      | Your Supabase project URL            |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase publishable (anon) key |

> Vite bakes env vars at build time. If deploying to Vercel, set these in your project's Environment Variables settings.
