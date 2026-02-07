class AnalyticsSystem {
  constructor() {
    this.timeTrackingKey = 'adaptohub_time_tracking';
    this.performanceKey = 'adaptohub_performance_data';
    this.sessionStartKey = 'adaptohub_session_start';
    this.goalsAnalyticsKey = 'adaptohub_goals_analytics';
    this.snapshotsKey = 'adaptohub_analytics_snapshots';
    this.trendsKey = 'adaptohub_analytics_trends';
    
    this.initializeData();
    this.createDailySnapshot();
  }

  initializeData() {
    if (!localStorage.getItem(this.timeTrackingKey)) {
      localStorage.setItem(this.timeTrackingKey, JSON.stringify({
        daily: {},
        weekly: {},
        monthly: {},
        allTime: 0
      }));
    }

    if (!localStorage.getItem(this.performanceKey)) {
      localStorage.setItem(this.performanceKey, JSON.stringify({
        subjects: {},
        trends: []
      }));
    }

    if (!localStorage.getItem(this.goalsAnalyticsKey)) {
      localStorage.setItem(this.goalsAnalyticsKey, JSON.stringify({
        created: [],
        completed: [],
        failed: [],
        totalCreated: 0,
        totalCompleted: 0,
        totalFailed: 0,
        byCategory: {},
        byType: {},
        completionRate: 0,
        averageCompletionTime: 0
      }));
    }

    if (!localStorage.getItem(this.snapshotsKey)) {
      localStorage.setItem(this.snapshotsKey, JSON.stringify({
        daily: [],
        weekly: [],
        monthly: []
      }));
    }

    if (!localStorage.getItem(this.trendsKey)) {
      localStorage.setItem(this.trendsKey, JSON.stringify({
        performanceVelocity: [],
        timeSpentVelocity: [],
        goalsCompletionVelocity: [],
        learningPatterns: {},
        anomalies: []
      }));
    }
  }

  startSession(subject, module) {
    const now = Date.now();
    sessionStorage.setItem(`${this.sessionStartKey}_${subject}_${module}`, now);
  }

  endSession(subject, module) {
    const startKey = `${this.sessionStartKey}_${subject}_${module}`;
    const startTime = parseInt(sessionStorage.getItem(startKey) || Date.now());
    const duration = Math.round((Date.now() - startTime) / 1000);

    sessionStorage.removeItem(startKey);

    if (duration > 0) {
      this.recordTimeSpent(subject, module, duration);
    }

    return duration;
  }

  recordTimeSpent(subject, module, seconds) {
    const tracking = JSON.parse(localStorage.getItem(this.timeTrackingKey));
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const week = this.getWeekKey(now);
    const month = now.toISOString().substring(0, 7);

    const key = `${subject}_${module}`;

    if (!tracking.daily[date]) tracking.daily[date] = {};
    if (!tracking.daily[date][key]) tracking.daily[date][key] = 0;
    tracking.daily[date][key] += seconds;

    if (!tracking.weekly[week]) tracking.weekly[week] = {};
    if (!tracking.weekly[week][key]) tracking.weekly[week][key] = 0;
    tracking.weekly[week][key] += seconds;

    if (!tracking.monthly[month]) tracking.monthly[month] = {};
    if (!tracking.monthly[month][key]) tracking.monthly[month][key] = 0;
    tracking.monthly[month][key] += seconds;

    tracking.allTime += seconds;

    localStorage.setItem(this.timeTrackingKey, JSON.stringify(tracking));

    this.updatePerformanceMetrics(subject, module);
  }

  getTimeSpent(subject, module, period = 'all') {
    const tracking = JSON.parse(localStorage.getItem(this.timeTrackingKey));
    const key = `${subject}_${module}`;

    if (period === 'all') {
      return tracking.allTime || 0;
    }

    if (period === 'today') {
      const date = new Date().toISOString().split('T')[0];
      return (tracking.daily[date] && tracking.daily[date][key]) || 0;
    }

    if (period === 'week') {
      const week = this.getWeekKey(new Date());
      return (tracking.weekly[week] && tracking.weekly[week][key]) || 0;
    }

    if (period === 'month') {
      const month = new Date().toISOString().substring(0, 7);
      return (tracking.monthly[month] && tracking.monthly[month][key]) || 0;
    }

    return 0;
  }

  getTimeChartData(period = 'week') {
    const tracking = JSON.parse(localStorage.getItem(this.timeTrackingKey));
    const data = {};

    if (period === 'day') {
      const date = new Date().toISOString().split('T')[0];
      const daily = tracking.daily[date] || {};
      
      Object.keys(daily).forEach(key => {
        data[key] = daily[key];
      });
    }

    if (period === 'week') {
      const subjects = {};
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const daily = tracking.daily[dateStr] || {};

        Object.keys(daily).forEach(key => {
          if (!subjects[key]) subjects[key] = [];
          subjects[key].push(daily[key]);
        });
      }
      return subjects;
    }

    if (period === 'month') {
      const month = new Date().toISOString().substring(0, 7);
      const monthly = tracking.monthly[month] || {};

      Object.keys(monthly).forEach(key => {
        data[key] = monthly[key];
      });
    }

    return data;
  }

  recordQuizCompletion(subject, module, unitId, score, timeTaken) {
    const data = JSON.parse(localStorage.getItem(this.performanceKey));
    const key = `${subject}_${module}`;

    if (!data.subjects[key]) {
      data.subjects[key] = {
        completions: [],
        avgScore: 0,
        bestScore: 0,
        attempts: 0
      };
    }

    const completion = {
      timestamp: Date.now(),
      unitId,
      score,
      timeTaken,
      date: new Date().toISOString().split('T')[0]
    };

    data.subjects[key].completions.push(completion);
    data.subjects[key].attempts++;

    const scores = data.subjects[key].completions.map(c => c.score);
    data.subjects[key].avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    data.subjects[key].bestScore = Math.max(...scores);

    data.trends.push({
      timestamp: Date.now(),
      subject: key,
      score,
      date: new Date().toISOString().split('T')[0]
    });

    localStorage.setItem(this.performanceKey, JSON.stringify(data));
  }

  updatePerformanceMetrics(subject, module) {
    const progress = JSON.parse(localStorage.getItem(`adaptohub_${module}_units`) || '{}');
    const data = JSON.parse(localStorage.getItem(this.performanceKey));
    const key = `${subject}_${module}`;

    if (!data.subjects[key]) {
      data.subjects[key] = {};
    }

    const completed = Object.values(progress).filter(u => u.completed);
    const scores = completed.map(u => u.score).filter(s => typeof s === 'number');

    data.subjects[key].completion = Math.round((completed.length / Object.keys(progress).length) * 100) || 0;
    data.subjects[key].avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    data.subjects[key].strengthWeakness = this.analyzeStrengthWeakness(subject, module);

    localStorage.setItem(this.performanceKey, JSON.stringify(data));
  }

  analyzeStrengthWeakness(subject, module) {
    const progress = JSON.parse(localStorage.getItem(`adaptohub_${module}_units`) || '{}');
    const analysis = {
      strengths: [],
      weaknesses: [],
      neutral: []
    };

    Object.entries(progress).forEach(([unitId, data]) => {
      if (data.completed) {
        const score = data.score || 0;
        if (score >= 80) {
          analysis.strengths.push({ unit: unitId, score });
        } else if (score < 60) {
          analysis.weaknesses.push({ unit: unitId, score });
        } else {
          analysis.neutral.push({ unit: unitId, score });
        }
      }
    });

    return analysis;
  }

  getHeatMapData(subject) {
    const data = JSON.parse(localStorage.getItem(this.performanceKey));
    const subjects = {};

    Object.keys(data.subjects).forEach(key => {
      if (key.startsWith(subject)) {
        const analysis = data.subjects[key].strengthWeakness;
        subjects[key] = {
          strength: analysis.strengths.length,
          weakness: analysis.weaknesses.length,
          neutral: analysis.neutral.length,
          avgScore: data.subjects[key].avgScore || 0
        };
      }
    });

    return subjects;
  }

  getPerformanceTrends(days = 30) {
    const data = JSON.parse(localStorage.getItem(this.performanceKey));
    const cutoffDate = Date.now() - (days * 24 * 60 * 60 * 1000);
    
    return data.trends
      .filter(t => t.timestamp >= cutoffDate)
      .reduce((acc, trend) => {
        if (!acc[trend.subject]) {
          acc[trend.subject] = [];
        }
        acc[trend.subject].push(trend);
        return acc;
      }, {});
  }

  predictMasteryTimeline(subject, module) {
    const progress = JSON.parse(localStorage.getItem(`adaptohub_${module}_units`) || '{}');
    const tracking = JSON.parse(localStorage.getItem(this.timeTrackingKey));
    const key = `${subject}_${module}`;

    const total = Object.keys(progress).length;
    const completed = Object.values(progress).filter(u => u.completed).length;
    const timePerUnit = this.estimateTimePerUnit(subject, module);
    
    const remaining = total - completed;
    const estimatedTimeMinutes = (remaining * timePerUnit) / 60;

    return {
      completed,
      total,
      percentComplete: Math.round((completed / total) * 100),
      estimatedDaysToMastery: Math.ceil(estimatedTimeMinutes / (60 * 2)), 
      currentPace: timePerUnit,
      masteryThreshold: 80 
    };
  }

  estimateTimePerUnit(subject, module) {
    const tracking = JSON.parse(localStorage.getItem(this.timeTrackingKey));
    const progress = JSON.parse(localStorage.getItem(`adaptohub_${module}_units`) || '{}');
    const key = `${subject}_${module}`;

    const completed = Object.values(progress).filter(u => u.completed).length;
    if (completed === 0) return 30; 

    const totalTimeSeconds = tracking.allTime || 0;
    return totalTimeSeconds / completed;
  }

  formatTime(seconds) {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.round((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }

  getWeekKey(date) {
    const d = new Date(date);
    const week = Math.ceil((d.getDate() - d.getDay()) / 7);
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    return `${year}-${String(month).padStart(2, '0')}-W${week}`;
  }

  getSubjectSummary(subject) {
    const data = JSON.parse(localStorage.getItem(this.performanceKey));
    const summary = {};

    Object.keys(data.subjects).forEach(key => {
      if (key.startsWith(subject)) {
        summary[key] = {
          avgScore: data.subjects[key].avgScore || 0,
          completion: data.subjects[key].completion || 0,
          attempts: data.subjects[key].attempts || 0,
          timeSpent: this.getTimeSpent(subject, key.split('_')[1], 'all')
        };
      }
    });

    return summary;
  }

  recordGoalCreation(goalData) {
    const analytics = JSON.parse(localStorage.getItem(this.goalsAnalyticsKey));
    
    const goalRecord = {
      goalId: goalData.goalId,
      category: goalData.category,
      target: goalData.target,
      type: goalData.type,
      subject: goalData.subject,
      module: goalData.module,
      createdAt: goalData.createdAt,
      fromSuggestion: goalData.fromSuggestion || false
    };
    
    analytics.created.push(goalRecord);
    analytics.totalCreated++;
    
    if (!analytics.byCategory[goalData.category]) {
      analytics.byCategory[goalData.category] = { created: 0, completed: 0, failed: 0 };
    }
    analytics.byCategory[goalData.category].created++;
    
    if (!analytics.byType[goalData.type]) {
      analytics.byType[goalData.type] = { created: 0, completed: 0, failed: 0 };
    }
    analytics.byType[goalData.type].created++;
    
    localStorage.setItem(this.goalsAnalyticsKey, JSON.stringify(analytics));
    
    return goalRecord;
  }

  recordGoalCompletion(goalData) {
    const analytics = JSON.parse(localStorage.getItem(this.goalsAnalyticsKey));
    
    const completionRecord = {
      goalId: goalData.goalId,
      category: goalData.category,
      completedAt: Date.now(),
      timeTaken: goalData.completedAt - goalData.createdAt,
      target: goalData.target,
      type: goalData.type
    };
    
    analytics.completed.push(completionRecord);
    analytics.totalCompleted++;
    
    if (analytics.byCategory[goalData.category]) {
      analytics.byCategory[goalData.category].completed++;
    }
    
    if (analytics.byType[goalData.type]) {
      analytics.byType[goalData.type].completed++;
    }
    
    analytics.completionRate = Math.round((analytics.totalCompleted / analytics.totalCreated) * 100);
    
    const totalTime = analytics.completed.reduce((sum, g) => sum + g.timeTaken, 0);
    analytics.averageCompletionTime = analytics.completed.length > 0 ? totalTime / analytics.completed.length : 0;
    
    localStorage.setItem(this.goalsAnalyticsKey, JSON.stringify(analytics));
    
    return completionRecord;
  }

  recordGoalFailure(goalData) {
    const analytics = JSON.parse(localStorage.getItem(this.goalsAnalyticsKey));
    
    const failureRecord = {
      goalId: goalData.goalId,
      category: goalData.category,
      failedAt: Date.now(),
      target: goalData.target,
      current: goalData.current,
      type: goalData.type
    };
    
    analytics.failed.push(failureRecord);
    analytics.totalFailed++;
    
    if (analytics.byCategory[goalData.category]) {
      analytics.byCategory[goalData.category].failed++;
    }
    
    if (analytics.byType[goalData.type]) {
      analytics.byType[goalData.type].failed++;
    }
    
    analytics.completionRate = Math.round((analytics.totalCompleted / analytics.totalCreated) * 100);
    
    localStorage.setItem(this.goalsAnalyticsKey, JSON.stringify(analytics));
    
    return failureRecord;
  }

  getGoalsAnalytics() {
    return JSON.parse(localStorage.getItem(this.goalsAnalyticsKey));
  }

  getGoalsByCategory() {
    const analytics = JSON.parse(localStorage.getItem(this.goalsAnalyticsKey));
    return analytics.byCategory;
  }

  getGoalsByType() {
    const analytics = JSON.parse(localStorage.getItem(this.goalsAnalyticsKey));
    return analytics.byType;
  }

  getGoalCompletionRate() {
    const analytics = JSON.parse(localStorage.getItem(this.goalsAnalyticsKey));
    return analytics.completionRate;
  }

  getAverageGoalCompletionTime() {
    const analytics = JSON.parse(localStorage.getItem(this.goalsAnalyticsKey));
    return analytics.averageCompletionTime;
  }
  createDailySnapshot() {
    const today = new Date().toISOString().split('T')[0];
    const snapshots = JSON.parse(localStorage.getItem(this.snapshotsKey)) || { daily: [], weekly: [], monthly: [] };
    const existingDaily = snapshots.daily.find(s => s.date === today);
    if (existingDaily) return;
    
    const snapshot = {
      date: today,
      timestamp: Date.now(),
      timeSpent: this.getTotalTimeSpent(),
      avgScore: this.getAverageScore(),
      goalsCompleted: this.getGoalCompletionRate(),
      sessions: this.getSessionCountForDate(today)
    };
    
    snapshots.daily.push(snapshot);
    if (snapshots.daily.length > 90) {
      snapshots.daily = snapshots.daily.slice(-90);
    }
    localStorage.setItem(this.snapshotsKey, JSON.stringify(snapshots));
    this.calculateTrends();
  }

  calculateTrends() {
    const snapshots = JSON.parse(localStorage.getItem(this.snapshotsKey)) || { daily: [], weekly: [], monthly: [] };
    const trends = JSON.parse(localStorage.getItem(this.trendsKey)) || {
      performanceVelocity: [],
      timeSpentVelocity: [],
      goalsCompletionVelocity: [],
      learningPatterns: {},
      anomalies: []
    };

    if (snapshots.daily.length < 2) return;

    const today = new Date().toISOString().split('T')[0];
    const recent = snapshots.daily.slice(-7);

    if (recent.length > 1) {
      const firstScore = recent[0].avgScore || 0;
      const lastScore = recent[recent.length - 1].avgScore || 0;
      trends.performanceVelocity.push({
        date: today,
        velocity: parseFloat(((lastScore - firstScore) / 7).toFixed(2))
      });

      const firstTime = recent[0].timeSpent || 0;
      const lastTime = recent[recent.length - 1].timeSpent || 0;
      trends.timeSpentVelocity.push({
        date: today,
        velocity: parseFloat(((lastTime - firstTime) / 7).toFixed(2))
      });

      const firstGoals = recent[0].goalsCompleted || 0;
      const lastGoals = recent[recent.length - 1].goalsCompleted || 0;
      trends.goalsCompletionVelocity.push({
        date: today,
        velocity: parseFloat(((lastGoals - firstGoals) / 7).toFixed(2))
      });
    }

    trends.performanceVelocity = trends.performanceVelocity.slice(-30);
    trends.timeSpentVelocity = trends.timeSpentVelocity.slice(-30);
    trends.goalsCompletionVelocity = trends.goalsCompletionVelocity.slice(-30);

    localStorage.setItem(this.trendsKey, JSON.stringify(trends));
  }
  
  getSnapshots(type = 'daily', days = 30) {
    const snapshots = JSON.parse(localStorage.getItem(this.snapshotsKey)) || { daily: [], weekly: [], monthly: [] };
    let data = snapshots[type] || [];
    if (days && data.length > days) {
      data = data.slice(-days);
    }
    return data;
  }
  
  getTrends() {
    return JSON.parse(localStorage.getItem(this.trendsKey)) || {
      performanceVelocity: [],
      timeSpentVelocity: [],
      goalsCompletionVelocity: [],
      learningPatterns: {},
      anomalies: []
    };
  }
  
  getPerformanceVelocity() {
    const trends = this.getTrends();
    const velocities = trends.performanceVelocity || [];
    if (velocities.length === 0) return 0;
    const recent = velocities.slice(-7);
    const avg = recent.reduce((sum, v) => sum + v.velocity, 0) / recent.length;
    return parseFloat(avg.toFixed(2));
  }

  getTimeVelocity() {
    const trends = this.getTrends();
    const velocities = trends.timeSpentVelocity || [];
    if (velocities.length === 0) return 0;
    const recent = velocities.slice(-7);
    const avg = recent.reduce((sum, v) => sum + v.velocity, 0) / recent.length;
    return parseFloat(avg.toFixed(2));
  }

  getGoalsCompletionVelocity() {
    const trends = this.getTrends();
    const velocities = trends.goalsCompletionVelocity || [];
    if (velocities.length === 0) return 0;
    const recent = velocities.slice(-7);
    const avg = recent.reduce((sum, v) => sum + v.velocity, 0) / recent.length;
    return parseFloat(avg.toFixed(2));
  }
  
  getAverageScore() {
    const data = JSON.parse(localStorage.getItem(this.performanceKey)) || { subjects: {} };
    const scores = Object.values(data.subjects || {}).filter(s => s.avgScore).map(s => s.avgScore);
    if (scores.length === 0) return 0;
    return parseFloat((scores.reduce((a, b) => a + b) / scores.length).toFixed(2));
  }
  
  getTotalTimeSpent() {
    const tracking = JSON.parse(localStorage.getItem(this.timeTrackingKey)) || { allTime: 0 };
    return tracking.allTime || 0;
  }
  
  getSessionCountForDate(date) {
    const tracking = JSON.parse(localStorage.getItem(this.timeTrackingKey)) || { daily: {} };
    const daily = tracking.daily[date] || {};
    return Object.keys(daily).length;
  }
  
  exportAnalytics(format = 'json') {
    const data = {
      exported: new Date().toISOString(),
      timeTracking: JSON.parse(localStorage.getItem(this.timeTrackingKey)) || {},
      performance: JSON.parse(localStorage.getItem(this.performanceKey)) || {},
      goals: JSON.parse(localStorage.getItem(this.goalsAnalyticsKey)) || {},
      snapshots: JSON.parse(localStorage.getItem(this.snapshotsKey)) || {},
      trends: JSON.parse(localStorage.getItem(this.trendsKey)) || {}
    };
    if (format === 'csv') {
      return this.convertToCSV(data);
    }
    return JSON.stringify(data, null, 2);
  }
  
  convertToCSV(data) {
    let csv = 'Analytics Export - ' + new Date().toISOString() + '\n\n';
    csv += 'DAILY SNAPSHOTS\n';
    csv += 'Date,TimeSpent(mins),AvgScore,GoalsCompleted,Sessions\n';
    (data.snapshots.daily || []).forEach(s => {
      csv += `${s.date},${Math.round(s.timeSpent/60)},${s.avgScore},${s.goalsCompleted},${s.sessions}\n`;
    });
    csv += '\nGOAL STATISTICS\n';
    csv += 'Category,Created,Completed,Failed,CompletionRate\n';
    Object.entries(data.goals.byCategory || {}).forEach(([cat, stats]) => {
      csv += `${cat},${stats.created || 0},${stats.completed || 0},${stats.failed || 0},${data.goals.completionRate || 0}%\n`;
    });
    return csv;
  }
}

const analyticsSystem = new AnalyticsSystem();

if (typeof window !== 'undefined') {
  const originalRecordCompletion = window.recordQuizCompletion;
  window.recordQuizCompletion = function(subject, module, unitId, score, timeTaken) {
    if (originalRecordCompletion) originalRecordCompletion.call(this, subject, module, unitId, score, timeTaken);
    analyticsSystem.recordQuizCompletion(subject, module, unitId, score, timeTaken);
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AnalyticsSystem;
}