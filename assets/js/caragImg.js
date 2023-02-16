const firebaseConfig = {
    apiKey: "AIzaSyBa6Op4MQHY5kaeCOBHfRuw_VHSXgbcYn0",
    authDomain: "apple-55adb.firebaseapp.com",
    databaseURL: "gs://apple-55adb.appspot.com",
    projectId: "apple-55adb",
    storageBucket: "apple-55adb.appspot.com",
    messagingSenderId: "797079389741",
    appId: "1:797079389741:web:729e6868a42410f1341aa4",
    measurementId: "G-9G30DFC6MX"
};
  
  // Inicializa la aplicación de Firebase con la configuración proporcionada
firebase.initializeApp(firebaseConfig);
// Función para cargar imágenes en Firebase
// Obtener referencia al input de imagen
const imageUpload = document.getElementById('imageUpload');

// Escuchar evento de cambio en el input de imagen
imageUpload.addEventListener('change', (e) => {
  // Obtener archivo seleccionado por el usuario
  const file = e.target.files[0];

  // Crear referencia al archivo en Storage de Firebase
  const storageRef = firebase.storage().ref().child(`images/${file.name}`);

  // Subir archivo a Storage de Firebase
  storageRef.put(file).then((snapshot) => {
    console.log('Archivo subido con éxito!');
  }).catch((error) => {
    console.error(error);
  });
});