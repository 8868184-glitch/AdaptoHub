const RealWorldApplications = {
  careerMap: {
    'mathematics': {
      algebra: [
        { career: 'Software Engineer', industry: 'Tech', relevance: 'Essential for algorithms and data structures', salary: '$120k+' },
        { career: 'Data Analyst', industry: 'Finance', relevance: 'Used for statistical modeling', salary: '$85k+' },
        { career: 'Physicist', industry: 'Research', relevance: 'Foundation for mathematical analysis', salary: '$100k+' }
      ],
      calculus: [
        { career: 'Engineer', industry: 'Manufacturing', relevance: 'Optimization and design calculations', salary: '$95k+' },
        { career: 'Economist', industry: 'Finance', relevance: 'Economic modeling and forecasting', salary: '$110k+' },
        { career: 'Machine Learning Engineer', industry: 'AI/Tech', relevance: 'Core to gradient descent algorithms', salary: '$150k+' }
      ],
      statistics: [
        { career: 'Business Analyst', industry: 'Consulting', relevance: 'Data-driven decision making', salary: '$90k+' },
        { career: 'Biostatistician', industry: 'Healthcare', relevance: 'Clinical trial analysis', salary: '$95k+' },
        { career: 'Insurance Actuary', industry: 'Insurance', relevance: 'Risk assessment and pricing', salary: '$120k+' }
      ]
    },
    'science': {
      physics: [
        { career: 'Software Engineer', industry: 'Game Development', relevance: 'Physics engines for realistic motion', salary: '$130k+' },
        { career: 'Aerospace Engineer', industry: 'Space', relevance: 'Critical for rocket design', salary: '$110k+' },
        { career: 'Renewable Energy Engineer', industry: 'Green Energy', relevance: 'Solar and wind power optimization', salary: '$100k+' }
      ],
      chemistry: [
        { career: 'Chemical Engineer', industry: 'Manufacturing', relevance: 'Process design and optimization', salary: '$105k+' },
        { career: 'Pharmacist', industry: 'Healthcare', relevance: 'Drug formulation and interactions', salary: '$125k+' },
        { career: 'Environmental Scientist', industry: 'Environment', relevance: 'Pollution analysis and remediation', salary: '$80k+' }
      ],
      biology: [
        { career: 'Biomedical Engineer', industry: 'Healthcare', relevance: 'Medical device design', salary: '$110k+' },
        { career: 'Genetic Counselor', industry: 'Healthcare', relevance: 'Understanding genetic conditions', salary: '$75k+' },
        { career: 'Conservation Biologist', industry: 'Environment', relevance: 'Ecosystem preservation', salary: '$70k+' }
      ]
    }
  },

  caseStudies: [
    {
      id: 'case-001',
      title: 'How Netflix Uses Algorithms (Algebra)',
      subject: 'mathematics',
      topic: 'algebra',
      overview: 'Netflix\'s recommendation system uses algebraic equations to predict what you\'ll watch.',
      challenge: 'Process millions of user preferences to make personalized recommendations.',
      solution: 'Uses matrix factorization and collaborative filtering algorithms.',
      impact: 'Increased user engagement by 40%, reduced content discovery time.',
      companies: ['Netflix', 'Amazon Prime', 'YouTube'],
      readTime: '5 min'
    },
    {
      id: 'case-002',
      title: 'SpaceX Rocket Trajectory (Physics)',
      subject: 'science',
      topic: 'physics',
      overview: 'Using Newton\'s laws to design rockets that reach orbit and land safely.',
      challenge: 'Calculate precise thrust vectors and trajectories for orbital mechanics.',
      solution: 'Apply calculus and physics to model rocket motion in 3D space.',
      impact: 'Reusable rockets reduced launch costs by 90%.',
      companies: ['SpaceX', 'Blue Origin', 'NASA'],
      readTime: '7 min'
    },
    {
      id: 'case-003',
      title: 'COVID-19 Vaccine Development (Chemistry)',
      subject: 'science',
      topic: 'chemistry',
      overview: 'How mRNA vaccines use chemistry to train immune systems.',
      challenge: 'Design stable, effective vaccine molecules that survive storage.',
      solution: 'Optimize lipid nanoparticle chemistry to deliver genetic material.',
      impact: 'Vaccines developed 10x faster than traditional methods.',
      companies: ['Moderna', 'Pfizer', 'BioNTech'],
      readTime: '6 min'
    }
  ],

  expertVideos: [
    {
      id: 'expert-001',
      title: 'Elon Musk on Physics in Rocket Design',
      expert: 'Elon Musk',
      company: 'SpaceX',
      topic: 'Physics & Engineering',
      duration: '8:32',
      youtubeId: 'placeholder1',
      description: 'Learn how physics principles directly apply to building reusable rockets.'
    },
    {
      id: 'expert-002',
      title: 'Data Science at Google',
      expert: 'Andrew Ng',
      company: 'Google',
      topic: 'Mathematics & Computer Science',
      duration: '12:45',
      youtubeId: 'placeholder2',
      description: 'How algebra and statistics power Google\'s search algorithms.'
    },
    {
      id: 'expert-003',
      title: 'Pharmaceutical Chemistry in Action',
      expert: 'Dr. Jennifer Doudna',
      company: 'UC Berkeley',
      topic: 'Chemistry & Biotechnology',
      duration: '9:50',
      youtubeId: 'placeholder3',
      description: 'Behind-the-scenes look at developing life-saving medications.'
    }
  ],

  init() {
    this.setupCareerMapper();
    this.setupCaseStudies();
    this.setupExpertVideos();
    this.loadUserProgress();
    console.log('✓ Real-World Applications initialized');
  },

  setupCareerMapper() {
    window.openCareerMapper = (subject, topic) => {
      const careers = this.careerMap[subject]?.[topic] || [];

      if (careers.length === 0) {
        alert('No career data available for this topic');
        return;
      }

      const modal = document.createElement('div');
      modal.className = 'realworld-modal';
      modal.id = 'career-mapper-modal';
      modal.innerHTML = `
        <div class="realworld-modal-content">
          <button class="realworld-close-btn" onclick="document.getElementById('career-mapper-modal').remove()">✕</button>
          
          <div class="career-mapper-header">
            <h2>💼 Career Opportunities</h2>
            <p class="mapper-subtitle">${subject.charAt(0).toUpperCase() + subject.slice(1)} → ${topic.charAt(0).toUpperCase() + topic.slice(1)}</p>
          </div>

          <div class="careers-grid">
            ${careers.map(career => `
              <div class="career-card">
                <div class="career-header">
                  <h3>${career.career}</h3>
                  <span class="industry-badge">${career.industry}</span>
                </div>
                <p class="career-relevance">📌 ${career.relevance}</p>
                <p class="career-salary">💰 Average: ${career.salary}</p>
                <button class="explore-btn" onclick="RealWorldApplications.exploreCareePath('${career.career}')">
                  Explore Path →
                </button>
              </div>
            `).join('')}
          </div>

          <div class="career-stats">
            <h3>📊 Industry Insights</h3>
            <p>Professionals in these fields grow at 15-25% annually</p>
            <p>Average years to mastery: 4-7 years</p>
            <button class="stat-btn" onclick="RealWorldApplications.showCareerPathway()">View Career Pathway</button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      setTimeout(() => modal.classList.add('active'), 10);
    };
  },

  setupCaseStudies() {
    window.openCaseStudy = (caseId) => {
      const caseStudy = this.caseStudies.find(c => c.id === caseId);

      if (!caseStudy) {
        alert('Case study not found');
        return;
      }

      const modal = document.createElement('div');
      modal.className = 'realworld-modal';
      modal.id = 'case-study-modal';
      modal.innerHTML = `
        <div class="realworld-modal-content case-study-wrapper">
          <button class="realworld-close-btn" onclick="document.getElementById('case-study-modal').remove()">✕</button>
          
          <div class="case-header">
            <h2>${caseStudy.title}</h2>
            <div class="case-meta">
              <span class="read-time">⏱️ ${caseStudy.readTime} read</span>
              <span class="case-subject">${caseStudy.subject}</span>
            </div>
          </div>

          <div class="case-content">
            <section class="case-section">
              <h3>Overview</h3>
              <p>${caseStudy.overview}</p>
            </section>

            <section class="case-section">
              <h3>🎯 The Challenge</h3>
              <p>${caseStudy.challenge}</p>
            </section>

            <section class="case-section">
              <h3>💡 The Solution</h3>
              <p>${caseStudy.solution}</p>
            </section>

            <section class="case-section">
              <h3>📈 Real-World Impact</h3>
              <p>${caseStudy.impact}</p>
            </section>

            <section class="case-section">
              <h3>🏢 Companies Using This</h3>
              <div class="company-tags">
                ${caseStudy.companies.map(company => `
                  <span class="company-tag">${company}</span>
                `).join('')}
              </div>
            </section>
          </div>

          <div class="case-actions">
            <button class="action-btn" onclick="RealWorldApplications.saveForLater('${caseStudy.id}')">💾 Save for Later</button>
            <button class="action-btn" onclick="RealWorldApplications.shareCase('${caseStudy.id}')">🔗 Share</button>
            <button class="action-btn" onclick="RealWorldApplications.markCaseRead('${caseStudy.id}')">✓ Mark as Read</button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      setTimeout(() => modal.classList.add('active'), 10);
    };
  },

  setupExpertVideos() {
    window.openExpertVideo = (videoId) => {
      const video = this.expertVideos.find(v => v.id === videoId);

      if (!video) {
        alert('Expert video not found');
        return;
      }

      const modal = document.createElement('div');
      modal.className = 'realworld-modal';
      modal.id = 'expert-video-modal';
      modal.innerHTML = `
        <div class="realworld-modal-content expert-video-wrapper">
          <button class="realworld-close-btn" onclick="document.getElementById('expert-video-modal').remove()">✕</button>
          
          <div class="expert-header">
            <h2>${video.title}</h2>
            <div class="expert-info">
              <div class="expert-avatar">👤</div>
              <div class="expert-details">
                <p class="expert-name">${video.expert}</p>
                <p class="expert-company">${video.company}</p>
              </div>
            </div>
          </div>

          <div class="video-container">
            <iframe 
              width="100%" 
              height="400" 
              src="https://www.youtube.com/embed/${video.youtubeId}" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen>
            </iframe>
          </div>

          <div class="video-details">
            <p class="video-description">${video.description}</p>
            <div class="video-metadata">
              <span class="duration">⏱️ ${video.duration}</span>
              <span class="topic-badge">${video.topic}</span>
            </div>
          </div>

          <div class="expert-actions">
            <button class="action-btn" onclick="RealWorldApplications.connectWithExpert('${video.expert}')">💬 Connect</button>
            <button class="action-btn" onclick="RealWorldApplications.bookmarkExpert('${video.id}')">🔖 Bookmark</button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      setTimeout(() => modal.classList.add('active'), 10);
    };
  },

  exploreCareePath(careerName) {
    const pathModal = document.createElement('div');
    pathModal.className = 'realworld-modal';
    pathModal.innerHTML = `
      <div class="realworld-modal-content">
        <h3>${careerName} - Career Pathway</h3>
        <div style="text-align: center; padding: 20px;">
          <p>📚 Year 1-2: Foundations</p>
          <p style="color: #999; font-size: 0.9rem;">Master core concepts in ${careerName}</p>
          <hr style="margin: 15px 0; border: 1px solid #ddd;">
          <p>🎓 Year 3-4: Specialization</p>
          <p style="color: #999; font-size: 0.9rem;">Advanced techniques and real projects</p>
          <hr style="margin: 15px 0; border: 1px solid #ddd;">
          <p>💼 Year 5+: Expertise</p>
          <p style="color: #999; font-size: 0.9rem;">Industry positions and leadership roles</p>
          <button onclick="this.parentElement.parentElement.parentElement.remove()" style="margin-top: 20px; padding: 10px 20px; background: #0097b2; color: white; border: none; border-radius: 6px; cursor: pointer;">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(pathModal);
    setTimeout(() => pathModal.classList.add('active'), 10);
  },

  showCareerPathway() {
    alert('Career Pathway:\n\n1. Master Fundamentals (Year 1-2)\n2. Gain Practical Experience (Year 3-4)\n3. Specialize & Lead (Year 5+)\n\nAverage time to first role: 2-4 years');
  },

  saveForLater(caseId) {
    const saved = JSON.parse(localStorage.getItem('saved-case-studies') || '[]');
    if (!saved.includes(caseId)) {
      saved.push(caseId);
      localStorage.setItem('saved-case-studies', JSON.stringify(saved));
      alert('✓ Saved for later!');
    }
  },

  shareCase(caseId) {
    const caseStudy = this.caseStudies.find(c => c.id === caseId);
    const shareUrl = `${window.location.origin}?case=${caseId}`;
    alert(`Share this: ${shareUrl}`);
  },

  markCaseRead(caseId) {
    const read = JSON.parse(localStorage.getItem('read-case-studies') || '[]');
    if (!read.includes(caseId)) {
      read.push(caseId);
      localStorage.setItem('read-case-studies', JSON.stringify(read));
      alert('✓ Marked as read!');
    }
  },

  connectWithExpert(expertName) {
    alert(`Connect with ${expertName}\n\nFeature: Send a direct message to discuss their insights and career path.`);
  },

  bookmarkExpert(videoId) {
    const bookmarked = JSON.parse(localStorage.getItem('bookmarked-experts') || '[]');
    if (!bookmarked.includes(videoId)) {
      bookmarked.push(videoId);
      localStorage.setItem('bookmarked-experts', JSON.stringify(bookmarked));
      alert('✓ Bookmarked!');
    }
  },

  loadUserProgress() {
    const savedCases = JSON.parse(localStorage.getItem('saved-case-studies') || '[]');
    const readCases = JSON.parse(localStorage.getItem('read-case-studies') || '[]');
    console.log(`Saved: ${savedCases.length} cases, Read: ${readCases.length} cases`);
  }
};

const realworldStyles = `
  .realworld-modal {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .realworld-modal.active {
    opacity: 1;
  }

  .realworld-modal-content {
    background: white;
    border-radius: 12px;
    max-width: 850px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    padding: 30px;
    position: relative;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  }

  .realworld-close-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    background: #f5f5f5;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    cursor: pointer;
    font-size: 24px;
    transition: all 0.2s;
  }

  .realworld-close-btn:hover {
    background: #e0e0e0;
    transform: rotate(90deg);
  }

  .career-mapper-header {
    margin-bottom: 30px;
  }

  .mapper-subtitle {
    color: #999;
    font-size: 0.95rem;
    margin: 5px 0 0 0;
  }

  .careers-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin: 30px 0;
  }

  .career-card {
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    padding: 20px;
    transition: all 0.3s;
  }

  .career-card:hover {
    border-color: #0097b2;
    box-shadow: 0 5px 15px rgba(0, 151, 178, 0.2);
    transform: translateY(-5px);
  }

  .career-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 15px;
  }

  .career-header h3 {
    margin: 0;
    color: #1f2933;
  }

  .industry-badge {
    background: #0097b2;
    color: white;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
  }

  .career-relevance {
    color: #666;
    font-size: 0.9rem;
    margin: 10px 0;
  }

  .career-salary {
    color: #4caf50;
    font-weight: 600;
    margin: 10px 0;
  }

  .explore-btn {
    width: 100%;
    padding: 10px;
    background: #f5f5f5;
    border: 2px solid #0097b2;
    color: #0097b2;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
  }

  .explore-btn:hover {
    background: #0097b2;
    color: white;
  }

  .career-stats {
    background: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    margin-top: 20px;
  }

  .stat-btn {
    width: 100%;
    padding: 12px;
    background: #0097b2;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    margin-top: 15px;
    transition: all 0.2s;
  }

  .stat-btn:hover {
    background: #007a95;
  }

  .case-header {
    margin-bottom: 30px;
  }

  .case-meta {
    display: flex;
    gap: 15px;
    margin-top: 10px;
    font-size: 0.9rem;
    color: #999;
  }

  .case-content {
    margin: 30px 0;
  }

  .case-section {
    margin-bottom: 25px;
  }

  .case-section h3 {
    color: #0097b2;
    margin-bottom: 10px;
  }

  .case-section p {
    color: #666;
    line-height: 1.6;
  }

  .company-tags {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 10px;
  }

  .company-tag {
    background: #f5f5f5;
    border: 1px solid #0097b2;
    color: #0097b2;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
  }

  .case-actions {
    display: flex;
    gap: 10px;
    margin-top: 30px;
    flex-wrap: wrap;
  }

  .action-btn {
    flex: 1;
    min-width: 120px;
    padding: 12px;
    background: #f5f5f5;
    border: 2px solid #0097b2;
    color: #0097b2;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
  }

  .action-btn:hover {
    background: #0097b2;
    color: white;
  }

  .expert-header {
    margin-bottom: 25px;
  }

  .expert-info {
    display: flex;
    gap: 15px;
    align-items: center;
    margin-top: 15px;
  }

  .expert-avatar {
    font-size: 3rem;
    width: 60px;
    height: 60px;
    background: #f0f0f0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .expert-details p {
    margin: 0;
  }

  .expert-name {
    font-weight: 600;
    color: #1f2933;
  }

  .expert-company {
    color: #999;
    font-size: 0.9rem;
  }

  .video-container {
    margin: 25px 0;
    border-radius: 8px;
    overflow: hidden;
  }

  .video-details {
    background: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    margin: 20px 0;
  }

  .video-description {
    color: #666;
    line-height: 1.6;
    margin: 0 0 15px 0;
  }

  .video-metadata {
    display: flex;
    gap: 15px;
    font-size: 0.9rem;
  }

  .topic-badge {
    background: #0097b2;
    color: white;
    padding: 4px 10px;
    border-radius: 20px;
    font-weight: 600;
  }

  .expert-actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
  }
`;

if (!document.getElementById('realworld-styles')) {
  const styleTag = document.createElement('style');
  styleTag.id = 'realworld-styles';
  styleTag.textContent = realworldStyles;
  document.head.appendChild(styleTag);
}

document.addEventListener('DOMContentLoaded', () => {
  RealWorldApplications.init();
});

console.log('✓ Real-World Applications module loaded');