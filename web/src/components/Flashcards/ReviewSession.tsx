import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFlashcardsStore, useProgressStore } from '../../stores';
import type { Flashcard } from '../../data/notes';

function FlashcardCard({
  card,
  onReview
}: {
  card: Flashcard;
  onReview: (quality: number) => void;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      className="w-full max-w-xl mx-auto perspective-1000"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Card */}
      <motion.div
        className="relative w-full h-80 cursor-pointer"
        onClick={() => setFlipped(!flipped)}
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
      >
        {/* Front - Question */}
        <div
          className="absolute inset-0 bg-nebula border-2 border-plasma-blue/30 rounded-2xl p-8 flex flex-col items-center justify-center backface-hidden glow-blue"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="text-4xl mb-4">❓</div>
          <div className="font-space text-xl text-starlight text-center">
            {card.question}
          </div>
          <div className="mt-6 text-sm text-starlight/50 font-mono">
            Click to reveal answer
          </div>
        </div>

        {/* Back - Answer */}
        <div
          className="absolute inset-0 bg-nebula border-2 border-matrix-green/30 rounded-2xl p-8 flex flex-col items-center justify-center glow-green"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="text-4xl mb-4">💡</div>
          <div className="font-mono text-lg text-matrix-green text-center">
            {card.answer}
          </div>
        </div>
      </motion.div>

      {/* Rating Buttons */}
      <AnimatePresence>
        {flipped && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-6 flex justify-center gap-3"
          >
            {[
              { quality: 0, label: 'Again', color: 'bg-red-500/20 border-red-500 text-red-400', desc: 'Forgot' },
              { quality: 2, label: 'Hard', color: 'bg-orange-500/20 border-orange-500 text-orange-400', desc: 'Difficult' },
              { quality: 3, label: 'Good', color: 'bg-plasma-blue/20 border-plasma-blue text-plasma-blue', desc: 'Correct' },
              { quality: 5, label: 'Easy', color: 'bg-matrix-green/20 border-matrix-green text-matrix-green', desc: 'Perfect' },
            ].map(btn => (
              <motion.button
                key={btn.quality}
                onClick={(e) => {
                  e.stopPropagation();
                  onReview(btn.quality);
                  setFlipped(false);
                }}
                className={`px-4 py-3 rounded-lg border ${btn.color} font-space text-sm transition-all hover:scale-105`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <div>{btn.label}</div>
                <div className="text-xs opacity-70">{btn.desc}</div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function ReviewSession() {
  const { getDueCards, reviewCard, flashcards } = useFlashcardsStore();
  const { addXp } = useProgressStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [reviewed, setReviewed] = useState(0);

  const dueCards = getDueCards();
  const currentCard = dueCards[currentIndex];

  const handleReview = (quality: number) => {
    if (currentCard) {
      reviewCard(currentCard.id, quality);
      addXp(quality >= 3 ? 5 : 2); // More XP for correct answers
      setReviewed(r => r + 1);

      if (currentIndex < dueCards.length - 1) {
        setCurrentIndex(i => i + 1);
      } else {
        setSessionComplete(true);
      }
    }
  };

  if (flashcards.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <span className="text-6xl mb-4 block">📚</span>
          <h2 className="font-space text-2xl text-starlight mb-2">No Flashcards Yet</h2>
          <p className="text-starlight/50 font-mono text-sm max-w-md">
            Read some notes to automatically generate flashcards from Q&A pairs.
            Look for "Q: ... A: ..." patterns in your notes.
          </p>
        </motion.div>
      </div>
    );
  }

  if (dueCards.length === 0 || sessionComplete) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <span className="text-6xl mb-4 block">🎉</span>
          <h2 className="font-space text-2xl gradient-text mb-2">
            {sessionComplete ? 'Session Complete!' : 'All Caught Up!'}
          </h2>
          <p className="text-starlight/50 font-mono text-sm mb-6">
            {sessionComplete
              ? `You reviewed ${reviewed} cards. Great job!`
              : 'No cards due for review right now. Come back later!'}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="glass rounded-lg p-4">
              <div className="font-orbitron text-2xl text-plasma-blue">{flashcards.length}</div>
              <div className="text-xs text-starlight/50">Total Cards</div>
            </div>
            <div className="glass rounded-lg p-4">
              <div className="font-orbitron text-2xl text-matrix-green">{reviewed}</div>
              <div className="text-xs text-starlight/50">Reviewed</div>
            </div>
            <div className="glass rounded-lg p-4">
              <div className="font-orbitron text-2xl text-solar-gold">
                {Math.round((reviewed / Math.max(flashcards.length, 1)) * 100)}%
              </div>
              <div className="text-xs text-starlight/50">Progress</div>
            </div>
          </div>

          {sessionComplete && (
            <motion.button
              onClick={() => {
                setCurrentIndex(0);
                setSessionComplete(false);
                setReviewed(0);
              }}
              className="mt-6 px-6 py-3 bg-plasma-blue/20 border border-plasma-blue rounded-lg font-space text-plasma-blue hover:bg-plasma-blue/30 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start New Session
            </motion.button>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-space text-3xl gradient-text mb-2">Review Session</h1>
        <p className="text-starlight/50 font-mono text-sm">
          Strengthen your memory with spaced repetition
        </p>
      </motion.div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-starlight/50 mb-2">
          <span>Progress</span>
          <span>{currentIndex + 1} / {dueCards.length}</span>
        </div>
        <div className="w-full h-2 bg-void rounded-full overflow-hidden">
          <motion.div
            className="h-full xp-bar rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / dueCards.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div className="flex-1 flex items-center justify-center">
        <FlashcardCard card={currentCard} onReview={handleReview} />
      </div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center text-xs text-starlight/30 font-mono"
      >
        Tip: Rate honestly - it helps the algorithm schedule reviews optimally
      </motion.div>
    </div>
  );
}
