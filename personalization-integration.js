/**
 * Personalization Integration Module
 * Applies user personalization preferences across the entire AdaptoHub platform
 */

const PersonalizationIntegration = {
  storageKey: 'adaptohub_personalization',

  init() {
    this.loadAndApply();
    this.setupNotificationSystem();
    this.monitorTheme();
    
    // Listen for personalization updates from settings page
    window.addEventListener('personalizationUpdated', (e) => {
      this.loadAndApply();
    });
  },

  loadAndApply() {
    const settings = this.getSettings();
    if (!settings) return;

    this.applyLearningStyle(settings);
    this.applyDifficultyLevel(settings);
    this.applyQuizFormats(settings);
    this.applyStudyPreferences(settings);
    this.applyNotificationSettings(settings);
  },

  getSettings() {
    const saved = localStorage.getItem(this.storageKey);
    return saved ? JSON.parse(saved) : null;
  },

  applyLearningStyle(settings) {
    const style = settings.learningStyle;
    
    // Add custom data attribute to document for CSS targeting
    document.documentElement.setAttribute('data-learning-style', style);
    
    // Apply content preferences
    const contentElements = document.querySelectorAll('[data-content-type]');
    contentElements.forEach(el => {
      if (el.dataset.contentType === style) {
        el.style.display = '';
        el.classList.add('learning-style-active');
      } else if (el.dataset.contentType === 'text' && style !== 'visual') {
        el.style.opacity = '0.7';
      } else if (el.dataset.contentType === 'video' && style === 'auditory') {
        el.classList.add('enhanced-audio');
      }
    });

    // Dispatch event for other systems to listen to
    window.dispatchEvent(new CustomEvent('learningStyleApplied', { detail: { style } }));
  },

  applyDifficultyLevel(settings) {
    const difficulty = settings.difficulty;
    document.documentElement.setAttribute('data-difficulty', difficulty);

    // Adjust quiz and content difficulty
    const quizElements = document.querySelectorAll('[data-difficulty]');
    quizElements.forEach(el => {
      const elDifficulty = parseInt(el.dataset.difficulty);
      if (elDifficulty <= difficulty) {
        el.style.display = '';
      } else {
        el.style.display = 'none';
      }
    });

    window.dispatchEvent(new CustomEvent('difficultyLevelApplied', { detail: { difficulty } }));
  },

  applyQuizFormats(settings) {
    const formats = settings.quizFormats;
    document.documentElement.setAttribute('data-quiz-formats', formats.join(','));

    // Show/hide quiz formats based on preference
    const quizElements = document.querySelectorAll('[data-quiz-format]');
    quizElements.forEach(el => {
      if (formats.includes(el.dataset.quizFormat)) {
        el.style.display = '';
      } else {
        el.style.display = 'none';
      }
    });

    window.dispatchEvent(new CustomEvent('quizFormatsApplied', { detail: { formats } }));
  },

  applyStudyPreferences(settings) {
    const goal = settings.studyGoal;
    const studyTime = settings.studyTime;
    const studyModes = settings.studyModes;

    document.documentElement.setAttribute('data-study-goal', goal);
    document.documentElement.setAttribute('data-study-time', studyTime);
    document.documentElement.setAttribute('data-study-modes', studyModes.join(','));

    // Apply spaced repetition intervals if enabled
    if (studyModes.includes('spaced-repetition')) {
      this.initializeSpacedRepetition();
    }

    window.dispatchEvent(new CustomEvent('studyPreferencesApplied', { detail: { goal, studyTime, studyModes } }));
  },

  applyNotificationSettings(settings) {
    document.documentElement.setAttribute('data-optimal-time', settings.optimalTime);
    document.documentElement.setAttribute('data-reminder-freq', settings.reminderFreq);
    
    // Store notification settings for the notification service
    localStorage.setItem('notification_preferences', JSON.stringify(settings.notifications));
    localStorage.setItem('dnd_from', settings.dndFrom);
    localStorage.setItem('dnd_to', settings.dndTo);

    window.dispatchEvent(new CustomEvent('notificationSettingsApplied', { detail: settings }));
  },

  setupNotificationSystem() {
    // Initialize notification service
    if (typeof NotificationService !== 'undefined') {
      NotificationService.init();
    }
  },

  monitorTheme() {
    // Track theme changes for notification timing
    const observer = new MutationObserver(() => {
      const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
      localStorage.setItem('current_theme', isDarkMode ? 'dark' : 'light');
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  },

  initializeSpacedRepetition() {
    // Create spaced repetition scheduling
    const reviewItems = document.querySelectorAll('[data-review-count]');
    reviewItems.forEach(item => {
      const reviewCount = parseInt(item.dataset.reviewCount) || 0;
      const intervals = [1, 3, 7, 14, 30]; // days
      const nextReviewDay = intervals[Math.min(reviewCount, intervals.length - 1)];
      
      const lastReviewDate = localStorage.getItem(`reviewed_${item.id}`);
      if (lastReviewDate) {
        const daysSinceReview = Math.floor((Date.now() - new Date(lastReviewDate).getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceReview >= nextReviewDay) {
          item.classList.add('spaced-rep-due');
          item.setAttribute('data-spaced-rep-status', 'due');
        }
      }
    });
  },

  // Get smart reminder time based on optimal learning time
  getOptimalReminderTime() {
    const settings = this.getSettings();
    if (!settings) return null;

    const timeRanges = {
      morning: { start: 6, end: 12 },
      afternoon: { start: 12, end: 18 },
      evening: { start: 18, end: 22 }
    };

    const range = timeRanges[settings.optimalTime];
    const randomHour = Math.floor(Math.random() * (range.end - range.start)) + range.start;
    const randomMinute = Math.floor(Math.random() * 60);

    return { hour: randomHour, minute: randomMinute };
  },

  // Check if current time is within Do Not Disturb window
  isInDND() {
    const settings = this.getSettings();
    if (!settings) return false;

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const fromTime = settings.dndFrom;
    const toTime = settings.dndTo;

    // Handle DND that crosses midnight
    if (fromTime > toTime) {
      return currentTime >= fromTime || currentTime < toTime;
    } else {
      return currentTime >= fromTime && currentTime < toTime;
    }
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => PersonalizationIntegration.init());
} else {
  PersonalizationIntegration.init();
}
