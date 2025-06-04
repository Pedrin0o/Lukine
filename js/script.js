// Splash Screen (3 segundos)
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const splash = document.querySelector('.splash-screen');
        if (splash) splash.style.display = 'none';
    }, 3000);

    // Menu Hamburguer (Mobile)
    document.querySelector('.hamburger')?.addEventListener('click', () => {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) navLinks.classList.toggle('active');
    });

    // Slider do Banner
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slider img');
    
    if (slides.length > 0) {
        function showSlide(n) {
            slides.forEach(slide => slide.style.display = 'none');
            currentSlide = (n + slides.length) % slides.length;
            slides[currentSlide].style.display = 'block';
        }

        function nextSlide() {
            showSlide(currentSlide + 1);
        }

        // Inicializa o slider
        showSlide(0);
        setInterval(nextSlide, 10000);
    }

    // Newsletter Form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = e.target.querySelector('input[type="email"]');
            if (emailInput) {
                alert(`Obrigado por assinar nossa newsletter! E-mail registrado: ${emailInput.value}`);
                e.target.reset();
            }
        });
    }

    // Verifica autenticação (apenas se auth estiver definido)
    if (typeof auth !== 'undefined') {
        auth.onAuthStateChanged((user) => {
            if (!user && !window.location.pathname.includes('login.html')) {
                window.location.href = 'login.html';
            }
        });
    }
});