// DOM Elements
const uploadBtn = document.getElementById('uploadBtn');
const accessBtn = document.getElementById('accessBtn');
const accessCode = document.getElementById('accessCode');
const accessDiv = document.getElementById('accessDiv');
const uploadDiv = document.getElementById('uploadDiv');
const schoolHeader = document.getElementById('schoolHeader');
const schoolSubheader = document.getElementById('schoolSubheader');

// Debug function if exists in page
function debugLog(message) {
    console.log(message);
    if (typeof logDebug === 'function') {
        logDebug(message);
    }
}

// Debugging - Log DOM elements to make sure they're found
debugLog('DOM Elements loaded:');
debugLog(JSON.stringify({
    uploadBtn: !!uploadBtn,
    accessBtn: !!accessBtn,
    accessCode: !!accessCode,
    accessDiv: !!accessDiv,
    uploadDiv: !!uploadDiv,
    schoolHeader: !!schoolHeader,
    schoolSubheader: !!schoolSubheader
}, null, 2));

// Access codes for each school - Make available globally for debugging
window.ACCESS_CODES = {
    "SongkhlaSign68": {
        folder: "Songkhla",
        schoolName: "Songkhla School for the Deaf"
    },
    "ChaiyaphumSign68": {
        folder: "Chaiyaphum",
        schoolName: "Chaiyaphum School for the Deaf"
    }
};

// Debug - Log access codes
debugLog('Access codes loaded:');
debugLog(JSON.stringify(Object.keys(window.ACCESS_CODES), null, 2));

// OneDrive direct links
const ONEDRIVE_LINKS = {
    'Chaiyaphum': 'https://1drv.ms/f/c/1523c4a0f21e9725/EoIkbcih5slGtH1rOIgE4R4BtCh_3wEmOdrQB3ZATE3bFQ?e=7PPDUA',
    'Songkhla': 'https://1drv.ms/f/c/1523c4a0f21e9725/EhqiVQULdGFLgRZlir7AeMoBpqC1kag4xf6J1sgBfxXsTQ?e=LLMDn9'
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    debugLog('DOM Content Loaded - Main init function running');
    
    // Event Listeners
    uploadBtn.addEventListener('click', redirectToOneDrive);
    accessBtn.addEventListener('click', validateAccessCode);
    
    debugLog('Event listeners attached');
    
    // Check for access code in local storage (for returning users)
    const savedSchool = localStorage.getItem('schoolAccess');
    debugLog('Saved school from localStorage: ' + savedSchool);
    if (savedSchool) {
        try {
            const schoolData = JSON.parse(savedSchool);
            showUploadForm(schoolData.folder, schoolData.schoolName);
        } catch (e) {
            // If there's any issue, reset the access
            localStorage.removeItem('schoolAccess');
            debugLog('Error parsing saved school data: ' + e.message);
        }
    }
    
    // Update button text
    uploadBtn.textContent = 'Go to OneDrive Upload';
    
    // Add enter key support for the access code input
    accessCode.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            validateAccessCode();
        }
    });
    
    debugLog('Initialization completed');
});

// Validate access code
function validateAccessCode() {
    const code = accessCode.value.trim();
    debugLog('Validating access code: "' + code + '"');
    debugLog('Available codes: ' + JSON.stringify(Object.keys(window.ACCESS_CODES)));
    
    // Case insensitive matching for better user experience
    let matchFound = false;
    let matchedCode = null;
    
    // First try exact match
    if (window.ACCESS_CODES[code]) {
        matchFound = true;
        matchedCode = code;
    } 
    // Then try case-insensitive match
    else {
        const lowerCode = code.toLowerCase();
        for (const validCode of Object.keys(window.ACCESS_CODES)) {
            if (validCode.toLowerCase() === lowerCode) {
                matchFound = true;
                matchedCode = validCode;
                break;
            }
        }
    }
    
    if (matchFound && matchedCode) {
        debugLog('✅ Valid access code found: ' + matchedCode);
        const schoolData = window.ACCESS_CODES[matchedCode];
        
        // Store access in localStorage for convenience
        localStorage.setItem('schoolAccess', JSON.stringify(schoolData));
        showUploadForm(schoolData.folder, schoolData.schoolName);
    } else {
        debugLog('❌ Invalid access code');
        alert('Invalid access code. Please try again.');
        accessCode.value = '';
    }
}

// Show upload form after successful access
function showUploadForm(folder, schoolName) {
    debugLog('Showing upload form for: ' + schoolName + ' (folder: ' + folder + ')');
    
    // Update the header with school name
    schoolHeader.textContent = schoolName;
    schoolSubheader.textContent = `Video Upload Portal for ${schoolName}`;
    
    // Hide access div and show upload div
    accessDiv.style.display = 'none';
    uploadDiv.style.display = 'block';
    
    // Store the folder for later use
    uploadDiv.dataset.folder = folder;
    
    debugLog('Upload form displayed');
}

// Redirect to OneDrive
function redirectToOneDrive() {
    const folder = uploadDiv.dataset.folder;
    debugLog('Redirecting to OneDrive for folder: ' + folder);
    
    if (!folder) {
        debugLog('❌ No folder found in dataset');
        alert('School information not found. Please try logging in again.');
        localStorage.removeItem('schoolAccess');
        location.reload();
        return;
    }
    
    const oneDriveLink = ONEDRIVE_LINKS[folder];
    debugLog('OneDrive link: ' + oneDriveLink);
    
    if (!oneDriveLink) {
        debugLog('❌ No OneDrive link found for folder: ' + folder);
        alert('OneDrive link not found for your school. Please contact Jirapong Chalotonpised, 0854350566.');
        return;
    }
    
    // Show instructions to the user
    debugLog('Showing redirect instructions');
    alert(`You will now be redirected to OneDrive where you can upload your files directly.\n\nPlease follow these steps:\n1. Click on "Upload" in the OneDrive interface\n2. Select your files\n3. Click "Open" to start the upload\n\nNote: OneDrive will show its own progress indicator while your files are uploading. Please wait until your files are fully uploaded before closing the OneDrive window.`);
    
    // Open OneDrive link in a new tab
    debugLog('Opening OneDrive link: ' + oneDriveLink);
    window.open(oneDriveLink, '_blank');
} 