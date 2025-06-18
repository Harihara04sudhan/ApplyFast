# Form AutoFill Assistant

A powerful Chrome extension that automatically fills job and internship application forms with your saved personal data.

## 🚀 Features

### ✨ Core Functionality
- **Intelligent Form Detection**: Automatically detects and categorizes form fields using multiple strategies (name, ID, placeholder, label text)
- **Auto-Fill Forms**: One-click form filling for job applications, internship forms, and contact forms
- **Secure Local Storage**: All data stored securely in your browser using Chrome's storage API
- **Multiple Profile Support**: (Coming soon) Support for different profiles for jobs vs internships

### 🎯 Smart Field Matching
The extension intelligently matches form fields using:
- Field names (`first_name`, `firstName`, `First Name`)
- Field IDs and classes
- Placeholder text
- Associated label text
- Input types (email, tel, url)

### 🛡️ Privacy & Security
- **100% Local Storage**: No data sent to external servers
- **Secure Chrome Storage**: Uses Chrome's built-in secure storage
- **No Tracking**: Extension doesn't track your browsing or form submissions

### ⚙️ Customization Options
- Enable/disable auto-fill per site
- Adjustable fill speed to avoid anti-bot detection
- Notification preferences
- Export/import data for backup

## 📦 Installation

1. **Download/Clone** this repository
2. **Open Chrome** and navigate to `chrome://extensions/`
3. **Enable Developer Mode** (toggle in top-right corner)
4. **Click "Load unpacked"** and select the extension folder
5. **Pin the extension** to your toolbar for easy access

## 🎮 Usage

### First Time Setup
1. Click the extension icon in your toolbar
2. Go to the **Profile** tab
3. Fill in your personal information, education, and work experience
4. Click **Save Profile**

### Filling Forms
1. Navigate to any job application or form page
2. Click the extension icon
3. Click **Fill Form** button
4. Watch as your information is automatically filled!

### Managing Settings
- **Auto-fill**: Toggle automatic filling when pages load
- **Fill Speed**: Adjust delay between fields (higher = safer)
- **Site Management**: Disable auto-fill for specific websites
- **Notifications**: Control when you see success/error messages

## 🔧 Technical Details

### File Structure
```
form_filler/
├── manifest.json          # Extension configuration (Manifest V3)
├── background.js          # Service worker for extension lifecycle
├── content.js            # Content script for form detection/filling
├── popup.html            # Extension popup interface
├── popup.css             # Popup styling
├── popup.js              # Popup functionality
├── icons/                # Extension icons
└── README.md             # This file
```

### Field Mapping Categories

**Personal Information**
- Names (first, last, full)
- Contact info (email, phone, address)
- Location (city, state, zip, country)

**Education**
- University/College
- Degree and Major
- GPA and graduation info

**Work Experience**
- Current/previous companies
- Job titles and positions
- Years of experience
- Skills and technologies
- Professional URLs (LinkedIn, GitHub, Portfolio)

### Extension Permissions
- `activeTab`: Access to current tab for form filling
- `storage`: Local data storage
- `scripting`: Inject content scripts for form interaction

## 🛠️ Development

### Prerequisites
- Google Chrome or Chromium browser
- Basic knowledge of JavaScript/HTML/CSS

### Local Development
1. Make changes to any source files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Test your changes

### Adding New Field Types
1. Update `FIELD_MAPPINGS` in `content.js`
2. Add corresponding data structure in `background.js`
3. Update the profile form in `popup.html`
4. Add form handling in `popup.js`

## 📋 Supported Websites

The extension works on most job application sites including:
- Company career pages
- Job boards (Indeed, LinkedIn, etc.)
- Application tracking systems (ATS)
- Contact and registration forms
- University application portals

## 🔮 Roadmap

- [ ] **Multiple Profiles**: Separate profiles for different job types
- [ ] **Form Templates**: Pre-built templates for common application types
- [ ] **Data Validation**: Smart validation of filled data
- [ ] **Form Completion Tracking**: Track which forms you've filled
- [ ] **Advanced Field Detection**: AI-powered field recognition
- [ ] **Browser Sync**: Sync data across Chrome installations
- [ ] **Dark Mode**: Dark theme support

## 🐛 Troubleshooting

### Extension Not Working?
1. **Check Permissions**: Ensure the extension has access to the current site
2. **Reload Extension**: Go to `chrome://extensions/` and reload
3. **Check Console**: Open DevTools and look for error messages
4. **Site Compatibility**: Some sites block automated form filling

### Forms Not Filling?
1. **Click Detect Fields**: Check if fields are being detected
2. **Adjust Fill Speed**: Increase delay in settings
3. **Manual Fill**: Use the Fill Form button manually
4. **Check Field Names**: Some sites use unusual field naming

### Data Not Saving?
1. **Storage Permissions**: Ensure storage permission is granted
2. **Browser Storage**: Check if browser storage is full
3. **Profile Data**: Verify data in the Profile tab

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This extension is designed to help automate repetitive form filling tasks. Users are responsible for:
- Ensuring data accuracy before submission
- Complying with website terms of service
- Respecting site-specific anti-automation policies
- Reviewing all filled information before submitting applications

## 📞 Support

- **Issues**: Report bugs or request features via GitHub Issues
- **Questions**: Check the troubleshooting section above
- **Documentation**: All features documented in this README

---

**Made with ❤️ for job seekers everywhere**

*Save time on repetitive form filling and focus on what matters - landing your dream job!*
