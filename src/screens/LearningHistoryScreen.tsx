import React from 'react';
import { useGame } from '../context/GameContext.js';
import { GAMES } from '../data/gameData.js';
import { GameIcon } from '../components/GameIcon.js';
import { ChevronLeft } from 'lucide-react';

export const LearningHistoryScreen: React.FC = () => {
  const { sessions, navigateTo } = useGame();

  return (
    <div className="flex flex-col min-h-screen px-5 pt-4 pb-12 max-w-md mx-auto">
      {/* Top Header matching PDF Page 26 */}
      <header className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigateTo('main')}
          className="w-12 h-12 rounded-[18px] border-2 border-[#26354A] bg-white flex items-center justify-center hover:bg-black/5 active:scale-95 transition-all cursor-pointer shadow-xs"
          aria-label="Back to Progress"
        >
          <ChevronLeft className="w-7 h-7 text-[#26354A] stroke-[2.8]" />
        </button>
        <h1 className="text-[24px] font-black text-[#26354A] tracking-tight">
          Learning history
        </h1>
      </header>

      {/* Session History Cards matching PDF Page 26 */}
      <div className="space-y-3.5">
        {sessions.map((sess) => {
          const game = GAMES.find((g) => g.id === sess.gameId) || GAMES[0];

          return (
            <div
              key={sess.sessionId}
              className="p-4.5 rounded-[24px] bg-white border-2 border-[#26354A] shadow-xs flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className="w-12 h-12 rounded-[16px] border-2 border-[#26354A] flex items-center justify-center text-[22px] font-black shrink-0 shadow-xs"
                  style={{ backgroundColor: game.primaryColor }}
                >
                  <GameIcon gameId={game.id} size={24} />
                </div>

                <div>
                  <h2 className="text-[18px] font-black text-[#26354A] leading-tight">
                    {game.name}
                  </h2>
                  <p className="text-[13px] font-bold text-[#26354A]/70 mt-0.5">
                    {sess.completedAt}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="block text-[18px] font-black text-[#26354A] leading-tight">
                  {sess.correctCount}/3
                </span>
                <span className="block text-[13px] font-extrabold text-[#26354A]/80 mt-0.5">
                  +{sess.xpEarned} XP
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
