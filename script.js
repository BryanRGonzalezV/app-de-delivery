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
