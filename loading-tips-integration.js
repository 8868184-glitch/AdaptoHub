/**
 * Loading Tips Integration
 * Automatically shows loading tips when navigating between tabs/sections
 */

(function() {
  'use strict';

  const LoadingTipsIntegration = {
    subjectMap: {
      algebra: 'mathematics',
      geometry: 'mathematics',
      'number-theory': 'mathematics',
      combinatorics: 'mathematics',
      calculus: 'mathematics',
      'calculus-analysis': 'mathematics',
      statistics: 'mathematics',
      'statistics-probability': 'mathematics',
      differential: 'mathematics',
      'differential-equations': 'mathematics',
      discrete: 'mathematics',
      'discrete-mathematics': 'mathematics',
      numerical: 'mathematics',
      'numerical-analysis': 'mathematics',
      logic: 'mathematics',
      'logic-foundations': 'mathematics',
      'mathematical-physics': 'mathematics',
      physics: 'science',
      chemistry: 'science',
      biology: 'science',
      history: 'history',
      buddhism: 'history',
      civics: 'socialstudies',
      'civics-government': 'socialstudies',
      religion: 'socialstudies',
      'religion-morality-ethics': 'socialstudies',
      science: 'science',
      'social-studies': 'socialstudies',
      'social_studies': 'socialstudies',
      mathematics: 'mathematics',
      'pure-mathematics': 'mathematics',
      'pure_mathematics': 'mathematics',
      'applied-mathematics': 'mathematics',
      'applied_mathematics': 'mathematics',
      'feature-demo': 'general',
      index: 'general',
      project: 'general',
      inspiration: 'general',
      submission: 'general',
      feedback: 'general'
    },

    detectSubject() {
      const title = document.title.toLowerCase();
      const url = window.location.pathname.toLowerCase();
      
      for (const [key, subject] of Object.entries(this.subjectMap)) {
        if (title.includes(key) || url.includes(key)) {
          return subject;
        }
      }
      return 'general';
    },

    init() {
      if (!window.LoadingTips) return;

      const subject = this.detectSubject();
      
      // Hook into nav button clicks
      document.addEventListener('click', (e) => {
        const navBtn = e.target.closest('[data-target], .nav-btn, .tab-btn, .section-btn');
        if (navBtn) {
          const target = navBtn.getAttribute('data-target') || navBtn.textContent.trim();
          window.LoadingTips.showForDuration(1500, subject, `Loading ${target}...`);
        }
      });

      // Hook into tab switches
      document.addEventListener('tabchange', (e) => {
        const tabName = e.detail?.tab || 'content';
        window.LoadingTips.showForDuration(1500, subject, `Loading ${tabName}...`);
      });

      // Hook into navigation links
      document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"], a[href*=".html"]');
        if (link && !link.target) {
          const href = link.getAttribute('href');
          const pageName = href.split('/').pop().split('.')[0] || 'page';
          window.LoadingTips.showForDuration(1200, subject, `Opening ${pageName}...`);
        }
      });

      // Monitor for content changes/loads
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            // Check if significant content was added
            const hasSignificantContent = Array.from(mutation.addedNodes).some(node => {
              return node.nodeType === 1 && 
                     (node.classList?.contains('unit-card') || 
                      node.classList?.contains('lesson') ||
                      node.classList?.contains('section'));
            });
            
            if (hasSignificantContent) {
              // Don't spam - only show if no loading tip is currently visible
              if (!document.getElementById('loadingScreen')) {
                window.LoadingTips.showForDuration(800, subject, 'Content loading...');
              }
            }
          }
        });
      });

      // Start observing the main content area
      const mainContent = document.querySelector('main, .layout, .shell, .container');
      if (mainContent) {
        observer.observe(mainContent, {
          childList: true,
          subtree: true,
          attributes: false,
          characterData: false
        });
      }
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      LoadingTipsIntegration.init();
    });
  } else {
    LoadingTipsIntegration.init();
  }

  if (typeof window !== 'undefined') {
    window.LoadingTipsIntegration = LoadingTipsIntegration;
  }
})();
