let cart = JSON.parse(localStorage.getItem('cart')) || [];

function showCart() {
  const cartContainer = document.querySelector('#cart-container');
  cartContainer.innerHTML = '';
  const cartTitle = document.createElement('h2');
  cartTitle.innerText = 'Carrito de compras';
  const cartList = document.createElement('ul');
  const cartTotal = document.createElement('p');
  let total = 0;
  cart.forEach(product => {
    const productListItem = document.createElement('li');
    productListItem.classList.add('product-item');
    const productName = document.createElement('span');
    productName.innerText = product.name;
    const productPrice = document.createElement('span');
    productPrice.innerText = `$${product.price.toFixed(2)}`;
    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Eliminar';
    deleteButton.addEventListener('click', () => {
      const index = cart.indexOf(product);
      if (index > -1) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        showCart();
      }
    });
    productListItem.appendChild(productName);
    productListItem.appendChild(productPrice);
    productListItem.appendChild(deleteButton);
    cartList.appendChild(productListItem);
    total += product.price;
  });
  cartTotal.innerText = `Total: $${total.toFixed(2)}`;
  cartContainer.appendChild(cartTitle);
  cartContainer.appendChild(cartList);
  cartContainer.appendChild(cartTotal);
}

function addProductToCart(name, price) {
  cart.push({ name: name, price: price });
  localStorage.setItem('cart', JSON.stringify(cart));
}

function clearCart() {
  cart = [];
  localStorage.removeItem('cart');
  showCart();
}

function finalizePurchase() {
  clearCart();
  alert('¡Gracias por su compra!');
}

window.addEventListener('load', function() {
  const showCartButton = document.querySelector('#show-cart-button');
  showCartButton.addEventListener('click', () => {
    const cartContainer = document.querySelector('#cart-container');
    cartContainer.style.display = 'block';
    showCart();
  });
  const hideCartButton = document.querySelector('#hide-cart-button');
  hideCartButton.addEventListener('click', () => {
    const cartContainer = document.querySelector('#cart-container');
    cartContainer.style.display = 'none';
  });
});