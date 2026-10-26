import React, { useState } from 'react';
import { useGame } from '../context/GameContext.js';
import { TextSize, AgeGroup, ChallengeLevel } from '../types/game.js';
import { ChevronLeft, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { playFanfareSound } from '../utils/audio.js';

export const SettingsScreen: React.FC = () => {
  const { profile, updateProfile, resetGameData, navigateTo } = useGame();
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  const handleToggleSound = () => {
    const nextVal = !profile.soundEnabled;
    updateProfile({ soundEnabled: nextVal });
    if (nextVal) {
      playFanfareSound(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen px-5 pt-4 pb-12 max-w-md mx-auto">
      {/* Top Header matching PDF Page 28 */}
      <header className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigateTo('profile-screen')}
          className="w-12 h-12 rounded-[18px] border-2 border-[#26354A] bg-white flex items-center justify-center hover:bg-black/5 active:scale-95 transition-all cursor-pointer shadow-xs"
          aria-label="Back to Profile"
        >
          <ChevronLeft className="w-7 h-7 text-[#26354A] stroke-[2.8]" />
        </button>
        <h1 className="text-[24px] font-black text-[#26354A] tracking-tight">
          Settings
        </h1>
      </header>

      <div className="space-y-6">
        {/* Text size section matching PDF Page 28 */}
        <section className="space-y-3">
          <label className="block text-[18px] font-black text-[#26354A]">
            Text size
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { id: 'standard' as TextSize, label: 'Aa Standard' },
              { id: 'large' as TextSize, label: 'Aa Large' },
              { id: 'extra-large' as TextSize, label: 'Aa XL' },
            ].map((item) => {
              const isSelected = profile.textSize === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => updateProfile({ textSize: item.id })}
                  className={`py-3.5 px-2 rounded-[20px] font-extrabold text-[14px] border-2 border-[#26354A] transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#FFD45C] text-[#26354A] shadow-xs'
                      : 'bg-white text-[#26354A]'
                  }`}
                  aria-pressed={isSelected}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Sound preferences */}
        <section className="space-y-3">
          <label className="block text-[18px] font-black text-[#26354A]">
            Audio & Sound Effects
          </label>
          <div className="p-4 rounded-[22px] bg-white border-2 border-[#26354A] shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-[14px] bg-[#FFEFAF] border-2 border-[#26354A] flex items-center justify-center">
                {profile.soundEnabled ? (
                  <Volume2 className="w-6 h-6 text-[#26354A]" />
                ) : (
                  <VolumeX className="w-6 h-6 text-[#26354A]/50" />
                )}
              </div>
              <div>
                <span className="block text-[16px] font-black text-[#26354A]">
                  Sound Effects
                </span>
                <span className="block text-[13px] font-semibold text-[#26354A]/70">
                  Chimes, stars & celebration notes
                </span>
              </div>
            </div>

            <button
              onClick={handleToggleSound}
              className={`w-14 h-8 rounded-full border-2 border-[#26354A] p-0.5 transition-colors cursor-pointer ${
                profile.soundEnabled ? 'bg-[#79DDB0]' : 'bg-[#E3E8EE]'
              }`}
              aria-label="Toggle sound"
            >
              <div
                className={`w-6 h-6 rounded-full bg-white border-2 border-[#26354A] transition-transform ${
                  profile.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </section>

        {/* Age group preference */}
        <section className="space-y-3">
          <label className="block text-[18px] font-black text-[#26354A]">
            Age group
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {(['8–9', '10–11', '12–14'] as const).map((label) => {
              const val: AgeGroup = label === '8–9' ? '8-9' : label === '10–11' ? '10-11' : '12-14';
              const isSelected = profile.ageGroup === val;
              return (
                <button
                  key={val}
                  onClick={() => updateProfile({ ageGroup: val })}
                  className={`py-3 rounded-[18px] text-[17px] font-extrabold border-2 border-[#26354A] transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#79DDB0] text-[#26354A] shadow-xs'
                      : 'bg-white text-[#26354A]'
                  }`}
                  aria-pressed={isSelected}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Challenge level */}
        <section className="space-y-3">
          <label className="block text-[18px] font-black text-[#26354A]">
            Challenge level
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {(['easy', 'medium', 'hard'] as const).map((lvl) => {
              const isSelected = profile.difficulty === lvl;
              return (
                <button
                  key={lvl}
                  onClick={() => updateProfile({ difficulty: lvl })}
                  className={`py-3 rounded-[18px] text-[16px] font-extrabold capitalize border-2 border-[#26354A] transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#FF8178] text-[#26354A] shadow-xs'
                      : 'bg-white text-[#26354A]'
                  }`}
                  aria-pressed={isSelected}
                >
                  {lvl}
                </button>
              );
            })}
          </div>
        </section>

        {/* Reset progress action */}
        <section className="pt-4 border-t-2 border-[#26354A]/10">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full py-4 bg-white border-2 border-[#FF8178] text-[#FF8178] font-black text-[16px] rounded-[20px] hover:bg-[#FFE8E6] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" /> Reset Game Data
          </button>
        </section>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div
          className="fixed inset-0 z-50 bg-[#26354A]/70 backdrop-blur-xs flex items-center justify-center p-5"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm bg-[#FFFBF2] rounded-[28px] border-2 border-[#26354A] p-6 shadow-2xl text-center space-y-4 animate-scaleUp">
            <h3 className="text-[22px] font-black text-[#26354A]">
              Reset All Progress?
            </h3>
            <p className="text-[14px] font-bold text-[#26354A]/80 leading-snug">
              This will clear your stars, XP, badges, and learning history so you can replay onboarding from scratch.
            </p>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => {
                  setShowResetConfirm(false);
                  resetGameData();
                }}
                className="w-full py-3.5 bg-[#FF8178] text-[#26354A] font-black text-[16px] rounded-[18px] border-2 border-[#26354A] cursor-pointer"
              >
                Yes, Reset Everything
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="w-full py-3.5 bg-white text-[#26354A] font-extrabold text-[16px] rounded-[18px] border-2 border-[#26354A] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
