document.addEventListener('DOMContentLoaded', () => {
    getItemData();
  });

async function getItemData() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const idItem = urlParams.get('idItem');
        const idUser = urlParams.get('idUser');
    
        const itemResponse = await fetch(`http://localhost:3000/requestedItemDetails?idItem=${idItem}`);
        const userResponse = await fetch(`http://localhost:3000/getUserDetails?idUser=${idUser}`);
      if (!itemResponse.ok || !userResponse.ok) {
        throw new Error('Network response was not ok');
      }
        const itemData = await itemResponse.json();
        const userData = await userResponse.json();
        displayInformation(userData, itemData);
    } catch (error) {
      console.log('ERROR:', error);
    }
  }

  function cartCheck(cartItem){
    fetch('/getCartItems')
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Network response was not ok');
      }
    })
    .then((cartItems) => {
      const isItemInCart = cartItems.some((item) => item.idItems === cartItem.idItems);
  
      if (isItemInCart) {
        console.log('Item already exists in the cart.');
        return;
      } else {
        addItemToCart(cartItem);
      }
    })
    .catch((error) => {
      console.log('ERROR:', error);
    });
  }
  
  function addItemToCart(cartItem) {

    const url = '/updateCartItems';
    const data = { cartItem };
  
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Item added to cart! ' + cartItem);
          return response.json();
        } else {
          throw new Error('Network response was not ok');
        }
      })
      .then((data) => {
        console.log('Updated cart items:', data.cartItems);
      })
      .catch((error) => {
        console.log('ERROR:', error);
      });
  }
  
  
  

function displayInformation(user, item){
    const br = document.createElement('br');

    //Item -----------------------------------------------------------
    const itemDetails = document.getElementById('item-details');

    const itemInformation = document.createElement('h1');
    itemInformation.textContent = "Item information";

    const itemName = document.createElement('p');
    itemName.textContent = "Item: " + item[0].itemName;

    const itemPrice = document.createElement('p');
    itemPrice.textContent = "Price: " + item[0].itemPrice;

    const Description = document.createElement('p');
    Description.textContent = "Product description: " + item[0].itemDescription;

    itemDetails.appendChild(itemInformation);
    itemDetails.appendChild(itemName);
    itemDetails.appendChild(itemPrice);
    itemDetails.appendChild(Description);
    itemDetails.appendChild(br);

    //Seller -----------------------------------------------------------
    const sellerDetails = document.getElementById('seller-details');

    const information = document.createElement('h1');
    information.textContent = "Seller information";

    const seller = document.createElement('p');
    seller.textContent = "Seller: " + user[0].userName + " (" + user[0].firstName + " " + user[0].lastName + ")";

    const address = document.createElement('p');
    address.textContent = "Address: " + user[0].userAddress;

    const email = document.createElement('p');
    email.textContent = "Email: " + user[0].userEmail;

    sellerDetails.appendChild(information);
    sellerDetails.appendChild(seller);
    sellerDetails.appendChild(address);
    sellerDetails.appendChild(email);

    //Add to cart --------------------------------------------------------
    const addToCart = document.getElementById('add-to-cart');

    const addToCartButton = document.createElement('button');
    addToCartButton.textContent = 'Add to Cart';
    addToCartButton.classList.add('addToCartButton');

    addToCartButton.addEventListener('click', () => {
      const cartItem = item[0];
      cartCheck(cartItem);
    });

    addToCart.appendChild(addToCartButton);

}

