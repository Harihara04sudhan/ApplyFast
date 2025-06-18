// Popup script for Form AutoFill Assistant
// Handles UI interactions and communication with background script

console.log('Form AutoFill Assistant - Popup script loaded');

// DOM elements
const elements = {
  // Tab navigation
  tabButtons: document.querySelectorAll('.tab-button'),
  tabContents: document.querySelectorAll('.tab-content'),
  
  // Status indicator
  statusIndicator: document.getElementById('statusIndicator'),
  statusDot: document.querySelector('.status-dot'),
  statusText: document.querySelector('.status-text'),
  
  // Quick actions
  fillFormBtn: document.getElementById('fillFormBtn'),
  detectFieldsBtn: document.getElementById('detectFieldsBtn'),
  fieldInfo: document.getElementById('fieldInfo'),
  fieldCount: document.getElementById('fieldCount'),
  fieldList: document.getElementById('fieldList'),
  
  // Profile management
  activeProfile: document.getElementById('activeProfile'),
  createProfileBtn: document.getElementById('createProfileBtn'),
  
  // Site management
  toggleSiteBtn: document.getElementById('toggleSiteBtn'),
  toggleSiteText: document.getElementById('toggleSiteText'),
  
  // Profile form fields
  firstName: document.getElementById('firstName'),
  lastName: document.getElementById('lastName'),
  email: document.getElementById('email'),
  phone: document.getElementById('phone'),
  address: document.getElementById('address'),
  city: document.getElementById('city'),
  university: document.getElementById('university'),
  degree: document.getElementById('degree'),
  major: document.getElementById('major'),
  gpa: document.getElementById('gpa'),
  currentCompany: document.getElementById('currentCompany'),
  currentPosition: document.getElementById('currentPosition'),
  yearsOfExperience: document.getElementById('yearsOfExperience'),
  linkedinUrl: document.getElementById('linkedinUrl'),
  skills: document.getElementById('skills'),
  
  // Profile actions
  saveProfileBtn: document.getElementById('saveProfileBtn'),
  resetProfileBtn: document.getElementById('resetProfileBtn'),
  
  // Settings
  autoFillEnabled: document.getElementById('autoFillEnabled'),
  showNotifications: document.getElementById('showNotifications'),
  fillDelay: document.getElementById('fillDelay'),
  fillDelayValue: document.getElementById('fillDelayValue'),
  siteList: document.getElementById('siteList'),
  
  // Settings actions
  saveSettingsBtn: document.getElementById('saveSettingsBtn'),
  exportDataBtn: document.getElementById('exportDataBtn'),
  importDataBtn: document.getElementById('importDataBtn'),
  importFileInput: document.getElementById('importFileInput'),
  
  // Help
  helpLink: document.getElementById('helpLink')
};

// Application state
let currentProfile = null;
let currentSettings = null;
let currentTab = null;

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Popup DOM loaded, initializing...');
  
  try {
    await initializePopup();
    setupEventListeners();
    console.log('Popup initialized successfully');
  } catch (error) {
    console.error('Error initializing popup:', error);
    updateStatus('Error', 'error');
  }
});

// Initialize popup data and UI
async function initializePopup() {
  // Get current tab info
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  currentTab = tabs[0];
  
  // Load profile and settings
  await loadActiveProfile();
  await loadSettings();
  
  // Update UI
  updateProfileForm();
  updateSettingsForm();
  updateSiteToggleButton();
  
  updateStatus('Ready', 'success');
}

// Setup event listeners
function setupEventListeners() {
  // Tab navigation
  elements.tabButtons.forEach(button => {
    button.addEventListener('click', () => switchTab(button.dataset.tab));
  });
  
  // Quick actions
  elements.fillFormBtn.addEventListener('click', fillCurrentForm);
  elements.detectFieldsBtn.addEventListener('click', detectFormFields);
  
  // Profile management
  elements.activeProfile.addEventListener('change', switchProfile);
  elements.createProfileBtn.addEventListener('click', createNewProfile);
  
  // Site management
  elements.toggleSiteBtn.addEventListener('click', toggleCurrentSite);
  
  // Profile form
  elements.saveProfileBtn.addEventListener('click', saveProfile);
  elements.resetProfileBtn.addEventListener('click', resetProfile);
  
  // Settings
  elements.fillDelay.addEventListener('input', updateFillDelayDisplay);
  elements.saveSettingsBtn.addEventListener('click', saveSettings);
  elements.exportDataBtn.addEventListener('click', exportData);
  elements.importDataBtn.addEventListener('click', () => elements.importFileInput.click());
  elements.importFileInput.addEventListener('change', importData);
  
  // Help
  elements.helpLink.addEventListener('click', showHelp);
}

// Tab switching
function switchTab(tabName) {
  // Update tab buttons
  elements.tabButtons.forEach(button => {
    button.classList.toggle('active', button.dataset.tab === tabName);
  });
  
  // Update tab contents
  elements.tabContents.forEach(content => {
    content.classList.toggle('active', content.id === tabName);
  });
}

// Status management
function updateStatus(text, type = 'success') {
  elements.statusText.textContent = text;
  elements.statusDot.className = `status-dot ${type}`;
}

// Load active profile data
async function loadActiveProfile() {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'getActiveProfile' });
    if (response.success && response.profile) {
      currentProfile = response.profile;
      console.log('Loaded active profile:', currentProfile);
    } else {
      console.error('Failed to load active profile:', response.error);
      updateStatus('Profile Error', 'error');
    }
  } catch (error) {
    console.error('Error loading active profile:', error);
    updateStatus('Connection Error', 'error');
  }
}

// Load settings
async function loadSettings() {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'getSettings' });
    if (response.success && response.settings) {
      currentSettings = response.settings;
      console.log('Loaded settings:', currentSettings);
    } else {
      console.error('Failed to load settings:', response.error);
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
}

// Update profile form with current data
function updateProfileForm() {
  if (!currentProfile || !currentProfile.data) return;
  
  const data = currentProfile.data;
  
  // Personal info
  if (data.personalInfo) {
    elements.firstName.value = data.personalInfo.firstName || '';
    elements.lastName.value = data.personalInfo.lastName || '';
    elements.email.value = data.personalInfo.email || '';
    elements.phone.value = data.personalInfo.phone || '';
    elements.address.value = data.personalInfo.address || '';
    elements.city.value = data.personalInfo.city || '';
  }
  
  // Education
  if (data.education) {
    elements.university.value = data.education.university || '';
    elements.degree.value = data.education.degree || '';
    elements.major.value = data.education.major || '';
    elements.gpa.value = data.education.gpa || '';
  }
  
  // Work experience
  if (data.workExperience) {
    elements.currentCompany.value = data.workExperience.currentCompany || '';
    elements.currentPosition.value = data.workExperience.currentPosition || '';
    elements.yearsOfExperience.value = data.workExperience.yearsOfExperience || '';
    elements.linkedinUrl.value = data.workExperience.linkedinUrl || '';
    elements.skills.value = data.workExperience.skills || '';
  }
}

// Update settings form
function updateSettingsForm() {
  if (!currentSettings) return;
  
  elements.autoFillEnabled.checked = currentSettings.autoFillEnabled || false;
  elements.showNotifications.checked = currentSettings.showNotifications || false;
  elements.fillDelay.value = currentSettings.delayBetweenFields || 100;
  updateFillDelayDisplay();
  
  // Update disabled sites list
  updateDisabledSitesList();
}

// Update fill delay display
function updateFillDelayDisplay() {
  elements.fillDelayValue.textContent = `${elements.fillDelay.value}ms`;
}

// Update disabled sites list
function updateDisabledSitesList() {
  elements.siteList.innerHTML = '';
  
  if (currentSettings.disabledSites && currentSettings.disabledSites.length > 0) {
    currentSettings.disabledSites.forEach(site => {
      const siteItem = document.createElement('div');
      siteItem.className = 'site-item';
      siteItem.innerHTML = `
        <span class="site-name">${site}</span>
        <button class="site-remove" onclick="removeDisabledSite('${site}')">×</button>
      `;
      elements.siteList.appendChild(siteItem);
    });
  } else {
    elements.siteList.innerHTML = '<p style="color: #6b7280; font-size: 12px;">No disabled sites</p>';
  }
}

// Update site toggle button
function updateSiteToggleButton() {
  if (!currentTab || !currentSettings) return;
  
  const currentDomain = new URL(currentTab.url).hostname;
  const isDisabled = currentSettings.disabledSites.includes(currentDomain);
  
  elements.toggleSiteText.textContent = isDisabled ? 'Enable for this site' : 'Disable for this site';
}

// Fill current form
async function fillCurrentForm() {
  try {
    updateStatus('Filling form...', 'warning');
    elements.fillFormBtn.disabled = true;
    
    const response = await chrome.runtime.sendMessage({ action: 'fillForm' });
    
    if (response.success) {
      updateStatus('Form filled!', 'success');
    } else {
      updateStatus('Fill failed', 'error');
      console.error('Fill form error:', response.error);
    }
  } catch (error) {
    console.error('Error filling form:', error);
    updateStatus('Fill error', 'error');
  } finally {
    elements.fillFormBtn.disabled = false;
  }
}

// Detect form fields
async function detectFormFields() {
  try {
    updateStatus('Detecting fields...', 'warning');
    elements.detectFieldsBtn.disabled = true;
    
    const response = await chrome.tabs.sendMessage(currentTab.id, { action: 'detectFields' });
    
    if (response.success) {
      displayDetectedFields(response.fields, response.fieldCount);
      updateStatus(`Found ${response.fieldCount} fields`, 'success');
    } else {
      updateStatus('Detection failed', 'error');
      console.error('Detect fields error:', response.error);
    }
  } catch (error) {
    console.error('Error detecting fields:', error);
    updateStatus('Detection error', 'error');
  } finally {
    elements.detectFieldsBtn.disabled = false;
  }
}

// Display detected fields
function displayDetectedFields(fields, count) {
  elements.fieldCount.textContent = count;
  elements.fieldList.innerHTML = '';
  
  if (fields && fields.length > 0) {
    fields.forEach(field => {
      const fieldItem = document.createElement('div');
      fieldItem.className = 'field-item';
      fieldItem.innerHTML = `
        <span class="field-name">${field.name || field.id || 'unnamed'}</span>
        <span class="field-type">${field.category || 'unknown'}.${field.fieldType || 'unknown'}</span>
      `;
      elements.fieldList.appendChild(fieldItem);
    });
  } else {
    elements.fieldList.innerHTML = '<p style="color: #6b7280;">No fields detected</p>';
  }
  
  elements.fieldInfo.style.display = 'block';
}

// Save profile
async function saveProfile() {
  try {
    updateStatus('Saving profile...', 'warning');
    elements.saveProfileBtn.disabled = true;
    
    // Collect form data
    const profileData = {
      id: currentProfile.id,
      name: currentProfile.name,
      data: {
        personalInfo: {
          firstName: elements.firstName.value,
          lastName: elements.lastName.value,
          fullName: `${elements.firstName.value} ${elements.lastName.value}`.trim(),
          email: elements.email.value,
          phone: elements.phone.value,
          address: elements.address.value,
          city: elements.city.value
        },
        education: {
          university: elements.university.value,
          degree: elements.degree.value,
          major: elements.major.value,
          gpa: elements.gpa.value
        },
        workExperience: {
          currentCompany: elements.currentCompany.value,
          currentPosition: elements.currentPosition.value,
          yearsOfExperience: elements.yearsOfExperience.value,
          linkedinUrl: elements.linkedinUrl.value,
          skills: elements.skills.value
        },
        additional: currentProfile.data.additional || {}
      }
    };
    
    const response = await chrome.runtime.sendMessage({
      action: 'updateProfile',
      profileId: currentProfile.id,
      profileData: profileData
    });
    
    if (response.success) {
      currentProfile = profileData;
      updateStatus('Profile saved!', 'success');
    } else {
      updateStatus('Save failed', 'error');
      console.error('Save profile error:', response.error);
    }
  } catch (error) {
    console.error('Error saving profile:', error);
    updateStatus('Save error', 'error');
  } finally {
    elements.saveProfileBtn.disabled = false;
  }
}

// Reset profile form
function resetProfile() {
  updateProfileForm();
  updateStatus('Profile reset', 'success');
}

// Save settings
async function saveSettings() {
  try {
    updateStatus('Saving settings...', 'warning');
    elements.saveSettingsBtn.disabled = true;
    
    const settings = {
      ...currentSettings,
      autoFillEnabled: elements.autoFillEnabled.checked,
      showNotifications: elements.showNotifications.checked,
      delayBetweenFields: parseInt(elements.fillDelay.value)
    };
    
    const response = await chrome.runtime.sendMessage({
      action: 'updateSettings',
      settings: settings
    });
    
    if (response.success) {
      currentSettings = settings;
      updateStatus('Settings saved!', 'success');
    } else {
      updateStatus('Save failed', 'error');
      console.error('Save settings error:', response.error);
    }
  } catch (error) {
    console.error('Error saving settings:', error);
    updateStatus('Save error', 'error');
  } finally {
    elements.saveSettingsBtn.disabled = false;
  }
}

// Toggle current site
async function toggleCurrentSite() {
  try {
    const currentDomain = new URL(currentTab.url).hostname;
    const isDisabled = currentSettings.disabledSites.includes(currentDomain);
    
    if (isDisabled) {
      // Enable site (remove from disabled list)
      currentSettings.disabledSites = currentSettings.disabledSites.filter(site => site !== currentDomain);
    } else {
      // Disable site (add to disabled list)
      currentSettings.disabledSites.push(currentDomain);
    }
    
    const response = await chrome.runtime.sendMessage({
      action: 'updateSettings',
      settings: currentSettings
    });
    
    if (response.success) {
      updateSiteToggleButton();
      updateDisabledSitesList();
      updateStatus(isDisabled ? 'Site enabled' : 'Site disabled', 'success');
    } else {
      console.error('Toggle site error:', response.error);
    }
  } catch (error) {
    console.error('Error toggling site:', error);
  }
}

// Remove disabled site
window.removeDisabledSite = async function(site) {
  try {
    currentSettings.disabledSites = currentSettings.disabledSites.filter(s => s !== site);
    
    const response = await chrome.runtime.sendMessage({
      action: 'updateSettings',
      settings: currentSettings
    });
    
    if (response.success) {
      updateDisabledSitesList();
      updateSiteToggleButton();
      updateStatus('Site enabled', 'success');
    }
  } catch (error) {
    console.error('Error removing disabled site:', error);
  }
};

// Export data
function exportData() {
  try {
    const exportData = {
      profile: currentProfile,
      settings: currentSettings,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `form-autofill-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    updateStatus('Data exported!', 'success');
  } catch (error) {
    console.error('Error exporting data:', error);
    updateStatus('Export failed', 'error');
  }
}

// Import data
function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = async function(e) {
    try {
      const importData = JSON.parse(e.target.result);
      
      if (importData.profile) {
        const response = await chrome.runtime.sendMessage({
          action: 'updateProfile',
          profileId: importData.profile.id,
          profileData: importData.profile
        });
        
        if (response.success) {
          currentProfile = importData.profile;
          updateProfileForm();
        }
      }
      
      if (importData.settings) {
        const response = await chrome.runtime.sendMessage({
          action: 'updateSettings',
          settings: importData.settings
        });
        
        if (response.success) {
          currentSettings = importData.settings;
          updateSettingsForm();
        }
      }
      
      updateStatus('Data imported!', 'success');
    } catch (error) {
      console.error('Error importing data:', error);
      updateStatus('Import failed', 'error');
    }
  };
  
  reader.readAsText(file);
  
  // Reset file input
  event.target.value = '';
}

// Create new profile (placeholder)
function createNewProfile() {
  alert('Multiple profiles feature coming soon!');
}

// Switch profile (placeholder)
function switchProfile() {
  // This would load a different profile
  console.log('Profile switch requested');
}

// Show help
function showHelp() {
  const helpText = `
Form AutoFill Assistant Help

Quick Actions:
• Fill Form: Automatically fills the current page's form with your saved data
• Detect Fields: Shows what form fields were detected on the page

Profile:
• Edit your personal information, education, and work experience
• Data is stored securely in your browser

Settings:
• Enable/disable automatic filling
• Control fill speed and notifications
• Manage which sites are disabled

Tips:
• The extension works best on job application and contact forms
• You can disable auto-fill for specific sites
• Your data is stored locally and never sent to external servers
  `;
  
  alert(helpText);
}

console.log('Form AutoFill Assistant - Popup script ready');
