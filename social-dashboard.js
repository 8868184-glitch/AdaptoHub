class SocialDashboard {
    constructor() {
        this.currentTab = 'groups';
        this.currentView = null;
        this.init();
    }

    init() {
        this.setupTabNavigation();
        this.setupEventListeners();
        this.renderCurrentTab();
    }

    setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.social-tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                this.switchTab(tab);
            });
        });
    }

    switchTab(tab) {
        document.querySelectorAll('.social-tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });

        document.querySelectorAll('.social-tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `${tab}Tab`);
        });

        this.currentTab = tab;
        this.renderCurrentTab();
    }

    renderCurrentTab() {
        switch (this.currentTab) {
            case 'groups':
                this.renderMyGroups();
                break;
            case 'forums':
                this.renderQuestions();
                break;
            case 'tutoring':
                this.renderTutoringDashboard();
                break;
        }
    }

    setupEventListeners() {
        document.getElementById('createGroupBtn')?.addEventListener('click', () => this.showCreateGroupModal());
        document.getElementById('browseGroupsBtn')?.addEventListener('click', () => this.renderPublicGroups());
        document.getElementById('myGroupsBtn')?.addEventListener('click', () => this.renderMyGroups());

        document.getElementById('askQuestionBtn')?.addEventListener('click', () => this.showAskQuestionModal());
        document.getElementById('myQuestionsBtn')?.addEventListener('click', () => this.renderMyQuestions());
        document.getElementById('forumSearch')?.addEventListener('input', (e) => this.searchQuestions(e.target.value));
        document.getElementById('subjectFilter')?.addEventListener('change', () => this.renderQuestions());
        document.getElementById('difficultyFilter')?.addEventListener('change', () => this.renderQuestions());
        document.getElementById('sortFilter')?.addEventListener('change', () => this.renderQuestions());

        document.getElementById('becomeTutorBtn')?.addEventListener('click', () => this.showBecomeTutorModal());
        document.getElementById('findTutorBtn')?.addEventListener('click', () => this.renderFindTutor());
        document.getElementById('mySessionsBtn')?.addEventListener('click', () => this.renderMySessions());
    }

    renderMyGroups() {
        const container = document.getElementById('groupsContent');
        const myGroups = studyGroupsSystem.getMyGroups();

        if (myGroups.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 60px 20px; color: #666;">
                    <h3 style="color: #0097b2; margin-bottom: 15px;">No Study Groups Yet</h3>
                    <p>Create or join a study group to start collaborating!</p>
                </div>
            `;
            return;
        }

        const groupsHTML = myGroups.map(group => this.createGroupCard(group)).join('');
        container.innerHTML = `<div class="groups-grid">${groupsHTML}</div>`;
    }

    renderPublicGroups() {
        const container = document.getElementById('groupsContent');
        const publicGroups = studyGroupsSystem.getPublicGroups();

        const groupsHTML = publicGroups.map(group => this.createGroupCard(group, true)).join('');
        container.innerHTML = `
            <h2 style="color: #0097b2; margin-bottom: 20px;">Browse Public Groups</h2>
            <div class="groups-grid">${groupsHTML}</div>
        `;
    }

    createGroupCard(group, showJoinButton = false) {
        const isMember = group.members.some(m => m.userId === studyGroupsSystem.currentUser.id);
        
        return `
            <div class="group-card">
                <h3>${group.name}</h3>
                <span class="group-subject">${group.subject}</span>
                <p style="color: #666; margin: 15px 0;">${group.description}</p>
                <div class="group-stats">
                    <span>👥 ${group.members.length} members</span>
                    <span>📊 ${group.stats.totalQuizzesTaken} quizzes</span>
                    <span>⭐ ${Math.round(group.stats.averageScore)}% avg</span>
                </div>
                ${isMember ? `
                    <button class="action-btn secondary" onclick="socialDashboard.viewGroup('${group.id}')" style="width: 100%; margin-top: 15px;">
                        View Details
                    </button>
                ` : showJoinButton ? `
                    <button class="action-btn" onclick="socialDashboard.joinGroup('${group.id}')" style="width: 100%; margin-top: 15px;">
                        Join Group
                    </button>
                ` : ''}
            </div>
        `;
    }

    joinGroup(groupId) {
        try {
            studyGroupsSystem.joinGroup(groupId);
            alert('Successfully joined the group!');
            this.renderPublicGroups();
        } catch (error) {
            alert(error.message);
        }
    }

    viewGroup(groupId) {
        const group = studyGroupsSystem.getGroup(groupId);
        const challenges = studyGroupsSystem.getActiveChallenges(groupId);
        const isMember = group.members.some(m => m.userId === studyGroupsSystem.currentUser.id);
        const currentUserId = studyGroupsSystem.currentUser.id;
        
        const topMembers = [...group.members]
            .sort((a, b) => (b.contributionScore || 0) - (a.contributionScore || 0))
            .slice(0, 5);
        
        const modal = document.getElementById('createGroupModal');
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px; max-height: 90vh; overflow-y: auto;">
                <div class="modal-header">
                    <h2>${group.name}</h2>
                    <button class="close-modal" onclick="this.closest('.modal').classList.remove('active')">×</button>
                </div>
                
                <div style="padding: 20px;">
                    <div style="background: linear-gradient(135deg, #0097b2, #00b8d4); color: white; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
                        <div style="display: flex; justify-content: space-between; align-items: start; flex-wrap: wrap; gap: 15px;">
                            <div>
                                <span style="background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 12px; font-size: 0.85rem; font-weight: 600;">${group.subject}</span>
                                <h3 style="margin: 15px 0 10px 0; font-size: 1.3rem;">${group.description}</h3>
                                <p style="opacity: 0.9; margin: 0; font-size: 0.9rem;">Created ${group.createdAt ? new Date(group.createdAt).toLocaleDateString() : 'recently'}</p>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-size: 0.85rem; opacity: 0.9;">Group Type</div>
                                <div style="font-size: 1.2rem; font-weight: 700;">${group.isPrivate ? '🔒 Private' : '🌐 Public'}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 15px; margin-bottom: 25px;">
                        <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border-left: 4px solid #0097b2;">
                            <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 8px;">Members</div>
                            <div style="font-size: 2rem; font-weight: 700; color: #0097b2;">👥 ${group.members.length}</div>
                        </div>
                        <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border-left: 4px solid #6c5ce7;">
                            <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 8px;">Total Quizzes</div>
                            <div style="font-size: 2rem; font-weight: 700; color: #6c5ce7;">📊 ${group.stats.totalQuizzesTaken}</div>
                        </div>
                        <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border-left: 4px solid #00b894;">
                            <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 8px;">Avg Score</div>
                            <div style="font-size: 2rem; font-weight: 700; color: #00b894;">⭐ ${Math.round(group.stats.averageScore)}%</div>
                        </div>
                        <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border-left: 4px solid #f39c12;">
                            <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 8px;">Study Time</div>
                            <div style="font-size: 2rem; font-weight: 700; color: #f39c12;">⏱️ ${Math.round(group.stats.totalStudyTime / 60)}h</div>
                        </div>
                    </div>
                    
                    <div style="background: white; border: 1px solid #e6edf2; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
                        <h3 style="color: #0097b2; margin: 0 0 15px 0; font-size: 1.1rem;">🏆 Top Contributors</h3>
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            ${topMembers.map((member, index) => `
                                <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: ${index === 0 ? '#fff3cd' : '#f8fafc'}; border-radius: 8px;">
                                    <div style="display: flex; align-items: center; gap: 12px;">
                                        <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #0097b2, #00b8d4); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.1rem;">
                                            ${index + 1}
                                        </div>
                                        <div>
                                            <div style="font-weight: 600; color: #1f2933;">${member.userName}</div>
                                            <div style="font-size: 0.85rem; color: #64748b;">${member.role || 'member'}</div>
                                        </div>
                                    </div>
                                    <div style="text-align: right;">
                                        <div style="font-weight: 600; color: #0097b2;">${member.contributionScore || 0} pts</div>
                                        <div style="font-size: 0.8rem; color: #64748b;">contributions</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div style="background: white; border: 1px solid #e6edf2; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
                        <h3 style="color: #0097b2; margin: 0 0 15px 0; font-size: 1.1rem;">🎯 Active Challenges</h3>
                        ${challenges.length > 0 ? `
                            <div style="display: flex; flex-direction: column; gap: 12px;">
                                ${challenges.map(challenge => {
                                    const participants = challenge.participants || [];
                                    const participant = participants.find(p => p.userId === currentUserId);
                                    const isParticipant = !!participant;
                                    const progress = participant ? participant.progress || 0 : 0;
                                    return `
                                    <div style="padding: 15px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #0097b2;">
                                        <div style="font-weight: 600; color: #1f2933; margin-bottom: 5px;">${challenge.title}</div>
                                        <div style="font-size: 0.9rem; color: #64748b; margin-bottom: 10px;">${challenge.description}</div>
                                        <div style="display: flex; gap: 15px; font-size: 0.85rem; color: #64748b;">
                                            <span>📅 Ends: ${new Date(challenge.endsAt || challenge.endDate).toLocaleDateString()}</span>
                                            <span>👥 ${participants.length} participating</span>
                                        </div>
                                        <div style="margin-top: 12px; display: flex; align-items: center; gap: 10px;">
                                            ${isParticipant ? `
                                                <div style="flex: 1; height: 8px; background: #e6edf2; border-radius: 999px; overflow: hidden;">
                                                    <div style="height: 100%; width: ${Math.min(progress, 100)}%; background: linear-gradient(90deg, #0097b2, #00b8d4);"></div>
                                                </div>
                                                <span style="font-size: 0.85rem; color: #0097b2; font-weight: 600;">Joined • ${Math.min(progress, 100)}%</span>
                                            ` : `
                                                <button style="padding: 8px 12px; background: #0097b2; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;" onclick="socialDashboard.joinGroupChallenge('${challenge.id}', '${groupId}')">Join Challenge</button>
                                            `}
                                        </div>
                                    </div>
                                    `;
                                }).join('')}
                            </div>
                        ` : `
                            <p style="color: #64748b; text-align: center; padding: 20px;">No active challenges at the moment</p>
                        `}
                    </div>
                    
                    <div style="background: white; border: 1px solid #e6edf2; border-radius: 12px; padding: 20px;">
                        <h3 style="color: #0097b2; margin: 0 0 15px 0; font-size: 1.1rem;">📈 Recent Activity</h3>
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            <div style="padding: 10px; border-bottom: 1px solid #e6edf2;">
                                <span style="color: #64748b; font-size: 0.85rem;">Last quiz completed: ${group.stats.lastActivity ? new Date(group.stats.lastActivity).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            <div style="padding: 10px; border-bottom: 1px solid #e6edf2;">
                                <span style="color: #64748b; font-size: 0.85rem;">Challenges completed: ${group.stats.challengesCompleted || 0}</span>
                            </div>
                            <div style="padding: 10px;">
                                <span style="color: #64748b; font-size: 0.85rem;">Total discussions: ${group.stats.totalDiscussions || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="form-actions" style="padding: 20px; border-top: 1px solid #e6edf2;">
                    ${isMember ? `
                        <button class="btn-cancel" onclick="this.closest('.modal').classList.remove('active')">Close</button>
                        <button class="btn-submit" onclick="socialDashboard.showManageGroupModal('${groupId}')">Manage Group</button>
                    ` : `
                        <button class="btn-cancel" onclick="this.closest('.modal').classList.remove('active')">Close</button>
                        <button class="btn-submit" onclick="socialDashboard.joinGroup('${groupId}'); this.closest('.modal').classList.remove('active');">Join Group</button>
                    `}
                </div>
            </div>
        `;
        modal.classList.add('active');
    }

    showManageGroupModal(groupId) {
        const group = studyGroupsSystem.getGroup(groupId);
        if (!group) return;

        const currentUserId = studyGroupsSystem.currentUser.id;
        const currentMember = group.members.find(m => m.userId === currentUserId);
        const isAdmin = currentMember?.role === 'admin' || group.createdBy === currentUserId;

        const modal = document.getElementById('createGroupModal');
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px; max-height: 90vh; overflow-y: auto;">
                <div class="modal-header">
                    <h2>Manage Group</h2>
                    <button class="close-modal" onclick="this.closest('.modal').classList.remove('active')">×</button>
                </div>
                <div class="form-group">
                    <label>Group Name</label>
                    <input type="text" id="manageGroupName" value="${group.name}" ${isAdmin ? '' : 'disabled'}>
                </div>
                <div class="form-group">
                    <label>Subject</label>
                    <select id="manageGroupSubject" ${isAdmin ? '' : 'disabled'}>
                        <option value="Mathematics" ${group.subject === 'Mathematics' ? 'selected' : ''}>Mathematics</option>
                        <option value="Science" ${group.subject === 'Science' ? 'selected' : ''}>Science</option>
                        <option value="Social Studies" ${group.subject === 'Social Studies' ? 'selected' : ''}>Social Studies</option>
                        <option value="Religion, Morality & Ethics" ${group.subject === 'Religion, Morality & Ethics' ? 'selected' : ''}>Religion, Morality & Ethics</option>
                        <option value="All Subjects" ${group.subject === 'All Subjects' ? 'selected' : ''}>All Subjects</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea id="manageGroupDescription" ${isAdmin ? '' : 'disabled'}>${group.description}</textarea>
                </div>
                <div class="form-group">
                    <label>Settings</label>
                    <div style="display: grid; gap: 10px;">
                        <label style="display: flex; gap: 10px; align-items: center;">
                            <input type="checkbox" id="manageGroupPrivate" ${group.settings.isPrivate ? 'checked' : ''} ${isAdmin ? '' : 'disabled'}>
                            Private Group
                        </label>
                        <label style="display: flex; gap: 10px; align-items: center;">
                            <input type="checkbox" id="manageGroupApproval" ${group.settings.requireApproval ? 'checked' : ''} ${isAdmin ? '' : 'disabled'}>
                            Require Approval to Join
                        </label>
                        <label style="display: flex; gap: 10px; align-items: center;">
                            Max Members:
                            <input type="number" id="manageGroupMaxMembers" value="${group.settings.maxMembers}" min="5" max="500" style="width: 120px;" ${isAdmin ? '' : 'disabled'}>
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label>Members</label>
                    <div style="display: grid; gap: 8px;">
                        ${group.members.map(member => {
                            const isSelf = member.userId === currentUserId;
                            const removeDisabled = !isAdmin || (member.role === 'admin' && group.members.filter(m => m.role === 'admin').length <= 1);
                            return `
                                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border: 1px solid #e6edf2; border-radius: 8px;">
                                    <div>
                                        <strong>${member.userName}</strong>
                                        <span style="font-size: 0.8rem; color: #64748b; margin-left: 8px;">${member.role}</span>
                                    </div>
                                    ${isAdmin && !isSelf ? `
                                        <button style="background: #f44336; color: white; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer;" ${removeDisabled ? 'disabled' : ''} onclick="socialDashboard.removeMemberFromGroup('${groupId}', '${member.userId}')">Remove</button>
                                    ` : ''}
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
                <div class="form-actions">
                    <button class="btn-cancel" onclick="this.closest('.modal').classList.remove('active')">Close</button>
                    ${isAdmin ? `<button class="btn-submit" onclick="socialDashboard.saveGroupSettings('${groupId}')">Save Changes</button>` : ''}
                </div>
            </div>
        `;
        modal.classList.add('active');
    }

    saveGroupSettings(groupId) {
        try {
            const updates = {
                name: document.getElementById('manageGroupName').value.trim(),
                subject: document.getElementById('manageGroupSubject').value,
                description: document.getElementById('manageGroupDescription').value.trim(),
                isPrivate: document.getElementById('manageGroupPrivate').checked,
                requireApproval: document.getElementById('manageGroupApproval').checked,
                maxMembers: parseInt(document.getElementById('manageGroupMaxMembers').value, 10) || 50
            };

            if (!updates.name) {
                alert('Group name is required.');
                return;
            }

            studyGroupsSystem.updateGroup(groupId, updates);
            alert('Group updated successfully!');
            this.renderMyGroups();
            document.getElementById('createGroupModal').classList.remove('active');
        } catch (error) {
            alert(error.message);
        }
    }

    removeMemberFromGroup(groupId, userId) {
        try {
            studyGroupsSystem.removeMember(groupId, userId);
            this.showManageGroupModal(groupId);
        } catch (error) {
            alert(error.message);
        }
    }

    showCreateGroupModal() {
        const modal = document.getElementById('createGroupModal');
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Create Study Group</h2>
                    <button class="close-modal" onclick="this.closest('.modal').classList.remove('active')">×</button>
                </div>
                <div class="form-group">
                    <label>Group Name</label>
                    <input type="text" id="groupName" placeholder="e.g., Calculus Study Squad">
                </div>
                <div class="form-group">
                    <label>Subject</label>
                    <select id="groupSubject">
                        <option value="Mathematics">Mathematics</option>
                        <option value="Science">Science</option>
                        <option value="Social Studies">Social Studies</option>
                        <option value="Religion, Morality & Ethics">Religion, Morality & Ethics</option>
                        <option value="All Subjects">All Subjects</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea id="groupDescription" placeholder="Describe your group's goals..."></textarea>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="groupPrivate"> Private Group
                    </label>
                </div>
                <div class="form-actions">
                    <button class="btn-cancel" onclick="this.closest('.modal').classList.remove('active')">Cancel</button>
                    <button class="btn-submit" onclick="socialDashboard.createGroup()">Create Group</button>
                </div>
            </div>
        `;
        modal.classList.add('active');
    }

    createGroup() {
        const groupData = {
            name: document.getElementById('groupName').value,
            subject: document.getElementById('groupSubject').value,
            description: document.getElementById('groupDescription').value,
            isPrivate: document.getElementById('groupPrivate').checked
        };

        if (!groupData.name) {
            alert('Please enter a group name');
            return;
        }

        studyGroupsSystem.createGroup(groupData);
        document.getElementById('createGroupModal').classList.remove('active');
        this.renderMyGroups();
        alert('Study group created successfully!');
    }

    joinGroupChallenge(challengeId, groupId) {
        try {
            studyGroupsSystem.joinChallenge(challengeId);
            alert('You joined the challenge!');
            this.viewGroup(groupId);
        } catch (error) {
            alert(error.message);
        }
    }

    renderQuestions() {
        const container = document.getElementById('questionsContent');
        
        const filters = {
            subject: document.getElementById('subjectFilter')?.value || '',
            difficulty: document.getElementById('difficultyFilter')?.value || '',
            sortBy: document.getElementById('sortFilter')?.value || 'recent'
        };

        const questions = discussionForumsSystem.getQuestions(filters);

        if (questions.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 60px 20px; color: #666;">
                    <h3 style="color: #0097b2; margin-bottom: 15px;">No Questions Found</h3>
                    <p>Be the first to ask a question!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = questions.map(q => this.createQuestionCard(q)).join('');
    }

    searchQuestions(query) {
        const container = document.getElementById('questionsContent');
        
        if (!query) {
            this.renderQuestions();
            return;
        }

        const questions = discussionForumsSystem.getQuestions({ search: query });
        container.innerHTML = questions.map(q => this.createQuestionCard(q)).join('');
    }

    renderMyQuestions() {
        const container = document.getElementById('questionsContent');
        const myQuestions = discussionForumsSystem.getMyQuestions();

        if (myQuestions.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 60px 20px; color: #666;">
                    <h3 style="color: #0097b2; margin-bottom: 15px;">No Questions Yet</h3>
                    <p>Ask your first question to get help from the community!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <h2 style="color: #0097b2; margin-bottom: 20px;">My Questions</h2>
            ${myQuestions.map(q => this.createQuestionCard(q)).join('')}
        `;
    }

    createQuestionCard(question) {
        const userVote = discussionForumsSystem.getUserVote('question', question.id);
        
        return `
            <div class="question-card">
                <div class="question-header">
                    <div style="flex: 1;">
                        <div class="question-title">${question.title}</div>
                        <div style="color: #666; font-size: 0.9rem; margin-bottom: 10px;">
                            By ${question.userName} • ${this.formatTimeAgo(question.createdAt)}
                        </div>
                        <div class="question-tags">
                            <span class="tag">${question.subject}</span>
                            <span class="tag difficulty-${question.difficulty}">${question.difficulty.toUpperCase()}</span>
                            ${question.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                            ${question.hasVerifiedAnswer ? '<span class="verified-badge">✓ Verified Answer</span>' : ''}
                        </div>
                    </div>
                    <div class="vote-controls">
                        <button class="vote-btn ${userVote === 'upvote' ? 'active' : ''}" 
                                onclick="socialDashboard.voteQuestion('${question.id}', 'upvote')">▲</button>
                        <span style="font-weight: 600; font-size: 1.1rem;">${question.upvotes - question.downvotes}</span>
                        <button class="vote-btn ${userVote === 'downvote' ? 'active' : ''}" 
                                onclick="socialDashboard.voteQuestion('${question.id}', 'downvote')">▼</button>
                    </div>
                </div>
                <p style="color: #333; margin: 15px 0;">${question.content.substring(0, 200)}${question.content.length > 200 ? '...' : ''}</p>
                <div class="question-stats">
                    <span class="stat-item">👁️ ${question.views} views</span>
                    <span class="stat-item">💬 ${question.answerCount} answers</span>
                    <span class="stat-item">📅 ${new Date(question.createdAt).toLocaleDateString()}</span>
                </div>
                <button class="action-btn secondary" onclick="socialDashboard.viewQuestion('${question.id}')" 
                        style="margin-top: 15px;">View Details & Answer</button>
            </div>
        `;
    }

    voteQuestion(questionId, voteType) {
        discussionForumsSystem.vote('question', questionId, voteType);
        this.renderQuestions();
    }

    viewQuestion(questionId) {
        const question = discussionForumsSystem.getQuestion(questionId);
        const answers = discussionForumsSystem.getAnswers(questionId);
        
        const modal = document.getElementById('questionDetailModal');
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h2>${question.title}</h2>
                    <button class="close-modal" onclick="this.closest('.modal').classList.remove('active')">×</button>
                </div>
                <div style="margin-bottom: 20px;">
                    <div style="color: #666; margin-bottom: 10px;">
                        By ${question.userName} • ${this.formatTimeAgo(question.createdAt)}
                    </div>
                    <div class="question-tags">
                        <span class="tag">${question.subject}</span>
                        <span class="tag difficulty-${question.difficulty}">${question.difficulty.toUpperCase()}</span>
                    </div>
                </div>
                <p style="color: #333; line-height: 1.6; margin-bottom: 30px;">${question.content}</p>
                
                <h3 style="color: #0097b2; margin-bottom: 20px;">${answers.length} Answer${answers.length !== 1 ? 's' : ''}</h3>
                ${answers.map(a => this.createAnswerCard(a, question)).join('')}
                
                <div class="form-group" style="margin-top: 30px;">
                    <label>Your Answer</label>
                    <textarea id="answerContent" placeholder="Share your knowledge..."></textarea>
                </div>
                <button class="action-btn" onclick="socialDashboard.postAnswer('${questionId}')" style="width: 100%;">
                    Post Answer
                </button>
            </div>
        `;
        modal.classList.add('active');
    }

    createAnswerCard(answer, question) {
        const userVote = discussionForumsSystem.getUserVote('answer', answer.id);
        const canVerify = question.userId === discussionForumsSystem.currentUser.id || 
                         discussionForumsSystem.getReputation(discussionForumsSystem.currentUser.id) >= 500;
        
        return `
            <div style="background: ${answer.isVerified ? '#f1f8f4' : '#f9f9f9'}; padding: 20px; border-radius: 12px; margin-bottom: 15px; border-left: 4px solid ${answer.isVerified ? '#4caf50' : '#ddd'};">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                    <div style="flex: 1;">
                        <div style="font-weight: 600; color: #333; margin-bottom: 5px;">
                            ${answer.userName} ${answer.isVerified ? '<span class="verified-badge">✓ Verified</span>' : ''}
                        </div>
                        <div style="color: #666; font-size: 0.9rem;">${this.formatTimeAgo(answer.createdAt)}</div>
                    </div>
                    <div class="vote-controls">
                        <button class="vote-btn ${userVote === 'upvote' ? 'active' : ''}" 
                                onclick="socialDashboard.voteAnswer('${answer.id}')">▲</button>
                        <span style="font-weight: 600;">${answer.upvotes - answer.downvotes}</span>
                        <button class="vote-btn ${userVote === 'downvote' ? 'active' : ''}" 
                                onclick="socialDashboard.voteAnswer('${answer.id}', 'downvote')">▼</button>
                    </div>
                </div>
                <p style="color: #333; line-height: 1.6;">${answer.content}</p>
                ${canVerify && !answer.isVerified ? `
                    <button class="action-btn secondary" onclick="socialDashboard.verifyAnswer('${answer.id}')" 
                            style="margin-top: 15px; padding: 8px 16px; font-size: 0.9rem;">
                        Mark as Verified
                    </button>
                ` : ''}
            </div>
        `;
    }

    voteAnswer(answerId, voteType = 'upvote') {
        discussionForumsSystem.vote('answer', answerId, voteType);
        const modal = document.getElementById('questionDetailModal');
        const questionId = modal.querySelector('[onclick*="postAnswer"]')?.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
        if (questionId) {
            this.viewQuestion(questionId);
        }
    }

    verifyAnswer(answerId) {
        try {
            discussionForumsSystem.verifyAnswer(answerId);
            alert('Answer verified successfully!');
            const modal = document.getElementById('questionDetailModal');
            const questionId = modal.querySelector('[onclick*="postAnswer"]')?.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
            if (questionId) {
                this.viewQuestion(questionId);
            }
        } catch (error) {
            alert(error.message);
        }
    }

    postAnswer(questionId) {
        const content = document.getElementById('answerContent').value;
        if (!content.trim()) {
            alert('Please enter your answer');
            return;
        }

        discussionForumsSystem.postAnswer(questionId, { content });
        this.viewQuestion(questionId);
        alert('Answer posted successfully!');
    }

    showAskQuestionModal() {
        const modal = document.getElementById('askQuestionModal');
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Ask a Question</h2>
                    <button class="close-modal" onclick="this.closest('.modal').classList.remove('active')">×</button>
                </div>
                <div class="form-group">
                    <label>Title</label>
                    <input type="text" id="questionTitle" placeholder="What's your question?">
                </div>
                <div class="form-group">
                    <label>Subject</label>
                    <select id="questionSubject">
                        <option value="Mathematics">Mathematics</option>
                        <option value="Science">Science</option>
                        <option value="Social Studies">Social Studies</option>
                        <option value="Religion, Morality & Ethics">Religion, Morality & Ethics</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Difficulty</label>
                    <select id="questionDifficulty">
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Details</label>
                    <textarea id="questionContent" placeholder="Provide more context..."></textarea>
                </div>
                <div class="form-actions">
                    <button class="btn-cancel" onclick="this.closest('.modal').classList.remove('active')">Cancel</button>
                    <button class="btn-submit" onclick="socialDashboard.askQuestion()">Post Question</button>
                </div>
            </div>
        `;
        modal.classList.add('active');
    }

    askQuestion() {
        const questionData = {
            title: document.getElementById('questionTitle').value,
            subject: document.getElementById('questionSubject').value,
            difficulty: document.getElementById('questionDifficulty').value,
            content: document.getElementById('questionContent').value
        };

        if (!questionData.title || !questionData.content) {
            alert('Please fill in all required fields');
            return;
        }

        discussionForumsSystem.postQuestion(questionData);
        document.getElementById('askQuestionModal').classList.remove('active');
        this.renderQuestions();
        alert('Question posted successfully!');
    }

    renderTutoringDashboard() {
        const container = document.getElementById('tutoringContent');
        const isTutor = peerTutoringSystem.isTutor();
        const stats = peerTutoringSystem.getMyTutoringStats();

        if (isTutor) {
            this.renderTutorDashboard(stats);
        } else {
            this.renderStudentDashboard(stats);
        }
    }

    renderTutorDashboard(stats) {
        const container = document.getElementById('tutoringContent');
        container.innerHTML = `
            <h2 style="color: #0097b2; margin-bottom: 20px;">Your Tutor Dashboard</h2>
            <div class="summary-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
                <div style="background: white; padding: 20px; border-radius: 12px; border: 2px solid #e0e0e0;">
                    <div style="font-size: 2rem; color: #0097b2; font-weight: 600;">${stats.completedSessions}</div>
                    <div style="color: #666;">Completed Sessions</div>
                </div>
                <div style="background: white; padding: 20px; border-radius: 12px; border: 2px solid #e0e0e0;">
                    <div style="font-size: 2rem; color: #f39c12; font-weight: 600;">${stats.averageRating.toFixed(1)}★</div>
                    <div style="color: #666;">Average Rating</div>
                </div>
                <div style="background: white; padding: 20px; border-radius: 12px; border: 2px solid #e0e0e0;">
                    <div style="font-size: 2rem; color: #4caf50; font-weight: 600;">${stats.totalStudents}</div>
                    <div style="color: #666;">Total Students</div>
                </div>
                <div style="background: white; padding: 20px; border-radius: 12px; border: 2px solid #e0e0e0;">
                    <div style="font-size: 2rem; color: #9c27b0; font-weight: 600;">${Math.round(stats.hoursLogged)}</div>
                    <div style="color: #666;">Hours Logged</div>
                </div>
            </div>
            
            <h3 style="color: #0097b2; margin: 30px 0 15px;">Pending Requests (${stats.pendingRequests})</h3>
            <div id="pendingRequests"></div>
            
            <h3 style="color: #0097b2; margin: 30px 0 15px;">Upcoming Sessions</h3>
            <div id="upcomingSessions"></div>
        `;

        this.renderPendingRequests();
        this.renderUpcomingSessions();
    }

    renderStudentDashboard(stats) {
        const container = document.getElementById('tutoringContent');
        container.innerHTML = `
            <h2 style="color: #0097b2; margin-bottom: 20px;">Find Your Perfect Tutor</h2>
            <div style="margin-bottom: 30px;">
                <div class="forum-filters">
                    <select class="filter-select" id="tutorSubjectFilter">
                        <option value="">All Subjects</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Science">Science</option>
                        <option value="Social Studies">Social Studies</option>
                        <option value="Religion, Morality & Ethics">Religion, Morality & Ethics</option>
                    </select>
                    <button class="action-btn" onclick="socialDashboard.filterTutors()">Search</button>
                </div>
            </div>
            <div id="tutorsList"></div>
        `;

        this.renderAvailableTutors();
    }

    renderAvailableTutors(subject = null) {
        const container = document.getElementById('tutorsList');
        const tutors = peerTutoringSystem.getTutors(subject ? { subject } : {});

        if (tutors.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #666;">
                    <p>No tutors available for this subject yet.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `<div class="tutors-grid">${tutors.map(t => this.createTutorCard(t)).join('')}</div>`;
    }

    filterTutors() {
        const subject = document.getElementById('tutorSubjectFilter').value;
        this.renderAvailableTutors(subject || null);
    }

    createTutorCard(tutor) {
        return `
            <div class="tutor-card">
                <div class="tutor-header">
                    <div class="tutor-avatar">${tutor.userName.charAt(0)}</div>
                    <div class="tutor-info">
                        <h3>${tutor.userName}</h3>
                        <div class="tutor-rating">${tutor.stats.averageRating.toFixed(1)}★ (${tutor.stats.completedSessions} sessions)</div>
                    </div>
                </div>
                <div class="tutor-subjects">
                    ${tutor.subjects.map(s => `<span class="subject-tag">${s}</span>`).join('')}
                </div>
                <p style="color: #666; margin: 15px 0; min-height: 60px;">${tutor.bio || 'Experienced tutor ready to help!'}</p>
                <div class="tutor-badges">
                    ${tutor.badges.map(b => `<span class="badge ${b.includes('elite') || b.includes('legendary') ? 'gold' : ''}">${this.formatBadgeName(b)}</span>`).join('')}
                </div>
                <button class="action-btn" onclick="socialDashboard.requestTutor('${tutor.userId}')" style="width: 100%;">
                    Request Session
                </button>
            </div>
        `;
    }

    requestTutor(tutorId) {
        const modal = document.getElementById('requestTutorModal');
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Request Tutoring Session</h2>
                    <button class="close-modal" onclick="this.closest('.modal').classList.remove('active')">×</button>
                </div>
                <div class="form-group">
                    <label>Subject</label>
                    <select id="tutorRequestSubject">
                        <option value="Mathematics">Mathematics</option>
                        <option value="Science">Science</option>
                        <option value="Social Studies">Social Studies</option>
                        <option value="Religion, Morality & Ethics">Religion, Morality & Ethics</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Topic (Optional)</label>
                    <input type="text" id="tutorRequestTopic" placeholder="e.g., Quadratic Equations">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea id="tutorRequestDescription" placeholder="What do you need help with?"></textarea>
                </div>
                <div class="form-actions">
                    <button class="btn-cancel" onclick="this.closest('.modal').classList.remove('active')">Cancel</button>
                    <button class="btn-submit" onclick="socialDashboard.submitTutorRequest('${tutorId}')">Send Request</button>
                </div>
            </div>
        `;
        modal.classList.add('active');
    }

    submitTutorRequest(tutorId) {
        const requestData = {
            tutorId,
            subject: document.getElementById('tutorRequestSubject').value,
            topic: document.getElementById('tutorRequestTopic').value,
            description: document.getElementById('tutorRequestDescription').value
        };

        peerTutoringSystem.requestTutor(requestData);
        document.getElementById('requestTutorModal').classList.remove('active');
        alert('Tutor request sent successfully!');
    }

    renderPendingRequests() {
        const container = document.getElementById('pendingRequests');
        const requests = peerTutoringSystem.getMyTutorRequests().filter(r => r.status === 'pending');

        if (requests.length === 0) {
            container.innerHTML = '<p style="color: #666;">No pending requests</p>';
            return;
        }

        container.innerHTML = `<div class="session-list">${requests.map(r => `
            <div class="session-card">
                <div>
                    <div style="font-weight: 600; color: #0097b2; margin-bottom: 5px;">${r.studentName}</div>
                    <div style="color: #666; font-size: 0.9rem;">${r.subject} - ${r.topic || 'General'}</div>
                    <div style="color: #666; font-size: 0.9rem; margin-top: 5px;">${r.description}</div>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button class="action-btn secondary" onclick="socialDashboard.respondToRequest('${r.id}', false)">Decline</button>
                    <button class="action-btn" onclick="socialDashboard.respondToRequest('${r.id}', true)">Accept</button>
                </div>
            </div>
        `).join('')}</div>`;
    }

    renderUpcomingSessions() {
        const container = document.getElementById('upcomingSessions');
        const sessions = peerTutoringSystem.getActiveSessions();

        if (sessions.length === 0) {
            container.innerHTML = '<p style="color: #666;">No upcoming sessions</p>';
            return;
        }

        container.innerHTML = `<div class="session-list">${sessions.map(s => `
            <div class="session-card ${s.status}">
                <div>
                    <div style="font-weight: 600; color: #0097b2; margin-bottom: 5px;">
                        ${s.tutorId === peerTutoringSystem.currentUser.id ? s.studentName : s.tutorName}
                    </div>
                    <div style="color: #666; font-size: 0.9rem;">${s.subject} - ${s.topic || 'General'}</div>
                    <div style="color: #666; font-size: 0.9rem; margin-top: 5px;">
                        📅 ${new Date(s.scheduledTime).toLocaleString()}
                    </div>
                </div>
                <div>
                    <span style="background: #2196f3; color: white; padding: 6px 12px; border-radius: 6px; font-size: 0.9rem;">
                        ${s.status.toUpperCase()}
                    </span>
                </div>
            </div>
        `).join('')}</div>`;
    }

    renderMySessions() {
        const container = document.getElementById('tutoringContent');
        const sessions = peerTutoringSystem.getMySessions();

        container.innerHTML = `
            <h2 style="color: #0097b2; margin-bottom: 20px;">My Tutoring Sessions</h2>
            ${sessions.length === 0 ? '<p style="color: #666; text-align: center; padding: 40px;">No sessions yet</p>' : 
            `<div class="session-list">${sessions.map(s => this.createSessionCard(s)).join('')}</div>`}
        `;
    }

    createSessionCard(session) {
        return `
            <div class="session-card ${session.status}">
                <div>
                    <div style="font-weight: 600; color: #0097b2; margin-bottom: 5px;">
                        ${session.tutorId === peerTutoringSystem.currentUser.id ? 
                          `Student: ${session.studentName}` : 
                          `Tutor: ${session.tutorName}`}
                    </div>
                    <div style="color: #666; font-size: 0.9rem;">${session.subject} - ${session.topic || 'General'}</div>
                    <div style="color: #666; font-size: 0.9rem; margin-top: 5px;">
                        📅 ${new Date(session.scheduledTime).toLocaleString()}
                    </div>
                    ${session.rating ? `<div style="color: #f39c12; margin-top: 5px;">Rating: ${session.rating}★</div>` : ''}
                </div>
                <div>
                    <span style="background: ${this.getStatusColor(session.status)}; color: white; padding: 6px 12px; border-radius: 6px; font-size: 0.9rem;">
                        ${session.status.toUpperCase()}
                    </span>
                </div>
            </div>
        `;
    }

    respondToRequest(requestId, accept) {
        if (accept) {
            const time = prompt('Enter proposed session time (e.g., 2026-02-01 14:00):');
            if (!time) return;
            peerTutoringSystem.respondToRequest(requestId, true, time);
        } else {
            peerTutoringSystem.respondToRequest(requestId, false);
        }
        this.renderTutoringDashboard();
    }

    showBecomeTutorModal() {
        const modal = document.getElementById('becomeTutorModal');
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Become a Tutor</h2>
                    <button class="close-modal" onclick="this.closest('.modal').classList.remove('active')">×</button>
                </div>
                <p style="color: #666; margin-bottom: 20px;">Help other students and earn rewards! Requirements: 500+ points</p>
                <div class="form-group">
                    <label>Subjects (Hold Ctrl to select multiple)</label>
                    <select id="tutorSubjects" multiple style="height: 100px;">
                        <option value="Mathematics">Mathematics</option>
                        <option value="Science">Science</option>
                        <option value="Social Studies">Social Studies</option>
                        <option value="Religion, Morality & Ethics">Religion, Morality & Ethics</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Bio</label>
                    <textarea id="tutorBio" placeholder="Tell students about your expertise..."></textarea>
                </div>
                <div class="form-actions">
                    <button class="btn-cancel" onclick="this.closest('.modal').classList.remove('active')">Cancel</button>
                    <button class="btn-submit" onclick="socialDashboard.registerAsTutor()">Register as Tutor</button>
                </div>
            </div>
        `;
        modal.classList.add('active');
    }

    registerAsTutor() {
        const subjects = Array.from(document.getElementById('tutorSubjects').selectedOptions).map(o => o.value);
        const bio = document.getElementById('tutorBio').value;

        if (subjects.length === 0) {
            alert('Please select at least one subject');
            return;
        }

        try {
            peerTutoringSystem.registerAsTutor({ subjects, bio });
            document.getElementById('becomeTutorModal').classList.remove('active');
            this.renderTutoringDashboard();
            alert('Congratulations! You are now registered as a tutor!');
        } catch (error) {
            alert(error.message);
        }
    }

    renderFindTutor() {
        const stats = peerTutoringSystem.getMyTutoringStats();
        this.renderStudentDashboard(stats);
    }

    formatTimeAgo(timestamp) {
        const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
        
        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
        return new Date(timestamp).toLocaleDateString();
    }

    formatBadgeName(badge) {
        return badge.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }

    getStatusColor(status) {
        const colors = {
            'scheduled': '#2196f3',
            'in-progress': '#ff9800',
            'completed': '#4caf50',
            'cancelled': '#f44336'
        };
        return colors[status] || '#999';
    }
}

// Initialize dashboard
const socialDashboard = new SocialDashboard();