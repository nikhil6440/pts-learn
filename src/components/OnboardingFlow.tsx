import React, { useState } from 'react';
import { useGame } from '../context/GameContext.js';
import { BUDDIES } from '../data/gameData.js';
import { BuddyId, AgeGroup, ChallengeLevel } from '../types/game.js';
import { MascotAvatar } from './MascotAvatar.js';

export const OnboardingFlow: React.FC = () => {
  const { completeOnboarding, profile } = useGame();
  const [step, setStep] = useState<number>(1);
  const [selectedBuddy, setSelectedBuddy] = useState<BuddyId>(profile.selectedBuddy || 'pip');
  const [selectedAge, setSelectedAge] = useState<AgeGroup>(profile.ageGroup || '10-11');
  const [selectedDifficulty, setSelectedDifficulty] = useState<ChallengeLevel>(
    profile.difficulty || 'medium'
  );

  const handleFinish = () => {
    completeOnboarding(selectedBuddy, selectedAge, selectedDifficulty);
  };

  const handleSkip = () => {
    completeOnboarding(selectedBuddy, selectedAge, selectedDifficulty);
  };

  // --- SCREEN 1: Welcome ---
  if (step === 1) {
    return (
      <main
        className="relative flex flex-col justify-between min-h-screen w-full max-w-md mx-auto bg-[#56B7F5] px-6 py-12 overflow-hidden"
        data-testid="onboarding-step-1"
      >
        {/* Playful background decorative circles matching PDF Page 2 */}
        <div
          className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-[#FFD45C] pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute top-1/3 -right-6 w-10 h-10 rounded-full bg-[#FF8178] pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-[#79DDB0] pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col items-center justify-center flex-1 my-auto text-center">
          {/* App Logo */}
          <div className="relative mb-6">
            <img
              src="/app-logo.png"
              alt="Playtown Learn - Playful Fox Logo"
              className="w-52 h-52 object-contain rounded-[36px] shadow-xl border-3 border-[#26354A] bg-[#FFFBF2] p-2"
            />
          </div>

          {/* 3 Game Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            <span className="px-4 py-2 rounded-full bg-[#FFD45C] text-[#26354A] font-extrabold text-[14px] border border-[#26354A]/20 shadow-xs">
              Math Quest
            </span>
            <span className="px-4 py-2 rounded-full bg-[#79DDB0] text-[#26354A] font-extrabold text-[14px] border border-[#26354A]/20 shadow-xs">
              Science
            </span>
            <span className="px-4 py-2 rounded-full bg-[#A79AF5] text-[#26354A] font-extrabold text-[14px] border border-[#26354A]/20 shadow-xs">
              Brain Trails
            </span>
          </div>
        </div>

        {/* Primary button */}
        <div className="relative z-10 w-full mt-auto">
          <button
            onClick={() => setStep(2)}
            className="w-full py-4.5 bg-[#26354A] text-white font-extrabold text-[18px] rounded-[20px] shadow-md hover:bg-[#1f2c3d] active:scale-[0.98] transition-all cursor-pointer"
            aria-label="Let's play"
          >
            Let's play
          </button>
        </div>
      </main>
    );
  }

  // --- SCREEN 2: Crack the number code ---
  if (step === 2) {
    return (
      <main
        className="flex flex-col justify-between min-h-screen w-full max-w-md mx-auto bg-[#FFFBF2] px-6 py-8"
        data-testid="onboarding-step-2"
      >
        <div className="flex justify-end">
          <button
            onClick={handleSkip}
            className="text-[16px] font-extrabold text-[#26354A] underline underline-offset-4 hover:opacity-75 cursor-pointer py-1 px-2"
            aria-label="Skip onboarding"
          >
            Skip
          </button>
        </div>

        <div className="flex flex-col items-center justify-center flex-1 my-auto text-left">
          {/* Card with 7 + 5 matching PDF Page 3 */}
          <div className="relative w-full aspect-square max-w-[280px] bg-[#FFD45C] rounded-[28px] border-2 border-[#26354A] flex items-center justify-center p-6 shadow-sm mb-8 overflow-hidden">
            <div
              className="absolute top-4 left-4 w-6 h-6 rounded-full bg-white/40"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-[#FFE38A]"
              aria-hidden="true"
            />
            <span className="relative z-10 text-[64px] font-black text-[#26354A] tracking-wider select-none">
              7 + 5
            </span>
          </div>

          <div className="w-full text-left">
            <h2 className="text-[28px] font-black text-[#26354A] leading-tight mb-3">
              Crack the number <br /> code
            </h2>
            <p className="text-[17px] font-semibold text-[#26354A]/80 leading-relaxed">
              Solve puzzles, beat equations and earn stars in Math Quest.
            </p>
          </div>

          {/* Dots pagination */}
          <div className="flex items-center gap-2 mt-8" aria-hidden="true">
            <span className="w-6 h-2 rounded-full bg-[#26354A]" />
            <span className="w-2 h-2 rounded-full bg-[#26354A]/30" />
            <span className="w-2 h-2 rounded-full bg-[#26354A]/30" />
          </div>
        </div>

        <div className="w-full mt-auto">
          <button
            onClick={() => setStep(3)}
            className="w-full py-4.5 bg-[#26354A] text-white font-extrabold text-[18px] rounded-[20px] shadow-md hover:bg-[#1f2c3d] active:scale-[0.98] transition-all cursor-pointer"
            aria-label="Next step"
          >
            Next
          </button>
        </div>
      </main>
    );
  }

  // --- SCREEN 3: Pick your buddy ---
  if (step === 3) {
    const currentBuddy = BUDDIES.find((b) => b.id === selectedBuddy) || BUDDIES[0];

    return (
      <main
        className="flex flex-col justify-between min-h-screen w-full max-w-md mx-auto bg-[#FFFBF2] px-6 py-8"
        data-testid="onboarding-step-3"
      >
        <div>
          <h2 className="text-[28px] font-black text-[#26354A] leading-tight">
            Pick your buddy
          </h2>
          <p className="text-[17px] font-semibold text-[#26354A]/80 mt-1">
            They will cheer you on in every game.
          </p>
        </div>

        <div className="flex flex-col items-center my-6">
          {/* Main preview circle matching PDF Page 4 */}
          <div className="relative mb-3">
            <MascotAvatar buddyId={selectedBuddy} size={130} showBorder={true} />
          </div>
          <p className="text-[22px] font-extrabold text-[#26354A]">
            {currentBuddy.name}
          </p>
          <p className="text-[13px] font-semibold text-[#26354A]/60">
            {currentBuddy.personality}
          </p>

          {/* 6 Avatar Grid */}
          <div className="grid grid-cols-3 gap-3.5 w-full mt-6">
            {BUDDIES.map((buddy) => {
              const isSelected = selectedBuddy === buddy.id;
              return (
                <button
                  key={buddy.id}
                  onClick={() => setSelectedBuddy(buddy.id)}
                  className={`aspect-square rounded-[22px] p-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[3px] border-[#26354A] shadow-md scale-[1.03]'
                      : 'border-2 border-transparent hover:border-[#26354A]/30'
                  }`}
                  style={{ backgroundColor: buddy.color }}
                  aria-label={`Select buddy ${buddy.name}`}
                  aria-pressed={isSelected}
                >
                  <MascotAvatar buddyId={buddy.id} size={54} showBorder={false} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="w-full mt-auto">
          <button
            onClick={() => setStep(4)}
            className="w-full py-4.5 bg-[#26354A] text-white font-extrabold text-[18px] rounded-[20px] shadow-md hover:bg-[#1f2c3d] active:scale-[0.98] transition-all cursor-pointer"
            aria-label="Let's go to difficulty selection"
          >
            Let's go
          </button>
        </div>
      </main>
    );
  }

  // --- SCREEN 4: Make it just right (Personalize) ---
  return (
    <main
      className="flex flex-col justify-between min-h-screen w-full max-w-md mx-auto bg-[#FFFBF2] px-6 py-8"
      data-testid="onboarding-step-4"
    >
      <div>
        <h2 className="text-[28px] font-black text-[#26354A] leading-tight">
          Make it just right
        </h2>
        <p className="text-[17px] font-semibold text-[#26354A]/80 mt-1">
          Pick your age group and challenge level. You can change these later.
        </p>
      </div>

      <div className="my-6 space-y-6">
        {/* Age group selector matching PDF Page 5 */}
        <div>
          <label className="block text-[15px] font-extrabold text-[#26354A] mb-2.5">
            My age
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {(['8–9', '10–11', '12–14'] as const).map((label) => {
              const val: AgeGroup = label === '8–9' ? '8-9' : label === '10–11' ? '10-11' : '12-14';
              const isSelected = selectedAge === val;
              return (
                <button
                  key={val}
                  onClick={() => setSelectedAge(val)}
                  className={`py-3 rounded-[18px] text-[18px] font-extrabold border-2 border-[#26354A] transition-all cursor-pointer ${
                    isSelected ? 'bg-[#FFD45C] text-[#26354A] shadow-xs' : 'bg-white text-[#26354A]'
                  }`}
                  aria-pressed={isSelected}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Challenge level cards matching PDF Page 5 */}
        <div>
          <label className="block text-[15px] font-extrabold text-[#26354A] mb-2.5">
            Challenge level
          </label>
          <div className="space-y-3">
            {[
              {
                id: 'easy' as ChallengeLevel,
                title: 'Easy',
                desc: 'Warm-up puzzles with extra hints',
                activeColor: 'bg-[#FFD45C]',
              },
              {
                id: 'medium' as ChallengeLevel,
                title: 'Medium',
                desc: 'A fair mix of steady and tricky',
                activeColor: 'bg-[#79DDB0]',
              },
              {
                id: 'hard' as ChallengeLevel,
                title: 'Hard',
                desc: 'Fewer hints and bigger brain-benders',
                activeColor: 'bg-[#FF8178]',
              },
            ].map((lvl) => {
              const isSelected = selectedDifficulty === lvl.id;
              return (
                <button
                  key={lvl.id}
                  onClick={() => setSelectedDifficulty(lvl.id)}
                  className={`w-full text-left p-4.5 rounded-[22px] border-2 border-[#26354A] transition-all cursor-pointer ${
                    isSelected ? `${lvl.activeColor} shadow-sm` : 'bg-white'
                  }`}
                  aria-pressed={isSelected}
                >
                  <div className="text-[19px] font-extrabold text-[#26354A]">
                    {lvl.title}
                  </div>
                  <div className="text-[14px] font-semibold text-[#26354A]/85 mt-0.5">
                    {lvl.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="w-full mt-auto">
        <button
          onClick={handleFinish}
          className="w-full py-4.5 bg-[#26354A] text-white font-extrabold text-[18px] rounded-[20px] shadow-md hover:bg-[#1f2c3d] active:scale-[0.98] transition-all cursor-pointer"
          aria-label="Start playing"
        >
          Start playing
        </button>
      </div>
    </main>
  );
};
