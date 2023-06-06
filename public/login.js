document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', handleLogin);
  });
  
  async function handleLogin(event) {
    event.preventDefault(); // Prevent the form from submitting normally
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    // Fetch user data and check credentials
    try {
      const response = await fetch('http://localhost:3000/allUsersData');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const userData = await response.json();
  
      const user = userData.find((user) => user.userName === username && user.userPassword === password);
      if (user) {

        await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.idusers }),
      });

       
        window.location.href = '/';
         // Login successful
         console.log('Login successful');
      } else {
        // Invalid credentials
        console.log('Invalid credentials');
        // Display error message or take appropriate action
      }
    } catch (error) {
      console.log('ERROR:', error);
    }
  }