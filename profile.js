window.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    if (user) {
        document.getElementById('profileName').textContent = user.name || '';
        document.getElementById('profileEmail').textContent = user.email || '';
        document.getElementById('profilePhone').textContent = user.phone || '';
        document.getElementById('profileLocation').textContent = user.location || '';
        document.getElementById('profileJoined').textContent = user.joinedDate || '';
    } else {
        window.location.href = 'index.html';
    }
});
