import { GameModeInfo, BuddyInfo, Badge, DailyQuest } from '../types/game.js';

export const BUDDIES: BuddyInfo[] = [
  {
    id: 'pip',
    name: 'Pip',
    color: '#FFD45C', // Sunny Yellow
    bgFill: '#FFE89E',
    personality: 'Curious & energetic inventor',
  },
  {
    id: 'oliver',
    name: 'Oliver',
    color: '#79DDB0', // Mint Green
    bgFill: '#B8F1D7',
    personality: 'Gentle nature & science lover',
  },
  {
    id: 'nova',
    name: 'Nova',
    color: '#56B7F5', // Sky Blue
    bgFill: '#A6DCFD',
    personality: 'Brave cosmic explorer',
  },
  {
    id: 'ruby',
    name: 'Ruby',
    color: '#FF8178', // Coral
    bgFill: '#FFB8B3',
    personality: 'Creative spark & fast thinker',
  },
  {
    id: 'luna',
    name: 'Luna',
    color: '#A79AF5', // Brain Purple
    bgFill: '#CFC7FC',
    personality: 'Calm puzzle & mystery solver',
  },
  {
    id: 'milo',
    name: 'Milo',
    color: '#FFAA75', // Peach
    bgFill: '#FFD3BC',
    personality: 'Friendly builder & cheerleader',
  },
];

export const GAMES: GameModeInfo[] = [
  {
    id: 'math-quest',
    name: 'Math Quest',
    tagline: 'Puzzles, equations and number sequences',
    description: 'Solve puzzles, beat equations and earn stars in Math Quest.',
    icon: '+',
    primaryColor: '#FFD45C', // Sunny
    secondaryColor: '#56B7F5', // Sky
    lightBg: '#FFF6D6',
    worlds: [
      {
        worldNumber: 1,
        title: 'Number Trails',
        description: 'Puzzles, equations and number sequences',
        totalLevels: 8,
      },
      {
        worldNumber: 2,
        title: 'Equation Garden',
        description: 'Balance formulas and grow number flowers',
        totalLevels: 4,
      },
      {
        worldNumber: 3,
        title: 'Pattern Peaks',
        description: 'Climb peaks by discovering number rhythms',
        totalLevels: 4,
      },
      {
        worldNumber: 4,
        title: 'Fraction Falls',
        description: 'Divide waterways and match equal parts',
        totalLevels: 4,
      },
    ],
  },
  {
    id: 'science-explorer',
    name: 'Science Explorer',
    tagline: 'Identify, sort and discover how things work',
    description: 'Discover habitats, travel through space and test forces.',
    icon: '◈',
    primaryColor: '#79DDB0', // Mint
    secondaryColor: '#28A779', // Teal accent
    lightBg: '#E0F7ED',
    worlds: [
      {
        worldNumber: 1,
        title: 'Living Things',
        description: 'Habitats, plants and animal adaptations',
        totalLevels: 8,
      },
      {
        worldNumber: 2,
        title: 'Space Voyage',
        description: 'Planets, stars and cosmic mysteries',
        totalLevels: 4,
      },
      {
        worldNumber: 3,
        title: 'States of Matter',
        description: 'Solids, liquids, gases and melting mysteries',
        totalLevels: 4,
      },
      {
        worldNumber: 4,
        title: 'Forces at Play',
        description: 'Gravity, magnets and kinetic motion',
        totalLevels: 4,
      },
    ],
  },
  {
    id: 'brain-trails',
    name: 'Brain Trails',
    tagline: 'Logic puzzles, patterns and deduction',
    description: 'Sharpen your reasoning with mazes, sequences and deduction.',
    icon: '?',
    primaryColor: '#A79AF5', // Soft Purple
    secondaryColor: '#FF8178', // Coral accent
    lightBg: '#EFEAFF',
    worlds: [
      {
        worldNumber: 1,
        title: 'Pattern Lab',
        description: 'Decode shapes, color rhythms and visual riddles',
        totalLevels: 8,
      },
      {
        worldNumber: 2,
        title: 'Maze Run',
        description: 'Find optimal paths and navigate tricky labyrinths',
        totalLevels: 4,
      },
      {
        worldNumber: 3,
        title: 'Sequence Station',
        description: 'Train stations with logical orders and steps',
        totalLevels: 4,
      },
      {
        worldNumber: 4,
        title: 'Deduction Den',
        description: 'Use clues to uncover secret identities and answers',
        totalLevels: 4,
      },
    ],
  },
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'first-steps',
    badgeNumber: 1,
    name: 'First Steps',
    description: 'Complete your first learning level.',
    icon: '1',
    color: '#FFD45C',
    unlocked: true,
    unlockedAt: '2026-10-20',
  },
  {
    id: 'number-ninja',
    badgeNumber: 2,
    name: 'Number Ninja',
    description: 'Complete 3 Math Quest levels.',
    icon: '2',
    color: '#79DDB0',
    unlocked: true,
    unlockedAt: '2026-10-21',
  },
  {
    id: 'star-scout',
    badgeNumber: 3,
    name: 'Star Scout',
    description: 'Collect 10 stars across any game mode.',
    icon: '3',
    color: '#A79AF5',
    unlocked: true,
    unlockedAt: '2026-10-22',
  },
  {
    id: 'pattern-pro',
    badgeNumber: 4,
    name: 'Pattern Pro',
    description: 'Finish 3 Brain Trails levels.',
    icon: '4',
    color: '#56B7F5',
    unlocked: true,
    unlockedAt: '2026-10-23',
  },
  {
    id: 'streak-5',
    badgeNumber: 5,
    name: 'Streak 5',
    description: 'Keep your learning streak going for 5 consecutive days.',
    icon: '5',
    color: '#FF8178',
    unlocked: true,
    unlockedAt: '2026-10-24',
  },
  {
    id: 'quiz-whiz',
    badgeNumber: 6,
    name: 'Quiz Whiz',
    description: 'Score a perfect 3 out of 3 stars in 3 separate quizzes.',
    icon: '6',
    color: '#FFD45C',
    unlocked: false,
  },
  {
    id: 'maze-master',
    badgeNumber: 7,
    name: 'Maze Master',
    description: 'Complete all levels in a Brain Trails world.',
    icon: '7',
    color: '#79DDB0',
    unlocked: false,
  },
  {
    id: 'space-cadet',
    badgeNumber: 8,
    name: 'Space Cadet',
    description: 'Complete 3 Science Explorer levels.',
    icon: '8',
    color: '#56B7F5',
    unlocked: false,
  },
  {
    id: 'brainiac',
    badgeNumber: 9,
    name: 'Brainiac',
    description: 'Complete 15 total game levels across Playtown Learn.',
    icon: '9',
    color: '#A79AF5',
    unlocked: false,
  },
];

export const INITIAL_DAILY_QUESTS: DailyQuest[] = [
  {
    id: 'quest-finish-2-games',
    title: 'Finish 2 games',
    target: 2,
    currentProgress: 1,
    completed: false,
    claimed: false,
    xpReward: 50,
  },
  {
    id: 'quest-score-3-stars',
    title: 'Score 3 stars once',
    target: 1,
    currentProgress: 0,
    completed: false,
    claimed: false,
    xpReward: 50,
  },
];
