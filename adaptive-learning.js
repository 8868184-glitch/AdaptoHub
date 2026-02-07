class AdaptiveLearningSystem {
  constructor(subject) {
    this.subject = subject;
    this.storageKey = `adaptohub_${subject}_data`;
    this.loadStudentData();
  }
  loadStudentData() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      const data = JSON.parse(saved);
      this.studentData = data;
    } else {
      this.studentData = {
        completedModules: [],
        completedActivities: {},
        scores: {},
        difficulty: 'easy',
        totalTimeSpent: 0,
        currentStreak: 0,
        lastAccessDate: new Date().toDateString(),
        masteryLevel: 'Beginner',
        learningPath: []
      };
      this.saveStudentData();
    }
  }
  saveStudentData() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.studentData));
  }
  recordActivity(moduleId, score) {
    if (!this.studentData.scores[moduleId]) {
      this.studentData.scores[moduleId] = [];
    }
    this.studentData.scores[moduleId].push(score);
    const avgScore = this.studentData.scores[moduleId].reduce((a, b) => a + b, 0) / this.studentData.scores[moduleId].length;
    if (avgScore >= 90 && this.studentData.difficulty !== 'hard') {
      this.studentData.difficulty = 'hard';
    } else if (avgScore >= 75 && this.studentData.difficulty === 'easy') {
      this.studentData.difficulty = 'medium';
    } else if (avgScore < 70 && this.studentData.difficulty !== 'easy') {
      this.studentData.difficulty = 'easy';
    }
    const today = new Date().toDateString();
    if (this.studentData.lastAccessDate === today) {
      this.studentData.currentStreak++;
    } else {
      this.studentData.currentStreak = 1;
      this.studentData.lastAccessDate = today;
    }
    this.updateMasteryLevel();
    this.saveStudentData();
  }
  updateMasteryLevel() {
    const avgScores = Object.values(this.studentData.scores).map(scores => 
      scores.reduce((a, b) => a + b, 0) / scores.length
    );
    if (avgScores.length === 0) {
      this.studentData.masteryLevel = 'Beginner';
    } else {
      const overallAvg = avgScores.reduce((a, b) => a + b, 0) / avgScores.length;
      if (overallAvg >= 90) {
        this.studentData.masteryLevel = 'Master';
      } else if (overallAvg >= 80) {
        this.studentData.masteryLevel = 'Advanced';
      } else if (overallAvg >= 70) {
        this.studentData.masteryLevel = 'Intermediate';
      } else {
        this.studentData.masteryLevel = 'Beginner';
      }
    }
  }
  getProgressPercentage() {
    const completedCount = this.studentData.completedModules.length;
    const totalModules = this.getModules().length;
    return totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;
  }
  getAverageScore() {
    const allScores = Object.values(this.studentData.scores).flat();
    if (allScores.length === 0) return 0;
    return Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);
  }
  generateRecommendation() {
    const modules = this.getModules();
    let recommendation = '';
    if (this.studentData.masteryLevel === 'Beginner') {
      recommendation = 'Start with foundational concepts. Build a strong understanding of basics before moving to advanced topics.';
    } else if (this.studentData.masteryLevel === 'Intermediate') {
      recommendation = 'You\'re making good progress! Continue with intermediate topics and challenge yourself with more complex problems.';
    } else if (this.studentData.masteryLevel === 'Advanced') {
      recommendation = 'Excellent work! You\'re ready for advanced topics. Focus on application and problem-solving.';
    } else if (this.studentData.masteryLevel === 'Master') {
      recommendation = 'Outstanding performance! You\'ve mastered this subject. Consider mentoring others or exploring advanced extensions.';
    }

    return recommendation;
  }
  getModules() {
    const modules = {
      science: [
        { id: 'biology', name: 'Biology' },
        { id: 'chemistry', name: 'Chemistry' },
        { id: 'physics', name: 'Physics' }
      ],
      mathematics: [
        { id: 'pure', name: 'Pure Mathematics' },
        { id: 'applied', name: 'Applied Mathematics & Analysis' }
      ],
      social_studies: [
        { id: 'geography', name: 'Geography' },
        { id: 'history', name: 'History' },
        { id: 'civics', name: 'Civics' },
        { id: 'economics', name: 'Economics' },
        { id: 'culture', name: 'Cultural Studies' }
      ]
    };
    return modules[this.subject] || [];
  }
}
let adaptiveInstance = null;
function showLoadingScreen() {
  const loadingScreen = document.getElementById('loadingScreen');
  if (loadingScreen) {
    loadingScreen.style.display = 'flex';
  }
}
function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loadingScreen');
  if (loadingScreen) {
    loadingScreen.style.display = 'none';
  }
}
function initializeAdaptiveLearning(subject) {
  adaptiveInstance = new AdaptiveLearningSystem(subject);
  renderModules();
  updateDashboard();
}
function getModuleData(subject, moduleId) {
  const moduleDetails = {
    science: {
      biology: {
        name: '🧬 Biology',
        fullDescription: 'Launch the A-level Biology pathway with sequenced lessons on life processes, cells, biodiversity, homeostasis, biochemistry, and body systems.',
        difficulty: 'medium',
        activities: [
          { id: 'act1', title: 'Cell Structure Quiz', description: 'Test your knowledge on cell organelles and their functions.' },
          { id: 'act2', title: 'Ecosystem Mapping', description: 'Create a food web for your local ecosystem.' },
          { id: 'act3', title: 'Photosynthesis Experiment', description: 'Understand the process of photosynthesis through interactive simulations.' }
        ]
      },
      chemistry: {
        name: '⚗️ Chemistry',
        fullDescription: 'Launch the A-level Chemistry pathway with sequenced lessons on safety, atoms, moles, periodic table, bonding, and gases.',
        difficulty: 'hard',
        activities: [
          { id: 'act1', title: 'Periodic Table Mastery', description: 'Learn element properties and trends.' },
          { id: 'act2', title: 'Chemical Reactions Lab', description: 'Explore different types of chemical reactions.' },
          { id: 'act3', title: 'Molecule Building', description: 'Build 3D molecular structures.' }
        ]
      },
      physics: {
        name: '⚡ Physics',
        fullDescription: 'Launch the A-level Physics pathway with sequenced lessons and quizzes across motion, forces, energy, and advanced topics.',
        difficulty: 'hard',
        activities: [
          { id: 'act1', title: 'Forces and Motion', description: 'Apply Newton\'s laws to solve real-world problems.' },
          { id: 'act2', title: 'Energy Conservation', description: 'Explore potential and kinetic energy.' },
          { id: 'act3', title: 'Waves and Sound', description: 'Understand wave properties and sound.' }
        ]
      }
    },
    mathematics: {
      pure: {
        name: '📐 Pure Mathematics',
        fullDescription: 'Focus on algebraic structures, functions, and proof-based fluency.',
        difficulty: 'medium',
        activities: [
          { id: 'act1', title: 'Foundations & Notation', description: 'Simplify expressions and apply exponent laws.' },
          { id: 'act2', title: 'Functions & Graphs', description: 'Interpret domain, range, and transformations.' },
          { id: 'act3', title: 'Polynomials & Factorization', description: 'Factor polynomials and solve equations.' }
        ]
      },
      applied: {
        name: '⚙️ Applied Mathematics & Analysis',
        fullDescription: 'Use calculus, statistics, and modeling to solve real-world problems.',
        difficulty: 'hard',
        activities: [
          { id: 'act1', title: 'Modeling & Rates of Change', description: 'Connect derivatives to motion and growth.' },
          { id: 'act2', title: 'Data, Probability, and Inference', description: 'Work with distributions and simple inference.' },
          { id: 'act3', title: 'Differential Equations & Numerics', description: 'Set up simple ODEs and approximate solutions.' }
        ]
      }
    },
    social_studies: {
      geography: {
        name: '🗺️ Geography',
        fullDescription: 'Study Earth\'s landforms, climates, and human settlements.',
        difficulty: 'easy',
        activities: [
          { id: 'act1', title: 'Map Reading', description: 'Learn to read and interpret maps.' },
          { id: 'act2', title: 'Climate Zones', description: 'Understand different climate classifications.' },
          { id: 'act3', title: 'Population Distribution', description: 'Analyze patterns of human settlement.' }
        ]
      },
      history: {
        name: '📚 History',
        fullDescription: 'Explore significant events and civilizations throughout time.',
        difficulty: 'medium',
        activities: [
          { id: 'act1', title: 'Ancient Civilizations', description: 'Study major ancient societies.' },
          { id: 'act2', title: 'World Wars', description: 'Analyze causes and consequences.' },
          { id: 'act3', title: 'Modern History', description: 'Understand contemporary historical events.' }
        ]
      },
      civics: {
        name: '⚖️ Civics',
        fullDescription: 'Learn about government, citizenship, and democracy.',
        difficulty: 'medium',
        activities: [
          { id: 'act1', title: 'Government Systems', description: 'Compare different forms of government.' },
          { id: 'act2', title: 'Rights and Responsibilities', description: 'Understand civic duties.' },
          { id: 'act3', title: 'Electoral Process', description: 'Learn how democratic elections work.' }
        ]
      },
      economics: {
        name: '💰 Economics',
        fullDescription: 'Study production, trade, and resource allocation.',
        difficulty: 'hard',
        activities: [
          { id: 'act1', title: 'Supply and Demand', description: 'Understand market mechanisms.' },
          { id: 'act2', title: 'Economic Systems', description: 'Compare capitalism, socialism, and mixed economies.' },
          { id: 'act3', title: 'Personal Finance', description: 'Learn budgeting and investing.' }
        ]
      },
      culture: {
        name: '🌏 Cultural Studies',
        fullDescription: 'Explore diverse cultures, traditions, and societies.',
        difficulty: 'easy',
        activities: [
          { id: 'act1', title: 'Cultural Traditions', description: 'Research customs from different cultures.' },
          { id: 'act2', title: 'Languages and Communication', description: 'Learn about linguistic diversity.' },
          { id: 'act3', title: 'Art and Music', description: 'Explore cultural artistic expressions.' }
        ]
      }
    }
  };

  return moduleDetails[subject]?.[moduleId] || {};
}
function renderModules() {
  if (!adaptiveInstance) return;

  const container = document.getElementById('modulesContainer');
  if (!container) return;

  container.innerHTML = '';
  const modules = adaptiveInstance.getModules();

  modules.forEach(module => {
    const moduleData = getModuleData(adaptiveInstance.subject, module.id);
    
    const difficulty = moduleData.difficulty || 'medium';
    const isPhysicsModule = adaptiveInstance.subject === 'science' && module.id === 'physics';
    const isChemistryModule = adaptiveInstance.subject === 'science' && module.id === 'chemistry';
    const isBiologyModule = adaptiveInstance.subject === 'science' && module.id === 'biology';
    const isPureMathModule = adaptiveInstance.subject === 'mathematics' && module.id === 'pure';
    const isAppliedMathModule = adaptiveInstance.subject === 'mathematics' && module.id === 'applied';

    let badgeText = 'Not started';
    let badgeStyle = 'font-size: 0.9rem; color: #0097b2; font-weight: 600;';
    
    if (isPhysicsModule) {
      const progress = JSON.parse(localStorage.getItem('adaptohub_physics_units') || '{}');
      const completedUnits = Object.values(progress).filter(u => u.completed);
      if (completedUnits.length > 0) {
        const scores = completedUnits.map(u => u.score).filter(s => typeof s === 'number');
        const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        badgeText = `${avgScore}% avg • ${completedUnits.length}/7 units`;
        badgeStyle = 'font-size: 0.9rem; font-weight: 600; background: linear-gradient(135deg, #4caf50 0%, #45a049 100%); color: white; padding: 5px 10px; border-radius: 5px;';
      }
    } else if (isChemistryModule) {
      const progress = JSON.parse(localStorage.getItem('adaptohub_chemistry_units') || '{}');
      const completedUnits = Object.values(progress).filter(u => u.completed);
      if (completedUnits.length > 0) {
        const scores = completedUnits.map(u => u.score).filter(s => typeof s === 'number');
        const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        badgeText = `${avgScore}% avg • ${completedUnits.length}/6 units`;
        badgeStyle = 'font-size: 0.9rem; font-weight: 600; background: linear-gradient(135deg, #4caf50 0%, #45a049 100%); color: white; padding: 5px 10px; border-radius: 5px;';
      }
    } else if (isBiologyModule) {
      const progress = JSON.parse(localStorage.getItem('adaptohub_biology_units') || '{}');
      const completedUnits = Object.values(progress).filter(u => u.completed);
      if (completedUnits.length > 0) {
        const scores = completedUnits.map(u => u.score).filter(s => typeof s === 'number');
        const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        badgeText = `${avgScore}% avg • ${completedUnits.length}/6 units`;
        badgeStyle = 'font-size: 0.9rem; font-weight: 600; background: linear-gradient(135deg, #4caf50 0%, #45a049 100%); color: white; padding: 5px 10px; border-radius: 5px;';
      }
    } else if (isPureMathModule) {
      const progress = JSON.parse(localStorage.getItem('adaptohub_pure_math_units') || '{}');
      const completedUnits = Object.values(progress).filter(u => u.completed);
      if (completedUnits.length > 0) {
        const scores = completedUnits.map(u => u.score).filter(s => typeof s === 'number');
        const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        badgeText = `${avgScore}% avg • ${completedUnits.length}/6 units`;
        badgeStyle = 'font-size: 0.9rem; font-weight: 600; background: linear-gradient(135deg, #4caf50 0%, #45a049 100%); color: white; padding: 8px 16px; border-radius: 20px;';
      } else {
        badgeText = '0% avg • 0/6 units';
        badgeStyle = 'font-size: 0.9rem; font-weight: 600; background: linear-gradient(135deg, #9e9e9e 0%, #757575 100%); color: white; padding: 8px 16px; border-radius: 20px;';
      }
    } else if (isAppliedMathModule) {
      const progress = JSON.parse(localStorage.getItem('adaptohub_applied_math_units') || '{}');
      const completedUnits = Object.values(progress).filter(u => u.completed);
      if (completedUnits.length > 0) {
        const scores = completedUnits.map(u => u.score).filter(s => typeof s === 'number');
        const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        badgeText = `${avgScore}% avg • ${completedUnits.length}/6 units`;
        badgeStyle = 'font-size: 0.9rem; font-weight: 600; background: linear-gradient(135deg, #4caf50 0%, #45a049 100%); color: white; padding: 8px 16px; border-radius: 20px;';
      } else {
        badgeText = '0% avg • 0/6 units';
        badgeStyle = 'font-size: 0.9rem; font-weight: 600; background: linear-gradient(135deg, #9e9e9e 0%, #757575 100%); color: white; padding: 8px 16px; border-radius: 20px;';
      }
    } else {
      const scores = adaptiveInstance.studentData.scores[module.id] || [];
      const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
      badgeText = scores.length > 0 ? `Average Score: ${avgScore}%` : 'Not started';
    }
    
    const card = document.createElement('div');
    card.className = 'module-card';
    card.setAttribute('data-module-id', module.id);
    card.onclick = () => {
      showLoadingScreen();
      setTimeout(() => {
        hideLoadingScreen();
        if (isPhysicsModule) {
          window.location.href = 'physics.html';
        } else if (isChemistryModule) {
          window.location.href = 'chemistry.html';
        } else if (isBiologyModule) {
          window.location.href = 'biology.html';
        } else if (isPureMathModule) {
          window.location.href = 'pure_mathematics.html';
        } else if (isAppliedMathModule) {
          window.location.href = 'applied_mathematics.html';
        } else {
          openModule(module.id);
        }
      }, 800);
    };

    card.innerHTML = `
      <div class="difficulty-indicator difficulty-${difficulty}">
        ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      </div>
      <h3>${moduleData.name || module.name}</h3>
      <p>${moduleData.fullDescription || 'Learn about this topic'}</p>
      <div class="module-badge" style="${badgeStyle}">
        ${badgeText}
      </div>
    `;

    container.appendChild(card);
  });
}

function updateDashboard() {
  if (!adaptiveInstance) return;

  let progress, avgScore;
  
  // For science subject, read from localStorage
  if (adaptiveInstance.subject === 'science') {
    const physicsProgress = JSON.parse(localStorage.getItem('adaptohub_physics_units') || '{}');
    const chemistryProgress = JSON.parse(localStorage.getItem('adaptohub_chemistry_units') || '{}');
    const biologyProgress = JSON.parse(localStorage.getItem('adaptohub_biology_units') || '{}');
    
    const physicsCompleted = Object.values(physicsProgress).filter(u => u.completed);
    const chemistryCompleted = Object.values(chemistryProgress).filter(u => u.completed);
    const biologyCompleted = Object.values(biologyProgress).filter(u => u.completed);
    
    const totalCompleted = physicsCompleted.length + chemistryCompleted.length + biologyCompleted.length;
    const totalUnits = 7 + 6 + 6; // Physics + Chemistry + Biology
    progress = Math.round((totalCompleted / totalUnits) * 100);
    
    const allScores = [
      ...physicsCompleted.map(u => u.score),
      ...chemistryCompleted.map(u => u.score),
      ...biologyCompleted.map(u => u.score)
    ].filter(s => typeof s === 'number');
    
    avgScore = allScores.length > 0 ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0;
  } else {
    // For other subjects, use the old logic
    progress = adaptiveInstance.getProgressPercentage();
    avgScore = adaptiveInstance.getAverageScore();
  }
  
  const masteryLevel = adaptiveInstance.studentData.masteryLevel;
  const streak = adaptiveInstance.studentData.currentStreak;

  const progressFill = document.getElementById('progressFill');
  if (progressFill) {
    progressFill.style.width = progress + '%';
  }

  const overallProgress = document.getElementById('overallProgress');
  if (overallProgress) {
    overallProgress.textContent = progress + '%';
  }

  const masteryEl = document.getElementById('masteryLevel');
  if (masteryEl) {
    masteryEl.textContent = masteryLevel;
  }

  const completionRate = document.getElementById('completionRate');
  if (completionRate) {
    completionRate.textContent = progress + '%';
  }

  const averageScoreEl = document.getElementById('averageScore');
  if (averageScoreEl) {
    averageScoreEl.textContent = avgScore + '%';
  }

  const streakEl = document.getElementById('streakDays');
  if (streakEl) {
    streakEl.textContent = streak;
  }

  const recommendationEl = document.getElementById('recommendationText');
  if (recommendationEl) {
    recommendationEl.textContent = adaptiveInstance.generateRecommendation();
  }
}

function startActivity(moduleId, activityId) {
  const subject = adaptiveInstance.subject;
  const moduleData = getModuleData(subject, moduleId);
  const activity = moduleData.activities?.find(a => a.id === activityId);
  
  if (!activity) {
    console.error(`Activity not found: ${moduleId}/${activityId}`);
    return;
  }

  const activityContent = getActivityContent(subject, moduleId, activityId);
  
  if (!activityContent || !activityContent.html) {
    console.error(`Activity content not found for: ${subject}/${moduleId}/${activityId}`);
    alert(`Activity content is not yet available for "${activity.title}". This activity is coming soon!`);
    return;
  }
  
  const activityModal = document.createElement('div');
  activityModal.id = 'activityModal';
  activityModal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3000;
    overflow-y: auto;
  `;
  
  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background: white;
    border-radius: 12px;
    padding: 30px;
    max-width: 700px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  `;
  
  modalContent.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h2 style="margin: 0; color: #0097b2;">${activity.title}</h2>
      <button onclick="document.getElementById('activityModal').remove()" style="
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #a8b2ba;
      ">✕</button>
    </div>
    <div id="activityContent"></div>
  `;
  
  activityModal.appendChild(modalContent);
  document.body.appendChild(activityModal);
  
  const contentContainer = modalContent.querySelector('#activityContent');
  contentContainer.innerHTML = activityContent.html;

  window.currentActivityData = {
    moduleId,
    activityId,
    validate: activityContent.validate,
    modal: activityModal
  };

  if (activityContent.setup) {
    activityContent.setup();
  }
  
  activityModal.addEventListener('click', (e) => {
    if (e.target === activityModal) {
      activityModal.remove();
    }
  });
}

function getActivityContent(subject, moduleId, activityId) {
  const activities = {
    science: {
      biology: {
        act1: {
          html: `
            <div style="background: #f5f6f8; padding: 24px; border-radius: 12px;">
              <h3 style="color: #1f2933; margin-top: 0; font-size: 1.4rem;">🔬 Cell Structure Quiz</h3>
              <p style="color: #636d79; margin-bottom: 24px; font-size: 0.95rem;">Test your knowledge on cell organelles and their functions. Complete all questions to submit.</p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 24px; border-left: 4px solid #00bcd4;">
                <p style="color: #636d79; font-size: 0.9rem; margin-top: 0; margin-bottom: 12px;"><strong>📚 Did you know?</strong> A typical cell contains about 100 trillion atoms and 10,000 different proteins!</p>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #4caf50;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">1. Which organelle is the "powerhouse of the cell"?</p>
                  <p style="color: #636d79; font-size: 0.9rem; margin: 0 0 12px 0;">💡 Hint: This organelle is responsible for creating ATP, the energy currency of the cell.</p>
                  <div style="display: flex; flex-direction: column; gap: 10px;">
                    <label style="padding: 12px; border-radius: 6px; background: #f9f9f9; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; transition: all 0.2s; font-weight: 500;">
                      <input type="radio" name="q1" value="wrong" style="margin-right: 10px; cursor: pointer;"> Ribosome
                    </label>
                    <label style="padding: 12px; border-radius: 6px; background: #f9f9f9; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; transition: all 0.2s; font-weight: 500;">
                      <input type="radio" name="q1" value="correct" style="margin-right: 10px; cursor: pointer;"> Mitochondrion
                    </label>
                    <label style="padding: 12px; border-radius: 6px; background: #f9f9f9; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; transition: all 0.2s; font-weight: 500;">
                      <input type="radio" name="q1" value="wrong" style="margin-right: 10px; cursor: pointer;"> Endoplasmic Reticulum
                    </label>
                    <label style="padding: 12px; border-radius: 6px; background: #f9f9f9; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; transition: all 0.2s; font-weight: 500;">
                      <input type="radio" name="q1" value="wrong" style="margin-right: 10px; cursor: pointer;"> Nucleus
                    </label>
                  </div>
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #2196f3;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">2. What is the primary function of the nucleus?</p>
                  <p style="color: #636d79; font-size: 0.9rem; margin: 0 0 12px 0;">💡 Hint: Think about where DNA is stored and protected in a cell.</p>
                  <div style="display: flex; flex-direction: column; gap: 10px;">
                    <label style="padding: 12px; border-radius: 6px; background: #f9f9f9; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; transition: all 0.2s; font-weight: 500;">
                      <input type="radio" name="q2" value="wrong" style="margin-right: 10px; cursor: pointer;"> Protein synthesis
                    </label>
                    <label style="padding: 12px; border-radius: 6px; background: #f9f9f9; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; transition: all 0.2s; font-weight: 500;">
                      <input type="radio" name="q2" value="correct" style="margin-right: 10px; cursor: pointer;"> Store and control genetic information
                    </label>
                    <label style="padding: 12px; border-radius: 6px; background: #f9f9f9; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; transition: all 0.2s; font-weight: 500;">
                      <input type="radio" name="q2" value="wrong" style="margin-right: 10px; cursor: pointer;"> Energy production
                    </label>
                    <label style="padding: 12px; border-radius: 6px; background: #f9f9f9; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; transition: all 0.2s; font-weight: 500;">
                      <input type="radio" name="q2" value="wrong" style="margin-right: 10px; cursor: pointer;"> Waste removal
                    </label>
                  </div>
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #ff9800;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">3. Which organelle contains chlorophyll for photosynthesis?</p>
                  <p style="color: #636d79; font-size: 0.9rem; margin: 0 0 12px 0;">💡 Hint: Only found in plant cells, this organelle gives plants their green color.</p>
                  <div style="display: flex; flex-direction: column; gap: 10px;">
                    <label style="padding: 12px; border-radius: 6px; background: #f9f9f9; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; transition: all 0.2s; font-weight: 500;">
                      <input type="radio" name="q3" value="correct" style="margin-right: 10px; cursor: pointer;"> Chloroplast
                    </label>
                    <label style="padding: 12px; border-radius: 6px; background: #f9f9f9; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; transition: all 0.2s; font-weight: 500;">
                      <input type="radio" name="q3" value="wrong" style="margin-right: 10px; cursor: pointer;"> Vacuole
                    </label>
                    <label style="padding: 12px; border-radius: 6px; background: #f9f9f9; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; transition: all 0.2s; font-weight: 500;">
                      <input type="radio" name="q3" value="wrong" style="margin-right: 10px; cursor: pointer;"> Golgi apparatus
                    </label>
                    <label style="padding: 12px; border-radius: 6px; background: #f9f9f9; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; transition: all 0.2s; font-weight: 500;">
                      <input type="radio" name="q3" value="wrong" style="margin-right: 10px; cursor: pointer;"> Lysosome
                    </label>
                  </div>
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #9c27b0;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">4. What is the function of ribosomes?</p>
                  <p style="color: #636d79; font-size: 0.9rem; margin: 0 0 12px 0;">💡 Hint: The site where amino acids are assembled into proteins.</p>
                  <div style="display: flex; flex-direction: column; gap: 10px;">
                    <label style="padding: 12px; border-radius: 6px; background: #f9f9f9; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; transition: all 0.2s; font-weight: 500;">
                      <input type="radio" name="q4" value="correct" style="margin-right: 10px; cursor: pointer;"> Protein synthesis
                    </label>
                    <label style="padding: 12px; border-radius: 6px; background: #f9f9f9; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; transition: all 0.2s; font-weight: 500;">
                      <input type="radio" name="q4" value="wrong" style="margin-right: 10px; cursor: pointer;"> DNA replication
                    </label>
                    <label style="padding: 12px; border-radius: 6px; background: #f9f9f9; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; transition: all 0.2s; font-weight: 500;">
                      <input type="radio" name="q4" value="wrong" style="margin-right: 10px; cursor: pointer;"> Breaking down waste
                    </label>
                    <label style="padding: 12px; border-radius: 6px; background: #f9f9f9; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; transition: all 0.2s; font-weight: 500;">
                      <input type="radio" name="q4" value="wrong" style="margin-right: 10px; cursor: pointer;"> Photosynthesis
                    </label>
                  </div>
                </div>
              </div>
              
              <div style="background: #e8f5e9; padding: 16px; border-radius: 8px; margin-bottom: 24px; border-left: 4px solid #4caf50;">
                <p style="color: #2e7d32; font-size: 0.9rem; margin: 0;"><strong>✅ Progress:</strong> <span id="questionCount">0</span>/4 questions answered</p>
              </div>
              
              <div style="display: flex; gap: 12px;">
                <button onclick="document.getElementById('activityModal')?.remove()" style="
                  flex: 1;
                  padding: 12px;
                  background: #f5f6f8;
                  color: #1f2933;
                  border: 1px solid #e0e0e0;
                  border-radius: 6px;
                  font-weight: 600;
                  cursor: pointer;
                  font-family: 'Bai Jamjuree', sans-serif;
                  font-size: 0.95rem;
                ">← Back</button>
                <button onclick="window.submitActivity()" style="
                  flex: 1;
                  padding: 12px;
                  background: #0097b2;
                  color: white;
                  border: none;
                  border-radius: 6px;
                  font-weight: 600;
                  cursor: pointer;
                  font-family: 'Bai Jamjuree', sans-serif;
                  font-size: 0.95rem;
                ">Submit Quiz ✓</button>
              </div>
            </div>
          `,
          validate: () => {
            const q1 = document.querySelector('input[name="q1"]:checked')?.value;
            const q2 = document.querySelector('input[name="q2"]:checked')?.value;
            const q3 = document.querySelector('input[name="q3"]:checked')?.value;
            const q4 = document.querySelector('input[name="q4"]:checked')?.value;
            
            if (!q1 || !q2 || !q3 || !q4) {
              alert('Please answer all 4 questions before submitting');
              return null;
            }
            
            let correct = 0;
            if (q1 === 'correct') correct++;
            if (q2 === 'correct') correct++;
            if (q3 === 'correct') correct++;
            if (q4 === 'correct') correct++;
            
            return Math.round((correct / 4) * 100);
          },
          setup: () => {
            const updateCount = () => {
              const answered = document.querySelectorAll('input[type="radio"]:checked').length;
              const countEl = document.getElementById('questionCount');
              if (countEl) countEl.textContent = answered;
            };
            
            document.querySelectorAll('input[type="radio"]').forEach(radio => {
              radio.addEventListener('change', updateCount);
            });

            document.querySelectorAll('label').forEach(label => {
              label.addEventListener('click', (e) => {
                const radio = label.querySelector('input[type="radio"]');
                if (radio) {
                  const siblings = label.parentElement.querySelectorAll('label');
                  siblings.forEach(s => {
                    s.style.background = '#f9f9f9';
                    s.style.borderColor = '#e0e0e0';
                  });
                  label.style.background = '#c8e6c9';
                  label.style.borderColor = '#4caf50';
                }
              });
            });
            
            updateCount();
          }
        },
        act2: {
          html: `
            <div style="background: #f5f6f8; padding: 20px; border-radius: 8px;">
              <h3 style="color: #1f2933; margin-top: 0;">Ecosystem Food Web</h3>
              <p style="color: #636d79; margin-bottom: 20px;">Create a food web for a forest ecosystem by matching predators with their prey:</p>
              
              <div style="margin-bottom: 20px;">
                <p style="font-weight: 600; color: #1f2933;">Drag each predator to their food sources:</p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                  <div style="padding: 12px; background: white; border-radius: 6px; border-left: 3px solid #4caf50;">
                    <strong>Predators:</strong>
                    <ul style="list-style: none; padding: 10px 0; margin: 0;">
                      <li style="padding: 8px; margin: 5px 0; background: #e8f5e9; border-radius: 4px; cursor: move;">🦅 Eagle</li>
                      <li style="padding: 8px; margin: 5px 0; background: #e8f5e9; border-radius: 4px; cursor: move;">🐺 Wolf</li>
                      <li style="padding: 8px; margin: 5px 0; background: #e8f5e9; border-radius: 4px; cursor: move;">🦉 Owl</li>
                    </ul>
                  </div>
                  <div style="padding: 12px; background: white; border-radius: 6px; border-left: 3px solid #ff9800;">
                    <strong>Prey:</strong>
                    <ul style="list-style: none; padding: 10px 0; margin: 0;">
                      <li style="padding: 8px; margin: 5px 0; background: #fff3e0; border-radius: 4px;">🐰 Rabbit</li>
                      <li style="padding: 8px; margin: 5px 0; background: #fff3e0; border-radius: 4px;">🐭 Mouse</li>
                      <li style="padding: 8px; margin: 5px 0; background: #fff3e0; border-radius: 4px;">🦌 Deer</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div style="margin-bottom: 20px; padding: 15px; background: white; border-radius: 6px; border: 2px dashed #999;">
                <p style="color: #636d79; font-size: 0.9rem; margin: 0;">Answer: List which animals each predator eats (e.g., Eagle eats: Mouse, Rabbit)</p>
                <textarea id="foodWebAnswer" style="
                  width: 100%;
                  min-height: 100px;
                  padding: 10px;
                  margin-top: 10px;
                  border: 1px solid #d0d5db;
                  border-radius: 4px;
                  font-family: 'Bai Jamjuree', sans-serif;
                "></textarea>
              </div>
              
              <button onclick="window.submitActivity()" style="
                width: 100%;
                padding: 12px;
                background: #0097b2;
                color: white;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                font-family: 'Bai Jamjuree', sans-serif;
              ">Submit Food Web</button>
            </div>
          `,
          validate: () => {
            const answer = document.getElementById('foodWebAnswer')?.value.trim();
            if (!answer || answer.length < 10) {
              alert('Please provide a complete food web answer');
              return null;
            }

            const score = Math.min(100, 50 + (answer.length / 5));
            return Math.round(score);
          }
        },
        act3: {
          html: `
            <div style="background: #f5f6f8; padding: 20px; border-radius: 8px;">
              <h3 style="color: #1f2933; margin-top: 0;">Photosynthesis Equation</h3>
              <p style="color: #636d79; margin-bottom: 20px;">Complete the photosynthesis equation and answer related questions:</p>
              
              <div style="margin-bottom: 20px; padding: 15px; background: white; border-radius: 6px; border-left: 4px solid #4caf50;">
                <p style="font-weight: 600; color: #1f2933; margin-bottom: 10px;">Fill in the blanks:</p>
                <p style="color: #636d79; font-size: 1.1rem; margin-bottom: 15px;">
                  <input type="text" id="input1" placeholder="Input 1" style="width: 120px; padding: 6px; border: 1px solid #d0d5db; border-radius: 4px; font-family: 'Bai Jamjuree', sans-serif;"> + 
                  <input type="text" id="input2" placeholder="Input 2" style="width: 120px; padding: 6px; border: 1px solid #d0d5db; border-radius: 4px; font-family: 'Bai Jamjuree', sans-serif;"> → 
                  <input type="text" id="input3" placeholder="Output 1" style="width: 120px; padding: 6px; border: 1px solid #d0d5db; border-radius: 4px; font-family: 'Bai Jamjuree', sans-serif;"> + 
                  <input type="text" id="input4" placeholder="Output 2" style="width: 120px; padding: 6px; border: 1px solid #d0d5db; border-radius: 4px; font-family: 'Bai Jamjuree', sans-serif;">
                </p>
              </div>
              
              <div style="margin-bottom: 20px;">
                <p style="font-weight: 600; color: #1f2933; margin-bottom: 8px;">Where does photosynthesis occur?</p>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                  <label style="padding: 8px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center;">
                    <input type="radio" name="location" value="wrong" style="margin-right: 8px;"> Mitochondria
                  </label>
                  <label style="padding: 8px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center;">
                    <input type="radio" name="location" value="correct" style="margin-right: 8px;"> Chloroplast
                  </label>
                  <label style="padding: 8px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center;">
                    <input type="radio" name="location" value="wrong" style="margin-right: 8px;"> Nucleus
                  </label>
                </div>
              </div>
              
              <button onclick="window.submitActivity()" style="
                width: 100%;
                padding: 12px;
                background: #0097b2;
                color: white;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                font-family: 'Bai Jamjuree', sans-serif;
              ">Submit Activity</button>
            </div>
          `,
          validate: () => {
            const answers = {
              input1: document.getElementById('input1')?.value.toLowerCase().trim(),
              input2: document.getElementById('input2')?.value.toLowerCase().trim(),
              input3: document.getElementById('input3')?.value.toLowerCase().trim(),
              input4: document.getElementById('input4')?.value.toLowerCase().trim(),
              location: document.querySelector('input[name="location"]:checked')?.value
            };
            if (!answers.input1 || !answers.input2 || !answers.input3 || !answers.input4 || !answers.location) {
              alert('Please complete all fields');
              return null;
            }
            let score = 0;
            if (['water', 'h2o'].includes(answers.input1)) score += 20;
            if (['carbon dioxide', 'co2'].includes(answers.input2)) score += 20;
            if (['glucose', 'sugar'].includes(answers.input3)) score += 20;
            if (['oxygen', 'o2'].includes(answers.input4)) score += 20;
            if (answers.location === 'correct') score += 20;
            return score;
          }
        }
      },
      chemistry: {
        act1: {
          html: `
            <div style="background: #f5f6f8; padding: 24px; border-radius: 12px;">
              <h3 style="color: #1f2933; margin-top: 0; font-size: 1.4rem;">⚗️ Periodic Table Elements</h3>
              <p style="color: #636d79; margin-bottom: 24px; font-size: 0.95rem;">Identify elements by their atomic properties:</p>
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #4caf50;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">1. Which element has atomic number 6?</p>
                  <select id="elem1" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;">
                    <option value="">Select an element</option>
                    <option value="wrong">Oxygen</option>
                    <option value="correct">Carbon</option>
                    <option value="wrong">Nitrogen</option>
                    <option value="wrong">Helium</option>
                  </select>
                </div>
              </div>
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #2196f3;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">2. What is the symbol for gold?</p>
                  <input type="text" id="elem2" placeholder="Enter the symbol" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;" />
                </div>
              </div>
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #ff9800;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">3. Which is a noble gas?</p>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="noble" value="wrong" style="margin-right: 10px; cursor: pointer;"> Chlorine
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="noble" value="correct" style="margin-right: 10px; cursor: pointer;"> Neon
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="noble" value="wrong" style="margin-right: 10px; cursor: pointer;"> Sodium
                    </label>
                  </div>
                </div>
              </div>
              <button onclick="window.submitActivity()" style="
                width: 100%;
                padding: 12px;
                background: #0097b2;
                color: white;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                font-family: 'Bai Jamjuree', sans-serif;
                font-size: 0.95rem;
              ">Submit ✓</button>
            </div>
          `,
          validate: () => {
            const e1 = document.getElementById('elem1')?.value;
            const e2 = document.getElementById('elem2')?.value.toUpperCase().trim();
            const e3 = document.querySelector('input[name="noble"]:checked')?.value;
            if (!e1 || !e2 || !e3) {
              alert('Please complete all fields');
              return null;
            }
            let score = 0;
            if (e1 === 'correct') score += 33;
            if (e2 === 'AU') score += 33;
            if (e3 === 'correct') score += 34;
            return Math.round(score);
          }
        },
        act2: {
          html: `
            <div style="background: #f5f6f8; padding: 24px; border-radius: 12px;">
              <h3 style="color: #1f2933; margin-top: 0; font-size: 1.4rem;">🧪 Chemical Reaction Types</h3>
              <p style="color: #636d79; margin-bottom: 24px; font-size: 0.95rem;">Classify chemical reactions by type:</p>
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #4caf50;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">1. 2H₂ + O₂ → 2H₂O</p>
                  <select id="rxn1" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;">
                    <option value="">Select reaction type</option>
                    <option value="wrong">Decomposition</option>
                    <option value="correct">Combination</option>
                    <option value="wrong">Single replacement</option>
                    <option value="wrong">Double replacement</option>
                  </select>
                </div>
              </div>
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #2196f3;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">2. 2NaCl → 2Na + Cl₂</p>
                  <select id="rxn2" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;">
                    <option value="">Select reaction type</option>
                    <option value="correct">Decomposition</option>
                    <option value="wrong">Combination</option>
                    <option value="wrong">Single replacement</option>
                    <option value="wrong">Double replacement</option>
                  </select>
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #ff9800;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">3. AgNO₃ + NaCl → AgCl + NaNO₃</p>
                  <select id="rxn3" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;">
                    <option value="">Select reaction type</option>
                    <option value="wrong">Decomposition</option>
                    <option value="wrong">Combination</option>
                    <option value="wrong">Single replacement</option>
                    <option value="correct">Double replacement</option>
                  </select>
                </div>
              </div>
              
              <button onclick="window.submitActivity()" style="
                width: 100%;
                padding: 12px;
                background: #0097b2;
                color: white;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                font-family: 'Bai Jamjuree', sans-serif;
                font-size: 0.95rem;
              ">Submit ✓</button>
            </div>
          `,
          validate: () => {
            const r1 = document.getElementById('rxn1')?.value;
            const r2 = document.getElementById('rxn2')?.value;
            const r3 = document.getElementById('rxn3')?.value;
            
            if (!r1 || !r2 || !r3) {
              alert('Please answer all questions');
              return null;
            }
            
            let score = 0;
            if (r1 === 'correct') score += 33;
            if (r2 === 'correct') score += 33;
            if (r3 === 'correct') score += 34;
            
            return Math.round(score);
          }
        },
        act3: {
          html: `
            <div style="background: #f5f6f8; padding: 24px; border-radius: 12px;">
              <h3 style="color: #1f2933; margin-top: 0; font-size: 1.4rem;">⚛️ Molecular Weight Calculator</h3>
              <p style="color: #636d79; margin-bottom: 24px; font-size: 0.95rem;">Calculate the molecular weight of compounds:</p>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #4caf50;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">1. Calculate MW of H₂O (H=1, O=16)</p>
                  <input type="number" id="mw1" placeholder="Enter molecular weight" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;" />
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #2196f3;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">2. Calculate MW of CO₂ (C=12, O=16)</p>
                  <input type="number" id="mw2" placeholder="Enter molecular weight" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;" />
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #ff9800;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">3. Calculate MW of NaCl (Na=23, Cl=35.5)</p>
                  <input type="number" id="mw3" placeholder="Enter molecular weight" step="0.1" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;" />
                </div>
              </div>
              
              <button onclick="window.submitActivity()" style="
                width: 100%;
                padding: 12px;
                background: #0097b2;
                color: white;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                font-family: 'Bai Jamjuree', sans-serif;
                font-size: 0.95rem;
              ">Submit ✓</button>
            </div>
          `,
          validate: () => {
            const mw1 = parseInt(document.getElementById('mw1')?.value);
            const mw2 = parseInt(document.getElementById('mw2')?.value);
            const mw3 = parseFloat(document.getElementById('mw3')?.value);
            
            if (isNaN(mw1) || isNaN(mw2) || isNaN(mw3)) {
              alert('Please complete all calculations');
              return null;
            }
            
            let correct = 0;
            if (mw1 === 18) correct++;
            if (mw2 === 44) correct++;
            if (Math.abs(mw3 - 58.5) < 0.1) correct++;
            
            return Math.round((correct / 3) * 100);
          }
        }
      },
      physics: {
        act1: {
          html: `
            <div style="background: #f5f6f8; padding: 24px; border-radius: 12px;">
              <h3 style="color: #1f2933; margin-top: 0; font-size: 1.4rem;">⚡ Newton's Laws Application</h3>
              <p style="color: #636d79; margin-bottom: 24px; font-size: 0.95rem;">Apply Newton's laws to solve problems:</p>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #4caf50;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">1. A 5kg object accelerates at 2 m/s². What is the force? (F=ma)</p>
                  <input type="number" id="force" placeholder="Enter force in Newtons" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;" />
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #ff9800;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">2. Which Newton's law explains why you feel pushed back when a car accelerates?</p>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="law" value="wrong" style="margin-right: 10px; cursor: pointer;"> First Law
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="law" value="correct" style="margin-right: 10px; cursor: pointer;"> Second Law
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="law" value="wrong" style="margin-right: 10px; cursor: pointer;"> Third Law
                    </label>
                  </div>
                </div>
              </div>
              
              <button onclick="window.submitActivity()" style="
                width: 100%;
                padding: 12px;
                background: #0097b2;
                color: white;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                font-family: 'Bai Jamjuree', sans-serif;
                font-size: 0.95rem;
              ">Submit ✓</button>
            </div>
          `,
          validate: () => {
            const f = parseInt(document.getElementById('force')?.value);
            const l = document.querySelector('input[name="law"]:checked')?.value;
            
            if (!f || !l) {
              alert('Please complete all questions');
              return null;
            }
            
            let score = 0;
            if (f === 10) score += 50;
            if (l === 'correct') score += 50;
            
            return score;
          }
        },
        act2: {
          html: `
            <div style="background: #f5f6f8; padding: 24px; border-radius: 12px;">
              <h3 style="color: #1f2933; margin-top: 0; font-size: 1.4rem;">🔋 Energy Conservation</h3>
              <p style="color: #636d79; margin-bottom: 24px; font-size: 0.95rem;">Analyze energy transformations:</p>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #4caf50;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">1. What is the primary energy type of a moving ball?</p>
                  <select id="energy1" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;">
                    <option value="">Select energy type</option>
                    <option value="wrong">Potential Energy</option>
                    <option value="correct">Kinetic Energy</option>
                    <option value="wrong">Thermal Energy</option>
                  </select>
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #2196f3;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">2. A ball at the top of a hill has high _____ energy</p>
                  <select id="energy2" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;">
                    <option value="">Select energy type</option>
                    <option value="correct">Potential</option>
                    <option value="wrong">Kinetic</option>
                    <option value="wrong">Chemical</option>
                  </select>
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #ff9800;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">3. Total energy in a closed system is:</p>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="total" value="wrong" style="margin-right: 10px; cursor: pointer;"> Always increasing
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="total" value="correct" style="margin-right: 10px; cursor: pointer;"> Conserved (stays constant)
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="total" value="wrong" style="margin-right: 10px; cursor: pointer;"> Always decreasing
                    </label>
                  </div>
                </div>
              </div>
              
              <button onclick="window.submitActivity()" style="
                width: 100%;
                padding: 12px;
                background: #0097b2;
                color: white;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                font-family: 'Bai Jamjuree', sans-serif;
                font-size: 0.95rem;
              ">Submit ✓</button>
            </div>
          `,
          validate: () => {
            const e1 = document.getElementById('energy1')?.value;
            const e2 = document.getElementById('energy2')?.value;
            const e3 = document.querySelector('input[name="total"]:checked')?.value;
            
            if (!e1 || !e2 || !e3) {
              alert('Please answer all questions');
              return null;
            }
            
            let correct = 0;
            if (e1 === 'correct') correct++;
            if (e2 === 'correct') correct++;
            if (e3 === 'correct') correct++;
            
            return Math.round((correct / 3) * 100);
          }
        },
        act3: {
          html: `
            <div style="background: #f5f6f8; padding: 24px; border-radius: 12px;">
              <h3 style="color: #1f2933; margin-top: 0; font-size: 1.4rem;">🌊 Waves and Sound Properties</h3>
              <p style="color: #636d79; margin-bottom: 24px; font-size: 0.95rem;">Understand wave characteristics:</p>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #4caf50;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">1. If a wave has frequency of 5 Hz and wavelength of 2m, what is the wave speed? (Speed = Frequency × Wavelength)</p>
                  <input type="number" id="waveSpeed" placeholder="Enter speed in m/s" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;" />
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #2196f3;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">2. Which travels faster?</p>
                  <select id="comparison" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;">
                    <option value="">Select</option>
                    <option value="wrong">Sound in air</option>
                    <option value="correct">Light in vacuum</option>
                  </select>
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #ff9800;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">3. What is the distance between two adjacent crests of a wave?</p>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="crest" value="wrong" style="margin-right: 10px; cursor: pointer;"> Frequency
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="crest" value="correct" style="margin-right: 10px; cursor: pointer;"> Wavelength
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="crest" value="wrong" style="margin-right: 10px; cursor: pointer;"> Amplitude
                    </label>
                  </div>
                </div>
              </div>
              
              <button onclick="window.submitActivity()" style="
                width: 100%;
                padding: 12px;
                background: #0097b2;
                color: white;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                font-family: 'Bai Jamjuree', sans-serif;
                font-size: 0.95rem;
              ">Submit ✓</button>
            </div>
          `,
          validate: () => {
            const ws = parseInt(document.getElementById('waveSpeed')?.value);
            const comp = document.getElementById('comparison')?.value;
            const c = document.querySelector('input[name="crest"]:checked')?.value;
            
            if (!ws || !comp || !c) {
              alert('Please complete all questions');
              return null;
            }
            
            let correct = 0;
            if (ws === 10) correct++;
            if (comp === 'correct') correct++;
            if (c === 'correct') correct++;
            
            return Math.round((correct / 3) * 100);
          }
        }
    },
    mathematics: {
      arithmetic: {
        act1: {
          html: `
            <div style="background: #f5f6f8; padding: 20px; border-radius: 8px;">
              <h3 style="color: #1f2933; margin-top: 0;">Basic Operations Practice</h3>
              <p style="color: #636d79; margin-bottom: 20px;">Solve these arithmetic problems:</p>
              
              <div style="margin-bottom: 20px; padding: 15px; background: white; border-radius: 6px;">
                <p style="font-weight: 600; color: #1f2933; margin-bottom: 10px;">1) 15 + 27 = ?</p>
                <input type="number" id="op1" placeholder="Answer" style="width: 100%; padding: 8px; border: 1px solid #d0d5db; border-radius: 4px; font-family: 'Bai Jamjuree', sans-serif;" />
              </div>
              
              <div style="margin-bottom: 20px; padding: 15px; background: white; border-radius: 6px;">
                <p style="font-weight: 600; color: #1f2933; margin-bottom: 10px;">2) 50 - 18 = ?</p>
                <input type="number" id="op2" placeholder="Answer" style="width: 100%; padding: 8px; border: 1px solid #d0d5db; border-radius: 4px; font-family: 'Bai Jamjuree', sans-serif;" />
              </div>
              
              <div style="margin-bottom: 20px; padding: 15px; background: white; border-radius: 6px;">
                <p style="font-weight: 600; color: #1f2933; margin-bottom: 10px;">3) 12 × 5 = ?</p>
                <input type="number" id="op3" placeholder="Answer" style="width: 100%; padding: 8px; border: 1px solid #d0d5db; border-radius: 4px; font-family: 'Bai Jamjuree', sans-serif;" />
              </div>
              
              <button onclick="window.submitActivity()" style="
                width: 100%;
                padding: 12px;
                background: #6f42c1;
                color: white;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                font-family: 'Bai Jamjuree', sans-serif;
              ">Submit</button>
            </div>
          `,
          validate: () => {
            const op1 = parseInt(document.getElementById('op1')?.value);
            const op2 = parseInt(document.getElementById('op2')?.value);
            const op3 = parseInt(document.getElementById('op3')?.value);
            
            if (isNaN(op1) || isNaN(op2) || isNaN(op3)) {
              alert('Please answer all questions');
              return null;
            }
            
            let score = 0;
            if (op1 === 42) score += 33;
            if (op2 === 32) score += 33;
            if (op3 === 60) score += 34;
            
            return score;
          }
        },
        act2: {
          html: `
            <div style="background: #f5f6f8; padding: 20px; border-radius: 8px;">
              <h3 style="color: #1f2933; margin-top: 0;">Fractions and Decimals</h3>
              <p style="color: #636d79; margin-bottom: 20px;">Work with fractions and decimals:</p>
              
              <div style="margin-bottom: 20px; padding: 15px; background: white; border-radius: 6px;">
                <p style="font-weight: 600; color: #1f2933; margin-bottom: 10px;">1) What is 1/2 as a decimal?</p>
                <input type="number" id="frac1" placeholder="Answer" step="0.01" style="width: 100%; padding: 8px; border: 1px solid #d0d5db; border-radius: 4px; font-family: 'Bai Jamjuree', sans-serif;" />
              </div>
              
              <div style="margin-bottom: 20px; padding: 15px; background: white; border-radius: 6px;">
                <p style="font-weight: 600; color: #1f2933; margin-bottom: 10px;">2) Add: 1/4 + 1/4 = ?/4</p>
                <input type="number" id="frac2" placeholder="Numerator" style="width: 100%; padding: 8px; border: 1px solid #d0d5db; border-radius: 4px; font-family: 'Bai Jamjuree', sans-serif;" />
              </div>
              
              <button onclick="window.submitActivity()" style="
                width: 100%;
                padding: 12px;
                background: #6f42c1;
                color: white;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                font-family: 'Bai Jamjuree', sans-serif;
              ">Submit</button>
            </div>
          `,
          validate: () => {
            const f1 = parseFloat(document.getElementById('frac1')?.value);
            const f2 = parseInt(document.getElementById('frac2')?.value);
            
            if (isNaN(f1) || isNaN(f2)) {
              alert('Please answer all questions');
              return null;
            }
            
            let score = 0;
            if (Math.abs(f1 - 0.5) < 0.01) score += 50;
            if (f2 === 2) score += 50;
            
            return score;
          }
        },
        act3: {
          html: `
            <div style="background: #f5f6f8; padding: 20px; border-radius: 8px;">
              <h3 style="color: #1f2933; margin-top: 0;">Percentage Calculations</h3>
              <p style="color: #636d79; margin-bottom: 20px;">Calculate percentages:</p>
              
              <div style="margin-bottom: 20px; padding: 15px; background: white; border-radius: 6px;">
                <p style="font-weight: 600; color: #1f2933; margin-bottom: 10px;">1) What is 20% of 50?</p>
                <input type="number" id="perc1" placeholder="Answer" style="width: 100%; padding: 8px; border: 1px solid #d0d5db; border-radius: 4px; font-family: 'Bai Jamjuree', sans-serif;" />
              </div>
              
              <div style="margin-bottom: 20px; padding: 15px; background: white; border-radius: 6px;">
                <p style="font-weight: 600; color: #1f2933; margin-bottom: 10px;">2) If an item costs $100 and has a 25% discount, what is the final price?</p>
                <input type="number" id="perc2" placeholder="Answer" style="width: 100%; padding: 8px; border: 1px solid #d0d5db; border-radius: 4px; font-family: 'Bai Jamjuree', sans-serif;" />
              </div>
              
              <button onclick="window.submitActivity()" style="
                width: 100%;
                padding: 12px;
                background: #6f42c1;
                color: white;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                font-family: 'Bai Jamjuree', sans-serif;
              ">Submit</button>
            </div>
          `,
          validate: () => {
            const p1 = parseInt(document.getElementById('perc1')?.value);
            const p2 = parseInt(document.getElementById('perc2')?.value);
            
            if (isNaN(p1) || isNaN(p2)) {
              alert('Please answer all questions');
              return null;
            }
            
            let score = 0;
            if (p1 === 10) score += 50;
            if (p2 === 75) score += 50;
            
            return score;
          }
        }
      },
      algebra: {
        act1: {
          html: `
            <div style="background: #f5f6f8; padding: 24px; border-radius: 12px;">
              <h3 style="color: #1f2933; margin-top: 0; font-size: 1.4rem;">📊 Linear Equations</h3>
              <p style="color: #636d79; margin-bottom: 24px; font-size: 0.95rem;">Solve linear equations and graph them on coordinate planes.</p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 24px; border-left: 4px solid #00bcd4;">
                <p style="color: #636d79; font-size: 0.9rem; margin-top: 0; margin-bottom: 12px;"><strong>💡 Did you know?</strong> Linear equations are used in business to calculate costs, revenue, and profits!</p>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #4caf50;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">1. Solve: 2x + 5 = 13</p>
                  <p style="color: #636d79; font-size: 0.9rem; margin: 0 0 12px 0;">💡 Hint: First subtract 5 from both sides, then divide by 2.</p>
                  <input type="number" id="eq1" placeholder="Enter x" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;" />
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #2196f3;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">2. Solve: 3x - 7 = 20</p>
                  <p style="color: #636d79; font-size: 0.9rem; margin: 0 0 12px 0;">💡 Hint: Add 7 to both sides first.</p>
                  <input type="number" id="eq2" placeholder="Enter x" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;" />
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #ff9800;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">3. Solve: -4x + 12 = 4</p>
                  <p style="color: #636d79; font-size: 0.9rem; margin: 0 0 12px 0;">💡 Hint: Subtract 12 from both sides, then divide by -4.</p>
                  <input type="number" id="eq3" placeholder="Enter x" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;" />
                </div>
              </div>
              
              <div style="background: #e8f5e9; padding: 16px; border-radius: 8px; margin-bottom: 24px; border-left: 4px solid #4caf50;">
                <p style="color: #2e7d32; font-size: 0.9rem; margin: 0;"><strong>✅ Progress:</strong> <span id="eqCount">0</span>/3 equations solved</p>
              </div>
              
              <div style="display: flex; gap: 12px;">
                <button onclick="document.getElementById('activityModal')?.remove()" style="
                  flex: 1;
                  padding: 12px;
                  background: #f5f6f8;
                  color: #1f2933;
                  border: 1px solid #e0e0e0;
                  border-radius: 6px;
                  font-weight: 600;
                  cursor: pointer;
                  font-family: 'Bai Jamjuree', sans-serif;
                  font-size: 0.95rem;
                ">← Back</button>
                <button onclick="window.submitActivity()" style="
                  flex: 1;
                  padding: 12px;
                  background: #6f42c1;
                  color: white;
                  border: none;
                  border-radius: 6px;
                  font-weight: 600;
                  cursor: pointer;
                  font-family: 'Bai Jamjuree', sans-serif;
                  font-size: 0.95rem;
                ">Submit ✓</button>
              </div>
            </div>
          `,
          validate: () => {
            const eq1 = parseInt(document.getElementById('eq1')?.value);
            const eq2 = parseInt(document.getElementById('eq2')?.value);
            const eq3 = parseInt(document.getElementById('eq3')?.value);
            
            if (isNaN(eq1) || isNaN(eq2) || isNaN(eq3)) {
              alert('Please solve all equations');
              return null;
            }
            
            let correct = 0;
            if (eq1 === 4) correct++;
            if (eq2 === 9) correct++;
            if (eq3 === 2) correct++;
            
            return Math.round((correct / 3) * 100);
          },
          setup: () => {
            const updateCount = () => {
              const filled = [
                document.getElementById('eq1')?.value,
                document.getElementById('eq2')?.value,
                document.getElementById('eq3')?.value
              ].filter(v => v).length;
              const countEl = document.getElementById('eqCount');
              if (countEl) countEl.textContent = filled;
            };
            
            ['eq1', 'eq2', 'eq3'].forEach(id => {
              const el = document.getElementById(id);
              if (el) el.addEventListener('input', updateCount);
            });
            
            updateCount();
          }
        },
        act2: {
          html: `
            <div style="background: #f5f6f8; padding: 24px; border-radius: 12px;">
              <h3 style="color: #1f2933; margin-top: 0; font-size: 1.4rem;">🎯 Quadratic Equations</h3>
              <p style="color: #636d79; margin-bottom: 24px; font-size: 0.95rem;">Solve quadratic equations using the quadratic formula and factoring.</p>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #4caf50;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">1. Factor: x² + 5x + 6 = 0</p>
                  <p style="color: #636d79; font-size: 0.9rem; margin: 0 0 12px 0;">💡 Find two numbers that multiply to 6 and add to 5.</p>
                  <div style="display: flex; gap: 8px;">
                    <input type="number" id="fac1a" placeholder="First root" style="flex: 1; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;" />
                    <input type="number" id="fac1b" placeholder="Second root" style="flex: 1; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;" />
                  </div>
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #2196f3;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">2. Solve: x² = 16</p>
                  <p style="color: #636d79; font-size: 0.9rem; margin: 0 0 12px 0;">💡 What values when squared equal 16? (Enter positive value)</p>
                  <input type="number" id="quad2" placeholder="Enter x" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;" />
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #ff9800;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">3. What is the vertex form of y = x² + 4x + 4?</p>
                  <p style="color: #636d79; font-size: 0.9rem; margin: 0 0 12px 0;">💡 This is a perfect square trinomial.</p>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="vform" value="wrong" style="margin-right: 10px; cursor: pointer;"> y = (x + 1)²
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="vform" value="correct" style="margin-right: 10px; cursor: pointer;"> y = (x + 2)²
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="vform" value="wrong" style="margin-right: 10px; cursor: pointer;"> y = (x + 3)²
                    </label>
                  </div>
                </div>
              </div>
              
              <button onclick="window.submitActivity()" style="
                width: 100%;
                padding: 12px;
                background: #6f42c1;
                color: white;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                font-family: 'Bai Jamjuree', sans-serif;
                font-size: 0.95rem;
              ">Submit ✓</button>
            </div>
          `,
          validate: () => {
            const f1a = parseInt(document.getElementById('fac1a')?.value);
            const f1b = parseInt(document.getElementById('fac1b')?.value);
            const q2 = parseInt(document.getElementById('quad2')?.value);
            const vf = document.querySelector('input[name="vform"]:checked')?.value;
            
            if (isNaN(f1a) || isNaN(f1b) || isNaN(q2) || !vf) {
              alert('Please answer all questions');
              return null;
            }
            
            let correct = 0;
            if ((f1a === -2 && f1b === -3) || (f1a === -3 && f1b === -2)) correct++;
            if (q2 === 4) correct++;
            if (vf === 'correct') correct++;
            
            return Math.round((correct / 3) * 100);
          }
        },
        act3: {
          html: `
            <div style="background: #f5f6f8; padding: 24px; border-radius: 12px;">
              <h3 style="color: #1f2933; margin-top: 0; font-size: 1.4rem;">📈 Systems of Equations</h3>
              <p style="color: #636d79; margin-bottom: 24px; font-size: 0.95rem;">Solve systems of linear equations with multiple variables.</p>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #4caf50;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">Solve the system:</p>
                  <p style="color: #636d79; font-size: 0.95rem; margin: 0 0 8px 0;"><strong>x + y = 7</strong></p>
                  <p style="color: #636d79; font-size: 0.95rem; margin: 0 0 14px 0;"><strong>x - y = 1</strong></p>
                  <p style="color: #636d79; font-size: 0.9rem; margin: 0 0 12px 0;">💡 Hint: Use substitution or elimination method.</p>
                  <div style="display: flex; gap: 8px;">
                    <div style="flex: 1;">
                      <label style="display: block; color: #636d79; font-size: 0.85rem; margin-bottom: 4px; font-weight: 600;">x =</label>
                      <input type="number" id="sys1x" placeholder="x value" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;" />
                    </div>
                    <div style="flex: 1;">
                      <label style="display: block; color: #636d79; font-size: 0.85rem; margin-bottom: 4px; font-weight: 600;">y =</label>
                      <input type="number" id="sys1y" placeholder="y value" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #2196f3;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">Solve the system:</p>
                  <p style="color: #636d79; font-size: 0.95rem; margin: 0 0 8px 0;"><strong>2x + y = 8</strong></p>
                  <p style="color: #636d79; font-size: 0.95rem; margin: 0 0 14px 0;"><strong>x - y = 1</strong></p>
                  <div style="display: flex; gap: 8px;">
                    <div style="flex: 1;">
                      <label style="display: block; color: #636d79; font-size: 0.85rem; margin-bottom: 4px; font-weight: 600;">x =</label>
                      <input type="number" id="sys2x" placeholder="x value" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;" />
                    </div>
                    <div style="flex: 1;">
                      <label style="display: block; color: #636d79; font-size: 0.85rem; margin-bottom: 4px; font-weight: 600;">y =</label>
                      <input type="number" id="sys2y" placeholder="y value" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;" />
                    </div>
                  </div>
                </div>
              </div>
              
              <button onclick="window.submitActivity()" style="
                width: 100%;
                padding: 12px;
                background: #6f42c1;
                color: white;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                font-family: 'Bai Jamjuree', sans-serif;
                font-size: 0.95rem;
              ">Submit ✓</button>
            </div>
          `,
          validate: () => {
            const s1x = parseFloat(document.getElementById('sys1x')?.value);
            const s1y = parseFloat(document.getElementById('sys1y')?.value);
            const s2x = parseFloat(document.getElementById('sys2x')?.value);
            const s2y = parseFloat(document.getElementById('sys2y')?.value);
            
            if (isNaN(s1x) || isNaN(s1y) || isNaN(s2x) || isNaN(s2y)) {
              alert('Please solve both systems');
              return null;
            }
            
            let correct = 0;
            if (s1x === 4 && s1y === 3) correct++;
            if (s2x === 3 && s2y === 2) correct++;
            
            return Math.round((correct / 2) * 100);
          }
        }
      },
      geometry: {
        act1: {
          html: `
            <div style="background: #f5f6f8; padding: 24px; border-radius: 12px;">
              <h3 style="color: #1f2933; margin-top: 0; font-size: 1.4rem;">⚡ Angles and Triangles</h3>
              <p style="color: #636d79; margin-bottom: 24px; font-size: 0.95rem;">Classify angles and identify triangle properties.</p>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #4caf50;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">1. What type of angle is 145°?</p>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="ang1" value="wrong" style="margin-right: 10px; cursor: pointer;"> Acute
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="ang1" value="wrong" style="margin-right: 10px; cursor: pointer;"> Right
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="ang1" value="correct" style="margin-right: 10px; cursor: pointer;"> Obtuse
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="ang1" value="wrong" style="margin-right: 10px; cursor: pointer;"> Straight
                    </label>
                  </div>
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #2196f3;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">2. A triangle has sides 3, 4, and 5. What type is it?</p>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="tri1" value="wrong" style="margin-right: 10px; cursor: pointer;"> Equilateral
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="tri1" value="wrong" style="margin-right: 10px; cursor: pointer;"> Isosceles
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="tri1" value="correct" style="margin-right: 10px; cursor: pointer;"> Right Triangle
                    </label>
                  </div>
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #ff9800;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">3. The sum of angles in any triangle is:</p>
                  <input type="number" id="angle_sum" placeholder="degrees" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;" />
                </div>
              </div>
              
              <button onclick="window.submitActivity()" style="
                width: 100%;
                padding: 12px;
                background: #6f42c1;
                color: white;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                font-family: 'Bai Jamjuree', sans-serif;
                font-size: 0.95rem;
              ">Submit ✓</button>
            </div>
          `,
          validate: () => {
            const a1 = document.querySelector('input[name="ang1"]:checked')?.value;
            const t1 = document.querySelector('input[name="tri1"]:checked')?.value;
            const as = parseInt(document.getElementById('angle_sum')?.value);
            
            if (!a1 || !t1 || isNaN(as)) {
              alert('Please answer all questions');
              return null;
            }
            
            let correct = 0;
            if (a1 === 'correct') correct++;
            if (t1 === 'correct') correct++;
            if (as === 180) correct++;
            
            return Math.round((correct / 3) * 100);
          }
        },
        act2: {
          html: `
            <div style="background: #f5f6f8; padding: 24px; border-radius: 12px;">
              <h3 style="color: #1f2933; margin-top: 0; font-size: 1.4rem;">📐 Area and Perimeter</h3>
              <p style="color: #636d79; margin-bottom: 24px; font-size: 0.95rem;">Calculate areas and perimeters of various shapes.</p>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #4caf50;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">1. Find the area of a rectangle with length 10cm and width 5cm</p>
                  <input type="number" id="area1" placeholder="Area in cm²" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;" />
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #2196f3;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">2. Find the perimeter of a square with side 8m</p>
                  <input type="number" id="perim2" placeholder="Perimeter in m" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;" />
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #ff9800;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">3. Find the area of a triangle with base 6cm and height 4cm</p>
                  <input type="number" id="area3" placeholder="Area in cm²" step="0.5" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;" />
                </div>
              </div>
              
              <button onclick="window.submitActivity()" style="
                width: 100%;
                padding: 12px;
                background: #6f42c1;
                color: white;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                font-family: 'Bai Jamjuree', sans-serif;
                font-size: 0.95rem;
              ">Submit ✓</button>
            </div>
          `,
          validate: () => {
            const a1 = parseInt(document.getElementById('area1')?.value);
            const p2 = parseInt(document.getElementById('perim2')?.value);
            const a3 = parseFloat(document.getElementById('area3')?.value);
            
            if (isNaN(a1) || isNaN(p2) || isNaN(a3)) {
              alert('Please answer all questions');
              return null;
            }
            
            let correct = 0;
            if (a1 === 50) correct++;
            if (p2 === 32) correct++;
            if (Math.abs(a3 - 12) < 0.1) correct++;
            
            return Math.round((correct / 3) * 100);
          }
        },
        act3: {
          html: `
            <div style="background: #f5f6f8; padding: 24px; border-radius: 12px;">
              <h3 style="color: #1f2933; margin-top: 0; font-size: 1.4rem;">🎲 3D Shapes</h3>
              <p style="color: #636d79; margin-bottom: 24px; font-size: 0.95rem;">Calculate volumes and surface areas of 3D shapes.</p>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #4caf50;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">1. Volume of a cube with side 5cm (V = s³)</p>
                  <input type="number" id="vol1" placeholder="Volume in cm³" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;" />
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #2196f3;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">2. Surface area of a cube with side 3cm (SA = 6s²)</p>
                  <input type="number" id="sa2" placeholder="Surface area in cm²" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;" />
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #ff9800;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">3. How many faces does a rectangular prism have?</p>
                  <input type="number" id="faces3" placeholder="Number of faces" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;" />
                </div>
              </div>
              
              <button onclick="window.submitActivity()" style="
                width: 100%;
                padding: 12px;
                background: #6f42c1;
                color: white;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                font-family: 'Bai Jamjuree', sans-serif;
                font-size: 0.95rem;
              ">Submit ✓</button>
            </div>
          `,
          validate: () => {
            const v1 = parseInt(document.getElementById('vol1')?.value);
            const sa2 = parseInt(document.getElementById('sa2')?.value);
            const f3 = parseInt(document.getElementById('faces3')?.value);
            
            if (isNaN(v1) || isNaN(sa2) || isNaN(f3)) {
              alert('Please answer all questions');
              return null;
            }
            
            let correct = 0;
            if (v1 === 125) correct++;
            if (sa2 === 54) correct++;
            if (f3 === 6) correct++;
            
            return Math.round((correct / 3) * 100);
          }
        }
      },
      calculus: {
        act1: {
          html: `
            <div style="background: #f5f6f8; padding: 24px; border-radius: 12px;">
              <h3 style="color: #1f2933; margin-top: 0; font-size: 1.4rem;">🔢 Limits and Continuity</h3>
              <p style="color: #636d79; margin-bottom: 24px; font-size: 0.95rem;">Understand limits and continuous functions.</p>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #4caf50;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">1. Find lim(x→2) (x² + 3)</p>
                  <input type="number" id="lim1" placeholder="Limit value" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;" />
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #2196f3;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">2. Is f(x) = x² continuous everywhere?</p>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="cont2" value="correct" style="margin-right: 10px; cursor: pointer;"> Yes, polynomial functions are continuous
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="cont2" value="wrong" style="margin-right: 10px; cursor: pointer;"> No, only at x > 0
                    </label>
                  </div>
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #ff9800;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">3. What is lim(x→∞) 1/x?</p>
                  <input type="number" id="lim3" placeholder="Limit value" step="0.1" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;" />
                </div>
              </div>
              
              <button onclick="window.submitActivity()" style="
                width: 100%;
                padding: 12px;
                background: #6f42c1;
                color: white;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                font-family: 'Bai Jamjuree', sans-serif;
                font-size: 0.95rem;
              ">Submit ✓</button>
            </div>
          `,
          validate: () => {
            const l1 = parseInt(document.getElementById('lim1')?.value);
            const c2 = document.querySelector('input[name="cont2"]:checked')?.value;
            const l3 = parseFloat(document.getElementById('lim3')?.value);
            
            if (isNaN(l1) || !c2 || isNaN(l3)) {
              alert('Please answer all questions');
              return null;
            }
            
            let correct = 0;
            if (l1 === 7) correct++;
            if (c2 === 'correct') correct++;
            if (Math.abs(l3 - 0) < 0.1) correct++;
            
            return Math.round((correct / 3) * 100);
          }
        },
        act2: {
          html: `
            <div style="background: #f5f6f8; padding: 24px; border-radius: 12px;">
              <h3 style="color: #1f2933; margin-top: 0; font-size: 1.4rem;">📈 Derivatives</h3>
              <p style="color: #636d79; margin-bottom: 24px; font-size: 0.95rem;">Calculate and apply derivatives using differentiation rules.</p>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #4caf50;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">1. Find the derivative of f(x) = 3x² using power rule</p>
                  <p style="color: #636d79; font-size: 0.9rem; margin: 0 0 12px 0;">💡 Power rule: d/dx[xⁿ] = n·xⁿ⁻¹</p>
                  <input type="text" id="deriv1" placeholder="e.g., 6x" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;" />
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #2196f3;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">2. What is the derivative of f(x) = 5?</p>
                  <input type="number" id="deriv2" placeholder="Derivative" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;" />
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #ff9800;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">3. Find f'(2) where f(x) = x³</p>
                  <input type="number" id="deriv3" placeholder="Value at x=2" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;" />
                </div>
              </div>
              
              <button onclick="window.submitActivity()" style="
                width: 100%;
                padding: 12px;
                background: #6f42c1;
                color: white;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                font-family: 'Bai Jamjuree', sans-serif;
                font-size: 0.95rem;
              ">Submit ✓</button>
            </div>
          `,
          validate: () => {
            const d1 = document.getElementById('deriv1')?.value.trim().toLowerCase();
            const d2 = parseInt(document.getElementById('deriv2')?.value);
            const d3 = parseInt(document.getElementById('deriv3')?.value);
            
            if (!d1 || isNaN(d2) || isNaN(d3)) {
              alert('Please answer all questions');
              return null;
            }
            
            let correct = 0;
            if (d1.includes('6x') || d1 === '6x') correct++;
            if (d2 === 0) correct++;
            if (d3 === 12) correct++;
            
            return Math.round((correct / 3) * 100);
          }
        },
        act3: {
          html: `
            <div style="background: #f5f6f8; padding: 24px; border-radius: 12px;">
              <h3 style="color: #1f2933; margin-top: 0; font-size: 1.4rem;">∫ Integrals</h3>
              <p style="color: #636d79; margin-bottom: 24px; font-size: 0.95rem;">Compute definite and indefinite integrals.</p>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #4caf50;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">1. Find ∫ 2x dx (indefinite)</p>
                  <p style="color: #636d79; font-size: 0.9rem; margin: 0 0 12px 0;">💡 Power rule integration: ∫ xⁿ dx = xⁿ⁺¹/(n+1) + C</p>
                  <input type="text" id="int1" placeholder="e.g., x^2 + C" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;" />
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #2196f3;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">2. Evaluate ∫₀² 3x² dx (definite)</p>
                  <input type="number" id="int2" placeholder="Result" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;" />
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #ff9800;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">3. ∫ 5 dx = ?</p>
                  <input type="text" id="int3" placeholder="e.g., 5x + C" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;" />
                </div>
              </div>
              
              <button onclick="window.submitActivity()" style="
                width: 100%;
                padding: 12px;
                background: #6f42c1;
                color: white;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                font-family: 'Bai Jamjuree', sans-serif;
                font-size: 0.95rem;
              ">Submit ✓</button>
            </div>
          `,
          validate: () => {
            const i1 = document.getElementById('int1')?.value.trim().toLowerCase();
            const i2 = parseInt(document.getElementById('int2')?.value);
            const i3 = document.getElementById('int3')?.value.trim().toLowerCase();
            
            if (!i1 || isNaN(i2) || !i3) {
              alert('Please answer all questions');
              return null;
            }
            
            let correct = 0;
            if ((i1.includes('x^2') || i1.includes('x²')) && i1.includes('c')) correct++;
            if (i2 === 8) correct++;
            if (i3.includes('5x') && i3.includes('c')) correct++;
            
            return Math.round((correct / 3) * 100);
          }
        }
      },
      statistics: {
        act1: {
          html: `
            <div style="background: #f5f6f8; padding: 24px; border-radius: 12px;">
              <h3 style="color: #1f2933; margin-top: 0; font-size: 1.4rem;">📊 Data Collection</h3>
              <p style="color: #636d79; margin-bottom: 24px; font-size: 0.95rem;">Gather, organize, and analyze data sets.</p>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #4caf50;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">1. Find the mean of: 2, 4, 6, 8, 10</p>
                  <input type="number" id="mean1" placeholder="Mean value" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;" />
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #2196f3;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">2. Find the median of: 1, 3, 5, 7, 9</p>
                  <input type="number" id="median2" placeholder="Median value" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;" />
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #ff9800;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">3. Find the mode of: 5, 5, 5, 7, 9</p>
                  <input type="number" id="mode3" placeholder="Mode value" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;" />
                </div>
              </div>
              
              <button onclick="window.submitActivity()" style="
                width: 100%;
                padding: 12px;
                background: #6f42c1;
                color: white;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                font-family: 'Bai Jamjuree', sans-serif;
                font-size: 0.95rem;
              ">Submit ✓</button>
            </div>
          `,
          validate: () => {
            const m1 = parseInt(document.getElementById('mean1')?.value);
            const m2 = parseInt(document.getElementById('median2')?.value);
            const m3 = parseInt(document.getElementById('mode3')?.value);
            
            if (isNaN(m1) || isNaN(m2) || isNaN(m3)) {
              alert('Please answer all questions');
              return null;
            }
            
            let correct = 0;
            if (m1 === 6) correct++;
            if (m2 === 5) correct++;
            if (m3 === 5) correct++;
            
            return Math.round((correct / 3) * 100);
          }
        },
        act2: {
          html: `
            <div style="background: #f5f6f8; padding: 24px; border-radius: 12px;">
              <h3 style="color: #1f2933; margin-top: 0; font-size: 1.4rem;">🎲 Probability</h3>
              <p style="color: #636d79; margin-bottom: 24px; font-size: 0.95rem;">Calculate probabilities of events and outcomes.</p>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #4caf50;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">1. What is P(rolling a 3 on a die)?</p>
                  <input type="number" id="prob1" placeholder="Probability (0-1)" step="0.01" min="0" max="1" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;" />
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #2196f3;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">2. If you flip a coin, P(heads) = ?</p>
                  <input type="number" id="prob2" placeholder="Probability (0-1)" step="0.01" min="0" max="1" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;" />
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #ff9800;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">3. Draw a card from 52. P(drawing an Ace) = ?</p>
                  <input type="number" id="prob3" placeholder="Probability (0-1)" step="0.01" min="0" max="1" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;" />
                </div>
              </div>
              
              <button onclick="window.submitActivity()" style="
                width: 100%;
                padding: 12px;
                background: #6f42c1;
                color: white;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                font-family: 'Bai Jamjuree', sans-serif;
                font-size: 0.95rem;
              ">Submit ✓</button>
            </div>
          `,
          validate: () => {
            const p1 = parseFloat(document.getElementById('prob1')?.value);
            const p2 = parseFloat(document.getElementById('prob2')?.value);
            const p3 = parseFloat(document.getElementById('prob3')?.value);
            
            if (isNaN(p1) || isNaN(p2) || isNaN(p3)) {
              alert('Please answer all questions');
              return null;
            }
            
            let correct = 0;
            if (Math.abs(p1 - (1/6)) < 0.05) correct++;
            if (Math.abs(p2 - 0.5) < 0.05) correct++;
            if (Math.abs(p3 - (1/13)) < 0.05) correct++;
            
            return Math.round((correct / 3) * 100);
          }
        },
        act3: {
          html: `
            <div style="background: #f5f6f8; padding: 24px; border-radius: 12px;">
              <h3 style="color: #1f2933; margin-top: 0; font-size: 1.4rem;">📈 Statistical Analysis</h3>
              <p style="color: #636d79; margin-bottom: 24px; font-size: 0.95rem;">Analyze distributions and correlations in data.</p>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #4caf50;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">1. What does standard deviation measure?</p>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="stdev" value="wrong" style="margin-right: 10px; cursor: pointer;"> The average value
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="stdev" value="correct" style="margin-right: 10px; cursor: pointer;"> The spread or dispersion of data
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="stdev" value="wrong" style="margin-right: 10px; cursor: pointer;"> The relationship between two variables
                    </label>
                  </div>
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #2196f3;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">2. Calculate the variance of: 2, 4, 6</p>
                  <input type="number" id="var2" placeholder="Variance" step="0.01" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;" />
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #ff9800;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">3. What is a correlation coefficient of 0.95 indicating?</p>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="corr" value="correct" style="margin-right: 10px; cursor: pointer;"> Very strong positive correlation
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="corr" value="wrong" style="margin-right: 10px; cursor: pointer;"> Weak correlation
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="corr" value="wrong" style="margin-right: 10px; cursor: pointer;"> No correlation
                    </label>
                  </div>
                </div>
              </div>
              
              <button onclick="window.submitActivity()" style="
                width: 100%;
                padding: 12px;
                background: #6f42c1;
                color: white;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                font-family: 'Bai Jamjuree', sans-serif;
                font-size: 0.95rem;
              ">Submit ✓</button>
            </div>
          `,
          validate: () => {
            const sd = document.querySelector('input[name="stdev"]:checked')?.value;
            const v2 = parseFloat(document.getElementById('var2')?.value);
            const corr = document.querySelector('input[name="corr"]:checked')?.value;
            
            if (!sd || isNaN(v2) || !corr) {
              alert('Please answer all questions');
              return null;
            }
            
            let correct = 0;
            if (sd === 'correct') correct++;
            if (Math.abs(v2 - 2.67) < 0.2) correct++;
            if (corr === 'correct') correct++;
            
            return Math.round((correct / 3) * 100);
          }
        }
      }
    },
    social_studies: {
      geography: {
        act1: {
          html: `
            <div style="background: #f5f6f8; padding: 20px; border-radius: 8px;">
              <h3 style="color: #1f2933; margin-top: 0;">Map Reading Skills</h3>
              <p style="color: #636d79; margin-bottom: 20px;">Test your map reading abilities:</p>
              
              <div style="margin-bottom: 20px;">
                <p style="font-weight: 600; color: #1f2933; margin-bottom: 8px;">1. What do contour lines on a map show?</p>
                <select id="map1" style="width: 100%; padding: 8px; border: 1px solid #d0d5db; border-radius: 4px; font-family: 'Bai Jamjuree', sans-serif;">
                  <option value="">Select</option>
                  <option value="wrong">Temperature variations</option>
                  <option value="correct">Elevation and terrain</option>
                  <option value="wrong">Population density</option>
                </select>
              </div>
              
              <div style="margin-bottom: 20px;">
                <p style="font-weight: 600; color: #1f2933; margin-bottom: 8px;">2. What does a map scale do?</p>
                <select id="map2" style="width: 100%; padding: 8px; border: 1px solid #d0d5db; border-radius: 4px; font-family: 'Bai Jamjuree', sans-serif;">
                  <option value="">Select</option>
                  <option value="correct">Shows ratio of map distance to actual distance</option>
                  <option value="wrong">Indicates political borders</option>
                  <option value="wrong">Shows climate types</option>
                </select>
              </div>
              
              <button onclick="window.submitActivity()" style="
                width: 100%;
                padding: 12px;
                background: #059669;
                color: white;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                font-family: 'Bai Jamjuree', sans-serif;
              ">Submit</button>
            </div>
          `,
          validate: () => {
            const m1 = document.getElementById('map1')?.value;
            const m2 = document.getElementById('map2')?.value;
            
            if (!m1 || !m2) {
              alert('Please answer all questions');
              return null;
            }
            
            let score = 0;
            if (m1 === 'correct') score += 50;
            if (m2 === 'correct') score += 50;
            
            return score;
          }
        },
        act2: {
          html: `
            <div style="background: #f5f6f8; padding: 20px; border-radius: 8px;">
              <h3 style="color: #1f2933; margin-top: 0;">Climate Zones Classification</h3>
              <p style="color: #636d79; margin-bottom: 20px;">Classify climate zones:</p>
              
              <div style="margin-bottom: 20px;">
                <p style="font-weight: 600; color: #1f2933; margin-bottom: 8px;">1. Tropical climate is characterized by:</p>
                <select id="clim1" style="width: 100%; padding: 8px; border: 1px solid #d0d5db; border-radius: 4px; font-family: 'Bai Jamjuree', sans-serif;">
                  <option value="">Select</option>
                  <option value="correct">High temperature and high rainfall</option>
                  <option value="wrong">Cold and dry</option>
                  <option value="wrong">Moderate temperature</option>
                </select>
              </div>
              
              <div style="margin-bottom: 20px;">
                <p style="font-weight: 600; color: #1f2933; margin-bottom: 8px;">2. What is a temperate climate?</p>
                <select id="clim2" style="width: 100%; padding: 8px; border: 1px solid #d0d5db; border-radius: 4px; font-family: 'Bai Jamjuree', sans-serif;">
                  <option value="">Select</option>
                  <option value="wrong">Always hot</option>
                  <option value="correct">Moderate temperatures with seasonal changes</option>
                  <option value="wrong">Always frozen</option>
                </select>
              </div>
              
              <button onclick="window.submitActivity()" style="
                width: 100%;
                padding: 12px;
                background: #059669;
                color: white;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                font-family: 'Bai Jamjuree', sans-serif;
              ">Submit</button>
            </div>
          `,
          validate: () => {
            const c1 = document.getElementById('clim1')?.value;
            const c2 = document.getElementById('clim2')?.value;
            
            if (!c1 || !c2) {
              alert('Please answer all questions');
              return null;
            }
            
            let score = 0;
            if (c1 === 'correct') score += 50;
            if (c2 === 'correct') score += 50;
            
            return score;
          }
        },
        act3: {
          html: `
            <div style="background: #f5f6f8; padding: 20px; border-radius: 8px;">
              <h3 style="color: #1f2933; margin-top: 0;">Population Distribution Analysis</h3>
              <p style="color: #636d79; margin-bottom: 20px;">Analyze human settlement patterns:</p>
              
              <div style="margin-bottom: 20px; padding: 15px; background: white; border-radius: 6px;">
                <p style="font-weight: 600; color: #1f2933; margin-bottom: 10px;">Name three factors that influence where people settle:</p>
                <textarea id="settlement" style="
                  width: 100%;
                  min-height: 100px;
                  padding: 10px;
                  border: 1px solid #d0d5db;
                  border-radius: 4px;
                  font-family: 'Bai Jamjuree', sans-serif;
                "></textarea>
              </div>
              
              <button onclick="window.submitActivity()" style="
                width: 100%;
                padding: 12px;
                background: #059669;
                color: white;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                font-family: 'Bai Jamjuree', sans-serif;
              ">Submit</button>
            </div>
          `,
          validate: () => {
            const settlement = document.getElementById('settlement')?.value.trim();
            if (!settlement || settlement.length < 20) {
              alert('Please provide a detailed answer');
              return null;
            }
            
            let score = 60;
            if (settlement.toLowerCase().includes('water') || settlement.toLowerCase().includes('climate')) score += 15;
            if (settlement.toLowerCase().includes('resource') || settlement.toLowerCase().includes('land')) score += 15;
            if (settlement.toLowerCase().includes('trade') || settlement.toLowerCase().includes('job') || settlement.toLowerCase().includes('work')) score += 10;
            
            return Math.min(100, score);
          }
        }
      },
      history: {
        act1: {
          html: `
            <div style="background: #f5f6f8; padding: 24px; border-radius: 12px;">
              <h3 style="color: #1f2933; margin-top: 0; font-size: 1.4rem;">⛩️ Ancient Civilizations</h3>
              <p style="color: #636d79; margin-bottom: 24px; font-size: 0.95rem;">Test your knowledge of ancient societies and their contributions.</p>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #4caf50;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">1. Which ancient civilization built the pyramids?</p>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="civ1" value="correct" style="margin-right: 10px; cursor: pointer;"> Ancient Egypt
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="civ1" value="wrong" style="margin-right: 10px; cursor: pointer;"> Ancient Mesopotamia
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="civ1" value="wrong" style="margin-right: 10px; cursor: pointer;"> Ancient Rome
                    </label>
                  </div>
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #2196f3;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">2. The Great Wall was built by which civilization?</p>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="civ2" value="wrong" style="margin-right: 10px; cursor: pointer;"> Ancient Greece
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="civ2" value="correct" style="margin-right: 10px; cursor: pointer;"> Ancient China
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="civ2" value="wrong" style="margin-right: 10px; cursor: pointer;"> Ancient India
                    </label>
                  </div>
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #ff9800;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">3. Which civilization gave us democracy?</p>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="civ3" value="correct" style="margin-right: 10px; cursor: pointer;"> Ancient Greece (Athens)
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="civ3" value="wrong" style="margin-right: 10px; cursor: pointer;"> Ancient Rome
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="civ3" value="wrong" style="margin-right: 10px; cursor: pointer;"> Ancient Egypt
                    </label>
                  </div>
                </div>
              </div>
              
              <button onclick="window.submitActivity()" style="
                width: 100%;
                padding: 12px;
                background: #059669;
                color: white;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                font-family: 'Bai Jamjuree', sans-serif;
                font-size: 0.95rem;
              ">Submit ✓</button>
            </div>
          `,
          validate: () => {
            const c1 = document.querySelector('input[name="civ1"]:checked')?.value;
            const c2 = document.querySelector('input[name="civ2"]:checked')?.value;
            const c3 = document.querySelector('input[name="civ3"]:checked')?.value;
            
            if (!c1 || !c2 || !c3) {
              alert('Please answer all questions');
              return null;
            }
            
            let correct = 0;
            if (c1 === 'correct') correct++;
            if (c2 === 'correct') correct++;
            if (c3 === 'correct') correct++;
            
            return Math.round((correct / 3) * 100);
          }
        },
        act2: {
          html: `
            <div style="background: #f5f6f8; padding: 24px; border-radius: 12px;">
              <h3 style="color: #1f2933; margin-top: 0; font-size: 1.4rem;">⚔️ World Wars</h3>
              <p style="color: #636d79; margin-bottom: 24px; font-size: 0.95rem;">Analyze causes and consequences of global conflicts.</p>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #4caf50;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">1. In what year did World War I end?</p>
                  <input type="number" id="ww1" placeholder="Year" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;" />
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #2196f3;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">2. What year did World War II begin?</p>
                  <input type="number" id="ww2" placeholder="Year" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;" />
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #ff9800;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">3. Which country surrendered first in WWII?</p>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="ww3" value="correct" style="margin-right: 10px; cursor: pointer;"> Germany
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="ww3" value="wrong" style="margin-right: 10px; cursor: pointer;"> Italy
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="ww3" value="wrong" style="margin-right: 10px; cursor: pointer;"> Japan
                    </label>
                  </div>
                </div>
              </div>
              
              <button onclick="window.submitActivity()" style="
                width: 100%;
                padding: 12px;
                background: #059669;
                color: white;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                font-family: 'Bai Jamjuree', sans-serif;
                font-size: 0.95rem;
              ">Submit ✓</button>
            </div>
          `,
          validate: () => {
            const w1 = parseInt(document.getElementById('ww1')?.value);
            const w2 = parseInt(document.getElementById('ww2')?.value);
            const w3 = document.querySelector('input[name="ww3"]:checked')?.value;
            
            if (isNaN(w1) || isNaN(w2) || !w3) {
              alert('Please answer all questions');
              return null;
            }
            
            let correct = 0;
            if (w1 === 1918) correct++;
            if (w2 === 1939) correct++;
            if (w3 === 'correct') correct++;
            
            return Math.round((correct / 3) * 100);
          }
        },
        act3: {
          html: `
            <div style="background: #f5f6f8; padding: 24px; border-radius: 12px;">
              <h3 style="color: #1f2933; margin-top: 0; font-size: 1.4rem;">🌍 Modern History</h3>
              <p style="color: #636d79; margin-bottom: 24px; font-size: 0.95rem;">Understand significant contemporary historical events.</p>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #4caf50;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">1. When did the Berlin Wall fall?</p>
                  <input type="number" id="mod1" placeholder="Year" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;" />
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #2196f3;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">2. In what year did the Soviet Union dissolve?</p>
                  <input type="number" id="mod2" placeholder="Year" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;" />
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #ff9800;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">3. Which country first landed humans on the Moon?</p>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="mod3" value="correct" style="margin-right: 10px; cursor: pointer;"> United States
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="mod3" value="wrong" style="margin-right: 10px; cursor: pointer;"> Soviet Union
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="mod3" value="wrong" style="margin-right: 10px; cursor: pointer;"> United Kingdom
                    </label>
                  </div>
                </div>
              </div>
              
              <button onclick="window.submitActivity()" style="
                width: 100%;
                padding: 12px;
                background: #059669;
                color: white;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                font-family: 'Bai Jamjuree', sans-serif;
                font-size: 0.95rem;
              ">Submit ✓</button>
            </div>
          `,
          validate: () => {
            const m1 = parseInt(document.getElementById('mod1')?.value);
            const m2 = parseInt(document.getElementById('mod2')?.value);
            const m3 = document.querySelector('input[name="mod3"]:checked')?.value;
            
            if (isNaN(m1) || isNaN(m2) || !m3) {
              alert('Please answer all questions');
              return null;
            }
            
            let correct = 0;
            if (m1 === 1989) correct++;
            if (m2 === 1991) correct++;
            if (m3 === 'correct') correct++;
            
            return Math.round((correct / 3) * 100);
          }
        }
      },
      civics: {
        act1: {
          html: `
            <div style="background: #f5f6f8; padding: 24px; border-radius: 12px;">
              <h3 style="color: #1f2933; margin-top: 0; font-size: 1.4rem;">⚖️ Government Systems</h3>
              <p style="color: #636d79; margin-bottom: 24px; font-size: 0.95rem;">Compare different forms of government and their characteristics.</p>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #4caf50;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">1. In a democracy, power is held by:</p>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="gov1" value="correct" style="margin-right: 10px; cursor: pointer;"> The people (voters)
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="gov1" value="wrong" style="margin-right: 10px; cursor: pointer;"> A single leader
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="gov1" value="wrong" style="margin-right: 10px; cursor: pointer;"> A military junta
                    </label>
                  </div>
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #2196f3;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">2. A monarchy is a government led by:</p>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="gov2" value="correct" style="margin-right: 10px; cursor: pointer;"> A king or queen
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="gov2" value="wrong" style="margin-right: 10px; cursor: pointer;"> Elected representatives
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="gov2" value="wrong" style="margin-right: 10px; cursor: pointer;"> Military officers
                    </label>
                  </div>
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #ff9800;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">3. Which is a characteristic of an authoritarian government?</p>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="gov3" value="wrong" style="margin-right: 10px; cursor: pointer;"> Freedom of speech
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="gov3" value="correct" style="margin-right: 10px; cursor: pointer;"> Concentrated power in one person/group
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="gov3" value="wrong" style="margin-right: 10px; cursor: pointer;"> Free elections
                    </label>
                  </div>
                </div>
              </div>
              
              <button onclick="window.submitActivity()" style="
                width: 100%;
                padding: 12px;
                background: #059669;
                color: white;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                font-family: 'Bai Jamjuree', sans-serif;
                font-size: 0.95rem;
              ">Submit ✓</button>
            </div>
          `,
          validate: () => {
            const g1 = document.querySelector('input[name="gov1"]:checked')?.value;
            const g2 = document.querySelector('input[name="gov2"]:checked')?.value;
            const g3 = document.querySelector('input[name="gov3"]:checked')?.value;
            
            if (!g1 || !g2 || !g3) {
              alert('Please answer all questions');
              return null;
            }
            
            let correct = 0;
            if (g1 === 'correct') correct++;
            if (g2 === 'correct') correct++;
            if (g3 === 'correct') correct++;
            
            return Math.round((correct / 3) * 100);
          }
        },
        act2: {
          html: `
            <div style="background: #f5f6f8; padding: 24px; border-radius: 12px;">
              <h3 style="color: #1f2933; margin-top: 0; font-size: 1.4rem;">✋ Rights and Responsibilities</h3>
              <p style="color: #636d79; margin-bottom: 24px; font-size: 0.95rem;">Understand civic duties and fundamental rights.</p>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #4caf50;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">1. Which is a fundamental human right?</p>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="rights1" value="correct" style="margin-right: 10px; cursor: pointer;"> Right to life and liberty
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="rights1" value="wrong" style="margin-right: 10px; cursor: pointer;"> Right to unlimited wealth
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="rights1" value="wrong" style="margin-right: 10px; cursor: pointer;"> Right to rule others
                    </label>
                  </div>
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #2196f3;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">2. A civic responsibility includes:</p>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="rights2" value="wrong" style="margin-right: 10px; cursor: pointer;"> Having fun
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="rights2" value="correct" style="margin-right: 10px; cursor: pointer;"> Voting in elections
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="rights2" value="wrong" style="margin-right: 10px; cursor: pointer;"> Avoiding taxes
                    </label>
                  </div>
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #ff9800;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">3. Freedom of speech means:</p>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="rights3" value="correct" style="margin-right: 10px; cursor: pointer;"> Right to express opinions without fear
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="rights3" value="wrong" style="margin-right: 10px; cursor: pointer;"> Right to say whatever without consequences
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="rights3" value="wrong" style="margin-right: 10px; cursor: pointer;"> Right to silence others
                    </label>
                  </div>
                </div>
              </div>
              
              <button onclick="window.submitActivity()" style="
                width: 100%;
                padding: 12px;
                background: #059669;
                color: white;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                font-family: 'Bai Jamjuree', sans-serif;
                font-size: 0.95rem;
              ">Submit ✓</button>
            </div>
          `,
          validate: () => {
            const r1 = document.querySelector('input[name="rights1"]:checked')?.value;
            const r2 = document.querySelector('input[name="rights2"]:checked')?.value;
            const r3 = document.querySelector('input[name="rights3"]:checked')?.value;
            
            if (!r1 || !r2 || !r3) {
              alert('Please answer all questions');
              return null;
            }
            
            let correct = 0;
            if (r1 === 'correct') correct++;
            if (r2 === 'correct') correct++;
            if (r3 === 'correct') correct++;
            
            return Math.round((correct / 3) * 100);
          }
        },
        act3: {
          html: `
            <div style="background: #f5f6f8; padding: 24px; border-radius: 12px;">
              <h3 style="color: #1f2933; margin-top: 0; font-size: 1.4rem;">🗳️ Electoral Process</h3>
              <p style="color: #636d79; margin-bottom: 24px; font-size: 0.95rem;">Learn how democratic elections work.</p>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #4caf50;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">1. What is the voting age in most democracies?</p>
                  <input type="number" id="elec1" placeholder="Age" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;" />
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #2196f3;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">2. A ballot is:</p>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="elec2" value="correct" style="margin-right: 10px; cursor: pointer;"> A document used to cast a vote
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="elec2" value="wrong" style="margin-right: 10px; cursor: pointer;"> A political party
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="elec2" value="wrong" style="margin-right: 10px; cursor: pointer;"> A type of debate
                    </label>
                  </div>
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #ff9800;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">3. The purpose of elections is to:</p>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="elec3" value="correct" style="margin-right: 10px; cursor: pointer;"> Allow people to choose their leaders
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="elec3" value="wrong" style="margin-right: 10px; cursor: pointer;"> Decide which laws are passed
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="elec3" value="wrong" style="margin-right: 10px; cursor: pointer;"> Determine the weather
                    </label>
                  </div>
                </div>
              </div>
              
              <button onclick="window.submitActivity()" style="
                width: 100%;
                padding: 12px;
                background: #059669;
                color: white;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                font-family: 'Bai Jamjuree', sans-serif;
                font-size: 0.95rem;
              ">Submit ✓</button>
            </div>
          `,
          validate: () => {
            const e1 = parseInt(document.getElementById('elec1')?.value);
            const e2 = document.querySelector('input[name="elec2"]:checked')?.value;
            const e3 = document.querySelector('input[name="elec3"]:checked')?.value;
            
            if (isNaN(e1) || !e2 || !e3) {
              alert('Please answer all questions');
              return null;
            }
            
            let correct = 0;
            if (e1 === 18 || e1 === 21) correct++;
            if (e2 === 'correct') correct++;
            if (e3 === 'correct') correct++;
            
            return Math.round((correct / 3) * 100);
          }
        }
      },
      economics: {
        act1: {
          html: `
            <div style="background: #f5f6f8; padding: 24px; border-radius: 12px;">
              <h3 style="color: #1f2933; margin-top: 0; font-size: 1.4rem;">📈 Supply and Demand</h3>
              <p style="color: #636d79; margin-bottom: 24px; font-size: 0.95rem;">Understand basic market mechanisms and pricing.</p>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #4caf50;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">1. When supply decreases and demand stays the same, price:</p>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="econ1" value="correct" style="margin-right: 10px; cursor: pointer;"> Increases
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="econ1" value="wrong" style="margin-right: 10px; cursor: pointer;"> Decreases
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="econ1" value="wrong" style="margin-right: 10px; cursor: pointer;"> Stays the same
                    </label>
                  </div>
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #2196f3;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">2. The equilibrium point in a market is where:</p>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="econ2" value="correct" style="margin-right: 10px; cursor: pointer;"> Supply equals demand
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="econ2" value="wrong" style="margin-right: 10px; cursor: pointer;"> Supply exceeds demand
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="econ2" value="wrong" style="margin-right: 10px; cursor: pointer;"> Demand exceeds supply
                    </label>
                  </div>
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #ff9800;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">3. When demand increases and supply stays the same, price:</p>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="econ3" value="correct" style="margin-right: 10px; cursor: pointer;"> Increases
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="econ3" value="wrong" style="margin-right: 10px; cursor: pointer;"> Decreases
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="econ3" value="wrong" style="margin-right: 10px; cursor: pointer;"> Stays the same
                    </label>
                  </div>
                </div>
              </div>
              
              <button onclick="window.submitActivity()" style="
                width: 100%;
                padding: 12px;
                background: #059669;
                color: white;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                font-family: 'Bai Jamjuree', sans-serif;
                font-size: 0.95rem;
              ">Submit ✓</button>
            </div>
          `,
          validate: () => {
            const e1 = document.querySelector('input[name="econ1"]:checked')?.value;
            const e2 = document.querySelector('input[name="econ2"]:checked')?.value;
            const e3 = document.querySelector('input[name="econ3"]:checked')?.value;
            
            if (!e1 || !e2 || !e3) {
              alert('Please answer all questions');
              return null;
            }
            
            let correct = 0;
            if (e1 === 'correct') correct++;
            if (e2 === 'correct') correct++;
            if (e3 === 'correct') correct++;
            
            return Math.round((correct / 3) * 100);
          }
        },
        act2: {
          html: `
            <div style="background: #f5f6f8; padding: 24px; border-radius: 12px;">
              <h3 style="color: #1f2933; margin-top: 0; font-size: 1.4rem;">🌐 Economic Systems</h3>
              <p style="color: #636d79; margin-bottom: 24px; font-size: 0.95rem;">Compare capitalism, socialism, and mixed economies.</p>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #4caf50;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">1. In capitalism, resources are owned by:</p>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="sys1" value="correct" style="margin-right: 10px; cursor: pointer;"> Private individuals and businesses
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="sys1" value="wrong" style="margin-right: 10px; cursor: pointer;"> The government
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="sys1" value="wrong" style="margin-right: 10px; cursor: pointer;"> Workers' collectives
                    </label>
                  </div>
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #2196f3;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">2. A mixed economy combines:</p>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="sys2" value="wrong" style="margin-right: 10px; cursor: pointer;"> Only capitalism
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="sys2" value="correct" style="margin-right: 10px; cursor: pointer;"> Both capitalism and socialism
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="sys2" value="wrong" style="margin-right: 10px; cursor: pointer;"> Only socialism
                    </label>
                  </div>
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #ff9800;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">3. In socialism, the focus is on:</p>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="sys3" value="wrong" style="margin-right: 10px; cursor: pointer;"> Individual profit
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="sys3" value="correct" style="margin-right: 10px; cursor: pointer;"> Collective welfare and equal distribution
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="sys3" value="wrong" style="margin-right: 10px; cursor: pointer;"> Free market competition
                    </label>
                  </div>
                </div>
              </div>
              
              <button onclick="window.submitActivity()" style="
                width: 100%;
                padding: 12px;
                background: #059669;
                color: white;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                font-family: 'Bai Jamjuree', sans-serif;
                font-size: 0.95rem;
              ">Submit ✓</button>
            </div>
          `,
          validate: () => {
            const s1 = document.querySelector('input[name="sys1"]:checked')?.value;
            const s2 = document.querySelector('input[name="sys2"]:checked')?.value;
            const s3 = document.querySelector('input[name="sys3"]:checked')?.value;
            
            if (!s1 || !s2 || !s3) {
              alert('Please answer all questions');
              return null;
            }
            
            let correct = 0;
            if (s1 === 'correct') correct++;
            if (s2 === 'correct') correct++;
            if (s3 === 'correct') correct++;
            
            return Math.round((correct / 3) * 100);
          }
        },
        act3: {
          html: `
            <div style="background: #f5f6f8; padding: 24px; border-radius: 12px;">
              <h3 style="color: #1f2933; margin-top: 0; font-size: 1.4rem;">💰 Personal Finance</h3>
              <p style="color: #636d79; margin-bottom: 24px; font-size: 0.95rem;">Learn budgeting and investing basics.</p>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #4caf50;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">1. If you earn $1000/month and spend $700, how much can you save?</p>
                  <input type="number" id="fin1" placeholder="Amount" style="width: 100%; padding: 10px; border: 1px solid #d0d5db; border-radius: 6px; font-family: 'Bai Jamjuree', sans-serif;" />
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #2196f3;">
                  <p style="font-weight: 610; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">2. What should be the main purpose of a budget?</p>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="fin2" value="correct" style="margin-right: 10px; cursor: pointer;"> To track income and expenses
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="fin2" value="wrong" style="margin-right: 10px; cursor: pointer;"> To avoid paying bills
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="fin2" value="wrong" style="margin-right: 10px; cursor: pointer;"> To spend more money
                    </label>
                  </div>
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #ff9800;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">3. What is compound interest?</p>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="fin3" value="correct" style="margin-right: 10px; cursor: pointer;"> Interest earned on interest
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="fin3" value="wrong" style="margin-right: 10px; cursor: pointer;"> A type of bank account
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="fin3" value="wrong" style="margin-right: 10px; cursor: pointer;"> A discount on purchases
                    </label>
                  </div>
                </div>
              </div>
              
              <button onclick="window.submitActivity()" style="
                width: 100%;
                padding: 12px;
                background: #059669;
                color: white;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                font-family: 'Bai Jamjuree', sans-serif;
                font-size: 0.95rem;
              ">Submit ✓</button>
            </div>
          `,
          validate: () => {
            const f1 = parseInt(document.getElementById('fin1')?.value);
            const f2 = document.querySelector('input[name="fin2"]:checked')?.value;
            const f3 = document.querySelector('input[name="fin3"]:checked')?.value;
            
            if (isNaN(f1) || !f2 || !f3) {
              alert('Please answer all questions');
              return null;
            }
            
            let correct = 0;
            if (f1 === 300) correct++;
            if (f2 === 'correct') correct++;
            if (f3 === 'correct') correct++;
            
            return Math.round((correct / 3) * 100);
          }
        }
      },
      culture: {
        act1: {
          html: `
            <div style="background: #f5f6f8; padding: 24px; border-radius: 12px;">
              <h3 style="color: #1f2933; margin-top: 0; font-size: 1.4rem;">🎭 Cultural Traditions</h3>
              <p style="color: #636d79; margin-bottom: 24px; font-size: 0.95rem;">Research customs from different cultures around the world.</p>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #4caf50;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">1. Diwali is a major festival celebrated in:</p>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="cult1" value="correct" style="margin-right: 10px; cursor: pointer;"> India
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="cult1" value="wrong" style="margin-right: 10px; cursor: pointer;"> Japan
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="cult1" value="wrong" style="margin-right: 10px; cursor: pointer;"> Mexico
                    </label>
                  </div>
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #2196f3;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">2. The Lunar New Year is traditionally celebrated by:</p>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="cult2" value="wrong" style="margin-right: 10px; cursor: pointer;"> Europeans
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="cult2" value="correct" style="margin-right: 10px; cursor: pointer;"> East Asian cultures (China, Vietnam, Korea)
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="cult2" value="wrong" style="margin-right: 10px; cursor: pointer;"> African cultures
                    </label>
                  </div>
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #ff9800;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">3. What is a cultural tradition?</p>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="cult3" value="correct" style="margin-right: 10px; cursor: pointer;"> Customs and practices passed down through generations
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="cult3" value="wrong" style="margin-right: 10px; cursor: pointer;"> A modern entertainment style
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="cult3" value="wrong" style="margin-right: 10px; cursor: pointer;"> A political movement
                    </label>
                  </div>
                </div>
              </div>
              
              <button onclick="window.submitActivity()" style="
                width: 100%;
                padding: 12px;
                background: #059669;
                color: white;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                font-family: 'Bai Jamjuree', sans-serif;
                font-size: 0.95rem;
              ">Submit ✓</button>
            </div>
          `,
          validate: () => {
            const c1 = document.querySelector('input[name="cult1"]:checked')?.value;
            const c2 = document.querySelector('input[name="cult2"]:checked')?.value;
            const c3 = document.querySelector('input[name="cult3"]:checked')?.value;
            
            if (!c1 || !c2 || !c3) {
              alert('Please answer all questions');
              return null;
            }
            
            let correct = 0;
            if (c1 === 'correct') correct++;
            if (c2 === 'correct') correct++;
            if (c3 === 'correct') correct++;
            
            return Math.round((correct / 3) * 100);
          }
        },
        act2: {
          html: `
            <div style="background: #f5f6f8; padding: 24px; border-radius: 12px;">
              <h3 style="color: #1f2933; margin-top: 0; font-size: 1.4rem;">🗣️ Languages and Communication</h3>
              <p style="color: #636d79; margin-bottom: 24px; font-size: 0.95rem;">Learn about linguistic diversity and global communication.</p>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #4caf50;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">1. How many languages are spoken in the world today?</p>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="lang1" value="wrong" style="margin-right: 10px; cursor: pointer;"> Around 500
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="lang1" value="correct" style="margin-right: 10px; cursor: pointer;"> Over 7000
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="lang1" value="wrong" style="margin-right: 10px; cursor: pointer;"> Around 1000
                    </label>
                  </div>
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #2196f3;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">2. What is multilingualism?</p>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="lang2" value="correct" style="margin-right: 10px; cursor: pointer;"> Ability to speak multiple languages
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="lang2" value="wrong" style="margin-right: 10px; cursor: pointer;"> Speaking one language poorly
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="lang2" value="wrong" style="margin-right: 10px; cursor: pointer;"> A type of accent
                    </label>
                  </div>
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #ff9800;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">3. Which language has the most native speakers?</p>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="lang3" value="correct" style="margin-right: 10px; cursor: pointer;"> Mandarin Chinese
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="lang3" value="wrong" style="margin-right: 10px; cursor: pointer;"> English
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="lang3" value="wrong" style="margin-right: 10px; cursor: pointer;"> Spanish
                    </label>
                  </div>
                </div>
              </div>
              
              <button onclick="window.submitActivity()" style="
                width: 100%;
                padding: 12px;
                background: #059669;
                color: white;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                font-family: 'Bai Jamjuree', sans-serif;
                font-size: 0.95rem;
              ">Submit ✓</button>
            </div>
          `,
          validate: () => {
            const l1 = document.querySelector('input[name="lang1"]:checked')?.value;
            const l2 = document.querySelector('input[name="lang2"]:checked')?.value;
            const l3 = document.querySelector('input[name="lang3"]:checked')?.value;
            
            if (!l1 || !l2 || !l3) {
              alert('Please answer all questions');
              return null;
            }
            
            let correct = 0;
            if (l1 === 'correct') correct++;
            if (l2 === 'correct') correct++;
            if (l3 === 'correct') correct++;
            
            return Math.round((correct / 3) * 100);
          }
        },
        act3: {
          html: `
            <div style="background: #f5f6f8; padding: 24px; border-radius: 12px;">
              <h3 style="color: #1f2933; margin-top: 0; font-size: 1.4rem;">🎨 Art and Music</h3>
              <p style="color: #636d79; margin-bottom: 24px; font-size: 0.95rem;">Explore cultural artistic expressions and music forms.</p>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #4caf50;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">1. Opera originated in which country?</p>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="art1" value="correct" style="margin-right: 10px; cursor: pointer;"> Italy
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="art1" value="wrong" style="margin-right: 10px; cursor: pointer;"> France
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="art1" value="wrong" style="margin-right: 10px; cursor: pointer;"> Germany
                    </label>
                  </div>
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #2196f3;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">2. Jazz music originated in:</p>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="art2" value="correct" style="margin-right: 10px; cursor: pointer;"> United States (New Orleans)
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="art2" value="wrong" style="margin-right: 10px; cursor: pointer;"> Brazil
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="art2" value="wrong" style="margin-right: 10px; cursor: pointer;"> Africa
                    </label>
                  </div>
                </div>
              </div>
              
              <div style="margin-bottom: 28px;">
                <div style="background: white; padding: 18px; border-radius: 8px; border-left: 4px solid #ff9800;">
                  <p style="font-weight: 600; color: #1f2933; margin: 0 0 14px 0; font-size: 1.05rem;">3. What is the primary purpose of art in culture?</p>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="art3" value="correct" style="margin-right: 10px; cursor: pointer;"> Express ideas, emotions, and values
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="art3" value="wrong" style="margin-right: 10px; cursor: pointer;"> Make money
                    </label>
                    <label style="padding: 10px; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; border: 2px solid #e0e0e0; font-weight: 500;">
                      <input type="radio" name="art3" value="wrong" style="margin-right: 10px; cursor: pointer;"> Decorate walls
                    </label>
                  </div>
                </div>
              </div>
              
              <button onclick="window.submitActivity()" style="
                width: 100%;
                padding: 12px;
                background: #059669;
                color: white;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                font-family: 'Bai Jamjuree', sans-serif;
                font-size: 0.95rem;
              ">Submit ✓</button>
            </div>
          `,
          validate: () => {
            const a1 = document.querySelector('input[name="art1"]:checked')?.value;
            const a2 = document.querySelector('input[name="art2"]:checked')?.value;
            const a3 = document.querySelector('input[name="art3"]:checked')?.value;
            
            if (!a1 || !a2 || !a3) {
              alert('Please answer all questions');
              return null;
            }
            
            let correct = 0;
            if (a1 === 'correct') correct++;
            if (a2 === 'correct') correct++;
            if (a3 === 'correct') correct++;
            
            return Math.round((correct / 3) * 100);
          }
          }
        }
      }
    }
  };
  
  return activities[subject]?.[moduleId]?.[activityId] || {};
}

window.submitActivity = function() {
  if (!window.currentActivityData) return;
  
  const score = window.currentActivityData.validate();
  
  if (score === null) return;
  
  const { moduleId, activityId, modal } = window.currentActivityData;
  
  showLoadingScreen();
  setTimeout(() => {
    adaptiveInstance.recordActivity(moduleId, score);
    
    if (!adaptiveInstance.studentData.completedActivities) {
      adaptiveInstance.studentData.completedActivities = {};
    }
    if (!adaptiveInstance.studentData.completedActivities[moduleId]) {
      adaptiveInstance.studentData.completedActivities[moduleId] = {};
    }
    adaptiveInstance.studentData.completedActivities[moduleId][activityId] = {
      completed: true,
      score: score,
      timestamp: new Date().toISOString()
    };
    
    if (!adaptiveInstance.studentData.completedModules.includes(moduleId)) {
      adaptiveInstance.studentData.completedModules.push(moduleId);
    }
    adaptiveInstance.saveStudentData();
    
    modal.remove();
    hideLoadingScreen();

    showCompletionToast(score);
    showImprovementRecommendations(score, moduleId);
    
    updateDashboard();
    
    window.currentActivityData = null;
  }, 800);
};

function getImprovementRecommendations(score) {
  const recommendations = {
    excellent: [
      '🌟 Outstanding performance! You\ve mastered this concept.',
      '💡 Challenge yourself with more advanced activities in related topics.',
      '📚 Consider helping peers who are still learning this material.',
      '🎯 You\'re on an excellent learning trajectory!'
    ],
    great: [
      '✨ Great job! You have a solid understanding of this topic.',
      '📖 Review the more challenging questions to solidify your knowledge.',
      '🔄 Retake this activity to push for a perfect score.',
      '🚀 Move on to the next module when ready!'
    ],
    good: [
      '👍 Good effort! You\'re making solid progress.',
      '📝 Review the key concepts you found tricky.',
      '🔍 Focus on understanding the "why" behind each answer.',
      '💪 Retake this activity to improve your score further.'
    ],
    fair: [
      '📚 You\'re getting there! Keep practicing.',
      '🎯 Focus on the main concepts of this topic.',
      '✏️ Take detailed notes on areas where you struggled.',
      '🔄 Try the activity again after reviewing the material.'
    ],
    needsWork: [
      '💡 This is an opportunity to learn and improve!',
      '📖 Review the fundamentals of this topic carefully.',
      '❓ Don\'t hesitate to ask for help or clarification.',
      '🔄 Retake this activity multiple times to build confidence.'
    ]
  };

  if (score >= 90) return recommendations.excellent;
  if (score >= 75) return recommendations.great;
  if (score >= 60) return recommendations.good;
  if (score >= 45) return recommendations.fair;
  return recommendations.needsWork;
}

function showImprovementRecommendations(score, moduleId) {
  const recommendations = getImprovementRecommendations(score);
  
  const modal = document.createElement('div');
  modal.id = 'recommendationModal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3999;
    animation: fadeIn 0.3s ease;
  `;
  
  let scoreColor = '#4caf50';
  let scoreLabel = 'Excellent';
  if (score < 90) scoreColor = '#2196f3';
  if (score < 75) scoreColor = '#ff9800';
  if (score < 60) scoreColor = '#f44336';
  if (score < 45) scoreLabel = 'Needs Work';
  else if (score < 60) scoreLabel = 'Fair';
  else if (score < 75) scoreLabel = 'Good';
  else if (score < 90) scoreLabel = 'Great';
  
  modal.innerHTML = `
    <style>
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideUp {
        from {
          transform: translateY(30px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
    </style>
    <div style="
      background: white;
      border-radius: 16px;
      padding: 32px;
      max-width: 500px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      animation: slideUp 0.4s ease;
    ">
      <div style="text-align: center; margin-bottom: 28px;">
        <h2 style="color: #1f2933; margin: 0 0 12px 0; font-size: 1.5rem;">Activity Complete!</h2>
        <div style="
          width: 100px;
          height: 100px;
          margin: 16px auto;
          border-radius: 50%;
          background: ${scoreColor};
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 2rem;
          font-weight: 700;
        ">${score}%</div>
        <p style="color: #636d79; margin: 0; font-size: 1.1rem; font-weight: 600;">${scoreLabel} Performance</p>
      </div>
      
      <div style="
        background: #f5f6f8;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 24px;
      ">
        <h3 style="color: #1f2933; margin: 0 0 16px 0; font-size: 1.1rem;">📋 Areas for Improvement</h3>
        <ul style="margin: 0; padding: 0; list-style: none;">
          ${recommendations.map((rec, i) => `
            <li style="
              padding: 10px 0;
              color: #475569;
              border-bottom: ${i < recommendations.length - 1 ? '1px solid #e0e0e0' : 'none'};
              font-size: 0.95rem;
              line-height: 1.6;
            ">${rec}</li>
          `).join('')}
        </ul>
      </div>
      
      <div style="display: flex; gap: 12px;">
        <button onclick="document.getElementById('recommendationModal')?.remove()" style="
          flex: 1;
          padding: 12px;
          background: #f5f6f8;
          color: #1f2933;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Bai Jamjuree', sans-serif;
          font-size: 0.95rem;
        ">Back to Module</button>
        <button onclick="location.reload()" style="
          flex: 1;
          padding: 12px;
          background: #0097b2;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Bai Jamjuree', sans-serif;
          font-size: 0.95rem;
        ">Continue Learning</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

function showCompletionToast(score) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    font-weight: 600;
    z-index: 4000;
    animation: slideInRight 0.4s ease;
    font-family: 'Bai Jamjuree', sans-serif;
  `;
  
  toast.innerHTML = `
    <style>
      @keyframes slideInRight {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    </style>
    ✓ Great work! Score: ${score}%
  `;
  
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

document.addEventListener('DOMContentLoaded', function() {
  const navButtons = document.querySelectorAll('.nav-btn');
  
  navButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      const target = this.getAttribute('data-target');
      const targetElement = document.getElementById(target);
      
      if (targetElement) {
        showLoadingScreen();
        setTimeout(() => {
          hideLoadingScreen();
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }, 800);
      }
    });
  });

  const subjectCards = document.querySelectorAll('.subject-card');
  subjectCards.forEach(card => {
    card.addEventListener('click', function(e) {
      if (e.target.tagName === 'A') return;
      
      const href = this.getAttribute('data-href');
      if (href) {
        showLoadingScreen();
        setTimeout(() => {
          window.location.href = href;
        }, 1000);
      }
    });
  });
});