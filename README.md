# Unleash Coding

A free, full-stack coding career platform — structured learning paths, real-world challenges, portfolio projects, a community showcase, and a full admin CMS to take you from complete beginner to job-ready developer.

**Live site:** https://unleash-coding.vercel.app

---

## Features

### Learning Paths

- 8 career paths: Python, JavaScript, Frontend, Backend, Full-Stack, AI/ML, DevOps, Cybersecurity
- Beginner → Intermediate → Advanced modules loaded from Supabase
- Enroll in any path and track progress independently with real progress bars

### Authentication & Profiles

- Signup, login, and logout via Supabase Auth
- User profiles auto-created on signup (XP, level, streak, bio, avatar URL, social links)
- Protected routes — all app pages require authentication

### Lesson Engine

- Full lesson viewer with content, code examples, and key takeaways
- Mark lessons complete, earn XP, auto-advance to the next lesson
- Previous / next navigation and breadcrumb trail

### Challenge System

- Coding challenges per learning path with difficulty levels (beginner / intermediate / advanced)
- Multiple-choice and code challenges with instant feedback
- XP rewards on completion with duplicate-XP prevention
- Challenges page with difficulty filter and per-path tabs

### Portfolio Project System

- 24 real portfolio projects seeded across all 8 paths (3 per path)
- Projects page — browse by enrolled path, filter by difficulty
- Project detail page — requirements checklist, skills covered, estimated hours
- Submit via GitHub URL + live demo link
- Project submission status tracking (submitted → reviewed → approved / revision requested)
- Portfolio page — gallery of submitted projects with status badges, feedback, and XP earned

### Community Showcase

- Public project gallery — browse featured and community-submitted projects
- Like and comment on any submission
- Public profile pages (`/u/:username`) displaying bio, social links, and portfolio
- Profile privacy and portfolio settings
- Search bar and featured filter on the community gallery
- Report inappropriate projects

### XP & Progression

- XP earned from lessons, challenges, and project submissions
- Level calculated from total XP, displayed with a progress bar
- Day streak tracking
- Leaderboard page with top users ranked by XP

### Admin CMS (`/admin`)

Role-based admin area — accessible only to users with `role = 'admin'` in the database.

| Section | Capabilities |
|---|---|
| **Dashboard** | Platform stats: total paths, lessons, challenges, projects, users, submissions, pending reports |
| **Learning Paths** | Full CRUD — create, edit, and delete paths with category, difficulty, tags, and metadata |
| **Modules** | Full CRUD — link modules to paths, set level and order |
| **Lessons** | Full CRUD — write full Markdown lesson content, set type and duration |
| **Challenges** | Full CRUD — 7 challenge types, options, hints, starter code, expected answer, XP |
| **Projects** | Full CRUD for portfolio projects + showcase management (feature, set public, update status) |
| **Reports** | Review and resolve community reports with status filter |
| **Users** | View all learners, promote/demote admin role with self-protection guard |

Admin routes are protected by a dedicated `AdminRoute` guard. The admin sidebar is a completely separate layout from the main app.

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
│   ├── admin/         # AdminLayout, AdminTable, AdminModal, AdminStatsCard
│   ├── auth/          # Login / signup forms
│   ├── challenge/     # ChallengeCard, ChallengeModal, ChallengeProgress
│   ├── dashboard/     # Dashboard widgets
│   ├── layout/        # AppLayout, Sidebar, Topbar
│   ├── lesson/        # Lesson viewer
│   ├── path/          # Path cards and detail components
│   ├── profile/       # Profile UI
│   └── ui/            # Button, Card, Input, Badge, ProgressBar
├── context/
│   └── AuthContext.tsx      # Session, user, profile, auth functions
├── data/
│   └── paths.ts             # Static fallback path data
├── hooks/
│   └── useUserProgress.ts   # Enrollment and lesson-complete hook
├── lib/
│   └── supabase.ts          # Supabase client
├── pages/
│   ├── admin/               # AdminDashboard, Paths, Modules, Lessons,
│   │                        #   Challenges, Projects, Reports, Users
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx / SignupPage.tsx
│   ├── DashboardPage.tsx
│   ├── PathDetailPage.tsx
│   ├── LessonPage.tsx
│   ├── ChallengePage.tsx / ChallengesPage.tsx
│   ├── ProjectsPage.tsx / ProjectDetailPage.tsx
│   ├── PortfolioPage.tsx
│   ├── CommunityPage.tsx / ProjectShowcasePage.tsx
│   ├── LeaderboardPage.tsx
│   ├── PublicProfilePage.tsx
│   └── ProfilePage.tsx
├── services/
│   ├── admin.ts        # All admin CRUD + showcase management
│   ├── progress.ts     # Enrollment, lesson completion, XP
│   ├── challenges.ts   # Challenge queries and submission logic
│   └── projects.ts     # Project queries and submission logic
└── types/
    └── index.ts        # All domain types including admin types

supabase/migrations/
├── 001_initial_schema.sql   # Profiles, paths, modules, lessons, enrollments
├── 002_challenges.sql       # Challenges + user_challenges
├── 003_lesson_engine.sql    # Lesson engine extensions
├── 004_project_system.sql   # Projects + project_submissions + 24 seed projects
├── 005_leaderboard.sql      # Leaderboard and XP aggregation
├── 006_community.sql        # Community showcase, likes, comments, reports
└── 007_admin.sql            # Admin role, is_admin() function, RLS policies
```

---

## Pages & Routes

| Route                                   | Page                              | Auth          |
| --------------------------------------- | --------------------------------- | ------------- |
| `/`                                     | Landing page                      | Public        |
| `/login`                                | Login                             | Public        |
| `/signup`                               | Sign up                           | Public        |
| `/dashboard`                            | Dashboard                         | Required      |
| `/paths`                                | Learning paths list               | Required      |
| `/paths/:slug`                          | Path detail (modules & lessons)   | Required      |
| `/paths/:slug/lesson/:lessonId`         | Lesson viewer                     | Required      |
| `/challenges`                           | All challenges                    | Required      |
| `/paths/:slug/challenge/:challengeId`   | Challenge page                    | Required      |
| `/projects`                             | All projects                      | Required      |
| `/paths/:slug/project/:projectId`       | Project detail + submission       | Required      |
| `/portfolio`                            | Submitted projects gallery        | Required      |
| `/community`                            | Community showcase gallery        | Required      |
| `/showcase/:submissionId`               | Single project showcase           | Required      |
| `/leaderboard`                          | XP leaderboard                    | Required      |
| `/profile`                              | User profile & settings           | Required      |
| `/u/:username`                          | Public profile page               | Required      |
| `/admin`                                | Admin dashboard                   | Admin only    |
| `/admin/paths`                          | Manage learning paths             | Admin only    |
| `/admin/modules`                        | Manage modules                    | Admin only    |
| `/admin/lessons`                        | Manage lessons                    | Admin only    |
| `/admin/challenges`                     | Manage challenges                 | Admin only    |
| `/admin/projects`                       | Manage projects & showcase        | Admin only    |
| `/admin/reports`                        | Review community reports          | Admin only    |
| `/admin/users`                          | View and manage users             | Admin only    |

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

---

## Database Schema

| Table                 | Purpose                                                              |
| --------------------- | -------------------------------------------------------------------- |
| `profiles`            | User profile (xp, level, streak, bio, role) — auto-created on signup |
| `learning_paths`      | All available learning paths                                         |
| `modules`             | Modules belonging to a path                                          |
| `lessons`             | Lessons belonging to a module                                        |
| `user_progress`       | Per-user enrollment and lesson completion state                      |
| `challenges`          | Coding challenges linked to paths                                    |
| `user_challenges`     | Per-user challenge completion + XP awarded                           |
| `projects`            | Portfolio projects linked to paths                                   |
| `project_submissions` | Per-user project submissions (GitHub URL, demo, status, feedback)    |
| `project_reports`     | Community reports on submitted projects                              |
| `badges`              | Badge definitions                                                    |

Row-Level Security (RLS) is enabled on all tables. Admins receive elevated read/write policies controlled by the `is_admin()` SQL function and the `profiles.role` column.

### Creating the first admin

Run this in the Supabase SQL editor after applying all migrations:

```sql
UPDATE profiles SET role = 'admin' WHERE id = '<your-user-uuid>';
```

---

## Environment Variables

| Variable                 | Description                          |
| ------------------------ | ------------------------------------ |
| `VITE_SUPABASE_URL`      | Your Supabase project URL            |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase publishable (anon) key |

> Vite bakes env vars at build time. If deploying to Vercel, set these in your project's Environment Variables settings.
