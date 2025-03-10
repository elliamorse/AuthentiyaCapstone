// ui-manager.js - Handles UI updates and view management

import { updateCitationStats, markAsCited } from './citation-manager.js';
import { formatTime, formatDuration } from './shared.js';

// DOM Elements - to be initialized with setupUI()
let elements = {};

// Initialize UI references
function setupUI() {
  elements = {
    // Views
    preSessionView: document.getElementById('pre-session-view'),
    activeSessionView: document.getElementById('active-session-view'),
    citationsView: document.getElementById('citations-view'),
    historyView: document.getElementById('history-view'),
    settingsView: document.getElementById('settings-view'),
    
    // Form elements
    classSelect: document.getElementById('class-select'),
    assignmentSelect: document.getElementById('assignment-select'),
    
    // Session info elements
    wordCount: document.getElementById('word-count'),
    activeTime: document.getElementById('active-time'),
    sessionStart: document.getElementById('session-start'),
    fieldName: document.getElementById('field-name'),
    fieldUrl: document.getElementById('field-url'),
    currentCourse: document.getElementById('current-course'),
    currentAssignment: document.getElementById('current-assignment'),
    
    // Citation elements
    copyPasteCount: document.getElementById('copy-paste-count'),
    citedPercentage: document.getElementById('cited-percentage'),
    citationItems: document.getElementById('citation-items'),
    
    // History elements
    sessionHistoryItems: document.getElementById('session-history-items'),
    
    // Settings elements
    themeToggle: document.getElementById('theme-toggle'),
    
    // Buttons
    startSessionBtn: document.getElementById('start-session-btn'),
    submitSessionBtn: document.getElementById('submit-session-btn'),
    settingsIcon: document.querySelector('.settings-icon'),
    backFromSettingsBtn: document.getElementById('back-from-settings-btn'),
    backToSessionBtn: document.getElementById('back-to-session-btn'),
    backToMainBtn: document.getElementById('back-to-main-btn'),
    tabButtons: document.querySelectorAll('.tab-btn')
  };
  
  return elements;
}

// Show a specific view
function showView(viewName) {
  // Hide all views
  elements.preSessionView.style.display = 'none';
  elements.activeSessionView.style.display = 'none';
  elements.citationsView.style.display = 'none';
  elements.historyView.style.display = 'none';
  elements.settingsView.style.display = 'none';
  
  // Show the requested view
  switch(viewName) {
    case 'pre-session':
      elements.preSessionView.style.display = 'block';
      break;
    case 'active-session':
      elements.activeSessionView.style.display = 'block';
      break;
    case 'citations':
      elements.citationsView.style.display = 'block';
      updateCitationStatsUI();
      break;
    case 'history':
      elements.historyView.style.display = 'block';
      loadSessionHistoryUI();
      break;
    case 'settings':
      elements.settingsView.style.display = 'block';
      break;
    default:
      elements.preSessionView.style.display = 'block';
  }
  
  // Update active tab if it's a tab view
  if (['active-session', 'citations', 'history'].includes(viewName)) {
    elements.tabButtons.forEach(btn => {
      if (btn.getAttribute('data-view') === viewName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
}

// Update citation stats in the UI
function updateCitationStatsUI() {
  updateCitationStats().then(({ history, stats }) => {
    // Update statistics
    elements.copyPasteCount.textContent = stats.total;
    elements.citedPercentage.textContent = `${stats.percentage}%`;
    
    // Clear existing items
    elements.citationItems.innerHTML = '';
    
    // Add citation history items
    if (history.length === 0) {
      elements.citationItems.innerHTML = '<div class="empty-state">No copy/paste events detected</div>';
    } else {
      history.forEach((item, index) => {
        const citationItem = document.createElement('div');
        citationItem.className = `citation-item ${item.cited ? 'cited' : 'uncited'}`;
        
        // Truncate long text
        const displayText = item.text.length > 50 
          ? item.text.substring(0, 47) + '...' 
          : item.text;
        
        citationItem.innerHTML = `
          <div class="citation-item-text">${displayText}</div>
          <div class="citation-item-url">${new URL(item.url).hostname}</div>
          <div class="citation-item-status">
            ${item.cited ? 'Cited ✓' : 'Not cited ✗'}
          </div>
        `;
        
        if (!item.cited) {
          const citeButton = document.createElement('button');
          citeButton.className = 'cite-button';
          citeButton.textContent = 'Mark as Cited';
          citeButton.addEventListener('click', () => {
            markAsCited(index).then(() => {
              updateCitationStatsUI();
            });
          });
          citationItem.appendChild(citeButton);
        }
        
        elements.citationItems.appendChild(citationItem);
      });
    }
  });
}

// Load session history in the UI
function loadSessionHistoryUI() {
  chrome.storage.local.get(['sessionHistory'], (result) => {
    const history = result.sessionHistory || [];
    
    // Clear existing items
    elements.sessionHistoryItems.innerHTML = '';
    
    // Add session history items
    if (history.length === 0) {
      elements.sessionHistoryItems.innerHTML = '<div class="empty-state">No past sessions</div>';
    } else {
      history.forEach(session => {
        const historyItem = document.createElement('div');
        historyItem.className = 'session-history-item';
        
        const date = new Date(session.sessionStartTime);
        const formattedDate = `${date.toLocaleDateString()} at ${formatTime(date)}`;
        
        historyItem.innerHTML = `
          <div class="session-history-course">${session.currentCourse}</div>
          <div class="session-history-assignment">${session.currentAssignment}</div>
          <div class="session-history-date">${formattedDate}</div>
          <div class="session-history-stats">
            <div class="session-history-stat">
              <div class="session-history-stat-label">Words</div>
              <div class="session-history-stat-value">${session.wordCount || 0}</div>
            </div>
            <div class="session-history-stat">
              <div class="session-history-stat-label">Time</div>
              <div class="session-history-stat-value">${formatDuration(session.activeSessionTime || 0)}</div>
            </div>
            <div class="session-history-stat">
              <div class="session-history-stat-label">Citations</div>
              <div class="session-history-stat-value">${session.citationCount || 0}</div>
            </div>
          </div>
        `;
        
        elements.sessionHistoryItems.appendChild(historyItem);
      });
    }
  });
}

// Update field information in the UI
function updateFieldInfo(data) {
  elements.fieldName.textContent = data.elementName || data.elementID || '--';
  elements.fieldUrl.textContent = data.hostname || new URL(data.url).hostname || '--';
}

// Update word count in the UI
function updateWordCountUI(count) {
  elements.wordCount.textContent = count;
}

// Update time display in the UI
function updateTimeUI(timeDisplay) {
  elements.activeTime.textContent = timeDisplay;
}

// Update session start info in the UI
function updateSessionStartUI(formattedTime) {
  elements.sessionStart.textContent = `Started today at ${formattedTime}`;
}

// Update course and assignment in the UI
function updateCourseAssignmentUI(course, assignment) {
  elements.currentCourse.textContent = course;
  elements.currentAssignment.textContent = assignment;
}

export {
  setupUI,
  showView,
  updateCitationStatsUI,
  loadSessionHistoryUI,
  updateFieldInfo,
  updateWordCountUI,
  updateTimeUI,
  updateSessionStartUI,
  updateCourseAssignmentUI,
  elements
};