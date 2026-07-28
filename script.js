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

// Actualizar la UI del carrito
function updateCartUI() {
    // Actualizar contador
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Actualizar lista de items
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="cart-empty">🛒 El carrito está vacío</p>';
    } else {
        let html = '';
        cart.forEach(item => {
            html += `
                <div class="cart-item">
                    <img src="${item.img}" alt="${item.name}">
                    <div class="cart-item-info">
                        <p class="cart-item-name">${item.name}</p>
                        <p class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div class
