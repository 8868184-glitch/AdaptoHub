class DiscussionForumsSystem {
    constructor() {
        this.questionsKey = 'adaptohub_forum_questions';
        this.answersKey = 'adaptohub_forum_answers';
        this.reputationKey = 'adaptohub_forum_reputation';
        this.votesKey = 'adaptohub_forum_votes';
        this.currentUser = this.getCurrentUser();
        this.init();
    }

    init() {
        if (!localStorage.getItem(this.questionsKey)) {
            localStorage.setItem(this.questionsKey, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.answersKey)) {
            localStorage.setItem(this.answersKey, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.reputationKey)) {
            localStorage.setItem(this.reputationKey, JSON.stringify({}));
        }
        if (!localStorage.getItem(this.votesKey)) {
            localStorage.setItem(this.votesKey, JSON.stringify({}));
        }
        
        this.initializeSampleQuestions();
    }

    initializeSampleQuestions() {
        const questions = this.getQuestions();
        if (questions.length === 0) {
            const sampleQuestions = [
                {
                    id: 'q_sample_001',
                    userId: 'sarah_chen',
                    userName: 'Sarah Chen',
                    title: 'How do I solve limits approaching infinity?',
                    content: 'I\'m struggling with limit problems where x approaches infinity. Can someone explain the step-by-step process for evaluating lim(x→∞) (3x² + 2x)/(x² - 1)?',
                    subject: 'Mathematics',
                    topic: 'Calculus',
                    difficulty: 'medium',
                    tags: ['calculus', 'limits', 'infinity'],
                    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    views: 45,
                    upvotes: 12,
                    downvotes: 0,
                    answerCount: 3,
                    hasVerifiedAnswer: true,
                    verifiedAnswerId: 'a_sample_001',
                    status: 'answered'
                },
                {
                    id: 'q_sample_002',
                    userId: 'mike_wilson',
                    userName: 'Mike Wilson',
                    title: 'Newton\'s Third Law - Action and Reaction pairs confusion',
                    content: 'I understand that every action has an equal and opposite reaction, but I\'m confused about identifying action-reaction pairs in complex scenarios. Can someone give practical examples?',
                    subject: 'Science',
                    topic: 'Physics',
                    difficulty: 'easy',
                    tags: ['physics', 'mechanics', 'newton-laws'],
                    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
                    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                    views: 62,
                    upvotes: 18,
                    downvotes: 1,
                    answerCount: 5,
                    hasVerifiedAnswer: true,
                    verifiedAnswerId: 'a_sample_002',
                    status: 'answered'
                },
                {
                    id: 'q_sample_003',
                    userId: 'emma_johnson',
                    userName: 'Emma Johnson',
                    title: 'Best way to memorize organic chemistry reaction mechanisms?',
                    content: 'I\'m having trouble remembering all the different reaction mechanisms in organic chemistry. Does anyone have effective study techniques or mnemonics that helped them?',
                    subject: 'Science',
                    topic: 'Chemistry',
                    difficulty: 'medium',
                    tags: ['chemistry', 'organic-chemistry', 'study-tips'],
                    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
                    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
                    views: 38,
                    upvotes: 14,
                    downvotes: 0,
                    answerCount: 4,
                    hasVerifiedAnswer: false,
                    verifiedAnswerId: null,
                    status: 'answered'
                },
                {
                    id: 'q_sample_004',
                    userId: 'alex_kumar',
                    userName: 'Alex Kumar',
                    title: 'Pythagorean Theorem proof explanation needed',
                    content: 'Can someone explain the algebraic proof of the Pythagorean theorem? I understand a² + b² = c², but I want to know why it works.',
                    subject: 'Mathematics',
                    topic: 'Geometry',
                    difficulty: 'easy',
                    tags: ['geometry', 'pythagorean-theorem', 'proofs'],
                    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
                    updatedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
                    views: 71,
                    upvotes: 22,
                    downvotes: 0,
                    answerCount: 6,
                    hasVerifiedAnswer: true,
                    verifiedAnswerId: 'a_sample_004',
                    status: 'answered'
                },
                {
                    id: 'q_sample_005',
                    userId: 'lisa_park',
                    userName: 'Lisa Park',
                    title: 'Help with photosynthesis and cellular respiration relationship',
                    content: 'I know they\'re related but I\'m confused about how exactly. Are they opposite processes? How do the equations relate to each other?',
                    subject: 'Science',
                    topic: 'Biology',
                    difficulty: 'medium',
                    tags: ['biology', 'photosynthesis', 'cellular-respiration'],
                    createdAt: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(),
                    updatedAt: new Date(Date.now() - 13 * 60 * 60 * 1000).toISOString(),
                    views: 54,
                    upvotes: 16,
                    downvotes: 0,
                    answerCount: 4,
                    hasVerifiedAnswer: true,
                    verifiedAnswerId: 'a_sample_005',
                    status: 'answered'
                },
                {
                    id: 'q_sample_006',
                    userId: 'david_lee',
                    userName: 'David Lee',
                    title: 'Quadratic formula - when to use completing the square vs formula?',
                    content: 'Is there a rule for when it\'s better to use the quadratic formula versus completing the square? Sometimes one seems easier than the other.',
                    subject: 'Mathematics',
                    topic: 'Algebra',
                    difficulty: 'medium',
                    tags: ['algebra', 'quadratic-equations', 'methods'],
                    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
                    updatedAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
                    views: 42,
                    upvotes: 11,
                    downvotes: 1,
                    answerCount: 3,
                    hasVerifiedAnswer: false,
                    verifiedAnswerId: null,
                    status: 'answered'
                },
                {
                    id: 'q_sample_007',
                    userId: 'sophia_martinez',
                    userName: 'Sophia Martinez',
                    title: 'Confusion about electric potential vs electric field',
                    content: 'What\'s the difference between electric potential and electric field? How are they related mathematically? I keep mixing them up!',
                    subject: 'Science',
                    topic: 'Physics',
                    difficulty: 'hard',
                    tags: ['physics', 'electromagnetism', 'concepts'],
                    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                    views: 29,
                    upvotes: 8,
                    downvotes: 0,
                    answerCount: 2,
                    hasVerifiedAnswer: false,
                    verifiedAnswerId: null,
                    status: 'answered'
                },
                {
                    id: 'q_sample_008',
                    userId: 'james_brown',
                    userName: 'James Brown',
                    title: 'How to balance complex redox reactions?',
                    content: 'I need help with balancing oxidation-reduction reactions in acidic and basic solutions. The half-reaction method is confusing me. Any tips?',
                    subject: 'Science',
                    topic: 'Chemistry',
                    difficulty: 'hard',
                    tags: ['chemistry', 'redox', 'balancing-equations'],
                    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                    views: 33,
                    upvotes: 10,
                    downvotes: 1,
                    answerCount: 3,
                    hasVerifiedAnswer: true,
                    verifiedAnswerId: 'a_sample_008',
                    status: 'answered'
                },
                {
                    id: 'q_sample_009',
                    userId: 'olivia_davis',
                    userName: 'Olivia Davis',
                    title: 'Need clarification on dominant vs recessive alleles',
                    content: 'If both parents have brown eyes (dominant), can they have a blue-eyed child? I\'m confused about how this works with Punnett squares.',
                    subject: 'Science',
                    topic: 'Biology',
                    difficulty: 'easy',
                    tags: ['biology', 'genetics', 'inheritance'],
                    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                    views: 48,
                    upvotes: 15,
                    downvotes: 0,
                    answerCount: 4,
                    hasVerifiedAnswer: true,
                    verifiedAnswerId: 'a_sample_009',
                    status: 'answered'
                },
                {
                    id: 'q_sample_010',
                    userId: 'rachel_white',
                    userName: 'Rachel White',
                    title: 'Understanding derivatives - practical applications?',
                    content: 'I get how to calculate derivatives mechanically, but where are they actually used in real life? Can someone give concrete examples?',
                    subject: 'Mathematics',
                    topic: 'Calculus',
                    difficulty: 'easy',
                    tags: ['calculus', 'derivatives', 'applications'],
                    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
                    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
                    views: 67,
                    upvotes: 20,
                    downvotes: 0,
                    answerCount: 7,
                    hasVerifiedAnswer: false,
                    verifiedAnswerId: null,
                    status: 'answered'
                },
                {
                    id: 'q_sample_011',
                    userId: 'kevin_garcia',
                    userName: 'Kevin Garcia',
                    title: 'Statistics: When to use mean vs median?',
                    content: 'In what situations should I use the mean instead of the median? Does it matter which one I choose for my data analysis?',
                    subject: 'Mathematics',
                    topic: 'Statistics',
                    difficulty: 'medium',
                    tags: ['statistics', 'mean', 'median', 'data-analysis'],
                    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                    views: 12,
                    upvotes: 3,
                    downvotes: 0,
                    answerCount: 0,
                    hasVerifiedAnswer: false,
                    verifiedAnswerId: null,
                    status: 'open'
                },
                {
                    id: 'q_sample_012',
                    userId: 'natalie_thompson',
                    userName: 'Natalie Thompson',
                    title: 'Wave interference patterns - help understanding constructive vs destructive',
                    content: 'Can someone explain how to determine if two waves will interfere constructively or destructively? I struggle with the phase difference calculations.',
                    subject: 'Science',
                    topic: 'Physics',
                    difficulty: 'medium',
                    tags: ['physics', 'waves', 'interference'],
                    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
                    updatedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
                    views: 8,
                    upvotes: 2,
                    downvotes: 0,
                    answerCount: 0,
                    hasVerifiedAnswer: false,
                    verifiedAnswerId: null,
                    status: 'open'
                }
            ];
            
            localStorage.setItem(this.questionsKey, JSON.stringify(sampleQuestions));
        }
    }

    getCurrentUser() {
        const accountName = document.getElementById('accountName')?.textContent || 'Guest User';
        return {
            id: accountName.replace(/\s+/g, '_').toLowerCase(),
            name: accountName
        };
    }

    postQuestion(questionData) {
        const questions = this.getQuestions();
        const newQuestion = {
            id: `q_${Date.now()}`,
            userId: this.currentUser.id,
            userName: this.currentUser.name,
            title: questionData.title,
            content: questionData.content,
            subject: questionData.subject,
            topic: questionData.topic || '',
            difficulty: questionData.difficulty,
            tags: questionData.tags || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            views: 0,
            upvotes: 0,
            downvotes: 0,
            answerCount: 0,
            hasVerifiedAnswer: false,
            verifiedAnswerId: null,
            status: 'open' 
        };

        questions.push(newQuestion);
        localStorage.setItem(this.questionsKey, JSON.stringify(questions));

        this.updateReputation(this.currentUser.id, 5);

        this.dispatchEvent('questionPosted', { question: newQuestion });

        return newQuestion;
    }

    getQuestions(filters = {}) {
        let questions = JSON.parse(localStorage.getItem(this.questionsKey) || '[]');

        if (filters.subject) {
            questions = questions.filter(q => q.subject === filters.subject);
        }
        if (filters.difficulty) {
            questions = questions.filter(q => q.difficulty === filters.difficulty);
        }
        if (filters.tags && filters.tags.length > 0) {
            questions = questions.filter(q => 
                filters.tags.some(tag => q.tags.includes(tag))
            );
        }
        if (filters.status) {
            questions = questions.filter(q => q.status === filters.status);
        }
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            questions = questions.filter(q =>
                q.title.toLowerCase().includes(searchLower) ||
                q.content.toLowerCase().includes(searchLower)
            );
        }

        const sortBy = filters.sortBy || 'recent';
        switch (sortBy) {
            case 'popular':
                questions.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
                break;
            case 'unanswered':
                questions.sort((a, b) => a.answerCount - b.answerCount);
                break;
            case 'recent':
            default:
                questions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        return questions;
    }

    getQuestion(questionId) {
        const questions = this.getQuestions();
        const question = questions.find(q => q.id === questionId);
        
        if (question) {
            question.views++;
            localStorage.setItem(this.questionsKey, JSON.stringify(questions));
        }

        return question;
    }

    getMyQuestions() {
        return this.getQuestions().filter(q => q.userId === this.currentUser.id);
    }

    updateQuestion(questionId, updates) {
        const questions = this.getQuestions();
        const question = questions.find(q => q.id === questionId);

        if (!question) {
            throw new Error('Question not found');
        }

        if (question.userId !== this.currentUser.id) {
            throw new Error('Not authorized to edit this question');
        }

        Object.assign(question, updates, {
            updatedAt: new Date().toISOString()
        });

        localStorage.setItem(this.questionsKey, JSON.stringify(questions));
        return question;
    }

    closeQuestion(questionId) {
        return this.updateQuestion(questionId, { status: 'closed' });
    }

    postAnswer(questionId, answerData) {
        const questions = this.getQuestions();
        const question = questions.find(q => q.id === questionId);

        if (!question) {
            throw new Error('Question not found');
        }

        const answers = this.getAnswers();
        const newAnswer = {
            id: `a_${Date.now()}`,
            questionId: questionId,
            userId: this.currentUser.id,
            userName: this.currentUser.name,
            content: answerData.content,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            upvotes: 0,
            downvotes: 0,
            isVerified: false,
            verifiedBy: null,
            verifiedAt: null
        };

        answers.push(newAnswer);
        localStorage.setItem(this.answersKey, JSON.stringify(answers));

        question.answerCount++;
        if (question.answerCount > 0 && question.status === 'open') {
            question.status = 'answered';
        }
        localStorage.setItem(this.questionsKey, JSON.stringify(questions));

        this.updateReputation(this.currentUser.id, 10);

        this.dispatchEvent('answerPosted', { answer: newAnswer, question });

        return newAnswer;
    }

    getAnswers(questionId = null) {
        let answers = JSON.parse(localStorage.getItem(this.answersKey) || '[]');
        
        if (questionId) {
            answers = answers.filter(a => a.questionId === questionId);
        }

        answers.sort((a, b) => {
            if (a.isVerified && !b.isVerified) return -1;
            if (!a.isVerified && b.isVerified) return 1;
            return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
        });

        return answers;
    }

    getAnswer(answerId) {
        const answers = this.getAnswers();
        return answers.find(a => a.id === answerId);
    }

    updateAnswer(answerId, content) {
        const answers = this.getAnswers();
        const answer = answers.find(a => a.id === answerId);

        if (!answer) {
            throw new Error('Answer not found');
        }

        if (answer.userId !== this.currentUser.id) {
            throw new Error('Not authorized to edit this answer');
        }

        answer.content = content;
        answer.updatedAt = new Date().toISOString();

        localStorage.setItem(this.answersKey, JSON.stringify(answers));
        return answer;
    }

    verifyAnswer(answerId) {
        const answers = this.getAnswers();
        const answer = answers.find(a => a.id === answerId);

        if (!answer) {
            throw new Error('Answer not found');
        }

        const questions = this.getQuestions();
        const question = questions.find(q => q.id === answer.questionId);

        if (!question) {
            throw new Error('Question not found');
        }

        const userReputation = this.getReputation(this.currentUser.id);
        const canVerify = question.userId === this.currentUser.id || userReputation >= 500;

        if (!canVerify) {
            throw new Error('Not authorized to verify answers');
        }

        if (question.verifiedAnswerId) {
            const prevAnswer = answers.find(a => a.id === question.verifiedAnswerId);
            if (prevAnswer) {
                prevAnswer.isVerified = false;
                prevAnswer.verifiedBy = null;
                prevAnswer.verifiedAt = null;
            }
        }

        answer.isVerified = true;
        answer.verifiedBy = this.currentUser.id;
        answer.verifiedAt = new Date().toISOString();

        question.hasVerifiedAnswer = true;
        question.verifiedAnswerId = answerId;

        localStorage.setItem(this.answersKey, JSON.stringify(answers));
        localStorage.setItem(this.questionsKey, JSON.stringify(questions));

        this.updateReputation(answer.userId, 50);
        this.dispatchEvent('answerVerified', { answer, question });

        return answer;
    }

    unverifyAnswer(answerId) {
        const answers = this.getAnswers();
        const answer = answers.find(a => a.id === answerId);

        if (!answer || !answer.isVerified) {
            throw new Error('Answer not verified');
        }

        const questions = this.getQuestions();
        const question = questions.find(q => q.id === answer.questionId);

        const userReputation = this.getReputation(this.currentUser.id);
        const canUnverify = answer.verifiedBy === this.currentUser.id || userReputation >= 500;

        if (!canUnverify) {
            throw new Error('Not authorized to unverify answers');
        }

        answer.isVerified = false;
        answer.verifiedBy = null;
        answer.verifiedAt = null;

        question.hasVerifiedAnswer = false;
        question.verifiedAnswerId = null;

        localStorage.setItem(this.answersKey, JSON.stringify(answers));
        localStorage.setItem(this.questionsKey, JSON.stringify(questions));

        this.updateReputation(answer.userId, -50);

        return answer;
    }

    vote(type, itemId, voteType) {

        const voteId = `${type}_${itemId}_${this.currentUser.id}`;
        const votes = JSON.parse(localStorage.getItem(this.votesKey) || '{}');

        const existingVote = votes[voteId];

        if (existingVote === voteType) {
            delete votes[voteId];
            this.updateVoteCount(type, itemId, voteType, -1);
        } else if (existingVote) {
            votes[voteId] = voteType;
            this.updateVoteCount(type, itemId, existingVote, -1);
            this.updateVoteCount(type, itemId, voteType, 1);
        } else {
            votes[voteId] = voteType;
            this.updateVoteCount(type, itemId, voteType, 1);
        }

        localStorage.setItem(this.votesKey, JSON.stringify(votes));
        
        return votes[voteId];
    }

    updateVoteCount(type, itemId, voteType, delta) {
        if (type === 'question') {
            const questions = this.getQuestions();
            const question = questions.find(q => q.id === itemId);
            if (question) {
                question[`${voteType}s`] += delta;
                localStorage.setItem(this.questionsKey, JSON.stringify(questions));
                
                this.updateReputation(question.userId, voteType === 'upvote' ? delta * 5 : delta * -2);
            }
        } else if (type === 'answer') {
            const answers = this.getAnswers();
            const answer = answers.find(a => a.id === itemId);
            if (answer) {
                answer[`${voteType}s`] += delta;
                localStorage.setItem(this.answersKey, JSON.stringify(answers));
                
                this.updateReputation(answer.userId, voteType === 'upvote' ? delta * 10 : delta * -2);
            }
        }
    }

    getUserVote(type, itemId) {
        const voteId = `${type}_${itemId}_${this.currentUser.id}`;
        const votes = JSON.parse(localStorage.getItem(this.votesKey) || '{}');
        return votes[voteId] || null;
    }

    updateReputation(userId, delta) {
        const reputations = JSON.parse(localStorage.getItem(this.reputationKey) || '{}');
        
        if (!reputations[userId]) {
            reputations[userId] = {
                score: 100,
                badges: [],
                topContributor: false
            };
        }

        reputations[userId].score += delta;
        reputations[userId].score = Math.max(0, reputations[userId].score); 

        this.checkReputationBadges(userId, reputations[userId]);

        localStorage.setItem(this.reputationKey, JSON.stringify(reputations));

        this.dispatchEvent('reputationChanged', { 
            userId, 
            newScore: reputations[userId].score,
            delta 
        });
    }

    checkReputationBadges(userId, reputation) {
        const badges = [];
        
        if (reputation.score >= 200 && !reputation.badges.includes('contributor')) {
            badges.push('contributor');
        }
        if (reputation.score >= 500 && !reputation.badges.includes('expert')) {
            badges.push('expert');
        }
        if (reputation.score >= 1000 && !reputation.badges.includes('guru')) {
            badges.push('guru');
        }
        if (reputation.score >= 2000 && !reputation.badges.includes('legend')) {
            badges.push('legend');
        }

        badges.forEach(badge => {
            if (!reputation.badges.includes(badge)) {
                reputation.badges.push(badge);
                this.dispatchEvent('badgeEarned', { userId, badge });
            }
        });

        const allReputations = Object.values(JSON.parse(localStorage.getItem(this.reputationKey) || '{}'));
        allReputations.sort((a, b) => b.score - a.score);
        const topThreshold = Math.ceil(allReputations.length * 0.1);
        reputation.topContributor = allReputations.slice(0, topThreshold).includes(reputation);
    }

    getReputation(userId) {
        const reputations = JSON.parse(localStorage.getItem(this.reputationKey) || '{}');
        return reputations[userId]?.score || 100;
    }

    getUserReputation(userId) {
        const reputations = JSON.parse(localStorage.getItem(this.reputationKey) || '{}');
        return reputations[userId] || {
            score: 100,
            badges: [],
            topContributor: false
        };
    }

    getTopContributors(limit = 10) {
        const reputations = JSON.parse(localStorage.getItem(this.reputationKey) || '{}');
        return Object.entries(reputations)
            .map(([userId, data]) => ({ userId, ...data }))
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }

    getMyForumStats() {
        const myQuestions = this.getMyQuestions();
        const allAnswers = this.getAnswers();
        const myAnswers = allAnswers.filter(a => a.userId === this.currentUser.id);
        const reputation = this.getUserReputation(this.currentUser.id);

        return {
            questionsAsked: myQuestions.length,
            answersGiven: myAnswers.length,
            verifiedAnswers: myAnswers.filter(a => a.isVerified).length,
            totalUpvotes: myAnswers.reduce((sum, a) => sum + a.upvotes, 0) +
                         myQuestions.reduce((sum, q) => sum + q.upvotes, 0),
            reputation: reputation.score,
            badges: reputation.badges,
            isTopContributor: reputation.topContributor
        };
    }

    getSubjectStats(subject) {
        const questions = this.getQuestions({ subject });
        const answers = this.getAnswers();
        
        return {
            totalQuestions: questions.length,
            answeredQuestions: questions.filter(q => q.status === 'answered').length,
            averageAnswers: questions.length > 0 
                ? questions.reduce((sum, q) => sum + q.answerCount, 0) / questions.length 
                : 0,
            verifiedAnswers: questions.filter(q => q.hasVerifiedAnswer).length
        };
    }

    dispatchEvent(eventName, data) {
        const event = new CustomEvent(`forum:${eventName}`, { detail: data });
        window.dispatchEvent(event);
    }
}

const discussionForumsSystem = new DiscussionForumsSystem();