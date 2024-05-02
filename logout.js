document.addEventListener('DOMContentLoaded', function () {
    
    // Logout button click event
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', function () {
        // Redirect to login page
        window.location.href = 'login.html';
    });

});
