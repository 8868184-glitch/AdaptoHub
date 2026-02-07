const GamificationIntegration = {
  init() {
    if (window.FeatureIntegration) {
      const originalOnQuizComplete = window.FeatureIntegration.onQuizComplete;
      
      window.FeatureIntegration.onQuizComplete = function(unitId, score, subject) {
        if (originalOnQuizComplete) {
          originalOnQuizComplete.call(this, unitId, score, subject);
        }

        GamificationIntegration.recordQuizCompletion(unitId, score, subject);
      };
    }

    document.addEventListener('achievementUnlocked', (e) => {
      this.handleAchievementUnlock(e.detail.achievement);
    });
  },

  recordQuizCompletion(unitId, score, subject) {
    const userId = gamification.getCurrentUserId();
    if (!userId) return;

    const timeSpent = this.getTimeSpentOnQuiz(unitId);

    const pointsEarned = gamification.recordQuizCompletion(userId, {
      subject: subject || 'General',
      quizTitle: unitId,
      score: score,
      maxScore: 100,
      timeSpentSeconds: timeSpent
    });

    this.showPointsNotification(pointsEarned);

    this.triggerGameificationCelebrations(score, pointsEarned);
  },

  getTimeSpentOnQuiz(unitId) {
    const startTime = sessionStorage.getItem(`quiz_start_${unitId}`);
    if (startTime) {
      const timeSpent = (Date.now() - parseInt(startTime)) / 1000;
      sessionStorage.removeItem(`quiz_start_${unitId}`);
      return Math.floor(timeSpent);
    }
    return 300;
  },

  showPointsNotification(pointsEarned) {
    if (pointsEarned <= 0) return;

    const notification = document.createElement('div');
    notification.className = 'points-earned-notification';
    notification.innerHTML = `
      <div class="points-notification-content">
        <span class="points-icon">⭐</span>
        <span class="points-text">+${pointsEarned} Points Earned!</span>
      </div>
    `;
    notification.style.cssText = `
      position: fixed;
      bottom: 80px;
      right: 20px;
      background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
      color: white;
      padding: 16px 20px;
      border-radius: 8px;
      box-shadow: 0 8px 24px rgba(243, 156, 18, 0.3);
      font-weight: 600;
      animation: slideUpIn 0.4s ease;
      z-index: 999;
      display: flex;
      align-items: center;
      gap: 10px;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideUpOut 0.4s ease forwards';
      setTimeout(() => notification.remove(), 400);
    }, 2500);
  },

  triggerGameificationCelebrations(score, pointsEarned) {
    const stats = gamification.getStats(gamification.getCurrentUserId());
    if (!stats) return;

    if (stats.currentStreak > 0 && stats.currentStreak % 7 === 0) {
      this.showStreakMilestoneNotification(stats.currentStreak);
    }

    if (score === 100) {
      this.showPerfectScoreCelebration();
    }

    const milestones = [1000, 5000, 10000, 25000];
    if (milestones.includes(stats.points)) {
      this.showPointMilestoneNotification(stats.points);
    }
  },

  showStreakMilestoneNotification(streak) {
    const notification = document.createElement('div');
    notification.className = 'streak-milestone-notification';
    notification.innerHTML = `
      <div class="milestone-content">
        <span class="milestone-icon">🔥</span>
        <div class="milestone-text">
          <div class="milestone-title">${streak}-Day Streak!</div>
          <div class="milestone-subtitle">Keep the momentum going! 🚀</div>
        </div>
      </div>
    `;
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
      color: white;
      padding: 20px 24px;
      border-radius: 12px;
      box-shadow: 0 12px 32px rgba(231, 76, 60, 0.4);
      animation: bounceIn 0.6s ease;
      z-index: 999;
      display: flex;
      align-items: center;
      gap: 16px;
      font-weight: 600;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'bounceOut 0.6s ease forwards';
      setTimeout(() => notification.remove(), 600);
    }, 3500);
  },

  showPerfectScoreCelebration() {
    const notification = document.createElement('div');
    notification.className = 'perfect-score-notification';
    notification.innerHTML = `
      <div class="perfect-content">
        <span class="perfect-icon">💯</span>
        <div class="perfect-text">
          <div class="perfect-title">Perfect Score!</div>
          <div class="perfect-subtitle">Flawless execution! +50 bonus points</div>
        </div>
      </div>
    `;
    notification.style.cssText = `
      position: fixed;
      top: 150px;
      right: 20px;
      background: linear-gradient(135deg, #f1c40f 0%, #f39c12 100%);
      color: #333;
      padding: 20px 24px;
      border-radius: 12px;
      box-shadow: 0 12px 32px rgba(241, 196, 15, 0.4);
      animation: slideInRight 0.6s ease;
      z-index: 999;
      display: flex;
      align-items: center;
      gap: 16px;
      font-weight: 600;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.6s ease forwards';
      setTimeout(() => notification.remove(), 600);
    }, 3500);
  },

  showPointMilestoneNotification(points) {
    const titles = {
      1000: '💰 Coin Collector',
      5000: '💎 Treasure Hunter',
      10000: '👑 Points Legend',
      25000: '🌟 Legendary Status'
    };

    const notification = document.createElement('div');
    notification.className = 'point-milestone-notification';
    notification.innerHTML = `
      <div class="milestone-content">
        <span class="milestone-icon">${points >= 25000 ? '🌟' : points >= 10000 ? '👑' : points >= 5000 ? '💎' : '💰'}</span>
        <div class="milestone-text">
          <div class="milestone-title">${titles[points] || 'Points Milestone'}</div>
          <div class="milestone-subtitle">You've reached ${points} points!</div>
        </div>
      </div>
    `;
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);
      color: white;
      padding: 20px 24px;
      border-radius: 12px;
      box-shadow: 0 12px 32px rgba(155, 89, 182, 0.4);
      animation: popIn 0.5s ease;
      z-index: 999;
      display: flex;
      align-items: center;
      gap: 16px;
      font-weight: 600;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'popOut 0.5s ease forwards';
      setTimeout(() => notification.remove(), 500);
    }, 4000);
  },

  handleAchievementUnlock(achievement) {
    console.log(`🏆 Achievement Unlocked: ${achievement.name}`);

    this.triggerAchievementUnlockEffect(achievement);
  },

  triggerAchievementUnlockEffect(achievement) {
    if (window.Celebrations && window.Celebrations.perfectScore) {
      window.Celebrations.perfectScore();
    }

    const popup = document.createElement('div');
    popup.className = 'achievement-unlock-popup';
    popup.innerHTML = `
      <div class="achievement-popup-content">
        <div class="achievement-popup-icon">${achievement.icon}</div>
        <div class="achievement-popup-text">
          <div class="popup-title">Achievement Unlocked!</div>
          <div class="popup-name">${achievement.name}</div>
          <div class="popup-desc">${achievement.description}</div>
          <div class="popup-rarity" style="color: ${RARITY_COLORS[achievement.rarity] || '#999'}">
            ${achievement.rarity.toUpperCase()}
          </div>
          <div class="popup-points">+${achievement.points} Points</div>
        </div>
      </div>
    `;
    popup.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      animation: scaleUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      z-index: 2000;
      text-align: center;
      max-width: 400px;
      border: 2px solid ${RARITY_COLORS[achievement.rarity] || '#999'};
    `;

    document.body.appendChild(popup);

    setTimeout(() => {
      popup.style.animation = 'scaleDown 0.5s cubic-bezier(0.6, 0.04, 0.98, 0.335) forwards';
      setTimeout(() => popup.remove(), 500);
    }, 3500);
  },

  trackQuizStart(unitId) {
    sessionStorage.setItem(`quiz_start_${unitId}`, Date.now().toString());
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (window.gamification) {
      GamificationIntegration.init();
    }
  });
} else {
  if (window.gamification) {
    GamificationIntegration.init();
  }
}

const style = document.createElement('style');
style.innerHTML = `
  @keyframes slideUpIn {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes slideUpOut {
    from {
      transform: translateY(0);
      opacity: 1;
    }
    to {
      transform: translateY(20px);
      opacity: 0;
    }
  }

  @keyframes bounceIn {
    0% {
      transform: scale(0.3);
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    70% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes bounceOut {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    30% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(0.3);
      opacity: 0;
    }
  }

  @keyframes slideInRight {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }

  @keyframes popIn {
    from {
      transform: translate(-50%, -50%) scale(0.5);
      opacity: 0;
    }
    to {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
  }

  @keyframes popOut {
    from {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
    to {
      transform: translate(-50%, -50%) scale(0.5);
      opacity: 0;
    }
  }

  @keyframes scaleUp {
    from {
      transform: translate(-50%, -50%) scale(0.3);
      opacity: 0;
    }
    to {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
  }

  @keyframes scaleDown {
    from {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
    to {
      transform: translate(-50%, -50%) scale(0.3);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
