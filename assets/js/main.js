const toggleButton = document.querySelector('.toggle-button');
const navbarList = document.querySelector('.navbar-list');

toggleButton.addEventListener('click', function() {
  navbarList.classList.toggle('active');
});

//cambio de imagen segun seleccion del usuario (esta echo de esta manera para que parezca que cambia de color solo el celular)


const images = ["assets/img/logo2.jpg", "assets/img/logo2oro.jpg", "assets/img/logo2plata.jpg", "assets/img/logo2negro.jpg"];
const imageContainer = document.getElementById("imageContainer");
const currentImage = document.getElementById("currentImage");
const color1Btn = document.getElementById("color1Btn");
const color2Btn = document.getElementById("color2Btn");
const color3Btn = document.getElementById("color3Btn");
const color4Btn = document.getElementById("color4Btn");
const buttons = document.querySelectorAll(".cambioColor button");
var currentIndex = 0;
var timer = null;

// función para cambiar la imagen
function changeImage(index) {
  currentImage.style.opacity = 0; // oculta la imagen actual
  setTimeout(function() {
    currentIndex = index;
    currentImage.src = images[index]; // carga la nueva imagen
    currentImage.style.opacity = 1; // muestra la nueva imagen
    updateActiveButton(index); // actualiza el botón activo
    restartTimer(); // reinicia el timer
  }, 700);
}

// función para actualizar el botón activo
function updateActiveButton(index) {
  const activeButton = document.querySelector(".cambioColor button.active");
  if (activeButton) {
    activeButton.classList.remove("active");
  }
  const newActiveButton = document.querySelector(`.cambioColor button[data-index="${index}"]`);
  newActiveButton.classList.add("active");
}

// función para reiniciar el timer
function restartTimer() {
  clearInterval(timer); // detiene el timer actual
  timer = setInterval(function() { // crea un nuevo timer
    currentIndex = (currentIndex + 1) % images.length; // cambia al siguiente índice de imagen
    changeImage(currentIndex); // cambia la imagen
  }, 5000);
}

// agregar listeners a los botones de color
color1Btn.addEventListener("click", function() {
  changeImage(0);
});

color2Btn.addEventListener("click", function() {
  changeImage(1);
});

color3Btn.addEventListener("click", function() {
  changeImage(2);
});

color4Btn.addEventListener("click", function() {
  changeImage(3);
});

// agregar listeners a todos los botones de color
for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", function() {
    changeImage(i);
    updateActiveButton(i);
  });
  buttons[0].classList.add("active"); // activar el primer botón al cargar la página
}

restartTimer(); // iniciar el timer al cargar la página

//entrada al area de tienda

const titulo1 = document.querySelector(".entrada1");
const titulo2 = document.querySelector(".entrada2");

window.addEventListener("scroll", function() {
const posicionTitulo1 = titulo1.getBoundingClientRect().top;
const posicionTitulo2 = titulo2.getBoundingClientRect().top;
const altoVentana = window.innerHeight;

if (posicionTitulo1 < altoVentana) {
titulo1.classList.add("visible");
} else {
titulo1.classList.remove("visible");
}

if (posicionTitulo2 < altoVentana) {
titulo2.classList.add("visible");
} else {
titulo2.classList.remove("visible");
}
});

