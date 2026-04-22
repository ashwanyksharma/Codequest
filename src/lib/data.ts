import { supabase } from './supabase';
import { World, Level, Problem, TestCase, UserProgress, WorldWithProgress } from '../types';

export async function fetchWorldsWithProgress(userId: string): Promise<WorldWithProgress[]> {
  const [{ data: worlds }, { data: levels }, { data: problems }, { data: progress }] = await Promise.all([
    supabase.from('worlds').select('*').order('order_index'),
    supabase.from('levels').select('*').order('order_index'),
    supabase.from('problems').select('*').order('order_index'),
    supabase.from('user_progress').select('*').eq('user_id', userId),
  ]);

  if (!worlds || !levels || !problems) return [];

  const progressMap = new Map<string, UserProgress>();
  (progress ?? []).forEach(p => progressMap.set(p.problem_id, p));

  const worldsWithProgress: WorldWithProgress[] = (worlds as World[]).map((world, worldIdx) => {
    const worldLevels = (levels as Level[]).filter(l => l.world_id === world.id);

    const levelsWithProgress = worldLevels.map(level => {
      const levelProblems = (problems as Problem[]).filter(p => p.level_id === level.id);
      const problemsWithProgress = levelProblems.map(prob => ({
        ...prob,
        solved: progressMap.get(prob.id)?.solved ?? false,
        attempts: progressMap.get(prob.id)?.attempts ?? 0,
      }));
      return {
        ...level,
        problems: problemsWithProgress,
        totalProblems: levelProblems.length,
        solvedProblems: problemsWithProgress.filter(p => p.solved).length,
      };
    });

    const totalProblems = levelsWithProgress.reduce((s, l) => s + l.totalProblems, 0);
    const solvedProblems = levelsWithProgress.reduce((s, l) => s + l.solvedProblems, 0);
    const completionPercent = totalProblems > 0 ? Math.round((solvedProblems / totalProblems) * 100) : 0;

    const prevWorld = worldIdx > 0 ? (worlds as World[])[worldIdx - 1] : null;
    let unlocked = worldIdx === 0;
    if (prevWorld && !unlocked) {
      const prevWorldProblems = (problems as Problem[]).filter(p => {
        const lvl = (levels as Level[]).find(l => l.id === p.level_id);
        return lvl?.world_id === prevWorld.id;
      });
      const prevSolved = prevWorldProblems.filter(p => progressMap.get(p.id)?.solved).length;
      const prevTotal = prevWorldProblems.length;
      unlocked = prevTotal > 0 && (prevSolved / prevTotal) >= 0.5;
    }

    return {
      ...world,
      levels: levelsWithProgress,
      totalProblems,
      solvedProblems,
      completionPercent,
      unlocked,
    };
  });

  return worldsWithProgress;
}

export async function fetchProblemWithTestCases(problemId: string): Promise<{ problem: Problem | null; testCases: TestCase[] }> {
  const [{ data: problem }, { data: testCases }] = await Promise.all([
    supabase.from('problems').select('*').eq('id', problemId).maybeSingle(),
    supabase.from('test_cases').select('*').eq('problem_id', problemId).eq('is_hidden', false).order('created_at'),
  ]);
  return { problem: problem as Problem | null, testCases: (testCases ?? []) as TestCase[] };
}

export async function fetchLeaderboard() {
  const { data } = await supabase
    .from('profiles')
    .select('id, username, xp, streak')
    .order('xp', { ascending: false })
    .limit(50);
  return data ?? [];
}
