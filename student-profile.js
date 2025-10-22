// View Management
function showView(view) {
    const dashboardView = document.getElementById('dashboardView');
    const profileView = document.getElementById('profileView');
    const recommendationsView = document.getElementById('recommendationsView');
    const dashboardNav = document.getElementById('dashboardNav');
    const profileNav = document.getElementById('profileNav');
    
    // Hide all views
    dashboardView.classList.remove('active');
    dashboardView.classList.add('hidden');
    profileView.classList.remove('active');
    profileView.classList.add('hidden');
    recommendationsView.classList.remove('active');
    recommendationsView.classList.add('hidden');
    
    // Update navigation
    dashboardNav.classList.remove('active');
    profileNav.classList.remove('active');
    
    // Show selected view
    if (view === 'dashboard') {
        dashboardView.classList.add('active');
        dashboardView.classList.remove('hidden');
        dashboardNav.classList.add('active');
    } else if (view === 'profile') {
        profileView.classList.add('active');
        profileView.classList.remove('hidden');
        profileNav.classList.add('active');
    } else if (view === 'recommendations') {
        recommendationsView.classList.add('active');
        recommendationsView.classList.remove('hidden');
        profileNav.classList.add('active');
    }
}

// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const html = document.documentElement;

const currentTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const theme = html.getAttribute('data-theme');
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    showNotification(`Switched to ${newTheme} mode`);
});

function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeIcon.className = 'fas fa-moon';
    } else {
        themeIcon.className = 'fas fa-sun';
    }
}

// Search Functionality
const searchBar = document.getElementById('searchBar');
searchBar.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    filterContent(searchTerm);
});

function filterContent(searchTerm) {
    const allCards = document.querySelectorAll('.skill-item, .achievement-card, .project-card, .timeline-item');
    
    allCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

// Notification System
const notificationBtn = document.getElementById('notificationBtn');
notificationBtn.addEventListener('click', () => {
    const badge = notificationBtn.querySelector('.notification-badge');
    if (badge) {
        badge.style.display = 'none';
    }
    showNotification('You have 3 new notifications:\n• New connection request\n• Achievement unlocked\n• Project milestone reached');
});

// Logout Functionality
const logoutBtn = document.getElementById('logoutBtn');
logoutBtn.addEventListener('click', () => {
    openModal('logoutModal');
});

function confirmLogout() {
    showNotification('Logging out...');
    
    setTimeout(() => {
        localStorage.removeItem('userSession');
        localStorage.removeItem('theme');
        
        document.body.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: var(--bg-primary); color: var(--text-primary);">
                <div style="text-align: center;">
                    <i class="fas fa-check-circle" style="font-size: 4rem; color: var(--success-color); margin-bottom: 1rem;"></i>
                    <h2>Successfully Logged Out</h2>
                    <p style="color: var(--text-secondary); margin-top: 1rem;">You have been successfully logged out.</p>
                    <button onclick="location.reload()" style="margin-top: 2rem; padding: 0.7rem 2rem; background-color: var(--primary-color); color: white; border: none; border-radius: 20px; cursor: pointer;">Return to Login</button>
                </div>
            </div>
             // Redirect to home page
    
        `;
    }, 1500);
// Redirect to home page
    window.location.href = 'index.html';
     
}


// Modal Functions
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
});

// Resume Upload
document.getElementById('resumeForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const resumeName = document.getElementById('resumeName').value;
    const resumeFile = document.getElementById('resumeFile').files[0];
    
    if (resumeFile) {
        // Store the resume file for later viewing
        const reader = new FileReader();
        reader.onload = function(e) {
            localStorage.setItem('resumeData', e.target.result);
            localStorage.setItem('resumeName', resumeName);
            localStorage.setItem('resumeDate', new Date().toISOString());
            
            // Update resume status in profile
            const resumeStatus = document.querySelector('.resume-status');
            resumeStatus.textContent = 'Updated';
            resumeStatus.className = 'resume-status updated';
            
            const resumeDate = document.querySelector('.resume-date');
            resumeDate.textContent = 'Last updated: Just now';
            
            const resumeNameElement = document.querySelector('.resume-name');
            resumeNameElement.textContent = resumeName;
            
            // Update resume viewer
            updateResumeViewer();
            
            closeModal('resumeModal');
            showNotification('Resume uploaded successfully!');
        };
        reader.readAsDataURL(resumeFile);
    } else {
        showNotification('Please select a file to upload');
    }
});

// Resume Viewer
function viewResume() {
    openModal('resumeViewerModal');
    updateResumeViewer();
}

function updateResumeViewer() {
    const resumeViewer = document.getElementById('resumeViewer');
    const resumeDownloadBtn = document.getElementById('resumeDownloadBtn');
    const resumeData = localStorage.getItem('resumeData');
    const resumeName = localStorage.getItem('resumeName');
    
    if (resumeData) {
        // Determine file type
        const fileType = resumeName.endsWith('.pdf') ? 'pdf' : 'doc';
        
        if (fileType === 'pdf') {
            resumeViewer.innerHTML = `<iframe src="${resumeData}" type="application/pdf"></iframe>`;
        } else {
            resumeViewer.innerHTML = `
                <div class="resume-viewer-placeholder">
                    <i class="fas fa-file-word"></i>
                    <p>Document preview not available</p>
                    <p>Download to view the full document</p>
                </div>
            `;
        }
        
        resumeDownloadBtn.style.display = 'flex';
    } else {
        resumeViewer.innerHTML = `
            <div class="resume-viewer-placeholder">
                <i class="fas fa-file-pdf"></i>
                <p>No resume uploaded yet</p>
                <button class="btn btn-primary" onclick="openModal('resumeModal')">Upload Resume</button>
            </div>
        `;
        resumeDownloadBtn.style.display = 'none';
    }
}

function downloadResume() {
    const resumeData = localStorage.getItem('resumeData');
    const resumeName = localStorage.getItem('resumeName') || 'resume.pdf';
    
    if (resumeData) {
        const link = document.createElement('a');
        link.href = resumeData;
        link.download = resumeName;
        link.click();
        
        showNotification('Resume downloaded successfully!');
    } else {
        showNotification('No resume available for download');
    }
}

// Academic Performance Functions
let semesterCount = 2;

function addSemester() {
    semesterCount++;
    const semestersContainer = document.getElementById('semestersContainer');
    const newSemester = document.createElement('div');
    newSemester.className = 'semester-container';
    newSemester.innerHTML = `
        <div class="semester-header">
            <h4 class="semester-title">Semester ${semesterCount}</h4>
            <button type="button" class="remove-semester-btn" onclick="removeSemester(this)">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="semester-fields">
            <div class="form-group">
                <label class="form-label">GPA</label>
                <input type="number" class="form-input" step="0.01" min="0" max="4" value="3.5">
            </div>
            <div class="form-group">
                <label class="form-label">Attendance (%)</label>
                <input type="number" class="form-input" min="0" max="100" value="90">
            </div>
            <div class="form-group">
                <label class="form-label">Credits Completed</label>
                <input type="number" class="form-input" min="0" value="15">
            </div>
        </div>
    `;
    semestersContainer.appendChild(newSemester);
}

function removeSemester(button) {
    if (semesterCount > 1) {
        button.closest('.semester-container').remove();
        semesterCount--;
        updateSemesterTitles();
    } else {
        showNotification('You must have at least one semester');
    }
}

function updateSemesterTitles() {
    const semesters = document.querySelectorAll('.semester-container');
    semesters.forEach((semester, index) => {
        semester.querySelector('.semester-title').textContent = `Semester ${index + 1}`;
    });
    semesterCount = semesters.length;
}

function saveAcademicPerformance() {
    // Collect all academic data
    const academicData = {
        degree: document.getElementById('degree').value,
        university: document.getElementById('university').value,
        startYear: document.getElementById('startYear').value,
        expectedGraduation: document.getElementById('expectedGraduation').value,
        semesters: [],
        activities: document.getElementById('activities').value,
        research: document.getElementById('research').value,
        internships: document.getElementById('internships').value
    };
    
    // Collect semester data
    const semesterContainers = document.querySelectorAll('.semester-container');
    semesterContainers.forEach(container => {
        const gpa = container.querySelector('input[step="0.01"]').value;
        const attendance = container.querySelector('input[min="0"][max="100"]').value;
        const credits = container.querySelectorAll('input[min="0"]')[2].value;
        
        academicData.semesters.push({
            gpa: parseFloat(gpa),
            attendance: parseInt(attendance),
            credits: parseInt(credits)
        });
    });
    
    // Save to localStorage
    localStorage.setItem('academicData', JSON.stringify(academicData));
    
    // Update overall GPA in stats
    const totalGPA = academicData.semesters.reduce((sum, sem) => sum + sem.gpa, 0) / academicData.semesters.length;
    document.querySelector('.stats-card .stat-value').textContent = totalGPA.toFixed(2);
    document.querySelector('.progress-fill').style.width = `${(totalGPA / 4) * 100}%`;
    
    showNotification('Academic performance saved successfully!');
}

// Internship Functions
function applyInternship(company) {
    showNotification(`Application submitted to ${company}! We'll notify you of any updates.`);
}

function viewInternship(company) {
    const modal = document.getElementById('internshipModal');
    const title = document.getElementById('internshipModalTitle');
    const content = document.getElementById('internshipModalContent');
    const applyBtn = document.getElementById('internshipApplyBtn');
    
    title.textContent = `${company} Internship Details`;
    
    // Set content based on company
    if (company === 'TechCorp') {
        content.innerHTML = `
            <div style="margin-bottom: 1.5rem;">
                <h4 style="color: var(--primary-color); margin-bottom: 0.5rem;">Software Developer Intern</h4>
                <p style="color: var(--text-secondary); margin-bottom: 1rem;">TechCorp • San Francisco, CA • 3 months • $25/hr</p>
                <p>We're looking for a passionate Software Developer Intern to join our team. You'll work on cutting-edge projects and gain hands-on experience with modern technologies.</p>
            </div>
            <div style="margin-bottom: 1.5rem;">
                <h4 style="margin-bottom: 0.5rem;">Responsibilities:</h4>
                <ul style="padding-left: 1.5rem; color: var(--text-secondary);">
                    <li>Develop and maintain web applications</li>
                    <li>Collaborate with cross-functional teams</li>
                    <li>Participate in code reviews and testing</li>
                    <li>Contribute to technical documentation</li>
                </ul>
            </div>
            <div style="margin-bottom: 1.5rem;">
                <h4 style="margin-bottom: 0.5rem;">Requirements:</h4>
                <ul style="padding-left: 1.5rem; color: var(--text-secondary);">
                    <li>Currently pursuing a degree in Computer Science or related field</li>
                    <li>Experience with JavaScript, Python, or similar languages</li>
                    <li>Strong problem-solving skills</li>
                    <li>Ability to work in a team environment</li>
                </ul>
            </div>
        `;
    } else if (company === 'DataSoft') {
        content.innerHTML = `
            <div style="margin-bottom: 1.5rem;">
                <h4 style="color: var(--primary-color); margin-bottom: 0.5rem;">Data Science Intern</h4>
                <p style="color: var(--text-secondary); margin-bottom: 1rem;">DataSoft • Remote • 6 months • $22/hr</p>
                <p>Join our data science team to work on exciting projects involving machine learning, data analysis, and visualization. This remote position offers flexibility and hands-on experience.</p>
            </div>
            <div style="margin-bottom: 1.5rem;">
                <h4 style="margin-bottom: 0.5rem;">Responsibilities:</h4>
                <ul style="padding-left: 1.5rem; color: var(--text-secondary);">
                    <li>Analyze large datasets to extract insights</li>
                    <li>Develop machine learning models</li>
                    <li>Create data visualizations and reports</li>
                    <li>Collaborate with data engineers and analysts</li>
                </ul>
            </div>
            <div style="margin-bottom: 1.5rem;">
                <h4 style="margin-bottom: 0.5rem;">Requirements:</h4>
                <ul style="padding-left: 1.5rem; color: var(--text-secondary);">
                    <li>Currently pursuing a degree in Data Science, Statistics, or related field</li>
                    <li>Proficiency in Python and data analysis libraries</li>
                    <li>Experience with machine learning frameworks</li>
                    <li>Strong analytical and communication skills</li>
                </ul>
            </div>
        `;
    } else if (company === 'AI Innovations') {
        content.innerHTML = `
            <div style="margin-bottom: 1.5rem;">
                <h4 style="color: var(--primary-color); margin-bottom: 0.5rem;">Machine Learning Intern</h4>
                <p style="color: var(--text-secondary); margin-bottom: 1rem;">AI Innovations • New York, NY • 4 months • $28/hr</p>
                <p>Work with our AI research team on cutting-edge machine learning projects. This internship offers exposure to advanced AI techniques and real-world applications.</p>
            </div>
            <div style="margin-bottom: 1.5rem;">
                <h4 style="margin-bottom: 0.5rem;">Responsibilities:</h4>
                <ul style="padding-left: 1.5rem; color: var(--text-secondary);">
                    <li>Research and implement machine learning algorithms</li>
                    <li>Process and analyze large datasets</li>
                    <li>Develop and optimize ML models</li>
                    <li>Document research findings and contribute to publications</li>
                </ul>
            </div>
            <div style="margin-bottom: 1.5rem;">
                <h4 style="margin-bottom: 0.5rem;">Requirements:</h4>
                <ul style="padding-left: 1.5rem; color: var(--text-secondary);">
                    <li>Currently pursuing a degree in Computer Science, AI, or related field</li>
                    <li>Strong background in mathematics and statistics</li>
                    <li>Experience with TensorFlow, PyTorch, or similar frameworks</li>
                    <li>Previous research or project experience in ML/AI</li>
                </ul>
            </div>
        `;
    } else if (company === 'GameDev Studios') {
        content.innerHTML = `
            <div style="margin-bottom: 1.5rem;">
                <h4 style="color: var(--primary-color); margin-bottom: 0.5rem;">Game Development Intern</h4>
                <p style="color: var(--text-secondary); margin-bottom: 1rem;">GameDev Studios • Austin, TX • 3 months • $24/hr</p>
                <p>Join our game development team to create immersive gaming experiences. This internship offers hands-on experience with game engines and development pipelines.</p>
            </div>
            <div style="margin-bottom: 1.5rem;">
                <h4 style="margin-bottom: 0.5rem;">Responsibilities:</h4>
                <ul style="padding-left: 1.5rem; color: var(--text-secondary);">
                    <li>Develop game mechanics and systems</li>
                    <li>Create and optimize game assets</li>
                    <li>Test and debug game functionality</li>
                    <li>Collaborate with designers and artists</li>
                </ul>
            </div>
            <div style="margin-bottom: 1.5rem;">
                <h4 style="margin-bottom: 0.5rem;">Requirements:</h4>
                <ul style="padding-left: 1.5rem; color: var(--text-secondary);">
                    <li>Currently pursuing a degree in Game Development, Computer Science, or related field</li>
                    <li>Experience with Unity or Unreal Engine</li>
                    <li>Knowledge of C# or C++</li>
                    <li>Passion for gaming and game development</li>
                </ul>
            </div>
        `;
    } else if (company === 'CloudFirst') {
        content.innerHTML = `
            <div style="margin-bottom: 1.5rem;">
                <h4 style="color: var(--primary-color); margin-bottom: 0.5rem;">Cloud Engineering Intern</h4>
                <p style="color: var(--text-secondary); margin-bottom: 1rem;">CloudFirst • Seattle, WA • 6 months • $30/hr</p>
                <p>Join our cloud engineering team to work on scalable cloud infrastructure solutions. This internship offers exposure to modern cloud technologies and DevOps practices.</p>
            </div>
            <div style="margin-bottom: 1.5rem;">
                <h4 style="margin-bottom: 0.5rem;">Responsibilities:</h4>
                <ul style="padding-left: 1.5rem; color: var(--text-secondary);">
                    <li>Design and implement cloud infrastructure</li>
                    <li>Automate deployment and monitoring processes</li>
                    <li>Troubleshoot and optimize cloud services</li>
                    <li>Collaborate with development teams on cloud solutions</li>
                </ul>
            </div>
            <div style="margin-bottom: 1.5rem;">
                <h4 style="margin-bottom: 0.5rem;">Requirements:</h4>
                <ul style="padding-left: 1.5rem; color: var(--text-secondary);">
                    <li>Currently pursuing a degree in Computer Science, IT, or related field</li>
                    <li>Experience with AWS, Azure, or GCP</li>
                    <li>Knowledge of infrastructure as code tools</li>
                    <li>Understanding of networking and security concepts</li>
                </ul>
            </div>
        `;
    }
    
    applyBtn.onclick = () => {
        applyInternship(company);
        closeModal('internshipModal');
    };
    
    openModal('internshipModal');
}

// Recommended Skills
function addRecommendedSkill(skillName) {
    // Add skill to the skills section
    const skillsContainer = document.getElementById('skillsContainer');
    const skillItem = document.createElement('div');
    skillItem.className = 'skill-item';
    skillItem.setAttribute('data-level', 'Beginner');
    
    // Set icon based on skill name
    let iconClass = 'fas fa-code';
    if (skillName === 'Docker') iconClass = 'fab fa-docker';
    else if (skillName === 'Figma') iconClass = 'fab fa-figma';
    else if (skillName === 'Angular') iconClass = 'fab fa-angular';
    else if (skillName === 'Kubernetes') iconClass = 'fab fa-kubernetes';
    else if (skillName === 'TensorFlow') iconClass = 'fab fa-python';
    
    skillItem.innerHTML = `
        <button class="skill-delete" onclick="deleteSkill(this)">×</button>
        <div class="skill-icon"><i class="${iconClass}"></i></div>
        <div class="skill-name">${skillName}</div>
        <div class="skill-level">Beginner</div>
    `;
    
    skillsContainer.appendChild(skillItem);
    showNotification(`${skillName} added to your skills!`);
}

// Refresh Recommendations
function refreshRecommendations() {
    showNotification('Refreshing recommendations based on your latest academic performance...');
    
    // Simulate loading
    setTimeout(() => {
        showNotification('Recommendations updated successfully!');
    }, 1500);
}

// Edit Profile
document.getElementById('editProfileBtn').addEventListener('click', () => {
    openModal('editProfileModal');
});

document.getElementById('editProfileForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Update profile information
    document.getElementById('profileName').textContent = document.getElementById('editName').value;
    document.getElementById('profileTitle').textContent = document.getElementById('editTitle').value;
    document.getElementById('profileBio').textContent = document.getElementById('editBio').value;
    document.getElementById('profileEmail').textContent = document.getElementById('editEmail').value;
    document.getElementById('profilePhone').textContent = document.getElementById('editPhone').value;
    document.getElementById('profileLocation').textContent = document.getElementById('editLocation').value;
    
    closeModal('editProfileModal');
    showNotification('Profile updated successfully!');
});

// Add Item Modal
let currentAddType = '';

function openAddModal(type) {
    currentAddType = type;
    const modal = document.getElementById('addModal');
    const modalTitle = document.getElementById('modalTitle');
    
    // Reset form
    document.getElementById('addForm').reset();
    
    // Show/hide relevant fields based on type
    document.getElementById('levelGroup').style.display = type === 'skill' ? 'block' : 'none';
    document.getElementById('dateGroup').style.display = type === 'achievement' ? 'block' : 'none';
    document.getElementById('descriptionGroup').style.display = type === 'project' ? 'block' : 'none';
    document.getElementById('tagsGroup').style.display = type === 'project' ? 'block' : 'none';
    
    // Update title
    modalTitle.textContent = `Add New ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    
    openModal('addModal');
}

document.getElementById('addForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('itemName').value;
    
    if (currentAddType === 'skill') {
        addSkill(name, document.getElementById('itemLevel').value);
    } else if (currentAddType === 'achievement') {
        addAchievement(name, document.getElementById('itemDate').value);
    } else if (currentAddType === 'project') {
        addProject(name, document.getElementById('itemDescription').value, document.getElementById('itemTags').value);
    }
    
    closeModal('addModal');
    showNotification(`${currentAddType.charAt(0).toUpperCase() + currentAddType.slice(1)} added successfully!`);
});

function addSkill(name, level) {
    const container = document.getElementById('skillsContainer');
    const skillItem = document.createElement('div');
    skillItem.className = 'skill-item';
    skillItem.setAttribute('data-level', level);
    skillItem.innerHTML = `
        <button class="skill-delete" onclick="deleteSkill(this)">×</button>
        <div class="skill-icon"><i class="fas fa-code"></i></div>
        <div class="skill-name">${name}</div>
        <div class="skill-level">${level}</div>
    `;
    container.appendChild(skillItem);
}

function addAchievement(name, date) {
    const container = document.getElementById('achievementsContainer');
    const achievementCard = document.createElement('div');
    achievementCard.className = 'achievement-card';
    achievementCard.innerHTML = `
        <div class="achievement-icon"><i class="fas fa-trophy"></i></div>
        <div class="achievement-title">${name}</div>
        <div class="achievement-date">${date}</div>
    `;
    container.appendChild(achievementCard);
}

function addProject(name, description, tags) {
    const container = document.getElementById('projectsContainer');
    const projectCard = document.createElement('div');
    projectCard.className = 'project-card';
    
    const tagArray = tags.split(',').map(tag => `<span class="project-tag">${tag.trim()}</span>`).join('');
    
    projectCard.innerHTML = `
        <div class="project-thumbnail">
            <img src="https://picsum.photos/seed/${Date.now()}/200/200.jpg" alt="Project Thumbnail">
        </div>
        <div class="project-details">
            <h3 class="project-title">${name}</h3>
            <p class="project-description">${description}</p>
            <div class="project-tags">${tagArray}</div>
        </div>
    `;
    container.appendChild(projectCard);
}

// Delete Skill
function deleteSkill(button) {
    if (confirm('Are you sure you want to delete this skill?')) {
        button.parentElement.remove();
        showNotification('Skill deleted successfully');
    }
}

// Filter Functionality
function toggleFilter(section) {
    const filterDropdown = document.getElementById(`${section}Filter`);
    filterDropdown.classList.toggle('active');
}

// Apply filters
document.querySelectorAll('.filter-option input').forEach(checkbox => {
    checkbox.addEventListener('change', applyFilters);
});

function applyFilters() {
    // Skills filter
    const skillFilters = {
        'filterAdvanced': document.getElementById('filterAdvanced').checked,
        'filterIntermediate': document.getElementById('filterIntermediate').checked,
        'filterBeginner': document.getElementById('filterBeginner').checked
    };
    
    document.querySelectorAll('#skillsContainer .skill-item').forEach(skill => {
        const level = skill.getAttribute('data-level');
        if (skillFilters[`filter${level}`]) {
            skill.style.display = '';
        } else {
            skill.style.display = 'none';
        }
    });
    
    // Achievements filter
    const achievementFilters = {
        'filter2023': document.getElementById('filter2023').checked,
        'filter2022': document.getElementById('filter2022').checked,
        'filter2021': document.getElementById('filter2021').checked
    };
    
    document.querySelectorAll('#achievementsContainer .achievement-card').forEach(achievement => {
        const year = achievement.getAttribute('data-year');
        if (achievementFilters[`filter${year}`]) {
            achievement.style.display = '';
        } else {
            achievement.style.display = 'none';
        }
    });
}

// View All / Expand Content
function toggleExpanded(section) {
    const expandedContent = document.getElementById(`${section}Expanded`);
    const button = event.target.closest('.view-all-btn');
    
    if (expandedContent.classList.contains('active')) {
        expandedContent.classList.remove('active');
        button.innerHTML = '<i class="fas fa-expand"></i> View All';
    } else {
        expandedContent.classList.add('active');
        button.innerHTML = '<i class="fas fa-compress"></i> Show Less';
    }
}

// Export Functionality
function exportSection(section) {
    showNotification(`Exporting ${section} data...`);
    
    setTimeout(() => {
        // Simulate export
        const data = {
            section: section,
            exportDate: new Date().toISOString(),
            data: 'Exported data would be here'
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${section}_export_${Date.now()}.json`;
        a.click();
        
        showNotification(`${section} exported successfully!`);
    }, 1000);
}

// Share Profile
function shareProfile() {
    if (navigator.share) {
        navigator.share({
            title: 'Alex Johnson - Student Profile',
            text: 'Check out my professional student profile!',
            url: window.location.href
        });
    } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(window.location.href);
        showNotification('Profile link copied to clipboard!');
    }
}

// Download Profile
function downloadProfile() {
    showNotification('Generating profile PDF...');
    
    setTimeout(() => {
        // Simulate PDF generation
        const profileData = {
            name: document.getElementById('profileName').textContent,
            title: document.getElementById('profileTitle').textContent,
            bio: document.getElementById('profileBio').textContent,
            email: document.getElementById('profileEmail').textContent,
            phone: document.getElementById('profilePhone').textContent,
            location: document.getElementById('profileLocation').textContent,
            skills: Array.from(document.querySelectorAll('.skill-item')).map(skill => ({
                name: skill.querySelector('.skill-name').textContent,
                level: skill.querySelector('.skill-level').textContent
            })),
            achievements: Array.from(document.querySelectorAll('.achievement-card')).map(achievement => ({
                title: achievement.querySelector('.achievement-title').textContent,
                date: achievement.querySelector('.achievement-date').textContent
            }))
        };
        
        const blob = new Blob([JSON.stringify(profileData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `profile_${Date.now()}.json`;
        a.click();
        
        showNotification('Profile downloaded successfully!');
    }, 1500);
}

// Message Modal
function openMessageModal() {
    openModal('messageModal');
}

document.getElementById('messageForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const subject = document.getElementById('messageSubject').value;
    const content = document.getElementById('messageContent').value;
    
    // Simulate sending message
    showNotification('Message sent successfully!');
    closeModal('messageModal');
    document.getElementById('messageForm').reset();
});

// Social Links
function openSocialLink(platform) {
    const links = {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        instagram: 'https://instagram.com',
        facebook: 'https://facebook.com',
        youtube: 'https://youtube.com'
    };
    
    window.open(links[platform], '_blank');
}

// Avatar Upload
document.getElementById('avatarUpload').addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('profileImage').src = e.target.result;
                showNotification('Profile picture updated!');
            };
            reader.readAsDataURL(file);
        }
    };
    
    input.click();
});

// Update Chart
function updateChart(period) {
    const buttons = document.querySelectorAll('.chart-option');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const chartContainer = document.getElementById('performanceChart');
    
    // Simulate different data for different periods
    const data = {
        week: [
            { label: 'Mon', value: 85 },
            { label: 'Tue', value: 92 },
            { label: 'Wed', value: 88 },
            { label: 'Thu', value: 78 },
            { label: 'Fri', value: 95 },
            { label: 'Sat', value: 72 },
            { label: 'Sun', value: 86 }
        ],
        month: [
            { label: 'Week 1', value: 75 },
            { label: 'Week 2', value: 82 },
            { label: 'Week 3', value: 88 },
            { label: 'Week 4', value: 91 }
        ],
        year: [
            { label: 'Jan', value: 70 },
            { label: 'Feb', value: 75 },
            { label: 'Mar', value: 78 },
            { label: 'Apr', value: 82 },
            { label: 'May', value: 85 },
            { label: 'Jun', value: 88 },
            { label: 'Jul', value: 90 },
            { label: 'Aug', value: 92 },
            { label: 'Sep', value: 89 },
            { label: 'Oct', value: 91 },
            { label: 'Nov', value: 93 },
            { label: 'Dec', value: 95 }
        ]
    };
    
    const selectedData = data[period];
    const maxValue = Math.max(...selectedData.map(d => d.value));
    
    chartContainer.innerHTML = selectedData.map(item => `
        <div class="chart-bar" style="height: ${(item.value / maxValue) * 100}%">
            <span class="chart-bar-value">${item.value}</span>
            <span class="chart-bar-label">${item.label}</span>
        </div>
    `).join('');
    
    showNotification(`Chart updated to ${period} view`);
}

// Notification Function
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--primary-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px var(--card-shadow);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
        white-space: pre-line;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize user session
if (!localStorage.getItem('userSession')) {
    localStorage.setItem('userSession', JSON.stringify({
        username: 'Alex Johnson',
        loginTime: new Date().toISOString()
    }));
}

// Load saved academic data
window.addEventListener('DOMContentLoaded', () => {
    const savedAcademicData = localStorage.getItem('academicData');
    if (savedAcademicData) {
        const academicData = JSON.parse(savedAcademicData);
        
        // Populate form fields with saved data
        document.getElementById('degree').value = academicData.degree || '';
        document.getElementById('university').value = academicData.university || '';
        document.getElementById('startYear').value = academicData.startYear || '';
        document.getElementById('expectedGraduation').value = academicData.expectedGraduation || '';
        document.getElementById('activities').value = academicData.activities || '';
        document.getElementById('research').value = academicData.research || '';
        document.getElementById('internships').value = academicData.internships || '';
        
        // Load semester data
        if (academicData.semesters && academicData.semesters.length > 0) {
            const semestersContainer = document.getElementById('semestersContainer');
            semestersContainer.innerHTML = '';
            
            academicData.semesters.forEach((semester, index) => {
                const semesterDiv = document.createElement('div');
                semesterDiv.className = 'semester-container';
                semesterDiv.innerHTML = `
                    <div class="semester-header">
                        <h4 class="semester-title">Semester ${index + 1}</h4>
                        <button type="button" class="remove-semester-btn" onclick="removeSemester(this)">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="semester-fields">
                        <div class="form-group">
                            <label class="form-label">GPA</label>
                            <input type="number" class="form-input" step="0.01" min="0" max="4" value="${semester.gpa}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Attendance (%)</label>
                            <input type="number" class="form-input" min="0" max="100" value="${semester.attendance}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Credits Completed</label>
                            <input type="number" class="form-input" min="0" value="${semester.credits}">
                        </div>
                    </div>
                `;
                semestersContainer.appendChild(semesterDiv);
            });
            
            semesterCount = academicData.semesters.length;
        }
    }
});

// Animate progress bars on page load
window.addEventListener('load', () => {
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
});

// Add smooth scrolling to navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId.startsWith('#')) {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Close filter dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.filter-btn') && !e.target.closest('.filter-dropdown')) {
        document.querySelectorAll('.filter-dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
});

// Update copyright year automatically
document.addEventListener('DOMContentLoaded', () => {
    const year = new Date().getFullYear();
    const copyrightElements = document.querySelectorAll('.footer-bottom p');
    copyrightElements.forEach(el => {
        if (el.textContent.includes('2023')) {
            el.textContent = el.textContent.replace('2023', year);
        }
    });
});