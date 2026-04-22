import { useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NavigationProvider, useNavigation } from './contexts/NavigationContext';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import WorldDetailPage from './pages/WorldDetailPage';
import ProblemPage from './pages/ProblemPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import WeeklyReportPage from './pages/WeeklyReportPage';
import InterviewPage from './pages/InterviewPage';

function AppContent() {
  const { user, loading } = useAuth();
  const { nav, navigate } = useNavigation();

  useEffect(() => {
    if (!loading) {
      if (!user && nav.page !== 'landing') navigate('landing');
      if (user && nav.page === 'landing') navigate('dashboard');
    }
  }, [user, loading, nav.page, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading CodeQuest...</p>
        </div>
      </div>
    );
  }

  if (!user) return <LandingPage />;

  switch (nav.page) {
    case 'dashboard':
      return <DashboardPage />;
    case 'world':
      return nav.worldId ? <WorldDetailPage worldId={nav.worldId} /> : <DashboardPage />;
    case 'problem':
      return nav.problemId ? <ProblemPage problemId={nav.problemId} /> : <DashboardPage />;
    case 'leaderboard':
      return <LeaderboardPage />;
    case 'interview':
      return <InterviewPage />;
    case 'profile':
      return <ProfilePage />;
    case 'report':
      return <WeeklyReportPage />;
    default:
      return <DashboardPage />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationProvider>
        <AppContent />
      </NavigationProvider>
    </AuthProvider>
  );
}
