import { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';

interface XPPopupProps {
  xp: number;
  onDone: () => void;
}

export default function XPPopup({ xp, onDone }: XPPopupProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 400);
    }, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className={`fixed top-24 right-6 z-50 transition-all duration-400 ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
    }`}>
      <div className="flex items-center gap-2 bg-amber-500 text-gray-950 px-4 py-3 rounded-xl font-bold shadow-lg shadow-amber-500/30 animate-bounce">
        <Zap className="w-5 h-5" />
        <span>+{xp} XP</span>
      </div>
    </div>
  );
}
