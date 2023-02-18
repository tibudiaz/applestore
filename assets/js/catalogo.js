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
      const arsPrice = (price / 100) * (exchangeRate + 400);

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
        productContainer.appendChild(productImage);
        productContainer.appendChild(productName);
        productContainer.appendChild(productMem);
        productContainer.appendChild(productCol);
        productContainer.appendChild(productBat);
        productContainer.appendChild(productPrice);
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



//carrito de compras
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    function showCart() {
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
                Swal.fire({
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
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Producto agregado al carrito',
            showConfirmButton: false,
            timer: 1200
        })
    }
//borra productos
    function clearCart() {
        Swal.fire({
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
        }
    //finalizar la compra
    function finalizePurchase() {
        const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        },      
        })
                
        swalWithBootstrapButtons.fire({
        title: '¿Estás seguro de realizar la compra?',
        text: "Te redirigiremos con uno de nuestros asesores.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
        reverseButtons: true
        }).then((result) => {
        if (result.isConfirmed) {
            let timerInterval;
            Swal.fire({
            title: 'Muchas gracias!',
            html: 'Lo estamos redirigiendo. Aguarde...',
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading()
                const b = Swal.getHtmlContainer().querySelector('b')
                timerInterval = setInterval(() => {
                b.textContent = Swal.getTimerLeft()
                }, 100)
            },
            willClose: () => {
                let message = "Hola, quiero comprar: ";
            carrito.forEach(product => {
                message += `${product.name}  ${product.price.toLocaleString()}`;

            });
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/+5493584224464?text=${encodedMessage}`;
            window.location.href = whatsappUrl;
            localStorage.removeItem('carrito')
                clearInterval(timerInterval)
            }
            }).then((result) => {
            if (result.dismiss === Swal.DismissReason.timer) {
                console.log('se cerro el timer')
            }
            })
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire(
            'Cancelado',
            'La compra ha sido cancelada',
            'error'
            )
        }
        })
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

