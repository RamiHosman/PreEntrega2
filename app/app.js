import * as data from "./data.js";

// Función para mostrar los productos dependiendo su contenedor: mate, termo o bombilla
function mostrarProductos(contenedor, productos) {
  const contenedorProductos = document.querySelector(contenedor);

  productos.forEach((producto) => {
    const productoDiv = document.createElement("div");
    productoDiv.classList.add("product");

    productoDiv.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p>Precio: $${producto.precio}</p>
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <button class="agregar-carrito-btn" data-nombre="${producto.nombre}" data-precio="${producto.precio}">Agregar al Carrito</button>
        `;

    contenedorProductos.appendChild(productoDiv);

    // Agregar un EventListener a cada botón "AgregarAlCarrito"
    productoDiv
      .querySelector(".agregar-carrito-btn")
      .addEventListener("click", () => {
        agregarAlCarrito(producto.nombre, producto.precio);
      });
  });
}

function agregarAlCarrito(nombre, precio) {
  const carritoItems = document.getElementById("carrito-items");
  const nuevoItem = document.createElement("div");
  nuevoItem.classList.add("cart-item");
  nuevoItem.dataset.precio = precio;
  nuevoItem.innerHTML = `<p>${nombre} - $${precio}</p>`;
  carritoItems.appendChild(nuevoItem);

  // Guardar el producto en el localStorage
  const producto = { nombre, precio };
  const carrito = obtenerCarritoDelLocalStorage();
  carrito.push(producto);
  guardarCarritoEnLocalStorage(carrito);

  // Mostrar el total después de agregar el producto al carrito
  mostrarTotal();
}

// Función para vaciar el carrito y eliminar los productos del localStorage
function vaciarCarrito() {
  const carritoItems = document.getElementById("carrito-items");
  carritoItems.innerHTML = "";
  localStorage.removeItem("carrito");

  const totalElement = document.querySelector("span");
  if (totalElement) {
    totalElement.remove();
    localStorage.removeItem("totalAPagar");
  }
}

// Función para mostrar/ocultar el carrito
function toggleCarrito() {
  const carrito = document.getElementById("carrito");
  carrito.style.display = carrito.style.display === "block" ? "none" : "block";
}

// Agrega un event listener para el evento de clic en el icono del carrito
document.querySelector(".cart-icon").addEventListener("click", toggleCarrito);

// Agrega un event listener para el evento de clic en el botón "Vaciar Carrito"
document
  .getElementById("vaciar-carrito-btn")
  .addEventListener("click", vaciarCarrito);

// Función para calcular el total del carrito
function calcularTotal() {
  const carritoItems = document.querySelectorAll(".cart-item");
  let total = 0;
  carritoItems.forEach((item) => {
    const precio = parseFloat(item.dataset.precio || 0);
    total += precio;
  });
  return total;
}

// Función para mostrar el total a pagar junto al botón "Vaciar Carrito"
function mostrarTotal() {
  const total = calcularTotal();
  const totalElement = document.querySelector(".cart-total");
  if (totalElement) {
    totalElement.textContent = `Total a pagar: $${total.toFixed(2)}`;
  } else {
    const nuevoTotalElement = document.createElement("span");
    nuevoTotalElement.textContent = `Total a pagar: $${total.toFixed(2)}`;
    nuevoTotalElement.classList.add("cart-total");
    const vaciarCarritoBtn = document.getElementById("vaciar-carrito-btn");
    vaciarCarritoBtn.insertAdjacentElement("afterend", nuevoTotalElement);
  }
}


// Función para guardar el carrito en el localStorage
function guardarCarritoEnLocalStorage(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  // Agregar el total a pagar al localStorage
  const total = calcularTotal();
  localStorage.setItem("totalAPagar", total.toFixed(2));
}

// Función para obtener el carrito del localStorage
function obtenerCarritoDelLocalStorage() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  return carrito;
}

// Función para cargar los productos del localStorage al cargar la página
function cargarProductosDelLocalStorage() {
  const carritoItems = document.getElementById("carrito-items");
  const carrito = obtenerCarritoDelLocalStorage();
  carritoItems.innerHTML = "";
  carrito.forEach((producto) => {
    const nuevoItem = document.createElement("div");
    nuevoItem.classList.add("cart-item");
    nuevoItem.dataset.precio = producto.precio;
    nuevoItem.innerHTML = `<p>${producto.nombre} - $${producto.precio}</p>`;
    carritoItems.appendChild(nuevoItem);
  });

  // Mostrar el total después de cargar los productos del carrito desde el localStorage
  mostrarTotal();
}


// Llama a la función para cargar los productos del localStorage al cargar la página
window.addEventListener("load", cargarProductosDelLocalStorage);

// Muestra los productos de mates, termos y bombillas
mostrarProductos(".mates-container", data.mates);
mostrarProductos(".termos-container", data.termos);
mostrarProductos(".bombillas-container", data.bombillas);
