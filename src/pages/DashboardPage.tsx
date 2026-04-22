import { useEffect, useState } from 'react';
import { Zap, Flame, Trophy, Target, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '../contexts/NavigationContext';
import { WorldWithProgress } from '../types';
import { fetchWorldsWithProgress } from '../lib/data';
import WorldCard from '../components/WorldCard';
import XPBar from '../components/XPBar';
import Layout from '../components/Layout';

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const { navigate } = useNavigation();
  const [worlds, setWorlds] = useState<WorldWithProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetchWorldsWithProgress(user.id)
      .then(setWorlds)
      .catch(error => {
        console.error(error);
        setWorlds([]);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const totalSolved = worlds.reduce((s, w) => s + w.solvedProblems, 0);
  const totalProblems = worlds.reduce((s, w) => s + w.totalProblems, 0);
  const worldsUnlocked = worlds.filter(w => w.unlocked).length;

  const stats = [
    { label: 'Total XP', value: profile?.xp ?? 0, icon: Zap, color: '#f59e0b' },
    { label: 'Day Streak', value: profile?.streak ?? 0, icon: Flame, color: '#f97316' },
    { label: 'Problems Solved', value: totalSolved, icon: Target, color: '#10b981' },
    { label: 'Worlds Unlocked', value: `${worldsUnlocked}/7`, icon: Trophy, color: '#3b82f6' },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white">
            Welcome back, <span className="text-emerald-400">{profile?.username ?? 'Coder'}</span>
          </h1>
          <p className="text-gray-400 mt-1">Continue your quest to DSA mastery</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
              </div>
              <p className="text-2xl font-black text-white">{value}</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span className="font-semibold text-white">Overall Progress</span>
            </div>
            <button
              onClick={() => navigate('report')}
              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              View AI Report →
            </button>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
            <span>{totalSolved} of {totalProblems} problems solved</span>
            <span className="font-semibold text-white">{totalProblems > 0 ? Math.round((totalSolved / totalProblems) * 100) : 0}%</span>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-1000"
              style={{ width: `${totalProblems > 0 ? (totalSolved / totalProblems) * 100 : 0}%` }}
            />
          </div>
          <XPBar current={profile?.xp ?? 0} className="mt-4" />
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">Worlds</h2>
          <p className="text-sm text-gray-500 mt-0.5">Unlock worlds by completing 50% of the previous one — click any world to see all problems</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-52 bg-gray-900 border border-gray-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {worlds.map((world, i) => (
              <WorldCard key={world.id} world={world} index={i} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
