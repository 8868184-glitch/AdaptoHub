function letterValue(char) {
  return char.charCodeAt(0) - 64;
}

function getInitials(str) {
  const words = (str || '').toString().trim().split(/\s+/);
  const initialsArray = words.map(word => word.charAt(0).toUpperCase());
  return initialsArray.join('');
}

function generateColor(initials, tr) {
  const chars = getInitials(initials)
  const v1 = chars[0] ? letterValue(chars[0]) : 0;
  const v2 = chars[1] ? letterValue(chars[1]) : 0;

  const hue = (v1 * 17 + v2 * 31) % 360;
  const saturation = 65;
  const lightness = 50;
  const transparency = 1 - tr;

  return `hsla(${hue}, ${saturation}%, ${lightness}%, ${transparency})`;
}

function checkAuthentication() {
  const user = localStorage.getItem('adaptohubUser');
  if (!user) {
    if (!window.location.pathname.includes('login.html')) {
      window.location.href = 'login.html';
    }
    return null;
  }
  return JSON.parse(user);
}

function initializeUser() {
  const user = checkAuthentication();
  if (!user) return;

  const account_name = user.fullName || (user.firstName ? (user.firstName + (user.lastName ? ' ' + user.lastName : '')) : '');
  const accountNameEl = document.getElementById("accountName");
  const avatar = document.getElementById("accountAvatar");
  
  if (accountNameEl && account_name) {
    accountNameEl.textContent = account_name;
    accountNameEl.style.cursor = 'pointer';
    accountNameEl.addEventListener('click', toggleAccountMenu);
  }
  
  if (avatar && account_name) {
    avatar.style.backgroundColor = generateColor(account_name, 0);
    avatar.textContent = getInitials(account_name);
  }

  if (avatar) {
    avatar.style.cursor = 'pointer';
    avatar.addEventListener('click', toggleAccountMenu);
  }

  const accountDisplay = document.querySelector('.account-display');
  if (accountDisplay && !document.getElementById('logoutBtnHeader')) {
    const logoutBtn = document.createElement('button');
    logoutBtn.id = 'logoutBtnHeader';
    logoutBtn.textContent = '🚪';
    logoutBtn.style.cssText = `
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 8px 12px;
      border-radius: 6px;
      transition: all 0.2s ease;
      margin-left: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
    `;
    
    logoutBtn.addEventListener('mouseenter', () => {
      logoutBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
      logoutBtn.style.transform = 'scale(1.1)';
    });
    
    logoutBtn.addEventListener('mouseleave', () => {
      logoutBtn.style.backgroundColor = 'transparent';
      logoutBtn.style.transform = 'scale(1)';
    });
    
    logoutBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      logout();
    });
    
    logoutBtn.title = 'ออกจากระบบ';
    accountDisplay.appendChild(logoutBtn);
  }
}

function toggleAccountMenu(e) {
  e && e.preventDefault();
  const existing = document.getElementById('accountMenu');
  if (existing) {
    closeAccountMenu();
  } else {
    showAccountMenu();
  }
}

function showAccountMenu() {
  if (document.getElementById('accountMenu')) return;

  const user = JSON.parse(localStorage.getItem('adaptohubUser') || '{}');
  
  let backdrop = document.getElementById('accountBackdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'accountBackdrop';
    backdrop.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.2);
      z-index: 10001;
    `;
    document.body.appendChild(backdrop);
  }

  let menu = document.getElementById('accountMenu');
  if (menu) {
    menu.remove();
  }

  menu = document.createElement('div');
  menu.id = 'accountMenu';
  menu.style.cssText = `
    position: fixed;
    top: 70px;
    right: 20px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 12px 36px rgba(0,0,0,0.18);
    min-width: 320px;
    z-index: 10002;
    animation: slideDown 0.18s ease;
    overflow: hidden;
  `;

  const allProfiles = getAllProfiles();
  const otherProfiles = allProfiles.filter(p => p.email !== user.email);

  const extraInfoRows = [];
  if (user.studentId) extraInfoRows.push(`<div style="font-size:0.9rem;color:#636d79;">รหัสนักเรียน: <strong style="color:#1f2933">${user.studentId}</strong></div>`);
  if (user.room) extraInfoRows.push(`<div style="font-size:0.9rem;color:#636d79;">ห้อง: <strong style="color:#1f2933">${user.room}</strong></div>`);
  if (user.seatNumber !== undefined && user.seatNumber !== null) extraInfoRows.push(`<div style="font-size:0.9rem;color:#636d79;">เลขที่: <strong style="color:#1f2933">${user.seatNumber}</strong></div>`);
  if (user.grade) extraInfoRows.push(`<div style="font-size:0.9rem;color:#636d79;">ระดับชั้น: <strong style="color:#1f2933">${user.grade}</strong></div>`);
  if (user.school) extraInfoRows.push(`<div style="font-size:0.9rem;color:#636d79;">โรงเรียน: <strong style="color:#1f2933">${user.school}</strong></div>`);
  if (user.authProvider) extraInfoRows.push(`<div style="font-size:0.85rem;color:#9aa4ab;margin-top:6px;">เข้าสู่ระบบด้วย: ${user.authProvider}</div>`);
  if (user.loginTime) extraInfoRows.push(`<div style="font-size:0.8rem;color:#a8b2ba;margin-top:6px;">เข้าสู่ระบบ: ${new Date(user.loginTime).toLocaleString('th-TH')}</div>`);

  menu.innerHTML = `
    <div style="padding: 18px; display:flex; gap:12px; align-items:center; border-bottom:1px solid #eef4f6;">
      <div style="
        width:56px;
        height:56px;
        background-color: ${generateColor(user.fullName || (user.firstName||''), 0)};
        border-radius:50%;
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:1.35rem;
        font-weight:700;
        color:#ffffff;
        box-shadow:0 4px 12px rgba(0,0,0,0.08);
      ">
        ${getInitials(user.fullName || (user.firstName||''))}
      </div>
      <div style="flex:1; min-width:0;">
        <div style="font-weight:700; color:#0f1724; font-size:1rem;">${user.fullName || user.firstName || 'Guest'}</div>
        <div style="font-size:0.9rem; color:#636d79; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${user.email || ''}</div>
        ${extraInfoRows.length ? `<div style="margin-top:8px;">${extraInfoRows.join('')}</div>` : ''}
      </div>
    </div>

    <div style="padding:12px; border-bottom:1px solid #eef4f6;">
      <button onclick="openProfileManager()" style="width:100%; padding:10px; border-radius:8px; border:1px solid #e6eef0; background:#fff; cursor:pointer; font-weight:600;">จัดการโปรไฟล์</button>
    </div>

    <div style="padding:12px;">
      <button onclick="signOutFromProfile()" style="width:100%; padding:10px; border-radius:8px; border:none; background:#f5f6f8; cursor:pointer; font-weight:600; color:#1f2933;">🔐 ออกจากบัญชี (พักการเชื่อมต่อ)</button>
      <div style="height:8px"></div>
      <button onclick="logout()" style="width:100%; padding:10px; border-radius:8px; border:none; background:#ff5252; cursor:pointer; font-weight:700; color:#fff;">🚪 ออกจากระบบทั้งหมด</button>
    </div>

    ${otherProfiles.length > 0 ? `
      <div style="padding:12px; border-top:1px solid #eef4f6;">
        <div style="font-size:0.85rem; color:#718096; font-weight:600; margin-bottom:8px;">โปรไฟล์อื่น</div>
        ${otherProfiles.map(profile => `
          <button onclick="switchProfile('${profile.email}')" style="display:flex; gap:10px; align-items:center; padding:8px 10px; width:100%; border-radius:8px; border:1px solid #f1f5f7; background:#fff; margin-bottom:8px; cursor:pointer;">
            <div style="width:40px;height:40px;border-radius:50%;background:${generateColor(profile.fullName,0)};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;">
              ${getInitials(profile.fullName)}
            </div>
            <div style="text-align:left; flex:1; min-width:0;">
              <div style="font-weight:600; color:#0f1724;">${profile.fullName}</div>
              <div style="font-size:0.85rem; color:#64748b; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${profile.email}</div>
            </div>
          </button>
        `).join('')}
      </div>
    ` : '' }
  `;

  document.body.appendChild(menu);

  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideDown {
      from { transform: translateY(-6px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `;
  if (!document.querySelector('style[data-account-style]')) {
    style.setAttribute('data-account-style', 'true');
    document.head.appendChild(style);
  }

  backdrop.onclick = closeAccountMenu;

  setTimeout(() => {
    window.addEventListener('click', outsideClickHandler);
  }, 50);

  function outsideClickHandler(ev) {
    const menuEl = document.getElementById('accountMenu');
    if (!menuEl) {
      window.removeEventListener('click', outsideClickHandler);
      return;
    }
    const target = ev.target;
    if (!menuEl.contains(target) && !target.matches('#accountAvatar') && !target.matches('#accountName')) {
      closeAccountMenu();
      window.removeEventListener('click', outsideClickHandler);
    }
  }
}

function getAllProfiles() {
  const allProfiles = localStorage.getItem('adaptohubProfiles');
  return allProfiles ? JSON.parse(allProfiles) : [];
}

function saveProfiles(profiles) {
  localStorage.setItem('adaptohubProfiles', JSON.stringify(profiles));
}

function addNewProfile() {
  localStorage.removeItem('adaptohubUser');
  window.location.replace('login.html');
}

function switchProfile(email) {
  const allProfiles = getAllProfiles();
  const profile = allProfiles.find(p => p.email === email);
  
  if (profile) {
    localStorage.setItem('adaptohubUser', JSON.stringify(profile));
    closeAccountMenu();
    location.reload();
  }
}

function openGuestMode() {
  closeAccountMenu();
  localStorage.setItem('adaptohubGuestMode', 'true');
  localStorage.removeItem('adaptohubUser');
  window.location.href = 'index.html';
}

function manageProfiles() {
  closeAccountMenu();
  openProfileManager();
}

function openProfileManager() {
  const allProfiles = getAllProfiles();
  const currentUser = JSON.parse(localStorage.getItem('adaptohubUser') || '{}');
  
  const modalBackdrop = document.createElement('div');
  modalBackdrop.className = 'profile-manager-backdrop';
  modalBackdrop.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  
  const modal = document.createElement('div');
  modal.style.cssText = `
    background-color: #ffffff;
    border-radius: 12px;
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  `;
  
  modal.innerHTML = `
    <div style="padding: 32px 24px; border-bottom: 1px solid #e0e0e0; display: flex; justify-content: space-between; align-items: center;">
      <h2 style="margin: 0; color: #0097b2; font-size: 1.5rem;">จัดการโปรไฟล์</h2>
      <button onclick="document.querySelector('.profile-manager-backdrop').remove()" style="
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #a8b2ba;
        transition: color 0.2s;
      " onmouseover="this.style.color='#0097b2'" onmouseout="this.style.color='#a8b2ba'">✕</button>
    </div>
    
    <div style="padding: 24px;">
      <div style="margin-bottom: 24px;">
        <div style="font-size: 0.85rem; font-weight: 600; color: #636d79; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px;">
          โปรไฟล์ที่บันทึก
        </div>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${allProfiles.map((profile, index) => `
            <div style="
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 16px;
              background-color: #f5f6f8;
              border-radius: 8px;
              border-left: 4px solid ${profile.email === currentUser.email ? '#0097b2' : '#e0e0e0'};
            ">
              <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
                <div style="
                  width: 48px;
                  height: 48px;
                  background-color: ${generateColor(profile.fullName, 0)};
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 1.25rem;
                  font-weight: 700;
                  color: #ffffff;
                  flex-shrink: 0;
                ">
                  ${getInitials(profile.fullName)}
                </div>
                <div style="flex: 1; min-width: 0;">
                  <div style="font-weight: 500; color: #1f2933;">${profile.fullName}</div>
                  <div style="font-size: 0.8rem; color: #636d79;">${profile.email}</div>
                  ${profile.email === currentUser.email ? '<div style="font-size: 0.75rem; color: #0097b2; font-weight: 600; margin-top: 4px;">✓ โปรไฟล์ปัจจุบัน</div>' : ''}
                </div>
              </div>
              <div style="display: flex; gap: 8px;">
                <button onclick="editProfile('${profile.email}')" style="
                  background-color: #4caf50;
                  color: white;
                  border: none;
                  padding: 8px 16px;
                  border-radius: 6px;
                  cursor: pointer;
                  font-weight: 500;
                  font-family: 'Bai Jamjuree', sans-serif;
                  font-size: 0.85rem;
                  transition: background-color 0.2s ease;
                " onmouseover="this.style.backgroundColor='#45a049'" onmouseout="this.style.backgroundColor='#4caf50'">
                  ✎ แก้ไข
                </button>
                <button onclick="removeProfile('${profile.email}')" style="
                  background-color: #f74949;
                  color: white;
                  border: none;
                  padding: 8px 16px;
                  border-radius: 6px;
                  cursor: pointer;
                  font-weight: 500;
                  font-family: 'Bai Jamjuree', sans-serif;
                  font-size: 0.85rem;
                  transition: background-color 0.2s ease;
                " onmouseover="this.style.backgroundColor='#e74545'" onmouseout="this.style.backgroundColor='#f74949'">
                  ลบ
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div style="padding-top: 24px; border-top: 1px solid #e0e0e0;">
        <button style="
          width: 100%;
          padding: 14px;
          background-color: #0097b2;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          font-family: 'Bai Jamjuree', sans-serif;
          font-size: 0.95rem;
          cursor: pointer;
          transition: background-color 0.2s ease;
        " onmouseover="this.style.backgroundColor='#0088a0'" onmouseout="this.style.backgroundColor='#0097b2'" onclick="(function() { localStorage.removeItem('adaptohubUser'); window.location.replace('login.html'); })()">
          ➕ เพิ่มโปรไฟล์ใหม่
        </button>
      </div>
    </div>
  `;
  
  modalBackdrop.appendChild(modal);
  document.body.appendChild(modalBackdrop);
  
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      modalBackdrop.remove();
    }
  });
}

function removeProfile(email) {
  const currentUser = JSON.parse(localStorage.getItem('adaptohubUser') || '{}');
  
  if (email === currentUser.email) {
    alert('ไม่สามารถลบโปรไฟล์ที่ใช้งานอยู่ได้');
    return;
  }
  
  if (!confirm('คุณแน่ใจว่าต้องการลบโปรไฟล์นี้หรือไม่?')) {
    return;
  }
  
  const allProfiles = getAllProfiles();
  const updatedProfiles = allProfiles.filter(p => p.email !== email);
  saveProfiles(updatedProfiles);
  
  document.querySelector('[style*="position: fixed"]')?.remove();
  openProfileManager();
}

function editProfile(email) {
  const allProfiles = getAllProfiles();
  const profile = allProfiles.find(p => p.email === email);
  const currentUser = JSON.parse(localStorage.getItem('adaptohubUser') || '{}');
  
  if (!profile) return;
  
  const modalBackdrop = document.createElement('div');
  modalBackdrop.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 2001;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  
  const modal = document.createElement('div');
  modal.style.cssText = `
    background-color: #ffffff;
    border-radius: 12px;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    overflow-y: auto;
  `;
  
  const editableFields = [
    { key: 'fullName', label: 'ชื่อเต็ม', type: 'text' },
    { key: 'studentId', label: 'รหัสนักเรียน', type: 'text' },
    { key: 'room', label: 'ห้อง', type: 'text' },
    { key: 'seatNumber', label: 'เลขที่', type: 'number' },
    { key: 'grade', label: 'ระดับชั้น', type: 'text' },
    { key: 'school', label: 'โรงเรียน', type: 'text' }
  ];
  
  let formHTML = `
    <div style="padding: 32px 24px; border-bottom: 1px solid #e0e0e0; display: flex; justify-content: space-between; align-items: center;">
      <h2 style="margin: 0; color: #0097b2; font-size: 1.5rem;">แก้ไขโปรไฟล์</h2>
      <button id="closeEditBtn" style="
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #a8b2ba;
      ">✕</button>
    </div>
    
    <form id="editProfileForm" style="padding: 24px;">
      <div style="margin-bottom: 16px;">
        <strong style="color: #636d79; font-size: 0.9rem;">อีเมล (ไม่สามารถแก้ไข)</strong>
        <div style="padding: 10px 12px; background-color: #f5f6f8; border-radius: 6px; color: #636d79; margin-top: 6px;">
          ${profile.email}
        </div>
      </div>
  `;
  
  editableFields.forEach(field => {
    const value = profile[field.key] || '';
    formHTML += `
      <div style="margin-bottom: 18px;">
        <label style="display: block; font-weight: 600; color: #1f2933; font-size: 0.95rem; margin-bottom: 8px;">
          ${field.label}
        </label>
        <input 
          type="${field.type}"
          name="${field.key}"
          value="${value}"
          style="
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #d0d5db;
            border-radius: 6px;
            font-size: 0.95rem;
            font-family: 'Bai Jamjuree', sans-serif;
            box-sizing: border-box;
          "
        />
      </div>
    `;
  });
  
  formHTML += `
      <div style="display: flex; gap: 10px; margin-top: 24px;">
        <button type="button" id="cancelEditBtn" style="
          flex: 1;
          padding: 12px;
          background-color: #f5f6f8;
          color: #1f2933;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          font-family: 'Bai Jamjuree', sans-serif;
          font-size: 0.95rem;
        ">ยกเลิก</button>
        <button type="submit" style="
          flex: 1;
          padding: 12px;
          background-color: #0097b2;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          font-family: 'Bai Jamjuree', sans-serif;
          font-size: 0.95rem;
        ">บันทึกการเปลี่ยนแปลง</button>
      </div>
    </form>
  `;
  
  modal.innerHTML = formHTML;
  modalBackdrop.appendChild(modal);
  document.body.appendChild(modalBackdrop);
  
  const form = modal.querySelector('#editProfileForm');
  const closeBtn = modal.querySelector('#closeEditBtn');
  const cancelBtn = modal.querySelector('#cancelEditBtn');
  
  closeBtn.addEventListener('click', () => modalBackdrop.remove());
  cancelBtn.addEventListener('click', () => modalBackdrop.remove());
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const updatedProfile = { ...profile };
    
    editableFields.forEach(field => {
      const value = formData.get(field.key);
      if (field.type === 'number') {
        updatedProfile[field.key] = value ? parseInt(value) : null;
      } else {
        updatedProfile[field.key] = value || undefined;
      }
    });
    
    const allProfiles = getAllProfiles();
    const profileIndex = allProfiles.findIndex(p => p.email === email);
    allProfiles[profileIndex] = updatedProfile;
    saveProfiles(allProfiles);

    if (email === currentUser.email) {
      localStorage.setItem('adaptohubUser', JSON.stringify(updatedProfile));
      initializeUser();
    }
    
    modalBackdrop.remove();
    openProfileManager();
  });
  
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      modalBackdrop.remove();
    }
  });
}

function closeAccountMenu() {
  const menu = document.getElementById('accountMenu');
  const backdrop = document.getElementById('accountBackdrop');
  if (menu) menu.remove();
  if (backdrop) backdrop.remove();
}

function signOutFromProfile() {
  const userStr = localStorage.getItem('adaptohubUser');
  if (!userStr) {
    alert('ไม่มีผู้ใช้ที่ลงชื่อเข้าใช้งาน');
    return;
  }
  const user = JSON.parse(userStr);
  user.signedIn = false;
  localStorage.setItem('adaptohubUser', JSON.stringify(user));
  closeAccountMenu();
  alert('คุณได้ออกจากบัญชี ยังคงสามารถใช้งานโปรไฟล์นี้ได้');
}

function logout() {
  localStorage.removeItem('adaptohubUser');
  localStorage.removeItem('adaptohubGuestMode');
  window.location.href = 'login.html';
}

function ensureTopBarButtons() {
  const topBanner = document.querySelector('.top-banner');
  if (!topBanner) return;

  let headerControls = topBanner.querySelector('.header-controls');
  if (!headerControls) {
    headerControls = document.createElement('div');
    headerControls.className = 'header-controls';
    const accountDisplay = topBanner.querySelector('.account-display');
    if (accountDisplay) {
      topBanner.insertBefore(headerControls, accountDisplay);
    } else {
      topBanner.appendChild(headerControls);
    }
  }
  headerControls.style.pointerEvents = 'auto';
  headerControls.style.position = 'relative';
  headerControls.style.zIndex = '2';

  if (!headerControls.querySelector('#streak-display')) {
    const streakDisplay = document.createElement('div');
    streakDisplay.id = 'streak-display';
    headerControls.appendChild(streakDisplay);
  }

  if (!headerControls.querySelector('#points-display')) {
    const pointsDisplay = document.createElement('div');
    pointsDisplay.id = 'points-display';
    pointsDisplay.setAttribute('title', 'Total Points');
    pointsDisplay.style.cssText = 'display: flex; align-items: center; gap: 6px; padding: 8px 16px; background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%); border-radius: 20px; font-weight: 600; font-size: 14px; color: white; box-shadow: 0 2px 8px rgba(245,158,11,0.3);';
    pointsDisplay.innerHTML = '<span>⭐</span><span id="pointsValue">0</span>';
    headerControls.appendChild(pointsDisplay);
  }

  if (!headerControls.querySelector('[data-topbar-button="random-quiz"]')) {
    const randomBtn = document.createElement('button');
    randomBtn.setAttribute('data-topbar-button', 'random-quiz');
    randomBtn.textContent = '🎲 Random';
    randomBtn.title = 'Random Quiz';
    randomBtn.style.cssText = 'padding: 8px 16px; background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%); color: white; border: none; border-radius: 20px; cursor: pointer; font-weight: 600; font-size: 13px; box-shadow: 0 2px 8px rgba(139,92,246,0.3); transition: transform 0.2s ease;';
    randomBtn.style.pointerEvents = 'auto';
    randomBtn.addEventListener('mouseenter', () => { randomBtn.style.transform = 'scale(1.05)'; });
    randomBtn.addEventListener('mouseleave', () => { randomBtn.style.transform = 'scale(1)'; });
    randomBtn.addEventListener('click', () => { window.randomQuiz && window.randomQuiz(); });
    headerControls.appendChild(randomBtn);
  }

  if (!headerControls.querySelector('[data-topbar-button="badges"]')) {
    const badgesBtn = document.createElement('button');
    badgesBtn.setAttribute('data-topbar-button', 'badges');
    badgesBtn.textContent = '🏆 Badges';
    badgesBtn.title = 'View Badges';
    badgesBtn.style.cssText = 'padding: 8px 16px; background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%); color: white; border: none; border-radius: 20px; cursor: pointer; font-weight: 600; font-size: 13px; box-shadow: 0 2px 8px rgba(245,158,11,0.3); transition: transform 0.2s ease;';
    badgesBtn.style.pointerEvents = 'auto';
    badgesBtn.addEventListener('mouseenter', () => { badgesBtn.style.transform = 'scale(1.05)'; });
    badgesBtn.addEventListener('mouseleave', () => { badgesBtn.style.transform = 'scale(1)'; });
    badgesBtn.addEventListener('click', () => { if (window.badgeSystem && typeof window.badgeSystem.showAllBadges === 'function') { window.badgeSystem.showAllBadges(); } });
    headerControls.appendChild(badgesBtn);
  }

  if (!headerControls.querySelector('[data-topbar-button="theme"]')) {
    const themeBtn = document.createElement('button');
    themeBtn.setAttribute('data-topbar-button', 'theme');
    themeBtn.textContent = '🎨 Theme';
    themeBtn.title = 'Background Customizer';
    themeBtn.style.cssText = 'padding: 8px 16px; background: linear-gradient(135deg, #ec4899 0%, #f472b6 100%); color: white; border: none; border-radius: 20px; cursor: pointer; font-weight: 600; font-size: 13px; box-shadow: 0 2px 8px rgba(236,72,153,0.3); transition: transform 0.2s ease;';
    themeBtn.style.pointerEvents = 'auto';
    themeBtn.addEventListener('mouseenter', () => { themeBtn.style.transform = 'scale(1.05)'; });
    themeBtn.addEventListener('mouseleave', () => { themeBtn.style.transform = 'scale(1)'; });
    themeBtn.addEventListener('click', async () => {
      await ensureBackgroundCustomizerLoaded();
      if (window.backgroundCustomizer && typeof window.backgroundCustomizer.showCustomizer === 'function') {
        window.backgroundCustomizer.showCustomizer();
      } else if (window.customizer && typeof window.customizer.showCustomizer === 'function') {
        window.customizer.showCustomizer();
      } else {
        alert('Theme customizer unavailable. Try refreshing.');
      }
    });
    headerControls.appendChild(themeBtn);
  }

  if (!headerControls.querySelector('#realTimeClock')) {
    const clockEl = document.createElement('div');
    clockEl.id = 'realTimeClock';
    clockEl.style.cssText = 'font-weight: 500; color: #ffffff; margin: 0 8px; font-size: 0.95rem;';
    headerControls.appendChild(clockEl);
  }

  if (!headerControls.querySelector('#darkModeToggle')) {
    const darkToggle = document.createElement('button');
    darkToggle.id = 'darkModeToggle';
    darkToggle.title = 'Toggle dark mode';
    darkToggle.style.cssText = 'background: none; border: none; cursor: pointer; font-size: 1.3rem; padding: 5px;';
    darkToggle.style.pointerEvents = 'auto';
    headerControls.appendChild(darkToggle);
  }
}

function enforceTopBannerPriority() {
  const topBanner = document.querySelector('.top-banner');
  if (!topBanner) return;

  topBanner.style.position = 'fixed';
  topBanner.style.top = '0';
  topBanner.style.left = '0';
  topBanner.style.right = '0';
  topBanner.style.zIndex = '100000';
  topBanner.style.pointerEvents = 'auto';

  if (topBanner.parentElement && topBanner.parentElement !== document.body) {
    document.body.appendChild(topBanner);
  } else if (document.body && topBanner !== document.body.lastElementChild) {
    document.body.appendChild(topBanner);
  }

  if (!document.getElementById('topbar-force-style')) {
    const style = document.createElement('style');
    style.id = 'topbar-force-style';
    style.textContent = `
      .top-banner { z-index: 100000 !important; pointer-events: auto !important; }
      .top-banner * { pointer-events: auto !important; }
    `;
    document.head.appendChild(style);
  }
}

function ensureBackgroundCustomizerLoaded() {
  if (window.backgroundCustomizer || window.customizer) {
    return Promise.resolve(window.backgroundCustomizer || window.customizer);
  }

  return new Promise((resolve) => {
    if (!document.querySelector('script[src*="background-customizer.js"]')) {
      const script = document.createElement('script');
      script.src = 'background-customizer.js';
      script.async = false;
      script.onload = () => {
        setTimeout(() => resolve(window.backgroundCustomizer || window.customizer), 100);
      };
      script.onerror = () => resolve(null);
      document.head.appendChild(script);
    } else {
      let attempts = 0;
      const check = () => {
        if (window.backgroundCustomizer || window.customizer) {
          resolve(window.backgroundCustomizer || window.customizer);
        } else if (attempts++ < 100) {
          setTimeout(check, 50);
        } else {
          resolve(null);
        }
      };
      setTimeout(check, 100);
    }
  });
}

function applyStoredTheme() {
  const savedTheme = localStorage.getItem('adaptohubTheme');
  if (savedTheme) {
    try {
      const themeData = JSON.parse(savedTheme);
      if (themeData.backgroundImage) {
        document.body.style.backgroundImage = `url('${themeData.backgroundImage}')`;
      }
      if (themeData.backgroundColor) {
        document.body.style.backgroundColor = themeData.backgroundColor;
      }
      if (themeData.backgroundSize) {
        document.body.style.backgroundSize = themeData.backgroundSize;
      }
      if (themeData.backgroundPosition) {
        document.body.style.backgroundPosition = themeData.backgroundPosition;
      }
      if (themeData.backgroundAttachment) {
        document.body.style.backgroundAttachment = themeData.backgroundAttachment;
      }
    } catch (e) {
    }
  }
}

let platformSessionStart = null;
let platformTimeTrackingInterval = null;
let platformTimeAccumulated = 0; // Track accumulated time separately

// Expose globally for analytics dashboard
window.platformSessionStart = null;
window.getPlatformSessionTime = function() {
  if (!platformSessionStart) return 0;
  return Math.round((Date.now() - platformSessionStart) / 1000);
};

function startPlatformTimeTracking() {
  if (!window.analyticsSystem) return;
  
  // Record when session started
  platformSessionStart = Date.now();
  window.platformSessionStart = platformSessionStart;
  platformTimeAccumulated = 0;
  
  platformTimeTrackingInterval = setInterval(() => {
    if (platformSessionStart) {
      const elapsed = Math.round((Date.now() - platformSessionStart) / 1000);
      if (elapsed >= 30) { // Save data every 30 seconds
        const path = window.location.pathname;
        let subject = 'general';
        let module = 'platform';
        
        if (path.includes('physics') || path.includes('chemistry') || path.includes('biology')) {
          subject = 'science';
          if (path.includes('physics')) module = 'physics';
          else if (path.includes('chemistry')) module = 'chemistry';
          else if (path.includes('biology')) module = 'biology';
        } else if (path.includes('math')) {
          subject = 'mathematics';
          module = 'general';
        } else if (path.includes('analytics')) {
          subject = 'platform';
          module = 'analytics';
        }
        
        // Record accumulated time
        analyticsSystem.recordTimeSpent(subject, module, elapsed);
        analyticsSystem.createDailySnapshot();
        
        // Reset timer for next interval
        platformSessionStart = Date.now();
        window.platformSessionStart = platformSessionStart;
        
        // Trigger visualization refresh if on analytics page
        if (window.analyticsDashboard && path.includes('analytics')) {
          window.analyticsDashboard.renderTimeChart();
        }
      }
    }
  }, 5000); // Check every 5 seconds instead of 30
 
}

function stopPlatformTimeTracking() {
  if (platformTimeTrackingInterval) {
    clearInterval(platformTimeTrackingInterval);
    platformTimeTrackingInterval = null;
  }
  
  if (platformSessionStart && window.analyticsSystem) {
    const elapsed = Math.round((Date.now() - platformSessionStart) / 1000);
    if (elapsed > 0) {
      const path = window.location.pathname;
      let subject = 'general';
      let module = 'platform';
      
      if (path.includes('physics') || path.includes('chemistry') || path.includes('biology')) {
        subject = 'science';
        if (path.includes('physics')) module = 'physics';
        else if (path.includes('chemistry')) module = 'chemistry';
        else if (path.includes('biology')) module = 'biology';
      } else if (path.includes('math')) {
        subject = 'mathematics';
        module = 'general';
      } else if (path.includes('analytics')) {
        subject = 'platform';
        module = 'analytics';
      }
      
      analyticsSystem.recordTimeSpent(subject, module, elapsed);
      analyticsSystem.createDailySnapshot();
    }
  }
  
  platformSessionStart = null;
  window.platformSessionStart = null;
  platformTimeAccumulated = 0;
}

window.addEventListener('DOMContentLoaded', () => {
  applyStoredTheme();
  ensureTopbarForceScript();
  ensureTopBarButtons();
  enforceTopBannerPriority();
  initializeTopBarInteractions();
  if (!window.location.pathname.includes('login.html')) {
    initializeUser();
    
    setTimeout(() => {
      if (window.analyticsSystem) {
        startPlatformTimeTracking();
      }
    }, 1000);
  } else {
    const accountNameEl = document.getElementById("accountName");
    const avatar = document.getElementById("accountAvatar");
    if (accountNameEl) accountNameEl.addEventListener('click', toggleAccountMenu);
    if (avatar) avatar.addEventListener('click', toggleAccountMenu);
  }
});

window.addEventListener('beforeunload', () => {
  stopPlatformTimeTracking();
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    stopPlatformTimeTracking();
  } else {
    if (!window.location.pathname.includes('login.html')) {
      startPlatformTimeTracking();
    }
  }
});

window.showAccountMenu = showAccountMenu;
window.closeAccountMenu = closeAccountMenu;
window.switchProfile = switchProfile;
window.addNewProfile = addNewProfile;
window.manageProfiles = manageProfiles;
window.openGuestMode = openGuestMode;
window.removeProfile = removeProfile;
window.editProfile = editProfile;
window.openProfileManager = openProfileManager;
window.signOutFromProfile = signOutFromProfile;
window.logout = logout;
window.toggleAccountMenu = toggleAccountMenu;

function createSubjectCard({
  name,
  description,
  href = null
}) {
  const card = document.createElement("a");
  card.className = "subject-card";

  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const color = generateColor(initials, 0);
  card.style.background = `linear-gradient(45deg, ${color} 90%, white 50%, white 100%)`

  card.innerHTML = `
    <div class="subject-header">
      <div class="subject-meta">
        <h3 class="subject-title">${name}</h3>
        <p class="subject-desc">${description}</p>
      </div>
    </div>
  `;
  card.setAttribute("href", href);

  card.addEventListener('click', function(e) {
    if (href) {
      e.preventDefault();
      const loadingScreen = document.getElementById('loadingScreen');
      if (loadingScreen) {
        loadingScreen.style.display = 'flex';
        setTimeout(() => {
          window.location.href = href;
        }, 1000);
      } else {
        window.location.href = href;
      }
    }
  });

  return card;
}

const classroomsSubjects = [
  {
    name: "Science",
    description: "A systematic discipline that builds and organizes knowledge in the form of testable hypotheses and predictions about the universe.",
    href: "science.html"
  },
  {
    name: "Mathematics",
    description: "A field of study that discovers and organizes methods, theories, and theorems that are developed and proved for the needs of empirical sciences and mathematics itself.",
    href: "mathematics.html"
  },
  {
    name: "Social Studies",
    description: "The multidisciplinary study of human societies coexist, interact, and organize themselves through shared beliefs systems and ways of life.",
    href: "social_studies.html"
  }
];

const collaborationSubjects = [
  {
    name: "Project Showcase",
    description: "Show and explore peer projects and learning artifacts.",
    href: "project_showcase.html"
  },
  {
    name: "Submission Center",
    description: "A place where learners submit assignments and track submission status.",
    href: "submission_center.html"
  },
  {
    name: "Safe Feedback & Discussion",
    description: "Structured, moderated threads for peer feedback and reflective discussion.",
    href: "feedback_discussion.html"
  },
  {
    name: "Inspiration Board",
    description: "A place for students to share and discuss their ideas.",
    href: "inspiration_board.html"
  },
  {
    name: "Community Data Visualization",
    description: "Aggregated visualizations of class/community data to inform learning decisions.",
    href: "community_visualization.html"
  }
];

function appendSubjectsToGrid(gridEl, subjects) {
  subjects.forEach(s => gridEl.appendChild(createSubjectCard(s)));
}

const classroomsGrid = document.querySelector('#classrooms + .subject-grid');
const collabGrid = document.querySelector('#collaboration + .subject-grid');

if (classroomsGrid) {
  appendSubjectsToGrid(classroomsGrid, classroomsSubjects);
} else {
  const grids = document.querySelectorAll('.subject-grid');
  if (grids.length >= 1) {
    appendSubjectsToGrid(grids[0], classroomsSubjects);
  }
}

if (collabGrid) {
  appendSubjectsToGrid(collabGrid, collaborationSubjects);
} else {
  const grids = document.querySelectorAll('.subject-grid');
  if (grids.length >= 2) {
    appendSubjectsToGrid(grids[1], collaborationSubjects);
  }
}

const featureDemoSubjects = [
  {
    name: "Feature Demo",
    description: "Test and explore all new AdaptoHub features including dark mode, celebrations, and avatar customization.",
    href: "feature-demo.html"
  }
];

const featureDemoGrid = document.querySelector('#featuresdemo + .subject-grid');

if (featureDemoGrid) {
  appendSubjectsToGrid(featureDemoGrid, featureDemoSubjects);
} else {
  const grids = document.querySelectorAll('.subject-grid');
  if (grids.length >= 3) {
    appendSubjectsToGrid(grids[2], featureDemoSubjects);
  }
}

(function addScienceSubgrid() {
  const subSubjects = [
    { name: 'Physics', description: 'Mechanics, energy, waves, and fundamental physical laws.', href: 'physics.html' },
    { name: 'Chemistry', description: 'Matter, reactions, and chemical properties.', href: 'chemistry.html' },
    { name: 'Biology', description: 'Life sciences, organisms, and ecosystems.', href: 'biology.html' }
  ];

  const grid = classroomsGrid || document.querySelector('.subject-grid');
  if (!grid) return;

  const scienceCard = Array.from(grid.querySelectorAll('.subject-card')).find(c => {
    const title = c.querySelector('.subject-title');
    return title && title.textContent.trim() === 'Science';
  });
  if (!scienceCard) return;

  let subgridEl = null;
  let hideTimer = null;

  function showSubgrid() {
    if (subgridEl) return;
    subgridEl = document.createElement('div');
    subgridEl.className = 'subject-subgrid';
    subSubjects.forEach(s => subgridEl.appendChild(createSubjectCard(s)));

    scienceCard.parentNode.insertBefore(subgridEl, scienceCard.nextSibling);

    subgridEl.addEventListener('mouseenter', () => { if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; } });
    subgridEl.addEventListener('mouseleave', () => { hideTimer = setTimeout(hideSubgrid, 150); });
  }

  function hideSubgrid() {
    if (!subgridEl) return;
    subgridEl.remove();
    subgridEl = null;
  }

  scienceCard.addEventListener('mouseenter', () => {
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
    showSubgrid();
  });
  scienceCard.addEventListener('mouseleave', () => {
    hideTimer = setTimeout(hideSubgrid, 150);
  });
})();

(function addSocialStudiesSubgrid() {
  const subSubjects = [
    { name: 'History', description: 'Study of past events, timelines, and historical analysis.', href: 'history.html' },
    { name: 'Buddhism', description: 'Teachings, history, and cultural impact of Buddhism.', href: 'buddhism.html' },
    { name: 'Civics/Government', description: 'Civic structures, governance, and citizen responsibilities.', href: 'civics_government.html' },
    { name: 'Religion, morality, ethics', description: 'How societies and cultures interact, trade, and influence each other.', href: 'religion_morality_ethics.html' }
  ];

  createHoverSubgridForTitle(classroomsGrid, 'Social Studies', subSubjects);
})();

function createHoverSubgridForTitle(grid, parentTitle, subSubjects, onCreate) {
  const containerGrid = grid || document.querySelector('.subject-grid');
  if (!containerGrid) return;

  const parentCard = Array.from(containerGrid.querySelectorAll('.subject-card')).find(c => {
    const title = c.querySelector('.subject-title');
    return title && title.textContent.trim() === parentTitle;
  });
  if (!parentCard) return;

  let subgridEl = null;
  let hideTimer = null;

  function showSubgrid() {
    if (subgridEl) return;
    subgridEl = document.createElement('div');
    subgridEl.className = 'subject-subgrid';
    subSubjects.forEach(s => subgridEl.appendChild(createSubjectCard(s)));

    parentCard.parentNode.insertBefore(subgridEl, parentCard.nextSibling);

    if (typeof onCreate === 'function') onCreate(subgridEl);

    subgridEl.addEventListener('mouseenter', () => { if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; } });
    subgridEl.addEventListener('mouseleave', () => { hideTimer = setTimeout(hideSubgrid, 150); });
  }

  function hideSubgrid() {
    if (!subgridEl) return;
    subgridEl.remove();
    subgridEl = null;
  }

  parentCard.addEventListener('mouseenter', () => {
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
    showSubgrid();
  });
  parentCard.addEventListener('mouseleave', () => {
    hideTimer = setTimeout(hideSubgrid, 150);
  });
}

(function addMathematicsNestedSubgrids() {
  const firstLevel = [
    { name: 'Pure Mathematics', description: 'Foundational and structural branches of mathematics.', href: 'pure_mathematics.html' },
    { name: 'Applied Mathematics & Analysis', description: 'Applied branches and analytical techniques.', href: 'applied_mathematics.html' }
  ];

  createHoverSubgridForTitle(classroomsGrid, 'Mathematics', firstLevel, (firstSubgrid) => {
    const pureCard = Array.from(firstSubgrid.querySelectorAll('.subject-card')).find(c => {
      const t = c.querySelector('.subject-title'); return t && t.textContent.trim() === 'Pure Mathematics';
    });
    if (pureCard) {
      const pureSubs = [
        { name: 'Algebra', description: 'Structures, groups, rings, and modules.', href: 'algebra.html' },
        { name: 'Geometry & Topography', description: 'Shapes, spaces, and their properties.', href: 'geometry.html' },
        { name: 'Number Theory', description: 'Properties of integers and related structures.', href: 'number_theory.html' },
        { name: 'Logic & Foundations', description: 'Formal systems, proofs, and foundations of mathematics.', href: 'logic_foundations.html' },
        { name: 'Combinatorics', description: 'Counting, arrangement, and discrete structures.', href: 'combinatorics.html' }
      ];

      (function attachPure() {
        let subEl = null; let tmr = null;
        function show() {
          if (subEl) return;
          subEl = document.createElement('div');
          subEl.className = 'subject-subgrid';
          pureSubs.forEach(s => subEl.appendChild(createSubjectCard(s)));
          pureCard.parentNode.insertBefore(subEl, pureCard.nextSibling);
          subEl.addEventListener('mouseenter', () => { if (tmr) { clearTimeout(tmr); tmr = null; } });
          subEl.addEventListener('mouseleave', () => { tmr = setTimeout(hide, 150); });
        }
        function hide() { if (!subEl) return; subEl.remove(); subEl = null; }
        pureCard.addEventListener('mouseenter', () => { if (tmr) { clearTimeout(tmr); tmr = null; } show(); });
        pureCard.addEventListener('mouseleave', () => { tmr = setTimeout(hide, 150); });
      })();
    }

    const appliedCard = Array.from(firstSubgrid.querySelectorAll('.subject-card')).find(c => {
      const t = c.querySelector('.subject-title'); return t && t.textContent.trim() === 'Applied Mathematics & Analysis';
    });
    if (appliedCard) {
      const appliedSubs = [
        { name: 'Calculus & Analysis', description: 'Limits, derivatives, integrals and real/complex analysis.', href: 'calculus_analysis.html' },
        { name: 'Statistics & Probability', description: 'Data analysis, inference, and probabilistic models.', href: 'statistics_probability.html' },
        { name: 'Differential Equations', description: 'ODEs and PDEs for modelling change.', href: 'differential_equations.html' },
        { name: 'Discrete Mathematics', description: 'Graphs, algorithms, and combinatorial structures.', href: 'discrete_mathematics.html' },
        { name: 'Numerical Analysis', description: 'Approximation methods and computational algorithms.', href: 'numerical_analysis.html' },
        { name: 'Mathematical Physics', description: 'Mathematical methods applied to physical problems.', href: 'mathematical_physics.html' }
      ];

      (function attachApplied() {
        let subEl = null; let tmr = null;
        function show() {
          if (subEl) return;
          subEl = document.createElement('div');
          subEl.className = 'subject-subgrid';
          appliedSubs.forEach(s => subEl.appendChild(createSubjectCard(s)));
          appliedCard.parentNode.insertBefore(subEl, appliedCard.nextSibling);
          subEl.addEventListener('mouseenter', () => { if (tmr) { clearTimeout(tmr); tmr = null; } });
          subEl.addEventListener('mouseleave', () => { tmr = setTimeout(hide, 150); });
        }
        function hide() { if (!subEl) return; subEl.remove(); subEl = null; }
        appliedCard.addEventListener('mouseenter', () => { if (tmr) { clearTimeout(tmr); tmr = null; } show(); });
        appliedCard.addEventListener('mouseleave', () => { tmr = setTimeout(hide, 150); });
      })();
    }
  });
})();

const main = document.querySelector("main");
const navButtons = document.querySelectorAll(".nav-btn");

navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const targetId = btn.dataset.target;
    const target = document.getElementById(targetId);

    if (!target) return;

    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
});

const headings = document.querySelectorAll("main h2");

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navButtons.forEach(btn => {
        btn.classList.toggle(
          "active",
          btn.dataset.target === id
        );
      });
    });
  },
  {
    root: main,
    threshold: 0.55
  }
);

headings.forEach(h2 => observer.observe(h2));

(function enableScrollingEnhancements() {
  // Only enable refresh on pages that have the sentinel and loader elements
  const bottomSentinel = document.getElementById('bottomSentinel');
  const bottomLoader = document.getElementById('bottomLoader');
  
  if (!bottomSentinel || !bottomLoader) {
    return; // Skip refresh setup on subject pages (science.html, physics.html, etc)
  }

  let refreshInProgress = false;
  let refreshDebounceTimer = null;
  const REFRESH_DEBOUNCE_MS = 1500;
  const PULL_THRESHOLD = 60; 
  const scrollContainer = document.querySelector('.scroll') || window;

  function createPullupIndicator() {
    let el = document.querySelector('.pullup-indicator');
    if (!el) {
      el = document.createElement('div');
      el.className = 'pullup-indicator';
      el.id = 'pullupIndicator';
      el.textContent = 'เลื่อนขึ้นเพื่อรีเฟรช';
      document.body.appendChild(el);
    }
    return el;
  }
  const pullupIndicator = createPullupIndicator();

  function triggerRefresh(source) {
    if (refreshInProgress) return;
    if (refreshDebounceTimer) return;
    refreshDebounceTimer = setTimeout(() => {
      refreshDebounceTimer = null;
    }, REFRESH_DEBOUNCE_MS);

    performRefresh(source);
  }

  function performRefresh(source) {
    refreshInProgress = true;
    if (bottomLoader) bottomLoader.style.display = 'block';
    if (pullupIndicator) {
      pullupIndicator.textContent = '↻ กำลังรีเฟรช...';
      pullupIndicator.classList.add('visible');
    }

    setTimeout(() => {
      try {
        try {
          const classroomsGrid = document.querySelector('#classrooms + .subject-grid') || document.querySelectorAll('.subject-grid')[0];
          const collabGrid = document.querySelector('#collaboration + .subject-grid') || document.querySelectorAll('.subject-grid')[1];
          
          // Instead of clearing and rebuilding, just update the content of existing cards
          if (classroomsGrid && typeof appendSubjectsToGrid === 'function') {
            // Remove only the cards, keep the grid structure
            const cards = classroomsGrid.querySelectorAll('.subject-card, .subject-subgrid');
            cards.forEach(card => card.remove());
            appendSubjectsToGrid(classroomsGrid, classroomsSubjects);
          }
          if (collabGrid && typeof appendSubjectsToGrid === 'function') {
            // Remove only the cards, keep the grid structure
            const cards = collabGrid.querySelectorAll('.subject-card, .subject-subgrid');
            cards.forEach(card => card.remove());
            appendSubjectsToGrid(collabGrid, collaborationSubjects);
          }
        } catch (e) {
        }

        if (typeof adaptiveInstance !== 'undefined' && adaptiveInstance) {
          if (typeof renderModules === 'function') renderModules();
          if (typeof updateDashboard === 'function') updateDashboard();
        }
      } finally {
        if (bottomLoader) bottomLoader.style.display = 'none';
        if (pullupIndicator) {
          setTimeout(() => {
            pullupIndicator.classList.remove('visible');
            pullupIndicator.textContent = 'เลื่อนขึ้นเพื่อรีเฟรช';
          }, 600);
        }
        refreshInProgress = false;
      }
    }, 900); 
  }

  try {
    if (bottomSentinel) {
      const ioRoot = (scrollContainer !== window) ? scrollContainer : null;
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            triggerRefresh('sentinel');
          }
        });
      }, { root: ioRoot, threshold: 0.1 });
      io.observe(bottomSentinel);
    }
  } catch (err) {
  }

  (function attachTouchHandlers() {
    if (!scrollContainer || typeof window === 'undefined') return;
    let startY = 0;
    let lastY = 0;
    let pulling = false;

    const containerEl = (scrollContainer === window) ? document.scrollingElement || document.documentElement : scrollContainer;

    containerEl.addEventListener('touchstart', (e) => {
      if (containerEl.scrollTop + containerEl.clientHeight >= containerEl.scrollHeight - 2) {
        startY = e.touches[0].clientY;
        lastY = startY;
        pulling = true;
      } else {
        pulling = false;
      }
    }, { passive: true });

    containerEl.addEventListener('touchmove', (e) => {
      if (!pulling) return;
      lastY = e.touches[0].clientY;
      const delta = startY - lastY; 
      if (delta > 0) {
        pullupIndicator.classList.add('visible');
        pullupIndicator.textContent = delta >= PULL_THRESHOLD ? 'ปล่อยเพื่อรีเฟรช' : 'เลื่อนขึ้นเพื่อรีเฟรช';
      } else {
        pullupIndicator.classList.remove('visible');
      }
    }, { passive: true });

    containerEl.addEventListener('touchend', (e) => {
      if (!pulling) return;
      const delta = startY - lastY;
      if (delta >= PULL_THRESHOLD) {
        triggerRefresh('pullup');
      } else {
        pullupIndicator.classList.remove('visible');
      }
      pulling = false;
      startY = lastY = 0;
    });
  })();

  (function attachWheelHandler() {
    const containerEl = (scrollContainer === window) ? document.scrollingElement || document.documentElement : scrollContainer;
    let wheelTimer = null;
    containerEl.addEventListener('wheel', (e) => {
      if (e.deltaY > 50 && containerEl.scrollTop + containerEl.clientHeight >= containerEl.scrollHeight - 2) {
        if (wheelTimer) return;
        wheelTimer = setTimeout(() => { wheelTimer = null; }, REFRESH_DEBOUNCE_MS);
        triggerRefresh('wheel');
      }
    }, { passive: true });
  })();

  window.__Adapto_refreshNow = () => triggerRefresh('manual');

  if (pullupIndicator) pullupIndicator.classList.remove('visible');
})();