class AnalyticsDashboard {
  constructor() {
    this.currentSubject = 'science';
    this.currentModule = 'physics';
    this.currentPeriod = 'week';
    this.updateIntervals = [];
    this.isRealTimeActive = true;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeModuleSelector();
    this.renderSkillTree();
    this.renderAnalytics();
    this.renderGoals();
    this.startRealTimeUpdates();
  }

  setupEventListeners() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.switchTab(e.target.dataset.tab);
      });
    });

    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('module-btn')) {
        const [subject, module] = e.target.dataset.module.split(':');
        this.currentSubject = subject;
        this.currentModule = module;
        this.updateModuleButtons();
        this.renderSkillTree();
        this.renderAnalytics();
      }
    });

    document.querySelectorAll('.period-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.currentPeriod = e.target.dataset.period;
        this.renderTimeChart();
      });
    });

    const createGoalBtn = document.getElementById('createGoalBtn');
    if (createGoalBtn) {
      createGoalBtn.addEventListener('click', () => this.openGoalModal());
    }

    window.addEventListener('goalCompleted', (e) => {
      this.showGoalCompletionCelebration(e.detail);
      setTimeout(() => this.renderGoals(), 500);
    });

    window.addEventListener('goalMilestone', (e) => {
      this.showMilestoneNotification(e.detail);
    });
  }

  initializeModuleSelector() {
    const selector = document.getElementById('moduleSelector');
    if (!selector) return;

    const modules = [
      { subject: 'science', module: 'physics', icon: '⚛️' },
      { subject: 'science', module: 'chemistry', icon: '🧪' },
      { subject: 'science', module: 'biology', icon: '🧬' }
    ];

    selector.innerHTML = modules.map(m => `
      <button class="module-btn ${this.currentModule === m.module ? 'active' : ''}" data-module="${m.subject}:${m.module}">
        ${m.icon} ${m.module.charAt(0).toUpperCase() + m.module.slice(1)}
      </button>
    `).join('');
  }

  updateModuleButtons() {
    document.querySelectorAll('.module-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.module.endsWith(this.currentModule)) {
        btn.classList.add('active');
      }
    });
  }

  renderSkillTree() {
    const container = document.getElementById('skillTree');
    if (!container) return;

    const units = skillTreeSystem.getModuleUnitsWithStatus(this.currentSubject, this.currentModule);
    
    container.innerHTML = units.map(unit => {
      const lessonUrl = this.getUnitLessonUrl(unit.id);
      const clickable = unit.unlocked && lessonUrl;
      const cursor = clickable ? 'cursor: pointer;' : 'cursor: not-allowed;';
      const onclick = clickable ? `onclick="window.location.href='${lessonUrl}'"` : '';
      
      return `
        <div class="unit-node ${unit.unlocked ? unit.completed ? 'completed' : 'unlocked' : 'locked'}" 
             style="${cursor}" 
             ${onclick}
             title="${clickable ? 'Click to start lesson' : unit.unlocked ? 'Lesson coming soon' : 'Complete prerequisites to unlock'}">
          <div class="unit-icon">${this.getUnitIcon(unit.level)}</div>
          <div class="unit-name">${unit.name}</div>
          <div class="unit-level">Level ${unit.level}</div>
          ${unit.completed ? `<div style="font-size: 0.85rem; color: #4caf50; margin-top: 4px;">${unit.score}%</div>` : ''}
          <div class="unit-status"></div>
        </div>
      `;
    }).join('');

    this.renderRecommendations();
  }

  getUnitLessonUrl(unitId) {
    const lessonMap = {
      'p1': 'mechanics_basics.html',
      'p2': 'forces_motion.html',
      'p3': 'energy_work.html',
      'p4': 'waves_sound.html',
      'p5': 'light_optics.html',
      'p6': 'electromagnetism.html',
      'p7': 'modern_physics.html',
      'c1': 'atomic_structure.html',
      'c2': 'chemical_bonding.html',
      'c3': 'states_matter.html',
      'c4': 'chemical_reactions.html',
      'c5': 'thermodynamics.html',
      'c6': 'organic_chemistry.html',
      'b1': 'cell_biology.html',
      'b2': 'genetics.html',
      'b3': 'evolution.html',
      'b4': 'ecology.html',
      'b5': 'physiology.html',
      'b6': 'molecular_biology.html',
    };
    
    return lessonMap[unitId] || null;
  }

  getUnitIcon(level) {
    const icons = ['🌱', '🌿', '🌳', '🏆'];

    return icons[Math.min(level - 1, 3)];
  }

  renderRecommendations() {
    const container = document.getElementById('skillRecommendations');
    if (!container) return;

    const recommendations = skillTreeSystem.getRecommendations(this.currentSubject, this.currentModule);

    let html = '<h3 style="margin: 0 0 12px 0; color: #0097b2;">Recommended Learning Path</h3>';

    if (recommendations.nextToLearn.length > 0) {
      html += '<strong style="display: block; margin-bottom: 8px;">Next to Learn:</strong><ul class="recommendation-list">';
      recommendations.nextToLearn.forEach(unit => {
        const lessonUrl = this.getUnitLessonUrl(unit.id);
        if (lessonUrl) {
          html += `<li class="recommendation-item"><a href="${lessonUrl}" style="color: #0097b2; text-decoration: none; font-weight: 600;">${unit.name} →</a></li>`;
        } else {
          html += `<li class="recommendation-item">${unit.name}</li>`;
        }
      });
      html += '</ul>';
    }

    if (recommendations.needsReview.length > 0) {
      html += '<strong style="display: block; margin-top: 12px; margin-bottom: 8px;">Areas to Review:</strong><ul class="recommendation-list">';
      recommendations.needsReview.forEach(unit => {
        const lessonUrl = this.getUnitLessonUrl(unit.id);
        if (lessonUrl) {
          html += `<li class="recommendation-item"><a href="${lessonUrl}" style="color: #f39c12; text-decoration: none; font-weight: 600;">${unit.name} (${unit.score || 0}%) →</a></li>`;
        } else {
          html += `<li class="recommendation-item">${unit.name} (${unit.score || 0}%)</li>`;
        }
      });
      html += '</ul>';
    }

    html += '<div style="margin-top: 12px; padding: 12px; background: rgba(0, 151, 178, 0.05); border-radius: 6px; font-size: 0.9rem;">';
    html += `<strong>Progress:</strong> ${skillTreeSystem.getModuleCompletion(this.currentSubject, this.currentModule)}% Complete<br>`;
    html += `<strong>Mastery:</strong> ${skillTreeSystem.estimateMastery(this.currentSubject, this.currentModule)}% Average`;
    html += '</div>';

    container.innerHTML = html;
  }

  renderAnalytics() {
    this.renderAnalyticsSummary();
    this.renderHeatMap();
    this.renderMasteryTimeline();
    this.renderTimeChart();
    this.renderTrendSection();
  }

  renderAnalyticsSummary() {
    const container = document.getElementById('analyticsSummary');
    if (!container) return;

    const timeline = skillTreeSystem.predictMasteryTimeline(this.currentSubject, this.currentModule);
    const timeSpent = analyticsSystem.getTimeSpent(this.currentSubject, this.currentModule, 'all');

    const summary = [
      {
        value: `${timeline.percentComplete}%`,
        label: 'Completion'
      },
      {
        value: `${timeline.estimatedDaysToMastery}d`,
        label: 'Est. to Mastery'
      },
      {
        value: analyticsSystem.formatTime(timeSpent),
        label: 'Time Invested'
      },
      {
        value: `${skillTreeSystem.estimateMastery(this.currentSubject, this.currentModule)}%`,
        label: 'Avg. Score'
      }
    ];

    container.innerHTML = summary.map(s => `
      <div class="summary-card">
        <div class="summary-value">${s.value}</div>
        <div class="summary-label">${s.label}</div>
      </div>
    `).join('');
  }

  renderHeatMap() {
    const container = document.getElementById('heatMap');
    if (!container) return;

    const analysis = skillTreeSystem.getRecommendations(this.currentSubject, this.currentModule);
    const progress = JSON.parse(localStorage.getItem(`adaptohub_${this.currentModule}_units`) || '{}');
    const completedUnits = skillTreeSystem.getModuleUnitsWithStatus(this.currentSubject, this.currentModule)
      .filter(unit => unit.completed);

    const strengths = completedUnits.filter(u => u.score >= 80).length;
    const weaknesses = completedUnits.filter(u => u.score < 60).length;
    const neutral = completedUnits.filter(u => u.score >= 60 && u.score < 80).length;

    const total = completedUnits.length;
    const strengthPercent = total > 0 ? Math.round((strengths / total) * 100) : 0;
    const weaknessPercent = total > 0 ? Math.round((weaknesses / total) * 100) : 0;

    const avgScore = total > 0
      ? Math.round(completedUnits.reduce((sum, u) => sum + (u.score || 0), 0) / total)
      : 0;

    let analysisMessage = 'Keep practicing to strengthen your mastery across units.';
    if (total === 0) {
      analysisMessage = 'Complete your first quiz to unlock personalized strength and weakness insights.';
    } else if (weaknesses > strengths) {
      analysisMessage = 'Focus on your weaker units to lift overall mastery and balance your skills.';
    } else if (strengths > weaknesses) {
      analysisMessage = 'Great momentum! Keep reinforcing your strengths while polishing weaker areas.';
    } else {
      analysisMessage = 'Balanced progress so far. Target a few weak units to push mastery higher.';
    }

    const topStrengths = completedUnits
      .filter(u => u.score >= 80)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    const topWeaknesses = completedUnits
      .filter(u => u.score < 60)
      .sort((a, b) => a.score - b.score)
      .slice(0, 3);

    const cells = [
      { label: `${strengths} Strong Areas`, class: 'heat-strength', emoji: '💪', percent: strengthPercent },
      { label: `${neutral} Moderate Areas`, class: 'heat-neutral', emoji: '⚖️', percent: 100 - strengthPercent - weaknessPercent },
      { label: `${weaknesses} Areas to Improve`, class: 'heat-weakness', emoji: '📚', percent: weaknessPercent }
    ];

    const now = new Date();
    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <h3 style="margin: 0; font-size: 1.1rem;">Strength & Weakness Map</h3>
        <div style="font-size: 0.75rem; color: #4caf50; display: flex; align-items: center; gap: 5px;">
          <span style="display: inline-block; width: 8px; height: 8px; background: #4caf50; border-radius: 50%; animation: pulse 2s infinite;"></span>
          Live • ${now.toLocaleTimeString()}
        </div>
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 20px;">
        ${cells.map(cell => `
          <div class="heat-cell ${cell.class}" style="transition: all 0.3s ease;">
            <div style="font-size: 1.5rem; margin-bottom: 8px;">${cell.emoji}</div>
            <div style="font-weight: 600; margin-bottom: 4px;">${cell.label}</div>
            <div style="font-size: 0.85rem; color: #666;">${cell.percent}%</div>
          </div>
        `).join('')}
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px;">
        <div style="background: #ffffff; border: 1px solid #e6edf2; border-radius: 10px; padding: 16px;">
          <h4 style="margin: 0 0 10px 0; color: #0097b2;">💪 Top Strengths</h4>
          ${topStrengths.length ? `
            <ul style="margin: 0; padding-left: 18px; color: #1f2933;">
              ${topStrengths.map(unit => `
                <li style="margin-bottom: 6px;">
                  <strong>${unit.name}</strong> — ${unit.score}%
                </li>
              `).join('')}
            </ul>
          ` : '<p style="margin: 0; color: #636d79;">Complete more units to reveal strengths.</p>'}
        </div>
        <div style="background: #ffffff; border: 1px solid #e6edf2; border-radius: 10px; padding: 16px;">
          <h4 style="margin: 0 0 10px 0; color: #0097b2;">📚 Areas to Improve</h4>
          ${topWeaknesses.length ? `
            <ul style="margin: 0; padding-left: 18px; color: #1f2933;">
              ${topWeaknesses.map(unit => `
                <li style="margin-bottom: 6px;">
                  <strong>${unit.name}</strong> — ${unit.score}%
                </li>
              `).join('')}
            </ul>
          ` : '<p style="margin: 0; color: #636d79;">No weak areas detected yet.</p>'}
        </div>
        <div style="background: #ffffff; border: 1px solid #e6edf2; border-radius: 10px; padding: 16px;">
          <h4 style="margin: 0 0 10px 0; color: #0097b2;">📈 Analysis</h4>
          <p style="margin: 0 0 8px 0; color: #1f2933;">Average Score: <strong>${avgScore}%</strong></p>
          <p style="margin: 0; color: #636d79;">${analysisMessage}</p>
        </div>
      </div>
    `;
  }

  renderMasteryTimeline() {
    const container = document.getElementById('masteryTimeline');
    if (!container) return;

    const timeline = skillTreeSystem.predictMasteryTimeline(this.currentSubject, this.currentModule);
    const now = new Date();
    const progressPercent = timeline.total > 0 ? Math.round((timeline.completed / timeline.total) * 100) : 0;

    const progress = JSON.parse(localStorage.getItem(`adaptohub_${this.currentModule}_units`) || '{}');
    const completedUnits = Object.values(progress).filter(u => u.completed);
    const lastCompletion = completedUnits.length > 0 ? 
      Math.max(...completedUnits.map(u => new Date(u.completedAt || Date.now()).getTime())) : null;
    
    let timeSinceLastStr = 'No completions yet';
    if (lastCompletion) {
      const hoursSince = Math.floor((Date.now() - lastCompletion) / (1000 * 60 * 60));
      if (hoursSince < 1) timeSinceLastStr = 'Less than 1 hour ago';
      else if (hoursSince < 24) timeSinceLastStr = `${hoursSince} hour${hoursSince > 1 ? 's' : ''} ago`;
      else timeSinceLastStr = `${Math.floor(hoursSince / 24)} day${Math.floor(hoursSince / 24) > 1 ? 's' : ''} ago`;
    }

    const html = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <h3 style="margin: 0; font-size: 1.1rem;">Mastery Timeline</h3>
        <div style="font-size: 0.75rem; color: #4caf50; display: flex; align-items: center; gap: 5px;">
          <span style="display: inline-block; width: 8px; height: 8px; background: #4caf50; border-radius: 50%; animation: pulse 2s infinite;"></span>
          Live • ${now.toLocaleTimeString()}
        </div>
      </div>
      
      <div style="margin-bottom: 15px; background: #f0f0f0; border-radius: 8px; height: 8px; overflow: hidden;">
        <div style="background: linear-gradient(90deg, #0097b2 0%, #4caf50 100%); height: 100%; width: ${progressPercent}%; transition: width 0.5s ease;"></div>
      </div>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px;">
        <div style="padding: 15px; background: #f5f5f5; border-radius: 8px; transition: all 0.3s ease;">
          <div style="font-size: 0.85rem; color: #666; margin-bottom: 8px;">UNITS COMPLETED</div>
          <div style="font-size: 1.8rem; font-weight: 700; color: #0097b2;">${timeline.completed}/${timeline.total}</div>
          <div style="font-size: 0.75rem; color: #999; margin-top: 4px;">${progressPercent}% Complete</div>
        </div>
        <div style="padding: 15px; background: #f5f5f5; border-radius: 8px; transition: all 0.3s ease;">
          <div style="font-size: 0.85rem; color: #666; margin-bottom: 8px;">ESTIMATED TO MASTER</div>
          <div style="font-size: 1.8rem; font-weight: 700; color: #4caf50;">${timeline.estimatedDaysToMastery} Days</div>
          <div style="font-size: 0.75rem; color: #999; margin-top: 4px;">At current pace</div>
        </div>
        <div style="padding: 15px; background: #f5f5f5; border-radius: 8px; transition: all 0.3s ease;">
          <div style="font-size: 0.85rem; color: #666; margin-bottom: 8px;">AVERAGE PACE</div>
          <div style="font-size: 1.8rem; font-weight: 700; color: #f39c12;">${analyticsSystem.formatTime(timeline.currentPace)}/unit</div>
          <div style="font-size: 0.75rem; color: #999; margin-top: 4px;">Last: ${timeSinceLastStr}</div>
        </div>
      </div>
      
      <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 8px; border-left: 4px solid #0097b2;">
        <strong style="color: #0097b2;">📊 Live Analysis:</strong> ${timeline.masteryThreshold}% mastery threshold • ${timeline.completed} completed • ${timeline.total - timeline.completed} remaining
        <br><strong style="color: #0097b2;">⏱️ Projection:</strong> ${timeline.estimatedDaysToMastery === 0 ? 'Ready for mastery!' : `Complete in ${timeline.estimatedDaysToMastery} days at current pace`}
      </div>
    `;

    container.innerHTML = html;
  }

  renderTimeChart() {
    const container = document.getElementById('timeSpentVisualization');
    if (!container) return;

    let days = 7;
    let periodLabel = 'This Week';
    if (this.currentPeriod === 'month') {
      days = 30;
      periodLabel = 'This Month';
    }
    if (this.currentPeriod === 'all') {
      days = 90;
      periodLabel = 'All Time';
    }
    
    const snapshots = analyticsSystem.getSnapshots('daily', days);
    
    const currentSessionSeconds = window.getPlatformSessionTime ? window.getPlatformSessionTime() : 0;
    const currentSessionMinutes = Math.round(currentSessionSeconds / 60);
    
    const today = new Date().toISOString().split('T')[0];
    const todaySnapshot = snapshots.find(s => s.date === today);
    const todayTotalMinutes = todaySnapshot ? Math.round(todaySnapshot.timeSpent / 60) : 0;
    const todayWithCurrentMinutes = todayTotalMinutes + currentSessionMinutes;
    
    const user = JSON.parse(localStorage.getItem('adaptohubUser') || '{}');
    const userName = user.fullName || user.firstName || 'User';
    
    const totalSeconds = snapshots.reduce((sum, s) => sum + (s.timeSpent || 0), 0);
    const totalHours = (totalSeconds / 3600).toFixed(1);
    const totalMinutes = Math.round(totalSeconds / 60);
    const avgMinutesPerDay = snapshots.length > 0 ? Math.round(totalSeconds / 60 / snapshots.length) : 0;
    
    const sortedByTime = [...snapshots].sort((a, b) => (b.timeSpent || 0) - (a.timeSpent || 0));
    const bestDay = sortedByTime[0];
    const worstDay = sortedByTime[sortedByTime.length - 1];
    
    container.innerHTML = `
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(102,126,234,0.3);">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
          <div>
            <div style="font-size: 1.1rem; opacity: 0.9; margin-bottom: 5px;">👤 ${userName}'s Learning Time</div>
            <div style="font-size: 0.85rem; opacity: 0.8;">Real-time tracking • Updates every 30 seconds</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.85rem; opacity: 0.8;">Current Session</div>
            <div id="currentSessionTime" style="font-size: 1.8rem; font-weight: 700;">${currentSessionMinutes}m</div>
            <div style="font-size: 0.75rem; opacity: 0.7;">Today: ${todayWithCurrentMinutes}m total</div>
          </div>
        </div>
      </div>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
        <div style="background: linear-gradient(135deg, #0097b2, #00b8d4); color: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,151,178,0.3);">
          <div style="font-size: 0.9rem; opacity: 0.9; margin-bottom: 8px;">Total Time (${periodLabel})</div>
          <div style="font-size: 2.5rem; font-weight: 700;">${totalHours}h</div>
          <div style="font-size: 0.85rem; opacity: 0.8; margin-top: 5px;">${totalMinutes} minutes</div>
        </div>
        <div style="background: linear-gradient(135deg, #6c5ce7, #a29bfe); color: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 12px rgba(108,92,231,0.3);">
          <div style="font-size: 0.9rem; opacity: 0.9; margin-bottom: 8px;">Average Per Day</div>
          <div style="font-size: 2.5rem; font-weight: 700;">${avgMinutesPerDay}m</div>
          <div style="font-size: 0.85rem; opacity: 0.8; margin-top: 5px;">across ${snapshots.length} days</div>
        </div>
        <div style="background: linear-gradient(135deg, #00b894, #55efc4); color: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,184,148,0.3);">
          <div style="font-size: 0.9rem; opacity: 0.9; margin-bottom: 8px;">Most Productive Day</div>
          <div style="font-size: 2rem; font-weight: 700;">${bestDay ? Math.round(bestDay.timeSpent / 60) : 0}m</div>
          <div style="font-size: 0.85rem; opacity: 0.8; margin-top: 5px;">${bestDay ? new Date(bestDay.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}</div>
        </div>
      </div>
      
      <div style="background: white; border-radius: 12px; padding: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h3 style="margin: 0; color: #0097b2; font-size: 1.2rem;">📊 Daily Breakdown</h3>
          <button onclick="analyticsDashboard.renderTimeChart()" style="background: #0097b2; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 0.85rem; display: flex; align-items: center; gap: 5px; transition: all 0.2s;" onmouseover="this.style.background='#00b8d4'" onmouseout="this.style.background='#0097b2'">
            🔄 Refresh Data
          </button>
        </div>
        <div style="max-height: 400px; overflow-y: auto;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead style="position: sticky; top: 0; background: #f5f6f8; z-index: 1;">
              <tr>
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #0097b2; color: #1f2933; font-weight: 600;">Date</th>
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #0097b2; color: #1f2933; font-weight: 600;">Day</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #0097b2; color: #1f2933; font-weight: 600;">Time Spent</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #0097b2; color: #1f2933; font-weight: 600;">Sessions</th>
                <th style="padding: 12px; text-align: center; border-bottom: 2px solid #0097b2; color: #1f2933; font-weight: 600;">Visual</th>
              </tr>
            </thead>
            <tbody>
              ${snapshots.reverse().map((snapshot, index) => {
                const date = new Date(snapshot.date);
                const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                const isToday = snapshot.date === today;
                let minutes = Math.round((snapshot.timeSpent || 0) / 60);
                if (isToday) minutes += currentSessionMinutes;
                const hours = (minutes / 60).toFixed(1);
                const sessions = snapshot.sessions || 0;
                const maxMinutes = Math.max(...snapshots.map(s => Math.round((s.timeSpent || 0) / 60)), 1);
                const barWidth = (minutes / maxMinutes) * 100;
                
                const rowColor = isToday ? '#fff3cd' : (index % 2 === 0 ? '#ffffff' : '#f9fafb');
                const barColor = minutes > avgMinutesPerDay ? '#0097b2' : '#6c5ce7';
                const todayBadge = '';
                
                return `
                  <tr style="background: ${rowColor}; transition: all 0.2s;" onmouseover="this.style.background='#e3f2fd'" onmouseout="this.style.background='${rowColor}'">
                    <td style="padding: 12px; border-bottom: 1px solid #e6edf2; color: #1f2933;">${dateStr}${todayBadge}</td>
                    <td style="padding: 12px; border-bottom: 1px solid #e6edf2; color: #636d79;">${dayName}</td>
                    <td style="padding: 12px; border-bottom: 1px solid #e6edf2; text-align: right; font-weight: 600; color: #0097b2;">${minutes}m (${hours}h)${isToday ? ' 🔴' : ''}</td>
                    <td style="padding: 12px; border-bottom: 1px solid #e6edf2; text-align: right; color: #636d79;">${sessions}</td>
                    <td style="padding: 12px; border-bottom: 1px solid #e6edf2;">
                      <div style="background: #e6edf2; border-radius: 4px; height: 20px; position: relative; overflow: hidden;">
                        <div style="background: ${barColor}; height: 100%; width: ${barWidth}%; border-radius: 4px; transition: width 0.3s ease;"></div>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
      
      <div style="position: absolute; top: 10px; right: 10px; font-size: 0.75rem; color: #4caf50; display: flex; align-items: center; gap: 5px;">
        <span style="display: inline-block; width: 8px; height: 8px; background: #4caf50; border-radius: 50%; animation: pulse 2s infinite;"></span>
        Live • ${new Date().toLocaleTimeString()}
      </div>
    `;
    
    const self = this;
    if (this.timeVisualizationInterval) {
      clearInterval(this.timeVisualizationInterval);
    }
    
    this.timeVisualizationInterval = setInterval(() => {
      if (window.getPlatformSessionTime) {
        const currentSeconds = window.getPlatformSessionTime();
        const currentMinutes = Math.round(currentSeconds / 60);
        const sessionTimeEl = document.getElementById('currentSessionTime');
        
        if (sessionTimeEl) {
          const oldText = sessionTimeEl.textContent;
          const newText = currentMinutes + 'm';
          if (oldText !== newText) {
            sessionTimeEl.textContent = newText;
            const subtitleEl = sessionTimeEl.parentElement.querySelector('div:last-child');
            if (subtitleEl) {
              const today = new Date().toISOString().split('T')[0];
              const todaySnapshot = analyticsSystem.getSnapshots('daily', 1).find(s => s.date === today);
              const todayMins = todaySnapshot ? Math.round(todaySnapshot.timeSpent / 60) : 0;
              const totalWithCurrent = todayMins + currentMinutes;
              subtitleEl.innerHTML = `Today: ${totalWithCurrent}m total`;
            }
          }
        }
      }
    }, 1000); 
  }

  renderTrendSection() {
    this.renderPerformanceTrendChart();
    this.renderTimeTrendChart();
    this.renderTrendSummary();
  }

  renderPerformanceTrendChart() {
    const canvas = document.getElementById('performanceTrendChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const snapshots = analyticsSystem.getSnapshots('daily', 30);
    const labels = snapshots.map(s => this.formatSnapshotLabel(s.date));
    const values = snapshots.map(s => s.avgScore || 0);

    this.drawLineChart(ctx, labels, values, canvas, {
      stroke: '#0097b2',
      fill: 'rgba(0, 151, 178, 0.1)',
      valueSuffix: '%',
      emptyText: 'No performance history yet'
    });
  }

  renderTimeTrendChart() {
    const canvas = document.getElementById('timeTrendChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const snapshots = analyticsSystem.getSnapshots('daily', 30);
    const labels = snapshots.map(s => this.formatSnapshotLabel(s.date));
    const values = snapshots.map(s => Math.round((s.timeSpent || 0) / 60));

    this.drawLineChart(ctx, labels, values, canvas, {
      stroke: '#6c5ce7',
      fill: 'rgba(108, 92, 231, 0.12)',
      valueSuffix: 'm',
      emptyText: 'No time history yet'
    });
  }

  renderTrendSummary() {
    const container = document.getElementById('trendSummary');
    if (!container) return;

    const performanceVelocity = analyticsSystem.getPerformanceVelocity();
    const timeVelocity = analyticsSystem.getTimeVelocity();
    const goalsVelocity = analyticsSystem.getGoalsCompletionVelocity();

    const cards = [
      { value: `${performanceVelocity}%/day`, label: 'Performance Velocity' },
      { value: `${timeVelocity}m/day`, label: 'Time Velocity' },
      { value: `${goalsVelocity}%/day`, label: 'Goal Completion Velocity' }
    ];

    container.innerHTML = cards.map(card => `
      <div class="summary-card">
        <div class="summary-value">${card.value}</div>
        <div class="summary-label">${card.label}</div>
      </div>
    `).join('');
  }

  drawBarChart(ctx, data, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const entries = Object.entries(data);
    if (entries.length === 0) {
      ctx.fillStyle = '#999';
      ctx.font = '14px Arial';
      ctx.fillText('No data available for this period', 50, canvas.height / 2);
      return;
    }

    const barWidth = canvas.width / entries.length;
    const maxValue = Math.max(...entries.map(e => Array.isArray(e[1]) ? Math.max(...e[1]) : e[1]));
    const padding = 40;

    entries.forEach((entry, index) => {
      const value = Array.isArray(entry[1]) ? entry[1].reduce((a, b) => a + b, 0) : entry[1];
      const barHeight = (value / maxValue) * (canvas.height - padding * 2);
      const x = index * barWidth + barWidth / 4;
      const y = canvas.height - padding - barHeight;

      ctx.fillStyle = '#0097b2';
      ctx.fillRect(x, y, barWidth / 2, barHeight);

      ctx.fillStyle = '#666';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      const label = entry[0].split('_')[1].substring(0, 4).toUpperCase();
      ctx.fillText(label, x + barWidth / 4, canvas.height - padding + 20);

      ctx.fillStyle = '#333';
      ctx.fillText(`${Math.round(value / 60)}m`, x + barWidth / 4, y - 5);
    });
  }

  drawTimeSpentLineChart(ctx, dates, hours, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (dates.length === 0 || hours.length === 0) {
      ctx.fillStyle = '#999';
      ctx.font = '14px Bai Jamjuree';
      ctx.fillText('No time data available yet', canvas.width / 2 - 80, canvas.height / 2);
      return;
    }
    
    const padding = { left: 80, right: 40, top: 40, bottom: 60 };
    const chartWidth = canvas.width - padding.left - padding.right;
    const chartHeight = canvas.height - padding.top - padding.bottom;
    
    const maxHours = Math.max(...hours, 1);
    const stepHours = maxHours / 5;
    
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, canvas.height - padding.bottom);
    ctx.lineTo(canvas.width - padding.right, canvas.height - padding.bottom);
    ctx.stroke();
    
    ctx.fillStyle = '#333';
    ctx.font = '12px Bai Jamjuree';
    ctx.textAlign = 'center';
    for (let i = 0; i <= 5; i++) {
      const hours = (stepHours * i).toFixed(1);
      const x = padding.left + (chartWidth / 5) * i;
      ctx.fillText(hours + 'h', x, canvas.height - padding.bottom + 20);
      
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, canvas.height - padding.bottom);
      ctx.stroke();
    }
    
    ctx.fillStyle = '#0097b2';
    ctx.font = 'bold 14px Bai Jamjuree';
    ctx.fillText('Hours Spent', canvas.width / 2, canvas.height - 10);
    
    ctx.textAlign = 'right';
    ctx.font = '11px Bai Jamjuree';
    ctx.fillStyle = '#333';
    const dateStep = Math.max(1, Math.floor(dates.length / 8));
    for (let i = 0; i < dates.length; i += dateStep) {
      const y = padding.top + (chartHeight / (dates.length - 1)) * i;
      ctx.fillText(dates[i], padding.left - 10, y + 4);
      
      ctx.strokeStyle = '#f0f0f0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(canvas.width - padding.right, y);
      ctx.stroke();
    }
    
    ctx.save();
    ctx.translate(15, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#0097b2';
    ctx.font = 'bold 14px Bai Jamjuree';
    ctx.textAlign = 'center';
    ctx.fillText('Date', 0, 0);
    ctx.restore();
    
    // Draw line
    ctx.strokeStyle = '#0097b2';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    
    for (let i = 0; i < dates.length; i++) {
      const x = padding.left + (hours[i] / maxHours) * chartWidth;
      const y = padding.top + (chartHeight / (dates.length - 1)) * i;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    
    // Draw points
    for (let i = 0; i < dates.length; i++) {
      const x = padding.left + (hours[i] / maxHours) * chartWidth;
      const y = padding.top + (chartHeight / (dates.length - 1)) * i;
      
      ctx.fillStyle = '#00b8d4';
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Show value on hover (simplified - show all values)
      if (i % dateStep === 0 || i === dates.length - 1) {
        ctx.fillStyle = '#666';
        ctx.font = '10px Bai Jamjuree';
        ctx.textAlign = 'left';
        ctx.fillText(hours[i] + 'h', x + 8, y - 8);
      }
    }
  }

  drawLineChart(ctx, labels, values, canvas, options) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!labels.length || !values.length) {
      ctx.fillStyle = '#999';
      ctx.font = '14px Arial';
      ctx.fillText(options.emptyText || 'No data available', 50, canvas.height / 2);
      return;
    }

    const padding = 40;
    const maxValue = Math.max(...values, 1);
    const minValue = Math.min(...values, 0);
    const range = maxValue - minValue || 1;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;

    const points = values.map((value, index) => {
      const x = padding + (index / (values.length - 1 || 1)) * chartWidth;
      const y = padding + ((maxValue - value) / range) * chartHeight;
      return { x, y, value };
    });

    ctx.beginPath();
    ctx.strokeStyle = options.stroke || '#0097b2';
    ctx.lineWidth = 2;

    points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.stroke();

    ctx.lineTo(points[points.length - 1].x, canvas.height - padding);
    ctx.lineTo(points[0].x, canvas.height - padding);
    ctx.closePath();
    ctx.fillStyle = options.fill || 'rgba(0, 151, 178, 0.1)';
    ctx.fill();

    ctx.fillStyle = '#666';
    ctx.font = '11px Arial';
    ctx.textAlign = 'center';
    const labelStep = Math.ceil(labels.length / 6);
    labels.forEach((label, index) => {
      if (index % labelStep === 0 || index === labels.length - 1) {
        const x = padding + (index / (labels.length - 1 || 1)) * chartWidth;
        ctx.fillText(label, x, canvas.height - padding + 16);
      }
    });

    ctx.fillStyle = '#333';
    ctx.textAlign = 'left';
    ctx.fillText(`${Math.round(maxValue)}${options.valueSuffix || ''}`, padding, padding - 10);
  }

  formatSnapshotLabel(dateString) {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }

  renderGoals() {
    this.renderGoalsSummary();
    this.renderActiveGoals();
    this.renderCompletedGoals();
    this.renderGoalSuggestions();
  }

  renderGoalsSummary() {
    const container = document.getElementById('goalsSummary');
    if (!container) return;

    const summary = goalsSystem.getSummary();

    const cards = [
      { value: summary.active, label: 'Active Goals' },
      { value: summary.completed, label: 'Completed' },
      { value: summary.longestStreak, label: 'Best Streak' },
      { value: summary.totalRewardsEarned, label: 'Points Earned' }
    ];

    container.innerHTML = cards.map(card => `
      <div class="summary-card">
        <div class="summary-value">${card.value}</div>
        <div class="summary-label">${card.label}</div>
      </div>
    `).join('');
  }

  renderActiveGoals() {
    const container = document.getElementById('activeGoals');
    if (!container) return;

    const goals = goalsSystem.getActiveGoals();

    if (goals.length === 0) {
      container.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">No active goals. Create one to get started!</p>';
      return;
    }

    container.innerHTML = goals.map(goal => this.createGoalCard(goal)).join('');
  }

  renderCompletedGoals() {
    const container = document.getElementById('completedGoals');
    if (!container) return;

    const goals = goalsSystem.getCompletedGoals(5);

    if (goals.length === 0) {
      container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No completed goals yet. Keep learning!</p>';
      return;
    }

    container.innerHTML = goals.map(goal => this.createGoalCard(goal, true)).join('');
  }

  createGoalCard(goal, completed = false) {
    const daysLeft = Math.ceil((goal.dueDate - Date.now()) / (1000 * 60 * 60 * 24));

    return `
      <div class="goal-card ${completed ? 'completed' : ''}" id="goal-${goal.id}" style="position: relative;">
        <div class="goal-header" style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div class="goal-title">${goalsSystem.goalCategories[goal.category]}</div>
            <div style="font-size: 0.85rem; color: #636d79;">Frequency: ${goal.type}</div>
          </div>
          <div class="goal-actions" style="display: flex; gap: 8px;">
            ${!completed ? `
              <button class="goal-action-btn" onclick="editGoalAmount('${goal.id}')" title="Edit target" style="background: #2196F3; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 0.85rem;">✏️ Edit</button>
              <button class="goal-action-btn" onclick="deleteGoal('${goal.id}')" title="Delete goal" style="background: #f44336; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 0.85rem;">✕</button>
            ` : `
              <button class="goal-action-btn" onclick="recreateGoal('${goal.id}')" title="Recreate goal" style="background: #4caf50; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 0.85rem;">+ Repeat</button>
            `}
          </div>
        </div>
        
        <div class="goal-progress-bar">
          <div class="goal-progress-fill" style="width: ${goal.progress}%"></div>
        </div>
        
        <div class="goal-stats">
          <span>${goal.current} / ${goal.target}</span>
          <span>${goal.progress}%</span>
        </div>
        
        ${!completed ? `<div style="font-size: 0.85rem; color: #666; margin-top: 8px;">
          ${daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
        </div>` : ''}
        
        <div class="goal-reward">🎁 ${goal.reward} Points</div>
        
        <!-- Hidden frequency selector -->
        <div id="freq-selector-${goal.id}" style="display: none; margin-top: 12px; padding: 12px; background: #f5f5f5; border-radius: 6px;">
          <div style="font-size: 0.85rem; font-weight: 600; margin-bottom: 8px;">Change Frequency:</div>
          <div style="display: flex; gap: 8px;">
            <button onclick="changeGoalFrequency('${goal.id}', 'daily')" style="flex: 1; padding: 8px; background: ${goal.type === 'daily' ? '#0097b2' : '#e0e0e0'}; color: ${goal.type === 'daily' ? 'white' : '#333'}; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">Daily</button>
            <button onclick="changeGoalFrequency('${goal.id}', 'weekly')" style="flex: 1; padding: 8px; background: ${goal.type === 'weekly' ? '#0097b2' : '#e0e0e0'}; color: ${goal.type === 'weekly' ? 'white' : '#333'}; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">Weekly</button>
            <button onclick="changeGoalFrequency('${goal.id}', 'monthly')" style="flex: 1; padding: 8px; background: ${goal.type === 'monthly' ? '#0097b2' : '#e0e0e0'}; color: ${goal.type === 'monthly' ? 'white' : '#333'}; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">Monthly</button>
          </div>
        </div>
      </div>
    `;
  }

  renderGoalSuggestions() {
    const container = document.getElementById('goalSuggestions');
    if (!container) return;

    const suggestions = goalsSystem.getGoalSuggestions();

    if (suggestions.length === 0) {
      container.innerHTML = '';
      return;
    }

    let html = '<div style="background: #fff3e0; padding: 20px; border-radius: 8px; border-left: 4px solid #f39c12;">';
    html += '<strong style="color: #f39c12;">Suggested Goals</strong><ul class="recommendation-list" style="margin-top: 12px;">';

    suggestions.forEach(suggestion => {
      html += `
        <li class="recommendation-item" onclick="createGoalFromSuggestion('${suggestion.category}', ${suggestion.target}, '${suggestion.type}')" style="cursor: pointer; color: #f39c12;">
          ${suggestion.reason}
        </li>
      `;
    });

    html += '</ul></div>';
    container.innerHTML = html;
  }

  switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.tab === tabName) {
        btn.classList.add('active');
      }
    });

    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');

    if (tabName === 'analytics') {
      this.renderAnalytics();
    } else if (tabName === 'goals') {
      this.renderGoals();
    }
  }

  openGoalModal() {
    document.getElementById('goalModal').style.display = 'flex';
  }

  showGoalCompletionCelebration(detail) {
    if (typeof triggerCelebration === 'function') {
      triggerCelebration({
        type: 'goal',
        title: detail.goalName,
        message: `You earned ${detail.reward} points!`,
        emoji: '🎉'
      });
    }
  }

  showMilestoneNotification(detail) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
      color: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      z-index: 3000;
      animation: slideIn 0.3s ease;
    `;

    notification.innerHTML = `
      <div style="font-weight: 600; margin-bottom: 4px;">🎯 ${detail.goalName} Milestone!</div>
      <div>${detail.progress}% Complete</div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  startRealTimeUpdates() {
    this.stopRealTimeUpdates();
    
    if (!this.isRealTimeActive) return;

    const timeChartInterval = setInterval(() => {
      if (document.getElementById('timeChart')) {
        this.renderTimeChart();
      }
    }, 5000);

    const heatMapInterval = setInterval(() => {
      if (document.getElementById('heatMap')) {
        this.renderHeatMap();
      }
    }, 10000);

    const masteryInterval = setInterval(() => {
      if (document.getElementById('masteryTimeline')) {
        this.renderMasteryTimeline();
      }
    }, 10000);

    const summaryInterval = setInterval(() => {
      if (document.getElementById('analyticsSummary')) {
        this.renderAnalyticsSummary();
      }
    }, 5000);

    const trendInterval = setInterval(() => {
      if (document.getElementById('performanceTrendChart')) {
        this.renderTrendSection();
      }
    }, 15000);

    this.updateIntervals = [timeChartInterval, heatMapInterval, masteryInterval, summaryInterval, trendInterval];
  }

  stopRealTimeUpdates() {
    this.updateIntervals.forEach(interval => clearInterval(interval));
    this.updateIntervals = [];
  }

  toggleRealTime() {
    this.isRealTimeActive = !this.isRealTimeActive;
    if (this.isRealTimeActive) {
      this.startRealTimeUpdates();
    } else {
      this.stopRealTimeUpdates();
    }
    return this.isRealTimeActive;
  }
}

function closeGoalModal() {
  document.getElementById('goalModal').style.display = 'none';
}

function createNewGoal() {
  const type = document.getElementById('goalType').value;
  const category = document.getElementById('goalCategory').value;
  const target = parseInt(document.getElementById('goalTarget').value);

  if (!target || target < 1) {
    alert('Please enter a valid target');
    return;
  }

  const goal = goalsSystem.createGoal(category, target, type);

  if (typeof analyticsSystem !== 'undefined') {
    analyticsSystem.recordGoalCreation({
      goalId: goal.id,
      category: category,
      target: target,
      type: type,
      subject: dashboard.currentSubject,
      module: dashboard.currentModule,
      createdAt: Date.now()
    });
  }
  
  closeGoalModal();
  dashboard.renderGoals();

  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
    color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    z-index: 3000;
    animation: slideIn 0.3s ease;
  `;
  notification.innerHTML = `
    <div style="font-weight: 600; margin-bottom: 4px;">🎯 Goal Created!</div>
    <div>${goalsSystem.goalCategories[category]} - ${target} ${type}</div>
  `;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);

  document.getElementById('goalTarget').value = '';
}

function createGoalFromSuggestion(category, target, type) {
  const goal = goalsSystem.createGoal(category, target, type);
  
  if (typeof analyticsSystem !== 'undefined') {
    analyticsSystem.recordGoalCreation({
      goalId: goal.id,
      category: category,
      target: target,
      type: type,
      subject: dashboard.currentSubject,
      module: dashboard.currentModule,
      createdAt: Date.now(),
      fromSuggestion: true
    });
  }
  
  dashboard.renderGoals();
  
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
    color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    z-index: 3000;
    animation: slideIn 0.3s ease;
  `;
  notification.innerHTML = `
    <div style="font-weight: 600; margin-bottom: 4px;">🎯 Goal Created from Suggestion!</div>
    <div>${goalsSystem.goalCategories[category]} - ${target} ${type}</div>
  `;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

const dashboard = new AnalyticsDashboard();

const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
      transform: scale(1.2);
    }
  }

  .heat-cell {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .heat-cell:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .goal-actions button {
    transition: all 0.2s ease;
  }

  .goal-actions button:hover {
    transform: scale(1.05);
    opacity: 0.9;
  }

`;
document.head.appendChild(style);

function toggleFrequencySelector(goalId) {
  const selector = document.getElementById(`freq-selector-${goalId}`);
  if (selector) {
    selector.style.display = selector.style.display === 'none' ? 'block' : 'none';
  }
}

function changeGoalFrequency(goalId, newType) {
  const goals = JSON.parse(localStorage.getItem('adaptohub_goals'));
  let goal = null;
  
  goals.active = goals.active.map(g => {
    if (g.id === goalId) {
      goal = g;
      g.type = newType;
      g.dueDate = goalsSystem.calculateDueDate(newType);
      g.progress = 0;
      g.current = 0;
    }
    return g;
  });
  
  localStorage.setItem('adaptohub_goals', JSON.stringify(goals));
  
  showGoalNotification(`Goal frequency changed to ${newType}!`, '#0097b2');
  
  dashboard.renderGoals();
}

function editGoalAmount(goalId) {
  const goals = JSON.parse(localStorage.getItem('adaptohub_goals'));
  const goal = goals.active.find(g => g.id === goalId);
  
  if (!goal) return;
  
  const newTarget = prompt(`Edit target for "${goalsSystem.goalCategories[goal.category]}":\n\nCurrent target: ${goal.target}`, goal.target);
  
  if (newTarget && parseInt(newTarget) > 0) {
    goal.target = parseInt(newTarget);
    goal.reward = goalsSystem.calculateReward(goal.category, goal.target, goal.type);
    localStorage.setItem('adaptohub_goals', JSON.stringify(goals));
    
    showGoalNotification(`Target updated to ${goal.target}! Reward is now ${goal.reward} points.`, '#4caf50');
    dashboard.renderGoals();
  }
}

function deleteGoal(goalId) {
  if (!confirm('Are you sure you want to delete this goal? This action cannot be undone.')) {
    return;
  }
  
  const goals = JSON.parse(localStorage.getItem('adaptohub_goals'));
  goals.active = goals.active.filter(g => g.id !== goalId);
  localStorage.setItem('adaptohub_goals', JSON.stringify(goals));
  
  showGoalNotification('Goal deleted.', '#f44336');
  dashboard.renderGoals();
}

function recreateGoal(goalId) {
  const goals = JSON.parse(localStorage.getItem('adaptohub_goals'));
  const completedGoal = goals.completed.find(g => g.id === goalId);
  
  if (!completedGoal) return;
  
  const newGoal = {
    id: goalsSystem.generateId(),
    category: completedGoal.category,
    target: completedGoal.target,
    current: 0,
    type: completedGoal.type,
    subject: completedGoal.subject || 'general',
    createdAt: Date.now(),
    dueDate: goalsSystem.calculateDueDate(completedGoal.type),
    completed: false,
    completedAt: null,
    progress: 0,
    reward: goalsSystem.calculateReward(completedGoal.category, completedGoal.target, completedGoal.type),
    milestone: Math.ceil(completedGoal.target * 0.5),
    milestoneReached: false
  };
  
  goals.active.push(newGoal);
  localStorage.setItem('adaptohub_goals', JSON.stringify(goals));
  
  if (typeof analyticsSystem !== 'undefined') {
    analyticsSystem.recordGoalCreation({
      goalId: newGoal.id,
      category: newGoal.category,
      target: newGoal.target,
      type: newGoal.type,
      subject: dashboard.currentSubject,
      module: dashboard.currentModule,
      createdAt: Date.now(),
      fromRecreation: true
    });
  }
  
  showGoalNotification(`${goalsSystem.goalCategories[completedGoal.category]} goal recreated!`, '#4caf50');
  dashboard.renderGoals();
}

function showGoalNotification(message, color) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${color};
    color: white;
    padding: 16px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    z-index: 3000;
    animation: slideIn 0.3s ease;
    font-weight: 600;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 2500);
}