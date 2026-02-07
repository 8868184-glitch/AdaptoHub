const MobileGestures = {
  touchStartX: 0,
  touchStartY: 0,
  touchEndX: 0,
  touchEndY: 0,
  minSwipeDistance: 50,

  lastX: 0,
  lastY: 0,
  lastZ: 0,
  lastTime: 0,
  shakeThreshold: 15,
  shakeTimeThreshold: 500,
  shakeTriggerCount: 0,

  init() {
    this.setupTouchListeners();
    this.setupAccelerometerListener();
    this.setupQuizGestures();
    this.setupHintGestures();
    this.addGestureIndicators();
  },

  setupTouchListeners() {
    document.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;
    });

    document.addEventListener('touchend', (e) => {
      const touch = e.changedTouches[0];
      this.touchEndX = touch.clientX;
      this.touchEndY = touch.clientY;
      this.handleSwipe();
    });
  },

  handleSwipe() {
    const deltaX = this.touchEndX - this.touchStartX;
    const deltaY = this.touchEndY - this.touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > this.minSwipeDistance) {
      if (deltaX > 0) {
        this.onSwipeRight();
      } else {
        this.onSwipeLeft();
      }
    }
  },

  onSwipeRight() {
    const quizContainer = document.querySelector('[data-quiz-id]');
    if (!quizContainer) return;

    const prevButton = document.querySelector('[data-action="previous-question"]');
    if (prevButton) {
      prevButton.click();
      this.showGestureHint('← Previous Question');
    }
  },

  onSwipeLeft() {
    const quizContainer = document.querySelector('[data-quiz-id]');
    if (!quizContainer) return;

    const nextButton = document.querySelector('[data-action="next-question"]');
    if (nextButton) {
      nextButton.click();
      this.showGestureHint('Next Question →');
    }
  },

  setupAccelerometerListener() {
    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', (event) => {
        this.detectShake(event);
      });
    }
  },

  detectShake(event) {
    const { x, y, z } = event.accelerationIncludingGravity;
    const now = Date.now();

    const deltaX = Math.abs(x - this.lastX);
    const deltaY = Math.abs(y - this.lastY);
    const deltaZ = Math.abs(z - this.lastZ);

    const timeElapsed = now - this.lastTime;

    if (
      (deltaX > this.shakeThreshold ||
       deltaY > this.shakeThreshold ||
       deltaZ > this.shakeThreshold) &&
      timeElapsed < this.shakeTimeThreshold
    ) {
      this.shakeTriggerCount++;

      if (this.shakeTriggerCount > 3) {
        this.onShake();
        this.shakeTriggerCount = 0;
      }
    } else {
      this.shakeTriggerCount = 0;
    }

    this.lastX = x;
    this.lastY = y;
    this.lastZ = z;
    this.lastTime = now;
  },

  onShake() {
    const hintButton = document.querySelector('[data-action="get-hint"]');
    const quizContainer = document.querySelector('[data-quiz-id]');

    if (hintButton && quizContainer) {
      hintButton.click();
      this.showGestureHint('💡 Hint Unlocked!', 2000);
      this.triggerVibration([50, 100, 50]);
    }
  },

  setupQuizGestures() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-answer-id]')) {
        const answer = e.target.closest('[data-answer-id]');
        answer.style.transform = 'scale(0.98)';
        setTimeout(() => {
          answer.style.transform = 'scale(1)';
        }, 100);
        this.triggerVibration([20]);
      }
    });
  },

  setupHintGestures() {
    const quizContainer = document.querySelector('[data-quiz-id]');
    if (!quizContainer) return;

    const hintButton = document.querySelector('[data-action="get-hint"]');
    if (hintButton) {
      hintButton.title = 'Shake your device for a hint!';
      hintButton.style.position = 'relative';
    }
  },

  showGestureHint(text, duration = 1500) {
    const hint = document.createElement('div');
    hint.style.cssText = `
      position: fixed;
      top: 100px;
      left: 50%;
      transform: translateX(-50%);
      background: #0097b2;
      color: white;
      padding: 12px 24px;
      border-radius: 20px;
      font-weight: 600;
      z-index: 9999;
      pointer-events: none;
      animation: slideDown 0.3s ease;
      font-family: "Bai Jamjuree", sans-serif;
    `;
    hint.textContent = text;

    const style = document.createElement('style');
    if (!document.getElementById('gesture-animations')) {
      style.id = 'gesture-animations';
      style.textContent = `
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
          to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(hint);

    setTimeout(() => {
      hint.style.animation = 'slideUp 0.3s ease';
      setTimeout(() => {
        hint.remove();
      }, 300);
    }, duration);
  },

  triggerVibration(pattern) {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  },

  addGestureIndicators() {
    const quizContainer = document.querySelector('[data-quiz-id]');
    if (!quizContainer) return;

    const style = document.createElement('style');
    style.textContent = `
      [data-answer-id] {
        transition: transform 0.1s ease;
      }

      [data-answer-id]:active {
        transform: scale(0.98);
      }

      .quiz-button:active {
        transform: translateY(2px);
      }

      /* Show swipe hint on mobile */
      @media (max-width: 768px) {
        .quiz-container::before {
          content: "👉 Swipe to navigate • 🎯 Shake for hints";
          display: block;
          text-align: center;
          color: #999;
          font-size: 0.85rem;
          padding: 8px;
          margin-bottom: 16px;
          background: #f5f6f8;
          border-radius: 8px;
        }
      }
    `;
    document.head.appendChild(style);
  },

  supportsAccelerometer() {
    return window.DeviceMotionEvent !== undefined;
  },

  supportsVibration() {
    return navigator.vibrate !== undefined;
  },

  getOrientation() {
    if (window.innerHeight > window.innerWidth) {
      return 'portrait';
    } else {
      return 'landscape';
    }
  },

  setupOrientationHandler() {
    window.addEventListener('orientationchange', () => {
      const orientation = this.getOrientation();
      document.documentElement.setAttribute('data-orientation', orientation);
      
      const quizContainer = document.querySelector('[data-quiz-id]');
      if (quizContainer) {
        if (orientation === 'landscape') {
          quizContainer.style.maxHeight = '100vh';
          quizContainer.style.overflow = 'auto';
        } else {
          quizContainer.style.maxHeight = 'auto';
        }
      }
    });

    const orientation = this.getOrientation();
    document.documentElement.setAttribute('data-orientation', orientation);
  },

  enableOfflineQuiz() {
    const quizData = document.querySelector('[data-quiz-id]');
    if (quizData) {
      const quizId = quizData.getAttribute('data-quiz-id');
      const quizContent = quizData.innerHTML;
      
      localStorage.setItem(`offline-quiz-${quizId}`, quizContent);
      localStorage.setItem(`offline-quiz-${quizId}-timestamp`, Date.now());
    }
  },

  loadOfflineQuiz(quizId) {
    const cachedQuiz = localStorage.getItem(`offline-quiz-${quizId}`);
    if (cachedQuiz) {
      const container = document.querySelector('[data-quiz-id]');
      if (container) {
        container.innerHTML = cachedQuiz;
        return true;
      }
    }
    return false;
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth <= 768) {
      MobileGestures.init();
      MobileGestures.setupOrientationHandler();
    }
  });
} else {
  if (window.innerWidth <= 768) {
    MobileGestures.init();
    MobileGestures.setupOrientationHandler();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = MobileGestures;
}