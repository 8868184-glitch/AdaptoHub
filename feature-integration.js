(function() {
  'use strict';

  const FeatureIntegration = {
    init() {
      // Run setup functions immediately if DOM is already loaded, otherwise wait
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', this.setupAvatarButton.bind(this));
        document.addEventListener('DOMContentLoaded', this.setupLoadingTips.bind(this));
      } else {
        // DOM already loaded (scripts with defer attribute)
        this.setupAvatarButton();
        this.setupLoadingTips();
      }

      window.onQuizComplete = this.onQuizComplete.bind(this);
      window.updateAchievements = this.updateAchievements.bind(this);
      window.trackStats = this.trackStats.bind(this);
    },

    setupAvatarButton() {
      const dropdownBody = document.querySelector('#accountDropdownMenu .account-dropdown-body');
      if (!dropdownBody) {
        console.log('⚠️ No account dropdown body found');
        return;
      }

      if (dropdownBody.querySelector('.avatar-btn')) {
        console.log('✓ Avatar button already exists in dropdown');
        return;
      }

      const avatarBtn = document.createElement('button');
      avatarBtn.className = 'dropdown-item avatar-btn';
      avatarBtn.type = 'button';
      avatarBtn.innerHTML = '✨ Customize Avatar';

      avatarBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.openAvatarModal();
      };

      dropdownBody.appendChild(avatarBtn);
      console.log('Avatar customize button added to account dropdown');
    },

    openAvatarModal() {
      const avatars = [
        '👨‍🎓','👩‍🎓','👨‍🏫','👩‍🔬','👨‍🎨','👷','🕵','👨‍⚕','👨‍✈','👨‍🍳',
        '🐱','🐶','🐼','🦊','🦁','🐯','🐨','🐧','🦉','🦋','🐝','🦄','🐉','🔥',
        '🧙‍♂','🧙‍♀','🧚‍♀','🧛‍♂','🧝‍♂','👼','👻','🤖','👽','😈'
      ];
      const colors = ['#6366f1','#a855f7','#ec4899','#f59e0b','#22c55e','#3b82f6','#ef4444','#14b8a6','#f97316','#8b5cf6','#06b6d4','#84cc16'];
      
      const modal = document.createElement('div');
      modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:10000;display:flex;align-items:center;justify-content:center;';
      
      const content = document.createElement('div');
      content.style.cssText = 'background:white;border-radius:16px;padding:32px;max-width:600px;max-height:80vh;overflow-y:auto;';
      
      const title = document.createElement('h2');
      title.textContent = '✨ Customize Your Avatar';
      title.style.cssText = 'margin:0 0 24px 0;color:#1f2937;';
      
      const avatarGrid = document.createElement('div');
      avatarGrid.style.cssText = 'display:grid;grid-template-columns:repeat(8,1fr);gap:12px;margin-bottom:24px;';
      
      let selectedAvatar = localStorage.getItem('avatar_emoji') || '👨‍🎓';
      let selectedColor = localStorage.getItem('avatar_color') || '#6366f1';
      
      avatars.forEach(emoji => {
        const btn = document.createElement('button');
        btn.textContent = emoji;
        btn.style.cssText = 'font-size:32px;padding:8px;border:3px solid '+(emoji===selectedAvatar?'#6366f1':'transparent')+';border-radius:12px;cursor:pointer;background:white;transition:all 0.2s;';
        btn.onclick = () => {
          selectedAvatar = emoji;
          avatarGrid.querySelectorAll('button').forEach(b => b.style.border = '3px solid transparent');
          btn.style.border = '3px solid #6366f1';
        };
        avatarGrid.appendChild(btn);
      });
      
      const colorLabel = document.createElement('h3');
      colorLabel.textContent = 'Background Color';
      colorLabel.style.cssText = 'margin:0 0 12px 0;color:#1f2937;font-size:16px;';
      
      const colorGrid = document.createElement('div');
      colorGrid.style.cssText = 'display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin-bottom:24px;';
      
      colors.forEach(color => {
        const btn = document.createElement('button');
        btn.style.cssText = 'width:48px;height:48px;border:3px solid '+(color===selectedColor?'#1f2937':'transparent')+';border-radius:12px;cursor:pointer;background:'+color+';transition:all 0.2s;';
        btn.onclick = () => {
          selectedColor = color;
          colorGrid.querySelectorAll('button').forEach(b => b.style.border = '3px solid transparent');
          btn.style.border = '3px solid #1f2937';
        };
        colorGrid.appendChild(btn);
      });
      
      const buttons = document.createElement('div');
      buttons.style.cssText = 'display:flex;gap:12px;justify-content:flex-end;';
      
      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = 'Cancel';
      cancelBtn.style.cssText = 'padding:12px 24px;border:2px solid #e5e7eb;border-radius:8px;background:white;color:#6b7280;font-weight:600;cursor:pointer;';
      cancelBtn.onclick = () => modal.remove();
      
      const saveBtn = document.createElement('button');
      saveBtn.textContent = 'Save Avatar';
      saveBtn.style.cssText = 'padding:12px 24px;border:none;border-radius:8px;background:#6366f1;color:white;font-weight:600;cursor:pointer;';
      saveBtn.onclick = () => {
        localStorage.setItem('avatar_emoji', selectedAvatar);
        localStorage.setItem('avatar_color', selectedColor);
        const avatarCircle = document.getElementById('accountAvatar');
        if (avatarCircle) {
          avatarCircle.textContent = selectedAvatar;
          avatarCircle.style.background = selectedColor;
        }
        modal.remove();
      };
      
      buttons.appendChild(cancelBtn);
      buttons.appendChild(saveBtn);
      
      content.appendChild(title);
      content.appendChild(avatarGrid);
      content.appendChild(colorLabel);
      content.appendChild(colorGrid);
      content.appendChild(buttons);
      modal.appendChild(content);
      document.body.appendChild(modal);
      
      modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    },

    setupLoadingTips() {
      const subject = this.detectSubject();
      if (window.LoadingTips && subject) {
        const tips = {
          'algebra': 'Tip: Practice the quadratic formula regularly to master polynomial equations.',
          'geometry': 'Tip: Understanding angles and congruence is fundamental to geometry success.',
          'physics': 'Tip: Connect physical concepts to real-world applications for better retention.',
          'chemistry': 'Tip: Memorize the periodic table and common reaction types.',
          'biology': 'Tip: Draw diagrams of biological processes to deepen understanding.',
          'history': 'Tip: Create timelines to see historical connections.',
          'buddhism': 'Tip: Reflect on the Four Noble Truths in daily life.',
          'civics': 'Tip: Understand the separation of powers in government.',
          'mathematics': 'Tip: Practice problems daily to build mathematical confidence.',
          'science': 'Tip: Approach science with curiosity and critical thinking.'
        };
        
        const tipText = tips[subject] || 'Tip: Keep practicing to improve your learning journey!';
        console.log('📚 ' + tipText);
      }
    },

    onQuizComplete(unitId, score, subject) {
      // Record learning activity
      if (typeof recordLearningActivity === 'function') {
        recordLearningActivity('quiz', subject || 'Quiz', score, 100);
      }
      this.trackStats(subject, score);
      this.updateAchievements(score, subject);
      this.triggerCelebrations(score);
    },

    trackStats(subject, score) {
      try {
        let stats = JSON.parse(localStorage.getItem('adaptohub_stats')) || {
          totalQuizzes: 0,
          totalScore: 0,
          perfectScores: 0,
          averageScore: 0,
          lastQuiz: null,
          subjectsCompleted: new Set()
        };

        stats.totalQuizzes++;
        stats.totalScore += score;
        stats.averageScore = Math.round(stats.totalScore / stats.totalQuizzes);
        
        if (score === 100) {
          stats.perfectScores++;
        }
        
        stats.lastQuiz = {
          timestamp: Date.now(),
          score,
          subject
        };

        if (subject) {
          if (!stats.subjectsCompleted) stats.subjectsCompleted = [];
          if (!Array.isArray(stats.subjectsCompleted)) {
            stats.subjectsCompleted = Array.from(stats.subjectsCompleted || []);
          }
          if (!stats.subjectsCompleted.includes(subject)) {
            stats.subjectsCompleted.push(subject);
          }
        }

        localStorage.setItem('adaptohub_stats', JSON.stringify(stats));
        return stats;
      } catch (e) {
        console.error('Error tracking stats:', e);
      }
    },

    updateAchievements(score, subject) {
      try {
        const stats = JSON.parse(localStorage.getItem('adaptohub_stats')) || {};
        const unlockedAvatars = JSON.parse(localStorage.getItem('adaptohub_unlocked_avatars')) || [];

        if (stats.totalQuizzes >= 10 && !unlockedAvatars.includes('wizard')) {
          unlockedAvatars.push('wizard');
          this.showAchievementNotification('🧙 Wizard Unlocked', 'Complete 10 quizzes!');
        }

        if (stats.perfectScores >= 1 && !unlockedAvatars.includes('astronaut')) {
          unlockedAvatars.push('astronaut');
          this.showAchievementNotification('🚀 Astronaut Unlocked', 'Perfect score achieved!');
        }

        if (stats.averageScore >= 90 && !unlockedAvatars.includes('robot')) {
          unlockedAvatars.push('robot');
          this.showAchievementNotification('🤖 Robot Unlocked', '90% average reached!');
        }

        if (stats.subjectsCompleted && stats.subjectsCompleted.length >= 5 && !unlockedAvatars.includes('champion')) {
          unlockedAvatars.push('champion');
          this.showAchievementNotification('🏆 Champion Unlocked', '5 subjects completed!');
        }

        localStorage.setItem('adaptohub_unlocked_avatars', JSON.stringify(unlockedAvatars));
      } catch (e) {
        console.error('Error updating achievements:', e);
      }
    },

    triggerCelebrations(score) {
      if (!window.Celebrations) {
        setTimeout(() => this.triggerCelebrations(score), 100);
        return;
      }

      if (score === 100) {
        window.Celebrations.perfectScore();
        window.Celebrations.showBadge(
          'Perfect Score! 🌟',
          '⭐',
          'You achieved a perfect 100%!'
        );
      } else if (score >= 90) {
        window.Celebrations.quizComplete(score);
        window.Celebrations.showBadge(
          'Excellent Work! 🎉',
          '✨',
          'Outstanding performance!'
        );
      } else if (score >= 70) {
        window.Celebrations.quizComplete(score);
        window.Celebrations.showBadge(
          'Great Job! 👏',
          '🎯',
          'Keep up the good work!'
        );
      } else {
        window.Celebrations.showBadge(
          'Keep Improving 💪',
          '📚',
          'Review and try again!'
        );
      }
    },

    showAchievementNotification(title, description) {
      if (window.Celebrations && window.Celebrations.showBadge) {
        window.Celebrations.showBadge(title, '🏅', description);
      }
    },

    detectSubject() {
      const title = document.title.toLowerCase();
      const url = window.location.pathname.toLowerCase();
      
      const subjects = {
        'algebra': ['algebra'],
        'geometry': ['geometry'],
        'physics': ['physics'],
        'chemistry': ['chemistry'],
        'biology': ['biology'],
        'history': ['history'],
        'buddhism': ['buddhism'],
        'civics': ['civics', 'government'],
        'mathematics': ['mathematics', 'pure math'],
        'science': ['science'],
        'calculus': ['calculus'],
        'statistics': ['statistics', 'probability'],
        'number theory': ['number theory']
      };

      for (const [subject, keywords] of Object.entries(subjects)) {
        for (const keyword of keywords) {
          if (title.includes(keyword) || url.includes(keyword)) {
            return subject;
          }
        }
      }

      return null;
    }
  };

  FeatureIntegration.init();

  window.FeatureIntegration = FeatureIntegration;
})();
