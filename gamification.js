class GamificationSystem {
  constructor() {
    this.storageKey = 'adaptohubGamification';
    this.data = this.loadData();
    this.initializeUserData();
  }

  initializeUserData() {
    const user = JSON.parse(localStorage.getItem('adaptohubUser') || '{}');
    if (!user.id) return;

    if (!this.data[user.id]) {
      this.data[user.id] = {
        userId: user.id,
        username: user.fullName || user.firstName,
        points: 0,
        coins: 0,
        totalQuizzesCompleted: 0,
        totalPerfectScores: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastQuizDate: null,
        achievements: [],
        unlockedAchievements: [],
        quizHistory: [],
        subjectScores: {},
        helpOthersCount: 0,
        leaderboardRanks: {}
      };
      this.saveData();
    }
  }

  loadData() {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : {};
  }

  saveData() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
  }

  getCurrentUserId() {
    const user = JSON.parse(localStorage.getItem('adaptohubUser') || '{}');
    return user.id;
  }

  getUserProfile(userId = null) {
    userId = userId || this.getCurrentUserId();
    return this.data[userId] || null;
  }

  recordQuizCompletion(userId, quizData) {
    const profile = this.data[userId];
    if (!profile) return;

    const {
      subject,
      quizTitle,
      score,
      maxScore = 100,
      timeSpentSeconds = 0,
      questionsAnswered = 0
    } = quizData;

    const scorePercentage = (score / maxScore) * 100;
    const basePoints = scorePercentage >= 90 ? 100 : scorePercentage >= 70 ? 50 : 25;

    let pointsEarned = Math.floor(basePoints * (scorePercentage / 100));
    const bonusPoints = this.calculateBonusPoints(scorePercentage, timeSpentSeconds, profile.currentStreak);
    pointsEarned += bonusPoints;

    profile.points += pointsEarned;
    profile.totalQuizzesCompleted++;

    if (scorePercentage === 100) {
      profile.totalPerfectScores++;
    }

    this.updateStreak(profile);

    this.updateSubjectScore(profile, subject, scorePercentage);

    profile.quizHistory.push({
      date: new Date().toISOString(),
      subject,
      quizTitle,
      score: scorePercentage,
      pointsEarned,
      timeSpent: timeSpentSeconds
    });

    profile.lastQuizDate = new Date().toISOString();

    this.checkAchievements(userId);

    this.saveData();
    
    // Dispatch event to update points display
    window.dispatchEvent(new CustomEvent('gamification:pointsEarned', { 
      detail: { points: pointsEarned, reason: 'Quiz Completed' } 
    }));
    
    return pointsEarned;
  }

  calculateBonusPoints(scorePercentage, timeSpentSeconds, currentStreak) {
    let bonus = 0;

    if (currentStreak > 0) {
      bonus += Math.min(currentStreak * 5, 50);
    }

    if (scorePercentage === 100) {
      bonus += 50;
    }

    if (timeSpentSeconds > 0 && timeSpentSeconds <= 300) {
      bonus += 30;
    }

    return bonus;
  }

  updateStreak(profile) {
    const today = new Date().toDateString();
    const lastQuizDate = profile.lastQuizDate ? new Date(profile.lastQuizDate).toDateString() : null;

    if (lastQuizDate === today) {
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (lastQuizDate === yesterday.toDateString()) {
      profile.currentStreak++;
    } else {
      profile.currentStreak = 1;
    }

    if (profile.currentStreak > profile.longestStreak) {
      profile.longestStreak = profile.currentStreak;
    }
  }

  updateSubjectScore(profile, subject, scorePercentage) {
    if (!profile.subjectScores[subject]) {
      profile.subjectScores[subject] = {
        totalScore: 0,
        quizzesCompleted: 0,
        averageScore: 0
      };
    }

    const subjectData = profile.subjectScores[subject];
    subjectData.totalScore += scorePercentage;
    subjectData.quizzesCompleted++;
    subjectData.averageScore = subjectData.totalScore / subjectData.quizzesCompleted;
  }

  checkAchievements(userId) {
    const profile = this.data[userId];
    if (!profile) return;

    const unlockedIds = new Set(profile.unlockedAchievements.map(a => a.id));

    Object.values(ACHIEVEMENTS).forEach(achievement => {
      if (unlockedIds.has(achievement.id)) return;

      const isUnlocked = this.checkAchievementCondition(achievement, profile);
      if (isUnlocked) {
        this.unlockAchievement(userId, achievement);
      }
    });
  }

  checkAchievementCondition(achievement, profile) {
    switch (achievement.id) {
      case 'first_quiz':
        return profile.totalQuizzesCompleted >= 1;

      case 'five_quizzes':
        return profile.totalQuizzesCompleted >= 5;

      case 'twenty_quizzes':
        return profile.totalQuizzesCompleted >= 20;

      case 'fifty_quizzes':
        return profile.totalQuizzesCompleted >= 50;

      case 'first_perfect':
        return profile.totalPerfectScores >= 1;

      case 'five_perfects':
        return profile.totalPerfectScores >= 5;

      case 'ten_perfects':
        return profile.totalPerfectScores >= 10;

      case 'three_day_streak':
        return profile.currentStreak >= 3;

      case 'seven_day_streak':
        return profile.currentStreak >= 7;

      case 'thirty_day_streak':
        return profile.currentStreak >= 30;

      case 'hundred_day_streak':
        return profile.currentStreak >= 100;

      case 'math_master':
      case 'science_sage':
      case 'history_historian':
        const avg = profile.subjectScores[achievement.subject]?.averageScore || 0;
        return avg >= 90 && profile.subjectScores[achievement.subject]?.quizzesCompleted >= 3;

      case 'helping_hand':
        return profile.helpOthersCount >= 5;

      case 'thousand_points':
        return profile.points >= 1000;

      case 'five_thousand_points':
        return profile.points >= 5000;

      default:
        return false;
    }
  }

  unlockAchievement(userId, achievement) {
    const profile = this.data[userId];
    if (!profile) return;

    const unlockedData = {
      id: achievement.id,
      name: achievement.name,
      icon: achievement.icon,
      rarity: achievement.rarity,
      unlockedDate: new Date().toISOString()
    };

    profile.unlockedAchievements.push(unlockedData);

    if (achievement.points > 0) {
      profile.points += achievement.points;
    }

    this.saveData();

    this.triggerAchievementCelebration(achievement);

    return unlockedData;
  }

  triggerAchievementCelebration(achievement) {
    const event = new CustomEvent('achievementUnlocked', {
      detail: { achievement }
    });
    document.dispatchEvent(event);

    this.showAchievementNotification(achievement);
  }

  showAchievementNotification(achievement) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
      <div class="achievement-notification-content">
        <div class="achievement-notification-icon">${achievement.icon}</div>
        <div class="achievement-notification-text">
          <div class="achievement-notification-title">${achievement.name}</div>
          <div class="achievement-notification-desc">${achievement.description}</div>
          <div class="achievement-notification-points">+${achievement.points || 0} points</div>
        </div>
      </div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 100);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 4000);
  }

  getLeaderboard(subject = null, timeframe = 'weekly') {
    const cutoffDate = this.getCutoffDate(timeframe);
    const leaderboard = [];

    Object.entries(this.data).forEach(([userId, profile]) => {
      let score = 0;

      if (subject) {
        const recentQuizzes = profile.quizHistory.filter(q =>
          new Date(q.date) >= cutoffDate && q.subject === subject
        );
        score = recentQuizzes.reduce((sum, q) => sum + q.score, 0) / (recentQuizzes.length || 1);
      } else {
        const recentQuizzes = profile.quizHistory.filter(q =>
          new Date(q.date) >= cutoffDate
        );
        score = recentQuizzes.reduce((sum, q) => sum + q.pointsEarned, 0);
      }

      if (score > 0 || profile.quizHistory.length > 0) {
        leaderboard.push({
          userId,
          username: profile.username,
          score,
          totalQuizzes: profile.totalQuizzesCompleted,
          currentStreak: profile.currentStreak,
          totalPoints: profile.points
        });
      }
    });

    return leaderboard.sort((a, b) => b.score - a.score);
  }

  getCutoffDate(timeframe) {
    const now = new Date();
    switch (timeframe) {
      case 'weekly':
        now.setDate(now.getDate() - 7);
        break;
      case 'monthly':
        now.setMonth(now.getMonth() - 1);
        break;
      case 'yearly':
        now.setFullYear(now.getFullYear() - 1);
        break;
      case 'alltime':
        return new Date(0);
    }
    return now;
  }

  redeemReward(userId, rewardId, cost) {
    const profile = this.data[userId];
    if (!profile) return { success: false, message: 'User not found' };

    if (profile.points < cost) {
      return { success: false, message: 'Not enough points' };
    }

    profile.points -= cost;
    profile.coins += cost / 10;

    this.saveData();
    return { success: true, message: 'Reward redeemed!', coins: profile.coins };
  }

  useStreakFreeze(userId) {
    const profile = this.data[userId];
    if (!profile) return { success: false };

    if (!profile.streakFreezeCount) profile.streakFreezeCount = 0;
    if (!profile.streakFreezeLastUsed) profile.streakFreezeLastUsed = null;

    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    if (profile.streakFreezeLastUsed && new Date(profile.streakFreezeLastUsed) < monthAgo) {
      profile.streakFreezeCount = 0;
    }

    if (profile.streakFreezeCount >= 1) {
      return { success: false, message: 'You can only use 1 freeze per month' };
    }

    profile.streakFreezeCount++;
    profile.streakFreezeLastUsed = new Date().toISOString();

    this.saveData();
    return { success: true, message: 'Streak freeze activated!' };
  }

  getStreakCalendarData(userId, months = 12) {
    const profile = this.data[userId];
    if (!profile) return {};

    const calendarData = {};
    const quizDates = new Set(
      profile.quizHistory.map(q => new Date(q.date).toDateString())
    );

    const endDate = new Date();
    for (let i = 0; i < months * 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      calendarData[dateStr] = quizDates.has(date.toDateString()) ? 1 : 0;
    }

    return calendarData;
  }

  recordHelpingOther(userId) {
    const profile = this.data[userId];
    if (!profile) return;

    profile.helpOthersCount = (profile.helpOthersCount || 0) + 1;
    profile.points += 10;

    this.checkAchievements(userId);
    this.saveData();
  }

  getAchievementsByRarity() {
    const grouped = {};
    RARITY_ORDER.forEach(rarity => {
      grouped[rarity] = Object.values(ACHIEVEMENTS).filter(a => a.rarity === rarity);
    });
    return grouped;
  }

  getUserAchievementProgress(userId) {
    const profile = this.data[userId];
    if (!profile) return { unlocked: [], locked: [] };

    const unlockedIds = new Set(profile.unlockedAchievements.map(a => a.id));
    const unlocked = profile.unlockedAchievements;
    const locked = Object.values(ACHIEVEMENTS).filter(a => !unlockedIds.has(a.id));

    return { unlocked, locked };
  }

  getStats(userId) {
    const profile = this.data[userId];
    if (!profile) return null;

    return {
      points: profile.points,
      coins: profile.coins,
      totalQuizzesCompleted: profile.totalQuizzesCompleted,
      totalPerfectScores: profile.totalPerfectScores,
      currentStreak: profile.currentStreak,
      longestStreak: profile.longestStreak,
      achievementsUnlocked: profile.unlockedAchievements.length,
      achievementsTotal: Object.keys(ACHIEVEMENTS).length,
      subjectScores: profile.subjectScores,
      leaderboardRanks: profile.leaderboardRanks
    };
  }

  addPoints(points, reason = 'activity') {
    const userId = this.getCurrentUserId();
    const profile = this.data[userId];
    if (!profile) return;

    profile.points += points;
    this.saveData();
    
    if (points >= 50) {
      window.dispatchEvent(new CustomEvent('gamification:pointsEarned', { 
        detail: { points, reason } 
      }));
    }
  }

  getTotalPoints() {
    const profile = this.getUserProfile();
    return profile ? profile.points : 0;
  }

  getLevel() {
    const points = this.getTotalPoints();
    return Math.floor(points / 100) + 1;
  }

  unlockAchievement(achievementId) {
    const userId = this.getCurrentUserId();
    const profile = this.data[userId];
    if (!profile) return;

    const achievement = ACHIEVEMENTS[achievementId];
    if (!achievement) return;

    const alreadyUnlocked = profile.unlockedAchievements.some(a => a.id === achievementId);
    if (alreadyUnlocked) return;

    profile.unlockedAchievements.push({
      id: achievementId,
      ...achievement,
      unlockedAt: new Date().toISOString()
    });

    profile.points += achievement.points;
    
    this.saveData();

    window.dispatchEvent(new CustomEvent('gamification:achievementUnlocked', { 
      detail: { achievement } 
    }));
  }
}

const gamification = new GamificationSystem();
const gamificationSystem = gamification;
window.gamification = gamification;
window.gamificationSystem = gamificationSystem;