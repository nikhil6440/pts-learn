import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PlayerProfile,
  GameProgress,
  Badge,
  DailyQuest,
  QuizSession,
  QuizQuestion,
  GameId,
  BuddyId,
  AgeGroup,
  ChallengeLevel,
} from '../types/game.js';
import {
  loadProfile,
  saveProfile,
  loadProgress,
  saveProgress,
  loadBadges,
  saveBadges,
  loadQuests,
  saveQuests,
  loadSessions,
  saveSessions,
  resetAllStorage,
  DEFAULT_PROFILE,
  DEFAULT_PROGRESS,
} from '../utils/storage.js';
import {
  calculateStars,
  calculateXP,
  calculatePlayerLevel,
  checkBadgeUnlocks,
} from '../utils/gameRules.js';
import {
  playTapSound,
  playCorrectSound,
  playIncorrectSound,
  playFanfareSound,
} from '../utils/audio.js';
import { getFallbackQuestionsForLevel } from '../data/questionBank.js';
import { GAMES, BUDDIES } from '../data/gameData.js';

export type TabType = 'home' | 'games' | 'rewards' | 'progress';
export type ScreenType =
  | 'onboarding'
  | 'main'
  | 'world-select'
  | 'level-select'
  | 'gameplay'
  | 'results'
  | 'badges-modal'
  | 'history-modal'
  | 'profile-screen'
  | 'settings-screen';

interface GameContextType {
  profile: PlayerProfile;
  progress: Record<GameId, GameProgress>;
  badges: Badge[];
  quests: DailyQuest[];
  sessions: QuizSession[];
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  currentScreen: ScreenType;
  navigateTo: (screen: ScreenType) => void;
  activeGameId: GameId;
  setActiveGameId: (id: GameId) => void;
  activeWorldNumber: number;
  setActiveWorldNumber: (num: number) => void;
  activeLevelNumber: number;
  setActiveLevelNumber: (num: number) => void;
  // Gameplay State
  activeQuestions: QuizQuestion[];
  currentQuestionIndex: number;
  selectedOption: string | null;
  isSubmitted: boolean;
  isCorrect: boolean | null;
  currentScore: number;
  isPaused: boolean;
  showExitDialog: boolean;
  showLevelUpModal: boolean;
  newBadgeUnlocked: Badge | null;
  hintOpen: boolean;
  isLoadingAI: boolean;
  questionSource: 'ai' | 'fallback';
  lastResults: {
    correctCount: number;
    totalCount: number;
    stars: number;
    xpEarned: number;
    isFirstTime: boolean;
  } | null;
  // Handlers
  updateProfile: (partial: Partial<PlayerProfile>) => void;
  startLevel: (gameId: GameId, worldNum: number, levelNum: number) => Promise<void>;
  selectOption: (opt: string) => void;
  checkAnswer: () => void;
  nextQuestion: () => void;
  toggleHint: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  promptExitGame: () => void;
  cancelExitGame: () => void;
  exitGame: () => void;
  restartLevel: () => void;
  claimLevelReward: (levelNum: number) => void;
  claimQuestReward: (questId: string) => void;
  resetGameData: () => void;
  completeOnboarding: (buddy: BuddyId, age: AgeGroup, difficulty: ChallengeLevel) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<PlayerProfile>(loadProfile);
  const [progress, setProgress] = useState<Record<GameId, GameProgress>>(loadProgress);
  const [badges, setBadges] = useState<Badge[]>(loadBadges);
  const [quests, setQuests] = useState<DailyQuest[]>(loadQuests);
  const [sessions, setSessions] = useState<QuizSession[]>(loadSessions);

  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [currentScreen, setCurrentScreen] = useState<ScreenType>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') return 'main';
      if (params.get('reset') === '1') {
        resetAllStorage();
        return 'onboarding';
      }
    }
    return profile.onboardingCompleted ? 'main' : 'onboarding';
  });

  const [activeGameId, setActiveGameId] = useState<GameId>('math-quest');
  const [activeWorldNumber, setActiveWorldNumber] = useState<number>(1);
  const [activeLevelNumber, setActiveLevelNumber] = useState<number>(4);

  // Gameplay state
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showExitDialog, setShowExitDialog] = useState<boolean>(false);
  const [showLevelUpModal, setShowLevelUpModal] = useState<boolean>(false);
  const [newBadgeUnlocked, setNewBadgeUnlocked] = useState<Badge | null>(null);
  const [hintOpen, setHintOpen] = useState<boolean>(false);
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);
  const [questionSource, setQuestionSource] = useState<'ai' | 'fallback'>('fallback');
  const [lastResults, setLastResults] = useState<{
    correctCount: number;
    totalCount: number;
    stars: number;
    xpEarned: number;
    isFirstTime: boolean;
  } | null>(null);

  // Sync to persistence
  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  useEffect(() => {
    saveBadges(badges);
  }, [badges]);

  useEffect(() => {
    saveQuests(quests);
  }, [quests]);

  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  const updateProfile = (partial: Partial<PlayerProfile>) => {
    setProfile((prev) => ({ ...prev, ...partial }));
  };

  const navigateTo = (screen: ScreenType) => {
    playTapSound(profile.soundEnabled);
    setCurrentScreen(screen);
  };

  const startLevel = async (gameId: GameId, worldNum: number, levelNum: number) => {
    playTapSound(profile.soundEnabled);
    setActiveGameId(gameId);
    setActiveWorldNumber(worldNum);
    setActiveLevelNumber(levelNum);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setIsCorrect(null);
    setCurrentScore(0);
    setIsPaused(false);
    setShowExitDialog(false);
    setHintOpen(false);

    // Initial default questions for instantaneous transition
    const fallback = getFallbackQuestionsForLevel(
      gameId,
      worldNum,
      levelNum,
      profile.ageGroup,
      profile.difficulty
    );
    setActiveQuestions(fallback);
    setQuestionSource('fallback');
    setCurrentScreen('gameplay');

    const game = GAMES.find((g) => g.id === gameId);
    const world = game?.worlds.find((w) => w.worldNumber === worldNum);
    const worldTitle = world?.title || 'World ' + worldNum;

    // Asynchronously try fetching AI-generated questions with 3s timeout
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const resp = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId,
          worldTitle,
          worldNumber: worldNum,
          levelNumber: levelNum,
          ageGroup: profile.ageGroup,
          difficulty: profile.difficulty,
          count: 3,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (resp.ok) {
        const data = await resp.json();
        if (data.questions && data.questions.length >= 3) {
          setActiveQuestions(data.questions.slice(0, 3));
          setQuestionSource(data.source || 'ai');
        }
      }
    } catch {
      // Quietly use local fallback without disruption
    } finally {
      setIsLoadingAI(false);
    }
  };

  const selectOption = (opt: string) => {
    if (isSubmitted) return;
    playTapSound(profile.soundEnabled);
    setSelectedOption(opt);
  };

  const checkAnswer = () => {
    if (!selectedOption || isSubmitted) return;
    const currentQ = activeQuestions[currentQuestionIndex];
    if (!currentQ) return;

    const correct = selectedOption === currentQ.correctAnswer;
    setIsCorrect(correct);
    setIsSubmitted(true);

    if (correct) {
      playCorrectSound(profile.soundEnabled);
      setCurrentScore((prev) => prev + 1);
    } else {
      playIncorrectSound(profile.soundEnabled);
    }
  };

  const nextQuestion = () => {
    playTapSound(profile.soundEnabled);
    const nextIdx = currentQuestionIndex + 1;

    if (nextIdx < activeQuestions.length) {
      setCurrentQuestionIndex(nextIdx);
      setSelectedOption(null);
      setIsSubmitted(false);
      setIsCorrect(null);
      setHintOpen(false);
    } else {
      // Completed all 3 questions!
      finishLevel();
    }
  };

  const finishLevel = () => {
    const finalScore = currentScore;
    const totalQ = activeQuestions.length || 3;
    const stars = calculateStars(finalScore, totalQ);
    const levelKey = `${activeWorldNumber}-${activeLevelNumber}`;
    const gameProg = progress[activeGameId];
    const prevScore = gameProg?.completedLevels[levelKey];
    const isFirstTime = !prevScore;

    const xpEarned = calculateXP(finalScore, profile.difficulty, isFirstTime);

    // Save session
    const newSession: QuizSession = {
      sessionId: `sess-${Date.now()}`,
      gameId: activeGameId,
      worldNumber: activeWorldNumber,
      levelNumber: activeLevelNumber,
      answers: [],
      correctCount: finalScore,
      starsEarned: stars,
      xpEarned,
      durationSeconds: 180,
      completedAt: 'Just now · 3 min',
    };

    setSessions((prev) => [newSession, ...prev]);

    // Update level progress
    setProgress((prev) => {
      const g = prev[activeGameId] || {
        gameId: activeGameId,
        currentWorld: activeWorldNumber,
        currentLevel: activeLevelNumber,
        unlockedWorlds: [1],
        completedLevels: {},
      };

      const updatedCompleted = {
        ...g.completedLevels,
        [levelKey]: {
          stars: Math.max(prevScore?.stars || 0, stars),
          score: Math.max(prevScore?.score || 0, finalScore),
          completedAt: new Date().toISOString().split('T')[0],
        },
      };

      // Check if unlocking next world
      const completedCountInWorld = Object.keys(updatedCompleted).filter((k) =>
        k.startsWith(`${activeWorldNumber}-`)
      ).length;

      const unlockedWorlds = [...g.unlockedWorlds];
      if (completedCountInWorld >= 2 && !unlockedWorlds.includes(activeWorldNumber + 1)) {
        unlockedWorlds.push(activeWorldNumber + 1);
      }

      return {
        ...prev,
        [activeGameId]: {
          ...g,
          currentLevel: Math.max(g.currentLevel, activeLevelNumber + 1),
          unlockedWorlds,
          completedLevels: updatedCompleted,
        },
      };
    });

    // Update player XP & streak
    const previousLevelObj = calculatePlayerLevel(profile.totalXP);
    const newTotalXP = profile.totalXP + xpEarned;
    const newLevelObj = calculatePlayerLevel(newTotalXP);

    setProfile((prev) => ({
      ...prev,
      totalXP: newTotalXP,
      playerLevel: newLevelObj.level,
      lastPlayedDate: new Date().toISOString(),
    }));

    // Update daily quests
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === 'quest-finish-2-games') {
          const updated = q.currentProgress + 1;
          return {
            ...q,
            currentProgress: updated,
            completed: updated >= q.target,
          };
        }
        if (q.id === 'quest-score-3-stars' && stars === 3) {
          const updated = q.currentProgress + 1;
          return {
            ...q,
            currentProgress: updated,
            completed: updated >= q.target,
          };
        }
        return q;
      })
    );

    // Evaluate badge unlock conditions
    const totalCompleted = sessions.length + 1;
    const totalStars = Object.values(progress).reduce(
      (acc, g) =>
        acc +
        Object.values(g.completedLevels).reduce((starSum, lvl) => starSum + lvl.stars, 0),
      stars
    );
    const mathCompleted =
      Object.keys(progress['math-quest']?.completedLevels || {}).length +
      (activeGameId === 'math-quest' && isFirstTime ? 1 : 0);
    const scienceCompleted =
      Object.keys(progress['science-explorer']?.completedLevels || {}).length +
      (activeGameId === 'science-explorer' && isFirstTime ? 1 : 0);
    const brainCompleted =
      Object.keys(progress['brain-trails']?.completedLevels || {}).length +
      (activeGameId === 'brain-trails' && isFirstTime ? 1 : 0);

    const unlockedBadgeIds = checkBadgeUnlocks({
      totalCompletedGames: totalCompleted,
      totalStars,
      currentStreak: profile.currentStreak,
      mathCompleted,
      scienceCompleted,
      brainCompleted,
      perfectScoresCount: (finalScore === 3 ? 1 : 0) + sessions.filter((s) => s.correctCount === 3).length,
    });

    let newlyUnlockedBadge: Badge | null = null;
    setBadges((prev) =>
      prev.map((b) => {
        if (!b.unlocked && unlockedBadgeIds.includes(b.id)) {
          newlyUnlockedBadge = { ...b, unlocked: true, unlockedAt: 'Just now' };
          return newlyUnlockedBadge;
        }
        return b;
      })
    );

    setLastResults({
      correctCount: finalScore,
      totalCount: totalQ,
      stars,
      xpEarned,
      isFirstTime,
    });

    playFanfareSound(profile.soundEnabled);

    // Check if player leveled up
    if (newLevelObj.level > previousLevelObj.level) {
      setNewBadgeUnlocked(newlyUnlockedBadge);
      setShowLevelUpModal(true);
    }

    setCurrentScreen('results');
  };

  const toggleHint = () => {
    playTapSound(profile.soundEnabled);
    setHintOpen((prev) => !prev);
  };

  const pauseGame = () => {
    playTapSound(profile.soundEnabled);
    setIsPaused(true);
  };

  const resumeGame = () => {
    playTapSound(profile.soundEnabled);
    setIsPaused(false);
  };

  const promptExitGame = () => {
    playTapSound(profile.soundEnabled);
    setShowExitDialog(true);
  };

  const cancelExitGame = () => {
    playTapSound(profile.soundEnabled);
    setShowExitDialog(false);
    setIsPaused(false);
  };

  const exitGame = () => {
    playTapSound(profile.soundEnabled);
    setShowExitDialog(false);
    setIsPaused(false);
    setCurrentScreen('level-select');
  };

  const restartLevel = () => {
    playTapSound(profile.soundEnabled);
    setIsPaused(false);
    setShowExitDialog(false);
    startLevel(activeGameId, activeWorldNumber, activeLevelNumber);
  };

  const claimLevelReward = (levelNum: number) => {
    playFanfareSound(profile.soundEnabled);
    setProfile((prev) => ({
      ...prev,
      totalXP: prev.totalXP + 50,
      claimedLevelRewards: [...prev.claimedLevelRewards, levelNum],
    }));
  };

  const claimQuestReward = (questId: string) => {
    playFanfareSound(profile.soundEnabled);
    const targetQuest = quests.find((q) => q.id === questId);
    if (!targetQuest || targetQuest.claimed) return;

    setProfile((prev) => ({
      ...prev,
      totalXP: prev.totalXP + targetQuest.xpReward,
    }));

    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, claimed: true } : q))
    );
  };

  const resetGameData = () => {
    resetAllStorage();
    setProfile({ ...DEFAULT_PROFILE, onboardingCompleted: false });
    setProgress(DEFAULT_PROGRESS);
    setSessions([]);
    setCurrentScreen('onboarding');
  };

  const completeOnboarding = (
    buddy: BuddyId,
    age: AgeGroup,
    difficulty: ChallengeLevel
  ) => {
    playFanfareSound(profile.soundEnabled);
    setProfile((prev) => ({
      ...prev,
      selectedBuddy: buddy,
      ageGroup: age,
      difficulty,
      onboardingCompleted: true,
    }));
    setCurrentScreen('main');
    setCurrentTab('home');
  };

  return (
    <GameContext.Provider
      value={{
        profile,
        progress,
        badges,
        quests,
        sessions,
        currentTab,
        setCurrentTab: (tab) => {
          playTapSound(profile.soundEnabled);
          setCurrentTab(tab);
          setCurrentScreen('main');
        },
        currentScreen,
        navigateTo,
        activeGameId,
        setActiveGameId,
        activeWorldNumber,
        setActiveWorldNumber,
        activeLevelNumber,
        setActiveLevelNumber,
        activeQuestions,
        currentQuestionIndex,
        selectedOption,
        isSubmitted,
        isCorrect,
        currentScore,
        isPaused,
        showExitDialog,
        showLevelUpModal,
        newBadgeUnlocked,
        hintOpen,
        isLoadingAI,
        questionSource,
        lastResults,
        updateProfile,
        startLevel,
        selectOption,
        checkAnswer,
        nextQuestion,
        toggleHint,
        pauseGame,
        resumeGame,
        promptExitGame,
        cancelExitGame,
        exitGame,
        restartLevel,
        claimLevelReward,
        claimQuestReward,
        resetGameData,
        completeOnboarding,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
