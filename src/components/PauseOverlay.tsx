import React from 'react';
import { useGame } from '../context/GameContext.js';
import { GAMES } from '../data/gameData.js';

export const PauseOverlay: React.FC = () => {
  const {
    activeGameId,
    currentQuestionIndex,
    activeQuestions,
    currentScore,
    resumeGame,
    restartLevel,
    promptExitGame,
    navigateTo,
  } = useGame();

  const currentGame = GAMES.find((g) => g.id === activeGameId) || GAMES[0];
  const totalQ = activeQuestions.length || 3;
  const progressPercent = Math.min(100, Math.round(((currentQuestionIndex + 1) / totalQ) * 100));

  const handleOpenSettings = () => {
    resumeGame();
    navigateTo('settings-screen');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#26354A]/70 backdrop-blur-xs flex items-center justify-center p-5"
      role="dialog"
      aria-modal="true"
      aria-label="Pause menu"
    >
      <div className="w-full max-w-sm bg-[#FFFBF2] rounded-[28px] border-2 border-[#26354A] p-6 shadow-2xl text-center space-y-5 animate-scaleUp">
        <h2 className="text-[28px] font-black text-[#26354A]">
          Paused
        </h2>

        <div className="space-y-2">
          <p className="text-[14px] font-bold text-[#26354A]/80">
            {currentGame.name} · Question {currentQuestionIndex + 1} of {totalQ} · Score {currentScore}
          </p>

          <div className="w-full h-2.5 rounded-full bg-[#E5E9F0] overflow-hidden">
            <div
              className="h-full bg-[#56B7F5] rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {/* Resume button matching PDF Page 29 */}
          <button
            onClick={resumeGame}
            className="w-full py-4 bg-[#FFD45C] text-[#26354A] font-extrabold text-[18px] rounded-[20px] border-2 border-[#26354A] shadow-sm hover:bg-[#ffe38a] active:scale-[0.98] transition-all cursor-pointer"
            aria-label="Resume game"
          >
            Resume
          </button>

          {/* Restart level */}
          <button
            onClick={restartLevel}
            className="w-full py-4 bg-white text-[#26354A] font-extrabold text-[18px] rounded-[20px] border-2 border-[#26354A] shadow-xs hover:bg-black/5 active:scale-[0.98] transition-all cursor-pointer"
            aria-label="Restart level"
          >
            Restart level
          </button>

          {/* Settings */}
          <button
            onClick={handleOpenSettings}
            className="w-full py-4 bg-white text-[#26354A] font-extrabold text-[18px] rounded-[20px] border-2 border-[#26354A] shadow-xs hover:bg-black/5 active:scale-[0.98] transition-all cursor-pointer"
            aria-label="Settings"
          >
            Settings
          </button>

          {/* Exit game */}
          <div className="pt-2">
            <button
              onClick={promptExitGame}
              className="text-[16px] font-extrabold text-[#26354A] underline underline-offset-4 hover:opacity-75 cursor-pointer py-1 px-3"
              aria-label="Exit game"
            >
              Exit game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
