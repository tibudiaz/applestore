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
if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
}




function loadProducts() {
    let cart = []; 

    // Obtenemos los productos de Firebase
    firebase.database().ref("cart").once("value")
        .then(snapshot => {
            snapshot.forEach(productSnapshot => {
                const product = productSnapshot.val();
                cart.push(product);
            });

            // Llamamos a la función addProduct para agregar cada producto al catálogo
            cart.forEach(product => addProduct(product.name, product.price, product.bat, product.memoria, product.color, product.estado));
        });
}


//llamamos a la api del precio del dolar
function getExchangeRate() {
    return fetch('https://www.dolarsi.com/api/api.php?type=valoresprincipales')
        .then(response => response.json())
        .then(data => parseFloat(data.filter(x => x.casa.nombre === 'Dolar Blue')[0].casa.venta.replace(',', '')));
}

//tomamos el precio añadido por el usuario (en dolares) y lo pasamos a pesos segun cotizacion de mi ciudad del dolar. (por eso a exchangeRate le sumo $4)
function addProduct(name, price, bat, memoria, color, estado) {
    getExchangeRate().then(exchangeRate => {
        const arsPrice = (price / 100) * (exchangeRate + 300);
        // Continuamos con la lógica de la función
        const productContainer = document.createElement('div');
        productContainer.classList.add('product-card');
        if (estado === "Nuevo") {
            productContainer.classList.add('new-product');
            document.getElementById("new-products").appendChild(productContainer);
            
        } else {
            productContainer.classList.add('used-product');
            document.getElementById("used-products").appendChild(productContainer);

        }
        const productImage = document.createElement('img');
        // Agregar un atributo "data-name" para almacenar el nombre del producto
        productImage.setAttribute('data-name', name);
        productImage.setAttribute('data-color', color);
        productImage.setAttribute('data-mem', memoria);
        productImage.setAttribute('data-bat', bat);
        // Agregar un event listener para el evento "click"
        productImage.addEventListener('click', carousel);
        //javascript va a tomar el nombre del equipo cargado por el usuario y va a definir una foto segun coincidencias
        switch (name.toLowerCase()) {
            case 'iphone 8':
                productImage.src = 'assets/img/iphones/8.jpg';
            break;
            case 'iphone 8 plus':
                productImage.src = 'assets/img/iphones/8p.jpg';
            break;
            case 'iphone x':
                productImage.src = 'assets/img/iphones/x.jpg';
            break;
            case 'iphone xs':
                productImage.src = 'assets/img/iphones/xs.jpg';
            break;
            case 'iphone xs max':
                productImage.src = 'assets/img/iphones/xsm.jpg';
            break;
            case 'iphone xr':
                productImage.src = 'assets/img/iphones/xr.jpg';
            break;
            case 'iphone 11':
                productImage.src = 'assets/img/iphones/11.jpg';
            break;
            case 'iphone 11 pro':
                productImage.src = 'assets/img/iphones/11p.jpg';
            break;
            case 'iphone 11 pro max':
                productImage.src = 'assets/img/iphones/11pm.jpg';
            break;
            case 'iphone 12':
                productImage.src = 'assets/img/iphones/12.png';
            break;
            case 'iphone 12 pro':
                productImage.src = 'assets/img/iphones/12p.png';
            break;
            case 'iphone 12 pro max':
                productImage.src = 'assets/img/iphones/12pm.png';
            break;
            case 'iphone 13':
                productImage.src = 'assets/img/iphones/13.jpg';
            break;
            case 'iphone 13 pro':
                productImage.src = 'assets/img/iphones/13p.jpg';
            break;
            case 'iphone 13 pro max':
                productImage.src = 'assets/img/iphones/13pm.jpg';
            break;
            case 'iphone 14':
                productImage.src = 'assets/img/iphones/14.jpg';
            break;
            case 'iphone 14 plus':
                productImage.src = 'assets/img/iphones/14plus.png';
            break;
            case 'iphone 14 pro':
                productImage.src = 'assets/img/iphones/14p.jpg';
            break;
            case 'iphone 14 pro max':
                productImage.src = 'assets/img/iphones/14pm.jpg';
            break;

            default:
                productImage.src = 'assets/img/png-clipart-candied-apples-apple-logo.png';
        }



        const productName = document.createElement('h3');
        productName.innerText = name;
        //segun condicion de bateria tira un color especifico o lo define como nuevo
        const productBat = document.createElement('h4');

            switch (true) {
                case (bat < 10):
                productBat.innerText = "Equipo nuevo";
                break;
                default:
                productBat.innerText = `Condición de batería ${bat}%`;
                if (bat >= 90) {
                    productBat.style.color = 'green';
                } else if (bat >= 80) {
                    productBat.style.color = 'orange';
                } else {
                    productBat.style.color = 'red';
                }
            }
            
            
            
            
        const productMem = document.createElement('h4');
        productMem.innerText = `Memoria ${memoria}Gb.`;
        const productCol = document.createElement('h4');
        productCol.innerText = `Color ${color}.`;
        const productPrice = document.createElement('p');
        productPrice.innerText = `Precio: ARS $${arsPrice.toLocaleString()}`;
        const productPriceUsd = document.createElement('p');
        productPriceUsd.innerText = `Precio: USD $${price.toLocaleString()}`;
        productContainer.appendChild(productImage);
        productContainer.appendChild(productName);
        productContainer.appendChild(productMem);
        productContainer.appendChild(productCol);
        productContainer.appendChild(productBat);
        productContainer.appendChild(productPrice);
        productContainer.appendChild(productPriceUsd);
        const btnAgregarAlCarrito = document.createElement("button");
        btnAgregarAlCarrito.classList.add("btn-comprar");
        btnAgregarAlCarrito.innerText = "Agregar al carrito";
        btnAgregarAlCarrito.addEventListener("click", () => {
            addProductToCart(name, arsPrice);
            showCart();
        });
        productContainer.appendChild(btnAgregarAlCarrito);
    });
}
//funcion carousel con imagenes cargadas en firebase (elije las fotos segun el nombre del producto)
function carousel(event) {
    //mosrtamos el boton de carga
    const loadingButton = document.getElementById("loading-button");
    loadingButton.style.display = "block";
    // Obtener el nombre del producto
    const productName = event.target.getAttribute("data-name");
    const productColor = event.target.getAttribute("data-color");
    const productMem = event.target.getAttribute("data-mem");
    const productBat = event.target.getAttribute("data-bat");
    let folderName = productName;
    if (productColor) {
        folderName += ` ${productColor} ${productMem} ${productBat}`;
        }
        //buscamos la carpeta del producto en firebase
        const storageRef = firebase.storage().ref().child(`${folderName}`);
        storageRef.listAll().then((result) => {
        const images = [];
        result.items.forEach((imageRef) => {
            imageRef.getDownloadURL().then((url) => {
            images.push(url);
            if (images.length === result.items.length) {;
                // Ocultar botón de carga después de 2000ms
            setTimeout(() => {
                loadingButton.style.display = "none";
            }, 1000);
                const slides = images
                .map((url, index) => `
                    <div class="carousel-item${index === 0 ? ' active' : ''}">
                    <img src="${url}" class="d-block w-100" alt="">
                    </div>
                `)
                .join("");
    
                const gallery = document.createElement("div");
                gallery.classList.add("product-gallery", "carousel", "slide");
                gallery.setAttribute("data-bs-ride", "carousel");
                gallery.setAttribute("id", "product-carousel");
    
                gallery.innerHTML = `
                <div class="carousel-indicators">
                    ${images.map((_, index) => `
                    <button type="button" data-bs-target="#product-carousel" data-bs-slide-to="${index}"${index === 0 ? ' class="active" aria-current="true"' : ''} aria-label="Slide ${index + 1}"></button>
                    `).join('')}
                </div>
    
                <div class="carousel-inner">
                    ${slides}
                </div>
    
                <button class="carousel-control-prev" type="button" data-bs-target="#product-carousel" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Anterior</span>
                </button>
    
                <button class="carousel-control-next" type="button" data-bs-target="#product-carousel" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Siguiente</span>
                </button>

                <button type="button" class="btn-close" aria-label="Close"></button>
                `;
    
                document.body.appendChild(gallery);
                gallery.style.position = "fixed";
                // Inicializar el carrusel con Bootstrap
                const carousel = $(gallery).find(".carousel");
                carousel.carousel({
                interval: false, // Para que no avance automáticamente
                });
                // Agregar evento al botón de cierre
                $(".btn-close", gallery).click(() => {
                $(gallery).remove();
                });
                const handleDocumentClick = (event) => {
                    if (!gallery.contains(event.target)) {
                    $(gallery).remove();
                    document.removeEventListener("click", handleDocumentClick);
                    }
                };
                document.addEventListener("click", handleDocumentClick);
                

            }
            });
        });
        });
    }
    



//carrito de compras
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    function showCart() {
    const cartCount = document.querySelector('#cart-count');
    cartCount.innerText = carrito.length;
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
        productPrice.innerText = `$${product.price.toLocaleString()}`;
        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Eliminar';
        deleteButton.classList.add('close-button1');
        deleteButton.addEventListener('click', () => {
            const index = carrito.indexOf(product);
            if (index > -1) {
                carrito.splice(index, 1);
                localStorage.setItem('carrito', JSON.stringify(carrito));
                showCart();
                const Swal1 = Swal.mixin({
                    customClass: {
                        container: 'my-swal'
                    },      
                    })
                Swal1.fire({
                    position: 'top-start',
                    icon: 'success',
                    title: 'Producto eliminado',
                    showConfirmButton: false,
                    timer: 1000
                })
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
    closeButton.innerText = '';
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
        const Swal1 = Swal.mixin({
            customClass: {
                container: 'my-swal'
            },      
            })
        Swal1.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Producto agregado al carrito',
            showConfirmButton: false,
            timer: 1200
        })
        const cartCount = document.querySelector('#cart-count');
        cartCount.innerText = carrito.length;
    }
//borra productos
    function clearCart() {
        const Swal1 = Swal.mixin({
            customClass: {
                container: 'my-swal'
            },      
            })
        
        Swal1.fire({
            title: '¿Estás seguro de que deseas borrar todo el contenido del carrito?',
            text: "Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Borrar',
            cancelButtonText: 'No, Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    carrito = [];
                    localStorage.removeItem('carrito');
                    showCart();
                    Swal.fire(
                    'Borrado',
                    'El carrito fue borrado',
                    'success'
                )
                }
            })
            const cartCount = document.querySelector('#cart-count');
            cartCount.innerText = carrito.length;
        }
    //finalizar la compra
    function finalizePurchase() {
        const hasPositivePriceProduct = carrito.some((product) => product.price > 0);
        const hasNegativePriceProduct = carrito.some((product) => product.price < 0);
      
        const message = `Hola, quiero comprar: ${
          hasPositivePriceProduct
            ? carrito
                .filter((product) => product.price > 0)
                .map((product) => `${product.name}  ${product.price.toLocaleString()}`)
                .join(", ")
            : ""
        }${hasPositivePriceProduct && hasNegativePriceProduct ? ". " : ""}${
          hasNegativePriceProduct
            ? "Entregaría: " +
              carrito
                .filter((product) => product.price < 0)
                .map((product) => `${product.name} ${product.price.toLocaleString()}`)
                .join(", ")
            : ""
        }`;
      
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/+5493584224464?text=${encodedMessage}`;
      
        Swal.fire({
          title: "¿Estás seguro de realizar la compra?",
          text: "Te redirigiremos con uno de nuestros asesores.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Sí",
          cancelButtonText: "No",
          reverseButtons: true,
          customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger",
            container: "my-swal",
          },
        }).then((result) => {
          if (result.isConfirmed) {
            let timerInterval;
            Swal.fire({
              title: "Muchas gracias!",
              html: "Lo estamos redirigiendo. Aguarde...",
              timer: 2000,
              timerProgressBar: true,
              didOpen: () => {
                Swal.showLoading();
                const b = Swal.getHtmlContainer().querySelector("b");
                timerInterval = setInterval(() => {
                  b.textContent = Swal.getTimerLeft();
                }, 100);
              },
              willClose: () => {
                window.location.href = whatsappUrl;
                localStorage.removeItem("carrito");
                clearInterval(timerInterval);
              },
              customClass: {
                container: "my-swal",
              },
            }).then((result) => {
              if (result.dismiss === Swal.DismissReason.timer) {
                console.log("se cerro el timer");
              }
            });
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire(
              "Cancelado",
              "La compra ha sido cancelada",
              "error"
            );
          }
        });
      }
      
        
    window.addEventListener('load', function() {
        const showCartButton = document.querySelector('#show-cart-button');
        showCartButton.addEventListener('click', () => {
            const cartContainer = document.querySelector('#cart-container');
            cartContainer.style.display = 'block';
            cartContainer.style.opacity = 0;
            setTimeout(() => {
                cartContainer.style.opacity = 1;
            }, 100);
            showCart();
        });
    
        const hideCartButton = document.querySelector('#hide-cart-button');
        hideCartButton.addEventListener('click', () => {
            const cartContainer = document.querySelector('#cart-container');
            cartContainer.style.opacity = 0;
            setTimeout(() => {
                cartContainer.style.display = 'none';
            }, 1500);
        });
    });
    


// Llamamos a la función loadProducts al cargar la página
window.addEventListener("load", function () {
    loadProducts();
});

//cotizacion de celulares:

// Definir precios base para cada modelo de iPhone
const prices = {
    "iPhone 8": 200,
    "iPhone 8 Plus": 230,
    "iPhone X": 500,
    "iPhone 11": 600,
    "iPhone 11 Pro": 800,
    "iPhone 11 Pro Max": 900,
    "iPhone 12": 1000,
    "iPhone 12 Pro": 1200,
    "iPhone 12 Pro Max": 1300,
    "iPhone 13": 1400,
    "iPhone 13 Pro": 1600,
    "iPhone 13 Pro Max": 1700,
    "iPhone 14": 1800,
    "iPhone 14 Plus": 2000,
    "iPhone 14 Pro": 2200,
    "iPhone 14 Pro Max": 2400
    };
    
    // Obtener los elementos del DOM
    const modelName = document.getElementById("product-name");
    const memory = document.getElementById("product-mem");
    const batteryCondition = document.getElementById("product-bat");
    const quoteButton = document.getElementById("cotizar");
    const quoteResult = document.getElementById("cotizacion");
    
    // Función para cotizar
    function cotizar() {
        // Obtener los valores seleccionados por el usuario
        const model = modelName.value;
        const memorySize = Number(memory.value);
        const battery = Number(batteryCondition.value);
    
        // Obtener el precio base del modelo de iPhone
        var priceUsd = prices[model];
    
        // Sumar 20 USD por cada 64 GB adicionales de memoria
        priceUsd += Math.floor((memorySize - 64) / 64) * 20;
    
        // Reducir el precio según la condición de la batería
        if (battery < 80) {
        if (model.includes("iPhone 8") || model.includes("iPhone X")) {
            priceUsd -= 30;
        } else {
            priceUsd -= 40;
        }
        } else if (battery < 90) {
        if (model.includes("iPhone 8") || model.includes("iPhone X")) {
            priceUsd -= 15;
        } else {
            priceUsd -= 30;
        }
        }
        function getPriceInPesos(priceUsd) {
            return getExchangeRate()
            .then(exchangeRate => {
                const price = (priceUsd / 100) * (exchangeRate + 300); //(price / 100) * (exchangeRate + 300)
                return price;
            });
        }
        // Obtener el precio en pesos
        getPriceInPesos(priceUsd)
        .then((price) => {
            // Mostrar el resultado de la cotización al usuario con SweetAlert
            const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger",
            },
            buttonsStyling: false,
            });
    
            swalWithBootstrapButtons
            .fire({
                title: `El valor de su iPhone es: $${price.toLocaleString()} USD ${priceUsd}`,
                html:
                '<br><p style="font-size: 16px; font-weight: 500;">*La cotización está sujeta a revisión*</p>',
                icon: "success",
                showCancelButton: true,
                confirmButtonText: "Continuar",
                cancelButtonText: "Cancelar",
                reverseButtons: true,
            })
            .then((result) => {
                if (result.isConfirmed) {
                // Agregar el producto al carrito
                carrito.push({
                    name: model,
                    price: -price,
                    
                });showCart();
                localStorage.setItem("carrito", JSON.stringify(carrito));
                const Swal1 = Swal.mixin({
                    customClass: {
                    container: "my-swal",
                    },
                });
                Swal1.fire({
                    position: "top-start",
                    icon: "success",
                    title: "Producto agregado al carrito",
                    showConfirmButton: false,
                    timer: 1000,
                });
                } else if (
                result.dismiss === Swal.DismissReason.cancel ||
                result.dismiss === Swal.DismissReason.backdrop
                ) {
                swalWithBootstrapButtons.fire(
                    "Cancelado",
                    "Su cotización no se guardo.",
                    "error"
                );
                }
            });
        });
    }
    

    
    // Asignar la función cotizar al botón de cotización
    quoteButton.addEventListener("click", cotizar);
    