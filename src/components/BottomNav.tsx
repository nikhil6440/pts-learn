import React from 'react';
import { useGame, TabType } from '../context/GameContext.js';
import { Home, LayoutGrid, Star, BarChart3 } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentTab, setCurrentTab } = useGame();

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home className="w-6 h-6 stroke-[2.4]" />,
    },
    {
      id: 'games',
      label: 'Games',
      icon: <LayoutGrid className="w-6 h-6 stroke-[2.4]" />,
    },
    {
      id: 'rewards',
      label: 'Rewards',
      icon: <Star className="w-6 h-6 stroke-[2.4]" />,
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: <BarChart3 className="w-6 h-6 stroke-[2.4]" />,
    },
  ];

  return (
    <nav
      className="sticky bottom-0 z-30 w-full bg-[#FFFBF2] border-t-2 border-[#26354A]/10 px-4 py-2"
      aria-label="Main Navigation"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer ${
                isActive ? 'text-[#26354A]' : 'text-[#26354A]/50 hover:text-[#26354A]'
              }`}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-2xl transition-transform active:scale-95 ${
                  isActive ? 'bg-[#FFD45C] text-[#26354A] shadow-sm' : ''
                }`}
              >
                {tab.icon}
              </div>
              <span
                className={`text-[13px] mt-0.5 tracking-tight ${
                  isActive ? 'font-extrabold text-[#26354A]' : 'font-semibold'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
