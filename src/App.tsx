import React from 'react';
import { GameProvider, useGame } from './context/GameContext.js';
import { BottomNav } from './components/BottomNav.js';
import { OnboardingFlow } from './components/OnboardingFlow.js';
import { HomeScreen } from './screens/HomeScreen.js';
import { GameLibraryScreen } from './screens/GameLibraryScreen.js';
import { WorldSelectScreen } from './screens/WorldSelectScreen.js';
import { LevelSelectScreen } from './screens/LevelSelectScreen.js';
import { GameplayScreen } from './screens/GameplayScreen.js';
import { ResultsScreen } from './screens/ResultsScreen.js';
import { RewardsScreen } from './screens/RewardsScreen.js';
import { BadgesScreen } from './screens/BadgesScreen.js';
import { ProgressScreen } from './screens/ProgressScreen.js';
import { LearningHistoryScreen } from './screens/LearningHistoryScreen.js';
import { ProfileScreen } from './screens/ProfileScreen.js';
import { SettingsScreen } from './screens/SettingsScreen.js';

const MainAppContent: React.FC = () => {
  const { currentScreen, currentTab, profile } = useGame();

  const getTextSizeClass = () => {
    switch (profile.textSize) {
      case 'large':
        return 'text-[1.06rem]';
      case 'extra-large':
        return 'text-[1.14rem]';
      default:
        return 'text-[1rem]';
    }
  };

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'onboarding':
        return <OnboardingFlow />;
      case 'world-select':
        return <WorldSelectScreen />;
      case 'level-select':
        return <LevelSelectScreen />;
      case 'gameplay':
        return <GameplayScreen />;
      case 'results':
        return <ResultsScreen />;
      case 'badges-modal':
        return <BadgesScreen />;
      case 'history-modal':
        return <LearningHistoryScreen />;
      case 'profile-screen':
        return <ProfileScreen />;
      case 'settings-screen':
        return <SettingsScreen />;
      case 'main':
      default:
        switch (currentTab) {
          case 'games':
            return <GameLibraryScreen />;
          case 'rewards':
            return <RewardsScreen />;
          case 'progress':
            return <ProgressScreen />;
          case 'home':
          default:
            return <HomeScreen />;
        }
    }
  };

  const showBottomNav = currentScreen === 'main';

  return (
    <div
      className={`min-h-screen w-full bg-[#EBF0F5] flex items-center justify-center p-0 sm:p-4 font-nunito ${getTextSizeClass()}`}
    >
      {/* Mobile Device Frame */}
      <div className="w-full max-w-md min-h-screen sm:min-h-[844px] sm:max-h-[920px] bg-[#FFFBF2] text-[#26354A] flex flex-col justify-between sm:rounded-[36px] border-0 sm:border-[3px] border-[#26354A] shadow-2xl relative overflow-x-hidden overflow-y-auto">
        <main className="flex-1 flex flex-col">{renderActiveScreen()}</main>

        {showBottomNav && <BottomNav />}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <MainAppContent />
    </GameProvider>
  );
}
