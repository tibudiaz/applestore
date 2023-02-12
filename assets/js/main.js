const toggleButton = document.querySelector('.toggle-button');
const navbarList = document.querySelector('.navbar-list');

toggleButton.addEventListener('click', function() {
  navbarList.classList.toggle('active');
});

//cambio de imagen segun seleccion del usuario


const images = ["assets/img/logo2.jpg", "assets/img/logo2oro.jpg", "assets/img/logo2plata.jpg", "assets/img/logo2negro.jpg"];
const imageContainer = document.getElementById("imageContainer");
const currentImage = document.getElementById("currentImage");
const color1Btn = document.getElementById("color1Btn");
const color2Btn = document.getElementById("color2Btn");
const color3Btn = document.getElementById("color3Btn");
const color4Btn = document.getElementById("color4Btn");

let currentIndex = 0;

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

function changeImage(index) {
  currentImage.style.opacity = 0;
  setTimeout(function() {
    currentIndex = index;
    currentImage.src = images[index];
    currentImage.style.opacity = 1;
  }, 300);
}

//botones del color del iphone. Activa la seleccionada
const buttons = document.querySelectorAll(".cambioColor button");

for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", function() {
    changeImage(i);

    for (let j = 0; j < buttons.length; j++) {
      buttons[j].classList.remove("active");
    }

    this.classList.add("active");
  });
  buttons[0].classList.add("active");
}

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

//boton comprar
const comprarBtn = document.querySelector("#comprarBtn");
const seccionProductos = document.querySelector("#tienda");

comprarBtn.addEventListener("click", function() {
  seccionProductos.scrollIntoView({
    behavior: "smooth"
  });
});