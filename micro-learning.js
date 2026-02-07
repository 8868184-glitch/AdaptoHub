const MicroLearning = {
  quickLessons: [
    {
      id: 'micro-001',
      title: 'Order of Operations (PEMDAS)',
      duration: '5 min',
      subject: 'mathematics',
      topic: 'algebra',
      content: 'Learn the sequence: Parentheses → Exponents → Multiplication/Division → Addition/Subtraction',
      keyPoints: [
        'Solve operations inside parentheses first',
        'Exponents come next',
        'Multiply and divide left to right',
        'Add and subtract last'
      ],
      example: '2 + 3 × 4 = 2 + 12 = 14 (NOT 5 × 4 = 20)',
      quiz: [
        { q: 'What is 10 ÷ 2 + 3?', options: ['8', '5', '13', '2'], correct: 0 },
        { q: 'Solve: 5 × (2 + 3)', options: ['13', '25', '10', '15'], correct: 1 }
      ]
    },
    {
      id: 'micro-002',
      title: 'Photosynthesis in 5 Minutes',
      duration: '5 min',
      subject: 'science',
      topic: 'biology',
      content: 'How plants convert sunlight into energy',
      keyPoints: [
        'Occurs in plant leaves (chloroplasts)',
        'Requires sunlight, water, and CO2',
        'Produces glucose and oxygen',
        'Oxygen is a waste product for plants!'
      ],
      example: 'Equation: 6CO2 + 6H2O + Light → C6H12O6 + 6O2',
      quiz: [
        { q: 'What do plants need for photosynthesis?', options: ['Just water', 'Sunlight, water, CO2', 'Just sunlight', 'Only nutrients'], correct: 1 },
        { q: 'What gas is released by plants?', options: ['CO2', 'N2', 'O2', 'H2'], correct: 2 }
      ]
    },
    {
      id: 'micro-003',
      title: 'Prime Numbers Explained',
      duration: '5 min',
      subject: 'mathematics',
      topic: 'number_theory',
      content: 'Numbers divisible only by 1 and themselves',
      keyPoints: [
        'Prime: only factors are 1 and itself',
        'Example primes: 2, 3, 5, 7, 11, 13',
        '2 is the only even prime number',
        'Used in encryption and computer security'
      ],
      example: '17 is prime (factors: 1, 17). 18 is NOT prime (factors: 1, 2, 3, 6, 9, 18)',
      quiz: [
        { q: 'Which is a prime number?', options: ['15', '17', '18', '20'], correct: 1 },
        { q: 'Is 1 considered prime?', options: ['Yes', 'No', 'Sometimes', 'Undefined'], correct: 1 }
      ]
    }
  ],

  dailyChallenges: [
    {
      id: 'challenge-001',
      difficulty: 'Easy',
      category: 'Mathematics',
      question: 'If a train travels 60 km/h for 2.5 hours, how far does it travel?',
      options: ['120 km', '150 km', '60 km', '100 km'],
      correct: 1,
      explanation: 'Distance = Speed × Time = 60 × 2.5 = 150 km',
      points: 10
    },
    {
      id: 'challenge-002',
      difficulty: 'Medium',
      category: 'Science',
      question: 'What is the chemical symbol for gold?',
      options: ['Go', 'Gd', 'Au', 'Ag'],
      correct: 2,
      explanation: 'Gold (Au) comes from its Latin name "Aurum"',
      points: 15
    },
    {
      id: 'challenge-003',
      difficulty: 'Hard',
      category: 'Mathematics',
      question: 'What is the derivative of 3x²?',
      options: ['3x', '6x', '9x²', '3x³'],
      correct: 1,
      explanation: 'Using power rule: d/dx(3x²) = 3 × 2x^(2-1) = 6x',
      points: 25
    },
    {
      id: 'challenge-004',
      difficulty: 'Easy',
      category: 'Science',
      question: 'What is H2O commonly known as?',
      options: ['Oxygen', 'Water', 'Hydrogen', 'Peroxide'],
      correct: 1,
      explanation: 'H2O is the chemical formula for water (2 hydrogen atoms + 1 oxygen atom)',
      points: 10
    },
    {
      id: 'challenge-005',
      difficulty: 'Medium',
      category: 'Mathematics',
      question: 'What is 15% of 200?',
      options: ['25', '30', '35', '40'],
      correct: 1,
      explanation: '15% of 200 = 0.15 × 200 = 30',
      points: 15
    },
    {
      id: 'challenge-006',
      difficulty: 'Hard',
      category: 'Science',
      question: 'What is the speed of light in vacuum?',
      options: ['300,000 km/s', '150,000 km/s', '500,000 km/s', '100,000 km/s'],
      correct: 0,
      explanation: 'The speed of light in vacuum is approximately 300,000 km/s or 3×10⁸ m/s',
      points: 25
    },
    {
      id: 'challenge-007',
      difficulty: 'Easy',
      category: 'Mathematics',
      question: 'What is the area of a rectangle with length 8 and width 5?',
      options: ['13', '40', '20', '30'],
      correct: 1,
      explanation: 'Area of rectangle = length × width = 8 × 5 = 40',
      points: 10
    },
    {
      id: 'challenge-008',
      difficulty: 'Medium',
      category: 'Science',
      question: 'How many planets are in our solar system?',
      options: ['7', '8', '9', '10'],
      correct: 1,
      explanation: 'There are 8 planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune',
      points: 15
    },
    {
      id: 'challenge-009',
      difficulty: 'Hard',
      category: 'Mathematics',
      question: 'What is the value of π (pi) to 2 decimal places?',
      options: ['3.12', '3.14', '3.16', '3.18'],
      correct: 1,
      explanation: 'π (pi) is approximately 3.14159, which rounds to 3.14',
      points: 25
    },
    {
      id: 'challenge-010',
      difficulty: 'Easy',
      category: 'Science',
      question: 'What organ pumps blood throughout the body?',
      options: ['Lungs', 'Heart', 'Liver', 'Stomach'],
      correct: 1,
      explanation: 'The heart is the organ that pumps blood throughout the circulatory system',
      points: 10
    },
    {
      id: 'challenge-011',
      difficulty: 'Medium',
      category: 'Mathematics',
      question: 'Solve for x: 2x + 5 = 15',
      options: ['3', '5', '7', '10'],
      correct: 1,
      explanation: '2x + 5 = 15 → 2x = 10 → x = 5',
      points: 15
    },
    {
      id: 'challenge-012',
      difficulty: 'Hard',
      category: 'Science',
      question: 'What is the most abundant gas in Earth\'s atmosphere?',
      options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'],
      correct: 2,
      explanation: 'Nitrogen makes up about 78% of Earth\'s atmosphere',
      points: 25
    },
    {
      id: 'challenge-013',
      difficulty: 'Easy',
      category: 'Mathematics',
      question: 'What is 7 × 8?',
      options: ['54', '56', '64', '72'],
      correct: 1,
      explanation: '7 × 8 = 56',
      points: 10
    },
    {
      id: 'challenge-014',
      difficulty: 'Medium',
      category: 'Science',
      question: 'What force keeps us on the ground?',
      options: ['Magnetism', 'Gravity', 'Friction', 'Inertia'],
      correct: 1,
      explanation: 'Gravity is the force that attracts objects toward the center of Earth',
      points: 15
    },
    {
      id: 'challenge-015',
      difficulty: 'Hard',
      category: 'Mathematics',
      question: 'What is the square root of 144?',
      options: ['10', '11', '12', '13'],
      correct: 2,
      explanation: '√144 = 12 because 12 × 12 = 144',
      points: 25
    },
    {
      id: 'challenge-016',
      difficulty: 'Easy',
      category: 'Science',
      question: 'What is the freezing point of water in Celsius?',
      options: ['-10°C', '0°C', '10°C', '32°C'],
      correct: 1,
      explanation: 'Water freezes at 0°C (32°F)',
      points: 10
    },
    {
      id: 'challenge-017',
      difficulty: 'Medium',
      category: 'Mathematics',
      question: 'What is 3³ (3 cubed)?',
      options: ['6', '9', '27', '81'],
      correct: 2,
      explanation: '3³ = 3 × 3 × 3 = 27',
      points: 15
    },
    {
      id: 'challenge-018',
      difficulty: 'Hard',
      category: 'Science',
      question: 'What is the powerhouse of the cell?',
      options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Chloroplast'],
      correct: 2,
      explanation: 'Mitochondria produce ATP (energy) for the cell',
      points: 25
    },
    {
      id: 'challenge-019',
      difficulty: 'Easy',
      category: 'Mathematics',
      question: 'How many sides does a hexagon have?',
      options: ['5', '6', '7', '8'],
      correct: 1,
      explanation: 'A hexagon has 6 sides',
      points: 10
    },
    {
      id: 'challenge-020',
      difficulty: 'Medium',
      category: 'Science',
      question: 'What is the smallest unit of life?',
      options: ['Atom', 'Molecule', 'Cell', 'Organ'],
      correct: 2,
      explanation: 'The cell is the smallest unit that can perform all life processes',
      points: 15
    }
  ],

  brainTeasers: [
    {
      id: 'teaser-001',
      title: 'Mathematical Logic',
      description: 'Find the pattern',
      puzzle: '2, 4, 8, 16, ?',
      answer: '32',
      hint: 'Each number is multiplied by 2',
      category: 'Mathematics',
      difficulty: 'Easy'
    },
    {
      id: 'teaser-002',
      title: 'Word Problem',
      description: 'Use logic to solve',
      puzzle: 'I have 3 keys but no locks. I have room but no furniture. What am I?',
      answer: 'keyboard',
      hint: 'Think about computers',
      category: 'Logic',
      difficulty: 'Medium'
    },
    {
      id: 'teaser-003',
      title: 'Number Sequence',
      description: 'Continue the pattern',
      puzzle: '1, 1, 2, 3, 5, 8, ?',
      answer: '13',
      hint: 'Fibonacci sequence: each number is the sum of the previous two',
      category: 'Mathematics',
      difficulty: 'Medium'
    }
  ],

  init() {
    this.setupQuickLessons();
    this.setupDailyChallenges();
    this.setupBrainTeasers();
    this.loadUserProgress();
    console.log('✓ Micro-Learning initialized');
  },

  setupQuickLessons() {
    window.openQuickLesson = (lessonId) => {
      const lesson = this.quickLessons.find(l => l.id === lessonId);

      if (!lesson) {
        alert('Lesson not found');
        return;
      }

      const modal = document.createElement('div');
      modal.className = 'microlearning-modal';
      modal.id = 'lesson-modal';
      modal.innerHTML = `
        <div class="microlearning-modal-content lesson-wrapper">
          <button class="microlearning-close-btn" onclick="document.getElementById('lesson-modal').remove()">✕</button>
          
          <div class="lesson-header">
            <span class="lesson-timer">⏱️ ${lesson.duration}</span>
            <h2>${lesson.title}</h2>
            <p class="lesson-topic">${lesson.subject} → ${lesson.topic}</p>
          </div>

          <div class="lesson-content">
            <section class="lesson-section">
              <h3>📖 What You'll Learn</h3>
              <p>${lesson.content}</p>
            </section>

            <section class="lesson-section">
              <h3>🎯 Key Points</h3>
              <ul class="key-points">
                ${lesson.keyPoints.map(point => `
                  <li><span class="checkmark">✓</span> ${point}</li>
                `).join('')}
              </ul>
            </section>

            <section class="lesson-section">
              <h3>💡 Example</h3>
              <div class="example-box">
                <code>${lesson.example}</code>
              </div>
            </section>
          </div>

          <div class="lesson-actions">
            <button class="action-btn" onclick="MicroLearning.startQuiz('${lesson.id}')">📝 Take Quick Quiz</button>
            <button class="action-btn" onclick="MicroLearning.markLessonComplete('${lesson.id}')">✓ Mark Complete</button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      setTimeout(() => modal.classList.add('active'), 10);
    };
  },

  startQuiz(lessonId) {
    const lesson = this.quickLessons.find(l => l.id === lessonId);
    if (!lesson || !lesson.quiz) return;

    const quizModal = document.createElement('div');
    quizModal.className = 'microlearning-modal';
    quizModal.id = 'quiz-modal';
    let currentQuestion = 0;
    let score = 0;

    const showQuestion = () => {
      const q = lesson.quiz[currentQuestion];
      if (!q) {
        // Record learning activity when quiz completes
        if (typeof recordLearningActivity === 'function') {
          recordLearningActivity('question', `Quiz: ${lesson.title || lesson.id}`, score, lesson.quiz.length);
        }
        
        quizModal.innerHTML = `
          <div class="microlearning-modal-content">
            <button class="microlearning-close-btn" onclick="document.getElementById('quiz-modal').remove()">✕</button>
            <div style="text-align: center; padding: 30px;">
              <h2>🎉 Quiz Complete!</h2>
              <p style="font-size: 1.5rem; color: #0097b2; margin: 20px 0; font-weight: 700;">
                Score: ${score}/${lesson.quiz.length}
              </p>
              ${score === lesson.quiz.length ? '<p style="color: #4caf50; font-weight: 600;">Perfect! You mastered this topic! 🏆</p>' : ''}
              <button onclick="document.getElementById('quiz-modal').remove()" style="margin-top: 20px; padding: 10px 20px; background: #0097b2; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">Close</button>
            </div>
          </div>
        `;
        return;
      }

      quizModal.innerHTML = `
        <div class="microlearning-modal-content quiz-wrapper">
          <button class="microlearning-close-btn" onclick="document.getElementById('quiz-modal').remove()">✕</button>
          
          <div class="quiz-progress">
            <span class="progress-text">Question ${currentQuestion + 1}/${lesson.quiz.length}</span>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${((currentQuestion + 1) / lesson.quiz.length) * 100}%"></div>
            </div>
          </div>

          <div class="quiz-content">
            <h3>${q.q}</h3>
            <div class="options">
              ${q.options.map((option, index) => `
                <button class="option-btn" onclick="MicroLearning.selectAnswer(${index}, ${q.correct}, ${lessonId})">
                  ${String.fromCharCode(65 + index)}. ${option}
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    };

    window.selectAnswer = (selected, correct, lessonId) => {
      if (selected === correct) {
        score++;
      }
      currentQuestion++;
      if (currentQuestion < lesson.quiz.length) {
        showQuestion();
      } else {
        showQuestion(); 
      }
    };

    quizModal.innerHTML = '';
    document.body.appendChild(quizModal);
    setTimeout(() => {
      quizModal.classList.add('active');
      showQuestion();
    }, 10);
  },

  setupDailyChallenges() {
    window.openDailyChallenge = () => {
      // Pick a random challenge from the pool
      const randomIndex = Math.floor(Math.random() * this.dailyChallenges.length);
      const challenge = this.dailyChallenges[randomIndex];

      const modal = document.createElement('div');
      modal.className = 'microlearning-modal';
      modal.id = 'challenge-modal';
      modal.innerHTML = `
        <div class="microlearning-modal-content challenge-wrapper">
          <button class="microlearning-close-btn" onclick="document.getElementById('challenge-modal').remove()">✕</button>
          
          <div class="challenge-header">
            <span class="challenge-badge" style="background: ${challenge.difficulty === 'Easy' ? '#4caf50' : challenge.difficulty === 'Medium' ? '#ff9800' : '#f44336'}">
              ${challenge.difficulty}
            </span>
            <span class="challenge-category" style="background: #0097b2; color: white; padding: 4px 12px; border-radius: 12px; font-size: 0.85rem; font-weight: 600;">
              ${challenge.category}
            </span>
            <span class="challenge-points">+${challenge.points} points</span>
          </div>

          <div class="challenge-content">
            <h2>Daily Challenge</h2>
            <p class="challenge-question">${challenge.question}</p>

            <div class="challenge-options">
              ${challenge.options.map((option, index) => `
                <button class="challenge-option" onclick="MicroLearning.answerChallenge(${index}, ${challenge.correct}, '${challenge.id}')">
                  ${option}
                </button>
              `).join('')}
            </div>
          </div>

          <div class="challenge-footer">
            <button class="hint-btn" onclick="alert('Hint: ${challenge.explanation.split('=')[0]}...')">💡 Get Hint</button>
            <button class="new-challenge-btn" onclick="document.getElementById('challenge-modal').remove(); openDailyChallenge()" style="background: linear-gradient(135deg, #0097b2 0%, #00b8d4 100%); color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 600; margin-left: 10px;">🔄 New Challenge</button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      setTimeout(() => modal.classList.add('active'), 10);
    };
  },

  answerChallenge(selected, correct, challengeId) {
    const challenge = this.dailyChallenges.find(c => c.id === challengeId);
    
    if (selected === correct) {
      alert(`✓ Correct!\n\n${challenge.explanation}\n\n+${challenge.points} points!`);
      this.addPoints(challenge.points);
      this.markChallengeComplete(challengeId);
    } else {
      alert(`✗ Not quite right.\n\n${challenge.explanation}`);
    }
  },

  setupBrainTeasers() {
    window.openBrainTeaser = (teaserId) => {
      const teaser = this.brainTeasers.find(t => t.id === teaserId);

      if (!teaser) {
        alert('Brain teaser not found');
        return;
      }

      const modal = document.createElement('div');
      modal.className = 'microlearning-modal';
      modal.id = 'teaser-modal';
      modal.innerHTML = `
        <div class="microlearning-modal-content teaser-wrapper">
          <button class="microlearning-close-btn" onclick="document.getElementById('teaser-modal').remove()">✕</button>
          
          <div class="teaser-header">
            <span class="difficulty-badge">${teaser.difficulty}</span>
            <h2>${teaser.title}</h2>
            <p class="teaser-description">${teaser.description}</p>
          </div>

          <div class="teaser-content">
            <div class="puzzle-box">
              <p class="puzzle-text">${teaser.puzzle}</p>
            </div>

            <div class="answer-section">
              <input type="text" id="teaser-answer" class="answer-input" placeholder="Your answer..." />
              <button class="submit-btn" onclick="MicroLearning.checkTeaserAnswer('${teaser.id}')">Check Answer</button>
            </div>

            <div class="hint-section">
              <button class="hint-reveal-btn" onclick="alert('💡 Hint: ${teaser.hint}')">Show Hint</button>
              <button class="answer-reveal-btn" onclick="alert('Answer: ${teaser.answer}')">Reveal Answer</button>
            </div>
          </div>

          <div id="teaser-feedback"></div>
        </div>
      `;

      document.body.appendChild(modal);
      setTimeout(() => modal.classList.add('active'), 10);
    };
  },

  checkTeaserAnswer(teaserId) {
    const teaser = this.brainTeasers.find(t => t.id === teaserId);
    const userAnswer = document.getElementById('teaser-answer')?.value?.toLowerCase() || '';
    const feedback = document.getElementById('teaser-feedback');

    if (userAnswer === teaser.answer.toLowerCase()) {
      feedback.innerHTML = `<div style="background: #c8e6c9; color: #2e7d32; padding: 15px; border-radius: 6px; margin-top: 15px; text-align: center; font-weight: 600;">✓ Correct! You solved it!</div>`;
      this.addPoints(20);
    } else if (userAnswer) {
      feedback.innerHTML = `<div style="background: #ffccbc; color: #e64a19; padding: 15px; border-radius: 6px; margin-top: 15px; text-align: center;">Not quite. Try again or reveal the hint!</div>`;
    }
  },

  markLessonComplete(lessonId) {
    const completed = JSON.parse(localStorage.getItem('completed-lessons') || '[]');
    if (!completed.includes(lessonId)) {
      completed.push(lessonId);
      localStorage.setItem('completed-lessons', JSON.stringify(completed));
      this.addPoints(5);
      alert('✓ Lesson marked complete! +5 points');
    }
  },

  markChallengeComplete(challengeId) {
    const completed = JSON.parse(localStorage.getItem('completed-challenges') || '[]');
    if (!completed.includes(challengeId)) {
      completed.push(challengeId);
      localStorage.setItem('completed-challenges', JSON.stringify(completed));
      
      // Record learning activity
      if (typeof recordLearningActivity === 'function') {
        recordLearningActivity('challenge', `Challenge: ${challengeId}`, 100, 100);
      }
    }
  },

  addPoints(points) {
    const current = parseInt(localStorage.getItem('microlearning-points') || '0');
    localStorage.setItem('microlearning-points', current + points);
  },

  loadUserProgress() {
    const completedLessons = JSON.parse(localStorage.getItem('completed-lessons') || '[]');
    const completedChallenges = JSON.parse(localStorage.getItem('completed-challenges') || '[]');
    const points = localStorage.getItem('microlearning-points') || '0';

    console.log(`Micro-Learning Progress:`);
    console.log(`- Lessons: ${completedLessons.length}`);
    console.log(`- Challenges: ${completedChallenges.length}`);
    console.log(`- Points: ${points}`);
  }
};

const microlearningStyles = `
  .microlearning-modal {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9998;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .microlearning-modal.active {
    opacity: 1;
  }

  .microlearning-modal-content {
    background: white;
    border-radius: 12px;
    max-width: 700px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    padding: 30px;
    position: relative;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  }

  .microlearning-close-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    background: #f5f5f5;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    cursor: pointer;
    font-size: 24px;
    transition: all 0.2s;
  }

  .microlearning-close-btn:hover {
    background: #e0e0e0;
    transform: rotate(90deg);
  }

  .lesson-header {
    text-align: center;
    margin-bottom: 30px;
  }

  .lesson-timer {
    display: inline-block;
    background: #fff3e0;
    color: #ff9800;
    padding: 8px 15px;
    border-radius: 20px;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .lesson-topic {
    color: #999;
    font-size: 0.9rem;
    margin: 10px 0 0 0;
  }

  .lesson-content {
    margin: 30px 0;
  }

  .lesson-section {
    margin-bottom: 25px;
  }

  .lesson-section h3 {
    color: #0097b2;
    margin-bottom: 15px;
  }

  .key-points {
    list-style: none;
    padding: 0;
  }

  .key-points li {
    padding: 10px 0;
    color: #666;
    display: flex;
    align-items: flex-start;
  }

  .checkmark {
    color: #4caf50;
    font-weight: 700;
    margin-right: 10px;
    flex-shrink: 0;
  }

  .example-box {
    background: #f5f5f5;
    padding: 20px;
    border-radius: 8px;
    border-left: 4px solid #0097b2;
    margin-top: 10px;
  }

  .example-box code {
    color: #1f2933;
    font-family: 'Courier New', monospace;
    word-break: break-all;
  }

  .lesson-actions, .case-actions {
    display: flex;
    gap: 10px;
    margin-top: 30px;
    flex-wrap: wrap;
  }

  .action-btn {
    flex: 1;
    min-width: 150px;
    padding: 12px;
    background: #0097b2;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
  }

  .action-btn:hover {
    background: #007a95;
    transform: translateY(-2px);
  }

  .quiz-progress {
    margin-bottom: 25px;
  }

  .progress-text {
    display: block;
    color: #999;
    margin-bottom: 8px;
    font-size: 0.9rem;
  }

  .progress-bar {
    width: 100%;
    height: 8px;
    background: #e0e0e0;
    border-radius: 4px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: #0097b2;
    transition: width 0.3s ease;
  }

  .quiz-content h3 {
    color: #1f2933;
    margin-bottom: 20px;
    font-size: 1.1rem;
  }

  .options {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .option-btn {
    padding: 15px;
    background: #f5f5f5;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    cursor: pointer;
    text-align: left;
    transition: all 0.2s;
    font-weight: 500;
    color: #1f2933;
  }

  .option-btn:hover {
    border-color: #0097b2;
    background: #f0f8fa;
  }

  .challenge-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
  }

  .challenge-badge {
    color: white;
    padding: 8px 15px;
    border-radius: 20px;
    font-weight: 600;
    font-size: 0.85rem;
  }

  .challenge-points {
    background: #fff3e0;
    color: #ff6f00;
    padding: 8px 15px;
    border-radius: 20px;
    font-weight: 600;
  }

  .challenge-question {
    font-size: 1.1rem;
    color: #1f2933;
    margin: 20px 0;
    line-height: 1.6;
  }

  .challenge-options {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin: 25px 0;
  }

  .challenge-option {
    padding: 15px;
    background: #f9f9f9;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    cursor: pointer;
    text-align: center;
    transition: all 0.2s;
    font-weight: 500;
  }

  .challenge-option:hover {
    border-color: #0097b2;
    background: #f0f8fa;
  }

  .challenge-footer {
    text-align: center;
    padding-top: 20px;
    border-top: 1px solid #e0e0e0;
  }

  .hint-btn {
    padding: 10px 20px;
    background: #fff3e0;
    color: #ff9800;
    border: 2px solid #ff9800;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
  }

  .hint-btn:hover {
    background: #ff9800;
    color: white;
  }

  .teaser-header {
    text-align: center;
    margin-bottom: 30px;
  }

  .difficulty-badge {
    display: inline-block;
    background: #e0e0e0;
    color: #666;
    padding: 6px 12px;
    border-radius: 20px;
    font-weight: 600;
    font-size: 0.85rem;
  }

  .teaser-description {
    color: #999;
    margin: 10px 0 0 0;
  }

  .puzzle-box {
    background: linear-gradient(135deg, #f5f5f5, #fafafa);
    padding: 30px;
    border-radius: 8px;
    border: 2px dashed #0097b2;
    margin: 25px 0;
    text-align: center;
  }

  .puzzle-text {
    font-size: 1.2rem;
    color: #1f2933;
    margin: 0;
    font-weight: 600;
  }

  .answer-section {
    display: flex;
    gap: 10px;
    margin: 25px 0;
  }

  .answer-input {
    flex: 1;
    padding: 12px;
    border: 2px solid #e0e0e0;
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.2s;
  }

  .answer-input:focus {
    outline: none;
    border-color: #0097b2;
  }

  .submit-btn {
    padding: 12px 25px;
    background: #0097b2;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
  }

  .submit-btn:hover {
    background: #007a95;
  }

  .hint-section {
    display: flex;
    gap: 10px;
    margin-top: 20px;
    flex-wrap: wrap;
  }

  .hint-reveal-btn, .answer-reveal-btn {
    flex: 1;
    min-width: 120px;
    padding: 10px;
    background: #f5f5f5;
    border: 2px solid #0097b2;
    color: #0097b2;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
  }

  .hint-reveal-btn:hover, .answer-reveal-btn:hover {
    background: #0097b2;
    color: white;
  }
`;

if (!document.getElementById('microlearning-styles')) {
  const styleTag = document.createElement('style');
  styleTag.id = 'microlearning-styles';
  styleTag.textContent = microlearningStyles;
  document.head.appendChild(styleTag);
}

document.addEventListener('DOMContentLoaded', () => {
  MicroLearning.init();
});

console.log('✓ Micro-Learning module loaded');