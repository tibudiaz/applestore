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
