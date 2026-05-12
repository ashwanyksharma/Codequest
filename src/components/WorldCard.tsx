import { Lock, ChevronRight, Cpu, Code2, ArrowUpDown, Search, Type, RefreshCw, Link } from 'lucide-react';
import { WorldWithProgress } from '../types';
import { useNavigation } from '../contexts/NavigationContext';

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Cpu, Code2, ArrowUpDown, Search, Type, RefreshCw, Link,
};

interface WorldCardProps {
  world: WorldWithProgress;
  index: number;
}

export default function WorldCard({ world, index }: WorldCardProps) {
  const { navigate } = useNavigation();
  const Icon = iconMap[world.icon] ?? Cpu;

  return (
    <div
      className={`relative group rounded-2xl border transition-all duration-300 overflow-hidden ${
        world.unlocked
          ? 'bg-gray-900 border-gray-800 hover:border-gray-600 cursor-pointer hover:scale-[1.01]'
          : 'bg-gray-900/40 border-gray-800/50 cursor-not-allowed'
      }`}
      onClick={() => world.unlocked && navigate('world', { worldId: world.id })}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div
        className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity"
        style={{ background: `radial-gradient(circle at top right, ${world.color}, transparent 70%)` }}
      />

      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${world.color}20`, border: `2px solid ${world.color}30` }}
          >
            <Icon className="w-6 h-6" style={{ color: world.color }} />
          </div>
          <div className="flex items-center gap-2">
            {!world.unlocked && (
              <div className="flex items-center gap-1.5 bg-gray-800 px-2.5 py-1 rounded-lg">
                <Lock className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-xs text-gray-500">Locked</span>
              </div>
            )}
            {world.unlocked && world.completionPercent === 100 && (
              <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                <span className="text-xs text-emerald-400 font-semibold">Completed</span>
              </div>
            )}
            {world.unlocked && (
              <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-300 group-hover:translate-x-0.5 transition-all" />
            )}
          </div>
        </div>

        <div className="mb-1">
          <span className="text-xs font-medium text-gray-500">World {world.order_index}</span>
        </div>
        <h3 className="text-lg font-bold text-white mb-1.5">{world.name}</h3>
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">{world.description}</p>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">{world.solvedProblems}/{world.totalProblems} problems</span>
            <span className="font-semibold" style={{ color: world.completionPercent >= 50 ? world.color : '#6b7280' }}>
              {world.completionPercent}%
            </span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${world.completionPercent}%`,
                backgroundColor: world.color,
                boxShadow: `0 0 8px ${world.color}60`,
              }}
            />
          </div>
        </div>

        {!world.unlocked && (
          <p className="text-xs text-gray-600 mt-3">
            Complete 50% of the previous world to unlock
          </p>
        )}
      </div>
    </div>
  );
}
