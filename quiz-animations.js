const QuizAnimations = {
    init() {
        this.addStylesheet();
        this.enhanceQuizzes();
    },

    addStylesheet() {
        const style = document.createElement('style');
        style.textContent = `
            /* Smooth page transitions */
            .fade-in {
                animation: fadeIn 0.5s ease-in;
            }

            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            /* Quiz question transitions */
            .quiz-container {
                transition: opacity 0.3s ease, transform 0.3s ease;
            }

            .quiz-container.changing {
                opacity: 0;
                transform: scale(0.95);
            }

            /* Answer button animations */
            .quiz-options button,
            .answer-option {
                transition: all 0.2s ease;
                position: relative;
                overflow: hidden;
            }

            .quiz-options button:hover,
            .answer-option:hover {
                transform: translateX(4px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }

            .quiz-options button::before,
            .answer-option::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: translate(-50%, -50%);
                transition: width 0.6s, height 0.6s;
            }

            .quiz-options button:active::before,
            .answer-option:active::before {
                width: 300px;
                height: 300px;
            }

            /* Result display animations */
            .result-card {
                animation: resultSlideIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            }

            @keyframes resultSlideIn {
                from {
                    opacity: 0;
                    transform: scale(0.8) translateY(50px);
                }
                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }

            .result-pass {
                animation: resultSlideIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55), successPulse 1.5s ease-in-out 0.5s;
            }

            @keyframes successPulse {
                0%, 100% {
                    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
                }
                50% {
                    box-shadow: 0 0 0 20px rgba(16, 185, 129, 0);
                }
            }

            /* Progress bar animation */
            .progress-fill {
                transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            }

            /* Unit card hover effects */
            .unit-card {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .unit-card:hover {
                transform: translateY(-8px) scale(1.02);
            }

            /* Loading spinner */
            .spinner {
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                from {
                    transform: rotate(0deg);
                }
                to {
                    transform: rotate(360deg);
                }
            }

            /* Score counter animation */
            .score-value {
                animation: scoreCount 0.8s ease-out;
            }

            @keyframes scoreCount {
                from {
                    transform: scale(0);
                    opacity: 0;
                }
                to {
                    transform: scale(1);
                    opacity: 1;
                }
            }

            /* Feedback message slide */
            .feedback-message {
                animation: slideDown 0.4s ease;
            }

            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            /* Button press effect */
            .btn-primary:active,
            .submit-btn:active,
            .check-button:active {
                transform: scale(0.95);
            }

            /* Metric card entrance */
            .metric-card {
                animation: cardSlideUp 0.5s ease backwards;
            }

            .metric-card:nth-child(1) { animation-delay: 0.1s; }
            .metric-card:nth-child(2) { animation-delay: 0.2s; }
            .metric-card:nth-child(3) { animation-delay: 0.3s; }
            .metric-card:nth-child(4) { animation-delay: 0.4s; }

            @keyframes cardSlideUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            /* Module card stagger */
            .module-card {
                animation: moduleEntrance 0.5s ease backwards;
            }

            .module-card:nth-child(1) { animation-delay: 0.1s; }
            .module-card:nth-child(2) { animation-delay: 0.15s; }
            .module-card:nth-child(3) { animation-delay: 0.2s; }
            .module-card:nth-child(4) { animation-delay: 0.25s; }
            .module-card:nth-child(5) { animation-delay: 0.3s; }
            .module-card:nth-child(6) { animation-delay: 0.35s; }

            @keyframes moduleEntrance {
                from {
                    opacity: 0;
                    transform: translateX(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            /* Smooth scrolling */
            html {
                scroll-behavior: smooth;
            }

            /* Tooltip animations */
            [title]:hover::after {
                animation: tooltipFade 0.2s ease;
            }

            @keyframes tooltipFade {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    },

    enhanceQuizzes() {
        const mainContent = document.querySelector('.adaptive-content, .shell, main');
        if (mainContent) {
            mainContent.classList.add('fade-in');
        }

        this.enhanceSubmitButtons();
    },

    enhanceSubmitButtons() {
        document.addEventListener('click', (e) => {
            const submitBtn = e.target.closest('.submit-btn, .check-button, .btn-primary');
            if (submitBtn) {
                submitBtn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    submitBtn.style.transform = '';
                }, 150);
            }
        });
    },

    transitionQuiz(callback) {
        const quizContainer = document.querySelector('.quiz-container, .unit-content');
        if (quizContainer) {
            quizContainer.classList.add('changing');
            setTimeout(() => {
                if (callback) callback();
                quizContainer.classList.remove('changing');
            }, 300);
        } else {
            if (callback) callback();
        }
    },

    animateCounter(element, start, end, duration = 1000) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.round(current) + (element.textContent.includes('%') ? '%' : '');
        }, 16);
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => QuizAnimations.init());
} else {
    QuizAnimations.init();
}

if (typeof window !== 'undefined') {
    window.QuizAnimations = QuizAnimations;
}
