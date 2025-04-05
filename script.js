// DOM Elements
const uploadBtn = document.getElementById('uploadBtn');
const accessBtn = document.getElementById('accessBtn');
const accessCode = document.getElementById('accessCode');
const accessDiv = document.getElementById('accessDiv');
const uploadDiv = document.getElementById('uploadDiv');
const schoolHeader = document.getElementById('schoolHeader');
const schoolSubheader = document.getElementById('schoolSubheader');
// Service elements
let oneDriveBtn;
let googleDriveBtn;
let oneDriveInstructions;
let googleDriveInstructions;
let oneDriveLink;
let googleDriveLink;

// Access codes for each school
const ACCESS_CODES = {
    "SongkhlaSign68": {
        folder: "Songkhla",
        schoolName: "โรงเรียนโสตศึกษาจังหวัดสงขลา"
    },
    "ChaiyaphumSign68": {
        folder: "Chaiyaphum",
        schoolName: "โรงเรียนโสตศึกษาจังหวัดชัยภูมิ"
    },
    "NakhonsiSign68": {
        folder: "Nakhonsithammarat",
        schoolName: "โรงเรียนโสตศึกษาจังหวัดนครศรีธรรมราช"
    },
    "AirinK.AH": {
        folder: "Airin",
        schoolName: "คนน่ารักที่สุดในโลก"
    },
    "ChonburiSign68": {
        folder: "Chonburi",
        schoolName: "โรงเรียนโสตศึกษาจังหวัดชลบุรี"
    },
    "SetsatianSign68": {
        folder: "Setsatian",
        schoolName: "โรงเรียนเศรษฐเสถียร"
    }
};

// OneDrive direct links
const ONEDRIVE_LINKS = {
    'Chaiyaphum': 'https://1drv.ms/f/c/1523c4a0f21e9725/EoIkbcih5slGtH1rOIgE4R4BtCh_3wEmOdrQB3ZATE3bFQ?e=7PPDUA',
    'Songkhla': 'https://1drv.ms/f/c/1523c4a0f21e9725/EhqiVQULdGFLgRZlir7AeMoBpqC1kag4xf6J1sgBfxXsTQ?e=LLMDn9',
    'Nakhonsithammarat': 'https://1drv.ms/f/c/1523c4a0f21e9725/Ejf6pr5sLmBImqO2fWjtDyEBXKv4vCKAcJsQrjpvFhUNtQ?e=Qf0sBy',
    'Airin': 'https://1drv.ms/f/c/1523c4a0f21e9725/ElrR_cBPAYNHgeXj6opsliQBVUHKp0BZlOHgx35MaIVmlQ?e=btokkm',
    'Chonburi': 'https://1drv.ms/f/c/1523c4a0f21e9725/EkuqlO7TlbpLtJxxxmGYV8IBcj5oOa7FhpMG_GP2qbbC6g?e=RzsFwV',
    'Setsatian': 'https://1drv.ms/f/c/1523c4a0f21e9725/EjGGOJqGs2RHnTX_SGwz6DUBnpWqMjcS6MDKrHl6jEowmQ?e=6tTk3b'
};

// Google Drive direct links (with the same naming convention)
const GDRIVE_LINKS = {
    'Chaiyaphum': 'https://drive.google.com/drive/folders/1YKVUug1p7cTN4jtkitW13N-thbutPqo_?usp=drive_link',
    'Songkhla': 'https://drive.google.com/drive/folders/14a8XOt06JgE_EeNlP-OMwxKe4zBTRrab?usp=drive_link',
    'Nakhonsithammarat': 'https://drive.google.com/drive/folders/1uHzDR4BW89mAfB5C9a-xqkytWtrtzQL2?usp=drive_link',
    'Airin': 'https://drive.google.com/drive/folders/1iW7-CYpyeEoeTznsrlnKA9hxawcnWjaM?usp=drive_link',
    'Chonburi': 'https://drive.google.com/drive/folders/1iAGSdew5n9ChqypIjjco2V7S_1QTwJlH?usp=drive_link',
    'Setsatian': 'https://drive.google.com/drive/folders/15Zi5J8oTyJn-73hOb8WD3zYRq0nran77?usp=drive_link'
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Get references to elements
    oneDriveBtn = document.getElementById('oneDriveBtn');
    googleDriveBtn = document.getElementById('googleDriveBtn');
    oneDriveInstructions = document.getElementById('oneDriveInstructions');
    googleDriveInstructions = document.getElementById('googleDriveInstructions');
    oneDriveLink = document.getElementById('oneDriveLink');
    googleDriveLink = document.getElementById('googleDriveLink');
    
    // Event Listeners
    if (oneDriveBtn) oneDriveBtn.addEventListener('click', () => toggleServiceInstructions('onedrive'));
    if (googleDriveBtn) googleDriveBtn.addEventListener('click', () => toggleServiceInstructions('gdrive'));
    accessBtn.addEventListener('click', validateAccessCode);
    
    // Check for access code in local storage (for returning users)
    const savedSchool = localStorage.getItem('schoolAccess');
    if (savedSchool) {
        try {
            const schoolData = JSON.parse(savedSchool);
            showUploadForm(schoolData.folder, schoolData.schoolName);
        } catch (e) {
            // If there's any issue, reset the access
            localStorage.removeItem('schoolAccess');
        }
    }
    
    // Add enter key support for the access code input
    accessCode.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            validateAccessCode();
        }
    });
});

// Validate access code
function validateAccessCode() {
    const code = accessCode.value.trim();
    
    // Case insensitive matching for better user experience
    let matchFound = false;
    let matchedCode = null;
    
    // First try exact match
    if (ACCESS_CODES[code]) {
        matchFound = true;
        matchedCode = code;
    } 
    // Then try case-insensitive match
    else {
        const lowerCode = code.toLowerCase();
        for (const validCode of Object.keys(ACCESS_CODES)) {
            if (validCode.toLowerCase() === lowerCode) {
                matchFound = true;
                matchedCode = validCode;
                break;
            }
        }
    }
    
    if (matchFound && matchedCode) {
        const schoolData = ACCESS_CODES[matchedCode];
        
        // Store access in localStorage for convenience
        localStorage.setItem('schoolAccess', JSON.stringify(schoolData));
        showUploadForm(schoolData.folder, schoolData.schoolName);
    } else {
        alert('ใส่รหัสผิด โปรดใส่ใหม่อีกครั้ง');
        accessCode.value = '';
    }
}

// Show upload form after successful access
function showUploadForm(folder, schoolName) {
    // Update the header with school name
    schoolHeader.textContent = schoolName;
    schoolSubheader.textContent = `ตัวอัปโหลดสำหรับ ${schoolName}`;
    
    // Hide access div and show upload div
    accessDiv.style.display = 'none';
    uploadDiv.style.display = 'block';
    
    // Store the folder for later use
    uploadDiv.dataset.folder = folder;
    
    // Update the service links based on the folder
    updateServiceLinks(folder);
}

// Update service links based on selected folder
function updateServiceLinks(folder) {
    const oneDriveUrl = ONEDRIVE_LINKS[folder];
    const gdriveUrl = GDRIVE_LINKS[folder];
    
    if (oneDriveLink && oneDriveUrl) {
        oneDriveLink.href = oneDriveUrl;
    }
    
    if (googleDriveLink && gdriveUrl) {
        googleDriveLink.href = gdriveUrl;
    }
}

// Toggle video instructions for selected service
function toggleServiceInstructions(service) {
    // Get the folder from data attribute
    const folder = uploadDiv.dataset.folder;
    
    if (!folder) {
        alert('ไม่พบข้อมูลโรงเรียน โปรดลองเข้าสู่ระบบใหม่อีกครั้ง');
        localStorage.removeItem('schoolAccess');
        location.reload();
        return;
    }
    
    // Hide all instruction containers first
    if (oneDriveInstructions) oneDriveInstructions.style.display = 'none';
    if (googleDriveInstructions) googleDriveInstructions.style.display = 'none';
    
    // Show the selected service instructions
    if (service === 'onedrive' && oneDriveInstructions) {
        oneDriveInstructions.style.display = 'block';
        // Start or restart the video if it exists
        const video = oneDriveInstructions.querySelector('video');
        if (video) {
            video.currentTime = 0;
            video.play().catch(e => console.log('Video autoplay prevented:', e));
        }
    } else if (service === 'gdrive' && googleDriveInstructions) {
        googleDriveInstructions.style.display = 'block';
        // Start or restart the video if it exists
        const video = googleDriveInstructions.querySelector('video');
        if (video) {
            video.currentTime = 0;
            video.play().catch(e => console.log('Video autoplay prevented:', e));
        }
    }
}

// Legacy functions for backward compatibility
function redirectToService(service) {
    const folder = uploadDiv.dataset.folder;
    
    if (!folder) {
        alert('ไม่พบข้อมูลโรงเรียน โปรดลองเข้าสู่ระบบใหม่อีกครั้ง');
        localStorage.removeItem('schoolAccess');
        location.reload();
        return;
    }
    
    let serviceLink;
    
    if (service === 'onedrive') {
        serviceLink = ONEDRIVE_LINKS[folder];
    } else if (service === 'gdrive') {
        serviceLink = GDRIVE_LINKS[folder];
    }
    
    if (!serviceLink) {
        alert('ไม่พบลิงก์สำหรับอัปโหลดวิดีโอ โปรดติดต่อคุณจิรพงศ์ ชโลธรพิเศษที่ 0854350566.');
        return;
    }
    
    // Open service link in a new tab
    window.open(serviceLink, '_blank');
}

function redirectToOneDrive() {
    redirectToService('onedrive');
} 