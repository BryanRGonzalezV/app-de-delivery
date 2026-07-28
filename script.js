// ============ SWIPER CONFIGURACIÓN ============
var swiper = new Swiper(".mySwiper-1", {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    }
});

var swiper = new Swiper(".mySwiper-2", {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    loopFillGroupWithBlank: true,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    breakpoints: {
        0: { slidesPerView: 1 },
        520: { slidesPerView: 2 },
        950: { slidesPerView: 3 }
    }
});

// ============ TABS ============
let tabInputs = document.querySelectorAll(".tabInput");
tabInputs.forEach(function(input) {
    input.addEventListener("change", function() {
        let id = input.value;
        let thisSwiper = document.getElementById("swiper" + id);
        if (thisSwiper && thisSwiper.swiper) {
            thisSwiper.swiper.update();
        }
    });
});

// ============ CARRITO DE COMPRAS ============
let cart = [];
let cartCount = 0;
let cartTotal = 0;

// Elementos del DOM
const cartOverlay = document.getElementById('cartOverlay');
const cartSidebar = document.getElementById('cartSidebar');
const cartItems = document.getElementById('cartItems');
const cartTotalElement = document.getElementById('cartTotal');
const cartCountElement = document.getElementById('cartCount');
const cartFloatBtn = document.getElementById('cartFloatBtn');
const closeCartBtn = document.getElementById('closeCart');
const checkoutBtn = document.getElementById('checkoutBtn');

// Modal elementos
const checkoutModal = document.getElementById('checkoutModal');
const closeModalBtn = document.getElementById('closeModal');
const checkoutForm = document.getElementById('checkoutForm');
const checkoutFormContainer = document.getElementById('checkoutFormContainer');
const orderConfirmation = document.getElementById('orderConfirmation');
const orderDetails = document.getElementById('orderDetails');
const closeConfirmBtn = document.getElementById('closeConfirmBtn');

// ============ FUNCIONES DEL CARRITO ============

// Agregar producto al carrito
function addToCart(productName, productPrice) {
    // Buscar si el producto ya existe en el carrito
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: parseFloat(productPrice),
            quantity: 1
        });
    }
    
    updateCart();
    showCart();
}

// Eliminar producto del carrito
function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    updateCart();
}

// Actualizar cantidad de un producto
function updateQuantity(productName, change) {
    const item = cart.find(item => item.name === productName);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productName);
        } else {
            updateCart();
        }
    }
}

// Actualizar la interfaz del carrito
function updateCart() {
    cartItems.innerHTML = '';
    cartTotal = 0;
    cartCount = 0;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart-msg">El carrito está vacío</p>';
    } else {
        cart.forEach(item => {
            cartCount += item.quantity;
            cartTotal += item.price * item.quantity;
            
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.innerHTML = `
                <div class="cart-item-info">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-price">$${item.price.toFixed(2)} c/u</span>
                </div>
                <div class="cart-item-actions">
                    <button onclick="updateQuantity('${item.name}', -1)">-</button>
                    <span class="cart-item-qty">${item.quantity}</span>
                    <button onclick="updateQuantity('${item.name}', 1)">+</button>
                    <button class="cart-item-remove" onclick="removeFromCart('${item.name}')">✕</button>
                </div>
            `;
            cartItems.appendChild(itemDiv);
        });
    }
    
    // Actualizar total y contador
    cartTotalElement.textContent = `$${cartTotal.toFixed(2)}`;
    cartCountElement.textContent = cartCount;
    
    // Guardar en localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Mostrar/ocultar carrito
function showCart() {
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideCart() {
    cartOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ============ EVENTOS DEL CARRITO ============

// Botones "Agregar al carrito"
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const product = this.closest('.product');
        const name = product.getAttribute('data-name') || product.querySelector('.product-txt h4').textContent;
        const priceText = product.querySelector('.price').textContent;
        const price = parseFloat(priceText.replace('$', '').replace(',', ''));
        addToCart(name, price);
        
        // Animación de feedback
        this.textContent = '✓ Agregado';
        this.style.backgroundColor = '#28a745';
        this.style.borderColor = '#28a745';
        setTimeout(() => {
            this.textContent = 'Agregar';
            this.style.backgroundColor = '';
            this.style.borderColor = '';
        }, 1500);
    });
});

// Abrir carrito
cartFloatBtn.addEventListener('click', showCart);

// Cerrar carrito
closeCartBtn.addEventListener('click', hideCart);

// Cerrar carrito al hacer clic fuera
cartOverlay.addEventListener('click', function(e) {
    if (e.target === this) {
        hideCart();
    }
});

// ============ PROCESO DE COMPRA ============

// Abrir modal de checkout
checkoutBtn.addEventListener('click', function() {
    if (cart.length === 0) {
        alert('El carrito está vacío. Agrega productos antes de comprar.');
        return;
    }
    hideCart();
    checkoutModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Resetear formulario
    checkoutForm.reset();
    checkoutFormContainer.style.display = 'block';
    orderConfirmation.style.display = 'none';
});

// Cerrar modal
closeModalBtn.addEventListener('click', function() {
    checkoutModal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

// Cerrar modal al hacer clic fuera
checkoutModal.addEventListener('click', function(e) {
    if (e.target === this) {
        checkoutModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Cerrar confirmación
closeConfirmBtn.addEventListener('click', function() {
    checkoutModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    // Vaciar carrito después de la compra
    cart = [];
    updateCart();
});

// Enviar formulario de compra
checkoutForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Obtener datos del formulario
    const nombre = document.getElementById('dirNombre').value.trim();
    const calle = document.getElementById('dirCalle').value.trim();
    const ciudad = document.getElementById('dirCiudad').value.trim();
    const telefono = document.getElementById('dirTelefono').value.trim();
    const notas = document.getElementById('dirNotas').value.trim();
    
    // Validar campos
    if (!nombre || !calle || !ciudad || !telefono) {
        alert('Por favor, completa todos los campos obligatorios.');
        return;
    }
    
    // Mostrar confirmación
    checkoutFormContainer.style.display = 'none';
    orderConfirmation.style.display = 'block';
    
    // Mostrar detalles del pedido
    let productosHtml = '';
    cart.forEach(item => {
        productosHtml += `<p>• ${item.name} x${item.quantity} = $${(item.price * item.quantity).toFixed(2)}</p>`;
    });
    
    orderDetails.innerHTML = `
        <p><strong>Cliente:</strong> ${nombre}</p>
        <p><strong>Dirección:</strong> ${calle}, ${ciudad}</p>
        <p><strong>Teléfono:</strong> ${telefono}</p>
        ${notas ? `<p><strong>Notas:</strong> ${notas}</p>` : ''}
        <hr style="border-color: #333; margin: 12px 0;">
        <p><strong>Productos:</strong></p>
        ${productosHtml}
        <hr style="border-color: #333; margin: 12px 0;">
        <p><strong>Total:</strong> $${cartTotal.toFixed(2)}</p>
    `;
});

// ============ CONTACTO FORM ============
const contactForm = document.getElementById('contactForm');
const formResponse = document.getElementById('form-response');

if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        formResponse.textContent = '¡Gracias por tu mensaje! Te contactaremos pronto.';
        formResponse.className = 'mt-4 text-center text-green-600 font-medium';
        contactForm.reset();
        
        setTimeout(() => {
            formResponse.textContent = '';
            formResponse.className = 'mt-4 text-center';
        }, 5000);
    });
}

// ============ CARGAR CARRITO DESDE LOCALSTORAGE ============
window.addEventListener('DOMContentLoaded', function() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
            updateCart();
        } catch (e) {
            console.log('Error al cargar el carrito');
        }
    }
});

// ============ TECLADO: ESC para cerrar ============
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (cartOverlay.classList.contains('active')) {
            hideCart();
        }
        if (checkoutModal.classList.contains('active')) {
            checkoutModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
});
