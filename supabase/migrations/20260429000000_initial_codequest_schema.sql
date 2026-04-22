/*
  # CodeQuest Initial Schema

  Run this in your Supabase SQL editor for a fresh project.
  It creates the app tables, RLS policies, and default badges.
*/

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text NOT NULL UNIQUE,
  avatar_url text,
  xp integer NOT NULL DEFAULT 0 CHECK (xp >= 0),
  streak integer NOT NULL DEFAULT 0 CHECK (streak >= 0),
  last_active date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.worlds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL DEFAULT 'Code2',
  color text NOT NULL DEFAULT '#10b981',
  order_index integer NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid NOT NULL REFERENCES public.worlds(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL,
  order_index integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (world_id, order_index)
);

CREATE TABLE IF NOT EXISTS public.problems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level_id uuid NOT NULL REFERENCES public.levels(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  xp_reward integer NOT NULL CHECK (xp_reward > 0),
  examples jsonb NOT NULL DEFAULT '[]'::jsonb,
  hints jsonb NOT NULL DEFAULT '[]'::jsonb,
  editorial text NOT NULL DEFAULT '',
  starter_code text NOT NULL DEFAULT '',
  function_name text NOT NULL,
  param_names jsonb NOT NULL DEFAULT '[]'::jsonb,
  order_index integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (level_id, order_index)
);

CREATE TABLE IF NOT EXISTS public.test_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_id uuid NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  input_args jsonb NOT NULL DEFAULT '[]'::jsonb,
  expected_output text NOT NULL,
  description text NOT NULL DEFAULT '',
  is_hidden boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  problem_id uuid NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  code text NOT NULL,
  status text NOT NULL CHECK (status IN ('accepted', 'wrong_answer', 'error')),
  xp_earned integer NOT NULL DEFAULT 0 CHECK (xp_earned >= 0),
  test_results jsonb NOT NULL DEFAULT '[]'::jsonb,
  language text NOT NULL DEFAULT 'javascript' CHECK (language IN ('javascript', 'cpp', 'python')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  problem_id uuid NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  solved boolean NOT NULL DEFAULT false,
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  solved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, problem_id)
);

CREATE TABLE IF NOT EXISTS public.badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text NOT NULL,
  icon text NOT NULL,
  color text NOT NULL,
  requirement_type text NOT NULL,
  requirement_value integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id uuid NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, badge_id)
);

CREATE TABLE IF NOT EXISTS public.user_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  problem_id uuid NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  content text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, problem_id)
);

CREATE INDEX IF NOT EXISTS idx_levels_world_id ON public.levels(world_id);
CREATE INDEX IF NOT EXISTS idx_problems_level_id ON public.problems(level_id);
CREATE INDEX IF NOT EXISTS idx_test_cases_problem_id ON public.test_cases(problem_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user_created ON public.submissions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notes_user_problem ON public.user_notes(user_id, problem_id);

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_user_progress_updated_at ON public.user_progress;
CREATE TRIGGER set_user_progress_updated_at
BEFORE UPDATE ON public.user_progress
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_user_notes_updated_at ON public.user_notes;
CREATE TRIGGER set_user_notes_updated_at
BEFORE UPDATE ON public.user_notes
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worlds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can read profiles" ON public.profiles;
CREATE POLICY "Authenticated users can read profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Authenticated users can read worlds" ON public.worlds;
CREATE POLICY "Authenticated users can read worlds"
ON public.worlds FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Authenticated users can read levels" ON public.levels;
CREATE POLICY "Authenticated users can read levels"
ON public.levels FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Authenticated users can read problems" ON public.problems;
CREATE POLICY "Authenticated users can read problems"
ON public.problems FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Authenticated users can read visible test cases" ON public.test_cases;
CREATE POLICY "Authenticated users can read visible test cases"
ON public.test_cases FOR SELECT
TO authenticated
USING (is_hidden = false);

DROP POLICY IF EXISTS "Users can read own submissions" ON public.submissions;
CREATE POLICY "Users can read own submissions"
ON public.submissions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own submissions" ON public.submissions;
CREATE POLICY "Users can insert own submissions"
ON public.submissions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read own progress" ON public.user_progress;
CREATE POLICY "Users can read own progress"
ON public.user_progress FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own progress" ON public.user_progress;
CREATE POLICY "Users can insert own progress"
ON public.user_progress FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own progress" ON public.user_progress;
CREATE POLICY "Users can update own progress"
ON public.user_progress FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Authenticated users can read badges" ON public.badges;
CREATE POLICY "Authenticated users can read badges"
ON public.badges FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Users can read own badges" ON public.user_badges;
CREATE POLICY "Users can read own badges"
ON public.user_badges FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own badges" ON public.user_badges;
CREATE POLICY "Users can insert own badges"
ON public.user_badges FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read own notes" ON public.user_notes;
CREATE POLICY "Users can read own notes"
ON public.user_notes FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own notes" ON public.user_notes;
CREATE POLICY "Users can insert own notes"
ON public.user_notes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notes" ON public.user_notes;
CREATE POLICY "Users can update own notes"
ON public.user_notes FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

INSERT INTO public.badges (name, description, icon, color, requirement_type, requirement_value)
VALUES
  ('First Blood', 'Solve your first problem', 'Target', '#10b981', 'problems_solved', 1),
  ('Hat Trick', 'Solve 3 problems', 'Trophy', '#3b82f6', 'problems_solved', 3),
  ('XP Hunter', 'Earn 100 XP', 'Zap', '#f59e0b', 'xp', 100),
  ('Problem Slayer', 'Solve 10 problems', 'Award', '#8b5cf6', 'problems_solved', 10),
  ('Streak Starter', 'Reach a 3-day streak', 'Flame', '#f97316', 'streak', 3),
  ('Week Warrior', 'Reach a 7-day streak', 'Calendar', '#06b6d4', 'streak', 7),
  ('XP Legend', 'Earn 500 XP', 'Crown', '#facc15', 'xp', 500),
  ('World Conqueror', 'Complete a world', 'Globe', '#22c55e', 'world_completed', 1),
  ('Hard Core', 'Solve 5 hard problems', 'Shield', '#ef4444', 'hard_solved', 5),
  ('Speed Demon', 'Solve 5 problems in one day', 'Timer', '#ec4899', 'daily_solved', 5)
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  requirement_type = EXCLUDED.requirement_type,
  requirement_value = EXCLUDED.requirement_value;
