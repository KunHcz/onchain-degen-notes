import { motion, AnimatePresence } from 'framer-motion';
import { useNotesStore, useUIStore } from '../../stores';

const categories = [
  { id: 'solana', label: 'Solana', icon: '⚡', color: 'plasma-blue' },
  { id: 'evm', label: 'EVM', icon: '🔷', color: 'nova-pink' },
  { id: 'trading', label: 'Trading', icon: '📈', color: 'solar-gold' },
  { id: 'tools', label: 'Tools', icon: '🛠️', color: 'matrix-green' },
  { id: 'resources', label: 'Resources', icon: '📚', color: 'starlight' },
];

export function Sidebar() {
  const { sidebarOpen } = useUIStore();
  const { notes, currentNoteId, setCurrentNote } = useNotesStore();
  const { setCurrentView } = useUIStore();

  const notesByCategory = categories.map(cat => ({
    ...cat,
    notes: notes.filter(n => n.category === cat.id)
  }));

  const handleNoteClick = (noteId: string) => {
    setCurrentNote(noteId);
    setCurrentView('notes');
  };

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <motion.aside
          initial={{ x: -280, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -280, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-72 h-full bg-nebula/50 backdrop-blur-md border-r border-plasma-blue/20 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-plasma-blue/20">
            <h2 className="font-space text-lg text-starlight flex items-center gap-2">
              <span>📂</span> Notes
            </h2>
          </div>

          {/* Categories */}
          <div className="flex-1 overflow-y-auto p-2">
            {notesByCategory.map((category) => (
              <div key={category.id} className="mb-4">
                <div className={`flex items-center gap-2 px-3 py-2 text-${category.color} font-space text-sm`}>
                  <span>{category.icon}</span>
                  <span>{category.label}</span>
                  <span className="text-xs text-starlight/30 ml-auto">
                    {category.notes.length}
                  </span>
                </div>

                <div className="space-y-1">
                  {category.notes.map((note) => (
                    <motion.button
                      key={note.id}
                      onClick={() => handleNoteClick(note.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg text-sm font-mono transition-all ${
                        currentNoteId === note.id
                          ? 'bg-plasma-blue/20 text-plasma-blue border-l-2 border-plasma-blue'
                          : 'text-starlight/70 hover:text-starlight hover:bg-void/50'
                      }`}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{note.title}</span>
                        {note.progress > 0 && (
                          <div className="w-8 h-1 bg-void rounded-full overflow-hidden ml-2">
                            <div
                              className="h-full bg-matrix-green rounded-full"
                              style={{ width: `${note.progress}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Stats */}
          <div className="p-4 border-t border-plasma-blue/20 bg-void/30">
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2 rounded-lg bg-nebula/50">
                <div className="font-orbitron text-plasma-blue text-lg">{notes.length}</div>
                <div className="text-xs text-starlight/50">Notes</div>
              </div>
              <div className="p-2 rounded-lg bg-nebula/50">
                <div className="font-orbitron text-matrix-green text-lg">
                  {notes.filter(n => n.progress === 100).length}
                </div>
                <div className="text-xs text-starlight/50">Completed</div>
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
