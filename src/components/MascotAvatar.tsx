import React from 'react';
import { BuddyId } from '../types/game.js';
import { BUDDIES } from '../data/gameData.js';

interface MascotAvatarProps {
  buddyId: BuddyId;
  size?: number | string;
  showBorder?: boolean;
  className?: string;
  expression?: 'happy' | 'thinking' | 'sad' | 'excited';
}

export const MascotAvatar: React.FC<MascotAvatarProps> = ({
  buddyId,
  size = 48,
  showBorder = true,
  className = '',
  expression = 'happy',
}) => {
  const buddy = BUDDIES.find((b) => b.id === buddyId) || BUDDIES[0];

  // Specific antenna/hair accent per buddy
  const renderBuddyFeatures = () => {
    switch (buddyId) {
      case 'pip':
        // Yellow smiling buddy with red/coral antenna on top
        return (
          <>
            {/* Antenna stalk */}
            <path d="M 50 14 L 50 24" stroke="#26354A" strokeWidth="3" strokeLinecap="round" />
            {/* Antenna ball */}
            <circle cx="50" cy="12" r="5" fill="#FF8178" stroke="#26354A" strokeWidth="2.5" />
            {/* Hair cap or bangs */}
            <path
              d="M 28 42 C 34 32, 66 32, 72 42 C 65 37, 35 37, 28 42 Z"
              fill="#26354A"
            />
          </>
        );
      case 'oliver':
        // Mint buddy with nature sprout leaf
        return (
          <>
            <path d="M 50 16 Q 44 8 50 4 Q 56 8 50 16 Z" fill="#79DDB0" stroke="#26354A" strokeWidth="2" />
            <path d="M 50 16 L 50 25" stroke="#26354A" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 32 40 C 40 32, 60 32, 68 40 C 58 36, 42 36, 32 40 Z" fill="#603813" />
          </>
        );
      case 'nova':
        // Sky buddy with star spark
        return (
          <>
            <circle cx="50" cy="12" r="4.5" fill="#56B7F5" stroke="#26354A" strokeWidth="2.5" />
            <path d="M 50 15 L 50 24" stroke="#26354A" strokeWidth="2.5" />
            <path d="M 30 40 C 40 33, 60 33, 70 40 C 60 36, 40 36, 30 40 Z" fill="#26354A" />
          </>
        );
      case 'ruby':
        // Coral buddy with heart spark
        return (
          <>
            <circle cx="50" cy="12" r="5" fill="#FFD45C" stroke="#26354A" strokeWidth="2.5" />
            <path d="M 50 15 L 50 24" stroke="#26354A" strokeWidth="2.5" />
            <path d="M 30 42 C 40 34, 60 34, 70 42 C 60 37, 40 37, 30 42 Z" fill="#5C2626" />
          </>
        );
      case 'luna':
        // Brain purple buddy with twin soft antennae
        return (
          <>
            <path d="M 44 24 L 40 14" stroke="#26354A" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="39" cy="12" r="4" fill="#A79AF5" stroke="#26354A" strokeWidth="2" />
            <path d="M 56 24 L 60 14" stroke="#26354A" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="61" cy="12" r="4" fill="#A79AF5" stroke="#26354A" strokeWidth="2" />
            <path d="M 30 42 C 40 35, 60 35, 70 42 C 60 38, 40 38, 30 42 Z" fill="#3B2668" />
          </>
        );
      case 'milo':
        // Peach buddy with mini crown
        return (
          <>
            <path d="M 42 22 L 40 13 L 50 17 L 60 13 L 58 22 Z" fill="#FFD45C" stroke="#26354A" strokeWidth="2" />
            <path d="M 30 42 C 40 35, 60 35, 70 42 C 60 38, 40 38, 30 42 Z" fill="#26354A" />
          </>
        );
    }
  };

  const renderFace = () => {
    if (expression === 'sad') {
      // Leave dialog sad face (matching PDF page 31)
      return (
        <>
          {/* Angled eyebrows */}
          <path d="M 33 46 L 43 50" stroke="#26354A" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 67 46 L 57 50" stroke="#26354A" strokeWidth="2.5" strokeLinecap="round" />
          {/* Eyes */}
          <circle cx="38" cy="54" r="4" fill="#26354A" />
          <circle cx="62" cy="54" r="4" fill="#26354A" />
          {/* Frown */}
          <path d="M 42 70 Q 50 62 58 70" stroke="#26354A" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      );
    }

    // Default friendly smiling face matching PDF page 2, 4, 6
    return (
      <>
        {/* Eyes */}
        <ellipse cx="38" cy="52" rx="4" ry="4.5" fill="#26354A" />
        <ellipse cx="62" cy="52" rx="4" ry="4.5" fill="#26354A" />
        {/* Eye catchlights */}
        <circle cx="39.5" cy="50.5" r="1.3" fill="#FFFFFF" />
        <circle cx="63.5" cy="50.5" r="1.3" fill="#FFFFFF" />
        {/* Rosy cheeks */}
        <circle cx="30" cy="59" r="4" fill="#FF8178" opacity="0.65" />
        <circle cx="70" cy="59" r="4" fill="#FF8178" opacity="0.65" />
        {/* Cheerful curved mouth */}
        <path
          d="M 43 62 Q 50 71 57 62"
          stroke="#26354A"
          strokeWidth="3.2"
          fill="none"
          strokeLinecap="round"
        />
      </>
    );
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full select-none ${className}`}
      style={{
        width: size,
        height: size,
      }}
      aria-label={`${buddy.name} mascot`}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full overflow-visible drop-shadow-sm"
      >
        {renderBuddyFeatures()}
        {/* Main round head */}
        <circle
          cx="50"
          cy="58"
          r="36"
          fill={buddy.color}
          stroke={showBorder ? '#26354A' : 'none'}
          strokeWidth="3.2"
        />
        {/* Cute face */}
        {renderFace()}
      </svg>
    </div>
  );
};
