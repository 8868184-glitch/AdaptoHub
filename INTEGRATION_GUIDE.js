function submitQuiz(unitId) {
    const score = calculateScore();

    LoadingTips.show('mathematics', 'Calculating your score...');
    
    setTimeout(() => {
        LoadingTips.hide();

        if (window.Celebrations) {
            if (score === 100) {
                Celebrations.perfectScore();
            } else {
                Celebrations.quizComplete(score);
            }
        }

        updateUserStats(score);

        checkAchievements(unitId, score);

    }, 1500);
}

function updateUserStats(score) {
    const totalQuizzes = parseInt(localStorage.getItem('adaptohub_total_quizzes') || '0') + 1;
    localStorage.setItem('adaptohub_total_quizzes', totalQuizzes);
    
    if (score === 100) {
        const perfectScores = parseInt(localStorage.getItem('adaptohub_perfect_scores') || '0') + 1;
        localStorage.setItem('adaptohub_perfect_scores', perfectScores);
    }

    const scores = JSON.parse(localStorage.getItem('adaptohub_all_scores') || '[]');
    scores.push(score);
    localStorage.setItem('adaptohub_all_scores', JSON.stringify(scores));
    
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    localStorage.setItem('adaptohub_avg_score', avg);

    if (window.AvatarSystem) {
        AvatarSystem.checkUnlocks();
    }
}

function checkAchievements(unitId, score) {
    if (!window.Celebrations) return;
    
    const storageKey = 'adaptohub_algebra_first';
    const isFirst = !localStorage.getItem(storageKey);
    
    if (isFirst && score >= 70) {
        localStorage.setItem(storageKey, 'true');
        Celebrations.firstCompletion('algebra');
    }
}

function markUnitComplete(unitId) {
    
    if (window.Celebrations) {
        Celebrations.unitComplete();
    }

    updateCompletedSubjects();
}

function updateCompletedSubjects() {
    const subjects = JSON.parse(localStorage.getItem('adaptohub_active_subjects') || '[]');
    const currentSubject = 'algebra';
    
    if (!subjects.includes(currentSubject)) {
        subjects.push(currentSubject);
        localStorage.setItem('adaptohub_active_subjects', subjects.length);
    }
}

function nextQuestion() {
    if (window.QuizAnimations) {
        QuizAnimations.transitionQuiz(() => {
            loadNextQuestion();
        });
    } else {
        loadNextQuestion();
    }
}

function loadQuizData(unitId) {
    LoadingTips.show('mathematics', 'Preparing your quiz...');
    
    fetch(`/api/quiz/${unitId}`)
        .then(response => response.json())
        .then(data => {
            LoadingTips.hide();
            renderQuiz(data);
        })
        .catch(error => {
            LoadingTips.hide();
            console.error('Error loading quiz:', error);
        });
}

function updateStreak() {
    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem('adaptohub_last_visit');
    const streak = parseInt(localStorage.getItem('adaptohub_streak') || '0');
    
    if (lastVisit !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();
        
        if (lastVisit === yesterdayStr) {
            const newStreak = streak + 1;
            localStorage.setItem('adaptohub_streak', newStreak);

            if (window.Celebrations && [3, 7, 14, 30, 100].includes(newStreak)) {
                Celebrations.streakMilestone(newStreak);
            }
        } else {
            localStorage.setItem('adaptohub_streak', '1');
        }
        
        localStorage.setItem('adaptohub_last_visit', today);
    }
}

function updateMetricsDisplay() {
    const completionEl = document.getElementById('completionRate');
    const avgScoreEl = document.getElementById('averageScore');
    
    if (completionEl && window.QuizAnimations) {
        const newCompletion = calculateCompletionRate();
        QuizAnimations.animateCounter(completionEl, 0, newCompletion, 1000);
    }
    
    if (avgScoreEl && window.QuizAnimations) {
        const newAvg = parseInt(localStorage.getItem('adaptohub_avg_score') || '0');
        QuizAnimations.animateCounter(avgScoreEl, 0, newAvg, 1000);
    }
}

function completeSubmitQuizExample(unitId) {
    const answers = collectUserAnswers();
    
    if (!validateAnswers(answers)) {
        alert('Please answer all questions');
        return;
    }

    LoadingTips.show('mathematics', 'Grading your quiz...');

    setTimeout(() => {
        const score = calculateScore(answers);
        const passed = score >= 70;

        LoadingTips.hide();

        if (window.Celebrations) {
            if (score === 100) {
                Celebrations.perfectScore();
            } else {
                Celebrations.quizComplete(score);
            }
        }

        saveProgress(unitId, score, passed);

        updateUserStats(score);
        updateStreak();

        checkAchievements(unitId, score);

        displayResult(score, passed);

        updateMetricsDisplay();
        
    }, 1500);
}
