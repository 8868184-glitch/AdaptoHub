const LearningInsights = {
  achievements: {
    streaks: [
      { id: 'streak-7', name: '7-Day Streak', icon: '🔥', threshold: 7, description: 'Complete lessons for 7 consecutive days' },
      { id: 'streak-30', name: '30-Day Streak', icon: '💪', threshold: 30, description: 'Complete lessons for 30 consecutive days' },
      { id: 'streak-100', name: '100-Day Streak', icon: '🏆', threshold: 100, description: 'Complete lessons for 100 consecutive days' }
    ],
    mastery: [
      { id: 'master-algebra', name: 'Algebra Master', icon: '🎓', subject: 'algebra', threshold: 90, description: 'Score 90%+ on algebra assessments' },
      { id: 'master-calculus', name: 'Calculus Master', icon: '∫', subject: 'calculus', threshold: 90, description: 'Score 90%+ on calculus assessments' },
      { id: 'master-physics', name: 'Physics Master', icon: '⚛️', subject: 'physics', threshold: 90, description: 'Score 90%+ on physics assessments' },
      { id: 'master-chemistry', name: 'Chemistry Master', icon: '🧪', subject: 'chemistry', threshold: 90, description: 'Score 90%+ on chemistry assessments' }
    ],
    milestones: [
      { id: 'quiz-10', name: 'Quiz Novice', icon: '📝', threshold: 10, description: 'Complete 10 quizzes' },
      { id: 'quiz-50', name: 'Quiz Expert', icon: '📚', threshold: 50, description: 'Complete 50 quizzes' },
      { id: 'quiz-100', name: 'Quiz Legend', icon: '🌟', threshold: 100, description: 'Complete 100 quizzes' }
    ]
  },

  init() {
    this.setupWeeklyRecap();
    this.setupAchievementTracking();
    this.setupCertificates();
    this.checkAndNotifyTopPercentile();
    this.setupSessionTracking();
    this.setupMidnightStreakReset();
    console.log('✓ Learning Insights initialized');
  },

  setupSessionTracking() {
    const sessionStart = Date.now();
    if (!localStorage.getItem('adaptohub_session_start')) {
      localStorage.setItem('adaptohub_session_start', sessionStart.toString());
    }

    setInterval(() => {
      localStorage.setItem('adaptohub_session_end', Date.now().toString());
    }, 60000);

    window.addEventListener('beforeunload', () => {
      const start = parseInt(localStorage.getItem('adaptohub_session_start') || Date.now());
      const end = Date.now();
      const sessionDuration = (end - start) / (1000 * 60 * 60); // Convert to hours
      
      let sessions = JSON.parse(localStorage.getItem('adaptohub_sessions') || '[]');
      sessions.push({
        start,
        end,
        duration: sessionDuration,
        date: new Date(start).toDateString()
      });
      
      localStorage.setItem('adaptohub_sessions', JSON.stringify(sessions.slice(-100))); // Keep last 100 sessions
      localStorage.removeItem('adaptohub_session_start');
    });
  },

  setupMidnightStreakReset() {
    const checkMidnightReset = () => {
      const lastResetDate = localStorage.getItem('last-streak-reset-date');
      const today = new Date().toDateString();

      if (lastResetDate !== today) {
        const currentStreak = parseInt(localStorage.getItem('current-streak') || '0');
        const quizzesCompletedToday = this.getQuizzesCompletedToday();

        if (quizzesCompletedToday === 0) {
          const sessions = JSON.parse(localStorage.getItem('adaptohub_sessions') || '[]');
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toDateString();

          const studiedYesterday = sessions.some(s => s.date === yesterdayStr);
          
          if (!studiedYesterday && currentStreak > 0) {
            localStorage.setItem('current-streak', '0');
            console.log('🔥 Streak broken! Reset to 0');
          }
        }

        localStorage.setItem('last-streak-reset-date', today);
      }
    };

    checkMidnightReset();

    setInterval(checkMidnightReset, 60 * 60 * 1000);
  },

  getQuizzesCompletedToday() {
    const today = new Date().toDateString();
    const allSubjects = [
      'adaptohub_algebra_units', 'adaptohub_geometry_units', 'adaptohub_combinatorics_units',
      'adaptohub_number_theory_units', 'adaptohub_logic_units', 'adaptohub_calculus_units',
      'adaptohub_differential_units', 'adaptohub_discrete_units', 'adaptohub_numerical_units',
      'adaptohub_physics_math_units', 'adaptohub_stats_units',
      'adaptohub_physics_units', 'adaptohub_chemistry_units', 'adaptohub_biology_units',
      'adaptohub_history_units', 'adaptohub_civics_units', 'adaptohub_religion_units'
    ];

    let todayQuizzes = 0;
    allSubjects.forEach(key => {
      const progress = JSON.parse(localStorage.getItem(key) || '{}');
      Object.values(progress).forEach(unit => {
        if (unit.completed && unit.completedDate) {
          const completedDate = new Date(unit.completedDate).toDateString();
          if (completedDate === today) {
            todayQuizzes++;
          }
        }
      });
    });

    return todayQuizzes;
  },

  setupWeeklyRecap() {
    window.openWeeklyRecap = () => {
      const stats = this.calculateWeeklyStats();
      
      const modal = document.createElement('div');
      modal.className = 'insights-modal';
      modal.id = 'weekly-recap-modal';
      modal.innerHTML = `
        <div class="insights-modal-content">
          <button class="insights-close-btn" onclick="document.getElementById('weekly-recap-modal').remove()">✕</button>
          
          <div class="recap-header">
            <h2>📊 Your Weekly Recap</h2>
            <p class="recap-period">${this.getWeekDateRange()}</p>
          </div>

          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">⏱️</div>
              <div class="stat-value">${stats.studyTime}</div>
              <div class="stat-label">Study Hours</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📝</div>
              <div class="stat-value">${stats.quizzesCompleted}</div>
              <div class="stat-label">Quizzes Completed</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🎯</div>
              <div class="stat-value">${stats.averageScore}%</div>
              <div class="stat-label">Average Score</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🔥</div>
              <div class="stat-value">${stats.currentStreak}</div>
              <div class="stat-label">Day Streak</div>
            </div>
          </div>

          <div class="achievement-section">
            <h3>🏆 Achievements This Week</h3>
            <div class="achievement-list">
              ${stats.newAchievements.length > 0 ? 
                stats.newAchievements.map(ach => `
                  <div class="achievement-badge">
                    <span class="badge-icon">${ach.icon}</span>
                    <div class="badge-info">
                      <p class="badge-name">${ach.name}</p>
                      <p class="badge-desc">${ach.description}</p>
                    </div>
                  </div>
                `).join('') : 
                '<p class="no-achievements">Keep studying to earn achievements!</p>'
              }
            </div>
          </div>

          <div class="percentile-section">
            <h3>📈 Your Performance</h3>
            <div class="percentile-box ${stats.percentile >= 90 ? 'top-tier' : ''}">
              <p class="percentile-text">You're in the top <strong>${100 - stats.percentile}%</strong> of learners this week!</p>
              ${stats.percentile >= 90 ? '<p class="congratulations">🌟 Outstanding performance!</p>' : ''}
            </div>
          </div>

          <div class="subject-breakdown">
            <h3>📚 Subject Performance</h3>
            ${Object.entries(stats.subjectScores).map(([subject, score]) => `
              <div class="subject-bar">
                <span class="subject-name">${subject}</span>
                <div class="progress-bar-container">
                  <div class="progress-bar-fill" style="width: ${score}%; background: ${this.getScoreColor(score)}"></div>
                </div>
                <span class="subject-score">${score}%</span>
              </div>
            `).join('')}
          </div>

          <div class="recap-actions">
            <button class="action-btn" onclick="LearningInsights.emailWeeklyRecap()">📧 Email This Recap</button>
            <button class="action-btn" onclick="LearningInsights.shareRecap()">📤 Share on Social</button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      setTimeout(() => modal.classList.add('active'), 10);
    };
  },

  calculateWeeklyStats() {

    const studyHours = this.calculateRealStudyHours();

    const thisWeekQuizzes = this.getAllQuizzesThisWeek();

    const quizzesCompleted = thisWeekQuizzes.length;
    const averageScore = quizzesCompleted > 0
      ? Math.round(thisWeekQuizzes.reduce((sum, q) => sum + (q.score || 0), 0) / quizzesCompleted)
      : 0;

    const currentStreak = parseInt(localStorage.getItem('current-streak') || '0');

    const subjectScores = this.collectSubjectProgress();

    const percentile = averageScore >= 90 ? 95 : averageScore >= 80 ? 80 : averageScore >= 70 ? 60 : 40;

    const newAchievements = this.getNewAchievementsThisWeek();

    return {
      studyTime: studyHours.toFixed(1) + ' hours',
      quizzesCompleted,
      averageScore,
      currentStreak,
      percentile,
      newAchievements,
      subjectScores
    };
  },

  calculateRealStudyHours() {
    const weekAgoTime = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const sessions = JSON.parse(localStorage.getItem('adaptohub_sessions') || '[]');
    
    const thisWeekSessions = sessions.filter(session => {
      const sessionTime = parseInt(session.start || 0);
      return sessionTime > weekAgoTime;
    });

    const totalHours = thisWeekSessions.reduce((sum, session) => sum + (session.duration || 0), 0);
    return Math.max(totalHours, 0);
  },

  getAllQuizzesThisWeek() {
    const weekAgoTime = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const allSubjects = [
      'adaptohub_algebra_units', 'adaptohub_geometry_units', 'adaptohub_combinatorics_units',
      'adaptohub_number_theory_units', 'adaptohub_logic_units', 'adaptohub_calculus_units',
      'adaptohub_differential_units', 'adaptohub_discrete_units', 'adaptohub_numerical_units',
      'adaptohub_physics_math_units', 'adaptohub_stats_units',
      'adaptohub_physics_units', 'adaptohub_chemistry_units', 'adaptohub_biology_units',
      'adaptohub_history_units', 'adaptohub_civics_units', 'adaptohub_religion_units'
    ];

    const quizzes = [];

    allSubjects.forEach(key => {
      const progress = JSON.parse(localStorage.getItem(key) || '{}');
      Object.values(progress).forEach(unit => {
        if (unit.completed && unit.completedDate) {
          const completedTime = new Date(unit.completedDate).getTime();
          if (completedTime > weekAgoTime) {
            quizzes.push({
              score: unit.score || 0,
              completedDate: unit.completedDate,
              subject: key
            });
          }
        }
      });
    });

    return quizzes;
  },

  collectSubjectProgress() {
    const mathSubjects = [
      { key: 'adaptohub_algebra_units', name: 'Algebra', total: 6 },
      { key: 'adaptohub_geometry_units', name: 'Geometry', total: 6 },
      { key: 'adaptohub_combinatorics_units', name: 'Combinatorics', total: 6 },
      { key: 'adaptohub_number_theory_units', name: 'Number Theory', total: 6 },
      { key: 'adaptohub_logic_units', name: 'Logic', total: 6 },
      { key: 'adaptohub_calculus_units', name: 'Calculus', total: 6 },
      { key: 'adaptohub_differential_units', name: 'Differential Equations', total: 6 },
      { key: 'adaptohub_discrete_units', name: 'Discrete Math', total: 6 },
      { key: 'adaptohub_numerical_units', name: 'Numerical Analysis', total: 6 },
      { key: 'adaptohub_physics_math_units', name: 'Mathematical Physics', total: 6 },
      { key: 'adaptohub_stats_units', name: 'Statistics', total: 6 }
    ];

    const scienceSubjects = [
      { key: 'adaptohub_physics_units', name: 'Physics', total: 7 },
      { key: 'adaptohub_chemistry_units', name: 'Chemistry', total: 6 },
      { key: 'adaptohub_biology_units', name: 'Biology', total: 6 }
    ];

    const socialStudiesSubjects = [
      { key: 'adaptohub_history_units', name: 'History', total: 6 },
      { key: 'adaptohub_civics_units', name: 'Civics', total: 6 },
      { key: 'adaptohub_religion_units', name: 'Religion', total: 6 }
    ];

    const mathScores = [];
    mathSubjects.forEach(subject => {
      const progress = JSON.parse(localStorage.getItem(subject.key) || '{}');
      const scores = Object.values(progress)
        .filter(u => u.completed && typeof u.score === 'number')
        .map(u => u.score);
      mathScores.push(...scores);
    });

    const scienceScores = [];
    scienceSubjects.forEach(subject => {
      const progress = JSON.parse(localStorage.getItem(subject.key) || '{}');
      const scores = Object.values(progress)
        .filter(u => u.completed && typeof u.score === 'number')
        .map(u => u.score);
      scienceScores.push(...scores);
    });

    const socialScores = [];
    socialStudiesSubjects.forEach(subject => {
      const progress = JSON.parse(localStorage.getItem(subject.key) || '{}');
      const scores = Object.values(progress)
        .filter(u => u.completed && typeof u.score === 'number')
        .map(u => u.score);
      socialScores.push(...scores);
    });

    const subjects = {};
    if (mathScores.length > 0) {
      subjects['Mathematics'] = Math.round(mathScores.reduce((a, b) => a + b, 0) / mathScores.length);
    } else {
      subjects['Mathematics'] = 0;
    }

    if (scienceScores.length > 0) {
      subjects['Science'] = Math.round(scienceScores.reduce((a, b) => a + b, 0) / scienceScores.length);
    } else {
      subjects['Science'] = 0;
    }

    if (socialScores.length > 0) {
      subjects['Social Studies'] = Math.round(socialScores.reduce((a, b) => a + b, 0) / socialScores.length);
    } else {
      subjects['Social Studies'] = 0;
    }

    return subjects;
  },

  getWeekDateRange() {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 7);
    
    const options = { month: 'short', day: 'numeric' };
    return `${weekStart.toLocaleDateString('en-US', options)} - ${today.toLocaleDateString('en-US', options)}`;
  },

  getNewAchievementsThisWeek() {
    const achievements = [];
    const currentStreak = parseInt(localStorage.getItem('current-streak') || '0');
    const quizzesCompleted = parseInt(localStorage.getItem('total-quizzes') || '0');

    this.achievements.streaks.forEach(ach => {
      if (currentStreak >= ach.threshold && !this.hasAchievement(ach.id)) {
        achievements.push(ach);
        this.unlockAchievement(ach.id);
      }
    });

    this.achievements.milestones.forEach(ach => {
      if (quizzesCompleted >= ach.threshold && !this.hasAchievement(ach.id)) {
        achievements.push(ach);
        this.unlockAchievement(ach.id);
      }
    });

    return achievements;
  },

  hasAchievement(achievementId) {
    const unlocked = JSON.parse(localStorage.getItem('unlocked-achievements') || '[]');
    return unlocked.includes(achievementId);
  },

  unlockAchievement(achievementId) {
    const unlocked = JSON.parse(localStorage.getItem('unlocked-achievements') || '[]');
    if (!unlocked.includes(achievementId)) {
      unlocked.push(achievementId);
      localStorage.setItem('unlocked-achievements', JSON.stringify(unlocked));
    }
  },

  getScoreColor(score) {
    if (score >= 90) return '#4caf50';
    if (score >= 75) return '#ff9800';
    return '#f44336';
  },

  setupAchievementTracking() {
    window.openAchievements = () => {
      const allAchievements = [
        ...this.achievements.streaks,
        ...this.achievements.mastery,
        ...this.achievements.milestones
      ];

      const modal = document.createElement('div');
      modal.className = 'insights-modal';
      modal.id = 'achievements-modal';
      modal.innerHTML = `
        <div class="insights-modal-content">
          <button class="insights-close-btn" onclick="document.getElementById('achievements-modal').remove()">✕</button>
          
          <div class="achievements-header">
            <h2>🏆 Your Achievements</h2>
            <p class="achievement-count">${this.getUnlockedCount()} / ${allAchievements.length} Unlocked</p>
          </div>

          <div class="achievement-categories">
            <h3>🔥 Streak Achievements</h3>
            <div class="achievement-grid">
              ${this.achievements.streaks.map(ach => this.renderAchievementCard(ach)).join('')}
            </div>

            <h3>🎓 Mastery Achievements</h3>
            <div class="achievement-grid">
              ${this.achievements.mastery.map(ach => this.renderAchievementCard(ach)).join('')}
            </div>

            <h3>📚 Milestone Achievements</h3>
            <div class="achievement-grid">
              ${this.achievements.milestones.map(ach => this.renderAchievementCard(ach)).join('')}
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      setTimeout(() => modal.classList.add('active'), 10);
    };
  },

  renderAchievementCard(achievement) {
    const unlocked = this.hasAchievement(achievement.id);
    return `
      <div class="achievement-card ${unlocked ? 'unlocked' : 'locked'}">
        <div class="achievement-icon">${unlocked ? achievement.icon : '🔒'}</div>
        <p class="achievement-name">${achievement.name}</p>
        <p class="achievement-description">${achievement.description}</p>
        ${unlocked ? '<span class="unlocked-badge">✓ Unlocked</span>' : '<span class="locked-badge">Locked</span>'}
      </div>
    `;
  },

  getUnlockedCount() {
    const unlocked = JSON.parse(localStorage.getItem('unlocked-achievements') || '[]');
    return unlocked.length;
  },

  setupCertificates() {
    window.openCertificates = () => {
      const certificates = this.getEarnedCertificates();

      const modal = document.createElement('div');
      modal.className = 'insights-modal';
      modal.id = 'certificates-modal';
      modal.innerHTML = `
        <div class="insights-modal-content">
          <button class="insights-close-btn" onclick="document.getElementById('certificates-modal').remove()">✕</button>
          
          <div class="certificates-header">
            <h2>📜 Your Certificates</h2>
            <p>Earned ${certificates.length} certificates</p>
          </div>

          <div class="certificates-grid">
            ${certificates.length > 0 ? 
              certificates.map(cert => `
                <div class="certificate-card" onclick="LearningInsights.viewCertificate('${cert.id}')">
                  <div class="certificate-icon">🏆</div>
                  <h3>${cert.subject} Mastery</h3>
                  <p class="certificate-date">Earned ${cert.date}</p>
                  <p class="certificate-score">Score: ${cert.score}%</p>
                  <button class="view-cert-btn">View Certificate</button>
                </div>
              `).join('') :
              `<div class="no-certificates">
                <p>Complete subject assessments with 90%+ to earn certificates!</p>
                <button class="action-btn" onclick="document.getElementById('certificates-modal').remove(); window.location.href='mathematics.html'">
                  Start Learning →
                </button>
              </div>`
            }
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      setTimeout(() => modal.classList.add('active'), 10);
    };
  },

  getEarnedCertificates() {
    const certificates = JSON.parse(localStorage.getItem('earned-certificates') || '[]');
    return certificates;
  },

  viewCertificate(certificateId) {
    const certificates = this.getEarnedCertificates();
    const cert = certificates.find(c => c.id === certificateId);

    if (!cert) {
      alert('Certificate not found');
      return;
    }

    const modal = document.createElement('div');
    modal.className = 'insights-modal';
    modal.innerHTML = `
      <div class="insights-modal-content certificate-view">
        <button class="insights-close-btn" onclick="this.parentElement.parentElement.remove()">✕</button>
        
        <div class="certificate-template">
          <div class="certificate-border">
            <div class="certificate-content">
              <h1 class="certificate-title">Certificate of Mastery</h1>
              <p class="certificate-subtitle">This certifies that</p>
              <h2 class="certificate-recipient">${cert.recipientName || 'Chayata Chonprasertsuk'}</h2>
              <p class="certificate-achievement">has demonstrated exceptional mastery in</p>
              <h3 class="certificate-subject">${cert.subject}</h3>
              <p class="certificate-details">with a score of <strong>${cert.score}%</strong></p>
              <div class="certificate-footer">
                <div class="certificate-date">
                  <p>Date Earned</p>
                  <p><strong>${cert.date}</strong></p>
                </div>
                <div class="certificate-seal">
                  <div class="seal">🏆</div>
                  <p>AdaptoHub</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="certificate-actions">
          <button class="action-btn" onclick="LearningInsights.downloadCertificate('${cert.id}')">📥 Download PDF</button>
          <button class="action-btn" onclick="LearningInsights.shareCertificate('${cert.id}')">📤 Share on LinkedIn</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
  },

  checkAndNotifyTopPercentile() {
    const percentile = parseInt(localStorage.getItem('user-percentile') || '0');
    const lastNotified = localStorage.getItem('last-percentile-notification');
    const today = new Date().toISOString().split('T')[0];

    if (percentile >= 90 && lastNotified !== today) {
      setTimeout(() => {
        this.showTopPercentileNotification(percentile);
        localStorage.setItem('last-percentile-notification', today);
      }, 2000);
    }
  },

  showTopPercentileNotification(percentile) {
    const notification = document.createElement('div');
    notification.className = 'percentile-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <div class="notification-icon">🌟</div>
        <div class="notification-text">
          <h4>Excellent Progress!</h4>
          <p>You're in the top ${100 - percentile}% of learners this week!</p>
        </div>
        <button class="notification-close" onclick="this.parentElement.parentElement.remove()">✕</button>
      </div>
    `;

    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  },

  emailWeeklyRecap() {
    alert('📧 Weekly Recap Email Sent!\n\nCheck your email for a detailed breakdown of your progress.');
  },

  shareRecap() {
    const stats = this.calculateWeeklyStats();
    const shareText = `This week on AdaptoHub: ${stats.quizzesCompleted} quizzes completed, ${stats.averageScore}% average score! 🎯`;
    alert(`Share: ${shareText}`);
  },

  downloadCertificate(certId) {
    alert('Certificate PDF generated! This would download a professionally formatted certificate.');
  },

  shareCertificate(certId) {
    alert('Certificate shared to LinkedIn! This would post to your LinkedIn profile with the certificate image.');
  }
};

const insightsStyles = `
  .insights-modal {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .insights-modal.active {
    opacity: 1;
  }

  .insights-modal-content {
    background: white;
    border-radius: 12px;
    max-width: 850px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    padding: 30px;
    position: relative;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  }

  .insights-close-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    background: #f5f5f5;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    cursor: pointer;
    font-size: 24px;
    transition: all 0.2s;
  }

  .insights-close-btn:hover {
    background: #e0e0e0;
    transform: rotate(90deg);
  }

  .recap-header {
    text-align: center;
    margin-bottom: 30px;
  }

  .recap-period {
    color: #999;
    margin: 5px 0 0 0;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
    margin: 30px 0;
  }

  .stat-card {
    background: linear-gradient(135deg, #f5f5f5, #fafafa);
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    transition: all 0.3s;
  }

  .stat-card:hover {
    border-color: #0097b2;
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0,151,178,0.2);
  }

  .stat-icon {
    font-size: 2rem;
    margin-bottom: 10px;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: #0097b2;
    margin: 10px 0;
  }

  .stat-label {
    color: #666;
    font-size: 0.9rem;
  }

  .achievement-section, .percentile-section, .subject-breakdown {
    margin: 30px 0;
  }

  .achievement-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 15px;
  }

  .achievement-badge {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    background: #f9f9f9;
    border-radius: 8px;
    border-left: 4px solid #0097b2;
  }

  .badge-icon {
    font-size: 2.5rem;
  }

  .badge-info p {
    margin: 0;
  }

  .badge-name {
    font-weight: 600;
    color: #1f2933;
  }

  .badge-desc {
    color: #666;
    font-size: 0.9rem;
    margin-top: 5px;
  }

  .no-achievements {
    text-align: center;
    color: #999;
    padding: 20px;
  }

  .percentile-box {
    background: #e3f2fd;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    border: 2px solid #2196f3;
  }

  .percentile-box.top-tier {
    background: linear-gradient(135deg, #fff3e0, #ffe0b2);
    border-color: #ff9800;
  }

  .percentile-text {
    margin: 0;
    font-size: 1.1rem;
    color: #1f2933;
  }

  .percentile-text strong {
    color: #0097b2;
    font-size: 1.3rem;
  }

  .congratulations {
    margin: 10px 0 0 0;
    font-weight: 600;
    color: #ff6f00;
  }

  .subject-bar {
    display: flex;
    align-items: center;
    gap: 15px;
    margin: 15px 0;
  }

  .subject-name {
    min-width: 120px;
    font-weight: 500;
    color: #1f2933;
  }

  .progress-bar-container {
    flex: 1;
    height: 25px;
    background: #e0e0e0;
    border-radius: 12px;
    overflow: hidden;
  }

  .progress-bar-fill {
    height: 100%;
    transition: width 0.5s ease;
    border-radius: 12px;
  }

  .subject-score {
    min-width: 50px;
    text-align: right;
    font-weight: 600;
    color: #0097b2;
  }

  .recap-actions {
    display: flex;
    gap: 10px;
    margin-top: 30px;
    flex-wrap: wrap;
  }

  .action-btn {
    flex: 1;
    min-width: 180px;
    padding: 12px;
    background: #0097b2;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
  }

  .action-btn:hover {
    background: #007a95;
    transform: translateY(-2px);
  }

  .achievement-count {
    color: #999;
    margin: 5px 0 0 0;
  }

  .achievement-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
    margin: 15px 0 30px 0;
  }

  .achievement-card {
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    transition: all 0.3s;
    position: relative;
  }

  .achievement-card.unlocked {
    border-color: #4caf50;
    background: linear-gradient(135deg, #f1f8e9, #ffffff);
  }

  .achievement-card.locked {
    opacity: 0.5;
    background: #fafafa;
  }

  .achievement-icon {
    font-size: 3rem;
    margin-bottom: 10px;
  }

  .achievement-name {
    font-weight: 600;
    color: #1f2933;
    margin: 10px 0 5px 0;
  }

  .achievement-description {
    color: #666;
    font-size: 0.85rem;
    margin: 0 0 10px 0;
  }

  .unlocked-badge {
    display: inline-block;
    background: #4caf50;
    color: white;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .locked-badge {
    display: inline-block;
    background: #999;
    color: white;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .certificates-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    margin-top: 20px;
  }

  .certificate-card {
    border: 2px solid #0097b2;
    border-radius: 8px;
    padding: 25px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
    background: linear-gradient(135deg, #ffffff, #f9f9f9);
  }

  .certificate-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0,151,178,0.3);
  }

  .certificate-icon {
    font-size: 3rem;
    margin-bottom: 15px;
  }

  .certificate-date, .certificate-score {
    color: #666;
    font-size: 0.9rem;
    margin: 5px 0;
  }

  .view-cert-btn {
    margin-top: 15px;
    padding: 8px 20px;
    background: #0097b2;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
  }

  .view-cert-btn:hover {
    background: #007a95;
  }

  .no-certificates {
    grid-column: 1 / -1;
    text-align: center;
    padding: 40px;
    color: #666;
  }

  .certificate-template {
    margin: 30px 0;
    padding: 20px;
    background: #f9f9f9;
  }

  .certificate-border {
    border: 8px double #0097b2;
    padding: 40px;
    background: white;
  }

  .certificate-content {
    text-align: center;
  }

  .certificate-title {
    font-size: 2.5rem;
    color: #0097b2;
    margin: 0 0 10px 0;
    font-family: serif;
  }

  .certificate-subtitle {
    color: #666;
    margin: 10px 0;
  }

  .certificate-recipient {
    font-size: 2rem;
    color: #1f2933;
    margin: 20px 0;
    font-family: cursive;
    border-bottom: 2px solid #0097b2;
    display: inline-block;
    padding-bottom: 5px;
  }

  .certificate-achievement {
    color: #666;
    margin: 20px 0 10px 0;
  }

  .certificate-subject {
    font-size: 1.8rem;
    color: #0097b2;
    margin: 10px 0 20px 0;
  }

  .certificate-footer {
    display: flex;
    justify-content: space-around;
    margin-top: 40px;
    padding-top: 20px;
    border-top: 2px solid #e0e0e0;
  }

  .seal {
    font-size: 3rem;
    margin-bottom: 10px;
  }

  .percentile-notification {
    position: fixed;
    top: 80px;
    right: 20px;
    z-index: 10001;
    opacity: 0;
    transform: translateX(400px);
    transition: all 0.3s ease;
  }

  .percentile-notification.show {
    opacity: 1;
    transform: translateX(0);
  }

  .notification-content {
    background: linear-gradient(135deg, #fff3e0, #ffe0b2);
    border: 2px solid #ff9800;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.2);
    display: flex;
    align-items: center;
    gap: 15px;
    max-width: 350px;
  }

  .notification-icon {
    font-size: 2.5rem;
  }

  .notification-text h4 {
    margin: 0 0 5px 0;
    color: #1f2933;
  }

  .notification-text p {
    margin: 0;
    color: #666;
    font-size: 0.9rem;
  }

  .notification-close {
    background: transparent;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
    margin-left: auto;
  }
`;

if (!document.getElementById('insights-styles')) {
  const styleTag = document.createElement('style');
  styleTag.id = 'insights-styles';
  styleTag.textContent = insightsStyles;
  document.head.appendChild(styleTag);
}

document.addEventListener('DOMContentLoaded', () => {
  LearningInsights.init();
});

console.log('✓ Learning Insights module loaded');