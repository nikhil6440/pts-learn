import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateStars,
  calculateXP,
  calculatePlayerLevel,
  checkBadgeUnlocks,
  isWorldUnlocked,
  validateGeminiQuestion,
} from './gameRules.js';

test('calculateStars awards correct stars according to PRD rule', () => {
  // PRD: 3 correct answers: 3 stars. 2 correct answers: 2 stars. 0–1 correct answers: 1 star.
  assert.equal(calculateStars(3, 3), 3);
  assert.equal(calculateStars(2, 3), 2);
  assert.equal(calculateStars(1, 3), 1);
  assert.equal(calculateStars(0, 3), 1);
});

test('calculateXP handles first time completion and difficulty multipliers', () => {
  // Easy: 100 * 1.0 = 100
  assert.equal(calculateXP(3, 'easy', true), 100);
  // Medium: 100 * 1.2 = 120
  assert.equal(calculateXP(3, 'medium', true), 120);
  // Hard: 100 * 1.4 = 140
  assert.equal(calculateXP(3, 'hard', true), 140);

  // Partial score on medium: 70 * 1.2 = 84 -> round to 80
  assert.equal(calculateXP(2, 'medium', true), 80);

  // Repeat completions receive reduced practice XP to prevent abuse
  const replayXP = calculateXP(3, 'easy', false);
  assert.ok(replayXP < 100 && replayXP >= 20);
});

test('calculatePlayerLevel correctly classifies XP bands and level 5 Explorer', () => {
  // 240 XP should be Level 5 Explorer (matching PDF reference page 6 & 23)
  const lvl5 = calculatePlayerLevel(240);
  assert.equal(lvl5.level, 5);
  assert.ok(lvl5.title.includes('Explorer'));
  assert.equal(lvl5.nextLevelXP, 300);

  const lvl1 = calculatePlayerLevel(40);
  assert.equal(lvl1.level, 1);
});

test('checkBadgeUnlocks evaluates requirements accurately', () => {
  const initialBadges = checkBadgeUnlocks({
    totalCompletedGames: 1,
    totalStars: 3,
    currentStreak: 1,
    mathCompleted: 1,
    scienceCompleted: 0,
    brainCompleted: 0,
    perfectScoresCount: 1,
  });
  assert.deepEqual(initialBadges, ['first-steps']);

  const advancedBadges = checkBadgeUnlocks({
    totalCompletedGames: 18,
    totalStars: 27,
    currentStreak: 5,
    mathCompleted: 4,
    scienceCompleted: 3,
    brainCompleted: 3,
    perfectScoresCount: 4,
  });
  // Should unlock first-steps, number-ninja, star-scout, pattern-pro, streak-5, quiz-whiz, space-cadet, brainiac
  assert.ok(advancedBadges.includes('first-steps'));
  assert.ok(advancedBadges.includes('number-ninja'));
  assert.ok(advancedBadges.includes('star-scout'));
  assert.ok(advancedBadges.includes('streak-5'));
  assert.ok(advancedBadges.includes('quiz-whiz'));
  assert.ok(advancedBadges.includes('space-cadet'));
  assert.ok(advancedBadges.includes('brainiac'));
});

test('isWorldUnlocked unlocks world 1 always and subsequent worlds upon progress', () => {
  assert.equal(isWorldUnlocked(1, [1], 0), true);
  // World 2 with 0 levels completed in world 1: locked
  assert.equal(isWorldUnlocked(2, [1], 0, 4), false);
  // World 2 with 2 levels completed in world 1 (50%): unlocked
  assert.equal(isWorldUnlocked(2, [1], 2, 4), true);
  // World 2 already in unlocked list: unlocked
  assert.equal(isWorldUnlocked(2, [1, 2], 0, 4), true);
});

test('validateGeminiQuestion rejects malformed data and accepts valid data', () => {
  // Missing correct answer in options
  const invalid1 = validateGeminiQuestion({
    questionText: 'What is 7 x 8?',
    answerOptions: ['54', '56', '58', '64'],
    correctAnswer: '57', // Not in choices
  });
  assert.equal(invalid1, null);

  // Missing options
  const invalid2 = validateGeminiQuestion({
    questionText: 'Test',
    answerOptions: ['1', '2'],
    correctAnswer: '1',
  });
  assert.equal(invalid2, null);

  // Valid question
  const valid = validateGeminiQuestion({
    questionText: 'What is 7 x 8?',
    visualPrompt: '7 x 8 = ?',
    visualType: 'equation',
    answerOptions: ['54', '56', '58', '64'],
    correctAnswer: '56',
    explanation: '7 x 8 = 56. Double 7 x 4 = 28 to check.',
    hint: 'Think of 7 x 7 = 49 and add one more 7.',
  });
  assert.ok(valid !== null);
  assert.equal(valid?.correctAnswer, '56');
  assert.equal(valid?.answerOptions.length, 4);
});
