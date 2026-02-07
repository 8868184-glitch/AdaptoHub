const ChallengesCompetitions = {
  challenges: {
    daily: [
      {
        id: 'daily-math-001',
        title: 'Math Speed Challenge',
        description: 'Solve 10 algebra problems in under 5 minutes',
        subject: 'Mathematics',
        difficulty: 'Medium',
        timeLimit: 300,
        points: 50,
        expires: new Date().setHours(23, 59, 59),
        reward: '🏆 Speed Master Badge'
      },
      {
        id: 'daily-science-001',
        title: 'Science Quiz Sprint',
        description: 'Answer 15 science questions with 90%+ accuracy',
        subject: 'Science',
        difficulty: 'Hard',
        targetScore: 90,
        points: 75,
        expires: new Date().setHours(23, 59, 59),
        reward: '🧪 Science Expert Badge'
      }
    ],
    weekly: [
      {
        id: 'weekly-001',
        title: 'Perfect Week Challenge',
        description: 'Study every day for 7 consecutive days',
        requirement: 'Daily login + 1 quiz per day',
        points: 200,
        expiresIn: '5 days',
        reward: '🔥 Perfect Week Trophy + 200 Bonus Points'
      },
      {
        id: 'weekly-002',
        title: 'Quiz Marathon',
        description: 'Complete 25 quizzes this week',
        requirement: '25 quizzes across any subjects',
        points: 150,
        expiresIn: '5 days',
        reward: '📚 Quiz Marathon Medal'
      }
    ]
  },

  tournaments: [
    {
      id: 'tournament-math-001',
      name: 'Mathematics Championship',
      description: 'Compete with learners worldwide in mathematical excellence',
      subject: 'Mathematics',
      participants: 1247,
      startDate: 'Feb 1, 2026',
      endDate: 'Feb 7, 2026',
      status: 'upcoming',
      prizes: [
        { place: '1st', reward: '🥇 Gold Trophy + 1000 Points' },
        { place: '2nd', reward: '🥈 Silver Trophy + 500 Points' },
        { place: '3rd', reward: '🥉 Bronze Trophy + 250 Points' },
        { place: 'Top 10', reward: '🏆 Elite Badge + 100 Points' }
      ],
      format: '3 rounds: Speed, Accuracy, Problem-Solving'
    },
    {
      id: 'tournament-science-001',
      name: 'Science Olympiad',
      description: 'Test your scientific knowledge in all domains',
      subject: 'Science',
      participants: 892,
      startDate: 'Feb 8, 2026',
      endDate: 'Feb 14, 2026',
      status: 'upcoming',
      prizes: [
        { place: '1st', reward: '🥇 Grand Prize + 1500 Points' },
        { place: '2nd', reward: '🥈 Runner-up + 750 Points' },
        { place: '3rd', reward: '🥉 Third Place + 400 Points' }
      ],
      format: 'Physics, Chemistry, Biology rounds'
    }
  ],

  events: [
    {
      id: 'event-001',
      name: 'Winter Learning Festival',
      description: 'Special limited-time event with exclusive rewards',
      type: 'Seasonal',
      duration: '14 days',
      endsIn: '12 days',
      challenges: [
        { name: 'Ice Breaker', description: 'Complete 5 new topics', reward: '❄️ Snowflake Badge' },
        { name: 'Winter Scholar', description: 'Study 10 hours this week', reward: '📚 Scholar Title' },
        { name: 'Frosty Champion', description: 'Win 3 daily challenges', reward: '👑 Champion Crown' }
      ],
      exclusiveRewards: ['Limited Edition Avatar', 'Winter Theme', 'Exclusive Badge Set']
    },
    {
      id: 'event-002',
      name: 'Flash Challenge Hour',
      description: 'Hourly micro-challenges with instant rewards',
      type: 'Flash',
      duration: '1 hour',
      endsIn: '45 minutes',
      currentChallenge: 'Solve 5 calculus problems in 10 minutes',
      reward: '⚡ Flash Master Badge + 100 Points',
      exclusiveRewards: ['Speed Demon Title', 'Lightning Badge']
    }
  ],

  init() {
    this.setupDailyChallenges();
    this.setupWeeklyChallenges();
    this.setupTournaments();
    this.setupEvents();
    this.checkActiveCompetitions();
    this.generateDailyQuestions();
    console.log('✓ Challenges & Competitions initialized');
  },

  async generateDailyQuestions() {
    if (window.QuestionGenerator) {
      try {
        const result = await window.QuestionGenerator.getDailyChallengeQuestions();
        this.dailyChallengeQuestions = result.questions;
        localStorage.setItem('daily-challenge-questions', JSON.stringify(this.dailyChallengeQuestions));
        console.log('✓ Daily challenge questions generated:', this.dailyChallengeQuestions.length);
      } catch (err) {
        console.warn('Failed to generate daily questions:', err);
      }
    }
  },

  getDailyChallengeQuestions() {
    const cached = localStorage.getItem('daily-challenge-questions');
    if (cached) {
      const questions = JSON.parse(cached);
      const lastGenerated = localStorage.getItem('daily-questions-generated-date');
      const today = new Date().toDateString();
      
      if (lastGenerated === today) {
        return questions;
      }
    }
    
    this.generateDailyQuestions();
    return this.dailyChallengeQuestions || [];
  },

  setupDailyChallenges() {
    window.openDailyChallenges = () => {
      const modal = document.createElement('div');
      modal.className = 'challenges-modal';
      modal.id = 'daily-challenges-modal';
      modal.innerHTML = `
        <div class="challenges-modal-content">
          <button class="challenges-close-btn" onclick="document.getElementById('daily-challenges-modal').remove()">✕</button>
          
          <div class="challenges-header">
            <h2>⚡ Daily Challenges</h2>
            <p class="refresh-time">Refreshes in ${this.getTimeUntilMidnight()}</p>
          </div>

          <div class="challenges-list">
            ${this.challenges.daily.map(challenge => `
              <div class="challenge-card ${this.isChallengeCompleted(challenge.id) ? 'completed' : ''}">
                <div class="challenge-header-row">
                  <div class="challenge-subject">${challenge.subject}</div>
                  <div class="challenge-difficulty ${challenge.difficulty.toLowerCase()}">${challenge.difficulty}</div>
                </div>
                
                <h3>${challenge.title}</h3>
                <p class="challenge-description">${challenge.description}</p>

                <div class="challenge-footer">
                  <div class="challenge-reward">
                    <span class="points-badge">+${challenge.points} points</span>
                    <span class="reward-badge">${challenge.reward}</span>
                  </div>
                  ${this.isChallengeCompleted(challenge.id) ? 
                    '<button class="challenge-btn completed-btn" disabled>✓ Completed</button>' :
                    `<button class="challenge-btn" onclick="ChallengesCompetitions.startChallenge('${challenge.id}')">Start Challenge →</button>`
                  }
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      setTimeout(() => modal.classList.add('active'), 10);
    };
  },

  setupWeeklyChallenges() {
    window.openWeeklyChallenges = () => {
      const modal = document.createElement('div');
      modal.className = 'challenges-modal';
      modal.id = 'weekly-challenges-modal';
      modal.innerHTML = `
        <div class="challenges-modal-content">
          <button class="challenges-close-btn" onclick="document.getElementById('weekly-challenges-modal').remove()">✕</button>
          
          <div class="challenges-header">
            <h2>📅 Weekly Challenges</h2>
            <p class="refresh-time">Week resets in ${this.challenges.weekly[0].expiresIn}</p>
          </div>

          <div class="challenges-list">
            ${this.challenges.weekly.map(challenge => {
              const progress = this.getWeeklyChallengeProgress(challenge.id);
              return `
                <div class="challenge-card weekly">
                  <h3>${challenge.title}</h3>
                  <p class="challenge-description">${challenge.description}</p>
                  <p class="challenge-requirement">📋 ${challenge.requirement}</p>

                  <div class="progress-section">
                    <div class="progress-bar-wrapper">
                      <div class="progress-bar-fill-challenges" style="width: ${progress}%"></div>
                    </div>
                    <span class="progress-text">${progress}% Complete</span>
                  </div>

                  <div class="challenge-footer">
                    <div class="challenge-reward">
                      <span class="points-badge">+${challenge.points} points</span>
                      <span class="reward-badge">${challenge.reward}</span>
                    </div>
                    ${progress >= 100 ? 
                      '<button class="challenge-btn completed-btn" disabled>✓ Completed</button>' :
                      '<button class="challenge-btn" onclick="alert(\'Keep going! Complete daily tasks to finish this challenge.\')">View Progress →</button>'
                    }
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      setTimeout(() => modal.classList.add('active'), 10);
    };
  },

  setupTournaments() {
    window.openTournaments = () => {
      const modal = document.createElement('div');
      modal.className = 'challenges-modal';
      modal.id = 'tournaments-modal';
      modal.innerHTML = `
        <div class="challenges-modal-content tournaments-view">
          <button class="challenges-close-btn" onclick="document.getElementById('tournaments-modal').remove()">✕</button>
          
          <div class="challenges-header">
            <h2>🏆 Subject Tournaments</h2>
            <p>Compete globally for glory and rewards</p>
          </div>

          <div class="tournaments-list">
            ${this.tournaments.map(tournament => {
              const isRegistered = this.isTournamentRegistered(tournament.id);
              const isUpcoming = tournament.status === 'upcoming';
              const buttonLabel = isRegistered ? 'Registered ✓' : (isUpcoming ? 'Register Now' : 'View Details');
              const buttonDisabled = isRegistered ? 'disabled' : '';
              const buttonClass = isRegistered ? 'tournament-btn registered' : 'tournament-btn';
              const buttonAction = isUpcoming ? `ChallengesCompetitions.registerTournament('${tournament.id}')` : `ChallengesCompetitions.viewTournamentDetails('${tournament.id}')`;
              const showSecondaryDetails = isRegistered;
              return `
              <div class="tournament-card">
                <div class="tournament-header">
                  <h3>${tournament.name}</h3>
                  <span class="status-badge ${tournament.status}">${tournament.status}</span>
                </div>

                <p class="tournament-description">${tournament.description}</p>

                <div class="tournament-info">
                  <div class="info-item">
                    <span class="info-label">Subject:</span>
                    <span class="info-value">${tournament.subject}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Participants:</span>
                    <span class="info-value">${tournament.participants.toLocaleString()}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Format:</span>
                    <span class="info-value">${tournament.format}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Dates:</span>
                    <span class="info-value">${tournament.startDate} - ${tournament.endDate}</span>
                  </div>
                </div>

                <div class="prizes-section">
                  <h4>🏅 Prizes</h4>
                  <div class="prizes-grid">
                    ${tournament.prizes.map(prize => `
                      <div class="prize-item">
                        <strong>${prize.place}</strong>
                        <span>${prize.reward}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>

                <button class="${buttonClass}" data-tournament-id="${tournament.id}" ${buttonDisabled} onclick="${buttonAction}">
                  ${buttonLabel}${isRegistered ? '' : ' →'}
                </button>
                ${showSecondaryDetails ? `
                  <button class="tournament-btn secondary" onclick="ChallengesCompetitions.viewTournamentDetails('${tournament.id}')" style="margin-top: 10px; background: transparent; color: #0097b2; border: 1px solid #0097b2;">
                    View Details →
                  </button>
                ` : ''}
              </div>
            `;
            }).join('')}
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      setTimeout(() => modal.classList.add('active'), 10);
    };
  },

  setupEvents() {
    window.openSpecialEvents = () => {
      const modal = document.createElement('div');
      modal.className = 'challenges-modal';
      modal.id = 'events-modal';
      modal.innerHTML = `
        <div class="challenges-modal-content events-view">
          <button class="challenges-close-btn" onclick="document.getElementById('events-modal').remove()">✕</button>
          
          <div class="challenges-header">
            <h2>🎉 Special Events</h2>
            <p>Limited-time events with exclusive rewards</p>
          </div>

          <div class="events-list">
            ${this.events.map(event => `
              <div class="event-card ${event.type.toLowerCase()}">
                <div class="event-badge">${event.type}</div>
                <h3>${event.name}</h3>
                <p class="event-description">${event.description}</p>

                <div class="event-timer">
                  <span class="timer-icon">⏰</span>
                  <span class="timer-text">Ends in: <strong>${event.endsIn}</strong></span>
                </div>

                ${event.challenges ? `
                  <div class="event-challenges">
                    <h4>Event Challenges</h4>
                    ${event.challenges.map(challenge => `
                      <div class="mini-challenge">
                        <div class="mini-challenge-header">
                          <strong>${challenge.name}</strong>
                          <span class="mini-reward">${challenge.reward}</span>
                        </div>
                        <p>${challenge.description}</p>
                      </div>
                    `).join('')}
                  </div>
                ` : ''}

                ${event.currentChallenge ? `
                  <div class="current-challenge-box">
                    <h4>Current Challenge</h4>
                    <p>${event.currentChallenge}</p>
                    <span class="flash-reward">${event.reward}</span>
                  </div>
                ` : ''}

                <div class="exclusive-rewards">
                  <h4>✨ Exclusive Rewards</h4>
                  <div class="rewards-tags">
                    ${event.exclusiveRewards.map(reward => `
                      <span class="reward-tag">${reward}</span>
                    `).join('')}
                  </div>
                </div>

                <button class="event-btn" onclick="ChallengesCompetitions.joinEvent('${event.id}')">
                  Join Event →
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      setTimeout(() => modal.classList.add('active'), 10);
    };
  },

  startChallenge(challengeId) {
    const challenge = this.challenges.daily.find(c => c.id === challengeId);
    if (!challenge) return;

    alert(`🎯 Starting: ${challenge.title}\n\n${challenge.description}\n\nPoints: ${challenge.points}\nReward: ${challenge.reward}\n\nGood luck!`);
    
    const started = JSON.parse(localStorage.getItem('started-challenges') || '[]');
    if (!started.includes(challengeId)) {
      started.push(challengeId);
      localStorage.setItem('started-challenges', JSON.stringify(started));
    }
  },

  registerTournament(tournamentId) {
    const tournament = this.tournaments.find(t => t.id === tournamentId);
    if (!tournament) return;

    const registered = JSON.parse(localStorage.getItem('registered-tournaments') || '[]');
    
    if (registered.includes(tournamentId)) {
      alert(`Already registered for ${tournament.name}!`);
    } else {
      registered.push(tournamentId);
      localStorage.setItem('registered-tournaments', JSON.stringify(registered));
      alert(`✓ Successfully registered for ${tournament.name}!\n\nYou'll receive a notification when the tournament begins.`);

      const button = document.querySelector(`.tournament-btn[data-tournament-id="${tournamentId}"]`);
      if (button) {
        button.textContent = 'Registered ✓';
        button.classList.add('registered');
        button.setAttribute('disabled', 'disabled');
      }
    }
  },

  viewTournamentDetails(tournamentId) {
    const tournament = this.tournaments.find(t => t.id === tournamentId);
    if (!tournament) return;

    const existing = document.getElementById('tournament-details-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.className = 'challenges-modal';
    modal.id = 'tournament-details-modal';
    modal.innerHTML = `
      <div class="challenges-modal-content tournaments-view">
        <button class="challenges-close-btn" onclick="document.getElementById('tournament-details-modal').remove()">✕</button>
        
        <div class="challenges-header">
          <h2>🏆 ${tournament.name}</h2>
          <p>${tournament.description}</p>
        </div>

        <div class="tournament-card" style="box-shadow: none; border: 1px solid #e6edf2;">
          <div class="tournament-header">
            <h3>${tournament.subject}</h3>
            <span class="status-badge ${tournament.status}">${tournament.status}</span>
          </div>

          <div class="tournament-info">
            <div class="info-item">
              <span class="info-label">Participants:</span>
              <span class="info-value">${tournament.participants.toLocaleString()}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Format:</span>
              <span class="info-value">${tournament.format}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Dates:</span>
              <span class="info-value">${tournament.startDate} - ${tournament.endDate}</span>
            </div>
          </div>

          <div class="prizes-section">
            <h4>🏅 Prizes</h4>
            <div class="prizes-grid">
              ${tournament.prizes.map(prize => `
                <div class="prize-item">
                  <strong>${prize.place}</strong>
                  <span>${prize.reward}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="form-actions" style="margin-top: 16px;">
          <button class="btn-cancel" onclick="document.getElementById('tournament-details-modal').remove()">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
  },

  isTournamentRegistered(tournamentId) {
    const registered = JSON.parse(localStorage.getItem('registered-tournaments') || '[]');
    return registered.includes(tournamentId);
  },

  joinEvent(eventId) {
    const event = this.events.find(e => e.id === eventId);
    if (!event) return;

    const joined = JSON.parse(localStorage.getItem('joined-events') || '[]');
    
    if (joined.includes(eventId)) {
      alert(`You're already participating in ${event.name}!`);
    } else {
      joined.push(eventId);
      localStorage.setItem('joined-events', JSON.stringify(joined));
      alert(`🎉 Welcome to ${event.name}!\n\nComplete event challenges to earn exclusive rewards!`);
    }
  },

  isChallengeCompleted(challengeId) {
    const completed = JSON.parse(localStorage.getItem('completed-daily-challenges') || '[]');
    return completed.includes(challengeId);
  },

  getWeeklyChallengeProgress(challengeId) {
    const progress = parseInt(localStorage.getItem(`weekly-progress-${challengeId}`) || '0');
    return Math.min(progress, 100);
  },

  getTimeUntilMidnight() {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    
    const diff = midnight - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  },

  checkActiveCompetitions() {
    const registered = JSON.parse(localStorage.getItem('registered-tournaments') || '[]');
    const joined = JSON.parse(localStorage.getItem('joined-events') || '[]');
    
    console.log(`Active: ${registered.length} tournaments, ${joined.length} events`);
  }
};

const challengesStyles = `
  .challenges-modal {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9997;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .challenges-modal.active {
    opacity: 1;
  }

  .challenges-modal-content {
    background: white;
    border-radius: 12px;
    max-width: 900px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    padding: 30px;
    position: relative;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  }

  .challenges-close-btn {
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

  .challenges-close-btn:hover {
    background: #e0e0e0;
    transform: rotate(90deg);
  }

  .challenges-header {
    text-align: center;
    margin-bottom: 30px;
  }

  .refresh-time {
    color: #999;
    margin: 5px 0 0 0;
    font-size: 0.9rem;
  }

  .challenges-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .challenge-card {
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    padding: 20px;
    transition: all 0.3s;
  }

  .challenge-card:hover {
    border-color: #0097b2;
    box-shadow: 0 5px 15px rgba(0,151,178,0.2);
  }

  .challenge-card.completed {
    background: #f1f8e9;
    border-color: #4caf50;
    opacity: 0.7;
  }

  .challenge-card.weekly {
    border-color: #ff9800;
    background: linear-gradient(135deg, #fff8e1, #ffffff);
  }

  .challenge-header-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }

  .challenge-subject {
    background: #e3f2fd;
    color: #1976d2;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
  }

  .challenge-difficulty {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
  }

  .challenge-difficulty.easy {
    background: #c8e6c9;
    color: #2e7d32;
  }

  .challenge-difficulty.medium {
    background: #fff3e0;
    color: #e65100;
  }

  .challenge-difficulty.hard {
    background: #ffcdd2;
    color: #c62828;
  }

  .challenge-card h3 {
    margin: 0 0 10px 0;
    color: #1f2933;
  }

  .challenge-description {
    color: #666;
    margin: 10px 0;
    line-height: 1.6;
  }

  .challenge-requirement {
    color: #666;
    font-size: 0.9rem;
    margin: 10px 0;
    font-style: italic;
  }

  .challenge-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;
    gap: 15px;
    flex-wrap: wrap;
  }

  .challenge-reward {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .points-badge {
    background: #0097b2;
    color: white;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
  }

  .reward-badge {
    background: #fff3e0;
    color: #ff6f00;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
  }

  .challenge-btn {
    padding: 10px 20px;
    background: #0097b2;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
  }

  .challenge-btn:hover {
    background: #007a95;
    transform: translateY(-2px);
  }

  .challenge-btn.completed-btn {
    background: #4caf50;
    cursor: default;
  }

  .challenge-btn.completed-btn:hover {
    transform: none;
  }

  .progress-section {
    margin: 15px 0;
  }

  .progress-bar-wrapper {
    width: 100%;
    height: 20px;
    background: #e0e0e0;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 5px;
  }

  .progress-bar-fill-challenges {
    height: 100%;
    background: linear-gradient(90deg, #ff9800, #ffc107);
    transition: width 0.5s ease;
    border-radius: 10px;
  }

  .progress-text {
    color: #666;
    font-size: 0.9rem;
    font-weight: 600;
  }

  .tournaments-list, .events-list {
    display: flex;
    flex-direction: column;
    gap: 25px;
  }

  .tournament-card {
    border: 2px solid #0097b2;
    border-radius: 8px;
    padding: 25px;
    background: linear-gradient(135deg, #ffffff, #f0f8fa);
  }

  .tournament-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }

  .status-badge {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
  }

  .status-badge.upcoming {
    background: #e3f2fd;
    color: #1976d2;
  }

  .status-badge.active {
    background: #c8e6c9;
    color: #2e7d32;
  }

  .tournament-description {
    color: #666;
    margin: 10px 0 20px 0;
  }

  .tournament-info {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    margin: 20px 0;
    padding: 15px;
    background: #f9f9f9;
    border-radius: 6px;
  }

  .info-item {
    display: flex;
    justify-content: space-between;
  }

  .info-label {
    color: #666;
    font-weight: 500;
  }

  .info-value {
    color: #1f2933;
    font-weight: 600;
  }

  .prizes-section {
    margin: 20px 0;
    padding: 15px;
    background: #fff8e1;
    border-radius: 6px;
  }

  .prizes-section h4 {
    margin: 0 0 15px 0;
    color: #1f2933;
  }

  .prizes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 10px;
  }

  .prize-item {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 10px;
    background: white;
    border-radius: 4px;
    text-align: center;
  }

  .prize-item strong {
    color: #0097b2;
  }

  .prize-item span {
    font-size: 0.85rem;
    color: #666;
  }

  .tournament-btn, .event-btn {
    width: 100%;
    padding: 12px;
    background: #0097b2;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    font-size: 1rem;
    margin-top: 15px;
    transition: all 0.2s;
  }

  .tournament-btn.registered,
  .tournament-btn:disabled {
    background: #e0e8ee;
    color: #6b7280;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .tournament-btn:hover, .event-btn:hover {
    background: #007a95;
    transform: translateY(-2px);
  }

  .event-card {
    border: 3px solid #e0e0e0;
    border-radius: 8px;
    padding: 25px;
    position: relative;
    background: white;
  }

  .event-card.seasonal {
    border-color: #ff9800;
    background: linear-gradient(135deg, #fff8e1, #ffffff);
  }

  .event-card.flash {
    border-color: #f44336;
    background: linear-gradient(135deg, #ffebee, #ffffff);
  }

  .event-badge {
    position: absolute;
    top: -12px;
    right: 20px;
    background: #ff9800;
    color: white;
    padding: 8px 15px;
    border-radius: 20px;
    font-weight: 600;
    font-size: 0.85rem;
  }

  .event-card h3 {
    margin: 10px 0;
    color: #1f2933;
  }

  .event-description {
    color: #666;
    margin: 10px 0;
  }

  .event-timer {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #f44336;
    color: white;
    padding: 12px;
    border-radius: 6px;
    margin: 15px 0;
  }

  .timer-icon {
    font-size: 1.5rem;
  }

  .event-challenges {
    margin: 20px 0;
  }

  .event-challenges h4 {
    margin: 0 0 15px 0;
    color: #1f2933;
  }

  .mini-challenge {
    padding: 12px;
    background: #f9f9f9;
    border-radius: 6px;
    margin-bottom: 10px;
  }

  .mini-challenge-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
  }

  .mini-reward {
    font-size: 0.85rem;
    color: #ff6f00;
  }

  .mini-challenge p {
    margin: 5px 0 0 0;
    color: #666;
    font-size: 0.9rem;
  }

  .current-challenge-box {
    background: #ffebee;
    padding: 15px;
    border-radius: 6px;
    margin: 15px 0;
  }

  .current-challenge-box h4 {
    margin: 0 0 10px 0;
    color: #c62828;
  }

  .flash-reward {
    display: inline-block;
    background: #f44336;
    color: white;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    margin-top: 10px;
  }

  .exclusive-rewards {
    margin: 20px 0;
  }

  .exclusive-rewards h4 {
    margin: 0 0 10px 0;
    color: #1f2933;
  }

  .rewards-tags {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .reward-tag {
    background: linear-gradient(135deg, #fff3e0, #ffe0b2);
    border: 1px solid #ff9800;
    color: #e65100;
    padding: 8px 15px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
  }
`;

if (!document.getElementById('challenges-styles')) {
  const styleTag = document.createElement('style');
  styleTag.id = 'challenges-styles';
  styleTag.textContent = challengesStyles;
  document.head.appendChild(styleTag);
}

document.addEventListener('DOMContentLoaded', () => {
  ChallengesCompetitions.init();
});

console.log('✓ Challenges & Competitions module loaded');