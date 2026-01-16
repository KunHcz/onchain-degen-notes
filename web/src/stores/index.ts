import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Note, SkillNode, Trade, Flashcard } from '../data/notes';
import {
  initialNotes,
  initialSkillTree,
  initialAchievements,
  levelThresholds
} from '../data/notes';

// User Progress Store
interface ProgressState {
  xp: number;
  streak: number;
  lastActiveDate: string | null;
  notesRead: string[];
  completedSkills: string[];
  unlockedAchievements: string[];

  addXp: (amount: number) => void;
  markNoteRead: (noteId: string) => void;
  completeSkill: (skillId: string) => void;
  unlockAchievement: (achievementId: string) => void;
  updateStreak: () => void;
  getLevel: () => { level: number; title: string; progress: number };
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      xp: 0,
      streak: 0,
      lastActiveDate: null,
      notesRead: [],
      completedSkills: [],
      unlockedAchievements: [],

      addXp: (amount) => set((state) => ({ xp: state.xp + amount })),

      markNoteRead: (noteId) => set((state) => {
        if (state.notesRead.includes(noteId)) return state;
        return {
          notesRead: [...state.notesRead, noteId],
          xp: state.xp + 10 // XP for reading a note
        };
      }),

      completeSkill: (skillId) => set((state) => {
        if (state.completedSkills.includes(skillId)) return state;
        const skill = initialSkillTree.find(s => s.id === skillId);
        return {
          completedSkills: [...state.completedSkills, skillId],
          xp: state.xp + (skill?.xpReward || 0)
        };
      }),

      unlockAchievement: (achievementId) => set((state) => {
        if (state.unlockedAchievements.includes(achievementId)) return state;
        const achievement = initialAchievements.find(a => a.id === achievementId);
        return {
          unlockedAchievements: [...state.unlockedAchievements, achievementId],
          xp: state.xp + (achievement?.xpReward || 0)
        };
      }),

      updateStreak: () => set((state) => {
        const today = new Date().toDateString();
        if (state.lastActiveDate === today) return state;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const wasActiveYesterday = state.lastActiveDate === yesterday.toDateString();

        return {
          lastActiveDate: today,
          streak: wasActiveYesterday ? state.streak + 1 : 1
        };
      }),

      getLevel: () => {
        const { xp } = get();
        const levelInfo = levelThresholds.find(l => xp >= l.minXp && xp < l.maxXp)
          || levelThresholds[levelThresholds.length - 1];
        const progress = (xp - levelInfo.minXp) / (levelInfo.maxXp - levelInfo.minXp) * 100;
        return { level: levelInfo.level, title: levelInfo.title, progress: Math.min(progress, 100) };
      },
    }),
    { name: 'degen-progress' }
  )
);

// Notes Store
interface NotesState {
  notes: Note[];
  currentNoteId: string | null;
  searchQuery: string;

  setCurrentNote: (noteId: string | null) => void;
  setSearchQuery: (query: string) => void;
  updateNoteProgress: (noteId: string, progress: number) => void;
  getNote: (noteId: string) => Note | undefined;
  getFilteredNotes: () => Note[];
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: initialNotes,
      currentNoteId: null,
      searchQuery: '',

      setCurrentNote: (noteId) => set({ currentNoteId: noteId }),
      setSearchQuery: (query) => set({ searchQuery: query }),

      updateNoteProgress: (noteId, progress) => set((state) => ({
        notes: state.notes.map(n =>
          n.id === noteId ? { ...n, progress, lastViewed: Date.now() } : n
        )
      })),

      getNote: (noteId) => get().notes.find(n => n.id === noteId),

      getFilteredNotes: () => {
        const { notes, searchQuery } = get();
        if (!searchQuery) return notes;
        const query = searchQuery.toLowerCase();
        return notes.filter(n =>
          n.title.toLowerCase().includes(query) ||
          n.content.toLowerCase().includes(query) ||
          n.tags.some(t => t.toLowerCase().includes(query))
        );
      },
    }),
    { name: 'degen-notes' }
  )
);

// Skill Tree Store
interface SkillTreeState {
  skills: SkillNode[];

  getSkill: (skillId: string) => SkillNode | undefined;
  updateSkillStatus: (skillId: string, status: SkillNode['status']) => void;
  checkAndUnlockSkills: () => void;
}

export const useSkillTreeStore = create<SkillTreeState>()(
  persist(
    (set, get) => ({
      skills: initialSkillTree,

      getSkill: (skillId) => get().skills.find(s => s.id === skillId),

      updateSkillStatus: (skillId, status) => set((state) => ({
        skills: state.skills.map(s =>
          s.id === skillId ? { ...s, status } : s
        )
      })),

      checkAndUnlockSkills: () => set((state) => {
        const completedSkills = useProgressStore.getState().completedSkills;
        return {
          skills: state.skills.map(skill => {
            if (skill.status === 'completed') return skill;
            if (completedSkills.includes(skill.id)) {
              return { ...skill, status: 'completed' as const };
            }
            const allPrereqsMet = skill.prerequisites.every(p =>
              completedSkills.includes(p)
            );
            if (allPrereqsMet && skill.status === 'locked') {
              return { ...skill, status: 'available' as const };
            }
            return skill;
          })
        };
      }),
    }),
    { name: 'degen-skills' }
  )
);

// Flashcards Store
interface FlashcardsState {
  flashcards: Flashcard[];

  addFlashcard: (card: Omit<Flashcard, 'id'>) => void;
  reviewCard: (cardId: string, quality: number) => void; // quality: 0-5 (SM-2)
  getDueCards: () => Flashcard[];
  getCardsByNote: (noteId: string) => Flashcard[];
}

// SM-2 Algorithm implementation
const calculateSM2 = (card: Flashcard, quality: number) => {
  let { easeFactor, interval, repetitions } = card;

  if (quality >= 3) {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  } else {
    repetitions = 0;
    interval = 1;
  }

  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  const nextReview = Date.now() + interval * 24 * 60 * 60 * 1000;

  return { easeFactor, interval, repetitions, nextReview, lastReview: Date.now() };
};

export const useFlashcardsStore = create<FlashcardsState>()(
  persist(
    (set, get) => ({
      flashcards: [],

      addFlashcard: (card) => set((state) => ({
        flashcards: [...state.flashcards, {
          ...card,
          id: `fc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }]
      })),

      reviewCard: (cardId, quality) => set((state) => ({
        flashcards: state.flashcards.map(card => {
          if (card.id !== cardId) return card;
          return { ...card, ...calculateSM2(card, quality) };
        })
      })),

      getDueCards: () => {
        const now = Date.now();
        return get().flashcards.filter(card => card.nextReview <= now);
      },

      getCardsByNote: (noteId) => get().flashcards.filter(card => card.noteId === noteId),
    }),
    { name: 'degen-flashcards' }
  )
);

// Trades Store
interface TradesState {
  trades: Trade[];

  addTrade: (trade: Omit<Trade, 'id'>) => void;
  updateTrade: (tradeId: string, updates: Partial<Trade>) => void;
  closeTrade: (tradeId: string, sellPrice: number) => void;
  getTradeStats: () => {
    totalTrades: number;
    openTrades: number;
    winRate: number;
    totalPnl: number;
    bestTrade: Trade | null;
    worstTrade: Trade | null;
  };
}

export const useTradesStore = create<TradesState>()(
  persist(
    (set, get) => ({
      trades: [],

      addTrade: (trade) => set((state) => ({
        trades: [...state.trades, {
          ...trade,
          id: `trade-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }]
      })),

      updateTrade: (tradeId, updates) => set((state) => ({
        trades: state.trades.map(t =>
          t.id === tradeId ? { ...t, ...updates } : t
        )
      })),

      closeTrade: (tradeId, sellPrice) => set((state) => ({
        trades: state.trades.map(t => {
          if (t.id !== tradeId) return t;
          const pnl = (sellPrice - t.buyPrice) * t.amount;
          const pnlPercent = ((sellPrice - t.buyPrice) / t.buyPrice) * 100;
          return { ...t, sellPrice, pnl, pnlPercent, status: 'closed' as const };
        })
      })),

      getTradeStats: () => {
        const trades = get().trades;
        const closedTrades = trades.filter(t => t.status === 'closed');
        const wins = closedTrades.filter(t => (t.pnl || 0) > 0);
        const totalPnl = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);

        const sortedByPnl = [...closedTrades].sort((a, b) => (b.pnl || 0) - (a.pnl || 0));

        return {
          totalTrades: trades.length,
          openTrades: trades.filter(t => t.status === 'open').length,
          winRate: closedTrades.length > 0 ? (wins.length / closedTrades.length) * 100 : 0,
          totalPnl,
          bestTrade: sortedByPnl[0] || null,
          worstTrade: sortedByPnl[sortedByPnl.length - 1] || null,
        };
      },
    }),
    { name: 'degen-trades' }
  )
);

// UI Store
interface UIState {
  sidebarOpen: boolean;
  searchModalOpen: boolean;
  currentView: 'universe' | 'skills' | 'notes' | 'review' | 'trades' | 'achievements';

  toggleSidebar: () => void;
  toggleSearchModal: () => void;
  setCurrentView: (view: UIState['currentView']) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  searchModalOpen: false,
  currentView: 'universe',

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleSearchModal: () => set((state) => ({ searchModalOpen: !state.searchModalOpen })),
  setCurrentView: (view) => set({ currentView: view }),
}));
