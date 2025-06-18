# How to Test and Use the Form AutoFill Assistant

This guide provides step-by-step instructions on how to save your data and test the form-filling functionality of the extension.

## 1. Loading the Extension in Chrome

If you haven't already, you need to load the extension into your browser:

1.  **Open Chrome** and navigate to `chrome://extensions/`.
2.  **Enable Developer Mode** using the toggle switch in the top-right corner.
3.  Click the **"Load unpacked"** button.
4.  Select the entire `form_filler` directory where you have the project files.
5.  The "Form AutoFill Assistant" should now appear in your list of extensions. Pin it to your toolbar for easy access.

## 2. Saving Your Information for Auto-Filling

Before you can auto-fill any forms, you must first save your personal data within the extension.

1.  **Click the Extension Icon**: Find the Form AutoFill Assistant icon in your Chrome toolbar and click it to open the popup.

2.  **Navigate to the Profile Tab**: The popup has three tabs. Click on **"Profile"** to open the data editor.

3.  **Enter Your Details**: Fill out the form fields provided. This includes:
    *   **Personal Information**: First Name, Last Name, Email, Phone, etc.
    *   **Education**: University, Degree, Major, etc.
    *   **Work Experience**: Company, Position, Skills, etc.

4.  **Save Your Data**: After filling in your details, scroll to the bottom and click the **"Save Profile"** button. Your information is now securely stored in the browser and ready for use.

## 3. How to Test Auto-Filling on a Website

Now you can test the core feature of the extension.

1.  **Find a Test Form**: Open a new browser tab and find a form to test on. You can search for:
    *   "Sample job application form"
    *   "Dummy registration form"
    *   "Test contact form"

2.  **Open the Extension on the Form Page**: With the form visible, click the extension icon in your toolbar.

3.  **Use the "Fill Form" Button**: In the **"Quick Actions"** tab of the popup, click the **"Fill Form"** button.

4.  **Check the Result**: The extension will automatically fill the form fields on the page with the corresponding data you saved in your profile. 

## 4. Using the "Detect Fields" Feature (for Debugging)

If a form isn't filling correctly, you can see what the extension is detecting.

1.  On the form page, open the extension popup.
2.  In the **"Quick Actions"** tab, click the **"Detect Fields"** button.
3.  The popup will display a list of all the form fields it found on the page and how it categorized them (e.g., `personalInfo.firstName`). This is useful for understanding why a specific field might not be filling as expected.

## 5. Managing Settings

You can customize the extension's behavior in the **"Settings"** tab:

*   **Enable/Disable Auto-fill**: You can turn the automatic filling feature on or off.
*   **Disable for a Site**: If you are on a website where you don't want the extension to work, go to the **"Quick Actions"** tab and click **"Disable for this site"**. You can manage the list of disabled sites in the Settings tab.
