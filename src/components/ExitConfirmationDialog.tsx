import React from 'react';
import { useGame } from '../context/GameContext.js';
import { MascotAvatar } from './MascotAvatar.js';

export const ExitConfirmationDialog: React.FC = () => {
  const {
    currentScore,
    currentQuestionIndex,
    activeQuestions,
    cancelExitGame,
    exitGame,
    profile,
  } = useGame();

  const totalQ = activeQuestions.length || 3;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#26354A]/80 backdrop-blur-xs flex items-center justify-center p-5"
      role="dialog"
      aria-modal="true"
      aria-label="Confirm exit game"
    >
      <div className="w-full max-w-sm bg-[#FFFBF2] rounded-[28px] border-2 border-[#26354A] p-6 shadow-2xl text-center space-y-5 animate-scaleUp">
        {/* Sad mascot matching PDF Page 31 */}
        <div className="flex justify-center pt-2">
          <MascotAvatar
            buddyId={profile.selectedBuddy}
            size={90}
            showBorder={true}
            expression="sad"
          />
        </div>

        <div>
          <h2 className="text-[26px] font-black text-[#26354A]">
            Leave this game?
          </h2>
          <p className="text-[15px] font-semibold text-[#26354A]/80 mt-1 leading-snug">
            If you exit now, your progress in this level will not be saved.
          </p>
        </div>

        {/* Stats pills */}
        <div className="flex items-center justify-center gap-2.5">
          <span className="px-4 py-1.5 rounded-full bg-[#FFEFAF] text-[13px] font-black text-[#26354A] border border-[#26354A]/10">
            Score {currentScore}
          </span>
          <span className="px-4 py-1.5 rounded-full bg-[#DCE7F2] text-[13px] font-black text-[#26354A] border border-[#26354A]/10">
            Question {currentQuestionIndex + 1} of {totalQ}
          </span>
        </div>

        <div className="space-y-3 pt-2">
          {/* Keep playing */}
          <button
            onClick={cancelExitGame}
            className="w-full py-4 bg-[#FFD45C] text-[#26354A] font-extrabold text-[18px] rounded-[20px] border-2 border-[#26354A] shadow-sm hover:bg-[#ffe38a] active:scale-[0.98] transition-all cursor-pointer"
            aria-label="Keep playing"
          >
            Keep playing
          </button>

          {/* Exit game */}
          <button
            onClick={exitGame}
            className="w-full py-4 bg-white text-[#26354A] font-extrabold text-[18px] rounded-[20px] border-2 border-[#26354A] shadow-xs hover:bg-black/5 active:scale-[0.98] transition-all cursor-pointer"
            aria-label="Exit game now"
          >
            Exit game
          </button>
        </div>
      </div>
    </div>
  );
};
