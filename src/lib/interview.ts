import { TestCase } from '../types';

export type InterviewTopic =
  | 'Arrays & Strings'
  | 'Linked List'
  | 'Stack / Queue / Hashing'
  | 'Trees & Graphs'
  | 'Dynamic Programming';

export const INTERVIEW_TOPICS: InterviewTopic[] = [
  'Arrays & Strings',
  'Linked List',
  'Stack / Queue / Hashing',
  'Trees & Graphs',
  'Dynamic Programming',
];

export interface InterviewProblem {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic_tag: InterviewTopic;
  description: string;
  starter_code: string;
  function_name: string;
  param_names: string[];
  test_cases: Pick<TestCase, 'id' | 'problem_id' | 'input_args' | 'expected_output' | 'description' | 'is_hidden'>[];
}

export interface InterviewResult {
  problemId: string;
  status: 'accepted' | 'wrong_answer' | 'error' | 'not_attempted';
  attempts: number;
}

export interface InterviewReport {
  score: string;
  accuracy: number;
  timeTaken: string;
  weakTopic: string;
  strongTopic: string;
  feedback: string;
}

const tc = (
  problemId: string,
  index: number,
  input_args: unknown[],
  expected_output: string,
  description: string
) => ({
  id: `${problemId}-tc-${index}`,
  problem_id: problemId,
  input_args,
  expected_output,
  description,
  is_hidden: false,
});

export const INTERVIEW_PROBLEMS: InterviewProblem[] = [
  {
    id: 'int-two-sum',
    title: 'Two Sum',
    difficulty: 'easy',
    topic_tag: 'Arrays & Strings',
    description: 'Return indices of two numbers in nums that add up to target.',
    starter_code: 'function twoSum(nums, target) {\n  // Your code here\n}',
    function_name: 'twoSum',
    param_names: ['nums', 'target'],
    test_cases: [
      tc('int-two-sum', 1, [[2, 7, 11, 15], 9], '[0,1]', 'classic pair'),
      tc('int-two-sum', 2, [[3, 2, 4], 6], '[1,2]', 'middle pair'),
      tc('int-two-sum', 3, [[3, 3], 6], '[0,1]', 'duplicate values'),
    ],
  },
  {
    id: 'int-anagram',
    title: 'Anagram Check',
    difficulty: 'easy',
    topic_tag: 'Arrays & Strings',
    description: 'Return true if s and t contain the same characters with the same counts.',
    starter_code: 'function anagramCheck(s, t) {\n  // Your code here\n}',
    function_name: 'anagramCheck',
    param_names: ['s', 't'],
    test_cases: [
      tc('int-anagram', 1, ['listen', 'silent'], 'true', 'valid anagram'),
      tc('int-anagram', 2, ['rat', 'car'], 'false', 'different letters'),
      tc('int-anagram', 3, ['aacc', 'ccac'], 'false', 'same letters but wrong counts'),
    ],
  },
  {
    id: 'int-kadane',
    title: 'Kadane Algorithm',
    difficulty: 'medium',
    topic_tag: 'Arrays & Strings',
    description: 'Return the maximum sum of any contiguous subarray.',
    starter_code: 'function maxSubarraySum(nums) {\n  // Your code here\n}',
    function_name: 'maxSubarraySum',
    param_names: ['nums'],
    test_cases: [
      tc('int-kadane', 1, [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], '6', 'classic case'),
      tc('int-kadane', 2, [[1]], '1', 'single value'),
      tc('int-kadane', 3, [[-3, -2, -5]], '-2', 'all negative'),
    ],
  },
  {
    id: 'int-longest-substring',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'medium',
    topic_tag: 'Arrays & Strings',
    description: 'Return the length of the longest substring without repeated characters.',
    starter_code: 'function longestUniqueSubstring(s) {\n  // Your code here\n}',
    function_name: 'longestUniqueSubstring',
    param_names: ['s'],
    test_cases: [
      tc('int-longest-substring', 1, ['abcabcbb'], '3', 'abc'),
      tc('int-longest-substring', 2, ['bbbbb'], '1', 'single repeated char'),
      tc('int-longest-substring', 3, ['pwwkew'], '3', 'wke'),
    ],
  },
  {
    id: 'int-rotate-array',
    title: 'Rotate Array',
    difficulty: 'hard',
    topic_tag: 'Arrays & Strings',
    description: 'Return nums rotated to the right by k positions.',
    starter_code: 'function rotateArray(nums, k) {\n  // Your code here\n}',
    function_name: 'rotateArray',
    param_names: ['nums', 'k'],
    test_cases: [
      tc('int-rotate-array', 1, [[1, 2, 3, 4, 5, 6, 7], 3], '[5,6,7,1,2,3,4]', 'normal rotation'),
      tc('int-rotate-array', 2, [[-1, -100, 3, 99], 2], '[3,99,-1,-100]', 'negative values'),
      tc('int-rotate-array', 3, [[1, 2], 5], '[2,1]', 'k larger than length'),
    ],
  },
  {
    id: 'int-middle-list',
    title: 'Find Middle Element',
    difficulty: 'easy',
    topic_tag: 'Linked List',
    description: 'The list is represented as an array. Return the middle value. For even length, return the second middle.',
    starter_code: 'function findMiddle(values) {\n  // Your code here\n}',
    function_name: 'findMiddle',
    param_names: ['values'],
    test_cases: [
      tc('int-middle-list', 1, [[1, 2, 3, 4, 5]], '3', 'odd length'),
      tc('int-middle-list', 2, [[1, 2, 3, 4]], '3', 'even length'),
      tc('int-middle-list', 3, [[9]], '9', 'single value'),
    ],
  },
  {
    id: 'int-reverse-list',
    title: 'Reverse a Linked List',
    difficulty: 'medium',
    topic_tag: 'Linked List',
    description: 'The list is represented as an array. Return the values in reversed order.',
    starter_code: 'function reverseLinkedList(values) {\n  // Your code here\n}',
    function_name: 'reverseLinkedList',
    param_names: ['values'],
    test_cases: [
      tc('int-reverse-list', 1, [[1, 2, 3]], '[3,2,1]', 'normal list'),
      tc('int-reverse-list', 2, [[]], '[]', 'empty list'),
      tc('int-reverse-list', 3, [[7]], '[7]', 'single node'),
    ],
  },
  {
    id: 'int-detect-cycle',
    title: 'Detect a Cycle',
    difficulty: 'medium',
    topic_tag: 'Linked List',
    description: 'Values represents nodes and pos is the index where the tail connects, or -1. Return true if a cycle exists.',
    starter_code: 'function hasCycle(values, pos) {\n  // Your code here\n}',
    function_name: 'hasCycle',
    param_names: ['values', 'pos'],
    test_cases: [
      tc('int-detect-cycle', 1, [[3, 2, 0, -4], 1], 'true', 'cycle to index 1'),
      tc('int-detect-cycle', 2, [[1, 2], 0], 'true', 'cycle to head'),
      tc('int-detect-cycle', 3, [[1], -1], 'false', 'no cycle'),
    ],
  },
  {
    id: 'int-merge-lists',
    title: 'Merge Two Sorted Linked Lists',
    difficulty: 'hard',
    topic_tag: 'Linked List',
    description: 'Both lists are represented as sorted arrays. Return one sorted merged array.',
    starter_code: 'function mergeTwoLists(a, b) {\n  // Your code here\n}',
    function_name: 'mergeTwoLists',
    param_names: ['a', 'b'],
    test_cases: [
      tc('int-merge-lists', 1, [[1, 2, 4], [1, 3, 4]], '[1,1,2,3,4,4]', 'classic merge'),
      tc('int-merge-lists', 2, [[], []], '[]', 'both empty'),
      tc('int-merge-lists', 3, [[], [0]], '[0]', 'one empty'),
    ],
  },
  {
    id: 'int-valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'easy',
    topic_tag: 'Stack / Queue / Hashing',
    description: 'Return true if the brackets are balanced and closed in the correct order.',
    starter_code: 'function validParentheses(s) {\n  // Your code here\n}',
    function_name: 'validParentheses',
    param_names: ['s'],
    test_cases: [
      tc('int-valid-parentheses', 1, ['()[]{}'], 'true', 'separate pairs'),
      tc('int-valid-parentheses', 2, ['(]'], 'false', 'wrong close'),
      tc('int-valid-parentheses', 3, ['{[]}'], 'true', 'nested brackets'),
    ],
  },
  {
    id: 'int-next-greater',
    title: 'Next Greater Element',
    difficulty: 'medium',
    topic_tag: 'Stack / Queue / Hashing',
    description: 'Return an array where each index contains the next greater value to its right, or -1.',
    starter_code: 'function nextGreaterElement(nums) {\n  // Your code here\n}',
    function_name: 'nextGreaterElement',
    param_names: ['nums'],
    test_cases: [
      tc('int-next-greater', 1, [[2, 1, 2, 4, 3]], '[4,2,4,-1,-1]', 'mixed'),
      tc('int-next-greater', 2, [[1, 2, 3]], '[2,3,-1]', 'increasing'),
      tc('int-next-greater', 3, [[3, 2, 1]], '[-1,-1,-1]', 'decreasing'),
    ],
  },
  {
    id: 'int-rpn',
    title: 'Evaluate Reverse Polish Notation',
    difficulty: 'medium',
    topic_tag: 'Stack / Queue / Hashing',
    description: 'Evaluate a postfix expression. Tokens contain integers and +, -, *, /. Division truncates toward zero.',
    starter_code: 'function evalRPN(tokens) {\n  // Your code here\n}',
    function_name: 'evalRPN',
    param_names: ['tokens'],
    test_cases: [
      tc('int-rpn', 1, [['2', '1', '+', '3', '*']], '9', 'addition then multiply'),
      tc('int-rpn', 2, [['4', '13', '5', '/', '+']], '6', 'division'),
      tc('int-rpn', 3, [['3', '-4', '+']], '-1', 'negative number'),
    ],
  },
  {
    id: 'int-lru',
    title: 'LRU Cache Implementation',
    difficulty: 'hard',
    topic_tag: 'Stack / Queue / Hashing',
    description: 'Given capacity and operations, return outputs for get operations. Operations are ["put", key, value] or ["get", key].',
    starter_code: 'function lruCache(capacity, operations) {\n  // Your code here\n}',
    function_name: 'lruCache',
    param_names: ['capacity', 'operations'],
    test_cases: [
      tc('int-lru', 1, [2, [['put', 1, 1], ['put', 2, 2], ['get', 1], ['put', 3, 3], ['get', 2], ['get', 3]]], '[1,-1,3]', 'evicts least recent'),
      tc('int-lru', 2, [1, [['put', 1, 1], ['put', 2, 2], ['get', 1], ['get', 2]]], '[-1,2]', 'capacity one'),
      tc('int-lru', 3, [2, [['get', 5]]], '[-1]', 'missing key'),
    ],
  },
  {
    id: 'int-inorder',
    title: 'Binary Tree Traversals',
    difficulty: 'easy',
    topic_tag: 'Trees & Graphs',
    description: 'A binary tree is represented as level-order array with nulls. Return inorder traversal values.',
    starter_code: 'function inorderTraversal(tree) {\n  // Your code here\n}',
    function_name: 'inorderTraversal',
    param_names: ['tree'],
    test_cases: [
      tc('int-inorder', 1, [[1, null, 2, 3]], '[1,3,2]', 'right child with left grandchild'),
      tc('int-inorder', 2, [[]], '[]', 'empty tree'),
      tc('int-inorder', 3, [[1, 2, 3]], '[2,1,3]', 'full small tree'),
    ],
  },
  {
    id: 'int-bfs',
    title: 'BFS Traversal',
    difficulty: 'medium',
    topic_tag: 'Trees & Graphs',
    description: 'Given an adjacency list object and a start node, return BFS order.',
    starter_code: 'function bfsTraversal(graph, start) {\n  // Your code here\n}',
    function_name: 'bfsTraversal',
    param_names: ['graph', 'start'],
    test_cases: [
      tc('int-bfs', 1, [{ A: ['B', 'C'], B: ['D'], C: [], D: [] }, 'A'], '["A","B","C","D"]', 'simple graph'),
      tc('int-bfs', 2, [{ 1: [2, 3], 2: [], 3: [4], 4: [] }, '1'], '["1","2","3","4"]', 'numeric labels as strings'),
      tc('int-bfs', 3, [{ A: [] }, 'A'], '["A"]', 'single node'),
    ],
  },
  {
    id: 'int-graph-cycle',
    title: 'Detect Cycle in Graph',
    difficulty: 'medium',
    topic_tag: 'Trees & Graphs',
    description: 'Given a directed graph as adjacency list object, return true if it contains a cycle.',
    starter_code: 'function hasGraphCycle(graph) {\n  // Your code here\n}',
    function_name: 'hasGraphCycle',
    param_names: ['graph'],
    test_cases: [
      tc('int-graph-cycle', 1, [{ A: ['B'], B: ['C'], C: ['A'] }], 'true', 'cycle'),
      tc('int-graph-cycle', 2, [{ A: ['B'], B: ['C'], C: [] }], 'false', 'acyclic'),
      tc('int-graph-cycle', 3, [{ A: [] }], 'false', 'single node'),
    ],
  },
  {
    id: 'int-dijkstra',
    title: 'Shortest Path',
    difficulty: 'hard',
    topic_tag: 'Trees & Graphs',
    description: 'Given weighted directed edges [from,to,weight], return shortest distance from start to target, or -1.',
    starter_code: 'function shortestPath(edges, start, target) {\n  // Your code here\n}',
    function_name: 'shortestPath',
    param_names: ['edges', 'start', 'target'],
    test_cases: [
      tc('int-dijkstra', 1, [[['A', 'B', 2], ['A', 'C', 5], ['B', 'C', 1]], 'A', 'C'], '3', 'via B'),
      tc('int-dijkstra', 2, [[['A', 'B', 4]], 'B', 'A'], '-1', 'unreachable'),
      tc('int-dijkstra', 3, [[['A', 'B', 1], ['B', 'C', 2], ['A', 'C', 10]], 'A', 'C'], '3', 'shorter chain'),
    ],
  },
  {
    id: 'int-fib-dp',
    title: 'Fibonacci Series',
    difficulty: 'easy',
    topic_tag: 'Dynamic Programming',
    description: 'Return the nth Fibonacci number where fib(0)=0 and fib(1)=1.',
    starter_code: 'function fibonacciDP(n) {\n  // Your code here\n}',
    function_name: 'fibonacciDP',
    param_names: ['n'],
    test_cases: [
      tc('int-fib-dp', 1, [0], '0', 'zero'),
      tc('int-fib-dp', 2, [1], '1', 'one'),
      tc('int-fib-dp', 3, [10], '55', 'ten'),
    ],
  },
  {
    id: 'int-lcs',
    title: 'Longest Common Subsequence',
    difficulty: 'medium',
    topic_tag: 'Dynamic Programming',
    description: 'Return the length of the longest subsequence common to text1 and text2.',
    starter_code: 'function longestCommonSubsequence(text1, text2) {\n  // Your code here\n}',
    function_name: 'longestCommonSubsequence',
    param_names: ['text1', 'text2'],
    test_cases: [
      tc('int-lcs', 1, ['abcde', 'ace'], '3', 'ace'),
      tc('int-lcs', 2, ['abc', 'abc'], '3', 'same strings'),
      tc('int-lcs', 3, ['abc', 'def'], '0', 'no overlap'),
    ],
  },
  {
    id: 'int-coin-change',
    title: 'Coin Change Problem',
    difficulty: 'medium',
    topic_tag: 'Dynamic Programming',
    description: 'Return the minimum number of coins needed to make amount, or -1 if impossible.',
    starter_code: 'function coinChange(coins, amount) {\n  // Your code here\n}',
    function_name: 'coinChange',
    param_names: ['coins', 'amount'],
    test_cases: [
      tc('int-coin-change', 1, [[1, 2, 5], 11], '3', '5 + 5 + 1'),
      tc('int-coin-change', 2, [[2], 3], '-1', 'impossible'),
      tc('int-coin-change', 3, [[1], 0], '0', 'zero amount'),
    ],
  },
  {
    id: 'int-knapsack',
    title: '0/1 Knapsack Problem',
    difficulty: 'hard',
    topic_tag: 'Dynamic Programming',
    description: 'Given weights, values, and capacity, return maximum value using each item at most once.',
    starter_code: 'function knapsack(weights, values, capacity) {\n  // Your code here\n}',
    function_name: 'knapsack',
    param_names: ['weights', 'values', 'capacity'],
    test_cases: [
      tc('int-knapsack', 1, [[1, 3, 4, 5], [1, 4, 5, 7], 7], '9', 'items with weights 3 and 4'),
      tc('int-knapsack', 2, [[2, 3], [4, 5], 1], '0', 'nothing fits'),
      tc('int-knapsack', 3, [[2, 3, 4], [4, 5, 6], 5], '9', 'first two items'),
    ],
  },
];

export const TOPIC_FROM_TITLE: Record<string, InterviewTopic> = INTERVIEW_PROBLEMS.reduce((acc, problem) => {
  acc[problem.title.toLowerCase()] = problem.topic_tag;
  return acc;
}, {} as Record<string, InterviewTopic>);

export function inferTopicFromTitle(title: string): InterviewTopic {
  const normalized = title.toLowerCase();
  const direct = TOPIC_FROM_TITLE[normalized];
  if (direct) return direct;
  if (/linked|list|cycle|middle/.test(normalized)) return 'Linked List';
  if (/parentheses|stack|queue|hash|anagram|duplicate|lru|rpn/.test(normalized)) return 'Stack / Queue / Hashing';
  if (/tree|graph|bfs|dfs|path|ancestor|topological|cycle/.test(normalized)) return 'Trees & Graphs';
  if (/fibonacci|subsequence|knapsack|coin|product/.test(normalized)) return 'Dynamic Programming';
  return 'Arrays & Strings';
}

export function chooseInterviewSet(topic: InterviewTopic, count = 4): InterviewProblem[] {
  const pool = INTERVIEW_PROBLEMS.filter(problem => problem.topic_tag === topic);
  const easy = pool.filter(problem => problem.difficulty === 'easy');
  const medium = pool.filter(problem => problem.difficulty === 'medium');
  const hard = pool.filter(problem => problem.difficulty === 'hard');
  const selected = count === 2
    ? [easy[0] ?? medium[0] ?? pool[0], medium[0] ?? hard[0] ?? pool[1]]
    : [easy[0] ?? pool[0], ...medium.slice(0, 2), hard[0] ?? medium[2] ?? pool[pool.length - 1]];
  const unique = Array.from(new Map(selected.filter(Boolean).map(problem => [problem.id, problem])).values());
  return unique.slice(0, count);
}

export function formatInterviewTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export function formatTimeTaken(totalSeconds: number) {
  const minutes = Math.max(1, Math.ceil(totalSeconds / 60));
  return `${minutes} min`;
}

export function buildInterviewReport(
  problems: InterviewProblem[],
  results: Record<string, InterviewResult>,
  durationMinutes: number,
  remainingSeconds: number,
  weakTopic: InterviewTopic
): InterviewReport {
  const solved = problems.filter(problem => results[problem.id]?.status === 'accepted');
  const failed = problems.filter(problem => results[problem.id]?.status !== 'accepted');
  const accuracy = Math.round((solved.length / Math.max(1, problems.length)) * 100);
  const timeTakenSeconds = durationMinutes * 60 - remainingSeconds;

  const solvedTopicCounts = new Map<InterviewTopic, number>();
  const failedTopicCounts = new Map<InterviewTopic, number>();
  solved.forEach(problem => solvedTopicCounts.set(problem.topic_tag, (solvedTopicCounts.get(problem.topic_tag) ?? 0) + 1));
  failed.forEach(problem => failedTopicCounts.set(problem.topic_tag, (failedTopicCounts.get(problem.topic_tag) ?? 0) + 1));

  const strongTopic = [...solvedTopicCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Not enough solved problems';
  const reportWeakTopic = [...failedTopicCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? weakTopic;

  const feedback = solved.length === problems.length
    ? `Excellent interview. You solved every problem in the ${weakTopic} set. Try a longer 60-minute mixed session next.`
    : `You handled ${strongTopic} better but struggled with ${reportWeakTopic}. Revisit that topic and solve 3 focused practice questions before your next interview simulation.`;

  return {
    score: `${solved.length}/${problems.length}`,
    accuracy,
    timeTaken: formatTimeTaken(timeTakenSeconds),
    weakTopic: reportWeakTopic,
    strongTopic,
    feedback,
  };
}
