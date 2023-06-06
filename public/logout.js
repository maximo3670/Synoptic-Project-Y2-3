document.addEventListener('DOMContentLoaded', () => {
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
      logoutLink.addEventListener('click', handleLogout);
    }
  });
  
  async function handleLogout(event) {
    event.preventDefault();
  
    const response = await fetch('/logout', {
      method: 'POST',
    });
  
    if (response.ok) {
      console.log('Logout successful');
      // Perform any additional actions after logout if needed
      // For example, you can redirect the user to the login page
      window.location.href = '/logout';
    } else {
      console.log('Error while logging out');
      // Handle the error case if needed
    }
  }
  