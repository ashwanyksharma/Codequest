import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, BarChart3, CheckCircle, Clock, Play, RotateCcw, Target, Timer, XCircle } from 'lucide-react';
import Layout from '../components/Layout';
import CodeEditor from '../components/CodeEditor';
import TestResultsPanel from '../components/TestResultsPanel';
import DifficultyBadge from '../components/DifficultyBadge';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { evaluateCode } from '../lib/execution';
import {
  INTERVIEW_TOPICS,
  InterviewProblem,
  InterviewReport,
  InterviewResult,
  InterviewTopic,
  buildInterviewReport,
  chooseInterviewSet,
  formatInterviewTime,
  inferTopicFromTitle,
} from '../lib/interview';
import { Language, TestResult } from '../types';

type Stage = 'setup' | 'running' | 'finished';

const MAX_ATTEMPTS = 3;

function emptyResult(problemId: string): InterviewResult {
  return {
    problemId,
    status: 'not_attempted',
    attempts: 0,
  };
}

function getInterviewStarterCode(problem: InterviewProblem, language: Language) {
  if (language === 'cpp') {
    const params = problem.param_names.map(name => `int ${name}`).join(', ');
    return `#include <iostream>
#include <vector>
#include <string>
using namespace std;

int ${problem.function_name}(${params}) {
    // Your code here
    return 0;
}`;
  }

  if (language === 'python') {
    return `def ${problem.function_name}(${problem.param_names.join(', ')}):
    # Your code here
    return None`;
  }

  return problem.starter_code;
}

export default function InterviewPage() {
  const { user } = useAuth();
  const [stage, setStage] = useState<Stage>('setup');
  const [duration, setDuration] = useState<30 | 60>(30);
  const [weakTopic, setWeakTopic] = useState<InterviewTopic>('Arrays & Strings');
  const [selectedTopic, setSelectedTopic] = useState<InterviewTopic>('Arrays & Strings');
  const [language, setLanguage] = useState<Language>('javascript');
  const [problems, setProblems] = useState<InterviewProblem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [codes, setCodes] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, InterviewResult>>({});
  const [latestTests, setLatestTests] = useState<TestResult[]>([]);
  const [latestStatus, setLatestStatus] = useState<'accepted' | 'wrong_answer' | 'error' | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(duration * 60);
  const [report, setReport] = useState<InterviewReport | null>(null);
  const finalizedRef = useRef(false);
  const problemsRef = useRef<InterviewProblem[]>([]);
  const resultsRef = useRef<Record<string, InterviewResult>>({});
  const remainingSecondsRef = useRef(remainingSeconds);

  const activeProblem = problems[activeIndex];
  const solvedCount = problems.filter(problem => results[problem.id]?.status === 'accepted').length;
  const progressPercent = problems.length > 0 ? Math.round((solvedCount / problems.length) * 100) : 0;
  const questionCount = duration === 30 ? 2 : 4;
  const randomTopicSuggestions = INTERVIEW_TOPICS.filter(topic => topic !== weakTopic).slice(0, 3);

  useEffect(() => {
    problemsRef.current = problems;
  }, [problems]);

  useEffect(() => {
    resultsRef.current = results;
  }, [results]);

  useEffect(() => {
    remainingSecondsRef.current = remainingSeconds;
  }, [remainingSeconds]);

  useEffect(() => {
    if (!user || stage !== 'setup') return;

    supabase
      .from('submissions')
      .select('status, problems(title)')
      .eq('user_id', user.id)
      .in('status', ['wrong_answer', 'error'])
      .then(({ data }) => {
        const topicCounts = new Map<InterviewTopic, number>();
        ((data ?? []) as { problems?: { title?: string } | { title?: string }[] | null }[]).forEach((submission) => {
          const joinedProblem = Array.isArray(submission.problems) ? submission.problems[0] : submission.problems;
          const title = joinedProblem?.title ?? '';
          const topic = inferTopicFromTitle(title);
          topicCounts.set(topic, (topicCounts.get(topic) ?? 0) + 1);
        });

        const detected = [...topicCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
        const nextWeakTopic = detected ?? 'Arrays & Strings';
        setWeakTopic(nextWeakTopic);
        setSelectedTopic(nextWeakTopic);
      });
  }, [user, stage]);

  useEffect(() => {
    if (stage !== 'running') return;

    const interval = window.setInterval(() => {
      setRemainingSeconds(seconds => {
        if (seconds <= 1) {
          window.clearInterval(interval);
          finalizeInterview();
          return 0;
        }
        return seconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [stage]);

  const startInterview = () => {
    const selected = chooseInterviewSet(selectedTopic, questionCount);
    const initialCodes = Object.fromEntries(selected.map(problem => [problem.id, getInterviewStarterCode(problem, language)]));
    const initialResults = Object.fromEntries(selected.map(problem => [problem.id, emptyResult(problem.id)]));

    finalizedRef.current = false;
    setProblems(selected);
    setCodes(initialCodes);
    setResults(initialResults);
    setLatestTests([]);
    setLatestStatus(null);
    setActiveIndex(0);
    setRemainingSeconds(duration * 60);
    setReport(null);
    setStage('running');
  };

  const finalizeInterview = () => {
    const latestProblems = problemsRef.current;
    if (finalizedRef.current || latestProblems.length === 0) return;
    finalizedRef.current = true;

    const finalReport = buildInterviewReport(
      latestProblems,
      resultsRef.current,
      duration,
      remainingSecondsRef.current,
      selectedTopic
    );
    setReport(finalReport);
    setStage('finished');
  };

  const submitCurrent = () => {
    if (!activeProblem) return;

    const current = results[activeProblem.id] ?? emptyResult(activeProblem.id);
    if (current.attempts >= MAX_ATTEMPTS || current.status === 'accepted') return;

    const evaluation = evaluateCode(
      codes[activeProblem.id] ?? getInterviewStarterCode(activeProblem, language),
      activeProblem.function_name,
      activeProblem.param_names,
      activeProblem.test_cases,
      language
    );

    setLatestTests(evaluation.results);
    setLatestStatus(evaluation.status);
    setResults(previous => ({
      ...previous,
      [activeProblem.id]: {
        problemId: activeProblem.id,
        status: evaluation.status,
        attempts: current.attempts + 1,
      },
    }));
  };

  const statusIcon = (problem: InterviewProblem) => {
    const status = results[problem.id]?.status ?? 'not_attempted';
    if (status === 'accepted') return <CheckCircle className="w-4 h-4 text-emerald-400" />;
    if (status === 'wrong_answer' || status === 'error') return <XCircle className="w-4 h-4 text-red-400" />;
    return <Clock className="w-4 h-4 text-gray-600" />;
  };

  const attemptsLeft = activeProblem ? MAX_ATTEMPTS - (results[activeProblem.id]?.attempts ?? 0) : 0;
  const canSubmit = !!activeProblem && attemptsLeft > 0 && results[activeProblem.id]?.status !== 'accepted';

  const chartData = useMemo(() => {
    const accepted = problems.filter(problem => results[problem.id]?.status === 'accepted').length;
    const wrong = problems.filter(problem => results[problem.id]?.status === 'wrong_answer').length;
    const errors = problems.filter(problem => results[problem.id]?.status === 'error').length;
    const untouched = problems.filter(problem => (results[problem.id]?.attempts ?? 0) === 0).length;
    return [
      { label: 'Solved', value: accepted, color: '#10b981' },
      { label: 'Wrong', value: wrong, color: '#f59e0b' },
      { label: 'Errors', value: errors, color: '#ef4444' },
      { label: 'Untouched', value: untouched, color: '#64748b' },
    ];
  }, [problems, results]);

  if (stage === 'setup') {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center justify-center">
              <Timer className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">AI Interview Simulation</h1>
              <p className="text-gray-400 text-sm">Timed DSA practice with no hints and limited submissions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_22rem] gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="font-bold text-white mb-4">Select Duration</h2>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[30, 60].map(minutes => (
                  <button
                    key={minutes}
                    onClick={() => setDuration(minutes as 30 | 60)}
                    className={`border rounded-xl p-5 text-left transition-colors ${
                      duration === minutes
                        ? 'border-cyan-500/50 bg-cyan-500/10'
                        : 'border-gray-800 bg-gray-950 hover:border-gray-700'
                    }`}
                  >
                    <p className="text-2xl font-black text-white">{minutes}</p>
                    <p className="text-sm text-gray-400">minutes</p>
                  </button>
                ))}
              </div>

              <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 mb-6">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Detected weak topic</p>
                <p className="text-lg font-bold text-cyan-300">{weakTopic}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {duration === 30 ? '30-minute sessions include 2 questions.' : '60-minute sessions include 4 questions.'}
                  </p>
              </div>

              <h2 className="font-bold text-white mb-4">Select Topic Pool</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => setSelectedTopic(weakTopic)}
                  className={`border rounded-xl p-4 text-left transition-colors ${
                    selectedTopic === weakTopic
                      ? 'border-cyan-500/50 bg-cyan-500/10'
                      : 'border-gray-800 bg-gray-950 hover:border-gray-700'
                  }`}
                >
                  <p className="text-xs text-cyan-300 uppercase tracking-wide font-bold mb-1">Recommended Weak Topic</p>
                  <p className="font-bold text-white">{weakTopic}</p>
                </button>
                {randomTopicSuggestions.map(topic => (
                  <button
                    key={topic}
                    onClick={() => setSelectedTopic(topic)}
                    className={`border rounded-xl p-4 text-left transition-colors ${
                      selectedTopic === topic
                        ? 'border-emerald-500/50 bg-emerald-500/10'
                        : 'border-gray-800 bg-gray-950 hover:border-gray-700'
                    }`}
                  >
                    <p className="text-xs text-emerald-300 uppercase tracking-wide font-bold mb-1">Random Practice</p>
                    <p className="font-bold text-white">{topic}</p>
                  </button>
                ))}
              </div>

              <h2 className="font-bold text-white mb-4">Select Language</h2>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {(['javascript', 'cpp', 'python'] as const).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`border rounded-xl p-4 text-center transition-colors ${
                      language === lang
                        ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-200'
                        : 'border-gray-800 bg-gray-950 text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    <span className="font-bold">{lang === 'javascript' ? 'JavaScript' : lang === 'cpp' ? 'C++' : 'Python'}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={startInterview}
                className="flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold rounded-lg px-5 py-3 transition-colors"
              >
                <Play className="w-5 h-5" fill="currentColor" />
                Start {questionCount}-Question Interview
              </button>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h3 className="font-bold text-white mb-4">Interview Rules</h3>
              <div className="space-y-3 text-sm text-gray-400">
                <p className="flex gap-2"><Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />Timer runs continuously once started.</p>
                <p className="flex gap-2"><AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />Hints and editorials are hidden.</p>
                <p className="flex gap-2"><Target className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />Each question allows up to 3 submissions.</p>
                <p className="flex gap-2"><BarChart3 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />Final report includes score, accuracy, timing, and topic feedback.</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (stage === 'finished' && report) {
    const chartMax = Math.max(1, ...chartData.map(item => item.value));

    return (
      <Layout>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">Interview Report</h1>
                <p className="text-gray-400 text-sm">Real interview simulation results</p>
              </div>
            </div>
            <button
              onClick={() => setStage('setup')}
              className="flex items-center gap-2 text-sm bg-gray-800 hover:bg-gray-700 text-white rounded-lg px-4 py-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              New Interview
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Score', value: report.score, color: '#10b981' },
              { label: 'Accuracy', value: `${report.accuracy}%`, color: '#3b82f6' },
              { label: 'Time Taken', value: report.timeTaken, color: '#f59e0b' },
              { label: 'Weak Topic', value: report.weakTopic, color: '#ef4444' },
            ].map(item => (
              <div key={item.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">{item.label}</p>
                <p className="text-xl font-black leading-tight" style={{ color: item.color }}>{item.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_22rem] gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="font-bold text-white mb-3">Feedback</h2>
              <p className="text-sm text-gray-300 leading-relaxed mb-5">{report.feedback}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Strong Topic</p>
                  <p className="text-emerald-300 font-bold mt-1">{report.strongTopic}</p>
                </div>
                <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Recommended Focus</p>
                  <p className="text-red-300 font-bold mt-1">{report.weakTopic}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h2 className="font-bold text-white mb-5">Question Stats</h2>
              <div className="h-44 flex items-end gap-3 border-b border-gray-800">
                {chartData.map(item => (
                  <div key={item.label} className="flex-1 h-full flex flex-col items-center justify-end gap-2">
                    <span className="text-xs font-bold" style={{ color: item.color }}>{item.value}</span>
                    <div
                      className="w-full rounded-t-md min-h-2 transition-all"
                      style={{ height: `${Math.max(8, (item.value / chartMax) * 100)}%`, backgroundColor: item.color }}
                    />
                    <span className="text-[10px] text-gray-500">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-800 bg-gray-950 shrink-0">
          <div className={`px-3 py-1.5 rounded-lg border font-black text-sm ${
            remainingSeconds < 300
              ? 'border-red-500/40 text-red-300 bg-red-500/10'
              : 'border-cyan-500/30 text-cyan-300 bg-cyan-500/10'
          }`}>
            {formatInterviewTime(remainingSeconds)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Interview Set</p>
              <h1 className="text-white font-bold truncate">{selectedTopic}</h1>
          </div>
          <div className="hidden sm:block w-40 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-400 transition-all" style={{ width: `${progressPercent}%` }} />
          </div>
          <button
            onClick={finalizeInterview}
            className="bg-gray-800 hover:bg-gray-700 text-white font-semibold text-sm rounded-lg px-4 py-2 transition-colors"
          >
            Final Submit
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <aside className="hidden lg:block w-72 border-r border-gray-800 bg-gray-950 overflow-y-auto">
            <div className="p-4 space-y-2">
              {problems.map((problem, index) => (
                <button
                  key={problem.id}
                  onClick={() => {
                    setActiveIndex(index);
                    setLatestTests([]);
                    setLatestStatus(null);
                  }}
                  className={`w-full text-left rounded-lg border p-3 transition-colors ${
                    index === activeIndex
                      ? 'border-cyan-500/40 bg-cyan-500/10'
                      : 'border-gray-800 bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {statusIcon(problem)}
                    <span className="text-xs text-gray-500">Question {index + 1}</span>
                  </div>
                  <p className="text-sm font-semibold text-white leading-tight mb-2">{problem.title}</p>
                  <div className="flex items-center justify-between">
                    <DifficultyBadge difficulty={problem.difficulty} />
                    <span className="text-xs text-gray-500">{results[problem.id]?.attempts ?? 0}/{MAX_ATTEMPTS}</span>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          {activeProblem && (
            <>
              <section className="w-full lg:w-[42%] border-r border-gray-800 overflow-y-auto p-6">
                <div className="flex items-center gap-3 mb-4">
                  <DifficultyBadge difficulty={activeProblem.difficulty} />
                  <span className="text-xs text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-2.5 py-1">
                    {activeProblem.topic_tag}
                  </span>
                </div>
                <h2 className="text-2xl font-black text-white mb-3">{activeProblem.title}</h2>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap mb-6">{activeProblem.description}</p>

                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-200">Interview mode: hints and editorials are disabled. You have {MAX_ATTEMPTS} submissions for this question.</p>
                  </div>
                </div>

                <h3 className="font-bold text-white text-sm mb-3">Visible Test Cases</h3>
                <div className="space-y-3">
                  {activeProblem.test_cases.slice(0, 2).map(test => (
                    <div key={test.id} className="bg-gray-900 border border-gray-800 rounded-lg p-4 font-mono text-xs">
                      <p className="text-gray-500 mb-1">{test.description}</p>
                      <p className="text-gray-300">Input: {JSON.stringify(test.input_args)}</p>
                      <p className="text-emerald-300 mt-1">Output: {test.expected_output || '""'}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="hidden lg:flex flex-1 flex-col overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-950 shrink-0">
                  <span className="text-sm text-gray-400">
                    {language === 'javascript' ? 'JavaScript' : language === 'cpp' ? 'C++' : 'Python'}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">Attempts left: {attemptsLeft}</span>
                    <button
                      onClick={submitCurrent}
                      disabled={!canSubmit}
                      className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-700 disabled:text-gray-500 text-gray-950 font-bold text-sm px-4 py-2 rounded-lg transition-colors"
                    >
                      <Play className="w-4 h-4" fill="currentColor" />
                      Submit
                    </button>
                  </div>
                </div>
                <div className="flex-1 bg-gray-950 overflow-hidden">
                  <CodeEditor
                    value={codes[activeProblem.id] ?? getInterviewStarterCode(activeProblem, language)}
                    onChange={(value) => setCodes(previous => ({ ...previous, [activeProblem.id]: value }))}
                    language={language}
                    onLanguageChange={(lang) => {
                      setLanguage(lang);
                      if (activeProblem) {
                        setCodes(previous => ({
                          ...previous,
                          [activeProblem.id]: getInterviewStarterCode(activeProblem, lang),
                        }));
                      }
                    }}
                  />
                </div>
                <div className="h-64 border-t border-gray-800 overflow-y-auto p-4 bg-gray-950">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-3">Test Results</p>
                  <TestResultsPanel results={latestTests} status={latestStatus} loading={false} />
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
