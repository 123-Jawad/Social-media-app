document.addEventListener('DOMContentLoaded', function () {

    const loginForm = document.getElementById('loginForm');
// Check if user is in localStorage and redirect accordingly

    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the default form submission behavior

        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        const emailValue = emailInput.value;
        const passwordValue = passwordInput.value;

        try {
            // Make the API call with the input values
            const response = await fetch('https://dummyjson.com/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: emailValue, // Assuming the email is the username
                    password: passwordValue,
                    expiresInMins: 30, // optional, defaults to 60
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            // Save the response in local storage
            localStorage.setItem('userData', JSON.stringify(data));
            console.log('Login successful:', data);

            // Show success message with SweetAlert
            Swal.fire({
                title: 'Login Successful!',
                text: 'You are redirected to the main page.',
                icon: 'success',
                timer: 2000, // Display the message for 2 seconds
                showConfirmButton: false // Hide the "Close" button
            }).then(() => {
                window.location.href = 'index.html';
            });
        } catch (error) {
            console.error('Login error:', error);

            // Show error message with SweetAlert
            Swal.fire({
                title: 'Error!',
                text: 'An error occurred during login. Please try again later.',
                icon: 'error',
            });
        }
    });
});


