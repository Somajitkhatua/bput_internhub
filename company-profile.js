// Get user data from localStorage
let currentUser = null;
let userType = null;
let currentChatStudent = null;
let shortlistedCandidates = [];
let isEditMode = false;

// Pre-populated shortlisted candidates (increased from 5 to 12)
const initialShortlistedCandidates = [
    {
        name: "Vikram Malhotra",
        position: "Full Stack Developer",
        email: "vikram.malhotra@example.com",
        phone: "+91 9876543211",
        education: "B.Tech, CSE",
        university: "IIT Delhi",
        location: "Delhi, India",
        shortlistedDate: "10/15/2023"
    },
    {
        name: "Neha Gupta",
        position: "Data Scientist",
        email: "neha.gupta@example.com",
        phone: "+91 9876543212",
        education: "M.Sc, Data Science",
        university: "IISc Bangalore",
        location: "Bangalore, India",
        shortlistedDate: "10/14/2023"
    },
    {
        name: "Arjun Nair",
        position: "Cloud Engineer",
        email: "arjun.nair@example.com",
        phone: "+91 9876543213",
        education: "B.Tech, IT",
        university: "NIT Trichy",
        location: "Chennai, India",
        shortlistedDate: "10/13/2023"
    },
    {
        name: "Kavya Reddy",
        position: "Product Designer",
        email: "kavya.reddy@example.com",
        phone: "+91 9876543214",
        education: "B.Des, UX Design",
        university: "NID Ahmedabad",
        location: "Ahmedabad, India",
        shortlistedDate: "10/12/2023"
    },
    {
        name: "Rohit Sharma",
        position: "DevOps Engineer",
        email: "rohit.sharma@example.com",
        phone: "+91 9876543215",
        education: "B.Tech, CSE",
        university: "IIIT Hyderabad",
        location: "Hyderabad, India",
        shortlistedDate: "10/11/2023"
    },
    {
        name: "Priya Menon",
        position: "Machine Learning Engineer",
        email: "priya.menon@example.com",
        phone: "+91 9876543216",
        education: "M.Tech, AI",
        university: "IIT Bombay",
        location: "Mumbai, India",
        shortlistedDate: "10/10/2023"
    },
    {
        name: "Amitabh Singh",
        position: "Frontend Developer",
        email: "amitabh.singh@example.com",
        phone: "+91 9876543217",
        education: "B.Tech, CSE",
        university: "BIT Mesra",
        location: "Ranchi, India",
        shortlistedDate: "10/9/2023"
    },
    {
        name: "Sneha Kapoor",
        position: "Backend Developer",
        email: "sneha.kapoor@example.com",
        phone: "+91 9876543218",
        education: "B.Tech, IT",
        university: "JNU",
        location: "New Delhi, India",
        shortlistedDate: "10/8/2023"
    },
    {
        name: "Karan Patel",
        position: "Android Developer",
        email: "karan.patel@example.com",
        phone: "+91 9876543219",
        education: "B.Tech, CSE",
        university: "NIT Surat",
        location: "Surat, India",
        shortlistedDate: "10/7/2023"
    },
    {
        name: "Divya Sharma",
        position: "UI/UX Designer",
        email: "divya.sharma@example.com",
        phone: "+91 9876543220",
        education: "B.Des, Graphic Design",
        university: "MIT ID",
        location: "Pune, India",
        shortlistedDate: "10/6/2023"
    },
    {
        name: "Rahul Verma",
        position: "Data Analyst",
        email: "rahul.verma@example.com",
        phone: "+91 9876543221",
        education: "B.Sc, Statistics",
        university: "Delhi University",
        location: "Delhi, India",
        shortlistedDate: "10/5/2023"
    },
    {
        name: "Anjali Nair",
        position: "Quality Assurance Engineer",
        email: "anjali.nair@example.com",
        phone: "+91 9876543222",
        education: "B.Tech, IT",
        university: "Cochin University",
        location: "Kochi, India",
        shortlistedDate: "10/4/2023"
    }
];

document.addEventListener('DOMContentLoaded', function() {
    const savedUser = localStorage.getItem('currentUser');
    const savedUserType = localStorage.getItem('userType');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    if (savedUser && savedUserType) {
        currentUser = JSON.parse(savedUser);
        userType = savedUserType;
        updateProfileData();
        initializeCharts();
        initializeTheme(savedTheme);
        loadShortlistedCandidates();
    } else {
        // Set default company data if not logged in
        currentUser = {
            name: "TechCorp Solutions",
            industry: "IT/Software Development",
            email: "hr@techcorp.com",
            phone: "9876543210",
            address: "Plot No. 123, Tech Park, Bhubaneswar, Odisha, India - 751024",
            website: "www.techcorp.com"
        };
        updateProfileData();
        initializeCharts();
        initializeTheme(savedTheme);
        loadShortlistedCandidates();
    }
});

// Initialize theme
function initializeTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
}

// Theme toggle functionality
document.getElementById('themeToggle').addEventListener('click', function() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    // Update charts for theme change
    updateChartsTheme();
});

function updateThemeIcon(theme) {
    const themeIcon = document.getElementById('themeIcon');
    if (theme === 'dark') {
        themeIcon.className = 'fas fa-moon';
    } else {
        themeIcon.className = 'fas fa-sun';
    }
}

// Update profile data with user information
function updateProfileData() {
    if (!currentUser) return;
    
    document.getElementById('companyName').textContent = currentUser.name;
    document.getElementById('companyNameHeader').textContent = currentUser.name;
    document.getElementById('companyIndustry').textContent = currentUser.industry;
    document.getElementById('companyLocation').textContent = currentUser.address;
    document.getElementById('companyWebsite').textContent = currentUser.website || 'www.techcorp.com';
    document.getElementById('companyEmail').textContent = currentUser.email;
    document.getElementById('companyPhone').textContent = currentUser.phone || '+91 9876543210';
    
    // Update form fields
    document.getElementById('profileCompanyName').value = currentUser.name;
    document.getElementById('profileCompanyIndustry').value = currentUser.industry;
    document.getElementById('profileCompanyEmail').value = currentUser.email;
    document.getElementById('profileCompanyPhone').value = currentUser.phone || '9876543210';
    document.getElementById('profileCompanyAddress').value = currentUser.address;
    document.getElementById('profileCompanyWebsite').value = currentUser.website || '';
    document.getElementById('profileCompanyDescription').value = 'We are a leading technology company focused on innovation and excellence in software development and AI solutions.';
}

// Show specific section
function showSection(section) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(el => {
        el.style.display = 'none';
    });
    
    // Show selected section
    document.getElementById(section + '-section').style.display = 'block';
    
    // Update active nav link
    document.querySelectorAll('.nav-menu-item').forEach(el => {
        el.classList.remove('active');
    });
    
    event.target.classList.add('active');
}

// Toggle edit mode for company profile
function toggleEditMode() {
    isEditMode = !isEditMode;
    const formFields = document.querySelectorAll('#companyProfileForm input, #companyProfileForm select, #companyProfileForm textarea');
    const editIcon = document.getElementById('editIcon');
    const editText = document.getElementById('editText');
    const saveButtonContainer = document.getElementById('saveButtonContainer');
    
    if (isEditMode) {
        formFields.forEach(field => field.disabled = false);
        editIcon.className = 'fas fa-times me-1';
        editText.textContent = 'Cancel';
        saveButtonContainer.style.display = 'block';
    } else {
        formFields.forEach(field => field.disabled = true);
        editIcon.className = 'fas fa-edit me-1';
        editText.textContent = 'Edit';
        saveButtonContainer.style.display = 'none';
    }
}

// Save company profile
function saveProfile() {
    const updatedData = {
        name: document.getElementById('profileCompanyName').value,
        industry: document.getElementById('profileCompanyIndustry').value,
        email: document.getElementById('profileCompanyEmail').value,
        phone: document.getElementById('profileCompanyPhone').value,
        address: document.getElementById('profileCompanyAddress').value,
        website: document.getElementById('profileCompanyWebsite').value,
        description: document.getElementById('profileCompanyDescription').value
    };
    
    // Update currentUser with new data
    currentUser = { ...currentUser, ...updatedData };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update UI
    updateProfileData();
    toggleEditMode();
    
    // Show success message
    showNotification('Profile updated successfully!', 'success');
}

// View student profile
function viewProfile(studentName, position) {
    document.getElementById('modalStudentName').textContent = studentName;
    document.getElementById('modalStudentPosition').textContent = position;
    
    // Generate random student data
    document.getElementById('modalStudentEmail').textContent = `${studentName.toLowerCase().replace(' ', '.')}@example.com`;
    document.getElementById('modalStudentPhone').textContent = '+91 ' + Math.floor(Math.random() * 9000000000 + 1000000000);
    document.getElementById('modalStudentEducation').textContent = 'B.Tech, ' + (position.includes('Frontend') ? 'CSE' : position.includes('ML') ? 'ECE' : position.includes('Android') ? 'IT' : position.includes('UI/UX') ? 'B.Des, NIFT' : 'CSE');
    document.getElementById('modalStudentUniversity').textContent = 'BPUT';
    document.getElementById('modalStudentLocation').textContent = 'Bhubaneswar, India';
    document.getElementById('modalStudentResume').textContent = `${studentName.replace(' ', '_')}_Resume.pdf`;
    
    // Update skills based on position
    const skillsContainer = document.getElementById('modalStudentSkills');
    let skills = [];
    
    if (position.includes('Frontend')) {
        skills = ['JavaScript', 'React', 'Vue.js', 'CSS', 'HTML', 'TypeScript'];
    } else if (position.includes('ML')) {
        skills = ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy'];
    } else if (position.includes('Android')) {
        skills = ['Kotlin', 'Java', 'Android Studio', 'Firebase', 'REST APIs'];
    } else if (position.includes('Backend')) {
        skills = ['Node.js', 'Express', 'MongoDB', 'SQL', 'Docker', 'AWS'];
    } else if (position.includes('UI/UX')) {
        skills = ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research'];
    }
    
    skillsContainer.innerHTML = skills.map(skill => 
        `<span class="badge bg-primary me-2 mb-2">${skill}</span>`
    ).join('');
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('studentProfileModal'));
    modal.show();
}

// Shortlist candidate
function shortlistCandidate(studentName, position) {
    // Check if already shortlisted
    if (shortlistedCandidates.some(c => c.name === studentName)) {
        showNotification('Candidate already shortlisted!', 'warning');
        return;
    }
    
    // Add to shortlisted candidates
    const candidate = {
        name: studentName,
        position: position,
        email: `${studentName.toLowerCase().replace(' ', '.')}@example.com`,
        phone: '+91 ' + Math.floor(Math.random() * 9000000000 + 1000000000),
        education: 'B.Tech, ' + (position.includes('Frontend') ? 'CSE' : position.includes('ML') ? 'ECE' : position.includes('Android') ? 'IT' : position.includes('UI/UX') ? 'B.Des, NIFT' : 'CSE'),
        university: 'BPUT',
        location: 'Bhubaneswar, India',
        shortlistedDate: new Date().toLocaleDateString()
    };
    
    shortlistedCandidates.push(candidate);
    localStorage.setItem('shortlistedCandidates', JSON.stringify(shortlistedCandidates));
    
    // Update UI
    loadShortlistedCandidates();
    
    // Show success message
    showNotification(`${studentName} has been shortlisted!`, 'success');
}

// Shortlist from modal
function shortlistFromModal() {
    const studentName = document.getElementById('modalStudentName').textContent;
    const position = document.getElementById('modalStudentPosition').textContent;
    
    shortlistCandidate(studentName, position);
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('studentProfileModal'));
    modal.hide();
}

// Load shortlisted candidates
function loadShortlistedCandidates() {
    const savedCandidates = localStorage.getItem('shortlistedCandidates');
    if (savedCandidates) {
        shortlistedCandidates = JSON.parse(savedCandidates);
    } else {
        // Load initial candidates if none saved
        shortlistedCandidates = [...initialShortlistedCandidates];
        localStorage.setItem('shortlistedCandidates', JSON.stringify(shortlistedCandidates));
    }
    
    const container = document.getElementById('shortlistedContainer');
    container.innerHTML = '';
    
    if (shortlistedCandidates.length === 0) {
        container.innerHTML = '<p class="text-center text-secondary">No shortlisted candidates yet.</p>';
        return;
    }
    
    shortlistedCandidates.forEach(candidate => {
        const candidateElement = document.createElement('div');
        candidateElement.className = 'application-item';
        candidateElement.innerHTML = `
            <div class="application-header">
                <div class="application-name">${candidate.name} - ${candidate.position}</div>
                <div class="application-status status-shortlisted">Shortlisted</div>
            </div>
            <div class="application-meta">
                <span><i class="fas fa-graduation-cap"></i> ${candidate.education}</span>
                <span><i class="fas fa-calendar"></i> ${candidate.shortlistedDate}</span>
            </div>
            <div class="application-actions">
                <button class="btn-sm-custom btn-primary-sm" onclick="scheduleInterview('${candidate.name}', '${candidate.position}')">Schedule Interview</button>
                <button class="btn-sm-custom btn-outline-sm" onclick="viewProfile('${candidate.name}', '${candidate.position}')">View Profile</button>
                <button class="btn-sm-custom btn-outline-sm" onclick="openChat('${candidate.name}', '${candidate.position}')">Message</button>
            </div>
        `;
        container.appendChild(candidateElement);
    });
}

// Schedule interview
function scheduleInterview(studentName, position) {
    // Generate random interview details
    const interviewDate = new Date();
    interviewDate.setDate(interviewDate.getDate() + Math.floor(Math.random() * 7) + 1);
    const interviewTime = Math.floor(Math.random() * 6) + 10; // Between 10 AM to 4 PM
    
    const interviewDetails = {
        studentName: studentName,
        position: position,
        date: interviewDate.toLocaleDateString(),
        time: `${interviewTime}:00 AM`,
        location: currentUser.address,
        instructions: 'Please bring your resume and a valid ID proof. Arrive 15 minutes before the scheduled time.'
    };
    
    // Store interview details
    localStorage.setItem(`interview_${studentName.replace(' ', '_')}`, JSON.stringify(interviewDetails));
    
    // Show success message
    showNotification(`Interview scheduled for ${studentName} on ${interviewDetails.date} at ${interviewDetails.time}`, 'success');
    
    // Open chat to send interview details
    openChat(studentName, position);
    
    // Auto-send interview details after chat opens
    setTimeout(() => {
        sendInterviewDetails();
    }, 1000);
}

// Open chat with student
function openChat(studentName, position) {
    currentChatStudent = { name: studentName, position: position };
    
    // Set chat header
    document.getElementById('chatStudentName').textContent = studentName;
    
    // Load previous messages if any
    loadChatMessages(studentName);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('chatModal'));
    modal.show();
}

// Open chat from modal
function openChatFromModal() {
    const studentName = document.getElementById('modalStudentName').textContent;
    const position = document.getElementById('modalStudentPosition').textContent;
    
    // Close profile modal
    const profileModal = bootstrap.Modal.getInstance(document.getElementById('studentProfileModal'));
    profileModal.hide();
    
    // Open chat
    setTimeout(() => {
        openChat(studentName, position);
    }, 500);
}

// Load chat messages
function loadChatMessages(studentName) {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '';
    
    // Get stored messages
    const messagesKey = `chat_${studentName.replace(' ', '_')}`;
    const storedMessages = localStorage.getItem(messagesKey);
    
    if (storedMessages) {
        const messages = JSON.parse(storedMessages);
        messages.forEach(msg => {
            addMessageToChat(msg.text, msg.sent, msg.time);
        });
    } else {
        // Add welcome message
        addMessageToChat(`Hello ${studentName}, thank you for applying to our internship program.`, false, new Date().toLocaleTimeString());
    }
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Send message
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const messageText = messageInput.value.trim();
    
    if (!messageText) return;
    
    // Add message to chat
    const time = new Date().toLocaleTimeString();
    addMessageToChat(messageText, true, time);
    
    // Store message
    storeMessage(currentChatStudent.name, messageText, true, time);
    
    // Clear input
    messageInput.value = '';
    
    // Simulate response after a delay
    setTimeout(() => {
        const responses = [
            "Thank you for your message. I'll get back to you soon.",
            "I appreciate your interest in our company.",
            "Your application is under review.",
            "We'll contact you with further details."
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const responseTime = new Date().toLocaleTimeString();
        
        addMessageToChat(randomResponse, false, responseTime);
        storeMessage(currentChatStudent.name, randomResponse, false, responseTime);
    }, 1000 + Math.random() * 2000);
}

// Send congratulations message
function sendCongratulations() {
    if (!currentChatStudent) return;
    
    const congratulationsMessage = `🎉 Congratulations ${currentChatStudent.name}! 🎉\n\nWe are thrilled to inform you that you have been selected for the ${currentChatStudent.position} position at TechCorp Solutions!\n\nYour skills and experience impressed our team, and we believe you'll be a valuable addition to our organization.\n\nWelcome aboard! We're excited to work with you.\n\nBest regards,\nHR Team\nTechCorp Solutions`;
    
    // Add message to chat
    const time = new Date().toLocaleTimeString();
    addMessageToChat(congratulationsMessage, true, time);
    
    // Store message
    storeMessage(currentChatStudent.name, congratulationsMessage, true, time);
    
    // Show success message
    showNotification('Congratulations message sent successfully!', 'success');
}

// Send interview details
function sendInterviewDetails() {
    if (!currentChatStudent) return;
    
    // Get interview details
    const interviewKey = `interview_${currentChatStudent.name.replace(' ', '_')}`;
    const storedInterview = localStorage.getItem(interviewKey);
    
    let interviewDetails;
    if (storedInterview) {
        interviewDetails = JSON.parse(storedInterview);
    } else {
        // Generate new interview details
        const interviewDate = new Date();
        interviewDate.setDate(interviewDate.getDate() + Math.floor(Math.random() * 7) + 1);
        const interviewTime = Math.floor(Math.random() * 6) + 10; // Between 10 AM to 4 PM
        
        interviewDetails = {
            studentName: currentChatStudent.name,
            position: currentChatStudent.position,
            date: interviewDate.toLocaleDateString(),
            time: `${interviewTime}:00 AM`,
            location: currentUser.address,
            instructions: 'Please bring your resume and a valid ID proof. Arrive 15 minutes before the scheduled time.'
        };
        
        // Store interview details
        localStorage.setItem(interviewKey, JSON.stringify(interviewDetails));
    }
    
    // Create interview message
    const interviewMessage = `🎯 Interview Invitation 🎯\n\nDear ${currentChatStudent.name},\n\nCongratulations! You have been shortlisted for the ${currentChatStudent.position} position.\n\n📅 Interview Details:\nDate: ${interviewDetails.date}\nTime: ${interviewDetails.time}\nLocation: ${interviewDetails.location}\n\n📋 Instructions:\n${interviewDetails.instructions}\n\nPlease confirm your attendance by replying to this message.\n\nWe look forward to meeting you!\n\nBest regards,\nHR Team\nTechCorp Solutions`;
    
    // Add message to chat
    const time = new Date().toLocaleTimeString();
    addMessageToChat(interviewMessage, true, time);
    
    // Store message
    storeMessage(currentChatStudent.name, interviewMessage, true, time);
    
    // Show success message
    showNotification('Interview details sent successfully!', 'success');
}

// Send location
function sendLocation() {
    if (!currentChatStudent) return;
    
    const locationMessage = `📍 Company Location 📍\n\nTechCorp Solutions\n${currentUser.address}\n\n🗺️ Get Directions:\nhttps://maps.google.com/?q=20.2961,85.8245\n\n📞 For assistance: ${currentUser.phone}\n\n📧 Email: ${currentUser.email}\n\nPlease reach the location 15 minutes before your scheduled time. Look for the main reception on the ground floor.`;
    
    // Add message to chat
    const time = new Date().toLocaleTimeString();
    addMessageToChat(locationMessage, true, time);
    
    // Store message
    storeMessage(currentChatStudent.name, locationMessage, true, time);
    
    // Show success message
    showNotification('Location details sent successfully!', 'success');
}

// Add message to chat UI
function addMessageToChat(text, sent, time) {
    const chatMessages = document.getElementById('chatMessages');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sent ? 'sent' : 'received'}`;
    
    messageElement.innerHTML = `
        <div class="message-bubble">${text.replace(/\n/g, '<br>')}</div>
        <div class="message-time">${time}</div>
    `;
    
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Store message in localStorage
function storeMessage(studentName, text, sent, time) {
    const messagesKey = `chat_${studentName.replace(' ', '_')}`;
    const storedMessages = localStorage.getItem(messagesKey);
    
    let messages = [];
    if (storedMessages) {
        messages = JSON.parse(storedMessages);
    }
    
    messages.push({ text, sent, time });
    localStorage.setItem(messagesKey, JSON.stringify(messages));
}

// Open new job modal
function openNewJobModal() {
    const modal = new bootstrap.Modal(document.getElementById('newJobModal'));
    modal.show();
}

// Post new job
function postNewJob() {
    const jobTitle = document.getElementById('jobTitle').value;
    const jobLocation = document.getElementById('jobLocation').value;
    const jobStipend = document.getElementById('jobStipend').value;
    const jobDuration = document.getElementById('jobDuration').value;
    const jobType = document.getElementById('jobType').value;
    const jobDescription = document.getElementById('jobDescription').value;
    const jobSkills = document.getElementById('jobSkills').value;
    
    if (!jobTitle || !jobLocation || !jobStipend || !jobDuration || !jobDescription) {
        showNotification('Please fill all required fields', 'warning');
        return;
    }
    
    // Create new job element
    const jobContainer = document.getElementById('jobPostingsContainer');
    const newJobElement = document.createElement('div');
    newJobElement.className = 'job-item';
    newJobElement.innerHTML = `
        <div class="job-title">${jobTitle}</div>
        <div class="job-meta">
            <div class="job-meta-item">
                <i class="fas fa-map-marker-alt"></i>
                <span>${jobLocation}</span>
            </div>
            <div class="job-meta-item">
                <i class="fas fa-rupee-sign"></i>
                <span>${jobStipend}</span>
            </div>
            <div class="job-meta-item">
                <i class="fas fa-clock"></i>
                <span>${jobDuration}</span>
            </div>
            <div class="job-meta-item">
                <i class="fas fa-laptop"></i>
                <span>${jobType}</span>
            </div>
        </div>
        <div class="job-description">
            ${jobDescription}
        </div>
        <div class="job-footer">
            <div class="applicant-count">
                <i class="fas fa-users me-1"></i>0 applicants
            </div>
            <div class="application-actions">
                <button class="btn-sm-custom btn-primary-sm" onclick="viewJobApplications('${jobTitle}')">View</button>
                <button class="btn-sm-custom btn-outline-sm" onclick="editJob('${jobTitle}')">Edit</button>
            </div>
        </div>
    `;
    
    // Add to beginning of container
    jobContainer.insertBefore(newJobElement, jobContainer.firstChild);
    
    // Clear form
    document.getElementById('newJobForm').reset();
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('newJobModal'));
    modal.hide();
    
    // Show success message
    showNotification('Job posted successfully!', 'success');
}

// View job applications
function viewJobApplications(jobTitle) {
    // Switch to applications section
    document.querySelectorAll('.content-section').forEach(el => {
        el.style.display = 'none';
    });
    document.getElementById('applications-section').style.display = 'block';
    
    // Update active nav link
    document.querySelectorAll('.nav-menu-item').forEach(el => {
        el.classList.remove('active');
    });
    document.querySelector('[onclick*="applications"]').classList.add('active');
    
    // Show notification
    showNotification(`Showing applications for ${jobTitle}`, 'info');
}

// Edit job
function editJob(jobTitle) {
    // Open new job modal with pre-filled data
    openNewJobModal();
    
    // Pre-fill form with job data
    document.getElementById('jobTitle').value = jobTitle;
    
    // Show notification
    showNotification(`Editing ${jobTitle}`, 'info');
}

// Show notification
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'success' ? 'success' : type === 'warning' ? 'warning' : 'info'} position-fixed top-0 end-0 m-3`;
    notification.style.zIndex = '9999';
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <div class="me-2">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            </div>
            <div>${message}</div>
            <button type="button" class="btn-close ms-2" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize Charts
function initializeCharts() {
    const textColor = getComputedStyle(document.body).getPropertyValue('--text-secondary');
    const gridColor = getComputedStyle(document.body).getPropertyValue('--border-color');
    
    // Application Trends Chart
    const applicationCtx = document.getElementById('applicationChart');
    if (applicationCtx) {
        new Chart(applicationCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Applications',
                    data: [12, 19, 28, 25, 36, 48],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: gridColor
                        },
                        ticks: {
                            color: textColor,
                            font: {
                                size: 11 // Increased from 10
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: textColor,
                            font: {
                                size: 11 // Increased from 10
                            }
                        }
                    }
                }
            }
        });
    }

    // Application Sources Chart
    const sourceCtx = document.getElementById('sourceChart');
    if (sourceCtx) {
        new Chart(sourceCtx, {
            type: 'doughnut',
            data: {
                labels: ['Direct', 'University', 'Referrals', 'Social'],
                datasets: [{
                    data: [45, 25, 20, 10],
                    backgroundColor: [
                        '#3b82f6',
                        '#10b981',
                        '#f59e0b',
                        '#ef4444'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: textColor,
                            font: {
                                size: 11 // Increased from 10
                            },
                            padding: 10
                        }
                    }
                }
            }
        });
    }

    // Hiring Funnel Chart
    const funnelCtx = document.getElementById('funnelChart');
    if (funnelCtx) {
        new Chart(funnelCtx, {
            type: 'bar',
            data: {
                labels: ['Applied', 'Screened', 'Interview', 'Offer', 'Hired'],
                datasets: [{
                    label: 'Candidates',
                    data: [156, 68, 32, 18, 12],
                    backgroundColor: [
                        '#3b82f6',
                        '#06b6d4',
                        '#10b981',
                        '#f59e0b',
                        '#ef4444'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: gridColor
                        },
                        ticks: {
                            color: textColor,
                            font: {
                                size: 11 // Increased from 10
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: textColor,
                            font: {
                                size: 11 // Increased from 10
                            }
                        }
                    }
                }
            }
        });
    }
}

// Update charts theme
function updateChartsTheme() {
    // Destroy existing charts
    Chart.helpers.each(Chart.instances, function(instance) {
        instance.destroy();
    });
    
    // Reinitialize charts with new theme
    initializeCharts();
}

// Logout function
function logout() {
    currentUser = null;
    userType = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userType');
    
    // Redirect to home page
    window.location.href = 'index.html';
}

// Handle Enter key in chat input
document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});