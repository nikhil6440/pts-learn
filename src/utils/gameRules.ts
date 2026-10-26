/**
 * Playtown Learn - Core Game Rules and Scoring Logic
 * Pure functions decoupled from React UI for easy unit testing.
 */

import { ChallengeLevel, GameId, QuizQuestion } from '../types/game.js';

/**
 * Star calculation rule based on PRD:
 * - 3 correct answers: 3 stars
 * - 2 correct answers: 2 stars
 * - 0–1 correct answers: 1 star
 */
export function calculateStars(correctCount: number, totalQuestions: number = 3): number {
  if (correctCount >= 3) return 3;
  if (correctCount === 2) return 2;
  return 1;
}

/**
 * Calculate XP gained for a completed level session.
 * Base XP awards:
 * 3 correct: 100 XP
 * 2 correct: 70 XP
 * 1 correct: 40 XP
 * 0 correct: 20 XP
 *
 * Multipliers for challenge level:
 * Easy: 1.0x
 * Medium: 1.2x (rounded to nearest 10)
 * Hard: 1.4x (rounded to nearest 10)
 *
 * Repeat level: awarded 25% practice XP (minimum 20 XP) to prevent abuse while rewarding practice.
 */
export function calculateXP(
  correctCount: number,
  difficulty: ChallengeLevel = 'medium',
  isFirstCompletion: boolean = true
): number {
  let baseXP = 20;
  if (correctCount >= 3) {
    baseXP = 100;
  } else if (correctCount === 2) {
    baseXP = 70;
  } else if (correctCount === 1) {
    baseXP = 40;
  }

  const multiplier = difficulty === 'hard' ? 1.4 : difficulty === 'medium' ? 1.2 : 1.0;
  let finalXP = Math.round((baseXP * multiplier) / 10) * 10;

  if (!isFirstCompletion) {
    finalXP = Math.max(20, Math.round((finalXP * 0.25) / 10) * 10);
  }

  return finalXP;
}

/**
 * Level progression rules
 * Thresholds: 60 XP per level tier.
 * Level 1: 0 - 60 XP
 * Level 2: 60 - 120 XP
 * Level 3: 120 - 180 XP
 * Level 4: 180 - 240 XP
 * Level 5: 240 - 300 XP (Level 5 Explorer, matching reference PDF)
 * Level 6: 300 - 380 XP
 */
export function calculatePlayerLevel(totalXP: number): {
  level: number;
  title: string;
  currentLevelXP: number;
  nextLevelXP: number;
  progressXP: number;
  neededXP: number;
  progressPercent: number;
} {
  const levelBands = [
    { level: 1, minXP: 0, maxXP: 60, title: 'Novice Thinker' },
    { level: 2, minXP: 60, maxXP: 120, title: 'Curious Mind' },
    { level: 3, minXP: 120, maxXP: 180, title: 'Junior Solver' },
    { level: 4, minXP: 180, maxXP: 240, title: 'Active Adventurer' },
    { level: 5, minXP: 240, maxXP: 300, title: 'Explorer' },
    { level: 6, minXP: 300, maxXP: 380, title: 'Knowledge Seeker' },
    { level: 7, minXP: 380, maxXP: 480, title: 'Puzzle Master' },
    { level: 8, minXP: 480, maxXP: 600, title: 'Grand Genius' },
  ];

  for (const band of levelBands) {
    if (totalXP < band.maxXP) {
      const progressXP = Math.max(0, totalXP - band.minXP);
      const neededXP = band.maxXP - band.minXP;
      const progressPercent = Math.min(100, Math.round((progressXP / neededXP) * 100));
      return {
        level: band.level,
        title: `Level ${band.level} ${band.title}`,
        currentLevelXP: totalXP,
        nextLevelXP: band.maxXP,
        progressXP,
        neededXP,
        progressPercent,
      };
    }
  }

  // Beyond highest band
  const topBand = levelBands[levelBands.length - 1];
  const excess = totalXP - topBand.maxXP;
  const extraLevels = Math.floor(excess / 150);
  const currentLvl = topBand.level + 1 + extraLevels;
  const currentFloor = topBand.maxXP + extraLevels * 150;
  const nextFloor = currentFloor + 150;

  return {
    level: currentLvl,
    title: `Level ${currentLvl} Champion`,
    currentLevelXP: totalXP,
    nextLevelXP: nextFloor,
    progressXP: totalXP - currentFloor,
    neededXP: 150,
    progressPercent: Math.min(100, Math.round(((totalXP - currentFloor) / 150) * 100)),
  };
}

export interface PlayerStatsForBadges {
  totalCompletedGames: number;
  totalStars: number;
  currentStreak: number;
  mathCompleted: number;
  scienceCompleted: number;
  brainCompleted: number;
  perfectScoresCount: number;
}

/**
 * Check badge unlock conditions per PRD:
 * 1. First Steps: Finish 1st level
 * 2. Number Ninja: Complete 3 Math Quest levels
 * 3. Star Scout: Earn 10+ stars
 * 4. Pattern Pro: Complete 3 Brain Trails levels
 * 5. Streak 5: Reach a 5-day streak
 * 6. Quiz Whiz: Score 3 stars in 3 separate quizzes
 * 7. Maze Master: Complete all levels in a Brain Trails world
 * 8. Space Cadet: Complete 3 Science Explorer levels
 * 9. Brainiac: Complete 15 total game levels
 */
export function checkBadgeUnlocks(stats: PlayerStatsForBadges): string[] {
  const unlockedIds: string[] = [];

  if (stats.totalCompletedGames >= 1) unlockedIds.push('first-steps');
  if (stats.mathCompleted >= 3) unlockedIds.push('number-ninja');
  if (stats.totalStars >= 10) unlockedIds.push('star-scout');
  if (stats.brainCompleted >= 3) unlockedIds.push('pattern-pro');
  if (stats.currentStreak >= 5) unlockedIds.push('streak-5');
  if (stats.perfectScoresCount >= 3) unlockedIds.push('quiz-whiz');
  if (stats.brainCompleted >= 4) unlockedIds.push('maze-master');
  if (stats.scienceCompleted >= 3) unlockedIds.push('space-cadet');
  if (stats.totalCompletedGames >= 15) unlockedIds.push('brainiac');

  return unlockedIds;
}

/**
 * Check whether a world is unlocked.
 * World 1 is always unlocked.
 * Future worlds unlock when at least 50% of the preceding world's levels are completed.
 */
export function isWorldUnlocked(
  worldNumber: number,
  unlockedWorldsList: number[],
  previousWorldCompletedCount: number,
  previousWorldTotalLevels: number = 4
): boolean {
  if (worldNumber === 1) return true;
  if (unlockedWorldsList.includes(worldNumber)) return true;
  return previousWorldCompletedCount >= Math.ceil(previousWorldTotalLevels / 2);
}

/**
 * Validate an AI-generated question structure.
 * Ensures exactly 4 choices, non-empty text, valid correct answer within choices,
 * explanation and friendly hint present.
 */
export function validateGeminiQuestion(raw: unknown, defaultGameId: GameId = 'math-quest'): QuizQuestion | null {
  if (!raw || typeof raw !== 'object') return null;
  const q = raw as Record<string, unknown>;

  if (typeof q.questionText !== 'string' || q.questionText.trim().length === 0) return null;
  if (!Array.isArray(q.answerOptions) || q.answerOptions.length !== 4) return null;

  const cleanOptions = q.answerOptions.map((opt) => String(opt).trim());
  if (new Set(cleanOptions).size !== 4) return null; // Avoid duplicates

  const correct = String(q.correctAnswer || '').trim();
  if (!cleanOptions.includes(correct)) return null;

  const explanation = typeof q.explanation === 'string' && q.explanation.trim().length > 0
    ? q.explanation.trim()
    : `${correct} is the right answer!`;

  const hint = typeof q.hint === 'string' && q.hint.trim().length > 0
    ? q.hint.trim()
    : 'Think carefully about the clues and try ruling out options.';

  return {
    questionId: typeof q.questionId === 'string' && q.questionId ? q.questionId : `ai-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    gameId: (q.gameId as GameId) || defaultGameId,
    worldNumber: Number(q.worldNumber) || 1,
    levelNumber: Number(q.levelNumber) || 1,
    difficulty: (q.difficulty as any) || 'medium',
    ageGroup: (q.ageGroup as any) || '10-11',
    questionText: q.questionText.trim(),
    visualPrompt: typeof q.visualPrompt === 'string' ? q.visualPrompt.trim() : undefined,
    visualType: (q.visualType as any) || 'text',
    answerOptions: cleanOptions,
    correctAnswer: correct,
    explanation,
    hint,
  };
}
