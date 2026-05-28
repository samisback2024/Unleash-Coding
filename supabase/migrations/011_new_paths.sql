-- ============================================================
-- Unleash Coding – Migration 011
-- Add 12 new learning paths, modules, challenges, and projects
-- Idempotent: safe to run multiple times
-- ============================================================

-- ── Add unique constraints (safe) ────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'uq_module_path_order'
  ) THEN
    ALTER TABLE public.modules ADD CONSTRAINT uq_module_path_order UNIQUE (path_id, order_index);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'uq_lesson_module_order'
  ) THEN
    ALTER TABLE public.lessons ADD CONSTRAINT uq_lesson_module_order UNIQUE (module_id, order_index);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'uq_challenge_path_order'
  ) THEN
    ALTER TABLE public.challenges ADD CONSTRAINT uq_challenge_path_order UNIQUE (path_id, order_index);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'uq_project_path_order'
  ) THEN
    -- Remove duplicate (path_id, order_index) rows keeping the earliest inserted (min id)
    DELETE FROM public.projects
    WHERE id NOT IN (
      SELECT DISTINCT ON (path_id, order_index) id
      FROM public.projects
      ORDER BY path_id, order_index, id
    );
    ALTER TABLE public.projects ADD CONSTRAINT uq_project_path_order UNIQUE (path_id, order_index);
  END IF;
END $$;

-- ── 1. Insert 12 new learning paths ──────────────────────────
INSERT INTO public.learning_paths (
  title, slug, description, difficulty, estimated_timeline, weekly_hours, weekly_hours_num,
  category, icon, color, tags, enrolled, rating, total_lessons, total_challenges,
  job_ready_checklist
)
VALUES
(
  'TypeScript Developer', 'typescript-developer',
  'Master TypeScript — the language that makes JavaScript scalable. Learn static typing, generics, decorators, and building production-grade apps.',
  'beginner', '4 months', '10h / week', 10, 'Frontend', '🔷', '#3178c6',
  ARRAY['TypeScript','React','Node.js','Types','Generics'],
  18700, 4.9, 90, 35,
  ARRAY['Migrate a JS project to TypeScript with strict mode','Write generic utility types and conditional types','Configure tsconfig for both browser and Node targets','Use TypeScript with React (hooks, props, context)','Integrate TypeScript into a CI pipeline with strict checks']
),
(
  'Git & GitHub Mastery', 'git-github',
  'Go from git init to advanced branching strategies and GitHub collaboration. Every software engineer needs to master version control.',
  'beginner', '3 weeks', '5h / week', 5, 'Tools', '🌿', '#f05032',
  ARRAY['Git','GitHub','Version Control','CI/CD','Open Source'],
  31200, 4.8, 55, 20,
  ARRAY['Understand the full Git object model (blobs, trees, commits)','Rebase, cherry-pick, and squash commits confidently','Manage complex merge conflicts without losing work','Set up branch protection rules and PR workflows','Contribute to an open source project via pull request']
),
(
  'Linux & Terminal Mastery', 'linux-terminal',
  'Master the Linux command line and shell scripting. An essential skill for every backend engineer, DevOps professional, and system programmer.',
  'beginner', '6 weeks', '8h / week', 8, 'Systems', '🐧', '#fcc624',
  ARRAY['Linux','Bash','Shell','System Admin','CLI'],
  24500, 4.8, 70, 25,
  ARRAY['Navigate and manage the entire Linux filesystem','Write Bash scripts to automate repetitive tasks','Manage users, permissions, and system processes','Configure networking and firewalls (ufw, iptables)','Set up a fully configured Linux server from scratch']
),
(
  'API Engineering', 'api-engineering',
  'Design, build, document, secure, test, and scale world-class APIs. Master REST, GraphQL, gRPC, and API-first development.',
  'intermediate', '4 months', '10h / week', 10, 'Backend', '🔌', '#00d9b5',
  ARRAY['REST','GraphQL','gRPC','OpenAPI','API Design'],
  14800, 4.8, 80, 30,
  ARRAY['Design a REST API following all 6 Richardson Maturity constraints','Build a GraphQL API with subscriptions and dataloaders','Generate OpenAPI/Swagger documentation automatically','Implement OAuth2 and API key authentication','Version and deprecate an API without breaking clients']
),
(
  'Software Architecture', 'software-architecture',
  'Think and design like a senior engineer. Learn SOLID, design patterns, clean architecture, DDD, and microservices — with practical code examples.',
  'advanced', '5 months', '10h / week', 10, 'Architecture', '🏛️', '#a855f7',
  ARRAY['SOLID','Design Patterns','Clean Architecture','DDD','Microservices'],
  11300, 4.9, 85, 25,
  ARRAY['Identify and apply the correct design pattern for real problems','Refactor a monolith toward clean architecture layers','Apply DDD tactical patterns (aggregates, value objects, events)','Design an event-driven system with guaranteed delivery','Document architecture decisions using ADRs']
),
(
  'Testing & QA Engineering', 'testing-qa',
  'Write tests that give you confidence to ship. Master unit, integration, E2E, performance, and security testing across multiple frameworks.',
  'intermediate', '3 months', '10h / week', 10, 'Quality', '🧪', '#22c55e',
  ARRAY['Testing','Vitest','Playwright','TDD','QA'],
  12600, 4.8, 70, 30,
  ARRAY['Write a full test pyramid for a web application','Practice TDD red-green-refactor for a real feature','Automate E2E tests with Playwright in CI','Measure and enforce 80%+ code coverage','Perform load testing and identify performance bottlenecks']
),
(
  'Docker & Kubernetes', 'docker-kubernetes',
  'Containerize everything and orchestrate at scale. From your first Dockerfile to production Kubernetes clusters with Helm and GitOps.',
  'intermediate', '4 months', '12h / week', 12, 'DevOps', '🐳', '#2496ed',
  ARRAY['Docker','Kubernetes','Helm','GitOps','Containers'],
  16400, 4.9, 80, 30,
  ARRAY['Containerize any application with a production-ready Dockerfile','Run multi-service apps with Docker Compose','Deploy an application to Kubernetes with proper health checks','Manage secrets, ConfigMaps, and PersistentVolumes','Set up ArgoCD for GitOps continuous delivery']
),
(
  'Networking Fundamentals', 'networking',
  'Understand how the internet actually works. Master OSI model, TCP/IP, DNS, HTTP/2, TLS, load balancing, and network security.',
  'intermediate', '2 months', '8h / week', 8, 'Systems', '🌐', '#06b6d4',
  ARRAY['Networking','TCP/IP','DNS','HTTP','Security'],
  9800, 4.8, 60, 20,
  ARRAY['Explain the OSI model and trace a packet end-to-end','Set up and debug DNS records (A, CNAME, MX, TXT)','Configure TLS/SSL certificates and understand PKI','Analyze network traffic with Wireshark or tcpdump','Design a network architecture with subnets and security groups']
),
(
  'Operating Systems Fundamentals', 'operating-systems',
  'Understand what happens under the hood. Processes, threads, memory management, file systems, and concurrency — the foundation of all software.',
  'advanced', '3 months', '10h / week', 10, 'Systems', '⚙️', '#64748b',
  ARRAY['OS','Processes','Memory','File Systems','Concurrency'],
  7400, 4.8, 60, 20,
  ARRAY['Explain process scheduling algorithms with examples','Implement a thread-safe data structure','Explain virtual memory and page tables','Understand and resolve common concurrency bugs (race conditions, deadlocks)','Profile I/O-bound vs CPU-bound bottlenecks in a real program']
),
(
  'Distributed Systems', 'distributed-systems',
  'Build systems that never go down. Master CAP theorem, consensus algorithms, distributed storage, message queues, and observability at scale.',
  'advanced', '5 months', '12h / week', 12, 'Architecture', '🕸️', '#f97316',
  ARRAY['Distributed Systems','CAP','Raft','Kafka','Consistency'],
  8200, 4.9, 70, 25,
  ARRAY['Reason about consistency vs availability trade-offs in real systems','Implement a simplified Raft leader election','Design a distributed key-value store with replication','Set up Kafka for reliable event streaming','Build an observability stack (logs, traces, metrics) for a microservice']
),
(
  'Performance Optimization', 'performance-optimization',
  'Make your software blazingly fast. Profile, measure, and optimize frontend, backend, database, and system performance with proven techniques.',
  'advanced', '3 months', '10h / week', 10, 'Performance', '⚡', '#eab308',
  ARRAY['Performance','Profiling','Core Web Vitals','Database','Caching'],
  10300, 4.8, 65, 25,
  ARRAY['Profile any application to find the real bottleneck (not guess)','Score 95+ on Lighthouse for a real production app','Reduce API p99 latency by at least 50% using caching','Optimize a slow SQL query using EXPLAIN ANALYZE','Build a performance budget into CI/CD pipeline']
),
(
  'Open Source Engineering', 'open-source',
  'Contribute to the projects the world runs on. Learn to read large codebases, submit quality PRs, maintain projects, and build a developer reputation.',
  'intermediate', '2 months', '8h / week', 8, 'Career', '🤝', '#84cc16',
  ARRAY['Open Source','GitHub','Contributing','Community','Licensing'],
  13100, 4.7, 50, 15,
  ARRAY['Successfully merge a PR into a major open source project','Write a CONTRIBUTING.md and issue templates for your project','Triage 10+ GitHub issues in an active repository','Understand the difference between MIT, Apache, GPL licenses','Build a library with 10+ GitHub stars']
)
ON CONFLICT (slug) DO NOTHING;


-- ============================================================
-- 2. Modules for all 12 new paths
-- ============================================================

-- typescript-developer
INSERT INTO public.modules (path_id, title, description, level, duration, order_index)
SELECT lp.id, m.title, m.description, m.level, m.duration, m.order_index
FROM public.learning_paths lp
CROSS JOIN (VALUES
  ('TypeScript Basics',         'Types, interfaces, type inference, void, any, never',  'beginner',     '2 weeks', 1),
  ('Functions & Objects',       'Function signatures, optional params, object types',   'beginner',     '1 week',  2),
  ('Advanced Types',            'Union, intersection, template literals, mapped types', 'intermediate', '2 weeks', 3),
  ('Generics',                  'Generic functions, classes, constraints, utilities',   'intermediate', '2 weeks', 4),
  ('TypeScript with React',     'Props, hooks, context, forms with proper types',       'intermediate', '2 weeks', 5),
  ('TypeScript with Node.js',   'Express types, async handlers, Prisma types',          'advanced',     '2 weeks', 6),
  ('Advanced Patterns',         'Decorators, conditional types, type guards, inference','advanced',     '2 weeks', 7)
) AS m(title, description, level, duration, order_index)
WHERE lp.slug = 'typescript-developer'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- git-github
INSERT INTO public.modules (path_id, title, description, level, duration, order_index)
SELECT lp.id, m.title, m.description, m.level, m.duration, m.order_index
FROM public.learning_paths lp
CROSS JOIN (VALUES
  ('Git Fundamentals',          'init, add, commit, log, diff, status',                 'beginner',     '1 week',  1),
  ('Branching & Merging',       'branches, merge, rebase, cherry-pick, stash',          'beginner',     '1 week',  2),
  ('Remote Repositories',       'origin, push, pull, fetch, tracking branches',         'beginner',     '1 week',  3),
  ('Advanced Git',              'reflog, bisect, rebase -i, rerere, hooks',             'intermediate', '1 week',  4),
  ('GitHub Features',           'Issues, PRs, Reviews, Actions, Discussions',           'intermediate', '1 week',  5),
  ('Team Workflows',            'Git Flow, GitHub Flow, trunk-based development',       'intermediate', '1 week',  6),
  ('Open Source Collaboration', 'Fork, upstream, squash, contribution etiquette',       'advanced',     '1 week',  7)
) AS m(title, description, level, duration, order_index)
WHERE lp.slug = 'git-github'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- linux-terminal
INSERT INTO public.modules (path_id, title, description, level, duration, order_index)
SELECT lp.id, m.title, m.description, m.level, m.duration, m.order_index
FROM public.learning_paths lp
CROSS JOIN (VALUES
  ('Terminal Basics',           'Navigation, files, dirs, man pages, pipes, redirects', 'beginner',     '1 week',  1),
  ('File System & Permissions', 'chmod, chown, links, inodes, disk usage',              'beginner',     '1 week',  2),
  ('Process Management',        'ps, top, kill, jobs, fg, bg, systemd, cron',           'beginner',     '1 week',  3),
  ('Shell Scripting',           'Variables, loops, conditions, functions, getopts',     'intermediate', '2 weeks', 4),
  ('Networking Tools',          'curl, wget, netstat, ss, nmap, dig, ssh',              'intermediate', '1 week',  5),
  ('Text Processing',           'grep, awk, sed, cut, sort, uniq, xargs, jq',          'intermediate', '1 week',  6),
  ('System Administration',     'Users, packages, firewalls, logging, crontab',        'advanced',     '2 weeks', 7)
) AS m(title, description, level, duration, order_index)
WHERE lp.slug = 'linux-terminal'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- api-engineering
INSERT INTO public.modules (path_id, title, description, level, duration, order_index)
SELECT lp.id, m.title, m.description, m.level, m.duration, m.order_index
FROM public.learning_paths lp
CROSS JOIN (VALUES
  ('REST API Design',           'Resources, methods, status codes, HATEOAS',            'beginner',     '2 weeks', 1),
  ('API Security',              'OAuth2, JWT, API keys, rate limiting, CORS',           'intermediate', '2 weeks', 2),
  ('API Documentation',         'OpenAPI 3.1, Swagger, auto-generated docs',            'intermediate', '1 week',  3),
  ('GraphQL APIs',              'Schema, resolvers, mutations, subscriptions',          'intermediate', '3 weeks', 4),
  ('gRPC & Async APIs',         'Protobuf, gRPC, WebSockets, SSE, webhooks',           'advanced',     '3 weeks', 5),
  ('API Testing & Mocking',     'Postman, contract testing, Pact, mock servers',       'intermediate', '2 weeks', 6),
  ('API Performance & Scaling', 'Caching, pagination, batching, CDN strategies',       'advanced',     '3 weeks', 7)
) AS m(title, description, level, duration, order_index)
WHERE lp.slug = 'api-engineering'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- software-architecture
INSERT INTO public.modules (path_id, title, description, level, duration, order_index)
SELECT lp.id, m.title, m.description, m.level, m.duration, m.order_index
FROM public.learning_paths lp
CROSS JOIN (VALUES
  ('SOLID Principles',          'SRP, OCP, LSP, ISP, DIP with real code examples',     'beginner',     '2 weeks', 1),
  ('Design Patterns',           'Creational, structural, behavioral GoF patterns',      'intermediate', '3 weeks', 2),
  ('Clean Architecture',        'Layers, dependency rule, use cases, ports/adapters',  'intermediate', '2 weeks', 3),
  ('Domain-Driven Design',      'Aggregates, value objects, events, bounded contexts', 'advanced',     '3 weeks', 4),
  ('Microservices Architecture','Decomposition, communication, service mesh',           'advanced',     '3 weeks', 5),
  ('Event-Driven Architecture', 'Events, queues, sagas, event sourcing, CQRS',        'advanced',     '3 weeks', 6),
  ('Architecture Documentation','C4 model, ADRs, diagrams-as-code, RFCs',             'intermediate', '2 weeks', 7)
) AS m(title, description, level, duration, order_index)
WHERE lp.slug = 'software-architecture'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- testing-qa
INSERT INTO public.modules (path_id, title, description, level, duration, order_index)
SELECT lp.id, m.title, m.description, m.level, m.duration, m.order_index
FROM public.learning_paths lp
CROSS JOIN (VALUES
  ('Testing Fundamentals',      'Test pyramid, F.I.R.S.T principles, types of tests',  'beginner',     '1 week',  1),
  ('Unit Testing',              'Vitest/Jest, mocks, spies, code coverage, TDD',       'beginner',     '2 weeks', 2),
  ('Integration Testing',       'Database, API, and service integration tests',        'intermediate', '2 weeks', 3),
  ('End-to-End Testing',        'Playwright: navigation, assertions, fixtures, CI',    'intermediate', '2 weeks', 4),
  ('Test-Driven Development',   'Red-green-refactor, outside-in TDD, BDD/Gherkin',    'intermediate', '2 weeks', 5),
  ('Performance Testing',       'k6, Lighthouse, profiling, load tests, SLOs',        'advanced',     '2 weeks', 6),
  ('Security Testing',          'OWASP ZAP, fuzzing, dependency audits, SAST',        'advanced',     '2 weeks', 7)
) AS m(title, description, level, duration, order_index)
WHERE lp.slug = 'testing-qa'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- docker-kubernetes
INSERT INTO public.modules (path_id, title, description, level, duration, order_index)
SELECT lp.id, m.title, m.description, m.level, m.duration, m.order_index
FROM public.learning_paths lp
CROSS JOIN (VALUES
  ('Docker Fundamentals',       'Images, containers, Dockerfile, layers, registry',    'beginner',     '2 weeks', 1),
  ('Docker Compose',            'Multi-container apps, networks, volumes, profiles',   'beginner',     '1 week',  2),
  ('Kubernetes Fundamentals',   'Pods, Deployments, Services, ConfigMaps, Secrets',    'intermediate', '3 weeks', 3),
  ('Kubernetes Networking',     'Ingress, NetworkPolicy, DNS, LoadBalancer, NodePort', 'intermediate', '2 weeks', 4),
  ('Kubernetes Storage',        'PV, PVC, StorageClass, StatefulSets, backups',        'intermediate', '2 weeks', 5),
  ('Helm & Package Management', 'Charts, values, templating, Helm releases',           'advanced',     '2 weeks', 6),
  ('Production K8s & GitOps',   'ArgoCD, Flux, RBAC, security hardening, upgrades',  'advanced',     '4 weeks', 7)
) AS m(title, description, level, duration, order_index)
WHERE lp.slug = 'docker-kubernetes'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- networking
INSERT INTO public.modules (path_id, title, description, level, duration, order_index)
SELECT lp.id, m.title, m.description, m.level, m.duration, m.order_index
FROM public.learning_paths lp
CROSS JOIN (VALUES
  ('Network Models',            'OSI & TCP/IP layers, encapsulation, protocols',        'beginner',     '1 week',  1),
  ('IP Addressing & Subnetting','IPv4, CIDR, subnets, NAT, IPv6 basics',               'beginner',     '2 weeks', 2),
  ('DNS & HTTP',                'DNS resolution, records, HTTP/1.1/2/3, TLS handshake','beginner',     '2 weeks', 3),
  ('Transport Protocols',       'TCP 3-way handshake, UDP, QUIC, connection states',   'intermediate', '1 week',  4),
  ('Network Security',          'Firewalls, VPNs, IDS/IPS, zero-trust, certificates', 'intermediate', '2 weeks', 5),
  ('Load Balancing & Proxies',  'L4/L7 load balancing, Nginx, reverse proxies, CDN',  'advanced',     '2 weeks', 6)
) AS m(title, description, level, duration, order_index)
WHERE lp.slug = 'networking'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- operating-systems
INSERT INTO public.modules (path_id, title, description, level, duration, order_index)
SELECT lp.id, m.title, m.description, m.level, m.duration, m.order_index
FROM public.learning_paths lp
CROSS JOIN (VALUES
  ('OS Concepts',               'Kernel, user space, syscalls, interrupts, hardware',  'beginner',     '2 weeks', 1),
  ('Processes & Threads',       'Process lifecycle, context switch, scheduling algos', 'beginner',     '2 weeks', 2),
  ('Memory Management',         'Virtual memory, paging, segmentation, TLB, swap',    'intermediate', '2 weeks', 3),
  ('File Systems',              'inodes, VFS, ext4, block devices, journaling',        'intermediate', '2 weeks', 4),
  ('Concurrency & Synchronization','Mutex, semaphore, deadlock, starvation, monitors', 'advanced',     '3 weeks', 5),
  ('I/O & Devices',             'Blocking vs async I/O, epoll, io_uring, drivers',    'advanced',     '2 weeks', 6)
) AS m(title, description, level, duration, order_index)
WHERE lp.slug = 'operating-systems'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- distributed-systems
INSERT INTO public.modules (path_id, title, description, level, duration, order_index)
SELECT lp.id, m.title, m.description, m.level, m.duration, m.order_index
FROM public.learning_paths lp
CROSS JOIN (VALUES
  ('Fundamentals of Distribution','Fallacies of distributed computing, clock skew, failure','beginner','2 weeks', 1),
  ('Consistency & Consensus',   'CAP, PACELC, eventual consistency, Raft, Paxos',      'intermediate', '3 weeks', 2),
  ('Distributed Storage',       'Replication, sharding, consistent hashing, Dynamo',  'intermediate', '2 weeks', 3),
  ('Message Queues & Streaming','Kafka, RabbitMQ, Pulsar, at-least/exactly-once',      'intermediate', '3 weeks', 4),
  ('Service Coordination',      'Service discovery, health checks, circuit breaker',   'advanced',     '2 weeks', 5),
  ('Observability at Scale',    'Distributed tracing, correlation IDs, log aggregation','advanced',    '3 weeks', 6)
) AS m(title, description, level, duration, order_index)
WHERE lp.slug = 'distributed-systems'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- performance-optimization
INSERT INTO public.modules (path_id, title, description, level, duration, order_index)
SELECT lp.id, m.title, m.description, m.level, m.duration, m.order_index
FROM public.learning_paths lp
CROSS JOIN (VALUES
  ('Profiling & Measurement',   'Flamegraphs, profilers, benchmarking, metrics',       'beginner',     '1 week',  1),
  ('Frontend Performance',      'Core Web Vitals, Lighthouse, lazy loading, bundles',  'intermediate', '2 weeks', 2),
  ('Backend Performance',       'Async I/O, connection pooling, worker threads',       'intermediate', '2 weeks', 3),
  ('Database Performance',      'Indexes, EXPLAIN ANALYZE, N+1, query planning',       'intermediate', '3 weeks', 4),
  ('Caching Strategies',        'Redis, in-memory, CDN, stale-while-revalidate',       'intermediate', '2 weeks', 5),
  ('Network Performance',       'HTTP/2, compression, keepalive, TTFB optimization',  'advanced',     '2 weeks', 6),
  ('Scalability & Cost',        'Horizontal scaling, load testing with k6, cost model','advanced',     '2 weeks', 7)
) AS m(title, description, level, duration, order_index)
WHERE lp.slug = 'performance-optimization'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- open-source
INSERT INTO public.modules (path_id, title, description, level, duration, order_index)
SELECT lp.id, m.title, m.description, m.level, m.duration, m.order_index
FROM public.learning_paths lp
CROSS JOIN (VALUES
  ('Open Source Fundamentals',  'History, philosophy, why OSS matters, community',    'beginner',     '1 week',  1),
  ('Reading Codebases',         'Navigating large repos, understanding conventions',  'beginner',     '1 week',  2),
  ('Your First Contribution',   'Finding good first issues, fork, PR, code review',  'beginner',     '2 weeks', 3),
  ('Maintaining a Project',     'Issue templates, CI, releases, changelogs, tags',   'intermediate', '2 weeks', 4),
  ('Community Building',        'Docs, CONTRIBUTING.md, Discord, code of conduct',   'intermediate', '2 weeks', 5),
  ('Licensing & Governance',    'MIT, Apache-2, GPL, AGPL, CLA, OSS governance',     'advanced',     '1 week',  6)
) AS m(title, description, level, duration, order_index)
WHERE lp.slug = 'open-source'
ON CONFLICT (path_id, order_index) DO NOTHING;


-- ============================================================
-- 3. Challenges for all 12 new paths
-- ============================================================

-- typescript-developer
INSERT INTO public.challenges (path_id, title, description, difficulty, instructions, xp, order_index)
SELECT lp.id, c.title, c.description, c.difficulty, c.instructions, c.xp, c.order_index
FROM public.learning_paths lp
CROSS JOIN (VALUES
  ('Type-Safe Todo List',     'Build a strongly-typed todo app with no `any` allowed',   'beginner',     'Create a Todo interface, a TodoList class with add/remove/complete methods. All functions must have explicit return types. Enable strict mode.',                     75,  1),
  ('Generic Data Fetcher',    'Write a reusable generic fetch wrapper with error typing', 'intermediate', 'Create fetch<T>(url: string): Promise<Result<T>> where Result<T> is a discriminated union of success and error cases. Handle network failures.',              125, 2),
  ('Utility Type Challenge',  'Implement DeepReadonly, DeepPartial, and PickByValue',     'advanced',     'Write the utility types from scratch without using built-in helpers. Test each type against at least 3 different shapes.',                                     200, 3),
  ('Migrate a JS Module',     'Convert a real JavaScript module to TypeScript strict',   'intermediate', 'Take the provided JavaScript file with 200+ lines and migrate it to TypeScript with strict mode, no implicit any, and proper JSDoc comments.',                150, 4),
  ('Typed Event Emitter',     'Build a fully-typed event emitter with generics',         'advanced',     'Create EventEmitter<T extends Record<string, unknown[]>> where T maps event names to their payload types. Implement on, off, emit with full type safety.',    250, 5)
) AS c(title, description, difficulty, instructions, xp, order_index)
WHERE lp.slug = 'typescript-developer'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- git-github
INSERT INTO public.challenges (path_id, title, description, difficulty, instructions, xp, order_index)
SELECT lp.id, c.title, c.description, c.difficulty, c.instructions, c.xp, c.order_index
FROM public.learning_paths lp
CROSS JOIN (VALUES
  ('Resolve a Merge Conflict',  'Fix a realistic 3-way merge conflict correctly',        'beginner',     'Clone the provided repo. Two branches each modified the same function differently. Resolve the conflict, keeping both features, and make the tests pass.',       50,  1),
  ('Rewrite History',           'Clean up a messy commit history with interactive rebase','intermediate', 'Take a branch with 8 commits including WIP, fixes, and typos. Squash into 3 clean commits with descriptive messages. Do not lose any code changes.',          100, 2),
  ('Git Bisect a Bug',          'Use git bisect to find the commit that broke a test',   'intermediate', 'You are given a repo where a test is failing. The test passed 20 commits ago. Use git bisect and the test command to find the exact breaking commit.',        125, 3),
  ('Set Up Branch Protection',  'Configure a repository with branch protection rules',   'beginner',     'Create a GitHub repo with main protection: require PR reviews, pass CI status checks before merging, and prevent force pushes. Document your config.',          75,  4),
  ('Contribute to Open Source', 'Submit a real PR to a public repository on GitHub',     'advanced',     'Find a good-first-issue in any active open source project, fork it, fix it, and open a PR following their contribution guidelines.',                           200, 5)
) AS c(title, description, difficulty, instructions, xp, order_index)
WHERE lp.slug = 'git-github'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- linux-terminal
INSERT INTO public.challenges (path_id, title, description, difficulty, instructions, xp, order_index)
SELECT lp.id, c.title, c.description, c.difficulty, c.instructions, c.xp, c.order_index
FROM public.learning_paths lp
CROSS JOIN (VALUES
  ('Log File Analyzer',         'Parse a 10,000-line server log with grep, awk, sort',  'beginner',     'Given access.log, extract: top 10 IPs by requests, count of 4xx errors per hour, and top requested URLs. Output each to a separate file using only CLI tools.', 75,  1),
  ('Automate a Backup Script',  'Write a Bash script to automate directory backups',     'intermediate', 'Write backup.sh: takes a source dir and destination, creates timestamped tar.gz archives, keeps last 5, logs actions with timestamps, handles errors.',         125, 2),
  ('Harden a Server',           'Configure security settings on a fresh Ubuntu VPS',    'advanced',     'On a provided VPS: disable root SSH login, configure ufw to allow only ports 22/80/443, set up fail2ban, configure automatic security updates, disable unused services.', 200, 3),
  ('Process Monitor',           'Build a Bash monitoring script with alerts',            'intermediate', 'Write a script that checks CPU, memory, and disk every 60 seconds. If any exceeds 90%, write to a log file and send an email alert via sendmail.', 100, 4),
  ('Build a CLI Tool',          'Create a useful CLI utility in Bash with flags',        'advanced',     'Build a CLI tool `gitclean` that removes merged branches, prunes remote tracking refs, and shows disk space saved. Support --dry-run and --force flags.',         175, 5)
) AS c(title, description, difficulty, instructions, xp, order_index)
WHERE lp.slug = 'linux-terminal'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- api-engineering
INSERT INTO public.challenges (path_id, title, description, difficulty, instructions, xp, order_index)
SELECT lp.id, c.title, c.description, c.difficulty, c.instructions, c.xp, c.order_index
FROM public.learning_paths lp
CROSS JOIN (VALUES
  ('Design a REST API',         'Design a RESTful API for a social media platform',     'intermediate', 'Design endpoints for: users, posts, comments, likes, and follows. Define request/response schemas, status codes, and pagination. Write OpenAPI 3.1 YAML.',     125, 1),
  ('JWT Auth Middleware',        'Implement access + refresh token authentication',       'intermediate', 'Build Express middleware: POST /auth/login returns access token (15min) + refresh token (7d). POST /auth/refresh rotates tokens. Revoke tokens on logout.', 150, 2),
  ('GraphQL API',                'Build a GraphQL API with queries, mutations, resolvers','advanced',     'Implement a GraphQL server for a blog platform. Queries: posts, post(id), user. Mutations: createPost, updatePost, addComment. Use DataLoader for N+1.', 200, 3),
  ('Rate Limiting Service',      'Build a distributed rate limiter using Redis',         'advanced',     'Implement sliding window rate limiting in Express using Redis. Support per-IP, per-user, and per-route limits. Return proper 429 responses with Retry-After headers.', 225, 4),
  ('API Contract Tests',         'Write consumer contract tests with Pact',              'intermediate', 'Given a provider API and consumer client, write Pact contract tests that verify the API contract. Integrate with CI to run on every PR.',                    150, 5)
) AS c(title, description, difficulty, instructions, xp, order_index)
WHERE lp.slug = 'api-engineering'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- software-architecture
INSERT INTO public.challenges (path_id, title, description, difficulty, instructions, xp, order_index)
SELECT lp.id, c.title, c.description, c.difficulty, c.instructions, c.xp, c.order_index
FROM public.learning_paths lp
CROSS JOIN (VALUES
  ('Refactor Toward Clean Arch','Migrate a spaghetti codebase to clean architecture',  'intermediate', 'You are given a working but messy Node.js API with business logic in route handlers. Refactor into: entities, use cases, interface adapters, and framework layers. Tests must stay green.', 175, 1),
  ('Identify Design Patterns',  'Spot and name patterns in a real codebase',            'beginner',     'Review the given React codebase and identify at least 5 design patterns in use. For each: name the pattern, explain where it is used, and why it was a good choice.', 75,  2),
  ('Design an Event-Driven Flow','Model an order processing system with events',        'advanced',     'Design the complete event flow for: place order, payment, inventory reservation, shipping, and failure/compensation (saga pattern). Use a diagram + event schema definitions.', 225, 3),
  ('Write an ADR',               'Document a real architecture decision record',         'intermediate', 'Pick a real trade-off in your current or past project (e.g., SQL vs NoSQL, monolith vs microservices). Write a full ADR with context, decision, consequences, and alternatives considered.', 100, 4),
  ('DDD Modeling Exercise',      'Model a domain using DDD tactical patterns',           'advanced',     'Model an e-commerce checkout domain. Define aggregates (Order, Cart, Product), value objects (Money, Address, SKU), domain events (OrderPlaced, PaymentFailed), and repository interfaces.', 250, 5)
) AS c(title, description, difficulty, instructions, xp, order_index)
WHERE lp.slug = 'software-architecture'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- testing-qa
INSERT INTO public.challenges (path_id, title, description, difficulty, instructions, xp, order_index)
SELECT lp.id, c.title, c.description, c.difficulty, c.instructions, c.xp, c.order_index
FROM public.learning_paths lp
CROSS JOIN (VALUES
  ('100% Coverage Challenge',   'Achieve 100% test coverage on a provided module',      'beginner',     'You are given a discount calculator module with edge cases. Write unit tests achieving 100% statement, branch, and function coverage using Vitest.', 75,  1),
  ('TDD a Feature',             'Build a password validator using TDD red-green-refactor','intermediate','Write all tests first for a password strength validator (min 8 chars, uppercase, lowercase, digit, symbol). Then implement until all pass. No modifying tests.', 125, 2),
  ('E2E Login Flow',            'Write Playwright tests for a full authentication flow', 'intermediate', 'Write E2E tests for: signup, email verification, login, forgot password, change password, and logout. Run headlessly in CI. Use page object model pattern.', 150, 3),
  ('Load Test an API',          'Load test an API with k6 and identify bottlenecks',    'advanced',     'Write a k6 test script that ramps from 10 to 500 virtual users over 5 minutes. Identify which endpoint degrades first. Propose and implement one optimization.', 200, 4),
  ('Security Audit',            'Run OWASP ZAP against a web app and fix issues',       'advanced',     'Run OWASP ZAP baseline scan against the provided vulnerable web app. Document all findings with CVSS scores. Fix at least the Critical and High severity issues.', 225, 5)
) AS c(title, description, difficulty, instructions, xp, order_index)
WHERE lp.slug = 'testing-qa'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- docker-kubernetes
INSERT INTO public.challenges (path_id, title, description, difficulty, instructions, xp, order_index)
SELECT lp.id, c.title, c.description, c.difficulty, c.instructions, c.xp, c.order_index
FROM public.learning_paths lp
CROSS JOIN (VALUES
  ('Production Dockerfile',     'Write an optimized multi-stage Dockerfile',             'beginner',     'Containerize a Node.js API with a multi-stage build: dev stage with hot reload, builder stage with TypeScript compile, prod stage with minimal image. Final image < 100MB.', 75,  1),
  ('Docker Compose Stack',      'Spin up a full-stack app with Docker Compose',          'intermediate', 'Write a docker-compose.yml for: React frontend (Nginx), Node.js API, PostgreSQL, Redis. Include health checks, restart policies, named volumes, and env files.', 125, 2),
  ('Deploy to Kubernetes',      'Deploy an app to a local Kubernetes cluster',           'intermediate', 'Deploy the provided API to minikube with: Deployment (3 replicas), Service (ClusterIP + Ingress), ConfigMap for env vars, Secret for DB password, HPA (scale on 70% CPU).', 175, 3),
  ('Zero-Downtime Rolling Update','Perform a zero-downtime deployment in Kubernetes',    'advanced',     'Configure a Kubernetes Deployment with readiness probes, liveness probes, PodDisruptionBudgets, and maxUnavailable=0. Verify zero-downtime during rollout with a continuous load test.', 225, 4),
  ('GitOps with ArgoCD',        'Set up ArgoCD for GitOps continuous delivery',          'advanced',     'Install ArgoCD, create an Application pointing to your Helm chart repository, configure auto-sync with self-heal, and set up an automated rollback on failed health check.', 250, 5)
) AS c(title, description, difficulty, instructions, xp, order_index)
WHERE lp.slug = 'docker-kubernetes'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- networking
INSERT INTO public.challenges (path_id, title, description, difficulty, instructions, xp, order_index)
SELECT lp.id, c.title, c.description, c.difficulty, c.instructions, c.xp, c.order_index
FROM public.learning_paths lp
CROSS JOIN (VALUES
  ('Subnet Calculator',         'Build a CLI subnet calculator from scratch',            'beginner',     'Write a program that takes a CIDR notation (e.g. 192.168.1.0/24) and outputs: network address, broadcast address, first/last usable host, subnet mask, number of hosts.', 75,  1),
  ('DNS Debugging',             'Debug a broken DNS configuration in a scenario',        'intermediate', 'Given a web server that is unreachable, use dig, nslookup, and curl to diagnose the DNS issue. Document each step and fix the A record, CNAME, and TTL problems.', 100, 2),
  ('Configure Nginx Reverse Proxy','Set up Nginx as a reverse proxy with TLS',          'intermediate', 'Configure Nginx to: reverse proxy to 3 Node.js services at different paths, terminate TLS with Let''s Encrypt, add security headers, configure gzip compression.', 150, 3),
  ('Wireshark Analysis',        'Analyze a network capture and answer questions',        'advanced',     'You are given a .pcap file from a production incident. Identify: the source of the DDoS, the exfiltrated data, the credentials sent in plaintext. Write a security report.', 200, 4),
  ('Build a TCP Client/Server', 'Implement a TCP echo server from scratch',              'advanced',     'Write a TCP server in Node.js and a Python client. Handle multiple concurrent connections. Implement a simple text protocol with headers, length-prefixed messages, and error handling.', 225, 5)
) AS c(title, description, difficulty, instructions, xp, order_index)
WHERE lp.slug = 'networking'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- operating-systems
INSERT INTO public.challenges (path_id, title, description, difficulty, instructions, xp, order_index)
SELECT lp.id, c.title, c.description, c.difficulty, c.instructions, c.xp, c.order_index
FROM public.learning_paths lp
CROSS JOIN (VALUES
  ('Simulate Process Scheduling','Implement FCFS, SJF, and Round Robin schedulers',     'intermediate', 'Write a process scheduler simulator. Input: list of processes with arrival time and burst time. Output: Gantt chart, average waiting time, and turnaround time for each algorithm.', 150, 1),
  ('Thread-Safe Queue',          'Implement a thread-safe bounded queue',                'intermediate', 'Implement a BlockingQueue<T> in Java/C++ with: add (blocks when full), take (blocks when empty), size(), and proper mutex/condition variable synchronization.', 175, 2),
  ('Memory Allocator',           'Build a simplified malloc/free implementation',         'advanced',     'Implement a heap memory allocator using a doubly-linked free list. Support malloc, free, and realloc. Handle fragmentation. Must pass the provided test suite.', 250, 3),
  ('Deadlock Detector',          'Write a deadlock detection algorithm',                  'advanced',     'Implement the Banker''s Algorithm for deadlock detection. Input: a resource allocation matrix and request matrix. Output: if system is safe, show the safe sequence.', 200, 4),
  ('Analyze a Core Dump',        'Debug a segmentation fault using a core dump',          'intermediate', 'Given a binary and its core dump, use gdb to identify the exact line causing the segfault, the state of the stack and registers, and the root cause.', 125, 5)
) AS c(title, description, difficulty, instructions, xp, order_index)
WHERE lp.slug = 'operating-systems'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- distributed-systems
INSERT INTO public.challenges (path_id, title, description, difficulty, instructions, xp, order_index)
SELECT lp.id, c.title, c.description, c.difficulty, c.instructions, c.xp, c.order_index
FROM public.learning_paths lp
CROSS JOIN (VALUES
  ('Consistent Hashing Ring',   'Implement consistent hashing with virtual nodes',       'intermediate', 'Build a consistent hash ring with virtual nodes. Support: add/remove servers, key lookup, rebalancing (show key migration). Demonstrate even distribution with 1000 keys.', 175, 1),
  ('Leader Election',           'Implement a simplified Raft leader election',            'advanced',     'Simulate 5 nodes running the Raft election algorithm. Nodes communicate via message passing. Handle: election timeout, split vote, network partition (disconnect 1 node).', 250, 2),
  ('Distributed Counter',       'Build an eventually consistent distributed counter',     'intermediate', 'Implement a G-Counter CRDT that can be incremented across nodes without coordination and converged with a merge operation. Prove convergence property.', 150, 3),
  ('Kafka Producer/Consumer',   'Build a reliable event processing pipeline with Kafka', 'intermediate', 'Set up Kafka locally, write a producer for order events, a consumer group with 3 instances, dead-letter queue for failed messages, and exactly-once semantics with transactions.', 175, 4),
  ('Circuit Breaker',           'Implement the circuit breaker pattern',                  'advanced',     'Build a Circuit Breaker that wraps any async function. Support: closed/open/half-open states, configurable failure threshold, timeout, and gradual recovery. Write tests.', 225, 5)
) AS c(title, description, difficulty, instructions, xp, order_index)
WHERE lp.slug = 'distributed-systems'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- performance-optimization
INSERT INTO public.challenges (path_id, title, description, difficulty, instructions, xp, order_index)
SELECT lp.id, c.title, c.description, c.difficulty, c.instructions, c.xp, c.order_index
FROM public.learning_paths lp
CROSS JOIN (VALUES
  ('Speed Up a Slow Query',     'Optimize a PostgreSQL query from 10s to <100ms',        'intermediate', 'You are given a PostgreSQL database with 1 million rows and a query taking 10+ seconds. Use EXPLAIN ANALYZE to diagnose, add appropriate indexes, rewrite if needed. Target <100ms.', 150, 1),
  ('Core Web Vitals Audit',     'Achieve a 90+ Lighthouse score on a provided app',      'intermediate', 'The provided React app scores 42 on Lighthouse. Identify all issues, fix LCP, CLS, FID/INP, implement lazy loading, code splitting, and image optimization.', 175, 2),
  ('Redis Caching Layer',       'Add Redis caching to reduce API response times',         'intermediate', 'Add Redis caching to an Express API. Cache GET /products (5 min TTL), GET /products/:id (1 min TTL). Implement cache invalidation on updates. Measure before/after with autocannon.', 150, 3),
  ('Load Test & Optimize',      'Find and fix the bottleneck under 1000 concurrent users','advanced',    'Write a k6 load test. Run it against the provided API. Find the bottleneck (hint: check connection pooling, synchronous I/O, memory leaks). Fix it. Show 10x throughput improvement.', 225, 4),
  ('Bundle Size Audit',         'Reduce a React app bundle from 2MB to under 500KB',     'advanced',     'Analyze the provided React app bundle with webpack-bundle-analyzer. Implement: route-based code splitting, dynamic imports, tree shaking, precompression. Measure impact.', 200, 5)
) AS c(title, description, difficulty, instructions, xp, order_index)
WHERE lp.slug = 'performance-optimization'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- open-source
INSERT INTO public.challenges (path_id, title, description, difficulty, instructions, xp, order_index)
SELECT lp.id, c.title, c.description, c.difficulty, c.instructions, c.xp, c.order_index
FROM public.learning_paths lp
CROSS JOIN (VALUES
  ('First Open Source PR',      'Submit a real merged PR to any open source project',   'beginner',     'Find an open source project with good-first-issue label. Fix the issue following their contribution guidelines. Get it merged. Share the PR link as your submission.', 100, 1),
  ('Write a CONTRIBUTING.md',   'Create a complete contribution guide for a project',   'intermediate', 'For your own project, write a CONTRIBUTING.md covering: how to report bugs, feature requests, development setup, coding standards, PR process, and code of conduct.', 100, 2),
  ('Set Up a Release Pipeline', 'Automate versioning, changelog, and GitHub releases',  'intermediate', 'Using semantic-release or release-it, set up automated: version bumping from conventional commits, CHANGELOG.md generation, GitHub release creation, npm publish.', 150, 3),
  ('Add CI to an OSS Project',  'Add a complete GitHub Actions CI workflow',             'intermediate', 'For a project with no CI, add: lint, type check, test, build, coverage report, and matrix testing across Node 18/20/22. Status badges must appear in README.', 125, 4),
  ('Publish an npm Package',    'Build and publish a useful utility to npm',             'advanced',     'Create an npm package with TypeScript, tests, auto-generated docs, semantic versioning, and a GitHub Actions release workflow. Get at least 10 real downloads.', 200, 5)
) AS c(title, description, difficulty, instructions, xp, order_index)
WHERE lp.slug = 'open-source'
ON CONFLICT (path_id, order_index) DO NOTHING;


-- ============================================================
-- 4. Projects for all 12 new paths
-- ============================================================
-- typescript-developer projects
INSERT INTO public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, portfolio_level, is_capstone, requirements, order_index)
SELECT lp.id, 'TypeScript Todo API', 'A REST API for a todo app built entirely in strict TypeScript', 'beginner', '1 week', ARRAY['TypeScript','Node.js','Express','Zod']::text[], 'small', false, to_jsonb('Strict TypeScript config, Zod request validation, type-safe error handling, 90%+ test coverage'::text), 1
FROM public.learning_paths lp WHERE lp.slug = 'typescript-developer'
ON CONFLICT (path_id, order_index) DO NOTHING;

INSERT INTO public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, portfolio_level, is_capstone, requirements, order_index)
SELECT lp.id, 'Typed React Dashboard', 'A data dashboard with fully-typed React components, hooks, and context', 'intermediate', '2 weeks', ARRAY['TypeScript','React','React Query','Zod']::text[], 'mid', false, to_jsonb('No any types, custom typed hooks for data fetching, typed forms with React Hook Form, Vitest tests'::text), 2
FROM public.learning_paths lp WHERE lp.slug = 'typescript-developer'
ON CONFLICT (path_id, order_index) DO NOTHING;

INSERT INTO public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, portfolio_level, is_capstone, requirements, order_index)
SELECT lp.id, 'TypeScript CLI Framework', 'A tiny typed CLI framework like commander.js from scratch', 'advanced', '3 weeks', ARRAY['TypeScript','Node.js','npm']::text[], 'advanced', false, to_jsonb('Generic command registry, plugin system, auto-generated help, npm-publishable with .d.ts files'::text), 3
FROM public.learning_paths lp WHERE lp.slug = 'typescript-developer'
ON CONFLICT (path_id, order_index) DO NOTHING;

INSERT INTO public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, portfolio_level, is_capstone, requirements, order_index)
SELECT lp.id, 'Enterprise TypeScript App', 'A full production TypeScript application with backend and frontend', 'advanced', '6 weeks', ARRAY['TypeScript','React','Node.js','PostgreSQL','Zod','Vitest']::text[], 'capstone', true, to_jsonb('Monorepo with shared types, strict ESLint + type checking in CI, 100% TypeScript coverage, deployed'::text), 4
FROM public.learning_paths lp WHERE lp.slug = 'typescript-developer'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- git-github projects
INSERT INTO public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, portfolio_level, is_capstone, requirements, order_index)
SELECT lp.id, 'Personal Dev Portfolio', 'A portfolio site with a blog built with GitHub Actions for deployment', 'beginner', '1 week', ARRAY['Git','GitHub Actions','HTML','CSS']::text[], 'small', false, to_jsonb('Automated deployment on push to main, feature branches for each post, PR workflow for drafts'::text), 1
FROM public.learning_paths lp WHERE lp.slug = 'git-github'
ON CONFLICT (path_id, order_index) DO NOTHING;

INSERT INTO public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, portfolio_level, is_capstone, requirements, order_index)
SELECT lp.id, 'Git History Visualizer', 'A CLI tool that visualizes git history as ASCII art', 'intermediate', '2 weeks', ARRAY['Git','Node.js','TypeScript']::text[], 'mid', false, to_jsonb('Parse git log output, display branch graph, show authors, dates, and conventional commit types'::text), 2
FROM public.learning_paths lp WHERE lp.slug = 'git-github'
ON CONFLICT (path_id, order_index) DO NOTHING;

INSERT INTO public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, portfolio_level, is_capstone, requirements, order_index)
SELECT lp.id, 'Team Git Workflow Setup', 'Set up a complete GitHub repository for a team project', 'intermediate', '1 week', ARRAY['Git','GitHub','GitHub Actions']::text[], 'mid', false, to_jsonb('Branch protection, required CI checks, PR templates, issue templates, CODEOWNERS, release automation'::text), 3
FROM public.learning_paths lp WHERE lp.slug = 'git-github'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- linux-terminal projects
INSERT INTO public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, portfolio_level, is_capstone, requirements, order_index)
SELECT lp.id, 'Automated Backup System', 'A production-grade backup script with rotation and alerting', 'beginner', '1 week', ARRAY['Bash','Linux','cron']::text[], 'small', false, to_jsonb('Timestamped backups, configurable retention, email alerts on failure, restore capability'::text), 1
FROM public.learning_paths lp WHERE lp.slug = 'linux-terminal'
ON CONFLICT (path_id, order_index) DO NOTHING;

INSERT INTO public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, portfolio_level, is_capstone, requirements, order_index)
SELECT lp.id, 'Server Setup Automation', 'Ansible playbooks to provision and configure a Linux server', 'intermediate', '2 weeks', ARRAY['Bash','Ansible','Linux','Nginx']::text[], 'mid', false, to_jsonb('Idempotent playbooks, install stack, configure Nginx, set up SSL, security hardening, cron jobs'::text), 2
FROM public.learning_paths lp WHERE lp.slug = 'linux-terminal'
ON CONFLICT (path_id, order_index) DO NOTHING;

INSERT INTO public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, portfolio_level, is_capstone, requirements, order_index)
SELECT lp.id, 'Linux Monitoring Dashboard', 'A terminal-based server monitoring tool', 'intermediate', '2 weeks', ARRAY['Bash','Python','Linux']::text[], 'mid', false, to_jsonb('Real-time CPU/memory/disk/network stats, process manager, log viewer, configurable alerts'::text), 3
FROM public.learning_paths lp WHERE lp.slug = 'linux-terminal'
ON CONFLICT (path_id, order_index) DO NOTHING;

INSERT INTO public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, portfolio_level, is_capstone, requirements, order_index)
SELECT lp.id, 'DevOps Toolkit CLI', 'A comprehensive CLI toolkit for common DevOps tasks', 'advanced', '4 weeks', ARRAY['Bash','Python','Docker','Kubernetes']::text[], 'capstone', true, to_jsonb('Containerized deployment helper, log aggregator, health checker, secret manager, published as tool'::text), 4
FROM public.learning_paths lp WHERE lp.slug = 'linux-terminal'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- api-engineering projects
INSERT INTO public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, portfolio_level, is_capstone, requirements, order_index)
SELECT lp.id, 'RESTful Blog API', 'A production-ready REST API with auth, pagination, and docs', 'beginner', '2 weeks', ARRAY['Node.js','Express','PostgreSQL','OpenAPI']::text[], 'small', false, to_jsonb('Full CRUD, JWT auth, pagination, filtering, auto-generated OpenAPI docs, 90%+ test coverage'::text), 1
FROM public.learning_paths lp WHERE lp.slug = 'api-engineering'
ON CONFLICT (path_id, order_index) DO NOTHING;

INSERT INTO public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, portfolio_level, is_capstone, requirements, order_index)
SELECT lp.id, 'GraphQL Social API', 'A GraphQL API for a social platform with subscriptions', 'intermediate', '3 weeks', ARRAY['Node.js','GraphQL','Apollo','PostgreSQL','Redis']::text[], 'mid', false, to_jsonb('Queries/mutations/subscriptions, DataLoader for N+1, persisted queries, rate limiting, auth directives'::text), 2
FROM public.learning_paths lp WHERE lp.slug = 'api-engineering'
ON CONFLICT (path_id, order_index) DO NOTHING;

INSERT INTO public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, portfolio_level, is_capstone, requirements, order_index)
SELECT lp.id, 'API Gateway', 'A lightweight API gateway with routing, auth, and rate limiting', 'advanced', '4 weeks', ARRAY['Node.js','Redis','JWT','Docker']::text[], 'advanced', false, to_jsonb('Dynamic routing config, JWT validation, per-key rate limiting, request logging, health checks, Docker'::text), 3
FROM public.learning_paths lp WHERE lp.slug = 'api-engineering'
ON CONFLICT (path_id, order_index) DO NOTHING;

INSERT INTO public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, portfolio_level, is_capstone, requirements, order_index)
SELECT lp.id, 'Developer API Platform', 'A full developer portal with API management, keys, and analytics', 'advanced', '8 weeks', ARRAY['TypeScript','Node.js','React','PostgreSQL','Redis']::text[], 'capstone', true, to_jsonb('API key management, usage analytics dashboard, webhook management, interactive docs playground, billing hooks'::text), 4
FROM public.learning_paths lp WHERE lp.slug = 'api-engineering'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- software-architecture projects
INSERT INTO public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, portfolio_level, is_capstone, requirements, order_index)
SELECT lp.id, 'Clean Architecture Starter', 'A production-ready clean architecture template with layered structure', 'intermediate', '2 weeks', ARRAY['TypeScript','Node.js','PostgreSQL']::text[], 'small', false, to_jsonb('Entity, use-case, adapter, and framework layers fully separated, dependency injection, 100% unit testable'::text), 1
FROM public.learning_paths lp WHERE lp.slug = 'software-architecture'
ON CONFLICT (path_id, order_index) DO NOTHING;

INSERT INTO public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, portfolio_level, is_capstone, requirements, order_index)
SELECT lp.id, 'Design Pattern Library', 'A documented collection of design patterns with real use cases', 'intermediate', '3 weeks', ARRAY['TypeScript','React','Storybook']::text[], 'mid', false, to_jsonb('At least 15 patterns, each with diagram, code example, real-world scenario, and interactive demo'::text), 2
FROM public.learning_paths lp WHERE lp.slug = 'software-architecture'
ON CONFLICT (path_id, order_index) DO NOTHING;

INSERT INTO public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, portfolio_level, is_capstone, requirements, order_index)
SELECT lp.id, 'Event-Driven Order System', 'An order processing system using event-driven architecture', 'advanced', '6 weeks', ARRAY['TypeScript','Node.js','Kafka','PostgreSQL','Redis']::text[], 'capstone', true, to_jsonb('Domain events, saga pattern for distributed transactions, event store, replay capability, full observability'::text), 3
FROM public.learning_paths lp WHERE lp.slug = 'software-architecture'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- testing-qa projects
INSERT INTO public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, portfolio_level, is_capstone, requirements, order_index)
SELECT lp.id, 'Test Suite for Legacy Code', 'Add comprehensive tests to an untested legacy codebase', 'beginner', '1 week', ARRAY['Vitest','TypeScript']::text[], 'small', false, to_jsonb('Unit tests with 90%+ coverage, integration tests for all API routes, E2E for critical user flows'::text), 1
FROM public.learning_paths lp WHERE lp.slug = 'testing-qa'
ON CONFLICT (path_id, order_index) DO NOTHING;

INSERT INTO public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, portfolio_level, is_capstone, requirements, order_index)
SELECT lp.id, 'TDD Feature Project', 'Build a feature from scratch using strict TDD', 'intermediate', '2 weeks', ARRAY['TypeScript','Vitest','React','Playwright']::text[], 'mid', false, to_jsonb('Full red-green-refactor cycle, commit for each passing test, outside-in approach, zero regressions'::text), 2
FROM public.learning_paths lp WHERE lp.slug = 'testing-qa'
ON CONFLICT (path_id, order_index) DO NOTHING;

INSERT INTO public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, portfolio_level, is_capstone, requirements, order_index)
SELECT lp.id, 'Automated QA Pipeline', 'A complete automated testing pipeline with CI integration', 'advanced', '4 weeks', ARRAY['Playwright','k6','GitHub Actions','Docker']::text[], 'capstone', true, to_jsonb('Unit + integration + E2E + performance tests, coverage gates, visual regression, parallel execution in CI'::text), 3
FROM public.learning_paths lp WHERE lp.slug = 'testing-qa'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- docker-kubernetes projects
INSERT INTO public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, portfolio_level, is_capstone, requirements, order_index)
SELECT lp.id, 'Containerized Full-Stack App', 'A 3-tier app fully containerized with Docker Compose', 'beginner', '1 week', ARRAY['Docker','Node.js','React','PostgreSQL','Nginx']::text[], 'small', false, to_jsonb('Multi-stage build, compose with health checks, volumes for persistence, env files, one-command startup'::text), 1
FROM public.learning_paths lp WHERE lp.slug = 'docker-kubernetes'
ON CONFLICT (path_id, order_index) DO NOTHING;

INSERT INTO public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, portfolio_level, is_capstone, requirements, order_index)
SELECT lp.id, 'Kubernetes Microservices', 'Deploy a microservices app to Kubernetes', 'intermediate', '3 weeks', ARRAY['Kubernetes','Docker','Helm','Nginx Ingress']::text[], 'mid', false, to_jsonb('Multiple services, ingress routing, HPA, resource limits/requests, ConfigMaps, Secrets, rolling updates'::text), 2
FROM public.learning_paths lp WHERE lp.slug = 'docker-kubernetes'
ON CONFLICT (path_id, order_index) DO NOTHING;

INSERT INTO public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, portfolio_level, is_capstone, requirements, order_index)
SELECT lp.id, 'Production K8s Platform', 'A production-grade Kubernetes platform with GitOps', 'advanced', '8 weeks', ARRAY['Kubernetes','ArgoCD','Helm','Prometheus','Grafana']::text[], 'capstone', true, to_jsonb('GitOps with ArgoCD, Prometheus+Grafana monitoring, auto-scaling, secrets management, disaster recovery plan'::text), 3
FROM public.learning_paths lp WHERE lp.slug = 'docker-kubernetes'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- networking projects
INSERT INTO public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, portfolio_level, is_capstone, requirements, order_index)
SELECT lp.id, 'Network Topology Visualizer', 'A web tool to visualize and trace network paths', 'intermediate', '2 weeks', ARRAY['Node.js','React','D3.js']::text[], 'small', false, to_jsonb('Visual traceroute, DNS lookup, port scanner (localhost only), latency chart over time'::text), 1
FROM public.learning_paths lp WHERE lp.slug = 'networking'
ON CONFLICT (path_id, order_index) DO NOTHING;

INSERT INTO public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, portfolio_level, is_capstone, requirements, order_index)
SELECT lp.id, 'Nginx Load Balancer Setup', 'Configure Nginx with SSL, load balancing, and monitoring', 'intermediate', '2 weeks', ARRAY['Nginx','Linux','Docker','Let''s Encrypt']::text[], 'mid', false, to_jsonb('Upstream config, health checks, SSL termination, rate limiting, logging, Prometheus metrics exporter'::text), 2
FROM public.learning_paths lp WHERE lp.slug = 'networking'
ON CONFLICT (path_id, order_index) DO NOTHING;

INSERT INTO public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, portfolio_level, is_capstone, requirements, order_index)
SELECT lp.id, 'Network Security Toolkit', 'A collection of defensive networking tools', 'advanced', '4 weeks', ARRAY['Python','Linux','Wireshark']::text[], 'capstone', true, to_jsonb('Packet analyzer, port scanner, SSL cert checker, DNS leak detector, documented threat model'::text), 3
FROM public.learning_paths lp WHERE lp.slug = 'networking'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- operating-systems projects
INSERT INTO public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, portfolio_level, is_capstone, requirements, order_index)
SELECT lp.id, 'Shell in C', 'Build a basic Unix shell from scratch', 'intermediate', '2 weeks', ARRAY['C','Linux']::text[], 'mid', false, to_jsonb('Parse and execute commands, handle pipes (|), I/O redirection (< > >>), background jobs (&), built-ins'::text), 1
FROM public.learning_paths lp WHERE lp.slug = 'operating-systems'
ON CONFLICT (path_id, order_index) DO NOTHING;

INSERT INTO public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, portfolio_level, is_capstone, requirements, order_index)
SELECT lp.id, 'Thread Pool Implementation', 'Implement a thread pool worker system', 'intermediate', '2 weeks', ARRAY['C++','POSIX Threads']::text[], 'mid', false, to_jsonb('Fixed-size worker pool, task queue with mutex, graceful shutdown, performance benchmark vs serial'::text), 2
FROM public.learning_paths lp WHERE lp.slug = 'operating-systems'
ON CONFLICT (path_id, order_index) DO NOTHING;

INSERT INTO public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, portfolio_level, is_capstone, requirements, order_index)
SELECT lp.id, 'Mini OS Kernel', 'Build a minimal x86 kernel that boots and prints text', 'advanced', '8 weeks', ARRAY['C','Assembly','QEMU']::text[], 'capstone', true, to_jsonb('Bootloader, protected mode, VGA text output, basic memory management, keyboard interrupt handler'::text), 3
FROM public.learning_paths lp WHERE lp.slug = 'operating-systems'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- distributed-systems projects
INSERT INTO public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, portfolio_level, is_capstone, requirements, order_index)
SELECT lp.id, 'Distributed Key-Value Store', 'Build a simplified Redis-like distributed store', 'advanced', '4 weeks', ARRAY['Go','gRPC','Raft']::text[], 'advanced', false, to_jsonb('Single-leader replication, consistent hashing, GET/SET/DELETE, persistence to disk, leader election'::text), 1
FROM public.learning_paths lp WHERE lp.slug = 'distributed-systems'
ON CONFLICT (path_id, order_index) DO NOTHING;

INSERT INTO public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, portfolio_level, is_capstone, requirements, order_index)
SELECT lp.id, 'Event Streaming Pipeline', 'Real-time data pipeline using Kafka and consumers', 'intermediate', '3 weeks', ARRAY['Node.js','Kafka','PostgreSQL','Redis']::text[], 'mid', false, to_jsonb('Producer with backpressure, consumer groups, at-least-once delivery, dead-letter queue, dashboarding'::text), 2
FROM public.learning_paths lp WHERE lp.slug = 'distributed-systems'
ON CONFLICT (path_id, order_index) DO NOTHING;

INSERT INTO public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, portfolio_level, is_capstone, requirements, order_index)
SELECT lp.id, 'Distributed Tracing System', 'Build an observability platform with distributed traces', 'advanced', '8 weeks', ARRAY['Node.js','Jaeger','OpenTelemetry','Grafana']::text[], 'capstone', true, to_jsonb('Auto-instrumentation, trace propagation across 5+ services, flame graph, anomaly detection, alerting'::text), 3
FROM public.learning_paths lp WHERE lp.slug = 'distributed-systems'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- performance-optimization projects
INSERT INTO public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, portfolio_level, is_capstone, requirements, order_index)
SELECT lp.id, 'API Optimization Project', 'Optimize an intentionally slow API to 10x faster', 'intermediate', '1 week', ARRAY['Node.js','PostgreSQL','Redis']::text[], 'small', false, to_jsonb('Identify N+1 queries, add indexes, add Redis cache, fix connection pooling. Document all improvements.'::text), 1
FROM public.learning_paths lp WHERE lp.slug = 'performance-optimization'
ON CONFLICT (path_id, order_index) DO NOTHING;

INSERT INTO public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, portfolio_level, is_capstone, requirements, order_index)
SELECT lp.id, 'Frontend Perf Audit', 'Transform a 30-score Lighthouse app to 95+', 'intermediate', '2 weeks', ARRAY['React','Webpack','Lighthouse','Nginx']::text[], 'mid', false, to_jsonb('Code splitting, lazy images, font optimization, critical CSS, TTFB < 200ms, deployed to CDN'::text), 2
FROM public.learning_paths lp WHERE lp.slug = 'performance-optimization'
ON CONFLICT (path_id, order_index) DO NOTHING;

INSERT INTO public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, portfolio_level, is_capstone, requirements, order_index)
SELECT lp.id, 'Performance Engineering Report', 'Full stack performance audit with before/after', 'advanced', '4 weeks', ARRAY['k6','PostgreSQL','Redis','Grafana','Lighthouse']::text[], 'capstone', true, to_jsonb('Load test baseline, identify top 3 bottlenecks, implement fixes, measure impact, present findings report'::text), 3
FROM public.learning_paths lp WHERE lp.slug = 'performance-optimization'
ON CONFLICT (path_id, order_index) DO NOTHING;

-- open-source projects
INSERT INTO public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, portfolio_level, is_capstone, requirements, order_index)
SELECT lp.id, 'First OSS Contribution', 'Successfully contribute to an active open source project', 'beginner', '1 week', ARRAY['Git','GitHub']::text[], 'small', false, to_jsonb('Merged PR in a repo with 100+ stars, proper conventional commit, passing CI, review feedback addressed'::text), 1
FROM public.learning_paths lp WHERE lp.slug = 'open-source'
ON CONFLICT (path_id, order_index) DO NOTHING;

INSERT INTO public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, portfolio_level, is_capstone, requirements, order_index)
SELECT lp.id, 'Your Own npm Library', 'Build and publish a TypeScript utility library to npm', 'intermediate', '3 weeks', ARRAY['TypeScript','npm','GitHub Actions','Vitest']::text[], 'mid', false, to_jsonb('Dual CJS/ESM output, TypeDoc docs, automated releases, 100% typed, 90%+ test coverage, 50+ downloads'::text), 2
FROM public.learning_paths lp WHERE lp.slug = 'open-source'
ON CONFLICT (path_id, order_index) DO NOTHING;

INSERT INTO public.projects (path_id, title, description, difficulty, estimated_time, tech_stack, portfolio_level, is_capstone, requirements, order_index)
SELECT lp.id, 'OSS Project Launch', 'Launch an open source project from scratch to community adoption', 'advanced', '8 weeks', ARRAY['TypeScript','GitHub','GitHub Actions']::text[], 'capstone', true, to_jsonb('README, CONTRIBUTING, CI pipeline, issue templates, first release, documentation site, 50+ GitHub stars'::text), 3
FROM public.learning_paths lp WHERE lp.slug = 'open-source'
ON CONFLICT (path_id, order_index) DO NOTHING;
