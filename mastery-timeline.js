(function() {
  'use strict';

  const MasteryTimeline = {
    subjects: [
      { id: 'mathematics', name: 'คณิตศาสตร์', icon: '📐', color: '#6366f1' },
      { id: 'physics', name: 'ฟิสิกส์', icon: '⚛️', color: '#3b82f6' },
      { id: 'chemistry', name: 'เคมี', icon: '🧪', color: '#8b5cf6' },
      { id: 'biology', name: 'ชีววิทยา', icon: '🧬', color: '#22c55e' },
      { id: 'history', name: 'ประวัติศาสตร์', icon: '📜', color: '#f59e0b' },
      { id: 'applied_math', name: 'คณิตประยุกต์', icon: '📊', color: '#ec4899' },
      { id: 'pure_math', name: 'คณิตบริสุทธิ์', icon: '∞', color: '#a855f7' }
    ],

    init() {
      this.loadProgress();
      this.createTimelineButton();
    },

    loadProgress() {
      const saved = localStorage.getItem('mastery_progress');
      this.progress = saved ? JSON.parse(saved) : {};
      
      // Initialize progress for each subject if not exists
      this.subjects.forEach(subject => {
        if (!this.progress[subject.id]) {
          this.progress[subject.id] = {
            level: 0,
            xp: 0,
            completed: [],
            inProgress: [],
            lastActivity: null
          };
        }
      });
    },

    saveProgress() {
      localStorage.setItem('mastery_progress', JSON.stringify(this.progress));
    },

    createTimelineButton() {
      const accountDisplay = document.querySelector('.account-display');
      if (!accountDisplay) return;

      const timelineBtn = document.createElement('button');
      timelineBtn.className = 'timeline-btn';
      timelineBtn.innerHTML = '🎯 Mastery Timeline';
      timelineBtn.style.cssText = `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 8px 14px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        font-size: 0.9rem;
        margin-left: 12px;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      `;

      timelineBtn.onmouseover = () => {
        timelineBtn.style.transform = 'translateY(-2px)';
        timelineBtn.style.boxShadow = '0 8px 16px rgba(102, 126, 234, 0.3)';
      };
      timelineBtn.onmouseout = () => {
        timelineBtn.style.transform = 'none';
        timelineBtn.style.boxShadow = 'none';
      };

      timelineBtn.onclick = () => this.openTimeline();

      accountDisplay.appendChild(timelineBtn);
    },

    openTimeline() {
      const modal = document.createElement('div');
      modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn 0.3s ease;';

      const content = document.createElement('div');
      content.style.cssText = 'background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);border-radius:24px;padding:40px;max-width:1000px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 25px 50px rgba(0,0,0,0.5);';

      const header = document.createElement('div');
      header.style.cssText = 'margin-bottom:32px;';

      const title = document.createElement('h2');
      title.innerHTML = '🎯 ไทม์ไลน์การพัฒนาทักษะของคุณ';
      title.style.cssText = 'margin:0 0 8px 0;color:white;font-size:28px;font-weight:700;';

      const subtitle = document.createElement('p');
      subtitle.textContent = 'ติดตามความก้าวหน้าในการเรียนรู้ของคุณในแต่ละวิชา';
      subtitle.style.cssText = 'margin:0;color:rgba(255,255,255,0.9);font-size:16px;';

      header.appendChild(title);
      header.appendChild(subtitle);

      const timeline = document.createElement('div');
      timeline.style.cssText = 'position:relative;';

      // Create timeline line
      const line = document.createElement('div');
      line.style.cssText = 'position:absolute;left:24px;top:0;bottom:0;width:4px;background:rgba(255,255,255,0.2);border-radius:2px;';
      timeline.appendChild(line);

      // Add subject items
      this.subjects.forEach((subject, index) => {
        const item = this.createTimelineItem(subject, index);
        timeline.appendChild(item);
      });

      const closeBtn = document.createElement('button');
      closeBtn.textContent = '✕ ปิด';
      closeBtn.style.cssText = 'margin-top:24px;padding:12px 32px;background:rgba(255,255,255,0.2);border:2px solid white;border-radius:12px;color:white;font-weight:600;font-size:16px;cursor:pointer;transition:all 0.3s;backdrop-filter:blur(10px);';
      closeBtn.onmouseover = () => closeBtn.style.background = 'white';
      closeBtn.onmouseout = () => closeBtn.style.background = 'rgba(255,255,255,0.2)';
      closeBtn.onclick = () => modal.remove();

      content.appendChild(header);
      content.appendChild(timeline);
      content.appendChild(closeBtn);
      modal.appendChild(content);
      document.body.appendChild(modal);

      modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

      // Add CSS animation
      if (!document.getElementById('timeline-animations')) {
        const style = document.createElement('style');
        style.id = 'timeline-animations';
        style.textContent = '@keyframes fadeIn { from { opacity:0; } to { opacity:1; } } @keyframes slideIn { from { transform:translateX(-20px); opacity:0; } to { transform:translateX(0); opacity:1; } }';
        document.head.appendChild(style);
      }
    },

    createTimelineItem(subject, index) {
      const progress = this.progress[subject.id];
      const level = progress.level || 0;
      const xp = progress.xp || 0;
      const maxXp = (level + 1) * 100;
      const percentage = Math.min((xp / maxXp) * 100, 100);

      const item = document.createElement('div');
      item.style.cssText = `position:relative;margin-bottom:32px;padding-left:64px;animation:slideIn 0.5s ease ${index * 0.1}s both;`;

      const dot = document.createElement('div');
      dot.style.cssText = `position:absolute;left:12px;top:12px;width:24px;height:24px;background:${subject.color};border:4px solid white;border-radius:50%;box-shadow:0 4px 12px rgba(0,0,0,0.3);z-index:1;`;
      
      const card = document.createElement('div');
      card.style.cssText = 'background:white;border-radius:16px;padding:20px;box-shadow:0 8px 24px rgba(0,0,0,0.2);transition:transform 0.3s,box-shadow 0.3s;cursor:pointer;';
      card.onmouseover = () => {
        card.style.transform = 'translateX(8px) scale(1.02)';
        card.style.boxShadow = '0 12px 32px rgba(0,0,0,0.3)';
      };
      card.onmouseout = () => {
        card.style.transform = 'none';
        card.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
      };

      const header = document.createElement('div');
      header.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;';

      const titleDiv = document.createElement('div');
      titleDiv.style.cssText = 'display:flex;align-items:center;gap:12px;';

      const icon = document.createElement('span');
      icon.textContent = subject.icon;
      icon.style.cssText = 'font-size:32px;';

      const textDiv = document.createElement('div');
      
      const name = document.createElement('h3');
      name.textContent = subject.name;
      name.style.cssText = 'margin:0;color:#1f2937;font-size:20px;font-weight:700;';

      const levelBadge = document.createElement('div');
      levelBadge.textContent = `Level ${level}`;
      levelBadge.style.cssText = `display:inline-block;margin-top:4px;padding:4px 12px;background:${subject.color};color:white;border-radius:12px;font-size:12px;font-weight:600;`;

      textDiv.appendChild(name);
      textDiv.appendChild(levelBadge);
      titleDiv.appendChild(icon);
      titleDiv.appendChild(textDiv);

      const stats = document.createElement('div');
      stats.style.cssText = 'text-align:right;';

      const xpText = document.createElement('div');
      xpText.textContent = `${xp} / ${maxXp} XP`;
      xpText.style.cssText = 'color:#6b7280;font-size:14px;font-weight:600;margin-bottom:4px;';

      const percentText = document.createElement('div');
      percentText.textContent = `${Math.round(percentage)}%`;
      percentText.style.cssText = `color:${subject.color};font-size:20px;font-weight:700;`;

      stats.appendChild(xpText);
      stats.appendChild(percentText);

      header.appendChild(titleDiv);
      header.appendChild(stats);

      // Progress bar
      const progressBar = document.createElement('div');
      progressBar.style.cssText = 'height:12px;background:#e5e7eb;border-radius:6px;overflow:hidden;margin-bottom:12px;';

      const progressFill = document.createElement('div');
      progressFill.style.cssText = `height:100%;background:linear-gradient(90deg, ${subject.color}, ${this.lightenColor(subject.color, 20)});border-radius:6px;transition:width 1s ease;width:0%;`;
      setTimeout(() => progressFill.style.width = percentage + '%', 100);

      progressBar.appendChild(progressFill);

      // Activity info
      const activity = document.createElement('div');
      activity.style.cssText = 'display:flex;gap:16px;font-size:13px;color:#6b7280;';

      const completed = document.createElement('div');
      completed.innerHTML = `✅ <strong>${progress.completed?.length || 0}</strong> หัวข้อที่เรียนจบ`;

      const inProgress = document.createElement('div');
      inProgress.innerHTML = `📖 <strong>${progress.inProgress?.length || 0}</strong> กำลังเรียน`;

      const lastActivity = document.createElement('div');
      if (progress.lastActivity) {
        const date = new Date(progress.lastActivity);
        lastActivity.innerHTML = `🕐 ล่าสุด: ${date.toLocaleDateString('th-TH')}`;
      } else {
        lastActivity.innerHTML = '🕐 ยังไม่มีกิจกรรม';
      }

      activity.appendChild(completed);
      activity.appendChild(inProgress);
      activity.appendChild(lastActivity);

      card.appendChild(header);
      card.appendChild(progressBar);
      card.appendChild(activity);

      item.appendChild(dot);
      item.appendChild(card);

      return item;
    },

    lightenColor(color, percent) {
      const num = parseInt(color.replace('#', ''), 16);
      const amt = Math.round(2.55 * percent);
      const R = (num >> 16) + amt;
      const G = (num >> 8 & 0x00FF) + amt;
      const B = (num & 0x0000FF) + amt;
      return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255))
        .toString(16).slice(1);
    },

    updateProgress(subjectId, xpGain, topicId, status) {
      if (!this.progress[subjectId]) return;

      const subject = this.progress[subjectId];
      subject.xp += xpGain;
      subject.lastActivity = new Date().toISOString();

      const maxXp = (subject.level + 1) * 100;
      if (subject.xp >= maxXp) {
        subject.level++;
        subject.xp = subject.xp - maxXp;
      }

      if (status === 'completed' && !subject.completed.includes(topicId)) {
        subject.completed.push(topicId);
        subject.inProgress = subject.inProgress.filter(id => id !== topicId);
      } else if (status === 'in-progress' && !subject.inProgress.includes(topicId)) {
        subject.inProgress.push(topicId);
      }

      this.saveProgress();
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => MasteryTimeline.init());
  } else {
    MasteryTimeline.init();
  }

  // Make globally available
  window.MasteryTimeline = MasteryTimeline;

})();
