import React from 'react';
import { useGame } from '../context/GameContext.js';
import { MascotAvatar } from '../components/MascotAvatar.js';
import { GameIcon } from '../components/GameIcon.js';
import { GAMES, BUDDIES } from '../data/gameData.js';
import { GameId } from '../types/game.js';

export const HomeScreen: React.FC = () => {
  const {
    profile,
    progress,
    setCurrentTab,
    setActiveGameId,
    navigateTo,
    startLevel,
  } = useGame();

  const currentBuddy = BUDDIES.find((b) => b.id === profile.selectedBuddy) || BUDDIES[0];

  const handleOpenGame = (gameId: GameId) => {
    setActiveGameId(gameId);
    navigateTo('world-select');
  };

  const handleContinueJumpBack = () => {
    startLevel('math-quest', 1, 4);
  };

  return (
    <div className="flex flex-col min-h-full px-5 pt-4 pb-8 space-y-6 max-w-md mx-auto">
      {/* Top Greeting & Stats Bar matching PDF Page 6 */}
      <header className="flex items-center justify-between gap-2">
        <button
          onClick={() => navigateTo('profile-screen')}
          className="flex items-center gap-3 text-left group cursor-pointer"
          aria-label="View Profile"
        >
          <MascotAvatar
            buddyId={profile.selectedBuddy}
            size={52}
            showBorder={true}
            className="group-hover:scale-105 transition-transform"
          />
          <div>
            <span className="block text-[13px] font-bold text-[#26354A]/70 leading-tight">
              Good morning
            </span>
            <span className="block text-[21px] font-black text-[#26354A] leading-tight">
              Hi, {currentBuddy.name}!
            </span>
          </div>
        </button>

        <div className="flex items-center gap-2">
          {/* Streak Badge */}
          <div className="flex flex-col items-center justify-center bg-[#FFEFAF] text-[#26354A] px-3 py-1.5 rounded-[16px] border border-[#26354A]/10 min-w-[70px]">
            <span className="text-[14px] font-black leading-tight">
              {profile.currentStreak} day
            </span>
            <span className="text-[11px] font-extrabold tracking-wide text-[#26354A]/70 uppercase">
              streak
            </span>
          </div>

          {/* XP Badge */}
          <div className="flex flex-col items-center justify-center bg-[#D8F5E5] text-[#26354A] px-3 py-1.5 rounded-[16px] border border-[#26354A]/10 min-w-[65px]">
            <span className="text-[14px] font-black leading-tight">
              {profile.totalXP}
            </span>
            <span className="text-[11px] font-extrabold tracking-wide text-[#26354A]/70 uppercase">
              XP
            </span>
          </div>
        </div>
      </header>

      {/* "Jump back in" Card matching PDF Page 6 */}
      <section
        className="relative overflow-hidden bg-[#56B7F5] rounded-[26px] border-2 border-[#26354A] p-5 shadow-sm"
        aria-label="Jump back in"
      >
        {/* Sunny yellow sun cutout in top right */}
        <div
          className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-[#FFD45C] border-2 border-[#26354A] pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10">
          <span className="inline-block text-[12px] font-extrabold tracking-wider text-[#26354A] uppercase mb-1">
            Jump back in
          </span>
          <h2 className="text-[24px] font-black text-[#26354A] leading-tight">
            Math Quest
          </h2>
          <p className="text-[16px] font-extrabold text-[#26354A]/90 mt-0.5 mb-4">
            Level 4: Number trails
          </p>

          {/* Progress bar */}
          <div className="w-full h-3 rounded-full bg-white/40 overflow-hidden mb-4 border border-[#26354A]/20">
            <div
              className="h-full bg-[#26354A] rounded-full transition-all duration-500"
              style={{ width: '60%' }}
              role="progressbar"
              aria-valuenow={60}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>

          <button
            onClick={handleContinueJumpBack}
            className="py-2.5 px-6 bg-[#26354A] text-white font-extrabold text-[15px] rounded-[18px] shadow-sm hover:bg-[#1a2636] active:scale-95 transition-all cursor-pointer"
            aria-label="Continue Math Quest Level 4"
          >
            Continue
          </button>
        </div>
      </section>

      {/* "Your games" Section matching PDF Page 6 */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] font-black text-[#26354A]">Your games</h2>
          <button
            onClick={() => setCurrentTab('games')}
            className="text-[14px] font-extrabold text-[#26354A]/70 hover:text-[#26354A] underline underline-offset-2 cursor-pointer"
          >
            See all
          </button>
        </div>

        <div className="space-y-3">
          {GAMES.map((game) => {
            const prog = progress[game.id];
            const completedCount = Object.keys(prog?.completedLevels || {}).length;
            const totalLvls = game.id === 'math-quest' ? 12 : 10;
            const currentLv = Math.min(totalLvls, Math.max(1, prog?.currentLevel || 1));
            const progressRatio = Math.min(100, Math.round((completedCount / totalLvls) * 100));

            return (
              <div
                key={game.id}
                onClick={() => handleOpenGame(game.id)}
                className="p-4 rounded-[24px] border-2 border-[#26354A] transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-xs"
                style={{ backgroundColor: game.lightBg }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleOpenGame(game.id);
                }}
                aria-label={`Open ${game.name}, Level ${currentLv} of ${totalLvls}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-[16px] border-2 border-[#26354A] flex items-center justify-center text-[22px] font-black shrink-0 shadow-xs"
                      style={{ backgroundColor: game.primaryColor }}
                    >
                      <GameIcon gameId={game.id} size={24} />
                    </div>
                    <div>
                      <h3 className="text-[18px] font-black text-[#26354A] leading-tight">
                        {game.name}
                      </h3>
                      <p className="text-[13px] font-bold text-[#26354A]/75 mt-0.5">
                        {game.id === 'math-quest'
                          ? 'Puzzles and equations'
                          : game.id === 'science-explorer'
                          ? 'Discover how things work'
                          : 'Logic, patterns and mazes'}
                      </p>
                    </div>
                  </div>

                  <span className="text-[13px] font-extrabold text-[#26354A] whitespace-nowrap bg-white/60 px-2.5 py-1 rounded-full border border-[#26354A]/10">
                    Lv {currentLv} of {totalLvls}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-black/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(15, progressRatio)}%`,
                      backgroundColor:
                        game.id === 'math-quest'
                          ? '#26354A'
                          : game.id === 'science-explorer'
                          ? '#1C7C5A'
                          : '#6C58B3',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
