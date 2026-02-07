console.log('Starting avatar-system.js...');

// Simple, reliable avatar system - NO EMOJI IN CODE
const AvatarSystem = {
    avatars: {
        basic: [
            { id: 'student', emoji: '👨‍🎓', name: 'Student' },
            { id: 'scholar', emoji: '👩‍🎓', name: 'Scholar' },
            { id: 'teacher', emoji: '👨‍🏫', name: 'Teacher' },
            { id: 'scientist', emoji: '👩‍🔬', name: 'Scientist' },
            { id: 'artist', emoji: '👨‍🎨', name: 'Artist' },
            { id: 'engineer', emoji: '👷', name: 'Engineer' },
            { id: 'detective', emoji: '🕵', name: 'Detective' },
            { id: 'doctor', emoji: '👨‍⚕', name: 'Doctor' },
            { id: 'pilot', emoji: '👨‍✈', name: 'Pilot' },
            { id: 'chef', emoji: '👨‍🍳', name: 'Chef' }
        ],
        animals: [
            { id: 'cat', emoji: '🐱', name: 'Cat' },
            { id: 'dog', emoji: '🐶', name: 'Dog' },
            { id: 'panda', emoji: '🐼', name: 'Panda' },
            { id: 'fox', emoji: '🦊', name: 'Fox' },
            { id: 'lion', emoji: '🦁', name: 'Lion' },
            { id: 'tiger', emoji: '🐯', name: 'Tiger' },
            { id: 'koala', emoji: '🐨', name: 'Koala' },
            { id: 'penguin', emoji: '🐧', name: 'Penguin' },
            { id: 'owl', emoji: '🦉', name: 'Owl' },
            { id: 'butterfly', emoji: '🦋', name: 'Butterfly' },
            { id: 'bee', emoji: '🐝', name: 'Bee' },
            { id: 'unicorn', emoji: '🦄', name: 'Unicorn' },
            { id: 'dragon', emoji: '🐉', name: 'Dragon' },
            { id: 'phoenix', emoji: '🔥', name: 'Phoenix' }
        ],
        fantasy: [
            { id: 'wizard', emoji: '🧙‍♂', name: 'Wizard' },
            { id: 'witch', emoji: '🧙‍♀', name: 'Witch' },
            { id: 'fairy', emoji: '🧚‍♀', name: 'Fairy' },
            { id: 'vampire', emoji: '🧛‍♂', name: 'Vampire' },
            { id: 'elf', emoji: '🧝‍♂', name: 'Elf' },
            { id: 'angel', emoji: '👼', name: 'Angel' },
            { id: 'ghost', emoji: '👻', name: 'Ghost' },
            { id: 'robot', emoji: '🤖', name: 'Robot' },
            { id: 'alien', emoji: '👽', name: 'Alien' },
            { id: 'demon', emoji: '😈', name: 'Demon' }
        ],
        colors: [
            { hex: '#6366f1', name: 'Indigo' },
            { hex: '#a855f7', name: 'Purple' },
            { hex: '#ec4899', name: 'Pink' },
            { hex: '#f59e0b', name: 'Orange' },
            { hex: '#10b981', name: 'Green' },
            { hex: '#3b82f6', name: 'Blue' },
            { hex: '#ef4444', name: 'Red' },
            { hex: '#eab308', name: 'Yellow' },
            { hex: '#14b8a6', name: 'Teal' },
            { hex: '#06b6d4', name: 'Cyan' },
            { hex: '#8b5cf6', name: 'Violet' },
            { hex: '#f43f5e', name: 'Rose' }
        ],
        gradients: [
            { name: 'Sunset', value: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)' },
            { name: 'Ocean', value: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' },
            { name: 'Forest', value: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)' },
            { name: 'Fire', value: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)' },
            { name: 'Galaxy', value: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)' },
            { name: 'Blossom', value: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)' },
            { name: 'Dawn', value: 'linear-gradient(135deg, #eab308 0%, #f97316 100%)' },
            { name: 'Twilight', value: 'linear-gradient(135deg, #4f46e5 0%, #a855f7 100%)' }
        ]
    },

    currentAvatar: null,

    init: function() {
        console.log('AvatarSystem.init() called');
        this.loadUserAvatar();
        this.updateAvatarDisplay();
        this.addClickListener();
        console.log('AvatarSystem initialized successfully');
    },

    loadUserAvatar: function() {
        var saved = localStorage.getItem('adaptohub_avatar');
        if (saved) {
            try {
                this.currentAvatar = JSON.parse(saved);
            } catch (e) {
                this.currentAvatar = this.getDefaultAvatar();
            }
        } else {
            this.currentAvatar = this.getDefaultAvatar();
        }
        console.log('User avatar loaded:', this.currentAvatar);
    },

    getDefaultAvatar: function() {
        return {
            type: 'student',
            emoji: '👨‍🎓',
            color: '#6366f1',
            name: 'Student',
            gradient: null
        };
    },

    updateAvatarDisplay: function() {
        var avatar = document.getElementById('accountAvatar');
        if (!avatar) return;

        if (this.currentAvatar.gradient) {
            avatar.style.background = this.currentAvatar.gradient;
        } else {
            avatar.style.background = this.currentAvatar.color;
        }

        avatar.innerHTML = '<span style="font-size: 24px;">' + this.currentAvatar.emoji + '</span>';
        avatar.style.display = 'flex';
        avatar.style.alignItems = 'center';
        avatar.style.justifyContent = 'center';

        console.log('Avatar display updated');
    },

    addClickListener: function() {
        var self = this;
        var avatar = document.getElementById('accountAvatar');
        if (avatar) {
            avatar.style.cursor = 'pointer';
            avatar.addEventListener('click', function() {
                console.log('Avatar clicked');
                self.openModal();
            });
            console.log('Click listener added to avatar');
        }
    },

    openModal: function() {
        console.log('openModal() called');
        var self = this;
        var modal = document.createElement('div');
        modal.className = 'avatar-modal';
        modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 10001;';

        var content = document.createElement('div');
        content.className = 'avatar-modal-content';
        content.style.cssText = 'background: white; border-radius: 16px; padding: 24px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3);';

        // Header
        var header = document.createElement('div');
        header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #e4e7eb; padding-bottom: 16px;';
        
        var title = document.createElement('h2');
        title.textContent = 'Customize Your Avatar';
        title.style.cssText = 'margin: 0; color: #1f2933; font-size: 1.5rem;';
        header.appendChild(title);

        var closeBtn = document.createElement('button');
        closeBtn.textContent = 'X';
        closeBtn.style.cssText = 'background: none; border: none; font-size: 28px; cursor: pointer; color: #636d79;';
        closeBtn.onclick = function() { modal.remove(); };
        header.appendChild(closeBtn);
        content.appendChild(header);

        // Avatar Section
        var avatarSection = document.createElement('div');
        avatarSection.style.cssText = 'margin-bottom: 24px;';
        
        var avatarTitle = document.createElement('h3');
        avatarTitle.textContent = 'Choose Avatar';
        avatarTitle.style.cssText = 'margin: 0 0 12px 0; color: #1f2933;';
        avatarSection.appendChild(avatarTitle);

        var avatarGrid = document.createElement('div');
        avatarGrid.style.cssText = 'display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px;';

        var allAvatars = [].concat(this.avatars.basic, this.avatars.animals, this.avatars.fantasy);
        var self = this;
        allAvatars.forEach(function(avatar) {
            var btn = document.createElement('div');
            btn.style.cssText = 'padding: 12px; background: #f5f6f8; border: 2px solid transparent; border-radius: 8px; cursor: pointer; text-align: center; transition: all 0.2s;';
            btn.innerHTML = '<div style="font-size: 28px; margin-bottom: 8px;">' + avatar.emoji + '</div><div style="font-size: 0.8rem; color: #636d79;">' + avatar.name + '</div>';

            if (self.currentAvatar.type === avatar.id) {
                btn.style.border = '2px solid #6366f1';
                btn.style.background = 'rgba(99, 102, 241, 0.1)';
            }

            btn.onmouseover = function() {
                this.style.transform = 'scale(1.1)';
            };
            btn.onmouseout = function() {
                this.style.transform = 'scale(1)';
            };

            btn.onclick = function() {
                self.currentAvatar.type = avatar.id;
                self.currentAvatar.emoji = avatar.emoji;
                self.currentAvatar.name = avatar.name;
                self.updateAvatarDisplay();
                self.saveAvatar();
                modal.remove();
                self.openModal();
            };

            avatarGrid.appendChild(btn);
        });

        avatarSection.appendChild(avatarGrid);
        content.appendChild(avatarSection);

        // Color Section
        var colorSection = document.createElement('div');
        colorSection.style.cssText = 'margin-bottom: 24px;';
        
        var colorTitle = document.createElement('h3');
        colorTitle.textContent = 'Choose Color';
        colorTitle.style.cssText = 'margin: 0 0 12px 0; color: #1f2933;';
        colorSection.appendChild(colorTitle);

        var colorGrid = document.createElement('div');
        colorGrid.style.cssText = 'display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px;';

        this.avatars.colors.forEach(function(color) {
            var colorBtn = document.createElement('div');
            colorBtn.style.cssText = 'width: 100%; aspect-ratio: 1; background: ' + color.hex + '; border: 3px solid transparent; border-radius: 12px; cursor: pointer; transition: all 0.2s;';
            
            if (self.currentAvatar.color === color.hex && !self.currentAvatar.gradient) {
                colorBtn.style.border = '3px solid #1f2933';
                colorBtn.style.transform = 'scale(1.1)';
            }

            colorBtn.onmouseover = function() {
                this.style.transform = 'scale(1.1)';
            };
            colorBtn.onmouseout = function() {
                this.style.transform = 'scale(1)';
            };

            colorBtn.onclick = function() {
                self.currentAvatar.color = color.hex;
                self.currentAvatar.gradient = null;
                self.updateAvatarDisplay();
                self.saveAvatar();
                modal.remove();
                self.openModal();
            };

            colorGrid.appendChild(colorBtn);
        });

        colorSection.appendChild(colorGrid);
        content.appendChild(colorSection);

        // Gradient Section
        var gradientSection = document.createElement('div');
        gradientSection.style.cssText = 'margin-bottom: 24px;';
        
        var gradientTitle = document.createElement('h3');
        gradientTitle.textContent = 'Choose Gradient';
        gradientTitle.style.cssText = 'margin: 0 0 12px 0; color: #1f2933;';
        gradientSection.appendChild(gradientTitle);

        var gradientGrid = document.createElement('div');
        gradientGrid.style.cssText = 'display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;';

        this.avatars.gradients.forEach(function(gradient) {
            var gradBtn = document.createElement('div');
            gradBtn.style.cssText = 'width: 100%; aspect-ratio: 1; background: ' + gradient.value + '; border: 3px solid transparent; border-radius: 12px; cursor: pointer; transition: all 0.2s;';
            
            if (self.currentAvatar.gradient === gradient.value) {
                gradBtn.style.border = '3px solid #1f2933';
                gradBtn.style.transform = 'scale(1.1)';
            }

            gradBtn.onmouseover = function() {
                this.style.transform = 'scale(1.1)';
            };
            gradBtn.onmouseout = function() {
                this.style.transform = 'scale(1)';
            };

            gradBtn.onclick = function() {
                self.currentAvatar.gradient = gradient.value;
                self.updateAvatarDisplay();
                self.saveAvatar();
                modal.remove();
                self.openModal();
            };

            gradientGrid.appendChild(gradBtn);
        });

        gradientSection.appendChild(gradientGrid);
        content.appendChild(gradientSection);

        // Save Button
        var saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save Avatar';
        saveBtn.style.cssText = 'width: 100%; padding: 14px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 1rem; margin-top: 20px;';
        saveBtn.onclick = function() {
            self.saveAvatar();
            modal.remove();
        };
        content.appendChild(saveBtn);

        modal.appendChild(content);

        modal.onclick = function(e) {
            if (e.target === modal) modal.remove();
        };

        document.body.appendChild(modal);
        console.log('Modal opened successfully');
    },

    saveAvatar: function() {
        localStorage.setItem('adaptohub_avatar', JSON.stringify(this.currentAvatar));
        console.log('Avatar saved');
    }
};

// Expose to window IMMEDIATELY
window.AvatarSystem = AvatarSystem;
console.log('window.AvatarSystem assigned');
console.log('typeof window.AvatarSystem.openModal:', typeof window.AvatarSystem.openModal);

// Add global test function
window.testAvatarModal = function() {
    console.log('Testing avatar modal...');
    if (window.AvatarSystem && typeof window.AvatarSystem.openModal === 'function') {
        window.AvatarSystem.openModal();
    } else {
        console.error('AvatarSystem.openModal not available');
    }
};

console.log('Test function available: window.testAvatarModal()');

// Make AvatarSystem globally available
window.AvatarSystem = AvatarSystem;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOMContentLoaded - initializing AvatarSystem');
        AvatarSystem.init();
    });
} else {
    console.log('DOM already loaded - initializing AvatarSystem');
    AvatarSystem.init();
}

// Add CSS styles
var style = document.createElement('style');
style.textContent = '.avatar-modal { animation: fadeIn 0.3s ease; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }';
document.head.appendChild(style);
console.log('Styles added to head');

console.log('avatar-system.js fully loaded');
