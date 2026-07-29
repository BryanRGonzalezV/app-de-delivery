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

        const contactForm = document.getElementById('contactForm');
        const formResponse = document.getElementById('form-response');

        if (contactForm) {
            contactForm.addEventListener('submit', function(event) {
                event.preventDefault(); // Prevent default form submission

                // Get form data (optional, for more complex handling)
                // const formData = new FormData(contactForm);
                // const name = formData.get('name');
                // const email = formData.get('email');
                // const message = formData.get('message');
                // console.log('Form submitted:', { name, email, message });

                formResponse.textContent = 'Thank you for your message! We will get back to you soon.';
                formResponse.className = 'mt-4 text-center text-green-600 font-medium'; // Success message style
                contactForm.reset(); // Clear the form

                // Remove the message after a few seconds
                setTimeout(() => {
                    formResponse.textContent = '';
                    formResponse.className = 'mt-4 text-center';
                }, 5000);
            });
        }

// ==================== CARRITO DE COMPRAS ====================

let cart = [];

// Elementos del DOM
const cartButton = document.getElementById('cartButton');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const closeCheckout = document.getElementById('closeCheckout');
const checkoutForm = document.getElementById('checkoutForm');
const orderModal = document.getElementById('orderModal');
const orderDetails = document.getElementById('orderDetails');
const timerDisplay = document.getElementById('timerDisplay');
const timerProgress = document.getElementById('timerProgress');
const closeOrder = document.getElementById('closeOrder');

// Función para actualizar el carrito
function updateCart() {
    // Actualizar contador
    cartCount.textContent = cart.length;
    
    // Actualizar vista del carrito
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>El carrito está vacío</p>';
        cartTotal.innerHTML = '<strong>Total: $0.00</strong>';
        checkoutBtn.disabled = true;
        checkoutBtn.style.opacity = '0.5';
        checkoutBtn.style.cursor = 'not-allowed';
        return;
    }
    
    checkoutBtn.disabled = false;
    checkoutBtn.style.opacity = '1';
    checkoutBtn.style.cursor = 'pointer';
    
    let html = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        total += parseFloat(item.price);
        html += `
            <div class="cart-item">
                <span class="cart-item-name">${item.name}</span>
                <span class="cart-item-price">$${item.price}</span>
                <button class="cart-item-remove" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    });
    
    cartItems.innerHTML = html;
    cartTotal.innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;
    
    // Eventos para eliminar items
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            cart.splice(index, 1);
            updateCart();
        });
    });
}

// Función para agregar al carrito
function addToCart(name, price) {
    cart.push({ name, price });
    updateCart();
    // Animación del botón del carrito
    cartButton.style.transform = 'scale(1.2)';
    setTimeout(() => {
        cartButton.style.transform = 'scale(1)';
    }, 300);
}

// Eventos de los botones "Añadir al carrito"
document.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const name = this.dataset.name;
        const price = this.dataset.price;
        addToCart(name, price);
        
        // Feedback visual
        const originalText = this.textContent;
        this.textContent = '✓ Añadido';
        this.style.backgroundColor = '#28a745';
        setTimeout(() => {
            this.textContent = originalText;
            this.style.backgroundColor = '';
        }, 1500);
    });
});

// Abrir carrito
cartButton.addEventListener('click', function() {
    cartModal.style.display = 'block';
});

// Cerrar carrito
closeCart.addEventListener('click', function() {
    cartModal.style.display = 'none';
});

// Cerrar carrito al hacer clic fuera
window.addEventListener('click', function(e) {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
    if (e.target === checkoutModal) {
        checkoutModal.style.display = 'none';
    }
});

// Abrir checkout
checkoutBtn.addEventListener('click', function() {
    if (cart.length === 0) return;
    cartModal.style.display = 'none';
    checkoutModal.style.display = 'block';
});

// Cerrar checkout
closeCheckout.addEventListener('click', function() {
    checkoutModal.style.display = 'none';
});

// Procesar pedido
checkoutForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const postal = document.getElementById('postal').value;
    
    // Cerrar checkout
    checkoutModal.style.display = 'none';
    
    // Mostrar confirmación del pedido
    let orderHtml = '<h3>¡Pedido Realizado con Éxito!</h3>';
    orderHtml += '<div class="order-address">';
    orderHtml += `<p><strong>Dirección:</strong> ${address}</p>`;
    orderHtml += `<p><strong>Ciudad:</strong> ${city}</p>`;
    orderHtml += `<p><strong>Código Postal:</strong> ${postal}</p>`;
    orderHtml += '</div>';
    
    // Lista de productos
    orderHtml += '<div class="order-products"><strong>Productos:</strong><ul>';
    cart.forEach(item => {
        orderHtml += `<li>${item.name} - $${item.price}</li>`;
    });
    orderHtml += '</ul></div>';
    
    // Total
    let total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);
    orderHtml += `<p class="order-total"><strong>Total: $${total.toFixed(2)}</strong></p>`;
    
    orderDetails.innerHTML = orderHtml;
    orderModal.style.display = 'block';
    
    // Iniciar temporizador
    let timeLeft = 30;
    timerDisplay.textContent = timeLeft;
    timerProgress.style.width = '100%';
    
    const timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        timerProgress.style.width = (timeLeft / 30 * 100) + '%';
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerDisplay.textContent = '0';
            timerProgress.style.width = '0%';
            timerProgress.style.backgroundColor = '#dc3545';
        }
    }, 1000);
    
    // Vaciar carrito
    cart = [];
    updateCart();
});

// Cerrar modal de pedido
closeOrder.addEventListener('click', function() {
    orderModal.style.display = 'none';
    // Resetear timer
    timerDisplay.textContent = '30';
    timerProgress.style.width = '100%';
    timerProgress.style.backgroundColor = '#db2418';
});

// Inicializar carrito
updateCart();

// Estilos para el timer (añadidos dinámicamente)
const style = document.createElement('style');
style.textContent = `
    .timer-bar {
        width: 100%;
        height: 8px;
        background-color: #ddd;
        border-radius: 4px;
        margin-top: 10px;
        overflow: hidden;
    }
    .timer-progress {
        height: 100%;
        background-color: #db2418;
        border-radius: 4px;
        transition: width 1s linear;
        width: 100%;
    }
    .order-timer {
        margin: 20px 0;
        text-align: center;
    }
    #timerDisplay {
        font-size: 24px;
        font-weight: bold;
        color: #db2418;
    }
`;
document.head.appendChild(style);
