/**
 * Playtown Learn - Core Data Types
 */

export type GameId = 'math-quest' | 'science-explorer' | 'brain-trails';
export type AgeGroup = '8-9' | '10-11' | '12-14';
export type ChallengeLevel = 'easy' | 'medium' | 'hard';
export type BuddyId = 'pip' | 'oliver' | 'nova' | 'ruby' | 'luna' | 'milo';
export type TextSize = 'standard' | 'large' | 'extra-large';

export interface BuddyInfo {
  id: BuddyId;
  name: string;
  color: string;
  bgFill: string;
  personality: string;
}

export interface PlayerProfile {
  selectedBuddy: BuddyId;
  ageGroup: AgeGroup;
  difficulty: ChallengeLevel;
  totalXP: number;
  playerLevel: number;
  currentStreak: number;
  lastPlayedDate: string;
  favoriteGame: string;
  soundEnabled: boolean;
  textSize: TextSize;
  onboardingCompleted: boolean;
  claimedLevelRewards: number[];
}

export interface LevelScore {
  stars: number;
  score: number;
  completedAt: string;
}

export interface GameProgress {
  gameId: GameId;
  currentWorld: number;
  currentLevel: number;
  unlockedWorlds: number[];
  completedLevels: Record<string, LevelScore>; // key: `${worldNumber}-${levelNumber}`
}

export interface QuizQuestion {
  questionId: string;
  gameId: GameId;
  worldNumber: number;
  levelNumber: number;
  difficulty: ChallengeLevel;
  ageGroup: AgeGroup;
  questionText: string;
  visualPrompt?: string;
  visualType?: 'equation' | 'planet' | 'sequence' | 'text' | 'fraction' | 'science';
  answerOptions: string[];
  correctAnswer: string;
  explanation: string;
  hint: string;
}

export interface QuizAnswerRecord {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
}

export interface QuizSession {
  sessionId: string;
  gameId: GameId;
  worldNumber: number;
  levelNumber: number;
  answers: QuizAnswerRecord[];
  correctCount: number;
  starsEarned: number;
  xpEarned: number;
  durationSeconds: number;
  completedAt: string;
}

export interface Badge {
  id: string;
  badgeNumber: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface DailyQuest {
  id: string;
  title: string;
  target: number;
  currentProgress: number;
  completed: boolean;
  claimed: boolean;
  xpReward: number;
}

export interface WorldInfo {
  worldNumber: number;
  title: string;
  description: string;
  totalLevels: number;
}

export interface GameModeInfo {
  id: GameId;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  primaryColor: string;
  secondaryColor: string;
  lightBg: string;
  worlds: WorldInfo[];
}
