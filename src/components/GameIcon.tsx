import React from 'react';
import { GameId } from '../types/game.js';

interface GameIconProps {
  gameId: GameId;
  size?: number;
  className?: string;
}

export const GameIcon: React.FC<GameIconProps> = ({
  gameId,
  size = 28,
  className = '',
}) => {
  if (gameId === 'math-quest') {
    return (
      <span
        className={`font-black select-none text-[#26354A] ${className}`}
        style={{ fontSize: `${size}px`, lineHeight: 1 }}
      >
        +
      </span>
    );
  }

  if (gameId === 'science-explorer') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`select-none text-[#26354A] ${className}`}
      >
        {/* Outer rotated diamond with thick ink border */}
        <path
          d="M 12 3 L 21 12 L 12 21 L 3 12 Z"
          fill="#26354A"
        />
        {/* Inner hollow diamond matching PDF Page 1, 6, 7, 17 */}
        <path
          d="M 12 7 L 17 12 L 12 17 L 7 12 Z"
          fill="#79DDB0"
        />
      </svg>
    );
  }

  // Brain trails
  return (
    <span
      className={`font-black select-none text-[#26354A] ${className}`}
      style={{ fontSize: `${size}px`, lineHeight: 1 }}
    >
      ?
    </span>
  );
};
