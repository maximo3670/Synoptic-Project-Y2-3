document.addEventListener('DOMContentLoaded', () => {
  getItemData();
});



async function getItemData() {
  try {
    const response = await fetch('http://localhost:3000/getItemData');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    const itemTable = document.getElementById('item-output');
    loadToTable(data, itemTable);
  } catch (error) {
    console.log('ERROR:', error);
  }
}

function loadToTable(data, itemTable) {
  for (let i = 0; i < data.length; i++) {
    const itemRow = document.createElement('tr');

    const itemName = document.createElement('td');
    itemName.textContent = data[i].itemName;

    const itemPrice = document.createElement('td');
    itemPrice.textContent = data[i].itemPrice;

    const itemDescription = document.createElement('td');
    itemDescription.textContent = data[i].itemDescription;

    const viewDetails = document.createElement('td');
    const viewButton = document.createElement('button');
    viewButton.textContent = 'View Details';
    viewButton.classList.add('detailsButton');
    viewButton.addEventListener('click', () => {
      // Navigate to itemDetails page passing the item id as a parameter
      window.location.href = '/itemDetails?idItem=' + data[i].idItems + '&idUser=' + data[i].idusers;
    });
    viewDetails.appendChild(viewButton);

   

    itemRow.appendChild(itemName);
    itemRow.appendChild(itemPrice);
    itemRow.appendChild(itemDescription);
    itemRow.appendChild(viewDetails);

    itemTable.appendChild(itemRow);
  }
}
