  // Initialize Firebase
  var firebaseConfig = {
    apiKey: "AIzaSyBa6Op4MQHY5kaeCOBHfRuw_VHSXgbcYn0",
    authDomain: "apple-55adb.firebaseapp.com",
    databaseURL: "https://apple-55adb-default-rtdb.firebaseio.com",
    projectId: "apple-55adb",
    storageBucket: "apple-55adb.appspot.com",
    messagingSenderId: "797079389741",
    appId: "1:797079389741:web:729e6868a42410f1341aa4",
    measurementId: "G-9G30DFC6MX"
  };
  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
}
  const formProduct = document.querySelector(".form-product");
  if (formProduct) {
    formProduct.addEventListener("submit", function (event) {
        event.preventDefault();
  
        const productName = formProduct.querySelector("#product-name").value;
        const productImage = formProduct.querySelector("#product-image").value;
        const productPrice = formProduct.querySelector("#product-price").value;
        const product = {
          name: productName,
          image: productImage,
          price: productPrice,
        };
  
        // Initialize Firebase if it hasn't been done yet

  
        // Save the product in the database
        database.ref().push();
    });
  }


// Obtener una referencia al servicio de base de datos
var database = firebase.database();
const productsRef = database.ref();

function loadProducts() {
  productsRef.on("value", function (snapshot) {
    const products = snapshot.val();
    for (let key in products) {
      const product = products[key];
      addProduct(product.name, product.price);
    }
  });
}

function addProduct(name, price) {
    const fetchUrl = 'https://www.dolarsi.com/api/api.php?type=valoresprincipales';
    fetch(fetchUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al obtener la tasa de cambio. Estado HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const exchangeRate = data.filter(x => x.casa.nombre === 'Dolar Blue')[0].casa.venta;
            const arsPrice = (price / 100) * parseFloat(exchangeRate.replace(',', ''));

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
            productContainer.appendChild(productImage);

            const productName = document.createElement('h3');
            productName.innerText = name;
            productContainer.appendChild(productName);

            const productPrice = document.createElement('p');
            productPrice.innerText = `Precio: ARS $${arsPrice.toLocaleString()}`;
            productContainer.appendChild(productPrice);

            const btnComprar = document.createElement("button");
            btnComprar.classList.add("btn-comprar");
            btnComprar.innerText = "Ver mas";
            productContainer.appendChild(btnComprar);

            const catalogSection = document.querySelector('#catalog');
            catalogSection.appendChild(productContainer);
        })
        .catch(error => {
            console.error(error);
        });
}
