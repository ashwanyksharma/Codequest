import { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, BookOpen, Zap, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import Layout from '../components/Layout';

interface ReportData {
  accuracy: number;
  totalAttempts: number;
  accepted: number;
  wrongAnswer: number;
  errors: number;
  weeklyXP: number;
  analysis: string;
}

export default function WeeklyReportPage() {
  const { user } = useAuth();
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasData, setHasData] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from('submissions').select('id').eq('user_id', user.id).limit(1)
      .then(({ data }) => setHasData((data ?? []).length > 0));
  }, [user]);

  const generateReport = async () => {
    if (!user) return;
    setLoading(true);

    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: submissions } = await supabase
      .from('submissions')
      .select('status, xp_earned')
      .eq('user_id', user.id)
      .gte('created_at', oneWeekAgo);

    const subs = submissions ?? [];
    const accepted = subs.filter((s: { status: string }) => s.status === 'accepted').length;
    const wrongAnswer = subs.filter((s: { status: string }) => s.status === 'wrong_answer').length;
    const errors = subs.filter((s: { status: string }) => s.status === 'error').length;
    const accuracy = subs.length > 0 ? Math.round((accepted / subs.length) * 100) : 0;
    const weeklyXP = (subs as { xp_earned?: number }[]).reduce((s, sub) => s + (sub.xp_earned ?? 0), 0);

    let analysis = `This week you achieved ${accuracy}% accuracy across ${subs.length} submissions. `;
    if (errors > 2) analysis += `${errors} runtime errors suggest reviewing edge cases. `;
    if (accuracy >= 80) analysis += `Great accuracy! Challenge yourself with harder problems next week. `;
    if (accuracy < 50) analysis += `Try starting with easier problems to build confidence. `;
    analysis += 'Consistent daily practice is key to improvement!';

    setReport({
      accuracy,
      totalAttempts: subs.length,
      accepted,
      wrongAnswer,
      errors,
      weeklyXP,
      analysis,
    });
    setLoading(false);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-center justify-center">
              <Brain className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">AI Performance Report</h1>
              <p className="text-gray-400 text-sm">Last 7 days</p>
            </div>
          </div>
          <button
            onClick={generateReport}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 disabled:bg-blue-500/50 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            {loading ? 'Analyzing...' : 'Generate Report'}
          </button>
        </div>

        {!report && !loading && (
          <div className="text-center py-20 bg-gray-900 border border-gray-800 rounded-2xl">
            <Brain className="w-14 h-14 mx-auto mb-4 text-gray-600" />
            <h3 className="text-white font-bold text-lg mb-2">Ready to analyze your performance?</h3>
            <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
              {hasData === false
                ? 'Solve some problems first, then come back for your AI-powered insights.'
                : 'Click "Generate Report" to get a detailed analysis of your last 7 days.'
              }
            </p>
            {hasData !== false && (
              <button
                onClick={generateReport}
                className="bg-blue-500 hover:bg-blue-400 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
              >
                Generate My Report
              </button>
            )}
          </div>
        )}

        {report && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Accuracy', value: `${report.accuracy}%`, color: report.accuracy >= 70 ? '#10b981' : report.accuracy >= 40 ? '#f59e0b' : '#ef4444', icon: TrendingUp },
                { label: 'Submissions', value: report.totalAttempts, color: '#3b82f6', icon: Zap },
                { label: 'Accepted', value: report.accepted, color: '#10b981', icon: TrendingUp },
                { label: 'Weekly XP', value: `+${report.weeklyXP}`, color: '#f59e0b', icon: Zap },
              ].map(({ label, value, color, icon: Icon }) => (
                <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">{label}</span>
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                  <p className="text-2xl font-black" style={{ color }}>{value}</p>
                </div>
              ))}
            </div>

            <div className="bg-gray-900 border border-blue-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-white">Analysis</h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{report.analysis}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <h3 className="font-bold text-white text-sm">Issues</h3>
                </div>
                <ul className="space-y-2">
                  {report.errors > 0 && (
                    <li className="flex items-center gap-2 text-sm text-red-300">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-400" />
                      {report.errors} Runtime Errors
                    </li>
                  )}
                  {report.wrongAnswer > 0 && (
                    <li className="flex items-center gap-2 text-sm text-amber-300">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                      {report.wrongAnswer} Wrong Answers
                    </li>
                  )}
                  {report.errors === 0 && report.wrongAnswer === 0 && (
                    <p className="text-gray-500 text-sm">No issues - great work!</p>
                  )}
                </ul>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <h3 className="font-bold text-white text-sm">Strengths</h3>
                </div>
                <ul className="space-y-2">
                  {report.accepted > 0 && (
                    <li className="flex items-center gap-2 text-sm text-emerald-300">
                      <TrendingUp className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                      {report.accepted} Accepted
                    </li>
                  )}
                  {report.accuracy >= 80 && (
                    <li className="flex items-center gap-2 text-sm text-emerald-300">
                      <TrendingUp className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                      High Accuracy
                    </li>
                  )}
                </ul>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  <h3 className="font-bold text-white text-sm">Tips</h3>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-blue-300">
                    <BookOpen className="w-3.5 h-3.5 shrink-0 text-blue-400 mt-0.5" />
                    Keep solving daily
                  </li>
                  <li className="flex items-start gap-2 text-sm text-blue-300">
                    <BookOpen className="w-3.5 h-3.5 shrink-0 text-blue-400 mt-0.5" />
                    Review editorials
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h3 className="font-bold text-white text-sm mb-4">Submission Breakdown</h3>
              <div className="space-y-3">
                {[
                  { label: 'Accepted', value: report.accepted, total: report.totalAttempts, color: '#10b981' },
                  { label: 'Wrong Answer', value: report.wrongAnswer, total: report.totalAttempts, color: '#f59e0b' },
                  { label: 'Errors', value: report.errors, total: report.totalAttempts, color: '#ef4444' },
                ].map(({ label, value, total, color }) => (
                  <div key={label}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-400">{label}</span>
                      <span style={{ color }}>{value}/{total}</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${total > 0 ? (value / total) * 100 : 0}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
