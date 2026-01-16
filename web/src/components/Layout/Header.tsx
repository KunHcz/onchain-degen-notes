import { motion } from 'framer-motion';
import { useProgressStore, useFlashcardsStore, useUIStore } from '../../stores';

export function Header() {
  const { xp, streak, getLevel } = useProgressStore();
  const { getDueCards } = useFlashcardsStore();
  const { toggleSearchModal, setCurrentView, currentView } = useUIStore();
  const level = getLevel();
  const dueCards = getDueCards();

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-16 bg-nebula/80 backdrop-blur-md border-b border-plasma-blue/20 flex items-center justify-between px-6 z-50"
    >
      {/* Logo */}
      <div className="flex items-center gap-4">
        <motion.h1
          className="font-space text-xl font-bold gradient-text cursor-pointer"
          whileHover={{ scale: 1.05 }}
          onClick={() => setCurrentView('universe')}
        >
          Degen Notes
        </motion.h1>
      </div>

      {/* Navigation */}
      <nav className="flex items-center gap-2">
        {[
          { id: 'universe', label: 'Universe', icon: '🌌' },
          { id: 'skills', label: 'Skills', icon: '🎮' },
          { id: 'notes', label: 'Notes', icon: '📝' },
          { id: 'review', label: 'Review', icon: '🧠', badge: dueCards.length },
          { id: 'trades', label: 'Trades', icon: '📊' },
          { id: 'achievements', label: 'Achievements', icon: '🏆' },
        ].map((item) => (
          <motion.button
            key={item.id}
            onClick={() => setCurrentView(item.id as any)}
            className={`px-4 py-2 rounded-lg font-mono text-sm flex items-center gap-2 transition-all ${
              currentView === item.id
                ? 'bg-plasma-blue/20 text-plasma-blue glow-blue'
                : 'text-starlight/70 hover:text-starlight hover:bg-nebula'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>{item.icon}</span>
            <span className="hidden md:inline">{item.label}</span>
            {item.badge && item.badge > 0 && (
              <span className="bg-nova-pink text-void text-xs px-1.5 py-0.5 rounded-full font-bold">
                {item.badge}
              </span>
            )}
          </motion.button>
        ))}
      </nav>

      {/* Right side - Stats & Search */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <motion.button
          onClick={toggleSearchModal}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-void border border-plasma-blue/30 text-starlight/50 hover:text-starlight hover:border-plasma-blue/60 transition-all"
          whileHover={{ scale: 1.02 }}
        >
          <span>🔍</span>
          <span className="text-sm font-mono">Ctrl+K</span>
        </motion.button>

        {/* Streak */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-void border border-solar-gold/30">
          <span className="text-solar-gold">🔥</span>
          <span className="font-orbitron text-solar-gold text-sm">{streak}</span>
        </div>

        {/* Level & XP */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-starlight/50 font-mono">Lv.{level.level}</div>
            <div className="text-sm font-space text-plasma-blue">{level.title}</div>
          </div>
          <div className="w-24 h-2 bg-void rounded-full overflow-hidden border border-plasma-blue/30">
            <motion.div
              className="h-full xp-bar rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${level.progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <div className="font-orbitron text-sm text-matrix-green">{xp} XP</div>
        </div>
      </div>
    </motion.header>
  );
}
