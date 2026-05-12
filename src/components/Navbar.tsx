import { useState } from 'react';
import { Code2, LayoutDashboard, Trophy, User, FileText, LogOut, Menu, X, Zap, Flame, Timer } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '../contexts/NavigationContext';

export default function Navbar() {
  const { profile, signOut } = useAuth();
  const { navigate } = useNavigation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, page: 'dashboard' as const },
    { label: 'Leaderboard', icon: Trophy, page: 'leaderboard' as const },
    { label: 'Interview', icon: Timer, page: 'interview' as const },
    { label: 'AI Report', icon: FileText, page: 'report' as const },
    { label: 'Profile', icon: User, page: 'profile' as const },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/90 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => navigate('dashboard')}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center group-hover:bg-emerald-400 transition-colors">
              <Code2 className="w-5 h-5 text-gray-950" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              Code<span className="text-emerald-400">Quest</span>
            </span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map(({ label, icon: Icon, page }) => (
              <button
                key={page}
                onClick={() => navigate(page)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all text-sm font-medium"
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-3 bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-800">
              <div className="flex items-center gap-1.5 text-amber-400">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-bold">{profile?.xp ?? 0} XP</span>
              </div>
              <div className="w-px h-4 bg-gray-700" />
              <div className="flex items-center gap-1.5 text-orange-400">
                <Flame className="w-4 h-4" />
                <span className="text-sm font-bold">{profile?.streak ?? 0}</span>
              </div>
            </div>
            <button
              onClick={() => navigate('profile')}
              className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-xs font-bold hover:bg-emerald-500/30 transition-colors"
            >
              {profile?.username?.[0]?.toUpperCase() ?? 'U'}
            </button>
            <button
              onClick={signOut}
              className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-gray-800 transition-all"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <button
            className="md:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-gray-950 px-4 py-3 space-y-1">
          {navItems.map(({ label, icon: Icon, page }) => (
            <button
              key={page}
              onClick={() => { navigate(page); setMenuOpen(false); }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all text-sm"
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
          <div className="pt-2 border-t border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-amber-400 text-sm font-bold flex items-center gap-1"><Zap className="w-3.5 h-3.5" />{profile?.xp ?? 0} XP</span>
              <span className="text-orange-400 text-sm font-bold flex items-center gap-1"><Flame className="w-3.5 h-3.5" />{profile?.streak ?? 0}</span>
            </div>
            <button onClick={signOut} className="text-red-400 text-sm flex items-center gap-1.5">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
