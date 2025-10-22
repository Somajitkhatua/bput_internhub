// Counter Animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;

    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const increment = target / speed;

        const updateCount = () => {
            const count = +counter.innerText;

            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target;
            }
        };

        updateCount();
    });
}

// Intersection Observer for Counter Animation
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
    observer.observe(statsSection);
}

// User data storage
let currentUser = null;
let userType = null;

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', function() {
    const savedUser = localStorage.getItem('currentUser');
    const savedUserType = localStorage.getItem('userType');
    
    if (savedUser && savedUserType) {
        currentUser = JSON.parse(savedUser);
        userType = savedUserType;
        updateUIForLoggedInUser();
    }

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
});

// Show Login Modal
function showLoginModal(type) {
    const modal = new bootstrap.Modal(document.getElementById('loginModal'));
    const title = document.getElementById('loginModalTitle');
    title.textContent = type === 'student' ? 'Student Login' : 'Company Login';
    userType = type;
    modal.show();
}

// Show Registration Modal
function showRegistrationModal(type) {
    const modal = new bootstrap.Modal(document.getElementById('registrationModal'));
    const tabs = document.getElementById('registrationTabs');

    if (type === 'student') {
        tabs.querySelector('#student-tab').click();
    } else {
        tabs.querySelector('#company-tab').click();
    }
    
    userType = type;
    modal.show();
}

// Search Internships
function searchInternships() {
    const searchTerm = document.getElementById('searchInput').value;
    console.log('Searching for:', searchTerm);
    showNotification('Searching for internships...', 'info');
}

// Apply for Internship
function applyForInternship() {
    if (!currentUser) {
        showNotification('Please login to apply for internships', 'warning');
        showLoginModal('student');
        return;
    }
    showNotification('Application submitted successfully!', 'success');
}

// Save Internship
function saveInternship() {
    if (!currentUser) {
        showNotification('Please login to save internships', 'warning');
        showLoginModal('student');
        return;
    }
    showNotification('Internship saved to your list!', 'success');
}

// Load More Internships
function loadMoreInternships() {
    const internshipList = document.getElementById('internshipList');
    const loader = document.createElement('div');
    loader.className = 'col-12 text-center';
    loader.innerHTML = '<div class="loader"></div>';
    internshipList.appendChild(loader);

    setTimeout(() => {
        loader.remove();
        showNotification('More internships loaded!', 'success');
    }, 1500);
}

// Show Notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = 'alert alert-' + type + ' position-fixed top-0 start-50 translate-middle-x mt-3';
    notification.style.zIndex = '9999';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Form validation functions
function validateName(name) {
    return /^[a-zA-Z\s]+$/.test(name);
}

function validateEmail(email, userType) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        return false;
    }
    
    if (userType === 'student' && !email.toLowerCase().endsWith('@gmail.com')) {
        return false;
    }
    
    return true;
}

function validatePhone(phone) {
    return /^[0-9]{10}$/.test(phone);
}

function validatePassword(password) {
    return password.length >= 8;
}

// Send Email Notification (Simulated)
function sendEmailNotification(email, name, type) {
    // In a real application, this would make an API call to a backend service
    // that would send an actual email. For this demo, we'll just simulate it.
    
    console.log(`Sending registration confirmation email to ${email}`);
    
    // Simulate email sending delay
    setTimeout(() => {
        console.log(`Email sent successfully to ${email}`);
        
        // Show email notification modal
        const modal = new bootstrap.Modal(document.getElementById('emailNotificationModal'));
        modal.show();
    }, 1000);
}

// Login Form Submission
document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    document.getElementById('loginEmail').classList.remove('is-invalid');
    document.getElementById('loginPassword').classList.remove('is-invalid');
    
    let isValid = true;
    
    if (!validateEmail(email, userType)) {
        document.getElementById('loginEmail').classList.add('is-invalid');
        isValid = false;
    }
    
    if (!validatePassword(password)) {
        document.getElementById('loginPassword').classList.add('is-invalid');
        isValid = false;
    }
    
    if (!isValid) {
        return;
    }
    
    const storageKey = userType === 'student' ? 'students' : 'companies';
    const users = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('userType', userType);
        
        showNotification('Login successful! Redirecting...', 'success');
        
        setTimeout(() => {
            bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
            updateUIForLoggedInUser();
            
            // Redirect to appropriate profile page
            if (userType === 'student') {
                window.location.href = 'student-profile.html';
            } else {
                window.location.href = 'company-profile.html';
            }
        }, 1500);
    } else {
        showNotification('Invalid email or password. Please try again.', 'danger');
    }
});

// Student Registration Form Submission
document.getElementById('studentRegistrationForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('studentName').value;
    const email = document.getElementById('studentEmail').value;
    const college = document.getElementById('studentCollege').value;
    const branch = document.getElementById('studentBranch').value;
    const year = document.getElementById('studentYear').value;
    const phone = document.getElementById('studentPhone').value;
    const password = document.getElementById('studentPassword').value;
    const confirmPassword = document.getElementById('studentConfirmPassword').value;
    
    document.querySelectorAll('#studentRegistrationForm .form-control').forEach(el => {
        el.classList.remove('is-invalid');
    });
    
    let isValid = true;
    
    if (!validateName(name)) {
        document.getElementById('studentName').classList.add('is-invalid');
        isValid = false;
    }
    
    if (!validateEmail(email, 'student')) {
        document.getElementById('studentEmail').classList.add('is-invalid');
        isValid = false;
    }
    
    if (!college) {
        document.getElementById('studentCollege').classList.add('is-invalid');
        isValid = false;
    }
    
    if (!branch) {
        document.getElementById('studentBranch').classList.add('is-invalid');
        isValid = false;
    }
    
    if (!year) {
        document.getElementById('studentYear').classList.add('is-invalid');
        isValid = false;
    }
    
    if (!validatePhone(phone)) {
        document.getElementById('studentPhone').classList.add('is-invalid');
        isValid = false;
    }
    
    if (!validatePassword(password)) {
        document.getElementById('studentPassword').classList.add('is-invalid');
        isValid = false;
    }
    
    if (password !== confirmPassword) {
        document.getElementById('studentConfirmPassword').classList.add('is-invalid');
        isValid = false;
    }
    
    if (!isValid) {
        return;
    }
    
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    
    if (students.find(s => s.email === email)) {
        document.getElementById('studentEmail').classList.add('is-invalid');
        showNotification('An account with this email already exists.', 'danger');
        return;
    }
    
    const newStudent = {
        name,
        email,
        college,
        branch,
        year,
        phone,
        password
    };
    
    students.push(newStudent);
    localStorage.setItem('students', JSON.stringify(students));
    
    // Send email notification
    sendEmailNotification(email, name, 'student');
    
    // Close registration modal
    bootstrap.Modal.getInstance(document.getElementById('registrationModal')).hide();
});

// Company Registration Form Submission
document.getElementById('companyRegistrationForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('companyName').value;
    const industry = document.getElementById('companyIndustry').value;
    const email = document.getElementById('companyEmail').value;
    const phone = document.getElementById('companyPhone').value;
    const address = document.getElementById('companyAddress').value;
    const website = document.getElementById('companyWebsite').value;
    const password = document.getElementById('companyPassword').value;
    const confirmPassword = document.getElementById('companyConfirmPassword').value;
    
    document.querySelectorAll('#companyRegistrationForm .form-control').forEach(el => {
        el.classList.remove('is-invalid');
    });
    
    let isValid = true;
    
    if (!validateName(name)) {
        document.getElementById('companyName').classList.add('is-invalid');
        isValid = false;
    }
    
    if (!industry) {
        document.getElementById('companyIndustry').classList.add('is-invalid');
        isValid = false;
    }
    
    if (!validateEmail(email, 'company')) {
        document.getElementById('companyEmail').classList.add('is-invalid');
        isValid = false;
    }
    
    if (!validatePhone(phone)) {
        document.getElementById('companyPhone').classList.add('is-invalid');
        isValid = false;
    }
    
    if (!address) {
        document.getElementById('companyAddress').classList.add('is-invalid');
        isValid = false;
    }
    
    if (!validatePassword(password)) {
        document.getElementById('companyPassword').classList.add('is-invalid');
        isValid = false;
    }
    
    if (password !== confirmPassword) {
        document.getElementById('companyConfirmPassword').classList.add('is-invalid');
        isValid = false;
    }
    
    if (!isValid) {
        return;
    }
    
    const companies = JSON.parse(localStorage.getItem('companies') || '[]');
    
    if (companies.find(c => c.email === email)) {
        document.getElementById('companyEmail').classList.add('is-invalid');
        showNotification('An account with this email already exists.', 'danger');
        return;
    }
    
    const newCompany = {
        name,
        industry,
        email,
        phone,
        address,
        website,
        password
    };
    
    companies.push(newCompany);
    localStorage.setItem('companies', JSON.stringify(companies));
    
    // Send email notification
    sendEmailNotification(email, name, 'company');
    
    // Close registration modal
    bootstrap.Modal.getInstance(document.getElementById('registrationModal')).hide();
});

// Update UI for logged in user
function updateUIForLoggedInUser() {
    if (!currentUser || !userType) return;
    
    document.getElementById('authButtons').style.display = 'none';
    document.getElementById('userProfile').style.display = 'flex';
    document.getElementById('userName').textContent = currentUser.name;
}

// Go to Profile Page
function goToProfile() {
    if (userType === 'student') {
        window.location.href = 'student-profile.html';
    } else {
        window.location.href = 'company-profile.html';
    }
}

// Logout
function logout() {
    currentUser = null;
    userType = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userType');
    
    document.getElementById('authButtons').style.display = 'flex';
    document.getElementById('userProfile').style.display = 'none';
    
    showNotification('You have been logged out successfully.', 'success');
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Filter Internships
document.getElementById('domainFilter')?.addEventListener('change', filterInternships);
document.getElementById('locationFilter')?.addEventListener('change', filterInternships);
document.getElementById('stipendFilter')?.addEventListener('change', filterInternships);
document.getElementById('durationFilter')?.addEventListener('change', filterInternships);

function filterInternships() {
    showNotification('Filters applied!', 'info');
}

// Chatbot functionality
function toggleChatbot() {
    showNotification('Chatbot feature coming soon!', 'info');
}

// Initialize EmailJS
(function() {
    emailjs.init("YOUR_USER_ID"); // Replace with your EmailJS user ID
})();

// Send Email Notification
function sendEmailNotification(email, name, type) {
    // EmailJS parameters
    const templateParams = {
        to_email: email,
        to_name: name,
        user_type: type,
        from_name: "BPUT InternHub Team",
        message: `Congratulations ${name}! You have successfully registered with BPUT InternHub as a ${type}. We're excited to help you find the perfect internship opportunities.`
    };

    // Send email using EmailJS
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
        .then(function(response) {
            console.log('Email sent successfully!', response.status, response.text);
            
            // Show email notification modal
            const modal = new bootstrap.Modal(document.getElementById('emailNotificationModal'));
            modal.show();
        }, function(error) {
            console.log('Failed to send email:', error);
            
            // Still show the modal even if email fails
            const modal = new bootstrap.Modal(document.getElementById('emailNotificationModal'));
            modal.show();
            
            // Show error notification
            showNotification('Registration successful, but we couldn\'t send a confirmation email. Please check your email later.', 'warning');
        });
}