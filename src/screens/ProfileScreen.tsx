import React, { useState } from 'react';
import { useGame } from '../context/GameContext.js';
import { BUDDIES } from '../data/gameData.js';
import { MascotAvatar } from '../components/MascotAvatar.js';
import { calculatePlayerLevel } from '../utils/gameRules.js';
import { ChevronLeft } from 'lucide-react';
import { BuddyId } from '../types/game.js';

export const ProfileScreen: React.FC = () => {
  const { profile, updateProfile, badges, navigateTo } = useGame();
  const [showBuddyPicker, setShowBuddyPicker] = useState<boolean>(false);

  const currentBuddy = BUDDIES.find((b) => b.id === profile.selectedBuddy) || BUDDIES[0];
  const levelInfo = calculatePlayerLevel(profile.totalXP);
  const earnedBadgesCount = badges.filter((b) => b.unlocked).length;

  const handleSelectBuddy = (buddyId: BuddyId) => {
    updateProfile({ selectedBuddy: buddyId });
    setShowBuddyPicker(false);
  };

  return (
    <div className="flex flex-col min-h-screen px-5 pt-4 pb-12 max-w-md mx-auto">
      {/* Top Header matching PDF Page 27 */}
      <header className="flex items-center gap-3 mb-4">
        <button
          onClick={() => navigateTo('main')}
          className="w-12 h-12 rounded-[18px] border-2 border-[#26354A] bg-white flex items-center justify-center hover:bg-black/5 active:scale-95 transition-all cursor-pointer shadow-xs"
          aria-label="Back"
        >
          <ChevronLeft className="w-7 h-7 text-[#26354A] stroke-[2.8]" />
        </button>
        <h1 className="text-[24px] font-black text-[#26354A] tracking-tight">
          Profile
        </h1>
      </header>

      {/* Main Avatar & Name */}
      <div className="flex flex-col items-center my-4 text-center">
        <div className="mb-3">
          <MascotAvatar
            buddyId={profile.selectedBuddy}
            size={130}
            showBorder={true}
          />
        </div>

        <h2 className="text-[28px] font-black text-[#26354A] leading-tight">
          {currentBuddy.name}
        </h2>

        {/* Level Pill */}
        <div className="mt-2 inline-flex items-center px-4 py-1.5 rounded-full bg-[#FFEFAF] text-[14px] font-black text-[#26354A] border border-[#26354A]/10">
          {levelInfo.title}
        </div>
      </div>

      {/* 3 Stat Cards matching PDF Page 27 */}
      <div className="grid grid-cols-3 gap-3 my-4">
        {/* Badges */}
        <div className="p-3.5 rounded-[22px] bg-[#D8F5E5] border-2 border-[#26354A] text-center shadow-xs">
          <span className="block text-[28px] font-black text-[#26354A] leading-tight">
            {earnedBadgesCount}
          </span>
          <span className="block text-[13px] font-extrabold text-[#26354A]/80 uppercase mt-0.5">
            Badges
          </span>
        </div>

        {/* XP */}
        <div className="p-3.5 rounded-[22px] bg-[#FFEFAF] border-2 border-[#26354A] text-center shadow-xs">
          <span className="block text-[28px] font-black text-[#26354A] leading-tight">
            {profile.totalXP}
          </span>
          <span className="block text-[13px] font-extrabold text-[#26354A]/80 uppercase mt-0.5">
            XP
          </span>
        </div>

        {/* Age */}
        <div className="p-3.5 rounded-[22px] bg-[#EFEAFF] border-2 border-[#26354A] text-center shadow-xs">
          <span className="block text-[24px] font-black text-[#26354A] leading-tight">
            {profile.ageGroup}
          </span>
          <span className="block text-[13px] font-extrabold text-[#26354A]/80 uppercase mt-0.5">
            Age
          </span>
        </div>
      </div>

      {/* Favourite Game Card */}
      <div className="p-4.5 rounded-[24px] bg-white border-2 border-[#26354A] shadow-xs my-3 text-left">
        <span className="block text-[13px] font-bold text-[#26354A]/70">
          Favourite game
        </span>
        <span className="block text-[20px] font-black text-[#26354A] mt-0.5">
          {profile.favoriteGame}
        </span>
      </div>

      {/* Actions matching PDF Page 27 */}
      <div className="space-y-3 mt-auto pt-6">
        <button
          onClick={() => setShowBuddyPicker(true)}
          className="w-full py-4 bg-white border-2 border-[#26354A] text-[#26354A] font-extrabold text-[17px] rounded-[20px] shadow-xs hover:bg-black/5 active:scale-[0.98] transition-all cursor-pointer"
          aria-label="Change my buddy"
        >
          Change my buddy
        </button>

        <button
          onClick={() => navigateTo('settings-screen')}
          className="w-full py-4 bg-[#26354A] text-white font-extrabold text-[17px] rounded-[20px] shadow-md hover:bg-[#1a2636] active:scale-[0.98] transition-all cursor-pointer"
          aria-label="Settings and accessibility"
        >
          Settings and accessibility
        </button>
      </div>

      {/* Buddy picker drawer/modal */}
      {showBuddyPicker && (
        <div
          className="fixed inset-0 z-50 bg-[#26354A]/60 backdrop-blur-xs flex items-center justify-center p-5"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm bg-[#FFFBF2] rounded-[30px] border-2 border-[#26354A] p-6 shadow-2xl text-center space-y-4 animate-scaleUp">
            <h3 className="text-[22px] font-black text-[#26354A]">
              Choose a New Buddy
            </h3>

            <div className="grid grid-cols-3 gap-3">
              {BUDDIES.map((b) => (
                <button
                  key={b.id}
                  onClick={() => handleSelectBuddy(b.id)}
                  className={`aspect-square rounded-[20px] p-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                    profile.selectedBuddy === b.id
                      ? 'border-[3px] border-[#26354A] shadow-md scale-105'
                      : 'border-2 border-transparent hover:border-[#26354A]/30'
                  }`}
                  style={{ backgroundColor: b.color }}
                  aria-label={`Select ${b.name}`}
                >
                  <MascotAvatar buddyId={b.id} size={50} showBorder={false} />
                  <span className="text-[12px] font-black text-[#26354A] mt-1">
                    {b.name}
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowBuddyPicker(false)}
              className="w-full py-3 bg-[#26354A] text-white font-extrabold text-[15px] rounded-[18px] hover:bg-[#1a2636] cursor-pointer mt-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
