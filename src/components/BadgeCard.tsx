import { Award } from 'lucide-react';
import { Badge } from '../types';

interface BadgeCardProps {
  badge: Badge;
  earned?: boolean;
  earnedAt?: string;
}

export default function BadgeCard({ badge, earned = false, earnedAt }: BadgeCardProps) {
  return (
    <div className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
      earned
        ? 'bg-gray-900 border-gray-700 hover:border-gray-600'
        : 'bg-gray-900/40 border-gray-800 opacity-50 grayscale'
    }`}>
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{ backgroundColor: `${badge.color}20`, border: `2px solid ${badge.color}40` }}
      >
        <Award className="w-6 h-6" style={{ color: badge.color }} />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-white">{badge.name}</p>
        <p className="text-xs text-gray-400 mt-0.5">{badge.description}</p>
      </div>
      {earned && earnedAt && (
        <p className="text-xs text-gray-500">{new Date(earnedAt).toLocaleDateString()}</p>
      )}
      {!earned && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center">
          <span className="text-gray-600 text-xs">🔒</span>
        </div>
      )}
    </div>
  );
}
