-- ============================================================
-- Unleash Coding – Lesson Engine (Phase 4)
-- Run this in your Supabase SQL Editor
-- ============================================================

-- ── lesson_notes ─────────────────────────────────────────────
create table if not exists public.lesson_notes (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  lesson_id  uuid not null references public.lessons(id) on delete cascade,
  note       text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, lesson_id)
);

alter table public.lesson_notes enable row level security;

create policy "Users manage own notes"
  on public.lesson_notes for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── lesson_quizzes ───────────────────────────────────────────
create table if not exists public.lesson_quizzes (
  id             uuid primary key default gen_random_uuid(),
  lesson_id      uuid not null references public.lessons(id) on delete cascade,
  question       text not null,
  options        jsonb not null default '[]',
  correct_answer text not null,
  explanation    text not null default '',
  order_index    int  not null default 0,
  created_at     timestamptz not null default now()
);

alter table public.lesson_quizzes enable row level security;

create policy "Public read lesson_quizzes"
  on public.lesson_quizzes for select using (true);

-- ── quiz_attempts ────────────────────────────────────────────
create table if not exists public.quiz_attempts (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  quiz_id         uuid references public.lesson_quizzes(id) on delete cascade,
  selected_answer text not null,
  is_correct      boolean not null,
  created_at      timestamptz not null default now()
);

alter table public.quiz_attempts enable row level security;

create policy "Users manage own quiz_attempts"
  on public.quiz_attempts for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── Indexes ───────────────────────────────────────────────────
create index if not exists lesson_notes_user_lesson_idx  on public.lesson_notes(user_id, lesson_id);
create index if not exists lesson_quizzes_lesson_idx     on public.lesson_quizzes(lesson_id);
create index if not exists quiz_attempts_user_idx        on public.quiz_attempts(user_id);

-- ============================================================
-- Seed: Python Developer path + 3 beginner lessons
-- ============================================================
do $$
declare
  v_path_id   uuid;
  v_module_id uuid;
  v_l1_id     uuid := gen_random_uuid();
  v_l2_id     uuid := gen_random_uuid();
  v_l3_id     uuid := gen_random_uuid();
  v_content1  text;
  v_content2  text;
  v_content3  text;
begin

  -- ── Ensure Python Developer path exists ──────────────────
  select id into v_path_id from public.learning_paths where slug = 'python-developer' limit 1;

  if v_path_id is null then
    insert into public.learning_paths
      (title, slug, description, difficulty, estimated_timeline, weekly_hours, weekly_hours_num,
       category, icon, color, tags, total_lessons, total_challenges)
    values
      ('Python Developer', 'python-developer',
       'Master Python from the ground up — variables, logic, loops, functions, OOP, APIs, and real-world projects.',
       'beginner', '16 weeks', '10–12 hrs/week', 10,
       'Backend', '🐍', '#3b82f6',
       array['Python','Backend','Data','Automation'],
       3, 10)
    returning id into v_path_id;
  end if;

  -- ── Ensure a beginner module exists ──────────────────────
  select id into v_module_id
  from public.modules
  where path_id = v_path_id and level = 'beginner'
  order by order_index
  limit 1;

  if v_module_id is null then
    insert into public.modules (path_id, title, description, level, duration, order_index)
    values (v_path_id, 'Python Basics', 'Core building blocks of Python programming', 'beginner', '3 hours', 1)
    returning id into v_module_id;
  end if;

  -- ── Lesson 1 content ─────────────────────────────────────
  v_content1 := $l1$## Variables and Data Types

A variable is a named container that stores a value. In Python you don't declare types — just assign and Python figures out the rest.

### Creating Your First Variables

```python
name       = "Alice"   # str  — text
age        = 25        # int  — whole number
height     = 5.7       # float — decimal
is_student = True      # bool  — True or False

print(name, age, height, is_student)
# Output: Alice 25 5.7 True
```

### The Four Core Types

- **str** — Text in quotes: `"Hello"` or `'World'`
- **int** — Whole numbers: `42`, `-10`, `0`
- **float** — Decimal numbers: `3.14`, `-0.5`
- **bool** — Only `True` or `False` (capital first letter)

### Checking the Type

```python
print(type("Alice"))   # <class 'str'>
print(type(42))        # <class 'int'>
print(type(3.14))      # <class 'float'>
print(type(True))      # <class 'bool'>
```

### Converting Between Types

```python
age_str = "25"            # a string
age_int = int(age_str)    # convert → integer
print(age_int + 5)        # 30

score   = 95
message = str(score) + " points"
print(message)            # 95 points
```

### Common Mistakes

> Python is case-sensitive. `name` and `Name` are two different variables.

> Variable names cannot start with a number. `1age` is invalid — use `age1` instead.

```python
# NameError example
Name = "Alice"
print(name)   # NameError: 'name' is not defined

# Fix — use consistent casing
name = "Alice"
print(name)   # Alice
```

### Mini Exercise

Create three variables: your name (str), your age (int), and your height as a float. Print them all on one line.

```python
my_name   = "Sam"
my_age    = 20
my_height = 5.9
print(my_name, my_age, my_height)
```$l1$;

  -- ── Lesson 2 content ─────────────────────────────────────
  v_content2 := $l2$## If / Else Conditions

Conditions let your program make decisions. The `if` statement runs a block of code only when a condition is `True`.

### Basic Syntax

```python
age = 18

if age >= 18:
    print("You can vote!")
else:
    print("Too young to vote.")
```

### elif — Multiple Conditions

Use `elif` (short for "else if") to check additional conditions:

```python
score = 75

if score >= 90:
    print("Grade: A")
elif score >= 80:
    print("Grade: B")
elif score >= 70:
    print("Grade: C")
else:
    print("Grade: F")
```

### Comparison Operators

- `==` equal to
- `!=` not equal to
- `>` greater than
- `<` less than
- `>=` greater than or equal
- `<=` less than or equal

### Logical Operators

Combine conditions with `and`, `or`, and `not`:

```python
age       = 25
has_ticket = True

if age >= 18 and has_ticket:
    print("Welcome to the concert!")

if age < 5 or age > 65:
    print("Discounted entry.")

if not has_ticket:
    print("Buy a ticket first.")
```

### Common Mistakes

> Use `==` to compare values, not `=`. A single `=` is the assignment operator and will cause a SyntaxError inside a condition.

> Indentation is mandatory. Python uses 4 spaces to define a code block.

```python
# Wrong — missing indentation:
if True:
print("Hello")   # IndentationError!

# Correct:
if True:
    print("Hello")   # Works!
```

### Mini Exercise

Write a program that checks a temperature. Print "Hot day!" if above 30, "Cold day!" if below 10, and "Nice weather!" otherwise.

```python
temperature = 25

if temperature > 30:
    print("Hot day!")
elif temperature < 10:
    print("Cold day!")
else:
    print("Nice weather!")
```$l2$;

  -- ── Lesson 3 content ─────────────────────────────────────
  v_content3 := $l3$## Loops

Loops let you repeat code without rewriting the same lines over and over. Python has two loop types: `for` and `while`.

### The for Loop

A `for` loop iterates over a sequence:

```python
for i in range(1, 6):
    print(i)

# Output: 1  2  3  4  5
```

### Looping Over a List

```python
fruits = ["apple", "banana", "cherry"]

for fruit in fruits:
    print("I like", fruit)

# Output:
# I like apple
# I like banana
# I like cherry
```

### The while Loop

A `while` loop repeats as long as a condition is True:

```python
count = 0

while count < 5:
    print("Count:", count)
    count += 1   # same as count = count + 1

# Output: Count: 0  Count: 1  Count: 2  Count: 3  Count: 4
```

### break and continue

- `break` — exit the loop immediately
- `continue` — skip the current iteration

```python
for i in range(10):
    if i == 5:
        break        # stop at 5
    print(i)         # prints 0, 1, 2, 3, 4

for i in range(5):
    if i == 2:
        continue     # skip 2
    print(i)         # prints 0, 1, 3, 4
```

### Common Mistakes

> Infinite loops: always make sure a `while` loop's condition will eventually become `False`.

```python
# DANGEROUS — runs forever:
while True:
    print("Help!")

# Safe — has a termination:
count = 0
while count < 10:
    count += 1
    print(count)
```

### Mini Exercise

Use a `for` loop to print the 3× multiplication table from 3×1 to 3×10.

```python
for i in range(1, 11):
    print(f"3 x {i} = {3 * i}")
```$l3$;

  -- ── Insert lessons (idempotent) ──────────────────────────
  insert into public.lessons (id, module_id, title, content, type, duration, order_index, estimated_minutes)
  values
    (v_l1_id, v_module_id, 'Variables and Data Types', v_content1, 'reading', '15 min', 1, 15),
    (v_l2_id, v_module_id, 'If / Else Conditions',     v_content2, 'reading', '20 min', 2, 20),
    (v_l3_id, v_module_id, 'Loops',                    v_content3, 'reading', '20 min', 3, 20)
  on conflict do nothing;

  -- ── Update path total_lessons ─────────────────────────────
  update public.learning_paths
  set total_lessons = (
    select count(*) from public.lessons l
    join public.modules m on m.id = l.module_id
    where m.path_id = v_path_id
  )
  where id = v_path_id;

  -- ── Quizzes for Lesson 1 ──────────────────────────────────
  insert into public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
  values
    (v_l1_id,
     'What is the output of print(type(42))?',
     '["<class ''str''>", "<class ''int''>", "<class ''float''>", "<class ''number''>"]',
     '<class ''int''>',
     '42 is a whole number, so Python assigns it the int type.',
     1),
    (v_l1_id,
     'Which variable name is valid in Python?',
     '["1name", "my-name", "my_name", "class"]',
     'my_name',
     'Variable names can only contain letters, numbers, and underscores. They cannot start with a number or use reserved keywords.',
     2),
    (v_l1_id,
     'What does int(''25'') return?',
     '["''25''", "25", "None", "Error"]',
     '25',
     'The int() function converts a string to an integer value.',
     3)
  on conflict do nothing;

  -- ── Quizzes for Lesson 2 ──────────────────────────────────
  insert into public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
  values
    (v_l2_id,
     'Which operator checks if two values are equal?',
     '["=", "==", "!=", ":="]',
     '==',
     '== is the equality comparison operator. A single = is used only for assignment.',
     1),
    (v_l2_id,
     'What Python keyword handles an additional condition after if?',
     '["else if", "elseif", "elsif", "elif"]',
     'elif',
     'Python uses elif (short for else if) to chain multiple conditional branches.',
     2),
    (v_l2_id,
     'What does the and operator require?',
     '["At least one condition is True", "Both conditions are True", "Neither condition is True", "The first condition is True"]',
     'Both conditions are True',
     'The and operator returns True only when every condition it connects is True.',
     3)
  on conflict do nothing;

  -- ── Quizzes for Lesson 3 ──────────────────────────────────
  insert into public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
  values
    (v_l3_id,
     'What does range(1, 4) produce?',
     '["[1, 2, 3, 4]", "[1, 2, 3]", "[0, 1, 2, 3]", "[0, 1, 2]"]',
     '[1, 2, 3]',
     'range(start, stop) generates numbers from start up to but NOT including stop.',
     1),
    (v_l3_id,
     'Which keyword exits a loop immediately?',
     '["exit", "stop", "return", "break"]',
     'break',
     'break terminates the loop immediately, skipping any remaining iterations.',
     2),
    (v_l3_id,
     'Which keyword skips the current iteration and moves to the next?',
     '["skip", "next", "continue", "pass"]',
     'continue',
     'continue skips the rest of the current loop body and moves on to the next iteration.',
     3)
  on conflict do nothing;

  raise notice 'Phase 4 seed complete. Path ID: %', v_path_id;

end $$;
