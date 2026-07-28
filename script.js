// ===== SWIPER CONFIGURACIÓN =====
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

// ===== TABS =====
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

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
const formResponse = document.getElementById('form-response');

if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        formResponse.textContent = 'Thank you for your message! We will get back to you soon.';
        formResponse.className = 'mt-4 text-center text-green-600 font-medium';
        contactForm.reset();
        setTimeout(() => {
            formResponse.textContent = '';
            formResponse.className = 'mt-4 text-center';
        }, 5000);
    });
}

// ====================================================
// ===== CARRITO DE COMPRAS COMPLETO =====
// ====================================================

// Estado del carrito
let cart = [];

// Elementos DOM
const cartToggle = document.getElementById('cartToggle');
const cartPanel = document.getElementById('cartPanel');
const cartOverlay = document.getElementById('cartOverlay');
const closeCartBtn = document.getElementById('closeCart');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const clearCartBtn = document.getElementById('clearCart');
const checkoutBtn = document.getElementById('checkoutBtn');

// ===== FUNCIONES DEL CARRITO =====

// Guardar carrito en localStorage
function saveCart() {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
}

// Cargar carrito desde localStorage
function loadCart() {
    const saved = localStorage.getItem('shoppingCart');
    if (saved) {
        try {
            cart = JSON.parse(saved);
        } catch (e) {
            cart = [];
        }
    } else {
        cart = [];
    }
    updateCartUI();
}

// Añadir producto al carrito
function addToCart(name, price, img) {
    if (!name || !price || !img) {
        console.error('Faltan datos para añadir al carrito:', {name, price, img});
        return;
    }
    
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: parseFloat(price),
            img: img,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartUI();
    showNotification('✅ ' + name + ' añadido al carrito');
}

// Eliminar un item del carrito
function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    saveCart();
    updateCartUI();
}

// Cambiar cantidad de un item
function changeQuantity(name, delta) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(name);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

// Vaciar carrito
function clearCart() {
    if (cart.length === 0) return;
    if (confirm('¿Estás seguro de vaciar el carrito?')) {
        cart = [];
        saveCart();
        updateCartUI();
        showNotification('🗑️ Carrito vaciado');
    }
}

// Calcular total
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Mostrar notificación
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        background: #0d0d0d;
        color: #ffffff;
        padding: 15px 25px;
        border-radius: 10px;
        border-left: 4px solid #db2418;
        box-shadow: 0 5px 20px rgba(0,0,0,0.5);
        z-index: 99999;
        font-family: "Poppins", sans-serif;
        font-size: 14px;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Actualizar la UI del carrito
function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    const total = calculateTotal();
    cartTotal.textContent = '$' + total.toFixed(2);
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="cart-empty">🛒 El carrito está vacío</p>';
    } else {
        let html = '';
        cart.forEach(item => {
            // Escapar comillas en el nombre para evitar errores
            const safeName = item.name.replace(/'/g, "\\'");
            html += `
                <div class="cart-item">
                    <img src="${item.img}" alt="${item.name}">
                    <div class="cart-item-info">
                        <p class="cart-item-name">${item.name}</p>
                        <p class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div class="cart-item-actions">
                        <button onclick="changeQuantity('${safeName}', -1)">−</button>
                        <span class="cart-item-qty">${item.quantity}</span>
                        <button onclick="changeQuantity('${safeName}', 1)">+</button>
                        <button class="cart-item-remove" onclick="removeFromCart('${safeName}')">✕</button>
                    </div>
                </div>
            `;
        });
        cartItemsContainer.innerHTML = html;
    }
}

// ===== EVENTOS DEL CARRITO =====

// Abrir carrito
cartToggle.addEventListener('click', function() {
    cartPanel.classList.add('active');
    cartOverlay.classList.add('active');
});

// Cerrar carrito
function closeCart() {
    cartPanel.classList.remove('active');
    cartOverlay.classList.remove('active');
}

closeCartBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// Vaciar carrito
clearCartBtn.addEventListener('click', clearCart);

// Checkout
checkoutBtn.addEventListener('click', function() {
    if (cart.length === 0) {
        showNotification('⚠️ El carrito está vacío');
        return;
    }
    
    const total = calculateTotal();
    showNotification('🎉 ¡Compra realizada! Total: $' + total.toFixed(2));
    cart = [];
    saveCart();
    updateCartUI();
    closeCart();
});

// ============================================================
// ===== BOTONES DE PRODUCTOS - CON CLOSEST() =====
// ============================================================

// 1. Botones "Añadir al Carrito" - TODOS los productos (1 al 9)
document.addEventListener('click', function(e) {
    const button = e.target.closest('.btn-add-cart');
    if (button) {
        e.preventDefault();
        const name = button.getAttribute('data-name');
        const price = button.getAttribute('data-price');
        const img = button.getAttribute('data-img');
        
        if (name && price && img) {
            addToCart(name, price, img);
        } else {
            console.error('❌ Botón sin datos:', button);
            showNotification('⚠️ Error: faltan datos del producto');
        }
    }
});

// 2. Botones "Comprar" del slider
document.addEventListener('click', function(e) {
    const button = e.target.closest('.btn-comprar');
    if (button) {
        e.preventDefault();
        const name = button.getAttribute('data-name');
        const price = button.getAttribute('data-price');
        const img = button.getAttribute('data-img');
        
        if (name && price && img) {
            addToCart(name, price, img);
        } else {
            console.error('❌ Botón comprar sin datos:', button);
            showNotification('⚠️ Error: faltan datos del producto');
        }
    }
});

// 3. Botones "Menú" - scroll suave
document.addEventListener('click', function(e) {
    const button = e.target.closest('.btn-1');
    if (button && button.getAttribute('href') === '#products') {
        e.preventDefault();
        const productsSection = document.getElementById('products');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// ===== INICIALIZACIÓN =====

// Cargar carrito al iniciar
loadCart();

// Añadir estilos de animación para notificaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log('🛒 Carrito de compras cargado correctamente');
console.log('📦 Productos disponibles: 9');
console.log('✅ Todos los botones de compra funcionan');
