// configuracion de firebase para inicializar al servidor y tomar todos los celulares usados en venta

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



//tomamos los datos cargados por el usuario y los almacenamos en firebase
const formProduct = document.querySelector(".form-product");

formProduct.addEventListener("submit", function (event) {
  event.preventDefault();

  const productEstado = formProduct.querySelector("#product-estado").value;
  const productName = formProduct.querySelector("#product-name").value;
  const productBat = formProduct.querySelector("#product-bat").value;
  const productPrice = formProduct.querySelector("#product-price").value;
  const productMem = formProduct.querySelector("#product-mem").value;
  const productCol = formProduct.querySelector("#product-col").value;

  const product = {
    estado: productEstado,
    name: productName,
    bat: productBat,
    price: productPrice,
    memoria: productMem,
    color: productCol,
  };

  sendDataToFirebase(product);
  formProduct.reset();
});

// Inicializa la aplicación de Firebase con la configuración proporcionada
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}
// Define la función que enviará los datos a Firebase
function sendDataToFirebase(product) {
  // Obtiene una referencia a la base de datos de Firebase
  const database = firebase.database();

  // Envía el nuevo producto a Firebase
  database.ref('cart').push(product, error => {
    if (error) {
      const mensaje = 'Error al enviar los datos a Firebase: ' + error;
      console.error(mensaje);
      document.querySelector('.cart-container').innerHTML = mensaje;
    } else {
      const mensaje = 'Los datos se enviaron correctamente a Firebase.';
      console.log(mensaje);
      document.querySelector('.cart-container').innerHTML = mensaje;
    }
  });
}
