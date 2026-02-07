(function initAdvancedBackgroundCustomizer() {
  const customizer = {
    currentBackground: null,
    tempWallpaper: null,

    gradientPresets: [
      { name: 'Ocean Breeze', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
      { name: 'Sunset Glow', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
      { name: 'Forest Mist', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
      { name: 'Purple Dream', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
      { name: 'Warm Flame', gradient: 'linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)' },
      { name: 'Cool Blues', gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' },
      { name: 'Peachy', gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
      { name: 'Northern Lights', gradient: 'linear-gradient(135deg, #00d2ff 0%, #928dab 100%)' },
      { name: 'Cherry Blossom', gradient: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)' },
      { name: 'Emerald Water', gradient: 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)' },
      { name: 'Midnight City', gradient: 'linear-gradient(135deg, #232526 0%, #414345 100%)' },
      { name: 'Cosmic Fusion', gradient: 'linear-gradient(135deg, #ff00cc 0%, #333399 100%)' },
      { name: 'Desert Sand', gradient: 'linear-gradient(135deg, #ffe259 0%, #ffa751 100%)' },
      { name: 'Royal', gradient: 'linear-gradient(135deg, #141e30 0%, #243b55 100%)' },
      { name: 'Mint Fresh', gradient: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)' },
      { name: 'Sunrise', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
      { name: 'Deep Sea', gradient: 'linear-gradient(135deg, #2e3192 0%, #1bffff 100%)' },
      { name: 'Cotton Candy', gradient: 'linear-gradient(135deg, #ffeaa7 0%, #fd79a8 100%)' },
      { name: 'Lush', gradient: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)' },
      { name: 'Crimson Tide', gradient: 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)' },
      { name: 'Clean White', gradient: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)' },
      { name: 'Soft Pink', gradient: 'linear-gradient(135deg, #ffeef8 0%, #ffe5f1 100%)' },
      { name: 'Light Blue', gradient: 'linear-gradient(135deg, #e3f5ff 0%, #d6ecff 100%)' },
      { name: 'Cream', gradient: 'linear-gradient(135deg, #fff8e7 0%, #fff0d6 100%)' }
    ],

    solidColors: [
      { name: 'Pure White', color: '#ffffff' },
      { name: 'Light Gray', color: '#f5f6f8' },
      { name: 'Soft Cream', color: '#faf9f6' },
      { name: 'Pale Blue', color: '#e8f4f8' },
      { name: 'Light Pink', color: '#fce8f3' },
      { name: 'Mint', color: '#e8f8f5' },
      { name: 'Lavender', color: '#f0e8f8' },
      { name: 'Peach', color: '#fff5ee' }
    ],

    quickWallpapers: [
      { name: 'Mountains', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80' },
      { name: 'Ocean', url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1920&q=80' },
      { name: 'Forest', url: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=1920&q=80' },
      { name: 'Abstract', url: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=1920&q=80' },
      { name: 'Space', url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80' },
      { name: 'Flowers', url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1920&q=80' }
    ],

    loadBackground: function() {
      const saved = localStorage.getItem('custom-background');
      if (saved) {
        return JSON.parse(saved);
      }
      return {
        type: 'gradient',
        value: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
        opacity: 1
      };
    },

    saveBackground: function(background) {
      localStorage.setItem('custom-background', JSON.stringify(background));
      this.currentBackground = background;
    },

    applyBackground: function(background) {
      const body = document.body;
      
      body.style.backgroundImage = '';
      body.style.backgroundColor = '';
      
      switch(background.type) {
        case 'gradient':
          body.style.backgroundImage = background.value;
          body.style.backgroundAttachment = 'fixed';
          body.style.backgroundSize = 'cover';
          break;
        
        case 'solid':
          body.style.backgroundColor = background.value;
          break;
        
        case 'image':
          body.style.backgroundImage = `url(${background.value})`;
          body.style.backgroundAttachment = 'fixed';
          body.style.backgroundSize = 'cover';
          body.style.backgroundPosition = 'center';
          body.style.backgroundRepeat = 'no-repeat';
          break;
      }

      // Always update opacity overlay
      this.updateOpacityOverlay(background.opacity);
    },

    updateOpacityOverlay: function(opacity) {
      let overlay = document.getElementById('bg-opacity-overlay');
      
      if (opacity >= 1) {
        // Full opacity - remove overlay
        if (overlay) overlay.remove();
        return;
      }
      
      // Create or update overlay
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'bg-opacity-overlay';
        overlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: white;
          pointer-events: none;
          z-index: 0;
          transition: opacity 0.3s ease;
        `;
        document.body.appendChild(overlay);
      }
      overlay.style.opacity = (1 - opacity).toString();
    },

    showCustomizer: function() {
      if (document.getElementById('bg-customizer-modal')) return;

      const modal = document.createElement('div');
      modal.id = 'bg-customizer-modal';
      modal.className = 'background-customizer-modal';
      modal.innerHTML = this.generateModalHTML();

      this.injectStyles();
      document.body.appendChild(modal);
      
      setTimeout(() => {
        this.setupTabs();
        this.setupEventListeners();
        this.setupDragAndDrop();
        this.loadCurrentOpacity();
      }, 50);
    },

    generateModalHTML: function() {
      return `
        <div class="bg-customizer-overlay" onclick="document.getElementById('bg-customizer-modal').remove()"></div>
        <div class="bg-customizer-panel">
          <div class="bg-customizer-header">
            <h2 style="margin: 0; color: #0097b2; display: flex; align-items: center; gap: 12px;">
              <span>🎨</span>
              <span>Background Customizer</span>
            </h2>
            <button onclick="document.getElementById('bg-customizer-modal').remove()" style="background: none; border: none; font-size: 32px; cursor: pointer; color: #999; line-height: 1; padding: 0; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.2s ease;" onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='none'">×</button>
          </div>

          <div class="bg-customizer-tabs">
            <button class="bg-tab active" data-tab="gradients">Gradients</button>
            <button class="bg-tab" data-tab="solid">Solid Colors</button>
            <button class="bg-tab" data-tab="custom">Custom Gradient</button>
            <button class="bg-tab" data-tab="wallpaper">Upload Wallpaper</button>
          </div>

          <div class="bg-customizer-content">
            ${this.generateGradientsTab()}
            ${this.generateSolidColorsTab()}
            ${this.generateCustomGradientTab()}
            ${this.generateWallpaperTab()}
          </div>

          ${this.generateOpacityControl()}
          ${this.generateActionButtons()}
        </div>
      `;
    },

    generateGradientsTab: function() {
      return `
        <div class="bg-tab-content active" data-content="gradients">
          <div class="bg-presets-grid">
            ${this.gradientPresets.map(preset => `
              <div class="bg-preset-card" onclick="customizer.setGradient('${preset.gradient.replace(/'/g, "\\'")}')">
                <div class="bg-preset-preview" style="background: ${preset.gradient};"></div>
                <div class="bg-preset-name">${preset.name}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    },

    generateSolidColorsTab: function() {
      return `
        <div class="bg-tab-content" data-content="solid">
          <div class="bg-colors-grid">
            ${this.solidColors.map(color => `
              <div class="bg-color-card" onclick="customizer.setSolidColor('${color.color}')">
                <div class="bg-color-preview" style="background: ${color.color};"></div>
                <div class="bg-color-name">${color.name}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    },

    generateCustomGradientTab: function() {
      return `
        <div class="bg-tab-content" data-content="custom">
          <div class="custom-gradient-builder">
            <h3 style="color: #0097b2; margin-bottom: 20px;">Create Your Custom Gradient</h3>
            
            <div class="gradient-preview" id="gradientPreview" style="height: 200px; border-radius: 12px; margin-bottom: 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"></div>

            <div class="gradient-controls">
              <div class="control-group">
                <label>Color 1</label>
                <div style="display: flex; gap: 12px; align-items: center;">
                  <input type="color" id="color1" value="#667eea" onchange="customizer.updateGradientPreview()" style="width: 60px; height: 40px; border: 2px solid #ddd; border-radius: 8px; cursor: pointer;">
                  <input type="text" id="color1Text" value="#667eea" onchange="customizer.updateGradientPreview()" style="flex: 1; padding: 10px; border: 2px solid #ddd; border-radius: 8px; font-family: monospace;">
                </div>
              </div>

              <div class="control-group">
                <label>Color 2</label>
                <div style="display: flex; gap: 12px; align-items: center;">
                  <input type="color" id="color2" value="#764ba2" onchange="customizer.updateGradientPreview()" style="width: 60px; height: 40px; border: 2px solid #ddd; border-radius: 8px; cursor: pointer;">
                  <input type="text" id="color2Text" value="#764ba2" onchange="customizer.updateGradientPreview()" style="flex: 1; padding: 10px; border: 2px solid #ddd; border-radius: 8px; font-family: monospace;">
                </div>
              </div>

              <div class="control-group">
                <label>Direction (deg)</label>
                <input type="range" id="gradientAngle" min="0" max="360" value="135" onchange="customizer.updateGradientPreview()" style="width: 100%;">
                <div style="text-align: center; color: #666; margin-top: 8px;"><span id="angleValue">135</span>°</div>
              </div>

              <button onclick="customizer.applyCustomGradient()" style="width: 100%; padding: 14px; background: linear-gradient(135deg, #0097b2 0%, #00b4d8 100%); color: white; border: none; border-radius: 8px; font-weight: 600; font-size: 16px; cursor: pointer; margin-top: 16px; transition: transform 0.2s ease;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                Apply Custom Gradient
              </button>
            </div>
          </div>
        </div>
      `;
    },

    generateWallpaperTab: function() {
      return `
        <div class="bg-tab-content" data-content="wallpaper">
          <div class="wallpaper-upload-section">
            <h3 style="color: #0097b2; margin-bottom: 20px;">Upload Your Wallpaper</h3>
            
            <div class="upload-area" id="uploadArea" onclick="document.getElementById('wallpaperInput').click()" style="border: 3px dashed #ddd; border-radius: 12px; padding: 60px 40px; text-align: center; cursor: pointer; transition: all 0.3s ease; background: #f8f9fa;">
              <div style="font-size: 64px; margin-bottom: 16px;">📁</div>
              <div style="font-size: 18px; font-weight: 600; color: #0097b2; margin-bottom: 8px;">Click to Upload</div>
              <div style="color: #666; font-size: 14px;">or drag and drop your image here</div>
              <div style="color: #999; font-size: 12px; margin-top: 12px;">Supports: JPG, PNG, GIF (Max 5MB)</div>
            </div>
            
            <input type="file" id="wallpaperInput" accept="image/*" style="display: none;" onchange="customizer.handleWallpaperUpload(event)">

            <div id="wallpaperPreview" style="margin-top: 24px; display: none;">
              <h4 style="color: #0097b2; margin-bottom: 12px;">Preview</h4>
              <div style="position: relative; height: 200px; border-radius: 12px; overflow: hidden; background-size: cover; background-position: center;" id="wallpaperPreviewImage"></div>
              <button onclick="customizer.applyWallpaper()" style="width: 100%; padding: 14px; background: linear-gradient(135deg, #0097b2 0%, #00b4d8 100%); color: white; border: none; border-radius: 8px; font-weight: 600; font-size: 16px; cursor: pointer; margin-top: 16px; transition: transform 0.2s ease;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
                Apply Wallpaper
              </button>
            </div>

            <div style="margin-top: 32px; padding-top: 24px; border-top: 2px solid #eee;">
              <h4 style="color: #0097b2; margin-bottom: 16px;">Quick Wallpapers</h4>
              <div class="quick-wallpapers-grid">
                ${this.quickWallpapers.map(wallpaper => `
                  <div class="quick-wallpaper-card" onclick="customizer.setImageBackground('${wallpaper.url}')">
                    <div class="quick-wallpaper-preview" style="background-image: url('${wallpaper.url}');"></div>
                    <div class="quick-wallpaper-name">${wallpaper.name}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      `;
    },

    generateOpacityControl: function() {
      return `
        <div class="bg-opacity-control">
          <label style="display: block; color: #0097b2; font-weight: 700; font-size: 16px; margin-bottom: 12px;">Background Opacity</label>
          <input type="range" id="bgOpacity" min="0" max="100" value="100" oninput="customizer.updateOpacity(this.value)" onchange="customizer.updateOpacity(this.value)" style="width: 100%; height: 8px; border-radius: 4px; cursor: pointer;">
          <div style="text-align: center; color: #1f2933; font-weight: 700; font-size: 16px; margin-top: 12px;"><span id="opacityValue">100</span>%</div>
        </div>
      `;
    },

    generateActionButtons: function() {
      return `
        <div class="bg-customizer-actions">
          <button onclick="customizer.resetBackground()" style="flex: 1; padding: 10px 20px; background: #f5f5f5; color: #1f2933; border: none; border-radius: 8px; font-weight: 700; font-size: 14px; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.05);" onmouseover="this.style.background='#e5e5e5'; this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.1)';" onmouseout="this.style.background='#f5f5f5'; this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.05)';">
            Reset to Default
          </button>
          <button onclick="document.getElementById('bg-customizer-modal').remove()" style="flex: 1; padding: 10px 20px; background: linear-gradient(135deg, #0097b2 0%, #00b4d8 100%); color: white; border: none; border-radius: 8px; font-weight: 700; font-size: 14px; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 4px 12px rgba(0,151,178,0.3);" onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 16px rgba(0,151,178,0.4)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(0,151,178,0.3)';">
            Done
          </button>
        </div>
      `;
    },

    setupTabs: function() {
      const tabs = document.querySelectorAll('.bg-tab');
      const contents = document.querySelectorAll('.bg-tab-content');

      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const targetTab = tab.getAttribute('data-tab');

          tabs.forEach(t => t.classList.remove('active'));
          contents.forEach(c => c.classList.remove('active'));

          tab.classList.add('active');
          document.querySelector(`[data-content="${targetTab}"]`).classList.add('active');
        });
      });
    },

    setupEventListeners: function() {
    },

    setupDragAndDrop: function() {
      const uploadArea = document.getElementById('uploadArea');
      if (!uploadArea) return;
      
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
        });
      });

      uploadArea.addEventListener('dragenter', () => {
        uploadArea.style.borderColor = '#0097b2';
        uploadArea.style.background = '#e8f4f8';
      });

      uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '#ddd';
        uploadArea.style.background = '#f8f9fa';
      });

      uploadArea.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files.length > 0) {
          this.processWallpaperFile(files[0]);
        }
        uploadArea.style.borderColor = '#ddd';
        uploadArea.style.background = '#f8f9fa';
      });
    },

    loadCurrentOpacity: function() {
      const opacitySlider = document.getElementById('bgOpacity');
      const opacityValue = document.getElementById('opacityValue');
      if (opacitySlider && opacityValue) {
        opacitySlider.value = this.currentBackground.opacity * 100;
        opacityValue.textContent = Math.round(this.currentBackground.opacity * 100);
      }
    },

    setGradient: function(gradient) {
      const background = {
        type: 'gradient',
        value: gradient,
        opacity: this.currentBackground ? this.currentBackground.opacity : 1
      };
      
      this.saveBackground(background);
      this.applyBackground(background);
      
      if (window.confetti) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    },

    setSolidColor: function(color) {
      const background = {
        type: 'solid',
        value: color,
        opacity: this.currentBackground ? this.currentBackground.opacity : 1
      };
      
      this.saveBackground(background);
      this.applyBackground(background);
    },

    updateGradientPreview: function() {
      const color1 = document.getElementById('color1').value;
      const color2 = document.getElementById('color2').value;
      const angle = document.getElementById('gradientAngle').value;

      document.getElementById('color1Text').value = color1;
      document.getElementById('color2Text').value = color2;
      document.getElementById('angleValue').textContent = angle;

      const gradient = `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 100%)`;
      document.getElementById('gradientPreview').style.background = gradient;
    },

    applyCustomGradient: function() {
      const color1 = document.getElementById('color1').value;
      const color2 = document.getElementById('color2').value;
      const angle = document.getElementById('gradientAngle').value;
      const gradient = `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 100%)`;
      
      this.setGradient(gradient);
    },

    handleWallpaperUpload: function(event) {
      const file = event.target.files[0];
      if (file) {
        this.processWallpaperFile(file);
      }
    },

    processWallpaperFile: function(file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file (JPG, PNG, GIF)');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        this.tempWallpaper = e.target.result;
        
        const preview = document.getElementById('wallpaperPreview');
        const previewImage = document.getElementById('wallpaperPreviewImage');
        
        if (preview && previewImage) {
          previewImage.style.backgroundImage = `url(${this.tempWallpaper})`;
          preview.style.display = 'block';
        }
      };
      reader.readAsDataURL(file);
    },

    applyWallpaper: function() {
      if (!this.tempWallpaper) return;

      const background = {
        type: 'image',
        value: this.tempWallpaper,
        opacity: this.currentBackground ? this.currentBackground.opacity : 1
      };
      
      this.saveBackground(background);
      this.applyBackground(background);
      
      if (window.confetti) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    },

    setImageBackground: function(url) {
      const background = {
        type: 'image',
        value: url,
        opacity: this.currentBackground ? this.currentBackground.opacity : 1
      };
      
      this.saveBackground(background);
      this.applyBackground(background);
    },

    updateOpacity: function(value) {
      const opacity = value / 100;
      document.getElementById('opacityValue').textContent = value;
      
      this.currentBackground.opacity = opacity;
      this.saveBackground(this.currentBackground);
      this.applyBackground(this.currentBackground);
    },

    resetBackground: function() {
      const background = {
        type: 'gradient',
        value: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
        opacity: 1
      };
      
      this.saveBackground(background);
      this.applyBackground(background);
      
      const opacitySlider = document.getElementById('bgOpacity');
      const opacityValue = document.getElementById('opacityValue');
      if (opacitySlider && opacityValue) {
        opacitySlider.value = 100;
        opacityValue.textContent = 100;
      }
    },

    injectStyles: function() {
      if (document.getElementById('background-customizer-styles')) return;

      const style = document.createElement('style');
      style.id = 'background-customizer-styles';
      style.textContent = `
        .background-customizer-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 10001;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .bg-customizer-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
        }

        .bg-customizer-panel {
          position: relative;
          background: white;
          width: 99%;
          max-width: 2400px;
          max-height: 99vh;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .bg-customizer-header {
          padding: 24px 32px;
          border-bottom: 2px solid #f0f0f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
        }

        .bg-customizer-tabs {
          display: flex;
          padding: 24px 48px 32px 48px;
          gap: 12px;
          border-bottom: 4px solid #0097b2;
          background: #fafafa;
          overflow-x: auto;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .bg-tab {
          padding: 10px 20px;
          border: none;
          background: white;
          color: #1f2933;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          font-size: 13px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .bg-tab:hover {
          background: #e8f4f8;
          color: #0097b2;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0,151,178,0.15);
        }

        .bg-tab.active {
          background: linear-gradient(135deg, #0097b2 0%, #00b4d8 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(0,151,178,0.3);
        }

        .bg-customizer-content {
          flex: 1;
          overflow-y: auto;
          padding: 48px 64px;
        }

        .bg-tab-content {
          display: none;
        }

        .bg-tab-content.active {
          display: block;
        }

        .bg-presets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 24px;
        }

        .bg-preset-card {
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .bg-preset-card:hover {
          transform: translateY(-4px);
        }

        .bg-preset-preview {
          height: 140px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          margin-bottom: 12px;
        }

        .bg-preset-name {
          text-align: center;
          font-size: 15px;
          font-weight: 700;
          color: #1f2933;
          line-height: 1.4;
        }

        .bg-colors-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 24px;
        }

        .bg-color-card {
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .bg-color-card:hover {
          transform: translateY(-4px);
        }

        .bg-color-preview {
          height: 80px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border: 2px solid #e0e0e0;
          margin-bottom: 8px;
        }

        .bg-color-name {
          text-align: center;
          font-size: 15px;
          font-weight: 700;
          color: #1f2933;
          line-height: 1.4;
        }

        .control-group {
          margin-bottom: 24px;
        }

        .control-group label {
          display: block;
          color: #0097b2;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .quick-wallpapers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 16px;
        }

        .quick-wallpaper-card {
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .quick-wallpaper-card:hover {
          transform: translateY(-4px);
        }

        .quick-wallpaper-preview {
          height: 100px;
          border-radius: 12px;
          background-size: cover;
          background-position: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          margin-bottom: 8px;
        }

        .quick-wallpaper-name {
          text-align: center;
          font-size: 15px;
          font-weight: 700;
          color: #1f2933;
          line-height: 1.4;
        }

        .bg-opacity-control {
          padding: 20px 32px;
          border-top: 2px solid #f0f0f0;
          background: #fafafa;
        }

        .bg-customizer-actions {
          padding: 20px 32px;
          border-top: 2px solid #f0f0f0;
          display: flex;
          gap: 12px;
        }

        .upload-area:hover {
          border-color: #0097b2;
          background: #e8f4f8;
        }
      `;

      document.head.appendChild(style);
    }
  };

  window.customizer = customizer;
  window.backgroundCustomizer = customizer;

  if (document.body) {
    customizer.currentBackground = customizer.loadBackground();
    customizer.applyBackground(customizer.currentBackground);
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      customizer.currentBackground = customizer.loadBackground();
      customizer.applyBackground(customizer.currentBackground);
    });
  }
})();