# Unleash Coding

A free, full-stack coding career platform — structured learning paths, real-world challenges, portfolio projects, a community showcase, interactive engineering tools, and a full admin CMS to take you from complete beginner to job-ready developer.

**Live site:** https://unleash-coding.vercel.app

---

## Features

### Learning Paths

- **30 career paths** across three tiers:
  - *Original 18*: Python, JavaScript, TypeScript, Frontend, React, Backend, Full-Stack, Node.js, SQL Databases, DSA, Java, C++, DevOps, Cloud Architecture, Cybersecurity, AI/ML, Mobile (React Native), Open Source
  - *New 12 (migration 011)*: TypeScript Developer, Git & GitHub, Linux & Terminal, API Engineering, Software Architecture, Testing & QA, Docker & Kubernetes, Networking, Operating Systems, Distributed Systems, Performance Optimization, Open Source Contribution
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
- **Lesson quizzes** — multiple-choice questions attached to lessons; unique constraint on `(lesson_id, order_index)` ensures idempotent seeding; quiz questions seeded for 14 paths across migrations 012–016

### Challenge System

- Coding challenges per learning path with difficulty levels (beginner / intermediate / advanced)
- Multiple-choice and code challenges with instant feedback
- XP rewards on completion with duplicate-XP prevention
- Challenges page with difficulty filter and per-path tabs

### Portfolio Project System

- **63+ real portfolio projects** seeded across all 30 paths (3–4 per path)
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

### Beta Launch System

- **Waitlist** — public sign-up form at `/waitlist` (name, email, interest area)
- **Invite-only access** — admins generate unique invite codes; `/invite/:code` validates and routes to signup
- **Beta onboarding** — 5-step guided tour at `/onboarding` on first login
- **Beta feedback button** — floating button on every page lets users submit bugs, design issues, feature requests, and more
- **Beta banner** — dismissable announcement bar shown to all authenticated users
- **User activity tracking** — every key action (lesson start, completion, onboarding, etc.) is logged to `user_activity`

### Admin CMS (`/admin`)

Role-based admin area — accessible only to users with `role = 'admin'` in the database.

| Section                | Capabilities                                                                                    |
| ---------------------- | ----------------------------------------------------------------------------------------------- |
| **Dashboard**          | Platform stats: total paths, lessons, challenges, projects, users, submissions, pending reports |
| **Learning Paths**     | Full CRUD — create, edit, and delete paths with category, difficulty, tags, and metadata        |
| **Modules**            | Full CRUD — link modules to paths, set level and order                                          |
| **Lessons**            | Full CRUD — write full Markdown lesson content, set type and duration                           |
| **Challenges**         | Full CRUD — 7 challenge types, options, hints, starter code, expected answer, XP                |
| **Projects**           | Full CRUD for portfolio projects + showcase management (feature, set public, update status)     |
| **Reports**            | Review and resolve community reports with status filter                                         |
| **Users**              | View all learners, promote/demote admin role with self-protection guard                         |
| **Beta Dashboard**     | Analytics grid, create/copy/revoke invite codes, manage waitlist statuses                       |
| **Feedback Dashboard** | Review beta feedback by type, update statuses inline                                            |
| **Launch Checklist**   | ~60-item grouped checklist with priority labels, persisted in `localStorage`                    |

Admin routes are protected by a dedicated `AdminRoute` guard. The admin sidebar is a completely separate layout from the main app. Non-admin users are redirected to `/unauthorized`.

### UX & Quality

- App-wide toast notifications (success, error, warning, info) with auto-dismiss and progress bar
- React error boundary — catches render errors and shows a "Try Again" fallback
- Loading skeletons for all major pages
- Empty states for every list that can be empty
- Custom 404 page at `*` and 403 Unauthorized page at `/unauthorized`

---

## Advanced Engineering Tools (Phase 12)

### Code Playground (`/playground`)

- Live in-browser code runner for **JavaScript**, **TypeScript**, **Python**, and **SQL**
- JS/TS runs in a sandboxed `<iframe>` (no same-origin, `allow-scripts` only) — console output captured via `postMessage`
- TypeScript compiled via Monaco's built-in TS worker (`getEmitOutput`) before running
- Python powered by **Pyodide** (WASM, loaded from CDN) — stdout captured via `io.StringIO`
- SQL runs in-memory via **sql.js** (SQLite WASM, CDN) — results formatted as tables
- Monaco Editor with Fira Code, ligatures, dark theme, and per-language starter templates
- Save, load, and delete code snippets synced to Supabase (`saved_code_snippets`)

### DSA Visualizer (`/dsa`)

- **Sorting**: Bubble, Selection, Insertion, Merge, Quick Sort — animated bar chart with step-by-step play/pause/scrub controls
- **Searching**: Linear and Binary Search — highlighted array cell animation
- **Data Structures**: Interactive Stack and Queue (push/pop/enqueue/dequeue)
- **Tree**: Binary Search Tree — SVG-based layout with insert and search highlighting

### System Design Canvas (`/system-design`)

- Drag-and-drop architecture diagramming powered by **React Flow**
- Component palette: Client, Frontend, Load Balancer, API Server, Database, Cache, Message Queue, CDN, Storage, Auth Service
- Pre-built templates: Social Media App, Chat App, URL Shortener
- Nodes connect with edges; delete with the Delete key; save draft to `localStorage`

### Interview Prep (`/interview-prep`)

- **DSA Question Bank** — 20 curated LeetCode problems with topic/difficulty filters and solved-tracking (persisted in `localStorage`)
- **Behavioral Questions** — 10 STAR-category questions with prev/next/random navigation
- **Mock Interview Checklist** — 14 items across 4 categories (Preparation, Technical, Behavioral, Follow-up) with progress bar
- **STAR Method Builder** — four textarea fields (Situation, Task, Action, Result) with copy-to-clipboard

### Resume Builder (`/resume-builder`)

- Form editor with tabs: Personal Info, Experience, Education, Skills, Projects, Certifications
- Live preview panel — updates as you type
- Three templates: **Modern** (purple accent header), **Minimal** (clean lines), **Classic** (dark header)
- **Export to PDF** via `html2canvas` + `jsPDF` (A4, 2× scale for crisp output)
- Saves resume data to Supabase (`resume_profiles`) per user; draft cached in `localStorage`

### Study Planner (`/study-planner`)

- **GitHub-style heatmap** — 16-week calendar grid colour-coded by daily study minutes
- **Daily Goals** — set targets (minutes/day + topic), track today's progress with a live bar
- **Session Logger** — log any study session (duration, topic, notes) saved to Supabase (`study_sessions`)
- **Today's Task Checklist** — add/check/remove daily tasks persisted in `localStorage` (keyed by date)
- Weekly summary stats: today's minutes, week total, all-time sessions

### Progressive Web App (PWA)

- Service worker via **vite-plugin-pwa** (Workbox, `autoUpdate`)
- Precaches all JS/CSS/HTML/fonts at build time
- Supabase API requests use a **NetworkFirst** strategy (5-minute cache)
- Installable as a standalone app on desktop and mobile
- Offline fallback page at `/offline`

---

## Tech Stack

| Layer          | Technology                             |
| -------------- | -------------------------------------- |
| Frontend       | React 19 + TypeScript + Vite 8         |
| Styling        | Tailwind CSS v4 (dark theme)           |
| Routing        | React Router DOM v7                    |
| Backend / DB   | Supabase (PostgreSQL + Auth + RLS)     |
| Code Editor    | Monaco Editor (`@monaco-editor/react`) |
| Diagrams       | React Flow (`@xyflow/react`)           |
| Python Runtime | Pyodide (WASM, CDN)                    |
| SQL Runtime    | sql.js (SQLite WASM, CDN)              |
| PDF Export     | jsPDF + html2canvas                    |
| PWA            | vite-plugin-pwa (Workbox)              |
| Icons          | Lucide React                           |
| Deployment     | Vercel (auto-deploy from `main`)       |

---

## Project Structure

```
src/
├── components/
│   ├── admin/         # AdminLayout, AdminTable, AdminModal, AdminStatsCard, ActivityStatsCard
│   ├── auth/          # Login / signup forms
│   ├── challenge/     # ChallengeCard, ChallengeModal, ChallengeProgress
│   ├── dashboard/     # Dashboard widgets
│   ├── dsa/           # SortingVisualizer, ArrayVisualizer (search + stack/queue), TreeVisualizer
│   ├── gamification/  # XP bar, level card, streak, badges, leaderboard
│   ├── layout/        # AppLayout, Sidebar, Topbar
│   ├── lesson/        # Lesson viewer
│   ├── path/          # Path cards and detail components
│   ├── playground/    # CodeEditor, OutputConsole, RunControls, PlaygroundSidebar
│   ├── profile/       # Profile UI
│   ├── resume/        # ResumePreview (modern/minimal/classic)
│   ├── studyplanner/  # CalendarHeatmap, GoalTracker, TaskChecklist
│   ├── systemdesign/  # ArchitectureCanvas (React Flow), ComponentPalette
│   └── ui/            # Button, Card, Input, Badge, ProgressBar, Skeleton,
│                      #   EmptyState, ErrorBoundary, FeedbackButton, BetaBanner
├── context/
│   ├── AuthContext.tsx      # Session, user, profile, auth functions
│   └── ToastContext.tsx     # App-wide toast notifications (success/error/warning/info)
├── data/
│   └── paths.ts             # Static fallback path data
├── hooks/
│   └── useUserProgress.ts   # Enrollment and lesson-complete hook
├── lib/
│   └── supabase.ts          # Supabase client
├── pages/
│   ├── admin/               # AdminDashboard, Paths, Modules, Lessons,
│   │                        #   Challenges, Projects, Reports, Users,
│   │                        #   AdminBetaDashboard, AdminFeedbackDashboard,
│   │                        #   AdminLaunchChecklist
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
│   ├── ProfilePage.tsx / PublicProfilePage.tsx
│   ├── WaitlistPage.tsx         # Public beta waitlist
│   ├── BetaInvitePage.tsx       # Invite code validation
│   ├── BetaOnboardingPage.tsx   # 5-step guided onboarding
│   ├── PlaygroundPage.tsx       # Multi-language code playground
│   ├── DSAVisualizerPage.tsx    # DSA algorithm visualizer
│   ├── SystemDesignPage.tsx     # Drag-and-drop architecture canvas
│   ├── InterviewPrepPage.tsx    # DSA questions, behavioral, checklist, STAR
│   ├── ResumeBuilderPage.tsx    # Resume builder + PDF export
│   ├── StudyPlannerPage.tsx     # Study sessions, heatmap, goals, tasks
│   ├── OfflinePage.tsx          # PWA offline fallback
│   ├── NotFoundPage.tsx         # 404
│   └── UnauthorizedPage.tsx     # 403
├── services/
│   ├── admin.ts        # All admin CRUD + showcase management
│   ├── progress.ts     # Enrollment, lesson completion, XP
│   ├── challenges.ts   # Challenge queries and submission logic
│   ├── projects.ts     # Project queries and submission logic
│   ├── gamification.ts # XP, badges, leaderboard
│   ├── community.ts    # Likes, comments, reports
│   ├── learningPaths.ts# Path and module queries
│   ├── lesson.ts       # Lesson queries
│   ├── feedback.ts     # Beta feedback submit + admin queries
│   ├── beta.ts         # Waitlist, invites, activity tracking
│   ├── analytics.ts    # Beta analytics aggregations
│   ├── playground.ts   # Saved code snippets (Supabase)
│   ├── resume.ts       # Resume profile save/load (Supabase)
│   └── studyplanner.ts # Study goals + sessions (Supabase)
└── types/
    └── index.ts        # All domain types including admin types

supabase/migrations/
├── 001_initial_schema.sql    # Profiles, paths, modules, lessons, enrollments
├── 002_lesson_engine.sql     # Lesson engine extensions
├── 003_challenge_system.sql  # Challenges + user_challenges
├── 004_project_system.sql    # Projects + project_submissions + 24 seed projects
├── 005_gamification.sql      # XP, badges, leaderboard
├── 006_community.sql         # Community showcase, likes, comments, reports
├── 007_admin.sql             # Admin role, is_admin() function, RLS policies
├── 008_beta_feedback.sql     # beta_feedback table for in-app feedback submissions
├── 009_beta_launch.sql       # beta_waitlist, beta_invites, user_activity
├── 010_phase12.sql           # saved_code_snippets, resume_profiles,
│                             #   study_goals, study_sessions, bookmarks
├── 011_new_paths.sql         # 12 new learning paths + modules, challenges, projects
├── 012_lessons_python_js_ts.sql        # Lessons for Python, JavaScript, TypeScript paths
├── 013_lessons_frontend_react_backend_sql_dsa.sql  # Lessons for Frontend, React, Backend, SQL, DSA
├── 014_lessons_java_devops_cloud_security_new_paths.sql  # Lessons for Java, DevOps, Cloud, Security + new paths
├── 015_challenges_projects_extended.sql  # Extended challenges & projects for all 18 original paths
└── 016_quiz_questions.sql    # Quiz questions for lessons across 14 paths
```

---

## Pages & Routes

| Route                                 | Page                              | Auth       |
| ------------------------------------- | --------------------------------- | ---------- |
| `/`                                   | Landing page                      | Public     |
| `/login`                              | Login                             | Public     |
| `/signup`                             | Sign up                           | Public     |
| `/waitlist`                           | Beta waitlist sign-up             | Public     |
| `/invite/:code`                       | Invite code validation            | Public     |
| `/dashboard`                          | Dashboard                         | Required   |
| `/onboarding`                         | Beta onboarding tour              | Required   |
| `/paths`                              | Learning paths list               | Required   |
| `/paths/:slug`                        | Path detail (modules & lessons)   | Required   |
| `/paths/:slug/lesson/:lessonId`       | Lesson viewer                     | Required   |
| `/challenges`                         | All challenges                    | Required   |
| `/paths/:slug/challenge/:challengeId` | Challenge page                    | Required   |
| `/projects`                           | All projects                      | Required   |
| `/paths/:slug/project/:projectId`     | Project detail + submission       | Required   |
| `/portfolio`                          | Submitted projects gallery        | Required   |
| `/community`                          | Community showcase gallery        | Required   |
| `/showcase/:submissionId`             | Single project showcase           | Required   |
| `/leaderboard`                        | XP leaderboard                    | Required   |
| `/profile`                            | User profile & settings           | Required   |
| `/u/:username`                        | Public profile page               | Required   |
| `/playground`                         | Multi-language code playground    | Required   |
| `/dsa`                                | DSA algorithm visualizer          | Required   |
| `/system-design`                      | Architecture canvas               | Required   |
| `/interview-prep`                     | Interview prep hub                | Required   |
| `/resume-builder`                     | Resume builder + PDF export       | Required   |
| `/study-planner`                      | Study sessions & goal tracker     | Required   |
| `/unauthorized`                       | 403 page                          | Public     |
| `*`                                   | 404 page                          | Public     |
| `/admin`                              | Admin dashboard                   | Admin only |
| `/admin/paths`                        | Manage learning paths             | Admin only |
| `/admin/modules`                      | Manage modules                    | Admin only |
| `/admin/lessons`                      | Manage lessons                    | Admin only |
| `/admin/challenges`                   | Manage challenges                 | Admin only |
| `/admin/projects`                     | Manage projects & showcase        | Admin only |
| `/admin/reports`                      | Review community reports          | Admin only |
| `/admin/users`                        | View and manage users             | Admin only |
| `/admin/beta`                         | Beta analytics, invites, waitlist | Admin only |
| `/admin/feedback`                     | Review beta feedback              | Admin only |
| `/admin/launch-checklist`             | Pre-launch checklist              | Admin only |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project with all migrations in `supabase/migrations/` applied in order

### Setup

```sh
# 1. Install dependencies
npm install

# 2. Point at your Supabase project
cp .env.example .env
# Edit .env with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

# 3. Apply all migrations in order via the Supabase SQL editor or CLI:
supabase db push

# 4. Start the dev server
npm run dev
```

### Build for production

```sh
npm run build
```

---

## Database Schema

| Table                 | Purpose                                                                   |
| --------------------- | ------------------------------------------------------------------------- |
| `profiles`            | User profile (xp, level, streak, bio, role) — auto-created on signup      |
| `learning_paths`      | All available learning paths                                              |
| `modules`             | Modules belonging to a path                                               |
| `lessons`             | Lessons belonging to a module                                             |
| `user_progress`       | Per-user enrollment and lesson completion state                           |
| `challenges`          | Coding challenges linked to paths                                         |
| `user_challenges`     | Per-user challenge completion + XP awarded                                |
| `projects`            | Portfolio projects linked to paths                                        |
| `project_submissions` | Per-user project submissions (GitHub URL, demo, status, feedback)         |
| `project_reports`     | Community reports on submitted projects                                   |
| `badges`              | Badge definitions                                                         |
| `beta_feedback`       | In-app feedback submissions (bug, design issue, feature request, etc.)    |
| `beta_waitlist`       | Beta waitlist sign-ups (email, name, interest area, status)               |
| `beta_invites`        | Invite codes with usage tracking (unused / used / revoked)                |
| `user_activity`       | Event log for user actions (lesson starts, completions, onboarding, etc.) |
| `saved_code_snippets` | Playground code snippets saved per user (language, title, code)           |
| `resume_profiles`     | Resume data per user (JSON) + selected template                           |
| `study_goals`         | Daily study goals (title, target minutes, topic)                          |
| `study_sessions`      | Logged study sessions (duration, date, topic, notes)                      |
| `bookmarks`           | Saved lessons / challenges / projects / paths per user                    |
| `lesson_quizzes`      | Multiple-choice quiz questions attached to lessons (unique per lesson + order_index) |

Row-Level Security (RLS) is enabled on all tables. Admins receive elevated read/write policies controlled by the `is_admin()` SQL function and the `profiles.role` column.

### Creating the first admin

Run this in the Supabase SQL editor after applying all migrations:

```sql
UPDATE profiles SET role = 'admin' WHERE id = '<your-user-uuid>';
```

---

## Beta Launch Flow

1. **Waitlist** — share `/waitlist`; interested users fill in their email and interest area.
2. **Invite** — in `/admin/beta`, create an invite for a waitlist email; copy the `/invite/:code` link and send it.
3. **Sign up** — the invite page validates the code and pre-fills the signup URL (`/signup?invite=<code>&email=<email>`).
4. **Onboard** — after first login, direct users to `/onboarding` for the guided 5-step tour.
5. **Feedback** — users submit feedback via the floating button; review and triage it in `/admin/feedback`.
6. **Track** — user activity is logged automatically; view aggregate metrics in `/admin/beta`.

---

## Environment Variables

| Variable                 | Description                          |
| ------------------------ | ------------------------------------ |
| `VITE_SUPABASE_URL`      | Your Supabase project URL            |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase publishable (anon) key |

> Vite bakes env vars at build time. If deploying to Vercel, set these in your project's Environment Variables settings.
