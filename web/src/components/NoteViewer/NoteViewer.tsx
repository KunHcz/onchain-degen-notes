import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
import { useNotesStore, useProgressStore, useFlashcardsStore } from '../../stores';

export function NoteViewer() {
  const { notes, currentNoteId, setCurrentNote } = useNotesStore();
  const { markNoteRead, updateStreak } = useProgressStore();
  const { addFlashcard, getCardsByNote } = useFlashcardsStore();

  const currentNote = notes.find(n => n.id === currentNoteId);
  const relatedNotes = currentNote
    ? notes.filter(n => currentNote.connections.includes(n.id))
    : [];

  // Mark note as read and update streak
  useEffect(() => {
    if (currentNoteId) {
      markNoteRead(currentNoteId);
      updateStreak();
    }
  }, [currentNoteId, markNoteRead, updateStreak]);

  // Extract flashcards from content
  useEffect(() => {
    if (currentNote) {
      const existingCards = getCardsByNote(currentNote.id);
      const qaPattern = /Q:\s*(.+?)\nA:\s*(.+?)(?=\n\n|Q:|$)/gs;
      let match;

      while ((match = qaPattern.exec(currentNote.content)) !== null) {
        const question = match[1].trim();
        const answer = match[2].trim();

        // Check if card already exists
        const exists = existingCards.some(c => c.question === question);
        if (!exists) {
          addFlashcard({
            noteId: currentNote.id,
            question,
            answer,
            easeFactor: 2.5,
            interval: 0,
            repetitions: 0,
            nextReview: Date.now(),
          });
        }
      }
    }
  }, [currentNote?.id]);

  if (!currentNote) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <span className="text-6xl mb-4 block">📝</span>
          <h2 className="font-space text-xl text-starlight mb-2">Select a Note</h2>
          <p className="text-starlight/50 font-mono text-sm">
            Choose a note from the sidebar or explore the Knowledge Universe
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Main Content */}
      <motion.div
        key={currentNote.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 overflow-y-auto p-8"
      >
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-starlight/50 font-mono mb-6">
          <span>{currentNote.category}</span>
          <span>/</span>
          <span>{currentNote.subcategory || 'general'}</span>
          <span>/</span>
          <span className="text-plasma-blue">{currentNote.title}</span>
        </div>

        {/* Tags */}
        <div className="flex gap-2 mb-6">
          {currentNote.tags.map(tag => (
            <span
              key={tag}
              className="px-3 py-1 bg-nebula rounded-full text-xs text-plasma-blue border border-plasma-blue/30"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Markdown Content */}
        <div className="markdown-content max-w-3xl">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl font-space gradient-text mb-4">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-space text-plasma-blue mt-8 mb-4">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-space text-matrix-green mt-6 mb-3">{children}</h3>
              ),
              code: ({ className, children, ...props }) => {
                const isInline = !className;
                if (isInline) {
                  return (
                    <code className="bg-nebula px-1.5 py-0.5 rounded text-matrix-green text-sm" {...props}>
                      {children}
                    </code>
                  );
                }
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
              pre: ({ children }) => (
                <pre className="bg-nebula p-4 rounded-lg overflow-x-auto border border-plasma-blue/20 my-4">
                  {children}
                </pre>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto my-4">
                  <table className="w-full border-collapse">{children}</table>
                </div>
              ),
              th: ({ children }) => (
                <th className="bg-nebula px-4 py-2 text-left text-plasma-blue border border-plasma-blue/20">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-4 py-2 border border-plasma-blue/20">{children}</td>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-plasma-blue pl-4 my-4 text-starlight/70 italic">
                  {children}
                </blockquote>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-plasma-blue hover:text-nova-pink underline transition-colors"
                >
                  {children}
                </a>
              ),
              input: ({ type, checked }) => {
                if (type === 'checkbox') {
                  return (
                    <input
                      type="checkbox"
                      checked={checked}
                      readOnly
                      className="mr-2"
                    />
                  );
                }
                return <input type={type} />;
              },
            }}
          >
            {currentNote.content}
          </ReactMarkdown>
        </div>
      </motion.div>

      {/* Right Sidebar - Related Notes */}
      <motion.aside
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="w-64 border-l border-plasma-blue/20 p-4 overflow-y-auto bg-nebula/30"
      >
        <h3 className="font-space text-sm text-starlight mb-4 flex items-center gap-2">
          <span>🔗</span> Related Notes
        </h3>

        {relatedNotes.length === 0 ? (
          <p className="text-xs text-starlight/50">No related notes</p>
        ) : (
          <div className="space-y-2">
            {relatedNotes.map(note => (
              <motion.button
                key={note.id}
                onClick={() => setCurrentNote(note.id)}
                className="w-full text-left p-3 rounded-lg bg-void/50 hover:bg-plasma-blue/10 border border-transparent hover:border-plasma-blue/30 transition-all"
                whileHover={{ x: 4 }}
              >
                <div className="font-mono text-sm text-starlight">{note.title}</div>
                <div className="text-xs text-starlight/50 mt-1">{note.category}</div>
              </motion.button>
            ))}
          </div>
        )}

        {/* Flashcards from this note */}
        <div className="mt-8">
          <h3 className="font-space text-sm text-starlight mb-4 flex items-center gap-2">
            <span>🧠</span> Flashcards
          </h3>
          <div className="text-xs text-starlight/50">
            {getCardsByNote(currentNote.id).length} cards extracted
          </div>
        </div>
      </motion.aside>
    </div>
  );
}
