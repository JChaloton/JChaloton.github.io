// DOM Elements
const uploadBtn = document.getElementById('uploadBtn');
const accessBtn = document.getElementById('accessBtn');
const accessCode = document.getElementById('accessCode');
const accessDiv = document.getElementById('accessDiv');
const uploadDiv = document.getElementById('uploadDiv');
const schoolHeader = document.getElementById('schoolHeader');
const schoolSubheader = document.getElementById('schoolSubheader');

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
    "AirinK.AH": {
        folder: "Airin",
        schoolName: "ที่อัปโหลดไฟล์สำหรับคนน่ารักที่สุดในโลก"
    }
};

// OneDrive direct links
const ONEDRIVE_LINKS = {
    'Chaiyaphum': 'https://1drv.ms/f/c/1523c4a0f21e9725/EoIkbcih5slGtH1rOIgE4R4BtCh_3wEmOdrQB3ZATE3bFQ?e=7PPDUA',
    'Songkhla': 'https://1drv.ms/f/c/1523c4a0f21e9725/EhqiVQULdGFLgRZlir7AeMoBpqC1kag4xf6J1sgBfxXsTQ?e=LLMDn9',
    'Airin': 'https://1drv.ms/f/c/1523c4a0f21e9725/ElrR_cBPAYNHgeXj6opsliQBVUHKp0BZlOHgx35MaIVmlQ?e=btokkm'
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Event Listeners
    uploadBtn.addEventListener('click', redirectToOneDrive);
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
    
    // Update button text
    uploadBtn.textContent = 'ไปที่หน้าอัปโหลดวิดีโอ';
    
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
}

// Redirect to OneDrive
function redirectToOneDrive() {
    const folder = uploadDiv.dataset.folder;
    
    if (!folder) {
        alert('ไม่พบข้อมูลโรงเรียน โปรดลองเข้าสู่ระบบใหม่อีกครั้ง');
        localStorage.removeItem('schoolAccess');
        location.reload();
        return;
    }
    
    const oneDriveLink = ONEDRIVE_LINKS[folder];
    
    if (!oneDriveLink) {
        alert('ไม่พบลิงก์สำหรับอัปโหลดวิดีโอ โปรดติดต่อคุณจิรพงศ์ ชโลธรพิเศษที่ 0854350566.');
        return;
    }
    // Open OneDrive link in a new tab
    window.open(oneDriveLink, '_blank');
} 