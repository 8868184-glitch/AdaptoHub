class SkillTreeSystem {
  constructor() {
    this.storageKey = 'adaptohub_skill_tree';
    this.prerequisitesKey = 'adaptohub_prerequisites';
    this.unlockedUnitsKey = 'adaptohub_unlocked_units';

    this.skillTrees = {
      science: {
        physics: [
          { id: 'p1', name: 'Mechanics Basics', level: 1, prerequisites: [] },
          { id: 'p2', name: 'Forces & Motion', level: 2, prerequisites: ['p1'] },
          { id: 'p3', name: 'Energy & Work', level: 2, prerequisites: ['p1'] },
          { id: 'p4', name: 'Waves & Sound', level: 3, prerequisites: ['p2', 'p3'] },
          { id: 'p5', name: 'Light & Optics', level: 3, prerequisites: ['p2'] },
          { id: 'p6', name: 'Electromagnetism', level: 4, prerequisites: ['p4', 'p5'] },
          { id: 'p7', name: 'Modern Physics', level: 4, prerequisites: ['p6'] }
        ],
        chemistry: [
          { id: 'c1', name: 'Atomic Structure', level: 1, prerequisites: [] },
          { id: 'c2', name: 'Chemical Bonding', level: 2, prerequisites: ['c1'] },
          { id: 'c3', name: 'States of Matter', level: 2, prerequisites: ['c1'] },
          { id: 'c4', name: 'Chemical Reactions', level: 3, prerequisites: ['c2', 'c3'] },
          { id: 'c5', name: 'Thermodynamics', level: 3, prerequisites: ['c4'] },
          { id: 'c6', name: 'Organic Chemistry', level: 4, prerequisites: ['c2', 'c4'] }
        ],
        biology: [
          { id: 'b1', name: 'Cell Biology', level: 1, prerequisites: [] },
          { id: 'b2', name: 'Genetics', level: 2, prerequisites: ['b1'] },
          { id: 'b3', name: 'Evolution', level: 2, prerequisites: ['b1'] },
          { id: 'b4', name: 'Ecology', level: 3, prerequisites: ['b3'] },
          { id: 'b5', name: 'Physiology', level: 3, prerequisites: ['b1', 'b2'] },
          { id: 'b6', name: 'Molecular Biology', level: 4, prerequisites: ['b2', 'b5'] }
        ]
      },
      mathematics: {
        algebra: [
          { id: 'a1', name: 'Basic Operations', level: 1, prerequisites: [] },
          { id: 'a2', name: 'Equations', level: 2, prerequisites: ['a1'] },
          { id: 'a3', name: 'Polynomials', level: 2, prerequisites: ['a1'] },
          { id: 'a4', name: 'Factoring', level: 3, prerequisites: ['a3'] },
          { id: 'a5', name: 'Complex Numbers', level: 3, prerequisites: ['a2', 'a4'] },
          { id: 'a6', name: 'Abstract Algebra', level: 4, prerequisites: ['a5'] }
        ]
      }
    };
    
    this.initializeData();
  }

  initializeData() {
    const existing = localStorage.getItem(this.storageKey);
    if (!existing) {
      localStorage.setItem(this.storageKey, JSON.stringify({
        subject: 'science',
        activeModule: 'physics'
      }));
    }
  }

  getSkillTree(subject, module) {
    if (this.skillTrees[subject] && this.skillTrees[subject][module]) {
      return this.skillTrees[subject][module];
    }
    return [];
  }

  isUnitUnlocked(subject, module, unitId) {
    const unlockedUnits = JSON.parse(localStorage.getItem(this.unlockedUnitsKey) || '{}');
    const key = `${subject}_${module}`;
    
    if (!unlockedUnits[key]) {
      unlockedUnits[key] = [];
    }

    const unit = this.getSkillTree(subject, module).find(u => u.id === unitId);
    if (!unit) return false;

    if (unit.level === 1 && unit.prerequisites.length === 0) {
      if (!unlockedUnits[key].includes(unitId)) {
        unlockedUnits[key].push(unitId);
        localStorage.setItem(this.unlockedUnitsKey, JSON.stringify(unlockedUnits));
      }
      return true;
    }

    return unit.prerequisites.every(prereq => 
      unlockedUnits[key].includes(prereq)
    );
  }

  unlockUnit(subject, module, unitId, score = 100) {
    const unit = this.getSkillTree(subject, module).find(u => u.id === unitId);
    if (!unit) return false;

    const unlockedUnits = JSON.parse(localStorage.getItem(this.unlockedUnitsKey) || '{}');
    const key = `${subject}_${module}`;

    if (!unlockedUnits[key]) {
      unlockedUnits[key] = [];
    }

    const allPrereqsMet = unit.prerequisites.every(prereq => 
      unlockedUnits[key].includes(prereq)
    );

    if (allPrereqsMet && !unlockedUnits[key].includes(unitId)) {
      unlockedUnits[key].push(unitId);
      localStorage.setItem(this.unlockedUnitsKey, JSON.stringify(unlockedUnits));
      
      // Store unit completion data with score
      const progressKey = `adaptohub_${module}_units`;
      const progress = JSON.parse(localStorage.getItem(progressKey) || '{}');
      progress[unitId] = {
        completed: true,
        score: score,
        completedAt: Date.now()
      };
      localStorage.setItem(progressKey, JSON.stringify(progress));
      
      return true;
    }

    return false;
  }

  getNextUnlockableUnits(subject, module) {
    const unlockedUnits = JSON.parse(localStorage.getItem(this.unlockedUnitsKey) || '{}');
    const key = `${subject}_${module}`;

    if (!unlockedUnits[key]) {
      unlockedUnits[key] = [];
    }

    const tree = this.getSkillTree(subject, module);
    return tree.filter(unit => {
      if (unlockedUnits[key].includes(unit.id)) return false;
      
      return unit.prerequisites.every(prereq => 
        unlockedUnits[key].includes(prereq)
      );
    });
  }

  getModuleCompletion(subject, module) {
    const progress = JSON.parse(localStorage.getItem(`adaptohub_${module}_units`) || '{}');
    const completed = Object.values(progress).filter(u => u.completed).length;
    const total = this.getSkillTree(subject, module).length;
    
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }

  getModuleUnitsWithStatus(subject, module) {
    const progress = JSON.parse(localStorage.getItem(`adaptohub_${module}_units`) || '{}');
    const unlockedUnits = JSON.parse(localStorage.getItem(this.unlockedUnitsKey) || '{}');
    const key = `${subject}_${module}`;

    if (!unlockedUnits[key]) {
      unlockedUnits[key] = [];
    }

    return this.getSkillTree(subject, module).map(unit => {
      const isInUnlockedList = unlockedUnits[key].includes(unit.id);
      const isLevel1NoPrereqs = unit.level === 1 && unit.prerequisites.length === 0;
      const allPrereqsMet = unit.prerequisites.length > 0 && 
                            unit.prerequisites.every(prereq => unlockedUnits[key].includes(prereq));
      
      return {
        ...unit,
        completed: progress[unit.id]?.completed || false,
        score: progress[unit.id]?.score || 0,
        unlocked: isInUnlockedList || isLevel1NoPrereqs || allPrereqsMet
      };
    });
  }

  checkAndUnlockDependents(subject, module, unitId) {
    const unlockedUnits = JSON.parse(localStorage.getItem(this.unlockedUnitsKey) || '{}');
    const key = `${subject}_${module}`;

    if (!unlockedUnits[key]) {
      unlockedUnits[key] = [];
    }

    const tree = this.getSkillTree(subject, module);
    let newUnlocks = [];

    tree.forEach(unit => {
      if (unit.prerequisites.includes(unitId)) {
        if (this.unlockUnit(subject, module, unit.id)) {
          newUnlocks.push(unit);
        }
      }
    });

    return newUnlocks;
  }

  estimateMastery(subject, module) {
    const progress = JSON.parse(localStorage.getItem(`adaptohub_${module}_units`) || '{}');
    const units = this.getSkillTree(subject, module);
    
    if (units.length === 0) return 0;

    let totalScore = 0;
    let completedCount = 0;

    Object.values(progress).forEach(unit => {
      if (unit.completed && typeof unit.score === 'number') {
        totalScore += unit.score;
        completedCount++;
      }
    });

    return completedCount > 0 ? Math.round(totalScore / completedCount) : 0;
  }

  getRecommendations(subject, module) {
    const nextUnits = this.getNextUnlockableUnits(subject, module);
    const progress = JSON.parse(localStorage.getItem(`adaptohub_${module}_units`) || '{}');
    const tree = this.getSkillTree(subject, module);

    const recommended = nextUnits.sort((a, b) => a.level - b.level);

    const weakAreas = tree
      .filter(unit => progress[unit.id]?.completed && progress[unit.id]?.score < 70)
      .sort((a, b) => (progress[a.id]?.score || 0) - (progress[b.id]?.score || 0));

    return {
      nextToLearn: recommended.slice(0, 3),
      needsReview: weakAreas.slice(0, 3),
      masteryPath: recommended
    };
  }
}

const skillTreeSystem = new SkillTreeSystem();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SkillTreeSystem;
}
