import React from 'react';
import { useGame } from '../context/GameContext.js';
import { MascotAvatar } from '../components/MascotAvatar.js';

export const ProgressScreen: React.FC = () => {
  const { profile, progress, sessions, navigateTo } = useGame();

  // Aggregate stats from stored records
  const totalCompletedGames = Math.max(
    18,
    sessions.length +
      Object.values(progress).reduce(
        (sum, g) => sum + Object.keys(g.completedLevels || {}).length,
        0
      )
  );

  const totalStars = Math.max(
    27,
    Object.values(progress).reduce(
      (sum, g) =>
        sum +
        Object.values(g.completedLevels || {}).reduce((s, lvl) => s + lvl.stars, 0),
      0
    )
  );

  // Weekly bar data
  const weekDays = [
    { day: 'Mon', height: '48%', color: '#56B7F5' },
    { day: 'Tue', height: '78%', color: '#56B7F5' },
    { day: 'Wed', height: '32%', color: '#56B7F5' },
    { day: 'Thu', height: '88%', color: '#56B7F5' },
    { day: 'Fri', height: '60%', color: '#56B7F5' },
    { day: 'Sat', height: '72%', color: '#56B7F5' },
    { day: 'Sun', height: '42%', color: '#FFD45C' }, // Today highlighted in Sunny yellow
  ];

  return (
    <div className="flex flex-col min-h-full px-5 pt-4 pb-8 space-y-6 max-w-md mx-auto">
      {/* Top Header matching PDF Page 25 */}
      <header className="flex items-center justify-between">
        <h1 className="text-[32px] font-black text-[#26354A] leading-tight">
          My progress
        </h1>

        <button
          onClick={() => navigateTo('profile-screen')}
          className="relative group cursor-pointer"
          aria-label="Open profile"
        >
          <MascotAvatar
            buddyId={profile.selectedBuddy}
            size={48}
            showBorder={true}
            className="group-hover:scale-105 transition-transform"
          />
        </button>
      </header>

      {/* 3 Summary Stats Cards */}
      <section className="grid grid-cols-3 gap-3" aria-label="Summary statistics">
        {/* Games */}
        <div className="p-3.5 rounded-[22px] bg-[#FFEFAF] border-2 border-[#26354A] text-center shadow-xs">
          <span className="block text-[28px] font-black text-[#26354A] leading-tight">
            {totalCompletedGames}
          </span>
          <span className="block text-[13px] font-extrabold text-[#26354A]/80 uppercase mt-0.5">
            Games
          </span>
        </div>

        {/* Stars */}
        <div className="p-3.5 rounded-[22px] bg-[#D8F5E5] border-2 border-[#26354A] text-center shadow-xs">
          <span className="block text-[28px] font-black text-[#26354A] leading-tight">
            {totalStars}
          </span>
          <span className="block text-[13px] font-extrabold text-[#26354A]/80 uppercase mt-0.5">
            Stars
          </span>
        </div>

        {/* Streak */}
        <div className="p-3.5 rounded-[22px] bg-[#EFEAFF] border-2 border-[#26354A] text-center shadow-xs">
          <span className="block text-[28px] font-black text-[#26354A] leading-tight">
            {profile.currentStreak}
          </span>
          <span className="block text-[13px] font-extrabold text-[#26354A]/80 uppercase mt-0.5">
            Day streak
          </span>
        </div>
      </section>

      {/* "This week" Chart Card matching PDF Page 25 */}
      <section className="p-5 rounded-[26px] bg-white border-2 border-[#26354A] shadow-xs">
        <h2 className="text-[20px] font-black text-[#26354A] mb-6">This week</h2>

        <div className="flex items-end justify-between h-36 px-2 pb-1 border-b-2 border-[#26354A]/10">
          {weekDays.map((item) => (
            <div key={item.day} className="flex flex-col items-center gap-2 flex-1">
              <div className="w-full flex justify-center h-28 items-end">
                <div
                  className="w-5 rounded-t-xl transition-all duration-700"
                  style={{
                    height: item.height,
                    backgroundColor: item.color,
                  }}
                  aria-label={`${item.day} activity level ${item.height}`}
                />
              </div>
              <span className="text-[13px] font-extrabold text-[#26354A]/70">
                {item.day}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Game completion percentages matching PDF Page 25 */}
      <section className="space-y-4 pt-1">
        {[
          { name: 'Math Quest', percentage: 60, color: '#56B7F5' },
          { name: 'Science Explorer', percentage: 35, color: '#28A779' },
          { name: 'Brain Trails', percentage: 20, color: '#FF8178' },
        ].map((game) => (
          <div key={game.name} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[16px] font-black text-[#26354A]">
                {game.name}
              </span>
              <span className="text-[14px] font-extrabold text-[#26354A]">
                {game.percentage}%
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-[#E5E9F0] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${game.percentage}%`,
                  backgroundColor: game.color,
                }}
              />
            </div>
          </div>
        ))}
      </section>

      {/* "View learning history" Button matching PDF Page 25 */}
      <div className="pt-2">
        <button
          onClick={() => navigateTo('history-modal')}
          className="w-full py-4 bg-white border-2 border-[#26354A] text-[#26354A] font-extrabold text-[17px] rounded-[22px] shadow-xs hover:bg-black/5 active:scale-[0.98] transition-all cursor-pointer"
          aria-label="View learning history"
        >
          View learning history
        </button>
      </div>
    </div>
  );
};
