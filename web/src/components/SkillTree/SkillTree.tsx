import { motion } from 'framer-motion';
import { useSkillTreeStore, useProgressStore } from '../../stores';
import type { SkillNode as SkillNodeType } from '../../data/notes';

function SkillNode({
  skill,
  onSelect
}: {
  skill: SkillNodeType;
  onSelect: (skill: SkillNodeType) => void;
}) {
  const statusColors = {
    locked: { bg: 'bg-void', border: 'border-starlight/20', text: 'text-starlight/30' },
    available: { bg: 'bg-nebula', border: 'border-plasma-blue', text: 'text-plasma-blue' },
    in_progress: { bg: 'bg-plasma-blue/20', border: 'border-plasma-blue', text: 'text-plasma-blue' },
    completed: { bg: 'bg-matrix-green/20', border: 'border-matrix-green', text: 'text-matrix-green' },
  };

  const colors = statusColors[skill.status];
  const isClickable = skill.status !== 'locked';

  return (
    <motion.div
      className={`absolute cursor-${isClickable ? 'pointer' : 'not-allowed'}`}
      style={{ left: skill.position.x, top: skill.position.y }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: Math.random() * 0.3 }}
      whileHover={isClickable ? { scale: 1.1 } : {}}
      onClick={() => isClickable && onSelect(skill)}
    >
      <div
        className={`w-32 p-3 rounded-xl ${colors.bg} border-2 ${colors.border} transition-all ${
          skill.status === 'available' ? 'animate-pulse-glow glow-blue' : ''
        } ${skill.status === 'completed' ? 'glow-green' : ''}`}
      >
        {/* Status Icon */}
        <div className="text-2xl text-center mb-2">
          {skill.status === 'locked' && '🔒'}
          {skill.status === 'available' && '✨'}
          {skill.status === 'in_progress' && '📖'}
          {skill.status === 'completed' && '✅'}
        </div>

        {/* Title */}
        <div className={`font-space text-xs text-center ${colors.text} font-semibold`}>
          {skill.title}
        </div>

        {/* XP Reward */}
        <div className="text-center mt-2">
          <span className="text-xs font-orbitron text-solar-gold">
            +{skill.xpReward} XP
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function ConnectionLine({
  from,
  to,
  isActive
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  isActive: boolean;
}) {
  const startX = from.x + 64; // Center of node
  const startY = from.y + 50;
  const endX = to.x + 64;
  const endY = to.y + 50;

  return (
    <svg
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: -1 }}
    >
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={isActive ? '#00d4ff' : '#333'} />
          <stop offset="100%" stopColor={isActive ? '#00ff88' : '#333'} />
        </linearGradient>
      </defs>
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke="url(#lineGradient)"
        strokeWidth={isActive ? 3 : 2}
        strokeDasharray={isActive ? '0' : '5,5'}
        opacity={isActive ? 0.8 : 0.3}
      />
    </svg>
  );
}

export function SkillTree() {
  const { skills } = useSkillTreeStore();
  const { completedSkills } = useProgressStore();

  const handleSkillSelect = (skill: SkillNodeType) => {
    // Could open a modal or navigate to related notes
    console.log('Selected skill:', skill);
  };

  // Generate connection lines
  const connections: { from: SkillNodeType; to: SkillNodeType; isActive: boolean }[] = [];
  skills.forEach(skill => {
    skill.prerequisites.forEach(prereqId => {
      const prereq = skills.find(s => s.id === prereqId);
      if (prereq) {
        connections.push({
          from: prereq,
          to: skill,
          isActive: completedSkills.includes(prereqId)
        });
      }
    });
  });

  const categories = [
    { id: 'solana', label: 'Solana Track', color: 'plasma-blue', icon: '⚡' },
    { id: 'evm', label: 'EVM Track', color: 'nova-pink', icon: '🔷' },
    { id: 'trading', label: 'Trading Track', color: 'solar-gold', icon: '📈' },
  ];

  return (
    <div className="w-full h-full overflow-auto p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-space text-3xl gradient-text mb-2">Skill Tree</h1>
        <p className="text-starlight/50 font-mono text-sm">
          Complete prerequisites to unlock new skills • Earn XP for each completed skill
        </p>
      </motion.div>

      {/* Category Labels */}
      <div className="flex gap-6 mb-8">
        {categories.map(cat => (
          <div key={cat.id} className="flex items-center gap-2">
            <span className="text-xl">{cat.icon}</span>
            <span className={`font-space text-${cat.color}`}>{cat.label}</span>
          </div>
        ))}
      </div>

      {/* Skill Tree Canvas */}
      <div className="relative" style={{ width: 700, height: 500 }}>
        {/* Connection Lines */}
        {connections.map((conn, i) => (
          <ConnectionLine
            key={i}
            from={conn.from.position}
            to={conn.to.position}
            isActive={conn.isActive}
          />
        ))}

        {/* Skill Nodes */}
        {skills.map(skill => (
          <SkillNode
            key={skill.id}
            skill={skill}
            onSelect={handleSkillSelect}
          />
        ))}
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 glass rounded-lg p-4 inline-block"
      >
        <h3 className="font-space text-sm text-starlight mb-3">Legend</h3>
        <div className="flex gap-6">
          {[
            { icon: '🔒', label: 'Locked', desc: 'Complete prerequisites' },
            { icon: '✨', label: 'Available', desc: 'Ready to learn' },
            { icon: '📖', label: 'In Progress', desc: 'Currently learning' },
            { icon: '✅', label: 'Completed', desc: 'Skill mastered' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2">
              <span className="text-lg">{item.icon}</span>
              <div>
                <div className="text-xs text-starlight font-space">{item.label}</div>
                <div className="text-xs text-starlight/50">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
