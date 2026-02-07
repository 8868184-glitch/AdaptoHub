(function() {
  'use strict';

  function embedMasteryTimeline() {
    const container = document.getElementById('masteryTimeline');
    if (!container) return;

    // Wait for MasteryTimeline to be available
    const checkAndRender = () => {
      if (!window.MasteryTimeline) {
        setTimeout(checkAndRender, 100);
        return;
      }

      const timeline = window.MasteryTimeline;
      const subjects = timeline.subjects;
      const progress = timeline.progress;

      // Clear container
      container.innerHTML = '';
      container.style.cssText = 'position:relative;padding:20px 0;';

      // Create timeline line
      const line = document.createElement('div');
      line.style.cssText = 'position:absolute;left:24px;top:0;bottom:0;width:4px;background:rgba(0,151,178,0.2);border-radius:2px;';
      container.appendChild(line);

      // Add subject items
      subjects.forEach((subject, index) => {
        const item = createTimelineItem(subject, progress[subject.id], index);
        container.appendChild(item);
      });
    };

    function createTimelineItem(subject, progress, index) {
      const level = progress.level || 0;
      const xp = progress.xp || 0;
      const maxXp = (level + 1) * 100;
      const percentage = Math.min((xp / maxXp) * 100, 100);

      const item = document.createElement('div');
      item.style.cssText = `position:relative;margin-bottom:32px;padding-left:64px;animation:slideIn 0.5s ease ${index * 0.1}s both;`;

      const dot = document.createElement('div');
      dot.style.cssText = `position:absolute;left:12px;top:12px;width:24px;height:24px;background:${subject.color};border:4px solid white;border-radius:50%;box-shadow:0 4px 12px rgba(0,0,0,0.15);z-index:1;`;
      
      const card = document.createElement('div');
      card.style.cssText = 'background:white;border-radius:16px;padding:24px;box-shadow:0 4px 16px rgba(0,0,0,0.08);transition:transform 0.3s,box-shadow 0.3s;border:1px solid #e5e7eb;';
      card.onmouseover = () => {
        card.style.transform = 'translateX(8px) scale(1.02)';
        card.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
      };
      card.onmouseout = () => {
        card.style.transform = 'none';
        card.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
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
      progressFill.style.cssText = `height:100%;background:linear-gradient(90deg, ${subject.color}, ${lightenColor(subject.color, 20)});border-radius:6px;transition:width 1s ease;width:0%;`;
      setTimeout(() => progressFill.style.width = percentage + '%', 100);

      progressBar.appendChild(progressFill);

      // Activity info
      const activity = document.createElement('div');
      activity.style.cssText = 'display:flex;gap:16px;font-size:13px;color:#6b7280;flex-wrap:wrap;';

      const completed = document.createElement('div');
      completed.innerHTML = `✅ <strong style="color:#1f2937">${progress.completed?.length || 0}</strong> หัวข้อที่เรียนจบ`;

      const inProgress = document.createElement('div');
      inProgress.innerHTML = `📖 <strong style="color:#1f2937">${progress.inProgress?.length || 0}</strong> กำลังเรียน`;

      const lastActivity = document.createElement('div');
      if (progress.lastActivity) {
        const date = new Date(progress.lastActivity);
        lastActivity.innerHTML = `🕐 ล่าสุด: <strong style="color:#1f2937">${date.toLocaleDateString('th-TH')}</strong>`;
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
    }

    function lightenColor(color, percent) {
      const num = parseInt(color.replace('#', ''), 16);
      const amt = Math.round(2.55 * percent);
      const R = (num >> 16) + amt;
      const G = (num >> 8 & 0x00FF) + amt;
      const B = (num & 0x0000FF) + amt;
      return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255))
        .toString(16).slice(1);
    }

    checkAndRender();

    // Add CSS animation if not already added
    if (!document.getElementById('timeline-embed-animations')) {
      const style = document.createElement('style');
      style.id = 'timeline-embed-animations';
      style.textContent = '@keyframes slideIn { from { transform:translateX(-20px); opacity:0; } to { transform:translateX(0); opacity:1; } }';
      document.head.appendChild(style);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', embedMasteryTimeline);
  } else {
    embedMasteryTimeline();
  }

})();
