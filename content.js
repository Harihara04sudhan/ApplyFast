// Content script for Form AutoFill Assistant
// Detects and fills form fields on web pages

console.log('Form AutoFill Assistant - Content script loaded');

// Field mapping configuration for intelligent form detection
const FIELD_MAPPINGS = {
  personalInfo: {
    firstName: [
      'first_name', 'firstname', 'fname', 'first-name',
      'given_name', 'givenname', 'name_first', 'user_first_name',
      'applicant_first_name', 'candidate_first_name'
    ],
    lastName: [
      'last_name', 'lastname', 'lname', 'last-name', 'surname',
      'family_name', 'familyname', 'name_last', 'user_last_name',
      'applicant_last_name', 'candidate_last_name'
    ],
    fullName: [
      'full_name', 'fullname', 'name', 'full-name', 'complete_name',
      'user_name', 'username', 'applicant_name', 'candidate_name',
      'contact_name', 'person_name'
    ],
    email: [
      'email', 'email_address', 'emailaddress', 'email-address',
      'user_email', 'contact_email', 'applicant_email', 'e_mail',
      'mail', 'email_id', 'primary_email'
    ],
    phone: [
      'phone', 'phone_number', 'phonenumber', 'phone-number',
      'mobile', 'mobile_number', 'cell', 'telephone', 'tel',
      'contact_number', 'primary_phone', 'phone_primary'
    ],
    address: [
      'address', 'street_address', 'streetaddress', 'street-address',
      'addr', 'address_line_1', 'address1', 'street', 'location'
    ],
    city: [
      'city', 'town', 'locality', 'city_name', 'address_city'
    ],
    state: [
      'state', 'province', 'region', 'state_province', 'address_state'
    ],
    zipCode: [
      'zip', 'zipcode', 'zip_code', 'postal_code', 'postcode',
      'postal', 'zip-code', 'address_zip'
    ],
    country: [
      'country', 'country_code', 'nationality', 'address_country'
    ]
  },
  education: {
    university: [
      'university', 'college', 'school', 'institution', 'education_school',
      'university_name', 'college_name', 'alma_mater'
    ],
    degree: [
      'degree', 'education_degree', 'qualification', 'education_level',
      'degree_type', 'academic_degree'
    ],
    major: [
      'major', 'field_of_study', 'study_field', 'specialization',
      'area_of_study', 'concentration', 'subject'
    ],
    gpa: [
      'gpa', 'grade_point_average', 'grades', 'cgpa', 'academic_performance'
    ]
  },
  workExperience: {
    currentCompany: [
      'company', 'current_company', 'employer', 'organization',
      'current_employer', 'work_company', 'company_name'
    ],
    currentPosition: [
      'position', 'job_title', 'title', 'role', 'current_position',
      'current_role', 'job_role', 'designation'
    ],
    yearsOfExperience: [
      'experience', 'years_experience', 'work_experience', 'experience_years',
      'total_experience', 'years_of_experience'
    ],
    skills: [
      'skills', 'technical_skills', 'key_skills', 'competencies',
      'expertise', 'abilities', 'skill_set'
    ],
    linkedinUrl: [
      'linkedin', 'linkedin_url', 'linkedin_profile', 'linkedin-url',
      'social_linkedin', 'linkedin_link'
    ],
    githubUrl: [
      'github', 'github_url', 'github_profile', 'github-url',
      'github_username', 'github_link'
    ],
    portfolioUrl: [
      'portfolio', 'portfolio_url', 'website', 'personal_website',
      'portfolio_link', 'portfolio-url'
    ]
  }
};

// Enhanced field detection with multiple strategies
class FormFieldDetector {
  constructor() {
    this.detectedFields = new Map();
  }

  // Main detection method that combines multiple strategies
  detectFields() {
    this.detectedFields.clear();
    
    const allInputs = document.querySelectorAll('input, textarea, select');
    
    allInputs.forEach(field => {
      const fieldInfo = this.analyzeField(field);
      if (fieldInfo.category && fieldInfo.type) {
        this.detectedFields.set(field, fieldInfo);
      }
    });
    
    console.log('Detected fields:', this.detectedFields);
    return this.detectedFields;
  }

  // Analyze individual field to determine its purpose
  analyzeField(field) {
    const strategies = [
      () => this.detectByName(field),
      () => this.detectById(field),
      () => this.detectByPlaceholder(field),
      () => this.detectByLabel(field),
      () => this.detectByAriaLabel(field),
      () => this.detectByType(field)
    ];

    for (const strategy of strategies) {
      const result = strategy();
      if (result.category && result.type) {
        return result;
      }
    }

    return { category: null, type: null };
  }

  // Detection by name attribute
  detectByName(field) {
    const name = field.name?.toLowerCase() || '';
    return this.matchFieldName(name);
  }

  // Detection by id attribute
  detectById(field) {
    const id = field.id?.toLowerCase() || '';
    return this.matchFieldName(id);
  }

  // Detection by placeholder text
  detectByPlaceholder(field) {
    const placeholder = field.placeholder?.toLowerCase() || '';
    return this.matchFieldName(placeholder);
  }

  // Detection by associated label
  detectByLabel(field) {
    let labelText = '';
    
    // Try to find label by for attribute
    if (field.id) {
      const label = document.querySelector(`label[for="${field.id}"]`);
      if (label) {
        labelText = label.textContent?.toLowerCase() || '';
      }
    }
    
    // Try to find parent label
    if (!labelText) {
      const parentLabel = field.closest('label');
      if (parentLabel) {
        labelText = parentLabel.textContent?.toLowerCase() || '';
      }
    }
    
    // Clean up label text (remove colons, asterisks, etc.)
    labelText = labelText.replace(/[*:()]/g, '').trim();
    
    return this.matchFieldName(labelText);
  }

  // Detection by aria-label
  detectByAriaLabel(field) {
    const ariaLabel = field.getAttribute('aria-label')?.toLowerCase() || '';
    return this.matchFieldName(ariaLabel);
  }

  // Detection by input type
  detectByType(field) {
    const type = field.type?.toLowerCase();
    
    switch (type) {
      case 'email':
        return { category: 'personalInfo', type: 'email' };
      case 'tel':
        return { category: 'personalInfo', type: 'phone' };
      case 'url':
        // Could be portfolio, LinkedIn, GitHub - would need more context
        return { category: null, type: null };
      default:
        return { category: null, type: null };
    }
  }

  // Match field name against known patterns
  matchFieldName(fieldName) {
    fieldName = fieldName.replace(/[_\-\s]/g, '').toLowerCase();
    
    for (const [category, types] of Object.entries(FIELD_MAPPINGS)) {
      for (const [type, patterns] of Object.entries(types)) {
        for (const pattern of patterns) {
          const cleanPattern = pattern.replace(/[_\-\s]/g, '').toLowerCase();
          if (fieldName.includes(cleanPattern) || cleanPattern.includes(fieldName)) {
            return { category, type };
          }
        }
      }
    }
    
    return { category: null, type: null };
  }
}

// Form filler class
class FormFiller {
  constructor() {
    this.detector = new FormFieldDetector();
    this.fillDelay = 100; // Delay between filling fields
  }

  // Fill form with provided data
  async fillForm(profileData) {
    try {
      console.log('Starting form fill with data:', profileData);
      
      const detectedFields = this.detector.detectFields();
      
      if (detectedFields.size === 0) {
        console.log('No form fields detected');
        this.showNotification('No form fields detected on this page', 'warning');
        return false;
      }

      let filledCount = 0;
      
      for (const [field, fieldInfo] of detectedFields) {
        const value = this.getValueForField(fieldInfo, profileData);
        
        if (value && this.isFieldFillable(field)) {
          await this.fillField(field, value);
          filledCount++;
          
          // Add delay between fields to avoid triggering anti-bot measures
          if (this.fillDelay > 0) {
            await new Promise(resolve => setTimeout(resolve, this.fillDelay));
          }
        }
      }
      
      console.log(`Filled ${filledCount} fields`);
      this.showNotification(`Successfully filled ${filledCount} fields`, 'success');
      
      return filledCount > 0;
    } catch (error) {
      console.error('Error filling form:', error);
      this.showNotification('Error filling form: ' + error.message, 'error');
      return false;
    }
  }

  // Get value for field based on its type and category
  getValueForField(fieldInfo, profileData) {
    const { category, type } = fieldInfo;
    
    if (!profileData[category] || !profileData[category][type]) {
      return null;
    }
    
    return profileData[category][type];
  }

  // Check if field can and should be filled
  isFieldFillable(field) {
    // Don't fill hidden fields, disabled fields, or readonly fields
    if (field.type === 'hidden' || field.disabled || field.readOnly) {
      return false;
    }
    
    // Don't fill fields that already have content (unless it's placeholder text)
    if (field.value && field.value !== field.placeholder) {
      return false;
    }
    
    // Don't fill password fields, submit buttons, etc.
    const skipTypes = ['password', 'submit', 'button', 'reset', 'file'];
    if (skipTypes.includes(field.type)) {
      return false;
    }
    
    return true;
  }

  // Fill individual field with value
  async fillField(field, value) {
    try {
      // Focus the field first
      field.focus();
      
      // Clear existing value
      field.value = '';
      
      // For select elements, try to find matching option
      if (field.tagName === 'SELECT') {
        const options = Array.from(field.options);
        const matchingOption = options.find(option => 
          option.text.toLowerCase().includes(value.toLowerCase()) ||
          option.value.toLowerCase().includes(value.toLowerCase())
        );
        
        if (matchingOption) {
          field.value = matchingOption.value;
        }
      } else {
        // For input and textarea elements
        field.value = value;
      }
      
      // Trigger events to notify the page that the field was filled
      field.dispatchEvent(new Event('input', { bubbles: true }));
      field.dispatchEvent(new Event('change', { bubbles: true }));
      field.dispatchEvent(new Event('blur', { bubbles: true }));
      
      console.log(`Filled field ${field.name || field.id} with value: ${value}`);
    } catch (error) {
      console.error('Error filling field:', error);
    }
  }

  // Show notification to user
  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 16px;
      border-radius: 6px;
      color: white;
      font-family: Arial, sans-serif;
      font-size: 14px;
      z-index: 10000;
      max-width: 300px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transition: opacity 0.3s ease;
    `;
    
    // Set color based on type
    switch (type) {
      case 'success':
        notification.style.backgroundColor = '#10b981';
        break;
      case 'warning':
        notification.style.backgroundColor = '#f59e0b';
        break;
      case 'error':
        notification.style.backgroundColor = '#ef4444';
        break;
      default:
        notification.style.backgroundColor = '#3b82f6';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
}

// Initialize form filler
const formFiller = new FormFiller();

// Listen for messages from background script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Content script received message:', request);
  
  switch (request.action) {
    case 'fillFormWithData':
      formFiller.fillForm(request.profileData)
        .then(success => sendResponse({ success }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      break;
    case 'detectFields':
      const fields = formFiller.detector.detectFields();
      sendResponse({ 
        success: true, 
        fieldCount: fields.size,
        fields: Array.from(fields.entries()).map(([field, info]) => ({
          tag: field.tagName,
          name: field.name,
          id: field.id,
          type: field.type,
          category: info.category,
          fieldType: info.type
        }))
      });
      break;
    default:
      console.warn('Unknown action:', request.action);
  }
  
  return true; // Keep message channel open for async response
});

// Auto-detect and fill on page load (if enabled)
window.addEventListener('load', async () => {
  try {
    // Wait a bit for dynamic content to load
    setTimeout(async () => {
      const response = await chrome.runtime.sendMessage({ action: 'getSettings' });
      if (response.success && response.settings.autoFillEnabled) {
        // Check if current site is not disabled
        const currentDomain = window.location.hostname;
        if (!response.settings.disabledSites.includes(currentDomain)) {
          const fields = formFiller.detector.detectFields();
          if (fields.size > 0) {
            console.log('Auto-fill conditions met, requesting form fill');
            chrome.runtime.sendMessage({ action: 'fillForm' });
          }
        }
      }
    }, 2000);
  } catch (error) {
    console.error('Error in auto-fill check:', error);
  }
});

console.log('Form AutoFill Assistant - Content script ready');
