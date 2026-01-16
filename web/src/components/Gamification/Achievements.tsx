import { motion } from 'framer-motion';
import { useProgressStore, useTradesStore } from '../../stores';
import { initialAchievements, levelThresholds } from '../../data/notes';

export function Achievements() {
  const { xp, streak, notesRead, completedSkills, unlockedAchievements, getLevel } = useProgressStore();
  const { trades } = useTradesStore();
  const level = getLevel();

  // Check achievement progress
  const getAchievementProgress = (achievement: typeof initialAchievements[0]) => {
    switch (achievement.condition.type) {
      case 'notes_read':
        return { current: notesRead.length, target: achievement.condition.target };
      case 'streak':
        return { current: streak, target: achievement.condition.target };
      case 'trades':
        return { current: trades.length, target: achievement.condition.target };
      case 'xp':
        return { current: xp, target: achievement.condition.target };
      case 'skill_complete':
        return { current: completedSkills.length, target: achievement.condition.target };
      default:
        return { current: 0, target: 1 };
    }
  };

  const achievements = initialAchievements.map(a => ({
    ...a,
    unlocked: unlockedAchievements.includes(a.id),
    progress: getAchievementProgress(a),
  }));

  return (
    <div className="flex-1 overflow-y-auto p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-space text-3xl gradient-text mb-2">Achievements</h1>
        <p className="text-starlight/50 font-mono text-sm">
          Track your progress and unlock rewards
        </p>
      </motion.div>

      {/* Level Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-2xl p-6 mb-8 glow-blue"
      >
        <div className="flex items-center gap-6">
          {/* Level Badge */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-plasma-blue to-nova-pink flex items-center justify-center">
            <div className="text-center">
              <div className="font-orbitron text-3xl text-white">{level.level}</div>
              <div className="text-xs text-white/70">LEVEL</div>
            </div>
          </div>

          {/* Level Info */}
          <div className="flex-1">
            <div className="font-space text-2xl text-starlight mb-1">{level.title}</div>
            <div className="text-sm text-starlight/50 mb-3">
              {xp} / {levelThresholds[level.level]?.maxXp || '∞'} XP
            </div>
            <div className="w-full h-3 bg-void rounded-full overflow-hidden">
              <motion.div
                className="h-full xp-bar rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${level.progress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="font-orbitron text-2xl text-solar-gold">{streak}</div>
              <div className="text-xs text-starlight/50">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="font-orbitron text-2xl text-plasma-blue">{notesRead.length}</div>
              <div className="text-xs text-starlight/50">Notes Read</div>
            </div>
            <div className="text-center">
              <div className="font-orbitron text-2xl text-matrix-green">{completedSkills.length}</div>
              <div className="text-xs text-starlight/50">Skills</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Level Roadmap */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="font-space text-lg text-starlight mb-4">Level Roadmap</h2>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {levelThresholds.map((lvl) => (
            <div
              key={lvl.level}
              className={`flex-shrink-0 px-4 py-2 rounded-lg border ${
                level.level >= lvl.level
                  ? 'bg-plasma-blue/20 border-plasma-blue text-plasma-blue'
                  : level.level === lvl.level - 1
                  ? 'bg-nebula border-starlight/30 text-starlight'
                  : 'bg-void border-starlight/10 text-starlight/30'
              }`}
            >
              <div className="font-orbitron text-sm">Lv.{lvl.level}</div>
              <div className="text-xs">{lvl.title}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Achievements Grid */}
      <div>
        <h2 className="font-space text-lg text-starlight mb-4">All Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-xl border transition-all ${
                achievement.unlocked
                  ? 'bg-solar-gold/10 border-solar-gold glow-gold'
                  : 'bg-nebula/50 border-starlight/10 hover:border-starlight/30'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl ${
                    achievement.unlocked ? 'bg-solar-gold/20' : 'bg-void grayscale'
                  }`}
                >
                  {achievement.icon}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className={`font-space text-sm ${
                    achievement.unlocked ? 'text-solar-gold' : 'text-starlight'
                  }`}>
                    {achievement.title}
                  </div>
                  <div className="text-xs text-starlight/50 mt-1">
                    {achievement.description}
                  </div>

                  {/* Progress */}
                  {!achievement.unlocked && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-starlight/50 mb-1">
                        <span>Progress</span>
                        <span>{achievement.progress.current} / {achievement.progress.target}</span>
                      </div>
                      <div className="w-full h-1.5 bg-void rounded-full overflow-hidden">
                        <div
                          className="h-full bg-plasma-blue rounded-full transition-all"
                          style={{
                            width: `${Math.min(
                              (achievement.progress.current / achievement.progress.target) * 100,
                              100
                            )}%`
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* XP Reward */}
                  <div className="mt-2 text-xs font-orbitron text-matrix-green">
                    +{achievement.xpReward} XP
                  </div>
                </div>

                {/* Unlocked Badge */}
                {achievement.unlocked && (
                  <div className="text-solar-gold text-xl">✓</div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
