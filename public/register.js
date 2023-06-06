const form = document.getElementById('register-form');

form.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent the form from submitting normally

  const userName = document.getElementById('userName').value;
  const password = document.getElementById('password').value;
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('email').value;
  const address = document.getElementById('address').value;

  const data = {
    userName: userName,
    firstName: firstName,
    lastName: lastName,
    userAddress: address,
    userEmail: email,
    userPassword: password
  };

  saveUserDetails(data);
});

async function saveUserDetails(data) {
    redirectToPage();
  try {
    const response = await fetch('http://localhost:3000/saveUserDetails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    console.log('User details saved successfully');

    
  } catch (error) {
    console.log('ERROR:', error);
  }
 
}

function redirectToPage() {
    console.log('Redirecting to /login');
    window.location.href = "/login";
  }