import { useEffect, useState } from 'react';
import { Trophy, Zap, Flame, Crown, Medal } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { fetchLeaderboard } from '../lib/data';
import Layout from '../components/Layout';

interface LeaderboardEntry {
  id: string;
  username: string;
  xp: number;
  streak: number;
}

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard()
      .then(data => setEntries(data as LeaderboardEntry[]))
      .catch(error => {
        console.error(error);
        setEntries([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-amber-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="text-gray-500 font-bold text-sm w-5 text-center">{rank}</span>;
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) return 'bg-amber-500/5 border-amber-500/20';
    if (rank === 2) return 'bg-gray-400/5 border-gray-400/20';
    if (rank === 3) return 'bg-amber-700/5 border-amber-700/20';
    return 'bg-gray-900 border-gray-800';
  };

  const maxXP = entries[0]?.xp ?? 1;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-center">
            <Trophy className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Leaderboard</h1>
            <p className="text-gray-400 text-sm">Top coders by XP</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-900 border border-gray-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry, i) => {
              const rank = i + 1;
              const isMe = entry.id === user?.id;
              return (
                <div
                  key={entry.id}
                  className={`flex items-center gap-4 px-4 py-4 rounded-xl border transition-all ${getRankBg(rank)} ${isMe ? 'ring-1 ring-emerald-500/40' : ''}`}
                >
                  <div className="w-6 flex items-center justify-center shrink-0">
                    {getRankIcon(rank)}
                  </div>

                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                    style={{
                      background: `hsl(${(entry.username.charCodeAt(0) * 37) % 360}, 60%, 25%)`,
                      color: `hsl(${(entry.username.charCodeAt(0) * 37) % 360}, 80%, 75%)`,
                    }}
                  >
                    {entry.username[0].toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold text-sm ${isMe ? 'text-emerald-400' : 'text-white'}`}>
                        {entry.username}
                      </span>
                      {isMe && <span className="text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-1.5 py-0.5 rounded">You</span>}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden max-w-32">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                          style={{ width: `${(entry.xp / maxXP) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="flex items-center gap-1.5 text-orange-400">
                      <Flame className="w-3.5 h-3.5" />
                      <span className="text-xs font-semibold">{entry.streak}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-amber-400">
                      <Zap className="w-4 h-4" />
                      <span className="font-bold text-sm">{entry.xp.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {entries.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No entries yet. Be the first!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
