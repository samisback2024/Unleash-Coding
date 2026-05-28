-- ============================================================
-- Unleash Coding – Migration 012
-- Real lesson content: Python, JavaScript, TypeScript
-- All content is genuine educational material with code examples
-- ============================================================

-- Helper: insert a lesson only if none with that order_index exists for the module
-- Pattern: INSERT ... SELECT ... WHERE NOT EXISTS (...)

-- ============================================================
-- PYTHON DEVELOPER – Module 1: Python Fundamentals
-- ============================================================

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'Variables and Data Types',
$$## Variables and Data Types

A variable is a named container that stores a value. Python is dynamically typed, meaning you never declare a type — Python infers it automatically from the value you assign.

### Creating Variables

```python
name       = "Alice"    # str  — text surrounded by quotes
age        = 25         # int  — whole number
height     = 5.7        # float — decimal number
is_student = True       # bool  — True or False (capital first letter!)

print(name, age, height, is_student)
# Output: Alice 25 5.7 True
```

### The Four Core Types

| Type    | Example          | Description                    |
|---------|------------------|--------------------------------|
| `str`   | `"Hello"`        | Text (always in quotes)        |
| `int`   | `42`, `-10`      | Whole numbers                  |
| `float` | `3.14`, `-0.5`   | Decimal numbers                |
| `bool`  | `True`, `False`  | Logical values (capitalized!)  |

### Checking the Type

```python
print(type("Alice"))   # <class 'str'>
print(type(42))        # <class 'int'>
print(type(3.14))      # <class 'float'>
print(type(True))      # <class 'bool'>
```

### Type Conversion

```python
# String to integer
age_str = "25"
age_int = int(age_str)
print(age_int + 5)       # 30

# Number to string
score   = 95
message = "Score: " + str(score)
print(message)           # Score: 95

# String to float
price = float("19.99")
print(price * 2)         # 39.98
```

### Common Mistakes

> Variable names are **case-sensitive**. `Name`, `name`, and `NAME` are three different variables.

> Variable names **cannot start with a number**. `1age` is invalid — use `age1` instead.

> `True` and `False` must be **capitalized**. `true` and `false` are not booleans in Python — they would cause a NameError.

```python
# This causes a NameError:
print(true)   # NameError: name 'true' is not defined

# Correct:
print(True)   # True
```

### Mini Exercise

Create variables for your name, age, and whether you are a developer. Print them all in one line.

```python
my_name     = "Sam"
my_age      = 28
is_developer = True
print(my_name, my_age, is_developer)
# Output: Sam 28 True
```$$,
  'reading', '20 min', 1, 20
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'python-developer' AND m.order_index = 1
AND NOT EXISTS (
  SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 1
);

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'Operators and Expressions',
$$## Operators and Expressions

Operators let you perform calculations, compare values, and combine logic. Python has arithmetic, comparison, logical, and assignment operators.

### Arithmetic Operators

```python
a = 10
b = 3

print(a + b)   # 13  — addition
print(a - b)   # 7   — subtraction
print(a * b)   # 30  — multiplication
print(a / b)   # 3.333...  — division (always returns float)
print(a // b)  # 3   — floor division (integer result)
print(a % b)   # 1   — modulo (remainder)
print(a ** b)  # 1000 — exponentiation (10 to the power of 3)
```

### Comparison Operators (return True or False)

```python
x = 5
y = 10

print(x == y)   # False — equal to
print(x != y)   # True  — not equal to
print(x < y)    # True  — less than
print(x > y)    # False — greater than
print(x <= 5)   # True  — less than or equal
print(x >= 10)  # False — greater than or equal
```

### Logical Operators

```python
age    = 20
income = 50000

# and — both must be True
print(age >= 18 and income > 40000)   # True

# or — at least one must be True
print(age < 18 or income > 30000)     # True

# not — inverts the result
print(not (age < 18))   # True (age is NOT less than 18)
```

### String Operators

```python
first = "Hello"
last  = "World"

# Concatenation
print(first + " " + last)   # Hello World

# Repetition
print("Ha" * 3)             # HaHaHa

# Membership
print("ello" in first)      # True
print("xyz"  in first)      # False
```

### Assignment Operators (shortcuts)

```python
score = 10
score += 5    # same as: score = score + 5  → 15
score -= 3    # same as: score = score - 3  → 12
score *= 2    # same as: score = score * 2  → 24
score //= 5   # same as: score = score // 5 → 4
print(score)  # 4
```

### Order of Operations (PEMDAS)

Python follows standard math precedence. Use parentheses to control order.

```python
result = 2 + 3 * 4       # 14 (not 20!)
result = (2 + 3) * 4     # 20
```

### Mini Exercise

Write a simple tip calculator. Given a bill and tip percentage, calculate the tip amount and total.

```python
bill        = 85.00
tip_percent = 18

tip_amount = bill * (tip_percent / 100)
total      = bill + tip_amount

print(f"Tip:   ${tip_amount:.2f}")    # Tip:   $15.30
print(f"Total: ${total:.2f}")         # Total: $100.30
```$$,
  'reading', '20 min', 2, 20
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'python-developer' AND m.order_index = 1
AND NOT EXISTS (
  SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 2
);

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'Control Flow: if, elif, else',
$$## Control Flow: if, elif, else

Conditions let your program make decisions. Python uses `if`, `elif`, and `else` to branch into different code paths.

### Basic if Statement

```python
temperature = 22

if temperature > 30:
    print("It is hot outside!")
```

Note the **colon** at the end of the `if` line and the **indentation** (4 spaces) for the body. Python uses indentation instead of curly braces.

### if / else

```python
age = 17

if age >= 18:
    print("You can vote.")
else:
    print("You are too young to vote.")
```

### if / elif / else (multiple conditions)

```python
score = 75

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"

print(f"Your grade is {grade}")   # Your grade is C
```

### Nested Conditions

```python
is_logged_in = True
is_admin     = False

if is_logged_in:
    if is_admin:
        print("Welcome, Admin!")
    else:
        print("Welcome, User!")
else:
    print("Please log in.")
```

### One-line if (ternary expression)

```python
age = 20
status = "adult" if age >= 18 else "minor"
print(status)   # adult
```

### Truthy and Falsy Values

Python treats certain values as `False` automatically:

```python
# These are all "falsy":
# False, 0, 0.0, "" (empty string), [] (empty list), None

name = ""
if name:
    print(f"Hello, {name}!")
else:
    print("Name is empty.")    # This runs
```

### Common Mistakes

> **Indentation errors** are the most common Python mistakes. The body of an `if` block MUST be indented — otherwise Python raises an `IndentationError`.

```python
# Wrong:
if True:
print("Oops")   # IndentationError

# Correct:
if True:
    print("Works!")
```

> Do not use `=` for comparison. `=` assigns a value. `==` compares values.

### Mini Exercise

Ask for a user's age (as a variable), then print their life stage:
- Under 13: "Child"
- 13-17: "Teenager"
- 18-64: "Adult"
- 65+: "Senior"

```python
age = 45

if age < 13:
    stage = "Child"
elif age < 18:
    stage = "Teenager"
elif age < 65:
    stage = "Adult"
else:
    stage = "Senior"

print(f"Life stage: {stage}")   # Life stage: Adult
```$$,
  'reading', '25 min', 3, 25
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'python-developer' AND m.order_index = 1
AND NOT EXISTS (
  SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 3
);

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'Loops: for and while',
$$## Loops: for and while

Loops let you repeat code without writing it multiple times. Python has two loop types: `for` (iterate over a sequence) and `while` (repeat while a condition is true).

### for Loop

```python
# Loop over a list
fruits = ["apple", "banana", "cherry"]

for fruit in fruits:
    print(fruit)
# apple
# banana
# cherry
```

### range() with for

`range()` generates a sequence of numbers without creating a list in memory.

```python
# range(stop) — 0 to stop-1
for i in range(5):
    print(i)     # 0, 1, 2, 3, 4

# range(start, stop)
for i in range(2, 6):
    print(i)     # 2, 3, 4, 5

# range(start, stop, step)
for i in range(0, 10, 2):
    print(i)     # 0, 2, 4, 6, 8

# Counting down
for i in range(5, 0, -1):
    print(i)     # 5, 4, 3, 2, 1
```

### enumerate() — loop with index

```python
colors = ["red", "green", "blue"]

for index, color in enumerate(colors):
    print(f"{index}: {color}")
# 0: red
# 1: green
# 2: blue
```

### while Loop

```python
count = 0

while count < 5:
    print(f"Count is {count}")
    count += 1      # Important: must move toward the exit condition!
```

### break and continue

```python
# break — exit the loop immediately
for n in range(10):
    if n == 5:
        break
    print(n)        # prints 0, 1, 2, 3, 4

# continue — skip this iteration, move to next
for n in range(10):
    if n % 2 == 0:
        continue    # skip even numbers
    print(n)        # prints 1, 3, 5, 7, 9
```

### Nested Loops

```python
# Multiplication table (3x3)
for i in range(1, 4):
    for j in range(1, 4):
        print(f"{i} x {j} = {i*j}")
```

### List Comprehensions (Pythonic shortcut)

```python
# Traditional way:
squares = []
for n in range(1, 6):
    squares.append(n ** 2)

# List comprehension (same result, 1 line):
squares = [n ** 2 for n in range(1, 6)]
print(squares)   # [1, 4, 9, 16, 25]

# With a filter:
evens = [n for n in range(20) if n % 2 == 0]
print(evens)     # [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]
```

### Common Mistakes

> **Infinite loops** — always make sure your `while` loop has a condition that can eventually become `False`.

```python
# Danger: infinite loop!
while True:
    print("forever")   # runs forever — use Ctrl+C to stop

# Safe version with break:
attempts = 0
while True:
    attempts += 1
    if attempts >= 3:
        break
```

### Mini Exercise

Print the sum of all even numbers from 1 to 100.

```python
total = 0
for n in range(1, 101):
    if n % 2 == 0:
        total += n

print(f"Sum of even numbers 1-100: {total}")   # 2550

# One-liner using list comprehension:
print(sum(n for n in range(1, 101) if n % 2 == 0))   # 2550
```$$,
  'reading', '25 min', 4, 25
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'python-developer' AND m.order_index = 1
AND NOT EXISTS (
  SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 4
);

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'Strings In Depth',
$$## Strings In Depth

Strings are one of the most-used types in Python. They are sequences of characters that you can slice, format, search, and transform.

### Creating Strings

```python
single   = 'Hello, World!'
double   = "Hello, World!"
multiline = """This is
a multi-line
string."""
```

### String Indexing and Slicing

Strings are indexed starting at `0`. Negative indexes count from the end.

```python
text = "Python"

print(text[0])     # P  (first character)
print(text[-1])    # n  (last character)
print(text[1:4])   # yth (characters at index 1, 2, 3)
print(text[:3])    # Pyt (from start to index 2)
print(text[3:])    # hon (from index 3 to end)
print(text[::-1])  # nohtyP (reversed!)
```

### Common String Methods

```python
s = "  Hello, World!  "

print(s.strip())          # "Hello, World!"  (removes whitespace)
print(s.lower())          # "  hello, world!  "
print(s.upper())          # "  HELLO, WORLD!  "
print(s.replace("World", "Python"))   # "  Hello, Python!  "
print(s.split(","))       # ['  Hello', ' World!  ']
print(s.find("World"))    # 9  (index where it starts, or -1)
print(s.startswith("  H"))   # True
print(s.endswith("!  "))     # True
```

### f-Strings (the best way to format)

```python
name  = "Alice"
score = 95.678

print(f"Name: {name}")                  # Name: Alice
print(f"Score: {score:.2f}")           # Score: 95.68
print(f"Score: {score:.0f}%")          # Score: 96%
print(f"{name!r}")                     # 'Alice'  (shows repr)
print(f"2 + 2 = {2 + 2}")              # 2 + 2 = 4
```

### String Checking Methods

```python
print("hello".isalpha())    # True  — all alphabetic
print("123".isdigit())      # True  — all digits
print("hello123".isalnum()) # True  — all alphanumeric
print("  ".isspace())       # True  — all whitespace
print("Hello".istitle())    # True  — title case
```

### Joining and Splitting

```python
words = ["apple", "banana", "cherry"]

# join — combine list into string
result = ", ".join(words)
print(result)   # apple, banana, cherry

# split — break string into list
csv_line  = "Alice,28,Engineer"
parts     = csv_line.split(",")
print(parts)    # ['Alice', '28', 'Engineer']
```

### Mini Exercise

Take a name as a string and return it formatted as "Last, First". For example, "John Smith" → "Smith, John".

```python
full_name = "John Smith"
parts = full_name.split()
formatted = f"{parts[1]}, {parts[0]}"
print(formatted)   # Smith, John
```$$,
  'reading', '25 min', 5, 25
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'python-developer' AND m.order_index = 1
AND NOT EXISTS (
  SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 5
);

-- ============================================================
-- PYTHON DEVELOPER – Module 2: Functions & Modules
-- ============================================================

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'Defining and Calling Functions',
$$## Defining and Calling Functions

Functions are reusable blocks of code. They help you avoid repetition, organize logic, and make code easier to test and understand.

### Defining a Function

```python
def greet(name):
    """Return a greeting for the given name."""
    return f"Hello, {name}!"

# Calling the function:
message = greet("Alice")
print(message)   # Hello, Alice!
```

The `def` keyword defines a function. The triple-quoted string is a **docstring** — it documents what the function does.

### Parameters and Return Values

```python
def add(a, b):
    return a + b

result = add(3, 7)
print(result)   # 10
```

A function that doesn't explicitly `return` anything returns `None`.

### Default Parameters

```python
def power(base, exponent=2):
    return base ** exponent

print(power(5))       # 25  (exponent defaults to 2)
print(power(2, 10))   # 1024
```

### Keyword Arguments

Call functions with parameter names for clarity:

```python
def create_user(name, age, role="user"):
    return {"name": name, "age": age, "role": role}

# Positional:
u1 = create_user("Alice", 28, "admin")

# Keyword (order doesn't matter):
u2 = create_user(age=30, name="Bob", role="mod")
```

### *args — Variable Positional Arguments

```python
def sum_all(*numbers):
    """Accept any number of arguments."""
    total = 0
    for n in numbers:
        total += n
    return total

print(sum_all(1, 2, 3))         # 6
print(sum_all(10, 20, 30, 40))  # 100
```

### **kwargs — Variable Keyword Arguments

```python
def print_info(**details):
    for key, value in details.items():
        print(f"  {key}: {value}")

print_info(name="Alice", age=28, city="NYC")
# name: Alice
# age: 28
# city: NYC
```

### Scope: Local vs Global

```python
# Variables defined inside a function are LOCAL:
def my_func():
    local_var = "I am local"
    print(local_var)   # Works

my_func()
# print(local_var)   # NameError: not defined outside the function

# Use global keyword to modify a global variable (avoid when possible):
count = 0

def increment():
    global count
    count += 1

increment()
print(count)   # 1
```

### Mini Exercise

Write a function `celsius_to_fahrenheit(c)` and another `fahrenheit_to_celsius(f)`. Test both with a few values.

```python
def celsius_to_fahrenheit(c):
    return (c * 9/5) + 32

def fahrenheit_to_celsius(f):
    return (f - 32) * 5/9

print(celsius_to_fahrenheit(0))    # 32.0
print(celsius_to_fahrenheit(100))  # 212.0
print(fahrenheit_to_celsius(212))  # 100.0
```$$,
  'reading', '30 min', 1, 30
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'python-developer' AND m.order_index = 2
AND NOT EXISTS (
  SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 1
);

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'Lambda Functions and Functional Patterns',
$$## Lambda Functions and Functional Patterns

Python supports functional programming concepts — lambda functions, map, filter, and reduce let you write concise data transformations.

### Lambda Functions

A `lambda` is an anonymous (unnamed) function written on one line.

```python
# Regular function:
def square(x):
    return x ** 2

# Lambda equivalent:
square = lambda x: x ** 2

print(square(5))   # 25
```

Lambda syntax: `lambda arguments: expression`

```python
# Multiple arguments:
add = lambda a, b: a + b
print(add(3, 4))    # 7

# With conditional expression:
max_val = lambda a, b: a if a > b else b
print(max_val(10, 7))   # 10
```

### Lambdas with sorted()

The most common use of lambda is as a sort key:

```python
students = [
    {"name": "Charlie", "grade": 85},
    {"name": "Alice",   "grade": 92},
    {"name": "Bob",     "grade": 78},
]

# Sort by grade (descending):
sorted_students = sorted(students, key=lambda s: s["grade"], reverse=True)
for s in sorted_students:
    print(f"{s['name']}: {s['grade']}")
# Alice: 92
# Charlie: 85
# Bob: 78
```

### map() — Transform Each Element

```python
numbers = [1, 2, 3, 4, 5]

# Double each number:
doubled = list(map(lambda n: n * 2, numbers))
print(doubled)   # [2, 4, 6, 8, 10]

# Equivalent list comprehension (often preferred):
doubled = [n * 2 for n in numbers]
```

### filter() — Keep Elements Matching a Condition

```python
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Keep only even numbers:
evens = list(filter(lambda n: n % 2 == 0, numbers))
print(evens)   # [2, 4, 6, 8, 10]

# Equivalent:
evens = [n for n in numbers if n % 2 == 0]
```

### reduce() — Accumulate to a Single Value

```python
from functools import reduce

numbers = [1, 2, 3, 4, 5]

# Sum all numbers using reduce:
total = reduce(lambda acc, n: acc + n, numbers)
print(total)   # 15

# Product:
product = reduce(lambda acc, n: acc * n, numbers)
print(product)   # 120
```

### When to Use Lambda vs Regular Functions

Use **lambda** when:
- The function is a simple single-expression calculation
- It will only be used once (inline)
- You are passing it to `sorted()`, `map()`, `filter()`

Use a **regular function** when:
- The logic has more than one expression
- You need a docstring
- You will reuse the function in multiple places

### Mini Exercise

Given a list of strings, use `filter()` and `map()` to: (1) keep only strings longer than 5 characters, (2) convert them to uppercase.

```python
words = ["apple", "banana", "kiwi", "mango", "strawberry", "fig"]

result = list(map(
    lambda w: w.upper(),
    filter(lambda w: len(w) > 5, words)
))
print(result)   # ['BANANA', 'STRAWBERRY']
```$$,
  'reading', '30 min', 2, 30
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'python-developer' AND m.order_index = 2
AND NOT EXISTS (
  SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 2
);

-- ============================================================
-- PYTHON DEVELOPER – Module 3: Data Structures
-- ============================================================

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'Lists: The Workhorse of Python',
$$## Lists: The Workhorse of Python

Lists are ordered, mutable sequences. They can hold any mix of types and are the most-used data structure in Python.

### Creating Lists

```python
empty    = []
numbers  = [1, 2, 3, 4, 5]
mixed    = [1, "hello", 3.14, True]
nested   = [[1, 2], [3, 4], [5, 6]]
```

### Accessing Elements

```python
fruits = ["apple", "banana", "cherry", "date"]

print(fruits[0])     # apple
print(fruits[-1])    # date
print(fruits[1:3])   # ['banana', 'cherry']
print(fruits[:2])    # ['apple', 'banana']
print(fruits[2:])    # ['cherry', 'date']
```

### Modifying Lists

```python
nums = [1, 2, 3]

nums.append(4)          # Add to end: [1, 2, 3, 4]
nums.insert(1, 10)      # Insert at index 1: [1, 10, 2, 3, 4]
nums.extend([5, 6])     # Add multiple: [1, 10, 2, 3, 4, 5, 6]
nums.remove(10)         # Remove by value: [1, 2, 3, 4, 5, 6]
popped = nums.pop()     # Remove & return last: 6 → [1, 2, 3, 4, 5]
popped = nums.pop(0)    # Remove at index 0: 1 → [2, 3, 4, 5]
del nums[1]             # Delete at index 1 → [2, 4, 5]
nums.clear()            # Remove all → []
```

### Searching and Sorting

```python
nums = [3, 1, 4, 1, 5, 9, 2, 6]

print(3 in nums)        # True
print(nums.count(1))    # 2 (how many times 1 appears)
print(nums.index(5))    # 4 (index of first occurrence)

nums.sort()             # Sort in-place: [1, 1, 2, 3, 4, 5, 6, 9]
nums.sort(reverse=True) # Sort descending

new_list = sorted(nums) # Returns new sorted list (original unchanged)

nums.reverse()          # Reverse in-place
```

### Useful List Operations

```python
nums = [1, 2, 3, 4, 5]

print(len(nums))         # 5
print(sum(nums))         # 15
print(min(nums))         # 1
print(max(nums))         # 5
print(list(reversed(nums)))   # [5, 4, 3, 2, 1]

# Flatten a nested list:
nested = [[1, 2], [3, 4], [5, 6]]
flat   = [n for sublist in nested for n in sublist]
print(flat)   # [1, 2, 3, 4, 5, 6]
```

### Mini Exercise

Given a list of test scores, compute: the average, the highest score, the lowest score, and a new list with all scores above the class average.

```python
scores = [72, 85, 91, 60, 78, 88, 95, 65, 82]

average    = sum(scores) / len(scores)
highest    = max(scores)
lowest     = min(scores)
above_avg  = [s for s in scores if s > average]

print(f"Average:     {average:.1f}")
print(f"Highest:     {highest}")
print(f"Lowest:      {lowest}")
print(f"Above avg:   {above_avg}")
```$$,
  'reading', '30 min', 1, 30
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'python-developer' AND m.order_index = 3
AND NOT EXISTS (
  SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 1
);

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'Dictionaries: Key-Value Lookup',
$$## Dictionaries: Key-Value Lookup

Dictionaries store data as key-value pairs. They are unordered (in Python 3.7+ they preserve insertion order), mutable, and provide O(1) average-case lookup.

### Creating Dictionaries

```python
# Literal syntax:
person = {
    "name":  "Alice",
    "age":   28,
    "city":  "New York",
}

# dict() constructor:
config = dict(host="localhost", port=5432, debug=True)

# Empty dictionary:
empty = {}
```

### Accessing Values

```python
person = {"name": "Alice", "age": 28}

# By key (raises KeyError if missing):
print(person["name"])        # Alice

# .get() — safe access (returns None if key missing):
print(person.get("age"))     # 28
print(person.get("email"))   # None
print(person.get("email", "No email"))   # No email
```

### Modifying Dictionaries

```python
d = {"a": 1, "b": 2}

d["c"]  = 3          # Add new key
d["a"]  = 100        # Update existing key
del d["b"]           # Delete key
popped = d.pop("c")  # Remove and return value → 3

d.update({"x": 10, "y": 20})   # Merge another dict in
```

### Iterating

```python
person = {"name": "Alice", "age": 28, "city": "NYC"}

# Keys:
for key in person:
    print(key)

# Values:
for value in person.values():
    print(value)

# Key-value pairs:
for key, value in person.items():
    print(f"  {key}: {value}")
```

### Dictionary Comprehensions

```python
# Square numbers:
squares = {n: n**2 for n in range(1, 6)}
print(squares)   # {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}

# Filter — keep items where value > 10:
big = {k: v for k, v in squares.items() if v > 10}
print(big)       # {4: 16, 5: 25}
```

### Nested Dictionaries

```python
users = {
    "alice": {"age": 28, "role": "admin"},
    "bob":   {"age": 34, "role": "user"},
}

print(users["alice"]["role"])   # admin

# Safe nested access:
role = users.get("charlie", {}).get("role", "unknown")
print(role)   # unknown
```

### Word Frequency Counter

A classic dictionary use-case:

```python
text   = "the cat sat on the mat the cat"
words  = text.split()
freq   = {}

for word in words:
    freq[word] = freq.get(word, 0) + 1

print(freq)
# {'the': 3, 'cat': 2, 'sat': 1, 'on': 1, 'mat': 1}

# Or with Counter (from collections):
from collections import Counter
freq = Counter(words)
print(freq.most_common(3))   # [('the', 3), ('cat', 2), ('sat', 1)]
```$$,
  'reading', '30 min', 2, 30
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'python-developer' AND m.order_index = 3
AND NOT EXISTS (
  SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 2
);

-- ============================================================
-- JAVASCRIPT DEVELOPER – Module 1: JS Syntax & Types
-- ============================================================

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'Variables: var, let, const',
$$## Variables: var, let, const

JavaScript has three ways to declare variables. Each has different scoping rules and behaviors.

### const — the default choice

```javascript
const name    = "Alice";
const age     = 25;
const PI      = 3.14159;

// name = "Bob";   // TypeError: Assignment to constant variable
```

Use `const` for values that will **never be reassigned**. This is your default choice — it prevents accidental reassignment.

### let — for values that change

```javascript
let score = 0;
score = score + 10;   // Fine — let can be reassigned
score += 5;

let message = "Hello";
message = "World";    // Fine
```

Use `let` when you know the value will change (counters, loop variables, flags).

### var — legacy (avoid in modern JS)

```javascript
var count = 0;
var count = 1;   // No error (redeclaration!) — this is a bug-prone behavior
```

`var` is function-scoped (not block-scoped), can be redeclared, and is hoisted. In modern code, always use `const` or `let`.

### Scoping Rules

```javascript
// Block scope (let and const):
{
    let blockVar  = "inside block";
    const blockConst = "also inside";
}
// console.log(blockVar);   // ReferenceError — not accessible outside

// var leaks out of blocks:
{
    var leaked = "I escape!";
}
console.log(leaked);   // "I escape!"  — this is bad behavior
```

### JavaScript Data Types

JavaScript has 7 primitive types and `object`:

```javascript
// Primitives:
const str    = "hello";          // string
const num    = 42;               // number (integers and floats share this type)
const big    = 9007199254740991n; // bigint
const bool   = true;             // boolean
const nothing = null;            // null (intentional absence)
const missing = undefined;       // undefined (uninitialized)
const id      = Symbol("uid");   // symbol (unique identifier)

// Object (reference type):
const obj  = { key: "value" };
const arr  = [1, 2, 3];
const fn   = function() {};
```

### typeof Operator

```javascript
console.log(typeof "hello");      // "string"
console.log(typeof 42);           // "number"
console.log(typeof true);         // "boolean"
console.log(typeof undefined);    // "undefined"
console.log(typeof null);         // "object"  ← famous JS quirk!
console.log(typeof {});           // "object"
console.log(typeof []);           // "object"  ← arrays are objects!
console.log(typeof function(){}); // "function"
```

### Template Literals (backtick strings)

```javascript
const user  = "Alice";
const score = 95;

// Old way (error-prone):
const msg1 = "Hello " + user + ", your score is " + score;

// Template literal (modern, readable):
const msg2 = `Hello ${user}, your score is ${score}`;
const calc = `2 + 2 = ${2 + 2}`;   // Expressions work too!

// Multi-line:
const multiline = `
  Name: ${user}
  Score: ${score}
`.trim();
```

### Type Coercion — The Famous JavaScript Footgun

```javascript
// Loose equality (==) coerces types — avoid it!
console.log(1 == "1");     // true  (string coerced to number)
console.log(0 == false);   // true  (false coerced to 0)
console.log(null == undefined);  // true

// Strict equality (===) — always use this!
console.log(1 === "1");    // false (different types)
console.log(0 === false);  // false
```

> **Rule**: Always use `===` and `!==` for comparisons. Never `==` or `!=`.$$,
  'reading', '25 min', 1, 25
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'javascript-developer' AND m.order_index = 1
AND NOT EXISTS (
  SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 1
);

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'Functions: Declarations, Expressions, and Arrows',
$$## Functions: Declarations, Expressions, and Arrows

JavaScript has several ways to define functions. Understanding the difference between them — especially around `this` binding and hoisting — is essential.

### Function Declaration

```javascript
// Hoisted — can be called BEFORE the definition in the file:
console.log(greet("Alice"));   // "Hello, Alice!"  — works!

function greet(name) {
    return `Hello, ${name}!`;
}
```

Function declarations are **hoisted** to the top of their scope, meaning you can call them before they appear in the code.

### Function Expression

```javascript
// NOT hoisted — must be defined before use:
// console.log(greet("Alice"));   // ReferenceError

const greet = function(name) {
    return `Hello, ${name}!`;
};

console.log(greet("Alice"));   // "Hello, Alice!"
```

### Arrow Functions (ES6+)

Arrow functions are a shorter syntax with a key difference: they **do not have their own `this`**.

```javascript
// Traditional:
const square = function(x) { return x * x; };

// Arrow function:
const square = (x) => { return x * x; };

// Even shorter (implicit return — no curly braces needed):
const square = x => x * x;

console.log(square(5));   // 25
```

### Multiple Parameters with Arrow Functions

```javascript
const add  = (a, b) => a + b;
const greet = (name, greeting = "Hello") => `${greeting}, ${name}!`;

console.log(add(3, 7));           // 10
console.log(greet("Alice"));      // Hello, Alice!
console.log(greet("Bob", "Hi"));  // Hi, Bob!
```

### Default Parameters

```javascript
function createUser(name, role = "user", active = true) {
    return { name, role, active };
}

createUser("Alice");               // { name: "Alice", role: "user", active: true }
createUser("Bob", "admin");        // { name: "Bob", role: "admin", active: true }
createUser("Carol", "mod", false); // { name: "Carol", role: "mod", active: false }
```

### Rest Parameters and Spread

```javascript
// Rest: collect remaining arguments into an array
function sum(...numbers) {
    return numbers.reduce((total, n) => total + n, 0);
}
console.log(sum(1, 2, 3, 4, 5));   // 15

// Spread: expand array into individual arguments
const nums = [1, 2, 3];
console.log(Math.max(...nums));     // 3
```

### The `this` Difference

```javascript
const timer = {
    count: 0,

    // Traditional — 'this' refers to the object that calls the method:
    startTraditional: function() {
        setInterval(function() {
            // 'this' is NOT the timer object here — it's Window/undefined
            // this.count++;  // Bug!
        }, 1000);
    },

    // Arrow — 'this' inherits from the enclosing scope:
    startArrow: function() {
        setInterval(() => {
            this.count++;   // Works! 'this' is the timer object
            console.log(this.count);
        }, 1000);
    }
};
```

### Mini Exercise

Write an arrow function `groupBy(array, key)` that groups an array of objects by the value of a given key.

```javascript
const groupBy = (array, key) => {
    return array.reduce((groups, item) => {
        const groupKey = item[key];
        if (!groups[groupKey]) groups[groupKey] = [];
        groups[groupKey].push(item);
        return groups;
    }, {});
};

const people = [
    { name: "Alice", dept: "Engineering" },
    { name: "Bob",   dept: "Marketing" },
    { name: "Carol", dept: "Engineering" },
];

console.log(groupBy(people, "dept"));
// { Engineering: [{Alice}, {Carol}], Marketing: [{Bob}] }
```$$,
  'reading', '30 min', 2, 30
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'javascript-developer' AND m.order_index = 1
AND NOT EXISTS (
  SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 2
);

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'Arrays and Objects In Depth',
$$## Arrays and Objects In Depth

Arrays and objects are the primary ways to organize data in JavaScript. Modern ES6+ syntax makes them much more powerful and ergonomic.

### Object Basics

```javascript
const user = {
    id:       1,
    name:     "Alice",
    email:    "alice@example.com",
    isActive: true,
};

// Property access:
console.log(user.name);          // Alice
console.log(user["email"]);      // alice@example.com  (bracket notation)

// Dynamic key access:
const key = "isActive";
console.log(user[key]);          // true
```

### Destructuring

Pull values out of objects and arrays into named variables:

```javascript
// Object destructuring:
const { name, email } = user;
console.log(name, email);   // Alice  alice@example.com

// With rename:
const { name: userName, email: userEmail } = user;

// With default:
const { role = "user" } = user;   // role is "user" (not in object)

// Array destructuring:
const [first, second, ...rest] = [10, 20, 30, 40, 50];
console.log(first, second, rest);   // 10  20  [30, 40, 50]

// Swap variables:
let a = 1, b = 2;
[a, b] = [b, a];
console.log(a, b);   // 2  1
```

### Spread Operator

```javascript
// Merge objects (later keys win):
const defaults   = { theme: "light", lang: "en", debug: false };
const userPrefs  = { theme: "dark", fontSize: 16 };
const config     = { ...defaults, ...userPrefs };
// { theme: "dark", lang: "en", debug: false, fontSize: 16 }

// Clone (shallow) an array or object:
const original   = [1, 2, 3];
const copy       = [...original];
copy.push(4);
console.log(original);   // [1, 2, 3]  — not modified!
```

### Modern Array Methods

```javascript
const products = [
    { id: 1, name: "Laptop",  price: 999,  inStock: true  },
    { id: 2, name: "Mouse",   price: 29,   inStock: false },
    { id: 3, name: "Monitor", price: 399,  inStock: true  },
    { id: 4, name: "Keyboard",price: 89,   inStock: true  },
];

// filter — keep items matching condition:
const inStock = products.filter(p => p.inStock);

// map — transform each item:
const names = products.map(p => p.name);
// ["Laptop", "Mouse", "Monitor", "Keyboard"]

// find — get first item matching condition:
const laptop = products.find(p => p.name === "Laptop");

// reduce — aggregate to single value:
const totalValue = products
    .filter(p => p.inStock)
    .reduce((sum, p) => sum + p.price, 0);
// 999 + 399 + 89 = 1487

// every / some — boolean checks:
const allInStock   = products.every(p => p.inStock);   // false
const someInStock  = products.some(p => p.inStock);    // true
```

### Optional Chaining (?.) and Nullish Coalescing (??)

```javascript
const response = {
    data: {
        user: {
            profile: {
                avatar: "alice.jpg"
            }
        }
    }
};

// Without optional chaining (error-prone):
// const avatar = response.data.user.profile.avatar;

// With optional chaining (safe):
const avatar  = response?.data?.user?.profile?.avatar;   // "alice.jpg"
const missing = response?.data?.order?.id;               // undefined (no error)

// Nullish coalescing — use default when null/undefined:
const name  = null;
const display = name ?? "Anonymous";   // "Anonymous"
const zero    = 0 ?? 42;              // 0  (0 is not null/undefined!)
const empty   = "" ?? "default";      // ""  (empty string is not null!)
```$$,
  'reading', '30 min', 3, 30
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'javascript-developer' AND m.order_index = 1
AND NOT EXISTS (
  SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 3
);

-- ============================================================
-- JAVASCRIPT DEVELOPER – Module 4: Async JavaScript
-- ============================================================

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'The Event Loop and Asynchronous JavaScript',
$$## The Event Loop and Asynchronous JavaScript

JavaScript is single-threaded but non-blocking. Understanding the event loop is key to writing correct async code.

### Why Async?

JavaScript runs on a single thread. Long operations (network requests, file reads, timers) would freeze the page if run synchronously. Instead, JS hands them off and continues executing, then handles the result when it is ready.

### The Call Stack, Web APIs, and the Queue

```
┌───────────────────────────────────────────┐
│           JavaScript Engine               │
│  ┌──────────────────┐  ┌──────────────┐  │
│  │    Call Stack    │  │   Heap       │  │
│  │  main()          │  │  (objects)   │  │
│  │  setTimeout cb   │  │              │  │
│  └──────────────────┘  └──────────────┘  │
└───────────────────────────────────────────┘
         ↑                  ↑
         │                  │
┌─────────────────┐  ┌──────────────────────┐
│    Web APIs     │  │   Callback Queue     │
│  setTimeout()   │  │  (task queue)        │
│  fetch()        │  └──────────────────────┘
│  DOM events     │         ↑
└─────────────────┘  ┌──────────────────────┐
                     │   Microtask Queue    │
                     │  (Promises, queueMicrotask) │
                     └──────────────────────┘
```

### Callbacks — The Original Async Pattern

```javascript
// setTimeout is async — callback runs after the delay:
console.log("1: start");

setTimeout(() => {
    console.log("3: timeout callback");
}, 0);   // Even with 0ms, it runs after synchronous code!

console.log("2: end");
// Output:
// 1: start
// 2: end
// 3: timeout callback
```

### Callback Hell — The Problem with Nested Callbacks

```javascript
// Ugly nested callbacks (avoid this pattern):
getUser(userId, function(user) {
    getPosts(user.id, function(posts) {
        getComments(posts[0].id, function(comments) {
            renderPage(user, posts, comments, function(result) {
                console.log("Done:", result);
                // Deep nesting makes this hard to read and maintain!
            });
        });
    });
});
```

### Promises — The Solution

```javascript
// A Promise is an object that represents an eventual value:
const fetchUser = (id) => {
    return new Promise((resolve, reject) => {
        // Simulate network request:
        setTimeout(() => {
            if (id > 0) {
                resolve({ id, name: "Alice" });   // Success
            } else {
                reject(new Error("Invalid ID"));  // Failure
            }
        }, 500);
    });
};

// .then() chains cleanly:
fetchUser(1)
    .then(user => {
        console.log("Got user:", user.name);
        return fetchPosts(user.id);   // Return another promise
    })
    .then(posts => {
        console.log("Got posts:", posts.length);
    })
    .catch(error => {
        console.error("Error:", error.message);   // Handles ALL errors above
    })
    .finally(() => {
        console.log("Request complete");           // Always runs
    });
```

### async/await — The Modern Way

`async/await` is syntactic sugar over Promises. It makes async code look synchronous.

```javascript
async function loadUserDashboard(userId) {
    try {
        const user    = await fetchUser(userId);
        const posts   = await fetchPosts(user.id);
        const friends = await fetchFriends(user.id);

        return { user, posts, friends };
    } catch (error) {
        console.error("Dashboard failed:", error.message);
        throw error;   // Re-throw if you want callers to handle it
    }
}

// Call it:
const data = await loadUserDashboard(1);
```

### Running Promises in Parallel

```javascript
// Sequential (slow — waits for each before starting next):
const user    = await fetchUser(1);     // 500ms
const posts   = await fetchPosts(1);    // 500ms
// Total: ~1000ms

// Parallel (fast — all start at once):
const [user, posts, friends] = await Promise.all([
    fetchUser(1),    // ↓
    fetchPosts(1),   // All start simultaneously
    fetchFriends(1), // ↓
]);
// Total: ~500ms (max of all three)

// Promise.allSettled — wait for all, even if some fail:
const results = await Promise.allSettled([
    fetchUser(1),
    fetchInvalidData(),  // This will reject
]);
// results[0].status === "fulfilled"
// results[1].status === "rejected"
```$$,
  'reading', '35 min', 1, 35
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'javascript-developer' AND m.order_index = 4
AND NOT EXISTS (
  SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 1
);

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'Fetch API and Real Network Requests',
$$## Fetch API and Real Network Requests

The `fetch()` API is the modern way to make HTTP requests from JavaScript. It returns Promises and works with async/await beautifully.

### Basic GET Request

```javascript
// Simple fetch — always returns a Response object:
async function getUsers() {
    const response = await fetch("https://api.example.com/users");

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const users = await response.json();   // Parse JSON body
    return users;
}
```

> `fetch()` only rejects on **network failure** (no internet, DNS failure). A 404 or 500 response is **not** a rejection — you must check `response.ok`.

### POST Request with JSON Body

```javascript
async function createUser(userData) {
    const response = await fetch("https://api.example.com/users", {
        method:  "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`,
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Create user failed");
    }

    return response.json();
}

// Usage:
const newUser = await createUser({ name: "Alice", email: "alice@example.com" });
```

### A Reusable API Client

```javascript
class ApiClient {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    async request(path, options = {}) {
        const url = `${this.baseURL}${path}`;
        const config = {
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
            ...options,
        };

        const response = await fetch(url, config);

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `HTTP ${response.status}`);
        }

        // Handle empty responses (204 No Content):
        if (response.status === 204) return null;
        return response.json();
    }

    get(path, headers)         { return this.request(path, { method: "GET", headers }); }
    post(path, body, headers)  { return this.request(path, { method: "POST", body: JSON.stringify(body), headers }); }
    put(path, body, headers)   { return this.request(path, { method: "PUT",  body: JSON.stringify(body), headers }); }
    delete(path, headers)      { return this.request(path, { method: "DELETE", headers }); }
}

const api = new ApiClient("https://api.example.com");

const users    = await api.get("/users");
const newUser  = await api.post("/users", { name: "Alice" });
await api.delete(`/users/${userId}`);
```

### Error Handling Patterns

```javascript
// Pattern 1: try/catch (clean for async functions)
async function safeLoad() {
    try {
        const data = await api.get("/data");
        return { data, error: null };
    } catch (error) {
        console.error("Load failed:", error.message);
        return { data: null, error };
    }
}

// Pattern 2: .catch() at the call site
const users = await api.get("/users").catch(err => {
    showToast(`Failed to load users: ${err.message}`);
    return [];   // Return fallback value
});
```

### AbortController — Cancel Requests

```javascript
// Cancel a fetch if the user navigates away:
function fetchWithTimeout(url, timeoutMs = 5000) {
    const controller = new AbortController();

    const timeout = setTimeout(() => {
        controller.abort();
    }, timeoutMs);

    return fetch(url, { signal: controller.signal })
        .then(response => {
            clearTimeout(timeout);
            return response.json();
        });
}
```$$,
  'reading', '30 min', 2, 30
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'javascript-developer' AND m.order_index = 4
AND NOT EXISTS (
  SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 2
);

-- ============================================================
-- TYPESCRIPT DEVELOPER – Module 1: TypeScript Basics
-- ============================================================

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'Why TypeScript? Setup and Basic Types',
$$## Why TypeScript? Setup and Basic Types

TypeScript is JavaScript with a type system. It catches entire classes of bugs at compile-time — before your code ever runs.

### Why TypeScript?

```javascript
// JavaScript — this bug only appears at runtime:
function calculateArea(width, height) {
    return width * height;
}

calculateArea("5", 10);   // Returns "5555555555" instead of 50 — no error!
```

```typescript
// TypeScript — caught immediately at compile-time:
function calculateArea(width: number, height: number): number {
    return width * height;
}

calculateArea("5", 10);
//             ^^^
// Error: Argument of type 'string' is not assignable to parameter of type 'number'
```

### Setup

```bash
npm install -D typescript
npx tsc --init   # Creates tsconfig.json
```

Recommended `tsconfig.json` settings:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

`"strict": true` enables the most important safety checks: `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, and more.

### Basic Type Annotations

```typescript
// Variables:
const name:     string  = "Alice";
const age:      number  = 25;
const active:   boolean = true;
const nothing:  null    = null;
const missing:  undefined = undefined;

// TypeScript often infers types — annotations are optional when obvious:
const city = "New York";   // TypeScript infers: string
const year = 2024;         // TypeScript infers: number
```

### Function Types

```typescript
// Parameter types and return type:
function greet(name: string, greeting: string = "Hello"): string {
    return `${greeting}, ${name}!`;
}

// Arrow function:
const add = (a: number, b: number): number => a + b;

// Void — function returns nothing:
function log(message: string): void {
    console.log(message);
}

// Never — function never returns (throws or loops forever):
function throwError(msg: string): never {
    throw new Error(msg);
}
```

### Arrays and Tuples

```typescript
// Array of strings:
const names: string[] = ["Alice", "Bob", "Carol"];
const nums:  number[] = [1, 2, 3];

// Generic array syntax (same result):
const tags: Array<string> = ["typescript", "javascript"];

// Tuple — fixed-length array with specific types at each position:
const point:   [number, number]          = [10, 20];
const record:  [string, number, boolean] = ["Alice", 28, true];

// Destructure a tuple:
const [x, y] = point;
```

### Union Types

A value that can be one of several types:

```typescript
let id: string | number;
id = "abc123";   // OK
id = 42;         // OK
// id = true;    // Error: boolean not assignable

function formatId(id: string | number): string {
    // Narrow the type before using type-specific methods:
    if (typeof id === "string") {
        return id.toUpperCase();
    }
    return id.toString();
}
```

### The `any` Type — Use Sparingly

```typescript
let data: any = fetchSomething();
data.foo.bar.baz;   // No error — but no protection either

// Better: use 'unknown' which forces you to narrow before use:
let safeData: unknown = fetchSomething();
// safeData.foo;   // Error: Object is of type 'unknown'

if (typeof safeData === "string") {
    console.log(safeData.toUpperCase());   // OK after narrowing
}
```

> Enable `"noImplicitAny": true` (included in `"strict": true`) to prevent TypeScript from silently inferring `any`.$$,
  'reading', '30 min', 1, 30
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'typescript-developer' AND m.order_index = 1
AND NOT EXISTS (
  SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 1
);

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'Interfaces and Type Aliases',
$$## Interfaces and Type Aliases

TypeScript gives you two ways to define the shape of an object: `interface` and `type`. Understanding both — and when to use each — is foundational TypeScript knowledge.

### interface

```typescript
interface User {
    id:        number;
    name:      string;
    email:     string;
    createdAt: Date;
}

function displayUser(user: User): void {
    console.log(`${user.name} (${user.email})`);
}

const alice: User = {
    id:        1,
    name:      "Alice",
    email:     "alice@example.com",
    createdAt: new Date(),
};

displayUser(alice);
```

### Optional and Readonly Properties

```typescript
interface Product {
    readonly id:    number;     // Cannot be modified after creation
    name:           string;
    description?:  string;     // Optional (may be undefined)
    price:         number;
    discountPrice?: number;    // Optional
}

const laptop: Product = {
    id:    1,
    name:  "MacBook Pro",
    price: 1999,
};
// laptop.id = 2;   // Error: Cannot assign to 'id' because it is read-only
```

### type Alias

```typescript
// Type alias can describe any type — not just objects:
type ID     = string | number;
type Status = "active" | "inactive" | "pending";   // Literal union type
type Point  = { x: number; y: number };
type Callback = (error: Error | null, data?: unknown) => void;

const userId: ID     = "abc-123";
const status: Status = "active";
// status = "deleted";   // Error: not in the union!
```

### interface vs type — Key Differences

| Feature                   | `interface`  | `type`       |
|---------------------------|-------------|--------------|
| Extend / inherit          | Yes (`extends`) | Yes (`&`)  |
| Declaration merging       | Yes          | No           |
| Primitive/union/tuple     | No           | Yes          |
| Best for object shapes    | ✓ preferred  | Works too    |

```typescript
// Interface extension:
interface Animal {
    name: string;
    sound(): string;
}

interface Dog extends Animal {
    breed: string;
}

// Type intersection (same effect):
type Dog = Animal & { breed: string };
```

### Declaration Merging (interfaces only)

```typescript
// You can "add" to an existing interface across multiple declarations:
interface Config {
    host: string;
}

interface Config {
    port: number;   // Merged into Config — now has both host and port
}

const config: Config = { host: "localhost", port: 3000 };
```

This is how library `.d.ts` files extend third-party types.

### Indexable Types

```typescript
// A dictionary-like object with unknown keys:
interface StringMap {
    [key: string]: string;
}

const headers: StringMap = {
    "Content-Type": "application/json",
    "Authorization": "Bearer token123",
};

// Index signature with known and unknown keys:
interface FlexibleConfig {
    name:       string;           // Known key
    [key: string]: string | number;   // Any other keys
}
```

### Discriminated Unions (Power Pattern)

```typescript
type LoadingState = { status: "loading" };
type SuccessState = { status: "success"; data: User[] };
type ErrorState   = { status: "error"; message: string };

type RequestState = LoadingState | SuccessState | ErrorState;

function render(state: RequestState): string {
    switch (state.status) {
        case "loading": return "Loading...";
        case "success": return `${state.data.length} users`;  // data is typed!
        case "error":   return `Error: ${state.message}`;     // message is typed!
    }
}
```$$,
  'reading', '35 min', 2, 35
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'typescript-developer' AND m.order_index = 1
AND NOT EXISTS (
  SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 2
);

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'Generics: Writing Reusable Typed Code',
$$## Generics: Writing Reusable Typed Code

Generics let you write functions, classes, and types that work with any type — while still preserving full type safety. They are one of the most powerful features of TypeScript.

### The Problem Generics Solve

```typescript
// Without generics — we lose type info:
function identity(value: any): any {
    return value;
}
const result = identity("hello");
// result is typed as 'any' — we lost the string type!

// With generics — type is preserved:
function identity<T>(value: T): T {
    return value;
}
const result1 = identity("hello");   // string
const result2 = identity(42);        // number
const result3 = identity([1, 2, 3]); // number[]
```

### Generic Functions

```typescript
// Find the first item matching a predicate:
function findFirst<T>(array: T[], predicate: (item: T) => boolean): T | undefined {
    return array.find(predicate);
}

const users   = [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }];
const found   = findFirst(users, u => u.id === 2);
// found is typed as { id: number; name: string } | undefined

// Pair two values of different types:
function pair<A, B>(first: A, second: B): [A, B] {
    return [first, second];
}
const result = pair("hello", 42);   // [string, number]
```

### Generic Constraints

```typescript
// Constraint: T must have a 'length' property:
function longest<T extends { length: number }>(a: T, b: T): T {
    return a.length >= b.length ? a : b;
}

longest("hello", "hi");        // "hello"  — strings have .length
longest([1, 2, 3], [4, 5]);   // [1, 2, 3] — arrays have .length
// longest(1, 2);              // Error: number doesn't have .length
```

### Generic Interfaces and Classes

```typescript
// Generic response wrapper (very common in APIs):
interface ApiResponse<T> {
    data:    T;
    status:  number;
    message: string;
}

const userResponse: ApiResponse<User>  = { data: alice, status: 200, message: "OK" };
const listResponse: ApiResponse<User[]> = { data: [alice], status: 200, message: "OK" };

// Generic class:
class Repository<T extends { id: number }> {
    private items: T[] = [];

    add(item: T): void {
        this.items.push(item);
    }

    findById(id: number): T | undefined {
        return this.items.find(item => item.id === id);
    }

    getAll(): T[] {
        return [...this.items];
    }
}

const userRepo = new Repository<User>();
userRepo.add(alice);
const found = userRepo.findById(1);   // typed as User | undefined
```

### Built-in Utility Types (Generic)

TypeScript ships utility types built with generics:

```typescript
interface User {
    id:    number;
    name:  string;
    email: string;
    role:  string;
}

// Partial<T> — all properties optional:
type UpdateUserDto = Partial<User>;
// { id?: number; name?: string; email?: string; role?: string }

// Required<T> — all properties required:
type StrictUser = Required<User>;

// Pick<T, K> — select specific properties:
type UserSummary = Pick<User, "id" | "name">;
// { id: number; name: string }

// Omit<T, K> — exclude specific properties:
type CreateUserDto = Omit<User, "id">;
// { name: string; email: string; role: string }

// Readonly<T> — all properties readonly:
type ImmutableUser = Readonly<User>;

// Record<K, V> — dictionary type:
type UserById = Record<number, User>;
type StatusMap = Record<"active" | "inactive", User[]>;
```$$,
  'reading', '35 min', 3, 35
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'typescript-developer' AND m.order_index = 1
AND NOT EXISTS (
  SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 3
);

-- ============================================================
-- TYPESCRIPT DEVELOPER – Module 3: Advanced Types
-- ============================================================

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'Mapped Types and Conditional Types',
$$## Mapped Types and Conditional Types

Advanced TypeScript gives you a type-level programming system. Mapped types transform existing types, and conditional types choose between types based on conditions.

### Mapped Types

A mapped type creates a new type by iterating over the keys of another type:

```typescript
// Make all properties optional:
type Optional<T> = {
    [K in keyof T]?: T[K];
};

// Make all properties nullable:
type Nullable<T> = {
    [K in keyof T]: T[K] | null;
};

// Make all properties readonly:
type Immutable<T> = {
    readonly [K in keyof T]: T[K];
};

interface User {
    id:    number;
    name:  string;
    email: string;
}

type OptionalUser   = Optional<User>;
// { id?: number; name?: string; email?: string }

type NullableUser   = Nullable<User>;
// { id: number | null; name: string | null; email: string | null }
```

### Using `as` for Key Remapping

```typescript
// Prefix all keys:
type Getters<T> = {
    [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type UserGetters = Getters<{ name: string; age: number }>;
// { getName: () => string; getAge: () => number }

// Filter out specific keys:
type NonNullableProperties<T> = {
    [K in keyof T as T[K] extends null | undefined ? never : K]: T[K];
};
```

### Conditional Types

```typescript
// T extends U ? X : Y
// "If T is assignable to U, then X; otherwise Y"

type IsString<T> = T extends string ? "yes" : "no";

type Test1 = IsString<string>;   // "yes"
type Test2 = IsString<number>;   // "no"
type Test3 = IsString<"hello">;  // "yes" — "hello" extends string

// Unwrap arrays:
type ElementType<T> = T extends Array<infer Item> ? Item : T;

type StrElement  = ElementType<string[]>;    // string
type NumElement  = ElementType<number[]>;    // number
type NoElement   = ElementType<string>;      // string (not an array)
```

### The `infer` keyword

`infer` lets you extract and capture a type within a conditional type:

```typescript
// Extract the return type of a function:
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type FnReturn = ReturnType<() => Promise<User>>;   // Promise<User>

// Extract Promise value:
type Awaited<T> = T extends Promise<infer V> ? V : T;
type UserValue  = Awaited<Promise<User>>;   // User
```

### Template Literal Types

```typescript
type EventName = "click" | "change" | "keydown";
type Handler   = `on${Capitalize<EventName>}`;
// "onClick" | "onChange" | "onKeydown"

type HttpMethod = "get" | "post" | "put" | "delete";
type Route      = `/${string}`;
type Endpoint   = `${Uppercase<HttpMethod>} ${Route}`;
// "GET /..." | "POST /..." | "PUT /..." | "DELETE /..."

// Useful for type-safe event systems:
interface EventMap {
    click:   MouseEvent;
    keydown: KeyboardEvent;
    change:  Event;
}

type EventListenerMap = {
    [K in keyof EventMap as `on${Capitalize<K>}`]: (event: EventMap[K]) => void;
};
// { onClick: (event: MouseEvent) => void; onKeydown: (event: KeyboardEvent) => void; ... }
```

### Real-World Example: Type-Safe Form Validation

```typescript
type FormErrors<T> = {
    [K in keyof T]?: string;
};

type FormTouched<T> = {
    [K in keyof T]: boolean;
};

interface SignupForm {
    email:    string;
    password: string;
    name:     string;
}

type SignupErrors  = FormErrors<SignupForm>;
// { email?: string; password?: string; name?: string }

type SignupTouched = FormTouched<SignupForm>;
// { email: boolean; password: boolean; name: boolean }
```$$,
  'reading', '40 min', 1, 40
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'typescript-developer' AND m.order_index = 3
AND NOT EXISTS (
  SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 1
);

-- ============================================================
-- TYPESCRIPT DEVELOPER – Module 5: TypeScript with React
-- ============================================================

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'Typing React Components and Hooks',
$$## Typing React Components and Hooks

TypeScript makes React components more robust by catching prop and state errors at compile time.

### Typing Props

```typescript
// Define props as an interface:
interface ButtonProps {
    label:    string;
    onClick:  () => void;
    variant?: "primary" | "secondary" | "danger";
    disabled?: boolean;
    children?: React.ReactNode;
}

const Button = ({ label, onClick, variant = "primary", disabled = false }: ButtonProps) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`btn btn-${variant}`}
        >
            {label}
        </button>
    );
};

// Usage — TypeScript enforces required props:
<Button label="Submit" onClick={handleSubmit} />
<Button label="Delete" onClick={handleDelete} variant="danger" />
// <Button onClick={handleSubmit} />   // Error: 'label' is missing
```

### Typing useState

```typescript
// TypeScript usually infers the type from the initial value:
const [count, setCount] = useState(0);           // number inferred
const [name,  setName]  = useState("Alice");     // string inferred

// When initial value is null or ambiguous, provide a type parameter:
const [user,  setUser]  = useState<User | null>(null);
const [items, setItems] = useState<Product[]>([]);

// Update functions are fully typed:
setUser({ id: 1, name: "Alice", email: "alice@example.com" });
// setUser(42);   // Error: number not assignable to User | null
```

### Typing useRef

```typescript
// Ref pointing to a DOM element:
const inputRef = useRef<HTMLInputElement>(null);

useEffect(() => {
    inputRef.current?.focus();   // Optional chaining because it starts null
}, []);

return <input ref={inputRef} />;

// Ref as a mutable container (no DOM):
const timerRef = useRef<NodeJS.Timeout | null>(null);
```

### Typing useReducer

```typescript
type State = {
    count:   number;
    loading: boolean;
    error:   string | null;
};

type Action =
    | { type: "increment" }
    | { type: "decrement" }
    | { type: "setLoading"; payload: boolean }
    | { type: "setError";   payload: string };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "increment":   return { ...state, count: state.count + 1 };
        case "decrement":   return { ...state, count: state.count - 1 };
        case "setLoading":  return { ...state, loading: action.payload };
        case "setError":    return { ...state, error: action.payload };
    }
}

const [state, dispatch] = useReducer(reducer, { count: 0, loading: false, error: null });

dispatch({ type: "increment" });
dispatch({ type: "setLoading", payload: true });
// dispatch({ type: "unknown" });   // Error: not in union
```

### Typing Context

```typescript
interface ThemeContextType {
    theme:     "light" | "dark";
    setTheme:  (theme: "light" | "dark") => void;
}

// Always provide a meaningful default (or throw if undefined):
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Safe custom hook:
function useTheme(): ThemeContextType {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return context;
}

// Provider component:
function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<"light" | "dark">("light");
    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
```$$,
  'reading', '35 min', 1, 35
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'typescript-developer' AND m.order_index = 5
AND NOT EXISTS (
  SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 1
);
