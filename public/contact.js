// Get the form element
const form = document.querySelector('form');

// Attach an event listener to the form submission
form.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent the form from submitting normally

  // Get the message value from the form
  const message = document.querySelector('#message').value;

  // Create a data object to send in the request body
  const data = {
    message: message
  };

  // Send a POST request to the server to save the contact details
  fetch('/saveContactDetails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(result => {
      console.log('Contact details saved successfully');
      // Handle the successful response, if needed
    })
    .catch(error => {
      console.error('Error:', error);
      // Handle any errors that occurred during the request
    });
});
