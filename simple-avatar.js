(function() {
  'use strict';

  window.SimpleAvatarModal = {
    avatars: [
      { emoji: '👨‍🎓', name: 'Student' },
      { emoji: '👩‍🎓', name: 'Scholar' },
      { emoji: '👨‍🏫', name: 'Teacher' },
      { emoji: '👩‍🔬', name: 'Scientist' },
      { emoji: '👨‍🎨', name: 'Artist' },
      { emoji: '👷', name: 'Engineer' },
      { emoji: '🧙', name: 'Wizard' },
      { emoji: '🥷', name: 'Ninja' },
      { emoji: '🤖', name: 'Robot' },
      { emoji: '👨‍🚀', name: 'Astronaut' },
      { emoji: '🦸', name: 'Superhero' },
      { emoji: '👑', name: 'Champion' }
    ],

    colors: [
      { hex: '#6366f1', name: 'Indigo' },
      { hex: '#ef4444', name: 'Red' },
      { hex: '#10b981', name: 'Green' },
      { hex: '#3b82f6', name: 'Blue' },
      { hex: '#8b5cf6', name: 'Purple' },
      { hex: '#ec4899', name: 'Pink' },
      { hex: '#f97316', name: 'Orange' },
      { hex: '#14b8a6', name: 'Teal' }
    ],

    currentAvatar: null,
    currentColor: '#6366f1',

    init() {
      const saved = localStorage.getItem('simple_avatar');
      if (saved) {
        const data = JSON.parse(saved);
        this.currentAvatar = data.avatar || this.avatars[0];
        this.currentColor = data.color || '#6366f1';
      } else {
        this.currentAvatar = this.avatars[0];
        this.currentColor = '#6366f1';
      }
      this.updateDisplay();
    },

    updateDisplay() {
      const avatar = document.getElementById('accountAvatar');
      if (!avatar) return;
      
      avatar.textContent = this.currentAvatar.emoji;
      avatar.style.backgroundColor = this.currentColor;
      avatar.style.display = 'flex';
      avatar.style.alignItems = 'center';
      avatar.style.justifyContent = 'center';
      avatar.style.fontSize = '24px';
      avatar.style.borderRadius = '50%';
      avatar.style.width = '40px';
      avatar.style.height = '40px';
    },

    open() {
      const existing = document.getElementById('simple-avatar-modal');
      if (existing) existing.remove();

      const modal = document.createElement('div');
      modal.id = 'simple-avatar-modal';
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10001;
      `;

      const content = document.createElement('div');
      content.style.cssText = `
        background: white;
        border-radius: 16px;
        padding: 24px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      `;

      const title = document.createElement('h2');
      title.textContent = '🎨 Customize Your Avatar';
      title.style.cssText = 'margin: 0 0 20px 0; color: #1f2933; font-size: 1.5rem;';
      content.appendChild(title);

      const avatarSection = document.createElement('div');
      avatarSection.style.cssText = 'margin-bottom: 24px;';

      const avatarLabel = document.createElement('h3');
      avatarLabel.textContent = 'Choose Avatar';
      avatarLabel.style.cssText = 'margin: 0 0 12px 0; color: #0097b2; font-size: 1rem;';
      avatarSection.appendChild(avatarLabel);

      const avatarGrid = document.createElement('div');
      avatarGrid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
      `;

      this.avatars.forEach(avatar => {
        const btn = document.createElement('button');
        btn.textContent = avatar.emoji;
        btn.style.cssText = `
          padding: 12px;
          font-size: 24px;
          border: 3px solid ${avatar.emoji === this.currentAvatar.emoji ? '#0097b2' : '#e0e0e0'};
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
        `;

        btn.onmouseover = () => {
          btn.style.transform = 'scale(1.1)';
        };
        btn.onmouseout = () => {
          btn.style.transform = 'scale(1)';
        };

        btn.onclick = () => {
          this.currentAvatar = avatar;
          this.save();
          this.updateDisplay();
          this.open(); 
        };

        avatarGrid.appendChild(btn);
      });

      avatarSection.appendChild(avatarGrid);
      content.appendChild(avatarSection);

      const colorSection = document.createElement('div');
      colorSection.style.cssText = 'margin-bottom: 24px;';

      const colorLabel = document.createElement('h3');
      colorLabel.textContent = 'Choose Color';
      colorLabel.style.cssText = 'margin: 0 0 12px 0; color: #0097b2; font-size: 1rem;';
      colorSection.appendChild(colorLabel);

      const colorGrid = document.createElement('div');
      colorGrid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
      `;

      this.colors.forEach(color => {
        const btn = document.createElement('button');
        btn.style.cssText = `
          width: 100%;
          padding: 20px;
          background: ${color.hex};
          border: ${color.hex === this.currentColor ? '4px solid #333' : '2px solid #ccc'};
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          title: ${color.name};
        `;

        btn.onmouseover = () => {
          btn.style.transform = 'scale(1.1)';
        };
        btn.onmouseout = () => {
          btn.style.transform = 'scale(1)';
        };

        btn.onclick = () => {
          this.currentColor = color.hex;
          this.save();
          this.updateDisplay();
          this.open(); 
        };

        colorGrid.appendChild(btn);
      });

      colorSection.appendChild(colorGrid);
      content.appendChild(colorSection);

      const closeBtn = document.createElement('button');
      closeBtn.textContent = '✕ Close';
      closeBtn.style.cssText = `
        width: 100%;
        padding: 12px;
        background: #f5f5f5;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        margin-top: 12px;
      `;
      closeBtn.onclick = () => modal.remove();
      content.appendChild(closeBtn);

      modal.appendChild(content);

      modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
      };

      document.body.appendChild(modal);
    },

    save() {
      localStorage.setItem('simple_avatar', JSON.stringify({
        avatar: this.currentAvatar,
        color: this.currentColor
      }));
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.SimpleAvatarModal.init();
      initializeAccountDropdown();
    });
  } else {
    window.SimpleAvatarModal.init();
    initializeAccountDropdown();
  }

  function initializeAccountDropdown() {
    try {
      const path = (window.location && window.location.pathname) || '';
      const isIndexPage = path.endsWith('/') || path.endsWith('/index.html') || path.endsWith('index.html');
      if (!isIndexPage) return;

      ensureAccountDropdownStyles();
      ensureAccountDropdownBehaviors();
      ensureAccountDropdownMarkup();
    } catch (e) {
      console.error('Account dropdown initialization failed:', e);
    }
  }

  function ensureAccountDropdownStyles() {
    if (document.getElementById('account-dropdown-styles')) return;

    const style = document.createElement('style');
    style.id = 'account-dropdown-styles';
    style.textContent = `
      .account-dropdown-menu {
        position: fixed;
        top: 75px;
        right: 20px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        width: 300px;
        z-index: 10002;
        overflow: hidden;
        animation: slideDown 0.2s ease;
      }

      .account-dropdown-header {
        padding: 16px;
        display: flex;
        gap: 12px;
        align-items: center;
        background: #f8fafc;
      }

      .user-avatar-large {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: #0097b2;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 20px;
      }

      .account-dropdown-divider {
        height: 1px;
        background: #e4e7eb;
      }

      .account-dropdown-body {
        padding: 8px 0;
      }

      .dropdown-item {
        display: block;
        padding: 10px 16px;
        color: #0097b2;
        text-decoration: none;
        font-weight: 600;
        transition: background 0.2s ease;
      }

      .dropdown-item:hover {
        background: #f1f5f9;
      }

      .account-dropdown-footer {
        padding: 12px 16px;
      }

      .account-details-dropdown {
        position: fixed;
        top: 75px;
        right: 370px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        width: 320px;
        z-index: 10002;
        animation: slideDown 0.2s ease;
      }

      .account-display {
        position: relative;
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);
  }

  function ensureAccountDropdownBehaviors() {
    if (!window.toggleAccountDropdown) {
      window.toggleAccountDropdown = function toggleAccountDropdown() {
        const dropdown = document.getElementById('accountDropdownMenu');
        if (!dropdown) return;
        if (dropdown.style.display === 'none' || dropdown.style.display === '') {
          showAccountDropdown();
        } else {
          hideAccountDropdown();
        }
      };
    }

    if (!window.showAccountDropdown) {
      window.showAccountDropdown = function showAccountDropdown() {
        const dropdown = document.getElementById('accountDropdownMenu');
        if (!dropdown) return;
        const user = JSON.parse(localStorage.getItem('adaptohubUser') || '{}');

        const nameEl = document.getElementById('dropdownUserName');
        const emailEl = document.getElementById('dropdownUserEmail');
        const studentIdEl = document.getElementById('dropdownStudentId');
        if (nameEl) nameEl.textContent = user.fullName || 'Adapto Learner';
        if (emailEl) emailEl.textContent = user.email || 'user@example.com';
        if (studentIdEl) studentIdEl.textContent = user.studentId ? `Student ID: ${user.studentId}` : 'Student ID: -';

        const avatarEl = document.getElementById('dropdownUserAvatar');
        if (avatarEl) {
          const firstLetter = (user.fullName || 'A').charAt(0).toUpperCase();
          avatarEl.textContent = firstLetter;
        }

        dropdown.style.display = 'block';
        document.addEventListener('click', window.closeDropdownOnClickOutside);
      };
    }

    if (!window.hideAccountDropdown) {
      window.hideAccountDropdown = function hideAccountDropdown() {
        const dropdown = document.getElementById('accountDropdownMenu');
        if (!dropdown) return;
        dropdown.style.display = 'none';
        document.removeEventListener('click', window.closeDropdownOnClickOutside);
      };
    }

    if (!window.closeDropdownOnClickOutside) {
      window.closeDropdownOnClickOutside = function closeDropdownOnClickOutside(e) {
        const dropdown = document.getElementById('accountDropdownMenu');
        const accountDisplay = document.getElementById('accountDisplayBtn');
        if (!dropdown || !accountDisplay) return;
        if (!dropdown.contains(e.target) && !accountDisplay.contains(e.target)) {
          hideAccountDropdown();
        }
      };
    }

    if (!window.showAccountDetailsPanel) {
      window.showAccountDetailsPanel = function showAccountDetailsPanel() {
        const detailsDropdown = document.getElementById('accountDetailsDropdown');
        if (!detailsDropdown) return false;

        const profileDropdown = document.getElementById('profileSettingsDropdown');
        const learningDropdown = document.getElementById('learningHistoryDropdown');
        if (profileDropdown) profileDropdown.style.display = 'none';
        if (learningDropdown) learningDropdown.style.display = 'none';

        detailsDropdown.style.display = 'block';

        const user = JSON.parse(localStorage.getItem('adaptohubUser') || '{}');
        const nameEl = document.getElementById('detailsDropdownName');
        const emailEl = document.getElementById('detailsDropdownEmail');
        const studentIdEl = document.getElementById('detailsDropdownStudentId');
        const providerEl = document.getElementById('detailsDropdownProvider');
        const loginTimeEl = document.getElementById('detailsDropdownLoginTime');

        if (nameEl) nameEl.textContent = user.fullName || '-';
        if (emailEl) emailEl.textContent = user.email || '-';
        if (studentIdEl) studentIdEl.textContent = user.studentId || '-';
        if (providerEl) providerEl.textContent = (user.authProvider || '').toUpperCase() || '-';

        if (loginTimeEl) {
          if (user.loginTime) {
            const loginDate = new Date(user.loginTime);
            loginTimeEl.textContent = loginDate.toLocaleString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });
          } else {
            loginTimeEl.textContent = '-';
          }
        }
        return false;
      };
    }

    if (!window.hideAccountDetailsPanel) {
      window.hideAccountDetailsPanel = function hideAccountDetailsPanel() {
        const detailsDropdown = document.getElementById('accountDetailsDropdown');
        if (detailsDropdown) detailsDropdown.style.display = 'none';
      };
    }

    if (!window.showProfileSettings) {
      window.showProfileSettings = function showProfileSettings() {
        const settingsDropdown = document.getElementById('profileSettingsDropdown');
        if (!settingsDropdown) return false;

        const accountDetailsDropdown = document.getElementById('accountDetailsDropdown');
        const learningHistoryDropdown = document.getElementById('learningHistoryDropdown');
        if (accountDetailsDropdown) accountDetailsDropdown.style.display = 'none';
        if (learningHistoryDropdown) learningHistoryDropdown.style.display = 'none';

        const settings = JSON.parse(localStorage.getItem('profileSettings') || '{}');
        const user = JSON.parse(localStorage.getItem('adaptohubUser') || '{}');

        const displayNameEl = document.getElementById('settingsDisplayName');
        const emailNotifEl = document.getElementById('settingsEmailNotif');
        const themeEl = document.getElementById('settingsTheme');
        const languageEl = document.getElementById('settingsLanguage');

        if (displayNameEl) displayNameEl.value = settings.displayName || user.fullName || '';
        if (emailNotifEl) emailNotifEl.checked = settings.emailNotifications !== false;
        if (themeEl) themeEl.value = settings.theme || 'light';
        if (languageEl) languageEl.value = settings.language || 'en';

        settingsDropdown.style.display = 'block';
        return false;
      };
    }

    if (!window.saveProfileSettings) {
      window.saveProfileSettings = function saveProfileSettings(e) {
        try {
          const settings = {
            displayName: document.getElementById('settingsDisplayName')?.value || '',
            emailNotifications: document.getElementById('settingsEmailNotif')?.checked ?? true,
            theme: document.getElementById('settingsTheme')?.value || 'light',
            language: document.getElementById('settingsLanguage')?.value || 'en',
            updatedAt: new Date().toISOString()
          };

          localStorage.setItem('profileSettings', JSON.stringify(settings));

          const button = e?.target;
          if (button) {
            const originalText = button.textContent;
            button.textContent = '✓ Settings Saved!';
            button.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            setTimeout(() => {
              button.textContent = originalText;
              button.style.background = 'linear-gradient(135deg, #0097b2 0%, #00b8d4 100%)';
            }, 2000);
          }
        } catch (err) {
          console.error('Error saving profile settings:', err);
        }
      };
    }

    if (!window.recordLearningActivity) {
      window.recordLearningActivity = function recordLearningActivity(type, title, score, maxScore = 100) {
        try {
          const history = JSON.parse(localStorage.getItem('learningHistory') || '[]');
          const activity = {
            type,
            title,
            score,
            maxScore,
            percentage: Math.round((score / maxScore) * 100),
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString('en-US')
          };
          history.push(activity);
          if (history.length > 50) history.shift();
          localStorage.setItem('learningHistory', JSON.stringify(history));
        } catch (err) {
          console.error('Error recording learning activity:', err);
        }
      };
    }

    if (!window.logout) {
      window.logout = function logout() {
        try {
          localStorage.removeItem('adaptohubUser');
          window.location.href = 'login.html';
        } catch (err) {
          console.error('Logout failed:', err);
        }
      };
    }

    if (!window.showLearningHistory) {
      window.showLearningHistory = function showLearningHistory() {
        const learningDropdown = document.getElementById('learningHistoryDropdown');
        if (!learningDropdown) return false;

        const accountDetailsDropdown = document.getElementById('accountDetailsDropdown');
        const profileSettingsDropdown = document.getElementById('profileSettingsDropdown');
        if (accountDetailsDropdown) accountDetailsDropdown.style.display = 'none';
        if (profileSettingsDropdown) profileSettingsDropdown.style.display = 'none';

        learningDropdown.style.display = 'block';

        const history = JSON.parse(localStorage.getItem('learningHistory') || '[]');
        const statsEl = document.getElementById('learningHistoryStats');
        const listEl = document.getElementById('learningHistoryList');

        if (!statsEl || !listEl) return false;

        if (history.length === 0) {
          statsEl.textContent = 'No activity recorded';
          listEl.innerHTML = '<p style="margin: 0; text-align: center; padding: 20px 0; color: #8b92a9;">Start taking quizzes and challenges to build your learning history</p>';
          return false;
        }

        const total = history.length;
        const avg = Math.round(history.reduce((sum, a) => sum + (a.percentage || 0), 0) / total);
        statsEl.textContent = `Total Activities: ${total} • Avg Score: ${avg}%`;

        const recent = history.slice(-10).reverse();
        listEl.innerHTML = recent.map(activity => {
          const percent = activity.percentage ?? 0;
          const color = percent >= 80 ? '#10b981' : percent >= 60 ? '#f59e0b' : '#ef4444';
          return `
            <div style="padding: 10px 0; border-bottom: 1px solid #e4e7eb;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="font-weight: 600; color: #1f2933;">${activity.title || 'Activity'}</div>
                <div style="font-weight: 700; color: ${color};">${percent}%</div>
              </div>
              <div style="font-size: 0.8rem; color: #636d79;">${activity.type || 'learning'} • ${activity.date || ''}</div>
            </div>
          `;
        }).join('');

        return false;
      };
    }
  }

  function ensureAccountDropdownMarkup() {
    const accountDisplay = document.querySelector('.account-display');
    if (!accountDisplay) return;
    if (document.getElementById('accountDropdownMenu')) return;

    accountDisplay.id = accountDisplay.id || 'accountDisplayBtn';
    accountDisplay.style.cursor = 'pointer';
    accountDisplay.style.position = 'relative';

    let nameEl = accountDisplay.querySelector('.account-name');
    if (!nameEl) {
      nameEl = document.createElement('span');
      nameEl.className = 'account-name';
      nameEl.textContent = 'Adapto Learner';
      accountDisplay.appendChild(nameEl);
    }
    if (!nameEl.id) nameEl.id = 'accountName';

    let avatarEl = accountDisplay.querySelector('.account-avatar');
    if (!avatarEl) {
      avatarEl = document.createElement('div');
      avatarEl.className = 'account-avatar';
      accountDisplay.appendChild(avatarEl);
    }
    if (!avatarEl.id) avatarEl.id = 'accountAvatar';

    // Insert detail dropdowns inside account-display (Thai version style)
    const detailDropdownsHtml = `
      <div id="accountDetailsDropdown" class="account-details-dropdown" style="display: none;">
        <div style="padding: 16px; border-bottom: 1px solid #e4e7eb; display: flex; justify-content: space-between; align-items: center;">
          <h3 style="margin: 0; color: #1f2933; font-size: 1rem;">Account Information</h3>
          <button onclick="document.getElementById('accountDetailsDropdown').style.display = 'none'; return false;" style="background: none; border: none; font-size: 18px; cursor: pointer; color: #636d79; padding: 0; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; transition: color 0.2s;" onmouseover="this.style.color='#1f2933'" onmouseout="this.style.color='#636d79'">✕</button>
        </div>
        <div style="padding: 16px;">
          <div style="margin-bottom: 16px;">
            <div style="font-size: 0.75rem; color: #8b92a9; text-transform: uppercase; font-weight: 600; margin-bottom: 6px;">Full Name</div>
            <div id="detailsDropdownName" style="color: #1f2933; font-weight: 500; font-size: 0.95rem;">-</div>
          </div>
          <div style="margin-bottom: 16px;">
            <div style="font-size: 0.75rem; color: #8b92a9; text-transform: uppercase; font-weight: 600; margin-bottom: 6px;">Email Address</div>
            <div id="detailsDropdownEmail" style="color: #1f2933; font-weight: 500; font-size: 0.95rem; word-break: break-all;">-</div>
          </div>
          <div style="margin-bottom: 16px;">
            <div style="font-size: 0.75rem; color: #8b92a9; text-transform: uppercase; font-weight: 600; margin-bottom: 6px;">Student ID</div>
            <div id="detailsDropdownStudentId" style="color: #1f2933; font-weight: 500; font-size: 0.95rem;">-</div>
          </div>
          <div style="margin-bottom: 16px;">
            <div style="font-size: 0.75rem; color: #8b92a9; text-transform: uppercase; font-weight: 600; margin-bottom: 6px;">Authentication Provider</div>
            <div id="detailsDropdownProvider" style="color: #1f2933; font-weight: 500; font-size: 0.95rem;">-</div>
          </div>
          <div style="margin-bottom: 0;">
            <div style="font-size: 0.75rem; color: #8b92a9; text-transform: uppercase; font-weight: 600; margin-bottom: 6px;">Login Date & Time</div>
            <div id="detailsDropdownLoginTime" style="color: #1f2933; font-weight: 500; font-size: 0.95rem;">-</div>
          </div>
        </div>
      </div>
      
      <div id="profileSettingsDropdown" class="account-details-dropdown" style="display: none;">
        <div style="padding: 16px; border-bottom: 1px solid #e4e7eb; display: flex; justify-content: space-between; align-items: center;">
          <h3 style="margin: 0; color: #1f2933; font-size: 1rem;">Profile Settings</h3>
          <button onclick="document.getElementById('profileSettingsDropdown').style.display = 'none'; return false;" style="background: none; border: none; font-size: 18px; cursor: pointer; color: #636d79; padding: 0; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; transition: color 0.2s;" onmouseover="this.style.color='#1f2933'" onmouseout="this.style.color='#636d79'">✕</button>
        </div>
        <div style="padding: 16px;">
          <div style="margin-bottom: 20px;">
            <label style="font-size: 0.75rem; color: #8b92a9; text-transform: uppercase; font-weight: 600; margin-bottom: 6px; display: block;">Display Name</label>
            <input type="text" id="settingsDisplayName" style="width: 100%; padding: 10px; border: 1px solid #cbd5e0; border-radius: 6px; font-size: 0.95rem; color: #1f2933;" placeholder="Your display name">
          </div>
          <div style="margin-bottom: 20px;">
            <label style="font-size: 0.75rem; color: #8b92a9; text-transform: uppercase; font-weight: 600; margin-bottom: 6px; display: block;">Email Notifications</label>
            <label style="display: flex; align-items: center; cursor: pointer;">
              <input type="checkbox" id="settingsEmailNotif" style="margin-right: 8px; cursor: pointer;">
              <span style="font-size: 0.9rem; color: #1f2933;">Receive email notifications</span>
            </label>
          </div>
          <div style="margin-bottom: 20px;">
            <label style="font-size: 0.75rem; color: #8b92a9; text-transform: uppercase; font-weight: 600; margin-bottom: 6px; display: block;">Theme Preference</label>
            <select id="settingsTheme" style="width: 100%; padding: 10px; border: 1px solid #cbd5e0; border-radius: 6px; font-size: 0.95rem; color: #1f2933; cursor: pointer;">
              <option value="light">Light Mode</option>
              <option value="dark">Dark Mode</option>
              <option value="auto">Auto (System)</option>
            </select>
          </div>
          <div style="margin-bottom: 20px;">
            <label style="font-size: 0.75rem; color: #8b92a9; text-transform: uppercase; font-weight: 600; margin-bottom: 6px; display: block;">Language</label>
            <select id="settingsLanguage" style="width: 100%; padding: 10px; border: 1px solid #cbd5e0; border-radius: 6px; font-size: 0.95rem; color: #1f2933; cursor: pointer;">
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
          <div style="margin-bottom: 0;">
            <button onclick="saveProfileSettings()" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #0097b2 0%, #00b8d4 100%); color: white; border: none; border-radius: 8px; font-weight: 600; font-size: 0.95rem; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">Save Settings</button>
          </div>
        </div>
      </div>
      
      <div id="learningHistoryDropdown" class="account-details-dropdown" style="display: none;">
        <div style="padding: 16px; border-bottom: 1px solid #e4e7eb; display: flex; justify-content: space-between; align-items: center;">
          <h3 style="margin: 0; color: #1f2933; font-size: 1rem;">Learning History</h3>
          <button onclick="document.getElementById('learningHistoryDropdown').style.display = 'none'; return false;" style="background: none; border: none; font-size: 18px; cursor: pointer; color: #636d79; padding: 0; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; transition: color 0.2s;" onmouseover="this.style.color='#1f2933'" onmouseout="this.style.color='#636d79'">✕</button>
        </div>
        <div style="padding: 16px; max-height: 400px; overflow-y: auto;">
          <div style="margin-bottom: 12px; padding: 12px; background: #f5f6f8; border-radius: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <div style="font-weight: 600; color: #1f2933; font-size: 0.9rem;" id="learningHistoryStats">No activity recorded</div>
            </div>
            <div id="learningHistoryList" style="font-size: 0.85rem; color: #636d79;">
              <p style="margin: 0; text-align: center; padding: 20px 0; color: #8b92a9;">Start taking quizzes and challenges to build your learning history</p>
            </div>
          </div>
        </div>
      </div>
    `;

    accountDisplay.insertAdjacentHTML('beforeend', detailDropdownsHtml);

    // Insert main dropdown AFTER account-display (Thai version style - outside the div)
    const mainDropdownHtml = `
    <div id="accountDropdownMenu" class="account-dropdown-menu" style="display: none;">
      <div class="account-dropdown-header">
        <div class="user-avatar-large" id="dropdownUserAvatar"></div>
        <div class="user-info">
          <div class="user-name" id="dropdownUserName">Adapto Learner</div>
          <div class="user-email" id="dropdownUserEmail">user@example.com</div>
          <div class="user-id" id="dropdownStudentId">Student ID: -</div>
        </div>
      </div>
      <div class="account-dropdown-divider"></div>
      <div class="account-dropdown-body">
        <a href="javascript:void(0);" class="dropdown-item" onclick="event.preventDefault(); event.stopPropagation(); setTimeout(() => showProfileSettings(), 0); return false;">⚙️ Profile Settings</a>
        <a href="javascript:void(0);" class="dropdown-item" onclick="event.preventDefault(); event.stopPropagation(); setTimeout(() => showAccountDetailsPanel(), 0); return false;">📋 Account Details</a>
        <a href="javascript:void(0);" class="dropdown-item" onclick="event.preventDefault(); event.stopPropagation(); setTimeout(() => showLearningHistory(), 0); return false;">📚 Learning History</a>
      </div>
      <div class="account-dropdown-divider"></div>
      <div class="account-dropdown-footer">
        <button class="logout-btn" onclick="logout()">🚪 Logout</button>
      </div>
    </div>
    `;

    accountDisplay.insertAdjacentHTML('afterend', mainDropdownHtml);

    if (!accountDisplay.dataset.dropdownBound) {
      accountDisplay.addEventListener('click', function(e) {
        if (e.target.closest('#accountDropdownMenu')) return;
        if (e.target.closest('#accountDetailsDropdown')) return;
        if (e.target.closest('#profileSettingsDropdown')) return;
        if (e.target.closest('#learningHistoryDropdown')) return;
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (window.toggleAccountDropdown) {
          window.toggleAccountDropdown();
        }
      }, true);
      accountDisplay.dataset.dropdownBound = 'true';
    }
  }
})();
