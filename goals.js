class GoalsSystem {
  constructor() {
    this.goalsKey = 'adaptohub_goals';
    this.goalHistoryKey = 'adaptohub_goal_history';
    this.streakKey = 'adaptohub_goal_streaks';
    
    this.goalTypes = {
      daily: { name: 'Daily Goal', duration: 1 },
      weekly: { name: 'Weekly Goal', duration: 7 },
      monthly: { name: 'Monthly Goal', duration: 30 }
    };

    this.goalCategories = {
      unitsCompleted: 'Units Completed',
      timeSpent: 'Time Spent',
      averageScore: 'Average Score',
      questionsAnswered: 'Questions Answered',
      subjectsExplored: 'Subjects Explored',
      perfectionRuns: 'Perfect Scores'
    };

    this.initializeData();
  }

  initializeData() {
    if (!localStorage.getItem(this.goalsKey)) {
      localStorage.setItem(this.goalsKey, JSON.stringify({
        active: [],
        completed: [],
        failed: []
      }));
    }

    if (!localStorage.getItem(this.goalHistoryKey)) {
      localStorage.setItem(this.goalHistoryKey, JSON.stringify([]));
    }

    if (!localStorage.getItem(this.streakKey)) {
      localStorage.setItem(this.streakKey, JSON.stringify({}));
    }
  }

  createGoal(category, target, type = 'daily', subject = null) {
    if (!this.goalCategories[category]) {
      throw new Error('Invalid goal category');
    }

    if (!this.goalTypes[type]) {
      throw new Error('Invalid goal type');
    }

    const goal = {
      id: this.generateId(),
      category,
      target,
      current: 0,
      type,
      subject: subject || 'general',
      createdAt: Date.now(),
      dueDate: this.calculateDueDate(type),
      completed: false,
      completedAt: null,
      progress: 0,
      reward: this.calculateReward(category, target, type),
      milestone: Math.ceil(target * 0.5),
      milestoneReached: false
    };

    const goals = JSON.parse(localStorage.getItem(this.goalsKey));
    goals.active.push(goal);
    localStorage.setItem(this.goalsKey, JSON.stringify(goals));

    return goal;
  }

  updateGoalProgress(goalId, increment) {
    const goals = JSON.parse(localStorage.getItem(this.goalsKey));
    let updated = false;

    goals.active = goals.active.map(goal => {
      if (goal.id === goalId) {
        goal.current = Math.min(goal.current + increment, goal.target);
        goal.progress = Math.round((goal.current / goal.target) * 100);

        if (goal.current >= goal.target && !goal.completed) {
          goal.completed = true;
          goal.completedAt = Date.now();
          this.celebrateGoal(goal);
        }

        if (!goal.milestoneReached && goal.current >= goal.milestone) {
          goal.milestoneReached = true;
          this.triggerMilestoneNotification(goal);
        }

        updated = true;
      }
      return goal;
    });

    if (updated) {
      localStorage.setItem(this.goalsKey, JSON.stringify(goals));
    }
  }

  updateGoalsFromActivity(activity) {
    const goals = JSON.parse(localStorage.getItem(this.goalsKey));
    const today = new Date().toISOString().split('T')[0];

    if (activity.type === 'unitCompleted') {
      goals.active.forEach(goal => {
        if (goal.category === 'unitsCompleted') {
          this.updateGoalProgress(goal.id, 1);
        }
      });
    }

    if (activity.type === 'timeLogged') {
      goals.active.forEach(goal => {
        if (goal.category === 'timeSpent') {
          const minutes = Math.round(activity.duration / 60);
          this.updateGoalProgress(goal.id, minutes);
        }
      });
    }

    if (activity.type === 'quizCompleted') {
      goals.active.forEach(goal => {
        if (goal.category === 'questionsAnswered') {
          this.updateGoalProgress(goal.id, activity.questionCount || 1);
        }
        if (goal.category === 'perfectionRuns' && activity.score === 100) {
          this.updateGoalProgress(goal.id, 1);
        }
      });
    }

    goals.completed = goals.completed || [];
    goals.active = goals.active.filter(goal => {
      if (goal.completed) {
        goals.completed.push(goal);
        return false;
      }
      return true;
    });

    localStorage.setItem(this.goalsKey, JSON.stringify(goals));
  }

  completeGoal(goalId) {
    const goals = JSON.parse(localStorage.getItem(this.goalsKey));
    
    goals.active = goals.active.map(goal => {
      if (goal.id === goalId) {
        goal.completed = true;
        goal.completedAt = Date.now();
        this.celebrateGoal(goal);
      }
      return goal;
    });

    const completedGoal = goals.active.find(g => g.id === goalId);
    if (completedGoal) {
      goals.completed = goals.completed || [];
      goals.completed.push(completedGoal);
      goals.active = goals.active.filter(g => g.id !== goalId);
    }

    localStorage.setItem(this.goalsKey, JSON.stringify(goals));
  }

  getGoalStreaks() {
    const streaks = JSON.parse(localStorage.getItem(this.streakKey));
    return streaks;
  }

  updateStreak(type) {
    const streaks = JSON.parse(localStorage.getItem(this.streakKey));
    const today = new Date().toISOString().split('T')[0];

    if (!streaks[type]) {
      streaks[type] = {
        count: 0,
        startDate: null,
        lastDate: null
      };
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (streaks[type].lastDate === yesterdayStr) {
      streaks[type].count++;
    } else if (streaks[type].lastDate !== today) {
      streaks[type].count = 1;
      streaks[type].startDate = today;
    }

    streaks[type].lastDate = today;
    localStorage.setItem(this.streakKey, JSON.stringify(streaks));

    return streaks[type];
  }

  celebrateGoal(goal) {
    const event = new CustomEvent('goalCompleted', {
      detail: {
        goalId: goal.id,
        goalName: `${this.goalCategories[goal.category]} Goal Completed!`,
        reward: goal.reward,
        type: goal.type
      }
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(event);
    }

    this.updateStreak(`${goal.category}_${goal.type}`);

    this.addToHistory({
      type: 'completed',
      goal,
      timestamp: Date.now()
    });

    // Track in analytics
    if (typeof analyticsSystem !== 'undefined') {
      analyticsSystem.recordGoalCompletion({
        goalId: goal.id,
        category: goal.category,
        target: goal.target,
        type: goal.type,
        createdAt: goal.createdAt,
        completedAt: goal.completedAt
      });
    }

    if (typeof gamification !== 'undefined' && gamification) {
      gamification.awardPoints(goal.reward, 'goal_completion', goal.category);
    }
  }

  triggerMilestoneNotification(goal) {
    const event = new CustomEvent('goalMilestone', {
      detail: {
        goalId: goal.id,
        goalName: this.goalCategories[goal.category],
        progress: goal.progress,
        milestone: Math.ceil(goal.target * 0.5)
      }
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(event);
    }
  }

  getActiveGoals() {
    const goals = JSON.parse(localStorage.getItem(this.goalsKey));
    return goals.active || [];
  }

  getCompletedGoals(limit = 10) {
    const goals = JSON.parse(localStorage.getItem(this.goalsKey));
    return (goals.completed || []).slice(-limit).reverse();
  }

  getFailedGoals(limit = 10) {
    const goals = JSON.parse(localStorage.getItem(this.goalsKey));
    const now = Date.now();

    const failed = (goals.active || [])
      .filter(goal => goal.dueDate < now && !goal.completed)
      .slice(-limit);

    return failed.reverse();
  }

  getGoalSuggestions() {
    const analytics = typeof analyticsSystem !== 'undefined' ? analyticsSystem : null;
    const suggestions = [];

    if (analytics) {
      const activeGoals = this.getActiveGoals();
      const hasDailyGoal = activeGoals.some(g => g.type === 'daily');

      if (!hasDailyGoal) {
        suggestions.push({
          category: 'unitsCompleted',
          target: 1,
          type: 'daily',
          reason: 'Complete one unit today'
        });
      }

      const hasTimeGoal = activeGoals.some(g => g.category === 'timeSpent');
      if (!hasTimeGoal) {
        suggestions.push({
          category: 'timeSpent',
          target: 60,
          type: 'daily',
          reason: 'Study for 1 hour today'
        });
      }

      const hasScoreGoal = activeGoals.some(g => g.category === 'averageScore');
      if (!hasScoreGoal) {
        suggestions.push({
          category: 'averageScore',
          target: 80,
          type: 'weekly',
          reason: 'Maintain 80% average this week'
        });
      }
    }

    return suggestions;
  }

  addToHistory(entry) {
    const history = JSON.parse(localStorage.getItem(this.goalHistoryKey));
    history.push(entry);
    localStorage.setItem(this.goalHistoryKey, JSON.stringify(history));
  }

  generateId() {
    return `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  calculateDueDate(type) {
    const now = new Date();
    const days = this.goalTypes[type].duration;
    now.setDate(now.getDate() + days);
    return now.getTime();
  }

  calculateReward(category, target, type) {
    const baseReward = {
      unitsCompleted: 50,
      timeSpent: 30,
      averageScore: 75,
      questionsAnswered: 20,
      subjectsExplored: 40,
      perfectionRuns: 100
    };

    const categoryReward = baseReward[category] || 50;
    const typeMultiplier = { daily: 1, weekly: 2, monthly: 4 }[type] || 1;
    const targetMultiplier = Math.max(1, Math.floor(target / 10));

    return categoryReward * typeMultiplier * targetMultiplier;
  }

  getSummary() {
    const goals = JSON.parse(localStorage.getItem(this.goalsKey));
    const streaks = JSON.parse(localStorage.getItem(this.streakKey));

    const streakValues = Object.values(streaks).map(s => s.count || 0);
    const longestStreak = streakValues.length > 0 ? Math.max(...streakValues) : 0;

    return {
      active: goals.active?.length || 0,
      completed: goals.completed?.length || 0,
      totalRewardsEarned: (goals.completed || []).reduce((sum, g) => sum + g.reward, 0),
      currentStreaks: Object.values(streaks).filter(s => s.count > 0).length,
      longestStreak: longestStreak
    };
  }

  cleanupExpiredGoals() {
    const goals = JSON.parse(localStorage.getItem(this.goalsKey));
    const now = Date.now();

    goals.active = goals.active.filter(goal => {
      if (goal.dueDate < now && !goal.completed) {
        goals.failed = goals.failed || [];
        goals.failed.push({ ...goal, failed: true, failedAt: now });
        
        if (typeof analyticsSystem !== 'undefined') {
          analyticsSystem.recordGoalFailure({
            goalId: goal.id,
            category: goal.category,
            target: goal.target,
            current: goal.current,
            type: goal.type,
            createdAt: goal.createdAt
          });
        }
        
        return false;
      }
      return true;
    });

    localStorage.setItem(this.goalsKey, JSON.stringify(goals));
  }
}

const goalsSystem = new GoalsSystem();

goalsSystem.cleanupExpiredGoals();

const GoalsUI = {
  goalPresets: {
    daily: [
      { category: 'unitsCompleted', target: 2, label: '📚 Complete 2 Units' },
      { category: 'unitsCompleted', target: 5, label: '📚 Complete 5 Units' },
      { category: 'timeSpent', target: 30, label: '⏱️ Study 30 Minutes' },
      { category: 'timeSpent', target: 60, label: '⏱️ Study 1 Hour' },
      { category: 'timeSpent', target: 120, label: '⏱️ Study 2 Hours' },
      { category: 'questionsAnswered', target: 10, label: '❓ Answer 10 Questions' },
      { category: 'questionsAnswered', target: 25, label: '❓ Answer 25 Questions' },
      { category: 'averageScore', target: 70, label: '🎯 Achieve 70% Average' },
      { category: 'averageScore', target: 85, label: '🎯 Achieve 85% Average' },
      { category: 'perfectionRuns', target: 1, label: '💯 Score 100% Once' },
      { category: 'perfectionRuns', target: 3, label: '💯 Score 100% Three Times' },
      { category: 'subjectsExplored', target: 3, label: '🌍 Explore 3 Subjects' }
    ],
    weekly: [
      { category: 'unitsCompleted', target: 10, label: '📚 Complete 10 Units' },
      { category: 'unitsCompleted', target: 20, label: '📚 Complete 20 Units' },
      { category: 'timeSpent', target: 300, label: '⏱️ Study 5 Hours' },
      { category: 'timeSpent', target: 420, label: '⏱️ Study 7 Hours' },
      { category: 'timeSpent', target: 600, label: '⏱️ Study 10 Hours' },
      { category: 'questionsAnswered', target: 50, label: '❓ Answer 50 Questions' },
      { category: 'questionsAnswered', target: 100, label: '❓ Answer 100 Questions' },
      { category: 'averageScore', target: 75, label: '🎯 Maintain 75% Average' },
      { category: 'averageScore', target: 90, label: '🎯 Maintain 90% Average' },
      { category: 'perfectionRuns', target: 5, label: '💯 Score 100% Five Times' },
      { category: 'subjectsExplored', target: 5, label: '🌍 Explore 5 Subjects' }
    ],
    monthly: [
      { category: 'unitsCompleted', target: 50, label: '📚 Complete 50 Units' },
      { category: 'unitsCompleted', target: 100, label: '📚 Complete 100 Units' },
      { category: 'timeSpent', target: 1800, label: '⏱️ Study 30 Hours' },
      { category: 'timeSpent', target: 3000, label: '⏱️ Study 50 Hours' },
      { category: 'questionsAnswered', target: 300, label: '❓ Answer 300 Questions' },
      { category: 'questionsAnswered', target: 500, label: '❓ Answer 500 Questions' },
      { category: 'averageScore', target: 80, label: '🎯 Average 80% This Month' },
      { category: 'averageScore', target: 95, label: '🎯 Average 95% This Month' },
      { category: 'perfectionRuns', target: 10, label: '💯 Score 100% Ten Times' },
      { category: 'subjectsExplored', target: 10, label: '🌍 Explore All Subjects' }
    ]
  },

  async generateAIGoalSuggestions() {
    const goals = JSON.parse(localStorage.getItem('adaptohub_goals'));
    const userProfile = JSON.parse(localStorage.getItem('adaptohubUser') || '{}');
    const recentActivity = JSON.parse(localStorage.getItem('learningHistory') || '[]').slice(-20);

    const prompt = `Based on this user's learning profile, suggest 3 personalized learning goals:
    - Learning Style: ${userProfile.learningStyle || 'Not set'}
    - Current Active Goals: ${goals.active?.length || 0}
    - Recent Activities: ${recentActivity.length} in last period
    - Completed Goals: ${goals.completed?.length || 0}
    
    Suggest goals that are:
    1. Challenging but achievable (not too easy, not impossible)
    2. Aligned with their activity patterns
    3. Progressively building on previous successes
    
    Format: Return a JSON array with goals like:
    [
      { category: "unitsCompleted", target: 5, type: "daily", reason: "Build consistency" },
      { category: "averageScore", target: 85, type: "weekly", reason: "Improve quality" },
      { category: "timeSpent", target: 300, type: "weekly", reason: "Increase volume" }
    ]`;

    try {
      if (window.QuestionGenerator && window.QuestionGenerator.systemPrompt) {
        const suggestions = await this.fetchAISuggestions(prompt);
        return suggestions;
      }
    } catch (err) {
      console.warn('AI suggestions failed, using defaults', err);
    }

    return this.getIntelligentDefaultSuggestions(goals, recentActivity);
  },

  getIntelligentDefaultSuggestions(goals, recentActivity) {
    const suggestions = [];
    const activeGoals = goals.active || [];

    if (recentActivity.length > 10) {
      suggestions.push({
        category: 'timeSpent',
        target: 300,
        type: 'weekly',
        reason: '⏱️ You\'re consistent! Challenge yourself with a weekly study time goal'
      });
    }

    const avgScores = recentActivity.filter(a => a.percentage).map(a => a.percentage);
    if (avgScores.length > 0) {
      const currentAvg = Math.round(avgScores.reduce((a, b) => a + b) / avgScores.length);
      const targetScore = Math.min(100, currentAvg + 10);
      suggestions.push({
        category: 'averageScore',
        target: targetScore,
        type: 'weekly',
        reason: `🎯 Your current average is ${currentAvg}%. Push for ${targetScore}%!`
      });
    }

    suggestions.push({
      category: 'subjectsExplored',
      target: 5,
      type: 'monthly',
      reason: '🌍 Expand your knowledge across different subjects'
    });

    return suggestions;
  },

  async fetchAISuggestions(prompt) {
    return this.getIntelligentDefaultSuggestions(
      JSON.parse(localStorage.getItem('adaptohub_goals')),
      JSON.parse(localStorage.getItem('learningHistory') || '[]')
    );
  },

  showGoalsModal() {
    const modal = document.createElement('div');
    modal.id = 'goals-modal';
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.6); display: flex;
      align-items: center; justify-content: center;
      z-index: 10000; padding: 20px;
    `;

    const goals = JSON.parse(localStorage.getItem('adaptohub_goals'));
    const summary = goalsSystem.getSummary();

    modal.innerHTML = `
      <div style="background: white; border-radius: 16px; max-width: 900px; width: 100%; max-height: 85vh; overflow-y: auto; padding: 32px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <h2 style="margin: 0; color: #1f2933; font-size: 1.8rem;">🎯 Learning Goals</h2>
          <button onclick="document.getElementById('goals-modal')?.remove()" style="background: none; border: none; font-size: 2rem; cursor: pointer; color: #999;">&times;</button>
        </div>

        <!-- Summary Stats -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin-bottom: 24px;">
          <div style="background: linear-gradient(135deg, #0097b2 0%, #00b8d4 100%); color: white; padding: 16px; border-radius: 12px; text-align: center;">
            <div style="font-size: 2rem; font-weight: 700;">${summary.active}</div>
            <div style="font-size: 0.85rem; opacity: 0.9;">Active Goals</div>
          </div>
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 16px; border-radius: 12px; text-align: center;">
            <div style="font-size: 2rem; font-weight: 700;">${summary.completed}</div>
            <div style="font-size: 0.85rem; opacity: 0.9;">Completed</div>
          </div>
          <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 16px; border-radius: 12px; text-align: center;">
            <div style="font-size: 2rem; font-weight: 700;">${summary.longestStreak}</div>
            <div style="font-size: 0.85rem; opacity: 0.9;">Longest Streak</div>
          </div>
          <div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 16px; border-radius: 12px; text-align: center;">
            <div style="font-size: 2rem; font-weight: 700;">${summary.totalRewardsEarned}</div>
            <div style="font-size: 0.85rem; opacity: 0.9;">Points Earned</div>
          </div>
        </div>

        <!-- Create Goal Section -->
        <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin-bottom: 24px;">
          <h3 style="margin: 0 0 16px 0; color: #1f2933; font-size: 1.1rem;">➕ Create New Goal</h3>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 16px;">
            <div>
              <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #636d79;">Type</label>
              <select id="goal-type" style="width: 100%; padding: 10px; border: 1px solid #cbd5e0; border-radius: 8px; font-size: 0.95rem;">
                <option value="daily">Daily Goal</option>
                <option value="weekly">Weekly Goal</option>
                <option value="monthly">Monthly Goal</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #636d79;">Category</label>
              <select id="goal-category" style="width: 100%; padding: 10px; border: 1px solid #cbd5e0; border-radius: 8px; font-size: 0.95rem;">
                <option value="unitsCompleted">📚 Units Completed</option>
                <option value="timeSpent">⏱️ Time Spent (minutes)</option>
                <option value="averageScore">🎯 Average Score (%)</option>
                <option value="questionsAnswered">❓ Questions Answered</option>
                <option value="subjectsExplored">🌍 Subjects Explored</option>
                <option value="perfectionRuns">💯 Perfect Scores</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #636d79;">Target</label>
              <input type="number" id="goal-target" placeholder="Enter target" style="width: 100%; padding: 10px; border: 1px solid #cbd5e0; border-radius: 8px; font-size: 0.95rem;">
            </div>
          </div>

          <button onclick="GoalsUI.createGoalFromForm()" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #0097b2 0%, #00b8d4 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; margin-bottom: 12px;">
            Create Goal
          </button>

          <!-- Preset Quick Goals -->
          <div style="margin-top: 12px;">
            <label style="display: block; font-weight: 600; margin-bottom: 8px; color: #636d79; font-size: 0.9rem;">Quick Presets</label>
            <div id="preset-goals" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 8px;"></div>
          </div>
        </div>

        <!-- AI Suggestions -->
        <div style="background: linear-gradient(135deg, #f3f0ff 0%, #ede9fe 100%); padding: 20px; border-radius: 12px; border-left: 4px solid #8b5cf6; margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <h3 style="margin: 0; color: #1f2933; font-size: 1.1rem;">✨ AI-Powered Suggestions</h3>
            <button onclick="GoalsUI.refreshAISuggestions()" style="background: #8b5cf6; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.85rem;">Refresh</button>
          </div>
          <div id="ai-suggestions" style="display: grid; gap: 12px;"></div>
        </div>

        <!-- Active Goals -->
        <div style="margin-bottom: 24px;">
          <h3 style="margin: 0 0 12px 0; color: #1f2933; font-size: 1.1rem;">🎯 Your Active Goals</h3>
          <div id="active-goals" style="display: grid; gap: 12px;">
            ${goals.active && goals.active.length > 0 
              ? goals.active.map(goal => this.renderGoalCard(goal)).join('')
              : '<p style="color: #999;">No active goals. Create one to get started!</p>'
            }
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.updatePresetGoals();
    this.updateAISuggestions();
  },

  updatePresetGoals() {
    const type = document.getElementById('goal-type')?.value || 'daily';
    const presets = this.goalPresets[type];
    const container = document.getElementById('preset-goals');
    
    if (container && presets) {
      container.innerHTML = presets.map(preset => `
        <button onclick="GoalsUI.quickCreateGoal('${preset.category}', ${preset.target}, '${type}')" 
          style="padding: 10px 8px; background: white; border: 1px solid #cbd5e0; border-radius: 8px; cursor: pointer; font-size: 0.8rem; font-weight: 600; transition: all 0.2s;"
          onmouseover="this.style.background='#e8f5e9'; this.style.borderColor='#10b981';"
          onmouseout="this.style.background='white'; this.style.borderColor='#cbd5e0';">
          ${preset.label}
        </button>
      `).join('');
    }
  },

  async updateAISuggestions() {
    const container = document.getElementById('ai-suggestions');
    if (!container) return;

    container.innerHTML = '<p style="color: #999;">Loading AI suggestions...</p>';
    const suggestions = await this.generateAIGoalSuggestions();
    
    container.innerHTML = suggestions.map(suggestion => `
      <div style="background: white; padding: 12px; border-radius: 8px; border-left: 3px solid #8b5cf6; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-weight: 600; color: #1f2933; margin-bottom: 4px;">${suggestion.reason}</div>
          <div style="font-size: 0.85rem; color: #636d79;">Target: ${suggestion.target} • Duration: ${suggestion.type}</div>
        </div>
        <button onclick="GoalsUI.quickCreateGoal('${suggestion.category}', ${suggestion.target}, '${suggestion.type}')" 
          style="background: #8b5cf6; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-weight: 600; white-space: nowrap;">
          Create
        </button>
      </div>
    `).join('');
  },

  quickCreateGoal(category, target, type) {
    goalsSystem.createGoal(category, target, type);
    this.showGoalsModal(); 
  },

  createGoalFromForm() {
    const type = document.getElementById('goal-type')?.value || 'daily';
    const category = document.getElementById('goal-category')?.value || 'unitsCompleted';
    const target = parseInt(document.getElementById('goal-target')?.value || '0');

    if (target > 0) {
      goalsSystem.createGoal(category, target, type);
      this.showGoalsModal();
    } else {
      alert('Please enter a valid target');
    }
  },

  refreshAISuggestions() {
    this.updateAISuggestions();
  },

  renderGoalCard(goal) {
    const categoryName = goalsSystem.goalCategories[goal.category];
    const daysLeft = Math.ceil((goal.dueDate - Date.now()) / (1000 * 60 * 60 * 24));
    
    return `
      <div style="background: white; border: 2px solid #e0e0e0; border-radius: 12px; padding: 16px; transition: all 0.2s;">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
          <div>
            <h4 style="margin: 0 0 4px 0; color: #1f2933; font-size: 1rem;">${categoryName}</h4>
            <p style="margin: 0; color: #999; font-size: 0.85rem;">${goalsSystem.goalTypes[goal.type].name}</p>
          </div>
          <div style="text-align: right;">
            <span style="background: #0097b2; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; display: inline-block;">+${goal.reward} pts</span>
          </div>
        </div>
        
        <div style="margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 6px;">
            <span>${goal.current}/${goal.target}</span>
            <span style="color: #0097b2; font-weight: 600;">${goal.progress}%</span>
          </div>
          <div style="background: #e0e0e0; height: 8px; border-radius: 4px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #0097b2 0%, #00b8d4 100%); height: 100%; width: ${goal.progress}%; transition: width 0.3s;"></div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: #636d79;">
          <span>${daysLeft > 0 ? daysLeft + ' days left' : 'Due today'}</span>
          <button onclick="goalsSystem.completeGoal('${goal.id}'); GoalsUI.showGoalsModal();" style="background: none; border: none; color: #0097b2; font-weight: 600; cursor: pointer;">Mark Complete</button>
        </div>
      </div>
    `;
  }
};

window.GoalsUI = GoalsUI;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = GoalsSystem;
}
