interface XPBarProps {
  current: number;
  className?: string;
}

const XP_PER_LEVEL = 100;

export default function XPBar({ current, className = '' }: XPBarProps) {
  const level = Math.floor(current / XP_PER_LEVEL) + 1;
  const xpInLevel = current % XP_PER_LEVEL;
  const percent = (xpInLevel / XP_PER_LEVEL) * 100;

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
        <span>Level {level}</span>
        <span>{xpInLevel}/{XP_PER_LEVEL} XP</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-700"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
