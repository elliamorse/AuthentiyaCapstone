// DOM Elements
const toggleBtn = document.getElementById('toggle-btn');
const resetBtn = document.getElementById('reset-btn');
const settingsIcon = document.querySelector('.settings-icon');
const trackingStatus = document.getElementById('tracking-status');
const wordCount = document.getElementById('word-count');
const activeTime = document.getElementById('active-time');
const sessionStart = document.getElementById('session-start');
const fieldName = document.getElementById('field-name');
const fieldUrl = document.getElementById('field-url');
const classSelect = document.getElementById('class-select');
const assignmentSelect = document.getElementById('assignment-select');

// Session data
let isTracking = true;
let sessionStartTime = new Date();
let sessionStartTimeFormatted = formatTime(sessionStartTime);
let activeSessionTime = 0;
let activeSessionTimer;

// Initialize session
document.addEventListener('DOMContentLoaded', () => {
  // Load session data from storage
  chrome.storage.local.get(['sessionData'], (result) => {
    if (result.sessionData) {
      const data = result.sessionData;
      isTracking = data.isTracking;
      sessionStartTime = new Date(data.sessionStartTime);
      sessionStartTimeFormatted = formatTime(sessionStartTime);
      activeSessionTime = data.activeSessionTime || 0;
      
      // Update UI
      updateTrackingUI();
      updateSessionStartUI();
      
      if (data.wordCount) {
        wordCount.textContent = data.wordCount;
      }
      
      if (data.currentField) {
        fieldName.textContent = data.currentField.name || 'essay-submission-form';
        fieldUrl.textContent = data.currentField.url || 'canvas.university.edu/assignments/24601';
      }
      
      if (data.selectedCourse) {
        classSelect.value = data.selectedCourse;
      }
      
      if (data.selectedAssignment) {
        assignmentSelect.value = data.selectedAssignment;
      }
    } else {
      // Initialize new session
      initializeNewSession();
    }
    
    // Start timer if tracking is active
    if (isTracking) {
      startTimer();
    }
  });
});

// Event Listeners
toggleBtn.addEventListener('click', toggleTracking);
resetBtn.addEventListener('click', initializeNewSession);
settingsIcon.addEventListener('click', openOptions);
classSelect.addEventListener('change', saveSelections);
assignmentSelect.addEventListener('change', saveSelections);

// Functions
function toggleTracking() {
  isTracking = !isTracking;
  updateTrackingUI();
  saveSessionData();
  
  if (isTracking) {
    startTimer();
  } else {
    clearInterval(activeSessionTimer);
  }
  
  // Send message to background script
  chrome.runtime.sendMessage({
    action: 'track_toggle',
    state: isTracking ? 'on' : 'off',
    timestamp: new Date().toISOString()
  });
}

function updateTrackingUI() {
  if (isTracking) {
    toggleBtn.textContent = 'Pause Tracking';
    trackingStatus.className = 'status-indicator status-active';
    trackingStatus.innerHTML = '<div class="status-dot"></div><div>Active</div>';
  } else {
    toggleBtn.textContent = 'Resume Tracking';
    trackingStatus.className = 'status-indicator status-paused';
    trackingStatus.innerHTML = '<div class="status-dot"></div><div>Paused</div>';
  }
}

function updateSessionStartUI() {
  sessionStart.textContent = `Started today at ${sessionStartTimeFormatted}`;
}

function initializeNewSession() {
  // Reset session data
  isTracking = true;
  sessionStartTime = new Date();
  sessionStartTimeFormatted = formatTime(sessionStartTime);
  activeSessionTime = 0;
  
  // Update UI
  updateTrackingUI();
  updateSessionStartUI();
  wordCount.textContent = '0';
  activeTime.textContent = '00:00';
  
  // Clear timer and start new one
  clearInterval(activeSessionTimer);
  startTimer();
  
  // Save new session
  saveSessionData();
  
  // Create new session key
  createNewSession();
}

function startTimer() {
  // Clear any existing timer
  clearInterval(activeSessionTimer);
  
  // Start new timer
  activeSessionTimer = setInterval(() => {
    if (isTracking) {
      activeSessionTime += 1;
      updateTimeDisplay();
    }
  }, 1000);
}

function updateTimeDisplay() {
  const minutes = Math.floor(activeSessionTime / 60);
  const seconds = activeSessionTime % 60;
  activeTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function formatTime(date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes.toString().padStart(2, '0');
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
}

function saveSelections() {
  saveSessionData();
}

function saveSessionData() {
  const sessionData = {
    isTracking,
    sessionStartTime: sessionStartTime.toISOString(),
    activeSessionTime,
    wordCount: parseInt(wordCount.textContent),
    currentField: {
      name: fieldName.textContent,
      url: fieldUrl.textContent
    },
    selectedCourse: classSelect.value,
    selectedAssignment: assignmentSelect.value
  };
  
  chrome.storage.local.set({ sessionData });
}

function openOptions() {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
}

// Update field info when content script sends updates
chrome.runtime.onMessage.addListener((message, sender, response) => {
  if (message.from === 'content' && message.subject === 'update_field_info') {
    fieldName.textContent = message.data.elementName || message.data.elementID || 'essay-submission-form';
    fieldUrl.textContent = message.data.hostname || 'canvas.university.edu/assignments/24601';
    saveSessionData();
  }
  
  if (message.from === 'content' && message.subject === 'update_word_count') {
    wordCount.textContent = message.data.count;
    saveSessionData();
  }
});