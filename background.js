// Background script for Form AutoFill Assistant
// Handles extension lifecycle and cross-tab communication

console.log('Form AutoFill Assistant - Background script loaded');

// Extension installation/update handler
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed/updated:', details.reason);
  
  if (details.reason === 'install') {
    // Initialize default settings on first install
    initializeDefaultData();
  }
});

// Initialize default user data structure
async function initializeDefaultData() {
  try {
    const existingData = await chrome.storage.local.get(['userProfiles', 'settings']);
    
    if (!existingData.userProfiles) {
      const defaultProfile = {
        id: 'default',
        name: 'Default Profile',
        data: {
          personalInfo: {
            firstName: '',
            lastName: '',
            fullName: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
            dateOfBirth: '',
            gender: '',
            nationality: ''
          },
          education: {
            highSchool: '',
            university: '',
            degree: '',
            major: '',
            graduationDate: '',
            gpa: '',
            certifications: ''
          },
          workExperience: {
            currentCompany: '',
            currentPosition: '',
            yearsOfExperience: '',
            previousCompany: '',
            previousPosition: '',
            skills: '',
            linkedinUrl: '',
            githubUrl: '',
            portfolioUrl: ''
          },
          additional: {
            coverLetter: '',
            references: '',
            salary: '',
            availability: '',
            workAuthorization: '',
            willingToRelocate: ''
          }
        }
      };
      
      await chrome.storage.local.set({
        userProfiles: [defaultProfile],
        activeProfile: 'default'
      });
    }
    
    if (!existingData.settings) {
      await chrome.storage.local.set({
        settings: {
          autoFillEnabled: true,
          delayBetweenFields: 100,
          showNotifications: true,
          disabledSites: []
        }
      });
    }
    
    console.log('Default data initialized');
  } catch (error) {
    console.error('Error initializing default data:', error);
  }
}

// Handle messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received message:', request);
  
  switch (request.action) {
    case 'fillForm':
      handleFillForm(request, sender, sendResponse);
      break;
    case 'getActiveProfile':
      handleGetActiveProfile(sendResponse);
      break;
    case 'updateProfile':
      handleUpdateProfile(request, sendResponse);
      break;
    case 'getSettings':
      handleGetSettings(sendResponse);
      break;
    case 'updateSettings':
      handleUpdateSettings(request, sendResponse);
      break;
    default:
      console.warn('Unknown action:', request.action);
  }
  
  return true; // Keep message channel open for async response
});

// Handle form filling request
async function handleFillForm(request, sender, sendResponse) {
  try {
    const { activeProfile } = await chrome.storage.local.get('activeProfile');
    const { userProfiles } = await chrome.storage.local.get('userProfiles');
    
    const profile = userProfiles.find(p => p.id === activeProfile);
    if (!profile) {
      sendResponse({ success: false, error: 'No active profile found' });
      return;
    }
    
    // Send profile data to content script
    chrome.tabs.sendMessage(sender.tab.id, {
      action: 'fillFormWithData',
      profileData: profile.data
    });
    
    sendResponse({ success: true });
  } catch (error) {
    console.error('Error handling fill form:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// Handle get active profile
async function handleGetActiveProfile(sendResponse) {
  try {
    const { activeProfile, userProfiles } = await chrome.storage.local.get(['activeProfile', 'userProfiles']);
    const profile = userProfiles.find(p => p.id === activeProfile);
    sendResponse({ success: true, profile });
  } catch (error) {
    console.error('Error getting active profile:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// Handle profile update
async function handleUpdateProfile(request, sendResponse) {
  try {
    const { userProfiles } = await chrome.storage.local.get('userProfiles');
    const profileIndex = userProfiles.findIndex(p => p.id === request.profileId);
    
    if (profileIndex !== -1) {
      userProfiles[profileIndex] = { ...userProfiles[profileIndex], ...request.profileData };
      await chrome.storage.local.set({ userProfiles });
      sendResponse({ success: true });
    } else {
      sendResponse({ success: false, error: 'Profile not found' });
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// Handle get settings
async function handleGetSettings(sendResponse) {
  try {
    const { settings } = await chrome.storage.local.get('settings');
    sendResponse({ success: true, settings });
  } catch (error) {
    console.error('Error getting settings:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// Handle settings update
async function handleUpdateSettings(request, sendResponse) {
  try {
    await chrome.storage.local.set({ settings: request.settings });
    sendResponse({ success: true });
  } catch (error) {
    console.error('Error updating settings:', error);
    sendResponse({ success: false, error: error.message });
  }
}
