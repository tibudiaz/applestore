const firebaseConfig = {

    apiKey: "AIzaSyBa6Op4MQHY5kaeCOBHfRuw_VHSXgbcYn0",
    authDomain: "apple-55adb.firebaseapp.com",
    databaseURL: "https://apple-55adb-default-rtdb.firebaseio.com",
    projectId: "apple-55adb",
    storageBucket: "apple-55adb.appspot.com",
    messagingSenderId: "797079389741",
    appId: "1:797079389741:web:729e6868a42410f1341aa4",
    measurementId: "G-9G30DFC6MX"
};
// Inicializa la aplicación de Firebase con la configuración proporcionada
firebase.initializeApp(firebaseConfig);  




//funcion para leer lo cargado en el local storage
function loadProducts() {
    // Intentamos obtener los productos del local storage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
        // Si no encontramos los productos en el local storage, los obtenemos de Firebase
        if (cart.length === 0) {
        firebase.database().ref("cart").once("value")
            .then(snapshot => {
            snapshot.forEach(productSnapshot => {
                const product = productSnapshot.val();
                cart.push(product);
            });
            // Llamamos a la función addProduct para agregar cada producto al catálogo
            cart.forEach(product => addProduct(product.name, product.price, product.bat));
            });
        } else {
        // Si encontramos los productos en el local storage, los agregamos al catálogo directamente
        cart.forEach(product => addProduct(product.name, product.price, product.bat));
        }
    }

//llamamos a la api del precio del dolar 
function getExchangeRate() {
    return fetch('https://www.dolarsi.com/api/api.php?type=valoresprincipales')
        .then(response => response.json())
        .then(data => parseFloat(data.filter(x => x.casa.nombre === 'Dolar Blue')[0].casa.venta.replace(',', '')));
    }
    //tomamos el precio añadido por el usuario (en dolares) y lo pasamos a pesos segun cotizacion de mi ciudad del dolar. (por eso a exchangeRate le sumo $4)
    function addProduct(name, price, bat) {
    getExchangeRate().then(exchangeRate => {
      const arsPrice = (price / 100) * (exchangeRate + 400);

        // Continuamos con la lógica de la función
        const productContainer = document.createElement('div');
        productContainer.classList.add('product-card');
        const productImage = document.createElement('img');
        //javascript va a tomar el nombre del equipo cargado por el usuario y va a definir una foto segun coincidencias
        switch (name.toLowerCase()) {
            case 'iphone 13 pro max':
                productImage.src = 'assets/img/header_iphone_13_pro_sierra_blue_large_2x-1.jpg';
            break;
            case 'iphone 12 pro max':
                productImage.src = 'assets/img/iph12pm.png';
            break;
            default:
                productImage.src = 'assets/img/png-clipart-candied-apples-apple-logo.png';
        }

        const productName = document.createElement('h3');
        productName.innerText = name;
        //segun condicion de bateria tira un color especifico
        const productBat = document.createElement('h4');
        productBat.innerText = `Condicion de bateria ${bat}%`;
        if (bat > 90) {
            productBat.style.color = 'green';
        } else if (bat >= 80 && bat <= 90) {
            productBat.style.color = 'orange';
        } else {
            productBat.style.color = 'red';
        }
        const productPrice = document.createElement('p');
        productPrice.innerText = `Precio: ARS $${arsPrice.toLocaleString()}`;
        productContainer.appendChild(productImage);
        productContainer.appendChild(productName);
        productContainer.appendChild(productBat);
        productContainer.appendChild(productPrice);
        const catalogSection = document.querySelector('#catalog');
        catalogSection.appendChild(productContainer);
        const btnAgregarAlCarrito = document.createElement("button");
        btnAgregarAlCarrito.classList.add("btn-comprar");
        btnAgregarAlCarrito.innerText = "Agregar al carrito";
        btnAgregarAlCarrito.addEventListener("click", () => {
            addProductToCart(name, arsPrice);
        });
        productContainer.appendChild(btnAgregarAlCarrito);
        
    });
}

//carrito de compras
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    function showCart() {
    const cartContainer = document.querySelector('#cart-container');
    cartContainer.innerHTML = '';
    const cartTitle = document.createElement('h2');
    cartTitle.innerText = 'Carrito de compras';
    const cartList = document.createElement('ul');
    const cartTotal = document.createElement('p');
    let total = 0;
    carrito.forEach(product => {
        const productListItem = document.createElement('li');
        productListItem.classList.add('product-item');
        const productName = document.createElement('span');
        productName.innerText = product.name;
        const productPrice = document.createElement('span');
        productPrice.innerText = `$${product.price}`;
        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Eliminar';
        deleteButton.addEventListener('click', () => {
            const index = carrito.indexOf(product);
            if (index > -1) {
                carrito.splice(index, 1);
                localStorage.setItem('carrito', JSON.stringify(carrito));
                showCart();
            }
            });
            productListItem.appendChild(productName);
            productListItem.appendChild(productPrice);
            productListItem.appendChild(deleteButton);
            cartList.appendChild(productListItem);
            total += product.price;
    });
    cartTotal.innerText = `Total: $${total.toLocaleString()}`;
    cartContainer.appendChild(cartTitle);
    cartContainer.appendChild(cartList);
    cartContainer.appendChild(cartTotal);

    //Agrega los botones de "Borrar Carrito", "Finalizar Compra" y "Cerrar Carrito"
    const clearCartButton = document.createElement('button');
    clearCartButton.classList.add('cart-buttons');
    clearCartButton.innerText = 'Borrar Carrito';
    clearCartButton.addEventListener('click', clearCart);

    const finalizePurchaseButton = document.createElement('button');
    finalizePurchaseButton.classList.add('cart-button');
    finalizePurchaseButton.innerText = 'Finalizar Compra';
    finalizePurchaseButton.addEventListener('click', finalizePurchase);

    const closeButton = document.createElement('button');
    closeButton.classList.add('close-button');
    closeButton.innerText = 'X';
    closeButton.addEventListener('click', () => {
        cartContainer.style.display = 'none';
    });

    cartContainer.appendChild(clearCartButton);
    cartContainer.appendChild(finalizePurchaseButton);
    cartContainer.appendChild(closeButton);
}  
//agrega productos al carrito
    function addProductToCart(name, price) {
        carrito.push({ name: name, price: parseFloat(price) });
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }
//borra productos
    function clearCart() {
    carrito = [];
    localStorage.removeItem('carrito');
    showCart();
    }
//finalizar la compra
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



// Llamamos a la función loadProducts al cargar la página
window.addEventListener("load", function () {
    loadProducts();
});

