const DarkMode = {
    init() {
        this.applyStoredTheme();
        this.createToggleButton();
        this.setupAutoSwitch();
        this.addStylesheet();
    },

    getCurrentTheme() {
        const stored = localStorage.getItem('adaptohub_theme');
        if (stored) return stored;

        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        
        return 'light';
    },

    applyStoredTheme() {
        const theme = this.getCurrentTheme();
        document.documentElement.setAttribute('data-theme', theme);
    },

    toggle() {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = current === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('adaptohub_theme', newTheme);
        localStorage.setItem('adaptohub_theme_manual', 'true');
        
        this.animateToggle();
    },

    animateToggle() {
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    },

    createToggleButton() {
        const button = document.createElement('button');
        button.id = 'themeToggle';
        button.className = 'theme-toggle';
        button.setAttribute('aria-label', 'Toggle dark mode');
        button.innerHTML = `
            <svg class="sun-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="4" fill="currentColor"/>
                <path d="M10 1v2m0 14v2M4.22 4.22l1.42 1.42m8.72 8.72l1.42 1.42M1 10h2m14 0h2M4.22 15.78l1.42-1.42m8.72-8.72l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <svg class="moon-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
            </svg>
        `;
        
        button.addEventListener('click', () => this.toggle());

        const accountDisplay = document.querySelector('.account-display');
        if (accountDisplay) {
            accountDisplay.parentNode.insertBefore(button, accountDisplay);
        }
    },

    setupAutoSwitch() {
        if (localStorage.getItem('adaptohub_theme_manual') === 'true') {
            return;
        }

        const checkTime = () => {
            const hour = new Date().getHours();
            const shouldBeDark = hour >= 19 || hour < 6;
            const current = document.documentElement.getAttribute('data-theme');
            
            if (shouldBeDark && current !== 'dark') {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('adaptohub_theme', 'dark');
            } else if (!shouldBeDark && current !== 'light') {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('adaptohub_theme', 'light');
            }
        };

        setInterval(checkTime, 60000);
        checkTime();
    },

    addStylesheet() {
        const style = document.createElement('style');
        style.textContent = `
            :root {
                --bg-primary: #ffffff;
                --bg-secondary: #f5f6f8;
                --bg-tertiary: #e6e9f1;
                --text-primary: #1f2933;
                --text-secondary: #636d79;
                --text-tertiary: #9aa5b1;
                --border-color: #e4e7eb;
                --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.1);
                --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.12);
                --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.15);
                --card-bg: #ffffff;
                --header-bg: #ffffff;
                --input-bg: #ffffff;
            }

            [data-theme="dark"] {
                --bg-primary: #1a1d23;
                --bg-secondary: #242830;
                --bg-tertiary: #2d333e;
                --text-primary: #e6ebf1;
                --text-secondary: #b8c5d6;
                --text-tertiary: #8895a7;
                --border-color: #3a4150;
                --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.3);
                --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.4);
                --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.5);
                --card-bg: #242830;
                --header-bg: #1f2329;
                --input-bg: #2d333e;
            }

            body {
                background-color: var(--bg-primary);
                color: var(--text-primary);
                transition: background-color 0.3s ease, color 0.3s ease;
            }

            .top-banner {
                background-color: var(--header-bg);
                border-bottom: 1px solid var(--border-color);
                box-shadow: var(--shadow-sm);
            }

            .module-card,
            .metric-card,
            .card {
                background: var(--card-bg);
                box-shadow: var(--shadow-sm);
                border-color: var(--border-color);
            }

            .module-card:hover,
            .card:hover {
                box-shadow: var(--shadow-md);
            }

            [data-theme="dark"] .adaptive-header,
            [data-theme="dark"] .hero {
                opacity: 0.95;
            }

            [data-theme="dark"] .adaptive-recommendation {
                background: rgba(99, 102, 241, 0.1);
                border-left-color: #6366f1;
            }

            [data-theme="dark"] .adaptive-recommendation p {
                color: #a5b4fc;
            }

            [data-theme="dark"] input,
            [data-theme="dark"] textarea,
            [data-theme="dark"] select {
                background-color: var(--input-bg);
                color: var(--text-primary);
                border-color: var(--border-color);
            }

            [data-theme="dark"] .activity-item {
                background: var(--bg-tertiary);
            }

            .theme-toggle {
                background: transparent;
                border: 2px solid var(--border-color);
                border-radius: 50%;
                width: 44px;
                height: 44px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                position: relative;
                margin-right: 16px;
            }

            .theme-toggle:hover {
                background: var(--bg-secondary);
                transform: scale(1.1);
            }

            .theme-toggle svg {
                position: absolute;
                transition: opacity 0.3s ease, transform 0.3s ease;
            }

            .theme-toggle .sun-icon {
                opacity: 1;
                transform: rotate(0deg);
            }

            .theme-toggle .moon-icon {
                opacity: 0;
                transform: rotate(180deg);
            }

            [data-theme="dark"] .theme-toggle .sun-icon {
                opacity: 0;
                transform: rotate(180deg);
            }

            [data-theme="dark"] .theme-toggle .moon-icon {
                opacity: 1;
                transform: rotate(0deg);
            }

            [data-theme="dark"] .difficulty-easy {
                background-color: rgba(46, 125, 50, 0.2);
                color: #81c784;
            }

            [data-theme="dark"] .difficulty-medium {
                background-color: rgba(239, 108, 0, 0.2);
                color: #ffb74d;
            }

            [data-theme="dark"] .difficulty-hard {
                background-color: rgba(198, 40, 40, 0.2);
                color: #e57373;
            }

            [data-theme="dark"] .result-card {
                background: var(--card-bg);
            }

            [data-theme="dark"] .result-pass {
                background: rgba(16, 185, 129, 0.1);
                border-color: #10b981;
            }

            [data-theme="dark"] .result-fail {
                background: rgba(239, 68, 68, 0.1);
                border-color: #ef4444;
            }

            @media (max-width: 768px) {
                .theme-toggle {
                    width: 40px;
                    height: 40px;
                    margin-right: 8px;
                }
            }
        `;
        document.head.appendChild(style);
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => DarkMode.init());
} else {
    DarkMode.init();
}

if (typeof window !== 'undefined') {
    window.DarkMode = DarkMode;
}
