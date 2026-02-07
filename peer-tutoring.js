class PeerTutoringSystem {
    constructor() {
        this.tutorsKey = 'adaptohub_tutors';
        this.sessionsKey = 'adaptohub_tutoring_sessions';
        this.requestsKey = 'adaptohub_tutoring_requests';
        this.ratingsKey = 'adaptohub_tutor_ratings';
        this.currentUser = this.getCurrentUser();
        this.init();
    }

    init() {
        if (!localStorage.getItem(this.tutorsKey)) {
            localStorage.setItem(this.tutorsKey, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.sessionsKey)) {
            localStorage.setItem(this.sessionsKey, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.requestsKey)) {
            localStorage.setItem(this.requestsKey, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.ratingsKey)) {
            localStorage.setItem(this.ratingsKey, JSON.stringify({}));
        }
        
        this.initializeSampleTutors();
    }

    initializeSampleTutors() {
        const tutors = this.getTutors();
        if (tutors.length === 0) {
            const sampleTutors = [
                {
                    userId: 'sarah_chen',
                    userName: 'Sarah Chen',
                    subjects: ['Mathematics'],
                    topics: ['Calculus', 'Differential Equations', 'Linear Algebra'],
                    bio: 'Math enthusiast with 3 years of tutoring experience. I love helping students understand complex concepts through practical examples!',
                    availability: {
                        monday: ['14:00-16:00', '18:00-20:00'],
                        wednesday: ['14:00-16:00', '18:00-20:00'],
                        friday: ['15:00-18:00']
                    },
                    registeredAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
                    stats: {
                        totalSessions: 87,
                        completedSessions: 85,
                        averageRating: 4.9,
                        totalStudents: 34,
                        hoursLogged: 125
                    },
                    badges: ['tutor', 'expert', 'top_rated'],
                    isActive: true,
                    maxStudents: 5
                },
                {
                    userId: 'david_lee',
                    userName: 'David Lee',
                    subjects: ['Science'],
                    topics: ['Physics', 'Mechanics', 'Electromagnetism', 'Thermodynamics'],
                    bio: 'Physics major passionate about making science accessible. I use real-world examples and interactive demonstrations in my sessions.',
                    availability: {
                        tuesday: ['16:00-19:00'],
                        thursday: ['16:00-19:00'],
                        saturday: ['10:00-14:00']
                    },
                    registeredAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
                    stats: {
                        totalSessions: 72,
                        completedSessions: 70,
                        averageRating: 4.8,
                        totalStudents: 28,
                        hoursLogged: 98
                    },
                    badges: ['tutor', 'expert'],
                    isActive: true,
                    maxStudents: 4
                },
                {
                    userId: 'amanda_wright',
                    userName: 'Amanda Wright',
                    subjects: ['Science'],
                    topics: ['Biology', 'Cell Biology', 'Genetics', 'Ecology'],
                    bio: 'Biology graduate student. I specialize in breaking down complex biological processes into easy-to-understand concepts.',
                    availability: {
                        monday: ['13:00-15:00'],
                        wednesday: ['13:00-15:00'],
                        friday: ['13:00-17:00']
                    },
                    registeredAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
                    stats: {
                        totalSessions: 65,
                        completedSessions: 64,
                        averageRating: 4.9,
                        totalStudents: 26,
                        hoursLogged: 89
                    },
                    badges: ['tutor', 'top_rated'],
                    isActive: true,
                    maxStudents: 5
                },
                {
                    userId: 'chris_anderson',
                    userName: 'Chris Anderson',
                    subjects: ['Mathematics'],
                    topics: ['Geometry', 'Trigonometry', 'Algebra'],
                    bio: 'Geometry wizard! I help students visualize problems and develop strong problem-solving skills.',
                    availability: {
                        tuesday: ['15:00-18:00'],
                        thursday: ['15:00-18:00'],
                        sunday: ['14:00-17:00']
                    },
                    registeredAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
                    stats: {
                        totalSessions: 58,
                        completedSessions: 56,
                        averageRating: 4.7,
                        totalStudents: 22,
                        hoursLogged: 76
                    },
                    badges: ['tutor'],
                    isActive: true,
                    maxStudents: 4
                },
                {
                    userId: 'rachel_white',
                    userName: 'Rachel White',
                    subjects: ['Science'],
                    topics: ['Chemistry', 'Organic Chemistry', 'Chemical Reactions'],
                    bio: 'Chemistry tutor with a knack for making reactions memorable. Let\'s conquer those equations together!',
                    availability: {
                        monday: ['17:00-20:00'],
                        wednesday: ['17:00-20:00'],
                        saturday: ['11:00-15:00']
                    },
                    registeredAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
                    stats: {
                        totalSessions: 51,
                        completedSessions: 50,
                        averageRating: 4.8,
                        totalStudents: 19,
                        hoursLogged: 68
                    },
                    badges: ['tutor', 'expert'],
                    isActive: true,
                    maxStudents: 5
                },
                {
                    userId: 'emily_adams',
                    userName: 'Emily Adams',
                    subjects: ['Mathematics'],
                    topics: ['Algebra', 'Pre-Calculus', 'Statistics'],
                    bio: 'Patient and encouraging tutor. I believe everyone can excel at math with the right approach!',
                    availability: {
                        tuesday: ['14:00-17:00'],
                        thursday: ['14:00-17:00'],
                        friday: ['16:00-19:00']
                    },
                    registeredAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                    stats: {
                        totalSessions: 43,
                        completedSessions: 42,
                        averageRating: 4.9,
                        totalStudents: 18,
                        hoursLogged: 59
                    },
                    badges: ['tutor', 'top_rated'],
                    isActive: true,
                    maxStudents: 4
                },
                {
                    userId: 'brandon_king',
                    userName: 'Brandon King',
                    subjects: ['Science'],
                    topics: ['Biology', 'Human Physiology', 'Molecular Biology'],
                    bio: 'Pre-med student with a passion for teaching. I focus on understanding concepts rather than memorization.',
                    availability: {
                        monday: ['16:00-18:00'],
                        friday: ['14:00-17:00'],
                        sunday: ['10:00-13:00']
                    },
                    registeredAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
                    stats: {
                        totalSessions: 38,
                        completedSessions: 37,
                        averageRating: 4.7,
                        totalStudents: 15,
                        hoursLogged: 52
                    },
                    badges: ['tutor'],
                    isActive: true,
                    maxStudents: 3
                },
                {
                    userId: 'sophia_martinez',
                    userName: 'Sophia Martinez',
                    subjects: ['Science'],
                    topics: ['Physics', 'Modern Physics', 'Quantum Mechanics'],
                    bio: 'Advanced physics tutor. I specialize in helping students grasp counterintuitive physics concepts.',
                    availability: {
                        wednesday: ['15:00-18:00'],
                        saturday: ['13:00-17:00']
                    },
                    registeredAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
                    stats: {
                        totalSessions: 29,
                        completedSessions: 28,
                        averageRating: 4.9,
                        totalStudents: 12,
                        hoursLogged: 41
                    },
                    badges: ['tutor', 'expert'],
                    isActive: true,
                    maxStudents: 3
                }
            ];
            
            localStorage.setItem(this.tutorsKey, JSON.stringify(sampleTutors));
        }
    }

    getCurrentUser() {
        const accountName = document.getElementById('accountName')?.textContent || 'Guest User';
        return {
            id: accountName.replace(/\s+/g, '_').toLowerCase(),
            name: accountName
        };
    }

    registerAsTutor(tutorData) {
        const tutors = this.getTutors();

        if (tutors.some(t => t.userId === this.currentUser.id)) {
            throw new Error('Already registered as a tutor');
        }

        const gamificationData = this.getGamificationData();
        if (gamificationData.totalPoints < 500) {
            throw new Error('Need at least 500 points to become a tutor');
        }

        const newTutor = {
            userId: this.currentUser.id,
            userName: this.currentUser.name,
            subjects: tutorData.subjects || [],
            topics: tutorData.topics || [],
            bio: tutorData.bio || '',
            availability: tutorData.availability || {},
            registeredAt: new Date().toISOString(),
            stats: {
                totalSessions: 0,
                completedSessions: 0,
                averageRating: 0,
                totalStudents: 0,
                hoursLogged: 0
            },
            badges: ['tutor'],
            isActive: true,
            maxStudents: tutorData.maxStudents || 5
        };

        tutors.push(newTutor);
        localStorage.setItem(this.tutorsKey, JSON.stringify(tutors));

        this.dispatchEvent('tutorRegistered', { tutor: newTutor });

        return newTutor;
    }

    updateTutorProfile(updates) {
        const tutors = this.getTutors();
        const tutor = tutors.find(t => t.userId === this.currentUser.id);

        if (!tutor) {
            throw new Error('Not registered as a tutor');
        }

        const allowedUpdates = ['subjects', 'topics', 'bio', 'availability', 'maxStudents', 'isActive'];
        allowedUpdates.forEach(key => {
            if (updates[key] !== undefined) {
                tutor[key] = updates[key];
            }
        });

        localStorage.setItem(this.tutorsKey, JSON.stringify(tutors));
        return tutor;
    }

    getTutors(filters = {}) {
        let tutors = JSON.parse(localStorage.getItem(this.tutorsKey) || '[]');

        tutors = tutors.filter(t => t.isActive);

        if (filters.subject) {
            tutors = tutors.filter(t => t.subjects.includes(filters.subject));
        }
        if (filters.topic) {
            tutors = tutors.filter(t => t.topics.includes(filters.topic));
        }
        if (filters.minRating) {
            tutors = tutors.filter(t => t.stats.averageRating >= filters.minRating);
        }

        tutors.sort((a, b) => {
            const scoreA = a.stats.averageRating * 10 + a.stats.completedSessions;
            const scoreB = b.stats.averageRating * 10 + b.stats.completedSessions;
            return scoreB - scoreA;
        });

        return tutors;
    }

    getTutor(userId) {
        const tutors = this.getTutors();
        return tutors.find(t => t.userId === userId);
    }

    isTutor(userId = null) {
        const targetId = userId || this.currentUser.id;
        return this.getTutors().some(t => t.userId === targetId);
    }

    findMatchingTutors(subject, topic = null) {
        const tutors = this.getTutors({ subject, topic });
        
        const userPerformance = this.getUserPerformance(subject);

        return tutors
            .filter(t => {
                const activeSessions = this.getActiveSessions(t.userId, 'tutor');
                return activeSessions.length < t.maxStudents;
            })
            .map(t => ({
                ...t,
                matchScore: this.calculateMatchScore(t, userPerformance)
            }))
            .sort((a, b) => b.matchScore - a.matchScore);
    }

    calculateMatchScore(tutor, userPerformance) {
        let score = 0;

        score += tutor.stats.averageRating * 10;

        score += Math.min(tutor.stats.completedSessions, 30);

        const currentDay = new Date().getDay();
        if (tutor.availability[currentDay]) {
            score += 20;
        }

        return score;
    }

    requestTutor(requestData) {
        const requests = this.getRequests();
        
        const newRequest = {
            id: `req_${Date.now()}`,
            studentId: this.currentUser.id,
            studentName: this.currentUser.name,
            tutorId: requestData.tutorId,
            subject: requestData.subject,
            topic: requestData.topic || '',
            description: requestData.description || '',
            preferredTimes: requestData.preferredTimes || [],
            urgency: requestData.urgency || 'normal',
            createdAt: new Date().toISOString(),
            status: 'pending',
            respondedAt: null
        };

        requests.push(newRequest);
        localStorage.setItem(this.requestsKey, JSON.stringify(requests));

        this.dispatchEvent('tutorRequested', { request: newRequest });

        return newRequest;
    }

    respondToRequest(requestId, accept, proposedTime = null) {
        const requests = this.getRequests();
        const request = requests.find(r => r.id === requestId);

        if (!request) {
            throw new Error('Request not found');
        }

        if (request.tutorId !== this.currentUser.id) {
            throw new Error('Not authorized to respond to this request');
        }

        request.status = accept ? 'accepted' : 'rejected';
        request.respondedAt = new Date().toISOString();

        localStorage.setItem(this.requestsKey, JSON.stringify(requests));

        if (accept && proposedTime) {
            this.scheduleSession({
                tutorId: request.tutorId,
                studentId: request.studentId,
                studentName: request.studentName,
                subject: request.subject,
                topic: request.topic,
                scheduledTime: proposedTime,
                requestId: requestId
            });
        }

        this.dispatchEvent('requestResponded', { request, accepted: accept });

        return request;
    }

    getRequests(filters = {}) {
        let requests = JSON.parse(localStorage.getItem(this.requestsKey) || '[]');

        if (filters.studentId) {
            requests = requests.filter(r => r.studentId === filters.studentId);
        }
        if (filters.tutorId) {
            requests = requests.filter(r => r.tutorId === filters.tutorId);
        }
        if (filters.status) {
            requests = requests.filter(r => r.status === filters.status);
        }

        return requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    getMyRequests() {
        return this.getRequests({ studentId: this.currentUser.id });
    }

    getMyTutorRequests() {
        return this.getRequests({ tutorId: this.currentUser.id });
    }

    scheduleSession(sessionData) {
        const sessions = this.getSessions();

        const newSession = {
            id: `session_${Date.now()}`,
            tutorId: sessionData.tutorId,
            tutorName: this.getTutor(sessionData.tutorId)?.userName || '',
            studentId: sessionData.studentId,
            studentName: sessionData.studentName,
            subject: sessionData.subject,
            topic: sessionData.topic || '',
            scheduledTime: sessionData.scheduledTime,
            duration: sessionData.duration || 60,
            createdAt: new Date().toISOString(),
            status: 'scheduled',
            startedAt: null,
            completedAt: null,
            notes: '',
            rating: null,
            feedback: '',
            requestId: sessionData.requestId || null
        };

        sessions.push(newSession);
        localStorage.setItem(this.sessionsKey, JSON.stringify(sessions));

        this.dispatchEvent('sessionScheduled', { session: newSession });

        return newSession;
    }

    startSession(sessionId) {
        const sessions = this.getSessions();
        const session = sessions.find(s => s.id === sessionId);

        if (!session) {
            throw new Error('Session not found');
        }

        if (session.tutorId !== this.currentUser.id && session.studentId !== this.currentUser.id) {
            throw new Error('Not authorized');
        }

        session.status = 'in-progress';
        session.startedAt = new Date().toISOString();

        localStorage.setItem(this.sessionsKey, JSON.stringify(sessions));

        this.dispatchEvent('sessionStarted', { session });

        return session;
    }

    completeSession(sessionId, sessionData = {}) {
        const sessions = this.getSessions();
        const session = sessions.find(s => s.id === sessionId);

        if (!session) {
            throw new Error('Session not found');
        }

        if (session.tutorId !== this.currentUser.id) {
            throw new Error('Only tutor can complete session');
        }

        session.status = 'completed';
        session.completedAt = new Date().toISOString();
        session.notes = sessionData.notes || '';

        const actualDuration = session.startedAt 
            ? (new Date(session.completedAt) - new Date(session.startedAt)) / 1000 / 60
            : session.duration;

        const tutors = this.getTutors();
        const tutor = tutors.find(t => t.userId === session.tutorId);
        if (tutor) {
            tutor.stats.completedSessions++;
            tutor.stats.totalSessions++;
            tutor.stats.hoursLogged += actualDuration / 60;
            
            const students = new Set(
                sessions
                    .filter(s => s.tutorId === session.tutorId && s.status === 'completed')
                    .map(s => s.studentId)
            );
            tutor.stats.totalStudents = students.size;

            localStorage.setItem(this.tutorsKey, JSON.stringify(tutors));
        }

        localStorage.setItem(this.sessionsKey, JSON.stringify(sessions));

        this.dispatchEvent('sessionCompleted', { 
            session, 
            tutorId: session.tutorId,
            pointsEarned: Math.floor(actualDuration / 10) + 50 
        });

        return session;
    }

    cancelSession(sessionId, reason = '') {
        const sessions = this.getSessions();
        const session = sessions.find(s => s.id === sessionId);

        if (!session) {
            throw new Error('Session not found');
        }

        if (session.tutorId !== this.currentUser.id && session.studentId !== this.currentUser.id) {
            throw new Error('Not authorized');
        }

        session.status = 'cancelled';
        session.notes = reason;

        localStorage.setItem(this.sessionsKey, JSON.stringify(sessions));

        return session;
    }

    getSessions(filters = {}) {
        let sessions = JSON.parse(localStorage.getItem(this.sessionsKey) || '[]');

        if (filters.tutorId) {
            sessions = sessions.filter(s => s.tutorId === filters.tutorId);
        }
        if (filters.studentId) {
            sessions = sessions.filter(s => s.studentId === filters.studentId);
        }
        if (filters.status) {
            sessions = sessions.filter(s => s.status === filters.status);
        }
        if (filters.subject) {
            sessions = sessions.filter(s => s.subject === filters.subject);
        }

        return sessions.sort((a, b) => new Date(b.scheduledTime) - new Date(a.scheduledTime));
    }

    getActiveSessions(userId = null, role = 'both') {
        const targetId = userId || this.currentUser.id;
        const sessions = this.getSessions();

        return sessions.filter(s => {
            const isActive = ['scheduled', 'in-progress'].includes(s.status);
            if (role === 'tutor') {
                return isActive && s.tutorId === targetId;
            } else if (role === 'student') {
                return isActive && s.studentId === targetId;
            } else {
                return isActive && (s.tutorId === targetId || s.studentId === targetId);
            }
        });
    }

    getMySessions() {
        const sessions = this.getSessions();
        return sessions.filter(s => 
            s.tutorId === this.currentUser.id || s.studentId === this.currentUser.id
        );
    }

    rateSession(sessionId, rating, feedback = '') {
        if (rating < 1 || rating > 5) {
            throw new Error('Rating must be between 1 and 5');
        }

        const sessions = this.getSessions();
        const session = sessions.find(s => s.id === sessionId);

        if (!session) {
            throw new Error('Session not found');
        }

        if (session.studentId !== this.currentUser.id) {
            throw new Error('Only student can rate session');
        }

        if (session.status !== 'completed') {
            throw new Error('Can only rate completed sessions');
        }

        session.rating = rating;
        session.feedback = feedback;

        localStorage.setItem(this.sessionsKey, JSON.stringify(sessions));

        this.updateTutorRating(session.tutorId);

        if (rating >= 4) {
            this.dispatchEvent('highRatingReceived', {
                tutorId: session.tutorId,
                rating,
                bonusPoints: rating === 5 ? 50 : 25
            });
        }

        return session;
    }

    updateTutorRating(tutorId) {
        const sessions = this.getSessions({ tutorId, status: 'completed' });
        const ratedSessions = sessions.filter(s => s.rating !== null);

        if (ratedSessions.length === 0) return;

        const averageRating = ratedSessions.reduce((sum, s) => sum + s.rating, 0) / ratedSessions.length;

        const tutors = this.getTutors();
        const tutor = tutors.find(t => t.userId === tutorId);

        if (tutor) {
            tutor.stats.averageRating = Math.round(averageRating * 10) / 10;

            this.checkTutorBadges(tutor);

            localStorage.setItem(this.tutorsKey, JSON.stringify(tutors));
        }
    }

    checkTutorBadges(tutor) {
        const newBadges = [];

        if (tutor.stats.completedSessions >= 10 && !tutor.badges.includes('experienced_tutor')) {
            newBadges.push('experienced_tutor');
        }
        if (tutor.stats.completedSessions >= 50 && !tutor.badges.includes('master_tutor')) {
            newBadges.push('master_tutor');
        }
        if (tutor.stats.completedSessions >= 100 && !tutor.badges.includes('legendary_tutor')) {
            newBadges.push('legendary_tutor');
        }

        if (tutor.stats.averageRating >= 4.5 && tutor.stats.completedSessions >= 10 && 
            !tutor.badges.includes('highly_rated')) {
            newBadges.push('highly_rated');
        }
        if (tutor.stats.averageRating >= 4.8 && tutor.stats.completedSessions >= 25 && 
            !tutor.badges.includes('elite_tutor')) {
            newBadges.push('elite_tutor');
        }

        if (tutor.stats.hoursLogged >= 50 && !tutor.badges.includes('dedicated_mentor')) {
            newBadges.push('dedicated_mentor');
        }

        newBadges.forEach(badge => {
            if (!tutor.badges.includes(badge)) {
                tutor.badges.push(badge);
                this.dispatchEvent('tutorBadgeEarned', { tutorId: tutor.userId, badge });
            }
        });
    }

    getGamificationData() {
        if (window.gamificationSystem) {
            return {
                totalPoints: gamificationSystem.getTotalPoints(),
                level: gamificationSystem.getLevel()
            };
        }
        return { totalPoints: 0, level: 1 };
    }

    getUserPerformance(subject) {
        if (window.analyticsSystem) {
            const stats = analyticsSystem.getSubjectStats(subject);
            return {
                averageScore: stats.averageScore || 0,
                timeSpent: stats.totalTime || 0,
                needsHelp: stats.averageScore < 70
            };
        }
        return { averageScore: 0, timeSpent: 0, needsHelp: false };
    }

    getMyTutoringStats() {
        const isTutor = this.isTutor();
        const mySessions = this.getMySessions();

        if (isTutor) {
            const tutor = this.getTutor(this.currentUser.id);
            const tutorSessions = mySessions.filter(s => s.tutorId === this.currentUser.id);
            const pendingRequests = this.getMyTutorRequests().filter(r => r.status === 'pending');

            return {
                role: 'tutor',
                ...tutor.stats,
                badges: tutor.badges,
                pendingRequests: pendingRequests.length,
                upcomingSessions: this.getActiveSessions(this.currentUser.id, 'tutor').length
            };
        } else {
            const studentSessions = mySessions.filter(s => s.studentId === this.currentUser.id);
            const completedSessions = studentSessions.filter(s => s.status === 'completed');

            return {
                role: 'student',
                totalSessions: studentSessions.length,
                completedSessions: completedSessions.length,
                hoursReceived: completedSessions.reduce((sum, s) => sum + (s.duration || 60) / 60, 0),
                averageRatingGiven: completedSessions.filter(s => s.rating).length > 0
                    ? completedSessions.filter(s => s.rating).reduce((sum, s) => sum + s.rating, 0) / 
                      completedSessions.filter(s => s.rating).length
                    : 0,
                activeSessions: this.getActiveSessions(this.currentUser.id, 'student').length
            };
        }
    }

    dispatchEvent(eventName, data) {
        const event = new CustomEvent(`tutoring:${eventName}`, { detail: data });
        window.dispatchEvent(event);
    }
}

const peerTutoringSystem = new PeerTutoringSystem();

window.addEventListener('tutoring:sessionCompleted', (e) => {
    const { tutorId, pointsEarned } = e.detail;
    if (window.gamificationSystem && tutorId === peerTutoringSystem.currentUser.id) {
        gamificationSystem.addPoints(pointsEarned, 'tutoring_session');
    }
});

window.addEventListener('tutoring:highRatingReceived', (e) => {
    const { tutorId, bonusPoints } = e.detail;
    if (window.gamificationSystem && tutorId === peerTutoringSystem.currentUser.id) {
        gamificationSystem.addPoints(bonusPoints, 'high_rating_bonus');
    }
});

window.addEventListener('tutoring:tutorBadgeEarned', (e) => {
    const { tutorId, badge } = e.detail;
    if (window.gamificationSystem && tutorId === peerTutoringSystem.currentUser.id) {
        gamificationSystem.unlockAchievement(badge);
    }
});