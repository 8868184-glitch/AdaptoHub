/**
 * Smooth Animations Integration
 * Applies consistent animations across all pages
 * - Page fade-in transitions
 * - Button hover and press effects
 * - Card entrance animations
 * - Smooth quiz question transitions
 * - Progress bar animations
 * - Number counting animations
 */

(function() {
  'use strict';

  const SmoothAnimations = {
    init() {
      this.addGlobalStyles();
      this.setupPageTransitions();
      this.setupButtonAnimations();
      this.setupCardAnimations();
      this.setupProgressAnimations();
      this.setupNumberCounters();
      this.setupContentObserver();
    },

    addGlobalStyles() {
      const style = document.createElement('style');
      style.textContent = `
        /* ===== PAGE TRANSITIONS ===== */
        body {
          animation: pageEnter 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes pageEnter {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Fade in for major sections */
        main, .layout, .shell, .demo-shell {
          animation: fadeInSection 0.7s ease-out 0.1s backwards;
        }

        @keyframes fadeInSection {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Hero sections */
        .hero, .hero-card, .demo-hero, .top-banner {
          animation: heroSlideIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes heroSlideIn {
          from {
            opacity: 0;
            transform: translateY(-40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ===== BUTTON ANIMATIONS ===== */
        button, .btn, .primary-btn, .secondary-btn, .demo-btn,
        input[type="button"], input[type="submit"],
        a.button, [role="button"] {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        button:hover, .btn:hover, .primary-btn:hover, .secondary-btn:hover,
        .demo-btn:hover, input[type="button"]:hover, input[type="submit"]:hover,
        a.button:hover, [role="button"]:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        }

        button:active, .btn:active, .primary-btn:active, .secondary-btn:active,
        .demo-btn:active, input[type="button"]:active, input[type="submit"]:active,
        a.button:active, [role="button"]:active {
          transform: translateY(0);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        /* Ripple effect on button press */
        button::before, .btn::before, .primary-btn::before, .secondary-btn::before,
        .demo-btn::before, input[type="button"]::before, input[type="submit"]::before,
        a.button::before, [role="button"]::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          transform: translate(-50%, -50%);
          transition: width 0.6s ease-out, height 0.6s ease-out;
          pointer-events: none;
        }

        button:active::before, .btn:active::before, .primary-btn:active::before,
        .secondary-btn:active::before, .demo-btn:active::before,
        input[type="button"]:active::before, input[type="submit"]:active::before,
        a.button:active::before, [role="button"]:active::before {
          width: 300px;
          height: 300px;
        }

        /* ===== CARD ANIMATIONS ===== */
        .card, .unit-card, .lesson-card, .demo-section,
        .stat-card, .feature-card, [class*="card"] {
          animation: cardSlideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
        }

        .card:nth-child(1) { animation-delay: 0.1s; }
        .card:nth-child(2) { animation-delay: 0.2s; }
        .card:nth-child(3) { animation-delay: 0.3s; }
        .card:nth-child(4) { animation-delay: 0.4s; }
        .card:nth-child(5) { animation-delay: 0.5s; }
        .card:nth-child(n+6) { animation-delay: 0.6s; }

        .unit-card:nth-child(1) { animation-delay: 0.1s; }
        .unit-card:nth-child(2) { animation-delay: 0.2s; }
        .unit-card:nth-child(3) { animation-delay: 0.3s; }
        .unit-card:nth-child(4) { animation-delay: 0.4s; }
        .unit-card:nth-child(5) { animation-delay: 0.5s; }
        .unit-card:nth-child(n+6) { animation-delay: 0.6s; }

        @keyframes cardSlideIn {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Card hover effect */
        .card:hover, .unit-card:hover, .lesson-card:hover,
        .demo-section:hover, .stat-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.12);
        }

        /* ===== QUIZ ANIMATIONS ===== */
        .quiz-container, .quiz-block, [class*="quiz"] {
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .quiz-question {
          animation: questionSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes questionSlideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .quiz-option, .quiz-options label, .answer-option {
          animation: optionFadeIn 0.3s ease backwards;
        }

        .quiz-option:nth-child(1) { animation-delay: 0.1s; }
        .quiz-option:nth-child(2) { animation-delay: 0.2s; }
        .quiz-option:nth-child(3) { animation-delay: 0.3s; }
        .quiz-option:nth-child(4) { animation-delay: 0.4s; }
        .quiz-option:nth-child(n+5) { animation-delay: 0.5s; }

        .quiz-options label:nth-child(1) { animation-delay: 0.1s; }
        .quiz-options label:nth-child(2) { animation-delay: 0.2s; }
        .quiz-options label:nth-child(3) { animation-delay: 0.3s; }
        .quiz-options label:nth-child(4) { animation-delay: 0.4s; }
        .quiz-options label:nth-child(n+5) { animation-delay: 0.5s; }

        .answer-option:nth-child(1) { animation-delay: 0.1s; }
        .answer-option:nth-child(2) { animation-delay: 0.2s; }
        .answer-option:nth-child(3) { animation-delay: 0.3s; }
        .answer-option:nth-child(4) { animation-delay: 0.4s; }
        .answer-option:nth-child(n+5) { animation-delay: 0.5s; }

        @keyframes optionFadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .quiz-option:hover, .quiz-options label:hover, .answer-option:hover {
          transform: translateX(4px) translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        /* Result animations */
        .result-card, [class*="result"], .quiz-result {
          animation: resultBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes resultBounce {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(30px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .result-pass {
          animation: resultBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), 
                     successGlow 1.5s ease-in-out 0.6s;
        }

        @keyframes successGlow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
          }
          50% {
            box-shadow: 0 0 0 15px rgba(16, 185, 129, 0);
          }
        }

        /* ===== PROGRESS BAR ANIMATIONS ===== */
        .progress-bar, .progress-fill, [class*="progress"],
        .loading-bar, .loading-progress {
          transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .progress-fill {
          animation: progressFlow 1.5s ease-in-out infinite;
        }

        @keyframes progressFlow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        /* ===== NUMBER COUNTERS ===== */
        .number, .count, .score, [class*="counter"],
        .stat-value, [class*="value"] {
          font-variant-numeric: tabular-nums;
        }

        .number-animate, .count-animate, .counter,
        .stat-value[data-target] {
          animation: numberPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes numberPop {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        /* Score display animation */
        .score-display, [class*="score-"] {
          animation: scoreSlideIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes scoreSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ===== INPUT ANIMATIONS ===== */
        input:not([type="radio"]):not([type="checkbox"]),
        textarea, select {
          transition: all 0.2s ease;
          border-color: rgba(0, 0, 0, 0.1);
        }

        input:focus:not([type="radio"]):not([type="checkbox"]),
        textarea:focus, select:focus {
          transform: scale(1.02);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
          border-color: rgba(99, 102, 241, 0.5);
        }

        /* ===== LIST ANIMATIONS ===== */
        li, [role="listitem"], .list-item {
          animation: listItemFade 0.3s ease backwards;
        }

        li:nth-child(1) { animation-delay: 0.05s; }
        li:nth-child(2) { animation-delay: 0.1s; }
        li:nth-child(3) { animation-delay: 0.15s; }
        li:nth-child(4) { animation-delay: 0.2s; }
        li:nth-child(5) { animation-delay: 0.25s; }
        li:nth-child(n+6) { animation-delay: 0.3s; }

        @keyframes listItemFade {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* ===== TAB TRANSITIONS ===== */
        [role="tabpanel"], .tab-content, [class*="tab"] {
          animation: tabSlideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes tabSlideIn {
          from {
            opacity: 0;
            transform: translateX(10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* ===== NAVIGATION ANIMATIONS ===== */
        nav, .navbar, .nav-menu {
          animation: navSlideDown 0.5s ease-out;
        }

        @keyframes navSlideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        nav a, .nav-item, .nav-btn {
          transition: all 0.2s ease;
        }

        nav a:hover, .nav-item:hover, .nav-btn:hover {
          transform: translateY(-2px);
          color: #6366f1;
        }

        nav a.active, .nav-item.active, .nav-btn.active {
          border-bottom: 3px solid #6366f1;
          animation: activeNavPulse 0.5s ease-out;
        }

        @keyframes activeNavPulse {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        /* ===== FOOTER ANIMATIONS ===== */
        footer, .footer {
          animation: footerSlideUp 0.6s ease-out 0.2s backwards;
        }

        @keyframes footerSlideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ===== SMOOTH SCROLL ===== */
        html {
          scroll-behavior: smooth;
        }

        /* ===== REDUCED MOTION SUPPORT ===== */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }

        /* ===== VISIBILITY TRANSITIONS ===== */
        .hidden {
          animation: fadeOut 0.3s ease forwards;
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-10px);
          }
        }

        .show {
          animation: fadeIn 0.3s ease forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `;
      document.head.appendChild(style);
    },

    setupPageTransitions() {
      // Add fade-in class to main content on page load
      document.addEventListener('DOMContentLoaded', () => {
        const main = document.querySelector('main, .layout, .shell');
        if (main) {
          main.classList.add('fade-in');
        }
      });

      // Animate page when it becomes visible
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
              entry.target.setAttribute('data-animated', 'true');
              if (entry.target.classList) {
                entry.target.classList.add('fade-in');
              }
            }
          });
        });

        document.querySelectorAll('section, article').forEach(el => {
          observer.observe(el);
        });
      }
    },

    setupButtonAnimations() {
      // Buttons already have animations from CSS
      // Add click feedback for custom buttons
      document.addEventListener('click', (e) => {
        const btn = e.target.closest('button, .btn, [role="button"]');
        if (btn) {
          const ripple = document.createElement('span');
          ripple.className = 'ripple';
          ripple.style.cssText = `
            position: absolute;
            pointer-events: none;
          `;
          btn.appendChild(ripple);
          setTimeout(() => ripple.remove(), 600);
        }
      });
    },

    setupCardAnimations() {
      // Cards already have staggered animations from CSS
      // This adds enhanced interaction on hover
      const cards = document.querySelectorAll('.card, .unit-card, .demo-section');
      cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
      });
    },

    setupProgressAnimations() {
      // Animate progress bars when they appear
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const bar = entry.target;
              if (bar.style.width) {
                const targetWidth = bar.style.width;
                bar.style.width = '0%';
                requestAnimationFrame(() => {
                  bar.style.width = targetWidth;
                });
              }
              observer.unobserve(bar);
            }
          });
        });

        document.querySelectorAll('.progress-fill, .loading-bar').forEach(bar => {
          observer.observe(bar);
        });
      }
    },

    setupNumberCounters() {
      // Animate counting numbers
      const counters = document.querySelectorAll('[data-target], .counter, .stat-value');
      
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target') || counter.textContent) || 0;
        const text = counter.getAttribute('data-text') || '';
        
        if (target > 0) {
          counter.classList.add('number-animate');
          
          // Count animation
          let current = 0;
          const increment = Math.ceil(target / 30);
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            counter.textContent = current + (text ? ' ' + text : '');
          }, 30);
        }
      });
    },

    setupContentObserver() {
      // Observe for dynamically added content and animate it
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === 1) { // Element node
                // Animate new cards
                if (node.classList?.contains('card') || 
                    node.classList?.contains('unit-card') ||
                    node.classList?.contains('quiz-question')) {
                  node.style.animation = 'cardSlideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
                }
                
                // Animate new options
                if (node.classList?.contains('quiz-option') ||
                    node.classList?.contains('quiz-options')) {
                  node.style.animation = 'optionFadeIn 0.3s ease';
                }
              }
            });
          }
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  };

  // Initialize when ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      SmoothAnimations.init();
    });
  } else {
    SmoothAnimations.init();
  }

  if (typeof window !== 'undefined') {
    window.SmoothAnimations = SmoothAnimations;
  }
})();
