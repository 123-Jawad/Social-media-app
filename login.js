document.addEventListener('DOMContentLoaded', function () {

    const loginForm = document.getElementById('loginForm');

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

            // Show success alert
            const successAlert = document.getElementById('successAlert');
            successAlert.classList.remove('d-none');

            // Redirect after 2 seconds
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } catch (error) {
            console.error('Login error:', error);

            // Show error alert
            const errorAlert = document.getElementById('errorAlert');
            errorAlert.classList.remove('d-none');
        }
    });
});
