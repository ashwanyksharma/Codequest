import { useEffect, useState } from 'react';
import { Zap, Flame, Target, Calendar, Award } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Badge, UserBadge } from '../types';
import BadgeCard from '../components/BadgeCard';
import XPBar from '../components/XPBar';
import Layout from '../components/Layout';

export default function ProfilePage() {
  const { user, profile } = useAuth();
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [solvedCount, setSolvedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    Promise.all([
      supabase.from('badges').select('*').order('requirement_value'),
      supabase.from('user_badges').select('*').eq('user_id', user.id),
      supabase.from('user_progress').select('id').eq('user_id', user.id).eq('solved', true),
    ])
      .then(([{ data: badges }, { data: ubadges }, { data: progress }]) => {
        setAllBadges((badges ?? []) as Badge[]);
        setUserBadges((ubadges ?? []) as UserBadge[]);
        setSolvedCount((progress ?? []).length);
      })
      .catch(error => {
        console.error(error);
        setAllBadges([]);
        setUserBadges([]);
        setSolvedCount(0);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const level = Math.floor((profile?.xp ?? 0) / 100) + 1;

  const stats = [
    { label: 'Total XP', value: profile?.xp ?? 0, icon: Zap, color: '#f59e0b' },
    { label: 'Level', value: level, icon: Award, color: '#10b981' },
    { label: 'Problems Solved', value: solvedCount, icon: Target, color: '#3b82f6' },
    { label: 'Day Streak', value: profile?.streak ?? 0, icon: Flame, color: '#f97316' },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center text-3xl font-black text-emerald-400 shrink-0">
              {profile?.username?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-black text-white mb-1">{profile?.username ?? 'Loading...'}</h1>
              <p className="text-gray-400 text-sm mb-3">{user?.email}</p>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>Joined {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'recently'}</span>
              </div>
              <XPBar current={profile?.xp ?? 0} className="mt-4 max-w-xs" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500 uppercase tracking-wide">{label}</span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
              </div>
              <p className="text-2xl font-black text-white">{value}</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">Badges</h2>
            <span className="text-sm text-gray-500">{userBadges.length}/{allBadges.length} earned</span>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-32 bg-gray-800 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {allBadges.map(badge => {
                const ub = userBadges.find(u => u.badge_id === badge.id);
                return (
                  <BadgeCard
                    key={badge.id}
                    badge={badge}
                    earned={!!ub}
                    earnedAt={ub?.earned_at}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
