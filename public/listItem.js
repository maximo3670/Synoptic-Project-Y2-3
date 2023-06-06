const form = document.getElementById('item-form');

form.addEventListener('submit', (event) => {
  console.log("Submitted");
  event.preventDefault(); // Prevent the form from submitting normally

  const itemName = document.getElementById('item-name').value;
  const itemPrice = document.getElementById('item-price').value;
  const itemDescription = document.getElementById('item-description').value;

  const data = {
    itemName: itemName,
    itemPrice: itemPrice,
    itemDescription: itemDescription
  };

  saveItemDetails(data);
});

async function saveItemDetails(data) {
  redirectToPage();
  try {
    const response = await fetch('http://localhost:3000/saveItemDetails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    console.log('Item details saved successfully');
    // Handle any further actions after saving the item details
  } catch (error) {
    console.log('ERROR:', error);
  }
}

function redirectToPage() {
  window.location.href = "/store";
}