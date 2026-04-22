import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle, Circle, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '../contexts/NavigationContext';
import { WorldWithProgress, LevelWithProgress } from '../types';
import { fetchWorldsWithProgress } from '../lib/data';
import DifficultyBadge from '../components/DifficultyBadge';
import Layout from '../components/Layout';

export default function WorldDetailPage({ worldId }: { worldId: string }) {
  const { user } = useAuth();
  const { navigate } = useNavigation();
  const [world, setWorld] = useState<WorldWithProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetchWorldsWithProgress(user.id)
      .then(worlds => {
        const found = worlds.find(w => w.id === worldId) ?? null;
        setWorld(found);
      })
      .catch(error => {
        console.error(error);
        setWorld(null);
      })
      .finally(() => setLoading(false));
  }, [user, worldId]);

  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </Layout>
  );

  if (!world) return (
    <Layout>
      <div className="flex items-center justify-center h-96 text-gray-400">World not found</div>
    </Layout>
  );

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('dashboard')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="rounded-2xl border border-gray-800 overflow-hidden mb-8" style={{ background: `linear-gradient(135deg, ${world.color}10, transparent)` }}>
          <div className="p-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: world.color }}>World {world.order_index}</p>
                <h1 className="text-3xl font-black text-white mb-2">{world.name}</h1>
                <p className="text-gray-400">{world.description}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black" style={{ color: world.color }}>{world.completionPercent}%</p>
                <p className="text-xs text-gray-500 mt-0.5">{world.solvedProblems}/{world.totalProblems} solved</p>
              </div>
            </div>
            <div className="mt-6 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${world.completionPercent}%`, backgroundColor: world.color, boxShadow: `0 0 8px ${world.color}60` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {world.levels.map((level: LevelWithProgress) => (
            <div key={level.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
                <div>
                  <h2 className="font-bold text-white">{level.name}</h2>
                  <p className="text-xs text-gray-500 mt-0.5">{level.description}</p>
                </div>
                <span className="text-sm text-gray-400">{level.solvedProblems}/{level.totalProblems}</span>
              </div>
              <div className="divide-y divide-gray-800">
                {level.problems.length === 0 ? (
                  <div className="px-5 py-4 text-gray-500 text-sm">No problems in this level yet</div>
                ) : (
                  level.problems.map(problem => (
                    <button
                      key={problem.id}
                      onClick={() => navigate('problem', { problemId: problem.id })}
                      className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-800/50 transition-colors text-left group"
                    >
                    {problem.solved ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-700 shrink-0 group-hover:text-gray-500 transition-colors" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm ${problem.solved ? 'text-gray-300' : 'text-white'}`}>
                        {problem.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <DifficultyBadge difficulty={problem.difficulty} />
                      <div className="flex items-center gap-1 text-xs text-amber-400">
                        <Zap className="w-3.5 h-3.5" />
                        <span>{problem.xp_reward} XP</span>
                      </div>
                      {problem.attempts > 0 && !problem.solved && (
                        <span className="text-xs text-gray-500">{problem.attempts} tries</span>
                      )}
                    </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
