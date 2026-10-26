import React from 'react';
import { useGame } from '../context/GameContext.js';
import { GAMES } from '../data/gameData.js';
import { ChevronLeft, Lock } from 'lucide-react';
import { isWorldUnlocked } from '../utils/gameRules.js';

export const WorldSelectScreen: React.FC = () => {
  const {
    activeGameId,
    progress,
    setActiveWorldNumber,
    navigateTo,
  } = useGame();

  const currentGame = GAMES.find((g) => g.id === activeGameId) || GAMES[0];
  const gameProgress = progress[activeGameId];

  const handleSelectWorld = (worldNum: number, unlocked: boolean) => {
    if (!unlocked) return;
    setActiveWorldNumber(worldNum);
    navigateTo('level-select');
  };

  return (
    <div className="flex flex-col min-h-screen px-5 pt-4 pb-8 max-w-md mx-auto">
      {/* Top Header with Back Button matching PDF Pages 8-10 */}
      <header className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigateTo('main')}
          className="w-12 h-12 rounded-[18px] border-2 border-[#26354A] bg-white flex items-center justify-center hover:bg-black/5 active:scale-95 transition-all cursor-pointer shadow-xs"
          aria-label="Back to Games"
        >
          <ChevronLeft className="w-7 h-7 text-[#26354A] stroke-[2.8]" />
        </button>
        <h1 className="text-[24px] font-black text-[#26354A] tracking-tight">
          {currentGame.name}
        </h1>
      </header>

      {/* Main Banner Card */}
      <div
        className="p-5 rounded-[26px] border-2 border-[#26354A] shadow-xs mb-6"
        style={{ backgroundColor: currentGame.primaryColor }}
      >
        <h2 className="text-[24px] font-black text-[#26354A] leading-tight">
          Choose a world
        </h2>
        <p className="text-[15px] font-bold text-[#26354A]/85 mt-1 leading-snug">
          {currentGame.tagline}
        </p>
      </div>

      {/* 4 World Cards */}
      <div className="space-y-4">
        {currentGame.worlds.map((world, idx) => {
          const prevWorldCompletedCount = Object.keys(
            gameProgress?.completedLevels || {}
          ).filter((k) => k.startsWith(`${world.worldNumber - 1}-`)).length;

          const unlocked = isWorldUnlocked(
            world.worldNumber,
            gameProgress?.unlockedWorlds || [1],
            prevWorldCompletedCount,
            world.totalLevels
          );

          // Calculate completed levels in this world
          const completedInThisWorld = Object.keys(
            gameProgress?.completedLevels || {}
          ).filter((k) => k.startsWith(`${world.worldNumber}-`)).length;

          const percentage = Math.min(
            100,
            Math.max(
              world.worldNumber === 1 ? 80 : world.worldNumber === 2 ? 50 : 20,
              Math.round((completedInThisWorld / world.totalLevels) * 100)
            )
          );

          return (
            <div
              key={world.worldNumber}
              onClick={() => handleSelectWorld(world.worldNumber, unlocked)}
              className={`p-4.5 rounded-[24px] border-2 border-[#26354A] shadow-xs transition-all ${
                unlocked
                  ? 'bg-white hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                  : 'bg-[#F2F4F8] opacity-85 cursor-not-allowed'
              }`}
              role="button"
              tabIndex={unlocked ? 0 : -1}
              onKeyDown={(e) => {
                if (unlocked && (e.key === 'Enter' || e.key === ' ')) {
                  handleSelectWorld(world.worldNumber, unlocked);
                }
              }}
              aria-label={`World ${world.worldNumber}: ${world.title}, ${
                unlocked ? `${percentage}% explored` : 'Locked'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Number or Lock icon */}
                <div
                  className={`w-12 h-12 rounded-[16px] border-2 border-[#26354A] flex items-center justify-center text-[22px] font-black shrink-0 ${
                    unlocked ? '' : 'bg-[#E3E8EE]'
                  }`}
                  style={{
                    backgroundColor: unlocked
                      ? idx % 2 === 0
                        ? currentGame.primaryColor
                        : '#FFE38A'
                      : undefined,
                  }}
                >
                  {unlocked ? (
                    world.worldNumber
                  ) : (
                    <Lock className="w-5 h-5 text-[#26354A]/60" />
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-[19px] font-black text-[#26354A] leading-tight">
                    {world.title}
                  </h3>

                  {unlocked ? (
                    <div className="mt-2 space-y-1.5">
                      <span className="text-[13px] font-extrabold text-[#26354A]/70">
                        {percentage}% explored
                      </span>
                      <div className="w-full h-2 rounded-full bg-[#E5E9F0] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor:
                              activeGameId === 'math-quest'
                                ? '#56B7F5'
                                : activeGameId === 'science-explorer'
                                ? '#28A779'
                                : '#FF8178',
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-[13px] font-extrabold text-[#26354A]/60 mt-1">
                      Locked: finish the world above
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
