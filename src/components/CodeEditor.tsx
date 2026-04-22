import { useRef, KeyboardEvent } from 'react';
import { Language } from '../types';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: Language;
  onLanguageChange?: (lang: Language) => void;
  readOnly?: boolean;
}

export default function CodeEditor({ value, onChange, language = 'javascript', onLanguageChange, readOnly = false }: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 2;
          textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  return (
    <div className="relative w-full h-full font-mono flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-gray-900 shrink-0">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Code</span>
        <div className="flex items-center gap-1">
          {(['javascript', 'cpp', 'python'] as const).map(lang => (
            <button
              key={lang}
              onClick={() => onLanguageChange?.(lang)}
              className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                language === lang
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
              }`}
            >
              {lang === 'javascript' ? 'JS' : lang === 'cpp' ? 'C++' : 'PY'}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-950/80 border-r border-gray-800 flex flex-col items-end pr-3 pt-4 select-none pointer-events-none z-10 overflow-hidden">
        {value.split('\n').map((_, i) => (
          <div key={i} className="text-xs text-gray-600 leading-6">{i + 1}</div>
        ))}
      </div>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
          spellCheck={false}
          className="w-full h-full bg-transparent text-gray-100 text-sm leading-6 pl-14 pr-4 pt-4 pb-4 resize-none outline-none font-mono caret-emerald-400"
          style={{ tabSize: 2 }}
        />
      </div>
    </div>
  );
}
