import React from 'react';
import { useGame } from '../context/GameContext.js';
import { GameIcon } from '../components/GameIcon.js';
import { GAMES } from '../data/gameData.js';
import { GameId } from '../types/game.js';

export const GameLibraryScreen: React.FC = () => {
  const { setActiveGameId, navigateTo } = useGame();

  const handleSelectGame = (gameId: GameId) => {
    setActiveGameId(gameId);
    navigateTo('world-select');
  };

  return (
    <div className="flex flex-col min-h-full px-5 pt-4 pb-8 space-y-6 max-w-md mx-auto">
      <header>
        <h1 className="text-[32px] font-black text-[#26354A] leading-tight">
          Game library
        </h1>
        <p className="text-[17px] font-semibold text-[#26354A]/80 mt-1">
          Choose a game to play
        </p>
      </header>

      <div className="space-y-4">
        {GAMES.map((game) => (
          <div
            key={game.id}
            onClick={() => handleSelectGame(game.id)}
            className="p-5 rounded-[26px] border-2 border-[#26354A] shadow-xs hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
            style={{ backgroundColor: game.lightBg }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleSelectGame(game.id);
            }}
            aria-label={`Play ${game.name}`}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-16 h-16 rounded-[20px] border-2 border-[#26354A] flex items-center justify-center text-[28px] font-black shrink-0 shadow-xs"
                style={{ backgroundColor: game.primaryColor }}
              >
                <GameIcon gameId={game.id} size={30} />
              </div>

              <div className="flex-1">
                <h2 className="text-[22px] font-black text-[#26354A] leading-tight">
                  {game.name}
                </h2>
                <p className="text-[15px] font-bold text-[#26354A]/80 mt-1 mb-3 leading-snug">
                  {game.tagline}
                </p>

                {/* Pill with worlds & levels info */}
                <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white/70 border border-[#26354A]/15 text-[13px] font-extrabold text-[#26354A]">
                  4 worlds · 12 levels
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
