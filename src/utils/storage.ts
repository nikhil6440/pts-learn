import {
  PlayerProfile,
  GameProgress,
  Badge,
  DailyQuest,
  QuizSession,
  GameId,
} from '../types/game.js';
import { INITIAL_BADGES, INITIAL_DAILY_QUESTS } from '../data/gameData.js';

const STORAGE_KEYS = {
  PROFILE: 'playtown_profile_v1',
  PROGRESS: 'playtown_progress_v1',
  BADGES: 'playtown_badges_v1',
  QUESTS: 'playtown_quests_v1',
  SESSIONS: 'playtown_sessions_v1',
};

export const DEFAULT_PROFILE: PlayerProfile = {
  selectedBuddy: 'pip',
  ageGroup: '10-11',
  difficulty: 'medium',
  totalXP: 240,
  playerLevel: 5,
  currentStreak: 5,
  lastPlayedDate: new Date().toISOString(),
  favoriteGame: 'Math Quest',
  soundEnabled: true,
  textSize: 'standard',
  onboardingCompleted: true, // will be checked against query params
  claimedLevelRewards: [1, 2, 3, 4],
};

export const DEFAULT_PROGRESS: Record<GameId, GameProgress> = {
  'math-quest': {
    gameId: 'math-quest',
    currentWorld: 1,
    currentLevel: 4,
    unlockedWorlds: [1, 2, 3],
    completedLevels: {
      '1-1': { stars: 3, score: 3, completedAt: '2026-10-21' },
      '1-2': { stars: 3, score: 3, completedAt: '2026-10-22' },
      '1-3': { stars: 2, score: 2, completedAt: '2026-10-23' },
      '1-4': { stars: 2, score: 2, completedAt: '2026-10-24' },
      '2-1': { stars: 3, score: 3, completedAt: '2026-10-24' },
      '2-2': { stars: 2, score: 2, completedAt: '2026-10-25' },
    },
  },
  'science-explorer': {
    gameId: 'science-explorer',
    currentWorld: 1,
    currentLevel: 2,
    unlockedWorlds: [1, 2, 3],
    completedLevels: {
      '1-1': { stars: 3, score: 3, completedAt: '2026-10-23' },
      '1-2': { stars: 3, score: 3, completedAt: '2026-10-24' },
      '2-1': { stars: 2, score: 2, completedAt: '2026-10-25' },
    },
  },
  'brain-trails': {
    gameId: 'brain-trails',
    currentWorld: 1,
    currentLevel: 1,
    unlockedWorlds: [1, 2, 3],
    completedLevels: {
      '1-1': { stars: 3, score: 3, completedAt: '2026-10-24' },
      '1-2': { stars: 2, score: 2, completedAt: '2026-10-25' },
    },
  },
};

export const DEFAULT_SESSIONS: QuizSession[] = [
  {
    sessionId: 'sess-1',
    gameId: 'math-quest',
    worldNumber: 1,
    levelNumber: 4,
    answers: [],
    correctCount: 3,
    starsEarned: 3,
    xpEarned: 140,
    durationSeconds: 360,
    completedAt: 'Today · 6 min',
  },
  {
    sessionId: 'sess-2',
    gameId: 'brain-trails',
    worldNumber: 1,
    levelNumber: 2,
    answers: [],
    correctCount: 2,
    starsEarned: 2,
    xpEarned: 100,
    durationSeconds: 240,
    completedAt: 'Today · 4 min',
  },
  {
    sessionId: 'sess-3',
    gameId: 'science-explorer',
    worldNumber: 2,
    levelNumber: 1,
    answers: [],
    correctCount: 3,
    starsEarned: 3,
    xpEarned: 140,
    durationSeconds: 300,
    completedAt: 'Yesterday · 5 min',
  },
  {
    sessionId: 'sess-4',
    gameId: 'math-quest',
    worldNumber: 1,
    levelNumber: 3,
    answers: [],
    correctCount: 2,
    starsEarned: 2,
    xpEarned: 100,
    durationSeconds: 420,
    completedAt: 'Yesterday · 7 min',
  },
  {
    sessionId: 'sess-5',
    gameId: 'brain-trails',
    worldNumber: 1,
    levelNumber: 1,
    answers: [],
    correctCount: 1,
    starsEarned: 1,
    xpEarned: 60,
    durationSeconds: 300,
    completedAt: 'Mon · 5 min',
  },
];

export function loadProfile(): PlayerProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: PlayerProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save profile:', err);
  }
}

export function loadProgress(): Record<GameId, GameProgress> {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (!raw) return DEFAULT_PROGRESS;
    return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(progress: Record<GameId, GameProgress>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  } catch (err) {
    console.error('Failed to save progress:', err);
  }
}

export function loadBadges(): Badge[] {
  if (typeof window === 'undefined') return INITIAL_BADGES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BADGES);
    if (!raw) return INITIAL_BADGES;
    return JSON.parse(raw);
  } catch {
    return INITIAL_BADGES;
  }
}

export function saveBadges(badges: Badge[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(badges));
  } catch (err) {
    console.error('Failed to save badges:', err);
  }
}

export function loadQuests(): DailyQuest[] {
  if (typeof window === 'undefined') return INITIAL_DAILY_QUESTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUESTS);
    if (!raw) return INITIAL_DAILY_QUESTS;
    return JSON.parse(raw);
  } catch {
    return INITIAL_DAILY_QUESTS;
  }
}

export function saveQuests(quests: DailyQuest[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(quests));
  } catch (err) {
    console.error('Failed to save quests:', err);
  }
}

export function loadSessions(): QuizSession[] {
  if (typeof window === 'undefined') return DEFAULT_SESSIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (!raw) return DEFAULT_SESSIONS;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_SESSIONS;
  }
}

export function saveSessions(sessions: QuizSession[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  } catch (err) {
    console.error('Failed to save sessions:', err);
  }
}

export function resetAllStorage(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.PROFILE);
  localStorage.removeItem(STORAGE_KEYS.PROGRESS);
  localStorage.removeItem(STORAGE_KEYS.BADGES);
  localStorage.removeItem(STORAGE_KEYS.QUESTS);
  localStorage.removeItem(STORAGE_KEYS.SESSIONS);
}
