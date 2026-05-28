-- ============================================================
-- Unleash Coding – Migration 013
-- Real lesson content: Frontend, React, Backend, SQL, DSA
-- ============================================================

-- ============================================================
-- FRONTEND DEVELOPER – Module 1: HTML Essentials
-- ============================================================

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'Semantic HTML5: Structure with Meaning',
$$## Semantic HTML5: Structure with Meaning

Semantic HTML means using elements that describe their content's purpose, not just its appearance. This helps search engines, screen readers, and developers understand your page.

### Block vs Inline Elements

```html
<!-- Block elements — start on a new line, take full width: -->
<div>Generic block container</div>
<p>Paragraph of text</p>
<h1>Heading level 1</h1>

<!-- Inline elements — flow within text: -->
<span>Generic inline</span>
<strong>Bold (important)</strong>
<em>Italic (emphasized)</em>
<a href="#">Link</a>
```

### Semantic Document Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="A page about web development">
    <title>My Portfolio | Web Developer</title>
</head>
<body>

    <header>
        <nav aria-label="Main navigation">
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
        </nav>
    </header>

    <main>
        <article>
            <header>
                <h1>Building Accessible Web Apps</h1>
                <time datetime="2024-01-15">January 15, 2024</time>
            </header>
            <p>Main article content here...</p>
            <section>
                <h2>First Section</h2>
                <p>Section content...</p>
            </section>
        </article>

        <aside aria-label="Related articles">
            <h2>Related Reading</h2>
            <ul>
                <li><a href="/article-1">Article One</a></li>
            </ul>
        </aside>
    </main>

    <footer>
        <p>&copy; 2024 My Portfolio</p>
    </footer>

</body>
</html>
```

### Key Semantic Elements

| Element       | Purpose                                          |
|---------------|--------------------------------------------------|
| `<header>`    | Introductory content for a page or section       |
| `<nav>`       | Navigation links                                 |
| `<main>`      | The primary content (only one per page!)         |
| `<article>`   | Self-contained, independently shareable content  |
| `<section>`   | A themed group of content within a page          |
| `<aside>`     | Related but not essential content (sidebar)      |
| `<footer>`    | Closing content for a page or section            |
| `<figure>`    | Image/chart with an optional `<figcaption>`     |
| `<time>`      | Dates and times (with `datetime` attribute)      |

### Forms — Accessible by Default

```html
<form action="/signup" method="post">
    <!-- Always use <label> linked to inputs -->
    <div>
        <label for="email">Email Address</label>
        <input
            type="email"
            id="email"
            name="email"
            required
            autocomplete="email"
            placeholder="alice@example.com"
        />
    </div>

    <div>
        <label for="password">Password</label>
        <input
            type="password"
            id="password"
            name="password"
            required
            minlength="8"
            autocomplete="new-password"
        />
    </div>

    <fieldset>
        <legend>Preferred Contact Method</legend>
        <label><input type="radio" name="contact" value="email"> Email</label>
        <label><input type="radio" name="contact" value="phone"> Phone</label>
    </fieldset>

    <button type="submit">Create Account</button>
</form>
```

> Using `<label for="id">` properly means clicking the label focuses the input — a huge accessibility win. Screen readers also announce what each field is for.

### Why Semantics Matter for SEO

Search engines use semantic elements to understand your page hierarchy. An `<h1>` signals the main topic. `<article>` content ranks higher than `<div>` content. `<time>` helps Google understand publish dates for news articles.$$,
  'reading', '25 min', 1, 25
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'frontend-developer' AND m.order_index = 1
AND NOT EXISTS (SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 1);

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'CSS Fundamentals: Box Model and Flexbox',
$$## CSS Fundamentals: Box Model and Flexbox

CSS controls how elements look and how they are laid out on a page. Two concepts are absolutely foundational: the box model and Flexbox.

### The Box Model

Every HTML element is a rectangular box with four areas:

```
┌────────────────────────────────────┐
│              MARGIN                │
│  ┌──────────────────────────────┐  │
│  │           BORDER             │  │
│  │  ┌────────────────────────┐  │  │
│  │  │        PADDING         │  │  │
│  │  │  ┌──────────────────┐  │  │  │
│  │  │  │     CONTENT      │  │  │  │
│  │  │  └──────────────────┘  │  │  │
│  │  └────────────────────────┘  │  │
│  └──────────────────────────────┘  │
└────────────────────────────────────┘
```

```css
.box {
    /* Content area: */
    width:  200px;
    height: 100px;

    /* Space inside the border: */
    padding: 20px;          /* all sides */
    padding: 10px 20px;     /* top/bottom  left/right */
    padding: 5px 10px 15px 20px;  /* top right bottom left */

    /* The border itself: */
    border: 2px solid #ccc;

    /* Space outside the border: */
    margin: 16px;
    margin: 0 auto;    /* centers block elements horizontally */
}

/* box-sizing: border-box — width INCLUDES padding and border.
   This is the behavior almost everyone wants: */
*, *::before, *::after {
    box-sizing: border-box;
}
```

### Flexbox — One-Dimensional Layout

Flexbox arranges items in a row (horizontal) or column (vertical).

```html
<div class="container">
    <div class="item">A</div>
    <div class="item">B</div>
    <div class="item">C</div>
</div>
```

```css
/* Apply flex to the PARENT (container): */
.container {
    display: flex;

    /* Direction: row (default) or column */
    flex-direction: row;

    /* Alignment on the MAIN axis (horizontal in row): */
    justify-content: space-between;
    /* Options: flex-start | flex-end | center | space-between | space-around | space-evenly */

    /* Alignment on the CROSS axis (vertical in row): */
    align-items: center;
    /* Options: flex-start | flex-end | center | stretch | baseline */

    /* Wrap items when they overflow: */
    flex-wrap: wrap;

    /* Spacing between items: */
    gap: 16px;
}

/* Control how items grow/shrink: */
.item {
    flex: 1;           /* Grow equally to fill container */
    /* flex: 0 0 200px; — fixed 200px, no grow or shrink */
}

.special-item {
    flex: 2;           /* Gets twice as much space as flex: 1 items */
}
```

### A Common Flexbox Navbar

```css
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    height: 64px;
    background: #1e2130;
}

.navbar__logo {
    font-size: 1.5rem;
    font-weight: bold;
}

.navbar__links {
    display: flex;
    gap: 24px;
    list-style: none;
}

.navbar__cta {
    margin-left: auto;   /* Push to the right */
}
```

### CSS Grid — Two-Dimensional Layout

Use Grid when you need both rows and columns:

```css
.dashboard {
    display: grid;
    grid-template-columns: 240px 1fr;   /* sidebar + main */
    grid-template-rows: 64px 1fr;       /* header + content */
    min-height: 100vh;
    gap: 0;
}

.header  { grid-column: 1 / -1; }   /* span all columns */
.sidebar { grid-row: 2; }
.main    { grid-column: 2; grid-row: 2; }

/* Responsive auto-layout: */
.card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
}
```$$,
  'reading', '35 min', 2, 35
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'frontend-developer' AND m.order_index = 2
AND NOT EXISTS (SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 2);

-- ============================================================
-- REACT DEVELOPER – Module 1: React Core
-- ============================================================

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'JSX, Components, and Props',
$$## JSX, Components, and Props

React builds UIs from components — reusable, self-contained pieces that can receive data (props) and render UI.

### What is JSX?

JSX looks like HTML inside JavaScript, but it compiles to `React.createElement()` calls.

```jsx
// JSX:
const element = <h1 className="title">Hello, World!</h1>;

// What JSX compiles to:
const element = React.createElement("h1", { className: "title" }, "Hello, World!");
```

Key differences from HTML:
- `class` → `className`
- `for` → `htmlFor`
- Self-closing tags need a slash: `<img />`, `<input />`
- JavaScript expressions in `{}`: `<h1>{2 + 2}</h1>` renders "4"

### Your First Component

```jsx
// Function component — always capitalize the name:
function WelcomeCard() {
    const name = "Alice";
    const score = 95;

    return (
        <div className="card">
            <h2>Welcome back, {name}!</h2>
            <p>Your score: <strong>{score}</strong></p>
            {score >= 90 && <span className="badge">⭐ Top Performer</span>}
        </div>
    );
}

// Use it like an HTML tag:
function App() {
    return (
        <div>
            <WelcomeCard />
        </div>
    );
}
```

### Props — Passing Data to Components

Props are inputs to a component — like function arguments.

```jsx
// Define the component with props:
function UserCard({ name, role, avatarUrl }) {
    return (
        <div className="user-card">
            <img src={avatarUrl} alt={`${name}'s avatar`} />
            <h3>{name}</h3>
            <span className="role">{role}</span>
        </div>
    );
}

// Use it with different data each time:
function UserList() {
    return (
        <div>
            <UserCard name="Alice" role="Admin"     avatarUrl="/alice.jpg" />
            <UserCard name="Bob"   role="Developer" avatarUrl="/bob.jpg"   />
        </div>
    );
}
```

### TypeScript Props Interface

```tsx
interface UserCardProps {
    name:       string;
    role:       string;
    avatarUrl?: string;    // Optional
    isOnline?:  boolean;
}

function UserCard({ name, role, avatarUrl = "/default.jpg", isOnline = false }: UserCardProps) {
    return (
        <div className={`user-card ${isOnline ? "online" : ""}`}>
            <img src={avatarUrl} alt={`${name}'s avatar`} />
            <h3>{name}</h3>
            <span>{role}</span>
            {isOnline && <div className="online-indicator" />}
        </div>
    );
}
```

### Rendering Lists

```jsx
const products = [
    { id: 1, name: "Laptop",  price: 999 },
    { id: 2, name: "Monitor", price: 399 },
    { id: 3, name: "Keyboard",price: 89  },
];

function ProductList() {
    return (
        <ul>
            {products.map(product => (
                // Always provide a unique 'key' prop when rendering lists!
                <li key={product.id}>
                    {product.name} — ${product.price}
                </li>
            ))}
        </ul>
    );
}
```

> The `key` prop is required for lists. React uses it to efficiently update only the changed items. Use a stable unique ID — never use the array index if the list can reorder.

### Conditional Rendering

```jsx
function StatusBadge({ status }) {
    // Option 1: ternary
    return (
        <span className={`badge badge--${status}`}>
            {status === "active" ? "✓ Active" : "✗ Inactive"}
        </span>
    );
}

function Dashboard({ user, isLoading, error }) {
    // Option 2: early return
    if (isLoading) return <Spinner />;
    if (error)     return <ErrorMessage message={error} />;

    return (
        <div>
            {/* Option 3: && short-circuit */}
            {user.isAdmin && <AdminPanel />}
            <UserProfile user={user} />
        </div>
    );
}
```$$,
  'reading', '30 min', 1, 30
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'react-developer' AND m.order_index = 1
AND NOT EXISTS (SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 1);

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'React Hooks: useState, useEffect',
$$## React Hooks: useState, useEffect

Hooks are functions that let functional components use state, side effects, and other React features that were previously only available in class components.

### useState — Local Component State

```tsx
import { useState } from "react";

function Counter() {
    const [count, setCount] = useState(0);   // Initial value: 0

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>+1</button>
            <button onClick={() => setCount(count - 1)}>-1</button>
            <button onClick={() => setCount(0)}>Reset</button>
        </div>
    );
}
```

### State with Objects

```tsx
interface FormData {
    name:  string;
    email: string;
    age:   number;
}

function ProfileForm() {
    const [form, setForm] = useState<FormData>({
        name:  "",
        email: "",
        age:   0,
    });

    // Update a single field without losing others (spread operator):
    const handleChange = (field: keyof FormData, value: string | number) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    return (
        <form>
            <input
                value={form.name}
                onChange={e => handleChange("name", e.target.value)}
                placeholder="Name"
            />
            <input
                type="email"
                value={form.email}
                onChange={e => handleChange("email", e.target.value)}
                placeholder="Email"
            />
        </form>
    );
}
```

### useEffect — Side Effects

useEffect runs code after the component renders. Use it for: data fetching, subscriptions, DOM manipulation, timers.

```tsx
import { useState, useEffect } from "react";

function UserProfile({ userId }: { userId: number }) {
    const [user, setUser]       = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState<string | null>(null);

    useEffect(() => {
        // This runs after every render where 'userId' changed:
        setLoading(true);
        setError(null);

        const abortController = new AbortController();

        fetch(`/api/users/${userId}`, { signal: abortController.signal })
            .then(res => {
                if (!res.ok) throw new Error("User not found");
                return res.json();
            })
            .then(data => {
                setUser(data);
                setLoading(false);
            })
            .catch(err => {
                if (err.name !== "AbortError") {   // Ignore cleanup-caused aborts
                    setError(err.message);
                    setLoading(false);
                }
            });

        // Cleanup function — runs before the next effect or when component unmounts:
        return () => abortController.abort();

    }, [userId]);   // Dependency array — re-run when userId changes

    if (loading) return <div>Loading...</div>;
    if (error)   return <div>Error: {error}</div>;
    if (!user)   return null;

    return <div>{user.name}</div>;
}
```

### useEffect Dependency Array Rules

```tsx
// Run once on mount (empty array):
useEffect(() => {
    document.title = "My App";
}, []);

// Run after EVERY render (no array — usually wrong!):
useEffect(() => {
    console.log("Rendered");
});

// Run when specific values change:
useEffect(() => {
    fetchData(userId, page);
}, [userId, page]);   // Must include all values used inside

// Cleanup example — clear a timer:
useEffect(() => {
    const interval = setInterval(() => {
        setSeconds(s => s + 1);
    }, 1000);

    return () => clearInterval(interval);   // Prevent memory leak!
}, []);
```

### Rules of Hooks

1. **Only call hooks at the top level** — never inside loops, conditionals, or nested functions.
2. **Only call hooks from React function components** (or custom hooks).

```tsx
// WRONG:
function BadComponent({ isLoggedIn }) {
    if (isLoggedIn) {
        const [data, setData] = useState(null);   // Error! Conditional hook
    }
}

// CORRECT:
function GoodComponent({ isLoggedIn }) {
    const [data, setData] = useState(null);   // Always called

    useEffect(() => {
        if (isLoggedIn) fetchData();   // Condition inside the hook
    }, [isLoggedIn]);
}
```$$,
  'reading', '35 min', 2, 35
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'react-developer' AND m.order_index = 1
AND NOT EXISTS (SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 2);

-- ============================================================
-- REACT DEVELOPER – Module 2: React Hooks (Deep)
-- ============================================================

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'useCallback, useMemo, and Performance',
$$## useCallback, useMemo, and Performance

React re-renders a component every time its state or props change. `useCallback` and `useMemo` let you skip unnecessary re-computations and prevent unwanted child re-renders.

### Why Re-renders Are Usually Fine

React is fast. Most re-renders are cheap and you should NOT optimize prematurely. Premature optimization with useCallback/useMemo everywhere makes code harder to read without any benefit.

**Only optimize when you have measured a performance problem.**

### useMemo — Cache an Expensive Calculation

```tsx
import { useMemo, useState } from "react";

function ProductSearch({ products }: { products: Product[] }) {
    const [query, setQuery]   = useState("");
    const [sort, setSort]     = useState<"price" | "name">("name");

    // Without useMemo — this runs on EVERY render, even when only sort changes:
    // const filtered = products.filter(p => p.name.includes(query)).sort(...)

    // With useMemo — only recalculate when query or sort changes:
    const filteredAndSorted = useMemo(() => {
        const filtered = products.filter(p =>
            p.name.toLowerCase().includes(query.toLowerCase())
        );
        return [...filtered].sort((a, b) =>
            sort === "price" ? a.price - b.price : a.name.localeCompare(b.name)
        );
    }, [products, query, sort]);

    return (
        <div>
            <input value={query} onChange={e => setQuery(e.target.value)} />
            <select value={sort} onChange={e => setSort(e.target.value as "price" | "name")}>
                <option value="name">Name</option>
                <option value="price">Price</option>
            </select>
            <ul>
                {filteredAndSorted.map(p => <li key={p.id}>{p.name}</li>)}
            </ul>
        </div>
    );
}
```

### useCallback — Stable Function References

When you pass a function as a prop, a new function is created on every render. This causes child components to re-render even when nothing changed.

```tsx
import { useCallback, useState, memo } from "react";

// memo() — only re-renders when props change (shallow comparison):
const ExpensiveList = memo(({ items, onDelete }: {
    items:    Item[];
    onDelete: (id: number) => void;
}) => {
    console.log("ExpensiveList rendered");   // Watch how often this runs
    return (
        <ul>
            {items.map(item => (
                <li key={item.id}>
                    {item.name}
                    <button onClick={() => onDelete(item.id)}>Delete</button>
                </li>
            ))}
        </ul>
    );
});

function Parent() {
    const [items, setItems]   = useState<Item[]>([...]);
    const [count, setCount]   = useState(0);

    // Without useCallback: new function on every render → ExpensiveList re-renders
    // With useCallback:    same function reference → ExpensiveList does NOT re-render
    const handleDelete = useCallback((id: number) => {
        setItems(prev => prev.filter(item => item.id !== id));
    }, []);   // No dependencies — function never changes

    return (
        <div>
            <button onClick={() => setCount(c => c + 1)}>
                Other state: {count}
            </button>
            {/* ExpensiveList will NOT re-render when count changes */}
            <ExpensiveList items={items} onDelete={handleDelete} />
        </div>
    );
}
```

### useRef — Mutable Ref Without Re-rendering

```tsx
import { useRef, useState, useEffect } from "react";

function StopWatch() {
    const [time, setTime]       = useState(0);
    const [running, setRunning] = useState(false);
    const intervalRef           = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (running) {
            intervalRef.current = setInterval(() => {
                setTime(t => t + 1);
            }, 100);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [running]);

    // intervalRef.current changes do NOT cause a re-render

    return (
        <div>
            <p>{(time / 10).toFixed(1)}s</p>
            <button onClick={() => setRunning(r => !r)}>
                {running ? "Stop" : "Start"}
            </button>
            <button onClick={() => { setRunning(false); setTime(0); }}>Reset</button>
        </div>
    );
}
```

### Custom Hooks — Extracting Reusable Logic

```tsx
// Extract data fetching logic into a reusable hook:
function useApi<T>(url: string) {
    const [data, setData]       = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        const controller = new AbortController();

        fetch(url, { signal: controller.signal })
            .then(res => res.json())
            .then(data => { setData(data); setLoading(false); })
            .catch(err => {
                if (err.name !== "AbortError") {
                    setError(err.message);
                    setLoading(false);
                }
            });

        return () => controller.abort();
    }, [url]);

    return { data, loading, error };
}

// Use it anywhere:
function UserPage({ id }: { id: number }) {
    const { data: user, loading, error } = useApi<User>(`/api/users/${id}`);

    if (loading) return <Spinner />;
    if (error)   return <p>Error: {error}</p>;
    return <div>{user?.name}</div>;
}
```$$,
  'reading', '35 min', 1, 35
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'react-developer' AND m.order_index = 2
AND NOT EXISTS (SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 1);

-- ============================================================
-- BACKEND DEVELOPER – Module 2: Node.js Basics
-- ============================================================

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'Node.js: The Event Loop and Non-Blocking I/O',
$$## Node.js: The Event Loop and Non-Blocking I/O

Node.js is a JavaScript runtime built on Chrome''s V8 engine. Its killer feature is non-blocking I/O — it can handle thousands of concurrent connections without creating a thread per connection.

### How Node.js Works

Traditional servers (Apache, Tomcat) create a thread per request. Threads are expensive — 1000 threads = ~1GB RAM. Node.js uses a single thread with an event loop. I/O operations are handed off to the OS and JavaScript continues executing.

```
┌──────────────────────────────────────────────────┐
│                   Node.js Process                 │
│                                                   │
│   User Code    →   Event Loop    →   V8 Engine   │
│                        ↕                          │
│                   libuv Thread Pool               │
│               (file I/O, DNS, crypto)             │
│                        ↕                          │
│                  OS Network I/O                   │
│             (TCP/UDP — truly async via OS)        │
└──────────────────────────────────────────────────┘
```

### Streams — Handling Large Data Efficiently

```javascript
const fs   = require("fs");
const path = require("path");

// BAD — loads entire file into memory:
const content = fs.readFileSync("huge-file.csv");   // Blocks! And uses lots of RAM

// GOOD — stream it:
const readable = fs.createReadStream("huge-file.csv", { encoding: "utf8" });

readable.on("data", chunk => {
    // Process each chunk as it arrives
    console.log(`Received ${chunk.length} bytes`);
});

readable.on("end", () => {
    console.log("Finished reading file");
});

readable.on("error", err => {
    console.error("Stream error:", err.message);
});

// Pipe — connect readable to writable:
const input  = fs.createReadStream("input.txt");
const output = fs.createWriteStream("output.txt");
input.pipe(output);   // Efficiently copies without loading all into memory
```

### The `fs` Module — File System Operations

```javascript
const fs = require("fs/promises");   // Promise-based API (Node 14+)

// Read a file:
const content = await fs.readFile("config.json", "utf8");
const config  = JSON.parse(content);

// Write a file:
await fs.writeFile("output.txt", "Hello, World!");

// Append to a file:
await fs.appendFile("log.txt", `[${new Date().toISOString()}] Event occurred\n`);

// Read a directory:
const files = await fs.readdir("./src");
console.log(files);   // ["app.js", "utils.js", ...]

// Check if file/dir exists:
try {
    await fs.access("./config.json");
    console.log("File exists");
} catch {
    console.log("File does not exist");
}

// Create a directory (recursively):
await fs.mkdir("./logs/2024/01", { recursive: true });

// Get file stats:
const stats = await fs.stat("./app.js");
console.log(stats.size, stats.mtime);
```

### HTTP Module — Building a Basic Server

```javascript
const http = require("http");

const server = http.createServer((req, res) => {
    const { method, url } = req;

    // Parse URL:
    const urlObj   = new URL(url, `http://${req.headers.host}`);
    const pathname = urlObj.pathname;

    if (method === "GET" && pathname === "/") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Hello, World!" }));

    } else if (method === "GET" && pathname === "/health") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "ok", uptime: process.uptime() }));

    } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Not Found" }));
    }
});

server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});

// Graceful shutdown:
process.on("SIGTERM", () => {
    console.log("Shutting down gracefully...");
    server.close(() => {
        console.log("Server closed");
        process.exit(0);
    });
});
```

### Environment Variables and Config

```javascript
// .env file (never commit this to git!):
// DATABASE_URL=postgres://localhost:5432/myapp
// JWT_SECRET=a-very-long-secret-key
// PORT=3000

// Load with dotenv:
require("dotenv").config();

const config = {
    port:        parseInt(process.env.PORT || "3000"),
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret:   process.env.JWT_SECRET,
    nodeEnv:     process.env.NODE_ENV || "development",
};

// Validate required variables:
const required = ["DATABASE_URL", "JWT_SECRET"];
for (const key of required) {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
}
```$$,
  'reading', '35 min', 1, 35
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'backend-developer' AND m.order_index = 2
AND NOT EXISTS (SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 1);

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'Express.js: Building REST APIs',
$$## Express.js: Building REST APIs

Express is the most popular Node.js web framework. It adds routing, middleware, and request/response helpers on top of Node''s HTTP module.

### Setup

```bash
npm install express
npm install -D @types/express typescript ts-node
```

### Your First Express Server

```typescript
import express, { Request, Response, NextFunction } from "express";

const app  = express();
const PORT = process.env.PORT || 3000;

// Built-in middleware:
app.use(express.json());           // Parse JSON request bodies
app.use(express.urlencoded({ extended: true }));  // Parse form data

// A simple route:
app.get("/", (req: Request, res: Response) => {
    res.json({ message: "API is running!" });
});

// Start the server:
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
```

### RESTful Routes for a Resource

```typescript
// Users resource following REST conventions:
const users: User[] = [];

// GET    /users       — list all users
app.get("/users", async (req, res) => {
    const { role, search, page = "1", limit = "20" } = req.query;

    let result = users;
    if (role)   result = result.filter(u => u.role === role);
    if (search) result = result.filter(u => u.name.includes(search as string));

    // Pagination:
    const pageNum   = parseInt(page as string);
    const limitNum  = parseInt(limit as string);
    const paginated = result.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    res.json({
        data:  paginated,
        total: result.length,
        page:  pageNum,
        pages: Math.ceil(result.length / limitNum),
    });
});

// GET    /users/:id   — get one user
app.get("/users/:id", (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
});

// POST   /users       — create a user
app.post("/users", (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: "name and email are required" });
    }

    const newUser: User = { id: users.length + 1, name, email };
    users.push(newUser);
    res.status(201).json(newUser);
});

// PATCH  /users/:id   — update a user
app.patch("/users/:id", (req, res) => {
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: "User not found" });

    users[index] = { ...users[index], ...req.body };
    res.json(users[index]);
});

// DELETE /users/:id   — delete a user
app.delete("/users/:id", (req, res) => {
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: "User not found" });

    users.splice(index, 1);
    res.status(204).send();
});
```

### Middleware

Middleware functions run before your route handlers. They can modify the request, respond early, or pass control to the next middleware.

```typescript
// Request logger middleware:
function requestLogger(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    res.on("finish", () => {
        console.log(`${req.method} ${req.path} ${res.statusCode} ${Date.now() - start}ms`);
    });
    next();   // MUST call next() or the request hangs!
}

// Auth middleware:
function requireAuth(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Authentication required" });

    try {
        const payload = verifyJwt(token);
        req.user = payload;   // Attach to request
        next();
    } catch {
        res.status(401).json({ error: "Invalid token" });
    }
}

// Apply globally:
app.use(requestLogger);

// Apply to specific routes:
app.get("/profile", requireAuth, (req, res) => {
    res.json(req.user);
});
```

### Error Handling

```typescript
// 404 handler — must be after all routes:
app.use((req, res) => {
    res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// Global error handler — 4 parameters!
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        error: process.env.NODE_ENV === "production" ? "Internal Server Error" : err.message
    });
});

// Throw errors from route handlers:
app.get("/crash", (req, res, next) => {
    next(new Error("Something went wrong"));   // Caught by global handler
});
```$$,
  'reading', '40 min', 2, 40
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'backend-developer' AND m.order_index = 3
AND NOT EXISTS (SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 2);

-- ============================================================
-- SQL DATABASES – Module 1: SQL Basics
-- ============================================================

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'SELECT: Retrieving Data from a Database',
$$## SELECT: Retrieving Data from a Database

The `SELECT` statement retrieves data from one or more tables. It is the most important SQL command.

### Basic SELECT

```sql
-- Select all columns:
SELECT * FROM users;

-- Select specific columns:
SELECT first_name, last_name, email FROM users;

-- Alias column names:
SELECT
    first_name AS "First Name",
    last_name  AS "Last Name",
    email      AS "Email Address"
FROM users;
```

### WHERE — Filtering Rows

```sql
-- Equality:
SELECT * FROM users WHERE role = 'admin';

-- Comparison operators:
SELECT * FROM products WHERE price > 100;
SELECT * FROM products WHERE price BETWEEN 50 AND 200;

-- Multiple conditions:
SELECT * FROM orders
WHERE status = 'pending'
  AND created_at > NOW() - INTERVAL '7 days';

-- OR conditions:
SELECT * FROM users
WHERE role = 'admin'
   OR role = 'moderator';

-- IN — match multiple values:
SELECT * FROM products
WHERE category IN ('electronics', 'computers', 'phones');

-- NOT IN:
SELECT * FROM users
WHERE status NOT IN ('banned', 'suspended');

-- NULL checks:
SELECT * FROM users WHERE avatar_url IS NULL;
SELECT * FROM users WHERE avatar_url IS NOT NULL;
```

### LIKE — Pattern Matching

```sql
-- % matches any sequence of characters:
SELECT * FROM users WHERE email LIKE '%@gmail.com';

-- _ matches exactly one character:
SELECT * FROM users WHERE username LIKE 'a__';   -- Starts with 'a', exactly 3 chars

-- ILIKE — case-insensitive (PostgreSQL):
SELECT * FROM products WHERE name ILIKE '%laptop%';
```

### ORDER BY — Sorting Results

```sql
-- Ascending (default):
SELECT * FROM products ORDER BY price;

-- Descending:
SELECT * FROM products ORDER BY price DESC;

-- Multiple columns:
SELECT * FROM users ORDER BY last_name ASC, first_name ASC;

-- Sort by expression:
SELECT * FROM orders ORDER BY total_amount * quantity DESC;
```

### LIMIT and OFFSET — Pagination

```sql
-- First 10 rows:
SELECT * FROM products LIMIT 10;

-- Page 3 (rows 21-30):
SELECT * FROM products
ORDER BY created_at DESC
LIMIT 10 OFFSET 20;

-- PostgreSQL also supports:
SELECT * FROM products
ORDER BY id
FETCH FIRST 10 ROWS ONLY;
```

### DISTINCT — Unique Values

```sql
-- Get unique roles:
SELECT DISTINCT role FROM users;

-- Count unique values:
SELECT COUNT(DISTINCT user_id) FROM orders;
```

### Aggregate Functions

```sql
SELECT
    COUNT(*)                              AS total_orders,
    COUNT(DISTINCT user_id)               AS unique_customers,
    SUM(total_amount)                     AS revenue,
    AVG(total_amount)                     AS avg_order_value,
    MIN(total_amount)                     AS smallest_order,
    MAX(total_amount)                     AS largest_order,
    ROUND(AVG(total_amount), 2)           AS avg_rounded
FROM orders
WHERE status = 'completed'
  AND created_at >= DATE_TRUNC('month', NOW());
```

### GROUP BY — Aggregate by Category

```sql
-- Sales by category:
SELECT
    category,
    COUNT(*)                    AS product_count,
    ROUND(AVG(price), 2)       AS avg_price,
    SUM(stock_quantity)         AS total_stock
FROM products
GROUP BY category
ORDER BY product_count DESC;

-- HAVING — filter groups (like WHERE but for aggregated results):
SELECT
    user_id,
    COUNT(*)    AS order_count,
    SUM(total)  AS lifetime_value
FROM orders
GROUP BY user_id
HAVING SUM(total) > 500   -- Only customers who spent more than $500
ORDER BY lifetime_value DESC;
```$$,
  'reading', '35 min', 1, 35
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'sql-databases' AND m.order_index = 1
AND NOT EXISTS (SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 1);

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'INSERT, UPDATE, DELETE: Modifying Data',
$BODY$## INSERT, UPDATE, DELETE: Modifying Data

These three statements allow you to add, change, and remove data. Always use transactions for multi-step changes.

### INSERT — Adding Rows

```sql
-- Insert a single row:
INSERT INTO users (first_name, last_name, email, role)
VALUES ('Alice', 'Smith', 'alice@example.com', 'user');

-- Insert multiple rows at once:
INSERT INTO products (name, price, category, stock)
VALUES
    ('Laptop Pro',   1299.99, 'computers',   50),
    ('Wireless Mouse', 29.99, 'accessories', 200),
    ('USB-C Hub',      49.99, 'accessories', 150);

-- Insert and return the new row:
INSERT INTO users (email, role)
VALUES ('bob@example.com', 'admin')
RETURNING id, email, created_at;

-- Insert or ignore duplicate:
INSERT INTO user_preferences (user_id, theme)
VALUES (42, 'dark')
ON CONFLICT (user_id) DO NOTHING;

-- Insert or update (upsert):
INSERT INTO user_preferences (user_id, theme)
VALUES (42, 'light')
ON CONFLICT (user_id)
DO UPDATE SET theme = EXCLUDED.theme, updated_at = NOW();
```

### UPDATE — Modifying Existing Rows

```sql
-- Update specific rows:
UPDATE users
SET role = 'admin', updated_at = NOW()
WHERE email = 'alice@example.com';

-- Update based on a calculation:
UPDATE products
SET price       = price * 0.9,   -- 10% discount
    updated_at  = NOW()
WHERE category = 'electronics'
  AND stock > 100;

-- Update with a subquery:
UPDATE orders
SET status = 'expired'
WHERE status = 'pending'
  AND created_at < NOW() - INTERVAL '30 days';

-- Update and return the changed rows:
UPDATE users
SET is_active = false
WHERE last_login < NOW() - INTERVAL '1 year'
RETURNING id, email;
```

### DELETE — Removing Rows

```sql
-- Delete specific rows:
DELETE FROM sessions
WHERE expires_at < NOW();

-- Delete and return deleted rows:
DELETE FROM users
WHERE id = 42
RETURNING *;

-- Delete all rows (but keep table):
DELETE FROM temporary_data;

-- TRUNCATE (faster for large tables, not transactional):
TRUNCATE TABLE temporary_data RESTART IDENTITY;
```

### Transactions — Atomic Multi-Step Operations

```sql
-- All steps succeed, or all are rolled back:
BEGIN;

    -- Transfer $100 from account 1 to account 2:
    UPDATE accounts
    SET balance = balance - 100
    WHERE id = 1 AND balance >= 100;   -- Deduct from sender

    -- Check that we actually updated a row:
    -- If the sender had < $100, no row was updated

    UPDATE accounts
    SET balance = balance + 100
    WHERE id = 2;                      -- Add to recipient

    -- Record the transaction:
    INSERT INTO transactions (from_id, to_id, amount, created_at)
    VALUES (1, 2, 100, NOW());

COMMIT;
-- If any step fails, use ROLLBACK instead of COMMIT

-- With error handling (in a function or procedural code):
DO $$
BEGIN
    -- ... operations ...
    COMMIT;
EXCEPTION WHEN OTHERS THEN
    ROLLBACK;
    RAISE;
END $$;
```

### Constraints — Enforcing Data Integrity at the DB Level

```sql
CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    email       TEXT NOT NULL UNIQUE,
    username    TEXT NOT NULL CHECK (length(username) >= 3),
    age         INT  CHECK (age >= 0 AND age <= 150),
    role        TEXT NOT NULL DEFAULT 'user'
                     CHECK (role IN ('user', 'admin', 'moderator')),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at  TIMESTAMPTZ   -- NULL means not deleted
);

-- Foreign key — ensures referenced rows exist:
CREATE TABLE posts (
    id       SERIAL PRIMARY KEY,
    user_id  INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title    TEXT NOT NULL,
    body     TEXT NOT NULL
);
-- ON DELETE CASCADE — when user is deleted, their posts are too
-- ON DELETE SET NULL — set user_id to NULL when user is deleted
-- ON DELETE RESTRICT — prevent deleting user if they have posts
```$BODY$,
  'reading', '35 min', 2, 35
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'sql-databases' AND m.order_index = 1
AND NOT EXISTS (SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 2);

-- ============================================================
-- DSA – Module 1: Arrays & Strings
-- ============================================================

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'Two Pointers Pattern',
$$## Two Pointers Pattern

The two-pointer technique uses two indices that traverse a data structure — usually from different ends or at different speeds. It reduces O(n²) brute-force solutions to O(n).

### When to Use Two Pointers

- Finding a pair in a sorted array that sums to a target
- Palindrome checking
- Removing duplicates from a sorted array
- Comparing two arrays/strings

### Pattern 1: Converging Pointers (sorted array)

```python
def two_sum_sorted(numbers, target):
    """
    Given a sorted array, find two numbers that sum to target.
    Returns their 1-based indices.

    Time:  O(n)
    Space: O(1)
    """
    left  = 0
    right = len(numbers) - 1

    while left < right:
        current_sum = numbers[left] + numbers[right]

        if current_sum == target:
            return [left + 1, right + 1]   # 1-indexed
        elif current_sum < target:
            left += 1     # Need a larger sum — move left pointer right
        else:
            right -= 1    # Need a smaller sum — move right pointer left

    return []   # No solution found

# Test:
print(two_sum_sorted([2, 7, 11, 15], 9))   # [1, 2]
print(two_sum_sorted([1, 2, 4, 7], 9))     # [2, 4]
```

### Pattern 2: Palindrome Check

```python
def is_palindrome(s):
    """
    Check if string s is a palindrome, considering only alphanumeric chars.

    Time:  O(n)
    Space: O(1)
    """
    left  = 0
    right = len(s) - 1

    while left < right:
        # Skip non-alphanumeric characters:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1

        if s[left].lower() != s[right].lower():
            return False

        left  += 1
        right -= 1

    return True

# Tests:
print(is_palindrome("A man, a plan, a canal: Panama"))   # True
print(is_palindrome("race a car"))                        # False
print(is_palindrome(""))                                  # True
```

### Pattern 3: Remove Duplicates (Sorted Array In-Place)

```python
def remove_duplicates(nums):
    """
    Remove duplicates in-place from sorted array.
    Returns the count of unique elements.

    Time:  O(n)
    Space: O(1)
    """
    if not nums:
        return 0

    write = 1   # Next position to write a unique value

    for read in range(1, len(nums)):
        if nums[read] != nums[read - 1]:   # Found a new unique value
            nums[write] = nums[read]
            write += 1

    return write   # Length of unique portion

# Test:
nums = [1, 1, 2, 3, 3, 3, 4, 5, 5]
k = remove_duplicates(nums)
print(nums[:k])   # [1, 2, 3, 4, 5]
```

### Pattern 4: Container With Most Water (Classic Interview)

```python
def max_area(heights):
    """
    Given heights of walls, find the container that holds the most water.
    LeetCode 11 — Classic two-pointer problem.

    Time:  O(n)
    Space: O(1)
    """
    left  = 0
    right = len(heights) - 1
    max_water = 0

    while left < right:
        width    = right - left
        height   = min(heights[left], heights[right])
        water    = width * height
        max_water = max(max_water, water)

        # Move the shorter wall inward (the taller one can only help if paired differently):
        if heights[left] < heights[right]:
            left  += 1
        else:
            right -= 1

    return max_water

# Test:
print(max_area([1, 8, 6, 2, 5, 4, 8, 3, 7]))   # 49
print(max_area([1, 1]))                           # 1
```

### Complexity Analysis

Two pointers is powerful because:
- Each pointer traverses the array at most once
- Total iterations ≤ n (linear)
- No extra space needed (O(1) space)

This converts brute-force O(n²) solutions (checking every pair) into O(n).$$,
  'reading', '40 min', 1, 40
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'dsa' AND m.order_index = 1
AND NOT EXISTS (SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 1);

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'Sliding Window Pattern',
$$## Sliding Window Pattern

The sliding window technique maintains a window (subarray or substring) that expands and shrinks to find an optimal result. It converts O(n²) nested loop solutions to O(n).

### When to Use Sliding Window

- Longest/shortest subarray with some property
- Maximum sum subarray of size k
- Longest substring with k distinct characters
- Any "contiguous subarray" problem

### Pattern 1: Fixed-Size Window

```python
def max_sum_subarray(nums, k):
    """
    Find maximum sum of any subarray of length k.

    Time:  O(n)
    Space: O(1)

    Brute force: O(n*k) — compute sum of every window
    """
    if len(nums) < k:
        return None

    # Build the first window:
    window_sum = sum(nums[:k])
    max_sum    = window_sum

    # Slide: add next element, remove first element
    for i in range(k, len(nums)):
        window_sum += nums[i]         # Add incoming element
        window_sum -= nums[i - k]     # Remove outgoing element
        max_sum     = max(max_sum, window_sum)

    return max_sum

# Test:
print(max_sum_subarray([1, 4, 2, 9, 7, 3, 8], 3))   # 18 (subarray [9, 7, 2]... wait: 9+7+3=19? Let me recalc: [9,7,3]=19 or [7,3,8]=18)
# Actually: max is [9,7,3]=19
print(max_sum_subarray([2, 1, 5, 1, 3, 2], 3))       # 9 (subarray [5,1,3])
```

### Pattern 2: Dynamic-Size Window

```python
def smallest_subarray_with_sum(nums, target):
    """
    Find length of smallest contiguous subarray with sum >= target.

    Time:  O(n) — each element added/removed at most once
    Space: O(1)
    """
    left       = 0
    total      = 0
    min_length = float("inf")

    for right in range(len(nums)):
        total += nums[right]   # Expand window

        # Shrink from left while condition is met:
        while total >= target:
            min_length = min(min_length, right - left + 1)
            total     -= nums[left]
            left      += 1

    return min_length if min_length != float("inf") else 0

# Test:
print(smallest_subarray_with_sum([2, 3, 1, 2, 4, 3], 7))   # 2 (subarray [4, 3])
print(smallest_subarray_with_sum([1, 4, 4], 4))              # 1
```

### Pattern 3: Longest Substring Without Repeating Characters

```python
def length_of_longest_substring(s):
    """
    Find length of longest substring with no repeating characters.
    LeetCode 3 — Very common in interviews.

    Time:  O(n)
    Space: O(min(n, alphabet_size))
    """
    char_index = {}   # Maps character → last seen index
    left       = 0
    max_length = 0

    for right, char in enumerate(s):
        # If char is in current window, shrink from left:
        if char in char_index and char_index[char] >= left:
            left = char_index[char] + 1   # Move left past the duplicate

        char_index[char] = right           # Update last seen index
        max_length = max(max_length, right - left + 1)

    return max_length

# Tests:
print(length_of_longest_substring("abcabcbb"))   # 3 ("abc")
print(length_of_longest_substring("bbbbb"))      # 1 ("b")
print(length_of_longest_substring("pwwkew"))     # 3 ("wke")
print(length_of_longest_substring(""))           # 0
```

### Pattern 4: Minimum Window Substring

```python
from collections import Counter

def min_window(s, t):
    """
    Find the smallest window in s that contains all chars of t.
    LeetCode 76 — Hard, but common in interviews.

    Time:  O(|s| + |t|)
    Space: O(|t|)
    """
    if not t or not s:
        return ""

    need    = Counter(t)    # Characters we need
    have    = {}            # Characters we currently have in window
    formed  = 0             # How many unique chars in t are satisfied
    required = len(need)

    left       = 0
    min_len    = float("inf")
    min_window = ("", 0, 0)   # (window string, left, right)

    for right, char in enumerate(s):
        have[char] = have.get(char, 0) + 1

        # Did this char satisfy a requirement?
        if char in need and have[char] == need[char]:
            formed += 1

        # Shrink window while all requirements are met:
        while formed == required:
            window_size = right - left + 1
            if window_size < min_len:
                min_len    = window_size
                min_window = (s[left:right+1], left, right)

            # Remove leftmost char:
            left_char = s[left]
            have[left_char] -= 1
            if left_char in need and have[left_char] < need[left_char]:
                formed -= 1
            left += 1

    return min_window[0]

# Tests:
print(min_window("ADOBECODEBANC", "ABC"))   # "BANC"
print(min_window("a", "a"))                  # "a"
print(min_window("a", "aa"))                 # ""
```$$,
  'reading', '40 min', 2, 40
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'dsa' AND m.order_index = 1
AND NOT EXISTS (SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 2);

-- ============================================================
-- DSA – Module 4: Trees & Graphs
-- ============================================================

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'Binary Trees: BFS and DFS Traversals',
$$## Binary Trees: BFS and DFS Traversals

Tree traversal — visiting every node in a defined order — is the foundation of almost all tree problems in interviews.

### Binary Tree Structure

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val   = val
        self.left  = left
        self.right = right

# Build a test tree:
#       1
#      / \
#     2   3
#    / \   \
#   4   5   6

root = TreeNode(1)
root.left        = TreeNode(2)
root.right       = TreeNode(3)
root.left.left   = TreeNode(4)
root.left.right  = TreeNode(5)
root.right.right = TreeNode(6)
```

### DFS — Depth-First Search (Recursive)

DFS goes deep before going wide. Three orderings:

```python
def inorder(node):
    """Left → Root → Right — gives SORTED order for BST"""
    if not node:
        return []
    return inorder(node.left) + [node.val] + inorder(node.right)

def preorder(node):
    """Root → Left → Right — useful for copying/serializing a tree"""
    if not node:
        return []
    return [node.val] + preorder(node.left) + preorder(node.right)

def postorder(node):
    """Left → Right → Root — useful for deleting a tree"""
    if not node:
        return []
    return postorder(node.left) + postorder(node.right) + [node.val]

print(inorder(root))    # [4, 2, 5, 1, 3, 6]
print(preorder(root))   # [1, 2, 4, 5, 3, 6]
print(postorder(root))  # [4, 5, 2, 6, 3, 1]
```

### BFS — Breadth-First Search (Level Order)

BFS visits nodes level by level using a queue:

```python
from collections import deque

def level_order(root):
    """
    Return all node values level by level.
    Time:  O(n)
    Space: O(n) — queue holds at most one level at a time
    """
    if not root:
        return []

    result = []
    queue  = deque([root])

    while queue:
        level_size = len(queue)
        level      = []

        for _ in range(level_size):
            node = queue.popleft()
            level.append(node.val)

            if node.left:  queue.append(node.left)
            if node.right: queue.append(node.right)

        result.append(level)

    return result

print(level_order(root))
# [[1], [2, 3], [4, 5, 6]]
```

### Maximum Depth

```python
def max_depth(root):
    """
    Height of the tree.
    Time: O(n), Space: O(h) where h is height (O(n) worst case for skewed tree)
    """
    if not root:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))

print(max_depth(root))   # 3
```

### Check if a Binary Tree is Balanced

```python
def is_balanced(root):
    """
    A tree is balanced if the height difference between left and right subtrees
    is at most 1 for every node.

    Returns False early (O(n) instead of O(n log n)).
    """
    def height(node):
        if not node:
            return 0

        left_h  = height(node.left)
        right_h = height(node.right)

        # Propagate -1 (unbalanced signal) upward:
        if left_h == -1 or right_h == -1:
            return -1
        if abs(left_h - right_h) > 1:
            return -1

        return 1 + max(left_h, right_h)

    return height(root) != -1
```

### Lowest Common Ancestor (LCA)

```python
def lowest_common_ancestor(root, p, q):
    """
    Find the LCA of nodes p and q in a binary tree.
    LeetCode 236 — Classic interview problem.

    Key insight: if both p and q are in different subtrees,
    the current node is the LCA.
    """
    if not root or root == p or root == q:
        return root

    left  = lowest_common_ancestor(root.left, p, q)
    right = lowest_common_ancestor(root.right, p, q)

    # If both sides found something, current node is LCA:
    if left and right:
        return root

    return left if left else right
```$$,
  'reading', '40 min', 1, 40
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'dsa' AND m.order_index = 4
AND NOT EXISTS (SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 1);

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'Graph Traversal: BFS and DFS on Graphs',
$$## Graph Traversal: BFS and DFS on Graphs

Graphs are the most general data structure. Trees are a special case of graphs (connected, acyclic, directed). Many real problems — social networks, routes, dependencies — are graph problems.

### Graph Representation

```python
# Adjacency list — most common for sparse graphs:
graph = {
    "A": ["B", "C"],
    "B": ["A", "D", "E"],
    "C": ["A", "F"],
    "D": ["B"],
    "E": ["B", "F"],
    "F": ["C", "E"],
}

# Adjacency matrix — for dense graphs (O(n²) space):
# matrix[i][j] = 1 if edge from i to j

# Edge list:
edges = [("A", "B"), ("A", "C"), ("B", "D"), ("B", "E"), ("C", "F"), ("E", "F")]
```

### DFS on a Graph

```python
def dfs(graph, start, visited=None):
    """
    Depth-first traversal.
    Time:  O(V + E) where V = vertices, E = edges
    Space: O(V) for the visited set and recursion stack
    """
    if visited is None:
        visited = set()

    visited.add(start)
    print(start, end=" ")

    for neighbor in graph[start]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)

    return visited

# Iterative DFS (avoids recursion limit for large graphs):
def dfs_iterative(graph, start):
    visited = set()
    stack   = [start]
    order   = []

    while stack:
        node = stack.pop()
        if node not in visited:
            visited.add(node)
            order.append(node)
            # Add neighbors in reverse so we process left-to-right:
            stack.extend(reversed(graph.get(node, [])))

    return order
```

### BFS on a Graph

```python
from collections import deque

def bfs(graph, start):
    """
    Breadth-first traversal — finds shortest path in unweighted graph.
    Time:  O(V + E)
    Space: O(V)
    """
    visited = {start}
    queue   = deque([start])
    order   = []

    while queue:
        node = queue.popleft()
        order.append(node)

        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

    return order

def shortest_path(graph, start, end):
    """Find the shortest path between two nodes."""
    if start == end:
        return [start]

    visited = {start}
    queue   = deque([(start, [start])])   # (current node, path so far)

    while queue:
        node, path = queue.popleft()

        for neighbor in graph[node]:
            if neighbor == end:
                return path + [neighbor]
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, path + [neighbor]))

    return []   # No path found

print(shortest_path(graph, "A", "F"))   # ['A', 'C', 'F']
```

### Number of Islands (Classic Grid BFS/DFS)

```python
def num_islands(grid):
    """
    Count the number of islands in a 2D grid.
    '1' = land, '0' = water.
    LeetCode 200 — One of the most common interview questions.

    Time:  O(m * n)
    Space: O(m * n) in worst case for the recursion/queue
    """
    if not grid:
        return 0

    rows    = len(grid)
    cols    = len(grid[0])
    islands = 0

    def dfs(r, c):
        # Out of bounds or water — stop:
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != "1":
            return

        grid[r][c] = "0"   # Mark as visited (sink the land)
        dfs(r + 1, c)      # Down
        dfs(r - 1, c)      # Up
        dfs(r, c + 1)      # Right
        dfs(r, c - 1)      # Left

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1":
                dfs(r, c)        # Sink the entire island
                islands += 1     # Count one island found

    return islands

# Test:
grid = [
    ["1","1","1","1","0"],
    ["1","1","0","1","0"],
    ["1","1","0","0","0"],
    ["0","0","0","0","0"],
]
print(num_islands(grid))   # 1
```

### Detecting Cycles in a Graph

```python
def has_cycle_undirected(graph):
    """Detect a cycle in an undirected graph using DFS."""
    visited = set()

    def dfs(node, parent):
        visited.add(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                if dfs(neighbor, node):
                    return True
            elif neighbor != parent:    # Found a back edge (cycle!)
                return True
        return False

    for node in graph:
        if node not in visited:
            if dfs(node, None):
                return True
    return False
```$$,
  'reading', '40 min', 2, 40
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'dsa' AND m.order_index = 4
AND NOT EXISTS (SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 2);

-- ============================================================
-- DSA – Module 7: Dynamic Programming
-- ============================================================

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'Dynamic Programming: Memoization and Tabulation',
$$## Dynamic Programming: Memoization and Tabulation

Dynamic programming (DP) solves problems by breaking them into overlapping subproblems and storing results so each subproblem is solved only once. It turns exponential solutions into polynomial ones.

### When to Use DP

A problem is a DP candidate when it has:
1. **Optimal substructure** — the optimal solution can be built from optimal solutions to subproblems
2. **Overlapping subproblems** — the same subproblems are solved multiple times

Common patterns: counting ways, minimum/maximum cost, decision problems (can we achieve X?).

### Top-Down (Memoization): Fibonacci

```python
# Naive recursion — O(2^n):
def fib_naive(n):
    if n <= 1: return n
    return fib_naive(n-1) + fib_naive(n-2)
# fib(40) makes 2^40 = 1 trillion calls!

# Memoization — cache results of subproblems:
def fib_memo(n, memo={}):
    if n in memo: return memo[n]
    if n <= 1: return n

    memo[n] = fib_memo(n-1, memo) + fib_memo(n-2, memo)
    return memo[n]
# fib(100) now runs instantly — O(n) time, O(n) space

# Using functools.lru_cache (Python shortcut):
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n <= 1: return n
    return fib(n-1) + fib(n-2)
```

### Bottom-Up (Tabulation): Fibonacci

```python
def fib_dp(n):
    """
    Build solution from the ground up, no recursion needed.
    Time: O(n), Space: O(1) — we only need the last 2 values
    """
    if n <= 1:
        return n

    prev2, prev1 = 0, 1
    for _ in range(2, n + 1):
        curr  = prev1 + prev2
        prev2 = prev1
        prev1 = curr

    return prev1

print(fib_dp(10))   # 55
```

### Coin Change (Classic DP)

```python
def coin_change(coins, amount):
    """
    Find the minimum number of coins to make 'amount'.
    Returns -1 if impossible.
    LeetCode 322 — Very common interview problem.

    State: dp[i] = minimum coins needed to make amount i
    Transition: dp[i] = min(dp[i - coin] + 1) for each coin

    Time:  O(amount * num_coins)
    Space: O(amount)
    """
    # Initialize with infinity (impossible state):
    dp = [float("inf")] * (amount + 1)
    dp[0] = 0   # Base case: 0 coins to make amount 0

    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i:
                dp[i] = min(dp[i], dp[i - coin] + 1)

    return dp[amount] if dp[amount] != float("inf") else -1

# Tests:
print(coin_change([1, 5, 10, 25], 36))   # 3 (25 + 10 + 1)
print(coin_change([2], 3))               # -1 (impossible)
print(coin_change([1, 2, 5], 11))        # 3 (5 + 5 + 1)
```

### 0/1 Knapsack

```python
def knapsack(weights, values, capacity):
    """
    0/1 Knapsack: select items to maximize value, subject to weight limit.
    Each item can be taken at most once.

    State: dp[i][w] = max value using first i items with capacity w
    """
    n  = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for w in range(capacity + 1):
            # Don't take item i:
            dp[i][w] = dp[i-1][w]

            # Take item i (if it fits):
            if weights[i-1] <= w:
                dp[i][w] = max(dp[i][w], values[i-1] + dp[i-1][w - weights[i-1]])

    return dp[n][capacity]

weights = [1, 3, 4, 5]
values  = [1, 4, 5, 7]
print(knapsack(weights, values, 7))   # 9 (items 2 and 3: 4+5=9 with weight 3+4=7)
```

### Longest Common Subsequence

```python
def lcs(s1, s2):
    """
    Find the length of the longest common subsequence of s1 and s2.
    (Characters don't need to be contiguous)

    State: dp[i][j] = LCS of s1[:i] and s2[:j]
    Time: O(m*n), Space: O(m*n)
    """
    m, n = len(s1), len(s2)
    dp   = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = 1 + dp[i-1][j-1]
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])

    return dp[m][n]

print(lcs("abcde", "ace"))    # 3 (a, c, e)
print(lcs("abc", "abc"))      # 3
print(lcs("abc", "def"))      # 0
```$$,
  'reading', '45 min', 1, 45
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'dsa' AND m.order_index = 7
AND NOT EXISTS (SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 1);
