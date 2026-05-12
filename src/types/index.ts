export interface Profile {
  id: string;
  username: string;
  avatar_url: string;
  xp: number;
  streak: number;
  last_active: string;
  created_at: string;
}

export type Language = 'javascript' | 'cpp' | 'python';

export interface World {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  order_index: number;
}

export interface Level {
  id: string;
  world_id: string;
  name: string;
  description: string;
  order_index: number;
}

export interface Problem {
  id: string;
  level_id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  xp_reward: number;
  examples: Example[];
  hints: string[];
  editorial: string;
  starter_code: string;
  function_name: string;
  param_names: string[];
  order_index: number;
}

export interface Example {
  input: string;
  output: string;
}

export interface TestCase {
  id: string;
  problem_id: string;
  input_args: unknown[];
  expected_output: string;
  description: string;
  is_hidden: boolean;
}

export interface Submission {
  id: string;
  user_id: string;
  problem_id: string;
  code: string;
  status: 'accepted' | 'wrong_answer' | 'error';
  xp_earned: number;
  test_results: TestResult[];
  created_at: string;
}

export interface TestResult {
  passed: boolean;
  input: unknown[];
  expected: string;
  actual: string;
  description: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  problem_id: string;
  solved: boolean;
  attempts: number;
  solved_at: string | null;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requirement_type: string;
  requirement_value: number;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  badge?: Badge;
}

export interface UserNote {
  id: string;
  user_id: string;
  problem_id: string;
  content: string;
  updated_at: string;
}

export interface WorldWithProgress extends World {
  levels: LevelWithProgress[];
  totalProblems: number;
  solvedProblems: number;
  completionPercent: number;
  unlocked: boolean;
}

export interface LevelWithProgress extends Level {
  problems: ProblemWithProgress[];
  totalProblems: number;
  solvedProblems: number;
}

export interface ProblemWithProgress extends Problem {
  solved: boolean;
  attempts: number;
}

export type Page =
  | 'landing'
  | 'dashboard'
  | 'world'
  | 'problem'
  | 'leaderboard'
  | 'interview'
  | 'profile'
  | 'report';

export interface NavigationState {
  page: Page;
  worldId?: string;
  problemId?: string;
}
