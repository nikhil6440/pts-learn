import React from 'react';
import { useGame } from '../context/GameContext.js';
import { GAMES } from '../data/gameData.js';
import { Pause, HelpCircle, Loader2 } from 'lucide-react';
import { PauseOverlay } from '../components/PauseOverlay.js';
import { ExitConfirmationDialog } from '../components/ExitConfirmationDialog.js';

export const GameplayScreen: React.FC = () => {
  const {
    activeGameId,
    activeWorldNumber,
    activeQuestions,
    currentQuestionIndex,
    selectedOption,
    isSubmitted,
    isCorrect,
    currentScore,
    isPaused,
    showExitDialog,
    hintOpen,
    isLoadingAI,
    questionSource,
    selectOption,
    checkAnswer,
    nextQuestion,
    toggleHint,
    pauseGame,
  } = useGame();

  const currentGame = GAMES.find((g) => g.id === activeGameId) || GAMES[0];
  const currentQ = activeQuestions[currentQuestionIndex];
  const totalQuestions = activeQuestions.length || 3;
  const progressPercent = Math.min(100, Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100));

  if (isLoadingAI || !currentQ) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 max-w-md mx-auto text-center">
        <Loader2 className="w-12 h-12 text-[#26354A] animate-spin mb-4" />
        <h2 className="text-[24px] font-black text-[#26354A] mb-2">
          Generating Level {currentQuestionIndex + 1}...
        </h2>
        <p className="text-[16px] font-semibold text-[#26354A]/70">
          Crafting child-friendly puzzles with Gemini AI
        </p>
      </div>
    );
  }

  // Dynamic visual prompt renderer
  const renderVisualPrompt = () => {
    if (!currentQ.visualPrompt) return null;

    // Check if prompt is a color sequence (e.g. "Blue, Coral, Blue, Coral, Blue, ?")
    const colorMap: Record<string, string> = {
      blue: '#56B7F5',
      coral: '#FF8178',
      mint: '#79DDB0',
      yellow: '#FFD45C',
      purple: '#A79AF5',
    };

    const tokens = currentQ.visualPrompt.split(',').map((t) => t.trim());
    const isColorSequence = tokens.length > 2 && tokens.some((t) => colorMap[t.toLowerCase()]);

    if (isColorSequence) {
      return (
        <div className="flex flex-wrap items-center justify-center gap-2 my-4">
          {tokens.map((token, idx) => {
            const hex = colorMap[token.toLowerCase()];
            if (token === '?' || !hex) {
              return (
                <div
                  key={idx}
                  className="w-10 h-14 rounded-[14px] border-2 border-dashed border-[#26354A] bg-white flex items-center justify-center text-[22px] font-black text-[#26354A] shadow-xs"
                >
                  ?
                </div>
              );
            }
            return (
              <div
                key={idx}
                className="w-10 h-14 rounded-[14px] border-2 border-[#26354A] shadow-xs transition-transform hover:scale-105"
                style={{ backgroundColor: hex }}
                title={token}
              />
            );
          })}
        </div>
      );
    }

    // Symbol sequence (e.g. "★, ▲, ●, ★, ▲, ?")
    const isSymbolSequence = tokens.length > 2 && tokens.some((t) => ['★', '▲', '●', '■'].includes(t));
    if (isSymbolSequence) {
      return (
        <div className="flex items-center justify-center gap-2.5 my-4">
          {tokens.map((token, idx) => {
            if (token === '?') {
              return (
                <div
                  key={idx}
                  className="w-11 h-12 rounded-[14px] border-2 border-dashed border-[#26354A] bg-white flex items-center justify-center text-[20px] font-black text-[#26354A]"
                >
                  ?
                </div>
              );
            }
            return (
              <div
                key={idx}
                className="w-11 h-12 rounded-[14px] border-2 border-[#26354A] bg-white flex items-center justify-center text-[22px] font-black text-[#26354A] shadow-xs"
              >
                {token}
              </div>
            );
          })}
        </div>
      );
    }

    // Default clean typography prompt (equations, numbers, phrases)
    return (
      <div className="my-3 text-center">
        <span className="text-[32px] font-black text-[#26354A] tracking-wider select-none">
          {currentQ.visualPrompt}
        </span>
      </div>
    );
  };

  return (
    <div className="relative flex flex-col justify-between min-h-screen px-5 pt-4 pb-8 max-w-md mx-auto">
      {/* Top Bar matching PDF Pages 14, 17, 20 */}
      <div>
        <header className="flex items-center justify-between gap-3 mb-5">
          <button
            onClick={pauseGame}
            className="w-12 h-12 rounded-[18px] border-2 border-[#26354A] bg-white flex items-center justify-center hover:bg-black/5 active:scale-95 transition-all cursor-pointer shadow-xs"
            aria-label="Pause game"
          >
            <Pause className="w-6 h-6 text-[#26354A] stroke-[2.8]" />
          </button>

          {/* Central progress bar */}
          <div className="flex-1 h-3 rounded-full bg-[#E3E8EE] overflow-hidden border border-[#26354A]/20 mx-2">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progressPercent}%`,
                backgroundColor:
                  activeGameId === 'math-quest'
                    ? '#56B7F5'
                    : activeGameId === 'science-explorer'
                    ? '#79DDB0'
                    : '#FF8178',
              }}
              role="progressbar"
              aria-valuenow={currentQuestionIndex + 1}
              aria-valuemin={1}
              aria-valuemax={totalQuestions}
            />
          </div>

          {/* Score pill */}
          <div className="flex items-center px-4 py-2 rounded-full bg-[#FFEFAF] border border-[#26354A]/10 text-[14px] font-black text-[#26354A]">
            Score {currentScore}
          </div>
        </header>

        {/* Question Tracker & Mode indicator */}
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[13px] font-extrabold text-[#26354A]/70 uppercase tracking-wide">
            {currentGame.name} · Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
          {questionSource === 'ai' && (
            <span className="text-[11px] font-black px-2 py-0.5 rounded-md bg-[#56B7F5]/20 text-[#26354A]">
              AI Quiz
            </span>
          )}
        </div>

        {/* Question Card */}
        <div
          className="p-5 rounded-[26px] border-2 border-[#26354A] shadow-xs mb-4"
          style={{ backgroundColor: currentGame.lightBg }}
        >
          <h2 className="text-[22px] font-black text-[#26354A] leading-tight mb-2">
            {currentQ.questionText}
          </h2>

          {renderVisualPrompt()}
        </div>

        {/* "Need a hint?" Action Link */}
        <div className="mb-4">
          <button
            onClick={toggleHint}
            className="inline-flex items-center gap-1.5 text-[15px] font-extrabold text-[#26354A] underline underline-offset-4 cursor-pointer hover:opacity-80"
            aria-expanded={hintOpen}
          >
            <HelpCircle className="w-4 h-4 text-[#26354A]" />
            Need a hint?
          </button>

          {hintOpen && (
            <div className="mt-2.5 p-3.5 rounded-[18px] bg-[#FFF2B2] border-2 border-[#26354A] text-[14px] font-bold text-[#26354A] leading-snug animate-fadeIn">
              💡 {currentQ.hint}
            </div>
          )}
        </div>

        {/* 4 Answer Tiles in 2x2 Grid */}
        <div className="grid grid-cols-2 gap-3.5 my-2">
          {currentQ.answerOptions.map((opt) => {
            const isSelected = selectedOption === opt;
            const isAnswerCorrect = opt === currentQ.correctAnswer;

            let tileStyle = 'bg-white text-[#26354A] border-2 border-[#26354A]';
            let statusLabel: string | null = null;

            if (isSubmitted) {
              if (isAnswerCorrect) {
                tileStyle = 'bg-[#79DDB0] text-[#26354A] border-2 border-[#26354A] shadow-sm';
                statusLabel = 'Correct';
              } else if (isSelected && !isAnswerCorrect) {
                tileStyle = 'bg-[#FF8178] text-[#26354A] border-2 border-[#26354A] shadow-sm';
                statusLabel = 'Not this one';
              } else {
                tileStyle = 'bg-white/80 text-[#26354A]/60 border-2 border-[#26354A]/30';
              }
            } else if (isSelected) {
              tileStyle = 'bg-[#FFEFAF] text-[#26354A] border-[3px] border-[#26354A] shadow-md scale-[1.02]';
            }

            return (
              <button
                key={opt}
                disabled={isSubmitted}
                onClick={() => selectOption(opt)}
                className={`flex flex-col items-center justify-center min-h-[90px] p-3 rounded-[24px] text-[22px] font-black transition-all cursor-pointer ${tileStyle}`}
                aria-pressed={isSelected}
              >
                <span>{opt}</span>
                {statusLabel && (
                  <span className="text-[12px] font-black tracking-wide uppercase mt-1">
                    {statusLabel}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Actions / Slide-up Feedback Banner */}
      <div className="w-full mt-6">
        {!isSubmitted ? (
          <button
            disabled={!selectedOption}
            onClick={checkAnswer}
            className={`w-full py-4.5 rounded-[20px] font-extrabold text-[18px] transition-all ${
              selectedOption
                ? 'bg-[#26354A] text-white shadow-md hover:bg-[#1a2636] active:scale-[0.98] cursor-pointer'
                : 'bg-[#C5CCD6] text-white/90 cursor-not-allowed'
            }`}
            aria-label="Check answer"
          >
            Check answer
          </button>
        ) : (
          <div
            className={`p-5 rounded-[24px] border-2 border-[#26354A] shadow-md space-y-4 animate-fadeIn ${
              isCorrect ? 'bg-[#E0F7ED]' : 'bg-[#FFE8E6]'
            }`}
          >
            <div>
              <h3 className="text-[22px] font-black text-[#26354A]">
                {isCorrect ? 'Great job! +1' : 'Almost there!'}
              </h3>
              <p className="text-[15px] font-bold text-[#26354A]/90 mt-1 leading-snug">
                {currentQ.explanation}
              </p>
            </div>

            <button
              onClick={nextQuestion}
              className="w-full py-4 bg-[#26354A] text-white font-extrabold text-[18px] rounded-[20px] shadow-sm hover:bg-[#1a2636] active:scale-[0.98] transition-all cursor-pointer"
              aria-label="Next question"
            >
              Next question
            </button>
          </div>
        )}
      </div>

      {/* Overlays */}
      {isPaused && !showExitDialog && <PauseOverlay />}
      {showExitDialog && <ExitConfirmationDialog />}
    </div>
  );
};
