document.addEventListener('DOMContentLoaded', () => {
    getContactData();
  });
  
  
  
  async function getContactData() {
    try {
      const response = await fetch('http://localhost:3000/getContactData');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const contactTable = document.getElementById('message-output');
      loadToTable(data, contactTable);
    } catch (error) {
      console.log('ERROR:', error);
    }
  }

  function loadToTable(data, contactTable) {
    for (let i = 0; i < data.length; i++) {
      const itemRow = document.createElement('tr');
  
      const userName = document.createElement('td');
      userName.textContent = data[i].userName;
  
      const userEmail = document.createElement('td');
      userEmail.textContent = data[i].userEmail;
  
      const message = document.createElement('td');
      message.textContent = data[i].message;
  
      itemRow.appendChild(userName);
      itemRow.appendChild(userEmail);
      itemRow.appendChild(message);
  
      contactTable.appendChild(itemRow);
    }
  }