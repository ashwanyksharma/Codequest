import { useEffect, useState } from 'react';
import { ArrowLeft, Zap, Play, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '../contexts/NavigationContext';
import { Language, Problem, TestCase, TestResult } from '../types';
import { fetchProblemWithTestCases } from '../lib/data';
import { evaluateCode } from '../lib/execution';
import { supabase } from '../lib/supabase';
import CodeEditor from '../components/CodeEditor';
import TestResultsPanel from '../components/TestResultsPanel';
import DifficultyBadge from '../components/DifficultyBadge';
import Layout from '../components/Layout';
import XPPopup from '../components/XPPopup';

type Tab = 'description' | 'editorial' | 'notes';

export default function ProblemPage({ problemId }: { problemId: string }) {
  const { user, refreshProfile } = useAuth();
  const { navigate } = useNavigation();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [status, setStatus] = useState<'accepted' | 'wrong_answer' | 'error' | null>(null);
  const [tab, setTab] = useState<Tab>('description');
  const [hintsOpen, setHintsOpen] = useState(false);
  const [xpEarned, setXpEarned] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [alreadySolved, setAlreadySolved] = useState(false);
  const [language, setLanguage] = useState<Language>('javascript');

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetchProblemWithTestCases(problemId)
      .then(({ problem, testCases }) => {
        setProblem(problem);
        setTestCases(testCases);
        if (problem) setCode(problem.starter_code);
      })
      .catch(error => {
        console.error(error);
        setProblem(null);
        setTestCases([]);
      })
      .finally(() => setLoading(false));
    supabase.from('user_progress').select('solved').eq('user_id', user.id).eq('problem_id', problemId).maybeSingle()
      .then(({ data }) => { if (data?.solved) setAlreadySolved(true); });
    supabase.from('user_notes').select('content').eq('user_id', user.id).eq('problem_id', problemId).maybeSingle()
      .then(({ data }) => { if (data?.content) setNote(data.content); });
  }, [user, problemId]);

  const handleSubmit = async () => {
    if (!problem || !user || submitting) return;
    setSubmitting(true);

    const { results: evalResults, status: evalStatus } = evaluateCode(
      code,
      problem.function_name,
      problem.param_names as string[],
      testCases,
      language
    );

    setResults(evalResults);
    setStatus(evalStatus);

    const xpToAward = !alreadySolved && evalStatus === 'accepted' ? problem.xp_reward : 0;

    await supabase.from('submissions').insert({
      user_id: user.id,
      problem_id: problem.id,
      code,
      status: evalStatus,
      xp_earned: xpToAward,
      test_results: evalResults,
      language,
    });

    const { data: existing } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('problem_id', problem.id)
      .maybeSingle();

    if (existing) {
      await supabase.from('user_progress').update({
        solved: existing.solved || evalStatus === 'accepted',
        attempts: (existing.attempts ?? 0) + 1,
        solved_at: !existing.solved && evalStatus === 'accepted' ? new Date().toISOString() : existing.solved_at,
      }).eq('id', existing.id);
    } else {
      await supabase.from('user_progress').insert({
        user_id: user.id,
        problem_id: problem.id,
        solved: evalStatus === 'accepted',
        attempts: 1,
        solved_at: evalStatus === 'accepted' ? new Date().toISOString() : null,
      });
    }

    if (xpToAward > 0) {
      const { data: prof } = await supabase.from('profiles').select('xp, streak, last_active').eq('id', user.id).maybeSingle();
      if (prof) {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const newStreak = prof.last_active === yesterday ? prof.streak + 1 : 1;
        await supabase.from('profiles').update({
          xp: prof.xp + xpToAward,
          streak: newStreak,
          last_active: today,
        }).eq('id', user.id);
        setXpEarned(xpToAward);
        setAlreadySolved(true);
        await refreshProfile();
      }
    }

    setSubmitting(false);
  };

  const getStarterCodeCpp = (prob: Problem): string => {
    const params = (prob.param_names as string[]).map(p => `int ${p}`).join(', ');
    return `#include <iostream>
#include <vector>
#include <string>
using namespace std;

int ${prob.function_name}(${params}) {
    // Your code here
    return 0;
}

int main() {
    // Test your function here
    cout << ${prob.function_name}(...) << endl;
    return 0;
}`;
  };

  const getStarterCodePython = (prob: Problem): string => {
    const params = (prob.param_names as string[]).join(', ');
    return `def ${prob.function_name}(${params}):
    # Your code here
    return None`;
  };

  const getStarterCode = (prob: Problem, lang: Language): string => {
    if (lang === 'cpp') return getStarterCodeCpp(prob);
    if (lang === 'python') return getStarterCodePython(prob);
    return prob.starter_code;
  };

  const saveNote = async () => {
    if (!user || !problem) return;
    const { data: existing } = await supabase.from('user_notes').select('id').eq('user_id', user.id).eq('problem_id', problem.id).maybeSingle();
    if (existing) {
      await supabase.from('user_notes').update({ content: note, updated_at: new Date().toISOString() }).eq('id', existing.id);
    } else {
      await supabase.from('user_notes').insert({ user_id: user.id, problem_id: problem.id, content: note });
    }
  };

  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </Layout>
  );

  if (!problem) return <Layout><div className="flex items-center justify-center h-96 text-gray-400">Problem not found</div></Layout>;

  return (
    <Layout>
      {xpEarned && <XPPopup xp={xpEarned} onDone={() => setXpEarned(null)} />}
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-800 bg-gray-950 shrink-0">
          <button onClick={() => navigate('dashboard')} className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-white font-bold text-sm truncate">{problem.title}</h1>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <DifficultyBadge difficulty={problem.difficulty} />
            <div className="flex items-center gap-1 text-amber-400 text-sm font-semibold">
              <Zap className="w-4 h-4" />
              <span>{problem.xp_reward} XP</span>
            </div>
            {alreadySolved && (
              <span className="text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-md font-semibold">Solved</span>
            )}
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-full lg:w-1/2 flex flex-col border-r border-gray-800 overflow-hidden">
            <div className="flex border-b border-gray-800 shrink-0">
              {(['description', 'editorial', 'notes'] as Tab[]).map((id) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                    tab === id ? 'text-white border-emerald-500' : 'text-gray-500 border-transparent hover:text-gray-300'
                  }`}
                >
                  {id.charAt(0).toUpperCase() + id.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {tab === 'description' && (
                <div className="prose prose-invert max-w-none">
                  <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap mb-6">
                    {problem.description}
                  </div>

                  {(problem.examples as { input: string; output: string }[]).length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-white font-semibold mb-3">Examples</h3>
                      <div className="space-y-3">
                        {(problem.examples as { input: string; output: string }[]).map((ex, i) => (
                          <div key={i} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 font-mono text-sm">
                            <p className="text-gray-400">Input: <span className="text-gray-200">{ex.input}</span></p>
                            <p className="text-gray-400 mt-1">Output: <span className="text-emerald-300">{ex.output}</span></p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(problem.hints as string[]).length > 0 && (
                    <div>
                      <button
                        onClick={() => setHintsOpen(!hintsOpen)}
                        className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors text-sm font-medium"
                      >
                        Hints ({(problem.hints as string[]).length})
                        {hintsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      {hintsOpen && (
                        <ul className="mt-3 space-y-2">
                          {(problem.hints as string[]).map((hint, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                              <span className="text-amber-500 mt-0.5 shrink-0">•</span>
                              <span>{hint}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              )}

              {tab === 'editorial' && (
                <div>
                  <h3 className="text-white font-bold mb-3">Editorial</h3>
                  <div className="text-gray-300 text-sm leading-relaxed">{problem.editorial}</div>
                </div>
              )}

              {tab === 'notes' && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-bold">My Notes</h3>
                    <button
                      onClick={saveNote}
                      className="flex items-center gap-1.5 text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-colors px-3 py-1.5 rounded-lg"
                    >
                      Save
                    </button>
                  </div>
                  <textarea
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    placeholder="Write your notes..."
                    className="w-full h-72 bg-gray-800 border border-gray-700 rounded-lg p-4 text-sm text-gray-300 placeholder-gray-600 resize-none focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="hidden lg:flex lg:w-1/2 flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-950 shrink-0">
              <span className="text-sm font-medium text-gray-400">
                {language === 'javascript' ? 'JavaScript' : language === 'cpp' ? 'C++' : 'Python'}
              </span>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-gray-950 font-bold text-sm px-4 py-2 rounded-lg transition-colors"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Play className="w-4 h-4" fill="currentColor" />
                )}
                {submitting ? 'Running...' : 'Submit'}
              </button>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 bg-gray-950 overflow-auto flex flex-col" style={{ minHeight: '300px' }}>
                <CodeEditor
                  value={code}
                  onChange={setCode}
                  language={language}
                  onLanguageChange={(lang) => {
                    setLanguage(lang);
                    if (problem) setCode(getStarterCode(problem, lang));
                  }}
                />
              </div>
              <div className="h-64 border-t border-gray-800 overflow-y-auto p-4 bg-gray-950">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-3">Test Results</p>
                <TestResultsPanel results={results} status={status} loading={submitting} />
              </div>
            </div>
          </div>

          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-gray-950 font-bold py-3 rounded-xl transition-colors"
            >
              {submitting ? <div className="w-5 h-5 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" /> : <Play className="w-5 h-5" fill="currentColor" />}
              {submitting ? 'Running...' : 'Submit Code'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
