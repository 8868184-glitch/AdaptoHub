const QuestionGenerator = {
  systemPrompt: `You are an expert educational question generator for the AdaptoHub learning platform. 
  Your task is to generate high-quality, diverse multiple-choice questions that test students' understanding.
  
  Requirements:
  1. Generate questions across all difficulty levels (Easy, Medium, Hard)
  2. Cover multiple subjects: Mathematics, Science, History, Social Studies, Language Arts
  3. Each question must have exactly 4 options with one correct answer
  4. Include explanations for why the correct answer is right
  5. Vary question types: conceptual, computational, application-based, memory
  6. Ensure questions are engaging and educational
  7. Return responses in valid JSON format
  
  Response Format:
  {
    "questions": [
      {
        "id": "generated-{timestamp}-{index}",
        "difficulty": "Easy|Medium|Hard",
        "category": "Subject Name",
        "question": "The question text",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correct": 0,
        "explanation": "Why this is correct...",
        "points": 10/15/25
      }
    ]
  }`,

  prompts: {
    random: `Generate 5 completely random questions from different subjects and difficulty levels for a Random Quiz challenge. 
    Make them engaging and educational. Each should test different skills.`,
    
    daily: `Generate 3 questions specifically designed for today's Daily Challenge. 
    Mix difficulty levels. Include 1 Easy, 1 Medium, and 1 Hard question.
    Make sure they're not the same as standard test questions.`,
    
    mathematics: `Generate 4 mathematics questions covering: Algebra, Geometry, Calculus, and Statistics.
    Include problems that require problem-solving skills.
    Vary the difficulty: 2 Medium and 2 Hard.`,
    
    science: `Generate 4 science questions covering: Physics, Chemistry, Biology, and Earth Science.
    Include conceptual questions and application-based questions.
    Mix difficulty levels appropriately.`,
    
    speed_challenge: `Generate 5 quick questions designed for a speed challenge. 
    These should be solvable quickly but still test understanding.
    Focus on Easy to Medium difficulty. Keep explanations concise.`,
    
    mastery: `Generate 3 advanced questions designed to test mastery and deep understanding.
    All should be Hard difficulty. Include questions that require synthesis of multiple concepts.`,

    mixed_subjects: `Generate 6 questions covering multiple subjects (Math, Science, History, Social Studies).
    Create variety in question types: conceptual, computational, application, memorization.
    Mix all difficulty levels.`
  },

  async generateQuestions(type = 'random', count = 5) {
    try {
      if (window.AIAssistant && window.AIAssistant.generateContent) {
        const prompt = this.prompts[type] || this.prompts.random;
        const response = await window.AIAssistant.generateContent(`
          ${this.systemPrompt}
          
          Task: ${prompt}
          Generate exactly ${count} questions.
        `);
        
        try {
          return JSON.parse(response);
        } catch (e) {
          console.warn('Failed to parse AI response, using fallback generation');
          return this.generateQuestionsLocal(type, count);
        }
      }
    } catch (e) {
      console.warn('AI generation failed, using local generation', e);
    }
    
    return this.generateQuestionsLocal(type, count);
  },

  generateQuestionsLocal(type = 'random', count = 5) {
    const questions = [];
    const subjects = ['Mathematics', 'Science', 'History', 'Social Studies', 'Language Arts'];
    const difficulties = ['Easy', 'Medium', 'Hard'];
    
    const questionTemplates = {
      Mathematics: [
        { q: 'What is {a} × {b}?', opts: (a, b) => [a*b-10, a*b, a*b+5, a*b+20], explain: (a, b) => `${a} × ${b} = ${a*b}` },
        { q: 'Solve: {a}x + {b} = {c}', opts: (a, b, c) => { const x = (c-b)/a; return [Math.round(x-2), Math.round(x), Math.round(x+2), Math.round(x+5)] }, explain: (a, b, c) => `x = ${(c-b)/a}` },
        { q: 'What is {a}% of {b}?', opts: (a, b) => { const res = (a*b)/100; return [Math.round(res-10), Math.round(res), Math.round(res+5), Math.round(res+15)] }, explain: (a, b) => `${a}% of ${b} = ${(a*b)/100}` },
        { q: 'What is the area of a square with side {a}?', opts: (a) => [a*a-10, a*a, a*a+5, a*a*2], explain: (a) => `Area = side² = ${a}² = ${a*a}` }
      ],
      Science: [
        { q: 'What is the boiling point of water in Celsius?', opts: () => [50, 75, 100, 125], explain: () => 'Water boils at 100°C at standard atmospheric pressure' },
        { q: 'How many bones are in an adult human body?', opts: () => [186, 196, 206, 216], explain: () => 'An adult human has 206 bones' },
        { q: 'What gas do plants primarily use in photosynthesis?', opts: () => ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], explain: () => 'Plants absorb CO₂ for photosynthesis' },
        { q: 'What is the pH of a neutral substance?', opts: () => [0, 4, 7, 14], explain: () => 'A pH of 7 is neutral' }
      ],
      History: [
        { q: 'In what year did World War II end?', opts: () => [1943, 1944, 1945, 1946], explain: () => 'WWII officially ended in 1945' },
        { q: 'Who was the first President of the United States?', opts: () => ['Thomas Jefferson', 'George Washington', 'John Adams', 'Benjamin Franklin'], explain: () => 'George Washington was the first US President (1789-1797)' },
        { q: 'In what century did the Renaissance occur?', opts: () => ['12th', '14th-17th', '18th', '19th'], explain: () => 'The Renaissance occurred from the 14th to 17th centuries' },
        { q: 'Which ancient wonder was located in Egypt?', opts: () => ['Colossus of Rhodes', 'Great Pyramid of Giza', 'Hanging Gardens', 'Lighthouse of Alexandria'], explain: () => 'The Great Pyramid of Giza is located in Egypt' }
      ],
      'Social Studies': [
        { q: 'What is the capital of France?', opts: () => ['Lyon', 'Marseille', 'Paris', 'Toulouse'], explain: () => 'Paris is the capital of France' },
        { q: 'How many continents are there?', opts: () => [5, 6, 7, 8], explain: () => 'There are 7 continents' },
        { q: 'Which country is the largest by area?', opts: () => ['Canada', 'China', 'Russia', 'United States'], explain: () => 'Russia is the largest country by area' },
        { q: 'What is the most spoken language in the world?', opts: () => ['Spanish', 'English', 'Mandarin Chinese', 'Hindi'], explain: () => 'Mandarin Chinese is the most spoken language' }
      ]
    };

    for (let i = 0; i < count; i++) {
      const subject = subjects[Math.floor(Math.random() * subjects.length)];
      const difficulty = type === 'daily' 
        ? ['Easy', 'Medium', 'Hard'][i % 3] 
        : difficulties[Math.floor(Math.random() * difficulties.length)];
      
      const templates = questionTemplates[subject];
      const template = templates[Math.floor(Math.random() * templates.length)];
      
      const a = Math.floor(Math.random() * 20) + 2;
      const b = Math.floor(Math.random() * 20) + 2;
      const c = a * b + Math.floor(Math.random() * 20) - 10;
      
      const questionText = template.q
        .replace(/{a}/g, a)
        .replace(/{b}/g, b)
        .replace(/{c}/g, c);
      
      const opts = template.opts(a, b, c);
      const correctIndex = 1;
      const shuffledOpts = [...opts].sort(() => Math.random() - 0.5);
      const newCorrectIndex = shuffledOpts.indexOf(opts[correctIndex]);
      
      const points = difficulty === 'Easy' ? 10 : difficulty === 'Medium' ? 15 : 25;
      
      questions.push({
        id: `generated-${Date.now()}-${i}`,
        difficulty,
        category: subject,
        question: questionText,
        options: shuffledOpts,
        correct: newCorrectIndex,
        explanation: template.explain(a, b, c),
        points
      });
    }
    
    return { questions };
  },

  async getRandomQuizQuestions() {
    return await this.generateQuestions('random', 5);
  },

  async getDailyChallengeQuestions() {
    return await this.generateQuestions('daily', 3);
  },

  async getSpeedChallengeQuestions() {
    return await this.generateQuestions('speed_challenge', 5);
  },

  async getMasteryChallengeQuestions() {
    return await this.generateQuestions('mastery', 3);
  },

  async getSubjectQuestions(subject) {
    const subjectPrompts = {
      'mathematics': 'mathematics',
      'science': 'science',
      'mixed': 'mixed_subjects'
    };
    
    const promptType = subjectPrompts[subject] || 'mixed_subjects';
    return await this.generateQuestions(promptType, 5);
  },

  async batchGenerate(types = ['random', 'daily', 'speed_challenge']) {
    const results = {};
    
    for (const type of types) {
      const count = type === 'daily' ? 3 : 5;
      results[type] = await this.generateQuestions(type, count);
    }
    
    return results;
  }
};

if (typeof window !== 'undefined') {
  window.QuestionGenerator = QuestionGenerator;
}