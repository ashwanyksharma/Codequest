/*
  # CodeQuest Seed Content

  Run after the initial schema migration.
  Seeds 7 worlds, 13 levels, 28 problems, and visible test cases.
*/

DO $$
DECLARE
  w_foundations uuid;
  w_cpp uuid;
  w_sorting uuid;
  w_arrays uuid;
  w_strings uuid;
  w_revision uuid;
  w_linked uuid;
  l_basics uuid;
  l_loops uuid;
  l_cpp_basics uuid;
  l_math uuid;
  l_simple_sort uuid;
  l_advanced_sort uuid;
  l_arrays uuid;
  l_binary uuid;
  l_string_basics uuid;
  l_string_patterns uuid;
  l_revision uuid;
  l_linked_basics uuid;
  l_linked_merge uuid;
  p uuid;
BEGIN
  INSERT INTO public.worlds (name, description, icon, color, order_index)
  VALUES
    ('Foundations', 'Start with variables, branches, loops, and recursion basics.', 'Rocket', '#10b981', 1),
    ('C++ Basics', 'Practice math and function fundamentals with classic beginner tasks.', 'Code2', '#3b82f6', 2),
    ('Sorting', 'Learn comparison sorting and divide-and-conquer ordering.', 'ArrowUpDown', '#f59e0b', 3),
    ('Arrays & Binary Search', 'Master index-based thinking, searching, and array optimization.', 'Binary', '#8b5cf6', 4),
    ('Strings', 'Solve text processing, matching, and scanning problems.', 'TextCursorInput', '#06b6d4', 5),
    ('Revision', 'Mix core patterns and sharpen problem selection.', 'RefreshCw', '#ec4899', 6),
    ('Linked Lists', 'Practice list-style operations using array-backed inputs.', 'GitBranch', '#22c55e', 7)
  ON CONFLICT (order_index) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    color = EXCLUDED.color;

  SELECT id INTO w_foundations FROM public.worlds WHERE order_index = 1;
  SELECT id INTO w_cpp FROM public.worlds WHERE order_index = 2;
  SELECT id INTO w_sorting FROM public.worlds WHERE order_index = 3;
  SELECT id INTO w_arrays FROM public.worlds WHERE order_index = 4;
  SELECT id INTO w_strings FROM public.worlds WHERE order_index = 5;
  SELECT id INTO w_revision FROM public.worlds WHERE order_index = 6;
  SELECT id INTO w_linked FROM public.worlds WHERE order_index = 7;

  INSERT INTO public.levels (world_id, name, description, order_index)
  VALUES
    (w_foundations, 'Basic Functions', 'Return values from simple functions.', 1),
    (w_foundations, 'Loops and Recursion', 'Use repetition to build answers.', 2),
    (w_cpp, 'Conditionals', 'Compare values and make decisions.', 1),
    (w_cpp, 'Number Theory', 'Prime, power, and divisor routines.', 2),
    (w_sorting, 'Elementary Sorting', 'Classic quadratic sorting methods.', 1),
    (w_sorting, 'Divide and Partition', 'Faster sorting patterns.', 2),
    (w_arrays, 'Array Patterns', 'Use maps and running state.', 1),
    (w_arrays, 'Search Patterns', 'Find targets and peaks efficiently.', 2),
    (w_strings, 'String Basics', 'Scan and transform strings.', 1),
    (w_strings, 'String Patterns', 'Compare and group text.', 2),
    (w_revision, 'Mixed Practice', 'Review common interview patterns.', 1),
    (w_linked, 'List Basics', 'Measure and reverse list-like data.', 1),
    (w_linked, 'List Merging', 'Combine sorted list-like data.', 2)
  ON CONFLICT (world_id, order_index) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description;

  SELECT id INTO l_basics FROM public.levels WHERE world_id = w_foundations AND order_index = 1;
  SELECT id INTO l_loops FROM public.levels WHERE world_id = w_foundations AND order_index = 2;
  SELECT id INTO l_cpp_basics FROM public.levels WHERE world_id = w_cpp AND order_index = 1;
  SELECT id INTO l_math FROM public.levels WHERE world_id = w_cpp AND order_index = 2;
  SELECT id INTO l_simple_sort FROM public.levels WHERE world_id = w_sorting AND order_index = 1;
  SELECT id INTO l_advanced_sort FROM public.levels WHERE world_id = w_sorting AND order_index = 2;
  SELECT id INTO l_arrays FROM public.levels WHERE world_id = w_arrays AND order_index = 1;
  SELECT id INTO l_binary FROM public.levels WHERE world_id = w_arrays AND order_index = 2;
  SELECT id INTO l_string_basics FROM public.levels WHERE world_id = w_strings AND order_index = 1;
  SELECT id INTO l_string_patterns FROM public.levels WHERE world_id = w_strings AND order_index = 2;
  SELECT id INTO l_revision FROM public.levels WHERE world_id = w_revision AND order_index = 1;
  SELECT id INTO l_linked_basics FROM public.levels WHERE world_id = w_linked AND order_index = 1;
  SELECT id INTO l_linked_merge FROM public.levels WHERE world_id = w_linked AND order_index = 2;

  -- World 1
  INSERT INTO public.problems (level_id, title, description, difficulty, xp_reward, examples, hints, editorial, starter_code, function_name, param_names, order_index)
  VALUES (l_basics, 'Sum of Two Numbers', 'Return the sum of two numbers.', 'easy', 10,
    '[{"input":"a = 2, b = 3","output":"5"}]'::jsonb,
    '["Use the + operator.","Return the result directly."]'::jsonb,
    'Add both inputs and return the value.',
    'function sumTwo(a, b) {\n  // Your code here\n}', 'sumTwo', '["a","b"]'::jsonb, 1)
  ON CONFLICT (level_id, order_index) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO p;
  DELETE FROM public.test_cases WHERE problem_id = p;
  INSERT INTO public.test_cases (problem_id, input_args, expected_output, description) VALUES
    (p, '[2,3]'::jsonb, '5', 'positive numbers'),
    (p, '[-4,9]'::jsonb, '5', 'mixed signs'),
    (p, '[0,0]'::jsonb, '0', 'zeroes');

  INSERT INTO public.problems (level_id, title, description, difficulty, xp_reward, examples, hints, editorial, starter_code, function_name, param_names, order_index)
  VALUES (l_basics, 'Check Even or Odd', 'Return true if n is even, otherwise false.', 'easy', 10,
    '[{"input":"n = 4","output":"true"}]'::jsonb,
    '["Use modulo.","Even numbers have remainder 0 when divided by 2."]'::jsonb,
    'Check n % 2 and return a boolean.',
    'function isEven(n) {\n  // Your code here\n}', 'isEven', '["n"]'::jsonb, 2)
  ON CONFLICT (level_id, order_index) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO p;
  DELETE FROM public.test_cases WHERE problem_id = p;
  INSERT INTO public.test_cases (problem_id, input_args, expected_output, description) VALUES
    (p, '[4]'::jsonb, 'true', 'even number'),
    (p, '[7]'::jsonb, 'false', 'odd number'),
    (p, '[0]'::jsonb, 'true', 'zero');

  INSERT INTO public.problems (level_id, title, description, difficulty, xp_reward, examples, hints, editorial, starter_code, function_name, param_names, order_index)
  VALUES (l_basics, 'FizzBuzz', 'Return an array from 1 to n where multiples of 3 are Fizz, multiples of 5 are Buzz, and multiples of both are FizzBuzz.', 'easy', 10,
    '[{"input":"n = 5","output":"[\"1\",\"2\",\"Fizz\",\"4\",\"Buzz\"]"}]'::jsonb,
    '["Check divisibility by 15 first.","Convert regular numbers to strings."]'::jsonb,
    'Loop from 1 to n and push the correct string for each value.',
    'function fizzBuzz(n) {\n  // Your code here\n}', 'fizzBuzz', '["n"]'::jsonb, 3)
  ON CONFLICT (level_id, order_index) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO p;
  DELETE FROM public.test_cases WHERE problem_id = p;
  INSERT INTO public.test_cases (problem_id, input_args, expected_output, description) VALUES
    (p, '[3]'::jsonb, '["1","2","Fizz"]', 'contains fizz'),
    (p, '[5]'::jsonb, '["1","2","Fizz","4","Buzz"]', 'contains buzz'),
    (p, '[15]'::jsonb, '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]', 'contains fizzbuzz');

  INSERT INTO public.problems (level_id, title, description, difficulty, xp_reward, examples, hints, editorial, starter_code, function_name, param_names, order_index)
  VALUES (l_loops, 'Factorial', 'Return n factorial. Assume n is a non-negative integer.', 'medium', 20,
    '[{"input":"n = 5","output":"120"}]'::jsonb,
    '["Start with 1.","Multiply every number from 2 through n."]'::jsonb,
    'Factorial is the product of all positive integers up to n.',
    'function factorial(n) {\n  // Your code here\n}', 'factorial', '["n"]'::jsonb, 1)
  ON CONFLICT (level_id, order_index) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO p;
  DELETE FROM public.test_cases WHERE problem_id = p;
  INSERT INTO public.test_cases (problem_id, input_args, expected_output, description) VALUES
    (p, '[0]'::jsonb, '1', 'zero factorial'),
    (p, '[5]'::jsonb, '120', 'normal case'),
    (p, '[7]'::jsonb, '5040', 'larger case');

  INSERT INTO public.problems (level_id, title, description, difficulty, xp_reward, examples, hints, editorial, starter_code, function_name, param_names, order_index)
  VALUES (l_loops, 'Fibonacci Number', 'Return the nth Fibonacci number where fib(0)=0 and fib(1)=1.', 'medium', 20,
    '[{"input":"n = 6","output":"8"}]'::jsonb,
    '["Keep two previous values.","Iterate until n."]'::jsonb,
    'Build the sequence iteratively to avoid repeated recursion.',
    'function fibonacci(n) {\n  // Your code here\n}', 'fibonacci', '["n"]'::jsonb, 2)
  ON CONFLICT (level_id, order_index) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO p;
  DELETE FROM public.test_cases WHERE problem_id = p;
  INSERT INTO public.test_cases (problem_id, input_args, expected_output, description) VALUES
    (p, '[0]'::jsonb, '0', 'base zero'),
    (p, '[1]'::jsonb, '1', 'base one'),
    (p, '[10]'::jsonb, '55', 'tenth value');

  -- World 2
  INSERT INTO public.problems (level_id, title, description, difficulty, xp_reward, examples, hints, editorial, starter_code, function_name, param_names, order_index)
  VALUES (l_cpp_basics, 'Maximum of Three', 'Return the largest of three numbers.', 'easy', 10,
    '[{"input":"a = 3, b = 9, c = 4","output":"9"}]'::jsonb,
    '["Use Math.max or comparisons.","Remember ties are fine."]'::jsonb,
    'Compare all three values and return the maximum.',
    'function maxOfThree(a, b, c) {\n  // Your code here\n}', 'maxOfThree', '["a","b","c"]'::jsonb, 1)
  ON CONFLICT (level_id, order_index) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO p;
  DELETE FROM public.test_cases WHERE problem_id = p;
  INSERT INTO public.test_cases (problem_id, input_args, expected_output, description) VALUES
    (p, '[3,9,4]'::jsonb, '9', 'middle largest'),
    (p, '[-1,-5,-3]'::jsonb, '-1', 'negative values'),
    (p, '[7,7,2]'::jsonb, '7', 'tie');

  INSERT INTO public.problems (level_id, title, description, difficulty, xp_reward, examples, hints, editorial, starter_code, function_name, param_names, order_index)
  VALUES (l_math, 'Is Prime', 'Return true if n is prime, otherwise false.', 'medium', 20,
    '[{"input":"n = 7","output":"true"}]'::jsonb,
    '["Numbers less than 2 are not prime.","Check divisors up to square root."]'::jsonb,
    'A prime has exactly two positive divisors: 1 and itself.',
    'function isPrime(n) {\n  // Your code here\n}', 'isPrime', '["n"]'::jsonb, 1)
  ON CONFLICT (level_id, order_index) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO p;
  DELETE FROM public.test_cases WHERE problem_id = p;
  INSERT INTO public.test_cases (problem_id, input_args, expected_output, description) VALUES
    (p, '[1]'::jsonb, 'false', 'less than prime'),
    (p, '[7]'::jsonb, 'true', 'prime'),
    (p, '[21]'::jsonb, 'false', 'composite');

  INSERT INTO public.problems (level_id, title, description, difficulty, xp_reward, examples, hints, editorial, starter_code, function_name, param_names, order_index)
  VALUES (l_math, 'Power Function', 'Return base raised to exponent. Assume exponent is non-negative.', 'medium', 20,
    '[{"input":"base = 2, exponent = 5","output":"32"}]'::jsonb,
    '["Repeated multiplication works.","Start result at 1."]'::jsonb,
    'Multiply the base exponent times.',
    'function power(base, exponent) {\n  // Your code here\n}', 'power', '["base","exponent"]'::jsonb, 2)
  ON CONFLICT (level_id, order_index) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO p;
  DELETE FROM public.test_cases WHERE problem_id = p;
  INSERT INTO public.test_cases (problem_id, input_args, expected_output, description) VALUES
    (p, '[2,5]'::jsonb, '32', 'normal case'),
    (p, '[5,0]'::jsonb, '1', 'zero exponent'),
    (p, '[3,3]'::jsonb, '27', 'cube');

  INSERT INTO public.problems (level_id, title, description, difficulty, xp_reward, examples, hints, editorial, starter_code, function_name, param_names, order_index)
  VALUES (l_math, 'GCD of Two Numbers', 'Return the greatest common divisor of a and b.', 'medium', 20,
    '[{"input":"a = 12, b = 18","output":"6"}]'::jsonb,
    '["Euclidean algorithm is efficient.","Repeatedly replace a,b with b,a%b."]'::jsonb,
    'The Euclidean algorithm finds the greatest common divisor quickly.',
    'function gcd(a, b) {\n  // Your code here\n}', 'gcd', '["a","b"]'::jsonb, 3)
  ON CONFLICT (level_id, order_index) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO p;
  DELETE FROM public.test_cases WHERE problem_id = p;
  INSERT INTO public.test_cases (problem_id, input_args, expected_output, description) VALUES
    (p, '[12,18]'::jsonb, '6', 'common divisor'),
    (p, '[17,13]'::jsonb, '1', 'coprime'),
    (p, '[100,10]'::jsonb, '10', 'multiple');

  -- World 3
  INSERT INTO public.problems (level_id, title, description, difficulty, xp_reward, examples, hints, editorial, starter_code, function_name, param_names, order_index)
  VALUES (l_simple_sort, 'Bubble Sort', 'Return a sorted copy of nums in ascending order using bubble sort ideas.', 'medium', 20,
    '[{"input":"nums = [3,1,2]","output":"[1,2,3]"}]'::jsonb,
    '["Compare adjacent elements.","Swap when left is greater than right."]'::jsonb,
    'Repeated passes bubble the largest unsorted value to the end.',
    'function bubbleSort(nums) {\n  // Your code here\n}', 'bubbleSort', '["nums"]'::jsonb, 1)
  ON CONFLICT (level_id, order_index) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO p;
  DELETE FROM public.test_cases WHERE problem_id = p;
  INSERT INTO public.test_cases (problem_id, input_args, expected_output, description) VALUES
    (p, '[[3,1,2]]'::jsonb, '[1,2,3]', 'unsorted'),
    (p, '[[5,4,3,2,1]]'::jsonb, '[1,2,3,4,5]', 'reverse'),
    (p, '[[]]'::jsonb, '[]', 'empty');

  INSERT INTO public.problems (level_id, title, description, difficulty, xp_reward, examples, hints, editorial, starter_code, function_name, param_names, order_index)
  VALUES (l_simple_sort, 'Selection Sort', 'Return a sorted copy of nums in ascending order using selection sort ideas.', 'medium', 20,
    '[{"input":"nums = [4,2,1]","output":"[1,2,4]"}]'::jsonb,
    '["Find the minimum in the unsorted suffix.","Place it at the current index."]'::jsonb,
    'Selection sort repeatedly selects the smallest remaining value.',
    'function selectionSort(nums) {\n  // Your code here\n}', 'selectionSort', '["nums"]'::jsonb, 2)
  ON CONFLICT (level_id, order_index) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO p;
  DELETE FROM public.test_cases WHERE problem_id = p;
  INSERT INTO public.test_cases (problem_id, input_args, expected_output, description) VALUES
    (p, '[[4,2,1]]'::jsonb, '[1,2,4]', 'unsorted'),
    (p, '[[1,1,0]]'::jsonb, '[0,1,1]', 'duplicates'),
    (p, '[[9]]'::jsonb, '[9]', 'single');

  INSERT INTO public.problems (level_id, title, description, difficulty, xp_reward, examples, hints, editorial, starter_code, function_name, param_names, order_index)
  VALUES (l_advanced_sort, 'Merge Sort', 'Return nums sorted in ascending order using divide and conquer.', 'hard', 40,
    '[{"input":"nums = [5,2,3,1]","output":"[1,2,3,5]"}]'::jsonb,
    '["Split the array in half.","Merge two sorted halves."]'::jsonb,
    'Merge sort recursively sorts halves and merges them.',
    'function mergeSort(nums) {\n  // Your code here\n}', 'mergeSort', '["nums"]'::jsonb, 1)
  ON CONFLICT (level_id, order_index) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO p;
  DELETE FROM public.test_cases WHERE problem_id = p;
  INSERT INTO public.test_cases (problem_id, input_args, expected_output, description) VALUES
    (p, '[[5,2,3,1]]'::jsonb, '[1,2,3,5]', 'normal'),
    (p, '[[-1,5,3,0]]'::jsonb, '[-1,0,3,5]', 'negatives'),
    (p, '[[]]'::jsonb, '[]', 'empty');

  INSERT INTO public.problems (level_id, title, description, difficulty, xp_reward, examples, hints, editorial, starter_code, function_name, param_names, order_index)
  VALUES (l_advanced_sort, 'Sort Colors', 'Given an array containing only 0, 1, and 2, return it sorted.', 'hard', 40,
    '[{"input":"nums = [2,0,2,1,1,0]","output":"[0,0,1,1,2,2]"}]'::jsonb,
    '["Count values or use three pointers.","Only 0, 1, and 2 appear."]'::jsonb,
    'The Dutch flag pattern partitions values into three groups.',
    'function sortColors(nums) {\n  // Your code here\n}', 'sortColors', '["nums"]'::jsonb, 2)
  ON CONFLICT (level_id, order_index) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO p;
  DELETE FROM public.test_cases WHERE problem_id = p;
  INSERT INTO public.test_cases (problem_id, input_args, expected_output, description) VALUES
    (p, '[[2,0,2,1,1,0]]'::jsonb, '[0,0,1,1,2,2]', 'mixed'),
    (p, '[[2,2,1]]'::jsonb, '[1,2,2]', 'no zero'),
    (p, '[[0]]'::jsonb, '[0]', 'single');

  -- World 4
  INSERT INTO public.problems (level_id, title, description, difficulty, xp_reward, examples, hints, editorial, starter_code, function_name, param_names, order_index)
  VALUES (l_arrays, 'Two Sum', 'Return indices of two numbers whose sum equals target.', 'medium', 20,
    '[{"input":"nums = [2,7,11,15], target = 9","output":"[0,1]"}]'::jsonb,
    '["Use a map from number to index.","Look for target - current."]'::jsonb,
    'A hash map lets you find complements in one pass.',
    'function twoSum(nums, target) {\n  // Your code here\n}', 'twoSum', '["nums","target"]'::jsonb, 1)
  ON CONFLICT (level_id, order_index) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO p;
  DELETE FROM public.test_cases WHERE problem_id = p;
  INSERT INTO public.test_cases (problem_id, input_args, expected_output, description) VALUES
    (p, '[[2,7,11,15],9]'::jsonb, '[0,1]', 'classic'),
    (p, '[[3,2,4],6]'::jsonb, '[1,2]', 'middle pair'),
    (p, '[[3,3],6]'::jsonb, '[0,1]', 'duplicate values');

  INSERT INTO public.problems (level_id, title, description, difficulty, xp_reward, examples, hints, editorial, starter_code, function_name, param_names, order_index)
  VALUES (l_arrays, 'Maximum Subarray', 'Return the largest sum of any contiguous subarray.', 'medium', 20,
    '[{"input":"nums = [-2,1,-3,4,-1,2,1,-5,4]","output":"6"}]'::jsonb,
    '["Track current best ending here.","Kadane algorithm is ideal."]'::jsonb,
    'Kadane keeps a running sum and restarts when it becomes harmful.',
    'function maxSubarray(nums) {\n  // Your code here\n}', 'maxSubarray', '["nums"]'::jsonb, 2)
  ON CONFLICT (level_id, order_index) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO p;
  DELETE FROM public.test_cases WHERE problem_id = p;
  INSERT INTO public.test_cases (problem_id, input_args, expected_output, description) VALUES
    (p, '[[-2,1,-3,4,-1,2,1,-5,4]]'::jsonb, '6', 'classic'),
    (p, '[[1]]'::jsonb, '1', 'single'),
    (p, '[[-3,-2,-5]]'::jsonb, '-2', 'all negative');

  INSERT INTO public.problems (level_id, title, description, difficulty, xp_reward, examples, hints, editorial, starter_code, function_name, param_names, order_index)
  VALUES (l_binary, 'Binary Search', 'Return the index of target in sorted nums, or -1 if missing.', 'medium', 20,
    '[{"input":"nums = [-1,0,3,5,9,12], target = 9","output":"4"}]'::jsonb,
    '["Use low and high pointers.","Compare the middle value."]'::jsonb,
    'Binary search halves the search range each step.',
    'function binarySearch(nums, target) {\n  // Your code here\n}', 'binarySearch', '["nums","target"]'::jsonb, 1)
  ON CONFLICT (level_id, order_index) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO p;
  DELETE FROM public.test_cases WHERE problem_id = p;
  INSERT INTO public.test_cases (problem_id, input_args, expected_output, description) VALUES
    (p, '[[-1,0,3,5,9,12],9]'::jsonb, '4', 'found'),
    (p, '[[-1,0,3,5,9,12],2]'::jsonb, '-1', 'missing'),
    (p, '[[5],5]'::jsonb, '0', 'single found');

  INSERT INTO public.problems (level_id, title, description, difficulty, xp_reward, examples, hints, editorial, starter_code, function_name, param_names, order_index)
  VALUES (l_binary, 'Find Peak Element', 'Return an index i where nums[i] is greater than its neighbors. Any valid peak is accepted only for the provided tests.', 'hard', 40,
    '[{"input":"nums = [1,2,3,1]","output":"2"}]'::jsonb,
    '["A linear scan works.","A value greater than both neighbors is a peak."]'::jsonb,
    'For these tests, return the first clear peak.',
    'function findPeakElement(nums) {\n  // Your code here\n}', 'findPeakElement', '["nums"]'::jsonb, 2)
  ON CONFLICT (level_id, order_index) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO p;
  DELETE FROM public.test_cases WHERE problem_id = p;
  INSERT INTO public.test_cases (problem_id, input_args, expected_output, description) VALUES
    (p, '[[1,2,3,1]]'::jsonb, '2', 'middle peak'),
    (p, '[[1,2,1,3,5,6,4]]'::jsonb, '1', 'first peak'),
    (p, '[[1]]'::jsonb, '0', 'single');

  -- World 5
  INSERT INTO public.problems (level_id, title, description, difficulty, xp_reward, examples, hints, editorial, starter_code, function_name, param_names, order_index)
  VALUES (l_string_basics, 'Reverse a String', 'Return the reversed version of s.', 'easy', 10,
    '[{"input":"s = \"hello\"","output":"olleh"}]'::jsonb,
    '["Split into characters.","Reverse and join."]'::jsonb,
    'Reverse the order of all characters.',
    'function reverseString(s) {\n  // Your code here\n}', 'reverseString', '["s"]'::jsonb, 1)
  ON CONFLICT (level_id, order_index) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO p;
  DELETE FROM public.test_cases WHERE problem_id = p;
  INSERT INTO public.test_cases (problem_id, input_args, expected_output, description) VALUES
    (p, '["hello"]'::jsonb, 'olleh', 'word'),
    (p, '["a"]'::jsonb, 'a', 'single'),
    (p, '[""]'::jsonb, '', 'empty');

  INSERT INTO public.problems (level_id, title, description, difficulty, xp_reward, examples, hints, editorial, starter_code, function_name, param_names, order_index)
  VALUES (l_string_basics, 'Is Palindrome', 'Return true if s reads the same forward and backward.', 'easy', 10,
    '[{"input":"s = \"racecar\"","output":"true"}]'::jsonb,
    '["Compare with the reversed string.","Case-sensitive tests are used."]'::jsonb,
    'A palindrome equals its reverse.',
    'function isPalindrome(s) {\n  // Your code here\n}', 'isPalindrome', '["s"]'::jsonb, 2)
  ON CONFLICT (level_id, order_index) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO p;
  DELETE FROM public.test_cases WHERE problem_id = p;
  INSERT INTO public.test_cases (problem_id, input_args, expected_output, description) VALUES
    (p, '["racecar"]'::jsonb, 'true', 'palindrome'),
    (p, '["hello"]'::jsonb, 'false', 'not palindrome'),
    (p, '["aa"]'::jsonb, 'true', 'two chars');

  INSERT INTO public.problems (level_id, title, description, difficulty, xp_reward, examples, hints, editorial, starter_code, function_name, param_names, order_index)
  VALUES (l_string_basics, 'Count Vowels', 'Return the number of vowels in s. Count a, e, i, o, u in either case.', 'easy', 10,
    '[{"input":"s = \"CodeQuest\"","output":"4"}]'::jsonb,
    '["Use a set of vowels.","Lowercase each character."]'::jsonb,
    'Scan the string and count vowel characters.',
    'function countVowels(s) {\n  // Your code here\n}', 'countVowels', '["s"]'::jsonb, 3)
  ON CONFLICT (level_id, order_index) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO p;
  DELETE FROM public.test_cases WHERE problem_id = p;
  INSERT INTO public.test_cases (problem_id, input_args, expected_output, description) VALUES
    (p, '["CodeQuest"]'::jsonb, '4', 'mixed case'),
    (p, '["sky"]'::jsonb, '0', 'no vowels'),
    (p, '["AEIOU"]'::jsonb, '5', 'uppercase');

  INSERT INTO public.problems (level_id, title, description, difficulty, xp_reward, examples, hints, editorial, starter_code, function_name, param_names, order_index)
  VALUES (l_string_patterns, 'Valid Anagram', 'Return true if s and t contain the same characters with the same counts.', 'medium', 20,
    '[{"input":"s = \"anagram\", t = \"nagaram\"","output":"true"}]'::jsonb,
    '["Sort both strings or count characters.","Lengths must match."]'::jsonb,
    'Two anagrams have identical character frequencies.',
    'function validAnagram(s, t) {\n  // Your code here\n}', 'validAnagram', '["s","t"]'::jsonb, 1)
  ON CONFLICT (level_id, order_index) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO p;
  DELETE FROM public.test_cases WHERE problem_id = p;
  INSERT INTO public.test_cases (problem_id, input_args, expected_output, description) VALUES
    (p, '["anagram","nagaram"]'::jsonb, 'true', 'anagram'),
    (p, '["rat","car"]'::jsonb, 'false', 'not anagram'),
    (p, '["aacc","ccac"]'::jsonb, 'false', 'wrong counts');

  INSERT INTO public.problems (level_id, title, description, difficulty, xp_reward, examples, hints, editorial, starter_code, function_name, param_names, order_index)
  VALUES (l_string_patterns, 'Longest Common Prefix', 'Return the longest common prefix among all strings in strs.', 'medium', 20,
    '[{"input":"strs = [\"flower\",\"flow\",\"flight\"]","output":"fl"}]'::jsonb,
    '["Start with the first string.","Shrink while another word does not start with it."]'::jsonb,
    'The common prefix can only get shorter as you compare more words.',
    'function longestCommonPrefix(strs) {\n  // Your code here\n}', 'longestCommonPrefix', '["strs"]'::jsonb, 2)
  ON CONFLICT (level_id, order_index) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO p;
  DELETE FROM public.test_cases WHERE problem_id = p;
  INSERT INTO public.test_cases (problem_id, input_args, expected_output, description) VALUES
    (p, '[["flower","flow","flight"]]'::jsonb, 'fl', 'shared prefix'),
    (p, '[["dog","racecar","car"]]'::jsonb, '', 'none'),
    (p, '[["alone"]]'::jsonb, 'alone', 'single word');

  -- World 6
  INSERT INTO public.problems (level_id, title, description, difficulty, xp_reward, examples, hints, editorial, starter_code, function_name, param_names, order_index)
  VALUES (l_revision, 'Contains Duplicate', 'Return true if any value appears at least twice.', 'easy', 10,
    '[{"input":"nums = [1,2,3,1]","output":"true"}]'::jsonb,
    '["A Set can track seen values.","Duplicate means seen before."]'::jsonb,
    'Track values as you scan the array.',
    'function containsDuplicate(nums) {\n  // Your code here\n}', 'containsDuplicate', '["nums"]'::jsonb, 1)
  ON CONFLICT (level_id, order_index) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO p;
  DELETE FROM public.test_cases WHERE problem_id = p;
  INSERT INTO public.test_cases (problem_id, input_args, expected_output, description) VALUES
    (p, '[[1,2,3,1]]'::jsonb, 'true', 'has duplicate'),
    (p, '[[1,2,3,4]]'::jsonb, 'false', 'unique'),
    (p, '[[]]'::jsonb, 'false', 'empty');

  INSERT INTO public.problems (level_id, title, description, difficulty, xp_reward, examples, hints, editorial, starter_code, function_name, param_names, order_index)
  VALUES (l_revision, 'Valid Parentheses', 'Return true if brackets are closed in the correct order. Brackets are (), [], and {}.', 'medium', 20,
    '[{"input":"s = \"()[]{}\"","output":"true"}]'::jsonb,
    '["Use a stack.","Opening brackets wait for matching closes."]'::jsonb,
    'A stack stores unmatched opening brackets.',
    'function validParentheses(s) {\n  // Your code here\n}', 'validParentheses', '["s"]'::jsonb, 2)
  ON CONFLICT (level_id, order_index) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO p;
  DELETE FROM public.test_cases WHERE problem_id = p;
  INSERT INTO public.test_cases (problem_id, input_args, expected_output, description) VALUES
    (p, '["()[]{}"]'::jsonb, 'true', 'valid'),
    (p, '["(]"]'::jsonb, 'false', 'wrong match'),
    (p, '["{[]}"]'::jsonb, 'true', 'nested');

  INSERT INTO public.problems (level_id, title, description, difficulty, xp_reward, examples, hints, editorial, starter_code, function_name, param_names, order_index)
  VALUES (l_revision, 'Maximum Product Subarray', 'Return the maximum product of any contiguous subarray.', 'hard', 40,
    '[{"input":"nums = [2,3,-2,4]","output":"6"}]'::jsonb,
    '["Track max and min products.","A negative can flip min into max."]'::jsonb,
    'Maintain both best and worst products ending at each index.',
    'function maxProductSubarray(nums) {\n  // Your code here\n}', 'maxProductSubarray', '["nums"]'::jsonb, 3)
  ON CONFLICT (level_id, order_index) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO p;
  DELETE FROM public.test_cases WHERE problem_id = p;
  INSERT INTO public.test_cases (problem_id, input_args, expected_output, description) VALUES
    (p, '[[2,3,-2,4]]'::jsonb, '6', 'classic'),
    (p, '[[-2,0,-1]]'::jsonb, '0', 'zero split'),
    (p, '[[-2,3,-4]]'::jsonb, '24', 'two negatives');

  -- World 7
  INSERT INTO public.problems (level_id, title, description, difficulty, xp_reward, examples, hints, editorial, starter_code, function_name, param_names, order_index)
  VALUES (l_linked_basics, 'Length of Linked List', 'The list is represented as an array of values. Return its length.', 'easy', 10,
    '[{"input":"values = [1,2,3]","output":"3"}]'::jsonb,
    '["For this app, the linked list is array-backed.","Return values.length."]'::jsonb,
    'Count the nodes in the list representation.',
    'function linkedListLength(values) {\n  // Your code here\n}', 'linkedListLength', '["values"]'::jsonb, 1)
  ON CONFLICT (level_id, order_index) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO p;
  DELETE FROM public.test_cases WHERE problem_id = p;
  INSERT INTO public.test_cases (problem_id, input_args, expected_output, description) VALUES
    (p, '[[1,2,3]]'::jsonb, '3', 'three nodes'),
    (p, '[[]]'::jsonb, '0', 'empty'),
    (p, '[[5]]'::jsonb, '1', 'single');

  INSERT INTO public.problems (level_id, title, description, difficulty, xp_reward, examples, hints, editorial, starter_code, function_name, param_names, order_index)
  VALUES (l_linked_basics, 'Reverse Linked List', 'The list is represented as an array. Return the values in reversed order.', 'medium', 20,
    '[{"input":"values = [1,2,3]","output":"[3,2,1]"}]'::jsonb,
    '["Reverse the sequence.","Do not mutate unless you copy first."]'::jsonb,
    'Reversing a linked list changes next pointers; here return the reversed array representation.',
    'function reverseLinkedList(values) {\n  // Your code here\n}', 'reverseLinkedList', '["values"]'::jsonb, 2)
  ON CONFLICT (level_id, order_index) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO p;
  DELETE FROM public.test_cases WHERE problem_id = p;
  INSERT INTO public.test_cases (problem_id, input_args, expected_output, description) VALUES
    (p, '[[1,2,3]]'::jsonb, '[3,2,1]', 'normal'),
    (p, '[[]]'::jsonb, '[]', 'empty'),
    (p, '[[9]]'::jsonb, '[9]', 'single');

  INSERT INTO public.problems (level_id, title, description, difficulty, xp_reward, examples, hints, editorial, starter_code, function_name, param_names, order_index)
  VALUES (l_linked_merge, 'Merge Two Sorted Lists', 'Both lists are represented as sorted arrays. Return one sorted merged array.', 'medium', 20,
    '[{"input":"a = [1,2,4], b = [1,3,4]","output":"[1,1,2,3,4,4]"}]'::jsonb,
    '["Use two pointers.","Push the smaller current value."]'::jsonb,
    'The merge step from merge sort combines two sorted sequences.',
    'function mergeTwoLists(a, b) {\n  // Your code here\n}', 'mergeTwoLists', '["a","b"]'::jsonb, 1)
  ON CONFLICT (level_id, order_index) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO p;
  DELETE FROM public.test_cases WHERE problem_id = p;
  INSERT INTO public.test_cases (problem_id, input_args, expected_output, description) VALUES
    (p, '[[1,2,4],[1,3,4]]'::jsonb, '[1,1,2,3,4,4]', 'normal'),
    (p, '[[],[]]'::jsonb, '[]', 'both empty'),
    (p, '[[],[0]]'::jsonb, '[0]', 'one empty');
END $$;
