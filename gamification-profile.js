document.addEventListener('DOMContentLoaded', function() {
  const userId = gamification.getCurrentUserId();
  if (!userId) {
    window.location.href = 'login.html';
    return;
  }

  initializeProfile();
  setupEventListeners();
  renderStreakCalendar();
  renderAchievements();
  renderLeaderboard();
  renderSubjectPerformance();
  updateStats();
  updateGoalsPreview();
});

function initializeProfile() {
  const profile = gamification.getUserProfile();
  if (!profile) return;

  const accountName = document.getElementById('accountName');
  if (accountName) {
    accountName.textContent = profile.username;
  }
}

function updateStats() {
  const stats = gamification.getStats(gamification.getCurrentUserId());
  if (!stats) return;

  document.getElementById('pointsValue').textContent = stats.points;
  document.getElementById('coinsValue').textContent = Math.floor(stats.coins);
  document.getElementById('streakValue').textContent = stats.currentStreak;
  document.getElementById('longestStreakValue').textContent = stats.longestStreak;
  document.getElementById('quizzesValue').textContent = stats.totalQuizzesCompleted;
  document.getElementById('perfectsValue').textContent = stats.totalPerfectScores;
  document.getElementById('achievementsValue').textContent = stats.achievementsUnlocked;
  document.getElementById('achievementsTotal').textContent = stats.achievementsTotal;
}

function updateGoalsPreview() {
  const container = document.getElementById('goals-preview');
  if (!container) return;

  const goals = JSON.parse(localStorage.getItem('adaptohub_goals'));
  if (!goals || !goals.active || goals.active.length === 0) {
    container.innerHTML = '<p style="grid-column: 1/-1; color: #999; text-align: center;">No active goals. Create one to get started! 🚀</p>';
    return;
  }

  const topGoals = goals.active.slice(0, 3);
  container.innerHTML = topGoals.map(goal => {
    const categoryName = goalsSystem.goalCategories[goal.category];
    const daysLeft = Math.ceil((goal.dueDate - Date.now()) / (1000 * 60 * 60 * 24));
    
    return `
      <div style="background: white; padding: 16px; border-radius: 12px; border-left: 4px solid #8b5cf6; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="font-weight: 600; color: #1f2933; margin-bottom: 8px;">${categoryName}</div>
        <div style="display: flex; align-items: center; margin-bottom: 8px;">
          <div style="flex: 1; background: #e0e0e0; height: 6px; border-radius: 3px; margin-right: 8px;">
            <div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); height: 100%; width: ${goal.progress}%; border-radius: 3px;"></div>
          </div>
          <span style="color: #8b5cf6; font-weight: 600; font-size: 0.9rem;">${goal.progress}%</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: #636d79;">
          <span>${goal.current}/${goal.target}</span>
          <span>${daysLeft > 0 ? daysLeft + ' days' : 'Due today'}</span>
        </div>
      </div>
    `;
  }).join('');
}

function renderStreakCalendar() {
  const userId = gamification.getCurrentUserId();
  const calendarData = gamification.getStreakCalendarData(userId, 12);
  const container = document.getElementById('streakCalendar');
  
  if (!container) return;
  container.innerHTML = '';

  const sortedDates = Object.keys(calendarData).sort().reverse();
  
  sortedDates.forEach(date => {
    const day = document.createElement('div');
    day.className = 'calendar-day';
    if (calendarData[date] === 1) {
      day.classList.add('active');
    }
    day.title = date;
    day.setAttribute('data-date', date);
    container.appendChild(day);
  });
}

function renderAchievements() {
  const userId = gamification.getCurrentUserId();
  const { unlocked, locked } = gamification.getUserAchievementProgress(userId);
  const container = document.getElementById('achievementsContainer');
  
  if (!container) return;

  const allAchievements = [...unlocked, ...locked];
  renderAchievementCards(allAchievements, container);

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');

      const filter = e.target.dataset.filter;
      let filtered = allAchievements;

      if (filter !== 'all') {
        filtered = allAchievements.filter(a => a.rarity === filter);
      }

      renderAchievementCards(filtered, container);
    });
  });
}

function renderAchievementCards(achievements, container) {
  container.innerHTML = '';

  achievements.forEach(achievement => {
    const card = document.createElement('div');
    card.className = 'achievement-card';

    const isUnlocked = achievement.unlockedDate ? true : false;
    if (isUnlocked) {
      card.classList.add('unlocked');
    } else {
      card.classList.add('locked', 'achievement-badge-locked');
    }

    const rarityColor = RARITY_COLORS[achievement.rarity] || '#95a5a6';

    card.innerHTML = `
      <div class="achievement-icon">${achievement.icon}</div>
      <div class="achievement-name">${achievement.name}</div>
      <div class="achievement-desc">${achievement.description || ''}</div>
      <div class="achievement-rarity" style="background-color: ${rarityColor}">
        ${achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
      </div>
      ${isUnlocked ? `<div style="font-size: 0.7rem; color: #999; margin-top: 4px;">Unlocked: ${new Date(achievement.unlockedDate).toLocaleDateString()}</div>` : ''}
    `;

    card.addEventListener('click', () => {
      showAchievementDetails(achievement);
    });

    container.appendChild(card);
  });
}

function showAchievementDetails(achievement) {
  const modal = document.createElement('div');
  modal.className = 'achievement-modal';
  modal.innerHTML = `
    <div class="achievement-modal-content">
      <button class="modal-close">&times;</button>
      <div class="modal-icon">${achievement.icon}</div>
      <h2>${achievement.name}</h2>
      <p>${achievement.description}</p>
      <p><strong>Rarity:</strong> ${achievement.rarity}</p>
      <p><strong>Points:</strong> ${achievement.points || 0}</p>
      ${achievement.unlockedDate ? `<p style="color: #27ae60;">✓ Unlocked</p>` : '<p style="color: #e74c3c;">🔒 Locked</p>'}
    </div>
  `;

  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('modal-close')) {
      modal.remove();
    }
  });
}

function renderLeaderboard() {
  const timeframeSelect = document.getElementById('timeframeSelect');
  const leaderboardTypeSelect = document.getElementById('leaderboardTypeSelect');
  const anonymousToggle = document.getElementById('anonymousToggle');
  const container = document.getElementById('leaderboardContainer');

  if (!container) return;

  const updateLeaderboard = () => {
    const timeframe = timeframeSelect?.value || 'weekly';
    const type = leaderboardTypeSelect?.value || 'overall';
    const anonymous = anonymousToggle?.checked || false;

    let leaderboard;
    if (type === 'overall' || type === 'streak') {
      leaderboard = gamification.getLeaderboard(null, timeframe);
      if (type === 'streak') {
        leaderboard.sort((a, b) => b.currentStreak - a.currentStreak);
      }
    } else {
      leaderboard = gamification.getLeaderboard(type, timeframe);
    }

    renderLeaderboardTable(leaderboard, container, anonymous, type);
  };

  timeframeSelect?.addEventListener('change', updateLeaderboard);
  leaderboardTypeSelect?.addEventListener('change', updateLeaderboard);
  anonymousToggle?.addEventListener('change', updateLeaderboard);

  updateLeaderboard();
}

function renderLeaderboardTable(leaderboard, container, anonymous, type) {
  container.innerHTML = '';

  const medals = ['🥇', '🥈', '🥉'];
  const table = document.createElement('table');
  table.className = 'leaderboard-table';

  const headerRow = table.createTHead().insertRow();
  headerRow.innerHTML = `
    <th>Rank</th>
    <th>Player</th>
    ${type === 'streak' ? '<th>Streak Days</th>' : '<th>Score</th>'}
    <th>Quizzes</th>
  `;

  leaderboard.slice(0, 50).forEach((entry, index) => {
    const row = table.insertRow();
    const medal = medals[index] || '🔹';
    const displayName = anonymous ? `Player ${index + 1}` : entry.username;

    row.innerHTML = `
      <td class="leaderboard-rank"><span class="rank-medal">${medal}</span> #${index + 1}</td>
      <td class="leaderboard-username">${displayName}</td>
      <td class="leaderboard-score">${type === 'streak' ? entry.currentStreak : Math.floor(entry.score)}</td>
      <td>${entry.totalQuizzes}</td>
    `;
  });

  container.appendChild(table);
}

function renderSubjectPerformance() {
  const profile = gamification.getUserProfile();
  if (!profile) return;

  const container = document.getElementById('subjectPerformanceContainer');
  if (!container) return;

  container.innerHTML = '';

  const subjects = ['Mathematics', 'Science', 'History', 'Social Studies'];
  
  subjects.forEach(subject => {
    const data = profile.subjectScores[subject];
    if (!data || data.quizzesCompleted === 0) return;

    const card = document.createElement('div');
    card.className = 'subject-card';
    card.innerHTML = `
      <div class="subject-name">${subject}</div>
      <div class="subject-avg">${data.averageScore.toFixed(1)}%</div>
      <div class="subject-stats">
        <div>Quizzes: ${data.quizzesCompleted}</div>
        <div>Total: ${Math.floor(data.totalScore)} points</div>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${data.averageScore}%"></div>
      </div>
    `;

    container.appendChild(card);
  });
}

function setupEventListeners() {
  const freezeBtn = document.getElementById('freezeStreakBtn');
  if (freezeBtn) {
    freezeBtn.addEventListener('click', () => {
      const userId = gamification.getCurrentUserId();
      const result = gamification.useStreakFreeze(userId);
      
      if (result.success) {
        alert('✅ ' + result.message);
        freezeBtn.disabled = true;
        freezeBtn.textContent = '❄️ Freeze Used';
      } else {
        alert('❌ ' + result.message);
      }
    });
  }

  document.querySelectorAll('.btn-redeem').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rewardId = e.target.dataset.rewardId;
      const cost = parseInt(e.target.dataset.cost);
      const userId = gamification.getCurrentUserId();

      const result = gamification.redeemReward(userId, rewardId, cost);
      if (result.success) {
        alert('🎉 ' + result.message);
        updateStats();
        e.target.disabled = true;
        e.target.textContent = '✓ Redeemed';
      } else {
        alert('❌ ' + result.message);
      }
    });
  });

  document.addEventListener('achievementUnlocked', (e) => {
    const achievement = e.detail.achievement;
    showAchievementNotification(achievement);
    renderAchievements();
    updateStats();
  });
}

function showAchievementNotification(achievement) {
  const notification = document.createElement('div');
  notification.className = 'achievement-notification';
  notification.innerHTML = `
    <div class="achievement-notification-content">
      <div class="achievement-notification-icon">${achievement.icon}</div>
      <div class="achievement-notification-text">
        <div class="achievement-notification-title">🎉 ${achievement.name}</div>
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

const style = document.createElement('style');
style.innerHTML = `
  .achievement-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .achievement-modal-content {
    background: white;
    border-radius: 12px;
    padding: 32px;
    text-align: center;
    max-width: 400px;
    position: relative;
    animation: popIn 0.3s ease;
  }

  @keyframes popIn {
    from {
      transform: scale(0.8);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  .modal-close {
    position: absolute;
    top: 12px;
    right: 12px;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #999;
  }

  .modal-icon {
    font-size: 3rem;
    margin-bottom: 16px;
  }

  .achievement-modal-content h2 {
    margin: 16px 0 8px 0;
    color: #333;
  }

  .achievement-modal-content p {
    margin: 8px 0;
    color: #666;
  }
`;
document.head.appendChild(style);
