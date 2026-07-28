// Swiper inicialization
var swiper = new Swiper(".mySwiper-1"  , {
    slidesPerView:1,
    spaceBetween: 30,
    loop:true,
    pagination: {

        el:".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl:".swiper-button-next",
        prevEl:".swiper-button-prev",

    }



}) ;

var swiper = new Swiper(".mySwiper-2"  , {
    slidesPerView:1,
    spaceBetween: 20,
    loop:true,
    loopFillGroupWithBlank:true,
    navigation: {
        nextEl:".swiper-button-next",
        prevEl:".swiper-button-prev",

    },

    breakpoints : {
        0: {
            slidesPerView:1,
        },
        520: {
            slidesPerView:2,
        },
        950: {
            slidesPerView:3,
        }
    }



}) ;

let tabInputs = document.querySelectorAll (".tabInput");

tabInputs.forEach(function(input){ 

input.addEventListener("change", function (){
    let id= input.ariaValueMax;
    let thisSwiper = document.getElementById("swiper" + id);
    thisSwiper.swiper.update();


})


}); 

// Contact form
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

// ===================== CARRITO DE COMPRAS =====================

// Estado del carrito
let cart = [];

// Elementos del carrito
const cartToggle = document.getElementById('cart-toggle');
const cartPanel = document.getElementById('cart-panel');
const cartClose = document.getElementById('cart-close');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const checkoutBtn = document.getElementById('cart-checkout');

// Elementos del modal de dirección
const addressModal = document.getElementById('address-modal');
const addressClose = document.getElementById('address-close');
const addressForm = document.getElementById('address-form');

// Elementos del modal de confirmación
const confirmModal = document.getElementById('confirm-modal');
const confirmClose = document.getElementById('confirm-close');
const confirmDetails = document.getElementById('confirm-details');
const timerCountdown = document.getElementById('timer-countdown');

// Abrir/cerrar carrito
cartToggle.addEventListener('click', () => {
    cartPanel.classList.toggle('active');
});

cartClose.addEventListener('click', () => {
    cartPanel.classList.remove('active');
});

// Cerrar carrito al hacer clic fuera
document.addEventListener('click', (e) => {
    if (!cartPanel.contains(e.target) && e.target !== cartToggle) {
        cartPanel.classList.remove('active');
    }
});

// Añadir producto al carrito
document.querySelectorAll('.btn-add-cart').forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        const name = button.dataset.name;
        const price = parseFloat(button.dataset.price);
        const img = button.dataset.img;

        // Verificar si el producto ya está en el carrito
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name, price, img, quantity: 1 });
        }

        updateCartUI();
        showNotification(`${name} añadido al carrito!`);
    });
});

// Actualizar UI del carrito
function updateCartUI() {
    // Actualizar contador
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Actualizar lista de items
    cartItems.innerHTML = '';
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">El carrito está vacío</p>';
        cartTotal.textContent = '$0.00';
        return;
    }

    let total = 0;
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.img}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <span>$${item.price.toFixed(2)} x ${item.quantity}</span>
                <span class="cart-item-total">$${itemTotal.toFixed(2)}</span>
            </div>
            <button class="cart-remove" data-index="${index}">
                <i class="fas fa-trash-alt"></i>
            </button>
        `;
        cartItems.appendChild(div);
    });

    // Eventos para eliminar items
    document.querySelectorAll('.cart-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index);
            cart.splice(index, 1);
            updateCartUI();
        });
    });

    cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Notificación temporal
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 2000);
}

// Función para cerrar todos los modales
function closeAllModals() {
    addressModal.classList.remove('active');
    confirmModal.classList.remove('active');
}

// Abrir modal de dirección
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        showNotification('El carrito está vacío');
        return;
    }
    addressModal.classList.add('active');
    cartPanel.classList.remove('active');
});

// Cerrar modal de dirección
addressClose.addEventListener('click', closeAllModals);

// Cerrar modal al hacer clic fuera
addressModal.addEventListener('click', (e) => {
    if (e.target === addressModal) closeAllModals();
});

// Enviar dirección
addressForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('address-name').value.trim();
    const street = document.getElementById('address-street').value.trim();
    const city = document.getElementById('address-city').value.trim();
    const phone = document.getElementById('address-phone').value.trim();

    if (!name || !street || !city || !phone) {
        showNotification('Por favor completa todos los campos');
        return;
    }

    // Cerrar modal de dirección
    addressModal.classList.remove('active');

    // Mostrar confirmación
    showConfirmation({ name, street, city, phone });
});

// Mostrar confirmación
function showConfirmation(address) {
    let itemsHTML = cart.map(item => 
        `<li>${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</li>`
    ).join('');

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    confirmDetails.innerHTML = `
        <div class="confirm-address">
            <h4>📦 Datos de envío</h4>
            <p><strong>Nombre:</strong> ${address.name}</p>
            <p><strong>Dirección:</strong> ${address.street}, ${address.city}</p>
            <p><strong>Teléfono:</strong> ${address.phone}</p>
        </div>
        <div class="confirm-items">
            <h4>🛒 Productos</h4>
            <ul>${itemsHTML}</ul>
            <p class="confirm-total"><strong>Total:</strong> $${total.toFixed(2)}</p>
        </div>
    `;

    confirmModal.classList.add('active');

    // Iniciar contador de 15 minutos
    let minutes = 15;
    let seconds = 0;
    timerCountdown.textContent = '15:00';

    const timerInterval = setInterval(() => {
        seconds--;
        if (seconds < 0) {
            minutes--;
            seconds = 59;
        }
        if (minutes < 0) {
            clearInterval(timerInterval);
            timerCountdown.textContent = '¡Listo!';
            return;
        }
        timerCountdown.textContent = 
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);

    // Vaciar carrito después de confirmar
    cart = [];
    updateCartUI();

    // Guardar referencia al intervalo para limpiarlo
    confirmModal._timerInterval = timerInterval;
}

// Cerrar modal de confirmación
confirmClose.addEventListener('click', () => {
    if (confirmModal._timerInterval) {
        clearInterval(confirmModal._timerInterval);
    }
    confirmModal.classList.remove('active');
});

// Cerrar confirmación al hacer clic fuera
confirmModal.addEventListener('click', (e) => {
    if (e.target === confirmModal) {
        if (confirmModal._timerInterval) {
            clearInterval(confirmModal._timerInterval);
        }
        confirmModal.classList.remove('active');
    }
});

// ================================================================