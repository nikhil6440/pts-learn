import React from 'react';
import { useGame } from '../context/GameContext.js';
import { GAMES } from '../data/gameData.js';
import { GameIcon } from '../components/GameIcon.js';
import { Star } from 'lucide-react';
import { LevelUpModal } from '../components/LevelUpModal.js';

export const ResultsScreen: React.FC = () => {
  const {
    activeGameId,
    activeWorldNumber,
    activeLevelNumber,
    lastResults,
    showLevelUpModal,
    navigateTo,
    startLevel,
    setCurrentTab,
  } = useGame();

  const currentGame = GAMES.find((g) => g.id === activeGameId) || GAMES[0];
  const results = lastResults || {
    correctCount: 2,
    totalCount: 3,
    stars: 2,
    xpEarned: 100,
    isFirstTime: false,
  };

  const handlePlayAgain = () => {
    startLevel(activeGameId, activeWorldNumber, activeLevelNumber);
  };

  const handleBackToLevels = () => {
    navigateTo('level-select');
  };

  const handleGoHome = () => {
    setCurrentTab('home');
  };

  return (
    <div className="relative flex flex-col justify-between min-h-screen px-6 pt-12 pb-8 max-w-md mx-auto text-center">
      <div className="flex flex-col items-center flex-1 my-auto">
        {/* Game Badge Circle matching PDF Pages 16, 19, 22 */}
        <div
          className="w-28 h-28 rounded-full border-[3px] border-[#26354A] flex items-center justify-center text-[52px] font-black shadow-sm mb-6 animate-bounceOnce"
          style={{ backgroundColor: currentGame.primaryColor }}
        >
          <GameIcon gameId={activeGameId} size={54} />
        </div>

        {/* Heading */}
        <h1 className="text-[36px] font-black text-[#26354A] tracking-tight mb-4">
          Well played!
        </h1>

        {/* 3 Stars */}
        <div className="flex items-center justify-center gap-3 mb-4">
          {[1, 2, 3].map((starIdx) => {
            const isEarned = starIdx <= results.stars;
            return (
              <div
                key={starIdx}
                className="transition-transform duration-300 hover:scale-110"
              >
                <Star
                  className={`w-12 h-12 stroke-[2.2] ${
                    isEarned
                      ? 'fill-[#FFD45C] text-[#26354A]'
                      : 'fill-transparent text-[#26354A]/30'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Score text */}
        <p className="text-[20px] font-extrabold text-[#26354A] mb-6">
          You got {results.correctCount} of {results.totalCount} right
        </p>

        {/* Reward Pills */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="px-5 py-2.5 rounded-full bg-white border-2 border-[#26354A]/15 text-[15px] font-black text-[#26354A] shadow-xs">
            +{results.xpEarned} XP
          </span>
          <span className="px-5 py-2.5 rounded-full bg-white border-2 border-[#26354A]/15 text-[15px] font-black text-[#26354A] shadow-xs">
            Level {activeLevelNumber} done
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full space-y-3 mt-auto">
        <button
          onClick={handlePlayAgain}
          className="w-full py-4.5 bg-[#26354A] text-white font-extrabold text-[18px] rounded-[20px] shadow-md hover:bg-[#1a2636] active:scale-[0.98] transition-all cursor-pointer"
          aria-label="Play again"
        >
          Play again
        </button>

        <button
          onClick={handleBackToLevels}
          className="w-full py-4.5 bg-white border-2 border-[#26354A] text-[#26354A] font-extrabold text-[18px] rounded-[20px] shadow-xs hover:bg-black/5 active:scale-[0.98] transition-all cursor-pointer"
          aria-label="Back to levels"
        >
          Back to levels
        </button>

        <div className="pt-2">
          <button
            onClick={handleGoHome}
            className="text-[17px] font-extrabold text-[#26354A] underline underline-offset-4 hover:opacity-80 cursor-pointer py-1 px-3"
            aria-label="Home"
          >
            Home
          </button>
        </div>
      </div>

      {showLevelUpModal && <LevelUpModal />}
    </div>
  );
};
