const LoadingTips = {
    tips: {
        general: [
            "💡 Tip: Take short breaks every 25 minutes to maintain focus!",
            "🎯 Studying in the same place helps build a routine!",
            "📚 Review notes within 24 hours to improve retention by 60%!",
            "🧠 Sleep is crucial for memory consolidation!",
            "✍️ Writing notes by hand improves understanding!",
            "🎧 Background music can help some learners focus better!",
            "💪 Regular exercise boosts cognitive performance!",
            "🍎 Healthy snacks fuel your brain for better learning!",
            "👥 Teaching others is one of the best ways to learn!",
            "⏰ Study during your peak energy hours for best results!"
        ],
        mathematics: [
            "📐 Math Tip: Practice is the key to mastering formulas!",
            "🔢 Always check your work by substituting answers back!",
            "📊 Draw diagrams to visualize complex problems!",
            "✏️ Write out each step - shortcuts can lead to errors!",
            "🎲 Understanding 'why' is more important than memorizing!",
            "🧮 Break complex problems into smaller, manageable steps!",
            "📏 Learn to estimate answers before calculating!",
            "🔺 Geometry is everywhere - observe shapes around you!",
            "➗ Master basic operations before advanced concepts!",
            "🎯 Math is about problem-solving, not just calculations!"
        ],
        science: [
            "🧪 Science Tip: Question everything and seek evidence!",
            "🔬 The scientific method: Observe, Hypothesize, Test, Conclude!",
            "⚛️ Understanding concepts beats memorizing facts!",
            "🌍 Real-world applications make science more interesting!",
            "🧬 Biology is the study of life all around us!",
            "⚗️ Chemistry is about the transformations of matter!",
            "🌟 Physics explains how the universe works!",
            "🔭 Curiosity drives scientific discovery!",
            "🌊 Nature follows patterns - look for them!",
            "💊 Science impacts our daily lives in countless ways!"
        ],
        history: [
            "📜 History Tip: Connect events to understand cause and effect!",
            "🏛️ Understanding the past helps us shape the future!",
            "👑 Every historical figure was once just a person!",
            "🗺️ Geography and history are deeply intertwined!",
            "📖 Primary sources provide direct evidence of the past!",
            "⏳ Timelines help organize historical events!",
            "🎭 History is written by the victors - consider all perspectives!",
            "🏺 Archaeological discoveries constantly reshape our understanding!",
            "🌏 World history is connected across continents!",
            "📚 Learn from history to avoid repeating mistakes!"
        ],
        socialstudies: [
            "🌍 Social Studies Tip: Empathy helps understand different cultures!",
            "🗳️ Active citizenship makes democracy stronger!",
            "🤝 Society functions through cooperation and rules!",
            "🏛️ Governments exist to serve the people!",
            "📰 Critical thinking is essential for evaluating information!",
            "🌐 We're all part of a global community!",
            "⚖️ Rights come with responsibilities!",
            "🏙️ Urban planning reflects societal values!",
            "💼 Economics affects everyone's daily life!",
            "🎨 Culture shapes how we see the world!"
        ]
    },

    currentTip: null,

    getTip(subject = 'general') {
        const category = this.tips[subject] || this.tips.general;
        const randomIndex = Math.floor(Math.random() * category.length);
        return category[randomIndex];
    },

    show(subject = 'general', message = 'Loading...') {
        this.hide();

        this.currentTip = this.getTip(subject);
        
        const loading = document.createElement('div');
        loading.id = 'loadingScreen';
        loading.className = 'loading-screen active';
        loading.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner">
                    <div class="spinner"></div>
                </div>
                <p class="loading-message">${message}</p>
                <div class="loading-tip">${this.currentTip}</div>
                <div class="loading-progress">
                    <div class="loading-bar"></div>
                </div>
            </div>
        `;

        document.body.appendChild(loading);

        const progressBar = loading.querySelector('.loading-bar');
        setTimeout(() => {
            progressBar.style.width = '100%';
        }, 100);

        return loading;
    },

    hide() {
        const existing = document.getElementById('loadingScreen');
        if (existing) {
            existing.classList.remove('active');
            setTimeout(() => existing.remove(), 300);
        }
    },

    showForDuration(duration = 2000, subject = 'general', message = 'Loading...') {
        this.show(subject, message);
        setTimeout(() => this.hide(), duration);
    },

    addStylesheet() {
        const style = document.createElement('style');
        style.textContent = `
            .loading-screen {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.85);
                backdrop-filter: blur(10px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 99999;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
            }

            .loading-screen.active {
                opacity: 1;
                pointer-events: auto;
            }

            .loading-content {
                text-align: center;
                color: white;
                max-width: 500px;
                padding: 40px;
            }

            .loading-spinner {
                margin-bottom: 24px;
            }

            .spinner {
                width: 60px;
                height: 60px;
                border: 4px solid rgba(255, 255, 255, 0.3);
                border-top-color: #10b981;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto;
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }

            .loading-message {
                font-size: 1.3rem;
                font-weight: 600;
                margin: 0 0 20px;
                color: white;
            }

            .loading-tip {
                font-size: 1rem;
                line-height: 1.6;
                color: #e0e7ff;
                background: rgba(99, 102, 241, 0.2);
                padding: 16px 20px;
                border-radius: 12px;
                margin-bottom: 24px;
                border-left: 4px solid #6366f1;
                animation: tipFadeIn 0.5s ease 0.3s backwards;
            }

            @keyframes tipFadeIn {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .loading-progress {
                width: 100%;
                height: 4px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 2px;
                overflow: hidden;
            }

            .loading-bar {
                height: 100%;
                background: linear-gradient(90deg, #6366f1, #10b981);
                width: 0%;
                transition: width 2s cubic-bezier(0.4, 0, 0.2, 1);
            }

            @media (max-width: 640px) {
                .loading-content {
                    padding: 20px;
                }

                .loading-message {
                    font-size: 1.1rem;
                }

                .loading-tip {
                    font-size: 0.9rem;
                }
            }
        `;
        document.head.appendChild(style);
    }
};

LoadingTips.addStylesheet();

if (typeof window !== 'undefined') {
    window.LoadingTips = LoadingTips;
}
