// DOM Elements
const startSessionBtn = document.getElementById('start-session-btn');
const submitSessionBtn = document.getElementById('submit-session-btn');
const discardSessionBtn = document.getElementById('discard-session-btn');
const settingsIcon = document.querySelector('.settings-icon');
const wordCount = document.getElementById('word-count');
const activeTime = document.getElementById('active-time');
const sessionStart = document.getElementById('session-start');
const fieldName = document.getElementById('field-name');
const fieldUrl = document.getElementById('field-url');
const classSelect = document.getElementById('class-select');
const assignmentSelect = document.getElementById('assignment-select');
const currentCourse = document.getElementById('current-course');
const currentAssignment = document.getElementById('current-assignment');
const preSessionView = document.getElementById('pre-session-view');
const activeSessionView = document.getElementById('active-session-view');

// Session data
let sessionActive = false;
let sessionStartTime = null;
let sessionStartTimeFormatted = '';
let activeSessionTime = 0;
let activeSessionTimer;
let keystrokeData = [];

// Assignment data structure
const assignmentOptions = {
  cs101: [
    { value: 'cs101-hw1', label: 'Homework 1: Intro to Programming' },
    { value: 'cs101-hw2', label: 'Homework 2: Variables and Data Types' },
    { value: 'cs101-hw3', label: 'Homework 3: Control Structures' },
    { value: 'cs101-proj1', label: 'Project 1: Simple Calculator' },
    { value: 'cs101-midterm', label: 'Midterm Project' },
    { value: 'cs101-final', label: 'Final Project: Text-based Game' }
  ],
  cs201: [
    { value: 'cs201-hw1', label: 'Homework 1: Arrays and Lists' },
    { value: 'cs201-hw2', label: 'Homework 2: Stacks and Queues' },
    { value: 'cs201-hw3', label: 'Homework 3: Trees and Graphs' },
    { value: 'cs201-proj1', label: 'Project: Custom Data Structure' },
    { value: 'cs201-final', label: 'Final Project: Advanced Data Structure Implementation' }
  ],
  cs310: [
    { value: 'cs310-hw1', label: 'Homework 1: Algorithm Analysis' },
    { value: 'cs310-hw2', label: 'Homework 2: Sorting Algorithms' },
    { value: 'cs310-hw3', label: 'Homework 3: Graph Algorithms' },
    { value: 'cs310-proj1', label: 'Project: Algorithm Implementation' },
    { value: 'cs310-final', label: 'Final Project: Algorithm Optimization' }
  ],
  cs450: [
    { value: 'cs450-hw1', label: 'Homework 1: Processes and Threads' },
    { value: 'cs450-hw2', label: 'Homework 2: Memory Management' },
    { value: 'cs450-hw3', label: 'Homework 3: File Systems' },
    { value: 'cs450-proj1', label: 'Project: Shell Implementation' },
    { value: 'cs450-final', label: 'Final Project: Mini OS Component' }
  ],
  eng101: [
    { value: 'eng101-essay1', label: 'Essay 1: Personal Narrative' },
    { value: 'eng101-essay2', label: 'Essay 2: Comparative Analysis' },
    { value: 'eng101-essay3', label: 'Essay 3: Argumentative Paper' },
    { value: 'eng101-final', label: 'Final Portfolio' }
  ],
  eng201: [
    { value: 'eng201-essay1', label: 'Midterm Research Paper' },
    { value: 'eng201-essay2', label: 'Literary Analysis' },
    { value: 'eng201-essay3', label: 'Critical Response Essay' },
    { value: 'eng201-annotated', label: 'Annotated Bibliography' },
    { value: 'eng201-final', label: 'Final Thesis Draft' }
  ],
  eng305: [
    { value: 'eng305-story1', label: 'Short Story 1' },
    { value: 'eng305-story2', label: 'Short Story 2' },
    { value: 'eng305-poetry', label: 'Poetry Collection' },
    { value: 'eng305-novel', label: 'Novel Chapter' },
    { value: 'eng305-final', label: 'Final Portfolio' }
  ],
  hist150: [
    { value: 'hist150-paper1', label: 'Paper 1: Industrial Revolution' },
    { value: 'hist150-paper2', label: 'Paper 2: World War Analysis' },
    { value: 'hist150-paper3', label: 'Paper 3: Cold War Impact' },
    { value: 'hist150-midterm', label: 'Midterm Paper' },
    { value: 'hist150-final', label: 'Final Research Paper' }
  ],
  hist210: [
    { value: 'hist210-paper1', label: 'Paper 1: Colonial America' },
    { value: 'hist210-paper2', label: 'Paper 2: Civil War Analysis' },
    { value: 'hist210-paper3', label: 'Paper 3: 20th Century America' },
    { value: 'hist210-final', label: 'Final Research Project' }
  ],
  hist320: [
    { value: 'hist320-paper1', label: 'Paper 1: Renaissance Period' },
    { value: 'hist320-paper2', label: 'Paper 2: French Revolution' },
    { value: 'hist320-paper3', label: 'Paper 3: European Imperialism' },
    { value: 'hist320-final', label: 'Final Research Thesis' }
  ],
  math101: [
    { value: 'math101-hw1', label: 'Homework 1: Linear Equations' },
    { value: 'math101-hw2', label: 'Homework 2: Quadratics' },
    { value: 'math101-hw3', label: 'Homework 3: Functions' },
    { value: 'math101-final', label: 'Final Problem Set' }
  ],
  math201: [
    { value: 'math201-hw1', label: 'Homework 1: Limits' },
    { value: 'math201-hw2', label: 'Homework 2: Derivatives' },
    { value: 'math201-hw3', label: 'Homework 3: Integrals' },
    { value: 'math201-proj', label: 'Applied Calculus Project' },
    { value: 'math201-final', label: 'Final Problem Set' }
  ],
  phys101: [
    { value: 'phys101-hw1', label: 'Homework 1: Mechanics' },
    { value: 'phys101-hw2', label: 'Homework 2: Energy' },
    { value: 'phys101-hw3', label: 'Homework 3: Waves' },
    { value: 'phys101-lab1', label: 'Lab Report 1' },
    { value: 'phys101-lab2', label: 'Lab Report 2' },
    { value: 'phys101-final', label: 'Final Lab Project' }
  ],
  psyc220: [
    { value: 'psyc220-paper1', label: 'Paper 1: Perception and Attention' },
    { value: 'psyc220-paper2', label: 'Paper 2: Memory Systems' },
    { value: 'psyc220-paper3', label: 'Paper 3: Decision Making' },
    { value: 'psyc220-study', label: 'Research Study Design' },
    { value: 'psyc220-final', label: 'Final Research Paper' }
  ]
};

// Initialize 
document.addEventListener('DOMContentLoaded', () => {
  // Set up class select change handler
  classSelect.addEventListener('change', updateAssignmentOptions);
  updateAssignmentOptions(); // Initialize assignment options
  
  // Check if there's an active session
  chrome.storage.local.get(['sessionData'], (result) => {
    if (result.sessionData && result.sessionData.sessionActive) {
      // Restore active session
      restoreActiveSession(result.sessionData);
    }
  });
  
  // Event Listeners
  startSessionBtn.addEventListener('click', startSession);
  submitSessionBtn.addEventListener('click', submitSession);
  discardSessionBtn.addEventListener('click', discardSession);
  settingsIcon.addEventListener('click', openOptions);
});

// Functions
function updateAssignmentOptions() {
  const selectedClass = classSelect.value;
  assignmentSelect.innerHTML = '<option value="">Select an assignment...</option>';
  
  if (selectedClass && assignmentOptions[selectedClass]) {
    assignmentOptions[selectedClass].forEach(assignment => {
      const option = document.createElement('option');
      option.value = assignment.value;
      option.textContent = assignment.label;
      assignmentSelect.appendChild(option);
    });
  }
}

function startSession() {
  const selectedClass = classSelect.value;
  const selectedAssignment = assignmentSelect.value;
  
  if (!selectedClass || !selectedAssignment) {
    alert('Please select both a course and an assignment before starting the session.');
    return;
  }
  
  // Set up session data
  sessionActive = true;
  sessionStartTime = new Date();
  sessionStartTimeFormatted = formatTime(sessionStartTime);
  activeSessionTime = 0;
  keystrokeData = [];
  
  // Update UI
  preSessionView.style.display = 'none';
  activeSessionView.style.display = 'block';
  updateSessionStartUI();
  
  // Display selected course and assignment
  const courseName = classSelect.options[classSelect.selectedIndex].text;
  const assignmentName = assignmentSelect.options[assignmentSelect.selectedIndex].text;
  currentCourse.textContent = courseName;
  currentAssignment.textContent = assignmentName;
  
  // Start timer
  startTimer();
  
  // Save session data
  saveSessionData();
  
  // Notify background script to start tracking
  chrome.runtime.sendMessage({
    action: 'session_started',
    data: {
      course: selectedClass,
      courseName: courseName,
      assignment: selectedAssignment,
      assignmentName: assignmentName,
      timestamp: sessionStartTime.toISOString()
    }
  });
}

function restoreActiveSession(sessionData) {
  // Restore session variables
  sessionActive = sessionData.sessionActive;
  sessionStartTime = new Date(sessionData.sessionStartTime);
  sessionStartTimeFormatted = formatTime(sessionStartTime);
  activeSessionTime = sessionData.activeSessionTime || 0;
  
  // Update UI elements
  preSessionView.style.display = 'none';
  activeSessionView.style.display = 'block';
  updateSessionStartUI();
  
  if (sessionData.wordCount) {
    wordCount.textContent = sessionData.wordCount;
  }
  
  if (sessionData.currentField) {
    fieldName.textContent = sessionData.currentField.name || '--';
    fieldUrl.textContent = sessionData.currentField.url || '--';
  }
  
  if (sessionData.currentCourse) {
    currentCourse.textContent = sessionData.currentCourse;
  }
  
  if (sessionData.currentAssignment) {
    currentAssignment.textContent = sessionData.currentAssignment;
  }
  
  // Start timer
  startTimer();
}

function submitSession() {
  // Stop timer
  clearInterval(activeSessionTimer);
  
  // Request keystroke data from storage
  chrome.storage.local.get(['keystrokeData'], (result) => {
    if (result.keystrokeData && result.keystrokeData.data) {
      // Generate session report
      const sessionReport = {
        course: currentCourse.textContent,
        assignment: currentAssignment.textContent,
        sessionStart: sessionStartTime.toISOString(),
        sessionDuration: activeSessionTime,
        wordCount: wordCount.textContent,
        keystrokeData: result.keystrokeData.data
      };
      
      // Convert to CSV and download
      const csv = generateReportCSV(sessionReport);
      downloadCSV(csv, `authentia_report_${Date.now()}.csv`);
      
      // Reset session
      resetSession();
    } else {
      alert('No keystroke data found for this session.');
    }
  });
}

function discardSession() {
  // Confirm with user before discarding
  if (confirm('Are you sure you want to discard this session? All data will be lost.')) {
    // Reset session state
    resetSession();
    
    // Show confirmation
    alert('Session has been discarded.');
  }
}

function generateReportCSV(sessionReport) {
  // Generate report header with session metadata
  let csv = 'SESSION REPORT\n';
  csv += `Course,${sessionReport.course}\n`;
  csv += `Assignment,${sessionReport.assignment}\n`;
  csv += `Session Start,${sessionReport.sessionStart}\n`;
  csv += `Session Duration (seconds),${sessionReport.sessionDuration}\n`;
  csv += `Word Count,${sessionReport.wordCount}\n\n`;
  
  // Add keystroke data
  csv += 'EVENT TYPE,KEY,TIMESTAMP,HOSTNAME,ELEMENT ID,ELEMENT NAME\n';
  
  sessionReport.keystrokeData.forEach(dataRow => {
    const sanitizedRow = dataRow.map(field => {
      // Sanitize fields for CSV (wrap in quotes, escape quotes)
      if (typeof field === 'string') {
        return `"${field.replace(/"/g, '""')}"`;
      }
      return field;
    });
    csv += sanitizedRow.join(',') + '\n';
  });
  
  return csv;
}

function downloadCSV(csv, filename) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function resetSession() {
  // Reset session state
  sessionActive = false;
  sessionStartTime = null;
  activeSessionTime = 0;
  
  // Clear stored data
  chrome.storage.local.remove(['sessionData', 'keystrokeData']);
  
  // Show pre-session view
  preSessionView.style.display = 'block';
  activeSessionView.style.display = 'none';
  
  // Notify background script
  chrome.runtime.sendMessage({ action: 'session_ended' });
}

function startTimer() {
  // Clear any existing timer
  clearInterval(activeSessionTimer);
  
  // Start new timer
  activeSessionTimer = setInterval(() => {
    activeSessionTime += 1;
    updateTimeDisplay();
    
    // Save session data periodically (every 10 seconds)
    if (activeSessionTime % 10 === 0) {
      saveSessionData();
    }
  }, 1000);
}

function updateTimeDisplay() {
  const minutes = Math.floor(activeSessionTime / 60);
  const seconds = activeSessionTime % 60;
  activeTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateSessionStartUI() {
  sessionStart.textContent = `Started today at ${sessionStartTimeFormatted}`;
}

function formatTime(date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes.toString().padStart(2, '0');
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
}

function saveSessionData() {
  const sessionData = {
    sessionActive,
    sessionStartTime: sessionStartTime?.toISOString(),
    activeSessionTime,
    wordCount: parseInt(wordCount.textContent),
    currentField: {
      name: fieldName.textContent,
      url: fieldUrl.textContent
    },
    currentCourse: currentCourse.textContent,
    currentAssignment: currentAssignment.textContent
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

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, response) => {
  if (message.from === 'content' && message.subject === 'update_field_info') {
    fieldName.textContent = message.data.elementName || message.data.elementID || '--';
    fieldUrl.textContent = message.data.hostname || '--';
    saveSessionData();
  }
  
  if (message.from === 'content' && message.subject === 'update_word_count') {
    wordCount.textContent = message.data.count;
    saveSessionData();
  }
  
  // Handle Google Docs detection
  if (message.from === 'content' && message.subject === 'google_doc_detected' && !sessionActive) {
    // This will make the extension popup show when a Google Doc is opened
    chrome.action.openPopup();
  }
});