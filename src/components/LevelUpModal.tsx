import React from 'react';
import { useGame } from '../context/GameContext.js';
import { calculatePlayerLevel } from '../utils/gameRules.js';

export const LevelUpModal: React.FC = () => {
  const { profile, newBadgeUnlocked, navigateTo, updateProfile } = useGame();
  const levelInfo = calculatePlayerLevel(profile.totalXP);

  const handleKeepPlaying = () => {
    // Dismiss modal by clearing flag
    const modalEl = document.getElementById('level-up-dialog');
    if (modalEl) modalEl.style.display = 'none';
  };

  const handleViewBadges = () => {
    handleKeepPlaying();
    navigateTo('badges-modal');
  };

  return (
    <div
      id="level-up-dialog"
      className="fixed inset-0 z-50 bg-[#26354A]/80 backdrop-blur-xs flex items-center justify-center p-5"
      role="dialog"
      aria-modal="true"
      aria-label="Level up notification"
    >
      <div className="relative w-full max-w-sm bg-[#FFD45C] rounded-[32px] border-2 border-[#26354A] p-7 shadow-2xl text-center space-y-5 animate-scaleUp overflow-hidden">
        {/* Playful confetti dots */}
        <div className="absolute top-4 left-6 w-4 h-4 rounded-full bg-[#FF8178]" />
        <div className="absolute top-8 right-8 w-3 h-3 rounded-full bg-[#56B7F5]" />
        <div className="absolute bottom-12 left-8 w-3 h-3 rounded-full bg-[#79DDB0]" />
        <div className="absolute bottom-8 right-6 w-4 h-4 rounded-full bg-[#FF8178]" />

        {/* Central Level Badge Circle matching PDF Page 30 */}
        <div className="w-28 h-28 mx-auto rounded-full bg-white border-2 border-[#26354A] flex flex-col items-center justify-center shadow-xs">
          <span className="text-[12px] font-black text-[#26354A]/70 uppercase tracking-widest">
            LEVEL
          </span>
          <span className="text-[44px] font-black text-[#26354A] leading-none">
            {levelInfo.level}
          </span>
        </div>

        <div>
          <h2 className="text-[32px] font-black text-[#26354A] leading-tight">
            Level up!
          </h2>
          <p className="text-[16px] font-extrabold text-[#26354A] mt-1">
            You are now a {levelInfo.title}
          </p>
        </div>

        {/* Badge unlock card */}
        <div className="p-4 rounded-[22px] bg-white border-2 border-[#26354A] shadow-xs flex items-center gap-3 text-left">
          <div className="w-12 h-12 rounded-[14px] bg-[#79DDB0] border-2 border-[#26354A] flex items-center justify-center text-[22px] font-black text-[#26354A] shrink-0">
            {newBadgeUnlocked?.icon || '◈'}
          </div>
          <div>
            <span className="block text-[11px] font-black text-[#26354A]/70 uppercase tracking-wider">
              NEW BADGE
            </span>
            <span className="block text-[17px] font-black text-[#26354A] leading-tight">
              {newBadgeUnlocked?.name || 'Space Cadet'}
            </span>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <button
            onClick={handleKeepPlaying}
            className="w-full py-4.5 bg-[#26354A] text-white font-extrabold text-[18px] rounded-[20px] shadow-sm hover:bg-[#1a2636] active:scale-[0.98] transition-all cursor-pointer"
            aria-label="Keep playing"
          >
            Keep playing
          </button>

          <button
            onClick={handleViewBadges}
            className="text-[16px] font-extrabold text-[#26354A] underline underline-offset-4 hover:opacity-75 cursor-pointer py-1 px-3"
            aria-label="View my badges"
          >
            View my badges
          </button>
        </div>
      </div>
    </div>
  );
};
