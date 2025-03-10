// session-manager.js - Handles session creation, management, and submission

import { updateWordCount } from './word-count.js';
import { formatTime, formatDuration } from './shared.js';

// Session variables
let sessionActive = false;
let sessionStartTime = null;
let sessionStartTimeFormatted = '';
let activeSessionTime = 0;
let activeSessionTimer;
let wordCountUpdater;

// Start a new session
function startSession(courseName, assignmentName, courseValue, assignmentValue) {
  // Set up session data
  sessionActive = true;
  sessionStartTime = new Date();
  sessionStartTimeFormatted = formatTime(sessionStartTime);
  activeSessionTime = 0;
  
  // Create a new citation history
  chrome.storage.local.set({ citationHistory: [] });
  
  // Save session data
  saveSessionData({
    courseName,
    assignmentName,
    courseValue,
    assignmentValue
  });
  
  // Start timers
  startTimer();
  startWordCountUpdater();
  
  // Notify background script
  chrome.runtime.sendMessage({
    action: 'session_started',
    data: {
      course: courseValue,
      courseName: courseName,
      assignment: assignmentValue,
      assignmentName: assignmentName,
      timestamp: sessionStartTime.toISOString()
    }
  });
  
  return {
    sessionActive,
    sessionStartTime,
    sessionStartTimeFormatted
  };
}

// Restore an existing session
function restoreSession(sessionData) {
  // Restore session variables
  sessionActive = sessionData.sessionActive;
  sessionStartTime = new Date(sessionData.sessionStartTime);
  sessionStartTimeFormatted = formatTime(sessionStartTime);
  activeSessionTime = sessionData.activeSessionTime || 0;
  
  // Start timers if session is active
  if (sessionActive) {
    startTimer();
    startWordCountUpdater();
  }
  
  return {
    sessionActive,
    sessionStartTime,
    sessionStartTimeFormatted,
    activeSessionTime
  };
}

// Submit and end the current session
function submitSession() {
  return new Promise((resolve, reject) => {
    // Stop timers
    clearInterval(activeSessionTimer);
    clearInterval(wordCountUpdater);
    
    // Request data from storage
    chrome.storage.local.get(['keystrokeData', 'citationHistory', 'sessionData'], (result) => {
      try {
        const keystrokeData = result.keystrokeData?.data || [];
        const citationHistory = result.citationHistory || [];
        const sessionData = result.sessionData || {};
        
        // Calculate citation stats
        const citedCount = citationHistory.filter(item => item.cited).length;
        
        // Prepare session data for history
        const historyEntry = {
          currentCourse: sessionData.currentCourse,
          currentAssignment: sessionData.currentAssignment,
          sessionStartTime: sessionStartTime.toISOString(),
          activeSessionTime: activeSessionTime,
          wordCount: sessionData.wordCount || 0,
          citationCount: citationHistory.length,
          citedPercentage: citationHistory.length > 0 
            ? Math.round((citedCount / citationHistory.length) * 100) 
            : 0
        };
        
        // Save to session history
        chrome.storage.local.get(['sessionHistory'], (historyResult) => {
          const history = historyResult.sessionHistory || [];
          history.push(historyEntry);
          chrome.storage.local.set({ sessionHistory: history });
        });
        
        // Generate session report
        const sessionReport = {
          course: sessionData.currentCourse,
          assignment: sessionData.currentAssignment,
          sessionStart: sessionStartTime.toISOString(),
          sessionDuration: activeSessionTime,
          wordCount: sessionData.wordCount || 0,
          keystrokeData: keystrokeData,
          citationData: {
            total: citationHistory.length,
            cited: citedCount,
            history: citationHistory
          }
        };
        
        // Reset session
        resetSession();
        
        // Return the session report
        resolve(sessionReport);
      } catch (error) {
        reject(error);
      }
    });
  });
}

// Reset the current session
function resetSession() {
  // Reset session state
  sessionActive = false;
  sessionStartTime = null;
  activeSessionTime = 0;
  
  // Clear intervals
  clearInterval(activeSessionTimer);
  clearInterval(wordCountUpdater);
  
  // Clear stored data
  chrome.storage.local.remove(['sessionData', 'keystrokeData', 'citationHistory']);
  
  // Notify background script
  chrome.runtime.sendMessage({ action: 'session_ended' });
}

// Start session timer
function startTimer() {
  // Clear any existing timer
  clearInterval(activeSessionTimer);
  
  // Start new timer
  activeSessionTimer = setInterval(() => {
    activeSessionTime += 1;
    
    // Publish time update for UI
    const minutes = Math.floor(activeSessionTime / 60);
    const seconds = activeSessionTime % 60;
    const timeDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Dispatch custom event for UI updates
    document.dispatchEvent(new CustomEvent('sessionTimeUpdate', { 
      detail: { timeDisplay, activeSessionTime } 
    }));
    
    // Save session data periodically (every 10 seconds)
    if (activeSessionTime % 10 === 0) {
      saveSessionData();
    }
  }, 1000);
}

// Start word count updater
function startWordCountUpdater() {
  // Clear any existing updater
  clearInterval(wordCountUpdater);
  
  // Start new updater
  wordCountUpdater = setInterval(() => {
    chrome.storage.local.get(['sessionData'], (result) => {
      if (result.sessionData && result.sessionData.wordCount !== undefined) {
        // Dispatch custom event for UI updates
        document.dispatchEvent(new CustomEvent('wordCountUpdate', { 
          detail: { count: result.sessionData.wordCount } 
        }));
      }
    });
  }, 1000);
}

// Save session data to storage
function saveSessionData(details = {}) {
  chrome.storage.local.get(['sessionData'], (result) => {
    const currentData = result.sessionData || {};
    
    const sessionData = {
      ...currentData,
      sessionActive,
      sessionStartTime: sessionStartTime?.toISOString(),
      activeSessionTime,
      ...details
    };
    
    chrome.storage.local.set({ sessionData });
  });
}

// Check if a session is active
function checkSessionActive() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['sessionData'], (result) => {
      const isActive = result.sessionData && result.sessionData.sessionActive === true;
      resolve(isActive);
    });
  });
}

// Get current session data
function getCurrentSessionData() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['sessionData'], (result) => {
      resolve(result.sessionData || {});
    });
  });
}

export {
  startSession,
  restoreSession,
  submitSession,
  resetSession,
  checkSessionActive,
  getCurrentSessionData,
  saveSessionData
};