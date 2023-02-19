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


// Obtener referencias a los elementos HTML
const imageUpload = document.getElementById('imageUpload');
const productName = document.getElementById('productName');
const productColor = document.getElementById('productColor');
const productMem = document.getElementById('product-mem');
const productBat = document.getElementById('product-bat');
const uploadButton = document.getElementById('uploadButton');
const imagePreview = document.getElementById('imagePreview');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');
const progressBar = document.getElementById('progressBar');

// Ocultar el botón de subir imágenes inicialmente
uploadButton.style.display = 'none';

// Escuchar evento de cambio en el input de imagen
imageUpload.addEventListener('change', (e) => {
  imagePreview.innerHTML = ''; // Limpiar la previsualización
  successMessage.innerHTML = ''; // Limpiar el mensaje de éxito

  // Resetear la barra de progreso
  progressBar.value = 0;

  // Obtener archivos seleccionados por el usuario
  const files = e.target.files;

  // Mostrar previsualización de las imágenes
  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    // Crear objeto de imagen para previsualización
    const img = document.createElement('img');
    img.file = file;
    img.style.maxWidth = '100px';
    img.style.maxHeight = '100px';
    imagePreview.appendChild(img);

    const reader = new FileReader();
    reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
    reader.readAsDataURL(file);
  }

  // Mostrar el botón de subir imágenes
  uploadButton.style.display = 'block';
});

// Escuchar evento de clic en el botón de subir imágenes
uploadButton.addEventListener('click', () => {
  // Obtener los valores seleccionados del desplegable
  const selectedProductName = productName.value;
  const selectedProductColor = productColor.value;
  const selectedProductMem = productMem.value;
  const selectedProductBat = productBat.value;

  // Concatenar los valores seleccionados para crear el nombre de la carpeta
  const folderName = selectedProductName + ' ' + selectedProductColor + ' ' + selectedProductMem + ' ' + selectedProductBat;

  // Subir archivo a Storage de Firebase
  const storageRef = firebase.storage().ref(`${folderName}/`);
  const files = imageUpload.files;
  
    // Actualizar el máximo valor de la barra de progreso
    progressBar.max = files.length;
  
    let numFilesUploaded = 0;
    let filesLoaded = 0; // Agregar variable para llevar conteo de archivos cargados
  
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
  
      const uploadTask = storageRef.child(file.name).put(file);
  
      // Actualizar el valor de la barra de progreso durante la carga
      uploadTask.on('state_changed',
        function progress(snapshot) {
          const percentage = (filesLoaded + (snapshot.bytesTransferred / snapshot.totalBytes)) / files.length * 100; // Actualizar valor de la barra de progreso basado en conteo de archivos cargados
          progressBar.value = percentage;
        },
        function error(err) {
          errorMessage.innerHTML = 'Error al cargar imágenes'; // Mostrar mensaje de error
          console.error(err);
        },
        function complete() {
          numFilesUploaded++;
          filesLoaded++; // Incrementar conteo de archivos cargados
          if (numFilesUploaded === files.length) {
            successMessage.innerHTML = 'Imágenes cargadas con éxito en Firebase'; // Actualizar mensaje de éxito
  
            // Limpiar la previsualización y ocultar el botón de subir imágenes
            imagePreview.innerHTML = '';
            uploadButton.style.display = 'none';
  
            // Resetear la barra de progreso
            progressBar.value = 0;
          }
        }
      );
    }
  });

  