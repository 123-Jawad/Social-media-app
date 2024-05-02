document.addEventListener('DOMContentLoaded', function () {
    // Retrieve user data from localStorage
    const userData = JSON.parse(localStorage.getItem('userData'));

    if (userData && userData.image && userData.username && userData.email) {
        const userImageElement1 = document.getElementById('userImage1'); // Change ID here
        const userImageElement2 = document.getElementById('userImage2'); // Change ID here
        const usernameElement = document.getElementById('username');
        const emailElement = document.getElementById('email'); // First email element

        userImageElement1.src = userData.image;
        userImageElement2.src = userData.image; // Set image source for the second image element
        usernameElement.textContent = `${userData.username}`;
        emailElement.textContent = `${userData.email}`;
    } else {
        console.error('User data, image URL, username, or email not found in localStorage.');
    }
});
