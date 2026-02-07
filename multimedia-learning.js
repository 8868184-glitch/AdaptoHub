const MultimediaLearning = {
  videoDatabase: {
    mathematics: {
      algebra: [
        {
          id: 'alg-001',
          title: 'Solving Linear Equations',
          description: 'Learn how to solve linear equations step by step',
          youtubeId: 'dQw4w9WgXcQ', // Placeholder
          duration: '8:32',
          difficulty: 'Beginner',
          transcript: 'Linear equations are equations where the variable has a power of 1...'
        },
        {
          id: 'alg-002',
          title: 'Quadratic Formula Explained',
          description: 'Master the quadratic formula with real examples',
          youtubeId: 'sEtqOFKS3gQ',
          duration: '12:45',
          difficulty: 'Intermediate',
          transcript: 'The quadratic formula is used to solve quadratic equations...'
        }
      ],
      calculus: [
        {
          id: 'calc-001',
          title: 'Understanding Derivatives',
          description: 'Visualizing the concept of derivatives',
          youtubeId: 'ZuD0DhKsxGg',
          duration: '15:20',
          difficulty: 'Intermediate',
          transcript: 'A derivative represents the rate of change...'
        }
      ]
    },
    science: {
      physics: [
        {
          id: 'phys-001',
          title: 'Newton\'s Laws of Motion',
          description: 'Interactive explanation of Newton\'s three laws',
          youtubeId: 'kKKM8Y-u7f4',
          duration: '10:15',
          difficulty: 'Beginner',
          transcript: 'Newton\'s first law states that an object in motion...'
        }
      ],
      chemistry: [
        {
          id: 'chem-001',
          title: 'Chemical Bonds Explained',
          description: 'Understand ionic and covalent bonds visually',
          youtubeId: 'XIfYqLFbJ2s',
          duration: '9:50',
          difficulty: 'Beginner',
          transcript: 'Chemical bonds are forces that hold atoms together...'
        }
      ]
    }
  },

  simulations: {
    'gravity-simulator': {
      name: 'Gravity Simulator',
      description: 'Visualize gravitational forces between objects',
      category: 'Physics',
      instructions: 'Click and drag to create objects. Watch gravity in action!'
    },
    'equation-solver': {
      name: 'Equation Solver Visualizer',
      description: 'See algebraic equation solving step-by-step',
      category: 'Mathematics',
      instructions: 'Enter an equation and watch it solve itself visually'
    },
    'molecular-builder': {
      name: 'Molecular Structure Builder',
      description: 'Build and visualize molecular structures',
      category: 'Chemistry',
      instructions: 'Drag atoms to create molecules. See the 3D structure!'
    }
  },

  init() {
    this.setupVideoPlayer();
    this.setupSimulationTriggers();
    this.setupAudioPlayer();
    this.loadUserPreferences();
    console.log('✓ Multimedia Learning initialized');
  },

  setupVideoPlayer() {
    const videoDB = this.videoDatabase;

    window.openVideoPlayer = (subject, topic, videoId) => {
      const videos = videoDB[subject]?.[topic] || [];
      const video = videos.find(v => v.id === videoId);

      if (!video) {
        alert('Video not found');
        return;
      }

      const modal = document.createElement('div');
      modal.className = 'multimedia-modal';
      modal.id = 'video-player-modal';
      modal.innerHTML = `
        <div class="multimedia-modal-content video-player-wrapper">
          <button class="multimedia-close-btn" onclick="document.getElementById('video-player-modal').remove()">✕</button>
          
          <div class="video-player-container">
            <iframe 
              width="100%" 
              height="500" 
              src="https://www.youtube.com/embed/${video.youtubeId}?autoplay=1" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen>
            </iframe>
          </div>

          <div class="video-details">
            <h2>${video.title}</h2>
            <div class="video-meta">
              <span class="duration">⏱️ ${video.duration}</span>
              <span class="difficulty" style="background: ${this.getDifficultyColor(video.difficulty)}">${video.difficulty}</span>
            </div>
            <p class="description">${video.description}</p>

            <div class="transcript-section">
              <button class="transcript-toggle" onclick="document.querySelector('.transcript-content').style.display = document.querySelector('.transcript-content').style.display === 'none' ? 'block' : 'none'">
                📄 View Transcript
              </button>
              <div class="transcript-content" style="display: none; margin-top: 15px; padding: 15px; background: #f5f5f5; border-radius: 8px; max-height: 300px; overflow-y: auto;">
                <p style="margin: 0; color: #666; line-height: 1.6;">${video.transcript}</p>
              </div>
            </div>

            <div class="video-actions">
              <button class="action-btn" onclick="MultimediaLearning.markVideoWatched('${video.id}')">✓ Mark as Watched</button>
              <button class="action-btn" onclick="MultimediaLearning.saveVideoNote('${video.id}')">📝 Add Note</button>
              <button class="action-btn" onclick="MultimediaLearning.downloadTranscript('${video.id}')">⬇️ Download Transcript</button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      setTimeout(() => modal.classList.add('active'), 10);

      this.trackVideoViewing(video.id, subject, topic);
    };
  },

  getDifficultyColor(difficulty) {
    const colors = {
      'Beginner': '#4caf50',
      'Intermediate': '#ff9800',
      'Advanced': '#f44336'
    };
    return colors[difficulty] || '#999';
  },

  setupSimulationTriggers() {
    window.openSimulation = (simulationId) => {
      const sim = this.simulations[simulationId];

      if (!sim) {
        alert('Simulation not found');
        return;
      }

      const modal = document.createElement('div');
      modal.className = 'multimedia-modal';
      modal.id = `sim-${simulationId}`;
      modal.innerHTML = `
        <div class="multimedia-modal-content simulation-wrapper">
          <button class="multimedia-close-btn" onclick="document.getElementById('sim-${simulationId}').remove()">✕</button>
          
          <h2>${sim.name}</h2>
          <p class="description">${sim.description}</p>
          
          <div class="simulation-canvas-container">
            <canvas id="simulation-canvas" width="600" height="500"></canvas>
          </div>

          <div class="simulation-controls">
            <p class="instructions">📋 ${sim.instructions}</p>
            <button class="control-btn" onclick="MultimediaLearning.resetSimulation('${simulationId}')">Reset Simulation</button>
            <button class="control-btn" onclick="MultimediaLearning.showSimulationTips('${simulationId}')">💡 Tips</button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      setTimeout(() => modal.classList.add('active'), 10);

      this.initializeSimulation(simulationId);
    };
  },

  initializeSimulation(simulationId) {
    const canvas = document.getElementById('simulation-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    switch (simulationId) {
      case 'gravity-simulator':
        this.initGravitySimulator(ctx, canvas);
        break;
      case 'equation-solver':
        this.initEquationSolver(ctx, canvas);
        break;
      case 'molecular-builder':
        this.initMolecularBuilder(ctx, canvas);
        break;
    }
  },

  initGravitySimulator(ctx, canvas) {
    const objects = [];
    const G = 0.1;

    function drawObject(obj) {
      ctx.fillStyle = obj.color;
      ctx.beginPath();
      ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
      ctx.fill();

      if (obj.trail) {
        ctx.strokeStyle = obj.color + '40';
        ctx.lineWidth = 1;
        ctx.beginPath();
        obj.trail.forEach((point, index) => {
          if (index === 0) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < objects.length; i++) {
        objects[i].ax = 0;
        objects[i].ay = 0;

        for (let j = 0; j < objects.length; j++) {
          if (i === j) continue;

          const dx = objects[j].x - objects[i].x;
          const dy = objects[j].y - objects[i].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance > 0) {
            const force = (G * objects[i].mass * objects[j].mass) / (distance * distance);
            objects[i].ax += force * dx / distance / objects[i].mass;
            objects[i].ay += force * dy / distance / objects[i].mass;
          }
        }
      }

      objects.forEach((obj) => {
        obj.vx += obj.ax;
        obj.vy += obj.ay;
        obj.x += obj.vx;
        obj.y += obj.vy;

        if (obj.x < 0) obj.x = canvas.width;
        if (obj.x > canvas.width) obj.x = 0;
        if (obj.y < 0) obj.y = canvas.height;
        if (obj.y > canvas.height) obj.y = 0;

        if (!obj.trail) obj.trail = [];
        obj.trail.push({ x: obj.x, y: obj.y });
        if (obj.trail.length > 50) obj.trail.shift();

        drawObject(obj);
      });

      requestAnimationFrame(animate);
    }

    objects.push({
      x: 150, y: 250, vx: 0, vy: 1, mass: 10, radius: 8, color: '#0097b2', ax: 0, ay: 0
    });
    objects.push({
      x: 450, y: 250, vx: 0, vy: -1, mass: 10, radius: 8, color: '#ff6b6b', ax: 0, ay: 0
    });

    canvas.onclick = (e) => {
      const rect = canvas.getBoundingClientRect();
      objects.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        mass: Math.random() * 5 + 5,
        radius: Math.random() * 5 + 5,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        ax: 0,
        ay: 0
      });
    };

    animate();
  },

  initEquationSolver(ctx, canvas) {
    const equation = '2x + 5 = 13';
    const steps = [
      { text: 'Original: 2x + 5 = 13', progress: 0 },
      { text: 'Subtract 5: 2x = 8', progress: 25 },
      { text: 'Divide by 2: x = 4', progress: 75 },
      { text: 'Solution: x = 4 ✓', progress: 100 }
    ];

    let currentStep = 0;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#1f2933';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';

      ctx.fillText(equation, canvas.width / 2, 50);

      ctx.font = '18px Arial';
      ctx.fillStyle = '#0097b2';
      ctx.fillText(steps[currentStep].text, canvas.width / 2, 150);

      ctx.fillStyle = '#e0e0e0';
      ctx.fillRect(50, canvas.height - 100, canvas.width - 100, 30);
      ctx.fillStyle = '#4caf50';
      ctx.fillRect(50, canvas.height - 100, (canvas.width - 100) * (steps[currentStep].progress / 100), 30);
    }

    canvas.onclick = () => {
      if (currentStep < steps.length - 1) {
        currentStep++;
        draw();
      } else {
        alert('Solution complete! x = 4');
      }
    };

    draw();
  },

  initMolecularBuilder(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#1f2933';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Molecular Builder - Click to add atoms', canvas.width / 2, 30);
    ctx.fillText('Hydrogen (H) • Carbon (C) • Oxygen (O) • Nitrogen (N)', canvas.width / 2, 60);
    ctx.fillText('Drag to bond atoms together', canvas.width / 2, 90);
  },

  setupAudioPlayer() {
    window.playAudioExplanation = (topic, audioUrl) => {
      const audioModal = document.createElement('div');
      audioModal.className = 'multimedia-modal';
      audioModal.id = 'audio-player-modal';
      audioModal.innerHTML = `
        <div class="multimedia-modal-content audio-player-wrapper">
          <button class="multimedia-close-btn" onclick="document.getElementById('audio-player-modal').remove()">✕</button>
          
          <div class="audio-player">
            <h2>🎙️ Audio Explanation</h2>
            <p class="topic-name">${topic}</p>
            
            <audio controls style="width: 100%; margin: 20px 0;">
              <source src="${audioUrl}" type="audio/mpeg">
              Your browser does not support the audio element.
            </audio>

            <div class="audio-features">
              <button class="audio-btn" onclick="MultimediaLearning.changePlaybackSpeed(0.75)">0.75x</button>
              <button class="audio-btn" onclick="MultimediaLearning.changePlaybackSpeed(1)">1x</button>
              <button class="audio-btn" onclick="MultimediaLearning.changePlaybackSpeed(1.25)">1.25x</button>
              <button class="audio-btn" onclick="MultimediaLearning.changePlaybackSpeed(1.5)">1.5x</button>
            </div>

            <div class="audio-transcript">
              <h3>📝 Transcript</h3>
              <p>Perfect for your commute! Listen while traveling or exercising.</p>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(audioModal);
      setTimeout(() => audioModal.classList.add('active'), 10);
    };
  },

  markVideoWatched(videoId) {
    const watched = JSON.parse(localStorage.getItem('watched-videos') || '[]');
    if (!watched.includes(videoId)) {
      watched.push(videoId);
      localStorage.setItem('watched-videos', JSON.stringify(watched));
      alert('✓ Marked as watched!');
    }
  },

  saveVideoNote(videoId) {
    const note = prompt('Add a note about this video:');
    if (note) {
      const notes = JSON.parse(localStorage.getItem('video-notes') || '{}');
      notes[videoId] = note;
      localStorage.setItem('video-notes', JSON.stringify(notes));
      alert('✓ Note saved!');
    }
  },

  downloadTranscript(videoId) {
    alert('Transcript download feature would save the transcript as a .txt file');
  },

  trackVideoViewing(videoId, subject, topic) {
    const viewing = JSON.parse(localStorage.getItem('video-viewing-analytics') || '{}');
    viewing[videoId] = {
      subject,
      topic,
      timestamp: new Date().toISOString(),
      duration: 0
    };
    localStorage.setItem('video-viewing-analytics', JSON.stringify(viewing));
  },

  resetSimulation(simulationId) {
    const canvas = document.getElementById('simulation-canvas');
    if (canvas) {
      canvas.remove();
      const newCanvas = document.createElement('canvas');
      newCanvas.id = 'simulation-canvas';
      newCanvas.width = 600;
      newCanvas.height = 500;
      canvas.parentNode.appendChild(newCanvas);
      this.initializeSimulation(simulationId);
    }
  },

  showSimulationTips(simulationId) {
    const tips = {
      'gravity-simulator': 'Try clicking at different positions. Larger objects have more mass!',
      'equation-solver': 'Click to see each step of the solution process.',
      'molecular-builder': 'Learn how atoms bond to form molecules!'
    };
    alert('💡 Tip: ' + (tips[simulationId] || 'Explore and experiment!'));
  },

  changePlaybackSpeed(speed) {
    const audio = document.querySelector('audio');
    if (audio) {
      audio.playbackRate = speed;
    }
  },

  loadUserPreferences() {
    const preferences = JSON.parse(localStorage.getItem('multimedia-preferences') || '{}');
    if (preferences.defaultPlaybackSpeed) {
    }
  }
};

const multimediaStyles = `
  .multimedia-modal {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .multimedia-modal.active {
    opacity: 1;
  }

  .multimedia-modal-content {
    background: white;
    border-radius: 12px;
    max-width: 800px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    padding: 30px;
    position: relative;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  }

  .multimedia-close-btn {
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
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .multimedia-close-btn:hover {
    background: #e0e0e0;
    transform: rotate(90deg);
  }

  .video-player-container {
    margin: 20px 0;
    border-radius: 8px;
    overflow: hidden;
  }

  .video-details {
    margin-top: 20px;
  }

  .video-meta {
    display: flex;
    gap: 10px;
    margin: 10px 0;
    align-items: center;
  }

  .duration {
    color: #666;
    font-size: 0.9rem;
  }

  .difficulty {
    color: white;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
  }

  .description {
    color: #666;
    margin: 10px 0;
    line-height: 1.6;
  }

  .transcript-section {
    margin: 20px 0;
    padding: 15px;
    background: #f9f9f9;
    border-radius: 8px;
  }

  .transcript-toggle {
    background: #0097b2;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
  }

  .transcript-toggle:hover {
    background: #007a95;
    transform: translateY(-2px);
  }

  .video-actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
    flex-wrap: wrap;
  }

  .action-btn {
    flex: 1;
    min-width: 120px;
    padding: 10px 15px;
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

  .simulation-canvas-container {
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
    margin: 20px 0;
  }

  .simulation-controls {
    background: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    margin-top: 20px;
  }

  .instructions {
    margin: 0 0 15px 0;
    color: #666;
    font-size: 0.95rem;
  }

  .control-btn {
    padding: 10px 15px;
    background: #0097b2;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    margin-right: 10px;
    font-weight: 600;
    transition: all 0.2s;
  }

  .control-btn:hover {
    background: #007a95;
    transform: translateY(-2px);
  }

  .audio-player {
    text-align: center;
  }

  .topic-name {
    font-size: 1.2rem;
    color: #0097b2;
    margin: 10px 0;
    font-weight: 600;
  }

  .audio-features {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin: 20px 0;
    flex-wrap: wrap;
  }

  .audio-btn {
    padding: 8px 15px;
    background: #f5f5f5;
    border: 2px solid #0097b2;
    color: #0097b2;
    border-radius: 20px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
  }

  .audio-btn:hover {
    background: #0097b2;
    color: white;
  }

  .audio-transcript {
    margin-top: 20px;
    padding: 15px;
    background: #f9f9f9;
    border-radius: 8px;
    text-align: left;
  }
`;

if (!document.getElementById('multimedia-styles')) {
  const styleTag = document.createElement('style');
  styleTag.id = 'multimedia-styles';
  styleTag.textContent = multimediaStyles;
  document.head.appendChild(styleTag);
}

document.addEventListener('DOMContentLoaded', () => {
  MultimediaLearning.init();
});

console.log('✓ Multimedia Learning module loaded');