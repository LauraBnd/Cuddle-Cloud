const { sessions, getCookies, isSessionExpired } = require('../utils');

// Function to check if the user is logged in
const isLoggedIn = () => {
    const cookies = getCookies(req);
    const sessionId = cookies.sessionId;
    return sessionId && sessions[sessionId] && !isSessionExpired(sessions[sessionId]);
    
};

// If the user is logged in, show the logout button
if (isLoggedIn()) {
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');

    if (loginLink && registerLink) {
        loginLink.style.display = 'block';
        registerLink.style.display = 'block';
    }

    const logoutContainer = document.getElementById('logout-container');

    if (logoutContainer) {
        logoutContainer.style.display = 'block';


        // Add event listener to the logout form
        document.getElementById('logout-form').addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent the default form submission

            // Send a POST request to /logout
            fetch('/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    window.location.href = '/'; // Redirect to the homepage after successful logout
                } else {
                    console.error('Logout failed');
                }
            }).catch(error => {
                console.error('Error:', error);
            });
        });
    }
}
