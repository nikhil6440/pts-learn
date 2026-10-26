import React from 'react';
import { useGame } from '../context/GameContext.js';
import { calculatePlayerLevel } from '../utils/gameRules.js';
import { Check } from 'lucide-react';

export const RewardsScreen: React.FC = () => {
  const {
    profile,
    badges,
    quests,
    claimLevelReward,
    claimQuestReward,
    navigateTo,
  } = useGame();

  const levelInfo = calculatePlayerLevel(profile.totalXP);
  const earnedBadges = badges.filter((b) => b.unlocked);
  const isRewardClaimed = profile.claimedLevelRewards.includes(levelInfo.level);

  return (
    <div className="flex flex-col min-h-full px-5 pt-4 pb-8 space-y-6 max-w-md mx-auto">
      <header>
        <h1 className="text-[32px] font-black text-[#26354A] leading-tight">
          Rewards
        </h1>
      </header>

      {/* Level XP Card matching PDF Page 23 */}
      <section
        className="p-5 rounded-[26px] bg-[#56B7F5] border-2 border-[#26354A] shadow-sm text-left"
        aria-label="Level status"
      >
        <span className="block text-[14px] font-extrabold text-[#26354A] uppercase tracking-wide">
          {levelInfo.title}
        </span>
        <h2 className="text-[28px] font-black text-[#26354A] my-1">
          {levelInfo.currentLevelXP} / {levelInfo.nextLevelXP} XP
        </h2>

        {/* Progress bar */}
        <div className="w-full h-3 rounded-full bg-white/40 overflow-hidden my-4 border border-[#26354A]/20">
          <div
            className="h-full bg-[#26354A] rounded-full transition-all duration-500"
            style={{ width: `${levelInfo.progressPercent}%` }}
            role="progressbar"
            aria-valuenow={levelInfo.currentLevelXP}
            aria-valuemin={levelInfo.currentLevelXP - levelInfo.progressXP}
            aria-valuemax={levelInfo.nextLevelXP}
          />
        </div>

        <button
          disabled={isRewardClaimed}
          onClick={() => claimLevelReward(levelInfo.level)}
          className={`py-3 px-6 rounded-[18px] font-extrabold text-[15px] transition-all ${
            isRewardClaimed
              ? 'bg-[#26354A]/70 text-white/80 cursor-default'
              : 'bg-[#26354A] text-white shadow-sm hover:bg-[#1a2636] active:scale-95 cursor-pointer'
          }`}
          aria-label="Claim level reward"
        >
          {isRewardClaimed ? 'Reward claimed ✓' : 'Claim level reward'}
        </button>
      </section>

      {/* "Recent badges" Section matching PDF Page 23 */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] font-black text-[#26354A]">Recent badges</h2>
          <button
            onClick={() => navigateTo('badges-modal')}
            className="text-[14px] font-extrabold text-[#26354A]/70 hover:text-[#26354A] underline underline-offset-2 cursor-pointer"
          >
            See all
          </button>
        </div>

        {/* Horizontal badges row */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {earnedBadges.slice(0, 4).map((badge) => (
            <button
              key={badge.id}
              onClick={() => navigateTo('badges-modal')}
              className="w-16 h-16 rounded-full border-2 border-[#26354A] flex items-center justify-center text-[22px] font-black shrink-0 shadow-xs hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              style={{ backgroundColor: badge.color }}
              aria-label={`Badge ${badge.name}`}
            >
              {badge.icon}
            </button>
          ))}
          {earnedBadges.length < 4 && (
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#26354A]/40 bg-[#E8EDF4] flex items-center justify-center text-[18px] text-[#26354A]/40 shrink-0">
              ●
            </div>
          )}
        </div>
      </section>

      {/* "Daily quests" Section matching PDF Page 23 */}
      <section className="space-y-3">
        <h2 className="text-[20px] font-black text-[#26354A]">Daily quests</h2>

        <div className="space-y-3">
          {quests.map((quest) => {
            const isFinished = quest.currentProgress >= quest.target;
            const progressRatio = Math.min(
              100,
              Math.round((quest.currentProgress / quest.target) * 100)
            );

            return (
              <div
                key={quest.id}
                className="p-4 rounded-[22px] bg-white border-2 border-[#26354A] shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-[17px] font-black text-[#26354A]">
                    {quest.title}
                  </h3>
                  <span className="text-[15px] font-extrabold text-[#26354A]">
                    {Math.min(quest.target, quest.currentProgress)} / {quest.target}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 rounded-full bg-[#E5E9F0] overflow-hidden">
                  <div
                    className="h-full bg-[#56B7F5] rounded-full transition-all duration-500"
                    style={{ width: `${progressRatio}%` }}
                  />
                </div>

                {isFinished && !quest.claimed && (
                  <button
                    onClick={() => claimQuestReward(quest.id)}
                    className="mt-2 w-full py-2 bg-[#79DDB0] text-[#26354A] font-extrabold text-[14px] rounded-[14px] border-2 border-[#26354A] hover:bg-[#6ed4a6] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    Claim +{quest.xpReward} XP
                  </button>
                )}

                {quest.claimed && (
                  <div className="text-[12px] font-extrabold text-[#26354A]/60 flex items-center gap-1 mt-1">
                    <Check className="w-4 h-4 text-[#79DDB0] stroke-[3]" /> Claimed
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
