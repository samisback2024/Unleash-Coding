-- ============================================================
-- Unleash Coding – Migration 015
-- Additional challenges and projects for the 18 existing paths
-- ============================================================
-- Each existing path in seed.sql had only 3 challenges and 0–1 projects.
-- This migration adds 2-3 more challenges and 2-3 more projects per path.
-- All inserts are idempotent: ON CONFLICT(path_id, order_index) DO NOTHING
-- (unique constraint uq_challenge_path_order and uq_project_path_order
--  were added in migration 011)
-- ============================================================

-- ============================================================
-- Add challenge columns used in this migration (idempotent)
-- ============================================================
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='challenges' AND column_name='time_limit_minutes') THEN
    ALTER TABLE public.challenges ADD COLUMN time_limit_minutes int;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='challenges' AND column_name='test_cases') THEN
    ALTER TABLE public.challenges ADD COLUMN test_cases jsonb;
  END IF;
END $$;

-- ============================================================
-- PYTHON DEVELOPER — extra challenges (seed had orders 1-3)
-- ============================================================

INSERT INTO public.challenges (path_id, title, description, difficulty, challenge_type, xp, order_index, instructions, time_limit_minutes, test_cases)
SELECT lp.id,
  'Fibonacci With Memoization',
  'Implement an efficient recursive fibonacci function using memoization.',
  'medium', 'coding', 200, 4,
  $$Write a function `fib(n)` that returns the nth Fibonacci number (0-indexed).
- fib(0) = 0, fib(1) = 1, fib(2) = 1, fib(3) = 2, fib(10) = 55
- Your solution must use memoization (a cache/dict) so it runs in O(n) time.
- The naive recursive solution (no cache) will time out for large inputs.$$,
  20,
  '[{"input": "fib(0)", "expected": "0"}, {"input": "fib(10)", "expected": "55"}, {"input": "fib(30)", "expected": "832040"}]'::jsonb
FROM public.learning_paths lp
WHERE lp.slug = 'python-developer'
ON CONFLICT (path_id, order_index) DO NOTHING;

INSERT INTO public.challenges (path_id, title, description, difficulty, challenge_type, xp, order_index, instructions, time_limit_minutes, test_cases)
SELECT lp.id,
  'Context Manager',
  'Implement a custom context manager using a class.',
  'medium', 'coding', 250, 5,
  $$Create a class `Timer` that works as a context manager:
- On `__enter__`, record the start time and return the object.
- On `__exit__`, record the elapsed time in a `self.elapsed` attribute (in seconds, float).
- Usage: `with Timer() as t: time.sleep(0.1); print(t.elapsed)` should print ~0.1$$,
  25, NULL
FROM public.learning_paths lp
WHERE lp.slug = 'python-developer'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- ============================================================
-- JAVASCRIPT DEVELOPER — extra challenges (seed had orders 1-3)
-- ============================================================

INSERT INTO public.challenges (path_id, title, description, difficulty, challenge_type, xp, order_index, instructions, time_limit_minutes, test_cases)
SELECT lp.id,
  'Promise Chain vs Async/Await',
  'Convert a promise chain to async/await and add error handling.',
  'medium', 'coding', 200, 4,
  $$Given this function that returns a Promise:
```js
function fetchUser(id) {
  return fetch(`/api/users/${id}`).then(r => r.json());
}
```
1. Rewrite `fetchUser` using async/await.
2. Add a try/catch that returns `null` if the fetch fails.
3. Write a `fetchUserWithRetry(id, retries)` function that retries up to `retries` times on failure.$$,
  30, NULL
FROM public.learning_paths lp
WHERE lp.slug = 'javascript-developer'
ON CONFLICT (path_id, order_index) DO NOTHING;

INSERT INTO public.challenges (path_id, title, description, difficulty, challenge_type, xp, order_index, instructions, time_limit_minutes, test_cases)
SELECT lp.id,
  'Debounce Implementation',
  'Implement a debounce utility function from scratch.',
  'hard', 'coding', 300, 5,
  $$Implement `debounce(fn, delay)` that returns a debounced version of `fn`.
- The debounced function delays invoking `fn` until `delay` ms have elapsed since the last call.
- If called again before the delay expires, the timer resets.
- Example use case: search input — only fire the API call 300ms after the user stops typing.
- The returned function should have a `.cancel()` method to clear any pending invocation.$$,
  30, NULL
FROM public.learning_paths lp
WHERE lp.slug = 'javascript-developer'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- ============================================================
-- FRONTEND DEVELOPER — extra challenges
-- ============================================================

INSERT INTO public.challenges (path_id, title, description, difficulty, challenge_type, xp, order_index, instructions, time_limit_minutes, test_cases)
SELECT lp.id,
  'Responsive Navigation Bar',
  'Build a responsive navbar that collapses into a hamburger menu on mobile.',
  'medium', 'project', 250, 4,
  $$Build a navigation bar with these requirements:
- Desktop (≥768px): horizontal nav links displayed in a row
- Mobile (<768px): links hidden, hamburger button (☰) visible
- Clicking hamburger toggles a dropdown menu showing all links
- Active link is highlighted with a different color
- Smooth CSS transition for the dropdown open/close
- No JavaScript frameworks — vanilla HTML, CSS, and JS only$$,
  45, NULL
FROM public.learning_paths lp
WHERE lp.slug = 'frontend-developer'
ON CONFLICT (path_id, order_index) DO NOTHING;

INSERT INTO public.challenges (path_id, title, description, difficulty, challenge_type, xp, order_index, instructions, time_limit_minutes, test_cases)
SELECT lp.id,
  'CSS Grid Layout',
  'Recreate a magazine-style layout using CSS Grid.',
  'medium', 'coding', 200, 5,
  $$Using only CSS Grid (no Flexbox for the main layout), create a magazine-style page:
- A full-width header
- A main content area with a large featured article on the left (2/3 width)
- A sidebar on the right (1/3 width)
- Below the main area: 3 equal-width article cards in a row
- A full-width footer
- Use `grid-template-areas` for readability
- The layout must be responsive: stack to a single column below 600px$$,
  40, NULL
FROM public.learning_paths lp
WHERE lp.slug = 'frontend-developer'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- ============================================================
-- REACT DEVELOPER — extra challenges
-- ============================================================

INSERT INTO public.challenges (path_id, title, description, difficulty, challenge_type, xp, order_index, instructions, time_limit_minutes, test_cases)
SELECT lp.id,
  'Custom useFetch Hook',
  'Build a reusable useFetch hook with loading, error, and data states.',
  'medium', 'coding', 250, 4,
  $$Create a custom React hook `useFetch<T>(url: string)` that:
- Returns `{ data: T | null, loading: boolean, error: string | null }`
- Sets `loading: true` while the request is in flight
- Sets `error` if the response is not ok (4xx/5xx) or network fails
- Cancels the fetch with AbortController when the component unmounts or url changes
- Memoizes the URL dependency correctly (no infinite loops)
Write a test component that uses the hook to fetch from `/api/users` and display the results.$$,
  35, NULL
FROM public.learning_paths lp
WHERE lp.slug = 'react-developer'
ON CONFLICT (path_id, order_index) DO NOTHING;

INSERT INTO public.challenges (path_id, title, description, difficulty, challenge_type, xp, order_index, instructions, time_limit_minutes, test_cases)
SELECT lp.id,
  'Context + Reducer State Management',
  'Implement a shopping cart using useContext and useReducer.',
  'hard', 'coding', 350, 5,
  $$Build a shopping cart using React Context and useReducer (no external state library):
- CartContext provides: `{ items, totalPrice, dispatch }`
- Actions: ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY, CLEAR_CART
- ADD_ITEM: if item already in cart, increment quantity instead of duplicating
- totalPrice is computed from items (quantity * price)
- Expose a CartProvider component and a useCart hook
- Add persistence: sync cart to localStorage on every change (useEffect)
- Rehydrate from localStorage on initial load$$,
  50, NULL
FROM public.learning_paths lp
WHERE lp.slug = 'react-developer'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- ============================================================
-- BACKEND DEVELOPER — extra challenges
-- ============================================================

INSERT INTO public.challenges (path_id, title, description, difficulty, challenge_type, xp, order_index, instructions, time_limit_minutes, test_cases)
SELECT lp.id,
  'JWT Authentication Middleware',
  'Implement a complete JWT authentication flow in Express.',
  'hard', 'coding', 350, 4,
  $$Build a JWT authentication system in Express/Node.js:
1. POST /auth/register — hash password with bcrypt (rounds=12), return user + tokens
2. POST /auth/login    — verify password, return { accessToken, refreshToken }
3. POST /auth/refresh  — verify refreshToken, return new accessToken
4. POST /auth/logout   — invalidate the refreshToken (store in a blocklist)
5. GET  /profile       — protected route, requires valid accessToken (Bearer)

Rules:
- Access token expires in 15 minutes
- Refresh token expires in 7 days
- Store refresh tokens in a Set/Map (in-memory is fine for this exercise)
- Return 401 for missing/invalid tokens, 403 for expired tokens$$,
  60, NULL
FROM public.learning_paths lp
WHERE lp.slug = 'backend-developer'
ON CONFLICT (path_id, order_index) DO NOTHING;

INSERT INTO public.challenges (path_id, title, description, difficulty, challenge_type, xp, order_index, instructions, time_limit_minutes, test_cases)
SELECT lp.id,
  'Rate Limiting Middleware',
  'Build a sliding-window rate limiter without external libraries.',
  'hard', 'coding', 300, 5,
  $$Implement an Express middleware `rateLimit({ windowMs, max })` from scratch (no express-rate-limit):
- Uses a sliding window algorithm
- Tracks requests per IP address
- Returns 429 with `Retry-After` header when limit is exceeded
- Returns `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset` headers on every response
- Cleans up expired entries to prevent memory leaks
- Must work correctly under concurrent requests$$,
  40, NULL
FROM public.learning_paths lp
WHERE lp.slug = 'backend-developer'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- ============================================================
-- SQL DATABASES — extra challenges
-- ============================================================

INSERT INTO public.challenges (path_id, title, description, difficulty, challenge_type, xp, order_index, instructions, time_limit_minutes, test_cases)
SELECT lp.id,
  'Advanced JOINs and Aggregations',
  'Write complex multi-table queries with window functions.',
  'hard', 'coding', 300, 4,
  $$Given tables: users(id, name, email), orders(id, user_id, total, created_at, status), order_items(id, order_id, product_id, quantity, unit_price):

Write the following queries:
1. Find the top 5 customers by lifetime value (sum of all completed order totals)
2. For each month in 2024, show total revenue and number of orders (fill months with 0 if no orders)
3. Find customers who placed an order every month in Q1 2024 (January, February, March)
4. Using a window function, rank customers by their total spending within each country
5. Find each customer's most recent order and the time since they last ordered$$,
  45, NULL
FROM public.learning_paths lp
WHERE lp.slug = 'sql-databases'
ON CONFLICT (path_id, order_index) DO NOTHING;

INSERT INTO public.challenges (path_id, title, description, difficulty, challenge_type, xp, order_index, instructions, time_limit_minutes, test_cases)
SELECT lp.id,
  'Database Schema Design',
  'Design a normalized database schema for a multi-tenant SaaS application.',
  'hard', 'project', 400, 5,
  $$Design a PostgreSQL schema for a project management SaaS application:

Requirements:
- Multiple organizations (tenants), each with their own projects and users
- Users can belong to multiple organizations with different roles (owner, admin, member)
- Projects belong to an organization and have a status (active, archived, completed)
- Tasks belong to projects, can be assigned to users, have due dates and priorities
- Comments can be added to tasks by organization members
- Activity log tracks all changes (who changed what and when)

Deliverables:
- CREATE TABLE statements with proper data types, constraints, foreign keys
- Indexes for the most common query patterns
- Row Level Security policies to enforce tenant isolation
- Explain your design decisions in SQL comments$$,
  90, NULL
FROM public.learning_paths lp
WHERE lp.slug = 'sql-databases'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- ============================================================
-- DSA — extra challenges
-- ============================================================

INSERT INTO public.challenges (path_id, title, description, difficulty, challenge_type, xp, order_index, instructions, time_limit_minutes, test_cases)
SELECT lp.id,
  'LRU Cache Implementation',
  'Implement a Least Recently Used cache with O(1) get and put.',
  'hard', 'coding', 350, 4,
  $$Implement an LRU (Least Recently Used) cache class:
- `LRUCache(capacity: int)` — initialize with a given capacity
- `get(key: int) -> int` — return value if key exists, -1 otherwise. Accessing a key marks it as recently used.
- `put(key: int, value: int)` — insert/update the key. If capacity is exceeded, evict the least recently used key.
- Both get and put must run in O(1) time.

Hint: Combine a HashMap with a doubly-linked list. The list maintains order (head=most recent, tail=least recent).$$,
  35,
  '[{"input": "LRUCache(2); put(1,1); put(2,2); get(1)", "expected": "1"}, {"input": "put(3,3); get(2)", "expected": "-1"}]'::jsonb
FROM public.learning_paths lp
WHERE lp.slug = 'dsa'
ON CONFLICT (path_id, order_index) DO NOTHING;

INSERT INTO public.challenges (path_id, title, description, difficulty, challenge_type, xp, order_index, instructions, time_limit_minutes, test_cases)
SELECT lp.id,
  'Word Ladder',
  'Find the shortest transformation sequence from beginWord to endWord.',
  'hard', 'coding', 400, 5,
  $$Given beginWord, endWord, and a wordList, find the length of the shortest transformation sequence from beginWord to endWord:
- Each step changes exactly one letter
- Each intermediate word must be in wordList
- Return 0 if no path exists

Example: beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]
Output: 5 (hit → hot → dot → dog → cog)

Strategy: BFS where each word is a node and two words are connected if they differ by exactly one letter.$$,
  45,
  '[{"input": "beginWord=hit endWord=cog wordList=[hot,dot,dog,lot,log,cog]", "expected": "5"}, {"input": "beginWord=hit endWord=cog wordList=[hot,dot,dog,lot,log]", "expected": "0"}]'::jsonb
FROM public.learning_paths lp
WHERE lp.slug = 'dsa'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- ============================================================
-- FULLSTACK DEVELOPER — extra challenges
-- ============================================================

INSERT INTO public.challenges (path_id, title, description, difficulty, challenge_type, xp, order_index, instructions, time_limit_minutes, test_cases)
SELECT lp.id,
  'Full-Stack CRUD App',
  'Build a complete task manager with React frontend and Express backend.',
  'hard', 'project', 500, 4,
  $$Build a full-stack task manager application:

Backend (Express + PostgreSQL):
- POST /tasks         — create a task (title, description, priority, due_date)
- GET  /tasks         — list tasks (filter by status, sort by due_date or priority)
- PATCH /tasks/:id    — update task (any fields + toggle completed status)
- DELETE /tasks/:id   — soft delete (set deleted_at timestamp, never hard delete)

Frontend (React + TypeScript):
- Task list with filters (All, Active, Completed) and sorting
- Inline editing: click a task title to edit it
- Drag-and-drop reordering (use @dnd-kit/core)
- Optimistic updates: reflect changes in UI before server confirms
- Rollback on error with a toast notification

Bonus: Add real-time updates using Server-Sent Events (SSE)$$,
  120, NULL
FROM public.learning_paths lp
WHERE lp.slug = 'fullstack-developer'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- ============================================================
-- NODEJS DEVELOPER — extra challenges
-- ============================================================

INSERT INTO public.challenges (path_id, title, description, difficulty, challenge_type, xp, order_index, instructions, time_limit_minutes, test_cases)
SELECT lp.id,
  'Worker Threads for CPU Tasks',
  'Offload a CPU-intensive task to a worker thread.',
  'hard', 'coding', 350, 4,
  $$CPU-intensive work (prime number generation, image processing) blocks Node.js event loop.
Move it to a worker thread:

1. Create a function `findPrimesInRange(start, end)` that returns all primes in [start, end]
2. Wrap it in a worker thread (`worker_threads` module)
3. Create a function `findPrimesAsync(start, end)` that returns a Promise
4. The main thread must stay responsive — verify by starting an HTTP server that can serve requests while the worker runs
5. Benchmark: compare blocking vs non-blocking versions for range [1, 10_000_000]$$,
  60, NULL
FROM public.learning_paths lp
WHERE lp.slug = 'nodejs-developer'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- ============================================================
-- JAVA DEVELOPER — extra challenges
-- ============================================================

INSERT INTO public.challenges (path_id, title, description, difficulty, challenge_type, xp, order_index, instructions, time_limit_minutes, test_cases)
SELECT lp.id,
  'Generic Stack Implementation',
  'Implement a type-safe Stack data structure using Java generics.',
  'medium', 'coding', 250, 4,
  $$Implement a generic Stack<T> class:
- `push(item: T)` — add to top
- `pop() -> T` — remove and return top item, throw EmptyStackException if empty
- `peek() -> T` — return top item without removing, throw if empty
- `isEmpty() -> boolean`
- `size() -> int`
- `toList() -> List<T>` — return items from bottom to top

The stack must be backed by a LinkedList (not ArrayList) to ensure O(1) push/pop.
Write unit tests using JUnit 5 covering all methods and edge cases.$$,
  35, NULL
FROM public.learning_paths lp
WHERE lp.slug = 'java-developer'
ON CONFLICT (path_id, order_index) DO NOTHING;

INSERT INTO public.challenges (path_id, title, description, difficulty, challenge_type, xp, order_index, instructions, time_limit_minutes, test_cases)
SELECT lp.id,
  'Spring Boot REST API',
  'Build a Spring Boot REST API with JPA and H2 database.',
  'hard', 'project', 400, 5,
  $$Create a Spring Boot 3 application for a book library API:
1. Entity: Book (id, title, author, isbn, publishedYear, available)
2. Repository: BookRepository extends JpaRepository
3. Service: BookService with methods to create, find, update, delete books
4. Controller: BookController exposing REST endpoints
   - GET  /books            — list all, support ?author= and ?available= filters
   - GET  /books/{id}       — get one, 404 if not found
   - POST /books            — create, validate isbn format (10 or 13 digits)
   - PUT  /books/{id}       — replace
   - DELETE /books/{id}     — delete
5. Use @Valid and Bean Validation annotations for input validation
6. Global exception handler with @ControllerAdvice returning JSON errors
7. Write integration tests using @SpringBootTest$$,
  90, NULL
FROM public.learning_paths lp
WHERE lp.slug = 'java-developer'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- ============================================================
-- C++ DEVELOPER — extra challenges
-- ============================================================

INSERT INTO public.challenges (path_id, title, description, difficulty, challenge_type, xp, order_index, instructions, time_limit_minutes, test_cases)
SELECT lp.id,
  'Smart Pointer Implementation',
  'Implement a simple unique_ptr from scratch.',
  'hard', 'coding', 350, 4,
  $$Implement `UniquePtr<T>` — a simplified version of `std::unique_ptr`:
- Constructor: takes ownership of a raw pointer
- Destructor: deletes the managed pointer
- Move constructor and move assignment operator (transfer ownership)
- Delete copy constructor and copy assignment (unique ownership)
- `get() -> T*` — return raw pointer without releasing ownership
- `release() -> T*` — release ownership, return raw pointer (caller responsible for delete)
- `reset(T* p = nullptr)` — delete current, take ownership of p
- `operator*` and `operator->` for transparent access
- Use RAII correctly — no memory leaks in any code path$$,
  45, NULL
FROM public.learning_paths lp
WHERE lp.slug = 'cpp-developer'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- ============================================================
-- AI/ML ENGINEER — extra challenges
-- ============================================================

INSERT INTO public.challenges (path_id, title, description, difficulty, challenge_type, xp, order_index, instructions, time_limit_minutes, test_cases)
SELECT lp.id,
  'Linear Regression from Scratch',
  'Implement gradient descent for linear regression without sklearn.',
  'hard', 'coding', 350, 4,
  $$Implement linear regression using gradient descent (no sklearn):
- `fit(X: np.ndarray, y: np.ndarray, lr=0.01, epochs=1000)` — train the model
- `predict(X: np.ndarray) -> np.ndarray` — return predictions
- `score(X, y) -> float` — return R² coefficient of determination
- Implement both batch gradient descent and stochastic gradient descent (SGD)
- Normalize features (zero mean, unit variance) before training
- Plot loss curve over epochs using matplotlib
- Compare your results against sklearn LinearRegression on the California Housing dataset$$,
  60, NULL
FROM public.learning_paths lp
WHERE lp.slug = 'ai-ml-engineer'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- ============================================================
-- DEVOPS ENGINEER — extra challenges
-- ============================================================

INSERT INTO public.challenges (path_id, title, description, difficulty, challenge_type, xp, order_index, instructions, time_limit_minutes, test_cases)
SELECT lp.id,
  'Docker Compose Full Stack',
  'Create a multi-service Docker Compose setup with networking and health checks.',
  'hard', 'project', 400, 4,
  $$Create a `docker-compose.yml` for a full-stack application:
Services:
1. `db` — PostgreSQL 15, with a named volume for data persistence and a healthcheck
2. `redis` — Redis 7, with a named volume for persistence
3. `api` — Node.js app (build from ./api/Dockerfile), depends on db and redis being healthy
4. `worker` — Background job processor (same image as api, different CMD), depends on redis
5. `nginx` — Reverse proxy, routes /api/* to api service, serves static files from ./frontend/dist

Requirements:
- All services on a private network (except nginx which also binds to host port 80)
- Environment variables via .env file (never hardcode secrets)
- Resource limits (cpu and memory) on all services
- Restart policies: always for production services$$,
  90, NULL
FROM public.learning_paths lp
WHERE lp.slug = 'devops-engineer'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- ============================================================
-- CLOUD ENGINEER — extra challenges
-- ============================================================

INSERT INTO public.challenges (path_id, title, description, difficulty, challenge_type, xp, order_index, instructions, time_limit_minutes, test_cases)
SELECT lp.id,
  'Terraform AWS Infrastructure',
  'Deploy a complete AWS infrastructure with Terraform.',
  'hard', 'project', 450, 4,
  $$Use Terraform to provision a production-ready AWS environment:
1. VPC with public and private subnets across 2 availability zones
2. Internet Gateway for public subnets, NAT Gateway for private subnets
3. Security Groups: one for the ALB (80/443 from 0.0.0.0/0), one for EC2 (only from ALB)
4. Application Load Balancer (ALB) in public subnets
5. Auto Scaling Group with Launch Template, min=2, max=10, target CPU=60%
6. RDS PostgreSQL in private subnets (Multi-AZ), security group allowing only app servers
7. S3 bucket with versioning, server-side encryption, and lifecycle rules
8. All resources tagged with Environment, Project, ManagedBy=Terraform

Requirements:
- Use Terraform modules for VPC, compute, and database
- Store state in S3 backend with DynamoDB locking
- Use variables for environment-specific values$$,
  120, NULL
FROM public.learning_paths lp
WHERE lp.slug = 'cloud-engineer'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- ============================================================
-- CYBERSECURITY ENGINEER — extra challenges
-- ============================================================

INSERT INTO public.challenges (path_id, title, description, difficulty, challenge_type, xp, order_index, instructions, time_limit_minutes, test_cases)
SELECT lp.id,
  'Secure File Upload API',
  'Build a file upload endpoint that resists path traversal and file type attacks.',
  'hard', 'coding', 350, 4,
  $$Build a secure file upload API endpoint in Express/Node.js:
Protect against:
1. Path traversal (../../../etc/passwd)
2. Double extension attack (malware.exe.jpg)
3. MIME type spoofing (file claims to be image but is actually a script)
4. Zip bombs (check uncompressed size before extracting)
5. Oversized files (enforce size limits both client-side and server-side)

Requirements:
- Only allow: JPEG, PNG, GIF, PDF, ZIP (up to 10MB)
- Validate file type using magic bytes (first bytes of file), not just extension
- Rename uploaded files to a UUID (never trust original filename for storage)
- Store files outside the web root
- Return sanitized filenames in the response
- Write tests for each attack vector$$,
  60, NULL
FROM public.learning_paths lp
WHERE lp.slug = 'cybersecurity-engineer'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- ============================================================
-- MOBILE DEVELOPER — extra challenges
-- ============================================================

INSERT INTO public.challenges (path_id, title, description, difficulty, challenge_type, xp, order_index, instructions, time_limit_minutes, test_cases)
SELECT lp.id,
  'Offline-First Todo App',
  'Build a React Native todo app that works offline and syncs when connected.',
  'hard', 'project', 450, 4,
  $$Build an offline-first React Native todo application:
1. Use MMKV or AsyncStorage for local persistence
2. Define a SyncQueue that stores pending operations (create, update, delete)
3. When device comes online (NetInfo), process the queue by calling the API
4. Handle conflicts: server version wins for items modified on both sides
5. Show a sync status indicator in the header (syncing, synced, offline)
6. Optimistic updates: show changes immediately, roll back on sync failure
7. Add pull-to-refresh to trigger manual sync

Use Zustand for state management and React Query for server state.$$,
  120, NULL
FROM public.learning_paths lp
WHERE lp.slug = 'mobile-developer'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- ============================================================
-- SYSTEM DESIGN — extra challenges
-- ============================================================

INSERT INTO public.challenges (path_id, title, description, difficulty, challenge_type, xp, order_index, instructions, time_limit_minutes, test_cases)
SELECT lp.id,
  'Design a URL Shortener',
  'Design the system architecture for a URL shortening service like bit.ly.',
  'hard', 'project', 400, 4,
  $$Design a URL shortening service (like bit.ly) that handles 100M URLs and 10B redirects/month.

Your design document should cover:
1. Requirements clarification (functional and non-functional)
2. Capacity estimation: storage, bandwidth, QPS for reads and writes
3. High-level design: components, data flow diagram
4. Data model: schema for URL mappings, analytics
5. Short code generation: tradeoffs between hash, random, counter + base62
6. Database choice and justification (SQL vs NoSQL, why?)
7. Caching strategy: what to cache, TTL, eviction policy, cache-aside vs write-through
8. Load balancing and horizontal scaling approach
9. Analytics: how to track click counts without slowing down redirects
10. Handling edge cases: custom short codes, expiration, abuse prevention$$,
  90, NULL
FROM public.learning_paths lp
WHERE lp.slug = 'system-design'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- ============================================================
-- INTERVIEW PREP — extra challenges
-- ============================================================

INSERT INTO public.challenges (path_id, title, description, difficulty, challenge_type, xp, order_index, instructions, time_limit_minutes, test_cases)
SELECT lp.id,
  'Behavioral Interview Mastery',
  'Craft compelling STAR-format stories for the most common behavioral questions.',
  'medium', 'quiz', 150, 4,
  $$Behavioral questions test how you''ve handled real situations. Use the STAR format:
- Situation: Set the scene briefly
- Task: What was your responsibility?
- Action: What specific steps did YOU take? (Use "I", not "we")
- Result: What was the measurable outcome?

Prepare written answers (2-3 minutes each) for these 8 must-have stories:
1. Tell me about a time you faced a technical challenge you couldn't solve alone
2. Describe a situation where you disagreed with a team member's technical decision
3. Tell me about a project you''re most proud of
4. Describe a time you had to learn a new technology quickly under deadline
5. Tell me about a mistake you made and how you recovered
6. Describe a time you improved a process or automated something
7. Tell me about a time you had to explain a complex technical concept to a non-technical stakeholder
8. Describe a conflict with a manager and how you resolved it$$,
  45, NULL
FROM public.learning_paths lp
WHERE lp.slug = 'interview-prep'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- ============================================================
-- PROJECTS — add to existing paths
-- ============================================================

INSERT INTO public.projects (path_id, title, description, difficulty, estimated_hours, tech_stack, requirements, order_index)
SELECT lp.id,
  'Python CLI Data Analyzer',
  'Build a command-line tool that reads CSV files and generates statistical summaries.',
  'intermediate', 8,
  ARRAY['Python', 'argparse', 'csv', 'statistics'],
  to_jsonb(ARRAY[
    'Accept a CSV file path as a command-line argument',
    'Detect and report missing values per column',
    'Show mean, median, std dev, min, max for numeric columns',
    'Show value counts for categorical columns',
    'Export results as JSON with --output flag',
    'Handle malformed CSV files gracefully with helpful error messages'
  ]),
  4
FROM public.learning_paths lp
WHERE lp.slug = 'python-developer'
ON CONFLICT (path_id, order_index) DO NOTHING;

INSERT INTO public.projects (path_id, title, description, difficulty, estimated_hours, tech_stack, requirements, order_index)
SELECT lp.id,
  'Async Web Scraper with Rate Limiting',
  'Scrape product data from multiple pages concurrently with respectful rate limiting.',
  'advanced', 12,
  ARRAY['Python', 'aiohttp', 'asyncio', 'BeautifulSoup', 'PostgreSQL'],
  to_jsonb(ARRAY[
    'Use aiohttp for async HTTP requests (not requests library)',
    'Limit concurrent requests to 5 using asyncio.Semaphore',
    'Add retry logic with exponential backoff for failed requests',
    'Parse HTML with BeautifulSoup to extract product name, price, rating',
    'Store results in PostgreSQL using asyncpg',
    'Respect robots.txt (check and obey disallow rules)',
    'Add User-Agent header identifying your scraper'
  ]),
  5
FROM public.learning_paths lp
WHERE lp.slug = 'python-developer'
ON CONFLICT (path_id, order_index) DO NOTHING;

INSERT INTO public.projects (path_id, title, description, difficulty, estimated_hours, tech_stack, requirements, order_index)
SELECT lp.id,
  'JavaScript Game: Snake',
  'Implement the classic Snake game using the HTML5 Canvas API.',
  'intermediate', 10,
  ARRAY['JavaScript', 'HTML5 Canvas', 'CSS'],
  to_jsonb(ARRAY[
    'Render the game on a canvas element using requestAnimationFrame',
    'Snake moves continuously, changes direction with arrow keys',
    'Food appears at random unoccupied positions',
    'Snake grows by one segment when it eats food',
    'Game ends when snake hits a wall or itself',
    'Show score (food eaten) and high score (saved to localStorage)',
    'Speed increases every 5 food items eaten',
    'Pause/resume with spacebar'
  ]),
  4
FROM public.learning_paths lp
WHERE lp.slug = 'javascript-developer'
ON CONFLICT (path_id, order_index) DO NOTHING;

INSERT INTO public.projects (path_id, title, description, difficulty, estimated_hours, tech_stack, requirements, order_index)
SELECT lp.id,
  'React Dashboard with Charts',
  'Build an analytics dashboard with interactive charts and real-time data.',
  'advanced', 20,
  ARRAY['React', 'TypeScript', 'Recharts', 'TailwindCSS', 'React Query'],
  to_jsonb(ARRAY[
    'Sidebar navigation with 4 sections: Overview, Revenue, Users, Conversions',
    'Overview page: KPI cards (total revenue, active users, conversions, churn)',
    'Revenue chart: line chart showing daily revenue for the past 30 days',
    'Users page: bar chart of new signups by week + pie chart of user sources',
    'All data fetched from a mock API (create your own with json-server)',
    'Date range picker to filter all charts',
    'Dark/light mode toggle (persist to localStorage)',
    'Responsive layout that works on tablet and mobile'
  ]),
  4
FROM public.learning_paths lp
WHERE lp.slug = 'react-developer'
ON CONFLICT (path_id, order_index) DO NOTHING;

INSERT INTO public.projects (path_id, title, description, difficulty, estimated_hours, tech_stack, requirements, order_index)
SELECT lp.id,
  'RESTful API with OpenAPI Docs',
  'Build a production-grade REST API with Swagger/OpenAPI documentation.',
  'advanced', 20,
  ARRAY['Node.js', 'TypeScript', 'Express', 'PostgreSQL', 'Swagger', 'Jest'],
  to_jsonb(ARRAY[
    'CRUD API for a domain of your choice (e.g., blog, store, library)',
    'OpenAPI 3.0 specification with swagger-ui-express for interactive docs',
    'Request validation with Zod or Joi, returning structured errors',
    'Pagination, filtering, and sorting on list endpoints',
    'JWT authentication with access and refresh tokens',
    'Integration tests with 80%+ coverage using Jest + Supertest',
    'Docker Compose setup for development (app + database)',
    'Database migrations with node-pg-migrate'
  ]),
  4
FROM public.learning_paths lp
WHERE lp.slug = 'backend-developer'
ON CONFLICT (path_id, order_index) DO NOTHING;

INSERT INTO public.projects (path_id, title, description, difficulty, estimated_hours, tech_stack, requirements, order_index)
SELECT lp.id,
  'SQL Analytics Dashboard Backend',
  'Build complex analytical queries powering a business intelligence dashboard.',
  'advanced', 16,
  ARRAY['PostgreSQL', 'Node.js', 'Express', 'Chart.js'],
  to_jsonb(ARRAY[
    'Load the Northwind sample database',
    'Write 10 analytical SQL queries (e.g., top products by revenue, monthly growth, cohort retention)',
    'Build a Node.js API that exposes each query as a JSON endpoint',
    'Add query result caching with a 5-minute TTL to avoid re-running expensive queries',
    'Create a simple HTML + Chart.js frontend to visualize each metric',
    'Document each query with the business question it answers and the SQL techniques used'
  ]),
  4
FROM public.learning_paths lp
WHERE lp.slug = 'sql-databases'
ON CONFLICT (path_id, order_index) DO NOTHING;

INSERT INTO public.projects (path_id, title, description, difficulty, estimated_hours, tech_stack, requirements, order_index)
SELECT lp.id,
  'Algorithm Visualizer',
  'Build an interactive web app that animates sorting and graph algorithms.',
  'advanced', 25,
  ARRAY['React', 'TypeScript', 'CSS Animations', 'Canvas API'],
  to_jsonb(ARRAY[
    'Visualize at least 4 sorting algorithms: bubble, selection, merge, quicksort',
    'Show each swap/comparison as an animated step',
    'Control animation speed with a slider',
    'Generate random arrays and allow custom input',
    'Show time complexity and space complexity information for each algorithm',
    'Include BFS and DFS graph traversal on a grid',
    'Allow users to draw walls and see pathfinding algorithms (BFS shortest path)',
    'Mobile-responsive UI'
  ]),
  4
FROM public.learning_paths lp
WHERE lp.slug = 'dsa'
ON CONFLICT (path_id, order_index) DO NOTHING;
