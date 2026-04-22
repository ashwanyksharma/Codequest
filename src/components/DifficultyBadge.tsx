interface DifficultyBadgeProps {
  difficulty: 'easy' | 'medium' | 'hard';
  className?: string;
}

const config = {
  easy: { label: 'Easy', classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  medium: { label: 'Medium', classes: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  hard: { label: 'Hard', classes: 'bg-red-500/10 text-red-400 border-red-500/30' },
};

export default function DifficultyBadge({ difficulty, className = '' }: DifficultyBadgeProps) {
  const { label, classes } = config[difficulty];
  return (
    <span className={`px-2 py-0.5 rounded-md text-xs font-semibold border ${classes} ${className}`}>
      {label}
    </span>
  );
}
