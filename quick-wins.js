class StreakCounter {
  constructor() {
    this.initStreak();
    this.displayStreakInHeader();
  }

  initStreak() {
    const lastVisit = localStorage.getItem('last-visit-date');
    const currentStreak = parseInt(localStorage.getItem('current-streak') || '0');
    const today = new Date().toDateString();

    if (lastVisit === today) {
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastVisit === yesterday.toDateString()) {
      localStorage.setItem('current-streak', currentStreak + 1);
    } else if (!lastVisit) {
      localStorage.setItem('current-streak', '1');
    } else {
      localStorage.setItem('current-streak', '1');
    }

    localStorage.setItem('last-visit-date', today);
  }

  getCurrentStreak() {
    return parseInt(localStorage.getItem('current-streak') || '0');
  }

  displayStreakInHeader() {
    const streak = this.getCurrentStreak();
    const streakDisplay = document.getElementById('streak-display');
    
    if (streakDisplay) {
      streakDisplay.innerHTML = `
        <div style="display: flex; align-items: center; gap: 6px; padding: 8px 16px; background: linear-gradient(135deg, #ff6b35 0%, #ff8533 100%); border-radius: 20px; cursor: pointer; box-shadow: 0 2px 8px rgba(255,107,53,0.3); transition: transform 0.2s ease;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" onclick="streakCounter.showStreakModal()">
          <span style="font-size: 18px;">🔥</span>
          <span style="color: white; font-weight: 600; font-size: 14px;">${streak} Day${streak !== 1 ? 's' : ''}</span>
        </div>
      `;
    }
  }

  showStreakModal() {
    const streak = this.getCurrentStreak();
    const modal = document.createElement('div');
    modal.className = 'streak-modal';
    modal.innerHTML = `
      <div class="streak-modal-content" style="background: white; padding: 40px; border-radius: 16px; max-width: 400px; text-align: center; position: relative; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
        <button onclick="this.closest('.streak-modal').remove()" style="position: absolute; top: 16px; right: 16px; background: none; border: none; font-size: 24px; cursor: pointer; color: #999;">×</button>
        
        <div style="font-size: 72px; margin-bottom: 16px;">🔥</div>
        <h2 style="color: #ff6b35; font-size: 32px; margin: 0 0 8px 0;">${streak} Day Streak!</h2>
        <p style="color: #666; margin-bottom: 24px;">Keep it going! Come back tomorrow to maintain your streak.</p>
        
        <div style="background: linear-gradient(135deg, #fff5f2 0%, #ffe8e0 100%); padding: 20px; border-radius: 12px; margin-bottom: 24px;">
          <div style="font-size: 14px; color: #ff6b35; font-weight: 600; margin-bottom: 12px;">STREAK MILESTONES</div>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
            <div style="padding: 12px; background: ${streak >= 7 ? '#ff6b35' : '#fff'}; color: ${streak >= 7 ? '#fff' : '#999'}; border-radius: 8px; font-size: 12px;">
              <div style="font-size: 20px; margin-bottom: 4px;">🔥</div>
              <div style="font-weight: 600;">7 Days</div>
            </div>
            <div style="padding: 12px; background: ${streak >= 30 ? '#ff6b35' : '#fff'}; color: ${streak >= 30 ? '#fff' : '#999'}; border-radius: 8px; font-size: 12px;">
              <div style="font-size: 20px; margin-bottom: 4px;">💪</div>
              <div style="font-weight: 600;">30 Days</div>
            </div>
            <div style="padding: 12px; background: ${streak >= 100 ? '#ff6b35' : '#fff'}; color: ${streak >= 100 ? '#fff' : '#999'}; border-radius: 8px; font-size: 12px;">
              <div style="font-size: 20px; margin-bottom: 4px;">🏆</div>
              <div style="font-weight: 600;">100 Days</div>
            </div>
          </div>
        </div>

        <div style="font-size: 12px; color: #999;">Last visit: ${localStorage.getItem('last-visit-date')}</div>
      </div>
    `;
    
    modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000;';
    document.body.appendChild(modal);
  }
}

class ConfettiManager {
  constructor() {
    this.loadConfettiLibrary();
  }

  loadConfettiLibrary() {
    if (!window.confetti) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
      document.head.appendChild(script);
    }
  }

  celebrate(score) {
    if (!window.confetti) {
      console.warn('Confetti library not loaded yet');
      return;
    }

    if (score >= 90) {
      this.perfectScoreCelebration();
    } else if (score >= 70) {
      this.goodScoreCelebration();
    } else {
      this.completionCelebration();
    }
  }

  perfectScoreCelebration() {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti(Object.assign({}, defaults, { 
        particleCount, 
        origin: { x: Math.random(), y: Math.random() - 0.2 } 
      }));
    }, 250);
  }

  goodScoreCelebration() {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      zIndex: 10000
    });
  }

  completionCelebration() {
    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.7 },
      zIndex: 10000
    });
  }

  fireworks() {
    const duration = 5000;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#0097b2', '#ff6b35', '#ffd700'],
        zIndex: 10000
      });
      
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#0097b2', '#ff6b35', '#ffd700'],
        zIndex: 10000
      });
    }, 200);
  }
}

class BadgeSystem {
  constructor() {
    this.badges = this.defineBadges();
    this.checkAndAwardBadges();
  }

  defineBadges() {
    return {
      'streak-7': { name: 'Week Warrior', icon: '🔥', description: 'Maintained a 7-day streak', requirement: 7, type: 'streak' },
      'streak-30': { name: 'Monthly Master', icon: '💪', description: '30 consecutive days!', requirement: 30, type: 'streak' },
      'streak-100': { name: 'Century Champion', icon: '🏆', description: '100 days of dedication!', requirement: 100, type: 'streak' },
      
      'quiz-10': { name: 'Quiz Novice', icon: '📝', description: 'Completed 10 quizzes', requirement: 10, type: 'quiz-count' },
      'quiz-50': { name: 'Quiz Expert', icon: '📚', description: 'Completed 50 quizzes', requirement: 50, type: 'quiz-count' },
      'quiz-100': { name: 'Quiz Master', icon: '🌟', description: 'Completed 100 quizzes!', requirement: 100, type: 'quiz-count' },
      
      'perfect-first': { name: 'First Perfect', icon: '💯', description: 'First 100% score!', requirement: 1, type: 'perfect-score' },
      'perfect-10': { name: 'Perfectionist', icon: '✨', description: '10 perfect scores', requirement: 10, type: 'perfect-score' },
      
      'speed-demon': { name: 'Speed Demon', icon: '⚡', description: 'Completed quiz under 2 minutes', requirement: 1, type: 'speed' },
      
      'math-master': { name: 'Math Master', icon: '🔢', description: 'Average 90%+ in Math', requirement: 90, type: 'math-average' },
      'science-scholar': { name: 'Science Scholar', icon: '🔬', description: 'Average 90%+ in Science', requirement: 90, type: 'science-average' },
      'social-sage': { name: 'Social Sage', icon: '🌍', description: 'Average 90%+ in Social Studies', requirement: 90, type: 'social-average' },
      
      'early-bird': { name: 'Early Bird', icon: '🌅', description: 'Completed quiz before 8 AM', requirement: 1, type: 'early-morning' },
      'night-owl': { name: 'Night Owl', icon: '🦉', description: 'Completed quiz after 10 PM', requirement: 1, type: 'late-night' },
      
      'challenge-champion': { name: 'Challenge Champion', icon: '🎯', description: 'Completed 5 daily challenges', requirement: 5, type: 'daily-challenges' }
    };
  }

  checkAndAwardBadges() {
    const earnedBadges = JSON.parse(localStorage.getItem('earned-badges') || '[]');
    const newBadges = [];

    Object.keys(this.badges).forEach(badgeId => {
      if (!earnedBadges.includes(badgeId)) {
        if (this.checkBadgeRequirement(badgeId)) {
          earnedBadges.push(badgeId);
          newBadges.push(badgeId);
        }
      }
    });

    if (newBadges.length > 0) {
      localStorage.setItem('earned-badges', JSON.stringify(earnedBadges));
      this.showBadgeNotification(newBadges);
    }
  }

  checkBadgeRequirement(badgeId) {
    const badge = this.badges[badgeId];
    
    switch(badge.type) {
      case 'streak':
        return parseInt(localStorage.getItem('current-streak') || '0') >= badge.requirement;
      
      case 'quiz-count':
        return parseInt(localStorage.getItem('total-quizzes') || '0') >= badge.requirement;
      
      case 'perfect-score':
        return parseInt(localStorage.getItem('perfect-scores') || '0') >= badge.requirement;
      
      case 'daily-challenges':
        const completed = JSON.parse(localStorage.getItem('completed-daily-challenges') || '[]');
        return completed.length >= badge.requirement;
      
      default:
        return false;
    }
  }

  showBadgeNotification(badgeIds) {
    badgeIds.forEach((badgeId, index) => {
      setTimeout(() => {
        const badge = this.badges[badgeId];
        const notification = document.createElement('div');
        notification.className = 'badge-notification';
        notification.innerHTML = `
          <div style="display: flex; align-items: center; gap: 16px; padding: 20px; background: linear-gradient(135deg, #0097b2 0%, #00b4d8 100%); color: white; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,151,178,0.4); animation: slideInRight 0.5s ease;">
            <div style="font-size: 48px;">${badge.icon}</div>
            <div>
              <div style="font-size: 18px; font-weight: 700; margin-bottom: 4px;">New Badge Earned!</div>
              <div style="font-size: 16px; font-weight: 600;">${badge.name}</div>
              <div style="font-size: 12px; opacity: 0.9;">${badge.description}</div>
            </div>
          </div>
        `;
        
        notification.style.cssText = 'position: fixed; top: 80px; right: 20px; z-index: 10000; animation: slideInRight 0.5s ease;';
        document.body.appendChild(notification);

        if (window.confetti) {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { x: 0.9, y: 0.2 },
            zIndex: 10000
          });
        }

        setTimeout(() => {
          notification.style.animation = 'slideOutRight 0.5s ease';
          setTimeout(() => notification.remove(), 500);
        }, 4000);
      }, index * 500);
    });
  }

  showAllBadges() {
    const earnedBadges = JSON.parse(localStorage.getItem('earned-badges') || '[]');
    const modal = document.createElement('div');
    
    modal.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000;" onclick="this.remove()">
        <div style="background: white; padding: 40px; border-radius: 16px; max-width: 700px; max-height: 80vh; overflow-y: auto;" onclick="event.stopPropagation()">
          <h2 style="margin: 0 0 24px 0; color: #0097b2;">🏆 Your Badges</h2>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px;">
            ${Object.keys(this.badges).map(badgeId => {
              const badge = this.badges[badgeId];
              const earned = earnedBadges.includes(badgeId);
              
              return `
                <div style="padding: 20px; border-radius: 12px; background: ${earned ? 'linear-gradient(135deg, #0097b2 0%, #00b4d8 100%)' : '#f5f5f5'}; color: ${earned ? 'white' : '#999'}; text-align: center; transition: transform 0.2s ease;" ${earned ? 'onmouseover="this.style.transform=\'scale(1.05)\'" onmouseout="this.style.transform=\'scale(1)\'"' : ''}>
                  <div style="font-size: 48px; margin-bottom: 12px; ${!earned ? 'filter: grayscale(100%); opacity: 0.3;' : ''}">${badge.icon}</div>
                  <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">${badge.name}</div>
                  <div style="font-size: 11px; opacity: 0.8;">${badge.description}</div>
                  ${!earned ? `<div style="font-size: 10px; margin-top: 8px; opacity: 0.6;">🔒 Locked</div>` : ''}
                </div>
              `;
            }).join('')}
          </div>

          <div style="margin-top: 24px; text-align: center;">
            <button onclick="this.closest('div').parentElement.remove()" style="padding: 12px 32px; background: #0097b2; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Close</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }
}

class CircularProgress {
  static create(percentage, size = 120, strokeWidth = 8) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    
    const color = percentage >= 90 ? '#10b981' : percentage >= 70 ? '#0097b2' : percentage >= 50 ? '#f59e0b' : '#ef4444';
    
    return `
      <svg width="${size}" height="${size}" style="transform: rotate(-90deg);">
        <circle
          cx="${size / 2}"
          cy="${size / 2}"
          r="${radius}"
          fill="none"
          stroke="#e5e7eb"
          stroke-width="${strokeWidth}"
        />
        <circle
          cx="${size / 2}"
          cy="${size / 2}"
          r="${radius}"
          fill="none"
          stroke="${color}"
          stroke-width="${strokeWidth}"
          stroke-dasharray="${circumference}"
          stroke-dashoffset="${offset}"
          stroke-linecap="round"
          style="transition: stroke-dashoffset 1s ease;"
        />
        <text
          x="${size / 2}"
          y="${size / 2}"
          text-anchor="middle"
          dy=".3em"
          font-size="${size / 4}"
          font-weight="bold"
          fill="${color}"
          style="transform: rotate(90deg); transform-origin: center;"
        >
          ${Math.round(percentage)}%
        </text>
      </svg>
    `;
  }
}

class SoundManager {
  constructor() {
    this.enabled = localStorage.getItem('sounds-enabled') !== 'false';
    this.initAudioContext();
  }

  initAudioContext() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  playCorrect() {
    if (!this.enabled) return;
    
    this.playTone([523.25, 659.25, 783.99], [0, 0.1, 0.2], 0.3);
  }

  playIncorrect() {
    if (!this.enabled) return;
    
    this.playTone([329.63, 293.66], [0, 0.15], 0.3);
  }

  playSuccess() {
    if (!this.enabled) return;
    
    this.playTone([523.25, 659.25, 783.99, 1046.50], [0, 0.1, 0.2, 0.3], 0.5);
  }

  playClick() {
    if (!this.enabled) return;
    
    this.playTone([800], [0], 0.05);
  }

  playTone(frequencies, timings, duration) {
    frequencies.forEach((freq, index) => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.value = freq;
      oscillator.type = 'sine';
      
      const startTime = this.audioContext.currentTime + timings[index];
      gainNode.gain.setValueAtTime(0.3, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    });
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('sounds-enabled', this.enabled);
    return this.enabled;
  }
}

class LoadingTips {
  constructor() {
    this.tips = [
      "💡 The Pythagorean theorem has been known for over 2,500 years!",
      "🌍 The Earth's core is as hot as the surface of the Sun (about 5,500°C).",
      "🧠 Your brain uses about 20% of your body's energy, even though it's only 2% of your weight.",
      "⚡ Lightning is five times hotter than the surface of the Sun.",
      "🔬 A single drop of water contains about 1.7 sextillion molecules.",
      "📐 The sum of angles in a triangle always equals 180 degrees.",
      "🌟 Light from the Sun takes about 8 minutes to reach Earth.",
      "🧬 Humans share about 60% of their DNA with bananas!",
      "🎯 Practice makes perfect - but perfect practice makes permanent!",
      "💪 The more you challenge yourself, the smarter you become.",
      "📚 Reading for just 6 minutes can reduce stress by up to 68%.",
      "🧮 The number 0 was invented in ancient India around 5th century AD.",
      "🌊 Water is the only substance that is less dense as a solid than a liquid.",
      "🔋 The human body generates enough electricity to power a small light bulb.",
      "🌈 A rainbow is actually a full circle, we usually only see half of it.",
      "🎨 Leonardo da Vinci could write with one hand and draw with the other simultaneously.",
      "🚀 There are more stars in the universe than grains of sand on Earth.",
      "🧪 The chemical formula for table salt is NaCl (Sodium Chloride).",
      "📊 Statistics show that students who quiz themselves learn 50% more.",
      "🎓 The best time to study is different for everyone - find your peak hours!"
    ];
  }

  getRandomTip() {
    return this.tips[Math.floor(Math.random() * this.tips.length)];
  }

  showLoadingScreen(callback, minDuration = 1500) {
    const loader = document.createElement('div');
    loader.className = 'loading-screen';
    loader.innerHTML = `
      <div style="text-align: center;">
        <div class="spinner" style="width: 60px; height: 60px; border: 4px solid #f3f3f3; border-top: 4px solid #0097b2; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 24px;"></div>
        <div style="font-size: 18px; color: #0097b2; font-weight: 600; margin-bottom: 16px;">Loading...</div>
        <div style="max-width: 400px; font-size: 14px; color: #666; padding: 16px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #0097b2;">
          ${this.getRandomTip()}
        </div>
      </div>
    `;
    
    loader.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.95); display: flex; align-items: center; justify-content: center; z-index: 10000;';
    document.body.appendChild(loader);

    const startTime = Date.now();
    
    const complete = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minDuration - elapsed);
      
      setTimeout(() => {
        loader.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
          loader.remove();
          if (callback) callback();
        }, 300);
      }, remaining);
    };

    return complete;
  }
}

class KeyboardShortcuts {
  constructor() {
    this.shortcuts = {
      '1': 'Select answer A',
      '2': 'Select answer B',
      '3': 'Select answer C',
      '4': 'Select answer D',
      'Enter': 'Submit answer',
      'n': 'Next question',
      'r': 'Random quiz',
      's': 'Toggle sound',
      '?': 'Show shortcuts'
    };
    
    this.initShortcuts();
  }

  initShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch(e.key) {
        case '1':
        case '2':
        case '3':
        case '4':
          this.selectAnswer(parseInt(e.key) - 1);
          break;
        
        case 'Enter':
          this.submitAnswer();
          break;
        
        case 'n':
          this.nextQuestion();
          break;
        
        case 'r':
          window.randomQuiz?.();
          break;
        
        case 's':
          window.soundManager?.toggle();
          break;
        
        case '?':
          this.showShortcutsModal();
          break;
      }
    });
  }

  selectAnswer(index) {
    const answers = document.querySelectorAll('.answer-option');
    if (answers[index]) {
      answers[index].click();
    }
  }

  submitAnswer() {
    const submitBtn = document.querySelector('button[onclick*="submit"]') || 
                     document.querySelector('.submit-btn');
    if (submitBtn) submitBtn.click();
  }

  nextQuestion() {
    const nextBtn = document.querySelector('button[onclick*="next"]') || 
                   document.querySelector('.next-btn');
    if (nextBtn) nextBtn.click();
  }

  showShortcutsModal() {
    const modal = document.createElement('div');
    modal.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000;" onclick="this.remove()">
        <div style="background: white; padding: 32px; border-radius: 16px; max-width: 500px;" onclick="event.stopPropagation()">
          <h2 style="margin: 0 0 24px 0; color: #0097b2;">⌨️ Keyboard Shortcuts</h2>
          
          <div style="display: grid; gap: 12px;">
            ${Object.entries(this.shortcuts).map(([key, description]) => `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #f8f9fa; border-radius: 8px;">
                <span style="color: #666;">${description}</span>
                <kbd style="padding: 4px 12px; background: white; border: 2px solid #ddd; border-radius: 4px; font-family: monospace; font-weight: 600; color: #0097b2;">${key}</kbd>
              </div>
            `).join('')}
          </div>

          <button onclick="this.closest('div').parentElement.remove()" style="margin-top: 24px; width: 100%; padding: 12px; background: #0097b2; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Got it!</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }
}

class TimeIndicators {
  static addToQuizCards() {
    const timeEstimates = {
      'mathematics': 5,
      'algebra': 5,
      'geometry': 6,
      'calculus': 7,
      'science': 5,
      'physics': 6,
      'chemistry': 6,
      'biology': 5,
      'social_studies': 4,
      'history': 5,
      'civics': 4
    };

    document.querySelectorAll('.quiz-card, .subject-card').forEach(card => {
      const cardText = card.textContent.toLowerCase();
      let estimatedTime = 5; 

      Object.keys(timeEstimates).forEach(subject => {
        if (cardText.includes(subject)) {
          estimatedTime = timeEstimates[subject];
        }
      });

      if (!card.querySelector('.time-indicator')) {
        const timeIndicator = document.createElement('div');
        timeIndicator.className = 'time-indicator';
        timeIndicator.innerHTML = `
          <span style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; background: rgba(0,151,178,0.1); color: #0097b2; border-radius: 12px; font-size: 12px; font-weight: 600;">
            <span>⏱️</span>
            <span>~${estimatedTime} min</span>
          </span>
        `;
        timeIndicator.style.cssText = 'margin-top: 8px;';
        card.appendChild(timeIndicator);
      }
    });
  }

  static startQuizTimer(onComplete) {
    let seconds = 0;
    const timerDisplay = document.createElement('div');
    timerDisplay.id = 'quiz-timer';
    timerDisplay.style.cssText = 'position: fixed; top: 80px; right: 20px; padding: 12px 20px; background: linear-gradient(135deg, #0097b2 0%, #00b4d8 100%); color: white; border-radius: 20px; font-weight: 600; box-shadow: 0 4px 12px rgba(0,151,178,0.3); z-index: 1000; display: flex; align-items: center; gap: 8px;';
    
    const interval = setInterval(() => {
      seconds++;
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      timerDisplay.innerHTML = `
        <span>⏱️</span>
        <span>${mins}:${secs.toString().padStart(2, '0')}</span>
      `;
    }, 1000);

    timerDisplay.innerHTML = '<span>⏱️</span><span>0:00</span>';
    document.body.appendChild(timerDisplay);

    return {
      stop: () => {
        clearInterval(interval);
        timerDisplay.remove();
        
        if (seconds < 120) {
          const earnedBadges = JSON.parse(localStorage.getItem('earned-badges') || '[]');
          if (!earnedBadges.includes('speed-demon')) {
            earnedBadges.push('speed-demon');
            localStorage.setItem('earned-badges', JSON.stringify(earnedBadges));
          }
        }
        
        if (onComplete) onComplete(seconds);
        return seconds;
      },
      getTime: () => seconds
    };
  }
}

const randomQuizQuestions = [
  { id: 'rq-001', difficulty: 'Easy', category: 'Mathematics', question: 'What is 12 × 9?', options: ['98', '108', '118', '128'], correct: 1, explanation: '12 × 9 = 108', points: 10 },
  { id: 'rq-002', difficulty: 'Medium', category: 'Science', question: 'What is the pH of pure water?', options: ['5', '7', '9', '11'], correct: 1, explanation: 'Pure water has a neutral pH of 7', points: 15 },
  { id: 'rq-003', difficulty: 'Hard', category: 'Mathematics', question: 'What is the integral of 2x?', options: ['x²', 'x² + C', '2x²', '2x² + C'], correct: 1, explanation: '∫2x dx = x² + C (constant of integration)', points: 25 },
  { id: 'rq-004', difficulty: 'Easy', category: 'Science', question: 'How many bones are in the human body?', options: ['196', '206', '216', '226'], correct: 1, explanation: 'An adult human has 206 bones', points: 10 },
  { id: 'rq-005', difficulty: 'Medium', category: 'Mathematics', question: 'What is 25% of 80?', options: ['15', '20', '25', '30'], correct: 1, explanation: '25% of 80 = 0.25 × 80 = 20', points: 15 },
  { id: 'rq-006', difficulty: 'Hard', category: 'Science', question: 'What is the first law of thermodynamics?', options: ['Energy can be created', 'Energy is conserved', 'Entropy increases', 'Heat flows to cold'], correct: 1, explanation: 'First law: Energy cannot be created or destroyed, only transformed', points: 25 },
  { id: 'rq-007', difficulty: 'Easy', category: 'Mathematics', question: 'What is the perimeter of a square with side 6?', options: ['12', '18', '24', '36'], correct: 2, explanation: 'Perimeter = 4 × side = 4 × 6 = 24', points: 10 },
  { id: 'rq-008', difficulty: 'Medium', category: 'Science', question: 'What type of bond involves sharing electrons?', options: ['Ionic', 'Covalent', 'Metallic', 'Hydrogen'], correct: 1, explanation: 'Covalent bonds involve the sharing of electron pairs between atoms', points: 15 },
  { id: 'rq-009', difficulty: 'Hard', category: 'Mathematics', question: 'Solve: log₂(32) = ?', options: ['4', '5', '6', '7'], correct: 1, explanation: 'log₂(32) = 5 because 2⁵ = 32', points: 25 },
  { id: 'rq-010', difficulty: 'Easy', category: 'Science', question: 'What is the center of an atom called?', options: ['Electron', 'Proton', 'Nucleus', 'Neutron'], correct: 2, explanation: 'The nucleus is the central part of an atom containing protons and neutrons', points: 10 },
  { id: 'rq-011', difficulty: 'Medium', category: 'Mathematics', question: 'What is the sum of angles in a triangle?', options: ['90°', '180°', '270°', '360°'], correct: 1, explanation: 'The sum of all angles in any triangle is always 180°', points: 15 },
  { id: 'rq-012', difficulty: 'Hard', category: 'Science', question: 'What is Avogadro\'s number?', options: ['6.02 × 10²³', '3.14 × 10⁸', '9.81 × 10²', '1.60 × 10⁻¹⁹'], correct: 0, explanation: 'Avogadro\'s number is 6.02 × 10²³ particles per mole', points: 25 },
  { id: 'rq-013', difficulty: 'Easy', category: 'Mathematics', question: 'What is 100 ÷ 4?', options: ['20', '25', '30', '35'], correct: 1, explanation: '100 ÷ 4 = 25', points: 10 },
  { id: 'rq-014', difficulty: 'Medium', category: 'Science', question: 'What is the unit of electrical resistance?', options: ['Volt', 'Ampere', 'Ohm', 'Watt'], correct: 2, explanation: 'Electrical resistance is measured in Ohms (Ω)', points: 15 },
  { id: 'rq-015', difficulty: 'Hard', category: 'Mathematics', question: 'What is the value of sin(90°)?', options: ['0', '0.5', '1', '√2'], correct: 2, explanation: 'sin(90°) = 1 (maximum value of sine function)', points: 25 },
  { id: 'rq-016', difficulty: 'Easy', category: 'Science', question: 'What gas do plants absorb from the atmosphere?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], correct: 2, explanation: 'Plants absorb CO₂ for photosynthesis', points: 10 },
  { id: 'rq-017', difficulty: 'Medium', category: 'Mathematics', question: 'What is the slope of y = 3x + 2?', options: ['2', '3', '5', '6'], correct: 1, explanation: 'In y = mx + b form, m is the slope, so slope = 3', points: 15 },
  { id: 'rq-018', difficulty: 'Hard', category: 'Science', question: 'What is the half-life of Carbon-14?', options: ['500 years', '5,730 years', '57,300 years', '573,000 years'], correct: 1, explanation: 'Carbon-14 has a half-life of approximately 5,730 years', points: 25 },
  { id: 'rq-019', difficulty: 'Easy', category: 'Mathematics', question: 'How many millimeters are in 1 meter?', options: ['10', '100', '1000', '10000'], correct: 2, explanation: '1 meter = 1000 millimeters', points: 10 },
  { id: 'rq-020', difficulty: 'Medium', category: 'Science', question: 'What is the process of cell division called?', options: ['Mitosis', 'Meiosis', 'Both', 'Neither'], correct: 2, explanation: 'Both mitosis (body cells) and meiosis (sex cells) are types of cell division', points: 15 },
  { id: 'rq-021', difficulty: 'Hard', category: 'Mathematics', question: 'What is e (Euler\'s number) approximately?', options: ['2.52', '2.72', '3.14', '3.72'], correct: 1, explanation: 'e ≈ 2.71828... (base of natural logarithms)', points: 25 },
  { id: 'rq-022', difficulty: 'Easy', category: 'Science', question: 'What is the boiling point of water in Celsius?', options: ['0°C', '50°C', '100°C', '212°C'], correct: 2, explanation: 'Water boils at 100°C at standard atmospheric pressure', points: 10 },
  { id: 'rq-023', difficulty: 'Medium', category: 'Mathematics', question: 'What is 2³ + 3²?', options: ['13', '15', '17', '19'], correct: 2, explanation: '2³ + 3² = 8 + 9 = 17', points: 15 },
  { id: 'rq-024', difficulty: 'Hard', category: 'Science', question: 'What is Newton\'s second law of motion?', options: ['F = ma', 'E = mc²', 'PV = nRT', 'V = IR'], correct: 0, explanation: 'Newton\'s second law: Force = mass × acceleration', points: 25 },
  { id: 'rq-025', difficulty: 'Easy', category: 'Mathematics', question: 'What is the volume of a cube with side 3?', options: ['9', '18', '27', '81'], correct: 2, explanation: 'Volume = side³ = 3³ = 27', points: 10 },
  { id: 'rq-026', difficulty: 'Medium', category: 'Science', question: 'What are the building blocks of proteins?', options: ['Nucleotides', 'Amino acids', 'Glucose', 'Lipids'], correct: 1, explanation: 'Proteins are made up of chains of amino acids', points: 15 },
  { id: 'rq-027', difficulty: 'Hard', category: 'Mathematics', question: 'What is the quadratic formula discriminant for x² + 2x + 1?', options: ['-2', '0', '2', '4'], correct: 1, explanation: 'Discriminant = b² - 4ac = 4 - 4(1)(1) = 0', points: 25 },
  { id: 'rq-028', difficulty: 'Easy', category: 'Science', question: 'How many chromosomes do humans have?', options: ['23', '46', '48', '92'], correct: 1, explanation: 'Humans have 46 chromosomes (23 pairs)', points: 10 },
  { id: 'rq-029', difficulty: 'Medium', category: 'Mathematics', question: 'What is the next prime number after 7?', options: ['9', '10', '11', '13'], correct: 2, explanation: '11 is the next prime number (only divisible by 1 and itself)', points: 15 },
  { id: 'rq-030', difficulty: 'Hard', category: 'Science', question: 'What is the universal gas constant R?', options: ['6.02', '8.31', '9.81', '10.00'], correct: 1, explanation: 'R = 8.31 J/(mol·K) in SI units', points: 25 },
  { id: 'rq-031', difficulty: 'Easy', category: 'Mathematics', question: 'What is 50% of 200?', options: ['50', '75', '100', '150'], correct: 2, explanation: '50% of 200 = 0.5 × 200 = 100', points: 10 },
  { id: 'rq-032', difficulty: 'Medium', category: 'Science', question: 'What particle has no electric charge?', options: ['Proton', 'Electron', 'Neutron', 'Ion'], correct: 2, explanation: 'Neutrons have no electric charge (neutral)', points: 15 },
  { id: 'rq-033', difficulty: 'Hard', category: 'Mathematics', question: 'What is the limit as x→0 of (sin x)/x?', options: ['0', '0.5', '1', '∞'], correct: 2, explanation: 'lim(x→0) sin(x)/x = 1 (important calculus limit)', points: 25 },
  { id: 'rq-034', difficulty: 'Easy', category: 'Science', question: 'What is the symbol for sodium?', options: ['So', 'Sd', 'Na', 'S'], correct: 2, explanation: 'Sodium\'s symbol is Na (from Latin "Natrium")', points: 10 },
  { id: 'rq-035', difficulty: 'Medium', category: 'Mathematics', question: 'What is the area of a circle with radius 5?', options: ['25π', '10π', '5π', '50π'], correct: 0, explanation: 'Area = πr² = π(5²) = 25π', points: 15 }
];

function randomQuiz() {
  if (window.QuestionGenerator) {
    window.QuestionGenerator.getRandomQuizQuestions().then(result => {
      const selectedQuestions = result.questions;
      showRandomQuizModal(selectedQuestions);
    }).catch(err => {
      console.warn('Question generator failed, using static questions:', err);
      const shuffled = [...randomQuizQuestions].sort(() => Math.random() - 0.5);
      const selectedQuestions = shuffled.slice(0, 5);
      showRandomQuizModal(selectedQuestions);
    });
  } else {
    const shuffled = [...randomQuizQuestions].sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, 5);
    showRandomQuizModal(selectedQuestions);
  }
}

function showRandomQuizModal(selectedQuestions) {
  let currentQuestion = 0;
  let score = 0;
  let answers = [];
  
  const modal = document.createElement('div');
  modal.id = 'random-quiz-modal';
  modal.innerHTML = `
    <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 10000; padding: 20px;" onclick="if(event.target === this) this.remove()">
      <div style="background: white; padding: 32px; border-radius: 16px; max-width: 700px; width: 100%; max-height: 90vh; overflow-y: auto;" onclick="event.stopPropagation()">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <h2 style="margin: 0; color: #8b5cf6; font-size: 1.8rem;">🎲 Random Quiz</h2>
          <button onclick="document.getElementById('random-quiz-modal').remove()" style="background: none; border: none; font-size: 2rem; cursor: pointer; color: #999; line-height: 1;">&times;</button>
        </div>
        
        <div id="quiz-progress" style="margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-weight: 600; color: #666;">Question <span id="current-q">1</span> of 5</span>
            <span style="font-weight: 600; color: #8b5cf6;">Score: <span id="quiz-score">0</span> pts</span>
          </div>
          <div style="background: #e0e0e0; height: 8px; border-radius: 4px; overflow: hidden;">
            <div id="progress-bar" style="background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%); height: 100%; width: 20%; transition: width 0.3s;"></div>
          </div>
        </div>
        
        <div id="quiz-content"></div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  function showQuestion() {
    const q = selectedQuestions[currentQuestion];
    const content = document.getElementById('quiz-content');
    
    content.innerHTML = `
      <div style="margin-bottom: 24px;">
        <div style="display: inline-block; background: ${q.difficulty === 'Easy' ? '#4caf50' : q.difficulty === 'Medium' ? '#ff9800' : '#f44336'}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 0.85rem; font-weight: 600; margin-bottom: 12px;">${q.difficulty}</div>
        <div style="display: inline-block; background: #e3f2fd; color: #1976d2; padding: 4px 12px; border-radius: 12px; font-size: 0.85rem; font-weight: 600; margin-bottom: 12px; margin-left: 8px;">${q.category}</div>
        <h3 style="color: #333; font-size: 1.3rem; margin: 12px 0;">${q.question}</h3>
      </div>
      
      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${q.options.map((opt, idx) => `
          <button class="quiz-option" data-index="${idx}" style="padding: 16px; border: 2px solid #e0e0e0; border-radius: 12px; background: white; cursor: pointer; text-align: left; font-size: 1rem; transition: all 0.2s; font-weight: 500;" onmouseover="this.style.borderColor='#8b5cf6'; this.style.background='#f3f0ff'" onmouseout="this.style.borderColor='#e0e0e0'; this.style.background='white'">
            ${String.fromCharCode(65 + idx)}. ${opt}
          </button>
        `).join('')}
      </div>
      
      <div id="feedback" style="margin-top: 20px; padding: 16px; border-radius: 8px; display: none;"></div>
      
      <div style="margin-top: 24px; text-align: right;">
        <button id="next-btn" style="padding: 12px 32px; background: #ccc; color: white; border: none; border-radius: 8px; font-weight: 600; font-size: 1rem; cursor: not-allowed;" disabled>Next Question</button>
      </div>
    `;
    
    document.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => selectAnswer(btn, q));
    });
  }
  
  function selectAnswer(btn, q) {
    const selectedIndex = parseInt(btn.dataset.index);
    const isCorrect = selectedIndex === q.correct;
    
    document.querySelectorAll('.quiz-option').forEach(opt => {
      opt.style.pointerEvents = 'none';
      const idx = parseInt(opt.dataset.index);
      if (idx === q.correct) {
        opt.style.borderColor = '#4caf50';
        opt.style.background = '#e8f5e9';
        opt.style.color = '#2e7d32';
      } else if (idx === selectedIndex && !isCorrect) {
        opt.style.borderColor = '#f44336';
        opt.style.background = '#ffebee';
        opt.style.color = '#c62828';
      }
    });
    
    if (isCorrect) {
      score += q.points;
      document.getElementById('quiz-score').textContent = score;
    }
    
    answers.push({ question: q.question, selectedIndex, isCorrect, points: isCorrect ? q.points : 0 });
    
    const feedback = document.getElementById('feedback');
    feedback.style.display = 'block';
    feedback.style.background = isCorrect ? '#e8f5e9' : '#ffebee';
    feedback.style.borderLeft = `4px solid ${isCorrect ? '#4caf50' : '#f44336'}`;
    feedback.innerHTML = `
      <div style="font-weight: 600; color: ${isCorrect ? '#2e7d32' : '#c62828'}; margin-bottom: 8px;">
        ${isCorrect ? '✓ Correct!' : '✗ Incorrect'}
        ${isCorrect ? ` +${q.points} points` : ''}
      </div>
      <div style="color: #666;">${q.explanation}</div>
    `;
    
    const nextBtn = document.getElementById('next-btn');
    nextBtn.disabled = false;
    nextBtn.style.background = 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)';
    nextBtn.style.cursor = 'pointer';
    nextBtn.onclick = () => {
      currentQuestion++;
      if (currentQuestion < 5) {
        document.getElementById('current-q').textContent = currentQuestion + 1;
        document.getElementById('progress-bar').style.width = ((currentQuestion + 1) / 5 * 100) + '%';
        showQuestion();
      } else {
        showResults();
      }
    };
  }
  
  function showResults() {
    const content = document.getElementById('quiz-content');
    const percentage = (score / (selectedQuestions.reduce((sum, q) => sum + q.points, 0))) * 100;
    
    content.innerHTML = `
      <div style="text-align: center; padding: 20px;">
        <div style="font-size: 4rem; margin-bottom: 16px;">${percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '📚'}</div>
        <h2 style="color: #8b5cf6; margin-bottom: 12px;">Quiz Complete!</h2>
        <div style="font-size: 3rem; font-weight: 700; color: #8b5cf6; margin: 20px 0;">${score} pts</div>
        <div style="font-size: 1.2rem; color: #666; margin-bottom: 24px;">${Math.round(percentage)}% Accuracy</div>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 12px; margin: 24px 0;">
          <h3 style="margin-bottom: 16px; color: #333;">Summary</h3>
          ${answers.map((a, i) => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px; border-bottom: 1px solid #e0e0e0;">
              <span style="color: #666;">Question ${i + 1}</span>
              <span style="color: ${a.isCorrect ? '#4caf50' : '#f44336'}; font-weight: 600;">
                ${a.isCorrect ? '✓ +' + a.points + ' pts' : '✗ 0 pts'}
              </span>
            </div>
          `).join('')}
        </div>
        
        <div style="display: flex; gap: 12px; justify-content: center; margin-top: 24px;">
          <button onclick="document.getElementById('random-quiz-modal').remove(); randomQuiz();" style="padding: 12px 24px; background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
            🔄 New Random Quiz
          </button>
          <button onclick="document.getElementById('random-quiz-modal').remove()" style="padding: 12px 24px; background: #e0e0e0; color: #666; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
            Close
          </button>
        </div>
      </div>
    `;
    
    if (typeof recordLearningActivity === 'function') {
      recordLearningActivity('quiz', 'Random Quiz', score, selectedQuestions.reduce((sum, q) => sum + q.points, 0));
    }
    
    if (window.gamification) {
      const userId = window.gamification.getCurrentUserId();
      window.gamification.recordQuizCompletion(userId, {
        subject: 'Mixed',
        quizTitle: 'Random Quiz',
        score: percentage,
        maxScore: 100,
        timeSpentSeconds: 0
      });
    }
  }
  
  showQuestion();
}

window.randomQuiz = randomQuiz;

class ThemeColorPicker {
  constructor() {
    this.colors = {
      'Ocean Blue': '#0097b2',
      'Sunset Orange': '#ff6b35',
      'Forest Green': '#10b981',
      'Royal Purple': '#8b5cf6',
      'Rose Pink': '#ec4899',
      'Amber Gold': '#f59e0b',
      'Crimson Red': '#ef4444',
      'Indigo': '#6366f1'
    };

    this.currentColor = localStorage.getItem('theme-color') || '#0097b2';
    this.applyThemeColor(this.currentColor);
  }

  applyThemeColor(color) {
    document.documentElement.style.setProperty('--primary-color', color);
    
    const style = document.createElement('style');
    style.id = 'theme-color-override';
    
    const oldStyle = document.getElementById('theme-color-override');
    if (oldStyle) oldStyle.remove();
    
    style.textContent = `
      :root { --primary-color: ${color}; }
      .header { background: ${color} !important; }
      a { color: ${color} !important; }
      button.nav-btn:hover { background: ${color}15 !important; }
      .quiz-card:hover { border-color: ${color} !important; }
      .progress-bar { background: ${color} !important; }
    `;
    
    document.head.appendChild(style);
    localStorage.setItem('theme-color', color);
    this.currentColor = color;
  }

  showColorPicker() {
    const modal = document.createElement('div');
    modal.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000;" onclick="this.remove()">
        <div style="background: white; padding: 32px; border-radius: 16px; max-width: 500px;" onclick="event.stopPropagation()">
          <h2 style="margin: 0 0 24px 0; color: ${this.currentColor};">🎨 Choose Your Theme Color</h2>
          
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
            ${Object.entries(this.colors).map(([name, color]) => `
              <button onclick="themeColorPicker.applyThemeColor('${color}'); themeColorPicker.showColorPicker();" style="padding: 20px; border: 3px solid ${this.currentColor === color ? color : 'transparent'}; border-radius: 12px; background: ${color}; cursor: pointer; transition: all 0.2s ease; position: relative;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                ${this.currentColor === color ? '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 24px;">✓</div>' : ''}
                <div style="color: white; font-size: 10px; font-weight: 600; margin-top: 8px; text-shadow: 0 1px 2px rgba(0,0,0,0.3);">${name}</div>
              </button>
            `).join('')}
          </div>

          <button onclick="this.closest('div').parentElement.remove()" style="width: 100%; padding: 12px; background: ${this.currentColor}; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Done</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }
}

let streakCounter, confettiManager, badgeSystem, soundManager, keyboardShortcuts, themeColorPicker;

document.addEventListener('DOMContentLoaded', () => {
  streakCounter = new StreakCounter();
  confettiManager = new ConfettiManager();
  badgeSystem = new BadgeSystem();
  soundManager = new SoundManager();
  keyboardShortcuts = new KeyboardShortcuts();
  themeColorPicker = new ThemeColorPicker();

  setTimeout(() => TimeIndicators.addToQuizCards(), 500);

  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
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
    
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }

    .badge-notification {
      animation: slideInRight 0.5s ease;
    }
  `;
  document.head.appendChild(style);

  console.log('✅ Quick Wins initialized successfully!');
});

window.streakCounter = streakCounter;
window.confettiManager = confettiManager;
window.badgeSystem = badgeSystem;
window.soundManager = soundManager;
window.randomQuiz = randomQuiz;
window.themeColorPicker = themeColorPicker;