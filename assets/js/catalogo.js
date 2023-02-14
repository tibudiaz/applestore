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
            cart.forEach(product => addProduct(product.name, product.price, product.image));
            });
        } else {
        // Si encontramos los productos en el local storage, los agregamos al catálogo directamente
        cart.forEach(product => addProduct(product.name, product.price, product.image));
        }
    }

//llamamos a la api del precio del dolar 
function getExchangeRate() {
    return fetch('https://www.dolarsi.com/api/api.php?type=valoresprincipales')
        .then(response => response.json())
        .then(data => parseFloat(data.filter(x => x.casa.nombre === 'Dolar Blue')[0].casa.venta.replace(',', '')));
    }
    //tomamos el precio añadido por el usuario (en dolares) y lo pasamos a pesos segun cotizacion de mi ciudad del dolar. (por eso a exchangeRate le sumo $4)
    function addProduct(name, price) {
    getExchangeRate().then(exchangeRate => {
      const arsPrice = (price / 100) * (exchangeRate + 400);

        // Continuamos con la lógica de la función
        const productContainer = document.createElement('div');
        productContainer.classList.add('product-card');
        const productImage = document.createElement('img');
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

        const productPrice = document.createElement('p');
        productPrice.innerText = `Precio: ARS $${arsPrice.toLocaleString()}`;
        const btnComprar = document.createElement("button");
        btnComprar.classList.add("btn-comprar");
        btnComprar.innerText = "Ver mas";
        productContainer.appendChild(productImage);
        productContainer.appendChild(productName);
        productContainer.appendChild(productPrice);
        productContainer.appendChild(btnComprar);
        const catalogSection = document.querySelector('#catalog');
        catalogSection.appendChild(productContainer);
    });
}

// Llamamos a la función loadProducts al cargar la página
window.addEventListener("load", function () {
    loadProducts();
});