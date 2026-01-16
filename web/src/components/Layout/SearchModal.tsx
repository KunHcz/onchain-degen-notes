import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotesStore, useUIStore } from '../../stores';
import Fuse from 'fuse.js';

export function SearchModal() {
  const { searchModalOpen, toggleSearchModal, setCurrentView } = useUIStore();
  const { notes, setCurrentNote } = useNotesStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(notes);

  const fuse = new Fuse(notes, {
    keys: ['title', 'content', 'tags'],
    threshold: 0.3,
    includeMatches: true,
  });

  useEffect(() => {
    if (query) {
      const searchResults = fuse.search(query);
      setResults(searchResults.map(r => r.item));
    } else {
      setResults(notes);
    }
  }, [query, notes]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toggleSearchModal();
      }
      if (e.key === 'Escape' && searchModalOpen) {
        toggleSearchModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchModalOpen, toggleSearchModal]);

  const handleSelect = (noteId: string) => {
    setCurrentNote(noteId);
    setCurrentView('notes');
    toggleSearchModal();
    setQuery('');
  };

  return (
    <AnimatePresence>
      {searchModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSearchModal}
            className="fixed inset-0 bg-void/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-50"
          >
            <div className="bg-nebula border border-plasma-blue/30 rounded-xl shadow-2xl overflow-hidden glow-blue">
              {/* Search Input */}
              <div className="flex items-center gap-3 p-4 border-b border-plasma-blue/20">
                <span className="text-plasma-blue text-xl">🔍</span>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search notes, tags, content..."
                  className="flex-1 bg-transparent text-starlight font-mono text-lg outline-none placeholder:text-starlight/30"
                  autoFocus
                />
                <kbd className="px-2 py-1 bg-void rounded text-xs text-starlight/50 font-mono">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto">
                {results.length === 0 ? (
                  <div className="p-8 text-center text-starlight/50">
                    <span className="text-4xl mb-4 block">🔭</span>
                    <p>No results found</p>
                  </div>
                ) : (
                  <div className="p-2">
                    {results.map((note, index) => (
                      <motion.button
                        key={note.id}
                        onClick={() => handleSelect(note.id)}
                        className="w-full text-left p-3 rounded-lg hover:bg-plasma-blue/10 transition-all group"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">
                            {note.category === 'solana' ? '⚡' :
                             note.category === 'evm' ? '🔷' :
                             note.category === 'trading' ? '📈' : '📝'}
                          </span>
                          <div className="flex-1">
                            <div className="font-space text-starlight group-hover:text-plasma-blue transition-colors">
                              {note.title}
                            </div>
                            <div className="text-xs text-starlight/50 font-mono">
                              {note.path}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {note.tags.slice(0, 3).map(tag => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 bg-void rounded text-xs text-plasma-blue/70"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-plasma-blue/20 flex items-center justify-between text-xs text-starlight/50">
                <div className="flex items-center gap-4">
                  <span>↑↓ Navigate</span>
                  <span>↵ Select</span>
                </div>
                <span>{results.length} results</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
