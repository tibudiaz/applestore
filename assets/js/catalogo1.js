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




//tomamos los datos cargados en el formulario por el usuario y los almacenamos en el local storage
const formProduct = document.querySelector(".form-product");
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

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  sendDataToFirebase(product);
  formProduct.reset();
});

// Inicializa la aplicación de Firebase con la configuración proporcionada
firebase.initializeApp(firebaseConfig);

// Define la función que enviará los datos a Firebase
function sendDataToFirebase(product) {
  // Obtiene una referencia a la base de datos de Firebase
  const database = firebase.database();

  // Envía el nuevo producto a Firebase
  database.ref('cart').push(product, error => {
    if (error) {
      console.error('Error al enviar los datos a Firebase:', error);
    } else {
      console.log('Los datos se enviaron correctamente a Firebase.');
    }
  });
}

// Carga los productos desde Firebase al cargar la página
function loadProducts() {
  // Intentamos obtener los productos del Local Storage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Obtenemos los productos de Firebase y los agregamos al Local Storage si no se encontraron allí antes
  firebase.database().ref("cart").once("value")
    .then(snapshot => {
      snapshot.forEach(productSnapshot => {
        const product = productSnapshot.val();
        if (!cart.find(item => item.name === product.name)) {
          cart.push(product);
        }
      });
      localStorage.setItem("cart", JSON.stringify(cart));
      cart.forEach(product => addProduct(product.name, product.price, product.image));
    });
}

// Llamamos a la función loadProducts al cargar la página
window.addEventListener("load", function () {
  loadProducts();
});
