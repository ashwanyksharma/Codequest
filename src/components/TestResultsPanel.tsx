import { CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { TestResult } from '../types';

interface TestResultsPanelProps {
  results: TestResult[];
  status: 'accepted' | 'wrong_answer' | 'error' | null;
  loading: boolean;
}

export default function TestResultsPanel({ results, status, loading }: TestResultsPanelProps) {
  const [expanded, setExpanded] = useState<number | null>(0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32 gap-3">
        <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-gray-400 text-sm">Running test cases...</span>
      </div>
    );
  }

  if (!results.length) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
        Submit your code to see results
      </div>
    );
  }

  const passed = results.filter(r => r.passed).length;

  return (
    <div className="space-y-3">
      <div className={`flex items-center gap-3 p-3 rounded-xl border ${
        status === 'accepted'
          ? 'bg-emerald-500/10 border-emerald-500/30'
          : status === 'error'
          ? 'bg-red-500/10 border-red-500/30'
          : 'bg-amber-500/10 border-amber-500/30'
      }`}>
        {status === 'accepted' ? (
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
        ) : status === 'error' ? (
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
        ) : (
          <XCircle className="w-5 h-5 text-amber-400 shrink-0" />
        )}
        <div>
          <p className={`font-semibold text-sm ${
            status === 'accepted' ? 'text-emerald-400' : status === 'error' ? 'text-red-400' : 'text-amber-400'
          }`}>
            {status === 'accepted' ? 'All Tests Passed!' : status === 'error' ? 'Runtime Error' : 'Wrong Answer'}
          </p>
          <p className="text-xs text-gray-400">{passed}/{results.length} test cases passed</p>
        </div>
      </div>

      <div className="space-y-2">
        {results.map((result, i) => (
          <div
            key={i}
            className={`rounded-lg border overflow-hidden ${
              result.passed ? 'border-emerald-500/20' : 'border-red-500/20'
            }`}
          >
            <button
              className={`w-full flex items-center justify-between px-3 py-2.5 text-sm transition-colors ${
                result.passed ? 'bg-emerald-500/5 hover:bg-emerald-500/10' : 'bg-red-500/5 hover:bg-red-500/10'
              }`}
              onClick={() => setExpanded(expanded === i ? null : i)}
            >
              <div className="flex items-center gap-2">
                {result.passed
                  ? <CheckCircle className="w-4 h-4 text-emerald-400" />
                  : <XCircle className="w-4 h-4 text-red-400" />
                }
                <span className="text-gray-300 font-medium">Test {i + 1}</span>
                <span className="text-gray-500 text-xs">{result.description}</span>
              </div>
              {expanded === i ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
            {expanded === i && (
              <div className="px-3 py-3 bg-gray-900/50 space-y-2 border-t border-gray-800/50">
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Input</span>
                  <pre className="text-xs text-gray-300 mt-1 font-mono bg-gray-800/50 rounded p-2 overflow-x-auto">
                    {JSON.stringify(result.input)}
                  </pre>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Expected</span>
                    <pre className="text-xs text-emerald-300 mt-1 font-mono bg-gray-800/50 rounded p-2 overflow-x-auto">
                      {result.expected}
                    </pre>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Your Output</span>
                    <pre className={`text-xs mt-1 font-mono bg-gray-800/50 rounded p-2 overflow-x-auto ${
                      result.passed ? 'text-emerald-300' : 'text-red-300'
                    }`}>
                      {result.actual}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
