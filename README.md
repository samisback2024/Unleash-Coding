# Unleash Coding

A free full-stack coding career platform — structured learning paths, real-world challenges, and portfolio projects to take you from complete beginner to job-ready developer.

**Live site:** https://unleash-coding.vercel.app

---

## Features

### Learning Paths

- 8 career paths (Python, JavaScript, Frontend, Backend, Full-Stack, AI/ML, DevOps, Cybersecurity)
- Beginner → Intermediate → Advanced modules loaded from Supabase
- Enroll in any path and track progress independently with real progress bars

### Authentication & Profiles

- Signup, login, and logout via Supabase Auth
- User profiles auto-created on signup (XP, level, streak, bio)
- Protected routes — dashboard, lessons, challenges, projects, and profile require authentication

### Lesson Engine

- Full lesson viewer with content, code examples, and key takeaways
- Mark lessons complete, earn XP, auto-advance to next lesson
- Previous / next navigation, breadcrumb trail

### Challenge System

- Coding challenges per learning path with difficulty levels (beginner / intermediate / advanced)
- Multiple-choice and code challenges with instant feedback
- XP rewards on completion, duplicate-XP prevention
- Challenges page with difficulty filter and per-path tabs

### Portfolio Project System

- 24 real portfolio projects seeded across all 8 paths (3 per path)
- Projects page (`/projects`) — browse by enrolled path, filter by difficulty
- Project detail page (`/paths/:slug/project/:projectId`) — requirements checklist, skills covered, estimated hours
- Submit via GitHub URL + live demo link
- Project submission status tracking (submitted → reviewed → approved / revision requested)
- XP awarded on first submission
- Portfolio page (`/portfolio`) — gallery of submitted projects with status badges, feedback, and XP earned
- Dashboard "My Projects" widget + Profile portfolio section

### XP & Progression

- XP earned from lessons, challenges, and project submissions
- Level calculated from total XP, displayed with progress bar
- Day streak tracking

---

## Tech Stack

| Layer        | Technology                         |
| ------------ | ---------------------------------- |
| Frontend     | React 19 + TypeScript + Vite       |
| Styling      | Tailwind CSS v4 (dark theme)       |
| Routing      | React Router DOM v7                |
| Backend / DB | Supabase (PostgreSQL + Auth + RLS) |
| Icons        | Lucide React                       |
| Deployment   | Vercel (auto-deploy from `main`)   |

---

## Project Structure

```
src/
├── components/
│   ├── auth/          # Login / signup forms
│   ├── challenge/     # ChallengeCard, ChallengeModal, ChallengeProgress
│   ├── dashboard/     # Dashboard widgets
│   ├── layout/        # AppLayout, Sidebar, Topbar
│   ├── lesson/        # Lesson viewer
│   ├── path/          # Path cards and detail components
│   ├── profile/       # Profile UI
│   ├── project/       # ProjectCard, RequirementChecklist,
│   │                  #   ProjectSubmissionForm, ProjectProgress
│   └── ui/            # Button, Card, Input, Badge, ProgressBar
├── context/
│   └── AuthContext.tsx     # Session, user, profile, auth functions
├── data/
│   └── paths.ts            # Static fallback path data
├── hooks/
│   └── useUserProgress.ts  # Enrollment and lesson-complete hook
├── lib/
│   └── supabase.ts         # Supabase client
├── pages/
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx / SignupPage.tsx
│   ├── DashboardPage.tsx
│   ├── PathDetailPage.tsx
│   ├── LessonPage.tsx
│   ├── ChallengePage.tsx
│   ├── ProjectsPage.tsx
│   ├── ProjectDetailPage.tsx
│   ├── PortfolioPage.tsx
│   └── ProfilePage.tsx
├── services/
│   ├── progress.ts     # Enrollment, lesson completion, XP
│   ├── challenges.ts   # Challenge queries and submission logic
│   └── projects.ts     # Project queries and submission logic
└── types/
    └── index.ts        # All domain types (Path, Lesson, Challenge, Project, etc.)

public/
├── favicon.svg             # Brand icon (SVG — browser tab)
├── apple-touch-icon.png    # iOS home screen icon (180×180)
├── icon-192.png            # PWA icon (192×192)
├── icon-512.png            # PWA icon (512×512)
└── site.webmanifest        # PWA manifest

supabase/migrations/
├── 001_initial_schema.sql  # Profiles, paths, modules, lessons, enrollments
├── 002_challenges.sql      # Challenges + user_challenges
├── 003_lesson_engine.sql   # Lesson engine extensions
└── 004_project_system.sql  # Projects + project_submissions + 24 seed projects
```

---

## Pages & Routes

| Route                                 | Page                                             | Auth     |
| ------------------------------------- | ------------------------------------------------ | -------- |
| `/`                                   | Landing page                                     | Public   |
| `/login`                              | Login                                            | Public   |
| `/signup`                             | Sign up                                          | Public   |
| `/dashboard`                          | Dashboard                                        | Required |
| `/paths`                              | Learning paths list                              | Required |
| `/paths/:slug`                        | Path detail (lessons, challenges, projects tabs) | Required |
| `/paths/:slug/lesson/:lessonId`       | Lesson viewer                                    | Required |
| `/challenges`                         | All challenges                                   | Required |
| `/paths/:slug/challenge/:challengeId` | Challenge page                                   | Required |
| `/projects`                           | All projects                                     | Required |
| `/paths/:slug/project/:projectId`     | Project detail + submission                      | Required |
| `/portfolio`                          | Submitted projects gallery                       | Required |
| `/profile`                            | User profile                                     | Required |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project with all migrations in `supabase/migrations/` applied

### Setup

```sh
# 1. Install dependencies
npm install

# 2. (Optional) Point at your own Supabase project
#    The app has hardcoded credentials for the demo project,
#    so this step is only needed if you want your own instance.
cp .env.example .env
# Edit .env with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

# 3. Start the dev server
npm run dev
```

### Build for production

```sh
npm run build
```

### Regenerate brand icons

```sh
node scripts/generate-icons.mjs
```

---

## Database Schema

| Table                 | Purpose                                                           |
| --------------------- | ----------------------------------------------------------------- |
| `profiles`            | User profile (xp, level, streak, bio) — auto-created via trigger  |
| `learning_paths`      | All available learning paths                                      |
| `modules`             | Modules belonging to a path                                       |
| `lessons`             | Lessons belonging to a module                                     |
| `user_progress`       | Per-user enrollment and lesson completion state                   |
| `challenges`          | Coding challenges linked to paths                                 |
| `user_challenges`     | Per-user challenge completion + XP awarded                        |
| `projects`            | Portfolio projects linked to paths (with requirements as jsonb)   |
| `project_submissions` | Per-user project submissions (GitHub URL, demo, status, feedback) |
| `badges`              | Badge definitions                                                 |

Row-Level Security (RLS) is enabled on all tables. Users can only read/write their own rows.

---

## Environment Variables

| Variable                 | Description                          |
| ------------------------ | ------------------------------------ |
| `VITE_SUPABASE_URL`      | Your Supabase project URL            |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase publishable (anon) key |

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
