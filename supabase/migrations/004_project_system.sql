-- ============================================================
-- Migration 004: Portfolio Project System
-- ============================================================

-- ─── Extend projects table ────────────────────────────────────────────────────

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS portfolio_level   text    DEFAULT 'Beginner Portfolio',
  ADD COLUMN IF NOT EXISTS requirements      jsonb   DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS skills_covered    jsonb   DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS estimated_hours   int     DEFAULT 5,
  ADD COLUMN IF NOT EXISTS xp_reward         int     DEFAULT 100,
  ADD COLUMN IF NOT EXISTS order_index       int     DEFAULT 0;

-- Patch existing rows so NULLs don't cause issues
UPDATE projects SET
  portfolio_level  = COALESCE(portfolio_level, 'Beginner Portfolio'),
  requirements     = COALESCE(requirements,    '[]'::jsonb),
  skills_covered   = COALESCE(skills_covered,  '[]'::jsonb),
  estimated_hours  = COALESCE(estimated_hours, 5),
  xp_reward        = COALESCE(xp_reward,       100),
  order_index      = COALESCE(order_index,     0);

-- ─── Project submissions table ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS project_submissions (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id    uuid        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  github_url    text        DEFAULT '',
  demo_url      text        DEFAULT '',
  notes         text        DEFAULT '',
  status        text        NOT NULL DEFAULT 'submitted',
  feedback      text        DEFAULT '',
  xp_awarded    int         NOT NULL DEFAULT 0,
  submitted_at  timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, project_id)
);

-- ─── RLS ─────────────────────────────────────────────────────────────────────

ALTER TABLE project_submissions ENABLE ROW LEVEL SECURITY;

-- Allow logged-in users to read projects (may already exist from earlier migrations)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'projects' AND policyname = 'Authenticated users can read projects'
  ) THEN
    CREATE POLICY "Authenticated users can read projects"
      ON projects FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Users manage own submissions
CREATE POLICY "Users can insert own submissions"
  ON project_submissions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own submissions"
  ON project_submissions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own submissions"
  ON project_submissions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── Seed helper: resolve path id ────────────────────────────────────────────

DO $$
DECLARE
  v_python_id    uuid;
  v_js_id        uuid;
  v_frontend_id  uuid;
  v_backend_id   uuid;
  v_fullstack_id uuid;
  v_ai_id        uuid;
  v_devops_id    uuid;
  v_cyber_id     uuid;
BEGIN
  SELECT id INTO v_python_id    FROM learning_paths WHERE slug = 'python-developer'       LIMIT 1;
  SELECT id INTO v_js_id        FROM learning_paths WHERE slug = 'javascript-developer'   LIMIT 1;
  SELECT id INTO v_frontend_id  FROM learning_paths WHERE slug = 'frontend-developer'     LIMIT 1;
  SELECT id INTO v_backend_id   FROM learning_paths WHERE slug = 'backend-developer'      LIMIT 1;
  SELECT id INTO v_fullstack_id FROM learning_paths WHERE slug = 'fullstack-developer'    LIMIT 1;
  SELECT id INTO v_ai_id        FROM learning_paths WHERE slug = 'ai-machine-learning'    LIMIT 1;
  SELECT id INTO v_devops_id    FROM learning_paths WHERE slug = 'cloud-devops'           LIMIT 1;
  SELECT id INTO v_cyber_id     FROM learning_paths WHERE slug = 'cybersecurity'          LIMIT 1;

  -- ── Python Developer projects ──────────────────────────────────────────────
  IF v_python_id IS NOT NULL THEN
    INSERT INTO projects (path_id, title, description, difficulty, portfolio_level, requirements, skills_covered, estimated_hours, xp_reward, order_index)
    VALUES
      (v_python_id, 'CLI To-Do App',
       'Build a command-line task manager that lets users add, complete, and delete tasks with file persistence.',
       'beginner', 'Beginner Portfolio',
       '["Create a CLI with argparse or click","Store tasks in a JSON file","Mark tasks as complete","Delete tasks by ID","List all tasks with status","Add a --help menu"]'::jsonb,
       '["Python basics","File I/O","CLI argument parsing","JSON serialization"]'::jsonb,
       8, 100, 1),

      (v_python_id, 'Weather Data Analyzer',
       'Fetch and analyze weather data from an open API, produce summaries and visualisations.',
       'intermediate', 'Internship Ready',
       '["Consume OpenWeatherMap API","Parse and clean JSON responses","Calculate daily min/max/avg temperatures","Plot a 7-day forecast chart with matplotlib","Handle API errors gracefully","Export summary as CSV"]'::jsonb,
       '["REST API consumption","Data processing","Matplotlib","Error handling","CSV export"]'::jsonb,
       12, 150, 2),

      (v_python_id, 'Personal Finance Tracker',
       'A full-featured terminal and/or GUI app to track income, expenses, and savings goals.',
       'advanced', 'Junior Developer Ready',
       '["Add income and expense entries","Categorise transactions","Monthly summary report","Budget vs actual comparison","Export to CSV/PDF","Persistent SQLite storage"]'::jsonb,
       '["SQLite","Data analysis","GUI with tkinter or Rich","Report generation","OOP design"]'::jsonb,
       20, 200, 3);
  END IF;

  -- ── JavaScript Developer projects ─────────────────────────────────────────
  IF v_js_id IS NOT NULL THEN
    INSERT INTO projects (path_id, title, description, difficulty, portfolio_level, requirements, skills_covered, estimated_hours, xp_reward, order_index)
    VALUES
      (v_js_id, 'Interactive Quiz App',
       'A timed, score-tracked quiz app with multiple categories and a leaderboard.',
       'beginner', 'Beginner Portfolio',
       '["Render questions from a JS array or JSON file","Track score and time per question","Show correct answer feedback","Display final score screen","Responsive layout","At least 3 quiz categories"]'::jsonb,
       '["DOM manipulation","Event handling","Timer","JSON","CSS animations"]'::jsonb,
       8, 100, 1),

      (v_js_id, 'Movie Search App',
       'Search OMDB or TMDB for movies, show details, and save favourites to localStorage.',
       'intermediate', 'Internship Ready',
       '["Search field that queries a movie API","Display title, poster, year, rating","Favourite/unfavourite with localStorage","Filter by genre","Loading and error states","Responsive grid"]'::jsonb,
       '["Fetch API","Async/await","localStorage","CSS Grid","API key management"]'::jsonb,
       12, 150, 2),

      (v_js_id, 'Browser Productivity Timer',
       'A Pomodoro-style productivity timer with task list, session history, and notification support.',
       'advanced', 'Junior Developer Ready',
       '["25/5 Pomodoro cycle","Custom work/break durations","Task list tied to sessions","Browser Notification API","Session history in localStorage","Keyboard shortcuts"]'::jsonb,
       '["Web APIs","Service Workers (optional)","State management","CSS animations","Accessibility"]'::jsonb,
       16, 200, 3);
  END IF;

  -- ── Frontend Developer projects ───────────────────────────────────────────
  IF v_frontend_id IS NOT NULL THEN
    INSERT INTO projects (path_id, title, description, difficulty, portfolio_level, requirements, skills_covered, estimated_hours, xp_reward, order_index)
    VALUES
      (v_frontend_id, 'Responsive Landing Page',
       'Design and build a pixel-perfect, fully responsive SaaS landing page from a Figma-style spec.',
       'beginner', 'Beginner Portfolio',
       '["Hero section with CTA","Feature grid","Pricing table","FAQ accordion","Mobile navigation menu","Smooth scroll anchors","Lighthouse score ≥ 90"]'::jsonb,
       '["HTML5 semantics","CSS Grid & Flexbox","Responsive design","Accessibility","Performance optimisation"]'::jsonb,
       10, 100, 1),

      (v_frontend_id, 'SaaS Dashboard UI',
       'Build a multi-section analytics dashboard with charts, data tables, and a side navigation.',
       'intermediate', 'Internship Ready',
       '["Collapsible sidebar navigation","KPI stat cards","Line/bar chart with Chart.js or Recharts","Sortable data table","Dark/light mode toggle","Responsive layout"]'::jsonb,
       '["React or Vue","Charting libraries","State management","CSS variables","Component design"]'::jsonb,
       18, 150, 2),

      (v_frontend_id, 'Portfolio Website',
       'Design and ship a professional developer portfolio with projects, skills, and contact form.',
       'advanced', 'Junior Developer Ready',
       '["Projects section with live/GitHub links","Skills progress bars","About me section","Working contact form","Animated page transitions","SEO meta tags","Custom domain deployment"]'::jsonb,
       '["Next.js or Astro","Animation (Framer Motion)","Form handling","SEO","Deployment"]'::jsonb,
       24, 200, 3);
  END IF;

  -- ── Backend Developer projects ────────────────────────────────────────────
  IF v_backend_id IS NOT NULL THEN
    INSERT INTO projects (path_id, title, description, difficulty, portfolio_level, requirements, skills_covered, estimated_hours, xp_reward, order_index)
    VALUES
      (v_backend_id, 'REST API for Tasks',
       'Build a CRUD REST API for a task manager with Express.js and SQLite.',
       'beginner', 'Beginner Portfolio',
       '["GET /tasks — list all tasks","POST /tasks — create task","PUT /tasks/:id — update task","DELETE /tasks/:id — delete task","SQLite persistence","Input validation","Proper HTTP status codes"]'::jsonb,
       '["Node.js","Express.js","SQLite/better-sqlite3","REST conventions","Input validation"]'::jsonb,
       10, 100, 1),

      (v_backend_id, 'Authenticated Notes API',
       'Extend the tasks API with JWT authentication so users can only access their own notes.',
       'intermediate', 'Internship Ready',
       '["POST /auth/register","POST /auth/login returns JWT","Protect all /notes routes with middleware","Users can only CRUD own notes","Refresh token support","Rate limiting","API documentation"]'::jsonb,
       '["JWT","bcrypt","Middleware","Rate limiting","Swagger/OpenAPI"]'::jsonb,
       16, 150, 2),

      (v_backend_id, 'Job Application Tracker API',
       'A production-ready API to track job applications with status pipeline and email notifications.',
       'advanced', 'Junior Developer Ready',
       '["CRUD for job applications","Status pipeline (applied→interview→offer→rejected)","PostgreSQL with migrations","Email notifications on status change","Export to CSV","Pagination and filtering","Docker Compose setup"]'::jsonb,
       '["PostgreSQL","Prisma or Drizzle","Email (Nodemailer)","Docker","Pagination"]'::jsonb,
       24, 200, 3);
  END IF;

  -- ── Full-Stack Developer projects ─────────────────────────────────────────
  IF v_fullstack_id IS NOT NULL THEN
    INSERT INTO projects (path_id, title, description, difficulty, portfolio_level, requirements, skills_covered, estimated_hours, xp_reward, order_index)
    VALUES
      (v_fullstack_id, 'Full-Stack Task Manager',
       'Build a complete task manager with React frontend, Node.js API, and PostgreSQL database.',
       'beginner', 'Internship Ready',
       '["React frontend with task list","Node/Express backend","PostgreSQL database","User auth with sessions","Real-time updates (polling)","Deployed to Vercel + Railway"]'::jsonb,
       '["React","Node.js","PostgreSQL","Auth","Deployment","CORS"]'::jsonb,
       20, 150, 1),

      (v_fullstack_id, 'Learning Tracker App',
       'A full-stack app for tracking books, courses, and skills with progress visualisation.',
       'intermediate', 'Junior Developer Ready',
       '["User accounts","Add learning resources with categories","Progress tracking per resource","Dashboard with charts","Search and filter","Mobile responsive"]'::jsonb,
       '["Next.js full-stack","Supabase or Prisma","Charts","Authentication","Responsive design"]'::jsonb,
       28, 200, 2),

      (v_fullstack_id, 'Mini Social Feed App',
       'A Twitter-like feed where users post, like, comment, and follow each other.',
       'advanced', 'Advanced / Company-Level',
       '["User profiles with avatars","Create/delete posts","Like and comment system","Follow/unfollow users","Real-time feed with Supabase subscriptions","Image uploads","Notification system"]'::jsonb,
       '["Real-time DB","Image storage","Follow graph","Notifications","Feed ranking"]'::jsonb,
       40, 250, 3);
  END IF;

  -- ── AI / Machine Learning projects ───────────────────────────────────────
  IF v_ai_id IS NOT NULL THEN
    INSERT INTO projects (path_id, title, description, difficulty, portfolio_level, requirements, skills_covered, estimated_hours, xp_reward, order_index)
    VALUES
      (v_ai_id, 'House Price Predictor',
       'Train a regression model on the Ames Housing dataset to predict house prices.',
       'beginner', 'Internship Ready',
       '["Load and explore dataset with pandas","Feature engineering","Train linear regression and random forest","Compare RMSE scores","Visualise feature importance","Save model with joblib","Streamlit demo app"]'::jsonb,
       '["pandas","scikit-learn","Matplotlib","Streamlit","Model evaluation"]'::jsonb,
       12, 150, 1),

      (v_ai_id, 'Resume Skill Matcher',
       'NLP app that parses a resume PDF and scores it against a job description.',
       'intermediate', 'Junior Developer Ready',
       '["PDF text extraction","TF-IDF or spaCy NLP","Skill keyword matching","Match score 0–100","Highlight missing keywords","Streamlit UI","Support multiple job descriptions"]'::jsonb,
       '["NLP","spaCy or NLTK","TF-IDF","PDF parsing","Streamlit"]'::jsonb,
       18, 200, 2),

      (v_ai_id, 'Sentiment Analysis App',
       'Fine-tune a BERT model for sentiment classification and deploy as a REST API.',
       'advanced', 'Advanced / Company-Level',
       '["Dataset preparation and tokenisation","Fine-tune DistilBERT with HuggingFace","Evaluate accuracy, F1","FastAPI endpoint","Docker container","Batch prediction support","Confidence scores in response"]'::jsonb,
       '["HuggingFace Transformers","PyTorch","FastAPI","Docker","Model deployment"]'::jsonb,
       30, 250, 3);
  END IF;

  -- ── Cloud / DevOps projects ───────────────────────────────────────────────
  IF v_devops_id IS NOT NULL THEN
    INSERT INTO projects (path_id, title, description, difficulty, portfolio_level, requirements, skills_covered, estimated_hours, xp_reward, order_index)
    VALUES
      (v_devops_id, 'Deploy React App to Vercel',
       'Set up a production-grade React deployment with preview branches and environment variables.',
       'beginner', 'Beginner Portfolio',
       '["Connect GitHub repo to Vercel","Configure environment variables","Set up preview deployments for PRs","Add custom domain","Configure redirects/rewrites","Monitor with Vercel Analytics"]'::jsonb,
       '["Vercel","CI/CD basics","Environment variables","DNS","Web analytics"]'::jsonb,
       6, 100, 1),

      (v_devops_id, 'Dockerize a Node API',
       'Containerise a Node.js REST API with Docker and run it with Docker Compose alongside PostgreSQL.',
       'intermediate', 'Internship Ready',
       '["Write a production Dockerfile","Multi-stage build for smaller image","docker-compose.yml with Node + Postgres","Health checks","Environment variable injection","Push image to Docker Hub","README with setup instructions"]'::jsonb,
       '["Docker","Docker Compose","Multi-stage builds","Networking","Container registries"]'::jsonb,
       14, 150, 2),

      (v_devops_id, 'CI/CD Pipeline with GitHub Actions',
       'Build a complete automated pipeline: lint, test, build, and deploy on every push.',
       'advanced', 'Junior Developer Ready',
       '["Lint and type-check on PR","Run unit tests","Build Docker image","Push to container registry","Deploy to staging on merge to main","Deploy to production on tag","Slack/Discord notification on failure"]'::jsonb,
       '["GitHub Actions","YAML workflows","Docker","Secrets management","Deployment strategies"]'::jsonb,
       20, 200, 3);
  END IF;

  -- ── Cybersecurity projects ────────────────────────────────────────────────
  IF v_cyber_id IS NOT NULL THEN
    INSERT INTO projects (path_id, title, description, difficulty, portfolio_level, requirements, skills_covered, estimated_hours, xp_reward, order_index)
    VALUES
      (v_cyber_id, 'Password Strength Checker',
       'CLI + web tool that analyses password strength with entropy scoring and breach database lookup.',
       'beginner', 'Beginner Portfolio',
       '["Score passwords on length, complexity, patterns","Entropy calculation","Check against HaveIBeenPwned k-anonymity API","Suggest improvements","CLI and web (Flask/FastAPI) interface","Unit tests"]'::jsonb,
       '["Regex","Entropy","API consumption","Python/Flask","Security fundamentals"]'::jsonb,
       8, 100, 1),

      (v_cyber_id, 'Basic Web Security Scanner',
       'A tool that audits a target URL for common OWASP Top 10 misconfigurations.',
       'intermediate', 'Internship Ready',
       '["Check for missing security headers","Detect open redirects","Test for basic XSS reflection","Check HTTPS and HSTS","Cookie flags audit (Secure, HttpOnly, SameSite)","Generate HTML report","Rate-limited, ethical-use disclaimer"]'::jsonb,
       '["HTTP headers","Security best practices","requests/httpx","HTML report generation","Ethical hacking principles"]'::jsonb,
       16, 150, 2),

      (v_cyber_id, 'Secure Login Demo',
       'Build a secure login system demonstrating OWASP best practices end-to-end.',
       'advanced', 'Junior Developer Ready',
       '["bcrypt password hashing","CSRF protection","Rate limiting on login endpoint","Account lockout after failed attempts","JWT with short expiry + refresh tokens","Audit log table","2FA with TOTP"]'::jsonb,
       '["Authentication security","bcrypt","CSRF","Rate limiting","TOTP 2FA","Audit logging"]'::jsonb,
       22, 200, 3);
  END IF;

END $$;
