const ACHIEVEMENTS = {
  FIRST_QUIZ: {
    id: 'first_quiz',
    name: '🎯 Quiz Starter',
    description: 'Complete your first quiz',
    icon: '🎯',
    rarity: 'common',
    points: 50,
    condition: () => true
  },
  FIVE_QUIZZES: {
    id: 'five_quizzes',
    name: '📚 Quiz Enthusiast',
    description: 'Complete 5 quizzes',
    icon: '📚',
    rarity: 'common',
    points: 100,
    threshold: 5
  },
  TWENTY_QUIZZES: {
    id: 'twenty_quizzes',
    name: '🏆 Quiz Master',
    description: 'Complete 20 quizzes',
    icon: '🏆',
    rarity: 'uncommon',
    points: 250,
    threshold: 20
  },
  FIFTY_QUIZZES: {
    id: 'fifty_quizzes',
    name: '👑 Quiz Legend',
    description: 'Complete 50 quizzes',
    icon: '👑',
    rarity: 'rare',
    points: 500,
    threshold: 50
  },

  FIRST_PERFECT: {
    id: 'first_perfect',
    name: '💯 Perfect Score',
    description: 'Get 100% on a quiz',
    icon: '💯',
    rarity: 'uncommon',
    points: 200
  },
  FIVE_PERFECTS: {
    id: 'five_perfects',
    name: '✨ Perfection Seeker',
    description: 'Get 100% on 5 quizzes',
    icon: '✨',
    rarity: 'rare',
    points: 400,
    threshold: 5
  },
  TEN_PERFECTS: {
    id: 'ten_perfects',
    name: '🌟 Perfect Streak',
    description: 'Get 100% on 10 quizzes',
    icon: '🌟',
    rarity: 'epic',
    points: 750,
    threshold: 10
  },

  THREE_DAY_STREAK: {
    id: 'three_day_streak',
    name: '🔥 On Fire',
    description: 'Maintain a 3-day learning streak',
    icon: '🔥',
    rarity: 'uncommon',
    points: 150,
    streakDays: 3
  },
  SEVEN_DAY_STREAK: {
    id: 'seven_day_streak',
    name: '🌊 Wave Rider',
    description: 'Maintain a 7-day learning streak',
    icon: '🌊',
    rarity: 'rare',
    points: 300,
    streakDays: 7
  },
  THIRTY_DAY_STREAK: {
    id: 'thirty_day_streak',
    name: '💪 Unstoppable',
    description: 'Maintain a 30-day learning streak',
    icon: '💪',
    rarity: 'epic',
    points: 750,
    streakDays: 30
  },
  HUNDRED_DAY_STREAK: {
    id: 'hundred_day_streak',
    name: '👨‍🚀 Legendary',
    description: 'Maintain a 100-day learning streak',
    icon: '👨‍🚀',
    rarity: 'legendary',
    points: 2000,
    streakDays: 100
  },

  MATH_MASTER: {
    id: 'math_master',
    name: '🧮 Math Master',
    description: 'Get average score of 90%+ in Mathematics quizzes',
    icon: '🧮',
    rarity: 'uncommon',
    points: 200,
    subject: 'Mathematics'
  },
  SCIENCE_SAGE: {
    id: 'science_sage',
    name: '🔬 Science Sage',
    description: 'Get average score of 90%+ in Science quizzes',
    icon: '🔬',
    rarity: 'uncommon',
    points: 200,
    subject: 'Science'
  },
  HISTORY_HISTORIAN: {
    id: 'history_historian',
    name: '📜 Historian',
    description: 'Get average score of 90%+ in History quizzes',
    icon: '📜',
    rarity: 'uncommon',
    points: 200,
    subject: 'History'
  },

  SPEED_DEMON: {
    id: 'speed_demon',
    name: '⚡ Speed Demon',
    description: 'Complete a quiz in under 5 minutes with 80%+ score',
    icon: '⚡',
    rarity: 'uncommon',
    points: 150,
    timeLimit: 300
  },

  HELPING_HAND: {
    id: 'helping_hand',
    name: '🤝 Helping Hand',
    description: 'Help 5 other students with their questions',
    icon: '🤝',
    rarity: 'uncommon',
    points: 200,
    helpThreshold: 5
  },

  THOUSAND_POINTS: {
    id: 'thousand_points',
    name: '💰 Coin Collector',
    description: 'Earn 1,000 points',
    icon: '💰',
    rarity: 'uncommon',
    points: 0,
    pointsThreshold: 1000
  },
  FIVE_THOUSAND_POINTS: {
    id: 'five_thousand_points',
    name: '💎 Treasure Hunter',
    description: 'Earn 5,000 points',
    icon: '💎',
    rarity: 'rare',
    points: 0,
    pointsThreshold: 5000
  },

  TOP_LEADERBOARD: {
    id: 'top_leaderboard',
    name: '🥇 Champion',
    description: 'Rank #1 on weekly leaderboard',
    icon: '🥇',
    rarity: 'epic',
    points: 500
  },
  TOP_THREE: {
    id: 'top_three',
    name: '🥈 Top Contender',
    description: 'Rank in top 3 on any leaderboard',
    icon: '🥈',
    rarity: 'rare',
    points: 250
  }
};

const RARITY_COLORS = {
  common: '#95a5a6',
  uncommon: '#27ae60',
  rare: '#3498db',
  epic: '#9b59b6',
  legendary: '#f39c12'
};

const RARITY_ORDER = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
