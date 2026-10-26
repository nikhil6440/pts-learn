import React, { useState } from 'react';
import { useGame } from '../context/GameContext.js';
import { ChevronLeft, Lock } from 'lucide-react';
import { Badge } from '../types/game.js';

export const BadgesScreen: React.FC = () => {
  const { badges, navigateTo } = useGame();
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const earnedCount = badges.filter((b) => b.unlocked).length;
  const toUnlockCount = badges.length - earnedCount;

  return (
    <div className="flex flex-col min-h-screen px-5 pt-4 pb-12 max-w-md mx-auto">
      {/* Top Header matching PDF Page 24 */}
      <header className="flex items-center gap-3 mb-4">
        <button
          onClick={() => navigateTo('main')}
          className="w-12 h-12 rounded-[18px] border-2 border-[#26354A] bg-white flex items-center justify-center hover:bg-black/5 active:scale-95 transition-all cursor-pointer shadow-xs"
          aria-label="Back to Rewards"
        >
          <ChevronLeft className="w-7 h-7 text-[#26354A] stroke-[2.8]" />
        </button>
        <h1 className="text-[24px] font-black text-[#26354A] tracking-tight">
          Badges
        </h1>
      </header>

      {/* Summary Pills */}
      <div className="flex items-center gap-3 mb-8">
        <span className="px-4 py-1.5 rounded-full bg-[#FFEFAF] text-[13px] font-extrabold text-[#26354A] border border-[#26354A]/10">
          {earnedCount} earned
        </span>
        <span className="px-4 py-1.5 rounded-full bg-[#E8EDF4] text-[13px] font-extrabold text-[#26354A] border border-[#26354A]/10">
          {toUnlockCount} to unlock
        </span>
      </div>

      {/* 3x3 Grid matching PDF Page 24 */}
      <div className="grid grid-cols-3 gap-y-7 gap-x-4">
        {badges.map((badge) => {
          return (
            <button
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className="flex flex-col items-center text-center group cursor-pointer"
              aria-label={`${badge.name}: ${badge.unlocked ? 'Earned' : 'Locked'}`}
            >
              <div
                className={`w-20 h-20 rounded-full border-2 border-[#26354A] flex items-center justify-center text-[28px] font-black shadow-xs transition-transform group-hover:scale-105 group-active:scale-95 mb-2 ${
                  badge.unlocked ? '' : 'bg-[#E3E8EE] border-[#26354A]/50'
                }`}
                style={{
                  backgroundColor: badge.unlocked ? badge.color : undefined,
                }}
              >
                {badge.unlocked ? (
                  badge.icon
                ) : (
                  <Lock className="w-6 h-6 text-[#26354A]/40 stroke-[2.5]" />
                )}
              </div>

              <span className="text-[14px] font-black text-[#26354A] leading-tight line-clamp-2 px-1">
                {badge.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Badge detail popup if clicked */}
      {selectedBadge && (
        <div
          className="fixed inset-0 z-50 bg-[#26354A]/60 backdrop-blur-xs flex items-center justify-center p-5"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-xs bg-[#FFFBF2] rounded-[28px] border-2 border-[#26354A] p-6 shadow-2xl text-center space-y-4 animate-scaleUp">
            <div
              className="w-20 h-20 mx-auto rounded-full border-2 border-[#26354A] flex items-center justify-center text-[30px] font-black shadow-xs"
              style={{
                backgroundColor: selectedBadge.unlocked
                  ? selectedBadge.color
                  : '#E3E8EE',
              }}
            >
              {selectedBadge.unlocked ? (
                selectedBadge.icon
              ) : (
                <Lock className="w-6 h-6 text-[#26354A]/40" />
              )}
            </div>

            <div>
              <h3 className="text-[20px] font-black text-[#26354A]">
                {selectedBadge.name}
              </h3>
              <p className="text-[14px] font-bold text-[#26354A]/80 mt-1">
                {selectedBadge.description}
              </p>
              {selectedBadge.unlockedAt && (
                <span className="inline-block mt-2 text-[12px] font-extrabold text-[#79DDB0] bg-[#26354A] px-3 py-1 rounded-full">
                  Unlocked {selectedBadge.unlockedAt}
                </span>
              )}
            </div>

            <button
              onClick={() => setSelectedBadge(null)}
              className="w-full py-3 bg-[#26354A] text-white font-extrabold text-[15px] rounded-[18px] hover:bg-[#1a2636] cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
