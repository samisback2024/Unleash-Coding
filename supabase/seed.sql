-- ============================================================
-- Unleash Coding – Seed Data (18 Learning Paths)
-- Run AFTER 001_initial_schema.sql
-- Safe to re-run: uses ON CONFLICT DO NOTHING
-- ============================================================

-- ── 1. Learning Paths ────────────────────────────────────────
insert into public.learning_paths
  (title, slug, description, difficulty, estimated_timeline, weekly_hours, weekly_hours_num, category, icon, color, tags, enrolled, rating, total_lessons, total_challenges, job_ready_checklist)
values
  (
    'Python Developer', 'python-developer',
    'Master Python from scripting to production-grade applications, APIs, and automation.',
    'beginner', '6 months', '10h / week', 10, 'Backend', '🐍', '#3b82f6',
    ARRAY['Python','Backend','Scripting','APIs'],
    15240, 4.9, 120, 40,
    ARRAY['Build 3+ Python projects on GitHub','Contribute to an open-source Python repo','Complete at least 50 LeetCode problems in Python','Deploy a public API to a cloud provider','Write clean, tested, documented code']
  ),
  (
    'JavaScript Developer', 'javascript-developer',
    'Go from JS basics to modern ES2024, async patterns, and full-stack JavaScript.',
    'beginner', '5 months', '10h / week', 10, 'Frontend', '🟨', '#eab308',
    ARRAY['JavaScript','ES2024','DOM','Node.js'],
    18900, 4.8, 110, 38,
    ARRAY['Deep understanding of event loop and async patterns','3+ JavaScript projects deployed publicly','Familiarity with at least one framework (React/Vue)','Experience with REST API integration','Solid grasp of browser DevTools']
  ),
  (
    'Frontend Developer', 'frontend-developer',
    'Build pixel-perfect, accessible, and performant web UIs with modern HTML, CSS, and JavaScript.',
    'beginner', '5 months', '12h / week', 12, 'Frontend', '🎨', '#ec4899',
    ARRAY['HTML','CSS','JavaScript','Responsive Design','Accessibility'],
    22100, 4.8, 130, 45,
    ARRAY['Strong CSS and layout skills (flexbox + grid)','Build accessible, WCAG-compliant interfaces','Optimize for Core Web Vitals','Experience with a CSS framework','Portfolio with 3+ live projects']
  ),
  (
    'Backend Developer', 'backend-developer',
    'Design scalable APIs, databases, authentication, and server-side systems.',
    'intermediate', '6 months', '12h / week', 12, 'Backend', '⚙️', '#10b981',
    ARRAY['Node.js','REST','SQL','Auth','Microservices'],
    13600, 4.7, 115, 42,
    ARRAY['Design RESTful APIs following best practices','Implement JWT auth with refresh tokens','Write SQL queries and optimize with indexes','Deploy a backend to production (Railway/Render/AWS)','Write integration tests with >80% coverage']
  ),
  (
    'Full-Stack Developer', 'fullstack-developer',
    'Master both frontend and backend to build complete, production-ready web applications.',
    'intermediate', '9 months', '15h / week', 15, 'Full-Stack', '🚀', '#6c63ff',
    ARRAY['React','Node.js','PostgreSQL','TypeScript','Docker'],
    28400, 4.9, 200, 60,
    ARRAY['Deploy a full-stack app to production','Build an API and consume it from the frontend','Implement auth end-to-end','Write tests for both FE and BE','Use Docker for local development']
  ),
  (
    'React Developer', 'react-developer',
    'Build scalable React applications with hooks, state management, and modern patterns.',
    'intermediate', '4 months', '10h / week', 10, 'Frontend', '⚛️', '#38bdf8',
    ARRAY['React','TypeScript','Zustand','React Query','Testing'],
    31200, 4.9, 90, 30,
    ARRAY['Understand React rendering model deeply','Manage complex state with Zustand or Redux','Write unit and integration tests','Optimize bundle size and runtime performance','3+ React apps in portfolio']
  ),
  (
    'Node.js Developer', 'nodejs-developer',
    'Build fast, scalable server-side applications and APIs with Node.js and the JavaScript ecosystem.',
    'intermediate', '5 months', '10h / week', 10, 'Backend', '🟢', '#22c55e',
    ARRAY['Node.js','Express','Fastify','REST','GraphQL'],
    11800, 4.7, 100, 35,
    ARRAY['Understand Node.js event loop deeply','Build and deploy a REST + GraphQL API','Experience with message brokers (Redis/RabbitMQ)','Write integration tests with Supertest','Container and deploy with Docker']
  ),
  (
    'SQL & Databases', 'sql-databases',
    'Master relational databases, query optimization, schema design, and data modeling.',
    'beginner', '3 months', '8h / week', 8, 'Data', '🗄️', '#f97316',
    ARRAY['SQL','PostgreSQL','MySQL','Database Design','Performance'],
    9400, 4.8, 70, 30,
    ARRAY['Write complex multi-table queries with confidence','Design normalized schemas from requirements','Understand and use indexes effectively','Experience with at least one ORM','Perform query profiling and optimization']
  ),
  (
    'Data Structures & Algorithms', 'dsa',
    'Crack coding interviews and write efficient code by mastering DSA fundamentals and patterns.',
    'intermediate', '4 months', '12h / week', 12, 'Computer Science', '📊', '#a855f7',
    ARRAY['Algorithms','Data Structures','LeetCode','Interview Prep','Complexity'],
    26700, 4.9, 100, 80,
    ARRAY['Solve 150+ LeetCode problems','Recognize and apply 15+ common patterns','Analyze time/space complexity for every solution','Complete 5+ mock interviews','Write clean, readable solutions']
  ),
  (
    'Java Developer', 'java-developer',
    'Build enterprise applications with Java, Spring Boot, and the JVM ecosystem.',
    'intermediate', '7 months', '12h / week', 12, 'Backend', '☕', '#ef4444',
    ARRAY['Java','Spring Boot','Maven','JPA','Enterprise'],
    12300, 4.7, 130, 45,
    ARRAY['Build a Spring Boot application from scratch','Implement Spring Security with JWT','Write unit tests with JUnit and Mockito','Deploy a Java app with Docker','Understand Java memory model and GC tuning']
  ),
  (
    'C++ Developer', 'cpp-developer',
    'Master systems programming, memory management, and performance with modern C++.',
    'advanced', '8 months', '15h / week', 15, 'Systems', '⚡', '#64748b',
    ARRAY['C++','Systems','Memory Management','Performance','STL'],
    7200, 4.8, 140, 50,
    ARRAY['Manage memory safely with RAII and smart pointers','Use STL containers and algorithms fluently','Write concurrent code with proper synchronization','Profile and optimize performance bottlenecks','Contribute to or build a C++ open-source project']
  ),
  (
    'AI / Machine Learning Engineer', 'ai-ml-engineer',
    'Build intelligent systems with machine learning, deep learning, and modern AI tooling.',
    'advanced', '9 months', '15h / week', 15, 'AI/ML', '🤖', '#8b5cf6',
    ARRAY['Python','ML','PyTorch','scikit-learn','LLMs','MLOps'],
    19600, 4.9, 160, 50,
    ARRAY['Train and evaluate ML models on real datasets','Deploy a model as a REST API','Understand model evaluation metrics deeply','Fine-tune an LLM for a specific task','Build an MLOps pipeline with experiment tracking']
  ),
  (
    'Cloud Engineer', 'cloud-engineer',
    'Design and manage scalable cloud infrastructure on AWS, GCP, or Azure.',
    'intermediate', '6 months', '12h / week', 12, 'Cloud', '☁️', '#0ea5e9',
    ARRAY['AWS','Terraform','Kubernetes','Serverless','IaC'],
    10200, 4.7, 110, 35,
    ARRAY['Earn AWS Solutions Architect Associate cert','Deploy production infrastructure with Terraform','Manage a Kubernetes cluster end-to-end','Implement cost tagging and budget alerts','Set up CloudWatch monitoring and alerting']
  ),
  (
    'DevOps Engineer', 'devops-engineer',
    'Automate software delivery, infrastructure, and operations for fast, reliable deployments.',
    'intermediate', '6 months', '12h / week', 12, 'DevOps', '🔄', '#f97316',
    ARRAY['Docker','Kubernetes','CI/CD','GitHub Actions','Monitoring'],
    13400, 4.8, 115, 38,
    ARRAY['Build a CI/CD pipeline from scratch','Run a production Kubernetes cluster','Implement infrastructure as code','Set up comprehensive monitoring and alerting','Automate secrets management securely']
  ),
  (
    'Cybersecurity Engineer', 'cybersecurity-engineer',
    'Protect systems and applications through ethical hacking, secure design, and incident response.',
    'advanced', '8 months', '15h / week', 15, 'Security', '🔐', '#ef4444',
    ARRAY['Security','Penetration Testing','OWASP','Networking','CTF'],
    9800, 4.9, 145, 55,
    ARRAY['Earn CompTIA Security+ or CEH','Complete 20+ TryHackMe/HackTheBox rooms','Write a professional penetration test report','Understand secure SDLC practices','Set up a home lab for practice']
  ),
  (
    'Mobile App Developer', 'mobile-developer',
    'Build cross-platform mobile apps for iOS and Android with React Native.',
    'intermediate', '6 months', '12h / week', 12, 'Mobile', '📱', '#06b6d4',
    ARRAY['React Native','Expo','iOS','Android','Mobile UI'],
    14500, 4.7, 110, 35,
    ARRAY['Publish at least one app to a store','Handle deep linking and push notifications','Optimize for performance on low-end devices','Write tests with React Native Testing Library','Experience with Expo EAS build system']
  ),
  (
    'System Design', 'system-design',
    'Learn to design large-scale distributed systems like a senior engineer.',
    'advanced', '3 months', '10h / week', 10, 'Architecture', '🏗️', '#84cc16',
    ARRAY['Architecture','Distributed Systems','Scalability','CAP Theorem','Interviews'],
    17800, 4.9, 60, 20,
    ARRAY['Confidently whiteboard any common system','Understand CAP theorem and consistency models','Know when to use SQL vs NoSQL vs cache','Estimate capacity and cost for systems','Complete 10+ system design mock interviews']
  ),
  (
    'Technical Interview Prep', 'interview-prep',
    'Land your dream tech job by mastering coding interviews, behavioral questions, and negotiation.',
    'intermediate', '2 months', '15h / week', 15, 'Career', '🎯', '#f59e0b',
    ARRAY['LeetCode','Behavioral','System Design','Salary Negotiation','Coding Interviews'],
    34500, 4.9, 50, 100,
    ARRAY['Complete LeetCode 75 (or Neetcode 150)','Practice 5+ mock interviews','Have a polished resume with quantified impact','Prepare 10+ STAR behavioral stories','Research target companies and compensation ranges']
  )
on conflict (slug) do nothing;

-- ── 2. Modules ───────────────────────────────────────────────

-- python-developer
insert into public.modules (path_id, title, description, level, duration, order_index)
select lp.id, m.title, m.description, m.level, m.duration, m.order_index
from public.learning_paths lp
cross join (values
  ('Python Fundamentals',      'Syntax, variables, control flow',             'beginner',     '2 weeks', 1),
  ('Functions & Modules',      'Reusable code, imports, scope',               'beginner',     '1 week',  2),
  ('Data Structures',          'Lists, dicts, sets, tuples',                  'beginner',     '2 weeks', 3),
  ('File I/O & Exceptions',    'Reading files, error handling',               'beginner',     '1 week',  4),
  ('OOP in Python',            'Classes, inheritance, dunder methods',        'intermediate', '2 weeks', 5),
  ('APIs with FastAPI',        'REST APIs, Pydantic, async',                  'intermediate', '3 weeks', 6),
  ('Databases with SQLAlchemy','ORM, migrations, queries',                    'intermediate', '2 weeks', 7),
  ('Async Python',             'asyncio, aiohttp, concurrency',               'advanced',     '2 weeks', 8),
  ('Testing & CI/CD',          'pytest, coverage, GitHub Actions',            'advanced',     '2 weeks', 9),
  ('Packaging & Deployment',   'Docker, PyPI, production best practices',     'advanced',     '2 weeks', 10)
) as m(title, description, level, duration, order_index)
where lp.slug = 'python-developer'
on conflict do nothing;

-- javascript-developer
insert into public.modules (path_id, title, description, level, duration, order_index)
select lp.id, m.title, m.description, m.level, m.duration, m.order_index
from public.learning_paths lp
cross join (values
  ('JS Syntax & Types',       'Variables, types, operators',                 'beginner',     '2 weeks', 1),
  ('Functions & Scope',       'Closures, hoisting, arrow functions',         'beginner',     '1 week',  2),
  ('DOM Manipulation',        'Events, selectors, dynamic UI',               'beginner',     '2 weeks', 3),
  ('Async JavaScript',        'Promises, async/await, fetch',                'intermediate', '2 weeks', 4),
  ('OOP & Prototypes',        'Classes, prototypes, patterns',               'intermediate', '2 weeks', 5),
  ('Modern Tooling',          'npm, Vite, ESLint, Prettier',                 'intermediate', '1 week',  6),
  ('Advanced Patterns',       'Functional programming, observables',         'advanced',     '2 weeks', 7),
  ('Performance Optimization','Profiling, lazy loading, memory',             'advanced',     '2 weeks', 8)
) as m(title, description, level, duration, order_index)
where lp.slug = 'javascript-developer'
on conflict do nothing;

-- frontend-developer
insert into public.modules (path_id, title, description, level, duration, order_index)
select lp.id, m.title, m.description, m.level, m.duration, m.order_index
from public.learning_paths lp
cross join (values
  ('HTML Essentials',    'Semantic HTML5, forms, media',                  'beginner',     '1 week',  1),
  ('CSS Fundamentals',   'Box model, flexbox, grid',                      'beginner',     '2 weeks', 2),
  ('Responsive Design',  'Media queries, mobile-first',                   'beginner',     '1 week',  3),
  ('CSS Advanced',       'Animations, variables, Tailwind',               'intermediate', '2 weeks', 4),
  ('JavaScript for UI',  'DOM, events, fetch',                            'intermediate', '2 weeks', 5),
  ('Accessibility & SEO','ARIA, WCAG, meta tags',                         'intermediate', '1 week',  6),
  ('Performance',        'Core Web Vitals, lazy loading, caching',        'advanced',     '2 weeks', 7),
  ('Testing UIs',        'Playwright, Vitest, visual regression',         'advanced',     '2 weeks', 8)
) as m(title, description, level, duration, order_index)
where lp.slug = 'frontend-developer'
on conflict do nothing;

-- backend-developer
insert into public.modules (path_id, title, description, level, duration, order_index)
select lp.id, m.title, m.description, m.level, m.duration, m.order_index
from public.learning_paths lp
cross join (values
  ('HTTP & REST Fundamentals','Methods, status codes, headers',              'beginner',     '1 week',  1),
  ('Node.js Basics',           'Modules, file system, streams',              'beginner',     '2 weeks', 2),
  ('Express.js',               'Routing, middleware, error handling',        'beginner',     '2 weeks', 3),
  ('Databases & SQL',          'PostgreSQL, schema design, joins',           'intermediate', '3 weeks', 4),
  ('Auth & Security',          'JWT, OAuth, bcrypt, CORS',                   'intermediate', '2 weeks', 5),
  ('Caching & Queues',         'Redis, BullMQ, rate limiting',               'intermediate', '2 weeks', 6),
  ('Microservices',            'Service decomposition, messaging, gRPC',     'advanced',     '3 weeks', 7),
  ('Observability',            'Logging, tracing, Prometheus, Grafana',      'advanced',     '2 weeks', 8)
) as m(title, description, level, duration, order_index)
where lp.slug = 'backend-developer'
on conflict do nothing;

-- fullstack-developer
insert into public.modules (path_id, title, description, level, duration, order_index)
select lp.id, m.title, m.description, m.level, m.duration, m.order_index
from public.learning_paths lp
cross join (values
  ('Web Fundamentals',  'HTML, CSS, JavaScript basics',          'beginner',     '3 weeks', 1),
  ('React Basics',      'Components, props, state, hooks',        'beginner',     '3 weeks', 2),
  ('Node.js & Express', 'Server basics, routing, middleware',     'beginner',     '2 weeks', 3),
  ('TypeScript',        'Types, interfaces, generics',            'intermediate', '2 weeks', 4),
  ('Databases',         'SQL, ORMs, Prisma',                      'intermediate', '3 weeks', 5),
  ('Auth & Sessions',   'Supabase Auth, JWT, cookies',            'intermediate', '2 weeks', 6),
  ('Deployment & CI/CD','Docker, GitHub Actions, VPS',            'advanced',     '2 weeks', 7),
  ('System Design Basics','Scaling, caching, load balancing',     'advanced',     '2 weeks', 8)
) as m(title, description, level, duration, order_index)
where lp.slug = 'fullstack-developer'
on conflict do nothing;

-- react-developer
insert into public.modules (path_id, title, description, level, duration, order_index)
select lp.id, m.title, m.description, m.level, m.duration, m.order_index
from public.learning_paths lp
cross join (values
  ('React Core',       'JSX, components, props, state',                    'beginner',     '2 weeks', 1),
  ('React Hooks',      'useState, useEffect, useRef, custom hooks',        'beginner',     '2 weeks', 2),
  ('State Management', 'Zustand, Context API patterns',                    'intermediate', '2 weeks', 3),
  ('Data Fetching',    'React Query, SWR, loading/error states',           'intermediate', '2 weeks', 4),
  ('Forms & Validation','React Hook Form, Zod, accessibility',             'intermediate', '1 week',  5),
  ('Performance',      'Memoization, code splitting, Suspense',            'advanced',     '2 weeks', 6),
  ('Testing React Apps','Vitest, Testing Library, mocking',                'advanced',     '2 weeks', 7)
) as m(title, description, level, duration, order_index)
where lp.slug = 'react-developer'
on conflict do nothing;

-- nodejs-developer
insert into public.modules (path_id, title, description, level, duration, order_index)
select lp.id, m.title, m.description, m.level, m.duration, m.order_index
from public.learning_paths lp
cross join (values
  ('Node.js Internals',   'Event loop, libuv, streams',           'beginner',     '2 weeks', 1),
  ('Express.js',          'Routes, middleware, error handling',   'beginner',     '2 weeks', 2),
  ('GraphQL APIs',        'Schema, resolvers, Apollo Server',     'intermediate', '3 weeks', 3),
  ('Databases',           'Prisma, Mongoose, query optimization', 'intermediate', '2 weeks', 4),
  ('Microservices & gRPC','Service mesh, inter-service comms',    'advanced',     '3 weeks', 5),
  ('Performance Tuning',  'Profiling, clustering, worker threads','advanced',     '2 weeks', 6)
) as m(title, description, level, duration, order_index)
where lp.slug = 'nodejs-developer'
on conflict do nothing;

-- sql-databases
insert into public.modules (path_id, title, description, level, duration, order_index)
select lp.id, m.title, m.description, m.level, m.duration, m.order_index
from public.learning_paths lp
cross join (values
  ('SQL Basics',           'SELECT, INSERT, UPDATE, DELETE',                'beginner',     '2 weeks', 1),
  ('Joins & Aggregations', 'INNER/LEFT/RIGHT joins, GROUP BY',              'beginner',     '2 weeks', 2),
  ('Schema Design',        'Normalization, relationships, constraints',     'intermediate', '2 weeks', 3),
  ('Query Optimization',   'Indexes, EXPLAIN, execution plans',             'intermediate', '2 weeks', 4),
  ('Advanced PostgreSQL',  'CTEs, window functions, JSONB',                 'advanced',     '2 weeks', 5),
  ('Transactions & Locks', 'ACID, isolation levels, deadlocks',             'advanced',     '1 week',  6)
) as m(title, description, level, duration, order_index)
where lp.slug = 'sql-databases'
on conflict do nothing;

-- dsa
insert into public.modules (path_id, title, description, level, duration, order_index)
select lp.id, m.title, m.description, m.level, m.duration, m.order_index
from public.learning_paths lp
cross join (values
  ('Arrays & Strings',    'Two pointers, sliding window',              'beginner',     '2 weeks', 1),
  ('Linked Lists',        'Singly, doubly, common patterns',           'beginner',     '1 week',  2),
  ('Stacks & Queues',     'LIFO/FIFO, monotonic stacks',               'beginner',     '1 week',  3),
  ('Trees & Graphs',      'BFS, DFS, binary trees, trie',              'intermediate', '3 weeks', 4),
  ('Sorting & Searching', 'Merge sort, binary search variations',      'intermediate', '2 weeks', 5),
  ('Hashing & Heaps',     'Hash maps, priority queues',                'intermediate', '1 week',  6),
  ('Dynamic Programming', 'Memoization, tabulation, patterns',         'advanced',     '3 weeks', 7),
  ('Greedy & Backtracking','Interval scheduling, N-queens, permutations','advanced',   '2 weeks', 8)
) as m(title, description, level, duration, order_index)
where lp.slug = 'dsa'
on conflict do nothing;

-- java-developer
insert into public.modules (path_id, title, description, level, duration, order_index)
select lp.id, m.title, m.description, m.level, m.duration, m.order_index
from public.learning_paths lp
cross join (values
  ('Java Fundamentals',        'Syntax, OOP, generics, collections',       'beginner',     '3 weeks', 1),
  ('Java 17+ Features',        'Records, sealed classes, pattern matching', 'beginner',     '1 week',  2),
  ('Spring Boot',              'REST APIs, dependency injection, MVC',      'intermediate', '4 weeks', 3),
  ('Spring Data JPA',          'Repositories, JPQL, migrations',            'intermediate', '2 weeks', 4),
  ('Spring Security',          'OAuth2, JWT, role-based access',            'advanced',     '2 weeks', 5),
  ('Microservices with Spring','Spring Cloud, service discovery',           'advanced',     '3 weeks', 6)
) as m(title, description, level, duration, order_index)
where lp.slug = 'java-developer'
on conflict do nothing;

-- cpp-developer
insert into public.modules (path_id, title, description, level, duration, order_index)
select lp.id, m.title, m.description, m.level, m.duration, m.order_index
from public.learning_paths lp
cross join (values
  ('C++ Basics',         'Syntax, pointers, references, arrays',         'beginner',     '3 weeks', 1),
  ('OOP in C++',         'Classes, inheritance, polymorphism, RAII',     'beginner',     '2 weeks', 2),
  ('STL & Templates',    'Containers, iterators, template metaprog.',    'intermediate', '3 weeks', 3),
  ('Memory & Performance','Smart pointers, move semantics, profiling',   'intermediate', '2 weeks', 4),
  ('Concurrency',        'Threads, mutexes, atomics, async',             'advanced',     '3 weeks', 5),
  ('Systems Programming','OS interfaces, sockets, file systems',         'advanced',     '3 weeks', 6)
) as m(title, description, level, duration, order_index)
where lp.slug = 'cpp-developer'
on conflict do nothing;

-- ai-ml-engineer
insert into public.modules (path_id, title, description, level, duration, order_index)
select lp.id, m.title, m.description, m.level, m.duration, m.order_index
from public.learning_paths lp
cross join (values
  ('Math for ML',          'Linear algebra, calculus, probability',      'beginner',     '3 weeks', 1),
  ('Python for Data Science','NumPy, Pandas, Matplotlib',                'beginner',     '2 weeks', 2),
  ('Classical ML',         'Regression, trees, SVMs, clustering',        'intermediate', '4 weeks', 3),
  ('Deep Learning',        'Neural nets, CNNs, RNNs with PyTorch',       'intermediate', '4 weeks', 4),
  ('LLMs & Transformers',  'Fine-tuning, RAG, prompt engineering',       'advanced',     '4 weeks', 5),
  ('MLOps',                'MLflow, model serving, A/B testing',         'advanced',     '3 weeks', 6)
) as m(title, description, level, duration, order_index)
where lp.slug = 'ai-ml-engineer'
on conflict do nothing;

-- cloud-engineer
insert into public.modules (path_id, title, description, level, duration, order_index)
select lp.id, m.title, m.description, m.level, m.duration, m.order_index
from public.learning_paths lp
cross join (values
  ('Cloud Fundamentals',  'IaaS, PaaS, SaaS, regions, VPCs',           'beginner',     '2 weeks', 1),
  ('AWS Core Services',   'EC2, S3, RDS, IAM, Lambda',                  'beginner',     '3 weeks', 2),
  ('Infrastructure as Code','Terraform, CloudFormation, Pulumi',        'intermediate', '3 weeks', 3),
  ('Containers on Cloud', 'ECS, EKS, Docker in production',             'intermediate', '3 weeks', 4),
  ('Kubernetes',          'Deployments, services, Helm, autoscaling',   'advanced',     '4 weeks', 5),
  ('Cost & Security',     'IAM best practices, cost optimization, WAF', 'advanced',     '2 weeks', 6)
) as m(title, description, level, duration, order_index)
where lp.slug = 'cloud-engineer'
on conflict do nothing;

-- devops-engineer
insert into public.modules (path_id, title, description, level, duration, order_index)
select lp.id, m.title, m.description, m.level, m.duration, m.order_index
from public.learning_paths lp
cross join (values
  ('Linux & Shell',   'Bash scripting, processes, networking',          'beginner',     '2 weeks', 1),
  ('Docker',          'Images, containers, Compose, networking',        'beginner',     '2 weeks', 2),
  ('CI/CD Pipelines', 'GitHub Actions, GitLab CI, Jenkins',             'intermediate', '3 weeks', 3),
  ('Kubernetes',      'Pods, deployments, services, ingress',           'intermediate', '4 weeks', 4),
  ('Observability',   'Prometheus, Grafana, Loki, OpenTelemetry',       'advanced',     '3 weeks', 5),
  ('GitOps & IaC',    'ArgoCD, Flux, Terraform, Ansible',               'advanced',     '3 weeks', 6)
) as m(title, description, level, duration, order_index)
where lp.slug = 'devops-engineer'
on conflict do nothing;

-- cybersecurity-engineer
insert into public.modules (path_id, title, description, level, duration, order_index)
select lp.id, m.title, m.description, m.level, m.duration, m.order_index
from public.learning_paths lp
cross join (values
  ('Security Fundamentals','CIA triad, threat models, OWASP Top 10',     'beginner',     '2 weeks', 1),
  ('Networking for Security','TCP/IP, DNS, HTTP, Wireshark',              'beginner',     '2 weeks', 2),
  ('Penetration Testing', 'Reconnaissance, exploitation, reporting',     'intermediate', '4 weeks', 3),
  ('Web App Security',    'XSS, SQLi, CSRF, SSRF, auth flaws',           'intermediate', '3 weeks', 4),
  ('Malware Analysis',    'Static and dynamic analysis, RE basics',      'advanced',     '3 weeks', 5),
  ('Incident Response',   'SIEM, forensics, playbooks',                  'advanced',     '3 weeks', 6)
) as m(title, description, level, duration, order_index)
where lp.slug = 'cybersecurity-engineer'
on conflict do nothing;

-- mobile-developer
insert into public.modules (path_id, title, description, level, duration, order_index)
select lp.id, m.title, m.description, m.level, m.duration, m.order_index
from public.learning_paths lp
cross join (values
  ('React Native Basics','Components, StyleSheet, navigation',           'beginner',     '3 weeks', 1),
  ('Expo & Tooling',     'Expo SDK, OTA updates, EAS',                   'beginner',     '1 week',  2),
  ('Navigation',         'React Navigation, tabs, stacks, drawers',      'intermediate', '2 weeks', 3),
  ('State & Data',       'Zustand, React Query, offline storage',        'intermediate', '2 weeks', 4),
  ('Native Modules',     'Bridging native code, Bluetooth, camera',      'advanced',     '3 weeks', 5),
  ('App Store Publishing','Signing, submission, metadata, ASO',          'advanced',     '2 weeks', 6)
) as m(title, description, level, duration, order_index)
where lp.slug = 'mobile-developer'
on conflict do nothing;

-- system-design
insert into public.modules (path_id, title, description, level, duration, order_index)
select lp.id, m.title, m.description, m.level, m.duration, m.order_index
from public.learning_paths lp
cross join (values
  ('Fundamentals',       'Scalability, availability, consistency trade-offs','beginner',     '2 weeks', 1),
  ('Caching & CDNs',     'Redis, CDN patterns, cache invalidation',          'beginner',     '1 week',  2),
  ('Databases at Scale', 'Sharding, replication, read replicas',             'intermediate', '2 weeks', 3),
  ('Message Queues',     'Kafka, RabbitMQ, async architectures',             'intermediate', '2 weeks', 4),
  ('Real-world Case Studies','Design Twitter, YouTube, Uber, Dropbox',       'advanced',     '3 weeks', 5)
) as m(title, description, level, duration, order_index)
where lp.slug = 'system-design'
on conflict do nothing;

-- interview-prep
insert into public.modules (path_id, title, description, level, duration, order_index)
select lp.id, m.title, m.description, m.level, m.duration, m.order_index
from public.learning_paths lp
cross join (values
  ('Interview Process',      'How FAANG and startups hire',             'beginner',     '1 week',  1),
  ('Resume & LinkedIn',      'ATS-optimized resume and LinkedIn',       'beginner',     '1 week',  2),
  ('DSA for Interviews',     'Top 75 patterns with walkthroughs',       'intermediate', '4 weeks', 3),
  ('Behavioral Interviews',  'STAR method, leadership stories',         'intermediate', '1 week',  4),
  ('System Design Interviews','Framework, common systems, communication','advanced',    '2 weeks', 5),
  ('Offer Negotiation',      'Negotiate salary, equity, and benefits',  'advanced',     '1 week',  6)
) as m(title, description, level, duration, order_index)
where lp.slug = 'interview-prep'
on conflict do nothing;

-- ── 3. Challenges ────────────────────────────────────────────

insert into public.challenges (path_id, title, description, difficulty, xp, order_index)
select lp.id, c.title, c.description, c.difficulty, c.xp, c.order_index
from public.learning_paths lp
cross join (values
  ('FizzBuzz Pro',    'Extend FizzBuzz with custom rules and divisors',  'beginner',     50,  1),
  ('Web Scraper',     'Scrape and parse HTML with BeautifulSoup',        'intermediate', 100, 2),
  ('Async Task Queue','Build a job queue with asyncio',                  'advanced',     200, 3)
) as c(title, description, difficulty, xp, order_index)
where lp.slug = 'python-developer'
on conflict do nothing;

insert into public.challenges (path_id, title, description, difficulty, xp, order_index)
select lp.id, c.title, c.description, c.difficulty, c.xp, c.order_index
from public.learning_paths lp
cross join (values
  ('Event Delegation',  'Handle dynamic list events efficiently',              'beginner',     50,  1),
  ('Promise Chain',     'Sequence 5 async calls with full error handling',     'intermediate', 100, 2),
  ('Observable Pattern','Implement a RxJS-like observable from scratch',       'advanced',     200, 3)
) as c(title, description, difficulty, xp, order_index)
where lp.slug = 'javascript-developer'
on conflict do nothing;

insert into public.challenges (path_id, title, description, difficulty, xp, order_index)
select lp.id, c.title, c.description, c.difficulty, c.xp, c.order_index
from public.learning_paths lp
cross join (values
  ('Responsive Landing Page','Pixel-perfect responsive layout from design',   'beginner',     75,  1),
  ('Animated Navbar',        'Smooth scroll-aware sticky navigation bar',      'intermediate', 100, 2),
  ('Dark Mode Toggle',       'Persist user preference with smooth transitions','advanced',     150, 3)
) as c(title, description, difficulty, xp, order_index)
where lp.slug = 'frontend-developer'
on conflict do nothing;

insert into public.challenges (path_id, title, description, difficulty, xp, order_index)
select lp.id, c.title, c.description, c.difficulty, c.xp, c.order_index
from public.learning_paths lp
cross join (values
  ('Rate Limiter',   'Implement token bucket rate limiting middleware',  'intermediate', 150, 1),
  ('JWT Middleware', 'Secure routes with access + refresh tokens',       'intermediate', 150, 2),
  ('Redis Cache',    'Cache expensive DB queries with Redis TTL',        'advanced',     200, 3)
) as c(title, description, difficulty, xp, order_index)
where lp.slug = 'backend-developer'
on conflict do nothing;

insert into public.challenges (path_id, title, description, difficulty, xp, order_index)
select lp.id, c.title, c.description, c.difficulty, c.xp, c.order_index
from public.learning_paths lp
cross join (values
  ('Build a Blog',    'Full CRUD blog with auth and comments',              'intermediate', 200, 1),
  ('Real-time App',   'Collaborative doc editor with WebSockets',           'advanced',     300, 2),
  ('Auth Flow',       'Complete sign-up, login, password reset with JWT',   'intermediate', 150, 3)
) as c(title, description, difficulty, xp, order_index)
where lp.slug = 'fullstack-developer'
on conflict do nothing;

insert into public.challenges (path_id, title, description, difficulty, xp, order_index)
select lp.id, c.title, c.description, c.difficulty, c.xp, c.order_index
from public.learning_paths lp
cross join (values
  ('Custom Hook',       'Build a useFetch hook with retry and caching',  'intermediate', 100, 1),
  ('Virtualized List',  'Render 10,000 items without freezing the UI',   'advanced',     200, 2),
  ('Form Wizard',       'Multi-step form with validation and persistence','intermediate', 125, 3)
) as c(title, description, difficulty, xp, order_index)
where lp.slug = 'react-developer'
on conflict do nothing;

insert into public.challenges (path_id, title, description, difficulty, xp, order_index)
select lp.id, c.title, c.description, c.difficulty, c.xp, c.order_index
from public.learning_paths lp
cross join (values
  ('Middleware Chain',    'Build composable middleware from scratch',           'intermediate', 100, 1),
  ('GraphQL Resolver',    'Write a paginated resolver with DataLoader',         'intermediate', 150, 2),
  ('Cluster Mode',        'Run Node.js across all CPU cores efficiently',       'advanced',     200, 3)
) as c(title, description, difficulty, xp, order_index)
where lp.slug = 'nodejs-developer'
on conflict do nothing;

insert into public.challenges (path_id, title, description, difficulty, xp, order_index)
select lp.id, c.title, c.description, c.difficulty, c.xp, c.order_index
from public.learning_paths lp
cross join (values
  ('Complex Query',    'Write a query with 3 joins and a window function',   'intermediate', 150, 1),
  ('Index Tuning',     'Optimize a slow query by adding the right indexes',   'intermediate', 150, 2),
  ('Schema Migration', 'Write a safe, zero-downtime column migration',        'advanced',     200, 3)
) as c(title, description, difficulty, xp, order_index)
where lp.slug = 'sql-databases'
on conflict do nothing;

insert into public.challenges (path_id, title, description, difficulty, xp, order_index)
select lp.id, c.title, c.description, c.difficulty, c.xp, c.order_index
from public.learning_paths lp
cross join (values
  ('Two Sum',        'Find all pairs summing to a target efficiently',  'beginner',     50,  1),
  ('Merge Intervals','Merge overlapping intervals in O(n log n)',        'intermediate', 100, 2),
  ('Word Break',     'DP-based word segmentation with memoization',     'advanced',     200, 3)
) as c(title, description, difficulty, xp, order_index)
where lp.slug = 'dsa'
on conflict do nothing;

insert into public.challenges (path_id, title, description, difficulty, xp, order_index)
select lp.id, c.title, c.description, c.difficulty, c.xp, c.order_index
from public.learning_paths lp
cross join (values
  ('Spring REST API',   'Full CRUD API with validation and error handling',  'intermediate', 150, 1),
  ('Spring Security',   'Implement JWT auth with role-based access control', 'advanced',     250, 2),
  ('JPA Optimization',  'Fix N+1 queries using FETCH JOINS and projections', 'advanced',     200, 3)
) as c(title, description, difficulty, xp, order_index)
where lp.slug = 'java-developer'
on conflict do nothing;

insert into public.challenges (path_id, title, description, difficulty, xp, order_index)
select lp.id, c.title, c.description, c.difficulty, c.xp, c.order_index
from public.learning_paths lp
cross join (values
  ('Smart Pointer',    'Implement a reference-counted shared_ptr',         'advanced', 250, 1),
  ('Thread Pool',      'Build a thread pool with a work-stealing queue',   'advanced', 300, 2),
  ('RAII Wrapper',     'Wrap a C-style resource handle safely with RAII',  'intermediate', 150, 3)
) as c(title, description, difficulty, xp, order_index)
where lp.slug = 'cpp-developer'
on conflict do nothing;

insert into public.challenges (path_id, title, description, difficulty, xp, order_index)
select lp.id, c.title, c.description, c.difficulty, c.xp, c.order_index
from public.learning_paths lp
cross join (values
  ('Image Classifier', 'Train a CNN on CIFAR-10 to >90% accuracy',     'intermediate', 200, 1),
  ('LLM Chatbot',      'Fine-tune a small LLM on custom domain data',   'advanced',     400, 2),
  ('Feature Pipeline', 'Build an end-to-end feature engineering pipeline','intermediate', 200, 3)
) as c(title, description, difficulty, xp, order_index)
where lp.slug = 'ai-ml-engineer'
on conflict do nothing;

insert into public.challenges (path_id, title, description, difficulty, xp, order_index)
select lp.id, c.title, c.description, c.difficulty, c.xp, c.order_index
from public.learning_paths lp
cross join (values
  ('Serverless API',    'Deploy a Lambda + API Gateway REST endpoint',   'intermediate', 150, 1),
  ('Terraform Module',  'Create a reusable Terraform module for a VPC',  'intermediate', 150, 2),
  ('Auto Scaling',      'Configure EC2 Auto Scaling based on CPU load',  'advanced',     200, 3)
) as c(title, description, difficulty, xp, order_index)
where lp.slug = 'cloud-engineer'
on conflict do nothing;

insert into public.challenges (path_id, title, description, difficulty, xp, order_index)
select lp.id, c.title, c.description, c.difficulty, c.xp, c.order_index
from public.learning_paths lp
cross join (values
  ('CI/CD Pipeline',    'Build, test, and deploy on push with GitHub Actions','intermediate', 150, 1),
  ('Docker Multi-stage','Optimize an image from 1GB to <100MB',               'intermediate', 100, 2),
  ('Helm Chart',        'Package and deploy an app with a Helm chart',         'advanced',     200, 3)
) as c(title, description, difficulty, xp, order_index)
where lp.slug = 'devops-engineer'
on conflict do nothing;

insert into public.challenges (path_id, title, description, difficulty, xp, order_index)
select lp.id, c.title, c.description, c.difficulty, c.xp, c.order_index
from public.learning_paths lp
cross join (values
  ('CTF Challenge',      'Solve a web exploitation CTF challenge',              'intermediate', 200, 1),
  ('Secure Code Review', 'Find and fix 5 OWASP vulnerabilities in code',        'advanced',     350, 2),
  ('Threat Model',       'Create a STRIDE threat model for a web application',  'intermediate', 150, 3)
) as c(title, description, difficulty, xp, order_index)
where lp.slug = 'cybersecurity-engineer'
on conflict do nothing;

insert into public.challenges (path_id, title, description, difficulty, xp, order_index)
select lp.id, c.title, c.description, c.difficulty, c.xp, c.order_index
from public.learning_paths lp
cross join (values
  ('Gesture Handler',    'Implement swipe-to-delete with spring animations', 'intermediate', 100, 1),
  ('Offline Sync',       'Sync local data with server on reconnect',         'advanced',     200, 2),
  ('Push Notifications', 'Implement push notifications with Expo',           'intermediate', 125, 3)
) as c(title, description, difficulty, xp, order_index)
where lp.slug = 'mobile-developer'
on conflict do nothing;

insert into public.challenges (path_id, title, description, difficulty, xp, order_index)
select lp.id, c.title, c.description, c.difficulty, c.xp, c.order_index
from public.learning_paths lp
cross join (values
  ('Design URL Shortener','Full system design with capacity estimates',    'intermediate', 200, 1),
  ('Design News Feed',    'Fan-out, ranking, and real-time updates',       'advanced',     400, 2),
  ('Design Rate Limiter', 'Distributed rate limiter with Redis and Lua',   'advanced',     300, 3)
) as c(title, description, difficulty, xp, order_index)
where lp.slug = 'system-design'
on conflict do nothing;

insert into public.challenges (path_id, title, description, difficulty, xp, order_index)
select lp.id, c.title, c.description, c.difficulty, c.xp, c.order_index
from public.learning_paths lp
cross join (values
  ('75 Hard Problems', 'Solve the LeetCode 75 within 2 weeks',           'intermediate', 500, 1),
  ('Mock Interview',   'Complete a live mock interview with feedback',    'advanced',     300, 2),
  ('Salary Research',  'Research and build a salary negotiation script',  'beginner',     100, 3)
) as c(title, description, difficulty, xp, order_index)
where lp.slug = 'interview-prep'
on conflict do nothing;

-- ── 4. Projects (regular + capstone) ─────────────────────────

insert into public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, is_capstone, order_index)
select lp.id, p.title, p.description, p.difficulty, p.estimated_time, p.tech_stack, p.is_capstone, p.order_index
from public.learning_paths lp
cross join (values
  ('CLI Task Manager',     'CRUD app via command line with rich output',                         'beginner',     '1 week',  ARRAY['Python','Click','SQLite'],                           false, 1),
  ('REST API with Auth',   'FastAPI + JWT authentication + PostgreSQL',                          'intermediate', '2 weeks', ARRAY['Python','FastAPI','PostgreSQL'],                      false, 2),
  ('Full-Stack Python App','Production FastAPI backend with React frontend and CI/CD pipeline',  'advanced',     '4 weeks', ARRAY['Python','FastAPI','React','Docker','PostgreSQL'],     true,  3)
) as p(title, description, difficulty, estimated_time, tech_stack, is_capstone, order_index)
where lp.slug = 'python-developer'
on conflict do nothing;

insert into public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, is_capstone, order_index)
select lp.id, p.title, p.description, p.difficulty, p.estimated_time, p.tech_stack, p.is_capstone, p.order_index
from public.learning_paths lp
cross join (values
  ('Weather App',     'Fetch weather data and display it beautifully',                      'beginner',     '1 week',  ARRAY['JavaScript','CSS','OpenWeather API'],              false, 1),
  ('Real-time Chat',  'WebSocket-based chat application',                                   'intermediate', '2 weeks', ARRAY['JavaScript','WebSockets','Node.js'],               false, 2),
  ('Social Dashboard','Full-featured social feed with real-time updates and notifications', 'advanced',     '4 weeks', ARRAY['JavaScript','Node.js','WebSockets','MongoDB'],     true,  3)
) as p(title, description, difficulty, estimated_time, tech_stack, is_capstone, order_index)
where lp.slug = 'javascript-developer'
on conflict do nothing;

insert into public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, is_capstone, order_index)
select lp.id, p.title, p.description, p.difficulty, p.estimated_time, p.tech_stack, p.is_capstone, p.order_index
from public.learning_paths lp
cross join (values
  ('Portfolio Website',     'Personal portfolio with animations and dark mode',              'beginner',     '1 week',  ARRAY['HTML','CSS','JavaScript'],                        false, 1),
  ('Component Library',     'Reusable UI components with Storybook documentation',           'intermediate', '3 weeks', ARRAY['React','TypeScript','Storybook'],                  false, 2),
  ('SaaS Landing Page',     'Fully accessible, animated, multi-theme SaaS website',         'advanced',     '3 weeks', ARRAY['HTML','CSS','JavaScript','Tailwind'],              true,  3)
) as p(title, description, difficulty, estimated_time, tech_stack, is_capstone, order_index)
where lp.slug = 'frontend-developer'
on conflict do nothing;

insert into public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, is_capstone, order_index)
select lp.id, p.title, p.description, p.difficulty, p.estimated_time, p.tech_stack, p.is_capstone, p.order_index
from public.learning_paths lp
cross join (values
  ('REST API with Auth',    'User registration, login, protected routes',                    'intermediate', '2 weeks', ARRAY['Node.js','Express','PostgreSQL','JWT'],             false, 1),
  ('Real-time Notifications','SSE or WebSocket notification system',                         'intermediate', '2 weeks', ARRAY['Node.js','Redis','WebSockets'],                    false, 2),
  ('E-commerce Backend',    'Full-featured API with payments, inventory, and orders',        'advanced',     '5 weeks', ARRAY['Node.js','PostgreSQL','Redis','Stripe','Docker'],  true,  3)
) as p(title, description, difficulty, estimated_time, tech_stack, is_capstone, order_index)
where lp.slug = 'backend-developer'
on conflict do nothing;

insert into public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, is_capstone, order_index)
select lp.id, p.title, p.description, p.difficulty, p.estimated_time, p.tech_stack, p.is_capstone, p.order_index
from public.learning_paths lp
cross join (values
  ('Project Management App','Trello-style board with drag-and-drop',                           'intermediate', '3 weeks', ARRAY['React','Node.js','PostgreSQL','TypeScript'],             false, 1),
  ('E-commerce Platform',   'Product catalog, cart, checkout, and admin panel',               'advanced',     '5 weeks', ARRAY['React','Node.js','Stripe','PostgreSQL'],                 false, 2),
  ('SaaS Starter Kit',      'Multi-tenant SaaS with billing, teams, and CI/CD',               'advanced',     '6 weeks', ARRAY['React','Node.js','PostgreSQL','Stripe','Docker'],        true,  3)
) as p(title, description, difficulty, estimated_time, tech_stack, is_capstone, order_index)
where lp.slug = 'fullstack-developer'
on conflict do nothing;

insert into public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, is_capstone, order_index)
select lp.id, p.title, p.description, p.difficulty, p.estimated_time, p.tech_stack, p.is_capstone, p.order_index
from public.learning_paths lp
cross join (values
  ('GitHub Explorer',    'Search GitHub users and repositories with pagination',          'intermediate', '1 week',  ARRAY['React','TypeScript','GitHub API'],                     false, 1),
  ('Real-time Dashboard','Live data charts with WebSocket updates',                       'advanced',     '3 weeks', ARRAY['React','TypeScript','Recharts','WebSockets'],           false, 2),
  ('Design System + App','Component library in Storybook, then a full app using it',     'advanced',     '5 weeks', ARRAY['React','TypeScript','Storybook','Tailwind'],            true,  3)
) as p(title, description, difficulty, estimated_time, tech_stack, is_capstone, order_index)
where lp.slug = 'react-developer'
on conflict do nothing;

insert into public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, is_capstone, order_index)
select lp.id, p.title, p.description, p.difficulty, p.estimated_time, p.tech_stack, p.is_capstone, p.order_index
from public.learning_paths lp
cross join (values
  ('GraphQL API',          'Blog API with queries, mutations, and subscriptions',         'intermediate', '2 weeks', ARRAY['Node.js','GraphQL','Prisma','PostgreSQL'],          false, 1),
  ('Realtime Leaderboard', 'Live score board backed by Redis Sorted Sets',                'intermediate', '2 weeks', ARRAY['Node.js','Redis','Socket.io'],                     false, 2),
  ('Microservice Platform','3-service architecture with API gateway and auth service',    'advanced',     '5 weeks', ARRAY['Node.js','gRPC','Redis','PostgreSQL','Docker'],     true,  3)
) as p(title, description, difficulty, estimated_time, tech_stack, is_capstone, order_index)
where lp.slug = 'nodejs-developer'
on conflict do nothing;

insert into public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, is_capstone, order_index)
select lp.id, p.title, p.description, p.difficulty, p.estimated_time, p.tech_stack, p.is_capstone, p.order_index
from public.learning_paths lp
cross join (values
  ('Library Database',  'Design and query a library management system',                  'beginner',     '1 week',  ARRAY['PostgreSQL'],                                        false, 1),
  ('E-commerce Schema', 'Design a normalized e-commerce database with full queries',     'intermediate', '2 weeks', ARRAY['PostgreSQL','DBeaver'],                              false, 2),
  ('Analytics Database','Data warehouse schema with complex reporting queries',          'advanced',     '3 weeks', ARRAY['PostgreSQL','DBeaver'],                              true,  3)
) as p(title, description, difficulty, estimated_time, tech_stack, is_capstone, order_index)
where lp.slug = 'sql-databases'
on conflict do nothing;

insert into public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, is_capstone, order_index)
select lp.id, p.title, p.description, p.difficulty, p.estimated_time, p.tech_stack, p.is_capstone, p.order_index
from public.learning_paths lp
cross join (values
  ('Algorithm Visualizer','Animate sorting and graph traversal algorithms',               'intermediate', '2 weeks', ARRAY['React','TypeScript','CSS Animations'],             false, 1),
  ('LeetCode Clone',      'Coding challenge platform with test execution',                'advanced',     '3 weeks', ARRAY['React','Node.js','Monaco Editor'],                 false, 2),
  ('Interview Simulator', 'Timed coding challenge platform with 50 problems',            'advanced',     '4 weeks', ARRAY['React','Node.js','PostgreSQL'],                    true,  3)
) as p(title, description, difficulty, estimated_time, tech_stack, is_capstone, order_index)
where lp.slug = 'dsa'
on conflict do nothing;

insert into public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, is_capstone, order_index)
select lp.id, p.title, p.description, p.difficulty, p.estimated_time, p.tech_stack, p.is_capstone, p.order_index
from public.learning_paths lp
cross join (values
  ('Banking API',              'Account management with transactions and audit logs',      'advanced',     '3 weeks', ARRAY['Java','Spring Boot','PostgreSQL','Docker'],               false, 1),
  ('Task Board API',           'Trello-like API with boards, lists, and cards',            'intermediate', '2 weeks', ARRAY['Java','Spring Boot','PostgreSQL'],                        false, 2),
  ('Enterprise Microservice',  'Multi-service Spring Cloud app with Kafka event streaming','advanced',     '6 weeks', ARRAY['Java','Spring Cloud','Kafka','PostgreSQL','Docker'],      true,  3)
) as p(title, description, difficulty, estimated_time, tech_stack, is_capstone, order_index)
where lp.slug = 'java-developer'
on conflict do nothing;

insert into public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, is_capstone, order_index)
select lp.id, p.title, p.description, p.difficulty, p.estimated_time, p.tech_stack, p.is_capstone, p.order_index
from public.learning_paths lp
cross join (values
  ('Game Engine Core',        'Simple ECS-based 2D game engine',                          'advanced', '6 weeks', ARRAY['C++','SDL2','CMake'],                 false, 1),
  ('JSON Parser',             'Hand-written JSON parser without external libs',            'advanced', '2 weeks', ARRAY['C++','CMake'],                        false, 2),
  ('HTTP Server',             'Multi-threaded HTTP/1.1 server with epoll and zero-copy',  'advanced', '6 weeks', ARRAY['C++','Linux','epoll','CMake'],         true,  3)
) as p(title, description, difficulty, estimated_time, tech_stack, is_capstone, order_index)
where lp.slug = 'cpp-developer'
on conflict do nothing;

insert into public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, is_capstone, order_index)
select lp.id, p.title, p.description, p.difficulty, p.estimated_time, p.tech_stack, p.is_capstone, p.order_index
from public.learning_paths lp
cross join (values
  ('Sentiment Analyzer','NLP pipeline with model training and FastAPI endpoint',         'intermediate', '2 weeks', ARRAY['Python','Transformers','FastAPI'],                         false, 1),
  ('Recommendation Engine','Collaborative filtering recommender system',                  'advanced',     '3 weeks', ARRAY['Python','scikit-learn','PostgreSQL'],                      false, 2),
  ('AI SaaS Product',   'End-to-end ML product with data pipeline and monitoring',        'advanced',     '6 weeks', ARRAY['Python','PyTorch','FastAPI','MLflow','Docker'],            true,  3)
) as p(title, description, difficulty, estimated_time, tech_stack, is_capstone, order_index)
where lp.slug = 'ai-ml-engineer'
on conflict do nothing;

insert into public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, is_capstone, order_index)
select lp.id, p.title, p.description, p.difficulty, p.estimated_time, p.tech_stack, p.is_capstone, p.order_index
from public.learning_paths lp
cross join (values
  ('Terraform AWS Infra',        'Provision VPC, EC2, RDS, and S3 with Terraform',        'intermediate', '2 weeks', ARRAY['Terraform','AWS','Bash'],                                    false, 1),
  ('Serverless Pipeline',        'Event-driven data pipeline with Lambda and SQS',        'intermediate', '2 weeks', ARRAY['AWS','Lambda','SQS','Terraform'],                            false, 2),
  ('Production K8s Platform',    'Multi-region EKS cluster with monitoring and GitOps',   'advanced',     '6 weeks', ARRAY['AWS','EKS','Terraform','ArgoCD','Prometheus'],               true,  3)
) as p(title, description, difficulty, estimated_time, tech_stack, is_capstone, order_index)
where lp.slug = 'cloud-engineer'
on conflict do nothing;

insert into public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, is_capstone, order_index)
select lp.id, p.title, p.description, p.difficulty, p.estimated_time, p.tech_stack, p.is_capstone, p.order_index
from public.learning_paths lp
cross join (values
  ('Full CI/CD System',      'Automated pipeline from commit to production',              'advanced', '3 weeks', ARRAY['GitHub Actions','Docker','Kubernetes','Helm'],                false, 1),
  ('Monitoring Stack',       'Prometheus + Grafana + Loki for a microservice app',        'intermediate', '2 weeks', ARRAY['Prometheus','Grafana','Loki','Docker'],               false, 2),
  ('Platform Engineering',   'Internal developer platform with GitOps and dashboards',   'advanced', '5 weeks', ARRAY['Kubernetes','ArgoCD','Terraform','Vault','Grafana'],        true,  3)
) as p(title, description, difficulty, estimated_time, tech_stack, is_capstone, order_index)
where lp.slug = 'devops-engineer'
on conflict do nothing;

insert into public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, is_capstone, order_index)
select lp.id, p.title, p.description, p.difficulty, p.estimated_time, p.tech_stack, p.is_capstone, p.order_index
from public.learning_paths lp
cross join (values
  ('Vulnerability Scanner','Build a basic web vulnerability scanner in Python',            'advanced', '3 weeks', ARRAY['Python','Requests','BeautifulSoup'],                          false, 1),
  ('Honeypot Server',      'Deploy a honeypot and analyze attacker behaviour',             'advanced', '2 weeks', ARRAY['Python','Linux','Wireshark'],                                 false, 2),
  ('Pen Test Report',      'Full penetration test of a sample web app with report',       'advanced', '4 weeks', ARRAY['Kali Linux','Burp Suite','Metasploit','Nmap'],                true,  3)
) as p(title, description, difficulty, estimated_time, tech_stack, is_capstone, order_index)
where lp.slug = 'cybersecurity-engineer'
on conflict do nothing;

insert into public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, is_capstone, order_index)
select lp.id, p.title, p.description, p.difficulty, p.estimated_time, p.tech_stack, p.is_capstone, p.order_index
from public.learning_paths lp
cross join (values
  ('Expense Tracker App','Mobile app with charts, categories, and cloud sync',             'intermediate', '3 weeks', ARRAY['React Native','Expo','Supabase'],                          false, 1),
  ('Fitness Tracker',   'Track workouts and nutrition with offline support',               'intermediate', '3 weeks', ARRAY['React Native','Expo','SQLite'],                            false, 2),
  ('Published App',     'A fully published app on App Store or Play Store',               'advanced',     '6 weeks', ARRAY['React Native','Expo','EAS','Supabase'],                    true,  3)
) as p(title, description, difficulty, estimated_time, tech_stack, is_capstone, order_index)
where lp.slug = 'mobile-developer'
on conflict do nothing;

insert into public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, is_capstone, order_index)
select lp.id, p.title, p.description, p.difficulty, p.estimated_time, p.tech_stack, p.is_capstone, p.order_index
from public.learning_paths lp
cross join (values
  ('System Design Document','Write a production-quality design doc for any system',       'advanced', '2 weeks', ARRAY['Diagrams.net','Markdown'],                                    false, 1),
  ('Architecture Review',   'Review and critique an existing open-source architecture',   'advanced', '1 week',  ARRAY['Excalidraw','Markdown'],                                      false, 2),
  ('Mock Design Interview', 'Record 3 complex system designs and get AI feedback',        'advanced', '2 weeks', ARRAY['Excalidraw','Loom'],                                          true,  3)
) as p(title, description, difficulty, estimated_time, tech_stack, is_capstone, order_index)
where lp.slug = 'system-design'
on conflict do nothing;

insert into public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, is_capstone, order_index)
select lp.id, p.title, p.description, p.difficulty, p.estimated_time, p.tech_stack, p.is_capstone, p.order_index
from public.learning_paths lp
cross join (values
  ('Portfolio Polish','Optimize your GitHub, portfolio, and resume for ATS', 'beginner', '1 week',  ARRAY['GitHub','Vercel'],                                                        false, 1),
  ('Mock Interview Kit','Build a repo of 10 STAR stories with video recordings','intermediate','2 weeks', ARRAY['Loom','Markdown'],                                               false, 2),
  ('Job Offer',       'Land a technical interview and receive an offer letter', 'advanced', '4 weeks', ARRAY['LinkedIn','Glassdoor','LeetCode'],                                    true,  3)
) as p(title, description, difficulty, estimated_time, tech_stack, is_capstone, order_index)
where lp.slug = 'interview-prep'
on conflict do nothing;

-- ── 5. Seed badges ───────────────────────────────────────────
insert into public.badges (name, description, icon, color)
values
  ('First Step',      'Complete your first lesson',              '🎯', '#6c63ff'),
  ('On a Roll',       'Complete 7 lessons in 7 days',            '🔥', '#f97316'),
  ('Challenge Master','Complete 10 coding challenges',           '⚡', '#eab308'),
  ('Path Pioneer',    'Enroll in your first learning path',      '🚀', '#10b981'),
  ('Centurion',       'Earn 100 XP',                             '💯', '#a855f7'),
  ('Portfolio Pro',   'Complete 3 portfolio projects',           '🏆', '#f59e0b'),
  ('Streak Legend',   'Maintain a 30-day learning streak',       '🌟', '#ec4899'),
  ('Full Stack',      'Complete both a Frontend and Backend path','🌐', '#38bdf8')
on conflict do nothing;
