// Popup functions
function initializePopup() {
  const popup = document.getElementById('welcomePopup');
  const closeBtn = document.getElementById('closePopup');
  const acknowledgeBtn = document.getElementById('acknowledgeButton');

  console.log('=== POPUP DEBUG ===');
  console.log('Popup element:', popup);
  console.log('Close button:', closeBtn);
  console.log('Acknowledge button:', acknowledgeBtn);

  if (!popup) {
    console.error('❌ Popup element not found!');
    return;
  }

  if (shouldShowPopup()) {
    console.log('Should show popup - scheduling display');
    setTimeout(showPopup, 1000);
  } else {
    console.log('❌ Should NOT show popup');
  }

  setupPopupEventListeners();
}

function setupPopupEventListeners() {
  const popup = document.getElementById('welcomePopup');
  const closeBtn = document.getElementById('closePopup');
  const acknowledgeBtn = document.getElementById('acknowledgeButton');

  // Close button event - NOW SHOWS ALERT INSTEAD OF CLOSING
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showRequiredAlert();
    });
  }

  // Acknowledge button event - ONLY WAY TO CLOSE
  if (acknowledgeBtn) {
    acknowledgeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closePopup();
    });
  }

  // Overlay click event - DISABLED (user must click button)
  if (popup) {
    popup.addEventListener('click', (e) => {
      if (e.target === popup) {
        showRequiredAlert();
      }
    });
  }

  // Escape key event - DISABLED (user must click button)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const popup = document.getElementById('welcomePopup');
      if (popup && popup.classList.contains('active')) {
        e.preventDefault();
        showRequiredAlert();
      }
    }
  });
}

function showRequiredAlert() {
  // Create a custom alert instead of browser alert for better UX
  showCustomAlert('You must declare that you are aware in order to proceed!');

  // Optional: Add visual feedback to the button
  const acknowledgeBtn = document.getElementById('acknowledgeButton');
  if (acknowledgeBtn) {
    acknowledgeBtn.style.animation = 'pulseAttention 0.5s ease-in-out';
    setTimeout(() => {
      acknowledgeBtn.style.animation = '';
    }, 500);
  }
}

// Custom alert function for better user experience
function showCustomAlert(message) {
  // Remove existing custom alert if any
  const existingAlert = document.getElementById('customAlert');
  if (existingAlert) {
    existingAlert.remove();
  }

  const alertOverlay = document.createElement('div');
  alertOverlay.id = 'customAlert';
  alertOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10001;
    backdrop-filter: blur(5px);
    animation: fadeIn 0.3s ease-out;
  `;

  const alertBox = document.createElement('div');
  alertBox.style.cssText = `
    background: var(--popup-bg);
    border: 2px solid var(--color-primary);
    border-radius: 15px;
    padding: 2rem;
    max-width: 400px;
    width: 90%;
    text-align: center;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(15px);
    animation: slideUp 0.3s ease-out;
  `;

  const alertMessage = document.createElement('p');
  alertMessage.textContent = message;
  alertMessage.style.cssText = `
    color: var(--color-text-primary);
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
    line-height: 1.5;
  `;

  const alertButton = document.createElement('button');
  alertButton.textContent = 'go back and read';
  alertButton.style.cssText = `
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    color: white;
    border: none;
    padding: 0.8rem 2rem;
    border-radius: 50px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(255, 126, 95, 0.3);
  `;

  alertButton.addEventListener('click', () => {
    alertOverlay.remove();
  });

  alertButton.addEventListener('mouseenter', () => {
    alertButton.style.transform = 'translateY(-2px)';
    alertButton.style.boxShadow = '0 6px 20px rgba(255, 126, 95, 0.4)';
  });

  alertButton.addEventListener('mouseleave', () => {
    alertButton.style.transform = 'translateY(0)';
    alertButton.style.boxShadow = '0 4px 15px rgba(255, 126, 95, 0.3)';
  });

  alertBox.appendChild(alertMessage);
  alertBox.appendChild(alertButton);
  alertOverlay.appendChild(alertBox);
  document.body.appendChild(alertOverlay);

  // Auto-remove after 5 seconds if user doesn't click
  setTimeout(() => {
    if (document.getElementById('customAlert')) {
      alertOverlay.remove();
    }
  }, 5000);
}

function showPopup() {
  const popup = document.getElementById('welcomePopup');
  if (popup) {
    console.log('Showing popup');
    popup.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closePopup() {
  const popup = document.getElementById('welcomePopup');
  if (popup) {
    console.log('Closing popup and setting acknowledgment');
    popup.classList.remove('active');
    document.body.style.overflow = '';

    // MUDANÇA AQUI: Usar sessionStorage ao invés de localStorage
    sessionStorage.setItem('horizonTimelineWelcomeSeen', 'true');
    sessionStorage.setItem('popupLastSeen', Date.now().toString());

    console.log('Saved to sessionStorage:', {
      welcomeSeen: sessionStorage.getItem('horizonTimelineWelcomeSeen'),
      lastSeen: sessionStorage.getItem('popupLastSeen'),
    });
  }
}

function shouldShowPopup() {
  // Check URL parameter for forced show
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('showPopup') === 'true') {
    console.log('🔗 URL parameter forces popup show');
    return true;
  }

  // Check if we're in development
  // const isDevelopment =
  //   window.location.hostname === 'localhost' ||
  //   window.location.hostname === '127.0.0.1' ||
  //   window.location.protocol === 'file:';

  // console.log('🌐 Development environment:', isDevelopment);

  // // For development - ALWAYS SHOW
  // if (isDevelopment) {
  //   console.log('🔧 Development mode - showing popup');
  //   return true;
  // }

  // Production: normal behavior
  // MUDANÇA AQUI: Usar sessionStorage ao invés de localStorage
  const hasAcknowledged = sessionStorage.getItem('horizonTimelineWelcomeSeen');
  console.log('📝 sessionStorage value:', hasAcknowledged);
  return !hasAcknowledged;
}

// Debug functions
function addDebugButtons() {
  const debugDiv = document.createElement('div');
  debugDiv.id = 'debugButtons';
  debugDiv.style.cssText = `
    position: fixed; 
    bottom: 10px; 
    right: 10px; 
    z-index: 10000; 
    display: flex; 
    flex-direction: column; 
    gap: 5px;
  `;

  debugDiv.innerHTML = `
    <button onclick="resetPopup()" style="background: #ff4444; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; font-size: 12px; font-weight: bold;">Reset Popup</button>
    <button onclick="forceShowPopup()" style="background: #44ff44; color: black; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; font-size: 12px; font-weight: bold;">Show Popup</button>
  `;

  document.body.appendChild(debugDiv);
}

function resetPopup() {
  // MUDANÇA AQUI: Remover do sessionStorage ao invés do localStorage
  sessionStorage.removeItem('horizonTimelineWelcomeSeen');
  sessionStorage.removeItem('popupLastSeen');
  console.log('🗑️ sessionStorage cleared for popup');
  setTimeout(showPopup, 100);
}

function forceShowPopup() {
  showPopup();
}

// Make debug functions globally available
window.resetPopup = resetPopup;
window.forceShowPopup = forceShowPopup;

export {
  initializePopup,
  showPopup,
  closePopup,
  resetPopup,
  forceShowPopup,
  addDebugButtons,
};
