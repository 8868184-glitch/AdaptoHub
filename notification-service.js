const NotificationService = {
  initialized: false,
  storageKey: 'adaptohub_notifications',
  streakStorageKey: 'adaptohub_study_streak',

  init() {
    if (this.initialized) return;
    
    this.loadPreferences();
    this.initializeStreak();
    this.scheduleDailyNotifications();
    this.setupNotificationBadge();
    
    this.initialized = true;
  },

  loadPreferences() {
    const prefs = localStorage.getItem('notification_preferences');
    this.preferences = prefs ? JSON.parse(prefs) : {
      reminders: true,
      motivational: true,
      streak: true,
      feedback: false,
      goals: false
    };

    this.dndFrom = localStorage.getItem('dnd_from') || '22:00';
    this.dndTo = localStorage.getItem('dnd_to') || '08:00';
    this.reminderFreq = parseInt(localStorage.getItem('reminder_freq') || '3');
  },

  initializeStreak() {
    const today = this.getTodayKey();
    const lastVisit = localStorage.getItem(`${this.streakStorageKey}_last_visit`);
    const streakData = localStorage.getItem(this.streakStorageKey);
    const streak = streakData ? JSON.parse(streakData) : { count: 0, bestCount: 0 };

    if (lastVisit !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      
      if (lastVisit === yesterday || streak.count === 0) {
        streak.count++;
      } else if (lastVisit !== today) {
        streak.count = 1;
      }

      if (streak.count > streak.bestCount) {
        streak.bestCount = streak.count;
      }

      localStorage.setItem(this.streakStorageKey, JSON.stringify(streak));
      localStorage.setItem(`${this.streakStorageKey}_last_visit`, today);
    }
  },

  scheduleDailyNotifications() {
    if (this.notificationSchedule) {
      clearInterval(this.notificationSchedule);
    }

    this.notificationSchedule = setInterval(() => {
      this.checkAndSendNotifications();
    }, 60000); 
  },

  checkAndSendNotifications() {
    if (this.isInDND()) return;

    const streak = JSON.parse(localStorage.getItem(this.streakStorageKey) || '{"count":0,"bestCount":0}');
    const hasStudiedToday = localStorage.getItem(`studied_${this.getTodayKey()}`);

    if (this.preferences.streak && streak.count > 0 && !this.notificationShownToday('streak')) {
      if (streak.count % 5 === 0 || streak.count % 10 === 0) {
        this.showNotification({
          type: 'streak',
          title: '🔥 Amazing Streak!',
          message: `You're on a ${streak.count}-day learning streak! Keep it up!`,
          icon: '🔥'
        });
      }
    }

    if (this.preferences.reminders && !hasStudiedToday && !this.notificationShownToday('reminder')) {
      const timeSlot = this.getCurrentTimeSlot();
      this.showNotification({
        type: 'reminder',
        title: '⏰ Study Time Reminder',
        message: `It's a great time to continue your learning journey! Open a course now.`,
        icon: '⏰'
      });
    }

    if (this.preferences.motivational && !this.notificationShownToday('motivational')) {
      const message = this.getRandomMotivationalMessage();
      this.showNotification({
        type: 'motivational',
        title: '💪 Motivation',
        message: message,
        icon: '💪'
      });
    }

    if (this.preferences.feedback && !this.notificationShownToday('feedback')) {
      const feedback = this.generateProgressFeedback();
      if (feedback) {
        this.showNotification({
          type: 'feedback',
          title: '📊 Your Progress',
          message: feedback,
          icon: '📊'
        });
      }
    }

    if (this.preferences.goals && !this.notificationShownToday('goals')) {
      this.showNotification({
        type: 'goals',
        title: '🎯 Goal Update',
        message: 'Check your progress towards your learning goals!',
        icon: '🎯'
      });
    }
  },

  showNotification(options) {
    const { type, title, message, icon } = options;

    const notification = document.createElement('div');
    notification.className = 'notification-popup';
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: white;
      border-radius: 12px;
      padding: 16px 20px;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
      max-width: 320px;
      z-index: 10000;
      animation: slideInUp 0.3s ease;
      font-family: "Bai Jamjuree", sans-serif;
    `;

    const titleEl = document.createElement('div');
    titleEl.style.cssText = `
      font-weight: 600;
      color: #1f2933;
      margin-bottom: 6px;
      font-size: 0.95rem;
    `;
    titleEl.textContent = title;

    const messageEl = document.createElement('div');
    messageEl.style.cssText = `
      color: #636d79;
      font-size: 0.85rem;
      line-height: 1.5;
      margin-bottom: 12px;
    `;
    messageEl.textContent = message;

    const closeBtn = document.createElement('button');
    closeBtn.style.cssText = `
      background: #f5f6f8;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      padding: 6px 12px;
      cursor: pointer;
      font-weight: 500;
      font-size: 0.85rem;
      color: #636d79;
      width: 100%;
      transition: all 0.2s ease;
    `;
    closeBtn.textContent = 'Dismiss';
    closeBtn.addEventListener('click', () => {
      notification.remove();
    });
    closeBtn.addEventListener('mouseover', () => {
      closeBtn.style.background = '#e8ecf1';
    });
    closeBtn.addEventListener('mouseout', () => {
      closeBtn.style.background = '#f5f6f8';
    });

    notification.appendChild(titleEl);
    notification.appendChild(messageEl);
    notification.appendChild(closeBtn);
    document.body.appendChild(notification);

    this.recordNotificationShown(type);

    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 8000);

    const style = document.createElement('style');
    if (!document.getElementById('notification-animations')) {
      style.id = 'notification-animations';
      style.textContent = `
        @keyframes slideInUp {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(style);
    }
  },

  recordNotificationShown(type) {
    const today = this.getTodayKey();
    const key = `notification_${type}_${today}`;
    localStorage.setItem(key, 'true');
  },

  notificationShownToday(type) {
    const today = this.getTodayKey();
    const key = `notification_${type}_${today}`;
    return localStorage.getItem(key) === 'true';
  },

  getTodayKey() {
    return new Date().toISOString().split('T')[0];
  },

  isInDND() {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const fromTime = this.dndFrom;
    const toTime = this.dndTo;

    if (fromTime > toTime) {
      return currentTime >= fromTime || currentTime < toTime;
    } else {
      return currentTime >= fromTime && currentTime < toTime;
    }
  },

  getCurrentTimeSlot() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'night';
  },

  getRandomMotivationalMessage() {
    const messages = [
      "Every expert was once a beginner. Keep going!",
      "Your future self will thank you for studying today!",
      "Learning is the most powerful tool for growth.",
      "You're stronger than your struggles!",
      "Success is the sum of small efforts done repeatedly.",
      "Don't watch the clock; do what it does. Keep going!",
      "The only limit is the one you set in your mind.",
      "Believe in yourself and you're halfway there!",
      "Progress over perfection, always!",
      "You are capable of amazing things!",
      "One step at a time, you'll reach your goal.",
      "Make yourself proud today!"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  },

  generateProgressFeedback() {
    const feedback = localStorage.getItem('recent_progress_data');
    if (feedback) {
      const data = JSON.parse(feedback);
      return `Great work! You've completed ${data.topicsCompleted || 0} topics this week.`;
    }
    return null;
  },

  markStudySession() {
    const today = this.getTodayKey();
    localStorage.setItem(`studied_${today}`, 'true');
    this.initializeStreak();
  },

  getStreak() {
    const streakData = localStorage.getItem(this.streakStorageKey);
    return streakData ? JSON.parse(streakData) : { count: 0, bestCount: 0 };
  },

  setupNotificationBadge() {
    const header = document.querySelector('.top-banner');
    if (header && !document.getElementById('notification-badge')) {
      const badge = document.createElement('div');
      badge.id = 'notification-badge';
      badge.style.cssText = `
        position: relative;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        margin-right: 15px;
        font-size: 1.3rem;
        border-radius: 50%;
        transition: all 0.3s ease;
      `;
      badge.innerHTML = '🔔';
      badge.addEventListener('click', () => this.showNotificationCenter());
      badge.addEventListener('mouseover', () => {
        badge.style.background = '#f0f9fc';
        badge.style.transform = 'scale(1.1)';
      });
      badge.addEventListener('mouseout', () => {
        badge.style.background = 'transparent';
        badge.style.transform = 'scale(1)';
      });

      const headerControls = header.querySelector('.header-controls');
      const accountDisplay = header.querySelector('.account-display');
      
      if (headerControls) {
        headerControls.insertBefore(badge, headerControls.firstChild);
      } else if (accountDisplay) {
        // Insert before account display if no header-controls
        header.insertBefore(badge, accountDisplay);
      } else {
        // Just append to header
        header.appendChild(badge);
      }
    }
  },

  showNotificationCenter() {
    // Simple notification center alert
    alert('🔔 Notification Center\n\nYou will receive notifications during your optimal learning times.\n\nCurrent settings:\n• DND Hours: ' + this.dndFrom + ' - ' + this.dndTo);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => NotificationService.init());
} else {
  NotificationService.init();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = NotificationService;
}