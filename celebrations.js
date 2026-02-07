(function loadConfettiLibrary() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js';
    script.async = true;
    document.head.appendChild(script);
})();

const Celebrations = {
    quizComplete(score) {
        if (typeof confetti === 'undefined') return;
        
        const duration = score >= 80 ? 3000 : 2000;
        const particleCount = score >= 80 ? 200 : 100;
        if (score >= 70) {
            confetti({
                particleCount: particleCount,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#10b981', '#fbbf24', '#34d399', '#fcd34d']
            });
            if (score >= 90) {
                setTimeout(() => {
                    confetti({
                        particleCount: 100,
                        angle: 60,
                        spread: 55,
                        origin: { x: 0 },
                        colors: ['#8b5cf6', '#ec4899', '#f59e0b']
                    });
                    confetti({
                        particleCount: 100,
                        angle: 120,
                        spread: 55,
                        origin: { x: 1 },
                        colors: ['#8b5cf6', '#ec4899', '#f59e0b']
                    });
                }, 250);
            }
        }
    },

    unitComplete() {
        if (typeof confetti === 'undefined') return;
        
        const count = 200;
        const defaults = {
            origin: { y: 0.7 }
        };

        function fire(particleRatio, opts) {
            confetti({
                ...defaults,
                ...opts,
                particleCount: Math.floor(count * particleRatio)
            });
        }

        fire(0.25, {
            spread: 26,
            startVelocity: 55,
        });
        fire(0.2, {
            spread: 60,
        });
        fire(0.35, {
            spread: 100,
            decay: 0.91,
            scalar: 0.8
        });
        fire(0.1, {
            spread: 120,
            startVelocity: 25,
            decay: 0.92,
            scalar: 1.2
        });
        fire(0.1, {
            spread: 120,
            startVelocity: 45,
        });
    },

    perfectScore() {
        if (typeof confetti === 'undefined') return;
        
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: ['#ffd700', '#ffed4e', '#ffc107']
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: ['#ffd700', '#ffed4e', '#ffc107']
            });
        }, 250);
    },

    showBadge(badgeName, badgeIcon, badgeDescription) {
        const badge = document.createElement('div');
        badge.className = 'achievement-badge';
        badge.innerHTML = `
            <div class="badge-icon">${badgeIcon}</div>
            <div class="badge-content">
                <div class="badge-title">Achievement Unlocked!</div>
                <div class="badge-name">${badgeName}</div>
                <div class="badge-description">${badgeDescription}</div>
            </div>
        `;
        
        document.body.appendChild(badge);
        setTimeout(() => badge.classList.add('show'), 100);
        setTimeout(() => {
            badge.classList.remove('show');
            setTimeout(() => badge.remove(), 500);
        }, 4000);

        this.playAchievementSound();
    },

    streakMilestone(days) {
        if (typeof confetti === 'undefined') return;
        
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff6b6b', '#ffa500', '#ffed4e']
        });
        
        const milestones = {
            3: { name: 'Getting Started', icon: '🔥', desc: '3-day streak!' },
            7: { name: 'Week Warrior', icon: '🔥🔥', desc: '7-day streak!' },
            14: { name: 'Fortnight Fighter', icon: '🔥🔥🔥', desc: '14-day streak!' },
            30: { name: 'Month Master', icon: '🔥🔥🔥🔥', desc: '30-day streak!' },
            100: { name: 'Century Scholar', icon: '🏆', desc: '100-day streak!' }
        };
        
        if (milestones[days]) {
            this.showBadge(milestones[days].name, milestones[days].icon, milestones[days].desc);
        }
    },

    firstCompletion(subject) {
        const badges = {
            algebra: { name: 'Algebra Initiate', icon: '📐', desc: 'Completed first Algebra quiz' },
            geometry: { name: 'Geometry Beginner', icon: '📏', desc: 'Completed first Geometry quiz' },
            physics: { name: 'Physics Starter', icon: '⚛️', desc: 'Completed first Physics quiz' },
            chemistry: { name: 'Chemistry Novice', icon: '🧪', desc: 'Completed first Chemistry quiz' },
            biology: { name: 'Biology Explorer', icon: '🧬', desc: 'Completed first Biology quiz' },
            history: { name: 'History Buff', icon: '📜', desc: 'Completed first History quiz' },
            buddhism: { name: 'Dharma Student', icon: '☸️', desc: 'Completed first Buddhism quiz' }
        };
        
        const badge = badges[subject.toLowerCase()];
        if (badge) {
            this.showBadge(badge.name, badge.icon, badge.desc);
        }
    },

    playAchievementSound() {
        try {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUKXi8LNlHgU7k9n0yXkqBSl+yu/glUMLD1mr5O+qWBUIQ5zd8r1uIwUuhM/z2Ik3Bxlptfbll1AKEE+l4fCxZh0FO5PX9Ml5KgUofsvw35ZDA1mr5O6pWRcJQpvb8r5uJAUtg8/z2Ik3Bxlptfbll1AKEE+l4fCxZh0FO5PX9Ml5KgUofsvw35ZDA1mr5O6pWRcJQpvb8r5uJAUtg8/z2Ik3Bxlptfbll1AKEE+l4fCxZh0FO5PX9Ml5KgUofsvw35ZDA1mr5O6pWRcJQpvb8r5uJAUtg8/z2Ik3Bxlptfbll1AKEE+l4fCxZh0FO5PX9Ml5KgUofsvw35ZDA1mr5O6pWRcJQpvb8r5uJAUtg8/z2Ik3Bxlptfbll1AKEE+l4fCxZh0FO5PX9Ml5KgUofsvw35ZDA1mr5O6pWRcJQpvb8r5uJAUtg8/z2Ik3Bxlptfbll1AKEE+l4fCxZh0FO5PX9Ml5KgUofsvw35ZDA1mr5O6pWRcJQpvb8r5uJAUtg8/z2Ik3Bxlptfbll1AKEE+l4fCxZh0FO5PX9Ml5KgUofsvw35ZDA1mr5O6pWRcJQpvb8r5uJAUtg8/z2Ik3Bxlptfbll1AKEE+l4fCxZh0FO5PX9Ml5KgUofsvw35ZDA1mr5O6pWRcJQpvb8r5uJAUtg8/z2Ik3Bxlptfbll1AKEE+l4fCxZh0FO5PX9Ml5KgUofsvw35ZDA1mr5O6pWRcJQpvb8r5uJAUtg8/z2Ik3Bxlptfbll1AKEE+l4fCxZh0FO5PX9Ml5KgUofsvw35ZDA1mr5O6pWRcJQpvb8r5uJAUtg8/z2Ik3Bxlptfbll1AKEE+l4fCxZh0FO5PX9Ml5KgUofsvw35ZDA1mr5O6pWRcJQpvb8r5uJAUtg8/z2Ik3Bxlptfbll1AKEE+l4fCxZh0FO5PX9Ml5KgUofsvw35ZDA1mr5O6pWRcJQpvb8r5uJAUtg8/z2Ik3Bxlptfbll1AKEE+l4fCxZh0FO5PX9Ml5KgUofsvw35ZDA1mr5O6pWRcJQpvb8r5uJAUtg8/z2Ik3Bxlptfbll1AKEE+l4fCxZh0FO5PX9Ml5KgUo');
            audio.volume = 0.3;
            audio.play();
        } catch (e) {
        }
    }
};

const style = document.createElement('style');
style.textContent = `
    .achievement-badge {
        position: fixed;
        top: -200px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px 30px;
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 20px;
        min-width: 400px;
        transition: top 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
    
    .achievement-badge.show {
        top: 100px;
        animation: badgePulse 0.5s ease-in-out 0.5s;
    }
    
    @keyframes badgePulse {
        0%, 100% { transform: translateX(-50%) scale(1); }
        50% { transform: translateX(-50%) scale(1.05); }
    }
    
    .badge-icon {
        font-size: 3rem;
        line-height: 1;
        animation: iconSpin 0.6s ease-in-out;
    }
    
    @keyframes iconSpin {
        0% { transform: rotate(0deg) scale(0); }
        50% { transform: rotate(180deg) scale(1.2); }
        100% { transform: rotate(360deg) scale(1); }
    }
    
    .badge-content {
        flex: 1;
    }
    
    .badge-title {
        font-size: 0.9rem;
        opacity: 0.9;
        margin-bottom: 4px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .badge-name {
        font-size: 1.4rem;
        font-weight: 700;
        margin-bottom: 4px;
    }
    
    .badge-description {
        font-size: 0.95rem;
        opacity: 0.8;
    }
    
    @media (max-width: 640px) {
        .achievement-badge {
            min-width: 90%;
            left: 5%;
            transform: none;
        }
        
        .achievement-badge.show {
            transform: none;
        }
        
        @keyframes badgePulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
    }
`;
document.head.appendChild(style);

if (typeof window !== 'undefined') {
    window.Celebrations = Celebrations;
}
