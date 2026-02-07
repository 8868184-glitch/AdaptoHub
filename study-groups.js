class StudyGroupsSystem {
    constructor() {
        this.storageKey = 'adaptohub_study_groups';
        this.membershipKey = 'adaptohub_group_memberships';
        this.challengesKey = 'adaptohub_group_challenges';
        this.currentUser = this.getCurrentUser();
        this.init();
    }

    init() {
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.membershipKey)) {
            localStorage.setItem(this.membershipKey, JSON.stringify({}));
        }
        if (!localStorage.getItem(this.challengesKey)) {
            localStorage.setItem(this.challengesKey, JSON.stringify([]));
        }
        
        this.initializeSampleData();
    }

    initializeSampleData() {
        const groups = this.getGroups();
        if (groups.length === 0) {
            const sampleGroups = [
                {
                    id: 'sample_calculus_masters',
                    name: 'Calculus Masters',
                    subject: 'Mathematics',
                    description: 'Advanced calculus study group focusing on limits, derivatives, and integrals. Join us for daily problem-solving sessions!',
                    createdBy: 'admin',
                    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                    members: [
                        { userId: 'sarah_chen', userName: 'Sarah Chen', role: 'admin', joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), contributionScore: 450 },
                        { userId: 'mike_wilson', userName: 'Mike Wilson', role: 'moderator', joinedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), contributionScore: 320 },
                        { userId: 'emma_johnson', userName: 'Emma Johnson', role: 'member', joinedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), contributionScore: 280 },
                        { userId: 'alex_kumar', userName: 'Alex Kumar', role: 'member', joinedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), contributionScore: 195 },
                        { userId: 'lisa_park', userName: 'Lisa Park', role: 'member', joinedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), contributionScore: 140 }
                    ],
                    settings: { isPrivate: false, maxMembers: 50, requireApproval: false },
                    stats: { totalQuizzesTaken: 234, totalStudyTime: 1250, averageScore: 87, challengesCompleted: 45 },
                    activity: []
                },
                {
                    id: 'sample_physics_explorers',
                    name: 'Physics Explorers',
                    subject: 'Science',
                    description: 'Dive into the world of physics! From mechanics to electromagnetism, we explore it all together.',
                    createdBy: 'admin',
                    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
                    members: [
                        { userId: 'david_lee', userName: 'David Lee', role: 'admin', joinedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), contributionScore: 580 },
                        { userId: 'sophia_martinez', userName: 'Sophia Martinez', role: 'member', joinedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(), contributionScore: 410 },
                        { userId: 'james_brown', userName: 'James Brown', role: 'member', joinedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(), contributionScore: 365 },
                        { userId: 'olivia_davis', userName: 'Olivia Davis', role: 'member', joinedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(), contributionScore: 220 }
                    ],
                    settings: { isPrivate: false, maxMembers: 40, requireApproval: false },
                    stats: { totalQuizzesTaken: 189, totalStudyTime: 980, averageScore: 84, challengesCompleted: 38 },
                    activity: []
                },
                {
                    id: 'sample_chemistry_lab',
                    name: 'Chemistry Lab Partners',
                    subject: 'Science',
                    description: 'Perfect your chemistry knowledge! Organic, inorganic, and everything in between. Let\'s ace those reactions!',
                    createdBy: 'admin',
                    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
                    members: [
                        { userId: 'rachel_white', userName: 'Rachel White', role: 'admin', joinedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), contributionScore: 290 },
                        { userId: 'kevin_garcia', userName: 'Kevin Garcia', role: 'member', joinedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), contributionScore: 175 },
                        { userId: 'natalie_thompson', userName: 'Natalie Thompson', role: 'member', joinedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), contributionScore: 130 }
                    ],
                    settings: { isPrivate: false, maxMembers: 30, requireApproval: false },
                    stats: { totalQuizzesTaken: 98, totalStudyTime: 520, averageScore: 81, challengesCompleted: 22 },
                    activity: []
                },
                {
                    id: 'sample_geometry_squad',
                    name: 'Geometry Squad',
                    subject: 'Mathematics',
                    description: 'Shapes, angles, and proofs! Join our friendly community to master geometry concepts together.',
                    createdBy: 'admin',
                    createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
                    members: [
                        { userId: 'chris_anderson', userName: 'Chris Anderson', role: 'admin', joinedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(), contributionScore: 520 },
                        { userId: 'megan_taylor', userName: 'Megan Taylor', role: 'moderator', joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), contributionScore: 445 },
                        { userId: 'ryan_moore', userName: 'Ryan Moore', role: 'member', joinedAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(), contributionScore: 310 },
                        { userId: 'jennifer_clark', userName: 'Jennifer Clark', role: 'member', joinedAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(), contributionScore: 245 },
                        { userId: 'tyler_hall', userName: 'Tyler Hall', role: 'member', joinedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), contributionScore: 155 },
                        { userId: 'ashley_lewis', userName: 'Ashley Lewis', role: 'member', joinedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), contributionScore: 95 }
                    ],
                    settings: { isPrivate: false, maxMembers: 45, requireApproval: false },
                    stats: { totalQuizzesTaken: 167, totalStudyTime: 840, averageScore: 86, challengesCompleted: 35 },
                    activity: []
                },
                {
                    id: 'sample_biology_buddies',
                    name: 'Biology Buddies',
                    subject: 'Science',
                    description: 'From cells to ecosystems! Study biology with passionate learners. Weekly quiz competitions and study sessions.',
                    createdBy: 'admin',
                    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
                    members: [
                        { userId: 'amanda_wright', userName: 'Amanda Wright', role: 'admin', joinedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(), contributionScore: 610 },
                        { userId: 'brandon_king', userName: 'Brandon King', role: 'member', joinedAt: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString(), contributionScore: 480 },
                        { userId: 'nicole_scott', userName: 'Nicole Scott', role: 'member', joinedAt: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString(), contributionScore: 390 },
                        { userId: 'daniel_green', userName: 'Daniel Green', role: 'member', joinedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), contributionScore: 265 }
                    ],
                    settings: { isPrivate: false, maxMembers: 35, requireApproval: false },
                    stats: { totalQuizzesTaken: 215, totalStudyTime: 1120, averageScore: 89, challengesCompleted: 42 },
                    activity: []
                },
                {
                    id: 'sample_algebra_aces',
                    name: 'Algebra Aces',
                    subject: 'Mathematics',
                    description: 'Master algebra fundamentals and beyond! Equations, functions, and polynomials made easy.',
                    createdBy: 'admin',
                    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
                    members: [
                        { userId: 'emily_adams', userName: 'Emily Adams', role: 'admin', joinedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), contributionScore: 380 },
                        { userId: 'jacob_baker', userName: 'Jacob Baker', role: 'member', joinedAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(), contributionScore: 295 },
                        { userId: 'hannah_nelson', userName: 'Hannah Nelson', role: 'member', joinedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(), contributionScore: 210 }
                    ],
                    settings: { isPrivate: false, maxMembers: 40, requireApproval: false },
                    stats: { totalQuizzesTaken: 142, totalStudyTime: 650, averageScore: 83, challengesCompleted: 28 },
                    activity: []
                }
            ];
            
            localStorage.setItem(this.storageKey, JSON.stringify(sampleGroups));
        }
    }

    getCurrentUser() {
        const accountName = document.getElementById('accountName')?.textContent || 'Guest User';
        return {
            id: accountName.replace(/\s+/g, '_').toLowerCase(),
            name: accountName
        };
    }

    createGroup(groupData) {
        const groups = this.getGroups();
        const newGroup = {
            id: `group_${Date.now()}`,
            name: groupData.name,
            subject: groupData.subject,
            description: groupData.description,
            createdBy: this.currentUser.id,
            createdAt: new Date().toISOString(),
            members: [{
                userId: this.currentUser.id,
                userName: this.currentUser.name,
                role: 'admin',
                joinedAt: new Date().toISOString(),
                contributionScore: 0
            }],
            settings: {
                isPrivate: groupData.isPrivate || false,
                maxMembers: groupData.maxMembers || 50,
                requireApproval: groupData.requireApproval || false
            },
            stats: {
                totalQuizzesTaken: 0,
                totalStudyTime: 0,
                averageScore: 0,
                challengesCompleted: 0
            },
            activity: []
        };

        groups.push(newGroup);
        localStorage.setItem(this.storageKey, JSON.stringify(groups));

        this.addMembership(this.currentUser.id, newGroup.id);

        this.dispatchEvent('groupCreated', { group: newGroup });

        return newGroup;
    }

    joinGroup(groupId) {
        const groups = this.getGroups();
        const group = groups.find(g => g.id === groupId);

        if (!group) {
            throw new Error('Group not found');
        }

        if (group.members.length >= group.settings.maxMembers) {
            throw new Error('Group is full');
        }

        if (group.members.some(m => m.userId === this.currentUser.id)) {
            throw new Error('Already a member');
        }

        const newMember = {
            userId: this.currentUser.id,
            userName: this.currentUser.name,
            role: 'member',
            joinedAt: new Date().toISOString(),
            contributionScore: 0
        };

        group.members.push(newMember);
        group.activity.push({
            type: 'member_joined',
            userId: this.currentUser.id,
            userName: this.currentUser.name,
            timestamp: new Date().toISOString()
        });

        localStorage.setItem(this.storageKey, JSON.stringify(groups));
        this.addMembership(this.currentUser.id, groupId);

        this.dispatchEvent('groupJoined', { group, member: newMember });

        return group;
    }

    leaveGroup(groupId) {
        const groups = this.getGroups();
        const group = groups.find(g => g.id === groupId);

        if (!group) {
            throw new Error('Group not found');
        }

        group.members = group.members.filter(m => m.userId !== this.currentUser.id);
        group.activity.push({
            type: 'member_left',
            userId: this.currentUser.id,
            userName: this.currentUser.name,
            timestamp: new Date().toISOString()
        });

        localStorage.setItem(this.storageKey, JSON.stringify(groups));
        this.removeMembership(this.currentUser.id, groupId);

        return group;
    }

    getGroups() {
        return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    }

    getGroup(groupId) {
        return this.getGroups().find(g => g.id === groupId);
    }

    getMyGroups() {
        const groups = this.getGroups();
        return groups.filter(g => g.members.some(m => m.userId === this.currentUser.id));
    }

    getPublicGroups() {
        const groups = this.getGroups();
        return groups.filter(g => !g.settings.isPrivate);
    }

    updateGroup(groupId, updates) {
        const groups = this.getGroups();
        const groupIndex = groups.findIndex(g => g.id === groupId);
        if (groupIndex === -1) {
            throw new Error('Group not found');
        }

        const group = groups[groupIndex];
        const updated = {
            ...group,
            name: updates.name ?? group.name,
            subject: updates.subject ?? group.subject,
            description: updates.description ?? group.description,
            settings: {
                ...group.settings,
                isPrivate: typeof updates.isPrivate === 'boolean' ? updates.isPrivate : group.settings.isPrivate,
                maxMembers: updates.maxMembers ?? group.settings.maxMembers,
                requireApproval: typeof updates.requireApproval === 'boolean' ? updates.requireApproval : group.settings.requireApproval
            }
        };

        updated.activity = updated.activity || [];
        updated.activity.push({
            type: 'group_updated',
            userId: this.currentUser.id,
            userName: this.currentUser.name,
            timestamp: new Date().toISOString()
        });

        groups[groupIndex] = updated;
        localStorage.setItem(this.storageKey, JSON.stringify(groups));
        this.dispatchEvent('groupUpdated', { group: updated });
        return updated;
    }

    removeMember(groupId, userId) {
        const groups = this.getGroups();
        const groupIndex = groups.findIndex(g => g.id === groupId);
        if (groupIndex === -1) {
            throw new Error('Group not found');
        }

        const group = groups[groupIndex];
        const member = group.members.find(m => m.userId === userId);
        if (!member) {
            throw new Error('Member not found');
        }

        const admins = group.members.filter(m => m.role === 'admin');
        if (member.role === 'admin' && admins.length <= 1) {
            throw new Error('Cannot remove the last admin');
        }

        group.members = group.members.filter(m => m.userId !== userId);
        group.activity.push({
            type: 'member_removed',
            userId: userId,
            userName: member.userName,
            removedBy: this.currentUser.id,
            timestamp: new Date().toISOString()
        });

        groups[groupIndex] = group;
        localStorage.setItem(this.storageKey, JSON.stringify(groups));
        this.removeMembership(userId, groupId);
        this.dispatchEvent('memberRemoved', { group, member });
        return group;
    }

    searchGroups(query, subject = null) {
        const groups = this.getPublicGroups();
        return groups.filter(g => {
            const matchesQuery = g.name.toLowerCase().includes(query.toLowerCase()) ||
                                g.description.toLowerCase().includes(query.toLowerCase());
            const matchesSubject = !subject || g.subject === subject;
            return matchesQuery && matchesSubject;
        });
    }

    addMembership(userId, groupId) {
        const memberships = JSON.parse(localStorage.getItem(this.membershipKey) || '{}');
        if (!memberships[userId]) {
            memberships[userId] = [];
        }
        if (!memberships[userId].includes(groupId)) {
            memberships[userId].push(groupId);
        }
        localStorage.setItem(this.membershipKey, JSON.stringify(memberships));
    }

    removeMembership(userId, groupId) {
        const memberships = JSON.parse(localStorage.getItem(this.membershipKey) || '{}');
        if (memberships[userId]) {
            memberships[userId] = memberships[userId].filter(id => id !== groupId);
        }
        localStorage.setItem(this.membershipKey, JSON.stringify(memberships));
    }

    createChallenge(groupId, challengeData) {
        const group = this.getGroup(groupId);
        if (!group) {
            throw new Error('Group not found');
        }

        const challenges = this.getChallenges();
        const newChallenge = {
            id: `challenge_${Date.now()}`,
            groupId: groupId,
            title: challengeData.title,
            description: challengeData.description,
            type: challengeData.type,
            subject: challengeData.subject,
            target: challengeData.target,
            duration: challengeData.duration,
            createdBy: this.currentUser.id,
            createdAt: new Date().toISOString(),
            endsAt: new Date(Date.now() + challengeData.duration * 24 * 60 * 60 * 1000).toISOString(),
            participants: [],
            leaderboard: [],
            status: 'active',
            rewards: {
                points: challengeData.points || 100,
                badge: challengeData.badge || null
            }
        };

        challenges.push(newChallenge);
        localStorage.setItem(this.challengesKey, JSON.stringify(challenges));

        group.activity.push({
            type: 'challenge_created',
            challengeId: newChallenge.id,
            title: newChallenge.title,
            userId: this.currentUser.id,
            userName: this.currentUser.name,
            timestamp: new Date().toISOString()
        });

        const groups = this.getGroups();
        const groupIndex = groups.findIndex(g => g.id === groupId);
        groups[groupIndex] = group;
        localStorage.setItem(this.storageKey, JSON.stringify(groups));

        this.dispatchEvent('challengeCreated', { challenge: newChallenge });

        return newChallenge;
    }

    joinChallenge(challengeId) {
        const challenges = this.getChallenges();
        const challenge = challenges.find(c => c.id === challengeId);

        if (!challenge) {
            throw new Error('Challenge not found');
        }

        if (challenge.status !== 'active') {
            throw new Error('Challenge is not active');
        }

        if (challenge.participants.some(p => p.userId === this.currentUser.id)) {
            throw new Error('Already joined this challenge');
        }

        challenge.participants.push({
            userId: this.currentUser.id,
            userName: this.currentUser.name,
            progress: 0,
            completedAt: null
        });

        localStorage.setItem(this.challengesKey, JSON.stringify(challenges));

        return challenge;
    }

    updateChallengeProgress(challengeId, progress) {
        const challenges = this.getChallenges();
        const challenge = challenges.find(c => c.id === challengeId);

        if (!challenge) return;

        const participant = challenge.participants.find(p => p.userId === this.currentUser.id);
        if (participant) {
            participant.progress = progress;

            if (progress >= challenge.target && !participant.completedAt) {
                participant.completedAt = new Date().toISOString();
                this.dispatchEvent('challengeCompleted', { challenge, participant });
            }

            this.updateLeaderboard(challenge);
            localStorage.setItem(this.challengesKey, JSON.stringify(challenges));
        }
    }

    updateLeaderboard(challenge) {
        challenge.leaderboard = challenge.participants
            .map(p => ({
                userId: p.userId,
                userName: p.userName,
                progress: p.progress,
                completedAt: p.completedAt
            }))
            .sort((a, b) => {
                if (a.completedAt && !b.completedAt) return -1;
                if (!a.completedAt && b.completedAt) return 1;
                if (a.completedAt && b.completedAt) {
                    return new Date(a.completedAt) - new Date(b.completedAt);
                }
                return b.progress - a.progress;
            });
    }

    getChallenges(groupId = null) {
        const challenges = JSON.parse(localStorage.getItem(this.challengesKey) || '[]');
        if (groupId) {
            return challenges.filter(c => c.groupId === groupId);
        }
        return challenges;
    }

    getActiveChallenges(groupId = null) {
        if (groupId) {
            this.seedDefaultChallengesForGroup(groupId);
        } else {
            this.getGroups().forEach(group => this.seedDefaultChallengesForGroup(group.id));
        }

        return this.getChallenges(groupId).filter(c => c.status === 'active');
    }

    seedDefaultChallengesForGroup(groupId) {
        const group = this.getGroup(groupId);
        if (!group) return;

        const challenges = this.getChallenges();
        const activeForGroup = challenges.filter(c => c.groupId === groupId && c.status === 'active');
        if (activeForGroup.length > 0) return;

        const now = Date.now();
        const endsAt = new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString();
        const endDate = new Date(endsAt).toLocaleDateString();

        const defaultChallenges = [
            {
                id: `challenge_${groupId}_${now}`,
                groupId,
                title: `${group.subject} Sprint Week`,
                description: `Complete 5 ${group.subject.toLowerCase()} quizzes as a team this week.`,
                type: 'quiz',
                subject: group.subject,
                target: 5,
                duration: 7,
                createdBy: group.createdBy,
                createdAt: new Date().toISOString(),
                endsAt,
                endDate,
                participants: [],
                leaderboard: [],
                status: 'active',
                rewards: {
                    points: 150,
                    badge: null
                }
            }
        ];

        const updated = [...challenges, ...defaultChallenges];
        localStorage.setItem(this.challengesKey, JSON.stringify(updated));
    }

    getMyChallenges() {
        const challenges = this.getChallenges();
        return challenges.filter(c => 
            c.participants.some(p => p.userId === this.currentUser.id)
        );
    }

    updateGroupProgress(groupId, progressData) {
        const groups = this.getGroups();
        const group = groups.find(g => g.id === groupId);

        if (!group) return;

        const member = group.members.find(m => m.userId === this.currentUser.id);
        if (member) {
            member.contributionScore += progressData.points || 0;
        }

        if (progressData.quizCompleted) {
            group.stats.totalQuizzesTaken++;
            group.stats.averageScore = 
                ((group.stats.averageScore * (group.stats.totalQuizzesTaken - 1)) + progressData.score) /
                group.stats.totalQuizzesTaken;
        }

        if (progressData.studyTime) {
            group.stats.totalStudyTime += progressData.studyTime;
        }

        group.activity.push({
            type: progressData.type || 'progress_update',
            userId: this.currentUser.id,
            userName: this.currentUser.name,
            data: progressData,
            timestamp: new Date().toISOString()
        });

        if (group.activity.length > 50) {
            group.activity = group.activity.slice(-50);
        }

        localStorage.setItem(this.storageKey, JSON.stringify(groups));
    }

    getGroupLeaderboard(groupId) {
        const group = this.getGroup(groupId);
        if (!group) return [];

        return group.members
            .map(m => ({
                userId: m.userId,
                userName: m.userName,
                contributionScore: m.contributionScore,
                role: m.role
            }))
            .sort((a, b) => b.contributionScore - a.contributionScore);
    }

    getGroupActivity(groupId, limit = 20) {
        const group = this.getGroup(groupId);
        if (!group) return [];

        return group.activity.slice(-limit).reverse();
    }

    getMyGroupStats() {
        const myGroups = this.getMyGroups();
        const myChallenges = this.getMyChallenges();

        return {
            totalGroups: myGroups.length,
            totalMembers: myGroups.reduce((sum, g) => sum + g.members.length, 0),
            activeChallenges: myChallenges.filter(c => c.status === 'active').length,
            completedChallenges: myChallenges.filter(c => {
                const participant = c.participants.find(p => p.userId === this.currentUser.id);
                return participant && participant.completedAt;
            }).length,
            totalContribution: myGroups.reduce((sum, g) => {
                const member = g.members.find(m => m.userId === this.currentUser.id);
                return sum + (member ? member.contributionScore : 0);
            }, 0)
        };
    }

    dispatchEvent(eventName, data) {
        const event = new CustomEvent(`studyGroup:${eventName}`, { detail: data });
        window.dispatchEvent(event);
    }
}

const studyGroupsSystem = new StudyGroupsSystem();

window.addEventListener('quizCompleted', (e) => {
    const { subject, score, timeSpent } = e.detail;
    const myGroups = studyGroupsSystem.getMyGroups();
    
    myGroups.forEach(group => {
        if (group.subject === subject || group.subject === 'All Subjects') {
            studyGroupsSystem.updateGroupProgress(group.id, {
                type: 'quiz_completed',
                quizCompleted: true,
                subject,
                score,
                points: Math.floor(score / 10),
                studyTime: timeSpent
            });

            const challenges = studyGroupsSystem.getActiveChallenges(group.id);
            challenges.forEach(challenge => {
                if (challenge.type === 'quiz_score' && challenge.subject === subject) {
                    studyGroupsSystem.updateChallengeProgress(challenge.id, score);
                }
            });
        }
    });
});

window.addEventListener('studySessionEnded', (e) => {
    const { subject, duration } = e.detail;
    const myGroups = studyGroupsSystem.getMyGroups();
    
    myGroups.forEach(group => {
        if (group.subject === subject || group.subject === 'All Subjects') {
            studyGroupsSystem.updateGroupProgress(group.id, {
                type: 'study_session',
                studyTime: duration,
                points: Math.floor(duration / 60)
            });

            const challenges = studyGroupsSystem.getActiveChallenges(group.id);
            challenges.forEach(challenge => {
                if (challenge.type === 'study_time' && challenge.subject === subject) {
                    const currentParticipant = challenge.participants.find(
                        p => p.userId === studyGroupsSystem.currentUser.id
                    );
                    if (currentParticipant) {
                        studyGroupsSystem.updateChallengeProgress(
                            challenge.id,
                            currentParticipant.progress + duration
                        );
                    }
                }
            });
        }
    });
});