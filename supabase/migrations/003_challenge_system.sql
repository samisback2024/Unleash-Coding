-- ============================================================
-- Unleash Coding – Phase 5: Challenge System
-- Run this in the Supabase SQL Editor
-- ============================================================

-- ── Extend challenges table ────────────────────────────────────────────────
alter table public.challenges
  add column if not exists challenge_type      text        not null default 'multiple_choice',
  add column if not exists starter_code        text        not null default '',
  add column if not exists expected_answer     text        not null default '',
  add column if not exists options             jsonb       not null default '[]',
  add column if not exists hints               jsonb       not null default '[]',
  add column if not exists solution_explanation text       not null default '',
  add column if not exists xp_reward           int         not null default 25;

-- Back-fill xp_reward from existing xp column for any existing rows
update public.challenges set xp_reward = xp where xp_reward = 25 and xp != 50;

-- ── challenge_attempts ────────────────────────────────────────────────────
create table if not exists public.challenge_attempts (
  id               uuid        primary key default gen_random_uuid(),
  user_id          uuid        not null references auth.users(id) on delete cascade,
  challenge_id     uuid        not null references public.challenges(id) on delete cascade,
  submitted_answer text        not null default '',
  is_correct       boolean     not null default false,
  xp_awarded       int         not null default 0,
  completed_at     timestamptz,
  created_at       timestamptz not null default now()
);

-- ── Indexes ────────────────────────────────────────────────────────────────
create index if not exists challenge_attempts_user_idx      on public.challenge_attempts(user_id);
create index if not exists challenge_attempts_challenge_idx on public.challenge_attempts(challenge_id);
create index if not exists challenge_attempts_user_ch_idx   on public.challenge_attempts(user_id, challenge_id);

-- ── RLS ────────────────────────────────────────────────────────────────────
alter table public.challenge_attempts enable row level security;

create policy "Users can read own attempts"
  on public.challenge_attempts for select using (auth.uid() = user_id);

create policy "Users can insert own attempts"
  on public.challenge_attempts for insert with check (auth.uid() = user_id);

create policy "Users can update own attempts"
  on public.challenge_attempts for update using (auth.uid() = user_id);

-- ── Seed 15 challenges (5 per path) ───────────────────────────────────────
-- Delete placeholder rows (empty expected_answer) to re-seed cleanly
delete from public.challenges where expected_answer = '';

do $$
declare
  python_path_id   uuid;
  js_path_id       uuid;
  sql_path_id      uuid;
begin
  select id into python_path_id from public.learning_paths where slug = 'python-developer' limit 1;
  select id into js_path_id     from public.learning_paths where slug = 'javascript-developer' limit 1;
  select id into sql_path_id    from public.learning_paths where slug = 'sql-mastery' limit 1;

  -- ── Python Developer: 5 challenges ───────────────────────────────────────
  if python_path_id is not null then
    -- 1. Variables
    insert into public.challenges
      (path_id, title, description, difficulty, challenge_type, instructions,
       options, expected_answer, hints, solution_explanation, xp, xp_reward, order_index)
    values (
      python_path_id,
      'Variable Detective',
      'Predict the output of a Python variable assignment.',
      'beginner',
      'multiple_choice',
      'What is the output of the following Python code?

```python
x = 10
y = 3
print(x // y)
```',
      '["1", "3", "3.33", "10"]'::jsonb,
      '3',
      '["// is the floor division operator in Python.", "Floor division returns the largest integer less than or equal to the exact result.", "10 divided by 3 is 3.33... Floor of that is 3."]'::jsonb,
      'The `//` operator is floor division. `10 // 3` = 3 because 10 ÷ 3 = 3.33, and the floor (integer part rounded down) is **3**.',
      25,
      25,
      1
    ) on conflict do nothing;

    -- 2. Data types
    insert into public.challenges
      (path_id, title, description, difficulty, challenge_type, instructions,
       options, expected_answer, hints, solution_explanation, xp, xp_reward, order_index)
    values (
      python_path_id,
      'Type Inspector',
      'Identify the correct data type.',
      'beginner',
      'multiple_choice',
      'What does `type("42")` return in Python?',
      '["<class ''int''>", "<class ''str''>", "<class ''float''>", "<class ''bool''>"]'::jsonb,
      '<class ''str''>',
      '["Strings in Python are surrounded by quotes.", "The number 42 inside quotes is not treated as an integer.", "type() returns the data type of a value."]'::jsonb,
      '"42" is a **string** (text), not an integer, because it is wrapped in quotes. `type("42")` returns `<class ''str''>`.',
      25,
      25,
      2
    ) on conflict do nothing;

    -- 3. If/Else
    insert into public.challenges
      (path_id, title, description, difficulty, challenge_type, instructions,
       options, expected_answer, hints, solution_explanation, xp, xp_reward, order_index)
    values (
      python_path_id,
      'Condition Predictor',
      'Trace through an if/else block and predict the printed value.',
      'beginner',
      'multiple_choice',
      'What does this code print?

```python
score = 72

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"

print(grade)
```',
      '["A", "B", "C", "F"]'::jsonb,
      'C',
      '["Work through each condition from top to bottom.", "72 is not >= 90, not >= 80, but is 72 >= 70?", "The first True condition wins."]'::jsonb,
      '`score = 72`. The first condition `72 >= 90` is False. The second `72 >= 80` is False. The third `72 >= 70` is **True**, so `grade = "C"`.',
      30,
      30,
      3
    ) on conflict do nothing;

    -- 4. Debug a loop
    insert into public.challenges
      (path_id, title, description, difficulty, challenge_type, instructions,
       options, expected_answer, hints, solution_explanation, xp, xp_reward, order_index)
    values (
      python_path_id,
      'Loop Bug Hunt',
      'Find the bug preventing this loop from summing correctly.',
      'intermediate',
      'debugging',
      'This code should print the sum of numbers 1 through 5 (which is 15), but it prints the wrong answer. What single keyword needs to be changed?

```python
total = 0
for i in range(1, 6):
    total = i          # BUG IS HERE

print(total)
```

Type the corrected line (just the assignment, e.g. `total = i`).',
      '[]'::jsonb,
      'total += i',
      '["The variable total should grow with each iteration.", "Look at what happens to ''total'' on each loop iteration.", "The operator = replaces the value. You need an operator that adds to it."]'::jsonb,
      'The bug is `total = i` which **replaces** total with i each time instead of adding. The fix is `total += i` (equivalent to `total = total + i`).',
      35,
      35,
      4
    ) on conflict do nothing;

    -- 5. Password checker logic
    insert into public.challenges
      (path_id, title, description, difficulty, challenge_type, instructions,
       options, expected_answer, hints, solution_explanation, xp, xp_reward, order_index)
    values (
      python_path_id,
      'Password Validator',
      'Complete the logic for a simple password strength checker.',
      'intermediate',
      'multiple_choice',
      'A password is "strong" if it has at least 8 characters AND contains a digit. Which condition correctly checks this for a variable `p`?',
      '["len(p) >= 8 or any(c.isdigit() for c in p)", "len(p) > 8 and any(c.isdigit() for c in p)", "len(p) >= 8 and any(c.isdigit() for c in p)", "len(p) >= 8 and p.isdigit()"]'::jsonb,
      'len(p) >= 8 and any(c.isdigit() for c in p)',
      '["Both conditions must be True at the same time — which logical operator does that?", "any(c.isdigit() for c in p) checks if at least one character is a digit.", "len(p) >= 8 checks for minimum length (>= not >)."]'::jsonb,
      'We need BOTH conditions true simultaneously, so `and` is correct. `len(p) >= 8` (≥ 8 chars) `and` `any(c.isdigit() for c in p)` (at least one digit).',
      40,
      40,
      5
    ) on conflict do nothing;
  end if;

  -- ── JavaScript Developer: 5 challenges ───────────────────────────────────
  if js_path_id is not null then
    -- 1. let vs const
    insert into public.challenges
      (path_id, title, description, difficulty, challenge_type, instructions,
       options, expected_answer, hints, solution_explanation, xp, xp_reward, order_index)
    values (
      js_path_id,
      'let vs const',
      'Understand when to use let vs const in JavaScript.',
      'beginner',
      'multiple_choice',
      'Which of the following will throw a TypeError in JavaScript?

```javascript
// Option A
let score = 10;
score = 20;

// Option B
const name = "Alice";
name = "Bob";
```',
      '["Option A", "Option B", "Both", "Neither"]'::jsonb,
      'Option B',
      '["const creates a constant binding — the reference cannot be reassigned.", "let allows reassignment after declaration.", "Trying to reassign a const throws a TypeError at runtime."]'::jsonb,
      '`const` prevents **reassignment** of the binding. `name = "Bob"` tries to reassign a const, throwing `TypeError: Assignment to constant variable.` `let` allows reassignment, so Option A is fine.',
      25,
      25,
      1
    ) on conflict do nothing;

    -- 2. Arrow function output
    insert into public.challenges
      (path_id, title, description, difficulty, challenge_type, instructions,
       options, expected_answer, hints, solution_explanation, xp, xp_reward, order_index)
    values (
      js_path_id,
      'Arrow Function Output',
      'Predict what an arrow function returns.',
      'beginner',
      'multiple_choice',
      'What does the following code log to the console?

```javascript
const double = n => n * 2;
console.log(double(7));
```',
      '["7", "14", "undefined", "n * 2"]'::jsonb,
      '14',
      '["Arrow functions with no braces have an implicit return.", "The parameter n receives the value 7.", "7 * 2 = ?"]'::jsonb,
      'The arrow function `n => n * 2` implicitly returns `n * 2`. Called with `7`, it returns `7 * 2 = **14**`.',
      25,
      25,
      2
    ) on conflict do nothing;

    -- 3. Array filter
    insert into public.challenges
      (path_id, title, description, difficulty, challenge_type, instructions,
       options, expected_answer, hints, solution_explanation, xp, xp_reward, order_index)
    values (
      js_path_id,
      'Array Filter Master',
      'Predict the result of an array .filter() call.',
      'intermediate',
      'multiple_choice',
      'What does `result` contain after this code runs?

```javascript
const nums = [1, 2, 3, 4, 5, 6];
const result = nums.filter(n => n % 2 === 0);
```',
      '["[1, 3, 5]", "[2, 4, 6]", "[true, false, true, false, true, false]", "[1, 2, 3, 4, 5, 6]"]'::jsonb,
      '[2, 4, 6]',
      '["filter() keeps elements where the callback returns true.", "n % 2 === 0 checks if a number is even.", "Which numbers from 1-6 are even?"]'::jsonb,
      '`.filter()` keeps elements where the callback returns `true`. `n % 2 === 0` is true for even numbers: **2, 4, 6**.',
      30,
      30,
      3
    ) on conflict do nothing;

    -- 4. Debug a condition
    insert into public.challenges
      (path_id, title, description, difficulty, challenge_type, instructions,
       options, expected_answer, hints, solution_explanation, xp, xp_reward, order_index)
    values (
      js_path_id,
      'Equality Bug',
      'Spot the subtle equality bug in JavaScript.',
      'intermediate',
      'multiple_choice',
      'A developer writes this check expecting it to only be true when `age` is exactly the number 18:

```javascript
if (age == "18") {
    console.log("Welcome!");
}
```

What is the bug, and what should be used instead?',
      '["No bug — == works fine here", "Should use === (strict equality) to avoid type coercion", "Should use !== instead", "Should use >= 18"]'::jsonb,
      'Should use === (strict equality) to avoid type coercion',
      '["== performs type coercion in JavaScript.", "=== checks both value AND type.", "age == \"18\" would be true if age is either the number 18 OR the string \"18\"."]'::jsonb,
      '`==` coerces types, so `18 == "18"` is `true` even though one is a number and one is a string. Using `===` (strict equality) checks value **and** type, making the intent explicit.',
      35,
      35,
      4
    ) on conflict do nothing;

    -- 5. DOM method
    insert into public.challenges
      (path_id, title, description, difficulty, challenge_type, instructions,
       options, expected_answer, hints, solution_explanation, xp, xp_reward, order_index)
    values (
      js_path_id,
      'DOM Selector',
      'Choose the right DOM method to select an element.',
      'beginner',
      'multiple_choice',
      'You have this HTML: `<button id="submit-btn">Submit</button>`

Which JavaScript method directly selects it by its id?',
      '["document.getElement(\"submit-btn\")", "document.getElementById(\"submit-btn\")", "document.select(\"#submit-btn\")", "document.find(\"submit-btn\")"]'::jsonb,
      'document.getElementById("submit-btn")',
      '["The method name includes the word ''Element'' (singular).", "You pass the id string without the # symbol.", "Contrast with querySelector which takes a CSS selector string."]'::jsonb,
      '`document.getElementById("submit-btn")` selects an element by its `id` attribute directly. Note: no `#` prefix (unlike `querySelector("#submit-btn")`).',
      25,
      25,
      5
    ) on conflict do nothing;
  end if;

  -- ── SQL Mastery: 5 challenges ─────────────────────────────────────────────
  if sql_path_id is not null then
    -- 1. SELECT basics
    insert into public.challenges
      (path_id, title, description, difficulty, challenge_type, instructions,
       options, expected_answer, hints, solution_explanation, xp, xp_reward, order_index)
    values (
      sql_path_id,
      'First SELECT',
      'Write the keyword used to retrieve all columns from a table.',
      'beginner',
      'short_answer',
      'What SQL keyword is used to retrieve data from a database table?

Type the keyword in ALL CAPS.',
      '[]'::jsonb,
      'SELECT',
      '["It is the first word in most SQL queries.", "It comes before the column names you want.", "SELECT * FROM table returns every column."]'::jsonb,
      '**SELECT** is the SQL keyword for retrieving data. A basic query looks like `SELECT * FROM table_name;` where `*` means all columns.',
      25,
      25,
      1
    ) on conflict do nothing;

    -- 2. WHERE filtering
    insert into public.challenges
      (path_id, title, description, difficulty, challenge_type, instructions,
       options, expected_answer, hints, solution_explanation, xp, xp_reward, order_index)
    values (
      sql_path_id,
      'WHERE Clause',
      'Choose the correct query to filter rows.',
      'beginner',
      'multiple_choice',
      'You have a `users` table. Which query returns only users older than 18?',
      '["SELECT * FROM users HAVING age > 18", "SELECT * FROM users FILTER age > 18", "SELECT * FROM users WHERE age > 18", "SELECT age > 18 FROM users"]'::jsonb,
      'SELECT * FROM users WHERE age > 18',
      '["WHERE is used to filter rows before they are returned.", "HAVING is used after GROUP BY to filter groups.", "The condition comes after the table name."]'::jsonb,
      '`WHERE` filters rows based on a condition. `SELECT * FROM users WHERE age > 18` returns all columns for users where age is greater than 18.',
      25,
      25,
      2
    ) on conflict do nothing;

    -- 3. ORDER BY
    insert into public.challenges
      (path_id, title, description, difficulty, challenge_type, instructions,
       options, expected_answer, hints, solution_explanation, xp, xp_reward, order_index)
    values (
      sql_path_id,
      'ORDER BY Direction',
      'Understand ascending vs descending sort order.',
      'beginner',
      'multiple_choice',
      'Which query returns products sorted by price from most expensive to cheapest?',
      '["SELECT * FROM products ORDER BY price ASC", "SELECT * FROM products ORDER BY price DESC", "SELECT * FROM products SORT BY price DESC", "SELECT * FROM products WHERE price ORDER DESC"]'::jsonb,
      'SELECT * FROM products ORDER BY price DESC',
      '["ASC = ascending (low to high), DESC = descending (high to low).", "The default sort direction when omitted is ASC.", "SORT BY is not valid SQL — it is ORDER BY."]'::jsonb,
      '`ORDER BY price DESC` sorts results in **descending** order (highest price first). `ASC` (default) would sort cheapest first.',
      25,
      25,
      3
    ) on conflict do nothing;

    -- 4. COUNT aggregate
    insert into public.challenges
      (path_id, title, description, difficulty, challenge_type, instructions,
       options, expected_answer, hints, solution_explanation, xp, xp_reward, order_index)
    values (
      sql_path_id,
      'COUNT It Up',
      'Use the COUNT aggregate function.',
      'intermediate',
      'multiple_choice',
      'You want to know how many rows are in the `orders` table. Which query is correct?',
      '["SELECT TOTAL(*) FROM orders", "SELECT COUNT(*) FROM orders", "SELECT SUM(*) FROM orders", "SELECT LENGTH(orders)"]'::jsonb,
      'SELECT COUNT(*) FROM orders',
      '["COUNT is a SQL aggregate function.", "* means count all rows regardless of NULL values.", "SUM adds numeric values, not rows."]'::jsonb,
      '`COUNT(*)` counts all rows in the result set including NULLs. `SELECT COUNT(*) FROM orders` returns the total number of rows in the orders table.',
      30,
      30,
      4
    ) on conflict do nothing;

    -- 5. JOIN concept
    insert into public.challenges
      (path_id, title, description, difficulty, challenge_type, instructions,
       options, expected_answer, hints, solution_explanation, xp, xp_reward, order_index)
    values (
      sql_path_id,
      'JOIN Thinking',
      'Understand what INNER JOIN returns.',
      'intermediate',
      'multiple_choice',
      'You have two tables: `customers` and `orders`. An INNER JOIN on `customers.id = orders.customer_id` will return:',
      '["All customers, even those with no orders", "All orders, even those with no matching customer", "Only customers AND orders that have a matching record in both tables", "A single combined table with all possible combinations"]'::jsonb,
      'Only customers AND orders that have a matching record in both tables',
      '["INNER JOIN is the most restrictive join type.", "If a customer has no orders, they do NOT appear in an INNER JOIN result.", "Compare with LEFT JOIN which keeps all left table rows."]'::jsonb,
      '`INNER JOIN` returns only rows where the join condition matches in **both** tables. Customers without orders and orders without customers are excluded.',
      35,
      35,
      5
    ) on conflict do nothing;
  end if;
end;
$$;
