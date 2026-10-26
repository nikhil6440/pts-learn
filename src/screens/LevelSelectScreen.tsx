import React from 'react';
import { useGame } from '../context/GameContext.js';
import { GAMES } from '../data/gameData.js';
import { ChevronLeft, Lock } from 'lucide-react';

export const LevelSelectScreen: React.FC = () => {
  const {
    activeGameId,
    activeWorldNumber,
    progress,
    navigateTo,
    startLevel,
  } = useGame();

  const currentGame = GAMES.find((g) => g.id === activeGameId) || GAMES[0];
  const currentWorld =
    currentGame.worlds.find((w) => w.worldNumber === activeWorldNumber) ||
    currentGame.worlds[0];

  const gameProg = progress[activeGameId];
  const completedLevels = gameProg?.completedLevels || {};

  // Calculate earned stars in this world
  let earnedStarsInWorld = 0;
  for (let l = 1; l <= currentWorld.totalLevels; l++) {
    const key = `${activeWorldNumber}-${l}`;
    if (completedLevels[key]) {
      earnedStarsInWorld += completedLevels[key].stars;
    }
  }
  const maxStarsInWorld = currentWorld.totalLevels * 3;

  // Determine current active playable level (lowest uncompleted level)
  let playNowLevel = 1;
  let allCompleted = true;
  for (let l = 1; l <= currentWorld.totalLevels; l++) {
    if (!completedLevels[`${activeWorldNumber}-${l}`]) {
      playNowLevel = l;
      allCompleted = false;
      break;
    }
  }

  // Winding offset coordinates for the friendly path
  const nodeOffsets = [0, 28, 48, 16, -24, -40, -18, 10];

  return (
    <div className="flex flex-col min-h-screen px-5 pt-4 pb-12 max-w-md mx-auto">
      {/* Top Header matching PDF Pages 11-13 */}
      <header className="flex items-center gap-3 mb-4">
        <button
          onClick={() => navigateTo('world-select')}
          className="w-12 h-12 rounded-[18px] border-2 border-[#26354A] bg-white flex items-center justify-center hover:bg-black/5 active:scale-95 transition-all cursor-pointer shadow-xs"
          aria-label="Back to Worlds"
        >
          <ChevronLeft className="w-7 h-7 text-[#26354A] stroke-[2.8]" />
        </button>
        <h1 className="text-[24px] font-black text-[#26354A] tracking-tight">
          {currentWorld.title}
        </h1>
      </header>

      {/* Level and Star summary pills */}
      <div className="flex items-center gap-3 mb-8">
        <span className="px-3.5 py-1.5 rounded-full bg-[#FFEFAF] text-[13px] font-extrabold text-[#26354A] border border-[#26354A]/10">
          Levels 1–{currentWorld.totalLevels}
        </span>
        <span className="px-3.5 py-1.5 rounded-full bg-[#FFEFAF] text-[13px] font-extrabold text-[#26354A] border border-[#26354A]/10">
          {earnedStarsInWorld} of {maxStarsInWorld} stars
        </span>
      </div>

      {/* Winding Level Progression Nodes */}
      <div className="relative flex flex-col items-center space-y-6 my-auto py-4">
        {Array.from({ length: currentWorld.totalLevels }).map((_, index) => {
          const levelNum = index + 1;
          const levelKey = `${activeWorldNumber}-${levelNum}`;
          const isCompleted = Boolean(completedLevels[levelKey]);
          const isPlayNow = !allCompleted && levelNum === playNowLevel;
          const isLocked = !isCompleted && !isPlayNow;
          const starsEarned = completedLevels[levelKey]?.stars || 0;

          const xOffset = nodeOffsets[index % nodeOffsets.length];

          return (
            <div
              key={levelNum}
              className="flex items-center gap-4 transition-all"
              style={{
                transform: `translateX(${xOffset}px)`,
              }}
            >
              {/* Level Circle Node */}
              <button
                disabled={isLocked}
                onClick={() => startLevel(activeGameId, activeWorldNumber, levelNum)}
                className={`relative w-16 h-16 rounded-full flex items-center justify-center border-2 border-[#26354A] transition-all cursor-pointer ${
                  isPlayNow
                    ? 'bg-[#26354A] text-white ring-4 ring-offset-2 ring-[#FFD45C] scale-105 shadow-md active:scale-95'
                    : isCompleted
                    ? 'text-[#26354A] shadow-xs hover:scale-105 active:scale-95'
                    : 'bg-[#DCE7F2] text-[#26354A]/40 border-[#26354A]/40 cursor-not-allowed'
                }`}
                style={{
                  backgroundColor: isPlayNow
                    ? '#26354A'
                    : isCompleted
                    ? currentGame.primaryColor
                    : undefined,
                }}
                aria-label={`Level ${levelNum}, ${
                  isPlayNow ? 'Play now' : isCompleted ? `${starsEarned} stars` : 'Locked'
                }`}
              >
                {isPlayNow ? (
                  <span className="text-[22px] font-black text-white">{levelNum}</span>
                ) : isCompleted ? (
                  <span className="text-[22px] font-black text-[#26354A]">{levelNum}</span>
                ) : (
                  <Lock className="w-5 h-5 text-[#26354A]/50 stroke-[2.5]" />
                )}
              </button>

              {/* Label: stars earned or "Play now" */}
              <div className="w-28">
                {isPlayNow ? (
                  <span className="inline-block px-2.5 py-1 rounded-full bg-[#26354A] text-white text-[13px] font-black whitespace-nowrap shadow-xs">
                    Play now
                  </span>
                ) : isCompleted ? (
                  <span className="inline-block text-[14px] font-extrabold text-[#26354A]/80 whitespace-nowrap">
                    {starsEarned} star{starsEarned !== 1 ? 's' : ''}
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
