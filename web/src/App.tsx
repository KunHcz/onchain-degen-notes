import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header, Sidebar, SearchModal } from './components/Layout';
import { KnowledgeUniverse } from './components/KnowledgeUniverse';
import { SkillTree } from './components/SkillTree';
import { NoteViewer } from './components/NoteViewer';
import { ReviewSession } from './components/Flashcards';
import { Achievements } from './components/Gamification';
import { TradingDashboard } from './components/Dashboard';
import { useUIStore, useProgressStore, useSkillTreeStore } from './stores';

function App() {
  const { currentView, toggleSidebar } = useUIStore();
  const { updateStreak } = useProgressStore();
  const { checkAndUnlockSkills } = useSkillTreeStore();

  // Update streak on app load
  useEffect(() => {
    updateStreak();
    checkAndUnlockSkills();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle sidebar with Ctrl+B
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

  const renderContent = () => {
    switch (currentView) {
      case 'universe':
        return <KnowledgeUniverse />;
      case 'skills':
        return <SkillTree />;
      case 'notes':
        return <NoteViewer />;
      case 'review':
        return <ReviewSession />;
      case 'trades':
        return <TradingDashboard />;
      case 'achievements':
        return <Achievements />;
      default:
        return <KnowledgeUniverse />;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-void overflow-hidden">
      {/* Star field background */}
      <div className="star-field" />

      {/* Header */}
      <Header />

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Search Modal */}
      <SearchModal />

      {/* Keyboard shortcuts hint */}
      <div className="fixed bottom-4 right-4 text-xs text-starlight/30 font-mono space-y-1">
        <div>Ctrl+K: Search</div>
        <div>Ctrl+B: Toggle Sidebar</div>
      </div>
    </div>
  );
}

export default App;
