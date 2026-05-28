-- ============================================================
-- Unleash Coding – Migration 016
-- Quiz questions for lessons added in migrations 012-014
-- ============================================================
-- Pattern: look up lesson_id by joining through modules → learning_paths,
-- then insert with ON CONFLICT DO NOTHING (lesson_quizzes has no unique
-- constraint, so we check with WHERE NOT EXISTS on order_index + lesson_id)
-- ============================================================

-- ============================================================
-- Helper: add a unique constraint on lesson_quizzes if not present
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'uq_quiz_lesson_order'
  ) THEN
    ALTER TABLE public.lesson_quizzes
      ADD CONSTRAINT uq_quiz_lesson_order UNIQUE (lesson_id, order_index);
  END IF;
END $$;

-- ============================================================
-- PYTHON DEVELOPER – Module 1 Lesson 1: Variables & Data Types
-- ============================================================
WITH target_lesson AS (
  SELECT l.id FROM public.lessons l
  JOIN public.modules m ON m.id = l.module_id
  JOIN public.learning_paths lp ON lp.id = m.path_id
  WHERE lp.slug = 'python-developer' AND m.order_index = 1 AND l.order_index = 1
)
INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT
  tl.id,
  q.question, q.options::jsonb, q.correct_answer, q.explanation, q.order_index
FROM target_lesson tl, (VALUES
  (1, 'Which of the following is an immutable data type in Python?',
   '["list", "dict", "tuple", "set"]',
   'tuple',
   'Tuples are immutable — once created, their elements cannot be changed. Lists, dicts, and sets are all mutable.'),
  (2, 'What is the result of type(3.14)?',
   '["<class ''int''>", "<class ''float''>", "<class ''decimal''>", "<class ''number''>"]',
   '<class ''float''>',
   'Python represents decimal numbers as float by default.'),
  (3, 'What does the ** operator do in Python?',
   '["Multiply by 2", "Integer division", "Exponentiation", "Bitwise XOR"]',
   'Exponentiation',
   '** is the exponentiation operator: 2 ** 10 = 1024.'),
  (4, 'What is the difference between = and ==?',
   '["No difference", "= compares, == assigns", "= assigns, == compares", "Both assign"]',
   '= assigns, == compares',
   '= is the assignment operator. == is the equality comparison operator that returns True or False.')
) AS q(order_index, question, options, correct_answer, explanation)
ON CONFLICT (lesson_id, order_index) DO NOTHING;

-- ============================================================
-- PYTHON DEVELOPER – Module 1 Lesson 3: Control Flow
-- ============================================================
WITH target_lesson AS (
  SELECT l.id FROM public.lessons l
  JOIN public.modules m ON m.id = l.module_id
  JOIN public.learning_paths lp ON lp.id = m.path_id
  WHERE lp.slug = 'python-developer' AND m.order_index = 1 AND l.order_index = 3
)
INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT tl.id, q.question, q.options::jsonb, q.correct_answer, q.explanation, q.order_index
FROM target_lesson tl, (VALUES
  (1, 'What is the output of: x = 5; print("positive" if x > 0 else "non-positive")?',
   '["positive", "non-positive", "5", "Error"]',
   'positive',
   'The ternary (conditional) expression evaluates to "positive" because x=5 > 0 is True.'),
  (2, 'Which of the following is NOT a valid comparison operator in Python?',
   '["!=", ">=", "<>", "<="]',
   '<>',
   '<> was the old Python 2 "not equal" operator. In Python 3, only != is valid.'),
  (3, 'What does the pass statement do?',
   '["Exits the block", "Skips to next iteration", "Does nothing (placeholder)", "Raises an exception"]',
   'Does nothing (placeholder)',
   'pass is a no-op. It is used as a placeholder when a block is syntactically required but you have nothing to put there yet.')
) AS q(order_index, question, options, correct_answer, explanation)
ON CONFLICT (lesson_id, order_index) DO NOTHING;

-- ============================================================
-- PYTHON DEVELOPER – Module 1 Lesson 4: Loops
-- ============================================================
WITH target_lesson AS (
  SELECT l.id FROM public.lessons l
  JOIN public.modules m ON m.id = l.module_id
  JOIN public.learning_paths lp ON lp.id = m.path_id
  WHERE lp.slug = 'python-developer' AND m.order_index = 1 AND l.order_index = 4
)
INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT tl.id, q.question, q.options::jsonb, q.correct_answer, q.explanation, q.order_index
FROM target_lesson tl, (VALUES
  (1, 'What does range(0, 10, 2) produce?',
   '["[0,2,4,6,8,10]", "[0,2,4,6,8]", "[2,4,6,8]", "[0,2,4,6,8,9]"]',
   '[0,2,4,6,8]',
   'range(start, stop, step) counts from 0 to 9 (not including 10) with step 2.'),
  (2, 'Which keyword skips the rest of the current loop body and moves to the next iteration?',
   '["break", "return", "continue", "next"]',
   'continue',
   'continue jumps to the next loop iteration without executing the remaining code in the current iteration.'),
  (3, 'What is a list comprehension?',
   '["A way to document lists", "A compact syntax for creating lists", "A method to sort lists", "A list of tuples"]',
   'A compact syntax for creating lists',
   '[expr for item in iterable if condition] is a concise way to build a new list from an existing one.')
) AS q(order_index, question, options, correct_answer, explanation)
ON CONFLICT (lesson_id, order_index) DO NOTHING;

-- ============================================================
-- JAVASCRIPT DEVELOPER – Module 1 Lesson 1: Variables
-- ============================================================
WITH target_lesson AS (
  SELECT l.id FROM public.lessons l
  JOIN public.modules m ON m.id = l.module_id
  JOIN public.learning_paths lp ON lp.id = m.path_id
  WHERE lp.slug = 'javascript-developer' AND m.order_index = 1 AND l.order_index = 1
)
INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT tl.id, q.question, q.options::jsonb, q.correct_answer, q.explanation, q.order_index
FROM target_lesson tl, (VALUES
  (1, 'What is the key difference between let and const?',
   '["let is block-scoped, const is function-scoped", "const cannot be reassigned, let can", "let is faster than const", "There is no difference"]',
   'const cannot be reassigned, let can',
   'Both let and const are block-scoped. const prevents reassignment of the variable binding (though objects it holds can still be mutated).'),
  (2, 'What is the result of typeof null?',
   '["\"null\"", "\"undefined\"", "\"object\"", "\"boolean\""]',
   '"object"',
   'typeof null === "object" is a well-known JavaScript bug that has existed since version 1 and cannot be changed for backward compatibility.'),
  (3, 'What is the result of 1 + "2"?',
   '["3", "\"12\"", "NaN", "TypeError"]',
   '"12"',
   'When + has a string operand, JavaScript coerces the other operand to a string and concatenates them.'),
  (4, 'What does === check for?',
   '["Value equality only", "Type equality only", "Both value and type equality", "Object reference equality"]',
   'Both value and type equality',
   '=== (strict equality) checks that both value AND type are the same. 1 === "1" is false because the types differ.')
) AS q(order_index, question, options, correct_answer, explanation)
ON CONFLICT (lesson_id, order_index) DO NOTHING;

-- ============================================================
-- JAVASCRIPT DEVELOPER – Async: Event Loop
-- ============================================================
WITH target_lesson AS (
  SELECT l.id FROM public.lessons l
  JOIN public.modules m ON m.id = l.module_id
  JOIN public.learning_paths lp ON lp.id = m.path_id
  WHERE lp.slug = 'javascript-developer' AND m.order_index = 4 AND l.order_index = 1
)
INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT tl.id, q.question, q.options::jsonb, q.correct_answer, q.explanation, q.order_index
FROM target_lesson tl, (VALUES
  (1, 'What does the JavaScript event loop do?',
   '["Runs JavaScript code in parallel threads", "Continuously checks if the call stack is empty and moves tasks from the queue to the stack", "Handles DOM events only", "Manages memory allocation"]',
   'Continuously checks if the call stack is empty and moves tasks from the queue to the stack',
   'The event loop''s job is to look at the call stack and the callback queue. If the stack is empty, it takes the first item from the queue and pushes it onto the stack.'),
  (2, 'Which runs first: setTimeout(fn, 0) or a Promise.then(fn)?',
   '["setTimeout", "Promise.then", "They run simultaneously", "It depends on the browser"]',
   'Promise.then',
   'Promises use the microtask queue, which is processed before the macrotask queue (where setTimeout callbacks live). Microtasks always run before the next macrotask.'),
  (3, 'What does async/await do to the code that follows an await expression?',
   '["Blocks the entire thread", "Schedules it as a microtask when the awaited Promise resolves", "Runs it on a worker thread", "Runs it synchronously"]',
   'Schedules it as a microtask when the awaited Promise resolves',
   'await suspends the async function and schedules its continuation as a microtask when the awaited Promise settles — without blocking the thread.')
) AS q(order_index, question, options, correct_answer, explanation)
ON CONFLICT (lesson_id, order_index) DO NOTHING;

-- ============================================================
-- TYPESCRIPT DEVELOPER – Module 1 Lesson 1: Why TS / Basic Types
-- ============================================================
WITH target_lesson AS (
  SELECT l.id FROM public.lessons l
  JOIN public.modules m ON m.id = l.module_id
  JOIN public.learning_paths lp ON lp.id = m.path_id
  WHERE lp.slug = 'typescript-developer' AND m.order_index = 1 AND l.order_index = 1
)
INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT tl.id, q.question, q.options::jsonb, q.correct_answer, q.explanation, q.order_index
FROM target_lesson tl, (VALUES
  (1, 'What is TypeScript''s primary advantage over JavaScript?',
   '["It runs faster", "It adds static type checking that catches errors at compile time", "It removes the need for semicolons", "It adds classes to JavaScript"]',
   'It adds static type checking that catches errors at compile time',
   'TypeScript''s type system catches type errors before your code runs, making large codebases more maintainable.'),
  (2, 'What does the ? after a property name mean in TypeScript?',
   '["The property is required", "The property is optional (can be undefined)", "The property is readonly", "The property can be null"]',
   'The property is optional (can be undefined)',
   'name?: string means the name property may be present (as string) or absent (undefined).'),
  (3, 'What is the unknown type used for?',
   '["A variable whose type you know but want to skip", "Like any, but forces you to check the type before using it", "For variables that will never be assigned", "For union types"]',
   'Like any, but forces you to check the type before using it',
   'unknown accepts any value but requires a type check (typeof, instanceof) before you can perform operations on it. It is the type-safe version of any.'),
  (4, 'What does the never type represent?',
   '["A value that is always undefined", "A value that can be anything", "A type that should never occur (unreachable code or infinite loops)", "An empty object type"]',
   'A type that should never occur (unreachable code or infinite loops)',
   'never is the return type of functions that throw or loop forever, and the bottom of type narrowing exhaustive checks.')
) AS q(order_index, question, options, correct_answer, explanation)
ON CONFLICT (lesson_id, order_index) DO NOTHING;

-- ============================================================
-- TYPESCRIPT DEVELOPER – Interfaces
-- ============================================================
WITH target_lesson AS (
  SELECT l.id FROM public.lessons l
  JOIN public.modules m ON m.id = l.module_id
  JOIN public.learning_paths lp ON lp.id = m.path_id
  WHERE lp.slug = 'typescript-developer' AND m.order_index = 1 AND l.order_index = 2
)
INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT tl.id, q.question, q.options::jsonb, q.correct_answer, q.explanation, q.order_index
FROM target_lesson tl, (VALUES
  (1, 'What is the key difference between interface and type alias?',
   '["No difference at all", "Interfaces can be extended and merged; type aliases support unions and computed types", "type aliases are faster at compile time", "Interfaces can only be used for objects"]',
   'Interfaces can be extended and merged; type aliases support unions and computed types',
   'Interfaces support declaration merging (two interface blocks with the same name merge). Type aliases are more powerful for union types, intersection types, and mapped types.'),
  (2, 'How do you extend an interface in TypeScript?',
   '["interface Child implements Parent", "interface Child extends Parent", "interface Child inherits Parent", "interface Child uses Parent"]',
   'interface Child extends Parent',
   'extends is used to create an interface that includes all properties of another interface plus new ones.'),
  (3, 'What does Readonly<T> do?',
   '["Makes all properties optional", "Makes all properties required", "Makes all properties immutable (cannot be reassigned)", "Creates a copy of T"]',
   'Makes all properties immutable (cannot be reassigned)',
   'Readonly<T> creates a type identical to T but every property is marked readonly — assigning to a property causes a compile error.')
) AS q(order_index, question, options, correct_answer, explanation)
ON CONFLICT (lesson_id, order_index) DO NOTHING;

-- ============================================================
-- REACT DEVELOPER – JSX, Components, Props
-- ============================================================
WITH target_lesson AS (
  SELECT l.id FROM public.lessons l
  JOIN public.modules m ON m.id = l.module_id
  JOIN public.learning_paths lp ON lp.id = m.path_id
  WHERE lp.slug = 'react-developer' AND m.order_index = 1 AND l.order_index = 1
)
INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT tl.id, q.question, q.options::jsonb, q.correct_answer, q.explanation, q.order_index
FROM target_lesson tl, (VALUES
  (1, 'Why must React component names start with a capital letter?',
   '["It is just a convention", "React uses it to distinguish components from HTML elements", "It makes JavaScript run faster", "It enables TypeScript support"]',
   'React uses it to distinguish components from HTML elements',
   'In JSX, <div> renders an HTML div element, but <Div> looks for a React component named Div. The capital letter is how JSX tells the difference.'),
  (2, 'What is the purpose of the key prop when rendering lists?',
   '["To style list items", "To help React identify which items changed, were added, or removed", "To pass data to child components", "It has no special purpose"]',
   'To help React identify which items changed, were added, or removed',
   'React uses the key prop for efficient reconciliation. A stable, unique key lets React minimize DOM operations when a list changes.'),
  (3, 'Can you modify props inside a component?',
   '["Yes, always", "No, props are read-only", "Yes, but only with useState", "Yes, but only functional components can"]',
   'No, props are read-only',
   'Props flow one-way from parent to child and are read-only inside the receiving component. To affect parent state, the parent passes a callback function as a prop.')
) AS q(order_index, question, options, correct_answer, explanation)
ON CONFLICT (lesson_id, order_index) DO NOTHING;

-- ============================================================
-- REACT DEVELOPER – useState, useEffect
-- ============================================================
WITH target_lesson AS (
  SELECT l.id FROM public.lessons l
  JOIN public.modules m ON m.id = l.module_id
  JOIN public.learning_paths lp ON lp.id = m.path_id
  WHERE lp.slug = 'react-developer' AND m.order_index = 1 AND l.order_index = 2
)
INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT tl.id, q.question, q.options::jsonb, q.correct_answer, q.explanation, q.order_index
FROM target_lesson tl, (VALUES
  (1, 'What happens when you call a state setter function (e.g., setCount)?',
   '["The state changes immediately and synchronously", "React schedules a re-render with the new state value", "The component unmounts and remounts", "Nothing until the next useEffect runs"]',
   'React schedules a re-render with the new state value',
   'React batches state updates and schedules a re-render. The state value in the current render does not change; the next render will have the new value.'),
  (2, 'When does a useEffect with an empty dependency array [] run?',
   '["After every render", "Never", "Once after the initial render only", "Only when the component unmounts"]',
   'Once after the initial render only',
   'An empty dependency array tells React this effect does not depend on any values, so it runs exactly once after the first render.'),
  (3, 'What is the cleanup function in useEffect used for?',
   '["To reset state to its initial value", "To undo the effect (clear timers, cancel requests, unsubscribe)", "To run code before the component renders", "To handle errors in the effect"]',
   'To undo the effect (clear timers, cancel requests, unsubscribe)',
   'The function returned from useEffect runs before the next effect execution and when the component unmounts — critical for preventing memory leaks.')
) AS q(order_index, question, options, correct_answer, explanation)
ON CONFLICT (lesson_id, order_index) DO NOTHING;

-- ============================================================
-- SQL DATABASES – SELECT: Retrieving Data
-- ============================================================
WITH target_lesson AS (
  SELECT l.id FROM public.lessons l
  JOIN public.modules m ON m.id = l.module_id
  JOIN public.learning_paths lp ON lp.id = m.path_id
  WHERE lp.slug = 'sql-databases' AND m.order_index = 1 AND l.order_index = 1
)
INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT tl.id, q.question, q.options::jsonb, q.correct_answer, q.explanation, q.order_index
FROM target_lesson tl, (VALUES
  (1, 'What does SELECT DISTINCT do?',
   '["Sorts results alphabetically", "Removes duplicate rows from results", "Filters rows by a condition", "Selects all columns"]',
   'Removes duplicate rows from results',
   'DISTINCT eliminates duplicate rows from the result set, returning only unique rows.'),
  (2, 'What is the difference between WHERE and HAVING?',
   '["No difference", "WHERE filters rows before grouping, HAVING filters after grouping", "HAVING is faster than WHERE", "WHERE is for JOINs, HAVING is for single tables"]',
   'WHERE filters rows before grouping, HAVING filters after grouping',
   'WHERE filters individual rows before GROUP BY is applied. HAVING filters the groups after aggregation.'),
  (3, 'What does ORDER BY price DESC do?',
   '["Sorts results by price from smallest to largest", "Sorts results by price from largest to smallest", "Filters products with a price that is descending", "Groups results by price"]',
   'Sorts results by price from largest to smallest',
   'DESC means descending order — highest values first. ASC (ascending, the default) puts lowest values first.'),
  (4, 'Which aggregate function counts the number of non-NULL values in a column?',
   '["SUM(column)", "MAX(column)", "COUNT(column)", "COUNT(*)"]',
   'COUNT(column)',
   'COUNT(column_name) counts non-NULL values in that column. COUNT(*) counts all rows including those with NULLs.')
) AS q(order_index, question, options, correct_answer, explanation)
ON CONFLICT (lesson_id, order_index) DO NOTHING;

-- ============================================================
-- SQL DATABASES – INSERT, UPDATE, DELETE
-- ============================================================
WITH target_lesson AS (
  SELECT l.id FROM public.lessons l
  JOIN public.modules m ON m.id = l.module_id
  JOIN public.learning_paths lp ON lp.id = m.path_id
  WHERE lp.slug = 'sql-databases' AND m.order_index = 1 AND l.order_index = 2
)
INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT tl.id, q.question, q.options::jsonb, q.correct_answer, q.explanation, q.order_index
FROM target_lesson tl, (VALUES
  (1, 'What happens if you run DELETE FROM users without a WHERE clause?',
   '["Nothing happens", "Only the first row is deleted", "All rows are deleted from the table", "The table itself is dropped"]',
   'All rows are deleted from the table',
   'DELETE without WHERE removes every row. Always double-check your WHERE clause before running deletes in production!'),
  (2, 'What does ON CONFLICT DO NOTHING mean in a PostgreSQL INSERT?',
   '["It rolls back the entire transaction", "It skips the insert if a unique constraint violation would occur", "It deletes the conflicting row", "It retries the insert automatically"]',
   'It skips the insert if a unique constraint violation would occur',
   'ON CONFLICT DO NOTHING makes the INSERT a no-op if a row with the same unique key already exists, instead of raising an error.'),
  (3, 'What is a transaction used for?',
   '["To speed up queries", "To ensure a group of operations either all succeed or all fail together", "To define table permissions", "To create indexes automatically"]',
   'To ensure a group of operations either all succeed or all fail together',
   'A transaction wraps multiple operations in an atomic unit. If any step fails, ROLLBACK undoes all changes back to the start of the transaction.')
) AS q(order_index, question, options, correct_answer, explanation)
ON CONFLICT (lesson_id, order_index) DO NOTHING;

-- ============================================================
-- DSA – Two Pointers
-- ============================================================
WITH target_lesson AS (
  SELECT l.id FROM public.lessons l
  JOIN public.modules m ON m.id = l.module_id
  JOIN public.learning_paths lp ON lp.id = m.path_id
  WHERE lp.slug = 'dsa' AND m.order_index = 1 AND l.order_index = 1
)
INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT tl.id, q.question, q.options::jsonb, q.correct_answer, q.explanation, q.order_index
FROM target_lesson tl, (VALUES
  (1, 'When is the two-pointer technique most applicable?',
   '["Only for linked lists", "For sorted arrays or palindrome checking where converging/racing pointers help", "Whenever you need O(n log n) time", "For graph traversal problems"]',
   'For sorted arrays or palindrome checking where converging/racing pointers help',
   'Two pointers work well when the data is sorted or has some ordering property that lets you make decisions about which pointer to advance.'),
  (2, 'What time complexity does the two-pointer technique typically achieve?',
   '["O(n²)", "O(n log n)", "O(n)", "O(1)"]',
   'O(n)',
   'Each pointer traverses the array at most once, so total iterations are bounded by n — giving O(n) time.'),
  (3, 'In the "Two Sum (Sorted)" problem, why do we move the left pointer when the sum is too small?',
   '["To decrease the current sum", "To increase the current sum by picking a larger value", "To skip duplicates", "To avoid going out of bounds"]',
   'To increase the current sum by picking a larger value',
   'In a sorted array, values increase left to right. If left + right < target, we need a larger value — advance left to a larger number.')
) AS q(order_index, question, options, correct_answer, explanation)
ON CONFLICT (lesson_id, order_index) DO NOTHING;

-- ============================================================
-- DSA – Sliding Window
-- ============================================================
WITH target_lesson AS (
  SELECT l.id FROM public.lessons l
  JOIN public.modules m ON m.id = l.module_id
  JOIN public.learning_paths lp ON lp.id = m.path_id
  WHERE lp.slug = 'dsa' AND m.order_index = 1 AND l.order_index = 2
)
INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT tl.id, q.question, q.options::jsonb, q.correct_answer, q.explanation, q.order_index
FROM target_lesson tl, (VALUES
  (1, 'What is the sliding window technique best for?',
   '["Tree traversals", "Finding optimal subarrays or substrings with a contiguous constraint", "Binary search problems", "Dynamic programming on grids"]',
   'Finding optimal subarrays or substrings with a contiguous constraint',
   'Sliding window efficiently handles problems like "longest substring without repeating characters" or "maximum sum subarray of size k" in O(n).'),
  (2, 'In a fixed-size window of size k, how do you efficiently update the window sum when sliding?',
   '["Recalculate the sum of all k elements", "Add the new element and subtract the element leaving the window", "Sort the window and take the median", "None of the above"]',
   'Add the new element and subtract the element leaving the window',
   'This is the key optimization: instead of recalculating sum over k elements (O(k)), update in O(1) by adding the entering element and removing the exiting one.'),
  (3, 'In the variable-size window pattern, when do you shrink the window from the left?',
   '["When the window is too large", "When the window''s current state violates the constraint", "Every other iteration", "When the right pointer has gone past the middle"]',
   'When the window''s current state violates the constraint',
   'The window expands right until it violates the constraint, then shrinks left until the constraint is restored. This gives O(n) because each element is added and removed at most once.')
) AS q(order_index, question, options, correct_answer, explanation)
ON CONFLICT (lesson_id, order_index) DO NOTHING;

-- ============================================================
-- DSA – Dynamic Programming
-- ============================================================
WITH target_lesson AS (
  SELECT l.id FROM public.lessons l
  JOIN public.modules m ON m.id = l.module_id
  JOIN public.learning_paths lp ON lp.id = m.path_id
  WHERE lp.slug = 'dsa' AND m.order_index = 7 AND l.order_index = 1
)
INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT tl.id, q.question, q.options::jsonb, q.correct_answer, q.explanation, q.order_index
FROM target_lesson tl, (VALUES
  (1, 'What are the two necessary properties for dynamic programming to apply?',
   '["Sorted input and recursion", "Optimal substructure and overlapping subproblems", "Greedy choice and optimal substructure", "Memoization and tabulation"]',
   'Optimal substructure and overlapping subproblems',
   'Optimal substructure means the optimal solution contains optimal solutions to subproblems. Overlapping subproblems means the same subproblems are solved repeatedly — making caching worthwhile.'),
  (2, 'What is the difference between top-down (memoization) and bottom-up (tabulation) DP?',
   '["Top-down is always faster", "Top-down uses recursion + caching; bottom-up builds iteratively from base cases", "Bottom-up uses more memory", "They always produce different answers"]',
   'Top-down uses recursion + caching; bottom-up builds iteratively from base cases',
   'Both approaches solve the same subproblems. Top-down is often easier to write (natural recursion) but has function call overhead. Bottom-up avoids recursion and can be more space-efficient.'),
  (3, 'What is the time complexity of the Coin Change problem solved with DP?',
   '["O(n)", "O(amount)", "O(amount × number of coins)", "O(2^amount)"]',
   'O(amount × number of coins)',
   'The DP table has `amount` entries, and filling each entry requires trying each coin. Total work = amount × num_coins.')
) AS q(order_index, question, options, correct_answer, explanation)
ON CONFLICT (lesson_id, order_index) DO NOTHING;

-- ============================================================
-- JAVA DEVELOPER – Basics: Types, Methods, OOP
-- ============================================================
WITH target_lesson AS (
  SELECT l.id FROM public.lessons l
  JOIN public.modules m ON m.id = l.module_id
  JOIN public.learning_paths lp ON lp.id = m.path_id
  WHERE lp.slug = 'java-developer' AND m.order_index = 1 AND l.order_index = 1
)
INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT tl.id, q.question, q.options::jsonb, q.correct_answer, q.explanation, q.order_index
FROM target_lesson tl, (VALUES
  (1, 'What is the difference between int and Integer in Java?',
   '["No difference", "int is a primitive type; Integer is a wrapper class (reference type)", "Integer is unsigned; int is signed", "int can hold larger values"]',
   'int is a primitive type; Integer is a wrapper class (reference type)',
   'Primitives (int, double, boolean...) live on the stack and cannot be null. Wrapper classes (Integer, Double, Boolean...) are objects, can be null, and are required for collections like List<Integer>.'),
  (2, 'What does the @Override annotation do?',
   '["Marks a method as deprecated", "Tells the compiler you intend to override a parent method (compile error if you don''t)", "Makes the method run faster", "Makes the method visible only to subclasses"]',
   'Tells the compiler you intend to override a parent method (compile error if you don''t)',
   '@Override is a safety net. If you misspell the method name or change the signature, the compiler will catch it instead of silently creating a new method.'),
  (3, 'What is the purpose of the this keyword?',
   '["Refers to the parent class", "Refers to the current object instance", "Creates a new instance", "Calls the superclass constructor"]',
   'Refers to the current object instance',
   'this refers to the current object. It is used to distinguish instance fields from constructor/method parameters with the same name (e.g., this.name = name).')
) AS q(order_index, question, options, correct_answer, explanation)
ON CONFLICT (lesson_id, order_index) DO NOTHING;

-- ============================================================
-- GIT & GITHUB – Fundamentals
-- ============================================================
WITH target_lesson AS (
  SELECT l.id FROM public.lessons l
  JOIN public.modules m ON m.id = l.module_id
  JOIN public.learning_paths lp ON lp.id = m.path_id
  WHERE lp.slug = 'git-github' AND m.order_index = 1 AND l.order_index = 1
)
INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT tl.id, q.question, q.options::jsonb, q.correct_answer, q.explanation, q.order_index
FROM target_lesson tl, (VALUES
  (1, 'What does git add do?',
   '["Commits changes to the repository", "Stages changes from the working directory to the staging area", "Pushes changes to a remote", "Creates a new branch"]',
   'Stages changes from the working directory to the staging area',
   'git add moves changes from your working directory into the staging area (index), preparing them for the next commit.'),
  (2, 'What does a Git commit store?',
   '["Only the diff (changes) from the previous commit", "A full snapshot of all tracked files plus metadata (author, message, parent SHA)", "Only the file names that changed", "A zip of the entire working directory"]',
   'A full snapshot of all tracked files plus metadata (author, message, parent SHA)',
   'Git stores full snapshots, not diffs. This is what makes git checkout and git log so fast. Git is smart about deduplication — unchanged files share objects.'),
  (3, 'What is the purpose of .gitignore?',
   '["To list files that Git should always commit", "To specify files and directories that Git should not track", "To configure Git settings", "To document the project structure"]',
   'To specify files and directories that Git should not track',
   '.gitignore tells Git to ignore certain files and directories. Node_modules, build outputs, and .env files should always be gitignored.')
) AS q(order_index, question, options, correct_answer, explanation)
ON CONFLICT (lesson_id, order_index) DO NOTHING;

-- ============================================================
-- GIT & GITHUB – Branching and Merging
-- ============================================================
WITH target_lesson AS (
  SELECT l.id FROM public.lessons l
  JOIN public.modules m ON m.id = l.module_id
  JOIN public.learning_paths lp ON lp.id = m.path_id
  WHERE lp.slug = 'git-github' AND m.order_index = 2 AND l.order_index = 2
)
INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT tl.id, q.question, q.options::jsonb, q.correct_answer, q.explanation, q.order_index
FROM target_lesson tl, (VALUES
  (1, 'What is a merge conflict?',
   '["When two people work on different files", "When Git cannot automatically reconcile changes in the same lines of the same file", "When a branch is behind the remote", "When you forget to commit before switching branches"]',
   'When Git cannot automatically reconcile changes in the same lines of the same file',
   'Conflicts occur when two branches modify the same lines in the same file. Git cannot decide which change to keep, so it marks the conflict and asks you to resolve it manually.'),
  (2, 'What is the golden rule of rebase?',
   '["Always rebase instead of merge", "Never rebase commits that have been pushed to a shared branch", "Rebase every day to stay up to date", "Use rebase only for hotfixes"]',
   'Never rebase commits that have been pushed to a shared branch',
   'Rebase rewrites history (creates new commit SHAs). If others have based work on the original commits, rewriting them will cause serious problems when they try to merge or pull.'),
  (3, 'What does git stash do?',
   '["Deletes uncommitted changes permanently", "Saves uncommitted changes to a temporary area and reverts the working directory", "Commits changes with a temporary message", "Creates a backup branch"]',
   'Saves uncommitted changes to a temporary area and reverts the working directory',
   'git stash push saves your dirty working directory changes onto a stack and reverts to a clean state, letting you switch context. git stash pop restores them.')
) AS q(order_index, question, options, correct_answer, explanation)
ON CONFLICT (lesson_id, order_index) DO NOTHING;

-- ============================================================
-- LINUX & TERMINAL – Navigation & File Operations
-- ============================================================
WITH target_lesson AS (
  SELECT l.id FROM public.lessons l
  JOIN public.modules m ON m.id = l.module_id
  JOIN public.learning_paths lp ON lp.id = m.path_id
  WHERE lp.slug = 'linux-terminal' AND m.order_index = 1 AND l.order_index = 1
)
INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT tl.id, q.question, q.options::jsonb, q.correct_answer, q.explanation, q.order_index
FROM target_lesson tl, (VALUES
  (1, 'What does cd ~ do?',
   '["Goes to the root directory /", "Goes to the previous directory", "Goes to the home directory", "Goes up one level"]',
   'Goes to the home directory',
   '~ (tilde) is a shortcut for the current user''s home directory (e.g., /home/alice). cd ~ takes you there from anywhere.'),
  (2, 'What is the difference between rm and rm -rf?',
   '["rm is slower; rm -rf is faster", "rm deletes a single file; rm -rf deletes directories and all their contents recursively and forcefully", "rm asks for confirmation; rm -rf doesn''t but does the same thing", "No difference"]',
   'rm deletes a single file; rm -rf deletes directories and all their contents recursively and forcefully',
   '-r means recursive (delete directory contents) and -f means force (no confirmation). rm -rf is one of the most dangerous commands — there is no undo!'),
  (3, 'What is the meaning of chmod 755 on a file?',
   '["Read only for everyone", "Owner: rwx (read, write, execute); Group and Others: r-x (read, execute)", "Everyone has full permissions", "Owner: rw-; Group and Others: r--"]',
   'Owner: rwx (read, write, execute); Group and Others: r-x (read, execute)',
   '7 = 4+2+1 = rwx. 5 = 4+0+1 = r-x. So 755 means owner can do everything, group and others can read and execute but not write.')
) AS q(order_index, question, options, correct_answer, explanation)
ON CONFLICT (lesson_id, order_index) DO NOTHING;

-- ============================================================
-- SOFTWARE ARCHITECTURE – SOLID Principles
-- ============================================================
WITH target_lesson AS (
  SELECT l.id FROM public.lessons l
  JOIN public.modules m ON m.id = l.module_id
  JOIN public.learning_paths lp ON lp.id = m.path_id
  WHERE lp.slug = 'software-architecture' AND m.order_index = 1 AND l.order_index = 1
)
INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT tl.id, q.question, q.options::jsonb, q.correct_answer, q.explanation, q.order_index
FROM target_lesson tl, (VALUES
  (1, 'Which SOLID principle states that a class should have only one reason to change?',
   '["Open/Closed", "Liskov Substitution", "Single Responsibility", "Dependency Inversion"]',
   'Single Responsibility',
   'SRP (Single Responsibility Principle) says each class should be responsible for one concept. If it has multiple reasons to change, split it into focused classes.'),
  (2, 'What does "open for extension, closed for modification" mean?',
   '["You should always refactor old code", "Add new behavior by creating new code, not by modifying existing tested code", "Classes should be sealed (no inheritance)", "Extension methods are preferred over overriding"]',
   'Add new behavior by creating new code, not by modifying existing tested code',
   'The Open/Closed Principle (OCP) says use abstractions and polymorphism to extend behavior. Changing tested existing code risks introducing bugs.'),
  (3, 'Which SOLID principle is violated when a class is forced to implement methods it does not need?',
   '["Single Responsibility", "Dependency Inversion", "Interface Segregation", "Liskov Substitution"]',
   'Interface Segregation',
   'The Interface Segregation Principle (ISP) says prefer many small, focused interfaces over one fat interface that forces implementers to add empty or throw-not-implemented methods.')
) AS q(order_index, question, options, correct_answer, explanation)
ON CONFLICT (lesson_id, order_index) DO NOTHING;

-- ============================================================
-- DOCKER & KUBERNETES – Kubernetes Pods, Deployments
-- ============================================================
WITH target_lesson AS (
  SELECT l.id FROM public.lessons l
  JOIN public.modules m ON m.id = l.module_id
  JOIN public.learning_paths lp ON lp.id = m.path_id
  WHERE lp.slug = 'docker-kubernetes' AND m.order_index = 3 AND l.order_index = 1
)
INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT tl.id, q.question, q.options::jsonb, q.correct_answer, q.explanation, q.order_index
FROM target_lesson tl, (VALUES
  (1, 'What is a Kubernetes Pod?',
   '["A single container", "A virtual machine", "The smallest deployable unit, containing one or more tightly-coupled containers", "A group of nodes"]',
   'The smallest deployable unit, containing one or more tightly-coupled containers',
   'Pods wrap containers that share a network namespace and storage. Containers in a pod can communicate via localhost and share volumes.'),
  (2, 'What happens during a rolling update in a Kubernetes Deployment?',
   '["All pods are deleted, then new ones are created", "New pods are created before old ones are removed, maintaining availability", "The deployment is paused until all pods are updated manually", "Only pods on specific nodes are updated"]',
   'New pods are created before old ones are removed, maintaining availability',
   'A rolling update gradually replaces old pods with new ones. With maxUnavailable=0, no pod is removed until the new replacement is ready — achieving zero downtime.'),
  (3, 'What is the difference between a ClusterIP and LoadBalancer Service?',
   '["They are the same", "ClusterIP is internal-only; LoadBalancer is externally accessible via a cloud provider load balancer", "LoadBalancer is cheaper", "ClusterIP has higher availability"]',
   'ClusterIP is internal-only; LoadBalancer is externally accessible via a cloud provider load balancer',
   'ClusterIP gives a stable internal IP. LoadBalancer provisions a cloud load balancer (AWS ELB, GCP LB) with a public IP, enabling external traffic to reach your pods.')
) AS q(order_index, question, options, correct_answer, explanation)
ON CONFLICT (lesson_id, order_index) DO NOTHING;

-- ============================================================
-- CYBERSECURITY ENGINEER – OWASP Top 10
-- ============================================================
WITH target_lesson AS (
  SELECT l.id FROM public.lessons l
  JOIN public.modules m ON m.id = l.module_id
  JOIN public.learning_paths lp ON lp.id = m.path_id
  WHERE lp.slug = 'cybersecurity-engineer' AND m.order_index = 3 AND l.order_index = 1
)
INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT tl.id, q.question, q.options::jsonb, q.correct_answer, q.explanation, q.order_index
FROM target_lesson tl, (VALUES
  (1, 'What is SQL Injection and how is it prevented?',
   '["Injecting SQL into HTML; prevented by HTML encoding", "User input inserted directly into SQL queries; prevented by parameterized queries", "Uploading SQL files; prevented by file type checking", "Brute-forcing a SQL password; prevented by rate limiting"]',
   'User input inserted directly into SQL queries; prevented by parameterized queries',
   'SQL injection allows attackers to manipulate database queries. Parameterized queries (prepared statements) pass user input as data, never as executable SQL.'),
  (2, 'Why is MD5 a poor choice for storing passwords?',
   '["It is too slow", "It is reversible", "It is too fast — trivially brute-forced with rainbow tables or GPU attacks", "It requires a salt automatically"]',
   'It is too fast — trivially brute-forced with rainbow tables or GPU attacks',
   'Password hashes must be slow to compute so brute-forcing is expensive. Use bcrypt, Argon2, or scrypt which are specifically designed to be computationally expensive.'),
  (3, 'What is the difference between authentication and authorization?',
   '["They are the same thing", "Authentication verifies who you are; authorization determines what you are allowed to do", "Authentication is for APIs; authorization is for web apps", "Authentication happens after authorization"]',
   'Authentication verifies who you are; authorization determines what you are allowed to do',
   'Authentication (AuthN): are you who you claim to be? (username + password, MFA). Authorization (AuthZ): given that you are logged in, what resources can you access?')
) AS q(order_index, question, options, correct_answer, explanation)
ON CONFLICT (lesson_id, order_index) DO NOTHING;

-- ============================================================
-- DISTRIBUTED SYSTEMS – CAP Theorem
-- ============================================================
WITH target_lesson AS (
  SELECT l.id FROM public.lessons l
  JOIN public.modules m ON m.id = l.module_id
  JOIN public.learning_paths lp ON lp.id = m.path_id
  WHERE lp.slug = 'distributed-systems' AND m.order_index = 2 AND l.order_index = 1
)
INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT tl.id, q.question, q.options::jsonb, q.correct_answer, q.explanation, q.order_index
FROM target_lesson tl, (VALUES
  (1, 'According to CAP theorem, what is the practical choice every distributed system must make?',
   '["Between consistency and availability when there is no partition", "Between consistency and availability during a network partition (since partition tolerance is required)", "Between partition tolerance and consistency", "Between speed and reliability"]',
   'Between consistency and availability during a network partition (since partition tolerance is required)',
   'Network partitions are inevitable. You must tolerate them (P). The real choice is: when a partition occurs, do you sacrifice consistency (AP) or availability (CP)?'),
  (2, 'What does "eventual consistency" mean?',
   '["Data is always consistent across all nodes", "Reads may return stale data but all nodes will converge to the same value if no new updates are made", "Only the primary node has consistent data", "Consistency is guaranteed within 1 second"]',
   'Reads may return stale data but all nodes will converge to the same value if no new updates are made',
   'Eventual consistency is a weak guarantee: the system will converge, but reads may see stale data during the convergence window. DNS is a classic example.'),
  (3, 'Which database is an example of an AP (availability + partition-tolerant) system?',
   '["ZooKeeper", "HBase", "Cassandra", "PostgreSQL with synchronous replication"]',
   'Cassandra',
   'Cassandra prioritizes availability and partition tolerance. It may return stale reads during a partition but always accepts writes. ZooKeeper and HBase prefer CP (consistency + partition tolerance).')
) AS q(order_index, question, options, correct_answer, explanation)
ON CONFLICT (lesson_id, order_index) DO NOTHING;

-- ============================================================
-- PERFORMANCE OPTIMIZATION – Database Indexes
-- ============================================================
WITH target_lesson AS (
  SELECT l.id FROM public.lessons l
  JOIN public.modules m ON m.id = l.module_id
  JOIN public.learning_paths lp ON lp.id = m.path_id
  WHERE lp.slug = 'performance-optimization' AND m.order_index = 4 AND l.order_index = 1
)
INSERT INTO public.lesson_quizzes (lesson_id, question, options, correct_answer, explanation, order_index)
SELECT tl.id, q.question, q.options::jsonb, q.correct_answer, q.explanation, q.order_index
FROM target_lesson tl, (VALUES
  (1, 'What does EXPLAIN ANALYZE do in PostgreSQL?',
   '["Explains the SQL syntax to the database", "Shows the query execution plan AND actually runs the query to show real timing", "Analyzes table statistics without running the query", "Shows indexes on all tables"]',
   'Shows the query execution plan AND actually runs the query to show real timing',
   'EXPLAIN shows the plan; EXPLAIN ANALYZE executes the query and shows both estimated and actual row counts and timing — essential for finding slow operations.'),
  (2, 'What is a "Seq Scan" in a query plan and why is it usually bad for large tables?',
   '["A scan that runs in sequence order; always fast", "A full table scan that reads every row; slow for large tables where an index scan would be faster", "A scan of only sequential (sequential-key) indexes", "A parallel scan across multiple cores"]',
   'A full table scan that reads every row; slow for large tables where an index scan would be faster',
   'Seq Scan reads every page in the table. For a table with millions of rows, this is slow when you only need a few rows. An index scan jumps directly to the relevant rows.'),
  (3, 'What is the N+1 query problem?',
   '["Running the same query N+1 times by accident", "Fetching a list of N items, then running 1 additional query per item — totalling N+1 queries instead of 1-2", "A query that has N+1 JOINs", "When N queries run in parallel and 1 fails"]',
   'Fetching a list of N items, then running 1 additional query per item — totalling N+1 queries instead of 1-2',
   'Classic ORM mistake: fetch 100 posts (1 query), then for each post fetch its author (100 queries) = 101 queries. Fix with eager loading (JOIN) to get everything in 1-2 queries.')
) AS q(order_index, question, options, correct_answer, explanation)
ON CONFLICT (lesson_id, order_index) DO NOTHING;
